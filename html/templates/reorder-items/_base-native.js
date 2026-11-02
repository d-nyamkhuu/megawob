/* reorder-items/_base-native: reference renderer scope with its original design unit hooks.
 * Registered by reorder-items/base in the original scope order. */
(function () {
  'use strict';
  env.template('reorder-items/_base-native', () => ({
    register(env, scriptOf, __parts, __has, setScope) {
      'use strict';
      const __scope = {
        get env() { return env; },
        get scriptOf() { return scriptOf; },
        get LOCK() { return LOCK; },
        get AV() { return AV; },
        get EDGE() { return EDGE; },
        get gidsOf() { return gidsOf; },
        get CSS() { return CSS; },
        get idsOf() { return idsOf; },
        get isLocked() { return isLocked; },
        get center() { return center; },
        get S() { return S; }, set S(v) { S = v; },
        get ensureStyle() { return ensureStyle; },
        get readGroups() { return readGroups; },
        get arrange() { return arrange; },
        get groupOf() { return groupOf; },
        get commit() { return commit; },
        get moveTo() { return moveTo; },
        get takeSnap() { return takeSnap; },
        get hit() { return hit; },
        get showLine() { return showLine; },
        get attachNative() { return attachNative; },
        get attachSortable() { return attachSortable; },
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
      for (const k of Object.keys(__parts)) if (k.startsWith('+2.')) {
        let v; let built = false;
        Object.defineProperty(__scope, k.slice(3), {
          get: () => (built ? v : (built = true, v = __parts[k](undefined, __scope))),
          set: (x) => { built = true; v = x; },
        });
      }
      setScope(__scope);
      if (__has('ensureStyle@2')) ensureStyle = __parts['ensureStyle@2'](ensureStyle, __scope);
      if (__has('readGroups@2')) readGroups = __parts['readGroups@2'](readGroups, __scope);
      if (__has('arrange@2')) arrange = __parts['arrange@2'](arrange, __scope);
      if (__has('groupOf')) groupOf = __parts['groupOf'](groupOf, __scope);
      if (__has('commit@2')) commit = __parts['commit@2'](commit, __scope);
      if (__has('moveTo')) moveTo = __parts['moveTo'](moveTo, __scope);
      if (__has('takeSnap')) takeSnap = __parts['takeSnap'](takeSnap, __scope);
      if (__has('hit')) hit = __parts['hit'](hit, __scope);
      if (__has('showLine')) showLine = __parts['showLine'](showLine, __scope);
      if (__has('attachNative')) attachNative = __parts['attachNative'](attachNative, __scope);
      if (__has('attachSortable')) attachSortable = __parts['attachSortable'](attachSortable, __scope);
      if (__has('tagEl@2')) tagEl = __parts['tagEl@2'](tagEl, __scope);
      if (__has('keyPanel@2')) keyPanel = __parts['keyPanel@2'](keyPanel, __scope);
      if (__has('makeItem@2')) makeItem = __parts['makeItem@2'](makeItem, __scope);
      if (__has('buildOrdered@2')) buildOrdered = __parts['buildOrdered@2'](buildOrdered, __scope);
      if (__has('mirrorPane@2')) mirrorPane = __parts['mirrorPane@2'](mirrorPane, __scope);
      if (__has('buildKanban@2')) buildKanban = __parts['buildKanban@2'](buildKanban, __scope);
      if (__has('buildCard@2')) buildCard = __parts['buildCard@2'](buildCard, __scope);
      if (__has('bindKeys@2')) bindKeys = __parts['bindKeys@2'](bindKeys, __scope);
      if (__has('render@2')) render = __parts['render@2'](render, __scope);
      if (__has('locate@2')) locate = __parts['locate@2'](locate, __scope);

      const LOCK = __has('LOCK@2') ? __parts['LOCK@2'](undefined, __scope) : ('<svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true"><path fill="currentColor" d="M5 7V5a3 3 0 0 1 6 0v2h.5A1.5 1.5 0 0 1 13 8.5v5A1.5 1.5 0 0 1 11.5 15h-7A1.5 1.5 0 0 1 3 13.5v-5A1.5 1.5 0 0 1 4.5 7H5zm1.5 0h3V5a1.5 1.5 0 0 0-3 0v2z"/></svg>');
      const AV = __has('AV@2') ? __parts['AV@2'](undefined, __scope) : (['#e8590c', '#1c7ed6', '#2f9e44', '#7048e8', '#d6336c', '#0c8599']);
      const EDGE = __has('EDGE') ? __parts['EDGE'](undefined, __scope) : (14);
      // Kanban groups in board order: the unassigned tray first when the episode has one (spec.staging).
      const gidsOf = __has('gidsOf@2') ? __parts['gidsOf@2'](undefined, __scope) : { gidsOf: (sp) => (sp.staging ? [sp.staging, ...sp.columns] : sp.columns) }.gidsOf;

      const CSS = __has('CSS@2') ? __parts['CSS@2'](undefined, __scope) : (`
      .rf-wrap { display: flex; gap: 22px; align-items: flex-start; flex: none; position: relative; }
      .rf-set { position: relative; flex: none; display: flex; flex-direction: column; box-sizing: border-box; }
      .rf-set.grid { display: grid; }
      .rf-item { box-sizing: border-box; display: flex; align-items: center; gap: 10px; padding: 0 12px; flex: none;
        border: 1px solid var(--line); border-radius: 8px; background: var(--panel); font-weight: 600; overflow: hidden;
        user-select: none; -webkit-user-select: none; cursor: grab; position: relative; }
      .rf-item:focus { outline: 2px solid var(--accent); outline-offset: 1px; }
      .rf-item.locked { cursor: default; opacity: .82; }
      .rf-item .rf-t { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; pointer-events: none; }
      .rf-item .rf-v { flex: none; font-variant-numeric: tabular-nums; color: var(--muted); font-weight: 600; pointer-events: none; }
      .rf-item .rf-grip { color: var(--muted); letter-spacing: -2px; pointer-events: none; }
      .rf-item .rf-lock { color: var(--muted); display: inline-flex; pointer-events: none; }
      .rf-tag { flex: none; display: inline-flex; align-items: center; gap: 5px; padding: 2px 8px; border-radius: 999px; pointer-events: none;
        font-size: .8em; font-weight: 700; letter-spacing: .02em; white-space: nowrap;
        background: color-mix(in srgb, var(--tagc) 14%, var(--panel)); color: color-mix(in srgb, var(--tagc) 80%, var(--fg));
        border: 1px solid color-mix(in srgb, var(--tagc) 45%, transparent); }
      .rf-tag::before { content: ''; width: 8px; height: 8px; border-radius: 50%; background: var(--tagc); }
      .rf-item.tile { flex-direction: column; justify-content: center; gap: 2px; padding: 4px 8px; text-align: center; }
      .rf-item.tile .rf-t { flex: none; width: 100%; }
      .rf-item.tile .rf-sub { width: 100%; font-size: .72em; font-weight: 500; color: var(--muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; pointer-events: none; }
      .rf-key { flex: none; align-self: flex-start; padding: 12px 14px; border: 1px solid var(--line); border-radius: 10px;
        background: var(--panel); font-size: 13px; min-width: 150px; }
      .rf-key h4 { margin: 0 0 8px; font-size: 12px; text-transform: uppercase; letter-spacing: .06em; color: var(--muted); }
      .rf-key ol { margin: 0; padding-left: 20px; display: grid; gap: 6px; }
      .rf-line { position: absolute; z-index: 6; pointer-events: none; display: none; background: var(--accent); border-radius: 2px; }
      .rf-line::before, .rf-line::after { content: ''; position: absolute; width: 8px; height: 8px; border-radius: 50%; background: var(--accent); }
      .rf-line.h::before { left: -4px; top: -2.5px; } .rf-line.h::after { right: -4px; top: -2.5px; }
      .rf-line.v::before { top: -4px; left: -2.5px; } .rf-line.v::after { bottom: -4px; left: -2.5px; }
      .rf-native .rf-item.dragging { opacity: .38; }
      .rf-native .rf-item { border-left: 4px solid color-mix(in srgb, var(--accent) 55%, var(--line)); }
      .rf-native .rf-item.locked { border-left-color: var(--line); }
      .rf-sortable .rf-item { border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,.12); }
      .rf-sortable .rf-item.rf-ghost { opacity: .45; background: color-mix(in srgb, var(--accent) 14%, var(--panel));
        outline: 2px dashed var(--accent); outline-offset: -2px; box-shadow: none; }
      .rf-sortable .rf-item.rf-chosen { box-shadow: 0 6px 16px rgba(0,0,0,.22); }
      .rf-pane { flex: none; position: relative; overflow-x: auto; overflow-y: hidden; scrollbar-width: thin; padding-bottom: 6px; box-sizing: content-box; }
      .rf-board { position: relative; display: flex; align-items: flex-start; }
      .rf-col { flex: none; display: flex; flex-direction: column; box-sizing: border-box; border: 1px solid var(--line); border-radius: 10px;
        background: color-mix(in srgb, var(--panel) 60%, var(--bg)); overflow: hidden; }
      .rf-col h3 { margin: 0; padding: 0 12px; flex: none; font-size: 13px; color: var(--muted); text-transform: uppercase; letter-spacing: .04em;
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: flex; align-items: center; justify-content: space-between; gap: 6px; }
      .rf-col h3 small { font-size: 11px; opacity: .8; }
      .rf-body { flex: 1; min-height: 0; display: flex; flex-direction: column; gap: 6px; padding: 8px; box-sizing: border-box; }
      .rf-card { display: block; padding: 7px 10px; height: auto; flex: 0 1 auto; min-height: 30px; font-weight: 500; }
      .rf-card .rf-ct { display: flex; align-items: center; gap: 8px; font-weight: 700; }
      .rf-card .rf-ct .rf-t { flex: 1; }
      .rf-card .rf-m { font-size: .78em; color: var(--muted); line-height: 1.35; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; pointer-events: none; }
      .rf-card .rf-bd { display: flex; gap: 4px; margin-top: 4px; pointer-events: none; }
      .rf-card .rf-bd span { font-size: 10.5px; font-weight: 700; color: #fff; padding: 1px 6px; border-radius: 4px; }
      .rf-body.dense .rf-card .rf-m + .rf-m, .rf-body.dense .rf-card .rf-bd { display: none; }
      .rf-av { flex: none; width: 22px; height: 22px; border-radius: 50%; display: grid; place-items: center; font-size: 10px; font-weight: 700; color: #fff; pointer-events: none; }
      `);

      function ensureStyle() {
        if (document.getElementById('rf-style')) return;
        const s = document.createElement('style');
        s.id = 'rf-style';
        s.textContent = CSS;
        document.head.append(s);
      }

      let S = __has('S@2') ? __parts['S@2'](undefined, __scope) : (null);

      const idsOf = __has('idsOf@2') ? __parts['idsOf@2'](undefined, __scope) : { idsOf: (el) => [...el.children].filter((c) => c.classList.contains('rf-item')).map((c) => c.dataset.id) }.idsOf;
      const isLocked = __has('isLocked@2') ? __parts['isLocked@2'](undefined, __scope) : { isLocked: (id) => !!(S.spec.locked && id in S.spec.locked) }.isLocked;
      const center = __has('center@2') ? __parts['center@2'](undefined, __scope) : { center: (r) => [r.left + r.width / 2, r.top + r.height / 2] }.center;

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

      function groupOf(id) {
        return S.els[id].parentElement.dataset.group;
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

      function moveTo(id, gid, idx) {
        const groups = readGroups();
        const src = groupOf(id);
        groups[src].splice(groups[src].indexOf(id), 1);
        groups[gid].splice(Math.max(0, Math.min(groups[gid].length, idx)), 0, id);
        commit(groups);
      }

      // ---- drop geometry (native engine)

      // Layout at the start of a drag (client px): group boxes and item boxes, plus the arrangement then. The drop
      // is resolved against it, so the result depends on the drop point alone, whatever the engine moved meanwhile.
      function takeSnap() {
        const snap = { orig: readGroups(), groups: {} };
        for (const g of Object.keys(S.groups)) {
          const box = S.kanban ? S.cols[g] : S.host;
          snap.groups[g] = { rect: box.getBoundingClientRect(), items: snap.orig[g].map((id) => ({ id, rect: S.els[id].getBoundingClientRect() })) };
        }
        S.snap = snap;
        return snap;
      }

      // The group under a pointer and the index the dragged item would take in it, or null.
      function hit(x, y, id) {
        const snap = S.snap;
        let gid = null;
        const pad = S.kanban ? 0 : EDGE;
        for (const g of Object.keys(snap.groups)) {
          const r = snap.groups[g].rect;
          if (x >= r.left - pad && x <= r.right + pad && y >= r.top - pad && y <= r.bottom + pad) gid = g;
        }
        if (!gid) return null;
        const items = snap.groups[gid].items;
        if (snap.orig[gid].includes(id)) {
          let best = 0;
          let bd = Infinity;
          items.forEach((it, i) => {
            const [cx, cy] = center(it.rect);
            const d = S.grid ? Math.hypot(cx - x, cy - y) : Math.abs(cy - y);
            if (d < bd) { bd = d; best = i; }
          });
          return { gid, idx: best };
        }
        return { gid, idx: items.filter((it) => center(it.rect)[1] < y).length };
      }

      function showLine(h, id) {
        const els = idsOf(S.groups[h.gid]).map((i) => S.els[i]);
        const same = groupOf(id) === h.gid;
        const a = els.indexOf(S.els[id]);
        if (same && h.idx === a) { S.line.style.display = 'none'; return; }
        const hostR = S.lineHost.getBoundingClientRect();
        const bodyR = S.groups[h.gid].getBoundingClientRect();
        const after = same ? h.idx > a : false;
        const ref = els[Math.min(h.idx, els.length - 1)];
        const L = S.line;
        L.style.display = 'block';
        if (S.grid) {
          const r = ref.getBoundingClientRect();
          const x = (after || h.idx >= els.length ? r.right + S.gap / 2 : r.left - S.gap / 2) - hostR.left;
          L.className = 'rf-line v';
          Object.assign(L.style, { left: x - 1.5 + 'px', top: r.top - hostR.top + 'px', width: '3px', height: r.height + 'px' });
          return;
        }
        let y;
        let r0 = bodyR;
        if (!ref) y = bodyR.top + 12;
        else {
          const r = ref.getBoundingClientRect();
          r0 = r;
          y = (after || h.idx >= els.length) ? r.bottom + 3 : r.top - 3;
        }
        L.className = 'rf-line h';
        Object.assign(L.style, { left: r0.left - hostR.left + 'px', top: y - hostR.top - 1.5 + 'px', width: r0.width + 'px', height: '3px' });
      }

      function attachNative() {
        let drag = null;
        const root = S.kanban ? S.board : S.host;
        const end = () => {
          if (drag) S.els[drag].classList.remove('dragging');
          drag = null;
          S.line.style.display = 'none';
        };
        for (const id of Object.keys(S.els)) {
          if (isLocked(id)) continue;
          const el = S.els[id];
          el.draggable = true;
          el.addEventListener('dragstart', (e) => {
            takeSnap();
            drag = id;
            e.dataTransfer.setData('text/plain', id);
            e.dataTransfer.effectAllowed = 'move';
            el.classList.add('dragging');
          });
          el.addEventListener('dragend', end);
        }
        root.addEventListener('dragover', (e) => {
          if (!drag) return;
          const h = hit(e.clientX, e.clientY, drag);
          if (!h) { S.line.style.display = 'none'; return; }
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
          showLine(h, drag);
        });
        root.addEventListener('drop', (e) => {
          if (!drag) return;
          const h = hit(e.clientX, e.clientY, drag);
          if (!h) return;
          e.preventDefault();
          const id = drag;
          end();
          moveTo(id, h.gid, h.idx);
        });
        root.addEventListener('dragleave', (e) => {
          if (!root.contains(e.relatedTarget)) S.line.style.display = 'none';
        });
      }

      function attachSortable() {
        if (!window.Sortable) throw new Error('reorder/sortablejs: vendored Sortable is missing');
        const opts = {
          animation: 0, group: 'rf', draggable: '.rf-item', filter: '.locked', preventOnFilter: false,
          ghostClass: 'rf-ghost', chosenClass: 'rf-chosen', emptyInsertThreshold: 30, delay: 0,
          onStart() { takeSnap(); },
          // SortableJS moves the card live; its swap guard ignores events for 30 ms after a move (real time), so a
          // scripted drag can skip positions. The drop is therefore resolved from the drop point alone.
          onEnd(evt) {
            const o = evt.originalEvent;
            const h = o && S.snap ? hit(o.clientX, o.clientY, evt.item.dataset.id) : null;
            arrange(S.snap.orig);
            if (h) moveTo(evt.item.dataset.id, h.gid, h.idx);
          },
        };
        for (const g of Object.keys(S.groups)) window.Sortable.create(S.groups[g], { ...opts });
      }

      // ---- builders

      function tagEl(util, parent, lab) {
        const t = util.el('span', 'rf-tag', parent, lab.tag);
        t.style.setProperty('--tagc', lab.color || '#868e96');
        return t;
      }

      function keyPanel(ctx, parent) {
        const { util, spec } = ctx;
        if (!spec.legend) return null;
        const box = util.el('div', 'rf-key', parent);
        util.el('h4', '', box, spec.legendTitle || 'Key');
        const ol = util.el('ol', '', box);
        for (const l of spec.legend) tagEl(util, util.el('li', '', ol), l);
        return box;
      }

      function makeItem(parent, id, grid, showTag) {
        const { spec } = S;
        const { util } = S.ctx;
        const lab = spec.labels[id];
        const locked = isLocked(id);
        const el = util.el('div', 'rf-item' + (grid ? ' tile' : '') + (locked ? ' locked' : ''), parent);
        el.dataset.role = 'card';
        el.dataset.id = id;
        if (spec.keys && !locked) el.tabIndex = 0;
        if (grid) {
          util.el('span', 'rf-t', el, lab.value || lab.title);
          if (lab.value) util.el('span', 'rf-sub', el, lab.title);
        } else {
          if (locked) util.el('span', 'rf-lock', el).innerHTML = LOCK;
          else util.el('span', 'rf-grip', el, '⋮⋮');
          util.el('span', 'rf-t', el, lab.title);
          if (lab.tag && (showTag || !lab.value)) tagEl(util, el, lab);
          if (lab.value) util.el('span', 'rf-v', el, lab.value);
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
        const host = util.el('div', 'rf-set' + (grid ? ' grid' : ''), wrap);
        host.dataset.group = 'main';
        Object.assign(host.style, { width: cols * w + (cols - 1) * gap + 'px', height: rows * h + (rows - 1) * gap + 'px', fontSize: font + 'px', gap: gap + 'px' });
        if (grid) host.style.gridTemplateColumns = `repeat(${cols}, ${w}px)`;
        S.host = host;
        S.lineHost = host;
        S.groups = { main: host };
        const showTag = rng.bool(0.5);
        for (const id of ctx.model.order) {
          const el = makeItem(host, id, grid, showTag);
          Object.assign(el.style, { width: w + 'px', height: h + 'px' });
        }
        S.line = util.el('div', 'rf-line', host);
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
          S.pane = util.el('div', 'rf-pane', wrap);
          S.pane.style.width = Math.max(2 * (colW + gap), pw) + 'px';
          S.pane.style.height = colH + 'px';
          host = S.pane;
        }
        const board = util.el('div', 'rf-board', host);
        Object.assign(board.style, { width: boardW + 'px', height: colH + 'px', gap: gap + 'px', fontSize: rng.int(14, 15) + 'px' });
        S.board = board;
        S.lineHost = board;
        S.cols = {};
        S.groups = {};
        S.counts = {};
        for (const c of gids) {
          const col = util.el('div', 'rf-col', board);
          col.dataset.role = 'column';
          Object.assign(col.style, { width: colW + 'px', height: colH + 'px' });
          const h = util.el('h3', '', col);
          h.style.height = head + 'px';
          util.el('span', '', h, c === spec.staging ? 'Unassigned' : spec.colLabels[c]);
          S.counts[c] = util.el('small', '', h);
          const body = util.el('div', 'rf-body', col);
          body.dataset.group = c;
          S.cols[c] = col;
          S.groups[c] = body;
        }
        for (const c of gids) {
          for (const id of ctx.model.columns[c]) buildCard(S.groups[c], id);
        }
        arrange(readGroups());
        S.line = util.el('div', 'rf-line', board);
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
        const el = util.el('div', 'rf-item rf-card', parent);
        el.dataset.role = 'card';
        el.dataset.id = id;
        const top = util.el('div', 'rf-ct', el);
        if (lab.who) {
          const av = util.el('span', 'rf-av', top, lab.who);
          av.style.background = AV[(lab.who.charCodeAt(0) + lab.who.charCodeAt(1)) % AV.length];
        }
        util.el('span', 'rf-t', top, lab.title);
        if (lab.value) util.el('span', 'rf-v', top, lab.value);
        for (const line of lab.meta || []) util.el('div', 'rf-m', el, line);
        if (lab.badges && lab.badges.length) {
          const bd = util.el('div', 'rf-bd', el);
          for (const b of lab.badges) util.el('span', '', bd, b.text).style.background = b.color;
        }
        S.els[id] = el;
        return el;
      }

      function bindKeys() {
        const { ctx, spec } = S;
        if (!spec.keys || S.kanban) return;
        const root = S.host;
        root.addEventListener('keydown', (e) => {
          const el = e.target.closest && e.target.closest('.rf-item');
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
          const el = e.target.closest && e.target.closest('.rf-item');
          if (el && ctx.model.focus !== el.dataset.id) ctx.update({ ...ctx.model, focus: el.dataset.id });
        });
        root.addEventListener('focusout', (e) => {
          if (!(e.relatedTarget && root.contains(e.relatedTarget)) && ctx.model.focus) ctx.update({ ...ctx.model, focus: null });
        });
      }

      function render(ctx, engine) {
        ensureStyle();
        S = { ctx, engine, spec: ctx.spec, els: {}, groups: {}, grid: false, kanban: false, pane: null };
        const wrap = ctx.util.el('div', `rf-wrap rf-${engine === 'native' ? 'native' : 'sortable'}`, ctx.stage);
        wrap.style.margin = `${ctx.rng.int(4, 14)}px ${ctx.rng.int(8, 28)}px`;
        if (ctx.spec.scenario === 'kanban') buildKanban(wrap);
        else {
          const keyFirst = ctx.spec.legend && ctx.rng.bool(0.3);
          if (keyFirst) keyPanel(ctx, wrap);
          buildOrdered(wrap);
          if (!keyFirst) keyPanel(ctx, wrap);
        }
        bindKeys();
        if (engine === 'native') attachNative();
        else attachSortable();
        return { anchors: [S.anchor] };
      }

      function locate(t) {
        const r = (id) => S.els[id].getBoundingClientRect();
        if (t.pane !== undefined) {
          const pr = S.pane.getBoundingClientRect();
          return [pr.left + pr.width / 2, pr.top + 20];
        }
        if (t.slot === undefined && t.column === undefined) {
          if (t.item !== undefined) return center(r(t.item));
          throw new Error(`reorder-items/${S.engine} cannot locate ${JSON.stringify(t)}`);
        }
        if (!S.kanban) return center(r(idsOf(S.host)[t.slot]));
        const col = t.column;
        const ids = idsOf(S.groups[col]);
        const same = t.item !== undefined && groupOf(t.item) === col;
        const slot = t.slot === undefined ? ids.length : t.slot;
        if (same) return center(r(ids[Math.min(slot, ids.length - 1)]));
        const body = S.groups[col].getBoundingClientRect();
        if (slot < ids.length) {
          const c = r(ids[slot]);
          return [c.left + c.width / 2, c.top + Math.min(c.height * 0.25, 8)];
        }
        if (!ids.length) return [body.left + body.width / 2, body.top + Math.min(40, body.height / 2)];
        const last = r(ids[ids.length - 1]);
        if (body.bottom - last.bottom > 16) return [body.left + body.width / 2, last.bottom + Math.min(12, (body.bottom - last.bottom) / 2)];
        return [last.left + last.width / 2, last.bottom - Math.min(last.height * 0.25, 8)];
      }

      env.widget({
        task: 'reorder-items', site: 'base', name: 'native', split: 'train',
        scenarios: ['list', 'grid', 'kanban', 'move'],
        traits: { cardMeta: true, wheelPane: true },
        render: (ctx) => render(ctx, 'native'),
        locate,
      });

      env.widget({
        task: 'reorder-items', site: 'base', name: 'sortablejs', split: 'train',
        scenarios: ['list', 'grid', 'kanban', 'move'],
        traits: { cardMeta: true, wheelPane: true },
        uses: [['../vendor/sortablejs-1.15.6/Sortable.min', 'vendor']],
        render: (ctx) => render(ctx, 'sortablejs'),
        locate,
      });
    
    },
  }));
})();
