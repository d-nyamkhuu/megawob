/*
 * use-file-manager / copy: copy files into a folder by Alt-dragging.
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('use-file-manager');
  const { listText, chooseSel, copyItems, dist, effective, fileIn, fill, foldersAt, isDeleted, itemOf, navStep, parentOf,
    pathText, pathTo, pick, ROOT, say } = fam.lib;
  const { clone, quote: q } = env.util;

  env.scenario('use-file-manager', {
    name: 'copy',
    goal(rng, spec, tree) {
    const f = rng.fork('multi');
    const P = f.pick(foldersAt(spec, (x) => x.id !== ROOT)).id;
    const vis = new Set([ROOT, ...pathTo(spec, P)]);
    const pool = spec.folders.filter((x) => x.id !== P && vis.has(x.parent));
    if (!pool.length) return false;
    const D = f.pick(pool).id;
    while (fileIn(spec, P).length < 3) tree.addFile(P);
    const n = spec.level ? f.int(1, spec.level === 'easy' ? 1 : 2) : f.int(1, spec.ood ? 3 : 2);
    const T = f.sample(fileIn(spec, P), n).map((x) => x.id);
    spec.cwd0 = P;
    spec.goal = { files: T, dest: D, from: P };
    spec.route = 'drag';
    return true;
    },
    init(spec, m, mode, rng) {
      const g = spec.goal;
      if (mode === 'partial') {
        if (g.files.length > 1) m = copyItems(m, spec, [g.files[0]], g.dest);
        else m = { ...m, selected: g.files.slice(), anchor: g.files[0] };
      } else if (mode === 'wrong') {
        const wrongDest = spec.folders.filter((f) => f.id !== g.dest && f.id !== g.from);
        m = copyItems(m, spec, [g.files[0]], rng.pick(wrongDest).id);
      }
      return m;
    },
    result(m, spec) {
      const g = spec.goal;
      let bad = 0;
      for (const f of spec.files) if ((isDeleted(m, f.id) ? null : parentOf(m, spec, f.id)) !== f.parent) bad++;
      const seen = new Set();
      for (const c of (m.copies || []).filter((id) => !isDeleted(m, id))) {
        const root = c.slice(1).split('_')[0];
        if (g.files.includes(root) && parentOf(m, spec, c) === g.dest && !seen.has(root)) seen.add(root);
        else bad++;
      }
      bad += g.files.filter((x) => !seen.has(x)).length;
      return Math.min(1, bad / g.files.length);
    },
    solve(spec, m) {
      const g = spec.goal;
      const parent = { ...m.parent };
      for (const f of spec.files) delete parent[f.id];
      for (const c of m.copies || []) delete parent[c];
      const copies = g.files.map((x) => `c${x}_1`);
      for (const c of copies) parent[c] = g.dest;
      return { ...m, copies, parent, deleted: m.deleted.filter((x) => !spec.files.some((f) => f.id === x)) };
    },
    plan(m, spec) {
      const g = spec.goal;
      const hasCopy = (x) => (m.copies || []).some((c) => c.slice(1).split('_')[0] === x && parentOf(m, spec, c) === g.dest && !isDeleted(m, c));
      const remaining = g.files.filter((x) => !hasCopy(x));
      if (!remaining.length) return null;
      const nav = navStep(m, spec, g.from);
      if (nav) return nav;
      const sel = chooseSel(m, spec, remaining, 'ctrl');
      if (sel) return sel;
      const to = parentOf(m, spec, g.dest) === m.cwd ? { tile: g.dest } : { tree: g.dest };
      return { drag: [{ tile: remaining[0] }, to], modifiers: ['Alt'] };
    },
    instruction(spec, rng) {
      const g = spec.goal;
      const fname = (id) => q(itemOf(spec, id).name);
      const files = listText(g.files.map(fname));
      const vars = { files, dest: q(itemOf(spec, g.dest).name), destPath: q(pathText(rng, spec, g.dest)), folder: q(itemOf(spec, g.from).name) };
      const T = ['Copy {files} into {destPath}; the originals stay in {folder}.', 'Put a copy of {files} in {destPath} (keep the originals).',
        'Duplicate {files} into the {dest} folder, leaving the originals where they are.', 'Copy, do not move, {files} to {destPath}.',
        'Make a copy of {files} in {destPath} by Alt-dragging.', 'Drag a copy of {files} to {destPath} (hold Alt so the originals remain).',
        'Leave {files} in {folder} and place a copy in {destPath}.',
        'The {dest} folder must receive a copy of {files}; keep the originals.',
        '{files} should be in both {folder} and {destPath}; make a copy.',
        'Keep {folder} as home for {files}; send a copy to {destPath}.',
        '{dest} needs a copy of {files}; the originals should stay put.',
        'Keep the originals; add a copy of {files} to the {dest} folder.',
        'Hold Alt during the drag of {files} to {destPath} to copy.',
        '{files} should reach {destPath} as a copy via an Alt-drag.',
        '{destPath} needs a copy of {files}, with no change to the originals.',
        'The originals should remain; copy {files} to {destPath}.',
        'When copying {files} to {destPath}, leave the originals in {folder}.',
        'Use an Alt-drag to give {destPath} a copy of {files}.',
        'Keep the source intact when adding {files} as a copy in {destPath}.',
        'Only the copy of {files} goes to {dest}; the originals stay put.',
        'Alt-drag {files} to {destPath}; keep the source intact.',
        'For {dest}, copy {files} without relocating the originals.',
        '{folder} must contain {files} after a copy reaches {destPath}.'];
      return say(rng, spec, fill(pick(rng, spec, T), vars), { terse: `cp ${files} → ${vars.destPath}` });
    },
    silent(next, prev, spec, rng) {
      const m = clone(next);
      let out = null;
      const made = (next.copies || []).filter((c) => !(prev.copies || []).includes(c));
      if (!made.length) return null;
      const id = rng.pick(made);
      const parent = { ...m.parent };
      delete parent[id];
      out = { ...m, copies: m.copies.filter((c) => c !== id), parent };
      return out;
    },
    retarget(spec, model, rng) {
      const g = spec.goal;
      const n = clone(spec);
      const vis = new Set([ROOT, ...pathTo(spec, g.from)]);
      const pool = spec.folders.filter((f) => f.id !== g.dest && f.id !== g.from && (effective(spec) !== 'copy' || vis.has(f.parent)));
      if (!pool.length) return null;
      const far = pool.filter((f) => dist(spec, f.id, g.from) >= 2);
      n.goal = { ...g, dest: rng.pick(far.length ? far : pool).id };
      return n;
    },
  });
})();
