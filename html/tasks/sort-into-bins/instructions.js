/* sort-into-bins/instructions.js: instruction templates and wording. Shared internals live on the task lib. */
(function () {
  'use strict';
  const lib = env.taskOf('sort-into-bins').lib;

  // ---------------------------------------------------------------- instructions

  const describe = (it) => `${it.fill === 'outline' ? 'outline ' : ''}${it.color} ${it.shape}`;
  const sideName = (c) => ({ left: 'left', right: 'right', top: 'top', bottom: 'bottom' })[c.side];
  const boxRef = (rng, c) => rng.pick([`the ${sideName(c)} box`, `the box on the ${sideName(c)}`, `the ${sideName(c)}-hand box`.replace('top-hand', 'upper').replace('bottom-hand', 'lower')]);

  function whatOf(rng, spec, one) {
    const { kind, value } = spec.rule;
    if (kind === 'color') return one ? `${value} shape` : rng.pick([`${value} shapes`, `${value} items`, `${value} pieces`]);
    return one ? value : lib.plural(value);
  }

  const T = {
    single: ['Drag the {it} so that it is completely inside the box.', 'Move the {it} into the box. It must fit fully inside.',
      'Put the {it} entirely inside the outlined box.', 'Place the {it} in the box, all of it inside the border.',
      'Get the {it} into the box without it sticking out.', 'Drop the {it} inside the frame so no part of it crosses the edge.',
      'The box must contain the whole {it} when you finish.', 'Keep the {it} within the box, with every part inside.',
      'Let none of the {it} extend beyond the box after the drop.',
      'Bring the {it} within the box, with no part left out.', 'Use the box to hold the {it}, including all of it.',
      'The {it} belongs inside the box with nothing hanging out.',
      'Inside the box, the {it} must fit without crossing an edge.',
      'Drag the {it} until it is fully enclosed by the box.', 'Ensure that every part of the {it} is inside the box.',
      'The {it} must fit in the box with its edges fully inside.'],
    collectIn: ['Drag every {one} into {box}. Leave all the other shapes outside it.', 'Put all the {many} inside {box}, and keep every other shape out of it.',
      'Move the {many} into {box}; nothing else should be in there.', 'Collect the {many} in {box}. The rest stay out.',
      'Drag the {many} into {box}; only they belong there.', 'Gather every {one} inside {box} and leave the others where they are, outside it.',
      'All {many} must fit in {box}; other shapes go outside boxes.',
      'The rest go outside all boxes; fit every {one} into {box}.',
      'Only {many} go in {box}. Fit them all; keep the rest out of all boxes.',
      'Use {box} to contain each {one}; the rest go outside all boxes.',
      'End with all {many} fully in {box} and the rest outside boxes.',
      'Keep all boxes clear except for all {many} fully inside {box}.',
      'Box all {many} in {box}, fully; leave everything else unboxed.',
      'All {many} belong wholly in {box}. No other shapes in any box.',
      'Clear the other boxes; fit all {many} in {box} and nothing else.',
      'Every {one} must fit within {box}; every other shape stays unboxed.'],
    remove: ['Take every {one} out of the box and leave the other shapes inside.', 'Remove the {many} from the box; everything else stays in it.',
      'Drag the {many} out of the box. Do not move the others out.', 'Move the {many} out of the box; they do not belong there.',
      'Clear the {many} out of the box, keeping the rest inside.', 'Pull each {one} out of the box.',
      'The box must hold the rest with all {many} fully outside.',
      'End with each {one} fully outside the box, the rest in.',
      'Only {many} go wholly outside; put the rest in the box.',
      'Separate all {many} out; fit the rest inside the box.', 'All {many} must clear the box; all others go inside.',
      'The rest belong in the box; set each {one} wholly outside.', 'Box all but the {many}; put those fully outside.',
      'Box all other shapes, with every {one} completely outside.',
      'Give the box the others; leave all {many} clear of it.',
      'Every {one} must be wholly out; all other shapes in the box.'],
    count: ['Put exactly {k} {kmany} into {box}. Everything else stays outside it.', 'Drag {k} of the {many} into {box}, no more and no fewer.',
      'Place exactly {k} {kmany} in {box} and keep the other shapes out.', 'Make sure {box} ends up holding exactly {k} {kmany} and nothing else.',
      'Move any {k} {kmany} into {box}.', 'Fill {box} with exactly {k} {kmany}.',
      'No shapes boxed except {k} {kmany}, fully in {box}.', 'Box only {k} {kmany}, all fully inside {box}.'],
    split: ['Drag every {one} into the {a} box and every other shape into the {b} box.', 'Sort the shapes: each {one} goes into {a}, everything else goes into {b}.',
      'Put the {many} in {a} and all remaining shapes in {b}.', 'Put every shape in a box: {many} in {a}, the rest in {b}.',
      'File the {many} under {a} and everything else under {b}.', 'Move each shape into a box, {many} into {a} and the others into {b}.',
      'All shapes must fit: each {one} in {a}, every other shape in {b}.',
      'Each box has its group: {many} inside {a}, all others inside {b}.',
      'No shapes outside: fit all {many} in {a} and all others in {b}.',
      'Gather all shapes into boxes, {many} in {a}, the rest in {b}.',
      'Give every shape a box: {a} holds all {many}, {b} holds the rest.',
      'Fill the boxes: all {many} fit in {a}, the rest in {b}.',
      'Fit every shape by group: {a} for {many}, {b} for the rest.',
      'Fully enclose all shapes, with {many} in {a} and the others in {b}.',
      'Make {a} contain each {one} in full, and {b} contain every other shape.',
      'Complete both groups inside their boxes: {many} in {a}, others in {b}.',
      'Let {b} hold the rest while {a} contains all {many}, each fully inside.',
      'Fit the whole set in boxes: {a} takes {many}, {b} takes all others.',
      'With each {one} enclosed in {a}, fit all remaining shapes in {b}.'],
    spatial: ['Put every {one} into {a} and all the other shapes into {b}.', 'Sort the shapes: {many} go in {a}, everything else in {b}.',
      'Drag the {many} into {a}, and the remaining shapes into {b}.', 'Use the two boxes: {many} in {a}, all others in {b}.',
      'Make sure every shape ends up in a box: the {many} in {a}, the rest in {b}.', 'Move each {one} to {a} and every other shape to {b}.',
      'Make two groups inside boxes: all {many} in {a}, the rest in {b}.',
      'Each {one} belongs inside {a}. All other shapes go inside {b}.',
      'Leave {a} enclosing all the {many}, and {b} enclosing the rest.',
      'The {many} must fit in {a}. Everything else must fit in {b}.',
      'Enclose all {many} in {a} and the entire remaining group in {b}.',
      'Arrange all shapes fully inside boxes: {many} in {a}, others in {b}.'],
    each: ['Sort the shapes by {kind}: drag each one into the box labeled with its {kind} ({labels}).', 'Drag every shape into the box that matches its {kind}: {labels}.',
      'Put each shape in the box for its {kind} ({labels}).', 'Group the shapes by {kind} using the labeled boxes.',
      'Drop every shape into the box named after its {kind}.', 'Sort all the shapes into the {labels} boxes by {kind}.',
      'Match {kind} to box labels and fit every shape inside.',
      'All shapes belong fully inside boxes labeled with their {kind}.',
      'Fit all shapes by {kind} into matching boxes: {labels}.',
      'Each box must contain all shapes of that {kind}: {labels}.',
      'Use {kind} labels ({labels}) to place each shape in its box.',
      'The {labels} labels tell you where every shape fits by {kind}.',
      'Each shape goes fully in a box bearing its {kind} label.',
      'Fit every shape inside a box with a matching {kind} label.'],
    deskInto: ['Move all the {kindw} into the "{folder}" folder.', 'Drag every {kindw1} file onto the "{folder}" folder.', 'Put the {kindw} in "{folder}" and leave the other files on the desktop.',
      'File the {kindw} under "{folder}".', 'Clean up the desktop: the {kindw} go into "{folder}"; nothing else moves.', 'Drop each of the {kindw} into the {folder} folder.',
      'All {kindw} in "{folder}"; other files on the desktop.',
      'The desktop gets others; "{folder}" gets all {kindw}.',
      'Use "{folder}" for {kindw}; the rest go on the desktop.',
      'File {kindw} in "{folder}"; the desktop holds the rest.',
      'File by type: {kindw} in "{folder}"; others on desktop.',
      'Only {kindw} belong in "{folder}"; desktop for the rest.',
      'Folder "{folder}": {kindw} only. Desktop: all others.',
      'Sort until "{folder}" holds {kindw} and others are on desktop.',
      'Sorted: "{folder}" holds {kindw}; desktop holds others.', 'Separate {kindw}: "{folder}"; rest on the desktop.'],
    deskTrash: ['Delete all the {kindw} by dragging them to the Trash.', 'Move every {kindw1} file to the Trash and keep the rest on the desktop.',
      'Throw away the {kindw}; leave the other files alone.', 'Drag the {kindw} into the Trash.', 'Get rid of the {kindw} (move them to the Trash).', 'Trash every {kindw1} file on the desktop.',
      'Drag {kindw} to Trash; others go on the desktop.', 'Trash gets {kindw}; desktop gets others. Drag to sort.',
      'Put {kindw} in Trash by dragging; rest on desktop.',
      'Drag the {kindw} until Trash holds them; rest on desktop.'],
    deskSort: ['File every file into its folder: {pairs}.', 'Clean up the desktop by moving each file into the matching folder ({pairs}).',
      'Sort the files into folders: {pairs}.', 'Move all files off the desktop into their folders: {pairs}.', 'Organize the desktop: {pairs}.',
      'Drag each file onto the folder for its type: {pairs}.',
      'Every file belongs in its matching folder ({pairs}).',
      'Use this folder guide for all files: {pairs}.',
      'The folders should contain all files by type: {pairs}.',
      'Finish with all files in their folders: {pairs}.',
      'Apply these destinations to all files: {pairs}.',
      'File everything to empty the desktop: {pairs}.',
      'All files must follow these folder directions: {pairs}.',
      'Put every file where this list assigns its type: {pairs}.',
      'Match and file the entire collection: {pairs}.',
      'Every file goes where listed: {pairs}.',
      'File the whole set by these pairings: {pairs}.',
      'Get every file into the folder assigned here: {pairs}.',
      'Leave no file behind. Folder directions: {pairs}.',
      'Follow {pairs} until each file is in its folder.'],
    palette: ['Add {list} to the frame.', 'Drag {list} from the palette into the frame.', 'Make the frame contain exactly {list}, using the palette.',
      'Build this in the frame: {list}.', 'Place {list} inside the frame, nothing else.', 'Fill the frame with exactly {list} from the shape palette.',
      'The frame should hold only {list}, fully inside.', 'Use the palette for this frame: {list}.',
      'Inside the border, include only {list}.', 'Frame contents should be exactly {list}.',
      'Keep {list} wholly in the frame, with no extras.', 'From the palette, give the frame just {list}.',
      'The border must enclose exactly {list}.', 'Your goal: only {list}, entirely in the frame.',
      'Fit only {list} fully in the frame.', 'Copy exactly {list} into the frame, fully inside.',
      'Let the frame enclose {list} and nothing else.', 'Frame check: {list}, nothing else, fully inside.'],
  };

  function instructionOf(spec, rng) {
    const isplit = spec.isplit;
    const say = (key, vars, terse) => lib.I.say(rng, lib.I.ucFirst(lib.I.fill(lib.I.pick(rng, T[key], isplit), vars)), { isplit, terse });
    const v = spec.scenario;
    if (v === 'single') {
      const it = describe(spec.items[0]);
      return say('single', { it }, `${it} into the box`);
    }
    if (v === 'desk') {
      const r = spec.rule;
      const kw = (k) => rng.pick(lib.KIND_WORDS[k]);
      const folderOf = (k) => spec.folders.find((d) => d.kind === k && r.kinds.includes(k));
      const ext1 = { image: 'image', document: 'document', spreadsheet: 'spreadsheet', presentation: 'presentation', audio: 'audio',
        video: 'video', archive: 'archive', text: 'text', data: 'data' };
      if (r.mode === 'trash') return say('deskTrash', { kindw: kw(r.kind), kindw1: ext1[r.kind] }, `${kw(r.kind)} to the Trash`);
      if (r.mode === 'into') {
        const f = folderOf(r.kind).label;
        return say('deskInto', { kindw: kw(r.kind), kindw1: ext1[r.kind], folder: f }, `${kw(r.kind)} into ${f}`);
      }
      const pairs = r.kinds.map((k) => `${kw(k)} in "${folderOf(k).label}"`).join(', ');
      return say('deskSort', { pairs }, pairs);
    }
    if (v === 'palette') {
      const parts = Object.entries(spec.want).map(([t, k]) => {
        const tp = spec.templates[t];
        const name = spec.rule.byColor ? `${tp.color} ${k === 1 ? tp.shape : lib.plural(tp.shape)}` : (k === 1 ? tp.shape : lib.plural(tp.shape));
        return `${k === 1 ? rng.pick(['one', 'a', 'a single', 'just one']) : lib.NUM[k] || k} ${name}`;
      });
      const list = parts.length === 1 ? parts[0] : `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]}`;
      return say('palette', { list }, list);
    }
    const r = spec.rule;
    const one = whatOf(rng, spec, true);
    const many = whatOf(rng, spec, false);
    if (v === 'collect') {
      const tgt = spec.containers[r.target || 0];
      const box = tgt.side ? boxRef(rng, tgt) : 'the box';
      if (r.mode === 'remove') return say('remove', { one, many }, `${many} out of the box`);
      if (r.mode === 'count') {
        const k = r.k;
        const kmany = k === 1 ? one : many;
        return say('count', { k: rng.bool(0.5) ? lib.NUM[k] : String(k), kmany, many, box, box_: lib.I.ucFirst(box) }, `exactly ${k} ${kmany} in ${box}`);
      }
      return say('collectIn', { one, many, box }, `${many} into ${box}`);
    }
    if (r.mode === 'split') {
      const [a, b] = spec.containers.map((c) => `"${c.label}"`);
      return say('split', { one, many, a, b }, `${many}: ${a}, rest: ${b}`);
    }
    if (r.mode === 'spatial') {
      const a = boxRef(rng, spec.containers[r.target]);
      const b = boxRef(rng, spec.containers[1 - r.target]);
      return say('spatial', { one, many, a, b }, `${many}: ${a}; rest: ${b}`);
    }
    const labels = spec.containers.map((c) => `"${c.label}"`).join(', ');
    return say('each', { kind: r.kind, labels }, `shapes by ${r.kind}`);
  }

  Object.assign(lib, { describe, instructionOf, sideName, whatOf });
})();
