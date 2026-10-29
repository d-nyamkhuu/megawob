// Site design on the shared act-in-time/arena template.
env.widget({
  task: 'act-in-time',
  site: 'design-act-in-time-stock-09',
  name: 'design',
  split: 'train',
  scenarios: ['stock'],
  template: 'act-in-time/arena',
  design: {
    chartTitle: 'Price History',
    parts: {
      quote: () => (ctx, quote) => {
        const { util } = ctx;
        const change = util.el('strong', 'ds-live-change', quote);
        const updated = util.el('div', 'ds-updated', quote, 'Last Updated: Apr 23, 2001  10:24 AM');
        return { change };
      },
      stats: () => (ctx, quote) => {
        const { util, spec } = ctx;
        const fam = env.taskDef;
        const stats = util.el('dl', 'ds-market-stats', quote);
        [
          ['Open', spec.prices[0] - 0.23],
          ['Day High', Math.max(...spec.prices.slice(0, 1)) + 0.18],
          ['Day Low', spec.prices[0] - 0.28],
          ['Volume', '1,208,400'],
        ].forEach(([k, v]) => {
          util.el('dt', '', stats, k);
          util.el('dd', '', stats, typeof v === 'number' ? fam.helpers.fmt$(v) : v);
        });
      },
      chartTitle: () => (ctx, market) => {
        ctx.util.el('div', 'ds-chart-title', market, 'Price History (' + ctx.spec.symbol + ')');
      },
      chartX: () => (ctx, hist, i) => 45 + (i / (5 + (ctx.spec.T * 5) / 31 - 1)) * 640,
      afterAxes: () => (ctx, chart, X) => {
        const { util } = ctx;
        ['Apr 17', 'Apr 18', 'Apr 19', 'Apr 20', 'Apr 23'].forEach((d, i) => {
          const label = util.svg(
            'text',
            {
              x: X(i),
              y: 289,
              'text-anchor': i === 0 ? 'start' : i === 4 ? 'end' : 'middle',
              fill: '#435d7b',
              'font-size': 14,
            },
            chart,
          );
          label.textContent = d;
        });
      },
      recent: () => (ctx, market, hist) => {
        const { util } = ctx;
        const fam = env.taskDef;
        const recent = util.el('div', 'ds-recent', market);
        util.el('h3', '', recent, 'Recent Prices');
        const dateHead = util.el('span', 'ds-recent-head', recent, 'Date');
        const closeHead = util.el('span', 'ds-recent-head', recent, 'Close');
        hist.slice(-5).forEach((x, i) => {
          const cell = util.el('span', 'ds-recent-row', recent);
          util.el('small', '', cell, 'Day ' + (i + 1));
          util.el('b', '', cell, fam.helpers.fmt$(x));
        });
      },
      extraOrder: () => (ctx, root) => {
        const { util } = ctx;
        const status = util.el('section', 'ds-order-status', root);
        util.el('h3', '', status, 'Order Status');
        const table = util.el('div', 'ds-status-table', status);
        ['Time', 'Symbol', 'Action', 'Quantity', 'Status'].forEach((t) => util.el('span', '', table, t));
        util.el('div', 'ds-status-empty', status, 'No orders yet.');
      },
      samples: () => (ctx, hist, k) => [0, 7, 15, 23, 30].map((i) => hist[i]).concat(ctx.spec.prices.slice(1, k + 1)),
      quoteSync:
        () =>
        (ctx, { change }, hist, m) => {
          const { spec } = ctx;
          const fam = env.taskDef;
          const current = fam.helpers.priceAt(spec, m.t);
          const delta = current - spec.prices[0];
          change.textContent =
            (delta >= 0 ? '+' : '') +
            fam.helpers.fmt$(delta) +
            '  (' +
            (delta >= 0 ? '+' : '') +
            ((100 * delta) / spec.prices[0] || 0).toFixed(2) +
            '%)';
          change.className = 'ds-live-change ' + (delta >= 0 ? 'positive' : 'negative');
        },
    },
  },
});
