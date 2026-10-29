// Adds the journey summary, legacy frame controls and selectable service rows.
(function () {
  'use strict';

  const LOGOS = [
    '<svg viewBox="0 0 64 40"><defs><linearGradient id="mountain" x2="1" y2="1"><stop stop-color="#4cb9ff"/><stop offset="1" stop-color="#0756b7"/></linearGradient></defs><path d="M1 39 17 16 33 39M28 39 49 17 63 39" fill="#0b68d6"/><path d="M12 39 33 2 54 39z" fill="url(#mountain)"/><path d="M33 2 32 39h22z" fill="#167bd4"/><path d="M17 16 15 39H1z" fill="#3098ed"/><path d="M49 17 53 39h10z" fill="#054aac"/></svg>',
    '<svg viewBox="0 0 64 40"><defs><linearGradient id="wing" x2="1" y2="1"><stop stop-color="#fa8980"/><stop offset="1" stop-color="#c9101d"/></linearGradient></defs><path d="M1 39 43 0 40 13 63 5 39 30z" fill="url(#wing)"/><path d="M1 39 40 13 27 25z" fill="#ee2631"/><path d="M25 18 43 0 40 13z" fill="#fb6b63"/></svg>',
    '<svg viewBox="0 0 64 40"><path d="M10 38C7 14 23 7 51 0c-1 27-11 39-39 37z" fill="#348650"/><path d="M6 40C18 23 27 17 48 4" fill="none" stroke="#eaf5e8" stroke-width="1.6"/><path d="m4 39 7-8" stroke="#328250" stroke-width="3"/></svg>',
    '<svg viewBox="0 0 64 40"><path d="M9 17C26-10 45 22 63 5 49 37 27 7 9 17M2 32C18 4 42 39 59 22 42 52 21 23 2 32" fill="#743797"/></svg>',
  ];

  env.widget({
    task: 'use-shop',
    site: 'design-use-shop-ticket-05',
    name: 'design',
    split: 'train',
    scenarios: ['ticket'],
    template: 'use-shop/store',
    design: {
      buyLabel: 'Buy',
      boughtLabel: 'Bought',
      parts: {
        ticketHeadMid: (base, S) => (V) => {
          const { util, spec, fam, hl } = V;
          const jr = util.el('div', 'tk-journey', hl);
          const parts = String(spec.tickets[0].place).split(/\s*[→>-]+\s*/);
          const lab = (a, b) => {
            util.el('b', '', jr, a);
            util.el('span', '', jr, b);
          };
          if (!V.ev && parts.length >= 2) {
            lab('From:', parts[0]);
            lab('To:', parts[1]);
            lab('Date:', fam.fmtDate(spec.tickets[0].date));
          } else lab(V.ev ? 'Venue:' : 'Route:', spec.tickets[0].place);
        },
        ticketHead: (base, S) => (V) => {
          base(V);
          const detailsSlot = document.querySelector('.ticket-details');
          if (detailsSlot) detailsSlot.replaceChildren(V.sort);
          const detailsIcon = V.util.el('span', 'det-ic');
          detailsIcon.innerHTML = '<svg viewBox="0 0 24 24"><defs><linearGradient id="infoBlue" x2="0" y2="1"><stop stop-color="#7cc5ff"/><stop offset="1" stop-color="#1261c4"/></linearGradient></defs><circle cx="12" cy="12" r="10.5" fill="url(#infoBlue)" stroke="#246bc4"/><path d="M12 10v8" stroke="#fff" stroke-width="2.7"/><circle cx="12" cy="6.5" r="1.4" fill="#fff"/></svg>';
          const detailsLabel = V.util.el('span', 'det-lab', V.trig, 'Ticket details');
          const chevron = V.trig.querySelector('svg');
          V.trig.insertBefore(detailsIcon, chevron);
          V.trig.insertBefore(detailsLabel, chevron);
        },
        ticketFoot: (base, S) => (V) => {
          const footer = document.querySelector('.design-footer');
          const gap = footer && footer.querySelector('.foot-gap');
          if (footer) footer.insertBefore(V.foot, gap);
        },
        ticketPitch: (base, S) => (V) => {
          const { ctx, spec, rng, body, pane, gap } = V;
          V.pitch = S.H.pitchFor(pane, body, spec.rows, gap, 26, rng.int(80, 92), 0);
          pane.style.height = spec.rows * V.pitch - gap + 2 + 'px';
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
          const operator = util.el('div', 'tk-name', info, t.name);
          operator.title = t.code;
          util.el('span', 'tk-service-code', info, t.code);
          const rowPlace = util.el('div', 'tk-place', info, ev ? `${t.place} · ${t.code}` : t.place);
          if (t.place !== spec.tickets[0].place) rowPlace.classList.add('distinct-place');
          const w = util.el('div', 'tk-when', r);
          const tm = util.el('div', 'tk-time', w);
          if (ev) tm.textContent = `Starts ${fam.fmtTime(t.time)}`;
          else {
            tm.textContent = `${fam.fmtTime(t.time)} → ${fam.fmtTime(t.time + t.dur)}`;
            if (t.time + t.dur >= 1440) util.el('sup', '', tm, '+1');
          }
          if (spec.tickets.some((other) => other.date !== spec.tickets[0].date))
            util.el('span', 'tk-service-date', tm, fam.fmtDate(t.date));
          util.el('div', 'tk-dur', w, fam.fmtDur(t.dur)).title = ev ? 'Length' : 'Duration';
          util.el('div', 'tk-price', r, fmt(t.price));
          const logo = util.el('span', 'tk-logo', r);
          logo.innerHTML = LOGOS[t.name.includes('Polar') ? 0 : t.name.includes('Lakeside') ? 2 : t.name.includes('Northern') ? 3 : 1];
          const b = S.H.btn(util, 'as-btn primary tk-buy', r, 'Buy', 'buy');
          b.setAttribute('aria-label', `Select ${t.name}, ${fam.fmtTime(t.time)}`);
          b.addEventListener('click', () => {
            V.x.selected = i;
            V.paint(V.ctx.model);
          });
          rowsEl[i] = r;
          buyEl[i] = b;
          return r;
        },
        ticketSetup: (base, S) => (V) => {
          V.x.selected = V.ctx.model.bought ?? V.ctx.model.pending;
          V.x.buyTicket = document.querySelector('.buy-ticket');
          if (V.x.buyTicket) V.x.buyTicket.onclick = () => {
            if (V.x.selected !== null) V.buy(V.x.selected);
          };
        },
        paintBuyRow: (base, S) => (V, m, i, b) => {
          const mine = m.bought === +i;
          const selected = V.x.selected === +i;
          b.disabled = m.bought !== null;
          b.textContent = mine ? S.D.boughtLabel : S.D.buyLabel;
          b.classList.toggle('mine', mine || selected);
          b.setAttribute('aria-pressed', String(mine || selected));
          V.rowsEl[i].classList.toggle('bought', mine);
        },
        ticketPaint: (base, S) => (V, m) => {
          base(V, m);
          const purchased = m.bought !== null ? V.spec.tickets[m.bought] : null;
          V.foot.hidden = !purchased;
        },
        ticketLocate: (base, S) => (V, t) => {
          if (t.buy !== undefined && V.x.selected === t.buy && V.x.buyTicket)
            return S.H.where(V.x.buyTicket, `Buy ${t.buy}`);
          return base(V, t);
        },
      },
    },
  });
})();
