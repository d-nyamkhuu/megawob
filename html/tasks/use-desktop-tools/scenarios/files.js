/*
 * use-desktop-tools / files: rename, delete or create a folder in the file tree.
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('use-desktop-tools');
  const { ancestorsStatic, C, cut, duplicateFile, extOfName, fileNameIn, FOLDER_NAMES, folderChain, freshFile, I, kidsOf, lazyOf, levRatio, live, navErr, nodeOf, openPath, othersOf, pathIn, recoverable, revealStep, sampleNodes, say, sceneOpen, stemOf, tickTree, toggleFolder, tpl, treeBase, treeCfg, treeNav, where } = fam.lib;
  const { quote: q } = env.util;

  const LABELS = {
    rename: ['Rename', 'Rename…', 'Rename file', 'Edit name', 'Retitle', 'Name as…'],
    delete: [
      'Delete', 'Move to Trash', 'Remove', 'Move to Bin', 'Trash item', 'Discard', 'Recycle', 'Dispose of',
      'Throw away', 'Bin selected'
    ],
    newfolder: ['New folder', 'New Folder…', 'Create folder', 'Add folder', 'Make folder', 'New directory'],
  };
  const DECOY_ITEMS = ['Open with', 'Preview', 'Share', 'Get link', 'Show file location', 'Download',
    'Copy path', 'Properties', 'Add to favorites', 'Version history', 'Compress', 'Make available offline',
    'Copy', 'Cut', 'Open in new window', 'Add shortcut', 'Print', 'Scan for threats', 'Encrypt', 'Verify checksum',
    'Compare files', 'Add tags', 'Set color', 'Add comment', 'Manage permissions', 'Mark as read', 'Watch for changes',
    'Sync now', 'Back up', 'Send to device', 'Burn to disc', 'Convert format', 'Extract archive', 'Split file',
    'Merge files', 'Edit', 'Request approval', 'Assign owner', 'View activity', 'Report a problem', 'Refresh',
    'Calculate size', 'Check accessibility', 'Sign digitally', 'Search within', 'Mount image', 'View dependencies',
    'Set priority', 'Edit description', 'Set custom icon', 'Upload', 'Translate', 'Extract text',
    'Create contact sheet', 'Create manifest', 'Enable indexing', 'Hide', 'Read aloud', 'Run in sandbox',
    'Count words', 'Insert into document', 'View as hex', 'Validate syntax', 'Normalize line endings',
    'Change encoding', 'Adjust timestamp', 'Generate thumbnail', 'Rotate clockwise', 'Trim media', 'Mute audio',
    'Set as wallpaper', 'Add to playlist', 'Schedule reminder', 'Apply watermark', 'Resolve conflicts'];
  const SUFFIXES = [
    '_final', ' (signed)', '_v2', '-approved', ' - reviewed', '_OLD', ' 2025', '_clean', ' (copy)', '_draft',
    '(backup)', '-public', '_raw', '- notes', '(web)', '(print)', '-audio', '_EN', '_source', '-sample', '(test)',
    '_index', '-locked', '_EXPORT', '(small)', '_cropped', '-mono', '(front)', '-loop', '_RGB', '(wide)', '_layered',
    '_local'
  ];

  function renameGoal(rng, crng, spec, node, taken) {
    const ext = extOfName(node.name);
    const stem = stemOf(node.name);
    for (let k = 0; k < 40; k++) {
      const kind = rng.int(0, 3);
      let g;
      if (kind === 0) g = stem + rng.pick(SUFFIXES) + (ext ? `.${ext}` : '');
      else if (kind === 1 && /draft|v\d/i.test(stem)) g = stem.replace(/draft/i, 'final').replace(/v(\d)/i, (_, d) => `v${Number(d) + 1}`) + (ext ? `.${ext}` : '');
      else if (kind === 2) g = fileNameIn(crng, spec.csplit, ext || undefined);
      else g = C.slug(stem, rng.pick(['-', '_'])) + (ext ? `.${ext}` : '');
      if (g && g !== node.name && !taken.has(g.toLowerCase()) && g.length <= 48) return g;
    }
    return `${stem} renamed${ext ? `.${ext}` : ''}`;
  }

  function sampleFiles(rng, opts) {
    const crng = rng.fork('content');
    const spec = {};
    spec.nodes = sampleNodes(rng, crng, treeCfg(opts.ood, false, opts.level), opts.csplit);
    lazyOf(rng, spec, opts);
    spec.op = rng.pick(['rename', 'rename', 'delete', 'newfolder']);
    if (opts.level === 'easy' && spec.op === 'newfolder') spec.op = 'delete';
    const taken = new Set(spec.nodes.map((n) => n.name.toLowerCase()));
    const files = spec.nodes.filter((n) => !n.dir);
    const nested = files.filter((n) => n.depth > 0);
    if (spec.op === 'newfolder') {
      const dirs = spec.nodes.filter((n) => n.dir);
      const f = rng.pick(opts.ood ? dirs.filter((n) => n.depth > 0).concat(dirs).slice(0, dirs.length) : dirs);
      spec.target = f.id;
      const pool = C.split(FOLDER_NAMES, opts.csplit).filter((x) => !taken.has(x.toLowerCase()));
      spec.goalName = pool.length ? rng.pick(pool) : `Folder ${rng.int(2, 99)}`;
      spec.route = 'menu';
    } else {
      const t = rng.bool(0.85) && nested.length ? rng.pick(nested) : rng.pick(files);
      spec.target = t.id;
      if (spec.op === 'rename') {
        spec.goalName = renameGoal(rng, crng, opts, t, taken);
        spec.route = rng.pick(['dblclick', 'f2', 'menu']);
      } else spec.route = rng.pick(['menu', 'menu', 'key']);
    }
    spec.labels = { rename: rng.pick(LABELS.rename), delete: rng.pick(LABELS.delete), newfolder: rng.pick(LABELS.newfolder) };
    spec.decoys = C.sample(crng, DECOY_ITEMS, rng.int(2, 4), { csplit: opts.csplit });
    spec.recoverable = recoverable(rng, opts);
    return spec;
  }

  function filesInit(spec, rng) {
    let m = { ...treeBase(), menu: null, edit: null, names: {}, deleted: [], created: [], nextId: 0, wrong: 0, undo: null };
    const t = nodeOf(spec, spec.target);
    const anc = ancestorsStatic(spec, spec.target);
    const decoys = spec.nodes.filter((n) => n.dir && n.depth === 0 && !anc.includes(n.id));
    if (spec.startMode === 'scene') {
      // The target visible in its open folders, a rename / delete target selected, nothing begun.
      m = sceneOpen(m, spec, rng.fork('scene'));
      return spec.op === 'newfolder' ? m : { ...m, sel: t.id };
    }
    if (decoys.length && rng.bool(0.3)) m = openPath(m, spec, [rng.pick(decoys).id]);
    if (spec.startMode === 'partial') {
      m = openPath(m, spec, anc);
      if (spec.op === 'rename') {
        const k = rng.int(2, Math.max(2, spec.goalName.length - 3));
        return { ...m, sel: t.id, edit: { id: t.id, text: spec.goalName.slice(0, k), isNew: false } };
      }
      return { ...m, sel: t.id, menu: t.id };
    }
    if (spec.startMode === 'wrong') {
      if (spec.op === 'rename') {
        m = openPath(m, spec, anc);
        const g = spec.goalName;
        const bad = rng.bool(0.5) ? g.replace(/[a-z]/i, (c) => (c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase())) : I.typo(rng, stemOf(g)) + (extOfName(g) ? `.${extOfName(g)}` : '');
        return { ...m, names: { [t.id]: bad === g ? `${g} (2)` : bad } };
      }
      if (spec.op === 'newfolder') {
        const others = spec.nodes.filter((n) => n.dir && n.id !== spec.target);
        const w = rng.pick(others.length ? others : [null]);
        const wp = w ? w.id : null;
        if (wp !== null) m = openPath(m, spec, ancestorsStatic(spec, wp).concat([wp]));
        return { ...m, created: [{ id: 'c0', parent: wp, name: spec.goalName }], nextId: 1 };
      }
      const others = spec.nodes.filter((n) => !n.dir && n.id !== spec.target);
      const w = rng.pick(others);
      m = openPath(m, spec, ancestorsStatic(spec, w.id));
      if (spec.recoverable) return { ...m, deleted: [w.id], wrong: 1, undo: { id: w.id } };
      return { ...m, sel: w.id, menu: w.id };
    }
    return m;
  }

  function fCommit(m) {
    if (!m.edit) return m;
    const e = m.edit;
    const t = e.text.trim();
    if (e.isNew) return { ...m, created: m.created.map((c) => (c.id === e.id ? { ...c, name: t || 'New folder' } : c)), edit: null };
    const names = { ...m.names };
    if (t) names[e.id] = t;
    return { ...m, names, edit: null };
  }
  function fCancel(m) {
    if (!m.edit) return m;
    if (m.edit.isNew) return { ...m, created: m.created.filter((c) => c.id !== m.edit.id), edit: null };
    return { ...m, edit: null };
  }
  const fEditText = (m, text) => (m.edit ? { ...m, edit: { ...m.edit, text } } : m);
  function fClick(m, spec, id, now) {
    m = fCommit({ ...m, menu: null });
    const n = live(m, spec).byId.get(id);
    if (!n) return m;
    if (n.dir) m = toggleFolder(m, spec, id, now);
    return { ...m, sel: id };
  }
  function fDbl(m, spec, id) {
    m = fCommit({ ...m, menu: null });
    const n = live(m, spec).byId.get(id);
    if (!n) return m;
    return { ...m, sel: id, edit: { id, text: n.name, isNew: false } };
  }
  const fMenu = (m, spec, id) => ({ ...fCommit(m), menu: id, sel: id });
  function fDelete(m, spec, id) {
    const base = { ...m, sel: null, menu: null, edit: null };
    if (!spec.nodes.some((n) => n.id === id)) {
      const c = m.created.find((x) => x.id === id);
      return { ...base, created: m.created.filter((x) => x.id !== id), undo: c ? { created: c } : null };
    }
    const bad = spec.op !== 'delete' || id !== spec.target;
    return { ...base, deleted: m.deleted.concat([id]), wrong: m.wrong + (bad ? 1 : 0), undo: { id } };
  }
  function fUndo(m) {
    const u = m.undo;
    if (!u) return m;
    if (u.created) return { ...m, created: m.created.concat([u.created]), undo: null };
    return { ...m, deleted: m.deleted.filter((x) => x !== u.id), undo: null };
  }
  function fPick(m, spec, action, now) {
    const id = m.menu;
    m = { ...m, menu: null };
    if (id === null || id === undefined) return m;
    if (action === 'rename') return fDbl(m, spec, id);
    if (action === 'delete') return fDelete(m, spec, id);
    if (action === 'newfolder') {
      const n = live(m, spec).byId.get(id);
      if (!n) return m;
      const F = n.dir ? id : n.parent;
      const cid = `c${m.nextId || 0}`;
      let out = { ...m, created: m.created.concat([{ id: cid, parent: F, name: '' }]), nextId: (m.nextId || 0) + 1,
        edit: { id: cid, text: 'New folder', isNew: true }, sel: cid };
      if (F !== null) {
        out = openPath(out, spec, [F]);
        if (out.loading && F in out.loading) {
          out.loading = { ...out.loading };
          delete out.loading[F];
        }
      }
      return out;
    }
    return m;
  }
  function fKey(m, spec, key, now) {
    if (key === 'Escape') return m.edit ? fCancel(m) : { ...m, menu: null };
    if (key === 'Enter') return m.edit ? fCommit(m) : m;
    if (m.edit) return m;
    if (key === 'F2' && m.sel !== null && m.sel !== undefined) return fDbl(m, spec, m.sel);
    if ((key === 'Delete' || key === 'Backspace') && m.sel !== null && m.sel !== undefined) return fDelete(m, spec, m.sel);
    if (/^Arrow|^Home$|^End$/.test(key)) return treeNav({ ...m, menu: null }, spec, key, now, null);
    return m;
  }

  const nameErr = (s, goal) => (s === goal ? 0 : 0.5 + 0.5 * levRatio(String(s || ''), goal));

  // The created folder that counts for 'newfolder': committed with the goal name in the target folder, else the
  // one being edited there, else the first one there.
  // (A created folder renamed afterwards keeps its name in model.names, so the name that counts is cname.)
  const cname = (m, c) => (m.names && m.names[c.id] !== undefined ? m.names[c.id] : c.name);
  function bestCreated(m, spec) {
    const here = m.created.filter((c) => c.parent === spec.target);
    return here.find((c) => cname(m, c) === spec.goalName && !(m.edit && m.edit.id === c.id))
      || here.find((c) => m.edit && m.edit.id === c.id) || here[0] || null;
  }

  function filesPenalty(m, spec) {
    let pen = 0;
    for (const id of m.deleted) if (spec.op !== 'delete' || id !== spec.target) pen += 0.5;
    for (const [id, name] of Object.entries(m.names)) {
      const n = nodeOf(spec, id);
      if (n && name !== n.name && !(spec.op === 'rename' && id === spec.target)) pen += 0.25;
    }
    const best = spec.op === 'newfolder' ? bestCreated(m, spec) : null;
    for (const c of m.created) if (!best || c.id !== best.id) pen += 0.25;
    return pen;
  }

  function filesBase(m, spec) {
    const L = live(m, spec);
    if (spec.op === 'rename') {
      if (!L.byId.has(spec.target)) return 1;
      const committed = L.byId.get(spec.target).name;
      if (committed === spec.goalName) return 0;
      const draft = m.edit && m.edit.id === spec.target ? m.edit.text : committed;
      const near = m.menu === spec.target || m.sel === spec.target ? 0.05 : 0;
      return 0.2 * navErr(m, spec, spec.target, L) + 0.3 * nameErr(draft, spec.goalName) + 0.5 * nameErr(committed, spec.goalName) - near;
    }
    if (spec.op === 'delete') {
      if (!L.byId.has(spec.target)) return m.deleted.includes(spec.target) ? 0 : 1;
      const near = m.menu === spec.target ? 0.1 : m.sel === spec.target ? 0.05 : 0;
      return 0.6 + 0.4 * navErr(m, spec, spec.target, L) - near;
    }
    if (!L.byId.has(spec.target)) return 1;
    const best = bestCreated(m, spec);
    if (best && cname(m, best) === spec.goalName && !(m.edit && m.edit.id === best.id)) return 0;
    const draft = best ? (m.edit && m.edit.id === best.id ? m.edit.text : cname(m, best)) : '';
    const near = !best && m.menu === spec.target ? 0.05 : 0;
    return 0.15 * navErr(m, spec, spec.target, L) + (best ? 0 : 0.15) + 0.2 * (draft ? nameErr(draft, spec.goalName) : 1) + 0.5 - near;
  }

  const filesError = (m, spec) => Math.min(1, Math.max(0, filesBase(m, spec)) + filesPenalty(m, spec));
  const filesLimit = (spec) => (spec.recoverable ? 2 : 1);

  function filesPlan(m, spec) {
    if (m.wrong >= filesLimit(spec) || filesError(m, spec) === 0) return null;
    const best = spec.op === 'newfolder' ? bestCreated(m, spec) : null;
    // Another item renamed (the goal moved on): rename it back (the same steps as the target's own rename).
    const stray = Object.entries(m.names).filter(([id, n]) => nodeOf(spec, id) && n !== nodeOf(spec, id).name && !(spec.op === 'rename' && id === spec.target));
    const editOk = m.edit && ((spec.op === 'rename' && m.edit.id === spec.target) || (best && m.edit.id === best.id) || (stray.length && m.edit.id === stray[0][0]));
    if (m.edit && !editOk) return { key: 'Escape' };
    // A wrong delete: Undo it (the toast stays until the next delete).
    const wrongDel = m.deleted.filter((id) => spec.op !== 'delete' || id !== spec.target);
    if (wrongDel.length) return m.undo && m.undo.id !== undefined && wrongDel.includes(m.undo.id) && spec.recoverable ? { click: { toast: 'undo' } } : null;
    const open = (a) => ({ click: { node: a } });
    if (stray.length) {
      const id = stray[0][0];
      const orig = nodeOf(spec, id).name;
      if (m.edit && m.edit.id === id) return m.edit.text !== orig ? { type: [{ edit: id }, orig] } : { key: 'Enter' };
      if (m.menu === id) return { click: { menu: 'rename' } };
      if (m.menu !== null) return { key: 'Escape' };
      return revealStep(m, spec, id, open) || { rightclick: { node: id } };
    }
    // Extra folders (a wrong start): delete them through the context menu.
    const extra = m.created.filter((c) => !best || c.id !== best.id);
    if (extra.length) {
      const x = extra[0].id;
      if (m.menu === x) return { click: { menu: 'delete' } };
      if (m.menu !== null) return { key: 'Escape' };
      return revealStep(m, spec, x, open) || { rightclick: { node: x } };
    }
    if (spec.op === 'rename') {
      if (m.edit && m.edit.id === spec.target) return m.edit.text !== spec.goalName ? { type: [{ edit: spec.target }, spec.goalName] } : { key: 'Enter' };
      if (m.menu !== null && m.menu !== spec.target) return { key: 'Escape' };
      if (m.menu === spec.target) return { click: { menu: 'rename' } };
      const r = revealStep(m, spec, spec.target, open);
      if (r) return r;
      if (spec.route === 'dblclick') return { dblclick: { node: spec.target } };
      if (spec.route === 'f2') return m.sel === spec.target ? { key: 'F2' } : { click: { node: spec.target } };
      return { rightclick: { node: spec.target } };
    }
    if (spec.op === 'delete') {
      if (m.menu === spec.target) return { click: { menu: 'delete' } };
      if (m.menu !== null) return { key: 'Escape' };
      const r = revealStep(m, spec, spec.target, open);
      if (r) return r;
      if (spec.route === 'key') return m.sel === spec.target ? { key: 'Delete' } : { click: { node: spec.target } };
      return { rightclick: { node: spec.target } };
    }
    if (best && m.edit && m.edit.id === best.id) return m.edit.text !== spec.goalName ? { type: [{ edit: best.id }, spec.goalName] } : { key: 'Enter' };
    if (best && cname(m, best) !== spec.goalName) {
      // A created folder with the wrong name (cancelled or left as "New folder"): rename it.
      if (m.menu === best.id) return { click: { menu: 'rename' } };
      if (m.menu !== null) return { key: 'Escape' };
      return revealStep(m, spec, best.id, open) || { rightclick: { node: best.id } };
    }
    if (m.menu === spec.target) return { click: { menu: 'newfolder' } };
    if (m.menu !== null) return { key: 'Escape' };
    return revealStep(m, spec, spec.target, open) || { rightclick: { node: spec.target } };
  }

  const T_RENAME = ['Rename the file {f} to {g}.', 'Change the name of {f} to {g}.',
    'Rename {f}: it should be called {g}.', 'Give {f} the new name {g}.',
    'Find {f} in the tree and rename it to {g}.', 'Rename {f} so that it is named {g}.', 'Rename {f}; the new name is {g}.',
    '{g} is the name I want for {f}.', 'Use {g} as the filename for {f}.', 'Update the filename: {f} to {g}.',
    'The file {f} needs the name {g}.', 'Change {f} into {g} by renaming it.', 'For {f} set the filename to {g}.',
    'Replace the filename {f} with {g}.', 'The file now called {f} should be {g}.',
    'File rename requested: {f} to {g}.', '{f} is to be renamed as {g}.', 'Carry out the rename {f} to {g}.'];
  const T_DELETE = ['Delete the file {f}.', 'Remove {f} from the tree.', 'Move {f} to the trash.',
    'Get rid of the file {f}.', 'Find {f} and delete it.', 'Delete {f}, it is no longer needed.', 'Trash the file {f}.',
    'I need the file {f} deleted.', '{f} is the file to delete.', '{f} should be trashed.',
    'Arrange for {f} to be deleted.'];
  const T_NEWF = ['Create a new folder named {g} inside {d}.', 'Add a folder called {g} to the {d} folder.',
    'Make a new folder {g} in {d}.', 'Create a folder named {g} inside the {d} folder.',
    'Add a new subfolder called {g} to {d}.', 'Set up a folder {g} under {d}.',
    '{g} should be a new subfolder of {d}.', 'Give a new folder in {d} the name {g}.',
    'I want {d} to have a new folder called {g}.', 'Give {d} a new child folder called {g}.',
    'Let {d} contain a new folder named {g}.'];

  // Exposed for widgets.
  Object.assign(fam.helpers, { fClick, fDbl, fMenu, fPick, fKey, fEditText, fCommit, fCancel, fUndo });

  env.scenario('use-desktop-tools', {
    name: 'files',
    sample: sampleFiles,
    init: filesInit,
    error: filesError,
    plan: filesPlan,
    tick: (model, spec, dtMs, nowMs) => tickTree(model, spec, nowMs),
    ended: (model, spec) => (model.wrong >= filesLimit(spec) ? 'wrong-delete' : null),
    solve(spec, m) {
      let o = { ...m, edit: null, menu: null, wrong: 0, undo: null, deleted: [], names: {}, created: [] };
      if (spec.op === 'rename') o.names = { [spec.target]: spec.goalName };
      else if (spec.op === 'delete') o.deleted = [spec.target];
      else {
        o.created = [{ id: 'c9', parent: spec.target, name: spec.goalName }];
        o = openPath(o, spec, ancestorsStatic(spec, spec.target).concat([spec.target]));
      }
      return o;
    },
    instruction(spec, rng) {
      const t = nodeOf(spec, spec.target);
      const f = q(t.name);
      const g = q(spec.goalName);
      if (spec.op === 'rename') return say(rng, spec, tpl(rng, spec, T_RENAME, { f, g }), `rename ${f} → ${g}`, [`find ${f}`, `rename it to ${g}`]);
      if (spec.op === 'delete') return say(rng, spec, tpl(rng, spec, T_DELETE, { f }), `delete ${f}`, [`find ${f} in the tree`, 'delete it']);
      return say(rng, spec, tpl(rng, spec, T_NEWF, { g, d: f }), `new folder ${g} in ${f}`, [`find the ${f} folder`, `create a folder named ${g} inside it`]);
    },
    changed: (m, spec) => (m.deleted || []).length > 0 || (m.created || []).length > 0
      || Object.entries(m.names || {}).some(([id, n]) => { const nd = nodeOf(spec, id); return nd && n !== nd.name; }),
    prepared(m, spec, e) {
      const L = live(m, spec);
      return L.byId.has(spec.target) && (m.menu === spec.target || m.sel === spec.target) && e <= 0.65 ? 0 : e;
    },
    confirmVerb: 'delete it',
    prepareConfirm(jr, spec) {
      // a delete: the file selected / its menu open is the point to stop at
      if (spec.op !== 'delete') {
        const files = spec.nodes.filter((n) => !n.dir);
        const nested = files.filter((n) => n.depth > 0);
        spec.op = 'delete';
        spec.target = jr.pick(nested.length ? nested : files).id;
        spec.route = jr.pick(['menu', 'menu', 'key']);
        delete spec.goalName;
      }
    },
    ambiguous(jr, spec) {
      const pair = duplicateFile(jr, spec);
      if (!pair) return undefined;
      const [t, u] = pair;
      spec.op = 'delete';
      spec.route = 'menu';
      const f = q(t.name);
      return { mode: 'ambiguous', cands: [[where(spec, t)], [where(spec, u)]],
        others: othersOf(spec.nodes.filter((n) => n.dir).map((n) => n.name), folderChain(spec, t.parent), folderChain(spec, u.parent)),
        message: `There are two files named ${f}: one in ${where(spec, t)} and one in ${where(spec, u)}. Which one should I delete?`,
        templates: T_DELETE, vars: { f }, terse: `delete ${f}` };
    },
    impossible(jr, spec) {
      const name = freshFile(jr, spec, new Set(spec.nodes.map((n) => n.name.toLowerCase())), fileNameIn);
      spec.op = 'delete';
      spec.route = 'menu';
      const f = q(name);
      return { mode: 'impossible', what: [name], message: `I can't do that: there is no file named ${name} to delete.`, templates: T_DELETE, vars: { f }, terse: `delete ${f}` };
    },
    facts(model, spec, add) {
      const L = live(model, spec);
      const id = spec.op === 'newfolder' ? (bestCreated(model, spec) || { id: spec.target }).id : spec.target;
      const n = L.byId.get(id);
      const pid = spec.op === 'newfolder' ? spec.target : n ? n.parent : nodeOf(spec, spec.target).parent;
      const par = pid === null ? null : L.byId.get(pid);
      if (spec.op !== 'delete' && n) add(spec.op === 'rename' ? 'New path' : 'Folder path', pathIn(L, id), [n.name]);
      add(`Items in ${par ? par.name : 'the root'}`, kidsOf(L, pid).length, null, ['items in the folder']);
      add('Files in the tree', [...L.byId.values()].filter((x) => !x.dir).length, null, ['total files']);
    },
    silent(next, prev, spec, rng, cands) {
      const t = spec.target;
      if (spec.op === 'rename' && next.names[t] !== undefined && next.names[t] !== (prev.names || {})[t] && String(next.names[t]).length > 8) {
        cands.push((m) => { m.names[t] = cut(m.names[t]); });
      }
      if (next.edit && prev.edit && next.edit.text !== prev.edit.text && next.edit.text.length > 10) {
        cands.push((m) => { m.edit.text = cut(m.edit.text); });
      }
      if (spec.op === 'delete' && next.deleted.includes(t) && !prev.deleted.includes(t)) {
        cands.push((m) => { m.deleted = m.deleted.filter((x) => x !== t); });
      }
      if (spec.op === 'newfolder' && prev.edit && prev.edit.isNew && !next.edit) {
        const c = bestCreated(next, spec);
        if (c && cname(next, c) === spec.goalName) cands.push((m) => { m.created.find((x) => x.id === c.id).name = 'New folder'; delete m.names[c.id]; });
      }
    },
    retarget(s, spec, model, rng, crng) {
      const nodes = spec.nodes;
      const taken = new Set(nodes.map((n) => n.name.toLowerCase()));
      if (spec.op === 'newfolder') {
        const dirs = nodes.filter((n) => n.dir && n.id !== spec.target);
        const pool = C.split(FOLDER_NAMES, spec.csplit).filter((x) => !taken.has(x.toLowerCase()) && x !== spec.goalName);
        if (!dirs.length || !pool.length) return false;
        s.target = rng.pick(dirs).id;
        s.goalName = rng.pick(pool);
      } else {
        const files = nodes.filter((n) => !n.dir && n.id !== spec.target && !(model.deleted || []).includes(n.id));
        const nested = files.filter((n) => n.depth > 0);
        if (!files.length) return false;
        const t = rng.pick(nested.length && rng.bool(0.85) ? nested : files);
        s.target = t.id;
        if (spec.op === 'rename') s.goalName = renameGoal(rng, crng, spec, t, taken);
      }
      return true;
    },
    simulate(m, spec, step, now, t) {
      if (step.click && t.toast) m = fUndo(m);
      else if (step.click && t.menu) m = fPick(m, spec, t.menu, now);
      else if (step.click) m = fClick(m, spec, t.node, now);
      else if (step.dblclick) m = fDbl(fClick(fClick(m, spec, t.node, now), spec, t.node, now), spec, t.node);
      else if (step.rightclick) m = fMenu(m, spec, t.node);
      else if (step.key) m = fKey(m, spec, step.key, now);
      else if (step.type) m = fEditText(m, step.type[1]);
      return m;
    },
  });
})();
