// Design on templates/solve-puzzle/base.js: the base site's solve-puzzle widget for this scenario, unchanged.
// Restyle it in site.css, set the template's tokens and replace the parts the design draws differently
// (design: { parts: { name: (base, S) => replacement } }; templates/README.md).
env.widget({
  task: 'solve-puzzle',
  site: 'design-solve-puzzle-compute-05',
  name: 'design',
  split: 'train',
  scenarios: ['compute'],
  template: 'solve-puzzle/base',
  design: {
    parts: {
      numberField: (base, S) => function (...args) {
        const input = base(...args);
        input.removeAttribute('placeholder');
        return input;
      },
      buildCompute: (base, S) => function (ctx, body, avail) {
        base(ctx, body, avail);
        const grid = body.querySelector('.pz-offers');
        if (grid) grid.style.gridTemplateColumns = 'repeat(' + ctx.spec.cards.length + ', minmax(0, 1fr))';
        const label = body.querySelector('.pz-label');
        if (label) label.textContent = ctx.spec.mode === 'count' ? 'Number of rows' : 'Total amount';
        if (ctx.spec.mode === 'sum') {
          const input = body.querySelector('.pz-in');
          const currency = ctx.util.el('span', 'vw-currency', input.parentElement, '$');
          input.before(currency);
        }
        const tip = document.querySelector('.vw-tip > span:last-child');
        if (tip) {
          tip.replaceChildren();
          ctx.util.el('b', '', tip, 'Tip: ');
          tip.append(ctx.spec.mode === 'sum' ? 'Add all of the amounts in the table. Enter the total in the box above.' : ctx.spec.mode === 'count' ? 'Count the rows that match the question. Enter the number in the box above.' : 'Compare the details of each offer, then select your choice.');
        }
      },
    },
  },
});
