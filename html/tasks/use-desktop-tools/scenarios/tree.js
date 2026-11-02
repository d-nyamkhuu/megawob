/*
 * use-desktop-tools / tree: navigate-tree, open folders to find the named file and click it.
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('use-desktop-tools');
  const { ancestorsStatic, duplicateFile, expanded, extOfName, fileNameIn, folderChain, freshFile, isLoaded, isOpen, lazyOf, live, navErr, nodeOf, openPath, othersOf, pathIn, recoverable, rows, sampleNodes, say, sceneOpen, sceneTarget, scrollStep, tickTree, toggleFolder, tpl, treeBase, treeCfg, treeNav, where } = fam.lib;
  const { quote: q } = env.util;

  function sampleTree(rng, opts) {
    const crng = rng.fork('content');
    const spec = { lazy: [] };
    spec.nodes = sampleNodes(rng, crng, treeCfg(opts.ood, false, opts.level), opts.csplit);
    lazyOf(rng, spec, opts);
    const files = spec.nodes.filter((n) => !n.dir);
    const nested = files.filter((n) => n.depth > 0);
    const deep = files.filter((n) => n.depth > 1);
    let t;
    if (opts.startMode === 'partial' && deep.length) t = rng.pick(deep);
    else if (opts.startMode === 'scene') t = sceneTarget(rng.fork('scene'), spec, nested.length ? nested : files);
    else if (opts.ood && deep.length) t = rng.pick(deep);
    else t = rng.bool(0.88) ? rng.pick(nested) : rng.pick(files);
    spec.target = t.id;
    const ext = extOfName(t.name);
    const sibs = files.filter((n) => n.parent === t.parent && extOfName(n.name) === ext);
    spec.goal = t.parent !== null && ext && sibs.length === 1 && rng.bool(0.3) ? 'where' : 'name';
    spec.keys = !opts.ood && rng.bool(0.25);
    spec.recoverable = recoverable(rng, opts);
    return spec;
  }

  function treeInit(spec, rng) {
    let m = { ...treeBase(), clicks: [], wrong: 0 };
    const anc = ancestorsStatic(spec, spec.target);
    const ancSet = new Set(anc);
    const decoys = spec.nodes.filter((n) => n.dir && n.depth === 0 && !ancSet.has(n.id));
    if (spec.startMode === 'scene') return sceneOpen(m, spec, rng.fork('scene'));
    if (spec.startMode === 'partial' && anc.length) return openPath(m, spec, anc.slice(0, Math.max(1, anc.length - 1)));
    if (spec.startMode === 'wrong') {
      const others = spec.nodes.filter((n) => !n.dir && n.id !== spec.target);
      if (spec.recoverable && others.length) {
        const ext = extOfName(nodeOf(spec, spec.target).name);
        const close = others.filter((n) => n.parent === nodeOf(spec, spec.target).parent || extOfName(n.name) === ext);
        const w = rng.pick(close.length ? close : others);
        m = openPath(m, spec, ancestorsStatic(spec, w.id));
        return { ...m, clicks: [w.id], wrong: 1, sel: w.id };
      }
      return openPath(m, spec, rng.sample(decoys, Math.min(2, decoys.length)).map((n) => n.id));
    }
    if (decoys.length && rng.bool(0.35)) m = openPath(m, spec, [rng.pick(decoys).id]);
    return m;
  }

  const activeWrong = (m, spec) => m.clicks.some((k) => k !== spec.target);

  function treeError(m, spec) {
    if (activeWrong(m, spec)) return 1;
    if (m.clicks.includes(spec.target)) return 0;
    const anc = ancestorsStatic(spec, spec.target);
    if (!anc.length) return 1;
    return 0.5 + 0.5 * navErr(m, spec, spec.target);
  }

  function treeClickFile(m, spec, id) {
    return { ...m, sel: id, clicks: m.clicks.concat([id]), wrong: m.wrong + (id !== spec.target ? 1 : 0) };
  }
  const treeBack = (m, spec) => ({ ...m, clicks: m.clicks.filter((k) => k === spec.target) });
  const treeKey = (m, spec, key, now) => treeNav(m, spec, key, now, (mm, id) => treeClickFile(mm, spec, id));
  const treeLimit = (spec) => (spec.recoverable ? 2 : 1);

  function treePlan(m, spec) {
    if (m.wrong >= treeLimit(spec)) return null;
    if (activeWrong(m, spec)) return spec.recoverable ? { click: { back: true } } : null;
    if (m.clicks.includes(spec.target)) return null;
    const goalRow = (() => {
      for (const a of ancestorsStatic(spec, spec.target)) {
        if (!isOpen(m, a)) return a;
        if (!isLoaded(m, spec, a)) return 'wait';
      }
      return spec.target;
    })();
    if (goalRow === 'wait') return { wait: true };
    if (spec.keys && m.sel !== null) {
      const R = rows(m, spec);
      const i = R.findIndex((r) => r.id === m.sel);
      const j = R.findIndex((r) => r.id === goalRow);
      if (i >= 0 && j >= 0) {
        if (i !== j) return { key: i < j ? 'ArrowDown' : 'ArrowUp' };
        return { key: goalRow === spec.target ? 'Enter' : 'ArrowRight' };
      }
    }
    return scrollStep(m, spec, goalRow) || { click: { node: goalRow } };
  }

  const T_TREE = ['Navigate through the file tree and click the file named {f}.',
    'Find the file {f} in the tree and open it.', 'Open {f}; it is in one of the folders on the left.',
    'Expand the folders as needed and click {f}.', 'Locate {f} in the explorer and open it.',
    'Open the file called {f}.', 'Use the file tree to open {f}.', 'Open the file {f}, which is somewhere in these folders.',
    'Please open {f} from the file explorer.', 'Work through this tree to reach and open {f}.',
    'Follow this file tree until you can open {f}.', 'For {f}, expand folders as needed and open the file.',
    'Browse the tree for {f}, then open that file.', 'Open {f} after revealing it in the tree.',
    'Choose {f} from the tree to open the file.', 'The file to open through the tree is {f}.',
    '{f} is the name to find and open in the tree.', 'When you reach {f} in the tree, open the file.',
    'Please open the tree entry bearing the name {f}.', 'Start in the explorer and get {f} open.',
    'The request is for {f}; open it in the tree.', 'In this tree, {f} should be opened.',
    'Look in the tree for a file named {f} to open.', 'Get to {f} via folders as needed, then open it.',
    'Find and click the entry for {f} in the tree.', 'The task is to open {f} using this tree.',
    'Use {f} as the filename to open in the tree.'];
  const T_TREE_WHERE = ['Open the {kind} file in the {d} folder.', 'Look inside {d} and click its only {kind} file.',
    'Find the {kind} file that lives in {d} and open it.', 'Click the only {kind} file in the {d} folder.',
    'Go into {d} and open the {kind} file there.', 'In the file tree, open the {kind} inside {d}.',
    'The file to open is the only {kind} file in {d}.', 'Open a file in {d} using its {kind} extension.',
    'From the files in {d}, open the one of type {kind}.', 'Choose the {kind} file from {d} to open it.',
    'The {kind} extension marks the file to open in {d}.', 'In {d}, the {kind} file needs to be opened.',
    'Open the file whose extension is {kind} in {d}.'];

  // Exposed for widgets.
  Object.assign(fam.helpers, { treeClickFile, treeBack, treeKey });

  env.scenario('use-desktop-tools', {
    name: 'tree',
    sample: sampleTree,
    init: treeInit,
    error: treeError,
    plan: treePlan,
    inputs: (spec) => (spec.keys ? ['pointer', 'keyboard', 'wheel'] : ['pointer', 'wheel']),
    tick: (model, spec, dtMs, nowMs) => tickTree(model, spec, nowMs),
    ended: (model, spec) => (model.wrong >= treeLimit(spec) ? 'wrong-file' : null),
    solve(spec, m) {
      const o = openPath({ ...m, loading: {} }, spec, ancestorsStatic(spec, spec.target));
      return { ...o, clicks: [spec.target] };
    },
    instruction(spec, rng) {
      const t = nodeOf(spec, spec.target);
      const f = q(t.name);
      if (spec.goal === 'where') {
        const ext = extOfName(t.name);
        const kind = rng.pick([`.${ext}`, ext.toUpperCase()]);
        const d = q(nodeOf(spec, t.parent).name);
        return say(rng, spec, tpl(rng, spec, T_TREE_WHERE, { kind, d }), `${kind} in ${d}`,
          [`open the ${d} folder`, `click the ${kind} file`]);
      }
      return say(rng, spec, tpl(rng, spec, T_TREE, { f }), `open ${f}`, ['expand the folders that contain it', `click ${f}`]);
    },
    changed: (m) => m.clicks.length > 0,
    prepared: (m, spec, e) => (!activeWrong(m, spec) && ancestorsStatic(spec, spec.target).every((a) => expanded(m, spec, a)) ? 0 : e),
    confirmVerb: 'open it',
    prepareConfirm(jr, spec) {
      const t = nodeOf(spec, spec.target);
      if (t.parent === null) {
        const nested = spec.nodes.filter((n) => !n.dir && n.depth > 0);
        if (!nested.length) return false;
        spec.target = jr.pick(nested).id;
      }
      spec.goal = 'name';
    },
    ambiguous(jr, spec) {
      const pair = duplicateFile(jr, spec);
      if (!pair) return undefined;
      const [t, u] = pair;
      const f = q(t.name);
      return { mode: 'ambiguous', cands: [[where(spec, t)], [where(spec, u)]],
        others: othersOf(spec.nodes.filter((n) => n.dir).map((n) => n.name), folderChain(spec, t.parent), folderChain(spec, u.parent)),
        message: `There are two files named ${f}: one in ${where(spec, t)} and one in ${where(spec, u)}. Which one should I open?`,
        templates: T_TREE, vars: { f }, terse: `open ${f}` };
    },
    impossible(jr, spec) {
      const name = freshFile(jr, spec, new Set(spec.nodes.map((n) => n.name.toLowerCase())), fileNameIn);
      const f = q(name);
      return { mode: 'impossible', what: [name], message: `I can't do that: there is no file named ${name} in the tree.`, templates: T_TREE, vars: { f }, terse: `open ${f}` };
    },
    facts(model, spec, add) {
      const L = live(model, spec);
      const n = L.byId.get(spec.target);
      const par = n.parent === null ? null : L.byId.get(n.parent);
      add('File path', pathIn(L, spec.target), [n.name]);
      add('Folder', par ? par.name : 'root');
      add('Open folders', rows(model, spec, L).filter((r) => r.dir && isOpen(model, r.id)).length, null, ['expanded folders']);
    },
    silent(next, prev, spec, rng, cands) {
      if (next.clicks.includes(spec.target) && !prev.clicks.includes(spec.target)) {
        cands.push((m) => { m.clicks = m.clicks.filter((k) => k !== spec.target); m.sel = prev.sel; });
      }
      for (const id of next.open.filter((x) => !prev.open.includes(x))) {
        cands.push((m) => { m.open = m.open.filter((x) => x !== id); if (m.loading) delete m.loading[id]; });
      }
    },
    retarget(s, spec, model, rng) {
      const nodes = spec.nodes;
      const files = nodes.filter((n) => !n.dir && n.id !== spec.target && !model.clicks.includes(n.id));
      const nested = files.filter((n) => n.parent !== null);
      if (!files.length) return false;
      const t = rng.pick(nested.length ? nested : files);
      const ext = extOfName(t.name);
      s.target = t.id;
      s.goal = t.parent !== null && ext && nodes.filter((n) => !n.dir && n.parent === t.parent && extOfName(n.name) === ext).length === 1 && rng.bool(0.3) ? 'where' : 'name';
      return true;
    },
    simulate(m, spec, step, now, t) {
      if (step.click && t.back) m = treeBack(m, spec);
      else if (step.click) {
        const n = nodeOf(spec, t.node);
        m = n.dir ? { ...toggleFolder(m, spec, n.id, now), sel: n.id } : treeClickFile(m, spec, n.id);
      } else if (step.key) m = treeKey(m, spec, step.key, now);
      return m;
    },
  });
})();
