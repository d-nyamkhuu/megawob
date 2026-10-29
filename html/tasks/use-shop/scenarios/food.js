/*
 * use-shop / food: order dishes (with options and quantities) from a restaurant menu.
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('use-shop');
  const { C, cartSilent, levelOf, list, listStep, menuPrice, moneyFor, sayIt } = fam.lib;
  const { clamp } = env.util;

  const RESTAURANTS = ['Basil & Ember', 'The Corner Kitchen', 'Little Lantern', 'Saffron Street', 'Harbor Grill',
    'Green Fork', 'Mama Rosa', 'Pepper Mill', 'Noodle Theory', 'The Copper Pot', 'Bento Box Co.', 'Olive & Thyme',
    'Golden Wok', 'Taqueria Sol', 'The Daily Bowl', 'Juniper Cafe', 'Ash & Apron', 'Maple Wharf', 'Rookery Kitchen',
    'Poppy & Stone', 'The Tin Ladle', 'Clover & Kiln', 'Red Finch Dining', 'Riverbend Supper', 'Bellflower Kitchen',
    'Brass Heron', 'Northstar Pantry', 'Cypress & Coal', 'Mallow Street', 'Amber Kettle', 'Saltbox Social',
    'Orchard & Iron', 'Kite & Kettle', 'Junebug Kitchen', 'Trestle & Vine', 'Canvas & Cookfire', 'Mica & Marrow',
    'Bramble Room', 'Rye & Rafter', 'Stonebridge Supper', 'The Gilded Ladle', 'Market Day Kitchen', 'Mosslight Cafe',
    'Salt & Sorrel', 'Highwater Table', 'The Quiet Apron', 'Foxglove Supper', 'Cloudberry House', 'Holloway Dining',
    'Dandelion & Rye', 'Wren & Walnut', 'Candlewick Table', 'Riversong Kitchen', 'The Kindly Skillet',
    'Old Mill Dining', 'Pecan & Pepper', 'The Amber Orchard', 'Wayfarer Kitchen', 'Stone & Sprig', 'Windward Dining',
    'Pennyroyal Kitchen', 'The Welcome Plate', 'Rosehip Table', 'Pearlwood House', 'The Wicker Table',
    'Fennel & Finch', 'Cookswell House', 'Sunroom Kitchen', 'Crispin & Coals', 'Brookstone Cafe', 'The Evening Spoon'];
  const NOTES = ['Made fresh to order', 'House favourite', "Chef's recommendation", 'Popular this week',
    'Our classic recipe', 'Light and fresh', 'Rich and hearty', 'Great for sharing', 'Perfect for lunch',
    'Seasonal ingredients', 'Slow-cooked', 'A customer favourite', 'New on the menu', 'Served warm',
    'Crafted with care', 'Worth making time for', 'A feast for the eyes', 'Part of our story', 'Big on character',
    'No occasion required', 'Come as you are', 'At home on any table', 'One to remember', 'A reason to smile',
    'The talk of the table', 'Let curiosity lead', 'A touch of nostalgia', 'Good company optional', 'A menu mainstay',
    'The usual can wait', 'Set the mood', 'Start a new tradition', 'It speaks for itself', 'A delicious dilemma',
    'An ode to good taste', 'Chosen for our menu', 'Your craving called'];
  const MEAT = /chicken|beef|pork|lamb|shrimp|prawn|salmon|tuna|fish|calamari|clam|bacon|\bblt\b|steak|ribeye|carnitas|pastor|pepperoni|turkey|meatball|sashimi|nigiri|dragon roll|rainbow roll|california roll|cheesesteak|shepherd|moussaka|bolognese|carbonara|gyoza|wings|goong|\bpho\b|tonkotsu|paella|schnitzel|bourguignon|banh mi|shawarma|poke|katsu|teriyaki|nasi goreng|full breakfast|benedict|club sandwich|quesadilla|enchilada|tikka|rogan josh|chowder|ham\b|sausage|chorizo|duck|burger|salami|hawaiian|cobb|dan dan/i;
  const VEG_BURGER = /veggie|black bean|vegetable|tofu|falafel|vegan/i;
  const DAIRY_EGG = /cheese|mozzarella|feta|yogurt|egg|butter|cream|paneer|honey|milk|parmesan|parmigiana|goat|pancake|waffle|croissant|omelette|alfredo|lasagna|tiramisu|lava cake|brûlée|custard|ice cream|lassi|latte|cappuccino|flat white|hot chocolate|naan|mashed|nachos|caesar|tzatziki|makhani|shakshuka|risotto|mac and|caprese|french onion|garlic bread|churros|baklava|crumble|tart|cake|pizza|burrito|pad thai|bibimbap/i;
  const SPICY = /spicy|chili|chilli|arrabbiata|diavola|tom yum|dan dan|jalape|nachos|kimchi|shakshuka|curry|tikka|rogan|masala|buffalo|pastor|papaya|bibimbap|nasi goreng|shawarma|enchilada/i;
  const NUTS = /peanut|walnut|almond|cashew|pesto|satay|pecan|pistachio|baklava|pad thai|massaman|dan dan|granola/i;
  const GLUTEN = /bread|pita|pizza|noodle|ramen|udon|spaghetti|penne|fettuccine|lasagna|linguine|burger|sandwich|wrap|toast|pancake|waffle|croissant|crumble|cake|tart|naan|taco|burrito|quesadilla|enchilada|gyoza|samosa|spring roll|churros|baklava|schnitzel|fish and chips|katsu|onion rings|mozzarella sticks|calamari|banh mi|club|\bblt\b|philly|shepherd|bourguignon|dan dan|chowder|french onion|teriyaki|wings|carbonara|bruschetta|moussaka|garlic|tiramisu|cheesecake|bubble|granola|shawarma|\bpie\b|mac and|alfredo|caesar|benedict|breakfast plate|grilled cheese/i;
  function dishTags(d) {
    const n = d.name;
    const meat = MEAT.test(n) && !VEG_BURGER.test(n);
    const tags = [];
    if (!meat && (!DAIRY_EGG.test(n) || /vegan/i.test(n))) tags.push('vegan');
    if (!meat) tags.push('vegetarian');
    if (!GLUTEN.test(n)) tags.push('gluten-free');
    if (SPICY.test(n) || (d.options || []).some((o) => o.name === 'Spice level')) tags.push('spicy');
    if (NUTS.test(n)) tags.push('nuts');
    return tags;
  }
  const EXTRA_USD = { Size: [0, 1.5, 3, 4], Protein: { Beef: 2, Shrimp: 3 }, Milk: { Oat: 0.6, Almond: 0.6, Soy: 0.6 } };
  function dishGroup(d, money) {
    const o = (d.options || [])[0];
    if (!o) return null;
    const values = o.values.slice(0, 4);
    const ex = EXTRA_USD[o.name];
    const extra = values.map((v, i) => menuPrice(Array.isArray(ex) ? ex[i] || 0 : ex ? ex[v] || 0 : 0, money));
    return { name: o.name, values, extra };
  }
  const TAG_LABEL = { vegan: 'vegan', vegetarian: 'vegetarian', 'gluten-free': 'gluten-free', spicy: 'spicy', nuts: 'contains nuts' };
  const TAG_ASK = { vegan: 'that are vegan', vegetarian: 'that are vegetarian', 'gluten-free': 'that are gluten-free',
    spicy: 'that are spicy', nuts: 'that contain nuts' };

  const lineKey = (item, option) => `${item}|${option || ''}`;
  function cartAdd(cart, item, option, qty) {
    const out = cart.map((l) => ({ ...l }));
    const l = out.find((x) => x.item === item && x.option === (option || ''));
    if (l) l.qty = Math.min(99, l.qty + qty);
    else out.push({ item, option: option || '', qty });
    return out;
  }
  function cartStep(cart, key, op) {
    const out = [];
    for (const l of cart) {
      if (lineKey(l.item, l.option) !== key) out.push({ ...l });
      else if (op === 'inc') out.push({ ...l, qty: Math.min(99, l.qty + 1) });
      else if (op === 'dec' && l.qty > 1) out.push({ ...l, qty: l.qty - 1 });
      // 'remove' and 'dec' at 1 drop the line
    }
    return out;
  }
  function linePrice(spec, l) {
    const it = spec.items[l.item];
    const g = it.group;
    const extra = g ? g.extra[Math.max(0, g.values.indexOf(l.option))] : 0;
    return (it.price + extra) * l.qty;
  }
  const cartTotal = (spec, cart) => cart.reduce((s, l) => s + linePrice(spec, l), 0);
  const qtyOf = (cart, item, option) => {
    const l = cart.find((x) => x.item === item && x.option === (option || ''));
    return l ? l.qty : 0;
  };
  const hasTag = (spec, item, tag) => spec.items[item].tags.includes(tag);

  function cartErr(cart, spec) {
    if (spec.mode === 'type') {
      let good = 0;
      let bad = 0;
      for (const l of cart) {
        if (hasTag(spec, l.item, spec.tag)) good += l.qty;
        else bad += l.qty;
      }
      return 1 - Math.min(good, spec.count) / (spec.count + bad + Math.max(0, good - spec.count));
    }
    const want = new Set(spec.order.map((o) => lineKey(o.item, o.option)));
    let score = 0;
    for (const o of spec.order) {
      const q = qtyOf(cart, o.item, o.option);
      if (q) score += Math.min(q, o.qty) / Math.max(q, o.qty);
    }
    const extra = cart.filter((l) => !want.has(lineKey(l.item, l.option))).length;
    return 1 - score / (spec.order.length + extra);
  }

  function sampleFood(rng, opts) {
    const cs = { csplit: opts.csplit };
    const money = moneyFor(rng.pick(['en-US', 'en-US', 'en-GB', 'de-DE', 'fr-FR', 'nl-NL', 'it-IT']));
    const byCat = {};
    for (const d of C.DISHES) (byCat[d.category] ||= []).push(d);
    const catPool = Object.keys(byCat).filter((k) => byCat[k].length >= 5);
    for (;;) {
      const lv = levelOf(opts);
      const catNames = rng.sample(catPool, lv ? 3 : opts.ood ? rng.int(5, 6) : rng.int(3, 4));
      const items = [];
      const cats = catNames.map((name, c) => {
        const bank = C.sample(rng, byCat[name], lv ? 4 : rng.int(4, 6), cs);
        return {
          name,
          items: bank.map((d) => {
            const id = items.length;
            items.push({ id, name: d.name, desc: rng.pick(NOTES), price: menuPrice(d.price, money), tags: dishTags(d), cat: c,
              group: dishGroup(d, money) });
            return id;
          }),
        };
      });
      if (cats.some((c) => c.items.length < 3)) continue;
      const mode = lv === 'easy' ? 'items' : rng.bool(0.25) ? 'type' : 'items';
      const spec = { restaurant: rng.pick(RESTAURANTS), cats, items, startTab: rng.int(0, cats.length - 1), mode, money };
      if (mode === 'type') {
        const tags = Object.keys(TAG_LABEL).filter((t) => items.filter((it) => it.tags.includes(t)).length >= 2
          && items.some((it) => !it.tags.includes(t)));
        if (!tags.length) continue;
        spec.tag = rng.pick(tags);
        spec.count = lv ? 2 : opts.ood ? rng.int(4, 6) : rng.int(2, 4);
      } else {
        const k = lv === 'easy' ? 1 : lv === 'medium' ? 2 : opts.ood ? rng.int(3, 4) : rng.pick([1, 2, 2, 3, 3]);
        const allQty1 = lv ? true : rng.bool(0.5);
        const plain = items.filter((it) => !it.group);
        spec.order = rng.sample(lv === 'easy' && plain.length ? plain : items, k).map((it) => ({
          item: it.id,
          option: it.group ? rng.pick(it.group.values) : '',
          qty: allQty1 ? 1 : opts.ood ? rng.int(1, 5) : rng.pick([1, 1, 2, 3]),
        }));
        spec.oneEach = spec.order.every((o) => o.qty === 1);
      }
      return spec;
    }
  }

  // Lines the cart should end with (closed-loop: in type mode the good lines already there count).
  function foodNeed(m, spec, item, option) {
    if (spec.mode === 'type') {
      if (!hasTag(spec, item, spec.tag)) return null;
      const good = m.cart.reduce((s, l) => s + (hasTag(spec, l.item, spec.tag) ? l.qty : 0), 0);
      return good < spec.count ? { option, qty: Math.min(9, spec.count - good) } : null;
    }
    const open = spec.order.filter((o) => o.item === item && qtyOf(m.cart, o.item, o.option) < o.qty);
    if (!open.length) return null;
    const o = open.find((x) => x.option === option) || open[0];
    return { option: o.option, qty: Math.min(9, o.qty - qtyOf(m.cart, o.item, o.option)) };
  }

  function planFood(m, spec) {
    if (m.ordered) return cartErr(m.cart, spec) > 1e-9 ? { click: { cancelOrder: true } } : null;
    if (m.dialog) {
      const it = spec.items[m.dialog.item];
      const want = foodNeed(m, spec, m.dialog.item, m.dialog.option);
      if (!want) return { click: { dialog: 'cancel' } };
      if (it.group && m.dialog.option !== want.option) return { click: { choice: want.option } };
      if (m.dialog.qty < want.qty) return { click: { qty: 'up' } };
      if (m.dialog.qty > want.qty) return { click: { qty: 'down' } };
      return { click: { dialog: 'add' } };
    }
    if (spec.mode === 'type') {
      const good = (l) => hasTag(spec, l.item, spec.tag);
      const bad = m.cart.find((l) => !good(l));
      if (bad) return { click: { line: lineKey(bad.item, bad.option), op: 'remove' } };
      const g = m.cart.reduce((s, l) => s + l.qty, 0);
      if (g > spec.count) {
        const l = m.cart[m.cart.length - 1];
        return { click: { line: lineKey(l.item, l.option), op: 'dec' } };
      }
      if (g < spec.count) {
        if (m.cart.length) return { click: { line: lineKey(m.cart[0].item, m.cart[0].option), op: 'inc' } };
        const here = spec.cats[m.tab].items.find((i) => hasTag(spec, i, spec.tag));
        const pick = here !== undefined ? here : spec.items.find((it) => it.tags.includes(spec.tag)).id;
        if (spec.items[pick].cat !== m.tab) return { click: { tab: spec.items[pick].cat } };
        return { click: { add: pick } };
      }
      return { click: { order: true } };
    }
    const want = new Map(spec.order.map((o) => [lineKey(o.item, o.option), o]));
    const extra = m.cart.find((l) => !want.has(lineKey(l.item, l.option)));
    if (extra) return { click: { line: lineKey(extra.item, extra.option), op: 'remove' } };
    for (const l of m.cart) {
      const o = want.get(lineKey(l.item, l.option));
      if (l.qty > o.qty) return { click: { line: lineKey(l.item, l.option), op: 'dec' } };
      if (l.qty < o.qty) return { click: { line: lineKey(l.item, l.option), op: 'inc' } };
    }
    const missing = spec.order.find((o) => !qtyOf(m.cart, o.item, o.option));
    if (missing) {
      const c = spec.items[missing.item].cat;
      if (m.tab !== c) return { click: { tab: c } };
      return { click: { add: missing.item } };
    }
    return { click: { order: true } };
  }

  const FOOD_ITEMS = [
    'Order {list}.',
    'Add {list} to the cart and place the order.',
    'Put in a delivery order for {list}.',
    'My order is {list}. Please place it.',
    'Get {list} delivered.',
    'Place an order with exactly {list}, nothing else.',
    'Order the following: {list}.',
    '{list}, please. Order just that.',
    'Make my full order {list}.',
    'Order for me: {list}, with no extras.',
    'All I want ordered is {list}.',
    'For my order, stick to {list}.',
    'I am ordering only {list}.',
    'Please order {list} as listed.',
    '{list}. That is the whole order.',
    'Order {list} and leave it at that.',
    'Go ahead and order just {list}.',
    'The order must be exactly {list}.',
    'Please place this order: {list} only.',
    '{list}: no more, no less. Order it.',
    'An order, please: {list} alone.',
    'Send {list} as my full order.',
  ];
  const FOOD_TYPE = [
    'Order {count} items {ask}.',
    'Put {count} dishes {ask} in the cart and place the order.',
    'Order any {count} items {ask}, and nothing else.',
    'Get {count} things {ask} delivered.',
    'Fill the cart with {count} items {ask} and order them.',
    'Choose {count} menu items {ask} and place the order.',
    'Please order a total of {count} items {ask}.',
    'Place my order for {count} items {ask} only.',
    'Make the entire order {count} items {ask}.',
    'Order {count} items {ask} in total, without extras.',
    'Keep the order to {count} items {ask}, please.',
    'I want only {count} items {ask} ordered.',
    'My whole order should be {count} items {ask}.',
    'An order of {count} items {ask} is all I need.',
    'Nothing but {count} items {ask} for this order.',
    'The order is for exactly {count} items {ask}.',
    'Find items {ask} and order exactly {count}.',
    'Fill my order with {count} items {ask} only.',
    'Have {count} items {ask} ordered, no extras.',
  ];

  const ABSENT_DISHES = [
    'Lobster Thermidor', 'Wagyu Sliders', 'Truffle Risotto', 'Peking Duck', 'Beef Wellington', 'Paella Valenciana',
    'Tournedos Rossini', 'Oysters Bienville', 'Chicken Marengo', 'Sole Meuniere', 'Vitello Tonnato',
    'Cherries Jubilee', 'Lancashire Hotpot', 'Cullen Skink', 'Pabellon Criollo', 'Imam Bayildi', 'Steak Diane',
    'Chicken Vesuvio', 'Baked Alaska', 'Salmon Coulibiac', 'Poulet Chasseur', 'Peach Melba'
  ];

  // The widget API (fam.helpers).
  Object.assign(fam.helpers, { lineKey, cartTotal, linePrice, TAG_LABEL });

  env.scenario('use-shop', {
    name: 'food',
    sample: sampleFood,
    init(spec, r) {
      const mode = spec.startMode;
      const m = { tab: spec.startTab, cart: [], dialog: null, ordered: false, wrongs: 0 };
      if (mode === 'partial') {
        if (spec.mode === 'type') {
          const good = spec.items.find((it) => it.tags.includes(spec.tag));
          if (spec.count > 1) m.cart = [{ item: good.id, option: good.group ? good.group.values[0] : '', qty: spec.count - 1 }];
        } else {
          const o = spec.order[0];
          if (spec.order.length > 1) m.cart = spec.order.slice(0, -1).map((x) => ({ ...x }));
          else if (o.qty > 1) m.cart = [{ ...o, qty: o.qty - 1 }];
        }
      } else if (mode === 'wrong') {
        if (spec.mode === 'type') {
          const bad = spec.items.find((it) => !it.tags.includes(spec.tag));
          m.cart = [{ item: bad.id, option: bad.group ? bad.group.values[0] : '', qty: 1 }];
        } else {
          const wanted = new Set(spec.order.map((o) => o.item));
          const bad = spec.items.find((it) => !wanted.has(it.id));
          const o = spec.order[0];
          const it = spec.items[o.item];
          const wrongOpt = it.group ? it.group.values.find((v) => v !== o.option) : null;
          m.cart = [wrongOpt ? { item: o.item, option: wrongOpt, qty: o.qty } : { item: o.item, option: o.option, qty: o.qty + 1 }];
          if (bad && r.bool(0.6)) m.cart.push({ item: bad.id, option: bad.group ? bad.group.values[0] : '', qty: 1 });
        }
        if (spec.recoverable && r.bool(0.5)) Object.assign(m, { ordered: true, wrongs: 1 });
      }
      return m;
    },
    error(m, spec) {
      const e = cartErr(m.cart, spec);
      return m.ordered ? e : 0.1 + 0.9 * e;
    },
    purchased: (m) => !!m.ordered,
    prepared: (m, spec) => cartErr(m.cart, spec),
    ended: (m, spec, last) => (m.ordered && cartErr(m.cart, spec) > 1e-9 && last ? 'wrong-order' : null),
    plan: planFood,
    apply(m, spec, step) {
      const done = listStep(m, spec, step, () => 0);
      if (done) return done;
      if (step.type) return m;
      const t = step.click;
      if (!t) return m;
      if (t.tab !== undefined) return { ...m, tab: t.tab };
      if (t.add !== undefined) {
        const it = spec.items[t.add];
        if (it.group) return { ...m, dialog: { item: t.add, option: it.group.values[0], qty: 1 } };
        return { ...m, cart: cartAdd(m.cart, t.add, '', 1) };
      }
      if (t.choice !== undefined) return { ...m, dialog: { ...m.dialog, option: t.choice } };
      if (t.qty) return { ...m, dialog: { ...m.dialog, qty: clamp(m.dialog.qty + (t.qty === 'up' ? 1 : -1), 1, 9) } };
      if (t.dialog === 'cancel') return { ...m, dialog: null };
      if (t.dialog === 'add') return { ...m, dialog: null, cart: cartAdd(m.cart, m.dialog.item, m.dialog.option, m.dialog.qty) };
      if (t.line !== undefined) return { ...m, cart: cartStep(m.cart, t.line, t.op) };
      if (t.order) return m.cart.length ? { ...m, ordered: true, wrongs: m.wrongs + (cartErr(m.cart, spec) > 1e-9 ? 1 : 0) } : m;
      if (t.cancelOrder) return { ...m, ordered: false };
      return m;
    },
    instruction(spec, rng) {
      if (spec.mode === 'type') {
        return sayIt(spec, rng, FOOD_TYPE, { count: spec.count, ask: TAG_ASK[spec.tag] },
          { terse: `${spec.count} × ${TAG_LABEL[spec.tag]}` });
      }
      const name = (o) => spec.items[o.item].name + (o.option ? ` (${o.option})` : '');
      const style = rng.int(0, 1);
      const items = spec.order.map((o) => (spec.oneEach ? `one ${name(o)}` : style ? `${o.qty} × ${name(o)}` : `${o.qty} ${name(o)}`));
      return sayIt(spec, rng, FOOD_ITEMS, { list: list(items) }, { terse: items.join('; ') });
    },
    confirmVerb: 'place the order',
    confirmAsk: 'place the order',
    ambiguous(jr, spec) {
      let it = jr.pick(spec.items.filter((x) => x.group));
      if (!it) {
        it = jr.pick(spec.items);
        it.group = { name: 'Size', values: ['Small', 'Regular', 'Large'], extra: [0, 150, 300] };
      }
      const qty = jr.pick([1, 2]);
      const rest = [...new Set(spec.items.filter((x) => x !== it && x.group).flatMap((x) => x.group.values))]
        .filter((v) => !it.group.values.includes(v)).map((v) => [v]);
      return { mode: 'ambiguous', cands: it.group.values.map((v) => [v]), need: 2, others: rest,
        message: `Which ${it.group.name.toLowerCase()} would you like for the ${it.name}: ${it.group.values.join(', ')}?`,
        templates: FOOD_ITEMS, vars: { list: qty === 1 ? `one ${it.name}` : `${qty} ${it.name}` }, terse: `${qty} × ${it.name}` };
    },
    impossible(jr, spec) {
      const have = new Set(spec.items.map((x) => x.name.toLowerCase()));
      const dish = jr.pick(ABSENT_DISHES.filter((d) => !have.has(d.toLowerCase())));
      const qty = jr.pick([1, 2, 3]);
      return { mode: 'impossible', what: [dish], message: `I can't do that: ${dish} is not on the menu.`,
        templates: FOOD_ITEMS, vars: { list: qty === 1 ? `one ${dish}` : `${qty} ${dish}` }, terse: `${qty} × ${dish}` };
    },
    parts: (m, s) => [...s.items.map((it) => ({ name: it.name, value: m.cart.filter((l) => l.item === it.id).map((l) => [l.option, l.qty]) })),
      { name: 'Order placed', value: m.ordered }],
    silent: (n, next, prev, s, rng) => cartSilent(n, next, prev, rng),
    check() {
      const fails = [];
      const food = { scenario: 'food', mode: 'items', items: [{ tags: [] }, { tags: [] }, { tags: [] }],
        order: [{ item: 0, option: '', qty: 2 }, { item: 1, option: 'Large', qty: 1 }] };
      const ce = (cart) => cartErr(cart, food);
      if (ce([{ item: 0, option: '', qty: 2 }, { item: 1, option: 'Large', qty: 1 }]) !== 0) fails.push('food: exact cart not 0');
      if (Math.abs(ce([{ item: 0, option: '', qty: 2 }]) - 0.5) > 1e-9) fails.push('food: half cart not 0.5');
      if (Math.abs(ce([{ item: 0, option: '', qty: 2 }, { item: 1, option: 'Large', qty: 1 }, { item: 2, option: '', qty: 1 }]) - 1 / 3) > 1e-9) fails.push('food: extra line not counted');
      if (Math.abs(ce([{ item: 0, option: '', qty: 1 }, { item: 1, option: 'Small', qty: 1 }]) - (1 - 0.5 / 3)) > 1e-9) fails.push('food: wrong option / qty grading');
      return fails;
    },
  });
})();
