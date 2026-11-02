/*
 * solve-puzzle / compute: compute from page data (sum, count, pick an offer).
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('solve-puzzle');
  const { keepIdx } = env.util;
  const { C, parseNumber, say, txt, typedPlan, typedSilent, typedStart } = fam.lib;

  const money = (x) => `$${x.toFixed(2)}`;

  const EXPENSE_CATS = [
    'Travel', 'Meals', 'Office', 'Software', 'Training', 'Shipping', 'Rent', 'Repairs', 'Telecom', 'Events', 'Fuel',
    'Security', 'Cleaning', 'Hardware', 'Printing', 'Storage', 'Research', 'Permits', 'Legal', 'Payroll', 'Uniforms',
    'Hosting', 'Design', 'Disposal'
  ];

  const STATUS = ['Paid', 'Pending', 'Overdue', 'Shipped', 'Delivered', 'Cancelled'];

  const CRIT = {
    cheapest: { label: 'cheapest', key: (c) => c.price, dir: 1 },
    priciest: { label: 'most expensive', key: (c) => c.price, dir: -1 },
    rated: { label: 'best-rated', key: (c) => c.rating, dir: -1 },
    fastest: { label: 'fastest-shipping', key: (c) => c.days, dir: 1 },
  };

  function sampleCompute(rng, spec) {
    const mode = rng.pick(['sum', 'sum', 'count', 'pick', 'pick']);
    const cs = { csplit: spec.csplit };
    if (mode === 'pick') {
      const n = spec.ood ? rng.int(7, 9) : rng.int(3, 6);
      const crit = rng.pick(Object.keys(CRIT));
      for (;;) {
        const prods = C.sample(rng, C.PRODUCTS.filter((p) => p.name.length <= 30), n, cs);
        const cards = prods.map((p) => ({ name: p.name, price: C.price(rng, p).amount, rating: rng.int(28, 50) / 10, days: rng.int(1, 9) }));
        const vals = cards.map(CRIT[crit].key);
        const best = CRIT[crit].dir > 0 ? Math.min(...vals) : Math.max(...vals);
        if (vals.filter((v) => v === best).length !== 1 || new Set(vals).size < Math.min(n, 3)) continue;
        return { mode, crit, title: rng.pick([
          'Compare offers', 'Choose a product', 'Pick one', 'Offers', 'Offer menu', 'Product list', 'Your choice',
          'Offer picks'
        ]), cards, target: vals.indexOf(best) };
      }
    }
    const n = spec.ood ? rng.int(9, 12) : rng.int(4, 7);
    const cents = rng.bool(0.35);
    if (mode === 'sum') {
      const report = rng.bool(0.5);
      const rows = [];
      for (let i = 0; i < n; i++) {
        const amt = cents ? rng.int(500, 40000) / 100 : rng.int(5, 400);
        const item = report ? rng.pick(['Taxi to airport', 'Hotel night', 'Team lunch', 'Train ticket', 'Printer paper', 'License renewal',
          'Conference pass', 'Courier', 'Client dinner', 'Parking', 'Monitor stand', 'Online course', 'Coffee beans', 'Cloud storage',
          'Desk lamp', 'Notebook set', 'Filing cabinet', 'USB cable', 'Packing tape', 'Shipping label', 'Bike rental',
          'Rideshare home', 'Meeting room', 'Workshop fee', 'Reference book', 'Postage stamps', 'Name badges',
          'Folding chairs', 'Tablecloth', 'Water bottles', 'Snack platter', 'Fruit basket', 'Tea assortment',
          'Dish soap', 'Hand towels', 'Light bulbs', 'Extension cord', 'Wall clock', 'Door sign', 'Plant pot',
          'Window cleaning', 'Car wash', 'Luggage storage', 'Phone charger', 'Data backup', 'Domain renewal',
          'Design software', 'Audio adapter', 'Webcam cover', 'Battery pack', 'Storage boxes', 'Airport shuttle',
          'Safety training', 'Team offsite', 'Record storage', 'Desk organizer', 'Floor mat', 'Customs fee',
          'Local delivery', 'Photo printing', 'Water filter', 'Curtain rod', 'Cable ties', 'Tool set', 'Garden mulch',
          'Snow removal', 'Tire change', 'Paper shredding', 'Donation pickup', 'Stage lighting', 'Badge holders',
          'Travel adapter', 'Laptop sleeve', 'Tablet rental', 'Server hosting', 'Venue deposit', 'Poster printing',
          'Foam board', 'Volunteer meals', 'Office snacks', 'Reusable cups', 'Serving trays', 'Napkin supply',
          'Carpet cleaning', 'Key duplication', 'Ferry fare', 'Checked baggage', 'Mail forwarding', 'Storage unit',
          'Moving cartons', 'Safety signage', 'Backdrop rental'])
          : C.pick(rng, C.PRODUCTS, cs).name;
        rows.push([item, report ? rng.pick(EXPENSE_CATS) : String(rng.int(1, 4)), amt]);
      }
      const cat = report && rng.bool(0.5) ? rng.pick(rows.map((r) => r[1])) : null;
      const sel = rows.filter((r) => !cat || r[1] === cat);
      const answer = Math.round(sel.reduce((a, r) => a + r[2], 0) * 100) / 100;
      return { mode, cents, title: report ? rng.pick([
        'Expense report', 'Trip expenses', 'Reimbursement claim', 'Expense summary', 'Claim paperwork'
      ]) : rng.pick(['Invoice', 'Order summary', 'Quote']),
        cols: report ? ['Item', 'Category', 'Amount'] : ['Item', 'Qty', 'Amount'], rows: rows.map((r) => [r[0], r[1], cents ? money(r[2]) : `$${r[2]}`]),
        money: 2, cat, answer, unit: sel.reduce((a, r) => a + r[2], 0) / sel.length };
    }
    const rows = [];
    for (let i = 0; i < n; i++) {
      const id = `#${rng.int(10200, 98999)}`;
      rows.push([id, C.personName(rng, cs).full, rng.pick(STATUS.slice(0, 4)), money(rng.int(900, 30000) / 100)]);
    }
    const status = rng.pick(rows.map((r) => r[2]));
    const answer = rows.filter((r) => r[2] === status).length;
    return { mode, title: rng.pick([
      'Invoices', 'Orders this week', 'Payments', 'Order file', 'Sales list', 'Payment log'
    ]), cols: ['ID', 'Customer', 'Status', 'Amount'], rows, money: 3, status, answer, unit: 2 };
  }

  const cmpRank = (spec, i) => {
    const c = CRIT[spec.crit];
    const key = (k) => c.dir * c.key(spec.cards[k]);
    return spec.cards.filter((_, k) => key(k) < key(i)).length;
  };

  env.scenario('solve-puzzle', {
    name: 'compute',
    sample: sampleCompute,
    level(spec, r, { k }) {
      if (spec.mode === 'pick') {
        const keep = keepIdx(r, spec.cards.length, [spec.target], k(2, 3));
        spec.cards = keep.map((i) => spec.cards[i]);
        spec.target = keep.indexOf(spec.target);
      } else if (spec.mode === 'sum') {
        const sel = spec.rows.map((x, i) => (!spec.cat || x[1] === spec.cat ? i : -1)).filter((i) => i >= 0);
        const must = sel.slice(0, k(3, 4));
        const keep = keepIdx(r, spec.rows.length, must, spec.cat ? k(1, 2) : k(0, 0));
        const rows = keep.map((i) => spec.rows[i]);
        const picked = rows.filter((x) => !spec.cat || x[1] === spec.cat).map((x) => parseNumber(x[spec.money]));
        spec.rows = rows;
        spec.answer = Math.round(picked.reduce((a, v) => a + v, 0) * 100) / 100;
        spec.unit = picked.reduce((a, v) => a + v, 0) / picked.length;
      } else {
        const hit = spec.rows.map((x, i) => (x[2] === spec.status ? i : -1)).filter((i) => i >= 0);
        const keep = keepIdx(r, spec.rows.length, r.sample(hit, Math.min(hit.length, k(2, 3))), k(2, 2));
        spec.rows = keep.map((i) => spec.rows[i]);
        spec.answer = spec.rows.filter((x) => x[2] === spec.status).length;
      }
    },
    judge(jr, spec, ph) {
      if (spec.mode === 'pick') {
        const attr = jr.pick([
          'warranty', 'battery life', 'weight', 'color options', 'shelf life', 'cord length', 'trial period',
          'uptime'
        ]);
        return ph(['Select the offer with the best {attr}.', 'Choose the product with the longest {attr}.'], { attr }, `the offers show no ${attr} information.`, [attr]);
      }
      const col = jr.pick(['Tax', 'Discount', 'Priority', 'Weight', 'Risk', 'Demand', 'Pressure', 'Density']);
      return spec.mode === 'sum'
        ? ph(['Add up the {col} column.', 'What is the total of the {col} column? Type it in.'], { col }, `the table has no ${col} column.`, [`${col} column`, col])
        : ph(['Count the rows whose {col} is High.', 'How many rows have a {col} of High? Type the number.'], { col }, `the table has no ${col} column.`, [`${col} column`, col]);
    },
    base(spec) {
      return spec.mode === 'pick' ? { chosen: null } : { answer: '' };
    },
    start(spec, m, mode, rng) {
      if (spec.mode === 'pick') {
        if (mode === 'wrong') m.chosen = spec.cards.findIndex((_, i) => cmpRank(spec, i) === 1);
        return m;
      }
      if (mode === 'partial' && spec.mode === 'sum') {
        const half = spec.rows.slice(0, Math.ceil(spec.rows.length / 2)).filter((r) => !spec.cat || r[1] === spec.cat);
        const sub = Math.round(half.reduce((a, r) => a + parseNumber(r[2]), 0) * 100) / 100;
        m.answer = sub !== spec.answer ? String(sub) : '';
        return m;
      }
      return typedStart(spec, m, mode, rng);
    },
    tolerance(spec) {
      if (spec.mode === 'pick') return { tau: 0, sigma: 0.35, minInitialError: 0.2 };
      return spec.mode === 'sum' ? { tau: 0.004, sigma: Math.max(1, spec.unit / 2), minInitialError: 0.5 } : { tau: 0, sigma: 1 };
    },
    error(model, spec) {
      if (spec.mode === 'pick') return model.chosen === null || model.chosen === undefined ? 1 : cmpRank(spec, model.chosen) / Math.max(1, spec.cards.length - 1);
      const v = parseNumber(model.answer);
      return v === null ? Math.abs(spec.answer) + 10 : Math.round(Math.abs(v - spec.answer) * 1000) / 1000;
    },
    instruction(spec, rng) {
      if (spec.mode === 'pick') {
        const crit = CRIT[spec.crit].label;
        return say(rng, spec, ['Select the {crit} option.', 'Choose the {crit} of the offers.', 'Pick the {crit} offer.',
          'Compare the cards and select the {crit} one.', 'Which of these offers is the {crit} one? Select it.', 'Go with the {crit} item: click its select button.',
          'The {crit} offer is the one to select.', 'Make your selection: the {crit} offer.',
          'Find which offer is {crit} and pick it.', 'Use the select button for the {crit} card.'],
        { crit }, { terse: `${crit} one` });
      }
      if (spec.mode === 'count') {
        return say(rng, spec, ['Count the rows with status {st} and type the number.', 'How many entries are marked {st}? Type the count.',
          'Enter the number of {st} rows in the table.', 'Type how many items have the status {st}.', 'Count every {st} entry and enter the total.',
          'What is the number of rows whose status is {st}? Type it.',
          'Only rows marked {st} count. Type how many.',
          'Enter the row count for {st} in the answer field.',
          'Each row marked {st} adds one. Enter the count.'], { st: `"${spec.status}"` }, { terse: `count of ${spec.status}` });
      }
      const what = spec.cat ? `the ${spec.cat} amounts` : rng.pick([
        'all amounts', 'the Amount column', 'every amount', 'each Amount cell', 'row amounts', 'Amount values'
      ]);
      return say(rng, spec, ['Add up {what} in the table and type the total.', 'Type the sum of {what}.', 'What is the total of {what}? Enter it.',
        'Compute the total of {what} and enter it.', 'Enter the sum of {what} on the {title}.', 'Total {what} and type the result.',
        'Find the combined value of {what}. Enter it.'],
      { what, title: spec.title.toLowerCase() }, { terse: `total of ${what}` });
    },
    plan(model, spec) {
      if (spec.mode === 'pick') return model.chosen === spec.target ? null : { click: { card: spec.target } };
      return typedPlan(model, spec, spec.mode === 'sum' && spec.cents ? spec.answer.toFixed(2) : String(spec.answer));
    },
    simulate(model, spec, step) {
      if (step.type) return { ...model, answer: step.type[1] };
      if (step.click.card !== undefined) return { chosen: step.click.card };
    },
    facts(model, spec) {
      if (spec.mode === 'pick') {
        if (model.chosen === null || model.chosen === undefined) return [];
        const c = spec.cards[model.chosen];
        return [{ label: 'Selected offer', value: c.name, labels: ['Selected', 'Chosen offer', 'Product'] }, { label: 'Price', value: `$${c.price.toFixed(2)}`, labels: ['Offer price'], aliases: [c.price.toFixed(2)] }];
      }
      if (!txt(model.answer)) return [];
      return [{ label: spec.mode === 'sum' ? 'Total' : 'Count', value: txt(model.answer), labels: ['Answer', 'Result'] }];
    },
    silent(next, prev, spec, rng, pick) {
      if (spec.mode !== 'pick') return typedSilent(next, pick);
      if (next.chosen === null || next.chosen === undefined) return null;
      const n = spec.cards.length;
      const opts = [1, -1, 2, -2].map((d) => (next.chosen + d + n) % n).filter((i) => i !== next.chosen);
      return pick({ ...next, chosen: rng.pick(opts) });
    },
    retarget(spec, model, rng) {
      let out = null;
      if (spec.mode === 'pick') {
        const crits = Object.keys(CRIT).filter((c) => c !== spec.crit);
        for (const crit of rng.shuffle(crits)) {
          const vals = spec.cards.map(CRIT[crit].key);
          const best = CRIT[crit].dir > 0 ? Math.min(...vals) : Math.max(...vals);
          if (vals.filter((x) => x === best).length === 1) {
            out = { ...spec, crit, target: vals.indexOf(best) };
            break;
          }
        }
      } else if (spec.mode === 'sum' && spec.cols[1] === 'Category') {
        const cats = [...new Set(spec.rows.map((r) => r[1]))].filter((c) => c !== spec.cat);
        if (cats.length) {
          const cat = rng.pick(cats);
          const sel = spec.rows.filter((r) => r[1] === cat);
          const answer = Math.round(sel.reduce((a, r) => a + parseNumber(r[2]), 0) * 100) / 100;
          out = { ...spec, cat, answer, unit: sel.reduce((a, r) => a + parseNumber(r[2]), 0) / sel.length };
        }
      } else if (spec.mode === 'count') {
        const sts = [...new Set(spec.rows.map((r) => r[2]))].filter((s) => s !== spec.status);
        if (sts.length) {
          const status = rng.pick(sts);
          out = { ...spec, status, answer: spec.rows.filter((r) => r[2] === status).length };
        }
      }
      return out;
    },
  });
})();
