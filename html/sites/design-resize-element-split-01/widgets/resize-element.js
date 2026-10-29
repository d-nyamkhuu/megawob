// Design on templates/resize-element/base.js: the base site's resize-element widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'resize-element',
  site: 'design-resize-element-split-01',
  name: 'design',
  split: 'train',
  scenarios: ['split'],
  template: 'resize-element/base',
  design: {
    parts: {
      'renderSplit': (base, S) => function renderSplit(ctx) {
        const { keyboard, lorem, placeIn } = S;
        const { spec, rng, util } = ctx;
        // The seeded total is fitted to this axis; keep it on that axis.
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
        const paneItems = spec.panes.map((_, k) => items(k));
        const panes = spec.panes.map((name, k) => {
          const p = util.el('div', 'rzs-pane', box);
          p.dataset.role = 'pane';
          const head = util.el('div', 'rzs-head', p);
          util.el('span', '', head, name);
          const em = util.el('em', '', head);
          for (const it of paneItems[1 - k]) util.el('div', 'rzs-item', p, it);
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
          panes[0].em.textContent = `${a} px`;
          panes[1].em.textContent = `${b} px`;
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
        Object.assign(box.style, { left: '0px', top: '0px', ...(v
          ? { width: spec.total + 'px', height: ctx.size.height + 'px' }
          : { width: ctx.size.width + 'px', height: spec.total + 'px' }) });
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
      },
    },
  },
});
