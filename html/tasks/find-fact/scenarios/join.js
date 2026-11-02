/*
 * find-fact / join: two panels (orders + customers, or staff + departments) linked by an ID column.
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('find-fact');
  const C = env.content;
  const { keepIdx } = env.util;
  const { errorLookup, money, people, PH_PEOPLE, planType, randomISO, say, showDate, wrongOf } = fam.lib;

  function sampleJoin(rng, spec) {
    const dataset = rng.pick(['orders', 'staff']);
    const mode = rng.pick(['forward', 'reverse']);
    const n = spec.ood ? rng.int(10, 14) : rng.int(5, 8);
    const cities = C.split(C.CITIES, spec.csplit);
    if (dataset === 'orders') {
      const ps = people(rng, n, spec);
      const ids = rng.sample([...Array(900).keys()], n).map((k) => `C-${1100 + k}`);
      const customers = ps.map((p, i) => [ids[i], p.full, rng.pick(cities).city, rng.pick([
        'Gold', 'Silver', 'Bronze', 'Standard', 'Pearl', 'Verdant', 'Crystal', 'Sapphire', 'Opal', 'Amber', 'Diamond',
        'Copper', 'Cobalt', 'Quartz', 'Celeste', 'Onyx'
      ])]);
      const orderIds = rng.sample([...Array(80000).keys()], n).map((k) => `#${10200 + k}`);
      // Each customer has exactly one order; orders listed in another order.
      const perm = rng.shuffle([...Array(n).keys()]);
      const orders = perm.map((ci, k) => {
        const iso = randomISO(rng, 2024, 2025);
        return [orderIds[k], ids[ci], showDate(iso, 'short'), money(rng.int(500, 40000) / 100)];
      });
      const li = rng.int(0, n - 1);
      const ri = customers.findIndex((c) => c[0] === orders[li][1]);
      const left = { title: rng.pick([
        'Orders', 'Recent orders', 'All orders'
      ]), cols: ['Order', 'Customer ID', 'Date', 'Total'], rows: orders };
      const right = { title: rng.pick([
        'Customers', 'Customer list', 'Customer data', 'Directory'
      ]), cols: ['ID', 'Name', 'City', 'Tier'], rows: customers };
      if (mode === 'forward') {
        const col = rng.pick([1, 2, 3]);
        return { dataset, mode, left, right, link: [1, 0], key: orders[li][0], ask: { side: 'right', col }, via: [li, ri], answer: customers[ri][col],
          noun: ['', 'name', 'city', 'membership tier'][col], keyNoun: 'order' };
      }
      const col = rng.pick([0, 2, 3]);
      return { dataset, mode, left, right, link: [1, 0], key: customers[ri][1], ask: { side: 'left', col }, via: [li, ri], answer: orders[li][col],
        noun: ['order number', '', 'order date', 'order total'][col], keyNoun: 'customer' };
    }
    const depts = C.sample(rng, C.DEPARTMENTS, Math.min(n, 6), C.csplitOf(spec));
    const codes = depts.map((d, i) => `${d.replace(/[^A-Za-z]/g, '').slice(0, 3).toUpperCase()}${10 + i}`);
    const managers = people(rng, depts.length, spec);
    const deptRows = depts.map((d, i) => [codes[i], d, `Floor ${rng.int(1, 12)}`, managers[i].full]);
    const staffP = people(rng.fork('staff'), n, spec).filter((p) => !managers.some((m) => m.full === p.full));
    const li = rng.int(0, staffP.length - 1);
    const ri = rng.int(0, codes.length - 1);
    // reverse mode: the target is the only member of its department, so the department names one person.
    const others = mode === 'reverse' ? codes.filter((c, i) => i !== ri) : codes;
    const staff = staffP.map((p, i) => [p.full, i === li ? codes[ri] : rng.pick(others), `x${rng.int(1000, 9899)}`, rng.pick(cities).city]);
    const left = { title: rng.pick([
      'Staff', 'People', 'Roster'
    ]), cols: ['Name', 'Dept code', 'Extension', 'Office'], rows: staff };
    const right = { title: rng.pick([
      'Departments', 'Teams', 'Groups'
    ]), cols: ['Code', 'Department', 'Floor', 'Manager'], rows: deptRows };
    if (mode === 'forward') {
      const col = rng.pick([1, 2, 3]);
      return { dataset, mode, left, right, link: [1, 0], key: staff[li][0], ask: { side: 'right', col }, via: [li, ri], answer: deptRows[ri][col],
        noun: ['', 'department name', 'floor', 'manager'][col], keyNoun: '' };
    }
    const col = rng.pick([0, 2, 3]);
    return { dataset, mode, left, right, link: [1, 0], key: `the person in ${deptRows[ri][1]}`, ask: { side: 'left', col }, via: [li, ri], answer: staff[li][col],
      noun: ['name', '', 'extension', 'office'][col], keyNoun: 'department' };
  }

  const PH_DEPTS = [
    'Procurement', 'Facilities', 'Field Research', 'Archives', 'Fleet Services', 'Translation', 'Bookbinding',
    'Cartography', 'Print Services', 'Event Planning', 'Mailroom', 'Restoration', 'Studio Support', 'Audio Services',
    'Packaging', 'Site Planning', 'Curation', 'Wayfinding', 'Prototyping', 'Cataloguing', 'Tool Services',
    'Stagecraft', 'Costuming', 'Water Systems'
  ];

  env.scenario('find-fact', {
    name: 'join',
    sample: sampleJoin,
    level(spec, lv, r) {
      const easy = lv >= 1;
      const k = (e, m) => (easy ? e : m);
      const [li, ri] = spec.via;
      const kl = keepIdx(r, spec.left.rows.length, [li], k(2, 3));
      const kr = keepIdx(r, spec.right.rows.length, [ri], k(2, 3));
      spec.left = { ...spec.left, rows: kl.map((i) => spec.left.rows[i]) };
      spec.right = { ...spec.right, rows: kr.map((i) => spec.right.rows[i]) };
      spec.via = [kl.indexOf(li), kr.indexOf(ri)];
    },
    wrongAnswers(spec, rng) {
      const side = spec.ask.side === 'right' ? spec.right : spec.left;
      return [wrongOf(rng, spec.answer, side.rows.map((r) => r[spec.ask.col]))];
    },
    error: errorLookup,
    plan: planType,
    answers: (spec, one) => one(spec.noun, spec.answer),
    instruction(spec, rng) {
      const key = spec.key;
      return say(rng, spec, spec.mode === 'forward' ? [
        'Type the {noun} for {kn} {key}.',
        'Find {kn} {key} and enter the matching {noun}.',
        'What is the {noun} that goes with {kn} {key}? Type it.',
        'Look up {kn} {key}, follow its ID to the other list and type the {noun}.',
        'Using both tables, enter the {noun} of {kn} {key}.',
        'Enter the {noun} linked to {kn} {key}.',
        'The tables link {kn} {key} to a {noun}. Type it.',
        'Which {noun} matches {kn} {key}? Enter that value.',
        'Match the IDs for {kn} {key} and enter the {noun}.',
        'Locate {kn} {key}. Type its linked {noun}.',
      ] : [
        'Type the {noun} for {key}.',
        'Find the {noun} that belongs to {key} and enter it.',
        'What is the {noun} of {key}? Type it.',
        'Look up {key} and use the ID to find the {noun} in the other table.',
        'Using both tables, enter the {noun} for {key}.',
        'Enter the {noun} linked to {key}.',
        'Which {noun} matches {key}? Enter it.',
        'Find the linked {noun} for {key}. Type it.',
        'Match {key} by ID, then enter the {noun}.',
        'For {key}, enter the {noun} from the linked table.',
      ], { noun: spec.noun, key, kn: spec.keyNoun }, { terse: `${spec.noun} for ${key}` });
    },
    replyInstruction(spec, rng) {
      const kn = spec.mode === 'forward' ? `${spec.keyNoun} ` : '';
      return say(rng, spec, [
        'What is the {noun} that goes with {kn}{key}?',
        'Find {kn}{key} and look up the matching {noun}.',
        'Look up {kn}{key}, follow its ID to the other list and read the {noun}.',
        'Using both tables, find the {noun} of {kn}{key}.',
        'Which {noun} is linked to {kn}{key}?',
        'Beginning with {kn}{key}, follow the ID to its {noun}.',
        'Report the {noun} found by matching {kn}{key} by ID.',
        '{kn}{key} has a linked {noun}. What is that value?',
        'Trace {kn}{key} by ID. What is the {noun}?',
      ], { noun: spec.noun, key: spec.key, kn }, { terse: `${spec.noun} for ${spec.key}` });
    },
    judgeAsk(jr, spec, page, pick) {
      let x = null, templates, vars = {}, message;
      const fwdOrders = spec.dataset === 'orders' && spec.mode === 'forward';
      if (fwdOrders) {
        for (let k = 0; k < 40 && !x; k++) { const c = `#${jr.int(10200, 90199)}`; if (!page.includes(c)) x = c; }
      } else x = spec.dataset === 'staff' && spec.mode === 'reverse' ? pick(PH_DEPTS) : pick(PH_PEOPLE);
      if (!x) return null;
      const key = spec.dataset === 'staff' && spec.mode === 'reverse' ? `the person in ${x}` : x;
      templates = ['Type the {noun} for {kn}{key}.', 'Using both tables, enter the {noun} of {kn}{key}.', 'Enter the {noun} linked to {kn}{key}.'];
      vars = { noun: spec.noun, kn: fwdOrders ? 'order ' : spec.dataset === 'orders' ? 'customer ' : '', key, x };
      message = spec.dataset === 'staff' && spec.mode === 'reverse' ? `I can't do that: there is no ${x} department in the tables.`
        : `I can't do that: there is no ${fwdOrders ? 'order' : spec.dataset === 'orders' ? 'customer' : 'person'} ${x} in the tables.`;
      return { x, templates, vars, message };
    },
  });
})();
