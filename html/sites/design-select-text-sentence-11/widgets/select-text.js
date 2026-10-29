// Design on templates/select-text/paragraphs.js.
env.widget({
  task: 'select-text',
  site: 'design-select-text-sentence-11',
  name: 'design',
  split: 'train',
  scenarios: ['sentence'],
  traits: { pane: true, marks: true },
  template: 'select-text/paragraphs',
  design: {
    fontMax: 26, fontDivisor: 46, sentenceRows: 'numbered', minFont: 6, clearSelection: true, roomMode: 'bounded',
    parts: {
      card: (base) => (ctx, el) => {
        base(ctx, el);
        el.classList.toggle('hl-dense', ctx.spec.paragraphs.length > 3);
      },
      paragraphsAfter: () => (ctx, sentenceCounts) => {
        const counts = [...new Set(sentenceCounts)].sort((a, b) => a - b);
        const countLabel = counts.map((n) => ({ 1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five' })[n] || String(n)).join(' or ');
        const countTip = document.querySelector('.dr-tips li:nth-child(2)');
        if (countTip) countTip.textContent = `Each paragraph has ${countLabel} sentences.`;
      },
      paneView: () => (ctx, avail, full) => Math.floor(Math.max(0, Math.min(avail, Math.max(160, full * ctx.rng.float(0.4, 0.62))))),
    },
  },
});
