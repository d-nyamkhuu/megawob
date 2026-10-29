/*
 * use-file-manager / open: open a file.
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('use-file-manager');
  const { ancestors, dist, fileIn, fill, foldersAt, isDeleted, itemOf, navStep, parentOf, pathText, pick, ROOT, say } = fam.lib;
  const { clone, quote: q } = env.util;

  env.scenario('use-file-manager', {
    name: 'open',
    goal(rng, spec, tree) {
    const P = rng.pick(foldersAt(spec, (f) => f.id !== ROOT)).id;
    while (fileIn(spec, P).length < 3) tree.addFile(P);
    const F = rng.pick(fileIn(spec, P)).id;
    const others = spec.folders.filter((f) => dist(spec, f.id, P) >= 1);
    spec.cwd0 = rng.pick(others).id;
    spec.goal = { file: F };
    spec.route = rng.bool(0.6) ? 'pane' : 'tree';
    return true;
    },
    init(spec, m, mode, rng) {
      const g = spec.goal;
      const at = (folder) => ({ ...m, cwd: folder, expanded: [...new Set(m.expanded.concat(ancestors(spec, folder)))] });
      const P = parentOf(m, spec, g.file);
      if (mode === 'partial') m = at(P);
      else if (mode === 'wrong') {
        const others = spec.files.filter((f) => f.id !== g.file && f.parent !== P);
        if (others.length) {
          const o = rng.pick(others);
          m = { ...at(o.parent), viewer: o.id, opened: [o.id], selected: [o.id], anchor: o.id };
        }
      }
      return m;
    },
    result(m, spec, pen) {
      const g = spec.goal;
      if (isDeleted(m, g.file)) return 1;
      if (m.opened.includes(g.file)) return Math.min(1, pen);
      return Math.min(1, 0.25 + 0.75 * Math.min(1, dist(spec, m.cwd, parentOf(m, spec, g.file)) / 3) + pen);
    },
    solve(spec, m) {
      const g = spec.goal;
      return { ...m, viewer: g.file, opened: m.opened.concat([g.file]) };
    },
    plan(m, spec) {
      const g = spec.goal;
      const P = parentOf(m, spec, g.file);
      return navStep(m, spec, P) || { dblclick: { tile: g.file } };
    },
    instruction(spec, rng) {
      const g = spec.goal;
      const F = itemOf(spec, g.file);
      const vars = { file: q(F.name), path: q(pathText(rng, spec, F.parent)), folder: q(itemOf(spec, F.parent).name) };
      const T = ['Open {file} (it is in {path}).', 'Find {file} in {path} and open it.', 'Double-click to open the file {file} in {path}.',
        'Open the file {file} from the {folder} folder.', 'Preview {file}; you will find it under {path}.', 'I need to look at {file} in {path}. Open it.',
        'Open {file}, which lives in {folder}.',
        'Bring up a preview of {file} from {path}.',
        'The file I want opened is {file} in {path}.',
        '{file} is in {folder}. Open it for me.',
        'In the {folder} folder, preview {file}.',
        'I want to view {file} stored in {path}.',
        'Please go into {path} and open {file} for me.',
        'Once you reach {path}, preview {file}.',
        'Navigate to {folder}, then open {file}.'];
      return say(rng, spec, fill(pick(rng, spec, T), vars), { terse: `open ${F.name}`, steps: [`Go to ${vars.path}`, `double-click ${vars.file}`] });
    },
    silent(next, prev, spec, rng) {
      const g = spec.goal;
      const m = clone(next);
      let out = null;
      if (!next.opened.includes(g.file) || prev.opened.includes(g.file)) return null;
      out = { ...m, viewer: null, opened: m.opened.filter((x) => x !== g.file) };
      return out;
    },
    retarget(spec, model, rng) {
      const g = spec.goal;
      const n = clone(spec);
      const pool = spec.files.filter((f) => f.id !== g.file && !model.opened.includes(f.id) && !isDeleted(model, f.id));
      if (!pool.length) return null;
      n.goal = { file: rng.pick(pool).id };
      return n;
    },
  });
})();
