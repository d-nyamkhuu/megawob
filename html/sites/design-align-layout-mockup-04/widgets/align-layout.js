// Design of this site on the layout/canvas template (templates/align-layout/canvas.js).
env.widget({
  task: 'align-layout',
  site: 'design-align-layout-mockup-04',
  name: 'design',
  split: 'train',
  scenarios: ['mockup'],
  template: 'align-layout/canvas',
  design: {
    cardPadding: '0',
    cardGap: 0,
    bodyGap: 26,
    rulerHeight: 22,
    handleSize: 11,
    canvasCaption: '',
    mockupCaption: 'Reference (50%)',
    parts: {
      toolbar: (base, S) => (ctx) => {
        // The window toolbar supplies the decoration; preserve the title draw.
        ctx.rng.pick(S.D.titles[ctx.spec.scenario]);
        return null;
      },
      item: (base) => (...args) => {
        const item = base(...args);
        Object.assign(item.style, { alignItems: 'center', justifyContent: 'center', padding: '0' });
        return item;
      },
    },
  },
});
