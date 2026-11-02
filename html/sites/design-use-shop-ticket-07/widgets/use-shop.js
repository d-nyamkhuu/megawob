// Adds route details, filters and a persistent ticket selection preview to the ticket store.
env.widget({
  task: 'use-shop',
  site: 'design-use-shop-ticket-07',
  name: 'design',
  split: 'train',
  scenarios: ['ticket'],
  traits: { sort: true },
  template: 'use-shop/store',
  design: {
    parts: {
      ticketHead: (base, S) => (V) => {
        base(V);
        const icon = V.trig.querySelector('svg');
        if (icon) icon.outerHTML = '<span class="sort-arrow">↑</span>';
      },
      ticketHeadMid: (base, S) => (V) => {
        const { util, spec, fam } = V;
        const preview = document.querySelector('.tg-pb');
        V.x.previewTitle = preview.children[0];
        V.x.previewDetails = preview.querySelector('small');
        V.x.previewBuy = preview.querySelector('button');
        V.x.clearSelection = document.querySelector('.clear-selection');
        const route = spec.tickets[0].place.split(/\s*→\s*/);
        if (route.length === 2) {
          document.querySelector('.tg-r.f b').textContent = route[0];
          document.querySelector('.tg-r.t b').textContent = route[1];
        }
        document.querySelector('.tg-r.d b').textContent = fam.fmtDate(spec.tickets[0].date);
        document.querySelector('.tg-results').textContent = `${spec.tickets.length} results`;
        base(V);
      },
      ticketColumns: (base, S) => (V) => {
        const { util, main, spec, fmt, fam } = V;
        const columns = util.el('div', 'tk-columns', main);
        util.el('span', '', columns, 'Select');
        columns.append(V.sort);
        for (const label of ['Arrival', 'Duration', 'Operator', 'Price']) util.el('span', '', columns, label);
        main.insertBefore(columns, V.pane);

        const filters = (V.x.filters = util.el('aside', 'tk-filters', main));
        util.el('h3', '', filters, 'Filters');
        util.el('div', 'filter-label', filters, 'Operator');
        V.x.checks = [];
        const operators = util.el('div', 'filter-operators', filters);
        for (const name of [...new Set(spec.tickets.map((t) => t.name))]) {
          const label = util.el('label', 'filter-check', operators);
          const input = util.el('input', '', label);
          input.type = 'checkbox';
          util.el('span', '', label, name);
          V.x.checks.push([name, input]);
        }
        V.x.limits = [];
        for (const [label, max, unit] of [
          ['Max price', Math.max(100, ...spec.tickets.map((t) => t.price)), 'price'],
          ['Max duration', Math.max(600, ...spec.tickets.map((t) => t.dur)), 'dur'],
        ]) {
          const box = util.el('div', 'filter-limit', filters);
          util.el('div', 'filter-label', box, label);
          const line = util.el('div', 'filter-range', box);
          const slider = util.el('input', '', line);
          slider.type = 'range';
          slider.min = 0;
          slider.max = Math.ceil(max / 0.9);
          slider.value = max;
          const value = util.el('span', '', line, unit === 'price' ? `${fmt(0)} – ${fmt(max)}` : `0h – ${Math.ceil(max / 60)}h`);
          V.x.limits.push([unit, slider, value]);
        }
        V.x.filterRows = () => {
          const active = V.x.checks.filter(([, c]) => c.checked).map(([n]) => n);
          let count = 0;
          for (const [i, row] of Object.entries(V.rowsEl)) {
            const ticket = spec.tickets[i];
            const visible = (!active.length || active.includes(ticket.name)) && V.x.limits.every(([k, s]) => ticket[k] <= +s.value);
            row.hidden = !visible;
            if (visible) count++;
          }
          document.querySelector('.tg-results').textContent = `${count} results`;
        };
        V.x.checks.forEach(([, c]) => c.addEventListener('change', V.x.filterRows));
        V.x.limits.forEach(([k, s, v]) => s.addEventListener('input', () => {
          v.textContent = k === 'price' ? `${fmt(0)} – ${fmt(+s.value)}` : `0h – ${fam.fmtDur(+s.value)}`;
          V.x.filterRows();
        }));
        base(V);
      },
      ticketFoot: (base, S) => (V) => {
        V.main.insertBefore(V.x.filters, V.foot);
        base(V);
      },
      ticketPitch: (base, S) => (V) => {
        const { ctx, spec, rng, pane, gap } = V;
        rng.int(80, 92);
        V.pitch = Math.max(40, Math.min(65, Math.floor((Math.min(380, ctx.size.height * 0.58) - 54) / spec.rows)));
        pane.style.height = Math.max(spec.rows * V.pitch - gap + 2, Math.min(326, ctx.size.height * 0.58 - 54)) + 'px';
        S.H.mirrorPitch(ctx, V.pitch);
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
        else {
          tm.textContent = `${fam.fmtTime(t.time)} → ${fam.fmtTime(t.time + t.dur)}`;
          if (t.time + t.dur >= 1440) util.el('sup', '', tm, '+1');
        }
        tm.textContent = fam.fmtTime(t.time);
        util.el('div', 'tk-arrival', r, fam.fmtTime(t.time + t.dur));
        util.el('div', 'tk-duration', r, fam.fmtDur(t.dur));
        util.el('div', 'tk-price', r, fmt(t.price));
        const b = S.H.btn(util, 'as-btn tk-buy', r, '', 'buy');
        b.setAttribute('aria-label', `Select ${t.name}, ${fam.fmtTime(t.time)}`);
        b.addEventListener('click', () => { V.x.selected = i; V.paint(V.ctx.model); });
        rowsEl[i] = r;
        buyEl[i] = b;
        return r;
      },
      ticketList: (base, S) => (V, m) => {
        base(V, m);
        V.x.filterRows();
      },
      ticketPaint: (base, S) => (V, m) => {
        base(V, m);
        V.tval.textContent = 'Departure';
        V.trig.title = `Sort by: ${V.fam.SORTS.find(([k]) => k === m.sort)[1]}`;
        for (const [i, b] of Object.entries(V.buyEl)) {
          b.textContent = '';
          V.rowsEl[i].classList.toggle('selected', V.x.selected === +i || m.bought === +i);
        }
        const chosen = V.x.selected !== null ? V.spec.tickets[V.x.selected] : null;
        V.x.previewTitle.textContent = chosen ? chosen.name : 'No ticket selected';
        V.x.previewDetails.textContent = chosen
          ? `${V.fam.fmtTime(chosen.time)} → ${V.fam.fmtTime(chosen.time + chosen.dur)} · ${V.fam.fmtDur(chosen.dur)} · ${V.fmt(chosen.price)}`
          : 'Choose a ticket from the list to see the details here.';
        V.x.previewBuy.disabled = !chosen || m.bought !== null || m.pending !== null;
        V.x.previewBuy.textContent = m.bought !== null ? 'Bought' : 'Buy';
      },
      ticketLocate: (base, S) => (V, t) => {
        if (t.buy !== undefined) return S.H.where(V.x.selected === t.buy ? V.x.previewBuy : V.buyEl[t.buy], `Buy ${t.buy}`);
        return base(V, t);
      },
      ticketSetup: (base, S) => (V) => {
        V.x.selected = V.ctx.model.pending ?? V.ctx.model.bought ?? null;
        V.x.previewBuy.addEventListener('click', () => {
          if (V.x.selected !== null) V.buy(V.x.selected);
        });
        V.x.clearSelection.addEventListener('click', () => { V.x.selected = null; V.paint(V.ctx.model); });
        document.querySelector('.tg-ph i').addEventListener('click', () => { V.x.selected = null; V.paint(V.ctx.model); });
        base(V);
      },
    },
  },
});
