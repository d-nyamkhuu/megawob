env.widget({
  task: 'type-text',
  site: 'design-type-text-password-06',
  name: 'design',
  split: 'train',
  scenarios: ['password'],
  template: 'type-text/fields',
  design: {
    sample: { layout: 'try', growShort: false },
    gridClass: 'inline',
    floating: false,
    placeholderLayout: null,
    placeholderField: false,
    parts: {
      // Long instruction banners can leave less space than the two normal-height fields need.
      // Keep the reference dimensions whenever they fit; compress only an overflowing form.
      settle: (base, S) => (ctx, size) => {
        const card = S.st.card;
        const n = ctx.spec.fields.length;
        if (card.getBoundingClientRect().height > size.height) {
          const grid = card.querySelector('.ft-grid');
          const gap = parseFloat(getComputedStyle(grid).rowGap) || 0;
          card.style.setProperty('--ft-fit-h', `${Math.max(1, (size.height - gap * (n - 1)) / n)}px`);
        }
      },
      // The existing focus listener mirrors focus into the model for keyboard oracle routes.
      finish: (base, S) => () => {
        const initialField = Object.values(S.st.inputs).find((x) => !x.el.disabled);
        if (initialField) initialField.el.focus({ preventScroll: true });
      },
    },
  },
});
