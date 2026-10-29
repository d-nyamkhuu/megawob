// Site design on find-fact/similar; shared widget code lives in templates/find-fact/similar.js.
env.widget({
  task: 'find-fact',
  site: 'design-find-fact-similar-12',
  name: 'design',
  split: 'train',
  scenarios: ['similar'],
  template: 'find-fact/similar',
  design: {
    parts: {
      wordCard: (base, S) => (ctx, c, body, work) => {
        const { spec } = ctx;
        c.style.minWidth = '0';
        c.classList.add('ds-synonyms');
        const step = document.querySelector('.ds-ol li:nth-child(2)');
        if (step && document.querySelector('.ds-wrap').dataset.instruction === 'header') step.textContent = `Select words similar to ${spec.given.join(', ')}.`;
        c.querySelector('h3').textContent = `Words similar to ${spec.given.join(', ')}:`;
      },
      grid: (base, S) => (ctx, c, body, grid) => {
        const { spec } = ctx;
        // The portal presents one shared, seeded candidate list in three reading
        // columns. Column placement does not imply a particular synonym pairing.
        const displayColumns = Math.min(3, spec.words.length);
        grid.style.setProperty('--word-columns', displayColumns);
        grid.dataset.columns = displayColumns;
        grid.style.setProperty('--word-rows', Math.ceil(spec.words.length / displayColumns));
      },
      ready: (base, S) => (ctx, B) => {
        const { spec } = ctx;
        const { c, grid, inputs, labels } = B;
        // Keep long seeded lists inside the existing fixed-height pane. The common
        // short list retains its original layout; only clipped lists gain columns.
        const paneBottom = ctx.stage.getBoundingClientRect().bottom;
        if (grid.getBoundingClientRect().bottom > paneBottom - 4) {
          const rowHeight = inputs[0][1].parentElement.getBoundingClientRect().height;
          const gap = parseFloat(getComputedStyle(grid).rowGap) || 0;
          const available = paneBottom - grid.getBoundingClientRect().top - 4;
          const fit = Math.max(1, Math.floor((available + gap) / (rowHeight + gap)));
          c.style.width = '100%';
          grid.style.setProperty('--word-rows', fit);
          grid.style.setProperty('--word-columns', Math.ceil(spec.words.length / fit));
          grid.dataset.columns = Math.ceil(spec.words.length / fit);
          grid.style.setProperty('grid-template-columns', `repeat(${Math.ceil(spec.words.length / fit)}, minmax(0, 1fr))`, 'important');
        }
        // Balance short lists across every displayed column (four words are 2/1/1,
        // rather than leaving the last column empty). DOM and scoring order stay intact.
        const shownColumns = Number(grid.style.getPropertyValue('--word-columns'));
        let item = 0;
        for (let column = 0; column < shownColumns; column++) {
          const count = Math.floor(inputs.length / shownColumns) + (column < inputs.length % shownColumns ? 1 : 0);
          for (let row = 0; row < count; row++) {
            const lab = labels[inputs[item++][0]];
            lab.style.gridColumn = String(column + 1);
            lab.style.gridRow = String(row + 1);
            lab.classList.toggle('later-column', column > 0);
          }
        }
      },
    },
  },
});
