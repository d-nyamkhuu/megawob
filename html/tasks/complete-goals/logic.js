/*
 * complete-goals: reach 2-3 goals on one page that combines widgets from other tasks.
 * One page with 2-3 widgets from other tasks and one instruction with 2-3 goals (a booking
 * form = text fields + a picker + a date; search filters = a slider + checkboxes; ...). The logic of each
 * part is the embedded task's own (sample / init / error / tolerance / instruction / plan / solve), used
 * only through that public contract; the base widget lays the embedded widgets out as cards. Teaches
 * long horizons and selective attention (the instruction order differs from the page order in half the
 * episodes). No MiniWoB counterpart.
 *
 * uses: type-text, choose-option, set-date, slider, color (the kit loads their logic; the widget loads their
 * base widgets). One part per task (embedded widgets keep module-level state, so a task appears once).
 *
 * scenarios (part pool; train: 2-3 parts, ood: all 3 with the parts' own out-of-range sampling)
 *   booking     type-text (multi | single) + choose-option (dropdown | radio | autocomplete)
 *               + set-date (calendar | typed | time | range)
 *   filters     slider (horizontal | range) + choose-option (checkbox | radio | dropdown | listbox)
 *               + type-text (single: a search box)
 *   profile     type-text (multi | single) + choose-option (radio | autocomplete | dropdown) + color (swatch | hex)
 *   appearance  color (swatch | hex) + slider (horizontal | multi) + choose-option (radio | dropdown)
 *   Sub-scenarios are intersected with what the embedded widget supports (widget traits.parts, see the widget).
 *   Held-out scenarios (opts.compose 'heldout'; see below), never sampled in training:
 *   planner     set-date (calendar | range) + slider (horizontal | range) + choose-option (dropdown | radio)
 *   event       type-text (multi | single) + set-date (calendar | typed | time) + color (swatch | hex)
 *
 * opts.compose (episode knob 'compose': 'train' default | 'heldout') splits the combinations the policy sees:
 *   pairings    the 10 task pairs of the five parts: the four train scenarios cover 8 of them; set-date +
 *               slider and set-date + color are never on one page in training. 'planner' (date + slider) and
 *               'event' (date + color) are the held-out scenarios and only have those pairs added (all three
 *               parts, always).
 *   step order  with 3 parts the instruction order is never the exact reverse of the page order in training
 *               (identity or another shuffle); heldout episodes of a train scenario use exactly the reverse
 *               (3 parts, always).
 *   sampling    train: only the four train scenarios (as before: same draws, same specs for a seed except that
 *               a fully reversed order of 3 parts is replaced by another one). heldout: 'planner' / 'event'
 *               (65%) or a train scenario with the reversed order (35%). An explicit opts.scenario always wins
 *               (the checker forces every scenario), the split is then recorded only in spec.compose.
 *   spec.compose ('train' | 'heldout' as requested), spec.heldKind (null | 'pairing' | 'order': what makes
 *               the episode held out, also for an explicit scenario).
 *
 * spec   { scenario, title, parts: [{ task, widget, scenario, start, spec, tau, norm, label }], order: [i]
 *          (instruction order of the parts), startMode, isplit, csplit, ood, compose, heldKind }
 *          parts are in page order; part.spec is the embedded task's spec (sampled with opts.scenario,
 *          isplit, csplit, ood, recover, startMode passed through); norm = that part's error from an
 *          'off' start minus its tau (the scale its error is normalized by).
 * model  { parts: [sub-model], note }   each embedded widget edits its own sub-model through a wrapped ctx.update;
 *          note (unscored, mirrored by the widget) = the site's instruction toast is open over the page
 * error  mean over parts of min(2, max(0, e_i - tau_i) / norm_i): 0 iff every part is within its own
 *        tolerance. tau 0, sigma 0.3.
 * start modes: off (every part off), partial (the first 1..n-1 parts solved, the rest in their own
 *        'partial' mode where supported), wrong (one part in its own 'wrong' mode where supported, others
 *        solved or off), solved (all parts solved).
 * instruction: the parts' own instructions (each passes through env.instruct in its task), with trailing
 *        "then finish"-style endings removed, joined by held-out-split templates (lists, "first ... then
 *        ... finally", ticket wrappers) in the instruction order.
 * plan   the first part (page order) whose error exceeds its tau: that task's plan step with every
 *        target wrapped as { part: i, t: target } (drag/path/click/dblclick/rightclick/move/down/up/type/
 *        wheel); key and wait steps pass through.
 *        While model.note is set the plan first closes the site's instruction toast ({ click: { note:
 *        'close' } }): on a scrolling page it covers the bottom of the viewport, which the kit's scrolling
 *        does not account for (kit request: treat points under fixed site frame as off-screen).
 * levels opts.level reaches every part's sample() (each part eases its own goal). easy: 2 parts (unless ood or
 *        held out), the instruction in page order, page order as listed; medium: 2-3 parts as normal.
 * inputs union of the parts' inputs (each may be a function of the part's spec).
 * tick / ended  delegated to the parts that define them.
 *
 * Round 2 hooks (optional, pure; see the html/kit/env.js header). Each one delegates to the parts' own hooks, so a hook
 * works for a part only once its task defines it (a part without it contributes nothing / is skipped):
 *   facts(model, spec)       the parts' facts, up to 4 (one per part first, then the rest); a label two parts share is
 *                            prefixed with the card's title ("Profile color - Selected color").
 *   parts(model, spec)       preempt=cancel: the embedded tasks' parts (those that define parts()); a name two cards
 *                            share is prefixed with the card's title and keeps the bare name as an alias.
 *   silent(next, prev, spec, rng)   the first changed part (random order) whose task has silent() and returns a corrupted
 *                            sub-model; the composite error stays > 0 because the part's error exceeds its own tau. null when
 *                            no changed part has one.
 *   retarget(spec, model, rng)   the first part (random order) whose task has retarget() and returns a new goal: that part's
 *                            spec is replaced (its error scale norm recomputed from an off start); the other parts keep their
 *                            goals. null when no part can.
 *   judgeModes impossible (spec.judge = { mode, goal, message, what }; every part starts solved, nothing to change): the usual
 *                            instruction plus one more goal for something the page lacks, a widget of a task that is not on
 *                            the page (a slider, a color picker, a date, a text field, a choice), drawn from the content banks
 *                            (field labels, settings, icon names, people, dates) and never a label the page holds, so the
 *                            phantom differs nearly every seed; status impossible naming it (what: [its label]). No ambiguous mode (no natural
 *                            way for a multi-part goal to be read two ways that holds for every scenario) and no confirm (no
 *                            irreversible step on these pages).
 *
 * Helpers (widget API, env.taskDef.helpers):
 *   setActivePart(name)      record the part last rendered or touched; null clears the selection.
 * Other helper names resolve to the embedded task's helpers (e.g. slider's scale, set-date's apply).
 * The helpers object is a Proxy: the active part wins when several tasks define the same helper.
 * Kit request: pass the task definition to widgets as ctx.task so composites need no proxy.
 * Self-tests live in selftest.js (loaded only by the checker and node tests).
 */
(function () {
  'use strict';
  const I = env.instruct;

  const USES = ['type-text', 'choose-option', 'set-date', 'set-slider', 'pick-color'];
  const WIDGET = { 'type-text': 'fields', 'choose-option': 'widgets', 'set-date': 'calendar', 'set-slider': 'classic', 'pick-color': 'picker' };

  const SCENARIOS = {
    booking: {
      titles: [
        'Book a table', 'Reservation request', 'Plan your visit', 'Appointment booking', 'Event registration',
        'Booking details', 'Guest booking', 'Reserve a place', 'Visit reservation', 'Arrange a booking',
        'Guest appointment', 'Visit scheduling', 'Service booking', 'Booking overview', 'Stay coordination',
        'Guest services'
      ],
      parts: [['type-text', ['multi', 'single']], ['choose-option', ['dropdown', 'radio', 'autocomplete']],
        ['set-date', ['calendar', 'typed', 'time', 'range']]],
      labels: { 'type-text': [
        'Your details', 'Contact', 'Guest information', 'Requests', 'Priorities', 'Set up', 'Your call', 'For you'
      ], 'choose-option': ['Options', 'Preferences', 'Choose'],
        'set-date': [
          'Date and time', 'When', 'Schedule', 'Timing', 'Availability', 'Booking', 'Your plans', 'Visit',
          'Time frame'
        ] },
    },
    filters: {
      titles: [
        'Refine results', 'Search filters', 'Filter products', 'Find a listing', 'Explore options', 'Browse results',
        'Choose criteria', 'Explore matches', 'Result options'
      ],
      parts: [['set-slider', ['horizontal', 'range']], ['choose-option', ['checkbox', 'radio', 'dropdown', 'listbox']],
        ['type-text', ['single']]],
      labels: { 'set-slider': [
        'Range', 'Adjust', 'Limits', 'Query', 'Phrase', 'Lookup', 'Match', 'Topic'
      ], 'choose-option': ['Categories', 'Refine by', 'Options'], 'type-text': ['Search', 'Keyword', 'Find'] },
    },
    profile: {
      titles: [
        'Edit profile', 'Account settings', 'Your profile', 'Personal page', 'Member details', 'Account profile',
        'Personal details', 'Member account', 'Profile setup', 'User information'
      ],
      parts: [['type-text', ['multi', 'single']], ['choose-option', ['radio', 'autocomplete', 'dropdown']], ['pick-color', ['swatch', 'hex']]],
      labels: { 'type-text': [
        'Basic info', 'About you', 'Details', 'Customize', 'Your way', 'Settings', 'Decisions', 'Controls',
        'Defaults'
      ], 'choose-option': ['Preferences', 'Location', 'Choose'],
        'pick-color': ['Profile color', 'Accent', 'Theme color', 'Color marker', 'Page tint'] },
    },
    appearance: {
      titles: [
        'Appearance', 'Display settings', 'Customize', 'Theme editor', 'Page styling', 'Visual settings',
        'Visual design', 'Screen theme', 'Style choices'
      ],
      parts: [['pick-color', ['swatch', 'hex']], ['set-slider', ['horizontal', 'multi']], ['choose-option', ['radio', 'dropdown']]],
      labels: { 'pick-color': [
        'Accent color', 'Color', 'Brand color', 'Highlight', 'Visual tone', 'Branding', 'Color design', 'Aesthetic',
        'Surface'
      ], 'set-slider': ['Sizing', 'Levels', 'Adjustments'],
        'choose-option': ['Layout', 'Style', 'Mode', 'Design', 'View', 'Setup', 'Format', 'Theme', 'Look'] },
    },
  };

  // Held-out scenarios: task pairings that no train scenario puts on one page (date + slider, date + color).
  const HELDOUT = {
    planner: {
      titles: [
        'Plan a trip', 'Trip planner', 'Plan your stay', 'Holiday builder', 'Travel plans', 'Getaway guide',
        'Stay details', 'Journey details', 'Trip essentials', 'Stay overview', 'Travel overview', 'Trip outline',
        'Travel options'
      ],
      parts: [['set-date', ['calendar', 'range']], ['set-slider', ['horizontal', 'range']], ['choose-option', ['dropdown', 'radio']]],
      labels: { 'set-date': [
        'Travel dates', 'Dates', 'When to go', 'Itinerary', 'Schedule', 'Trip plans', 'Calendar', 'Availability',
        'Time away', 'Getaway'
      ], 'set-slider': ['Budget', 'Price range', 'Spend'],
        'choose-option': [
          'Trip type', 'Travel style', 'Choose', 'Decisions', 'Preferences', 'Options', 'Travel setup', 'Wishes',
          'Selection'
        ] },
    },
    event: {
      titles: [
        'Create an event', 'New event', 'Schedule an event', 'Add to calendar', 'Event details', 'Gathering setup',
        'Event planning', 'Occasion planner', 'Meetup schedule', 'Social occasion'
      ],
      parts: [['type-text', ['multi', 'single']], ['set-date', ['calendar', 'typed', 'time']], ['pick-color', ['swatch', 'hex']]],
      labels: { 'type-text': [
        'Event details', 'Basics', 'Name and place', 'Plans', 'Timing', 'Agenda', 'Moment'
      ], 'set-date': ['Date', 'Time slot', 'When'],
        'pick-color': [
          'Event color', 'Label color', 'Tag color', 'Accent tone', 'Visual cue', 'Color code', 'Chosen hue',
          'Color theme'
        ] },
    },
  };
  const TRAIN_SCENARIOS = Object.keys(SCENARIOS);
  const isHeld = (v) => Object.prototype.hasOwnProperty.call(HELDOUT, v);
  const isReversed = (order) => order.length === 3 && order.every((x, i) => x === order.length - 1 - i);

  let active = null;
  let lastSpec = null; // the spec of the latest init(): tick exists only when one of its parts is timed

  const famOf = (name) => {
    const f = env.taskOf(name);
    if (!f) throw new Error(`composition: family '${name}' is not loaded`);
    return f;
  };
  const tolOf = (p) => famOf(p.task).tolerance(p.spec);
  const partErr = (p, m) => famOf(p.task).error(m, p.spec);
  const within = (p, m) => partErr(p, m) <= p.tau + 1e-9;

  // ---------------------------------------------------------------- plan wrapping

  function wrap(step, i) {
    const W = (t) => ({ part: i, t });
    const out = { ...step };
    if (step.drag) out.drag = step.drag.map(W);
    if (step.path) out.path = step.path.map(W);
    for (const k of ['click', 'dblclick', 'rightclick', 'move', 'down', 'up']) if (step[k] !== undefined && step[k] !== null) out[k] = W(step[k]);
    if (step.type) out.type = [W(step.type[0]), step.type[1]];
    if (step.wheel) out.wheel = [W(step.wheel[0]), ...step.wheel.slice(1)];
    return out;
  }

  // ---------------------------------------------------------------- instruction

  const ENDINGS = [
    /,?\s*(and\s+)?then\s+(finish|you(?:'re| are) done|wrap up)\b[^.!?]*([.!?]|$)/gi,
    /\s*(Then|And)\s+finish[^.!?]*([.!?]|$)/g,
    /,?\s*(and\s+)?finish\s+(up|when (?:you(?:'re| are) )?done)\b[^.!?]*([.!?]|$)/gi,
    /\s*(Finish|Submit) when (?:you(?:'re| are) )?done[.!]?/gi,
    /,?\s*when (?:you(?:'re| are) )?done\b[^.!?]*([.!?]|$)/gi,
  ];
  // Register wrappers and context sentences env.instruct may have added to a part's goal; the composite
  // adds its own register once around the joined goals.
  const PREFIX = /^(hey,|hi!|quick one:|ok so|need a hand:|task:|ticket #\d+:|request from [^:]{1,40}:|todo -|action item:|assigned to you:)\s*/i;
  const SUFFIX = /\s+(thanks!|cheers\.)$/i;
  const CONTEXT = ['We are tidying up this page before the release.', 'This is part of the weekly cleanup.',
    'A customer reported this earlier today.', 'Following up on the earlier request.',
    'Small change, should only take a moment.', 'This came up in the team meeting.',
    'Just double-checking the setup here.', 'Someone asked for this on chat.'];
  function tidy(goal) {
    let g = String(goal).trim();
    for (const c of CONTEXT) if (g.startsWith(c)) g = g.slice(c.length).trim();
    g = g.replace(PREFIX, '').replace(SUFFIX, '');
    g = I.ucFirst(g);
    for (const re of ENDINGS) g = g.replace(re, (m) => (/[.!?]$/.test(m) ? '.' : ''));
    g = g.replace(/\s+([.,;!?])/g, '$1').replace(/[,;]\s*\./g, '.').replace(/\.\.+$/, '.').trim();
    if (!/[.!?]["”’)]?$/.test(g)) g += '.';
    return g;
  }

  const T2 = [
    '{a} {b}', '{a} Also, {lb}', 'Two things on this page. First, {la} Second, {lb}', '{title}: {a} {b}',
    'Please take care of both of these. {a} {b}', '{a} After that, {lb}', '{a} Then {lb}', 'This page has two parts. {a} {b}',
    '{a} One more thing: {b}', 'Here is your pair: {a} {b}', 'Two requests follow. {a} {b}',
    '{a} {b} Both belong to {title}.', 'For one, {la} For another, {lb}', 'Please: {a} {b}',
    '{a} The other request: {b}', 'For {title}, please: {a} {b}', 'In sequence: {a} {b}',
    '{a} {b} This is a paired task.', 'To begin, {la} Afterward, {lb}', 'Both goals apply: {a} {b}',
    '{a} Follow with: {b}', 'With {title} open: {a} {b}', '{a} For {title}, also: {b}', 'We now ask for: {a} {b}',
    '{a} That comes first. {b}', 'While here, {la} Also, {lb}', 'Begin: {a} Next: {b}',
  ];
  const T3 = [
    '{a} {b} {c}', 'First, {la} Then {lb} Finally, {lc}', 'Three things: 1) {a} 2) {b} 3) {c}', '{title}: {a} {b} {c}',
    'Please do all of this on the page. {a} {b} {c}', '{a} Also, {lb} And {lc}', '{a} Next, {lb} Last, {lc}',
    'This page has three sections. {a} {b} {c}',
    '{a} {b} One more thing: {c}',
    'Three requests follow. {a} {b} {c}',
    '{a} {b} {c} Those are the three requests.',
    '{a} {b} {c} For {title}.',
    'Please: {a} {b} {c}',
    '{a} The next two: {b} {c}',
    '{a} For {title}, also: {b} {c}',
    'As a trio: {a} {b} {c}',
    '{a} First of three. {b} Last: {c}',
    'A pair: {a} {b} Plus: {c}',
    'Here, {la} Also, {lb} Lastly, {lc}',
  ];
  // Only a judge episode on a three-part page has four goals (the phantom is one more).
  const T4 = [
    '{a} {b} {c} {d}', 'First, {la} Then {lb} Next, {lc} Finally, {ld}', 'Four things: 1) {a} 2) {b} 3) {c} 4) {d}', '{title}: {a} {b} {c} {d}',
    'Please do all of this on the page. {a} {b} {c} {d}', '{a} Also, {lb} And {lc} And {ld}', '{a} Next, {lb} Then {lc} Last, {ld}',
    'Your goals below: {a} {b} {c} {d}', '{a} {b} Plus these two: {c} {d}',
    '{a} Follow that with {lb} Then {lc} And {ld}', 'For this task, {la} Also {lb} And {lc} Plus {ld}',
    'To do: {a} {b} {c} {d}', '{a} {b} {c} {d} All four, please.', 'For {title}, please do this. {a} {b} {c} {d}',
    '{a} {b} {c} The fourth goal: {d}', 'Begin here: {a} The rest: {b} {c} {d}',
    '{a} Two more: {lb} And {lc} One more: {ld}', 'Here is my list: {a} {b} {c} {d}', 'In order: {a} {b} {c} {d}',
    'Please handle: {a} {b} {c} {d}', '{a} {b} At the midpoint: {c} {d}', 'Four goals, one task: {a} {b} {c} {d}',
    'All four for {title}: {a} {b} {c} {d}',
  ];

  // ---------------------------------------------------------------- round 2: judge, facts, silent, retarget

  // The extra goal of an impossible episode: a widget of a task the page does not have (the task not among
  // spec.parts), built from the content banks (field labels, settings, icon names, dates, people) and never named on the
  // page (no part's spec or title holds the label), so the phantom is a different one in nearly every seed.
  const PHANTOM = {
    'type-text': (jr, C, ok, cs) => {
      const f = jr.pick(C.split(C.FIELD_LABELS.filter((x) => ['text', 'email', 'phone'].includes(x.kind)), cs).filter((x) => ok(x.label)));
      const crng = jr.fork('value');
      const value = f.kind === 'email' ? C.emailAddress(crng, C.personName(crng, { csplit: cs }))
        : f.kind === 'phone' ? C.phone(crng, 'en-US') : jr.bool(0.5) ? C.personName(crng, { csplit: cs }).full : C.pick(crng, C.CITIES, { csplit: cs }).city;
      return [`Fill in the "${f.label}" field with ${value}.`, `there is no "${f.label}" field on the page.`, [f.label]];
    },
    'choose-option': (jr, C, ok, cs) => {
      const f = jr.pick(C.split(C.SETTINGS.filter((x) => x.kind === 'select'), cs).filter((x) => ok(x.label)));
      const opt = jr.pick(f.options);
      return [`Choose "${opt}" for "${f.label}".`, `there is no "${f.label}" option on the page.`, [f.label]];
    },
    'set-date': (jr, C, ok, cs) => {
      const f = jr.pick(C.split(C.FIELD_LABELS.filter((x) => x.kind === 'date'), cs).filter((x) => ok(x.label)));
      const when = C.formatDate(C.randomDate(jr.fork('value')), 'en-US', 'long');
      return [`Set the "${f.label}" to ${when}.`, `there is no "${f.label}" on the page.`, [f.label]];
    },
    'set-slider': (jr, C, ok, cs) => {
      const f = jr.pick(C.split(C.SETTINGS.filter((x) => x.kind === 'number'), cs).filter((x) => ok(x.label)));
      const n = jr.int(f.min, f.max);
      return [`Set the "${f.label}" slider to ${n}${f.unit ? (/^[%°]/.test(f.unit) ? '' : ' ') + f.unit : ''}.`, `there is no "${f.label}" slider on the page.`, [f.label]];
    },
    'pick-color': (jr, C, ok, cs) => {
      const f = jr.pick(C.split(C.ICON_NAMES, cs).filter((x) => ok(x.name)));
      const color = jr.pick(Object.keys(C.COLORS).filter((c) => c !== 'gray'));
      return [`Change the ${f.name} icon color to ${color}.`, `there is no ${f.name} icon on the page.`, [`${f.name} icon`, f.name]];
    },
  };

  function judgeOf(jr, spec) {
    const absent = USES.filter((f) => !spec.parts.some((p) => p.task === f));
    const fam = jr.pick(absent.length ? absent : USES);
    const page = JSON.stringify([spec.title, spec.parts]).toLowerCase();
    const ok = (label) => !page.includes(String(label).toLowerCase());
    const [goal, why, what] = PHANTOM[fam](jr, env.content, ok, spec.csplit || 'train');
    for (const p of spec.parts) p.start = 'solved';
    return { mode: 'impossible', goal, what, message: `I can't do that: ${why}` };
  }

  function factsOf(model, spec) {
    const per = spec.parts.map((p, i) => {
      const f = famOf(p.task);
      return typeof f.facts === 'function' ? (f.facts(model.parts[i], p.spec) || []).map((x) => ({ ...x, card: p.label })) : [];
    });
    const rank = [];
    for (let k = 0; rank.length < 12 && per.some((l) => l.length > k); k++) for (const l of per) if (l[k]) rank.push(l[k]);
    const out = rank.slice(0, 4);
    const count = new Map();
    for (const x of out) count.set(x.label, (count.get(x.label) || 0) + 1);
    return out.map(({ card, ...x }) => (count.get(x.label) > 1 ? { ...x, label: `${card} - ${x.label}` } : x));
  }

  // preempt=cancel: the embedded tasks' parts; a name two cards share is prefixed with the card's title.
  function partsOf(model, spec) {
    const per = spec.parts.map((p, i) => {
      const f = famOf(p.task);
      return typeof f.parts === 'function' ? (f.parts(model.parts[i], p.spec) || []).map((x) => ({ ...x, card: p.label })) : [];
    });
    const count = new Map();
    for (const x of per.flat()) count.set(x.name, (count.get(x.name) || 0) + 1);
    return per.flat().map(({ card, ...x }) => (count.get(x.name) > 1 ? { ...x, name: `${card} - ${x.name}`, aliases: [x.name, ...(x.aliases || [])] } : x));
  }

  const changed = (a, b) => JSON.stringify(a) !== JSON.stringify(b);

  function silentOf(next, prev, spec, rng) {
    const order = rng.shuffle(spec.parts.map((_, i) => i));
    for (const i of order) {
      const p = spec.parts[i];
      const f = famOf(p.task);
      if (typeof f.silent !== 'function' || !changed(next.parts[i], prev.parts[i])) continue;
      const m = f.silent(next.parts[i], prev.parts[i], p.spec, rng.fork(`silent${i}`));
      if (m && changed(m, next.parts[i])) return { ...next, parts: next.parts.map((x, k) => (k === i ? m : x)) };
    }
    return null;
  }

  function retargetOf(spec, model, rng) {
    if (spec.judge) return null;
    const order = rng.shuffle(spec.parts.map((_, i) => i));
    for (const i of order) {
      const p = spec.parts[i];
      const f = famOf(p.task);
      if (typeof f.retarget !== 'function') continue;
      const sub = f.retarget(p.spec, model.parts[i], rng.fork(`retarget${i}`));
      if (!sub) continue;
      const tol = f.tolerance(sub);
      let e0 = 0;
      for (let k = 0; k < 8 && !(e0 > tol.tau + 1e-9); k++) e0 = f.error(f.init({ ...sub, startMode: 'off' }, rng.fork(`ref${i}/${k}`)), sub);
      const floor = tol.sigma || 2.5 * tol.tau || 1;
      const part = { ...p, spec: sub, tau: tol.tau, norm: Math.max(e0 - tol.tau, 0.25 * floor, 1e-6) };
      const out = { ...spec, parts: spec.parts.map((x, k) => (k === i ? part : x)) };
      if (def.error(model, out) > 1e-9) return out;
    }
    return null;
  }

  // ---------------------------------------------------------------- task

  const def = {
    name: 'complete-goals',
    scenarios: [...TRAIN_SCENARIOS, ...Object.keys(HELDOUT)],
    heldoutScenarios: Object.keys(HELDOUT),  // never forced by training sampling (catalog.pick); only compose=heldout draws them
    startModes: ['off', 'partial', 'wrong', 'solved'],
    judgeModes: ['impossible'],
    uses: USES,

    lib: { isHeld, isReversed, wrap, tidy },

    inputs(spec) {
      const out = new Set(['pointer']);
      for (const p of (spec && spec.parts) || []) {
        const f = famOf(p.task).inputs;
        for (const k of (typeof f === 'function' ? f(p.spec) : f) || ['pointer']) out.add(k);
      }
      return [...out];
    },

    sample(rng, opts) {
      const pool = opts.scenarios && opts.scenarios.length ? opts.scenarios : def.scenarios;
      const compose = opts.compose === 'heldout' ? 'heldout' : 'train';
      const trainPool = pool.filter((v) => !isHeld(v));
      const heldPool = pool.filter(isHeld);
      let scenario = opts.scenario;
      if (!scenario) {
        // Train: exactly the draw of a pool without the held-out scenarios. Heldout: new scenarios or reversed order.
        scenario = compose === 'heldout' && heldPool.length && (!trainPool.length || rng.fork('held').bool(0.65))
          ? rng.fork('heldv').pick(heldPool) : rng.pick(trainPool.length ? trainPool : pool);
      }
      const V = SCENARIOS[scenario] || HELDOUT[scenario];
      const traits = (opts.traits && opts.traits.parts) || {};
      const startMode = opts.startMode || 'off';
      const lvl = opts.level === 'easy' || opts.level === 'medium' ? opts.level : 'normal';
      const spec = { scenario, title: rng.pick(V.titles), startMode, isplit: opts.isplit || 'train', csplit: opts.csplit || 'train',
        ood: !!opts.ood, compose, heldKind: null, parts: [], order: [] };
      // Parts: the pool minus tasks / sub-scenarios the embedded widgets cannot show.
      let avail = V.parts.map(([task, subs]) => {
        const t = traits[task];
        const ok = t && Array.isArray(t.scenarios) ? subs.filter((v) => t.scenarios.includes(v)) : subs;
        return env.taskOf(task) && ok.length ? [task, ok] : null;
      }).filter(Boolean);
      if (avail.length < 2) throw new Error(`composition/${scenario}: fewer than 2 embeddable parts`);
      // Held-out scenarios and held-out episodes keep every part (every pairing on the page is then new or the order is).
      const full = spec.ood || isHeld(scenario) || compose === 'heldout';
      const n = full ? avail.length : rng.int(2, avail.length);
      avail = rng.sample(avail, lvl === 'easy' && !full ? 2 : n);
      const nParts = avail.length;
      // Page order: as listed in the pool, or shuffled.
      if (rng.bool(0.5) || (lvl === 'easy' && !full)) avail.sort((a, b) => V.parts.findIndex((x) => x[0] === a[0]) - V.parts.findIndex((x) => x[0] === b[0]));

      // Start mode of each part.
      const starts = avail.map(() => 'off');
      if (startMode === 'partial') {
        const k = rng.int(1, nParts - 1);
        for (let i = 0; i < nParts; i++) starts[i] = i < k ? 'solved' : 'partial';
      } else if (startMode === 'wrong') {
        const w = rng.int(0, nParts - 1);
        for (let i = 0; i < nParts; i++) starts[i] = i === w ? 'wrong' : rng.bool(0.5) ? 'solved' : 'off';
      } else if (startMode === 'solved') starts.fill('solved');

      avail.forEach(([task, subs], i) => {
        const f = famOf(task);
        const want = starts[i] === 'solved' ? 'off' : starts[i];
        const mode = f.startModes.includes(want) || want === 'off' ? want : 'off';
        const t = traits[task] || {};
        const v = rng.pick(subs);
        const r = rng.fork(`part${i}`);
        const sub = f.sample(r.fork('spec'), { ...opts, judge: undefined, scenario: v, scenarios: [v], traits: t.traits || {}, startMode: mode,
          isplit: spec.isplit, csplit: spec.csplit, ood: spec.ood, recover: opts.recover });
        if (sub.startMode === undefined) sub.startMode = mode;
        const tol = f.tolerance(sub);
        // Error scale: the part's error from an 'off' start.
        let e0 = 0;
        for (let k = 0; k < 8 && !(e0 > tol.tau + 1e-9); k++) e0 = f.error(f.init({ ...sub, startMode: 'off' }, r.fork(`ref${k}`)), sub);
        const floor = tol.sigma || 2.5 * tol.tau || 1;
        const norm = Math.max(e0 - tol.tau, 0.25 * floor, 1e-6);
        spec.parts.push({ task, widget: (t.widget || WIDGET[task]), scenario: sub.scenario || v, start: starts[i] === 'solved' ? 'solved' : mode,
          spec: sub, tau: tol.tau, norm, label: rng.pick(V.labels[task] || ['Section']) });
      });
      spec.order = spec.parts.map((_, i) => i);
      if (rng.bool(0.5)) {
        const shuffled = rng.shuffle(spec.order);
        if (!(lvl === 'easy' && !full)) spec.order = shuffled;
      }
      // Step order: the exact reverse of the page order (3 parts) is held out.
      if (compose === 'heldout' && !isHeld(scenario) && nParts === 3) spec.order = [2, 1, 0];
      else if (compose !== 'heldout' && isReversed(spec.order)) spec.order = [1, 2, 0];
      spec.heldKind = isHeld(scenario) ? 'pairing' : isReversed(spec.order) ? 'order' : null;
      if (opts.judge === 'impossible') spec.judge = judgeOf(rng.fork('judge'), spec);
      return spec;
    },

    init(spec, rng) {
      lastSpec = spec;
      const parts = spec.parts.map((p, i) => {
        const f = famOf(p.task);
        let m = f.init(p.spec, rng.fork(`p${i}`));
        for (let k = 1; k < 20 && p.start !== 'solved' && within(p, m); k++) m = f.init(p.spec, rng.fork(`p${i}#${k}`));
        if (p.start === 'solved' && !within(p, m)) m = f.solve(p.spec, m);
        return m;
      });
      return { parts, note: false };
    },

    error(model, spec) {
      let s = 0;
      spec.parts.forEach((p, i) => {
        const e = partErr(p, model.parts[i]);
        s += Math.min(2, Math.max(0, e - p.tau) / p.norm);
      });
      return s / spec.parts.length;
    },

    tolerance() {
      return { tau: 0, sigma: 0.3 };
    },

    facts: factsOf,
    parts: partsOf,
    silent: silentOf,
    retarget: retargetOf,

    instruction(spec, rng) {
      const goals = spec.order.map((i) => {
        const p = spec.parts[i];
        return tidy(famOf(p.task).instruction(p.spec, rng.fork(`goal${i}`)));
      });
      // judge impossible: one more goal, for a widget the page does not have, joined like the others
      if (spec.judge) goals.splice(rng.fork('phantom').int(0, goals.length), 0, tidy(spec.judge.goal));
      const [a, b, c, d] = goals;
      const vars = { a, b, c: c || '', d: d || '', la: I.lcFirst(a), lb: I.lcFirst(b), lc: I.lcFirst(c || ''), ld: I.lcFirst(d || ''), title: spec.title };
      const core = I.fill(I.pick(rng, goals.length >= 4 ? T4 : goals.length === 3 ? T3 : T2, spec.isplit), vars);
      return I.say(rng, core, { isplit: spec.isplit, steps: goals,
        registers: { imperative: 0.65, polite: 0, chat: 0.1, ticket: 0.15, terse: 0, steps: 0.1 }, noise: 0.05, typo: 0 });
    },

    plan(model, spec) {
      // A site instruction note pinned over the bottom of a scrolling page hides targets: close it first.
      if (model.note) return { click: { note: 'close' } };
      for (let i = 0; i < spec.parts.length; i++) {
        const p = spec.parts[i];
        const m = model.parts[i];
        if (within(p, m)) continue;
        const step = famOf(p.task).plan(m, p.spec);
        if (!step) return null;
        if (step.finish) continue;
        return wrap(step, i);
      }
      return null;
    },

    solve(spec, model) {
      return { ...model, parts: spec.parts.map((p, i) => famOf(p.task).solve(p.spec, model.parts[i])) };
    },

    ended(model, spec) {
      for (let i = 0; i < spec.parts.length; i++) {
        const f = famOf(spec.parts[i].task);
        const r = f.ended && f.ended(model.parts[i], spec.parts[i].spec);
        if (r) return `part${i}:${r}`;
      }
      return null;
    },
  };

  // Route each embedded helper by name, with the active part breaking ties.
  def.helpers = new Proxy({ setActivePart(name) { active = name; } }, {
    get(t, k) {
      if (typeof k === 'symbol' || k in t || k === 'then' || k === 'toJSON') return t[k];
      const have = USES.map((n) => env.taskOf(n)?.helpers).filter((h) => h && k in h);
      if (!have.length) return undefined;
      if (have.length > 1 && active) {
        const a = env.taskOf(active)?.helpers;
        if (a && k in a) return a[k];
      }
      return have[0][k];
    },
    has(t, k) {
      if (typeof k === 'symbol' || k in t || k === 'then' || k === 'toJSON') return k in t;
      return USES.some((n) => { const h = env.taskOf(n)?.helpers; return h && k in h; });
    },
  });

  // tick / tickMs only when an embedded task is timed.
  Object.defineProperty(def, 'tick', {
    enumerable: true,
    get() {
      const fams = lastSpec ? lastSpec.parts.map((p) => p.task) : [];
      if (!fams.some((n) => { const f = env.taskOf(n); return f && typeof f.tick === 'function'; })) return undefined;
      return (model, spec, dt, now, rng) => {
        let changed = false;
        const parts = model.parts.map((m, i) => {
          const f = famOf(spec.parts[i].task);
          if (typeof f.tick !== 'function') return m;
          const n = f.tick(m, spec.parts[i].spec, dt, now, rng);
          if (n !== m) changed = true;
          return n;
        });
        return changed ? { ...model, parts } : model;
      };
    },
  });

  env.task(def);
})();
