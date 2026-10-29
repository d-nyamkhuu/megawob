/* resize-element/_base-interact: the reference interact scope and its replaceable units.
 * Called once by resize-element/base, in the original registration order; event targets, attachment order and capture flags are preserved.
 * New units: interactContents(ctx, geometry) -> { frame, readout, names, handles };
 * placeInteract(ctx, geometry) positions the scene. Keyboard and focus listeners remain together in render.
 */
(function () {
  'use strict';
  env.template('resize-element/_base-interact', () => ({
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
        get LOCK_ICON() { return LOCK_ICON; },
        get view() { return view; }, set view(v) { view = v; },
        get interactContents() { return interactContents; },
        get placeInteract() { return placeInteract; },
        get render() { return render; },
      };
      for (const k of Object.keys(__parts)) if (k.startsWith('+2.')) {
        let v; let built = false;
        Object.defineProperty(__scope, k.slice(3), {
          get: () => (built ? v : (built = true, v = __parts[k](undefined, __scope))),
          set: (x) => { built = true; v = x; },
        });
      }
      setScope(__scope);
      if (__has('interactContents')) interactContents = __parts['interactContents'](interactContents, __scope);
      if (__has('placeInteract')) placeInteract = __parts['placeInteract'](placeInteract, __scope);
      if (__has('render')) render = __parts['render'](render, __scope);

      const CSS = __has('CSS@2') ? __parts['CSS@2'](undefined, __scope) : (env.templateLib('resize-element/_styles').INTERACT_CSS);

      const POINTS = __has('POINTS@2') ? __parts['POINTS@2'](undefined, __scope) : ({ nw: [0, 0], n: [0.5, 0], ne: [1, 0], e: [1, 0.5], se: [1, 1], s: [0.5, 1], sw: [0, 1], w: [0, 0.5] });
      const KEYS = __has('KEYS@2') ? __parts['KEYS@2'](undefined, __scope) : (new Set(['ArrowRight', 'ArrowUp', 'ArrowLeft', 'ArrowDown']));
      const movesX = __has('movesX@2') ? __parts['movesX@2'](undefined, __scope) : { movesX: (g) => /[ew]/.test(g) }.movesX;
      const movesY = __has('movesY@2') ? __parts['movesY@2'](undefined, __scope) : { movesY: (g) => /[ns]/.test(g) }.movesY;
      const side = __has('side@2') ? __parts['side@2'](undefined, __scope) : { side: (g, axis) => (axis === 'x' ? (g.includes('e') ? 1 : g.includes('w') ? 0 : null) : (g.includes('s') ? 1 : g.includes('n') ? 0 : null)) }.side;
      const LOCK_ICON = __has('LOCK_ICON@2') ? __parts['LOCK_ICON@2'](undefined, __scope) : ('<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">'
        + '<path d="M6.5 9.5l3-3"/><path d="M7.5 4.5l1.2-1.2a2.6 2.6 0 0 1 3.7 3.7L11.2 8.2"/><path d="M8.5 11.5l-1.2 1.2a2.6 2.6 0 0 1-3.7-3.7L4.8 7.8"/></svg>');

      let view = __has('view@2') ? __parts['view@2'](undefined, __scope) : (null);

      function interactContents(ctx, { fam, area, ax, ay, o, W, H, lim, ruler, rectOf }) {
        const { spec, rng, util } = ctx;
        const frame = util.el('div', 'ri-frame', area);
        frame.dataset.role = 'panel';
        Object.assign(frame.style, ax ? { right: o.x + 'px' } : { left: o.x + 'px' }, ay ? { bottom: o.y + 'px' } : { top: o.y + 'px' });
        const box = util.el('div', 'ri-box', frame);
        const title = util.el('div', 'ri-title', box);
        util.el('i', '', title);
        util.el('span', '', title, spec.title);
        const body = util.el('div', 'ri-body', box);
        for (let i = 0, n = rng.int(6, 30); i < n; i++) util.el('div', 'ri-line', body).style.width = rng.int(30, 95) + '%';
        const readout = util.el('div', 'ri-readout', box);
        readout.dataset.role = 'readout';
        readout.style[spec.grip.includes('w') ? 'right' : 'left'] = '10px';
        readout.hidden = !spec.readout;

        if (spec.scenario === 'ghost') {
          const ghost = util.el('div', 'ri-ghost', area);
          ghost.dataset.role = 'target';
          const r = rectOf(spec.target);
          Object.assign(ghost.style, { left: r.x + 'px', top: r.y + 'px', width: spec.target.w + 'px', height: spec.target.h + 'px' });
        }
        if (ruler) {
          const top = util.el('div', 'ri-ruler', area);
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
          const left = util.el('div', 'ri-ruler', area);
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

        // Handles (children of the frame, positioned on its edges): the grip, the shared-corner handle (aspect) and,
        // on some seeds, every other handle that keeps the same corner fixed. A handle's classes name its edges.
        const valid = Object.keys(POINTS).filter((h) => (!movesX(h) || side(h, 'x') !== ax) && (!movesY(h) || side(h, 'y') !== ay));
        let names = rng.bool(0.5) ? [spec.grip] : [...new Set([spec.grip, ...valid])];
        if (spec.corner && !names.includes(spec.corner)) names = [...names, spec.corner];
        const handles = {};
        for (const name of names) {
          const cls = movesX(name) && movesY(name) ? 'c ' + (name === 'se' || name === 'nw' ? 'nwse' : 'nesw') : movesX(name) ? 'x' : 'y';
          const edges = [...name].map((ch) => `ri-e-${ch}`).join(' ');
          const h = util.el('div', `ri-h ${cls} ${edges}`, frame);
          h.dataset.role = 'handle-' + name;
          const [fx, fy] = POINTS[name];
          Object.assign(h.style, { left: fx * 100 + '%', top: fy * 100 + '%' });
          handles[name] = h;
        }
        return { frame, readout, names, handles };
      }

      function placeInteract(ctx, { wrap, stage, margin }) {
        const { rng } = ctx;
        // Place the whole scene at a sampled spot of the stage, away from a fixed end control.
        const c01 = (f) => Math.min(1, Math.max(0, f));
        const w0 = wrap.offsetWidth;
        const h0 = wrap.offsetHeight;
        const freeX = Math.max(0, stage.width - w0 - 2 * margin);
        const freeY = Math.max(0, stage.height - h0 - 2 * margin);
        const fx = c01(rng.pick([0, 0.5, 0.5, 1]) + rng.float(-0.15, 0.15));
        const fy = c01(rng.pick([0, 0.5, 0.5, 1]) + rng.float(-0.15, 0.15));
        const st = ctx.stage.getBoundingClientRect();
        const fixed = [...document.querySelectorAll('[data-role="submit"]')]
          .filter((b) => getComputedStyle(b).position === 'fixed').map((b) => b.getBoundingClientRect());
        const hits = (x, y) => fixed.some((r) => st.left + x < r.right + 6 && st.left + x + w0 > r.left - 6 && st.top + y < r.bottom + 6 && st.top + y + h0 > r.top - 6);
        let [x, y] = [margin + fx * freeX, margin + fy * freeY];
        for (const [px, py] of [[fx, fy], [fx, 0], [0, fy], [0, 0], [1, 0], [0, 1], [0.5, 0]]) {
          if (!hits(margin + px * freeX, margin + py * freeY)) {
            [x, y] = [margin + px * freeX, margin + py * freeY];
            break;
          }
        }
        wrap.style.left = Math.round(x) + 'px';
        wrap.style.top = Math.round(y) + 'px';

      }

      function render(ctx) {
        env.util.css('ri-style', CSS);
        const I = window.interact;
        if (!I) throw new Error('resize/interact: vendored interact.js is missing');
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
        const wrap = util.el('div', 'ri-wrap' + (refH || toolH ? ' col' : ''), ctx.stage);
        let lock = null;
        if (toolH) {
          const tools = util.el('div', 'ri-tools', wrap);
          tools.style.height = toolH + 'px';
          util.el('span', '', tools, spec.title);
          lock = util.el('button', 'ri-lock', tools);
          lock.type = 'button';
          lock.dataset.role = 'lock';
          lock.title = 'Keep proportions';
          lock.setAttribute('aria-label', 'Keep proportions');
          lock.innerHTML = LOCK_ICON + `<span>${rng.pick(['Keep proportions', 'Lock ratio', 'Constrain proportions'])}</span>`;
          lock.setAttribute('aria-pressed', String(!!ctx.model.lock));
        }
        const area = util.el('div', 'ri-area', wrap);
        area.dataset.role = 'workspace';
        Object.assign(area.style, { width: W + 'px', height: H + 'px' });
        let refEl = null;
        if (ref) {
          refEl = util.el('div', 'ri-ref', null, ref.name);
          refEl.dataset.role = 'reference';
          if (ref.dim === 'w') {
            Object.assign(refEl.style, { width: ref.size + 'px', height: refH + 'px', marginLeft: (ax ? W - o.x - ref.size : o.x) + 1 + 'px' });
          } else {
            Object.assign(refEl.style, { width: refW + 'px', height: ref.size + 'px', marginTop: (ay ? H - o.y - ref.size : o.y) + 1 + 'px', writingMode: 'vertical-rl' });
          }
          if (rng.bool(0.5)) wrap.prepend(refEl);
          else wrap.append(refEl);
        }

        // Frame rect inside the area for a size (the anchored corner stays put).
        const rectOf = (s) => ({ x: ax ? W - o.x - s.w : o.x, y: ay ? H - o.y - s.h : o.y, w: s.w, h: s.h });
        const { frame, readout, names, handles } = interactContents(ctx, { fam, area, ax, ay, o, W, H, lim, ruler, rectOf });

        const draw = (s) => {
          Object.assign(frame.style, { width: s.w + 'px', height: s.h + 'px' });
          readout.textContent = `${s.w} × ${s.h}`;
        };
        const set = (s) => {
          const c = { w: Math.max(lim.min.w, Math.min(lim.max.w, s.w)), h: Math.max(lim.min.h, Math.min(lim.max.h, s.h)) };
          draw(c);
          return c;
        };
        set({ w: ctx.model.w, h: ctx.model.h });

        // interact modifiers: clamp to the task's range, optionally snap to a grid finer than the tolerance, keep the
        // ratio while the lock is on or Shift is held.
        const restrict = I.modifiers.restrictSize({ min: { width: lim.min.w, height: lim.min.h }, max: { width: lim.max.w, height: lim.max.h } });
        const cellSz = rng.bool(0.5) ? Math.max(2, Math.floor(spec.tau * 1.2)) : 0;
        const plain = [restrict];
        if (cellSz) plain.unshift(I.modifiers.snapSize({ targets: [I.snappers.grid({ width: cellSz, height: cellSz })], range: Infinity }));
        const locked = [I.modifiers.aspectRatio({ ratio: 'preserve' }), restrict];
        const edgeSel = { left: '.ri-e-w', right: '.ri-e-e', top: '.ri-e-n', bottom: '.ri-e-s' };
        const rz = I(frame).resizable({
          edges: edgeSel,
          modifiers: plain,
          listeners: {
            start(e) {
              const n = names.find((k) => handles[k] === e.target || handles[k].contains(e.target));
              if (n) handles[n].classList.add('active');
            },
            move(e) {
              const s = set({ w: Math.round(e.rect.width), h: Math.round(e.rect.height) });
              ctx.update({ ...ctx.model, ...s });
            },
            end() {
              for (const h of Object.values(handles)) h.classList.remove('active');
              const s = set({ w: Math.round(frame.offsetWidth), h: Math.round(frame.offsetHeight) });
              ctx.update({ ...ctx.model, ...s });
            },
          },
        });
        if (lock) {
          area.addEventListener('pointerdown', (e) => { rz.resizable({ modifiers: ctx.model.lock || e.shiftKey ? locked : plain }); }, true);
          lock.addEventListener('pointerdown', (e) => e.stopPropagation());
          lock.addEventListener('click', () => {
            const on = !ctx.model.lock;
            lock.setAttribute('aria-pressed', String(on));
            env.log('lock', { on });
            ctx.update({ ...ctx.model, lock: on });
          });
        }

        if (spec.keys) {
          const g = handles[spec.grip];
          g.tabIndex = 0;
          g.addEventListener('pointerdown', () => g.focus({ preventScroll: true }));
          g.addEventListener('keydown', (e) => {
            if (!KEYS.has(e.key)) return;
            e.preventDefault();
            const m = fam.helpers.keyApply(spec, ctx.model, e.key, e.shiftKey);
            if (m === ctx.model) return;
            const s = set(m);
            ctx.update({ ...ctx.model, ...s });
          });
          g.addEventListener('focus', () => { g.classList.add('focused'); if (!ctx.model.focus) ctx.update({ ...ctx.model, focus: true }); });
          g.addEventListener('blur', () => { g.classList.remove('focused'); if (ctx.model.focus) ctx.update({ ...ctx.model, focus: false }); });
        }

        placeInteract(ctx, { wrap, stage, margin });

        view = { area, handles, rectOf, lock, ctx };
        return {
          anchors: [area, ...(refEl ? [refEl] : []), ...(lock ? [lock] : [])],
          sync: (m) => {
            set({ w: m.w, h: m.h });
            if (lock) lock.setAttribute('aria-pressed', String(!!m.lock));
          },
        };
      }

      env.widget({
        task: 'resize-element', site: 'base', name: 'interact', split: 'train',
        scenarios: ['numeric', 'ghost', 'relative', 'aspect'],
        traits: { grips: ['se', 'e', 's', 'sw', 'w', 'ne', 'n', 'nw'], lock: true },
        uses: [['../vendor/interactjs-1.10.27/interact.min', 'vendor']],
        render,
        locate(t) {
          if (t.lock) return view.ctx.util.center(view.lock);
          if (t.handle === undefined) throw new Error(`resize-element/interact cannot locate ${JSON.stringify(t)}`);
          const name = view.handles[t.handle] ? t.handle : view.ctx.spec.grip;
          const s = t.size || { w: view.ctx.model.w, h: view.ctx.model.h };
          const r = view.rectOf(s);
          const a = view.area.getBoundingClientRect();
          const [fx, fy] = POINTS[name];
          return [a.left + view.area.clientLeft + r.x + fx * r.w, a.top + view.area.clientTop + r.y + fy * r.h];
        },
      });
    },
  }), { uses: ['resize-element/_styles'] });
})();
