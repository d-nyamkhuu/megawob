/*
 * act-in-time / toast: a sign-in check.
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('act-in-time');
  const C = env.content;
  const I = env.instruct;
  const { ABSENT_CONTROLS, limit, nd, round3, snap } = fam.lib;

  function sampleToast(rng, beat, o) {
    const len = o.ood ? rng.int(7, 8) : rng.pick([4, 6, 6, 5]);
    let code = C.digits(rng, len);
    if (/^(\d)\1+$/.test(code)) code = code.slice(0, -1) + ((Number(code[0]) + 3) % 10);
    const channel = rng.pick(['SMS', 'SMS', 'email', 'authenticator']);
    const dest = channel === 'email' ? `${rng.pick(['n', 'j', 'm', 'a', 'k'])}•••@${rng.pick(['quillpost.com', 'mailharbor.net', 'inbox.example'])}`
      : `•••• ${C.digits(rng, 2)}${rng.int(10, 99)}`;
    const delay = rng.pick([0, 0, snap(0.4 * beat)]);
    const ttl = snap((o.ood ? rng.float(1.4, 1.8) : rng.float(2, 3.2)) * beat);
    return { code, channel, dest, delay, ttl };
  }

  const T_TOAST = ['Request a sign-in code and enter it to verify.', 'Get the one-time code sent by {channel} and type it on the keypad, then verify.',
    'Send yourself a verification code, enter it and confirm.', 'Verify this sign-in with the code from the notification.',
    'Have the code sent, then enter the digits it shows and press Verify.', 'Complete the two-step check using the code that pops up.',
    'To verify, request a sign-in code and copy it onto the keypad.',
    'After requesting a code, enter it on the keypad and verify.',
    'Get a code first, then use the keypad to enter it and verify.'];

  env.scenario('act-in-time', {
    name: 'toast',
    sample: sampleToast,
    level(spec, lv, r, keep) {
      const beat = spec.beat;
      spec.code = spec.code.slice(0, keep(4, 5));
      spec.ttl = snap(spec.ttl + 2 * beat * lv);
    },
    start(spec) {
      const mode = spec.startMode;
      const m = { t: 0, sent: null, digits: '', verified: false, failed: false, strikes: 0 };
      if (mode === 'partial') m.sent = 0;
      if (mode === 'wrong') m.digits = spec.code.split('').reverse().join('').slice(0, Math.max(2, spec.code.length - 2)).replace(/^./, (d) => String((Number(d) + 5) % 10));
      return m;
    },
    error(model, spec) {
      if (model.verified) return 0;
      if (model.sent === null) return 1;
      return round3(0.25 + 0.65 * nd(model.digits, spec.code));
    },
    endedBy: (model, spec) => model.strikes >= limit(spec) ? 'bad-code' : null,
    act(model, spec, ev, m, t) {
      if (m.verified) return;
      if (ev.send) m.sent = t;
      else if (ev.key === 'back') { m.digits = m.digits.slice(0, -1); m.failed = false; }
      else if (ev.key !== undefined) { if (m.digits.length < spec.code.length) m.digits += ev.key; m.failed = false; }
      else if (ev.verify && m.digits.length === spec.code.length) {
        if (m.digits === spec.code) m.verified = true;
        else { m.strikes += 1; m.failed = true; }
      }
    },
    plan(model, spec) {
      const t = model.t;
      if (model.verified) return null;
      if (model.sent === null) return { click: { send: true } };
      if (t < model.sent + spec.delay - 1e-9) return { wait: true };
      const d = model.digits;
      if (!spec.code.startsWith(d)) return { click: { key: 'back' } };
      if (d.length < spec.code.length) return { click: { key: spec.code[d.length] } };
      return { click: { verify: true } };
    },
    solveBy(spec, model, m) {
      return { ...m, sent: m.sent === null ? -spec.ttl - spec.delay : m.sent, digits: spec.code, verified: true, failed: false, strikes: 0 };
    },
    phrase(spec, rng, pick, say) {
      return say(I.fill(pick(T_TOAST), { channel: spec.channel === 'email' ? 'email' : spec.channel === 'SMS' ? 'text message' : 'the app' }),
      { steps: ['send the code', 'type the digits from the notification', 'verify'] });
    },
    judgeAsk(jr, spec, mk, cant) {
      const what = jr.pick(ABSENT_CONTROLS.toast);
      return mk(what, ['Get the sign-in code with {what} and enter it to verify.', 'Choose {what} to receive the code, then type it on the keypad and verify.',
        'Use {what} to get a code, then enter it and confirm.',
        'Verify with a code obtained via {what} and typed on the keypad.',
        'Obtain a code via {what}. Enter it on the keypad and verify.'], { what }, cant('there is no such option, only "Send code"'));
    },
    factRows(model, spec, f) {
      return !model.verified ? [] : [f('Status', 'Verified', ['State']), f('Code entered', model.digits, ['Code', 'Verification code']),
      f('Code sent to', spec.channel === 'authenticator' ? 'your authenticator app' : spec.dest, ['Sent to', 'Destination'])];
    },
    silentEdit(next, prev, spec, rng, m, out) {
      const opts = [];
      if (next.verified && !prev.verified) opts.push('verify');
      if (!next.verified && next.digits.length > prev.digits.length) opts.push('digit');
      if (next.sent !== null && prev.sent === null) opts.push('send');
      if (!opts.length) return null;
      const w = rng.pick(opts);
      if (w === 'verify') Object.assign(m, { verified: false, failed: false });
      else if (w === 'digit') m.digits = next.digits.slice(0, -1);
      else m.sent = null;
      return out(m);
    },
  });
})();
