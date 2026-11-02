// Design on templates/resize-element/base.js: the base site's resize-element widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'resize-element',
  site: 'design-resize-element-relative-02',
  name: 'design',
  split: 'train',
  scenarios: ['relative'],
  template: 'resize-element/base',
  design: {
    parts: {
      'renderPanel': (base, S) => function renderPanel(ctx) {
        const { POINTS, env, keyboard, lockButton, movesX, movesY, placeIn, side } = S;
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
        // The reference strip and workspace share the stage's available height.
        const gap = stage.width < 650 ? 8 : 14;
        const stripH = ref ? 68 : 0;
        const W = Math.floor(stage.width - 2 * margin);
        const H = Math.floor(stage.height - 2 * margin - (ref ? stripH + gap : 0) - (toolH ? toolH + gap : 0));
        const sx = Math.min(2.15, (W - o.x - pad) / spec.max.w);
        const sy = Math.min(2.6, (H - o.y - pad) / spec.max.h);
        const lim = {
          min: { ...spec.min },
          max: { ...spec.max },
        };
        const wrap = util.el('div', 'rz-wrap' + (refH || toolH ? ' col' : ''), ctx.stage);
        Object.assign(wrap.style, { width: W + 'px', display: 'flex', flexDirection: 'column', gap: gap + 'px', alignItems: 'stretch' });
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
          refEl = util.el('div', 'rz-ref', null, `${ref.name} — ${ref.size} px`);
          refEl.dataset.role = 'reference';
          Object.assign(refEl.style, { width: W + 'px', height: stripH + 'px', order: -1, flex: 'none', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '28px 15px 5px', boxSizing: 'border-box' });
          if (rng.bool(0.5)) wrap.prepend(refEl);
          else wrap.append(refEl);
        }

        // Panel rect inside the area for a size (the anchored corner stays put).
        const rectOf = (size) => {
          const s = { ...ctx.model, ...size };
          return { x: ax ? W - o.x - s.w * sx : o.x, y: ay ? H - o.y - s.h * sy : o.y, w: s.w * sx, h: s.h * sy };
        };
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
        readout.hidden = !(spec.readout || spec.scenario === 'relative');
        title.appendChild(readout);

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
          Object.assign(box.style, { width: s.w * sx + 'px', height: s.h * sy + 'px' });
          const r = rectOf(s);
          for (const [name, h] of Object.entries(handles)) {
            const [fx, fy] = POINTS[name];
            Object.assign(h.style, { left: r.x + fx * r.w + 'px', top: r.y + fy * r.h + 'px' });
          }
          readout.textContent = spec.scenario === 'relative' ? `Width: ${s.w} px` : `${s.w} × ${s.h}`;
        };
        const clampS = (m) => ({ w: Math.max(lim.min.w, Math.min(lim.max.w, m.w)), h: Math.max(lim.min.h, Math.min(lim.max.h, m.h)) });
        const apply = (m) => {
          const s = clampS(m);
          draw(s);
          ctx.update({ ...ctx.model, ...s });
        };
        for (const [name, handle] of Object.entries(handles)) {
          handle.addEventListener('pointerdown', (e) => {
            e.preventDefault(); e.stopPropagation(); handle.setPointerCapture(e.pointerId);
            const start = { x: e.clientX, y: e.clientY, w: ctx.model.w, h: ctx.model.h };
            handle.classList.add('active');
            const move = (ev) => {
              const fx = POINTS[name][0], fy = POINTS[name][1];
              const w = movesX(name) ? start.w + (ev.clientX - start.x) * (fx ? 1 : -1) / sx : start.w;
              const h = movesY(name) ? start.h + (ev.clientY - start.y) * (fy ? 1 : -1) / sy : start.h;
              const s = clampS({ w: Math.round(w), h: Math.round(h) }); draw(s); ctx.update({ ...ctx.model, ...s });
            };
            const up = () => { handle.classList.remove('active'); handle.removeEventListener('pointermove', move); handle.removeEventListener('pointerup', up); handle.removeEventListener('pointercancel', up); };
            handle.addEventListener('pointermove', move); handle.addEventListener('pointerup', up); handle.addEventListener('pointercancel', up);
          });
        }
        keyboard(ctx, handles[spec.grip], apply);
        draw(ctx.model);
        placeIn(ctx, wrap, rng);
        return {
          anchors: [area, ...(refEl ? [refEl] : []), ...(lock ? [lock] : [])],
          sync: (m) => {
            draw({ w: m.w, h: m.h });
            if (lock) lock.setAttribute('aria-pressed', String(!!m.lock));
          },
          locate(t) {
            if (t.lock) return ctx.util.center(lock);
            if (t.handle === undefined) throw new Error(`resize-element/panel cannot locate ${JSON.stringify(t)}`);
            const name = handles[t.handle] ? t.handle : spec.grip;
            const r = rectOf(t.size || ctx.model), [fx, fy] = POINTS[name], ar = area.getBoundingClientRect();
            return [ar.left + area.clientLeft + r.x + fx * r.w, ar.top + area.clientTop + r.y + fy * r.h];
          },
        };
      },
    },
  },
});
