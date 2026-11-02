/*
 * click-control: click (or hover, double-click, right-click) the right control on a page. MiniWoB counterparts:
 * click-button, click-button-sequence, click-link, click-tab, click-tab-2 (+ -easy, -medium, -hard),
 * click-menu, click-menu-2, click-collapsible, click-collapsible-2, click-dialog, click-dialog-2, click-pie,
 * click-widget, click-test, click-test-2, click-test-transfer, focus-text, focus-text-2, hover-shape; plus
 * real-world click patterns MiniWoB lacks (look-alike labels, disabled decoys, links styled as buttons,
 * tooltips on icon-only buttons, hover-reveal row actions, context menus, double-click to open, menu-aim).
 * Pointer only (inputs ['pointer']): focus-text needs no typing, so any key press ends the episode.
 *
 * scenarios
 *   button       kind 'labels' (click-button: 6 page elements = sentences, labeled text inputs and 2+
 *                buttons with labels from env.content.BUTTON_LABELS; every enabled button whose label equals
 *                the target counts; some buttons are disabled decoys), 'test' (click-test: one "Click Me!"
 *                button of random size and place), 'pair' (click-test-2 / -transfer: ONE and TWO at random
 *                places), 'lookalike' (a toolbar / card / footer of 4-7 controls, 3-5 from one look-alike
 *                group such as Save / Save as… / Saved / Save draft; controls are styled as buttons, links,
 *                ghost or icon+text buttons (look); a disabled twin may carry the target label)
 *   sequence     click-button-sequence: 2-4 buttons ONE..FOUR (or real short labels) at random places; press
 *                2-3 of them in the given order
 *   link         mode 'text' (click-link: paragraphs of real sentences with inline link phrases; click the
 *                link with the given text, any link with that text counts) or mode 'list' (a "related" list
 *                where some links are styled as buttons or chips)
 *   tab          mode 'tab' (click-tab: activate the named tab; it starts inactive) or mode 'link'
 *                (click-tab-2: find and click a link inside the tabs; level easy = 1 tab, medium = 2,
 *                normal = 3, hard = 2-7 tabs labeled 1..n)
 *   menu         mode 'bar' (click-menu: an always-visible menu of people names nested up to 3 levels;
 *                "Select Ann>Bob>Cy") or mode 'button' (click-menu-2: a "Menu" button opens an app menu built
 *                from env.content.MENU_ITEMS with icons, shortcuts, submenus and a disabled item; the target
 *                is named by label, path or icon). spec.openBy: submenus open on 'hover' (after a hover delay
 *                on the kit clock) or 'click'; sampled from the widget's traits.menuOpen (default both).
 *                spec.aim (hover only): menu-aim behavior, open submenus close spec.aimDelay ms (kit clock)
 *                after the pointer leaves the menu
 *   collapsible  mode 'expand' (click-collapsible: expand the named section) or mode 'link'
 *                (click-collapsible-2: expand sections to find and click a link)
 *   dialog       click-dialog / -2: a realistic dialog with an "x" and 0, 2 or 3 buttons; click the named
 *                one. spec.opener: some dialogs start closed behind a page button that opens them
 *   pie          click-pie: open the pie menu, click the item with the given label (4-8 items)
 *   widget       click-widget: 5 widgets (radio, checkbox, text, textarea, button); click one of the type
 *   focus        focus-text / -2: focus a text field by clicking into it, named by ordinal (1st / 2nd / 3rd)
 *                or by its label (instructions may use a label alias from env.content.FIELD_LABELS)
 *   hover        hover-shape: keep the pointer over the highlighted square; the highlight jumps to another
 *                square every spec.period ms of task time (kit clock); accumulate spec.need ms over it
 *   tooltip-inspect  gather information by hovering before acting. mode 'icon': an icon-only toolbar; each
 *                button shows its tooltip after spec.delay ms of hover (kit clock); click the one whose
 *                tooltip is the target. mode 'id': a list with duplicate names; hovering a name shows a
 *                tooltip with the record's ID; click the action button of the row with the target ID
 *   rows         hover-reveal row actions: a table of people or files whose action buttons (Edit, Delete,
 *                Archive, ...) are only shown while the pointer is over the row; click the named action of
 *                the named row ("delete the row for Alice Chen")
 *   context      right-click context menu: right-click a file to open its (widget-drawn) context menu and pick
 *                the named action; a left click only selects
 *   open         double-click to open: a file browser where a click selects and a double-click opens an
 *                item; spec.route 'toolbar' episodes demonstrate select + the toolbar "Open" button instead
 *   hover-menu   hover-only navigation: the page header's top-level entries open mega dropdowns (grouped
 *                links) only while the pointer is over the entry or its dropdown; clicking an entry does
 *                nothing more. The dropdown closes spec.grace ms (kit clock) after the pointer leaves it;
 *                click the named link ("Open Security from the Products menu")
 *   flyout       nested flyout submenus: a "Shop by department"-style trigger opens on hover (or click) a
 *                department list; hovering a department opens its categories to the right, and so on 3-4
 *                levels deep (hover delay spec.hoverDelay); the whole menu closes spec.aimDelay ms after the
 *                pointer leaves every open panel, so the path must be followed without wandering off.
 *                spec.by: 'path' (40%) names the whole path; 'label' (40%) names only the sub-category (a 4th-level
 *                ood target with its sub-category, "Best sellers" under "Headphones"), so the agent searches the
 *                departments' submenus; 'clue' (20%) targets a category, named by one sub-category listed in it
 *                ("open the category that lists Dog beds"): a click on a category is then the final choice.
 *                Label and clue episodes add look-alike decoys ("Dog bed covers") to sibling categories of the
 *                same department, for the named sub-category (70%) and 1-2 others. Drawn from rng.fork('search'):
 *                the tree and target of a path episode are what the seed always gave
 *   row-reveal   row actions that appear only on row hover: each row shows 1-2 quick actions and a "⋯"
 *                overflow button only while hovered; most targets live in the overflow menu (hover the
 *                row, open "⋯", pick the entry)
 *
 * Final choices, recovery and the episode end
 *   A "final choice" is a click on a candidate target: a button, link, menu leaf, dialog button, pie item,
 *   widget, text field, toolbar tool, row action, context-menu entry or an opened file. A correct final
 *   choice brings the error to 0 and the episode ends on the end control or finish as usual. Navigation
 *   never ends the episode (tab headers, section headers, the menu trigger, submenu parents, the dialog
 *   opener, opening the pie menu, hovering, opening a context menu, selecting a file).
 *   A wrong final choice is "pending" until undone. spec.recoverable (sampled 50/50 or forced by the
 *   episode knob recover): when false the first wrong final choice ends the episode (ended() ->
 *   'wrong-choice' / 'wrong-press'); when true the widget shows the result of the wrong choice plus a way
 *   back (an Undo toast, or a Back link after following a wrong link / opening a wrong file), the error
 *   carries a penalty while it is pending, and a second wrong final choice ends the episode.
 *   Undo removes the wrong choice from model.clicks and counts it in model.undone (undoModel()).
 *   A wrong final choice planted by the 'wrong' start mode (model.planted) does not count as a strike.
 *
 * Start modes (startModes off, partial, wrong, solved)
 *   partial  navigation half done: the right tab active / section open, the menu open on the target path,
 *            the dialog open (opener scenarios), the first press of a sequence done, the context menu open on
 *            the target file, the target file selected, half of the hover time accumulated (not pie: a pie
 *            only starts open in 'scene')
 *   wrong    a wrong final choice already made (pending, with its Undo / Back shown) when the scenario has
 *            one, else wrong navigation (a wrong tab / section / submenu / context menu / selected file)
 *   scene    the reference screen's unsolved mid-task state (previews / eval, never in the default training
 *            mix): pie menu expanded (model.open; every pie widget opens the kit's pieMenu from the model
 *            state at load, pie.set(model.open)); menu open on the whole path to the target (every needed submenu
 *            open, nothing picked; mode 'button': the trigger's panel too), dialog open (also opener
 *            dialogs), collapsible mode 'link' with the target's section open and mode 'expand' with a
 *            non-target section open, tab mode 'link' on the tab holding the link
 *   scenarios without such a state start 'off' in that mode (the kit only needs error > tau)
 *
 * Levels (opts.level easy | medium, normal unchanged): the sampled episode is pruned in place from
 * rng.fork('level') (levelAdjust): button: a bigger 'Click Me!', fewer elements and no disabled decoys on easy;
 * sequence: 2 / 3 presses, no extra buttons; link: fewer links / paragraphs; tab, collapsible: 2-3 tabs /
 * sections; menu: only the target path plus 1 / 2 siblings per level, no menu-aim; dialog: at most 2 buttons on
 * easy; pie: 4 / 6 items; widget: 3 / 4; focus: 2 fields on easy; hover: shorter need, longer period, 3 / 4
 * squares; tooltip-inspect: shorter delay, fewer tools / duplicates; rows, context, open: fewer rows, items,
 * actions. Targets and what the instruction names stay.
 *
 * Episode knobs: spec.isplit (instruction templates), spec.csplit (content banks), spec.ood (more buttons,
 * links, tabs, sections, deeper menus, more pie items, widgets, fields, shapes, tools, rows and files),
 * spec.startMode, spec.recoverable.
 *
 * spec   { scenario, isplit, csplit, ood, startMode, recoverable, ... }
 *   button       kind, elements: [{ type: 'text', text } | { type: 'input', label, width }
 *                  | { type: 'button', key, label, br?, look?, icon?, disabled?, x?, y?, size? }], target
 *                  (label), layout ('toolbar' | 'card' | 'footer', lookalike only)
 *                  x, y in [0, 1]: fraction of the free space (left = x * (W - w)); any two buttons differ
 *                  by >= 0.45 in x or y, so buttons up to 45% of the free space never overlap.
 *                  size (test): 35-100, MiniWoB px, scale as you like
 *                  look: 'button' | 'primary' | 'link' | 'ghost' | 'icon' (icon + text)
 *   sequence     buttons: [{ key, label, x, y }], order: [keys]
 *   link         mode, blocks: [[{ text, link, look? }]] (paragraph segments; look in mode 'list':
 *                'link' | 'button' | 'chip'), heading, target (text)
 *   tab          mode, level, tabs: [{ label, words: [{ text, link }] }], start (active tab index),
 *                target (tab index in mode 'tab', link text in mode 'link')
 *   menu         mode, openBy, aim, aimDelay, tree: [{ key, label, icon?, shortcut?, disabled?, children? }],
 *                target (leaf key), by ('path' | 'label' | 'icon'); keys are full paths 'Ann>Bob' (unique)
 *   collapsible  mode, sections: [{ title, words: [{ text, link }] }], target (index | link text)
 *   dialog       title, text, buttons: [labels] (0, 2 or 3), target ('x' | label), opener (null | label)
 *   pie          items: [labels], target
 *   widget       widgets: [{ type, text }], target (type)
 *   focus        fields: [{ label, aliases }], target (index), by ('ordinal' | 'label')
 *   hover        shapes: [{ x, y, size }] (unit square, top-left corner + side), color, need, period
 *   tooltip-inspect  mode, delay (ms), scan (keys the oracle hovers, in order, ending with the target)
 *                  icon: tools: [{ key, icon, tip }], target (key)
 *                  id:   rows: [{ key, name, id, meta }], action (button label), idLabel, target (key)
 *   rows         kind ('people' | 'files'), columns: [labels], rows: [{ key, cells: [..] }], actions:
 *                [{ key, label, icon }], style ('icons' | 'text'), target: { row, action }
 *   context      layout ('grid' | 'list'), items: [{ key, name, kind, size }], actions: [{ key, label,
 *                disabled?, sep? }], target: { item, action }
 *   open         layout ('grid' | 'list'), route ('dbl' | 'toolbar'), items: [{ key, name, kind, size }],
 *                target (key)
 *   hover-menu   tops: [{ key, label, groups: [{ title, items: [{ key: 'Top>Label', label }] }] }], target
 *                (link key), grace (ms), by ('path' | 'label')
 *   flyout       mode 'flyout', openBy 'hover', aim true, aimDelay, hoverDelay, trigger (label), tree (as
 *                menu, keys 'Dept>Cat>Sub'), target (leaf key; by 'clue': the category key 'Dept>Cat'), by ('path'
 *                | 'label' | 'clue'), clue (by 'clue' only: key of the sub-category the instruction names, a
 *                child of the target); department, category and sub-category labels are unique in label / clue trees
 *   row-reveal   kind, columns, rows (as rows), quick: [{ key, label, icon }] (always on the row),
 *                more: [{ key, label }] (in the "⋯" menu), style, moreLabel, target: { row, action }
 * model  every scenario but hover has clicks: [keys of final choices, in order], undone (wrong choices
 *   undone), planted (1 when the start planted a wrong choice), plus
 *   tab { active }, menu { path (null = closed, [] = root open, [k1, k2] = open submenus), out, outMs },
 *   collapsible { open: [indices] }, dialog { open }, pie { open },
 *   hover { over (index | null), hl (highlighted index), got (ms hovered on the highlight), t (ms since the
 *   last jump) } (no clicks), tooltip-inspect { hover, hoverMs, tip (key whose tooltip shows), seen: [keys] },
 *   rows { hover (row key | null) }, context { menuFor (item key | null) }, open { sel (key | null) },
 *   hover-menu { open (top key | null), out, outMs }, flyout { path (null = closed, as menu), out, outMs },
 *   row-reveal { hover (row key | null), menuFor (row key whose "⋯" menu is open | null) }
 *   keys: button / sequence: element key; link: 'b.i' (block, segment); tab link: 't.i'; collapsible link:
 *   's.i'; menu / flyout: leaf key (flyout by 'clue': category key); dialog: result ('x' or label); pie: label; widget / focus: index;
 *   tooltip-inspect: tool / row key; rows / context / row-reveal: 'row|action'; open: item key;
 *   hover-menu: link key
 * error  0 after a correct final choice; while a wrong one is pending 1 + 0.25 (sequence: 1 - correct
 *        presses in order / length + 0.25); before any choice, partial credit for navigation: 0.5 while
 *        the target's container is shown (tab link: the active tab holds the link; collapsible link: an
 *        open section holds it; dialog with opener: open; pie: open; tooltip-inspect: the target's tooltip
 *        has been shown; context: the menu is open on the target file; open: the target is selected),
 *        menu / flyout 1 - 0.5 * (opens done in order / opens needed; flyout: the trigger plus each ancestor of
 *        the target, so searching other departments neither earns nor loses credit); hover-menu 0.5 while the target's
 *        dropdown is open; row-reveal 0.5 while the "⋯" menu of the target row is open (target in it).
 *        sequence: 1 - correct presses in order /
 *        length. mode 'tab' / 'expand': 0 when the target tab is active / section is open, else 1.
 *        hover: seconds still to hover (need - got) / 1000. tau = 0 everywhere.
 *
 * plan targets (the widget's locate() maps them to viewport px)
 *   { button: key }      a button (button, sequence)
 *   { link: key }        a link segment (link, tab link, collapsible link)
 *   { tab: index }       a tab header
 *   { trigger: 'menu' }  the menu button (menu mode 'button')
 *   { item: key }        a menu item row (shown)
 *   { section: index }   a collapsible section header
 *   { opener: true }     the page button that opens the dialog
 *   { dialog: result }   a dialog button ('x' = the close button)
 *   { pie: 'open' }      where to press to open the pie menu
 *   { slice: label }     the middle of an item's slice (pie open)
 *   { widget: index }    a widget (its control)
 *   { field: index }     a text field
 *   { shape: index }     a square (hover)
 *   { tool: key }        an icon-only toolbar button (tooltip-inspect icon)
 *   { tip: key }         the hover spot that shows a row's ID tooltip (tooltip-inspect id)
 *   { act: key }         a row's action button (tooltip-inspect id)
 *   { row: key }         a row (hover to reveal its actions)
 *   { action: [row, action] }  a revealed row action button
 *   { item2: key }       a file in the context / open scenarios
 *   { centry: action }   an entry of the open context menu
 *   { openbtn: true }    the toolbar "Open" button (open, route 'toolbar')
 *   { blank: true }      empty page space (a click there closes an open context / row menu)
 *   { top: key }         a header navigation entry (hover-menu; hover opens its dropdown)
 *   { nav: key }         a link in the open dropdown (hover-menu)
 *   { trigger: 'menu' }  also the flyout trigger (flyout)
 *   { more: row }        a row's "⋯" overflow button (row-reveal; shown on row hover)
 *   { mentry: action }   an entry of the open "⋯" menu (row-reveal)
 *   { undo: true }       the Undo / Back control shown after a pending wrong choice
 * plan steps: { click } everywhere; menu with openBy 'hover' uses { move: { item } } on submenu parents;
 * hover uses { move: { shape } } and { wait: true }; tooltip-inspect { move: { tool | tip } } then
 * { click }; rows { move: { row } } then { click: { action } }; context { rightclick: { item2 } } then
 * { click: { centry } } (a menu open on another file is first closed with { click: { blank } }); open
 * { dblclick: { item2 } } (route 'toolbar': { click: { item2 } }, then { click: { openbtn } }); hover-menu
 * { move: { top } } then { click: { nav } }; flyout { move: { trigger } }, { move: { item } } per submenu
 * parent, { click: { item } } (the oracle reads the spec and follows the direct path in every by mode; by 'clue' its
 * last step clicks the category); row-reveal { move: { row } }, then { click: { more } } and { click: { mentry } }
 * (or { click: { action } } for a quick action); a pending wrong choice is undone first with { click: { undo } }.
 *
 * Content: env.content SENTENCE_GROUPS / SENTENCES and LINK_TEXTS (links), BUTTON_LABELS (look-alike groups,
 * sequence words), MENU_ITEMS (app menus, with shortcuts), FIRST_NAMES / personName (menubar, contact rows),
 * ICON_NAMES (extra tooltips), FIELD_LABELS (+ aliases), NAV_ITEMS (tab labels), TOPICS (sections),
 * JOB_TITLES / DEPARTMENTS, fileName / fileSize (files), END_LABELS (never a target), all honoring csplit.
 * Instructions: 3-10 core templates per scenario / mode (env.instruct.pick, ~20% held out by isplit),
 * wrapped by env.instruct.say (registers, terse forms, step lists); field labels go through
 * env.instruct.alias.
 *
 * Deviations from MiniWoB: real content instead of lorem / random letters; instructions are paraphrased
 * (env.instruct) and never mention the end control; wrong choices may be recoverable.
 *
 * Helpers (widget API, env.taskDef.helpers):
 *   pending(model, spec): whether a wrong final choice is waiting to be undone.
 *   wrongKeys(model, spec): the wrong final-choice keys still in effect.
 *   undoModel(model, spec): undo pending wrong choices and restore navigation.
 *   resultText(spec, key): the selected item's result text.
 *   flyPick(spec, key): whether a clue-mode flyout category is a final choice.
 *
 * The self-test lives in selftest.js (loaded only by the checker and node tests).
 *
 * Optional hooks (round 2 contract):
 *   facts     rows / row-reveal: up to 3 other cells of the target row (as shown); [] elsewhere (a click leaves
 *             nothing to report that the instruction does not already name)
 *   silent    the click "did not stick": drops the last correct click (sequence: the last correct press), tab
 *             back to the start tab, collapsible section closed again; null for hover and judged episodes
 *   retarget  another target in the same scene (same action for rows / row-reveal / context), for every scenario
 *             but hover, sequence and tooltip-inspect; null once any final choice was made (menu and flyout
 *             retargets name the new leaf by its path)
 *   judgeModes ['impossible']: spec.judge = { mode, kind, what, value, action, templates, vars, message } names a
 *             phantom target (a button, link, tab, section, menu item, file, row, action or color) that the scene
 *             does not hold (kind: what sort of thing; what: [the phantom as the instruction names it], which the
 *             reply's missing item must name); error stays 0 until something is clicked or navigated. No 'confirm' (most scenarios are one irreversible click with nothing to
 *             prepare first) and no 'ambiguous' (targets are unique by construction).
 *
 * Files (files: [...] below, loaded in order after this one): instructions.js and judge.js attach shared code
 * to lib, followed by scenarios/<scenario>.js, one env.scenario('click-control', {...})
 * object per scenario. scenarios/rows.js holds rows and row-reveal, which share their sampler. This file holds the
 * shared helpers (lib) and dispatches to the objects; the hooks an object has are listed above the dispatch section.
 */
(function () {
  'use strict';

  // ---------------------------------------------------------------- content

  const PEN = 0.25; // error penalty while a wrong final choice is pending (recoverable mode)
  const NUMBERS = ['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX'];
  const ORD = ['1st', '2nd', '3rd', '4th', '5th', '6th'];
  const WIDGET_NAMES = { radio: ['radio button', 'radio'], checkbox: ['checkbox', 'check box', 'tick box'],
    text: ['text input', 'text field', 'single-line text box'], textarea: ['text area', 'multi-line text box', 'textarea'],
    button: ['button', 'push button'] };

  // Icons the base widgets draw. name -> how an instruction describes the glyph.
  const ICONS = {
    plus: 'plus sign', folder: 'folder', disk: 'floppy disk', print: 'printer', trash: 'trash can', gear: 'gear',
    star: 'star', zoomin: 'magnifier with a plus', zoomout: 'magnifier with a minus', prev: 'skip-back',
    stop: 'square stop', play: 'play triangle', next: 'skip-forward', mail: 'envelope', bell: 'bell', user: 'person',
    lock: 'padlock', home: 'house', heart: 'heart', copy: 'two sheets', pencil: 'pencil', search: 'magnifier',
    download: 'arrow into a tray', upload: 'arrow out of a tray', share: 'three connected dots', link: 'chain link',
    archive: 'box', tag: 'tag', pin: 'pushpin', flag: 'flag', refresh: 'circular arrow', undo: 'arrow curving left',
    redo: 'arrow curving right', bold: 'bold B', italic: 'italic I', list: 'bulleted list', calendar: 'calendar',
    filter: 'funnel', eye: 'eye', more: 'three dots', info: 'circled i', comment: 'speech bubble', cut: 'scissors',
    image: 'picture', bookmark: 'bookmark', send: 'paper plane', paperclip: 'paper clip', clock: 'clock', cloud: 'cloud',
    check: 'check mark', globe: 'globe', cart: 'shopping cart', pause: 'two vertical bars', moon: 'crescent moon', sun: 'sun',
    logout: 'arrow leaving a door', grid: 'four squares', camera: 'camera',
  };
  // Label -> icon for app menus (first match wins).
  const ICON_RULES = [[/^(new|add|create)\b/i, 'plus'], [/^(open|browse)\b|folder/i, 'folder'], [/^save\b/i, 'disk'],
    [/print/i, 'print'], [/delete|trash|remove/i, 'trash'], [/settings|preferences|options/i, 'gear'],
    [/favou?rite|^star/i, 'star'], [/zoom in/i, 'zoomin'], [/zoom out/i, 'zoomout'], [/^play\b/i, 'play'],
    [/^stop\b/i, 'stop'], [/^next\b/i, 'next'], [/^prev/i, 'prev'], [/mail|inbox|message/i, 'mail'],
    [/alert|notification/i, 'bell'], [/profile|account|contact/i, 'user'], [/security|lock|permission/i, 'lock'],
    [/^home\b/i, 'home'], [/\blike\b/i, 'heart'], [/duplicate|^copy\b/i, 'copy'], [/rename|^edit\b/i, 'pencil'],
    [/find|search/i, 'search'], [/download|export/i, 'download'], [/upload|import/i, 'upload'], [/share/i, 'share'],
    [/\blink\b/i, 'link'], [/archive/i, 'archive'], [/label|\btag/i, 'tag'], [/\bpin\b/i, 'pin'],
    [/flag|report/i, 'flag'], [/refresh|reload|sync/i, 'refresh'], [/^undo\b/i, 'undo'], [/^redo\b/i, 'redo'],
    [/^bold\b/i, 'bold'], [/^italic/i, 'italic'], [/bullet|^list\b/i, 'list'], [/calendar|schedule/i, 'calendar'],
    [/filter/i, 'filter'], [/preview|^show\b|^view\b/i, 'eye'], [/comment/i, 'comment'], [/^cut\b/i, 'cut'],
    [/image|picture|photo/i, 'image'], [/bookmark/i, 'bookmark'], [/info|properties|details/i, 'info']];

  const C = env.content;
  const STOP = new Set(['the', 'a', 'an', 'to', 'of', 'and', 'or', 'in', 'on', 'for', 'with', 'is', 'are', 'was', 'be',
    'you', 'your', 'we', 'our', 'it', 'this', 'that', 'at', 'by', 'from', 'as', 'if', 'i', 'will', 'can', 'has', 'have',
    'not', 'but', 'so', 'they', 'their', 'he', 'she', 'his', 'her', 'its', 'were', 'been', 'into', 'than', 'then', 'no']);

  const FOLDER_NAMES = ['Tax 2023', 'Invoices', 'Photos', 'Projects', 'Q3 reports', 'Contracts', 'Old drafts', 'Travel',
    'Receipts', 'Team shared', 'Marketing assets', 'Design', 'Archive 2022', 'Clients', 'Recordings', 'Templates',
    'Onboarding', 'Personal', 'Backups', 'Research', 'Meeting notes', 'Budget', 'Screenshots', 'Downloads',
    'Audio library', 'Product specs', 'Style guide', 'Legal review', 'Garden plans', 'Book club', 'Vendor quotes',
    'Bug triage', 'Remote setup', 'Data exports', 'Event signage', 'Fieldwork', 'Studio', 'North wing', 'Lesson plans',
    'Reading list', 'Camping gear', 'Bicycle maps', 'Plant journal', 'Pet records', 'Board games', 'Local history',
    'Science fair', 'Field guides', 'Garden tools', 'Guest room', 'Lunch menu', 'Craft fair', 'Mailing list',
    'Book reviews', 'Nature walks', 'Bakery orders', 'Family tree', 'Film nights', 'Repair log', 'Trail markers',
    'Puzzle night', 'Train routes', 'Shell studies', 'Clay samples', 'Fair exhibits', 'Farm visits', 'Star charts',
    'Canoe routes', 'Stage cues', 'Wood carvings', 'Antique fair', 'Lake levels'];

  const ordinal = (i) => ORD[i];
  const norm = (s) => String(s).toLowerCase().replace(/[…\.]+$/, '').trim();

  const buttonGroups = () => C.BUTTON_LABELS.map((g) => (Array.isArray(g) ? { intent: '', labels: g }
    : { intent: g.intent || g.id || '', labels: (g.labels || []).map((l) => (typeof l === 'string' ? l : l.label)).filter(Boolean) }))
    .filter((g) => g.labels.length);
  const allLabels = () => [...new Set(buttonGroups().flatMap((g) => g.labels))];
  const fieldLabels = () => C.FIELD_LABELS.map((f) => (typeof f === 'string' ? { label: f, aliases: [] }
    : { label: f.label, aliases: f.aliases || [], kind: f.kind })).filter((f) => f.label && f.label.length <= 22
      && !/select|checkbox|radio|toggle|textarea/.test(f.kind || ''));
  // Labels a site may use for its end control (env.content.END_LABELS): never a target, so an instruction
  // never names the end control; they still appear as distractors.
  const endish = (label) => /submit/i.test(label) || C.END_LABELS.some((l) => norm(l) === norm(label))
    || buttonGroups().some((g) => /^(submit|finish)$/.test(g.intent) && g.labels.some((l) => norm(l) === norm(label)));
  const iconFor = (label) => {
    for (const [re, name] of ICON_RULES) if (re.test(label)) return name;
    return null;
  };

  // A person's display name from people.js (csplit honored).
  function personName(rng, o) {
    return C.personName(rng, o).full;
  }
  function fileName(rng, o, ext) {
    return C.fileName(rng, ext, o);
  }
  function fileSize(rng, kind) {
    return C.fileSize(rng, kind);
  }

  // Points in [0, 1]^2 that pairwise differ by >= sep in x or y.
  function spread(rng, n, sep = 0.45) {
    for (let attempt = 0; attempt < 200; attempt++) {
      const pts = [];
      for (let k = 0; k < 60 && pts.length < n; k++) {
        const p = { x: +rng.float(0, 1).toFixed(3), y: +rng.float(0, 1).toFixed(3) };
        if (pts.every((q) => Math.abs(q.x - p.x) >= sep || Math.abs(q.y - p.y) >= sep)) pts.push(p);
      }
      if (pts.length === n) return pts;
    }
    const grid = [];
    for (let i = 0; i < n; i++) grid.push({ x: (i % 3) / 2, y: Math.floor(i / 3) / Math.max(1, Math.ceil(n / 3) - 1) });
    return rng.shuffle(grid);
  }

  // ---------------------------------------------------------------- text with links

  // Paragraph of real sentences as segments [{ text, link }]; about nLinks link phrases (spans inside a
  // sentence or link texts between sentences). used: Set of lower-cased link texts already taken.
  function para(rng, n, nLinks, o, used) {
    const groups = C.SENTENCE_GROUPS;
    const pool = groups[rng.pick(Object.keys(groups))];
    const sents = C.sample(rng, pool.filter((s) => s.length <= 150), n, o);
    const at = new Set(rng.sample([...sents.keys()], Math.min(sents.length, nLinks)));
    const segs = [];
    const linkTexts = C.LINK_TEXTS.filter((l) => l.length <= 34);
    sents.forEach((s, i) => {
      if (!at.has(i)) { segs.push({ text: s, link: false }); return; }
      if (rng.bool(0.55)) {
        const words = s.split(' ');
        const clean = (w) => /^[A-Za-z][A-Za-z0-9'’-]*$/.test(w);
        const cands = [];
        for (let len = 1; len <= 3; len++) {
          for (let j = 0; j + len <= words.length; j++) {
            const span = words.slice(j, j + len);
            if (!span.every(clean)) continue;
            if (span.some((w) => STOP.has(w.toLowerCase()))) continue;
            const t = span.join(' ');
            if (t.length < 4 || used.has(t.toLowerCase())) continue;
            cands.push([j, len]);
          }
        }
        if (cands.length) {
          const [j, len] = rng.pick(cands);
          const before = words.slice(0, j).join(' ');
          const link = words.slice(j, j + len).join(' ');
          const after = words.slice(j + len).join(' ');
          if (before) segs.push({ text: before, link: false });
          segs.push({ text: link, link: true });
          if (after) segs.push({ text: after, link: false });
          used.add(link.toLowerCase());
          return;
        }
      }
      segs.push({ text: s, link: false });
      const free = linkTexts.filter((l) => !used.has(l.toLowerCase()));
      if (free.length) {
        const l = C.pick(rng, free, o);
        used.add(l.toLowerCase());
        segs.push({ text: l, link: true });
      }
    });
    return segs;
  }

  // ---------------------------------------------------------------- sampling

  function fileItems(rng, n, o) {
    const items = [];
    const seen = new Set();
    while (items.length < n) {
      const folder = rng.bool(0.35);
      const name = folder ? C.pick(rng, FOLDER_NAMES, o) : fileName(rng, o);
      if (seen.has(name) || name.length > 34) continue;
      seen.add(name);
      const ext = folder ? '' : (name.match(/\.([a-z0-9]+)$/i) || ['', ''])[1].toLowerCase();
      items.push({ key: `f${items.length}`, name, kind: folder ? 'folder' : ext || 'file', size: folder ? `${rng.int(2, 60)} items` : fileSize(rng) });
    }
    return items;
  }

  // ---------------------------------------------------------------- hidden interactions (hover-menu, flyout, row-reveal)

  const DESTRUCTIVE = /delete|remove|trash|suspend|reset password/i;

  const rrActions = (spec) => spec.quick.concat(spec.more);

  // ---------------------------------------------------------------- difficulty ladder

  // opts.level 'easy' (lv 1) / 'medium' (lv 0.5): the sampled episode is pruned in place (fewer elements, tabs,
  // sections, items, rows, rungs; bigger targets; shorter hovers), drawing only from the 'level' fork, so normal
  // samples exactly what it always did. Targets and everything the instruction names always stay.
  // Indices of arr to keep: those where must(x, i) holds, plus `extra` more drawn from the rest.
  const keepIdxOf = (r, arr, must, extra) => env.util.keepIdx(r, arr.length, arr.flatMap((x, i) => (must(x, i) ? [i] : [])), extra);
  const pickIn = (r, arr, must, extra) => keepIdxOf(r, arr, must, extra).map((i) => arr[i]);

  // ---------------------------------------------------------------- dispatch: one object per scenario
  //
  // Each scenarios/<scenario>.js registers env.scenario('click-control', { name, ... }); the functions below call its hooks (all optional
  // unless noted; model, spec and rng as in the task contract):
  //   sample(rng, ctx) (required: the scenario's spec fields, ctx = { opts, o, ood }), baseModel(spec, c) (the untouched
  //   page's model; c = the click log every scenario keeps), level(spec, lv, r) (easy / medium pruning, in place)
  //   grading: correct(spec, key) (is a final-choice key right), ownError(model, spec) (a number: grading of its own, ahead
  //   of the pending-wrong check; undefined: use the common one), progress(model, spec) (error while no final choice was
  //   made), result(spec, key) (short text of a final choice), judgeError(model, spec) (like ownError, judge episodes)
  //   start modes: partial(spec), scene(spec, rng) (model patches), wrongFinal(spec, rng) -> { key, patch? } | null,
  //   wrongNav(spec, rng) -> patch | null
  //   oracle: planStep(model, spec) (the next step), solveDirect(m, spec) (a solved model without replaying the plan),
  //   settled(m) (tidy a solved model), tick(model, spec, dt, now, rng) (the scenario's clock)
  //   text and Round 2: phrase(spec, rng, P) -> { core, terse, steps } (the instruction), phKind(spec) (which phantom pool),
  //   facts(model, spec), retarget(spec, model, rng, out, other) (the new target; out = the copy of the spec)

  const V = env.scenariosOf('click-control');

  function levelAdjust(spec, lv, r) {
    return V[spec.scenario].level(spec, lv, r);
  }

  // ---------------------------------------------------------------- model helpers

  function walk(tree, fn) {
    for (const n of tree || []) {
      fn(n);
      walk(n.children, fn);
    }
  }
  function menuNode(spec, key) {
    let hit = null;
    walk(spec.tree, (n) => { if (n.key === key) hit = n; });
    return hit;
  }
  const menuAncestors = (key) => {
    const parts = key.split('>');
    return parts.slice(0, -1).map((_, i) => parts.slice(0, i + 1).join('>'));
  };
  // flyout by 'clue': a click on a node at the target's depth (a category) is a final choice, not navigation.
  const flyPick = (spec, key) => spec.scenario === 'flyout' && spec.by === 'clue'
    && String(key).split('>').length === spec.target.split('>').length;
  const blockWord = (blocks, key) => {
    const [b, i] = String(key).split('.').map(Number);
    return blocks[b] && blocks[b][i];
  };
  const blocksOf = (spec) => (spec.scenario === 'link' ? spec.blocks : spec.scenario === 'tab' ? spec.tabs.map((t) => t.words) : spec.sections.map((s) => s.words));
  const hasTarget = (wordsList, text) => wordsList.some((w) => w.link && w.text === text);
  const rowKey = (r, a) => `${r}|${a}`;

  // Is a final-choice key correct?
  function isCorrect(spec, key) {
    const h = V[spec.scenario].correct;
    if (h) return h(spec, key);
    return false;
  }

  function wordCorrect(spec, key) {
    const w = blockWord(blocksOf(spec), key);
    return !!w && w.link && w.text === spec.target;
  }

  function targetCorrect(spec, key) {
    return key === spec.target;
  }

  function rowCorrect(spec, key) {
    return key === rowKey(spec.target.row, spec.target.action);
  }

  function seqMatched(model, spec) {
    let k = 0;
    while (k < model.clicks.length && k < spec.order.length && model.clicks[k] === spec.order[k]) k++;
    return k;
  }

  // Wrong final choices currently in effect (pending until undone).
  function wrongKeys(model, spec) {
    if (spec.scenario === 'hover' || !model.clicks) return [];
    if (spec.scenario === 'sequence') return model.clicks.slice(seqMatched(model, spec));
    return model.clicks.filter((k) => !isCorrect(spec, k));
  }
  const pending = (model, spec) => wrongKeys(model, spec).length > 0;
  const strikes = (model, spec) => wrongKeys(model, spec).length + (model.undone || 0) - (model.planted || 0);

  // Undo / Back: drop the pending wrong choices, count them, restore what the wrong choice closed.
  function undoModel(model, spec) {
    const wk = wrongKeys(model, spec);
    if (!wk.length) return model;
    const m = { ...model, undone: (model.undone || 0) + wk.length };
    m.clicks = spec.scenario === 'sequence' ? model.clicks.slice(0, seqMatched(model, spec)) : model.clicks.filter((k) => !wk.includes(k));
    if (spec.scenario === 'dialog') m.open = true;
    return m;
  }

  // Short text for the result of a final choice (toasts / viewer headings).
  function resultText(spec, key) {
    const h = V[spec.scenario].result;
    if (h) return h(spec, key);
    return 'Done';
  }

  function wordResult(spec, key) {
    const w = blockWord(blocksOf(spec), key);
    return w ? w.text : '';
  }

  function menuResult(spec, key) {
    const n = menuNode(spec, key); return n ? `${n.label} selected` : 'Selected';
  }

  function menuProgress(model, spec) {
    const trig = spec.mode === 'button' || spec.mode === 'flyout';
    const need = (trig ? 1 : 0) + menuAncestors(spec.target).length;
    if (!need) return 0;
    let done = 0;
    if (trig) {
      if (model.path === null) return 0;
      done = 1;
    }
    const anc = menuAncestors(spec.target);
    for (let i = 0; i < anc.length && model.path && model.path[i] === anc[i]; i++) done++;
    return done / need;
  }

  function errorOf(model, spec) {
    if (spec.judge) return judgeError(model, spec);
const own = V[spec.scenario].ownError;
    if (own) {
      const e = own(model, spec);
      if (e !== undefined) return e;
    }
    if (pending(model, spec)) return spec.recoverable || model.planted ? 1 + PEN : 1;
    if (model.clicks.length) return 0;
    const h = V[spec.scenario].progress;
    if (h) return h(model, spec);
    return 1;
  }

  function menuProgressError(model, spec) {
    return 1 - 0.5 * menuProgress(model, spec);
  }

  function baseModel(spec) {
    const c = { clicks: [], undone: 0, planted: 0 };
    const h = V[spec.scenario].baseModel;
    if (h) return h(spec, c);
    return { ...c };
  }

  // A wrong final choice that start mode 'wrong' can plant: a key and the state it leaves behind.
  function wrongFinal(spec, rng) {
    const v = spec.scenario;
    const linkKeys = (blocks) => {
      const out = [];
      blocks.forEach((ws, b) => ws.forEach((w, i) => { if (w.link && w.text !== spec.target) out.push([b, `${b}.${i}`]); }));
      return out;
    };
    const h = V[spec.scenario].wrongFinal;
    if (h) return h(spec, rng, linkKeys);
    return null;
  }

  function menuWrongFinal(spec, rng, linkKeys) {
    // by 'clue': another category (a leaf click is wrong too, but a category is the plausible slip).
    const final = (n) => (spec.by === 'clue' ? flyPick(spec, n.key) : !n.children && !n.disabled);
    const ks = [];
    walk(spec.tree, (n) => { if (final(n) && n.key !== spec.target) ks.push(n.key); });
    return ks.length ? { key: rng.pick(ks) } : null;
  }

  // Wrong navigation (no final choice yet).
  function wrongNav(spec, rng) {
    const h = V[spec.scenario].wrongNav;
    if (h) return h(spec, rng);
    return null;
  }

  function partialPatch(spec) {
    const h = V[spec.scenario].partial;
    if (h) return h(spec);
    return null;
  }

  // scene: the reference screen's unsolved mid-task state. Menus open on the whole target path, a pie menu
  // expanded, a dialog open, a collapsible with its link section open (mode 'expand': another section
  // open instead), a tab holding the target link. No final choice is ever made. Scenarios without such a
  // screen return null (start like 'off').
  function scenePatch(spec, rng) {
    const h = V[spec.scenario].scene;
    if (h) return h(spec, rng);
    return null;
  }

  function initModel(spec, rng) {
    const m = baseModel(spec);
    if (spec.judge) return m; // impossible: the untouched page (start modes do not apply)
    const r = rng || new env.Rng(7);
    if (spec.startMode === 'scene') {
      const p = scenePatch(spec, r.fork('scene'));
      if (p) Object.assign(m, p);
    } else if (spec.startMode === 'partial') {
      const p = partialPatch(spec);
      if (p) Object.assign(m, p);
    } else if (spec.startMode === 'wrong') {
      const nav = wrongNav(spec, r.fork('nav'));
      const fin = wrongFinal(spec, r.fork('final'));
      if (fin && (!nav || spec.recoverable || r.bool(0.6))) {
        Object.assign(m, fin.patch || {});
        m.clicks = [fin.key];
        m.planted = 1;
        if (spec.scenario === 'sequence') m.clicks = [fin.key];
        if (spec.scenario === 'menu') m.path = spec.mode === 'button' ? null : [];
        if (spec.scenario === 'flyout') m.path = null;
      } else if (nav) Object.assign(m, nav);
    }
    return m;
  }

  // ---------------------------------------------------------------- plan / solve

  function firstLink(wordsList, text) {
    return wordsList.findIndex((w) => w.link && w.text === text);
  }

  function planOf(model, spec) {
    const v = spec.scenario;
    if (v !== 'hover' && pending(model, spec)) return { click: { undo: true } };
    if (errorOf(model, spec) === 0) return null;
    const h = V[v].planStep;
    if (h) return h(model, spec);
    return null;
  }

  function solveOf(spec, model) {
    const v = spec.scenario;
    let m = JSON.parse(JSON.stringify(model));
    if (v !== 'hover' && pending(m, spec)) m = undoModel(m, spec);
const direct = V[v].solveDirect;
    if (direct) {
      const s = direct(m, spec);
      if (s) return s;
    }
    // Final-choice scenarios: replay the plan in model terms.
    const trng = new env.Rng(1);
    for (let i = 0; i < 30 && errorOf(m, spec) > 0; i++) {
      const step = planOf(m, spec);
      if (!step) break;
      m = simulate(m, spec, step);
      if (step.move || step.wait) m = tickOf(m, spec, 1000, 0, trng);
    }
    // A solved start shows the result, not a pointer that is not there.
const settle = V[v].settled;
    return settle ? settle(m) : m;
  }

  function settledHover(m) {
    return { ...m, hover: null };
  }

  function settledMenu(m) {
    return { ...m, out: false, outMs: 0 };
  }

  // Model-space effect of one plan step, as the base widget implements it (selfTest, solve).
  function simulate(model, spec, step) {
    let m = JSON.parse(JSON.stringify(model));
    const v = spec.scenario;
    if (step.wait) return m;
    if (step.rightclick) {
      if (step.rightclick.item2 !== undefined) m.menuFor = step.rightclick.item2;
      return m;
    }
    if (step.dblclick) {
      const k = step.dblclick.item2;
      m.sel = k;
      m.clicks.push(k);
      return m;
    }
    const t = step.click || step.move;
    if (!t) return m;
    if (step.move) {
      if (t.shape !== undefined) m.over = t.shape;
      else if (t.tool !== undefined || t.tip !== undefined) {
        const k = t.tool ?? t.tip;
        if (m.hover !== k) Object.assign(m, { hover: k, hoverMs: 0, tip: null });
      } else if (t.row !== undefined) m.hover = t.row;
      else if (t.top !== undefined) Object.assign(m, { open: t.top, out: false, outMs: 0 });
      else if (t.trigger) Object.assign(m, { path: m.path === null ? [] : m.path, out: false, outMs: 0 });
      else if (t.item !== undefined) {
        const n = menuNode(spec, t.item);
        const anc = menuAncestors(t.item);
        if (n.children && !n.disabled) m.path = anc.concat([t.item]);
        if (v === 'flyout') Object.assign(m, { out: false, outMs: 0 });
      }
      return m;
    }
    if (t.undo) return undoModel(m, spec);
    if (t.blank) {
      if (v === 'context' || v === 'row-reveal') m.menuFor = null;
      return m;
    }
    if (t.nav !== undefined) {
      m.clicks.push(t.nav);
      m.open = null;
      return m;
    }
    if (t.top !== undefined) return Object.assign(m, { open: t.top, out: false, outMs: 0 });
    if (t.more !== undefined) return Object.assign(m, { hover: t.more, menuFor: t.more });
    if (t.mentry !== undefined) {
      if (m.menuFor !== null) m.clicks.push(rowKey(m.menuFor, t.mentry));
      m.menuFor = null;
      return m;
    }
    if (t.trigger && v === 'flyout') return Object.assign(m, { path: m.path === null ? [] : m.path, out: false, outMs: 0 });
    if (t.button !== undefined || t.link !== undefined || t.slice !== undefined || t.widget !== undefined || t.field !== undefined) {
      const key = t.button ?? t.link ?? t.slice ?? t.widget ?? t.field;
      m.clicks.push(key);
      if (v === 'pie') m.open = false;
    } else if (t.tool !== undefined || t.act !== undefined) {
      m.clicks.push(t.tool ?? t.act);
      if (t.tool !== undefined && m.hover !== t.tool) Object.assign(m, { hover: t.tool, hoverMs: 0, tip: null });
    } else if (t.action !== undefined) {
      m.hover = t.action[0];
      m.clicks.push(rowKey(t.action[0], t.action[1]));
    } else if (t.centry !== undefined) {
      if (m.menuFor !== null) m.clicks.push(rowKey(m.menuFor, t.centry));
      m.menuFor = null;
    } else if (t.item2 !== undefined) {
      m.sel = t.item2;
      if (v === 'context') m.menuFor = null;
    } else if (t.openbtn) {
      if (m.sel !== null) m.clicks.push(m.sel);
    } else if (t.tab !== undefined) m.active = t.tab;
    else if (t.trigger) m.path = m.path === null ? [] : null;
    else if (t.item !== undefined) {
      const n = menuNode(spec, t.item);
      const anc = menuAncestors(t.item);
      if (n.children && !flyPick(spec, t.item)) m.path = anc.concat([t.item]);
      else if (!n.disabled) {
        m.clicks.push(t.item);
        m.path = spec.mode === 'button' || v === 'flyout' ? null : [];
      }
    } else if (t.section !== undefined) {
      m.open = m.open.includes(t.section) ? m.open.filter((i) => i !== t.section) : [t.section];
    } else if (t.opener) m.open = true;
    else if (t.dialog !== undefined) {
      m.clicks.push(t.dialog);
      m.open = false;
    } else if (t.pie) m.open = true;
    return m;
  }

  function tickOf(model, spec, dt, now, rng) {
    const v = spec.scenario;
const tick = V[v].tick;
    if (tick) return tick(model, spec, dt, now, rng);
    return model;
  }

  // ---------------------------------------------------------------- instructions

  function instructionOf(spec, rng) {
    const I = env.instruct;
    const P = (list, vars) => I.phrase(rng, list, vars, spec.isplit);
    if (spec.judge) return I.say(rng, P(spec.judge.templates, spec.judge.vars), { isplit: spec.isplit });
    let core;
    let terse;
    let steps;
    const h = V[spec.scenario].phrase;
    if (h) ({ core, terse, steps } = h(spec, rng, P));
    else core = '';
    return I.say(rng, core, { isplit: spec.isplit, terse, steps });
  }

  // ---------------------------------------------------------------- round 2: judge mode impossible, facts, silent, retarget

  // Error of a judge=impossible episode: 0 while the page is as it started, 1 once a final choice (or the
  // navigation a task of that kind would end with) was made.
  function judgeError(model, spec) {
const own = V[spec.scenario].judgeError;
    if (own) {
      const e = own(model, spec);
      if (e !== undefined) return e;
    }
    return model.clicks && model.clicks.length ? 1 : 0;
  }

  // facts: the target row's other cells (rows, row-reveal: every widget shows them as table cells, and they stay
  // on the page after the action). Other scenarios have nothing to read back off the page: [].
  function factsOf(model, spec) {
if (spec.judge) return [];
    const f = V[spec.scenario].facts;
    return f ? f(model, spec) : [];
  }

  function rowFacts(model, spec) {
    const row = spec.rows.find((r) => r.key === spec.target.row);
    const out = [];
    spec.columns.forEach((c, i) => {
      if (i > 0 && row.cells[i] !== undefined && row.cells[i] !== '') out.push({ label: c, value: String(row.cells[i]), labels: [c.toLowerCase()] });
    });
    return out.slice(0, 3);
  }

  // silent: the correct final click (or tab switch / section expand) did not register; the page shows the state
  // from before it. Fixable by clicking again. Navigation steps (opening menus, hovering) are left alone.
  function silentOf(next, prev, spec, rng) {
    if (spec.judge || !next || !prev || spec.scenario === 'hover') return null;
    const C = env.util.clone;
    let out = null;
    if (spec.scenario === 'tab' && spec.mode === 'tab') {
      if (next.active === spec.target && prev.active !== spec.target) out = { ...C(next), active: prev.active };
    } else if (spec.scenario === 'collapsible' && spec.mode === 'expand') {
      if (next.open.includes(spec.target) && !prev.open.includes(spec.target)) out = { ...C(next), open: prev.open.slice() };
    } else if (next.clicks && prev.clicks && next.clicks.length === prev.clicks.length + 1) {
      const k = next.clicks[next.clicks.length - 1];
      const ok = spec.scenario === 'sequence' ? seqMatched(next, spec) > seqMatched(prev, spec) : isCorrect(spec, k);
      if (ok) out = { ...C(next), clicks: next.clicks.slice(0, -1) };
    }
    return out && errorOf(out, spec) > 0 ? out : null;
  }

  const leafKeysOf = (nodes) => nodes.flatMap((n) => (n.children ? leafKeysOf(n.children) : n.disabled ? [] : [n.key]));
  const linkTexts = (wordsList) => {
    const all = wordsList.flat().filter((w) => w.link).map((w) => w.text);
    return all.filter((t) => all.indexOf(t) === all.lastIndexOf(t));
  };

  // retarget: another target in the same scene (same items, only the goal fields change). Null once a final
  // choice was made (it would turn into a pending wrong choice) and for hover, sequence and tooltip-inspect.
  function retargetOf(spec, model, rng) {
    const v = spec.scenario;
    if (spec.judge || ['hover', 'sequence', 'tooltip-inspect'].includes(v)) return null;
    if (model.clicks && model.clicks.length) return null;
    const out = env.util.clone(spec);
    const other = (list, cur) => {
      const c = list.filter((x) => JSON.stringify(x) !== JSON.stringify(cur));
      return c.length ? rng.pick(c) : null;
    };
    let t = null;
    const h = V[v].retarget;
    if (h) t = h(spec, model, rng, out, other);
    else return null;
    if (t === null) return null;
    out.target = t;
    if (!(errorOf(model, out) > 0)) return null;
    return out;
  }

  function rowRetarget(spec, model, rng, out, other) {
    const r = other(spec.rows.map((x) => x.key), spec.target.row);
    return r === null ? null : { row: r, action: spec.target.action };
  }

  // ---------------------------------------------------------------- task

  const SCENARIOS = ['button', 'sequence', 'link', 'tab', 'menu', 'collapsible', 'dialog', 'pie', 'widget', 'focus', 'hover',
    'tooltip-inspect', 'rows', 'context', 'open', 'hover-menu', 'flyout', 'row-reveal'];

  env.task({
    name: 'click-control',
    scenarios: SCENARIOS,
    files: ['instructions.js', 'judge.js', 'scenarios/button.js', 'scenarios/sequence.js', 'scenarios/link.js', 'scenarios/tab.js', 'scenarios/menu.js',
      'scenarios/collapsible.js', 'scenarios/dialog.js', 'scenarios/pie.js', 'scenarios/widget.js', 'scenarios/focus.js',
      'scenarios/hover.js', 'scenarios/tooltip-inspect.js', 'scenarios/rows.js', 'scenarios/context.js',
      'scenarios/open.js', 'scenarios/hover-menu.js', 'scenarios/flyout.js'],
    lib: { allLabels, buttonGroups, endish, fieldLabels, fileItems, fileName, fileSize, firstLink, hasTarget,
      iconFor, ICONS, keepIdxOf, leafKeysOf, linkTexts, menuAncestors, menuNode, menuProgressError, menuResult,
      menuWrongFinal, norm, NUMBERS, ordinal, para, partialPatch, PEN, personName, pickIn, rowCorrect, rowFacts,
      rowKey, rowRetarget, rrActions, seqMatched, settledHover, settledMenu, spread, targetCorrect, walk, simulate,
      WIDGET_NAMES, wordCorrect, wordResult },
    startModes: ['off', 'partial', 'wrong', 'solved', 'scene'],
    inputs: ['pointer'],
    judgeModes: ['impossible'],
    tickMs: 50,
    facts: factsOf,
    silent: silentOf,
    retarget: retargetOf,

    helpers: { pending, wrongKeys, undoModel, resultText, flyPick },

    sample(rng, opts) {
      const list = opts.scenarios && opts.scenarios.length ? opts.scenarios : this.scenarios;
      const scenario = opts.scenario || rng.pick(list);
      const base = { scenario, isplit: opts.isplit || 'train', csplit: opts.csplit || 'train', ood: !!opts.ood,
        startMode: opts.startMode || 'off' };
      const ctx = { opts, o: { csplit: base.csplit }, ood: base.ood };
      const spec = { ...base, ...V[scenario].sample(rng, ctx) };
      spec.recoverable = opts.recover === true || opts.recover === false ? opts.recover : rng.fork('recover').bool(0.5);
      if (scenario === 'hover') spec.hl0 = rng.int(0, spec.shapes.length - 1);
      const lv = opts.level === 'easy' ? 1 : opts.level === 'medium' ? 0.5 : 0;
      if (lv) {
        levelAdjust(spec, lv, rng.fork('level'));
        if (scenario === 'hover') spec.hl0 = Math.min(spec.hl0, spec.shapes.length - 1);
      }
      if (this.judgeModes.includes(opts.judge)) {
        const j = this.lib.judgeOf(rng.fork('judge'), spec);
        if (j) spec.judge = j;
      }
      return spec;
    },

    init: initModel,
    error: errorOf,

    tolerance(spec) {
      return spec.scenario === 'hover' ? { tau: 0, sigma: 1.5, minInitialError: 0.5 } : { tau: 0, sigma: 0.5, minInitialError: 0.25 };
    },

    instruction: instructionOf,
    plan: planOf,
    solve: solveOf,
    tick: tickOf,
    ended(model, spec) {
      if (spec.scenario === 'hover' || !pending(model, spec)) return null;
      if (strikes(model, spec) < (spec.recoverable ? 2 : 1)) return null;
      return spec.scenario === 'sequence' ? 'wrong-press' : 'wrong-choice';
    },
  });
})();
