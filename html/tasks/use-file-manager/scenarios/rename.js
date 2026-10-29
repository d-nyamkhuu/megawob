/*
 * use-file-manager / rename: rename a file from its context menu or F2.
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('use-file-manager');
  const { ancestors, fileIn, fileName, fill, foldersAt, isDeleted, itemOf, lev, nameOf, navStep, parentOf, pathText, pick,
    renamedOthers, ROOT, sameSet, say, split } = fam.lib;
  const { clone, quote: q } = env.util;

  const DESCRIPTIVE = ['Team offsite', 'Beach sunset', 'Kitchen renovation', 'Passport scan', 'Office party', 'Product shoot', 'Site visit',
    'Whiteboard notes', 'Garden plan', 'Conference badge', 'Signed lease', 'Wedding toast', 'Quarterly review', 'Client feedback',
    'Hiring plan', 'Board deck', 'Brand guidelines', 'Expense summary', 'Lease agreement', 'Moving checklist',
    'Airport pickup', 'Workshop agenda', 'Family reunion', 'Mountain trail', 'Studio layout', 'Recipe collection',
    'School concert', 'Train tickets', 'Volunteer roster', 'Podcast outline', 'Winter cabin', 'Reading list',
    'Plant catalog', 'Coffee tasting', 'Safety briefing', 'Festival map', 'Storage inventory', 'Room measurements',
    'Audio interview', 'Travel itinerary', 'Bug report', 'Launch timeline', 'Shipping labels', 'Workshop photos',
    'Summer picnic', 'Book club', 'Neighborhood guide', 'Stage lighting', 'School calendar', 'Craft patterns',
    'Pet adoption', 'Weather log', 'Design sketch', 'Archive index', 'Library hours', 'Costume fitting',
    'Harbor panorama', 'Garden harvest', 'Client workshop', 'River crossing', 'Birthday candles', 'Cottage repairs',
    'Field recording', 'Team directory', 'Delivery schedule', 'Portrait session', 'Bakery menu', 'Lost property',
    'Rainy afternoon', 'Volunteer training', 'Cabin bookshelf', 'Market day', 'Studio inventory', 'School fundraiser',
    'Bridge inspection', 'Winter forecast', 'Family recipes', 'Camping checklist', 'Market research',
    'Birdwatching log', 'Community mural', 'Workshop supplies', 'Lighthouse visit', 'Charity auction',
    'Sewing project', 'Harvest festival', 'Daily sketchbook', 'Gallery opening', 'Snowshoe route', 'Orchard pruning',
    'Pottery samples', 'Riverbank survey', 'Choir recital', 'Bus timetable', 'Trail markers', 'Garden gate',
    'Family portrait', 'Classroom display', 'Rain barrel', 'Autumn leaves', 'Lantern parade', 'Coastal erosion',
    'Handmade quilt', 'School playbill', 'Picnic blanket', 'Village well', 'Survey markers', 'Garden irrigation',
    'Woodland path', 'Supply request', 'Greenhouse journal'];

  function renameTarget(rng, spec, F) {
    const ext = F.ext ? `.${F.ext}` : '';
    const stem = F.name.slice(0, F.name.length - ext.length);
    const year = rng.int(2022, 2025);
    const kinds = [
      () => `${rng.pick(split(DESCRIPTIVE, spec))}${ext}`,
      () => `${rng.pick(split(DESCRIPTIVE, spec))} ${year}${ext}`,
      () => `${year}-${String(rng.int(1, 12)).padStart(2, '0')}-${String(rng.int(1, 28)).padStart(2, '0')} ${stem}${ext}`,
      () => fileName(rng, spec, F.ext),
      () => `${stem.replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim()} (approved)${ext}`,
    ];
    return rng.pick(kinds)();
  }

  env.scenario('use-file-manager', {
    name: 'rename',
    keyboard: true,
    goal(rng, spec, tree) {
    const P = rng.pick(foldersAt(spec, (f) => f.id !== ROOT)).id;
    while (fileIn(spec, P).length < (spec.ood ? 6 : 3)) tree.addFile(P);
    const F = rng.pick(fileIn(spec, P));
    let name = null;
    for (let t = 0; t < 30 && !name; t++) {
      const cand = renameTarget(rng, spec, F);
      const d = lev(cand.toLowerCase(), F.name.toLowerCase()) / Math.max(cand.length, F.name.length);
      if (d > 0.35 && !spec.files.some((x) => x.name.toLowerCase() === cand.toLowerCase())) name = cand;
    }
    if (!name) return false;
    spec.cwd0 = rng.bool(0.6) ? P : rng.pick(spec.folders.filter((f) => f.id !== P)).id;
    spec.goal = { file: F.id, name };
    spec.keys = rng.bool(0.4);
    spec.route = spec.keys && rng.bool(0.6) ? 'f2' : 'menu';
    if (spec.level === 'easy') { spec.keys = true; spec.route = 'menu'; } // typing the name is unavoidable
    return true;
    },
    init(spec, m, mode, rng) {
      const g = spec.goal;
      const at = (folder) => ({ ...m, cwd: folder, expanded: [...new Set(m.expanded.concat(ancestors(spec, folder)))] });
      const F = itemOf(spec, g.file);
      if (mode === 'partial') {
        const ext = F.ext ? `.${F.ext}` : '';
        const stem = g.name.slice(0, g.name.length - ext.length);
        const half = `${stem.slice(0, Math.max(1, Math.ceil(stem.length / 2)))}${ext}`;
        m = at(F.parent);
        m = { ...m, names: { [F.id]: half }, undo: [{ kind: 'rename', ids: [F.id], prev: { [F.id]: F.name } }] };
      } else if (mode === 'wrong') {
        const sibs = spec.files.filter((f) => f.parent === F.parent && f.id !== F.id);
        const o = rng.pick(sibs);
        m = at(F.parent);
        m = { ...m, names: { [o.id]: g.name }, undo: [{ kind: 'rename', ids: [o.id], prev: { [o.id]: o.name } }], toast: { kind: 'rename', n: 1 } };
      }
      return m;
    },
    result(m, spec, pen) {
      const g = spec.goal;
      if (isDeleted(m, g.file)) return 1;
      const a = nameOf(m, spec, g.file);
      const d = lev(a, g.name) / Math.max(a.length, g.name.length, 1);
      return Math.min(1, d + (renamedOthers(m, spec).length ? 0.5 : 0) + pen);
    },
    solve(spec, m) {
      const g = spec.goal;
      return { ...m, names: { ...m.names, [g.file]: g.name } };
    },
    plan(m, spec) {
      const g = spec.goal;
      const P = parentOf(m, spec, g.file);
      if (m.renaming === g.file) return m.draft !== g.name ? { type: [{ renameInput: true }, g.name] } : { key: 'Enter' };
      const nav = navStep(m, spec, P);
      if (nav) return nav;
      if (spec.scenario === 'dblrename') return { dblclick: { tile: g.file } };
      if (spec.route === 'f2') return sameSet(m.selected, [g.file]) ? { key: 'F2' } : { click: { tile: g.file } };
      if (m.menu && m.menu.on === g.file) return { click: { menuItem: 'rename' } };
      return { rightclick: { tile: g.file } };
    },
    instruction(spec, rng) {
      const g = spec.goal;
      const F = itemOf(spec, g.file);
      const vars = { file: q(F.name), new: q(g.name), path: q(pathText(rng, spec, F.parent)), folder: q(itemOf(spec, F.parent).name) };
      const T = ['Rename {file} in {path} to {new}.', 'Change the name of {file} to {new}.', 'Give the file {file} the new name {new}.',
        '{file} should be called {new}; rename it.', 'Rename the file {file} (in {folder}) as {new}.', 'Fix the file name: {file} becomes {new}.',
        'In {folder}, rename {file} to {new}.',
        'Assign {new} as the filename of {file}.',
        'File to rename: {file}. New name: {new}.',
        'Let {file} be renamed to {new}, please.',
        '{new} is the required name for {file}.',
        'Update {file} in {path}: name it {new}.',
        'Name update in {folder}: {file} to {new}.',
        'The file {file} needs renaming to {new}.',
        'For {file}, set its full name to {new}.',
        'Make {new} the name shown for {file}.',
        'In {folder}, {file} needs the name {new}.',
        'Please rename {file} to exactly {new}.'];
      return say(rng, spec, fill(pick(rng, spec, T), vars), { terse: `${F.name} → ${g.name}`,
        steps: [`Right-click ${vars.file}`, 'choose Rename', `type ${vars.new}`, 'press Enter'] });
    },
    silent(next, prev, spec, rng) {
      const g = spec.goal;
      const m = clone(next);
      let out = null;
      const id = g.file;
      const name = nameOf(next, spec, id);
      if (name === nameOf(prev, spec, id) || name.length < 8) return null;
      const L = Math.max(5, rng.int(Math.floor(name.length * 0.55), name.length - 2)); // the field keeps its first characters
      out = { ...m, names: { ...m.names, [id]: name.slice(0, L) } };
      return out;
    },
    retarget(spec, model, rng) {
      const g = spec.goal;
      const n = clone(spec);
      const F = itemOf(spec, g.file);
      const taken = new Set(spec.files.map((f) => f.name.toLowerCase()).concat(Object.values(model.names).map((x) => x.toLowerCase()), [g.name.toLowerCase()]));
      let name = null;
      for (let t = 0; t < 30 && !name; t++) {
        const cand = renameTarget(rng, spec, F);
        if (!taken.has(cand.toLowerCase()) && lev(cand.toLowerCase(), F.name.toLowerCase()) / Math.max(cand.length, F.name.length) > 0.35) name = cand;
      }
      if (!name) return null;
      n.goal = { ...g, name };
      return n;
    },
  });
})();
