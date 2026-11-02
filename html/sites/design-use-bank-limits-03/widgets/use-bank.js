// Design on the shared use-bank/classic workspace; defaults reproduce this scaffold.
env.widget({
  task: 'use-bank',
  site: 'design-use-bank-limits-03',
  name: 'design',
  split: 'train',
  scenarios: ['limits'],
  template: 'use-bank/classic',
  design: {
    inset: 0,
    font: '20px/1.4 Arial,"Segoe UI",sans-serif',
    parts: {
      frame: (base) => (E) => {
        const root = base(E);
        root.classList.add('bank-workspace');
        return root;
      },
      shell: (base, S) => (E) => {
        const {u} = E;
        const meta = u.el('div', 'bank-view-meta', E.root);
        E.crumb = u.el('span', '', meta);
        E.title = u.el('span', '', meta);
        E.stateBadge = u.el('span', '', meta);
        const heading = u.el('div', 'bank-page-heading', E.root);
        u.el('h1', '', heading, 'Card controls');
        const instruction = document.querySelector('.ref-task > .ref-instruction');
        if (instruction) heading.append(instruction);
        u.el('p', '', heading, 'Manage your debit and credit cards, set spending limits, and more.');
        E.settings = document.querySelector('.bank-card-settings');
        E.pane = u.el('div', 'bk-scroll', E.root);
        E.footer = u.el('div', 'bk-footer', E.root);
        E.pane.addEventListener('scroll', () => S.P.mirror(E));
      },
      form: (base, S) => (E) => {
        const {u, s} = E;
        const picker = u.el('section', 'bank-picker-card', E.pane);
        u.el('h3', '', picker, 'Select a card');
        u.el('p', 'bank-section-copy', picker, 'Choose a card to view or update its settings.');
        const card = s.fields.find(f => f.id === 'card');
        if (card) S.P.field(E, card, picker);
        const panel = u.el('section', 'bank-limit-card', E.pane);
        const amount = s.fields.some(f => f.kind === 'amount');
        u.el('h3', '', panel, amount ? 'Spending limit' : 'Card status');
        u.el('p', 'bank-section-copy', panel, amount ? 'Set a daily spending limit for this card. You can change this at any time.' : 'Temporarily lock or unlock your card. You can change this at any time.');
        const inset = u.el('div', 'bank-limit-inset', panel);
        s.fields.filter(f => f.id !== 'card' && f.kind !== 'transaction').forEach(f => S.P.field(E, f, inset));
        if (E.settings) panel.append(E.settings);
      },
      choiceControl: (base, S) => (E, field, box) => {
        base(E, field, box);
        if (field.id !== 'card') return;
        const button = E.refs[S.P.key(E, {field: field.id})];
        button.classList.add('bank-card-choice');
        const name = button.querySelector('span');
        const copy = E.u.el('div', 'bank-card-choice-copy');
        button.insertBefore(copy, name);
        copy.append(name);
        const selected = E.ctx.model.values.card;
        E.u.el('small', '', copy, selected ? (/credit/i.test(selected) ? 'Credit card' : 'Debit card') : 'Debit and credit cards');
        const tile = E.u.el('span', 'bank-card-tile');
        tile.innerHTML = '<b>Aurora</b><i>)))</i><em></em>';
        button.prepend(tile);
      },
      fieldDrawn: (base) => (E, field, box) => {
        base(E, field, box);
        box.dataset.bankField = field.id;
        if (field.kind === 'amount') box.querySelector('.bk-label').textContent = field.label + ' (USD)';
      },
      drawn: (base) => (E) => {
        base(E);
        E.pane.append(E.footer);
      },
    },
  },
});
