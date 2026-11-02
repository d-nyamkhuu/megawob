/* use-shop/_base-ticket: reference ticket units; scope reads preserve live design overrides. */
(function () {
  'use strict';
  function buildTicket(scope, ctx, body) {
    // One render owns the elements and callbacks shared by its named steps.
    const view = { scope, ctx, body };
    view.row = (...args) => row(view, ...args);
    view.buildList = (...args) => buildList(view, ...args);
    view.paint = (...args) => paint(view, ...args);
    createTicketView(view);
    return {
      paint: view.paint,
      locate(t) {
        if (t.thumb) return view.lbx.locateThumb();
        if (t.scroll !== undefined) return view.lbx.locateThumbFor(t.scroll);
        if (t.pane) return view.scope.where(view.lbx.list, 'ticket list');
        if (t.buy !== undefined) return view.scope.where(view.buyEl[t.buy], `Buy ${t.buy}`);
        if (t.confirm) return view.dlg && view.dlg.locate(t.confirm);
        if (t.cancelBuy) return view.scope.where(view.cancelBuy, 'Cancel purchase');
        if (t.sort) return view.dd.locateTrigger();
        if (t.sortBy) return view.dd.locateOption(t.sortBy);
        return null;
      },
    };
  }

  function row(view, i) {
    const t = view.spec.tickets[i];
    const r = view.util.el('div', 'tk-row');
    r.dataset.role = 'ticket';
    const d = view.util.el('div', 'tk-date', r);
    view.util.el('div', 'tk-dw', d, view.fam.fmtDate(t.date).slice(0, 3));
    view.util.el('div', 'tk-dd', d, String(+t.date.slice(8)));
    view.util.el('div', 'tk-dm', d, view.fam.MONTHS[+t.date.slice(5, 7) - 1].slice(0, 3));
    const info = view.util.el('div', 'tk-info', r);
    view.util.el('div', 'tk-name', info, view.ev ? t.name : `${t.name} · ${t.code}`);
    view.util.el('div', 'tk-place', info, view.ev ? `${t.place} · ${t.code}` : t.place);
    view.util.el('div', 'tk-extra', info, view.ev ? 'E-ticket · venue admission policy applies' : 'Mobile ticket · seat allocation included');
    const w = view.util.el('div', 'tk-when', r);
    const tm = view.util.el('div', 'tk-time', w);
    if (view.ev) tm.textContent = `Starts ${view.fam.fmtTime(t.time)}`;
    else {
      tm.textContent = `${view.fam.fmtTime(t.time)} to ${view.fam.fmtTime(t.time + t.dur)}`;
      if (t.time + t.dur >= 1440) view.util.el('sup', '', tm, '+1');
    }
    view.util.el('div', 'tk-dur', w, `${view.ev ? 'Length' : 'Duration'} ${view.fam.fmtDur(t.dur)}`);
    view.util.el('div', 'tk-price', r, view.fmt(t.price));
    const b = view.scope.btn(view.util, 'as-btn primary tk-buy', r, 'Buy', 'buy');
    b.addEventListener('click', () => view.buy(i));
    view.rowsEl[i] = r;
    view.buyEl[i] = b;
    return r;
  }

  function buildList(view, m) {
    view.builtSort = m.sort;
    view.lbx = view.scope.listPane(view.ctx, view.pane, { keys: view.fam.ticketOrder(view.spec, m.sort), build: view.row, rows: view.spec.rows, pitch: view.pitch, gap: view.gap, scroll: m.scroll, label: 'tickets' });
  }

  function paint(view, m) {
    if (m.sort !== view.builtSort) view.buildList(m);
    view.dd.set({ value: m.sort });
    view.tval.textContent = view.fam.SORTS.find(([k]) => k === m.sort)[1];
    for (const [k, el] of Object.entries(view.optEls)) el.classList.toggle('sel', k === m.sort);
    for (const [i, b] of Object.entries(view.buyEl)) {
      const mine = m.bought === +i;
      b.disabled = m.bought !== null;
      b.textContent = mine ? 'Bought' : 'Buy';
      b.classList.toggle('mine', mine);
      view.rowsEl[i].classList.toggle('bought', mine);
    }
    const t = m.bought !== null ? view.spec.tickets[m.bought] : null;
    view.footText.hidden = !!t;
    view.receipt.hidden = view.cancelBuy.hidden = !t;
    if (t) view.receipt.textContent = `Purchased: ${view.ev ? t.name : `${t.name} · ${t.code}`}, ${view.when(t)} · ${view.fmt(t.price)}`;
    if (view.dlg) {
      view.dlg.set(m.pending !== null);
      if (m.pending !== null && view.dlgFor !== m.pending) {
        view.dlgFor = m.pending;
        const p = view.spec.tickets[m.pending];
        view.dlgBody.replaceChildren();
        const dl = view.util.el('dl', 'tk-sum', view.dlgBody);
        const rowsTxt = [[view.ev ? 'Show' : 'Service', view.ev ? p.name : `${p.name} · ${p.code}`], [view.ev ? 'Venue' : 'Route', p.place],
          ['Date', view.when(p)], [view.ev ? 'Length' : 'Duration', view.fam.fmtDur(p.dur)], ['Tickets', '1 × adult']];
        for (const [a, b] of rowsTxt) {
          view.util.el('dt', '', dl, a);
          view.util.el('dd', '', dl, b);
        }
        const tot = view.util.el('div', 'tk-total', view.dlgBody);
        view.util.el('span', '', tot, 'Total');
        view.util.el('span', '', tot, view.scope.money(view.spec)(p.price));
        view.pay.textContent = `Pay ${view.fmt(p.price)}`;
      }
    }
  }
  function createTicketView(view) {
    ({ util: view.util, spec: view.spec, rng: view.rng } = view.ctx);
    view.fam = view.scope.F();
    view.fmt = view.scope.whole(view.spec);
    view.commit = (m) => { view.ctx.update(m); view.paint(view.ctx.model); };
    view.main = view.util.el('div', 'tk-main', view.body);
    view.head = view.util.el('div', 'tk-head', view.main);
    view.hl = view.util.el('div', '', view.head);
    view.ev = view.spec.kind === 'event';
    view.util.el('div', 'tk-title', view.hl, view.ev ? view.rng.pick(['Upcoming concerts', 'Live this month', 'Concert tickets']) : view.spec.tickets[0].place);
    view.util.el('div', 'tk-sub', view.hl, `${view.spec.tickets.length} ${view.ev ? 'shows' : view.spec.kind === 'train' ? 'train departures' : 'bus departures'} · 1 adult · ${view.ev ? 'Mobile tickets' : 'Standard class'} · all booking fees included`);
    view.sort = view.util.el('div', 'tk-sort', view.head);
    view.util.el('span', '', view.sort, 'Sort by');
    view.trig = view.util.el('div', 'tk-trigger', view.sort);
    view.trig.dataset.role = 'sort';
    view.tval = view.util.el('span', '', view.trig);
    view.trig.insertAdjacentHTML('beforeend', view.scope.ICON.chev);
    view.pop = view.util.el('div', 'tk-pop', view.sort);
    view.pop.dataset.role = 'sort-options';
    view.optEls = {};
    for (const [k, label] of view.fam.SORTS) {
      const o = view.util.el('div', 'tk-opt', view.pop, label);
      o.dataset.role = 'option';
      view.optEls[k] = o;
    }
    view.dd = view.scope.env.ui.dropdown(view.trig, view.pop, {
      label: 'sort',
      value: view.ctx.model.sort,
      options: view.fam.SORTS.map(([k]) => [k, view.optEls[k]]),
      onChange(v) { if (v !== view.ctx.model.sort) view.commit(view.fam.apply(view.ctx.model, view.spec, { click: { sortBy: v } })); },
    });
    view.pane = view.util.el('div', 'as-pane', view.main);
    view.gap = 1;
    view.foot = view.util.el('div', 'as-foot', view.main);
    view.footText = view.util.el('span', '', view.foot);
    view.footText.innerHTML = `${view.rng.pick(['Tickets are sent to your email right after payment.', 'All prices include booking fees.', 'Seats are not reserved until payment is complete.'])} <b>Need help?</b> Visit our support center.`;
    view.receipt = view.util.el('div', 'as-receipt', view.foot);
    view.cancelBuy = view.scope.btn(view.util, 'as-btn sm', view.foot, 'Cancel purchase', 'cancel-buy');
    view.cancelBuy.addEventListener('click', () => { if (view.ctx.model.bought !== null) view.commit(view.fam.apply(view.ctx.model, view.spec, { click: { cancelBuy: true } })); });
    view.pitch = view.scope.pitchFor(view.pane, view.body, view.spec.rows, view.gap, 60, view.rng.int(80, 92), 48);
    view.pane.style.height = view.spec.rows * view.pitch - view.gap + 2 + 'px';
    view.scope.mirrorPitch(view.ctx, view.pitch);
    view.rowsEl = {};
    view.buyEl = {};
    view.buy = (i) => {
      if (view.ctx.model.bought !== null || view.ctx.model.pending !== null) return;
      view.commit(view.fam.apply(view.ctx.model, view.spec, { click: { buy: i } }));
    };
    view.when = (t) => `${view.fam.fmtDate(t.date)}, ${view.fam.fmtTime(t.time)}`;
    view.lbx = null;
    view.builtSort = null;
    view.dlg = null;
    view.dlgBody = null;
    view.pay = null;
    if (view.spec.confirm) {
      const backdrop = view.util.el('div', 'as-backdrop', view.body);
      const box = view.util.el('div', 'as-dialog tk-dlg', view.body);
      box.dataset.role = 'dialog';
      const h = view.util.el('div', 'as-dlg-h', box);
      view.util.el('span', 'as-dlg-t', h, 'Review ticket & payment');
      const x = view.scope.btn(view.util, 'as-x', h, '×');
      view.dlgBody = view.util.el('div', 'as-dlg-b', box);
      const f = view.util.el('div', 'as-dlg-f', box);
      const cancel = view.scope.btn(view.util, 'as-btn', f, 'Cancel');
      view.pay = view.scope.btn(view.util, 'as-btn primary', f, 'Pay');
      const br = view.body.getBoundingClientRect();
      box.style.left = Math.round((br.width - 390) / 2) + 'px';
      box.style.top = Math.round(Math.max(20, br.height * 0.18)) + 'px';
      view.dlg = view.scope.env.ui.dialog(box, {
        open: view.ctx.model.pending !== null,
        close: x,
        closeResult: 'cancel',
        buttons: [['ok', view.pay], ['cancel', cancel]],
        backdrop,
        label: 'confirm',
        onChange(open, result) {
          if (result === 'ok' || result === 'cancel') {
            view.scope.irreversible(view.ctx, { confirm: result });
            view.commit(view.fam.apply(view.ctx.model, view.spec, { click: { confirm: result } }));
          }
        },
      });
    }
    view.dlgFor = null;
    view.paint(view.ctx.model);
  }
  env.template('use-shop/_base-ticket', () => ({ buildTicket }));
})();
