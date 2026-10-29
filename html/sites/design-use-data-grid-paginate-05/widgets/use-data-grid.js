// Design on use-data-grid/grid; defaults reproduce the scaffolded base widget.
env.widget({
  task: 'use-data-grid',
  site: 'design-use-data-grid-paginate-05',
  name: 'design',
  split: 'train',
  scenarios: ['paginate'],
  template: 'use-data-grid/grid',
  design: {
    brand: 'Acme Commerce', pageSizes: [5, 10, 20], rowMin: 38, rowMax: 43, fixedHeight: 186,
    parts: {
      appbar: (base, S) => () => { base(); S.appbar.remove(); },
      navigation: (base, S) => () => { base(); S.nav.remove(); },
      contextPanel: (base, S) => () => { base(); S.shell.querySelector('.to-context')?.remove(); },
      fit: (base, S) => () => { base(); S.cardW = S.W; S.cardH = S.H; S.left = 0; S.top = 0; S.FIXED = 186; S.rowH = Math.max(38, Math.min(43, Math.floor((S.cardH - S.FIXED) / S.spec.pageSize))); },
      heading: (base, S) => () => {
        base();
        S.title.textContent = 'Orders';
        const utility = S.P.el('div', 'order-utility', S.head);
        for (const b of [...S.head.querySelectorAll('[data-role="xtra"]')]) if (b !== S.nb) utility.appendChild(b);
        S.nb.textContent = '+  New Order';
        const add = (label, icon) => {
          const b = S.P.el('button', 'to-btn order-action', S.head, `${icon}  ${label}`);
          b.type = 'button';
          b.addEventListener('click', () => S.P.showUtility(label, [`${label} is available from the order workspace.`]));
          return b;
        };
        add('Ship', '▱'); add('Cancel', '⊘'); add('Refund', '↶');
        const more = S.P.el('button', 'to-btn order-more', S.head, '•••');
        more.type = 'button';
        more.setAttribute('aria-label', 'More actions');
        more.addEventListener('click', () => { utility.hidden = !utility.hidden; });
        utility.hidden = true;
      },
      tabs: (base, S) => () => { base(); S.tabs.classList.add('order-hidden-tabs'); },
      stream: (base, S) => () => { base(); S.stream.hidden = true; },
      toolbar: (base, S) => () => {
        base();
        if (S.input) S.input.placeholder = 'Search orders, customers, or products...';
      },
      footer: (base, S) => () => {
        base();
        S.rpp.classList.add('order-size');
        S.rpp.firstChild.textContent = 'Rows per page:';
        const chooser = S.P.el('button', 'order-size-toggle', S.rpp, String(S.spec.pageSize) + '  ⌄');
        chooser.type = 'button';
        chooser.addEventListener('click', () => S.rpp.classList.toggle('open'));
        S.tools.appendChild(S.rpp);
      },
      drawFoot: (base, S) => (m) => {
        base(m);
        const chooser = S.rpp.querySelector('.order-size-toggle');
        if (chooser) chooser.textContent = String(S.P.sizeOf(m)) + '  ⌄';
        S.rpp.classList.remove('open');
      },
      drawTools: (base, S) => (m) => {
        base(m);
        S.tools.classList.toggle('has-selection', m.selected.length > 0);
      },
      column: (base, S) => (c) => {
        base(c);
        const labels = { Invoice: 'Order #', Client: 'Customer', Region: 'Ship Method', Issued: 'Date' };
        if (labels[c.label]) S.parts[c.id].lbl.textContent = labels[c.label];
        S.hcells[c.id].classList.add('order-col-' + c.id);
      },
      grid: (base, S) => () => {
        if (S.spec.domain === 'invoices') S.scale = Math.min(S.scale, Math.max(0.55, (S.cardW - 44 - 58 - 224 - 12) / S.nominal));
        base();
        if (S.spec.scenario === 'paginate') S.body.addEventListener('wheel', (e) => {
          e.preventDefault(); e.stopImmediatePropagation();
          S.body.scrollTop += Math.sign(e.deltaY) * Math.min(Math.abs(e.deltaY), 60);
          S.P.mirrorScreenRows();
        }, { capture: true, passive: false });
        if (S.spec.domain === 'invoices') {
          const hstatus = S.P.el('div', 'to-h order-visual-status', S.hrow, 'Status  ⏶');
          const hitems = S.P.el('div', 'to-h order-visual-items', S.hrow, 'Items  ⏶');
          hstatus.setAttribute('aria-hidden', 'true'); hitems.setAttribute('aria-hidden', 'true');
        }
      },
      rowReady: (base, S) => (row, r, m) => {
        base(row, r, m);
        if (S.spec.domain !== 'invoices') return;
        const code = String(r.id).split('').reduce((n, x) => n + (Number(x) || 0), 0);
        const states = ['Shipped', 'Processing', 'Delivered', 'Cancelled'];
        const state = states[code % states.length];
        const status = S.P.el('div', 'to-c order-visual-status', row);
        S.P.el('span', 'order-pill ' + state.toLowerCase(), status, state);
        S.P.el('div', 'to-c order-visual-items', row, String(code % 5 + 1));
      },
      drawRows: (base, S) => (m) => {
        const top = S.body ? S.body.scrollTop : 0;
        base(m);
        if (top && S.body) {
          S.body.scrollTop = top;
          S.P.mirrorScreenRows();
        }
      },
      decorate: (base, S) => () => {},
    },
  },
});
