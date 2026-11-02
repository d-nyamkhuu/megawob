/* use-data-grid/_common: grid common parts; S holds the live episode state and resolved design parts. */
(function () {
  'use strict';

  function sizeOf(S, m) {
    return S.fam.helpers.pageSizeOf(m, S.spec);
  }

  function el(S, tag, cls, parent, text) {
    return S.util.el(tag, cls, parent, text);
  }

  function px(S, w) {
    return Math.round(w * S.scale);
  }

  function fmtShow(S, a, b, n) {
    return (n ? `Showing ${a}–${b} of ${n}` : 'No matching rows');
  }

  function bulkButton(S, label, cls, key) {
    const b = S.P.el('button', `to-btn ${cls}`, S.selBar, label);
    b.type = 'button';
    b.dataset.key = key;
    return b;
  }

  function locate(S, t) {
    const m = S.ctx.model;
    if (t.header) return S.P.pointOn(S.parts[t.header].lbl) || S.P.pointOn(S.hcells[t.header]);
    if (t.menuBtn) return S.P.pointOn(S.parts[t.menuBtn].dots);
    if (t.funnel) return S.P.pointOn(S.parts[t.funnel].funnel);
    if (t.edge) {
      const r = S.parts[t.edge].edge.getBoundingClientRect();
      return [r.left + r.width / 2, r.top + r.height / 2];
    }
    if (t.edgeAt) {
      const [col, w] = t.edgeAt;
      const hr = S.hcells[col].getBoundingClientRect();
      const er = S.parts[col].edge.getBoundingClientRect();
      return [hr.left + w * S.scale, er.top + er.height / 2];
    }
    if (t.slot !== undefined) {
      const others = m.order.filter((c) => c !== t.col).map((c) => S.hcells[c].getBoundingClientRect());
      const hr = S.hcells[t.col].getBoundingClientRect();
      const y = hr.top + hr.height / 2;
      if (!others.length) return [hr.left + hr.width / 2, y];
      if (t.slot <= 0) return [others[0].left + 4, y];
      if (t.slot >= others.length) return [others[others.length - 1].right - 4, y];
      return [(others[t.slot - 1].right + others[t.slot].left) / 2, y];
    }
    if (t.menuItem) return S.P.pointOn(S.popItems[t.menuItem]);
    if (t.filterOpt !== undefined) return S.P.pointOn(S.popItems[`v:${t.filterOpt}`]);
    if (t.filterAll) return S.P.pointOn(S.popItems.all);
    if (t.filterApply) return S.P.pointOn(S.popItems.apply);
    if (t.search) return S.P.pointOn(S.input);
    if (t.clearFilters) return S.P.pointOn(S.clearAll);
    if (t.viewport) return S.P.pointOn(S.body);
    if (t.pageSize) return S.P.pointOn(S.sizes[t.pageSize]);
    if (t.row) return S.P.pointOn(S.body.querySelector(`input[data-id="${t.row}"]`));
    if (t.rowBody) return S.P.pointOn(S.body.querySelector(`.to-row[data-id="${t.rowBody}"] .to-c`));
    if (t.cell) return S.P.pointOn(S.body.querySelector(`.to-row[data-id="${t.cell[0]}"] .to-c[data-col="${t.cell[1]}"]`));
    if (t.cellInput) return S.P.pointOn(S.editInput && S.editInput.isConnected ? S.editInput : null);
    if (t.all) return S.P.pointOn(S.allBox);
    if (t.clearSel) return S.P.pointOn(S.clearSelBtn);
    if (t.page !== undefined) return S.P.pointOn(S.pgButtons[`p${t.page}`]);
    if (t.pager) return S.P.pointOn(S.pgButtons[t.pager]);
    if (t.bulk) return S.P.pointOn({ status: S.markBtn, archive: S.archBtn, delete: S.delBtn }[t.bulk]);
    if (t.statusOpt) return S.P.pointOn(S.popItems[`s:${t.statusOpt}`]);
    if (t.confirm) return S.P.pointOn(S.popItems[t.confirm]);
    if (t.undo) return S.P.pointOn(S.undoBtn.hidden ? null : S.undoBtn) || S.P.pointOn(S.toast && S.toast.querySelector('.u'));
    if (t.blank) return S.P.pointOn(S.title);
    return null;
  }

  function pointOn(S, el) {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    if (!(r.width > 0 && r.height > 0)) return null;
    const fx = [0.5, 0.3, 0.7, 0.15, 0.85];
    const fy = [0.5, 0.3, 0.7];
    for (const y of fy) {
      for (const x of fx) {
        const p = [r.left + r.width * x, r.top + r.height * y];
        const hit = document.elementFromPoint(p[0], p[1]);
        if (hit && (hit === el || el.contains(hit))) return p;
      }
    }
    return [r.left + r.width / 2, r.top + r.height / 2];
  }

  function icon(S, node, key, before = true) {
    const holder = document.createElement('span'); holder.className = 'to-icon'; holder.innerHTML = S.D.icons[key];
    before ? node.prepend(holder) : node.append(holder); return holder;
  }

  function style(S) {
    if (document.getElementById('to-style')) return;
    const s = document.createElement('style');
    s.id = 'to-style';
    s.textContent = S.D.css.replace('12px/1.4 system-ui,sans-serif', S.D.font)
      .replaceAll('#c92a2a', S.D.dangerColor)
      .replace('width:156px;', `width:${S.D.navWidth}px;`)
      .replace('width:44px;', `width:${S.D.railWidth}px;`)
      .replace('width:188px;', `width:${S.D.contextWidth}px;`) + S.D.extraCss;
    document.head.append(s);
  }

  function begin(S, ctx) {
  }

  function rendered(S, ctx) {
  }

  function rowReady(S, row, r, m) {
  }

  function cellReady(S, cell, r, id, m) {
  }

  env.template('use-data-grid/_common', () => ({ sizeOf, el, px, fmtShow, bulkButton, locate, pointOn, icon, style, begin, rendered, rowReady, cellReady }));
})();
