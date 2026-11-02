// Adds operator branding, a column header, and selection controls to the shared ticket store.
env.widget({
  task: 'use-shop',
  site: 'design-use-shop-ticket-10',
  name: 'design',
  split: 'train',
  scenarios: ['ticket'],
  template: 'use-shop/store',
  design: {
    ticketGap: 12,
    buyLabel: 'Select',
    parts: {
      ticketHeadMid: () => () => {},
      paintSort: () => (V, m) => {
        V.dd.set({ value: m.sort });
        V.tval.textContent = V.fam.SORTS.find(([k]) => k === m.sort)[1];
        for (const [k, el] of Object.entries(V.optEls)) el.classList.toggle('sel', k === m.sort);
      },
      ticketColumns: () => (V) => {
        const columns = V.util.el('div', 'tk-columns', V.main);
        for (const label of ['Operator', 'Route', 'Departs', 'Arrives', 'Duration', 'Price', ''])
          V.util.el('span', '', columns, label);
      },
      ticketPitch: (base, S) => (V) => {
        const { ctx, spec, rng, body, pane, main, gap } = V;
        const sampledPitch = rng.int(80, 92);
        V.pitch = S.H.pitchFor(pane, body, spec.rows, gap, 60, sampledPitch + 100, 12);
        pane.style.height = spec.rows * V.pitch - gap + 2 + 'px';
        S.H.mirrorPitch(ctx, V.pitch);
      },
      ticketRow: (base, S) => (V, i) => {
        const { util, spec, fam, fmt, ev, rowsEl, buyEl, buy } = V;
        const t = spec.tickets[i];
        const r = util.el('div', 'tk-row');
        r.dataset.role = 'ticket';
        const operator = util.el('div', 'tk-operator', r);
        const logo = util.el('div', 'tk-operator-logo', operator);
        const polar = /polar/i.test(t.name);
        const sunrise = /sun/i.test(t.name);
        logo.style.color = polar ? '#105580' : sunrise ? '#c68c29' : '#1b6746';
        operator.style.color = polar ? '#104c77' : sunrise ? '#251d15' : '#175737';
        logo.innerHTML = polar
          ? '<svg viewBox="0 0 80 42"><path d="M2 38L24 15l9 9L43 3l35 35z" fill="currentColor" stroke="#143f60"/><path d="M24 15l-8 14 8-4 6 6 4-7 9-19 10 16-8-6-6 9-6 8 17 6H9z" fill="#f9f7ed"/></svg>'
          : sunrise
            ? '<svg viewBox="0 0 80 42" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 38a23 23 0 0 1 46 0z" fill="currentColor"/><path d="M40 0v10M20 4l4 10M5 16l10 6M0 32l11 2M60 4l-4 10M75 16l-10 6M80 32l-11 2"/></svg>'
            : '<svg viewBox="0 0 80 42" fill="currentColor"><path d="M25 10L13 28h6l-9 11h30l-9-11h6zM43 0L30 22h6L25 39h35L49 22h7zM64 10L52 29h6l-8 10h27l-8-10h6z"/></svg>';
        util.el('div', 'tk-name', operator, t.name);
        const d = util.el('div', 'tk-date', operator);
        util.el('div', 'tk-dw', d, fam.fmtDate(t.date).slice(0, 3));
        util.el('div', 'tk-dd', d, String(+t.date.slice(8)));
        util.el('div', 'tk-dm', d, fam.MONTHS[+t.date.slice(5, 7) - 1].slice(0, 3));
        const info = util.el('div', 'tk-info', r);
        const route = util.el('div', 'tk-place', info, ev ? `${t.place} · ${t.code}` : t.place);
        if (!ev && t.place.includes('→')) {
          const routeParts = t.place.split('→');
          route.replaceChildren();
          util.el('span', '', route, routeParts[0].trim());
          util.el('span', '', route, '→ ' + routeParts.slice(1).join('→').trim());
        }
        const w = util.el('div', 'tk-when', r);
        const tm = util.el('div', 'tk-time', w);
        if (ev) {
          tm.textContent = fam.fmtTime(t.time);
          util.el('div', 'tk-arrival', w, '—');
        } else {
          tm.textContent = fam.fmtTime(t.time);
          const arrival = util.el('div', 'tk-arrival', w, fam.fmtTime(t.time + t.dur));
          if (t.time + t.dur >= 1440) util.el('sup', '', arrival, '+1');
        }
        util.el('div', 'tk-dur', w, fam.fmtDur(t.dur));
        util.el('div', 'tk-price', r, fmt(t.price));
        const b = S.H.btn(util, 'as-btn primary tk-buy', r, 'Select', 'buy');
        b.addEventListener('click', () => buy(i));
        rowsEl[i] = r;
        buyEl[i] = b;
        return r;
      },
      ticketSetup: (base) => (V) => {
        const clearSelection = document.querySelector('.clear-sel');
        if (clearSelection) clearSelection.onclick = () => {
          const { ctx, fam, spec, commit } = V;
          if (ctx.model.pending !== null) commit(fam.apply(ctx.model, spec, { click: { confirm: 'cancel' } }));
          else if (ctx.model.bought !== null) commit(fam.apply(ctx.model, spec, { click: { cancelBuy: true } }));
        };
      },
    },
  },
});
