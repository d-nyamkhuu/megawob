// Adds the original multi-control marker and switches crowded button sets to the roomier layout.
env.widget({
  task: 'click-control',
  site: 'design-click-control-button-06',
  name: 'design',
  split: 'train',
  scenarios: ['button'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {
    parts: {
      buttonHost: () => (ctx, surface) => {
        surface.classList.toggle('multiple-controls', ctx.spec.elements.length > 2);
        return surface;
      },
      buttonBuilt: () => (ctx, surface, buttons, content) => {
        const bounds = content.getBoundingClientRect();
        if (buttons.some((button) => {
          const rect = button.getBoundingClientRect();
          return rect.bottom > bounds.bottom + 1 || rect.right > bounds.right + 1;
        })) surface.classList.add('crowded-controls');
      },
    },
  },
});
