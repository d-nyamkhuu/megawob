/*
 * use-file-manager: open, rename, select, move, copy and delete files in a desktop file explorer.
 * A desktop file explorer (folder tree, breadcrumb, icon or details view, context menu, Undo).
 * No single MiniWoB counterpart (navigate-tree is the closest: one tree, one click); it combines a
 * context-menu + double-click file manager, marquee selection and tree drag-and-drop. Teaches double-click, right-click
 * menus, Ctrl/Shift multi-select, rubber-band selection, drag and drop into folders including spring-loaded
 * tree folders that open while hovered during a drag, breadcrumb navigation, and Undo after a delete.
 *
 * Files (files: [...] below, loaded in order after this one): scenarios/<scenario>.js, one env.scenario('use-file-manager', {...}) per scenario
 * with its goal, start, grading, solve, plan and wording (hook list above the dispatch section). This file holds the header,
 * the tree and the model transitions the scenarios share (lib) and the dispatch.
 *
 * scenarios
 *   navigate  make a given folder the current one: breadcrumb segments, Up, double-click folders in the main
 *             pane, or click / expand rows of the tree. Starts in another branch.
 *   open      open a file (double-click it; a viewer opens) that sits in another folder.
 *   rename    rename a file: right-click > Rename (or select + F2 in keyboard episodes), type, Enter. The
 *             inline field commits on Enter or blur, cancels on Escape.
 *   delete    delete one to three named files (or "all PDFs in X"): select (Ctrl-click), then right-click >
 *             Delete, the toolbar trash button, or the Delete key (keyboard episodes). A toast and the toolbar
 *             offer Undo.
 *   select    the folder is grouped by kind; select a whole group (rubber band from empty space, or click +
 *             Shift-click), a group but one (then Ctrl-click), a range in display order, or a scattered list
 *             (Ctrl-click). Nothing else needs doing.
 *   move      move one or two files into a folder: drag them onto a folder tile, onto a tree row (a collapsed
 *             tree folder springs open after ~0.6 s of hovering during the drag: { down } { move } { wait } { up }),
 *             onto a breadcrumb segment, or Cut + Paste (context menus) after navigating.
 *   multimove move a selection of 3-5 files in ONE drag: a contiguous block ("from A to B", Shift-click) or a
 *             scattered set (Ctrl-click) is selected first, then dragged onto a folder tile or tree row. A plain
 *             click replaces the selection, and a second move / delete / copy (an undo entry) ends the episode
 *             ('one-batch'); Undo takes an operation back, so redoing it is fine. Routes 'drag' | 'spring'.
 *   multidelete delete a block or scatter of 3-5 files in ONE operation: select them with Shift / Ctrl clicks,
 *             then right-click one of them > Delete (the selection stays when the right-clicked tile is part of
 *             it). Same one-batch rule as multimove.
 *   copy      copy 1-3 files into a folder by Alt-dragging them (the original stays; a plain drag moves, which
 *             is wrong and has to be undone). The copy keeps the name and lands in the target folder; model.copies
 *             lists copy ids ('c' + file id + '_' + n), which live in model.parent like files. Route 'drag' only
 *             (target is a folder tile in the current folder or a visible tree row).
 *   dblrename rename a file by double-clicking its name: the double-click starts the inline field (instead of
 *             opening a viewer), type, Enter. No Rename menu item or F2 on this page. Keyboard input needed.
 *   range     a contiguous run of 3-5 files is selected by clicking the first and Shift-clicking the last, then ONE
 *             operation acts on it (spec.act 'move' | 'delete' | 'copy'): move = one drag onto a folder tile / tree
 *             row (routes 'drag' | 'spring') or Cut + Paste ('cut'); delete = right-click > Delete or the toolbar
 *             trash; copy = one Alt-drag. Same one-batch rule as multimove (a second move / delete / copy ends the
 *             episode; Undo takes one back). The instruction names the run by its first and last file.
 *   rangemix  a run of 4-6 files (Shift-click) corrected with Ctrl-clicks: "from A to B except C, and also F" (one or
 *             two files of the run dropped, one or two outside it added), then ONE operation as in range.
 *   Deleting a file that the goal does not ask to delete is a wrong final choice in every scenario (R4): with
 *   spec.recoverable the first one shows the Undo toast and carries an error penalty until undone, a second
 *   one ends the episode ('wrong-delete'); without it the first one ends the episode.
 *
 * spec   { scenario, startMode, isplit, csplit, ood, recoverable, keys, route, forcedRoute? (opts.route), upRoute,
 *          view ('icons' | 'list'),
 *          cols (tiles per row in the icon view), rootName, folders: [{ id, name, parent }] ('d0' is the root),
 *          files: [{ id, name, ext, kind, size, date, parent }], cwd0, goal }
 *   navigate goal { folder }                       route 'pane' | 'tree'
 *   open     goal { file }                         route 'pane' | 'tree'
 *   rename   goal { file, name }                   route 'menu' | 'f2'
 *   delete   goal { files[], kind? }               route 'menu' | 'toolbar' | 'key'
 *   select   goal { files[], mode: 'group' | 'groupbut' | 'range' | 'list', kind?, except? }
 *                                                  route 'marquee' | 'shift' | 'ctrl'
 *   move     goal { files[], dest }                route 'drag' | 'spring' | 'cut'
 *   multimove goal { files[], dest, from }          route 'drag' | 'spring', spec.selRoute 'shift' | 'ctrl'
 *   multidelete goal { files[], kind: null, folder } route 'menu', spec.selRoute
 *   copy     goal { files[], dest, from }           route 'drag'
 *   dblrename goal { file, name }                   route 'dbl'
 *   range    goal { files, dest?, from, folder: from, run: [first, last], skip: [], plus: [] }
 *                                                  spec.act, spec.selRoute 'shift'; route 'drag' | 'spring' | 'cut' (move),
 *                                                  'drag' (copy), 'menu' | 'toolbar' (delete)
 *   rangemix like range; goal.files = the run minus goal.skip plus goal.plus (display order)
 * levels easy / medium: smaller trees (easy 2-3 top folders, 5-7 folders; medium 3-4, 6-9), fewer files per
 *        folder and fewer goal files (easy: 1 file or a group of 2-3, medium up to 2), no keyboard routes on easy,
 *        select: 2 kinds / easy groups only; the multi scenarios use 3-file sets (easy: ranges only); range runs of 3
 *        (easy) / 4 (medium) files, easy acts move (drag) or delete only; rangemix runs of 4 (easy: one file dropped,
 *        nothing added) / 5 files. Normal draws exactly what it always did.
 * model  { cwd, back: [folder ids], expanded: [folder ids], selected: [ids], anchor, parent: { fileId: folderId },
 *          names: { id: name }, deleted: [ids], undo: [{ kind: 'delete' | 'move' | 'rename', ids, prev }], clip,
 *          menu: null | { on: id | 'bg' }, renaming, draft, viewer, opened: [ids], drag: null | { ids, active,
 *          over: null | { kind: 'tree' | 'tile' | 'crumb', id }, overMs }, toast: null | { kind, n, dest? }, wrongs, copies?: [copy ids] (copy scenario) }
 *
 * error (tau 0; pen = 0.5 when a file is wrongly deleted and not yet restored)
 *   navigate min(1, tree distance(cwd, goal) / 3) + pen
 *   open     0 once the file was opened; else 0.25 + 0.75 * min(1, distance(cwd, its folder) / 3)  (+ pen)
 *   rename   edit distance(name, goal name) / max length + 0.5 if another item was renamed (+ pen), capped at 1
 *   delete   (goal files not deleted + 2 * other files deleted) / |goal files|, capped at 1 (the same weights as select; an
 *            overlap measure such as Jaccard would pay for deleting everything)
 *   select   (goal files not selected + 2 * other files selected) / |goal files|, capped at 1 (+ pen): selecting every file of
 *            the folder is no progress over selecting none
 *   range / rangemix  as multimove (move, 1 - the files not in dest ...), multidelete or copy by spec.act
 *   delete, multidelete, copy, move, multimove (and range / rangemix): while no delete / move / copy has run and the
 *            error above is 1, 0.5 + 0.5 x the select error of the current selection (or of the clipboard, after a
 *            cut / copy, if lower) against the goal files (the selection stage pays up to half; a wrong file costs
 *            twice a missing one, so a Shift range that overshoots dips until the extra files are Ctrl-clicked off)
 *   judge ambiguous / impossible  0 until something is deleted, moved, copied, renamed or opened, then 1 (and the
 *            episode ends 'wrong-choice'); confirm  the select error for the selection scenarios, rename:
 *            the inline field holds the new name (not committed), navigate: next to the goal folder, open: its folder
 *            open and the file selected; 1 once the irreversible step (the delete / move / copy / commit / entering /
 *            opening) is taken. fam.helpers.irreversible(prev, next, spec) names that step for widgets.
 *   move     (goal files not in dest + 2 * other files not where they started) / |goal files|, capped at 1
 * start modes  off, partial (one step from the goal folder / in the file's folder / half-renamed / some deleted /
 *   half selected / one file moved or the files cut), wrong (a sibling folder / another file open / another file
 *   renamed / a wrong file deleted with Undo offered (not counted towards the R4 limit) / wrong files selected /
 *   a file moved to the wrong folder), solved.
 * ood    deeper trees (4 levels, 12-18 folders), more files per folder (up to 5 rows of tiles, 7 per row), more
 *        goal files.
 * inputs pointer; + keyboard for rename and keyboard-share episodes (spec.keys: Delete key, F2).
 * opts.route (episode knob; undefined = the mix above) sets spec.forcedRoute where honoured: 'keyboard' = rename
 *        route 'f2', delete route 'key' (spec.keys true); 'pointer' = spec.keys false, rename route 'menu' (it
 *        still types the name and presses Enter: rename has no pointer-only route), delete 'menu' / 'toolbar'.
 *        Ignored by navigate, open, select and move (no keyboard route) and for 'wheel' (no wheel route).
 *
 * plan targets (widget locate)
 *   { tile: id }               a file or folder in the main pane (icon)
 *   { tree: id }               a tree row label            { treeToggle: id }   its expand chevron
 *   { crumb: id }              a breadcrumb segment        { up: true }  { back: true }  { undo: true }  { trash: true }
 *   { menuItem: 'open' | 'rename' | 'delete' | 'cut' | 'paste' | 'selectAll' }      the open context menu
 *   { renameInput: true }      the inline name field       { bg: true }  empty space in the main pane
 *   { marquee: 'from' | 'to', kind }   corners of a rubber band that covers exactly one kind group
 *   { viewerClose: true }      { blank: true }  the window title (neutral; pressing it closes menus)
 * plan steps: click (+ Control / Shift), dblclick, rightclick, drag (tiles, rubber band), down / move / wait / up
 * (spring-loaded tree), type + key Enter (rename), key Delete / F2.
 *
 * judge modes (judgeModes; spec.judge = { mode, message, cands?, others?, what?, templates?, vars?, terse? }; ambiguous / impossible
 *   start on the untouched page (startMode off, error 0 until a file is deleted / moved / copied / renamed / opened):
 *   ambiguous  two files with the same name in different folders (every scenario: the instruction names the files without
 *              a path and the first of them exists twice), or two folders with the same name under different
 *              parents (navigate); the reply asks (status ask), one option per parent folder (cands: its name; others:
 *              the tree's other folder names, never offered, minus the destination path the instruction names)
 *   impossible the named file (or folder, for navigate) exists nowhere in the tree; status impossible naming it (what: [its
 *              name])
 *   confirm    every scenario has one irreversible step, named in the status bar by the widget: delete / multidelete /
 *              select (selected for deletion) / range + rangemix delete: permanent delete; move / multimove / copy /
 *              range + rangemix: the operation; rename / dblrename: committing the name (Enter); navigate: entering the
 *              goal folder (its parent is the stop); open: opening the file (its folder, file selected, is the stop).
 *              The instruction ends "but check with me before you ...", the widget flags 'irreversible' when it is taken
 *              (via fam.helpers.irreversible(prev, next, spec))
 * hooks (round 2):
 *   facts(model, spec)       status bar of the folder open at the end: "N items" (label Items), the path bar's current
 *                            folder, "N selected" while files are selected, and for open the viewer's size / date. aliases are
 *                            other spellings of the value, label paraphrases go in labels.
 *   parts(model, spec)       preempt=cancel: each file by its name (value: its name now, its folder or null when deleted, copies
 *                            made; a name two files share gets "(folder)"), "Selection" (select), "Current folder" (navigate),
 *                            "Opened file" (open)
 *   silent(next, prev, spec, rng)  a believable failure that the page shows as done: one deleted file back, one moved /
 *                            copied file left out, a renamed name cut short, one selected file missing from the
 *                            selection, navigation that lands in a sibling folder, a viewer that did not open
 *   retarget(spec, model, rng)     a new goal in the same tree: navigate / open / select get another target, rename /
 *                            dblrename another new name, delete a larger set (the old files plus one), move / copy /
 *                            range (move, copy) another destination; null for judge episodes and range delete
 *
 * Helpers (widget API, env.taskDef.helpers):
 *   effective(spec): range operation as its batch scenario.
 *   irreversible(prev, next, spec): whether a confirm episode took its final step.
 *   KINDS: display labels by file kind.
 *   ROOT: root folder id.
 *   itemOf(spec, id): file, folder or copy metadata.
 *   isFolder(id): whether an id names a folder.
 *   nameOf(model, spec, id): current name.
 *   parentOf(model, spec, id): current parent.
 *   pathTo(spec, id): root-to-folder path.
 *   childrenOf(model, spec, folder): current child ids.
 *   display(model, spec, folder): child ids in display order.
 *   groups(model, spec, folder): child groups by kind.
 *   navigate(model, spec, folder, noBack?): enter a folder and clear the selection.
 *   goBack(model, spec): return to the preceding folder.
 *   goUp(model, spec): enter the parent folder.
 *   toggleExpand(model, spec, id): expand or collapse a tree row.
 *   clickItem(model, spec, id, mods?): select an item with optional Shift/Ctrl modifiers.
 *   selectOnly(model, id): select one item and anchor its range.
 *   selectAll(model, spec): select every displayed item.
 *   clearSelection(model, spec): commit any rename and clear the selection.
 *   marquee(model, spec, ids, base?): select rubber-band hits in display order.
 *   openItem(model, spec, id): enter a folder or open a file viewer.
 *   closeViewer(model): close the viewer.
 *   openMenu(model, spec, on): open a context menu on an item or background.
 *   closeMenu(model): close the context menu.
 *   startRename(model, spec, id): start the inline name editor.
 *   setDraft(model, text): update the rename draft.
 *   commitRename(model, spec): commit a valid, non-conflicting name.
 *   cancelRename(model): discard the inline name draft.
 *   deleteItems(model, spec, ids?): delete files and record Undo and wrong-choice state.
 *   cutItems(model, ids?): stage files on the clipboard.
 *   paste(model, spec): move clipboard files into the current folder.
 *   undo(model, spec): reverse the latest operation.
 *   dragPress(model, spec, id): prepare a drag of the current selection.
 *   dragOver(model, over): update the active drag target.
 *   dragEnd(model, spec, dropOn, copy?): finish the drag as a move or copy.
 *   dismissToast(model): dismiss the latest operation toast.
 * Self-test: selftest.js (checker and node tests only).
 *
 * Deviations: folders cannot be renamed, deleted or moved (their menu offers Open and disabled items); the
 * trash is not browsable (Undo restores).
 */
(function () {
  'use strict';

  const C = env.content;
  const lib = {};
  const { clone, quote: q, lev, listText } = env.util;
  const SPRING_MS = 600;
  const ROOT = 'd0';
  const isRange = (spec) => spec.scenario === 'range' || spec.scenario === 'rangemix';
  // range / rangemix grade and play like the batch scenario of their operation.
  const effective = (spec) => (isRange(spec) ? ({ move: 'multimove', delete: 'multidelete', copy: 'copy' })[spec.act] : spec.scenario);
  const BATCH = ['multimove', 'multidelete', 'range', 'rangemix'];
  const confirmJudge = (spec) => !!(spec.judge && spec.judge.mode === 'confirm');
  const quiet = (spec) => !!(spec.judge && spec.judge.mode !== 'confirm'); // ambiguous / impossible: leave the page alone

  // ---------------------------------------------------------------- content

  const KINDS = {
    document: ['Documents', 'document', 'documents'], text: ['Text files', 'text file', 'text files'],
    spreadsheet: ['Spreadsheets', 'spreadsheet', 'spreadsheets'], presentation: ['Presentations', 'slide deck', 'slide decks'],
    image: ['Images', 'image', 'images'], video: ['Videos', 'video', 'videos'], audio: ['Audio', 'audio file', 'audio files'],
    archive: ['Archives', 'archive', 'archives'], data: ['Data files', 'data file', 'data files'], web: ['Web pages', 'web page', 'web pages'],
    design: ['Design files', 'design file', 'design files'], folder: ['Folders', 'folder', 'folders'],
  };
  const KIND_ORDER = ['folder', 'document', 'text', 'spreadsheet', 'presentation', 'image', 'video', 'audio', 'archive', 'data', 'web', 'design'];
  function extOf(name) {
    const n = String(name).toLowerCase();
    if (n.endsWith('.tar.gz')) return 'tar.gz';
    const i = n.lastIndexOf('.');
    return i > 0 ? n.slice(i + 1) : '';
  }
  const kindOf = (ext) => (C.FILE_EXTENSIONS.find((e) => e.ext === ext) || { kind: 'document' }).kind;
  const split = (list, spec) => C.split(list, spec.csplit);
  const heldout = (x) => C.isHeldout(x);

  function fileName(rng, spec, ext) {
    for (let t = 0; t < 40; t++) {
      const n = C.fileName(rng, ext, { csplit: spec.csplit });
      if (spec.csplit === 'all' || heldout(n) === (spec.csplit === 'heldout')) return n;
    }
    return C.fileName(rng, ext, { csplit: spec.csplit });
  }
  const TOP = ['Documents', 'Downloads', 'Pictures', 'Projects', 'Finance', 'Clients', 'Archive', 'Music', 'Videos', 'Desktop',
    'Shared', 'Templates', 'Personal', 'Work', 'Receipts', 'Travel', 'Design', 'Marketing', 'HR', 'Legal', 'School', 'Photos',
    'Taxes', 'Recipes', 'Contracts', 'Research', 'Operations', 'Admin', 'Family', 'Gardening', 'Pets', 'Books',
    'Writing', 'Events', 'Equipment', 'Suppliers', 'Sales', 'Support', 'Security', 'Quality', 'Logistics', 'Policies',
    'Community', 'Sports', 'Games', 'Crafts', 'Keepsakes', 'Utilities', 'Insurance', 'Housing', 'Vehicles', 'Contacts',
    'Auditions', 'Weather', 'Languages', 'Analytics', 'Childcare', 'Genealogy', 'Camping', 'Astronomy', 'Geology',
    'Sewing', 'Pottery', 'Puzzles', 'Journals', 'Awards', 'Theater', 'Dance', 'Shipping', 'Catering', 'Patents',
    'Fishing', 'Cycling', 'Origami', 'Sculpture', 'Aquariums', 'Boating', 'Archery', 'Chess', 'Stamps', 'Antiques',
    'Fossils', 'Podcasts', 'Folklore', 'Botany', 'Chemistry', 'Optics', 'Textiles'];
  const SUB = ['Drafts', 'Old', 'Exports', 'Scans', 'Invoices', 'Reports', 'Assets', 'Screenshots', 'Meeting notes', 'Presentations',
    'Backups', 'Raw', 'Final', 'Signed', 'Proposals', 'Budgets', 'Logos', 'Fonts', 'Payroll', 'Statements', 'Tickets',
    'Brochures', 'Interviews', 'Wallpapers', 'Edits', 'Covers', 'Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024', '2022', '2023',
    '2024', '2025', 'To review', 'Approved', 'Archive old', 'Website', 'Social', 'Print', 'Audio notes', 'Templates old',
    'Checklists', 'Reference', 'Samples', 'Feedback', 'Manuals', 'Schedules', 'Blueprints', 'Diagrams', 'Surveys',
    'Transcripts', 'Captions', 'Labels', 'Forms', 'Certificates', 'Licenses', 'Bookmarks', 'Training', 'Milestones',
    'Deliverables', 'Test results', 'Experiments', 'Prototypes', 'Calculations', 'Measurements', 'Maps', 'Inventory',
    'Reservations', 'Signups', 'Attendance', 'Mood boards', 'Textures', 'Animations', 'Voiceovers', 'On hold',
    'Internal', 'Read only', 'Misc', 'Agendas', 'Announcements', 'Indexes', 'Glossaries', 'Appendices', 'Worksheets',
    'Answer keys', 'Lesson plans', 'Exercises', 'Storyboards', 'Scripts', 'Sound effects', 'Mixes', 'Renderings',
    'Cutouts', 'Sketches', 'Patterns', 'Decision logs', 'Changelogs', 'Dependencies', 'Source code', 'Configuration',
    'Automation', 'Audit logs', 'Priority', 'Offline', 'Weekly', 'Seasonal', 'Menus', 'Guest lists', 'Routes',
    'Warranties', 'Time sheets', 'Intake', 'Handoffs', 'Roadmaps', 'Use cases', 'Personas', 'Wireframes',
    'Translations', 'Annotations', 'Footnotes', 'Errata', 'Abstracts', 'Case studies', 'White papers', 'Rubrics',
    'Portfolios', 'Bios', 'Credits', 'Escalations', 'Incidents', 'Claims', 'Inspections', 'Spare parts', 'Materials',
    'Packaging', 'Shift swaps', 'Renewals', 'Applications', 'Nominations', 'Donations', 'Handouts', 'Attachments',
    'Exhibits', 'Workshops'];
  const ROOTS = [
    'Home', 'My Drive', 'Documents', 'Team Drive', 'Shared drive', 'Workspace', 'File Library', 'Main Vault',
    'Data Bay', 'Media Hub', 'Records', 'Portal', 'Cloud Locker', 'Team Space', 'Dropzone', 'Network', 'Staging',
    'Terminal', 'Repository', 'Office', 'Exchange', 'Dashboard', 'Workbench', 'Collection'
  ];
  const nameOfX = (x) => (typeof x === 'string' ? x : x.name || x.city || String(x));
  function subName(rng, spec) {
    const r = rng.next();
    if (r < 0.15) return `Client - ${nameOfX(C.pick(rng, C.COMPANIES, { csplit: spec.csplit })).split(' ').slice(0, 2).join(' ')}`;
    if (r < 0.27) return `Trip to ${nameOfX(C.pick(rng, C.CITIES, { csplit: spec.csplit }))}`;
    if (r < 0.35) return `${C.pick(rng, C.LAST_NAMES, { csplit: spec.csplit })} onboarding`;
    return rng.pick(split(SUB, spec));
  }

  // ---------------------------------------------------------------- tree generation

  function genTree(rng, spec) {
    const folders = [{ id: ROOT, name: spec.rootName, parent: null }];
    const used = new Set([spec.rootName]);
    const files = [];
    const usedFiles = new Set();
    let nextFile = 0;
    const depthMax = spec.ood ? 4 : 3;
    const lv = spec.level;
    const lf = lv ? rng.fork('lvl-tree') : null; // easy / medium: its own stream, normal draws nothing extra
    const target = lv ? (lv === 'easy' ? lf.int(5, 7) : lf.int(6, 9)) : spec.ood ? rng.int(12, 18) : rng.int(7, 12);
    const topNames = rng.shuffle(split(TOP, spec));
    const nTop = lv ? (lv === 'easy' ? lf.int(2, 3) : lf.int(3, 4)) : spec.ood ? rng.int(4, 6) : rng.int(3, 5);
    for (let i = 0; i < nTop; i++) {
      const name = topNames.find((n) => !used.has(n));
      used.add(name);
      folders.push({ id: `d${folders.length}`, name, parent: ROOT });
    }
    for (let guard = 0; folders.length < target && guard < 200; guard++) {
      const p = rng.pick(folders.slice(1));
      if (depth(folders, p.id) >= depthMax) continue;
      if (folders.filter((f) => f.parent === p.id).length >= 3) continue;
      let name = null;
      for (let t = 0; t < 20 && !name; t++) {
        const n = subName(rng, spec);
        if (!used.has(n)) name = n;
      }
      if (!name) continue;
      used.add(name);
      folders.push({ id: `d${folders.length}`, name, parent: p.id });
    }
    const addFile = (parent, ext) => {
      let name;
      for (let t = 0; t < 30; t++) {
        name = fileName(rng, spec, ext);
        if (!usedFiles.has(name.toLowerCase())) break;
      }
      if (usedFiles.has(name.toLowerCase())) name = name.replace(/(\.[^.]+)$/, ` (${usedFiles.size})$1`);
      usedFiles.add(name.toLowerCase());
      const e = extOf(name);
      const kind = kindOf(e);
      const size = C.fileSize(rng, kind);
      const f = { id: `f${nextFile++}`, name, ext: e, kind, size, date: isoDate(rng), parent };
      files.push(f);
      return f;
    };
    for (const f of folders) {
      const n = lv ? lf.int(f.id === ROOT ? 1 : 0, lv === 'easy' ? 2 : 3) : f.id === ROOT ? rng.int(1, 3) : rng.int(0, 4);
      for (let i = 0; i < n; i++) addFile(f.id);
    }
    return { folders, files, addFile };
  }
  function isoDate(rng) {
    const y = rng.int(2021, 2025);
    const m = rng.int(1, 12);
    const d = rng.int(1, 28);
    return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  }
  function depth(folders, id) {
    let d = 0;
    for (let f = folders.find((x) => x.id === id); f && f.parent; f = folders.find((x) => x.id === f.parent)) d++;
    return d;
  }

  // ---------------------------------------------------------------- queries

  const isFolder = (id) => id[0] === 'd';
  // A copy ('c' + file id + '_' + n) reads like its source file (its parent lives in model.parent).
  const itemOf = (spec, id) => (isFolder(id) ? spec.folders.find((f) => f.id === id)
    : id[0] === 'c' ? { ...spec.files.find((f) => f.id === id.slice(1).split('_')[0]), id } : spec.files.find((f) => f.id === id));
  const nameOf = (m, spec, id) => (m.names && m.names[id] !== undefined ? m.names[id] : itemOf(spec, id).name);
  const parentOf = (m, spec, id) => (m.parent && m.parent[id] !== undefined ? m.parent[id] : itemOf(spec, id).parent);
  const isDeleted = (m, id) => m.deleted.includes(id);
  function pathTo(spec, id) {
    const out = [];
    for (let f = spec.folders.find((x) => x.id === id); f; f = f.parent ? spec.folders.find((x) => x.id === f.parent) : null) out.unshift(f.id);
    return out;
  }
  const ancestors = (spec, id) => pathTo(spec, id).slice(0, -1);
  // megawob-lint: allow util-copy tree distance between two items, not a point distance
  function dist(spec, a, b) {
    const pa = pathTo(spec, a);
    const pb = pathTo(spec, b);
    let k = 0;
    while (k < pa.length && k < pb.length && pa[k] === pb[k]) k++;
    return pa.length - k + pb.length - k;
  }
  const lca = (spec, a, b) => {
    const pa = pathTo(spec, a);
    const pb = pathTo(spec, b);
    let k = 0;
    while (k < pa.length && k < pb.length && pa[k] === pb[k]) k++;
    return pa[k - 1];
  };
  const cmpName = (a, b) => (a.toLowerCase() < b.toLowerCase() ? -1 : a.toLowerCase() > b.toLowerCase() ? 1 : 0);
  function childrenOf(m, spec, folder) {
    const ds = spec.folders.filter((f) => f.parent === folder).map((f) => f.id);
    const fs = spec.files.filter((f) => !isDeleted(m, f.id) && parentOf(m, spec, f.id) === folder).map((f) => f.id);
    const cs = (m.copies || []).filter((id) => !isDeleted(m, id) && parentOf(m, spec, id) === folder);
    return ds.concat(fs, cs);
  }
  // Display order of a folder's items: folders by name, then files (grouped by kind when spec.grouped).
  function display(m, spec, folder) {
    const kids = childrenOf(m, spec, folder);
    const ds = kids.filter(isFolder).sort((a, b) => cmpName(nameOf(m, spec, a), nameOf(m, spec, b)));
    const fs = kids.filter((x) => !isFolder(x));
    const kr = (id) => KIND_ORDER.indexOf(itemOf(spec, id).kind);
    fs.sort((a, b) => (spec.grouped ? kr(a) - kr(b) : 0) || cmpName(nameOf(m, spec, a), nameOf(m, spec, b)));
    return ds.concat(fs);
  }
  function groups(m, spec, folder) {
    const out = [];
    for (const id of display(m, spec, folder)) {
      const kind = isFolder(id) ? 'folder' : itemOf(spec, id).kind;
      const last = out[out.length - 1];
      if (last && last.kind === kind) last.ids.push(id);
      else out.push({ kind, label: (KINDS[kind] || [kind])[0], ids: [id] });
    }
    return out;
  }
  const sameSet = (a, b) => a.length === b.length && a.every((x) => b.includes(x));
  // Error of a set of files against the goal set: the missing files plus EXTRA times the extra ones, per goal file, capped
  // at 1. An extra file counts as much as a missing one or more (it is a wrong file selected / deleted), so taking
  // everything in the folder is no progress over taking nothing, unlike a Jaccard overlap, which rewards it.
  const EXTRA = 2;
  const setError = (got, goal) => {
    const G = new Set(goal);
    const A = new Set(got);
    let hit = 0;
    for (const x of A) if (G.has(x)) hit++;
    return Math.min(1, (G.size - hit + EXTRA * (A.size - hit)) / Math.max(1, G.size));
  };

  // ---------------------------------------------------------------- transitions (pure)

  const calm = (m) => ({ ...m, menu: null });
  function commitIfRenaming(m, spec) {
    return m.renaming ? commitRename(m, spec) : m;
  }
  function navigate(m, spec, folder, noBack) {
    if (!spec.folders.some((f) => f.id === folder)) return m;
    m = commitIfRenaming(m, spec);
    if (folder === m.cwd) return calm(m);
    const expanded = [...new Set(m.expanded.concat(ancestors(spec, folder)))];
    return { ...calm(m), cwd: folder, back: noBack ? m.back : m.back.concat([m.cwd]).slice(-30), expanded, selected: [], anchor: null, viewer: null };
  }
  function goBack(m, spec) {
    if (!m.back.length) return m;
    const to = m.back[m.back.length - 1];
    return { ...navigate({ ...m, back: m.back.slice(0, -1) }, spec, to, true) };
  }
  function goUp(m, spec) {
    const f = spec.folders.find((x) => x.id === m.cwd);
    return f && f.parent ? navigate(m, spec, f.parent) : m;
  }
  function toggleExpand(m, spec, id) {
    const e = m.expanded.includes(id) ? m.expanded.filter((x) => x !== id) : m.expanded.concat([id]);
    return { ...calm(m), expanded: e };
  }
  const selectOnly = (m, id) => ({ ...calm(m), selected: [id], anchor: id });
  function clickItem(m, spec, id, mods = {}) {
    m = commitIfRenaming(calm(m), spec);
    const order = display(m, spec, m.cwd);
    if (!order.includes(id)) return m;
    if (mods.shift) {
      const a = m.anchor && order.includes(m.anchor) ? m.anchor : order[0];
      const i = order.indexOf(a);
      const j = order.indexOf(id);
      const range = order.slice(Math.min(i, j), Math.max(i, j) + 1);
      const sel = mods.ctrl ? [...new Set(m.selected.concat(range))] : range;
      return { ...m, selected: order.filter((x) => sel.includes(x)), anchor: a };
    }
    if (mods.ctrl) {
      const sel = m.selected.includes(id) ? m.selected.filter((x) => x !== id) : m.selected.concat([id]);
      return { ...m, selected: order.filter((x) => sel.includes(x)), anchor: id };
    }
    return selectOnly(m, id);
  }
  const selectAll = (m, spec) => ({ ...calm(m), selected: display(m, spec, m.cwd), anchor: null });
  const clearSelection = (m, spec) => ({ ...commitIfRenaming(calm(m), spec), selected: [], anchor: null });
  function marquee(m, spec, ids, base) {
    const order = display(m, spec, m.cwd);
    const sel = new Set(base || []);
    for (const id of ids) sel.add(id);
    return { ...calm(m), selected: order.filter((x) => sel.has(x)) };
  }
  function openItem(m, spec, id) {
    if (isFolder(id)) return navigate(m, spec, id);
    return { ...calm(m), selected: [id], anchor: id, viewer: id, opened: m.opened.includes(id) ? m.opened : m.opened.concat([id]) };
  }
  const closeViewer = (m) => ({ ...m, viewer: null });
  function openMenu(m, spec, on) {
    m = commitIfRenaming(m, spec);
    if (on !== 'bg' && !m.selected.includes(on)) m = selectOnly(m, on);
    return { ...m, menu: { on } };
  }
  const closeMenu = (m) => calm(m);
  function startRename(m, spec, id) {
    if (isFolder(id) || isDeleted(m, id)) return calm(m);
    return { ...calm(m), selected: [id], anchor: id, renaming: id, draft: nameOf(m, spec, id) };
  }
  const setDraft = (m, text) => ({ ...m, draft: String(text) });
  function commitRename(m, spec) {
    const id = m.renaming;
    if (!id) return m;
    const text = String(m.draft || '').trim();
    const old = nameOf(m, spec, id);
    const clash = childrenOf(m, spec, parentOf(m, spec, id)).some((x) => x !== id && nameOf(m, spec, x).toLowerCase() === text.toLowerCase());
    const n = { ...m, renaming: null, draft: '' };
    if (!text || text === old || clash) return n;
    return { ...n, names: { ...m.names, [id]: text }, undo: m.undo.concat([{ kind: 'rename', ids: [id], prev: { [id]: old } }]), toast: { kind: 'rename', n: 1 } };
  }
  const cancelRename = (m) => ({ ...m, renaming: null, draft: '' });
  const allowedDelete = (spec) => (['delete', 'multidelete'].includes(effective(spec)) ? spec.goal.files : []);
  function deleteItems(m, spec, ids) {
    ids = (ids || m.selected).filter((id) => !isFolder(id) && !isDeleted(m, id));
    m = calm(commitIfRenaming(m, spec));
    if (!ids.length) return m;
    const ok = allowedDelete(spec);
    const wrong = ids.some((id) => !ok.includes(id));
    return { ...m, deleted: m.deleted.concat(ids), selected: m.selected.filter((x) => !ids.includes(x)), anchor: null,
      viewer: ids.includes(m.viewer) ? null : m.viewer, clip: m.clip && { ids: m.clip.ids.filter((x) => !ids.includes(x)) },
      undo: m.undo.concat([{ kind: 'delete', ids, prev: null }]), toast: { kind: 'delete', n: ids.length }, wrongs: m.wrongs + (wrong ? 1 : 0) };
  }
  function cutItems(m, ids) {
    ids = (ids || m.selected).filter((id) => !isFolder(id));
    return { ...calm(m), clip: ids.length ? { ids } : null };
  }
  function moveItems(m, spec, ids, dest) {
    ids = ids.filter((id) => !isFolder(id) && !isDeleted(m, id) && parentOf(m, spec, id) !== dest);
    if (!ids.length || !spec.folders.some((f) => f.id === dest)) return calm(m);
    const prev = {};
    const parent = { ...m.parent };
    for (const id of ids) {
      prev[id] = parentOf(m, spec, id);
      parent[id] = dest;
    }
    return { ...calm(m), parent, selected: m.selected.filter((x) => !ids.includes(x)), anchor: null,
      undo: m.undo.concat([{ kind: 'move', ids, prev }]), toast: { kind: 'move', n: ids.length, dest } };
  }
  // Alt-drag: a copy of each file (same name) in dest; the originals stay.
  function copyItems(m, spec, ids, dest) {
    ids = ids.filter((id) => !isFolder(id) && !isDeleted(m, id) && parentOf(m, spec, id) !== dest);
    if (!ids.length || !spec.folders.some((f) => f.id === dest)) return calm(m);
    const copies = (m.copies || []).slice();
    const parent = { ...m.parent };
    const made = [];
    for (const id of ids) {
      const root = id[0] === 'c' ? id.slice(1).split('_')[0] : id;
      let k = 1;
      while (copies.includes(`c${root}_${k}`)) k++;
      const cid = `c${root}_${k}`;
      copies.push(cid);
      parent[cid] = dest;
      made.push(cid);
    }
    return { ...calm(m), copies, parent, selected: m.selected.filter((x) => !ids.includes(x)), anchor: null,
      undo: m.undo.concat([{ kind: 'copy', ids: made, prev: null }]), toast: { kind: 'copy', n: made.length, dest } };
  }
  function paste(m, spec) {
    if (!m.clip || !m.clip.ids.length) return calm(m);
    const n = moveItems(m, spec, m.clip.ids, m.cwd);
    return { ...n, clip: null };
  }
  function undo(m, spec) {
    if (!m.undo.length) return m;
    const last = m.undo[m.undo.length - 1];
    let n = { ...calm(commitIfRenaming(m, spec)), undo: m.undo.slice(0, -1), toast: null };
    if (last.kind === 'delete') n = { ...n, deleted: n.deleted.filter((x) => !last.ids.includes(x)) };
    else if (last.kind === 'copy') {
      const parent = { ...n.parent };
      for (const id of last.ids) delete parent[id];
      n = { ...n, copies: (n.copies || []).filter((x) => !last.ids.includes(x)), parent, selected: n.selected.filter((x) => !last.ids.includes(x)) };
    }
    else if (last.kind === 'move') {
      const parent = { ...n.parent };
      for (const id of last.ids) {
        if (last.prev[id] === itemOf(spec, id).parent) delete parent[id];
        else parent[id] = last.prev[id];
      }
      n = { ...n, parent };
    } else {
      const names = { ...n.names };
      for (const id of last.ids) {
        if (last.prev[id] === itemOf(spec, id).name) delete names[id];
        else names[id] = last.prev[id];
      }
      n = { ...n, names };
    }
    return n;
  }
  const dismissToast = (m) => ({ ...m, toast: null });
  // Pointer pressed on a tile (no modifiers): what a drag would carry.
  function dragPress(m, spec, id) {
    const n = m.selected.includes(id) ? calm(m) : selectOnly(m, id);
    return { ...n, drag: { ids: n.selected.slice(), active: false, over: null, overMs: 0 } };
  }
  function dragOver(m, over) {
    if (!m.drag) return m;
    const same = JSON.stringify(m.drag.over) === JSON.stringify(over);
    if (same && m.drag.active) return m;
    return { ...m, drag: { ...m.drag, active: true, over, overMs: same ? m.drag.overMs : 0 } };
  }
  function dragEnd(m, spec, dropOn, copy) {
    if (!m.drag) return m;
    const ids = m.drag.ids;
    const n = { ...m, drag: null };
    if (!m.drag.active || !dropOn) return n;
    return copy && effective(spec) === 'copy' ? copyItems(n, spec, ids, dropOn) : moveItems(n, spec, ids, dropOn);
  }

  // ---------------------------------------------------------------- sampling

  const fileIn = (spec, folder) => spec.files.filter((f) => f.parent === folder);
  const foldersAt = (spec, pred) => spec.folders.filter(pred);
  const depthOf = (spec, id) => pathTo(spec, id).length - 1;
  const maxItems = (spec) => spec.cols * (spec.ood ? 5 : 4) - 1;

  function countOk(spec) {
    const empty = { names: {}, parent: {}, deleted: [] };
    for (const f of spec.folders) {
      const n = childrenOf(empty, spec, f.id).length;
      if (n > maxItems(spec)) return false;
      if (spec.view === 'list' && n > 13) return false;
    }
    if (spec.grouped) {
      const rows = groups(empty, spec, spec.cwd0).reduce((a, g) => a + Math.ceil(g.ids.length / spec.cols), 0);
      if (rows > (spec.ood ? 5 : 4)) return false;
    }
    return true;
  }

  // A source folder P and a destination folder D for a move (the exact draws the move scenario always made).
  function pickDest(rng, spec, route) {
    let P;
    let D;
    if (route === 'drag') {
      const ps = spec.folders.filter((f) => spec.folders.some((x) => x.parent === f.id));
      P = rng.pick(ps).id;
      D = rng.pick(spec.folders.filter((x) => x.parent === P)).id;
    } else {
      P = rng.pick(spec.folders).id;
      const vis = new Set([ROOT, ...pathTo(spec, P)]);
      const pool = spec.folders.filter((f) => f.id !== P && dist(spec, f.id, P) >= 2
        && (route === 'cut' || (depthOf(spec, f.id) >= 2 && !ancestors(spec, f.id).every((a) => vis.has(a)))));
      if (!pool.length) return null;
      D = rng.pick(pool).id;
    }
    return { P, D };
  }
  // k files of folder P in display order: a contiguous block ('range', selected with Shift) or a set with gaps
  // ('scatter', Ctrl); route is the selection route selStep() uses.
  function pickSet(rng, spec, P, k, kind) {
    const empty = { names: {}, parent: {}, deleted: [] };
    const order = display(empty, spec, P).filter((x) => !isFolder(x));
    if (order.length < k + 2) return null;
    if (kind === 'range') {
      const a = rng.int(0, order.length - k);
      return { files: order.slice(a, a + k), route: 'shift' };
    }
    for (let t = 0; t < 30; t++) {
      const files = rng.sample(order, k).sort((a, b) => order.indexOf(a) - order.indexOf(b));
      if (order.indexOf(files[k - 1]) - order.indexOf(files[0]) + 1 > k) return { files, route: 'ctrl' };
    }
    return null;
  }

  const sampleSpec = (...args) => lib.sampleSpec(...args);

  // ---------------------------------------------------------------- error

  const wrongDeleted = (m, spec) => m.deleted.filter((id) => !allowedDelete(spec).includes(id));
  const renamedOthers = (m, spec) => Object.keys(m.names).filter((id) => id !== spec.goal.file && m.names[id] !== itemOf(spec, id).name);
  // ambiguous / impossible: nothing may change (navigating is fine).
  const touched = (m) => !!(m.deleted.length || m.undo.length || m.opened.length || Object.keys(m.names).length || (m.copies || []).length
    || Object.keys(m.parent).length);
  // confirm episodes: the last step is irreversible and must not be taken. By scenario: delete / multidelete / select
  // (permanent delete), move / multimove / copy / range (the operation itself), rename (committing the name),
  // navigate (entering the goal folder), open (opening the file).
  const deletes = (e) => e === 'delete' || e === 'multidelete' || e === 'select';
  const moves = (e) => e === 'move' || e === 'multimove' || e === 'copy';
  const renames = (e) => e === 'rename' || e === 'dblrename';
  function irreversibleDone(m, spec) {
    const e = effective(spec);
    const g = spec.goal;
    if (deletes(e)) return m.deleted.length > 0;
    if (moves(e)) return m.undo.some((u) => u.kind === 'move' || u.kind === 'copy');
    if (renames(e)) return nameOf(m, spec, g.file) === g.name;
    if (e === 'navigate') return m.cwd === g.folder;
    return m.opened.includes(g.file);
  }
  // Did the transition prev -> next take the irreversible step? (widgets call ctx.flag('irreversible') when true)
  function irreversible(prev, next, spec) {
    if (!confirmJudge(spec)) return false;
    const e = effective(spec);
    const g = spec.goal;
    const last = next.undo[next.undo.length - 1];
    const pushed = next.undo.length > prev.undo.length;
    if (deletes(e)) return next.deleted.length > prev.deleted.length;
    if (moves(e)) return pushed && (last.kind === 'move' || last.kind === 'copy');
    if (renames(e)) return pushed && last.kind === 'rename';
    if (e === 'navigate') return next.cwd === g.folder && prev.cwd !== g.folder;
    return next.opened.includes(g.file) && !prev.opened.includes(g.file);
  }
  // Prepared = everything done except the irreversible step.
  function preparedError(m, spec) {
    const g = spec.goal;
    const e = effective(spec);
    if (irreversibleDone(m, spec)) return 1;
    if (e === 'navigate') return Math.min(1, dist(spec, m.cwd, itemOf(spec, g.folder).parent) / 3);
    if (e === 'open') {
      const d = dist(spec, m.cwd, parentOf(m, spec, g.file));
      return d ? Math.min(1, 0.5 + d / 6) : m.selected.includes(g.file) ? 0 : 0.5;
    }
    if (renames(e)) {
      if (m.renaming !== g.file) return 1;
      return Math.min(1, lev(m.draft || '', g.name) / Math.max(m.draft.length, g.name.length, 1) * 0.6 + (renamedOthers(m, spec).length ? 0.5 : 0));
    }
    return setError(m.selected, g.files);
  }
  // Selection stage of the operations on a set of files (delete, move, copy, their batch and range forms): until an
  // operation has run, selecting the right files is the only progress there can be, worth up to half the error. A wrong
  // file selected costs twice a missing one (setError), so selecting the whole folder earns nothing.
  const SELECTS = ['delete', 'multidelete', 'copy', 'move', 'multimove'];
  function errorOf(m, spec) {
    const e = resultError(m, spec);
    if (e < 1 || spec.judge || !SELECTS.includes(effective(spec)) || m.undo.some((u) => u.kind !== 'rename')) return e;
    // Files cut or copied to the clipboard stay staged when navigating to the destination clears the selection.
    const staged = Math.min(setError(m.selected, spec.goal.files), m.clip ? setError(m.clip.ids, spec.goal.files) : 1);
    return 0.5 + 0.5 * staged;
  }
  // ================================================================ dispatch: one object per scenario
  //
  // Each scenarios/<scenario>.js registers env.scenario('use-file-manager', {name, ...}); logic.js calls its hooks. range and rangemix
  // grade, solve and plan as the scenario of their operation (effective(spec)), so the hooks marked * are read from
  // V[effective(spec)]:
  //   goal(rng, spec, tree)  the goal and route fields (false: redraw); init(spec, m, mode, rng)  the start model;
  //   instruction(spec, rng)
  //   * result(m, spec[, pen]) the error, solve(spec, m[, model]) a model on the target, plan(m, spec) the next step
  // optional: * silent(next, prev, spec, rng) (a model where the update did not take, or null), * retarget(spec, model, rng)
  //   (a new spec in the same tree, or null); keyboard (flag: the scenario has a keyboard route, so the keyboard input kind).
  // A scenario that behaves like another reuses its hooks: result: rename.result (the scenario files are loaded in order).

  const V = env.scenariosOf('use-file-manager');

  function resultError(m, spec) {
    if (quiet(spec)) return touched(m) ? 1 : 0;
    if (confirmJudge(spec)) return preparedError(m, spec);
    const pen = wrongDeleted(m, spec).length ? 0.5 : 0;
    return V[effective(spec)].result(m, spec, pen);
  }

  function initOf(spec, rng) {
    let m = freshModel(spec);
    const g = spec.goal;
    const mode = spec.startMode;
    if (quiet(spec)) return m; // ambiguous / impossible: the page starts as it should stay
    // confirm episodes and the batch scenarios start with selections only (no operation has run yet)
    const selStart = isRange(spec) || spec.scenario === 'multimove' || spec.scenario === 'multidelete' || (confirmJudge(spec) && !!g.files);
    if (selStart) {
      const folder = g.folder !== undefined ? g.folder : g.from;
      if (spec.cwd0 !== folder) return m;
      const order = display(m, spec, m.cwd).filter((x) => !isFolder(x));
      const half = Math.max(0, Math.min(g.files.length - 1, Math.max(1, Math.floor(g.files.length / 2))));
      if (mode === 'partial') m = { ...m, selected: rng.sample(g.files, half) };
      else if (mode === 'wrong') {
        const non = order.filter((x) => !g.files.includes(x));
        m = { ...m, selected: rng.sample(non, Math.min(non.length, rng.int(1, 2))).concat(rng.sample(g.files, Math.floor(g.files.length / 3))) };
      }
      m.selected = display(m, spec, m.cwd).filter((x) => m.selected.includes(x));
      return m;
    }
    return V[spec.scenario].init(spec, m, mode, rng);
  }

  function solveOf(spec, model) {
    let m = { ...clone(model || freshModel(spec)), menu: null, renaming: null, draft: '', drag: null };
    const g = spec.goal;
    if (quiet(spec)) return m;
    if (confirmJudge(spec)) {
      const e = effective(spec);
      while (m.undo.length && irreversibleDone(m, spec)) m = undo(m, spec);
      if (e === 'navigate') return navigate(m, spec, itemOf(spec, g.folder).parent);
      if (e === 'open') return { ...navigate(m, spec, parentOf(m, spec, g.file)), selected: [g.file], anchor: g.file };
      if (renames(e)) return { ...navigate(m, spec, parentOf(m, spec, g.file)), selected: [g.file], anchor: g.file, renaming: g.file, draft: g.name };
      return { ...navigate(m, spec, g.folder !== undefined ? g.folder : g.from), selected: g.files.slice(), anchor: null };
    }
    while (m.undo.length && (wrongDeleted(m, spec).length || ((spec.scenario === 'rename' || spec.scenario === 'dblrename') && renamedOthers(m, spec).length))) m = undo(m, spec);
    return V[effective(spec)].solve(spec, m, model);
  }

  function rawPlan(m, spec) {
    const g = spec.goal;
    if (m.viewer && !(spec.scenario === 'open' && m.viewer === g.file)) return { click: { viewerClose: true } };
    if (m.renaming && !((spec.scenario === 'rename' || spec.scenario === 'dblrename') && m.renaming === g.file)) return { click: { blank: true } };
    if (needsUndo(m, spec)) return { click: { undo: true } };
    if (confirmJudge(spec) && effective(spec) === 'navigate') return navStep(m, spec, itemOf(spec, g.folder).parent); // stop next to it
    if (confirmJudge(spec) && effective(spec) === 'open') return navStep(m, spec, parentOf(m, spec, g.file)) || { click: { tile: g.file } };
    return V[effective(spec)].plan(m, spec);
  }

  const baseInstruction = (spec, rng) => V[spec.scenario].instruction(spec, rng);

  // A believable failure after an update that lowered the error (see the header). Returns null when none applies.
  function silentOf(next, prev, spec, rng) {
    if (spec.judge || BATCH.includes(spec.scenario)) return null; // one batch: repeating the operation would end the episode
    const v = V[effective(spec)];
    const out = v.silent ? v.silent(next, prev, spec, rng) : null;
    return out && errorOf(out, spec) > 0 ? out : null;
  }

  // A new goal in the same tree (see the header). The page does not change; only spec.goal does.
  function retargetOf(spec, model, rng) {
    if (spec.judge) return null;
    const v = V[effective(spec)];
    return v.retarget ? v.retarget(spec, model, rng) : null;
  }

  // ---------------------------------------------------------------- init (start modes)

  function freshModel(spec) {
    return { cwd: spec.cwd0, back: [], expanded: [ROOT, ...ancestors(spec, spec.cwd0)].filter((v, i, a) => a.indexOf(v) === i),
      selected: [], anchor: null, parent: {}, names: {}, deleted: [], undo: [], clip: null, menu: null, renaming: null, draft: '',
      viewer: null, opened: [], drag: null, toast: null, wrongs: 0 };
  }
  // ---------------------------------------------------------------- solve

  // ---------------------------------------------------------------- plan

  function navStep(m, spec, G) {
    if (m.cwd === G) return null;
    if (spec.route === 'tree') {
      for (const a of ancestors(spec, G)) if (!m.expanded.includes(a)) return { click: { treeToggle: a } };
      return { click: { tree: G } };
    }
    const top = lca(spec, m.cwd, G);
    if (top === m.cwd) {
      const path = pathTo(spec, G);
      return { dblclick: { tile: path[path.indexOf(m.cwd) + 1] } };
    }
    const parent = spec.folders.find((f) => f.id === m.cwd).parent;
    if (spec.upRoute && top === parent) return { click: { up: true } };
    return { click: { crumb: top } };
  }

  // Make the selection in the current folder equal `want` (all inside cwd).
  function selStep(m, spec, want, route) {
    const S = m.selected;
    if (sameSet(S, want)) return null;
    const order = display(m, spec, m.cwd);
    const extras = S.filter((x) => !want.includes(x));
    const missing = want.filter((x) => !S.includes(x));
    if (route === 'marquee' && spec.view === 'icons') {
      const g = groups(m, spec, m.cwd).find((gr) => want.every((x) => gr.ids.includes(x)) && gr.ids.length - want.length <= 1);
      if (g && missing.length > 1) return { drag: [{ marquee: 'from', kind: g.kind }, { marquee: 'to', kind: g.kind }] };
    }
    if (route === 'shift' || route === 'marquee') {
      const idx = want.map((x) => order.indexOf(x)).sort((a, b) => a - b);
      const lo = idx[0];
      const hi = idx[idx.length - 1];
      const span = order.slice(lo, hi + 1);
      if (missing.length > 1 && span.length - want.length <= 1) {
        if (!(S.length === 1 && S[0] === order[lo] && m.anchor === order[lo])) return { click: { tile: order[lo] } };
        return { click: { tile: order[hi] }, modifiers: ['Shift'] };
      }
    }
    if (!S.length) return { click: { tile: missing[0] } };
    if (extras.length && (extras.length > 1 || !S.some((x) => want.includes(x))) && missing.length) return { click: { tile: missing[0] } };
    if (missing.length) return { click: { tile: missing[0] }, modifiers: ['Control'] };
    return { click: { tile: extras[0] }, modifiers: ['Control'] };
  }

  function needsUndo(m, spec) {
    if (!m.undo.length) return false;
    if (wrongDeleted(m, spec).length) return true;
    if ((spec.scenario === 'rename' || spec.scenario === 'dblrename') && renamedOthers(m, spec).length) return true;
    if (effective(spec) === 'copy') {
      const g = spec.goal;
      return spec.files.some((f) => (isDeleted(m, f.id) ? null : parentOf(m, spec, f.id)) !== f.parent)
        || (m.copies || []).some((c) => !g.files.includes(c.slice(1).split('_')[0]) || parentOf(m, spec, c) !== g.dest);
    }
    if (effective(spec) === 'move' || effective(spec) === 'multimove') {
      const g = spec.goal;
      return spec.files.some((f) => {
        const here = isDeleted(m, f.id) ? null : parentOf(m, spec, f.id);
        return g.files.includes(f.id) ? here !== g.dest && here !== g.from : here !== f.parent;
      });
    }
    return false;
  }

  // Range scenarios: click the first file, Shift-click the last (the run), then Ctrl-click single files in or out until
  // the selection equals `want`; falls back to a fresh start when Ctrl-clicking every difference would take longer.
  function rangeSel(m, spec, want) {
    const S = m.selected;
    if (sameSet(S, want)) return null;
    const order = display(m, spec, m.cwd);
    const g = spec.goal;
    const ia = order.indexOf(g.run[0]);
    const ib = order.indexOf(g.run[1]);
    const inRun = ia >= 0 && ib >= 0 ? want.filter((x) => order.indexOf(x) >= ia && order.indexOf(x) <= ib) : [];
    const idx = inRun.map((x) => order.indexOf(x));
    const lo = inRun.length >= 3 ? order[Math.min(...idx)] : null;
    const hi = lo ? order[Math.max(...idx)] : null;
    const span = lo ? order.slice(order.indexOf(lo), order.indexOf(hi) + 1) : [];
    const extras = S.filter((x) => !want.includes(x));
    const missing = want.filter((x) => !S.includes(x));
    if (lo && S.length === 1 && S[0] === lo) return m.anchor === lo ? { click: { tile: hi }, modifiers: ['Shift'] } : { click: { tile: lo } };
    const restart = lo ? 2 + span.filter((x) => !want.includes(x)).length + want.filter((x) => !span.includes(x)).length : want.length;
    if (S.length && extras.length + missing.length <= restart) {
      return missing.length ? { click: { tile: missing[0] }, modifiers: ['Control'] } : { click: { tile: extras[0] }, modifiers: ['Control'] };
    }
    return { click: { tile: lo || want[0] } };
  }
  const chooseSel = (m, spec, want, route) => (isRange(spec) ? rangeSel(m, spec, want) : selStep(m, spec, want, route));

  function planOf(m, spec) {
    if (errorOf(m, spec) <= 0) return null;
    const step = rawPlan(m, spec);
    if (!step) return null;
    // A held drag the step does not continue is released over the title (dropped on nothing).
    if (m.drag && !(step.move || step.wait || step.up)) return { up: { blank: true } };
    // An open context menu that the step does not use is closed first.
    if (m.menu && !(step.click && step.click.menuItem) && !step.rightclick) return { click: { blank: true } };
    return step;
  }

  // ---------------------------------------------------------------- tick: spring-loaded tree folders

  function tickOf(m, spec, dt) {
    const d = m.drag;
    if (!d || !d.active || !d.over || d.over.kind !== 'tree') return m;
    const id = d.over.id;
    if (m.expanded.includes(id) || !spec.folders.some((f) => f.parent === id)) return m;
    const t = d.overMs + dt;
    if (t >= SPRING_MS) return { ...m, expanded: m.expanded.concat([id]), drag: { ...d, overMs: 0 } };
    return { ...m, drag: { ...d, overMs: t } };
  }

  // ---------------------------------------------------------------- instructions

  const IMPERATIVE = /^(Go|Navigate|Open|Browse|Head|Make|Show|Find|Double-click|Preview|Rename|Change|Give|Fix|Delete|Move|Remove|Get|Trash|Clean|Select|Highlight|Pick|Put|Drag|File|Relocate|Bring|Mark|Throw|Erase|Switch|Look)/;
  const say = (rng, spec, core, extra = {}) => env.instruct.say(rng, core, { isplit: spec.isplit, ...extra,
    ...(IMPERATIVE.test(core) ? {} : { registers: { imperative: 0.6, chat: 0.15, ticket: 0.2, terse: 0.05, polite: 0, steps: 0 } }) });
  const pick = (rng, spec, list) => env.instruct.pick(rng, list, spec.isplit);
  const fill = (t, vars) => env.instruct.fill(t, vars);
  function pathText(rng, spec, id) {
    const names = pathTo(spec, id).map((x) => itemOf(spec, x).name);
    const sep = rng.pick([' › ', ' > ', '/', ' / ']);
    const parts = rng.bool(0.5) ? names.slice(1) : names;
    return parts.length ? parts.join(sep) : names[0];
  }

  function instructionOf(spec, rng) {
    if (quiet(spec)) return judgeInstruction(spec, rng);
    const text = baseInstruction(spec, rng);
    if (!confirmJudge(spec)) return text;
    const c = confirmOf(spec);
    const head = text.replace(/[.!?\s]+$/, '');
    return c.select ? `${head}; they are headed for permanent deletion, so check with me ${c.tail}.` : `${head}, but check with me ${c.tail}.`;
  }

  // ---------------------------------------------------------------- judge modes

  const judgeOf = (...args) => lib.judgeOf(...args);
  const confirmOf = (...args) => lib.confirmOf(...args);
  const judgeInstruction = (...args) => lib.judgeInstruction(...args);

  // ---------------------------------------------------------------- hooks: facts, silent, retarget

  const factsOf = (...args) => lib.factsOf(...args);
  const partsOf = (...args) => lib.partsOf(...args);

  env.task({
    name: 'use-file-manager',
    scenarios: ['navigate', 'open', 'rename', 'delete', 'select', 'move', 'multimove', 'multidelete', 'copy', 'dblrename', 'range', 'rangemix'],
    files: ['sampling.js', 'judging.js', 'reporting.js', 'scenarios/navigate.js', 'scenarios/open.js', 'scenarios/rename.js', 'scenarios/dblrename.js',
      'scenarios/delete.js', 'scenarios/multidelete.js', 'scenarios/select.js', 'scenarios/copy.js',
      'scenarios/move.js', 'scenarios/multimove.js', 'scenarios/range.js', 'scenarios/rangemix.js'],
    startModes: ['off', 'partial', 'wrong', 'solved'],
    judgeModes: ['ambiguous', 'impossible', 'confirm'],
    inputs: (spec) => (spec && (V[spec.scenario].keyboard || spec.keys) ? ['pointer', 'keyboard'] : ['pointer']),
    tickMs: 100,

    // Helpers the scenario files share (they read env.taskOf('use-file-manager').lib).
    lib: Object.assign(lib, {
      ancestors, listText, C, childrenOf, chooseSel, copyItems, deleteItems, display, dist, effective, EXTRA, fileIn, fileName,
      fill, foldersAt, groups, isDeleted, isFolder, isRange, itemOf, KINDS, lev, moveItems, nameOf, navigate,
      navStep, parentOf, pathText, pathTo, pick, pickDest, pickSet, renamedOthers, ROOT, sameSet, say, selStep,
      setError, split,
      ROOTS, V, genTree, countOk, judgeOf, confirmOf, TOP, SUB, deletes, moves, renames, isoDate, calm, commitIfRenaming
    }),

    helpers: {
      effective, irreversible, KINDS, ROOT, itemOf, isFolder, nameOf,
      parentOf, pathTo, childrenOf, display, groups, navigate, goBack,
      goUp, toggleExpand, clickItem, selectOnly, selectAll, clearSelection, marquee,
      openItem, closeViewer, openMenu, closeMenu, startRename, setDraft, commitRename,
      cancelRename, deleteItems, cutItems, paste, undo, dragPress, dragOver,
      dragEnd, dismissToast,
    },

    sample: sampleSpec,
    init: initOf,
    error: errorOf,
    tolerance: () => ({ tau: 0, sigma: 0.35, minInitialError: 0.25 }),
    instruction: instructionOf,
    plan: planOf,
    solve: solveOf,
    tick: tickOf,
    facts: factsOf,
    parts: partsOf,
    silent: silentOf,
    retarget: retargetOf,

    ended(m, spec) {
      if (quiet(spec)) return touched(m) ? 'wrong-choice' : null; // ambiguous / impossible: acting at all is the mistake
      if (m.wrongs >= (spec.recoverable ? 2 : 1)) return 'wrong-delete';
      // multimove / multidelete / range / rangemix: one batch, a second operation (an undo entry other than a rename) ends it
      if (BATCH.includes(spec.scenario) && m.undo.filter((u) => u.kind !== 'rename').length > 1) return 'one-batch';
      return null;
    },
  });
})();
