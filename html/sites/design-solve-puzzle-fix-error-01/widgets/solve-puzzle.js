// Design on templates/solve-puzzle/base.js: the base site's solve-puzzle widget for this scenario, unchanged (it was
// scaffolded from it and restyled through site.css).
env.widget({
  task: 'solve-puzzle',
  site: 'design-solve-puzzle-fix-error-01',
  name: 'design',
  split: 'train',
  scenarios: ['fix-error'],
  template: 'solve-puzzle/base',
  design: {
    parts: {
      // Lay out the full-bleed form before the template freezes its anchors.
      build: (base, S) => (ctx, box, squeeze) => {
        const card = base(ctx, box, squeeze);
        const rows = Math.ceil(ctx.spec.fields.length / 2);
        const scale = Math.min(1, (box.h - 16) / (108 + rows * 120 + (rows - 1) * 28));
        const px = n => `${Math.max(1, Math.floor(n * scale))}px`;
        card.style.width = `${Math.max(0, box.w - 8)}px`;
        card.style.height = `${Math.max(0, box.h - 8)}px`;
        card.style.setProperty('--pixel-scale', scale);
        const head = card.querySelector('.pz-head');
        const foot = card.querySelector('.pz-foot');
        const body = card.querySelector('.pz-body');
        const banner = body.querySelector('.pz-banner');
        head.style.display = foot.style.display = 'none';
        Object.assign(body.style, { padding: '0', flex: '1 1 auto', minHeight: '0' });
        Object.assign(banner.style, { height: px(70), margin: `0 0 ${px(38)}`, padding: `${px(10)} ${px(20)}`, boxSizing: 'border-box', flex: 'none' });
        Object.assign(S.st.main.style, { width: '100%', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: `${px(28)} ${px(58)}` });
        S.st.fields.forEach(({ box: field, inp, err }) => {
          field.style.gap = px(5);
          Object.assign(inp.style, { height: px(56), padding: `0 ${px(15)}` });
          err.style.height = px(28);
        });
        return card;
      },
    },
  },
});
