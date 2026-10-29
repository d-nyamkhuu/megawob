/*
 * use-file-manager / multidelete: delete a block or scatter of files in one operation.
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('use-file-manager');
  const { listText, fileIn, fill, foldersAt, isRange, itemOf, pathText, pick, pickSet, ROOT, say } = fam.lib;
  const { clone, quote: q } = env.util;

  const V = env.scenariosOf('use-file-manager');

  env.scenario('use-file-manager', {
    name: 'multidelete',
    goal(rng, spec, tree) {
    const f = rng.fork('multi');
    const P = f.pick(foldersAt(spec, (x) => x.id !== ROOT)).id;
    const k = spec.level ? 3 : f.int(3, spec.ood ? 5 : 4);
    while (fileIn(spec, P).length < k + 2) tree.addFile(P);
    const set = pickSet(f, spec, P, k, spec.level === 'easy' ? 'range' : f.pick(['range', 'scatter']));
    if (!set) return false;
    spec.cwd0 = f.bool(0.7) ? P : f.pick(spec.folders.filter((x) => x.id !== P)).id;
    spec.goal = { files: set.files, kind: null, folder: P };
    spec.selRoute = set.route;
    spec.route = 'menu';
    return true;
    },
    result: V.delete.result,
    solve: V.delete.solve,
    plan: V.delete.plan,
    instruction(spec, rng) {
      const g = spec.goal;
      const fname = (id) => q(itemOf(spec, id).name);
      const files = listText(g.files.map(fname));
      const vars = { files, path: q(pathText(rng, spec, g.folder)), folder: q(itemOf(spec, g.folder).name),
        a: fname(g.files[0]), b: fname(g.files[g.files.length - 1]), k: g.files.length };
      const T = spec.selRoute === 'shift'
        ? ['Delete the {k} files from {a} to {b} in {path} in one go (select them, then use the right-click menu).', 'In {folder}, delete {a}, {b} and every file between them with a single Delete.',
          'Select the run of files {a} … {b} in {path} and delete them all at once from the context menu.', 'Remove the files {a} through {b} in {folder} in one operation.',
          'Use a single Delete in {folder} for the whole run from {a} through {b}.',
          'From the context menu in {path}, delete the full run beginning at {a} and ending at {b} in one go.',
          'In {folder}, delete the run starting at {a} and ending at {b} in one operation.',
          'The block to remove in one deletion in {folder} has {a} and {b} as first and last files.',
          'Use the right-click menu in {path} for one deletion of the {k} files from {a} through {b}.',
          'Make one selection in {path} spanning {a} … {b}, then delete it once via the context menu.',
          'For a single Delete in {folder}, select {a} through {b}, including both ends.',
          'In {folder}, {a} and {b} mark the ends of the range to delete in one operation.',
          'Keep {a} through {b} selected in {folder} and remove them with a single Delete.']
        : ['Delete {files} from {path} in one go, using the right-click menu.', 'In {folder}, select {files} and delete them together with a single Delete.',
          'Trash {files} (in {path}) all at once from the context menu.', 'Remove {files} from {folder} in one operation.',
          'In {path}, use the right-click menu to delete {files} at once.',
          'Use a single Delete for {files}, selected together in {folder}.',
          '{files}, selected in {folder}, need a single Delete.',
          'Make a batch of {files} in {path} and delete via the context menu.',
          'In {folder}, delete one batch containing only {files}.',
          'One deletion in {folder} should remove {files} together.',
          'With {files} selected in {path}, delete via the right-click menu.',
          'Gather just {files} in {folder} for one Delete.',
          'From {path}, remove only {files} together via the context menu.',
          'The files to delete at once in {folder} are {files}.'];
      return say(rng, spec, fill(pick(rng, spec, T), vars), { terse: `delete ${files} (one go)` });
    },
    silent: V.delete.silent,
    retarget(spec, model, rng) {
      const g = spec.goal;
      const n = clone(spec);
      const opsDone = model.undo.some((u) => u.kind !== 'rename');
      if (opsDone || isRange(spec)) return null; // one batch: a second delete would end the episode
      const pool = fileIn(spec, g.folder).filter((f) => !g.files.includes(f.id));
      if (!pool.length) return null;
      n.goal = { ...g, files: g.files.concat([rng.pick(pool).id]) };
      return n;
    },
  });
})();
