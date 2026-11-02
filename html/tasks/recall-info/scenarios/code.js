/* recall-info/scenarios/code.js: sampling, model, scoring, instructions and oracle for code. */
(function () {
  'use strict';
  const { C, I, near, textErr, sameText } = env.taskOf('recall-info').lib;

  const CODE_FLOWS = [
    { noun: 'callback request', title: 'Request a callback', codeLabel: 'Reference code', done: 'Request confirmed', first: 'Request received', lead: 'Thanks, we have your callback request.' },
    { noun: 'warranty claim', title: 'Warranty claim', codeLabel: 'Claim number', done: 'Claim confirmed', first: 'Claim registered', lead: 'Your claim has been registered.' },
    { noun: 'device registration', title: 'Register your device', codeLabel: 'Registration key', done: 'Device registered', first: 'Registration started', lead: 'We have opened a registration for your device.' },
    { noun: 'redelivery booking', title: 'Rebook a delivery', codeLabel: 'Redelivery code', done: 'Delivery rebooked', first: 'Booking opened', lead: 'We are ready to rebook your parcel.' },
    { noun: 'appointment booking', title: 'Book an appointment', codeLabel: 'Booking reference', done: 'Appointment booked', first: 'Slot reserved', lead: 'We have reserved a slot for you.' },
    { noun: 'account recovery', title: 'Recover your account', codeLabel: 'Security code', done: 'Account recovered', first: 'Recovery started', lead: 'A recovery case has been opened for your account.' },
    { noun: 'equipment checkout', title: 'Check out equipment', codeLabel: 'Checkout code', done: 'Checkout confirmed', first: 'Loan request opened', lead: 'We have opened your equipment loan.' },
    { noun: 'catalogue request', title: 'Request a catalogue', codeLabel: 'Catalogue code', done: 'Catalogue ordered', first: 'Request logged', lead: 'Your catalogue request has been received.' },
    { noun: 'membership renewal', title: 'Renew a membership', codeLabel: 'Renewal reference', done: 'Membership renewed', first: 'Renewal pending', lead: 'We are ready to renew your membership.' },
    { noun: 'workspace creation', title: 'Create a workspace', codeLabel: 'Setup reference', done: 'Workspace created', first: 'Setup started', lead: 'Your new workspace is ready for setup.' },
    { noun: 'repair arrangement', title: 'Arrange a repair', codeLabel: 'Repair reference', done: 'Repair plan agreed', first: 'Repair case opened', lead: 'Your repair arrangement is underway.' },
    { noun: 'parcel collection', title: 'Arrange collection', codeLabel: 'Collection code', done: 'Pickup arranged', first: 'Parcel located', lead: 'We have started your collection request.' },
    { noun: 'document request', title: 'Request a document', codeLabel: 'Order reference', done: 'Document requested', first: 'Document case opened', lead: 'Your document request is now in progress.' },
    { noun: 'course transfer', title: 'Request a transfer', codeLabel: 'Transfer code', done: 'Transfer complete', first: 'Transfer pending', lead: 'Your course transfer request is open.' },
    { noun: 'access application', title: 'Apply for access', codeLabel: 'Application code', done: 'Access authorized', first: 'Application opened', lead: 'We are ready to handle your access request.' },
    { noun: 'address update', title: 'Update your address', codeLabel: 'Change reference', done: 'Address updated', first: 'Change request open', lead: 'Your address update is now in progress.' },
    { noun: 'subscription pause', title: 'Pause a subscription', codeLabel: 'Pause reference', done: 'Pause confirmed', first: 'Pause requested', lead: 'We are ready to pause your subscription.' },
    { noun: 'feedback submission', title: 'Send us feedback', codeLabel: 'Feedback number', done: 'Feedback recorded', first: 'Feedback received', lead: 'Your feedback is now ready to record.' },
    { noun: 'workshop enrolment', title: 'Join a workshop', codeLabel: 'Enrolment key', done: 'Enrolment complete', first: 'Enrolment started', lead: 'We have started your workshop enrolment.' },
    { noun: 'lost item report', title: 'Report a lost item', codeLabel: 'Report reference', done: 'Report confirmed', first: 'Report pending', lead: 'Your lost item report is now open.' },
    { noun: 'data export request', title: 'Export your data', codeLabel: 'Export number', done: 'Export completed', first: 'Export requested', lead: 'Your data export request is underway.' },
    { noun: 'product exchange', title: 'Arrange an exchange', codeLabel: 'Exchange number', done: 'Exchange confirmed', first: 'Exchange requested', lead: 'We are ready to arrange your item exchange.' },
    { noun: 'project handover', title: 'Hand over a project', codeLabel: 'Handover number', done: 'Handover complete', first: 'Handover pending', lead: 'Your project handover is ready to begin.' },
    { noun: 'visitor invitation', title: 'Invite your guest', codeLabel: 'Invitation code', done: 'Invitation issued', first: 'Invitation drafted', lead: 'We have started your visitor invitation.' },
  ];
  const MID = [
    { title: 'Contact preference', kind: 'choice', options: ['Email', 'Phone call', 'Text message'], lead: 'How should we reach you about this?' },
    { title: 'Opening hours', kind: 'info' },
    { title: 'Privacy notice', kind: 'ack', ack: 'I have read the privacy notice' },
    { title: 'Preferred language', kind: 'choice', options: ['English', 'Español', 'Deutsch', 'Français'], lead: 'Pick the language for our messages.' },
    { title: 'Terms of service', kind: 'ack', ack: 'I accept the terms of service' },
    { title: 'What happens next', kind: 'info' },
    { title: 'Fees and charges', kind: 'info' },
    { title: 'Service window', kind: 'choice', options: ['Morning', 'Afternoon', 'Evening'], lead: 'When are you usually available?' },
    { title: 'Data sharing', kind: 'ack', ack: 'I agree to share my details with the service team' },
    { title: 'Before you continue', kind: 'info' },
    { title: 'Service overview', kind: 'info' },
    { title: 'Help and support', kind: 'info' },
    { title: 'Accessible service', kind: 'info' },
    { title: 'Record keeping', kind: 'info' },
    { title: 'Response times', kind: 'info' },
    { title: 'Your part in this', kind: 'info' },
    { title: 'Handling delays', kind: 'info' },
    { title: 'Common questions', kind: 'info' },
    { title: 'Acceptable use', kind: 'ack', ack: 'I agree to use this service responsibly' },
    { title: 'Accuracy statement', kind: 'ack', ack: 'I confirm that my details are correct' },
    { title: 'Retention policy', kind: 'ack', ack: 'I understand how records are kept' },
    { title: 'Message consent', kind: 'ack', ack: 'I agree to receive service updates' },
    { title: 'Service limits', kind: 'ack', ack: 'I understand the service limits' },
    { title: 'Authority to act', kind: 'ack', ack: 'I am entitled to proceed with this request' },
    { title: 'Message appearance', kind: 'choice', options: ['Plain', 'Styled', 'Condensed', 'Spaced'], lead: 'How should we lay out our messages?' },
    { title: 'Message text size', kind: 'choice', options: ['Regular', 'Large text', 'Extra large'], lead: 'Pick a size for the message text.' },
    { title: 'Level of detail', kind: 'choice', options: ['Short notes', 'Full detail', 'Key points'], lead: 'How much detail do you prefer?' },
    { title: 'Greeting style', kind: 'choice', options: ['Neutral', 'Friendly', 'Formal', 'Casual'], lead: 'Choose the tone for our greetings.' },
    { title: 'Text alignment', kind: 'choice', options: ['Left', 'Center', 'Right'], lead: 'Where should we align message text?' },
    { title: 'Date presentation', kind: 'choice', options: ['Day first', 'Month first', 'Year first'], lead: 'How should dates look in a message?' },
    { title: 'Progress tracking', kind: 'info' },
    { title: 'Session security', kind: 'info' },
    { title: 'Leaving feedback', kind: 'info' },
    { title: 'Service standards', kind: 'info' },
    { title: 'Automation notice', kind: 'ack', ack: 'I accept automated processing' },
    { title: 'Review stages', kind: 'ack', ack: 'I understand how service requests are reviewed' },
    { title: 'Duplicate requests', kind: 'ack', ack: 'I accept how repeat requests are handled' },
    { title: 'List format', kind: 'choice', options: ['Bulleted', 'Numbers', 'Plain lines'], lead: 'How should lists look in messages?' },
  ];

  function genCode(r) {
    switch (r.int(0, 3)) {
      case 0: return `${C.letters(r, 2)}-${C.digits(r, 5)}`;
      case 1: return `${C.alnum(r, 4)}-${C.alnum(r, 4)}`;
      case 2: return `${C.digits(r, 3)}-${C.digits(r, 4)}`;
      default: return `${C.letters(r, 3)}${C.digits(r, 4)}`;
    }
  }

  function sampleCode(rng, spec, opts) {
    const fr = rng.fork('flow');
    const fl = fr.pick(CODE_FLOWS);
    const N = spec.ood ? fr.int(7, 8) : opts.level === 'easy' ? 4 : opts.level === 'medium' ? 5 : fr.int(5, 6);
    let mids = fr.shuffle(MID).slice(0, N - 2);
    if (!mids.some((m) => m.kind === 'ack')) mids[mids.length - 1] = fr.pick(MID.filter((m) => m.kind === 'ack'));
    mids = mids.filter((m, i) => mids.findIndex((x) => x.title === m.title) === i);
    while (mids.length < N - 2) mids.push(fr.pick(MID.filter((m) => !mids.some((x) => x.title === m.title))));
    const code = genCode(rng.fork('code'));
    const br = rng.fork('body');
    spec.flow = fl.noun;
    spec.title = fl.title;
    spec.codeLabel = fl.codeLabel;
    spec.code = code;
    spec.steps = [
      { title: fl.first, kind: 'show', body: fl.lead },
      ...mids.map((m, i) => ({ title: m.title, kind: m.kind, options: m.options || null, ack: m.ack || null,
        body: m.lead && m.kind === 'choice' ? m.lead : C.paragraph(br.fork(`m${i}`), br.int(1, 2), { domain: m.kind === 'ack' ? 'policy' : 'howto' }) })),
      { title: 'Confirm your details', kind: 'verify', body: `Enter the ${fl.codeLabel.toLowerCase()} you were given at the start to finish.` },
    ];
    spec.back = fr.pick(['back', 'restart']);
    spec.labels = {
      next: fr.pick(['Next', 'Continue', 'Next step', 'Proceed', 'Forward', 'Advance']),
      back: fr.pick(['Back', 'Previous']),
      restart: fr.pick(['Start over', 'Cancel and restart']),
      confirm: fr.pick([`Confirm ${fl.noun}`, 'Verify code', `Complete ${fl.noun}`]),
      reopen: fr.pick(['Change code', 'Edit', 'Enter again', 'Correct it', 'Reopen']),
      done: fl.done,
    };
  }

  const codeLast = (spec) => spec.steps.length - 1;
  const stepOk = (m, spec) => spec.steps[m.step].kind !== 'ack' || !!m.acks[m.step];
  const codeOf = (m) => (m.confirmed ? m.saved : m.entered);

  function codeApply(m, spec, act) {
    const L = codeLast(spec);
    const n = { ...m, acks: { ...m.acks }, choice: { ...m.choice } };
    if (act.ack !== undefined) {
      if (act.ack !== m.step || spec.steps[m.step].kind !== 'ack') return m;
      n.acks[act.ack] = act.v === undefined ? !m.acks[act.ack] : !!act.v;
      return n;
    }
    if (act.choose) { n.choice[act.choose[0]] = act.choose[1]; return n; }
    if (act.type !== undefined) {
      if (m.step !== L || m.confirmed) return m;
      n.entered = String(act.type);
      return n;
    }
    if (act.next) {
      if (m.step >= L || !stepOk(m, spec)) return m;
      n.step += 1;
      return n;
    }
    if (act.back) {
      if (spec.back !== 'back' || m.step <= 0 || m.confirmed) return m;
      n.step -= 1;
      return n;
    }
    if (act.restart) {
      if (spec.back !== 'restart' || m.step <= 0 || m.confirmed) return m;
      return { ...m, step: 0, acks: {}, choice: defaultChoices(spec), entered: '' };
    }
    if (act.confirm) {
      if (m.step !== L || m.confirmed) return m;
      n.confirmed = true;
      n.saved = m.entered;
      return n;
    }
    if (act.reopen) {
      if (!m.confirmed) return m;
      n.confirmed = false;
      return n;
    }
    return m;
  }

  const defaultChoices = (spec) => {
    const c = {};
    spec.steps.forEach((s, i) => { if (s.kind === 'choice') c[i] = 0; });
    return c;
  };

  function codeError(m, spec) {
    const L = codeLast(spec);
    const cerr = textErr(codeOf(m), spec.code);
    return 0.4 * ((L - m.step) / L) + 0.4 * cerr + 0.2 * (m.confirmed ? 0 : 1);
  }

  function codeInit(spec, rng) {
    const L = codeLast(spec);
    const m = { step: 0, acks: {}, choice: defaultChoices(spec), entered: '', saved: null, confirmed: false };
    if (spec.startMode === 'partial') {
      m.step = rng.int(1, Math.max(1, L - 1));
      spec.steps.forEach((s, i) => { if (i < m.step && s.kind === 'ack') m.acks[i] = true; });
    } else if (spec.startMode === 'wrong') {
      m.step = L;
      spec.steps.forEach((s, i) => { if (s.kind === 'ack') m.acks[i] = true; });
      m.entered = near(rng, spec.code);
      if (rng.bool(0.5)) { m.confirmed = true; m.saved = m.entered; }
    }
    return m;
  }

  function codePlan(m, spec) {
    if (m.confirmed) return textErr(m.saved, spec.code) > 0 ? { click: { nav: 'reopen' } } : null;
    if (m.step < codeLast(spec)) {
      if (spec.steps[m.step].kind === 'ack' && !m.acks[m.step]) return { click: { ack: m.step } };
      return { click: { nav: 'next' } };
    }
    if (!sameText(m.entered, spec.code)) return { type: [{ field: true }, spec.code] };
    return { click: { nav: 'confirm' } };
  }

  function codeEffect(m, spec, step) {
    if (step.type) return codeApply(m, spec, { type: step.type[1] });
    const t = step.click;
    if (t.ack !== undefined) return codeApply(m, spec, { ack: t.ack, v: true });
    return codeApply(m, spec, { [t.nav]: true });
  }

  function codeInstruction(spec, rng) {
    const v = { noun: spec.flow, code: spec.codeLabel.toLowerCase() };
    const core = I.fill(I.pick(rng, [
      'Go through the {noun}. The {code} shown on its first page is asked for on the last step: enter it there and confirm.',
      'Work through the {noun} to the last step and confirm it with the {code} from the first page.',
      'Finish the {noun}: you will need the {code} that appears on its first page.',
      'Complete the {noun} (accept whatever has to be accepted on the way) and enter the {code} from page one at the end.',
      'Click through the {noun} to the final step and verify it with the {code} you were given at the start.',
      'Take the {noun} all the way through. Remember the {code} from the first page and type it on the last one.',
      'Use the {code} from the first page to finish the {noun}: enter it on the final step and then confirm.',
      'The {noun} ends with a code check. Enter the {code} from the very first page there and confirm.',
      'The first page supplies the {code} for the {noun}. Enter it at the last step and confirm completion.',
    ], spec.isplit), v);
    const steps = [`read the ${v.code} on the first page`, `go through the ${v.noun}`, `enter the ${v.code} on the last step and confirm`];
    const terse = `${v.noun}: ${v.code} from first page, enter it at the end, confirm`;
    return I.say(rng, core, { isplit: spec.isplit, terse, steps });
  }

  env.scenario('recall-info', {
    name: 'code',
    sample: sampleCode,
    init: codeInit,
    error: codeError,
    plan: codePlan,
    apply: codeApply,
    effect: codeEffect,
    instruction: codeInstruction,
    solve(spec, model) {
      const acks = {};
      spec.steps.forEach((s, i) => { if (s.kind === 'ack') acks[i] = true; });
      return { ...model, step: codeLast(spec), acks, entered: spec.code, saved: spec.code, confirmed: true };
    },
  });
})();
