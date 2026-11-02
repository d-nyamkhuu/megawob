// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    overlay: (base, S) => function overlay(ctx) {
      const { K } = S;
      const { rng, util, kind } = ctx;
      const { text } = ctx.content.bannerText(rng, kind === 'banner' ? 'notice' : kind);
      const word = ctx.lang && ctx.lang !== 'en' && ctx.word ? ctx.word : null;
      const el = util.el('div', `ref-ov ref-ov-${kind}`, document.body);
      el.dataset.role = 'overlay';
      const box = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
      util.el('div', 'ref-ov-text', box, word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text);
      const row = util.el('div', 'ref-ov-row', box);
      const btn = (label, how, primary) => {
        if (word && K.button[label]) label = word(K.button[label]);
        const b = util.el('button', primary ? 'ref-ov-btn ref-ov-primary' : 'ref-ov-btn', row, label);
        b.type = 'button';
        b.addEventListener('click', () => (how ? ctx.dismiss(how) : env.log('overlay-click', { label })));
        return b;
      };
      let dismiss;
      if (kind === 'cookie') {
        if (rng.bool(0.5)) btn('Settings', null, false);
        btn(rng.pick(['Reject all', 'Necessary only']), 'reject', false);
        dismiss = btn(rng.pick(['Accept all', 'Accept', 'Got it']), 'accept', true);
      } else if (kind === 'promo') {
        dismiss = btn(rng.pick(['No thanks', 'Maybe later', 'Close']), 'close', false);
        btn(rng.pick(['Upgrade now', 'Start trial', 'Learn more']), null, true);
      } else if (kind === 'banner') {
        dismiss = btn('Dismiss', 'close', false);
      } else {
        dismiss = btn('×', 'close', false);
        dismiss.setAttribute('aria-label', word ? word('close') : 'Close');
      }
      if (kind === 'cookie') {
        const title = util.el('strong', 'lp-overlay-title', el, 'We use cookies');
        el.insertBefore(title, el.firstChild);
        const close = util.el('button', 'lp-overlay-close', row, '×');
        close.setAttribute('aria-label', 'Close'); close.addEventListener('click', () => ctx.dismiss('close'));
      }
      if (kind === 'chat') {
        const title = util.el('div', 'lp-chat-title', el, '◉  Chat with us');
        el.insertBefore(title, el.firstChild); title.append(dismiss);
        const options = util.el('div', 'lp-chat-options', el);
        for (const label of ['I have a question about invoices', 'Help with approvals', 'Something else']) {
          const b = util.el('button', '', options, label); b.addEventListener('click', () => env.log('overlay-click', { label }));
        }
        const compose = util.el('input', 'lp-chat-compose', el); compose.placeholder = 'Type a message...'; compose.setAttribute('aria-label', 'Type a message');
      }
      if (kind === 'promo') {
        const title = util.el('h2', 'lp-overlay-title', box, 'Get product updates');
        box.insertBefore(title, box.firstChild);
        const art = util.el('div', 'lp-promo-art', box);
        const svg = util.svg('svg', { viewBox: '0 0 180 180', 'aria-hidden': 'true' }, art);
        util.svg('circle', { cx: '90', cy: '90', r: '80', fill: '#e7f2ff' }, svg);
        util.svg('path', { d: 'M27 80L90 34l63 46v70H27z', fill: '#1480ff' }, svg);
        util.svg('path', { d: 'M43 57h94v77H43z', fill: '#fff', stroke: '#c7e0ff', 'stroke-width': '2' }, svg);
        util.svg('path', { d: 'M57 75h66M57 87h66M57 99h45', fill: 'none', stroke: '#167cff', 'stroke-width': '5' }, svg);
        util.svg('path', { d: 'M27 80l63 45 63-45v70H27z', fill: '#0672ff' }, svg);
        util.svg('path', { d: 'M27 150l63-50 63 50', fill: '#0065e8' }, svg);
        const email = util.el('input', 'lp-promo-email', box); email.placeholder = 'Enter your email address'; email.setAttribute('aria-label', 'Email address');
        box.insertBefore(email, row);
        const close = util.el('button', 'lp-overlay-close', box, '×'); close.setAttribute('aria-label', 'Close'); close.addEventListener('click', () => ctx.dismiss('close'));
        util.el('small', 'lp-promo-privacy', box, 'We respect your privacy. You can unsubscribe at any time.');
      }
      if (kind === 'banner') {
        const title = util.el('strong', 'lp-overlay-title', el, 'System upgrade scheduled'); el.insertBefore(title, el.firstChild);
      }
      return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
    },
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, tall, util, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebar = roomy && rng.bool(0.35);
      const nav = W >= 1180 && rng.bool(0.5);
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      const iconPaths = {
        New: 'M5 2h9l5 5v15H5z M14 2v6h5',
        Open: 'M3 7V4h7l2 3h9v13H3z M3 10h18l-3 10H1z',
        Refresh: 'M20 8a8 8 0 0 0-14-3L3 8m0-5v5h5 M4 16a8 8 0 0 0 14 3l3-3m0 5v-5h-5',
        'Bank Feed': 'M3 7l9-4 9 4v8h-3v3H6v-3H3z M6 10h12 M8 10v5m4-5v5m4-5v5 M9 19h6m-3-3v6',
        Reconcile: 'M4 3h13l3 3v15H4z M8 12l3 3 6-7 M8 19h8',
        Journal: 'M3 3h3v18H3z M9 3h12v18H9z M11 7h8m-8 5h8m-8 5h8',
        Expenses: 'M5 2h10l4 4v16H5z M15 2v5h4 M8 11h8m-8 4h8m-8 4h6',
        Bills: 'M5 2h10l4 4v16H5z M15 2v5h4 M8 10h4m-4 4h8m-8 4h8',
        Reports: 'M5 2h10l4 4v16H5z M15 2v5h4 M8 9h2v3H8z M12 9h4m-8 7h8m-8 3h8',
        Dashboard: 'M2 20l3-12 3 12 4-18 3 18 3-12 4 12',
        Banking: 'M2 9l10-7 10 7z M4 11v9m5-9v9m6-9v9m5-9v9 M2 22h20',
        Sales: 'M2 3h3l3 13h12l2-10H6 M8 20a1 1 0 1 0 0 1m11-1a1 1 0 1 0 0 1 M11 10l3 3 4-4',
        Purchases: 'M2 2h3l3 15h13 M6 6h16l-2 9H8 M9 20a1 1 0 1 0 0 1m10-1a1 1 0 1 0 0 1',
        'General Ledger': 'M5 2h10l4 4v16H5z M8 7h4m-4 5h8m-8 5h8 M11 10v9',
        Settings: 'M9 3h6l1 4 4 1 2 5-4 2-1 5h-5l-2-4-5-1V9l4-2z M16 12a4 4 0 1 0-8 0 4 4 0 0 0 8 0',
      };
      const drawIcon = (parent, name) => {
        const svg = util.svg('svg', { viewBox: '0 0 24 24', class: 'fin-svg', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.7', 'stroke-linejoin': 'round', 'stroke-linecap': 'round', 'aria-hidden': 'true' }, parent);
        util.svg('path', { d: iconPaths[name] || iconPaths.Reports }, svg);
      };
      const winbar = util.el('div', 'fin-winbar', document.body);
      util.el('span', 'fin-appmark', winbar, 'Q');
      util.el('strong', 'fin-window-title', winbar, 'LedgerPro Accounting');
      const wincontrols = util.el('div', 'fin-wincontrols', winbar);
      for (const glyph of ['−', '□', '×']) util.el('span', '', wincontrols, glyph);
      const menubar = util.el('nav', 'fin-menubar', document.body);
      for (const item of ['File', 'Edit', 'View', 'Transactions', 'Reports', 'Tools', 'Window', 'Help']) util.el('span', '', menubar, item);
      const toolbar = util.el('div', 'fin-toolbar', document.body);
      for (const [icon, label] of [['▱','New'], ['▰','Open'], ['⟳','Refresh'], ['♧','Bank Feed'], ['▧','Reconcile'], ['▤','Journal'], ['▤','Expenses'], ['▣','Bills'], ['▤','Reports']]) {
        const tool = util.el('div', 'fin-tool', toolbar);
        drawIcon(tool, label); util.el('span', '', tool, label);
      }
      Object.assign(_c, { collide, cr, decoys, drawIcon, iconPaths, label, menubar, nav, placement, sidebar, toolbar, wantFooter, winbar, wincontrols });
    },
    'frame.header': (base, S) => function (_c) {
      const { drawIcon, util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      util.el('div', 'ap-title', header, 'Accounts Payable');
      util.el('div', 'ap-date', header, 'Thu, Apr 24, 2003');
      const invoiceBand = util.el('section', 'fin-invoice-band', document.body);
      const invoiceMain = util.el('div', 'fin-invoice-main', invoiceBand);
      const docIcon = util.el('div', 'fin-doc-icon', invoiceMain);
      drawIcon(docIcon, 'Bills');
      const invoiceHeading = util.el('div', 'fin-invoice-heading', invoiceMain);
      util.el('div', 'fin-invoice-title', invoiceHeading, 'Invoice　 INV-8016-1');
      util.el('span', 'fin-status', invoiceHeading, 'Pending Approval');
      util.el('span', 'fin-status fin-status-unpaid', invoiceHeading, 'Unpaid');
      util.el('div', 'fin-vendor', invoiceMain, 'Riverside Office Supply');
      const invoiceFacts = util.el('div', 'fin-facts', invoiceMain);
      for (const [label, value] of [['Invoice Date','—'],['Vendor No.','—'],['Due Date','—'],['Purchase Order','—'],['Total Amount','—'],['Department','—'],['Terms','Net 30'],['Project','—']]) {
        util.el('span', 'fin-fact-label', invoiceFacts, label);
        util.el('strong', 'fin-fact-value', invoiceFacts, value);
      }
      const invoicePreview = util.el('div', 'fin-invoice-preview', invoiceBand);
      util.el('div', 'fin-preview-mark', invoicePreview, 'Riverside　 INVOICE');
      util.el('div', 'fin-preview-lines', invoicePreview, 'Invoice　　Date　　Amount\n\nRiverside Office Supply\n\nOffice furniture　　$11,800');
      const invoiceTotal = util.el('div', 'fin-preview-total', invoiceBand);
      util.el('span', '', invoiceTotal, 'Subtotal　　$11,800.00');
      util.el('span', '', invoiceTotal, 'Tax (5.76%)　 $680.00');
      util.el('strong', '', invoiceTotal, 'Total　　　 $12,480.00');
      S.frameBrand(_c, header);
      Object.assign(_c, { docIcon, header, invoiceBand, invoiceFacts, invoiceHeading, invoiceMain, invoicePreview, invoiceTotal });
    },
    'frame.tools': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, header, invoiceFacts, invoiceMain, label, placement, toolbar, util, wantFooter } = _c;
      let submit = null;
      const headerTools = util.el('div', 'ref-tools', header);
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      toolbar.append(headerTools);
      const globalSearch = util.el('div', 'fin-global-search', toolbar);
      util.el('span', '', globalSearch, '⌕');
      const searchInput = util.el('input', '', globalSearch);
      searchInput.placeholder = 'Search invoices, vendors, accounts...';
      searchInput.setAttribute('aria-label', 'Search invoices, vendors, accounts');
      toolbar.insertBefore(globalSearch, headerTools);
      const instruction = header.querySelector('.ref-instruction');
      if (instruction) invoiceMain.insertBefore(instruction, invoiceFacts);
      Object.assign(_c, { globalSearch, headerTools, instruction, searchInput, submit });
    },
    'frame.body': (base, S) => function (_c) {
      const { drawIcon, util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const appnav = util.el('aside', 'fin-sidebar', body);
      for (const [icon, label] of [['♧','Dashboard'], ['⌂','Banking'], ['▱','Sales'], ['▣','Purchases'], ['','　Vendors'], ['','　Bills'], ['','　Approvals'], ['','　Payments'], ['▤','Expenses'], ['▤','General Ledger'], ['▧','Reports'], ['⚙','Settings']]) {
        const row = util.el('div', 'fin-navrow', appnav);
        if (icon) drawIcon(row, label); util.el('span', '', row, label);
        if (label.trim() === 'Bills') row.classList.add('selected');
      }
      S.frameSidebar(_c, body);
      Object.assign(_c, { appnav, body });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, invoiceBand, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const workspace = util.el('div', 'fin-workspace', body);
      workspace.append(invoiceBand, stage);
      const taskPanel = body.querySelector('.ref-panel');
      if (taskPanel) invoiceBand.append(taskPanel);
      Object.assign(_c, { stage, taskPanel, workspace });
    },
  };

  env.site({
    name: 'design-use-accounting-approve-02',
    template: 'site/base',
    design: { parts },
  });
})();
