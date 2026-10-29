/*
 * use-file-manager / move: move files into a folder.
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('use-file-manager');
  const { ancestors, listText, chooseSel, EXTRA, fileIn, fill, isDeleted, itemOf, moveItems, navStep, parentOf, pathText,
    pick, pickDest, sameSet, say } = fam.lib;
  const { clone, quote: q } = env.util;

  const V = env.scenariosOf('use-file-manager');

  env.scenario('use-file-manager', {
    name: 'move',
    goal(rng, spec, tree) {
    const route = spec.level === 'easy' ? 'drag' : rng.pick(['drag', 'spring', 'spring', 'cut']);
    const pd = pickDest(rng, spec, route);
    if (!pd) return false;
    const { P, D } = pd;
    while (fileIn(spec, P).length < (spec.ood ? 5 : 3)) tree.addFile(P);
    const T = rng.sample(fileIn(spec, P), spec.level ? rng.fork('lvl-n').int(1, spec.level === 'easy' ? 1 : 2) : rng.int(1, spec.ood ? 3 : 2)).map((f) => f.id);
    spec.cwd0 = P;
    spec.goal = { files: T, dest: D, from: P };
    spec.route = route;
    return true;
    },
    init(spec, m, mode, rng) {
      const g = spec.goal;
      if (mode === 'partial') {
        if (g.files.length > 1) m = moveItems(m, spec, [g.files[0]], g.dest);
        else m = { ...m, selected: g.files.slice(), clip: spec.route === 'cut' ? { ids: g.files.slice() } : null };
      } else if (mode === 'wrong') {
        const wrongDest = spec.folders.filter((f) => f.id !== g.dest && f.id !== g.from);
        m = moveItems(m, spec, [g.files[0]], rng.pick(wrongDest).id);
      }
      return m;
    },
    result(m, spec) {
      const g = spec.goal;
      let bad = 0;
      for (const f of spec.files) {
        const here = isDeleted(m, f.id) ? null : parentOf(m, spec, f.id);
        if (g.files.includes(f.id)) bad += here === g.dest ? 0 : 1;
        else bad += here === f.parent ? 0 : EXTRA;
      }
      return Math.min(1, bad / g.files.length);
    },
    solve(spec, m) {
      const g = spec.goal;
      const parent = { ...m.parent };
      for (const f of spec.files) {
        if (g.files.includes(f.id)) parent[f.id] = g.dest;
        else delete parent[f.id];
      }
      return { ...m, parent, deleted: m.deleted.filter((x) => !spec.files.some((f) => f.id === x)) };
    },
    plan(m, spec) {
      const g = spec.goal;
      const remaining = g.files.filter((x) => parentOf(m, spec, x) !== g.dest && !isDeleted(m, x));
      if (!remaining.length) return null;
      const P = parentOf(m, spec, remaining[0]);
      if (spec.route === 'cut') {
        if (m.clip && sameSet(m.clip.ids, remaining)) {
          const nav = navStep(m, spec, g.dest);
          if (nav) return nav;
          if (m.menu && m.menu.on === 'bg') return { click: { menuItem: 'paste' } };
          return { rightclick: { bg: true } };
        }
        const nav = navStep(m, spec, P);
        if (nav) return nav;
        const sel = chooseSel(m, spec, remaining, 'ctrl');
        if (sel) return sel;
        if (m.menu && remaining.includes(m.menu.on)) return { click: { menuItem: 'cut' } };
        return { rightclick: { tile: remaining[0] } };
      }
      if (m.drag && m.drag.ids && sameSet(m.drag.ids, remaining)) {
        for (const a of ancestors(spec, g.dest)) {
          if (!m.expanded.includes(a)) {
            const over = m.drag.over;
            return over && over.kind === 'tree' && over.id === a && m.drag.active ? { wait: true } : { move: { tree: a } };
          }
        }
        return { up: { tree: g.dest } };
      }
      const nav = navStep(m, spec, P);
      if (nav) return nav;
      const sel = chooseSel(m, spec, remaining, spec.selRoute || 'ctrl');
      if (sel) return sel;
      if (spec.route === 'drag' && parentOf(m, spec, g.dest) === m.cwd) return { drag: [{ tile: remaining[0] }, { tile: g.dest }] };
      if (ancestors(spec, g.dest).every((a) => m.expanded.includes(a))) return { drag: [{ tile: remaining[0] }, { tree: g.dest }] };
      return { down: { tile: remaining[0] } };
    },
    instruction(spec, rng) {
      const g = spec.goal;
      const fname = (id) => q(itemOf(spec, id).name);
      const files = listText(g.files.map(fname));
      const vars = { files, dest: q(itemOf(spec, g.dest).name), destPath: q(pathText(rng, spec, g.dest)), folder: q(itemOf(spec, g.from).name) };
      const T = ['Move {files} into the {dest} folder ({destPath}).', 'Put {files} in {destPath}.', 'Drag {files} into {destPath}.',
        'File {files} under {destPath}.', '{files} belong in {destPath}; move them there.', 'Relocate {files} from {folder} to {destPath}.',
        'Move {files} to the folder {destPath}.',
        'Make {destPath} a new home for {files}.',
        'Set the location of {files} to {destPath}.',
        'Take {files} out of {folder} into {destPath}.',
        'Move {files} by dragging to {destPath}.',
        'Send {files} over to {destPath}.',
        'To {destPath} with {files}.',
        'Drag {files} so they end up in {destPath}.',
        'Get {files} moved to {destPath}.'];
      return say(rng, spec, fill(pick(rng, spec, T), vars), { terse: `mv ${files} → ${vars.destPath}` });
    },
    silent(next, prev, spec, rng) {
      const m = clone(next);
      let out = null;
      const moved = spec.files.map((f) => f.id).filter((id) => parentOf(next, spec, id) !== parentOf(prev, spec, id));
      if (!moved.length) return null;
      const id = rng.pick(moved);
      const parent = { ...m.parent };
      if (parentOf(prev, spec, id) === itemOf(spec, id).parent) delete parent[id];
      else parent[id] = parentOf(prev, spec, id);
      out = { ...m, parent };
      return out;
    },
    retarget: V.copy.retarget,
  });
})();
