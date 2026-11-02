// Keeps the sentence design's larger type, full-board fit, and live selection readout.
env.widget({
  task: 'select-text',
  site: 'design-select-text-sentence-02',
  name: 'design',
  split: 'train',
  scenarios: ['sentence'],
  traits: { pane: true, marks: true },
  template: 'select-text/paragraphs',
  design: {
    fontMax: 30,
    fontDivisor: 52,
    clearSelection: true,
    parts: {
      prepareFull: (base, S) => (ctx, room) => {
        S.card.style.height = room + 'px';
        S.textEl.style.height = '100%';
        S.textEl.classList.add('hl-board-flow');
      },
      overflows: (base, S) => (ctx, room) =>
        S.card.getBoundingClientRect().height > room ||
        [...S.textEl.children].some((p) => p.scrollHeight > p.clientHeight),
      show: () => (m) => {
        const value = document.querySelector('.selinfo .val');
        if (value) value.textContent = m.start === m.end ? 'None' : `${Math.abs(m.end - m.start)} characters`;
      },
      bound: (base, S) => (ctx) => {
        base(ctx);
        S.P.show(ctx.model);
      },
    },
  },
});
