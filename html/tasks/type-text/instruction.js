/* type-text/instruction.js: Instruction templates and their final wording. */
(function () {
  'use strict';

  const { I, q, RULE_TEXT, judgeInstruction, saveName } = env.taskOf('type-text').lib;

  const BLANK_SAYS = ['Leave the other fields empty.', 'Leave everything else blank.', 'Do not fill in any other field.',
    'The remaining fields stay empty.',
    'Blank any other enabled input.'];
  const SAVE_SAYS = [
    'Then save the form.', 'Save it when you are done.', 'Save the changes afterwards.', 'Then save.',
    'Finish by saving.', 'Make saving the last step.', 'The edits need saving.', 'Save to keep them.'
  ];

  function ref(rng, f, p = 0.4) {
    return I.alias(rng, f.label, f.aliases || [], p);
  }

  function instructionCore(spec, rng) {
    const S = spec.isplit;
    const fld = (id) => spec.fields.find((f) => f.id === id);
    const v = q(spec.given);
    let core;
    let terse = null;
    let steps = null;
    const tail = [];
    if (spec.scenario === 'single') {
      const f = fld('text');
      core = I.phrase(rng, ['Type {v} into the text field.', 'Enter {v} in the box.', 'Write {v} in the field labeled "{label}".',
        'Fill the {lab} field with {v}.', 'Put {v} in the input.', 'The {lab} field should read {v}.', 'Make the field say {v}.',
        'Set the text to {v}.',
        'The text to type is {v}.',
        '{v} is what the box must contain.',
        'Use {v} as the new entry.',
        'The entry must match {v}.'], { v, label: f.label, lab: ref(rng, f) }, S);
      terse = `${f.label}: ${v}`;
    } else if (spec.scenario === 'transform') {
      const f = fld('text');
      const rule = spec.rule === 'sub' ? rng.pick([spec.sub.text, ...spec.sub.alt]) : rng.pick(RULE_TEXT[spec.rule]);
      core = I.phrase(rng, ['Type {v} {rule}.', 'Enter {v} {rule}.', 'Write the text {v} {rule}.', 'Fill in {v} {rule}.',
        'Put {v} into the field, {rule}.', 'In the {lab} field, type {v} {rule}.', 'Enter the text {v} {rule}.',
        '{v} goes in {lab} {rule}.', 'For {lab}, use {v} {rule}.', 'The box must read {v} {rule}.',
        'Use {v}, but type it {rule}.'],
      { v, rule, lab: ref(rng, f) }, S);
    } else if (spec.scenario === 'password') {
      const [a, b] = spec.fields;
      core = I.phrase(rng, ['Enter the password {v} in both fields.', 'Set the password to {v} and confirm it.',
        'Type {v} as the password and again to confirm.', 'Choose {v} as your new password (enter it twice).',
        'Use {v} for both the {l1} and the {l2} fields.', 'Change the password to {v}; type it once more to confirm.',
        'Both password boxes must contain exactly {v}.', 'Your password is {v}; type it again to confirm.',
        'Make {l1} and {l2} each contain the password {v}.', 'Password and confirmation should both read {v}.'],
      { v, l1: ref(rng, a), l2: ref(rng, b) }, S);
      terse = `password ${v} (twice)`;
      steps = [`type ${v} in ${a.label}`, `type it again in ${b.label}`];
    } else if (spec.scenario === 'login') {
      const what = spec.given.includes('@') ? 'email' : 'username';
      const p = q(spec.password);
      core = I.phrase(rng, ['Log in with {what} {u} and password {p}.', 'Sign in as {u} using the password {p}.',
        'Enter the {what} {u} and the password {p}, then sign in.', 'Use {u} / {p} to log in.',
        'Log into the account {u} (password {p}).', 'Your credentials are {u} and {p}. Sign in.',
        'For {what} {u}, the password is {p}. Sign in.'],
      { what, u: v, p }, S);
      terse = `login ${v} / ${p}`;
      steps = [`enter ${what} ${v}`, `enter password ${p}`, 'sign in'];
    } else if (spec.scenario === 'multi') {
      const asked = spec.ask.map(fld);
      const pairs = asked.map((f) => `${ref(rng, f)}: ${q(f.say)}`).join(', ');
      core = I.phrase(rng, ['Fill in the form. {pairs}.', 'Enter these values: {pairs}.', 'Complete the form with {pairs}.',
        'Update the record: {pairs}.', 'Please put the following in the form - {pairs}.', 'Use these details: {pairs}.',
        'Here are the details for the form: {pairs}.',
        'The entries to make are {pairs}.',
        'Set the fields as listed: {pairs}.',
        'Match these fields and values: {pairs}.',
        'Apply the entries - {pairs}.',
        'Fill the listed fields: {pairs}.',
        'Field values to enter: {pairs}.'], { pairs }, S);
      if (spec.fields.some((f) => f.blank)) tail.push(I.pick(rng, BLANK_SAYS, S));
      if (spec.save) tail.push(I.pick(rng, SAVE_SAYS, S));
      terse = pairs;
      steps = asked.map((f) => `set ${f.label} to ${q(f.say)}`).concat(spec.save ? ['save the form'] : []);
    } else if (spec.scenario === 'textarea') {
      const ta = fld('notes');
      const other = spec.fields.find((f) => f.id !== 'notes');
      const lines = spec.lines.map(q);
      const listed = lines.length > 1 ? `${lines.slice(0, -1).join(', ')} and ${lines[lines.length - 1]}` : lines[0];
      core = I.phrase(rng, ['In {lab}, enter these lines in order, one per line: {list}.',
        'Type {list} into {lab}, each on its own line.', 'Write the {lab} on separate lines: {list}.',
        'Fill in {lab} with {n} lines: {list}.', 'Put {list} in {lab} - one per line.',
        'Enter {list} as separate lines in the {lab} field.',
        'Give each item one line in {lab}, in order: {list}.',
        'The {n} lines of {lab} should be: {list}.',
        'Fill {lab} line by line, in order: {list}.'],
      { lab: ref(rng, ta), list: listed, n: lines.length }, S);
      if (other) tail.push(I.phrase(rng, [
        'Also set {l} to {v}.', 'Put {v} in {l} too.', 'And enter {v} as the {l}.', 'Use {v} for {l} as well.',
        'Let {l} read {v} too.'
      ], { l: ref(rng, other), v: q(other.say) }, S));
      if (spec.save) tail.push(I.pick(rng, SAVE_SAYS, S));
      terse = `${ta.label}: ${spec.lines.join(' / ')}`;
    } else if (spec.scenario === 'copy') {
      const from = fld('from');
      const to = fld('to');
      core = I.phrase(rng, ['Copy the {a} into the {b} field.', 'Use the same value for {b} as in {a}.',
        'Make {b} match {a}.', 'Fill {b} with whatever is in {a}.', 'The {b} should be the same as the {a} - copy it over.',
        'Copy {a} to {b}.',
        '{b} needs a full copy of {a}.',
        'Reproduce all of {a} in {b}.',
        'Use {a} as the content for {b}.',
        'Give {b} every line from {a}.'], { a: ref(rng, from, 0.5), b: ref(rng, to, 0.5) }, S);
      if (spec.extraAsk) {
        const o = fld('other');
        tail.push(I.phrase(rng, ['Also change {l} to {v}.', 'And set {l} to {v}.'], { l: ref(rng, o), v: q(o.say) }, S));
      }
      if (spec.save) tail.push(I.pick(rng, SAVE_SAYS, S));
      terse = `${to.label} = ${from.label}`;
    } else if (spec.scenario === 'sections') {
      const asked = spec.ask.map(fld);
      const pairs = asked.map((f) => `${ref(rng, f)} to ${q(f.say)}`);
      const listed = pairs.length > 1 ? `${pairs.slice(0, -1).join(', ')} and ${pairs[pairs.length - 1]}` : pairs[0];
      core = I.phrase(rng, ['Change {list}.', 'Update the {lab}: set {list}.', 'In the {lab}, change {list}.',
        'Please set {list}.', 'Set {list} in the settings.', 'I need {list} - update my details.',
        'Edit the {lab} so that you change {list}.',
        'Make these changes: {list}.',
        'Edits needed: {list}.',
        'Edit the {lab}: {list}.',
        'Use these updates: {list}.',
        'Bring the {lab} up to date: {list}.'], { list: listed, lab: rng.pick([
          'profile', 'account settings', 'account details', 'settings', 'preferences', 'user account'
        ]) }, S);
      const secs = new Set(asked.map((f) => f.section));
      if (spec.tellSection && secs.size === 1) {
        const t = spec.sections[asked[0].section].title;
        core = `${I.phrase(rng, [
          'On the "{t}" tab', 'Under "{t}"', 'In the "{t}" section', 'Where it says "{t}"', 'With "{t}" open',
          'Here in "{t}"'
        ], { t }, S)}, ${I.lcFirst(core)}`;
      }
      if (rng.bool(0.5)) tail.push(I.pick(rng, ['Leave the other fields as they are.', 'Do not change anything else.',
        'Everything else stays the same.',
        'Only requested fields may change.',
        'Keep the other values intact.',
        'No edits beyond those requested.'], S));
      if (spec.save) tail.push(I.pick(rng, SAVE_SAYS, S));
      terse = asked.map((f) => `${f.label}: ${q(f.say)}`).join(', ');
      steps = asked.map((f) => `set ${f.label} to ${q(f.say)}`).concat(spec.save ? ['save the form'] : []);
    } else if (spec.scenario === 'complete') {
      const card = spec.profile.title;
      const rows = spec.profile.rows.filter((x) => x.id);
      if (spec.source === 'card') {
        core = I.phrase(rng, ['Finish the form using the details shown on the page.',
          'Some required fields are still empty. Fill them in from the {card} panel.',
          'Fill in whatever is missing, using the {card}.', 'Complete this form - the information you need is in the {card}.',
          'Finish filling out the form; take the missing details from the {card}.',
          'The form is half done. Complete it with the data from the {card}.',
          'Use the {card} as a reference to finish the required entries.',
          'The {card} has the missing data; use it to finish the form.',
          'Complete the required entries still missing, using the {card}.',
          'Take what is needed from the {card} to finish this form.',
          'For the remaining required details, consult the {card} and fill them in.'], { card: I.lcFirst(card) }, S);
        terse = `finish the form from the ${I.lcFirst(card)}`;
      } else {
        const list = rows.map((x) => `${x.label}: ${q(x.value)}`).join(', ');
        core = I.phrase(rng, ['Finish the form. My details are {list}.', 'Complete whatever is still empty using these details: {list}.',
          'Fill in the missing fields. For reference: {list}.', 'Some fields are blank - finish the form with {list}.',
          'Here is my information: {list}. Please complete the form.',
          'Use this record to fill the required blanks: {list}.',
          'The form needs details. Complete it with {list}.',
          'Supply what the form is missing from this record: {list}.'], { list }, S);
        terse = `finish the form: ${list}`;
      }
      if (spec.startMode === 'wrong' || rng.bool(0.3)) {
        tail.push(I.pick(rng, ['Everything must match those details.', 'Correct anything that does not match.',
          'Make sure every entry matches.',
          'Align entries with the given data.',
          'Each value must match the reference.',
          'Find all mismatches and fix them.'], S));
      }
      if (spec.fields.some((f) => f.blank) && rng.bool(0.4)) tail.push(I.pick(rng, ['Optional fields can stay empty.', 'Leave the optional fields blank.'], S));
      if (spec.save) tail.push(I.pick(rng, SAVE_SAYS, S));
    } else if (spec.nameBy === 'kind') {
      core = I.phrase(rng, ['Fix the {k} field and save the form again.', 'The {k} is wrong - correct it so the form saves.',
        'Correct the {k}, then save.', 'The form rejected the {k}. Fix it and save.',
        'Please fix the {k} field; the form will not save otherwise.', 'Something is off with the {k}. Correct it and save the changes.',
        'Use the error to fix the {k}, then save again.', 'Save again once the {k} meets the stated rule.',
        'The {k} error tells you what to fix. Save again.', 'Read the {k} error, fix the entry, and save again.'],
      { k: spec.invalid.say }, S);
      terse = `fix the ${spec.invalid.say} and save`;
    } else {
      core = I.pick(rng, ['Fix the field with the error and save the form again; it was rejected.',
        'Correct the invalid entry so that the form saves.',
        'Find the field the form complains about, fix it and save.',
        'Fix the validation error in this form, then save it.',
        'Fix the invalid field and save the changes.',
        'Resolve the error shown in the form, then save it.',
        'Get this form to save by correcting the field that has an error.',
        "Fix the field that's wrong and save again.",
        'One of the entries is wrong. Fix it so the form saves.',
        'Use the error message to correct the entry, then save.',
        'Before saving again, put right the entry marked wrong.',
        'The error points to an entry to correct. Save again.',
        'Read the form\'s error, make the correction and save.',
        'Save again after repairing the entry the form flags.',
        'Address the entry\'s reported error and save again.',
        'To save this form, fix the entry its error points out.',
        'Correct what the error identifies, then save the form.'], S);
      terse = 'fix the error and save';
    }
    return { core, terse, steps, tail };
  }

  function instruction(spec, rng) {
    if (spec.judge && spec.judge.mode !== 'confirm') return judgeInstruction(spec, rng);
    const conf = spec.judge && spec.judge.mode === 'confirm';
    // Extra sentences (blank fields, saving, a second field) follow the wrapped core sentence.
    let { core, terse, steps, tail } = instructionCore(spec, rng);
    if (conf) {
      tail = tail.filter((t) => !SAVE_SAYS.includes(t));
      if (spec.scenario === 'validation-fix') {
        core = I.pick(rng, [
          'Fix the field the form rejected.', 'Correct the invalid entry in the form.',
          'Fix the validation error in this form.', 'Let the error guide your correction.',
          'Put the flagged entry right again.'
        ], spec.isplit);
      }
    }
    const said = I.say(rng, core, { isplit: spec.isplit, terse, steps });
    const out = tail.length ? [/[.!?]$/.test(said) ? said : `${said}.`, ...tail].join(' ') : said;
    return conf ? `${out.replace(/[.!?\s]+$/, '')}, but check with me before you ${saveName(spec)}.` : out;
  }

  Object.assign(env.taskOf('type-text').lib, { instruction });
})();
