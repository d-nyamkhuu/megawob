// Design restores this site's narrower type, padded fit room, native selection reads, and catalog selection.
env.widget({
  task: 'select-text',
  site: 'design-select-text-phrase-10',
  name: 'design',
  split: 'train',
  scenarios: ['phrase'],
  traits: { pane: true, marks: true, triple: true },
  template: 'select-text/paragraphs',
  design: {
    readKeyup: true,
    tripleClick: 'nearest',
    parts: {
      font: () => (ctx) => Math.min(24, Math.round(ctx.stage.clientWidth / 53)),
      room: () => (ctx) => {
        const stageStyle = getComputedStyle(ctx.stage);
        const cardStyle = getComputedStyle(ctx.stage.querySelector('.hl-card'));
        return ctx.stage.clientHeight - parseFloat(stageStyle.paddingTop) - parseFloat(stageStyle.paddingBottom) -
          parseFloat(cardStyle.paddingTop) - parseFloat(cardStyle.paddingBottom);
      },
      prepareFull: () => () => {},
      overflows: (base, S) => (_ctx, room) => S.textEl.getBoundingClientRect().height > room + 1,
      bound: (base, S) => (ctx) => {
        S.textEl.addEventListener('catalog-selection', (event) => {
          const next = { ...ctx.model, start: 0, end: event.detail === 'Select All' ? ctx.spec.doc.length : 0 };
          S.sel.set(next);
          ctx.update(next);
        });
      },
    },
  },
});
