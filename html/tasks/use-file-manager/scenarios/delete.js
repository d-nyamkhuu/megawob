/*
 * use-file-manager / delete: delete named files.
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('use-file-manager');
  const { ancestors, listText, chooseSel, deleteItems, fileIn, fill, foldersAt, isDeleted, itemOf, KINDS, navStep, parentOf,
    pathText, pick, ROOT, say, setError } = fam.lib;
  const { clone, quote: q } = env.util;

  env.scenario('use-file-manager', {
    name: 'delete',
    goal(rng, spec, tree) {
    const P = rng.pick(foldersAt(spec, (f) => f.id !== ROOT)).id;
    while (fileIn(spec, P).length < (spec.level ? 3 : spec.ood ? 7 : 4)) tree.addFile(P);
    const files = fileIn(spec, P);
    let T;
    let kind = null;
    const byKind = {};
    for (const f of files) (byKind[f.kind] ||= []).push(f.id);
    const kinds = Object.keys(byKind).filter((k) => byKind[k].length >= 2 && byKind[k].length <= 3 && byKind[k].length < files.length - 1);
    if (!spec.level && kinds.length && rng.bool(0.3)) {
      kind = rng.pick(kinds);
      T = byKind[kind];
    } else T = rng.sample(files, spec.level ? rng.fork('lvl-n').int(1, spec.level === 'easy' ? 1 : 2) : rng.int(1, spec.ood ? 4 : 3)).map((f) => f.id);
    spec.cwd0 = rng.bool(0.7) ? P : rng.pick(spec.folders.filter((f) => f.id !== P)).id;
    spec.goal = { files: T, kind, folder: P };
    spec.keys = rng.bool(0.25);
    spec.route = spec.keys ? 'key' : rng.pick(['menu', 'menu', 'toolbar']);
    if (spec.level === 'easy') { spec.keys = false; if (spec.route === 'key') spec.route = 'menu'; }
    return true;
    },
    init(spec, m, mode, rng) {
      const g = spec.goal;
      const at = (folder) => ({ ...m, cwd: folder, expanded: [...new Set(m.expanded.concat(ancestors(spec, folder)))] });
      if (mode === 'partial' && g.files.length > 1) {
        m = at(g.folder);
        const done = rng.sample(g.files, rng.int(1, g.files.length - 1));
        m = { ...deleteItems(m, spec, done), wrongs: 0 };
      } else if (mode === 'partial') {
        m = { ...at(g.folder), selected: [g.files[0]], anchor: g.files[0] };
      } else if (mode === 'wrong') {
        m = at(g.folder);
        const non = spec.files.filter((f) => f.parent === g.folder && !g.files.includes(f.id)).map((f) => f.id);
        if (non.length) m = { ...deleteItems(m, spec, [rng.pick(non)]), wrongs: 0 };
      }
      return m;
    },
    result(m, spec) {
      const g = spec.goal;
      return setError(m.deleted, g.files);
    },
    solve(spec, m) {
      const g = spec.goal;
      return { ...m, deleted: [...new Set(m.deleted.filter((x) => g.files.includes(x)).concat(g.files))] };
    },
    plan(m, spec) {
      const g = spec.goal;
      const remaining = g.files.filter((x) => !isDeleted(m, x));
      if (!remaining.length) return null;
      const P = parentOf(m, spec, remaining[0]);
      const nav = navStep(m, spec, P);
      if (nav) return nav;
      const want = remaining.filter((x) => parentOf(m, spec, x) === P);
      const sel = chooseSel(m, spec, want, spec.selRoute || 'ctrl');
      if (sel) return sel;
      if (spec.route === 'key') return { key: 'Delete' };
      if (spec.route === 'toolbar') return { click: { trash: true } };
      if (m.menu && want.includes(m.menu.on)) return { click: { menuItem: 'delete' } };
      return { rightclick: { tile: want[0] } };
    },
    instruction(spec, rng) {
      const g = spec.goal;
      const fname = (id) => q(itemOf(spec, id).name);
      const files = listText(g.files.map(fname));
      const vars = { files, path: q(pathText(rng, spec, g.folder)), folder: q(itemOf(spec, g.folder).name) };
      let T = ['Delete {files} from {path}.', 'Move {files} in {folder} to the trash.', 'Remove {files} (in {path}).', 'Get rid of {files} in {folder}.',
        'Trash {files} from {path}.', 'Clean up {path}: delete {files}.', 'Have {files} in {path} deleted.',
        '{files} in {folder} must go.', 'Put {files} from {folder} in the bin.', 'Clear {files} out of {path}.',
        'Deletion: {files} in {folder}.', '{path} has {files} to delete.', 'I want {files} in {path} gone.'];
      if (g.kind) {
        vars.kind = KINDS[g.kind][2];
        T = ['Delete all the {kind} in {path}.', 'Remove every {kind_s} from {folder}.', 'Clean up {path}: the {kind} have to go.',
          'Trash the {kind} in the {folder} folder.', 'Get rid of all {kind} inside {path}.', 'Delete each {kind_s} stored in {folder}.',
          'I want all {kind} in {path} deleted.', '{folder} needs every {kind_s} removed.',
          'Have every {kind_s} in {folder} deleted.', 'Put all {kind} in {folder} in the bin.',
          'Empty {path} of all its {kind}.', 'All {kind} in {path} are for deletion.',
          'Time to trash all {kind} in {folder}.', 'Every {kind_s} in {folder}: trash it.',
          'Deletion request: all {kind} in {path}.', 'Make {path} free of {kind}: delete all.'];
        vars.kind_s = KINDS[g.kind][1];
      }
      return say(rng, spec, fill(pick(rng, spec, T), vars), { terse: `delete ${files}` });
    },
    silent(next, prev, spec, rng) {
      const m = clone(next);
      let out = null;
      const added = next.deleted.filter((x) => !prev.deleted.includes(x));
      if (!added.length) return null;
      const id = rng.pick(added); // the toast still counts it; the file is back
      out = { ...m, deleted: m.deleted.filter((x) => x !== id) };
      return out;
    },
    retarget(spec, model, rng) {
      const g = spec.goal;
      const n = clone(spec);
      const pool = fileIn(spec, g.folder).filter((f) => !g.files.includes(f.id) && !isDeleted(model, f.id));
      if (!pool.length) return null;
      n.goal = { ...g, files: g.files.concat([rng.pick(pool).id]), kind: null };
      return n;
    },
  });
})();
