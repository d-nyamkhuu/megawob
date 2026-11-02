/*
 * reorder-items: put items into a target order (list, grid, move) or into the right columns (kanban).
 * MiniWoB counterparts: drag-sort-numbers, drag-items, drag-items-grid.
 *
 * scenarios
 *   list    sort a vertical list by a rule. Rules (spec.rule.kind): number, month, alpha (names, A-Z or Z-A),
 *           price (products with prices), date (invoices / events with dates), size (files with sizes in
 *           KB/MB/GB), priority (tickets with Critical/High/Medium/Low badges, ties allowed), legend (cards
 *           carry a tag; a key on the page lists the tag order, the instruction only points at the key:
 *           a page-grounded rule, ties allowed). Some list episodes pin 1-2 items (spec.locked): they have
 *           no grip, cannot be dragged and stay at their index; the others are sorted around them.
 *   grid    the same rules (number, month, alpha, price, date, size) on a 3-5 column grid, read row by row
 *   move    a single edit of a given list: move X to the top / bottom / position k, put X right after or
 *           before Y, or swap two items (by position or by name). The start order is part of the spec.
 *   kanban  cards go into category columns (product categories, or an older word bank). Some episodes
 *           also require an order inside every column (spec.ordered, by price or name), and boards with
 *           4-6 columns sit in a horizontally scrolling pane (spec.pane): the oracle scrolls it with the
 *           wheel (spec.route 'wheel') or by dragging the pane's scrollbar thumb (route 'thumb'). Widgets with
 *           traits.cardMeta get multi-line cards: labels[id].meta (two detail lines), .badges, .who (see
 *           addCardMeta; drawn from rng.fork('meta'), so other widgets' episodes are unchanged).
 *
 * Traits (opts.traits, declared by a widget): cardMeta (kanban: multi-line cards), wheelPane (kanban panes have
 * no thumb to grab: the oracle always scrolls them with the wheel), dragScroll (see the plan targets),
 * staging (kanban: an unassigned staging tray, see below; no rng draws, the sampled board is unchanged),
 * boardSize { columns, perColumn } (kanban: a fixed board, e.g. 2 columns x 6 cards; later draws differ).
 *
 * opts.route (episode knob)
 *   keyboard  list, grid, move: keyboard reorder allowed and used by the oracle (spec.keys, route 'keys');
 *             no pinned items, at most 7 items (8 out of range) so the key presses fit the action budget.
 *             kanban has no keyboard route and ignores it.
 *   wheel     kanban: a scrolling board (spec.pane) scrolled with the wheel. Others ignore it.
 *   pointer   list, grid, move: no keyboard (spec.keys false); kanban panes scroll by the thumb.
 *   unset     the mix above (keys 25%, of which 60% keys route; pane route 50/50).
 *
 * spec   { scenario, isplit, csplit, ood, startMode, items: [id], labels: { id: { title, value?, tag?, color? } },
 *          list/grid/move: rule { kind, dir }, rank { id: number } (smaller first; ties allowed), goal [id]
 *            (one valid target order), cols (grid), locked { id: index } | null, legend [{ tag, color }] | null
 *            (legend order = sort order), keys (keyboard allowed), route ('drag' | 'keys'),
 *            move: { kind, x, y?, i?, j?, k? }, start [id] (move: the given order)
 *          kanban: columns [colId], colLabels { colId: label }, member { id: colId }, ordered (bool),
 *            colGoal { colId: [id] } (ordered), pane (bool), route ('wheel' | 'thumb') }
 * model  list/grid/move: { order: [id], focus? (unscored: the focused item, mirrored by keyboard widgets) }
 *        kanban: { columns: { colId: [id] }, pane? (unscored layout facts mirrored by the widget:
 *        { scroll, width, max, cols: { colId: [x0, x1] } } in pane content px; a group missing from cols,
 *        e.g. a tray outside the scrolling pane, counts as always in reach) }
 *        Staging (traits.staging): spec.staging = 'staging' names one more group inside model.columns, the
 *        unassigned tray; no card belongs to it, so a card left there counts as misplaced (error, scoring,
 *        oracle). The widget draws it, makes it a drag source and a drop target (a group of its own in
 *        env.ui.sortable) and may drop a card back into it; the oracle never does.
 * error  list/grid/move: fraction of discordant pairs among unpinned items (pairs with equal rank do not
 *        count), plus the fraction of pinned items off their index. kanban: fraction of cards in the wrong
 *        column; ordered boards: (cards in a wrong column + cards outside each column's longest run in goal
 *        order) / cards, the moves left, so a correct move never raises it. tau = 0 (exact).
 *
 * plan targets
 *   { item: id }                       press point of an item (its grip or its center)
 *   { slot: i }                        list/grid: release point so the item lands at index i
 *   { column: c, item }                kanban: release point to append item to column c
 *   { slot: i, column: c, item }       kanban: release point so item lands at index i of column c
 *   { pane: 'x' }                      kanban: a point over the scrolling pane (wheel target)
 *   { thumb: 'x' }, { thumbAt: s }     kanban: the pane's scrollbar thumb, and where to drop it so the pane
 *                                      scrolls to s px
 *   { edge: -1 | 1, item, scrollAt: s } kanban widgets with traits.dragScroll: carry a held card into the
 *                                      pane edge to reveal s px; a drop target with scrollAt uses the
 *                                      geometry after that pan. Used together in one continuous path.
 *   keys route: { click: { item } } focuses an item, then { key: 'ArrowUp' | 'ArrowDown' } moves it
 *
 * Start modes: scene (kanban with staging: every card in the tray, all columns empty; otherwise the same as
 * off), off (shuffled; kanban with staging: same as scene), partial (nearly sorted: one or two items out of place; kanban: about
 * half the cards placed, the rest in the tray), wrong (list/grid: sorted the opposite way; move: a plausible
 * wrong edit; kanban: every card one column off, tray empty), solved. No wrong-choice endings, so no recoverable mode.
 *
 * Helpers (widget API, env.taskDef.helpers):
 *   pin(order, spec) re-inserts pinned items at their index after a drop.
 * Sampling and instruction wording live in sampling.js and instructions.js; the test lives in selftest.js.
 *
 * Levels (opts.level; spec.level is set for easy / medium only, normal is the task as it always was):
 *   easy    fewer items (list 4, grid 6, move 5 items; kanban 2 columns x 2 cards), no pinned items, no in-column
 *           order, simple edits only (move: top / bottom / after / before), and a nearly solved start (one adjacent
 *           pair swapped; kanban: about three quarters of the cards already home), looser sigma
 *   medium  list 4-5, grid 7, move 5-6 items, kanban 3 columns x 2 cards, no pinned items, no in-column order,
 *           a start with a few swaps / half of the cards home
 *   Level starts only change the 'off' start; other start modes build what they always built.
 *
 * Round 2 hooks (optional, pure; see the html/kit/env.js header)
 *   facts(model, spec)       what the page shows when solved: list / grid / move "First item", "Last item" (title as shown) and the
 *                            item count (move: "Moved item position", 1-based); kanban the card count of the first three columns (the
 *                            number in each column header) and "Cards on the board". Label paraphrases go in labels, not aliases.
 *   parts(model, spec)       preempt=cancel: each item by title; value: the column a kanban card sits in ('unplaced' in the tray),
 *                            else its place in the list / grid (moving a row also changes the rows it passes). Facts say a
 *                            title without its commas (a comma would end the clause in a free-text report).
 *   silent(next, prev, spec, rng)   the last change did not stick: kanban, a card that was moved to its column is back in the
 *                            column it came from (an ordered board: a moved card lands one place short); lists, the moved item
 *                            ends one place short of its slot (pins re-applied). null in judge episodes or when no such copy
 *                            has an error.
 *   retarget(spec, model, rng)   same items, a new goal: list / grid the opposite direction (not for 'legend'); move a new edit of
 *                            the current order; kanban in-column order on (or another in-column rule: price low-high,
 *                            high-low, A-Z). Judge episodes: null.
 *   judgeModes ambiguous, impossible (spec.judge = { mode, message, templates, vars, cands?, others?, what? }; the page starts
 *     solved and the instruction is a one-line request):
 *     ambiguous   list / grid: "sort the items" with no direction (cands: ascending and descending, each with its spellings;
 *                 'legend' lists, like move, use the next case); move: the item to move shares its title with another row;
 *                 kanban: two columns carry the same label and every card is to go into that one (twins: cands the name
 *                 twice, others the page's other titles / labels). The reply asks (status ask) with one option per candidate.
 *     impossible  list / grid: sort by a property the rows do not have (what: that property, from a bank of 32); move: an
 *                 item that is not in the list (what: its title, drawn from the same large banks the items come from, not
 *                 a fixed set); kanban: a column that is not on the board (what: its label). Status impossible.
 *
 * Deviations from MiniWoB: realistic items (prices, dates, file sizes, tickets), ties, pinned items,
 * single-move goals, in-column order and scrolling boards; exact order is required for success (graded
 * partial credit by the Gaussian width).
 */
(function () {
  'use strict';
  const C = env.content;
  const I = env.instruct;

  // The older word bank, kept as one kanban source next to product categories.
  const CATEGORIES = {
    Fruit: ['apple', 'banana', 'cherry', 'grape', 'lemon', 'mango', 'peach', 'pear', 'plum', 'kiwi'],
    Animal: ['badger', 'camel', 'eagle', 'ferret', 'gecko', 'heron', 'koala', 'llama', 'otter', 'zebra'],
    Tool: ['hammer', 'chisel', 'wrench', 'pliers', 'saw', 'drill', 'level', 'rasp', 'trowel', 'vise'],
    Color: ['crimson', 'azure', 'amber', 'violet', 'olive', 'teal', 'maroon', 'navy', 'coral', 'ivory'],
  };
  // ---------------------------------------------------------------- order math

  // Discordant pairs among items with different ranks, normalized.
  function discord(seq, rank) {
    let bad = 0;
    let pairs = 0;
    for (let i = 0; i < seq.length; i++) {
      for (let j = i + 1; j < seq.length; j++) {
        const a = rank[seq[i]];
        const b = rank[seq[j]];
        if (a === b) continue;
        pairs++;
        if (a > b) bad++;
      }
    }
    return pairs ? bad / pairs : 0;
  }

  // Put pinned items back at their index (after a drop moved them).
  function pin(order, spec) {
    if (!spec.locked) return order.slice();
    const lockedAt = Object.entries(spec.locked).sort((a, b) => a[1] - b[1]);
    const rest = order.filter((id) => !(id in spec.locked));
    const out = rest.slice();
    for (const [id, i] of lockedAt) out.splice(Math.min(i, out.length), 0, id);
    return out;
  }

  const sortByRank = (items, rank) => items.slice().sort((a, b) => rank[a] - rank[b] || items.indexOf(a) - items.indexOf(b));

  function goalOrder(spec) {
    if (spec.scenario === 'move') return spec.goal.slice();
    const free = sortByRank(spec.items.filter((id) => !(spec.locked && id in spec.locked)), spec.rank);
    return pin(free, spec);
  }

  function orderError(model, spec) {
    const seq = model.order.filter((id) => !(spec.locked && id in spec.locked));
    let e = discord(seq, spec.rank);
    if (spec.locked) {
      let off = 0;
      for (const [id, i] of Object.entries(spec.locked)) if (model.order[i] !== id) off++;
      e += off / spec.items.length;
    }
    return e;
  }

  // Moves left, as a fraction of the cards: each card in a wrong column, plus (ordered boards) each card of a column
  // outside its longest run already in goal order (len - LIS). A card dropped into its own column, or one in-column
  // move toward the order, lowers it by at most one card's worth and never raises it, so a correct step never loses
  // progress (the old 0.6 x misplaced + 0.4 x discordance mix could: a right card appended out of order).
  function kanbanError(model, spec) {
    let wrong = 0;
    for (const [c, items] of Object.entries(model.columns)) for (const it of items) if (spec.member[it] !== c) wrong++;
    if (!spec.ordered) return wrong / spec.items.length;
    let unsorted = 0;
    for (const c of spec.columns) {
      const rank = Object.fromEntries(spec.colGoal[c].map((id, i) => [id, i]));
      const seq = (model.columns[c] || []).filter((id) => id in rank).map((id) => rank[id]);
      unsorted += seq.length - lis(seq);
    }
    return (wrong + unsorted) / spec.items.length;
  }

  // Length of the longest strictly increasing subsequence.
  function lis(seq) {
    const tails = [];
    for (const x of seq) {
      let lo = 0;
      let hi = tails.length;
      while (lo < hi) { const mid = (lo + hi) >> 1; if (tails[mid] < x) lo = mid + 1; else hi = mid; }
      tails[lo] = x;
    }
    return tails.length;
  }

  // ---------------------------------------------------------------- move goals

  function applyMove(order, mv, labels) {
    const o = order.slice();
    const at = (id) => o.indexOf(id);
    const take = (id) => o.splice(at(id), 1)[0];
    if (mv.kind === 'top') { take(mv.x); o.unshift(mv.x); }
    else if (mv.kind === 'bottom') { take(mv.x); o.push(mv.x); }
    else if (mv.kind === 'position') { take(mv.x); o.splice(mv.k, 0, mv.x); }
    else if (mv.kind === 'after') { take(mv.x); o.splice(at(mv.y) + 1, 0, mv.x); }
    else if (mv.kind === 'before') { take(mv.x); o.splice(at(mv.y), 0, mv.x); }
    else if (mv.kind === 'swap' || mv.kind === 'swapName') {
      const i = at(mv.x);
      const j = at(mv.y);
      [o[i], o[j]] = [o[j], o[i]];
    }
    return o;
  }

  function sampleMove(rng, start, kinds) {
    const n = start.length;
    for (let t = 0; t < 50; t++) {
      const kind = rng.pick(kinds || ['top', 'bottom', 'position', 'after', 'before', 'swap', 'swapName']);
      const xi = rng.int(0, n - 1);
      const x = start[xi];
      let mv;
      if (kind === 'top') mv = { kind, x };
      else if (kind === 'bottom') mv = { kind, x };
      else if (kind === 'position') mv = { kind, x, k: rng.int(0, n - 1) };
      else if (kind === 'after' || kind === 'before') mv = { kind, x, y: rng.pick(start.filter((v) => v !== x)) };
      else {
        const yi = rng.pick(start.map((_, i) => i).filter((i) => Math.abs(i - xi) >= 2));
        if (yi === undefined) continue;
        const [a, b] = xi < yi ? [xi, yi] : [yi, xi];
        mv = { kind, x: start[a], y: start[b], i: a, j: b };
      }
      const goal = applyMove(start, mv);
      if (goal.join() !== start.join()) return { mv, goal };
    }
    return { mv: { kind: 'swap', x: start[0], y: start[n - 1], i: 0, j: n - 1 }, goal: applyMove(start, { kind: 'swap', x: start[0], y: start[n - 1] }) };
  }

  // A plausible wrong edit for 'wrong' starts of move episodes.
  function wrongMove(rng, spec) {
    const mv = spec.move;
    const s = spec.start;
    const alt = {
      top: { kind: 'bottom', x: mv.x }, bottom: { kind: 'top', x: mv.x },
      after: { kind: 'before', x: mv.x, y: mv.y }, before: { kind: 'after', x: mv.x, y: mv.y },
      position: { kind: 'position', x: mv.x, k: mv.k > 0 ? mv.k - 1 : mv.k + 1 },
      swap: { kind: 'swap', x: s[Math.min(s.length - 1, mv.i + 1)], y: mv.y },
      swapName: { kind: 'top', x: mv.y },
    }[mv.kind];
    return applyMove(s, alt);
  }

  // Kanban groups in board order: the unassigned staging tray (spec.staging, a group id inside
  // model.columns that no card belongs to) first, then the category columns.
  const STAGING = 'staging';
  const groupsOf = (spec) => (spec.staging ? [spec.staging, ...spec.columns] : spec.columns);

  const visible = (pane, c) => {
    if (!pane || !pane.cols || !pane.cols[c]) return true;
    const [x0, x1] = pane.cols[c];
    return x0 >= pane.scroll - 1 && x1 <= pane.scroll + pane.width + 1;
  };

  // Next kanban edit: { item, col, index | null (append) } or null when solved. Prefers edits whose source
  // and target columns are both visible in the pane.
  function kanbanMoves(model, spec) {
    const out = [];
    // Finish category transfers before sorting within columns. Listing every misplaced card lets the
    // pane plan batch visible transfers instead of repeatedly traversing the board for a fixed prefix.
    for (const c of groupsOf(spec)) {
      for (const it of model.columns[c] || []) if (spec.member[it] !== c) out.push({ item: it, col: spec.member[it], index: null });
    }
    if (out.length) return out;
    if (spec.ordered) {
      for (const c of spec.columns) {
        const cur = model.columns[c] || [];
        const goal = spec.colGoal[c];
        const i = goal.findIndex((id, k) => cur[k] !== id);
        if (i >= 0) out.push({ item: goal[i], col: c, index: i });
      }
    }
    return out;
  }

  const colOf = (model, id) => Object.keys(model.columns).find((c) => model.columns[c].includes(id));

  // Thumb stall: a scroll step towards a target at (or past) the end of the board can be a sub-pixel thumb drag
  // (max is fractional, the pane lands a px short), which the page does not register and the oracle repeats
  // forever. So: compare the clamped (unrounded) target; a short hop to an end of the board is skipped (the
  // plan's padding covers it); other thumb hops are stretched to at least 4 scroll px, room permitting. Not
  // every widget scrolls on the wheel, so there is no wheel fallback on thumb boards.
  function scrollStep(spec, pane, s) {
    s = Math.max(0, Math.min(pane.max, s));
    const d = s - pane.scroll;
    if (Math.abs(d) < 2) return null;
    if (spec.route === 'thumb') {
      if (Math.abs(d) < 8 && (s <= 0 || s >= pane.max)) return null;
      if (Math.abs(d) < 4) s = Math.max(0, Math.min(pane.max, pane.scroll + 4 * Math.sign(d)));
      return { drag: [{ thumb: 'x' }, { thumbAt: Math.round(s) }] };
    }
    return { wheel: [{ pane: 'x' }, 0, Math.round(d)] };
  }

  function kanbanPlan(model, spec) {
    const moves = kanbanMoves(model, spec);
    if (!moves.length) return null;
    const pane = model.pane;
    const dragOf = (mv, col = mv.col, index = mv.index) => ({
      drag: [{ item: mv.item }, index === null ? { column: col, item: mv.item } : { slot: index, column: col, item: mv.item }],
    });
    if (!pane || !pane.cols) return dragOf(moves[0]);
    const both = moves.find((mv) => visible(pane, colOf(model, mv.item)) && visible(pane, mv.col));
    if (both) return dragOf(both);
    // Keep working on cards already in view. When none are visible, visit the nearest source column.
    const sourceDistance = (mv) => {
      const [x0, x1] = pane.cols[colOf(model, mv.item)] || [pane.scroll, pane.scroll];
      return Math.max(pane.scroll - x0, x1 - pane.scroll - pane.width, 0);
    };
    const mv = moves.slice().sort((a, b) => sourceDistance(a) - sourceDistance(b))[0];
    const a = colOf(model, mv.item);
    const g = mv.col;
    const [g0, g1] = pane.cols[g];
    // A source that is not part of the scrolling pane (a staging tray outside it) is always in reach:
    // only the target column has to be brought into view.
    const [a0, a1] = pane.cols[a] || [g0, g1];
    const lo = Math.min(a0, g0);
    const hi = Math.max(a1, g1);
    const pad = 8;
    if (hi - lo + 2 * pad <= pane.width) {
      // Both fit: scroll the least amount that shows the span.
      const s = Math.min(Math.max(pane.scroll, hi + pad - pane.width), lo - pad);
      const st = scrollStep(spec, pane, s);
      if (st) return st;
    }
    if (!visible(pane, a)) {
      const st = scrollStep(spec, pane, a0 < pane.scroll ? a0 - pad : a1 + pad - pane.width);
      if (st) return st;
    }
    // Hop: move the card to the farthest visible column toward its goal, or scroll that way.
    const dir = g0 > a0 ? 1 : -1;
    if (spec.dragScroll && visible(pane, a)) {
      const s = Math.max(0, Math.min(pane.max, (g0 + g1 - pane.width) / 2));
      const drop = mv.index === null ? { column: g, item: mv.item } : { slot: mv.index, column: g, item: mv.item };
      return { path: [{ item: mv.item }, { edge: dir, item: mv.item, scrollAt: s }, { ...drop, scrollAt: s }] };
    }
    const all = groupsOf(spec);
    const ci = all.indexOf(a);
    let h = null;
    for (let k = ci + dir; k >= 0 && k < all.length; k += dir) if (visible(pane, all[k])) h = all[k];
    if (h) return dragOf({ item: mv.item }, h, null);
    const st = scrollStep(spec, pane, dir > 0 ? a0 - pad : a1 + pad - pane.width);
    return st || dragOf(mv);
  }

  // ---------------------------------------------------------------- list plan

  function listPlan(model, spec) {
    const seq = model.order;
    const locked = spec.locked || {};
    const rank = spec.rank;
    for (let i = 0; i < seq.length; i++) {
      if (Object.values(locked).includes(i)) continue;
      const rest = seq.slice(i).filter((id) => !(id in locked));
      const minR = Math.min(...rest.map((id) => rank[id]));
      if (rank[seq[i]] === minR) continue;
      const x = rest.find((id) => rank[id] === minR);
      if (spec.route === 'keys') {
        if (model.focus !== x) return { click: { item: x } };
        return { key: 'ArrowUp' };
      }
      return { drag: [{ item: x }, { slot: i }] };
    }
    return null;
  }

  // Level starts (easy / medium, 'off' mode): a nearly solved board. List / grid / move: the goal order with
  // one (easy) or several (medium) adjacent swaps; kanban: most cards already home, the rest in another column
  // (or in the staging tray).
  function levelStart(spec, rng) {
    const easy = spec.level === 'easy';
    if (spec.scenario === 'kanban') {
      const items = rng.shuffle(spec.items);
      const wrong = Math.max(1, Math.round(items.length * (easy ? 0.25 : 0.5)));
      const columns = Object.fromEntries(groupsOf(spec).map((c) => [c, []]));
      items.forEach((it, i) => {
        const home = spec.member[it];
        const c = i < wrong ? (spec.staging || rng.pick(spec.columns.filter((x) => x !== home))) : home;
        columns[c].push(it);
      });
      return { columns };
    }
    const base = spec.scenario === 'move' ? spec.start.slice() : spec.goal.slice();
    const free = spec.scenario === 'move' ? base : base.filter((id) => !(spec.locked && id in spec.locked));
    const swaps = easy ? 1 : Math.max(2, Math.floor(free.length / 2));
    if (spec.scenario === 'move') {
      // The start of a move task is already unsolved; easy keeps it, medium has nothing more to add.
      return { order: base };
    }
    let f = free.slice();
    for (let t = 0; t < 40; t++) {
      const cand = f.map((_, i) => i).filter((i) => i + 1 < f.length);
      for (let s2 = 0; s2 < swaps; s2++) {
        const i = rng.pick(cand);
        [f[i], f[i + 1]] = [f[i + 1], f[i]];
      }
      if (discord(f, spec.rank) > 0 && (easy || discord(f, spec.rank) >= 0.12)) break;
      f = free.slice();
    }
    if (discord(f, spec.rank) <= 0) f = free.slice().reverse();
    return { order: pin(f, spec) };
  }

  // ---------------------------------------------------------------- round 2: judge modes, facts, silent, retarget

  const ASC_WORDS = ['ascending', 'a to z', 'a-z', 'increasing', 'smallest first', 'lowest first', 'cheapest first', 'earliest first', 'oldest first', 'low to high'];
  const DESC_WORDS = ['descending', 'z to a', 'z-a', 'decreasing', 'largest first', 'highest first', 'most expensive first', 'latest first', 'newest first', 'reverse', 'high to low'];
  const ABSENT_PROPS = ['rating', 'weight', 'author', 'popularity', 'colour', 'last-modified time', 'owner', 'height', 'width', 'duration',
    'sender', 'category', 'brand', 'manufacturer', 'warranty', 'discount', 'stock level', 'region', 'country', 'language', 'format',
    'version', 'license', 'volume', 'speed', 'capacity', 'temperature', 'distance', 'score', 'rank', 'age', 'department'];
  // A thing of the kind the list holds that is not on the page, from the same (large) banks the items come from.
  function ghostOf(jr, spec, have) {
    const bank = {
      fruit: () => C.cap(jr.pick([...C.WORDS, ...CATEGORIES.Fruit, ...CATEGORIES.Animal, ...CATEGORIES.Tool, ...CATEGORIES.Color])),
      first: () => jr.pick(C.FIRST_NAMES),
      city: () => jr.pick(C.CITIES).city,
      product: () => jr.pick(C.PRODUCTS).name,
      file: () => C.fileName(jr),
      task: () => jr.pick(C.EMAIL_SUBJECTS).replace(/^(Re|Fwd): /i, ''),
    }[spec.src] || (() => jr.pick(C.FIRST_NAMES));
    for (let i = 0; i < 200; i++) {
      const g = bank();
      if (g && !/"/.test(g) && g.length <= 30 && !have.has(g.toLowerCase())) return g;
    }
    return `${C.cap(jr.pick(C.WORDS))} ${jr.int(2, 99)}`;
  }

  // Two same-named things are twins (the reply offers each once); the page's other names must not be offered.
  const twins = (name, all) => ({ cands: [[name], [name]], others: [...new Set(all.filter((x) => x !== name))].map((x) => [x]) });

  function judgeOf(jr, spec, mode) {
    const v = spec.scenario;
    const t = (id) => spec.labels[id].title;
    if (mode === 'impossible') {
      if (v === 'kanban') {
        const have = new Set(spec.columns.map((c) => spec.colLabels[c].toLowerCase()));
        const name = jr.pick(C.PRODUCT_CATEGORIES.map((c) => c.label).filter((l) => !have.has(l.toLowerCase())));
        return { mode, what: [name], message: `I can't do that: there is no "${name}" column on the board.`,
          templates: [
            'Move every card into the "{name}" column.', 'Put all the cards in the "{name}" column.',
            'Drag all of the cards to "{name}".', 'I want every card in the "{name}" column.',
            'Have every card end up in "{name}".', 'Make "{name}" the column for every card.'
          ], vars: { name } };
      }
      if (v === 'move') {
        const have = new Set(spec.items.map((id) => t(id).toLowerCase()));
        const x = ghostOf(jr, spec, have);
        return { mode, what: [x], message: `I can't do that: there is no "${x}" in the list.`,
          templates: [
            'Move "{x}" to the top of the list.', 'Put "{x}" first.', 'Drag "{x}" to the bottom of the list.',
            'Make "{x}" the final list item.', 'The list must start with "{x}".', 'Have "{x}" lead the list.'
          ], vars: { x } };
      }
      const key = jr.pick(ABSENT_PROPS);
      return { mode, what: [key], message: `I can't do that: the rows have no ${key} to sort by.`,
        templates: [
          'Sort the {things} by {key}.', 'Reorder the {things} by their {key}.', 'Arrange the {things} by {key}.',
          'Get {things} ordered by {key}.', 'I want {things} sorted by {key}.'
        ], vars: { things: lib.things(jr, spec), key } };
    }
    if (v === 'kanban') {
      const [a, b] = jr.sample(spec.columns, 2);
      spec.colLabels[b] = spec.colLabels[a];
      const label = spec.colLabels[a];
      return { mode, ...twins(label, spec.columns.map((c) => spec.colLabels[c])), message: `Which "${label}" column do you mean? There are two.`,
        templates: ['Put every card in the "{label}" column.', 'Drag all of the cards into the "{label}" column.'], vars: { label } };
    }
    if (v === 'move' || spec.rule.kind === 'legend') {
      // two rows share a title; 'legend' lists name their order on the page, so only the row to move is unclear
      const [x, y] = jr.sample(spec.items, 2);
      spec.labels[y].title = spec.labels[x].title;
      const title = t(x);
      return { mode, ...twins(title, spec.items.map((id) => t(id))), message: `Which "${title}" do you mean? There are two rows with that name.`,
        templates: [
          'Move "{x}" to the top of the list.', 'Put "{x}" first.', 'Drag "{x}" to the bottom of the list.',
          'Let "{x}" be the first list item.', 'The list should end with "{x}".', 'Have "{x}" appear last.'
        ], vars: { x: title } };
    }
    return { mode, cands: [ASC_WORDS, DESC_WORDS], message: 'Should I sort them ascending or descending?',
      templates: [
        'Sort the {things}.', 'Put the {things} in order.', 'Order the {things} for me.',
        'The {things} need sorting.', 'Get {things} sorted.', 'I want {things} ordered.'
      ], vars: { things: lib.things(jr, spec) } };
  }

  function judgeInstruction(spec, rng) {
    const j = spec.judge;
    const core = env.instruct.phrase(rng, j.templates, j.vars, spec.isplit);
    return I.say(rng, core, { isplit: spec.isplit, terse: env.instruct.fill(j.templates[0], j.vars) });
  }

  function factsOf(model, spec) {
    if (spec.judge) return [];
    if (spec.scenario === 'kanban') {
      const out = spec.columns.slice(0, 3).map((c) => ({ label: `${spec.colLabels[c]} cards`, value: String((model.columns[c] || []).length),
        labels: [`Cards in ${spec.colLabels[c]}`] }));
      out.push({ label: 'Cards on the board', value: String(spec.items.length), labels: ['Total cards', 'Cards'] });
      return out;
    }
    const o = model.order;
    // A comma in a title would split the clause in a free-text report: say it without (the grader ignores punctuation).
    const title = (id) => spec.labels[id].title.replace(/,/g, '');
    const noun = spec.scenario === 'grid' ? 'tile' : 'item';
    const out = [
      { label: `First ${noun}`, value: title(o[0]), labels: [`Top ${noun}`, 'First', spec.scenario === 'grid' ? 'Top-left tile' : 'Top row'] },
      { label: `Last ${noun}`, value: title(o[o.length - 1]), labels: [`Bottom ${noun}`, 'Last', spec.scenario === 'grid' ? 'Bottom-right tile' : 'Bottom row'] },
    ];
    if (spec.scenario === 'move') out.push({ label: 'Moved item position', value: String(o.indexOf(spec.move.x) + 1), labels: ['Position', `Position of ${title(spec.move.x)}`] });
    else out.push({ label: `${C.cap(noun)}s in the ${spec.scenario === 'grid' ? 'grid' : 'list'}`, value: String(o.length), labels: ['Count', 'Number of items'] });
    return out;
  }

  // The last change did not stick: see the header.
  function silentOf(next, prev, spec, rng) {
    if (spec.judge) return null;
    const bad = (m) => (spec.scenario === 'kanban' ? kanbanError(m, spec) : orderError(m, spec)) > 0;
    if (spec.scenario === 'kanban') {
      const cands = [];
      for (const c of Object.keys(next.columns)) {
        for (const id of next.columns[c]) {
          const pc = colOf(prev, id);
          if (pc && pc !== c && spec.member[id] === c) cands.push(id);
        }
      }
      if (cands.length) {
        const id = rng.pick(cands);
        const from = colOf(prev, id);
        const cols = env.util.clone(next.columns);
        for (const c of Object.keys(cols)) cols[c] = cols[c].filter((x) => x !== id);
        cols[from].splice(Math.min(cols[from].length, prev.columns[from].indexOf(id)), 0, id);
        const out = { ...next, columns: cols };
        return bad(out) ? out : null;
      }
      // an in-column move: the card lands one place short of where it was dropped
      for (const c of rng.shuffle(spec.columns)) {
        const a = next.columns[c] || [];
        const pa = prev.columns[c] || [];
        const id = a.find((x, i) => pa.includes(x) && pa.indexOf(x) !== i);
        if (!id) continue;
        const i = a.indexOf(id);
        const j = i + (pa.indexOf(id) > i ? 1 : -1);
        if (j < 0 || j >= a.length) continue;
        const cols = env.util.clone(next.columns);
        [cols[c][i], cols[c][j]] = [cols[c][j], cols[c][i]];
        const out = { ...next, columns: cols };
        if (bad(out)) return out;
      }
      return null;
    }
    let best = null;
    let bd = 0;
    next.order.forEach((id, i) => {
      const d = Math.abs(prev.order.indexOf(id) - i);
      if (d > bd && !(spec.locked && id in spec.locked)) { bd = d; best = id; }
    });
    if (!best) return null;
    const i = next.order.indexOf(best);
    for (const step of [prev.order.indexOf(best) > i ? 1 : -1, prev.order.indexOf(best) > i ? -1 : 1]) {
      const j = i + step;
      if (j < 0 || j >= next.order.length) continue;
      const o = next.order.slice();
      [o[i], o[j]] = [o[j], o[i]];
      const out = { ...next, order: pin(o, spec) };
      if (bad(out)) return out;
    }
    return null;
  }

  // Same items, a new goal: see the header.
  function retargetOf(spec, model, rng) {
    if (spec.judge) return null;
    const v = spec.scenario;
    const out = [];
    if (v === 'list' || v === 'grid') {
      if (spec.rule.kind === 'legend') return null;
      const ns = env.util.clone(spec);
      ns.rule.dir = spec.rule.dir === 'asc' ? 'desc' : 'asc';
      for (const id of ns.items) ns.rank[id] = -spec.rank[id];
      ns.goal = goalOrder(ns);
      out.push(ns);
    } else if (v === 'move') {
      for (let k = 0; k < 8; k++) {
        const { mv, goal } = sampleMove(rng, model.order.slice());
        const ns = env.util.clone(spec);
        ns.start = model.order.slice();
        ns.move = mv;
        ns.goal = goal;
        ns.rank = Object.fromEntries(goal.map((id, i) => [id, i]));
        out.push(ns);
      }
    } else {
      const price = (id) => Number(String(spec.labels[id].value || '').replace(/[^0-9.]/g, ''));
      const hasPrice = spec.items.every((id) => spec.labels[id].value);
      for (const rule of hasPrice ? ['price-asc', 'price-desc', 'alpha'] : ['alpha']) {
        if (spec.ordered && rule === spec.orderRule) continue;
        const colGoal = {};
        for (const c of spec.columns) {
          const its = spec.items.filter((id) => spec.member[id] === c);
          colGoal[c] = its.sort((a, b) => (rule === 'alpha' ? spec.labels[a].title.localeCompare(spec.labels[b].title, 'en')
            : rule === 'price-asc' ? price(a) - price(b) : price(b) - price(a)));
        }
        out.push({ ...env.util.clone(spec), ordered: true, orderRule: rule, colGoal });
      }
    }
    const ok = out.filter((ns) => (v === 'kanban' ? kanbanError(model, ns) : orderError(model, ns)) > 0);
    return ok.length ? rng.pick(ok) : null;
  }

  // ---------------------------------------------------------------- task

  const SCENARIOS = ['list', 'grid', 'kanban', 'move'];

  const lib = { CATEGORIES, STAGING, SCENARIOS, sampleMove, goalOrder, judgeInstruction,
    listPlan, kanbanPlan, orderError, kanbanError, discord };

  env.task({
    name: 'reorder-items',
    files: ['sampling.js', 'instructions.js'],
    scenarios: SCENARIOS,
    startModes: ['off', 'partial', 'wrong', 'solved', 'scene'],
    judgeModes: ['ambiguous', 'impossible'],
    inputs: (spec) => {
      const k = ['pointer'];
      if (spec && spec.keys) k.push('keyboard');
      if (spec && spec.pane) k.push('wheel');
      return k;
    },
    helpers: { pin },
    lib,

    sample(rng, opts) {
      const spec = lib.sampleSpec(rng, opts);
      if (this.judgeModes.includes(opts.judge)) {
        const j = judgeOf(rng.fork('judge'), spec, opts.judge);
        if (j) spec.judge = j;
      }
      return spec;
    },

    init(spec, rng) {
      // ambiguous / impossible: nothing to change, the page starts solved
      if (spec.judge) return this.solve(spec, this.init({ ...spec, judge: undefined }, rng));
      const mode = spec.startMode;
      if (spec.level && mode === 'off') return levelStart(spec, rng.fork('level'));
      if (spec.scenario === 'kanban') {
        const columns = Object.fromEntries(groupsOf(spec).map((c) => [c, []]));
        // Staging tray: off and scene starts hold every card in the tray (columns empty), partial starts
        // place about half of them; wrong starts are the usual one-column-off boards with an empty tray.
        // No rng draws for the off / scene case (spec.items is already shuffled).
        if (spec.staging && (mode === 'off' || mode === 'scene')) {
          columns[spec.staging] = spec.items.slice();
          return { columns };
        }
        const items = rng.shuffle(spec.items);
        const others = (c) => spec.columns.filter((x) => x !== c);
        items.forEach((it, i) => {
          const home = spec.member[it];
          let c;
          if (mode === 'wrong') c = spec.columns[(spec.columns.indexOf(home) + 1) % spec.columns.length];
          else if (mode === 'partial') c = i % 2 ? home : spec.staging ? spec.staging : rng.pick(others(home));
          else if (spec.pane) c = rng.bool(0.6) ? rng.pick(others(home)) : home;
          else c = rng.pick(spec.columns);
          columns[c].push(it);
        });
        if (spec.ordered && mode === 'partial') {
          // Placed columns may still be out of order.
          for (const c of spec.columns) columns[c] = rng.shuffle(columns[c]);
        }
        return { columns };
      }
      if (spec.scenario === 'move') {
        if (mode === 'wrong') return { order: wrongMove(rng, spec) };
        if (mode === 'partial') {
          // One step of the edit: the first item placed, but not the second (swaps), or halfway there.
          const g = spec.goal;
          const s = spec.start.slice();
          const i = s.findIndex((id, k) => id !== g[k]);
          const x = g[i];
          const p = s.indexOf(x);
          s.splice(p, 1);
          s.splice(Math.round((i + p) / 2) === p ? i : Math.round((i + p) / 2), 0, x);
          return { order: s.join() === g.join() ? spec.start.slice() : s };
        }
        return { order: spec.start.slice() };
      }
      const goal = spec.goal;
      if (mode === 'wrong') {
        const free = goal.filter((id) => !(spec.locked && id in spec.locked)).reverse();
        return { order: pin(free, spec) };
      }
      if (mode === 'partial') {
        const free = goal.filter((id) => !(spec.locked && id in spec.locked));
        const r = spec.rank;
        // Displace one item by 2-3 places, or swap one adjacent pair of different rank.
        const cand = free.map((_, i) => i).filter((i) => i + 1 < free.length && r[free[i]] !== r[free[i + 1]]);
        const i = rng.pick(cand.length ? cand : [0]);
        const f = free.slice();
        if (rng.bool(0.5) || free.length < 4) [f[i], f[i + 1]] = [f[i + 1], f[i]];
        else {
          const x = f.splice(i, 1)[0];
          f.splice(Math.min(f.length, i + rng.int(2, 3)), 0, x);
        }
        return { order: pin(f, spec) };
      }
      return { order: pin(rng.shuffle(spec.items), spec) };
    },

    error(model, spec) {
      return spec.scenario === 'kanban' ? kanbanError(model, spec) : orderError(model, spec);
    },

    // Exact order (or every card in place) required; the Gaussian width gives partial credit.
    tolerance(spec) {
      if (spec.level === 'easy') return { tau: 0, sigma: spec.scenario === 'kanban' ? 0.5 : 0.3, minInitialError: 1e-6 };
      if (spec.level === 'medium') return { tau: 0, sigma: spec.scenario === 'kanban' ? 0.4 : 0.22, minInitialError: 1e-6 };
      if (spec.scenario === 'move') return { tau: 0, sigma: 0.08, minInitialError: 1e-6 };
      if (spec.scenario === 'kanban') return { tau: 0, sigma: 0.3, minInitialError: 0.2 };
      return { tau: 0, sigma: 0.15, minInitialError: 0.2 };
    },

    instruction(spec, rng) {
      return lib.instructionOf(spec, rng);
    },

    plan(model, spec) {
      return spec.scenario === 'kanban' ? kanbanPlan(model, spec) : listPlan(model, spec);
    },

    facts: factsOf,
    // preempt=cancel: each item by title; value: the column a kanban card sits in (the tray is 'unplaced'), else the item's
    // place in the list (so moving a row also changes the rows it passes).
    parts: (model, spec) => (spec.scenario === 'kanban' ? spec.items.map((id) => {
      const col = Object.keys(model.columns).find((c) => model.columns[c].includes(id));
      return { name: spec.labels[id].title, value: col && col !== STAGING ? spec.colLabels[col] : 'unplaced' };
    }) : model.order.map((id, i) => ({ name: spec.labels[id].title, value: i + 1 }))),
    silent: silentOf,
    retarget: retargetOf,

    solve(spec, model) {
      if (spec.scenario === 'kanban') {
        const columns = Object.fromEntries(groupsOf(spec).map((c) => [c, []]));
        if (spec.ordered) for (const c of spec.columns) columns[c] = spec.colGoal[c].slice();
        else for (const item of spec.items) columns[spec.member[item]].push(item);
        return { ...(model || {}), columns };
      }
      return { ...(model || {}), order: spec.goal.slice() };
    },

  });
})();
