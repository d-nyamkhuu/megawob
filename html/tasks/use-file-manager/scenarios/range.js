/*
 * use-file-manager / range: a run of files selected with Shift, then one operation.
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('use-file-manager');
  const { listText, display, fileIn, fill, foldersAt, isFolder, itemOf, pathText, pathTo, pick, pickDest, ROOT, say } = fam.lib;
  const { quote: q } = env.util;

  function buildRange(rng, spec, tree, mix) {
    const f = rng.fork(mix ? 'rangemix' : 'range');
    const lv = spec.level;
    const act = lv === 'easy' ? f.pick(['move', 'delete']) : f.pick(['move', 'move', 'delete', 'copy']);
    let P;
    let D = null;
    let route;
    if (act === 'move') {
      route = lv === 'easy' ? 'drag' : f.pick(['drag', 'spring', 'spring', 'cut']);
      const pd = pickDest(f, spec, route);
      if (!pd) return false;
      P = pd.P;
      D = pd.D;
    } else if (act === 'copy') {
      route = 'drag';
      P = f.pick(foldersAt(spec, (x) => x.id !== ROOT)).id;
      const vis = new Set([ROOT, ...pathTo(spec, P)]);
      const pool = spec.folders.filter((x) => x.id !== P && vis.has(x.parent));
      if (!pool.length) return false;
      D = f.pick(pool).id;
    } else {
      route = f.pick(['menu', 'menu', 'toolbar']);
      P = f.pick(foldersAt(spec, (x) => x.id !== ROOT)).id;
    }
    // k: files in the run; the goal is the run (range) or the run minus `skip` plus `plus` (rangemix)
    const k = mix ? (lv === 'easy' ? 4 : lv === 'medium' ? 5 : f.int(4, spec.ood ? 7 : 6)) : lv === 'easy' ? 3 : lv === 'medium' ? 4 : f.int(3, spec.ood ? 6 : 5);
    const nSkip = !mix ? 0 : k >= 6 ? f.int(1, 2) : 1;
    const nPlus = !mix || lv === 'easy' ? 0 : k >= 6 && f.bool(0.4) ? 2 : 1;
    while (fileIn(spec, P).length < k + nPlus + 2) tree.addFile(P);
    const empty = { names: {}, parent: {}, deleted: [] };
    const order = display(empty, spec, P).filter((x) => !isFolder(x));
    if (order.length < k + nPlus + 1) return false;
    const a = f.int(0, order.length - k);
    const run = order.slice(a, a + k);
    const skip = nSkip ? f.sample(run.slice(1, -1), nSkip) : [];
    const outside = order.filter((x) => !run.includes(x));
    const plus = nPlus ? f.sample(outside, nPlus) : [];
    const files = order.filter((x) => (run.includes(x) && !skip.includes(x)) || plus.includes(x));
    if (files.length < 3) return false;
    spec.act = act;
    spec.cwd0 = act === 'delete' && !f.bool(0.7) ? f.pick(spec.folders.filter((x) => x.id !== P)).id : P;
    spec.goal = { files, from: P, folder: P, run: [run[0], run[run.length - 1]], skip: order.filter((x) => skip.includes(x)), plus: order.filter((x) => plus.includes(x)) };
    if (D) spec.goal.dest = D;
    spec.selRoute = 'shift';
    spec.route = route;
    return true;
  }

  env.scenario('use-file-manager', {
    name: 'range',
    goal(rng, spec, tree) {
      return buildRange(rng, spec, tree, false);
    },
    instruction(spec, rng) {
      const g = spec.goal;
      const fname = (id) => q(itemOf(spec, id).name);
      const mix = spec.scenario === 'rangemix';
      const vars = { a: fname(g.run[0]), b: fname(g.run[1]), folder: q(itemOf(spec, g.from).name), path: q(pathText(rng, spec, g.from)),
        skip: listText(g.skip.map(fname)), plus: listText(g.plus.map(fname)) };
      if (g.dest) Object.assign(vars, { dest: q(itemOf(spec, g.dest).name), destPath: q(pathText(rng, spec, g.dest)) });
      let sel = pick(rng, spec, mix
        ? ['the files from {a} to {b}, except {skip}', '{a} through {b} (as listed), leaving out {skip}', 'the run of files {a} … {b} without {skip}',
          'every file from {a} to {b} apart from {skip}', 'the files between {a} and {b} (both included) but not {skip}',
          'every listed file in {a} … {b} other than {skip}', '{a} and {b} plus the files between, minus {skip}',
          'all files in the {a} … {b} span, excluding {skip}', '{a} to {b} inclusive, with the exception of {skip}',
          'what remains of {a} … {b} without {skip}', 'the files {a} through {b} with {skip} set aside',
          'the full {a} … {b} block, keeping {skip} out', 'all but {skip} in the file range {a} through {b}',
          'the span beginning at {a} and ending at {b}, less {skip}',
          '{a}, {b} and the intervening files, barring {skip}', 'the {a} … {b} interval after filtering out {skip}',
          'the whole file range {a} … {b} save for {skip}']
        : ['the files from {a} to {b}, as they are listed', '{a}, {b} and every file between them', 'the run of files starting at {a} and ending at {b}',
          'everything from {a} through {b}', 'the consecutive files {a} … {b}',
          '{a} and all following files through {b}', 'each file in the displayed {a} … {b} span',
          '{a} through {b}, with both ends included', 'the full file run {a} … {b}',
          'all files bounded by and including {a} and {b}', 'the block whose ends are {a} and {b}',
          'the files {a} … {b}, endpoints included', 'the full stretch of files {a} through {b}',
          'each file from {a} up to and including {b}', 'the file interval {a} … {b} in full',
          'the files {a} … {b}, without gaps', 'the run with {a} first and {b} last',
          'the files between {a} and {b}, plus both', '{a} through {b}, taking every file in order']);
      sel = fill(sel, vars);
      if (g.plus.length) sel += fill(pick(rng, spec, [
        ', and also {plus}', ', plus {plus}', ' as well as {plus}', ', together with {plus}', ', and {plus} too',
        ', along with {plus}', ', {plus} included'
      ]), vars);
      vars.sel = sel;
      const T = spec.act === 'move'
        ? [
          'Move {sel} into {destPath}.', 'Put {sel} in {destPath}.', 'Relocate {sel} to {destPath}.',
          'File {sel} under {destPath}.', 'Move {sel} to the {dest} folder ({destPath}).',
          'Make {destPath} home for {sel}.', 'Have {sel} moved to {destPath}.', 'Send {sel} to {destPath}.'
        ]
        : spec.act === 'copy'
          ? ['Copy {sel} into {destPath}; the originals stay in {folder}.', 'Put a copy of {sel} in {destPath} (keep the originals).',
            'Duplicate {sel} into the {dest} folder, leaving the originals where they are.', 'Copy, do not move, {sel} to {destPath}.', 'Make copies of {sel} in {destPath}.',
            'Keep {sel} in {folder}; place copies in {destPath}.',
            '{destPath} should hold a copy of {sel}; retain the originals.',
            'For {sel}, keep originals and put copies in the {dest} folder.', 'In {destPath}, create a copy of {sel}.',
            'Leaving originals in place, copy {sel} to {destPath}.',
            'Copy {sel} from {folder} to {destPath}; keep originals.',
            'Leave {sel} where they are; copy them to the {dest} folder.']
          : [
            'Delete {sel} from {path}.', 'Trash {sel} in {folder}.', 'Remove {sel} (they are in {folder}).',
            'In {folder}, get rid of {sel}.', 'Clean up {path}: delete {sel}.', '{sel} in {path}: delete them.',
            'Delete this set in {path}: {sel}.', 'In {path}, delete only {sel}.', 'Delete from {folder}: {sel}.',
            'Discard {sel} in {folder}.', 'Have {sel} in {path} deleted.'
          ];
      return say(rng, spec, fill(pick(rng, spec, T), vars), { terse: `${spec.act} ${itemOf(spec, g.run[0]).name}..${itemOf(spec, g.run[1]).name}${g.dest ? ` → ${vars.destPath}` : ''}` });
    },
  });
  Object.assign(fam.lib, { buildRange });
})();
