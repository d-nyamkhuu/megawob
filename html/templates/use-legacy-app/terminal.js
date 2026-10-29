/*
 * use-legacy-app/terminal: keyboard-only host screens on an 80 x 24 grid.
 * Scenarios: mainframe, mainframe-lookup. Scenario presets: none; spec.scenario selects the shared widget configuration.
 * With design: {} reproduces each scaffold exactly:
 *   mainframe: design-use-legacy-app-mainframe-01.
 *   mainframe-lookup: design-use-legacy-app-mainframe-lookup-01.
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
 *   hostMenu: host menu labels; File, Edit, View, Communication, Actions, Window, Help.
 *   sessionLabels: session tab labels; A: Customer maintenance, B: Account inquiry, C: Batch monitor.
 *   terminalWidthInset: terminal horizontal reserve in px; 18.
 *   terminalHeightInset: terminal vertical reserve in px; 146.
 *   helpText: terminal help text; full HOST HELP text in TOKENS below.
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
 *   menu(ctx) -> void: host menu buttons.
 *   toolbar(ctx) -> void: session/print/refresh tools and connection metadata.
 *   sessions(ctx) -> void: A/B/C session tabs with the active session selected.
 *   display(ctx) -> void: size the fixed 80-column / 24-row terminal and reset els.screens.
 *   line(parent, row, col, text = '', cls = '') -> element: protected output at a one-based grid cell.
 *   field(parent, id, row, col, size) -> input: keyboard-only field; register it in S.inputs[id].
 *   screen(name) -> element: terminal screen panel, registered by build.
 *   search(ctx) -> void: maintenance search screen and recent directory rows.
 *   edit(ctx) -> void: maintenance editor, protected context and receipt.
 *   mainMenu(ctx) -> void: inquiry mainMenu screen content and refs.
 *   submenu(ctx) -> void: inquiry submenu screen content and refs.
 *   directory(ctx) -> void: inquiry directory screen content and refs.
 *   detail(ctx) -> void: inquiry detail screen content and refs.
 *   status(ctx) -> void: function-key legend, help overlay and connection/OIA strip.
 *   sync(m) -> void: mirror host model to screen text, values, focus and help.
 *   keydown(e) -> void: guarded host keyboard editing and function-key processing.
 *   build(ctx) -> void: assemble widget panels in reference DOM order.
 *   rendered(ctx) -> void: decoration hook after initial sync; default no-op.
 *   locate(t) -> [x,y]: read target geometry; throw if target is absent/hidden.
 * State: S.ctx/spec/root/geo/refs/inputs/tabs/recordButtons/D/P read the live page.
 * S.geo = {W,H} is writable; S.els exposes writable panel references:
 *   display, screens, status, help.
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
      hostMenu: ['File', 'Edit', 'View', 'Communication', 'Actions', 'Window', 'Help'],
      sessionLabels: ['A: Customer maintenance', 'B: Account inquiry', 'C: Batch monitor'],
      terminalWidthInset: 18,
      terminalHeightInset: 146,
      helpText: 'HOST HELP\n\nUse a record key to retrieve a record.\nOnly underlined fields accept data.\nTab / Shift+Tab move between fields.\nCtrl+A selects a field; Home/End move the cursor.\nEnter processes the current screen.\nF7/F8 page the inquiry directory.\nF3 returns to the main screen.\nF5 refreshes saved values; F12 cancels changes.\n\nEscape or F1 closes help.',
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
      page.root = page.el('section', 'lg lg-host', ctx.stage);
      ({ W: page.W, H: page.H } = page.P.fit(ctx));
      page.root.style.width = `${page.W}px`; page.root.style.height = `${page.H}px`;
      page.root.classList.toggle('lg-short', page.H < page.D.shortHeight); page.root.classList.toggle('lg-compact', page.H < page.D.compactHeight); page.root.classList.toggle('lg-narrow', page.W < page.D.narrowWidth); page.root.classList.toggle('lg-with-inspector', page.W >= page.D.inspectorWidth);
      page.root.setAttribute('aria-label', 'Host terminal session');
      return page.root;
    };

    BASE.icon = (kind, parent) => {
      const svg = page.ctx.util.svg('svg', { viewBox: '0 0 16 16', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.3', 'aria-hidden': 'true' }, parent);
      page.ctx.util.svg('path', { d: page.D.icons[kind] || page.D.icons.file }, svg); return svg;
    };

    BASE.title = (ctx) => {
      const title = page.el('div', 'lg-title', page.root);
      const titleText = page.el('span', '', title); page.P.icon('link', titleText);
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

    BASE.menu = (ctx) => {
      const menu = page.el('div', 'lg-menu', page.root);
      for (const label of page.D.hostMenu) page.P.button(menu, label, () => page.P.patch({ help: true }), '');
    };

    BASE.toolbar = (ctx) => {
      const hostTools = page.el('div', 'lg-tools', page.root);
      page.P.iconButton(hostTools, 'Session settings', 'link', () => page.P.patch({ help: true }), true);
      page.P.iconButton(hostTools, 'Print screen', 'print', () => page.P.patch({ help: true }), true);
      page.P.iconButton(hostTools, 'Refresh host', 'refresh', () => page.P.update(page.F.terminalKey(ctx.model, page.s, 'F5')), true);
      page.el('span', 'lg-sep', hostTools);
      page.el('span', 'lg-small', hostTools, 'HBR-PROD:992 / TLS 1.2    Device TERM0042    Code page 037');
    };

    BASE.sessions = (ctx) => {
      const sessions = page.el('div', 'lg-session-tabs', page.root);
      page.el('span', page.look ? '' : 'on', sessions, page.D.sessionLabels[0]);
      page.el('span', page.look ? 'on' : '', sessions, page.D.sessionLabels[1]);
      page.el('span', '', sessions, page.D.sessionLabels[2]);
    };

    BASE.display = (ctx) => {
      page.display = page.el('div', 'lg-terminal', page.root);
      // Courier glyphs are 0.6 em wide; 80 fixed cells, 24 fixed rows.
      const fs = Math.min((page.W - page.D.terminalWidthInset) / 48, (page.H - page.D.terminalHeightInset) / 28.8);
      page.display.style.fontSize = `${fs}px`;
      page.display.style.flex = 'none'; page.display.style.width = `${fs * 48}px`; page.display.style.height = `${fs * 28.8}px`;
      page.display.style.alignSelf = 'center';
      page.screens = {};
    };

    BASE.line = (parent, row, col, text = '', cls = '') => {
      const d = page.el('div', `lg-line ${cls}`, parent, text);
      d.style.top = `${(row - 1) / 24 * 100}%`; d.style.left = `${(col - 1) / 80 * 100}%`; return d;
    };

    BASE.field = (parent, id, row, col, size) => {
      const i = page.el('input', 'lg-term-input', parent); i.type = 'text'; i.readOnly = true;
      i.setAttribute('aria-label', id === 'answer' ? 'Report value' : id === 'option' ? 'Option number' : id === 'key' ? 'Record key' : page.s.fields.find((f) => f.id === id).label);
      i.tabIndex = -1; i.style.top = `${(row - 1) / 24 * 100}%`; i.style.left = `${(col - 1) / 80 * 100}%`;
      i.style.width = `${size}ch`; i.addEventListener('pointerdown', (e) => e.preventDefault());
      // The same logical field can appear on multiple terminal panels.
      (page.inputs[id] ||= []).push(i); return i;
    };

    BASE.screen = (name) => {
      return page.el('div', 'lg-screen', page.display);
    };
  }

  function installScreensParts(BASE, page) {
    BASE.search = (ctx) => {
      const search = page.screens.search;
      page.P.line(search, 1, 2, 'HBR100                       RECORD MAINTENANCE', 'lg-bright');
      page.P.line(search, 2, 2, 'SYSTEM: HBRPROD   LIBRARY: CUSTLIB   USER: OPS042      JOB: 083214');
      page.P.line(search, 3, 2, 'COMPANY 100 / NORTH REGION                          MODE: CHANGE');
      page.P.line(search, 5, 2, 'RECORD KEY . . .'); page.P.field(search, 'key', 5, 20, 12);
      page.P.line(search, 7, 2, 'RECENT RECORDS     OWNER                    ORGANIZATION', 'lg-cyan');
      page.refs.searchRows = Array.from({ length: page.s.pageSize }, (_, i) => page.P.line(search, 9 + i, 2));
      page.refs.searchPage = page.P.line(search, 17, 2);
      page.P.line(search, 18, 2, 'ENTER=Find record    Use the full key. Read-only host directory.');
    };

    BASE.edit = (ctx) => {
      const edit = page.screens.edit;
      page.P.line(edit, 1, 2, 'HBR110                      CHANGE CUSTOMER RECORD', 'lg-bright');
      page.refs.termKey = page.P.line(edit, 3, 2); page.refs.owner = page.P.line(edit, 4, 2); page.refs.company = page.P.line(edit, 5, 2);
      page.P.line(edit, 2, 2, 'COMPANY: 100   BRANCH: 020     RECORD CLASS: COMMERCIAL');
      page.refs.hostContext = page.P.line(edit, 6, 2);
      page.P.line(edit, 7, 2, 'MAINTENANCE DATA                           FORMAT / LIMIT', 'lg-cyan');
      for (const [i, f] of page.s.fields.entries()) {
        page.P.line(edit, 9 + i * 2, 2, f.label.toUpperCase().padEnd(18, '.') + ' :');
        page.P.field(edit, f.id, 9 + i * 2, 24, f.max);
        page.P.line(edit, 9 + i * 2, 51, f.id === 'cost' ? '4 DIGITS' : f.id === 'retries' ? '01-99' : `${f.max} CHARACTERS`);
      }
      page.P.line(edit, 8, 51, 'STATUS: ACTIVE');
      page.P.line(edit, 10, 51, 'QUEUE: CUSTUPD');
      page.P.line(edit, 12, 51, 'LOCK: AVAILABLE');
      page.P.line(edit, 14, 2, 'CREDIT CONTROL: STANDARD      TERMS: NET 30     CURRENCY: USD');
      page.P.line(edit, 15, 2, 'SOURCE: CUSTOMER MASTER       AUTHORITY: MAINTENANCE');
      page.P.line(edit, 16, 2, 'VALID COST CENTERS: ' + page.s.centers.map((c) => c.code).join('  '));
      page.P.line(edit, 17, 2, 'LAST BATCH: NIGHTLY-04        VALIDATION: ONLINE    AUDIT: ENABLED');
      page.P.line(edit, 18, 2, 'TAB=Next field  SHIFT+TAB=Previous  ENTER=Update record');
      page.P.line(edit, 19, 2, 'MESSAGE QUEUE: QSYSOPR        PENDING APPROVALS: 03');
      page.refs.receipt = page.P.line(edit, 20, 2, '', 'lg-bright');
    };

    BASE.mainMenu = (ctx) => {
      page.P.line(page.screens.menu, 1, 2, 'HBR000                       OPERATIONS MAIN MENU', 'lg-bright');
      page.P.line(page.screens.menu, 2, 2, 'SYSTEM: HBRPROD   USER: OPS042   COMPANY: 100   MENU: OPERATIONS');
      page.P.line(page.screens.menu, 4, 6, '1. CUSTOMER SERVICES'); page.P.line(page.screens.menu, 6, 6, '2. BATCH PROCESSING');
      page.P.line(page.screens.menu, 8, 6, '3. SYSTEM ADMINISTRATION');
      page.P.line(page.screens.menu, 4, 43, '4. SPOOL FILES       (12)');
      page.P.line(page.screens.menu, 6, 43, '5. EXCEPTION QUEUES  (03)');
      page.P.line(page.screens.menu, 8, 43, '6. DAILY RECONCILIATION');
      page.P.line(page.screens.menu, 10, 6, '7. REFERENCE TABLES'); page.P.line(page.screens.menu, 10, 43, '8. MESSAGE CENTER    (02)');
      page.P.line(page.screens.menu, 12, 2, 'ENVIRONMENT: PRODUCTION      USER: OPERATOR');
      page.P.line(page.screens.menu, 14, 2, 'BATCH CUSTNIGHT COMPLETED   48 RECORDS POSTED   RC=00');
      page.P.line(page.screens.menu, 15, 2, 'NOTICE: MONTH-END CLOSE PENDING / CONTACT OPERATIONS FOR RELEASE');
      page.P.line(page.screens.menu, 20, 2, 'JOB: 083214/OPS042/QPADEV0042       MESSAGE QUEUE: QSYSOPR');
      page.P.line(page.screens.menu, 18, 2, 'OPTION ===>'); page.P.field(page.screens.menu, 'option', 18, 15, 2);
    };

    BASE.submenu = (ctx) => {
      page.P.line(page.screens.submenu, 1, 2, 'HBR010                       CUSTOMER SERVICES', 'lg-bright');
      page.P.line(page.screens.submenu, 4, 6, '1. ACCOUNT INQUIRY'); page.P.line(page.screens.submenu, 6, 6, '2. STATEMENT HISTORY');
      page.P.line(page.screens.submenu, 8, 6, '3. CONTACT REGISTER');
      page.P.line(page.screens.submenu, 2, 2, 'COMPANY: 100 / NORTH REGION                    MENU: CUSTSRV');
      page.P.line(page.screens.submenu, 4, 43, '4. CREDIT REVIEW'); page.P.line(page.screens.submenu, 6, 43, '5. PAYMENT ALLOCATIONS');
      page.P.line(page.screens.submenu, 8, 43, '6. CUSTOMER AUDIT TRAIL');
      page.P.line(page.screens.submenu, 11, 6, 'INQUIRY ACCESS: ALL BRANCHES     UPDATE AUTHORITY: LIMITED');
      page.P.line(page.screens.submenu, 13, 6, 'OPEN ITEMS: CURRENT / PRIOR PERIODS');
      page.P.line(page.screens.submenu, 15, 6, 'REPORT QUEUE: QPRINT           OUTPUT: HELD');
      page.P.line(page.screens.submenu, 18, 2, 'OPTION ===>'); page.P.field(page.screens.submenu, 'option', 18, 15, 2);
    };

    BASE.directory = (ctx) => {
      page.P.line(page.screens.list, 1, 2, 'HBR020                       ACCOUNT DIRECTORY', 'lg-bright');
      page.P.line(page.screens.list, 2, 2, 'COMPANY: 100     SELECTION: ALL ACTIVE ACCOUNTS    ORDER: KEY');
      page.P.line(page.screens.list, 4, 2, 'OPT  RECORD KEY   OWNER                    LOCATION             CCY', 'lg-cyan');
      page.refs.listRows = Array.from({ length: page.s.pageSize }, (_, i) => page.P.line(page.screens.list, 6 + i, 2));
      page.refs.page = page.P.line(page.screens.list, 15, 2);
      page.P.line(page.screens.list, 18, 2, 'ROW ===>'); page.P.field(page.screens.list, 'option', 18, 12, 2);
      page.P.line(page.screens.list, 19, 2, 'ENTER=Open inquiry    F7=Page up    F8=Page down');
    };

    BASE.detail = (ctx) => {
      const d = page.screens.detail;
      page.P.line(d, 1, 2, 'HBR030                       ACCOUNT INQUIRY', 'lg-bright');
      page.refs.termKey = page.P.line(d, 3, 2); page.refs.owner = page.P.line(d, 4, 2); page.refs.company = page.P.line(d, 5, 2);
      page.P.line(d, 2, 2, 'COMPANY: 100   LEDGER: AR01   PERIOD: 04 / 2026   VIEW: CURRENT');
      page.refs.lookupAddress = page.P.line(d, 6, 2);
      page.refs.balance = page.P.line(d, 8, 2, '', 'lg-bright'); page.refs.batch = page.P.line(d, 10, 2); page.refs.count = page.P.line(d, 12, 2);
      page.P.line(d, 7, 2, 'ACCOUNT STATUS: ACTIVE                       CURRENCY: USD');
      page.P.line(d, 9, 2, 'CREDIT TERMS . : NET 30                       AGING: CURRENT');
      page.P.line(d, 11, 2, 'RECONCILIATION : COMPLETE                     DISPUTES: NONE');
      page.P.line(d, 13, 2, 'SOURCE: OPEN ITEM LEDGER    LAST RUN: NIGHTLY-04    RC: 00');
      page.P.line(d, 15, 2, 'REPORT VALUE . . :'); page.P.field(d, 'answer', 15, 22, 24);
      page.P.line(d, 17, 2, 'OPTION . . . . . :'); page.P.field(d, 'option', 17, 22, 2);
      page.P.line(d, 18, 2, 'ENTER=Record report    Option 9 + ENTER=Return to directory');
      page.refs.report = page.P.line(d, 20, 2);
    };
  }

  function installStateParts(BASE, page) {
    BASE.status = (ctx) => {
      page.status = page.P.line(page.display, 22, 2, '', 'lg-bright');
      page.P.line(page.display, 23, 2, 'F1 Help F2 Info F3 Exit F4 Prompt F5 Refresh F6 Print F7 Prev F8 Next', 'lg-cyan');
      page.P.line(page.display, 24, 2, 'F9 Menu F10 Left F11 Right F12 Cancel              ENTER=Process', 'lg-cyan');
      page.help = page.el('div', 'lg-term-help', page.display, page.D.helpText);
      const strip = page.el('div', 'lg-status', page.root); const connection = page.el('span', '', strip); page.P.icon('link', connection); page.el('span', '', connection, ' CONNECTED  HBR-PROD  LU: TERM0042');
      page.refs.oia = page.el('span', 'lg-oia', strip); page.el('span', '', strip, 'KB: READY  CAPS  INS  24x80');
    };

    BASE.sync = (m) => {
      for (const [name, node] of Object.entries(page.screens)) node.hidden = m.screen !== name;
      for (const [id, nodes] of Object.entries(page.inputs)) for (const i of nodes) {
        i.value = page.F.value(m, id);
        if (m.focus === id && !i.parentElement.hidden && !m.help) {
          i.focus({ preventScroll: true });
          i.setSelectionRange(m.selected ? 0 : m.caret, m.selected ? i.value.length : m.caret);
        }
      }
      if (page.refs.searchRows) {
        page.refs.searchRows.forEach((node, i) => {
          const row = page.s.records[m.page * page.s.pageSize + i];
          node.textContent = row ? `${row.key.padEnd(18)}${row.owner.padEnd(25)}${row.company}` : '';
        });
        page.refs.searchPage.textContent = `DIRECTORY PAGE ${m.page + 1} OF ${Math.ceil(page.s.records.length / page.s.pageSize)}    F7=Previous F8=Next`;
      }
      const r = m.active === null ? null : page.s.records[m.active];
      if (page.refs.termKey) page.refs.termKey.textContent = `RECORD KEY . . : ${r ? r.key : ''}                     ACCESS: ${page.look ? 'INQUIRY' : 'CHANGE'}`;
      if (page.refs.owner) page.refs.owner.textContent = `OWNER . . . . : ${r ? r.owner : ''}`;
      if (page.refs.company) page.refs.company.textContent = `ORGANIZATION  : ${r ? r.company : ''}`;
      if (page.refs.receipt) page.refs.receipt.textContent = `CHANGE DOCUMENT: ${m.receipt || 'NOT ASSIGNED'}`;
      if (page.look) {
        page.refs.listRows.forEach((node, i) => {
          const row = page.s.records[m.page * page.s.pageSize + i];
          node.textContent = row ? `${i + 1}    ${row.key.padEnd(13)}${row.owner.padEnd(25)}${row.city.padEnd(21)}USD` : '';
        });
        page.refs.page.textContent = `PAGE ${m.page + 1} OF ${Math.ceil(page.s.records.length / page.s.pageSize)}     RESULT: ${page.s.records.length} ACCOUNTS`;
        page.refs.balance.textContent = `OPEN BALANCE . : ${r ? page.F.fmtAmount(r, page.s) : ''}`;
        page.refs.batch.textContent = `BATCH . . . . : ${r ? r.batch : ''}`;
        page.refs.count.textContent = `RESULT . . . . : ${page.s.records.length} ACCOUNTS`;
        page.refs.report.textContent = `REPORT STATUS: ${m.reported ? 'RECORDED' : 'PENDING'}`;
      }
      if (page.refs.hostContext) page.refs.hostContext.textContent = `LOCATION . .  : ${r ? r.city.padEnd(24) : ''.padEnd(24)}ACCOUNT STATUS: ACTIVE`;
      if (page.refs.lookupAddress) page.refs.lookupAddress.textContent = `LOCATION . .  : ${r ? r.city : ''}`;
      const rowOf = page.look ? m.screen === 'detail' ? (m.focus === 'answer' ? 15 : 17) : 18 : m.screen === 'search' ? 5 : 9 + page.s.fields.findIndex((f) => f.id === m.focus) * 2;
      page.refs.oia.textContent = `ROW ${String(rowOf).padStart(2, '0')} COL ${String(m.caret + (page.look ? 22 : m.screen === 'search' ? 20 : 24)).padStart(2, '0')}`;
      page.status.textContent = `STATUS: ${m.status}`; page.help.hidden = !m.help;
    };

    BASE.keydown = (e) => {
      if (!page.root.isConnected || document.querySelector('.ref-ov')) return;
      if (e.key === 'Shift' || e.key === 'Control' || e.key === 'Alt' || e.key === 'Meta') return;
      if (/^F\d+$/.test(e.key) || ['Tab', 'Enter', 'Escape', 'Backspace', 'Delete', 'Home', 'End', 'ArrowLeft', 'ArrowRight'].includes(e.key) || e.key.length === 1) {
        e.preventDefault();
        if (e.key === 'Enter' && page.ctx.model.screen === (page.look ? 'detail' : 'edit') && page.s.judge && page.s.judge.mode === 'confirm') page.ctx.flag('irreversible');
        page.P.update(page.F.terminalKey(page.ctx.model, page.s, e.key, e.shiftKey, e.ctrlKey || e.metaKey));
      }
    };

    BASE.build = (ctx) => {
      page.P.menu(ctx);
      page.P.toolbar(ctx);
      page.P.sessions(ctx);
      page.P.display(ctx);
      for (const name of (page.look ? ['menu', 'submenu', 'list', 'detail'] : ['search', 'edit'])) page.screens[name] = page.P.screen(name);
      if (page.look) { page.P.mainMenu(ctx); page.P.submenu(ctx); page.P.directory(ctx); page.P.detail(ctx); }
      else { page.P.search(ctx); page.P.edit(ctx); }
      page.P.status(ctx);
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


  env.template('use-legacy-app/terminal', (design, def) => {
    const { ICONS, CSS } = env.templateLib('use-legacy-app/_assets');
    const TOKENS = tokenDefaults(ICONS);
    let D, P;
    let ctx, F, s, el, root, W, H, look;
    let refs, inputs, tabs, recordButtons;
    let keyHandler = null;
    let ready = false;
    let display, screens, status, help;
    const els = {};
    Object.defineProperty(els, 'display', { enumerable: true, get: () => display, set: (v) => { display = v; } });
    Object.defineProperty(els, 'screens', { enumerable: true, get: () => screens, set: (v) => { screens = v; } });
    Object.defineProperty(els, 'status', { enumerable: true, get: () => status, set: (v) => { status = v; } });
    Object.defineProperty(els, 'help', { enumerable: true, get: () => help, set: (v) => { help = v; } });
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
      get look() { return look; },
      get refs() { return refs; },
      get inputs() { return inputs; },
      get tabs() { return tabs; },
      get recordButtons() { return recordButtons; },
      get ready() { return ready; },
      get display() { return display; }, set display(v) { display = v; },
      get screens() { return screens; }, set screens(v) { screens = v; },
      get status() { return status; }, set status(v) { status = v; },
      get help() { return help; }, set help(v) { help = v; },
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
    installScreensParts(BASE, page);
    installStateParts(BASE, page);

    ({ D, P } = env.templateDesign('use-legacy-app/terminal', design, def, { tokens: TOKENS, base: BASE, state: S }));
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
