/* act-in-time/_arena-stock: shared template implementation; parts remain on the calling template. */
(function () {
  'use strict';
  function buildStock(S, ctx, f, up) {
    const { util, spec } = ctx;
    const fam = env.taskDef;
    const root = util.el('div', 'ds-stock', f.body);
    const market = util.el('section', 'ds-market', root);
    const quote = util.el('div', 'ds-quote', market);
    const names = util.el('div', S.D.namesClass, quote);
    util.el('h2', '', names, spec.symbol);
    util.el('div', '', names, spec.company);
    const price = util.el('strong', 'ds-liveprice', quote);
    const quoteExtra = S.P.quote(ctx, quote);
    S.P.stats(ctx, quote);
    S.P.chartTitle(ctx, market);
    const chart = util.svg(
      'svg',
      { class: 'ds-stockchart', viewBox: '0 0 700 300', preserveAspectRatio: 'none' },
      market,
    );
    const hist = S.P.history(ctx);
    const p0 = spec.prices[0];
    const lo = Math.floor(Math.min(...hist, p0, spec.threshold) - 2),
      hi = Math.ceil(Math.max(...hist, p0) + 2);
    const X = (i) => S.P.chartX(ctx, hist, i);
    const Y = (p) => S.P.chartY(ctx, lo, hi, p);
    S.P.axes(ctx, chart, X, Y, lo, hi);
    S.P.afterAxes(ctx, chart, X, Y);
    const target = util.svg(
      'line',
      {
        x1: 45,
        x2: 685,
        y1: Y(spec.threshold),
        y2: Y(spec.threshold),
        stroke: 'var(--accent)',
        'stroke-dasharray': '8 5',
        'stroke-width': 1.6,
      },
      chart,
    );
    const line = util.svg('polyline', { fill: 'none', stroke: S.D.chartColor, 'stroke-width': 2.5 }, chart);
    const point = util.svg('circle', { r: 5, fill: S.D.chartColor }, chart);
    const legend = util.el('div', 'ds-targetprice', market, 'Target ' + fam.helpers.fmt$(spec.threshold));
    S.P.recent(ctx, market, hist);
    const order = util.el('section', 'ds-order', root);
    util.el('h3', '', order, 'Place Order');
    const fields = util.el('div', 'ds-orderfields', order);
    S.P.orderFields(ctx).forEach(([k, v]) => {
      const label = util.el('label', '', fields, k);
      util.el('div', 'ds-orderfield', label, v);
    });
    const estimated = S.P.estimate(ctx, order);
    const buy = util.el('button', 'ds-buy', order, 'Buy');
    buy.type = 'button';
    const result = util.el('div', 'ds-orderresult', order);
    S.P.notes(ctx, root);
    S.P.extraOrder(ctx, root);
    S.P.chrome(ctx, root, hist, up, sync);
    const buttons = env.ui.buttons([buy], {
      keys: ['buy'],
      disabled: () => !!ctx.model.bought,
      onClick: () => {
        const t = ctx.model.t;
        up({ bought: { k: fam.helpers.priceIndex(spec, t), price: fam.helpers.priceAt(spec, t) } });
        sync(ctx.model);
      },
      mark: () => {},
    });
    function sync(m) {
      const k = fam.helpers.priceIndex(spec, m.t);
      const all = S.P.samples(ctx, hist, k);
      line.setAttribute('points', all.map((p, i) => `${X(i)},${Y(p)}`).join(' '));
      point.setAttribute('cx', X(all.length - 1));
      point.setAttribute('cy', Y(all[all.length - 1]));
      price.textContent = fam.helpers.fmt$(fam.helpers.priceAt(spec, m.t));
      S.P.quoteSync(ctx, quoteExtra, hist, m);
      if (estimated) estimated.textContent = 'Estimated Cost    ' + fam.helpers.fmt$(100 * fam.helpers.priceAt(spec, m.t));
      buy.textContent = m.bought ? 'Bought' : 'Buy';
      buy.setAttribute('aria-disabled', String(!!m.bought));
      result.textContent = m.bought ? 'Order placed at ' + fam.helpers.fmt$(m.bought.price) : 'Not submitted';
      f.setStatus(spec.symbol + ' ' + price.textContent);
      S.P.stockSync(ctx, { root, buy }, m);
    }
    return { sync, locate: (t) => (t.buy ? buttons.locate('buy') : null) };
  }

  function installStock(BASE, S, V, constants) {
    if (V === 'stock') {
      BASE.build = (ctx, f, up) => buildStock(S, ctx, f, up);

      BASE.quote = (ctx, quote) => ({});

      BASE.stats = (ctx, quote) => {
        if (!S.D.showStats) return;
        const { util, spec } = ctx;
        const stats = util.el('dl', 'ds-market-stats', quote);
        [
          ['Day High', Math.max(...spec.prices.slice(0, 1)) + 0.18],
          ['Day Low', spec.prices[0] - 0.28],
          ['Open', spec.prices[0] - 0.23],
          ['Prev Close', spec.prices[0] - 0.42],
        ].forEach(([k, v]) => {
          util.el('dt', '', stats, k);
          util.el('dd', '', stats, env.taskDef.helpers.fmt$(v));
        });
      };

      BASE.chartTitle = (ctx, market) => {
        if (S.D.chartTitle !== null) ctx.util.el('div', 'ds-chart-title', market, S.D.chartTitle);
      };

      BASE.history = (ctx) => {
        const hrng = ctx.rng.fork('historical-prices');
        const p0 = ctx.spec.prices[0];
        let v = p0 - 1.8;
        let hist = [];
        for (let i = 0; i < 31; i++) {
          v += hrng.float(-0.25, 0.34);
          hist.push(v);
        }
        const shift = p0 - hist[hist.length - 1];
        return hist.map((x) => x + shift);
      };

      BASE.chartX = (ctx, hist, i) => 45 + (i / (hist.length + ctx.spec.T - 1)) * 640;

      BASE.chartY = (ctx, lo, hi, p) => 260 - ((p - lo) / (hi - lo)) * 235;

      BASE.axes = (ctx, chart, X, Y, lo, hi) => {
        const { util } = ctx;
        for (let value = lo; value <= hi; value += 1) {
          util.svg('line', { x1: 45, x2: 685, y1: Y(value), y2: Y(value), stroke: '#dde0e2', 'stroke-width': 1 }, chart);
          const label = util.svg(
            'text',
            { x: 37, y: Y(value) + 5, 'text-anchor': 'end', fill: '#6c7480', 'font-size': 15 },
            chart,
          );
          label.textContent = value.toFixed(1);
        }
      };

      BASE.afterAxes = (ctx, chart, X, Y) => {};

      BASE.recent = (ctx, market, hist) => {
        const { util } = ctx;
        const recent = util.el('div', 'ds-recent', market);
        util.el('h3', '', recent, 'Recent Prices');
        hist.slice(-6).forEach((x, i) => {
          const cell = util.el('span', '', recent);
          util.el('small', '', cell, 'Day ' + (i + 1));
          util.el('b', '', cell, env.taskDef.helpers.fmt$(x));
        });
      };

      BASE.orderFields = (ctx) => {
        const entries = [
          ['Action', 'Buy'],
          [S.D.quantityLabel, S.D.quantity],
          ['Order Type', 'Market'],
        ];
        if (S.D.symbolField) entries.unshift([S.D.symbolField, ctx.spec.symbol]);
        return entries;
      };

      BASE.estimate = (ctx, order) => {
        if (!S.D.estimate) return null;
        const estimate = ctx.util.el('div', 'ds-order-estimate', order);
        const estimated = ctx.util.el('div', '', estimate);
        ctx.util.el('div', '', estimate, 'Buying Power     $12,430.00');
        return estimated;
      };

      BASE.notes = (ctx, root) => {
        const { util, spec } = ctx;
        const notes = util.el('aside', 'ds-stocknotes', root);
        util.el('h3', '', notes, 'Notes');
        const ol = util.el('ol', '', notes);
        [
          'Wait until the price is below ' + env.taskDef.helpers.fmt$(spec.threshold) + '.',
          'Then click Buy and review the order details.',
          'Click Submit to place the order.',
          'Do not buy while the price is above ' + env.taskDef.helpers.fmt$(spec.threshold) + '.',
        ].forEach((t) => util.el('li', '', ol, t));
      };

      BASE.extraOrder = (ctx, root) => {};

      BASE.chrome = (ctx, root, hist, up, sync) => {
        const { util, spec } = ctx;
        const quick = S.D.quick && document.querySelector('.ds-quick-values');
        if (quick) {
          quick.replaceChildren();
          ['Watch ' + spec.symbol, 'Buy if price < ' + env.taskDef.helpers.fmt$(spec.threshold), 'Then Submit'].forEach((t) =>
            util.el('li', '', quick, t),
          );
        }
        const clear = S.D.quick && document.querySelector('.ds-clear');
        if (clear)
          clear.onclick = () => {
            up({ bought: null });
            sync(ctx.model);
          };
      };

      BASE.samples = (ctx, hist, k) => hist.concat(ctx.spec.prices.slice(1, k + 1));

      BASE.quoteSync = (ctx, extra, hist, m) => {};

      BASE.stockSync = (ctx, layout, m) => {};
    }
  }
  env.template('act-in-time/_arena-stock', () => ({ installStock }));
})();
