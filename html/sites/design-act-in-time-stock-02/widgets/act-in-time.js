// This design uses a ticker-first order form, custom instructions, and accent-colored chart lines.
env.widget({
  task: 'act-in-time',
  site: 'design-act-in-time-stock-02',
  name: 'design',
  split: 'train',
  scenarios: ['stock'],
  template: 'act-in-time/arena',
  design: {
    namesClass: '',
    showStats: false,
    chartTitle: null,
    chartColor: 'var(--accent)',
    quantityLabel: 'Quantity',
    quantity: '1',
    symbolField: null,
    estimate: false,
    quick: false,
    parts: {
      orderFields: (base, S) => (ctx) => [
        ['Action', 'Buy'],
        ['Ticker', ctx.spec.symbol],
        ['Quantity', '1'],
        ['Order Type', 'Market'],
      ],
      notes: (base, S) => (ctx, root) => {
        const { util, spec } = ctx;
        const fam = env.taskDef;
        const notes = util.el('aside', 'ds-stocknotes', root);
        util.el('h3', '', notes, 'Instructions');
        const ol = util.el('ol', '', notes);
        [
          'Wait until the price of ' + spec.symbol + ' is below ' + fam.helpers.fmt$(spec.threshold) + '.',
          'Click the Buy button to place an order.',
          'Review the details if needed.',
          'Click Submit to complete the task.',
        ].forEach((t) => util.el('li', '', ol, t));
      },
      afterRender: (base, S) => (ctx, f) => {
        const stock = f.body.querySelector('.ds-stock');
        if (stock) {
          const box = stock.getBoundingClientRect();
          const stageTop = ctx.stage.getBoundingClientRect().top;
          const bottomPadding = parseFloat(getComputedStyle(f.body).paddingBottom) || 0;
          const available = Math.max(1, ctx.size.height - (box.top - stageTop) - bottomPadding);
          const buy = stock.querySelector('.ds-buy').getBoundingClientRect();
          if (buy.bottom - box.top > available) {
            const scale = Math.min(1, available / box.height);
            stock.style.width = `${box.width / scale}px`;
            stock.style.transformOrigin = 'top left';
            stock.style.transform = `scale(${scale})`;
          }
        }
      },
    },
  },
});
