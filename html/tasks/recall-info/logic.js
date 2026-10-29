/*
 * recall-info: use information seen earlier that is no longer on screen.
 * Memory across pages. The task needs information the agent saw earlier that is no longer on screen: a
 * code from the first page of a flow, matches counted while a list unloads behind the scroll, the best record of
 * several result pages, values from another tab. Every "page" is an in-page view (no navigation, no URL change).
 * No MiniWoB counterpart (closest: read-table, phone-book); teaches carrying a fact across views, long horizons
 * and counting while scrolling.
 *
 * scenarios
 *   code       a request flow of 4-6 steps (ood 7-8): step 1 shows a reference code (spec.codeLabel) next to Next; the
 *              middle steps are filler (info, a required "I agree" tick, a preselected choice); the last step asks
 *              for the code from page one and has an in-app Confirm. Going back is costly: spec.back 'back' (a Back
 *              button, one step at a time) or 'restart' (a "Start over" link that clears the flow and returns to
 *              step 1; the code stays the same). The confirmation screen shows the code on file and a link to change
 *              it. The base widget keeps the code in the DOM only while step 1 is on screen for the first time (it
 *              is removed once the step is passed, Back shows no code; Start over shows it again). Judge: the first
 *              page shows no code.
 *   count      a lazy list (orders, tickets or files; 18-24 rows easy ... 40-60 normal, ood 80-120) in a scroll pane
 *              that loads a batch when the end is reached and unloads rows that scroll out of view. Count the rows
 *              that match one value of one column (the number is never shown; 2-16 matches easy, 4-24 medium, 7-36
 *              normal, 12-60 ood, so a blind guess is right at most ~3-7% of the time), type it and press the answer
 *              box's button. route 'wheel' | 'track' (the oracle scrolls with the wheel, or by pressing the scrollbar
 *              track below the thumb; both always work for a person).
 *   paginate   search results over 3-5 pages (ood 7-9) of 5-6 rows, no sort control. Select the record that is the
 *              cheapest / best rated (ask.mode 'best', needs the best of every page) or the one whose category has a
 *              given value (ask.mode 'match', exactly one row). Pager 'numbers' (jump to any page) or 'arrows'.
 *              Judge impossible: the asked category value occurs in no row.
 *   crossref   tabs: two source tabs with the same kinds of facts (Billing / Shipping, Sender / Recipient, Employee /
 *              Manager) and an Order tab, plus the form tab; fill 2-5 form fields from named source tabs and press
 *              the form's Save. The form never shows the values.
 *   compare    a catalog of 4-6 products (3 easy, ood 7-9) whose list shows names only; price, rating, delivery days and
 *              colour are on each product's detail view. Choose the cheapest / best rated / fastest one, or the one in
 *              a given colour. spec.listChoose: the list rows have a Choose button too (else only the detail view has
 *              one). Judge impossible: no product has the asked colour.
 *
 * spec   { scenario, startMode, isplit, csplit, ood, level, judge? }
 *   code       flow (noun), title, codeLabel, code, steps: [{ title, kind: 'show' | 'info' | 'ack' | 'choice' |
 *              'verify', body, options?, ack? }], back ('back' | 'restart'), labels { next, back, restart, confirm,
 *              reopen, done }
 *   count      dataset, noun, title, cols, rows: [[cells]] (cell 0 is the 1-based row number), critKind, critCol,
 *              critVal, critVals, answer, T, batch, route, wheelDy, ansLabel, submitLabel
 *   paginate   dataset, noun, nouns, title, cols, rows: [{ name, num, rate, cat }], numCol, numKind, dir, catCol,
 *              perPage, pages, pager, actLabel, ask { mode: 'best' | 'match', key ('num' | 'rate' | 'cat'), dir?,
 *              val?, target (row | null) }, target
 *   crossref   scene, formName, tabs: [{ name, kind: 'src' | 'form', rows?: [[key, value]] }], formIdx, fields: [{ id,
 *              label, src (tab index), key, truth }], labels { save, saved }
 *   compare    noun, nouns, title, items: [{ name, price, rating, delivery, colour, warranty, blurb }], listChoose,
 *              actLabel, ask { mode: 'best' | 'match', key ('price' | 'rating' | 'delivery' | 'colour'), dir?, val?,
 *              target }, target
 * model
 *   code       { step, acks: { step: bool }, choice: { step: idx }, entered, saved (code kept at Confirm | null),
 *                confirmed }
 *   count      { entered, saved, committed, reached (rows scrolled into view, mirrored by the widget, unscored by the
 *                answer but part of the progress) }
 *   paginate   { page, picked (row | null), seen: [bool per page] }
 *   crossref   { tab, entered: { id: text }, saved: { id: text } | null, committed, seen: [bool per tab] }
 *   compare    { view: 'list' | 'detail', open (item | null), picked (item | null), visited: [bool per item] }
 * error  tau 0, sigma 0.25
 *   code       0.4 * steps still to go / (steps - 1) + 0.4 * code distance + 0.2 * (not confirmed); the code counts
 *              as typed until Confirm, then as saved (letters and digits only, case-insensitive)
 *   count      0.6 * count error + 0.25 * (1 - rows seen / T) while the count is wrong + 0.15 * (not submitted);
 *              0 only when the right number is on file
 *   paginate / compare
 *              0 on the target; a wrong pick 0.4 + 0.45 * rank fraction (match asks: 0.85); no pick 1 - 0.3 * pages (items)
 *              visited. Judge impossible: 0 while nothing is picked, 1 after a pick.
 *   crossref   0.85 * mean edit distance of the form fields (the saved values once saved) + 0.15 * (not saved)
 *
 * start modes: off, partial (code: part-way through the flow; count: part-way down the list; paginate / compare:
 *   some pages / products already seen; crossref: some fields typed), wrong (code: wrong code typed, or confirmed
 *   with it; count: a wrong number on file; paginate / compare: a wrong record chosen; crossref: near-miss values),
 *   solved.
 *
 * levels: easy = 4 steps / 18-24 rows / 3 pages / 2 fields / 3 products; medium in between.
 *
 * judge modes (judgeModes): impossible in every scenario; the page starts untouched and the right move is a message that
 *   says so. code: the first page shows no code (it will be emailed); count: the list has no column to count by;
 *   paginate / compare: the asked category value / colour is in no record; crossref: the named source tab does not
 *   exist. error is 0 while nothing was committed (code: confirmed or a code typed; count: a number typed or sent;
 *   crossref: a field typed or saved; paginate / compare: a pick) and 1 after.
 *
 * plan targets (widget.locate)
 *   code       { field: true } the code field; { ack: s } the tick of step s; { nav: 'next' | 'back' | 'restart' |
 *              'confirm' | 'reopen' }
 *   count      { list: true } the pane (wheel target); { track: 'down' } the scrollbar track below the thumb;
 *              { field: true } the answer box; { commit: true } its button
 *   paginate   { page: p } a page number; { pager: 'prev' | 'next' }; { pick: row } the row's button
 *   crossref   { tab: i }; { field: id }; { commit: true }
 *   compare    { open: i } the View button of item i; { nav: 'back' } back to the list; { choose: i } the list
 *              button; { chooseOpen: true } the detail view's button
 * plan steps: { type: [target, text] } | { click: target } | { wheel: [target, dy] }
 *
 * Optional round-2 hooks (pure; see the html/kit/env.js header)
 *   facts(model, spec)               the code on file / the count on file and the list size / the chosen record and its
 *                                    price / the saved field values; [] for judge specs. Label paraphrases go in labels,
 *                                    aliases are other spellings of the value.
 *   silent(next, prev, spec, rng)    code and count: the answer kept at Confirm / Submit loses its last character;
 *                                    crossref: the longest saved value is cut short; paginate / compare: the pick
 *                                    lands on a neighbouring record. null when it does not apply
 *   retarget(spec, model, rng)       count: another value of the same column; paginate / compare: another ask over
 *                                    the same records; crossref: fields taken from the other source tab; code: null
 *   judgeModes ['impossible']   spec.judge = { mode, what, message, ... }; what: [the missing thing as the goal names it,
 *                                    other short ways to say it], which the reply must name; judged() only checks that
 *                                    the page is untouched
 *
 * Helpers (widget API, env.taskDef.helpers):
 *   apply(model, spec, act)        apply a page interaction to the model.
 *   fmtNum(spec, v)                format a result's price, salary or rent.
 *   rowsOnPage(spec, page)         row indices on one result page.
 *
 * Files: scenarios/<scenario>.js own each scenario's hooks; reporting.js owns facts, silent and retarget.
 * Shared pure code and the model-space effect of a plan step live on lib; the self-test lives in selftest.js.
 */
(function () {
  'use strict';

  const { lev, quote: q, clone } = env.util;

  const C = env.content;
  const I = env.instruct;

  const alnum = (s) => String(s ?? '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const sameText = (a, b) => alnum(a) === alnum(b);
  // 0 for a match, 1 for nothing typed, else the edit distance relative to the length (letters and digits only).
  function textErr(a, b) {
    const x = alnum(a);
    const y = alnum(b);
    if (x === y) return 0;
    if (!x) return 1;
    return Math.min(1, lev(x, y) / Math.max(3, y.length));
  }
  const last = (xs) => xs[xs.length - 1];

  // One alphanumeric character changed (a near miss).
  function near(rng, s) {
    const idx = [...s].map((c, i) => (/[A-Za-z0-9]/.test(c) ? i : -1)).filter((i) => i >= 0);
    if (!idx.length) return `${s}x`;
    const i = rng.pick(idx);
    const c = s[i];
    const L = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    let n;
    if (/[0-9]/.test(c)) { do n = String(rng.int(0, 9)); while (n === c); } else {
      do n = L[rng.int(0, L.length - 1)]; while (n === c.toUpperCase());
      if (c !== c.toUpperCase()) n = n.toLowerCase();
    }
    return s.slice(0, i) + n + s.slice(i + 1);
  }

  function fmtNum(spec, v) {
    const kind = spec.numKind;
    if (kind === 'usd') return `$${v.toFixed(2)}`;
    if (kind === 'salary') return `$${v}k`;
    if (kind === 'rent') return `$${String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}/mo`;
    return String(v);
  }

  const rowsOnPage = (spec, p) => {
    const out = [];
    for (let i = p * spec.perPage; i < Math.min(spec.rows.length, (p + 1) * spec.perPage); i++) out.push(i);
    return out;
  };

  // Rank fraction of a pick among records (0 = the best, 1 = the worst); match asks have none.
  function rankFrac(items, ask, picked) {
    if (ask.mode === 'match') return 1;
    const order = items.map((_, i) => i).sort((a, b) => (ask.dir === 'min' ? items[a][ask.key] - items[b][ask.key] : items[b][ask.key] - items[a][ask.key]));
    return order.indexOf(picked) / Math.max(1, items.length - 1);
  }
  function pickError(items, spec, picked, seenFrac) {
    if (spec.judge) return picked == null ? 0 : 1;
    if (picked === spec.target) return 0;
    if (picked == null) return 1 - 0.3 * seenFrac;
    return Math.min(0.99, 0.4 + 0.45 * rankFrac(items, spec.ask, picked));
  }

  const V = env.scenariosOf('recall-info');
  const lib = {
    C, I, q, clone, alnum, sameText, textErr, last, near, fmtNum, rowsOnPage, pickError,
    effect: (m, spec, step) => V[spec.scenario].effect(m, spec, step),
  };

  // Judge episodes: has anything been committed that the right ending (a message) must not do?
  function touched(m, spec) {
    switch (spec.scenario) {
      case 'code': return !!m.confirmed || !!m.entered;
      case 'count': return !!m.entered || !!m.committed;
      case 'crossref': return !!m.committed || Object.values(m.entered).some(Boolean);
      default: return m.picked != null;
    }
  }

  const ABSENT_COUNT = {
    orders: { col: 'Priority', vals: [
      'Urgent', 'High', 'Low', 'Normal', 'None', 'TBD'
    ], say: (v) => `orders with ${q(v)} priority` },
    tickets: { col: 'Status', vals: [
      'Open', 'Closed', 'Escalated', 'Queued', 'Triaged', 'Assigned', 'Blocked', 'Spam', 'Merged'
    ], say: (v) => `tickets with the status ${q(v)}` },
    files: { col: 'Status', vals: [
      'Archived', 'Draft', 'Shared', 'Locked', 'Synced', 'Deleted', 'Corrupt', 'Indexed', 'Ready'
    ], say: (v) => `files with the status ${q(v)}` },
  };
  const ABSENT_TABS = [
    'Warehouse', 'Archive', 'Returns', 'Accounts', 'Legal', 'Support', 'Logs', 'Projects', 'Vendors', 'Training',
    'Quality', 'Audits', 'Assets', 'Contracts', 'Meetings', 'Research', 'Catalog', 'Surveys', 'Repairs', 'Schedules'
  ];

  function judgeOf(spec, jr) {
    switch (spec.scenario) {
      case 'code':
        return { mode: 'impossible', what: [spec.codeLabel, `${spec.codeLabel} on the first page`], message: `I can't do that: the first page does not show a ${spec.codeLabel.toLowerCase()}, it only says one will be emailed.` };
      case 'count': {
        const a = ABSENT_COUNT[spec.dataset];
        const val = jr.pick(a.vals);
        return { mode: 'impossible', what: [`${a.col} column`, a.col, a.say(val)], phrase: a.say(val), message: `I can't do that: the list has no ${a.col} column, so I can't count ${a.say(val)}.` };
      }
      case 'crossref': {
        const shared = spec.fields.filter((f) => f.keyId !== null);
        const f = jr.pick(shared.length ? shared : spec.fields);
        const tab = jr.pick(ABSENT_TABS);
        return { mode: 'impossible', what: [`${tab} tab`, tab], field: f.id, tab, message: `I can't do that: there is no ${q(tab)} tab to take the ${f.label} from.` };
      }
      case 'paginate':
        return { mode: 'impossible', what: [spec.ask.val, `${spec.catCol} ${spec.ask.val}`], val: spec.ask.val,
          message: `I can't do that: no ${spec.noun} on any of the ${spec.pages} pages has ${spec.catCol.toLowerCase()} "${spec.ask.val}".` };
      default:
        return { mode: 'impossible', what: [spec.ask.val, `${spec.ask.val} ${spec.nouns}`], val: spec.ask.val, message: `I can't do that: none of the ${spec.nouns} comes in ${spec.ask.val}.` };
    }
  }

  // The judge episode's goal is the normal instruction of its scenario (the ask just matches nothing), so nothing in the
  // wording tells it apart.
  function judgeInstruction(spec, rng) {
    if (spec.scenario === 'count') return V.count.instruction(spec, rng, spec.judge.phrase);
    if (spec.scenario === 'crossref') return V.crossref.instruction(spec, rng);
    return V[spec.scenario].instruction(spec, rng);
  }

  const fam = {
    name: 'recall-info',
    scenarios: ['code', 'count', 'paginate', 'crossref', 'compare'],
    files: ['scenarios/code.js', 'scenarios/count.js', 'scenarios/paginate.js', 'scenarios/crossref.js',
      'scenarios/compare.js', 'reporting.js'],
    startModes: ['off', 'partial', 'wrong', 'solved'],
    judgeModes: ['impossible'],

    inputs(spec) {
      const v = spec && spec.scenario;
      if (v === 'code' || v === 'crossref') return ['pointer', 'keyboard'];
      if (v === 'count') return ['pointer', 'keyboard', 'wheel'];
      return ['pointer'];
    },

    // Internal code shared by the scenario files and the separate self-test.
    lib,
    helpers: {
      apply: (m, spec, act) => V[spec.scenario].apply(m, spec, act),
      fmtNum,
      rowsOnPage,
    },

    sample(rng, opts) {
      const pool = opts.scenarios && opts.scenarios.length ? opts.scenarios : this.scenarios;
      const scenario = opts.scenario || rng.pick(pool);
      const spec = { scenario, startMode: opts.startMode || 'off', isplit: opts.isplit || 'train', csplit: opts.csplit || 'train', ood: !!opts.ood,
        level: opts.level || 'normal' };
      const impossible = (this.judgeModes || []).includes(opts.judge);
      V[scenario].sample(rng, spec, opts, impossible);
      if (impossible) spec.judge = judgeOf(spec, rng.fork('judge'));
      return spec;
    },

    init(spec, rng) { return V[spec.scenario].init(spec.judge ? { ...spec, startMode: 'off' } : spec, rng); },
    error: (m, spec) => (spec.judge ? (touched(m, spec) ? 1 : 0) : V[spec.scenario].error(m, spec)),
    tolerance: () => ({ tau: 0, sigma: 0.25 }),

    // The ending's words are graded by the kit (spec.judge.what); here only the page must be untouched.
    judged(model, spec) {
      return !touched(model, spec);
    },

    instruction(spec, rng) {
      if (spec.judge && spec.scenario !== 'code') return judgeInstruction(spec, rng);
      return V[spec.scenario].instruction(spec, rng);
    },

    plan: (m, spec) => V[spec.scenario].plan(m, spec),

    solve: (spec, model) => V[spec.scenario].solve(spec, model),
    facts: (...args) => lib.facts(...args),
    silent: (...args) => lib.silent(...args),
    retarget: (...args) => lib.retarget(...args),
  };

  env.task(fam);
})();
