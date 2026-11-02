/* use-file-manager/judging.js: shared judging; loaded through logic.js files before the scenarios. */
(function () {
  'use strict';
  const lib = env.taskOf('use-file-manager').lib;
  const { C, TOP, SUB, ROOT, countOk, effective, deletes, moves, renames, itemOf, split, fileName, isoDate, pathTo, pathText, listText } = lib;
  const { quote: q } = env.util;

  const goalIds = (spec) => (spec.goal.files ? spec.goal.files : spec.goal.file !== undefined ? [spec.goal.file] : []);

  // What the "check with me" tail and the oracle's question say for each scenario (see irreversibleDone).
  function confirmOf(spec) {
    const e = effective(spec);
    const g = spec.goal;
    const n = g.files ? g.files.length : 1;
    const them = n === 1 ? 'it' : 'them';
    const sel = `${n === 1 ? 'The file is' : `All ${n} files are`} selected.`;
    const dest = g.dest ? itemOf(spec, g.dest).name : '';
    if (deletes(e)) return { tail: `before you delete ${them} for good`, message: `${sel} Should I go ahead and permanently delete ${them}?`, select: e === 'select' };
    if (e === 'copy') return { tail: `before you copy ${them}`, message: `${sel} Should I go ahead and copy ${them} to "${dest}"?` };
    if (moves(e)) return { tail: `before you move ${them}`, message: `${sel} Should I go ahead and move ${them} to "${dest}"?` };
    if (renames(e)) return { tail: 'before you confirm the new name', message: `I have typed the new name. Should I go ahead and rename the file to "${g.name}"?` };
    if (e === 'navigate') return { tail: 'before you open it', message: `I am right next to "${itemOf(spec, g.folder).name}". Should I go ahead and open it?` };
    return { tail: 'before you open it', message: `I have found "${itemOf(spec, g.file).name}". Should I go ahead and open it?` };
  }

  function judgeOf(jr, spec, mode) {
    const v = spec.scenario;
    if (mode === 'confirm') return { mode, message: confirmOf(spec).message };
    spec.startMode = 'off';
    if (mode === 'impossible') {
      if (v === 'navigate') {
        const used = new Set(spec.folders.map((f) => f.name));
        const pool = split(TOP.concat(SUB), spec).filter((n) => !used.has(n));
        if (!pool.length) return null;
        const name = jr.pick(pool);
        return { mode, what: [name], message: `I can't do that: there is no folder called "${name}" anywhere in ${spec.rootName}.`,
          templates: [
            'Go to the {name} folder.', 'Open the folder {name}.', 'Navigate to {name}.',
            'Take me to the {name} folder.', 'Show the contents of {name}.', 'Let me see inside {name}.',
            'Bring up {name} for me.', 'I want to browse {name}.', 'Show me what is in {name}.',
            'Let me into {name} now.', '{name} is where I want to go.', 'I want {name} opened.',
            'Switch into {name} now.'
          ],
          vars: { name: q(name) }, terse: `cd ${name}` };
      }
      const ids = goalIds(spec);
      const F = itemOf(spec, ids[0]);
      const names = new Set(spec.files.map((f) => f.name.toLowerCase()));
      const ext = F.ext ? `.${F.ext}` : '';
      const stem = F.name.slice(0, F.name.length - ext.length);
      let name = null;
      for (let t = 0; t < 30 && !name; t++) {
        const cand = jr.bool(0.5) ? `${stem}${jr.pick([
          ' (final)', ' v2', ' - signed', ' (old)', ' 2', '(draft)', '- review', '(copy)', '- sent', '(test)',
          '- locked', '- alt'
        ])}${ext}` : fileName(jr, spec, F.ext);
        if (!names.has(cand.toLowerCase())) name = cand;
      }
      if (!name) return null;
      const list = [name, ...ids.slice(1).map((id) => itemOf(spec, id).name)];
      return { mode, what: [name], message: `I can't do that: there is no file named "${name}" in any folder.`, ...fileJudgeText(jr, spec, list), terse: `${v} ${name}` };
    }
    // ambiguous: a second file (or folder) with the same name in another folder
    if (v === 'navigate') {
      const G = spec.folders.find((f) => f.id === spec.goal.folder);
      const others = spec.folders.filter((f) => f.id !== ROOT && f.id !== G.id && f.parent !== G.parent);
      if (!others.length) return null;
      const H = jr.pick(others);
      H.name = G.name;
      const pa = itemOf(spec, G.parent).name;
      const pb = itemOf(spec, H.parent).name;
      return { mode, cands: [[pa], [pb]], others: otherFolders(spec, [pa, pb], []), message: `Which "${G.name}" folder do you mean: the one in ${pa} or the one in ${pb}?`,
        templates: [
          'Go to the {name} folder.', 'Open the folder {name}.', 'Navigate to {name}.',
          'Take me to the {name} folder.', 'Show the contents of {name}.', 'Make {name} the open folder.',
          'Browse {name} now.', 'Get me inside {name}.', 'Open up {name} for me.'
        ],
        vars: { name: q(G.name) }, terse: `cd ${G.name}` };
    }
    const g = spec.goal;
    const ids = goalIds(spec);
    const F = itemOf(spec, ids[0]);
    const banned = new Set([F.parent, g.dest].filter(Boolean));
    const homes = jr.shuffle(spec.folders.filter((f) => !banned.has(f.id)));
    spec.grouped = false; // the page is left as it is; no group headings to budget for
    let n = 0;
    for (const f of spec.files) n = Math.max(n, Number(f.id.slice(1)) + 1);
    for (const Q of homes) {
      const twin = { ...F, id: `f${n}`, parent: Q.id, date: isoDate(jr), size: C.fileSize(jr, F.kind) };
      spec.files.push(twin);
      const away = spec.folders.filter((f) => f.id !== F.parent && f.id !== Q.id);
      const keep = spec.cwd0;
      if (away.length) spec.cwd0 = jr.pick(away).id;
      if (!countOk(spec)) { spec.files.pop(); spec.cwd0 = keep; continue; }
      const pa = itemOf(spec, F.parent).name;
      return { mode, cands: [[pa], [Q.name]], others: otherFolders(spec, [pa, Q.name], g.dest ? pathTo(spec, g.dest) : []),
        message: `Which "${F.name}" do you mean: the one in ${pa} or the one in ${Q.name}?`,
        ...fileJudgeText(jr, spec, ids.map((id) => itemOf(spec, id).name)), terse: `${v} ${F.name}` };
    }
    return null;
  }

  // The other folders of the tree, by name: a question about twins must not offer them (not the candidates' own names, nor
  // the folders on the goal's destination path, which the instruction itself names).
  function otherFolders(spec, cand, skip) {
    const taken = new Set(cand.concat(skip.map((id) => itemOf(spec, id).name)).map((n) => n.toLowerCase()));
    return [...new Set(spec.folders.map((f) => f.name).filter((n) => !taken.has(n.toLowerCase())))].map((n) => [n]);
  }

  // Path-free instruction templates for the files `names` (ambiguous / impossible episodes); never name the folder the
  // files are in, so that a second file of the same name (or a missing one) is what the agent has to notice.
  function fileJudgeText(jr, spec, names) {
    const g = spec.goal;
    const e = effective(spec);
    const vars = { file: q(names[0]), files: listText(names.map(q)) };
    if (g.name !== undefined) vars.new = q(g.name);
    if (g.dest) Object.assign(vars, { dest: q(itemOf(spec, g.dest).name), destPath: q(pathText(jr, spec, g.dest)) });
    const T = {
      open: [
        'Open {file}.', 'Find the file {file} and open it.', 'Open the file called {file}.',
        'Double-click {file} to open it.', '{file} is what to open.', 'I need to open {file}.',
        'Bring {file} up onscreen.', 'Show me {file} by opening it.', '{file} needs opening.',
        'Give {file} a double-click.', 'I want {file} opened.', 'Open {file} so I can see it.'
      ],
      rename: [
        'Rename {file} to {new}.', 'Change the name of {file} to {new}.', 'Give the file {file} the new name {new}.',
        '{file} should be called {new}; rename it.', 'Use {new} as the name of {file}.',
        'Replace the name {file} with {new}.', '{new} is the new filename for {file}.',
        '{file} needs the name {new} instead.', 'I want {file} renamed to {new}.'
      ],
      dblrename: [
        'Rename {file} to {new} by double-clicking its name.',
        'Double-click the name of {file} and change it to {new}.',
        'Edit the name of {file} in place so it reads {new}.',
        'Set {file} to {new} by editing the filename in place.', '{file} needs an in-place filename change to {new}.'
      ],
      delete: [
        'Delete {files}.', 'Move {files} to the trash.', 'Remove {files}.', 'Get rid of {files}.',
        'Get {files} deleted.', 'Out with {files}.'
      ],
      multidelete: [
        'Delete {files} in one go, using the right-click menu.',
        'Select {files} and delete them together with a single Delete.', 'Trash {files} all at once.',
        'Remove {files} in one operation.', 'Use one deletion to remove {files} together.',
        'With {files} selected, use Delete once.', 'Use the right-click menu to trash {files} together.',
        '{files} should all be deleted at once.', 'From the context menu, delete {files} together.',
        'I want {files} trashed in one operation.', 'Delete {files} using one operation.'
      ],
      move: [
        'Move {files} into {destPath}.', 'Put {files} in {destPath}.', 'Relocate {files} to the {dest} folder.',
        'File {files} under {destPath}.', 'Get {files} moved to {destPath}.', '{files} must move to {destPath}.',
        'Send {files} to {destPath}.', 'I want {files} in {destPath}.'
      ],
      multimove: [
        'Move {files} into {destPath} with a single drag.', 'Drag {files} together into {destPath}, in one go.',
        'Relocate {files} to {destPath} in one move.', 'Select {files} and move them all to {destPath} at once.',
        'Use one drag to move {files} over to {destPath}.', 'With {files} selected, move to {destPath} as one.',
        'Take {files} to {destPath} together in a single drag.', 'As a group, move {files} to {destPath} in one go.',
        'I want {files} moved to {destPath} all at once.', 'Move the selection of {files} to {destPath} at once.',
        'Drag {files} to {destPath} as one selection.', 'Drop {files} into {destPath} with one group drag.',
        '{destPath} is where {files} should go in one move.'
      ],
      copy: [
        'Copy {files} into {destPath}; keep the originals.', 'Put a copy of {files} in {destPath}.',
        'Duplicate {files} into the {dest} folder.', 'Copy, do not move, {files} to {destPath}.',
        'The {dest} folder needs a copy of {files}.', 'Keep {files}; copy these to {destPath}.',
        'Create new copies in {destPath} from {files}.', '{destPath} should hold copies of {files}.',
        'Add {files} to {destPath} as copies.', 'Use {destPath} to store copies of {files}.'
      ],
      select: [
        'Select {files}.', 'Select only {files}.', 'Highlight {files} together.',
        'Make a multi-selection of {files}.', 'Set selection to {files}.', 'Leave {files} selected.',
        'I want {files} selected.'
      ],
    };
    return { templates: T[e], vars };
  }

  function judgeInstruction(spec, rng) {
    const j = spec.judge;
    return env.instruct.say(rng, env.instruct.phrase(rng, j.templates, j.vars, spec.isplit), { isplit: spec.isplit, terse: j.terse });
  }

  Object.assign(lib, { judgeOf, confirmOf, judgeInstruction });
})();
