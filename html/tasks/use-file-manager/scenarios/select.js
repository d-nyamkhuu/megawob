/*
 * use-file-manager / select: select a group, a range or a scatter of files.
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('use-file-manager');
  const { listText, C, display, fill, foldersAt, groups, isFolder, itemOf, KINDS, navStep, pick, ROOT, sameSet, say,
    selStep, setError } = fam.lib;
  const { clone, quote: q } = env.util;

  env.scenario('use-file-manager', {
    name: 'select',
    goal(rng, spec, tree) {
    spec.grouped = true;
    const P = rng.pick(foldersAt(spec, (f) => f.id !== ROOT)).id;
    const lv = spec.level;
    const nk = lv ? 2 : rng.int(2, spec.ood ? 4 : 3);
    const exts = rng.shuffle(C.FILE_EXTENSIONS.filter((e, i, a) => a.findIndex((x) => x.kind === e.kind) === i));
    // Rebuild P's files (in place, the list is shared with the tree): nk kinds, 2-5 files each.
    for (let i = spec.files.length - 1; i >= 0; i--) if (spec.files[i].parent === P) spec.files.splice(i, 1);
    for (const e of exts.slice(0, nk)) {
      const sameKind = C.FILE_EXTENSIONS.filter((x) => x.kind === e.kind);
      for (let i = lv ? rng.fork('lvl-sel').int(2, lv === 'easy' ? 3 : 4) : rng.int(2, spec.ood ? 7 : 5); i > 0; i--) tree.addFile(P, rng.pick(sameKind).ext);
    }
    const empty = { names: {}, parent: {}, deleted: [] };
    const gs = groups(empty, spec, P).filter((g) => g.kind !== 'folder');
    const order = display(empty, spec, P).filter((x) => !isFolder(x));
    const mode = lv === 'easy' ? 'group' : lv ? rng.fork('lvl-mode').pick(['group', 'group', 'groupbut', 'range']) : rng.pick(['group', 'group', 'groupbut', 'range', 'list']);
    const g = rng.pick(gs);
    let files;
    const goal = { mode };
    if (mode === 'group') { files = g.ids.slice(); goal.kind = g.kind; }
    else if (mode === 'groupbut') {
      if (g.ids.length < 3) return false;
      goal.except = [rng.pick(g.ids)];
      files = g.ids.filter((x) => !goal.except.includes(x));
      goal.kind = g.kind;
    } else if (mode === 'range') {
      const len = rng.int(3, Math.min(6, order.length - 1));
      const a = rng.int(0, order.length - len);
      files = order.slice(a, a + len);
    } else files = rng.sample(order, rng.int(2, Math.min(4, order.length - 1)));
    if (files.length >= order.length) return false;
    spec.cwd0 = P;
    goal.files = order.filter((x) => files.includes(x));
    spec.goal = goal;
    spec.route = mode === 'group' || mode === 'groupbut' ? (rng.bool(0.6) ? 'marquee' : 'shift') : mode === 'range' ? 'shift' : 'ctrl';
    if (spec.route === 'marquee') spec.view = 'icons';
    return true;
    },
    init(spec, m, mode, rng) {
      const g = spec.goal;
      const order = display(m, spec, m.cwd).filter((x) => !isFolder(x));
      if (mode === 'partial') m = { ...m, selected: rng.sample(g.files, Math.max(1, Math.floor(g.files.length / 2))) };
      else if (mode === 'wrong') {
        const non = order.filter((x) => !g.files.includes(x));
        m = { ...m, selected: rng.sample(non, Math.min(non.length, rng.int(1, 2))).concat(rng.sample(g.files, Math.floor(g.files.length / 3))) };
      }
      m.selected = display(m, spec, m.cwd).filter((x) => m.selected.includes(x));
      return m;
    },
    result(m, spec, pen) {
      const g = spec.goal;
      return Math.min(1, setError(m.selected, g.files) + pen);
    },
    solve(spec, m) {
      const g = spec.goal;
      return { ...m, cwd: spec.cwd0, selected: g.files.slice() };
    },
    plan(m, spec) {
      const g = spec.goal;
      const nav = navStep(m, spec, spec.cwd0);
      if (nav) return nav;
      return selStep(m, spec, g.files, spec.route);
    },
    instruction(spec, rng) {
      const g = spec.goal;
      const fname = (id) => q(itemOf(spec, id).name);
      const vars = { folder: q(itemOf(spec, spec.cwd0).name) };
      let T;
      if (g.mode === 'group' || g.mode === 'groupbut') {
        vars.kind = KINDS[g.kind][2];
        vars.kind_s = KINDS[g.kind][1];
        if (g.mode === 'group') {
          T = ['Select all the {kind} in this folder.', 'Select every {kind_s} here, and nothing else.', 'Highlight all {kind} in {folder}.',
            'Select the {kind} in {folder}.', 'Pick out all the {kind} (select them).', 'Make a selection of every {kind_s} in this folder.',
            'Use all {kind} here as the selection.', 'Leave just the {kind} here selected.',
            'In {folder}, select the full set of {kind}.', 'Include every {kind_s} here and no other items.',
            'Select the full {kind} group.', 'Select {kind}, with none missing or added.',
            'Build a selection from all {kind}.'];
        } else {
          vars.x = listText(g.except.map(fname));
          T = ['Select all {kind} except {x}.', 'Select every {kind_s} but {x}.', 'Highlight the {kind} in {folder}, leaving out {x}.',
            'Select all the {kind} apart from {x}.', 'Every {kind_s} other than {x} should be selected.', 'Pick all {kind} except {x}.',
            'Make {kind} minus {x} the selection.', 'Select {kind} with {x} left unselected.',
            'In {folder}, select {kind} without {x}.', 'Select the {kind} that are not {x}.'];
        }
      } else if (g.mode === 'range') {
        vars.a = fname(g.files[0]);
        vars.b = fname(g.files[g.files.length - 1]);
        T = ['Select the files from {a} to {b}, as they are listed.', 'Select {a}, {b} and every file between them.', 'Highlight the run of files starting at {a} and ending at {b}.',
          'Select everything from {a} through {b}.', 'Make a selection that spans {a} to {b} in the current order.', 'Select the consecutive files {a} … {b}.',
          'Select one block from {a} through {b}, inclusive.', 'Select the full span bounded by {a} and {b}.',
          'Let {a} and {b} mark the ends of one selected block.',
          'Select {a} through {b} with no gaps or extra files.', 'The selection must run from {a} through {b}.',
          'Select the displayed span {a} … {b}, endpoints included.',
          'Select a full block with {a} first and {b} last.'];
      } else {
        vars.files = listText(g.files.map(fname));
        T = ['Select {files}.', 'Select only {files}.', 'Highlight {files} together.', 'Select these files at once: {files}.',
          'Make a multi-selection of {files}.', 'Pick {files} (and nothing else).', 'Set the selection to {files}.',
          'Leave just {files} selected.', 'The selection is {files}.', 'Files to pick: {files}.',
          '{files} alone stay selected.'];
      }
      return say(rng, spec, fill(pick(rng, spec, T), vars), {});
    },
    silent(next, prev, spec, rng) {
      const m = clone(next);
      let out = null;
      if (next.selected.length < 2) return null;
      const id = rng.pick(next.selected);
      out = { ...m, selected: m.selected.filter((x) => x !== id) };
      return out;
    },
    retarget(spec, model, rng) {
      const g = spec.goal;
      const n = clone(spec);
      const order = display(model, spec, spec.cwd0).filter((x) => !isFolder(x));
      for (let t = 0; t < 20; t++) {
        const files = rng.sample(order, rng.int(2, Math.min(4, order.length - 1))).sort((a, b) => order.indexOf(a) - order.indexOf(b));
        if (!sameSet(files, model.selected) && !sameSet(files, g.files)) {
          n.goal = { mode: 'list', files };
          n.route = 'ctrl';
          return n;
        }
      }
      return null;
    },
  });
})();
