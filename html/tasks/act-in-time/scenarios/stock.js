/*
 * act-in-time / stock: stock-market.
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('act-in-time');
  const C = env.content;
  const I = env.instruct;
  const { fmt$, priceAt, priceIndex, round2 } = fam.lib;

  function sampleStock(rng, beat, o) {
    const T = o.ood ? rng.int(18, 22) : rng.int(12, 16);
    const q = rng.int(3, T - 5);
    const d = rng.int(2, 3);
    const P0 = round2(rng.int(40, 60) + rng.float(0, 0.99));
    const th = round2(P0 - rng.float(1.5, 3.5));
    const hiLo = th + 0.4;
    const hiHi = P0 + 3;
    const prices = [P0];
    for (let k = 1; k < T; k++) {
      const prev = prices[k - 1];
      let p;
      if (k < q) {
        const goal = th + 0.6 + (P0 - th) * (1 - k / q) * 0.8;
        p = Math.min(hiHi, Math.max(hiLo, prev + 0.5 * (goal - prev) + rng.float(-0.9, 0.9)));
      } else if (k === q) p = th - rng.float(0.15, 1.0);
      else if (k < q + d) p = Math.min(th - 0.15, Math.max(th - 1.8, prev + rng.float(-0.8, 0.6)));
      else if (k === q + d) p = th + rng.float(0.4, 1.5);
      else p = Math.min(hiHi, Math.max(hiLo, prev + rng.float(-1.0, 1.2)));
      prices.push(round2(p));
    }
    const dip = prices.slice(q, q + d);
    const company = C.pick(rng, C.COMPANIES, { csplit: o.csplit });
    const letters = company.replace(/[^A-Za-z]/g, '').toUpperCase();
    const L = (letters + 'QXZW').split('');
    const symbol = L[0] + L[rng.int(1, 2)] + L[rng.int(3, Math.max(3, letters.length - 1))];
    return { symbol, company, prices, T, q, threshold: th, best: Math.min(...dip) };
  }

  const T_STOCK = ['Buy {sym} stock when the price is less than {p}.', 'Purchase {sym} once it drops below {p}.',
    'Wait for {sym} to trade under {p} and buy it then.', 'Buy one share of {company} ({sym}) as soon as it is below {p}.',
    'Click Buy for {sym} when the price falls under {p}.', 'Pick up {sym} under {p}; do not buy above that.',
    'Below {p} is your cue to buy {sym} stock.', 'Keep watching {sym}; buy it at a price lower than {p}.',
    'Check the quote for {sym} and buy if it is under {p}.',
    'Make a {sym} purchase only while its price is below {p}.', 'Your {sym} buy must be at less than {p}.'];

  env.scenario('act-in-time', {
    name: 'stock',
    sample: sampleStock,
    level(spec, lv) {
      // A higher buy threshold with the same best price: more of the dip (and some beats before it) is in range.
      spec.threshold = round2(spec.threshold + 0.8 * lv);
    },
    start() {
      return { t: 0, bought: null };
    },
    error: (model, spec) => round2((model.bought ? model.bought.price : Math.max(...spec.prices)) - spec.best),
    endedBy(model, spec) {
      const t = model.t;
      if (model.bought) return model.bought.price > spec.threshold ? 'bad-buy' : null;
      return t >= spec.T * spec.beat ? 'timeout' : null;
    },
    tolerance(spec) {
      const tau = round2(spec.threshold - spec.best);
      return { tau, sigma: tau + 1, minInitialError: tau + 0.3 };
    },
    plan(model, spec) {
      const t = model.t;
      if (model.bought) return null;
      return priceAt(spec, t) <= spec.threshold ? { click: { buy: true } } : { wait: true };
    },
    solveBy(spec, model, m) {
      const k = spec.prices.indexOf(spec.best);
      return { ...m, bought: { k, price: spec.best } };
    },
    phrase(spec, rng, pick, say) {
      return say(I.fill(pick(T_STOCK), { sym: spec.symbol, p: fmt$(spec.threshold), company: spec.company }), { terse: `buy ${spec.symbol} < ${fmt$(spec.threshold)}` });
    },
    judgeAsk(jr, spec, mk, cant) {
      let company = spec.company;
      let sym = spec.symbol;
      for (let k = 0; k < 40 && (sym === spec.symbol || company === spec.company); k++) {
        company = C.pick(jr, C.COMPANIES, { csplit: spec.csplit });
        sym = (company.replace(/[^A-Za-z]/g, '').toUpperCase() + 'QXZW').slice(0, 3);
      }
      return mk([sym, `${sym} stock`], T_STOCK, { sym, p: fmt$(spec.threshold), company }, cant(`${sym} is not listed here, this page only shows ${spec.symbol}`));
    },
    factRows(model, spec, f) {
      return !model.bought ? [] : [f('Bought at', fmt$(model.bought.price), ['Purchase price', 'Buy price']),
      f('Price now', fmt$(priceAt(spec, model.t)), ['Current price', 'Price']), f('Shares bought', '1', ['Shares', 'Quantity'])];
    },
    silentEdit(next, prev, spec, rng, m, out) {
      const beat = spec.beat;
      // The buy did not go through (the price must still be in range one beat later).
      if (!next.bought || prev.bought || next.t + beat >= spec.T * beat - 1e-9 || priceAt(spec, next.t + beat) > spec.threshold) return null;
      m.bought = null;
      return out(m);
    },
    retargetEdit(spec, model, rng, base, good) {
      const beat = spec.beat;
      // Another price to buy under, with the best price still ahead.
      if (model.bought || spec.prices.indexOf(spec.best) < priceIndex(spec, model.t + beat)) return null;
      for (let k = 0; k < 12; k++) {
        const th = round2(spec.best + rng.float(0.15, 2.6));
        if (Math.abs(th - spec.threshold) < 0.3) continue;
        const r = good({ ...base, threshold: th });
        if (r) return r;
      }
      return null;
    },
  });
})();
