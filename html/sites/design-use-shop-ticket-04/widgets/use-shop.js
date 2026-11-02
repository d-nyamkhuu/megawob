// Uses the shared ticket builder with the site's trip summary, selection palette, and purchase layout.
env.widget({
  task: 'use-shop',
  site: 'design-use-shop-ticket-04',
  name: 'design',
  split: 'train',
  scenarios: ['ticket'],
  template: 'use-shop/store',
  design: {
    buyLabel: 'Buy',
    parts: {
      ticketHead: (base, S) => (V) => {
        const { util, spec, fam, ctx, main } = V;
        const head = (V.head = util.el('div', 'tk-head', main));
        const hl = (V.hl = util.el('div', '', head));
        util.el('div', 'tk-title', hl, V.ev ? V.rng.pick(['Upcoming concerts', 'Live this month', 'Concert tickets']) : 'Results: ' + spec.tickets[0].place);
        util.el('div', 'tk-result-date', hl, fam.fmtDate(spec.tickets[0].date));
        util.el('div', 'tk-sub', hl, `${spec.tickets.length} tickets found`);
        const route = spec.tickets[0].place.split(/\s*[→–]\s*/);
        for (const [key, value] of [
          ['from', route[0]],
          ['to', route[1] || '—'],
          ['date', fam.fmtDate(spec.tickets[0].date)],
        ]) {
          const field = document.querySelector(`[data-field="${key}"]`);
          if (field) field.textContent = value;
        }
        const sort = (V.sort = util.el('div', 'tk-sort', head));
        util.el('span', '', sort, 'Sort by');
        const trig = (V.trig = util.el('div', 'tk-trigger', sort));
        trig.dataset.role = 'sort';
        V.tval = util.el('span', '', trig);
        trig.insertAdjacentHTML('beforeend', S.H.ICON.chev);
        const pop = util.el('div', 'tk-pop', sort);
        pop.dataset.role = 'sort-options';
        const optEls = (V.optEls = {});
        for (const [k, label] of fam.SORTS) {
          const option = util.el('div', 'tk-opt', pop, label);
          option.dataset.role = 'option';
          optEls[k] = option;
        }
        V.dd = env.ui.dropdown(trig, pop, {
          label: 'sort',
          value: ctx.model.sort,
          options: fam.SORTS.map(([k]) => [k, optEls[k]]),
          onChange(v) {
            if (v !== ctx.model.sort) V.commit(fam.apply(ctx.model, spec, { click: { sortBy: v } }));
          },
        });
        const form = document.querySelector('.tp-f2');
        if (form) form.append(sort);
      },
      ticketColumns: (base) => (V) => {
        const { main, util } = V;
        const columns = util.el('div', 'tk-columns', main);
        for (const label of ['Select', 'Departure', 'Arrival', 'Duration', 'Operator', 'Price'])
          util.el('div', '', columns, label);
      },
      ticketFoot: (base) => (V) => {
        base(V);
        const footer = document.querySelector('.design-footer');
        if (footer) footer.append(V.foot);
      },
      ticketPitch: (base, S) => (V) => {
        const { ctx, spec, rng, body, pane, gap } = V;
        V.pitch = S.H.pitchFor(pane, body, spec.rows, gap, 20, rng.int(80, 92), -8);
        pane.style.height = spec.rows * V.pitch - gap + 2 + 'px';
        S.H.mirrorPitch(ctx, V.pitch);
      },
      ticketSetup: (base) => (V) => {
        V.x.selected = null;
        V.x.purchase = document.querySelector('.purchase-control');
        const palette = () => {
          const t = V.x.selected === null ? null : V.spec.tickets[V.x.selected];
          const values = t ? {
            Operator: t.name,
            Departure: V.fam.fmtTime(t.time),
            Arrival: V.fam.fmtTime(t.time + t.dur),
            Duration: V.fam.fmtDur(t.dur),
            Price: V.fmt(t.price),
          } : {};
          for (const el of document.querySelectorAll('[data-ticket-field]'))
            el.textContent = values[el.dataset.ticketField] || '—';
          for (const [i, row] of Object.entries(V.rowsEl))
            row.classList.toggle('selected', V.x.selected === +i);
        };
        V.x.palette = palette;
        if (V.x.purchase) V.x.purchase.addEventListener('click', () => {
          if (V.x.selected !== null) V.buy(V.x.selected);
        });
        const clear = document.querySelector('.tp-pfoot button');
        if (clear) clear.addEventListener('click', () => {
          V.x.selected = null;
          palette();
        });
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
        const info = util.el('div', 'tk-info', r);
        util.el('div', 'tk-name', info, t.name);
        util.el('div', 'tk-place', info, ev ? `${t.place} · ${t.code}` : t.place);
        const w = util.el('div', 'tk-when', r);
        const tm = util.el('div', 'tk-time', w);
        if (ev) tm.textContent = `Starts ${fam.fmtTime(t.time)}`;
        else tm.textContent = fam.fmtTime(t.time);
        util.el('div', 'tk-travel-date', w, fam.fmtDate(t.date));
        const arrival = util.el('div', 'tk-arrival', r, fam.fmtTime(t.time + t.dur));
        if (t.time + t.dur >= 1440) util.el('sup', '', arrival, '+1');
        util.el('div', 'tk-dur', r, fam.fmtDur(t.dur));
        util.el('div', 'tk-price', r, fmt(t.price));
        const button = S.H.btn(util, 'as-btn primary tk-buy', r, 'Buy', 'buy');
        button.setAttribute('aria-label', 'Select ' + t.name + ' ' + fam.fmtTime(t.time));
        button.addEventListener('click', () => {
          V.x.selected = i;
          V.x.palette();
        });
        rowsEl[i] = r;
        buyEl[i] = button;
        return r;
      },
      paintSort: () => (V, m) => {
        V.dd.set({ value: m.sort });
        V.tval.textContent = V.fam.SORTS.find(([k]) => k === m.sort)[1];
        for (const [k, el] of Object.entries(V.optEls)) el.classList.toggle('sel', k === m.sort);
      },
      ticketPaint: (base) => (V, m) => {
        base(V, m);
        if (m.bought !== null) V.x.selected = m.bought;
        V.x.palette();
      },
      ticketLocate: (base, S) => (V, t) => {
        if (t.buy !== undefined)
          return S.H.where(V.x.selected === t.buy && V.x.purchase ? V.x.purchase : V.buyEl[t.buy], `Buy ${t.buy}`);
        return base(V, t);
      },
    },
  },
});
