// Design on the shared avoid-dark-patterns/browser template.
env.widget({
  task: 'avoid-dark-patterns',
  site: 'design-avoid-dark-patterns-trickq-02',
  name: 'design',
  split: 'train',
  scenarios: ['trickq'],
  template: 'avoid-dark-patterns/browser',
  design: {
    geometry: {
      margin: 8, minWidth: 0, minHeight: 0,
      widthBreakpoint: 900, widthMin: 880, widthMax: 1080, widthScale: [0.86, 1],
      heightBreakpoint: 560, heightMin: 540, heightMax: 660, heightScale: [0.9, 1],
      sideBreakpoint: 900, sideNarrow: 240, sideRange: [255, 290],
    },
    parts: {
      onCtl: (base, S) => (id) => {
        base(id);
        // The template's compact mode can hide its tab strip on a screen change.
        S.ctx.reanchor();
      },
    },
  },
});
