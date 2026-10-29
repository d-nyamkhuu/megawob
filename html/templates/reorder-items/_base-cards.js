/* reorder-items/_base-cards: reference renderer scope with its original design unit hooks.
 * Registered by reorder-items/base in the original scope order. */
(function () {
  'use strict';
  env.template('reorder-items/_base-cards', () => ({
    register(env, scriptOf, __parts, __has, setScope) {
      'use strict';
      const __scope = {
        get env() { return env; },
        get scriptOf() { return scriptOf; },
        get LOCK_SVG() { return LOCK_SVG; },
        get SHARED_CSS() { return SHARED_CSS; },
        get isLocked() { return isLocked; },
        get CSS() { return CSS; },
        get EDGE_BAND() { return EDGE_BAND; },
        get groupIds() { return groupIds; },
        get board() { return board; }, set board(v) { board = v; },
        get slotEl() { return slotEl; }, set slotEl(v) { slotEl = v; },
        get geo() { return geo; }, set geo(v) { geo = v; },
        get spec() { return spec; }, set spec(v) { spec = v; },
        get sortable() { return sortable; }, set sortable(v) { sortable = v; },
        get paneEl() { return paneEl; }, set paneEl(v) { paneEl = v; },
        get thumbEl() { return thumbEl; }, set thumbEl(v) { thumbEl = v; },
        get barEl() { return barEl; }, set barEl(v) { barEl = v; },
        get paneGeo() { return paneGeo; }, set paneGeo(v) { paneGeo = v; },
        get ensureStyle() { return ensureStyle; },
        get tagEl() { return tagEl; },
        get keyPanel() { return keyPanel; },
        get onOrder() { return onOrder; },
        get mirrorFocus() { return mirrorFocus; },
        get slotPos() { return slotPos; },
        get renderOrdered() { return renderOrdered; },
        get cardPos() { return cardPos; },
        get mirrorPane() { return mirrorPane; },
        get thumbLeft() { return thumbLeft; },
        get renderKanban() { return renderKanban; },
        get bindCardPane() { return bindCardPane; },
        get ctxCenter() { return ctxCenter; },
      };
      for (const k of Object.keys(__parts)) if (k.startsWith('+0.')) {
        let v; let built = false;
        Object.defineProperty(__scope, k.slice(3), {
          get: () => (built ? v : (built = true, v = __parts[k](undefined, __scope))),
          set: (x) => { built = true; v = x; },
        });
      }
      setScope(__scope);
      if (__has('ensureStyle@0')) ensureStyle = __parts['ensureStyle@0'](ensureStyle, __scope);
      if (__has('tagEl@0')) tagEl = __parts['tagEl@0'](tagEl, __scope);
      if (__has('keyPanel@0')) keyPanel = __parts['keyPanel@0'](keyPanel, __scope);
      if (__has('onOrder')) onOrder = __parts['onOrder'](onOrder, __scope);
      if (__has('mirrorFocus')) mirrorFocus = __parts['mirrorFocus'](mirrorFocus, __scope);
      if (__has('slotPos')) slotPos = __parts['slotPos'](slotPos, __scope);
      if (__has('renderOrdered')) renderOrdered = __parts['renderOrdered'](renderOrdered, __scope);
      if (__has('cardPos')) cardPos = __parts['cardPos'](cardPos, __scope);
      if (__has('mirrorPane@0')) mirrorPane = __parts['mirrorPane@0'](mirrorPane, __scope);
      if (__has('thumbLeft')) thumbLeft = __parts['thumbLeft'](thumbLeft, __scope);
      if (__has('bindCardPane')) bindCardPane = __parts['bindCardPane'](bindCardPane, __scope);
      if (__has('renderKanban')) renderKanban = __parts['renderKanban'](renderKanban, __scope);
      if (__has('ctxCenter')) ctxCenter = __parts['ctxCenter'](ctxCenter, __scope);

      const LOCK_SVG = __has('LOCK_SVG@0') ? __parts['LOCK_SVG@0'](undefined, __scope) : (env.templateLib('reorder-items/_shared').LOCK_SVG);

      const SHARED_CSS = __has('SHARED_CSS') ? __parts['SHARED_CSS'](undefined, __scope) : (`
      .ro-tag { flex: none; display: inline-flex; align-items: center; gap: 5px; padding: 2px 8px; border-radius: 999px;
        font-size: 11.5px; font-weight: 700; letter-spacing: .02em; white-space: nowrap;
        background: color-mix(in srgb, var(--tagc) 14%, var(--panel)); color: color-mix(in srgb, var(--tagc) 80%, var(--fg));
        border: 1px solid color-mix(in srgb, var(--tagc) 45%, transparent); }
      .ro-tag::before { content: ''; width: 8px; height: 8px; border-radius: 50%; background: var(--tagc); }
      .ro-key { flex: none; align-self: flex-start; padding: 12px 14px; border: 1px solid var(--line); border-radius: 10px;
        background: var(--panel); font-size: 13px; min-width: 150px; }
      .ro-key h4 { margin: 0 0 8px; font-size: 12px; text-transform: uppercase; letter-spacing: .06em; color: var(--muted); }
      .ro-key ol { margin: 0; padding-left: 20px; display: grid; gap: 6px; }
      .ro-key li .ro-tag { font-size: 12px; }
      .ro-lockic { color: var(--muted); display: inline-flex; }
      .ro-locked { opacity: .82; }
      `);

      function ensureStyle(id, css) {
        if (document.getElementById(id)) return;
        const s = document.createElement('style');
        s.id = id;
        s.textContent = SHARED_CSS + css;
        document.head.append(s);
      }

      function tagEl(util, parent, lab) {
        return env.templateLib('reorder-items/_shared').tagEl(util, parent, lab);
      }

      // The legend (key) for page-grounded rules.
      function keyPanel(ctx, parent) {
        const { util, spec } = ctx;
        if (!spec.legend) return null;
        const box = util.el('div', 'ro-key', parent);
        util.el('h4', '', box, spec.legendTitle || 'Key');
        const ol = util.el('ol', '', box);
        for (const l of spec.legend) tagEl(util, util.el('li', '', ol), l);
        return box;
      }

      const isLocked = __has('isLocked@0') ? __parts['isLocked@0'](undefined, __scope) : { isLocked: (spec, id) => !!(spec.locked && id in spec.locked) }.isLocked;

      // Drop handler shared by both widgets: re-pin locked items, mirror the order.
      function onOrder(ctx, getSortable) {
        return env.templateLib('reorder-items/_shared').onOrder(env, ctx, getSortable);
      }

      // Focus mirror for keyboard episodes.
      function mirrorFocus(ctx, root, idOf) {
        return env.templateLib('reorder-items/_shared').mirrorFocus(ctx, root, idOf);
      }

      // ======================================================================= cards

      const CSS = __has('CSS@0') ? __parts['CSS@0'](undefined, __scope) : (`
      .ro-wrap { display: flex; gap: 22px; align-items: flex-start; flex: none; }
      .ro-board { position: relative; flex: none; }
      .ro-card, .ro-slot { position: absolute; border-radius: 8px; }
      .ro-card {
        display: flex; align-items: center; gap: 10px; padding: 0 12px; box-sizing: border-box;
        border: 1px solid var(--line); background: var(--panel); font-weight: 600; box-shadow: 0 1px 2px rgba(0,0,0,.08);
      }
      .ro-card:focus { outline: 2px solid var(--accent); outline-offset: 1px; }
      .ro-card .ro-h { position: absolute; inset: 0; }
      .ro-card .ro-t { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; position: relative; pointer-events: none; }
      .ro-card .ro-v { flex: none; font-variant-numeric: tabular-nums; color: var(--muted); font-weight: 600; position: relative; pointer-events: none; }
      .ro-card .ro-tag, .ro-card .ro-grip, .ro-card .ro-lockic, .ro-card .ro-av { position: relative; pointer-events: none; }
      .ro-card .ro-t.wrap { white-space: normal; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; line-height: 1.25; }
      .ro-card.tile { flex-direction: column; justify-content: center; gap: 2px; padding: 4px 8px; text-align: center; }
      .ro-card.tile .ro-t { flex: none; width: 100%; }
      .ro-card.tile .ro-sub { width: 100%; font-size: 11px; font-weight: 500; color: var(--muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; pointer-events: none; }
      .ro-card.dragging { z-index: 5; border-color: var(--accent); box-shadow: 0 8px 22px rgba(0,0,0,.25); }
      .ro-grip { color: var(--muted); letter-spacing: -2px; }
      .ro-slot { border: 2px dashed var(--accent); opacity: .6; box-sizing: border-box; }
      .ro-col { position: absolute; border: 1px solid var(--line); border-radius: 10px; background: color-mix(in srgb, var(--panel) 60%, var(--bg)); box-sizing: border-box; }
      .ro-col h3 { margin: 0; padding: 0 12px; font-size: 13px; color: var(--muted); text-transform: uppercase; letter-spacing: .04em;
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: flex; align-items: center; justify-content: space-between; gap: 6px; }
      .ro-col h3 small { font-size: 11px; opacity: .8; }
      .ro-av { flex: none; width: 22px; height: 22px; border-radius: 50%; display: grid; place-items: center; font-size: 10px; font-weight: 700; color: #fff; }
      .ro-pane { position: relative; overflow: hidden; flex: none; }
      .ro-bar { position: relative; height: 12px; margin-top: 6px; border-radius: 6px; background: color-mix(in srgb, var(--line) 70%, transparent); }
      .ro-thumb { position: absolute; top: 1px; height: 10px; border-radius: 5px; background: color-mix(in srgb, var(--muted) 70%, var(--panel)); cursor: grab; }
      .ro-thumb:hover, .ro-thumb.on { background: var(--accent); }
      .ro-hint { font-size: 12px; color: var(--muted); margin-top: 4px; }
      `);

      let board = __has('board') ? __parts['board'](undefined, __scope) : undefined;
      let slotEl = __has('slotEl') ? __parts['slotEl'](undefined, __scope) : undefined;
      let geo = __has('geo') ? __parts['geo'](undefined, __scope) : undefined;
      let spec = __has('spec') ? __parts['spec'](undefined, __scope) : undefined;
      let sortable = __has('sortable@0') ? __parts['sortable@0'](undefined, __scope) : undefined;
      let paneEl = __has('paneEl') ? __parts['paneEl'](undefined, __scope) : undefined;
      let thumbEl = __has('thumbEl') ? __parts['thumbEl'](undefined, __scope) : undefined;
      let barEl = __has('barEl') ? __parts['barEl'](undefined, __scope) : undefined;
      let paneGeo = __has('paneGeo') ? __parts['paneGeo'](undefined, __scope) : undefined;
      const EDGE_BAND = __has('EDGE_BAND') ? __parts['EDGE_BAND'](undefined, __scope) : (36);
      // Kanban groups in board order: the unassigned tray first when the episode has one (spec.staging).
      const groupIds = __has('groupIds') ? __parts['groupIds'](undefined, __scope) : { groupIds: (sp) => (sp.staging ? [sp.staging, ...sp.columns] : sp.columns) }.groupIds;

      // ---- list / move / grid

      function slotPos(i) {
        const col = i % geo.cols;
        const row = Math.floor(i / geo.cols);
        return [col * geo.pitchX, row * geo.pitchY];
      }

      function renderOrdered(ctx, wrap) {
        const { rng, util, size } = ctx;
        const n = spec.items.length;
        const grid = spec.scenario === 'grid';
        const legendW = spec.legend ? 190 : 0;
        const availW = size.width - 60 - legendW;
        const availH = size.height - 36;
        geo = { cols: spec.cols };
        const hasVal = spec.items.some((id) => spec.labels[id].value);
        const longest = Math.max(...spec.items.map((id) => spec.labels[id].title.length + (spec.labels[id].value || '').length * 0.9 + (spec.labels[id].tag ? 10 : 0)));
        if (grid) {
          const rows = Math.ceil(n / spec.cols);
          const gap = rng.int(8, 16);
          const maxH = Math.floor((availH - (rows - 1) * gap) / rows);
          const maxW = Math.floor((availW - (spec.cols - 1) * gap) / spec.cols);
          const wordy = spec.rule.kind !== 'number';
          geo.h = Math.max(40, rng.int(Math.min(56, maxH), Math.min(hasVal ? 92 : 100, maxH)));
          geo.w = Math.min(maxW, wordy ? rng.int(hasVal ? 132 : 112, hasVal ? 170 : 140) : geo.h);
          geo.pitchX = geo.w + gap;
          geo.pitchY = geo.h + gap;
          geo.font = Math.max(13, Math.min(20, Math.floor(geo.h * 0.3)));
        } else {
          const gap = rng.int(5, 10);
          geo.h = Math.max(26, Math.min(rng.int(40, 56), Math.floor(availH / n) - gap));
          geo.pitchX = 0;
          geo.pitchY = geo.h + gap;
          geo.font = Math.max(12, Math.min(17, Math.floor(geo.h * 0.38)));
          const want = Math.round(longest * geo.font * 0.62 + 110);
          geo.w = Math.max(220, Math.min(availW, rng.int(Math.max(260, want), Math.max(280, want + 100)), 640));
        }
        const rows = Math.ceil(n / geo.cols);
        geo.boardW = (geo.cols - 1) * geo.pitchX + geo.w;
        geo.boardH = (rows - 1) * geo.pitchY + geo.h;
        board = util.el('div', 'ro-board', wrap);
        Object.assign(board.style, { width: geo.boardW + 'px', height: geo.boardH + 'px', fontSize: geo.font + 'px' });
        slotEl = util.el('div', 'ro-slot', board);
        Object.assign(slotEl.style, { width: geo.w + 'px', height: geo.h + 'px' });
        const cards = {};
        const showTag = rng.bool(0.5);
        for (const id of ctx.model.order) {
          const lab = spec.labels[id];
          const locked = isLocked(spec, id);
          const card = util.el('div', 'ro-card' + (grid ? ' tile' : '') + (locked ? ' ro-locked' : ''), board);
          card.dataset.role = 'card';
          card.dataset.id = id;
          Object.assign(card.style, { width: geo.w + 'px', height: geo.h + 'px' });
          if (!locked) util.el('div', 'ro-h', card);
          if (grid) {
            util.el('span', 'ro-t', card, lab.value || lab.title);
            if (lab.value) util.el('span', 'ro-sub', card, lab.title);
          } else {
            if (locked) util.el('span', 'ro-lockic', card).innerHTML = LOCK_SVG;
            else util.el('span', 'ro-grip', card, '⋮⋮');
            util.el('span', 'ro-t', card, lab.title);
            if (lab.tag && (showTag || !lab.value)) tagEl(util, card, lab).style.position = 'relative';
            if (lab.value) util.el('span', 'ro-v', card, lab.value);
          }
          if (locked) card.title = 'Pinned';
          cards[id] = card;
        }
        sortable = env.ui.sortable(board, {
          items: cards,
          order: ctx.model.order,
          handle: '.ro-h',
          slotRect: (i) => [...slotPos(i), geo.w, geo.h],
          placeholder: slotEl,
          bounds: 'center',
          activeClass: 'dragging',
          keyboard: !!spec.keys,
          label: 'card',
          onChange: onOrder(ctx, () => sortable),
        });
        if (spec.keys) mirrorFocus(ctx, board, (t) => t.closest && t.closest('.ro-card') && t.closest('.ro-card').dataset.id);
      }

      // ---- kanban

      function cardPos(c, i, n) {
        const room = geo.colH - geo.head - 2 * geo.pad - geo.h;
        const pitch = n > 1 ? Math.min(geo.pitchY, room / (n - 1)) : geo.pitchY;
        return [c * geo.pitchX + geo.pad, geo.head + geo.pad + i * pitch];
      }

      function mirrorPane(ctx) {
        if (!paneEl) return;
        const cols = {};
        groupIds(spec).forEach((c, ci) => { cols[c] = [ci * geo.pitchX, ci * geo.pitchX + geo.colW]; });
        const pane = { scroll: Math.round(paneEl.scrollLeft), width: paneEl.clientWidth, max: paneGeo.max, cols };
        const old = ctx.model.pane;
        if (old && old.scroll === pane.scroll && old.width === pane.width) return;
        if (thumbEl) thumbEl.style.left = thumbLeft(pane.scroll) + 'px';
        ctx.update({ ...ctx.model, pane });
      }

      function thumbLeft(s) {
        return paneGeo.max > 0 ? (s / paneGeo.max) * (paneGeo.trackW - paneGeo.thumbW) : 0;
      }

      function bindCardPane(ctx) {
        if (paneEl) {
          paneEl.addEventListener('wheel', (e) => {
            const unit = e.deltaMode === 1 ? 40 : e.deltaMode === 2 ? paneGeo.width : 1;
            const d = (Math.abs(e.deltaX) >= Math.abs(e.deltaY) ? e.deltaX : e.deltaY) * unit;
            e.preventDefault();
            paneEl.scrollLeft = Math.max(0, Math.min(paneGeo.max, paneEl.scrollLeft + d));
            mirrorPane(ctx);
          }, { passive: false });
          let s0 = 0;
          env.ui.track(thumbEl, {
            start() { s0 = paneEl.scrollLeft; thumbEl.classList.add('on'); },
            move(p) {
              const span = paneGeo.trackW - paneGeo.thumbW;
              paneEl.scrollLeft = Math.max(0, Math.min(paneGeo.max, s0 + (span > 0 ? (p.dx / span) * paneGeo.max : 0)));
              mirrorPane(ctx);
            },
            end() { thumbEl.classList.remove('on'); mirrorPane(ctx); },
          }, 'scrollbar');
          // Clicking the track pages the board (like a native scrollbar).
          barEl.addEventListener('pointerdown', (e) => {
            if (e.target !== barEl || e.button !== 0) return;
            const r = thumbEl.getBoundingClientRect();
            paneEl.scrollLeft = Math.max(0, Math.min(paneGeo.max, paneEl.scrollLeft + (e.clientX < r.left ? -1 : 1) * paneGeo.width * 0.8));
            mirrorPane(ctx);
          });
          mirrorPane(ctx);
        }
      }

      function renderKanban(ctx, wrap) {
        const { rng, util, size } = ctx;
        const n = spec.items.length;
        const gids = groupIds(spec);
        const k = gids.length;
        const barH = spec.pane ? 22 : 0;
        geo = { head: rng.int(34, 42), pad: rng.int(8, 10) };
        const wordy = spec.items.some((id) => spec.labels[id].title.length > 16);
        geo.h = wordy ? rng.int(48, 56) : rng.int(36, 44);
        geo.pitchY = geo.h + rng.int(6, 9);
        const maxColH = size.height - 36 - barH;
        const wantColH = geo.head + 2 * geo.pad + n * geo.pitchY;
        geo.colH = Math.min(maxColH, wantColH);
        if (spec.pane) {
          geo.w = rng.int(180, 220);
        } else {
          const maxW = Math.floor((size.width - 70) / k) - 56;
          geo.w = Math.min(maxW, rng.int(Math.min(190, maxW), Math.max(170, Math.min(250, maxW))));
        }
        geo.colW = geo.w + 2 * geo.pad;
        geo.pitchX = geo.colW + (spec.pane ? rng.int(12, 20) : rng.int(16, 36));
        const boardW = (k - 1) * geo.pitchX + geo.colW;
        let host = wrap;
        if (spec.pane) {
          const box = util.el('div', '', wrap);
          paneEl = util.el('div', 'ro-pane', box);
          // Show 2.2 - 3.4 columns, never more than the stage allows, never the whole board.
          const shown = rng.float(2.2, 3.4);
          const pw = Math.floor(Math.min(size.width - 64, shown * geo.pitchX, boardW - 40));
          paneGeo = { width: Math.max(2 * geo.pitchX + 10, pw) };
          paneGeo.width = Math.min(paneGeo.width, size.width - 64);
          Object.assign(paneEl.style, { width: paneGeo.width + 'px', height: geo.colH + 'px' });
          paneGeo.max = Math.max(0, boardW - paneGeo.width);
          barEl = util.el('div', 'ro-bar', box);
          barEl.style.width = paneGeo.width + 'px';
          paneGeo.trackW = paneGeo.width;
          paneGeo.thumbW = Math.max(40, Math.round((paneGeo.width / boardW) * paneGeo.trackW));
          thumbEl = util.el('div', 'ro-thumb', barEl);
          thumbEl.dataset.role = 'scrollbar';
          thumbEl.style.width = paneGeo.thumbW + 'px';
          host = paneEl;
        } else {
          paneEl = null;
          thumbEl = null;
        }
        board = util.el('div', 'ro-board', host);
        Object.assign(board.style, { width: boardW + 'px', height: geo.colH + 'px', fontSize: rng.int(14, 16) + 'px' });
        const cols = {};
        const counts = {};
        gids.forEach((c, ci) => {
          const col = util.el('div', 'ro-col', board);
          col.dataset.role = 'column';
          Object.assign(col.style, { left: ci * geo.pitchX + 'px', top: 0, width: geo.colW + 'px', height: geo.colH + 'px' });
          const h = util.el('h3', '', col);
          h.style.height = geo.head + 'px';
          util.el('span', '', h, c === spec.staging ? 'Unassigned' : spec.colLabels[c]);
          counts[c] = util.el('small', '', h);
          cols[c] = col;
        });
        const showCounts = () => { for (const c of gids) counts[c].textContent = String((ctx.model.columns[c] || []).length); };
        showCounts();
        slotEl = util.el('div', 'ro-slot', board);
        Object.assign(slotEl.style, { width: geo.w + 'px', height: geo.h + 'px' });
        const cards = {};
        const avatars = rng.bool(0.5);
        const AV = ['#e8590c', '#1c7ed6', '#2f9e44', '#7048e8', '#d6336c', '#0c8599'];
        for (const id of spec.items) {
          const lab = spec.labels[id];
          const card = util.el('div', 'ro-card', board);
          card.dataset.role = 'card';
          Object.assign(card.style, { width: geo.w + 'px', height: geo.h + 'px', padding: '0 10px', gap: '8px' });
          util.el('div', 'ro-h', card);
          if (avatars) {
            const p = ctx.content.personName ? ctx.content.personName(rng, { csplit: spec.csplit }) : { first: 'A', last: 'B' };
            const av = util.el('span', 'ro-av', card, (p.first[0] + p.last[0]).toUpperCase());
            av.style.background = rng.pick(AV);
          }
          const t = util.el('span', 'ro-t' + (wordy ? ' wrap' : ''), card, lab.title);
          if (wordy) t.style.fontSize = '13px';
          if (lab.value) {
            const v = util.el('span', 'ro-v', card, lab.value);
            v.style.fontSize = '12px';
          }
          cards[id] = card;
        }
        let dragScrollStart = 0;
        const dragScrollDelta = () => paneEl ? paneEl.scrollLeft - dragScrollStart : 0;
        sortable = env.ui.sortable(board, {
          items: cards,
          handle: '.ro-h',
          groups: ctx.model.columns,
          groupOrder: gids,
          groupEls: cols,
          slotRect: (i, c, nn) => [...cardPos(gids.indexOf(c), i, nn), geo.w, geo.h],
          placeholder: slotEl,
          activeClass: 'dragging',
          label: 'card',
          onStart() { dragScrollStart = paneEl ? paneEl.scrollLeft : 0; },
          // The primitive's drag rect is relative to the board at press time. Compensate for a pane pan
          // so the held card stays under the pointer and hit-testing still uses current board coordinates.
          place(el, rect, info) {
            if (info.dragging && paneEl) {
              const br = board.getBoundingClientRect();
              const pr = paneEl.getBoundingClientRect();
              const x = br.left + rect.x + rect.w / 2 + dragScrollDelta() - pr.left;
              if (x > paneEl.clientWidth - EDGE_BAND) {
                const fraction = Math.min(1, (x - paneEl.clientWidth + EDGE_BAND) / EDGE_BAND);
                paneEl.scrollLeft = Math.max(paneEl.scrollLeft, dragScrollStart + fraction * (paneGeo.max - dragScrollStart));
              } else if (x < EDGE_BAND) {
                const fraction = Math.min(1, (EDGE_BAND - x) / EDGE_BAND);
                paneEl.scrollLeft = Math.min(paneEl.scrollLeft, dragScrollStart * (1 - fraction));
              }
              mirrorPane(ctx);
              rect = { ...rect, x: rect.x + dragScrollDelta() };
            }
            env.ui.sortable.defaultPlace(el, rect, info);
          },
          groupAt(c) {
            const x = c[0] + dragScrollDelta();
            return gids.reduce((best, col, i) => {
              const near = Math.max(i * geo.pitchX - x, x - (i * geo.pitchX + geo.colW), 0);
              return !best || near < best.distance ? { col, distance: near } : best;
            }, null).col;
          },
          dropRule(c, slots) {
            const x = c[0] + dragScrollDelta();
            let best = 0;
            let distance = Infinity;
            slots.forEach((r, i) => {
              const d = Math.hypot(r.x + r.w / 2 - x, r.y + r.h / 2 - c[1]);
              if (d < distance) { distance = d; best = i; }
            });
            return best;
          },
          onChange: (columns) => {
            ctx.update({ ...ctx.model, columns });
            showCounts();
          },
        });

        bindCardPane(ctx);
      }

      env.widget({
        task: 'reorder-items',
        site: 'base',
        name: 'cards',
        split: 'train',
        scenarios: ['list', 'grid', 'kanban', 'move'],
        traits: { dragScroll: true },

        render(ctx) {
          ensureStyle('ro-style', CSS);
          spec = ctx.spec;
          paneEl = null;
          thumbEl = null;
          const wrap = ctx.util.el('div', 'ro-wrap', ctx.stage);
          // Sampled offset inside the stage (the site also samples the stage alignment).
          wrap.style.margin = `${ctx.rng.int(4, 14)}px ${ctx.rng.int(8, 28)}px`;
          if (spec.scenario === 'kanban') renderKanban(ctx, wrap);
          else {
            if (spec.legend && ctx.rng.bool(0.3)) {
              keyPanel(ctx, wrap);
              renderOrdered(ctx, wrap);
            } else {
              renderOrdered(ctx, wrap);
              keyPanel(ctx, wrap);
            }
          }
          return { anchors: [paneEl ? paneEl.parentElement : board] };
        },

        locate(t) {
          if (t.edge !== undefined) {
            const r = paneEl.getBoundingClientRect();
            const scroll = paneEl.scrollLeft;
            const span = t.edge > 0 ? paneGeo.max - scroll : scroll;
            const fraction = span > 0 ? Math.min(1, Math.abs(t.scrollAt - scroll) / span) : 0;
            const x = t.edge > 0 ? r.right - EDGE_BAND * (1 - fraction) : r.left + EDGE_BAND * (1 - fraction);
            return [x, sortable.locate(t.item)[1]];
          }
          if (t.pane !== undefined) {
            const r = paneEl.getBoundingClientRect();
            return [r.left + r.width / 2, r.top + Math.min(20, geo.head / 2)];
          }
          if (t.thumb !== undefined) return ctxCenter(thumbEl);
          if (t.thumbAt !== undefined) {
            const r = barEl.getBoundingClientRect();
            const s = Math.max(0, Math.min(paneGeo.max, t.thumbAt));
            const t0 = thumbEl.getBoundingClientRect();
            // Where the thumb center must go (the press is at the thumb center).
            return [r.left + thumbLeft(s) + paneGeo.thumbW / 2, t0.top + t0.height / 2];
          }
          if (t.column !== undefined) {
            const p = t.slot !== undefined ? sortable.locateSlot(t.slot, t.column, t.item) : sortable.locateGroupEnd(t.column, t.item);
            if (t.scrollAt !== undefined) p[0] += paneEl.scrollLeft - t.scrollAt;
            return p;
          }
          if (t.slot !== undefined) return sortable.locateSlot(t.slot);
          if (t.item !== undefined) return sortable.locate(t.item);
          throw new Error(`reorder-items/cards cannot locate ${JSON.stringify(t)}`);
        },
      });

      function ctxCenter(el) {
        const r = el.getBoundingClientRect();
        return [r.left + r.width / 2, r.top + r.height / 2];
      }
    
    },
  }), { uses: ['reorder-items/_shared'] });
})();
