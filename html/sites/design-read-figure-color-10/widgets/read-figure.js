// Adds NeXTSTEP's compact swatch sizing when the palette has more than six choices.
env.widget({
  task: 'read-figure',
  site: 'design-read-figure-color-10',
  name: 'design',
  split: 'train',
  scenarios: ['color'],
  template: 'read-figure/scene',
  design: {
    parts: {
      widget: (base, S) => (ctx) => {
        base(ctx);
        if (S.spec.hex.length > 6) {
          const choices = S.scene.querySelector('.swatches');
          choices.classList.add('nx-many');
          choices.style.setProperty('--nx-count', S.spec.hex.length);
        }
      },
    },
  },
});
