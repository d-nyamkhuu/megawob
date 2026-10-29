/*
 * use-desktop-tools: use small productivity apps (files, terminal, editor, calendar, settings) in a desktop workspace.
 * Small productivity apps inside one desktop-style workspace. MiniWoB counterparts: navigate-tree
 * (tree), terminal, use-text-editor (editor), daily-calendar (calendar); files, move, week and prefs are new
 * real-world scenarios (file operations by double-click / F2 / context menu, spring-loaded drag into folders,
 * moving and resizing events in a week view, a modal Preferences dialog with tabs).
 * Inputs (per spec): tree pointer + wheel (+ keyboard when spec.keys: arrow keys in the tree); move and week
 * pointer + wheel; files, terminal, editor, calendar, prefs pointer + keyboard + wheel.
 *
 * scenarios
 *   tree      navigate-tree: a collapsed folder tree (8-16 nodes, up to 3 levels; ood 18-30 nodes, 4 levels) with
 *             realistic file names; open folders to find the named file (or "the only .pdf in Invoices") and
 *             click it. Lazy folders (spec.lazy) show a spinner for loadMs after expanding (1-2 steps on the
 *             kit clock) before their children appear. Clicking a wrong file opens it: terminal ('wrong-file')
 *             unless spec.recoverable, where a Back button closes it (error 1 until then) and a second wrong
 *             file ends the episode. spec.keys: the tree also takes ArrowUp/Down/Left/Right and Enter.
 *   files     file operations in the same tree: op 'rename' (double-click the name, select + F2, or the
 *             right-click menu's Rename; type the new name, Enter), 'delete' (right-click > Delete, or select +
 *             Delete key) or 'newfolder' (right-click a folder > New folder, type the name, Enter). The context
 *             menu is drawn by the widget (labels vary: "Rename…", "Move to Trash", "New Folder…") with decoy
 *             items. Deleting any other file is wrong: terminal ('wrong-delete') unless spec.recoverable, where
 *             an Undo toast restores it (error penalty until then); a second wrong delete ends the episode.
 *   move      drag a file into a nested, collapsed folder: press on the file, hover each closed folder on the
 *             way until it springs open (spec.springMs on the kit clock; lazy folders then load), release on
 *             the destination ({ down }, { move }, { wait }, { up }).
 *   terminal  terminal: a fake shell over a small virtual filesystem rooted at ~. Delete the described file:
 *             kind 'here' (the file in ~ with a given extension, or without one), 'folder' (the same inside a
 *             named folder) or 'find' (a file named exactly, somewhere below ~). Commands: help, ls, cd, pwd, cat,
 *             rm, clear, whoami, echo, exit (+ undo when recoverable). Removing another file is terminal
 *             ('wrong-delete') unless spec.recoverable: rm then moves to Trash and `undo` restores it; exit ends.
 *   editor    use-text-editor: 2-4 paragraphs of realistic sentences in a rich-text editor (font size menu, B / I /
 *             U, text color, alignment, bulleted / numbered lists, Undo / Redo; Ctrl+B/I/U/Z when spec.keys).
 *             task 'style' (a word, phrase, sentence or everything gets bold / italic / underline / a color hue),
 *             'size' (Small / Large / Huge), 'align' (center / right / justify a paragraph or all), 'list'
 *             (2-3 paragraphs become a bulleted or numbered list), 'revert' (undo the last one or two accidental
 *             changes, described in the instruction). Every other character and paragraph must stay as it is.
 *   calendar  daily-calendar: a 24 h day view (half-hour rows, scrolls: wheel or scrollbar) with existing
 *             events; drag over the slots to draft an event, type its name, press Create. Mode 'at' (a start
 *             time) or 'between' (any free start inside a window). Times in 12 h or 24 h (spec.h24).
 *   week      a week view (5 or 7 days, scrolls) with existing events: move one by dragging its body (day and
 *             time) and/or resize it by dragging its bottom edge (mode 'move' | 'resize' | 'both'); goals are
 *             absolute ("to Thursday at 2:30pm") or relative ("one hour later", "30 minutes longer"). Every
 *             change shows an Undo toast.
 *   prefs     a modal Preferences dialog (opened from the rail gear or the title menu) with 3-4 tabs (ood 5-6)
 *             of settings from env.content.SETTINGS (switches, checkboxes, segmented controls, dropdowns,
 *             number fields with steppers, negated labels). Change 1-2 settings (ood 3-4), possibly on different
 *             tabs, and save (Save is disabled until something changed; Cancel / x discards the draft).
 *
 * start modes: off, partial, wrong, solved, scene (all scenarios). scene (previews / evals, not the training mix) is
 *   the reference screen's unsolved mid-task state: tree / files the target's whole ancestor chain open and the target
 *   row on the first screen, nothing clicked (files: a rename / delete target selected), 0-2 extra open decoy
 *   folders; terminal the session already in the target's folder after a startup transcript in history (optional
 *   pwd, cd, optional pwd, ls; ls -l / ls -la with the meta trait), the file listed; editor the text to format
 *   selected (a revert task keeps its accidents); calendar the new-event form open on an unnamed one-hour draft at
 *   the top of the view (selectors show it); week the grid scrolled to the target event; prefs the dialog open on
 *   the first goal's tab; move is the plain start (the file visible). Other modes' draws are untouched.
 *   partial: ancestors half open / edit begun / cwd
 *   reached / half the formatting done / event drafted / one setting done. wrong: a wrong file open (tree,
 *   recoverable) or decoy folders open, a wrong delete with Undo (files, recoverable) or a wrong folder created,
 *   the file dropped in a wrong folder (move), a wrong rm (terminal, recoverable) or a wrong command typed, a wrong
 *   formatting change on the Undo stack (editor), an event at a wrong time (calendar), a wrong event moved with
 *   its Undo toast (week), a wrong setting saved (prefs). The oracle recovers from all of them.
 *
 * levels (opts.level easy | medium; normal is the task as above): tree / files 6-9 / 7-12 nodes, depth 1 / 2, no lazy
 * folders on easy, files only rename / delete on easy; move 8-12 nodes (easy); terminal easy: a file in ~ among 3-4 + 2-3 per folder;
 * editor easy: 2 paragraphs, word styles and alignment; medium: no revert, words and phrases; calendar 2-3 / 3-4 events (easy: a
 * start time); week 5 days, 1-2 events a day (easy: moves only; medium: moves and resizes); prefs 2 / 3 tabs of at most 3 settings,
 * one setting to change (easy, medium).
 * Partly done starts (spec.lead, set by sample() for easy and for some medium episodes, never with a judge mode): an 'off' start is then
 * built as the scenario's 'partial' state (initOf); medium chance 0.4 per episode (editor 0.7, prefs 0.5). The week partial start never
 * leaves the target on top of another event.
 *
 * judge modes (judgeModes ambiguous, impossible, confirm; spec.judge = { mode, message, cands, others, what, templates, vars }): scenarios tree,
 * files, move, terminal, prefs, calendar, editor and week (a request for another scenario is served by one of these; confirm: not
 * week: it has no irreversible control, every change shows an Undo toast). Their error is 0 until taskDef.helpers.changed(model, spec) (a file clicked / deleted / renamed, a move, an rm, an event moved / resized, saved
 * settings), then 1 and the episode ends (ended()):
 *   ambiguous   tree / files: two files with the same name in different folders; move: two folders with the same name; terminal:
 *               two files with the same name in different directories; prefs: two settings with the same label on different
 *               tabs; week: two events with one name on different days (cands: the day names); editor: a word that occurs twice (cands: each
 *               place's paragraph number and the words around it); the reply must ask (status ask) with one option per place
 *               (cands: the folder / directory / tab / day names; others: the other folders / directories / tabs / days, never offered)
 *   impossible  a file, folder or setting that is not there ("Delete the file quarterly_forecast.xlsx"); week: an event that is not there,
 *               or a move to Saturday / Sunday in the 5-day view; the name is drawn from the task's content per seed (file names from the
 *               content generator, folder / event / setting banks); the reply has status impossible and what names it (spec.judge.what:
 *               the file / folder / event / setting / word, the time of a calendar event that runs past midnight, the weekend day)
 *   confirm     files: the op becomes a delete of a nested file; "... but check with me before you delete it / open it / run
 *               the rm / save"; the error counts the final press as done (files: the file selected or its menu open; tree: all
 *               its folders open; move: every folder on the way to the destination open (the file not yet dropped, "... before you
 *               move it"); terminal: `rm <file>` typed, cwd right, the folder listed; prefs: the draft right, unsaved);
 *               the widget flags 'irreversible' when changed() turns true
 *
 * round 2 hooks (pure; none changes sample() or what an episode draws, so episodes with the new knobs off are unchanged):
 *   facts(model, spec)   2-4 { label, value, aliases?, labels? } (aliases: other spellings of the value, labels: other names of the fact) as the page shows them once the work is done: tree 'File path', 'Folder',
 *                        'Open folders'; files 'New path' / 'Folder path', 'Items in <folder>', 'Files in the tree'; move 'File path',
 *                        'Items in <dest>', 'Files in <dest>'; terminal 'Current directory', 'Files in <dir>', 'Files removed';
 *                        editor 'Document status' (Edited / Saved), 'Paragraphs', and a count of list items / aligned paragraphs /
 *                        formatted words; calendar 'Event time' (as the event shows it), 'Duration', 'Events in the agenda'; week
 *                        'Event time', 'Day', 'Events on <day>'; prefs a goal setting and one it did not touch as the dialog
 *                        shows them (On / Off, value + unit), 'Tabs in Preferences'. [] in judge episodes.
 *   silent(next, prev, spec, rng)  after a step that lowered the error, one failure the page shows: tree the click or folder opening
 *                        that did not register; files a rename cut off at ~60% (typed text or committed name), a delete that did
 *                        not happen, a new folder left as "New folder"; move the drop one level too high; terminal an rm that
 *                        did not remove (or a cd that did not move); editor the formatting missing on the last word (or one
 *                        paragraph); calendar the saved name cut off / start rounded down to the hour / length clamped to an
 *                        hour; week a moved event rounded to the hour, a day off, a length rounded up; prefs a saved setting
 *                        that did not save (or a number rounded to 10). null when none applies (no judge episodes); repeating
 *                        the step fixes it.
 *   retarget(spec, model, rng)  another goal of the same kind in the same scene: tree another file, files another file / folder
 *                        and name, move another file, terminal another file (same kind of request), editor another word / phrase /
 *                        sentence / paragraph (style, size) or paragraph range (align, list), calendar another name, length and free
 *                        time (or window), week another event with a free goal of the same mode, prefs other settings. null for
 *                        revert, judge episodes, and when a click / delete / rm that is not recoverable already happened.
 *
 * Widget traits (opts.traits, all opt-in; without one every spec, model, plan and rng draw is as before):
 *   terminal  meta: true                spec.meta { path: { size, mtime } } for every file and folder ('' = ~, '..'),
 *                                       seeded from rng.fork('meta'); `ls -l` / `ls -la` (a, A, l in any flags) then
 *                                       print real long listings (total, mode, links, user user, size, mtime, name,
 *                                       . and .. with -a); without it those flags are accepted and ignored
 *   calendar  selectors: true | 'only'  spec.selectors, spec.entry ('form' | 'drag'): a Start time / Duration form
 *                                       path next to dragging (true: seeded half-and-half, 'only': always the form).
 *                                       The widget shows the two selectors (also with no draft) and uses
 *                                       taskDef.helpers.calendarSelect(model, 'start' | 'dur', value) and
 *                                       calendarDd(model, which) (model.dd = the open list); durations are
 *                                       taskDef.helpers.CAL_DURS half-hours with durLabel(n)
 *             dayRange: [from, to]      hours shown (>= 8 wide): spec.range = [lo, hi) slots; events, start and window
 *                                       lie inside, the plan never scrolls (the widget shows exactly those rows, no
 *                                       scrollbar), top0 = lo
 *             startHour: h              spec.top0 = 2h (initial scroll; dayRange wins)
 *   editor    tools: [names]            the toolbar buttons the design has (plan target names); goals are limited to
 *                                       what they can do (spec.tools): no revert without 'undo', no alignment without
 *                                       an align-* button plus 'undo' or 'align-left', and so on
 *
 * spec   { scenario, startMode, isplit, csplit, ood, stepMs, ... }
 *   tree/files/move  nodes: [{ id, name, dir, parent, depth }] (preorder), lazy: [folder ids], loadMs,
 *             tree: target, goal ('name' | 'where'), keys, recoverable
 *             files: op, target (file id; newfolder: the parent folder id), goalName, route ('dblclick' | 'f2' |
 *               'menu' | 'key'), labels { rename, delete, newfolder }, decoys [labels], recoverable
 *             move: file, dest, springMs
 *   terminal  kind, dirs, files, target (path), ext, dir, login, recoverable, meta (trait)
 *   editor    paras [strings], doc (paras joined by '\n'), task, scope, target { start, end } (char tasks),
 *             prange [p0, p1] (paragraph tasks), style, color, size, align, list, ops (revert: accidental ops),
 *             base / goal / from snapshots { runs, pf }, norm { c, p, k }, keys, tools (trait)
 *   calendar  mode, name, dur, start | win { lo, hi }, events [{ start, dur, name, tone }], durText, top0, day,
 *             h24, route ('wheel' | 'thumb'), range, selectors, entry (traits)
 *   week      days (5 | 7), dayNames, dates, events [{ id, day, start, dur, name, tone }], target, mode, goal
 *             { day, start, dur }, rel, top0, h24, route
 *   prefs     tabs [{ id, label, ids }], settings { id: { label, tab, kind, ctl, options, min, max, step, unit,
 *             negated, desc } }, init { id: value }, goal { id: value }, opener ('gear' | 'menu'), tabStyle,
 *             numRoute, saveLabel, apply
 * model
 *   tree      { open, loaded, loading { id: t0 }, clicks, wrong, sel, view }
 *   files     { open, loaded, loading, sel, menu (node id | null), edit null | { id, text, isNew }, names { id },
 *               deleted [ids], created [{ id, parent, name }], nextId, wrong, undo null | { id } | { created },
 *               view }
 *   move      { open, loaded, loading, parents { id: parent }, drag null | { id, over, since }, sel, view }
 *             (view = { first, last }: fully visible row indices of the tree, mirrored by the widget)
 *   terminal  { cwd, dirs, files, history [{ cwd, cmd, out }], line, seen, removed, trash, wrong, cleared, exited }
 *   editor    { runs [{ n, b, i, u, c, s }], pf [{ a, l }], sel { start, end }, pop (null | 'color' | 'size'),
 *               past [snapshots], future [snapshots] }
 *   calendar  { view { top, bottom, px }, event null | { start, dur, name, saved }, form, dd (selectors only) }
 *   week      { view { top, bottom, px }, evs { id: { day, start, dur } }, last null | { id, prev } }
 *   prefs     { dlg, tab, draft, saved, dd (open dropdown id | null), menu (title menu open), view }
 * error  tau = 0 everywhere
 *   tree      0 after clicking the target; 1 while a wrong file is open; else 0.5 + 0.5 * (unopened share of the
 *             target's ancestors; a loading folder counts half); 1 for a root-level target
 *   files     rename: 0.2 nav + 0.3 draft name + 0.5 committed name (name error 0.5 + 0.5 * normalized edit
 *             distance), delete: 0.6 + 0.4 nav - 0.1 (menu open on it), newfolder: like rename for the new
 *             folder in the target folder; + 0.5 per wrongly deleted item, 0.25 per other rename or extra folder
 *   move      0 when the file is in dest; else 1 - 0.4 * (open share of dest's ancestors) - 0.1 (dragging it)
 *   terminal  0 once the target is removed; 1 while a wrong file is removed, or after exit; else
 *             1 - 1/3 [cwd is the target's folder] - 1/3 [seen]
 *   editor    (characters whose style differs from the goal) / norm.c + (paragraph attributes that differ) /
 *             norm.p, averaged over the components the task changes; style and size tasks with nothing
 *             formatted yet: that x (1 - 0.5 x the Jaccard of the selection and the target text)
 *   calendar  mean of start, duration, name and saved subgoal errors (as MiniWoB's grader, graded)
 *   week      target: day / start / duration errors averaged over the changed components; + 0.3 per other
 *             event moved
 *   prefs     sum over settings of 0.4 [draft wrong] + 0.6 [saved wrong] / number of target settings (capped)
 *
 * plan targets (the widget's locate() maps them to viewport px)
 *   { node: id }                   a tree row (folder or file; its name label), visible
 *   { pane: 'tree' }               the tree pane (wheel target; drop on empty space = root)
 *   { back: true }                 the preview's Back button (tree, recoverable)
 *   { menu: action }               a context-menu item: 'rename' | 'delete' | 'newfolder'
 *   { edit: id }                   the inline name field of a row being renamed / created
 *   { toast: 'undo' }              the Undo button of the toast (files, week)
 *   { prompt: true }               the terminal's command line
 *   { char: i, edge }              editor text (as highlight)
 *   { tool: name }                 editor toolbar: 'bold' | 'italic' | 'underline' | 'color' | 'size' |
 *                                  'align-left' | 'align-center' | 'align-right' | 'align-justify' | 'bullet' |
 *                                  'number' | 'undo' | 'redo'
 *   { swatch: key }, { size: v }   an option of the open color / size menu
 *   { thumb: 'scroll' }, { scroll: top }   the day / week view's scrollbar thumb and where to release it
 *   { pane: 'day' | 'week' }       the scrolling time grid (wheel target)
 *   { slot: i }                    day view: the middle of half-hour row i
 *   { field: 'name' }, { form: 'create' | 'cancel' }   day view form
 *   { select: 'start' | 'dur' }    selectors: the Start time / Duration control (click opens / closes its list)
 *   { option: ['start' | 'dur', v] }   selectors: an option of the open list (slot index / half-hours); the widget
 *                                  scrolls a long list to it in locate()
 *   { evgrab: id }                 week: the first row of an event's body; { cell: [day, start] } where to
 *                                  release it; { evhandle: id } its bottom edge; { edge: [day, end] } where to
 *                                  release the edge
 *   { open: 'gear' | 'menu' | 'item' }   prefs opener: rail gear, title menu, its Preferences item
 *   { tab: id }, { setting: id }, { option: [id, value] }, { stepper: [id, +1 | -1] }, { footer: 'save' |
 *   'apply' | 'cancel' }, { pane: 'prefs' }
 * plan steps: click, dblclick, rightclick, key ('F2', 'Delete', 'Enter', 'Escape', arrows, Control+b/i/u/z),
 * type, drag, down / move / wait / up (move), wheel (tree, day / week grid, prefs pane), wait (lazy loading).
 *
 * Helpers (widget API, env.taskDef.helpers):
 *   changed(model, spec): whether an irreversible change happened.
 *   live(model, spec): live filesystem nodes and indices.
 *   rows(model, spec): visible Explorer rows.
 *   isOpen(model, id): whether a folder is open.
 *   isLoaded(model, spec, id): whether a folder has loaded.
 *   toggleFolder(model, spec, id, now): open or close a folder.
 *   timeLabel(i, h24): format a half-hour slot.
 *   SLOTS: half-hour slots in a day.
 *   treeClickFile(model, spec, id): open a file.
 *   treeBack(model, spec): return from a file preview.
 *   treeKey(model, spec, key, now): Explorer keyboard action.
 *   fClick(model, spec, id, now): select a file or toggle a folder.
 *   fDbl(model, spec, id): start renaming a file.
 *   fMenu(model, spec, id): open a context menu.
 *   fPick(model, spec, action, now): choose a context action.
 *   fKey(model, spec, key, now): use-file-manager keyboard action.
 *   fEditText(model, text): update the inline name.
 *   fCommit(model): commit the inline name.
 *   fCancel(model): cancel an inline edit.
 *   fUndo(model): undo a delete.
 *   mvDown(model, spec, id, now): start dragging a file.
 *   mvOver(model, over, now): update the folder under a drag.
 *   mvUp(model, spec, over): drop a file.
 *   run(model, spec, line): execute a shell command.
 *   edApply(model, spec, tool, value): apply a formatting tool.
 *   edUndo(model): undo formatting.
 *   edRedo(model): redo formatting.
 *   expand(runs, n): expand character styles.
 *   SWATCHES: text color table.
 *   HUES: text color hue names.
 *   SIZES: font size keys.
 *   SIZE_LABEL: font size labels.
 *   calendarDrag(model, a, b): draft an event over slots.
 *   calendarCreate(model): save a draft event.
 *   calendarCancel(model): discard a draft event.
 *   calendarSelect(model, which, value): set a draft time selector.
 *   calendarDd(model, which): toggle a time selector menu.
 *   durLabel(n): format a duration.
 *   CAL_DURS: duration choices in half-hours.
 *   wkMove(model, id, day, start): move an event.
 *   wkResize(model, id, end): resize an event.
 *   wkUndo(model): undo an event change.
 *   pfOpen(model): open Preferences.
 *   pfClose(model): discard and close Preferences.
 *   pfTab(model, id): select a Preferences tab.
 *   pfSet(model, spec, id, value): set a draft preference.
 *   pfStep(model, spec, id, delta): step a numeric preference.
 *   pfDd(model, id): toggle a preference dropdown.
 *   pfSave(model): save and close Preferences.
 *   pfApply(model): save without closing Preferences.
 *   pfDirty(model): whether Preferences has unsaved changes.
 * Self-test: selftest.js (loaded only by the checker and node tests).
 *
 * Deviations from MiniWoB: realistic names; lazy folders; recoverable wrong choices; editor documents are
 * multi-paragraph and graded per character / paragraph; the calendar grader is graded (subgoals) rather than
 * binary.
 *
 * Files (files: [...] below, loaded in order after this one): explorer.js (the folder tree of tree, files and move),
 * timegrid.js (the time grid of calendar and week), then scenarios/<scenario>.js, one env.scenario('use-desktop-tools', {...}) object
 * per scenario. This file holds the shared helpers (lib) and dispatches to the objects; the hooks an object has are
 * listed above the dispatch section.
 */
(function () {
  'use strict';

  const C = env.content;
  const I = env.instruct;

  const { clone, sameJson, lev } = env.util;
  const LV = (opts) => opts.level === 'easy' || opts.level === 'medium'; // the kit passes 'normal' for the unchanged task

  const levRatio = (a, b) => Math.min(1, lev(a, b) / Math.max(1, a.length, b.length));

  function say(rng, spec, core, terse, steps) {
    return I.say(rng, core, { isplit: spec.isplit, terse, steps });
  }
  const tpl = (rng, spec, list, vars) => I.fill(I.pick(rng, list, spec.isplit), vars);

  function recoverable(rng, opts) {
    const r = rng.bool(0.5);
    return opts.recover === null || opts.recover === undefined ? r : !!opts.recover;
  }

  // A realistic file name (env.content.fileName) whose own hash puts it in the requested content split.
  function fileNameIn(rng, split, ext) {
    let n = '';
    for (let k = 0; k < 60; k++) {
      n = C.fileName(rng, ext, { csplit: split });
      if (n.includes('/')) continue;
      if (!split || split === 'all' || C.isHeldout(n) === (split === 'heldout')) return n;
    }
    return n;
  }
  const extOfName = (n) => {
    const m = /\.(tar\.gz|[A-Za-z0-9]+)$/.exec(n);
    return m ? m[1].toLowerCase() : '';
  };
  const stemOf = (n) => {
    const e = extOfName(n);
    return e ? n.slice(0, n.length - e.length - 1) : n;
  };

  // ---------------------------------------------------------------- judge helpers (absent names, other names)

  // fallbacks only (see freshFile / freshPick)
  const ABSENT_FILES = ['quarterly_forecast.xlsx', 'team_photo_final.png', 'meeting_minutes.docx', 'invoice_0099.pdf', 'roadmap_v3.pptx', 'budget_2025.csv'];
  const noneOf = (pool, taken) => { const free = pool.filter((x) => !taken.has(x.toLowerCase())); return free.length ? free[0] : `${pool[0]} (2)`; };
  // A name the page does not have: a random pick of the task's own content (file names from the content generator,
  // the folder / event / setting banks), so no fixed list of phantom names exists.
  const freshPick = (jr, pool, taken) => { const free = pool.filter((x) => !taken.has(x.toLowerCase())); return free.length ? jr.pick(free) : noneOf(pool, taken); };
  function freshFile(jr, spec, taken, make) {
    for (let k = 0; k < 30; k++) {
      const n = make(jr.fork(`absent${k}`), spec.csplit);
      if (n && !taken.has(n.toLowerCase())) return n;
    }
    return noneOf(ABSENT_FILES, taken);
  }
  // others: the other same-kind names on the page, as one-name entries, minus anything a candidate (or its ancestors) is called.
  function othersOf(names, ...skip) {
    const drop = new Set(skip.flat().filter(Boolean).map((x) => String(x).toLowerCase()));
    return [...new Set(names.filter(Boolean))].filter((n) => !drop.has(n.toLowerCase())).map((n) => [n]);
  }

  // silent: a typed name cut off at ~60%.
  const cut = (t) => String(t).slice(0, Math.max(8, Math.floor(String(t).length * 0.6))).trimEnd();

  // ================================================================ dispatch: one object per scenario
  //
  // Each scenarios/<scenario>.js registers env.scenario('use-desktop-tools', { name, ... }); explorer.js (tree, files, move) and
  // timegrid.js (calendar, week) hold what several scenarios share and are loaded first. A scenario object has
  //   sample(rng, opts), init(spec, rng), error(model, spec), plan(model, spec), solve(spec, model) (model is a copy),
  //   instruction(spec, rng), changed(model, spec) (something irreversible happened; judge episodes),
  //   ambiguous(jr, spec), impossible(jr, spec) (judge records; scenarios listed in JUDGE_VARIANTS),
  //   facts(model, spec, add), silent(next, prev, spec, rng, cands) (pushes candidate corruptions),
  //   retarget(s, spec, model, rng, crng) (edits the copy s; false = none), simulate(m, spec, step, now, t) (self-test simulator)
  // and optionally inputs(spec), tick(model, spec, dtMs, nowMs), ended(model, spec), prepared(model, spec, e)
  // (confirm episodes: the error with the final press counted as done), confirmVerb, prepareConfirm(jr, spec)
  // (false: the sample cannot be a confirm episode), sigma (tolerance, default 0.5), lead (medium level: chance of
  // a partly done start, default 0.4) and check() (self-test spot checks).

  const V = env.scenariosOf('use-desktop-tools');

  // Levels: spec.lead (easy always, medium for some episodes) starts an 'off' episode in the scenario's 'partial' state.
  const initOf = (spec, rng) => V[spec.scenario].init(spec.lead && spec.startMode === 'off' ? { ...spec, startMode: 'partial' } : spec, rng);
  const errorOf = (model, spec) => {
    const j = spec.judge;
    if (!j) return V[spec.scenario].error(model, spec);
    if (j.mode !== 'confirm') return changed(model, spec) ? 1 : 0; // the page stays as it is
    return preparedError(model, spec);
  };
  const planOf = (model, spec) => V[spec.scenario].plan(model, spec);
  const solveOf = (spec, model) => V[spec.scenario].solve(spec, clone(model));
  const instructionOf = (spec, rng) => V[spec.scenario].instruction(spec, rng);

  function sampleOf(rng, opts, scenarios) {
    const list = opts.scenarios && opts.scenarios.length ? opts.scenarios : scenarios;
    let scenario = opts.scenario || rng.pick(list);
    const jm = JUDGE_MODES.includes(opts.judge) ? opts.judge : null;
    // Judge modes exist for a few scenarios; another one asked for is served by one of them (the next one when a
    // sample has no way to build the mode).
    const own = jm && JUDGE_SCENARIOS[jm].includes(scenario);
    const others = jm ? rng.fork('judge-variant').shuffle(JUDGE_SCENARIOS[jm].filter((v) => v !== scenario)) : [];
    // the asked scenario first (a few resamples when it cannot build the mode), then the other ones; widgets of a single scenario never get another
    const tries = jm ? (own ? [scenario, scenario, scenario, scenario, scenario, scenario] : []).concat(own ? [] : others) : [scenario];
    let out;
    for (let k = 0; k < tries.length; k++) {
      scenario = tries[k];
      const r = k === 0 ? rng : rng.fork(`judge-retry/${k}`);
      const spec = V[scenario].sample(r, opts);
      out = { scenario, startMode: opts.startMode || 'off', isplit: opts.isplit || 'train', csplit: opts.csplit || 'train',
        ood: !!opts.ood, stepMs: opts.stepMs || 1000, ...spec };
      if (LV(opts) && !jm) {
        const lr = rng.fork('lead');
        if (opts.level === 'easy' || lr.bool(V[scenario].lead ?? 0.4)) out.lead = true;
      }
      if (!jm) break;
      const j = judgeOf(rng.fork('judge'), out, jm);
      if (j) { out.judge = j; break; }
    }
    return out;
  }

  // ---------------------------------------------------------------- judge modes

  const JUDGE_MODES = ['ambiguous', 'impossible', 'confirm'];
  // week has no confirm: it has no irreversible control (every change shows an Undo toast).
  const JUDGE_SCENARIOS = { ambiguous: ['tree', 'files', 'move', 'terminal', 'prefs', 'calendar', 'editor', 'week'],
    impossible: ['tree', 'files', 'move', 'terminal', 'prefs', 'calendar', 'editor', 'week'], confirm: ['tree', 'files', 'move', 'terminal', 'prefs', 'calendar', 'editor'] };

  // Has anything irreversible been done (a file clicked / deleted / renamed / created, a file moved, an rm run, settings saved)?
  const changed = (m, spec) => V[spec.scenario].changed(m, spec);

  // confirm episodes: the error with the final press counted as done.
  function preparedError(m, spec) {
    const v = V[spec.scenario];
    const e = v.error(m, spec);
    return v.prepared ? v.prepared(m, spec, e) : e;
  }

  const confirmVerb = (spec) => V[spec.scenario].confirmVerb;

  function judgeOf(jr, spec, mode) {
    if (mode === 'confirm') {
      if (spec.startMode === 'scene' || spec.startMode === 'partial') spec.startMode = 'off';
      const v = V[spec.scenario];
      if (v.prepareConfirm && v.prepareConfirm(jr, spec) === false) return undefined; // resampled
      return { mode, message: `Everything is ready. Should I go ahead and ${confirmVerb(spec)}?` };
    }
    spec.startMode = 'off'; // the page is left alone
    return V[spec.scenario][mode](jr, spec);
  }

  // ---------------------------------------------------------------- round 2 hooks: facts, silent, retarget

  function factsOf(model, spec) {
    if (spec.judge) return [];
    const out = [];
    // aliases: other spellings of the value; labels: other names of the fact.
    const add = (label, value, aliases, labels) => out.push({ label, value: String(value),
      ...(aliases && aliases.length ? { aliases } : {}), ...(labels && labels.length ? { labels } : {}) });
    V[spec.scenario].facts(model, spec, add);
    return out.slice(0, 4);
  }

  // silent: one believable failure right after a step that lowered the error (see the header).
  function silentOf(next, prev, spec, rng) {
    if (spec.judge || !next || !prev) return null;
    const cands = [];
    V[spec.scenario].silent(next, prev, spec, rng, cands);
    for (const fn of rng.shuffle(cands)) {
      const out = clone(next);
      fn(out);
      if (!sameJson(out, next) && errorOf(out, spec) > 0) return out;
    }
    return null;
  }

  // retarget: a new goal of the same kind in the same scene (see the header).
  function retargetOf(spec, model, rng) {
    if (spec.judge) return null;
    const s = clone(spec);
    const crng = rng.fork('content');
    // Work the plan cannot take back (a click, delete or rm that is not recoverable) would stay a wrong choice.
    if (!spec.recoverable && ((model.clicks || []).length || (model.deleted || []).length || (model.removed || []).length)) return null;
    if (!V[spec.scenario].retarget(s, spec, model, rng, crng)) return null;
    return errorOf(model, s) > 0 && Number.isFinite(errorOf(initOf(spec, new env.Rng(7)), s)) ? s : null;
  }

  function tick(model, spec, dtMs, nowMs) {
    const v = V[spec.scenario];
    return v.tick ? v.tick(model, spec, dtMs, nowMs) : model;
  }

  env.task({
    name: 'use-desktop-tools',
    reply: true, // judge and report endings are structured replies under the default reply=auto (kit/runtime/reply.js)
    scenarios: ['tree', 'files', 'move', 'terminal', 'editor', 'calendar', 'week', 'prefs'],
    files: ['explorer.js', 'timegrid.js', 'scenarios/tree.js', 'scenarios/files.js', 'scenarios/move.js',
      'scenarios/terminal.js', 'scenarios/editor.js', 'scenarios/calendar.js', 'scenarios/week.js', 'scenarios/prefs.js'],
    startModes: ['off', 'partial', 'wrong', 'solved', 'scene'],
    inputs(spec) {
      const v = V[spec.scenario];
      return v.inputs ? v.inputs(spec) : ['pointer', 'keyboard', 'wheel'];
    },
    tickMs: 50,
    judgeModes: ['ambiguous', 'impossible', 'confirm'],

    // Helpers the task's files share (they read env.taskOf('use-desktop-tools').lib).
    lib: {
      C, cut, extOfName, fileNameIn, freshFile, freshPick, I, lev, levRatio, LV, othersOf, recoverable, say, stemOf,
      tpl, JUDGE_SCENARIOS,
    },

    // Widget API; shared helpers and scenario files add their own.
    helpers: { changed },

    sample(rng, opts) {
      return sampleOf(rng, opts, this.scenarios);
    },
    init: initOf,
    error: errorOf,
    tolerance(spec) {
      return { tau: 0, sigma: V[spec.scenario].sigma ?? 0.5, minInitialError: 0.25 };
    },
    instruction(spec, rng) {
      const j = spec.judge;
      if (j && j.mode !== 'confirm') return say(rng, spec, tpl(rng, spec, j.templates, j.vars), j.terse);
      const text = instructionOf(spec, rng);
      return j ? `${text.replace(/[.!?\s]+$/, '')}, but check with me before you ${confirmVerb(spec)}.` : text;
    },
    plan: planOf,
    solve: solveOf,
    facts: factsOf,
    silent: silentOf,
    retarget: retargetOf,
    tick,

    ended(model, spec) {
      if (spec.judge && spec.judge.mode !== 'confirm' && changed(model, spec)) return 'wrong-choice';
      const v = V[spec.scenario];
      return v.ended ? v.ended(model, spec) : null;
    },
  });
})();
