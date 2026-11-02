// Design on templates/resize-element/base.js: the base site's resize-element widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'resize-element',
  site: 'design-resize-element-relative-05',
  name: 'design',
  split: 'train',
  scenarios: ['relative'],
  template: 'resize-element/base',
  design: {
    parts: {
      'renderPanel': (base, S) => function renderPanel(ctx) {
        const { POINTS, aspectLock, env, keyboard, lockButton, movesX, movesY, placeIn, side } = S;
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
        const sampledRefH = ref && ref.dim === 'w' ? rng.int(38, 50) : 0;
        // Reserve the search window's decorative height in the workspace budget.
        const requiredW = Math.max(ctx.model.w, spec.target.w, ref && ref.dim === 'w' ? ref.size : 0);
        const requiredH = Math.max(ctx.model.h, spec.target.h, ref && ref.dim === 'h' ? ref.size : 0);
        const refH = sampledRefH ? Math.max(sampledRefH, Math.min(150, Math.round(stage.height * 0.19), stage.height - 2 * margin - pad - 12 - requiredH)) : 0;
        const toolH = spec.scenario === 'aspect' ? 30 : 0;
        // Keep the sampled margins when there is room, and yield them to large goals.
        o.x = Math.max(0, Math.min(o.x, stage.width - 2 * margin - pad - (refW ? refW + 12 : 0) - requiredW));
        o.y = Math.max(0, Math.min(o.y, stage.height - 2 * margin - pad - (refH ? refH + 12 : 0) - (toolH ? toolH + 12 : 0) - requiredH));
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
          refEl = util.el('div', 'rz-ref gem-search-ref');
          refEl.dataset.role = 'reference';
          refEl.style.display = 'flex';
          util.el('span', 'ar-ico', refEl, '↔');
          util.el('div', 'gem-search-title', refEl, ref.name);
          util.el('div', 'gem-search-size', refEl, `${ref.size} px`);
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
        const box = util.el('div', 'rz-box', area);
        box.dataset.role = 'panel';
        Object.assign(box.style, ax ? { right: o.x - 1 + 'px' } : { left: o.x + 'px' }, ay ? { bottom: o.y - 1 + 'px' } : { top: o.y + 'px' });
        const title = util.el('div', 'rz-title', box);
        util.el('span', '', title, spec.title);
        util.el('span', 'rz-kebab', title, '⋮');
        const body = util.el('div', 'rz-body tk-body', box);
        const priorLineCount = rng.int(6, 30);
        for (let i = 0; i < priorLineCount; i++) rng.int(30, 95);
        const tkHead = util.el('div', 'tk-row tk-head', body);
        for (const t of ['Title', 'Project', 'Due Date', 'Status', 'Assignee']) util.el('span', '', tkHead, t);
        for (const r of [
          ['Update home page copy', 'Website Redesign', 'Aug 14, 2024', 'In Progress', 'g', 'Jamie Carter'],
          ['Design new icons', 'Website Redesign', 'Aug 16, 2024', 'Not Started', 'b', 'Riley Cooper'],
          ['Implement analytics', 'Marketing Site', 'Aug 20, 2024', 'Completed', 'g', 'Taylor Kim'],
          ['Fix mobile layout bug', 'Mobile App', 'Aug 22, 2024', 'In Review', 'o', 'Casey Park'],
          ['Prepare launch plan', 'Product Launch', 'Aug 26, 2024', 'Not Started', 'b', 'Morgan Lee'],
          ['Review security settings', 'Infrastructure', 'Aug 28, 2024', 'Completed', 'g', 'Jordan Patel'],
          ['Update help center articles', 'Support', 'Aug 30, 2024', 'Not Started', 'b', 'Avery Chen'],
          ['Plan Q4 roadmap', 'Product Launch', 'Sep 3, 2024', 'In Review', 'o', 'Jamie Carter'],
        ]) {
          const row = util.el('div', 'tk-row', body);
          util.el('span', '', row, r[0]);
          util.el('span', '', row, r[1]);
          util.el('span', '', row, r[2]);
          const st = util.el('span', 'tk-st', row, r[3]);
          st.dataset.c = r[4];
          util.el('span', '', row, r[5]);
        }
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
      },
    },
  },
});
