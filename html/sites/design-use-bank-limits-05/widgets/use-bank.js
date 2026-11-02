// Design on the shared use-bank/classic workspace; defaults reproduce this scaffold.
env.widget({
  task: 'use-bank',
  site: 'design-use-bank-limits-05',
  name: 'design',
  split: 'train',
  scenarios: ['limits'],
  template: 'use-bank/classic',
  design: {
    brand: 'Rivermere Bank',
    titles: { limits: 'Card controls' },
    font: '18px/1.35 "Times New Roman", Georgia, serif',
    parts: {
      icon: (base, S) => (E, u, parent, name, cls = '') => {
        if (name !== 'shield') return base(E, u, parent, name, cls);
        const svg = u.svg('svg', { viewBox: '0 0 24 24', fill: 'none', class: cls, 'aria-hidden': 'true' }, parent);
        u.svg('rect', { x:'2', y:'5', width:'20', height:'14', rx:'1.5', stroke:'currentColor', 'stroke-width':'1.8' }, svg);
        u.svg('path', { d:'M3 9h18M5 15h4', stroke:'currentColor', 'stroke-width':'1.8' }, svg);
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
        u.el('h2', '', title, 'Card controls');
        u.el('p', '', title, 'Manage your cards, set spending limits, and control where your cards can be used.');
        const picker = u.el('div', 'bank-card-section', sheet);
        let liveStatus, liveLimit;
        const card = s.fields.find(f => f.id === 'card');
        if (card) {
          S.P.field(E, card, picker);
          const cardControl = E.refs[S.P.key(E, { field: card.id })];
          const cardField = picker.querySelector('.bk-field');
          const live = u.el('div', 'bank-card-row bank-live-row', picker);
          picker.insertBefore(live, cardField);
          live.appendChild(cardField);
          liveStatus = u.el('div', 'bank-card-status bank-live-status', live);
          liveLimit = u.el('div', 'bank-card-limit bank-live-limit', live);
          u.el('span', 'bank-row-arrow', live, '›');
          const options = Array.isArray(s.cards) ? s.cards : [];
          const fallback = ['Everyday debit', 'Travel rewards', 'Business card', 'Student card'];
          const details = options.map((item, i) => {
            const raw = typeof item === 'string' ? item : '';
            return {
              name: (item && typeof item === 'object' && (item.name || item.label || item.title)) || raw.replace(/[•*\s-]*\d{4}$/, '').trim() || fallback[i % 4],
              digits: (item && typeof item === 'object' && (item.last4 || item.number)) || raw.match(/\d{4}/)?.[0] || '',
              type: (item && typeof item === 'object' && item.type) || (i === 0 || i === 3 ? 'Debit card' : 'Credit card'),
              limit: (item && typeof item === 'object' && item.limit) || ['$3,000','$10,000','$5,000','$1,000'][i % 4],
            };
          });
          const contextCards = [
            { name:'Business card', digits:'7781', type:'Credit card', limit:'$5,000' },
            { name:'Student card', digits:'0093', type:'Debit card', limit:'$1,000' },
          ];
          if (details.length === 2) details.push(...contextCards);
          for (const [offset, data] of details.slice(1, 4).entries()) {
            const i = offset + 1;
            const row = u.el('div', 'bank-card-row', picker);
            const digits = data.digits || String(2210 + i * 1871).slice(-4);
            const miniature = u.el('span', 'bank-mini-card', row);
            const bankLabel = u.el('b', '', miniature, 'Rivermere Bank');
            const mark = u.svg('svg', {viewBox:'0 0 40 40',fill:'none',stroke:'currentColor','stroke-width':'2.4',class:'bank-thumb-mark'}, bankLabel);
            u.svg('path',{d:'M3 12 20 4l17 8H3ZM6 16h28M6 34h28M3 38h34M9 17v15m7-15v15m8-15v15m7-15v15'},mark); bankLabel.prepend(mark);
            u.el('span', 'bank-chip', miniature); u.el('i', '', miniature, i % 2 ? '●●' : 'VISA');
            const labels = u.el('span', 'bank-card-labels', row);
            u.el('b', '', labels, data.name); u.el('span', 'bank-card-number', labels, '•••• ' + digits); u.el('small', '', labels, data.type);
            const status = u.el('span', 'bank-card-status', row);
            u.el('small', '', status, 'Status'); const pill = u.el('b', 'bank-active-pill', status); u.el('span', 'bank-status-symbol', pill, '✓'); u.el('span', '', pill, 'Active');
            const limit = u.el('span', 'bank-card-limit', row);
            u.el('small', '', limit, i === 0 || i === 3 ? 'Daily spending limit' : 'Total spending limit'); u.el('b', '', limit, data.limit);
            u.el('span', 'bank-row-arrow', row, '›');
            row.tabIndex = 0;
            row.setAttribute('role', 'button');
            const chooseCard = () => {
              if (!cardControl) return;
              cardControl.click();
            };
            row.addEventListener('click', chooseCard);
            row.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); chooseCard(); } });
          }
        }
        const spending = u.el('section', 'bank-spending-section', sheet);
        u.el('h3', '', spending, 'Spending limits');
        u.el('p', 'bank-description', spending, 'Set a daily spending limit to help manage your spending on this card.');
        const fields = s.fields.filter(f => f.id !== 'card' && f.id !== 'frozen' && f.kind !== 'transaction');
        fields.forEach(f => S.P.field(E, f, spending));
        const status = u.el('section', 'bank-status-section', sheet);
        u.el('h3', '', status, 'Card status');
        u.el('p', 'bank-description', status, "Temporarily block your card if it’s lost, stolen, or not in use.");
        const frozen = s.fields.find(f => f.id === 'frozen');
        if (frozen) S.P.field(E, frozen, status);
        if (liveStatus) {
          const control = status.querySelector('.bk-field');
          if (control) liveStatus.appendChild(control);
          else { u.el('small', '', liveStatus, 'Status'); const pill = u.el('b', 'bank-active-pill', liveStatus); u.el('span', 'bank-status-symbol', pill, '✓'); u.el('span', '', pill, 'Active'); }
        }
        if (liveLimit) {
          const control = spending.querySelector('.bank-amount-field');
          if (control) { liveLimit.appendChild(control); const input = control.querySelector('input'); if (input) input.placeholder = '3,000'; }
          else { u.el('small', '', liveLimit, 'Daily spending limit'); u.el('b', '', liveLimit, '$3,000'); }
        }
        spending.hidden = true;
        status.hidden = true;
        S.P.history(E, E.pane);
      },
      fieldDrawn: (base, S) => (E, f, box) => {
        box.dataset.field = f.id;
        if (f.id === 'card') box.querySelector('.bk-label').textContent = 'Select a card';
        if (f.id === 'frozen') box.querySelector('.bk-label').textContent = 'Status';
        if (f.kind === 'amount') box.classList.add('bank-amount-field');
      },
      choiceControl: (base, S) => (E, f, box) => {
        base(E, f, box);
        if (f.id === 'frozen') {
          const b = E.refs[S.P.key(E, { field: f.id })];
          b.replaceChildren();
          b.classList.add('bank-freeze-choice');
          E.u.el('span', 'bank-status-symbol', b, /frozen|blocked/i.test(E.ctx.model.values[f.id] || '') ? '−' : '✓');
          E.u.el('span', 'bank-freeze-labels', b, E.ctx.model.values[f.id] || 'Active');
          return;
        }
        if (f.id !== 'card') return;
        const b = E.refs[S.P.key(E, { field: f.id })];
        const text = b.querySelector('span');
        const miniature = E.u.el('span', 'bank-mini-card', b);
        const raw = E.ctx.model.values.card || E.s.cards[0];
        const digits = raw.slice(-4);
        const bankLabel = E.u.el('b', '', miniature, 'Rivermere Bank');
        const mark = E.u.svg('svg', {viewBox:'0 0 40 40',fill:'none',stroke:'currentColor','stroke-width':'2.4',class:'bank-thumb-mark'}, bankLabel);
        E.u.svg('path',{d:'M3 12 20 4l17 8H3ZM6 16h28M6 34h28M3 38h34M9 17v15m7-15v15m8-15v15m7-15v15'},mark); bankLabel.prepend(mark);
        E.u.el('span', 'bank-chip', miniature);
        E.u.el('i', '', miniature, 'VISA');
        b.insertBefore(miniature, b.firstChild);
        const labels = E.u.el('span', 'bank-card-labels', b);
        labels.appendChild(text);
        text.textContent = raw.replace(/[•*\s-]*\d{4}$/, '').trim();
        text.classList.add('bank-card-name');
        E.u.el('span', 'bank-card-number', labels, '•••• ' + digits);
        E.u.el('small', '', labels, /credit|business|travel/i.test(raw) ? 'Credit card' : 'Debit card');
        b.insertBefore(labels, miniature.nextSibling);
      },
      history: (base, S) => E => {
        const { u, s, F } = E;
        const block = u.el('section', 'bk-history bank-activity', E.pane);
        const heading = u.el('div', 'bank-activity-heading', block);
        u.el('h3', '', heading, 'Recent transactions');
        const all = u.el('button', 'bank-view-all', heading, 'View all');
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
          u.el('td', '', row, `${months[Number(month) - 1]} ${Number(day)}`);
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
