/* Adds the original long-label styling, Clear All handler, and stage-padding-aware overflow fit. */
env.widget({
  task: 'type-text',
  site: 'design-type-text-multi-08',
  name: 'design',
  split: 'train',
  scenarios: ['multi'],
  template: 'type-text/fields',
  design: {
    parts: {
      begin: (base, S) => (ctx) => {
        base(ctx);
        const clear = document.querySelector('.ds-clear');
        if (clear) clear.addEventListener('click', () => S.P.clear());
      },
      labelClass: () => (text, look) => 'ft-label' + (look.caps ? ' caps' : '') + (text.length > 20 ? ' ft-long' : ''),
      fit: (base, S) => (ctx, card) => {
        const availableHeight = ctx.size.height - parseFloat(getComputedStyle(ctx.stage).paddingTop) - 8;
        if (card.offsetHeight > availableHeight) {
          const grid = card.querySelector('.ft-grid');
          grid.classList.remove('inline');
          grid.classList.add('columns');
          grid.style.setProperty('grid-template-columns', '1fr 1fr', 'important');
        }
        const cr = card.getBoundingClientRect();
        const ratio = Math.min(1, availableHeight / cr.height);
        if (ratio < 1) {
          card.style.setProperty('transform', `scale(${ratio})`, 'important');
          card.style.transformOrigin = 'top center';
        }
      },
    },
  },
});
