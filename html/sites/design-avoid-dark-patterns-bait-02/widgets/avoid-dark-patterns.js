// Design on the shared avoid-dark-patterns/browser template.
env.widget({
  task: 'avoid-dark-patterns',
  site: 'design-avoid-dark-patterns-bait-02',
  name: 'design',
  split: 'train',
  scenarios: ['bait'],
  template: 'avoid-dark-patterns/browser',
  design: {
    font: '13.5px/1.38 Arial, "Segoe UI", sans-serif',
    windowRadius: '0px',
    windowShadow: 'none',
    geometry: {
      margin: 8, minWidth: 0, minHeight: 0,
      widthBreakpoint: 900, widthMin: 0, widthMax: 10000, widthScale: [1, 1],
      heightBreakpoint: 560, heightMin: 0, heightMax: 10000, heightScale: [1, 1],
      sideBreakpoint: 900, sideNarrow: 240, sideRange: [255, 290],
    },
  },
});
