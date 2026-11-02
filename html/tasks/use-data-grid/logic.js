/*
 * use-data-grid: sort, filter, page, select, edit and bulk-act on rows of a data grid.
 * An enterprise data grid (orders, employees, inventory or invoices). No single MiniWoB
 * counterpart (closest: social-media / email-inbox list actions). Teaches
 * compound navigation in a grid: header sorting, quick search and column filters, pagination, checkbox
 * selection with Shift-click ranges and select-all, toolbar bulk actions with confirm + Undo, column resize
 * and column reorder by dragging headers.
 *
 * scenarios
 *   sort      sort by a column, ascending or descending. A header click cycles none -> asc -> desc -> none;
 *             the header's column menu (⋮) has Sort ascending / Sort descending / Clear sort. Goals are
 *             direct ("by Amount, descending") or indirect ("newest first", "most expensive first").
 *   filter    show only the rows matching a predicate on one categorical column (one or two values). Two
 *             routes reach the same row set: the quick search box (single value; sampling guarantees the
 *             value occurs in no other column) or the column's filter menu (funnel: value checkboxes,
 *             Select all, Apply, Clear).
 *   paginate  the grid is paged (pager: Prev, numbered pages with ellipses, Next); find one row (by id,
 *             by name or "the row with the largest X") and tick its checkbox. Selection persists across
 *             pages. For extreme goals sorting the column first is a valid route (the oracle does it in
 *             route 'sort').
 *   select    one page; select a set of rows with the row checkboxes: a contiguous range (click, then
 *             Shift-click), all but one or two (select-all, then untick), rows matching a value, or all.
 *   bulk      one page; select the rows matching a predicate and run a toolbar bulk action on them: Mark
 *             as <status> (menu), Archive, or Delete (confirm dialog). Every bulk action pushes an Undo
 *             entry (toolbar Undo button and an Undo toast). Applying an action to a row outside the goal
 *             set, or the wrong action, is a wrong final choice (R4): with spec.recoverable the first one
 *             leaves an Undo path (error carries the penalty until undone) and the second ends the
 *             episode ('wrong-bulk'); without it the first ends the episode.
 *   multirow  one page of 6-12 rows, row checkboxes hidden: rows are picked by clicking them (a plain click
 *             REPLACES the selection, Ctrl-click toggles, Shift-click selects the range from the anchor), a
 *             contiguous block ("from A down to B", Shift) or a scattered set (Ctrl) of 3-5 rows, then ONE toolbar
 *             bulk action (Mark as <status>, Archive or Delete, as in bulk). Same wrong-action rule as bulk
 *             ('wrong-bulk'); a second bulk operation while an earlier one is not undone ends the episode
 *             ('one-batch').
 *   cellEdit  double-click a cell to edit it in place (a text or number cell that is not the row's name or
 *             key column), type the new value, Enter (blur commits, Escape cancels). One page, default order.
 *             Needs keyboard input.
 *   resize    drag the right edge of a column header to a width: explicit px, "as wide as <col>", or
 *             double / half its current width. With spec.keys the edge is a focusable separator that
 *             ArrowLeft / ArrowRight move by 10 px (the oracle clicks it, then uses keys).
 *   reorder   drag a column header to a new position: make it first / last, or put it right after /
 *             before another column. A header click without movement still sorts (harmless here).
 *
 * spec   { scenario, startMode, isplit, csplit, ood, keys, route, recoverable (bulk), domain, title,
 *          entity, entities, locale, currency, cols: [{ id, label, aliases[], type, w }], rows: [{ id, c }],
 *          pageSize, statusCol (id | null), plus per scenario:
 *   sort      goal: { col, dir }                       (dir 'asc' | 'desc'), phrase (indirect wording)
 *   filter    goal: { col, values[] }, target: [row ids]
 *   paginate  goal: { row, how: 'key' | 'name' | 'max' | 'min', col }   route 'pages' | 'sort'
 *   select    goal: { mode: 'range' | 'allbut' | 'match' | 'all', ... }, target: [row ids]
 *   bulk      goal: { action: 'status' | 'archive' | 'delete', value, col, values | names }, target
 *   multirow  goal: { action, how: 'rows', kind: 'range' | 'scatter', names[], value? }, target: [row ids in row order]
 *   cellEdit  goal: { row, col, text }                (text: the new cell text; num cells compare as text)
 *   resize    goal: { col, width, mode: 'px' | 'match' | 'double' | 'half', ref }
 *   reorder   goal: { col, mode: 'first' | 'last' | 'after' | 'before', ref }, order: [target col order]
 *          types: 'id' | 'text' | 'email' | 'cat' | 'num' | 'money' | 'date' (ISO yyyy-mm-dd values)
 * model  { sort: null | { col, dir }, query, filters: { col: [values] }, page, selected: [ids], anchor,
 *          widths: { col: px }, order: [col ids], menu: null | { col, kind: 'col' | 'filter', draft },
 *          markMenu, confirm: null | { action, value }, status: { id: value }, removed: { id: action },
 *          history: [{ action, value, ids, prev }], toast (bool), wrongs, focus (widget-mirrored, unscored),
 *          cellEdit only: edits: { rowId: { col: value } }, editing: null | { row, col, draft } }
 *
 * error
 *   sort      0 exact; 0.5 right column, wrong direction; 1 otherwise              tau 0
 *   filter    1 - Jaccard(rows passing the search + filters, goal rows)            tau 0
 *   paginate  goal row selected: 0.6 * (1 - Jaccard(selected, {row})); else 0.6 when the row is on the
 *             current page, 1 otherwise                                            tau 0
 *   select    1 - Jaccard(selected, goal rows)                                     tau 0
 *   multirow  as bulk
 *   cellEdit  edit distance(cell text, goal text) / max length + 0.5 if another cell was edited, capped at 1
 *   bulk      1 - |goal rows with the goal action applied| / |goal rows ∪ rows changed in any way|
 *             (bulk and multirow, before any action: 0.5 + 0.5 x min(1, (goal rows not ticked + 2 x other rows ticked)
 *             / |goal rows|), the selection stage)
 *   resize    |width - goal width| in px                                           tau 6 (px) / 8% (relative)
 *   reorder   normalized Kendall tau distance between column orders                tau 0
 *
 * start modes  off, partial, wrong, solved (sort: other direction / other column; filter: an extra value
 *   or a different value; paginate: on the right page / a wrong row ticked; select: half the rows / extra
 *   rows; bulk: some goal rows done / a wrong action applied with Undo available (does not count towards
 *   the R4 limit); resize: halfway / the wrong way; reorder: partway / another column moved).
 * levels easy / medium: fewer rows (e.g. sort 6-9 / 8-16, paginate 12-18 / 16-28, select / bulk 5-7 / 6-8,
 *        multirow 6-8 / 7-10, cellEdit 4-6 / 5-8), fewer columns (4-5 / 5), filter: one value on easy, bulk: no
 *        delete (no confirm dialog) on easy, resize tolerance x2 / x1.5, multirow: easy is a Shift range of 3 rows,
 *        medium a range or scatter of 3. Normal draws exactly what it always did.
 * ood    more rows (sort/filter 30-60, paginate 50-90 = up to 12 pages), more columns (7-8), select/bulk
 *        11-12 rows on the page, more filter values.
 * inputs pointer; + keyboard where the quick search box is shown (filter, paginate) and in spec.keys episodes
 *        (25% of sort / resize: Enter on the focused header; arrow keys on the focused column edge).
 *
 * plan targets (widget locate)
 *   { header: col }  { menuBtn: col }  { funnel: col }  { edge: col }  { edgeAt: [col, width] }
 *   { slot: k, col } (reorder: insertion point k among the other columns while dragging col)
 *   { menuItem: 'asc' | 'desc' | 'clear' }  { filterOpt: value }  { filterAll: true }  { filterApply: true }
 *   { search: true }  { clearFilters: true }  { row: id } (checkbox)  { all: true } (header checkbox)
 *   { clearSel: true }  { page: p }  { pager: 'next' | 'prev' }  { bulk: 'status' | 'archive' | 'delete' }
 *   { statusOpt: value }  { confirm: 'ok' | 'cancel' }  { undo: true }  { blank: true } (neutral spot)
 *   { rowBody: id }  a row's body (clicked with Shift / Control in multirow)  { cell: [rowId, col] }  { cellInput: true }
 * plan steps: click (+ Shift / Control modifiers for ranges), dblclick (cellEdit), drag (edge, header), type (search,
 * cell field), key (Enter, arrows).
 *
 * Files (files: [...] below, loaded in order after this one): the shared scenarios/edit.js, admin.js and rows.js (code several
 * scenarios use, added to lib), then scenarios/<scenario>.js, one env.scenario('use-data-grid', {...}) per scenario with its goal, start,
 * solve, error, plan and wording (hook list above the dispatch section). This file holds the header, the grid data and model
 * transitions the scenarios share (lib) and the dispatch.
 *
 * Self-test: selftest.js (loaded only by the checker and Node tests).
 * Helpers (widget API, env.taskDef.helpers):
 *   searchable(spec): whether the grid offers quick search or keyboard controls.
 *   pageSizeOf(m, spec): current page size.
 *   setPageSize(m, spec, size): change page size.
 *   statusOptions(spec): available statuses.
 *   visibleRows(m, spec): filtered rows in sort order.
 *   pageRows(m, spec): rows on the current page or window.
 *   pageCount(m, spec): number of pages.
 *   pagerItems(page, pages): page buttons and ellipses.
 *   cellText(spec, row, col, m): formatted cell text.
 *   valueOf(m, spec, row, col): current cell value.
 *   distinct(spec, col, m): distinct values in a column.
 *   rowClick(m, spec, id, modifiers): row-body selection with Shift / Control.
 *   startEdit(m, spec, row, col): open the cell editor.
 *   setDraftCell(m, text): change the editor draft.
 *   commitEdit(m, spec): save the cell draft.
 *   cancelEdit(m): discard the cell draft.
 *   headerClick(m, spec, col): cycle column sorting.
 *   setSort(m, col, dir): set or clear sorting.
 *   toggleRow(m, spec, id, shift): toggle a row or range.
 *   toggleAll(m, spec): toggle every row on the page.
 *   clearSel(m): clear selected rows.
 *   setQuery(m, query): change the quick search.
 *   openMenu(m, spec, col, kind): open a column or filter menu.
 *   closeMenus(m): close open menus.
 *   toggleDraft(m, value): toggle a filter draft value.
 *   draftAll(m, spec): toggle all filter draft values.
 *   applyFilter(m, spec): apply the filter draft.
 *   clearFilter(m, col): clear one column filter.
 *   clearFilters(m): clear search and filters.
 *   gotoPage(m, spec, page): change page within bounds.
 *   openMark(m): toggle the status menu.
 *   askBulk(m, spec, action, value): prepare or apply a bulk action.
 *   runBulk(m, spec, action, value): apply a bulk action and save Undo history.
 *   cancelConfirm(m): dismiss bulk confirmation.
 *   undo(m, spec): undo the latest bulk action.
 *   setWidth(m, col, width): clamp and round a column width.
 *   nudgeWidth(m, col, delta): adjust column width.
 *   moveCol(m, col, slot): move a column to an insertion slot.
 *   dismissToast(m): hide the Undo toast.
 *   setFocus(m, focus): mirror header or edge focus.
 *
 * A1 scenarios: crm edits one named ticket's Owner / Subject cell, preserving every other record;
 * colfilter applies header value filters, then a bulk action to exactly those records;
 * virtual edits a ticket found by scrolling a window of DOM rows (24-120 records).
 * paginate additionally offers page-size controls (model.pageSize overrides spec.pageSize).
 * M3: rowClick supports Shift ranges and Control toggles; plans carry modifiers.
 * facts(model, spec): visible Selected rows / Records / Updated records summaries.
 * parts(model, spec): preempt=cancel: 'Sort', 'Filter' and 'Page' always, plus resize / reorder each column by label (its width /
 * place), every row-acting scenario each row by its ID (key column when shown, else the name) with [ticked, status, removed, edits].
 * silent(next, prev, spec, rng): revert one changed record; retrying the edit or bulk action repairs it.
 * retarget(spec, model, rng): switch to another cell value, row, filter, sort or bulk goal in the same scene.
 * judgeModes: ambiguous duplicates a visible record name; the two records are told apart by ID, so the reply asks (status
 * ask) with both IDs (cands: one ID each, both required; others: every other row's ID); confirm prepares bulk delete,
 * stopping before mutation; widgets flag irreversible on execution. judged checks the unchanged data (and the open dialog).
 * select: ticking every row is error 1 (no progress) unless every row is the goal.
 * New model fields: edits/editing on crm/virtual, virtualTop (first visible row), windowSize,
 * pageSize (optional). New targets: { viewport: true }, { pageSize: n }; wheel moves the virtual window.
 * New ticket content uses people/commerce banks.
 * Deviations: header value-filter menus are local DOM controls, including in AG Grid Community.
 */
(function () {
  'use strict';

  const C = env.content;
  const { clone, clamp, quote, lev, listText } = env.util;
  const MINW = 56;
  const MAXW = 420;
  const COLW = { id: 112, text: 150, email: 200, cat: 118, num: 76, money: 108, date: 118 };
  const BUDGET = 715; // total initial column px (the widget's grid is at least ~760 px wide)

  // ---------------------------------------------------------------- content helpers

  const person = (rng, spec) => C.personName(rng, C.csplitOf(spec));
  const nameOf = (x) => (typeof x === 'string' ? x : x.name || x.label || x.city || String(x));

  function isoDate(rng, y0, y1) {
    const y = rng.int(y0, y1);
    const m = rng.int(1, 12);
    const d = rng.int(1, [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1]);
    return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  }
  function fmtDate(iso, locale) {
    return C.formatDate(iso, locale, locale === 'en-US' ? 'medium' : 'short');
  }
  function fmtMoney(x, cur, locale) {
    return C.formatMoney(x, cur, locale);
  }
  function fmtNum(x, locale) {
    const s = String(x);
    return locale === 'de-DE' ? s.replace(/\B(?=(\d{3})+(?!\d))/g, '.') : s.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  // ---------------------------------------------------------------- domains

  const STATUS = {
    orders: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded', 'On hold'],
    people: ['Active', 'On leave', 'Remote', 'Contractor', 'Probation'],
    inventory: ['In stock', 'Low stock', 'Backordered', 'Discontinued', 'Reserved'],
    invoices: ['Draft', 'Sent', 'Paid', 'Overdue', 'Void', 'Disputed'],
  };
  const cityList = (rng, spec, k) => C.sample(rng, C.CITIES, k + 4, spec).map(nameOf)
    .filter((v, i, a) => a.indexOf(v) === i).slice(0, k);
  const companies = (rng, spec, k) => C.sample(rng, C.COMPANIES, k, spec).map(nameOf);

  function uniq(rng, make, used) {
    for (let t = 0; t < 60; t++) {
      const v = make();
      if (!used.has(v)) { used.add(v); return v; }
    }
    const v = `${make()} ${used.size}`;
    used.add(v);
    return v;
  }
  function personNames(rng, spec, n) {
    const used = new Set();
    return Array.from({ length: n }, () => uniq(rng, () => person(rng, spec).full, used));
  }
  function emailOf(rng, name, domain) {
    const [f, ...rest] = String(name).split(' ');
    const l = rest.join('');
    const a = (s) => C.ascii(s).toLowerCase().replace(/[^a-z]/g, '');
    return `${a(f)}.${a(l)}@${domain}`;
  }
  const pid = (rng) => C.orderId(rng);
  const iid = (rng) => C.invoiceId(rng);
  const skuOf = (rng) => C.sku(rng);

  const DOMAINS = {
    orders: {
      title: [
        'Orders', 'Recent orders', 'Sales orders', 'Order history', 'Order records', 'Order file', 'Sales log',
        'Order book'
      ], entity: 'order', entities: 'orders',
      cols: [
        { id: 'oid', label: 'Order', type: 'id', aliases: ['order number', 'order ID'], key: true },
        { id: 'customer', label: 'Customer', type: 'text', aliases: ['client', 'buyer'], name: true },
        { id: 'product', label: 'Product', type: 'text', aliases: ['item'] },
        { id: 'city', label: 'City', type: 'cat', aliases: ['ship-to city', 'destination'], pred: (v) => `shipping to ${v}` },
        { id: 'qty', label: 'Qty', type: 'num', aliases: ['quantity', 'units'] },
        { id: 'amount', label: 'Amount', type: 'money', aliases: ['total', 'order value'], ext: ['most expensive', 'cheapest'] },
        { id: 'status', label: 'Status', type: 'cat', aliases: ['order status', 'state'], status: true, pred: (v) => `with status ${v}` },
        { id: 'date', label: 'Date', type: 'date', aliases: ['order date', 'placed on'], ext: ['most recent', 'oldest'] },
      ],
      gen(rng, spec, n) {
        const cities = cityList(rng, spec, rng.int(spec.ood ? 6 : 4, spec.ood ? 8 : 5));
        const st = rng.sample(STATUS.orders, rng.int(4, 5));
        const prods = C.sample(rng, C.PRODUCTS, 14, spec);
        const names = personNames(rng, spec, n);
        const used = new Set();
        const y = rng.int(2022, 2025);
        return names.map((nm, i) => {
          const p = rng.pick(prods);
          const qty = rng.int(1, 12);
          const unit = typeof p === 'object' && p.priceMin != null ? p.priceMin + (p.priceMax - p.priceMin) * rng.float() : rng.float(4, 220);
          return { id: `r${i}`, c: { oid: uniq(rng, () => pid(rng), used), customer: nm, product: nameOf(p), city: rng.pick(cities),
            qty, amount: Math.round(unit * qty * 100) / 100, status: rng.pick(st), date: isoDate(rng, y, y) } };
        });
      },
    },
    people: {
      title: [
        'Employees', 'People', 'Team directory', 'Staff', 'Colleagues', 'Roster', 'Workforce', 'Team members'
      ], entity: 'employee', entities: 'employees',
      cols: [
        { id: 'name', label: 'Name', type: 'text', aliases: ['employee', 'full name'], name: true },
        { id: 'email', label: 'Email', type: 'email', aliases: ['email address', 'e-mail'], key: true },
        { id: 'dept', label: 'Department', type: 'cat', aliases: ['team', 'dept.'], pred: (v) => `in ${v}` },
        { id: 'title', label: 'Job title', type: 'text', aliases: ['role', 'position'] },
        { id: 'office', label: 'Office', type: 'cat', aliases: ['location', 'site'], pred: (v) => `based in ${v}` },
        { id: 'start', label: 'Start date', type: 'date', aliases: ['hire date', 'joined'], ext: ['most recently hired', 'longest-serving'] },
        { id: 'salary', label: 'Salary', type: 'money', aliases: ['pay', 'annual salary'], ext: ['best-paid', 'lowest-paid'] },
        { id: 'status', label: 'Status', type: 'cat', aliases: ['employment status'], status: true, pred: (v) => `whose status is ${v}` },
      ],
      gen(rng, spec, n) {
        const depts = C.sample(rng, C.DEPARTMENTS, rng.int(spec.ood ? 6 : 4, spec.ood ? 8 : 5), spec).map(nameOf);
        const titles = C.sample(rng, C.JOB_TITLES, 12, spec).map(nameOf);
        const offices = cityList(rng, spec, rng.int(3, spec.ood ? 6 : 4));
        const st = rng.sample(STATUS.people, rng.int(3, 4));
        const domain = rng.pick(['northwind.io', 'bluefin.dev', 'kestrel.co', 'harbor-analytics.com', 'lumen.studio']);
        const names = personNames(rng, spec, n);
        const used = new Set();
        return names.map((nm, i) => ({ id: `r${i}`, c: { name: nm, email: uniq(rng, () => emailOf(rng, nm, domain), used),
          dept: rng.pick(depts), title: rng.pick(titles), office: rng.pick(offices), start: isoDate(rng, 2014, 2025),
          salary: rng.int(80, 360) * 500, status: rng.pick(st) } }));
      },
    },
    inventory: {
      title: [
        'Inventory', 'Stock levels', 'Products', 'Catalog', 'Merchandise', 'Goods', 'Item index'
      ], entity: 'product', entities: 'products',
      cols: [
        { id: 'sku', label: 'SKU', type: 'id', aliases: ['item code', 'SKU code'], key: true },
        { id: 'product', label: 'Product', type: 'text', aliases: ['item', 'product name'], name: true },
        { id: 'category', label: 'Category', type: 'cat', aliases: ['product category', 'group'], pred: (v) => `in the ${v} category` },
        { id: 'supplier', label: 'Supplier', type: 'text', aliases: ['vendor'] },
        { id: 'price', label: 'Price', type: 'money', aliases: ['unit price', 'list price'], ext: ['most expensive', 'cheapest'] },
        { id: 'stock', label: 'Stock', type: 'num', aliases: ['units on hand', 'quantity'], ext: ['best-stocked', 'lowest-stock'] },
        { id: 'warehouse', label: 'Warehouse', type: 'cat', aliases: ['location', 'depot'], pred: (v) => `stored in ${v}` },
        { id: 'status', label: 'Status', type: 'cat', aliases: ['availability', 'stock status'], status: true, pred: (v) => `marked ${v}` },
        { id: 'updated', label: 'Updated', type: 'date', aliases: ['last updated', 'modified'], ext: ['most recently updated', 'least recently updated'] },
      ],
      gen(rng, spec, n) {
        const prods = C.sample(rng, C.PRODUCTS, n + 10, spec);
        const catsBank = C.PRODUCT_CATEGORIES.map(nameOf);
        const cats = rng.sample(catsBank, Math.min(catsBank.length, rng.int(spec.ood ? 6 : 4, spec.ood ? 7 : 5)));
        const sups = companies(rng, spec, 8);
        const whs = cityList(rng, spec, rng.int(3, spec.ood ? 6 : 4));
        const st = rng.sample(STATUS.inventory, rng.int(3, 4));
        const usedN = new Set();
        const usedS = new Set();
        let k = 0;
        return Array.from({ length: n }, (_, i) => {
          const p = prods[k++ % prods.length];
          const name = uniq(rng, () => (usedN.has(nameOf(p)) ? `${nameOf(p)} ${rng.pick([
            'Pro', 'Mini', 'XL', 'II', 'Plus', 'Lite', 'Core', 'Flex', 'Go', 'RevA', 'SE', 'Neo'
          ])}` : nameOf(p)), usedN);
          const pr = typeof p === 'object' && p.priceMin != null ? p.priceMin + (p.priceMax - p.priceMin) * rng.float() : rng.float(3, 400);
          return { id: `r${i}`, c: { sku: uniq(rng, () => skuOf(rng), usedS), product: name, category: rng.pick(cats), supplier: rng.pick(sups),
            price: Math.round(pr * 100) / 100, stock: rng.int(0, 480), warehouse: rng.pick(whs), status: rng.pick(st), updated: isoDate(rng, 2024, 2025) } };
        });
      },
    },
    invoices: {
      title: [
        'Invoices', 'Billing', 'Receivables', 'Invoice register', 'Invoice files', 'Charges', 'Billing ledger',
        'Account book'
      ], entity: 'invoice', entities: 'invoices',
      cols: [
        { id: 'inv', label: 'Invoice', type: 'id', aliases: ['invoice number', 'invoice no.'], key: true },
        { id: 'client', label: 'Client', type: 'text', aliases: ['customer', 'account'], name: true },
        { id: 'contact', label: 'Contact', type: 'text', aliases: ['contact person'] },
        { id: 'region', label: 'Region', type: 'cat', aliases: ['sales region', 'territory'], pred: (v) => `in the ${v} region` },
        { id: 'issued', label: 'Issued', type: 'date', aliases: ['issue date', 'invoice date'], ext: ['most recently issued', 'oldest'] },
        { id: 'total', label: 'Total', type: 'money', aliases: ['amount', 'invoice total'], ext: ['largest', 'smallest'] },
        { id: 'status', label: 'Status', type: 'cat', aliases: ['payment status'], status: true, pred: (v) => `marked ${v}` },
        { id: 'items', label: 'Lines', type: 'num', aliases: ['line items', 'number of lines'] },
      ],
      gen(rng, spec, n) {
        const regions = rng.sample([
          'North', 'South', 'East', 'West', 'Central', 'EMEA', 'APAC', 'LATAM', 'Nordics', 'Benelux', 'Baltics',
          'Balkans', 'Iberia', 'Maghreb', 'Levant', 'Sahel', 'Gulf', 'DACH', 'ANZ', 'SEA', 'Andes', 'Pampas',
          'Aegean', 'Alpine', 'Mekong', 'Caspian', 'CEE', 'UKI', 'Japan', 'India', 'Chaco', 'Kanto', 'Deccan',
          'Urals'
        ], rng.int(spec.ood ? 6 : 4, spec.ood ? 7 : 5));
        const st = rng.sample(STATUS.invoices, rng.int(4, 5));
        const used = new Set();
        const usedC = new Set();
        const cos = companies(rng, spec, n + 8);
        let k = 0;
        return Array.from({ length: n }, (_, i) => ({ id: `r${i}`, c: { inv: uniq(rng, () => iid(rng), used),
          client: uniq(rng, () => cos[k++ % cos.length] + (k > cos.length ? ` ${rng.pick([
            'GmbH', 'Ltd', 'Inc.', 'SA', 'BV', 'LLC', 'LLP', 'PLC', 'AG', 'SARL', 'SAS', 'ApS', 'Oy', 'Srl', 'SpA',
            'SNC'
          ])}` : ''), usedC),
          contact: person(rng, spec).full, region: rng.pick(regions), issued: isoDate(rng, 2024, 2025),
          total: Math.round(rng.float(120, 24000) * 100) / 100, status: rng.pick(st), items: rng.int(1, 24) } }));
      },
    },
  };
  STATUS.tickets = ['Open', 'In progress', 'Waiting', 'Closed'];
  DOMAINS.tickets = {
    title: [
      'Support queue', 'Customer operations', 'Service desk', 'Case management', 'Issue tracking', 'Request handling'
    ], entity: 'ticket', entities: 'tickets',
    cols: [
      { id: 'ticket', label: 'Ticket', type: 'id', key: true, aliases: ['ticket ID'] },
      { id: 'contact', label: 'Contact', type: 'text', name: true, aliases: ['customer'] },
      { id: 'subject', label: 'Subject', type: 'text', aliases: ['summary'] },
      { id: 'owner', label: 'Owner', type: 'text', aliases: ['assignee'] },
      { id: 'priority', label: 'Priority', type: 'cat', aliases: ['urgency'], pred: v => `with priority ${v}` },
      { id: 'status', label: 'Status', type: 'cat', status: true, aliases: ['state'] },
    ],
    gen(rng, spec, n) {
      const names = personNames(rng, spec, n);
      const owners = personNames(rng, spec, 5);
      const subjects = [
        'Delivery follow-up', 'Access request', 'Billing question', 'Account verification', 'Return request',
        'Workspace invitation', 'Order clarification', 'Login assistance', 'Cancellation help', 'Connectivity issue',
        'Document request', 'Product inquiry'
      ];
      const products = C.sample(rng, C.PRODUCTS, 6, spec).map(nameOf);
      return names.map((name, i) => ({ id: `r${i}`, c: { ticket: `TK-${4100 + i}`, contact: name,
        subject: `${rng.pick(subjects)}: ${rng.pick(products)}`, owner: rng.pick(owners),
        priority: rng.pick(['Low', 'Normal', 'High', 'Urgent']), status: rng.pick(STATUS.tickets.slice(0, 3)) } }));
    },
  };
  const DOMAIN_IDS = Object.keys(DOMAINS).filter(x => x !== 'tickets');

  // ---------------------------------------------------------------- values, views

  const colOf = (spec, id) => spec.cols.find((c) => c.id === id);
  const rowOf = (spec, id) => spec.rows.find((r) => r.id === id);
  function valueOf(m, spec, row, col) {
    if (col === spec.statusCol && m && m.status && m.status[row.id] !== undefined) return m.status[row.id];
    if (m && m.edits && m.edits[row.id] && m.edits[row.id][col] !== undefined) return m.edits[row.id][col];
    return row.c[col];
  }
  function cellText(spec, row, col, m) {
    const c = colOf(spec, col);
    const v = valueOf(m, spec, row, col);
    if (!c) return String(v);
    if (c.type === 'money') return fmtMoney(v, spec.currency, spec.locale);
    if (c.type === 'date') return fmtDate(v, spec.locale);
    if (c.type === 'num') return fmtNum(v, spec.locale);
    return String(v);
  }
  function cmp(a, b) {
    if (typeof a === 'number' && typeof b === 'number') return a - b;
    const x = String(a).toLowerCase();
    const y = String(b).toLowerCase();
    return x < y ? -1 : x > y ? 1 : 0;
  }
  const matchesQuery = (spec, m, row, q) => {
    if (!q) return true;
    const ql = q.trim().toLowerCase();
    if (!ql) return true;
    return spec.cols.some((c) => cellText(spec, row, c.id, m).toLowerCase().includes(ql));
  };
  function filteredRows(m, spec) {
    return spec.rows.filter((r) => !(m.removed && m.removed[r.id])
      && Object.entries(m.filters || {}).every(([col, vals]) => vals.includes(valueOf(m, spec, r, col)))
      && matchesQuery(spec, m, r, m.query));
  }
  function visibleRows(m, spec) {
    const rows = filteredRows(m, spec);
    if (!m.sort) return rows;
    const { col, dir } = m.sort;
    const idx = new Map(spec.rows.map((r, i) => [r.id, i]));
    return rows.slice().sort((a, b) => (cmp(valueOf(m, spec, a, col), valueOf(m, spec, b, col)) * (dir === 'desc' ? -1 : 1)) || idx.get(a.id) - idx.get(b.id));
  }
  const pageSizeOf = (m, spec) => m.pageSize || spec.pageSize;
  const pageCount = (m, spec) => Math.max(1, Math.ceil(visibleRows(m, spec).length / pageSizeOf(m, spec)));
  const windowRows = (m, spec) => visibleRows(m, spec).slice(m.virtualTop || 0, (m.virtualTop || 0) + (m.windowSize || 6));
  const setPageSize = (m, spec, n) => ({ ...base(m), pageSize: n, page: 0 });
  const pageRows = (m, spec) => {
    if (spec.scenario === 'virtual') return windowRows(m, spec);
    const p = clamp(m.page || 0, 0, pageCount(m, spec) - 1);
    const n = pageSizeOf(m, spec);
    return visibleRows(m, spec).slice(p * n, (p + 1) * n);
  };
  // Pager buttons: page indices and '…' gaps (at most 7 entries).
  function pagerItems(page, pages) {
    if (pages <= 7) return Array.from({ length: pages }, (_, i) => i);
    const out = [0];
    const lo = Math.max(1, Math.min(page - 1, pages - 5));
    const hi = Math.min(pages - 2, Math.max(page + 1, 4));
    if (lo > 1) out.push('…');
    for (let i = lo; i <= hi; i++) out.push(i);
    if (hi < pages - 2) out.push('…');
    out.push(pages - 1);
    return out;
  }
  function distinct(spec, col, m) {
    const set = new Set(spec.rows.map((r) => valueOf(m, spec, r, col)));
    if (col === spec.statusCol) for (const v of spec.statuses || []) set.add(v);
    return [...set].sort(cmp);
  }

  const jaccard = (a, b) => {
    const A = new Set(a);
    const B = new Set(b);
    let inter = 0;
    for (const x of A) if (B.has(x)) inter++;
    const uni = A.size + B.size - inter;
    return uni ? inter / uni : 1;
  };

  // ---------------------------------------------------------------- transitions (pure; the widget calls them)

  const base = (m) => ({ ...m, menu: null, markMenu: false });
  function setSort(m, col, dir) {
    return { ...base(m), sort: dir ? { col, dir } : null, page: 0 };
  }
  function headerClick(m, spec, col) {
    const s = m.sort && m.sort.col === col ? m.sort.dir : null;
    return setSort(m, col, s === null ? 'asc' : s === 'asc' ? 'desc' : null);
  }
  function toggleRow(m, spec, id, shift) {
    const sel = new Set(m.selected);
    const on = !sel.has(id);
    const ids = pageRows(m, spec).map((r) => r.id);
    if (shift && m.anchor && ids.includes(m.anchor) && ids.includes(id) && m.anchor !== id) {
      const a = ids.indexOf(m.anchor);
      const b = ids.indexOf(id);
      for (let i = Math.min(a, b); i <= Math.max(a, b); i++) (on ? sel.add(ids[i]) : sel.delete(ids[i]));
    } else if (on) sel.add(id);
    else sel.delete(id);
    return { ...base(m), selected: spec.rows.map((r) => r.id).filter((x) => sel.has(x)), anchor: id };
  }
  // Row-body click (multirow): plain replaces the selection, Ctrl toggles, Shift selects the range from the anchor.
  function rowClick(m, spec, id, mods = {}) {
    const ids = pageRows(m, spec).map((r) => r.id);
    if (!ids.includes(id)) return m;
    let sel = new Set(m.selected);
    let anchor = id;
    if (mods.shift) {
      const a = m.anchor && ids.includes(m.anchor) ? m.anchor : ids[0];
      const lo = Math.min(ids.indexOf(a), ids.indexOf(id));
      const hi = Math.max(ids.indexOf(a), ids.indexOf(id));
      if (!mods.ctrl) sel = new Set();
      for (let i = lo; i <= hi; i++) sel.add(ids[i]);
      anchor = a;
    } else if (mods.ctrl) {
      if (sel.has(id)) sel.delete(id);
      else sel.add(id);
    } else sel = new Set([id]);
    return { ...base(m), selected: spec.rows.map((r) => r.id).filter((x) => sel.has(x)), anchor };
  }
  // cellEdit: which cells can be edited in place (text / number cells that are not the name or key column).
  function canEdit(spec, col) {
    const c = colOf(spec, col);
    const d = DOMAINS[spec.domain].cols.find((x) => x.id === col);
    return !!c && !!d && (c.type === 'text' || c.type === 'num') && !d.name && !d.key;
  }
  function commitEdit(m, spec) {
    const e = m.editing;
    if (!e) return m;
    const text = String(e.draft).trim();
    const row = rowOf(spec, e.row);
    const c = colOf(spec, e.col);
    const n = { ...m, editing: null };
    if (!text) return n;
    const val = c.type === 'num' && /^-?\d+(\.\d+)?$/.test(text) ? Number(text) : text;
    const edits = { ...(m.edits || {}) };
    const cell = { ...(edits[e.row] || {}) };
    if (String(val) === String(row.c[e.col])) delete cell[e.col];
    else cell[e.col] = val;
    if (Object.keys(cell).length) edits[e.row] = cell;
    else delete edits[e.row];
    return { ...n, edits };
  }
  function startEdit(m, spec, rowId, col) {
    if (!canEdit(spec, col) || !rowOf(spec, rowId)) return m;
    const n = commitEdit(base(m), spec);
    return { ...n, editing: { row: rowId, col, draft: String(valueOf(n, spec, rowOf(spec, rowId), col)) } };
  }
  const setDraftCell = (m, text) => (m.editing ? { ...m, editing: { ...m.editing, draft: String(text) } } : m);
  const cancelEdit = (m) => ({ ...m, editing: null });
  function toggleAll(m, spec) {
    const ids = pageRows(m, spec).map((r) => r.id);
    const sel = new Set(m.selected);
    const all = ids.length && ids.every((x) => sel.has(x));
    for (const x of ids) (all ? sel.delete(x) : sel.add(x));
    return { ...base(m), selected: spec.rows.map((r) => r.id).filter((x) => sel.has(x)), anchor: null };
  }
  const clearSel = (m) => ({ ...base(m), selected: [], anchor: null });
  const setQuery = (m, q) => ({ ...base(m), query: String(q), page: 0 });
  function openMenu(m, spec, col, kind) {
    if (m.menu && m.menu.col === col && m.menu.kind === kind) return base(m);
    const draft = kind === 'filter' ? (m.filters[col] ? m.filters[col].slice() : distinct(spec, col, m)) : undefined;
    return { ...base(m), menu: { col, kind, draft } };
  }
  const closeMenus = (m) => base(m);
  function toggleDraft(m, value) {
    if (!m.menu || m.menu.kind !== 'filter') return m;
    const d = m.menu.draft.includes(value) ? m.menu.draft.filter((v) => v !== value) : m.menu.draft.concat([value]);
    return { ...m, menu: { ...m.menu, draft: d } };
  }
  function draftAll(m, spec) {
    if (!m.menu || m.menu.kind !== 'filter') return m;
    const all = distinct(spec, m.menu.col, m);
    return { ...m, menu: { ...m.menu, draft: m.menu.draft.length === all.length ? [] : all } };
  }
  function applyFilter(m, spec) {
    if (!m.menu || m.menu.kind !== 'filter') return m;
    const all = distinct(spec, m.menu.col, m);
    const filters = { ...m.filters };
    const d = all.filter((v) => m.menu.draft.includes(v));
    if (d.length === all.length) delete filters[m.menu.col];
    else filters[m.menu.col] = d;
    return { ...base(m), filters, page: 0 };
  }
  function clearFilter(m, col) {
    const filters = { ...m.filters };
    delete filters[col];
    return { ...base(m), filters, page: 0 };
  }
  const clearFilters = (m) => ({ ...base(m), filters: {}, query: '', page: 0 });
  const gotoPage = (m, spec, p) => ({ ...base(m), page: clamp(p, 0, pageCount(m, spec) - 1) });
  const openMark = (m) => ({ ...m, menu: null, markMenu: !m.markMenu });
  function askBulk(m, spec, action, value) {
    if (!m.selected.length) return base(m);
    if (action === 'delete') return { ...base(m), confirm: { action, value: null } };
    return runBulk(base(m), spec, action, value);
  }
  const cancelConfirm = (m) => ({ ...m, confirm: null });
  function isGood(m, spec, id) {
    const g = spec.goal;
    if (g.action === 'status') return !(m.removed[id]) && m.status[id] === g.value;
    return m.removed[id] === g.action;
  }
  function changed(m, id) {
    return !!m.removed[id] || m.status[id] !== undefined;
  }
  function runBulk(m, spec, action, value) {
    const ids = m.selected.filter((id) => !m.removed[id]);
    if (!ids.length) return { ...m, confirm: null };
    const prev = ids.map((id) => ({ id, status: m.status[id] ?? null, removed: m.removed[id] || null }));
    const status = { ...m.status };
    const removed = { ...m.removed };
    for (const id of ids) {
      if (action === 'status') {
        if (rowOf(spec, id).c[spec.statusCol] === value) delete status[id];
        else status[id] = value;
      } else removed[id] = action;
    }
    let wrong = false;
    if (spec.scenario === 'bulk' || spec.scenario === 'multirow' || spec.scenario === 'colfilter') {
      const T = new Set(spec.target);
      wrong = ids.some((id) => !T.has(id)) || action !== spec.goal.action || (action === 'status' && value !== spec.goal.value);
    }
    const n = { ...m, status, removed, selected: [], anchor: null, confirm: null, markMenu: false, menu: null,
      history: m.history.concat([{ action, value: value ?? null, ids, prev }]), toast: true, wrongs: m.wrongs + (wrong ? 1 : 0) };
    return { ...n, page: clamp(n.page, 0, pageCount(n, spec) - 1) };
  }
  function undo(m, spec) {
    if (!m.history.length) return m;
    const last = m.history[m.history.length - 1];
    const status = { ...m.status };
    const removed = { ...m.removed };
    for (const p of last.prev) {
      if (p.status === null) delete status[p.id];
      else status[p.id] = p.status;
      if (p.removed === null) delete removed[p.id];
      else removed[p.id] = p.removed;
    }
    return { ...base(m), status, removed, history: m.history.slice(0, -1), toast: false, confirm: null };
  }
  const dismissToast = (m) => ({ ...m, toast: false });
  const setWidth = (m, col, w) => ({ ...m, widths: { ...m.widths, [col]: Math.round(clamp(w, MINW, MAXW)) } });
  const nudgeWidth = (m, col, d) => setWidth(m, col, (m.widths[col] || MINW) + d);
  function moveCol(m, col, k) {
    const others = m.order.filter((c) => c !== col);
    const at = clamp(k, 0, others.length);
    return { ...base(m), order: others.slice(0, at).concat([col], others.slice(at)) };
  }
  const setFocus = (m, focus) => ({ ...m, focus });
  // The quick search box (keyboard) exists in filter and paginate episodes and in keyboard-share episodes.
  const searchable = (spec) => spec.scenario === 'filter' || spec.scenario === 'paginate' || !!spec.keys;

  // ---------------------------------------------------------------- sampling

  function pickCols(rng, dom, spec, need) {
    const all = dom.cols;
    let k = spec.ood ? rng.int(7, Math.min(8, all.length)) : rng.int(5, 6);
    if (spec.level) k = spec.level === 'easy' ? 4 + (k & 1) : 5;
    const must = new Set(need.filter(Boolean));
    for (const c of all) if (c.name) must.add(c.id);
    const rest = rng.shuffle(all.filter((c) => !must.has(c.id)));
    const chosen = new Set(must);
    for (const c of rest) if (chosen.size < k) chosen.add(c.id);
    return all.filter((c) => chosen.has(c.id)).map((c) => ({ id: c.id, label: c.label, aliases: c.aliases || [], type: c.type,
      w: COLW[c.type] }));
  }
  // Header needs: label + sort arrow + padding (+ funnel on categorical columns).
  const needW = (c) => Math.max(MINW + 8, Math.round(c.label.length * 7.6 + 34 + (c.type === 'cat' ? 22 : 0)));
  function fitWidths(cols, budget) {
    const sum = cols.reduce((a, c) => a + c.w, 0);
    if (sum > budget) {
      let mins = cols.map((c) => Math.min(c.w, needW(c)));
      let minSum = mins.reduce((a, b) => a + b, 0);
      // Dense held-out grids may not fit every full header label. Keep the controls usable and let
      // widgets ellipsize labels rather than exceeding the grid budget (which also blocks resize goals).
      if (minSum > budget) {
        const floor = cols.length * MINW;
        const f = clamp((budget - floor) / Math.max(1, minSum - floor), 0, 1);
        mins = mins.map((w) => MINW + (w - MINW) * f);
        minSum = mins.reduce((a, b) => a + b, 0);
      }
      const f = Math.max(0, (budget - minSum) / Math.max(1, sum - minSum));
      cols.forEach((c, i) => { c.w = Math.floor(mins[i] + (c.w - mins[i]) * f); });
    }
    return cols;
  }

  function sampleSpec(rng, opts) {
    const list = opts.scenarios && opts.scenarios.length ? opts.scenarios : env.taskOf('use-data-grid').scenarios;
    const scenario = opts.scenario || rng.pick(list);
    const v = V[scenario];
    if (v.sample) return v.sample(rng, { ...opts, scenario });
    const ood = !!opts.ood;
    for (let tries = 0; tries < 60; tries++) {
      const domain = rng.pick(DOMAIN_IDS);
      const dom = DOMAINS[domain];
      const spec = { scenario, startMode: opts.startMode || 'off', isplit: opts.isplit || 'train', csplit: opts.csplit || 'train',
        ood, domain, title: rng.pick(dom.title), entity: dom.entity, entities: dom.entities,
        locale: rng.pick(['en-US', 'en-US', 'en-US', 'en-GB', 'de-DE']), keys: false, route: null };
      if (opts.level === 'easy' || opts.level === 'medium') spec.level = opts.level;
      spec.currency = spec.locale === 'en-GB' ? rng.pick(['GBP', 'GBP', 'USD']) : spec.locale === 'de-DE' ? 'EUR' : rng.pick(['USD', 'USD', 'EUR']);
      const [lo, hi] = spec.level ? v.levelRows[spec.level] : v.rows[ood ? 1 : 0];
      const n = rng.int(lo, hi);
      spec.rows = dom.gen(rng, spec, n);
      const statusDef = dom.cols.find((c) => c.status);
      spec.statuses = STATUS[domain].filter((s) => spec.rows.some((r) => r.c[statusDef.id] === s));
      const g = v.goal(rng, spec, dom, opts);
      if (!g) continue;
      // Extra columns still need room for a meaningful widening/doubling resize operation.
      const widthBudget = scenario === 'resize' && ood ? BUDGET - 80 : BUDGET;
      spec.cols = fitWidths(pickCols(rng, dom, spec, g.need || []), widthBudget);
      spec.statusCol = spec.cols.some((c) => c.id === statusDef.id) ? statusDef.id : null;
      if (g.finish && g.finish(spec) === false) continue;
      return spec;
    }
    throw new Error(`use-data-grid: could not sample ${scenario}`);
  }

  // A plausible new value for a text cell.
  function newText(rng, spec, col) {
    switch (col) {
      case 'product': return nameOf(C.pick(rng, C.PRODUCTS, spec));
      case 'title': return nameOf(C.pick(rng, C.JOB_TITLES, spec));
      case 'supplier': return nameOf(C.pick(rng, C.COMPANIES, spec));
      case 'client': return nameOf(C.pick(rng, C.COMPANIES, spec));
      default: return person(rng, spec).full;
    }
  }
  const catCols = (dom) => dom.cols.filter((c) => c.type === 'cat');
  const nameCol = (dom) => dom.cols.find((c) => c.name);
  const keyCol = (dom) => dom.cols.find((c) => c.key);

  // ================================================================ dispatch: one object per scenario
  //
  // Each scenarios/<scenario>.js registers env.scenario('use-data-grid', {name, ...}); logic.js calls its hooks. The shared files
  // (scenarios/edit.js, admin.js, rows.js) add the code several scenarios share to fam.lib. Hooks of an object:
  //   goal(rng, spec, dom, opts) with rows [[train lo, hi], [ood lo, hi]] and levelRows { easy, medium }: the goal of the
  //     standard sampler (spec.goal and more; returns { need, finish } or null for a redraw); or sample(rng, opts) for a
  //     scenario that samples its whole spec
  //   init(spec, m, mode, rng)  edits the start model m in place (or returns another model), solve(spec, m, model),
  //     error(m, spec), plan(m, spec), instruction(spec, rng)
  // optional: tolerance(spec) (default { tau: 0, sigma: 0.35, minInitialError: 0.25 }), fresh(m) (extra model fields),
  //   parts(m, spec, out), retarget(s, spec, model, rng) (edits the copy s; false: nothing fits), ended(m, spec),
  //   unsave(m, prev), inputs (kit input kinds). Flags: batch (a bulk action on rows: spec.recoverable, a delete
  //   confirm may stay open), saves (changes that can fail to save: silent), windowed (a scrolled window of rows).

  const V = env.scenariosOf('use-data-grid');

  function errorOf(m, spec) {
    if (spec.judge) return spec.judge.mode === 'confirm' ? 0.75 * (1 - jaccard(m.selected, spec.rows.map(r => r.id))) + (m.confirm ? 0 : 0.25) : 0;
    return V[spec.scenario].error(m, spec);
  }

  function toleranceOf(spec) {
    if (spec.judge) return { tau: 0, sigma: 0.35, minInitialError: 0.1 };
    const v = V[spec.scenario];
    return v.tolerance ? v.tolerance(spec) : { tau: 0, sigma: 0.35, minInitialError: 0.25 };
  }

  function freshModel(spec) {
    const widths = {};
    for (const c of spec.cols) widths[c.id] = c.w;
    const m = { sort: null, query: '', filters: {}, page: 0, selected: [], anchor: null, widths, order: spec.cols.map((c) => c.id),
      menu: null, markMenu: false, confirm: null, status: {}, removed: {}, history: [], toast: false, wrongs: 0, focus: null };
    if (V[spec.scenario].fresh) V[spec.scenario].fresh(m);
    return m;
  }

  function initOf(spec, rng) {
    const m = freshModel(spec);
    if (spec.judge) return m;
    return V[spec.scenario].init(spec, m, spec.startMode, rng) || m;
  }

  function solveOf(spec, model) {
    if (spec.judge) return { ...freshModel(spec), ...(spec.judge.mode === 'confirm' ? { selected: spec.rows.map(r => r.id), confirm: { action: 'delete', value: null } } : {}) };
    const m = { ...clone(model), menu: null, markMenu: false, confirm: null };
    return V[spec.scenario].solve(spec, m, model);
  }

  function planOf(m, spec) {
    if (spec.judge && spec.judge.mode === 'confirm') {
      if (m.confirm) return null;
      if (m.menu || m.markMenu) return { click: { blank: true } };
      if (m.query || Object.keys(m.filters).length) return { click: { clearFilters: true } };
      const missing = spec.rows.filter(r => !m.selected.includes(r.id));
      if (!missing.length) return { click: { bulk: 'delete' } };
      if (pageRows(m, spec).some(r => missing.some(x => x.id === r.id))) return { click: { all: true } };
      if (V[spec.scenario].windowed) {
        const idx = spec.rows.indexOf(missing[0]);
        return { wheel: [{ viewport: true }, (idx < (m.virtualTop || 0) ? -1 : 1) * 140] };
      }
      return { click: { pager: m.page < pageCount(m, spec) - 1 ? 'next' : 'prev' } };
    }
    if (errorOf(m, spec) <= toleranceOf(spec).tau + 1e-9) return null;
    const g = spec.goal;
    const v = V[spec.scenario];
    // Dialogs and menus that the next step does not use are closed first.
    if (m.confirm && !(v.batch && g.action === 'delete' && m.confirm.action === 'delete')) return { click: { confirm: 'cancel' } };
    return v.plan(m, spec);
  }

  function instructionOf(spec, rng) {
    const E = spec.entities;
    if (spec.judge) return say(rng, spec, spec.judge.mode === 'ambiguous' ? fill(pick(rng, spec, [
      'Update the {e} for {n}.', 'Edit the {e} of {n}.', 'Open the {e} for {n} and change it.',
      'Fix the {e} for {n}.', 'The {e} for {n} needs editing.'
    ]), { e: spec.entity, n: quote(spec.judge.name) })
      : fill(pick(rng, spec, [
        'Delete all the {E}.', 'Remove every one of the {E} from this table.', 'Clear out all {E} in this table.',
        'Delete all {E} listed here.', 'All {E} in the table must be deleted.', 'Delete {E} so none remain.'
      ]), { E }));
    return V[spec.scenario].instruction(spec, rng);
  }

  const inPage = (m, spec, id) => pageRows(m, spec).some((r) => r.id === id);

  // Declarative cores ("All orders ... need to be marked") skip the polite register ("Could you ...?").
  const IMPERATIVE = /^(Sort|Order|Arrange|Re-sort|Put|Filter|Show|Narrow|Hide|Use|Limit|Find|Select|Go|Check|Locate|Tick|Mark|Change|Set|Archive|Move|Delete|Remove|Get|Bulk-delete|Resize|Make|Drag|Widen|Give|Match|Double|Halve|Place|Reorder|Clean|Open|Rename|Navigate|Restore|Undo|Cut|Browse|Head|Pick|Highlight|Drop|Trash|Throw|Erase|Change|Fix|Sel)/;
  const say = (rng, spec, core, extra = {}) => env.instruct.say(rng, core, { isplit: spec.isplit, ...extra,
    ...(IMPERATIVE.test(core) ? {} : { registers: { imperative: 0.6, chat: 0.15, ticket: 0.2, terse: 0.05, polite: 0, steps: 0 } }) });
  const pick = (rng, spec, list) => env.instruct.pick(rng, list, spec.isplit);
  const fill = (t, vars) => env.instruct.fill(t, vars);
  function colName(rng, spec, id) {
    const c = colOf(spec, id);
    return env.instruct.alias(rng, c.label, c.aliases);
  }
  const domCol = (spec, id) => DOMAINS[spec.domain].cols.find((c) => c.id === id);
  const orList = (xs) => (xs.length === 1 ? xs[0] : `${xs.slice(0, -1).join(', ')} or ${xs[xs.length - 1]}`);
  const rowLabel = (spec, id) => rowOf(spec, id).c[DOMAINS[spec.domain].cols.find((c) => c.name).id];
  function pred(spec, col, values) {
    const d = domCol(spec, col);
    const vs = values.map((v) => (d.status ? v : v));
    return d.pred ? d.pred(orList(vs)) : `where ${d.label} is ${orList(vs)}`;
  }

  const DIR_WORDS = {
    text: { asc: ['A to Z', 'alphabetically'], desc: ['Z to A', 'in reverse alphabetical order'] },
    id: { asc: ['ascending', 'lowest first'], desc: ['descending', 'highest first'] },
    cat: { asc: ['A to Z', 'ascending'], desc: ['Z to A', 'descending'] },
    num: { asc: ['smallest first', 'lowest first'], desc: ['largest first', 'highest first'] },
    money: { asc: ['lowest first', 'cheapest first'], desc: ['highest first', 'largest first'] },
    date: { asc: ['oldest first', 'earliest first'], desc: ['newest first', 'most recent first'] },
  };

  // ---------------------------------------------------------------- judging and episode hooks

  function addJudge(spec, rng, mode) {
    if (mode === 'confirm') {
      spec.judge = { mode, message: `Should I delete all ${spec.rows.length} ${spec.entities}? Please confirm before I proceed.` };
    } else {
      const col = nameCol(DOMAINS[spec.domain]).id;
      // Both candidates and their distinct IDs are visible on page one.
      const key = keyCol(DOMAINS[spec.domain]);
      if (!spec.cols.some(c => c.id === key.id)) {
        const i = spec.cols.findIndex(c => c.id !== col && c.id !== spec.statusCol);
        spec.cols[i] = { id: key.id, label: key.label, aliases: key.aliases || [], type: key.type, w: 112 };
      }
      spec.rows[1].c[col] = spec.rows[0].c[col];
      const kid = keyCol(DOMAINS[spec.domain]).id;
      const ids = spec.rows.slice(0, 2).map(r => String(r.c[kid]));
      // the two records are told apart by their IDs (the shared name is not an option); the other rows' IDs must not be offered
      spec.judge = { mode, name: spec.rows[0].c[col], ids, cands: ids.map(i => [i]),
        others: spec.rows.slice(2).map(r => String(r.c[kid])).filter(i => !ids.includes(i)).map(i => [i]),
        message: `Which record for ${spec.rows[0].c[col]} do you mean: ${spec.rows[0].c[keyCol(DOMAINS[spec.domain]).id]} or ${spec.rows[1].c[keyCol(DOMAINS[spec.domain]).id]}?` };
    }
  }

  function factsOf(m, spec) {
    const updated = spec.rows.filter(r => changed(m, r.id) || Object.keys((m.edits || {})[r.id] || {}).length).length;
    return [{ label: 'Selected rows', value: String(m.selected.length) },
      { label: 'Records', value: String(spec.rows.filter(r => !m.removed[r.id]).length) },
      { label: 'Updated records', value: String(updated) }];
  }

  // preempt=cancel: the grid's Sort, Filter and Page, plus the columns (widths, places) in resize / reorder or the rows (ticked,
  // status, removed, edits; named by ID) in the scenarios that act on rows
  function partsOf(m, spec) {
    const out = [{ name: 'Sort', value: m.sort }, { name: 'Filter', value: [m.query, m.filters] }, { name: 'Page', value: m.page }];
    const v = V[spec.scenario];
    if (v.parts) return v.parts(m, spec, out);
    const dom = DOMAINS[spec.domain];
    const id = (spec.cols.some((c) => c.id === keyCol(dom).id) ? keyCol(dom) : nameCol(dom)).id;
    return out.concat(spec.rows.map((r) => ({ name: String(r.c[id]),
      value: [m.selected.includes(r.id), m.status[r.id] || null, m.removed[r.id] || null, (m.edits || {})[r.id] || null] })));
  }

  function silentOf(next, prev, spec, rng) {
    const v = V[spec.scenario];
    if (spec.judge || !v.saves) return null;
    const ids = spec.rows.filter(r => JSON.stringify([(next.edits || {})[r.id], next.status[r.id], next.removed[r.id]]) !== JSON.stringify([(prev.edits || {})[r.id], prev.status[r.id], prev.removed[r.id]])).map(r => r.id);
    if (!ids.length) return null;
    const id = rng.pick(ids), m = clone(next);
    for (const field of ['edits', 'status', 'removed']) {
      if (!m[field]) continue;
      if (prev[field] && prev[field][id] !== undefined) m[field][id] = clone(prev[field][id]);
      else delete m[field][id];
    }
    if (v.unsave) v.unsave(m, prev);
    return errorOf(m, spec) > toleranceOf(spec).tau ? m : null;
  }

  function retargetOf(spec, model, rng) {
    if (spec.judge) return null;
    const s = clone(spec);
    if (!V[spec.scenario].retarget || !V[spec.scenario].retarget(s, spec, model, rng)) return null;
    return Number.isFinite(errorOf(model, s)) && errorOf(model, s) > toleranceOf(s).tau ? s : null;
  }

  env.task({
    name: 'use-data-grid',
    scenarios: ['sort', 'filter', 'paginate', 'select', 'bulk', 'resize', 'reorder', 'multirow', 'cellEdit', 'crm', 'colfilter', 'virtual'],
    files: ['scenarios/edit.js', 'scenarios/admin.js', 'scenarios/rows.js', 'scenarios/sort.js', 'scenarios/filter.js', 'scenarios/paginate.js',
      'scenarios/select.js', 'scenarios/bulk.js', 'scenarios/resize.js', 'scenarios/reorder.js', 'scenarios/multirow.js',
      'scenarios/cellEdit.js', 'scenarios/crm.js', 'scenarios/colfilter.js', 'scenarios/virtual.js'],
    startModes: ['off', 'partial', 'wrong', 'solved'],
    inputs: (spec) => {
      const v = spec && V[spec.scenario];
      return v && v.inputs ? v.inputs : spec && searchable(spec) ? ['pointer', 'keyboard'] : ['pointer'];
    },
    judgeModes: ['ambiguous', 'confirm'],
    facts: factsOf, parts: partsOf, silent: silentOf, retarget: retargetOf,
    // model checks only (the reply is graded by the kit): confirm needs the dialog open, nothing may have been changed
    judged(m, s) { return (s.judge.mode !== 'confirm' || !!m.confirm) && !Object.keys(m.status).length && !Object.keys(m.removed).length && !Object.keys(m.edits || {}).length; },
    // Helpers the scenario files share (they read env.taskOf('use-data-grid').lib).
    lib: {
      listText, BUDGET, catCols, changed, clamp, clone, cmp, colName, colOf, COLW, commitEdit, DIR_WORDS, distinct,
      DOMAINS, domCol, fill, filteredRows, fitWidths, inPage, isGood, jaccard, keyCol, lev, MAXW, MINW, nameCol,
      needW, newText, orList, pageCount, pagerItems, pageRows, pageSizeOf, person, pick, planOf, pred, quote,
      rowLabel, rowOf, runBulk, say, setWidth, STATUS, undo, valueOf, visibleRows
    },

    helpers: {
      searchable,
      pageSizeOf, setPageSize,
      statusOptions: (spec) => STATUS[spec.domain].slice(),
      visibleRows, pageRows, pageCount, pagerItems, cellText, valueOf, distinct,
      rowClick, startEdit, setDraftCell, commitEdit, cancelEdit,
      headerClick, setSort, toggleRow, toggleAll, clearSel, setQuery, openMenu, closeMenus, toggleDraft, draftAll,
      applyFilter, clearFilter, clearFilters, gotoPage, openMark, askBulk, runBulk, cancelConfirm, undo, setWidth,
      nudgeWidth, moveCol, dismissToast, setFocus,
    },

    sample(rng, opts) {
      const spec = sampleSpec(rng, opts);
      if (V[spec.scenario].batch) spec.recoverable = typeof opts.recover === 'boolean' ? opts.recover : rng.bool(0.5);
      if (opts.judge === 'ambiguous' || opts.judge === 'confirm') addJudge(spec, rng.fork('judge'), opts.judge);
      return spec;
    },
    init: initOf,
    error: errorOf,
    tolerance: toleranceOf,
    instruction: instructionOf,
    plan: planOf,
    solve: solveOf,

    ended(m, spec) {
      const v = V[spec.scenario];
      return v.ended ? v.ended(m, spec) : null;
    },
  });
})();
