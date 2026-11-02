/* use-shop/_adapted-ticket: adapted ticket parts; designs still override each BASE part. */
(function () {
  'use strict';
  function install(BASE, S) {
    installTicketTitle(BASE, S);
    installPaintSelection(BASE, S);
  }

  function installTicketTitle(BASE, S) {
    BASE.ticketTitle = env.templateLib('use-shop/_shared-ticket').ticketTitle(S);

    // Hook after the head's left block exists, before its title (frame texts a design fills in).
    BASE.ticketHeadHook = () => {};

    // Head: title, subtitle and the "Sort by" dropdown (env.ui.dropdown).
    BASE.ticketHead = (V) => {
      const { ctx, util, spec, fam, main, commit } = V;
      const head = (V.head = util.el('div', 'tk-head', main));
      // Sorting remains available without taking space from the reference comparison cards.
      const shelf = S.D.headInFooter && document.querySelector('.design-footer');
      if (shelf) shelf.insertBefore(head, shelf.querySelector('.footer-right, .end-control'));
      const hl = (V.hl = util.el('div', '', head));
      const ev = V.ev;
      S.P.ticketHeadHook(V);
      util.el('div', 'tk-title', hl, S.P.ticketTitle(V));
      util.el(
        'div',
        'tk-sub',
        hl,
        `${spec.tickets.length} ${ev ? 'shows' : spec.kind === 'train' ? 'train departures' : 'bus departures'} · prices per person, fees included`,
      );
      const sort = util.el('div', 'tk-sort', head);
      util.el('span', '', sort, 'Sort by');
      const trig = util.el('div', 'tk-trigger', sort);
      trig.dataset.role = 'sort';
      V.tval = util.el('span', '', trig);
      trig.insertAdjacentHTML('beforeend', S.H.ICON.chev);
      const pop = util.el('div', 'tk-pop', sort);
      pop.dataset.role = 'sort-options';
      const optEls = (V.optEls = {});
      for (const [k, label] of fam.SORTS) {
        const o = util.el('div', 'tk-opt', pop, label);
        o.dataset.role = 'option';
        optEls[k] = o;
      }
      V.dd = env.ui.dropdown(trig, pop, {
        label: 'sort',
        value: ctx.model.sort,
        options: fam.SORTS.map(([k]) => [k, optEls[k]]),
        onChange(v) {
          if (v !== ctx.model.sort) commit(fam.apply(ctx.model, spec, { click: { sortBy: v } }));
        },
      });
    };

    // Between the head and the pane (column heads of designs that have them).
    BASE.ticketColumns = env.templateLib('use-shop/_shared-ticket').ticketColumns(S);

    // Row pitch of the ticket pane: sets V.pitch and the pane height, mirrors the pitch into the model.
    BASE.ticketPitch = (V) => {
      const { ctx, spec, rng, body, pane, gap } = V;
      const pitchCap = rng.int(80, 92);
      V.pitch = S.H.pitchFor(pane, body, spec.rows, gap, 36, Math.max(pitchCap, 150), 54);
      pane.style.height = spec.rows * V.pitch - gap + 2 + 'px';
      S.H.mirrorPitch(ctx, V.pitch);
    };

    // The pane, the footer note, the purchase receipt with Cancel purchase.
    BASE.ticketPane = (V) => {
      const { ctx, util, rng, fam, main, commit } = V;
      V.pane = util.el('div', 'as-pane', main);
      V.gap = S.D.ticketGap;
      const foot = (V.foot = util.el('div', 'as-foot', main));
      V.footText = util.el('span', '', foot);
      V.footText.innerHTML = `${rng.pick(['Tickets are sent to your email right after payment.', 'All prices include booking fees.', 'Seats are not reserved until payment is complete.'])} <b>Need help?</b> Visit our support center.`;
      V.receipt = util.el('div', 'as-receipt', foot);
      V.cancelBuy = S.H.btn(util, 'as-btn sm', foot, 'Cancel purchase', 'cancel-buy');
      V.cancelBuy.addEventListener('click', () => {
        if (ctx.model.bought !== null) commit(fam.apply(ctx.model, V.spec, { click: { cancelBuy: true } }));
      });
      S.P.ticketPitch(V);
    };

    // One ticket row i; registers V.rowsEl[i] and V.buyEl[i].
    BASE.ticketRow = (V, i) => {
      const { util, spec, fam, fmt, ev, rowsEl, buyEl, buy } = V;
      const t = spec.tickets[i];
      const r = util.el('div', 'tk-row');
      r.dataset.role = 'ticket';
      const d = util.el('div', 'tk-date', r);
      util.el('div', 'tk-dw', d, fam.fmtDate(t.date).slice(0, 3));
      util.el('div', 'tk-dd', d, String(+t.date.slice(8)));
      util.el('div', 'tk-dm', d, fam.MONTHS[+t.date.slice(5, 7) - 1].slice(0, 3));
      util.el('span', 'tk-radio', r).setAttribute('aria-hidden', 'true');
      const ic = util.el('span', 'tk-ic', r);
      ic.setAttribute('aria-hidden', 'true');
      ic.innerHTML =
        spec.kind === 'train'
          ? '<svg viewBox="0 0 24 28" fill="currentColor"><path d="M5 2h14a2 2 0 0 1 2 2v14a3 3 0 0 1-3 3l2 3.5h-2.4L16.5 21h-9L5.4 24.500H3L5 21a3 3 0 0 1-3-3V4a2 2 0 0 1 2-2zm1 3v7h12V5zm1.500 10.500a1.500 1.500 0 1 0 0 3 1.500 1.500 0 0 0 0-3zm9 0a1.500 1.500 0 1 0 0 3 1.500 1.500 0 0 0 0-3z"/></svg>'
          : '<svg viewBox="0 0 24 28" fill="currentColor"><path d="M5 2h14a3 3 0 0 1 3 3v15a2 2 0 0 1-1.500 1.900V24h-3v-2.500h-11V24h-3v-2.100A2 2 0 0 1 2 20V5a3 3 0 0 1 3-3zm-.5 4v6h15V6zm2 9.500a1.600 1.600 0 1 0 0 3.200 1.600 1.600 0 0 0 0-3.200zm11 0a1.600 1.600 0 1 0 0 3.200 1.600 1.600 0 0 0 0-3.200z"/></svg>';
      const info = util.el('div', 'tk-info', r);
      util.el('div', 'tk-name', info, t.name);
      util.el('div', 'tk-service', info, `${t.code} · ${fam.fmtDate(t.date)}`);
      const rt = util.el('div', 'tk-route', r);
      util.el('div', 'tk-place', rt, ev ? `${t.place} · ${t.code}` : t.place);
      const w = util.el('div', 'tk-when', r);
      const tm = util.el('div', 'tk-time', rt);
      if (ev) tm.textContent = `Starts ${fam.fmtTime(t.time)}`;
      else {
        tm.textContent = `${fam.fmtTime(t.time)} – ${fam.fmtTime(t.time + t.dur)}`;
        if (t.time + t.dur >= 1440) util.el('sup', '', tm, '+1');
      }
      util.el('div', 'tk-dur', w, fam.fmtDur(t.dur));
      util.el('div', 'tk-sub2', w, ev ? 'Length' : 'Duration');
      util.el('div', 'tk-price', r, fmt(t.price));
      const b = S.H.btn(util, 'as-btn primary tk-buy', r, 'Buy', 'buy');
      b.addEventListener('click', () => buy(i));
      rowsEl[i] = r;
      buyEl[i] = b;
      return r;
    };

    BASE.ticketList = env.templateLib('use-shop/_shared-ticket').ticketList(S);

    // The Confirm purchase dialog (spec.confirm).
    BASE.ticketDialog = env.templateLib('use-shop/_shared-ticket').ticketDialog(S);

    // One row's Buy button after a model change.
    BASE.paintBuyRow = env.templateLib('use-shop/_shared-ticket').paintBuyRow(S);
  }

  function installPaintSelection(BASE, S) {
    BASE.paintSelection = (V, m, t) => {
      if (!S.D.selectionPane) return;
      const { spec, fam, fmt } = V;
      // The separate selection pane reflects the same purchase state as the ticket list.
      const selected = t || (m.pending !== null ? spec.tickets[m.pending] : null);
      const selectionStatus = document.querySelector('[data-role="selection-status"]');
      const selectionFields = document.querySelector('[data-role="selection-details"]');
      if (selectionStatus)
        selectionStatus.textContent = selected
          ? t
            ? 'Ticket purchased.'
            : 'Confirm your ticket purchase.'
          : 'No ticket selected yet.';
      if (selectionFields) {
        const values = selected
          ? [
              selected.name,
              selected.place,
              `${fam.fmtDate(selected.date)}, ${fam.fmtTime(selected.time)}`,
              fam.fmtTime(selected.time + selected.dur) + (selected.time + selected.dur >= 1440 ? ' (+1 day)' : ''),
              fam.fmtDur(selected.dur),
              fmt(selected.price),
            ]
          : Array(6).fill('—');
        selectionFields.querySelectorAll('dd').forEach((field, i) => {
          field.textContent = values[i];
        });
      }
    };

    // The summary lines of the pending purchase in the dialog.
    BASE.paintDialogBody = (V, p) => {
      const { util, spec, fam, ev, dlgBody, pay, when } = V;
      dlgBody.replaceChildren();
      const dl = util.el('dl', 'tk-sum', dlgBody);
      const rowsTxt = [
        [ev ? 'Show' : 'Service', ev ? p.name : `${p.name} · ${p.code}`],
        [ev ? 'Venue' : 'Route', p.place],
        ['Date', when(p)],
        [ev ? 'Length' : 'Duration', fam.fmtDur(p.dur)],
        ['Tickets', '1 × adult'],
      ];
      for (const [a, b] of rowsTxt) {
        util.el('dt', '', dl, a);
        util.el('dd', '', dl, b);
      }
      const tot = util.el('div', 'tk-total', dlgBody);
      util.el('span', '', tot, 'Total');
      util.el('span', '', tot, S.H.money(spec)(p.price));
      pay.textContent = `Pay ${V.fmt(p.price)}`;
    };

    BASE.ticketPaint = (V, m) => {
      const { spec, fam, fmt, ev, tval, optEls, buyEl, footText, receipt, cancelBuy, when } = V;
      if (m.sort !== V.builtSort) S.P.ticketList(V, m);
      V.dd.set({ value: m.sort });
      tval.textContent = fam.SORTS.find(([k]) => k === m.sort)[1];
      for (const [k, el] of Object.entries(optEls)) el.classList.toggle('sel', k === m.sort);
      for (const [i, b] of Object.entries(buyEl)) S.P.paintBuyRow(V, m, i, b);
      const t = m.bought !== null ? spec.tickets[m.bought] : null;
      S.P.paintSelection(V, m, t);
      footText.hidden = !!t;
      receipt.hidden = cancelBuy.hidden = !t;
      if (t)
        receipt.textContent = `✓ Purchased: ${ev ? t.name : `${t.name} · ${t.code}`}, ${when(t)} · ${fmt(t.price)}`;
      if (V.dlg) {
        V.dlg.set(m.pending !== null);
        if (m.pending !== null && V.dlgFor !== m.pending) {
          V.dlgFor = m.pending;
          S.P.paintDialogBody(V, spec.tickets[m.pending]);
        }
      }
    };

    BASE.ticketLocate = env.templateLib('use-shop/_shared-ticket').ticketLocate(S);

    BASE.buildTicket = (ctx, body) => {
      const { util, spec, rng } = ctx;
      const fam = S.H.F();
      const V = { ctx, body, util, spec, rng, fam, fmt: S.H.whole(spec), x: {} };
      V.commit = (m) => {
        ctx.update(m);
        V.paint(ctx.model);
      };
      V.paint = (m) => S.P.ticketPaint(V, m);
      V.main = util.el('div', 'tk-main', body);
      V.ev = spec.kind === 'event';
      S.P.ticketHead(V);
      S.P.ticketColumns(V);
      S.P.ticketPane(V);
      V.rowsEl = {};
      V.buyEl = {};
      V.buy = (i) => {
        if (ctx.model.bought !== null || ctx.model.pending !== null) return;
        V.commit(fam.apply(ctx.model, spec, { click: { buy: i } }));
      };
      V.when = (t) => `${fam.fmtDate(t.date)}, ${fam.fmtTime(t.time)}`;
      V.lbx = null;
      V.builtSort = null;
      S.P.ticketDialog(V);
      V.paint(ctx.model);
      S.P.built(V);
      return { paint: V.paint, locate: (t) => S.P.ticketLocate(V, t) };
    };
  }
  env.template('use-shop/_adapted-ticket', () => ({ install }), { uses: ['use-shop/_shared-ticket'] });
})();
