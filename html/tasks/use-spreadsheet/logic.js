/*
 * use-spreadsheet: fill, select, sort, filter, format and write formulas in a spreadsheet.
 * A fictional workbook, with spreadsheet mechanics inspired by desktop and web spreadsheets.
 * No MiniWoB counterpart. Both classic (DOM) and canvas support every scenario.
 * Scenarios: fillhandle (numeric series / relative formulas, down or right), range (rectangle selection),
 * formula (SUM, AVERAGE, MIN, MAX, COUNT or arithmetic), sort (whole records, header preserved),
 * filter (one categorical column), condfmt (range, comparison, threshold and fill color in a dialog).
 * Spec: {scenario, level, ood, isplit, csplit, startMode, title, sheet, cells: raw rows including headers,
 * n: data-row count, goal: scenario-specific fields, judge?}. Cell coordinates are zero-based [row, col];
 * A1 is [0,0]. goal: {seed:[r,c,r,c], end:[r,c]} | {range:[r,c,r,c]} |
 * {cell:[r,c], formula} | {col,dir} | {col,values} | {range,op,threshold,color}.
 * Model: {cells, selection:[r,c,r,c], order:[source row indices], sort, filter, rule, widths:{},
 * menu:null|{col}, dialog, draft:{range,op,threshold,color}, formulaDraft, editing, scrollRow,
 * visibleRows (widget geometry), history:[workbook snapshots], sheetStyle? (unscored presentation)}.
 * UI fields are unscored.
 * Targets: {cell:[r,c]}, {handle:true}, {fillEnd:[r,c]}, {pane:true}, {header:col},
 * {control:'formula'|'commit'|'condfmt'|'range'|'threshold'|'apply'|'cancel'|'asc'|'desc'|'clearFilter'},
 * {option:value}, {operator:op}, {color:name}. locate is read-only, using computed grid geometry.
 * Helpers (widget API, env.taskDef.helpers; all pure):
 *   addr([row, col]): cell address in A1 notation.
 *   rect(selection): normalized selection endpoints.
 *   rangeName(selection): cell or range address in A1 notation.
 *   parseRange(text): normalized selection endpoints, or null for an invalid address.
 *   evaluate(cells, pos, seen?): evaluated cell value or spreadsheet error.
 *   display(value): rounded numeric display text.
 *   visible(model, spec): source row indices remaining after filtering.
 *   fill(model, spec, end): workbook with the selected pattern extended to end.
 *   transition(model, spec, action, value): workbook after a control action.
 *   selectionStats(model, spec): selection sum/count and visible record count/total.
 *   matches(value, op, threshold): numeric conditional-format predicate.
 *   translate(text, dr, dc): formula with relative references shifted.
 * Self-test: tasks/use-spreadsheet/selftest.js (checker and node tests only).
 * facts: visible record count, visible Amount total and populated numeric-cell count, rendered in status.
 * parts: preempt=cancel items by the name the page shows: 'Selection' (range scenario), the filled range ('G2:G6', dest
 * alias) or the formula cell ('G5'), and the controls 'Sort', 'Filter' and 'Conditional formatting' (value: their state;
 * unchanged ones are what a stop reply must not name). [] in judge episodes.
 * silent: a formula saved as text / rounded result, a lost fill cell, range endpoint or rule field,
 * or a sort/filter that failed to stick; corruption is repeatable and repairable, never mutates inputs.
 * retarget: changes only the goal (same cells), checks current state is unsolved under the replacement.
 * judgeModes: impossible, a request for the total of a column the sheet does not have, seeded per episode (a name such
 * as "Margin" and a letter past H); leave workbook untouched. spec.judge = { mode, column, letter, message, what }:
 * the reply is status impossible and what names the column (its name or "column <letter>"); the kit grades it.
 * Starts: off, partial, wrong, solved. Easy uses 8 rows and shorter selections/formulas; medium 18;
 * normal 36; ood 60-90 rows, larger numbers, longer formulas. Forecast and Notes contain working data;
 * only unfinished autofill destinations are blank. Error is graded in [0,1], tau = 0.
 */
(function () {
  'use strict';
  const { clone, lev, sameJson } = env.util;
  const C = env.content, I = env.instruct;
  const scenarios = ['fillhandle', 'range', 'formula', 'sort', 'filter', 'condfmt'];
  // Columns the orders sheet does not have (it runs A to H: Item .. Notes); an impossible request asks about one.
  const ABSENT_COLUMNS = [
    'Margin', 'Discount', 'Tax', 'Shipping', 'Region', 'Priority', 'Rebate', 'Commission', 'Surcharge', 'Supplier',
    'Warehouse', 'Currency', 'Deposit', 'Refund', 'Budget', 'Insurance', 'Interest', 'Penalty', 'Weight', 'Volume',
    'Distance', 'Backorders', 'Downtime', 'Defects', 'Scrap', 'Pallets', 'Department', 'Project', 'Contract',
    'Invoice', 'Carrier', 'Batch', 'Category', 'Overhead', 'Labor', 'Packaging', 'Storage', 'Royalties', 'Licensing',
    'Rent', 'Utilities', 'Accruals', 'Payables', 'Overtime', 'Fuel', 'Emissions', 'Yield', 'Throughput', 'Capacity',
    'Warranty', 'Stops', 'Route', 'Channel', 'Shift', 'Customer', 'Rework', 'Training', 'Travel', 'Security',
    'Cleaning', 'Hosting', 'Research', 'Donations', 'Gratuity', 'Retainage', 'Vacancies', 'Tolls', 'Samples',
    'Approvals', 'Incidents', 'Complaints', 'Renewals', 'Shrinkage', 'Severance', 'Recruiting'
  ];
  const letter = (c) => { let t = ''; for (c++; c; c = Math.floor((c - 1) / 26)) t = String.fromCharCode(65 + (c - 1) % 26) + t; return t; };
  const addr = ([r, c]) => `${letter(c)}${r + 1}`;
  const parseAddr = (s) => { const m = /^\$?([A-Z]+)\$?([1-9]\d*)$/i.exec(String(s).trim()); return m ? [+m[2] - 1, [...m[1].toUpperCase()].reduce((a, x) => a * 26 + x.charCodeAt(0) - 64, 0) - 1] : null; };
  const rect = (a) => [Math.min(a[0], a[2]), Math.min(a[1], a[3]), Math.max(a[0], a[2]), Math.max(a[1], a[3])];
  const rangeName = (a) => { a = rect(a); return addr(a.slice(0, 2)) + (a[0] === a[2] && a[1] === a[3] ? '' : ':' + addr(a.slice(2))); };
  function parseRange(text) { const p = String(text).split(':').map(parseAddr); return p.length <= 2 && p.every(Boolean) ? rect([...p[0], ...(p[1] || p[0])]) : null; }
  const normalized = (s) => String(s).toUpperCase().replace(/\s+/g, '');
  const points = (a) => { const [r0, c0, r1, c1] = rect(a), out = []; for (let r = r0; r <= r1; r++) for (let c = c0; c <= c1; c++) out.push([r, c]); return out; };
  const jaccard = (a, b) => { a = new Set(a.map(String)); b = new Set(b.map(String)); const both = [...a].filter((x) => b.has(x)).length; return 1 - both / Math.max(1, a.size + b.size - both); };

  // A small recursive-descent evaluator: no eval/Function, references, absolute references,
  // nested functions, scalar/range arguments, unary signs, parentheses, + - * / and right-associative ^.
  function evaluate(cells, pos, seen = []) {
    const key = pos.join(',');
    if (seen.includes(key)) return '#CYCLE!';
    const raw = cells[pos[0]] && cells[pos[0]][pos[1]];
    if (raw == null || raw === '') return '';
    if (typeof raw === 'number') return raw;
    if (!String(raw).startsWith('=')) return String(raw).startsWith("'") ? String(raw).slice(1) : raw;
    const src = String(raw).slice(1).toUpperCase().replace(/\s+/g, '');
    const tokens = src.match(/\$?[A-Z]+\$?\d+|[A-Z]+|(?:\d+\.?\d*|\.\d+)(?:E[+-]?\d+)?|[()+\-*/^:,]/g) || [];
    if (tokens.join('') !== src) return '#ERROR!';
    let at = 0;
    const numeric = (v) => { if (v === '') return 0; if (typeof v === 'string' && /^#.+!$/.test(v)) throw Error(v.slice(1, -1)); const n = Number(v); if (!Number.isFinite(n)) throw Error('VALUE'); return n; };
    const reference = (t) => { const p = parseAddr(t); if (!p || !cells[p[0]] || p[1] >= cells[0].length) throw Error('REF'); return evaluate(cells, p, [...seen, key]); };
    function atom() {
      const t = tokens[at++];
      if (t === '+' || t === '-') return (t === '-' ? -1 : 1) * atom();
      if (t === '(') { const n = expr(); if (tokens[at++] !== ')') throw Error('ERROR'); return n; }
      if (/^\$?[A-Z]+\$?\d+$/.test(t || '')) return numeric(reference(t));
      if (/^(SUM|AVERAGE|MIN|MAX|COUNT)$/.test(t || '')) {
        if (tokens[at++] !== '(') throw Error('ERROR');
        const vals = [];
        do {
          if (tokens[at + 1] === ':') {
            const a = parseAddr(tokens[at]), b = parseAddr(tokens[at + 2]);
            if (!a || !b) throw Error('REF');
            at += 3;
            if (Math.max(a[0], b[0]) >= cells.length || Math.max(a[1], b[1]) >= cells[0].length) throw Error('REF');
            for (const p of points([...a, ...b])) vals.push(evaluate(cells, p, [...seen, key]));
          } else vals.push(expr());
          if (tokens[at] !== ',') break;
          at++;
        } while (at < tokens.length);
        if (tokens[at++] !== ')') throw Error('ERROR');
        if (vals.some((v) => typeof v === 'string' && v.startsWith('#'))) throw Error('VALUE');
        const ns = vals.filter((v) => typeof v === 'number' && Number.isFinite(v));
        const sum = ns.reduce((a, n) => a + n, 0);
        if (t === 'SUM') return sum;
        if (t === 'COUNT') return ns.length;
        if (!ns.length) return 0;
        return t === 'AVERAGE' ? sum / ns.length : t === 'MIN' ? Math.min(...ns) : Math.max(...ns);
      }
      if (t != null && /^(\d|\.)/.test(t)) return numeric(t);
      throw Error('ERROR');
    }
    function power() { const a = atom(); return tokens[at] === '^' ? (at++, a ** power()) : a; }
    function product() { let v = power(); while (tokens[at] === '*' || tokens[at] === '/') { const op = tokens[at++], b = power(); if (op === '/' && b === 0) throw Error('DIV/0'); v = op === '*' ? v * b : v / b; } return v; }
    function expr() { let v = product(); while (tokens[at] === '+' || tokens[at] === '-') { const op = tokens[at++], b = product(); v = op === '+' ? v + b : v - b; } return v; }
    try { const v = expr(); return at === tokens.length && Number.isFinite(v) ? Math.round(v * 1e9) / 1e9 : '#ERROR!'; } catch (e) { return `#${e.message}!`; }
  }
  const display = (value) => typeof value === 'number' ? String(Math.round(value * 100) / 100) : String(value ?? '');
  const matches = (v, op, threshold) => typeof v === 'number' && (op === '>' ? v > threshold : op === '<' ? v < threshold : v === threshold);
  const visible = (m, s) => m.order.filter((r) => !m.filter || m.filter.values.includes(String(evaluate(m.cells, [r, m.filter.col]))));
  function sorted(m, s, col, dir) { return Array.from({ length: s.n }, (_, i) => i + 1).sort((a, b) => {
    const x = evaluate(m.cells, [a, col]), y = evaluate(m.cells, [b, col]);
    const d = typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y), 'en');
    return (dir === 'asc' ? d : -d) || a - b;
  }); }
  function translate(text, dr, dc) { return String(text).replace(/(\$?)([A-Z]+)(\$?)(\d+)/gi, (_, ac, col, ar, row) => {
    const p = parseAddr(col + row), r = p[0] + (ar ? 0 : dr), c = p[1] + (ac ? 0 : dc);
    return r < 0 || c < 0 ? '#REF!' : `${ac}${letter(c)}${ar}${r + 1}`;
  }); }
  function expectedFill(s, end = s.goal.end, seed = s.goal.seed) {
    const a = rect(seed), right = end[1] > a[3], out = [];
    const first = s.cells[a[0]][a[1]], second = right ? s.cells[a[0]][a[1] + 1] : s.cells[a[0] + 1][a[1]];
    const delta = typeof first === 'number' && typeof second === 'number' ? second - first : 1;
    const length = right ? end[1] - a[1] : end[0] - a[0];
    for (let k = 0; k <= length; k++) {
      const r = a[0] + (right ? 0 : k), c = a[1] + (right ? k : 0);
      out.push({ p: [r, c], raw: typeof first === 'string' && first.startsWith('=') ? translate(first, r - a[0], c - a[1]) : typeof first === 'number' ? first + delta * k : first });
    }
    return out;
  }
  function fill(m, s, end) {
    const n = clone(m), seed = rect(m.selection);
    for (const x of expectedFill(s, end, seed)) n.cells[x.p[0]][x.p[1]] = x.raw;
    n.selection = rect([seed[0], seed[1], ...end]);
    return n;
  }
  function selectionStats(m, s) {
    const nums = points(m.selection).map((p) => evaluate(m.cells, p)).filter((v) => typeof v === 'number');
    const rows = visible(m, s);
    return { sum: display(nums.reduce((a, b) => a + b, 0)), count: nums.length,
      total: display(rows.reduce((a, r) => { const v = evaluate(m.cells, [r, 4]); return a + (typeof v === 'number' ? v : 0); }, 0)), records: rows.length };
  }
  function affected(m) { return m.rule ? points(m.rule.range).filter((p) => matches(evaluate(m.cells, p), m.rule.op, +m.rule.threshold)) : []; }
  function transition(m, s, action, value) {
    const n = clone(m);
    if (action === 'sort') { n.sort = { col: m.menu.col, dir: value }; n.order = sorted(m, s, m.menu.col, value); n.menu = null; }
    if (action === 'filter') { n.filter = { col: m.menu.col, values: [value] }; n.scrollRow = 0; n.menu = null; }
    if (action === 'clearFilter') { n.filter = null; n.menu = null; }
    if (action === 'formula') { const [r, c] = m.selection; n.cells[r][c] = value.startsWith('=') || value.startsWith("'") || value.trim() === '' || !Number.isFinite(+value) ? value : +value; n.editing = false; n.formulaDraft = ''; }
    if (action === 'rule') { const a = parseRange(m.draft.range); if (a && a[2] < m.cells.length && a[3] < 8 && Number.isFinite(+m.draft.threshold)) { n.rule = { ...m.draft, range: a, threshold: +m.draft.threshold }; n.dialog = false; } }
    return n;
  }
  function error(m, s) {
    if (s.judge) return sameJson(m.cells, s.cells) && !m.sort && !m.filter && !m.rule ? 0 : 1;
    const g = s.goal;
    if (s.scenario === 'range') return jaccard(points(m.selection), points(g.range));
    if (s.scenario === 'fillhandle') { const xs = expectedFill(s); return xs.reduce((e, x) => e + (normalized(m.cells[x.p[0]][x.p[1]]) === normalized(x.raw) ? 0 : 1), 0) / xs.length; }
    if (s.scenario === 'formula') {
      const v = m.cells[g.cell[0]][g.cell[1]], a = normalized(v), b = normalized(g.formula);
      return Math.min(1, lev(a, b) / Math.max(a.length, b.length, 1));
    }
    if (s.scenario === 'sort') {
      const goal = sorted(m, s, g.col, g.dir), state = m.sort;
      return .75 * goal.reduce((e, r, i) => e + (m.order[i] !== r ? 1 : 0), 0) / s.n + .25 * (!state || state.col !== g.col ? 1 : state.dir !== g.dir ? .5 : 0);
    }
    if (s.scenario === 'filter') {
      const goal = Array.from({ length: s.n }, (_, i) => i + 1).filter((r) => g.values.includes(String(s.cells[r][g.col])));
      return jaccard(visible(m, s), goal);
    }
    if (!m.rule) return 1;
    return (jaccard(points(m.rule.range), points(g.range)) + (m.rule.op !== g.op ? 1 : 0) + Math.min(1, Math.abs(+m.rule.threshold - g.threshold) / Math.max(1, g.threshold)) + (m.rule.color !== g.color ? 1 : 0)) / 4;
  }
  function init(s) {
    let m = { cells: clone(s.cells), selection: [1, 0, 1, 0], order: Array.from({ length: s.n }, (_, i) => i + 1), sort: null, filter: null, rule: null,
      widths: {}, menu: null, dialog: false, draft: { range: 'A2:A3', op: '>', threshold: '', color: 'red' }, formulaDraft: '', editing: false, scrollRow: 0, visibleRows: 7, history: [] };
    if (s.judge) return m;
    if (s.scenario === 'fillhandle') m.selection = clone(s.goal.seed);
    if (s.startMode === 'partial' || s.startMode === 'wrong') {
      const g = s.goal, partial = s.startMode === 'partial';
      if (s.scenario === 'range') m.selection = partial ? [g.range[0], g.range[1], g.range[0], g.range[3]] : [1, 0, 2, 1];
      if (s.scenario === 'fillhandle') { const xs = expectedFill(s); for (const x of xs.slice(0, partial ? Math.max(2, Math.floor(xs.length / 2)) : 2)) m.cells[x.p[0]][x.p[1]] = partial ? x.raw : -19; }
      if (s.scenario === 'formula') m.cells[g.cell[0]][g.cell[1]] = partial ? g.formula.slice(0, -2) : "'" + g.formula;
      if (s.scenario === 'sort') { m.menu = { col: partial ? g.col : (g.col + 1) % 6 }; m = transition(m, s, 'sort', g.dir === 'asc' ? 'desc' : 'asc'); }
      if (s.scenario === 'filter') m.filter = { col: g.col, values: partial ? [...g.values, 'Review'] : ['Review'] };
      if (s.scenario === 'condfmt') m.rule = { ...clone(g), color: partial ? (g.color === 'red' ? 'green' : 'red') : 'blue', threshold: partial ? g.threshold : g.threshold + 50 };
    }
    return m;
  }
  function solve(s, m) {
    let n = clone(m || init({ ...s, startMode: 'off' }));
    if (s.judge) return init(s);
    const g = s.goal;
    if (s.scenario === 'range') n.selection = clone(g.range);
    if (s.scenario === 'fillhandle') { for (const x of expectedFill(s)) n.cells[x.p[0]][x.p[1]] = x.raw; n.selection = rect([g.seed[0], g.seed[1], ...g.end]); }
    if (s.scenario === 'formula') n.cells[g.cell[0]][g.cell[1]] = g.formula;
    if (s.scenario === 'sort') { n.sort = clone(g); n.order = sorted(n, s, g.col, g.dir); }
    if (s.scenario === 'filter') n.filter = clone(g);
    if (s.scenario === 'condfmt') n.rule = clone(g);
    n.menu = null; n.dialog = false; n.editing = false;
    return n;
  }
  env.task({
    name: 'use-spreadsheet',
    reply: true, // judge and report endings are structured replies under the default reply=auto (kit/runtime/reply.js)
    scenarios, startModes: ['off', 'partial', 'wrong', 'solved'], inputs: ['pointer', 'keyboard', 'wheel'], judgeModes: ['impossible'],
    helpers: { addr, rect, rangeName, parseRange, evaluate, display, visible, fill, transition, selectionStats, matches, translate },
    sample(rng, opts) {
      const cr = rng.fork('content'), gr = rng.fork('goal');
      const s = { scenario: opts.scenario || rng.pick(opts.scenarios || scenarios), level: opts.level || 'normal', ood: !!opts.ood, isplit: opts.isplit, csplit: opts.csplit, startMode: opts.startMode,
        title: C.pick(cr, C.COMPANIES, { csplit: opts.csplit }) + ' · Operations', sheet: 'Orders', n: opts.ood ? cr.int(60, 90) : opts.level === 'easy' ? 8 : opts.level === 'medium' ? 18 : 36 };
      s.cells = [['Item', 'Owner', 'Units', 'Unit cost', 'Amount', 'Status', 'Forecast', 'Notes']];
      const products = C.sample(cr, C.PRODUCTS, s.n, { csplit: opts.csplit });
      const nr = rng.fork('notes');
      const notes = [
        'PO received', 'Invoice matched', 'Check unit cost', 'Stock confirmed', 'Awaiting approval', 'Split delivery',
        'Renewal estimate', 'Terms: net 30', 'Freight included', 'Revised quantity', 'Budget approved',
        'Vendor follow-up', 'Quote for review', 'PO number logged', 'Storage bin noted', 'Tax line itemized',
        'PO copy attached', 'Unload plan noted', 'Pickup slip filed', 'Case pack listed', 'Lot code recorded',
        'Unload time noted', 'Gate pass filed', 'Tax code recorded'
      ];
      for (let r = 1; r <= s.n; r++) s.cells.push([products[(r - 1) % products.length].name, C.personName(cr, { csplit: opts.csplit }).full, cr.int(2, opts.ood ? 170 : 38), cr.int(8, opts.ood ? 650 : 80) + .25, `=C${r + 1}*D${r + 1}`, ['Open', 'Paid', 'Review'][(r - 1) % 3], `=E${r + 1}*1.08`, C.pick(nr, notes, { csplit: opts.csplit })]);
      s.cells.push(Array(8).fill(''), Array(8).fill(''));
      if (s.scenario === 'fillhandle') {
        const right = gr.bool(.4), formula = opts.level !== 'easy' && gr.bool();
        if (right) {
          const row = s.n + 1;
          s.cells[row][0] = 'Quarter forecast'; s.cells[row][2] = formula ? `=SUM(C2:C${s.n + 1})` : gr.int(10, 30); s.cells[row][3] = formula ? '' : s.cells[row][2] + gr.int(2, 9);
          s.goal = { seed: [row, 2, row, formula ? 2 : 3], end: [row, formula ? 4 : gr.int(5, 7)] };
        } else {
          s.cells[1][6] = formula ? '=C2*D2' : gr.int(5, 20); s.cells[2][6] = formula ? '' : s.cells[1][6] + gr.int(2, 7);
          s.goal = { seed: [1, 6, formula ? 1 : 2, 6], end: [gr.int(opts.level === 'easy' ? 4 : 5, 6), 6] };
          for (let r = s.goal.seed[2] + 1; r <= s.goal.end[0]; r++) s.cells[r][6] = '';
        }
      }
      if (s.scenario === 'range') { const top = gr.int(1, Math.min(4, s.n - 3)); s.goal = { range: [top, gr.int(1, 2), Math.min(s.n, top + (opts.level === 'easy' ? 2 : gr.int(3, 6))), gr.int(3, 4)] }; }
      if (s.scenario === 'formula') {
        const row = gr.int(1, s.n), fun = gr.pick(opts.level === 'easy' ? ['SUM', 'COUNT'] : ['SUM', 'AVERAGE', 'MIN', 'MAX', 'COUNT']);
        const formula = opts.level !== 'easy' && gr.bool(.4) ? (s.ood ? `=(C${row + 1}*D${row + 1})+E${row + 1}*0.125` : `=E${row + 1}*0.2`) : `=${fun}(C2:C${s.n + 1})`;
        s.goal = { cell: [row, 6], formula };
      }
      if (s.scenario === 'sort') s.goal = { col: gr.pick([0, 1, 2, 3, 4]), dir: gr.pick(['asc', 'desc']) };
      if (s.scenario === 'filter') s.goal = { col: 5, values: [gr.pick(['Open', 'Paid'])] };
      if (s.scenario === 'condfmt') s.goal = { range: [1, gr.pick([2, 4]), s.n, 4], op: gr.pick(opts.level === 'easy' ? ['>'] : ['>', '<']), threshold: gr.pick([30, 100, 250, 500]), color: gr.pick(['red', 'green', 'blue']) };
      if (opts.judge === 'impossible') {
        const jr = rng.fork('judge'), column = jr.pick(ABSENT_COLUMNS.filter((x) => !s.cells[0].includes(x))), at = jr.int(8, 11);
        const L = letter(at), cell = `G${s.n + 3}`;
        s.judge = { mode: 'impossible', column, letter: L, cell, what: [column, `column ${L}`, `${column} column`],
          message: `I cannot do that: the ${column} column (column ${L}) does not exist in this workbook.` };
      }
      return s;
    },
    init, error, solve,
    tolerance: () => ({ tau: 0, sigma: .3, minInitialError: .05 }),
    instruction(s, rng) {
      const g = s.goal;
      let action;
      if (s.judge) action = I.phrase(rng, ['Calculate the total of the {name} column (column {L}) in this workbook.',
        'Sum the {name} column ({L}) over all records.',
        'Enter the formula "=SUM({L}2:{L}{last})" in {cell} to total the {name} column.',
        'Use "=SUM({L}2:{L}{last})" as the formula in {cell} for the {name} total.',
        '{cell} should total {name} with this formula "=SUM({L}2:{L}{last})".',
        'Record the {name} total in {cell} using this formula "=SUM({L}2:{L}{last})".'], { name: s.judge.column, L: s.judge.letter, last: s.n + 1, cell: s.judge.cell }, s.isplit);
      else if (s.scenario === 'fillhandle') action = I.phrase(rng, [
        'Continue the {kind} from {source} through {end}.', 'Extend the {kind} in {source} to {end}.',
        'Complete the {kind} through {end}, following {source}.', 'Using {source}, fill the {kind} through {end}.',
        'The {kind} in {source} must reach through {end}.', 'Use {source} to carry the {kind} through {end}.'
      ], { kind: String(s.cells[g.seed[0]][g.seed[1]]).startsWith('=') ? 'formula pattern' : 'number series', source: rangeName(g.seed), end: addr(g.end) }, s.isplit);
      else if (s.scenario === 'range') action = I.phrase(rng, [
        'Select the cell range {range}.', 'Highlight {range} in the worksheet.', 'Make {range} the active selection.',
        'Select every cell within {range}.', 'The selection should be {range}.', 'Use {range} as the selected block.',
        'Leave {range} selected in full.', 'Set the selection to cover {range}.'
      ], { range: rangeName(g.range) }, s.isplit);
      else if (s.scenario === 'formula') action = I.phrase(rng, [
        'Enter the formula "{formula}" in {cell}.', 'Set {cell} to the formula "{formula}".',
        'Calculate "{formula}" in cell {cell}.', 'Use "{formula}" as a formula for {cell}.',
        'The formula for {cell} is "{formula}".', '{cell} needs the formula "{formula}".'
      ], { formula: g.formula, cell: addr(g.cell) }, s.isplit);
      else if (s.scenario === 'sort') action = `Sort the table by ${s.cells[0][g.col]} (${letter(g.col)}), ${g.dir === 'asc' ? 'ascending' : 'descending'}, keeping the header row in place.`;
      else if (s.scenario === 'filter') action = `Filter the Status column to show only ${g.values.join(' or ')} records.`;
      else action = `Apply conditional formatting to ${rangeName(g.range)}: values ${g.op === '>' ? 'greater than' : 'less than'} ${g.threshold} should have a ${g.color} fill.`;
      return I.say(rng, action, { isplit: s.isplit, noise: .05, typo: 0 });
    },
    plan(m, s) {
      if (s.judge) return { finish: true, message: s.judge.message };
      const g = s.goal;
      const ensure = (r) => r < m.scrollRow + 1 || r >= m.scrollRow + m.visibleRows ? { wheel: [{ pane: true }, (r < m.scrollRow + 1 ? -1 : 1) * Math.max(50, Math.abs(r - m.scrollRow - 2) * 26)] } : null;
      if (s.scenario === 'range') {
        if (m.selection[0] !== g.range[0] || m.selection[1] !== g.range[1]) {
          const scroll = ensure(g.range[0]); if (scroll) return scroll;
          return { click: { cell: g.range.slice(0, 2) } };
        }
        const endScroll = ensure(g.range[2]); if (endScroll) return endScroll;
        return { click: { cell: g.range.slice(2) }, modifiers: ['Shift'] };
      }
      if (s.scenario === 'fillhandle') {
        const scroll = ensure(g.seed[0]); if (scroll) return scroll;
        // Restore the source values after a wrong start without ever using solve() in the oracle.
        for (const p of points(g.seed)) if (normalized(m.cells[p[0]][p[1]]) !== normalized(s.cells[p[0]][p[1]])) {
          if (m.selection[0] !== p[0] || m.selection[1] !== p[1]) return { click: { cell: p } };
          if (!m.editing || m.formulaDraft !== String(s.cells[p[0]][p[1]])) return { type: [{ control: 'formula' }, String(s.cells[p[0]][p[1]])] };
          return { key: 'Enter' };
        }
        if (!sameJson(rect(m.selection), rect(g.seed))) return { drag: [{ cell: g.seed.slice(0, 2) }, { cell: g.seed.slice(2) }] };
        return { drag: [{ handle: true }, { fillEnd: g.end }] };
      }
      if (s.scenario === 'formula') {
        const scroll = ensure(g.cell[0]); if (scroll) return scroll;
        if (!sameJson(m.selection.slice(0, 2), g.cell)) return { click: { cell: g.cell } };
        if (!m.editing || m.formulaDraft !== g.formula) return { type: [{ control: 'formula' }, g.formula] };
        return { key: 'Enter' };
      }
      if (s.scenario === 'sort' || s.scenario === 'filter') {
        if (!m.menu || m.menu.col !== g.col) return { click: { header: g.col } };
        return s.scenario === 'sort' ? { click: { control: g.dir } } : { click: { option: g.values[0] } };
      }
      if (!m.dialog) return { click: { control: 'condfmt' } };
      if (m.draft.range !== rangeName(g.range)) return { type: [{ control: 'range' }, rangeName(g.range)] };
      if (m.draft.op !== g.op) return { click: { operator: g.op } };
      if (String(m.draft.threshold) !== String(g.threshold)) return { type: [{ control: 'threshold' }, String(g.threshold)] };
      if (m.draft.color !== g.color) return { click: { color: g.color } };
      return { click: { control: 'apply' } };
    },
    parts(m, s) {
      if (s.judge) return [];
      const g = s.goal, head = s.cells[0], out = [];
      if (s.scenario === 'range') out.push({ name: 'Selection', value: rect(m.selection) });
      if (s.scenario === 'fillhandle') {
        const all = rect([...g.seed.slice(0, 2), ...g.end]), dest = rect([...(g.end[1] > g.seed[3] ? [g.seed[0], g.seed[3] + 1] : [g.seed[2] + 1, g.seed[1]]), ...g.end]);
        out.push({ name: rangeName(all), aliases: [rangeName(dest)], value: points(all).map((p) => m.cells[p[0]][p[1]]) });
      }
      if (s.scenario === 'formula') out.push({ name: addr(g.cell), value: m.cells[g.cell[0]][g.cell[1]] });
      out.push({ name: 'Sort', value: m.sort ? `${head[m.sort.col]} ${m.sort.dir}` : null },
        { name: 'Filter', value: m.filter ? `${head[m.filter.col]} ${m.filter.values.join(',')}` : null },
        { name: 'Conditional formatting', value: m.rule ? [rangeName(m.rule.range), m.rule.op, +m.rule.threshold, m.rule.color] : null });
      return out;
    },
    facts(m, s) {
      const t = selectionStats(m, s);
      return [{ label: 'Visible records', value: String(t.records) }, { label: 'Amount total', value: t.total }, { label: 'Numeric cells', value: String(t.count) }];
    },
    silent(next, prev, s, rng) {
      if (s.judge || error(next, s) >= error(prev, s)) return null;
      const n = clone(next), g = s.goal;
      if (s.scenario === 'formula') { const v = n.cells[g.cell[0]][g.cell[1]]; n.cells[g.cell[0]][g.cell[1]] = rng.bool() ? "'" + v : Math.round(Number(evaluate(n.cells, g.cell)) || 0); }
      if (s.scenario === 'fillhandle') { const xs = expectedFill(s).filter((x) => !sameJson(next.cells[x.p[0]][x.p[1]], prev.cells[x.p[0]][x.p[1]])); if (!xs.length) return null; const p = rng.pick(xs).p; n.cells[p[0]][p[1]] = prev.cells[p[0]][p[1]]; }
      if (s.scenario === 'range') n.selection[2] = Math.max(n.selection[0], n.selection[2] - 1);
      if (s.scenario === 'sort') { n.sort = clone(prev.sort); n.order = clone(prev.order); }
      if (s.scenario === 'filter') n.filter = clone(prev.filter);
      if (s.scenario === 'condfmt') { if (!n.rule) return null; n.rule.threshold = +n.rule.threshold + 1; }
      return error(n, s) > 0 ? n : null;
    },
    retarget(s, m, rng) {
      if (s.judge) return null;
      const n = clone(s), g = n.goal;
      if (s.scenario === 'range') { g.range = [1, 0, Math.min(s.n, rng.int(3, 6)), 2]; if (sameJson(g.range, s.goal.range)) g.range[3] = 3; }
      if (s.scenario === 'fillhandle') {
        g.end = clone(g.end); const k = g.end[0] === g.seed[0] ? 1 : 0;
        if (k === 1 && g.end[1] === 7) { g.seed = [1, 2, 1, 3]; g.end = [1, 5]; }
        else g.end[k]++;
      }
      if (s.scenario === 'formula') g.formula = g.formula.startsWith('=SUM') ? `=MAX(C2:C${s.n + 1})` : `=SUM(C2:C${s.n + 1})`;
      if (s.scenario === 'sort') g.dir = g.dir === 'asc' ? 'desc' : 'asc';
      if (s.scenario === 'filter') g.values = [g.values[0] === 'Open' ? 'Paid' : 'Open'];
      if (s.scenario === 'condfmt') g.color = g.color === 'red' ? 'green' : 'red';
      return error(m, n) > 0 && Number.isFinite(error(init(n), n)) ? n : null;
    },
  });
})();
