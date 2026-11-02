/*
 * use-desktop-tools / move: drag a file into a nested, collapsed folder (spring-loaded folders).
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('use-desktop-tools');
  const { ancestorsStatic, expanded, FOLDER_NAMES, folderChain, folderName, freshPick, isLoaded, isOpen, kidsOf, lazyOf, live, nodeOf, openPath, othersOf, pathIn, revealStep, sampleNodes, say, scrollStep, tickTree, toggleFolder, tpl, treeBase, treeCfg } = fam.lib;
  const { quote: q } = env.util;

  function sampleMove(rng, opts) {
    const crng = rng.fork('content');
    const spec = {};
    for (let tries = 0; ; tries++) {
      spec.nodes = sampleNodes(rng, crng, treeCfg(opts.ood, true, opts.level, true), opts.csplit);
      const dirs = spec.nodes.filter((n) => n.dir && n.depth >= (opts.ood && tries < 30 ? 2 : 1));
      if (!dirs.length) continue;
      const dest = rng.pick(dirs);
      spec.dest = dest.id;
      const chain = new Set(ancestorsStatic(spec, dest.id).concat([dest.id]));
      const cands = spec.nodes.filter((n) => !n.dir && !ancestorsStatic(spec, n.id).some((a) => chain.has(a)));
      if (!cands.length) continue;
      const roots = cands.filter((n) => n.depth === 0);
      spec.file = (roots.length && rng.bool(0.5) ? rng.pick(roots) : rng.pick(cands)).id;
      break;
    }
    lazyOf(rng, spec, opts);
    spec.springMs = rng.pick([500, 800, 1300, 1700]);
    return spec;
  }

  const parentOf = (m, spec, id) => (m.parents && id in m.parents ? m.parents[id] : nodeOf(spec, id).parent);

  function moveInit(spec, rng) {
    let m = { ...treeBase(), parents: {}, drag: null };
    const chain = ancestorsStatic(spec, spec.dest);
    m = openPath(m, spec, ancestorsStatic(spec, spec.file));
    const decoys = spec.nodes.filter((n) => n.dir && n.depth === 0 && !chain.includes(n.id) && !m.open.includes(n.id));
    if (decoys.length && rng.bool(0.3)) m = openPath(m, spec, [rng.pick(decoys).id]);
    if (spec.startMode === 'partial') return openPath(m, spec, chain.slice(0, Math.max(1, chain.length - 1)));
    if (spec.startMode === 'wrong') {
      const ws = spec.nodes.filter((n) => n.dir && n.id !== spec.dest && !chain.includes(n.id) && n.id !== parentOf(m, spec, spec.file));
      if (ws.length) {
        const w = rng.pick(ws);
        m = openPath(m, spec, ancestorsStatic(spec, w.id).concat([w.id]));
        return { ...m, parents: { [spec.file]: w.id } };
      }
    }
    return m;
  }

  function moveError(m, spec) {
    if (parentOf(m, spec, spec.file) === spec.dest) return 0;
    const chain = ancestorsStatic(spec, spec.dest);
    let k = 0;
    while (k < chain.length && expanded(m, spec, chain[k])) k++;
    if (k < chain.length && isOpen(m, chain[k])) k += 0.5;
    const holding = m.drag && m.drag.id === spec.file ? 0.1 : 0;
    return 1 - 0.4 * (chain.length ? k / chain.length : 1) - holding;
  }

  const mvDown = (m, spec, id, now) => ({ ...m, sel: id, drag: { id, over: null, since: now, sprung: false } });
  function mvOver(m, over, now) {
    if (!m.drag || m.drag.over === over) return m;
    return { ...m, drag: { ...m.drag, over, since: now, sprung: false } };
  }
  function mvUp(m, spec, over) {
    if (!m.drag) return m;
    const id = m.drag.id;
    const out = { ...m, drag: null };
    if (over === undefined) return out;
    let to;
    if (over === 'root') to = null;
    else {
      const n = live(m, spec).byId.get(over);
      if (!n) return out;
      if (n.id === id) return out;
      to = n.dir ? n.id : n.parent;
    }
    if (to === parentOf(m, spec, id)) return out;
    return { ...out, parents: { ...(m.parents || {}), [id]: to } };
  }

  function movePlan(m, spec) {
    if (parentOf(m, spec, spec.file) === spec.dest) return m.drag ? { up: { node: spec.dest } } : null;
    if (!m.drag) return revealStep(m, spec, spec.file, (a) => ({ click: { node: a } })) || { down: { node: spec.file } };
    if (m.drag.id !== spec.file) return { up: { pane: 'tree' } };
    for (const c of ancestorsStatic(spec, spec.dest)) {
      if (!isOpen(m, c)) {
        const s = scrollStep(m, spec, c);
        if (s) return s;
        return m.drag.over === c ? { wait: true } : { move: { node: c } };
      }
      if (!isLoaded(m, spec, c)) return { wait: true };
    }
    return scrollStep(m, spec, spec.dest) || { up: { node: spec.dest } };
  }

  const T_MOVE = ['Move the file {f} into the {d} folder.', 'Drag {f} into {d}.', 'Put {f} in the folder {path}.',
    'File {f} under {path}.', 'Move {f} where it belongs: the {d} folder.', 'Relocate {f} to the {d} folder.',
    'Drag the file {f} onto the folder {path}.',
    'Move {f} so it is inside {d}.',
    '{f} should end up inside {d}.',
    'Use {path} as the new home of {f}.',
    'Take {f} and drop it into {d}.',
    'Make {d} the folder holding {f}.',
    'Drag {f} until it is in {path}.',
    'Change the folder for {f} to {path}.',
    'I want {f} moved into {d}.',
    'Folder {d} should contain {f}.',
    'Move {f} by dragging it into {d}.',
    'Place {f} within the contents of {d}.',
    'Get {f} into folder {path}.',
    'Have {f} moved to folder {path}.',
    'Give {f} a new location in {d}.'];

  function pathText(spec, id) {
    return ancestorsStatic(spec, id).concat([id]).map((x) => nodeOf(spec, x).name).join(' / ');
  }

  // Exposed for widgets.
  Object.assign(fam.helpers, { mvDown, mvOver, mvUp });

  const changed = (m, spec) => Object.entries(m.parents || {}).some(([id, p]) => nodeOf(spec, id) && nodeOf(spec, id).parent !== p);

  env.scenario('use-desktop-tools', {
    name: 'move',
    sample: sampleMove,
    init: moveInit,
    error: moveError,
    plan: movePlan,
    inputs: () => ['pointer', 'wheel'],
    tick: (model, spec, dtMs, nowMs) => tickTree(model, spec, nowMs),
    solve(spec, m) {
      const o = openPath({ ...m, drag: null, loading: {} }, spec, ancestorsStatic(spec, spec.dest));
      return { ...o, parents: { ...(o.parents || {}), [spec.file]: spec.dest } };
    },
    instruction(spec, rng) {
      const f = q(nodeOf(spec, spec.file).name);
      const d = q(nodeOf(spec, spec.dest).name);
      const path = q(pathText(spec, spec.dest));
      return say(rng, spec, tpl(rng, spec, T_MOVE, { f, d, path }), `${f} → ${d}`, [`drag ${f}`, `drop it on the ${d} folder`]);
    },
    changed,
    prepared(m, spec, e) {
      // every folder on the way to the destination is open (the file visible): only the drop is left
      return !changed(m, spec) && ancestorsStatic(spec, spec.dest).every((a) => expanded(m, spec, a)) ? 0 : e;
    },
    confirmVerb: 'move it',
    prepareConfirm(jr, spec) {
      spec.startMode = 'off'; // the chain to the destination must start closed
    },
    ambiguous(jr, spec) {
      const dest = nodeOf(spec, spec.dest);
      const us = spec.nodes.filter((n) => n.dir && n.id !== dest.id && n.parent !== dest.parent && n.parent !== null && dest.parent !== null
        && !ancestorsStatic(spec, spec.file).concat([spec.file]).includes(n.id));
      if (!us.length || dest.parent === null) return undefined;
      const u = jr.pick(us);
      u.name = dest.name;
      const f = q(nodeOf(spec, spec.file).name);
      const d = q(dest.name);
      return { mode: 'ambiguous', cands: [[folderName(spec, dest.parent)], [folderName(spec, u.parent)]],
        others: othersOf(spec.nodes.filter((n) => n.dir).map((n) => n.name), folderChain(spec, dest.parent), folderChain(spec, u.parent), [dest.name]),
        message: `There are two folders named ${d}: one in ${folderName(spec, dest.parent)} and one in ${folderName(spec, u.parent)}. Which one should I move ${f} into?`,
        templates: T_MOVE.filter((x) => !/\{path\}/.test(x)), vars: { f, d }, terse: `${f} → ${d}` };
    },
    impossible(jr, spec) {
      const name = freshPick(jr, FOLDER_NAMES, new Set(spec.nodes.map((n) => n.name.toLowerCase())));
      const f = q(nodeOf(spec, spec.file).name);
      const d = q(name);
      return { mode: 'impossible', what: [name], message: `I can't do that: there is no folder named ${name}.`,
        templates: T_MOVE.filter((x) => !/\{path\}/.test(x)), vars: { f, d }, terse: `${f} → ${d}` };
    },
    facts(model, spec, add) {
      const L = live(model, spec);
      const dest = L.byId.get(spec.dest);
      const fid = parentOf(model, spec, spec.file);
      const f = L.byId.get(spec.file);
      add('File path', pathIn(L, spec.file), [f.name]);
      add(`Items in ${dest.name}`, kidsOf(L, spec.dest).length, null, ['items in the folder']);
      add(`Files in ${dest.name}`, kidsOf(L, spec.dest).filter((x) => !x.dir).length, null, ['files in the folder']);
      if (fid === null) add('Files in the root', kidsOf(L, null).filter((x) => !x.dir).length);
    },
    silent(next, prev, spec, rng, cands) {
      if (parentOf(next, spec, spec.file) === spec.dest && parentOf(prev, spec, spec.file) !== spec.dest) {
        const up = nodeOf(spec, spec.dest).parent;
        cands.push((m) => { m.parents = { ...(m.parents || {}), [spec.file]: up }; });
      }
    },
    retarget(s, spec, model, rng) {
      const nodes = spec.nodes;
      const chain = new Set(ancestorsStatic(spec, spec.dest).concat([spec.dest]));
      const cands = nodes.filter((n) => !n.dir && n.id !== spec.file && !ancestorsStatic(spec, n.id).some((a) => chain.has(a)) && parentOf(model, spec, n.id) !== spec.dest);
      if (!cands.length) return false;
      s.file = rng.pick(cands).id;
      return true;
    },
    simulate(m, spec, step, now, t) {
      if (step.click) m = toggleFolder(m, spec, t.node, now);
      else if (step.down) m = mvDown(m, spec, t.node, now);
      else if (step.move) m = mvOver(m, t.node, now);
      else if (step.up) m = mvUp(m, spec, t.node === undefined ? 'root' : t.node);
      return m;
    },
  });
})();
