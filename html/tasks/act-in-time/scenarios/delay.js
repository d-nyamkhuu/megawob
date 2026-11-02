/*
 * act-in-time / delay: button-delay.
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('act-in-time');
  const I = env.instruct;
  const { delayReady, Q, round2, round3, secs, snap, tolerance } = fam.lib;

  const DELAY_CTX = [
    { label: 'Download', title: 'Your file is being prepared', text: 'report-2024.pdf · 2.4 MB' },
    { label: 'Continue', title: 'Checking your connection', text: 'This only takes a moment.' },
    { label: 'Start', title: 'Loading the exercise', text: 'Make sure your sound is on.' },
    { label: 'Join call', title: 'Connecting to the room', text: 'Weekly sync · 6 participants' },
    { label: 'Claim', title: 'Verifying your reward', text: 'Bonus points: 250' },
    { label: 'Next', title: 'Saving your answers', text: 'Step 2 of 3' },
    { label: 'Open', title: 'Unpacking the archive', text: 'photos.zip · 48 files' },
    { label: 'Install', title: 'Downloading the update', text: 'Version 4.2.1 · 38 MB' },
    { label: 'Pay now', title: 'Securing the payment form', text: 'Order total: $84.20' },
    { label: 'View results', title: 'Grading your quiz', text: '12 questions answered' },
    { label: 'Play audio', title: 'Buffering the audio', text: 'Evening rain · 04:12' },
    { label: 'Print', title: 'Preparing the print job', text: '6 pages · Letter size' },
    { label: 'Export', title: 'Converting your table', text: '8 columns · 120 rows' },
    { label: 'Save copy', title: 'Duplicating the document', text: 'Draft · 18 pages' },
    { label: 'Send', title: 'Checking the attachment', text: 'trail-map.png · 860 KB' },
    { label: 'Reserve', title: 'Checking seat availability', text: 'Seats: 2 · Total: $18.00' },
    { label: 'Rate it', title: 'Preparing your rating', text: 'Your rating: 4 of 5' },
    { label: 'Vote now', title: 'Checking the ballot', text: 'Choice: Lantern' },
    { label: 'Shuffle', title: 'Loading the playlist', text: 'Weekend mix · 16 tracks' },
    { label: 'Preview', title: 'Rendering the preview', text: 'poster-draft.png · 1.8 MB' },
    { label: 'Compare', title: 'Matching the two versions', text: 'Draft A and B · 6 changes' },
    { label: 'Restore', title: 'Checking the backup', text: 'Snapshot 8 · 14 folders' },
    { label: 'Translate', title: 'Preparing the translation', text: 'From French to English' },
    { label: 'Sync', title: 'Connecting your devices', text: '3 notebooks · 46 entries' },
    { label: 'Pair', title: 'Finding your device', text: 'Desk speaker · Nearby' },
    { label: 'Publish', title: 'Preparing your post', text: 'Garden journal · Draft' },
    { label: 'Run scan', title: 'Loading the scan tools', text: 'Selected folder: Projects' },
    { label: 'Navigate', title: 'Calculating the route', text: 'Art studio · 2.8 km' },
    { label: 'Crop', title: 'Loading your image', text: 'landscape.jpg · 1.2 MB' },
    { label: 'Merge files', title: 'Checking the files', text: '3 files · 24 pages' },
    { label: 'Find', title: 'Indexing the library', text: 'Search term: oak trees' },
    { label: 'Record', title: 'Checking audio input', text: 'Input: Desk microphone' },
    { label: 'Bookmark', title: 'Loading the page summary', text: 'A guide to paper folding' },
    { label: 'Follow', title: 'Loading the channel', text: 'Pottery club · 82 posts' },
    { label: 'Unlink', title: 'Checking the linked account', text: 'Connected: Guest profile' },
    { label: 'Check in', title: 'Retrieving your booking', text: 'Studio tour · 2 visitors' },
    { label: 'Sort', title: 'Reading the table headings', text: 'Order: Oldest first' },
  ];
  const DISTRACT = [
    'Cancel', 'Back', 'Help', 'Later', 'Settings', 'Skip', 'Details', 'Pause', 'Mute', 'Layout', 'About', 'Privacy',
    'Menu', 'Notepad', 'Zoom', 'Theme', 'Terms', 'Hide'
  ];

  function sampleDelay(rng, beat, o) {
    const mode = rng.pick(['enable', 'appear', 'interval']);
    const spot = (taken) => {
      for (let tries = 0; tries < 200; tries++) {
        const p = { x: round3(rng.float(0, 1)), y: round3(rng.float(0, 1)) };
        if (taken.every((q) => Math.abs(q.x - p.x) > 0.4 || Math.abs(q.y - p.y) > 0.45)) return p;
      }
      return { x: taken.length % 2, y: (taken.length >> 1) % 2 };
    };
    if (mode === 'interval') {
      // A 3-beat "get ready" phase (buttons inactive) comes first, so an overlay shown in the first
      // steps of the episode is dismissed before the timing starts. A partial start (ONE already pressed
      // at t = 0) has no such phase and waits at least 4 beats instead.
      const partial = o.startMode === 'partial';
      const wait = o.ood ? rng.int(5, 6) : partial ? 4 : rng.int(1, 4);
      const a = spot([]);
      const b = spot([a]);
      return { mode, wait, waitMs: wait * beat, ready: partial ? 0 : 3 * beat,
        buttons: [{ key: 'one', label: 'ONE', ...a }, { key: 'two', label: 'TWO', ...b }] };
    }
    const ctx = rng.pick(DELAY_CTX);
    const nd = rng.int(0, 2);
    const labels = rng.sample(DISTRACT, nd);
    const keys = rng.shuffle(['go'].concat(labels.map((_, i) => `x${i}`)));
    const buttons = keys.map((key) => ({ key, label: key === 'go' ? ctx.label : labels[Number(key.slice(1))] }));
    const delay = snap((o.ood ? rng.float(5, 8) : rng.float(1.3, 4.7)) * beat);
    return { mode, delay, label: ctx.label, context: { title: ctx.title, text: ctx.text }, buttons };
  }

  function delayWrong(model, spec) {
    const c = model.clicks;
    if (spec.mode !== 'interval') return c.some((x) => x.key !== 'go' || !delayReady(spec, x.t));
    if (!c.length) return false;
    if (c[0].key !== 'one') return true;
    if (c.length > 1 && c[1].key !== 'two') return true;
    return c.length > 2;
  }
  function intervalErr(model, spec) {
    const c = model.clicks;
    return Math.min(1, Math.abs(c[1].t - c[0].t - spec.waitMs) / spec.waitMs);
  }

  const T_ENABLE = ['Wait until the {L} button becomes active, then click it.', 'Click {L} as soon as it is enabled (not before).',
    'The {L} button is not ready yet. Click it once it is.', 'When {L} stops being greyed out, click it.',
    'Hold on until {L} can be clicked, then press it.', 'Press {L} after it becomes available.',
    'Only click {L} when its disabled state clears.', 'Let {L} become active before you press it.',
    'Your cue to click {L} is the button turning active.'];
  const T_APPEAR = ['Wait for the {L} button to appear, then click it.', 'Click {L} once it shows up.',
    'A {L} button will load in a moment. Click it when it does.', 'When the {L} button has loaded, press it.',
    'Click {L} after the page finishes loading it.', 'Press the {L} button as soon as it appears.',
    'Let this page reveal {L} before clicking.', 'Look for {L} to load, then give it a click.',
    'The cue to click {L} is its appearance on the page.', 'Clicking {L} must wait for it to appear.',
    'Once visible on the page, {L} must be clicked.'];
  const T_INTERVAL = ['Click button ONE, wait {s}, then click button TWO.', 'Press ONE, count {s}, then press TWO.',
    'Click ONE and then, {s} later, click TWO.', 'First ONE, then TWO exactly {s} after it.',
    'Click ONE. After {s} have passed, click TWO.', 'Leave {s} between your click on ONE and your click on TWO.',
    'Click TWO {s} after the click on ONE.', 'Keep the ONE and TWO clicks {s} apart, in order.',
    'With ONE clicked, let {s} pass, then click TWO.'];

  const clockStr = (t) => {
    const s = Math.floor(t / 1000 + 1e-9);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  };

  env.scenario('act-in-time', {
    name: 'delay',
    sample: sampleDelay,
    level(spec, lv, r, keep) {
      const beat = spec.beat;
      if (spec.mode === 'interval') spec.tau = round2(0.15 + 0.2 * lv);
      else {
        const dis = spec.buttons.filter((b) => b.key !== 'go');
        spec.buttons = spec.buttons.filter((b) => b.key === 'go' || dis.slice(0, keep(0, 1)).includes(b));
        spec.delay = Math.max(snap(beat), snap(spec.delay * (1 - 0.35 * lv)));
      }
    },
    start(spec) {
      const mode = spec.startMode;
      return { t: 0, clicks: mode === 'partial' && spec.mode === 'interval' ? [{ key: 'one', t: 0 }] : [] };
    },
    error(model, spec) {
      if (delayWrong(model, spec)) return 1;
      if (spec.mode !== 'interval') return model.clicks.length ? 0 : 1;
      if (!model.clicks.length) return 1;
      if (model.clicks.length === 1) return 0.5;
      return intervalErr(model, spec);
    },
    endedBy(model, spec) {
      if (delayWrong(model, spec)) return spec.mode === 'interval' ? 'wrong-order' : 'wrong-click';
      if (spec.mode === 'interval' && model.clicks.length === 2 && intervalErr(model, spec) > tolerance(spec).tau + 1e-9) return 'mistimed';
      return null;
    },
    tolerance(spec) {
      return spec.mode === 'interval' ? { tau: spec.tau === undefined ? 0.15 : spec.tau, sigma: 0.35, minInitialError: 0.5 } : { tau: 0, sigma: 0.5, minInitialError: 0.5 };
    },
    plan(model, spec) {
      const t = model.t;
      if (spec.mode === 'interval') {
        if (!model.clicks.length) return t < (spec.ready || 0) - 1e-9 ? { wait: true } : { click: { button: 'one' } };
        return t - model.clicks[0].t >= spec.waitMs - 1e-9 ? { click: { button: 'two' } } : { wait: true };
      }
      return delayReady(spec, t) ? { click: { button: 'go' } } : { wait: true };
    },
    solveBy(spec, model, m) {
      if (spec.mode === 'interval') return { ...m, clicks: [{ key: 'one', t: 0 }, { key: 'two', t: spec.waitMs }] };
      return { ...m, t: Math.max(m.t, spec.delay), clicks: [{ key: 'go', t: Math.max(m.t, spec.delay) }] };
    },
    phrase(spec, rng, pick, say) {
      if (spec.mode === 'interval') {
        const s = secs(spec.waitMs);
        return say(I.fill(pick(T_INTERVAL), { s: `${s} second${s === '1' ? '' : 's'}` }), { steps: ['click ONE', `wait ${s} s`, 'click TWO'] });
      }
      return say(I.fill(pick(spec.mode === 'enable' ? T_ENABLE : T_APPEAR), { L: Q(spec.label) }), { terse: `${spec.label.toLowerCase()} when ready` });
    },
    judgeAsk(jr, spec, mk, cant) {
      if (spec.mode === 'interval') {
        const s = secs(spec.waitMs);
        return mk(['button THREE', 'THREE', 'third button'], ['Click button ONE, wait {s}, then click button THREE.', 'Press ONE, count {s}, then press THREE.',
          'Click ONE and then, {s} later, click THREE.', 'First ONE, then THREE exactly {s} after it.'], { s: `${s} second${s === '1' ? '' : 's'}` },
        cant('there is no button THREE, only ONE and TWO'));
      }
      const own = new Set([spec.label].concat(spec.buttons.map((b) => b.label)));
      const L = jr.pick(DELAY_CTX.map((d) => d.label).filter((l) => !own.has(l)));
      return mk([L, `${L} button`], spec.mode === 'enable' ? T_ENABLE : T_APPEAR, { L: Q(L) }, cant(`there is no ${L} button on this page`));
    },
    factRows(model, spec, f) {
      if (spec.mode === 'interval') {
        const c = model.clicks;
        return c.length < 2 ? [] : [f('ONE pressed at', clockStr(c[0].t), ['ONE', 'First click']), f('TWO pressed at', clockStr(c[1].t), ['TWO', 'Second click'])];
      }
      return model.clicks.length ? [f('Status', 'Ready', ['State']), f('Notice', spec.context.title, ['Title', 'Message']), f('Details', spec.context.text, ['Info'])] : [];
    },
    silentEdit(next, prev, spec, rng, m, out) {
      // The click did nothing. Interval: only the ONE press (a TWO press that is lost can no longer be on time).
      if (spec.mode === 'interval' ? !(next.clicks.length === 1 && !prev.clicks.length) : next.clicks.length <= prev.clicks.length) return null;
      m.clicks = [];
      return out(m);
    },
    retargetEdit(spec, model, rng, base, good) {
      const beat = spec.beat;
      // interval: another wait between ONE and TWO (enable / appear name the button, which is the page's state)
      if (spec.mode !== 'interval' || model.clicks.length > 1) return null;
      const elapsed = model.clicks.length ? model.t - model.clicks[0].t : 0;
      const ws = (spec.ood ? [5, 6] : [1, 2, 3, 4]).filter((w) => w !== spec.wait && (!model.clicks.length || w * beat >= elapsed + beat));
      if (!ws.length) return null;
      const w = rng.pick(ws);
      return good({ ...base, wait: w, waitMs: w * beat });
    },
  });
})();
