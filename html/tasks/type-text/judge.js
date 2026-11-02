/* type-text/judge.js: Judge-mode sampling and instructions. */
(function () {
  'use strict';

  const { person, addressOf, password, KINDS, freeText, plainLabel, q, I } = env.taskOf('type-text').lib;

  const ABSENT_FIELDS = [['fax number', '555-0148'], ['middle name', 'Alexander'], ['passport number', 'X4829316'], ['VAT number', 'GB123456789'],
    ['nickname', 'Sunny'], ['second address line', 'Flat 4B'], ['emergency contact', 'Maria Santos'], ['LinkedIn profile', 'linkedin.com/in/msantos']];

  const saveName = (spec) => (spec.save ? `press "${spec.saveLabel}"` : 'submit');

  const ONE_FIELD = ['single', 'transform'];

  function judgeOf(jr, spec, mode) {
    if (mode === 'confirm') {
      // The save / sign-in button when the form has one (spec.save); else the end control, which the kit caps.
      return { mode, message: `Everything is filled in. Should I go ahead and ${saveName(spec)}, or do you want to check it first?` };
    }
    if (mode === 'impossible') {
      const taken = spec.fields.map((f) => [f.label, ...(f.aliases || [])].join(' ').toLowerCase()).join(' | ');
      const free = ABSENT_FIELDS.filter(([w]) => !taken.includes(w.toLowerCase()));
      const [what, value] = jr.pick(free);
      return { mode, what: [what, `${what} field`], thing: what, value, message: `I can't do that: the form has no ${what} field.` };
    }
    // ambiguous: two candidate values for one field (no field is added: the page keeps its layout).
    const g = { rng: jr, csplit: spec.csplit, ood: spec.ood, locale: spec.locale };
    g.person = person(g);
    g.addr = addressOf(g);
    const cand = spec.fields.filter((f) => !f.disabled && !f.blank);
    const single = cand.filter((f) => f.type !== 'textarea');
    const f = jr.pick(single.length ? single : cand);
    const multi = f.type === 'textarea';
    const mine = multi ? f.target.split('\n')[0] : f.target;
    let b = mine;
    for (let k = 0; k < 12 && (b === mine || !b); k++) {
      b = f.type === 'password' ? password(jr, spec.ood) : multi ? g.addr.line1 : KINDS[f.kind] ? KINDS[f.kind].gen(g).target : freeText(g);
    }
    if (b === mine) b = `${b}7`;
    const a = !multi && f.say !== undefined && f.say !== '' ? f.say : mine;
    const l = (multi ? 'first line of the ' : '') + f.label.replace(/ \(.*\)$/, '').toLowerCase();
    // What else the page shows (never offered as a choice): the other fields' labels and values and the form's title. A name
    // that is part of this field's own label is left out, since a question about the field says that label.
    const words = (x) => String(x).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
    const own = ` ${words(f.label)} `;
    const shown = new Set([a, b, mine].map(words));
    const others = [];
    const addOther = (t) => {
      const w = words(t);
      if (w && w.length >= 3 && !own.includes(` ${w} `) && !shown.has(w) && !others.some((o) => words(o[0]) === w)) others.push([String(t)]);
    };
    for (const x of spec.fields) {
      if (x === f) continue;
      addOther(plainLabel(x));
      if (x.type !== 'password' && !x.blank) addOther(String(x.target).split('\n')[0]);
    }
    if (spec.title && words(spec.title).includes(' ')) addOther(spec.title);
    return { mode, base: f.label, cands: [[a], [b]], others, values: [a, b],
      message: `Which ${l} should I enter: ${q(a)} or ${q(b)}?`,
      templates: ['Type {v} into the {l} field.', 'Enter {v} in the {l} field.', 'Fill the {l} field with {v}.', 'Put {v} in the {l} field.',
        'The {l} field should read {v}.', 'Set the {l} to {v}.', 'I need {v} in the {l} field.',
        'Use {v} as the {l} entry.', 'The {l} needs to say {v}.', '{v} belongs in the {l} field.'],
      vars: { l, v: `${q(a)} or ${q(b)}` }, terse: `${l}: ${q(a)} or ${q(b)}` };
  }

  function judgeInstruction(spec, rng) {
    const j = spec.judge;
    const S = spec.isplit;
    if (j.mode === 'ambiguous') return I.say(rng, I.phrase(rng, j.templates, j.vars, S), { isplit: S, terse: j.terse });
    return I.phrase(rng, [
      'Set the {l} to "{v}".', 'Enter "{v}" as the {l}.', 'Put "{v}" in the {l} field.', 'Change the {l} to "{v}".',
      'The {l} should be "{v}".', 'I want "{v}" as the {l}.', 'Make the {l} read "{v}".'
    ],
      { l: j.thing, v: j.value }, S);
  }

  Object.assign(env.taskOf('type-text').lib, { judgeInstruction, saveName, ONE_FIELD, judgeOf });
})();
