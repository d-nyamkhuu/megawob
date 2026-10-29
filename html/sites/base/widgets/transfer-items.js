/*
 * base / transfer-items / dual: a dual listbox card. Two bordered lists ("Available" / "Selected") with a
 * header and a live count, a column of arrow buttons between them (> >> < <<), and for the ordered scenario
 * Up / Down buttons beside the right list. Rows are custom elements (role option): click selects, Ctrl-click
 * toggles, Shift-click selects a range, double-click moves the row to the other list, and dragging a row
 * (or the selection it belongs to) drops it into the other list (appended) or, inside the right list, at the
 * slot under the pointer (a ghost follows the pointer; a line shows the insertion point).
 *   move      all rows visible; row height comes from the stage height
 *   filter    a filter box above each list; lists show spec.rows rows and a "+N more" line
 *   ordered   numbered rows on the right, Up / Down buttons
 *   multi     like move, but the page accepts one transfer only: once something has moved (arrow, double-click
 *             or drag), the arrows are disabled and the status line says so. A plain click replaces the
 *             selection, so a set has to be built with Shift / Ctrl clicks first
 *   range / rangemix  like multi with longer lists: a run clicked at its first item and Shift-clicked at its last (rangemix:
 *             then Ctrl-clicked in and out), on the left list (move right) or on the right list, where every item
 *             starts (move back left)
 * All semantics live in env.familyDef.helpers.apply(); this file only maps DOM events onto it and redraws from the
 * model. The card's box never changes during an episode (the anchor).
 */
(function () {
  'use strict';

  const CSS = `
  .tl-wrap { position: absolute; inset: 0; }
  .tl-card { position: absolute; display: flex; flex-direction: column; background: var(--panel);
    border: 1px solid var(--line); border-radius: var(--tl-r); padding: 16px 20px 14px;
    box-shadow: 0 1px 3px rgba(0,0,0,.07), 0 10px 26px rgba(0,0,0,.06); user-select: none; }
  .tl-title { font-size: 18px; font-weight: 650; }
  .tl-note { margin-top: 2px; font-size: 13px; color: var(--muted); }
  .tl-body { display: grid; grid-template-columns: minmax(0, 1fr) 56px minmax(0, 1fr); gap: 0 10px; margin-top: 12px; }
  .tl-body.ordered { grid-template-columns: minmax(0, 1fr) 56px minmax(0, 1fr) 60px; }
  .tl-side { display: flex; flex-direction: column; min-width: 0; }
  .tl-head { display: flex; align-items: baseline; gap: 6px; margin-bottom: 6px; font-size: 13.5px; font-weight: 600; white-space: nowrap; }
  .tl-head .n { color: var(--muted); font-weight: 500; font-size: 12.5px; }
  .tl-filter { height: 30px; margin-bottom: 6px; padding: 0 9px; border: 1px solid color-mix(in srgb, var(--fg) 22%, var(--line));
    border-radius: 5px; background: var(--panel); color: var(--fg); font: inherit; font-size: 13px; min-width: 0; }
  .tl-filter:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 0 2px color-mix(in srgb, var(--accent) 25%, transparent); }
  .tl-list { position: relative; border: 1px solid color-mix(in srgb, var(--fg) 20%, var(--line)); border-radius: 5px;
    background: color-mix(in srgb, var(--fg) 2%, var(--panel)); overflow: hidden; }
  .tl-list.drop { border-color: var(--accent); box-shadow: 0 0 0 2px color-mix(in srgb, var(--accent) 22%, transparent); }
  .tl-row { display: flex; align-items: center; gap: 7px; height: var(--tl-row); padding: 0 9px; font-size: var(--tl-fs);
    white-space: nowrap; cursor: default; border-bottom: 1px solid color-mix(in srgb, var(--fg) 5%, transparent); }
  .tl-row > span { overflow: hidden; text-overflow: ellipsis; min-width: 0; }
  .tl-row:hover { background: color-mix(in srgb, var(--accent) 8%, transparent); }
  .tl-row.sel { background: var(--accent); color: #fff; }
  .tl-row .k { flex: none; width: 16px; text-align: right; color: var(--muted); font-size: 11.5px; font-variant-numeric: tabular-nums; }
  .tl-row.sel .k { color: rgba(255,255,255,.8); }
  .tl-row.ghosted { opacity: .45; }
  .tl-more { height: var(--tl-row); display: flex; align-items: center; padding: 0 9px; font-size: 12px; color: var(--muted); font-style: italic; }
  .tl-ins { position: absolute; left: 4px; right: 4px; height: 2px; background: var(--accent); pointer-events: none; display: none; }
  .tl-btns { display: flex; flex-direction: column; justify-content: center; gap: 8px; }
  .tl-btn { height: 30px; border: 1px solid color-mix(in srgb, var(--fg) 22%, var(--line)); border-radius: 5px; background: var(--panel);
    color: var(--fg); font: inherit; font-size: 14px; font-weight: 600; cursor: pointer; letter-spacing: -1px; }
  .tl-btn:hover { border-color: var(--accent); color: var(--accent); }
  .tl-btn:disabled { opacity: .4; cursor: default; color: var(--muted); border-color: var(--line); }
  .tl-btn svg { width: 14px; height: 14px; vertical-align: -2px; }
  .tl-ud { display: flex; flex-direction: column; justify-content: center; gap: 8px; padding-top: 26px; }
  .tl-ud .tl-btn { font-size: 12px; letter-spacing: 0; padding: 0 6px; }
  .tl-status { margin-top: 10px; height: 18px; font-size: 12.5px; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .tl-ghost { position: fixed; z-index: 50; pointer-events: none; padding: 4px 10px; border-radius: 5px; background: var(--accent);
    color: #fff; font-size: 12.5px; box-shadow: 0 6px 18px rgba(0,0,0,.2); white-space: nowrap; }
  `;

  const ARROW = {
    R: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3.5l4.5 4.5L6 12.5"/></svg>',
    RR: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3.5l4.5 4.5L3 12.5M8.5 3.5L13 8l-4.5 4.5"/></svg>',
    L: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 3.5L5.5 8l4.5 4.5"/></svg>',
    LL: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 3.5L8.5 8l4.5 4.5M7.5 3.5L3 8l4.5 4.5"/></svg>',
  };
  const TITLES = { R: 'Move selected right', RR: 'Move all right', L: 'Move selected left', LL: 'Move all left' };

  let st = null;

  function ensureStyle(id, css) {
    if (document.getElementById(id)) return;
    const s = document.createElement('style');
    s.id = id;
    s.textContent = css;
    document.head.append(s);
  }
  const req = (el, what) => {
    if (!el || !el.isConnected) throw new Error(`transfer-items: ${what} is not rendered`);
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) throw new Error(`transfer-items: ${what} is hidden`);
    return r;
  };
  const mid = (r) => [r.left + r.width / 2, r.top + r.height / 2];

  env.widget({
    task: 'transfer-items',
    site: 'base',
    name: 'dual',
    split: 'train',
    scenarios: ['move', 'filter', 'ordered', 'multi', 'range', 'rangemix'],

    render(ctx) {
      ensureStyle('tl-style', CSS);
      const { util, rng, spec, size } = ctx;
      const fam = env.taskDef;
      const v = spec.scenario;
      const ordered = v === 'ordered';
      const filter = v === 'filter';
      const s = (st = { ctx, rows: { L: new Map(), R: new Map() }, lists: {}, btns: {}, filters: {} });
      const act = (a) => {
        const m = fam.helpers.apply(ctx.model, spec, a);
        ctx.update(m);
        paint();
      };

      const wrap = util.el('div', 'tl-wrap', ctx.stage);
      const card = util.el('div', 'tl-card', wrap);
      card.dataset.role = 'form';
      card.style.setProperty('--tl-r', rng.int(6, 12) + 'px');
      util.el('div', 'tl-title', card, spec.title);
      const note = util.el('div', 'tl-note', card, spec.note);
      const body = util.el('div', 'tl-body' + (ordered ? ' ordered' : ''), card);

      // Row pitch from the room the stage leaves (every list can hold all its rows without scrolling).
      const cap = filter ? spec.rows + 1 : spec.items.length;
      const chrome = 16 + 26 + 20 + 12 + 26 + (filter ? 36 : 0) + 30 + 30;
      let pitch = Math.floor((size.height - 24 - chrome) / cap);
      pitch = Math.max(20, Math.min(rng.int(28, 32), pitch));
      if (pitch < 24) note.remove();
      card.style.setProperty('--tl-row', pitch + 'px');
      card.style.setProperty('--tl-fs', (pitch < 24 ? 12 : 13.5) + 'px');

      function side(key, label) {
        const col = util.el('div', 'tl-side', body);
        const head = util.el('div', 'tl-head', col);
        util.el('span', '', head, label);
        s[`count${key}`] = util.el('span', 'n', head, '');
        if (filter) {
          const f = util.el('input', 'tl-filter', col);
          f.type = 'text';
          f.placeholder = rng.pick(['Filter', 'Search…', 'Type to filter']);
          f.setAttribute('aria-label', `Filter ${label}`);
          f.addEventListener('input', () => act({ query: [key, f.value] }));
          s.filters[key] = f;
        }
        const list = util.el('div', 'tl-list', col);
        list.setAttribute('role', 'listbox');
        list.setAttribute('aria-multiselectable', 'true');
        list.setAttribute('aria-label', label);
        list.style.height = cap * pitch + 2 + 'px';
        s.lists[key] = list;
        s[`ins${key}`] = util.el('div', 'tl-ins', list);
        return col;
      }

      side('L', spec.leftLabel);
      const btns = util.el('div', 'tl-btns', body);
      for (const b of ['R', 'RR', 'L', 'LL']) {
        const el = util.el('button', 'tl-btn', btns);
        el.type = 'button';
        el.innerHTML = ARROW[b];
        el.title = TITLES[b];
        el.setAttribute('aria-label', TITLES[b]);
        el.addEventListener('click', () => act({ btn: b }));
        s.btns[b] = el;
      }
      side('R', spec.rightLabel);
      if (ordered) {
        const ud = util.el('div', 'tl-ud', body);
        for (const [b, t] of [['up', 'Up'], ['down', 'Down']]) {
          const el = util.el('button', 'tl-btn', ud, t);
          el.type = 'button';
          el.setAttribute('aria-label', `Move selected ${b}`);
          el.addEventListener('click', () => act({ btn: b }));
          s.btns[b] = el;
        }
      }
      s.status = util.el('div', 'tl-status', card, '');

      // Drag: a row (or the selection it is part of) into the other list, or to a slot in the right list.
      const sideAt = (x, y) => {
        for (const k of ['L', 'R']) {
          const r = s.lists[k].getBoundingClientRect();
          if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return k;
        }
        return null;
      };
      // Insertion index in the right list for a pointer y: before the first row whose middle is below y.
      const slotAt = (y) => {
        const rows = fam.helpers.shown(spec, ctx.model, 'R').rows;
        for (const x of rows) {
          const r = s.rows.R.get(x).getBoundingClientRect();
          if (y < r.top + r.height / 2) return { index: ctx.model.right.indexOf(x), top: r.top };
        }
        const last = rows.length ? s.rows.R.get(rows[rows.length - 1]).getBoundingClientRect().bottom : s.lists.R.getBoundingClientRect().top;
        return { index: ctx.model.right.length, top: last };
      };
      let ghost = null;
      let suppressClick = false;
      function bindRow(el, key, x) {
        let dragging = false;
        env.ui.track(el, {
          start() { dragging = false; },
          move(p) {
            if (!dragging && Math.hypot(p.dx, p.dy) < 5) return;
            if (!dragging) {
              dragging = true;
              const sel = ctx.model[key === 'L' ? 'selL' : 'selR'];
              const n = sel.includes(x) ? sel.length : 1;
              ghost = util.el('div', 'tl-ghost', document.body, n > 1 ? `${n} items` : x);
              el.classList.add('ghosted');
            }
            ghost.style.left = p.x + 12 + 'px';
            ghost.style.top = p.y + 8 + 'px';
            const over = sideAt(p.x, p.y);
            for (const k of ['L', 'R']) s.lists[k].classList.toggle('drop', over === k && (k !== key || k === 'R'));
            const ins = s.insR;
            if (over === 'R') {
              const lr = s.lists.R.getBoundingClientRect();
              ins.style.display = 'block';
              ins.style.top = slotAt(p.y).top - lr.top - 1 + 'px';
            } else ins.style.display = 'none';
          },
          end(p) {
            if (!dragging) return;
            dragging = false;
            suppressClick = true;
            if (ghost) ghost.remove();
            ghost = null;
            el.classList.remove('ghosted');
            s.insR.style.display = 'none';
            for (const k of ['L', 'R']) s.lists[k].classList.remove('drop');
            const over = sideAt(p.x, p.y);
            if (!over) return;
            if (over === key && key === 'L') return;
            act({ drop: [key, x, over, over === 'R' ? slotAt(p.y).index : undefined] });
          },
        }, 'transfer-row');
        el.addEventListener('click', (e) => {
          if (suppressClick) { suppressClick = false; return; }
          const mod = e.shiftKey ? 'shift' : (e.ctrlKey || e.metaKey) ? 'ctrl' : '';
          act({ sel: [key, x, mod] });
        });
        el.addEventListener('dblclick', () => act({ dbl: [key, x] }));
      }

      let key = '';
      function paint() {
        const m = ctx.model;
        const k = JSON.stringify(m);
        if (k === key) return;
        key = k;
        for (const side of ['L', 'R']) {
          const list = s.lists[side];
          const { rows, more } = fam.helpers.shown(spec, m, side);
          const sel = m[side === 'L' ? 'selL' : 'selR'];
          for (const el of [...list.querySelectorAll('.tl-row, .tl-more')]) el.remove();
          s.rows[side] = new Map();
          rows.forEach((x, i) => {
            const el = util.el('div', 'tl-row' + (sel.includes(x) ? ' sel' : ''), list);
            el.setAttribute('role', 'option');
            el.setAttribute('aria-selected', sel.includes(x) ? 'true' : 'false');
            el.title = x;
            if (ordered && side === 'R') util.el('span', 'k', el, String(i + 1));
            util.el('span', '', el, x);
            bindRow(el, side, x);
            s.rows[side].set(x, el);
          });
          if (more) util.el('div', 'tl-more', list, `+${more} more, refine the filter`);
          const total = side === 'L' ? fam.helpers.leftOf(spec, m).length : m.right.length;
          s[`count${side}`].textContent = `(${total})`;
          if (s.filters[side] && s.filters[side].value !== (side === 'L' ? m.qL : m.qR)) s.filters[side].value = side === 'L' ? m.qL : m.qR;
        }
        const locked = m.moves >= 1;
        s.btns.R.disabled = locked || !m.selL.length;
        s.btns.L.disabled = locked || !m.selR.length;
        s.btns.RR.disabled = locked || !fam.helpers.matches(spec, m, 'L').length;
        s.btns.LL.disabled = locked || !fam.helpers.matches(spec, m, 'R').length;
        if (ordered) {
          s.btns.up.disabled = !m.selR.length;
          s.btns.down.disabled = !m.selR.length;
        }
        const n = m.selL.length + m.selR.length;
        s.status.textContent = locked ? 'Transfer done. This list accepts one transfer.'
          : n ? `${n} selected` : m.moves !== undefined ? 'One transfer allowed: select everything first (Shift / Ctrl-click).' : 'Select items, then use the arrows, or drag them across.';
      }
      s.paint = paint;
      paint();

      const W = Math.min(size.width - 32, rng.int(ordered ? 640 : 600, ordered ? 760 : 720));
      card.style.width = W + 'px';
      card.style.height = card.offsetHeight + 'px';
      const fx = rng.pick([0, 0.5, 0.5, 1, rng.float()]);
      const fy = rng.pick([0.5, 0.5, 0, 1, rng.float()]);
      card.style.left = Math.round(16 + fx * Math.max(0, size.width - card.offsetWidth - 32)) + 'px';
      card.style.top = Math.round(12 + fy * Math.max(0, size.height - card.offsetHeight - 24)) + 'px';
      return { anchors: [card], sync: paint };
    },

    locate(t) {
      const s = st;
      const m = s.ctx.model;
      if (t.item !== undefined) {
        const el = s.rows.L.get(t.item) || s.rows.R.get(t.item);
        return mid(req(el, `row ${t.item}`));
      }
      if (t.btn !== undefined) return mid(req(s.btns[t.btn], `button ${t.btn}`));
      if (t.filter !== undefined) return mid(req(s.filters[t.filter], `filter ${t.filter}`));
      if (t.list !== undefined) {
        const lr = req(s.lists[t.list], `list ${t.list}`);
        const rows = env.taskDef.helpers.shown(s.ctx.spec, m, t.list).rows;
        const bottom = rows.length ? s.rows[t.list].get(rows[rows.length - 1]).getBoundingClientRect().bottom : lr.top;
        return [lr.left + lr.width / 2, Math.min(lr.bottom - 4, bottom + Math.max(6, (lr.bottom - bottom) / 2))];
      }
      if (t.slot !== undefined) {
        const x = m.right[t.slot];
        const r = req(s.rows.R.get(x), `slot ${t.slot}`);
        return [r.left + r.width / 2, r.top + r.height * 0.25];
      }
      throw new Error(`transfer-items/dual cannot locate ${JSON.stringify(t)}`);
    },
  });
})();
