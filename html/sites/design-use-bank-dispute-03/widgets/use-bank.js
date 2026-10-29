// Design on the shared use-bank/classic workspace; defaults reproduce this scaffold.
env.widget({
  task: 'use-bank',
  site: 'design-use-bank-dispute-03',
  name: 'design',
  split: 'train',
  scenarios: ['dispute'],
  template: 'use-bank/classic',
  design: {
    inset: 0,
    brand: 'Rivermere Bank',
    titles: { dispute: 'Dispute a Card Transaction' },
    choicePlaceholder: 'Select a reason',
    accent: '#195540',
    font: '18px/1.35 "Arial Narrow", "Segoe UI", Arial, sans-serif',
    parts: {
      heading: (base, S) => (E, main) => {
        const head = E.u.el('div', 'bk-heading', main);
        E.crumb = E.u.el('span', 'bk-crumb', head);
        E.title = E.u.el('h2', '', head);
        E.stateBadge = E.u.el('span', 'bank-draft-state', head);
      },
      edit: (base, S) => (E) => {
        const { ctx, s, u } = E, P = S.P;
        E.pane.classList.add('bank-edit-pane');
        if (Object.keys(ctx.model.invalid).length) {
          const err = u.el('div', 'bk-errorbox', E.pane, 'Check the highlighted information below.');
          err.setAttribute('role', 'alert');
        }
        const columns = u.el('div', 'bank-dispute-columns', E.pane);
        const selector = u.el('section', 'bank-selector', columns);
        const head = u.el('div', 'bank-fieldset-title', selector);
        u.el('h3', '', head, 'Select a Transaction');
        if (ctx.model.values.transaction) {
          P.button(E, head, 'Change transaction', { field: 'transaction' }, { set: ['transaction', ''] }, 'link bank-change-transaction');
        }
        // Retain the existing filter target for recovery episodes and oracle routes.
        const search = P.ref(E, { search: true }, u.el('input', 'bank-transaction-filter', head));
        search.type = 'text'; search.placeholder = 'Search'; search.setAttribute('aria-label', S.D.searchPlaceholder);
        search.value = ctx.model.search;
        search.addEventListener('input', () => {
          P.change(E, { search: search.value }, false); P.table(E);
        });
        E.tableHost = u.el('div', 'bank-transaction-scroll', selector);
        E.tableHost.addEventListener('scroll', () => {
          E.transactionScroll = E.tableHost.scrollTop; P.mirror(E);
        });
        P.table(E);
        E.tableHost.scrollTop = E.transactionScroll || 0;
        const details = u.el('section', 'bank-dispute-details', columns);
        u.el('h3', 'bank-fieldset-title', details, 'Dispute Details');
        const fields = u.el('div', 'bank-dispute-fields', details);
        s.fields.filter(f => f.kind !== 'transaction').forEach(f => P.field(E, f, fields));
        P.button(E, E.footer, 'Review changes', { nav: 'review' }, { nav: 'review' }, 'primary', 'arrow');
      },
      table: (base, S) => (E) => {
        const { ctx, s, u } = E;
        E.tableHost.replaceChildren();
        const table = u.el('table', 'bk-table bank-transaction-table', E.tableHost);
        const head = u.el('tr', '', u.el('thead', '', table));
        ['Transaction ID', 'Merchant', 'Amount', 'Date'].forEach((text, i) => {
          const cell = u.el('th', '', head, text);
          cell.style.width = ['24%', '32%', '17%', '27%'][i];
        });
        const body = u.el('tbody', '', table), q = ctx.model.search.toLowerCase();
        s.transactions.filter(t => `${t.id} ${t.name} ${t.date}`.toLowerCase().includes(q))
          .forEach(t => S.P.transaction(E, t, body));
        S.P.mirror(E);
      },
      transaction: (base, S) => (E, t, body) => {
        const { ctx, u, F } = E;
        const row = S.P.ref(E, { transaction: t.id }, u.el('tr', ctx.model.values.transaction === t.id ? 'selected' : '', body));
        row.tabIndex = 0; row.setAttribute('role', 'button');
        row.setAttribute('aria-label', `Dispute ${t.id}, ${t.name}, ${F.helpers.money(t.amount)}, ${t.date}`);
        [t.id, t.name, F.helpers.money(t.amount), t.date].forEach((value, i) => u.el('td', i === 2 ? 'bank-amount' : '', row, value));
        const select = () => S.P.change(E, { transaction: t.id });
        row.addEventListener('click', select);
        row.addEventListener('keydown', event => { if (event.key === 'Enter') select(); });
      },
      mirror: (base, S) => (E) => {
        if (E.ctx.model.view === 'edit' && E.tableHost?.isConnected) {
          const pane = E.pane;
          E.pane = E.tableHost;
          try { base(E); } finally { E.pane = pane; }
        } else base(E);
      },
      drawn: (base, S) => (E) => {
        base(E);
        const edit = E.ctx.model.view === 'edit' && E.tableHost?.isConnected;
        E.pane.classList.toggle('bank-edit-pane', !!edit);
        if (edit) S.P.ref(E, { pane: true }, E.tableHost);
      },
    },
  },
});
