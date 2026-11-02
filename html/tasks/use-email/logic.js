/*
 * use-email: read, sort, reply to, forward and compose mail in a web mail client.
 * A web mail client (folders, search, inbox list with row checkboxes, message view, compose).
 * MiniWoB counterparts: email-inbox, email-inbox-delete, -forward, -forward-nl, -forward-nl-turk, -important,
 * -nl-turk, -noscroll, -reply, -star-reply. Inputs: pointer, keyboard (typing recipients, replies, search)
 * and wheel (the inbox list and the message body scroll inside their own panes; the page never scrolls).
 *
 * scenarios (spec.task is the job)
 *   delete       trash one email                       star         star one email
 *   important    mark one email important              reply        reply to the sender with a given text
 *   forward      forward one email (body unchanged) to a contact
 *   star-reply   star one email and reply to it
 *   nl           any single-email task, phrased from a looser natural-language bank (MiniWoB -nl / -nl-turk)
 *   archive      archive one email (not delete)        move         move one email to a named custom folder
 *   unread       mark one (read) email as unread
 *   bulk         act on every email matching a criterion (from one sender, with attachments, unread) with
 *                the row checkboxes (or the select-all box after a search) and the bulk toolbar:
 *                delete / archive / mark read / star
 *   reply-all    the target has people in Cc; the goal says reply to the sender only (Reply, Cc empty) or
 *                reply to everyone (Reply all, Cc kept): the reply-all trap
 *   compose      write a new email to a contact (To, Subject, Body) and send it
 *   search       a long inbox (14-24 emails, ood 30-50); the oracle types in the search box to filter the list
 *   attachment   a single-email task whose target is named by its attachment ("forward the one with the PDF")
 *   undo         undo what was done: the start state has the target already deleted / archived / filed in a custom
 *                folder / reported as spam (spec.undo { kind: 'trash' | 'archive' | 'folder' | 'spam', box }); the
 *                goal ("Restore the email from X", "{ref} was archived by mistake", or a vaguer "Undo what was done
 *                to {ref}") is to get it back into the inbox, through the folder list and the message toolbar's
 *                Restore / Move to Inbox / Not spam (or the Undo toast when the start still shows it: spec.toast0).
 *                Other mail lives in those folders on purpose (spec.home[i] = where email i lives at the start,
 *                often the same folder as the target) and must stay there: restoring or moving them is penalised.
 *                A Spam folder (model.junk, toolbar op 'spam') exists only when spec.spam. Graded error, see below.
 * How the target is named (spec.by): 'sender' (unique sender), 'subject', 'content' (a reference code in the
 * body: order, invoice, tracking, booking, ticket, case), 'attachment' (the only email with a PDF / spreadsheet
 * / photo ...), 'sender-subject' (the sender has two emails), 'sender-order' (the latest / older of two).
 * Senders repeat in most inboxes, so when the goal is by subject or content the sender alone is ambiguous.
 * Inboxes hold 3-12 emails (search 14-24, bulk 6-14; ood up to 50). spec.rows rows are visible in the list
 * pane at a time (the widget sizes rows so exactly that many fit).
 *
 * Modes sampled per episode
 *   spec.confirm      deleting asks for confirmation in a dialog (35%)
 *   spec.recoverable  (opts.recover ?? 50%) the first wrong final choice (deleting an email that should stay,
 *                     sending a wrong message) does not end the episode: an "Undo" toast appears (deleted ->
 *                     trash, sent -> unsent and back in the draft) and the error carries the penalty until it
 *                     is undone (or the email is restored from the Trash folder); a second wrong final choice
 *                     ends it. Not recoverable: the first one ends it (MiniWoB behavior).
 *   spec.route        how the oracle scrolls the list: 'wheel' | 'thumb' (scrollbar drag); 'search' for the
 *                     search scenario (and some bulk episodes): type the key in the search box
 *   spec.direct       star / important / delete from the row icons instead of the message toolbar
 *   spec.shift        bulk: select a contiguous run with click + Shift-click
 *   widget traits (opts.traits; only widgets that declare them): rowIcons (row icons the widget has, default star /
 *                     important / archive / delete -> spec.icons), select: 'modifier' (a plain click selects one
 *                     row, Ctrl-click ticks -> spec.ctrlTick, the toolbar acts on the ticked rows), keys (the
 *                     Delete key trashes the open email -> spec.keyDel for 50% of single-email delete goals), search (a working search box; the base widgets declare it).
 * opts.route (input-route eval axis, undefined = today's mix): 'keyboard' makes single-email goals and bulk goals
 *   found by typing in the search box (spec.route 'search'; only for widgets with traits.search, i.e. a working search box) and the Delete key where the widget has it; 'wheel' / 'pointer'
 *   force the list's wheel / scrollbar-thumb route (spec.route 'wheel' / 'thumb'); scenarios without the choice ignore it.
 * traits.fullDate (opt-in): each email also gets e.date = { y, mo (0-11), d, dow (0 = Sun), hm, line } from the
 *   'date' fork, a real calendar date ("Tue, Mar 12, 2013, 5:12 PM") that agrees with the list's short time label
 *   (older labels are then the true date). Display only; nothing is scored or planned on it. Without the trait
 *   emails have no `date` and every draw and label is unchanged.
 * Start modes: off, scene (the reference screen's unsolved state: the target open and scrolled into the list;
 * reply / forward / star-reply also have the untouched composer open, as the Reply / Forward button leaves it:
 * Reply to the sender with an empty body, Forward with empty To; compose an empty new message; undo the folder
 * holding the target shown with it open; bulk nothing; no scored progress, not in the default training mix),
 * partial (target already open, a half-written draft, the first of two jobs done, part of
 * the bulk selection made or applied), wrong (another email starred / archived / moved / trashed with its
 * Undo toast, a reply-all draft for a sender-only reply, a draft to the wrong person, wrong rows ticked, a
 * stale search), solved.
 *
 * spec   { scenario, task, nl, rows, isplit, csplit, ood, startMode, recoverable, confirm, route, direct, shift,
 *          me: { name, addr },
 *          emails: [{ name, first, addr, subject, body, time, date? (traits.fullDate), cc: [{ name, addr }], att: [{ file, ext, group,
 *                     size }], ref: { label, code } | null, starred, important, unread }]   (start flags)
 *          folders: [custom folder names], spam (bool: the client has a Spam folder), icons, ctrlTick, keyDel (traits),
 *          undo: { kind, box }, home: [where each email lives at the start; 'inbox' unless undo], say ('vague' |
 *          'specific'), toast0 (the wrong action's Undo toast is up at the start)   (undo only)
 *          target: index | null, by, refName (the name the goal uses), group (attachment group), order
 *          ('latest' | 'oldest'), searchKey,
 *          reply (text), dest: { name, addr } (forward), replyAll (bool), folder (move),
 *          bulk: { op: 'trash' | 'archive' | 'read' | 'star', crit: 'sender' | 'attachment' | 'unread', name? },
 *          targets: [indices] (bulk),
 *          mail: { to: { name, addr }, subject, body } (compose) }
 * model  { flags: [{ starred, important, unread }]   per email
 *          box: ['inbox' | 'archive' | 'trash' | 'spam' | <folder>]   where each email lives; junk: true when there is a Spam folder
 *          view: 'inbox' | 'starred' | 'important' | 'archive' | 'trash' | <folder>   folder shown in the list
 *          query: string                        search box text (filters the list of the current view)
 *          checked: [indices], anchor: index | null   row checkboxes; anchor = last plain-clicked (Shift range)
 *          open: index | null                   email in the message view
 *          menu: null | 'move'                  the "Move to" popup of the message toolbar
 *          confirm: null | { of: [indices] }    pending delete confirmation
 *          compose: null | { mode: 'reply' | 'forward' | 'new', of, to, cc, subject, body }
 *          sent: [compose drafts as sent]
 *          toast: null | { kind: <box>, of, from } | { kind: 'send', at, msg }   the Undo toast
 *          strikes, lastStrike                  wrong final choices made so far (wrong deletes / sends)
 *          scroll: float                        first visible list position (mirrored from the list pane)
 *          rowPx, stack                         layout facts mirrored by the widget (row height in px for wheel
 *                                               plans; list-then-detail layout where the list hides while a
 *                                               message or a draft is shown) }
 * The list shows the emails of model.view that match model.query, in spec order (newest first).
 *
 * error  (tau 0, sigma 0.5) base in [0, 1] plus penalties
 *   one-email flag / box tasks: 0 when done; 0.5 while the target is open (the move menu counts as open); else 1
 *   undo: 0 when the target is back in the inbox; 0.5 while it is open; 0.75 while the folder holding it is shown; else 1.
 *     The penalties below apply to the other mail (+0.5 for each one taken out of the box it lived in)
 *   reply / forward / compose: 1 - credit; credit = 0.2 (target open, or any draft of it; compose: a new
 *     draft exists) + for the best draft of the right kind: 0.15 + 0.15 * to + 0.1 * cc + 0.25 * body
 *     (compose: 0.15 body + 0.1 subject) + 0.15 if it was sent exactly right. to = 1 - edit distance to the
 *     name or address (case-insensitive), cc = Jaccard overlap of the Cc people (empty wanted unless reply
 *     all), body = 1 - normalized edit distance (trimmed)
 *   star-reply: 0.3 * star + 0.7 * reply
 *   bulk: mean over targets of 0 (done), 0.5 (ticked), 1
 *   penalties: +1 per email in the trash that should not be; +0.5 per wrong sent message; +0.5 per other email
 *   moved out of the inbox (archive / folder); +0.2 per star / important flag changed on an email that is not
 *   a goal; +0.1 per ticked checkbox on an email that is not a goal
 *   ended(): strikes > (recoverable ? 1 : 0) -> 'wrong-delete' | 'wrong-send'. Never on a correct action.
 *
 * levels (opts.level easy | medium; normal is the task as above): a short inbox that fits the list pane (easy 3-4
 * emails, medium rows to rows + 2; search 6-8 / 9-12, bulk 4-5 / 6-8, undo 4-5 / 5-7), the email named by its unique sender
 * (medium: sender or subject), easy without a delete confirmation dialog. Level starts (spec.lead, with a start mode 'off', never with
 * a judge mode): easy always, medium for some episodes. 'scene' (easy single-email tasks, medium compose 60%): the target open with its
 * composer, compose an empty new message; 'open' (medium single-email 60%): the target open; 'ticked' (bulk, spec.leadN rows ticked: all
 * but one on easy, half on medium at 40%); 'view' (undo: the folder holding the target shown with it open; easy always, medium 50%).
 * spec.direct (row icons for star / important / delete) is forced on easy and 80% on medium.
 *
 * judge modes (judgeModes ambiguous, impossible, confirm; spec.judge = { mode, message, cands, templates, vars }):
 *   ambiguous   two senders share a first name ("Delete the email from John" -- John Smith / John Park; bodies are
 *               rewritten to match); the reply must ask (status ask) naming both, one option each (cands: full
 *               name, last name or address of each; others: the other senders, never offered)
 *   impossible  "Delete the email from <nobody>" or "Move the email from <sender> to the "Receipts" folder" (no such folder);
 *               status impossible naming what is missing (what: the sender's name or the folder)
 *   confirm     the normal task plus "but check with me before you <send it | delete it | archive it ...>"; the
 *               error counts the final press as done (target open / bulk rows ticked / unsent draft exactly right)
 *   model.touched: set by act() on the first irreversible change (a star / important / mark / box change, or a sent
 *   message; in confirm episodes of mail tasks only the send). ambiguous / impossible: error 1 and ended() once it is
 *   set (0 before); confirm: the widget flags 'irreversible' when it turns true.
 *
 * round 2 hooks (pure; none changes sample(), so episodes with the new knobs off are unchanged)
 *   facts(model, spec)   2-4 { label, value, aliases?, labels? } the sidebar counts, sent notes and status-bar toast show once the work is
 *                        done: the Trash / Archive / folder / Starred / Important count, 'Unread in Inbox', 'Emails in Inbox',
 *                        'Sent', 'Reply sent to' / 'Forwarded to' / 'Message sent to' (what was typed in To), 'Subject sent',
 *                        'Email replied to' / 'Email forwarded' (the subject). [] in judge episodes.
 *   silent(next, prev, spec, rng)  after a step that lowered the error, one of: the sent message lost its last Cc person, or the
 *                        end of its To, or its subject / reply text was cut off (toast.msg follows); a move / archive / trash
 *                        that did not take on one email (several in bulk), a star / important / unread flag that did not stick.
 *                        null when none applies (no judge episodes). The page shows it (sent note, toast, counts); repeating the
 *                        step (undo the toast and send again, redo the change) fixes it.
 *   retarget(spec, model, rng)  another email with the same task and inbox (namings recomputed: by, refName, group, order,
 *                        searchKey; reply-all needs a Cc, forward a different sender, flag tasks an email not yet flagged);
 *                        compose: another recipient from the inbox, subject and text. null for undo, bulk and judge episodes.
 *
 * plan targets (the widget's locate() maps them to viewport px)
 *   { row: i }  { rowIcon: [i, 'star' | 'important' | 'delete'] }  { check: i }  { checkAll: 1 }
 *   { bulk: 'trash' | 'archive' | 'read' | 'unread' | 'star' }       bulk toolbar (shown while rows are ticked)
 *   { thumb: 'list' }  { scroll: s }  { list: 1 } (wheel point)       list scrolling
 *   { search: 1 }                                                       the search input
 *   { folder: view }                                                    sidebar folder
 *   { action: 'archive' | 'delete' | 'inbox' | 'move' | 'unread' | 'star' | 'important' | 'reply' |
 *              'replyall' | 'forward' }                                  message view controls
 *   { moveTo: folder }                                                  item in the open "Move to" popup
 *   { back: 1 }                                                         list-then-detail back arrow
 *   { field: 'to' | 'cc' | 'subject' | 'body' }  { compose: 'new' | 'send' | 'discard' }
 *   { confirm: 'ok' | 'cancel' }  { toast: 'undo' | 'close' }
 * plan steps: { click }, { click, modifiers: ['Shift'] } (range tick), { click: { check }, modifiers: ['Control'] }
 *   (ctrlTick widgets), { key: 'Delete' } (keyDel widgets: trash the open email), { type: [{ field | search }, text] },
 *   { drag: [{ thumb }, { scroll }] } or { wheel: [{ list: 1 }, dy] } (spec.route), each closed-loop.
 *   Order: answer a pending confirmation; undo a toast whose action was wrong; close a stray menu; fix or
 *   discard the draft; restore emails moved where they should not be (folder view, open, Move to Inbox /
 *   Restore); undo flag side effects; untick stray checkboxes; then the task.
 *
 * Widgets drive the model only through env.taskDef.helpers.act(model, spec, action) (actions: { open }, { back },
 * { flag: [i, op] }, { mark: [is, unread] }, { move: [is, box] }, { confirm: bool }, { undo }, { toastClose },
 * { reply: i, all }, { forward: i }, { compose: true }, { field: [k, v] }, { send }, { discard }, { view },
 * { query }, { check: i, range }, { checkAll: bool }, { bulk: op }, { menu }, { scroll }) and may use the
 * helpers on env.taskDef.helpers (widget API):
 *   act(model, spec, action) applies a client action.
 *   listOrder(model, spec) lists indices in the current folder and search.
 *   listShown(model) says whether the inbox pane is shown.
 *   toolbarOps(model, i) lists the message's available operations.
 *   viewLabel(view) supplies a built-in folder's label.
 *   sideEffects(model, spec) lists unintended flag changes.
 * Self-test: selftest.js (loaded only by the checker and node tests).
 * Shared internals: lib; sampling.js, oracle.js, instructions.js and reporting.js load after this file.
 * Deviations from MiniWoB: realistic senders / subjects / bodies (env.content) instead of lorem and a fixed
 * name bank; senders repeat; the end of the episode is the site's end control (or finish), never Send.
 */
(function () {
  'use strict';
  const I = env.instruct;
  const lib = {};

  const BUILTIN_VIEWS = ['inbox', 'starred', 'important', 'archive', 'trash']; // 'spam' only when model.junk
  const VIEW_LABEL = { inbox: 'Inbox', starred: 'Starred', important: 'Important', archive: 'Archive', trash: 'Trash', spam: 'Spam' };
  const viewLabel = (v) => VIEW_LABEL[v] || v;
  const SCENARIOS = ['delete', 'star', 'important', 'reply', 'forward', 'star-reply', 'nl',
    'archive', 'move', 'unread', 'bulk', 'reply-all', 'compose', 'search', 'attachment', 'undo'];
  const SINGLE = ['delete', 'star', 'important', 'reply', 'forward', 'star-reply', 'archive', 'move', 'unread'];

  // ---------------------------------------------------------------- helpers

  const { lev, clamp, quote, clone } = env.util;
  const ned = (a, b) => {
    const L = Math.max(a.length, b.length);
    return L ? lev(a, b) / L : 0;
  };
  const low = (s) => String(s || '').trim().toLowerCase();
  const normBody = (s) => String(s || '').trim();
  const stripEnd = (s) => s.replace(/[.!?]+\s*$/, '');

  // What a person may be called in To / Cc: name, address or "Name <address>".
  const accepts = (p) => [low(p.name), low(p.addr), low(`${p.name} <${p.addr}>`)];
  const toScore = (str, p) => Math.max(...accepts(p).map((a) => 1 - ned(low(str), a)));
  const ccTokens = (str) => String(str || '').split(/[,;]+/).map(low).filter(Boolean);
  function ccScore(str, want) {
    const toks = ccTokens(str);
    if (!toks.length && !want.length) return 1;
    const used = new Set();
    let hit = 0;
    for (const t of toks) {
      const k = want.findIndex((p, j) => !used.has(j) && accepts(p).includes(t));
      if (k >= 0) {
        used.add(k);
        hit++;
      }
    }
    const union = toks.length + want.length - hit;
    return union ? hit / union : 1;
  }

  const flagOf = (op) => (op === 'star' ? 'starred' : 'important');
  const isBulk = (spec) => spec.task === 'bulk';
  const ops = (spec) => (spec.task === 'star-reply' ? ['star', 'reply'] : [spec.task]);
  const mailMode = (spec) => (spec.task === 'compose' ? 'new' : ops(spec).find((o) => o === 'reply' || o === 'forward') || null);
  const goals = (spec) => (isBulk(spec) ? spec.targets : spec.target === null || spec.target === undefined ? [] : [spec.target]);

  // ---- list
  function matches(spec, i, q) {
    q = low(q);
    if (!q) return true;
    const e = spec.emails[i];
    const hay = [e.name, e.addr, e.subject, e.body, ...e.att.map((a) => a.file)].join('\n').toLowerCase();
    return hay.includes(q);
  }
  function inView(model, i, v) {
    const box = model.box[i];
    if (v === 'starred') return box !== 'trash' && box !== 'spam' && !!model.flags[i].starred;
    if (v === 'important') return box !== 'trash' && box !== 'spam' && !!model.flags[i].important;
    return box === v;
  }
  const listOrder = (model, spec) => spec.emails.map((_, i) => i)
    .filter((i) => inView(model, i, model.view || 'inbox') && matches(spec, i, model.query));
  const position = (model, spec, i) => listOrder(model, spec).indexOf(i);
  const maxScroll = (model, spec) => Math.max(0, listOrder(model, spec).length - spec.rows);
  const listShown = (model) => !(model.stack && ((model.open !== null && model.open !== undefined) || model.compose));
  function visible(spec, model, i) {
    if (!listShown(model)) return false;
    const p = position(model, spec, i);
    const s = model.scroll || 0;
    return p >= 0 && p >= s - 0.02 && p + 1 <= s + spec.rows + 0.02;
  }
  // Message-toolbar operations for email i (depends on the folder it lives in). 'spam' (report spam) only in
  // clients with a Spam folder (model.junk, undo episodes), so widgets written before it never see it.
  function toolbarOps(model, i) {
    const box = model.box[i];
    if (box === 'trash') return ['inbox', 'move', 'unread', 'star', 'important'];
    if (box === 'spam') return ['inbox', 'delete', 'move', 'unread', 'star', 'important'];
    const out = box === 'inbox' ? ['archive', 'delete'] : box === 'archive' ? ['inbox', 'delete'] : ['inbox', 'archive', 'delete'];
    if (model.junk) out.push('spam');
    return out.concat(['move', 'unread', 'star', 'important']);
  }
  // Where email i lived before the episode (undo episodes keep some mail in the trash, archive, folders, spam).
  const homeBox = (spec, i) => (spec.home && spec.home[i]) || 'inbox';
  const isUndo = (spec) => spec.task === 'undo';
  const isFolder = (spec, box) => spec.folders.includes(box);
  // Row icons the widget offers (traits.rowIcons; all of star / important / archive / delete when unset).
  const iconOk = (spec, op) => !spec.icons || spec.icons.includes(op);

  // ---- goals
  function wantBox(spec, i) {
    const t = spec.task;
    if (isBulk(spec)) {
      if (!spec.targets.includes(i)) return 'inbox';
      return spec.bulk.op === 'trash' ? 'trash' : spec.bulk.op === 'archive' ? 'archive' : 'inbox';
    }
    if (i !== spec.target) return homeBox(spec, i);
    if (t === 'undo') return 'inbox';
    return t === 'delete' ? 'trash' : t === 'archive' ? 'archive' : t === 'move' ? spec.folder : null; // null: any box
  }
  const shouldTrash = (spec, i) => wantBox(spec, i) === 'trash';
  // Goal flags (never counted as side effects).
  function goalFlag(spec, i, op) {
    if (isBulk(spec)) return op === 'star' && spec.bulk.op === 'star' && spec.targets.includes(i);
    return i === spec.target && ops(spec).includes(op);
  }

  function wantDraft(spec) {
    const mode = mailMode(spec);
    if (!mode) return null;
    if (mode === 'new') return { mode, of: null, to: spec.mail.to, cc: [], subject: spec.mail.subject, body: spec.mail.body };
    const e = spec.emails[spec.target];
    if (mode === 'reply') return { mode, of: spec.target, to: { name: e.name, addr: e.addr }, cc: spec.replyAll ? e.cc : [], body: spec.reply };
    return { mode, of: spec.target, to: spec.dest, cc: [], body: e.body };
  }
  const draftRight = (d, want) => !!d && !!want && d.mode === want.mode && d.of === want.of && toScore(d.to, want.to) === 1
    && ccScore(d.cc, want.cc) === 1 && normBody(d.body) === normBody(want.body)
    && (want.mode !== 'new' || normBody(d.subject) === normBody(want.subject));

  // (The undo target is graded by the base error, not by these penalties.)
  const undoTarget = (spec, i) => isUndo(spec) && i === spec.target;
  function wrongTrash(model, spec) {
    return spec.emails.map((_, i) => i).filter((i) => model.box[i] === 'trash' && !shouldTrash(spec, i) && !undoTarget(spec, i));
  }
  // Emails moved out of the inbox although they should stay there (archive / custom folder); with home boxes
  // (undo) also any other email taken out of the box it lived in (restored from the trash / archive / spam,
  // filed elsewhere).
  function wrongMoves(model, spec) {
    return spec.emails.map((_, i) => i).filter((i) => {
      const b = model.box[i];
      const w = wantBox(spec, i);
      if (b === 'trash' || undoTarget(spec, i) || w === null || b === w) return false;
      return spec.home ? true : w === 'inbox';
    });
  }
  const wrongSends = (model, spec) => {
    const want = wantDraft(spec);
    return model.sent.filter((s) => !draftRight(s, want));
  };
  function sideEffects(model, spec) {
    const out = [];
    spec.emails.forEach((e, i) => {
      if (model.box[i] === 'trash') return;
      for (const op of ['star', 'important']) {
        if (goalFlag(spec, i, op)) continue;
        if (!!model.flags[i][flagOf(op)] !== !!e[flagOf(op)]) out.push([i, op]);
      }
    });
    return out;
  }
  const strayChecks = (model, spec) => model.checked.filter((i) => !goals(spec).includes(i));

  function opDone(model, spec, i, op) {
    if (op === 'delete' || op === 'trash') return model.box[i] === 'trash';
    if (op === 'archive') return model.box[i] === 'archive';
    if (op === 'move') return model.box[i] === spec.folder;
    if (op === 'unread') return !!model.flags[i].unread;
    if (op === 'read') return !model.flags[i].unread;
    return !!model.flags[i][flagOf(op)];
  }

  function mailCredit(model, spec) {
    const want = wantDraft(spec);
    const drafts = (model.compose ? [model.compose] : []).concat(model.sent);
    let credit = 0;
    if (want.mode === 'new') credit = drafts.some((d) => d.mode === 'new') ? 0.2 : 0;
    else credit = model.open === spec.target || drafts.some((d) => d.of === spec.target) ? 0.2 : 0;
    let best = 0;
    for (const d of drafts) {
      if (d.of !== want.of || d.mode !== want.mode) continue;
      let c = 0.15 + 0.15 * toScore(d.to, want.to) + 0.1 * ccScore(d.cc, want.cc);
      if (want.mode === 'new') c += 0.15 * (1 - ned(normBody(d.body), normBody(want.body))) + 0.1 * (1 - ned(normBody(d.subject), normBody(want.subject)));
      else c += 0.25 * (1 - ned(normBody(d.body), normBody(want.body)));
      if (d !== model.compose && draftRight(d, want)) c += 0.15;
      best = Math.max(best, c);
    }
    return credit + best;
  }

  const prepared = (spec) => !!spec.judge && spec.judge.mode === 'confirm'; // the final press counts as done

  function flagError(model, spec, op, prep) {
    const t = spec.target;
    if (opDone(model, spec, t, op)) return 0;
    return model.open === t ? (prep ? 0 : 0.5) : 1;
  }

  // Undo: 0 back in the inbox; 0.5 open; 0.75 the folder holding it is shown; else 1.
  function undoError(model, spec) {
    const t = spec.target;
    if (model.box[t] === 'inbox') return 0;
    if (model.open === t) return prepared(spec) ? 0 : 0.5;
    return (model.view || 'inbox') === model.box[t] ? 0.75 : 1;
  }

  // 1 - credit; confirm episodes: a draft that is exactly right and not yet sent earns the send's 0.15.
  function mailError(model, spec, prep) {
    const bonus = prep && model.compose && draftRight(model.compose, wantDraft(spec)) ? 0.15 : 0;
    return Math.max(0, 1 - mailCredit(model, spec) - bonus);
  }

  function errorOf(model, spec) {
    if (spec.judge && spec.judge.mode !== 'confirm') return model.touched ? 1 : 0; // the page stays as it is
    const prep = prepared(spec);
    let e;
    if (isUndo(spec)) e = undoError(model, spec);
    else if (isBulk(spec)) {
      const k = spec.targets.length;
      e = spec.targets.reduce((a, t) => a + (opDone(model, spec, t, spec.bulk.op) ? 0 : model.checked.includes(t) ? (prep ? 0 : 0.5) : 1), 0) / k;
    } else if (spec.task === 'star-reply') e = 0.3 * flagError(model, spec, 'star', false) + 0.7 * mailError(model, spec, prep);
    else if (mailMode(spec)) e = mailError(model, spec, prep);
    else e = flagError(model, spec, spec.task, prep);
    e += wrongTrash(model, spec).length + 0.5 * wrongSends(model, spec).length + 0.5 * wrongMoves(model, spec).length
      + 0.2 * sideEffects(model, spec).length + 0.1 * strayChecks(model, spec).length;
    return Math.round(e * 1e9) / 1e9;
  }

  // ---------------------------------------------------------------- transitions (shared by widget and oracle)

  // Judge episodes: model.touched turns true on the first irreversible change (see the header).
  function act(model, spec, a) {
    const m = actRaw(model, spec, a);
    if (!spec.judge || m === model || m.touched) return m;
    const mail = spec.judge.mode === 'confirm' && ['reply', 'forward', 'compose', 'star-reply'].includes(spec.task);
    const key = (x) => JSON.stringify([x.flags.map((f) => [f.starred, f.important]), x.box]);
    if (m.sent.length !== model.sent.length || (!mail && (key(m) !== key(model) || !!a.mark))) m.touched = true;
    return m;
  }

  function actRaw(model, spec, a) {
    const m = clone(model);
    const fix = () => { m.scroll = clamp(m.scroll || 0, 0, maxScroll(m, spec)); };
    const want = () => wantDraft(spec);
    if (a.open !== undefined) {
      if (a.only) {
        // Clients where a plain click selects just that row (Outlook): the ticked set is replaced.
        m.checked = [];
        m.anchor = null;
      }
      m.open = a.open;
      m.compose = null;
      m.menu = null;
      m.flags[a.open].unread = false;
      return m;
    }
    if (a.back) {
      if (m.compose) m.compose = null;
      else m.open = null;
      m.menu = null;
      return m;
    }
    if (a.flag) {
      const [i, op] = a.flag;
      m.flags[i][flagOf(op)] = !m.flags[i][flagOf(op)];
      m.menu = null;
      fix();
      return m;
    }
    if (a.mark) {
      const [is, v] = a.mark;
      for (const i of is) m.flags[i].unread = v;
      if (v && is.includes(m.open)) {
        m.open = null;
        if (m.compose && m.compose.of !== null && is.includes(m.compose.of)) m.compose = null;
      }
      m.menu = null;
      return m;
    }
    if (a.move) {
      const [is, box] = a.move;
      if (box === 'trash' && spec.confirm && !a.confirmed) {
        m.confirm = { of: is.slice() };
        m.menu = null;
        return m;
      }
      const from = is.map((i) => m.box[i]);
      is.forEach((i) => { m.box[i] = box; });
      if (box === 'trash' && is.some((i) => !shouldTrash(spec, i))) {
        m.strikes = (m.strikes || 0) + 1;
        m.lastStrike = 'wrong-delete';
      }
      m.toast = { kind: box, of: is.slice(), from };
      if (is.includes(m.open) && box !== 'inbox') m.open = null;
      if (m.compose && m.compose.of !== null && is.includes(m.compose.of) && box === 'trash') m.compose = null;
      m.checked = m.checked.filter((i) => !is.includes(i));
      m.menu = null;
      m.confirm = null;
      fix();
      return m;
    }
    if (a.confirm !== undefined) {
      const c = m.confirm;
      m.confirm = null;
      if (a.confirm && c) return act(m, spec, { move: [c.of, 'trash'], confirmed: true });
      return m;
    }
    if (a.undo) {
      const t = m.toast;
      m.toast = null;
      if (!t) return m;
      if (t.kind === 'send') {
        m.sent.splice(t.at, 1);
        m.compose = t.msg;
        if (t.msg.of !== null) m.open = t.msg.of;
      } else t.of.forEach((i, k) => { m.box[i] = t.from[k]; });
      fix();
      return m;
    }
    if (a.toastClose) {
      m.toast = null;
      return m;
    }
    if (a.reply !== undefined) {
      const e = spec.emails[a.reply];
      m.compose = { mode: 'reply', of: a.reply, to: e.name, cc: a.all ? e.cc.map((p) => p.name).join(', ') : '', subject: `Re: ${e.subject}`, body: '' };
      m.menu = null;
      return m;
    }
    if (a.forward !== undefined) {
      const e = spec.emails[a.forward];
      m.compose = { mode: 'forward', of: a.forward, to: '', cc: '', subject: `Fwd: ${e.subject}`, body: e.body };
      m.menu = null;
      return m;
    }
    if (a.compose) {
      m.compose = { mode: 'new', of: null, to: '', cc: '', subject: '', body: '' };
      m.menu = null;
      return m;
    }
    if (a.field) {
      if (m.compose) m.compose[a.field[0]] = a.field[1];
      return m;
    }
    if (a.send) {
      const d = m.compose;
      if (!d) return m;
      m.sent.push(d);
      m.compose = null;
      if (!draftRight(d, want())) {
        m.strikes = (m.strikes || 0) + 1;
        m.lastStrike = 'wrong-send';
      }
      m.toast = { kind: 'send', at: m.sent.length - 1, msg: d };
      return m;
    }
    if (a.discard) {
      m.compose = null;
      return m;
    }
    return actList(m, spec, a, fix);
  }

  // Folder navigation, selection and bulk actions share the same scroll correction.
  function actList(m, spec, a, fix) {
    if (a.view !== undefined) {
      m.view = a.view;
      m.query = '';
      m.scroll = 0;
      m.checked = [];
      m.anchor = null;
      m.open = null;
      m.menu = null;
      return m;
    }
    if (a.query !== undefined) {
      m.query = a.query;
      m.scroll = 0;
      m.checked = [];
      m.anchor = null;
      return m;
    }
    if (a.check !== undefined) {
      const i = a.check;
      const order = listOrder(m, spec);
      if (a.range && m.anchor !== null && m.anchor !== undefined && order.includes(m.anchor) && order.includes(i)) {
        const on = !m.checked.includes(i);
        const [p, q] = [order.indexOf(m.anchor), order.indexOf(i)].sort((x, y) => x - y);
        const span = order.slice(p, q + 1);
        m.checked = on ? [...new Set(m.checked.concat(span))] : m.checked.filter((j) => !span.includes(j));
      } else {
        m.checked = m.checked.includes(i) ? m.checked.filter((j) => j !== i) : m.checked.concat([i]);
      }
      m.checked.sort((x, y) => x - y);
      m.anchor = i;
      return m;
    }
    if (a.checkAll !== undefined) {
      m.checked = a.checkAll ? listOrder(m, spec) : [];
      m.anchor = null;
      return m;
    }
    if (a.bulk) {
      const is = m.checked.slice();
      if (!is.length) return m;
      if (a.bulk === 'trash' || a.bulk === 'archive') return act(m, spec, { move: [is, a.bulk] });
      if (a.bulk === 'read' || a.bulk === 'unread') {
        for (const i of is) m.flags[i].unread = a.bulk === 'unread';
      } else if (a.bulk === 'star') for (const i of is) m.flags[i].starred = true;
      m.checked = [];
      m.anchor = null;
      fix();
      return m;
    }
    if (a.menu !== undefined) {
      m.menu = a.menu;
      return m;
    }
    if (a.scroll !== undefined) {
      m.scroll = a.scroll;
      return m;
    }
    return m;
  }
  function endedOf(model, spec) {
    if (spec.judge && spec.judge.mode !== 'confirm' && model.touched) return 'wrong-choice';
    return (model.strikes || 0) > (spec.recoverable ? 1 : 0) ? model.lastStrike || 'wrong-choice' : null;
  }

  Object.assign(lib, {
    viewLabel, SCENARIOS, SINGLE, clamp, clone, ned, low, normBody, stripEnd, toScore, ccScore, flagOf, isBulk, ops, mailMode, goals, matches, inView, listOrder, position, maxScroll, listShown, visible, toolbarOps, homeBox, isUndo, isFolder, iconOk, wantBox, shouldTrash, wantDraft, draftRight, wrongTrash, wrongMoves, sideEffects, strayChecks, opDone, errorOf, act, endedOf
  });

  env.task({
    name: 'use-email',
    reply: true, // judge and report endings are structured replies under the default reply=auto (kit/runtime/reply.js)
    scenarios: SCENARIOS,
    inputs: ['pointer', 'keyboard', 'wheel'],
    judgeModes: ['ambiguous', 'impossible', 'confirm'],
    startModes: ['off', 'partial', 'wrong', 'solved', 'scene'],

    helpers: { act, listOrder, listShown, toolbarOps, viewLabel, sideEffects },
    lib,
    files: ['sampling.js', 'oracle.js', 'instructions.js', 'reporting.js'],

    sample: (...args) => lib.sampleSpec(...args),
    init: (...args) => lib.initModel(...args),
    error: errorOf,

    tolerance(spec) {
      return { tau: 0, sigma: 0.5, minInitialError: 0.5 };
    },

    instruction(spec, rng) {
      const j = spec.judge;
      if (j && j.mode !== 'confirm') return I.say(rng, I.phrase(rng, j.templates, j.vars, spec.isplit), { isplit: spec.isplit, terse: j.terse });
      const text = lib.instructionOf(spec, rng);
      return j ? `${text.replace(/[.!?\s]+$/, '')}, but check with me before you ${lib.confirmVerb(spec)}.` : text;
    },
    plan: (...args) => lib.planOf(...args),
    solve: (...args) => lib.solveOf(...args),

    facts: (...args) => lib.factsOf(...args),
    silent: (...args) => lib.silentOf(...args),
    retarget: (...args) => lib.retargetOf(...args),

    ended: endedOf,
  });
})();
