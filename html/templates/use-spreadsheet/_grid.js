/* use-spreadsheet/_grid: workbook state, geometry, DOM and canvas painting part installers.
 * S is the live workbook scope; BASE retains every overridable part on use-spreadsheet/workbook.
 * Installers only register functions; DOM work starts in render.
 */
(function () {
  'use strict';
  function stateParts(S, BASE) {
    BASE.snapshot = (m) => {
      return ({ cells: S.util.clone(m.cells), order: [...m.order], sort: S.util.clone(m.sort), filter: S.util.clone(m.filter), rule: S.util.clone(m.rule) });
    };

    BASE.update = (n) => {
      S.ctx.update(n); S.P.draw(S.ctx.model);
    };

    BASE.commit = (n) => {
      n.history = [...S.ctx.model.history.slice(-15), S.P.snapshot(S.ctx.model)]; S.P.update(n);
    };

    BASE.calc = () => {
      const w = S.grid.clientWidth, h = S.grid.clientHeight, gutter = S.isCanvas ? S.D.canvasGutter : S.D.gutter, head = S.isCanvas ? S.D.canvasHeaderHeight : S.D.headerHeight, bar = S.D.scrollbarWidth;
      const row = Math.max(S.D.minRowHeight, Math.min(S.isCanvas ? S.D.canvasRowHeight : S.D.rowHeight, Math.floor((h - head) / 8)));
      const base = (w - gutter - bar) / 8, weights = S.isCanvas ? S.D.canvasColumnWeights : S.D.columnWeights;
      const weightSum = weights.reduce((a, b) => a + b, 0), widths = weights.map((x, c) => S.ctx.model.widths[c] || base * x * 8 / weightSum), xs = [gutter];
      for (const width of widths) xs.push(xs[xs.length - 1] + width);
      const rows = [0, ...S.task.helpers.visible(S.ctx.model, S.spec), ...Array.from({ length: S.ctx.model.cells.length - S.spec.n - 1 }, (_, i) => S.spec.n + 1 + i)];
      return { w, h, gutter, head, bar, row, widths, xs, rows, capacity: Math.max(2, Math.floor((h - head) / row)) };
    };

    BASE.cellBox = (p) => {
      const g = S.geometry, index = g.rows.indexOf(p[0]);
      return { x: g.xs[p[1]], y: g.head + (index === 0 ? 0 : index - S.ctx.model.scrollRow) * g.row, w: g.widths[p[1]], h: g.row };
    };

    BASE.selectionBox = () => {
      const a = S.task.helpers.rect(S.ctx.model.selection), p = S.P.cellBox(a.slice(0, 2)), q = S.P.cellBox(a.slice(2));
      return { x: p.x, y: p.y, w: q.x + q.w - p.x, h: q.y + q.h - p.y };
    };

    BASE.draw = (m) => {
      S.geometry = S.P.calc(); const g = S.geometry;
      if (m.visibleRows !== g.capacity - 1) { S.ctx.update({ ...m, visibleRows: g.capacity - 1 }); m = S.ctx.model; }
      const sel = S.task.helpers.rect(m.selection), stats = S.task.helpers.selectionStats(m, S.spec);
      S.nameBox.value = S.task.helpers.rangeName([...S.P.sheetCell(sel.slice(0, 2), m), ...S.P.sheetCell(sel.slice(2), m)]);
      const st = m.sheetStyle || {};
      S.fontPick.firstChild.textContent = st.font || S.D.font;
      S.numberPick.firstChild.textContent = st.format === 'general' ? 'General' : 'Number';
      S.tableInfo.textContent = `${S.task.helpers.visible(m, S.spec).length} of ${S.spec.n} records / USD`;
      let raw = m.cells[m.selection[0]]?.[m.selection[1]] ?? '';
      if (m.sort && String(raw).startsWith('=')) raw = S.task.helpers.translate(raw, S.P.sheetCell(m.selection.slice(0, 2), m)[0] - m.selection[0], 0);
      if (document.activeElement !== S.formula || !m.editing) S.formula.value = m.editing ? m.formulaDraft : String(raw);
      S.ready.textContent = m.editing ? 'Editing' : m.filter ? 'Filter active' : 'Ready';
      S.count.textContent = `Numeric cells: ${stats.count}`; S.sum.textContent = `Sum: ${stats.sum}`;
      S.records.textContent = `Visible records: ${stats.records}`; S.total.textContent = `Amount total: ${stats.total}`;
      S.undo.disabled = !m.history.length; S.controls.clearFilter.disabled = !m.filter;
      if (S.isCanvas) S.P.paintCanvas(m); else S.P.paintDOM(m);
      S.P.drawMenu(m); S.shade.hidden = !m.dialog;
      if (m.dialog) {
        if (document.activeElement !== S.rangeField) S.rangeField.value = m.draft.range;
        if (document.activeElement !== S.threshold) S.threshold.value = m.draft.threshold;
        for (const op in S.opEls) S.opEls[op].classList.toggle('on', op === m.draft.op);
        for (const c in S.colorEls) S.colorEls[c].classList.toggle('on', c === m.draft.color);
        S.preview.style.background = S.D.colors[m.draft.color][0]; S.preview.style.color = S.D.colors[m.draft.color][1];
        const a = S.task.helpers.parseRange(m.draft.range); S.controls.apply.disabled = !a || a[2] >= m.cells.length || a[3] >= 8 || m.draft.threshold.trim() === '' || !Number.isFinite(+m.draft.threshold);
      }
    };

    BASE.visual = (m, p) => {
      const value = S.task.helpers.evaluate(m.cells, p), inRule = m.rule && p[0] >= m.rule.range[0] && p[0] <= m.rule.range[2] && p[1] >= m.rule.range[1] && p[1] <= m.rule.range[3] && S.task.helpers.matches(value, m.rule.op, +m.rule.threshold);
      const st = m.sheetStyle || {};
      let text = S.task.helpers.display(value);
      if (typeof value === 'number' && st.format !== 'general') {
        const digits = st.decimals ? 3 : [3, 4, 6].includes(p[1]) ? 2 : 0;
        text = (st.percent ? value * 100 : value).toFixed(digits).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (st.percent ? '%' : '');
        if (st.currency && !st.percent) text = '$' + text;
      }
      return { text, numeric: typeof value === 'number', inRule, error: typeof value === 'string' && value.startsWith('#') };
    };

    BASE.pieces = (m, emit) => {
      const g = S.geometry;
      emit(0, 0, g.w, g.head, '', 'header');
      for (let c = 0; c < 8; c++) emit(g.xs[c], 0, g.widths[c], g.head, S.task.helpers.addr([0, c]).replace(/\d/g, ''), 'letter', [0, c]);
      for (let slot = 0; slot < g.capacity + 1; slot++) {
        const index = slot === 0 ? 0 : slot + m.scrollRow;
        const r = g.rows[index]; if (r == null) break;
        const y = g.head + slot * g.row;
        emit(0, y, g.gutter, g.row, String(m.sort && r > 0 && r <= S.spec.n ? m.order.indexOf(r) + 2 : r + 1), 'rowhead');
        for (let c = 0; c < 8; c++) {
          const v = S.P.visual(m, [r, c]);
          emit(g.xs[c], y, g.widths[c], g.row, v.text, r === 0 ? 'tablehead' : v.inRule ? 'conditional' : v.error ? 'error' : c === 5 && r <= S.spec.n ? 'status' : v.numeric ? 'number' : 'cell', [r, c]);
        }
      }
    };

    BASE.paintDOM = (m) => {
      S.grid.replaceChildren();
      S.P.pieces(m, (...args) => S.P.cellDOM(m, ...args));
      S.P.selectionDOM(m);
      S.P.scrollbarDOM(m);
    };

    BASE.scrollbar = (m) => {
      const g = S.geometry, track = g.h - g.head - g.row, totalRows = Math.max(1, g.rows.length - 1), h = Math.max(22, track * Math.min(1, (g.capacity - 1) / totalRows));
      return { y: g.head + g.row + (track - h) * m.scrollRow / Math.max(1, totalRows - (g.capacity - 1)), h };
    };

    BASE.paintCanvas = (m) => {
      const g = S.geometry, dpr = window.devicePixelRatio || 1;
      S.canvas.width = Math.round(g.w * dpr); S.canvas.height = Math.round(g.h * dpr); S.canvas.style.width = g.w + 'px'; S.canvas.style.height = g.h + 'px';
      const p = S.canvas.getContext('2d'), css = getComputedStyle(S.book), fg = css.getPropertyValue('--fg').trim(), panel = css.getPropertyValue('--panel').trim(), line = css.getPropertyValue('--line').trim(), muted = css.getPropertyValue('--muted').trim(), accent = css.getPropertyValue('--sheet-accent').trim();
      p.scale(dpr, dpr); p.fillStyle = panel; p.fillRect(0, 0, g.w, g.h);
      S.P.pieces(m, (...args) => S.P.cellCanvas(m, p, { fg, panel, line, muted, accent }, ...args));
      p.strokeStyle = muted; p.lineWidth = 2; p.beginPath(); p.moveTo(0, g.head + g.row); p.lineTo(g.w, g.head + g.row); p.stroke();
      S.P.selectionCanvas(m, p, accent);
      S.P.scrollbarCanvas(m, p, panel, muted);
    };

    BASE.drawMenu = (m) => {
      S.menu.hidden = !m.menu;
      if (!m.menu) { S.menuKey = ''; return; }
      const key = String(m.menu.col);
      if (S.menuKey !== key) {
        S.menuKey = key; S.menu.replaceChildren(); Object.keys(S.optionEls).forEach((k) => delete S.optionEls[k]);
        S.P.menuItems(m);
      }
      const gr = S.grid.getBoundingClientRect(), br = S.book.getBoundingClientRect();
      S.menu.style.left = Math.max(5, Math.min(S.book.clientWidth - 220, gr.left - br.left + S.geometry.xs[m.menu.col])) + 'px';
      S.menu.style.top = gr.top - br.top + S.geometry.head + 'px';
    };
  }

  function paintParts(S, BASE) {
    BASE.cellDOM = (m, x, y, w, h, text, type, p) => {
      const el = S.util.el('div', 'as-cell', S.grid); Object.assign(el.style, { left: x + 'px', top: y + 'px', width: w + 'px', height: h + 'px' });
      const st = m.sheetStyle || {};
      if (p && p[0] > 0) { el.style.fontFamily = st.font || S.D.font; el.style.fontWeight = st.bold ? 'bold' : ''; el.style.fontStyle = st.italic ? 'italic' : ''; el.style.textDecoration = st.underline ? 'underline' : ''; if (st.large) el.style.fontSize = S.D.largeFontSize + 'px'; if (st.borders) el.style.borderColor = 'var(--muted)'; }
      if (type === 'header' || type === 'letter' || type === 'rowhead') { el.style.background = 'color-mix(in srgb,var(--fg) 5%,var(--panel))'; el.style.color = 'var(--muted)'; el.style.justifyContent = 'center'; }
      if (type === 'tablehead') { el.classList.add('tablehead'); el.style.fontWeight = 'bold'; el.style.background = 'color-mix(in srgb,var(--sheet-accent) 9%,var(--panel))'; }
      if (type === 'number') el.style.justifyContent = 'flex-end';
      if (type === 'conditional') { el.style.background = S.D.colors[m.rule.color][0]; el.style.color = S.D.colors[m.rule.color][1]; el.style.justifyContent = 'flex-end'; }
      const label = S.util.el('span', type === 'status' ? 'as-pill' : '', el, text);
      if (type === 'status') { const tone = S.D.statusTones[text] || S.D.statusTones.other; label.style.background = `color-mix(in srgb,${tone} 14%,var(--panel))`; }
      if (type === 'error') { el.classList.add('as-error'); el.title = 'Formula error: check references in the formula bar'; }
      if (p && type === 'tablehead') S.P.icon(el, m.sort?.col === p[1] ? m.sort.dir : m.filter?.col === p[1] ? 'filter' : 'down', 10);
      if (p) { el.setAttribute('role', p[0] === 0 ? 'columnheader' : 'gridcell'); el.setAttribute('aria-label', `${S.task.helpers.addr(p)} ${text}`); }
      S.P.cell(S.ctx, el, m, p, type);
      return el;
    };

    BASE.selectionDOM = (m) => {
      const g = S.geometry;
      const b = S.P.selectionBox();
      if (b.y + b.h >= g.head + g.row && b.y < g.h) {
        const selection = S.util.el('div', 'as-selection', S.grid);
        Object.assign(selection.style, { left: b.x + 'px', top: Math.max(g.head + g.row, b.y) + 'px', width: b.w + 'px', height: Math.min(g.h, b.y + b.h) - Math.max(g.head + g.row, b.y) + 'px' });
        const handle = S.util.el('div', 'as-handle', S.grid); Object.assign(handle.style, { left: b.x + b.w - 4 + 'px', top: b.y + b.h - 4 + 'px' });
      }
    };

    BASE.scrollbarDOM = (m) => {
      const g = S.geometry;
      const bar = S.util.el('div', '', S.grid), thumb = S.P.scrollbar(m);
      Object.assign(bar.style, { position: 'absolute', left: g.w - g.bar + 'px', top: thumb.y + 'px', width: '8px', height: thumb.h + 'px', background: 'var(--muted)', borderRadius: '4px', opacity: '.45', pointerEvents: 'none' });
    };

    BASE.cellCanvas = (m, p, palette, x, y, w, h, text, type, pos) => {
      const { fg, panel, line, muted, accent } = palette;
      p.save(); p.beginPath(); p.rect(x, y, w, h); p.clip();
      const header = ['header', 'letter', 'rowhead', 'tablehead'].includes(type);
      p.fillStyle = type === 'conditional' ? S.D.colors[m.rule.color][0] : panel; p.fillRect(x, y, w, h);
      if (header) { p.globalAlpha = type === 'tablehead' ? .13 : .07; p.fillStyle = type === 'tablehead' ? accent : fg; p.fillRect(x, y, w, h); p.globalAlpha = 1; }
      p.strokeStyle = line; p.lineWidth = 1; p.strokeRect(x + .5, y + .5, w, h);
      const st = m.sheetStyle || {};
      p.font = `${st.italic && !header ? 'italic ' : ''}${type === 'tablehead' || (st.bold && !header) ? 'bold ' : ''}${st.large && !header ? S.D.largeFontSize : S.D.cellFontSize}px ${header ? S.D.font : st.font || S.D.font}`; p.textBaseline = 'middle';
      p.fillStyle = type === 'conditional' ? S.D.colors[m.rule.color][1] : type === 'error' ? S.D.errorColor : header && type !== 'tablehead' ? muted : fg;
      p.textAlign = type === 'number' || type === 'conditional' ? 'right' : type === 'letter' || type === 'rowhead' ? 'center' : 'left';
      const tx = p.textAlign === 'right' ? x + w - 8 : p.textAlign === 'center' ? x + w / 2 : x + 7;
      const limit = w - (type === 'tablehead' ? 23 : 12);
      let t = text;
      if (p.measureText(t).width > limit) { while (t.length && p.measureText(t + '...').width > limit) t = t.slice(0, -1); t += '...'; }
      if (type === 'status') { p.save(); p.fillStyle = S.D.statusTones[text] || S.D.statusTones.other; p.globalAlpha = .18; p.fillRect(x + 4, y + 3, Math.min(w - 8, p.measureText(t).width + 10), h - 6); p.restore(); }
      p.fillText(t, tx, y + h / 2);
      if (type === 'tablehead') {
        p.save(); p.translate(x + w - 17, y + h / 2 - 6); p.scale(.6, .6); p.strokeStyle = muted; p.lineWidth = 1.7;
        p.stroke(new Path2D(S.D.icons[m.sort?.col === pos[1] ? m.sort.dir : m.filter?.col === pos[1] ? 'filter' : 'down'])); p.restore();
      }
      if (type === 'error') { p.strokeStyle = S.D.errorColor; p.lineWidth = 3; p.beginPath(); p.moveTo(x + w - 6, y + 2); p.lineTo(x + w - 2, y + 2); p.lineTo(x + w - 2, y + 6); p.stroke(); }
      if (st.underline && !header) { p.strokeStyle = p.fillStyle; p.beginPath(); p.moveTo(x + 5, y + h - 4); p.lineTo(x + w - 5, y + h - 4); p.stroke(); }
      p.restore();
    };

    BASE.selectionCanvas = (m, p, accent) => {
      const g = S.geometry;
      const b = S.P.selectionBox();
      p.save(); p.beginPath(); p.rect(g.gutter, g.head + g.row, g.w - g.gutter, g.h - g.head - g.row); p.clip();
      p.fillStyle = accent; p.globalAlpha = .09; p.fillRect(b.x, b.y, b.w, b.h); p.globalAlpha = 1;
      p.strokeStyle = accent; p.lineWidth = 2; p.strokeRect(b.x + 1, b.y + 1, b.w - 1, b.h - 1); p.fillStyle = accent; p.fillRect(b.x + b.w - 4, b.y + b.h - 4, 7, 7); p.restore();
    };

    BASE.scrollbarCanvas = (m, p, panel, muted) => {
      const g = S.geometry;
      const thumb = S.P.scrollbar(m); p.fillStyle = panel; p.fillRect(g.w - g.bar, 0, g.bar, g.h); p.globalAlpha = .4; p.fillStyle = muted; p.fillRect(g.w - 8, thumb.y, 5, thumb.h); p.globalAlpha = 1;
    };

    BASE.menuItems = (m) => {
      S.util.el('small', '', S.menu, `${S.task.helpers.addr([0, m.menu.col]).replace(/\d/g, '')} · ${S.spec.cells[0][m.menu.col]}`);
      S.P.button(S.menu, 'Sort ascending', 'asc', () => S.P.commit(S.task.helpers.transition(S.ctx.model, S.spec, 'sort', 'asc')), '', 'asc');
      S.P.button(S.menu, 'Sort descending', 'desc', () => S.P.commit(S.task.helpers.transition(S.ctx.model, S.spec, 'sort', 'desc')), '', 'desc');
      S.util.el('hr', '', S.menu); S.util.el('small', '', S.menu, 'Filter · Show only');
      const values = [...new Set(S.spec.cells.slice(1, S.spec.n + 1).map((r) => String(r[m.menu.col])))];
      for (const value of values.slice(0, 8)) S.optionEls[value] = S.P.button(S.menu, value, null, () => S.P.commit(S.task.helpers.transition(S.ctx.model, S.spec, 'filter', value)));
      S.P.button(S.menu, 'Show all records', null, () => S.P.commit(S.task.helpers.transition(S.ctx.model, S.spec, 'clearFilter')));
    };
  }

  env.template('use-spreadsheet/_grid', () => ({ stateParts, paintParts }));
})();
