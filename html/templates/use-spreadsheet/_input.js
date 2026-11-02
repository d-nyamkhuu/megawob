/* use-spreadsheet/_input: pointer, wheel, keyboard and oracle-target part installer.
 * S is the live workbook scope; BASE retains every overridable part on use-spreadsheet/workbook.
 * Installers only register functions; DOM work starts in render.
 */
(function () {
  'use strict';
  function inputParts(S, BASE) {
    BASE.local = (e) => {
      const r = S.grid.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top];
    };

    BASE.hit = (x, y) => {
      const g = S.geometry;
      let c = g.xs.findIndex((left, i) => i < 8 && x >= left && x < g.xs[i + 1]);
      if (c < 0) c = x < g.gutter ? 0 : 7;
      const slot = Math.max(0, Math.floor((y - g.head) / g.row)), index = slot === 0 ? 0 : slot + S.ctx.model.scrollRow;
      return [g.rows[Math.min(g.rows.length - 1, index)], c];
    };

    BASE.select = (p, shift = false) => {
      let m = S.ctx.model;
      if (m.editing) { S.P.commit(S.task.helpers.transition(m, S.spec, 'formula', S.P.formulaSource(S.formula.value))); m = S.ctx.model; }
      const anchor = shift ? m.selection.slice(0, 2) : p;
      S.P.update({ ...m, selection: [...anchor, ...p], menu: null, editing: false });
    };

    BASE.bind = (ctx) => {
      S.grid.addEventListener('pointerdown', (e) => {
        if (e.button !== 0) return;
        e.preventDefault(); S.grid.focus(); const [x, y] = S.P.local(e), g = S.geometry, b = S.P.selectionBox();
        const colEdge = g.xs.findIndex((edge, i) => i > 0 && i <= 8 && Math.abs(edge - x) < 5);
        if (x > g.w - g.bar) S.gesture = { kind: 'scroll', start: y, offset: ctx.model.scrollRow };
        else if (y < g.head && colEdge > 0 && colEdge < 8) S.gesture = { kind: 'resize', col: colEdge - 1, start: x, width: g.widths[colEdge - 1], neighbor: g.widths[colEdge] };
        else if (y < g.head + g.row) { const p = S.P.hit(x, y); S.P.update({ ...ctx.model, menu: ctx.model.menu?.col === p[1] ? null : { col: p[1] } }); return; }
        else if (Math.abs(x - b.x - b.w) < 8 && Math.abs(y - b.y - b.h) < 8) S.gesture = { kind: 'fill', seed: S.util.clone(ctx.model.selection), end: S.P.hit(x, y) };
        else { const p = S.P.hit(x, y); S.P.select(p, e.shiftKey); S.gesture = { kind: 'select', start: ctx.model.selection.slice(0, 2), end: p }; }
        S.grid.setPointerCapture(e.pointerId);
      });
      S.grid.addEventListener('pointermove', (e) => {
        const [x, y] = S.P.local(e), g = S.geometry;
        if (!S.gesture) { const b = S.P.selectionBox(); S.grid.style.cursor = Math.abs(x - b.x - b.w) < 8 && Math.abs(y - b.y - b.h) < 8 ? 'crosshair' : y < g.head && g.xs.some((edge) => Math.abs(edge - x) < 5) ? 'col-resize' : y < g.head + g.row ? 'pointer' : 'cell'; return; }
        if (S.gesture.kind === 'resize') {
          const next = Math.max(40, Math.min(S.gesture.width + S.gesture.neighbor - 40, S.gesture.width + x - S.gesture.start));
          S.P.update({ ...ctx.model, widths: { ...ctx.model.widths, [S.gesture.col]: next, [S.gesture.col + 1]: S.gesture.neighbor + S.gesture.width - next } });
        } else if (S.gesture.kind === 'scroll') S.P.scrollTo(S.gesture.offset + Math.round((y - S.gesture.start) * g.rows.length / Math.max(1, g.h - g.head)));
        else {
          if (y > g.h - 5) S.P.scrollTo(ctx.model.scrollRow + 1); else if (y < g.head + g.row && ctx.model.scrollRow > 0) S.P.scrollTo(ctx.model.scrollRow - 1);
          S.gesture.end = S.P.hit(x, Math.max(g.head + g.row, Math.min(g.h - 2, y)));
          if (S.gesture.kind === 'select') S.P.update({ ...ctx.model, selection: [...S.gesture.start, ...S.gesture.end] });
        }
      });
      S.grid.addEventListener('pointerup', (e) => {
        if (!S.gesture) return;
        const done = S.gesture; S.gesture = null;
        if (S.grid.hasPointerCapture(e.pointerId)) S.grid.releasePointerCapture(e.pointerId);
        if (done.kind === 'fill') { const [x, y] = S.P.local(e), end = S.P.hit(x, y), seed = S.task.helpers.rect(done.seed);
          const right = Math.abs(end[1] - seed[3]) > Math.abs(end[0] - seed[2]);
          const p = right ? [seed[0], Math.max(seed[3], end[1])] : [Math.max(seed[2], end[0]), seed[1]];
          S.P.commit(S.task.helpers.fill(ctx.model, { ...S.spec, cells: ctx.model.cells }, p));
        }
        S.suppressClick = true;
      });
      S.grid.addEventListener('pointercancel', () => { S.gesture = null; });
      S.grid.addEventListener('click', (e) => {
        if (S.suppressClick) { S.suppressClick = false; return; }
        if (S.util.clickCount(e) >= 2) { S.formula.focus(); S.formula.select(); }
      });
      S.grid.addEventListener('dblclick', (e) => { const [x, y] = S.P.local(e); if (y > S.geometry.head + S.geometry.row) { S.formula.focus(); S.formula.select(); } });
      S.grid.addEventListener('contextmenu', (e) => { e.preventDefault(); const [x, y] = S.P.local(e); S.P.update({ ...ctx.model, menu: { col: S.P.hit(x, y)[1] } }); });
      S.grid.addEventListener('wheel', (e) => { e.preventDefault(); S.P.scrollTo(ctx.model.scrollRow + Math.sign(e.deltaY) * Math.max(1, Math.round(Math.abs(e.deltaY) / S.geometry.row))); }, { passive: false });
      S.grid.addEventListener('keydown', (e) => {
        const m = ctx.model, p = m.selection.slice(2);
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') { e.preventDefault(); S.undo.click(); return; }
        const dirs = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1], Tab: [0, e.shiftKey ? -1 : 1] };
        if (dirs[e.key]) { e.preventDefault(); const d = dirs[e.key]; p[0] = Math.max(1, Math.min(m.cells.length - 1, p[0] + d[0])); p[1] = Math.max(0, Math.min(7, p[1] + d[1])); S.P.select(p, e.shiftKey && e.key !== 'Tab');
          const i = S.geometry.rows.indexOf(p[0]); if (i <= ctx.model.scrollRow) S.P.scrollTo(i - 1); else if (i >= ctx.model.scrollRow + S.geometry.capacity) S.P.scrollTo(i - S.geometry.capacity + 1);
        } else if (e.key === 'Enter' || e.key === 'F2') { e.preventDefault(); S.formula.focus(); S.formula.select(); }
        else if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); const n = S.util.clone(m), a = S.task.helpers.rect(m.selection); for (let r = a[0]; r <= a[2]; r++) for (let c = a[1]; c <= a[3]; c++) n.cells[r][c] = ''; S.P.commit(n); }
        else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) { e.preventDefault(); S.formula.focus(); S.formula.value = e.key; S.P.update({ ...m, editing: true, formulaDraft: e.key }); S.formula.setSelectionRange(1, 1); }
      });
      S.book.addEventListener('pointerdown', (e) => { if (ctx.model.menu && !S.menu.contains(e.target) && !S.grid.contains(e.target)) S.P.update({ ...ctx.model, menu: null }); });
    };

    BASE.scrollTo = (row) => {
      const g = S.geometry, max = Math.max(0, g.rows.length - g.capacity);
      S.P.update({ ...S.ctx.model, scrollRow: Math.max(0, Math.min(max, row)) });
    };

    BASE.locate = (t) => {
      if (t.control) return S.util.center(S.controls[t.control]);
      if (t.option != null) return S.util.center(S.optionEls[t.option]);
      if (t.operator) return S.util.center(S.opEls[t.operator]);
      if (t.color) return S.util.center(S.colorEls[t.color]);
      const g = S.geometry, r = S.grid.getBoundingClientRect();
      if (t.pane) return [r.left + g.w / 2, r.top + g.h / 2];
      if (t.header != null) return [r.left + g.xs[t.header] + g.widths[t.header] / 2, r.top + g.head / 2];
      if (t.handle) { const b = S.P.selectionBox(); return [r.left + b.x + b.w - 1, r.top + b.y + b.h - 1]; }
      const b = S.P.cellBox(t.cell || t.fillEnd);
      return [r.left + b.x + b.w / 2, r.top + b.y + b.h / 2];
    };

    BASE.cell = (ctx, el, m, pos, type) => {};
    BASE.rendered = (ctx, book) => {};
  }

  env.template('use-spreadsheet/_input', () => ({ inputParts }));
})();
