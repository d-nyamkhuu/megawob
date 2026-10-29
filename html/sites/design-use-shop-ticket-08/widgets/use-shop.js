// Ticket selection is staged through the site's footer controls, with route and service details in each row.
env.widget({
  task: 'use-shop',
  site: 'design-use-shop-ticket-08',
  name: 'design',
  split: 'train',
  scenarios: ['ticket'],
  template: 'use-shop/store',
  design: {
    ticketGap: 10,
    parts: {
      ticketPitch: (base, S) => (V) => {
        const { ctx, spec, rng, body, pane, gap } = V;
        V.pitch = S.H.pitchFor(pane, body, spec.rows, gap, 36, rng.int(80, 92), 16);
        pane.style.height = spec.rows * V.pitch - gap + 2 + 'px';
        S.H.mirrorPitch(ctx, V.pitch);
      },
      ticketFoot: (base, S) => (V) => {
        base(V);
        const recoverySlot = document.querySelector('.order-slot');
        if (recoverySlot) recoverySlot.append(V.foot);
        const footer = document.querySelector('.design-footer');
        const footerBuy = footer.querySelector('.buy-btn');
        const footerClear = footer.querySelector('.clear-btn');
        // A re-render (pageFaults) finds the previous build's sort control in the slot instead of the button.
        const footerDetails = footer.querySelector('.dt-btn') || footer.querySelector('[data-slot="sort"]');
        footerDetails.replaceWith(V.sort);
        V.sort.dataset.slot = 'sort';
        V.trig.setAttribute('aria-label', 'Details: sort tickets');
        V.trig.title = 'Details: sort tickets';
        V.x.footerBuy = footerBuy;
        V.x.footerClear = footerClear;
      },
      ticketSetup: (base, S) => (V) => {
        base(V);
        V.x.selected = V.ctx.model.bought !== null ? V.ctx.model.bought : V.ctx.model.pending;
        V.x.footerClear.addEventListener('click', () => {
          V.x.selected = null;
          if (V.ctx.model.pending !== null) V.commit(V.fam.apply(V.ctx.model, V.spec, { click: { confirm: 'cancel' } }));
          else if (V.ctx.model.bought !== null) V.commit(V.fam.apply(V.ctx.model, V.spec, { click: { cancelBuy: true } }));
          else V.paint(V.ctx.model);
        });
        V.x.footerBuy.addEventListener('click', () => {
          if (V.ctx.model.pending !== null) V.commit(V.fam.apply(V.ctx.model, V.spec, { click: { confirm: 'ok' } }));
          else if (V.x.selected !== null) V.buy(V.x.selected);
        });
      },
      ticketRow: (base, S) => (V, i) => {
        const { util, spec, fam, fmt, ev, rowsEl, buyEl, buy } = V;
        const t = spec.tickets[i];
        const r = util.el('div', 'tk-row');
        r.dataset.role = 'ticket';
        const d = util.el('div', 'tk-date', r);
        util.el('div', 'tk-dw', d, fam.fmtDate(t.date).slice(0, 3));
        util.el('div', 'tk-dd', d, String(+t.date.slice(8)));
        util.el('div', 'tk-dm', d, fam.MONTHS[+t.date.slice(5, 7) - 1].slice(0, 3));
        const info = util.el('div', 'tk-info', r);
        const name = util.el('div', 'tk-name', info);
        const vehicle = util.el('span', 'tk-vehicle', name);
        vehicle.innerHTML = spec.kind === 'train'
          ? '<svg viewBox="0 0 40 40" fill="#fff" stroke="#111" stroke-width="2.4" stroke-linejoin="round"><path d="M8 5l12-3 12 3v25H8zM16 2h8v4h-8z"/><path d="M10 9h20v12H10zM20 9v12M8 30L3 38M32 30l5 8M7 34h26M5 38h30"/><circle cx="14" cy="26" r="2"/><circle cx="26" cy="26" r="2"/></svg>'
          : '<svg viewBox="0 0 42 34" fill="#fff" stroke="#111" stroke-width="2.5" stroke-linejoin="round"><path d="M3 4h36v24H3z"/><path d="M3 4h36v4H3z" fill="#111"/><path d="M7 9h27v11H7zM15 9v11M24 9v11M33 9v17"/><circle cx="10" cy="27" r="4"/><circle cx="32" cy="27" r="4"/></svg>';
        util.el('span', 'tk-operator', name, t.name);
        util.el('span', 'tk-meta', name, `${t.code} · ${fam.fmtDate(t.date)} · ${fam.fmtTime(t.time)}`);
        util.el('div', 'tk-place', info, ev ? `${t.place} · ${t.code}` : t.place);
        const w = util.el('div', 'tk-when', r);
        const tm = util.el('div', 'tk-time', w);
        if (ev) tm.textContent = `Starts ${fam.fmtTime(t.time)}`;
        else {
          tm.textContent = `${fam.fmtTime(t.time)} → ${fam.fmtTime(t.time + t.dur)}`;
          if (t.time + t.dur >= 1440) util.el('sup', '', tm, '+1');
        }
        util.el('div', 'tk-dur', w, fam.fmtDur(t.dur));
        util.el('div', 'tk-price', r, fmt(t.price));
        const b = S.H.btn(util, 'as-btn primary tk-buy', r, 'Buy', 'buy');
        b.setAttribute('role', 'radio');
        b.setAttribute('aria-label', `Select ${t.name}, ${t.code}, ${V.when(t)}`);
        b.addEventListener('click', () => {
          if (V.x.selected === i) buy(i);
          else { V.x.selected = i; V.paint(V.ctx.model); }
        });
        r.addEventListener('click', (e) => {
          if (e.target.closest('button')) return;
          V.x.selected = i;
          V.paint(V.ctx.model);
        });
        rowsEl[i] = r;
        buyEl[i] = b;
        return r;
      },
      paintSort: (base, S) => (V, m) => {
        V.dd.set({ value: m.sort });
        V.tval.textContent = 'Details...';
        for (const [k, el] of Object.entries(V.optEls)) el.classList.toggle('sel', k === m.sort);
      },
      paintBuyRow: (base, S) => (V, m, i, b) => {
        const mine = m.bought === +i;
        b.disabled = m.bought !== null;
        b.textContent = '';
        b.setAttribute('aria-checked', String(mine || V.x.selected === +i));
        b.classList.toggle('selected', mine || V.x.selected === +i);
        b.classList.toggle('mine', mine);
        V.rowsEl[i].classList.toggle('bought', mine);
      },
    },
  },
});
