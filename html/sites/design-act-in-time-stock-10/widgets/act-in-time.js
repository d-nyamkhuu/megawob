// Adds the dated quote, live change, Shares label, and refreshed recent-price table.
env.widget({
  task: 'act-in-time',
  site: 'design-act-in-time-stock-10',
  name: 'design',
  split: 'train',
  scenarios: ['stock'],
  template: 'act-in-time/arena',
  design: {
    quantityLabel: 'Shares',
    parts: {
      quote: () => (ctx, quote) => {
        const { util } = ctx;
        const livechange = util.el('span', 'ds-livechange', quote);
        util.el('div', 'ds-market-time', quote, 'As of Apr 14, 2008  10:27 AM ET');
        return { livechange };
      },
      chrome: (base) => (ctx, root, history, up, sync) => {
        base(ctx, root, history, up, sync);
        const { spec } = ctx;
        const p0 = spec.prices[0];
        const recentRows = Array.from(document.querySelectorAll('.ds-recent-table tbody tr'));
        const recentVals = history.slice(-6);
        recentRows.forEach((tr, i) => {
          const value = recentVals[i] ?? p0;
          const change = value - (recentVals[i - 1] ?? value - 0.67);
          tr.cells[1].textContent = value.toFixed(2);
          tr.cells[2].textContent = (change >= 0 ? '+' : '') + change.toFixed(2);
          tr.cells[2].style.color = change >= 0 ? '#176324' : '#b01814';
        });
      },
      quoteSync: () => (ctx, { livechange }, history, m) => {
        const { spec } = ctx;
        const fam = env.taskDef;
        const k = fam.helpers.priceIndex(spec, m.t);
        const now = fam.helpers.priceAt(spec, m.t);
        const before = k > 0 ? spec.prices[k - 1] : history[history.length - 2];
        const delta = now - before;
        livechange.textContent =
          (delta >= 0 ? '▲ +' : '▼ ') +
          Math.abs(delta).toFixed(2) +
          ' (' +
          (delta >= 0 ? '+' : '') +
          ((100 * delta) / before).toFixed(2) +
          '%)';
      },
    },
  },
});
