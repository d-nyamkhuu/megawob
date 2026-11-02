// Design on the shared use-bank/classic workspace; defaults reproduce this scaffold.
env.widget({
  task: 'use-bank',
  site: 'design-use-bank-limits-04',
  name: 'design',
  split: 'train',
  scenarios: ['limits'],
  template: 'use-bank/classic',
  design: {
    brand: 'Rivermark Bank',
    font: '16px/1.35 Arial,"Segoe UI",sans-serif',
    parts: {
      frame: (base, S) => (E) => {
        const root = E.u.el('div', 'bk bank-workspace', E.ctx.stage);
        root.style.width = '100%';
        root.style.height = '100%';
        return root;
      },
      shell: (base, S) => (E) => {
        const main = E.u.el('div', 'bank-workspace-main', E.root);
        const metadata = E.u.el('div', 'bank-view-metadata', main);
        E.crumb = E.u.el('span', '', metadata);
        E.title = E.u.el('span', '', metadata);
        E.stateBadge = E.u.el('span', '', metadata);
        E.pane = E.u.el('div', 'bk-scroll bank-workspace-pane', main);
        E.footer = E.u.el('div', 'bk-footer', main);
        E.pane.addEventListener('scroll', () => S.P.mirror(E));
      },
      choiceControl: (base, S) => (E, f, box) => {
        if (f.id === 'frozen') {
          const b = S.P.ref(E, {field:f.id}, S.P.localButton(E, box, '',
            () => S.P.change(E, {open:f.id}), 'bank-freeze-choice'));
          E.u.el('span', 'bank-switch' + (E.ctx.model.values[f.id] === 'Frozen' ? ' on' : ''), b);
          E.u.el('span', '', b, E.ctx.model.values[f.id] || 'Freeze card');
          b.setAttribute('aria-label', f.label);
          b.setAttribute('aria-haspopup', 'dialog');
          return;
        }
        if (f.id !== 'card') return base(E, f, box);
        const { u, ctx, s } = E;
        const b = S.P.ref(E, {field: f.id}, S.P.localButton(E, box, '',
          () => S.P.change(E, {open: f.id}), 'bk-control bk-choice bank-card-picker'));
        const mini = u.el('span', 'bank-plastic bank-plastic-mini', b);
        u.el('span', 'bank-plastic-brand', mini, 'Rivermark Bank');
        u.el('span', 'bank-plastic-type', mini, 'DEBIT');
        u.el('b', 'bank-visa', mini, 'VISA');
        const text = u.el('span', 'bank-picker-copy', b);
        u.el('span', '', text, ctx.model.values[f.id] || S.D.choicePlaceholder);
        u.el('small', '', text, s.customer);
        S.P.icon(E, u, b, 'chevron');
        b.setAttribute('aria-label', f.label);
        b.setAttribute('aria-haspopup', 'dialog');
      },
      form: (base, S) => (E) => {
        const { u, s, ctx } = E;
        const m = ctx.model;
        const layout = u.el('div', 'bank-card-layout', E.pane);
        const picker = u.el('div', 'bank-picker-column', layout);
        u.el('div', 'bank-column-title', picker, 'Your Cards');
        s.fields.filter(f => f.id === 'card').forEach(f => S.P.field(E, f, picker));
        const right = u.el('div', 'bank-controls-column', layout);
        const details = u.el('div', 'bank-card-details', right);
        const plastic = u.el('div', 'bank-plastic', details);
        u.el('span', 'bank-plastic-brand', plastic, 'Rivermark Bank');
        u.el('span', 'bank-plastic-type', plastic, 'DEBIT');
        u.el('b', 'bank-visa', plastic, 'VISA');
        const copy = u.el('div', 'bank-card-copy', details);
        u.el('div', 'bank-card-name', copy, m.values.card || s.cards[0]);
        u.el('div', 'bank-card-customer', copy, s.customer);
        u.el('div', 'bank-card-linked', copy, 'Linked to ' + s.accounts[0].label);
        const status = u.el('div', 'bank-card-facts', copy);
        const fact = (label, value, cls) => {
          const row = u.el('div', 'bank-card-fact', status);
          u.el('span', '', row, label); u.el('span', cls || '', row, value);
        };
        fact('Card status', m.values.frozen === 'Frozen' ? 'Frozen' : 'Active', 'bank-active');
        const amountField = s.fields.find(f => f.kind === 'amount');
        fact('Daily spending limit', amountField && m.values[amountField.id] ? '$' + m.values[amountField.id] : 'No limit');
        u.el('span', 'bank-info-dot', status.lastChild.lastChild, 'i');
        const panel = u.el('section', 'bank-controls-panel', right);
        u.el('div', 'bank-controls-heading', panel, 'Card Controls');
        const body = u.el('div', 'bank-controls-body', panel);
        const statusRow = u.el('div', 'bank-control-row bank-freeze-row', body);
        const statusText = u.el('div', 'bank-control-copy', statusRow);
        u.el('b', '', statusText, 'Card status');
        u.el('p', '', statusText, 'Temporarily freeze your card to prevent new purchases and ATM withdrawals.');
        const frozen = s.fields.find(f => f.id === 'frozen');
        if (frozen) S.P.field(E, frozen, statusRow);
        else {
          const decoy = u.el('div', 'bank-static-freeze', statusRow);
          u.el('span', 'bank-switch', decoy);
          u.el('span', '', decoy, 'Freeze card');
        }
        const limitRow = u.el('div', 'bank-control-row bank-limit-row', body);
        const limitText = u.el('div', 'bank-control-copy', limitRow);
        u.el('b', '', limitText, 'Set a daily spending limit (optional)');
        u.el('p', '', limitText, 'Limit the amount of purchases, ATM withdrawals and contactless payments for this card.');
        s.fields.filter(f => f.id !== 'card' && f.id !== 'frozen' && f.kind !== 'transaction').forEach(f => S.P.field(E, f, limitRow));
        if (frozen && !amountField) {
          const blank = u.el('div', 'bank-static-amount', limitRow);
          u.el('span', '', blank, '$');
        }
        const allow = u.el('div', 'bank-control-row bank-allow-row', body);
        const allowText = u.el('div', 'bank-control-copy', allow);
        u.el('b', '', allowText, 'Allow card use');
        u.el('p', '', allowText, 'Choose where your card can be used.');
        const uses = u.el('div', 'bank-card-uses', allow);
        ['In stores', 'Online', 'Phone orders', 'ATM withdrawals'].forEach(text => {
          const row = u.el('div', '', uses);
          u.el('span', 'bank-switch on', row);
          u.el('span', '', row, text);
        });
      },
    },
  },
});
