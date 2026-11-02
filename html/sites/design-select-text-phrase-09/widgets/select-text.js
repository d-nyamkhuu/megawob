// Preserves this site's proportional type size, pane fit, and clear-selection control.
env.widget({
  task: 'select-text',
  site: 'design-select-text-phrase-09',
  name: 'design',
  split: 'train',
  scenarios: ['phrase'],
  traits: { pane: true, marks: true },
  template: 'select-text/paragraphs',
  design: {
    fontMax: 30,
    fontDivisor: 49,
    clearSelection: true,
    parts: {
      paneChrome: (base, S) => () =>
        S.card.getBoundingClientRect().height - S.pane.parentElement.getBoundingClientRect().height,
    },
  },
});
