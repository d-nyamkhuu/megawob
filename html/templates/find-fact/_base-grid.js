/* find-fact/_base-grid: reference builders. S is the live reference unit scope;
 * the wrappers in reference.js retain every design override and its original call order.
 * B holds one render's local state, shared by its setup, painting and interaction functions. */
(function () {
  'use strict';

  function buildDatagrid(S, ctx, work, up, room) {
    const B = { S, ctx, work, up, room };
    B.paint = (...args) => paintGrid(B, ...args);
    B.mirror = (...args) => mirrorGrid(B, ...args);
    setupGridTable(B);
    setupGridControls(B);
    if (B.pageBtns.length && B.foot.scrollWidth > B.foot.clientWidth + 1) for (const b of B.pageBtns) { b.style.minWidth = '24px'; b.style.padding = '0 5px'; }
    if (B.foot.scrollWidth > B.foot.clientWidth + 1) B.ainp.style.width = '140px';
    B.paint();
    if (B.asCards) {
      // Every page is as tall as the tallest tile makes it (rows of equal height, measured over all rows),
      // so the card never grows on another page; tighter tiles until the card ends inside the work area.
      const fit = () => {
        B.tb.style.gridAutoRows = '';
        B.tb.replaceChildren();
        B.spec.rows.forEach((r) => B.S.tileOf(B.util, B.tb, B.spec.cols.map((c) => c.name), r, (i) => B.spec.cols[i].num));
        const h = Math.max(...Array.from(B.tb.children, (c) => c.getBoundingClientRect().height));
        B.tb.style.gridAutoRows = Math.ceil(h) + 'px';
        B.paint();
      };
      fit();
      for (const lvl of ['compact', 'tight']) {
        if (B.gc.getBoundingClientRect().bottom <= B.work.getBoundingClientRect().bottom - 4) break;
        B.t.classList.add(lvl);
        fit();
      }
    }
    if (B.hs) {
      if (B.ctx.model.hcol > 1) B.lbx.set({ scroll: B.ctx.model.hcol - 1 });
      B.lbx.refresh();
      if (B.vs) {
        if (B.ctx.model.vrow > 0) B.lbxV.set({ scroll: B.ctx.model.vrow });
        B.lbxV.refresh();
      }
      B.mirror();
    }
    return {
      sync(m) {
        B.field.set(m.answers[0]);
        if (B.filterField) B.filterField.set(m.filter);
        B.paint();
      },
      locate(tg) {
        if (tg.field !== undefined) return B.field.locate();
        if (tg.filter) return B.filterField && B.filterField.locate();
        if (tg.sortBy !== undefined) return B.sorter.locate(`s${tg.sortBy}`);
        if (tg.gpage !== undefined) return B.pager && B.pager.locate(`g${tg.gpage}`);
        if (tg.grid) {
          const r = B.pane.getBoundingClientRect();
          return [r.left + r.width * 0.6, r.top + Math.min(r.height / 2, 80)];
        }
        if (tg.hthumb) return B.lbx && B.lbx.locateThumb();
        if (tg.hscrollTo !== undefined) return B.lbx && B.lbx.locateThumbFor(tg.hscrollTo - 1);
        if (tg.vthumb) return B.lbxV && B.lbxV.locateThumb();
        // Two rows above the asked one go to the top edge (the first one under the sticky header).
        if (tg.vscrollTo !== undefined) return B.lbxV && B.lbxV.locateThumbFor(Math.max(0, tg.vscrollTo - 2));
        return null;
      },
    };
  }

  function paintGrid(B) {
    const m = B.ctx.model;
    const g = B.fam.helpers.gridRows(m, B.spec);
    const shownRows = B.hs ? B.spec.rows.map((_, i) => i) : g.rows;
    if (!B.vs) B.tb.replaceChildren();
    for (const r of B.vs ? [] : shownRows) {
      if (B.asCards) {
        B.S.tileOf(B.util, B.tb, B.spec.cols.map((c) => c.name), B.spec.rows[r], (i) => B.spec.cols[i].num);
        continue;
      }
      const tr = B.util.el('tr', '', B.tb);
      B.spec.rows[r].forEach((v, i) => B.util.el('td', (i === 0 ? 'key' : '') + (B.spec.cols[i].num ? ' num' : ''), tr, v));
    }
    for (let k = shownRows.length; !B.vs && !B.asCards && k < B.nRows; k++) {
      const tr = B.util.el('tr', '', B.tb);
      B.spec.cols.forEach(() => B.util.el('td', '', tr, ' '));
    }
    B.heads.forEach((th, i) => {
      const on = m.sort && m.sort.col === i;
      th.classList.toggle('sorted', !!on);
      th.lastChild.textContent = on ? (m.sort.dir === 'asc' ? '▲' : '▼') : '↕';
    });
    if (!B.hs) {
      B.pageBtns.forEach((b, p) => {
        b.classList.toggle('on', p === g.page);
        b.classList.toggle('gone', p >= g.pages);
      });
      B.count.textContent = g.order.length ? `${g.page * B.spec.perPage + 1}–${Math.min(g.order.length, (g.page + 1) * B.spec.perPage)} of ${g.order.length}` : 'No rows match';
    } else B.count.textContent = `${B.spec.rows.length} rows · ${B.spec.cols.length} columns`;
  }

  function mirrorGrid(B) {
    if (!B.hs) return;
    const pr = B.pane.getBoundingClientRect();
    const left = pr.left + B.widths[0] - 1;
    let a = null;
    let b = null;
    B.heads.forEach((th, i) => {
      if (i === 0) return;
      const r = th.getBoundingClientRect();
      if (r.left >= left && r.right <= pr.right + 1) {
        if (a === null) a = i;
        b = i;
      }
    });
    const v = a === null ? null : [a, b];
    const m = B.ctx.model;
    if (JSON.stringify(v) !== JSON.stringify(m.view)) B.up({ view: v });
    if (B.vs) {
      // Rows fully in view below the sticky header.
      const top = B.t.tHead.getBoundingClientRect().bottom - 0.5;
      const bottom = pr.top + B.pane.clientTop + B.pane.clientHeight + 0.5;
      let r0 = null;
      let r1 = null;
      B.rowEls.forEach((tr, i) => {
        const r = tr.getBoundingClientRect();
        if (r.top >= top && r.bottom <= bottom) {
          if (r0 === null) r0 = i;
          r1 = i;
        }
      });
      const rv = r0 === null ? null : [r0, r1];
      if (JSON.stringify(rv) !== JSON.stringify(B.ctx.model.rview)) B.up({ rview: rv });
    }
  }

  function setupGridTable(B) {
    ({ spec: B.spec, util: B.util, rng: B.rng } = B.ctx);
    B.fam = B.S.env.taskDef;
    B.hs = B.spec.mode === 'hscroll';
    B.vs = B.hs && !!B.spec.vscroll;
    B.asCards = B.S.LOOK === 'cards' && !B.hs;
    B.work.style.alignContent = 'flex-start';
    ({ card: B.gc, body: B.body } = B.S.card(B.util, B.work, B.spec.title, `${B.spec.rows.length} ${B.spec.dataset === 'staff' ? 'people' : B.spec.dataset}`));
    B.gc.classList.add('rl-grid');
    B.gc.style.width = B.room.w + 'px';
    B.body.style.padding = '0';
    B.filterField = null;
    B.tools = null;
    if (B.spec.filterable || B.asCards) {
      B.tools = B.util.el('div', 'rl-tools', B.body);
    }
    if (B.spec.filterable) {
      const sbox = B.util.el('div', 'rl-search', B.tools);
      sbox.innerHTML = B.S.SEARCH_ICON;
      const inp = B.S.input(B.util, sbox, 'filter', B.rng.pick([`Filter by ${B.spec.cols[0].name.toLowerCase()}…`, 'Filter rows', 'Search this table']));
      B.filterField = B.S.env.ui.textField(inp, { value: B.ctx.model.filter, label: 'filter', onInput: (v) => { B.up({ filter: v, page: 0 }); B.paint(); } });
      if (!B.asCards) B.util.el('span', 'rl-count', B.tools, B.rng.pick(['Click a column header to sort.', 'Sortable columns', '']));
    }
    B.fixedH = 44 + (B.spec.filterable || B.asCards ? 50 : 0) + 34 + 52 + (B.hs ? 18 : 0);
    B.nRows = B.hs ? B.spec.rows.length : B.spec.perPage;
    B.rh = Math.max(26, Math.min(38, Math.floor((B.room.h - B.fixedH) / B.nRows)));
    if (B.vs) {
      // Rows in view (header included in the pane): at most VSCROLL_VIEW - 1, so the asked row starts hidden.
      B.rh = B.S.LOOK === 'dense' ? 24 : 28;
      B.nRows = Math.max(4, Math.min(B.S.env.taskDef.helpers.VSCROLL_VIEW - 1, Math.floor((B.room.h - B.fixedH) / B.rh) - 1));
    }
    B.fs = B.vs && B.S.LOOK === 'dense' ? 12 : B.rh < 31 ? 12.5 : 14;
    B.gwrap = B.vs ? B.util.el('div', 'rl-gwrap', B.body) : B.body;
    B.pane = B.util.el('div', 'rl-gpane' + (B.vs ? ' vs' : ''), B.gwrap);
    B.pane.dataset.role = 'grid';
    B.pane.style.setProperty('--rl-rh', B.rh + 'px');
    B.striped = B.rng.bool(0.6);
    B.t = B.asCards ? B.util.el('div', 'rl-tiles', B.pane) : B.S.table(B.util, B.pane, 'rl-table' + (B.striped ? ' striped' : '') + (B.hs ? ' frozen' : ''));
    B.t.style.fontSize = B.fs + 'px';
    B.widths = B.S.colWidths(B.spec, B.fs);
    B.total = B.widths.reduce((a, b) => a + b, 0);
    if (!B.hs) {
      // Scale the columns to the card width.
      B.widths = B.widths.map((w) => (w * (B.room.w - 2)) / B.total);
      B.t.style.width = B.room.w - 2 + 'px';
    } else {
      B.widths = B.widths.map((w) => Math.max(w, 130));
      B.t.style.width = B.widths.reduce((a, b) => a + b, 0) + 'px';
      // The pane shows the frozen column and a few others: the asked column starts out of view.
      B.pane.style.width = Math.min(B.room.w - 2 - (B.vs ? 16 : 0), B.widths[0] + B.widths[1] + B.widths[2] + B.widths[3] + B.rng.int(0, 40)) + 'px';
      if (B.vs) B.pane.style.height = (B.nRows + 1) * B.rh + 'px';
    }
    B.tr0 = null;
    if (B.asCards) {
      B.util.el('span', 'rl-count', B.tools, 'Sort by');
    } else {
      const cg = B.util.el('colgroup', '', B.t);
      B.widths.forEach((w) => { B.util.el('col', '', cg).style.width = Math.floor(w) + 'px'; });
      B.tr0 = B.util.el('tr', '', B.util.el('thead', '', B.t));
    }
    B.heads = B.spec.cols.map((c, i) => {
      // cards: a sort chip per column in the tool row, in place of a header cell
      const th = B.asCards ? B.util.el('button', 'rl-chip rl-th', B.tools) : B.util.el('th', 'rl-th' + (c.num ? ' num' : ''), B.tr0);
      if (B.asCards) th.type = 'button';
      th.dataset.key = `s${i}`;
      th.dataset.role = 'header';
      B.util.el(B.S.LOOK === 'portal' ? 'u' : 'span', '', th, c.name);
      B.util.el('span', 'ar', th, '↕');
      return th;
    });
    B.sorter = B.S.env.ui.buttons(B.heads, {
      label: 'sort',
      mark: () => {},
      onClick(key) {
        const col = Number(key.slice(1));
        B.up({ sort: B.fam.helpers.nextSort(B.ctx.model.sort, col), page: 0 });
        B.paint();
      },
    });
  }

  function setupGridControls(B) {
    B.tb = B.asCards ? B.t : B.util.el('tbody', '', B.t);
    B.lbx = null;
    B.lbxV = null;
    B.hthumb = null;
    B.rowEls = [];
    if (B.vs) {
      // Rows are built once (hscroll rows never change) so the vertical listbox keeps its option elements.
      B.rowEls = B.spec.rows.map((row) => {
        const tr = B.util.el('tr', '', B.tb);
        row.forEach((v, i) => B.util.el('td', (i === 0 ? 'key' : '') + (B.spec.cols[i].num ? ' num' : ''), tr, v));
        return tr;
      });
      const vtrack = B.util.el('div', 'rl-vbar', B.gwrap);
      vtrack.dataset.role = 'scrollbar';
      vtrack.style.height = B.pane.style.height;
      vtrack.style.marginTop = '0';
      const vthumb = B.util.el('div', 'rl-vthumb', vtrack);
      vthumb.dataset.role = 'thumb';
      B.lbxV = B.S.env.ui.listbox(B.pane, {
        label: 'rows',
        options: B.rowEls.map((tr, i) => [i, tr]),
        onScroll: () => B.mirror(),
        // The sticky header row covers the top of the track's range: keep the thumb below it.
        scrollbar: { track: vtrack, thumb: vthumb, pad: 2, minThumb: 24, onDrag: (on) => vthumb.classList.toggle('dragging', on) },
      });
    }
    if (B.hs) {
      const sbRow = B.S.LOOK === 'portal' ? B.util.el('div', 'rl-sbrow', B.body) : B.body;
      const arrow = (label, dx) => {
        // Portal (Windows 98) scrollbars: arrow buttons step one column at a time.
        const b = B.util.el('button', 'rl-sbarrow', sbRow, label);
        b.type = 'button';
        b.tabIndex = -1;
        b.dataset.role = 'scroll-arrow';
        b.addEventListener('click', () => { B.pane.scrollLeft += dx * 130; B.S.env.log('scroll', { what: 'columns', arrow: dx }); });
      };
      if (B.S.LOOK === 'portal') arrow('◀', -1);
      const track = B.util.el('div', 'rl-hbar', sbRow);
      if (B.S.LOOK === 'portal') arrow('▶', 1);
      track.dataset.role = 'scrollbar';
      track.style.width = (parseFloat(B.pane.style.width) - (B.S.LOOK === 'portal' ? 52 : 20)) + 'px';
      B.hthumb = B.util.el('div', 'rl-hthumb', track);
      B.hthumb.dataset.role = 'thumb';
      B.lbx = B.S.env.ui.listbox(B.pane, {
        axis: 'x',
        label: 'columns',
        options: B.heads.slice(1).map((th, i) => [i + 1, th]),
        onScroll: () => B.mirror(),
        scrollbar: { track, thumb: B.hthumb, pad: 2, minThumb: 30, onDrag: (on) => B.hthumb.classList.toggle('dragging', on) },
      });
    }
    B.foot = B.util.el('div', 'rl-gfoot', B.body);
    B.pageBtns = [];
    if (!B.hs) {
      const nav = B.util.el('div', 'rl-pager', B.foot);
      if (B.S.LOOK === 'portal') B.util.el('span', '', nav, 'Page:');
      const pages = Math.ceil(B.spec.rows.length / B.spec.perPage);
      for (let p = 0; p < pages; p++) {
        const b = B.S.pagerEl(B.util, nav, B.S.LOOK === 'portal' ? `[${p + 1}]` : String(p + 1));
        b.dataset.key = `g${p}`;
        b.dataset.role = 'pager';
        B.pageBtns.push(b);
      }
    }
    B.count = B.util.el('span', 'rl-count', B.foot);
    B.ans = B.util.el('div', 'rl-ans', B.foot);
    B.al = B.util.el('label', '', B.ans, B.rng.pick(['Answer', 'Your answer', 'Value']));
    B.ainp = B.S.input(B.util, B.ans, 'field', B.rng.pick(['Type the value', '', 'Answer']));
    B.ainp.id = 'rl-gans';
    B.al.htmlFor = B.ainp.id;
    B.field = B.S.env.ui.textField(B.ainp, { value: B.ctx.model.answers[0], label: 'answer0', onInput: (v) => B.up({ answers: [v] }) });
    B.pager = B.pageBtns.length ? B.S.env.ui.buttons(B.pageBtns, {
      label: 'page',
      mark: () => {},
      disabled: (k) => Number(k.slice(1)) >= B.fam.helpers.gridRows(B.ctx.model, B.spec).pages,
      onClick(key) {
        B.up({ page: Number(key.slice(1)) });
        B.paint();
      },
    }) : null;
  }

  env.template('find-fact/_base-grid', () => ({ buildDatagrid }));
})();
