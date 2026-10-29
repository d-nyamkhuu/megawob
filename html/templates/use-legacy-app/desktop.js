/*
 * use-legacy-app/desktop: native desktop record workbench, transaction client and property sheets.
 * Scenarios: swing, sapgui, win95. Scenario presets: none; spec.scenario selects the shared widget configuration.
 * With design: {} reproduces each scaffold exactly:
 *   swing: design-use-legacy-app-swing-01.
 *   sapgui: design-use-legacy-app-sapgui-01.
 *   win95: design-use-legacy-app-win95-01.
 * Tokens (defaults):
 *   font: desktop font stack; 'Tahoma,Arial,sans-serif'.
 *   fontSize: base font size in px; 12.
 *   monoFont: monospaced font stack; "'Courier New',monospace".
 *   shadow: frame shadow; '0 10px 28px #0003'.
 *   treeWidth: navigator width in px before responsive rules; 174.
 *   inputWidth: desktop input width in px; 148.
 *   inputHeight: desktop input height in px; 21.
 *   labelWidth: desktop label width in px; 94.
 *   inset: space subtracted from each stage dimension in px; 24.
 *   minWidth: minimum frame width in px; 200.
 *   minHeight: minimum frame height in px; 180.
 *   maxWidth: maximum frame width in px; 1320.
 *   maxHeight: maximum frame height in px; 740.
 *   shortHeight: short-layout threshold in px; 460.
 *   compactHeight: compact-layout threshold in px; 570.
 *   narrowWidth: narrow-layout threshold in px; 850.
 *   inspectorWidth: inspector visibility threshold in px; 1180.
 *   icons: SVG path table in _assets (replaced whole).
 *   titles: window titles by scenario; the Harbor session/client names in TOKENS below (replaced whole).
 *   extraCSS: CSS appended after structural rules; ''.
 *   hostBackground: host color; '#07110b'.
 *   hostText: host color; '#83e69a'.
 *   hostBright: host color; '#c8ffca'.
 *   hostCyan: host color; '#79d9d9'.
 *   hostInputText: host color; '#e2ffe7'.
 *   hostInputBackground: host color; '#102b1a'.
 *   hostCaret: host color; '#b6ffbd'.
 *   hostFocus: host color; '#1c4228'.
 *   hostSelection: host color; '#92d89f'.
 *   columns: directory column labels in fixed data order; #, Record, Owner, Cost ctr, City, Status, Open balance, Batch.
 *   tabNames: three tab labels per scenario; see TOKENS below (replaced whole).
 *   commandWidth: transaction command input width in px; 122.
 *   smallTreeWidth: navigator width below a 610px frame in px; 112.
 * Parts (overrides are (base, S) => replacement; calls go through P):
 *   begin(ctx) -> void: install structural CSS before drawing.
 *   fit(ctx) -> {W,H}: stage-based frame dimensions in px.
 *   frame(ctx) -> element: create root, size it and set responsive classes/aria-label.
 *   icon(kind, parent) -> svg: 16px path icon from D.icons.
 *   title(ctx) -> void: title, app icon and window glyphs.
 *   update(model) -> void: update model and repaint when built.
 *   commit() -> void: flag confirmation, then save through the task.
 *   patch(p) -> void: merge model fields and call P.update.
 *   button(parent, label, action, cls = 'lg-btn') -> button: typed local button with click binding.
 *   iconButton(parent, label, kind, action, only = false) -> button: P.button with P.icon and optional label.
 *   menuFrame(ctx) -> void: create menu and hidden popup before the dialog.
 *   helpDialog(ctx) -> void: value help dialog, choices, instructions and close button.
 *   helpOption(parent, c) -> void: register one cost-center choice with edit binding.
 *   menu(ctx) -> void: desktop menu and popup entry bindings.
 *   toolbar(ctx) -> void: transaction command, save and utility controls.
 *   breadcrumb(ctx) -> void: workspace breadcrumb and session identity.
 *   workspace(ctx) -> void: create els.work for the navigator/main/inspector columns.
 *   navigator(ctx) -> void: object tree, subitems and connection note.
 *   treeItem(label, kind, action, cls = '') -> button: one tree item through P.button and P.icon.
 *   main(ctx) -> void: create els.main for search/directory/editor content.
 *   heading(ctx) -> void: customer heading and object count.
 *   search(ctx) -> void: key field and Display control, including focus/edit bindings.
 *   directory(ctx) -> void: scrollable table, P.record rows and selection count.
 *   record(tbody, r, i) -> void: directory row, record button, cost ref and load bindings.
 *   editor(ctx) -> void: editor frame, tab strip, sheet and three P.tab panes.
 *   tab(ctx, t) -> void: one tab/pane, editable group and protected groups; register tabs/panes.
 *   field(ctx, group, f) -> void: labeled native field, edit/focus bindings, spinner/value help and note.
 *   spinner(inputParent, f) -> void: retry up/down controls clamped to 1-99.
 *   protectedRow(parent, label, text) -> element: protected value span in a labeled row.
 *   welcome(ctx) -> void: field message, transaction welcome/closed panels and receipt.
 *   inspector(ctx) -> void: object metadata, notifications and related records.
 *   notification(parent, kind, text) -> void: inspector message with icon.
 *   dock(ctx) -> void: Messages/Jobs/Change history tabs and log panel.
 *   actions(ctx) -> void: Save/Apply, optional OK, and Cancel with task save/cancel bindings.
 *   status(ctx) -> void: status, active key and insert-mode indicator.
 *   transact() -> void: execute command, retrieve key or commit according to focus.
 *   sync(m) -> void: mirror the desktop model to panels, rows, fields, metadata, log and help.
 *   keydown(e) -> void: guarded Esc, save, value help, about and transaction shortcuts.
 *   ready(ctx) -> void: expose directory/sheet refs and set very narrow navigator width.
 *   build(ctx) -> void: assemble widget panels in reference DOM order.
 *   rendered(ctx) -> void: decoration hook after initial sync; default no-op.
 *   locate(t) -> [x,y]: read target geometry; throw if target is absent/hidden.
 * State: S.ctx/spec/root/geo/refs/inputs/tabs/recordButtons/D/P read the live page.
 * S.geo = {W,H} is writable; S.els exposes writable panel references:
 *   menu, pop, helpLayer, helpTitle, helpChoices, helpText, toolsHint, work, tree, treeChildren, main, searchRow, key, directory, rowNodes, count, editor, tabstrip, panes, sheet, empty, closed, audit, info, dockButtons.
 * Replacement builders must register the same refs/inputs/tabs and els needed by sync/locate.
 * Colors not tokenized here inherit the site variables --bg, --fg, --panel, --line, --muted, --accent.
 * No rng draws in this widget. Keep that stream unchanged; extra decoration uses ctx.rng.fork(label).
 * Shared icons and structural CSS live in use-legacy-app/_assets; installers keep each part overridable.
 * All DOM work occurs during render; state and the key listener belong to this factory instance.
 */
(function () {
  'use strict';

  function tokenDefaults(ICONS) {
    return {
      font: 'Tahoma,Arial,sans-serif',
      fontSize: 12,
      monoFont: "'Courier New',monospace",
      shadow: '0 10px 28px #0003',
      treeWidth: 174,
      inputWidth: 148,
      inputHeight: 21,
      labelWidth: 94,
      inset: 24,
      minWidth: 200,
      minHeight: 180,
      maxWidth: 1320,
      maxHeight: 740,
      shortHeight: 460,
      compactHeight: 570,
      narrowWidth: 850,
      inspectorWidth: 1180,
      icons: ICONS,
      titles: { mainframe: 'A - HBRPROD - Harbor 5250', 'mainframe-lookup': 'B - HBRPROD - Account Inquiry',
        swing: 'Harbor Operations Console — Record Manager', sapgui: 'Harbor Enterprise Client — Production / 100', win95: 'Record Properties — Harbor Service Manager' },
      extraCSS: '',
      hostBackground: '#07110b',
      hostText: '#83e69a',
      hostBright: '#c8ffca',
      hostCyan: '#79d9d9',
      hostInputText: '#e2ffe7',
      hostInputBackground: '#102b1a',
      hostCaret: '#b6ffbd',
      hostFocus: '#1c4228',
      hostSelection: '#92d89f',
      columns: ['#', 'Record', 'Owner', 'Cost ctr', 'City', 'Status', 'Open balance', 'Batch'],
      tabNames: { swing: ['Account', 'Routing', 'Processing'], sapgui: ['Basic data', 'Control data', 'Processing'], win95: ['General', 'Connection', 'Recovery'] },
      commandWidth: 122,
      smallTreeWidth: 112,
    };
  }

  function installFrameParts(BASE, page) {
    BASE.begin = (ctx) => {
      ctx.css('app-legacy-classic', page.CSS(page.D) + page.D.extraCSS);
    };

    BASE.fit = (ctx) => {
      return { W: Math.max(page.D.minWidth, Math.min(ctx.size.width - page.D.inset, page.D.maxWidth)),
        H: Math.max(page.D.minHeight, Math.min(ctx.size.height - page.D.inset, page.D.maxHeight)) };
    };

    BASE.frame = (ctx) => {
      page.root = page.el('section', `lg${page.s.scenario === 'sapgui' ? ' lg-sap' : page.s.scenario === 'win95' ? ' lg-win' : ''}`, ctx.stage);
      ({ W: page.W, H: page.H } = page.P.fit(ctx));
      page.root.style.width = `${page.W}px`; page.root.style.height = `${page.H}px`;
      page.root.classList.toggle('lg-short', page.H < page.D.shortHeight); page.root.classList.toggle('lg-compact', page.H < page.D.compactHeight); page.root.classList.toggle('lg-narrow', page.W < page.D.narrowWidth); page.root.classList.toggle('lg-with-inspector', page.W >= page.D.inspectorWidth);
      page.root.setAttribute('aria-label', 'Enterprise record maintenance');
      return page.root;
    };

    BASE.icon = (kind, parent) => {
      const svg = page.ctx.util.svg('svg', { viewBox: '0 0 16 16', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.3', 'aria-hidden': 'true' }, parent);
      page.ctx.util.svg('path', { d: page.D.icons[kind] || page.D.icons.file }, svg); return svg;
    };

    BASE.title = (ctx) => {
      const title = page.el('div', 'lg-title', page.root);
      const titleText = page.el('span', '', title); page.P.icon(page.s.scenario === 'win95' ? 'file' : 'grid', titleText);
      page.el('span', '', titleText, page.D.titles[page.s.scenario]);
      const windowButtons = page.el('span', 'lg-sys', title);
      for (const name of ['min', 'max', 'close']) page.P.icon(name, windowButtons);
    };

    BASE.update = (model) => {
      page.ctx.update(model); if (page.ready) page.P.sync(page.ctx.model);
    };

    BASE.commit = () => {
      if (page.s.judge && page.s.judge.mode === 'confirm') page.ctx.flag('irreversible');
      page.P.update(page.F.save(page.ctx.model, page.s));
    };

    BASE.patch = (p) => {
      page.P.update({ ...page.ctx.model, ...p });
    };

    BASE.button = (parent, label, action, cls = 'lg-btn') => {
      const b = page.el('button', cls, parent, label); b.type = 'button';
      if (action) b.addEventListener('click', action); return b;
    };

    BASE.iconButton = (parent, label, kind, action, only = false) => {
      const b = page.P.button(parent, '', action, `lg-btn lg-icon-button${only ? ' lg-icon-only' : ''}`);
      b.setAttribute('aria-label', label); b.title = label; page.P.icon(kind, b);
      if (!only) page.el('span', '', b, label); return b;
    };

    BASE.menuFrame = (ctx) => {
      page.menu = page.el('div', 'lg-menu', page.root); page.pop = page.el('div', 'lg-pop', page.root); page.pop.hidden = true;
    };

    BASE.helpDialog = (ctx) => {
      page.helpLayer = page.el('div', 'lg-help', page.root); page.helpLayer.hidden = true;
      const helpBox = page.el('div', 'lg-dialog', page.helpLayer);
      page.helpTitle = page.el('h3', '', helpBox, 'Value help — Cost center');
      const helpBody = page.el('div', 'lg-dialog-body', helpBox);
      page.helpChoices = page.el('div', '', helpBody);
      for (const c of page.s.centers) page.P.helpOption(page.helpChoices, c);
      page.helpText = page.el('p', '', helpBody, 'Choose a record in the directory. Use tabs to edit its properties. Save stores the current record; Cancel restores the saved values.');
      page.P.button(helpBody, 'Close (Esc)', () => page.P.patch({ help: false }));
    };

    BASE.helpOption = (parent, c) => {
      page.refs[`option:${c.code}`] = page.P.button(parent, `${c.code}  ${c.label}`, () => {
        page.P.update({ ...page.F.edit(page.ctx.model, page.s, 'cost', c.code), help: false });
      });
    };

    BASE.menu = (ctx) => {
      for (const label of ['File', 'Edit', 'View', ...(page.s.scenario === 'sapgui' ? ['System'] : ['Tools', 'Window']), 'Help']) page.P.button(page.menu, label, () => {
        if (label === 'Help') return page.P.patch({ help: 'about' });
        const opening = page.pop.hidden || page.pop.dataset.menu !== label;
        page.pop.replaceChildren(); page.pop.dataset.menu = label; page.pop.hidden = !opening;
        const entries = label === 'File' ? [['Save record    Ctrl+S', page.P.commit], ['Discard changes', () => page.P.update(page.F.cancel(ctx.model))], ['Print preview', () => page.P.patch({ help: 'about' })]]
          : label === 'Edit' ? [['Undo changes', () => page.P.update(page.F.cancel(ctx.model))], ['Find record', () => page.key.focus()]]
            : label === 'View' ? [['Customer navigator', () => page.P.patch({ tree: !ctx.model.tree })], ['Messages', () => page.P.patch({ dock: 'Messages' })], ['Job monitor', () => page.P.patch({ dock: 'Jobs' })]]
              : [['Session information', () => page.P.patch({ help: 'about' })], ['System messages', () => page.P.patch({ dock: 'Messages' })]];
        for (const [text, action] of entries) page.P.button(page.pop, text, () => { page.pop.hidden = true; action(); }, '');
      }, '');
    };
  }

  function installDirectoryParts(BASE, page) {
    BASE.toolbar = (ctx) => {
      const tools = page.el('div', 'lg-tools', page.root);
      if (page.s.scenario === 'sapgui') {
        page.P.iconButton(tools, 'Execute', 'check', () => page.P.transact(), true);
        page.el('label', '', tools, 'Command');
        const command = page.el('input', 'lg-input', tools); command.setAttribute('aria-label', 'Transaction command');
        command.style.width = `${page.D.commandWidth}px`; page.refs.command = command;
        command.addEventListener('input', () => page.P.update(page.F.edit(ctx.model, page.s, 'command', command.value)));
        command.addEventListener('focus', () => { if (ctx.model.focus !== 'command') page.P.update(page.F.setFocus(ctx.model, 'command')); });
        page.el('span', 'lg-sep', tools);
      }
      page.refs.saveTool = page.P.iconButton(tools, 'Save', 'save', page.P.commit);
      page.P.iconButton(tools, 'Back', 'back', () => page.P.update(page.F.cancel(ctx.model)), true);
      page.P.iconButton(tools, 'Refresh', 'refresh', () => page.P.update(page.F.cancel(ctx.model)), true);
      page.el('span', 'lg-sep', tools);
      page.P.iconButton(tools, 'Find record', 'search', () => page.key.focus(), true);
      page.P.iconButton(tools, 'Print preview', 'print', () => page.P.patch({ help: 'about' }), true);
      page.P.iconButton(tools, 'Help', 'help', () => page.P.patch({ help: 'about' }), true);
      page.toolsHint = page.el('span', 'lg-small', tools, page.s.scenario === 'sapgui' ? 'Ctrl+S   F4 Help' : 'Record workspace');
    };

    BASE.breadcrumb = (ctx) => {
      const breadcrumb = page.el('div', 'lg-breadcrumb', page.root);
      page.P.icon(page.s.scenario === 'sapgui' ? 'folder' : 'tree', breadcrumb);
      page.el('span', '', breadcrumb, page.s.scenario === 'sapgui' ? 'Harbor Easy Access / Logistics / Customer master' : page.s.scenario === 'win95' ? 'Harbor Service Manager / Local computer / Customer services' : 'Workspace / Production / Customer master');
      page.el('span', '', breadcrumb, 'HBRPROD  |  Client 100  |  OPS042');
    };

    BASE.workspace = (ctx) => {
      page.work = page.el('div', 'lg-work', page.root);
    };

    BASE.navigator = (ctx) => {
      page.tree = page.el('nav', 'lg-tree', page.work); page.tree.setAttribute('aria-label', 'Object navigator');
      const navHead = page.el('div', 'lg-pane-title', page.tree, page.s.scenario === 'sapgui' ? 'Application menu' : page.s.scenario === 'win95' ? 'Console tree' : 'Connections');
      page.P.icon('tree', navHead);

      page.P.treeItem('HBRPROD (100)', 'down', () => page.P.patch({ tree: !ctx.model.tree }));
      page.P.treeItem('Favorites', 'folder', () => page.P.patch({ dock: 'Favorites' }), 'lg-tree-child');
      page.P.treeItem('Recent objects', 'clock', () => page.P.patch({ dock: 'Recent objects' }), 'lg-tree-child');
      page.refs.tree = page.P.button(page.tree, '', () => page.P.patch({ tree: !ctx.model.tree }), 'lg-tree-child');
      page.refs.treeToggle = page.P.icon('right', page.refs.tree); page.P.icon('folder', page.refs.tree); page.el('span', '', page.refs.tree, 'Customer records');
      page.treeChildren = page.el('div', '', page.tree);
      for (const [text, action] of [['Active accounts', () => page.P.patch({ tree: true })], ['Held accounts', () => page.P.patch({ dock: 'Held accounts' })], ['Archive / 2025', () => page.P.patch({ dock: 'Archive' })]]) {
        const b = page.P.button(page.treeChildren, '', action, 'lg-tree-grandchild'); page.P.icon('grid', b); page.el('span', '', b, text);
      }
      for (const text of ['Orders and invoices', 'Credit management', 'Payment allocations', 'Reference tables', 'Batch monitor (3)', 'Print spool (12)', 'System messages (2)']) {
        page.P.treeItem(text, text.includes('messages') ? 'warn' : 'folder', () => page.P.patch({ dock: text }), 'lg-tree-child');
      }
      page.el('div', 'lg-pane-title', page.tree, 'Other workspaces');
      for (const r of page.s.records.slice(1, 5)) page.P.treeItem(r.company.slice(0, 19), 'folder', () => page.P.patch({ help: 'about' }));
      page.el('div', 'lg-note', page.tree, 'Connection: Production / CUST_MAINT / TLS');
    };

    BASE.treeItem = (label, kind, action, cls = '') => {
      const b = page.P.button(page.tree, '', action, cls); page.P.icon(kind, b); page.el('span', '', b, label); return b;
    };

    BASE.main = (ctx) => {
      page.main = page.el('div', 'lg-main', page.work);
    };

    BASE.heading = (ctx) => {
      const heading = page.el('div', 'lg-heading', page.main);
      page.refs.heading = page.el('strong', '', heading, 'Customer records');
      page.el('span', 'lg-small', heading, `${page.s.records.length} objects`);
    };

    BASE.search = (ctx) => {
      page.searchRow = page.el('div', 'lg-row', page.main);
      page.el('label', '', page.searchRow, 'Record key');
      page.key = page.el('input', 'lg-input', page.searchRow); page.refs.key = page.key; page.key.setAttribute('aria-label', 'Record key');
      page.key.addEventListener('input', () => page.P.update(page.F.edit(ctx.model, page.s, 'key', page.key.value)));
      page.key.addEventListener('focus', () => { if (ctx.model.focus !== 'key') page.P.update(page.F.setFocus(ctx.model, 'key')); });
      page.refs.open = page.P.button(page.searchRow, 'Display', () => page.P.update(page.F.load(ctx.model, page.s, page.s.records.findIndex((r) => r.key === ctx.model.key))));
    };

    BASE.directory = (ctx) => {
      page.directory = page.el('div', 'lg-grid', page.main);
      const table = page.el('table', '', page.directory); const thead = page.el('thead', '', table), tr = page.el('tr', '', thead);
      for (const label of page.D.columns) page.el('th', '', tr, label);
      const tbody = page.el('tbody', '', table); page.rowNodes = {};
      page.s.records.forEach((r, i) => page.P.record(tbody, r, i));
      page.count = page.el('div', 'lg-record-count', page.main);
      page.refs.count = page.el('span', '', page.count); page.el('span', '', page.count, 'Selection: All active  |  Sort: Record key');
    };

    BASE.record = (tbody, r, i) => {
      const row = page.el('tr', '', tbody); page.rowNodes[i] = row;
      page.el('td', 'lg-table-num', row, String(i + 1));
      const td = page.el('td', '', row);
      page.recordButtons[i] = page.P.button(td, r.key, () => page.P.update({ ...page.F.load(page.ctx.model, page.s, i), tree: true }), '');
      page.el('td', '', row, r.owner); page.refs[`cost:${i}`] = page.el('td', '', row, r.base.cost); page.el('td', '', row, r.city);
      page.el('td', '', row, i % 7 === 3 ? 'Review' : 'Active'); page.el('td', 'lg-table-num', row, page.F.fmtAmount(r, page.s)); page.el('td', '', row, r.batch);
      row.addEventListener('click', (e) => { if (e.target.tagName !== 'BUTTON') page.P.update({ ...page.F.load(page.ctx.model, page.s, i), tree: true }); });
    };
  }

  function installEditorParts(BASE, page) {
    BASE.editor = (ctx) => {
      page.editor = page.el('div', 'lg-editor', page.main);
      const editorTitle = page.el('div', 'lg-editor-title', page.editor); page.P.icon(page.s.scenario === 'win95' ? 'file' : 'grid', editorTitle);
      page.refs.editorTitle = page.el('span', '', editorTitle); page.el('span', '', editorTitle, page.s.scenario === 'win95' ? 'Properties - Local configuration' : 'Change mode / Protected fields shaded');
      page.tabstrip = page.el('div', 'lg-tabs', page.editor);
      page.tabstrip.setAttribute('role', 'tablist');
      page.panes = {};
      page.sheet = page.el('div', 'lg-sheet', page.editor);
      for (let t = 0; t < 3; t++) page.P.tab(ctx, t);
    };

    BASE.tab = (ctx, t) => {
      page.tabs[t] = page.P.button(page.tabstrip, page.D.tabNames[page.s.scenario][t], () => { page.P.patch({ tab: t }); page.sheet.scrollTop = 0; }, 'lg-tab'); page.tabs[t].setAttribute('role', 'tab');
      const pane = page.el('div', '', page.sheet); page.panes[t] = pane;
      const columns = page.el('div', 'lg-form-columns', pane);
      const group = page.el('fieldset', 'lg-group', columns); page.el('legend', '', group, t === 0 ? 'Identification' : t === 1 ? 'Routing configuration' : 'Failure handling');
      page.P.field(ctx, group, page.s.fields[t]);
      for (const [name, text] of t === 0 ? [['Account group', 'COMMERCIAL'], ['Company code', '0100'], ['Currency', 'USD'], ['Payment terms', 'NET 30']]
        : t === 1 ? [['Queue name', 'CUSTUPD'], ['Delivery', 'SYNCHRONOUS'], ['Destination', 'HBR-PROD'], ['Code page', '037 / ENGLISH']]
          : [['Interval', '30 seconds'], ['Timeout', '120 seconds'], ['Recovery', 'Automatic'], ['Escalation', 'Operations desk']]) {
        page.P.protectedRow(group, name, text);
      }
      const details = page.el('fieldset', 'lg-group', columns); page.el('legend', '', details, t === 0 ? 'Protected record data' : 'System settings');
      for (const [name, initial] of t === 0 ? [['Owner', ''], ['Organization', ''], ['Location', '']] : t === 1 ? [['Queue', 'STANDARD'], ['Transport', 'HOST LINK / TCP'], ['Record lock', 'EXCLUSIVE ON SAVE']] : [['Backoff', '30 seconds'], ['Failure action', 'Place on hold'], ['Logging', 'Errors and warnings']]) {
        const out = page.P.protectedRow(details, name, initial);
        if (t === 0) page.refs[name] = out;
      }
      const readonly = page.el('fieldset', 'lg-group', pane); page.el('legend', '', readonly, 'Administrative data');
      for (const [label, text] of [['Created by', 'MIGRATION / LEGACY01'], ['Last batch', 'NIGHTLY-04'], ['Change authority', 'CUST_MAINT'], ['Storage', 'Customer master / CUSTLIB']]) {
        page.P.protectedRow(readonly, label, text);
      }
    };

    BASE.field = (ctx, group, f) => {
      const row = page.el('div', 'lg-row', group);
      const label = page.el('label', '', row, f.label); label.htmlFor = `lg-${f.id}`;
      const inputParent = f.id === 'retries' ? page.el('div', 'lg-spin', row) : row;
      const input = page.el('input', 'lg-input', inputParent); input.id = `lg-${f.id}`; input.maxLength = f.max;
      input.autocomplete = 'off'; input.spellcheck = false; input.setAttribute('aria-label', f.label);
      input.inputMode = f.id === 'retries' || f.id === 'cost' ? 'numeric' : 'text'; page.inputs[f.id] = input;
      input.addEventListener('input', () => page.P.update(page.F.edit(ctx.model, page.s, f.id, input.value)));
      input.addEventListener('focus', () => { if (ctx.model.focus !== f.id) page.P.update(page.F.setFocus(ctx.model, f.id)); });
      if (f.id === 'retries') page.P.spinner(inputParent, f);
      if (f.id === 'cost') {
        page.refs.help = page.P.iconButton(row, page.s.scenario === 'sapgui' ? 'F4' : 'Values', 'grid', () => page.P.patch({ help: 'cost', focus: 'cost' }), page.s.scenario !== 'sapgui');
        page.el('div', 'lg-note', group, 'Controlling area 1000 / Company code 0100');
      } else page.el('div', 'lg-note', group, f.id === 'memo' ? `Uppercase host field · ${f.max} characters maximum` : 'Retries before a failed request is placed on hold (1–99).');
    };

    BASE.spinner = (inputParent, f) => {
      const spin = page.el('span', '', inputParent);
      for (const [label, delta] of [['up', 1], ['down', -1]]) {
        const b = page.P.button(spin, '', () => page.P.update(page.F.edit(page.ctx.model, page.s, f.id, String(Math.max(1, Math.min(99, Number(page.F.value(page.ctx.model, f.id)) + delta))))));
        page.P.icon(label, b); b.querySelector('svg').style.height = '8px';
        b.setAttribute('aria-label', delta === 1 ? 'Increase retry limit' : 'Decrease retry limit');
      }
    };

    BASE.protectedRow = (parent, label, text) => {
      const row = page.el('div', 'lg-row', parent); page.el('label', '', row, label);
      return page.el('span', 'lg-protected', row, text);
    };

    BASE.welcome = (ctx) => {
      page.refs.fieldError = page.el('div', 'lg-field-error', page.main);
      page.empty = page.el('div', 'lg-welcome', page.main);
      page.el('h2', '', page.empty, 'Harbor Easy Access');
      page.el('div', 'lg-pane-title', page.empty, 'Favorites / Frequently used transactions');
      page.P.iconButton(page.empty, 'ZREC - Maintain customer records', 'grid', () => { page.P.patch({ command: 'ZREC', screen: 'search', focus: 'key', status: 'TRANSACTION ZREC STARTED' }); page.key.focus(); });
      for (const text of ['ZBAL - Account balances', 'ZBAT - Batch monitor', 'ZPRT - Print spool administration']) page.P.iconButton(page.empty, text, 'file', () => page.P.patch({ help: 'about' }));
      page.el('div', 'lg-pane-title', page.empty, 'System notices');
      page.el('p', '', page.empty, 'Client 100 / Production. Month-end reconciliation is open. Background processing is available; 3 print requests are held.');
      page.closed = page.el('div', 'lg-closed', page.main, 'Properties closed. Select a record or choose Display to reopen.');
      page.audit = page.el('div', 'lg-note', page.main); page.refs.receipt = page.audit;
    };

    BASE.inspector = (ctx) => {
      const inspector = page.el('aside', 'lg-inspector', page.work);
      page.el('div', 'lg-pane-title', inspector, 'Object information');
      const dl = page.el('dl', '', inspector);
      page.info = {};
      for (const label of ['Record', 'Owner', 'Company', 'Location', 'Ledger', 'Batch', 'Authority', 'Lock']) {
        page.el('dt', '', dl, label); page.info[label] = page.el('dd', '', dl);
      }
      page.el('div', 'lg-pane-title', inspector, 'Worklist / Notifications');
      for (const [kind, text] of [['warn', '3 statements awaiting release'], ['clock', 'Month-end reconciliation pending'], ['file', '12 documents in print spool'], ['check', 'Customer index rebuilt successfully']]) {
        page.P.notification(inspector, kind, text);
      }
      page.el('div', 'lg-pane-title', inspector, 'Related records');
      for (const r of page.s.records.slice(0, 4)) page.el('p', '', inspector, `${r.key} - ${r.owner}`);
    };

    BASE.notification = (parent, kind, text) => {
      const message = page.el('div', 'lg-message', parent); page.P.icon(kind, message); page.el('span', '', message, text);
    };

    BASE.dock = (ctx) => {
      const dock = page.el('div', 'lg-dock', page.root), dockTabs = page.el('div', 'lg-dock-tabs', dock); page.dockButtons = {};
      for (const label of ['Messages', 'Jobs', 'Change history']) page.dockButtons[label] = page.P.button(dockTabs, label, () => page.P.patch({ dock: label }), '');
      page.refs.log = page.el('div', 'lg-log', dock);
    };

    BASE.actions = (ctx) => {
      const actions = page.el('div', 'lg-actions', page.root);
      page.refs.save = page.P.button(actions, page.s.scenario === 'win95' ? 'Apply' : 'Save', page.P.commit);
      if (page.s.scenario === 'win95') page.refs.ok = page.P.button(actions, 'OK', () => { page.P.commit(); if (ctx.model.receipt) page.P.patch({ closed: true }); });
      page.P.button(actions, 'Cancel', () => page.P.update({ ...page.F.cancel(ctx.model), closed: page.s.scenario === 'win95' }));
    };

    BASE.status = (ctx) => {
      const status = page.el('div', 'lg-status', page.root);
      page.refs.status = page.el('span', '', status); page.refs.active = page.el('span', '', status); page.el('span', '', status, 'INS');
    };
  }

  function installStateParts(BASE, page) {
    BASE.transact = () => {
      if (page.ctx.model.focus === 'command' || page.ctx.model.screen === 'command') {
        const code = page.ctx.model.command.toUpperCase().replace(/^\/N/, '');
        page.P.patch(code === page.s.transaction ? { screen: 'search', focus: 'key', status: 'TRANSACTION ZREC STARTED' } : { status: 'E010 TRANSACTION NOT FOUND' });
        if (code === page.s.transaction) page.key.focus();
      } else if (page.ctx.model.focus === 'key') page.P.update(page.F.load(page.ctx.model, page.s, page.s.records.findIndex((r) => r.key === page.ctx.model.key)));
      else page.P.commit();
    };

    BASE.sync = (m) => {
      const locked = page.s.scenario === 'sapgui' && m.screen === 'command';
      page.directory.hidden = locked; page.count.hidden = locked; page.searchRow.hidden = locked; page.editor.hidden = locked || m.closed; page.audit.hidden = locked; page.refs.fieldError.hidden = locked;
      page.empty.hidden = !locked; page.closed.hidden = !m.closed;
      page.refs.treeToggle.querySelector('path').setAttribute('d', page.D.icons[m.tree ? 'down' : 'right']); page.refs.tree.classList.toggle('on', m.tree);
      page.treeChildren.hidden = !m.tree;
      if (page.refs.command && page.refs.command.value !== m.command) page.refs.command.value = m.command;
      if (page.key.value !== m.key) page.key.value = m.key;
      const active = m.active === null ? null : page.s.records[m.active];
      for (const [i, row] of Object.entries(page.rowNodes)) {
        row.classList.toggle('on', Number(i) === m.active); page.refs[`cost:${i}`].textContent = m.stored[i].cost;
      }
      for (let t = 0; t < 3; t++) { page.tabs[t].setAttribute('aria-selected', String(m.tab === t)); page.panes[t].hidden = m.tab !== t; }
      for (const [id, input] of Object.entries(page.inputs)) {
        const v = page.F.value(m, id); if (input.value !== v) input.value = v; input.disabled = !active;
      }
      page.refs.Owner.textContent = active ? active.owner : '-'; page.refs.Organization.textContent = active ? active.company : '-'; page.refs.Location.textContent = active ? active.city : '-';
      const dirty = active && JSON.stringify(m.drafts[m.active]) !== JSON.stringify(m.stored[m.active]);
      page.refs.heading.textContent = active ? `${active.key} - ${page.s.scenario === 'win95' ? 'Service configuration' : 'Customer master'}` : 'Customer records';
      page.refs.editorTitle.textContent = active ? `${active.key} Properties${dirty ? ' *' : ''}` : 'No record selected';
      page.refs.count.textContent = `${page.s.records.length} rows retrieved / ${m.active === null ? '0' : '1'} selected`;
      page.refs.fieldError.textContent = /^E\d/.test(m.status) ? m.status : dirty ? 'Information: Local changes have not been saved.' : 'Information: All master data checks completed.';
      page.refs.fieldError.classList.toggle('bad', /^E\d/.test(m.status));
      const meta = active ? { Record: active.key, Owner: active.owner, Company: active.company, Location: active.city, Ledger: 'AR01 / USD', Batch: active.batch, Authority: 'CUST_MAINT', Lock: dirty ? 'Local edit' : 'Available' } : {};
      for (const [label, node] of Object.entries(page.info)) node.textContent = meta[label] || '-';
      const dockName = m.dock || 'Messages';
      for (const [label, b] of Object.entries(page.dockButtons)) b.classList.toggle('on', label === dockName);
      page.refs.log.replaceChildren();
      const logLines = dockName === 'Jobs' ? ['NIGHTLY-04     Completed    Return code 00     Customer master', 'STMT-PRINT     Held         Output queue QPRINT     12 documents']
        : dockName === 'Change history' ? [active ? `${active.key}    ${m.receipt || 'No committed change document'}    User OPS042` : 'No object selected', 'Audit retention: 90 days. Protected entries cannot be modified.']
          : [`[HBRPROD/100] Session active. ${page.s.records.length} customer records retrieved.`, `[${active ? active.key : 'SYSTEM'}] ${m.status}${m.receipt ? ' / Change document ' + m.receipt : ''}`, ...(dockName === 'Messages' ? [] : [`${dockName}: read-only workspace. No pending changes.`])];
      for (const text of logLines) page.el('div', '', page.refs.log, text);
      page.refs.receipt.textContent = `Change document: ${m.receipt || 'NOT ASSIGNED'}`;
      page.refs.status.textContent = `Status: ${m.status}`; page.refs.active.textContent = active ? active.key : 'No selection';
      page.refs.save.disabled = !active || locked || m.closed; page.refs.saveTool.disabled = !active || locked || m.closed;
      if (page.refs.ok) page.refs.ok.disabled = !active || m.closed;
      page.helpLayer.hidden = !m.help; page.helpChoices.hidden = m.help !== 'cost'; page.helpText.hidden = m.help === 'cost';
      page.helpTitle.textContent = m.help === 'cost' ? 'Value help — Cost center' : 'Harbor Operations — Help';
      page.toolsHint.textContent = page.s.scenario === 'sapgui' ? `${m.screen === 'command' ? 'Session manager' : 'ZREC'}  Ctrl+S  F4 Help` : 'Record workspace';
    };

    BASE.keydown = (e) => {
      if (!page.root.isConnected || document.querySelector('.ref-ov')) return;
      if (e.key === 'Escape') { e.preventDefault(); page.P.patch({ help: false }); page.pop.hidden = true; }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') { e.preventDefault(); page.P.commit(); }
      if (e.key === 'F4') { e.preventDefault(); page.P.patch({ help: 'cost', focus: 'cost' }); }
      if (e.key === 'F1') { e.preventDefault(); page.P.patch({ help: 'about' }); }
      if (e.key === 'Enter' && !page.ctx.model.help) { e.preventDefault(); page.P.transact(); }
    };

    BASE.ready = (ctx) => {
      page.refs.directory = page.directory; page.refs.sheet = page.sheet;
      if (page.W < 610) page.tree.style.width = `${page.D.smallTreeWidth}px`;
    };

    BASE.build = (ctx) => {
      page.P.menuFrame(ctx);
      page.P.helpDialog(ctx);
      page.P.menu(ctx);
      page.P.toolbar(ctx);
      page.P.breadcrumb(ctx);
      page.P.workspace(ctx);
      page.P.navigator(ctx);
      page.P.main(ctx);
      page.P.heading(ctx);
      page.P.search(ctx);
      page.P.directory(ctx);
      page.P.editor(ctx);
      page.P.welcome(ctx);
      page.P.inspector(ctx);
      page.P.dock(ctx);
      page.P.actions(ctx);
      page.P.status(ctx);
      page.P.ready(ctx);
    };

    BASE.rendered = (ctx) => {

    };

    BASE.locate = (t) => {
      const v = { ctx: page.ctx, refs: page.refs, inputs: page.inputs, tabs: page.tabs, recordButtons: page.recordButtons };
      let node;
      if (t.field) node = v.inputs[t.field] || v.refs[t.field];
      else if (t.tab !== undefined) node = v.tabs[t.tab];
      else if (t.record !== undefined) node = v.recordButtons[t.record];
      else if (t.tree) node = v.refs.tree;
      else if (t.save) node = v.refs.save;
      else if (t.open) node = v.refs.open;
      else if (t.help) node = v.refs.help;
      else if (t.option) node = v.refs[`option:${t.option}`];
      if (!node || !node.getClientRects().length) throw new Error(`use-legacy-app target not rendered: ${JSON.stringify(t)}`);
      // Directory rows live in a deliberately small, scrollable desktop table.
      // The oracle retrieves records by key; locate() only reads geometry.
      return v.ctx.util.center(node);
    };
  }


  env.template('use-legacy-app/desktop', (design, def) => {
    const { ICONS, CSS } = env.templateLib('use-legacy-app/_assets');
    const TOKENS = tokenDefaults(ICONS);
    let D, P;
    let ctx, F, s, el, root, W, H, look;
    let refs, inputs, tabs, recordButtons;
    let keyHandler = null;
    let ready = false;
    let menu, pop, helpLayer, helpTitle, helpChoices, helpText, toolsHint, work, tree, treeChildren, main, searchRow, key, directory, rowNodes, count, editor, tabstrip, panes, sheet, empty, closed, audit, info, dockButtons;
    const els = {};
    Object.defineProperty(els, 'menu', { enumerable: true, get: () => menu, set: (v) => { menu = v; } });
    Object.defineProperty(els, 'pop', { enumerable: true, get: () => pop, set: (v) => { pop = v; } });
    Object.defineProperty(els, 'helpLayer', { enumerable: true, get: () => helpLayer, set: (v) => { helpLayer = v; } });
    Object.defineProperty(els, 'helpTitle', { enumerable: true, get: () => helpTitle, set: (v) => { helpTitle = v; } });
    Object.defineProperty(els, 'helpChoices', { enumerable: true, get: () => helpChoices, set: (v) => { helpChoices = v; } });
    Object.defineProperty(els, 'helpText', { enumerable: true, get: () => helpText, set: (v) => { helpText = v; } });
    Object.defineProperty(els, 'toolsHint', { enumerable: true, get: () => toolsHint, set: (v) => { toolsHint = v; } });
    Object.defineProperty(els, 'work', { enumerable: true, get: () => work, set: (v) => { work = v; } });
    Object.defineProperty(els, 'tree', { enumerable: true, get: () => tree, set: (v) => { tree = v; } });
    Object.defineProperty(els, 'treeChildren', { enumerable: true, get: () => treeChildren, set: (v) => { treeChildren = v; } });
    Object.defineProperty(els, 'main', { enumerable: true, get: () => main, set: (v) => { main = v; } });
    Object.defineProperty(els, 'searchRow', { enumerable: true, get: () => searchRow, set: (v) => { searchRow = v; } });
    Object.defineProperty(els, 'key', { enumerable: true, get: () => key, set: (v) => { key = v; } });
    Object.defineProperty(els, 'directory', { enumerable: true, get: () => directory, set: (v) => { directory = v; } });
    Object.defineProperty(els, 'rowNodes', { enumerable: true, get: () => rowNodes, set: (v) => { rowNodes = v; } });
    Object.defineProperty(els, 'count', { enumerable: true, get: () => count, set: (v) => { count = v; } });
    Object.defineProperty(els, 'editor', { enumerable: true, get: () => editor, set: (v) => { editor = v; } });
    Object.defineProperty(els, 'tabstrip', { enumerable: true, get: () => tabstrip, set: (v) => { tabstrip = v; } });
    Object.defineProperty(els, 'panes', { enumerable: true, get: () => panes, set: (v) => { panes = v; } });
    Object.defineProperty(els, 'sheet', { enumerable: true, get: () => sheet, set: (v) => { sheet = v; } });
    Object.defineProperty(els, 'empty', { enumerable: true, get: () => empty, set: (v) => { empty = v; } });
    Object.defineProperty(els, 'closed', { enumerable: true, get: () => closed, set: (v) => { closed = v; } });
    Object.defineProperty(els, 'audit', { enumerable: true, get: () => audit, set: (v) => { audit = v; } });
    Object.defineProperty(els, 'info', { enumerable: true, get: () => info, set: (v) => { info = v; } });
    Object.defineProperty(els, 'dockButtons', { enumerable: true, get: () => dockButtons, set: (v) => { dockButtons = v; } });
    // Private live bindings for the part installers; S below remains the design API.
    const page = {
      get D() { return D; },
      get P() { return P; },
      get ctx() { return ctx; },
      get F() { return F; },
      get s() { return s; },
      get el() { return el; },
      get root() { return root; }, set root(v) { root = v; },
      get W() { return W; }, set W(v) { W = v; },
      get H() { return H; }, set H(v) { H = v; },
      get refs() { return refs; },
      get inputs() { return inputs; },
      get tabs() { return tabs; },
      get recordButtons() { return recordButtons; },
      get ready() { return ready; },
      get menu() { return menu; }, set menu(v) { menu = v; },
      get pop() { return pop; }, set pop(v) { pop = v; },
      get helpLayer() { return helpLayer; }, set helpLayer(v) { helpLayer = v; },
      get helpTitle() { return helpTitle; }, set helpTitle(v) { helpTitle = v; },
      get helpChoices() { return helpChoices; }, set helpChoices(v) { helpChoices = v; },
      get helpText() { return helpText; }, set helpText(v) { helpText = v; },
      get toolsHint() { return toolsHint; }, set toolsHint(v) { toolsHint = v; },
      get work() { return work; }, set work(v) { work = v; },
      get tree() { return tree; }, set tree(v) { tree = v; },
      get treeChildren() { return treeChildren; }, set treeChildren(v) { treeChildren = v; },
      get main() { return main; }, set main(v) { main = v; },
      get searchRow() { return searchRow; }, set searchRow(v) { searchRow = v; },
      get key() { return key; }, set key(v) { key = v; },
      get directory() { return directory; }, set directory(v) { directory = v; },
      get rowNodes() { return rowNodes; }, set rowNodes(v) { rowNodes = v; },
      get count() { return count; }, set count(v) { count = v; },
      get editor() { return editor; }, set editor(v) { editor = v; },
      get tabstrip() { return tabstrip; }, set tabstrip(v) { tabstrip = v; },
      get panes() { return panes; }, set panes(v) { panes = v; },
      get sheet() { return sheet; }, set sheet(v) { sheet = v; },
      get empty() { return empty; }, set empty(v) { empty = v; },
      get closed() { return closed; }, set closed(v) { closed = v; },
      get audit() { return audit; }, set audit(v) { audit = v; },
      get info() { return info; }, set info(v) { info = v; },
      get dockButtons() { return dockButtons; }, set dockButtons(v) { dockButtons = v; },
      get CSS() { return CSS; },
    };
    const S = {
      get ctx() { return ctx; }, get spec() { return s; }, get root() { return root; },
      get geo() { return { W, H }; }, set geo(g) { W = g.W; H = g.H; },
      get refs() { return refs; }, get inputs() { return inputs; },
      get tabs() { return tabs; }, get recordButtons() { return recordButtons; },
      get D() { return D; }, get P() { return P; }, els,
    };
    const BASE = {};

    installFrameParts(BASE, page);
    installDirectoryParts(BASE, page);
    installEditorParts(BASE, page);
    installStateParts(BASE, page);

    ({ D, P } = env.templateDesign('use-legacy-app/desktop', design, def, { tokens: TOKENS, base: BASE, state: S }));
    return {
      render(next) {
        if (keyHandler) document.removeEventListener('keydown', keyHandler);
        ready = false;
        ctx = next; F = env.taskDef.helpers; s = ctx.spec; el = ctx.util.el; look = F.lookup(s);
        refs = {}; inputs = {}; tabs = {}; recordButtons = {};
        P.begin(ctx);
        root = P.frame(ctx);
        P.title(ctx);
        P.build(ctx);
        ready = true;
        keyHandler = (e) => P.keydown(e);
        document.addEventListener('keydown', keyHandler);
        P.sync(ctx.model);
        P.rendered(ctx);
        return { anchors: [root], sync: (m) => P.sync(m) };
      },
      locate(t) { return P.locate(t); },
    };
  }, { uses: ['use-legacy-app/_assets'] });
})();
