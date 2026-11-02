/*
 * use-shop / checkout: a multi-page store: find, add to the cart, check out, maybe track the order.
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('use-shop');
  const { C, cartSilent, fmtMoney, I, levelOf, moneyFor, norm, perUSD, reveal, sayIt, shelfPrice } = fam.lib;
  const { clamp, quote } = env.util;

  const CO_LOCALES = ['en-US', 'en-US', 'en-GB', 'de-DE', 'fr-FR', 'nl-NL', 'es-ES', 'it-IT'];
  const STORES = ['Cartwheel', 'Northpeak Supply', 'Basket & Co', 'Shopfront', 'Brightcart', 'Parcelry',
    'Hollow Oak Goods', 'Marketlane', 'Tidy Crate', 'Everyday Depot', 'Lark & Ledger', 'Bramblebox',
    'Goodswell Market', 'Clover & Kettle', 'Morrow Supply', 'Woven Basket', 'Kindred Cart', 'Mossy Mill',
    'Pennywood Market', 'Cedar Parcel', 'Hearthside Lane', 'Orchard & Ore', 'Westward Basket', 'Gatherwell Goods',
    'Thistle Depot', 'Goodfolk Supply', 'Cairnside Shop', 'Cornerstone Cart', 'Openfield Market', 'Foxglove Finds',
    'Stonepath Store', 'Merry Carton', 'Rookery Goods', 'Pinecone Market', 'Hushwood Shop', 'Windward Goods',
    'Wild Acre Market', 'Sable & Sprig', 'The Useful Nest', 'Amberlane Supply', 'Brisket & Birch', 'Dovetail Goods',
    'Rosehip Row', 'Ramble Supply', 'Sunroom Sundries', 'Daymark Goods', 'Bluebell Depot', 'Fablewood Market',
    'Crisp Cart', 'Sundial Supply', 'Goodgrain Market', 'Elmstone Goods', 'Broadleaf Bazaar', 'Stillwater Cart',
    'Foxden Market', 'Windmill Goods'];
  const SHIP_POOL = ['economy', 'express', 'nextday', 'twoday', 'pickup', 'locker'];
  const REASONS = [['mistake', 'I ordered this by mistake'], ['item', 'I chose the wrong item or quantity'],
    ['address', 'The shipping address is wrong'], ['price', 'I found a better price elsewhere'],
    ['slow', 'The delivery date is too late']];
  const ADDR_FIELDS = ['name', 'line1', 'city', 'postcode'];
  const normNo = (s) => String(s || '').toUpperCase().replace(/[\s#]/g, '');
  const cityLine = (a) => (a.us ? `${a.city}, ${a.region} ${a.postcode}` : `${a.postcode} ${a.city}`);
  const addrText = (a) => [a.name, a.line1, a.line2, cityLine(a)].filter(Boolean).join(', ');

  function queryFor(rng, name, products) {
    const words = name.replace(/\(.*?\)/g, ' ').split(/[\s,]+/).filter((w) => /^[A-Za-z][A-Za-z-]{2,}$/.test(w));
    const cands = [];
    for (let i = 0; i < words.length; i++) {
      if (words[i].length >= 4) cands.push(words[i]);
      if (i + 1 < words.length) cands.push(`${words[i]} ${words[i + 1]}`);
    }
    const ok = cands.map((c) => c.toLowerCase()).filter((q) => {
      const hits = products.filter((p) => norm(p.name).includes(q)).length;
      return hits >= 1 && hits <= 4;
    });
    return ok.length ? rng.pick(ok) : null;
  }

  // Split n products over k categories, at least 3 each.
  function spread(rng, n, k) {
    const out = Array(k).fill(3);
    for (let i = 3 * k; i < n; i++) out[rng.int(0, k - 1)]++;
    return out;
  }

  const niceStep = (units) => [1, 2, 5, 10, 20, 50, 100, 200, 500].find((s) => s >= units) || 1000;

  function sampleCheckout(rng, opts) {
    const cs = { csplit: opts.csplit };
    const ood = !!opts.ood;
    const lv = levelOf(opts);
    const byCat = {};
    for (const p of C.PRODUCTS) (byCat[p.category] ||= []).push(p);
    const catPool = C.PRODUCT_CATEGORIES.filter((c) => (byCat[c.id] || []).length >= 10);
    for (let attempt = 0; ; attempt++) {
      const locale = rng.pick(CO_LOCALES);
      const money = moneyFor(locale);
      const nc = lv === 'easy' ? 2 : lv === 'medium' ? 3 : ood ? rng.int(5, 6) : rng.int(3, 4);
      const catDefs = rng.sample(catPool, nc);
      const counts = spread(rng, lv === 'easy' ? rng.int(8, 10) : lv === 'medium' ? rng.int(9, 12) : ood ? rng.int(24, 34) : rng.int(9, 15), nc);
      let products = [];
      catDefs.forEach((c, ci) => {
        for (const p of C.sample(rng, byCat[c.id], counts[ci], cs)) {
          const price = shelfPrice(rng, p.priceMin + (p.priceMax - p.priceMin) * rng.float(), money);
          products.push({
            name: p.name, cat: ci, price, was: rng.bool(0.22) ? price + Math.max(100, Math.round(price * rng.float(0.1, 0.35) / 100) * 100) : null,
            rating: rng.int(30, 49), reviews: rng.pick([rng.int(2, 40), rng.int(40, 400), rng.int(400, 3200)]),
            stock: rng.bool(0.14) ? 0 : rng.pick([1, 2, 3, 4, 5, 6, 8, 12, 15, 20, 24]), hue: rng.int(0, 359),
            sku: C.sku(rng),
          });
        }
      });
      products = rng.shuffle(products).map((p, id) => ({ id, ...p }));
      if (products.length < 8) continue;
      const maxPrice = Math.max(...products.map((p) => p.price));
      const sliderStep = 100 * niceStep(Math.ceil(maxPrice / 100 / 110));
      const sliderMax = Math.ceil(maxPrice / sliderStep) * sliderStep;

      const kind = lv === 'easy' ? 'name' : lv === 'medium' ? rng.pick(['name', 'name', 'cheapest']) : rng.pick(['name', 'name', 'cheapest', 'rated']);
      const qty = lv === 'easy' ? 1 : lv === 'medium' ? rng.pick([1, 1, 2]) : ood ? rng.int(1, 5) : rng.pick([1, 1, 1, 2, 3]);
      const inStock = (p) => p.stock >= qty;
      let target = null;
      let query = '';
      let cat = null;
      let max = null;
      if (kind === 'name') {
        const cands = products.filter(inStock);
        if (!cands.length) continue;
        target = rng.pick(cands);
        query = queryFor(rng, target.name, products);
        if (!query) continue;
      } else {
        cat = rng.int(0, nc - 1);
        const inCat = products.filter((p) => p.cat === cat).sort((a, b) => a.price - b.price);
        if (inCat.length < 3) continue;
        if (kind === 'cheapest') {
          if (rng.bool(0.5)) inCat[0].stock = 0; // the cheapest one is sold out
          const ok = inCat.filter((p) => p.stock > 0);
          if (ok.length < 2 || ok[0].price === ok[1].price || !inStock(ok[0])) continue;
          target = ok[0];
        } else {
          const cands = inCat.slice(0, -1).filter(inStock);
          if (!cands.length) continue;
          target = rng.pick(cands);
          const next = inCat.find((p) => p.price > target.price);
          if (!next) continue;
          max = Math.ceil(target.price / sliderStep) * sliderStep;
          if (max >= next.price) continue;
          target.rating = rng.int(42, 47);
          for (const p of inCat) if (p !== target && p.price <= max) p.rating = Math.min(p.rating, target.rating - rng.int(1, 6));
          const above = inCat.filter((p) => p.price > max);
          rng.pick(above).rating = Math.min(50, target.rating + rng.int(1, 3));
          const below = inCat.filter((p) => p !== target && p.price <= max);
          if (below.length && rng.bool(0.4)) {
            const trap = rng.pick(below); // better rated but sold out
            trap.stock = 0;
            trap.rating = Math.min(50, target.rating + 1);
          }
        }
      }
      const account = C.personName(rng, cs).full;
      const names = [account];
      while (names.length < 4) {
        const nm = C.personName(rng, cs).full;
        if (!names.includes(nm)) names.push(nm);
      }
      const nSaved = rng.int(2, 3);
      const saved = [];
      for (let i = 0, guard = 0; saved.length < nSaved && guard < 30; guard++) {
        const a = C.address(rng, locale, cs);
        if (saved.some((s) => s.city === a.city || s.line1 === a.line1)) continue;
        saved.push({ name: names[i++], line1: a.line1, line2: a.line2 || '', city: a.city, region: a.region || '',
          postcode: a.postcode, country: a.country, us: a.countryCode === 'US' });
      }
      if (saved.length < 2) continue;
      const addrMode = lv === 'easy' ? 'saved' : rng.bool(0.5) ? 'saved' : 'new';
      let addr = null;
      let want = null;
      if (addrMode === 'saved') addr = rng.bool(0.75) ? rng.int(1, saved.length - 1) : 0;
      else {
        const a = C.address(rng, locale, cs);
        want = { name: rng.bool(0.5) ? account : names[3], line1: a.line1, city: a.city, postcode: a.postcode,
          region: a.region || '', us: a.countryCode === 'US' };
      }
      const pool = C.SHIPPING_METHODS;
      const std = pool.find((s) => s.id === 'standard');
      const extra = rng.sample(pool.filter((s) => SHIP_POOL.includes(s.id)), 2);
      const methods = [std, ...extra].map((s) => ({ id: s.id, name: s.name, days: s.days,
        price: s.price ? Math.round(s.price * perUSD(money) * 100) : 0 }));
      const coupon = rng.bool(0.4) ? { code: C.pick(rng, C.COUPON_CODES, cs), pct: rng.pick([10, 15, 20, 25]),
        where: rng.bool(0.35) ? 'banner' : 'instr' } : null;
      const orderNos = [];
      while (orderNos.length < 4) {
        const no = C.orderId(rng);
        if (!orderNos.some((x) => normNo(x) === normNo(no))) orderNos.push(no);
      }
      return {
        store: rng.pick(STORES), money, cats: catDefs.map((c) => c.label), products,
        goal: { kind, product: target.id, qty, cat, max }, query, sliderMax, sliderStep,
        account, saved, addrMode, addr, addrRef: rng.pick(['city', 'city', 'name', 'street']), want, methods,
        ship: lv ? null : rng.bool(0.4) ? methods[rng.int(1, 2)].id : null, coupon: lv === 'easy' ? null : coupon, track: lv ? false : rng.bool(0.4), orderNos,
        loadMs: rng.pick([0, 700, 1500, 2300]), layout: pickLayout(rng.bool(0.45) ? 'page' : 'pane', opts), rows: rng.int(4, 6),
        route: rng.bool(0.5) ? 'wheel' : 'thumb', addRoute: rng.bool(0.5) ? 'card' : 'detail', enter: rng.bool(0.3),
        salt: rng.int(1, 1e9),
      };
    }
  }

  const pickLayout = (drawn, opts) => (opts.traits && opts.traits.layout) || drawn; // widgets may fix the layout
  const coP = (spec, id) => spec.products[id];
  const coMatch = (p, q) => !q || norm(p.name).includes(norm(q));
  const coQty = (m, id) => (m.qty && m.qty[id]) || 1;
  const coMaxQty = (p) => Math.max(1, Math.min(9, p.stock));
  function coVisible(m, spec) {
    if (m.loading > 0) return [];
    return spec.products.filter((p) => coMatch(p, m.query) && (!m.cats.length || m.cats.includes(p.cat))
      && p.price >= m.price[0] && p.price <= m.price[1]).map((p) => p.id);
  }
  function coLineScore(lines, spec) {
    const g = spec.goal;
    let score = 0;
    let extra = 0;
    for (const l of lines) {
      if (l.id === g.product) score += Math.min(l.qty, g.qty) / Math.max(l.qty, g.qty);
      else extra++;
    }
    return score / (1 + extra);
  }
  const coAddrWant = (spec) => (spec.addrMode === 'saved' ? spec.addr : 'new');
  function coAddrScore(addr, spec) {
    if (spec.addrMode === 'saved') return addr === spec.addr ? 1 : 0;
    if (!addr || typeof addr !== 'object') return 0;
    return ADDR_FIELDS.filter((f) => norm(addr[f]) === norm(spec.want[f])).length / ADDR_FIELDS.length;
  }
  const coDraftAddr = (m) => (m.pick === 'new' ? m.form : m.pick);
  const coLive = (m) => {
    const o = m.orders[m.orders.length - 1];
    return o && !o.cancelled ? o : null;
  };
  const coOrderNo = (spec, k) => (k < spec.orderNos.length ? spec.orderNos[k] : `${spec.orderNos[0]}-${k}`);
  function coOrderRight(o, spec) {
    return coLineScore(o.lines, spec) === 1 && coAddrScore(o.addr, spec) === 1
      && (!spec.coupon || o.coupon === spec.coupon.code) && (!spec.ship || o.ship === spec.ship);
  }
  function coTotals(spec, lines, coupon, ship) {
    const sub = lines.reduce((s, l) => s + coP(spec, l.id).price * l.qty, 0);
    const pct = coupon && spec.coupon && coupon === spec.coupon.code ? spec.coupon.pct : 0;
    const disc = Math.round(sub * pct / 100);
    const method = spec.methods.find((x) => x.id === ship);
    const shipping = ship === undefined || !method ? 0 : method.price;
    return { sub, disc, shipping, total: sub - disc + shipping };
  }
  function coError(m, spec) {
    const live = coLive(m);
    const src = live || { lines: m.cart, addr: coDraftAddr(m), coupon: m.coupon, ship: m.ship };
    let S = 4 * coLineScore(src.lines, spec) + 2 * coAddrScore(src.addr, spec);
    let T = 9;
    if (spec.coupon) {
      T += 1;
      if (src.coupon === spec.coupon.code) S += 1;
    }
    if (spec.ship) {
      T += 1;
      if (src.ship === spec.ship) S += 1;
    }
    if (spec.track) T += 2;
    const right = !!live && coOrderRight(live, spec);
    if (right) {
      S += 3;
      if (spec.track && m.tracked === live.no) S += 2;
    }
    const e = Math.max(0, 1 - S / T);
    return live && !right ? Math.max(e, 0.7) : e;
  }

  function coCartAdd(cart, p, n) {
    const out = cart.map((l) => ({ ...l }));
    const l = out.find((x) => x.id === p.id);
    if (l) l.qty = Math.min(p.stock, l.qty + n);
    else out.push({ id: p.id, qty: Math.min(p.stock, n) });
    return out;
  }

  function initCheckout(spec, rng) {
    const m = { page: 'shop', text: '', query: '', loading: 0, cats: [], price: [0, spec.sliderMax], qty: {}, scroll: 0,
      view: null, cart: [], couponText: '', coupon: null, couponMsg: '', pick: 0,
      form: { name: spec.account, line1: '', city: '', postcode: '' }, ship: spec.methods[0].id, invalid: [], orders: [],
      wrongs: 0, reason: null, trackText: '', tracked: null, notice: null };
    const g = spec.goal;
    const T = coP(spec, g.product);
    const right = [{ id: g.product, qty: g.qty }];
    if (spec.startMode === 'partial') {
      const k = rng.int(0, 2);
      if (k === 0) {
        if (g.kind === 'name') m.text = m.query = spec.query;
        else m.cats = [g.cat];
      } else if (k === 1) {
        m.cart = right;
        m.page = rng.pick(['cart', 'shop']);
      } else {
        m.cart = right;
        m.page = 'checkout';
        if (spec.addrMode === 'new') {
          m.pick = 'new';
          m.form = { ...m.form, name: spec.want.name, line1: spec.want.line1 };
        }
      }
    } else if (spec.startMode === 'scene') {
      // The store as the reference screen shows it: the goal's search submitted ('name') or its category checked,
      // the matching products listed, nothing in the cart.
      if (g.kind === 'name') m.text = m.query = spec.query;
      else m.cats = [g.cat];
    } else if (spec.startMode === 'wrong') {
      const others = spec.products.filter((p) => p.id !== g.product && p.stock > 0);
      const other = others.find((p) => p.cat === T.cat) || others[0];
      const wq = g.qty > 1 ? g.qty - 1 : T.stock >= 2 ? 2 : 0;
      const kinds = ['cart', 'address'];
      if (wq) kinds.push('qty');
      if (spec.recoverable) kinds.push('order', 'order');
      const k = rng.pick(kinds);
      if (k === 'cart') {
        m.cart = [{ id: other.id, qty: 1 }];
        m.page = 'cart';
      } else if (k === 'qty') {
        m.cart = [{ id: g.product, qty: wq }];
        m.page = 'cart';
      } else if (k === 'address') {
        m.cart = right;
        m.page = 'checkout';
        if (spec.addrMode === 'saved') m.pick = (spec.addr + 1) % spec.saved.length;
        else {
          const s = spec.saved[spec.saved.length - 1];
          m.pick = 'new';
          m.form = { name: spec.want.name, line1: s.line1, city: s.city, postcode: s.postcode };
        }
      } else {
        const lines = !wq || rng.bool(0.5) ? [{ id: other.id, qty: 1 }] : [{ id: g.product, qty: wq }];
        m.orders = [{ no: coOrderNo(spec, 0), lines, coupon: spec.coupon ? spec.coupon.code : null,
          addr: spec.addrMode === 'saved' ? spec.addr : { name: spec.want.name, line1: spec.want.line1, city: spec.want.city,
            postcode: spec.want.postcode }, ship: spec.ship || m.ship, cancelled: false }];
        m.wrongs = 1;
        m.page = 'order';
      }
    }
    return m;
  }

  function coSearch(m, spec) {
    m.query = m.text.trim();
    m.loading = spec.loadMs;
    m.page = 'shop';
    m.scroll = 0;
    m.view = null;
    m.notice = null;
    return m;
  }
  function coApplyCoupon(m, spec) {
    const code = m.couponText.trim();
    if (spec.coupon && norm(code) === norm(spec.coupon.code)) {
      m.coupon = spec.coupon.code;
      m.couponMsg = 'ok';
    } else m.couponMsg = code ? 'invalid' : 'empty';
    return m;
  }
  function coTrack(m) {
    const o = m.orders.find((x) => normNo(x.no) === normNo(m.trackText));
    m.tracked = m.trackText.trim() ? (o ? o.no : '') : null;
    return m;
  }
  function coSetPrice(m, spec, j, v) {
    const step = spec.sliderStep;
    const x = clamp(Math.round(v / step) * step, 0, spec.sliderMax);
    const p = m.price.slice();
    p[j] = j === 0 ? Math.min(x, p[1]) : Math.max(x, p[0]);
    m.price = p;
    m.scroll = 0;
    return m;
  }

  // Place an order only after the cart and shipping address are complete.
  function coPlaceOrder(m, spec, live) {
    if (!m.cart.length || live) return m;
    if (m.pick === 'new') {
      const bad = ADDR_FIELDS.filter((f) => !String(m.form[f] || '').trim());
      if (bad.length) {
        m.invalid = bad;
        return m;
      }
    }
    const order = { no: coOrderNo(spec, m.orders.length), lines: m.cart.map((l) => ({ ...l })), coupon: m.coupon,
      addr: m.pick === 'new' ? { ...m.form } : m.pick, ship: m.ship, cancelled: false };
    if (!coOrderRight(order, spec)) m.wrongs++;
    m.orders = [...m.orders, order];
    Object.assign(m, { cart: [], coupon: null, couponText: '', couponMsg: '', page: 'order', qty: {}, invalid: [], notice: null });
    return m;
  }

  function applyCheckout(m, spec, step) {
    if (step.type) m.focus = step.type[0].field;
    else if (step.click || step.drag) m.focus = null;
    if (step.wait) {
      m.loading = 0;
      return m;
    }
    if (step.wheel) {
      const n = coVisible(m, spec).length;
      m.scroll = clamp(m.scroll + step.wheel[1] / (m.pitch || 80), 0, Math.max(0, n - spec.rows));
      return m;
    }
    if (step.drag) {
      const t = step.drag[1];
      if (t.scroll !== undefined) m.scroll = clamp(t.scroll, 0, Math.max(0, coVisible(m, spec).length - spec.rows));
      else if (t.price !== undefined) coSetPrice(m, spec, t.j, t.price);
      return m;
    }
    if (step.type) {
      const [t, text] = step.type;
      if (t.field === 'search') m.text = text;
      else if (t.field === 'coupon') m.couponText = text;
      else if (t.field === 'track') m.trackText = text;
      else {
        m.form = { ...m.form, [t.field]: text };
        m.invalid = m.invalid.filter((f) => f !== t.field);
      }
      return m;
    }
    if (step.key === 'Enter') {
      if (step.on === 'search') return coSearch(m, spec);
      if (step.on === 'coupon') return coApplyCoupon(m, spec);
      if (step.on === 'track') return coTrack(m);
      return m;
    }
    const t = step.click;
    if (!t) return m;
    const live = coLive(m);
    if (t.nav) {
      m.page = t.nav;
      m.notice = null;
      return m;
    }
    if (t.button === 'search') return coSearch(m, spec);
    if (t.button === 'coupon') return coApplyCoupon(m, spec);
    if (t.button === 'track') return coTrack(m);
    if (t.cat !== undefined) {
      m.cats = m.cats.includes(t.cat) ? m.cats.filter((c) => c !== t.cat) : [...m.cats, t.cat].sort((a, b) => a - b);
      m.scroll = 0;
      return m;
    }
    if (t.cardQty !== undefined || t.detailQty) {
      const id = t.cardQty !== undefined ? t.cardQty : m.view;
      const dir = t.dir || t.detailQty;
      m.qty = { ...m.qty, [id]: clamp(coQty(m, id) + (dir === 'up' ? 1 : -1), 1, coMaxQty(coP(spec, id))) };
      return m;
    }
    if (t.add !== undefined || t.addDetail) {
      const p = coP(spec, t.add !== undefined ? t.add : m.view);
      if (!p.stock) return m;
      m.cart = coCartAdd(m.cart, p, coQty(m, p.id));
      m.notice = { added: p.id };
      return m;
    }
    if (t.open !== undefined) {
      m.page = 'product';
      m.view = t.open;
      m.notice = null;
      return m;
    }
    if (t.back) {
      m.page = t.back;
      m.notice = null;
      return m;
    }
    if (t.line !== undefined) {
      const p = coP(spec, t.line);
      const out = [];
      for (const l of m.cart) {
        if (l.id !== t.line) out.push(l);
        else if (t.op === 'inc') out.push({ ...l, qty: Math.min(p.stock, l.qty + 1) });
        else if (t.op === 'dec' && l.qty > 1) out.push({ ...l, qty: l.qty - 1 });
      }
      m.cart = out;
      return m;
    }
    if (t.couponRemove) {
      m.coupon = null;
      m.couponMsg = '';
      return m;
    }
    if (t.checkout) {
      if (m.cart.length) {
        m.page = 'checkout';
        m.notice = null;
      }
      return m;
    }
    if (t.addr !== undefined) {
      m.pick = t.addr;
      m.invalid = [];
      return m;
    }
    if (t.ship) {
      m.ship = t.ship;
      return m;
    }
    if (t.place) return coPlaceOrder(m, spec, live);
    if (t.cancelOrder) {
      if (live) {
        m.page = 'cancel';
        m.reason = null;
      }
      return m;
    }
    if (t.reason) {
      m.reason = t.reason;
      return m;
    }
    if (t.keep) {
      m.page = 'order';
      return m;
    }
    if (t.confirmCancel) {
      if (!live || !m.reason) return m;
      m.orders = m.orders.map((o) => (o === live || o.no === live.no ? { ...o, cancelled: true } : o));
      m.cart = live.lines.map((l) => ({ ...l }));
      m.coupon = live.coupon;
      m.couponText = live.coupon || '';
      m.couponMsg = live.coupon ? 'ok' : '';
      if (typeof live.addr === 'object') {
        m.pick = 'new';
        m.form = { ...live.addr };
      } else m.pick = live.addr;
      m.ship = live.ship;
      m.page = 'cart';
      m.reason = null;
      m.notice = { cancelled: live.no };
      return m;
    }
    return m;
  }

  function planFind(m, spec) {
    const g = spec.goal;
    const T = coP(spec, g.product);
    if (m.page === 'product') {
      if (m.view === g.product) {
        const q = coQty(m, g.product);
        if (q !== g.qty) return { click: { detailQty: q < g.qty ? 'up' : 'down' } };
        return { click: { addDetail: true } };
      }
      return { click: { back: 'shop' } };
    }
    const needQuery = g.kind === 'name' ? !(m.query && coMatch(T, m.query)) : !coMatch(T, m.query);
    if (needQuery) {
      const q = g.kind === 'name' ? spec.query : '';
      if (norm(m.text) !== norm(q)) return { type: [{ field: 'search' }, q] };
      return spec.enter && m.focus === 'search' ? { key: 'Enter', on: 'search' } : { click: { button: 'search' } };
    }
    if (m.page !== 'shop') return { click: { nav: 'shop' } };
    if (m.loading > 0) return { wait: true };
    if (g.cat !== null && !m.cats.includes(g.cat)) return { click: { cat: g.cat } };
    if (m.cats.length && !m.cats.includes(T.cat)) return { click: { cat: T.cat } };
    if (m.price[0] > T.price) return { drag: [{ price: 'thumb', j: 0 }, { price: 0, j: 0 }] };
    if (m.price[1] < T.price || (g.kind === 'rated' && m.price[1] > g.max)) {
      return { drag: [{ price: 'thumb', j: 1 }, { price: g.kind === 'rated' ? g.max : spec.sliderMax, j: 1 }] };
    }
    const vis = coVisible(m, spec);
    const pos = vis.indexOf(g.product);
    if (pos < 0) return null;
    if (spec.layout === 'pane') {
      const s = reveal(m, spec, pos, vis.length, spec.rows);
      if (s) return s;
    }
    if (spec.addRoute === 'detail') return { click: { open: g.product } };
    const q = coQty(m, g.product);
    if (q !== g.qty) return { click: { cardQty: g.product, dir: q < g.qty ? 'up' : 'down' } };
    return { click: { add: g.product } };
  }

  function planCheckout(m, spec) {
    const g = spec.goal;
    const live = coLive(m);
    if (live) {
      if (!coOrderRight(live, spec)) {
        if (m.page === 'cancel') return m.reason ? { click: { confirmCancel: true } } : { click: { reason: REASONS[1][0] } };
        if (m.page === 'order') return { click: { cancelOrder: true } };
        return { click: { nav: 'order' } };
      }
      if (spec.track && m.tracked !== live.no) {
        if (m.page !== 'track') return { click: { nav: 'track' } };
        if (normNo(m.trackText) !== normNo(live.no)) return { type: [{ field: 'track' }, live.no] };
        return spec.enter && m.focus === 'track' ? { key: 'Enter', on: 'track' } : { click: { button: 'track' } };
      }
      return null;
    }
    const extra = m.cart.find((l) => l.id !== g.product);
    const mine = m.cart.find((l) => l.id === g.product);
    if (extra || (mine && mine.qty !== g.qty)) {
      if (m.page !== 'cart') return { click: { nav: 'cart' } };
      if (extra) return { click: { line: extra.id, op: 'remove' } };
      return { click: { line: mine.id, op: mine.qty < g.qty ? 'inc' : 'dec' } };
    }
    if (!mine) return planFind(m, spec);
    if (spec.coupon && m.coupon !== spec.coupon.code) {
      if (m.page !== 'cart') return { click: { nav: 'cart' } };
      if (norm(m.couponText) !== norm(spec.coupon.code)) return { type: [{ field: 'coupon' }, spec.coupon.code] };
      return spec.enter && m.focus === 'coupon' ? { key: 'Enter', on: 'coupon' } : { click: { button: 'coupon' } };
    }
    if (m.page !== 'checkout') return m.page === 'cart' ? { click: { checkout: true } } : { click: { nav: 'cart' } };
    const want = coAddrWant(spec);
    if (m.pick !== want) return { click: { addr: want } };
    if (want === 'new') {
      for (const f of ADDR_FIELDS) if (norm(m.form[f]) !== norm(spec.want[f])) return { type: [{ field: f }, spec.want[f]] };
    }
    if (spec.ship && m.ship !== spec.ship) return { click: { ship: spec.ship } };
    return { click: { place: true } };
  }

  const CHECKOUT = [
    'Buy {goal} and ship it to {addr}.{extras}{track}',
    'Order {goal}, delivered to {addr}.{extras}{track}',
    'Purchase {goal}. Send it to {addr}.{extras}{track}',
    'Put {goal} in the cart and check out, shipping to {addr}.{extras}{track}',
    'Place an order for {goal} with delivery to {addr}.{extras}{track}',
    'Get {goal} and have it sent to {addr}.{extras}{track}',
    'Find {goal}, add it to the cart and complete the checkout (ship to {addr}).{extras}{track}',
    'I would like {goal} ordered for delivery to {addr}.{extras}{track}',
    'Use {addr} for shipping when buying {goal}.{extras}{track}',
    'Complete a purchase of {goal} for delivery to {addr}.{extras}{track}',
    'For delivery to {addr}, check out with {goal}.{extras}{track}',
    'Add {goal} to your cart. Check out with shipment to {addr}.{extras}{track}',
    'Please order {goal} for {addr}.{extras}{track}',
    'Make the order for {goal}, shipped to {addr}.{extras}{track}',
    'Take {goal} through checkout, shipping to {addr}.{extras}{track}',
    'I need {goal}. Buy it and send it to {addr}.{extras}{track}',
    'Have the shop sell me {goal} and send it to {addr}.{extras}{track}',
  ];
  const TRACK = [
    ' Afterwards, look the order up on the {page} using the order number from the confirmation.',
    ' Then check the order status on the {page}.',
    ' Afterwards, find that order on the {page} and check its status.',
  ];

  function instructionCheckout(spec, rng) {
    const g = spec.goal;
    const T = coP(spec, g.product);
    const catName = g.cat !== null ? I.alias(rng, spec.cats[g.cat], [spec.cats[g.cat].split(/[ &,]/)[0].toLowerCase()]) : '';
    const many = g.qty > 1 ? `${g.qty} units of ` : '';
    let goal;
    if (g.kind === 'name') goal = g.qty > 1 ? `${g.qty} × ${quote(T.name)}` : rng.pick([`one ${quote(T.name)}`, quote(T.name)]);
    else if (g.kind === 'cheapest') goal = `${many}the cheapest ${catName} item that is in stock`;
    else goal = `${many}the best-rated in-stock ${catName} product under ${fmtMoney(g.max, spec.money)}`;
    let addr;
    if (spec.addrMode === 'saved') {
      const a = spec.saved[spec.addr];
      addr = { city: `the saved address in ${a.city}`, name: `${a.name}'s saved address`, street: `the saved address on ${a.line1}` }[spec.addrRef];
    } else {
      const w = spec.want;
      addr = `${w.name}, ${w.line1}, ${cityLine(w)}`;
    }
    let extras = '';
    if (spec.coupon) {
      extras += spec.coupon.where === 'banner'
        ? ` ${rng.pick(['Apply the discount code shown in the store banner.', 'Use the promo code from the banner at the top of the shop.'])}`
        : ` ${rng.pick([`Use the promo code ${spec.coupon.code}.`, `Apply the coupon ${spec.coupon.code} before paying.`, `Don't forget the discount code ${spec.coupon.code}.`])}`;
    }
    if (spec.ship) {
      const name = spec.methods.find((x) => x.id === spec.ship).name.replace(/\s*\(.*\)$/, '');
      extras += ` ${rng.pick([`Choose ${name} for delivery.`, `Pick ${name} as the delivery option.`, `Delivery method: ${name}.`])}`;
    }
    const page = I.alias(rng, 'Track order page', [
      'order tracker', 'tracking page', 'order status page', 'order lookup page', 'status screen', 'tracking tool'
    ]);
    const track = spec.track ? I.fill(I.pick(rng, TRACK, spec.isplit), { page }) : '';
    return sayIt(spec, rng, CHECKOUT, { goal, addr, extras, track }, {
      terse: `${goal} → ${addr}${spec.coupon && spec.coupon.where === 'instr' ? `, code ${spec.coupon.code}` : ''}`,
      steps: [`find ${goal}`, 'add it to the cart', `check out with delivery to ${addr}`],
    });
  }

  const ABSENT_GOODS = [
    'Quantum Toaster 3000', 'Titanium Pogo Stick', 'Solar Umbrella Pro', 'Holographic Desk Globe',
    'Jetpack Starter Kit', 'Antigravity Tea Tray', 'Teleporting Shoe Rack', 'Lunar Picnic Basket',
    'Cloud Weaving Loom', 'Time Travel Kettle', 'Pocket Rainbow Mill', 'Thunder Bottling Kit', 'Starlight Scoop Wand',
    'Meteor Sorting Sieve', 'Echo Harvesting Jar', 'Invisible Tool Belt', 'Dream Powered Skates',
    'Comet Catching Reel', 'Dimension Door Wedge', 'Aurora Spinning Top'
  ];
  const COLOURS = [['Blue', 215], ['Red', 5], ['Green', 130], ['Yellow', 52], ['Purple', 280], ['Orange', 28]];

  // The widget API (fam.helpers).
  Object.assign(fam.helpers, { coVisible, coLive, coTotals, coMaxQty, coQty, REASONS, ADDR_FIELDS, addrText, cityLine });

  env.scenario('use-shop', {
    name: 'checkout',
    sample: sampleCheckout,
    init: initCheckout,
    error: coError,
    purchased: (m) => m.orders.length > 0,
    prepared(m, spec, e) {
      if (coLive(m)) return e;
      const src = { lines: m.cart, addr: coDraftAddr(m), coupon: m.coupon, ship: m.ship };
      const right = coLineScore(src.lines, spec) === 1 && coAddrScore(src.addr, spec) === 1
        && (!spec.coupon || src.coupon === spec.coupon.code) && (!spec.ship || src.ship === spec.ship);
      return right ? 0 : e;
    },
    ended(m, spec, last) {
      const live = coLive(m);
      return live && !coOrderRight(live, spec) && last ? 'wrong-order' : null;
    },
    plan: planCheckout,
    apply: applyCheckout,
    instruction: instructionCheckout,
    confirmVerb: 'place the order',
    confirmAsk: 'place the order',
    prepareConfirm(spec) {
      spec.track = false; // tracking needs the placed order
    },
    ambiguous(jr, spec) {
      const cand = spec.products.filter((p) => p.stock >= 3);
      const P = jr.pick(cand);
      const Q = jr.pick(spec.products.filter((p) => p !== P));
      const [c1, c2] = jr.sample(COLOURS, 2);
      const base = P.name.replace(/\s*\(.*\)/, '');
      P.name = `${base} (${c1[0]})`;
      P.hue = c1[1];
      Object.assign(Q, { name: `${base} (${c2[0]})`, hue: c2[1], cat: P.cat, price: P.price, was: null, stock: Math.max(Q.stock, 3) });
      const low = base.toLowerCase();
      const rest = spec.products.filter((p) => p !== P && p !== Q).map((p) => p.name)
        .filter((n) => !n.toLowerCase().includes(low) && !low.includes(n.toLowerCase())).map((n) => [n]);
      return { mode: 'ambiguous', cands: [[c1[0]], [c2[0]]], others: rest,
        message: `Which ${base} do you want: the ${c1[0].toLowerCase()} one or the ${c2[0].toLowerCase()} one?`,
        templates: [
          'Buy one {name} from the store.', 'Order a {name} and check out.',
          'Add one {name} to the cart and place the order.', 'Check out with a single {name} in the cart.',
          'I want to check out with one {name}.', 'My purchase should be one {name}.',
          'Please finish buying one {name} here.'
        ],
        vars: { name: quote(base) }, terse: `buy ${quote(base)}` };
    },
    impossible(jr, spec) {
      const have = new Set(spec.products.map((p) => p.name.toLowerCase()));
      const name = jr.pick(ABSENT_GOODS.filter((g) => !have.has(g.toLowerCase())));
      return { mode: 'impossible', what: [name], message: `I can't do that: the store doesn't sell ${name}.`,
        templates: [
          'Buy one {name} from the store.', 'Order a {name} and check out.',
          'Find the {name} and place an order for it.', 'Please buy a single {name} here.',
          'Find one {name} in the shop and buy it.', 'Put one {name} through checkout for me.',
          'A single {name} will be my order.', 'Please place my order for one {name}.',
          'Check out with exactly one {name}.'
        ],
        vars: { name: quote(name) }, terse: `buy ${quote(name)}` };
    },
    facts(m, s) {
      const o = coLive(m), t = coTotals(s, o ? o.lines : m.cart, o ? o.coupon : m.coupon, o ? o.ship : m.ship);
      return [{ label: 'Total', value: fmtMoney(t.total, s.money) },
        { label: 'Order number', value: o ? o.no : 'Not placed' }];
    },
    parts: (m, s) => [...s.products.map((p) => ({ name: p.name, value: (m.cart.find((l) => l.id === p.id) || { qty: 0 }).qty })),
      { name: 'Shipping address', value: [m.pick, m.form] }, { name: 'Delivery method', value: m.ship },
      { name: 'Promo code', value: [m.couponText, m.coupon] }, { name: 'Order placed', value: m.orders.map((o) => [o.no, o.cancelled]) }],
    silent: (n, next, prev, s, rng) => cartSilent(n, next, prev, rng),
    // selfTest: every third checkout is a fixed-layout widget
    testTraits: (seed) => (seed % 3 === 1 ? { layout: seed % 2 ? 'page' : 'pane' } : {}),
    checkSpec(spec, traits, tag, fails) {
        const g = spec.goal;
        const T = spec.products[g.product];
        if (T.stock < g.qty) fails.push(`${tag}: target stock ${T.stock} < qty ${g.qty}`);
        if (g.kind === 'rated' && (g.max < T.price || g.max % spec.sliderStep)) fails.push(`${tag}: bad price cap`);
    },
  });
})();
