/*
 * templates / use-desktop-tools / workspace: the shared widget code of the design-use-desktop-tools-* sites (taken from the base widget
 * use-desktop-tools/workspace as those sites had it). A site's widgets/use-desktop-tools.js is only its design:
 *
 *   env.widget({ task: 'use-desktop-tools', site, name: 'design', split, scenarios: ['editor'], traits?: {...},
 *              template: 'use-desktop-tools/workspace', design: { footerReadout: false, parts: { edStatus: (base, S) => (E) => ... } } });
 *
 * Scenarios: tree (an Explorer pane and a file preview), terminal (a shell pane), editor (a toolbar over a page of text,
 * one span per character), calendar (a 24 h day grid in a scroller with a custom scrollbar, and a side form that drafts
 * an event). The base widget's files / move / week / prefs scenarios have no design-* site and are not in the template.
 * The window is a desktop-style "Workspace" app window (title bar, an activity rail, the tool's pane) sized from ctx.size
 * and placed at a sampled position (frame 'workspace'), or a bare window (frame 'plain') for designs that draw their own
 * frame in site.css / site.js.
 *
 * The token defaults start from the L1 medoid design-use-desktop-tools-editor-04. Scenario presets anchor design: {} to
 * design-use-desktop-tools-editor-03, design-use-desktop-tools-calendar-10, design-use-desktop-tools-terminal-11 and design-use-desktop-tools-tree-10 exactly.
 * The shared frame, CSS, icons, geometry and input wiring stay together; each scenario has its own small builder.
 * Lineages L1 (workspace frame), L2 (bare windows) and L3 (file dialogs) use the frame token and the same parts.
 * Presets include the common editor font/readout choices (8/12 sampled font, 11/12 no footer readout), calendar
 * inline form / Create event choices (10/12, 11/12), and terminal frame. Calendar namePlaceholder null derives
 * the usual empty placeholder for an inline form (7/12 sites), or Event name for the event panel; that panel
 * follows m.form rather than formAlways. The editor preset also supplies editor-03's list icons, Words label and
 * Paragraph size label; tree supplies tree-10's Project Files heading and welcome preview; calendar supplies
 * calendar-10's day grid, text arrows and selected-event details panel. Designs override each independently.
 * Tool parts and builders live in _workspace-{tree,terminal,editor,calendar}.js; _styles.js and _shared.js
 * hold the styles and drawing helpers shared with reference.js.
 * Widget CSS uses at-* classes and the site's --panel, --line, --accent, --muted, --fg, --bg; a site restyles it
 * in site.css (loaded before the template's CSS unless siteCssLast).
 *
 * design tokens (defaults in TOKENS):
 *   css, siteCssLast    extra CSS appended to the template's; true: move the site's site.css link behind it (so it wins)
 *   frame, frameTitle   'workspace' (title bar with a title, rail, gear) | 'plain' (a title bar with the text frameTitle)
 *   chev, caret         the tree chevron / the toolbar caret: svg markup, or a function (S) => markup
 *   icons, extColors    {key: inner svg} replacing rail icons (home, files, terminal, editor, calendar, search, gear);
 *                       {ext: color} merged into the file-type colors
 *   folder, file        null, or (open, S) => markup / (name, cls, S) => markup replacing the folder / file icons
 *                       (S.extColor(name) is the color of the file's type)
 *   explorerTitle       tree: null (`Explorer · <project>`), a string or (project, S) => string; the project is always drawn
 *   rowRange            tree: [min, max] of the row height (px), fit to the pane
 *   indent, loadIndent  tree: [base, step] of the row / loading-row indent (px per depth)
 *   emptyTitle, emptyTitleClass   tree: preview breadcrumb text / class (No file open / empty)
 *   emptyClose, emptyIcon, emptyHeading   tree: optional tab close text, full svg, heading (null: omitted / files icon)
 *   emptyHint           tree: the preview instruction (Click a file in the Explorer to open it.)
 *   host, placeholder   terminal: the prompt's user@host; the command input's placeholder (null: none)
 *   linesClass, psClass terminal: extra class of the output block / the prompt text
 *   welcomeFiles        terminal: the startup text also lists the workspace files
 *   focusLine           terminal: the command input takes the focus when the line is not empty
 *   toolbar             editor: the tool keys in order: font, size, bold, italic, underline, color, align-left,
 *                       align-center, align-right, align-justify, bullet, number, undo, redo, '|' (a separator);
 *                       a design may add its own keys and build them in a toolItem override
 *   toolIcons, toolHtml editor: {key: inner svg (viewBox 16)} / {key: markup or (default, S) => markup} of the tool buttons
 *   toolClass           editor: {key: class} of the tool buttons (default: size is 'wide')
 *   toolbarTask         editor: true: the toolbar carries data-task = spec.task
 *   fontName            editor: the font tool's text (null: the sampled font)
 *   sizeInitial         editor: the size tool's first text
 *   sizeCur             editor: the size tool's text for a size key: null (10 / 12 / 18 / 24), 'label' (the task's
 *                       SIZE_LABEL) or (key, S) => text
 *   sizeOption          editor: null, or (key, label, S) => the text of a size option
 *   footerReadout       editor: true: the page footer's `.footer-label` shows Line / Column
 *   docTitle            editor: the document title (null: one drawn from rng; a string draws nothing)
 *   wordsLabel          editor: (count) => the status line's word count
 *   savedText           editor: ['Saved', 'Edited'] texts of the status line
 *   barColor            editor: the color bar of the text-color tool before a color is picked
 *   lastColorInit       editor: the first picked color (null: none; undefined: not yet set)
 *   reveal              terminal | calendar: the tools start folded behind a button (class design-collapsed on the stage)
 *   calToday            calendar: the Today chip in the header
 *   agendaHidden        calendar: the Agenda title and list are hidden
 *   formAlways          calendar: inline form always shows, hint hides (event panel still follows model.form)
 *   formTitle, namePlaceholder, createLabel, cancelLabel   calendar: the form's texts (New event / Event name / Create / Cancel)
 *                       namePlaceholder null derives an empty inline placeholder or Event name for an event panel
 *   calTime12, calNavText   calendar: explicit 12-hour times / text navigation arrows (both false)
 *   calRowCount         calendar: visible row count (null: fit 16 rows, 20..34 px per row)
 *   calEventPanel       calendar: titled event form above Event Details rather than Agenda above an inline form (false)
 *   calSelectedAgenda   calendar: details of only the draft or selected event, with an empty-state message (false)
 *
 * design.parts: { <part>: (base, S) => replacement } replaces a part; the replacement takes the part's arguments and may
 * call base(...) for the default. S reads the live state: S.ctx, S.D (tokens), S.P (the parts, overrides included),
 * S.fam (the task helper API), S.reveal, S.svg(body, viewBox, extra), S.clamp, S.same, S.isField, S.hitPoint, S.freeAt, S.extColor(name),
 * S.FOLDER(open), S.FILE(name, cls), S.CHEV, S.CARET, S.ICONS, S.PROJECTS, S.TITLES, S.RAIL, S.CSS, S.timePicker(C, opts)
 * (a calendar helper). Every tool builds one state object that its parts take: F (frame), T (tree), X (terminal),
 * E (editor), C (calendar); the object lists what it holds, in the order the template sets it. A part that stores state of
 * its own puts it on the object (T.x, E.x, C.x). An override must keep the rng draws of the parts it replaces
 * (rng.pick / float, in order), or the episodes change for every seed.
 *
 *   frame (both frames; hooks default to nothing):
 *     frame(ctx) -> { win, main, gear, appMenu, title }   the window (workspaceFrame or plainFrame, by token frame)
 *     windowBox(ctx) -> win       sizes and places the workspace window (draws rng: 2 floats, 2 picks)
 *     titleText(F)                the workspace title text (draws one pick)
 *     railIcon(ctx, key) -> svg   the inner svg of a rail icon        rail(F)   the activity rail and its gear
 *     titleStart(F) titleEnd(F) afterTitle(F) bodyStart(F) bodyEnd(F) frameEnd(F)   decorations of the frames
 *     rendered(ctx, frame)       after the tool is built             locateFirst(t) -> point | null   before the tool's locate
 *   tree (T):
 *     explorerHead(T)  beforeList(T)  treeList(T) -> list el  listBuilt(T)  previewPane(T)  paneBuilt(T)
 *     rowHeight(T) -> px   rowsLead(T) -> [el]   rowIndent(T, r) -> css   loadIndent(T, r, ld) -> css
 *     rowStyle(T, row, r)  rowIcons(T, row, r, open)  rowName(T, row, r)  rowBuilt(T, row, r)
 *     listSwapped(T, m)  listPainted(T, m)       the list is repainted (rows replaced / scroll restored)
 *     paintPreview(T, m)  previewBody(T, m)  previewEmpty(T, m)  previewFile(T, m, id)  backButton(T)  infoCard(T, card, node)
 *     viewPx(T) -> px     the row height reported to the plan      treeLocate(T, t) -> point | null | undefined
 *   terminal (X):
 *     termSetup(X) termTabs(X) termScroller(X) termInput(X) termReady(X) termEnter(X)
 *     termPs(X, cwd) -> html   the prompt          termWelcome(X, m)  the startup text
 *     termPaintStart(X, m) termPaintEnd(X, m)      termScroll(X, m)   where the output scrolls to after a paint
 *   editor (E):
 *     edHead(E) edToolbarStart(E) toolItem(E, key) fontTool(E) toolbarBuilt(E)
 *     sizeOption(E, key) -> el   edPopups(E)   edArea(E) -> el   edAreaBuilt(E)   edDocTitle(E)   edDocBuilt(E)
 *     edParasBuilt(E)  edStatus(E)  docFontStart(E) -> px  charClass(E, style, i, m) -> class   edReadout(E, m, start, end, style)
 *     barBackground(E) -> css   edPainted(E, m)   edOnDown(E, event)   edLocate(E, t) -> point | null | undefined
 *   calendar (C), also scrollGrid(ctx, fr, sc, rows, rowH, N) -> G and scrollExtra(G, ctx):
 *     calTimeLabel(C, i) -> text   calStart(C)  calBeforeCal(C)  calHead(C)  calSideBuilt(C)  calRows(C, avail) -> { rowH, rows }
 *     calGridBuilt(C)  calLine(C, i)  calPlace(C, el, event)  calEvent(C, event)
 *     calFormPre(C)  calFormFields(C)  calSide(C)  calFormBuilt(C)  calNameInput(C, text)  calActions(C)
 *     calEventPainted(C, m, event)  calPaintEvent(C, m, ...)  calPaintForm(C, m)  calPaintAgenda(C, m)
 *     calPaintStart(C, m) calPaintExtra(C, m)  calReady(C)  calStarted(C)  calLocate(C, t) -> point | null | undefined
 */
(function () {
  'use strict';

  env.template('use-desktop-tools/workspace', (design, def) => {
    const CSS = env.templateLib('use-desktop-tools/_styles').workspaceCSS;
    const ICON = env.templateLib('use-desktop-tools/_shared').ICON;
    const svg = env.templateLib('use-desktop-tools/_shared').svg;
    const FOLDER_SVG = env.templateLib('use-desktop-tools/_shared').FOLDER_SVG;
    const EXT_COLOR = env.templateLib('use-desktop-tools/_shared').EXT_COLOR;
    const FILE_SVG = env.templateLib('use-desktop-tools/_shared').FILE_SVG;
    const SPIN = env.templateLib('use-desktop-tools/_shared').SPIN;
    const PROJECTS = env.templateLib('use-desktop-tools/_shared').PROJECTS;
    const TITLES = { tree: 'Files', terminal: 'Terminal', editor: 'Notes', calendar: 'Calendar' };
    const RAIL = { tree: 'files', terminal: 'terminal', editor: 'editor', calendar: 'calendar' };

    const clamp = env.templateLib('use-desktop-tools/_shared').clamp;
    const same = env.templateLib('use-desktop-tools/_shared').same;
    const isField = env.templateLib('use-desktop-tools/_shared').isField;

    // A viewport point inside el that is not covered by something else (a floating end control, a toast).
    const hitPoint = env.templateLib('use-desktop-tools/_shared').hitPoint;
    // Point (x, y) is usable when the element at it belongs to `owner`.
    const freeAt = env.templateLib('use-desktop-tools/_shared').freeAt;

    const TOOL_ICON = {
      'align-left': '<path d="M3 4h10M3 7h7M3 10h10M3 13h7"/>',
      'align-center': '<path d="M3 4h10M4.5 7h7M3 10h10M4.5 13h7"/>',
      'align-right': '<path d="M3 4h10M6 7h7M3 10h10M6 13h7"/>',
      'align-justify': '<path d="M3 4h10M3 7h10M3 10h10M3 13h10"/>',
      bullet: '<circle cx="3.5" cy="5" r=".9"/><circle cx="3.5" cy="11" r=".9"/><path d="M7 5h6M7 11h6"/>',
      number: '<path d="M2.5 3.5h1v3M2.5 9.5h2l-2 3h2M7 5h6M7 11h6"/>',
      undo: '<path d="M5 6H10a3 3 0 0 1 0 6H7M5 6l2.5-2.5M5 6l2.5 2.5"/>',
      redo: '<path d="M11 6H6a3 3 0 0 0 0 6h3M11 6L8.5 3.5M11 6L8.5 8.5"/>',
    };
    const TOOL_TITLE = {
      size: 'Text size', bold: 'Bold (Ctrl+B)', italic: 'Italic (Ctrl+I)', underline: 'Underline (Ctrl+U)', color: 'Text color',
      'align-left': 'Align left', 'align-center': 'Center', 'align-right': 'Align right', 'align-justify': 'Justify',
      bullet: 'Bulleted list', number: 'Numbered list', undo: 'Undo (Ctrl+Z)', redo: 'Redo (Ctrl+Y)',
    };
    const TOOL_HTML = {
      bold: '<b style="font-size:16px">B</b>',
      italic: '<i style="font:italic 16px Georgia,serif">I</i>',
      underline: '<u style="font-size:16px">U</u>',
    };

    // The stylesheet the terminal sites share (the page shell's classes), the css of the terminal preset.
    const SHELL_CSS_TERMINAL = env.templateLib('use-desktop-tools/_styles').shellCSS;

    const TOKENS = {
      // look of the window
      css: '',
      siteCssLast: false,
      frame: 'workspace',
      frameTitle: '',
      chev: svg('<path d="M6 3.5L10.5 8 6 12.5"/>', 16, 'class="chev"'),
      caret: svg('<path d="M4 6l4 4 4-4"/>', 16),
      icons: {},
      extColors: {},
      folder: null,
      file: null,
      // tree
      explorerTitle: null,
      rowRange: [21, 27],
      emptyTitle: 'No file open',
      emptyTitleClass: '',
      emptyClose: null,
      emptyIcon: null,
      emptyHeading: null,
      emptyHint: 'Click a file in the Explorer to open it.',
      indent: [6, 18],
      loadIndent: [6, 18],
      // terminal
      host: 'user@workspace',
      placeholder: null,
      linesClass: '',
      psClass: '',
      welcomeFiles: false,
      focusLine: false,
      // editor
      toolbar: ['font', 'size', '|', 'bold', 'italic', 'underline', 'color', '|', 'align-left', 'align-center', 'align-right',
        'align-justify', '|', 'bullet', 'number', '|', 'undo', 'redo'],
      toolIcons: {},
      toolHtml: {},
      toolClass: { size: 'wide' },
      toolbarTask: false,
      fontName: 'Helvetica',
      sizeInitial: 'Normal',
      sizeCur: null,
      sizeOption: null,
      footerReadout: true,
      docTitle: null,
      wordsLabel: (n) => `${n} words`,
      savedText: ['Saved', 'Edited'],
      barColor: 'var(--fg)',
      lastColorInit: null,
      reveal: null,
      // calendar
      calToday: true,
      agendaHidden: false,
      formAlways: false,
      formTitle: 'New event',
      namePlaceholder: 'Event name',
      createLabel: 'Create',
      cancelLabel: 'Cancel',
      calTime12: false,
      calNavText: false,
      calRowCount: null,
      calEventPanel: false,
      calSelectedAgenda: false,
    };

    // Presets: what most design-* sites of a scenario share; a widget that declares exactly one scenario starts from that
    // scenario's preset (its design still wins).
    const SCENARIOS = {
      // 11 of 12 designs show no Line / Column readout and 8 of 12 name no font (the base widget's quirks stay token defaults)
      editor: {
        footerReadout: false, fontName: null,
        toolIcons: { bullet: '<circle cx="3" cy="3.5" r=".7" fill="currentColor"/><circle cx="3" cy="8" r=".7" fill="currentColor"/><circle cx="3" cy="12.5" r=".7" fill="currentColor"/><path d="M6 3.5h8M6 8h8M6 12.5h8"/>' },
        toolHtml: { number: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.1"><text x="1" y="5" fill="currentColor" stroke="none" font-size="5">1</text><text x="1" y="9.5" fill="currentColor" stroke="none" font-size="5">2</text><text x="1" y="14" fill="currentColor" stroke="none" font-size="5">3</text><path d="M6 3.5h8M6 8h8M6 12.5h8"/></svg>' },
        wordsLabel: (n) => `Words: ${n}`,
        sizeCur: (key, S) => key === 'normal' ? 'Paragraph' : S.fam.SIZE_LABEL[key],
      },
      // 10 of 12 designs keep inline forms on screen; 11 of 12 use `Create event`; null derives the usual empty placeholder
      calendar: {
        formAlways: true, createLabel: 'Create event', namePlaceholder: null,
        calTime12: true, calNavText: true, calRowCount: 30, calEventPanel: true, calSelectedAgenda: true,
      },
      tree: {
        explorerTitle: 'Project Files', rowRange: [21, 33], emptyTitle: 'Welcome', emptyTitleClass: 'at-tab',
        emptyClose: '✕', emptyHeading: 'No file selected',
        emptyHint: 'Open a file from the project tree to view its contents.',
        emptyIcon: '<svg viewBox="0 0 24 24" fill="none" stroke="#37371b" stroke-width="1.4" stroke-linejoin="round"><path d="M6 2h8l6 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/><path d="M14 2v6h6"/></svg>',
      },
      // the shell of the terminal sites: a bare window titled Terminal and the shared page stylesheet
      terminal: { frame: 'plain', frameTitle: 'Terminal', siteCssLast: true, css: SHELL_CSS_TERMINAL, welcomeFiles: true, focusLine: true },
    };

      let D; // the tokens of this widget (set at the end of the factory)
    let P; // the parts of this widget (set at the end of the factory)
    let CHEV;
    let CARET;
    let ICONS;
    let EXT_COLORS;

    let view = null; // live episode: { sync(m), locate(t), onKey?(e), onDown?(e), onMove?(e), onUp?(e) }
    let wired = false;
    let ctxRef;
    const BASE = {};
    const extColor = (name) => {
      const m = /\.(tar\.gz|[A-Za-z0-9]+)$/.exec(name);
      return EXT_COLORS[m ? m[1].toLowerCase() : ''] || '#868e96';
    };
    const S = {
      get ctx() { return ctxRef; },
      get D() { return D; },
      get P() { return P; },
      get ICONS() { return ICONS; },
      PROJECTS, TITLES, RAIL, CSS, env, SPIN, TOOL_HTML, TOOL_ICON, TOOL_TITLE,
      svg, clamp, same, isField, hitPoint, freeAt, extColor,
      get fam() { return env.taskDef.helpers; },
    };
    // The icons: a design replaces them with the folder / file tokens (functions of S).
    const FOLDER = (open) => (D.folder ? D.folder(open, S) : FOLDER_SVG(open));
    const FILE = (name, cls = 'ico') => (D.file ? D.file(name, cls, S) : FILE_SVG(name, cls, extColor(name)));
    Object.assign(S, { FOLDER, FILE, SPIN });

    function wire() {
      if (wired) return;
      wired = true;
      window.addEventListener('keydown', (e) => { if (view && view.onKey) view.onKey(e); });
      window.addEventListener('pointerdown', (e) => { if (view && view.onDown) view.onDown(e); });
      window.addEventListener('pointermove', (e) => { if (view && view.onMove) view.onMove(e); });
      window.addEventListener('pointerup', (e) => { if (view && view.onUp) view.onUp(e); });
    }

    function ensureStyle() {
      if (document.getElementById('at-style')) return;
      const s = document.createElement('style');
      s.id = 'at-style';
      s.textContent = CSS + D.css;
      document.head.append(s);
      if (D.siteCssLast) {
        const local = document.querySelector('link[href$="site.css"]');
        if (local) document.head.append(local);
      }
    }

    const fail = (t) => { throw new Error(`use-desktop-tools/workspace cannot locate ${JSON.stringify(t)}`); };

    // ================================================================ window frame

    // Hooks of both frames (default: nothing), called with F = { ctx, win, title, body?, main?, gear? }:
    BASE.titleStart = () => {};
    BASE.titleEnd = () => {};
    BASE.afterTitle = () => {};
    BASE.bodyStart = () => {};
    BASE.bodyEnd = () => {};
    BASE.frameEnd = () => {};

    BASE.frame = (ctx) => (D.frame === 'plain' ? P.plainFrame(ctx) : P.workspaceFrame(ctx));

    // The window: sized from the stage and placed at a sampled position.
    BASE.windowBox = (ctx) => {
      const { util, rng, size } = ctx;
      const W = size.width;
      const H = size.height;
      const maxW = Math.max(300, W - 20);
      const maxH = Math.max(300, H - 16);
      const w = Math.round(Math.min(maxW, Math.max(Math.min(maxW, 780), maxW * rng.float(0.82, 1))));
      const h = Math.round(Math.min(maxH, Math.max(Math.min(maxH, 470), maxH * rng.float(0.86, 1))));
      const ax = rng.pick([0, 0.5, 1, rng.float()]);
      const ay = rng.pick([0, 0.5, 1, rng.float()]);
      const win = util.el('div', 'at-win', ctx.stage);
      Object.assign(win.style, { width: `${w}px`, height: `${h}px`, left: `${Math.round(10 + (W - 20 - w) * ax)}px`, top: `${Math.round(8 + (H - 16 - h) * ay)}px` });
      if (W - 20 < w) win.style.left = `${Math.max(0, Math.round((W - w) / 2))}px`;
      if (H - 16 < h) win.style.top = `${Math.max(0, Math.round((H - h) / 2))}px`;
      return win;
    };

    // The title text in the title bar (draws once from rng).
    BASE.titleText = (F) => {
      const { util, spec, rng } = F.ctx;
      util.el('b', '', F.title, `${TITLES[spec.scenario]} — ${rng.pick(['Workspace', 'Workbench', 'Desk'])}`);
    };

    // The inner svg of rail icon k (home, files, terminal, editor, calendar, search).
    BASE.railIcon = (ctx, k) => ICONS[k];

    // The activity rail (F.body -> F.rail) with the settings gear (F.gear).
    BASE.rail = (F) => {
      const { util, spec } = F.ctx;
      const rail = F.rail = util.el('nav', 'at-rail', F.body);
      const on = RAIL[spec.scenario];
      for (const k of ['home', 'files', 'terminal', 'editor', 'calendar', 'search']) {
        util.el('span', k === on ? 'on' : '', rail).innerHTML = svg(P.railIcon(F.ctx, k));
      }
      const gear = F.gear = util.el('span', 'end', rail);
      gear.innerHTML = svg(ICONS.gear);
      gear.title = 'Settings';
      gear.dataset.role = 'settings';
    };

    BASE.workspaceFrame = (ctx) => {
      const { util } = ctx;
      const F = { ctx, win: P.windowBox(ctx) };
      F.title = util.el('div', 'at-title', F.win);
      util.el('div', 'at-dots', F.title).innerHTML = '<i></i><i></i><i></i>';
      P.titleText(F);
      P.titleEnd(F);
      P.afterTitle(F);
      F.body = util.el('div', 'at-body', F.win);
      P.rail(F);
      F.main = util.el('div', 'at-main', F.body);
      return { win: F.win, main: F.main, gear: F.gear, appMenu: null, title: F.title };
    };

    // A bare window for designs that draw their own frame: a title (token frameTitle), the body, a hidden gear.
    BASE.plainFrame = (ctx) => {
      const { util } = ctx;
      const F = { ctx };
      F.win = util.el('section', 'at-win', ctx.stage);
      F.title = util.el('div', 'at-title', F.win);
      P.titleStart(F);
      util.el('b', '', F.title, D.frameTitle);
      P.titleEnd(F);
      F.body = util.el('div', 'at-body', F.win);
      P.bodyStart(F);
      F.main = util.el('div', 'at-main', F.body);
      P.bodyEnd(F);
      F.gear = util.el('button', '', F.title);
      F.gear.hidden = true;
      P.frameEnd(F);
      return { win: F.win, title: F.title, main: F.main, gear: F.gear, appMenu: null };
    };

    // Folded tools (token reveal): the stage starts with a class design-collapsed and a button that opens the tools
    // (model.designOpen); until then the targets of the tool (terminal: the prompt, calendar: the form) are the button.
    const rv = S.reveal = { ctx: null, open: false, button: null, focus: null };
    function prepareReveal(ctx) {
      rv.ctx = ctx;
      rv.open = !!ctx.model.designOpen || (D.reveal === 'calendar' && !!ctx.model.form);
      ctx.stage.classList.toggle('design-collapsed', !rv.open);
      const button = rv.button = ctx.util.el('button', 'design-reveal', ctx.stage, D.reveal === 'terminal' ? 'Show controls' : 'Expand tools');
      button.type = 'button';
      button.hidden = rv.open;
      button.addEventListener('click', () => {
        rv.open = true;
        ctx.stage.classList.remove('design-collapsed');
        button.hidden = true;
        ctx.update({ ...ctx.model, designOpen: true });
        if (rv.focus) {
          const input = ctx.stage.querySelector(rv.focus);
          if (input) input.focus({ preventScroll: true });
        }
      });
    }
    function revealTarget(t) {
      if (rv.open || !rv.button) return null;
      const needs = D.reveal === 'terminal' ? t.prompt : t.field || t.form;
      if (!needs) return null;
      rv.focus = D.reveal === 'terminal' ? 'input[aria-label="command line"]' : 'input[placeholder="Event name"]';
      return env.util.center(rv.button);
    }

    // After the tool is built (frame = the frame's return value) / before the tool's own locate (a point or null).
    BASE.rendered = (ctx) => { if (D.reveal) prepareReveal(ctx); };
    BASE.locateFirst = (t) => (D.reveal ? revealTarget(t) : null);

    const buildTree = env.templateLib('use-desktop-tools/_workspace-tree').install(S, BASE);

    const buildTerminal = env.templateLib('use-desktop-tools/_workspace-terminal').install(S, BASE);

    const buildEditor = env.templateLib('use-desktop-tools/_workspace-editor').install(S, BASE);

    const buildCalendar = env.templateLib('use-desktop-tools/_workspace-calendar').install(S, BASE);

    const BUILDERS = { tree: buildTree, terminal: buildTerminal, editor: buildEditor, calendar: buildCalendar };

    ({ D, P } = env.templateDesign('use-desktop-tools/workspace', design, def, { tokens: TOKENS, scenarios: SCENARIOS, base: BASE, state: S }));
    // The chevron and caret icons are a string or a function of S.
    CHEV = typeof D.chev === 'function' ? D.chev(S) : D.chev;
    CARET = typeof D.caret === 'function' ? D.caret(S) : D.caret;
    ICONS = { ...ICON, ...D.icons };
    EXT_COLORS = { ...EXT_COLOR, ...D.extColors };
    Object.assign(S, { CHEV, CARET });

    return {
      render(ctx) {
        ensureStyle();
        wire();
        view = null;
        ctxRef = ctx;
        const chrome = P.frame(ctx);
        if (chrome.gear) chrome.gear.addEventListener('click', () => env.log('decoy', { what: 'settings' }));
        view = BUILDERS[ctx.spec.scenario](ctx, chrome.main, chrome);
        P.rendered(ctx, chrome);
        return { anchors: [chrome.win], sync: (m) => view.sync(m) };
      },

      locate(t) {
        return P.locateFirst(t) || (view && view.locate(t)) || fail(t);
      },
    };
  }, { uses: ["use-desktop-tools/_styles","use-desktop-tools/_shared","use-desktop-tools/_workspace-tree","use-desktop-tools/_workspace-terminal","use-desktop-tools/_workspace-editor","use-desktop-tools/_workspace-calendar"] });
})();
