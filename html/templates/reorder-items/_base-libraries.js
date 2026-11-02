/* reorder-items/_base-libraries: reference renderer scope with its original design unit hooks.
 * Registered by reorder-items/base in the original scope order. */
(function () {
  'use strict';
  env.template('reorder-items/_base-libraries', () => ({
    register(env, scriptOf, __parts, __has, setScope) {
      'use strict';
      const __scope = {
        get env() { return env; },
        get scriptOf() { return scriptOf; },
        get LOCK() { return LOCK; },
        get AV() { return AV; },
        get gidsOf() { return gidsOf; },
        get CSS() { return CSS; },
        get ensureStyle() { return ensureStyle; },
        get idsOf() { return idsOf; },
        get isLocked() { return isLocked; },
        get center() { return center; },
        get tagName() { return tagName; },
        get S() { return S; }, set S(v) { S = v; },
        get readGroups() { return readGroups; },
        get arrange() { return arrange; },
        get commit() { return commit; },
        get settle() { return settle; },
        get attachJq() { return attachJq; },
        get attachDragula() { return attachDragula; },
        get tagEl() { return tagEl; },
        get keyPanel() { return keyPanel; },
        get makeItem() { return makeItem; },
        get buildOrdered() { return buildOrdered; },
        get mirrorPane() { return mirrorPane; },
        get buildKanban() { return buildKanban; },
        get buildCard() { return buildCard; },
        get bindKeys() { return bindKeys; },
        get render() { return render; },
        get locate() { return locate; },
      };
      for (const k of Object.keys(__parts)) if (k.startsWith('+3.')) {
        let v; let built = false;
        Object.defineProperty(__scope, k.slice(3), {
          get: () => (built ? v : (built = true, v = __parts[k](undefined, __scope))),
          set: (x) => { built = true; v = x; },
        });
      }
      setScope(__scope);
      if (__has('readGroups@3')) readGroups = __parts['readGroups@3'](readGroups, __scope);
      if (__has('arrange@3')) arrange = __parts['arrange@3'](arrange, __scope);
      if (__has('commit@3')) commit = __parts['commit@3'](commit, __scope);
      if (__has('settle')) settle = __parts['settle'](settle, __scope);
      if (__has('attachJq')) attachJq = __parts['attachJq'](attachJq, __scope);
      if (__has('attachDragula')) attachDragula = __parts['attachDragula'](attachDragula, __scope);
      if (__has('tagEl@3')) tagEl = __parts['tagEl@3'](tagEl, __scope);
      if (__has('keyPanel@3')) keyPanel = __parts['keyPanel@3'](keyPanel, __scope);
      if (__has('makeItem@3')) makeItem = __parts['makeItem@3'](makeItem, __scope);
      if (__has('buildOrdered@3')) buildOrdered = __parts['buildOrdered@3'](buildOrdered, __scope);
      if (__has('mirrorPane@3')) mirrorPane = __parts['mirrorPane@3'](mirrorPane, __scope);
      if (__has('buildKanban@3')) buildKanban = __parts['buildKanban@3'](buildKanban, __scope);
      if (__has('buildCard@3')) buildCard = __parts['buildCard@3'](buildCard, __scope);
      if (__has('bindKeys@3')) bindKeys = __parts['bindKeys@3'](bindKeys, __scope);
      if (__has('render@3')) render = __parts['render@3'](render, __scope);
      if (__has('locate@3')) locate = __parts['locate@3'](locate, __scope);

      const LOCK = __has('LOCK@3') ? __parts['LOCK@3'](undefined, __scope) : ('<svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true"><path fill="currentColor" d="M5 7V5a3 3 0 0 1 6 0v2h.5A1.5 1.5 0 0 1 13 8.5v5A1.5 1.5 0 0 1 11.5 15h-7A1.5 1.5 0 0 1 3 13.5v-5A1.5 1.5 0 0 1 4.5 7H5zm1.5 0h3V5a1.5 1.5 0 0 0-3 0v2z"/></svg>');
      const AV = __has('AV@3') ? __parts['AV@3'](undefined, __scope) : (['#e8590c', '#1c7ed6', '#2f9e44', '#7048e8', '#d6336c', '#0c8599']);
      const gidsOf = __has('gidsOf@3') ? __parts['gidsOf@3'](undefined, __scope) : { gidsOf: (sp) => (sp.staging ? [sp.staging, ...sp.columns] : sp.columns) }.gidsOf;

      const CSS = __has('CSS@3') ? __parts['CSS@3'](undefined, __scope) : (`
      .rj-wrap { display: flex; gap: 22px; align-items: flex-start; flex: none; position: relative; }
      .rj-layer { position: absolute; left: 0; top: 0; width: 0; height: 0; overflow: visible; }
      .rj-set { position: relative; flex: none; display: flex; flex-direction: column; box-sizing: border-box; margin: 0; padding: 0; list-style: none; }
      .rj-set.grid { display: block; }
      .rj-item { box-sizing: border-box; display: flex; align-items: center; gap: 10px; padding: 0 12px; flex: none; list-style: none;
        border: 1px solid var(--line); background: var(--panel); font-weight: 600; overflow: hidden;
        user-select: none; -webkit-user-select: none; cursor: grab; position: relative; margin: 0; }
      .rj-item:focus { outline: 2px solid var(--accent); outline-offset: 1px; }
      .rj-item.locked { cursor: default; opacity: .82; }
      .rj-item .rj-t { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; pointer-events: none; }
      .rj-item .rj-v { flex: none; font-variant-numeric: tabular-nums; color: var(--muted); font-weight: 600; pointer-events: none; }
      .rj-item .rj-grip { color: var(--muted); pointer-events: none; }
      .rj-item .rj-lock { color: var(--muted); display: inline-flex; pointer-events: none; }
      .rj-tag { flex: none; display: inline-flex; align-items: center; gap: 5px; padding: 2px 8px; border-radius: 999px; pointer-events: none;
        font-size: .8em; font-weight: 700; letter-spacing: .02em; white-space: nowrap;
        background: color-mix(in srgb, var(--tagc) 14%, var(--panel)); color: color-mix(in srgb, var(--tagc) 80%, var(--fg));
        border: 1px solid color-mix(in srgb, var(--tagc) 45%, transparent); }
      .rj-tag::before { content: ''; width: 8px; height: 8px; border-radius: 50%; background: var(--tagc); }
      .rj-item.tile { flex-direction: column; justify-content: center; gap: 2px; padding: 4px 8px; text-align: center; }
      .rj-set.grid > .rj-item { float: left; }
      .rj-item.tile .rj-t { flex: none; width: 100%; }
      .rj-item.tile .rj-sub { width: 100%; font-size: .72em; font-weight: 500; color: var(--muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; pointer-events: none; }
      .rj-key { flex: none; align-self: flex-start; padding: 12px 14px; border: 1px solid var(--line); border-radius: 10px;
        background: var(--panel); font-size: 13px; min-width: 150px; }
      .rj-key h4 { margin: 0 0 8px; font-size: 12px; text-transform: uppercase; letter-spacing: .06em; color: var(--muted); }
      .rj-key ol { margin: 0; padding-left: 20px; display: grid; gap: 6px; }
      .rj-pane { flex: none; position: relative; overflow-x: auto; overflow-y: hidden; scrollbar-width: thin; padding-bottom: 6px; box-sizing: content-box; }
      .rj-board { position: relative; display: flex; align-items: flex-start; }
      .rj-col { flex: none; display: flex; flex-direction: column; box-sizing: border-box; border: 1px solid var(--line); border-radius: 10px;
        background: color-mix(in srgb, var(--panel) 60%, var(--bg)); overflow: hidden; }
      .rj-col h3 { margin: 0; padding: 0 12px; flex: none; font-size: 13px; color: var(--muted); text-transform: uppercase; letter-spacing: .04em;
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: flex; align-items: center; justify-content: space-between; gap: 6px; }
      .rj-col h3 small { font-size: 11px; opacity: .8; }
      .rj-body { flex: 1; min-height: 0; display: flex; flex-direction: column; gap: 6px; padding: 8px; box-sizing: border-box; margin: 0; list-style: none; }
      .rj-card { display: block; padding: 7px 10px; height: auto; flex: 0 1 auto; min-height: 30px; font-weight: 500; }
      .rj-card .rj-ct { display: flex; align-items: center; gap: 8px; font-weight: 700; }
      .rj-card .rj-ct .rj-t { flex: 1; }
      .rj-card .rj-m { font-size: .78em; color: var(--muted); line-height: 1.35; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; pointer-events: none; }
      .rj-card .rj-bd { display: flex; gap: 4px; margin-top: 4px; pointer-events: none; }
      .rj-card .rj-bd span { font-size: 10.5px; font-weight: 700; color: #fff; padding: 1px 6px; border-radius: 4px; }
      .rj-body.dense .rj-card .rj-m + .rj-m, .rj-body.dense .rj-card .rj-bd { display: none; }
      .rj-av { flex: none; width: 22px; height: 22px; border-radius: 50%; display: grid; place-items: center; font-size: 10px; font-weight: 700; color: #fff; pointer-events: none; }

      /* jQuery UI look: flat grey widget rows, a yellow highlight where the item will land */
      .rj-jq .rj-item { border-radius: 3px; background: linear-gradient(color-mix(in srgb, var(--panel) 92%, #fff), color-mix(in srgb, var(--line) 22%, var(--panel))); font-weight: 500; }
      .rj-jq .rj-item .rj-grip { font-size: 15px; line-height: 1; }
      .rj-jq .rj-ph { box-sizing: border-box; border: 1px dashed #c9a227; background: #fbf3c4; flex: none; border-radius: 3px; list-style: none; visibility: visible; }
      .rj-jq .rj-set.grid > .rj-ph { float: left; }
      .rj-jq .ui-sortable-helper { box-shadow: 0 4px 12px rgba(0,0,0,.3); border-color: var(--accent); z-index: 1000; }
      /* dragula look: soft cards, a faded shadow in the list, a tilted mirror under the pointer */
      .rj-gu .rj-item { border-radius: 10px; box-shadow: 0 1px 3px rgba(0,0,0,.14); }
      .rj-gu .rj-item .rj-grip { letter-spacing: -2px; }
      .rj-gu .rj-item.gu-transit { opacity: .45; background: color-mix(in srgb, var(--accent) 12%, var(--panel)); outline: 2px dashed var(--accent); outline-offset: -2px; box-shadow: none; }
      .gu-mirror { position: fixed !important; margin: 0 !important; z-index: 9999 !important; opacity: .85; pointer-events: none; transform: rotate(1.2deg);
        box-shadow: 0 8px 20px rgba(0,0,0,.28) !important; }
      .gu-hide { left: -9999px !important; }
      .gu-unselectable { -webkit-user-select: none !important; user-select: none !important; }
      `);

      const ensureStyle = __has('ensureStyle@3') ? __parts['ensureStyle@3'](undefined, __scope) : { ensureStyle: () => env.util.css('rj-style', CSS) }.ensureStyle;

      let S = __has('S@3') ? __parts['S@3'](undefined, __scope) : (null);

      const idsOf = __has('idsOf@3') ? __parts['idsOf@3'](undefined, __scope) : { idsOf: (el) => [...el.children].filter((c) => c.classList.contains('rj-item') && !c.classList.contains('ui-sortable-helper') && c.dataset.id).map((c) => c.dataset.id) }.idsOf;
      const isLocked = __has('isLocked@3') ? __parts['isLocked@3'](undefined, __scope) : { isLocked: (id) => !!(S.spec.locked && id in S.spec.locked) }.isLocked;
      const center = __has('center@3') ? __parts['center@3'](undefined, __scope) : { center: (r) => [r.left + r.width / 2, r.top + r.height / 2] }.center;

      // ---- model <-> DOM

      function readGroups() {
        const out = {};
        for (const g of Object.keys(S.groups)) out[g] = idsOf(S.groups[g]);
        return out;
      }

      function arrange(groups) {
        for (const g of Object.keys(S.groups)) {
          for (const id of groups[g]) S.groups[g].append(S.els[id]);
        }
        if (S.kanban) {
          for (const c of gidsOf(S.spec)) {
            S.counts[c].textContent = String(groups[c].length);
            S.groups[c].classList.toggle('dense', groups[c].length > 4);
          }
        }
      }

      // Apply a finished drag or key press: groups = the new { group: [id] } arrangement.
      function commit(groups, focus) {
        const { ctx, spec } = S;
        if (S.kanban) {
          arrange(groups);
          ctx.update({ ...ctx.model, columns: groups });
          return;
        }
        const pin = env.taskDef.helpers.pin;
        const order = pin ? pin(groups.main, spec) : groups.main;
        arrange({ main: order });
        const next = { ...ctx.model, order };
        if (focus) {
          S.els[focus].focus();
          next.focus = focus;
        }
        ctx.update(next);
      }

      // The drag ended: take whatever order the library left in the DOM.
      function settle() {
        const groups = readGroups();
        const same = JSON.stringify(groups) === JSON.stringify(S.before);
        if (same) { arrange(groups); return; }
        commit(groups);
      }

      // ---- libraries

      function attachJq() {
        const $ = window.jQuery;
        if (!$ || !$.fn.sortable) throw new Error('reorder/jqueryui: vendored jQuery UI is missing');
        const { spec } = S;
        // jQuery UI refreshes its position cache a timer tick after every swap (widget._delay is a setTimeout); the kit
        // runs on its own clock, so the refresh runs in the same call instead and a drag no longer depends on wall time.
        $.ui.sortable.prototype._delay = function (handler) { return handler.call(this); };
        const o = {
          items: '> .rj-item:not(.locked)', placeholder: 'rj-ph', forcePlaceholderSize: true,
          tolerance: S.tolerance, distance: S.distance, cursor: 'grabbing', opacity: S.kanban ? 0.9 : 0.95, scroll: false,
          helper: S.clone ? 'clone' : 'original', zIndex: 1000,
          start() { S.before = readGroups(); },
          stop() { settle(); },
        };
        if (S.kanban) {
          o.connectWith = '.rj-body';
          o.appendTo = S.layer;
        } else {
          o.containment = 'parent';
          o.axis = 'y';
        }
        for (const g of Object.keys(S.groups)) $(S.groups[g]).sortable(o);
      }

      function attachDragula() {
        if (!window.dragula) throw new Error('reorder/dragula: vendored dragula is missing');
        if (S.prev && S.prev.drake) { S.prev.drake.destroy(); S.prev.drake = null; }
        const drake = window.dragula(Object.values(S.groups), {
          mirrorContainer: S.wrap,
          direction: S.grid ? 'horizontal' : 'vertical',
          revertOnSpill: true,
          moves: (el) => el.classList.contains('rj-item') && !el.classList.contains('locked'),
          accepts: () => true,
        });
        drake.on('drag', () => { S.before = readGroups(); });
        drake.on('cloned', (mirror, orig, type) => {
          if (type !== 'mirror') return;
          const cs = getComputedStyle(orig);
          mirror.style.fontSize = cs.fontSize;
          mirror.style.fontFamily = cs.fontFamily;
          mirror.style.color = cs.color;
          mirror.removeAttribute('data-role');
        });
        drake.on('drop', () => settle());
        S.drake = drake;
      }

      // ---- builders

      function tagEl(util, parent, lab) {
        const t = util.el('span', 'rj-tag', parent, lab.tag);
        t.style.setProperty('--tagc', lab.color || '#868e96');
        return t;
      }

      function keyPanel(ctx, parent) {
        const { util, spec } = ctx;
        if (!spec.legend) return null;
        const box = util.el('div', 'rj-key', parent);
        util.el('h4', '', box, spec.legendTitle || 'Key');
        const ol = util.el('ol', '', box);
        for (const l of spec.legend) tagEl(util, util.el('li', '', ol), l);
        return box;
      }

      const tagName = __has('tagName') ? __parts['tagName'](undefined, __scope) : { tagName: () => (S.engine === 'jqueryui' ? 'li' : 'div') }.tagName;

      function makeItem(parent, id, grid, showTag) {
        const { spec } = S;
        const { util } = S.ctx;
        const lab = spec.labels[id];
        const locked = isLocked(id);
        const el = util.el(tagName(), 'rj-item' + (grid ? ' tile' : '') + (locked ? ' locked' : ''), parent);
        el.dataset.role = 'card';
        el.dataset.id = id;
        if (spec.keys && !locked) el.tabIndex = 0;
        if (grid) {
          util.el('span', 'rj-t', el, lab.value || lab.title);
          if (lab.value) util.el('span', 'rj-sub', el, lab.title);
        } else {
          if (locked) util.el('span', 'rj-lock', el).innerHTML = LOCK;
          else util.el('span', 'rj-grip', el, S.engine === 'jqueryui' ? '↕' : '⋮⋮');
          util.el('span', 'rj-t', el, lab.title);
          if (lab.tag && (showTag || !lab.value)) tagEl(util, el, lab);
          if (lab.value) util.el('span', 'rj-v', el, lab.value);
        }
        if (locked) el.title = 'Pinned';
        S.els[id] = el;
        return el;
      }

      function buildOrdered(wrap) {
        const { ctx, spec } = S;
        const { rng, util, size } = ctx;
        const n = spec.items.length;
        const grid = spec.scenario === 'grid';
        S.grid = grid;
        const legendW = spec.legend ? 190 : 0;
        const availW = size.width - 60 - legendW;
        const availH = size.height - 36;
        const hasVal = spec.items.some((id) => spec.labels[id].value);
        const longest = Math.max(...spec.items.map((id) => spec.labels[id].title.length + (spec.labels[id].value || '').length * 0.9 + (spec.labels[id].tag ? 10 : 0)));
        let w;
        let h;
        let gap;
        let font;
        if (grid) {
          const rows = Math.ceil(n / spec.cols);
          gap = rng.int(8, 16);
          const maxH = Math.floor((availH - (rows - 1) * gap) / rows);
          const maxW = Math.floor((availW - (spec.cols - 1) * gap) / spec.cols);
          const wordy = spec.rule.kind !== 'number';
          h = Math.max(40, rng.int(Math.min(56, maxH), Math.min(hasVal ? 92 : 100, maxH)));
          w = Math.min(maxW, wordy ? rng.int(hasVal ? 132 : 112, hasVal ? 170 : 140) : h);
          font = Math.max(13, Math.min(20, Math.floor(h * 0.3)));
        } else {
          gap = rng.int(5, 10);
          h = Math.max(26, Math.min(rng.int(40, 56), Math.floor(availH / n) - gap));
          font = Math.max(12, Math.min(17, Math.floor(h * 0.38)));
          const want = Math.round(longest * font * 0.62 + 110);
          w = Math.max(220, Math.min(availW, rng.int(Math.max(260, want), Math.max(280, want + 100)), 640));
        }
        S.gap = gap;
        const cols = grid ? spec.cols : 1;
        const rows = Math.ceil(n / cols);
        const host = util.el(S.engine === 'jqueryui' ? 'ul' : 'div', 'rj-set' + (grid ? ' grid' : ''), wrap);
        host.dataset.group = 'main';
        Object.assign(host.style, { width: cols * w + (cols - 1) * gap + 'px', height: rows * h + (rows - 1) * gap + 'px', gap: gap + 'px' });
        wrap.style.fontSize = font + 'px';
        S.host = host;
        S.groups = { main: host };
        const showTag = rng.bool(0.5);
        for (const id of ctx.model.order) {
          const el = makeItem(host, id, grid, showTag);
          Object.assign(el.style, { width: w + 'px', height: h + 'px' });
          if (grid) Object.assign(el.style, { marginRight: gap + 'px', marginBottom: gap + 'px' });
        }
        if (grid) {
          // Floats wrap by the box width plus the trailing margins.
          host.style.width = cols * (w + gap) + 'px';
          host.style.height = rows * (h + gap) + 'px';
        }
        S.anchor = host;
      }

      function mirrorPane() {
        const p = S.pane;
        if (!p) return;
        const cols = {};
        for (const c of gidsOf(S.spec)) cols[c] = [S.cols[c].offsetLeft, S.cols[c].offsetLeft + S.cols[c].offsetWidth];
        const pane = { scroll: Math.round(p.scrollLeft), width: p.clientWidth, max: p.scrollWidth - p.clientWidth, cols };
        const old = S.ctx.model.pane;
        if (old && old.scroll === pane.scroll && old.width === pane.width && old.max === pane.max) return;
        S.ctx.update({ ...S.ctx.model, pane });
      }

      function buildKanban(wrap) {
        const { ctx, spec } = S;
        const { rng, util, size } = ctx;
        S.kanban = true;
        const gids = gidsOf(spec);
        const k = gids.length;
        const gap = rng.int(12, 20);
        const head = rng.int(34, 40);
        const colW = spec.pane ? rng.int(200, 230) : Math.min(260, Math.max(150, Math.floor((size.width - 70 - (k - 1) * gap) / k)));
        const colH = size.height - 56;
        const boardW = k * colW + (k - 1) * gap;
        let host = wrap;
        if (spec.pane) {
          const shown = rng.float(2.2, 3.4);
          const pw = Math.min(size.width - 64, Math.floor(shown * (colW + gap)), boardW - 40);
          S.pane = util.el('div', 'rj-pane', wrap);
          S.pane.style.width = Math.max(2 * (colW + gap), pw) + 'px';
          S.pane.style.height = colH + 'px';
          host = S.pane;
        }
        const board = util.el('div', 'rj-board', host);
        Object.assign(board.style, { width: boardW + 'px', height: colH + 'px', gap: gap + 'px' });
        wrap.style.fontSize = rng.int(14, 15) + 'px';
        S.board = board;
        S.cols = {};
        S.groups = {};
        S.counts = {};
        for (const c of gids) {
          const col = util.el('div', 'rj-col', board);
          col.dataset.role = 'column';
          Object.assign(col.style, { width: colW + 'px', height: colH + 'px' });
          const h = util.el('h3', '', col);
          h.style.height = head + 'px';
          util.el('span', '', h, c === spec.staging ? 'Unassigned' : spec.colLabels[c]);
          S.counts[c] = util.el('small', '', h);
          const body = util.el(S.engine === 'jqueryui' ? 'ul' : 'div', 'rj-body', col);
          body.dataset.group = c;
          S.cols[c] = col;
          S.groups[c] = body;
        }
        for (const c of gids) {
          for (const id of ctx.model.columns[c]) buildCard(S.groups[c], id);
        }
        arrange(readGroups());
        S.anchor = S.pane ? S.pane.parentElement : board;
        if (S.pane) {
          S.pane.addEventListener('wheel', (e) => {
            const unit = e.deltaMode === 1 ? 40 : e.deltaMode === 2 ? S.pane.clientWidth : 1;
            const d = (Math.abs(e.deltaX) >= Math.abs(e.deltaY) ? e.deltaX : e.deltaY) * unit;
            e.preventDefault();
            S.pane.scrollLeft += d;
            mirrorPane();
          }, { passive: false });
          S.pane.addEventListener('scroll', mirrorPane);
          mirrorPane();
        }
      }

      function buildCard(parent, id) {
        const { spec } = S;
        const { util } = S.ctx;
        const lab = spec.labels[id];
        const el = util.el(tagName(), 'rj-item rj-card', parent);
        el.dataset.role = 'card';
        el.dataset.id = id;
        const top = util.el('div', 'rj-ct', el);
        if (lab.who) {
          const av = util.el('span', 'rj-av', top, lab.who);
          av.style.background = AV[(lab.who.charCodeAt(0) + lab.who.charCodeAt(1)) % AV.length];
        }
        util.el('span', 'rj-t', top, lab.title);
        if (lab.value) util.el('span', 'rj-v', top, lab.value);
        for (const line of lab.meta || []) util.el('div', 'rj-m', el, line);
        if (lab.badges && lab.badges.length) {
          const bd = util.el('div', 'rj-bd', el);
          for (const b of lab.badges) util.el('span', '', bd, b.text).style.background = b.color;
        }
        S.els[id] = el;
        return el;
      }

      function bindKeys() {
        const { ctx, spec } = S;
        if (!spec.keys || S.kanban) return;
        const root = S.host;
        // jQuery UI cancels the default of a press (no focus-on-click): focus the item by hand.
        root.addEventListener('pointerdown', (e) => {
          const el = e.target.closest && e.target.closest('.rj-item[tabindex]');
          if (el) el.focus({ preventScroll: true });
        });
        root.addEventListener('keydown', (e) => {
          const el = e.target.closest && e.target.closest('.rj-item');
          if (!el) return;
          const back = e.key === 'ArrowUp' || e.key === 'ArrowLeft';
          const fwd = e.key === 'ArrowDown' || e.key === 'ArrowRight';
          if (!back && !fwd) return;
          e.preventDefault();
          const order = idsOf(root);
          const i = order.indexOf(el.dataset.id);
          const j = i + (back ? -1 : 1);
          if (j < 0 || j >= order.length) return;
          [order[i], order[j]] = [order[j], order[i]];
          commit({ main: order }, el.dataset.id);
        });
        root.addEventListener('focusin', (e) => {
          const el = e.target.closest && e.target.closest('.rj-item');
          if (el && ctx.model.focus !== el.dataset.id) ctx.update({ ...ctx.model, focus: el.dataset.id });
        });
        root.addEventListener('focusout', (e) => {
          if (!(e.relatedTarget && root.contains(e.relatedTarget)) && ctx.model.focus) ctx.update({ ...ctx.model, focus: null });
        });
      }

      function render(ctx, engine) {
        ensureStyle();
        const prev = S;
        S = { ctx, engine, spec: ctx.spec, els: {}, groups: {}, grid: false, kanban: false, pane: null, prev, before: null };
        const rng = ctx.rng.fork('lib');
        // jQuery UI options drawn per episode: where the placeholder swaps and which element is carried.
        // megawob-lint: allow oracle-patch the sortable's hit-test mode, not the task's tolerance()
        S.tolerance = rng.bool(0.5) ? 'pointer' : 'intersect';
        S.clone = rng.bool(0.4);
        S.distance = rng.int(3, 6);
        const wrap = ctx.util.el('div', `rj-wrap ${engine === 'jqueryui' ? 'rj-jq' : 'rj-gu'}`, ctx.stage);
        wrap.style.margin = `${ctx.rng.int(4, 14)}px ${ctx.rng.int(8, 28)}px`;
        S.wrap = wrap;
        // The carried clone lives in an out-of-flow layer: appended to the flex row it would push the board sideways.
        S.layer = ctx.util.el('div', 'rj-layer', wrap);
        if (ctx.spec.scenario === 'kanban') buildKanban(wrap);
        else {
          const keyFirst = ctx.spec.legend && ctx.rng.bool(0.3);
          if (keyFirst) keyPanel(ctx, wrap);
          buildOrdered(wrap);
          if (!keyFirst) keyPanel(ctx, wrap);
        }
        bindKeys();
        if (engine === 'jqueryui') attachJq();
        else attachDragula();
        S.prev = null;
        return { anchors: [S.anchor] };
      }

      function locate(t) {
        const r = (id) => S.els[id].getBoundingClientRect();
        if (t.pane !== undefined) {
          const pr = S.pane.getBoundingClientRect();
          return [pr.left + pr.width / 2, pr.top + 20];
        }
        if (t.slot === undefined && t.column === undefined) {
          if (t.item === undefined) throw new Error(`reorder-items/${S.engine} cannot locate ${JSON.stringify(t)}`);
          const b = r(t.item);
          // jQuery UI keeps a contained helper inside its box, so the pointer can never get above the grab offset into the
          // first row: press the item high (and left, in a grid) so the first slot's upper half stays reachable.
          if (S.engine === 'jqueryui' && !S.kanban) return [b.left + b.width * 0.5, b.top + b.height * 0.35];
          return center(b);
        }
        // Moving to an earlier slot: aim at the half of the item that sits there which the drag comes in from
        // ('intersect' tolerance, dragula's before/after rule): its upper quarter, or its left quarter in a grid.
        const before = (el) => {
          const b = el.getBoundingClientRect();
          return S.grid ? [b.left + b.width * 0.3, b.top + b.height * 0.5] : [b.left + b.width / 2, b.top + b.height * 0.28];
        };
        if (!S.kanban) return before(S.els[idsOf(S.host)[t.slot]]);
        const col = t.column;
        const ids = idsOf(S.groups[col]);
        const same = t.item !== undefined && S.els[t.item].parentElement.dataset.group === col;
        const slot = t.slot === undefined ? ids.length : t.slot;
        if (same) return before(S.els[ids[Math.min(slot, ids.length - 1)]]);
        const body = S.groups[col].getBoundingClientRect();
        if (slot < ids.length) return before(S.els[ids[slot]]);
        if (!ids.length) return [body.left + body.width / 2, body.top + Math.min(40, body.height / 2)];
        const last = r(ids[ids.length - 1]);
        if (body.bottom - last.bottom > 16) return [body.left + body.width / 2, last.bottom + Math.min(12, (body.bottom - last.bottom) / 2)];
        return [last.left + last.width / 2, last.bottom - Math.min(last.height * 0.25, 8)];
      }

      env.widget({
        task: 'reorder-items', site: 'base', name: 'jqueryui', split: 'train',
        // No grid: jQuery UI decides before / after from the direction of the last pointer move, so a scripted straight
        // drag to a tile up and to the right of the item lands one slot late and the plan never converges.
        scenarios: ['list', 'kanban', 'move'],
        traits: { cardMeta: true, wheelPane: true },
        uses: [['../vendor/jquery-3.7.1/jquery.min', 'vendor'], ['../vendor/jquery-ui-1.13.3/jquery-ui.min', 'vendor']],
        render: (ctx) => render(ctx, 'jqueryui'),
        locate,
      });

      env.widget({
        task: 'reorder-items', site: 'base', name: 'dragula', split: 'train',
        scenarios: ['list', 'grid', 'kanban', 'move'],
        traits: { cardMeta: true, wheelPane: true },
        uses: [['../vendor/dragula-3.7.3/dragula.min', 'vendor']],
        render: (ctx) => render(ctx, 'dragula'),
        locate,
      });
    
    },
  }));
})();
