/* resize-element/_base-panel: the reference panel scope and its replaceable units.
 * Called once by resize-element/base, in the original registration order; event targets, attachment order and capture flags are preserved.
 * New units: panelContents(ctx, geometry) -> { box, readout };
 * windowContents(ctx, geometry) -> { frame, readout, lock }. Both retain the reference scope hooks.
 */
(function () {
  'use strict';
  env.template('resize-element/_base-panel', () => ({
    register({ env, scriptOf, __parts, __has, setScope }) {
      const __scope = {
        get env() { return env; },
        get scriptOf() { return scriptOf; },
        get CSS() { return CSS; },
        get POINTS() { return POINTS; },
        get KEYS() { return KEYS; },
        get movesX() { return movesX; },
        get movesY() { return movesY; },
        get side() { return side; },
        get ensureStyle() { return ensureStyle; },
        get LOCK_ICON() { return LOCK_ICON; },
        get MENUS() { return MENUS; },
        get TILE_COLORS() { return TILE_COLORS; },
        get view() { return view; }, set view(v) { view = v; },
        get hooked() { return hooked; }, set hooked(v) { hooked = v; },
        get wview() { return wview; }, set wview(v) { wview = v; },
        get placeIn() { return placeIn; },
        get lockButton() { return lockButton; },
        get aspectLock() { return aspectLock; },
        get keyboard() { return keyboard; },
        get lorem() { return lorem; },
        get panelContents() { return panelContents; },
        get renderPanel() { return renderPanel; },
        get renderTextarea() { return renderTextarea; },
        get renderColumn() { return renderColumn; },
        get renderSplit() { return renderSplit; },
        get windowContents() { return windowContents; },
        get renderWindow() { return renderWindow; },
      };
      for (const k of Object.keys(__parts)) if (k.startsWith('+0.')) {
        let v; let built = false;
        Object.defineProperty(__scope, k.slice(3), {
          get: () => (built ? v : (built = true, v = __parts[k](undefined, __scope))),
          set: (x) => { built = true; v = x; },
        });
      }
      setScope(__scope);
      if (__has('placeIn')) placeIn = __parts['placeIn'](placeIn, __scope);
      if (__has('lockButton')) lockButton = __parts['lockButton'](lockButton, __scope);
      if (__has('aspectLock')) aspectLock = __parts['aspectLock'](aspectLock, __scope);
      if (__has('keyboard')) keyboard = __parts['keyboard'](keyboard, __scope);
      if (__has('lorem')) lorem = __parts['lorem'](lorem, __scope);
      if (__has('panelContents')) panelContents = __parts['panelContents'](panelContents, __scope);
      if (__has('renderPanel')) renderPanel = __parts['renderPanel'](renderPanel, __scope);
      if (__has('renderTextarea')) renderTextarea = __parts['renderTextarea'](renderTextarea, __scope);
      if (__has('renderColumn')) renderColumn = __parts['renderColumn'](renderColumn, __scope);
      if (__has('renderSplit')) renderSplit = __parts['renderSplit'](renderSplit, __scope);
      if (__has('windowContents')) windowContents = __parts['windowContents'](windowContents, __scope);
      if (__has('renderWindow')) renderWindow = __parts['renderWindow'](renderWindow, __scope);

      const CSS = __has('CSS@0') ? __parts['CSS@0'](undefined, __scope) : (env.templateLib('resize-element/_styles').REFERENCE_CSS);

      const POINTS = __has('POINTS@0') ? __parts['POINTS@0'](undefined, __scope) : ({ nw: [0, 0], n: [0.5, 0], ne: [1, 0], e: [1, 0.5], se: [1, 1], s: [0.5, 1], sw: [0, 1], w: [0, 0.5] });
      const KEYS = __has('KEYS@0') ? __parts['KEYS@0'](undefined, __scope) : (new Set(['ArrowRight', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'Home', 'End']));
      const movesX = __has('movesX@0') ? __parts['movesX@0'](undefined, __scope) : { movesX: (g) => /[ew]/.test(g) }.movesX;
      const movesY = __has('movesY@0') ? __parts['movesY@0'](undefined, __scope) : { movesY: (g) => /[ns]/.test(g) }.movesY;
      const side = __has('side@0') ? __parts['side@0'](undefined, __scope) : { side: (g, axis) => (axis === 'x' ? (g.includes('e') ? 1 : g.includes('w') ? 0 : null) : (g.includes('s') ? 1 : g.includes('n') ? 0 : null)) }.side;

      let view = __has('view@0') ? __parts['view@0'](undefined, __scope) : undefined;
      let hooked = __has('hooked') ? __parts['hooked'](undefined, __scope) : (false);

      const ensureStyle = __has('ensureStyle@0') ? __parts['ensureStyle@0'](undefined, __scope) : { ensureStyle: () => env.util.css('rz-style', CSS) }.ensureStyle;

      function placeIn(ctx, el, rng, pad = 12) {
        const W = ctx.size.width;
        const H = ctx.size.height;
        const w = el.offsetWidth;
        const h = el.offsetHeight;
        const freeX = Math.max(0, W - w - 2 * pad);
        const freeY = Math.max(0, H - h - 2 * pad);
        const c01 = (f) => Math.min(1, Math.max(0, f));
        const fx = c01(rng.pick([0, 0.5, 0.5, 1]) + rng.float(-0.15, 0.15));
        const fy = c01(rng.pick([0, 0.5, 0.5, 1]) + rng.float(-0.15, 0.15));
        const st = ctx.stage.getBoundingClientRect();
        const fixed = [...document.querySelectorAll('[data-role="submit"]')]
          .filter((b) => getComputedStyle(b).position === 'fixed').map((b) => b.getBoundingClientRect());
        const hits = (x, y) => fixed.some((r) => st.left + x < r.right + 6 && st.left + x + w > r.left - 6 && st.top + y < r.bottom + 6 && st.top + y + h > r.top - 6);
        let [x, y] = [pad + fx * freeX, pad + fy * freeY];
        for (const [ax, ay] of [[fx, fy], [fx, 0], [0, fy], [0, 0], [1, 0], [0, 1], [0.5, 0]]) {
          if (!hits(pad + ax * freeX, pad + ay * freeY)) {
            [x, y] = [pad + ax * freeX, pad + ay * freeY];
            break;
          }
        }
        el.style.left = Math.round(x) + 'px';
        el.style.top = Math.round(y) + 'px';
      }

      const LOCK_ICON = __has('LOCK_ICON@0') ? __parts['LOCK_ICON@0'](undefined, __scope) : ('<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">'
        + '<path d="M6.5 9.5l3-3"/><path d="M7.5 4.5l1.2-1.2a2.6 2.6 0 0 1 3.7 3.7L11.2 8.2"/><path d="M8.5 11.5l-1.2 1.2a2.6 2.6 0 0 1-3.7-3.7L4.8 7.8"/></svg>');

      // The aspect-lock toggle (a button showing model.lock as aria-pressed).
      function lockButton(ctx, parent, text) {
        const b = ctx.util.el('button', 'rz-lock', parent);
        b.type = 'button';
        b.dataset.role = 'lock';
        b.title = 'Keep proportions';
        b.setAttribute('aria-label', 'Keep proportions');
        b.innerHTML = LOCK_ICON + (text ? `<span>${text}</span>` : '');
        b.setAttribute('aria-pressed', String(!!ctx.model.lock));
        return b;
      }

      // Lock toggle + Shift: a drag keeps the ratio when the lock is on or Shift is held at the press
      // (env.ui.resizable reads opts.aspect live, so it is set in the capture phase before the handle's press).
      function aspectLock(ctx, root, rzOpts, btn) {
        root.addEventListener('pointerdown', (e) => { rzOpts.aspect = ctx.model.lock || e.shiftKey ? true : null; }, true);
        btn.addEventListener('pointerdown', (e) => e.stopPropagation());
        btn.addEventListener('click', () => {
          const lock = !ctx.model.lock;
          btn.setAttribute('aria-pressed', String(lock));
          env.log('lock', { on: lock });
          ctx.update({ ...ctx.model, lock });
        });
      }

      // Focusable control whose keys go through taskDef.helpers.keyApply; focus mirrored into model.focus.
      function keyboard(ctx, el, apply) {
        if (!ctx.spec.keys) return;
        el.tabIndex = 0;
        el.addEventListener('pointerdown', () => el.focus({ preventScroll: true }));
        el.addEventListener('keydown', (e) => {
          if (!KEYS.has(e.key)) return;
          e.preventDefault();
          const m = env.taskDef.helpers.keyApply(ctx.spec, ctx.model, e.key, e.shiftKey);
          if (m !== ctx.model) apply(m);
        });
        el.addEventListener('focus', () => {
          el.classList.add('focused');
          if (!ctx.model.focus) ctx.update({ ...ctx.model, focus: true });
        });
        el.addEventListener('blur', () => {
          el.classList.remove('focused');
          if (ctx.model.focus) ctx.update({ ...ctx.model, focus: false });
        });
      }

      function lorem(ctx, rng, n) {
        const C = ctx.content || {};
        const out = [];
        for (let i = 0; i < n; i++) {
          out.push(Array.isArray(C.SENTENCES) && C.SENTENCES.length ? (C.pick ? C.pick(rng, C.SENTENCES, { csplit: ctx.spec.csplit }) : rng.pick(C.SENTENCES))
            : 'Remember to update the release checklist before Friday.');
        }
        return out;
      }

      // ------------------------------------------------------------------ panel (numeric, ghost, relative)

      function panelContents(ctx, { fam, area, ax, ay, o, W, H, lim, ruler, rectOf }) {
        const { spec, rng, util } = ctx;
        const box = util.el('div', 'rz-box', area);
        box.dataset.role = 'panel';
        Object.assign(box.style, ax ? { right: o.x - 1 + 'px' } : { left: o.x + 'px' }, ay ? { bottom: o.y - 1 + 'px' } : { top: o.y + 'px' });
        const title = util.el('div', 'rz-title', box);
        const dots = util.el('span', 'rz-dots', title);
        for (let i = 0; i < 3; i++) util.el('i', '', dots);
        util.el('span', '', title, spec.title);
        const body = util.el('div', 'rz-body', box);
        for (let i = 0, n = rng.int(6, 30); i < n; i++) util.el('div', 'rz-line', body).style.width = rng.int(30, 95) + '%';
        const readout = util.el('div', 'rz-readout', box);
        readout.dataset.role = 'readout';
        readout.style[spec.grip.includes('w') ? 'right' : 'left'] = '10px';
        readout.hidden = !spec.readout;

        if (spec.scenario === 'ghost') {
          const ghost = util.el('div', 'rz-ghost', area);
          ghost.dataset.role = 'target';
          const r = rectOf(spec.target);
          Object.assign(ghost.style, { left: r.x + 'px', top: r.y + 'px', width: spec.target.w + 'px', height: spec.target.h + 'px' });
        }
        if (ruler) {
          // Px rulers measured from the fixed edges, along the top/bottom and left/right margins.
          const top = util.el('div', 'rz-ruler', area);
          Object.assign(top.style, { left: 0, right: 0, height: '16px' }, ay ? { bottom: o.y - 22 + 'px' } : { top: o.y - 20 + 'px' });
          for (let d = 0; d <= lim.max.w; d += fam.helpers.rulerStep) {
            const x = ax ? W - o.x - d : o.x + d;
            const i = util.el('i', '', top);
            Object.assign(i.style, { left: x + 'px', width: '1px', height: d % 100 ? '4px' : '7px' }, ay ? { top: 0 } : { bottom: 0 });
            if (d % 100 === 0) {
              const b = util.el('b', '', top, String(d));
              Object.assign(b.style, { left: x + 3 + 'px' }, ay ? { top: '4px' } : { bottom: '5px' });
            }
          }
          const left = util.el('div', 'rz-ruler', area);
          Object.assign(left.style, { top: 0, bottom: 0, width: o.x - 4 + 'px' }, ax ? { right: 0 } : { left: 0 });
          for (let d = 0; d <= lim.max.h; d += fam.helpers.rulerStep) {
            const y = ay ? H - o.y - d : o.y + d;
            const i = util.el('i', '', left);
            Object.assign(i.style, { top: y + 'px', height: '1px', width: d % 100 ? '4px' : '7px' }, ax ? { left: 0 } : { right: 0 });
            if (d % 100 === 0) {
              const b = util.el('b', '', left, String(d));
              Object.assign(b.style, { top: y + 1 + 'px' }, ax ? { left: '2px' } : { right: '2px' });
            }
          }
        }

        return { box, readout };
      }

      function renderPanel(ctx) {
        const { spec, rng, util, size: stage } = ctx;
        const fam = env.taskDef;
        const A = spec.anchor;
        const ax = side(A, 'x') ?? 0;
        const ay = side(A, 'y') ?? 0;
        const ruler = !spec.readout && spec.scenario !== 'ghost';
        const pad = 18;
        const margin = 12;
        const o = { x: rng.int(ruler ? 34 : 18, 56), y: rng.int(ruler ? 26 : 18, 40) };
        const ref = spec.goal.kind === 'ref' ? spec.goal.ref : null;
        const refW = ref && ref.dim === 'h' ? rng.int(110, 150) : 0;
        const refH = ref && ref.dim === 'w' ? rng.int(38, 50) : 0;
        const toolH = spec.scenario === 'aspect' ? 30 : 0;
        const lim = {
          min: { ...spec.min },
          max: {
            w: Math.min(spec.max.w, Math.floor(stage.width - 2 * margin - o.x - pad - (refW ? refW + 12 : 0))),
            h: Math.min(spec.max.h, Math.floor(stage.height - 2 * margin - o.y - pad - (refH ? refH + 12 : 0) - (toolH ? toolH + 12 : 0))),
          },
        };
        const W = o.x + lim.max.w + pad;
        const H = o.y + lim.max.h + pad;
        const wrap = util.el('div', 'rz-wrap' + (refH || toolH ? ' col' : ''), ctx.stage);
        // aspect: a toolbar above the workspace with the lock toggle (never covered by the panel).
        let lock = null;
        if (toolH) {
          const tools = util.el('div', 'rz-tools', wrap);
          tools.style.height = toolH + 'px';
          util.el('span', '', tools, `${spec.title}`);
          lock = lockButton(ctx, tools, rng.pick(['Keep proportions', 'Lock ratio', 'Constrain proportions']));
        }
        const area = util.el('div', 'rz-area', wrap);
        area.dataset.role = 'workspace';
        Object.assign(area.style, { width: W + 'px', height: H + 'px' });
        let refEl = null;
        if (ref) {
          refEl = util.el('div', 'rz-ref', null, ref.name);
          refEl.dataset.role = 'reference';
          if (ref.dim === 'w') {
            Object.assign(refEl.style, { width: ref.size + 'px', height: refH + 'px', marginLeft: (ax ? W - o.x - ref.size : o.x) + 1 + 'px' });
          } else {
            Object.assign(refEl.style, { width: refW + 'px', height: ref.size + 'px', marginTop: (ay ? H - o.y - ref.size : o.y) + 1 + 'px', writingMode: 'vertical-rl' });
          }
          if (rng.bool(0.5)) wrap.prepend(refEl);
          else wrap.append(refEl);
        }

        // Panel rect inside the area for a size (the anchored corner stays put).
        const rectOf = (s) => ({ x: ax ? W - o.x - s.w : o.x, y: ay ? H - o.y - s.h : o.y, w: s.w, h: s.h });
        const { box, readout } = panelContents(ctx, { fam, area, ax, ay, o, W, H, lim, ruler, rectOf });

        // Handles: the grip, and on some seeds every other handle that keeps the same corner fixed.
        const valid = Object.keys(POINTS).filter((h) => (!movesX(h) || side(h, 'x') !== ax) && (!movesY(h) || side(h, 'y') !== ay));
        let names = rng.bool(0.5) ? [spec.grip] : [...new Set([spec.grip, ...valid])];
        if (spec.corner && !names.includes(spec.corner)) names = [...names, spec.corner];
        const handles = {};
        for (const name of names) {
          const cls = movesX(name) && movesY(name) ? 'c ' + (name === 'se' || name === 'nw' ? 'nwse' : 'nesw') : movesX(name) ? 'x' : 'y';
          const h = util.el('div', 'rz-handle ' + cls, area);
          h.dataset.role = 'handle-' + name;
          handles[name] = h;
        }
        const draw = (s) => {
          Object.assign(box.style, { width: s.w + 'px', height: s.h + 'px' });
          const r = rectOf(s);
          for (const [name, h] of Object.entries(handles)) {
            const [fx, fy] = POINTS[name];
            Object.assign(h.style, { left: r.x + fx * r.w + 'px', top: r.y + fy * r.h + 'px' });
          }
          readout.textContent = `${s.w} × ${s.h}`;
        };
        const rzOpts = {
          handles,
          size: { w: ctx.model.w, h: ctx.model.h },
          anchor: A,
          min: lim.min,
          max: lim.max,
          aspect: null,
          place: (el, r) => draw(r),
          onStart: (s, name) => handles[name].classList.add('active'),
          onInput: (s) => ctx.update({ ...ctx.model, ...s }),
          onChange: (s, name) => {
            handles[name].classList.remove('active');
            ctx.update({ ...ctx.model, ...s });
          },
        };
        if (lock) aspectLock(ctx, area, rzOpts, lock);
        const rz = env.ui.resizable(box, rzOpts);
        const clampS = (m) => ({ w: Math.max(lim.min.w, Math.min(lim.max.w, m.w)), h: Math.max(lim.min.h, Math.min(lim.max.h, m.h)) });
        keyboard(ctx, handles[spec.grip], (m) => {
          const s = clampS(m);
          rz.set(s);
          ctx.update({ ...ctx.model, ...s });
        });
        placeIn(ctx, wrap, rng);
        return {
          anchors: [area, ...(refEl ? [refEl] : []), ...(lock ? [lock] : [])],
          sync: (m) => {
            rz.set({ w: m.w, h: m.h });
            if (lock) lock.setAttribute('aria-pressed', String(!!m.lock));
          },
          locate(t) {
            if (t.lock) return ctx.util.center(lock);
            if (t.handle === undefined) throw new Error(`resize-element/panel cannot locate ${JSON.stringify(t)}`);
            return rz.locateHandle(handles[t.handle] ? t.handle : spec.grip, t.size);
          },
        };
      }

      // ------------------------------------------------------------------ native textarea

      function renderTextarea(ctx) {
        const { spec, rng, util } = ctx;
        const card = util.el('div', 'rzt-card', ctx.stage);
        card.dataset.role = 'form';
        const cw = 18 * 2 + spec.max.w + 8;
        const chh = 42 + spec.max.h + 18;
        Object.assign(card.style, { width: cw + 'px', height: chh + 'px' });
        util.el('div', 'rzt-label', card, spec.title);
        const hint = util.el('div', 'rzt-hint', card);
        hint.dataset.role = 'readout';
        if (spec.outline) {
          const g = util.el('div', 'rzt-ghost', card);
          g.dataset.role = 'target';
          Object.assign(g.style, { width: spec.target.w + 'px', height: spec.target.h + 'px' });
        }
        const ta = util.el('textarea', 'rzt-ta', card);
        ta.dataset.role = 'textarea';
        ta.spellcheck = false;
        ta.value = lorem(ctx, rng, rng.int(2, 5)).join(' ');
        ta.style.resize = spec.axes === 'both' ? 'both' : spec.axes === 'w' ? 'horizontal' : 'vertical';
        Object.assign(ta.style, {
          minWidth: spec.min.w + 'px', minHeight: spec.min.h + 'px', maxWidth: spec.max.w + 'px', maxHeight: spec.max.h + 'px',
        });
        const paint = (m) => {
          Object.assign(ta.style, { width: m.w + 'px', height: m.h + 'px' });
          hint.textContent = spec.readout ? `${m.w} × ${m.h} px` : '';
        };
        paint(ctx.model);
        // The browser resizes the element itself: read its rendered size after pointer moves and releases.
        const read = () => {
          const w = Math.round(ta.offsetWidth);
          const h = Math.round(ta.offsetHeight);
          if (w !== ctx.model.w || h !== ctx.model.h) {
            hint.textContent = spec.readout ? `${w} × ${h} px` : '';
            ctx.update({ ...ctx.model, w, h });
          }
        };
        if (!hooked) {
          hooked = true;
          for (const type of ['pointermove', 'pointerup', 'mouseup']) document.addEventListener(type, () => { if (view && view.read) view.read(); });
        }
        if (window.ResizeObserver) new ResizeObserver(() => { if (view && view.ta === ta) read(); }).observe(ta);
        placeIn(ctx, card, rng);
        return {
          ta,
          read,
          anchors: [card],
          sync: (m) => paint(m),
          locate(t) {
            const r = ta.getBoundingClientRect();
            const p = [r.right - 4, r.bottom - 4];
            if (!t.size) return p;
            return [p[0] + (t.size.w - ta.offsetWidth), p[1] + (t.size.h - ta.offsetHeight)];
          },
        };
      }

      // ------------------------------------------------------------------ table columns

      function renderColumn(ctx) {
        const { spec, rng, util } = ctx;
        const box = util.el('div', 'rzc-box', ctx.stage);
        box.dataset.role = 'table';
        const rowH = 33;
        const BW = spec.budget + 30;
        const BH = 34 + (spec.readout ? 0 : 20) + 36 + spec.rows.length * rowH + (spec.readout ? 34 : 14);
        Object.assign(box.style, { width: BW + 'px', height: BH + 'px' });
        util.el('div', 'rzc-title', box, rng.pick(['Customers', 'Contacts', 'Orders', 'Team members', 'Accounts', 'Leads', 'Vendors', 'Invoices']));
        if (!spec.readout) {
          const ruler = util.el('div', 'rzc-ruler rz-ruler', box);
          ruler.style.position = 'relative';
          for (let d = 0; d <= spec.budget; d += 50) {
            const i = util.el('i', '', ruler);
            Object.assign(i.style, { left: d + 'px', bottom: 0, width: '1px', height: d % 100 ? '4px' : '7px' });
            if (d % 100 === 0) Object.assign(util.el('b', '', ruler, String(d)).style, { left: d + 3 + 'px', bottom: '3px' });
          }
        }
        const table = util.el('table', 'rzc-table', box);
        const colgroup = util.el('colgroup', '', table);
        const cols = spec.columns.map(() => util.el('col', '', colgroup));
        const head = util.el('tr', '', util.el('thead', '', table));
        const grips = [];
        const ths = spec.columns.map((c, i) => {
          const th = util.el('th', '', head);
          util.el('span', '', th, c.name);
          const g = util.el('div', 'rzc-grip', th);
          g.dataset.role = 'col-grip';
          grips.push(g);
          return th;
        });
        const tb = util.el('tbody', '', table);
        for (const row of spec.rows) {
          const tr = util.el('tr', '', tb);
          for (const cell of row) util.el('td', '', tr, cell);
        }
        const bar = spec.readout ? util.el('div', 'rzc-bar', box) : null;
        if (bar) bar.dataset.role = 'readout';
        const paint = (m) => {
          m.cols.forEach((w, i) => { cols[i].style.width = w + 'px'; });
          table.style.width = m.cols.reduce((a, b) => a + b, 0) + 'px';
          if (bar) bar.textContent = 'Column widths: ' + spec.columns.map((c, i) => `${c.name} ${m.cols[i]} px`).join(' · ');
        };
        paint(ctx.model);
        grips.forEach((g, i) => {
          let w0;
          util.drag(g, {
            start() { w0 = ctx.model.cols[i]; g.classList.add('active'); },
            move(e, dx) {
              const others = ctx.model.cols.reduce((a, w, k) => a + (k === i ? 0 : w), 0);
              const w = Math.round(Math.max(spec.min, Math.min(spec.budget - others, w0 + dx)));
              if (w === ctx.model.cols[i]) return;
              const next = ctx.model.cols.slice();
              next[i] = w;
              ctx.update({ ...ctx.model, cols: next });
              paint(ctx.model);
            },
            end() { g.classList.remove('active'); },
          }, 'col-grip');
        });
        // The border point of column i (header row, vertical middle).
        const edge = (i) => {
          const r = ths[i].getBoundingClientRect();
          return [r.right, r.top + r.height / 2];
        };
        placeIn(ctx, box, rng);
        return {
          anchors: [box],
          sync: (m) => paint(m),
          locate(t) {
            const p = edge(t.col);
            if (t.width === undefined) return p;
            return [p[0] + (t.width - ctx.model.cols[t.col]), p[1]];
          },
        };
      }

      // ------------------------------------------------------------------ split panes

      function renderSplit(ctx) {
        const { spec, rng, util } = ctx;
        const v = spec.orient === 'v';
        const box = util.el('div', 'rzs-box', ctx.stage);
        box.dataset.role = 'split';
        Object.assign(box.style, v ? { width: spec.total + 'px', height: spec.cross + 'px' } : { width: spec.cross + 'px', height: spec.total + 'px' });
        const C = ctx.content || {};
        const items = (k) => {
          const out = [];
          for (let i = 0; i < 14; i++) {
            if (k === 0 && C.fileName) out.push(C.fileName(rng));
            else if (Array.isArray(C.EMAIL_SUBJECTS) && C.EMAIL_SUBJECTS.length) out.push(rng.pick(C.EMAIL_SUBJECTS));
            else out.push(lorem(ctx, rng, 1)[0]);
          }
          return out;
        };
        const panes = spec.panes.map((name, k) => {
          const p = util.el('div', 'rzs-pane', box);
          p.dataset.role = 'pane';
          const head = util.el('div', 'rzs-head', p);
          util.el('span', '', head, name);
          const em = util.el('em', '', head);
          for (const it of items(k)) util.el('div', 'rzs-item', p, it);
          return { p, em };
        });
        const div = util.el('div', 'rzs-div ' + (v ? 'v' : 'h'), box);
        div.dataset.role = 'divider';
        div.setAttribute('role', 'separator');
        const span = spec.total - spec.div;
        const paint = (m) => {
          const a = m.pos;
          const b = span - m.pos;
          if (v) {
            Object.assign(panes[0].p.style, { left: 0, top: 0, bottom: 0, width: a + 'px' });
            Object.assign(div.style, { left: a + 'px', top: 0, bottom: 0, width: spec.div + 'px' });
            Object.assign(panes[1].p.style, { left: a + spec.div + 'px', top: 0, bottom: 0, width: b + 'px' });
          } else {
            Object.assign(panes[0].p.style, { top: 0, left: 0, right: 0, height: a + 'px' });
            Object.assign(div.style, { top: a + 'px', left: 0, right: 0, height: spec.div + 'px' });
            Object.assign(panes[1].p.style, { top: a + spec.div + 'px', left: 0, right: 0, height: b + 'px' });
          }
          panes[0].em.textContent = spec.readout ? `${a} px` : '';
          panes[1].em.textContent = spec.readout ? `${b} px` : '';
        };
        paint(ctx.model);
        const clampP = (p) => Math.max(spec.min, Math.min(span - spec.min, Math.round(p)));
        let p0;
        util.drag(div, {
          start() { p0 = ctx.model.pos; div.classList.add('active'); },
          move(e, dx, dy) {
            const pos = clampP(p0 + (v ? dx : dy));
            if (pos === ctx.model.pos) return;
            ctx.update({ ...ctx.model, pos });
            paint(ctx.model);
          },
          end() { div.classList.remove('active'); },
        }, 'divider');
        keyboard(ctx, div, (m) => {
          ctx.update({ ...ctx.model, pos: clampP(m.pos) });
          paint(ctx.model);
        });
        const cross = rng.float(0.3, 0.7);
        placeIn(ctx, box, rng);
        return {
          anchors: [box],
          sync: (m) => paint(m),
          locate(t) {
            const r = div.getBoundingClientRect();
            const p = v ? [r.left + r.width / 2, r.top + cross * r.height] : [r.left + cross * r.width, r.top + r.height / 2];
            if (t.pos === undefined) return p;
            const d = t.pos - ctx.model.pos;
            return v ? [p[0] + d, p[1]] : [p[0], p[1] + d];
          },
        };
      }

      // ------------------------------------------------------------------ window (window-manager frame)

      const MENUS = __has('MENUS') ? __parts['MENUS'](undefined, __scope) : ([['File', 'Edit', 'View', 'Window', 'Help'], ['File', 'Edit', 'Insert', 'Format', 'Tools'], ['Project', 'Edit', 'Go', 'Run', 'Help']]);
      const TILE_COLORS = __has('TILE_COLORS') ? __parts['TILE_COLORS'](undefined, __scope) : (['#e76f51', '#2a9d8f', '#457b9d', '#8d6cab', '#e9c46a', '#6c757d', '#d62828', '#3a86ff']);

      function windowContents(ctx, { C, desk, names, rectOf }) {
        const { spec, rng, util } = ctx;
        // The window: frame (what env.ui.resizable sizes) > frame + reflowing body, plus the hover-only zones.
        const frame = util.el('div', 'wm-frame', desk);
        frame.dataset.role = 'panel';
        const mac = rng.bool(0.4);
        const win = util.el('div', 'wm-win ' + (mac ? 'mac' : 'win'), frame);
        const head = util.el('div', 'wm-bar', win);
        const decoy = (b, label) => {
          b.type = 'button';
          b.title = label;
          b.setAttribute('aria-label', label);
          b.addEventListener('click', () => env.log('decoy', { label }));
        };
        if (mac) {
          const lights = util.el('div', 'wm-lights', head);
          for (const label of ['Close', 'Minimize', 'Zoom']) decoy(util.el('button', '', lights), label);
          util.el('span', 'wm-ttl', head, spec.title);
        } else {
          util.el('i', 'wm-app', head);
          util.el('span', 'wm-ttl', head, spec.title);
        }
        const lock = spec.scenario === 'aspect' ? lockButton(ctx, head, '') : null;
        if (lock && !mac) lock.style.marginLeft = 'auto';
        if (!mac) {
          const ctl = util.el('div', 'wm-ctl', head);
          if (lock) ctl.style.marginLeft = '6px';
          for (const [label, glyph] of [['Minimize', '\u2013'], ['Maximize', '\u25a1'], ['Close', '\u2715']]) decoy(util.el('button', '', ctl, glyph), label);
        }
        const menu = util.el('div', 'wm-menu', win);
        for (const m of rng.pick(MENUS)) util.el('span', '', menu, m);
        const body = util.el('div', 'wm-body', win);
        const sent = () => (Array.isArray(C.SENTENCES) && C.SENTENCES.length ? (C.pick ? C.pick(rng, C.SENTENCES, { csplit: spec.csplit }) : rng.pick(C.SENTENCES))
          : 'Remember to update the release checklist before Friday.');
        util.el('h4', '', body, spec.title);
        util.el('p', '', body, [sent(), sent()].join(' '));
        const grid = util.el('div', 'wm-grid', body);
        for (let i = 0, n = rng.int(8, 16); i < n; i++) {
          const t = util.el('div', '', grid, String(rng.pick(names)).slice(0, 14));
          t.style.background = rng.pick(TILE_COLORS);
        }
        util.el('p', '', body, [sent(), sent(), sent()].join(' '));
        const status = util.el('div', 'wm-status', win);
        util.el('span', '', status, `${grid.children.length} items`);
        const readout = util.el('span', 'rd', status);
        readout.dataset.role = 'readout';
        readout.hidden = !spec.readout;

        if (spec.scenario === 'ghost') {
          const g = util.el('div', 'wm-ghost', desk);
          g.dataset.role = 'target';
          const r = rectOf(spec.target);
          Object.assign(g.style, { left: r.x + 'px', top: r.y + 'px', width: spec.target.w + 'px', height: spec.target.h + 'px' });
        }

        return { frame, readout, lock };
      }

      function renderWindow(ctx) {
        const { spec, rng, util, size: stage } = ctx;
        const C = ctx.content || {};
        const A = spec.anchor;
        const ax = side(A, 'x') ?? 0;
        const ay = side(A, 'y') ?? 0;
        const ticks = !spec.readout && spec.scenario !== 'ghost';
        const margin = 12;
        const pad = 12;
        const task = 24;
        const o = { x: rng.int(ticks ? 30 : 14, ticks ? 40 : 48), y: rng.int(ticks ? 22 : 12, ticks ? 28 : 24) };
        const lim = {
          min: { ...spec.min },
          max: {
            w: Math.min(spec.max.w, Math.floor(stage.width - 2 * margin - o.x - pad)),
            h: Math.min(spec.max.h, Math.floor(stage.height - 2 * margin - o.y - pad - task)),
          },
        };
        const W = o.x + lim.max.w + pad;
        const Hd = o.y + lim.max.h + pad;
        const desk = util.el('div', 'wm-desk', ctx.stage);
        desk.dataset.role = 'workspace';
        Object.assign(desk.style, { width: W + 'px', height: Hd + task + 'px' });

        // Inert desktop icons in the column away from the fixed corner's side, and a taskbar.
        const names = C.WORDS && C.WORDS.length ? C.WORDS : ['Notes', 'Photos', 'Budget', 'Drafts'];
        for (let i = 0, n = rng.int(2, 4); i < n; i++) {
          const ic = util.el('div', 'wm-icon', desk);
          util.el('i', rng.bool(0.5) ? 'f' : '', ic);
          util.el('span', '', ic, String(rng.pick(names)).slice(0, 12));
          Object.assign(ic.style, ax ? { left: '6px' } : { right: '6px' }, { top: 8 + i * 62 + 'px' });
        }
        const bar = util.el('div', 'wm-task', desk);
        util.el('b', '', bar, spec.title);
        const clock = rng.int(7, 18);
        util.el('span', '', bar, `${clock}:${String(rng.int(0, 59)).padStart(2, '0')}`);

        const rectOf = (s) => ({ x: ax ? W - o.x - s.w : o.x, y: ay ? Hd - o.y - s.h : o.y, w: s.w, h: s.h });
        if (ticks) {
          // Px ticks from the fixed corner along the desk's top/bottom and left/right margins.
          const step = env.taskDef.helpers.rulerStep;
          const tx = util.el('div', 'wm-tick', desk);
          Object.assign(tx.style, { left: 0, right: 0, height: '16px' }, ay ? { top: Hd - o.y + 4 + 'px' } : { top: o.y - 18 + 'px' });
          for (let d = 0; d <= lim.max.w; d += step) {
            const x = ax ? W - o.x - d : o.x + d;
            const i = util.el('i', '', tx);
            Object.assign(i.style, { left: x + 'px', width: '1px', height: d % 100 ? '4px' : '7px' }, ay ? { top: 0 } : { bottom: 0 });
            if (d % 100 === 0) Object.assign(util.el('b', '', tx, String(d)).style, { left: x + 3 + 'px' }, ay ? { top: '3px' } : { bottom: '4px' });
          }
          const ty = util.el('div', 'wm-tick', desk);
          Object.assign(ty.style, { top: 0, height: Hd + 'px', width: o.x - 4 + 'px' }, ax ? { left: W - o.x + 4 + 'px' } : { left: 0 });
          for (let d = 0; d <= lim.max.h; d += step) {
            const y = ay ? Hd - o.y - d : o.y + d;
            const i = util.el('i', '', ty);
            Object.assign(i.style, { top: y + 'px', height: '1px', width: d % 100 ? '4px' : '7px' }, ax ? { left: 0 } : { right: 0 });
            if (d % 100 === 0) Object.assign(util.el('b', '', ty, String(d)).style, { top: y + 1 + 'px' }, ax ? { left: '2px' } : { right: '2px' });
          }
        }

        const { frame, readout, lock } = windowContents(ctx, { C, desk, names, rectOf });

        // Resize zones on every edge / corner that keeps the fixed corner.
        const valid = Object.keys(POINTS).filter((h) => (!movesX(h) || side(h, 'x') !== ax) && (!movesY(h) || side(h, 'y') !== ay));
        const handles = {};
        for (const name of new Set([spec.grip, spec.corner, ...valid].filter(Boolean))) {
          const h = util.el('div', 'wm-h ' + name + (name.length === 2 ? ' c' : ''), frame);
          h.dataset.role = 'handle-' + name;
          handles[name] = h;
        }
        const rzOpts = {
          handles,
          size: { w: ctx.model.w, h: ctx.model.h },
          anchor: A,
          min: lim.min,
          max: lim.max,
          aspect: null,
          place(el, r) {
            const p = rectOf(r);
            Object.assign(el.style, { left: p.x + 'px', top: p.y + 'px', width: r.w + 'px', height: r.h + 'px' });
            readout.textContent = `${r.w} × ${r.h} px`;
          },
          onStart: (s, name) => handles[name].classList.add('active'),
          onInput: (s) => ctx.update({ ...ctx.model, ...s }),
          onChange: (s, name) => {
            handles[name].classList.remove('active');
            ctx.update({ ...ctx.model, ...s });
          },
        };
        if (lock) aspectLock(ctx, desk, rzOpts, lock);
        const rz = env.ui.resizable(frame, rzOpts);
        const clampS = (m) => ({ w: Math.max(lim.min.w, Math.min(lim.max.w, m.w)), h: Math.max(lim.min.h, Math.min(lim.max.h, m.h)) });
        keyboard(ctx, handles[spec.grip], (m) => {
          const s = clampS(m);
          rz.set(s);
          ctx.update({ ...ctx.model, ...s });
        });
        placeIn(ctx, desk, rng);
        return {
          anchors: [desk],
          sync: (m) => {
            rz.set({ w: m.w, h: m.h });
            if (lock) lock.setAttribute('aria-pressed', String(!!m.lock));
          },
          locate(t) {
            if (t.lock) return util.center(lock);
            if (t.handle === undefined) throw new Error(`resize-element/window cannot locate ${JSON.stringify(t)}`);
            return rz.locateHandle(handles[t.handle] ? t.handle : spec.grip, t.size);
          },
        };
      }

      let wview = __has('wview') ? __parts['wview'](undefined, __scope) : undefined;
      env.widget({
        task: 'resize-element',
        site: 'base',
        name: 'window',
        split: 'train',
        scenarios: ['numeric', 'ghost', 'aspect'],
        traits: { grips: ['se', 'e', 's', 'sw', 'w', 'ne', 'n', 'nw'], lock: true },

        render(ctx) {
          ensureStyle();
          wview = renderWindow(ctx);
          return { anchors: wview.anchors, sync: wview.sync };
        },

        locate(t) {
          return wview.locate(t);
        },
      });

      env.widget({
        task: 'resize-element',
        site: 'base',
        name: 'panel',
        split: 'train',
        scenarios: ['numeric', 'ghost', 'relative', 'textarea', 'column', 'split', 'aspect'],
        traits: { grips: ['se', 'e', 's', 'sw', 'w', 'ne', 'n', 'nw'], lock: true },

        render(ctx) {
          ensureStyle();
          const v = ctx.spec.scenario;
          view = v === 'textarea' ? renderTextarea(ctx) : v === 'column' ? renderColumn(ctx) : v === 'split' ? renderSplit(ctx) : renderPanel(ctx);
          return { anchors: view.anchors, sync: view.sync };
        },

        locate(t) {
          return view.locate(t);
        },
      });
    },
  }), { uses: ['resize-element/_styles'] });
})();
