/*
 * transfer-items/dual: the reference dual listbox, shared by all six scenarios.
 * Scenarios: move (all rows), filter (two filters and capped lists), ordered (numbered right rows and
 * Up/Down), multi, range, rangemix (one transfer, with modifier selection). No scenario presets: the
 * filter/ordered branches follow spec.scenario; the task owns selection and transfer semantics.
 * With design: {} this reproduces these scaffolded pilots, including their DOM and rng draws:
 *   move: design-transfer-items-move-01; filter: design-transfer-items-filter-01;
 *   ordered: design-transfer-items-ordered-01; multi: design-transfer-items-multi-01;
 *   range: design-transfer-items-range-02; rangemix: design-transfer-items-rangemix-01.
 *
 * Tokens (object/array tokens replace the whole table, not individual entries):
 *   colors = { panel: 'var(--panel)', line: 'var(--line)', fg: 'var(--fg)', muted: 'var(--muted)',
 *     accent: 'var(--accent)', selected: '#fff', selectedIndex: 'rgba(255,255,255,.8)' }: widget colors.
 *   fontSizes = { title: 18, note: 13, head: 13.5, count: 12.5, filter: 13, index: 11.5, more: 12,
 *     button: 14, order: 12, status: 12.5, ghost: 12.5, row: 13.5, compact: 12 }: font sizes in px.
 *   fontFamily = null: inherit the site's font; a string sets the wrap's font family.
 *   cardPadding = '16px 20px 14px': card padding.
 *   cardShadow = '0 1px 3px rgba(0,0,0,.07), 0 10px 26px rgba(0,0,0,.06)': card shadow.
 *   controlRadius = 5, buttonHeight = 30: control corners and filter/button height in px.
 *   buttonColumnWidth = 56, orderColumnWidth = 60, columnGap = 10: body columns/gaps in px.
 *   radiusRange = [6, 12]: rng.int card radius bounds, in px.
 *   pitchRange = [28, 32], minPitch = 20: sampled maximum and minimum row pitch, in px.
 *   compactPitch = 24: below this pitch remove the note and use fontSizes.compact.
 *   chromeHeight = 160, filterChrome = 36: height reserved outside rows (extra for filters), in px.
 *   horizontalInset = 16, verticalInset = 12: placement margins on each side of the stage, in px.
 *   widthRange = [600, 720], orderedWidthRange = [640, 760]: sampled card width bounds, in px.
 *   title = null, note = null: heading overrides; null uses spec.title/spec.note.
 *   leftLabel = null, rightLabel = null: list header overrides; null uses the spec labels.
 *   filterPlaceholders = ['Filter', 'Search…', 'Type to filter']: rng.pick placeholder choices.
 *   arrows = ARROW: R/RR/L/LL SVG markup (16x16 chevrons, single/double right/left).
 *   buttonTitles = TITLES: R/RR/L/LL 'Move selected right'/'Move all right'/'Move selected left'/'Move all left'.
 *   orderLabels = { up: 'Up', down: 'Down' }: ordered button labels.
 *   lockedText = 'Transfer done. This list accepts one transfer.': status after the one allowed transfer.
 *   selectedText = '{n} selected': selection count status, replacing {n}.
 *   singleTransferText = 'One transfer allowed: select everything first (Shift / Ctrl-click).': idle locked-scenario status.
 *   idleText = 'Select items, then use the arrows, or drag them across.': other idle status.
 *   moreText = '+{n} more, refine the filter', ghostText = '{n} items': overflow/drag counts, replacing {n}.
 *
 * Parts (all calls use P; an override is (base, S) => replacement):
 *   style(ctx): add the tokenized structural stylesheet once, with the reference tl-style id.
 *   begin(ctx): before building the page (nothing).
 *   wrap(ctx) -> el: absolute stage wrapper.
 *   card(ctx, wrap) -> el: form anchor and sampled radius (one rng.int).
 *   heading(ctx, card) -> note: title and note; return the note for compact-page removal.
 *   body(ctx, card) -> el: grid body, with an ordered class for the ordered scenario.
 *   geometry(ctx, card, note) -> {cap, pitch}: fit rows, sample pitch (one rng.int), set row/font CSS vars.
 *   side(ctx, key, label) -> col: list panel; calls sideHeading, filter, list, sideDecorated.
 *   sideHeading(ctx, col, key, label) -> count: header with a mutable count span.
 *   filter(ctx, col, key, label) -> input: filter input, sampled placeholder (one rng.pick), query binding.
 *   list(ctx, col, key, label) -> el: accessible listbox, fixed height and insertion line.
 *   transferControls(ctx, body) -> el: central R/RR/L/LL button column.
 *   orderControls(ctx, body) -> el: Up/Down column, called only for ordered.
 *   button(ctx, parent, key, text?) -> el: accessible button, icon/text and action binding.
 *   status(ctx, card) -> el: status line below the body.
 *   row(ctx, list, key, item, index, selected) -> el: accessible option; calls rowContent.
 *   rowContent(ctx, row, key, item, index): ordered number and item label.
 *   more(ctx, list, count) -> el: capped-list overflow message.
 *   countText(ctx, key, total) -> string: parenthesized list count.
 *   statusText(ctx, model) -> string: locked, selection-count or idle message.
 *   ghost(ctx, item, count) -> el: fixed drag ghost in document.body.
 *   place(ctx, card): sample width and position, freeze anchor height (rng.int, float/pick, float/pick).
 *   sideDecorated(ctx, col, key), rowDecorated(ctx, row, key, item, index),
 *   buttonDecorated(ctx, button, key), rendered(ctx): decoration hooks (nothing).
 *   act(action): task apply, ctx.update, then P.paint.
 *   sideAt(x, y) -> key|null: hit-test listboxes; slotAt(y) -> {index, top}: right insertion slot.
 *   bindRow(ctx, row, key, item): pointer drag and click/modifier/double-click behavior.
 *   paintSide(ctx, key): rebuild visible rows, bind them, then synchronize count/filter.
 *   paintControls(ctx): synchronize disabled buttons and status.
 *   paint(): redraw only when serialized model changes; returned as sync.
 *   locate(target) -> [x, y]: row, button, filter, list or slot target; throws for hidden/missing elements.
 * S.st holds live episode state (ctx, wrap/card/note/body, geo, rows/lists/btns/filters/countL/countR,
 * insL/insR, status, ghost, suppressClick, paintKey, paint). S.ctx/spec/geo are live getters;
 * S.geo is settable. S.D/P expose resolved tokens/parts. No DOM is built in the factory.
 * Preserve every reference rng draw in order, even when replacing a visual part. Extra decorative
 * randomness must use ctx.rng.fork(label). Keep tl-row/tl-more classes for paintSide's cleanup.
 */
(function () {
  'use strict';

  const CSS = (D) => `
  .tl-wrap { position: absolute; inset: 0;${D.fontFamily ? ' font-family: ' + D.fontFamily + ';' : ''} }
  .tl-card { position: absolute; display: flex; flex-direction: column; background: ${D.colors.panel};
    border: 1px solid ${D.colors.line}; border-radius: var(--tl-r); padding: ${D.cardPadding};
    box-shadow: ${D.cardShadow}; user-select: none; }
  .tl-title { font-size: ${D.fontSizes.title}px; font-weight: 650; }
  .tl-note { margin-top: 2px; font-size: ${D.fontSizes.note}px; color: ${D.colors.muted}; }
  .tl-body { display: grid; grid-template-columns: minmax(0, 1fr) ${D.buttonColumnWidth}px minmax(0, 1fr); gap: 0 ${D.columnGap}px; margin-top: 12px; }
  .tl-body.ordered { grid-template-columns: minmax(0, 1fr) ${D.buttonColumnWidth}px minmax(0, 1fr) ${D.orderColumnWidth}px; }
  .tl-side { display: flex; flex-direction: column; min-width: 0; }
  .tl-head { display: flex; align-items: baseline; gap: 6px; margin-bottom: 6px; font-size: ${D.fontSizes.head}px; font-weight: 600; white-space: nowrap; }
  .tl-head .n { color: ${D.colors.muted}; font-weight: 500; font-size: ${D.fontSizes.count}px; }
  .tl-filter { height: ${D.buttonHeight}px; margin-bottom: 6px; padding: 0 9px; border: 1px solid color-mix(in srgb, ${D.colors.fg} 22%, ${D.colors.line});
    border-radius: ${D.controlRadius}px; background: ${D.colors.panel}; color: ${D.colors.fg}; font: inherit; font-size: ${D.fontSizes.filter}px; min-width: 0; }
  .tl-filter:focus { outline: none; border-color: ${D.colors.accent}; box-shadow: 0 0 0 2px color-mix(in srgb, ${D.colors.accent} 25%, transparent); }
  .tl-list { position: relative; border: 1px solid color-mix(in srgb, ${D.colors.fg} 20%, ${D.colors.line}); border-radius: ${D.controlRadius}px;
    background: color-mix(in srgb, ${D.colors.fg} 2%, ${D.colors.panel}); overflow: hidden; }
  .tl-list.drop { border-color: ${D.colors.accent}; box-shadow: 0 0 0 2px color-mix(in srgb, ${D.colors.accent} 22%, transparent); }
  .tl-row { display: flex; align-items: center; gap: 7px; height: var(--tl-row); padding: 0 9px; font-size: var(--tl-fs);
    white-space: nowrap; cursor: default; border-bottom: 1px solid color-mix(in srgb, ${D.colors.fg} 5%, transparent); }
  .tl-row > span { overflow: hidden; text-overflow: ellipsis; min-width: 0; }
  .tl-row:hover { background: color-mix(in srgb, ${D.colors.accent} 8%, transparent); }
  .tl-row.sel { background: ${D.colors.accent}; color: ${D.colors.selected}; }
  .tl-row .k { flex: none; width: 16px; text-align: right; color: ${D.colors.muted}; font-size: ${D.fontSizes.index}px; font-variant-numeric: tabular-nums; }
  .tl-row.sel .k { color: ${D.colors.selectedIndex}; }
  .tl-row.ghosted { opacity: .45; }
  .tl-more { height: var(--tl-row); display: flex; align-items: center; padding: 0 9px; font-size: ${D.fontSizes.more}px; color: ${D.colors.muted}; font-style: italic; }
  .tl-ins { position: absolute; left: 4px; right: 4px; height: 2px; background: ${D.colors.accent}; pointer-events: none; display: none; }
  .tl-btns { display: flex; flex-direction: column; justify-content: center; gap: 8px; }
  .tl-btn { height: ${D.buttonHeight}px; border: 1px solid color-mix(in srgb, ${D.colors.fg} 22%, ${D.colors.line}); border-radius: ${D.controlRadius}px; background: ${D.colors.panel};
    color: ${D.colors.fg}; font: inherit; font-size: ${D.fontSizes.button}px; font-weight: 600; cursor: pointer; letter-spacing: -1px; }
  .tl-btn:hover { border-color: ${D.colors.accent}; color: ${D.colors.accent}; }
  .tl-btn:disabled { opacity: .4; cursor: default; color: ${D.colors.muted}; border-color: ${D.colors.line}; }
  .tl-btn svg { width: 14px; height: 14px; vertical-align: -2px; }
  .tl-ud { display: flex; flex-direction: column; justify-content: center; gap: 8px; padding-top: 26px; }
  .tl-ud .tl-btn { font-size: ${D.fontSizes.order}px; letter-spacing: 0; padding: 0 6px; }
  .tl-status { margin-top: 10px; height: 18px; font-size: ${D.fontSizes.status}px; color: ${D.colors.muted}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .tl-ghost { position: fixed; z-index: 50; pointer-events: none; padding: 4px 10px; border-radius: ${D.controlRadius}px; background: ${D.colors.accent};
    color: ${D.colors.selected}; font-size: ${D.fontSizes.ghost}px; box-shadow: 0 6px 18px rgba(0,0,0,.2); white-space: nowrap; }
  `;

  const ARROW = {
    R: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3.5l4.5 4.5L6 12.5"/></svg>',
    RR: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3.5l4.5 4.5L3 12.5M8.5 3.5L13 8l-4.5 4.5"/></svg>',
    L: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 3.5L5.5 8l4.5 4.5"/></svg>',
    LL: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 3.5L8.5 8l4.5 4.5M7.5 3.5L3 8l4.5 4.5"/></svg>',
  };
  const TITLES = { R: 'Move selected right', RR: 'Move all right', L: 'Move selected left', LL: 'Move all left' };

  const TOKENS = {
    colors: { panel: 'var(--panel)', line: 'var(--line)', fg: 'var(--fg)', muted: 'var(--muted)',
      accent: 'var(--accent)', selected: '#fff', selectedIndex: 'rgba(255,255,255,.8)' },
    fontSizes: { title: 18, note: 13, head: 13.5, count: 12.5, filter: 13, index: 11.5, more: 12,
      button: 14, order: 12, status: 12.5, ghost: 12.5, row: 13.5, compact: 12 },
    fontFamily: null,
    cardPadding: '16px 20px 14px',
    cardShadow: '0 1px 3px rgba(0,0,0,.07), 0 10px 26px rgba(0,0,0,.06)',
    controlRadius: 5, buttonHeight: 30, buttonColumnWidth: 56, orderColumnWidth: 60, columnGap: 10,
    radiusRange: [6, 12], pitchRange: [28, 32], minPitch: 20, compactPitch: 24,
    chromeHeight: 160, filterChrome: 36, horizontalInset: 16, verticalInset: 12,
    widthRange: [600, 720], orderedWidthRange: [640, 760],
    title: null, note: null, leftLabel: null, rightLabel: null,
    filterPlaceholders: ['Filter', 'Search…', 'Type to filter'],
    arrows: ARROW, buttonTitles: TITLES, orderLabels: { up: 'Up', down: 'Down' },
    lockedText: 'Transfer done. This list accepts one transfer.',
    selectedText: '{n} selected',
    singleTransferText: 'One transfer allowed: select everything first (Shift / Ctrl-click).',
    idleText: 'Select items, then use the arrows, or drag them across.',
    moreText: '+{n} more, refine the filter', ghostText: '{n} items',
  };

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

  function installLayoutParts(BASE, S) {
    BASE.style = (ctx) => ensureStyle('tl-style', CSS(S.D));
    BASE.begin = () => {};
    BASE.sideDecorated = () => {};
    BASE.rowDecorated = () => {};
    BASE.buttonDecorated = () => {};
    BASE.rendered = () => {};

    BASE.wrap = (ctx) => ctx.util.el('div', 'tl-wrap', ctx.stage);
    BASE.card = (ctx, wrap) => {
      const card = ctx.util.el('div', 'tl-card', wrap);
      card.dataset.role = 'form';
      card.style.setProperty('--tl-r', ctx.rng.int(...S.D.radiusRange) + 'px');
      return card;
    };
    BASE.heading = (ctx, card) => {
      ctx.util.el('div', 'tl-title', card, S.D.title === null ? ctx.spec.title : S.D.title);
      return ctx.util.el('div', 'tl-note', card, S.D.note === null ? ctx.spec.note : S.D.note);
    };
    BASE.body = (ctx, card) => ctx.util.el('div', 'tl-body' + (ctx.spec.scenario === 'ordered' ? ' ordered' : ''), card);
    BASE.geometry = (ctx, card, note) => {
      const filter = ctx.spec.scenario === 'filter';
      const cap = filter ? ctx.spec.rows + 1 : ctx.spec.items.length;
      const chrome = S.D.chromeHeight + (filter ? S.D.filterChrome : 0);
      let pitch = Math.floor((ctx.size.height - 2 * S.D.verticalInset - chrome) / cap);
      pitch = Math.max(S.D.minPitch, Math.min(ctx.rng.int(...S.D.pitchRange), pitch));
      if (pitch < S.D.compactPitch) note.remove();
      card.style.setProperty('--tl-row', pitch + 'px');
      card.style.setProperty('--tl-fs', (pitch < S.D.compactPitch ? S.D.fontSizes.compact : S.D.fontSizes.row) + 'px');
      return { cap, pitch };
    };

    BASE.side = (ctx, key, label) => {
      const col = ctx.util.el('div', 'tl-side', S.st.body);
      S.st[`count${key}`] = S.P.sideHeading(ctx, col, key, label);
      if (ctx.spec.scenario === 'filter') S.st.filters[key] = S.P.filter(ctx, col, key, label);
      S.st.lists[key] = S.P.list(ctx, col, key, label);
      S.P.sideDecorated(ctx, col, key);
      return col;
    };
    BASE.sideHeading = (ctx, col, key, label) => {
      const head = ctx.util.el('div', 'tl-head', col);
      ctx.util.el('span', '', head, label);
      return ctx.util.el('span', 'n', head, '');
    };
    BASE.filter = (ctx, col, key, label) => {
      const f = ctx.util.el('input', 'tl-filter', col);
      f.type = 'text';
      f.placeholder = ctx.rng.pick(S.D.filterPlaceholders);
      f.setAttribute('aria-label', `Filter ${label}`);
      f.addEventListener('input', () => S.P.act({ query: [key, f.value] }));
      return f;
    };
    BASE.list = (ctx, col, key, label) => {
      const list = ctx.util.el('div', 'tl-list', col);
      list.setAttribute('role', 'listbox');
      list.setAttribute('aria-multiselectable', 'true');
      list.setAttribute('aria-label', label);
      list.style.height = S.st.geo.cap * S.st.geo.pitch + 2 + 'px';
      S.st[`ins${key}`] = ctx.util.el('div', 'tl-ins', list);
      return list;
    };
    BASE.transferControls = (ctx, body) => {
      const btns = ctx.util.el('div', 'tl-btns', body);
      for (const b of ['R', 'RR', 'L', 'LL']) S.st.btns[b] = S.P.button(ctx, btns, b);
      return btns;
    };
    BASE.orderControls = (ctx, body) => {
      const ud = ctx.util.el('div', 'tl-ud', body);
      for (const b of ['up', 'down']) S.st.btns[b] = S.P.button(ctx, ud, b, S.D.orderLabels[b]);
      return ud;
    };
    BASE.button = (ctx, parent, key, text) => {
      const el = ctx.util.el('button', 'tl-btn', parent, text);
      el.type = 'button';
      if (text === undefined) {
        el.innerHTML = S.D.arrows[key];
        el.title = S.D.buttonTitles[key];
        el.setAttribute('aria-label', S.D.buttonTitles[key]);
      } else el.setAttribute('aria-label', `Move selected ${key}`);
      el.addEventListener('click', () => S.P.act({ btn: key }));
      S.P.buttonDecorated(ctx, el, key);
      return el;
    };
    BASE.status = (ctx, card) => ctx.util.el('div', 'tl-status', card, '');
  }

  function installRowParts(BASE, S) {
    BASE.row = (ctx, list, key, x, i, selected) => {
      const el = ctx.util.el('div', 'tl-row' + (selected ? ' sel' : ''), list);
      el.setAttribute('role', 'option');
      el.setAttribute('aria-selected', selected ? 'true' : 'false');
      el.title = x;
      S.P.rowContent(ctx, el, key, x, i);
      return el;
    };
    BASE.rowContent = (ctx, el, key, x, i) => {
      if (ctx.spec.scenario === 'ordered' && key === 'R') ctx.util.el('span', 'k', el, String(i + 1));
      ctx.util.el('span', '', el, x);
    };
    BASE.more = (ctx, list, n) => ctx.util.el('div', 'tl-more', list, S.D.moreText.replace('{n}', n));
    BASE.countText = (ctx, key, total) => `(${total})`;
    BASE.statusText = (ctx, m) => {
      const n = m.selL.length + m.selR.length;
      return m.moves >= 1 ? S.D.lockedText : n ? S.D.selectedText.replace('{n}', n)
        : m.moves !== undefined ? S.D.singleTransferText : S.D.idleText;
    };
    BASE.ghost = (ctx, x, n) => ctx.util.el('div', 'tl-ghost', document.body, n > 1 ? S.D.ghostText.replace('{n}', n) : x);
  }

  function installInteractionParts(BASE, S) {
    BASE.act = (a) => {
      const { ctx } = S.st;
      const m = env.taskDef.helpers.apply(ctx.model, ctx.spec, a);
      ctx.update(m);
      S.P.paint();
    };
    BASE.sideAt = (x, y) => {
      for (const k of ['L', 'R']) {
        const r = S.st.lists[k].getBoundingClientRect();
        if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return k;
      }
      return null;
    };
    // Insertion index in the right list: before the first row whose middle is below y.
    BASE.slotAt = (y) => {
      const { ctx } = S.st;
      const rows = env.taskDef.helpers.shown(ctx.spec, ctx.model, 'R').rows;
      for (const x of rows) {
        const r = S.st.rows.R.get(x).getBoundingClientRect();
        if (y < r.top + r.height / 2) return { index: ctx.model.right.indexOf(x), top: r.top };
      }
      const last = rows.length ? S.st.rows.R.get(rows[rows.length - 1]).getBoundingClientRect().bottom : S.st.lists.R.getBoundingClientRect().top;
      return { index: ctx.model.right.length, top: last };
    };
    BASE.bindRow = (ctx, el, key, x) => {
      const s = S.st;
      let dragging = false;
      env.ui.track(el, {
        start() { dragging = false; },
        move(p) {
          if (!dragging && Math.hypot(p.dx, p.dy) < 5) return;
          if (!dragging) {
            dragging = true;
            const sel = ctx.model[key === 'L' ? 'selL' : 'selR'];
            const n = sel.includes(x) ? sel.length : 1;
            s.ghost = S.P.ghost(ctx, x, n);
            el.classList.add('ghosted');
          }
          s.ghost.style.left = p.x + 12 + 'px';
          s.ghost.style.top = p.y + 8 + 'px';
          const over = S.P.sideAt(p.x, p.y);
          for (const k of ['L', 'R']) s.lists[k].classList.toggle('drop', over === k && (k !== key || k === 'R'));
          const ins = s.insR;
          if (over === 'R') {
            const lr = s.lists.R.getBoundingClientRect();
            ins.style.display = 'block';
            ins.style.top = S.P.slotAt(p.y).top - lr.top - 1 + 'px';
          } else ins.style.display = 'none';
        },
        end(p) {
          if (!dragging) return;
          dragging = false;
          s.suppressClick = true;
          if (s.ghost) s.ghost.remove();
          s.ghost = null;
          el.classList.remove('ghosted');
          s.insR.style.display = 'none';
          for (const k of ['L', 'R']) s.lists[k].classList.remove('drop');
          const over = S.P.sideAt(p.x, p.y);
          if (!over) return;
          if (over === key && key === 'L') return;
          S.P.act({ drop: [key, x, over, over === 'R' ? S.P.slotAt(p.y).index : undefined] });
        },
      }, 'transfer-row');
      el.addEventListener('click', (e) => {
        if (s.suppressClick) { s.suppressClick = false; return; }
        const mod = e.shiftKey ? 'shift' : (e.ctrlKey || e.metaKey) ? 'ctrl' : '';
        S.P.act({ sel: [key, x, mod] });
      });
      el.addEventListener('dblclick', () => S.P.act({ dbl: [key, x] }));
    };
  }

  function installPaintParts(BASE, S) {
    BASE.paintSide = (ctx, side) => {
      const s = S.st;
      const fam = env.taskDef;
      const m = ctx.model;
      const list = s.lists[side];
      const { rows, more } = fam.helpers.shown(ctx.spec, m, side);
      const sel = m[side === 'L' ? 'selL' : 'selR'];
      for (const el of [...list.querySelectorAll('.tl-row, .tl-more')]) el.remove();
      s.rows[side] = new Map();
      rows.forEach((x, i) => {
        const el = S.P.row(ctx, list, side, x, i, sel.includes(x));
        S.P.bindRow(ctx, el, side, x);
        s.rows[side].set(x, el);
        S.P.rowDecorated(ctx, el, side, x, i);
      });
      if (more) S.P.more(ctx, list, more);
      const total = side === 'L' ? fam.helpers.leftOf(ctx.spec, m).length : m.right.length;
      s[`count${side}`].textContent = S.P.countText(ctx, side, total);
      if (s.filters[side] && s.filters[side].value !== (side === 'L' ? m.qL : m.qR)) s.filters[side].value = side === 'L' ? m.qL : m.qR;
    };
    BASE.paintControls = (ctx) => {
      const s = S.st;
      const m = ctx.model;
      const locked = m.moves >= 1;
      s.btns.R.disabled = locked || !m.selL.length;
      s.btns.L.disabled = locked || !m.selR.length;
      s.btns.RR.disabled = locked || !env.taskDef.helpers.matches(ctx.spec, m, 'L').length;
      s.btns.LL.disabled = locked || !env.taskDef.helpers.matches(ctx.spec, m, 'R').length;
      if (ctx.spec.scenario === 'ordered') {
        s.btns.up.disabled = !m.selR.length;
        s.btns.down.disabled = !m.selR.length;
      }
      s.status.textContent = S.P.statusText(ctx, m);
    };
    BASE.paint = () => {
      const { ctx } = S.st;
      const k = JSON.stringify(ctx.model);
      if (k === S.st.paintKey) return;
      S.st.paintKey = k;
      for (const side of ['L', 'R']) S.P.paintSide(ctx, side);
      S.P.paintControls(ctx);
    };
    BASE.place = (ctx, card) => {
      const { rng, size } = ctx;
      const range = ctx.spec.scenario === 'ordered' ? S.D.orderedWidthRange : S.D.widthRange;
      const W = Math.min(size.width - 2 * S.D.horizontalInset, rng.int(...range));
      card.style.width = W + 'px';
      card.style.height = card.offsetHeight + 'px';
      const fx = rng.pick([0, 0.5, 0.5, 1, rng.float()]);
      const fy = rng.pick([0.5, 0.5, 0, 1, rng.float()]);
      card.style.left = Math.round(S.D.horizontalInset + fx * Math.max(0, size.width - card.offsetWidth - 2 * S.D.horizontalInset)) + 'px';
      card.style.top = Math.round(S.D.verticalInset + fy * Math.max(0, size.height - card.offsetHeight - 2 * S.D.verticalInset)) + 'px';
    };
    BASE.locate = (t) => {
      const s = S.st;
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
    };
  }

  env.template('transfer-items/dual', (design, def) => {
    let D, P;
    let st = null;
    const BASE = {};
    const S = { get st() { return st; }, get ctx() { return st && st.ctx; },
      get spec() { return st && st.ctx.spec; }, get geo() { return st && st.geo; }, set geo(g) { st.geo = g; },
      get D() { return D; }, get P() { return P; } };

    installLayoutParts(BASE, S);
    installRowParts(BASE, S);
    installInteractionParts(BASE, S);
    installPaintParts(BASE, S);

    ({ D, P } = env.templateDesign('transfer-items/dual', design, def, { tokens: TOKENS, base: BASE, state: S }));
    return {
      render(ctx) {
        P.style(ctx);
        st = { ctx, rows: { L: new Map(), R: new Map() }, lists: {}, btns: {}, filters: {},
          ghost: null, suppressClick: false, paintKey: '' };
        P.begin(ctx);
        st.wrap = P.wrap(ctx);
        st.card = P.card(ctx, st.wrap);
        st.note = P.heading(ctx, st.card);
        st.body = P.body(ctx, st.card);
        st.geo = P.geometry(ctx, st.card, st.note);
        P.side(ctx, 'L', D.leftLabel === null ? ctx.spec.leftLabel : D.leftLabel);
        P.transferControls(ctx, st.body);
        P.side(ctx, 'R', D.rightLabel === null ? ctx.spec.rightLabel : D.rightLabel);
        if (ctx.spec.scenario === 'ordered') P.orderControls(ctx, st.body);
        st.status = P.status(ctx, st.card);
        st.paint = () => P.paint();
        P.paint();
        P.place(ctx, st.card);
        P.rendered(ctx);
        return { anchors: [st.card], sync: st.paint };
      },
      locate(t) { return P.locate(t); },
    };
  });
})();
