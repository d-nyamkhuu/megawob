// Keeps this site's Mac ticket workbench, selectable rows, and compact timetable presentation.
env.widget({
  task: 'use-shop',
  site: 'design-use-shop-ticket-03',
  name: 'design',
  split: 'train',
  scenarios: ['ticket'],
  template: 'use-shop/store',
  design: {
    buyLabel: 'Buy ticket',
    boughtLabel: 'Bought',
    parts: {
      ticketHeadMid: () => () => {},
      ticketHead: (base) => (V) => {
        base(V);
        V.main.classList.toggle('events', V.ev);
        const briefing = document.querySelector('.mac-details');
        if (!briefing) return;
        const first = V.spec.tickets[0];
        const route = first.place.split(/\s*[→–]\s*/);
        document.querySelector('.mac-trip').textContent = V.ev
          ? `Compare tickets for ${first.place}.`
          : `You are planning a trip from ${route[0]}${route[1] ? ' to ' + route[1] : ''}.`;
        const dates = [...new Set(V.spec.tickets.map((t) => t.date))];
        const rows = (V.ev
          ? [['Venue:', first.place]]
          : [['From:', route[0]], ['To:', route[1] || first.place]]).concat([
          ['Dates:', dates.length > 1 ? 'See ticket rows' : V.fam.fmtDate(first.date)],
          ['Passengers:', '1'],
        ]);
        for (const [label, value] of rows) {
          V.util.el('dt', '', briefing, label);
          V.util.el('dd', '', briefing, value);
        }
        const options = [...document.querySelectorAll('.mac-mi')].find((el) => el.textContent === 'Options');
        options.setAttribute('role', 'button');
        options.tabIndex = 0;
        const toggleSort = () => V.sort.classList.toggle('open');
        options.addEventListener('click', toggleSort);
        options.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') toggleSort();
        });
        V.x.menuOptions = options;
      },
      ticketColumns: () => (V) => {
        const columns = V.util.el('div', 'tk-columns', V.head);
        for (const label of ['Select', 'Operator', 'Departure', 'Arrival', 'Duration', 'Price'])
          V.util.el('span', '', columns, label);
      },
      ticketFoot: () => () => {},
      ticketPitch: (base, S) => (V) => {
        const sampledPitch = V.rng.int(80, 92);
        V.pitch = S.H.pitchFor(V.pane, V.body, V.spec.rows, V.gap, 32, sampledPitch, 48);
        V.pane.style.height = V.spec.rows * V.pitch - V.gap + 2 + 'px';
        S.H.mirrorPitch(V.ctx, V.pitch);
      },
      ticketSetup: () => (V) => {
        V.x.selected = null;
        V.x.selectRow = (i) => {
          V.x.selected = i;
          for (const [key, el] of Object.entries(V.rowsEl)) {
            el.classList.toggle('sel', +key === i);
            el.querySelector('.tk-buy').setAttribute('aria-checked', String(+key === i));
          }
        };
        V.ctx.stage.clearSelection = () => V.x.selectRow(null);
        V.ctx.stage.buySelected = () => {
          if (V.x.selected !== null) V.buy(V.x.selected);
        };
      },
      ticketRow: (base, S) => (V, i) => {
        const { util, spec, fam, fmt, ev, rowsEl, buyEl } = V;
        const t = spec.tickets[i];
        const r = util.el('div', 'tk-row');
        r.dataset.role = 'ticket';
        const d = util.el('div', 'tk-date', r);
        util.el('div', 'tk-dw', d, fam.fmtDate(t.date).slice(0, 3));
        util.el('div', 'tk-dd', d, String(+t.date.slice(8)));
        util.el('div', 'tk-dm', d, fam.MONTHS[+t.date.slice(5, 7) - 1].slice(0, 3));
        const icon = util.el('span', 'tk-vehicle', r);
        icon.innerHTML = spec.kind === 'train'
          ? '<svg viewBox="0 0 40 48"><path d="M13 2h14v4h5v32h-3l6 8h-5l-5-8H15l-5 8H5l6-8H8V6h5z"/><path d="M12 10h16v14H12z" fill="white"/><path d="M15 5h10" stroke="white" stroke-width="2"/><circle cx="14" cy="30" r="2" fill="white"/><circle cx="26" cy="30" r="2" fill="white"/></svg>'
          : spec.kind === 'event'
            ? '<svg viewBox="0 0 40 48"><path d="M9 3h24v29H19V12H9z"/><ellipse cx="11" cy="37" rx="9" ry="7"/></svg>'
            : '<svg viewBox="0 0 40 48"><path d="M6 6h28l4 5v29h-4v5h-6v-5H12v5H6v-5H2V11z"/><path d="M6 12h28v17H6z" fill="white"/><circle cx="9" cy="35" r="2.5" fill="white"/><circle cx="31" cy="35" r="2.5" fill="white"/></svg>';
        const info = util.el('div', 'tk-info', r);
        util.el('div', 'tk-name', info, t.name);
        util.el('div', 'tk-place', info, ev ? `${fam.fmtDate(t.date)} · ${t.place}` : fam.fmtDate(t.date));
        const w = util.el('div', 'tk-when', r);
        const clockLabel = (n) => {
          n = ((n % 1440) + 1440) % 1440;
          const h = Math.floor(n / 60);
          return `${String(h % 12 || 12).padStart(2, '0')}:${String(n % 60).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
        };
        const tm = util.el('div', 'tk-time', w);
        if (ev) tm.textContent = clockLabel(t.time);
        else {
          tm.textContent = clockLabel(t.time);
          const arrival = util.el('div', 'tk-arrival', w, clockLabel(t.time + t.dur));
          if (t.time + t.dur >= 1440) util.el('sup', '', arrival, '+1');
        }
        if (ev) util.el('div', 'tk-arrival', w, clockLabel(t.time + t.dur));
        util.el('div', 'tk-dur', w, fam.fmtDur(t.dur));
        util.el('div', 'tk-price', r, fmt(t.price));
        const b = S.H.btn(util, 'as-btn primary tk-buy', r, '', 'buy');
        b.setAttribute('role', 'radio');
        b.setAttribute('aria-label', `Select ${t.name}, ${fmt(t.price)}`);
        b.addEventListener('click', () => V.x.selectRow(i));
        r.addEventListener('click', (e) => {
          if (e.target !== b) V.x.selectRow(i);
        });
        rowsEl[i] = r;
        buyEl[i] = b;
        r.classList.toggle('sel', V.x.selected === i);
        b.setAttribute('aria-checked', String(V.x.selected === i));
        return r;
      },
      ticketPaint: (base) => (V, m) => {
        base(V, m);
        for (const b of Object.values(V.buyEl)) b.textContent = '';
        const ticket = m.bought !== null ? V.spec.tickets[m.bought] : null;
        document.querySelector('.mac-buy').textContent = ticket ? 'Bought' : 'Buy ticket';
        V.foot.hidden = !ticket;
      },
      ticketLocate: (base, S) => (V, t) => {
        if (t.buy !== undefined)
          return V.x.selected === t.buy
            ? S.H.where(document.querySelector('.mac-buy'), 'Buy ticket')
            : S.H.where(V.buyEl[t.buy], `Select ${t.buy}`);
        if (t.sort && V.sort.classList.contains('open')) return V.dd.locateTrigger();
        if (t.sort && V.x.menuOptions) return S.H.where(V.x.menuOptions, 'Options');
        return base(V, t);
      },
    },
  },
});
