// Design on templates/select-text/paragraphs.js.
env.widget({
  task: 'select-text',
  site: 'design-select-text-phrase-12',
  name: 'design',
  split: 'train',
  scenarios: ['phrase'],
  traits: { pane: true, marks: true },
  template: 'select-text/paragraphs',
  design: {
    fontDivisor: 42, lineHeight: 1.4, dragEndpoints: 'button',
    parts: {
      paneChrome: (base, S) => () => S.head.getBoundingClientRect().height + (S.card.querySelector('.hl-foot')?.getBoundingClientRect().height || 0) + 1,
      prepareFull: (base, S) => (ctx, room) => {
        S.textEl.style.height = Math.max(0, room - S.head.getBoundingClientRect().height) + 'px';
      },
    },
  },
});
