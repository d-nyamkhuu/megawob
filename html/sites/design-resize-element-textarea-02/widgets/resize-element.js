// Design on templates/resize-element/base.js: the base site's resize-element widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'resize-element',
  site: 'design-resize-element-textarea-02',
  name: 'design',
  split: 'train',
  scenarios: ['textarea'],
  template: 'resize-element/base',
  design: {
    parts: {
      'renderTextarea': (base, S) => function renderTextarea(ctx) {
        const { lorem, placeIn } = S;
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
          hint.style.top = (50 + m.h) + 'px';
          hint.style.left = '18px';
          hint.style.right = 'auto';
        };
        paint(ctx.model);
        // The browser resizes the element itself: read its rendered size after pointer moves and releases.
        const read = () => {
          const w = Math.round(ta.offsetWidth);
          const h = Math.round(ta.offsetHeight);
          if (w !== ctx.model.w || h !== ctx.model.h) {
            hint.textContent = spec.readout ? `${w} × ${h} px` : '';
            hint.style.top = (50 + h) + 'px';
            ctx.update({ ...ctx.model, w, h });
          }
        };
        if (!S.hooked) {
          S.hooked = true;
          for (const type of ['pointermove', 'pointerup', 'mouseup']) document.addEventListener(type, () => { if (S.view && S.view.read) S.view.read(); });
        }
        if (window.ResizeObserver) new ResizeObserver(() => { if (S.view && S.view.ta === ta) read(); }).observe(ta);
        placeIn(ctx, card, rng);
        // Reserve the full resize range and keep the editor inside the stage.
        const compact = ctx.size.width < 700;
        card.style.left = Math.max(0, Math.min(compact ? 18 : 28, ctx.size.width - card.offsetWidth)) + 'px';
        card.style.top = Math.max(0, Math.min(compact ? 90 : 130, ctx.size.height - card.offsetHeight)) + 'px';
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
      },
    },
  },
});
