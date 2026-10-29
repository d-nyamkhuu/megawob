/* set-date/instructions.js: instruction templates (no DOM). */
(function () {
  'use strict';
  const lib = env.taskOf('set-date').lib;

  const T = {
    calendar: ['Select {a} as the {label}.', 'Use the date picker to set the {label} to {a}.', 'Pick {a} in the {label} calendar.',
      'Set the {label} to {a}.', 'Choose {a} for the {label}.', 'Make the {label} {a}.', 'Change the {label} to {a}.',
      'Have the {label} display {a}.', 'Mark {a} on the {label} calendar.', 'The date for {label} is {a}.',
      'Ensure the {label} has {a}.', 'The {label} is to be {a}.'],
    typed: ['Type {a} into the {label} field.', 'Enter the {label}: {a}.', 'Fill in the {label} with {a}.', 'Set the {label} to {a}.',
      'Record {a} as the {label}.', 'Put {a} in the {label} box.', 'The {label} needs to read {a}.',
      'Date to type for {label}: {a}.', 'Use {a} for {label}.', 'I need {a} in the {label} field.',
      'Your {label} entry is {a}.'],
    time: ['Set the {label} to {a}.', 'Change the {label} to {a}.', 'Make the {label} {a}.', 'Choose {a} as the {label}.',
      'Switch the {label} to {a}.', 'Pick {a} for the {label}.', 'Have the {label} read {a}.',
      'Let {a} be the {label}.', 'Time for {label} is {a}.'],
    text24: ['Enter {a} in the {label} field, using 24-hour time.', 'Type the {label} as {a} (24-hour clock).', 'Set the {label} to {a}; the field takes 24-hour time.',
      'Fill in {a} as the {label} in HH:MM format.', 'Enter the {label}, {a}, in 24-hour format.', 'Write {a} into the {label} using the 24-hour clock.',
      'Use 24-hour notation for your {label}: {a}.', 'Convert {a} to 24-hour time for the {label} field.',
      'The {label} should show {a} on a 24-hour clock.', 'For the {label}, express {a} in 24-hour time.',
      'The requested time is {a}; use HH:MM for {label}.', 'Complete {label} with the 24-hour form of {a}.'],
    segmented: ['Set the {label} to {a}.', 'Enter {a} as the {label}.', 'Fill in the {label} with {a}.', 'Put {a} in the {label} field.',
      'Change the {label} to {a}.', 'Record {a} as the {label}.', 'Have the {label} match {a}.',
      'The {label} should be {a}.', 'I need {a} for the {label}.', 'Use {a} when filling {label}.',
      'Leave the {label} at {a}.'],
    range: ['Select the dates {a}.', 'Pick a date range {a}.', 'Choose {label} and {label2}: {a}.', 'Block out the dates {a}.',
      'Book {a}.', 'Mark the range {a}.', 'Use this range: {a}.', 'Set both dates: {a}.', 'Make the dates span {a}.',
      'Date range needed: {a}.', 'Enter dates {a}.', 'Complete this range: {a}.'],
    stay: [
      'Choose {lab} on {a}.', 'Book {a}.', 'Reserve {a}.', 'Pick the dates for {a}.', 'Select {a} in the calendar.',
      'Set up a booking: {a}.', 'Stay: {a}.', 'Plan this stay: {a}.', 'Use these stay dates: {a}.',
      'Make a reservation: {a}.', 'Set the stay to {a}.', 'Mark out {a}.', 'Arrange a stay: {a}.',
      'Booking details: {a}.', 'Dates must fit {a}.', 'The stay is {a}.'
    ],
    firstFree: ['Book {a}.', 'Find and select {a}.', 'Reserve {a}; greyed-out dates are taken.', 'Pick {a} in the calendar.',
      'Select {a}.', 'Choose {a} for this booking.', 'Set the booking to {a}.', 'Choose dates matching {a}.',
      'I need a booking for {a}.'],
    month: ['Set the {label} to {a}.', 'Pick {a} for the {label}.', 'Select {a} as the {label}.', 'Choose {a} in the {label} picker.',
      'Make the {label} {a}.', 'Change the {label} to {a}.', 'Have the {label} show {a}.', '{a} is my {label} choice.',
      'I want {a} as the {label}.', 'The {label} must be {a}.'],
    week: ['Select {a}.', 'Pick {a} in the {label} picker.', 'Choose {a} as the {label}.', 'Set the {label} to {a}.', 'Use {a} for the {label}.',
      'In the {label} picker, choose {a}.',
      'Let the {label} be {a}.',
      'Leave {a} selected.',
      'The {label} needs to be {a}.',
      'Have the {label} show {a}.',
      'Make {a} the chosen week.'],
    duration: ['Set the {label} to {a}.', 'Make the {label} {a}.', 'Change the {label} to {a}.', 'Update the {label} to {a}.',
      'Enter {a} as the {label}.', 'Adjust the {label} to {a}.', 'Ensure the {label} is {a}.', 'Use a {label} of {a}.',
      'Put {a} down for {label}.', 'I want the {label} at {a}.', 'Have {label} display {a}.', 'Let {label} equal {a}.'],
  };

  function instructionOf(specIn, rng) {
    // ambiguous / impossible: the usual wording around the judged ask; confirm: the normal goal plus a hold-back.
    const jd = specIn.judge;
    const spec = jd && jd.mode !== 'confirm' ? { ...specIn, ask: jd.ask, askKind: jd.askKind } : specIn;
    const { label, label2 } = spec.scene;
    const vars = { a: spec.ask, label: lib.I.lcFirst(label), label2: lib.I.lcFirst(label2 || ''), lab: lib.I.lcFirst(label) };
    const pick = (k) => lib.I.fill(lib.I.pick(rng, T[k], spec.isplit), vars);
    let core;
    let terse;
    let steps;
    if (spec.scenario === 'calendar') {
      core = pick('calendar');
      terse = `${label}: ${spec.ask}`;
      if (spec.askKind === 'today' && rng.bool(0.5)) core = rng.pick([`Set the ${vars.label} to today.`, `Use today's date for the ${vars.label}.`]);
      steps = [`open the ${vars.label}${/date$/.test(vars.label) ? '' : ' date'} picker`, `choose ${spec.ask}`];
    } else if (spec.scenario === 'month' || spec.scenario === 'week') {
      core = pick(spec.scenario);
      terse = `${label}: ${spec.ask}`;
      steps = [`open the ${vars.label} picker`, `choose ${spec.ask}`];
    } else if (spec.scenario === 'typed') {
      core = pick('typed');
      terse = `${label}: ${spec.ask}`;
    } else if (spec.scenario === 'segmented') {
      core = pick('segmented');
      terse = `${label}: ${spec.ask}`;
    } else if (spec.scenario === 'range') {
      const k = spec.askKind;
      core = k === 'firstFree' ? pick('firstFree') : (k === 'nights' || k === 'minStay' || k === 'maxStay' || k === 'relToday') ? pick('stay') : pick('range');
      if (k === 'fromTo' || k === 'iso') terse = `${label}–${label2}: ${spec.ask}`;
      steps = k === 'fromTo' && !jd ? [`open the date picker`, `pick ${lib.fmtDate(spec.target.start, 'long')} as the ${vars.label}`, `pick ${lib.fmtDate(spec.target.end, 'long')} as the ${vars.label2}`] : undefined;
    } else if (spec.scenario === 'duration') {
      core = pick('duration');
      terse = `${label}: ${spec.ask}`;
    } else {
      core = spec.control === 'text24' && !(jd && jd.mode === 'ambiguous') ? pick('text24') : pick('time'); // 'using 24-hour time' would settle an ambiguous 8:00
      terse = `${label} ${spec.ask}`;
    }
    if (jd && jd.mode === 'confirm') {
      core = `${core.replace(/[.!?\s]+$/, '')}, but check with me before you submit.`;
      if (steps) steps = [...steps, 'check with me before submitting'];
      if (terse) terse = `${terse}; ask me before submitting`;
    }
    return lib.I.say(rng, lib.I.ucFirst(core), { isplit: spec.isplit, terse, steps });
  }

  Object.assign(lib, { instructionOf });
})();
