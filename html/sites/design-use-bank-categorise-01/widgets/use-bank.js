// Design on the shared use-bank/classic workspace; defaults reproduce this scaffold.
env.widget({
  task: 'use-bank',
  site: 'design-use-bank-categorise-01',
  name: 'design',
  split: 'train',
  scenarios: ['categorise'],
  template: 'use-bank/classic',
  design: {
    brand: 'RiscBank',
    inset: 0,
    radius: '0',
    font: '20px/1.25 monospace',
    parts: {
      shell: (base, S) => E => {
        const {u} = E;
        E.root.classList.toggle('rb-narrow', E.ctx.size.width < 1450);
        const layout = u.el('div', 'rb-workspace', E.root);
        const main = u.el('main', 'rb-transactions', layout);
        const head = u.el('div', 'rb-panel-heading', main);
        E.title = u.el('h2', '', head, 'Transactions');
        E.crumb = u.el('span', 'rb-hidden', head);
        E.stateBadge = u.el('span', 'rb-hidden', head);
        const filters = u.el('div', 'rb-filters', main);
        u.el('span', '', filters, 'Account:');
        const account = S.P.localButton(E, filters, E.s.accounts[0].label,
          () => S.P.popup(E, 'Account', E.s.accounts.map(a => a.label).join('\n')), 'rb-inset rb-account-filter');
        u.el('i', 'rb-arrow', account);
        u.el('span', 'rb-range-label', filters, 'Time range:');
        const range = S.P.localButton(E, filters, 'Last 30 days',
          () => S.P.popup(E, 'Time range', 'Last 30 days / Posted transactions'), 'rb-inset rb-range-filter');
        u.el('i', 'rb-arrow', range);
        const tableWrap = u.el('div', 'rb-table-wrap', main);
        E.pane = u.el('div', 'bk-scroll rb-table-scroll', tableWrap);
        const rail = u.el('div', 'rb-scroll-rail', tableWrap);
        const up = S.P.localButton(E, rail, '▲', () => { E.pane.scrollTop -= 120; }, 'rb-scroll-end');
        up.setAttribute('aria-label', 'Scroll transactions up');
        const track = u.el('div', 'rb-scroll-track', rail);
        const thumb = u.el('div', 'rb-scroll-thumb', track);
        const down = S.P.localButton(E, rail, '▼', () => { E.pane.scrollTop += 120; }, 'rb-scroll-end');
        down.setAttribute('aria-label', 'Scroll transactions down');
        E.refreshScroll = () => {
          const ratio = Math.min(1, E.pane.clientHeight / Math.max(1, E.pane.scrollHeight));
          const height = Math.max(28, track.clientHeight * ratio);
          thumb.style.height = `${height}px`;
          thumb.style.top = `${(track.clientHeight-height) * E.pane.scrollTop / Math.max(1, E.pane.scrollHeight-E.pane.clientHeight)}px`;
        };
        const scrollAt = event => {
          const bounds = track.getBoundingClientRect();
          const grip = thumb.getBoundingClientRect().height;
          const ratio = Math.max(0, Math.min(1, (event.clientY-bounds.top-grip/2) / Math.max(1,bounds.height-grip)));
          E.pane.scrollTop = ratio * (E.pane.scrollHeight-E.pane.clientHeight);
          E.refreshScroll();
        };
        track.addEventListener('pointerdown', event => {
          event.preventDefault(); track.setPointerCapture(event.pointerId); scrollAt(event);
        });
        track.addEventListener('pointermove', event => {
          if (track.hasPointerCapture(event.pointerId)) scrollAt(event);
        });
        E.pane.addEventListener('scroll', () => { E.refreshScroll(); S.P.mirror(E); });
        E.footer = u.el('div', 'bk-footer rb-form-footer', main);
        E.inspector = u.el('aside', 'rb-inspector', layout);
      },
      spending: (base, S) => E => {},
      searchBox: (base, S) => E => {
        E.tableHost = E.u.el('div', 'rb-table-host', E.pane);
        S.P.table(E);
      },
      table: (base, S) => E => {
        const {ctx, s, u} = E;
        E.tableHost.replaceChildren();
        const q = ctx.model.search.toLowerCase();
        const xs = s.transactions.filter(t => `${t.id} ${t.name} ${t.date}`.toLowerCase().includes(q));
        const table = u.el('table', 'bk-table rb-table', E.tableHost);
        const head = u.el('tr', '', u.el('thead', '', table));
        ['Date ▴', 'ID', 'Merchant / Description', 'Amount', 'Category'].forEach((name, i) => {
          const cell = u.el('th', '', head, name);
          cell.style.width = ['16%', '11%', '36%', '13.5%', '23.5%'][i];
        });
        const body = u.el('tbody', '', table);
        xs.forEach(t => S.P.transaction(E, t, body));
        if (!xs.length) u.el('div', 'bk-empty', E.tableHost, 'No matching transactions');
        S.P.mirror(E);
      },
      transaction: (base, S) => (E, t, body) => {
        const {ctx, u, F} = E;
        const selected = E.selectedTransaction || E.s.transactions[0].id;
        const row = u.el('tr', t.id === selected ? 'rb-selected' : '', body);
        const date = t.date.split('-');
        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        u.el('td', '', row, `${months[Number(date[1])-1]} ${date[2]}, ${date[0]}`);
        u.el('td', '', row, t.id);
        u.el('td', 'rb-merchant-name', row, t.name);
        u.el('td', 'bk-num', row, F.helpers.money(t.amount));
        const category = u.el('td', '', row);
        const button = S.P.button(E, category, ctx.model.values[t.id], {field:t.id}, {open:t.id}, 'rb-category');
        button.setAttribute('aria-label', `${t.id} category`);
        button.setAttribute('aria-haspopup', 'dialog');
        u.el('i', 'rb-arrow', button);
        row.addEventListener('click', event => {
          if (event.target.closest('button')) return;
          E.selectedTransaction = t.id;
          S.P.draw(E);
        });
      },
      drawn: (base, S) => E => {
        base(E);
        E.refreshScroll();
        const {ctx, s, u, F} = E;
        const t = s.transactions.find(t => t.id === E.selectedTransaction) || s.transactions[0];
        const side = E.inspector;
        side.replaceChildren();
        u.el('div', 'rb-panel-heading', side, 'Transaction Details');
        const content = u.el('div', 'rb-inspector-content', side);
        const row = (label, value, parent = content) => {
          const line = u.el('div', 'rb-detail-row', parent);
          u.el('span', 'rb-detail-label', line, label);
          const val = u.el('span', 'rb-detail-value', line, value);
          return val;
        };
        const date = t.date.split('-');
        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        row('Date:', `${months[Number(date[1])-1]} ${date[2]}, ${date[0]}`);
        row('Transaction ID:', t.id);
        row('Merchant:', t.name);
        row('Description:', `${t.name}\nCard Purchase`);
        u.el('hr', '', content);
        row('Amount:', F.helpers.money(t.amount));
        const category = row('Category:', '');
        const picker = S.P.localButton(E, category, ctx.model.values[t.id],
          () => S.P.change(E, {open:t.id}), 'rb-inset rb-inspector-category');
        u.el('i', 'rb-arrow', picker);
        u.el('hr', '', content);
        row('Account:', s.accounts[0].label);
        row('Card:', s.cards[0]);
        row('Type:', 'Card Purchase');
        row('Status:', 'Posted');
        const merchant = u.el('section', 'rb-merchant-info', side);
        u.el('div', 'rb-panel-heading', merchant, 'Merchant Information');
        u.el('p', '', merchant, t.name);
        u.el('p', '', merchant, 'Card purchase');
        u.el('p', '', merchant, `Transaction ${t.id}`);
        if (ctx.model.view === 'edit') {
          E.footer.querySelector('small')?.remove();
          const search = S.P.ref(E, {search:true}, u.el('input', 'bk-control rb-footer-search', E.footer));
          search.type = 'text'; search.placeholder = 'Search transactions';
          search.setAttribute('aria-label', 'Search transactions'); search.value = ctx.model.search;
          search.addEventListener('input', () => {
            S.P.change(E, {search:search.value}, false); S.P.table(E); ctx.reanchor([E.root]);
          });
          E.footer.prepend(search);
        }
      },
    },
  },
});
