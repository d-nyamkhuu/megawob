/* set-slider/instruction.js: the instruction text, one function per scenario group (spec.scenario picks it). */
(function () {
  'use strict';

  const { lib } = env.taskOf('set-slider');
  const { fmt, fmtU, tolText, judgeInstruction } = lib;

  // The helpers every scenario's text uses: P picks a phrasing, F fills {slots}, name / qLabel the slider's page
  // label or an alias, tolOf the optional tolerance note, listJoin "a, b and c".
  function instructionContext(spec, rng) {
    const I = env.instruct;
    const P = (ts) => I.pick(rng, ts, spec.isplit);
    const F = I.fill;
    // The page label (quoted) or, in a share of episodes, an alias / casing scenario (unquoted).
    const name = (s) => I.alias(rng, s.label, (s.aliases || []).map((a) => a.replace(/^the /, ''))).replace(/^the /, '');
    const qLabel = (s) => {
      const n = name(s);
      return n === s.label ? `“${n}”` : n;
    };
    const tolOf = (s) => {
      const t = tolText(s);
      return t ? I.tol(rng, ` (${t})`, 0.5) : '';
    };
    const listJoin = (parts) => (parts.length > 1 ? parts.slice(0, -1).join(', ') + ' and ' + parts[parts.length - 1] : parts[0]);
    return { I, P, F, spec, rng, name, qLabel, tolOf, listJoin };
  }

  // multi / mixer: several named sliders.
  function multiParts(c) {
    const { P, F, spec, qLabel, tolOf, listJoin } = c;
    let core;
    let terse;
    const sl = spec.scored.map((i) => spec.sliders[i]);
    const named = sl.map((s) => [qLabel(s), fmtU(s, s.target[0]), tolOf(s)]);
    const lists = {
      to: listJoin(named.map(([n, v, t]) => `${n} to ${v}${t}`)),
      at: listJoin(named.map(([n, v, t]) => `${n} at ${v}${t}`)),
      is: listJoin(named.map(([n, v, t]) => `${n} is ${v}${t}`)),
      colon: named.map(([n, v, t]) => `${n}: ${v}${t}`).join(', '),
    };
    core = F(P(spec.scenario === 'mixer' ? [
      'Set {to} on the mixer.', 'In the mixer, set {to}.', 'Adjust the channel faders: {colon}.',
      'Move the faders so that {is}.', 'Mix it like this: {colon}.', 'Bring {to}.', 'Put {at}.',
      'The fader targets are {colon}.', 'Ensure {is}.', 'The mix should have {at}.', 'Please dial in {to}.',
      'Use {at} for this mix.', 'Match the mix values: {colon}.', 'Aim for {colon}.',
    ] : [
      'Set {to}.', 'Adjust the sliders: {colon}.', 'Move the sliders so that {is}.', 'Please put {at}.',
      'Configure {to}.', 'Change the settings so {is}.', 'Drag the sliders to these values: {colon}.',
      'Your slider targets are {colon}.', 'Make sure that {is}.', 'The sliders should have {at}.', 'Dial in {to}.',
      'Use these values: {colon}.', 'Have your sliders read {colon}.',
    ]), lists);
    terse = sl.map((s) => `${s.label} ${fmtU(s, s.target[0])}`).join(', ');
    return { core, terse };
  }

  // match: apply a named preset.
  function matchParts(c) {
    const { P, F, spec } = c;
    let core;
    let terse;
    const p = spec.presets[spec.preset];
    core = F(P([
      'Apply the “{p}” preset: set the sliders to the values listed for it.',
      'Make the sliders match the “{p}” preset shown on the page.',
      'Set every slider to its value in the “{p}” preset.',
      'Use the presets card: configure the “{p}” preset by hand.',
      'Copy the values of the “{p}” preset onto the sliders.',
      'Match the “{p}” settings listed on the page.',
      'Dial in the “{p}” preset values.',
      'Recreate “{p}” using the values on its preset card.',
      'Each slider should agree with the “{p}” preset card.',
      'Use “{p}” as the reference for all slider positions.',
      'Follow the “{p}” card to position every slider.',
      'Read “{p}” on the presets card and reproduce its settings.',
      'The sliders should reflect the listed “{p}” preset.',
    ]), { p: p.name });
    terse = `${p.name} preset`;
    return { core, terse };
  }

  // stops: a named stop.
  function stopsParts(c) {
    const { I, P, F, spec, rng, name, qLabel } = c;
    let core;
    let terse;
    const s = spec.sliders[spec.scored[0]];
    const v = `“${I.alias(rng, s.stops[s.target[0]], [])}”`;
    core = F(P([
      'Set {s} to {v}.', 'Move the {n} slider to {v}.', 'Pick the {v} setting on {s}.', 'Change {s} to {v}.',
      'Slide {s} to the {v} stop.', 'Select {v} for {s}.', 'Put {s} on {v}.', '{s} needs to be {v}.',
      'Let {s} rest at {v}.', 'Get {s} to read {v}.', 'Stop at {v} on {s}.', 'Leave {s} set at {v}.',
      'Use {v} as the {n} setting.', 'Land on {v} with {s}.',
    ]), { s: qLabel(s), n: name(s), v });
    terse = `${s.label}: ${s.stops[s.target[0]]}`;
    return { core, terse };
  }

  // media: seek or volume of a video.
  function mediaParts(c) {
    const { P, F, spec, tolOf } = c;
    let core;
    let terse;
    const s = spec.sliders[spec.scored[0]];
    if (spec.mediaGoal === 'seek') {
      const t = fmt(s, s.target[0]);
      core = F(P([
        'Skip to {t} in the video{tol}.', 'Jump to the {t} mark{tol}.', 'Seek the video to {t}{tol}.',
        'Move the playback position to {t}{tol}.', 'Scrub to {t} in “{title}”{tol}.', 'Go to {t} in the video{tol}.',
        'Set the timeline to {t}{tol}.',
        'Use {t} as the position{tol}.',
        'The target time is {t}{tol}.',
      ]), { t, title: spec.title, tol: tolOf(s) });
      terse = `seek ${t}`;
    } else if (spec.goal.kind === 'extreme') {
      core = spec.goal.end === 'min'
        ? P(['Mute the video using the volume slider.', 'Turn the player volume all the way down.', 'Drag the volume slider to zero.',
          'Silence the player with its volume slider.', 'Set the player volume to 0.', 'Bring the video volume down to nothing.',
          'The volume slider should read zero.', 'Use the lowest volume in the player.',
          'Leave the video volume slider at zero.'])
        : P(['Turn the player volume all the way up.', 'Set the video volume to its maximum.', 'Max out the volume slider of the player.',
          'Push the player volume to 100%.', 'Make the video as loud as it goes.', 'Set the volume of the player to full.',
          'The player volume should read 100%.', 'Leave this volume slider at 100%.']);
      terse = spec.goal.end === 'min' ? 'mute' : 'volume max';
    } else {
      const t = fmtU(s, s.target[0]);
      core = F(P([
        'Set the player volume to {t}{tol}.', 'Change the video volume to {t}{tol}.', 'Drag the volume slider of the player to {t}{tol}.',
        'Make the player volume {t}{tol}.', 'Adjust the volume in the player to {t}{tol}.', 'Put the video volume at {t}{tol}.',
        'Use {t}{tol} as the player volume.', 'Have the player volume read {t}{tol}.',
        'Give the video a volume of {t}{tol}.', 'Dial in {t}{tol} on the player volume slider.',
      ]), { t, tol: tolOf(s) });
      terse = `volume ${t}`;
    }
    return { core, terse };
  }

  // player: sub-goals among seek / volume / mute / unmute / captions; the finished text (no rule appended).
  function playerText(c) {
    const { I, P, F, spec, rng, tolOf } = c;
    let core;
    let terse;
    const [seek, vol] = spec.sliders;
    const PH = {
      mute: [
        'mute the video', 'turn the sound off', 'silence the player', 'mute the audio', 'switch the sound off',
        'cut the audio', 'make playback silent', 'leave the sound off', 'stop sound output', 'block all sound'
      ],
      unmute: [
        'unmute the video', 'turn the sound back on', 'unmute the player', 'bring the sound back',
        'switch the audio back on', 'make playback audible', 'restore sound output', 'let the sound be heard',
        'take the player off mute'
      ],
      'captions-on': [
        'turn captions on', 'show the subtitles', 'enable closed captions', 'switch the subtitles on', 'turn on CC',
        'make captions visible', 'let captions show', 'put captions in view'
      ],
      'captions-off': [
        'turn captions off', 'hide the subtitles', 'disable the captions', 'switch the subtitles off', 'turn off CC',
        'leave captions hidden', 'use no captions'
      ],
      seek: [
        'set the position to {t}{tol}', 'jump to {t}{tol}', 'skip to {t}{tol}', 'go to the {t} mark{tol}',
        'seek to {t}{tol}', 'scrub to {t}{tol}', 'cue up {t}{tol}', 'land on {t}{tol}', 'move playhead to {t}{tol}',
        'position video at {t}{tol}'
      ],
      volume: [
        'set the volume to {v}{tol}', 'change the volume to {v}{tol}', 'make the volume {v}{tol}',
        'put the volume at {v}{tol}', 'use {v}{tol} for the volume', 'have the volume read {v}{tol}',
        'dial in {v}{tol} volume', 'choose {v}{tol} for volume'
      ],
    };
    const vars = {
      t: seek.target ? fmt(seek, seek.target[0]) : '', v: vol.target ? fmtU(vol, vol.target[0]) : '',
      tol: '',
    };
    const parts = spec.goals.map((g) => F(P(PH[g]), { ...vars, tol: g === 'seek' ? tolOf(seek) : g === 'volume' ? tolOf(vol) : '' }));
    const both = { a: parts[0], b: parts[1], A: I.ucFirst(parts[0]), title: spec.title };
    core = parts.length > 1
      ? F(P(['{A} and {b}.', '{A}, then {b}.', '{A}; also {b}.', 'In the player, {a} and {b}.', 'Please {a} and {b}.',
        'For “{title}”, {a} and {b}.',
        'First {a}; next {b}.',
        'You should {a} and {b}.',
        '{A} before you {b}.',
        'Now {a} and {b}.']), both)
      : F(P([
        '{A}.', 'In the player, {a}.', 'Please {a}.', 'For “{title}”, {a}.', '{A} in the video player.',
        'Use the player to {a}.', 'Go ahead and {a}.', '{A} here.'
      ]), both);
    terse = spec.goals.map((g) => (g === 'seek' ? `seek ${vars.t}` : g === 'volume' ? `volume ${vars.v}` : g.replace('-', ' '))).join(', ');
    const out = I.say(rng, core, { isplit: spec.isplit, terse, steps: parts.length > 1 ? parts : undefined });
    return spec.keys && rng.bool(0.25) ? out + (/[.!?]$/.test(out) ? ' ' : '. ') + P(['Arrow keys work too.', 'You may use the keyboard.']) : out;
  }

  // rating: stars for one or more rows.
  function ratingParts(c) {
    const { P, F, spec, rng, listJoin } = c;
    let core;
    let terse;
    const { n } = spec.stars;
    const stars = (v) => (v === 1 ? '1 star' : `${fmt({ step: 0.5 }, v).replace(/\.0$/, '')} stars`);
    const num = (v) => String(v);
    const sl = spec.scored.map((i) => spec.sliders[i]);
    const sum = sl.map((s) => `${s.label.toLowerCase()} ${num(s.target[0])}`).join(', ');
    if (sl.length === 1) {
      const s = sl[0];
      const t = s.target[0];
      const rowName = s.label === 'Overall' ? '' : s.label.toLowerCase();
      core = F(P(t === n && rng.bool(0.5) ? [
        'Give {what} the highest rating.', 'Rate {what} with all {n} stars.', 'Give {what} full marks: {n} stars.',
        'Fill in every star for {what}.', 'The rating for {what}: {n} stars.',
      ] : [
        'Rate {what} {st}.', 'Give {what} a rating of {st}.', 'Set the rating for {what} to {st}.', 'Give {what} {t} out of {n} stars.',
        'Click {st} for {what}.', 'Leave {what} a {t}-star rating.', 'Rate {what} {t}/{n}.',
        '{what} should get {t}/{n}.', 'Use a {t}-star score for {what}.', '{what} merits {st}.',
        'Select {st} to rate {what}.',
      ]), { what: rowName ? `the ${rowName} of “${spec.scene.item}”` : `“${spec.scene.item}”`, st: stars(t), t: num(t), n });
      terse = `${spec.scene.item} ${rowName || 'rating'}: ${num(t)} stars`;
    } else {
      const parts = sl.map((s) => `${s.label.toLowerCase()} ${stars(s.target[0])}`);
      const list = listJoin(parts);
      core = F(P([
        'Rate {item}: {list}.', 'Leave this review for {item}: {list}.', 'In the rating form, give {list}.',
        'Set the ratings for {item}: {list}.', 'Rate {item} as follows: {list}.', 'For {item}, use these: {list}.',
        'The ratings should be {list}.', 'Record these scores: {list}.', '{item} needs these ratings: {list}.',
        'Fill in the star ratings: {list}.',
      ]), { item: `“${spec.scene.item}”`, list });
      terse = `${spec.scene.item}: ${sum}`;
    }
    return { core, terse };
  }

  // range: a two-thumb slider.
  function rangeParts(c) {
    const { P, F, spec, name, qLabel, tolOf } = c;
    let core;
    let terse;
    const s = spec.sliders[spec.scored[0]];
    const t = s.target.map((v) => fmtU(s, v));
    core = F(P([
      'Set the {s} range to {a} – {b}{tol}.', 'Drag the two {s} handles to {a} and {b}{tol}.',
      'Limit {s} to between {a} and {b}{tol}.', 'Make the {s} range go from {a} to {b}{tol}.',
      'Set the lower {n} handle to {a} and the upper one to {b}{tol}.', 'Filter {s} to {a}–{b}{tol}.',
      'Adjust {s} so it covers {a} to {b}{tol}.',
      '{s} should span {a}–{b}{tol}.',
      'Use {a}–{b} as the {s} interval{tol}.',
      'Use both {a} and {b} as the {s} limits{tol}.',
      'The {s} bounds should be {a} and {b}{tol}.',
      'Bring both {s} endpoints to {a} and {b}{tol}.',
      'Start {s} at {a} and end at {b}{tol}.',
    ]), { s: qLabel(s), n: name(s), a: t[0], b: t[1], tol: tolOf(s) });
    terse = `${s.label} ${t[0]}–${t[1]}`;
    return { core, terse };
  }

  // horizontal / vertical / log: one scored slider, by goal kind.
  function singleParts(c) {
    const { I, P, F, spec, rng, name, qLabel, tolOf } = c;
    let core;
    let terse;
    const s = spec.sliders[spec.scored[0]];
    const g = spec.goal;
    const vars = { s: qLabel(s), n: name(s), t: fmtU(s, s.target[0]), tol: tolOf(s) };
    if (g.kind === 'extreme') {
      const max = g.end === 'max';
      const special = s.kind === 'volume' && !max
        ? ['Mute {n} by dragging its slider all the way down.', 'Turn {s} all the way down.']
        : s.kind === 'light'
          ? [max ? 'Make {n} as bright as it goes.' : 'Turn {s} down to the darkest setting.']
          : [];
      core = F(P([
        ...(max ? ['Set {s} to its maximum.', 'Turn {s} all the way up.', 'Push {s} to the highest setting.',
          'Max out {s}.', 'Move {s} to the top of its range.', 'Set {s} as high as it goes.',
          'Raise {s} until it maxes out.', 'Let {s} be at maximum.', 'Pick the largest {s} value.',
          'Use the maximum for {s}.', 'Hit the upper limit on {s}.', 'Put {s} at full scale.']
          : ['Set {s} to its minimum.', 'Turn {s} all the way down.', 'Drop {s} to the lowest setting.',
            'Move {s} to the bottom of its range.', 'Set {s} as low as it goes.', 'Bring {s} down to its minimum.',
            'Decrease {s} until it bottoms out.', '{s} should be at minimum.', 'Use the smallest {s} value.']),
        ...special,
      ]), vars);
      terse = `${s.label} ${max ? 'max' : 'min'}`;
    } else if (g.kind === 'fraction') {
      const word = { 0.25: [
        'a quarter of the way', 'one quarter of its range', '25% of the way', '25% between its limits',
        'the first quartile point'
      ],
        0.5: ['halfway', 'the middle of its range', 'the midpoint', 'midrange'],
        0.75: [
          'three quarters of the way', '75% of its range', 'three quarters up', 'the 75% position',
          'the third quartile', '75% along its full range'
        ] }[g.f];
      vars.f = rng.pick(word);
      core = F(P(['Set {s} to {f}.', 'Move {s} to {f}.', 'Put the {n} slider at {f}.', 'Drag {s} to {f}{tol}.',
        'Slide {s} to {f}.', 'Adjust {s} to sit at {f}.', '{s} should be at {f}.', 'Target {f} on {s}.',
        'Place {s} at {f}{tol}.', 'Make {s} reach {f}.']), { ...vars, tol: '' });
      terse = `${s.label} ${vars.f}`;
    } else if (g.kind === 'relative') {
      const a = Math.abs(g.amount);
      if (g.op === 'add') {
        vars.a = fmtU(s, a).replace(/^-/, '');
        core = F(P(g.amount > 0
          ? ['Increase {s} by {a}{tol}.', 'Raise {s} by {a} from where it is now{tol}.', 'Turn {s} up by {a}{tol}.',
            'Add {a} to the current {n}{tol}.', 'Bump {s} up by {a}{tol}.', 'Make {s} {a} higher than it is{tol}.',
            '{s} must gain {a}{tol}.', 'Use current {s} plus {a}{tol}.']
          : ['Decrease {s} by {a}{tol}.', 'Lower {s} by {a} from its current value{tol}.', 'Turn {s} down by {a}{tol}.',
            'Take {a} off the current {n}{tol}.', 'Reduce {s} by {a}{tol}.', 'Make {s} {a} lower than it is{tol}.',
            'Subtract {a} from {n}{tol}.', '{s} needs to fall by {a}{tol}.', 'Have {s} read {a} less than now{tol}.']), vars);
        terse = `${s.label}: ${vars.a} ${g.amount > 0 ? 'higher' : 'lower'}`;
      } else {
        const word = { 2: 'double', 0.5: 'halve', 10: 'multiply by ten', 0.1: 'divide by ten', 3: 'triple' }[g.amount];
        vars.w = word;
        core = F(P(['{W} {s}{tol}.', 'Please {w} the current {n}{tol}.', '{W} the value of {s}{tol}.',
          'Take the current {n} and {w} it{tol}.', 'Change {s} so it is {x} what it is now{tol}.', '{W} {s} from its current setting{tol}.',
          '{s} should read {x} its value{tol}.']),
        { ...vars, W: I.ucFirst(word), x: { 2: 'twice', 0.5: 'half', 10: 'ten times', 0.1: 'a tenth of', 3: 'three times' }[g.amount] });
        terse = `${word} ${s.label}`;
      }
    } else {
      core = F(P([
        'Set {s} to {t}{tol}.', 'Drag the {s} slider to {t}{tol}.', 'Change {s} to {t}{tol}.', 'Adjust {s} to {t}{tol}.',
        'Move the {n} slider so it reads {t}{tol}.', 'Put {s} at {t}{tol}.', 'Make {s} {t}{tol}.', 'Make sure {s} reads {t}{tol}.',
        'Aim for {t} on {s}{tol}.', 'Use {t} for {s}{tol}.', 'The target for {s} is {t}{tol}.',
        '{s} needs to read {t}{tol}.',
      ]), vars);
      terse = `${s.label} ${fmtU(s, s.target[0])}`;
    }
    return { core, terse };
  }

  function instruction(spec, rng) {
    if (spec.judge) return judgeInstruction(spec, rng);
    const c = instructionContext(spec, rng);
    const { I, P } = c;
    const handles = spec.scenario === 'range' || spec.scenario === 'multi' || spec.scenario === 'mixer' || spec.scenario === 'match' ? 'handles' : 'handle';
    const rule = spec.allowTrackClick ? '' : ' ' + P([
      `Drag the ${handles}; clicking the track is not allowed.`,
      `Only drag the ${handles} (no clicking on the track).`,
      `Use the ${handles} - track clicks are not allowed.`,
      `Don't click the track; drag the ${handles} instead.`,
    ]);
    const v = spec.scenario;
    if (v === 'player') return playerText(c);
    const { core, terse } = v === 'multi' || v === 'mixer' ? multiParts(c)
      : v === 'match' ? matchParts(c)
        : v === 'stops' ? stopsParts(c)
          : v === 'media' ? mediaParts(c)
            : v === 'rating' ? ratingParts(c)
              : v === 'range' ? rangeParts(c) : singleParts(c);
    let out = I.say(rng, core, { isplit: spec.isplit, terse });
    if (rule) out += (/[.!?]$/.test(out) ? '' : '.') + rule;
    if (spec.keys && rng.bool(0.25)) out += (/[.!?]$/.test(out) ? ' ' : '. ') + P([
      'Arrow keys work too.', 'You may use the keyboard.', 'Keyboard input is fine here.',
      'The keyboard is optional.', 'Feel free to use arrow keys.', 'Keys are OK as well.'
    ]);
    return out;
  }

  Object.assign(lib, { instruction });
})();
