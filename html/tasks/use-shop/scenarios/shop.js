/*
 * use-shop / shop.js: the five A12 shopping scenarios (variantpick, compare, returns, cartedit, coupon). They share one
 * store (products, bag lines, coupons, an order history) and its model; each scenario object below adds its goal,
 * start states, error, plan, request text and judge cases.
 * Spec, model, error and plan targets are documented in the logic.js header (A12 shopping scenarios).
 * A wheel target {shop:'pane', control:key} names the control to reveal, so a widget with several scrolling panes
 * can locate the right one. Older single-pane widgets may ignore control and keep using their shopping pane.
 */
(function () {
  'use strict';

  const fam = env.taskOf('use-shop');
  const { C, days, fmtMoney, fromDays, norm, sayIt, shelfPrice, USD } = fam.lib;
  const { clamp, clone, quote } = env.util;
  const V = env.scenariosOf('use-shop');

  const SHOP_REASONS = ['Too small', 'Too large', 'Damaged on arrival', 'Wrong item received', 'Changed my mind'];
  const SHOP_REFUNDS = ['Original payment method', 'Store credit'];
  const SHOP_DROPOFFS = ['Parcel locker', 'Staffed parcel counter', 'Store drop-off'];
  const shopKey = (t) => t.shop;
  const stockKey = (o) => [o.size, o.colour, o.material].join('|');
  const shopAvailable = (s, o) => s.sizes.includes(o.size) && s.colours.includes(o.colour)
    && s.materials.includes(o.material) && !s.unavailable.includes(stockKey(o));
  const quantityError = (a, b) => Math.abs(a - b) / Math.max(a, b, 1);
  const name = (s, id) => quote(s.products[id].name);

  // ---------------------------------------------------------------- the shared store

  // The store every scenario samples first: products of cfg.category (else drawn), filtered by cfg.pool,
  // cfg.count(easy, opts) of them (default 3-5), renamed by cfg.name, adjusted by cfg.edit(products, c, opts); then
  // the quantity a goal may use. The scenario's sample() draws its goal from what this returns.
  function shopBase(rng, opts, cfg) {
    const level = opts.level || 'normal';
    const easy = level === 'easy', medium = level === 'medium';
    const c = rng.fork('a12-content'), cs = opts.csplit || 'train';
    const category = cfg.category || rng.pick(['home', 'sports', 'electronics']);
    let pool = C.PRODUCTS.filter((p) => p.category === category);
    if (cfg.pool) pool = pool.filter(cfg.pool);
    if (!pool.length) pool = C.PRODUCTS;
    const n = cfg.count ? cfg.count(easy, opts) : (opts.ood ? 5 : easy ? 3 : 4);
    const products = C.sample(c, pool, n, cs).map((p, id) => ({ id, name: cfg.name ? cfg.name(p.name) : p.name,
      price: shelfPrice(c, c.int(opts.ood ? 45 : 12, opts.ood ? 400 : 90), USD),
      sku: `NW-${c.int(1000, 9999)}-${id}`, capacity: 12 + id * 8, weight: 400 + id * 180,
      warranty: 1 + id % 3 }));
    if (cfg.edit) cfg.edit(products, c, opts);
    const s = { level, store: c.pick([
      'Northwoven', 'Alder & Thread', 'Cove Supply', 'Fieldwell', 'Brindle Bay', 'Woven Harbor', 'Ashenfield',
      'Hazel & Loom', 'Thimble Bay', 'Rill & Hearth', 'Clover Vale'
    ]), products,
      money: USD, maxQty: opts.ood ? 12 : 8 };
    const qty = easy ? 1 : rng.int(2, opts.ood ? 7 : medium ? 3 : 4);
    return { s, c, cs, easy, medium, qty, n, products };
  }

  // The store's start model, then the scenario's partial(m, s) or wrong(m, s) start.
  function shopInit(partial, wrong) {
    return (s) => {
      const m = { selections: { size: '', colour: '', material: '' }, qty: 1, picked: null, selected: null,
        lines: s.products.map((p) => ({ id: p.id, qty: 1, status: 'cart' })),
        couponText: '', applied: null, couponMsg: '', order: null, item: null, reason: '', refund: '', dropoff: '',
        step: 'orders', returnCreated: false, returnNo: '', paid: false };
      if (s.startMode === 'partial') partial(m, s);
      else if (s.startMode === 'wrong') wrong(m, s);
      return m;
    };
  }

  // The error of every episode: in a judge episode other than confirm 1 once anything was added, applied, created or
  // paid (touched(m): what else counts), else 0; otherwise 1 once paid, else the scenario's own error.
  function shopError(base, touched) {
    return (m, s) => {
      if (s.judge && s.judge.mode !== 'confirm') {
        return m.picked || m.applied || m.returnCreated || m.paid || (touched && touched(m)) ? 1 : 0;
      }
      return m.paid ? 1 : base(m, s);
    };
  }

  // Model-space effect of a step ({ shop: key } clicks, the coupon field, pane wheel steps); the scenario's add(m, s)
  // handles the Add to bag key.
  function shopApply(model, s, step) {
    const m = clone(model);
    if (step.type) { m.couponText = step.type[1]; return m; }
    if (step.wheel) { m.shopScroll = Math.max(0, (m.shopScroll || 0) + step.wheel[1]); return m; }
    const key = step.click?.shop;
    if (!key) return m;
    const [op, a, b] = key.split(':');
    if (op === 'swatch') m.selections[a] = b;
    if (op === 'qty') m.qty = clamp(m.qty + (a === 'inc' ? 1 : -1), 1, s.maxQty);
    if (op === 'select') m.selected = Number(a);
    if (op === 'add' && V[s.scenario].add) V[s.scenario].add(m, s);
    if (op === 'clear') m.picked = null;
    if (op === 'line') {
      const line = m.lines.find((l) => l.id === Number(a));
      if (line) {
        if (b === 'inc' || b === 'dec') line.qty = clamp(line.qty + (b === 'inc' ? 1 : -1), 1, s.maxQty);
        else if (['cart', 'saved', 'removed'].includes(b)) line.status = b;
      }
    }
    if (op === 'apply') {
      const offer = s.offers.find((o) => norm(o.code) === norm(m.couponText));
      if (!offer || offer.expired) { m.applied = null; m.couponMsg = offer ? 'This code has expired. Try another offer.' : 'Code not recognised. Check the code and try again.'; }
      else { m.applied = offer.code; m.couponMsg = `${offer.code} applied · ${offer.pct}% off`; }
    }
    if (op === 'order') { m.order = Number(a); m.item = null; m.returnCreated = false; m.step = 'orders'; }
    if (op === 'item') { m.item = Number(a); m.returnCreated = false; }
    if (['reason', 'refund', 'dropoff'].includes(op)) { m[op] = a; m.returnCreated = false; }
    if (op === 'details' && m.order !== null && m.item !== null) m.step = 'details';
    if (op === 'review' && m.reason && m.refund && m.dropoff) m.step = 'review';
    if (op === 'back') { m.step = m.step === 'review' ? 'details' : 'orders'; m.returnCreated = false; m.shopScroll = 0; }
    if (op === 'create' && m.step === 'review') {
      m.returnCreated = true;
      m.returnNo = `${s.returnNos[m.order]}-${m.item}`;
    }
    if (op === 'pay') m.paid = true;
    return m;
  }

  // A plan click on a { shop: key } control, or the wheel step the widget mirrored (shopReveal) to bring it into view.
  function shopClick(m, key) {
    const dy = m.shopReveal?.[key];
    return dy ? { wheel: [{ shop: 'pane', control: key }, dy] } : { click: { shop: key } };
  }

  // Totals of what the scenario's bag(m, s) holds.
  function shopTotals(m, s) {
    const lines = V[s.scenario].bag(m, s);
    const subtotal = lines.reduce((n, l) => n + s.products[l.id].price * l.qty, 0);
    const pct = s.offers?.find((o) => o.code === m.applied && !o.expired)?.pct || 0;
    const discount = Math.round(subtotal * pct / 100);
    return { subtotal, discount, total: subtotal - discount, count: lines.reduce((n, l) => n + l.qty, 0) };
  }
  const picked = (m) => (m.picked ? [m.picked] : []);
  const inCart = (m) => m.lines.filter((l) => l.status === 'cart');

  const SHOP_TEMPLATES = [
    '{task}', 'Please help me with this: {task}', 'In this store, {task}',
    'For my shopping, {task}', 'Could you take care of this? {task}',
    'Here is what I need: {task}', 'My request: {task}', 'Shopping help needed: {task}', 'Can you assist? {task}',
    'I have a task for you: {task}', 'On my list today: {task}', 'Over to you: {task}', 'Please: {task}',
    'Task follows: {task}', 'To get started: {task}', 'Ready when you are: {task}', 'An errand for you: {task}',
    'Next up: {task}', 'May I ask a favour? {task}', 'This needs doing: {task}', 'For you to handle: {task}',
    'For action: {task}', 'Can I leave this with you? {task}', 'The details: {task}', 'Got a moment? {task}',
  ];
  // The request: the scenario's task(s) in one of the templates.
  const shopInstruction = (s, rng) => sayIt(s, rng, SHOP_TEMPLATES, { task: V[s.scenario].task(s) });

  // Judge records: the normal request with one thing left out (ambiguous) or one thing that cannot be done (impossible),
  // from the scenario's ambiguousTask(rng, s) -> { task, message, cands, others, need? } and impossibleTask(rng, s)
  // -> { task, what, message }.
  function shopJudge(rng, s, mode) {
    const v = V[s.scenario];
    if (mode === 'confirm') return { mode, message: v.confirmMessage || 'The bag is ready. Should I proceed with payment?' };
    s.startMode = 'off';
    if (mode === 'ambiguous') {
      const { task, message, cands, others, need } = v.ambiguousTask(rng, s);
      return { mode, message, cands, others, ...(need ? { need } : {}), templates: SHOP_TEMPLATES, vars: { task } };
    }
    const { task, what, message } = v.impossibleTask(rng, s);
    return { mode, message, what, templates: SHOP_TEMPLATES, vars: { task } };
  }

  // facts: the bag total and item count (returns has its own).
  function bagFacts(m, s) {
    const t = shopTotals(m, s);
    return [{ label: 'Cart total', value: fmtMoney(t.total, s.money) }, { label: 'Items in bag', value: String(t.count) }];
  }

  // What every A12 scenario object has besides its own hooks.
  const SHOP = {
    apply: shopApply,
    instruction: shopInstruction,
    judge: shopJudge,
    facts: bagFacts,
    confirmVerb: 'pay',
    // Model-space solving has no live pane to refresh visibility after a wheel step: solve() drops the widget's geometry.
    mirrored: ['shopReveal', 'shopScroll'],
  };
  function shopScenario(def) {
    const error = shopError(def.base, def.touched);
    env.scenario('use-shop', { ...SHOP, error, judgeError: error, ...def });
  }

  // ---------------------------------------------------------------- variantpick: size / colour / material, quantity

  shopScenario({
    name: 'variantpick',
    sample(rng, opts) {
      const { s, easy, qty } = shopBase(rng, opts, { category: 'clothing',
        pool: (p) => /T-Shirt|Button-Down Shirt|Base Layer Top/.test(p.name), count: () => 1,
        name: (n) => n.replace(/^Linen /, '').replace(/, Cotton$/, '') });
      Object.assign(s, { sizes: easy ? ['S', 'M', 'L'] : ['XS', 'S', 'M', 'L', 'XL'],
        colours: easy ? ['Ocean', 'Clay'] : ['Ocean', 'Clay', 'Moss', 'Ink'],
        materials: easy ? ['Cotton', 'Linen'] : ['Cotton', 'Linen', 'Recycled blend'] });
      s.want = { size: rng.pick(s.sizes), colour: rng.pick(s.colours), material: rng.pick(s.materials), qty };
      const combos = s.sizes.flatMap((size) => s.colours.flatMap((colour) => s.materials.map((material) => ({ size, colour, material }))));
      s.unavailable = rng.sample(combos.filter((x) => stockKey(x) !== stockKey(s.want)), easy ? 2 : opts.ood ? 12 : 6).map(stockKey);
      return s;
    },
    init: shopInit((m, s) => Object.assign(m.selections, { size: s.want.size, colour: s.want.colour }),
      (m, s) => { m.selections = { ...s.want, size: s.sizes.find((v) => v !== s.want.size) }; }),
    base(m, s) {
      const w = s.want;
      const choice = (o) => ['size', 'colour', 'material'].reduce((n, k) => n + (o[k] === w[k] ? 0 : 1), 0);
      return (choice(m.selections) + quantityError(m.qty, w.qty)
        + (m.picked ? choice(m.picked.selections) + quantityError(m.picked.qty, w.qty) : 4)) / 8;
    },
    add(m, s) {
      if (shopAvailable(s, m.selections)) m.picked = { id: 0, qty: m.qty, selections: { ...m.selections } };
    },
    plan(m, s) {
      const w = s.want;
      for (const k of ['size', 'colour', 'material']) if (m.selections[k] !== w[k]) return shopClick(m, `swatch:${k}:${w[k]}`);
      if (m.qty !== w.qty) return shopClick(m, `qty:${m.qty < w.qty ? 'inc' : 'dec'}`);
      return shopClick(m, 'add');
    },
    bag: picked,
    task: (s) => `Add ${s.want.qty} of ${name(s, 0)} to the bag in size ${s.want.size}, ${s.want.colour}, ${s.want.material}. Stop before payment.`,
    ambiguousTask(rng, s) {
      const w = s.want;
      // no colour named: any of the colours would do, so naming two of them is enough
      return { task: `Add ${w.qty} of ${name(s, 0)} to the bag in size ${w.size}, ${w.material}. Stop before payment.`,
        cands: s.colours.map((c) => [c]), need: 2,
        others: [...s.materials, ...s.sizes.filter((x) => x.length > 1)].filter((x) => !s.colours.includes(x)).map((x) => [x]),
        message: `Which colour should I use, ${s.colours[0]} or ${s.colours[1]}?` };
    },
    impossibleTask(rng, s) {
      const w = s.want;
      if (!s.unavailable.includes(stockKey(w))) s.unavailable.push(stockKey(w));
      return { task: `Add ${w.qty} of ${name(s, 0)} to the bag in size ${w.size}, ${w.colour}, ${w.material}. Stop before payment.`,
        what: [`${w.colour} ${w.material}`, w.colour, w.material],
        message: 'That combination is sold out, so I cannot add it to the bag.' };
    },
    parts: (m) => [{ name: 'Size', value: m.selections.size }, { name: 'Colour', value: m.selections.colour },
      { name: 'Material', value: m.selections.material }, { name: 'Quantity', value: m.qty }, { name: 'Bag', value: m.picked }],
    silent(n, next, prev) {
      if (next.qty === prev.qty) return false;
      n.qty = prev.qty;
      return true;
    },
    retarget(n, s, m, rng) {
      const choices = s.colours.filter((colour) => colour !== s.want.colour && shopAvailable(s, { ...s.want, colour }));
      if (!choices.length) return false;
      n.want.colour = rng.pick(choices);
      return true;
    },
  });

  // ---------------------------------------------------------------- compare: the one pack that meets every limit

  const compareWant = (p, minWarranty) => ({ minCapacity: p.capacity, maxWeight: p.weight, maxPrice: p.price + 500, minWarranty });

  shopScenario({
    name: 'compare',
    sample(rng, opts) {
      const { s, easy, n, products } = shopBase(rng, opts, { count: (easy) => (easy ? 3 : 4),
        // Comparison columns are editions of the same kind of product, with genuinely comparable specs.
        edit: (ps, c) => ps.forEach((p, id) => {
          p.name = `${c.pick([
            'Alder', 'Ridge', 'Cove', 'Summit', 'Feyrn'
          ])} ${['Daypack', 'Travel pack', 'Trail pack', 'Weekender'][id]}`;
          p.price = (35 + c.int(0, 10) + id * 18) * 100 + 99;
          p.weight = (opts.ood ? 650 : 400) + id * 170;
        }) });
      s.target = rng.int(0, n - 1);
      const p = products[s.target];
      s.want = compareWant(p, easy ? 1 : p.warranty);
      return s;
    },
    init: shopInit((m, s) => { m.selected = s.target; },
      (m, s) => Object.assign(m, { selected: (s.target + 1) % s.products.length,
        picked: { id: (s.target + 1) % s.products.length, qty: 1 } })),
    base(m, s) {
      const w = s.want;
      const p = m.picked && s.products[m.picked.id];
      const scores = p ? [p.capacity >= w.minCapacity, p.weight <= w.maxWeight, p.price <= w.maxPrice, p.warranty >= w.minWarranty] : [];
      return ((m.selected === s.target ? 0 : 1) + (p ? scores.filter((ok) => !ok).length / 4 : 1)) / 2;
    },
    add(m) {
      if (m.selected !== null) m.picked = { id: m.selected, qty: 1 };
    },
    plan: (m, s) => shopClick(m, m.selected !== s.target ? `select:${s.target}` : 'add'),
    bag: picked,
    task: (s) => `I need a pack with at least ${s.want.minCapacity} L capacity, at most ${s.want.maxWeight} g weight, a price no higher than ${fmtMoney(s.want.maxPrice, s.money)}, and at least ${s.want.minWarranty} year(s) warranty. Add the matching pack to my bag and leave payment for me.`,
    ambiguousTask(rng, s) {
      const w = s.want;
      const a = s.target, b = (a + 1) % s.products.length;
      for (const key of ['price', 'capacity', 'weight', 'warranty']) s.products[b][key] = s.products[a][key];
      const tag = (p) => [p.sku, p.name];
      const cands = [tag(s.products[a]), tag(s.products[b])];
      return { task: `I need a pack with at least ${w.minCapacity} L capacity and at most ${w.maxWeight} g weight. Add the matching pack to my bag and leave payment for me.`,
        cands, others: s.products.filter((p, i) => i !== a && i !== b).map(tag),
        message: `Two packs match. Which SKU should I choose, ${cands[0][0]} or ${cands[1][0]}?` };
    },
    impossibleTask(rng, s) {
      const w = s.want;
      const cap = Math.max(...s.products.map((p) => p.capacity)) + rng.int(10, 40);
      return { task: `I need a pack with at least ${cap} L capacity, at most ${w.maxWeight} g weight, a price no higher than ${fmtMoney(w.maxPrice, s.money)}, and at least ${w.minWarranty} year(s) warranty. Add the matching pack to my bag and leave payment for me.`,
        what: [`${cap} L`, String(cap)],
        message: 'None of these packs has the required capacity, so I cannot add a matching pack.' };
    },
    parts: (m, s) => s.products.map((p) => ({ name: p.name, value: [m.selected === p.id, !!m.picked && m.picked.id === p.id] })),
    retarget(n, s, m, rng) {
      n.target = (s.target + rng.int(1, s.products.length - 1)) % s.products.length;
      n.want = compareWant(s.products[n.target], s.products[n.target].warranty);
      return true;
    },
  });

  // ---------------------------------------------------------------- returns: order, item, reason, refund, drop-off

  const returnTask = (s, order) => `Arrange a return for ${name(s, s.want.item)}${order ? ` from order ${order}` : ''}: reason ${quote(s.want.reason)}, refund to ${quote(s.want.refund)}, drop off at ${quote(s.want.dropoff)}. Please get the return request ready and issue it.`;

  shopScenario({
    name: 'returns',
    sample(rng, opts) {
      const { s, c, easy, products } = shopBase(rng, opts, { category: 'clothing' });
      s.orders = Array.from({ length: easy ? 2 : opts.ood ? 5 : 3 }, (_, i) => ({
        no: `NW-${c.int(100000, 999999)}-${i}`, date: fromDays(days('2026-10-15') - i * 4),
        items: rng.sample(products.map((p) => p.id), easy ? 2 : 3) }));
      const order = rng.int(0, s.orders.length - 1);
      s.want = { order, item: rng.pick(s.orders[order].items), reason: rng.pick(SHOP_REASONS),
        refund: rng.pick(SHOP_REFUNDS), dropoff: rng.pick(SHOP_DROPOFFS) };
      s.returnNos = s.orders.map((o, i) => `RT-${c.int(100000, 999999)}-${i}`);
      return s;
    },
    init: shopInit((m, s) => Object.assign(m, { order: s.want.order, item: s.want.item, step: 'details' }),
      (m, s) => Object.assign(m, { order: s.want.order, item: s.want.item, step: 'details',
        reason: SHOP_REASONS.find((v) => v !== s.want.reason), refund: SHOP_REFUNDS.find((v) => v !== s.want.refund) })),
    base(m, s) {
      const w = s.want;
      const fields = ['order', 'item', 'reason', 'refund', 'dropoff'];
      const misses = fields.filter((k) => m[k] !== w[k]).length;
      return (misses + (m.step === 'review' || m.returnCreated ? 0 : 1)
        + (s.judge?.mode === 'confirm' || m.returnCreated ? 0 : 1)) / (s.judge?.mode === 'confirm' ? 6 : 7);
    },
    plan(m, s) {
      const w = s.want;
      const click = (key) => shopClick(m, key);
      if (m.order !== w.order || m.item !== w.item) {
        if (m.step !== 'orders') return click('back');
        return click(m.order !== w.order ? `order:${w.order}` : `item:${w.item}`);
      }
      if (m.step === 'orders') return click('details');
      if (['reason', 'refund', 'dropoff'].some((k) => m[k] !== w[k])) {
        if (m.step === 'review') return click('back');
        for (const k of ['reason', 'refund', 'dropoff']) if (m[k] !== w[k]) return click(`${k}:${w[k]}`);
      }
      if (m.step !== 'review') return click('review');
      return click('create');
    },
    bag: (m) => (m.item === null ? [] : [{ id: m.item, qty: 1 }]),
    task: (s) => `Arrange a return for ${name(s, s.want.item)} from order ${s.orders[s.want.order].no}: reason ${quote(s.want.reason)}, refund to ${quote(s.want.refund)}, drop off at ${quote(s.want.dropoff)}. Please get the return request ready and issue it.`,
    confirmVerb: 'issue the return',
    confirmMessage: 'The return is ready. Should I issue the return request?',
    ambiguousTask(rng, s) {
      const w = s.want;
      const a = w.order, b = (a + 1) % s.orders.length;
      if (!s.orders[b].items.includes(w.item)) s.orders[b].items[0] = w.item;
      // every order that holds the item is a candidate
      const holds = s.orders.filter((o) => o.items.includes(w.item));
      const cands = holds.map((o) => [o.no]);
      return { task: returnTask(s, ''), cands, need: 2, others: s.orders.filter((o) => !holds.includes(o)).map((o) => [o.no]),
        message: `Which order contains the item you want to return, ${cands[0][0]} or ${cands[1][0]}?` };
    },
    impossibleTask(rng, s) {
      const no = `NW-${rng.int(100000, 999999)}-${rng.int(5, 9)}`; // the history's numbers end in 0-4
      return { task: returnTask(s, no), what: [no], message: `Order ${no} is missing from the order history, so I cannot start its return.` };
    },
    facts(m, s) {
      const t = shopTotals(m, s);
      return [
        { label: 'Return number', value: m.returnNo || 'Not issued' },
        { label: 'Refund amount', value: fmtMoney(t.total, s.money) },
        { label: 'Return status', value: m.returnCreated ? 'Awaiting drop-off' : 'Draft' },
      ];
    },
    parts: (m) => [{ name: 'Order to return', value: m.order }, { name: 'Item to return', value: m.item }, { name: 'Reason', value: m.reason },
      { name: 'Refund method', value: m.refund }, { name: 'Drop-off point', value: m.dropoff }, { name: 'Return request', value: [m.step, m.returnCreated] }],
    retarget(n, s) {
      n.want.refund = SHOP_REFUNDS.find((v) => v !== s.want.refund);
      return true;
    },
  });

  // ---------------------------------------------------------------- cartedit: quantities, remove, save for later

  shopScenario({
    name: 'cartedit',
    sample(rng, opts) {
      const { s, easy, qty, products } = shopBase(rng, opts, {});
      s.want = products.map((p, i) => ({ id: p.id, qty: i === 0 ? (easy ? 2 : qty + 1) : 1,
        status: i === 1 ? 'removed' : i === 2 ? 'saved' : 'cart' }));
      return s;
    },
    init: shopInit((m, s) => { m.lines[0].qty = s.want[0].qty; }, (m, s) => { m.lines[0].qty = s.maxQty; }),
    base: (m, s) => s.want.reduce((e, l) => {
      const a = m.lines.find((x) => x.id === l.id);
      return e + (!a || a.status !== l.status ? 1 : l.status === 'removed' ? 0 : quantityError(a.qty, l.qty));
    }, 0) / s.want.length,
    touched: (m) => m.lines.some((l) => l.qty !== 1 || l.status !== 'cart'),
    plan(m, s) {
      for (const l of s.want) {
        const a = m.lines.find((x) => x.id === l.id);
        if (a.status !== l.status) return shopClick(m, `line:${l.id}:${l.status}`);
        if (l.status !== 'removed' && a.qty !== l.qty) return shopClick(m, `line:${l.id}:${a.qty < l.qty ? 'inc' : 'dec'}`);
      }
      return null;
    },
    bag: inCart,
    task: (s) => `Update the bag: ${s.want.filter((l, i) => i < 3).map((l) => l.status === 'removed' ? `remove ${name(s, l.id)}` : l.status === 'saved' ? `save ${name(s, l.id)} for later` : `set ${name(s, l.id)} to quantity ${l.qty}`).join('; ')}. Leave the other lines unchanged and stop before payment.`,
    ambiguousTask(rng, s) {
      s.products[1].name = s.products[0].name;
      const cands = [[s.products[0].sku], [s.products[1].sku]];
      return { task: `Update the bag: set ${name(s, 0)} to quantity 2. Leave the other lines unchanged and stop before payment.`,
        cands, others: s.products.slice(2).map((p) => [p.sku, p.name]),
        message: `Which SKU should I change, ${cands[0][0]} or ${cands[1][0]}?` };
    },
    impossibleTask(rng, s) {
      const q = s.maxQty + rng.int(3, 14);
      return { task: `Update the bag: set ${name(s, 0)} to quantity ${q}. Leave the other lines unchanged and stop before payment.`,
        what: [`quantity ${q}`, String(q)], message: `The quantity limit is ${s.maxQty}, so I cannot set the requested quantity.` };
    },
    parts: (m, s) => s.products.map((p) => { const l = m.lines.find((x) => x.id === p.id); return { name: p.name, value: l ? [l.qty, l.status] : null }; }),
    silent(n, next, prev, s, rng) {
      const changed = next.lines.filter((l) => prev.lines.some((p) => p.id === l.id && p.qty !== l.qty));
      if (!changed.length) return false;
      const l = rng.pick(changed);
      n.lines.find((p) => p.id === l.id).qty = prev.lines.find((p) => p.id === l.id).qty;
      return true;
    },
    retarget(n, s) {
      n.want[0].qty = s.want[0].qty === s.maxQty ? 2 : s.want[0].qty + 1;
      return true;
    },
  });

  // ---------------------------------------------------------------- coupon: an active code on a prefilled bag

  shopScenario({
    name: 'coupon',
    sample(rng, opts) {
      const { s, c, cs, easy } = shopBase(rng, opts, {});
      const codes = C.sample(c, C.COUPON_CODES, easy ? 2 : 3, cs);
      s.offers = codes.map((code, i) => ({ code, pct: i === 0 ? 10 : i === 1 ? 20 : 15, expired: i === 0 }));
      s.want = { code: s.offers[1].code };
      return s;
    },
    init: shopInit((m, s) => { m.couponText = s.want.code; },
      (m, s) => Object.assign(m, { couponText: s.offers[0].code, couponMsg: 'This code has expired. Try another offer.' })),
    base: (m, s) => (m.applied === s.want.code ? 0 : norm(m.couponText) === norm(s.want.code) ? 0.65 : 1),
    plan(m, s) {
      if (norm(m.couponText) !== norm(s.want.code)) {
        const dy = m.shopReveal?.coupon;
        return dy ? { wheel: [{ shop: 'pane', control: 'coupon' }, dy] } : { type: [{ shop: 'coupon' }, s.want.code] };
      }
      return shopClick(m, 'apply');
    },
    bag: inCart,
    task: (s) => `Apply coupon ${quote(s.want.code)} to the current bag. Keep the same items and leave payment for me.`,
    ambiguousTask(rng, s) {
      s.offers[0].expired = false;
      s.offers[0].pct = s.offers[1].pct;
      const cands = [[s.offers[0].code], [s.offers[1].code]];
      return { task: 'Apply the coupon with the biggest discount to the current bag. Keep the same items and leave payment for me.',
        cands, others: s.offers.slice(2).map((o) => [o.code]), message: `Which coupon should I apply, ${cands[0][0]} or ${cands[1][0]}?` };
    },
    impossibleTask: (rng, s) => ({ task: `Apply coupon ${quote(s.offers[0].code)} to the current bag. Keep the same items and leave payment for me.`,
      what: [s.offers[0].code], message: `The coupon ${s.offers[0].code} has expired, so I cannot apply it.` }),
    parts: (m) => [{ name: 'Coupon code', value: m.couponText }, { name: 'Applied coupon', value: m.applied }],
    retarget(n, s, m, rng) {
      const offers = s.offers.filter((o) => !o.expired && o.code !== s.want.code);
      if (!offers.length) return false;
      n.want.code = rng.pick(offers).code;
      return true;
    },
  });

  // The widget API (fam.helpers).
  Object.assign(fam.helpers, { shopApply, shopTotals, shopReasons: SHOP_REASONS, shopRefunds: SHOP_REFUNDS,
    shopDropoffs: SHOP_DROPOFFS, shopAvailable });
})();
