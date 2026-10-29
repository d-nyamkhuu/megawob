/*
 * choose-option: choose the right option(s) in a form widget.
 * MiniWoB counterparts: choose-list, click-option, click-checkboxes (+ -large, -soft, -transfer),
 * use-autocomplete, click-scroll-list. The other scenarios have no MiniWoB counterpart; they cover form
 * mechanics common on real sites (searchable selects, chips, switches, select-all trees, dependent selects).
 *
 * scenarios
 *   dropdown      a custom (div) dropdown with 5-15 options (ood 16-20): click it open, click the option
 *   radio         a radio group with 3-6 options (ood 7-9), pick one. A share of shipping-method groups shows
 *                 price and delivery time per option and asks for "the cheapest", "the fastest" or "the
 *                 cheapest that arrives within N days" (page-grounded: read the options)
 *   checkbox      4-10 checkboxes (ood 11-16), exactly 1-4 (ood up to 6) must end up checked
 *   autocomplete  a text field over a datasource (countries, names, cities, languages); typing shows up to
 *                 MAX_SUGGEST suggestions that start with the typed text (case-insensitive); the target is
 *                 named in full or by a hint ("starts with 'Mal' and ends with 'sia'") and must be committed
 *                 from the suggestions. Modes: spec.latency > 0 = suggestions load on the kit clock (a
 *                 "Searching..." row for latency ms after each keystroke; the oracle waits); text without
 *                 matches shows "No results" (a 'wrong' start may hold a misspelt query to recover from);
 *                 spec.keys = keyboard route (type, ArrowDown to the target, Enter)
 *   listbox       a fixed-height scrollable list of 15-30 items (ood 40-60) showing spec.rows rows; select one
 *                 (single) or 2-3 (multi, clicks toggle); a target starts out of view. spec.route: 'wheel'
 *                 (the oracle wheels inside the list) or 'drag' (it drags the scrollbar thumb)
 *   grouped       a select whose popup is a long list with option-group headers (cities by country, products
 *                 by category) and disabled (unavailable) options; the popup shows spec.rows rows and scrolls
 *                 (spec.route wheel | drag on its own scrollbar). criterion 'name' (named target) or
 *                 'firstAvail' ("the first available option under Germany": skip the disabled ones)
 *   combobox      a searchable select (Select2-like): click it open, type into its search box to filter
 *                 (case-insensitive substring), click the match; spec.keys = type, arrows, Enter (the first
 *                 match is highlighted after typing). 18-35 long product names (ood 50-80)
 *   chips         a multi-select with chips: the field shows one chip per chosen option (x removes it); a
 *                 click on the field opens the remaining options (the list stays open while adding).
 *                 Exactly the target set must remain; 'wrong' starts hold extra chips to remove
 *   tags          a tag input: chips plus a text field. Typing shows up to 8 suggestions that start with the text
 *                 (options not yet chosen); a click on one, or ArrowDown + Enter (spec.keys), adds it as the last
 *                 chip; the x on a chip removes it. Only the first spec.maxShow (2-3, ood 3-4) chips show: the
 *                 rest hide behind a "+N more" chip (click it to expand them all). Exactly the target set must
 *                 remain; 'wrong' starts hold extra chips, often hidden behind "+N more"
 *   toggles       a settings list of 5-8 switches (ood 9-12) with plain, enabling and NEGATED labels
 *                 ("Disable email notifications", "Hide online status", "Block pop-ups"); the instruction
 *                 names the effect ("turn email notifications off"), so a negated switch must be ON. Unnamed
 *                 switches keep their start state. Native checkboxes or custom switches (widget choice)
 *   tree          1-2 groups (ood 3) of 3-6 children (ood 7-9) under a tri-state "select all" parent
 *                 checkbox (checked / indeterminate / unchecked; a click checks all unless all are checked),
 *                 or, with spec.links, "Select all" / "Clear" links per group. Goals per group: all, all
 *                 except E, none, only O. The oracle takes the parent/link shortcut when it is shorter
 *   dependent     two dependent selects: Country, then City (the city list depends on the country, is
 *                 disabled until one is chosen, and resets when the country changes)
 *   matrix        a Likert / rating grid: 3-5 rows (ood 6-8) of statements x one radio per column of a scale
 *                 (Poor .. Excellent, Strongly disagree .. Strongly agree, Never .. Always, ...); 1-3 rows (ood up
 *                 to 5) are named in the goal with the column to pick ("rate the service Excellent"), the other
 *                 rows are left as they are. A new scenario: it is mixed in by its own fork (rng.fork('widget')),
 *                 so the seeds of the older scenarios are unchanged.
 *
 * Option texts come from env.content (countries, cities, first names, products, shipping methods) and
 * local banks (languages, colors, toppings, amenities, topics, settings, permission trees); distractors
 * share the first letters of the targets. Every content pick honors spec.csplit.
 *
 * spec   { scenario, category, label, labelAliases, noun, plural, title, note, placeholder, isplit, csplit, ood,
 *          startMode,
 *          options: [string],          displayed options in order (autocomplete: the datasource; grouped:
 *                                      flat order; tree: all children; toggles: labels; dependent: countries)
 *          target: string,             single-choice scenarios (dependent: { country, city })
 *          targets: [string],          checkbox, listbox, chips
 *          multi, rows, route ('wheel' | 'drag')                       listbox, grouped (rows, route)
 *          hint: { kind: 'full' | 'affix', prefix, suffix? }, typed, latency (ms), keys, maxSuggest   autocomplete
 *          details: { option: text }, criterion: { kind: 'cheapest' | 'fastest' | 'within', days? }   radio
 *          groups: [{ name, options: [string] }], disabled: [string], criterion: 'name' | 'firstAvail',
 *          group (the target's group)                                  grouped
 *          query (typed by the oracle), keys                           combobox
 *          targets, maxShow, keys, queries: { target: typed prefix }    tags
 *          items: [{ label, concept, kind, neg, desc }], want: [bool], base: [bool], said: [index]   toggles
 *          groups: [{ name, options, goal: { kind: 'all' | 'except' | 'none' | 'only', list } }],
 *          links: bool, targets (all checked children)                 tree
 *          cities: { country: [city] }                                 dependent
 *          rows: [label], cols: [label], goals: [column | null per row] (options = rows)   matrix
 *        }
 * model  dropdown      { value, open }
 *        radio         { value }
 *        checkbox      { values }
 *        autocomplete  { value, text, open, loading, readyAt, active }   active = keyboard highlight (-1 none)
 *        listbox       { values, scroll, px }                     scroll = first visible row (float), px = row
 *                                                                 pitch in px (mirrored by the widget)
 *        grouped       { value, open, top, lay }                 top = popup scrollTop px; lay = { row, head,
 *                                                                 pad, view } px layout facts the widget mirrors
 *        combobox      { value, open, query, active }
 *        chips         { values, open }
 *        tags          { values (in the order added), text, open, active, expanded }
 *        toggles       { on: [bool] }
 *        tree          { values }                                checked children
 *        dependent     { country, city, open: '' | 'country' | 'city' }
 *        Only value(s) / on / country+city are graded; the rest mirrors the widget's view state so the plan
 *        can be closed-loop.
 * error  single choice (dropdown, radio, autocomplete, grouped, combobox): 0 if value === target else 1
 *        sets (checkbox, listbox, chips, tags): 1 - Jaccard(values, targets)
 *        toggles: number of switches in the wrong state; tree: |values xor targets| / children
 *        dependent: 0.5 * (country wrong) + 0.5 * (city wrong). matrix: share of the asked rows with the wrong column.
 *        tau = 0 (exact) everywhere.
 *
 * levels (opts.level easy | medium; normal is unchanged; spec.level records it): fewer options and targets
 *        (dropdown 6 / 9 options, radio 3 / 4, checkbox 6 / 8 with 2 / 3 targets, chips 7 / 10, tags 10 / 14 with
 *        2 / 3 targets and no hidden "+N more" chip needed, combobox 12 / 18, dependent 5 / 7 countries, listbox
 *        rows + 6 / + 10 options with one target (easy), autocomplete a longer typed prefix (2-4 suggestions) and
 *        no latency (easy), toggles 4 / 6 switches with 1 / 2 asked, tree 1 group of at most 4 / 5 children (easy),
 *        matrix 3 rows with 1 asked row (easy) / 4 rows, 2 asked (medium)). grouped stays as it is.
 *
 * judge modes (judgeModes; opts.judge; spec.judge = { mode, message, ... }; built from its own fork once the spec is final, so
 *   nothing else in it changes and no rng is drawn while opts.judge is off). ambiguous / impossible start on the solved page
 *   (the sampled target held; init() solves) and the instruction is a one-line request about something else:
 *   ambiguous   two options match the description ("the country that starts with 'Ma'": exactly two options start with it;
 *               without such a pair "either A or B"); sets add / remove one such option, toggles name a word two
 *               switches share, a matrix names a row word two rows start with; the reply asks (status ask), one option
 *               per candidate (spec.judge.cands: each option's name and shortened forms; others: the page's other options,
 *               never offered)
 *   impossible  an option the widget does not offer ("Atlantis" as a country; a setting, a row or a city that is not there);
 *               status impossible, what names it (spec.judge.what)
 *   confirm     the normal task plus "but check with me before you submit" (the kit's end control is the final step, whose
 *               ending the kit caps; this task has no in-app irreversible button, so no widget flag)
 *
 * optional hooks (contract the html/kit/env.js header; pure, no DOM; called only by their knobs):
 *   parts(model, spec)            preempt=cancel: every option with its state (selected / checked), the switches, the rows,
 *                                 (dependent) the countries and cities
 *   facts(model, spec)            the choice as the page shows it plus a derived fact: single choice (label, the group it sits
 *                                 under, a shipping option's price and delivery time), sets (selected count and the list),
 *                                 toggles (switches on, the named switches), tree (checked of all), dependent (country, city),
 *                                 matrix (answered rows and the first asked row); always 2-4, "Options available" tops up
 *   silent(next, prev, spec, rng) a just-correct choice is wrong though the page shows it done: a neighbouring option (or the
 *                                 previous value), one picked item dropped or an extra one put back, a switch that did not
 *                                 stick, a rating one column off, a city swapped within its country
 *   retarget(spec, model, rng)    a new goal on the same page: another option (radio with a criterion: another criterion with a
 *                                 different winner), a target swapped in a set, a switch with the opposite effect, another
 *                                 group goal, another city or country, another rating column
 *
 * start modes: off, partial (a popup open / a prefix typed / some targets done / the country chosen),
 *        scene (the reference screen's unsolved state: dropdown, grouped and combobox open with nothing chosen
 *        or typed; autocomplete with a query typed and the suggestion list open, nothing committed; the other
 *        scenarios read it as off),
 *        wrong (a near-miss option chosen, extra chips or checks, a misspelt autocomplete query, the
 *        negated switches in their literal state, the inverse tree selection, another country's city),
 *        solved. No scenario ends early, so there is no recoverable mode.
 *
 * plan targets (the widget's locate() maps them to viewport px)
 *   { open: 'dropdown' | 'grouped' | 'combobox' | 'country' | 'city' }  a closed select's trigger
 *   { option: text, of?: 'country' | 'city' }   a row in an open list / a radio or checkbox input / a listbox
 *                                       row / a tree child / a chips popup option
 *   { field: 'search' }                 the autocomplete text field     { field: 'query' } combobox search box
 *   { field: 'chips' }                  the chips input (opens the option list)
 *   { field: 'tags' }                   the tag input
 *   { more: true }                      the "+N more" chip (expands the hidden chips)
 *   { suggestion: text }                a row in the autocomplete suggestion list
 *   { remove: text }                    the x on a chip
 *   { toggle: index }                   a settings switch
 *   { cell: [row, column] }             matrix: the radio of that row under that column (labels)
 *   { parent: groupIndex }              a tree group's select-all checkbox
 *   { link: [groupIndex, 'all' | 'none'] }   a tree group's Select all / Clear link
 *   { list: 'list' | 'popup' }          a point inside the listbox / grouped popup list (wheel target)
 *   { thumb: 'list' | 'popup' }         the scrollbar thumb's current center
 *   { scroll: s }                       listbox: thumb center when the first visible row is s
 *   { scrollTop: px }                   grouped: thumb center when the popup list is scrolled to px
 * plan steps: { click }, { type: [{ field }, text] }, { key: 'ArrowDown' | 'ArrowUp' | 'Enter' },
 *   { wheel: [{ list }, dy] }, { drag: [{ thumb }, { scroll | scrollTop }] }, { wait: true } (autocomplete
 *   loading)
 * Helpers (widget API, env.taskDef.helpers):
 *   suggest(spec, text) matching autocomplete suggestions.
 *   tagSuggest(spec, model) matching unselected tags.
 *   comboFilter(spec, query) combobox substring matches.
 *   listHeight(spec, lay) grouped popup content height in pixels.
 *   treeState(spec, group, values) none, some or all children selected.
 *   treeClick(spec, values, target) checked children after a parent, link or child click.
 *   MAX_SUGGEST maximum number of autocomplete and tag suggestions (8).
 * Self-test: selftest.js (loaded only by the checker and Node tests).
 * Internal code: data.js, sampling.js, model.js, judge.js, instructions.js, hooks.js and scenarios/*.js.
 *
 * opts.traits.grid (a widget with a dense checkbox grid in 3-5 columns): checkbox samples 12-24 options (ood 25-32)
 *   and 2-5 (ood up to 7) targets; other widgets keep 4-10.
 * opts.traits.topic 'topics' | 'amenities': checkbox groups of that content (category topic / amenity) instead of a
 *   random category. opts.traits.count [lo, hi]: checkbox option count (capped by the content bank, which the
 *   content split may shrink).
 * opts.route ('keyboard' | 'pointer' | 'wheel' | undefined = own mix): autocomplete, combobox and tags force
 *   spec.keys (type, ArrowDown, Enter) on 'keyboard' and clicks on 'pointer'; listbox and grouped force spec.route
 *   'wheel' on 'wheel' and the scrollbar drag on 'pointer'. Other scenarios have no such route and ignore it.
 *
 * Deviations from MiniWoB: instructions vary in register and never name the end control; option banks
 * are realistic and much larger; autocomplete may load asynchronously on the task clock.
 */
(function () {
  'use strict';

  const { quote, clamp, nonEmpty, listText } = env.util;

  const C = env.content;

  const I = env.instruct;

  const MAX_SUGGEST = 8;

  const lc = (s) => s.toLowerCase();

  const pre2 = (s) => lc(s.slice(0, 2));

  const alpha = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

  const uniq = (xs) => [...new Set(xs)];

  const splitPool = (pool, csplit) => {
    const part = C.split(pool, csplit);
    return part.length >= 12 ? part : pool;
  };

  function suggest(spec, text) {
    const t = lc(String(text || '').trim());
    if (!t) return [];
    return spec.options.filter((o) => lc(o).startsWith(t)).slice(0, spec.maxSuggest || MAX_SUGGEST);
  }

  const keysOf = (opts, keys) => (opts.route === 'keyboard' ? true : opts.route === 'pointer' ? false : keys);

  const routeOf = (opts, route) => (opts.route === 'wheel' ? 'wheel' : opts.route === 'pointer' ? 'drag' : route);

  function tagSuggest(spec, model) {
    const t = lc(String(model.text || '').trim());
    if (!t) return [];
    return spec.options.filter((o) => !model.values.includes(o) && lc(o).startsWith(t)).slice(0, MAX_SUGGEST);
  }

  function comboFilter(spec, query) {
    const q = lc(String(query || '').trim());
    return q ? spec.options.filter((o) => lc(o).includes(q)) : spec.options.slice();
  }

  const visible = (spec, scroll, i) => i >= scroll - 0.02 && i + 1 <= scroll + spec.rows + 0.02;

  const DEF_LAY = { row: 32, head: 28, pad: 4, view: 0 };

  const groupOfIndex = (spec, i) => {
    let n = 0;
    for (let g = 0; g < spec.groups.length; g++) {
      n += spec.groups[g].options.length;
      if (i < n) return g;
    }
    return spec.groups.length - 1;
  };

  const rowY = (spec, lay, i) => lay.pad + i * lay.row + (groupOfIndex(spec, i) + 1) * lay.head;

  const listHeight = (spec, lay) => 2 * lay.pad + spec.options.length * lay.row + spec.groups.length * lay.head;

  const layOf = (spec, model) => {
    const l = { ...DEF_LAY, ...(model.lay || {}) };
    if (!l.view) l.view = spec.rows * l.row;
    return l;
  };

  function treeState(spec, g, values) {
    const kids = spec.groups[g].options;
    const n = kids.filter((k) => values.includes(k)).length;
    return n === 0 ? 'none' : n === kids.length ? 'all' : 'some';
  }

  const CRIT_TEXT = (d) => `${d.price === 0 ? 'Free' : `$${d.price.toFixed(2)}`} · ${d.days[1] === 0 ? 'today'
    : d.days[0] === d.days[1] ? `${d.days[0]} day${d.days[0] > 1 ? 's' : ''}` : `${d.days[0]}–${d.days[1]} days`}`;

  const matrixAsked = (spec) => spec.rows.map((_, i) => i).filter((i) => spec.goals[i] !== null);

  function treeClick(spec, values, t) {
    const vals = new Set(values);
    if (t.parent !== undefined || t.link) {
      const g = t.parent !== undefined ? t.parent : t.link[0];
      const kids = spec.groups[g].options;
      const st = treeState(spec, g, values);
      const on = t.link ? t.link[1] === 'all' : st !== 'all';
      for (const k of kids) (on ? vals.add(k) : vals.delete(k));
    } else if (vals.has(t.option)) vals.delete(t.option);
    else vals.add(t.option);
    return spec.options.filter((o) => vals.has(o));
  }

  const SCENARIOS = ['dropdown', 'radio', 'checkbox', 'autocomplete', 'listbox', 'grouped', 'combobox', 'chips', 'tags', 'toggles', 'tree', 'dependent', 'matrix'];

  const NEW_SCENARIOS = ['matrix'];

  const JUDGE_MODES = ['ambiguous', 'impossible', 'confirm'];

  const lib = { quote, clamp, nonEmpty, listText, C, I, MAX_SUGGEST, lc, pre2, alpha, uniq, splitPool, suggest, keysOf, routeOf, tagSuggest, comboFilter, visible, DEF_LAY, groupOfIndex, rowY, listHeight, layOf, treeState, CRIT_TEXT, matrixAsked, treeClick };

  env.task({
    name: 'choose-option',
    scenarios: SCENARIOS,
    files: ['data.js', 'sampling.js', 'model.js', 'judge.js', 'instructions.js', 'hooks.js',
      'scenarios/dropdown.js', 'scenarios/radio.js', 'scenarios/checkbox.js', 'scenarios/autocomplete.js',
      'scenarios/listbox.js', 'scenarios/grouped.js', 'scenarios/combobox.js', 'scenarios/chips.js', 'scenarios/tags.js',
      'scenarios/toggles.js', 'scenarios/tree.js', 'scenarios/dependent.js', 'scenarios/matrix.js'],
    lib,
    helpers: { suggest, tagSuggest, comboFilter, listHeight, treeState, treeClick, MAX_SUGGEST },
    startModes: ['off', 'partial', 'wrong', 'solved', 'scene'],
    inputs: ['pointer', 'keyboard', 'wheel'],

    sample(rng, opts) {
      const allowed = opts.scenarios && opts.scenarios.length ? opts.scenarios : this.scenarios;
      const older = allowed.filter((x) => !NEW_SCENARIOS.includes(x));
      let scenario = opts.scenario || (older.length ? rng.pick(older) : rng.pick(allowed));
      if (!opts.scenario && older.length && older.length < allowed.length) {
        const w = rng.fork('widget');
        if (w.bool(0.1)) scenario = w.pick(allowed.filter((x) => NEW_SCENARIOS.includes(x)));
      }
      for (let t = 0; t < 20; t++) {
        const spec = lib.sampleSpec(rng.fork(`try${t}`), scenario, opts);
        if (spec) {
          const out = opts.level && opts.level !== 'normal' ? lib.applyLevel(spec, opts.level) : spec;
          // Judge episodes: built last from their own fork (nothing is drawn while the knob is off).
          if (JUDGE_MODES.includes(opts.judge)) {
            const j = lib.judgeOf(rng.fork('judge'), out, opts.judge);
            if (j) out.judge = j;
          }
          return out;
        }
      }
      throw new Error(`choose-option: could not sample ${scenario}`);
    },

    // ambiguous / impossible: the page starts as it should stay (the sampled target already chosen).
    init(spec, rng) {
      const m = lib.initModel(spec, rng);
      return spec.judge && spec.judge.mode !== 'confirm' ? lib.solveOf(spec, m) : m;
    },
    error: (...args) => lib.errorOf(...args),
    judgeModes: JUDGE_MODES,
    facts: (...args) => lib.facts(...args),
    parts: (...args) => lib.parts(...args),
    silent: (...args) => lib.silent(...args),
    retarget: (...args) => lib.retarget(...args),

    tolerance(spec) {
      const v = spec.scenario;
      if (v === 'checkbox' || v === 'listbox' || v === 'chips' || v === 'tags') return { tau: 0, sigma: 0.35, minInitialError: 0.3 };
      if (v === 'toggles') return { tau: 0, sigma: 0.8, minInitialError: 0.5 };
      if (v === 'tree') return { tau: 0, sigma: 0.25, minInitialError: 0.1 };
      if (v === 'dependent') return { tau: 0, sigma: 0.4, minInitialError: 0.4 };
      if (v === 'matrix') return { tau: 0, sigma: 0.35, minInitialError: 0.3 };
      return { tau: 0, sigma: 0.5, minInitialError: 0.5 };
    },

    tick(model, spec, dt, now) {
      if (spec.scenario !== 'autocomplete' || !model.loading || now < model.readyAt) return model;
      return { ...model, loading: false, active: -1 };
    },

    instruction: (...args) => lib.instructionOf(...args),
    plan: (...args) => lib.planOf(...args),
    solve: (...args) => lib.solveOf(...args),
  });
})();
