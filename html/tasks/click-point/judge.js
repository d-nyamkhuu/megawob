/* click-point/judge.js: task internals, loaded through logic.js files. */
(function () {
  'use strict';
  const lib = env.taskOf('click-point').lib;
  const { roundTo, fmtNum, fmtLat, fmtLon } = lib;

  const ABSENT_SHAPES = ['square', 'triangle', 'hexagon', 'star', 'pentagon', 'octagon', 'heart', 'crescent', 'cross', 'oval', 'trapezoid', 'rectangle'];

  const ABSENT_LETTERS = [['P', 'Q', 'R'], ['X', 'Y', 'Z'], ['M', 'N', 'S'], ['U', 'V', 'W'], ['F', 'G', 'H'], ['J', 'K', 'L'], ['T', 'U', 'X'], ['Q', 'S', 'W']];

  const ABSENT_MARKERS = ['triangle', 'diamond', 'star-shaped', 'crossed', 'plus-shaped', 'ringed', 'pentagon', 'heart-shaped'];

  function judgeOf(jr, spec) {
    const v = spec.scenario;
    const ph = (templates, vars) => ({ templates, vars });
    let text;
    let message;
    let what; // what the reply names: the missing thing as the instruction says it, then alternates
    if (v === 'center') {
      const shape = jr.pick(ABSENT_SHAPES);
      what = [shape];
      text = ph(['Click the center of the {what}.', 'Click the exact center of the {what} on the board.', 'Mark the middle of the {what}.'], { what: shape });
      message = `I can't do that: there is no ${shape} on the board.`;
    } else if (v === 'midpoint') {
      const [a, b] = jr.pick(ABSENT_LETTERS).slice(0, 2);
      what = [`${a} and ${b}`, `${a}${b}`];
      text = ph([
        'Click the midpoint of {a} and {b}.', 'Click the point halfway between points {a} and {b}.',
        'Find the middle of segment {a}{b} and click it.', 'Locate the point midway from {a} to {b} and click.',
        'Split segment {a}{b} in half with a click.', 'The target is midway between {a} and {b}. Click it.'
      ], { a, b });
      message = `I can't do that: there are no points ${a} and ${b} on the board.`;
    } else if (v === 'bisect') {
      const [a, b, c] = jr.pick(ABSENT_LETTERS);
      what = [`angle ${a}${b}${c}`, `${a}${b}${c}`];
      text = ph(['Click a point on the bisector of angle {a}{b}{c}.', 'Click a point on the line that splits angle {a}{b}{c} in half.'], { a, b, c });
      message = `I can't do that: there is no angle ${a}${b}${c} on the board.`;
    } else if (v === 'right-angle') {
      const [a, b, c] = jr.pick(ABSENT_LETTERS);
      what = [`${a} and ${b}`, `${a}${b}${c}`];
      text = ph(['Click a point {c} so that angle {a}{b}{c} is 90 degrees.', 'Click a point {c} that makes a right angle at {b}, between {a} and {c}.'], { a, b, c });
      message = `I can't do that: there are no points ${a} and ${b} on the board.`;
    } else if (v === 'axis') {
      if (spec.kind === 'ruler') {
        const s = spec.scale;
        const span = s.max - s.min;
        const val = roundTo(jr.bool() ? s.max + span * jr.float(0.15, 0.5) : s.min - span * jr.float(0.15, 0.5), s.q);
        const vt = fmtNum(val, s.dec);
        what = [`${vt}${s.unit}`, vt];
        text = ph([
          'Click the {axis} at {v}.', 'Click where the {axis} reads {v}.', 'Find {v} on the {axis} and click it.',
          'Mark {v} on the {axis} by clicking.'
        ], { axis: spec.orient === 'h' ? 'ruler' : 'vertical scale', v: vt + s.unit });
        message = `I can't do that: ${vt}${s.unit} is outside the scale, which runs from ${fmtNum(s.min, s.dec)} to ${fmtNum(s.max, s.dec)}.`;
      } else {
        const xs = spec.xs;
        const val = roundTo(xs.max + (xs.max - xs.min) * jr.float(0.15, 0.5), xs.q);
        const vt = fmtNum(val, xs.dec) + xs.unit;
        what = [vt, fmtNum(val, xs.dec)];
        text = spec.kind === 'line'
          ? ph(['Click the line at {xname} = {v}.', 'On the chart, click the line exactly at {xname} = {v}.'], { xname: xs.name, v: vt })
          : ph(['Click the point on the chart at {xname} = {v}, {yname} = {y}.', 'Click the chart at {xname} {v} and {yname} {y}.'], { xname: xs.name, v: vt, yname: spec.ys.name, y: fmtNum(spec.yvalue === undefined ? spec.ys.min : spec.yvalue, spec.ys.dec) });
        message = `I can't do that: ${xs.name} = ${vt} is beyond the end of the chart (${fmtNum(xs.max, xs.dec)}).`;
      }
    } else if (v === 'map') {
      if (spec.mode === 'coord') {
        const lat = fmtLat(roundTo(spec.lat1 + spec.step * jr.pick([1.25, 1.5, 2, 2.5]), spec.step / 4), spec.style);
        const lon = fmtLon(spec.lon, spec.style);
        what = [lat];
        text = ph([
          'Click the location at {lat}, {lon} on the map.', 'Click the map at {lat}, {lon}.',
          'Mark {lat} {lon} on the map.', 'Plot {lat}, {lon} with a map click.', 'Place a map click at {lat}, {lon}.',
          'Use this map to click at {lat}, {lon}.'
        ], { lat, lon });
        message = `I can't do that: ${lat} is outside the area this map shows.`;
      } else {
        const have = spec.streets.map((st) => st.name);
        const absent = jr.pick(env.content.STREET_NAMES.filter((n) => !have.includes(n)));
        const other = spec.streets[spec.pair[1]].name;
        what = [absent];
        text = ph([
          'Click the intersection of {a} and {b}.', 'Click where {a} crosses {b}.',
          'Find the crossing of {a} and {b} and click it.', 'Mark where {a} meets {b} with a click.',
          'Place a click where {a} intersects {b}.', 'The click target is where {a} meets {b}.'
        ], { a: absent, b: other });
        message = `I can't do that: ${absent} is not on this map.`;
      }
    } else if (v === 'path-mid') {
      const end = jr.pick(['C', 'D', 'E', 'F', 'G']);
      what = [`point ${end}`, end];
      text = ph(['Click the point halfway along the path from A to {e}.', 'Click the midpoint of the path from A to {e}, measured along the path.'], { e: end });
      message = `I can't do that: the path runs from A to B, there is no point ${end}.`;
    } else if (spec.by === 'label') {
      const used = new Set(spec.dots.map((d) => d.label));
      let label;
      do label = `${jr.pick('ZWVUXY'.split(''))}${jr.int(100, 199)}`; while (used.has(label));
      text = ph([
        'Click the dot labeled {label}.', 'Click point {label}.',
        'Find {label} among the points and click exactly on it.', 'Choose dot {label} with a click.',
        'Place a click on the dot named {label}.', 'The dot to click is marked {label}.',
        'Use a click to mark dot {label}.'
      ], { label });
      what = [label];
      message = `I can't do that: no dot on the board is labeled ${label}.`;
    } else {
      const odd = `${jr.pick(ABSENT_MARKERS)} marker`;
      text = ph([
        'Click the {odd}.', 'One point is different: click the {odd}.', 'Find the {odd} and click exactly on it.',
        'The target is the {odd}. Click it.', 'Indicate the {odd} with a click.', 'Place a click on the {odd}.',
        'The {odd} is the point to click.', 'Use a click to select the {odd}.',
        'Your click should land on the {odd}.'
      ], { odd });
      what = [odd];
      message = `I can't do that: there is no ${odd} among the points.`;
    }
    return { mode: 'impossible', what, ...text, message };
  }

  Object.assign(lib, { judgeOf });
})();
