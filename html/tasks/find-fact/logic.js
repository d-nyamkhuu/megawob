/*
 * find-fact: find a fact on the page and report it (type it, click it or tick it).
 * MiniWoB counterparts: read-table, read-table-2, find-word, phone-book, click-checkboxes-soft; the
 * datagrid, join, chart, tooltip, locate and count scenarios go beyond MiniWoB (real data-table, dashboard and
 * find-in-page lookups).
 * Inputs ['pointer', 'keyboard'] (answers are typed), plus 'wheel' for datagrid 'hscroll' (the table scrolls
 * sideways inside its pane) and for locate / count (the document scrolls in its pane).
 *
 * scenarios
 *   table       kind 'record' (read-table / -2: a two-column attribute table of a person, 5 rows, ood 8-10)
 *               or kind 'grid' (products, flights, staff or orders, 4-6 columns x 5-8 rows, ood 10-14,
 *               rows named by their first column). 1 or 2 cells are asked, each with its own text field.
 *               A field may carry an answer-format rule (fmt: dates as DD/MM/YYYY, MM/DD/YYYY or
 *               YYYY-MM-DD, phone digits only, a price without its currency sign, capitals): the page shows
 *               the source form, the answer is graded in the requested form.
 *   find-word   mode 'nth' (type the Nth word of a short paragraph of real sentences) or mode 'after' (two
 *               paragraphs; type the word right after a quoted 1-2 word phrase that occurs exactly once)
 *   phone-book  a contact book (name, phone, email, address). mode 'pages': perPage (1-5) contacts per page,
 *               3-7 pages (ood 8-12), pager 'numbers' or 'arrows'; mode 'search': a directory sorted by last
 *               name with a search field (first maxResults matches shown). Click the requested property of
 *               the named person. Recoverable (spec.recoverable): a wrong pick shows "Opened ..." with an
 *               Undo; it costs its pick error until undone and a second wrong pick ends the episode.
 *               Otherwise the first wrong pick ends it (MiniWoB).
 *   similar     click-checkboxes-soft: 3-7 checkboxes (ood 8-10) of words from distinct synonym groups;
 *               check every word similar in meaning to the given words
 *   datagrid    a data table bigger than its view; mode 'sort' (the row with the highest / lowest value of a
 *               numeric column; the table is paginated, unsorted, sortable by clicking a header), 'filter'
 *               (a named row on a later page; a filter box narrows the rows), 'pages' (a named row on page
 *               k of a paginated table), 'hscroll' (a wide table in a sideways-scrolling pane with a frozen
 *               first column; the asked column starts out of view). Type one cell of the target row.
 *   join        two panels (orders + customers, or staff + departments) linked by an ID column; the answer
 *               needs a lookup in both: mode 'forward' (the customer city of order X) or 'reverse' (the
 *               order total of customer Y)
 *   chart       a bar or line chart with a value axis: mode 'value' (read the value of one category; values
 *               sit on grid lines or carry labels), 'max' / 'min' (type the category with the highest /
 *               lowest value), 'hover' (values are only shown in a tooltip when the pointer is on the bar or
 *               point; type the value)
 *   tooltip     the fact is only in a hover tooltip: mode 'icon' (a list of shipments, servers or products whose
 *               rows carry an info icon; hovering it shows 3 extra "label: value" fields that are not columns;
 *               type one of them for a named row) or 'abbr' (meeting notes with fictional abbreviations under a
 *               dotted underline and no title attribute; hovering one shows its full name; type it)
 *   locate      find in page: a long document (6-8 sections, ood 9-12, of 2-3 paragraphs) whose entries each
 *               give a term with a value of one kind (an extension, a reference number or a fee), so only the
 *               term tells the target apart. Type the value given with the named term (a code "KT-24" or a name
 *               "Harbor"). Decoy entries carry their own values: with spec.match.case the lowercase common noun
 *               ("harbor"; the instruction asks for the exact capitalization), with spec.match.whole longer
 *               words that contain the term ("Harborside", "KT-240", "AKT-24"). spec.collapsed: every section
 *               but the first starts folded
 *   count       find in page: type how many times a term occurs in a long document (3-8, ood 9-14).
 *               spec.match.case: lowercase forms exist and the instruction says the count is case-sensitive;
 *               spec.match.whole: longer words contain it and the instruction says whole words only;
 *               spec.collapsed: the instruction says folded sections count (at least one occurrence is folded)
 *   locate, count: widgets draw an in-page find bar (BrowserGym's keyboard_press('Control+f') reaches the page as
 *               key events, and its screenshot and AXTree cover only the page, so the browser's own bar is out of
 *               reach), opened by Ctrl+F or a Find button: query, "i of n", match-case and whole-word toggles,
 *               next / previous. It searches headings and paragraphs, not the text of folded sections; what it
 *               matches is findMatches(model, spec) (widgets draw exactly that). Using it is never required.
 *
 * Levels (opts.level easy | medium, normal unchanged): the sampled episode is pruned in place from
 * rng.fork('level') (levelAdjust): table: one field on easy, fewer rows; find-word: a nearer word and a shorter
 * text; phone-book: fewer pages / contacts; similar: at most 2 targets on easy, 1 / 2 distractors; datagrid:
 * fewer rows (the target stays off the first page); join: fewer rows per panel; chart: 3 / 4 categories;
 * locate: 2 / 3 other entries (the target and the decoys stay); locate, count: 1 / 2 sections with nothing to find.
 *
 * Opt-in widget traits (read only when a widget declares them, from the same draw, so other widgets' seeds are unchanged):
 *   traits.gridModes  [modes]  datagrid draws its mode from this list instead of sort / filter / pages / hscroll
 *   traits.vscroll    [bool]   datagrid 'hscroll' only: spec.vscroll = true makes the table long (16-24 rows, ood
 *                     28-36) and its body scroll vertically under a sticky header row; the asked row starts
 *                     below the fold (widgets show at most VSCROLL_VIEW rows). Model adds vrow (requested first
 *                     visible row) and rview (rows fully in view, mirrored by the widget, unscored); plan targets
 *                     { vthumb: true } / { vscrollTo: row }, and { wheel: [{ grid }, +-120, 0] } on route 'wheel';
 *                     rows first, then columns
 * opts.route (episode knob; undefined = today's mix): datagrid 'hscroll': 'wheel' -> route 'wheel', 'pointer' ->
 *   route 'thumb' (and wheel leaves inputs()); phone-book: 'pointer' -> mode 'pages' (keyboard leaves inputs()),
 *   'keyboard' -> mode 'search'. spec.forcedRoute records an honoured value; other scenarios ignore it.
 *
 * spec   { scenario, mode?, isplit, csplit, ood, startMode, ... }
 *   table       kind, dataset, title, columns: [names], rows: [[cells]], ref, fields: [{ label | null, row,
 *               col, answer (graded form), shown (cell text), fmt: null | kind }]
 *   find-word   mode, paragraphs, words, n | phrase, at, answer
 *   phone-book  mode, pager, perPage, maxResults, contacts: [{ first, last, name, phone, email, address }],
 *               target, prop, recoverable
 *   similar     words: [{ text, group }], given, targets
 *   datagrid    mode, dataset, title, ref, cols: [{ name, noun, aliases, num }], rows: [[cells]],
 *               nums: [[number | null]], perPage (0: no pager), target (row index), col (asked column),
 *               answer, sortCol / dir ('asc' | 'desc', mode 'sort'), filterable, route ('wheel' | 'thumb')
 *   join        dataset, mode, left / right: { title, cols, rows }, link: [leftCol, rightCol], key (the
 *               given value), answer, ask: { side, col } (what is typed), via (row indices [left, right])
 *   chart       kind ('bar' | 'line'), mode, title, unit, cats: [labels], values: [ints], step (grid step),
 *               max (axis top), labels (bool: value labels drawn), target (category index), answer
 *   tooltip     mode 'icon': dataset, title, columns: [3 names], rows: [{ key, cells: [3], tip: [[label, value]
 *               x3] }], target (row index), field (tip index), label, answer; mode 'abbr': title, abbrs:
 *               [{ abbr, full }], notes: [[{ text } | { abbr: i }]] (one line per abbreviation), target, answer
 *   locate      kind ('name' | 'code'), term, vkind ('extension' | 'base' | 'fee'), noun, match: { case,
 *               whole }, collapsed, title, sections: [{ heading, fold, paras: [[sentences]] }], facts: [{ term,
 *               value, decoy: null | 'case' | 'whole', text (its sentence) }], target (fact index, 0), answer,
 *               hit: [section, block, offset] (the one exact, case-sensitive whole-word occurrence; block 0 is the
 *               heading, 1.. the paragraphs), openBy ('key' | 'button': how the oracle opens the find bar)
 *   count       kind, term, match, collapsed, title, sections, answer (the count as a string), openBy
 * model
 *   table, find-word, join  { answers: [string per field] }
 *   chart                   { answers: [string], hover: null | category index }
 *   tooltip                 { answers: [string], hover: null | row / abbreviation index whose tooltip was shown }
 *   datagrid                { answers: [string], sort: null | { col, dir }, filter, page, hcol (requested
 *                           first visible column, hscroll), view: null | [first, last] fully visible
 *                           columns (mirrored by the widget, unscored) }
 *   phone-book              { page, query, picks: [{ contact, prop }], wrongs (wrong picks made, ever) }
 *   locate, count           { answers: [string], find: { open, query, mcase, whole, cur (current match index) },
 *                           expanded: [indices of folded sections shown] }
 *   similar                 { values: [checked texts, in display order] }
 * error (tau 0 everywhere)
 *   typed answers           normalized edit distance (trimmed, spaces collapsed, lower-cased; find-word also
 *                           drops non-alphanumerics), mean over fields. datagrid: x0.8 while the target cell
 *                           is on screen. chart 'value' / 'hover': min(1, |typed - value| / (2 * step)) for a
 *                           number, 1 otherwise. locate: edit distance over letters and digits ("#48213" = "48213",
 *                           "$1,250" = "1250"); count: min(1, |typed - n| / max(2, ceil(n / 2))) for a number, 1
 *                           otherwise; both x0.8 while the find bar is on the asked thing (locate: its current
 *                           match is the target occurrence; count: it matches exactly the occurrences to count).
 *                           sigma 0.35
 *   phone-book              a pick costs 0.7 for the wrong person + 0.3 for the wrong property; the worst
 *                           standing pick counts. No pick: 0.8 while the target's entry is shown, else 1.
 *   similar                 1 - Jaccard(checked, targets)
 * start modes: off, partial (half the fields / a prefix typed, or navigation done; locate / count: the find bar
 *   open on the term), wrong (a value from another cell, a wrong pick pending undo (recoverable) or a wrong page /
 *   query, wrong boxes ticked; locate: a decoy's or another entry's value; count: the naive count (any case,
 *   longer words, folded sections skipped) or one off), solved.
 *
 * plan targets (the widget's locate() maps them to viewport px)
 *   { field: i }               answer text field i
 *   { search: true }           the phone-book search field
 *   { page: p } / { pager: 'prev' | 'next' }   phone-book pager
 *   { contact: c, prop }       the property link of contact c (only planned while shown)
 *   { undo: true }             the Undo control of a pending wrong pick (phone-book, recoverable)
 *   { word: text }             a checkbox (similar)
 *   { sortBy: col }            a datagrid column header (a click cycles asc -> desc -> asc)
 *   { filter: true }           the datagrid filter box
 *   { gpage: p }               a datagrid page button
 *   { grid: true }             the datagrid scroll pane (wheel target)
 *   { hthumb: true } / { hscrollTo: col }   the datagrid's horizontal scrollbar thumb / where to release it
 *                              so that column col is in view
 *   { bar: i }                 chart bar or point i (hover)
 *   { tip: i }                 the info icon of row i / abbreviation i (tooltip)
 *   { findOpen: true }         the Find button that opens the find bar (locate, count)
 *   { find: true }             the find bar's query field
 *   { findCase: true } / { findWhole: true } / { findNext: true }   its match-case and whole-word toggles, next
 *   { expandAll: true }        the control that shows every folded section
 *   { doc: true }              the document pane (wheel target)
 * plan steps
 *   typed       { type: [{ field: i }, answer] } for each wrong field
 *   phone-book  undo a pending wrong pick; pages: { click: { page | pager } }; search: { type: [{ search },
 *               full name] }; then { click: { contact, prop } }
 *   similar     { click: { word } } per word in the wrong state
 *   datagrid    sort: { click: { sortBy } } until sorted the right way; filter: { type: [{ filter }, key] };
 *               pages: { click: { gpage } }; hscroll: route 'wheel' { wheel: [{ grid }, 0, +-260] } until the
 *               column is in view, route 'thumb' { drag: [{ hthumb }, { hscrollTo: col }] }; then the answer
 *   chart       hover: { move: { bar } }; then the answer
 *   tooltip     { move: { tip: target } } (until its tooltip was shown); then the answer
 *   locate, count  open the find bar ({ key: 'Control+f' }, or { click: { findOpen } } when spec.openBy is
 *               'button'), { type: [{ find }, term] }, the toggles the instruction's rules need, { click: { expandAll } }
 *               while a needed occurrence is folded, locate: { click: { findNext } } until the current match is the
 *               target; then the answer
 *
 * Optional hooks (round 2 contract):
 *   facts     table (one field): the target row's other cells (record: the other fields); tooltip 'icon': the
 *             target row's carrier / region / price columns; chart with value labels: two other categories; else [].
 *             Column / label paraphrases go in labels; aliases are other spellings of the value ("120 units").
 *   silent    the typed answer kept one character less (a field max length); a phone-book pick did not
 *             register; a similar checkbox toggle did not stick
 *   retarget  table (one field, no format rule): another row / record field; find-word 'nth': another word
 *             number; phone-book: another contact (null once a pick was made: it is final); chart: another
 *             category (max <-> min); tooltip: another row or abbreviation; locate: another entry (not a decoy; no
 *             rule needed); datagrid, join, similar, count: null (their goal shapes the scene)
 *   answers / answered   knob answer=reply (kit/runtime/answer.js): the typed scenarios (not phone-book, similar)
 *             record spec.answerBy = 'reply' (not in judge episodes); the instruction asks the same question without a
 *             field to type into, plan() finishes where it would type, and the reply fills model.answers for
 *             grading. Labels: table one field: the record attribute (lowercase) or the column noun (+ aliases), two
 *             fields: their form labels; find-word 'word'; datagrid the column noun; join the asked noun; chart
 *             'category' (max / min) or 'value'; tooltip the tip label or 'full name' (abbr); locate the value noun
 *             (+ aliases); count 'count'
 *   judgeModes ['impossible']: spec.judge = { mode, kind (the scenario), what, value, templates, vars, message } asks
 *             for something the page does not hold (a field or column the
 *             table lacks, an unlisted contact / order / person / product / server / abbreviation / chart
 *             category, a word number past the end, a phrase not in the text, a word with no listed synonym, a
 *             term the document never mentions (locate), a section the document does not have (count));
 *             what: [the missing thing as the goal names it, plus other spellings], which the reply must name;
 *             error 0 until something is typed, picked or ticked, 1 after. No 'ambiguous' (keys are unique by
 *             construction) and no 'confirm' (reading has no irreversible step).
 *
 * Helpers (widget API, env.taskDef.helpers):
 *   PROPS: phone-book property labels.
 *   VSCROLL_VIEW: maximum number of visible datagrid rows.
 *   shown(model, spec): phone-book contact indices on screen.
 *   pageCount(spec): number of phone-book pages.
 *   gridRows(model, spec): row order, current page rows and page count after filtering and sorting.
 *   nextSort(sort, col): next column sort state.
 *   wrongPick(model, spec): whether a phone-book pick is incorrect.
 *   findMatches(model, spec): visible find-bar matches [{ s, b, at, len }], empty when closed.
 *   findCur(model, n): clamped current match index.
 * Tests live in selftest.js, loaded only by the checker and node tests.
 * Deviations from MiniWoB: realistic content banks; answers never mention the end control; phone-book picks
 * can be recoverable.
 *
 * Files (files: [...] below, loaded in order after this one): data.js (shared dataset generation), scenarios/<scenario>.js, one env.scenario('find-fact', {...})
 * object per scenario. This file holds the shared helpers (lib) and dispatches to the objects; the hooks an object has
 * are listed above the dispatch section.
 */
(function () {
  'use strict';

  const C = env.content;
  const I = env.instruct;

  // ---------------------------------------------------------------- local banks (lexical data)

  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September',
    'October', 'November', 'December'];
  const MON3 = MONTHS.map((m) => m.slice(0, 3));
  const STATUSES = ['On time', 'Delayed', 'Boarding', 'Cancelled', 'Departed', 'Gate closed'];
  const AIRCRAFT = [
    'A320', 'A321neo', 'B737-800', 'B787-9', 'E190', 'A350-900', 'CRJ900', 'ATR 72', 'A318', 'A319', 'A220-100',
    'A330-200', 'A380-800', 'B717-200', 'B757-200', 'E170', 'E175', 'E195', 'CRJ200', 'CRJ700', 'A300', 'A310',
    'F100'
  ];
  const CARRIERS = [
    'Parcelway', 'SwiftPost', 'Northline Freight', 'Courier One', 'Bluebox Express', 'Cinder Cargo', 'Waymark Ship',
    'Tern Freight', 'Alder Parcel', 'Lark Parcel'
  ];
  const PROPS = { phone: 'phone number', email: 'email', address: 'address' };

  // Synonym groups for 'similar'; no word appears in two groups.
  const SYNONYMS = [
    ['big', 'large', 'huge', 'enormous', 'gigantic'],
    ['small', 'tiny', 'little', 'miniature', 'petite'],
    ['red', 'scarlet', 'crimson', 'ruby'],
    ['happy', 'cheerful', 'joyful', 'glad', 'delighted'],
    ['sad', 'unhappy', 'sorrowful', 'miserable', 'gloomy'],
    ['angry', 'mad', 'furious', 'irritated', 'irate'],
    ['wrong', 'incorrect', 'mistaken', 'erroneous'],
    ['real', 'genuine', 'actual', 'authentic'],
    ['strange', 'odd', 'peculiar', 'unusual', 'weird'],
    ['stop', 'cease', 'halt', 'quit'],
    ['scared', 'terrified', 'fearful', 'frightened', 'afraid'],
    ['quiet', 'calm', 'peaceful', 'serene', 'tranquil'],
    ['old', 'aged', 'ancient', 'elderly'],
    ['love', 'adore', 'cherish', 'treasure'],
    ['hide', 'conceal', 'camouflage', 'cover'],
    ['hate', 'despise', 'loathe', 'detest'],
    ['funny', 'humorous', 'amusing', 'comical', 'hilarious'],
    ['fast', 'quick', 'rapid', 'swift', 'speedy'],
    ['delicious', 'tasty', 'savory', 'appetizing', 'scrumptious'],
    ['cut', 'slice', 'carve', 'chop'],
    ['brave', 'courageous', 'fearless', 'bold', 'heroic'],
    ['begin', 'start', 'initiate', 'launch', 'commence'],
    ['answer', 'reply', 'response', 'retort'],
    ['house', 'home', 'dwelling', 'residence'],
    ['fire', 'flame', 'blaze', 'inferno'],
    ['car', 'automobile', 'vehicle', 'sedan'],
    ['smart', 'clever', 'intelligent', 'bright', 'brilliant'],
    ['rich', 'wealthy', 'affluent', 'prosperous'],
    ['tired', 'exhausted', 'weary', 'sleepy', 'drained'],
    ['easy', 'simple', 'effortless', 'painless'],
    ['dirty', 'filthy', 'grimy', 'muddy', 'soiled'],
    ['shout', 'yell', 'scream', 'holler'],
    ['buy', 'purchase', 'acquire', 'procure'],
    ['help', 'assist', 'aid', 'support'],
    ['look', 'glance', 'peek', 'glimpse'],
    ['wet', 'damp', 'soaked', 'moist'],
  ];

  const ORD = (n) => {
    const s = n % 100 >= 11 && n % 100 <= 13 ? 'th' : ['th', 'st', 'nd', 'rd'][n % 10] || 'th';
    return `${n}${s}`;
  };

  // ---------------------------------------------------------------- text helpers

  const levenshtein = env.util.lev;
  const normText = (s) => String(s || '').normalize('NFC').trim().replace(/\s+/g, ' ').toLowerCase();
  const normCase = (s) => String(s || '').normalize('NFC').trim().replace(/\s+/g, ' ');
  const normWord = (s) => String(s || '').normalize('NFC').replace(/[^\p{L}\p{N}]/gu, '').toLowerCase();
  const textErr = (typed, want, norm = normText) => {
    const a = norm(typed);
    const b = norm(want);
    return levenshtein(a, b) / Math.max(a.length, b.length, 1);
  };
  const parseNum = (s) => {
    const t = String(s || '').replace(/[,\s$€£%]/g, '').replace(/[a-z]+$/i, '');
    return /^-?\d+(\.\d+)?$/.test(t) ? Number(t) : null;
  };
  // A visibly different wrong text for 'wrong' starts.
  const wrongOf = (rng, answer, pool) => {
    const cands = pool.filter((x) => x && normText(x) !== normText(answer));
    return cands.length ? rng.pick(cands) : `${answer}x`;
  };
  const prefixOf = (s) => {
    const cp = [...String(s)];
    return cp.slice(0, Math.max(0, Math.min(cp.length - 1, Math.ceil(cp.length / 2)))).join('');
  };

  // ---------------------------------------------------------------- dates and formats

  function randomISO(rng, y0, y1) {
    const y = rng.int(y0, y1);
    const m = rng.int(1, 12);
    const d = rng.int(1, 28);
    return `${y}-${pad2(m)}-${pad2(d)}`;
  }
  function showDate(iso, style) {
    const [y, m, d] = iso.split('-').map(Number);
    if (style === 'long') return `${MONTHS[m - 1]} ${d}, ${y}`;
    if (style === 'dmy-long') return `${d} ${MONTHS[m - 1]} ${y}`;
    return `${MON3[m - 1]} ${d}, ${y}`;
  }
  const FORMATS = {
    dmy: { phrase: [
      'as DD/MM/YYYY', 'in DD/MM/YYYY format', 'formatted day/month/year (DD/MM/YYYY)', 'DD/MM/YYYY only'
    ],
      apply: (v) => { const [y, m, d] = v.iso.split('-'); return `${d}/${m}/${y}`; } },
    mdy: { phrase: [
      'as MM/DD/YYYY', 'in MM/DD/YYYY format', 'written month/day/year (MM/DD/YYYY)', 'MM/DD/YYYY only',
      'with slashes (MM/DD/YYYY)'
    ],
      apply: (v) => { const [y, m, d] = v.iso.split('-'); return `${m}/${d}/${y}`; } },
    iso: { phrase: [
      'as YYYY-MM-DD', 'in ISO format (YYYY-MM-DD)', 'formatted YYYY-MM-DD', 'YYYY-MM-DD only',
      'with hyphens (YYYY-MM-DD)', 'in YYYY-MM-DD order'
    ],
      apply: (v) => v.iso },
    digits: { phrase: [
      'digits only', 'as digits only, without spaces, dashes or brackets', 'with nothing but the digits',
      'with every nondigit removed', 'as the full digit sequence, no separators', 'as digits, no extras'
    ],
      apply: (v) => v.text.replace(/\D/g, '') },
    number: { phrase: [
      'without the currency sign', 'as a plain number (no currency symbol)', 'as just the amount, no $ sign',
      'with only the $ removed', 'as the full decimal amount, no $ sign', 'with cents intact, without the $'
    ],
      apply: (v) => v.text.replace(/[^\d.]/g, '') },
    upper: { phrase: ['in capital letters', 'in all caps', 'in upper case', 'with caps only'],
      apply: (v) => v.text.toUpperCase() },
  };

  // ---------------------------------------------------------------- people, contacts

  const nameOk = (p) => /^[A-Za-z][A-Za-z' -]*$/.test(C.ascii(p.full)) && p.full.length <= 22;
  function people(rng, n, spec) {
    const out = [];
    const seen = new Set();
    for (let k = 0; out.length < n && k < n * 40; k++) {
      const p = C.personName(rng, C.csplitOf(spec));
      if (seen.has(p.full) || seen.has(p.first) || !nameOk(p)) continue;
      seen.add(p.full);
      seen.add(p.first);
      out.push(p);
    }
    return out;
  }
  function usPhone(rng) {
    const a = rng.int(201, 989);
    const m = rng.int(200, 999);
    const e = String(rng.int(0, 9999)).padStart(4, '0');
    return rng.pick([`(${a}) ${m}-${e}`, `${a}-${m}-${e}`, `${a}.${m}.${e}`, `+1 ${a} ${m} ${e}`]);
  }

  // ---------------------------------------------------------------- data tables

  // ---------------------------------------------------------------- sampling: table

  // ---------------------------------------------------------------- sampling: find-word

  const cleanTokens = (s) => s.split(/\s+/).filter(Boolean);
  const goodSentence = (s) => cleanTokens(s).every((w) => /[\p{L}\p{N}]/u.test(w)) && !/["“”]/.test(s);

  // ---------------------------------------------------------------- sampling: phone-book

  const pageCount = (spec) => Math.ceil(spec.contacts.length / spec.perPage);

  function shown(model, spec) {
    if (spec.mode === 'pages') {
      const lo = model.page * spec.perPage;
      return [...Array(spec.perPage).keys()].map((k) => lo + k).filter((i) => i < spec.contacts.length);
    }
    const qy = normText(model.query);
    const out = [];
    spec.contacts.forEach((c, i) => { if (out.length < spec.maxResults && c.name.toLowerCase().includes(qy)) out.push(i); });
    return out;
  }

  // ---------------------------------------------------------------- sampling: similar

  // ---------------------------------------------------------------- sampling: datagrid

  // Rows after filter and sort; the current page's slice.
  function gridRows(model, spec) {
    let order = spec.rows.map((_, i) => i);
    const f = normText(model.filter);
    if (f) order = order.filter((i) => spec.rows[i][0].toLowerCase().includes(f));
    if (model.sort) {
      const c = model.sort.col;
      const s = model.sort.dir === 'desc' ? -1 : 1;
      order.sort((a, b) => {
        const x = spec.nums[a][c];
        const y = spec.nums[b][c];
        const d = x !== null && y !== null ? x - y : String(spec.rows[a][c]).localeCompare(String(spec.rows[b][c]));
        return d ? s * d : a - b;
      });
    }
    const per = spec.perPage || order.length || 1;
    const pages = Math.max(1, Math.ceil(order.length / per));
    const page = Math.min(model.page || 0, pages - 1);
    return { order, page, pages, rows: order.slice(page * per, page * per + per) };
  }

  // A datagrid with spec.vscroll shows at most this many body rows at a time.
  const VSCROLL_VIEW = 9;

  // ---------------------------------------------------------------- sampling: join

  // ---------------------------------------------------------------- sampling: chart

  // ---------------------------------------------------------------- sampling: tooltip

  const lowLabel = (l) => l.split(' ').map((w) => (/^[A-Z]{2,}$/.test(w) ? w : w.toLowerCase())).join(' ');

  // ---------------------------------------------------------------- sampling: locate, count (find in page)

  // A long document (help-center reference, handbook, terms) in a scroll pane with an in-page find bar: the
  // browser's own find bar is out of reach in BrowserGym (Ctrl+F only reaches the page as key events, and the
  // screenshot and AXTree cover only the page), so widgets draw one, as web apps that take over Ctrl+F do. What the
  // bar matches is defined here (findMatches), so scoring, the oracle and every widget agree.
  // Names are also common nouns (the lowercase form is a 'case' decoy) and take a suffix (a 'whole' decoy); no name
  // contains another.
  const FIND_NAMES = ['Harbor', 'Summit', 'Beacon', 'Cedar', 'Meadow', 'Ridge', 'Willow', 'Anchor', 'Orbit', 'Falcon',
    'Granite', 'Maple', 'Lantern', 'Compass', 'Canyon', 'Glacier', 'Prairie', 'Harvest', 'Timber', 'Coral', 'Lagoon',
    'Pebble', 'Quartz', 'Juniper', 'Thicket', 'Orchard', 'Estuary', 'Basin', 'Marsh', 'Hollow', 'Plateau', 'Grotto',
    'Dune', 'Cypress', 'Birch', 'Spruce', 'Larch', 'Acacia', 'Banyan', 'Sundial', 'Turbine', 'Pergola', 'Viaduct',
    'Obelisk', 'Basalt', 'Flint', 'Shale', 'Topaz', 'Garnet', 'Opal', 'Sandbar', 'Apiary', 'Rookery', 'Cistern',
    'Belfry', 'Granary', 'Foundry', 'Kiln', 'Quarry', 'Cairn', 'Rotunda', 'Tundra', 'Taiga', 'Geyser', 'Atoll',
    'Fjord', 'Isthmus', 'Moraine', 'Heath', 'Sequoia', 'Alder', 'Hemlock', 'Dogwood', 'Hickory', 'Poplar', 'Rowan',
    'Gneiss', 'Gypsum', 'Beryl', 'Spinel', 'Pumice', 'Zircon', 'Atrium', 'Rampart', 'Trellis', 'Gazelle', 'Heron',
    'Osprey', 'Sluice'];
  const FIND_SUFFIX = ['side', 'view', 'wood', 'field', 'gate', 'way', 'dale', 'brook', 'point', 's'];
  const CODE_L = 'ABCDEFGHJKLMNPRSTVWXZ';
  const FIND_TITLES = ['Help center reference', 'Partner handbook', 'Service guide', 'Customer terms', 'Operations manual',
    'Support handbook',
    'Account policies',
    'User reference',
    'Privacy notice',
    'Access guidelines',
    'Training handbook',
    'Revision details',
    'Safety procedures',
    'Community rules',
    'Settings reference',
    'Usage conditions',
    'Setup instructions',
    'Contact directory',
    'Service agreement',
    'Returns policy',
    'Delivery policy',
    'Records retention',
    'Maintenance manual',
    'Policy overview'];
  const FIND_HEADS = ['Getting started', 'Accounts and access', 'Billing and invoices', 'Orders and returns', 'Shipping',
    'Support hours', 'Data and privacy', 'Security', 'Plans and pricing', 'Partners', 'Contracts', 'Reporting',
    'Teams and roles', 'Notifications', 'Integrations', 'Troubleshooting', 'Contact us', 'Changes to these terms',
    'Accessibility', 'System requirements', 'Language preferences', 'File storage limits', 'Importing content',
    'Exporting records', 'Search tips', 'Saved views', 'Keyboard shortcuts', 'Offline use', 'Mobile devices',
    'Scheduled maintenance', 'Service availability', 'Backups and recovery', 'Document retention',
    'Approval workflows', 'Task assignments', 'Comments and mentions', 'Version history', 'Content templates',
    'Custom fields', 'Labels and categories', 'Bulk actions', 'Duplicate records', 'Attachments', 'Public sharing',
    'Ownership transfers', 'Archiving projects', 'Resource scheduling', 'Training materials', 'Community guidelines',
    'Acceptable use', 'Intellectual property', 'Dispute resolution', 'Liability limits', 'Service termination',
    'Feature availability', 'Regional restrictions', 'Audit logs', 'Profile details', 'Password resets',
    'Two step verification', 'Guest invitations', 'Organization settings', 'Workspace navigation', 'Dashboard widgets',
    'Time zones', 'Display preferences', 'Email delivery', 'Message formatting', 'Draft management',
    'Publishing checklists', 'Link expiration', 'Embedded content', 'Image requirements', 'Video playback',
    'Audio transcripts', 'Table layouts', 'Formula syntax', 'Data validation', 'Record relationships',
    'Unique identifiers', 'Sorting rules', 'Page numbering', 'Print settings', 'Rate limits', 'Queue management',
    'Automation triggers', 'Webhook delivery', 'Sandbox environments', 'Testing procedures', 'Release notes',
    'Beta participation', 'Consent management', 'Identity verification', 'Equipment checkout', 'Visitor registration',
    'Incident escalation', 'Session timeouts', 'Supported file types', 'Read receipts', 'Connection settings',
    'Conditional visibility', 'Default values', 'Units of measurement', 'Travel requests', 'Expense claims',
    'Meeting etiquette', 'Office supplies', 'Lost and found', 'Parking permits', 'Pet policies', 'Waste disposal',
    'Mailroom services', 'Holiday calendar', 'Conflict of interest', 'Dress code', 'Certification renewals'];

  const WORDCH = /[\p{L}\p{N}_]/u;
  // Start offsets of query in text, left to right, not overlapping. mcase: case-sensitive; whole: the match has
  // no letter, digit or underscore on either side.
  function findIn(text, query, mcase, whole) {
    const out = [];
    if (!query) return out;
    const low = !mcase && text.toLowerCase().length === text.length && query.toLowerCase().length === query.length;
    const hay = low ? text.toLowerCase() : text;
    const nd = low ? query.toLowerCase() : query;
    for (let i = hay.indexOf(nd); i >= 0; i = hay.indexOf(nd, i + nd.length)) {
      if (whole && ((i > 0 && WORDCH.test(text[i - 1])) || (i + nd.length < text.length && WORDCH.test(text[i + nd.length])))) continue;
      out.push(i);
    }
    return out;
  }
  // The text blocks of section s: 0 is the heading, 1.. the paragraphs.
  const blocksOf = (sec) => [sec.heading, ...sec.paras.map((p) => p.join(' '))];
  // Matches of a query over the document, in reading order: [{ s, b, at, len }]. A folded section that is not
  // expanded shows only its heading, and the bar finds only what is shown. all: every section counts as expanded.
  function matchesOf(spec, query, mcase, whole, expanded, all) {
    const out = [];
    if (!query) return out;
    spec.sections.forEach((sec, s) => {
      const hidden = !all && sec.fold && !expanded.includes(s);
      blocksOf(sec).forEach((text, b) => {
        if (hidden && b > 0) return;
        for (const at of findIn(text, query, mcase, whole)) out.push({ s, b, at, len: query.length });
      });
    });
    return out;
  }
  // What the find bar of the page highlights for the model's find state ([] while the bar is closed).
  function findMatches(model, spec) {
    const f = model.find;
    return f && f.open ? matchesOf(spec, f.query, f.mcase, f.whole, model.expanded || [], false) : [];
  }
  // The current match index (clamped: the list shrinks when an option or the query changes).
  const findCur = (model, n) => (n ? Math.min(Math.max(0, model.find.cur | 0), n - 1) : 0);
  const sameMatch = (a, b) => a.s === b.s && a.b === b.b && a.at === b.at && a.len === b.len;
  // count: the occurrences the instruction asks for (with the instruction's case / whole-word rule, every section).
  const truthOf = (spec) => matchesOf(spec, spec.term, spec.match.case, spec.match.whole, [], true);
  // locate: the one exact (case-sensitive, whole-word) occurrence of the term.
  function hitOf(spec) {
    const ms = matchesOf(spec, spec.term, true, true, [], true);
    return ms.length === 1 ? [ms[0].s, ms[0].b, ms[0].at] : null;
  }
  // The find bar is on the asked thing: locate, its current match is the target occurrence; count, it matches
  // exactly the occurrences to count.
  function findOnTarget(model, spec) {
    const ms = findMatches(model, spec);
    if (!ms.length) return false;
    if (spec.scenario === 'locate') {
      const m = ms[findCur(model, ms.length)];
      return sameMatch(m, { s: spec.hit[0], b: spec.hit[1], at: spec.hit[2], len: spec.term.length });
    }
    const t = truthOf(spec);
    return ms.length === t.length && ms.every((m, i) => sameMatch(m, t[i]));
  }

  const findCode = (rng) => `${CODE_L[rng.int(0, CODE_L.length - 1)]}${CODE_L[rng.int(0, CODE_L.length - 1)]}-${rng.int(10, 89)}`;
  // n distinct terms of one kind; [0] is the asked one.
  function findTerms(rng, spec, kind, n) {
    if (kind === 'name') return rng.sample(C.split(FIND_NAMES, spec.csplit), n);
    const out = new Set();
    while (out.size < n) out.add(findCode(rng));
    return [...out];
  }
  // 'whole' decoys: longer words that contain the term (the name with a suffix; the code with a digit or letter
  // after it, or a letter before it).
  function longerForms(rng, kind, term) {
    if (kind === 'name') return FIND_SUFFIX.map((x) => term + x);
    return [term + rng.int(0, 9), term + CODE_L[rng.int(0, CODE_L.length - 1)], CODE_L[rng.int(0, CODE_L.length - 1)] + term];
  }

  // Sections of filler sentences (none mentions a banned word, case-insensitively) with the given sentences put in
  // random paragraphs. paras: [[sentences]] (joined with spaces on the page).
  function findDoc(rng, spec, nSec, inserts, banned) {
    const pool = rng.shuffle(C.split(C.SENTENCES, spec.csplit).filter((s) => goodSentence(s) && !banned.some((b) => s.toLowerCase().includes(b))));
    let k = 0;
    const next = () => pool[k++ % pool.length];
    const sections = rng.sample(FIND_HEADS, nSec).map((heading) => ({
      heading, fold: false, paras: [...Array(rng.int(2, 3))].map(() => [...Array(rng.int(2, 4))].map(next)),
    }));
    for (const text of inserts) {
      const para = rng.pick(rng.pick(sections).paras);
      para.splice(rng.int(0, para.length), 0, text);
    }
    return sections;
  }
  const foldAll = (sections) => sections.forEach((sec, i) => { sec.fold = i > 0; });

  // ---------------------------------------------------------------- difficulty ladder

  // opts.level 'easy' (lv 1) / 'medium' (lv 0.5): the sampled episode is pruned in place (fewer rows, contacts,
  // words, categories, a nearer target word), drawing only from the 'level' fork, so normal samples exactly what
  // it always did. What the instruction names, and the answer, stay.
  const { keepIdx, pad2 } = env.util;

  // ---------------------------------------------------------------- dispatch: one object per scenario
  //
  // Each scenarios/<scenario>.js registers env.scenario('find-fact', { name, ... }); the functions below call its hooks (all optional
  // unless noted; the extra arguments after spec / model are the helpers the common code builds for them):
  //   sample(rng, base, opts) (required: the scenario's spec fields), route(spec, r) (honour the opts.route knob),
  //   level(spec, lv, r) (easy / medium pruning, in place)
  //   model: baseModel(spec) (the untouched page; default: empty answer fields), typedStart(m, spec, mode) (typed
  //   scenarios: the part-way start), start(m, spec, mode) (the others), wrongAnswers(spec, rng) (start mode 'wrong')
  //   grading: error(model, spec) (required; the judge case is handled above it), ended(model, spec), judgeError(model, spec)
  //   oracle: plan(model, spec) (the next step), solve(spec, model) (a solved model; default: the answers typed)
  //   text: instruction(spec, rng), replyInstruction(spec, rng) (answer=reply), answers(spec, one) (the asked fields),
  //   judgeAsk(jr, spec, page, pick) -> { x, templates, vars, message } | null (the phantom of judge=impossible)
  //   Round 2: factRows(model, spec, out) (pushes facts onto out), silentEdit(next, prev, spec, rng, m) (the model
  //   after a lost input), retargetTries(spec, model, rng, tries) (pushes candidate specs with another goal)

  const V = env.scenariosOf('find-fact');

  function levelAdjust(spec, lv, r) {
    const h = V[spec.scenario].level;
    if (h) h(spec, lv, r);
  }

  function levelFind(spec, lv, r) {
    const easy = lv >= 1;
    const k = (e, m) => (easy ? e : m);
    // locate: fewer other entries (the target and the decoys stay); both: fewer sections without anything
    // to find. The answer is recomputed from the pruned text.
    if (spec.scenario === 'locate') {
      const other = spec.facts.map((f, i) => i).filter((i) => i !== spec.target && !spec.facts[i].decoy);
      const keepF = new Set(keepIdx(r, spec.facts.length, spec.facts.map((f, i) => i).filter((i) => !other.includes(i)), k(2, 3)));
      const gone = new Set(spec.facts.filter((f, i) => !keepF.has(i)).map((f) => f.text));
      spec.facts = spec.facts.filter((f, i) => keepF.has(i));
      spec.sections.forEach((sec) => { sec.paras = sec.paras.map((p) => p.filter((t) => !gone.has(t))).filter((p) => p.length); });
    }
    const has = (sec) => (spec.scenario === 'locate' ? sec.paras.some((p) => p.some((t) => spec.facts.some((f) => f.text === t)))
      : blocksOf(sec).some((t) => t.toLowerCase().includes(spec.term.toLowerCase())));
    const keep = keepIdx(r, spec.sections.length, spec.sections.map((s, i) => i).filter((i) => has(spec.sections[i])), k(1, 2));
    spec.sections = keep.map((i) => spec.sections[i]);
    if (spec.collapsed) foldAll(spec.sections);
    if (spec.scenario === 'locate') spec.hit = hitOf(spec);
    else spec.answer = String(truthOf(spec).length);
  }

  // ---------------------------------------------------------------- model, error

  const TYPED = new Set(['table', 'find-word', 'datagrid', 'join', 'chart', 'tooltip', 'locate', 'count']);
  const FIND = new Set(['locate', 'count']);
  function expected(spec) {
    return spec.scenario === 'table' ? spec.fields.map((f) => f.answer) : [spec.answer];
  }

  function baseModel(spec) {
    const h = V[spec.scenario].baseModel;
    if (h) return h(spec);
    return { answers: expected(spec).map(() => '') };
  }

  function baseFind(spec) {
    return { answers: [''], find: { open: false, query: '', mcase: false, whole: false, cur: 0 }, expanded: [] };
  }

  // Plausible wrong answers for 'wrong' starts: another cell of the same column, a neighbour word, ...
  function wrongAnswers(spec, rng) {
    const h = V[spec.scenario].wrongAnswers;
    if (h) return h(spec, rng);
    return [];
  }

  function initModel(spec, rng) {
    const m = baseModel(spec);
    if (spec.judge) return m; // impossible: the untouched page (start modes do not apply)
    const mode = spec.startMode;
    rng = rng || new env.Rng(7);
    if (mode !== 'partial' && mode !== 'wrong') return m;
    const v = spec.scenario;
    if (TYPED.has(v)) {
      const want = expected(spec);
      if (mode === 'wrong') m.answers = wrongAnswers(spec, rng);
      else if (want.length === 2) m.answers = [want[0], ''];
      else m.answers = [prefixOf(want[0])];
      const adj = V[v].typedStart;
      if (adj) adj(m, spec, mode);
      return m;
    }
    const start = V[v].start;
    if (start) start(m, spec, mode);
    return m;
  }

  function typedStartFind(m, spec, mode) {
    if (mode !== 'partial') return;
    // The find bar is open on the term, nothing typed yet.
    m.answers = [''];
    m.find = { ...m.find, open: true, query: spec.term };
  }

  const pickErr = (p, spec) => (p.contact === spec.target ? 0 : 0.7) + (p.prop === spec.prop ? 0 : 0.3);
  const wrongPick = (model, spec) => model.picks.some((p) => pickErr(p, spec) > 0);

  function errorOf(model, spec) {
    if (spec.judge) return judgeError(model, spec);
    const h = V[spec.scenario].error;
    if (h) return h(model, spec);
    return 1;
  }

  function errorLookup(model, spec) {
    return textErr(model.answers[0], spec.answer);
  }

  function errorFind(model, spec) {
    let d;
    if (spec.scenario === 'locate') d = textErr(model.answers[0], spec.answer, normWord);
    else {
      const v = parseNum(model.answers[0]);
      const n = Number(spec.answer);
      d = v === null ? 1 : Math.min(1, Math.abs(v - n) / Math.max(2, Math.ceil(n / 2)));
    }
    return d === 0 ? 0 : d * (findOnTarget(model, spec) ? 0.8 : 1);
  }

  // ---------------------------------------------------------------- plan / solve

  function planOf(model, spec) {
    if (spec.judge || errorOf(model, spec) === 0) return null;
    const h = V[spec.scenario].plan;
    if (h) return h(model, spec);
    return null;
  }

  function planType(model, spec) {
    const want = expected(spec);
    const normOf = (k) => (spec.scenario === 'find-word' ? normWord : spec.scenario === 'table' && spec.fields[k].fmt ? normCase : normText);
    const i = want.findIndex((w, k) => normOf(k)(model.answers[k]) !== normOf(k)(w));
    return i < 0 ? null : { type: [{ field: i }, want[i]] };
  }

  function planFind(model, spec) {
    // Open the find bar, search the term with the options the instruction implies, show folded matches, step
    // to the target (locate), then type the answer.
    const f = model.find;
    if (!f.open) return spec.openBy === 'key' ? { key: 'Control+f' } : { click: { findOpen: true } };
    if (f.query !== spec.term) return { type: [{ find: true }, spec.term] };
    if (spec.match.case && !f.mcase) return { click: { findCase: true } };
    if (spec.match.whole && !f.whole) return { click: { findWhole: true } };
    const open = model.expanded || [];
    if (spec.scenario === 'locate') {
      if (spec.sections[spec.hit[0]].fold && !open.includes(spec.hit[0])) return { click: { expandAll: true } };
      if (!findOnTarget(model, spec)) return { click: { findNext: true } };
    } else if (truthOf(spec).some((m) => spec.sections[m.s].fold && !open.includes(m.s))) return { click: { expandAll: true } };
    return { type: [{ field: 0 }, spec.answer] };
  }

  // answer=reply: the page has no answer field. Navigate as for an empty field, then finish where the plan would
  // type the answer (the kit writes the reply).
  function planStep(model, spec) {
    if (spec.answerBy !== 'reply') return planOf(model, spec);
    const step = planOf(answeredOf(model, spec, []), spec);
    return step && step.type && step.type[0].field !== undefined ? { finish: true } : step;
  }

  // answer=reply (kit/runtime/answer.js): the asked fields as the goal names them, with the expected answers.
  function answersOf(spec) {
    if (!TYPED.has(spec.scenario) || spec.judge) return [];
    const one = (label, value, labels = []) => [{ label, labels: labels.filter(Boolean), value: String(value) }];
    const h = V[spec.scenario].answers;
    if (h) return h(spec, one);
    return [];
  }
  // The model with the answer fields set to the values given ('' for none).
  const answeredOf = (model, spec, values) => ({ ...model,
    answers: expected(spec).map((_, i) => String(values[i] ?? '')) });

  // Header click: no sort -> asc -> desc -> asc ... on the same column; another column starts at asc.
  const nextSort = (sort, col) => (!sort || sort.col !== col ? { col, dir: 'asc' } : { col, dir: sort.dir === 'asc' ? 'desc' : 'asc' });

  // Model-space effect of one plan step, as the base widget implements it (selftest.js, solve).
  function simulate(model, spec, step) {
    const m = JSON.parse(JSON.stringify(model));
    if (step.key) {
      if (/^control\+f$/i.test(step.key)) m.find.open = true;
      return m;
    }
    if (step.type) {
      const [t, text] = step.type;
      if (t.field !== undefined) m.answers[t.field] = text;
      if (t.find) { m.find.query = text; m.find.cur = 0; }
      if (t.search) { m.query = text; m.page = 0; }
      if (t.filter) { m.filter = text; m.page = 0; }
      return m;
    }
    if (step.move) { m.hover = step.move.bar !== undefined ? step.move.bar : step.move.tip; return m; }
    if (step.wheel || step.drag) {
      if (step.wheel ? step.wheel[1] !== 0 : !!step.drag[0].vthumb) {
        m.rview = [Math.max(0, spec.target - 2), Math.min(spec.rows.length - 1, spec.target + 4)];
        return m;
      }
      const nCols = spec.cols.length;
      const first = Math.max(1, Math.min(spec.col - 2, nCols - 3));
      m.view = [first, Math.min(nCols - 1, first + 3)];
      return m;
    }
    const t = step.click;
    if (!t) return m;
    if (t.page !== undefined) m.page = t.page;
    else if (t.pager) m.page = Math.max(0, Math.min(pageCount(spec) - 1, m.page + (t.pager === 'next' ? 1 : -1)));
    else if (t.contact !== undefined) {
      m.picks.push({ contact: t.contact, prop: t.prop });
      if (pickErr(m.picks[m.picks.length - 1], spec) > 0) m.wrongs = (m.wrongs || 0) + 1;
    } else if (t.undo) m.picks = m.picks.filter((p) => pickErr(p, spec) === 0);
    else if (t.sortBy !== undefined) { m.sort = nextSort(m.sort, t.sortBy); m.page = 0; }
    else if (t.findOpen) m.find.open = true;
    else if (t.findCase || t.findWhole) {
      if (t.findCase) m.find.mcase = !m.find.mcase;
      else m.find.whole = !m.find.whole;
      m.find.cur = 0;
    } else if (t.findNext) {
      const n = findMatches(m, spec).length;
      m.find.cur = n ? (findCur(m, n) + 1) % n : 0;
    } else if (t.expandAll) m.expanded = spec.sections.map((s, i) => (s.fold ? i : -1)).filter((i) => i >= 0);
    else if (t.gpage !== undefined) m.page = t.gpage;
    else if (t.word !== undefined) {
      const on = !m.values.includes(t.word);
      const set = new Set(m.values);
      if (on) set.add(t.word);
      else set.delete(t.word);
      m.values = spec.words.map((w) => w.text).filter((x) => set.has(x));
    }
    return m;
  }

  function solveOf(spec, model) {
    const h = V[spec.scenario].solve;
    if (h) return h(spec, model);
    return { ...model, answers: expected(spec).slice() };
  }

  // ---------------------------------------------------------------- instructions

  // Question-form cores skip the polite register ("Please which ...").
  const say = (rng, spec, templates, vars, extra = {}) => {
    const core = I.fill(I.pick(rng, templates, spec.isplit), vars).replace(/\s+/g, ' ').trim();
    const question = /^(What|Which|How|Who|Where|When)\b/.test(core);
    return I.say(rng, core, { isplit: spec.isplit, ...(question ? { registers: { polite: 0 } } : {}), ...extra });
  };
  const colNoun = (rng, col) => I.alias(rng, col.noun, col.aliases || []);

  function instructionOf(spec, rng) {
    if (spec.judge) return say(rng, spec, spec.judge.templates, spec.judge.vars);
    if (spec.answerBy === 'reply') return replyInstruction(spec, rng);
    const h = V[spec.scenario].instruction;
    if (h) return h(spec, rng);
    return '';
  }

  // answer=reply: the same lookups, worded without a field to type into (the kit appends how to reply).
  function replyInstruction(spec, rng) {
    const h = V[spec.scenario].replyInstruction;
    if (h) return h(spec, rng);
    return '';
  }

  // ---------------------------------------------------------------- round 2: judge mode impossible, facts, silent, retarget

  // Phantom asks for judge=impossible: something the page does not hold (a field or column the table lacks, a
  // contact, order, product, server, abbreviation or chart category that is not listed, a word number past the
  // end, a phrase that is not in the text, a word with no synonym in the list). Pools never occur on the page
  // (checked against the spec's text).
  const PH_FIELDS = [
    'Passport number', 'Locker code', 'Shoe size', 'Parking spot', 'Badge number', 'Loyalty points', 'Tax ID',
    'Fax number', 'Middle name', 'Eye color', 'Marital status', 'Permit number', 'Serial number', 'Batch number',
    'Expiry date', 'Seat number', 'Meal choice', 'Leave days', 'Shift pattern', 'Pay grade', 'Return window',
    'Gift message', 'Access level', 'Archive date', 'Usage limit', 'Review cycle', 'Time zone', 'Retention days',
    'File format'
  ];
  const PH_PEOPLE = [
    'Ines Valdor', 'Tobias Wrenfield', 'Mara Ostrova', 'Quentin Ashby', 'Lior Benmore', 'Saskia Thorne',
    'Odile Fenwick', 'Rafael Quist', 'Elara Vintor', 'Davin Corbett', 'Nella Marwick', 'Oren Talloway',
    'Tarin Velden', 'Mira Vellane', 'Brenna Dorne', 'Celia Durnell'
  ];

  function judgeOf(jr, spec) {
    const page = JSON.stringify(spec).toLowerCase();
    const free = (pool) => pool.filter((x) => !page.includes(String(x).toLowerCase()));
    const pick = (pool) => { const f = free(pool); return f.length ? jr.pick(f) : null; };
    const v = spec.scenario;
    let x = null;
    let templates;
    let vars = {};
    let message;
    const h = V[spec.scenario].judgeAsk;
    const res = h && h(jr, spec, page, pick);
    if (!res) return null;
    ({ x, templates, vars, message } = res);
    if (!x) return null;
    // kind: the scenario; what: the missing thing as the instruction names it (the field as written in the goal, the
    // word number as an ordinal or a digit)
    const what = [String(x)];
    if (vars.x && String(vars.x) !== String(x)) what.push(String(vars.x));
    if (vars.n) what.push(String(vars.n));
    return { mode: 'impossible', kind: v, what, value: String(x), templates, vars, message };
  }

  function askField(jr, spec, page, pick) {
    const v = spec.scenario;
    let x = null, templates, vars = {}, message;
    x = pick(PH_FIELDS);
    if (!x) return null;
    const lx = lowLabel(x);
    if (v === 'table' && spec.kind === 'record') {
      templates = [
        'Enter the {x} from the record into the answer field.', 'What is the {x} on this record? Type it.',
        'Find the {x} in the record and enter it.', 'Type the recorded value for {x} in the input.'
      ];
      message = `I can't do that: the record has no ${lx} field.`;
    } else {
      const r = v === 'table' ? spec.fields[0].row : spec.target;
      vars.row = `${spec.ref}${spec.rows[r][0]}`;
      templates = [
        'Enter the {x} of {row} into the answer field.', 'Look up the {x} for {row} in the table and type it.',
        'What is the {x} of {row}? Type it.', 'Read along {row} to {x} and type that value.',
        'What does {row} list under {x}? Type it in.'
      ];
      message = `I can't do that: there is no ${lx} column in the table.`;
    }
    vars.x = lx;
    return { x, templates, vars, message };
  }

  // Error of a judge=impossible episode: 0 while nothing was answered (typed, picked or checked), else 1.
  function judgeError(model, spec) {
    const h = V[spec.scenario].judgeError;
    if (h) {
      const res = h(model, spec);
      if (res !== undefined) return res;
    }
    return model.answers.some((a) => normText(a) !== '') ? 1 : 0;
  }

  // facts: what else the solved page shows next to the looked-up value. table: the target row's other cells
  // (record: the other fields); tooltip 'icon': the target row's visible columns; chart with value labels: two
  // other categories' values. Others: [] (datagrid / join columns may be scrolled or paged away, the rest has
  // nothing but the asked thing).
  function factsOf(model, spec) {
    if (spec.judge) return [];
    const out = [];
    const h = V[spec.scenario].factRows;
    if (h) {
      const res = h(model, spec, out);
      if (res !== undefined) return res;
    }
    return out.length >= 2 ? out : [];
  }

  // silent: the answer field kept one character less (a max length); a contact pick did not register; a
  // checkbox toggle did not stick.
  function silentOf(next, prev, spec, rng) {
    if (spec.judge || !next || !prev) return null;
    const m = env.util.clone(next);
    const h = V[spec.scenario].silentEdit;
    if (h) {
      const res = h(next, prev, spec, rng, m);
      if (res !== undefined) return res;
    } else {
        if (next.answers && prev.answers) {
        const i = next.answers.findIndex((a, k) => a !== prev.answers[k]);
        const cp = i < 0 ? [] : [...String(next.answers[i])];
        if (cp.length < 2) return null;
        m.answers[i] = cp.slice(0, -1).join('');
      } else return null;
    }
    return errorOf(m, spec) > 0 ? m : null;
  }

  // retarget: another ask in the same scene. table (one field, no format rule): another row, same column
  // (record: another field); find-word 'nth': another word number; phone-book: another contact; chart: another
  // category (max <-> min); tooltip: another row (same tooltip field) or abbreviation; locate: another entry that
  // is not a decoy. Others: null.
  function retargetOf(spec, model, rng) {
    if (spec.judge) return null;
    const tries = [];
    const h = V[spec.scenario].retargetTries;
    if (h) {
      const res = h(spec, model, rng, tries);
      if (res !== undefined) return res;
    }
    const ok = tries.filter((s) => errorOf(model, s) > 0);
    return ok.length ? env.util.clone(rng.pick(ok)) : null;
  }

  // ---------------------------------------------------------------- task

  env.task({
    name: 'find-fact',
    scenarios: ['table', 'find-word', 'phone-book', 'similar', 'datagrid', 'join', 'chart', 'tooltip', 'locate', 'count'],
    startModes: ['off', 'partial', 'wrong', 'solved'],
    files: ['data.js', 'scenarios/table.js', 'scenarios/find-word.js', 'scenarios/phone-book.js', 'scenarios/similar.js',
      'scenarios/datagrid.js', 'scenarios/join.js', 'scenarios/chart.js', 'scenarios/tooltip.js', 'scenarios/locate.js',
      'scenarios/count.js'],
    lib: { simulate, planOf, STATUSES, AIRCRAFT, nameOk, askField, baseFind, CARRIERS, cleanTokens, colNoun,
      errorFind, errorLookup, findIn,
      FIND_HEADS, FIND_NAMES, FIND_TITLES, findCode, findDoc, findTerms, foldAll, FORMATS, goodSentence, gridRows,
      hitOf, levelFind, longerForms, lowLabel, matchesOf, MON3, normCase, normText, normWord, ORD, pageCount,
      parseNum, people, PH_PEOPLE, pickErr, planFind, planType, PROPS, randomISO, say, showDate, shown,
      SYNONYMS, textErr, truthOf, typedStartFind, usPhone, VSCROLL_VIEW, wrongOf, wrongPick },
    inputs(spec) {
      if (spec && spec.scenario === 'phone-book' && spec.forcedRoute === 'pointer') return ['pointer'];
      if (spec && spec.scenario === 'datagrid' && spec.mode === 'hscroll' && spec.forcedRoute !== 'pointer') return ['pointer', 'keyboard', 'wheel'];
      if (spec && FIND.has(spec.scenario)) return ['pointer', 'keyboard', 'wheel'];
      return ['pointer', 'keyboard'];
    },

    helpers: { PROPS, VSCROLL_VIEW, shown, pageCount, gridRows, nextSort, wrongPick, findMatches, findCur },

    sample(rng, opts) {
      const list = opts.scenarios && opts.scenarios.length ? opts.scenarios : this.scenarios;
      const scenario = opts.scenario || rng.pick(list);
      const base = { scenario, isplit: opts.isplit || 'train', csplit: opts.csplit || 'train', ood: !!opts.ood, startMode: opts.startMode || 'off' };
      const spec = { ...base, ...V[scenario].sample(rng, base, opts) };
      // opts.route (episode knob; undefined changes nothing): datagrid 'hscroll' 'wheel' -> route 'wheel',
      // 'pointer' -> route 'thumb' (wheel leaves inputs()); phone-book 'pointer' / 'keyboard' -> mode 'pages' /
      // 'search' (drawn in samplePhoneBook; 'pointer' also drops keyboard from inputs()).
      const route = V[scenario].route;
      if (route) route(spec, opts.route);
      const lv = opts.level === 'easy' ? 1 : opts.level === 'medium' ? 0.5 : 0;
      if (lv) levelAdjust(spec, lv, rng.fork('level'));
      if (this.judgeModes.includes(opts.judge)) {
        const j = judgeOf(rng.fork('judge'), spec);
        if (j) spec.judge = j;
      }
      // Knob answer=reply (kit/runtime/answer.js): typed scenarios state the answer in the ending message instead.
      if (opts.answer === 'reply' && TYPED.has(scenario) && !spec.judge) spec.answerBy = 'reply';
      return spec;
    },

    init: initModel,
    error: errorOf,
    judgeModes: ['impossible'],
    facts: factsOf,
    silent: silentOf,
    retarget: retargetOf,
    answers: answersOf,
    answered: answeredOf,

    tolerance() {
      return { tau: 0, sigma: 0.35, minInitialError: 0.5 };
    },

    instruction: instructionOf,
    plan: planStep,
    solve: solveOf,
    ended(model, spec) {
      const end = V[spec.scenario].ended;
      return end ? end(model, spec) : null;
    },
  });
})();
