// TravelDesk ticket design: route frame, comparison columns, operator marks, and row selection controls.
(function () {
  'use strict';
  const ribbonSorts = new WeakMap();
  const DESIGN_CSS = "\n.as-app{left:0!important;right:0!important;top:0!important;bottom:0!important;width:auto!important;border:0;border-radius:0;box-shadow:none}.as-top{display:none}.as-body{min-height:0}.as-btn{border-radius:3px;font-size:14px}.as-pane{border-radius:0}.se-main{padding:17px 22px!important;gap:0}.se-col{width:100%;max-width:none}.se-side{display:none}.se-box{border-radius:3px;box-shadow:none;height:39px;padding:0 12px}.se-go{border-radius:3px;height:39px;padding:0 22px}.se-card{border-bottom:1px solid var(--line);padding:8px 8px 4px}.se-card .se-title{font-family:inherit;font-size:19px}.se-pager{justify-content:center}.se-pg{border-radius:2px;width:32px;min-width:32px;height:32px}.se-fav{width:22px;height:22px;border-radius:1px}.se-url{font-size:12px}.se-desc{font-size:14px}.tk-main{padding:18px 22px}.tk-title{font-size:24px}.tk-date{border-radius:0;background:transparent}.tk-row{gap:12px;border-bottom:1px solid var(--line);padding:0 12px}.tk-name{font-size:15px}.tk-price{font-size:18px;width:68px}.tk-buy{width:65px}.tk-when{width:125px}.tk-trigger{border-radius:0;min-width:175px}.fd-wrap.left{flex-direction:row}.fd-cart{width:28%!important;border-left:3px solid var(--fg);border-radius:0;background:var(--panel)}.fd-menu{padding:12px 18px}.fd-card{border-radius:0}.fd-add{border-radius:2px}.fd-order{border-radius:2px}.fd-rname{font-size:22px}.fd-rmeta{font-size:12px}.fd-dialog,.as-dialog{border-radius:4px}.fl-form{border-radius:0}.at-win{left:0!important;top:0!important;width:100%!important;height:100%!important;border-radius:0;box-shadow:none}.at-title{height:30px;border-radius:0;background:var(--header,var(--panel));font-size:14px}.at-rail{display:none}.at-body{flex:1;min-height:0}.at-main{min-width:0}.at-pane-h{border-radius:0}.at-explorer{width:46%!important;max-width:none}.at-preview{padding:10px}.at-tree{font-family:inherit}.at-row svg{color:var(--fg)}.at-ed{padding:0!important}.at-pagearea{background:var(--panel);padding:0!important}.at-sheet{border:0;box-shadow:none;background:var(--panel);margin:0!important;width:100%!important;max-width:none!important;padding:26px 32px!important}.at-sheet h2{font-family:inherit}.at-tb{border-radius:0;padding:10px;background:var(--header,var(--panel))}.at-tool{border-radius:3px;font-family:inherit}.at-status{background:var(--panel)}.at-term{border-radius:0;border:0}.at-tscroll{padding:20px;font:15px/1.5 monospace}.at-term-tabs{background:var(--header,var(--panel))}.as-page{inset:0!important;display:flex;justify-content:stretch!important}.as-rail,.as-side{display:none}.as-col{flex:1!important;width:100%!important;border:0}.as-head{height:43px;background:var(--header,var(--panel));font-size:14px}.as-post{padding:13px 18px;gap:14px;border-bottom:1px solid var(--line)}.as-text{font-size:16px;line-height:1.4}.as-av{width:48px;height:48px;border-radius:4px;font-size:17px}.as-acts{max-width:440px;justify-content:flex-start;gap:22px}.as-act{border-radius:3px;height:30px;font-size:14px;padding:0 8px}.as-act svg{width:20px;height:20px}.as-photos{height:100px!important;border-radius:4px}.as-menu{border-radius:3px;min-width:210px}.as-mi{height:35px;font-size:14px}.as-confirm{border-radius:4px}.as-confirm button{border-radius:3px}.as-track{border-radius:0;width:15px;background:var(--line)}.as-thumb{border-radius:0}.as-name{font-size:16px}.as-handle,.as-time{font-size:13px}.as-quote{border-radius:3px}.as-link{border-radius:3px}.as-link.tall .as-link-img{height:65px}.as-post:has(.as-photos){min-height:200px}\n.task-note{font-size:17px;background:#1c3b54;padding:25px 17px}.design-header{background:linear-gradient(#c4d6e7,#849cb3);color:#0c1820}.design-nav{color:#233240}.tk-row{border:1px solid #3b5d74}.tk-buy{background:linear-gradient(#d9eafa,#a9c8e2);color:#0b2538;border:1px solid #93b3ce}.tk-pane{border-color:#55758a}.end-control{background:linear-gradient(#bedef7,#78a9cd);color:#092035}.tk-date{display:none}.tk-main{background:#122b3d}.tk-head{border-bottom:1px solid #496d87;padding-bottom:12px}\n.tk-date{display:none}.tk-info{min-width:150px}.tk-sort{font-size:12px}";
  const POLAR = '<svg viewBox="0 0 80 50"><path fill="#389ade" d="M2 45 21 20 26 24 43 3 60 27 65 20 79 45Z"/><path fill="#1785cc" d="M43 3 47 28 79 45 64 20 60 27Z"/><path fill="#8ec8ee" d="M2 45 29 38 47 28 79 45Z"/><path fill="#fff" d="m13 42 14-16 6 5 11-16-3 15-12 9Z"/><path fill="#68b7e8" d="m29 38 18-10-4-25-4 27Z"/></svg>';
  const MOUNTAIN = '<svg viewBox="0 0 80 50"><path fill="#4738a5" d="M1 46 24 20 29 26 41 5 79 46Z"/><path fill="#6b44b7" d="m41 5 9 32 29 9H19Z"/><path fill="#fff" d="m15 43 16-18 1 9 12-15-3 14-15 10Z"/><path fill="#933ec0" d="m27 45 23-8 13 9Z"/></svg>';
  const MOUNTAIN_MARK = '<svg viewBox="0 0 80 50"><path fill="currentColor" d="M2 45 24 19 29 25 43 3 62 27 66 20 79 45z"/><path fill="#fff" d="m12 42 17-16 6 4 8-13-1 14-13 8z"/><path fill="#ffffff" opacity=".3" d="m43 3 3 24 32 18H29z"/></svg>';
  const GENERIC_MARK = '<svg viewBox="0 0 80 50"><path fill="currentColor" d="M4 47C6 15 34 0 76 5L73 14C39 11 14 24 4 47zM6 47C18 24 43 20 72 19L66 28C35 25 18 33 6 47zM9 47C29 31 50 30 68 32L60 40C36 35 22 42 9 47z"/></svg>';
  const LAKESIDE = '<svg viewBox="0 0 80 50"><path fill="currentColor" d="M3 48C8 14 34-1 76 3 71 35 46 53 14 48L63 12C37 24 22 30 3 48Z"/><path fill="#fff" opacity=".16" d="M3 48C10 17 36-1 76 3L42 24 28 20 16 35Z"/><path fill="#fff" d="M8 47 35 23 44 22 76 4 57 23 33 29Z"/></svg>';
  env.widget({
    task: 'use-shop',
    site: 'design-use-shop-ticket-11',
    name: 'design',
    split: 'train',
    scenarios: ['ticket'],
    template: 'use-shop/adapted',
    design: {
      brand: 'RouteFinder 2014 – Bus Tickets',
      css: DESIGN_CSS,
      ticketGap: 1,
      headInFooter: false,
      selectionPane: false,
      parts: {
        ticketHeadHook: (base, S) => (V) => {
          const fields = document.querySelectorAll('.tdk-field div');
          const route = V.spec.tickets[0].place.split(/\s*[→–—]\s*/);
          if (fields.length === 3) {
            fields[0].firstChild.textContent = route[0];
            fields[1].firstChild.textContent = route[1] || route[0];
            fields[2].firstChild.textContent = V.fam.fmtDate(V.spec.tickets[0].date);
          }
        },
        ticketHead: (base, S) => (V) => {
          const { util, spec, fam, main } = V;
          const head = V.head = util.el('div', 'tk-head', main);
          const hl = V.hl = util.el('div', 'tk-hl', head);
          const columns = V.th = util.el('div', 'tk-th', head);
          for (const label of ['Select', 'Operator', 'Departure', 'Arrival', 'Duration', 'Price']) util.el('span', '', columns, label);
          S.P.ticketHeadHook(V);
          util.el('div', 'tk-title', hl, S.P.ticketTitle(V));
          util.el('div', 'tk-sub', hl, `${spec.tickets.length} ${V.ev ? 'shows' : spec.kind === 'train' ? 'train departures' : 'bus departures'} · prices per person, fees included`);
          const ribbon = document.querySelector('.tdk-sort-control');
          const previous = ribbon && ribbonSorts.get(ribbon);
          // The wrapper holds a frame node, so the kit leaves it in place on repaint.
          // Reuse its dropdown too, keeping only one listener on the ribbon control.
          const sort = previous ? previous.sort : util.el('div', 'tk-sort', head);
          if (!previous) util.el('span', '', sort, 'Sort by');
          const trig = ribbon || util.el('div', 'tk-trigger', sort);
          if (!previous && trig.parentElement !== sort) {
            trig.parentElement.insertBefore(sort, trig);
            sort.append(trig);
          }
          trig.dataset.role = 'sort';
          V.tval = util.el('span', '', trig);
          trig.insertAdjacentHTML('beforeend', S.H.ICON.chev);
          if (previous) {
            previous.view = V;
            V.optEls = previous.optEls;
            V.dd = previous.dd;
            V.dd.set({ open: false, value: V.ctx.model.sort });
            return;
          }
          const pop = util.el('div', 'tk-pop', sort);
          pop.dataset.role = 'sort-options';
          V.optEls = {};
          for (const [key, label] of fam.SORTS) {
            const option = util.el('div', 'tk-opt', pop, label);
            option.dataset.role = 'option';
            V.optEls[key] = option;
          }
          const binding = { sort, view: V, optEls: V.optEls };
          V.dd = binding.dd = env.ui.dropdown(trig, pop, {
            label: 'sort', value: V.ctx.model.sort,
            options: fam.SORTS.map(([key]) => [key, V.optEls[key]]),
            onChange(value) {
              const current = binding.view;
              if (value !== current.ctx.model.sort) current.commit(current.fam.apply(current.ctx.model, current.spec, { click: { sortBy: value } }));
            },
          });
          if (ribbon) ribbonSorts.set(ribbon, binding);
        },
        ticketPitch: (base, S) => (V) => {
          const pitchCap = V.rng.int(80, 92);
          V.pitch = S.H.pitchFor(V.pane, V.body, V.spec.rows, V.gap, 24, pitchCap + 14, 20);
          V.pane.style.height = V.spec.rows * V.pitch - V.gap + 2 + 'px';
          S.H.mirrorPitch(V.ctx, V.pitch);
        },
        ticketPane: (base, S) => (V) => {
          const { util, rng, fam, main, ctx } = V;
          V.pane = util.el('div', 'as-pane', main);
          V.gap = 1;
          V.foot = util.el('div', 'as-foot', main);
          V.footText = util.el('span', '', V.foot);
          V.footText.innerHTML = `${rng.pick(['Tickets are sent to your email right after payment.', 'All prices include booking fees.', 'Seats are not reserved until payment is complete.'])} <b>Need help?</b> Visit our support center.`;
          V.receipt = util.el('div', 'as-receipt', V.foot);
          V.cancelBuy = S.H.btn(util, 'as-btn sm', V.foot, 'Cancel purchase', 'cancel-buy');
          V.cancelBuy.addEventListener('click', () => {
            if (ctx.model.bought !== null) V.commit(fam.apply(ctx.model, V.spec, { click: { cancelBuy: true } }));
          });
          S.P.ticketPitch(V);
        },
        ticketRow: (base, S) => (V, i) => {
          const { util, spec, fam, fmt, ev, rowsEl, buyEl, buy } = V;
          const t = spec.tickets[i];
          const row = util.el('div', 'tk-row');
          row.dataset.role = 'ticket';
          const select = util.el('div', 'tk-select', row);
          const button = S.H.btn(util, 'as-btn tk-buy', select, '', 'buy');
          button.setAttribute('aria-label', `Buy ${t.name} ${t.code}`);
          button.addEventListener('click', () => { V.x.selected = i; buy(i); });
          row.addEventListener('click', (event) => {
            if (event.target.closest('button') || V.ctx.model.bought !== null || V.ctx.model.pending !== null) return;
            V.x.selected = i;
            V.paint(V.ctx.model);
          });
          const date = util.el('div', 'tk-date', row);
          util.el('div', 'tk-dw', date, fam.fmtDate(t.date).slice(0, 3));
          util.el('div', 'tk-dd', date, String(+t.date.slice(8)));
          util.el('div', 'tk-dm', date, fam.MONTHS[+t.date.slice(5, 7) - 1].slice(0, 3));
          const info = util.el('div', 'tk-info', row);
          info.classList.toggle('polar', /polar/i.test(t.name));
          const logo = util.el('span', 'tk-logo', info);
          const color = /polar/i.test(t.name) ? '#2187ce' : /mountain/i.test(t.name) ? '#533caf' : /lakeside/i.test(t.name) ? '#6bb13a' : /riverton/i.test(t.name) ? '#e83842' : ['#e83842', '#6bb13a', '#533caf', '#2683b1'][S.H.hashStr(t.name) % 4];
          logo.style.color = color;
          logo.innerHTML = /polar|mountain/i.test(t.name) ? MOUNTAIN_MARK : GENERIC_MARK;
          if (/polar/i.test(t.name)) logo.innerHTML = POLAR;
          if (/mountain/i.test(t.name)) logo.innerHTML = MOUNTAIN;
          if (color === '#6bb13a') logo.innerHTML = LAKESIDE;
          util.el('div', 'tk-name', info, t.name);
          util.el('div', 'tk-place', info, `${t.code} · ${fam.fmtDate(t.date)}`);
          const when = util.el('div', 'tk-when tk-departure', row);
          const time = util.el('div', 'tk-time', when);
          if (ev) time.textContent = `Starts ${fam.fmtTime(t.time)}`;
          else time.textContent = fam.fmtTime(t.time);
          const arrival = util.el('div', 'tk-arrival', row, fam.fmtTime(t.time + t.dur));
          if (t.time + t.dur >= 1440) util.el('sup', '', arrival, '+1');
          util.el('div', 'tk-dur', row, fam.fmtDur(t.dur));
          util.el('div', 'tk-price', row, fmt(t.price));
          rowsEl[i] = row;
          buyEl[i] = button;
          return row;
        },
        paintBuyRow: (base, S) => (V, m, i, button) => {
          const mine = m.bought === +i;
          button.disabled = m.bought !== null;
          button.textContent = '';
          button.setAttribute('aria-pressed', String(V.x.selected === +i || mine));
          button.classList.toggle('mine', mine);
          V.rowsEl[i].classList.toggle('bought', mine);
          V.rowsEl[i].classList.toggle('selected', V.x.selected === +i);
        },
        ticketPaint: (base, S) => (V, m) => {
          base(V, m);
          const purchase = document.querySelector('.tdk-buyticket');
          if (purchase) {
            purchase.disabled = m.bought !== null;
            purchase.textContent = m.bought !== null ? 'Purchased' : 'Buy ticket';
          }
        },
      },
    },
  });
})();
