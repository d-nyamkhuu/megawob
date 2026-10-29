// Design of this site on the layout/canvas template (templates/align-layout/canvas.js).
env.widget({
  task: 'align-layout',
  site: 'design-align-layout-mockup-01',
  name: 'design',
  split: 'train',
  scenarios: ['mockup'],
  template: 'align-layout/canvas',
  design: {
    mockupCaption: 'Reference (50%)',
    canvasCaption: 'Canvas (100%)',
    cardGap: 0,
    cardPadding: '0',
    bodyGap: 18,
    rulerHeight: 26,
    parts: {
      toolbar: (base) => (ctx, card) => {
        const bar = base(ctx, card);
        bar.style.display = 'none';
        return bar;
      },
      body: (base) => (ctx, card) => {
        const body = base(ctx, card);
        body.style.flexDirection = 'row-reverse';
        return body;
      },
      pane: (base) => (ctx, parent, caption) => {
        const pane = base(ctx, parent, caption);
        pane.style.padding = '12px 12px 16px';
        return pane;
      },
    },
  },
});
