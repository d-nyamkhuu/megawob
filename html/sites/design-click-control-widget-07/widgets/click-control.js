// Design of this site on click-control/controls: viewport-aware widget columns, fit-to-content grids, and local headings.
env.widget({
  task: 'click-control',
  site: 'design-click-control-widget-07',
  name: 'design',
  split: 'train',
  scenarios: ['widget'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {
    headings: { text: 'Name:', textarea: 'Message:', radio: 'Theme:', checkbox: '', button: 'Action:', other: 'Learn more:' },
    parts: {
      widgetCols: (base) => (ctx, r) => (
        ctx.spec.widgets.length * Math.min(50, ctx.size.height * 0.082) > r.height ? 2 : 1
      ),
      widgetGrid: (base) => (ctx, card, cols) => {
        card.style.gridTemplateColumns = `repeat(${cols}, max-content)`;
        card.style.gridTemplateRows = `repeat(${Math.ceil(ctx.spec.widgets.length / cols)}, minmax(0, 1fr))`;
        card.style.minWidth = cols === 1 ? '300px' : '';
      },
      widgetsBuilt: () => (ctx, card, rows, r) => {
        const overflows = (el) => {
          const bounds = el.getBoundingClientRect();
          return bounds.right > r.right + 0.5 || bounds.left < r.left - 0.5;
        };
        if (
          card.getBoundingClientRect().width > r.width ||
          rows.some((row) => overflows(row) || Array.from(row.children).some(overflows))
        ) {
          const cols = ctx.spec.widgets.length * Math.min(50, ctx.size.height * 0.082) > r.height ? 2 : 1;
          card.classList.add('fit-grid');
          card.style.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;
          card.style.minWidth = '0';
          card.style.maxWidth = '100%';
        }
      },
    },
  },
});
