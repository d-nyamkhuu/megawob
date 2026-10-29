// This design adds the Carbon heading and clear action, and fills checkbox choices down columns.
env.widget({
  task: 'choose-option',
  site: 'design-choose-option-checkbox-01',
  name: 'design',
  split: 'train',
  scenarios: ['checkbox'],
  template: 'choose-option/widgets',
  design: {
    titleText: 'Available Topics',
    clearSelector: '.ds-carbon-clear',
    parts: {
      heading: (base, S) => (ctx, card) => {
        base(ctx, card);
        const title = card.firstElementChild;
        const sort = ctx.util.el('span', 'ds-sort', title);
        ctx.util.el('span', '', sort, 'Sort:');
        ctx.util.el('b', '', sort, 'A to Z');
      },
      choiceGrid: () => (ctx, group, n, cols) => {
        group.style.gridAutoFlow = 'column';
        group.style.gridTemplateRows = `repeat(${Math.ceil(n / cols)}, auto)`;
      },
    },
  },
});
