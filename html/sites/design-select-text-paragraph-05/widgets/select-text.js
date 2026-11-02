// This design uses a larger type scale and marks the full article text for its site CSS.
env.widget({
  task: 'select-text',
  site: 'design-select-text-paragraph-05',
  name: 'design',
  split: 'train',
  scenarios: ['paragraph'],
  traits: { pane: true, marks: true, triple: true },
  template: 'select-text/paragraphs',
  design: {
    fontMax: 30,
    fontDivisor: 33,
    parts: {
      text: (base, S) => (ctx) => {
        base(ctx);
        S.textEl.dataset.paragraphs = String(ctx.spec.paragraphs.length);
        if (!S.pane) S.textEl.classList.add('hl-full');
      },
    },
  },
});
