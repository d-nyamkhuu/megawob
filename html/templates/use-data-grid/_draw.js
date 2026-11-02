/* use-data-grid/_draw: grid draw parts; S holds the live episode state and resolved design parts. */
(function () {
  'use strict';

  function drawHeader(S, m) {
    // Reorder header cells in place (focus survives), then widths and states.
    const now = [...S.hrow.children].filter((x) => x.dataset.col).map((x) => x.dataset.col);
    if (now.join() !== m.order.join()) for (const id of m.order) S.hrow.insertBefore(S.hcells[id], S.hfill);
    for (const c of S.spec.cols) {
      const h = S.hcells[c.id];
      const p = S.parts[c.id];
      h.style.width = S.P.px(m.widths[c.id]) + 'px';
      h.title = c.label;
      const s = m.sort && m.sort.col === c.id ? m.sort.dir : null;
      h.classList.toggle('sorted', !!s);
      h.setAttribute('aria-sort', s === 'asc' ? 'ascending' : s === 'desc' ? 'descending' : 'none');
      p.arrow.innerHTML = s ? S.D.icons[s === 'asc' ? 'up' : 'down'] : ''; p.arrow.style.width = '12px'; p.arrow.style.height = '12px';
      if (p.funnel) p.funnel.classList.toggle('on', !!m.filters[c.id] || !!(m.menu && m.menu.kind === 'filter' && m.menu.col === c.id));
      p.dots.classList.toggle('on', !!(m.menu && m.menu.kind === 'col' && m.menu.col === c.id));
    }
  }

  function decorate(S, cell, row, id, m) {
    const nameId = { tickets: 'contact', orders: 'customer', people: 'name', inventory: 'product', invoices: 'client' }[S.spec.domain];
    if (id === nameId && S.rowH >= 24) {
      const text = String(S.fam.helpers.valueOf(m, S.spec, row, id));
      const avatar = S.P.el('b', 'to-avatar', cell, text.split(' ').map(x => x[0]).slice(0,2).join(''));
      cell.prepend(avatar);
    }
    if (id === 'priority') { cell.classList.add('to-priority', String(row.c[id]).toLowerCase()); S.P.icon(cell, 'flag'); }
  }

  function drawRows(S, m) {
    S.drawing = true;
    const scrollTop = S.body.scrollTop;
    S.body.replaceChildren();
    if (S.virtual) S.P.el('div', '', S.body).style.height = (m.virtualTop || 0) * S.rowH + 'px';
    const rows = S.fam.helpers.pageRows(m, S.spec);
    const sel = new Set(m.selected);
    for (const r of rows) {
      S.P.row(r, m, sel);
    }
    if (!rows.length) {
      S.P.empty();
    }
    if (S.virtual) {
      S.P.el('div', '', S.body).style.height = Math.max(0, S.spec.rows.length - (m.virtualTop || 0) - rows.length) * S.rowH + 'px';
      S.body.scrollTop = Math.floor(scrollTop / S.rowH) === (m.virtualTop || 0) ? scrollTop : (m.virtualTop || 0) * S.rowH;
    }
    else { S.body.style.maxHeight = S.paneHeight + 'px'; S.body.style.overflowY = 'auto'; }
    S.grid.style.height = 40 + S.paneHeight + 2 + 'px';
    S.drawing = false;
    S.P.mirrorScreenRows();
  }

  function drawTools(S, m) {
    S.facts.textContent = S.fam.facts(m, S.spec).map(f => `${f.label}: ${f.value}`).join('  ·  ');
    const saved = S.P.el('span', '', S.facts, m.editing ? 'Editing record' : 'All changes saved');
    saved.style.cssText = 'margin-left:auto;display:flex;align-items:center;gap:4px;white-space:nowrap';
    S.P.icon(saved, m.editing ? 'clock' : 'check');
    if (S.input && S.input.value !== (m.query || '')) S.input.value = m.query || '';
    S.chips.replaceChildren();
    for (const [col, vals] of Object.entries(m.filters)) {
      const c = S.spec.cols.find((x) => x.id === col);
      const ch = S.P.el('span', 'to-fchip', S.chips);
      ch.title = `${c.label}: ${vals.join(', ')}`;
      S.P.el('span', '', ch, `${c.label}:`);
      S.P.el('b', '', ch, vals.length ? vals.join(', ') : '(none)');
      const x = S.P.el('i', '', ch); S.P.icon(x, 'close');
      x.addEventListener('click', () => S.P.act(S.fam.helpers.clearFilter(S.ctx.model, col)));
    }
    S.clearAll.hidden = !(Object.keys(m.filters).length || m.query);
    const n = m.selected.length;
    S.selBar.style.display = n ? 'flex' : 'none';
    const viewLabel = S.tools.querySelector(':scope > .to-selinfo');
    if (viewLabel) viewLabel.style.display = n && S.cardW < 900 ? 'none' : '';
    S.chips.style.maxWidth = n && S.cardW < 900 ? '145px' : '';
    if (S.input) S.input.parentElement.style.display = n && S.cardW < 900 ? 'none' : 'flex';
    S.selInfo.textContent = `${n} selected`;
    S.undoBtn.hidden = !m.history.length;
    const vis = S.fam.helpers.visibleRows(m, S.spec).length;
    S.count.textContent = `${vis}${vis !== S.spec.rows.length ? ` of ${S.spec.rows.filter((r) => !m.removed[r.id]).length}` : ''}`;
    const rows = S.fam.helpers.pageRows(m, S.spec).map((r) => r.id);
    const on = rows.filter((id) => m.selected.includes(id)).length;
    S.allBox.checked = rows.length > 0 && on === rows.length;
    S.allBox.indeterminate = on > 0 && on < rows.length;
  }

  function drawFoot(S, m) {
    const n = S.fam.helpers.visibleRows(m, S.spec).length;
    const pages = S.fam.helpers.pageCount(m, S.spec);
    const p = Math.min(m.page, pages - 1);
    S.info.textContent = S.virtual ? `Showing ${(m.virtualTop || 0) + 1}–${Math.min(n, (m.virtualTop || 0) + 6)} of ${n}` : S.P.fmtShow(p * S.P.sizeOf(m) + 1, Math.min(n, (p + 1) * S.P.sizeOf(m)), n);
    for (const [n, b] of Object.entries(S.sizes)) b.classList.toggle('cur', Number(n) === S.P.sizeOf(m));
    S.pagerWrap.replaceChildren();
    for (const k of Object.keys(S.pgButtons)) delete S.pgButtons[k];

    if (S.virtual) return;
    S.P.pageButton('Prev', 'prev', p === 0).addEventListener('click', () => S.P.act(S.fam.helpers.gotoPage(S.ctx.model, S.spec, S.ctx.model.page - 1)));
    S.fam.helpers.pagerItems(p, pages).forEach((it, i) => {
      if (it === '…') { S.P.el('span', 'to-pg dots', S.pagerWrap, '…'); return; }
      const b = S.P.pageButton(String(it + 1), `p${it}`, false, it === p ? 'cur' : '');
      b.addEventListener('click', () => S.P.act(S.fam.helpers.gotoPage(S.ctx.model, S.spec, it)));
      void i;
    });
    S.P.pageButton('Next', 'next', p >= pages - 1).addEventListener('click', () => S.P.act(S.fam.helpers.gotoPage(S.ctx.model, S.spec, S.ctx.model.page + 1)));
  }

  function draw(S, m) {
    S.P.drawHeader(m);
    S.P.drawRows(m);
    S.P.drawTools(m);
    S.P.drawFoot(m);
    S.P.drawPop(m);
    S.P.drawToastDialog(m);
  }

  function drawLite(S, m) {
    S.P.drawHeader(m);
    S.P.drawRows(m);
    S.P.drawTools(m);
    S.P.drawFoot(m);
  }

  env.template('use-data-grid/_draw', () => ({ drawHeader, decorate, drawRows, drawTools, drawFoot, draw, drawLite }));
})();
