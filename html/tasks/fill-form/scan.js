/* fill-form/scan.js: shared source sampling for scanned receipts, identity cards and claims. */
(function () {
  'use strict';
  const C = env.content;
  const { person, randDate, fmtForm, amountGold, companyOf, productsOf, pattern, addDays, fieldOk } = env.taskOf('fill-form').lib;
  // Scanned source records. All source values remain plain data here; the widget paints them only on canvas.
  function scanSpec(rng, scenario, opts) {
    const r = rng.fork(`scan/${scenario}`);
    const g = { rng: r, csplit: opts.csplit || 'train', ood: !!opts.ood };
    const p = person(g);
    const name = `${p.first} ${p.last}`;
    const date = randDate(r, 2023, 2026);
    const iso = (d) => fmtForm(d, 'YYYY-MM-DD');
    const field = (id, label, value, extra = {}) => ({ id, label, kind: 'text', gold: value, src: value,
      match: 'text', placeholder: '', wrong: value ? [value.slice(0, -1), `${value}0`] : ['Not supplied'], ...extra });
    const day = (id, label, d) => field(id, label, iso(d), { kind: 'date', match: 'exact', placeholder: 'YYYY-MM-DD' });
    const amount = (id, label, cents) => field(id, `${label} (numbers only)`, amountGold(cents), { match: 'exact', placeholder: '0.00' });
    let fields, title, subtitle, issuer, items = [];
    if (scenario === 'receipt') {
      issuer = companyOf(g);
      const prods = C.sample(r, productsOf(g), opts.ood ? 7 : opts.level === 'easy' ? 2 : 4, { csplit: g.csplit });
      items = prods.map((pr) => { const qty = r.int(1, 3); const unit = r.int(250, 8500); return { desc: pr.desc, qty, amount: amountGold(qty * unit) }; });
      const subtotal = items.reduce((n, it) => n + Math.round(Number(it.amount) * 100), 0);
      const tax = Math.round(subtotal * 0.075);
      title = 'SALES RECEIPT'; subtitle = 'Customer copy · retain for your records';
      fields = [field('vendor', 'Merchant name', issuer), field('invNo', 'Receipt number', pattern(r, 'RC-######')),
        day('date', 'Purchase date', date), amount('total', 'Total', subtotal + tax), amount('tax', 'Tax', tax),
        field('currency', 'Currency', r.pick(['USD', 'GBP', 'EUR'])), field('method', 'Payment method', r.pick(['Card', 'Cash'])),
        amount('subtotal', 'Subtotal', subtotal), field('terminal', 'Terminal ID', pattern(r, 'T-####')),
        field('cost', 'Cost center', '', { src: null })];
    } else if (scenario === 'idcard') {
      issuer = 'Larkhaven Civic Registry'; title = 'RESIDENT IDENTITY CARD'; subtitle = 'Fictional specimen · not a travel document';
      fields = [field('firstName', 'First name', p.first), field('lastName', 'Last name', p.last),
        field('idNo', 'Document number', pattern(r, 'LV-########')), day('dob', 'Date of birth', randDate(r, 1962, 2003)),
        day('expiry', 'Expiry date', addDays(date, 1826)), field('country', 'Country', p.country.name),
        field('street', 'Street address', p.street), field('city', 'City', p.city),
        day('issued', 'Issue date', date), field('middle', 'Middle name', '', { src: null })];
    } else {
      issuer = 'Alder Vale Mutual'; title = 'PROPERTY LOSS NOTICE'; subtitle = 'Insurance claim · first notification of loss';
      fields = [field('claimNo', 'Claim reference', pattern(r, 'CL-######')), field('policy', 'Policy number', pattern(r, 'PL-########')),
        field('customer', 'Policyholder name', name), day('lossDate', 'Date of loss', date),
        field('location', 'Incident location', `${p.street}, ${p.city}`),
        field('cause', 'Cause of loss', r.pick([
          'Burst water pipe', 'Storm damage', 'Accidental breakage', 'Electrical fire', 'Vehicle collision',
          'Falling tree', 'Ceiling collapse', 'Drain overflow', 'Ground subsidence', 'Forced entry theft',
          'Window vandalism', 'Termite damage', 'Lightning strike', 'Roof snow overload', 'Chemical spill',
          'Cargo shifting'
        ])),
        amount('amount', 'Estimated loss', r.int(25000, opts.ood ? 9800000 : 850000)),
        field('phone', 'Contact phone', p.phone), field('email', 'Contact email', p.email),
        field('adjuster', 'Assigned adjuster', '', { src: null })];
    }
    const count = opts.level === 'easy' ? 4 : opts.level === 'medium' ? 6 : opts.ood ? 9 : 8;
    // Normal episodes ask one field that the source does not provide, as existing fill-form tasks do.
    const asked = fields.slice(0, count);
    if (opts.level !== 'easy' && opts.level !== 'medium') asked[asked.length - 1] = fields[fields.length - 1];
    for (const f of asked) f.wrong = f.wrong.filter((w) => !fieldOk(f, w));
    const doc = { kind: 'scan', style: scenario, title, subtitle, issuer, items,
      rows: fields.filter((f) => f.src !== null).map((f) => ({ id: f.id, label: f.label.replace(' (numbers only)', ''), value: f.src,
        hand: scenario === 'claim' && ['customer', 'location', 'cause', 'phone'].includes(f.id) })),
      stamp: scenario === 'claim' ? 'RECEIVED' : scenario === 'idcard' ? 'SPECIMEN' : 'PAID',
      note: scenario === 'claim' ? 'Please keep damaged items for inspection. This notice is not an acceptance of liability.' :
        scenario === 'idcard' ? 'Registry use only. Report a lost card to the issuing office.' : 'Thank you for your purchase. Returns accepted within 30 days.' };
    return { scenario, isplit: opts.isplit || 'train', csplit: g.csplit, startMode: opts.startMode, ood: !!opts.ood,
      level: opts.level || 'normal',
      ...((opts.traits || {}).keys ? { keys: opts.route === 'keyboard', forcedRoute: opts.route } : {}),
      docStyle: scenario, docName: `scanned ${scenario === 'idcard' ? 'identity card' : scenario === 'claim' ? 'insurance claim' : 'receipt'}`,
      formTitle: scenario === 'receipt' ? 'Expense details' : scenario === 'idcard' ? 'Identity record' : 'Claim intake',
      layout: { scan: true, cols: 1, image: true, tabs: false, long: false, startTab: 'form', docSide: 'left',
        pdf: { route: opts.route === 'pointer' ? 'thumb' : 'wheel', file: `${scenario}_${pattern(r, '####')}.tif` } }, doc, fields: asked };
  }


  Object.assign(env.taskOf('fill-form').lib, { scanSpec });
})();
