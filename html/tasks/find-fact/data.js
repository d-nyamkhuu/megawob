/* find-fact/data.js: shared dataset columns and seeded row generation, used by table and datagrid. */
(function () {
  'use strict';
  const C = env.content;
  const { pad2 } = env.util;
  const lib = env.taskOf('find-fact').lib;
  const { CARRIERS, STATUSES, AIRCRAFT, nameOk, randomISO, showDate } = lib;

  const shortProducts = () => C.PRODUCTS.filter((p) => p.name.length <= 26);
  const catLabel = (id) => (C.PRODUCT_CATEGORIES.find((c) => c.id === id) || { label: id }).label;
  const money = (x) => `$${x.toFixed(2)}`;
  const timeOf = (min) => `${pad2(Math.floor(min / 60))}:${pad2(min % 60)}`;
  const isoDays = (iso) => { const [y, m, d] = iso.split('-').map(Number); return y * 372 + m * 31 + d; };

  // Column definitions: name, noun (how text refers to it), aliases, num (sortable numeric), make(row ctx).
  const DATASETS = {
    products: {
      title: [
        'Inventory', 'Product catalog', 'Stock list', 'Merchandise', 'Goods index', 'Retail items'
      ], ref: '', keyNoun: 'product',
      cols: [
        { name: 'Product', noun: 'product name', aliases: ['name'], key: true },
        { name: 'SKU', noun: 'SKU', aliases: ['item code', 'stock code'] },
        { name: 'Category', noun: 'category', aliases: ['department'] },
        { name: 'Price', noun: 'price', aliases: ['unit price', 'cost'], num: true },
        { name: 'In stock', noun: 'stock count', aliases: [
          'units in stock', 'quantity on hand', 'stock level', 'inventory count', 'stock balance', 'units present'
        ], num: true },
        { name: 'Rating', noun: 'rating', aliases: ['customer rating', 'star rating'], num: true },
        { name: 'Supplier', noun: 'supplier', aliases: ['vendor'], extra: true },
        { name: 'Warehouse', noun: 'warehouse', aliases: ['storage location'], extra: true },
        { name: 'Weight', noun: 'weight', aliases: ['shipping weight'], extra: true, num: true },
        { name: 'Reorder at', noun: 'reorder level', aliases: ['reorder point'], extra: true, num: true },
        { name: 'Updated', noun: 'last update date', aliases: ['update date'], extra: true, num: true },
      ],
    },
    flights: {
      title: ['Departures', 'Flight board', 'Today’s flights', 'Air traffic'], ref: 'flight ', keyNoun: 'flight',
      cols: [
        { name: 'Flight', noun: 'flight number', aliases: ['flight code'], key: true },
        { name: 'From', noun: 'departure airport', aliases: ['origin'] },
        { name: 'To', noun: 'destination', aliases: ['arrival airport'] },
        { name: 'Departs', noun: 'departure time', aliases: ['departure'], num: true },
        { name: 'Gate', noun: 'gate', aliases: ['boarding gate'] },
        { name: 'Status', noun: 'status', aliases: ['flight status'] },
        { name: 'Aircraft', noun: 'aircraft type', aliases: ['plane type'], extra: true },
        { name: 'Terminal', noun: 'terminal', aliases: [], extra: true },
        { name: 'Seats left', noun: 'number of free seats', aliases: ['seats available'], extra: true, num: true },
        { name: 'Duration', noun: 'flight time', aliases: ['duration'], extra: true, num: true },
      ],
    },
    staff: {
      title: ['Staff directory', 'Team members', 'Employees', 'Our people'], ref: '', keyNoun: 'person',
      cols: [
        { name: 'Name', noun: 'name', key: true },
        { name: 'Department', noun: 'department', aliases: ['team'] },
        { name: 'Office', noun: 'office', aliases: ['office city', 'location'] },
        { name: 'Extension', noun: 'extension', aliases: ['phone extension', 'ext.'] },
        { name: 'Started', noun: 'start year', aliases: ['year they joined', 'hire year'], num: true },
        { name: 'Title', noun: 'job title', aliases: ['role', 'position'], extra: true },
        { name: 'Email', noun: 'email address', aliases: ['email'], extra: true },
        { name: 'Desk', noun: 'desk number', aliases: ['desk'], extra: true },
        { name: 'Projects', noun: 'number of projects', aliases: ['project count'], extra: true, num: true },
      ],
    },
    orders: {
      title: [
        'Recent orders', 'Orders', 'Order history', 'Order ledger', 'Order book', 'Purchases'
      ], ref: 'order ', keyNoun: 'order',
      cols: [
        { name: 'Order', noun: 'order number', aliases: ['order ID'], key: true },
        { name: 'Customer', noun: 'customer', aliases: ['buyer', 'customer name'] },
        { name: 'Date', noun: 'order date', aliases: ['date'], num: true },
        { name: 'Total', noun: 'total', aliases: ['order total', 'amount'], num: true },
        { name: 'Items', noun: 'item count', aliases: ['number of items'], num: true },
        { name: 'Status', noun: 'status', aliases: ['order status'] },
        { name: 'Payment', noun: 'payment method', aliases: ['payment type'], extra: true },
        { name: 'Ship to', noun: 'shipping city', aliases: ['destination city'], extra: true },
        { name: 'Carrier', noun: 'carrier', aliases: ['shipping company'], extra: true },
        { name: 'Weight', noun: 'parcel weight', aliases: ['package weight'], extra: true, num: true },
      ],
    },
  };

  // One full row of a dataset: { cells: { name: text }, nums: { name: number | null }, key }.
  function makeRow(rng, dataset, spec, used) {
    const cities = C.split(C.CITIES, spec.csplit);
    const cell = {};
    const num = {};
    const put = (name, text, n = null) => { cell[name] = String(text); num[name] = n; };
    if (dataset === 'products') {
      const p = C.pick(rng, shortProducts(), C.csplitOf(spec));
      if (used.has(p.name)) return null;
      const pr = C.price(rng, p).amount;
      put('Product', p.name);
      put('SKU', C.sku(rng));
      put('Category', catLabel(p.category));
      put('Price', money(pr), pr);
      const st = rng.int(0, 240);
      put('In stock', st, st);
      const ra = rng.int(25, 50) / 10;
      put('Rating', ra.toFixed(1), ra);
      put('Supplier', C.pick(rng, C.COMPANIES, C.csplitOf(spec)));
      put('Warehouse', rng.pick(cities).city);
      const w = rng.int(1, 120) / 10;
      put('Weight', `${w.toFixed(1)} kg`, w);
      const ro = rng.int(5, 60);
      put('Reorder at', ro, ro);
      const iso = randomISO(rng, 2024, 2025);
      put('Updated', showDate(iso, 'short'), isoDays(iso));
    } else if (dataset === 'flights') {
      const fl = C.flightNumber(rng);
      if (used.has(fl)) return null;
      const [a, b] = rng.sample(cities.filter((c) => c.iata), 2);
      const dep = rng.int(5 * 12, 23 * 12) * 5;
      put('Flight', fl);
      put('From', a.iata);
      put('To', b.iata);
      put('Departs', timeOf(dep), dep);
      put('Gate', `${rng.pick(['A', 'B', 'C', 'D', 'E'])}${rng.int(1, 40)}`);
      put('Status', rng.pick(STATUSES));
      put('Aircraft', rng.pick(AIRCRAFT));
      put('Terminal', rng.pick(['1', '2', '3', '4', 'N', 'S']));
      const seats = rng.int(0, 90);
      put('Seats left', seats, seats);
      const dur = rng.int(9, 160) * 5;
      put('Duration', `${Math.floor(dur / 60)}h ${pad2(dur % 60)}m`, dur);
    } else if (dataset === 'staff') {
      const p = C.personName(rng, C.csplitOf(spec));
      if (used.has(p.full) || !nameOk(p)) return null;
      put('Name', p.full);
      put('Department', C.pick(rng, C.DEPARTMENTS, C.csplitOf(spec)));
      put('Office', rng.pick(cities).city);
      put('Extension', `x${rng.int(1000, 9899)}`);
      const yr = rng.int(2001, 2025);
      put('Started', yr, yr);
      put('Title', C.pick(rng, C.JOB_TITLES, C.csplitOf(spec)));
      put('Email', C.emailAddress(rng, p, 'example.com').toLowerCase());
      put('Desk', `${rng.int(1, 9)}-${rng.int(10, 99)}`);
      const pj = rng.int(1, 14);
      put('Projects', pj, pj);
    } else {
      const id = `#${rng.int(10200, 98999)}`;
      if (used.has(id)) return null;
      const p = C.personName(rng, C.csplitOf(spec));
      if (!nameOk(p)) return null;
      const iso = randomISO(rng, 2024, 2025);
      const tot = rng.int(400, 48000) / 100;
      put('Order', id);
      put('Customer', p.full);
      put('Date', showDate(iso, 'short'), isoDays(iso));
      put('Total', money(tot), tot);
      const it = rng.int(1, 9);
      put('Items', it, it);
      put('Status', C.pick(rng, C.ORDER_STATUSES, C.csplitOf(spec)));
      put('Payment', C.pick(rng, C.PAYMENT_METHODS, C.csplitOf(spec)));
      put('Ship to', rng.pick(cities).city);
      put('Carrier', rng.pick(CARRIERS));
      const w = rng.int(2, 250) / 10;
      put('Weight', `${w.toFixed(1)} kg`, w);
    }
    const key = cell[DATASETS[dataset].cols[0].name];
    return { cells: cell, nums: num, key };
  }

  function dataTable(rng, dataset, nRows, colNames, spec) {
    const def = DATASETS[dataset];
    const used = new Set();
    const rows = [];
    for (let k = 0; rows.length < nRows && k < nRows * 30; k++) {
      const r = makeRow(rng, dataset, spec, used);
      if (!r) continue;
      used.add(r.key);
      rows.push(r);
    }
    const cols = colNames.map((n) => def.cols.find((c) => c.name === n));
    return {
      dataset,
      title: rng.pick(def.title),
      ref: def.ref,
      cols: cols.map((c) => ({ name: c.name, noun: c.noun, aliases: c.aliases || [], num: !!c.num })),
      rows: rows.map((r) => cols.map((c) => r.cells[c.name])),
      nums: rows.map((r) => cols.map((c) => (c.num ? r.nums[c.name] : null))),
    };
  }

  function pickCols(rng, dataset, n, withExtras) {
    const def = DATASETS[dataset];
    const base = def.cols.filter((c) => !c.key && !c.extra);
    const extra = def.cols.filter((c) => c.extra);
    const pool = withExtras ? base.concat(extra) : base;
    const k = Math.min(n - 1, pool.length);
    const keep = rng.sample(pool, k);
    return [def.cols[0].name].concat(def.cols.filter((c) => keep.includes(c)).map((c) => c.name));
  }

  Object.assign(lib, { DATASETS, dataTable, money, pickCols });
})();
