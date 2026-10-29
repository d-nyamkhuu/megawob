// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';


  const THEMES = {
    light: { bg: '#ffffff', panel: '#ffffff', fg: '#111111', muted: '#333333', line: '#555555' },
    dark: { bg: '#ffffff', panel: '#ffffff', fg: '#111111', muted: '#333333', line: '#555555' },
    warm: { bg: '#ffffff', panel: '#ffffff', fg: '#111111', muted: '#333333', line: '#555555' },
  };

  const ACCENTS = ['#4b83d0', '#4b83d0', '#4b83d0', '#4b83d0', '#4b83d0', '#4b83d0'];

  // Rehouse the template's existing controls; all model updates and target references stay with it.
  function decorateExpense(ctx) {
    const stage = ctx.stage;
    const receipts = ctx.spec.receipts || [];
    const list = stage.querySelector('.af-receipts');
    const columns = stage.querySelectorAll('.af-work.expense > .af-column');
    if (!list || !columns.length || !receipts.length) return;
    const el = (tag, cls, parent, text) => ctx.util.el(tag, cls, parent, text);
    const amount = (value) => `$${(Number(value) / 100).toFixed(2)}`;
    const writtenDate = (value) => {
      const [year, month, day] = String(value).split('-');
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return months[Number(month) - 1] ? `${months[Number(month) - 1]} ${Number(day)}, ${year}` : value;
    };
    const buttons = [...list.querySelectorAll('button')];
    const active = Math.max(0, buttons.findIndex((b) => b.classList.contains('selected')));
    let head = list.querySelector('.acme-receipt-head');
    if (!head) {
      head = el('div', 'acme-receipt-head', list);
      for (const label of ['Date ▲', 'Merchant', 'Amount', 'Source']) el('span', '', head, label);
      list.prepend(head);
    }
    buttons.forEach((button, index) => {
      const receipt = receipts[index];
      if (!receipt) return;
      button.replaceChildren();
      for (const value of [writtenDate(receipt.date), receipt.merchant, amount(receipt.amount), `Receipt ${receipt.id} of ${receipts.length}`]) {
        el('span', '', button, value);
      }
      button.classList.add('acme-receipt-row');
    });
    const heading = columns[0].querySelector('.af-colhead');
    if (heading && heading.firstElementChild) heading.firstElementChild.textContent = 'Receipts';
    const pane = columns[0].querySelector('.af-pane');
    if (pane && !columns[0].querySelector('.acme-receipt-title')) {
      const title = el('div', 'acme-receipt-title', columns[0], 'Receipt');
      (pane.closest('.af-scrollbox') || pane).before(title);
    }
    const source = columns[0].querySelector('.af-content');
    const paper = source && source.querySelector('.af-paper');
    const receipt = receipts[active] || receipts[0];
    if (source && paper) {
      paper.classList.add('acme-slip');
      let slip = paper.querySelector('.acme-slip-body');
      if (!slip) slip = el('div', 'acme-slip-body', paper);
      for (const child of [...paper.children]) if (child !== slip) child.classList.add('acme-slip-original');
      slip.replaceChildren();
      el('div', 'acme-slip-merchant', slip, receipt.merchant.toUpperCase());
      el('div', 'acme-slip-city', slip, receipt.city || '');
      const [year, month, day] = receipt.date.split('-');
      el('div', 'acme-slip-date', slip, `${month}/${day}/${year.slice(-2)}      ${receipt.id}`);
      el('div', 'acme-slip-item', slip, receipt.category);
      el('div', 'acme-slip-code', slip, receipt.project);
      const subtotal = el('div', 'acme-slip-total', slip);
      el('span', '', subtotal, 'SUBTOTAL'); el('span', '', subtotal, amount(receipt.amount));
      const total = el('div', 'acme-slip-total', slip);
      el('span', '', total, 'TOTAL'); el('span', '', total, amount(receipt.amount));
      el('div', 'acme-slip-thanks', slip, 'THANK YOU\nPLEASE COME AGAIN');
      let detail = source.querySelector('.acme-source');
      if (!detail) detail = el('div', 'acme-source', source);
      const history = source.querySelector('.af-history');
      const note = source.querySelector('.af-note');
      const progress = source.querySelector('.acme-report-progress');
      detail.replaceChildren();
      const details = el('div', 'acme-source-grid', detail);
      for (const [label, value] of [['Merchant:', receipt.merchant], ['Location:', receipt.city], ['Date:', writtenDate(receipt.date)],
        ['Items:', receipt.category], ['Project:', receipt.project], ['Subtotal:', amount(receipt.amount)], ['Total:', amount(receipt.amount)]]) {
        el('span', 'acme-source-label', details, label);
        el('span', 'acme-source-value', details, value || '');
      }
      for (const child of [...source.children]) {
        if (child !== paper && child !== detail) child.classList.add('acme-original-source');
      }
      if (history) { history.classList.remove('acme-original-source'); detail.append(history); }
      if (note) { note.classList.remove('acme-original-source'); detail.append(note); }
      if (progress) detail.append(progress);
    }
    const form = columns[1] && columns[1].querySelector('.af-fields');
    if (form) {
      const detail = source && source.querySelector('.acme-source');
      if (detail) {
        for (const extra of [...form.parentElement.children]) {
          if (extra !== form && /report receipts/i.test(extra.textContent)) {
            extra.classList.add('acme-report-progress');
            detail.append(extra);
          }
        }
      }
      const dateField = form.querySelector('.af-field');
      if (dateField && !dateField.querySelector('.acme-calendar')) {
        const icon = el('span', 'acme-calendar', dateField, '▦');
        icon.setAttribute('aria-hidden', 'true');
      }
    }
    if (form && !form.querySelector('.acme-memo')) {
      const field = el('label', 'acme-memo', form);
      el('span', '', field, 'Memo:');
      const input = el('input', '', field);
      input.type = 'text'; input.setAttribute('aria-label', 'Memo');
    }
    const formHeading = columns[1] && columns[1].querySelector('.af-colhead');
    if (formHeading && formHeading.firstElementChild) formHeading.firstElementChild.textContent = 'Expense Details';
    const status = document.querySelector('.ref-status-count');
    if (status) status.textContent = String(receipts.length);
  }

  const parts = {
    'frame.theme': (base, S) => function (_c) {
      const { ctx } = _c;
      const { LOW_ACCENTS, LOW_THEME } = S;
      const { rng, util, content } = ctx;
      if (!env.widgetDef._acmeRender) {
        const original = env.widgetDef.render;
        env.widgetDef._acmeRender = original;
        env.widgetDef.render = function (taskCtx) {
          const view = original.call(this, taskCtx);
          decorateExpense(taskCtx);
          if (view.sync) {
            const sync = view.sync;
            view.sync = function (...args) {
              const value = sync.apply(this, args);
              decorateExpense(taskCtx);
              return value;
            };
          }
          return view;
        };
      }
      let name = rng.pick(Object.keys(THEMES));
      const root = document.documentElement;
      let accent = rng.pick(ACCENTS);
      const tr = rng.fork('chrome/theme');
      if (tr.bool(0.08)) {
        name = 'low';
        accent = tr.pick(LOW_ACCENTS);
      }
      for (const [k, v] of Object.entries(name === 'low' ? LOW_THEME : THEMES[name])) root.style.setProperty(`--${k}`, v);
      root.style.setProperty('--accent', accent);
      root.dataset.theme = name;
      Object.assign(_c, { accent, content, name, rng, root, tr, util });
    },
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, tall, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebar = roomy && rng.bool(0.35);
      const navDraw = W >= 1180 && rng.bool(0.5);
      const nav = true;
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, navDraw, placement, sidebar, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { content, display, local, lr, nav, navDraw, rng, util, word } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      if (display !== 'header' || nav) {
        if (display !== 'header' || navDraw) {
          rng.pick(TITLES);
          if (word) word(lr.pick(K.brand));
        }
        const brand = util.el('div', 'ref-brand', header, 'Acme Corporation');
        brand.dataset.role = 'brand';
        util.el('div', 'ref-subtitle', header, 'Accounting Workspace');
      }
      if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        if (navDraw) local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
        for (const item of ['Reconcile', 'Journal', 'Expenses', 'Approve', 'Reports']) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      const status = util.el('div', 'ref-status', header);
      util.el('strong', '', status, 'Expenses');
      const unfiled = util.el('div', 'ref-status-row', status);
      util.el('span', '', unfiled, 'Unfiled receipts:');
      util.el('span', 'ref-status-count', unfiled, '3');
      for (const [caption, count] of [['Pending approval:', '2'], ['Approved this month:', '5']]) {
        const row = util.el('div', 'ref-status-row', status);
        util.el('span', '', row, caption);
        util.el('span', '', row, count);
      }
      Object.assign(_c, { header, status, unfiled });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-use-accounting-expense-02',
    template: 'site/base',
    design: { THEMES, ACCENTS, parts },
  });
})();
