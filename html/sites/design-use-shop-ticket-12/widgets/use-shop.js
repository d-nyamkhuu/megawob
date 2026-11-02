// Design of this site on the use-shop/adapted template (templates/use-shop/adapted.js): the controls hide behind a
// "Show controls" button, tall rows with split departure and arrival, route and date written into the site's header.
(function () {
  'use strict';
  env.widget({
    task: 'use-shop',
    site: 'design-use-shop-ticket-12',
    name: 'design',
    split: 'train',
    scenarios: ['ticket'],
    template: 'use-shop/adapted',
    design: {
      reveal: 'ticket',
      ticketGap: 1,
      headInFooter: false,
      selectionPane: false,
      parts: {
        ticketHeadHook: () => (V) => {
          const { spec, fam } = V;
          const route = document.querySelector('.design-route');
          const tripDate = document.querySelector('.design-when');
          if (route) route.textContent = spec.tickets[0].place;
          if (tripDate) tripDate.textContent = `${fam.fmtDate(spec.tickets[0].date)}  |  1 adult`;
        },
        ticketColumns: () => (V) => {
          const { util, main } = V;
          const cols = util.el('div', 'tk-cols', V.main);
          for (const c of ['Operator', 'Depart', 'Arrive', 'Duration', 'Price'])
            util.el('span', 'tk-c-' + c.toLowerCase(), cols, c);
        },
        ticketPitch: (base, S) => (V) => {
          const { ctx, spec, rng, pane, gap } = V;
          const { pitchFor, mirrorPitch } = S.H;
          V.pitch = pitchFor(pane, V.body, spec.rows, gap, 36, Math.max(rng.int(80, 92), 134), 72);
          const pitch = V.pitch;
          pane.style.setProperty('--ticket-pitch', pitch + 'px');
          pane.style.height = spec.rows * pitch - gap + 2 + 'px';
          mirrorPitch(ctx, pitch);
        },
        ticketRow: (base, S) => (V, i) => {
          const { util, spec, fam, fmt, ev, rowsEl, buyEl, buy } = V;
          const { btn } = S.H;
          const t = spec.tickets[i];
          const r = util.el('div', 'tk-row');
          r.dataset.role = 'ticket';
          const d = util.el('div', 'tk-date', r);
          util.el('div', 'tk-dw', d, fam.fmtDate(t.date).slice(0, 3));
          util.el('div', 'tk-dd', d, String(+t.date.slice(8)));
          util.el('div', 'tk-dm', d, fam.MONTHS[+t.date.slice(5, 7) - 1].slice(0, 3));
          const info = util.el('div', 'tk-info', r);
          util.el('div', 'tk-name', info, t.name);
          util.el('div', 'tk-place', info, `${fam.fmtDate(t.date)} · ${t.code}${ev ? ' · ' + t.place : ''}`);
          const w = util.el('div', 'tk-when', r);
          const tm = util.el('div', 'tk-time', w);
          if (ev) tm.textContent = `Starts ${fam.fmtTime(t.time)}`;
          else {
            tm.textContent = `${fam.fmtTime(t.time)} → ${fam.fmtTime(t.time + t.dur)}`;
            if (t.time + t.dur >= 1440) util.el('sup', '', tm, '+1');
            w.classList.add('tk-split');
            const ends = String(t.place).split(/\s*→\s*/);
            const dep = util.el('div', 'tk-dep', w);
            util.el('b', '', dep, fam.fmtTime(t.time));
            util.el('span', '', dep, ends[0] || '');
            const arr = util.el('div', 'tk-arr', w);
            const arrivalTime = util.el('b', '', arr, fam.fmtTime(t.time + t.dur));
            if (t.time + t.dur >= 1440) util.el('sup', '', arrivalTime, '+1');
            util.el('span', '', arr, ends[1] || '');
          }
          util.el('div', 'tk-dur', w, ev ? `Length ${fam.fmtDur(t.dur)}` : fam.fmtDur(t.dur));
          util.el('div', 'tk-price', r, fmt(t.price));
          const b = btn(util, 'as-btn primary tk-buy', r, 'Buy', 'buy');
          b.addEventListener('click', () => buy(i));
          rowsEl[i] = r;
          buyEl[i] = b;
          return r;
        },
        paintSelection: () => (V, m, t) => {
          const end = document.querySelector('.end-control');
          if (end) end.classList.toggle('is-ready', !!t);
        },
      },
    },
  });
})();
