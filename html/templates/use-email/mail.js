/*
 * templates / use-email / mail: the shared widget code of the design-use-email-* sites (one native-controls mail client:
 * folder list, toolbar, search, message list with a scroll bar, message view, reply / forward editor, contacts).
 * A site's widgets/use-email.js is only its design:
 *
 *   env.widget({ task: 'use-email', site, name: 'design', split, scenarios: ['reply'], template: 'use-email/mail',
 *              design: { rowHeight: 40, folderList: [...], parts: { docMeta: (base, S) => (meta, e) => ... } } });
 *
 * The panels are laid out and styled by the site's site.css (panel classes folders, ledger, document, editor,
 * contacts; mail-row, message-list, ...), its page frame is its site.js; the template draws the controls.
 * Scenarios (the widget's scenarios[0], one per site): delete, forward, important, nl, reply, star, star-reply. The
 * scenario chooses the toolbar buttons (Star: star, star-reply, nl; Mark important: important, nl) and the primary
 * row icon (delete / important / star). Everything else is the same code; the tasks differ by the task's spec.
 *
 * Presets (VARIANTS): what most sites of one scenario share is the scenario's preset (its primary style, folder
 * list and row height of the representative site, and the decoration / list tweaks those sites have in common).
 * With design {} the template draws these sites exactly:
 *   reply design-use-email-reply-01 (the token defaults)   delete design-use-email-delete-01   forward design-use-email-forward-01
 *   important design-use-email-important-01   nl design-use-email-nl-01   star design-use-email-star-01
 *   star-reply design-use-email-star-reply-01
 * delete: style mac, Print button. nl: style irix, the irix decor (toolchest icons, mark, mountain), tools needed
 * unless the task is reply or forward. star: style flash, folders with compose, 'Sent Mail', no scroll of a row icon.
 * star-reply: style plain, stacked message view. Object tokens (folderLabels, paths, folderList ...) of a design
 * replace the preset's whole, they are not merged with it.
 *
 * design tokens (defaults in TOKENS):
 *   style            design name: data-style of the surface; 'civic' draws the watermark, 'irix' titles the
 *                    folder panel Toolchest, 'precision' / 'next' title the contacts panel (see the title tokens)
 *   decor            null | 'irix': a built-in decoration after the panels are placed (toolchest icons, the IRIX
 *                    mark and the mountain backdrop that most irix nl designs share)
 *   stack            true: the message view has a Back button (the list and the message are stacked)
 *   rowHeight        list row height at a 1672 px wide window (scaled with the window, see rowBasis)
 *   rowBasis         width the row height scales with: 'window' (innerWidth) | 'size' (ctx.size.width) |
 *                    'stage' (stage clientWidth) | 'root' (the surface clientWidth)
 *   rowMin, rowRef   smallest scaled row height (22) and the reference width (1672)
 *   folderList       folder buttons shown in the folder panel (others of folderBase / spec.folders are extra-folder)
 *   folderBase       folders created after folderList
 *   folderLabels     { <view>: text } merged over the default labels (sent, drafts, junk, spam, templates, compose)
 *   paths            { <icon>: 'svg path data' } merged over the default icon paths (viewBox 0 0 24 24)
 *   foldersTitle     title of the folder panel (null: Toolchest for irix, else Mailboxes)
 *   ledgerTitle      title of the list panel (Inbox)            docTitle   title of the message panel (Message)
 *   contactsTitle    title of the contacts panel (null: Task Progress for precision, Message Inspector for next,
 *                    else Contacts)
 *   toolbarIn        'ledger' | 'root' | 'folders': where the toolbar is created
 *   newLabel         text of the New button (New Message)       newIcon   its icon (new)
 *   newIn            'toolbar' | 'folders': where the New button goes;   newClass   its class
 *   toolbarOps       [[label, op], ...] toolbar buttons after New (Reply, Reply All, Forward, Delete)
 *   starLabel        text of the Star toolbar button            importantLabel   text of Mark important
 *   importantIcon    icon of Mark important and of the important row icon ('star')
 *   toolbarBefore, toolbarAfter   [[label, icon, class?], ...] inert toolbar buttons before / after Star and
 *                    Mark important
 *   searchIn         'ledger' | 'root': where the search line is created      listStatusIn   where the count line is
 *   searchPlaceholder, searchLabel   placeholder and aria-label of the search box
 *   columns          column heading texts of the list (From, Subject, Date, '')
 *   needsToolsExcept tasks for which an nl design does not need the message tools (reply, forward, star-reply)
 *   scrollToRowIcon  false: a row icon target that is off screen is not scrolled into view first
 *   replyTitle, replyNamed   editor title of a reply: the text, and whether the sender's name follows it
 *   forwardTitle, newTitle   editor titles of a forward and a new message
 *   fieldLabels      [[key, label], ...] editor address fields           fieldColon   true: ':' after each label
 *   fieldKeyClass    true: each field row also has the class field-<key>
 *   keyboard         true: the search, address and body text fields take keyboard input (env.ui.textField keyboard)
 *   replyPlaceholder, forwardPlaceholder   placeholders of the body field
 *   formatKeys       texts of the editor format bar
 *   cancelLabel      text of the editor's Cancel button         sendIcon   icon of the Send button (null: none)
 *   locateScrollKinds   keyed targets whose button is scrolled into view before it is clicked (['folder'])
 *
 * design.parts: { <part>: (base, S) => replacement } replaces a part (resolved by env.templateDesign: defaults, then
 * the scenario's preset, then the design); the replacement takes the part's arguments and may call base(...) for
 * the default. S reads the live state: S.els (the page's elements and state, assignable: root, folders, ledger,
 * toolbar, searchline, search, sf, col, all, listWrap, list, track, thumb, listStatus, doc, docInside, editor,
 * contact, cp, status, modal, reg (Map of locate targets), lbx (the list box), listKey, rowEls, fields,
 * folderButtons, folks, navTrigger, navExpanded, d (parts of the message view being built: tools, meta, content,
 * acts)), S.D (tokens), S.P (the parts, overrides included), S.ctx, S.spec, S.fam, S.scenario, S.site, S.paths, and
 * the helpers S.el(tag, cls, parent, text), S.button(...), S.up(action), S.field(k, v), S.action(op, i),
 * S.paint(model), S.navToggle(), S.snap, S.visible, S.center, S.cc(email) (the ' · Cc: ...' text) and
 * S.sentNotes(content, i, m). The template draws no random numbers; an override must not either.
 * State of a design that lives longer than a part (a flag, a tab map) goes in a `let` of the widget file's closure,
 * reset in `begin`.
 *
 * Hooks (default: nothing) and parts, in render order:
 *   begin(ctx)                         start of render, before any element (instruction rewrites)
 *   rootDecor(ctx)                     after the surface is created (default: the civic watermark)
 *   button(parent, label, key, act, icon, cls) -> button      every button; key registers a locate target
 *   icon(k) -> svg markup              icon k from S.paths     panel(cls, title) -> section
 *   newButton() -> button              the New button          toolbarStar()  the Star / Mark important buttons
 *   toolbarMade()                      after the toolbar       searchInput(searchline) -> input   the search box
 *   searchMade(), makeColumns(col), columnsMade(), listMade(), docMade()   after each piece is built
 *   contactsStart(), contactButton(p) -> button, contactMade(b, p), contactsMade()   the contact list
 *   panelsMade()                       before the panels are fixed in place (snap)
 *   snapped()                          after the panels are fixed in place (default: the decor token)
 *   navReady()                         the list title is the folder popup trigger; before the folder buttons
 *   navToggle()                        opens / closes the folder popup
 *   folderIcon(v) -> icon, folderAction(v) -> action, folderStart(v), folderMade(v, b), foldersMade(),
 *   paintFolders(m)                    the folder buttons (foldersMade: after all of them)
 * The message list (rebuilt when listKeyOf changes):
 *   listOrder(m) -> [index], listKeyOf(m, order) -> string, listReset(), listStart(m, order)
 *   occupiedKeep(v) -> bool, occupiedSize(v) -> px, availHeight(occupied) -> px     room left for the list
 *   rowHeightPx(avail, order) -> px, listSize(avail, rowH, order), listSized(m, order, rowH, avail)
 *   rowInit(r, e, i), rowHead(r, e, i), rowSender(r, e, i), rowTime(r, e, i), rowFlagsStart(flags, e, i),
 *   rowFlag(row, i, op, primary) -> button     pieces of a row
 *   rowsBuilt(m, order, rowH, avail), listboxOptions(m, order, rowH) -> options of env.ui.listbox,
 *   applyScroll(m, order, rowH), listBuilt(m, order, rowH, avail), listKept(m)   (a paint that keeps the list)
 * The message view (rebuilt when the open email changes):
 *   docStart(d), toolsStart(d), docBack(tools), docOp(tools, label, op, i), toolsDone(d, m, i),
 *   docMeta(meta, e, i, m, d), docContent(d, e, i, m), attachment(content, a, e), docActions(d, e, i, m),
 *   docDone(d, e, i, m), docFlags(m, i), docPainted(m, i)
 * The editor (rebuilt when the mode changes):
 *   editorTitleText(shown) -> text, editorTitle(shown) -> el, editorTitleMade(title, shown, c),
 *   editorFields(group, shown), editorRow(group, k, label, shown), editorRowMade(row, k, inp, shown),
 *   editorFormat(shown), editorBody(shown) -> textarea, editorActions(shown), actionsStart(acts, shown),
 *   cancelButton(acts, shown), cancelMade(acts, shown), actionsMade(acts, shown), editorMade(m, shown, c)
 * Every paint: paintClasses(m) (class toggles at the start), painted(m) (the end).
 * Locate (each returns [x, y], or undefined to fall through to the next check):
 *   locateEarly(t), locateBack(t), locateAction(t), locateFolder(t), locateRow(t), locateScroll(t),
 *   locateSearch(t), locateRowIcon(t), locateKeyed(t)
 */
(function () {
  'use strict';

  const PATHS = {
    mail: 'M3 5h18v14H3z M3 5l9 7 9-7',
    star: 'm12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z',
    important: 'M5 3v19 M5 4h14l-3 5 3 5H5',
    delete: 'M4 6h16 M9 6V3h6v3 M6 6l1 15h10l1-15 M10 10v7 M14 10v7',
    archive: 'M3 4h18v4H3z M5 8v13h14V8 M9 12h6',
    inbox: 'M3 4h18v16H3z M3 13h5l2 3h4l2-3h5',
    reply: 'M10 5 3 11l7 6v-4c6 0 9 1 11 6-1-8-5-11-11-11z',
    replyall: 'm9 5-6 6 6 6 M15 5l-6 6 6 6v-4c4 0 6 1 8 5-1-7-4-10-8-10z',
    forward: 'M14 5l7 6-7 6v-4H3V9h11z',
    move: 'M2 7V4h8l2 3h10v14H2z',
    unread: 'M3 5h18v14H3z M3 5l9 7 9-7',
    new: 'M3 5h15v14H3z M15 2v8 M11 6h8',
    send: 'm2 3 20 9-20 9 4-9z M6 12h16',
    close: 'm5 5 14 14 M19 5 5 19',
    file: 'M5 2h9l5 5v15H5z M14 2v6h5 M8 12h8 M8 16h8',
  };

  const LABELS = { sent: 'Sent', drafts: 'Drafts', junk: 'Junk', spam: 'Spam', templates: 'Templates', compose: 'Compose' };

  const TOKENS = {
    style: 'civic',
    decor: null,
    stack: false,
    rowHeight: 52,
    rowBasis: 'window',
    rowMin: 22,
    rowRef: 1672,
    folderList: ['inbox', 'starred', 'important', 'archive', 'trash'],
    folderBase: ['inbox', 'starred', 'important', 'archive', 'trash'],
    folderLabels: {},
    paths: {},
    foldersTitle: null,
    ledgerTitle: 'Inbox',
    docTitle: 'Message',
    contactsTitle: null,
    toolbarIn: 'ledger',
    newLabel: 'New Message',
    newIcon: 'new',
    newIn: 'toolbar',
    newClass: '',
    toolbarOps: [['Reply', 'reply'], ['Reply All', 'replyall'], ['Forward', 'forward'], ['Delete', 'delete']],
    starLabel: 'Star',
    importantLabel: 'Mark important',
    importantIcon: 'star',
    toolbarBefore: [],
    toolbarAfter: [],
    searchIn: 'ledger',
    listStatusIn: 'ledger',
    searchPlaceholder: 'Search messages...',
    searchLabel: 'Search messages',
    columns: ['From', 'Subject', 'Date', ''],
    needsToolsExcept: ['reply', 'forward', 'star-reply'],
    scrollToRowIcon: true,
    replyTitle: 'Reply to ',
    replyNamed: true,
    forwardTitle: 'Forward this email',
    newTitle: 'New message',
    fieldLabels: [['to', 'To'], ['cc', 'Cc'], ['subject', 'Subject']],
    keyboard: false,
    fieldColon: false,
    fieldKeyClass: false,
    replyPlaceholder: 'Write your reply…',
    forwardPlaceholder: 'Forwarded message',
    formatKeys: ['B', 'I', 'U', '≡', '↗'],
    cancelLabel: 'Cancel',
    sendIcon: 'send',
    locateScrollKinds: ['folder'],
  };

  // What most sites of one scenario share (their primary style, folder list, list height...). reply is the template
  // default (design-use-email-reply-01), so it has no preset.
  const SCENARIOS = {
    delete: {
      style: 'mac',
      rowHeight: 40,
      folderList: ['inbox', 'sent', 'drafts', 'archive', 'trash'],
      toolbarAfter: [['Print', 'file']],
    },
    forward: {
      style: 'bauhaus',
      rowHeight: 100,
      folderList: ['inbox', 'starred', 'sent', 'drafts', 'archive', 'trash'],
    },
    important: {
      style: 'gtk',
      rowHeight: 36,
      folderList: ['inbox', 'sent', 'drafts', 'templates', 'junk', 'trash'],
    },
    nl: {
      style: 'irix',
      rowHeight: 36,
      folderList: ['inbox', 'archive', 'trash'],
      decor: 'irix',
      needsToolsExcept: ['reply', 'forward'],
    },
    star: {
      style: 'flash',
      rowHeight: 44,
      folderList: ['inbox', 'compose', 'sent', 'drafts', 'trash'],
      folderLabels: { sent: 'Sent Mail' },
      scrollToRowIcon: false,
    },
    'star-reply': {
      style: 'plain',
      stack: true,
      rowHeight: 34,
    },
  };

  const DECOR = {
    // The irix nl designs: Toolchest icons in the folder panel, the IRIX mark and a mountain backdrop.
    irix(S) {
      const { el, button } = S;
      const { root, folders } = S.els;
      for (const [label, ic] of [
        ['Console', 'file'],
        ['Files', 'move'],
        ['Mail', 'mail'],
        ['Web', 'unread'],
        ['Help', 'important'],
      ])
        button(folders, label, null, null, ic, 'toolchest-icon');
      const mark = el('div', 'irix-watermark', root);
      mark.innerHTML = 'I R I X<small>◇ silicon graphics</small>';
      const mountain = el('div', 'irix-mountain', root);
      mountain.innerHTML =
        '<svg viewBox="0 0 600 300" style="width:100%;height:100%;fill:#26344c;stroke:none" preserveAspectRatio="none"><path d="M0 300V210L80 120l30 22 70-130 105 128 35-18 100 110 45-22 135 90Z"/>' +
        '<path d="M0 300V250l100-55 90 60 88-60 44 53 99-35 80 55 99-10v42" fill="#18253b"/></svg>';
    },
  };

  function snap(e, p) {
    const r = e.getBoundingClientRect(),
      b = p.getBoundingClientRect();
    if (!r.width || !r.height) return;
    e.style.left = Math.round(r.left - b.left) + 'px';
    e.style.top = Math.round(r.top - b.top) + 'px';
    e.style.width = Math.round(r.width) + 'px';
    e.style.height = Math.round(r.height) + 'px';
    e.style.right = 'auto';
    e.style.bottom = 'auto';
  }

  function visible(el) {
    if (!el) return false;
    const r = el.getBoundingClientRect();
    return !!r.width && !!r.height;
  }

  function center(el) {
    if (!el) throw new Error('Missing target');
    const r = el.getBoundingClientRect();
    for (const fx of [0.5, 0.15, 0.85])
      for (const fy of [0.5, 0.25, 0.75]) {
        const x = r.left + r.width * fx,
          y = r.top + r.height * fy;
        const hit = document.elementFromPoint(x, y);
        if (hit && (hit === el || el.contains(hit))) return [x, y];
      }
    return [r.left + r.width / 2, r.top + r.height / 2];
  }

  env.template('use-email/mail', (design, def) => {
    const scenario = def.scenarios[0];
    const fam = () => env.taskDef;

    let ctx;
    let spec;
    let active;
    const E = {};
    let D;
    let P;
    const BASE = {};
    const el = (tag, cls, parent, text) => ctx.util.el(tag, cls, parent, text);
    const button = (...a) => P.button(...a);
    const cc = (e) => (e.cc.length ? ' · Cc: ' + e.cc.map((x) => x.name).join(', ') : '');
    const S = {
      get ctx() { return ctx; },
      get spec() { return spec; },
      get fam() { return fam(); },
      get D() { return D; },
      get P() { return P; },
      get paths() { return D.paths; },
      els: E, scenario, site: def.site,
      el, button, cc, snap, visible, center,
      up: (a) => up(a),
      field: (k, v) => field(k, v),
      action: (op, i) => action(op, i),
      paint: (m) => paint(m),
      navToggle: () => P.navToggle(),
      sentNotes: (content, i, m) => sentNotes(content, i, m),
    };

    // ----------------------------------------------------------------------------------- state changes

    function action(op, i) {
      if (op === 'reply') return { reply: i };
      if (op === 'replyall') return { reply: i, all: true };
      if (op === 'forward') return { forward: i };
      if (['delete', 'archive', 'inbox'].includes(op)) return { move: [[i], op === 'delete' ? 'trash' : op] };
      if (op === 'unread') return { mark: [[i], true] };
      if (op === 'move') return { menu: ctx.model.menu === 'move' ? null : 'move' };
      return { flag: [i, op] };
    }

    function up(a) {
      ctx.update(fam().helpers.act(ctx.model, spec, a));
      paint(ctx.model);
    }

    function field(k, v) {
      if (!ctx.model.compose) {
        const i = ctx.model.open ?? 0;
        ctx.update(fam().helpers.act(ctx.model, spec, { open: i }));
        ctx.update(fam().helpers.act(ctx.model, spec, spec.task === 'forward' ? { forward: i } : { reply: i }));
      }
      ctx.update(fam().helpers.act(ctx.model, spec, { field: [k, v] }));
    }

    function sentNotes(content, i, m) {
      for (const s of m.sent.filter((v) => v.of === i))
        el('div', 'sent-note', content, s.mode === 'reply' ? 'Reply sent to ' + s.to : 'Forwarded to ' + s.to);
    }

    // ------------------------------------------------------------------------------------- basic parts

    BASE.begin = () => {};
    BASE.rootDecor = () => {
      const { root } = E;
      if (D.style === 'civic') {
        const wm = el('div', 'watermark', root);
        wm.innerHTML = P.icon('mail');
        el('strong', '', wm, 'CityMail');
        el('p', '', wm, 'Keeping our community connected.');
      }
    };
    BASE.snapped = () => {
      if (D.decor) DECOR[D.decor](S);
    };
    BASE.icon = (k) => '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + (D.paths[k] || D.paths.mail) + '"/></svg>';
    BASE.button = (parent, label, key, act, ic, cls = '') => {
      const b = el('button', cls, parent);
      b.type = 'button';
      b.title = label;
      b.setAttribute('aria-label', label);
      if (ic) b.innerHTML = P.icon(ic);
      el('span', '', b, label);
      if (key) {
        E.reg.set(key, b);
        b.dataset.target = key;
      }
      if (act)
        b.addEventListener('click', (ev) => {
          ev.stopPropagation();
          up(typeof act === 'function' ? act(ev) : act);
        });
      return b;
    };
    BASE.panel = (cls, title) => {
      const p = el('section', 'panel ' + cls, E.root);
      const t = el('div', 'window-title', p, title);
      el('span', 'gadgets', t, '□ ×');
      return p;
    };
    for (const h of ['foldersMade', 'toolbarMade', 'searchMade', 'columnsMade', 'listMade', 'docMade', 'contactsStart',
      'contactsMade', 'panelsMade', 'listStart', 'listSized', 'listBuilt', 'rowInit', 'rowHead', 'rowFlagsStart',
      'listKept', 'rowsBuilt', 'docStart', 'navReady', 'folderStart', 'docPainted', 'folderMade', 'toolsStart', 'toolsDone', 'docDone', 'editorTitleMade', 'editorRowMade', 'actionsStart', 'cancelMade', 'actionsMade', 'editorMade', 'painted', 'contactMade'])
      BASE[h] = () => {};

    // -------------------------------------------------------------------------------- toolbar and search

    BASE.newButton = () => {
      const parent = D.newIn === 'folders' ? E.folders : E.toolbar;
      return button(parent, D.newLabel, 'compose:new', { compose: true }, D.newIcon, D.newClass);
    };
    BASE.toolbarStar = () => {
      const { toolbar } = E;
      if (['star', 'star-reply', 'nl'].includes(scenario))
        button(toolbar, D.starLabel, 'toolbar:star', () => action('star', ctx.model.open ?? 0), 'star');
      if (['important', 'nl'].includes(scenario))
        button(toolbar, D.importantLabel, 'toolbar:important', () => action('important', ctx.model.open ?? 0), D.importantIcon);
    };
    BASE.searchInput = (searchline) => el('input', '', searchline);
    BASE.makeColumns = (col) => {
      for (const s of D.columns) el('span', '', col, s);
    };

    // ----------------------------------------------------------------------------------------- the list

    BASE.listReset = () => E.list.replaceChildren();
    BASE.listOrder = (m) => fam().helpers.listOrder(m, spec);
    BASE.listKeyOf = (m, order) => JSON.stringify([order, m.view, m.query]);
    BASE.occupiedKeep = (v) => v !== E.listWrap;
    BASE.occupiedSize = (v) => v.getBoundingClientRect().height;
    BASE.availHeight = (occupied) => Math.max(40, E.ledger.clientHeight - occupied);
    BASE.rowHeightPx = (avail) => {
      const width = { window: innerWidth, size: ctx.size.width, stage: ctx.stage.clientWidth, root: E.root.clientWidth }[D.rowBasis];
      return Math.floor(Math.min(avail / spec.rows, Math.max(D.rowMin, (D.rowHeight * width) / D.rowRef)));
    };
    BASE.listSize = (avail, rowH) => {
      E.listWrap.style.flex = 'none';
      E.listWrap.style.height = rowH * spec.rows + 'px';
    };
    BASE.rowFlag = (row, i, op, primary) => {
      const b = el('button', 'row-ico ' + (!primary ? 'secondary' : ''), row);
      b.type = 'button';
      b.title = op === 'delete' ? 'Delete' : op;
      b.setAttribute('aria-label', b.title);
      b.innerHTML = P.icon(op === 'important' && scenario === 'important' ? D.importantIcon : op);
      b.addEventListener('click', (ev) => {
        ev.stopPropagation();
        up(action(op, i));
      });
      E.reg.set('rowIcon:' + i + ':' + op, b);
      return b;
    };
    BASE.rowSender = (r, e) => el('span', 'sender', r, e.name);
    BASE.rowTime = (r, e) => el('span', 'time', r, e.time);
    BASE.listboxOptions = (m, order) => ({
      label: 'mailbox',
      options: order.map((i) => [i, E.rowEls.get(i).r]),
      onChange(v, i) {
        up({ open: i });
      },
      onScroll(v) {
        const s = Math.round(v * 1000) / 1000;
        if (s !== ctx.model.scroll) ctx.update({ ...ctx.model, scroll: s });
      },
      scrollbar: { track: E.track, thumb: E.thumb, minThumb: 25, pad: 2 },
    });
    BASE.applyScroll = (m) => E.lbx.set({ scroll: m.scroll || 0 });

    function buildList(m) {
      const { ledger, list, rowEls, root } = E;
      P.listReset();
      rowEls.clear();
      const order = P.listOrder(m);
      P.listStart(m, order);
      const occupied = [...ledger.children].filter((v) => P.occupiedKeep(v)).reduce((a, v) => a + P.occupiedSize(v), 0);
      const avail = P.availHeight(occupied);
      const rowH = P.rowHeightPx(avail, order);
      P.listSize(avail, rowH, order);
      P.listSized(m, order, rowH, avail);
      root.style.setProperty('--rowpx', rowH + 'px');
      for (const i of order) {
        const e = spec.emails[i],
          r = el('div', 'mail-row', E.list);
        r.dataset.mail = i;
        P.rowInit(r, e, i);
        const cb = el('input', '', r);
        cb.type = 'checkbox';
        cb.title = 'Select ' + e.name;
        cb.addEventListener('click', (ev) => {
          ev.stopPropagation();
          up({ check: i, range: ev.shiftKey });
        });
        E.reg.set('check:' + i, cb);
        P.rowHead(r, e, i);
        P.rowSender(r, e, i);
        const sub = el('div', 'subject', r);
        el('span', 'subject-text', sub, e.subject);
        el('div', 'snippet', sub, e.body.replace(/\n/g, ' ').slice(0, 80));
        P.rowTime(r, e, i);
        const flags = el('div', 'row-flags', r);
        P.rowFlagsStart(flags, e, i);
        const main = scenario === 'delete' ? 'delete' : scenario === 'important' ? 'important' : 'star';
        const fs = {};
        for (const op of [main, ...['star', 'important', 'delete'].filter((v) => v !== main)])
          fs[op] = P.rowFlag(flags, i, op, op === main || scenario === 'nl');
        rowEls.set(i, { r, cb, fs });
        E.reg.set('row:' + i, r);
      }
      P.rowsBuilt(m, order, rowH, avail);
      E.lbx = env.ui.listbox(E.list, P.listboxOptions(m, order, rowH));
      P.applyScroll(m, order, rowH);
      if (ctx.model.rowPx !== rowH || !!ctx.model.stack !== D.stack) ctx.update({ ...ctx.model, rowPx: rowH, stack: D.stack });
      P.listBuilt(m, order, rowH, avail);
    }

    // --------------------------------------------------------------------------------------- the folders

    BASE.contactButton = (p) =>
      button(E.cp, p.name, null, () => {
        const m = ctx.model;
        if (!m.compose) return {};
        return { field: ['to', p.name] };
      });
    BASE.navToggle = () => {
      E.navExpanded = !E.navExpanded;
      E.folders.classList.toggle('folder-popup', E.navExpanded);
    };
    BASE.folderIcon = (v) => (D.paths[v] ? v : 'move');
    BASE.folderAction = (v) => ({ view: v });
    BASE.paintFolders = (m) => {
      for (const [v, b] of E.folderButtons) b.classList.toggle('active', (m.view || 'inbox') === v);
    };

    // ------------------------------------------------------------------------------------ message view

    BASE.docBack = (tools) => {
      if (D.stack) button(tools, 'Inbox', 'back', { back: true }, 'inbox', 'back-control');
    };
    BASE.docOp = (tools, label, op, i) => button(tools, label, 'action:' + op, () => action(op, ctx.model.open ?? i), op);
    BASE.docMeta = (meta, e) => {
      el('h2', '', meta, e.subject);
      el('div', '', meta, 'From: ' + e.name);
      el('div', 'address', meta, '<' + e.addr + '>');
      el('div', '', meta, 'To: ' + spec.me.name + cc(e));
      el('div', 'address', meta, e.time);
    };
    BASE.attachment = (content, a) => {
      const b = el('div', 'attachment', content);
      b.innerHTML = P.icon('file');
      el('span', '', b, a.file + ' (' + a.size + ')');
    };
    BASE.docContent = (d, e, i, m) => {
      const content = (d.content = el('div', 'message-content', E.docInside, e.body));
      for (const a of e.att) P.attachment(content, a, e);
      sentNotes(content, i, m);
    };
    BASE.docActions = (d, e, i) => {
      d.acts = el('div', 'doc-actions', E.docInside);
      for (const [label, op] of [
        ['Reply', 'reply'],
        ['Reply all', 'replyall'],
        ['Forward', 'forward'],
      ])
        button(d.acts, label, 'action:' + op, () => action(op, ctx.model.open ?? i), op);
    };
    BASE.docFlags = (m, i) => {
      for (const [op, flag] of [
        ['star', 'starred'],
        ['important', 'important'],
      ]) {
        const b = E.reg.get('action:' + op);
        if (b) b.classList.toggle('on', m.flags[i][flag]);
      }
    };

    function paintDoc(m) {
      const { doc, docInside } = E;
      const i = m.open ?? m.compose?.of ?? 0,
        e = spec.emails[i];
      const key = JSON.stringify([i, m.open, m.box[i], m.sent.length, !!m.compose]);
      if (key !== E.readKey) {
        E.readKey = key;
        docInside.replaceChildren();
        const d = (E.d = {});
        P.docStart(d);
        const tools = (d.tools = el('div', 'doc-tools', docInside));
        P.toolsStart(d);
        P.docBack(tools);
        for (const op of fam().helpers.toolbarOps(m, i)) {
          const labels = {
            delete: 'Delete',
            important: 'Mark important',
            star: 'Star',
            unread: 'Mark unread',
            inbox: 'Restore',
            move: 'Move to',
            archive: 'Archive',
          };
          P.docOp(tools, labels[op], op, i);
        }
        P.toolsDone(d, m, i);
        const meta = (d.meta = el('div', 'doc-meta', docInside));
        P.docMeta(meta, e, i, m, d);
        P.docContent(d, e, i, m);
        P.docActions(d, e, i, m);
        P.docDone(d, e, i, m);
        if (m.open === null && !m.compose) doc.classList.add('preview');
        else doc.classList.remove('preview');
        doc.classList.toggle('trash-view', m.box[i] === 'trash');
      }
      P.docFlags(m, i);
      const old = doc.querySelector('.move-menu');
      if (old) old.remove();
      if (m.menu === 'move') {
        const menu = el('div', 'move-menu', doc);
        for (const f of spec.folders) button(menu, f, 'moveTo:' + f, { move: [[m.open], f] }, 'move');
      }
      P.docPainted(m, i);
    }

    // -------------------------------------------------------------------------------------- the editor

    BASE.editorTitleText = (shown) =>
      shown.mode === 'forward'
        ? D.forwardTitle
        : shown.mode === 'new'
          ? D.newTitle
          : D.replyTitle + (D.replyNamed ? spec.emails[shown.of ?? 0].name : '');
    BASE.editorTitle = (shown) => el('div', 'window-title', E.editor, P.editorTitleText(shown));
    BASE.editorRow = (group, k, label, shown) => {
      const row = el('label', D.fieldKeyClass ? 'field-row field-' + k : 'field-row', group);
      el('span', '', row, D.fieldColon ? label + ':' : label);
      const inp = el('input', '', row);
      inp.type = 'text';
      inp.spellcheck = false;
      inp.autocomplete = 'off';
      inp.setAttribute('aria-label', label);
      E.fields[k] = env.ui.textField(inp, { value: shown[k] || '', label: k, ...(D.keyboard && { keyboard: true }), onInput: (v) => field(k, v) });
      E.reg.set('field:' + k, inp);
      P.editorRowMade(row, k, inp, shown);
      return row;
    };
    BASE.editorFields = (group, shown) => {
      for (const [k, label] of D.fieldLabels) P.editorRow(group, k, label, shown);
    };
    BASE.editorFormat = () => {
      const fmt = el('div', 'formatbar', E.editor);
      for (const s of D.formatKeys) el('span', '', fmt, s);
    };
    BASE.editorBody = (shown) => {
      const area = el('textarea', '', E.editor);
      area.placeholder = shown.mode === 'forward' ? D.forwardPlaceholder : D.replyPlaceholder;
      area.spellcheck = false;
      E.fields.body = env.ui.textField(area, { value: shown.body || '', label: 'body', ...(D.keyboard && { keyboard: true }), onInput: (v) => field('body', v) });
      E.reg.set('field:body', area);
      return area;
    };
    BASE.cancelButton = (acts) => button(acts, D.cancelLabel, 'compose:discard', { discard: true });
    BASE.editorActions = (shown) => {
      const acts = el('div', 'editor-actions', E.editor);
      P.actionsStart(acts, shown);
      P.cancelButton(acts, shown);
      P.cancelMade(acts, shown);
      button(
        acts,
        'Send',
        'compose:send',
        () => {
          if (!ctx.model.compose) return {};
          return { send: true };
        },
        D.sendIcon,
        'send',
      );
      P.actionsMade(acts, shown);
    };

    function paintEditor(m) {
      const { editor } = E;
      const c = m.compose,
        shown = c || {
          mode: spec.task === 'forward' ? 'forward' : 'reply',
          of: m.open ?? 0,
          to: spec.task === 'forward' ? '' : spec.emails[m.open ?? 0].name,
          cc: '',
          subject: (spec.task === 'forward' ? 'Fwd: ' : 'Re: ') + spec.emails[m.open ?? 0].subject,
          body: spec.task === 'forward' ? spec.emails[m.open ?? 0].body : '',
        };
      const key = JSON.stringify([!!c, shown.mode, shown.of]);
      if (E.editorKey !== key) {
        E.editorKey = key;
        editor.replaceChildren();
        E.fields = {};
        const title = P.editorTitle(shown);
        if (!c) {
          title.setAttribute('role', 'button');
          title.dataset.target = 'action:' + shown.mode;
          title.style.cursor = 'pointer';
          title.addEventListener('click', () => up(shown.mode === 'forward' ? { forward: shown.of } : { reply: shown.of }));
          E.reg.set('action:' + shown.mode, title);
        }
        P.editorTitleMade(title, shown, c);
        const group = el('div', 'editor-fields', editor);
        P.editorFields(group, shown);
        P.editorFormat(shown);
        P.editorBody(shown);
        P.editorActions(shown);
      } else for (const [k, f] of Object.entries(E.fields)) if (f.get() !== (shown[k] || '')) f.set(shown[k] || '');
      E.root.classList.toggle('composing', !!c);
      E.root.classList.toggle('opened', m.open !== null);
      editor.classList.toggle('preview-editor', !c);
      P.editorMade(m, shown, c);
    }

    // ---------------------------------------------------------------------------------------- painting

    BASE.paintClasses = (m) => {
      E.doc.classList.toggle('recovery-flags', fam().helpers.sideEffects(m, spec).length > 0);
      E.doc.classList.toggle('needs-tools', scenario === 'nl' && !D.needsToolsExcept.includes(spec.task));
      E.root.classList.toggle('has-query', !!m.query);
      E.root.classList.toggle('has-cc', !!m.compose?.cc);
    };

    function paint(m) {
      const { status, modal, rowEls } = E;
      P.paintClasses(m);
      const order = P.listOrder(m),
        lk = P.listKeyOf(m, order);
      if (lk !== E.listKey) {
        buildList(m);
        E.listKey = lk;
      } else P.listKept(m);
      for (const [i, r] of rowEls) {
        r.r.classList.toggle('selected', m.open === i);
        r.r.classList.toggle('unread', m.flags[i].unread);
        r.cb.checked = m.checked.includes(i);
        r.fs.star.classList.toggle('on', m.flags[i].starred);
        r.fs.important.classList.toggle('on', m.flags[i].important);
      }
      E.all.checked = !!order.length && order.every((i) => m.checked.includes(i));
      E.listStatus.textContent = order.length + ' messages';
      P.paintFolders(m);
      if (E.sf.get() !== (m.query || '')) E.sf.set(m.query || '');
      paintDoc(m);
      paintEditor(m);
      status.replaceChildren();
      status.hidden = !m.toast;
      if (m.toast) {
        el('span', '', status, m.toast.kind === 'send' ? 'Message sent.' : 'Messages moved to ' + fam().helpers.viewLabel(m.toast.kind));
        button(status, 'Undo', 'toast:undo', { undo: true });
        button(status, 'Close', 'toast:close', { toastClose: true });
      }
      modal.replaceChildren();
      modal.hidden = !m.confirm;
      if (m.confirm) {
        const dialog = el('div', 'dialog', modal);
        dialog.setAttribute('role', 'dialog');
        el('h3', '', dialog, 'Delete this conversation?');
        el('p', '', dialog, 'It will be moved to Trash.');
        button(dialog, 'Cancel', 'confirm:cancel', { confirm: false });
        button(dialog, 'Delete', 'confirm:ok', { confirm: true }, 'delete');
      }
      P.painted(m);
    }

    // -------------------------------------------------------------------------------------------- locate

    BASE.locateEarly = () => undefined;
    BASE.locateBack = (t) => {
      if (t.back) return center(E.reg.get('back'));
    };
    BASE.locateAction = (t) => {
      const { reg, root, doc, lbx } = E;
      if (t.action) {
        let b = reg.get('action:' + t.action);
        if (!visible(b)) {
          b =
            [...root.querySelectorAll('[data-target="action:' + t.action + '"]')].find(visible) ||
            reg.get('toolbar:' + t.action);
        }
        if (!visible(b) && ['star', 'important', 'delete'].includes(t.action)) {
          b = reg.get('rowIcon:' + ctx.model.open + ':' + t.action);
          if (b && D.scrollToRowIcon) lbx.scrollTo(ctx.model.open, 'center');
        }
        if (visible(b)) return center(b);
        if (t.action === 'inbox') {
          doc.classList.add('show-restore');
          return center(reg.get('action:inbox'));
        }
      }
    };
    BASE.locateFolder = (t) => {
      if (t.folder !== undefined) {
        const b = E.reg.get('folder:' + t.folder);
        if (!visible(b)) {
          if (!visible(E.navTrigger)) {
            E.navTrigger.style.display = 'flex';
          }
          return center(E.navTrigger);
        }
      }
    };
    BASE.locateRow = (t) => {
      if (t.row !== undefined) return E.lbx.locateOption(t.row);
    };
    BASE.locateScroll = (t) => {
      if (t.scroll !== undefined) return E.lbx.locateThumbFor(t.scroll);
    };
    BASE.locateSearch = (t) => {
      if (t.search) return center(E.search);
    };
    BASE.locateRowIcon = (t) => {
      if (t.rowIcon) {
        const b = E.reg.get('rowIcon:' + t.rowIcon[0] + ':' + t.rowIcon[1]);
        const p = center(b),
          hit = document.elementFromPoint(...p);
        if (hit && (hit === b || b.contains(hit))) return p;
        return E.lbx.locateOption(t.rowIcon[0]);
      }
    };
    BASE.locateKeyed = (t) => {
      for (const k of ['folder', 'action', 'moveTo', 'field', 'compose', 'confirm', 'toast'])
        if (t[k] !== undefined) {
          const v = E.reg.get(k + ':' + t[k]);
          if (v) {
            if (D.locateScrollKinds.includes(k)) v.scrollIntoView({ block: 'nearest' });
            return center(v);
          }
        }
    };

    function locate(t) {
      const obstruction = document.querySelector('.obstruction:not([hidden]) button[data-dismiss]');
      if (obstruction && !t.list && t.thumb === undefined && t.scroll === undefined) return center(obstruction);
      let p = P.locateEarly(t);
      if (p) return p;
      if ((p = P.locateBack(t))) return p;
      if ((p = P.locateAction(t))) return p;
      if ((p = P.locateFolder(t))) return p;
      if ((p = P.locateRow(t))) return p;
      if (t.thumb !== undefined) return E.lbx.locateThumb();
      if ((p = P.locateScroll(t))) return p;
      if (t.list) return center(E.list);
      if ((p = P.locateSearch(t))) return p;
      if ((p = P.locateRowIcon(t))) return p;
      if (t.check !== undefined) return center(E.reg.get('check:' + t.check));
      if (t.checkAll) return center(E.all);
      if ((p = P.locateKeyed(t))) return p;
      throw new Error('Cannot locate ' + JSON.stringify(t));
    }

    ({ D, P } = env.templateDesign('use-email/mail', design, def, { tokens: TOKENS, scenarios: SCENARIOS, base: BASE, state: S }));
    D.paths = { ...PATHS, ...D.paths };
    D.folderLabels = { ...LABELS, ...D.folderLabels };

    return {
      render(c) {
        ctx = c;
        spec = c.spec;
        for (const k of Object.keys(E)) delete E[k];
        Object.assign(E, {
          reg: new Map(),
          lbx: null,
          listKey: null,
          readKey: null,
          editorKey: null,
          fields: {},
          rowEls: new Map(),
          navExpanded: false,
          folderButtons: new Map(),
        });
        P.begin(ctx);
        const root = (E.root = el('div', 'mail-surface', ctx.stage));
        root.dataset.style = D.style;
        P.rootDecor(ctx);
        const folders = (E.folders = P.panel('folders', D.foldersTitle ?? (D.style === 'irix' ? 'Toolchest' : 'Mailboxes')));
        const ledger = (E.ledger = P.panel('ledger', D.ledgerTitle));
        E.toolbar = el('div', 'toolbar', { ledger, root, folders }[D.toolbarIn]);
        const toolbar = E.toolbar;
        P.newButton();
        for (const [label, op] of D.toolbarOps)
          button(toolbar, label, 'toolbar:' + op, () => action(op, ctx.model.open ?? 0), op);
        for (const [label, ic, cls] of D.toolbarBefore) button(toolbar, label, null, null, ic, cls);
        P.toolbarStar();
        for (const [label, ic, cls] of D.toolbarAfter) button(toolbar, label, null, null, ic, cls);
        P.toolbarMade();
        const searchline = (E.searchline = el('div', 'searchline', D.searchIn === 'root' ? root : ledger));
        const search = (E.search = P.searchInput(searchline));
        search.placeholder = D.searchPlaceholder;
        search.type = 'search';
        search.setAttribute('aria-label', D.searchLabel);
        E.reg.set('search', search);
        E.sf = env.ui.textField(search, { value: ctx.model.query || '', label: 'search', ...(D.keyboard && { keyboard: true }), onInput: (v) => up({ query: v }) });
        P.searchMade();
        const col = (E.col = el('div', 'columns', ledger));
        const all = (E.all = el('input', '', col));
        all.type = 'checkbox';
        all.setAttribute('aria-label', 'Select all');
        all.addEventListener('change', () => up({ checkAll: all.checked }));
        E.reg.set('checkAll', all);
        P.makeColumns(col);
        P.columnsMade();
        const listWrap = (E.listWrap = el('div', 'list-wrap', ledger));
        E.list = el('div', 'message-list', listWrap);
        E.track = el('div', 'scrolltrack', listWrap);
        E.thumb = el('div', 'scrollthumb', E.track);
        E.listStatus = el('div', 'ledger-status', D.listStatusIn === 'root' ? root : ledger);
        P.listMade();
        const doc = (E.doc = P.panel('document', D.docTitle));
        const docInside = (E.docInside = el('div', 'document-inner', doc));
        docInside.style.cssText = 'display:flex;flex:1;min-height:0;flex-direction:column';
        P.docMade();
        const editor = (E.editor = P.panel('editor', 'Reply'));
        const contact = (E.contact = P.panel(
          'contacts',
          D.contactsTitle ??
            (D.style === 'precision' ? 'Task Progress' : D.style === 'next' ? 'Message Inspector' : 'Contacts'),
        ));
        const cp = (E.cp = el('div', 'contact-list', contact));
        P.contactsStart();
        // By name, so the forward recipient (spec.dest) is one contact among the others, not the first.
        const folks = (E.folks = [...(spec.dest ? [spec.dest] : []), ...spec.emails.slice(0, 7)]
          .sort((a, b) => a.name.localeCompare(b.name)));
        const seen = new Set();
        for (const p of folks) {
          if (seen.has(p.name)) continue;
          seen.add(p.name);
          P.contactMade(P.contactButton(p), p);
        }
        P.contactsMade();
        P.panelsMade();
        for (const p of root.querySelectorAll('.panel')) snap(p, ctx.stage);
        P.snapped();
        E.status = el('div', 'status-toast', root);
        E.modal = el('div', 'modal', root);

        E.navExpanded = false;
        E.navTrigger = ledger.querySelector('.window-title');
        E.navTrigger.style.cursor = 'pointer';
        E.navTrigger.addEventListener('click', () => P.navToggle());
        P.navReady();
        for (const v of [...new Set([...D.folderList, ...D.folderBase, ...spec.folders])]) {
          P.folderStart(v);
          const b = button(
            folders,
            D.folderLabels[v] || fam().helpers.viewLabel(v),
            'folder:' + v,
            () => {
              E.navExpanded = false;
              folders.classList.remove('folder-popup');
              return P.folderAction(v);
            },
            P.folderIcon(v),
            'folder',
          );
          E.folderButtons.set(v, b);
          if (!D.folderList.includes(v)) b.classList.add('extra-folder');
          P.folderMade(v, b);
        }
        P.foldersMade();
        paint(ctx.model);
        active = { locate };
        return { anchors: [root], sync: paint };
      },
      locate(t) {
        return active.locate(t);
      },
    };
  });
})();
