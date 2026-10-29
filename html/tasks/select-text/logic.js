/*
 * select-text: select a span of text (native text selection).
 * MiniWoB counterparts: highlight-text, highlight-text-2.
 *
 * The text is one document string: spec.paragraphs joined with '\n\n'. Every position below is a
 * character offset into that string (spec.doc), so the model does not depend on how a widget lays it out.
 *
 * scenarios
 *   paragraph  select a whole paragraph, named by position ("the third paragraph"), topic ("the paragraph
 *              about the lighthouse", story text) or a word only that paragraph contains (real text)
 *   sentence   select one sentence, named by position, by a word that occurs only in it, or by its
 *              first few words (a prefix no other sentence shares)
 *   phrase     select an exact quoted phrase of 2-5 words that occurs exactly once in the document; with
 *              inline marks (spec.marks: links / bold runs) the phrase often spans a mark boundary
 *   word       select one word that occurs once in the document (double-click, drag or keyboard)
 *   tip        hover-only tooltips: a few words of the text are underlined (spec.marks of kind 'tip', each with a
 *              tooltip "Key term: <word>" that shows only while the pointer is over it). The instruction names
 *              one underlined word; its tooltip names the word to select, which the page text never reveals
 *              (the other tooltips name decoys). Single unique word target, no pane. Only the 'paragraphs' widget.
 *   field      a realistic message (support reply, order notice, meeting note) with entities in it; select
 *              the one named by its role: "the email address", "the tracking number", "the total" ...
 *
 * Text: realistic sentences from env.content (SENTENCE_GROUPS, emailBody-style entities) or, in a share
 * of paragraph/sentence/phrase episodes, the older synthetic story grammar. Long documents can sit in a
 * scrolling pane (spec.pane; widgets that declare traits.pane): the target then starts below the visible part.
 *
 * spec   { scenario, isplit, csplit, ood, startMode, paragraphs[], doc, sentences: [[start, end]], target:
 *          { start, end }, text, ask: { kind, ... }, source ('story' | 'real' | 'message' | 'terms' | 'chat' | 'table' | 'line'), marks:
 *          [{ start, end, kind: 'link' | 'bold' }], pane (bool), route ('drag' | 'dblclick' | 'shift' |
 *          'keys' | 'triple'), scroll ('wheel' | 'thumb'), keys (keyboard allowed), inputRoute (opts.route),
 *          unit? ('clause' | 'message' | 'cell'), titles? (clause titles), chat? ({ people, who[], at[] }), table? ({ cols,
 *          rows }), native? ('textarea' | 'input'), level? ('easy' | 'medium') }
 *        tip: ask { kind: 'tip', anchor (the underlined word to hover), anchorAt (its offset), word (the target) },
 *          marks [{ start, end, kind: 'tip', tip }] (the anchor's tip names the target)
 *        target is a half-open range [start, end) with no leading/trailing whitespace; text = doc.slice(start, end)
 * model  { start, end }   (tip: + tipSeen, set by the widget when the pointer enters the instructed underlined word)
 *        the current selection, half-open; start == end means nothing selected (or a
 *        caret at that offset). A widget maps a selection outside the text to empty and clamps a partial
 *        one to the text. Unscored mirror for pane widgets: pane { scroll, view, max, y0, y1 } (px: the
 *        pane's scroll offset, visible height, max scroll, and the target's top / bottom in content px).
 * error  1 - IoU(selection, target) on characters, after trimming whitespace off both ends of the selection
 * tau    0.02 (exact for short spans, a few characters of slack on a whole paragraph); sigma 0.1
 * levels easy / medium: shorter documents (paragraphs 3 / 3-4, at most as many sentences as the minimum /
 *        minimum + 1, fewer message roles), no scrolling pane and no inline marks (links, bold), and a looser
 *        tolerance (tau 0.12 easy, 0.06 medium; an IoU of 0.88 still passes on easy). Normal is unchanged.
 *
 * plan targets: { char: i, edge: 'before' | 'after' }   the viewport point just inside the left
 *   ('before') or right ('after') side of the glyph of doc[i], vertically centred on its line, such
 *   that a press or release there puts the caret at offset i ('before') or i + 1 ('after').
 *   { pane: 'y' } a point over the scrolling pane; { thumb: 'y' } / { thumbAt: s } its scrollbar thumb
 *   and where to drop it so the pane scrolls to s px.
 * plan steps by route
 *   drag      { drag: [{ char: start, edge: 'before' }, { char: end - 1, edge: 'after' }] }
 *   dblclick  { dblclick: { char: middle of the word } }                        (word, tip)
 *   tip       first { move: { char: ask.anchorAt, edge: 'before' } } (hover the underlined word until
 *             model.tipSeen), then the route below
 *   shift     { dblclick: first word }, then { click: { char: end - 1, edge: 'after' }, modifiers: ['Shift'] }
 *   keys      { dblclick: first word } (a range anchored at the start), then Shift+ArrowRight /
 *             Control+Shift+ArrowRight / Shift+ArrowLeft until the end matches (phrase, field)
 *   pane      first { wheel: [{ pane: 'y' }, dy] } or { drag: [{ thumb: 'y' }, { thumbAt: s }] } until the
 *             target is visible
 *   triple    { tripleclick: { char: middle of the paragraph } } (paragraph; widgets that declare traits.triple:
 *             the browser's triple click selects the paragraph / cell / message / textarea line); falls back to
 *             a drag when a selection already covers that point.
 *
 * Opt-in shapes (widgets that declare the trait; the other widgets and the design-* sites see the text they always had):
 *   traits.unit 'clause'   terms of service: one clause per paragraph with a numbered title (spec.titles);
 *                          instructions name a clause by number, title or a word in it
 *   traits.unit 'message'  chat transcript: one message per paragraph, spec.chat { people, who[], at[] } gives
 *                          sender (0 = "You") and time of each; the field scenario is a chat with shared entities
 *   traits.unit 'cell'     table: one cell per paragraph in row-major order, spec.table { cols: [{ role, label }],
 *                          rows }; cells are named by row (the person) and column
 *   traits.native          a native <textarea> (spec.native 'textarea') or, for phrase / word, in 40% a one-line
 *                          <input> (spec.native 'input'): the selection is the control's selectionStart/End
 *   traits.pane 'always'   (pdf viewer) the document always sits in a scrolling pane, paragraph scenario too
 *   traits.triple          the widget makes a triple click select a paragraph (adds the 'triple' route)
 * opts.route (episode knob): 'keyboard' sets spec.keys (Shift+Arrow extension) for phrase / field / sentence
 *   targets that start at a word, 'wheel' makes pane episodes scroll by wheel (and forces a pane where the widget
 *   has one), 'pointer' drops the keyboard and wheel inputs (thumb drag scrolling). spec.inputRoute records it.
 *   Scenarios without that route ignore it.
 *
 * Start modes: off (nothing, or a stray selection elsewhere), partial (part of the target selected),
 * wrong (another span of the same kind selected), solved, scene (the reference screen: always an empty
 * selection; previews / eval only). traits.emptyStart makes 'off' start with an empty selection too
 * (spec.emptyStart). No wrong-choice endings.
 * Deviations from MiniWoB: realistic text, roles instead of quoted strings, word/field scenarios, routes.
 *
 * Optional hooks (round 2 contract; pure):
 *   facts     field: the value under its role name; tip: the key term; the words just before / after the selection in
 *             its paragraph (else the first / last selected word); [] when fewer than 2 apply or under a judge. Label
 *             paraphrases go in labels (aliases are other spellings of the value).
 *   parts     preempt=cancel: the one "Selection" (value: its range).
 *   silent    the selection lost its last or first word (multi-word spans) or did not stick (the previous one is back).
 *   retarget  another span of the same kind in the same text (paragraph / sentence by number, phrase, word, a decoy
 *             tip's word, another column of the same table row); null for field in messages (no other entity offsets
 *             are kept); a Shift+click / keys route falls back to drag when the new span does not fit it.
 *   judgeModes ['impossible']: spec.judge.ask is a phantom ask in the scenario's own wording (a word, phrase, underlined
 *             word or table row the page lacks, a role the message has no entity for), drawn from the product / dish
 *             banks (about 700 words) and the people bank; spec.judge.what names it for the reply (status impossible); the
 *             start is an empty selection, error 0 until anything is selected. No 'ambiguous' (every target is unique by construction)
 *             and no 'confirm' (selecting text is never irreversible).
 *
 * Files (files: [...], loaded in order after this one; each attaches its functions to lib, which logic.js calls at call time):
 *   text.js      document text sources (story, real sentences, message / terms / chat / table / line), sentence and word
 *                boundaries, the entity ROLES, inline marks
 *   spec.js      sampleSpec (text, target and ask per scenario), otherSpan (the wrong / off start selections)
 *   instruct.js  instruction wording and instructionOf
 *   hooks.js     judge=impossible, facts, parts, silent, retarget, errorOf
 * Self-test: selftest.js (the kit's self-test harness; the checker and node tests load it, episodes do not).
 * Helpers (widget API, env.taskDef.helpers): none; widgets read the spec and model only.
 */
(function () {
  'use strict';
  const C = env.content;
  // lib: the code the task's files share. Each file attaches its functions to it at load; logic.js calls them
  // through lib at call time (files, below).
  const lib = {};
  // The kit's { tripleclick: target } plan step (kit/env.js) drives the 'triple' route.
  const TRIPLE = true;

  function iouError(model, spec) {
    const L = spec.doc.length;
    let s = Math.max(0, Math.min(L, Math.round(model.start || 0)));
    let e = Math.max(0, Math.min(L, Math.round(model.end || 0)));
    if (e < s) [s, e] = [e, s];
    [s, e] = lib.trimRange(spec.doc, s, e);
    const { start: ts, end: te } = spec.target;
    const inter = Math.max(0, Math.min(e, te) - Math.max(s, ts));
    const union = (e - s) + (te - ts) - inter;
    return union > 0 ? 1 - inter / union : 1;
  }

  // ---------------------------------------------------------------- plan

  function scrollStep(model, spec) {
    const p = model.pane;
    if (!p || p.y0 === undefined) return null;
    if (p.y0 >= p.scroll + 2 && p.y1 <= p.scroll + p.view - 2) return null;
    const mid = (p.y0 + p.y1) / 2;
    const s = Math.round(Math.max(0, Math.min(p.max, mid - p.view / 2)));
    if (Math.abs(s - p.scroll) < 2) return null;
    if (spec.scroll === 'thumb') return { drag: [{ thumb: 'y' }, { thumbAt: s }] };
    return { wheel: [{ pane: 'y' }, s - p.scroll] };
  }

  function planOf(model, spec) {
    if (spec.judge) return null; // the kit's oracle reports spec.judge.message
    const { start, end } = spec.target;
    const sc = scrollStep(model, spec);
    if (sc) return sc;
    const caret = { char: start, edge: 'before' };
    if (spec.scenario === 'tip' && !model.tipSeen) return { move: { char: spec.ask.anchorAt, edge: 'before' } };
    if (spec.route === 'dblclick') return { dblclick: { char: Math.floor((start + end - 1) / 2), edge: 'before' } };
    if (spec.route === 'triple') {
      // A triple click inside the paragraph; if a selection already covers that point (a partial start, or a
      // triple click that did not land exactly) fall back to dragging.
      const mid = Math.floor((start + end - 1) / 2);
      if (!(model.end > model.start && model.start <= mid && mid < model.end)) return { tripleclick: { char: mid, edge: 'before' } };
    }
    // Shift+click and Shift+arrows extend a range selection, not a bare caret (Chromium, non-editable text):
    // both routes first double-click the target's first word, which anchors a range at its start.
    const anchored = model.start === start && model.end > start;
    const firstWord = () => {
      const w = lib.wordTokens(spec.doc).find((k) => k.start === start);
      return { dblclick: { char: w ? Math.floor((w.start + w.end - 1) / 2) : start, edge: 'before' } };
    };
    if (spec.route === 'shift') {
      if (!anchored) return firstWord();
      return { click: { char: end - 1, edge: 'after' }, modifiers: ['Shift'] };
    }
    if (spec.route === 'keys') {
      if (!anchored) return firstWord();
      if (model.end < end) return { key: end - model.end > 6 ? 'Control+Shift+ArrowRight' : 'Shift+ArrowRight' };
      return { key: 'Shift+ArrowLeft' };
    }
    return { drag: [caret, { char: end - 1, edge: 'after' }] };
  }

  // The start selection by start mode (off / partial / wrong / solved / scene).
  function initBase(spec, rng) {
    const mode = spec.startMode;
    const { start, end } = spec.target;
    if (mode === 'partial') {
      // A word-aligned part of the target: its first or last 40-70%.
      const cut = start + Math.max(1, Math.round((end - start) * rng.float(0.4, 0.7)));
      const toks = lib.wordTokens(spec.doc).filter((k) => k.start > start && k.start < end);
      const b = toks.length ? toks.reduce((best, k) => (Math.abs(k.start - cut) < Math.abs(best - cut) ? k.start : best), toks[0].start) : cut;
      const [s, e] = rng.bool(0.6) ? lib.trimRange(spec.doc, start, b) : lib.trimRange(spec.doc, b, end);
      if (e > s && (s !== start || e !== end)) return { start: s, end: e };
      return { start, end: Math.max(start + 1, end - Math.max(1, Math.floor((end - start) / 2))) };
    }
    if (mode === 'wrong') {
      const [s, e] = lib.otherSpan(rng, spec);
      return { start: s, end: e };
    }
    if (mode === 'scene') return { start: 0, end: 0 };
    if (rng.bool(0.7) || spec.emptyStart) return { start: 0, end: 0 };
    const [s, e] = lib.otherSpan(rng, spec);
    return { start: s, end: e };
  }

  Object.assign(lib, { iouError, planOf });

  // ---------------------------------------------------------------- task

  env.task({
    name: 'select-text',
    scenarios: ['paragraph', 'sentence', 'phrase', 'word', 'field', 'tip'],
    startModes: ['off', 'partial', 'wrong', 'solved', 'scene'],
    inputs: (spec) => {
      const k = ['pointer'];
      if (spec && spec.keys) k.push('keyboard');
      if (spec && spec.pane && spec.inputRoute !== 'pointer') k.push('wheel');
      return k;
    },
    judgeModes: ['impossible'],
    files: ['text.js', 'spec.js', 'instruct.js', 'hooks.js'],
    lib,
    facts: (model, spec) => lib.factsOf(model, spec),
    parts: (model, spec) => lib.partsOf(model, spec),
    silent: (next, prev, spec, rng) => lib.silentOf(next, prev, spec, rng),
    retarget: (spec, model, rng) => lib.retargetOf(spec, model, rng),

    sample(rng, opts) {
      const scenario = opts.scenario || rng.pick(opts.scenarios && opts.scenarios.length ? opts.scenarios : this.scenarios);
      const traits = opts.traits || {};
      const forced = opts.route; // 'keyboard' | 'wheel' | 'pointer' | undefined (the task's own mix)
      const o = { csplit: opts.csplit || 'train', ood: !!opts.ood };
      const lv = opts.level === 'easy' || opts.level === 'medium' ? opts.level : null;
      o.level = lv;
      // Opt-in shapes (declared by base widgets only): their draws come from their own forks.
      o.unit = traits.unit || null;
      o.native = traits.native ? ((scenario === 'phrase' || scenario === 'word') && rng.fork('native').bool(0.4) ? 'input' : 'textarea') : null;
      const always = traits.pane === 'always'; // a viewer whose document always scrolls (the pdf widget)
      const paneOk = !!traits.pane && !o.native && scenario !== 'tip' && (scenario !== 'paragraph' || o.unit === 'message' || always);
      o.pane = paneOk && (rng.bool(0.35) || always);
      if (forced === 'wheel' && paneOk) o.pane = true;
      o.marks = !!traits.marks && !o.native && rng.bool(0.5);
      if (lv) { o.pane = o.pane && always; o.marks = false; } // easy / medium: no scrolling pane (except the pdf viewer), no marks
      const { t, target, ask, marks } = lib.sampleSpec(rng.fork('text'), scenario, o);
      const spec = { scenario, isplit: opts.isplit || 'train', csplit: o.csplit, ood: o.ood, startMode: opts.startMode,
        paragraphs: t.paragraphs, doc: t.doc, sentences: t.spans.map((s) => [s.start, s.end]), target,
        text: t.doc.slice(target.start, target.end), ask, source: t.source, pane: o.pane,
        marks: marks || (o.marks ? lib.sampleMarks(rng.fork('marks'), t, rng.int(2, 4)) : []) };
      if (o.native) spec.native = o.native;
      if (lv) spec.level = lv;
      if (traits.emptyStart) spec.emptyStart = true;
      if (o.unit) {
        spec.unit = o.unit;
        const ar = rng.fork('unit');
        if (o.unit === 'clause') {
          spec.titles = t.titles;
          if (scenario === 'paragraph' && ask.kind === 'index' && ar.bool(0.5)) spec.ask = { kind: 'title', p: ask.p };
        } else if (o.unit === 'message') {
          spec.chat = lib.chatMeta(ar, t.paragraphs.length, o.csplit);
          if (scenario === 'paragraph' && spec.chat.who[ask.p] !== 0 && ar.bool(0.5)) spec.ask = { kind: 'from', p: ask.p };
        } else if (o.unit === 'cell') spec.table = t.table;
      }
      // A press on a link starts a link drag, not a selection: no link may cover the target's first character
      // (nor, for single words, any of it).
      spec.marks = spec.marks.filter((m) => m.kind !== 'link' || !(m.start <= target.start && target.start < m.end)
        && !(scenario === 'word' && m.start < target.end && target.start < m.end));
      // Routes: drag always works; double click for words; Shift+click and keyboard need a start > 0.
      const r = rng.fork('route');
      const routes = [['drag', 3]];
      if (scenario === 'word' || scenario === 'tip') routes.push(['dblclick', 4]);
      // Shift+click and keyboard extension start from a double-clicked first word: the target must begin at
      // a word start (and span more than that word).
      const first = lib.wordTokens(spec.doc).find((k) => k.start === target.start);
      const wordStart = !!first && first.end < target.end && /[\s("“]/.test(spec.doc[target.start - 1] || ' ');
      // A Shift+click after a double click extends by whole words: the target must also end at a word end
      // followed by whitespace.
      // A Shift+click on a link opens it instead of extending the selection: the end must not be in a link.
      const inLink = (i) => spec.marks.some((m) => m.kind === 'link' && m.start <= i && i < m.end);
      if (wordStart && !inLink(target.end - 1) && /\s/.test(spec.doc[target.end] || ' ')) routes.push(['shift', scenario === 'paragraph' || scenario === 'sentence' ? 2 : 1.5]);
      // Triple click selects a whole paragraph (a cell, a message, a textarea line): widgets that declare
      // traits.triple (the kit's { tripleclick } step).
      if (traits.triple && scenario === 'paragraph' && TRIPLE) routes.push(['triple', 3]);
      // Keyboard extension: phrases and fields (and sentences when the keyboard route is forced).
      const keysOk = wordStart && (scenario === 'phrase' || scenario === 'field' || (forced === 'keyboard' && scenario === 'sentence'));
      spec.keys = keysOk && (forced === 'keyboard' ? true : forced === 'pointer' ? false : r.bool(0.35));
      if (spec.keys) routes.push(['keys', 3]);
      spec.route = forced === 'keyboard' && spec.keys ? 'keys' : C.weighted(r, routes);
      spec.scroll = forced === 'wheel' ? 'wheel' : forced === 'pointer' ? 'thumb' : r.bool(0.5) ? 'wheel' : 'thumb';
      if (forced) spec.inputRoute = forced;
      if (this.judgeModes.includes(opts.judge)) {
        const j = lib.judgeOf(rng.fork('judge'), spec, t);
        if (j) spec.judge = j;
      }
      return spec;
    },

    init(spec, rng) {
      const m = spec.judge ? { start: 0, end: 0 } : initBase(spec, rng); // impossible: nothing selected
      return spec.scenario === 'tip' ? { ...m, tipSeen: false } : m;
    },

    error: (model, spec) => lib.errorOf(model, spec),

    tolerance(spec) {
      // levels: a looser overlap on easy / medium
      const tau = spec && spec.level === 'easy' ? 0.12 : spec && spec.level === 'medium' ? 0.06 : 0.02;
      return { tau, sigma: 0.1, minInitialError: 0.25 };
    },

    instruction: (spec, rng) => lib.instructionOf(spec, rng),
    plan: planOf,

    solve(spec, model) {
      return { ...(model || {}), start: spec.target.start, end: spec.target.end };
    },
  });
})();
