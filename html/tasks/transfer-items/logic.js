/*
 * transfer-items: move the right items between the two lists of a dual listbox.
 * A dual listbox ("Available" on the left, "Selected" on the right). Items are selected in a
 * list (click; Ctrl-click toggles; Shift-click selects the range from the anchor) and moved with arrow
 * buttons (> moves the selection right, >> moves every item matching the left filter, < and << back), by
 * double-clicking an item, or by dragging an item (or the selection it belongs to) into the other list.
 * MiniWoB counterpart: none (click-checkboxes-transfer is the closest); this is the enterprise "permission /
 * column chooser" widget.
 *
 * scenarios
 *   move     5-9 items (ood 12-16) split over the two lists, all rows visible. Goal: an exact set named
 *            (spec.goal 'names') or "everything except X and Y" (goal 'except', where >> then < is shorter)
 *   filter   20-35 items (ood 40-60) with a filter box above each list; a list shows at most spec.rows
 *            matching rows and a "+N more, refine the filter" line, so off-screen targets have to be found by
 *            typing (case-insensitive substring). Changing a filter clears that list's selection
 *   ordered  the right list must hold the targets in a given order (3-4 targets, ood 5-6, from 7-10 items):
 *            move them over, then reorder inside the right list with Up/Down buttons (they move the selected
 *            items one row) or by dragging a row to a new slot
 *   multi    8-14 items (ood 15-18), all rows visible, and the page accepts ONE transfer only (the first
 *            move of any kind, by arrow, double-click or drag, locks the arrows; model.moves counts it). The
 *            targets (3-5) are a contiguous block (spec.multi 'range': "from A down to B", Shift-click) or a
 *            scattered set (spec.multi 'scatter', Ctrl-click); a plain click replaces the selection, so the
 *            whole set has to be selected with modifier keys, then moved with one arrow click or one drag
 *   range    10-15 items (ood 15-18), all rows visible, ONE transfer (as multi), a run of 4-7 items (easy 3, medium 4)
 *            clicked at its first item and Shift-clicked at its last, then moved with one arrow click or one drag.
 *            The run is on the left (spec.side 'L': move it right) or on the right, where every item starts
 *            (spec.side 'R': move it back left; the goal is then every item but the run)
 *   rangemix like range, but the set is the run minus 1-2 items plus 1-2 items outside it ("from A to B except C,
 *            plus F"): Shift-click the run, then Ctrl-click the items to drop or add (easy: the run minus one, nothing
 *            added); spec.range { a, b, skip: [], plus: [] }, spec.moveSet = the items to transfer
 *
 * spec   { scenario, isplit, csplit, ood, startMode, context, title, note, noun, plural,
 *          leftLabel, rightLabel, rightAliases: [string],
 *          items: [string]                 all items in canonical (left list) order
 *          targets: [string]               the right list's goal (ordered: in order)
 *          goal: 'names' | 'except' | 'order', except: [string] (goal 'except': the items left out)
 *          range / rangemix: side 'L' | 'R', moveSet: [string] (the items to transfer, canonical order), range: { a, b, skip, plus },
 *          goal 'names' (side L: targets = moveSet; side R: targets = every other item)
 *          route: 'buttons' | 'drag' | 'dblclick'   the oracle's moving route (ordered: reordering uses
 *                                          the Up/Down buttons unless route is 'drag')
 *          rows (filter: max rows a list shows, else the item count), queries: { item: text } (filter: a
 *          substring that shows the item among at most min(rows, 5) items) }
 * model  { right: [string] (right list, top to bottom), selL: [string], selR: [string],
 *          anchor: { L, R } (Shift-click anchors, '' none), qL, qR (filter texts), moves? (multi, range, rangemix) }
 *        The left list is spec.items minus model.right, in canonical order. Moved items are appended to the
 *        other list in their visible order (a drag may drop at a slot instead). Only `right` is graded.
 * error  |right xor targets| (Hamming over membership); ordered adds the number of target positions i with
 *        right[i] !== targets[i]; multi / range / rangemix before their one transfer: that x (0.5 + 0.5 x the
 *        selection's error against the items to move, (missing + 2 x wrong) / |items|, capped at 1). tau = 0 (exact).
 *
 * levels easy / medium: fewer items and targets (move 4-5 / 5-7 items, 2 / 2-3 targets, no 'except' goals;
 *        filter 12-16 / 16-24 items; ordered 5-6 / 6-8 items with 2 / 2-3 targets; multi 6-8 items with a
 *        Shift range of 3 (easy), 7-10 items with a range or scatter of 3 (medium)); easy uses arrow buttons
 *        only. Normal draws exactly what it always did.
 *
 * start modes (multi, range, rangemix: every mode leaves the right list empty (range side R: full), only the targets matter): off (a few targets and/or extras already on the right), partial (some targets moved, nothing
 *        extra), wrong (near-miss extras on the right that share a name prefix or word with a target;
 *        ordered: all targets there in a wrong order), solved. No wrong-choice ending, so no recoverable mode.
 *
 * opts.route: ignored (no keyboard, wheel or pointer-only alternative route exists: the filter scenario
 *        always types, the others never need keys).
 *
 * plan targets (the widget's locate() maps them to viewport px)
 *   { item: x }               a visible row (the oracle never targets a row hidden by a filter or the cap)
 *   { btn: 'R' | 'RR' | 'L' | 'LL' | 'up' | 'down' }   > >> < << and the ordered list's Up / Down
 *   { filter: 'L' | 'R' }     a list's filter box
 *   { list: 'L' | 'R' }       a drop point in a list below its last row (drag: append)
 *   { slot: i }               ordered: a drop point on the upper quarter of right row i (dragged item lands at i)
 * plan steps: { click: { item }, modifiers?: ['Control'] | ['Shift'] }, { click: { btn } },
 *   { dblclick: { item } }, { drag: [{ item }, { list } | { slot }] }, { type: [{ filter }, text] }
 *
 * judge modes (judgeModes ambiguous, impossible; spec.judge = { mode, message, cands?, names, ordered }; the page starts
 *   untouched, error 0 until anything is on the right list, which also ends the episode 'wrong-choice'):
 *   ambiguous  one of the named items exists twice as "<name> (<qualifier>)" with two qualifiers ("Dana Whitfield (Sales)" /
 *              "(Support)"); the instruction gives the bare name; the reply asks (status ask) with one option per entry (cands:
 *              the full "<name> (<qualifier>)", plus the bare qualifier when no other entry carries that word; others: the
 *              other entries, never offered)
 *   impossible one named item is not in either list; status impossible, what: that name
 *   (no confirm: only the locked scenarios have an irreversible step, and judgeModes are per task)
 * hooks (round 2):
 *   facts(model, spec)       both list headers' counts as shown "(n)"; for the locked scenarios the status once the transfer is done
 *                            (label paraphrases in labels)
 *   parts(model, spec)       preempt=cancel: every item by its name (value: its place in the right list, -1 in the left one)
 *   silent(next, prev, spec, rng)  after a transfer, one moved item silently stayed (or one item moved back is back on the
 *                            right); ordered: two neighbouring rows swapped; null for the locked scenarios and judge episodes
 *   retarget(spec, model, rng)     new targets of the same size (move: also a new 'except' set; ordered: a new order); null
 *                            for the locked scenarios (their single transfer may be spent) and judge episodes
 *
 * Self-tests live in selftest.js (loaded only by the checker and node tests).
 * Helpers (widget API, env.taskDef.helpers):
 *   apply(model, spec, act) -> model: click/drag/button semantics; widgets call it and ctx.update the result.
 *   leftOf(spec, model) -> items: the left list in canonical order.
 *   shown(spec, model, side) -> { rows, more }: capped matching rows and the overflow count.
 *   matches(spec, model, side) -> items: every item matching the side's filter.
 *   acts: { sel: [side, item, mod ('' | 'ctrl' | 'shift')] }, { btn }, { dbl: [side, item] },
 *         { drop: [fromSide, item, toSide, index | undefined] }, { query: [side, text] }
 */
(function () {
  'use strict';

  const { quote, listText } = env.util;

  const C = env.content;
  const I = env.instruct;
  const lc = (s) => s.toLowerCase();
  const uniq = (xs) => [...new Set(xs)];
  const alpha = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
  const other = (side) => (side === 'L' ? 'R' : 'L');

  // ---------------------------------------------------------------- content

  const COLUMNS = ['Order ID', 'Order date', 'Customer', 'Email', 'Region', 'Country', 'Sales rep', 'Product', 'SKU',
    'Quantity', 'Unit price', 'Discount', 'Tax', 'Shipping cost', 'Total', 'Status', 'Payment method', 'Created by',
    'Last modified', 'Notes', 'Invoice number', 'Due date', 'Currency', 'Margin', 'Unit cost', 'Sales channel',
    'Campaign', 'Coupon code', 'Warehouse', 'Carrier', 'Tracking number', 'Delivered on', 'Return reason', 'Rating',
    'Account manager', 'Customer segment', 'City', 'Postal code', 'Phone', 'Company', 'Priority', 'Assignee',
    'Fiscal year', 'Fiscal quarter', 'Sales territory', 'Account number', 'Billing address', 'Contact name',
    'Contact title', 'Lead source', 'Renewal date', 'Contract term', 'Service level', 'Support tier', 'Product family',
    'Variant', 'Batch number', 'Inventory level', 'Reorder point', 'Stock location', 'Purchase order', 'Supplier',
    'Dispatch date', 'Delivery window', 'Return date', 'Refund amount', 'Exchange status', 'Warranty period',
    'Review count', 'Visit date', 'Web source', 'Device type', 'Language', 'Timezone', 'Record owner',
    'Approval status', 'Quote ID', 'Line item', 'Gross revenue', 'Net revenue', 'Gross profit', 'Profit rate',
    'Payment date', 'Settlement date', 'Tax rate', 'Discount rate', 'List price', 'Net price', 'Extended price',
    'Cost center', 'Department', 'Business unit', 'Branch', 'Market area', 'Buyer role', 'Customer since',
    'Open balance', 'Credit terms', 'Billing cycle', 'Contract value', 'Start date', 'End date', 'Return status',
    'Claim ID', 'Case category', 'Response time', 'Resolution date', 'Campaign type', 'Impressions', 'Conversion rate',
    'Backorder count', 'Shipment number', 'Customer ID', 'Opportunity ID', 'Lead ID', 'Contact ID', 'Parent account',
    'Store number', 'Outlet type', 'Channel partner', 'Partner tier', 'Forecast amount', 'Win probability',
    'Pipeline source', 'Competitor name', 'Product line', 'Feature set', 'License count', 'Seat count', 'Usage rate',
    'Active users', 'Churn risk', 'Onboarding date', 'Training status', 'Project code', 'Project owner', 'Task count',
    'Milestone date', 'SLA target', 'Queue name', 'Touchpoint type', 'Next action', 'Days overdue', 'Aging bucket',
    'Receipt number'];
  const PERMISSIONS = ['View invoices', 'Edit invoices', 'Approve invoices', 'Delete invoices', 'View expenses',
    'Submit expenses', 'Approve expenses', 'Export reports', 'Schedule reports', 'View payroll', 'Run payroll',
    'Manage users', 'Invite users', 'Reset passwords', 'View audit log', 'Export audit log', 'Manage billing',
    'View dashboards', 'Edit dashboards', 'Share dashboards', 'Manage integrations', 'Create API keys',
    'Revoke API keys', 'Manage roles', 'View customers', 'Edit customers', 'Merge customers', 'Delete customers',
    'View orders', 'Refund orders', 'Cancel orders', 'Edit products', 'Publish products', 'Manage inventory',
    'View analytics', 'Manage webhooks', 'Edit settings', 'Manage domains', 'View tickets', 'Close tickets',
    'Assign tickets', 'Manage teams', 'View files', 'Upload files', 'Download files', 'Share files', 'Manage folders',
    'Create folders', 'Rename folders', 'View documents', 'Edit documents', 'Sign documents', 'Manage templates',
    'Create templates', 'View tasks', 'Create tasks', 'Complete tasks', 'Assign tasks', 'View calendar',
    'Edit calendar', 'Schedule events', 'Cancel events', 'Invite guests', 'Manage workspace', 'Export data',
    'Import data', 'View messages', 'Send messages', 'Archive messages', 'Manage contacts', 'View leads',
    'Qualify leads', 'Assign leads', 'View usage', 'Manage devices', 'Register devices', 'View assets',
    'Assign assets', 'Manage licenses', 'View shipments', 'Track shipments', 'Manage returns', 'Inspect parcels',
    'Review refunds', 'Create invoices', 'Send invoices', 'Manage tax rates', 'View budgets', 'Edit budgets',
    'Allocate budgets', 'Manage vendors', 'Review contracts', 'Renew contracts', 'Manage projects', 'Create projects',
    'Archive projects', 'View milestones', 'Manage forms', 'Validate forms', 'Manage queues', 'Route requests',
    'Manage incidents', 'View uptime', 'Rotate secrets', 'Review sessions', 'Manage groups', 'Create policies',
    'Review policies', 'Manage backups', 'Restore backups', 'Manage storage', 'View deployments', 'Approve releases',
    'View quotations', 'Draft quotations', 'Track applicants', 'Manage shifts', 'View benefits', 'Dispute charges',
    'Issue credits', 'Manage vouchers', 'View price lists', 'Adjust pricing', 'Manage catalogs', 'Tag products',
    'Moderate reviews', 'View cash flow', 'Manage forecasts', 'Receive stock', 'Transfer stock', 'Manage locations'];

  // Each context: the two list labels, aliases for the right list, a title/note bank and a pool function.
  const CONTEXTS = {
    team: { L: [
      'Available users', 'Directory', 'All people', 'User pool', 'Outside team'
    ], R: ['Project members', 'Team members', 'Invited'],
      noun: 'person', plural: 'people', titles: [
        'Edit project team', 'Manage channel members', 'Share workspace', 'Manage team access', 'Team member access',
        'Member access list'
      ],
      notes: ['People on the right get access right away.', 'Members can edit everything in this project.'],
      verb: ['Add {xs} to the {R} list', 'Give {xs} access'] },
    columns: { L: [
      'Available columns', 'Hidden columns', 'All fields', 'Unused fields', 'Column library', 'Outside report'
    ], R: ['Visible columns', 'Shown columns', 'Report columns'],
      noun: 'column', plural: 'columns', titles: [
        'Customize report', 'Choose columns', 'Table settings', 'Export layout', 'Report fields', 'Export options',
        'Table structure', 'Field selection'
      ],
      notes: ['The right list sets which columns appear, top to bottom = left to right.', 'Applies to this report only.'],
      verb: ['Show the {xs} columns', 'Display {xs}'] },
    permissions: { L: [
      'Available permissions', 'All permissions', 'Enabled operations'
    ], R: ['Granted permissions', 'Role permissions', 'Assigned'],
      noun: 'permission', plural: 'permissions', titles: [
        'Edit role: Billing admin', 'Edit role: Support lead', 'Custom role', 'API token scopes', 'Role capabilities',
        'Token access scopes', 'Permission settings', 'Access policy setup'
      ],
      notes: ['Changes apply to everyone with this role.', 'Grant only what the role needs.'],
      verb: ['Grant {xs}', 'Give the role {xs}'] },
    countries: { L: [
      'All countries', 'Available countries', 'Zone membership', 'Destinations used'
    ], R: ['Shipping zone', 'Selected countries', 'Included'],
      noun: 'country', plural: 'countries', titles: [
        'Edit shipping zone', 'Sales regions', 'Tax region', 'Zone settings', 'Rate coverage', 'Market coverage'
      ],
      notes: ['Orders from these countries use this zone\'s rates.', 'A country can be in one zone only.'],
      verb: ['Include {xs}', 'Ship to {xs}'] },
    products: { L: [
      'Catalog', 'All products', 'Lineup', 'On display', 'This group'
    ], R: ['Featured', 'Collection', 'Bundle items'],
      noun: 'product', plural: 'products', titles: [
        'Edit collection', 'Home page featured items', 'Create bundle', 'Store collections', 'Catalog selection',
        'Bundle composition'
      ],
      notes: ['Featured items appear in this order on the home page.', 'Out-of-stock items are hidden in the store.'],
      verb: ['Feature {xs}', 'Put {xs} in the collection'] },
    departments: { L: [
      'Departments', 'All teams', 'Audience', 'Notify list', 'Alert scope'
    ], R: ['Notified', 'Recipients', 'Selected teams'],
      noun: 'department', plural: 'departments', titles: [
        'Announcement audience', 'Alert routing', 'Survey recipients', 'Team notifications', 'Message audience',
        'Department alerts'
      ],
      notes: ['Everyone in these teams gets the message.', 'Managers are always notified.'],
      verb: ['Notify {xs}', 'Send it to {xs}'] },
    cities: { L: [
      'Cities', 'Available cities', 'Location set', 'Area scope'
    ], R: ['Delivery area', 'Selected cities', 'Store locations'],
      noun: 'city', plural: 'cities', titles: [
        'Delivery coverage', 'Store finder setup', 'Weather alerts', 'City service map', 'Area alert setup',
        'Coverage settings'
      ],
      notes: ['We deliver same-day in these cities.', 'You can add more cities later.'],
      verb: ['Add {xs}', 'Cover {xs}'] },
  };
  const RIGHT_ALIASES = ['the right-hand list', 'the right list', 'the selected side', 'the right panel'];
  const CTX_KEYS = Object.keys(CONTEXTS);

  function poolOf(rng, key, n, csplit) {
    const cs = { csplit };
    const take = (list) => C.split(uniq(list), csplit).filter((s) => s.length <= 30);
    if (key === 'team') {
      const out = [];
      for (let t = 0; out.length < n && t < 400; t++) {
        const p = C.personName(rng, cs);
        if (/^[A-Za-z' -]+$/.test(p.full) && p.full.length <= 24 && !out.includes(p.full)) out.push(p.full);
      }
      return out;
    }
    const lists = {
      columns: () => take(COLUMNS).length >= n ? take(COLUMNS) : uniq(COLUMNS),
      permissions: () => take(PERMISSIONS).length >= n ? take(PERMISSIONS) : uniq(PERMISSIONS),
      countries: () => take(C.COUNTRIES.map((c) => c.name)),
      products: () => take(C.PRODUCTS.map((p) => p.name)),
      departments: () => uniq(C.DEPARTMENTS),
      cities: () => take(C.CITIES.map((c) => c.city)),
    };
    const pool = lists[key]();
    return rng.sample(pool, Math.min(n, pool.length));
  }

  // ---------------------------------------------------------------- list helpers (shared with widgets)

  const leftOf = (spec, model) => spec.items.filter((x) => !model.right.includes(x));
  const listOf = (spec, model, side) => (side === 'L' ? leftOf(spec, model) : model.right);
  const queryOf = (model, side) => (side === 'L' ? model.qL : model.qR) || '';
  // Items of a side that match its filter (all of them without a filter).
  function matches(spec, model, side) {
    const q = lc(queryOf(model, side).trim());
    const all = listOf(spec, model, side);
    return q ? all.filter((x) => lc(x).includes(q)) : all;
  }
  // Rows a side renders: the first spec.rows matches, and how many more match.
  function shown(spec, model, side) {
    const m = matches(spec, model, side);
    const cap = spec.scenario === 'filter' ? spec.rows : m.length;
    return { rows: m.slice(0, cap), more: Math.max(0, m.length - cap) };
  }

  function cloneModel(m) {
    const c = { right: m.right.slice(), selL: m.selL.slice(), selR: m.selR.slice(), anchor: { ...m.anchor }, qL: m.qL, qR: m.qR };
    if (m.moves !== undefined) c.moves = m.moves;
    return c;
  }
  const selKey = (side) => (side === 'L' ? 'selL' : 'selR');
  const qKey = (side) => (side === 'L' ? 'qL' : 'qR');

  // Move items from a side to the other, appended in their visible order (or inserted at index on the right).
  function moveItems(spec, m, from, items, index) {
    const order = listOf(spec, m, from);
    const xs = order.filter((x) => items.includes(x));
    if (!xs.length) return m;
    if (m.moves !== undefined) {
      if (m.moves >= 1) return m; // multi: the page accepts one transfer only
      m.moves++;
    }
    if (from === 'L') {
      const rest = m.right.slice();
      const at = index === undefined ? rest.length : Math.max(0, Math.min(rest.length, index));
      rest.splice(at, 0, ...xs);
      m.right = rest;
      m.selL = m.selL.filter((x) => !xs.includes(x));
    } else {
      m.right = m.right.filter((x) => !xs.includes(x));
      m.selR = m.selR.filter((x) => !xs.includes(x));
    }
    if (m.anchor.L && !listOf(spec, m, 'L').includes(m.anchor.L)) m.anchor.L = '';
    if (m.anchor.R && !m.right.includes(m.anchor.R)) m.anchor.R = '';
    return m;
  }

  // The semantics of every user action (see header). Returns a new model.
  function apply(model, spec, a) {
    const m = cloneModel(model);
    if (a.sel) {
      const [side, x, mod] = a.sel;
      const k = selKey(side);
      const rows = shown(spec, m, side).rows;
      if (!rows.includes(x)) return m;
      if (mod === 'ctrl') {
        m[k] = m[k].includes(x) ? m[k].filter((y) => y !== x) : rows.filter((y) => y === x || m[k].includes(y));
        m.anchor[side] = x;
      } else if (mod === 'shift' && m.anchor[side] && rows.includes(m.anchor[side])) {
        const i = rows.indexOf(m.anchor[side]);
        const j = rows.indexOf(x);
        m[k] = rows.slice(Math.min(i, j), Math.max(i, j) + 1);
      } else {
        m[k] = [x];
        m.anchor[side] = x;
      }
      return m;
    }
    if (a.btn) {
      const b = a.btn;
      if (b === 'R') return moveItems(spec, m, 'L', m.selL);
      if (b === 'L') return moveItems(spec, m, 'R', m.selR);
      if (b === 'RR') return moveItems(spec, m, 'L', matches(spec, m, 'L'));
      if (b === 'LL') return moveItems(spec, m, 'R', matches(spec, m, 'R'));
      if (b === 'up' || b === 'down') {
        const sel = m.right.filter((x) => m.selR.includes(x));
        if (!sel.length) return m;
        const r = m.right.slice();
        const idx = sel.map((x) => r.indexOf(x));
        if (b === 'up' && idx[0] > 0) for (const i of idx) [r[i - 1], r[i]] = [r[i], r[i - 1]];
        if (b === 'down' && idx[idx.length - 1] < r.length - 1) for (const i of idx.slice().reverse()) [r[i], r[i + 1]] = [r[i + 1], r[i]];
        m.right = r;
        return m;
      }
      return m;
    }
    if (a.dbl) {
      const [side, x] = a.dbl;
      if (!shown(spec, m, side).rows.includes(x)) return m;
      return moveItems(spec, m, side, [x]);
    }
    if (a.drop) {
      const [from, x, to, index] = a.drop;
      if (!shown(spec, m, from).rows.includes(x)) return m;
      const sel = m[selKey(from)];
      const items = sel.includes(x) ? sel.slice() : [x];
      if (from !== to) return moveItems(spec, m, from, items, to === 'R' ? index : undefined);
      if (from === 'R' && index !== undefined) {
        // Reorder inside the right list: index is the insertion point counted before removal.
        const r = m.right.slice();
        const block = r.filter((y) => items.includes(y));
        let at = index;
        for (const y of block) if (r.indexOf(y) < index) at--;
        const rest = r.filter((y) => !items.includes(y));
        rest.splice(Math.max(0, Math.min(rest.length, at)), 0, ...block);
        m.right = rest;
      }
      return m;
    }
    if (a.query) {
      const [side, text] = a.query;
      if (queryOf(m, side) === text) return m;
      m[qKey(side)] = text;
      m[selKey(side)] = [];
      m.anchor[side] = '';
      return m;
    }
    return m;
  }

  // ---------------------------------------------------------------- sampling

  // A short substring of x (a word prefix of 3+ letters) that matches at most `cap` items.
  function queryFor(items, x, cap) {
    const words = x.split(/[^A-Za-z0-9]+/).filter((w) => w.length >= 3);
    let best = null;
    for (const w of words) {
      for (let L = 3; L <= w.length; L++) {
        const q = lc(w.slice(0, L));
        const n = items.filter((o) => lc(o).includes(q)).length;
        if (n <= cap && (!best || q.length < best.length)) { best = q; break; }
      }
    }
    return best || lc(x);
  }

  // Items sharing a word or the first two letters with some target (near-miss extras for 'wrong' starts).
  function nearOf(spec, pool) {
    const w = (s) => lc(s).split(/[^a-z0-9]+/).filter((t) => t.length >= 4);
    return pool.filter((o) => spec.targets.some((t) => lc(t).slice(0, 2) === lc(o).slice(0, 2)
      || w(t).some((x) => w(o).includes(x))));
  }

  function sampleSpec(rng, scenario, opts) {
    const base = { scenario, isplit: opts.isplit || 'train', csplit: opts.csplit || 'train', ood: !!opts.ood, startMode: opts.startMode || 'off' };
    const ctxKeys = scenario === 'ordered' ? ['columns', 'products', 'team', 'permissions', 'departments']
      : scenario === 'filter' ? ['countries', 'products', 'team', 'cities', 'columns', 'permissions'] : CTX_KEYS;
    const key = rng.pick(ctxKeys);
    const cx = CONTEXTS[key];
    const lv = opts.level === 'easy' || opts.level === 'medium' ? opts.level : 'normal';
    const E = lv === 'easy';
    let n = scenario === 'filter' ? (base.ood ? rng.int(40, 60) : rng.int(20, 35))
      : scenario === 'ordered' ? (base.ood ? rng.int(10, 13) : rng.int(7, 10))
        : scenario === 'multi' ? (base.ood ? rng.int(15, 18) : rng.int(8, 14))
          : scenario === 'range' || scenario === 'rangemix' ? (base.ood ? rng.int(15, 18) : rng.int(10, 15))
            : base.ood ? rng.int(12, 16) : rng.int(5, 9);
    if (lv !== 'normal') {
      const f = rng.fork('level');
      if (scenario === 'filter') n = E ? f.int(12, 16) : f.int(16, 24);
      else if (scenario === 'ordered') n = E ? f.int(5, 6) : f.int(6, 8);
      else if (scenario === 'multi') n = E ? f.int(6, 8) : f.int(7, 10);
      else if (scenario === 'range' || scenario === 'rangemix') n = E ? f.int(8, 10) : f.int(9, 12);
      else n = E ? f.int(4, 5) : f.int(5, 7);
    }
    const items = poolOf(rng.fork('content'), key, n, base.csplit).sort(alpha);
    if (items.length < Math.min(n, 8)) return null;
    const spec = { ...base, context: key, title: rng.pick(cx.titles), note: rng.pick(cx.notes), noun: cx.noun, plural: cx.plural,
      leftLabel: rng.pick(cx.L), rightLabel: rng.pick(cx.R), items };
    spec.rightAliases = RIGHT_ALIASES.slice();
    const N = items.length;
    if (scenario === 'multi') {
      const f = rng.fork('multi');
      const kind = E ? 'range' : lv === 'medium' ? f.pick(['range', 'scatter']) : f.pick(['range', 'scatter', 'scatter']);
      const k = E || lv === 'medium' ? 3 : f.int(3, Math.min(5, N - 3));
      const span = (t) => items.indexOf(t[t.length - 1]) - items.indexOf(t[0]) + 1;
      if (kind === 'range') {
        const i = f.int(0, N - k);
        spec.targets = items.slice(i, i + k);
      } else {
        let t = [];
        for (let a = 0; a < 20; a++) {
          t = f.sample(items, k).sort((x, y) => items.indexOf(x) - items.indexOf(y));
          if (span(t) > k) break;
        }
        if (span(t) === k) return null;
        spec.targets = t;
      }
      spec.multi = kind;
      spec.goal = 'names';
      spec.route = E ? 'buttons' : f.pick(['buttons', 'buttons', 'drag']);
      spec.rows = N;
      return spec;
    }
    if (scenario === 'range' || scenario === 'rangemix') {
      const f = rng.fork(scenario);
      const mix = scenario === 'rangemix';
      const k = mix ? (E ? 4 : lv === 'medium' ? 5 : f.int(5, Math.min(base.ood ? 8 : 7, N - 3))) : E ? 3 : lv === 'medium' ? 4 : f.int(4, Math.min(base.ood ? 8 : 7, N - 4));
      const nSkip = !mix ? 0 : k >= 7 ? f.int(1, 2) : 1;
      const nPlus = !mix || E ? 0 : k >= 7 && f.bool(0.4) ? 2 : 1;
      const side = E ? 'L' : f.pick(['L', 'L', 'R']);
      const i = f.int(0, N - k);
      const run = items.slice(i, i + k);
      const skip = nSkip ? f.sample(run.slice(1, -1), nSkip) : [];
      const plus = nPlus ? f.sample(items.filter((x) => !run.includes(x)), nPlus) : [];
      const moveSet = items.filter((x) => (run.includes(x) && !skip.includes(x)) || plus.includes(x));
      spec.side = side;
      spec.moveSet = moveSet;
      spec.range = { a: run[0], b: run[k - 1], skip: items.filter((x) => skip.includes(x)), plus: items.filter((x) => plus.includes(x)) };
      spec.targets = side === 'L' ? moveSet.slice() : items.filter((x) => !moveSet.includes(x));
      spec.goal = 'names';
      spec.route = E ? 'buttons' : f.pick(['buttons', 'buttons', 'drag']);
      spec.rows = N;
      return spec;
    }
    if (lv !== 'normal') {
      const f = rng.fork('level2');
      const k = E ? 2 : f.int(2, 3);
      spec.targets = rng.fork('level3').sample(items, k);
      if (scenario !== 'ordered') spec.targets.sort((a, b) => items.indexOf(a) - items.indexOf(b));
      spec.goal = scenario === 'ordered' ? 'order' : 'names';
      spec.route = E ? 'buttons' : f.pick(['buttons', 'buttons', 'drag', 'dblclick']);
      spec.rows = N;
      if (scenario === 'filter') {
        spec.rows = f.int(6, 8);
        if (!spec.targets.some((t) => items.indexOf(t) >= spec.rows)) return null;
        const cap = Math.min(spec.rows, 5);
        spec.queries = Object.fromEntries(items.map((x) => [x, queryFor(items, x, cap)]));
      }
      return spec;
    }
    if (scenario === 'move' && rng.bool(0.3) && N >= 6) {
      const e = rng.int(1, Math.min(3, N - 3));
      spec.except = rng.sample(items, e).sort((a, b) => items.indexOf(a) - items.indexOf(b));
      spec.targets = items.filter((x) => !spec.except.includes(x));
      spec.goal = 'except';
    } else if (scenario === 'ordered') {
      spec.targets = rng.sample(items, base.ood ? rng.int(5, 6) : rng.int(3, 4));
      spec.goal = 'order';
    } else {
      const k = scenario === 'filter' ? (base.ood ? rng.int(3, 5) : rng.int(2, 4)) : base.ood ? rng.int(3, 6) : rng.int(2, Math.min(4, N - 2));
      spec.targets = rng.sample(items, k).sort((a, b) => items.indexOf(a) - items.indexOf(b));
      spec.goal = 'names';
    }
    spec.route = rng.pick(['buttons', 'buttons', 'drag', 'dblclick']);
    spec.rows = N;
    if (scenario === 'filter') {
      spec.rows = base.ood ? rng.int(6, 8) : rng.int(8, 10);
      // At least one target must start below the visible rows of the left list.
      if (!spec.targets.some((t) => items.indexOf(t) >= spec.rows)) return null;
      const cap = Math.min(spec.rows, 5);
      spec.queries = Object.fromEntries(items.map((x) => [x, queryFor(items, x, cap)]));
    }
    return spec;
  }

  function initModel(spec, rng) {
    const mode = spec.startMode || 'off';
    const T = spec.targets;
    const others = spec.items.filter((x) => !T.includes(x));
    const near = nearOf(spec, others);
    const m = { right: [], selL: [], selR: [], anchor: { L: '', R: '' }, qL: '', qR: '' };
    const inOrder = (xs) => spec.items.filter((x) => xs.includes(x));
    if (spec.judge) return LOCKED.includes(spec.scenario) ? { ...m, moves: 0 } : m; // untouched
    if (mode === 'solved') return { ...m, right: T.slice() };
    if (spec.scenario === 'multi') return { ...m, moves: 0 };
    if (spec.scenario === 'range' || spec.scenario === 'rangemix') return { ...m, right: spec.side === 'R' ? spec.items.slice() : [], moves: 0 };
    if (spec.scenario === 'ordered') {
      if (mode === 'partial') {
        const c = rng.int(1, T.length - 1);
        return { ...m, right: T.slice(0, c) };
      }
      if (mode === 'wrong') {
        let r = rng.shuffle(T);
        for (let t = 0; t < 10 && r.join() === T.join(); t++) r = rng.shuffle(T);
        if (r.join() === T.join()) r = T.slice().reverse();
        return { ...m, right: r };
      }
      const c = rng.int(0, T.length);
      const r = rng.shuffle(rng.sample(T, c).concat(rng.sample(others, rng.int(0, 2))));
      return { ...m, right: r };
    }
    if (spec.goal === 'except') {
      if (mode === 'partial') return { ...m, right: inOrder(rng.sample(T, rng.int(1, Math.max(1, T.length - 2)))) };
      if (mode === 'wrong') return { ...m, right: inOrder(spec.except.concat(rng.sample(T, rng.int(0, Math.floor(T.length / 2))))) };
      return { ...m, right: inOrder(rng.sample(T, rng.int(0, Math.floor(T.length / 3))).concat(rng.bool(0.4) ? [rng.pick(spec.except)] : [])) };
    }
    if (mode === 'partial') {
      const c = T.length > 1 ? rng.int(1, T.length - 1) : 0;
      return { ...m, right: inOrder(rng.sample(T, c)) };
    }
    if (mode === 'wrong') {
      const pool = near.length ? near : others;
      const w = rng.sample(pool, rng.int(1, Math.min(3, pool.length)));
      return { ...m, right: rng.shuffle(w.concat(rng.sample(T, rng.int(0, T.length - 1)))) };
    }
    const w = rng.sample(others, rng.int(0, Math.min(2, others.length)));
    return { ...m, right: rng.shuffle(w.concat(rng.sample(T, rng.int(0, Math.max(0, T.length - 2))))) };
  }

  function errorOf(model, spec) {
    if (spec.judge) return model.right.length ? 1 : 0; // ambiguous / impossible: nothing may be moved
    const R = new Set(model.right);
    const T = new Set(spec.targets);
    let e = 0;
    for (const x of R) if (!T.has(x)) e++;
    for (const x of T) if (!R.has(x)) e++;
    if (spec.scenario === 'ordered') spec.targets.forEach((x, i) => { if (model.right[i] !== x) e++; });
    // One-transfer scenarios (multi, range, rangemix): before the transfer, selecting the right items is the only
    // progress there can be, worth up to half the error; a wrong item selected costs twice a missing one, so selecting
    // the whole list earns nothing.
    if (model.moves === 0 && e > 0) {
      const want = new Set(spec.moveSet || spec.targets);
      const sel = model[selKey(spec.side === 'R' ? 'R' : 'L')];
      const hit = sel.filter((x) => want.has(x)).length;
      e *= 0.5 + 0.5 * Math.min(1, (want.size - hit + 2 * (sel.length - hit)) / want.size);
    }
    return e;
  }

  // ---------------------------------------------------------------- plan

  const setEq = (a, b) => a.length === b.length && a.every((x) => b.includes(x));

  // Select exactly `want` (visible rows of side, in row order) and then click `btn`; one step at a time.
  function selectThen(model, spec, side, want, btn) {
    const cur = model[selKey(side)];
    if (setEq(cur, want)) return { click: { btn } };
    if (!cur.length || cur.some((x) => !want.includes(x))) return { click: { item: want[0] } };
    const rows = shown(spec, model, side).rows;
    const a = model.anchor[side];
    if (a && want.length > 2) {
      const ia = rows.indexOf(a);
      const idx = want.map((x) => rows.indexOf(x));
      const lo = Math.min(...idx);
      const hi = Math.max(...idx);
      if (ia === lo && hi - lo + 1 === want.length) return { click: { item: rows[hi] }, modifiers: ['Shift'] };
    }
    return { click: { item: want.find((x) => !cur.includes(x)) }, modifiers: ['Control'] };
  }

  // One move step for the items `todo` on side `from` (they belong on the other side).
  function moveStep(model, spec, from, todo) {
    const rows = shown(spec, model, from).rows;
    const vis = rows.filter((x) => todo.includes(x));
    if (!vis.length) {
      // filter: reveal the first item by typing its query.
      const x = todo[0];
      return { type: [{ filter: from }, spec.queries[x]] };
    }
    if (spec.route === 'drag') return { drag: [{ item: vis[0] }, { list: other(from) }] };
    if (spec.route === 'dblclick') return { dblclick: { item: vis[0] } };
    return selectThen(model, spec, from, vis, from === 'L' ? 'R' : 'L');
  }

  // range / rangemix: click the run's first item, Shift-click its last, then Ctrl-click single items in or out until the
  // selection is `want`; start over when Ctrl-clicking every difference would take longer.
  function rangeSelect(model, spec, side, want) {
    const rows = shown(spec, model, side).rows;
    const cur = model[selKey(side)];
    const { a, b } = spec.range;
    const ia = rows.indexOf(a);
    const ib = rows.indexOf(b);
    const inRun = want.filter((x) => rows.indexOf(x) >= ia && rows.indexOf(x) <= ib);
    const idx = inRun.map((x) => rows.indexOf(x));
    const lo = inRun.length >= 3 ? rows[Math.min(...idx)] : null;
    const hi = lo ? rows[Math.max(...idx)] : null;
    const span = lo ? rows.slice(rows.indexOf(lo), rows.indexOf(hi) + 1) : [];
    const extras = cur.filter((x) => !want.includes(x));
    const missing = want.filter((x) => !cur.includes(x));
    if (lo && cur.length === 1 && cur[0] === lo) return model.anchor[side] === lo ? { click: { item: hi }, modifiers: ['Shift'] } : { click: { item: lo } };
    const restart = lo ? 2 + span.filter((x) => !want.includes(x)).length + want.filter((x) => !span.includes(x)).length : want.length;
    if (cur.length && extras.length + missing.length <= restart) {
      return missing.length ? { click: { item: missing[0] }, modifiers: ['Control'] } : { click: { item: extras[0] }, modifiers: ['Control'] };
    }
    return { click: { item: lo || want[0] } };
  }

  function planOf(model, spec) {
    if (errorOf(model, spec) === 0) return null;
    const T = spec.targets;
    if (spec.scenario === 'range' || spec.scenario === 'rangemix') {
      // select the whole set (a Shift run, Ctrl corrections), then the one transfer
      const side = spec.side;
      if (!setEq(model[selKey(side)], spec.moveSet)) return rangeSelect(model, spec, side, spec.moveSet);
      return spec.route === 'drag' ? { drag: [{ item: spec.moveSet[0] }, { list: other(side) }] } : { click: { btn: side === 'L' ? 'R' : 'L' } };
    }
    if (spec.scenario === 'multi') {
      // select the whole set (Shift range / Ctrl toggles), then one transfer
      if (!setEq(model.selL, T)) return selectThen(model, spec, 'L', T, 'R');
      return spec.route === 'drag' ? { drag: [{ item: T[0] }, { list: 'R' }] } : { click: { btn: 'R' } };
    }
    const left = leftOf(spec, model);
    const extra = model.right.filter((x) => !T.includes(x));
    const miss = T.filter((x) => !model.right.includes(x));
    if (spec.route === 'buttons' && spec.scenario !== 'filter') {
      // Bulk shortcuts when they are shorter than moving items one selection at a time.
      const cost = (n) => (n ? n + 1 : 0);
      const direct = cost(extra.length) + cost(miss.length);
      const leftNot = left.filter((x) => !T.includes(x));
      if (miss.length && left.length && spec.scenario !== 'ordered' && 1 + cost(leftNot.length + extra.length) < direct) return { click: { btn: 'RR' } };
      if (extra.length && 1 + cost(T.length) < direct) return { click: { btn: 'LL' } };
    }
    if (extra.length) return moveStep(model, spec, 'R', extra);
    if (miss.length) {
      // ordered: one at a time in goal order, so they arrive in order.
      const todo = spec.scenario === 'ordered' ? [miss[0]] : miss;
      if (spec.scenario === 'ordered' && spec.route === 'buttons') return selectThen(model, spec, 'L', todo, 'R');
      return moveStep(model, spec, 'L', todo);
    }
    // ordered: membership is right, fix the first wrong position.
    const i = T.findIndex((x, k) => model.right[k] !== x);
    const x = T[i];
    if (spec.route === 'drag') return { drag: [{ item: x }, { slot: i }] };
    if (!setEq(model.selR, [x])) return { click: { item: x } };
    return { click: { btn: model.right.indexOf(x) > i ? 'up' : 'down' } };
  }

  function solveOf(spec, model) {
    if (spec.judge) return { ...model, right: [], selL: [], selR: [] }; // nothing to do
    return { ...model, right: spec.targets.slice(), selL: [], selR: [] };
  }

  // Model-space effect of a plan step (what the base widget does through apply()); used by selftest.js through lib.
  function simulate(model, spec, step) {
    const sideOf = (x) => (model.right.includes(x) ? 'R' : 'L');
    if (step.type) return apply(model, spec, { query: [step.type[0].filter, step.type[1]] });
    if (step.dblclick) {
      const x = step.dblclick.item;
      const s = sideOf(x);
      const m = apply(apply(model, spec, { sel: [s, x, ''] }), spec, { sel: [s, x, ''] });
      return apply(m, spec, { dbl: [s, x] });
    }
    if (step.drag) {
      const x = step.drag[0].item;
      const to = step.drag[1];
      const s = sideOf(x);
      if (to.slot !== undefined) {
        const j = model.right.indexOf(x);
        const at = to.slot < j ? to.slot : to.slot + 1;
        return apply(model, spec, { drop: [s, x, 'R', at] });
      }
      return apply(model, spec, { drop: [s, x, to.list, undefined] });
    }
    const c = step.click;
    if (c.btn) return apply(model, spec, { btn: c.btn });
    const mods = step.modifiers || [];
    const mod = mods.includes('Shift') ? 'shift' : mods.includes('Control') ? 'ctrl' : '';
    return apply(model, spec, { sel: [sideOf(c.item), c.item, mod] });
  }

  // ---------------------------------------------------------------- instructions

  const T = {
    names: ['Move {xs} to {R}; nothing else should be there.', 'Make {R} contain exactly {xs}.',
      'Put {xs} in {R} and take everything else out of it.', '{R} should list only {xs}.',
      'Set {R} to {xs}, and nothing more.', 'Only {xs} should end up in {R}.', '{Verb}, and nothing else.',
      'For {R}, use {xs} and no other items.', 'Fill {R} with {xs}; exclude all else.',
      'At the end, {R} must contain exactly {xs}.', 'In {R}, include {xs} and no others.'],
    except: ['Move every {noun} except {xs} to {R}.', 'Everything except {xs} should end up in {R}.',
      '{R} should hold all the {plural} but {xs}.', 'Put all {plural} in {R}, leaving out {xs}.',
      'Add all {plural} to {R} apart from {xs}.',
      '{R} must hold all items other than {xs}.',
      'With {xs} omitted, fill {R} with all else.',
      'All {plural} belong in {R}, excluding {xs}.',
      'Every {noun} goes in {R} except for {xs}.',
      'Use {R} for everything other than {xs}.'],
    order: ['Make {R} list {seq}, in exactly that order.', 'Set {R} to {seq}, top to bottom, and nothing else.',
      '{R} should show {seq} in this order.', 'Arrange {R} as {seq}; no other {plural}.',
      'Put {seq} in {R}, in that order, with nothing else.',
      'Follow {seq} exactly in {R}, with no extras.',
      'Only {seq} belong in {R}, in the order shown.'],
  };

  function instructionOf(spec, rng) {
    const R = I.alias(rng, spec.rightLabel, spec.rightAliases);
    const Rq = R === spec.rightLabel ? `the ${quote(R)} list` : /^the /.test(R) ? R : `the ${R} list`;
    const fill = (key, vars) => I.fill(I.pick(rng, T[key], spec.isplit), vars);
    if (spec.judge) {
      const j = spec.judge;
      const core = j.ordered
        ? fill('order', { seq: listText(j.names, quote), R: Rq, plural: spec.plural })
        : I.fill(I.pick(rng, [
          'Move {xs} to {R}.', 'Put {xs} in {R}.', 'Add {xs} to {R}.', 'Transfer {xs} into {R}.',
          'Make {R} hold {xs}.', 'Have {xs} in {R}.', 'Include {xs} in {R}.', '{R} is to hold {xs}.'
        ], spec.isplit), { xs: listText(j.names, quote), R: Rq });
      return I.say(rng, I.ucFirst(core), { isplit: spec.isplit, terse: `${spec.rightLabel}: ${j.names.join(', ')}` });
    }
    if (spec.scenario === 'range' || spec.scenario === 'rangemix') {
      const { a, b, skip, plus } = spec.range;
      const mix = spec.scenario === 'rangemix';
      const vars = { a: quote(a), b: quote(b), skip: listText(skip, quote), plus: listText(plus, quote), plural: spec.plural, k: spec.moveSet.length };
      let sel = I.fill(I.pick(rng, mix
        ? ['the {plural} from {a} down to {b}, except {skip}', '{a} through {b} (as listed), leaving out {skip}', 'every {noun} from {a} to {b} apart from {skip}',
          'the run {a} … {b} without {skip}', 'the {plural} between {a} and {b} (both included) but not {skip}',
          'the full span {a} through {b}, excluding {skip}', 'the {plural} spanning {a} through {b} minus {skip}',
          'the {plural} in {a} … {b}, excluding {skip}']
        : ['the {k} {plural} from {a} down to {b}', '{a}, {b} and everything listed between them', 'the block of {plural} starting at {a} and ending at {b}',
          'everything from {a} through {b}', 'the consecutive {plural} {a} … {b}',
          'the span {a} through {b}, both ends included', '{a} and {b}, with all entries in between',
          'the {k} {plural} spanning {a} to {b}', 'the run bounded by {a} and {b}, inclusive'], spec.isplit), { ...vars, noun: spec.noun });
      if (plus.length) sel += I.fill(I.pick(rng, [', and also {plus}', ', plus {plus}', ' as well as {plus}', ', together with {plus}'], spec.isplit), vars);
      const Lq = `the ${quote(spec.leftLabel)} list`;
      const verb = spec.side === 'L'
        ? [
          'Move {sel} to {R}.', 'Transfer {sel} into {R}.', 'Put {sel} in {R}.', 'Add {sel} to {R}.',
          'Send {sel} over to {R}.', '{R} is to get {sel}.', 'Let {sel} go into {R}.', '{sel} must join {R}.',
          'Use {R} for {sel}.', 'Let {R} take {sel}.'
        ]
        : [
          'Move {sel} back out of {R}.', 'Take {sel} out of {R}, back to {L}.', 'Send {sel} back to {L}.',
          'Remove {sel} from {R}.', 'Put {sel} back in {L}.', '{L} is where {sel} should return.',
          'Return {sel} to {L}.', 'Let {sel} go back to {L}.', 'Transfer {sel} from {R} to {L}.',
          'Let {sel} leave {R}.'
        ];
      const once = I.pick(rng, ['The list accepts only one transfer, so select them all first.', 'You get a single transfer, so pick everything before moving.', 'It only lets you transfer once.'], spec.isplit);
      const core = I.fill(I.pick(rng, verb, spec.isplit), { sel, R: Rq, L: Lq });
      return I.say(rng, `${I.ucFirst(core)} ${once}`, { isplit: spec.isplit,
        terse: `${spec.side === 'L' ? spec.rightLabel : spec.leftLabel}: ${a} … ${b}${skip.length ? ` except ${skip.join(', ')}` : ''}${plus.length ? ` + ${plus.join(', ')}` : ''} (one transfer)` });
    }
    if (spec.scenario === 'multi') {
      const xs = listText(spec.targets, quote);
      const once = I.pick(rng, ['The list accepts only one transfer, so select them all first.', 'You get a single transfer, so pick everything before moving.', 'It only lets you transfer once.'], spec.isplit);
      const core = spec.multi === 'range'
        ? I.pick(rng, [`Move the ${spec.targets.length} ${spec.plural} from ${quote(spec.targets[0])} down to ${quote(spec.targets[spec.targets.length - 1])} to ${Rq}.`,
          `Transfer ${quote(spec.targets[0])} through ${quote(spec.targets[spec.targets.length - 1])} (that block of ${spec.targets.length}) to ${Rq}.`], spec.isplit)
        : I.pick(rng, [`Move ${xs} to ${Rq}.`, `Make ${Rq} hold ${xs}.`, `Transfer ${xs} into ${Rq}.`], spec.isplit);
      return I.say(rng, `${core} ${once}`, { isplit: spec.isplit, terse: `${spec.rightLabel}: ${spec.targets.join(', ')} (one transfer)` });
    }
    let core;
    let terse;
    let steps;
    if (spec.goal === 'except') {
      core = fill('except', { xs: listText(spec.except, quote), R: Rq, noun: spec.noun, plural: spec.plural });
      terse = `${spec.rightLabel}: all except ${spec.except.join(', ')}`;
    } else if (spec.goal === 'order') {
      const style = rng.int(0, 2);
      const seq = style === 0 ? listText(spec.targets, quote)
        : style === 1 ? spec.targets.map(quote).join(', then ')
          : spec.targets.map((x, i) => `${i + 1}. ${x}`).join(' ');
      core = fill('order', { seq, R: Rq, plural: spec.plural });
      terse = `${spec.rightLabel}: ${spec.targets.join(' > ')}`;
      steps = [`move ${listText(spec.targets, quote)} to ${Rq}`, `order them as ${spec.targets.map(quote).join(', ')}`];
    } else {
      const verb = I.fill(rng.pick(CONTEXTS[spec.context].verb), { xs: listText(spec.targets, quote), R: spec.rightLabel });
      core = fill('names', { xs: listText(spec.targets, quote), R: Rq, Verb: verb });
      terse = `${spec.rightLabel}: ${spec.targets.join(', ')}`;
    }
    core = I.ucFirst(core);
    return I.say(rng, core, { isplit: spec.isplit, terse, steps });
  }

  // ---------------------------------------------------------------- judge modes

  const QUAL = { team: [['Sales', 'Support'], ['Berlin', 'Austin']], columns: [['Billing', 'Shipping']], permissions: [['Admin', 'Viewer']],
    countries: [['EU zone', 'US zone']], products: [['Blue', 'Red']], departments: [['Berlin', 'Austin']], cities: [['North', 'South']] };
  const ABSENT = { team: ['Quentin Aldermere', 'Marisol Venn'], columns: ['Loyalty tier', 'Churn score'], permissions: ['Manage satellites', 'Approve tides'],
    countries: ['Vandermere', 'Norland'], products: ['Quantum Toaster 3000', 'Holo Desk Globe'], departments: ['Time Travel Division', 'Moon Logistics'],
    cities: ['Cloudmere', 'Stonehaven'] };

  // spec.judge for ambiguous / impossible: the named items (2-3 of the list) and what is wrong with one of them. The page keeps
  // its layout (ambiguous adds one item to the two lists' common pool).
  function judgeOf(jr, spec, mode) {
    spec.startMode = 'off';
    const ordered = spec.scenario === 'ordered';
    const k = ordered ? 3 : jr.int(2, 3);
    const t = jr.pick(spec.items);
    const names = [t, ...jr.sample(spec.items.filter((x) => x !== t), k - 1)];
    if (!ordered) names.sort((x, y) => spec.items.indexOf(x) - spec.items.indexOf(y));
    else for (let i = names.length - 1; i > 0; i--) { const j = jr.int(0, i); [names[i], names[j]] = [names[j], names[i]]; }
    if (mode === 'impossible') {
      const have = new Set(spec.items.map(lc));
      const fresh = poolOf(jr.fork('absent'), spec.context, spec.items.length + 8, spec.csplit).concat(ABSENT[spec.context]).filter((x) => !have.has(lc(x)));
      if (!fresh.length) return null;
      const a = jr.pick(fresh);
      const out = names.map((x) => (x === t ? a : x));
      spec.targets = out.filter((x) => spec.items.includes(x));
      return { mode, what: [a], names: out, ordered, message: `I can't do that: there is no ${spec.noun} called "${a}" on this page.` };
    }
    const [qa, qb] = jr.pick(QUAL[spec.context]);
    const ta = `${t} (${qa})`;
    const tb = `${t} (${qb})`;
    if (spec.items.some((x) => x === ta || x === tb)) return null;
    spec.items = spec.items.filter((x) => x !== t).concat([ta, tb]).sort(alpha);
    spec.targets = names.map((x) => (x === t ? ta : x));
    if (spec.queries) {
      const cap = Math.min(spec.rows, 5);
      spec.queries = Object.fromEntries(spec.items.map((x) => [x, queryFor(spec.items, x, cap)]));
    }
    // the two entries are told apart by the full name; the bare qualifier counts too when no other entry carries that word
    const words = (x) => lc(x).split(/[^a-z0-9]+/).filter(Boolean);
    const alt = (q, other) => (spec.items.every((x) => x === ta || x === tb || !words(x).includes(lc(q))) && lc(q) !== lc(other) ? [q] : []);
    return { mode, cands: [[ta, ...alt(qa, qb)], [tb, ...alt(qb, qa)]], names, ordered,
      others: spec.items.filter((x) => x !== ta && x !== tb).map((x) => [x]),
      message: `Which ${t} do you mean: "${ta}" or "${tb}"?` };
  }

  // ---------------------------------------------------------------- hooks: facts, silent, retarget

  function factsOf(model, spec) {
    const nL = leftOf(spec, model).length;
    const nR = model.right.length;
    const out = [
      { label: spec.rightLabel, value: `(${nR})`, aliases: [String(nR), `${nR} items`], labels: [`${spec.rightLabel} count`] },
      { label: spec.leftLabel, value: `(${nL})`, aliases: [String(nL), `${nL} items`], labels: [`${spec.leftLabel} count`] },
    ];
    if (model.moves >= 1) out.push({ label: 'Status', value: 'Transfer done', aliases: ['Transfer done. This list accepts one transfer.'] });
    return out;
  }

  // After a transfer: one moved item silently stayed (or one item moved back is back on the right); ordered: a swap.
  function silentOf(next, prev, spec, rng) {
    if (spec.judge || next.moves !== undefined) return null; // the locked scenarios cannot repeat their one transfer
    const m = cloneModel(next);
    const added = next.right.filter((x) => !prev.right.includes(x));
    const removed = prev.right.filter((x) => !next.right.includes(x));
    if (added.length) {
      const x = rng.pick(added);
      m.right = m.right.filter((y) => y !== x);
    } else if (removed.length) {
      const x = rng.pick(removed);
      m.right.splice(Math.min(prev.right.indexOf(x), m.right.length), 0, x);
    } else if (spec.scenario === 'ordered' && next.right.length >= 2) {
      const i = rng.int(0, next.right.length - 2);
      [m.right[i], m.right[i + 1]] = [m.right[i + 1], m.right[i]];
    } else return null;
    return errorOf(m, spec) > 0 ? m : null;
  }

  // A new goal of the same size over the same items. Not for the locked scenarios (their one transfer may be spent).
  function retargetOf(spec, model, rng) {
    if (spec.judge || LOCKED.includes(spec.scenario)) return null;
    const n = JSON.parse(JSON.stringify(spec));
    const items = spec.items;
    const same = (xs) => xs.length === model.right.length && xs.every((x) => model.right.includes(x));
    for (let t = 0; t < 20; t++) {
      if (spec.goal === 'except') {
        const except = rng.sample(items, spec.except.length).sort((a, b) => items.indexOf(a) - items.indexOf(b));
        const targets = items.filter((x) => !except.includes(x));
        if (except.join() === spec.except.join() || same(targets)) continue;
        n.except = except;
        n.targets = targets;
        return n;
      }
      let targets = rng.sample(items, spec.targets.length);
      if (spec.scenario !== 'ordered') targets.sort((a, b) => items.indexOf(a) - items.indexOf(b));
      if (targets.join() === spec.targets.join() || (spec.scenario !== 'ordered' && same(targets)) || (spec.scenario === 'ordered' && targets.join() === model.right.join())) continue;
      n.targets = targets;
      return n;
    }
    return null;
  }

  // ---------------------------------------------------------------- task

  const SCENARIOS = ['move', 'filter', 'ordered', 'multi', 'range', 'rangemix'];
  const LOCKED = ['multi', 'range', 'rangemix']; // the page accepts one transfer only

  env.task({
    name: 'transfer-items',
    scenarios: SCENARIOS,
    startModes: ['off', 'partial', 'wrong', 'solved'],
    judgeModes: ['ambiguous', 'impossible'],
    inputs: (spec) => (spec && spec.scenario === 'filter' ? ['pointer', 'keyboard'] : ['pointer']),

    helpers: { apply, leftOf, shown, matches },
    lib: { simulate },

    sample(rng, opts) {
      const scenario = opts.scenario || rng.pick(opts.scenarios && opts.scenarios.length ? opts.scenarios : this.scenarios);
      for (let t = 0; t < 30; t++) {
        const spec = sampleSpec(rng.fork(`try${t}`), scenario, opts);
        if (!spec) continue;
        if (this.judgeModes.includes(opts.judge)) {
          const sm = spec.startMode;
          const j = judgeOf(rng.fork('judge'), spec, opts.judge);
          if (j) spec.judge = j;
          else spec.startMode = sm;
        }
        return spec;
      }
      throw new Error(`transfer-items: could not sample ${scenario}`);
    },

    init: initModel,
    error: errorOf,
    tolerance(spec) {
      return { tau: 0, sigma: Math.max(1, spec.targets.length / 2), minInitialError: 0.5 };
    },
    instruction: instructionOf,
    plan: planOf,
    solve: solveOf,
    facts: factsOf,
    silent: silentOf,
    retarget: retargetOf,
    // preempt=cancel: every item by its name (value: its place in the right list, -1 while it is in the left one)
    parts: (model, spec) => spec.items.map((x) => ({ name: x, value: model.right.indexOf(x) })),
    ended: (m, spec) => (spec.judge && m.right.length ? 'wrong-choice' : null),
  });
})();
