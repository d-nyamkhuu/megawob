/*
 * read-figure: look at a figure, read it, then answer by clicking (or typing a number).
 * MiniWoB counterparts: click-color, click-shades, click-shape, identify-shape, count-shape, count-sides,
 * find-greatest, grid-coordinate, visual-addition, ascending-numbers, number-checkboxes. Real-world additions:
 * spatial relations, icon sets, very small items, counting across a scroll pane, near-duplicate color names.
 * Inputs: pointer; 'keyboard' only when the answer is typed (count / scroll-count with answer 'typed',
 * addition); 'wheel' in scroll-count (the list pane scrolls).
 *
 * scenarios
 *   color       click-color: 4-8 swatches (ood 10-12); click the one named in the instruction (mode 'name') or
 *               the one matching a sample swatch (mode 'sample'). palette 'basic' (distinct names, SWATCHES)
 *               or 'fine' (FINE: near-duplicate names such as teal / cyan / turquoise, graded by CIEDE2000)
 *   shades      click-shades: 9-16 tiles (ood 20-25) of shades of red, green or blue; select every tile of the
 *               named hue task. select 'toggle' (each click toggles) or 'modifier' (a plain click selects
 *               only that tile; Ctrl+click adds / removes, as in file pickers)
 *   shape       click-shape: letters, digits and shapes in the cells of a board; click an item matching a lossy
 *               description ("a large red item", "a digit 7"). tiny: every item is drawn very small
 *   identify    identify-shape: one big figure; click the button that describes it
 *   count       mode 'shapes' (count matching items, may be 0) or 'sides' (sides of a polygon); answer
 *               'buttons' or 'typed'
 *   greatest    find-greatest: 3-6 cards (ood 7-8); mode 'cards' (face down, one face up at a time) or 'open'
 *   grid        grid-coordinate: click the dot at (x, y) on a labelled plane (ood: wider ranges)
 *   addition    visual-addition: type the total of two block groups (ood: 11-18 blocks per group)
 *   ascending   click number tiles in ascending order (mode 'hide': numbers hide after the first click)
 *   number-checkboxes  copy a digit (7x4) or a random pattern into a grid of checkboxes
 *   spatial     items (glyphs or icons) on a board; click the item defined by a spatial relation: rel
 *               'left' | 'right' | 'above' | 'below' of an anchor item (nearest in the same row / column), or
 *               'nth' (the n-th item counted from one side of a given row or column)
 *   icon        a board of UI icons (ICONS: gear, bell, trash, ...); click the one named (or described by an
 *               alias, "the settings icon"), with its color when the icon kind repeats; tiny boards too
 *   scroll-count  a list pane of rows (icon + label) that shows spec.view rows at a time; count the rows
 *               with a given icon (and color) across the whole list, then answer ('buttons' | 'typed').
 *               route 'wheel' | 'thumb': how the oracle scrolls (mouse wheel over the pane, or dragging the
 *               pane's scrollbar). The oracle scrolls to the end before answering
 *
 * Levels (opts.level easy | medium, normal unchanged): the sampled episode is pruned in place from
 * rng.fork('level') (levelAdjust): color: 3 / 5 swatches (the farthest names on the fine palette); shades: at
 * most 2 / 3 tiles per hue, toggle select on easy; shape, icon, spatial, count: fewer decoy items, no tiny items;
 * identify: 3 / 4 options; count sides: at most 5 / 6 sides; greatest: 3 / 4 cards; grid: a smaller plane;
 * addition: terms up to 5 / 8; ascending: 3 / 4 tiles; number-checkboxes: a 4x4 pattern of 5 boxes on easy,
 * sparser patterns on medium; scroll-count: a shorter list. The right answer stays reachable.
 *
 * Opt-in widget traits (each drawn from its own rng fork, so widgets without them keep their specs):
 *   traits.glyphs   ['line' | 'symbol' | 'emoji', ...] -> spec.glyphs in spatial (set 'icons'), icon and scroll-count:
 *               the icon kinds come from that glyph set instead of ICONS. 'symbol' = GLYPHS.symbol (monochrome
 *               DejaVu Sans text glyphs, drawn in the item color); 'emoji' = GLYPHS.emoji (Noto Color Emoji, the
 *               colors are intrinsic: every item / row and desc has color null, the icon target is unique by kind)
 *   traits.contrast ['normal' | 'low', ...] -> spec.contrast in shape, identify, count, spatial, icon, scroll-count:
 *               'low' draws items in LOW_ITEM_COLORS (same names) on LOW_BOARD; the self-test keeps every item >= 18
 *               CIEDE2000 from the board and every pair >= 12, so color descriptions stay answerable
 * opts.route (episode knob; undefined = the mixes above): count and scroll-count: 'keyboard' -> answer 'typed',
 *   'pointer' -> answer 'buttons' (scroll-count also route 'thumb', and 'wheel' leaves inputs()); scroll-count
 *   'wheel' -> route 'wheel'. Applied after all draws; spec.forcedRoute records the honoured value. Other
 *   scenarios ignore it (addition is typed only, the rest pointer only).
 *
 * Final choices and the episode end
 *   Single-answer scenarios (color, shape, identify, grid, spatial, icon, count and scroll-count with answer
 *   'buttons') record the answer in model.answer and lock it. Non-recoverable episodes end on the first
 *   wrong answer (ended() -> 'wrong-choice'), as in MiniWoB. Recoverable episodes (spec.recoverable =
 *   opts.recover ?? 50%; forced on for 'wrong' starts) show "Answer recorded" with an Undo control after any
 *   answer; a wrong answer keeps its error until undone, and a second wrong answer ends the episode.
 *   ascending: an out-of-order click ends at once, or (recoverable) shows "Out of order" + Undo and carries
 *   a 0.5/n penalty until undone; a second wrong click ends ('wrong-order'). Other scenarios change freely.
 *
 * spec   { scenario, isplit, csplit, ood, startMode, recoverable, ... }
 *   color       mode, palette, colors: [names], hex: [hex per swatch], target (index)
 *   shades      cols, tiles: [{ task, h, s, l }], target (task), select ('toggle' | 'modifier')
 *   shape       cols, rows, items: [{ kind, text, color, size ('large' | 'small' | 'tiny'), c, r }], desc, tiny
 *   identify    figure: { kind, text, color, x, y, scale }, options: [keys], truth
 *   count       mode, answer, truth, options; shapes: cols, rows, items, desc; sides: sides, rot, scale, color
 *   greatest    mode, values
 *   grid        xr, yr, target: [x, y]
 *   addition    a, b, truth
 *   ascending   mode, values, cells: [{ c, r, jx, jy }], gw, gh, order
 *   number-checkboxes  mode, digit, rows, cols, pattern
 *   spatial     cols, rows, set ('glyphs' | 'icons'), items: [{ kind, text, color, c, r }], query: { rel,
 *               anchor (index) | line ('row' | 'col'), index (row/col number), from ('left' | 'right' | 'top'
 *               | 'bottom'), n (1-based) }, target (index)
 *   icon        cols, rows, items: [{ kind: 'icon', text (icon name), color, size, c, r }], desc: { text,
 *               color|null, alias (the word the instruction uses) }, tiny
 *   scroll-count  rows: [{ icon, color, label, meta }], view, desc: { icon, color|null }, truth, answer,
 *               options, route
 *   opt-in      glyphs? ('line' | 'symbol' | 'emoji'), contrast? ('normal' | 'low'), forcedRoute? (opts.route)
 * model
 *   single-answer  { clicks: [keys], answer: key | null, wrong: n, text } keys: swatch index (color), item
 *               index (shape, spatial, icon), option key (identify), number (count, scroll-count), 'x,y' (grid)
 *   scroll-count also { top (first visible row, float), seen (last row index seen) } (unscored view state)
 *   typed       { text } (count / scroll-count 'typed' keep the single-answer fields too)
 *   shades      { selected: [tile indices] }
 *   greatest    { up: index | null, seen: [indices] }
 *   addition    { text }
 *   ascending   { clicks: [tile indices], wrong }
 *   number-checkboxes  { on: [cell indices r * cols + c] }
 * error (tau 0 everywhere)
 *   color basic, shape, identify, spatial, icon: 0 for a correct answer, else 1 (no answer 1)
 *   color fine: min(1, CIEDE2000(answer, target) / 40)
 *   count, scroll-count, addition: |answer - truth| capped at 5 (no answer: 5)
 *   grid: Euclidean distance to the target dot, capped at 3
 *   shades: 1 - Jaccard; greatest: (max - face-up value) / (max - min); ascending: 1 - prefix / n (+0.5/n
 *   while a wrong click stands); number-checkboxes: differing cells / pattern cells
 *
 * plan targets (the widget's locate() maps them to viewport px)
 *   { swatch: i } { tile: i } { item: i } { option: key } { field: 'answer' } { card: i } { point: [x, y] }
 *   { number: i } { cell: i } { undo: true } (the result bar's Undo) { pane: true } (a point inside the
 *   scroll-count list) { thumb: true } (its scrollbar thumb) { scroll: s } (where the thumb's center must be
 *   released so that row s is at the top)
 * plan steps: { click } everywhere; { click, modifiers: ['Control'] } (shades 'modifier'); { type } for typed
 *   answers; { wheel: [{ pane: true }, 150] } or { drag: [{ thumb: true }, { scroll: s }] } in scroll-count.
 *
 * Round 2 hooks (optional, pure; see the html/kit/env.js header)
 *   facts(model, spec)       what the page still shows of the answer: count "Count" / "Number of sides", scroll-count
 *                            "Matching rows" (the typed text or the pressed button), addition "Total" + "First group" /
 *                            "Second group" (the block counts), shades "Selected tiles" (check badges), number-checkboxes
 *                            "Checked boxes", greatest "Highest value" (the face-up card), shape / spatial "Selected item"
 *                            (the ringed item's glyph or name). [] for color, identify, grid and icon (the chosen thing is
 *                            exactly what the instruction names, nothing else is shown), ascending (tiles disappear) and
 *                            before an answer; the task's facts() then lists the labels and values of the solved page, so the
 *                            report request names them from the start, and a value with a comma also accepts the part before it.
 *                            Label paraphrases go in labels, aliases are other spellings of the value.
 *   silent(next, prev, spec, rng)   an interaction that did not stick: shades / number-checkboxes the tile or box just
 *                            toggled goes back (a removed wrong one comes back), ascending the last click is undone (the tile
 *                            returns), greatest the card flips back, typed answers (count / scroll-count typed, addition) lose
 *                            their last character. null for the single-answer scenarios (a wrong answer ends the episode at
 *                            once, or is shown as a recorded wrong answer: not silent) and whenever the result would not be
 *                            wrong.
 *   retarget(spec, model, rng)   a new question about the same board: color another swatch, shades another hue task, shape
 *                            another description, count (shapes) another description (options redrawn), grid another dot,
 *                            number-checkboxes another digit / pattern, spatial another relation or nth item, icon another
 *                            icon, scroll-count another icon / color. null for identify, count sides, greatest, addition
 *                            (the figure is the question), ascending and once a single answer is locked.
 *   judgeModes impossible only (every scenario, spec.judge = { mode, what, templates, vars, message }; the page starts solved;
 *                            what: [the missing thing as the goal names it, other short ways to say it], which the reply must name):
 *                            the named thing is not on the page: a swatch color, a hue task, a letter, an answer button,
 *                            a second board / polygon / list / example / group, a card number past the last, a dot outside the
 *                            plane, a tile number, an anchor item or an icon the board lacks. No ambiguous mode (the
 *                            descriptions are lossy on purpose, any match counts) and no confirm (answers are recoverable or
 *                            end the episode).
 *
 * Start modes: off, partial (half the shades / checkboxes / ascending clicks; greatest: some cards seen;
 * scroll-count: list scrolled halfway), wrong (a wrong answer recorded (recoverable), wrong tiles / cells,
 * a lower card, a wrong typed number, an out-of-order click), solved.
 * Deviations from MiniWoB: graded errors; recoverable answers; the scenarios after number-checkboxes.
 * Helpers (widget API, env.taskDef.helpers):
 *   ITEM_COLORS: normal board item palette (name -> hex).
 *   GLYPHS: symbol / emoji sets (name -> [character, aliases]).
 *   itemColors(spec): { colors, board|null } for the spec's contrast mode.
 *   isSingle(spec): whether the scenario records one locked answer.
 *   clickError(spec, key): graded error of one answer.
 * Tests live in tasks/read-figure/selftest.js (checker and Node harness only).
 *
 * Files (files: [...] below, loaded in order after this one): scenarios/<scenario>.js, one env.scenario('read-figure', {...})
 * object per scenario. This file holds the shared helpers (lib) and dispatches to the objects; the hooks an object has
 * are listed above the dispatch section.
 */
(function () {
  'use strict';

  // ---------------------------------------------------------------- content

  // Distinct named colors (no two easily confused names in the bank).
  const SWATCHES = {
    red: '#e03131', orange: '#f76707', yellow: '#fcc419', green: '#2f9e44', cyan: '#22b8cf', blue: '#1c4fd6',
    purple: '#7b2fd9', pink: '#f783ac', brown: '#8d5524', gray: '#868e96', black: '#1b1b1f', white: '#ffffff',
  };
  // Near-duplicate color names (fine palette), graded by CIEDE2000.
  const FINE = {
    teal: '#0f7c80', cyan: '#1fc0d6', turquoise: '#3ad6be', navy: '#1b2a6b', blue: '#1f5fd6', 'sky blue': '#62b6ef',
    indigo: '#4b2fa8', violet: '#9159d9', purple: '#6c248c', lavender: '#b9a5e8', magenta: '#d42a9b', pink: '#f28cb8',
    crimson: '#c8143c', red: '#e53030', maroon: '#7a1a2a', salmon: '#f08a6c', coral: '#ff6a45', orange: '#f57c12',
    amber: '#f5b014', gold: '#d4a017', yellow: '#f5dc32', olive: '#7a7a1c', lime: '#9ad62f', green: '#2e9d44',
    'forest green': '#1f5e30', mint: '#93e2b4', brown: '#8b5a2b', tan: '#d2b48c', beige: '#eee2c4', khaki: '#c3b77a',
    gray: '#888c93', charcoal: '#3a3e45', silver: '#c4c8ce',
  };
  // Item colors on a light board: all dark enough to read on white, mutually distinct.
  const ITEM_COLORS = { red: '#e03131', orange: '#f76707', green: '#2f9e44', blue: '#1c63d6', purple: '#8031d4', black: '#212529' };
  const LETTERS = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // no I or O (confusable with 1 and 0)
  const DIGITS = '0123456789';
  const SHAPES = ['circle', 'square', 'triangle', 'diamond', 'star'];
  // UI icons (the widget draws them): name -> words a person might use for it.
  const ICONS = {
    home: ['house', 'home page'], gear: ['settings', 'cog'], bell: ['notifications', 'alerts'], heart: ['like', 'love'],
    mail: ['envelope', 'email', 'messages'], trash: ['delete', 'bin', 'trash can'], search: ['magnifying glass', 'magnifier'],
    user: ['profile', 'person', 'account'], lock: ['padlock', 'security'], cloud: ['sync', 'cloud storage'],
    camera: ['photo', 'snapshot'], calendar: ['date', 'schedule'], star: ['rating', 'star rating'], download: ['download arrow', 'save to disk'],
    pencil: ['edit', 'rename'], folder: ['directory', 'files'], plus: ['add', 'new item'], flag: ['report', 'flagged'],
    pin: ['location', 'map pin'], clock: ['time', 'history'],
  };
  const ICON_NAMES = Object.keys(ICONS);
  // Font glyph sets (opt-in, widget trait 'glyphs'): name -> [character, aliases]. 'symbol' is monochrome text
  // glyphs from DejaVu Sans (fonts-dejavu-core; text presentation forced with U+FE0E, none of them has default
  // emoji presentation), drawn in the item color. 'emoji' is Noto Color Emoji (fonts-noto-color-emoji in the
  // Docker image): the colors are part of the glyph, so emoji items have color null and are never told apart
  // by color.
  const GLYPHS = {
    symbol: {
      gear: ['\u2699', ['settings', 'cog']], heart: ['\u2665', ['like', 'love']], mail: ['\u2709', ['envelope', 'email']],
      cloud: ['\u2601', ['cloud storage', 'sync']], star: ['\u2605', ['rating', 'favorite']], pencil: ['\u270E', ['edit', 'rename']],
      flag: ['\u2691', ['report', 'flagged']], plus: ['\u271A', ['add', 'new item']], phone: ['\u260E', ['telephone', 'call']],
      scissors: ['\u2702', ['cut', 'clip']], music: ['\u266B', ['music note', 'audio']], umbrella: ['\u2602', ['rain', 'weather']],
      sun: ['\u2600', ['brightness', 'sunny']], plane: ['\u2708', ['airplane', 'flight']], snowflake: ['\u2744', ['snow', 'freeze']],
      check: ['\u2714', ['check mark', 'done']], warning: ['\u26A0', ['alert', 'caution']], recycle: ['\u267B', ['recycling', 'reuse']],
      keyboard: ['\u2328', ['typing', 'keys']], cross: ['\u2716', ['close', 'remove']], skull: ['\u2620', ['danger', 'poison']],
    },
    emoji: {
      house: ['\u{1F3E0}', ['home', 'home page']], bell: ['\u{1F514}', ['notifications', 'alerts']],
      trash: ['\u{1F5D1}\uFE0F', ['delete', 'bin']], search: ['\u{1F50D}', ['magnifying glass', 'magnifier']],
      lock: ['\u{1F512}', ['padlock', 'security']], camera: ['\u{1F4F7}', ['photo', 'snapshot']],
      calendar: ['\u{1F4C5}', ['date', 'schedule']], folder: ['\u{1F4C1}', ['directory', 'files']],
      pin: ['\u{1F4CD}', ['location', 'map pin']], clock: ['\u{1F552}', ['time', 'history']],
      rocket: ['\u{1F680}', ['launch', 'deploy']], gift: ['\u{1F381}', ['present', 'reward']],
      book: ['\u{1F4D6}', ['read', 'docs']], lightbulb: ['\u{1F4A1}', ['idea', 'tip']], key: ['\u{1F511}', ['password', 'access']],
      chart: ['\u{1F4C8}', ['stats', 'growth chart']], globe: ['\u{1F310}', ['web', 'language']],
      battery: ['\u{1F50B}', ['power', 'charge']], package: ['\u{1F4E6}', ['parcel', 'box']], fire: ['\u{1F525}', ['hot', 'trending']],
      trophy: ['\u{1F3C6}', ['award', 'winner']], cart: ['\u{1F6D2}', ['shopping cart', 'basket']],
    },
  };
  // Names and aliases of the icon kinds of a spec's glyph set ('line' = ICONS, drawn by the widget as SVG).
  const glyphNames = (glyphs) => (glyphs && GLYPHS[glyphs] ? Object.keys(GLYPHS[glyphs]) : ICON_NAMES);
  const glyphAliases = (glyphs, name) => (glyphs && GLYPHS[glyphs] ? GLYPHS[glyphs][name][1] : ICONS[name]);
  // Low-contrast item palette (opt-in, widget trait 'contrast'): the same color names, washed out, on a darker
  // board. The self-test keeps every item >= 18 CIEDE2000 from the board and every pair >= 12.
  const LOW_BOARD = '#dedad2';
  const LOW_ITEM_COLORS = { red: '#d08a84', orange: '#d4a674', green: '#93b592', blue: '#8ea6d2', purple: '#b59bd0', black: '#6b6965' };
  const CAP = 5; // count / addition error cap
  const GRID_CAP = 3;

  // MiniWoB number-checkboxes digit patterns (7 rows x 4 columns).
  const DIGIT_PATTERNS = [
    ['0110', '1001', '1001', '1001', '1001', '1001', '0110'],
    ['0010', '0110', '0010', '0010', '0010', '0010', '0010'],
    ['0110', '1001', '1001', '0010', '0100', '1000', '1111'],
    ['0110', '1001', '0001', '0110', '0001', '1001', '0110'],
    ['1000', '1010', '1010', '1111', '0010', '0010', '0010'],
    ['1111', '1000', '1000', '1110', '0001', '1001', '0110'],
    ['0110', '1001', '1000', '1110', '1001', '1001', '0110'],
    ['1111', '1001', '0001', '0010', '0010', '0100', '0100'],
    ['0110', '1001', '1001', '0110', '1001', '1001', '0110'],
    ['0110', '1001', '1001', '0111', '0001', '1001', '0110'],
  ].map((rows) => rows.map((r) => [...r].map(Number)));

  const SINGLE = new Set(['color', 'shape', 'identify', 'grid', 'spatial', 'icon']);
  const isSingle = (spec) => SINGLE.has(spec.scenario) || ((spec.scenario === 'count' || spec.scenario === 'scroll-count') && spec.answer === 'buttons');
  const isTyped = (spec) => spec.scenario === 'addition' || ((spec.scenario === 'count' || spec.scenario === 'scroll-count') && spec.answer === 'typed');
  const hasEnding = (spec) => isSingle(spec) || spec.scenario === 'ascending';
  const wrongLimit = (spec) => (spec.recoverable ? 2 : 1);

  // ---------------------------------------------------------------- color math (CIEDE2000)

  const fromHex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const dE = (h1, h2) => deltaE00(srgbToLab(fromHex(h1)), srgbToLab(fromHex(h2)));

  // ---------------------------------------------------------------- items and descriptions

  function sampleItem(rng) {
    const r = rng.next();
    const kind = r < 0.4 ? 'letter' : r < 0.6 ? 'digit' : 'shape';
    const text = kind === 'letter' ? rng.pick(LETTERS) : kind === 'digit' ? rng.pick(DIGITS) : rng.pick(SHAPES);
    return { kind, text, color: rng.pick(Object.keys(ITEM_COLORS)), size: rng.bool() ? 'large' : 'small' };
  }

  function sampleBoard(rng, cols, rows, n, make = sampleItem) {
    const cells = [];
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) cells.push([c, r]);
    return rng.sample(cells, n).map(([c, r]) => ({ ...make(rng), c, r }));
  }

  // Lossy description of an item (MiniWoB shapes.generalDesc). specific: may name the exact letter/digit.
  function describe(rng, item, specific, noSize) {
    const size = !noSize && rng.bool() ? item.size : null;
    const color = rng.bool() ? item.color : null;
    let kind = null;
    let text = null;
    if (rng.bool() || (!size && !color)) {
      kind = item.kind;
      if (rng.bool() && (specific || item.kind === 'shape')) text = item.text;
    }
    return { size, color, kind, text };
  }

  function matches(item, d) {
    return (!d.size || item.size === d.size) && (!d.color || item.color === d.color)
      && (!d.kind || item.kind === d.kind) && (!d.text || item.text === d.text);
  }

  function nounOf(d, plural) {
    let n;
    if (d.text) n = d.kind === 'shape' ? d.text : `${d.kind} ${d.text}`;
    else n = d.kind || 'item';
    if (!plural) return n;
    return d.text && d.kind !== 'shape' ? `${d.kind}s ${d.text}` : `${n}s`;
  }

  function phrase(d, plural) {
    const words = [d.size, d.color, nounOf(d, plural)].filter(Boolean).join(' ');
    if (plural) return words;
    return (/^[aeiou]/.test(words) ? 'an ' : 'a ') + words;
  }

  // Short name of one board item (spatial anchors): "red star", "blue letter K", "green bell icon".
  function itemName(it, withColor = true) {
    const noun = it.kind === 'icon' ? `${it.text} icon` : it.kind === 'shape' ? it.text : `${it.kind} ${it.text}`;
    return withColor && it.color ? `${it.color} ${noun}` : noun;
  }

  // ---------------------------------------------------------------- sampling

  // o.glyphs 'emoji': the drawn color is still consumed (same draws) but the item gets color null.
  function sampleIconItem(rng, pool, o) {
    const it = { kind: 'icon', text: rng.pick(pool), color: rng.pick(Object.keys(ITEM_COLORS)), size: 'large' };
    if (o && o.glyphs === 'emoji') it.color = null;
    return it;
  }

  // ---------------------------------------------------------------- difficulty ladder

  // opts.level 'easy' (lv 1) / 'medium' (lv 0.5): the sampled episode is pruned in place (fewer swatches, tiles,
  // items, cards, rows; smaller numbers and ranges; no tiny items), drawing only from the 'level' fork, so
  // normal samples exactly what it always did. What the instruction names, and the right answer, stay.
  const { srgbToLab, deltaE00 } = env.util;

  // ---------------------------------------------------------------- dispatch: one object per scenario
  //
  // Each scenarios/<scenario>.js registers env.scenario('read-figure', { name, ... }); the functions below call its hooks (all optional
  // unless noted; the extra arguments after spec / model are the helpers the common code builds for them):
  //   sample(rng, o) (required: the scenario's spec fields), level(spec, lv, r, easy, k, untiny) (easy / medium pruning, in
  //   place), tolerance(spec) (default sigma 0.5)
  //   single-answer scenarios: clickError(spec, key) (error of a clicked key), correctKey(spec), wrongKey(spec, rng)
  //   (start mode 'wrong'); multi-click scenarios (shades, greatest, ascending, number-checkboxes): start(spec, rng, mode, half)
  //   and error(model, spec)
  //   oracle: planStep(model, spec) (the next step), solve(spec, model, m) (a solved model of the multi-click scenarios)
  //   text: instruction(spec, rng, T, say), judgeAsk(jr, spec, ph) (the phantom of judge=impossible)
  //   Round 2: factRows(model, spec, ans), silentEdit(next, prev, spec, rng, wrong), retargetEdit(spec, model, rng, out)
  //   self-test: selfCheck(spec, tag, fails) (scenario-specific spec checks)

  const V = env.scenariosOf('read-figure');

  function levelAdjust(spec, lv, r) {
    const untiny = (items) => { if (spec.tiny) { for (const it of items) it.size = 'large'; spec.tiny = false; } };
    return V[spec.scenario].level(spec, lv, r, untiny);
  }

  // ---------------------------------------------------------------- scoring

  function parseAnswer(text) {
    const t = String(text ?? '').trim();
    return /^-?\d+$/.test(t) ? Number(t) : null;
  }

  const gridKey = (p) => `${p[0]},${p[1]}`;

  // Error of one final answer (single-answer scenarios).
  function clickError(spec, key) {
    const h = V[spec.scenario].clickError;
    if (h) return h(spec, key);
    return 1;
  }

  function clickByTarget(spec, key) {
    return key === spec.target ? 0 : 1;
  }

  function clickByCount(spec, key) {
    return Math.min(CAP, Math.abs(Number(key) - spec.truth));
  }

  function noAnswerError(spec) {
    if (spec.scenario === 'count' || spec.scenario === 'scroll-count' || spec.scenario === 'addition') return CAP;
    if (spec.scenario === 'grid') return GRID_CAP;
    return 1;
  }

  function prefix(model, spec) {
    let k = 0;
    while (k < model.clicks.length && k < spec.order.length && model.clicks[k] === spec.order[k]) k++;
    return k;
  }

  function errorOf(model, spec) {
    if (isSingle(spec)) {
      if (model.answer === null || model.answer === undefined) return noAnswerError(spec);
      return clickError(spec, model.answer);
    }
    if (isTyped(spec)) {
      const v = parseAnswer(model.text);
      return v === null ? CAP : Math.min(CAP, Math.abs(v - spec.truth));
    }
    const h = V[spec.scenario].error;
    if (h) return h(model, spec);
    return 1;
  }

  // ---------------------------------------------------------------- answers

  function correctKey(spec) {
    const h = V[spec.scenario].correctKey;
    if (h) return h(spec);
    return null;
  }

  function targetKey(spec) {
    return spec.target;
  }

  function truthKey(spec) {
    return spec.truth;
  }

  // A plausible wrong answer (wrong starts): a near color, a neighbour dot, another item or option.
  function wrongKey(spec, rng) {
    const h = V[spec.scenario].wrongKey;
    if (h) return h(spec, rng);
    return null;
  }

  function wrongOption(spec, rng) {
    return rng.pick(spec.options.filter((k) => k !== spec.truth));
  }

  function initOf(spec, rng) {
    const mode = spec.startMode || 'off';
    const half = (xs) => xs.slice(0, Math.max(1, Math.floor(xs.length / 2)));
    if (isSingle(spec) || isTyped(spec)) {
      const m = { clicks: [], answer: null, wrong: 0, text: '' };
      if (spec.scenario === 'scroll-count') {
        m.top = 0;
        m.seen = spec.view - 1;
        if (mode === 'partial') {
          m.top = Math.floor((spec.rows.length - spec.view) / 2);
          m.seen = m.top + spec.view - 1;
        }
      }
      if (mode === 'wrong') {
        if (isTyped(spec)) m.text = String(Math.max(0, spec.truth + (spec.truth > 1 && rng.bool() ? -rng.int(1, 2) : rng.int(1, 2))));
        else {
          const k = wrongKey(spec, rng);
          if (k !== null && k !== undefined) Object.assign(m, { clicks: [k], answer: k, wrong: 1 });
        }
      }
      if (spec.scenario === 'addition') return { text: m.text };
      return m;
    }
    const h = V[spec.scenario].start;
    if (h) return h(spec, rng, mode, half);
    return {};
  }

  // ---------------------------------------------------------------- plan / solve

  function scrollStep(model, spec) {
    const n = spec.rows.length;
    // The last row counts as seen once 90% of it is in view (thumb drags land a few px short of the end).
    if ((model.seen ?? spec.view - 1) >= n - 1 - 0.1) return null;
    if (spec.route === 'wheel') return { wheel: [{ pane: true }, 150] };
    const top = model.top || 0;
    return { drag: [{ thumb: true }, { scroll: Math.min(n - spec.view, Math.floor(top) + spec.view - 1) }] };
  }

  function planOf(model, spec) {
    if (errorOf(model, spec) <= 0) return null;
    if (isSingle(spec) || spec.scenario === 'scroll-count') {
      if (model.wrong >= wrongLimit(spec)) return null;
      if (model.answer !== null && model.answer !== undefined) return spec.recoverable ? { click: { undo: true } } : null;
      if (spec.scenario === 'scroll-count') {
        const s = scrollStep(model, spec);
        if (s) return s;
        if (spec.answer === 'typed') return { type: [{ field: 'answer' }, String(spec.truth)] };
      }
    }
    if (isTyped(spec)) return { type: [{ field: 'answer' }, String(spec.truth)] };
    const h = V[spec.scenario].planStep;
    if (h) return h(model, spec);
    return null;
  }

  function planItem(model, spec) {
    return { click: { item: correctKey(spec) } };
  }

  function planOption(model, spec) {
    return { click: { option: correctKey(spec) } };
  }

  function solveOf(spec, model) {
    const m = JSON.parse(JSON.stringify(model));
    if (isTyped(spec)) return { ...m, text: String(spec.truth) };
    if (isSingle(spec)) {
      const k = correctKey(spec);
      return { ...m, clicks: (m.clicks || []).concat([k]), answer: k };
    }
    const h = V[spec.scenario].solve;
    if (h) return h(spec, model, m);
    return m;
  }

  // ---------------------------------------------------------------- instructions

  const I = env.instruct;

  function instructionOf(spec, rng) {
    const T = (list, vars) => I.fill(I.pick(rng, list, spec.isplit), vars || {});
    const say = (core, terse, steps) => I.say(rng, core, { isplit: spec.isplit, terse, steps });
    const h = V[spec.scenario].instruction;
    if (h) return h(spec, rng, T, say);
    return '';
  }

  // ---------------------------------------------------------------- task

  const SCENARIOS = ['color', 'shades', 'shape', 'identify', 'count', 'greatest', 'grid', 'addition', 'ascending',
    'number-checkboxes', 'spatial', 'icon', 'scroll-count'];
  const GLYPH_SCENARIOS = new Set(['spatial', 'icon', 'scroll-count']);
  const CONTRAST_SCENARIOS = new Set(['shape', 'identify', 'count', 'spatial', 'icon', 'scroll-count']);

  // Item colors (name -> hex) and board color a widget draws a spec with: spec.contrast 'low' swaps in the
  // washed-out palette; otherwise ITEM_COLORS and board null (the widget's own board color).
  function itemColors(spec) {
    return spec && spec.contrast === 'low' ? { colors: LOW_ITEM_COLORS, board: LOW_BOARD } : { colors: ITEM_COLORS, board: null };
  }

  // opts.route (episode knob): override the drawn route after sampling (no extra draws; undefined changes
  // nothing). count / scroll-count: 'keyboard' = typed answer, 'pointer' = answer buttons (and the thumb in
  // scroll-count, wheel no longer an allowed input); scroll-count 'wheel' = scroll by wheel. Other scenarios
  // (addition is typed only) ignore it. spec.forcedRoute records an honoured value.
  // ---------------------------------------------------------------- round 2: judge, silent, retarget

  const itemWord = (it) => (it.kind === 'icon' || it.kind === 'shape' ? it.text : `${it.kind} ${it.text}`);

  function judgeOf(jr, spec) {
    const v = spec.scenario;
    // what: the missing thing as the instruction names it, with other short ways to say it (the reply's missing item)
    const ph = (templates, vars, message, what) => ({ mode: 'impossible', what, templates, vars, message: `I can't do that: ${message}` });
    const h = V[spec.scenario].judgeAsk;
    if (h) return h(jr, spec, ph);
    return ph(['Count the rows in the second list with the {icon} icon.', 'How many rows of the second list have the {icon} icon? Answer it.'], { icon: spec.desc.icon }, 'there is only one list on the page.', ['second list', 'second list of rows']);
  }

  function judgeInstruction(spec, rng) {
    const j = spec.judge;
    return I.phrase(rng, j.templates, j.vars, spec.isplit);
  }

  const lastIn = (a, b) => b.filter((x) => !a.includes(x)); // elements of b that a lacks

  // A silent failure of the update that produced `next` (null = none fits).
  function silentOf(next, prev, spec, rng) {
    const wrong = (m) => errorOf(m, spec) > 0;
    if (isTyped(spec)) {
      const t = String(next.text ?? '');
      if (!t) return null;
      const out = { ...next, text: t.slice(0, -1) };
      return wrong(out) ? out : null;
    }
    if (isSingle(spec)) return null;
    const h = V[spec.scenario].silentEdit;
    if (h) {
      const res = h(next, prev, spec, rng, wrong);
      if (res !== undefined) return res;
    }
    return null;
  }

  function silentToggle(next, prev, spec, rng, wrong) {
    const v = spec.scenario;
    const key = v === 'shades' ? 'selected' : 'on';
    const added = lastIn(prev[key], next[key]);
    const removed = lastIn(next[key], prev[key]);
    let list = next[key].slice();
    if (added.length) {
      const drop = rng.pick(added);
      list = list.filter((x) => x !== drop);
    } else if (removed.length) list = list.concat([rng.pick(removed)]).sort((a, b) => a - b);
    else return null;
    const out = { ...next, [key]: list };
    return wrong(out) ? out : null;
  }

  function retargetOf(spec, model, rng) {
    if (spec.judge) return null;
    if (isSingle(spec) && model.answer !== null && model.answer !== undefined) return null; // an answer is locked
    const out = { ...spec };
    const h = V[spec.scenario].retargetEdit;
    if (h) {
      const res = h(spec, model, rng, out);
      if (res !== undefined) return res;
    } else return null;
    return errorOf(model, out) > 0 ? out : null;
  }

  function factsOf(model, spec) {
    const typed = isTyped(spec);
    const ans = typed ? String(model.text ?? '').trim() : model.answer === null || model.answer === undefined ? '' : String(model.answer);
    const h = V[spec.scenario].factRows;
    if (h) {
      const res = h(model, spec, ans);
      if (res !== undefined) return res;
    }
    return [];
  }

  function factsCount(model, spec, ans) {
    const v = spec.scenario;
    if (!ans) return [];
    const label = v === 'scroll-count' ? 'Matching rows' : spec.mode === 'sides' ? 'Number of sides' : 'Count';
    return [{ label, value: ans, labels: ['Answer', 'Total', 'Number'] }];
  }

  function factsItem(model, spec, ans) {
    const it = spec.items[model.answer];
    if (!it) return [];
    return [{ label: 'Selected item', value: it.kind === 'letter' || it.kind === 'digit' ? it.text : it.text,
      labels: ['Item', 'Selected'], aliases: [itemName(it, true), itemWord(it)] }];
  }

  function forceRoute(spec, route) {
    const v = spec.scenario;
    if (v !== 'count' && v !== 'scroll-count') return spec;
    if (route === 'keyboard') spec.answer = 'typed';
    else if (route === 'pointer') {
      spec.answer = 'buttons';
      if (v === 'scroll-count') spec.route = 'thumb';
    } else if (route === 'wheel' && v === 'scroll-count') spec.route = 'wheel';
    else return spec;
    spec.forcedRoute = route;
    return spec;
  }

  function toleranceCounted(spec) {
    return { tau: 0, sigma: 0.75, minInitialError: 1 };
  }

  function toleranceSet(spec) {
    return { tau: 0, sigma: 0.25, minInitialError: 0.5 };
  }

  function toleranceOrdered(spec) {
    return { tau: 0, sigma: 0.3, minInitialError: 0.5 };
  }

  function selfCheckCounted(spec, tag, fails) {
    if (spec.answer === 'buttons' && !spec.options.includes(spec.truth)) fails.push(`${tag}: truth not offered`);
  }

  env.task({
    name: 'read-figure',
    scenarios: SCENARIOS,
    files: ['scenarios/color.js', 'scenarios/shades.js', 'scenarios/shape.js', 'scenarios/identify.js',
      'scenarios/count.js', 'scenarios/greatest.js', 'scenarios/grid.js', 'scenarios/addition.js',
      'scenarios/ascending.js', 'scenarios/number-checkboxes.js', 'scenarios/spatial.js', 'scenarios/icon.js',
      'scenarios/scroll-count.js'],
    lib: { CAP, clickByCount, clickByTarget, clickError, dE, describe, DIGIT_PATTERNS, DIGITS, factsCount, factsItem,
      FINE, glyphAliases, glyphNames, GRID_CAP, gridKey, ICON_NAMES, ITEM_COLORS, itemName, LETTERS, LOW_BOARD, LOW_ITEM_COLORS,
      matches, phrase, planItem, planOption, prefix, sampleBoard, sampleIconItem, sampleItem, selfCheckCounted, SHAPES, silentToggle,
      SWATCHES, targetKey, toleranceCounted, toleranceOrdered, toleranceSet, truthKey, wrongLimit, wrongOption },
    startModes: ['off', 'partial', 'wrong', 'solved'],
    judgeModes: ['impossible'],
    inputs(spec) {
      const out = ['pointer'];
      if (spec && isTyped(spec)) out.push('keyboard');
      if (spec && spec.scenario === 'scroll-count' && spec.forcedRoute !== 'pointer') out.push('wheel');
      return out;
    },

    helpers: { ITEM_COLORS, GLYPHS, itemColors, isSingle, clickError },

    sample(rng, opts) {
      const list = opts.scenarios && opts.scenarios.length ? opts.scenarios : SCENARIOS;
      const scenario = opts.scenario || rng.pick(list);
      const o = { ood: !!opts.ood, csplit: opts.csplit || 'train' };
      // Opt-in widget traits, drawn from their own forks so specs of widgets without them do not change.
      const traits = opts.traits || {};
      const glyphs = GLYPH_SCENARIOS.has(scenario) && traits.glyphs ? rng.fork('glyphs').pick([].concat(traits.glyphs)) : null;
      if (glyphs && glyphs !== 'line') o.glyphs = glyphs;
      const contrast = CONTRAST_SCENARIOS.has(scenario) && traits.contrast ? rng.fork('contrast').pick([].concat(traits.contrast)) : null;
      const spec = {
        scenario, isplit: opts.isplit || 'train', csplit: o.csplit, ood: o.ood, startMode: opts.startMode || 'off',
        ...V[scenario].sample(rng, o),
      };
      if (glyphs) spec.glyphs = glyphs;
      if (contrast) spec.contrast = contrast;
      const lv = opts.level === 'easy' ? 1 : opts.level === 'medium' ? 0.5 : 0;
      if (lv) levelAdjust(spec, lv, rng.fork('level'));
      forceRoute(spec, opts.route);
      if (hasEnding(spec)) {
        const rec = opts.recover === undefined || opts.recover === null ? rng.fork('recover').bool(0.5) : !!opts.recover;
        spec.recoverable = spec.startMode === 'wrong' ? true : rec;
      } else spec.recoverable = false;
      if (opts.judge === 'impossible') spec.judge = judgeOf(rng.fork('judge'), spec);
      return spec;
    },

    // ambiguous / impossible start solved (nothing to change); the normal start supplies the view state (scroll-count)
    init: (spec, rng) => (spec.judge ? solveOf(spec, initOf({ ...spec, judge: undefined, startMode: 'off' }, rng)) : initOf(spec, rng)),
    error: errorOf,
    facts: env.util.reportFactsOf(factsOf, solveOf),
    silent: (next, prev, spec, rng) => (spec.judge ? null : silentOf(next, prev, spec, rng)),
    retarget: retargetOf,

    tolerance(spec) {
      const t = V[spec.scenario].tolerance;
      return t ? t(spec) : { tau: 0, sigma: 0.5, minInitialError: 0.5 };
    },

    instruction: (spec, rng) => (spec.judge ? judgeInstruction(spec, rng) : instructionOf(spec, rng)),
    plan: planOf,
    solve: solveOf,
    ended(model, spec) {
      if (isSingle(spec) && (model.wrong || 0) >= wrongLimit(spec)) return 'wrong-choice';
      if (spec.scenario === 'ascending' && (model.wrong || 0) >= wrongLimit(spec)) return 'wrong-order';
      return null;
    },
  });
})();
