/* choose-option/judge.js: judge sampling and instructions. */
(function () {
  'use strict';
  const lib = env.taskOf('choose-option').lib;
  const { lc, uniq, quote, matrixAsked, I } = lib;

  const ABSENT = {
    country: [
      'Atlantis', 'Narnia', 'Wakanda', 'Freedonia', 'Cloudfen', 'Fableport'
    ], name: ['Zaphod', 'Bilbo', 'Gandalf'], city: ['Gotham', 'Metropolis', 'Springfield-on-Sea'],
    language: [
      'Klingon', 'Elvish', 'Dothraki', 'Zelmari', 'Quorvek', 'Thulven', 'Brassu', 'Odravi', 'Velzha', 'Fendroth',
      'Muvralic', 'Xalethic'
    ], color: ['Ultraviolet', 'Infrared', 'Dragon Green'], product: ['Flux Capacitor', 'Hoverboard Pro', 'Jetpack X'],
    size: [
      '6XL', 'XXXS', 'Tiny', 'Long', 'Wide'
    ], 'shipping method': ['Drone delivery', 'Teleportation', 'Carrier pigeon'], 'payment method': ['Cryptocurrency', 'Barter', 'Seashells'],
    plan: [
      'Platinum Elite', 'Ultimate Max', 'Galaxy', 'Celestial', 'Dragon Crest', 'Velvet Orbit', 'Cloudspan',
      'Glowvault', 'Opal Horizon', 'Starlit Crown', 'Dawnmark', 'Rune Voyager'
    ], frequency: ['Every other Tuesday', 'Twice a leap year'], topping: ['Dragon fruit', 'Moon cheese', 'Unobtainium'],
    amenity: [
      'Helipad', 'Moat', 'Dungeon', 'Airlock', 'Belfry', 'Hangar', 'Aviary', 'Forge', 'Orrery'
    ], topic: ['Alchemy', 'Necromancy', 'Cryptids'], skill: ['Time travel', 'Telepathy', 'Dragon taming'],
    person: [
      'Zaphod Beeblebrox', 'Frodo Baggins', 'Ellen Ripley', 'Pocket dimension', 'Gravity dial', 'Stasis bubble',
      'Crystal beacon', 'Dream archive', 'Phoenix roost', 'Goblin permit', 'Mermaid relay', 'Enchanted map'
    ], option: ['Teleport access', 'Moon base', 'Time travel logs'],
  };

  const ABSENT_SETTINGS = [
    'holographic display', 'carrier pigeon alerts', 'fax notifications', 'smell-o-vision', 'personal raincloud',
    'lucid dream channel', 'local gravity field', 'instant snowstorms', 'crystal ball feed', 'thought lantern glow',
    'rainbow generator', 'phantom ink mode', 'levitating menus', 'enchanted compass', 'goblin translation',
    'starlight keyboard'
  ];

  const ABSENT_ROWS = [
    'Teleportation speed', 'Parking validation', 'Dress code for dragons', 'Unicorn stall access',
    'Fairy flight clearance', 'Golem charging docks', 'Phoenix nest warmth', 'Cloakroom capacity',
    'Umbrella stand size', 'Crystal cave lighting', 'Parcel wrapping desk', 'Gnome seating plan'
  ];

  const shortOf = (x) => String(x).replace(/\s*\(.*\)\s*$/, '');

  const wordsOf = (x, all = []) => {
    const lone = (w) => all.filter((o) => lc(o).startsWith(lc(w))).length <= 1;
    const two = String(x).split(/\s+/).slice(0, 2).join(' ');
    return uniq([x, ...(lone(shortOf(x)) ? [shortOf(x)] : []), ...(two !== x && lone(two) ? [two] : [])]);
  };

  const SET_SCENARIOS = ['checkbox', 'listbox', 'chips', 'tags', 'tree'];

  function prefixPair(jr, pool, all) {
    const lower = all.map(lc);
    const out = [];
    for (let i = 0; i < pool.length; i++) {
      for (let j = i + 1; j < pool.length; j++) {
        const a = lc(pool[i]);
        const b = lc(pool[j]);
        let L = 0;
        while (L < a.length && L < b.length && a[L] === b[L]) L++;
        const p = a.slice(0, L).trimEnd();
        if (p && lower.filter((o) => o.startsWith(p)).length === 2) out.push([pool[i], pool[j], pool[i].slice(0, p.length)]);
      }
    }
    return out.length ? jr.pick(out) : null;
  }

  const JT = {
    single: [
      'Set the {label} to {t}.', 'Choose {t} for {label}.', 'Change the {label} to {t}.', 'Pick {t} as the {noun}.',
      'Select {t} in {label}.', '{label} should be {t}.', 'Make {t} the {noun}.', 'I want {label} set to {t}.',
      '{t} is my {noun} choice.', 'Use {t} for this {label}.'
    ],
    add: {
      checkbox: ['Also tick {t} under {label}.', 'Tick {t} as well.', 'Check {t} too.'],
      listbox: ['Also select {t} in the {label} list.', 'Add {t} to the selection in {label}.'],
      chips: ['Add {t} to {label}.', 'Also include {t} in {label}.'],
      tags: ['Add {t} to {label}.', 'Also tag it with {t}.'],
      tree: ['Also check {t} under {label}.', 'Tick {t} as well.'],
    },
    remove: {
      checkbox: ['Untick {t} under {label}.', 'Uncheck {t}.'],
      listbox: ['Deselect {t} in the {label} list.', 'Remove {t} from the selection in {label}.'],
      chips: ['Remove {t} from {label}.', 'Take {t} out of {label}.'],
      tags: ['Remove {t} from {label}.', 'Take {t} out of the tags.'],
      tree: ['Uncheck {t} under {label}.', 'Untick {t}.'],
    },
    toggle: ['Turn off {t}.', 'Switch off {t}.', 'Disable {t}.', 'Get {t} off.', 'Keep {t} off.'],
    toggleOn: ['Turn on {t}.', 'Switch on {t}.', 'Enable {t}.', 'Get {t} on.', 'Keep {t} on.'],
    matrix: [
      'Mark {t} as {col}.', 'Answer {col} for {t}.', 'Choose {col} on {t}.', '{t} should be {col}.',
      'Have {t} read {col}.'
    ],
    dependent: [
      'Set the location to {city}, {country}.', 'Choose {country} as the country and then {city} as the city.',
      'Pick {country}, then {city}.', 'The location must be {city} in {country}.'
    ],
  };

  function absentName(jr, spec) {
    const list = (ABSENT[spec.noun] || ABSENT.option).filter((x) => !(spec.options || []).includes(x));
    return jr.pick(list.length ? list : ['Atlantis']);
  }

  function impossibleOf(jr, spec) {
    const v = spec.scenario;
    const lab = lc(spec.label);
    if (v === 'toggles') {
      const taken = spec.items.map((it) => it.concept);
      const c = jr.pick(ABSENT_SETTINGS.filter((x) => !taken.includes(x)));
      return { mode: 'impossible', kind: 'toggleOn', t: quote(c), what: [c], message: `I can't do that: there is no "${c}" setting on this page.` };
    }
    if (v === 'matrix') {
      const r = jr.pick(ABSENT_ROWS.filter((x) => !spec.rows.includes(x)));
      const col = jr.pick(spec.cols);
      return { mode: 'impossible', kind: 'matrix', t: quote(r), col: quote(col), what: [r], message: `I can't do that: there is no "${r}" question in this survey.` };
    }
    if (v === 'dependent') {
      const city = jr.pick(ABSENT.city.filter((c) => !Object.values(spec.cities).flat().includes(c)));
      const country = jr.pick(spec.options);
      return { mode: 'impossible', kind: 'dependent', city: quote(city), country: quote(country), what: [city],
        message: `I can't do that: ${country} has no city called "${city}" in the list.` };
    }
    const name = absentName(jr, spec);
    const noun = spec.noun;
    if (SET_SCENARIOS.includes(v)) {
      return { mode: 'impossible', kind: 'add', t: quote(name), what: [name], message: `I can't do that: there is no "${name}" ${noun} in ${lab}.` };
    }
    return { mode: 'impossible', kind: 'single', t: quote(name), what: [name], message: `I can't do that: ${spec.label} has no "${name}" option.` };
  }

  function ambiguousOf(jr, spec) {
    const v = spec.scenario;
    const noun = spec.noun;
    const lab = lc(spec.label);
    // others: the page's other options, which a reply must not offer.
    const mk = (a, b, extra) => ({ mode: 'ambiguous', cands: [wordsOf(a, spec.options), wordsOf(b, spec.options)],
      others: (spec.options || []).filter((o) => o !== a && o !== b).map((o) => [o]),
      message: `Which ${(extra && extra.noun) || noun} do you mean: ${a} or ${b}?`, ...extra });
    if (v === 'toggles') {
      const concepts = spec.items.map((it) => it.concept);
      const count = new Map();
      concepts.forEach((c, i) => c.split(/[^a-z0-9@]+/).filter((w) => w.length >= 5).forEach((w) => count.set(w, uniq([...(count.get(w) || []), i]))));
      const pairs = [...count.entries()].filter(([, ix]) => ix.length === 2);
      let a;
      let b;
      let t;
      if (pairs.length) {
        const [w, ix] = jr.pick(pairs);
        [a, b] = ix;
        t = w;
      } else {
        [a, b] = jr.sample(spec.items.map((_, i) => i), 2);
        t = `either ${quote(spec.items[a].concept)} or ${quote(spec.items[b].concept)}`;
      }
      const A = spec.items[a];
      const B = spec.items[b];
      return { mode: 'ambiguous', kind: jr.bool(0.5) ? 'toggle' : 'toggleOn', t,
        cands: [uniq([A.concept, A.label]), uniq([B.concept, B.label])],
        others: spec.items.filter((_, i) => i !== a && i !== b).map((it) => uniq([it.label, it.concept])),
        message: `Which one do you mean: "${A.label}" or "${B.label}"?` };
    }
    if (v === 'matrix') {
      const asked = matrixAsked(spec);
      const first = (r) => lc(r.split(/\s+/)[0]);
      const by = new Map();
      spec.rows.forEach((r, i) => by.set(first(r), [...(by.get(first(r)) || []), i]));
      const pairs = [...by.entries()].filter(([w, ix]) => ix.length === 2 && w.length >= 3);
      const col = quote(jr.pick(spec.cols));
      if (pairs.length) {
        const [w, ix] = jr.pick(pairs);
        const [A, B] = ix.map((i) => spec.rows[i]);
        return { mode: 'ambiguous', kind: 'matrix', t: `the ${quote(spec.rows[ix[0]].split(/\s+/)[0])} question`, col, cands: [wordsOf(A, spec.rows), wordsOf(B, spec.rows)],
          others: spec.rows.filter((r) => r !== A && r !== B).map((r) => [r]),
          message: `Which question do you mean: "${A}" or "${B}"?`, word: w };
      }
      const pool = asked.length >= 2 ? asked : spec.rows.map((_, i) => i);
      const [i, k] = jr.sample(pool, 2);
      const A = spec.rows[i];
      const B = spec.rows[k];
      return { mode: 'ambiguous', kind: 'matrix', t: `either ${quote(A)} or ${quote(B)}`, col, cands: [wordsOf(A, spec.rows), wordsOf(B, spec.rows)],
        others: spec.rows.filter((r) => r !== A && r !== B).map((r) => [r]),
        message: `Which question do you mean: "${A}" or "${B}"?` };
    }
    // choices: single, sets and the dependent selects (countries)
    const held = v === 'dependent' ? [spec.target.country] : spec.targets || [spec.target];
    const set = SET_SCENARIOS.includes(v);
    const base = (spec.options || []).filter((o) => !(spec.disabled || []).includes(o));
    let pool = base.filter((o) => !held.includes(o));
    let remove = false;
    if (set && pool.length < 2) { pool = base.filter((o) => held.includes(o)); remove = true; }
    if (pool.length < 2) return undefined;
    const pair = prefixPair(jr, pool, spec.options);
    const kind = set ? (remove ? 'remove' : 'add') : 'single';
    const extra = v === 'dependent' ? { noun: 'country', label: 'Country' } : {};
    if (pair) {
      const [a, b, p] = pair;
      const t = `the ${v === 'dependent' ? 'country' : noun} ${jr.pick(['that starts with', 'starting with'])} ${quote(p)}`;
      return mk(a, b, { kind, t, ...extra });
    }
    const [a, b] = jr.sample(pool, 2);
    return mk(a, b, { kind, t: `either ${quote(a)} or ${quote(b)}`, ...extra });
  }

  function judgeOf(jr, spec, mode) {
    if (mode === 'confirm') {
      return { mode, message: `The ${lc(spec.label)} is set. Should I go ahead and submit it, or do you want to check it first?` };
    }
    return mode === 'impossible' ? impossibleOf(jr, spec) : ambiguousOf(jr, spec);
  }

  function judgeInstruction(spec, rng) {
    const j = spec.judge;
    const label = j.label || I.alias(rng, spec.label, spec.labelAliases || [], 0.3);
    const vars = { label, noun: j.noun || spec.noun, plural: spec.plural, t: j.t, col: j.col, city: j.city, country: j.country };
    const tpls = j.kind === 'add' || j.kind === 'remove' ? JT[j.kind][spec.scenario] : JT[j.kind];
    const core = I.fill(I.pick(rng, tpls, spec.isplit), vars);
    return I.say(rng, core, { isplit: spec.isplit, terse: `${spec.label}: ${j.t || ''}`.trim() });
  }

  Object.assign(lib, { judgeOf, judgeInstruction, SET_SCENARIOS });
})();
