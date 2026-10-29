/* recall-info/scenarios/count.js: sampling, model, scoring, instructions and oracle for count. */
(function () {
  'use strict';
  const { C, I, q } = env.taskOf('recall-info').lib;

  const COUNT_COLS = {
    orders: ['#', 'Order', 'Customer', 'Status', 'Total'],
    tickets: ['#', 'Ticket', 'Subject', 'Priority', 'Assignee'],
    files: ['#', 'File', 'Owner', 'Size', 'Modified'],
  };
  const COUNT_NOUN = { orders: 'orders', tickets: 'tickets', files: 'files' };
  const COUNT_TITLE = { orders: [
    'Recent orders', 'Order history', 'All orders', 'Order records', 'Order ledger', 'Order index'
  ], tickets: ['Support queue', 'Open tickets', 'Ticket inbox'],
    files: [
      'Shared files', 'Project files', 'Document library', 'File repository', 'File directory', 'File catalog'
    ] };
  const ORDER_STATUS = ['Shipped', 'Pending', 'Refunded', 'Cancelled', 'Delivered'];
  const PRIORITIES = ['Low', 'Normal', 'High', 'Urgent'];

  function countPhrase(spec) {
    const v = spec.critVal;
    switch (spec.critKind) {
      case 'status': return `orders with the status ${q(v)}`;
      case 'priority': return `tickets with ${q(v)} priority`;
      case 'assignee': return `tickets assigned to ${v}`;
      default: return `files owned by ${v}`;
    }
  }

  function countCells(cr, spec, ds, i, base, names) {
    if (ds === 'orders') {
      return [String(i + 1), `ORD-${base + i}`, C.personName(cr, { csplit: spec.csplit }).full, cr.pick(ORDER_STATUS), `$${(cr.int(800, 64000) / 100).toFixed(2)}`];
    }
    if (ds === 'tickets') {
      return [String(i + 1), `T-${base + i}`, C.pick(cr, C.EMAIL_SUBJECTS, spec), cr.pick(PRIORITIES), cr.pick(names)];
    }
    const size = cr.bool(0.5) ? `${cr.int(12, 980)} KB` : `${cr.float(1, 40).toFixed(1)} MB`;
    return [String(i + 1), C.fileName(cr), cr.pick(names), size, C.formatDate(C.randomDate(cr, { from: '2025-01-01', to: '2026-09-30' }), 'en-US', 'medium')];
  }

  function sampleCount(rng, spec, opts) {
    const cr = rng.fork('rows');
    const ds = cr.pick(['orders', 'tickets', 'files']);
    const T = spec.ood ? cr.int(80, 120) : opts.level === 'easy' ? cr.int(18, 24) : opts.level === 'medium' ? cr.int(28, 36) : cr.int(40, 60);
    // The matching count spans a wide range (30 values at normal), so a blind guess without scrolling and counting is right
    // about 3% of the time (easy: 7%, medium: 5%).
    const k = spec.ood ? cr.int(12, 60) : opts.level === 'easy' ? cr.int(2, 16) : opts.level === 'medium' ? cr.int(4, 24) : cr.int(7, 36);
    const names = C.sample(cr, C.FIRST_NAMES, 5, spec);
    let crits;
    if (ds === 'orders') crits = [{ kind: 'status', col: 3, vals: ORDER_STATUS }];
    else if (ds === 'tickets') crits = [{ kind: 'priority', col: 3, vals: PRIORITIES }, { kind: 'assignee', col: 4, vals: names }];
    else crits = [{ kind: 'owner', col: 2, vals: names }];
    const crit = cr.pick(crits);
    const val = cr.pick(crit.vals);
    const base = cr.int(1000, 8900);
    const rows = [];
    for (let i = 0; i < T; i++) rows.push(countCells(cr, spec, ds, i, base, names));
    const hit = new Set(cr.sample([...Array(T).keys()], k));
    const others = crit.vals.filter((x) => x !== val);
    rows.forEach((r, i) => { r[crit.col] = hit.has(i) ? val : cr.pick(others); });
    Object.assign(spec, { dataset: ds, noun: COUNT_NOUN[ds], title: cr.pick(COUNT_TITLE[ds]), cols: COUNT_COLS[ds], rows, critKind: crit.kind,
      critCol: crit.col, critVal: val, critVals: crit.vals, answer: k, T, batch: cr.int(12, 20) });
    const route = opts.route === 'wheel' ? 'wheel' : opts.route === 'pointer' ? 'track' : cr.pick(['wheel', 'track']);
    spec.route = route;
    spec.wheelDy = 170;
    spec.ansLabel = cr.pick(['Your count', 'Matches found', 'Number of matches', 'Matching rows', 'Enter number']);
    spec.submitLabel = cr.pick([
      'Send answer', 'Save count', 'Log result', 'Confirm it', 'Record this', 'Commit now'
    ]);
  }

  const countOfVal = (spec, v) => spec.rows.reduce((n, r) => n + (r[spec.critCol] === v ? 1 : 0), 0);

  function countApply(m, spec, act) {
    if (act.type !== undefined) return { ...m, entered: String(act.type), committed: false };
    if (act.commit) return { ...m, saved: m.entered, committed: true };
    if (act.reached !== undefined) return act.reached > m.reached ? { ...m, reached: Math.min(spec.T, act.reached) } : m;
    return m;
  }

  function countError(m, spec) {
    const eff = m.committed ? m.saved : m.entered;
    const n = parseInt(String(eff ?? '').replace(/\D/g, ''), 10);
    const numErr = Number.isFinite(n) && /\d/.test(String(eff ?? '')) ? (n === spec.answer ? 0 : Math.min(1, Math.abs(n - spec.answer) / Math.max(3, spec.answer))) : 1;
    const seen = Math.min(1, m.reached / spec.T);
    if (numErr === 0) return m.committed ? 0 : 0.15;
    return 0.6 * Math.max(numErr, 0.05) + 0.25 * (1 - seen) + 0.15 * (m.committed ? 0 : 1);
  }

  function countInit(spec, rng) {
    const m = { entered: '', saved: null, committed: false, reached: 0 };
    if (spec.startMode === 'partial') m.reached = rng.int(spec.batch, Math.max(spec.batch, spec.T - spec.batch));
    else if (spec.startMode === 'wrong') {
      const d = rng.pick([-3, -2, -1, 1, 2, 3].filter((x) => spec.answer + x >= 1));
      const w = String(spec.answer + d);
      Object.assign(m, { entered: w, saved: w, committed: true, reached: spec.T });
    }
    return m;
  }

  function countPlan(m, spec) {
    const want = String(spec.answer);
    if (m.entered === want) return m.committed && m.saved === want ? null : { click: { commit: true } };
    if (m.reached < spec.T) return spec.route === 'wheel' ? { wheel: [{ list: true }, spec.wheelDy] } : { click: { track: 'down' } };
    return { type: [{ field: true }, want] };
  }

  const SELFTEST_VISIBLE = 6;
  function countEffect(m, spec, step) {
    if (step.wheel || (step.click && step.click.track)) return countApply(m, spec, { reached: m.reached + SELFTEST_VISIBLE });
    if (step.type) return countApply(m, spec, { type: step.type[1] });
    return countApply(m, spec, { commit: true });
  }

  function countInstruction(spec, rng, phrase) {
    const v = { p: phrase || countPhrase(spec), btn: q(spec.submitLabel) };
    const core = I.fill(I.pick(rng, [
      'Count the {p} in the list, enter the total and press {btn}.',
      'How many {p} are there in the list? Type the number and press {btn}.',
      'Scroll through the whole list, count the {p}, then enter that number and press {btn}.',
      'Find out how many {p} the list holds, type the count and press {btn}.',
      'Work out how many of the entries are {p}, and send the number in with {btn}.',
      'Check the whole list for {p}. Enter how many you find and press {btn}.',
      'Enter the count of {p} across the full list, then press {btn}.',
      'Go from start to end of the list counting {p}. Enter the count and press {btn}.',
      'For {p}, give the count from the whole list. Enter it and press {btn}.',
    ], spec.isplit), v);
    const steps = [`scroll through the whole list and count the ${v.p}`, `enter the count and press ${v.btn}`];
    return I.say(rng, core, { isplit: spec.isplit, terse: `count of ${v.p}, enter it, ${v.btn}`, steps });
  }

  env.scenario('recall-info', {
    name: 'count',
    sample: sampleCount,
    init: countInit,
    error: countError,
    plan: countPlan,
    apply: countApply,
    effect: countEffect,
    instruction: countInstruction,
    countOfVal,
    solve(spec, model) {
      return { ...model, entered: String(spec.answer), saved: String(spec.answer), committed: true, reached: spec.T };
    },
  });
})();
