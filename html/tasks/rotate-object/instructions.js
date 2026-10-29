/* rotate-object/instructions.js: instruction templates and phrasing; internal functions shared through the task lib. */
(function () {
  'use strict';
  const lib = env.taskOf('rotate-object').lib;
  const { COMPASS, COMPASS16, fmtDeg, fmtValue, wrap180 } = lib;

  const T = {
    cube: [
      'Rotate the cube so {face} faces you{up}.',
      'Drag the cube until {face} points straight at you{up}.',
      'Turn the cube to show {face} on the front{up}.',
      'Spin the cube so that {face} is facing the screen{up}.',
      'Bring {face} to the front of the cube{up}.',
      'Make {face} the front face of the cube{up}.',
      'Rotate the box until you are looking straight at {face}{up}.',
      'Let {face} face you squarely on the cube{up}.',
      'Position the cube with {face} square to you{up}.',
      'Keep turning until the cube presents {face} straight on{up}.',
      'Use a front view of {face} on the cube{up}.',
    ],
    product: [
      'Spin the product so {face} faces you.',
      'Turn the product until {face} is facing you.',
      'Rotate the box on the turntable to show {face} straight on.',
      'Spin the package around until you are looking at {face}.',
      'Use the 360° view to bring {face} to the front.',
      'Turn the item so {face} faces the camera.',
      'Show {face} of the package, facing you.',
      'With a turn of the package, make {face} face you.',
      'The camera should see {face} straight on.',
      'Position the package with {face} square to you.',
      'Let {face} face you directly in the 360° view.',
    ],
    dial: [
      'Turn the {label} to {value}{tol}.',
      'Set the {label} to {value}{tol}.',
      'Adjust the {label} so it reads {value}{tol}.',
      'Rotate the {label} until it shows {value}{tol}.',
      'Change the {label} setting to {value}{tol}.',
      'Dial the {label} to {value}{tol}.',
      'The {label} should be at {value}. Set it{tol}.',
      'Make the {label} read {value}{tol}.',
      'The {label} needs a reading of {value}{tol}.',
      'Use {value} as the {label} setting{tol}.',
      'The target for the {label} is {value}{tol}.',
    ],
    dialRel: [
      'Turn the {label} {updown} by {delta}{tol}.',
      'Bring the {label} {updown} by {delta}{tol}.',
      'Move the {label} {delta} {updown} from where it is now{tol}.',
      'Turn the {label} {updown} {delta} from the current setting{tol}.',
      'Your {label} needs to go {updown} by {delta}{tol}.',
      'Use a change of {delta} {updown} on the {label}{tol}.',
    ],
    heading: [
      'Turn the {label} to a heading of {value}{named}{tol}.',
      'Set the {label} to {value}{named}{tol}.',
      'Point the {label} at {value}{named}{tol}.',
      'Rotate the {label} to {value}{tol}.',
      'Change the heading to {value}{named}{tol}.',
      'Dial in a heading of {value}{tol}.',
      'Make the {label} read {value}{named}{tol}.',
      'Use {value}{named} as the heading{tol}.',
      'The heading must read {value}{tol}.',
      'The target heading is {value}{named}. Set it{tol}.',
      'The {label} must be {value}{named}{tol}.',
    ],
    match: [
      'Use the rotation handle to turn the {thing} until it matches the reference.',
      'Rotate the {thing} so it has the same orientation as the reference.',
      "Match the {thing}'s rotation to the reference drawing.",
      'Turn the {thing} to line up with the reference shape.',
      'The reference shows how the {thing} should turn. Match its angle.',
      'Give the {thing} the orientation shown in the reference drawing.',
      'Bring the {thing} into the reference orientation by rotating it.',
    ],
    point: [
      'Rotate the {thing} so it points at the star.',
      'Drag the rotation handle until the {thing} points at the star.',
      'Aim the {thing} at the star.',
      'Turn the {thing} toward the star.',
      'Use the star as your target for the {thing}.',
      'The {thing} needs to point at the star.',
      'Keep turning the {thing} to aim at the star.',
    ],
    oheading: [
      'Rotate the {thing} to point {t}° clockwise from straight up{named}{tol}.',
      'Turn the {thing} to a heading of {t}°{named}, where 0° is up{tol}.',
      "Set the {thing}'s rotation to {t}°{tol}.",
      'Rotate the {thing} until its rotation reads {t}°{tol}.',
      'Make the {thing} face {t}°{named}, measured clockwise from up{tol}.',
      'Use {t}°{named} as the heading for the {thing}{tol}.',
      'The {thing} should have a {t}° rotation. Adjust it to match{tol}.',
      'For the {thing}, choose a rotation of {t}°{tol}.',
    ],
    photoAbs: [
      'Rotate the photo {abs}° {cw}{tol}.',
      'Turn the picture {abs} degrees {cw}{tol}.',
      'Rotate the image by {abs}° {cw}{tol}.',
      'Tilt the photo {abs}° {cw}{tol}.',
      'Rotate the image {cw} by {abs}°{tol}.',
      'Give the picture a {abs}° turn {cw}{tol}.',
      'Add a rotation of {abs}° {cw}{tol}.',
      'A {abs}° turn {cw} is needed{tol}.',
    ],
    photoTo: [
      'Set the image rotation to {t}°{tol}.',
      'Change the rotation angle of the photo to {t}°{tol}.',
      'Make the photo rotation {t}°{tol}.',
      'The rotation should read {t}°. Adjust the photo{tol}.',
      'Rotate the image so its angle is {t}° (positive is clockwise){tol}.',
      'Leave the image at a rotation of {t}°{tol}.',
      'Adjust the photo to finish at {t}° of rotation{tol}.',
      'Aim for a rotation reading of {t}° on the photo{tol}.',
    ],
    photoRel: [
      'Rotate the photo a further {d}° {cw}{tol}.',
      'The photo is already rotated; turn it {d}° more {cw}{tol}.',
      'Turn the image another {d}° {cw}{tol}.',
      'This photo needs {d}° more rotation {cw}{tol}.',
    ],
    level: [
      'Straighten the photo so the horizon is level{tol}.',
      'The horizon in this photo is tilted. Rotate the image until it is level{tol}.',
      'Level the horizon of the picture{tol}.',
      'Fix the crooked horizon by rotating the photo{tol}.',
      'Rotate the photo so the horizon runs perfectly horizontal{tol}.',
      'Make the horizon straight{tol}.',
      'A level horizon is the goal. Rotate the photo{tol}.',
      'Keep turning the photo until the horizon has no slope{tol}.',
    ],
    upright: [
      'This photo is {how}. Rotate it so it is upright.',
      'Turn the picture the right way up.',
      'Rotate the image so the scene is upright.',
      'Fix the orientation of the photo: it should be upright.',
      'The photo was imported {how}; rotate it back to upright.',
      'Make the photo right side up.',
      'Correct this {how} photo by turning it upright.',
      'Give the photo a turn to put it upright.',
      'An upright view is needed. Turn this {how} photo.',
    ],
    bearing: [
      'Rotate the map to a bearing of {T}°{named}{tol}.',
      'Set the map bearing to {T}°{tol}.',
      'Turn the map so that the top of the map faces {T}°{named}{tol}.',
      'Rotate the map until the bearing reads {T}°{tol}.',
      'The map needs a bearing of {T}°{named}{tol}.',
      'Adjust map rotation for a bearing of {T}°{tol}.',
      'Aim the top of the map at {T}°{named} as you rotate{tol}.',
    ],
    face: [
      'Rotate the map so {place} is straight above the center marker{tol}.',
      'Turn the map until {place} is directly up from the center dot{tol}.',
      'Spin the map so that {place} lies straight up from the center{tol}.',
      'Orient the map so you are facing {place} (straight up from the center){tol}.',
      'Bring {place} into line above the center marker by rotating the map{tol}.',
      'Rotate until the center dot sits directly below {place} on the map{tol}.',
      'The line from the center to {place} should point straight up{tol}.',
    ],
    north: [
      'Rotate the map so north points {dir}{tol}.',
      'Turn the map until the north arrow points {dir}{tol}.',
      'Orient the map with north {dir}{tol}.',
      'North should point {dir}. Rotate the map{tol}.',
    ],
  };

  const ins = () => env.instruct;
  const tolPhrase = (rng, txt) => {
    const t = ins().tol(rng, txt, 0.5);
    return t ? ' ' + t : '';
  };

  function instruction(spec, rng) {
    if (spec.judge) return lib.judgeInstruction(spec, rng);
    const I = ins();
    const say = (key, vars, terse, extra = {}) => I.say(rng, I.phrase(rng, T[key], vars, spec.isplit), { isplit: spec.isplit, terse, ...extra });
    if (spec.scenario === 'cube' && spec.turntable) {
      const f = spec.faces[spec.target];
      const lc = /^[A-Z][a-z]/.test(f.label) ? f.label.charAt(0).toLowerCase() + f.label.slice(1) : f.label;
      const face = {
        label: rng.pick([`the side with the ${lc}`, `the ${lc} side`, `the “${f.label}” side`]),
        color: `the ${f.colorName} side`,
        both: rng.pick([`the ${f.colorName} side (${f.label})`, `the ${f.colorName} side with the ${f.label}`]),
      }[spec.ref];
      return say('product', { face }, `front: ${spec.ref === 'color' ? f.colorName : `“${f.label}”`}`);
    }
    if (spec.scenario === 'cube') {
      const f = spec.faces[spec.target];
      const face = {
        label: `the face labeled “${f.label}”`,
        color: `the ${f.colorName} face`,
        both: `the ${f.colorName} face (“${f.label}”)`,
      }[spec.ref];
      const up = spec.upright ? rng.pick([
        ', with its label upright', ' with the label reading upright', ', label the right way up',
        ', keep the label upright'
      ]) : '';
      return say('cube', { face, up }, `front: ${spec.ref === 'color' ? f.colorName : `“${f.label}”`}${spec.upright ? ', upright' : ''}`);
    }
    if (spec.scenario === 'dial') {
      const tol = tolPhrase(rng, rng.pick([`(±${spec.tau}${spec.unit})`, `within ${spec.tau}${spec.unit}`, `(±${spec.tau}${spec.unit.trim() ? spec.unit : ''})`]));
      const named = spec.kind === 'heading' && spec.target % 45 === 0 && rng.bool(0.6) ? ` (${COMPASS[spec.target / 45]})` : '';
      const knob = rng.pick(['knob', 'dial', 'control']);
      const label = I.alias(rng, `${spec.label} ${knob}`, spec.aliases, 0.3);
      if (spec.kind === 'heading') {
        return say('heading', { label: rng.pick(['heading dial', 'compass dial', 'heading knob']), value: `${spec.target}°`, named, tol },
          `heading ${spec.target}°`, { typo: 0 });
      }
      if (spec.rel) {
        const delta = spec.target - spec.from;
        const updown = delta > 0 ? 'up' : 'down';
        return say('dialRel', { label, updown, delta: fmtValue(spec, Math.abs(delta)), tol }, `${spec.label} ${updown} ${fmtValue(spec, Math.abs(delta))}`, { typo: 0 });
      }
      return say('dial', { label, value: fmtValue(spec, spec.target), tol }, `${spec.label} ${fmtValue(spec, spec.target)}`, { typo: 0 });
    }
    if (spec.scenario === 'orient') {
      const thing = spec.shape === 'arrow' ? 'arrow' : spec.mode === 'match' ? 'shape' : 'pointer';
      if (spec.mode === 'match') return say('match', { thing }, 'match the reference');
      if (spec.mode === 'point') return say('point', { thing }, 'point at the star');
      const t = spec.target;
      const named = t % 45 === 0 && rng.bool(0.6) ? ` (${COMPASS[t / 45]})` : '';
      const tol = tolPhrase(rng, rng.pick(['(±3°)', 'within 3°']));
      return say('oheading', { thing, t, named, tol }, `${thing} at ${t}°`, { typo: 0 });
    }
    if (spec.scenario === 'photo') {
      const tol = tolPhrase(rng, rng.pick([`(±${spec.tau}°)`, `within ${spec.tau}°`, `to within ${spec.tau} degree${spec.tau === 1 ? '' : 's'}`]));
      if (spec.mode === 'level') return say('level', { tol }, 'level the horizon');
      if (spec.mode === 'upright') {
        const how = spec.base === 180 ? 'upside down' : 'sideways';
        return say('upright', { how }, 'photo upright');
      }
      const d = wrap180(spec.target - spec.from);
      const cw = (x) => (x > 0 ? rng.pick(['clockwise', 'to the right']) : rng.pick(['counterclockwise', 'to the left', 'anticlockwise']));
      // "Rotate by" goals are relative to the start, so only off starts use them; the rest name the angle.
      const vars = { abs: fmtDeg(Math.abs(d)), d: fmtDeg(Math.abs(d)), cw: cw(d), t: fmtDeg(spec.target), tol };
      const terse = `rotation ${fmtDeg(spec.target)}°`;
      if (spec.abs || spec.startMode !== 'off' || rng.bool(0.35)) return say('photoTo', vars, terse, { typo: 0 });
      return say(spec.from === 0 ? 'photoAbs' : 'photoRel', vars, terse, { typo: 0 });
    }
    const tol = tolPhrase(rng, rng.pick([`(±${spec.tau}°)`, `within ${spec.tau}°`]));
    if (spec.mode === 'bearing') {
      const T16 = spec.bearing % 22.5 === 0 && rng.bool(0.6) ? ` (${COMPASS16[spec.bearing / 22.5]})` : '';
      return say('bearing', { T: spec.bearing, named: T16, tol }, `bearing ${spec.bearing}°`, { typo: 0 });
    }
    if (spec.mode === 'face') {
      const place = spec.places[spec.ref].name;
      return say('face', { place: rng.pick([place, `the ${place}`].filter((p) => !/^the /i.test(place) || p === place)), tol }, `${place} straight up`, { typo: 0 });
    }
    const dir = { right: rng.pick(['to the right', 'right']), left: rng.pick(['to the left', 'left']), down: rng.pick(['down', 'straight down']) }[spec.north];
    return say('north', { dir, tol }, `north ${spec.north}`);
  }

  Object.assign(lib, { instruction });
})();
