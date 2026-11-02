// Adds flowing sentence spans and the original clear-selection helper.
env.widget({
  task: 'select-text',
  site: 'design-select-text-sentence-05',
  name: 'design',
  split: 'train',
  scenarios: ['sentence'],
  traits: { pane: true, marks: true },
  template: 'select-text/paragraphs',
  design: {
    fontDivisor: 40,
    sentenceRows: 'flow',
    clearSelection: true,
    parts: {
      afterFit: (base, S) => (ctx, room) => {
        if (S.card.getBoundingClientRect().height > room) {
          S.textEl.classList.add('hl-compact');
          while (S.card.getBoundingClientRect().height > room && S.font > 8) {
            S.font--;
            S.P.fit(ctx);
          }
        }
      },
    },
  },
});
