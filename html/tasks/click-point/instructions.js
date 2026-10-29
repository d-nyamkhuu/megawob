/* click-point/instructions.js: task internals, loaded through logic.js files. */
(function () {
  'use strict';
  const lib = env.taskOf('click-point').lib;
  const { fmtNum, fmtLat, fmtLon } = lib;

  const T = {
    center: [
      'Click the exact center of the {what}.',
      'Find the center of the {what} and click on it.',
      'Click on the center point of the {what}.',
      'Place the marker at the center of the {what}.',
      'Click right in the middle of the {what}.',
      'Mark the center of the {what} with a click.',
      'Where is the center of the {what}? Click it.',
      'The {what} needs a click at its center.',
      'A click belongs at the center of the {what}.',
      'Click so the {what} is centered on that point.',
      'The {what} has one center. Click that point.',
      'Give the {what} a center marker with a click.',
    ],
    arc: [
      'Click the center of the circle that this arc is part of.',
      'Only an arc of a circle is drawn. Click where the center of that circle would be.',
      'Find the center of the circle the curved arc belongs to and click it.',
      'Click the center of the arc (the center of its full circle).',
      'Complete the circle in your head and click its center.',
      'Mark the center point of the circle this arc comes from.',
      'The target is the center of the full circle containing the arc. Click it.',
      'Place a marker where the circle containing this arc is centered.',
      'This arc shares a center with its full circle. Click that center.',
      'Your click should mark the center of the circle forming this arc.',
      'Place your click at the center shared by this arc and its circle.',
    ],
    midAB: [
      'Click the point exactly halfway between A and B.',
      'Click the midpoint of A and B.',
      'Find the midpoint between point A and point B and click it.',
      'Mark the midpoint of segment AB.',
      'Click halfway along the straight line from A to B.',
      'Place the marker midway between A and B.',
      'Divide segment AB into two equal lengths with a click.',
      'Let a click mark the middle of AB.',
      'A and B are endpoints. Click halfway along AB.',
      'Put a point where the two halves of AB meet.',
      'Bisect AB by clicking its middle point.',
      'Half of AB is on each side of your click.',
      'Make your click the halfway stop from A to B.',
      'The center of AB is your click target.',
      'AB should be twice the distance from A to your click on AB.',
      'Halve the distance from A to B with a click.',
      'Click to mark equal halves of segment AB.',
      'Click on AB at half of its length from A.',
    ],
    mid: [
      'Click the midpoint between the two dots.',
      'Click exactly halfway between the two marked points.',
      'Find the point midway between the two dots and click it.',
      'Click the spot on the line between the two dots that is equally far from both.',
      'Mark the middle point between the two dots.',
      'Put the marker halfway between the two dots.',
      'Bisect the segment joining the dots with a click.',
      'The segment between the dots needs a midpoint marker.',
      'Click to halve the segment joining the dots.',
      'Use the halfway point from dot to dot for a click.',
    ],
    bisAB: [
      'Click a point on the bisector of angle AVB, outside the dotted circle around V.',
      'Click a point that splits angle AVB into two equal halves, outside the dotted circle.',
      'Find the line that bisects angle AVB and click on it, outside the dotted circle.',
      'Click somewhere on the bisector of angle AVB (beyond the dotted circle).',
      'Mark a point on the ray that cuts angle AVB in half, outside the dotted circle.',
      'Click a point P outside the dotted circle so that angle AVP equals angle PVB.',
      'Use a click beyond the dotted circle at V to bisect angle AVB internally.',
      'Within angle AVB, place a point halfway between its rays, outside the dotted circle.',
      'Angle AVB needs a bisector. Click along its inward ray beyond the dotted circle at V.',
      'From V, aim midway between VA and VB. Click outside the dotted circle.',
      'Choose a point inside AVB on its bisecting ray, beyond the dotted circle around V.',
      'Click between VA and VB on their middle ray from V, outside the dotted circle.',
      'Outside the dotted circle at V, mark a point bisecting the interior of angle AVB.',
    ],
    bis: [
      'Click a point on the line that bisects the angle, outside the dotted circle.',
      'Click somewhere on the bisector of the angle (it splits the angle into two equal halves), outside the dotted circle.',
      'Find the line that cuts the angle exactly in half and click a point on it, outside the dotted circle.',
      'Click a point that divides the angle into two equal parts, beyond the dotted circle.',
      'Mark a point on the angle bisector, outside the dotted circle.',
      'Click inside the angle, exactly on its bisector, outside the dotted circle.',
      'The angle needs equal halves. Click its internal bisector outside the dotted circle.',
      'Choose a point so its ray from the vertex halves the drawn angle, outside the dotted circle.',
      'The target is inside the angle on its bisecting ray, beyond the dotted circle. Click there.',
      'Outside the dotted circle, click where a ray from the vertex would halve the angle.',
      'Place a point beyond the dotted circle on the internal bisector of the angle.',
      'Click beyond the dotted circle with equal angles to both sides, inside the angle.',
      'Mark inside the angle where your ray halves it, strictly outside the dotted circle.',
      'Inside the angle, the ray midway between its sides guides your click beyond the dotted circle.',
      'Both halves of the angle should match. Mark the dividing ray outside the dotted circle.',
    ],
    rightAB: [
      'Click a point C so that angle ABC is a right angle (90°), outside the dotted circle around B.',
      'Add point C so that ABC forms a 90° angle at B. Click outside the dotted circle.',
      'Click a point C outside the dotted circle so that BC is perpendicular to AB.',
      'Make a right angle at B: click a point C (outside the dotted circle) with angle ABC = 90°.',
      'Click where C must go so that segment BC is at 90° to segment AB, outside the dotted circle.',
      'Find a point C beyond the dotted circle such that ABC is a right angle, and click it.',
      'Place C beyond the dotted circle around B, with BA and BC meeting at a right angle.',
      'Use a click outside the dotted circle around B to set C, making a quarter turn from BA to BC.',
      'AB and BC must meet at 90° at B. Mark C beyond the dotted circle around B.',
      'Set C by clicking so that BC crosses AB at a right angle, outside the dotted circle at B.',
      'A right angle is needed between BA and BC. Click to set C outside the dotted circle at B.',
      'Keep BC perpendicular to BA by marking point C beyond the dotted circle around B.',
      'Choose C outside the dotted circle at B so that the turn from ray BA to ray BC is 90°.',
      'Let a click locate C outside the dotted circle around B with a right angle between BA and BC.',
      'Angle ABC should have a square corner at B. Mark C beyond the dotted circle around B.',
      'With B as the vertex, mark C beyond the dotted circle to form a right angle with BA.',
      'C belongs beyond the dotted circle at B with BC perpendicular to AB. Click to mark it.',
      'Give ABC a right angle at B by placing C with a click outside the dotted circle around B.',
      'Mark C on the perpendicular line to AB through B, beyond the dotted circle around B.',
      'Angle ABC = 90° is the target. Click to set C outside the dotted circle centered on B.',
    ],
    right: [
      'Click a third point so that it makes a right angle (90°) at the filled dot, outside the dotted circle.',
      'Click a point so the line from the filled dot to it is perpendicular to the drawn segment, outside the dotted circle.',
      'Make a 90° angle at the filled dot: click a point outside the dotted circle.',
      'Click a point outside the dotted circle so that it forms a right angle with the segment at the filled dot.',
      'Find a point beyond the dotted circle whose direction from the filled dot is at 90° to the segment, and click it.',
      'Click somewhere on the perpendicular to the segment through the filled dot, outside the dotted circle.',
      'Click outside the dotted circle to add a point whose segment to the filled dot meets the segment at 90°.',
      'The filled dot is the corner. Add a point beyond the dotted circle to make a right angle with the segment.',
      'Turn 90° at the filled dot from the segment and click along that direction, outside the dotted circle.',
      'The target is outside the dotted circle, at 90° to the segment from the filled dot. Click there.',
      'Place a third point beyond the dotted circle, making a quarter turn at the filled dot from the segment.',
      'At the filled dot, form a right angle with the segment. Click its new endpoint outside the dotted circle.',
      'Let a click mark a perpendicular from the filled dot to a point outside its dotted circle.',
      'The new point and the filled dot should define a perpendicular to the segment. Click outside the dotted circle.',
      'Make a square corner at the filled dot with the segment by marking a point outside the dotted circle.',
      'Mark an endpoint beyond the dotted circle so its segment to the filled dot is perpendicular to the drawn one.',
    ],
    ruler: [
      'Click the {axis} at {v}.',
      'Click where {v} is on the {axis}.',
      'Mark {v} on the {axis}.',
      'Click the position of {v} on the {axis}.',
      'Find {v} on the {axis} and click exactly there.',
      'Put the marker on the {axis} at {v}.',
      'On the {axis}, click the point for {v}.',
      'Match the {axis} marker to {v}.',
      'Pick {v} as the {axis} position.',
      'Read {v}. Mark its spot on the {axis}.',
      'Use {v} for a mark on the {axis}.',
      'For {v}, mark a matching {axis} point.',
      'Let a click show {v} on the {axis}.',
      'The {axis} should be marked at {v}.',
      'Your {axis} target is {v}. Click it.',
      'Select the {axis} spot for {v}.',
      'Aim your {axis} click at {v}.',
    ],
    line: [
      'Click the point on the line where {xname} is {v}.',
      'Click the line at {xname} = {v}.',
      'Find where the plotted line is at {xname} {v} and click that point on the line.',
      'On the chart, click the line exactly at {xname} = {v}.',
      'Click the data line at {v} on the horizontal axis.',
      'Mark the point of the line that sits above {xname} {v}.',
      'Use horizontal value {v} to find and click the line.',
      'Your target is on the line at {xname} {v}. Mark it.',
      'Follow {xname} = {v} to the plotted line and click there.',
      'Set a marker on the line at horizontal value {v}.',
      'For {xname} {v}, indicate the line position by clicking.',
      'At horizontal value {v}, target the line with a click.',
      'With a horizontal reading of {v}, mark the data line.',
      'Locate {v} horizontally, then mark the line there.',
      'Mark the data line corresponding to horizontal value {v}.',
      'The line point has horizontal coordinate {v}. Click it.',
      'Take {xname} {v} horizontally and click the series.',
    ],
    coord: [
      'Click the point ({v}, {y}) on the chart.',
      'Click the chart at {xname} = {v}, {yname} = {y}.',
      'Place the marker on the chart at {xname} {v} and {yname} {y}.',
      'Mark the position where {xname} is {v} and {yname} is {y}.',
      'Click the spot on the plot with x = {v} and y = {y}.',
      'Find ({v}, {y}) on the chart and click it.',
      'Use {v} horizontally and {y} vertically and click there.',
      'Locate {xname} = {v}, {yname} = {y} and click there.',
      'At horizontal {v} and vertical {y}, mark the chart.',
      'For {xname} = {v} and {yname} = {y}, mark the chart.',
      'The target is ({v}, {y}). Click its chart position.',
      'Set the chart marker to the coordinates ({v}, {y}).',
      'Click using {v} for x and {y} for y on this chart.',
      'At {xname} {v}, choose the point with {yname} {y}.',
      'Position the marker using x = {v} and y = {y}.',
      'The chart target has {xname} {v}, {yname} {y}. Mark it.',
      'Select the chart position specified by ({v}, {y}).',
      'Go across to {v} and vertically to {y}. Click there.',
      'Click where {xname} = {v}, {yname} = {y} both hold.',
    ],
    mapCoord: [
      'Click the location at {lat}, {lon} on the map.',
      'Click the point with coordinates {lat}, {lon}.',
      'Place the marker at latitude {lat}, longitude {lon}.',
      'Mark {lat} {lon} on the map.',
      'Click the map at {lat}, {lon}.',
      'Use the grid lines to find {lat}, {lon} and click it.',
      'Locate {lat}, {lon} and mark that map point.',
      'At {lat}, {lon}, click on this map.',
      'Find latitude {lat}, longitude {lon}. Click there.',
      'Set the map marker to {lat}, {lon}.',
      'Position the map marker using {lat}, {lon}.',
      'Choose {lat}, {lon} for the map marker.',
    ],
    corner: [
      'Click the intersection of {a} and {b}.',
      'Click where {a} crosses {b}.',
      'Mark the corner of {a} and {b} on the map.',
      'Find the crossing of {a} and {b} and click it.',
      'Click the spot where {a} meets {b}.',
      'Put the marker at {a} & {b}.',
      'Set a marker where {a} and {b} cross.',
      'Select the crossing for {a} and {b}.',
    ],
    pathMid: [
      'Click the point halfway along the path from A to B.',
      'Click the midpoint of the path, measured along the path.',
      'Find the point that splits the route from A to B into two equal lengths and click it.',
      'Click the middle of the path by distance along it, not in a straight line.',
      'Walking from A to B along the path, where is the halfway point? Click it.',
      'Mark the halfway point of the route from A to B.',
      'On this route from A to B, click where half its length remains.',
      'Click where the distance along the path to A equals that to B.',
      'Your target divides the drawn path into equal lengths. Mark it.',
      'At what point is half the route from A to B covered? Click there.',
      'From A along the path to B, click at half the total distance.',
      'Set the marker so the route has two parts of equal length.',
      'Half the path lies on each side of the target. Click that point.',
      'Use the length of the route from A to B to mark its midpoint.',
      'Where would two equal lengths of this path join? Mark that point.',
      'For the A to B route, mark the spot reached after half the journey.',
      'Click on the path so the route to either endpoint is equally long.',
      'The full path from A to B is twice the path distance from A to your click.',
      'A click should end the first half of the A to B path.',
    ],
    denseLabel: [
      'Click the dot labeled {label}.',
      'Click point {label}.',
      'Find {label} among the points and click exactly on it.',
      'Click on the marker named {label}.',
      'Select point {label} by clicking its dot.',
      'Click precisely on the {label} dot.',
      'Use {label} to identify and click on its dot.',
      '{label} identifies the dot to click.',
      'The target dot is {label}. Click it.',
      'Mark the dot identified by {label}.',
      'Put your click on the dot for {label}.',
      'Choose the dot displaying {label}.',
      'Let {label} guide a click to its dot.',
    ],
    denseOdd: [
      'Click the {odd}.',
      'Find the {odd} and click exactly on it.',
      'One point is different: click the {odd}.',
      'Click precisely on the {odd} among the points.',
      'Select the {odd} with a click.',
      'Locate the {odd} and click its center.',
      'Target: the {odd}. Click centrally.',
      'Center your click on the {odd}.',
      'The {odd} is your target. Click its center.',
      'Aim at the middle of the {odd} and click.',
      'Choose the center of the {odd}.',
      'Mark the {odd} at its center.',
      'Give the {odd} a click at its center.',
    ],
  };

  const AXIS_WORDS = { h: [
    'ruler', 'number line', 'scale', 'axis', 'tick scale', 'value axis', 'line'
  ], v: ['vertical scale', 'gauge', 'vertical ruler'] };

  function instruction(spec, rng) {
    if (spec.judge) return env.instruct.phrase(rng, spec.judge.templates, spec.judge.vars, spec.isplit);
    const I = env.instruct;
    const v = spec.scenario;
    const say = (key, vars, terse, extra = {}) => I.say(rng, I.phrase(rng, T[key], vars, spec.isplit), { isplit: spec.isplit, terse, ...extra });
    if (v === 'center') {
      if (spec.shape === 'arc') return say('arc', {}, 'center of the arc');
      const what = { circle: rng.pick([
        'circle', 'circle outline', 'spot', 'round area'
      ]), ring: rng.pick(['ring', 'thick ring']), disc: rng.pick(['filled circle', 'disc', 'dot']) }[spec.shape];
      return say('center', { what }, `center of the ${what}`);
    }
    if (v === 'midpoint') return spec.labels ? say('midAB', {}, 'midpoint of AB') : say('mid', {}, 'midpoint of the two dots');
    if (v === 'bisect') return spec.labels ? say('bisAB', {}, 'bisector of angle AVB') : say('bis', {}, 'angle bisector');
    if (v === 'right-angle') return spec.labels ? say('rightAB', {}, 'C with ABC = 90°') : say('right', {}, 'right angle at the filled dot');
    if (v === 'axis') {
      if (spec.kind === 'ruler') {
        const s = spec.scale;
        const val = fmtNum(spec.value, s.dec) + (rng.bool(0.6) ? s.unit : '');
        const axis = rng.pick(AXIS_WORDS[spec.orient]);
        const vv = s.name === 'x' && rng.bool(0.5) ? `x = ${fmtNum(spec.value, s.dec)}` : val;
        return say('ruler', { axis, v: vv }, `${axis} ${val}`, { typo: 0 });
      }
      const xv = fmtNum(spec.value, spec.xs.dec) + (rng.bool(0.4) ? spec.xs.unit : '');
      if (spec.kind === 'line') return say('line', { xname: spec.xs.name, v: xv }, `line at ${spec.xs.name} ${xv}`, { typo: 0 });
      const yv = fmtNum(spec.yvalue, spec.ys.dec);
      return say('coord', { xname: spec.xs.name, yname: spec.ys.name, v: fmtNum(spec.value, spec.xs.dec), y: yv }, `(${fmtNum(spec.value, spec.xs.dec)}, ${yv})`, { typo: 0 });
    }
    if (v === 'map') {
      if (spec.mode === 'coord') {
        const style = spec.style;
        const lat = style === 'signed' ? fmtLat(spec.lat, 'signed') : fmtLat(spec.lat, style);
        const lon = style === 'signed' ? fmtLon(spec.lon, 'signed') : fmtLon(spec.lon, style);
        return say('mapCoord', { lat, lon }, `${lat}, ${lon}`, { typo: 0 });
      }
      const [i, j] = rng.bool() ? spec.pair : spec.pair.slice().reverse();
      const a = spec.streets[i].name;
      const b = spec.streets[j].name;
      return say('corner', { a, b }, `${a} & ${b}`, { typo: 0 });
    }
    if (v === 'path-mid') return say('pathMid', {}, 'halfway along the path');
    if (spec.by === 'label') return say('denseLabel', { label: spec.dots[spec.target].label }, `dot ${spec.dots[spec.target].label}`, { typo: 0 });
    const odd = { hollow: rng.pick([
      'hollow dot', 'only hollow circle', 'unfilled dot', 'circle outline', 'open point', 'circular hoop'
    ]), square: rng.pick(['square', 'only square marker', 'square point']),
      color: `${spec.dots[spec.target].color} dot` }[spec.odd];
    return say('denseOdd', { odd }, odd, { typo: 0 });
  }

  Object.assign(lib, { instruction });
})();
