/*
 * find-fact / count: find in page.
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('find-fact');
  const { quote: q } = env.util;
  const { baseFind, errorFind, FIND_HEADS, FIND_TITLES, findDoc, findTerms, foldAll, levelFind, longerForms,
    matchesOf, planFind, say, truthOf, typedStartFind } = fam.lib;

  // count: sentences that mention the term once; lowercase 'case' decoys use the word as a common noun.
  const FIND_MENTIONS = ['The {T} team reviews these requests every week.', 'Members of {T} can change this setting at any time.',
    'This also applies to accounts on the {T} plan.', 'See the {T} notes for the full list.', 'Reports from {T} are kept for two years.',
    'Ask {T} support if the page does not load.', 'The {T} dashboard shows the current status.', 'Changes to {T} take effect the next day.',
    'Not every region offers {T} yet.', 'Older {T} invoices stay available for download.', 'Accounts moved to {T} keep their history.',
    'The {T} contract renews every January.',
    'The welcome packet for {T} includes a setup guide.',
    'Each {T} workspace has its own address book.',
    'Guest access is disabled by default in {T}.',
    'A reference to {T} appears on the shipping label.',
    'The training room is reserved for {T} on Thursday.',
    'Search results in {T} are sorted by date.',
    'Only workspace owners can edit the {T} profile.',
    'The new office has a dedicated space for {T}.',
    'Invitations to {T} expire after seven days.',
    'The {T} mailing list receives a monthly digest.',
    'An empty queue in {T} is marked with a gray icon.',
    'Saved views in {T} are private unless shared.',
    'A link to {T} appears in the staff directory.',
    'The visitor desk has a printed map of {T}.',
    'Work on {T} pauses during the annual site closure.',
    'The workshop includes a short demonstration of {T}.',
    'You can mute {T} alerts during quiet hours.',
    'Draft entries in {T} are saved automatically.',
    'The {T} schedule has a break between sessions.',
    'Feedback about {T} goes to a shared inbox.',
    'The {T} review panel meets in the east wing.',
    'The pilot program for {T} begins in September.',
    'An idle session in {T} ends after thirty minutes.',
    'A slow connection may delay the {T} progress bar.',
    'The comparison table has a separate column for {T}.',
    'The document footer identifies {T} as the source.',
    'Each task in {T} can have more than one assignee.',
    'Spare keys for {T} are stored in a locked drawer.',
    'The {T} entrance has a ramp beside the steps.',
    'A diagram of {T} is mounted above the workbench.',
    'The {T} handbook has an index of technical terms.',
    'Testing of {T} revealed a delay on older devices.',
    'The {T} file names include the date of creation.',
    'The {T} waiting area has seats near the windows.',
    'The {T} map includes a scale in the lower corner.',
    'The {T} banner hangs between two wooden posts.',
    'A local craft group made the fabric panels for {T}.',
    'Two apprentices helped assemble the frame for {T}.',
    'The editor restored a missing paragraph in {T}.',
    'The {T} cover illustration was drawn in charcoal.'];
  const FIND_LOWER = ['Parking near the {T} is limited on weekdays.', 'A photo of the {T} appears on the cover page.',
    'The walk to the {T} takes about ten minutes.', 'Events by the {T} are listed on the community page.', 'Our office faces the {T}.',
    'An essay about the {T} won a writing prize.', 'We paused to take a closer look at the {T}.',
    'A note explains why the {T} is unusual.', 'The {T} looks different in this drawing.',
    'There was a lively discussion about the {T}.'];

  function sampleCount(rng, spec) {
    for (let tries = 0; ; tries++) {
      const kind = rng.bool(0.6) ? 'name' : 'code';
      const term = findTerms(rng, spec, kind, 1)[0];
      const mcase = kind === 'name' && rng.bool(0.5);
      const whole = rng.bool(0.55);
      const collapsed = rng.bool(0.35);
      const n = spec.ood ? rng.int(9, 14) : rng.int(3, 8);
      const lines = rng.shuffle(FIND_MENTIONS.slice());
      let li = 0;
      const mention = (t) => lines[li++ % lines.length].replace('{T}', t);
      const inserts = [...Array(n)].map(() => mention(term));
      if (mcase) for (let i = rng.int(1, 3); i > 0; i--) inserts.push(rng.pick(FIND_LOWER).replace('{T}', term.toLowerCase()));
      if (whole) {
        const longer = longerForms(rng, kind, term);
        for (let i = rng.int(1, 3); i > 0; i--) inserts.push(mention(rng.pick(longer)));
      }
      const sections = findDoc(rng, spec, spec.ood ? rng.int(9, 12) : rng.int(6, 8), rng.shuffle(inserts), [term.toLowerCase()]);
      if (collapsed) foldAll(sections);
      const out = { kind, term, match: { case: mcase, whole }, collapsed, title: rng.pick(FIND_TITLES), sections,
        openBy: rng.pick(['key', 'key', 'button']) };
      const truth = truthOf(out);
      out.answer = String(truth.length);
      // collapsed: at least one occurrence starts hidden in a folded section
      if ((truth.length === n && (!collapsed || truth.some((m) => sections[m.s].fold))) || tries > 20) return out;
    }
  }

  // count: each rule the page tests is stated: case (lowercase forms exist), whole word (longer words contain it),
  // collapsed sections (the find bar skips folded text).
  function countTail(spec, rng) {
    const mods = [];
    if (spec.match.case) {
      mods.push(rng.pick(['Count only matches with exactly this capitalization.', 'The count is case-sensitive.',
        'Only count it when it is capitalized exactly like that.',
        'Letter case must match the quoted target to count.',
        'Ignore matches whose capitalization differs.',
        'A case difference excludes an occurrence.']));
    }
    if (spec.match.whole) {
      mods.push(rng.pick(['Count it only as a whole word, not inside longer words.', 'Do not count it when it is part of a longer word.',
        'Only whole-word matches count.',
        'Reject it beside any letter, digit or underscore.',
        'Embedded forms are excluded from the count.',
        'A full word is required for a valid match.']));
    }
    if (spec.collapsed) {
      mods.push(rng.pick(['Include the collapsed sections.', 'Some sections are collapsed: count those too.',
        'Count every section, collapsed ones included.',
        'Include folded text when doing the count.',
        'Cover both open and collapsed sections.',
        'Leave no folded section out of the count.']));
    }
    return mods.length ? ` ${mods.join(' ')}` : '';
  }

  env.scenario('find-fact', {
    name: 'count',
    sample: sampleCount,
    baseModel: baseFind,
    typedStart: typedStartFind,
    level: levelFind,
    wrongAnswers(spec, rng) {
      const n = Number(spec.answer);
      const naive = matchesOf(spec, spec.term, false, false, [], false).length;
      return [String(naive !== n ? naive : n > 1 && rng.bool(0.5) ? n - 1 : n + 1)];
    },
    error: errorFind,
    plan: planFind,
    answers: (spec, one) => one('count', spec.answer, ['number', 'total', 'occurrences']),
    instruction(spec, rng) {
      const tail = countTail(spec, rng);
      return say(rng, spec, [
        'How many times does {t} appear in the document? Type the number.{tail}',
        'Count the occurrences of {t} in the document and enter the count.{tail}',
        'Type how many times {t} is mentioned in the text.{tail}',
        'Enter the number of times {t} occurs in the document.{tail}',
        'How often is {t} mentioned on this page? Type the number.{tail}',
        'Count every mention of {t} and type the total.{tail}',
        'Your answer must be the total count of {t} in the text.{tail}',
      ], { t: q(spec.term), tail }, { terse: `how many ${q(spec.term)}?${tail}` });
    },
    replyInstruction(spec, rng) {
      const tail = countTail(spec, rng);
      return say(rng, spec, [
        'How many times does {t} appear in the document?{tail}',
        'Count the occurrences of {t} in the document.{tail}',
        'How often is {t} mentioned on this page?{tail}',
        'Count every mention of {t}.{tail}',
        'Find out how many times {t} occurs in the text.{tail}',
        'Give a numeric tally of {t} across the text.{tail}',
        'Report the number of times {t} occurs here.{tail}',
        'How many occurrences of {t} are there?{tail}',
      ], { t: q(spec.term), tail }, { terse: `how many ${q(spec.term)}?${tail}` });
    },
    judgeAsk(jr, spec, page, pick) {
      let x = null, templates, vars = {}, message;
      // A term missing from the text has a count (0), so the ask names a section the document does not have.
      x = jr.pick(FIND_HEADS.filter((h) => !spec.sections.some((sec) => sec.heading === h)));
      templates = ['How many times does "{t}" appear in the {x} section? Type the number.', 'Count the mentions of "{t}" in the "{x}" section and enter the count.',
        'Type how many times "{t}" occurs in the section {x}.',
        'Use the answer field for a tally of "{t}" in the {x} section.'];
      vars = { x, t: spec.term };
      message = `I can't do that: the document has no "${x}" section.`;
      return { x, templates, vars, message };
    },
  });
})();
