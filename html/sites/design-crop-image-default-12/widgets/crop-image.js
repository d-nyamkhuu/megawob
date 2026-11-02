// This design uses a white canvas and puts Apply in the crop-actions response pane.
env.widget({
  task: 'crop-image',
  site: 'design-crop-image-default-12',
  name: 'design',
  split: 'train',
  scenarios: ['default'],
  traits: { aspect: 1064 / 656 },
  template: 'crop-image/box',
  design: {
    background: '#ffffff',
    parts: {
      applyBar: () => (ctx, bar) => {
        const actions = document.querySelector('[data-role="crop-actions"]');
        if (actions) actions.prepend(bar);
      },
    },
  },
});
