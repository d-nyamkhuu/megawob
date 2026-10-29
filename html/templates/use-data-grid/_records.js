/* use-data-grid/_records: grid records parts; S holds the live episode state and resolved design parts. */
(function () {
  'use strict';

  function toolbar(S) {
    // ---- toolbar
    S.tools = S.P.el('div', 'to-tools', S.card);
    S.input = null;
    if (S.fam.helpers.searchable(S.spec)) {
      const sb = S.P.el('label', 'to-search', S.tools);
      sb.innerHTML = S.D.icons.search;
      S.input = S.P.el('input', '', sb);
      S.input.type = 'text';
      S.input.placeholder = `Search ${S.spec.entities}…`;
      S.input.value = S.ctx.model.query || '';
      S.input.addEventListener('input', () => S.P.act(S.fam.helpers.setQuery(S.ctx.model, S.input.value), false));
    } else {
      const lab = S.P.el('span', 'to-selinfo', S.tools, '');
      lab.style.color = 'var(--muted)';
      lab.style.fontWeight = '500';
      lab.textContent = 'View: Pinned records';
    }
    S.chips = S.P.el('div', '', S.tools);
    S.chips.style.cssText = 'display:flex;gap:6px;min-width:0;overflow:hidden';
    S.clearAll = S.P.el('span', 'to-link', S.tools, 'Clear filters');
    S.clearAll.addEventListener('click', () => S.P.act(S.fam.helpers.clearFilters(S.ctx.model)));
    S.P.el('div', 'sp', S.tools);
    S.selBar = S.P.el('div', '', S.tools);
    S.selBar.style.cssText = 'display:flex;align-items:center;gap:6px;flex:none';
    S.selInfo = S.P.el('span', 'to-selinfo', S.selBar, '');
    S.clearSelBtn = S.P.el('span', 'to-link', S.selBar, 'Clear');
    S.clearSelBtn.addEventListener('click', () => S.P.act(S.fam.helpers.clearSel(S.ctx.model)));
    S.markBtn = S.P.bulkButton('Mark as', '', 'status');
    S.archBtn = S.P.bulkButton('Archive', '', 'archive');
    S.delBtn = S.P.bulkButton('Delete', 'danger', 'delete');
    S.P.icon(S.markBtn, 'down', false); S.P.icon(S.archBtn, 'archive'); S.P.icon(S.delBtn, 'trash');
    S.markBtn.addEventListener('click', () => S.P.act(S.fam.helpers.openMark(S.ctx.model)));
    S.archBtn.addEventListener('click', () => S.P.act(S.fam.helpers.askBulk(S.ctx.model, S.spec, 'archive', null)));
    S.delBtn.addEventListener('click', () => S.P.act(S.fam.helpers.askBulk(S.ctx.model, S.spec, 'delete', null)));
    S.undoBtn = S.P.el('button', 'to-btn ghost', S.tools, 'Undo');
    S.P.icon(S.undoBtn, 'undo');
    S.undoBtn.type = 'button';
    S.undoBtn.addEventListener('click', () => S.P.act(S.fam.helpers.undo(S.ctx.model, S.spec)));
  }

  function grid(S) {
    // ---- grid
    S.grid = S.P.el('div', 'to-grid', S.card);
    if (S.admin) { S.card.classList.add('dense', 'showdots'); }
    S.hrow = S.P.el('div', 'to-hrow', S.grid);
    S.hcb = S.P.el('div', 'to-cb', S.hrow);
    S.allBox = S.P.el('input', '', S.hcb);
    S.allBox.type = 'checkbox';
    S.rowpick = S.spec.scenario === 'multirow' && !(S.spec.judge && S.spec.judge.mode === 'confirm');
    if (S.rowpick) { S.allBox.style.visibility = 'hidden'; S.card.classList.add('rowpick'); }
    S.allBox.setAttribute('aria-label', 'Select all rows on this page');
    S.allBox.addEventListener('click', () => S.P.act(S.fam.helpers.toggleAll(S.ctx.model, S.spec)));
    S.hcells = {};
    S.parts = {};
    for (const c of S.spec.cols) {
      S.P.column(c);
    }
    S.hfill = S.P.el('div', 'to-fill', S.hrow);
    S.body = S.P.el('div', 'to-body', S.grid);
    const episodeBody = S.body;
    S.drawing = false;
    S.paneHeight = Math.min(S.rowH * S.spec.pageSize, Math.max(100, S.cardH - S.FIXED));
    if (S.virtual) {
      S.body.style.cssText = `height:${S.paneHeight}px;overflow-y:auto;overflow-x:hidden;overscroll-behavior:contain`;
      const scrollWindow = () => {
        if (!episodeBody.isConnected || S.drawing) return;
        const top = Math.min(Math.max(0, S.spec.rows.length - 6), Math.floor(S.body.scrollTop / S.rowH));
        if (top === S.ctx.model.virtualTop) return;
        S.ctx.update({ ...S.ctx.model, virtualTop: top, windowSize: 6 });
        S.P.drawRows(S.ctx.model);
      };
      S.body.addEventListener('scroll', scrollWindow);
      S.body.addEventListener('wheel', e => {
        e.preventDefault(); S.body.scrollTop += e.deltaY; scrollWindow();
      }, { passive: false });
    }

    if (S.spec.scenario === 'paginate') {
      S.body.addEventListener('scroll', () => { if (episodeBody.isConnected) S.P.mirrorScreenRows(); });
      S.body.addEventListener('wheel', e => { e.preventDefault(); S.body.scrollTop += e.deltaY; S.P.mirrorScreenRows(); }, { passive: false });
    }
  }

  function footer(S) {
    // ---- footer
    S.foot = S.P.el('div', 'to-foot', S.card);
    S.info = S.P.el('span', 'info', S.foot, '');
    S.pagerWrap = S.P.el('div', 'to-pager', S.foot);
    if (S.rng.bool(0.5)) { S.foot.style.justifyContent = 'space-between'; } else { S.info.style.order = '2'; S.info.style.marginLeft = 'auto'; }
    S.rpp = S.P.el('span', 'info', S.foot, `Rows per page: ${S.spec.pageSize}`);
    S.sizes = {};
    if (S.spec.scenario === 'paginate') {
      S.rpp.textContent = 'Rows:';
      S.rpp.style.display = 'flex'; S.rpp.style.alignItems = 'center';
      for (const n of S.D.pageSizes) {
        const b = S.P.el('button', 'to-pg', S.rpp, String(n)); b.type = 'button'; S.sizes[n] = b;
        b.addEventListener('click', () => S.P.act(S.fam.helpers.setPageSize(S.ctx.model, S.spec, n)));
      }
    }
    S.facts = S.P.el('div', 'to-facts', S.card);
    S.rpp.style.order = '3';
    if (S.cardW < 760 && S.spec.scenario !== 'paginate') S.rpp.hidden = true;
  }

  function column(S, c) {
    const h = S.P.el('div', 'to-h', S.hrow);
    h.tabIndex = 0;
    h.setAttribute('role', 'columnheader');
    h.dataset.col = c.id;
    const lbl = S.P.el('span', 'lbl', h, c.label);
    const arrow = S.P.el('span', 'arrow', h, '');
    S.P.el('span', 'gap', h);
    let funnel = null;
    if (c.type === 'cat') {
      funnel = S.P.el('span', 'ib', h);
      funnel.innerHTML = S.D.icons.funnel;
      funnel.title = `Filter ${c.label}`;
      funnel.addEventListener('pointerdown', (e) => e.stopPropagation());
      funnel.addEventListener('click', () => S.P.act(S.fam.helpers.openMenu(S.ctx.model, S.spec, c.id, 'filter')));
    }
    const dots = S.P.el('span', 'ib dots', h);
    dots.innerHTML = S.D.icons.dots;
    dots.title = 'Column options';
    dots.addEventListener('pointerdown', (e) => e.stopPropagation());
    dots.addEventListener('click', () => S.P.act(S.fam.helpers.openMenu(S.ctx.model, S.spec, c.id, 'col')));
    const edge = S.P.el('div', 'to-edge', h);
    edge.tabIndex = 0;
    edge.setAttribute('role', 'separator');
    edge.setAttribute('aria-orientation', 'vertical');
    edge.setAttribute('aria-label', `Resize ${c.label}`);
    S.hcells[c.id] = h;
    S.parts[c.id] = { lbl, arrow, funnel, dots, edge };
    S.P.bindHeader(h, c.id);
    S.P.bindEdge(edge, c.id);
  }

  function row(S, r, m, sel) {
    const row = S.P.el('div', 'to-row', S.body);
    row.style.height = S.rowH + 'px';
    row.dataset.id = r.id;
    if (sel.has(r.id)) row.classList.add('sel');
    S.P.rowSelection(row, r, m, sel);
    for (const id of m.order) {
      S.P.cell(row, r, id, m);
    }
    S.P.el('div', 'to-fill', row);
    S.P.rowReady(row, r, m);
    return row;
  }

  function rowSelection(S, row, r, m, sel) {
    const cb = S.P.el('div', 'to-cb', row);
    if (S.rowpick) {
      row.addEventListener('click', (e) => S.P.act(S.fam.helpers.rowClick(S.ctx.model, S.spec, r.id, { ctrl: e.ctrlKey || e.metaKey, shift: e.shiftKey })));
    } else {
      const box = S.P.el('input', '', cb);
      box.type = 'checkbox';
      box.checked = sel.has(r.id);
      box.dataset.id = r.id;
      box.addEventListener('click', (e) => S.P.act(S.fam.helpers.toggleRow(S.ctx.model, S.spec, r.id, e.shiftKey)));
    }
    if (!S.rowpick && (S.spec.scenario === 'bulk' || S.spec.scenario === 'colfilter')) row.addEventListener('click', e => { if (!e.target.closest('input')) S.P.act(S.fam.helpers.rowClick(S.ctx.model, S.spec, r.id, { ctrl: e.ctrlKey || e.metaKey, shift: e.shiftKey })); });
  }

  function cell(S, row, r, id, m) {
    const c = S.spec.cols.find((x) => x.id === id);
    const cell = S.P.el('div', 'to-c', row);
    cell.style.width = S.P.px(m.widths[id]) + 'px';
    const text = S.fam.helpers.cellText(S.spec, r, id, m);
    cell.dataset.col = id;
    if (m.edits && m.edits[r.id] && m.edits[r.id][id] !== undefined) cell.classList.add('edited');
    if (S.inline) cell.addEventListener('dblclick', () => S.P.act(S.fam.helpers.startEdit(S.ctx.model, S.spec, r.id, id)));
    if (m.editing && m.editing.row === r.id && m.editing.col === id) { S.P.cellField(cell, m.editing); return cell; }
    if (c.type === 'num' || c.type === 'money') cell.classList.add('r');
    if (c.type === 'id') cell.classList.add('mono');
    S.P.cellContent(cell, r, id, m, text);
    S.P.decorate(cell, r, id, m);
    S.P.cellReady(cell, r, id, m);
    return cell;
  }

  function cellContent(S, cell, r, id, m, text) {
    if (id === S.spec.statusCol) {
      const pill = S.P.el('span', 'to-pill', cell, text);
      const tone = S.toneOf[text] || S.D.fallbackTone;
      pill.style.setProperty('--status-tone', tone);
      pill.style.color = tone;
      pill.style.background = `color-mix(in srgb, ${tone} 13%, transparent)`;
      if (m.status[r.id] !== undefined) pill.classList.add('changed');
    } else { const textEl = S.P.el('span', '', cell, text); textEl.title = text; }
  }

  function empty(S) {
    const empty = S.P.el('div', 'to-empty', S.body); S.P.icon(empty, 'search');
    S.P.el('strong', '', empty, S.D.emptyTitle);
    S.P.el('p', '', empty, S.D.emptyText);
    const reset = S.P.el('button', 'to-btn', empty, 'Clear filters'); reset.addEventListener('click', () => S.P.act(S.fam.helpers.clearFilters(S.ctx.model)));
  }

  function pageButton(S, label, key, disabled, cls = '') {
    const b = S.P.el('button', `to-pg ${cls}`, S.pagerWrap, label);
    b.type = 'button';
    if (key === 'prev' || key === 'next') S.P.icon(b, key === 'prev' ? 'left' : 'right', key === 'prev');
    b.disabled = !!disabled;
    S.pgButtons[key] = b;
    return b;
  }

  env.template('use-data-grid/_records', () => ({ toolbar, grid, footer, column, row, rowSelection, cell, cellContent, empty, pageButton }));
})();
