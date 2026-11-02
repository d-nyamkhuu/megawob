/*
 * use-file-manager / multimove: move a selection of files in one drag.
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('use-file-manager');
  const { listText, fileIn, fill, itemOf, pathText, pick, pickDest, pickSet, say } = fam.lib;
  const { quote: q } = env.util;

  const V = env.scenariosOf('use-file-manager');

  env.scenario('use-file-manager', {
    name: 'multimove',
    goal(rng, spec, tree) {
    const f = rng.fork('multi');
    const route = spec.level === 'easy' ? 'drag' : f.pick(['drag', 'spring', 'spring']);
    const pd = pickDest(f, spec, route);
    if (!pd) return false;
    const { P, D } = pd;
    const k = spec.level ? 3 : f.int(3, spec.ood ? 5 : 4);
    while (fileIn(spec, P).length < k + 2) tree.addFile(P);
    const set = pickSet(f, spec, P, k, spec.level === 'easy' ? 'range' : f.pick(['range', 'scatter']));
    if (!set) return false;
    spec.cwd0 = P;
    spec.goal = { files: set.files, dest: D, from: P };
    spec.selRoute = set.route;
    spec.route = route;
    return true;
    },
    result: V.move.result,
    solve: V.move.solve,
    plan: V.move.plan,
    instruction(spec, rng) {
      const g = spec.goal;
      const fname = (id) => q(itemOf(spec, id).name);
      const files = listText(g.files.map(fname));
      const vars = { files, dest: q(itemOf(spec, g.dest).name), destPath: q(pathText(rng, spec, g.dest)), folder: q(itemOf(spec, g.from).name),
        a: fname(g.files[0]), b: fname(g.files[g.files.length - 1]), k: g.files.length };
      const T = spec.selRoute === 'shift'
        ? ['Move the {k} files from {a} to {b} (as listed) into {destPath} in a single drag.', 'Drag {a}, {b} and the files between them into {destPath} all at once.',
          'Select everything from {a} through {b} and move it to {destPath} with one drag.', 'Put the run of files {a} … {b} in {destPath}; do it in one move.',
          'In one drag, send the {k} listed files from {a} through {b} into {destPath}.',
          'Take {a} and every file down to {b} together to {destPath} in one drag.',
          'The entire listed range {a} through {b} goes into {destPath} in one move.',
          'Choose the block starting at {a} and ending at {b}; drag it to {destPath}.',
          'Drop {a}, {b}, and all files listed between them into {destPath} at once.',
          'From {a} through {b}, move the full listed range to {destPath} in one drag.',
          'Make one drag into {destPath} with the {k} listed files {a} through {b}.',
          'To {destPath}, move the whole block bounded by {a} and {b} at once.',
          'Gather the listed files {a} through {b}; move the group to {destPath} at once.',
          'One drag to {destPath} must carry {a}, {b}, and every file listed between them.']
        : ['Move {files} into {destPath} with a single drag.', 'Drag {files} together into {destPath}, in one go.',
          'Select {files} and drop them all on {destPath} at once.', 'Relocate {files} to {destPath} in one move.',
          'Use one drag to send {files} into {destPath}.', 'In one move, put all of {files} in {destPath}.',
          'Take {files} together to {destPath} in one drag.', 'Keep {files} together for the drag into {destPath}.',
          'A single move should take {files} to {destPath}.', 'With {files} selected, drop all on {destPath} at once.',
          '{destPath} is the target for one drag of {files}.', 'Deliver {files} to {destPath} in one group move.',
          'Put {files} into {destPath} in one collective move.', 'One drop should place {files} into {destPath}.'];
      return say(rng, spec, fill(pick(rng, spec, T), vars), { terse: `mv ${files} → ${vars.destPath} (one drag)` });
    },
    silent: V.move.silent,
    retarget: V.copy.retarget,
  });
})();
