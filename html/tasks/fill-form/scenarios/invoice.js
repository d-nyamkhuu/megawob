/* fill-form/invoice: source facts and document layout; shared form sampling stays in logic.js. */
(function () {
  'use strict';
  const C = env.content;
  const { pad } = env.util;
  const { companyOf, COUNTRIES, CURRENCIES, randDate, addDays, productsOf, person, pattern, textFact, dateFact, amountGold, blankFact, money, phoneOf } = env.taskOf('fill-form').lib;
  function invoiceTask(g) {
    const rng = g.rng;
    const style = rng.pick(['invoice', 'receipt']);
    const isR = style === 'receipt';
    const compute = rng.bool(0.3);
    const vendor = companyOf(g);
    const vc = rng.pick(COUNTRIES);
    const cur = rng.pick(CURRENCIES);
    const fmt = cur.code === 'EUR' && rng.bool(0.35) ? 'eu' : rng.pick(['symbol', 'symbol', 'code']);
    const dateStyle = isR ? rng.pick(['abbr', 'short', 'iso']) : rng.pick(['long', 'dmy', 'abbr', 'iso']);
    const date = randDate(rng, 2023, 2026);
    const due = addDays(date, rng.pick([14, 30, 30, 45]));
    const nItems = g.ood ? rng.int(5, 8) : rng.int(2, isR ? 5 : 4);
    const prods = rng.sample(productsOf(g), nItems);
    const items = prods.map((pr) => {
      const unit = Math.max(50, rng.int(Math.round(pr.lo * 100), Math.round(pr.hi * 100) - 1) - (rng.bool(0.4) ? rng.int(0, 99) % 50 : 0));
      const qty = rng.int(1, pr.qmax);
      return { desc: pr.desc, qty, unit, amount: unit * qty };
    });
    const subtotal = items.reduce((a, it) => a + it.amount, 0);
    const qtySum = items.reduce((a, it) => a + it.qty, 0);
    const rate = compute ? 0 : rng.pick([0, 5, 7.5, 8, 10, 13, 20]);
    const tax = Math.round((subtotal * rate) / 100);
    const total = subtotal + tax;
    const paid = isR ? true : rng.bool(0.5);
    const method = rng.pick(['Card', 'Cash', 'Bank transfer']);
    const effMethod = isR ? (method === 'Bank transfer' ? 'Card' : method) : (method === 'Cash' ? 'Bank transfer' : method);
    const cust = person(g);
    const invNo = !isR && rng.bool(0.5) ? C.invoiceId(rng) : isR ? pattern(rng, rng.pick([
      '####-###', 'R######', '#######', 'AA#####', 'TX-#####'
    ])) : rng.pick([
      pattern(rng, 'INV-#####'), pattern(rng, 'A-####'), `${date.y}-${pattern(rng, '####')}`, pattern(rng, '########')]);
    const amtLabel = (base) => `${base} (numbers only)`;
    const facts = {
      vendor: textFact(isR ? [
        'Merchant name', 'Store name', 'Vendor', 'Trading name', 'Retailer', 'Issued by'
      ] : ['Vendor', 'Supplier', 'Vendor name'], vendor, vendor, { wrong: [`${cust.first} ${cust.last}`] }),
      invNo: textFact(compute ? ['Order number', 'Order no.'] : isR ? ['Receipt number', 'Receipt no.'] : ['Invoice number', 'Invoice no.'], invNo, invNo, { wrong: [pattern(rng, 'SO-####'), invNo.slice(0, -1)] }),
      date: dateFact(rng, isR ? ['Purchase date', 'Receipt date'] : ['Invoice date', 'Date of issue'], date, dateStyle),
      due: dateFact(rng, ['Due date', 'Payment due date'], due, dateStyle),
      subtotal: textFact([amtLabel('Subtotal'), amtLabel('Net amount')], amountGold(subtotal), null, { match: 'exact', placeholder: '0.00', wrong: [amountGold(total)] }),
      tax: textFact([amtLabel('Tax'), amtLabel('Tax amount')], amountGold(tax), null, { match: 'exact', placeholder: '0.00', wrong: [String(rate)] }),
      total: textFact([amtLabel(compute ? 'Order total' : 'Total'), amtLabel(compute ? 'Total of all lines' : 'Total amount'), amtLabel('Amount')],
        amountGold(total), null, { match: 'exact', placeholder: '0.00', wrong: [amountGold(subtotal - items[0].amount), amountGold(items[items.length - 1].amount)] }),
      qtySum: textFact(['Total quantity (items)', 'Number of items'], String(qtySum), items.map((it) => it.qty).join(' + '),
        { match: 'exact', placeholder: 'number', computed: true, wrong: [String(items.length)] }),
      currency: (() => {
        const others = rng.sample(CURRENCIES.filter((c) => c !== cur), rng.int(3, 5));
        const long = rng.bool(0.4);
        const label = (c) => (long ? `${c.code} - ${c.name}` : c.code);
        return { kind: 'dropdown', labels: ['Currency'], gold: label(cur), options: [cur, ...others].map(label).sort(), src: fmt === 'code' ? cur.code : cur.sym.trim(), match: 'option' };
      })(),
      method: { kind: 'radio', labels: [
        'Payment method', 'Paid with', 'Pay using', 'Payment option'
      ], gold: effMethod, options: ['Card', 'Cash', 'Bank transfer'], src: effMethod, match: 'option' },
      paid: { kind: 'checkbox', labels: ['Already paid', 'Invoice is paid'], gold: paid, src: paid ? 'PAID' : 'due', match: 'bool' },
      customer: textFact(['Billed to (name)', 'Customer name'], `${cust.first} ${cust.last}`, `${cust.first} ${cust.last}`, { wrong: [vendor] }),
      po: blankFact(['PO number', 'Purchase order no.']),
      vat: blankFact(['VAT number', 'Tax ID']),
      cost: blankFact(['Cost center']),
      project: blankFact(['Project code']),
    };
    const show = (c) => money(c, cur, fmt === 'code' ? 'code' : fmt);
    facts.subtotal.src = show(subtotal);
    facts.tax.src = show(tax);
    facts.total.src = compute ? `sum of ${items.length} line amounts` : show(total);
    facts.subtotal.wrong.push(show(subtotal));
    facts.total.wrong.push(compute ? amountGold(total + items[0].amount) : show(total));
    if (compute) {
      facts.total.computed = true;
      delete facts.subtotal;
      delete facts.tax;
    }
    const always = compute ? ['vendor', 'invNo', 'date', 'total', 'currency'] : ['vendor', 'invNo', 'date', 'subtotal', 'tax', 'total', 'currency'];
    const optional = isR ? ['method', 'qtySum'] : ['due', 'method', 'paid', 'customer', 'qtySum'];
    if (isR) facts.paid.labels = ['Already paid'];
    const build = (shown) => invoiceDoc(rng, style, { vendor, vc, cur, fmt, items, subtotal, tax, total, rate, paid, method: effMethod, cust, invNo, facts, compute }, shown);
    return { style, facts, always, optional, build, docName: compute ? (isR ? 'order slip' : 'order confirmation') : isR ? 'receipt' : 'invoice', receipt: isR };
  }

  function invoiceDoc(rng, style, o, shown) {
    const has = (k) => shown.has(k);
    const { cur, fmt } = o;
    const isR = style === 'receipt';
    const m = (c) => money(c, cur, fmt === 'code' ? 'code' : fmt);
    const plain = (c) => (fmt === 'eu' ? money(c, cur, 'eu').replace(/ \S+$/, '') : money(c, cur, 'plain'));
    const vendorAddr = [`${rng.int(2, 400)} ${rng.pick(C.STREET_NAMES)}`, `${pattern(rng, o.vc.zip)} ${rng.pick(o.vc.cities)}`];
    const vendorPhone = phoneOf(rng, o.vc);
    const meta = [];
    meta.push({ label: o.compute ? rng.pick([
      'Order no.', 'Order #', 'Order ID'
    ]) : isR ? rng.pick(['Receipt #', 'Receipt no.', 'Trans. #']) : rng.pick(['Invoice no.', 'Invoice #', 'Invoice number']), value: o.invNo });
    meta.push({ label: isR ? 'Date' : rng.pick(['Date', o.compute ? 'Order date' : 'Invoice date', 'Issued']), value: o.facts.date.src + (isR ? `  ${pad(rng.int(8, 20))}:${pad(rng.int(0, 59))}` : '') });
    if (has('due')) meta.push({ label: rng.pick(['Due date', 'Payment due']), value: o.facts.due.src });
    if (!isR && !o.compute && rng.bool(0.5)) meta.push({ label: 'Order ref.', value: pattern(rng, 'SO-####') });
    let totals = [
      { label: 'Subtotal', value: isR ? plain(o.subtotal) : m(o.subtotal) },
      { label: o.rate ? `Tax (${o.rate}%)` : 'Tax (0%)', value: isR ? plain(o.tax) : m(o.tax) },
      { label: isR ? 'TOTAL' : rng.pick([
        'Total', 'Total due', 'Amount total', 'Grand total', 'Gross sum', 'In all'
      ]), value: m(o.total), strong: true },
    ];
    if (isR && !o.compute) {
      totals[0].value = o.facts.subtotal.src;
      totals[1].value = o.facts.tax.src;
    }
    const notes = [];
    let payLine = null;
    if (o.compute) {
      // An order confirmation / packing slip: line amounts but no totals.
      totals = [];
      notes.push(rng.pick(['Totals will appear on the final invoice.', 'Packing slip - prices per line only.',
        'This is not an invoice. Line totals are shown for reference.',
        'Each amount is the listed price times the quantity.',
        'Item details - quantities and prices shown.',
        'No summary of the line amounts is printed.']));
    }
    if (isR) {
      if (has('method') && o.method === 'Cash' && !o.compute) {
        const tendered = o.total + ((100 - (o.total % 100)) % 100) + rng.pick([0, 500, 1000]);
        payLine = { label: 'CASH', value: plain(tendered), change: plain(tendered - o.total) };
      } else if (has('method')) {
        payLine = { label: o.method === 'Cash' ? 'PAID CASH' : `${rng.pick(['VISA', 'MASTERCARD', 'AMEX'])} ****${pattern(rng, '####')}`, value: o.compute ? 'APPROVED' : plain(o.total) };
      }
      notes.push(rng.pick([
        'Thank you for shopping with us!', 'THANK YOU - PLEASE COME AGAIN',
        'Keep this receipt for returns within 30 days.', 'Please save this slip for your records.'
      ]));
    } else {
      if (has('paid') || has('method')) {
        if (o.paid) notes.push(has('method') ? (o.method === 'Card' ? `Paid in full by card (${rng.pick(['Visa', 'Mastercard'])} ending ${pattern(rng, '####')}). Thank you!` : 'Paid in full by bank transfer. Thank you!') : 'Paid in full. Thank you!');
        else notes.push(has('method') ? (o.method === 'Card' ? 'Balance due. Pay online by card using the link in your account.' : `Balance due. Please pay by bank transfer to IBAN ${pattern(rng, 'AA## #### #### #### ##')}.`) : 'Balance due. Payment terms: net 30.');
      } else notes.push(rng.pick(['Thank you for your business.', 'Questions? Contact our billing team.']));
    }
    return {
      kind: 'invoice', style,
      title: isR ? null : o.compute ? rng.pick([
        'ORDER CONFIRMATION', 'Packing slip', 'Order summary', 'Dispatch note', 'Order record'
      ]) : rng.pick(['INVOICE', 'Invoice', 'Tax invoice']),
      vendor: { name: o.vendor, addr: vendorAddr, phone: vendorPhone },
      meta,
      billTo: has('customer') ? { name: `${o.cust.first} ${o.cust.last}`, addr: [o.cust.street, `${o.cust.city} ${o.cust.zip}`] } : null,
      items: o.items.map((it) => ({ desc: it.desc, qty: it.qty, unit: plain(it.unit), amount: plain(it.amount) })),
      currencyNote: (fmt === 'symbol' && ['CAD', 'AUD'].includes(cur.code) && rng.bool(0.5)) || o.compute ? `All amounts in ${cur.code}` : null,
      totals,
      payLine,
      stamp: !isR && has('paid') && o.paid ? 'PAID' : null,
      notes,
      cols: isR ? null : rng.pick([['Description', 'Qty', 'Unit price', 'Amount'], ['Item', 'Qty', 'Price', 'Total']]),
    };
  }


  env.scenario('fill-form', { name: 'invoice', task: invoiceTask, sample: (rng, opts) => env.taskOf('fill-form').lib.buildSpec(rng, 'invoice', opts) });
})();
