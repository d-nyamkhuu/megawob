// Carbon keeps the sample in the left brief and wires the page's Clear control.
env.widget({
  task: 'read-figure',
  site: 'design-read-figure-color-02',
  name: 'design',
  split: 'train',
  scenarios: ['color'],
  template: 'read-figure/scene',
  design: {
    swatchSizing: false,
    parts: {
      colorReady: (base, S) => (ctx, sample, choices) => {
        base(ctx, sample, choices);
        document.querySelector('.brief').append(sample);
      },
      rendered: (base, S) => (ctx) => {
        base(ctx);
        const clear = document.querySelector('[data-clear]');
        if (clear) clear.onclick = () => S.P.set({ answer: null });
      },
    },
  },
});
