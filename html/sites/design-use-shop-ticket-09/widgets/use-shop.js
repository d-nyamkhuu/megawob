// This design adds the ticket results table, selection control, and purchase actions.
env.widget({
  task: 'use-shop',
  site: 'design-use-shop-ticket-09',
  name: 'design',
  split: 'train',
  scenarios: ['ticket'],
  template: 'use-shop/store',
  design: {
    parts: {
      ticketHeadMid: () => () => {},
      ticketHead: (base, S) => (V) => {
        const { ctx, util, spec, fam, main } = V;
        const head = V.head = util.el('div', 'tk-head', main);
        const hl = V.hl = util.el('div', '', head);
        const ev = V.ev;
        util.el('div', 'tk-title', hl, S.P.ticketTitle(V));
        util.el('div', 'tk-sub', hl,
          `${spec.tickets.length} ${ev ? 'shows' : spec.kind === 'train' ? 'train departures' : 'bus departures'} · prices per person, fees included`);
        const route = spec.tickets[0].place.split(/\s*→\s*/);
        const from = document.querySelector('[data-field=from] .field-value');
        const to = document.querySelector('[data-field=to] .field-value');
        if (from) from.textContent = route[0];
        if (to) to.textContent = route[1] || spec.tickets[0].place;
        const status = document.querySelector('.footer-label');
        if (status) status.textContent = `${spec.tickets.length} options found.`;
        V.x.purchase = document.querySelector('.buy-ticket');
        V.x.selected = ctx.model.bought ?? ctx.model.pending ?? null;
      },
      ticketColumns: (base, S) => (V) => {
        const { util, spec, fam, ctx } = V;
        const columns = util.el('div', 'tk-columns', V.main);
        const fmt = S.H.money(spec);
        const currencyLabel = /€/.test(fmt(spec.tickets[0].price)) ? 'EUR'
          : /£/.test(fmt(spec.tickets[0].price)) ? 'GBP' : 'USD';
        const labels = ['Select', 'Departure', 'Arrival', 'Duration', 'Operator', `Price (${currencyLabel})`, 'Service'];
        const cells = labels.map((label) => util.el('div', 'tk-column', columns, label));
        cells[1].textContent = '';
        const sort = util.el('div', 'tk-sort', cells[1]);
        const trig = V.trig = util.el('div', 'tk-trigger', sort);
        trig.dataset.role = 'sort';
        util.el('span', 'departure-label', trig, 'Departure');
        V.tval = util.el('span', 'sort-value', trig);
        trig.insertAdjacentHTML('beforeend', '<span class="sort-arrow">↕</span>');
        const pop = util.el('div', 'tk-pop', sort);
        pop.dataset.role = 'sort-options';
        const optEls = V.optEls = {};
        for (const [k, label] of fam.SORTS) {
          const o = util.el('div', 'tk-opt', pop, label);
          o.dataset.role = 'option';
          optEls[k] = o;
        }
        V.dd = env.ui.dropdown(trig, pop, {
          label: 'sort', value: ctx.model.sort,
          options: fam.SORTS.map(([k]) => [k, optEls[k]]),
          onChange(v) {
            if (v !== ctx.model.sort) V.commit(fam.apply(ctx.model, spec, { click: { sortBy: v } }));
          },
        });
      },
      ticketPitch: (base, S) => (V) => {
        const { ctx, spec, rng, body, pane, gap } = V;
        const sampledPitch = rng.int(80, 92);
        const scale = parseFloat(getComputedStyle(document.documentElement).fontSize);
        V.pitch = S.H.pitchFor(pane, body, spec.rows, gap, Math.round(2.85 * scale),
          Math.min(sampledPitch, Math.round(2.9 * scale)), 20);
        pane.style.height = spec.rows * V.pitch - gap + 2 + 'px';
        S.H.mirrorPitch(ctx, V.pitch);
      },
      ticketRow: (base, S) => (V, i) => {
        const { util, spec, fam, rowsEl, buyEl } = V;
        const t = spec.tickets[i];
        const fmt = S.H.money(spec);
        const r = util.el('div', 'tk-row');
        r.dataset.role = 'ticket';
        const b = S.H.btn(util, 'tk-buy', r, '', 'select');
        b.setAttribute('role', 'radio');
        b.setAttribute('aria-label', `Select ${t.name}, ${V.when(t)}, ${fmt(t.price)}`);
        b.addEventListener('click', () => {
          V.x.selected = i;
          V.paint(V.ctx.model);
        });
        const departure = util.el('div', 'tk-departure tk-cell', r);
        util.el('div', 'tk-time', departure, fam.fmtTime(t.time));
        util.el('div', 'tk-date', departure, fam.fmtDate(t.date));
        const arrival = util.el('div', 'tk-arrival tk-cell', r, V.ev ? '—' : fam.fmtTime(t.time + t.dur));
        if (!V.ev && t.time + t.dur >= 1440) util.el('sup', '', arrival, '+1');
        util.el('div', 'tk-duration tk-cell', r, fam.fmtDur(t.dur));
        const info = util.el('div', 'tk-info tk-cell', r);
        util.el('div', 'tk-name', info, t.name);
        if (V.ev) util.el('div', 'tk-place', info, t.place);
        util.el('div', 'tk-price tk-cell', r, fmt(t.price));
        util.el('div', 'tk-service tk-cell', r, t.code);
        rowsEl[i] = r;
        buyEl[i] = b;
        return r;
      },
      paintSort: (base, S) => (V, m) => {
        V.dd.set({ value: m.sort });
        V.tval.textContent = V.fam.SORTS.find(([k]) => k === m.sort)[1];
        V.trig.title = `Sort by: ${V.tval.textContent}`;
        for (const [k, el] of Object.entries(V.optEls)) el.classList.toggle('sel', k === m.sort);
      },
      paintBuyRow: (base, S) => (V, m, i, b) => {
        const mine = m.bought === +i;
        b.disabled = m.bought !== null;
        b.setAttribute('aria-checked', String(V.x.selected === +i || mine));
        b.classList.toggle('selected', V.x.selected === +i || mine);
        b.classList.toggle('mine', mine);
        V.rowsEl[i].classList.toggle('bought', mine);
      },
      ticketPaint: (base, S) => (V, m) => {
        base(V, m);
        const { spec, ev, foot, footText, receipt, cancelBuy } = V;
        const t = m.bought !== null ? spec.tickets[m.bought] : null;
        const fmt = S.H.money(spec);
        foot.hidden = !t;
        if (V.x.purchase) V.x.purchase.disabled = m.bought !== null || m.pending !== null;
        footText.hidden = true;
        receipt.hidden = cancelBuy.hidden = !t;
        if (t) receipt.textContent = `✓ Purchased: ${ev ? t.name : `${t.name} · ${t.code}`}, ${V.when(t)} · ${fmt(t.price)}`;
      },
      paintDialogBody: (base, S) => (V, p) => {
        const { util, fam, ev, dlgBody, pay, when } = V;
        const fmt = S.H.money(V.spec);
        dlgBody.replaceChildren();
        const dl = util.el('dl', 'tk-sum', dlgBody);
        const rowsTxt = [
          [ev ? 'Show' : 'Service', ev ? p.name : `${p.name} · ${p.code}`],
          [ev ? 'Venue' : 'Route', p.place], ['Date', when(p)],
          [ev ? 'Length' : 'Duration', fam.fmtDur(p.dur)], ['Tickets', '1 × adult'],
        ];
        for (const [a, b] of rowsTxt) {
          util.el('dt', '', dl, a);
          util.el('dd', '', dl, b);
        }
        const total = util.el('div', 'tk-total', dlgBody);
        util.el('span', '', total, 'Total');
        util.el('span', '', total, fmt(p.price));
        pay.textContent = `Pay ${fmt(p.price)}`;
      },
      ticketLocate: (base, S) => (V, t) => {
        if (t.buy !== undefined)
          return S.H.where(V.x.selected === t.buy && V.x.purchase ? V.x.purchase : V.buyEl[t.buy], `Buy ${t.buy}`);
        return base(V, t);
      },
      ticketSetup: (base, S) => (V) => {
        if (V.x.purchase) V.x.purchase.onclick = () => {
          if (V.x.selected !== null) V.buy(V.x.selected);
        };
      },
    },
  },
});
