// Regions extranet layout on the shared banking workspace; task actions remain in the template.
env.widget({
  task: 'use-bank',
  site: 'design-use-bank-limits-02',
  name: 'design',
  split: 'train',
  scenarios: ['limits'],
  template: 'use-bank/classic',
  design: {
    brand: 'Regions Bank',
    titles: {limits: 'Card Controls'},
    font: '16px/1.35 Arial, sans-serif',
    inset: 0,
    choicePlaceholder: 'Select a card...',
    parts: {
      frame: (base, S) => E => {
        const root = base(E);
        root.style.width = '100%';
        root.style.height = '100%';
        return root;
      },
      shell: (base, S) => E => {
        const main = E.u.el('main', 'bk-main regions-main', E.root);
        S.P.heading(E, main);
        E.pane = E.u.el('div', 'bk-scroll regions-scroll', main);
        E.footer = E.u.el('div', 'bk-footer', main);
        E.pane.addEventListener('scroll', () => S.P.mirror(E));
      },
      heading: (base, S) => E => {
        const head = E.u.el('div', 'bk-heading', E.root.querySelector('.bk-main'));
        const text = E.u.el('div', 'regions-heading-text', head);
        E.crumb = E.u.el('div', 'bk-crumb', text);
        E.title = E.u.el('h2', '', text);
        E.u.el('p', 'regions-description', text, 'Manage your debit and credit cards, set spending limits, and control where your cards can be used.');
        E.stateBadge = E.u.el('span', 'regions-state', head);
      },
      form: (base, S) => E => {
        const {u, s} = E;
        const grid = u.el('div', 'regions-form', E.pane);
        const left = u.el('section', 'regions-select regions-panel', grid);
        u.el('h3', 'regions-panel-title', left, 'Select Card');
        const leftBody = u.el('div', 'regions-panel-body', left);
        s.fields.filter(f => f.id === 'card').forEach(f => S.P.field(E, f, leftBody));
        S.P.cardPreview(E, leftBody);
        const right = u.el('section', 'regions-limits regions-panel', grid);
        u.el('h3', 'regions-panel-title', right, 'Card Status & Limits');
        const rightBody = u.el('div', 'regions-panel-body', right);
        const status = u.el('div', 'regions-status-row', rightBody);
        const statusField = s.fields.find(f => f.id !== 'card' && f.options);
        if (statusField) S.P.field(E, statusField, status);
        else {
          u.el('b', '', status, 'Card Status');
          const radios = u.el('div', 'regions-static-radios', status);
          u.el('span', 'regions-radio checked', radios, 'Active');
          u.el('span', 'regions-radio', radios, 'Frozen');
        }
        const daily = u.el('div', 'regions-daily-row', rightBody);
        const amount = s.fields.find(f => f.id !== 'card' && !f.options);
        if (amount) S.P.field(E, amount, daily);
        else {
          u.el('b', '', daily, 'Daily Spending Limit');
          u.el('span', 'regions-blank-amount', daily, '$');
        }
        u.el('span', 'regions-range', daily, '($0 - $5,000)');
        const uses = u.el('div', 'regions-uses', rightBody);
        u.el('b', '', uses, 'Where Card Can Be Used');
        const list = u.el('div', 'regions-checklist', uses);
        ['In Stores', 'Online', 'ATM Withdrawals', 'International Transactions'].forEach(t => {
          const label = u.el('label', '', list);
          const check = u.el('input', '', label); check.type = 'checkbox'; check.checked = true;
          u.el('span', '', label, t);
        });
        const note = E.root.querySelector('.regions-inspector .ref-panel');
        if (note) E.ctx.stage.parentElement.append(note);
        E.root.querySelector('.regions-inspector')?.remove();
        E.inspector = u.el('aside', 'regions-inspector regions-panel', E.root);
        S.P.history(E, E.pane);
      },
      cardPreview: (base, S) => (E, parent) => {
        const {u, s, ctx} = E;
        const visual = u.el('div', 'regions-card', parent);
        const brand = u.el('div', 'regions-card-brand', visual);
        u.el('span', 'regions-card-mark', brand);
        u.el('span', '', brand, 'Regions Bank');
        u.el('div', 'regions-card-type', visual, /credit/i.test(ctx.model.values.card || s.cards[0]) ? 'CREDIT' : 'DEBIT');
        u.el('div', 'regions-card-number', visual, '**** **** **** ' + (ctx.model.values.card || s.cards[0]).slice(-4));
        u.el('div', 'regions-card-owner', visual, s.customer);
        u.el('div', 'regions-visa', visual, 'VISA');
      },
      choiceControl: (base, S) => (E, f, box) => {
        base(E, f, box);
        const b = E.refs[S.P.key(E, {field:f.id})];
        if (f.id === 'card') {
          const arrow = b.querySelector('svg path');
          arrow.setAttribute('d', 'M3 7h18L12 18Z');
          arrow.setAttribute('stroke', 'none');
          return;
        }
        b.classList.add('regions-status-control');
        b.replaceChildren();
        f.options.forEach(value => E.u.el('span', 'regions-radio' + ((E.ctx.model.values[f.id] || f.options[0]) === value ? ' checked' : ''), b, value));
      },
      history: (base, S) => (E, parent) => {
        const {u, s, F} = E;
        const block = u.el('section', 'bk-history regions-history', parent);
        const head = u.el('div', 'regions-history-head', block);
        u.el('h3', '', head, 'Recent Card Transactions');
        S.P.localButton(E, head, 'View All Card Transactions', () => S.P.popup(E, 'Card transactions', s.transactions.map(t => `${t.date}   ${t.name}   ${F.helpers.money(t.amount)}`).join('\n')), 'regions-textlink');
        const table = u.el('table', 'bk-table', block);
        const tr = u.el('tr', '', u.el('thead', '', table));
        ['Date', 'Description', 'Category', 'Amount'].forEach(t => u.el('th', '', tr, t));
        const body = u.el('tbody', '', table);
        s.transactions.slice(0,6).forEach(t => {
          const row = u.el('tr', '', body);
          [t.date, t.name, t.category || 'Card purchase', F.helpers.money(t.amount)].forEach((text, i) => u.el('td', i === 3 ? 'regions-amount' : '', row, text));
        });
      },
      drawn: (base, S) => E => {
        base(E);
        E.root.classList.toggle('regions-edit', E.ctx.model.view === 'edit');
        const side = E.inspector;
        if (!side || !side.isConnected) return;
        const {u, s, ctx} = E;
        const note = document.querySelector('.ref-panel');
        side.replaceChildren();
        u.el('h3', 'regions-panel-title', side, 'Card Details');
        const body = u.el('div', 'regions-inspector-body', side);
        const status = s.fields.find(f => f.id !== 'card' && f.options);
        const row = (label, value) => {
          const line = u.el('div', 'regions-detail-row', body);
          u.el('span', '', line, label); u.el('span', '', line, value);
        };
        row('Card', ctx.model.values.card || s.cards[0]);
        row('Type', /credit/i.test(ctx.model.values.card || s.cards[0]) ? 'Visa Credit' : 'Visa Debit');
        row('Status', status ? ctx.model.values[status.id] || status.options[0] : 'Active');
        u.el('hr', '', body);
        row('Cardholder', s.customer); row('Expires', '04/2003');
        u.el('hr', '', body);
        row('Linked Account', s.accounts[0].label.replace(/\s+([•·].*)$/, '\n$1'));
        if (note) {
          side.classList.add('regions-with-note');
          body.append(note);
        }
        const actions = u.el('div', 'regions-detail-actions', body);
        ['Report Lost or Stolen Card', 'Request a Replacement Card', 'View Recent Card Activity', 'Manage PIN'].forEach(label => {
          S.P.localButton(E, actions, label, () => S.P.popup(E, label, label === 'View Recent Card Activity' ? s.transactions.map(t => `${t.date}   ${t.name}   ${E.F.helpers.money(t.amount)}`).join('\n') : 'For assistance with ' + (ctx.model.values.card || s.cards[0]) + ', contact Card Services through the secure message centre.'), 'regions-textlink');
        });
      },
    },
  },
});
