// Sentence design: narrower type and a pane expanded to the available stage height.
env.widget({
  task: 'select-text',
  site: 'design-select-text-sentence-10',
  name: 'design',
  split: 'train',
  scenarios: ['sentence'],
  traits: { pane: true, marks: true, triple: true },
  template: 'select-text/paragraphs',
  design: {
    fontMax: 26,
    fontDivisor: 36,
    parts: {
      paneView: (base) => (ctx, avail, full) => Math.max(base(ctx, avail, full), Math.floor(avail)),
      rendered: (base, S) => () => {
        if (S.pane) return;
        const scroll = S.ctx.util.el('div', 'gem-scroll', S.ctx.stage);
        S.ctx.util.el('div', 'gem-scroll-up', scroll, '▲');
        S.ctx.util.el('div', 'gem-scroll-thumb', scroll);
        S.ctx.util.el('div', 'gem-scroll-down', scroll, '▼');
      },
    },
  },
});
