env.widget({
  task: 'type-text',
  site: 'design-type-text-password-09',
  name: 'design',
  split: 'train',
  scenarios: ['password'],
  template: 'type-text/fields',
  design: {
    labelWithPlaceholder: false,
    parts: {
      makeBox: (base) => (e) => {
        const box = base(e);
        if (e.label) box.appendChild(e.label);
        return box;
      },
      labelInside: () => (look, floating) => floating || look.layout === 'placeholder',
      // Keep the existing field geometry; reclaim only top whitespace when frame leaves a short stage.
      build: (base, S) => (ctx, look) => {
        const card = base(ctx, look);
        const excess = S.st.card.getBoundingClientRect().height - ctx.size.height;
        if (excess > 0) {
          const topSpace = parseFloat(getComputedStyle(S.st.card).paddingTop);
          S.st.card.style.setProperty('--field-top-space', `${Math.max(0, topSpace - excess - 1)}px`);
        }
        return card;
      },
    },
  },
});
