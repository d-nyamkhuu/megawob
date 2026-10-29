/*
 * use-file-manager / navigate: make a folder the current one.
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('use-file-manager');
  const { ancestors, dist, fill, foldersAt, itemOf, navigate, navStep, pathText, pathTo, pick, ROOT, say } = fam.lib;
  const { clone, quote: q } = env.util;

  env.scenario('use-file-manager', {
    name: 'navigate',
    goal(rng, spec) {
    const cands = foldersAt(spec, (f) => f.id !== ROOT);
    const G = rng.pick(cands).id;
    const far = spec.folders.filter((f) => dist(spec, f.id, G) >= (spec.ood ? 3 : 2));
    if (!far.length) return false;
    spec.cwd0 = rng.pick(far).id;
    spec.goal = { folder: G };
    spec.route = rng.bool(0.6) ? 'pane' : 'tree';
    return true;
    },
    init(spec, m, mode, rng) {
      const g = spec.goal;
      const at = (folder) => ({ ...m, cwd: folder, expanded: [...new Set(m.expanded.concat(ancestors(spec, folder)))] });
      if (mode === 'partial') {
        const near = spec.folders.filter((f) => dist(spec, f.id, g.folder) === 1);
        m = at(rng.pick(near).id);
      } else if (mode === 'wrong') {
        const sib = spec.folders.filter((f) => f.id !== g.folder && dist(spec, f.id, g.folder) === 2);
        if (sib.length) m = at(rng.pick(sib).id);
      }
      return m;
    },
    result(m, spec, pen) {
      const g = spec.goal;
      return Math.min(1, dist(spec, m.cwd, g.folder) / 3 + pen);
    },
    solve(spec, m) {
      const g = spec.goal;
      return navigate(m, spec, g.folder);
    },
    plan(m, spec) {
      const g = spec.goal;
      return navStep(m, spec, g.folder);
    },
    instruction(spec, rng) {
      const g = spec.goal;
      const f = itemOf(spec, g.folder);
      const vars = { name: q(f.name), path: q(pathText(rng, spec, g.folder)), parent: q(itemOf(spec, f.parent).name) };
      const up = pathTo(spec, spec.cwd0).includes(g.folder);
      const T = up
        ? ['Go back up to the {name} folder.', 'Navigate up to {path}.', 'Return to the {name} folder.', 'Jump back to {path} using the path bar or the tree.',
          'Head up to {path}.', 'Make {name} the current folder again.', 'Set the current folder back to {name}.',
          'Revisit {path} via the path bar or tree.', 'Go up until you reach {path}.', 'Resume browsing in {name}.',
          'I want {name} as my folder again.', 'Go to the ancestor folder {name}.',
          'Use the path bar or tree to return to {path}.', 'Back up the hierarchy to {path}.',
          'Switch back to browsing at {path}.', '{name} should be open again.', 'The folder to return to is {path}.',
          'Take me back to {path}.', 'Work your way back from here to {path}.', 'Move up to {path} and stay there.',
          'Browse {name} again after moving up.']
        : ['Go to the {name} folder ({path}).', 'Navigate to {path}.', 'Open the folder {path}.', 'Browse to the {name} folder inside {parent}.',
          'Head over to {path} in the file browser.', 'Make {path} the current folder.', 'Show the contents of {path}.',
          'Use {path} as your current folder.', '{path} is the folder to enter.', 'View {path} by opening the folder.',
          'Switch folders to {path}.', 'Let me browse inside {path}.', 'Take me to {name} at {path}.',
          'Let me see inside {path}.', 'The folder I want open is {path}.', 'Start browsing from {path}.'];
      return say(rng, spec, fill(pick(rng, spec, T), vars), { terse: `cd ${pathText(rng, spec, g.folder)}` });
    },
    silent(next, prev, spec, rng) {
      const m = clone(next);
      let out = null;
      if (next.cwd === prev.cwd) return null;
      const f = spec.folders.find((x) => x.id === next.cwd);
      const sibs = spec.folders.filter((x) => x.parent === f.parent && x.id !== f.id);
      const to = sibs.length ? rng.pick(sibs).id : f.parent;
      if (!to) return null;
      out = { ...m, cwd: to, expanded: [...new Set(m.expanded.concat(ancestors(spec, to)))] };
      return out;
    },
    retarget(spec, model, rng) {
      const g = spec.goal;
      const n = clone(spec);
      const far = spec.folders.filter((f) => f.id !== ROOT && f.id !== g.folder && f.id !== model.cwd && dist(spec, f.id, model.cwd) >= 2);
      const pool = far.length ? far : spec.folders.filter((f) => f.id !== ROOT && f.id !== g.folder && f.id !== model.cwd);
      if (!pool.length) return null;
      n.goal = { folder: rng.pick(pool).id };
      return n;
    },
  });
})();
