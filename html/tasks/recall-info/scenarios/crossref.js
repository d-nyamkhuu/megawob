/* recall-info/scenarios/crossref.js: sampling, model, scoring, instructions and oracle for crossref. */
(function () {
  'use strict';
  const { C, I, q, last, near, textErr, sameText } = env.taskOf('recall-info').lib;

  const XSCENES = [
    { id: 'address', tabs: ['Billing', 'Shipping'], form: ['Return form', 'Refund request', 'Exchange form'],
      keys: { name: 'Full name', street: 'Street address', city: 'City', zip: 'Postcode', phone: 'Phone' } },
    { id: 'party', tabs: ['Sender', 'Recipient'], form: ['Parcel label', 'Courier booking', 'Shipment form'],
      keys: { name: 'Name', street: 'Street', city: 'Town', zip: 'ZIP code', phone: 'Mobile' } },
    { id: 'staff', tabs: ['Employee', 'Manager'], form: ['Access request', 'Badge request', 'Equipment request'],
      keys: { name: 'Name', email: 'Work email', phone: 'Phone', dept: 'Department', city: 'Office city' } },
  ];
  const ORDER_KEYS = ['Order number', 'Order date', 'Total', 'Tracking code', 'Carrier'];
  const CARRIERS = [
    'Northwind Freight', 'Swiftpost', 'Harbor Express', 'Blue Heron Couriers', 'Parcelline', 'Alder Parcel',
    'Morrow Transit', 'Pinebridge Mail', 'Copper Haulage', 'Larkspur Cargo'
  ];

  function genRecord(r, scene, spec) {
    const p = C.personName(r, { csplit: spec.csplit });
    const a = C.address(r, r.pick(['en-US', 'en-GB', 'en-US']), { csplit: spec.csplit });
    const rec = { name: p.full, street: a.line1, city: a.city, zip: a.postcode, phone: C.phone(r, 'en-US') };
    if (scene.keys.email) rec.email = C.emailAddress(r, p);
    if (scene.keys.dept) rec.dept = C.pick(r, C.DEPARTMENTS, spec);
    return rec;
  }

  function sampleCrossref(rng, spec, opts) {
    const xr = rng.fork('xref');
    const scene = xr.pick(XSCENES);
    const keyIds = Object.keys(scene.keys);
    const recs = [genRecord(xr.fork('a'), scene, spec), genRecord(xr.fork('b'), scene, spec)];
    const orderVals = [`#${C.digits(xr, 6)}`, C.formatDate(C.randomDate(xr, { from: '2026-01-01', to: '2026-09-30' }), 'en-US', 'medium'),
      `$${(xr.int(2500, 98000) / 100).toFixed(2)}`, C.trackingCode(xr), xr.pick(CARRIERS)];
    const nf = spec.ood ? xr.int(4, 5) : opts.level === 'easy' ? 2 : opts.level === 'medium' ? xr.int(2, 3) : 3;
    const useOrder = opts.level !== 'easy' && xr.bool(0.6);
    const fromOrder = useOrder ? xr.sample(ORDER_KEYS, Math.min(xr.int(1, 2), nf - 1)) : [];
    const shared = xr.sample(keyIds, nf - fromOrder.length);
    const order = [scene.tabs[0], scene.tabs[1]];
    const srcTabs = [
      { name: scene.tabs[0], kind: 'src', rows: keyIds.map((k) => [scene.keys[k], recs[0][k]]) },
      { name: scene.tabs[1], kind: 'src', rows: keyIds.map((k) => [scene.keys[k], recs[1][k]]) },
    ];
    const tabs = [...srcTabs];
    const hasOrder = fromOrder.length > 0;
    if (hasOrder) tabs.push({ name: 'Order', kind: 'src', rows: ORDER_KEYS.map((k, i) => [k, orderVals[i]]) });
    const formName = xr.pick(scene.form);
    // The form tab sits somewhere among the tabs.
    const formPos = xr.int(0, tabs.length);
    tabs.splice(formPos, 0, { name: formName, kind: 'form' });
    const idx = (name) => tabs.findIndex((t) => t.name === name);
    const fields = shared.map((k) => {
      const t = xr.int(0, 1);
      return { id: `f_${k}`, label: scene.keys[k], src: idx(order[t]), key: scene.keys[k], truth: recs[t][k], keyId: k };
    });
    fields.push(...fromOrder.map((k) => ({ id: `o_${k}`, label: k, src: idx('Order'), key: k, truth: orderVals[ORDER_KEYS.indexOf(k)], keyId: null })));
    // A shared key asked from both tabs would give two fields one label: keep one field per label.
    spec.fields = xr.shuffle(fields);
    Object.assign(spec, { scene: scene.id, formName, tabs, formIdx: idx(formName), recs, tabNames: order });
    spec.labels = { save: xr.pick([
      'Save form', 'Save request', 'Save draft', 'Record data', 'Keep changes', 'Save all'
    ]), saved: xr.pick(['Saved', 'Saved to your file']) };
  }

  function xrApply(m, spec, act) {
    if (act.tab !== undefined) {
      if (act.tab < 0 || act.tab >= spec.tabs.length) return m;
      const seen = m.seen.slice();
      seen[act.tab] = true;
      return { ...m, tab: act.tab, seen };
    }
    if (act.type) {
      if (m.tab !== spec.formIdx) return m;
      return { ...m, entered: { ...m.entered, [act.type[0]]: String(act.type[1]) }, committed: false };
    }
    if (act.commit) {
      if (m.tab !== spec.formIdx) return m;
      return { ...m, saved: { ...m.entered }, committed: true };
    }
    return m;
  }

  function xrError(m, spec) {
    const vals = m.committed ? m.saved : m.entered;
    let s = 0;
    for (const f of spec.fields) s += textErr(vals ? vals[f.id] : '', f.truth);
    return 0.85 * (s / spec.fields.length) + 0.15 * (m.committed ? 0 : 1);
  }

  function xrInit(spec, rng) {
    const entered = {};
    for (const f of spec.fields) entered[f.id] = '';
    const m = { tab: spec.formIdx, entered, saved: null, committed: false, seen: spec.tabs.map((_, i) => i === spec.formIdx) };
    if (spec.startMode === 'partial') {
      const k = rng.int(1, Math.max(1, spec.fields.length - 1));
      spec.fields.slice(0, k).forEach((f) => { entered[f.id] = f.truth; });
      m.seen = m.seen.map((v, i) => v || spec.fields.some((f) => f.src === i));
    } else if (spec.startMode === 'wrong') {
      spec.fields.forEach((f) => { entered[f.id] = f.truth; });
      const f = rng.pick(spec.fields);
      entered[f.id] = near(rng, f.truth);
      m.seen = m.seen.map(() => true);
      if (rng.bool(0.5)) { m.saved = { ...entered }; m.committed = true; }
    }
    return m;
  }

  function xrPlan(m, spec) {
    const vals = m.entered;
    const wrongF = spec.fields.find((f) => !sameText(vals[f.id], f.truth));
    if (wrongF) {
      // A value the page showed is typed after the source tab has been looked at.
      const need = wrongF.src;
      if (!m.seen[need] && m.tab !== need) return { click: { tab: need } };
      if (m.tab !== spec.formIdx) return { click: { tab: spec.formIdx } };
      return { type: [{ field: wrongF.id }, wrongF.truth] };
    }
    if (m.tab !== spec.formIdx) return { click: { tab: spec.formIdx } };
    const savedOk = m.committed && spec.fields.every((f) => sameText(m.saved[f.id], f.truth));
    return savedOk ? null : { click: { commit: true } };
  }

  function xrEffect(m, spec, step) {
    if (step.type) return xrApply(m, spec, { type: [step.type[0].field, step.type[1]] });
    const t = step.click;
    if (t.tab !== undefined) return xrApply(m, spec, { tab: t.tab });
    return xrApply(m, spec, { commit: true });
  }

  function xrInstruction(spec, rng) {
    const byTab = new Map();
    for (const f of spec.fields) {
      const name = spec.judge && spec.judge.field === f.id ? spec.judge.tab : spec.tabs[f.src].name;
      if (!byTab.has(name)) byTab.set(name, []);
      byTab.get(name).push(f.label);
    }
    const join = (xs) => (xs.length > 1 ? `${xs.slice(0, -1).join(', ')} and ${last(xs)}` : xs[0]);
    const parts = [...byTab.entries()].map(([t, labels]) => `the ${join(labels.map(q))} from the ${q(t)} tab`);
    const list = join(parts);
    const v = { list, form: q(spec.formName), save: q(spec.labels.save) };
    const core = I.fill(I.pick(rng, [
      'On the {form} tab, fill in {list}, then press {save}.',
      'Copy {list} into the {form} form and press {save}.',
      'Fill the {form} tab with {list}, and press {save} when done.',
      'In {form}, enter {list}. Then press {save}.',
      'Complete {form} using {list}, then press {save}.',
      'Use {list} for the entries in {form}. Press {save}.',
      'Transfer {list} into {form}, and then press {save} to save.',
      'Before pressing {save}, fill {form} with {list}.',
    ], spec.isplit), v);
    const steps = [...byTab.entries()].map(([t, labels]) => `look up ${join(labels.map(q))} on the ${q(t)} tab`);
    steps.push(`type them into ${v.form} and press ${v.save}`);
    return I.say(rng, core, { isplit: spec.isplit, terse: `${v.form}: ${list}; ${v.save}`, steps });
  }

  env.scenario('recall-info', {
    name: 'crossref',
    sample: sampleCrossref,
    init: xrInit,
    error: xrError,
    plan: xrPlan,
    apply: xrApply,
    effect: xrEffect,
    instruction: xrInstruction,
    solve(spec, model) {
      const entered = {};
      for (const f of spec.fields) entered[f.id] = f.truth;
      return { ...model, tab: spec.formIdx, entered, saved: { ...entered }, committed: true };
    },
  });
})();
