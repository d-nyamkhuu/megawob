// This material design keeps its menu and adds a one-row shape board with a Clear control.
env.widget({
  task: 'read-figure',
  site: 'design-read-figure-shape-11',
  name: 'design',
  split: 'train',
  scenarios: ['shape'],
  template: 'read-figure/scene',
  design: {
    menuLabels: null,
    boardColumns: 1,
    boardRows: 1,
    smallScale: 0.4,
    parts: {
      rendered: (base, S) => (ctx) => {
        base(ctx);
        const clear = document.querySelector('.bottom .clear');
        if (clear) clear.addEventListener('click', () => S.P.set({ answer: null, clicks: [] }));
      },
    },
  },
});
