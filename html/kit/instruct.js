/*
 * kit/instruct.js: instruction helpers shared by all tasks (env.instruct). Pure string functions of an
 * rng; no DOM. Tasks build one core sentence (imperative, as today) and let these helpers vary how it is
 * said, so the policy never keys on one template, one register or a verbatim label.
 *
 * Template split (eval perturbation "unseen phrasings"): templates initially map to heldout when
 * hash(template key) % 5 === 0 (about 20%), with nonempty partitions for lists of 2+ distinct keys (see below).
 * opts.isplit (the randomization parameter, passed to sample() and therefore
 * available in instruction() as spec.isplit when the task copies it) selects 'train' (default),
 * 'heldout' or 'all'. Tasks should copy opts.isplit into the spec in sample().
 *
 * env.instruct.pick(rng, templates, isplit) -> template
 *   Pick from a list of templates (strings, or { id, text } objects) restricted to the split. If no template
 *   hashes to heldout, reserve the lowest-hash one for heldout; if all do, reserve the highest-hash one for
 *   train. A list with only one distinct template key is shared because no disjoint partition is possible.
 * env.instruct.fill(template, vars) -> string
 *   Replace {name} slots with vars[name] (functions are called with no arguments).
 * env.instruct.phrase(rng, templates, vars, isplit) -> string        pick + fill
 * env.instruct.say(rng, core, opts) -> string
 *   Wrap a core sentence in a register. opts: isplit, terse (a terse form of the goal, e.g. "speed 3.3"),
 *   steps (list of step sentences for the step-list register), registers (weights object, default
 *   { imperative: .45, polite: .2, chat: .12, ticket: .1, terse: .08, steps: .05 }; registers without
 *   their input are skipped), noise (probability of an irrelevant context sentence, default .1),
 *   typo (probability of one typo outside quotes and numbers, default .05). A core that does not start with a
 *   verb ("In the X field, pick ...", "When the button loads, press it") gets only the polite templates where it
 *   follows a colon or comma, never "Please the ..." or "Could you when ...?".
 *   Mis-ordered step lists: with 2+ steps, a share of episodes (opts.misorder, default .04, drawn from
 *   rng.fork('misorder') so other episodes keep their text) lists the steps out of order with explicit
 *   connectives ("Set B, but before that set A.", "Before you set B, set A."). The order the task requires
 *   is still steps[0], steps[1], ...; only the wording is shuffled.
 * env.instruct.tol(rng, phrase, p = 0.5) -> phrase | ''
 *   Keep a tolerance phrase ("(±0.1)", "IoU ≥ 0.85") only with probability p. Scoring is unchanged.
 * env.instruct.alias(rng, label, aliases, p = 0.35) -> string
 *   The page label, or (with probability p) one of its aliases or a casing scenario (lower case; upper case for
 *   labels up to 16 characters), so instructions do not always quote the label verbatim. Graders must accept the
 *   referent, not the string.
 * env.instruct.typo(rng, text) -> text with one typo in a plain word (never in quotes, numbers or names)
 * env.instruct.messy(rng, text, mode, isplit) -> text
 *   The same goal said the way people actually type it (randomization parameter messy, applied by the kit to every
 *   task's finished instruction; tasks do not call it). Modes: off (unchanged), terse (no politeness or
 *   articles, chat abbreviations, lower case, no final period: "move bobs thing to fri"), typo (2-3 typos),
 *   chatter (irrelevant chatter before and/or after the goal), mixed (two of the above). Quoted text and
 *   numbers are never changed; terse lower-cases plain words (labels stay matchable ignoring case) but keeps
 *   acronyms and mixed-case names. Chatter templates are
 *   split by hash like the others (isplit).
 * env.instruct.lcFirst(s) / ucFirst(s)
 *
 * Rule for every task: never name the end control in the goal ("then press Submit"): sites vary its
 * label and position and some episodes have none (finish mode). Say "then finish", "when done", or nothing.
 */
(function () {
  'use strict';

  const { hash32 } = env.util;

  const keyOf = (t) => (typeof t === 'string' ? t : t && (t.id || t.text)) || JSON.stringify(t);
  const textOf = (t) => (typeof t === 'string' ? t : t.text);
  const isHeldout = (t) => hash32(keyOf(t)) % 5 === 0;

  // Keep both partitions nonempty for lists of 2+ distinct keys, without extra RNG draws. Reserve one key for
  // train in the all-heldout case instead of returning heldout text from both splits.
  function split(list, isplit) {
    if (isplit === 'all' || list.length < 2) return list;
    if (new Set(list.map(keyOf)).size < 2) return list;
    // Key tie-breaks make the exceptional allocations independent of list order even on a hash collision.
    const rank = (a, b) => hash32(keyOf(a)) - hash32(keyOf(b)) || (keyOf(a) < keyOf(b) ? -1 : keyOf(a) > keyOf(b) ? 1 : 0);
    let held = list.filter(isHeldout);
    if (!held.length) {
      const key = keyOf(list.reduce((a, t) => (rank(t, a) < 0 ? t : a)));
      held = list.filter((t) => keyOf(t) === key);
    } else if (held.length === list.length) {
      const key = keyOf(list.reduce((a, t) => (rank(t, a) > 0 ? t : a)));
      held = held.filter((t) => keyOf(t) !== key);
    }
    return isplit === 'heldout' ? held : list.filter((t) => !held.includes(t));
  }

  // Quoted spans (labels the agent must match): "..." and “...”, and '...' / ‘...’ that are not apostrophes
  // (a quote mark between two letters, as in don't or Bob’s, is an apostrophe even inside a quoted span).
  const QUOTED = /("[^"]*"|“[^”]*”|‘(?:[^’]|(?<=\w)’(?=\w))*’|(?<!\w)'(?:[^']|(?<=\w)'(?=\w))*'(?!\w))/;

  const lcFirst = (s) => {
    if (!s) return s;
    const first = s.split(/\s/)[0];
    // Keep acronyms, quoted starts ("IoU", “Speed”) and the pronoun I (I, I'm, I’d) as they are.
    if (/^[A-Z]{2,}/.test(first) || /^["“'‘(]/.test(first) || /^I(?:$|['’]|[,:;.!?])/.test(first)) return s;
    return s[0].toLowerCase() + s.slice(1);
  };
  const ucFirst = env.util.cap;
  const stripEnd = (s) => s.replace(/[.!?]+\s*$/, '');

  function fill(template, vars = {}) {
    return textOf(template).replace(/\{(\w+)\}/g, (m, k) => {
      if (!(k in vars)) return m;
      const v = vars[k];
      return String(typeof v === 'function' ? v() : v);
    });
  }

  const pick = (rng, templates, isplit) => rng.pick(split(templates, isplit));

  const REGISTERS = {
    polite: ['Please {lc}', 'Could you {bare}?', 'Can you {bare}, please?', "I'd like you to {bare}.",
      'Would you mind taking care of this: {lc}', 'When you get a chance, {bare}.', 'Kindly {lc}'],
    chat: ['Hey, {lc}', 'Quick one: {lc}', '{core} Thanks!', 'hi! {lc}', 'ok so {bare}.', '{core} Cheers.',
      'Need a hand: {lc}'],
    ticket: ['Task: {core}', 'Ticket #{n}: {core}', 'Request from {who}: {core}', 'TODO - {core}',
      'Action item: {core}', 'Assigned to you: {core}'],
    steps: ['{list}', 'Steps: {list}', 'Do this in order. {list}'],
  };
  const CONTEXT = [
    'We are tidying up this page before the release.', 'This is part of the weekly cleanup.',
    'A customer reported this earlier today.', 'Following up on the earlier request.',
    'Small change, should only take a moment.', 'This came up in the team meeting.',
    'Just double-checking the setup here.', 'Someone asked for this on chat.',
  ];
  // A core that does not start with a verb ("In the Nation field, pick ...", "The brand color is ...", "When the
  // button loads, press it", "You only have a few seconds: ...") cannot follow "Please" / "Could you" / "Kindly".
  // The polite register then keeps the templates where the core follows a colon or comma.
  const NOT_VERB = new Set(('a an the this that these those your my our their each every all both some any no ' +
    'i you we they it he she someone something there here ' +
    'in on at for from through among with without by to into onto under over after before during within across ' +
    'between near behind beside along around about per via ' +
    'when whenever while once if as where what which who whom whose how why since until unless though although ' +
    'please now then also just').split(' '));
  const verbFirst = (core) => {
    const w = (core.match(/^[A-Za-z’'-]+/) || [''])[0];
    if (!w) return false;
    const lw = w.toLowerCase();
    if (NOT_VERB.has(lw)) return false;
    if (lw === 'only' && /^only\s+\d/i.test(core)) return false; // "Only 2 posts should be liked."
    if (/^[a-z]{3,}ing$/.test(lw) && lw !== 'bring') return false; // "Walking from A to B, ..."
    return true;
  };
  const AFTER_PUNCT = /[:,] \{(?:lc|bare)\}/;
  const WHO = ['Dana', 'the support team', 'Priya', 'Marcus', 'the product owner', 'Lena', 'ops', 'Tomás'];

  function typo(rng, text) {
    // Candidate words: plain lowercase words of 5+ letters outside quotes.
    const parts = text.split(QUOTED);
    const cands = [];
    parts.forEach((p, i) => {
      if (i % 2) return;
      const re = /\b[a-z]{5,}\b/g;
      let m;
      while ((m = re.exec(p))) cands.push([i, m.index, m[0]]);
    });
    if (!cands.length) return text;
    const [pi, at, w] = rng.pick(cands);
    const k = rng.int(1, w.length - 2);
    const kinds = [
      () => w.slice(0, k) + w[k + 1] + w[k] + w.slice(k + 2), // swap
      () => w.slice(0, k) + w.slice(k + 1),                    // drop
      () => w.slice(0, k) + w[k] + w.slice(k),                 // double
    ];
    const bad = rng.pick(kinds)();
    parts[pi] = parts[pi].slice(0, at) + bad + parts[pi].slice(at + w.length);
    return parts.join('');
  }

  // Mis-ordered step lists (explicit connectives; {last} is the final required step, {before} the others in
  // order). Templates are split by hash like the others.
  const MISORDER = [
    '{Rev}.',
    'Before you {last}, {before}.',
    '{Last}, but only after you {before}.',
    '{Last} as the last step; first {before}.',
  ];

  function misordered(rng, steps, isplit) {
    const s = steps.map((x) => stripEnd(lcFirst(x)));
    const last = s[s.length - 1];
    const vars = {
      last,
      Last: ucFirst(last),
      before: s.slice(0, -1).join(', then '),
      Rev: ucFirst(last) + s.slice(0, -1).reverse().map((x, i) => `${i ? ', and before that' : ', but before that'} ${x}`).join(''),
    };
    return fill(pick(rng, MISORDER, isplit), vars);
  }

  function say(rng, core, opts = {}) {
    const weights = { imperative: 0.45, polite: 0.2, chat: 0.12, ticket: 0.1, terse: 0.08, steps: 0.05, ...(opts.registers || {}) };
    if (!opts.terse) delete weights.terse;
    if (!opts.steps || opts.steps.length < 2) delete weights.steps;
    const entries = Object.entries(weights).filter(([, w]) => w > 0);
    const total = entries.reduce((a, [, w]) => a + w, 0);
    let x = rng.next() * total;
    let reg = 'imperative';
    for (const [k, w] of entries) if ((x -= w) < 0) { reg = k; break; }

    let out;
    const vars = { core, lc: lcFirst(core), bare: stripEnd(lcFirst(core)), n: rng.int(1000, 9999), who: rng.pick(WHO) };
    if (opts.steps && opts.steps.length >= 2 && rng.fork('misorder').bool(opts.misorder ?? 0.04)) {
      out = misordered(rng.fork('misorder/text'), opts.steps, opts.isplit);
    } else if (reg === 'imperative') out = core;
    else if (reg === 'terse') out = opts.terse;
    else if (reg === 'steps') {
      const style = rng.int(0, 2);
      vars.list = style === 0
        ? opts.steps.map((s, i) => `${i + 1}. ${ucFirst(stripEnd(s))}.`).join(' ')
        : style === 1
          ? `First ${stripEnd(lcFirst(opts.steps[0]))}, then ${opts.steps.slice(1).map((s) => stripEnd(lcFirst(s))).join(', then ')}.`
          : opts.steps.map((s) => `- ${ucFirst(stripEnd(s))}`).join(' ');
      out = fill(pick(rng, REGISTERS.steps, opts.isplit), vars);
    } else if (reg === 'polite' && !verbFirst(core)) {
      // One draw either way, so the rest of the episode's text keeps its stream.
      const fits = split(REGISTERS.polite, opts.isplit).filter((t) => AFTER_PUNCT.test(textOf(t)));
      out = fill(rng.pick(fits.length ? fits : ['{core}']), vars);
    } else out = fill(pick(rng, REGISTERS[reg], opts.isplit), vars);

    if (rng.bool(opts.noise ?? 0.1)) out = `${pick(rng, CONTEXT, opts.isplit)} ${out}`;
    if (rng.bool(opts.typo ?? 0.05)) out = typo(rng, out);
    return out;
  }

  function tol(rng, phrase, p = 0.5) {
    return rng.bool(p) ? phrase : '';
  }

  function alias(rng, label, aliases = [], p = 0.35) {
    if (!rng.bool(p)) return label;
    // Casing scenarios: lower case, and upper case for short labels ("SAVE", not a whole subject line in capitals).
    const opts = [...new Set([...aliases, label.toLowerCase(), label.length <= 16 ? label.toUpperCase() : null].filter(Boolean))];
    return rng.pick(opts.length ? opts : [label]);
  }

  // ---------------------------------------------------------------- messy instructions (knob messy)

  const CHATTER_BEFORE = [
    'ugh, long day.', 'ok so', 'sorry, on my phone.', 'quick favour -', 'hey, you around?', 'so, um,',
    'not urgent but', 'before I forget:', 'my manager wants this:', 'random thing,', 'lol ok.',
    'hi again!', 'coffee first, then this:', 'trying to wrap up here.', 'one more,', 'heads up -',
  ];
  const CHATTER_AFTER = [
    'thx', 'ty!!', 'no rush', 'lmk if weird', 'cheers', "(I'd do it but I'm in a meeting)",
    'then lunch', 'appreciate it', 'should be quick', 'k thanks', 'that\'s all I think', 'ping me after',
    'sorry for the mess', 'hope that makes sense',
  ];
  // Plain-word abbreviations for terse text (whole words, outside quotes, case kept for the first letter).
  const ABBREV = { please: '', kindly: '', you: 'u', your: 'ur', with: 'w/', without: 'w/o', and: '&',
    between: 'btwn', message: 'msg', because: 'bc', something: 'smth', the: '', a: '', an: '',
    just: '', really: '', thanks: 'thx', okay: 'ok', tomorrow: 'tmrw', minutes: 'mins', seconds: 'secs' };

  // Apply fn to the plain parts of text: outside quotes, keeping numbers and capitalised words as they are.
  function plain(text, fn) {
    return text.split(QUOTED).map((p, i) => (i % 2 ? p : fn(p, i))).join('');
  }

  function terse(text) {
    // Words inside a plain part only (an apostrophe joins: don't, Bob's). Capitalised words are abbreviated only
    // at the start of a sentence, so labels like "Plan A" or "The Hub" keep every word.
    let out = plain(text, (p, i) => p.replace(/(?<![\w'’])([A-Za-z]+(?:['’][A-Za-z]+)*)(?![\w'’])/g, (w, _, at) => {
      const lw = w.toLowerCase();
      const before = p.slice(0, at);
      const starts = (i === 0 && !before.trim()) || /[.!?:;]\s+$/.test(before);
      if (lw in ABBREV && (w === lw || (starts && w === lw[0].toUpperCase() + lw.slice(1)))) return ABBREV[lw];
      // Names and labels (inner capitals or an all-caps acronym) keep their case; plain words go lower case.
      if (/^[A-Z][a-z]+$/.test(w) || /^[a-z]+$/.test(w)) return lw;
      return w;
    }));
    out = out.replace(/\s{2,}/g, ' ').replace(/\s+([,.;:!?])/g, '$1').replace(/^[\s,]+/, '').trim();
    return out.replace(/[.!]+$/, '').replace(/,\s*$/, '');
  }

  function messy(rng, text, mode, isplit) {
    if (!text || !mode || mode === 'off') return text;
    const one = (m, r, t) => {
      if (m === 'terse') return terse(t);
      if (m === 'typo') {
        let out = t;
        for (let i = r.int(2, 3); i > 0; i--) out = typo(r, out);
        return out;
      }
      if (m === 'chatter') {
        const where = r.int(0, 2); // 0 before, 1 after, 2 both
        const before = where !== 1 ? `${pick(r, CHATTER_BEFORE, isplit)} ` : '';
        const after = where !== 0 ? ` ${pick(r, CHATTER_AFTER, isplit)}` : '';
        return `${before}${t}${after}`;
      }
      return t;
    };
    if (mode === 'mixed') {
      const [a, b] = rng.sample(['terse', 'typo', 'chatter'], 2);
      // chatter last, so terse never rewrites the chatter.
      const order = a === 'chatter' ? [b, a] : [a, b];
      return order.reduce((t, m, i) => one(m, rng.fork(`messy/${i}`), t), text);
    }
    return one(mode, rng, text);
  }

  env.instruct = { pick, fill, phrase: (rng, ts, vars, isplit) => fill(pick(rng, ts, isplit), vars), say, tol,
    alias, typo, lcFirst, ucFirst, messy };
})();
