/* use-shop/_shared-ticket: identical ticket part implementations shared by store and adapted.
 * Call with the factory scope; each template retains its overridable BASE entries. */
(function () {
  'use strict';
  function ticketTitle(S) {
    return (V) =>
      V.ev ? V.rng.pick(['Upcoming concerts', 'Live this month', 'Concert tickets']) : V.spec.tickets[0].place;
  }

  function ticketColumns(S) {
    return () => {};
  }

  function ticketList(S) {
    return (V, m) => {
      V.builtSort = m.sort;
      V.lbx = S.H.listPane(V.ctx, V.pane, {
        keys: V.fam.ticketOrder(V.spec, m.sort),
        build: (i) => S.P.ticketRow(V, i),
        rows: V.spec.rows,
        pitch: V.pitch,
        gap: V.gap,
        scroll: m.scroll,
        label: 'tickets',
      });
    };
  }

  function ticketDialog(S) {
    return (V) => {
      const { ctx, util, spec, fam, body, commit } = V;
      V.dlg = null;
      V.dlgBody = null;
      V.pay = null;
      if (spec.confirm) {
        const backdrop = util.el('div', 'as-backdrop', body);
        const box = util.el('div', 'as-dialog tk-dlg', body);
        box.dataset.role = 'dialog';
        const h = util.el('div', 'as-dlg-h', box);
        util.el('span', 'as-dlg-t', h, 'Confirm purchase');
        const x = S.H.btn(util, 'as-x', h, '×');
        V.dlgBody = util.el('div', 'as-dlg-b', box);
        const f = util.el('div', 'as-dlg-f', box);
        const cancel = S.H.btn(util, 'as-btn', f, 'Cancel');
        V.pay = S.H.btn(util, 'as-btn primary', f, 'Pay');
        const br = body.getBoundingClientRect();
        box.style.left = Math.round((br.width - 390) / 2) + 'px';
        box.style.top = Math.round(Math.max(20, br.height * 0.18)) + 'px';
        V.dlg = env.ui.dialog(box, {
          open: ctx.model.pending !== null,
          close: x,
          closeResult: 'cancel',
          buttons: [
            ['ok', V.pay],
            ['cancel', cancel],
          ],
          backdrop,
          label: 'confirm',
          onChange(open, result) {
            if (result === 'ok' || result === 'cancel')
              commit(fam.apply(ctx.model, spec, { click: { confirm: result } }));
          },
        });
      }
      V.dlgFor = null;
    };
  }

  function paintBuyRow(S) {
    return (V, m, i, b) => {
      const mine = m.bought === +i;
      b.disabled = m.bought !== null;
      b.textContent = mine ? S.D.boughtLabel : S.D.buyLabel;
      b.classList.toggle('mine', mine);
      V.rowsEl[i].classList.toggle('bought', mine);
    };
  }

  function ticketLocate(S) {
    return (V, t) => {
      const { lbx, buyEl, cancelBuy, dlg, dd } = V;
      if (t.thumb) return lbx.locateThumb();
      if (t.scroll !== undefined) return lbx.locateThumbFor(t.scroll);
      if (t.pane) return S.H.where(lbx.list, 'ticket list');
      if (t.buy !== undefined) return S.H.where(buyEl[t.buy], `Buy ${t.buy}`);
      if (t.confirm) return dlg && dlg.locate(t.confirm);
      if (t.cancelBuy) return S.H.where(cancelBuy, 'Cancel purchase');
      if (t.sort) return dd.locateTrigger();
      if (t.sortBy) return dd.locateOption(t.sortBy);
      return null;
    };
  }
  env.template('use-shop/_shared-ticket', () => ({ ticketTitle, ticketColumns, ticketList, ticketDialog, paintBuyRow, ticketLocate }));
})();
