/* fill-form/_document-page: document template parts, installed in order with the live template scope. */
(function () {
  'use strict';
  function installPage(BASE, scope) {
    BASE.stageBox = (ctx) => {
      let { width, height } = ctx.size;
      let host = ctx.stage;
      if (width < 240 && ctx.stage.parentElement) {
        const p = ctx.stage.parentElement;
        width = p.clientWidth;
        for (const c of p.children) {
          if (c === ctx.stage) continue;
          const cs = getComputedStyle(c);
          width -= c.getBoundingClientRect().width + parseFloat(cs.marginLeft) + parseFloat(cs.marginRight);
        }
        width -= 8; // room for a page scrollbar
        host = ctx.util.el('div', '', ctx.stage);
        host.style.cssText = `width:${Math.floor(width)}px;display:flex;align-items:flex-start;justify-content:center;`;
      }
      if (height < 240) height = Math.max(240, window.innerHeight - ctx.stage.getBoundingClientRect().top);
      return { width, height, host };
    };

    // ------------------------------------------------------------ page

    BASE.begin = (ctx) => {
      if (!scope.D.modalControls) return;
      const controls = ctx.util.el('div', 'ds-modal-controls', ctx.stage);
      ['−', '□', '×'].forEach((t) => {
        const b = ctx.util.el('button', '', controls, t);
        b.type = 'button';
      });
    };
    BASE.rootReady = () => {};
    BASE.panes = () => {};
    BASE.beforeForm = () => {};
    BASE.arranged = () => {};
    BASE.scaled = () => {};
    BASE.finished = () => {};

    BASE.showTab = (ctx, R) => {
      if (!ctx.spec.layout.tabs) return;
      R.docPane.classList.toggle('off', (ctx.model.tab || 'form') !== 'doc');
      R.formPane.classList.toggle('off', (ctx.model.tab || 'form') !== 'form');
    };

    BASE.anchors = (ctx, R) => (scope.D.layout === 'standard' ? (ctx.spec.layout.tabs ? [R.root, R.tabbar] : [R.root, R.docPane, R.formPane]) : [R.root]);

    BASE.syncField = (id, x, m) => {
      if (x.input && x.input.value !== String(m.fields[id] ?? '')) x.input.value = m.fields[id] ?? '';
    };


  }

  function installCompact(BASE, scope) {
    const fitCompact = (ctx, R) => {
      const { root } = R;
      let fs = scope.D.fitStart;
      const maxH = ctx.size.height - scope.D.fitReserve;
      for (; fs >= 8; fs -= 0.5) {
        root.style.fontSize = fs + 'px';
        if (root.offsetHeight <= maxH && root.scrollWidth <= ctx.size.width + 1) break;
      }
      const rr = root.getBoundingClientRect();
      const ratio = Math.min(1, (maxH - 4) / rr.height, (ctx.size.width - 4) / rr.width);
      if (ratio < 0.98) {
        root.style.transformOrigin = 'top left';
        root.style.transform = `scale(${ratio})`;
        scope.P.scaled(ctx, R, ratio);
      }
    };

    BASE.renderCompact = (ctx) => {
      scope.ensureStyle();
      const { util, rng, spec } = ctx;
      scope.P.begin(ctx);
      scope.st = { ctx, spec, el: {}, tabs: null };
      const L = spec.layout;
      const root = util.el('div', 'ff-root' + (L.tabs ? ' tabs' : ''), ctx.stage);
      scope.st.root = root;
      root.style.fontSize = scope.D.rootFont;
      root.style.setProperty('--ff-paper', scope.D.paper);
      root.style.setProperty('--ff-ink', scope.D.ink);
      const R = { root };
      scope.P.rootReady(ctx, R);
      let docPane;
      let formPane;
      let tabbar = null;
      if (L.tabs) {
        tabbar = util.el('div', 'ff-tabs', root);
        const a = util.el('button', 'ff-tab', tabbar, L.tabLabels[0]);
        const b = util.el('button', 'ff-tab', tabbar, L.tabLabels[1]);
        const ps = util.el('div', 'ff-panels', root);
        docPane = util.el('div', 'ff-docpane ff-panel', ps);
        formPane = util.el('div', 'ff-formpane ff-panel', ps);
        scope.st.tabs = env.ui.tabs([a, b], [docPane, formPane], {
          keys: ['doc', 'form'],
          value: ctx.model.tab || 'form',
          show: (p, v) => p.classList.toggle('off', !v),
          onChange: (k) => ctx.update({ ...ctx.model, tab: k, seen: ctx.model.seen || k === 'doc', open: null }),
        });
      } else {
        docPane = util.el('div', 'ff-docpane', root);
        formPane = util.el('div', 'ff-formpane', root);
      }
      docPane.dataset.role = 'document';
      Object.assign(R, { docPane, formPane, tabbar });
      scope.P.panes(ctx, R);
      scope.P.renderDoc(util, docPane, spec.doc, rng);
      scope.P.beforeForm(ctx, R);
      R.form = scope.P.renderForm(util, formPane, spec, ctx.model, rng.fork('form'));
      if (L.tabs && spec.fields.length > 5 && scope.D.tabsGrid) {
        formPane.querySelector('.ff-grid').style.setProperty('grid-template-columns', scope.D.tabsGrid, 'important');
      }
      scope.P.arranged(ctx, R);
      scope.P.showTab(ctx, R);
      scope.P.fit(ctx, R);
      scope.P.finished(ctx, R);
      return {
        anchors: scope.P.anchors(ctx, R),
        sync(m) {
          for (const [id, x] of Object.entries(scope.st.el)) scope.P.syncField(id, x, m);
        },
      };
    };

    // Standard: the font starts as large as fits (each panel within the stage height, no horizontal overflow);
    // long forms keep a readable size and let the page scroll instead.
    return fitCompact;

  }

  function installStandard(BASE, scope) {
    const fitStandard = (ctx, R) => {
      const { root, docPane, formPane, availH } = R;
      const L = ctx.spec.layout;
      let fs = L.long ? ctx.rng.pick([14.5, 15, 15.5]) : Math.max(12, Math.min(17.5, availH / 40));
      const fitsPane = (el) => el.offsetHeight <= availH && el.scrollWidth <= el.clientWidth + 1;
      const fits = () => {
        if (L.long) return docPane.scrollWidth <= docPane.clientWidth + 1 && formPane.scrollWidth <= formPane.clientWidth + 1;
        return fitsPane(docPane) && fitsPane(formPane);
      };
      for (;;) {
        root.style.fontSize = fs + 'px';
        if (fits() || fs <= 9) break;
        fs -= 0.5;
      }
    };

    BASE.renderStandard = (ctx) => {
      scope.ensureStyle();
      const { util, rng, spec } = ctx;
      scope.P.begin(ctx);
      const L = spec.layout;
      scope.st = { ctx, spec, el: {}, tabs: null };
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();

      const box = scope.P.stageBox(ctx);
      const availW = Math.min(box.width - 32, 1360);
      const tabsH = L.tabs ? 48 : 0;
      const availH = box.height - 24 - tabsH;
      const root = util.el('div', 'ff-root' + (L.docSide === 'right' ? ' doc-right' : '') + (L.tabs ? ' tabs' : '') + (L.long ? ' long' : ''), box.host);
      root.style.width = availW + 'px';
      root.style.margin = '12px 16px';
      root.style.setProperty('--ff-paper', rng.pick(scope.PAPERS));
      const ink = `hsl(${rng.int(0, 359)}, ${rng.int(35, 60)}%, ${rng.int(24, 36)}%)`;
      root.style.setProperty('--ff-ink', ink);
      scope.st.root = root;
      const R = { root, box, availW, availH, ink };
      scope.P.rootReady(ctx, R);

      let docPane;
      let formPane;
      let tabbar = null;
      if (L.tabs) {
        tabbar = util.el('div', 'ff-tabs' + (rng.bool(0.35) ? ' pills' : ''), root);
        tabbar.setAttribute('role', 'tablist');
        const tDoc = util.el('button', 'ff-tab', tabbar, L.tabLabels[0]);
        const tForm = util.el('button', 'ff-tab', tabbar, L.tabLabels[1]);
        for (const t of [tDoc, tForm]) { t.type = 'button'; t.dataset.role = 'tab'; t.setAttribute('role', 'tab'); }
        if (rng.bool(0.3)) tabbar.append(tForm, tDoc); // the form tab first in some episodes
        const panels = util.el('div', 'ff-panels', root);
        docPane = util.el('div', 'ff-docpane ff-panel', panels);
        formPane = util.el('div', 'ff-formpane ff-panel', panels);
        docPane.style.width = formPane.style.width = '100%';
        scope.st.tabs = env.ui.tabs([tDoc, tForm], [docPane, formPane], {
          keys: ['doc', 'form'],
          value: ctx.model.tab || 'form',
          show: (p, vis) => p.classList.toggle('off', !vis),
          onChange: (k) => scope.st.ctx.update({ ...scope.st.ctx.model, tab: k, seen: scope.st.ctx.model.seen || k === 'doc', open: null }),
        });
      } else {
        docPane = util.el('div', 'ff-docpane', root);
        formPane = util.el('div', 'ff-formpane', root);
      }
      docPane.dataset.role = 'document';
      Object.assign(R, { docPane, formPane, tabbar });
      scope.P.panes(ctx, R);
      const d = spec.doc;
      const receipt = d.kind === 'invoice' && d.style === 'receipt';
      const frac = receipt ? rng.float(0.34, 0.4) : rng.float(0.42, 0.5);
      const docW = L.tabs ? Math.min(availW, receipt ? 420 : rng.int(560, 760)) : Math.round(availW * frac);
      if (!L.tabs) docPane.style.width = docW + 'px';
      if (L.image) {
        const fam = receipt || (d.kind === 'email' && d.style === 'plain') ? scope.DOC_FONTS.mono
          : d.kind === 'invoice' && rng.bool(0.4) ? scope.DOC_FONTS.serif : scope.DOC_FONTS.sans;
        const look = { size: rng.pick([14, 15, 16]), fam, ink, paper: rng.pick(scope.PAPERS), paper2: rng.pick(['#eeeae0', '#e9ebee', '#f1efe8', '#e6e4dc']),
          angle: rng.float(-1.3, 1.3) || 0.4, noise: rng.float(0.4, 1.2), radius: d.kind === 'card' ? 10 : 0 };
        scope.P.renderImage(util, docPane, d, rng.fork('img'), receipt ? Math.min(docW, 380) : docW, L.long ? 2000 : availH, look);
      } else scope.P.renderDoc(util, docPane, d, rng);
      scope.P.beforeForm(ctx, R);
      if (L.tabs) {
        const inner = util.el('div', 'ff-forminner', formPane);
        inner.style.width = `${Math.min(availW, rng.int(520, 680))}px`;
        R.inner = inner;
        R.form = scope.P.renderForm(util, inner, spec, ctx.model, rng.fork('form'));
      } else R.form = scope.P.renderForm(util, formPane, spec, ctx.model, rng.fork('form'));
      scope.P.arranged(ctx, R);
      scope.P.fit(ctx, R);
      scope.P.showTab(ctx, R);
      scope.P.finished(ctx, R);
      return { anchors: scope.P.anchors(ctx, R) };
    };

    return fitStandard;

  }

  env.template('fill-form/_document-page', () => ({ installPage, installCompact, installStandard }));
})();
