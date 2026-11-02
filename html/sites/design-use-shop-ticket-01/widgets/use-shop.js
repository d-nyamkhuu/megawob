// RouteFinder design: route summary controls, comparison columns, and split time details.
(function () {
  'use strict';
  env.widget({
    task: 'use-shop',
    site: 'design-use-shop-ticket-01',
    name: 'design',
    split: 'train',
    scenarios: ['ticket'],
    template: 'use-shop/adapted',
    design: {
      brand: 'RouteFinder 2014 – Bus Tickets',
      css: '\n.task-note{font-size:17px;background:#1c3b54;padding:25px 17px}.design-header{background:linear-gradient(#c4d6e7,#849cb3);color:#0c1820}.design-nav{color:#233240}.tk-row{border:1px solid #3b5d74}.tk-buy{background:linear-gradient(#d9eafa,#a9c8e2);color:#0b2538;border:1px solid #93b3ce}.tk-pane{border-color:#55758a}.end-control{background:linear-gradient(#bedef7,#78a9cd);color:#092035}.tk-date{display:none}.tk-main{background:#122b3d}.tk-head{border-bottom:1px solid #496d87;padding-bottom:12px}.tk-info{min-width:150px}.tk-sort{font-size:12px}',
      ticketGap: 1,
      headInFooter: false,
      selectionPane: false,
      parts: {
        ticketHeadHook: (base, S) => (V) => {
          const { util, fam, spec, main, head } = V;
          const form = util.el('div', 'route-controls', main);
          for (const [label, value] of [
            ['From', spec.tickets[0].place.split(' → ')[0]],
            ['To', spec.tickets[0].place.split(' → ')[1] || spec.tickets[0].place],
            ['Date', spec.tickets[0].date],
          ]) {
            const fieldLabel = util.el('label', `route-${label.toLowerCase()}`, form, label);
            const field = util.el('span', 'route-field', fieldLabel);
            const input = util.el('input', '', field);
            input.value = label === 'Date' ? `${fam.fmtDate(value)}, ${value.slice(0, 4)}` : value;
            input.readOnly = true;
            if (label === 'Date') {
              const calendar = util.el('span', 'route-calendar', field);
              calendar.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5h18v16H3zM3 9h18M7 2v6M17 2v6" fill="none" stroke="currentColor" stroke-width="2"/><path d="M7 12h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2zm-8 4h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z" fill="currentColor"/></svg>';
            }
          }
          const search = S.H.btn(util, 'route-search', form, 'Search');
          search.addEventListener('click', () => env.log('decoy', { what: 'search route' }));
          main.insertBefore(form, head);
        },
        ticketTitle: () => () => 'Available Tickets',
        ticketColumns: () => (V) => {
          const columns = V.util.el('div', 'ticket-columns', V.main);
          for (const name of ['Select', 'Departure', 'Arrival', 'Duration', 'Operator', 'Price', ''])
            V.util.el('b', '', columns, name);
        },
        ticketPitch: (base, S) => (V) => {
          const { ctx, spec, rng, pane, gap, body } = V;
          const pitch = rng.int(80, 92);
          V.pitch = S.H.pitchFor(pane, body, spec.rows, gap, 36, pitch, 6);
          pane.style.height = spec.rows * V.pitch - gap + 2 + 'px';
          S.H.mirrorPitch(ctx, V.pitch);
        },
        ticketRow: (base, S) => (V, i) => {
          const { util, spec, fam, fmt, ev, rowsEl, buyEl, buy } = V;
          const { btn } = S.H;
          const t = spec.tickets[i];
          const r = util.el('div', 'tk-row');
          if (ev) r.classList.add('ticket-event');
          r.dataset.role = 'ticket';
          const timeLabel = (minutes) => {
            const normalized = ((minutes % 1440) + 1440) % 1440;
            const hour = Math.floor(normalized / 60);
            return `${String(hour % 12 || 12).padStart(2, '0')}:${String(normalized % 60).padStart(2, '0')} ${hour < 12 ? 'AM' : 'PM'}`;
          };
          const select = util.el('div', 'ticket-select', r);
          const radio = util.el('input', 'ticket-radio', select);
          radio.type = 'radio';
          radio.name = 'ticket';
          radio.addEventListener('change', () => env.log('decoy', { what: 'select ticket ' + i }));
          const d = util.el('div', 'tk-date', r);
          const depart = util.el('div', 'ticket-depart', r, timeLabel(t.time));
          util.el('small', '', depart, fam.fmtDate(t.date));
          const arrive = util.el('div', 'ticket-arrive', r, timeLabel(t.time + t.dur));
          util.el('small', '', arrive, fam.fmtDate(t.date) + (t.time + t.dur >= 1440 ? ' +1 day' : ''));
          util.el('div', 'ticket-duration', r, fam.fmtDur(t.dur));
          util.el('div', 'tk-dw', d, fam.fmtDate(t.date).slice(0, 3));
          util.el('div', 'tk-dd', d, String(+t.date.slice(8)));
          util.el('div', 'tk-dm', d, fam.MONTHS[+t.date.slice(5, 7) - 1].slice(0, 3));
          const info = util.el('div', 'tk-info', r);
          const name = util.el('div', 'tk-name', info, t.name);
          name.dataset.operator = t.name;
          if (!ev) util.el('small', 'tk-code', info, t.code);
          util.el('div', 'tk-place', info, ev ? `${t.place} · ${t.code}` : t.place);
          const when = util.el('div', 'tk-when', r);
          const time = util.el('div', 'tk-time', when);
          if (ev) time.textContent = `Starts ${fam.fmtTime(t.time)}`;
          else {
            time.textContent = `${fam.fmtTime(t.time)} → ${fam.fmtTime(t.time + t.dur)}`;
            if (t.time + t.dur >= 1440) util.el('sup', '', time, '+1');
          }
          util.el('div', 'tk-dur', when, `${ev ? 'Length' : 'Duration'} ${fam.fmtDur(t.dur)}`);
          util.el('div', 'tk-price', r, fmt(t.price));
          const button = btn(util, 'as-btn primary tk-buy', r, 'Buy', 'buy');
          button.addEventListener('click', () => buy(i));
          rowsEl[i] = r;
          buyEl[i] = button;
          return r;
        },
        built: (base, S) => (V) => {
          const label = document.querySelector('.footer-label');
          if (label) label.textContent = `${V.spec.tickets.length} results`;
          base(V);
        },
      },
    },
  });
})();
