/* use-data-grid/_popovers: grid popovers parts; S holds the live episode state and resolved design parts. */
(function () {
  'use strict';

  function place(S, box, anchorEl, alignRight) {
    const cr = S.card.getBoundingClientRect();
    const ar = anchorEl.getBoundingClientRect();
    const bw = box.offsetWidth;
    const bh = box.offsetHeight;
    let x = (alignRight ? ar.right - bw : ar.left) - cr.left;
    x = Math.max(6, Math.min(S.cardW - bw - 6, x));
    let y = ar.bottom - cr.top + 4;
    if (y + bh > S.cardH - 4) y = Math.max(4, ar.top - cr.top - bh - 4);
    box.style.left = x + 'px';
    box.style.top = y + 'px';
  }

  function drawPop(S, m) {
    if (S.pop) S.pop.remove();
    S.pop = null;
    for (const k of Object.keys(S.popItems)) delete S.popItems[k];

    if (m.menu && m.menu.kind === 'col') {
      S.pop = S.P.el('div', 'to-pop', S.layer);
      const col = m.menu.col;
      S.P.menuItem(S.pop, 'asc', 'Sort ascending', () => S.P.act(S.fam.helpers.setSort(S.ctx.model, col, 'asc')));
      S.P.menuItem(S.pop, 'desc', 'Sort descending', () => S.P.act(S.fam.helpers.setSort(S.ctx.model, col, 'desc')));
      S.P.menuItem(S.pop, 'clear', 'Clear sort', () => S.P.act(S.fam.helpers.setSort(S.ctx.model, col, null)));
      S.P.el('div', 'to-sep', S.pop);
      S.P.menuItem(S.pop, 'pin', 'Pin column', null, 'to-mi dis');
      S.P.menuItem(S.pop, 'hide', 'Hide column', null, 'to-mi dis');
      S.P.place(S.pop, S.parts[col].dots, true);
    } else if (m.menu && m.menu.kind === 'filter') {
      S.pop = S.P.el('div', 'to-pop', S.layer);
      const col = m.menu.col;
      const c = S.spec.cols.find((x) => x.id === col);
      S.P.el('h4', '', S.pop, `Filter by ${c.label}`);
      const all = S.fam.helpers.distinct(S.spec, col, m);
      const d = new Set(m.menu.draft);

      S.P.filterOption('all', '(Select all)', d.size === all.length, () => S.P.act(S.fam.helpers.draftAll(S.ctx.model, S.spec)), d.size > 0 && d.size < all.length);
      for (const v of all) S.P.filterOption(`v:${v}`, v, d.has(v), () => S.P.act(S.fam.helpers.toggleDraft(S.ctx.model, v)));
      const btns = S.P.el('div', 'btns', S.pop);
      const clr = S.P.el('button', 'to-btn', btns, 'Clear');
      clr.type = 'button';
      clr.addEventListener('click', () => S.P.act(S.fam.helpers.clearFilter(S.ctx.model, col)));
      const ap = S.P.el('button', 'to-btn pri', btns, 'Apply');
      ap.type = 'button';
      ap.addEventListener('click', () => S.P.act(S.fam.helpers.applyFilter(S.ctx.model, S.spec)));
      S.popItems.apply = ap;
      S.P.place(S.pop, S.parts[col].funnel || S.parts[col].dots, false);
    } else if (m.markMenu) {
      S.pop = S.P.el('div', 'to-pop', S.layer);
      S.P.el('h4', '', S.pop, 'Set status to');
      for (const s of S.statusOpts) {
        const it = S.P.menuItem(S.pop, `s:${s}`, '', () => S.P.act(S.fam.helpers.runBulk(S.ctx.model, S.spec, 'status', s)));
        const dot = S.P.el('span', '', it);
        dot.style.cssText = `width:8px;height:8px;border-radius:50%;background:${S.toneOf[s]}`;
        S.P.el('span', '', it, s);
      }
      S.P.place(S.pop, S.markBtn, false);
    }
  }

  function drawToastDialog(S, m) {
    if (S.toast) S.toast.remove();
    S.toast = null;
    if (m.toast && m.history.length) {
      const last = m.history[m.history.length - 1];
      const n = last.ids.length;
      const what = n === 1 ? S.spec.entity : S.spec.entities;
      const verb = last.action === 'status' ? `marked ${last.value}` : last.action === 'archive' ? 'archived' : 'deleted';
      S.toast = S.P.el('div', 'to-toast', S.layer);
      S.P.el('span', '', S.toast, `${n} ${what} ${verb}`);
      const u = S.P.el('span', 'u', S.toast, 'Undo');
      u.addEventListener('click', () => S.P.act(S.fam.helpers.undo(S.ctx.model, S.spec)));
      const x = S.P.el('span', 'x', S.toast); S.P.icon(x, 'close');
      x.addEventListener('click', () => S.P.act(S.fam.helpers.dismissToast(S.ctx.model)));
      S.toast.style.bottom = 46 + 10 + 'px';
    }
    if (S.scrim) S.scrim.remove();
    S.scrim = null;
    if (m.confirm) {
      S.scrim = S.P.el('div', 'to-scrim', S.layer);
      const dlg = S.P.el('div', 'to-dialog', S.scrim);
      const n = m.selected.length;
      S.P.el('h3', '', dlg, `Delete ${n} ${n === 1 ? S.spec.entity : S.spec.entities}?`);
      S.P.el('p', '', dlg, 'The selected rows will be removed from this list. You can undo this from the toolbar.');
      const btns = S.P.el('div', 'btns', dlg);
      const cancel = S.P.el('button', 'to-btn', btns, 'Cancel');
      cancel.type = 'button';
      cancel.addEventListener('click', () => S.P.act(S.fam.helpers.cancelConfirm(S.ctx.model)));
      const ok = S.P.el('button', 'to-btn pri', btns, 'Delete');
      ok.type = 'button';
      ok.style.background = S.D.dangerColor;
      ok.style.borderColor = S.D.dangerColor;
      ok.addEventListener('click', () => S.P.act(S.fam.helpers.runBulk(S.ctx.model, S.spec, 'delete', null)));
      S.popItems.cancel = cancel;
      S.popItems.ok = ok;
    }
  }

  function overlays(S) {
    // ---- overlays inside the card
    S.layer = S.P.el('div', '', S.card);
    S.pop = null;
    S.toast = null;
    S.scrim = null;
    S.popItems = {};
  }

  function menuItem(S, parent, key, label, fn, cls = 'to-mi') {
    const it = S.P.el('div', cls, parent, label);
    S.popItems[key] = it;
    if (['asc', 'desc', 'clear'].includes(key)) S.P.icon(it, key === 'asc' ? 'up' : key === 'desc' ? 'down' : 'close');
    if (fn) it.addEventListener('click', fn);
    return it;
  }

  function filterOption(S, key, label, checked, fn, partial) {
    const o = S.P.el('div', 'to-opt', S.pop);
    const b = S.P.el('input', '', o);
    b.type = 'checkbox';
    b.checked = checked;
    if (key === 'all') b.indeterminate = partial;
    S.P.el('span', '', o, label);
    o.addEventListener('click', fn);
    S.popItems[key] = o;
  }

  env.template('use-data-grid/_popovers', () => ({ place, drawPop, drawToastDialog, overlays, menuItem, filterOption }));
})();
