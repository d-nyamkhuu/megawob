// Design on the shared use-bank/classic workspace; defaults reproduce this scaffold.
env.widget({
  task: 'use-bank',
  site: 'design-use-bank-dispute-05',
  name: 'design',
  split: 'train',
  scenarios: ['dispute'],
  template: 'use-bank/classic',
  design: {
    inset: 0,
    compactAt: 1100,
    brand: 'Rivermere Bank',
    titles: { dispute: 'Dispute a Card Transaction' },
    choicePlaceholder: 'Select a reason',
    parts: {
      shell: (base, S) => (E) => {
        const { u } = E;
        const main = u.el('main', 'bk-main', E.root);
        S.P.heading(E, main);
        E.pane = u.el('div', 'bk-scroll', main);
        E.pane.addEventListener('scroll', () => S.P.mirror(E));
      },
      heading: (base, S) => (E, main) => {
        const { u } = E;
        const head = u.el('div', 'rm-heading', main);
        E.title = u.el('h1', '', head);
        u.el('p', 'rm-subtitle', head, 'Select a transaction and tell us what happened. We’ll take a look and be in touch.');
        E.crumb = u.el('div', 'rm-hidden');
        E.stateBadge = u.el('span', 'rm-hidden');
        E.footer = u.el('div', 'rm-actions', head);
      },
      edit: (base, S) => (E) => {
        const { ctx, s, u } = E, P = S.P;
        E.root.classList.add('rm-edit');
        if (Object.keys(ctx.model.invalid).length) {
          const err = u.el('div', 'bk-errorbox', E.pane, 'Check the highlighted information below.');
          err.setAttribute('role', 'alert');
        }
        const columns = u.el('div', 'rm-columns', E.pane);
        const list = u.el('section', 'rm-transactions', columns);
        const listHead = u.el('div', 'rm-panel-heading', list);
        u.el('h2', '', listHead, 'Recent card transactions');
        const search = u.el('div', 'rm-search', listHead);
        P.icon(E, u, search, 'search');
        const input = P.ref(E, {search:true}, u.el('input', '', search));
        input.type = 'text'; input.placeholder = 'Search transactions';
        input.setAttribute('aria-label', 'Search transactions'); input.value = ctx.model.search;
        input.addEventListener('input', () => { P.change(E, {search:input.value}, false); P.table(E); });
        E.tableHost = u.el('div', 'rm-table-scroll', list);
        P.ref(E, {pane:true}, E.tableHost);
        E.tableHost.addEventListener('scroll', () => P.mirror(E));
        P.table(E);
        const form = u.el('section', 'rm-dispute', columns);
        const formHead = u.el('div', 'rm-panel-heading', form);
        u.el('h2', '', formHead, 'Dispute details');
        if (ctx.model.values.transaction) {
          P.button(E, formHead, 'Change transaction', {field:'transaction'}, {set:['transaction','']}, 'link rm-change');
        }
        u.el('p', 'rm-form-subtitle', form, 'Choose a reason for your dispute and provide some details.');
        const grid = u.el('div', 'rm-fields', form);
        s.fields.filter(f => f.kind !== 'transaction').forEach(f => P.field(E, f, grid));
        P.button(E, E.footer, 'Review changes', {nav:'review'}, {nav:'review'}, 'primary', 'arrow');
      },
      table: (base, S) => (E) => {
        const { ctx, s, u } = E, P = S.P;
        E.tableHost.replaceChildren();
        const q = ctx.model.search.toLowerCase();
        const xs = s.transactions.filter(t => `${t.id} ${t.name} ${t.date}`.toLowerCase().includes(q));
        const table = u.el('table', 'rm-table', E.tableHost);
        const head = u.el('tr', '', u.el('thead', '', table));
        ['Transaction', 'Merchant', 'Amount', 'Date'].forEach(x => u.el('th', '', head, x));
        const body = u.el('tbody', '', table);
        xs.forEach(t => P.transaction(E, t, body));
        if (!xs.length) u.el('div', 'bk-empty', E.tableHost, 'No matching transactions');
        P.mirror(E);
      },
      transaction: (base, S) => (E, t, body) => {
        const { ctx, u, F } = E, P = S.P;
        const tr = P.ref(E, {transaction:t.id}, u.el('tr', ctx.model.values.transaction === t.id ? 'selected' : '', body));
        tr.tabIndex = 0; tr.setAttribute('role', 'button');
        tr.setAttribute('aria-label', `Dispute ${t.id}, ${t.name}, ${F.helpers.money(t.amount)}, ${t.date}`);
        [t.id, t.name, F.helpers.money(t.amount), t.date].forEach(x => u.el('td', '', tr, x));
        const choose = () => P.change(E, {transaction:t.id});
        tr.addEventListener('click', choose);
        tr.addEventListener('keydown', e => { if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(); } });
      },
      fieldDrawn: (base, S) => (E, f, box) => {
        base(E, f, box);
        const control = E.refs[S.P.key(E, {field:f.id})];
        if (f.kind === 'details') {
          box.classList.add('rm-details');
          control.placeholder = 'Tell us what happened...';
        }
        if (f.options) {
          box.classList.add('rm-reason');
          control.querySelector('svg')?.setAttribute('viewBox', '6 6 12 12');
        }
      },
      drawn: (base, S) => (E) => {
        base(E);
        E.root.classList.toggle('rm-edit', E.ctx.model.view === 'edit' && !E.ctx.model.bankUI?.preview && (!E.s.judge || E.s.judge.mode === 'confirm'));
      },
    },
  },
});
