/*
 * find-fact / locate: find in page.
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('find-fact');
  const I = env.instruct;
  const { quote: q } = env.util;
  const { baseFind, errorFind, FIND_NAMES, FIND_TITLES, findCode, findDoc, findTerms, foldAll, hitOf, levelFind,
    longerForms, matchesOf, planFind, say, typedStartFind, wrongOf } = fam.lib;

  // locate: every entry of a document gives the same kind of value, so only the term tells the target apart.
  const FIND_VALUES = {
    extension: { noun: 'extension', aliases: ['phone extension'], make: (rng) => String(rng.int(2000, 8999)),
      lines: ['Questions about {T} accounts go to extension {V}.', 'For anything related to {T}, call extension {V}.',
        'The {T} desk answers on extension {V}.', 'Staff who handle {T} requests can be reached at extension {V}.',
        'The directory lists extension {V} for {T} support.', 'Calls for {T} are transferred to extension {V}.',
        'Leave a message for the {T} team at extension {V}.', 'Extension {V} connects you to the {T} office.',
        'Ask for extension {V} if your query concerns {T}.', 'The phone beside the {T} counter uses extension {V}.',
        'To speak with the {T} coordinator, dial extension {V}.', 'The {T} voicemail box is on phone extension {V}.',
        'Extension {V} is reserved for all {T} appointments.', 'During {T} events, extension {V} reaches the host.'] },
    reference: { noun: 'reference number', aliases: ['reference'], make: (rng) => `#${rng.int(10000, 99999)}`,
      lines: ['Quote reference {V} when you write to us about {T}.', 'Requests under the {T} plan are filed with reference {V}.',
        'Use reference {V} for every {T} claim.', 'Invoices for {T} carry the reference {V}.',
        'The {T} application bears the reference number {V}.', 'Attach reference {V} to your {T} paperwork.',
        'The receipt for {T} shows reference {V}.', 'Track your {T} order using reference number {V}.',
        'Keep reference {V} handy for {T} correspondence.', 'The {T} renewal has been logged with reference {V}.',
        'Reference {V} links the {T} record to its documents.', 'The {T} cancellation needs reference number {V}.',
        'Reference {V} appears in minutes for {T}.', 'The {T} archive can be searched by reference {V}.',
        'Give reference {V} when discussing {T} by phone.', 'Feedback about {T} is grouped under reference {V}.'] },
    fee: { noun: 'fee', aliases: ['charge'],
      make: (rng) => (rng.bool(0.5) ? `$${rng.int(12, 480)}` : `$${rng.int(1, 9)},${String(rng.int(0, 999)).padStart(3, '0')}`),
      lines: ['The yearly fee for the {T} plan is {V}.', 'Switching to {T} costs a one-time fee of {V}.',
        'Late payments on {T} accounts add a fee of {V}.', 'The {T} upgrade carries a monthly fee of {V}.',
        'Joining the {T} program has a set fee of {V}.', 'Delivery of {T} orders incurs a fee of {V}.',
        'A replacement {T} card carries a fee of {V}.', 'An extra {T} copy is provided for a fee of {V}.',
        'The setup charge for the {T} service is {V}.', 'Restoring access to {T} incurs a fee of {V}.',
        'Cancelling a {T} booking incurs a fee of {V}.', 'Storage for {T} items has a weekly fee of {V}.',
        'The fee for a {T} inspection is set at {V}.', 'The daily fee to rent {T} equipment is {V}.',
        'The {T} workshop has an attendance fee of {V}.', 'A printed {T} certificate has a fee of {V}.'] },
  };

  function sampleLocate(rng, spec) {
    for (let tries = 0; ; tries++) {
      const kind = rng.bool(0.6) ? 'name' : 'code';
      const vkind = rng.pick(Object.keys(FIND_VALUES));
      const V = FIND_VALUES[vkind];
      const terms = findTerms(rng, spec, kind, 1 + (spec.ood ? rng.int(7, 9) : rng.int(4, 6)));
      const term = terms[0];
      const mcase = kind === 'name' && rng.bool(0.5);
      const whole = rng.bool(kind === 'name' ? 0.5 : 0.6);
      const entries = [{ term, decoy: null }];
      if (mcase) for (let i = rng.int(1, 2); i > 0; i--) entries.push({ term: term.toLowerCase(), decoy: 'case' });
      if (whole) rng.sample(longerForms(rng, kind, term), rng.int(1, 2)).forEach((t) => entries.push({ term: t, decoy: 'whole' }));
      terms.slice(1).forEach((t) => entries.push({ term: t, decoy: null }));
      const used = new Set();
      const facts = entries.map((e) => {
        let value = V.make(rng);
        while (used.has(value)) value = V.make(rng);
        used.add(value);
        return { ...e, value, text: rng.pick(V.lines).replace('{T}', e.term).replace('{V}', value) };
      });
      const sections = findDoc(rng, spec, spec.ood ? rng.int(9, 12) : rng.int(6, 8), facts.map((f) => f.text), terms.map((t) => t.toLowerCase()));
      const collapsed = rng.bool(0.3);
      if (collapsed) foldAll(sections);
      const out = { kind, term, vkind, noun: V.noun, match: { case: mcase, whole }, collapsed, title: rng.pick(FIND_TITLES), sections,
        facts, target: 0, answer: facts[0].value, openBy: rng.pick(['key', 'key', 'button']) };
      out.hit = hitOf(out);
      if (out.hit || tries > 20) return out;
    }
  }

  // locate: the term; a 'case' decoy (the lowercase word) exists only when the instruction asks for the exact
  // capitalization.
  const locateTerm = (spec, rng) => q(spec.term) + (spec.match.case
    ? ` ${rng.pick([
      '(capitalized exactly like that)', '(case-sensitive)', '(with that exact capitalization)',
      '(case must match as shown)', '(respect the quoted case)'
    ])}` : '');

  env.scenario('find-fact', {
    name: 'locate',
    sample: sampleLocate,
    baseModel: baseFind,
    typedStart: typedStartFind,
    level: levelFind,
    wrongAnswers(spec, rng) {
      return [wrongOf(rng, spec.answer, spec.facts.filter((f, i) => i !== spec.target).map((f) => f.value))];
    },
    error: errorFind,
    plan: planFind,
    answers: (spec, one) => one(spec.noun, spec.answer, FIND_VALUES[spec.vkind].aliases),
    instruction(spec, rng) {
      const t = locateTerm(spec, rng);
      const noun = I.alias(rng, spec.noun, FIND_VALUES[spec.vkind].aliases);
      return say(rng, spec, [
        'Find the entry for {t} in the document and type its {noun}.',
        'What {noun} does the document give for {t}? Type it.',
        'Look up {t} in the document and enter the {noun} mentioned with it.',
        'Type the {noun} listed for {t}.',
        'Somewhere in the document, {t} is mentioned together with its {noun}. Enter it.',
        'Search the page for {t} and report the {noun} given there.',
        'Read the document entry for {t} then enter its {noun}.',
        'Answer with the {noun} paired with {t} in the document.',
        'Enter the value shown as the {noun} alongside {t} in the document.',
        'Check which {noun} belongs to {t} in the document and type it.',
      ], { t, noun }, { terse: `${noun} for ${q(spec.term)}` });
    },
    replyInstruction(spec, rng) {
      const t = locateTerm(spec, rng);
      const noun = I.alias(rng, spec.noun, FIND_VALUES[spec.vkind].aliases);
      return say(rng, spec, [
        'What {noun} does the document give for {t}?',
        'Find the entry for {t} in the document and read its {noun}.',
        'Look up {t} in the document: which {noun} is mentioned with it?',
        'Somewhere in the document, {t} is mentioned together with its {noun}. Find it.',
        'Search the page for {t} and check the {noun} given there.',
        'In the document entry for {t}, what is the associated {noun}?',
        'Give the {noun} that is paired with {t} in the document.',
        'Read the document and tell me the {noun} that belongs to {t}.',
        'Please provide the {noun} from the document entry containing {t}.',
      ], { t, noun }, { terse: `${noun} for ${q(spec.term)}` });
    },
    judgeAsk(jr, spec, page, pick) {
      let x = null, templates, vars = {}, message;
      if (spec.kind === 'name') x = pick(FIND_NAMES);
      else for (let k = 0; k < 40 && !x; k++) { const c = findCode(jr); if (!page.includes(c.toLowerCase())) x = c; }
      if (!x) return null;
      templates = [
        'Find the entry for "{x}" in the document and type its {noun}.',
        'What {noun} does the document give for "{x}"? Type it.', 'Type the {noun} listed for "{x}".',
        'Copy the {noun} from the document entry for "{x}".', 'Read "{x}" in the document then enter its {noun}.'
      ];
      vars = { x, noun: spec.noun };
      message = `I can't do that: the document never mentions "${x}".`;
      return { x, templates, vars, message };
    },
    retargetTries(spec, model, rng, tries) {
      // Another entry (not a decoy): its term has no near matches, so no option is needed.
      spec.facts.forEach((f, i) => {
        if (i === spec.target || f.decoy) return;
        const s = { ...spec, target: i, term: f.term, answer: f.value, match: { case: false, whole: false } };
        s.hit = hitOf(s);
        if (s.hit && matchesOf(s, f.term, false, false, [], true).length === 1) tries.push(s);
      });
    },
  });
})();
