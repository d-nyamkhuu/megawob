// Design on the shared avoid-dark-patterns/browser template.
env.widget({
  task: 'avoid-dark-patterns',
  site: 'design-avoid-dark-patterns-disguised-03',
  name: 'design',
  split: 'train',
  scenarios: ['disguised'],
  template: 'avoid-dark-patterns/browser',
  design: {
    font: '13.5px/1.38 Georgia, "Times New Roman", serif',
    windowRadius: '17px',
    windowShadow: '0 2px 5px #563c2340, inset 0 1px #fff',
    geometry: {
      margin: 8, minWidth: 0, minHeight: 0, widthBreakpoint: 900,
      widthMin: 880, widthMax: 1080, widthScale: [0.86, 1],
      heightBreakpoint: 560, heightMin: 540, heightMax: 660,
      heightScale: [0.9, 1], sideBreakpoint: 900, sideNarrow: 240,
      sideRange: [255, 290],
    },
    colors: {
      '--fg': '#49321f', '--panel': '#fbf3e3', '--bg': '#f7ecd5',
      '--line': '#d5c09a', '--muted': '#70583f', '--b': '#145da5',
    },
    parts: {
      paint: (base, S) => function (model) {
        const compact = S.win.classList.contains('c2');
        base(model);
        // The template's fitting pass can toggle the tab strip between screens.
        if (compact !== S.win.classList.contains('c2')) S.ctx.reanchor();
      },
    },
  },
});
