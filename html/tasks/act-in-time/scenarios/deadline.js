/*
 * act-in-time / deadline: act inside a window (M7).
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('act-in-time');
  const I = env.instruct;
  const { clone } = env.util;
  const { act, deadlineOver, deadlineReady, sec1, snap, toleranceOpen } = fam.lib;

  const DEADLINE_OFFERS = [
    { title: 'Flash sale: 20% off your cart', text: 'Applies to everything in your basket.', go: 'Claim 20% off', no: 'No thanks' },
    { title: 'Free shipping unlocked', text: 'On this order only.', go: 'Use free shipping', no: 'Skip' },
    { title: 'Upgrade to Plus: 3 months free', text: 'Cancel any time.', go: 'Start free months', no: 'Not now' },
    { title: 'Webinar starts soon: seats left', text: 'Join the live session.', go: 'Reserve my seat', no: 'Dismiss' },
    { title: 'Your coupon is ready', text: 'Code SAVE15 expires shortly.', go: 'Apply coupon', no: 'Close' },
    { title: 'Price drop on your wishlist item', text: 'The lower price is held briefly.', go: 'Buy at the new price', no: 'Not interested' },
    { title: 'Gift wrap at no extra charge', text: 'Get a festive parcel wrap.', go: 'Add gift wrap', no: 'No thanks' },
    { title: 'A bonus pattern pack is yours', text: 'Add designs to your library.', go: 'Get pattern pack', no: 'Skip' },
    { title: 'More storage for saved files', text: 'More room to store files.', go: 'Boost storage', no: 'Not now' },
    { title: 'Early access: puzzle set', text: 'Try the new puzzles today.', go: 'Unlock puzzles', no: 'Dismiss' },
    { title: 'Unlock the audio sampler', text: 'Add clips to your playlist.', go: 'Get audio sampler', no: 'Close' },
    { title: 'A custom profile frame awaits', text: 'Give your avatar a border.', go: 'Use profile frame', no: 'Not interested' },
    { title: 'Double points this visit', text: 'Boost your reward tally.', go: 'Double my points', no: 'No thanks' },
    { title: 'Keep your rental one more day', text: 'An extra day at no cost.', go: 'Extend my rental', no: 'Skip' },
    { title: 'Your free recipe card is ready', text: 'Save a new dish to try.', go: 'Save recipe card', no: 'Not now' },
    { title: 'Add a guest to your game room', text: 'One extra player can join.', go: 'Add guest spot', no: 'Dismiss' },
    { title: 'A private workspace is ready', text: 'A space just for your work.', go: 'Enable workspace', no: 'Close' },
    { title: 'Offline mode is free today', text: 'Work without a connection.', go: 'Turn on offline mode', no: 'Not interested' },
    { title: 'A bookmark for your book', text: 'Tuck a marker in your book.', go: 'Add my bookmark', no: 'No thanks' },
    { title: 'Keep your streak going today', text: 'A free pass for this day.', go: 'Protect my streak', no: 'Not now' },
    { title: 'Save a replay for your group', text: 'Keep a session recording.', go: 'Keep the replay', no: 'Dismiss' },
    { title: 'Sort your notes with smart tags', text: 'Group all your related notes.', go: 'Organize my notes', no: 'Close' },
    { title: 'A mystery prize is waiting', text: 'Reveal a surprise gift.', go: 'Reveal my prize', no: 'Not interested' },
  ];
  const DEADLINE_SLOTS = ['08:00-10:00', '10:00-12:00', '12:00-14:00', '14:00-16:00', '16:00-18:00', '18:00-20:00'];

  // The content (an offer, a list of slots) shows up at `ready` and is gone at ready + window. Clicking the
  // placeholder before it is ready is a mistake, and so is letting the window pass.
  function sampleDeadline(rng, beat, o) {
    const lv = o.lv || 0;
    const kind = rng.pick(['offer', 'offer', 'slot']);
    const ready = snap(rng.float(1.5, 3.5) * beat);
    const window = snap(rng.float(3 + 1.5 * lv, 4.5 + 2 * lv) * beat);
    if (kind === 'offer') {
      const d = rng.pick(DEADLINE_OFFERS);
      const buttons = rng.bool() ? [{ key: 'go', label: d.go }, { key: 'x0', label: d.no }] : [{ key: 'x0', label: d.no }, { key: 'go', label: d.go }];
      return { kind, title: d.title, text: d.text, goLabel: d.go, ready, window, buttons: lv >= 1 ? buttons.filter((b) => b.key === 'go') : buttons };
    }
    const k = o.ood ? 6 : Math.round(4 - 1 * lv);
    const labels = rng.sample(DEADLINE_SLOTS, k).sort();
    const goAt = rng.int(0, k - 1);
    const buttons = labels.map((label, i) => ({ key: i === goAt ? 'go' : `x${i}`, label }));
    return { kind, title: 'Pick a delivery slot', text: 'Slots are held for you only briefly.', goLabel: labels[goAt], ready, window, buttons };
  }

  const deadlineGood = (model, spec) => model.clicks.some((c) => c.key === 'go' && deadlineReady(spec, c.t) && !deadlineOver(spec, c.t));
  function deadlineBad(model, spec) {
    for (const c of model.clicks) {
      if (!deadlineReady(spec, c.t)) return 'early-click';
      if (c.key !== 'go') return 'wrong-click';
    }
    return null;
  }

  const T_OFFER = ['Claim the offer ("{go}") before it expires.', 'A limited-time offer is about to appear: click "{go}" while it lasts.',
    'Press "{go}" once the offer is available, and before it times out.', 'Take the deal: "{go}". It only stays for a short while.',
    'Click "{go}" as soon as it shows up; the offer does not last.', 'Use the limited offer by pressing "{go}" before it disappears.',
    'The offer has a short life; click "{go}" during that window.',
    'To accept the offer in time, press "{go}" when it appears.',
    'With the offer on screen, click "{go}" before it ends.',
    'Only a brief window is available to press "{go}" for the offer.',
    'For this offer, press "{go}" between its arrival and expiry.',
    'Your chance to use "{go}" ends with the offer; click in time.'];
  const T_SLOT = ['Book the {go} slot before the hold runs out.', 'Take the {go} delivery slot once the slots show up, before they are released.',
    'Choose the {go} slot while it is still held for you.', 'Reserve {go}: the slots only stay available briefly.',
    'Pick the {go} time window before the slots expire.', 'Grab the {go} delivery window once it is offered, and do not wait too long.',
    'For delivery, choose {go} during the temporary slot hold.',
    'Make {go} your delivery slot during its brief availability.',
    'With slots on screen, reserve {go} before the hold lapses.',
    'The slot list is temporary: secure {go} while it is open.',
    'For the brief time slots are offered, choose the {go} window.'];

  const ABSENT_SLOTS = ['06:00-08:00', '20:00-22:00', '21:00-23:00'];

  env.scenario('act-in-time', {
    name: 'deadline',
    sample: sampleDeadline,
    start() {
      return { t: 0, clicks: [] };
    },
    error: (model, spec) => deadlineGood(model, spec) && !deadlineBad(model, spec) ? 0 : 1,
    endedBy(model, spec) {
      const t = model.t;
      return deadlineBad(model, spec) || (!deadlineGood(model, spec) && deadlineOver(spec, t) ? 'expired' : null);
    },
    tolerance: toleranceOpen,
    act(model, spec, ev, m, t) {
      if (ev.button !== undefined && !deadlineOver(spec, t) && !deadlineBad(m, spec)) m.clicks.push({ key: ev.button, t });
    },
    simulate(m, spec, step, c) {
      if (c.button) m = act(m, spec, { button: c.button });
      return m;
    },
    plan(model, spec) {
      const t = model.t;
      if (deadlineGood(model, spec)) return null;
      return deadlineReady(spec, t) ? { click: { button: 'go' } } : { wait: true };
    },
    solveBy(spec, model, m) {
      return { ...m, t: Math.max(m.t, spec.ready), clicks: [{ key: 'go', t: Math.max(m.t, spec.ready) }] };
    },
    phrase(spec, rng, pick, say) {
      return say(I.fill(pick(spec.kind === 'slot' ? T_SLOT : T_OFFER), { go: spec.goLabel }), { terse: `${spec.goLabel} in time` });
    },
    judgeAsk(jr, spec, mk, cant) {
      if (spec.kind === 'slot') {
        const go = jr.pick(ABSENT_SLOTS);
        return mk(go, T_SLOT, { go }, cant(`there is no ${go} slot, the list does not offer it`));
      }
      const go = jr.pick(DEADLINE_OFFERS.map((d) => d.go).filter((g) => g !== spec.goLabel));
      return mk(go, T_OFFER, { go }, cant(`there is no "${go}" button on this offer`));
    },
    factRows(model, spec, f) {
      const c = model.clicks.find((x) => x.key === 'go' && deadlineReady(spec, x.t) && !deadlineOver(spec, x.t));
      if (!c) return [];
      return [f('Status', spec.kind === 'slot' ? 'Slot booked' : 'Offer claimed', ['State', 'Result']),
        f('Time to spare', `${sec1(spec.ready + spec.window - c.t)} s`, ['Time left', 'Seconds left']),
        f(spec.kind === 'slot' ? 'Slots' : 'Offer', spec.title, ['Title', 'Heading'])];
    },
    silentEdit(next, prev, spec, rng, m, out) {
      const beat = spec.beat;
      // The claim click was lost; the window must still be open one beat later.
      if (!(deadlineGood(next, spec) && !deadlineGood(prev, spec)) || next.t + beat >= spec.ready + spec.window - 1e-9) return null;
      m.clicks = clone(prev.clicks);
      return out(m);
    },
    retargetEdit(spec, model, rng, base, good) {
      const beat = spec.beat;
      // slot: another slot is the one to book (nothing booked yet, time left for it)
      if (spec.kind !== 'slot' || model.clicks.length || model.t + 2 * beat > spec.ready + spec.window - 1e-9) return null;
      const alt = spec.buttons.filter((b) => b.key !== 'go');
      if (!alt.length) return null;
      const pick = rng.pick(alt);
      const buttons = spec.buttons.map((b) => (b.key === 'go' ? { ...b, key: pick.key } : b === pick ? { ...b, key: 'go' } : { ...b }));
      return good({ ...base, buttons, goLabel: pick.label });
    },
  });
})();
