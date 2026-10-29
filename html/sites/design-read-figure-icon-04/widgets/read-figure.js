// Design on templates/read-figure/base.js: the base site's read-figure widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'read-figure',
  site: 'design-read-figure-icon-04',
  name: 'design',
  split: 'train',
  scenarios: ['icon'],
  template: 'read-figure/base',
  design: {
    parts: {
      'panel.traits': (base, S) => ({ glyphs: ['line'], contrast: ['normal'] }),
      buildIcon: (base, S) => (ctx, body, up, B) =>
        S.buildItemsBoard(ctx, body, up, B, Math.min(102, Math.floor(566 / ctx.spec.cols))),
    },
  },
});
