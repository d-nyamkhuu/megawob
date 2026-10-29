/* crop-image/instructions.js: goal wording for every scenario, including judge and Apply episodes.
 * Registered on lib; logic.js delegates at call time, after round2.js has supplied the judge helpers. */
(function () {
  'use strict';
  const { isConfirm } = env.util;
  const lib = env.taskOf('crop-image').lib;
  const { FACE_NAMES } = lib;

  function instruction(spec, rng) {
      if (spec.judge && !isConfirm(spec)) return lib.judgeInstruction(spec, rng);
      const I = env.instruct;
      const P = (ts) => I.pick(rng, ts, spec.isplit);
      const F = I.fill;
      const tol = I.tol(rng, ` (IoU ≥ ${spec.threshold.toFixed(2)})`, 0.5);
      const v = spec.scenario;
      const o = spec.goal !== null ? spec.objects[spec.goal] : null;
      let what;
      let core;
      let terse;
      if (o && o.kind === 'label') what = `the sign that says “${o.text}”`;
      else if (o && o.kind === 'face') {
        const n = FACE_NAMES[o.expr];
        what = `the ${n}${n.includes('with') ? '' : rng.pick([' icon', ' icon', '', ' emoji'])}`;
      } else if (o) what = `the ${o.color} ${o.shape}`;
      if (v === 'outline') {
        core = F(P(['Adjust the crop box to match the dashed rectangle{tol}.', 'Move and resize the crop box onto the dashed outline{tol}.',
          'Make the crop selection line up with the dashed box{tol}.', 'Fit the crop area to the dashed rectangle on the image{tol}.',
          'Crop the image to the region marked by the dashed outline{tol}.', 'Drag the crop handles until the box covers the dashed rectangle{tol}.',
          'Set all four crop edges along the dashed rectangle{tol}.',
          'The dashed rectangle should coincide with the crop box{tol}.',
          'Use the dashed outline as the boundary of the crop{tol}.',
          'Your crop should have the same bounds as the dashed box{tol}.']), { tol });
        terse = 'crop to the dashed outline';
      } else if (v === 'position' && spec.relation) {
        const phrase = {
          leftmost: ['the object furthest to the left', 'the leftmost object'], rightmost: ['the object furthest to the right', 'the rightmost object'],
          topmost: ['the highest object', 'the object nearest the top'], bottommost: ['the lowest object', 'the object nearest the bottom'],
          largest: ['the largest object', 'the biggest shape'], smallest: ['the smallest object', 'the tiniest shape'],
          'top-left': ['the object in the top-left corner', 'the top-left object'], 'top-right': ['the object in the top-right corner', 'the top-right object'],
          'bottom-left': ['the object in the bottom-left corner', 'the bottom-left object'], 'bottom-right': ['the object in the bottom-right corner', 'the bottom-right object'],
        }[spec.relation];
        what = rng.pick(phrase);
        core = F(P(['Crop the image tightly around {w}{tol}.', 'Drag the crop box so it frames just {w}{tol}.',
          'Select {w} with the crop tool{tol}.', 'Crop down to {w}, nothing else{tol}.', 'Frame {w} with the crop box{tol}.',
          'Resize the crop area to fit {w} exactly{tol}.',
          'Keep only {w} inside a tight crop{tol}.',
          'Have the crop hug every edge of {w}{tol}.',
          'Crop away any space outside {w}{tol}.',
          'Enclose all of {w} in a snug crop{tol}.',
          'Isolate {w} in the smallest crop{tol}.',
          'Give {w} a crop with no spare room{tol}.',
          'Trim to the whole extent of {w}{tol}.',
          'The crop should barely enclose {w}{tol}.',
          'Let {w} fill the crop edge to edge{tol}.']), { w: what, tol });
        terse = `crop: ${what}`;
      } else if (v === 'aspect') {
        core = F(P(['Choose the {r} preset and crop around {w}{tol}.', 'Crop {w} with a {r} aspect ratio{tol}.',
          'Use a {r} crop, centered on {w} and as tight as possible{tol}.', 'Pick the {r} ratio, then fit the box around {w}{tol}.',
          'Make a {r} crop that just contains {w}{tol}.', 'Set the crop ratio to {r} and frame {w}{tol}.',
          'In {r}, center the smallest crop around {w}{tol}.', 'Select {r} for a snug crop centered on {w}{tol}.',
          'For {w}, pick {r} and center a snug crop{tol}.']), { r: spec.ratio, w: what, tol });
        terse = `${spec.ratio} crop: ${what.replace(/^the /, '')}`;
      } else if (v === 'pan') {
        const way = spec.panWheel ? [
          'Scroll', 'Scroll the view', 'Use the mouse wheel to move', 'Roll the wheel', 'Move the image',
          'Explore by scrolling', 'Pan by wheel', 'Wheel over the image'
        ] : ['Pan', 'Use the navigator to move', 'Move the window'];
        core = F(P(['The image is larger than the window. {way} to find {w}, then crop tightly around it{tol}.',
          'Crop {w}; only part of the image is visible at a time, so pan first{tol}.', 'Find {w} in the large image and select it with a crop box{tol}.',
          'Look around the image for {w} and crop it tightly{tol}.', '{way} until {w} is in view, then frame it with the crop selection{tol}.',
          'The picture does not fit the window; locate {w} and crop just that{tol}.',
          'Bring hidden parts of the image into view, then snugly crop all of {w}{tol}.',
          '{way} to reveal {w}; keep its full bounds inside a snug crop{tol}.',
          'Explore beyond the visible area, cropping closely around all of {w}{tol}.',
          'For a tight crop of {w}, locate it by moving through the image{tol}.',
          'Once you find {w} in the big image, enclose it in a snug crop{tol}.',
          '{way} until you find {w}, then place each crop edge close around it{tol}.',
          'Search the unseen area for {w}; crop its entire outline closely{tol}.',
          '{way} to track down {w}, and trim to its full outline{tol}.',
          'Get {w} into view before fitting a crop snugly to all its edges{tol}.',
          'The target is {w}; move through the image to crop it whole, with no waste{tol}.',
          'Locate {w} beyond this view and give it a crop with no spare space{tol}.',
          '{way} to reach {w}; the crop should enclose it completely and closely{tol}.',
          'Part of the image is hidden; crop {w} tightly once you find it{tol}.',
          '{way} in search of {w}; make the crop meet its bounds on each side{tol}.',
          'Leave only {w} in the crop after searching the larger image{tol}.',
          'To isolate {w}, explore the image and fit all crop sides closely{tol}.',
          '{way} for a full view of {w}; use its outer edges as the crop boundary{tol}.']), { w: what, tol, way: way[rng.int(0, way.length - 1)] });
        terse = `pan to ${what.replace(/^the /, '')} and crop`;
      } else if (v === 'marquee') {
        core = F(P(['Draw a crop selection around {w}{tol}.', 'Drag on the image to select {w}{tol}.',
          'Make a crop selection that frames just {w}{tol}.', 'Select the area of {w} by dragging a box over it{tol}.',
          'Mark {w} with a selection rectangle{tol}.', 'Draw a tight selection box around {w}{tol}.',
          'Trace the edges of {w} by dragging a box{tol}.', 'Box in {w} tightly by dragging{tol}.',
          'Drag a snug rectangle enclosing only {w}{tol}.', 'Start a tight crop of {w} with a drag{tol}.',
          'Drag across {w} to box in its full area{tol}.', 'A drag should tightly outline {w}{tol}.',
          'Draw a snug crop enclosing just {w}{tol}.', 'Create a snug crop by dragging across {w}{tol}.',
          'Enclose {w} in a snug box by dragging{tol}.', 'The box you drag must just contain {w}{tol}.']), { w: what, tol });
        terse = `select ${what.replace(/^the /, '')}`;
      } else {
        core = F(P(lib.DEFAULT_T), { w: what, tol });
        terse = `crop: ${what.replace(/^the /, '')}`;
      }
      let steps;
      if (spec.apply && !isConfirm(spec)) {
        steps = [core, 'apply the crop'];
        const tail = P([' Then apply the crop.', ' Apply the crop when it is right.', ' Remember to press the crop\'s Apply button.',
          ' Confirm it with Apply crop.', ' Finish by applying the crop.']);
        core = core + tail;
        terse += ', apply';
      }
      let out = I.say(rng, core, { isplit: spec.isplit, terse, steps });
      if (spec.keys && rng.bool(0.25)) out += (/[.!?]$/.test(out) ? ' ' : '. ') + P([
        'Arrow keys nudge the box.', 'You can nudge it with the arrow keys.', 'Keyboard nudging works too.',
        'The box supports arrow nudges.', 'Arrows give the box a nudge.', 'Arrow keys offer fine moves.',
        'A focused box takes arrow nudges.', 'Nudge via arrows if needed.', 'Arrow taps can move the box.'
      ]);
      if (isConfirm(spec)) out = `${out.replace(/[.!?\s]+$/, '')}, but check with me before you ${spec.apply ? 'apply the crop' : 'submit'}.`;
      return out;
    }

  Object.assign(lib, { instruction });
})();
