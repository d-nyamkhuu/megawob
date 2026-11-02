// Design on the shared use-bank/classic workspace; defaults reproduce this scaffold.
env.widget({
  task: 'use-bank',
  site: 'design-use-bank-dispute-02',
  name: 'design',
  split: 'train',
  scenarios: ['dispute'],
  template: 'use-bank/classic',
  design: {
    inset: 0,
    brand: 'Pioneer National Bank',
    background: '#c4c4c4',
    panel: '#c7c7c7',
    foreground: '#111',
    muted: '#333',
    line: '#888',
    accent: '#00869f',
    radius: '0',
    choicePlaceholder: '',
    font: '18px/1.2 "Arial Narrow", "Liberation Sans Narrow", Arial, sans-serif',
    parts: {
      draw: (base, S) => (E) => {
        const sameView = E.lastView === E.ctx.model.view;
        const scroll = E.tableHost?.isConnected ? E.tableHost.scrollTop : 0;
        base(E);
        if (E.ctx.model.view === 'edit' && E.tableHost?.isConnected) {
          if (sameView) E.tableHost.scrollTop = scroll;
          E.syncTableScroll?.();
        }
      },
      shell: (base, S) => (E) => {
        const { u } = E;
        const state = u.el('div', 'os2-template-state', E.root);
        E.crumb = u.el('span', '', state);
        E.title = u.el('span', '', state);
        E.stateBadge = u.el('span', '', state);
        E.pane = u.el('div', 'bk-scroll os2-workpane', E.root);
        E.footer = u.el('div', 'bk-footer', E.root);
        E.pane.addEventListener('scroll', () => S.P.mirror(E));
      },
      edit: (base, S) => (E) => {
        const { u, ctx, s } = E, P = S.P;
        const select = u.el('section', 'os2-selection', E.pane);
        u.el('h2', 'os2-section-title', select, 'Select a Transaction to Dispute');
        const pane = E.pane;
        E.pane = select;
        P.searchBox(E);
        E.pane = pane;
        const details = u.el('section', 'os2-dispute-details', pane);
        u.el('h2', 'os2-section-title', details, 'Dispute Details');
        const grid = u.el('div', 'bk-grid os2-dispute-grid', details);
        s.fields.filter(f => f.kind !== 'transaction').forEach(f => P.field(E, f.options ? f : {...f, kind:'details'}, grid));
        if (Object.keys(ctx.model.invalid).length) {
          u.el('div', 'bk-error', E.footer, 'Check the highlighted information.');
        }
        P.button(E, E.footer, 'Review changes', {nav:'review'}, {nav:'review'}, 'primary', 'arrow');
      },
      searchBox: (base, S) => (E) => {
        const { u, ctx, s } = E, P = S.P;
        const bar = u.el('div', 'os2-filters', E.pane);
        const account = u.el('label', 'os2-account-filter', bar);
        u.el('span', '', account, 'Account:');
        const wrap = u.el('div', 'os2-account-input', account);
        const input = P.ref(E, {search:true}, u.el('input', 'bk-control', wrap));
        input.type = 'text'; input.value = ctx.model.search;
        input.placeholder = s.cards[0];
        input.setAttribute('aria-label', S.D.searchPlaceholder);
        input.title = S.D.searchPlaceholder;
        u.el('span', 'os2-picker-arrow', wrap, '▾');
        input.addEventListener('input', () => {
          P.change(E, {search:input.value}, false); P.table(E);
        });
        const dates = u.el('div', 'os2-date-filter', bar);
        u.el('span', '', dates, 'Date range:');
        P.localButton(E, dates, 'Last 90 days', () => P.popup(E, 'Transaction filters', 'Account: All personal accounts\nDate range: February 1–28, 2027\nStatus: Posted'), 'os2-date-button');
        P.localButton(E, bar, 'Refresh', () => P.table(E), 'os2-refresh');
        if (ctx.model.values.transaction) {
          P.button(E, bar, 'Change transaction', {field:'transaction'}, {set:['transaction','']}, 'os2-change');
        }
        const frame = u.el('div', 'os2-table-frame', E.pane);
        E.tableHost = u.el('div', 'os2-transactions', frame);
        P.ref(E, {pane:true}, E.tableHost);
        const scrollbar = u.el('div', 'os2-table-scrollbar', frame);
        P.localButton(E, scrollbar, '▲', () => { E.tableHost.scrollTop -= 100; P.mirror(E); }, 'os2-scroll-arrow');
        const track = u.el('div', 'os2-scroll-track', scrollbar);
        const thumb = u.el('div', 'os2-scroll-thumb', track);
        thumb.setAttribute('role', 'scrollbar'); thumb.setAttribute('aria-label', 'Transactions');
        thumb.setAttribute('aria-orientation', 'vertical');
        const syncScroll = () => {
          const host = E.tableHost;
          const fraction = Math.min(.6, Math.max(.18, host.clientHeight / Math.max(host.scrollHeight, 1)));
          thumb.style.height = `${fraction * 100}%`;
          thumb.style.top = `${(1 - fraction) * (host.scrollTop / Math.max(1, host.scrollHeight - host.clientHeight)) * 100}%`;
          P.mirror(E);
        };
        E.syncTableScroll = syncScroll;
        E.tableHost.addEventListener('scroll', syncScroll);
        let grab = null;
        thumb.addEventListener('pointerdown', event => {
          grab = {y:event.clientY, scroll:E.tableHost.scrollTop};
          thumb.setPointerCapture(event.pointerId); event.preventDefault();
        });
        thumb.addEventListener('pointermove', event => {
          if (!grab) return;
          const range = E.tableHost.scrollHeight - E.tableHost.clientHeight;
          const travel = track.clientHeight - thumb.clientHeight;
          E.tableHost.scrollTop = grab.scroll + (event.clientY - grab.y) * range / Math.max(1, travel);
        });
        thumb.addEventListener('pointerup', () => { grab = null; });
        track.addEventListener('click', event => {
          if (event.target === track) E.tableHost.scrollTop += (event.clientY < thumb.getBoundingClientRect().top ? -1 : 1) * E.tableHost.clientHeight;
        });
        P.localButton(E, scrollbar, '▼', () => { E.tableHost.scrollTop += 100; P.mirror(E); }, 'os2-scroll-arrow');
        P.table(E);
      },
      mirror: (base, S) => (E) => {
        const pane = E.pane;
        if (E.ctx.model.view === 'edit' && E.tableHost?.isConnected) E.pane = E.tableHost;
        base(E);
        E.pane = pane;
      },
      textControl: (base, S) => (E, field, box) => {
        base(E, field, box);
        const input = E.inputs[field.id];
        if (input.tagName !== 'TEXTAREA') return;
        input.parentElement.classList.add('os2-text-input');
        const scroll = E.u.el('div', 'os2-text-scrollbar', input.parentElement);
        S.P.localButton(E, scroll, '▲', () => { input.scrollTop -= 50; }, 'os2-scroll-arrow');
        const track = E.u.el('div', 'os2-scroll-track', scroll);
        S.P.localButton(E, scroll, '▼', () => { input.scrollTop += 50; }, 'os2-scroll-arrow');
        track.addEventListener('click', event => { input.scrollTop += event.offsetY < track.clientHeight / 2 ? -50 : 50; });
      },
      table: (base, S) => (E) => {
        const { ctx, s, u } = E;
        E.tableHost.replaceChildren();
        const q = ctx.model.search.toLowerCase();
        const xs = s.transactions.filter(t => `${t.id} ${t.name} ${t.date}`.toLowerCase().includes(q));
        const table = u.el('table', 'bk-table os2-transaction-table', E.tableHost);
        const head = u.el('tr', '', u.el('thead', '', table));
        ['Transaction ID', 'Date  ▲', 'Merchant', 'Amount', 'Category'].forEach((text, i) => {
          const cell = u.el('th', '', head, text);
          cell.style.width = ['18%','14%','32%','15%','21%'][i];
        });
        const body = u.el('tbody', '', table);
        xs.forEach(t => S.P.transaction(E, t, body));
        if (!xs.length) u.el('div', 'bk-empty', E.tableHost, 'No matching transactions');
        S.P.mirror(E);
      },
      transaction: (base, S) => (E, t, body) => {
        const { u, ctx, F } = E;
        const selected = ctx.model.values.transaction === t.id;
        const row = S.P.ref(E, {transaction:t.id}, u.el('tr', selected ? 'os2-selected' : '', body));
        row.tabIndex = 0; row.setAttribute('role', 'button');
        row.setAttribute('aria-label', `Dispute ${t.id}, ${t.name}`);
        row.setAttribute('aria-pressed', String(selected));
        [t.id, t.date, t.name, F.helpers.money(t.amount), t.category || 'Card purchase'].forEach(text => u.el('td', '', row, text));
        const choose = () => S.P.change(E, {transaction:t.id});
        row.addEventListener('click', choose);
        row.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(); } });
      },
      drawn: (base, S) => (E) => {
        E.root.classList.toggle('os2-editing', E.ctx.model.view === 'edit' && !E.ctx.model.bankUI?.preview);
        const card = document.querySelector('.os2-card-name');
        if (card) card.textContent = E.s.cards[0];
        const account = document.querySelector('.os2-summary-card-number');
        if (account) account.textContent = E.s.cards[0].slice(-4);
        const recent = document.querySelector('.os2-recent-body');
        if (recent) {
          recent.replaceChildren();
          E.s.transactions.slice().sort((a,b) => b.date.localeCompare(a.date)).slice(0,5).forEach(t => {
            const row = E.u.el('div', 'os2-recent-row', recent);
            [t.date,t.name,E.F.helpers.money(t.amount)].forEach(text => E.u.el('span','',row,text));
          });
        }
      },
    },
  },
});
