/*
 * use-desktop-tools / explorer.js: the folder tree the tree, files and move scenarios share (sampling, the live tree,
 * folder toggling and loading, keyboard navigation, scene starts, judge and facts helpers). Loaded before them.
 */
(function () {
  'use strict';

  const fam = env.taskOf('use-desktop-tools');
  const { C, fileNameIn } = fam.lib;

  const FOLDER_NAMES = ['Documents', 'Invoices', 'Receipts', 'Tax 2023', 'Tax 2024', 'Photos', 'Screenshots',
    'Projects', 'Client work', 'Archive', 'Old stuff', 'Backups', 'Contracts', 'Design', 'Marketing', 'Reports',
    'Q3 planning', 'Templates', 'Meeting notes', 'Travel', 'Recipes', 'Music', 'Videos', 'Downloads', 'Shared',
    'Personal', 'HR', 'Finance', 'Legal', 'Drafts', 'Presentations', 'Research', 'Assets', 'Fonts', 'Icons',
    'Website', 'src', 'docs', 'scripts', 'data', 'exports', 'Onboarding', 'Proposals', 'Budgets', 'Family',
    'School', 'Course notes', 'Wedding', 'Renovation', 'Car', 'Insurance', 'Medical', 'Utilities',
    'Bank statements', 'Payroll', 'Vendors', 'Press kit', 'Brand', 'Product specs', 'Release notes', 'Sprint 14',
    'Interviews', 'Applications', 'Portfolio', 'Raw footage', 'Edits', 'Podcast', 'Scans', 'Letters', 'Manuals',
    'Warranty', 'Garden', 'Holiday 2025', 'Board meetings', 'Grant application', 'Thesis', 'Lab results',
    'Newsletters', 'Social media', 'Clients', 'Suppliers', 'Logos', 'Archive 2022', 'Team photos', 'Forms',
    'Neighborhood', 'Reading list', 'Local history', 'Product shots', 'Client briefs', 'Client assets', 'Old projects',
    'Web design', 'Style guides', 'Call notes', 'Audio files', 'Video clips', 'App downloads', 'Home records',
    'People ops', 'Accounting', 'Compliance', 'Slide decks', 'User research', 'Image assets', 'Typefaces',
    'Landing page', 'Source files', 'Documentation', 'Build scripts', 'Data imports', 'Data exports', 'Pitch decks',
    'Expense plans', 'Study guides', 'Event plans', 'Home repairs', 'Policy papers', 'Power bills', 'Pay stubs',
    'Media kit', 'Feature plans', 'Job search', 'Work samples', 'Video cuts', 'Paper scans', 'Setup guides',
    'Plant care', 'Winter break', 'Field notes', 'Test results', 'Mailing lists', 'Stock lists', 'Mark files',
    'Invoices 2025', 'Lease papers', 'Tax receipts', 'Album indexes', 'Bug reports', 'Code snippets', 'Test fixtures',
    'API examples', 'Server logs', 'Cloud sync', 'Access keys', 'Room bookings', 'Travel plans', 'Packing lists',
    'Trip journals', 'Book notes', 'Lesson plans', 'Exam prep', 'Lab notebooks', 'Sample labels', 'Grant records',
    'Race results', 'Garden seeds', 'Compost notes', 'Meal plans', 'Pantry stock', 'Pet records', 'Quilt designs',
    'Repair logs', 'Water usage', 'Fuel logs', 'Estate papers', 'Birth records', 'School photos', 'Holiday cards',
    'Ad concepts', 'Baking notes', 'Ceramics', 'Chore charts', 'City walks', 'Class rosters', 'Color studies',
    'Commissions', 'Decor plans', 'Farm records', 'Food photos', 'Genealogy', 'Gift ideas', 'Glasswork',
    'Mileage logs', 'Room layouts', 'Teaching aids', 'Tool library', 'Tree surveys', 'Trail markers'];

  const byName = (a, b) => {
    if (a.dir !== b.dir) return a.dir ? -1 : 1;
    const x = a.name.toLowerCase();
    const y = b.name.toLowerCase();
    if (x !== y) return x < y ? -1 : 1;
    return a.id < b.id ? -1 : 1;
  };

  // Random folder tree with unique names. cfg: { min, max, maxDepth, rootMin, rootMax }.
  function sampleNodes(rng, crng, cfg, split) {
    for (let tries = 0; ; tries++) {
      const nodes = [];
      const used = new Set();
      const folders = C.sample(crng, FOLDER_NAMES, 999, { csplit: split });
      let fi = 0;
      const file = () => {
        for (let k = 0; k < 40; k++) {
          const n = fileNameIn(crng, split);
          if (!used.has(n.toLowerCase())) {
            used.add(n.toLowerCase());
            return n;
          }
        }
        const n = `file ${nodes.length}.txt`;
        used.add(n.toLowerCase());
        return n;
      };
      const build = (parent, depth, count) => {
        for (let k = 0; k < count; k++) {
          const dir = depth < cfg.maxDepth && fi < folders.length && rng.bool(depth === 0 ? 0.5 : 0.38);
          const name = dir ? folders[fi++] : file();
          if (dir) used.add(name.toLowerCase());
          const node = { id: `n${nodes.length}`, name, dir, parent, depth };
          nodes.push(node);
          if (dir) build(node.id, depth + 1, depth === 0 ? rng.int(2, 4) : rng.int(1, 3));
        }
      };
      build(null, 0, rng.int(cfg.rootMin, cfg.rootMax));
      const rootDirs = nodes.filter((n) => n.depth === 0 && n.dir).length;
      const deep = nodes.filter((n) => !n.dir && n.depth >= (cfg.needDepth || 1));
      if ((nodes.length < cfg.min || nodes.length > cfg.max || rootDirs < 2 || !deep.length) && tries < 400) continue;
      return nodes;
    }
  }

  const treeCfg = (ood, small, level, move) => (level === 'easy' ? (move ? { min: 8, max: 12, maxDepth: 2, rootMin: 3, rootMax: 4 }
    : { min: 6, max: 9, maxDepth: 1, rootMin: 2, rootMax: 3 })
    : level === 'medium' ? (move ? { min: 8, max: 14, maxDepth: 2, rootMin: 3, rootMax: 5 } : { min: 7, max: 12, maxDepth: 2, rootMin: 3, rootMax: 4 })
    : ood
    ? { min: small ? 14 : 18, max: small ? 20 : 30, maxDepth: 3, rootMin: 4, rootMax: 6, needDepth: 2 }
    : { min: 8, max: small ? 14 : 16, maxDepth: 2, rootMin: 3, rootMax: 5 });

  const nodeOf = (spec, id) => spec.nodes.find((n) => n.id === id);
  function ancestorsStatic(spec, id) {
    const out = [];
    for (let n = nodeOf(spec, id); n && n.parent !== null; n = nodeOf(spec, n.parent)) out.unshift(n.parent);
    return out;
  }

  // The live tree after renames, moves, deletes and created folders.
  function live(model, spec) {
    const names = model.names || {};
    const parents = model.parents || {};
    const del = new Set(model.deleted || []);
    const all = spec.nodes.map((n) => ({ id: n.id, dir: n.dir, name: names[n.id] ?? n.name,
      parent: n.id in parents ? parents[n.id] : n.parent }))
      .concat((model.created || []).map((c) => ({ id: c.id, dir: true, name: names[c.id] ?? c.name, parent: c.parent, created: true })));
    const byAll = new Map(all.map((n) => [n.id, n]));
    const gone = (n) => {
      for (let x = n, k = 0; x && k < 50; x = x.parent === null ? null : byAll.get(x.parent), k++) if (del.has(x.id)) return true;
      return false;
    };
    const nodes = all.filter((n) => !gone(n));
    const kids = new Map();
    for (const n of nodes) {
      const k = n.parent === null ? '' : n.parent;
      if (!kids.has(k)) kids.set(k, []);
      kids.get(k).push(n);
    }
    for (const list of kids.values()) list.sort(byName);
    return { byId: new Map(nodes.map((n) => [n.id, n])), kids };
  }

  const isOpen = (m, id) => m.open.includes(id);
  const isLoaded = (m, spec, id) => !(spec.lazy || []).includes(id) || (m.loaded || []).includes(id);
  const isLoading = (m, id) => !!(m.loading && Object.prototype.hasOwnProperty.call(m.loading, id));
  const expanded = (m, spec, id) => isOpen(m, id) && isLoaded(m, spec, id);

  function liveAncestors(L, id) {
    const out = [];
    let n = L.byId.get(id);
    for (let k = 0; n && n.parent !== null && k < 50; k++) {
      out.unshift(n.parent);
      n = L.byId.get(n.parent);
    }
    return out;
  }

  // Visible rows in display order: [{ id, depth, dir, name, loading }].
  function rows(model, spec, L = live(model, spec)) {
    const out = [];
    const walk = (pid, depth) => {
      for (const n of L.kids.get(pid) || []) {
        out.push({ id: n.id, depth, dir: n.dir, name: n.name, created: !!n.created });
        if (n.dir && expanded(model, spec, n.id)) walk(n.id, depth + 1);
      }
    };
    walk('', 0);
    return out;
  }

  function navErr(model, spec, id, L = live(model, spec)) {
    const anc = liveAncestors(L, id);
    if (!anc.length) return 0;
    let k = 0;
    while (k < anc.length && expanded(model, spec, anc[k])) k++;
    if (k < anc.length && isOpen(model, anc[k])) k += 0.5;
    return 1 - k / anc.length;
  }

  function toggleFolder(m, spec, id, now) {
    const out = { ...m, open: m.open.slice(), loading: { ...(m.loading || {}) } };
    if (isOpen(m, id)) {
      out.open = out.open.filter((x) => x !== id);
      delete out.loading[id];
    } else {
      out.open.push(id);
      if (!isLoaded(m, spec, id)) out.loading[id] = now;
    }
    return out;
  }
  const openFolder = (m, spec, id, now) => (isOpen(m, id) ? m : toggleFolder(m, spec, id, now));

  function tickTree(m, spec, now) {
    let out = m;
    if (m.loading) {
      for (const [id, t0] of Object.entries(m.loading)) {
        if (now - t0 < spec.loadMs - 1e-6) continue;
        if (out === m) out = { ...m, loading: { ...m.loading }, loaded: (m.loaded || []).slice() };
        delete out.loading[id];
        if (!out.loaded.includes(id)) out.loaded.push(id);
      }
    }
    const d = out.drag;
    if (spec.scenario === 'move' && d && d.over != null && !d.sprung && now - d.since >= spec.springMs - 1e-6) {
      const n = live(out, spec).byId.get(d.over);
      if (n && n.dir && !isOpen(out, n.id)) out = openFolder(out, spec, n.id, now);
      out = { ...out, drag: { ...d, sprung: true } };
    }
    return out;
  }

  // Keyboard navigation over the visible rows (tree scenario; files reuses the arrows).
  function treeNav(m, spec, key, now, onFile) {
    const R = rows(m, spec);
    if (!R.length) return m;
    let i = R.findIndex((r) => r.id === m.sel);
    if (i < 0) return { ...m, sel: R[0].id };
    const r = R[i];
    if (key === 'ArrowDown') return { ...m, sel: R[Math.min(R.length - 1, i + 1)].id };
    if (key === 'ArrowUp') return { ...m, sel: R[Math.max(0, i - 1)].id };
    if (key === 'Home') return { ...m, sel: R[0].id };
    if (key === 'End') return { ...m, sel: R[R.length - 1].id };
    if (key === 'ArrowRight') {
      if (!r.dir) return m;
      if (!isOpen(m, r.id)) return toggleFolder(m, spec, r.id, now);
      if (i + 1 < R.length && R[i + 1].depth > r.depth) return { ...m, sel: R[i + 1].id };
      return m;
    }
    if (key === 'ArrowLeft') {
      if (r.dir && isOpen(m, r.id)) return toggleFolder(m, spec, r.id, now);
      for (i -= 1; i >= 0; i--) if (R[i].depth < r.depth) return { ...m, sel: R[i].id };
      return m;
    }
    if (key === 'Enter' || key === ' ') {
      if (r.dir) return toggleFolder(m, spec, r.id, now);
      return onFile ? onFile(m, r.id) : m;
    }
    return m;
  }

  // Plan helper: make node `id` visible (open its ancestors, wait for loads, scroll it into view).
  function revealStep(m, spec, id, opener) {
    const L = live(m, spec);
    for (const a of liveAncestors(L, id)) {
      if (!isOpen(m, a)) return scrollStep(m, spec, a) || opener(a);
      if (!isLoaded(m, spec, a)) return { wait: true };
    }
    return scrollStep(m, spec, id);
  }
  function scrollStep(m, spec, id) {
    const v = m.view;
    if (!v || v.first === undefined) return null;
    const idx = rows(m, spec).findIndex((r) => r.id === id);
    if (idx < 0 || (idx >= v.first && idx <= v.last)) return null;
    const px = v.px || 26;
    const dy = idx < v.first ? -Math.max(2, v.first - idx + 1) * px : Math.max(2, idx - v.last + 1) * px;
    return { wheel: [{ pane: 'tree' }, Math.round(dy)] };
  }

  function lazyOf(rng, spec, opts) {
    const stepMs = opts.stepMs || 1000;
    spec.loadMs = rng.int(1, 2) * stepMs + stepMs / 2;
    spec.lazy = rng.bool(0.45) ? spec.nodes.filter((n) => n.dir && rng.bool(0.6)).map((n) => n.id) : [];
    if (opts.level === 'easy') spec.lazy = [];
  }

  const treeBase = () => ({ open: [], loaded: [], loading: {}, sel: null, view: null });

  function openPath(m, spec, ids) {
    const open = m.open.slice();
    const loaded = m.loaded.slice();
    for (const a of ids) {
      if (!open.includes(a)) open.push(a);
      if ((spec.lazy || []).includes(a) && !loaded.includes(a)) loaded.push(a);
    }
    return { ...m, open, loaded };
  }

  // Start mode 'scene' of the explorer scenarios: the target's whole ancestor chain open (lazy ones loaded), so the
  // target row is on the first screen; optional extra open decoy folders that keep it there (own rng fork).
  const SCENE_ROWS = 8;
  const rowIndex = (m, spec, id) => rows(m, spec).findIndex((r) => r.id === id);
  function sceneTarget(srng, spec, cands) {
    const idx = (n) => rowIndex(openPath(treeBase(), spec, ancestorsStatic(spec, n.id)), spec, n.id);
    const near = cands.filter((n) => idx(n) < SCENE_ROWS);
    return srng.pick(near.length ? near : cands);
  }
  function sceneOpen(m, spec, srng) {
    const anc = ancestorsStatic(spec, spec.target);
    m = openPath(m, spec, anc);
    const shown = new Set(['', ...anc]);
    const decoys = spec.nodes.filter((n) => n.dir && !anc.includes(n.id) && n.id !== spec.target
      && shown.has(n.parent === null ? '' : n.parent));
    let extra = srng.int(0, 2);
    for (const d of srng.shuffle(decoys)) {
      if (extra <= 0) break;
      const next = openPath(m, spec, [d.id]);
      if (rowIndex(next, spec, spec.target) >= SCENE_ROWS) continue;
      m = next;
      extra--;
    }
    return m;
  }

  // ---------------------------------------------------------------- judge and facts helpers

  const folderName = (spec, id) => (id === null ? null : nodeOf(spec, id).name);
  const folderChain = (spec, id) => ancestorsStatic(spec, id).concat([id]).map((a) => nodeOf(spec, a).name);

  // Two files (tree, files) with one name, in different folders.
  function duplicateFile(jr, spec) {
    const files = spec.nodes.filter((n) => !n.dir && n.parent !== null);
    if (files.length < 2) return null;
    const t = jr.pick(files);
    const us = files.filter((n) => n.parent !== t.parent);
    if (!us.length) return null;
    const u = jr.pick(us);
    u.name = t.name;
    return [t, u];
  }
  const where = (spec, n) => folderName(spec, n.parent);

  const pathIn = (L, id) => {
    const parts = [];
    for (let n = L.byId.get(id), k = 0; n && k < 50; n = n.parent === null ? null : L.byId.get(n.parent), k++) parts.unshift(n.name);
    return `/${parts.join('/')}`;
  };
  const kidsOf = (L, id) => L.kids.get(id === null || id === undefined ? '' : id) || [];

  Object.assign(fam.lib, {
    ancestorsStatic, duplicateFile, expanded, FOLDER_NAMES, folderChain, folderName, isLoaded, isOpen, kidsOf,
    lazyOf, live, navErr, nodeOf, openPath, pathIn, revealStep, rows, sampleNodes, sceneOpen, sceneTarget,
    scrollStep, tickTree, toggleFolder, treeBase, treeCfg, treeNav, where,
  });
  // Exposed for widgets.
  Object.assign(fam.helpers, { live, rows, isOpen, isLoaded, toggleFolder });
})();
