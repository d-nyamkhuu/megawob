// Invoice design: early date icons, dense forms, a ruled receipt layout, and the fixed paper fit.
env.widget({
  task: 'fill-form',
  site: 'design-fill-form-invoice-11',
  name: 'design',
  split: 'train',
  scenarios: ['invoice'],
  scrollable: false,
  template: 'fill-form/document',
  design: {
    paper: '#ffffff',
    ink: 'var(--accent)',
    listAvoidSubmit: true,
    dateIcon: {
      cls: 'ff-date-icon',
      host: 'box',
      early: true,
      svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><rect x="3" y="5" width="18" height="17" rx="1"/><path d="M3 10h18M7 2v6M17 2v6"/></svg>',
    },
    parts: {
      grid: () => (grid, form, pane, spec) => {
        grid.classList.toggle('ff-dense', spec.fields.length > 8);
      },
      rootReady: (base) => (ctx, R) => {
        R.root.style.fontSize = '21px';
        R.root.style.margin = '0';
        R.root.style.setProperty('--ff-paper', '#ffffff');
        R.root.style.setProperty('--ff-ink', 'var(--accent)');
      },
      fieldWrap: () => () => {},
      arranged: () => () => {},
      anchors: () => (ctx, R) => [R.root],
      sheetHeader: (base) => (util, inv, d) => {
        base(util, inv, d);
        const head = inv.firstElementChild;
        head.children[0].classList.add('ff-vendor');
        head.children[1].classList.add('ff-details');
      },
      renderInvoice: (base) => (util, pane, d, rng) => {
        if (d.style !== 'receipt') return base(util, pane, d, rng);

        const r = util.el('div', 'ff-invoice ff-receipt-layout ff-paper', pane);
        r.style.boxShadow = 'none';
        r.style.filter = 'drop-shadow(0 4px 10px rgba(0,0,0,.18))';
        const head = util.el('div', 'ff-invhead', r);
        const vendor = util.el('div', 'ff-vendor', head);
        util.el('div', 'ff-vname', vendor, d.vendor.name);
        util.el('div', 'ff-vaddr', vendor, `${d.vendor.addr.join('\n')}\nTel ${d.vendor.phone}`);
        const details = util.el('div', 'ff-details', head);
        util.el('div', 'ff-invtitle', details, d.title || 'RECEIPT');
        const meta = util.el('table', 'ff-meta', details);
        for (const m of d.meta) {
          const row = util.el('tr', '', meta);
          util.el('td', '', row, m.label);
          util.el('td', '', row, m.value);
        }
        const items = util.el('table', 'ff-items', r);
        const header = util.el('tr', '', items);
        ['Description', 'Qty', 'Unit Price', 'Amount'].forEach((label, i) =>
          util.el('th', i ? 'num' : '', header, label),
        );
        for (const it of d.items) {
          const row = util.el('tr', '', items);
          util.el('td', '', row, it.desc);
          util.el('td', 'num', row, String(it.qty));
          util.el('td', 'num', row, it.unit);
          util.el('td', 'num', row, it.amount);
        }
        const totals = util.el('table', 'ff-totals', r);
        for (const t of d.totals) {
          const row = util.el('tr', t.strong ? 'strong' : '', totals);
          util.el('td', '', row, t.label);
          util.el('td', '', row, t.value);
        }
        if (d.payLine) {
          const row = util.el('tr', '', totals);
          util.el('td', '', row, d.payLine.label);
          util.el('td', '', row, d.payLine.value);
          if (d.payLine.change) {
            const change = util.el('tr', '', totals);
            util.el('td', '', change, 'CHANGE');
            util.el('td', '', change, d.payLine.change);
          }
        }
        if (d.currencyNote) util.el('div', 'ff-notes', r, d.currencyNote);
        for (const note of d.notes) util.el('div', 'ff-notes', r, note);
        return r;
      },
      fit: () => (ctx, R) => {
        const { root, docPane } = R;
        const paper = docPane.firstElementChild;
        if (paper) {
          let docSize = parseFloat(getComputedStyle(docPane).fontSize);
          for (let pass = 0; pass < 40; pass++) {
            const height = paper.getBoundingClientRect().height;
            const available = docPane.clientHeight;
            if (height <= available + 1 || docSize <= 8) break;
            docSize -= 0.25;
            docPane.style.fontSize = docSize + 'px';
          }
        }
        docPane.style.setProperty('--u', 'min(.05981cqw,.11416cqh)');
        const maxH = Math.max(1, ctx.size.height - 12);
        let scale = Math.min(1, ctx.size.width / ctx.stage.parentElement.clientWidth);
        if (scale < 1) {
          root.style.setProperty('--u', `calc(${scale} * min(.05981cqw,.11416cqh))`);
          root.style.fontSize = (21 * scale) + 'px';
        }
        for (let pass = 0; pass < 8; pass++) {
          const rect = root.getBoundingClientRect();
          if (rect.height <= maxH && root.scrollWidth <= ctx.size.width + 1) break;
          scale *= Math.min(0.98, maxH / Math.max(1, rect.height), (ctx.size.width - 4) / Math.max(1, root.scrollWidth));
          root.style.setProperty('--u', `calc(${scale} * min(.05981cqw,.11416cqh))`);
          root.style.fontSize = (21 * scale) + 'px';
        }
      },
      renderStandard: (base, S) => (ctx) => {
        // Bootstrap the template's private episode state without adding draws to this page's RNG stream.
        const bootstrapRng = {
          float: () => 0,
          int: (lo) => lo,
          bool: () => false,
          pick: (xs) => xs[0],
          fork: (label) => ctx.rng.fork(label),
        };
        base({ ...ctx, rng: bootstrapRng });
        const { util, rng, spec } = ctx;
        const state = S.st;
        state.ctx = ctx;
        state.spec = spec;
        state.el = {};
        state.tabs = null;
        state.root.remove();

        const L = spec.layout;
        const root = util.el('div', 'ff-root' + (L.tabs ? ' tabs' : ''), ctx.stage);
        state.root = root;
        root.style.fontSize = '21px';
        root.style.setProperty('--ff-paper', '#ffffff');
        root.style.setProperty('--ff-ink', 'var(--accent)');
        const R = { root };
        S.P.rootReady(ctx, R);
        let docPane;
        let formPane;
        let tabbar = null;
        if (L.tabs) {
          tabbar = util.el('div', 'ff-tabs', root);
          const docTab = util.el('button', 'ff-tab', tabbar, L.tabLabels[0]);
          const formTab = util.el('button', 'ff-tab', tabbar, L.tabLabels[1]);
          const panels = util.el('div', 'ff-panels', root);
          docPane = util.el('div', 'ff-docpane ff-panel', panels);
          formPane = util.el('div', 'ff-formpane ff-panel', panels);
          state.tabs = env.ui.tabs([docTab, formTab], [docPane, formPane], {
            keys: ['doc', 'form'],
            value: ctx.model.tab || 'form',
            show: (panel, visible) => panel.classList.toggle('off', !visible),
            onChange: (key) => ctx.update({ ...ctx.model, tab: key, seen: ctx.model.seen || key === 'doc', open: null }),
          });
        } else {
          docPane = util.el('div', 'ff-docpane', root);
          formPane = util.el('div', 'ff-formpane', root);
        }
        docPane.dataset.role = 'document';
        Object.assign(R, { docPane, formPane, tabbar });
        S.P.panes(ctx, R);
        S.P.renderDoc(util, docPane, spec.doc, rng);
        S.P.beforeForm(ctx, R);
        R.form = S.P.renderForm(util, formPane, spec, ctx.model, rng.fork('form'));
        if (L.tabs && spec.fields.length > 5) {
          formPane.querySelector('.ff-grid').style.setProperty('grid-template-columns', '1fr 1fr', 'important');
        }
        S.P.arranged(ctx, R);
        const paper = docPane.firstElementChild;
        if (paper) {
          let docSize = parseFloat(getComputedStyle(docPane).fontSize);
          for (let pass = 0; pass < 40; pass++) {
            const height = paper.getBoundingClientRect().height;
            const available = docPane.clientHeight;
            if (height <= available + 1 || docSize <= 8) break;
            docSize -= 0.25;
            docPane.style.fontSize = docSize + 'px';
          }
        }
        S.P.showTab(ctx, R);
        S.P.fit(ctx, R);
        S.P.finished(ctx, R);
        return {
          anchors: S.P.anchors(ctx, R),
          sync(model) {
            for (const [id, entry] of Object.entries(state.el)) S.P.syncField(id, entry, model);
          },
        };
      },
    },
  },
});
