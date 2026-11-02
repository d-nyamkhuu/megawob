// Design on the shared use-bank/classic workspace; defaults reproduce this scaffold.
env.widget({
  task: 'use-bank',
  site: 'design-use-bank-limits-01',
  name: 'design',
  split: 'train',
  scenarios: ['limits'],
  template: 'use-bank/classic',
  design: {
    brand: 'Riverton Bank',
    titles: { limits: 'Card Controls' },
    font: '15px/1.4 Arial, "Segoe UI", sans-serif',
    parts: {
      icon: (base, S) => (E, u, parent, name, cls = '') => {
        if (name !== 'shield') return base(E, u, parent, name, cls);
        const svg = u.svg('svg', { viewBox: '0 0 24 24', fill: 'none', class: cls, 'aria-hidden': 'true' }, parent);
        u.svg('path', { d: 'M12 2 21 6v6c0 6-9 10-9 10S3 18 3 12V6Z', fill: 'currentColor' }, svg);
        u.svg('path', { d: 'M12 5v14c2-1 6-4 6-8V8Z', fill: '#dceaff' }, svg);
        return svg;
      },
      frame: (base, S) => E => {
        const root = E.u.el('div', 'bk bank-workspace', E.ctx.stage);
        root.style.width = `${Math.min(1218, Math.max(260, E.ctx.size.width - 40))}px`;
        root.style.height = `${Math.max(180, E.ctx.size.height - 18)}px`;
        return root;
      },
      shell: (base, S) => E => {
        const tracking = E.u.el('div', 'bank-tracking', E.root);
        E.crumb = E.u.el('div', '', tracking);
        E.title = E.u.el('h2', '', tracking);
        E.stateBadge = E.u.el('span', '', tracking);
        E.pane = E.u.el('div', 'bk-scroll bank-content', E.root);
        E.footer = E.u.el('div', 'bk-footer bank-actions', E.root);
        E.pane.addEventListener('scroll', () => S.P.mirror(E));
      },
      form: (base, S) => E => {
        const { u, s, ctx } = E;
        const sheet = u.el('section', 'bank-sheet', E.pane);
        const head = u.el('div', 'bank-sheet-heading', sheet);
        const shield = u.el('div', 'bank-shield', head);
        S.P.icon(E, u, shield, 'shield');
        const title = u.el('div', '', head);
        u.el('h2', '', title, 'Card Controls');
        u.el('p', '', title, 'Manage your card settings, spending limits, and security preferences.');
        const picker = u.el('div', 'bank-card-section', sheet);
        const card = s.fields.find(f => f.id === 'card');
        if (card) S.P.field(E, card, picker);
        const spending = u.el('section', 'bank-spending-section', sheet);
        u.el('h3', '', spending, 'Spending limits');
        u.el('p', 'bank-description', spending, 'Set a daily spending limit to help manage your spending on this card.');
        const fields = s.fields.filter(f => f.id !== 'card' && f.id !== 'frozen' && f.kind !== 'transaction');
        fields.forEach(f => S.P.field(E, f, spending));
        if (!fields.length) {
          const label = u.el('div', 'bank-static-limit', spending);
          u.el('span', '', label, 'Daily spending limit');
          const input = u.el('div', 'bank-static-input', label);
          u.el('span', '', input, '$');
        }
        const status = u.el('section', 'bank-status-section', sheet);
        u.el('h3', '', status, 'Card status');
        u.el('p', 'bank-description', status, "Temporarily block your card if it’s lost, stolen, or not in use.");
        const frozen = s.fields.find(f => f.id === 'frozen');
        if (frozen) S.P.field(E, frozen, status);
        else {
          const row = u.el('div', 'bank-freeze-row', status);
          const toggle = u.el('button', 'bank-toggle', row);
          toggle.type = 'button';
          toggle.setAttribute('aria-label', 'Freeze this card');
          toggle.addEventListener('click', () => env.log('decoy', { label: 'Freeze this card' }));
          const text = u.el('div', '', row);
          u.el('span', '', text, 'Freeze this card');
          u.el('p', '', text, 'When frozen, new purchases, ATM withdrawals, and most transfers will be declined.');
        }
        S.P.history(E, E.pane);
      },
      fieldDrawn: (base, S) => (E, f, box) => {
        box.dataset.field = f.id;
        if (f.id === 'card') box.querySelector('.bk-label').textContent = 'Select a card';
        if (f.kind === 'amount') box.classList.add('bank-amount-field');
      },
      choiceControl: (base, S) => (E, f, box) => {
        base(E, f, box);
        if (f.id === 'frozen') {
          const b = E.refs[S.P.key(E, { field: f.id })];
          b.replaceChildren();
          b.classList.add('bank-freeze-choice');
          const toggle = E.u.el('span', 'bank-toggle', b);
          toggle.classList.toggle('bank-toggle-on', /frozen|blocked/i.test(E.ctx.model.values[f.id] || ''));
          const labels = E.u.el('span', 'bank-freeze-labels', b);
          E.u.el('span', '', labels, E.ctx.model.values[f.id] || 'Freeze this card');
          E.u.el('small', '', labels, 'When frozen, new purchases, ATM withdrawals, and most transfers will be declined.');
          return;
        }
        if (f.id !== 'card') return;
        const b = E.refs[S.P.key(E, { field: f.id })];
        const text = b.querySelector('span');
        const miniature = E.u.el('span', 'bank-mini-card', b);
        E.u.el('b', '', miniature, 'Riverton Bank');
        E.u.el('span', '', miniature, '••• ' + (E.ctx.model.values.card || E.s.cards[0]).slice(-4));
        E.u.el('i', '', miniature, 'VISA');
        b.insertBefore(miniature, b.firstChild);
        const labels = E.u.el('span', 'bank-card-labels', b);
        labels.appendChild(text);
        E.u.el('small', '', labels, 'Visa • Personal card');
        b.insertBefore(labels, miniature.nextSibling);
      },
      history: (base, S) => E => {
        const { u, s, F } = E;
        const block = u.el('section', 'bk-history bank-activity', E.pane);
        const heading = u.el('div', 'bank-activity-heading', block);
        u.el('h3', '', heading, 'Recent card activity');
        const all = u.el('button', 'bank-view-all', heading, 'View all transactions');
        all.type = 'button';
        S.P.icon(E, u, all, 'arrow');
        all.addEventListener('click', () => env.log('decoy', { label: 'View all transactions' }));
        const wrap = u.el('div', 'bank-activity-table', block);
        const table = u.el('table', 'bank-records', wrap);
        const header = u.el('tr', '', u.el('thead', '', table));
        ['Date', 'Description', 'Category', 'Amount'].forEach(label => u.el('th', '', header, label));
        const body = u.el('tbody', '', table);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        s.transactions.slice(0, 6).forEach(t => {
          const row = u.el('tr', '', body);
          const [year, month, day] = t.date.split('-');
          u.el('td', '', row, `${months[Number(month) - 1]} ${Number(day)}, ${year}`);
          u.el('td', '', row, t.name);
          const category = u.el('td', '', row);
          const categoryName = t.category || 'Card purchase';
          const paths = /travel/i.test(categoryName) ? 'm3 8 7 3 7-8 3 1-6 9 6 4-1 2-7-3-4 5-2-1 2-6-6-3Z'
            : /transport/i.test(categoryName) ? 'M4 10 6 4h12l2 6M3 11h18v8H3Zm3 8v3m12-3v3M6 14h2m8 0h2'
            : /grocer/i.test(categoryName) ? 'M2 3h3l3 13h11l3-10H6M9 20h1m7 0h1'
            : /dining|food/i.test(categoryName) ? 'M4 3v7h6V3M7 3v18m11-18c-5 2-5 9 0 10v8Z'
            : /shopping/i.test(categoryName) ? 'M4 8h16v13H4Zm4 0V6a4 4 0 0 1 8 0v2' : null;
          if (paths) {
            const icon = u.svg('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, category);
            u.svg('path', { d: paths }, icon);
          } else S.P.icon(E, u, category, 'card');
          u.el('span', '', category, t.category || 'Card purchase');
          u.el('td', 'bank-record-amount', row, F.helpers.money(t.amount));
        });
      },
      drawn: (base, S) => E => {
        E.root.classList.toggle('bank-editing', E.ctx.model.view === 'edit');
        if (!E.pane.querySelector('.bank-sheet')) {
          const sheet = E.u.el('section', 'bank-sheet bank-other-view');
          const heading = E.u.el('div', 'bank-sheet-heading', sheet);
          E.u.el('h2', '', heading, E.title.textContent);
          for (const child of [...E.pane.children]) {
            if (!child.classList.contains('bank-activity')) sheet.appendChild(child);
          }
          E.pane.prepend(sheet);
        }
      },
    },
  },
});
