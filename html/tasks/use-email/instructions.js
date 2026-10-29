/* use-email/instructions.js: shared instructions internals; loaded through the task's files list. */
(function () {
  'use strict';
  const C = env.content;
  const I = env.instruct;
  const lib = env.taskOf('use-email').lib;

  // ---------------------------------------------------------------- instructions

  const REF = {
    sender: ['the email from {name}', 'the email by {name}', 'the message from {name}', 'the email {name} sent you',
      'the mail from {name}', 'the email you got from {name}', 'the message {name} sent', 'the one {name} emailed you',
      'the mail with sender {name}', 'the note {name} emailed', 'the email off {name}'],
    subject: ['the email with the subject {subj}', 'the email titled {subj}', 'the {subj} email', 'the message with subject {subj}',
      'the email about {subj}', 'the email whose subject is {subj}'],
    content: ['the email that mentions {label} {code}', 'the email about {label} {code}', 'the message that contains {label} {code}',
      'the email referencing {label} {code}', 'the email with {label} {code} in it', 'the message that quotes {label} {code}',
      'the email whose text has {label} {code}', 'the email where {label} {code} appears',
      'the email noting {label} {code} inside', 'the email listing {label} {code}'],
    attachment: ['the email with the {kind} attachment', 'the email that has a {kind} attached', 'the one with the {kind}',
      'the message with a {kind} attached', 'the email carrying the {kind}', 'the email that came with a {kind}',
      'the mail sent with the {kind}', 'the email with an attached {kind}', 'the email accompanied by the {kind}'],
    'sender-subject': ['the email from {name} about {subj}', 'the message {name} sent with the subject {subj}',
      'the email from {name} titled {subj}', 'the {subj} email from {name}', 'the email by {name} with subject {subj}',
      'the {subj} email {name} sent'],
    latest: ['the most recent email from {name}', 'the latest email from {name}', 'the newer of the two emails from {name}',
      'the newest message from {name}', 'the last email {name} sent you'],
    oldest: ['the older email from {name}', 'the earlier of the two emails from {name}', 'the older of the two messages from {name}',
      'the first of the two emails {name} sent you',
      'the email {name} sent before the other'],
  };

  const PLAIN = {
    delete: ['Find {ref} and click the trash icon to delete it.', 'Delete {ref}.', 'Move {ref} to the trash.', 'Get rid of {ref}.',
      'Find {ref} and delete it.', 'Trash {ref}.', 'Locate {ref} and remove it by deleting it.', 'Open {ref} and delete it.',
      'Please put {ref} in the trash.', '{ref} can go in the trash.', 'Take {ref} out by trashing it.',
      'Use the trash icon on {ref}.', 'Have {ref} sent to Trash.'],
    star: ['Find {ref} and click the star icon to star it.', 'Star {ref}.', 'Add a star to {ref}.', 'Find {ref} and give it a star.',
      'Mark {ref} with a star.', 'Star {ref} so I can find it later.', 'Locate {ref} and star it.',
      'Use the star marker on {ref}.', 'Make {ref} a starred email.', '{ref} should have a star.'],
    important: ['Find {ref} and mark it as important.', 'Mark {ref} as important.', 'Flag {ref} as important.',
      'Set the important marker on {ref}.', 'Locate {ref} and mark it important.', 'Make sure {ref} is marked as important.',
      '{ref} needs an important flag.', 'I want the important flag on {ref}.', 'Give {ref} important status.'],
    reply: ['Find {ref} and reply to the sender with the text {msg}.', 'Reply to {ref} with {msg}.', 'Answer {ref}: {msg}.',
      'Respond to {ref} by saying {msg}.', 'Send a reply to {ref} that says {msg}.', 'Open {ref} and reply {msg}.', 'Reply {msg} to {ref}.',
      'Use {msg} for your reply to {ref}.', 'Send this reply to {ref}: {msg}.', 'Reply to the sender of {ref}: {msg}.',
      '{ref}: reply with {msg}.'],
    forward: ['Find {ref} and forward that email to {dest}.', 'Forward {ref} to {dest}.', 'Send {ref} on to {dest}.',
      'Forward {ref} to {dest} without changing the message.', 'Pass {ref} along to {dest}.', 'Open {ref} and forward it to {dest}.',
      '{dest} needs a forward of {ref}.', 'Use forwarding to send {dest} {ref}.'],
    'star-reply': ['Find {ref}, star it, and reply to the sender with the text {msg}.', 'Star {ref} and reply {msg}.',
      'Reply to {ref} with {msg} and star it.', 'Give {ref} a star, then answer {msg}.',
      'Open {ref}, add a star, and reply with {msg}.', 'Star and reply to {ref}: {msg}.',
      '{ref} needs a star and the reply {msg}.', 'Add a star and send {ref} a reply: {msg}.'],
    archive: ['Archive {ref}.', 'Find {ref} and archive it.', 'Move {ref} to the archive; do not delete it.',
      'Clear {ref} out of the inbox by archiving it.', 'Locate {ref} and archive it.', 'Archive {ref}, keeping it out of the trash.',
      '{ref} belongs in the archive for later.', 'Use the archive tool on {ref}.', 'Put {ref} away by archiving it.'],
    move: ['Move {ref} to the {folder} folder.', 'File {ref} under {folder}.', 'Find {ref} and move it into {folder}.',
      'Put {ref} in the {folder} folder.', 'Sort {ref} into the {folder} folder.', 'Open {ref} and move it to {folder}.',
      'Use {folder} to file away {ref}.'],
    unread: ['Mark {ref} as unread.', 'Find {ref} and mark it unread.', 'Set {ref} back to unread.',
      'Make {ref} show as unread again.', 'Locate {ref} and mark it as unread.', 'Mark {ref} unread so I remember to read it again.',
      '{ref} should be marked unread.', 'Use the unread option on {ref}.', 'Leave {ref} marked unread for later.',
      'I want {ref} marked unread now.'],
  };
  const NL = {
    delete: ["I don't need {ref} anymore. Delete it.", 'Throw {ref} in the trash.', 'Go ahead and delete {ref}.',
      'Trash {ref} for me.', 'Look for {ref} and remove it.', 'Delete {ref}, it is not needed.', 'Search for {ref} and trash it.',
      'Please delete {ref} from my inbox.', 'The trash is where I want {ref}.', 'I want {ref} taken to the trash.'],
    star: ['Give {ref} a star.', 'I want {ref} starred.', 'Go to {ref} and star it.', 'Put a star on {ref}.',
      'Star {ref} for me.', 'Look for {ref} and add a star.', 'Star {ref} to keep track.'],
    important: ['I need {ref} flagged as important.', 'Go to {ref} and set it as important.', 'Mark {ref} important for me.',
      'Look for {ref} and flag it as important.', 'Treat {ref} as important.', 'Give {ref} the important marker.',
      'Please have {ref} marked important.', 'Make {ref} show as important.'],
    reply: ['Answer {ref} with {msg}.', 'Go ahead and reply to {ref} with the words {msg}.', 'Write back to {ref}: {msg}.',
      'Locate {ref} and send back {msg}.', 'Get back to {ref} with {msg}.', 'Shoot a quick reply to {ref}: {msg}.',
      'Please send {msg} in reply to {ref}.', 'The reply to {ref} should say {msg}.',
      '{ref} needs an answer. Send {msg}.', 'Make {msg} the reply to {ref}.'],
    forward: ['Send {dest} {ref}.', 'Go to {ref}. Send it to {dest}.', 'Find {ref}, then send it to {dest}.',
      'Look for {ref} and forward to {dest}.', 'Give {dest} a copy of {ref}.', 'Search for {ref} and send it to {dest}.',
      'Share {ref} with {dest} by forwarding it.',
      '{dest} needs {ref} forwarded.',
      'Get {ref} forwarded to {dest} for me.'],
    'star-reply': ['Find {ref}, star it, then answer {msg}.', 'Give {ref} a star and respond with {msg}.',
      'Locate {ref}, add a star, and reply with the text {msg}.', 'Star {ref} and write back {msg}.',
      'Answer {ref} with {msg}, and star it too.', 'Mark {ref} with a star and reply {msg}.',
      'Send {msg} in reply to {ref} and star it.', 'I want {ref} starred, with {msg} sent back.'],
    archive: ['Get {ref} out of the inbox, but keep it in the archive.', 'Archive {ref} for me.', 'File {ref} away in the archive.',
      "I'm done with {ref}; archive it.", 'Tuck {ref} away into the archive.', 'Look for {ref} and archive it.',
      '{ref} should leave the inbox for the archive.', 'Let\'s have {ref} archived.',
      'Keep {ref} in the archive, please.', 'I\'d like {ref} archived for later use.',
      'The archive is the place for {ref}.'],
    move: ['Put {ref} away in {folder}.', 'Move {ref} where it belongs: the {folder} folder.', 'Go to {ref} and file it under {folder}.',
      'Stick {ref} in the {folder} folder.', 'Look for {ref} and move it to {folder}.', 'Get {ref} into {folder}.',
      '{ref} belongs in {folder}. Move it there.', 'I want {ref} in the {folder} folder.'],
    unread: ['I want {ref} to look unread again.', 'Go to {ref} and mark it unread.', 'Flip {ref} back to unread.',
      'Look for {ref} and set it as unread.', 'Turn {ref} back into an unread email.', 'Mark {ref} as not read yet.',
      '{ref} needs unread status again.', 'Undo the read status on {ref}.'],
  };
  const REPLY_ONLY = ['Reply only to the sender of {ref} with {msg}, not to everyone in Cc.',
    'Reply to {ref} with {msg}, but only to the sender (do not reply all).', 'Send {msg} back to the sender of {ref} only.',
    'Answer {ref} with {msg}; the people in Cc should not get it.', 'Reply {msg} to {ref}, sender only.',
    'Respond privately to {ref} with {msg}, just to the sender.',
    'Nobody but the sender of {ref} gets the reply {msg}.',
    'Keep Cc out of the reply to {ref}; send its sender {msg}.',
    'Make {msg} the reply to {ref}, addressed to its sender alone.'];
  const REPLY_ALL = ['Reply all to {ref} with {msg}.', 'Reply to everyone on {ref} with {msg}.',
    'Answer {ref} with {msg} and keep everyone in Cc.', 'Use reply all on {ref} and write {msg}.',
    'Send {msg} to everyone on {ref}.', 'Respond to all recipients of {ref}: {msg}.'];
  const COMPOSE = ['Write a new email to {to} with the subject {subject} and the message {body}.',
    'Send {to} a new email. Subject: {subject}. Message: {body}.', 'Compose an email to {to}: subject {subject}, text {body}.',
    'Email {to} with the subject {subject} saying {body}.', 'Start a new message to {to} titled {subject} with the body {body}, and send it.',
    'Draft and send an email to {to}; subject {subject}, body {body}.',
    'Let {to} know {body} in a new email headed {subject}; send it.',
    'Use {subject} as the subject of a new email to {to}; send {body}.',
    'Get a new email to {to}, titled {subject}, containing {body}.',
    'The new email for {to} should say {body}, subject {subject}. Send it.',
    'Make a new email: subject {subject}, body {body}; send to {to}.'];
  const CRIT = {
    sender: ['all emails from {name}', 'every email from {name}', 'all of the messages from {name}', 'each email {name} sent you'],
    attachment: [
      'all emails with attachments', 'every email that has an attachment', 'all messages with files attached',
      'each email that came with an attachment', 'every email accompanied by a file',
      'mail with at least one attachment'
    ],
    unread: [
      'all unread emails', 'every unread message', 'the unread emails', 'each email you have not read yet',
      'everything still unread'
    ],
  };
  const BULK = {
    trash: ['Delete {crit}.', 'Select {crit} and delete them.', 'Move {crit} to the trash.', 'Get rid of {crit}.',
      'Trash {crit} in one go.', 'Clean up the inbox by deleting {crit}.', 'Use Trash to clear out {crit}.',
      '{crit} can go into Trash.', 'Get {crit} deleted.'],
    archive: ['Archive {crit}.', 'Select {crit} and archive them.', 'Move {crit} out of the inbox into the archive.',
      'Clear {crit} from the inbox by archiving them.', 'Archive {crit} at once.', 'Bulk-archive {crit}.',
      'Keep {crit} in the archive.', 'File {crit} away by archiving.', 'The archive is where I want {crit}.',
      'Put {crit} away in the archive.', 'Have {crit} moved to the archive.'],
    read: ['Mark {crit} as read.', 'Select {crit} and mark them as read.', 'Clear the unread state of {crit}.',
      'Make {crit} show as read.', 'Mark {crit} read.', 'Set {crit} to read.', 'I want {crit} marked read.',
      'Apply read status to {crit}.'],
    star: ['Star {crit}.', 'Select {crit} and star them.', 'Add a star to {crit}.', 'Give {crit} a star.',
      'Star {crit} in one go.', 'Mark {crit} with a star.', '{crit} must get stars.', 'Have {crit} starred.'],
  };
  const UNDO_VAGUE = ['Undo what was done to {ref}.', 'Put {ref} back in the inbox.', 'Bring {ref} back to the inbox.',
    'Something happened to {ref} by mistake; undo it.', 'Restore {ref} to the inbox.', 'Get {ref} back into the inbox where it was.',
    'Undo the change to {ref} so it is back in the inbox.',
    '{ref} belongs back in the inbox.',
    'I need to get {ref} back in my inbox.',
    'The inbox is where {ref} should be again.',
    '{ref} left the inbox in error; return it.',
    'Undo the error involving {ref}.',
    'The inbox needs {ref} back.'];
  const UNDO = {
    trash: ['{ref} was deleted by mistake. Restore it.', 'Restore {ref} from the trash.', 'Recover {ref}, which was deleted by accident.',
      'Undelete {ref}.', 'Get {ref} back out of the trash and into the inbox.', 'I deleted {ref} by accident; bring it back.',
      'Undo the deletion of {ref}.', '{ref} belongs in the inbox, not the trash.',
      'For {ref}, reverse the accidental deletion.'],
    archive: ['{ref} was archived by mistake. Move it back to the inbox.', 'Unarchive {ref}.',
      'Take {ref} out of the archive and put it back in the inbox.', 'Move {ref} from the archive back to the inbox.',
      'I archived {ref} too early; put it back in the inbox.',
      'Undo archiving {ref}; return it to the inbox.',
      'The inbox is where {ref} belongs; unarchive it.'],
    folder: ['{ref} was filed under {folder} by mistake. Move it back to the inbox.', 'Move {ref} out of {folder} and back to the inbox.',
      'Take {ref} out of the {folder} folder; it belongs in the inbox.', '{ref} ended up in {folder}. Put it back in the inbox.',
      'Undo filing {ref} in {folder}; return it to the inbox.'],
    spam: ['{ref} was marked as spam by mistake. Move it back to the inbox.', '{ref} is not spam. Put it back in the inbox.',
      'Rescue {ref} from the spam folder.', 'Mark {ref} as not spam so it is back in the inbox.',
      'Get {ref} out of spam and back into the inbox.',
      'Treat {ref} as regular mail and restore it to the inbox.'],
  };
  const SEARCHED = ['Search for {key}, then {inner}.', 'Use the search box to look up {key}; {inner}.',
    'Type {key} into the search box, then {inner}.', 'Search the mailbox for {key} and {inner}.',
    'After a mailbox search for {key}, {inner}.', 'With {key} as the search term, {inner}.'];
  const OP_WORD = { delete: 'delete', star: 'star', important: 'mark important', reply: 'reply', forward: 'forward',
    'star-reply': 'star + reply', archive: 'archive', move: 'move', unread: 'mark unread' };

  const curlyQuote = (s) => `“${s}”`;

  function refOf(spec, rng) {
    const e = spec.emails[spec.target];
    const subj = curlyQuote(I.alias(rng, e.subject, [], 0.2));
    const vars = { name: spec.refName, subj };
    let key = spec.by === 'sender-order' ? spec.order : spec.by;
    if (spec.by === 'content') Object.assign(vars, { label: e.ref.label, code: e.ref.code });
    if (spec.by === 'attachment') vars.kind = rng.pick(lib.GROUP_LABELS[spec.group]);
    if (spec.by === 'attachment' && rng.bool(0.2)) {
      key = null;
      vars.file = curlyQuote(e.att.find((a) => a.group === spec.group).file);
      vars.text = `the email with the attachment ${vars.file}`;
    }
    const text = key ? I.fill(I.pick(rng, REF[key], spec.isplit), vars) : vars.text;
    const short = spec.by === 'subject' ? subj : spec.by === 'content' ? `${e.ref.label} ${e.ref.code}`
      : spec.by === 'attachment' ? (vars.file ? `the email with ${vars.file}` : `the email with the ${vars.kind}`) : spec.by === 'sender-subject' ? `${spec.refName}, ${subj}`
        : spec.by === 'sender-order' ? `${spec.order === 'latest' ? 'latest' : 'older'} email from ${spec.refName}` : spec.refName;
    return { text, short };
  }

  function coreOf(spec, rng) {
    const fill = (tpls, vars) => I.fill(I.pick(rng, tpls, spec.isplit), vars);
    if (lib.isBulk(spec)) {
      const crit = fill(CRIT[spec.bulk.crit], { name: spec.bulk.name });
      const core = fill(BULK[spec.bulk.op], { crit });
      const opw = { trash: 'delete', archive: 'archive', read: 'mark read', star: 'star' }[spec.bulk.op];
      return { core, terse: `${opw}: ${crit}`, steps: [`tick ${crit}`, `${opw} them`] };
    }
    if (spec.task === 'compose') {
      const mm = spec.mail;
      const to = rng.bool(0.25) ? `${mm.to.name} (${mm.to.addr})` : mm.to.name;
      const core = fill(COMPOSE, { to, subject: curlyQuote(mm.subject), body: curlyQuote(mm.body) });
      return { core, terse: `new email → ${mm.to.name}: ${curlyQuote(mm.subject)} / ${curlyQuote(mm.body)}`,
        steps: ['open a new message', `address it to ${to}`, `use the subject ${curlyQuote(mm.subject)}`, `write ${curlyQuote(mm.body)}`, 'send it'] };
    }
    const ref = refOf(spec, rng);
    if (lib.isUndo(spec)) {
      const k = spec.undo.kind;
      const fd = k === 'folder' ? I.alias(rng, spec.undo.box, [], 0.3) : '';
      const vague = spec.say === 'vague';
      const core = I.ucFirst(fill(vague ? UNDO_VAGUE : UNDO[k], { ref: ref.text, folder: fd }));
      const where = { trash: 'the trash', archive: 'the archive', spam: 'the spam folder', folder: `the ${fd} folder` }[k];
      return { core, terse: `undo: ${ref.short} → inbox`,
        steps: vague ? [`find ${ref.text}`, 'put it back in the inbox'] : [`open ${where}`, `find ${ref.text}`, 'move it back to the inbox'] };
    }
    const folder = spec.folder ? I.alias(rng, spec.folder, [], 0.3) : '';
    const vars = { ref: ref.text, msg: spec.reply ? curlyQuote(spec.reply) : '', dest: spec.dest ? spec.dest.name : '', folder };
    let tpls;
    if (spec.scenario === 'reply-all') tpls = spec.replyAll ? REPLY_ALL : REPLY_ONLY;
    else tpls = (spec.nl ? NL : PLAIN)[spec.task];
    let core = I.ucFirst(fill(tpls, vars));
    if (spec.scenario === 'search' && rng.bool(0.4) && spec.route === 'search') {
      core = fill(SEARCHED, { key: curlyQuote(spec.searchKey), inner: lib.stripEnd(I.lcFirst(core)) });
    }
    const opw = spec.scenario === 'reply-all' ? (spec.replyAll ? 'reply all' : 'reply to sender only (no Cc)') : OP_WORD[spec.task];
    const extra = spec.task === 'forward' ? ` → ${vars.dest}` : spec.task === 'move' ? ` → ${folder}` : spec.reply ? ` ${vars.msg}` : '';
    const terse = `${opw}: ${ref.short}${extra}`;
    const steps = [`open ${ref.text}`];
    if (spec.task === 'star-reply') steps.push('star it', `reply ${vars.msg}`);
    else if (spec.task === 'reply') {
      steps.push(spec.scenario !== 'reply-all' ? `reply with ${vars.msg}` : spec.replyAll ? `reply all with ${vars.msg}` : `reply only to the sender (no Cc) with ${vars.msg}`);
    }
    else if (spec.task === 'forward') steps.push(`forward it to ${vars.dest}`);
    else if (spec.task === 'move') steps.push(`move it to ${folder}`);
    return { core, terse, steps: steps.length > 1 ? steps : null };
  }

  // A quoted value that ends a sentence keeps its own final punctuation: “Thanks.” not “Thanks.”.
  const tidy = (s) => s.replace(/([.!?])”([.!?])(?=\s|$)/g, '$1”').replace(/([.!?])”([.!?])(?=\s|$)/g, '$1”');

  function instructionOf(spec, rng) {
    let { core, terse, steps } = coreOf(spec, rng);
    core = tidy(core);
    if (steps) steps = steps.map(tidy);
    return I.say(rng, core, { isplit: spec.isplit, terse, steps: steps || undefined });
  }

  // ---------------------------------------------------------------- judge modes

  const JUDGE_MODES = ['ambiguous', 'impossible', 'confirm'];
  const ABSENT_SENDERS = [
    'Zoltan Varga', 'Ingrid Solberg', 'Tendai Moyo', 'Hye-jin Park', 'Rafael Quintero', 'Dilnoza Karimova',
    'Elvira Neskov', 'Marek Lindahl', 'Thandi Khumalo', 'Min-seo Han', 'Camila Noriega', 'Farida Ismatova',
    'Anselm Riedel', 'Sivert Haldorsen', 'Jabari Okello', 'Priya Kerkar', 'Ivo Petranek', 'Nadia Bensalem',
    'Einar Sundvik', 'Kwame Dlamini', 'Lucia Arencibia'
  ];
  const ABSENT_FOLDERS = [
    'Receipts', 'Taxes', 'Travel plans', 'Clients', 'Recipes', 'Meetings', 'Courses', 'Family', 'Hobbies',
    'Work shifts', 'Bookings', 'Repairs', 'Events', 'Job search', 'School', 'Household', 'Tutors', 'Club news',
    'Projects', 'Utilities'
  ];
  const lastOf = (name) => name.split(' ').slice(1).join(' ') || name;
  const esc = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  function confirmVerb(spec) {
    if (['reply', 'forward', 'compose', 'star-reply'].includes(spec.task)) return 'send it';
    if (spec.task === 'bulk') return { trash: 'delete them', archive: 'archive them', read: 'mark them read', star: 'star them' }[spec.bulk.op];
    return { delete: 'delete it', star: 'star it', important: 'mark it important', archive: 'archive it', move: 'move it',
      unread: 'mark it unread', undo: 'restore it' }[spec.task] || 'do it';
  }
  const CONFIRM_ASK = { 'send it': 'send it', 'delete it': 'delete it', 'archive it': 'archive it', 'move it': 'move it',
    'star it': 'star it', 'mark it important': 'mark it important', 'mark it unread': 'mark it unread', 'restore it': 'restore it',
    'delete them': 'delete them', 'archive them': 'archive them', 'mark them read': 'mark them read', 'star them': 'star them' };

  const AMBIG_OPS = {
    delete: [
      'Delete the email from {f}.', 'Trash the message from {f}.', "Move {f}'s email to the trash.",
      "I want {f}'s email deleted."
    ],
    archive: ['Archive the email from {f}.', 'Archive the message {f} sent me.'],
    star: ['Star the email from {f}.', 'Add a star to the message from {f}.'],
    reply: ['Reply to {f} with "Thanks, got it."', 'Answer the email from {f}: "Thanks, got it."'],
  };

  function judgeOf(jr, spec, mode) {
    if (mode === 'confirm') {
      if (spec.startMode === 'scene') spec.startMode = 'off';
      spec.direct = false; // the row icons would act without opening the email first: no point to stop at
      return { mode, message: `Everything is ready. Should I go ahead and ${CONFIRM_ASK[confirmVerb(spec)]}?` };
    }
    spec.startMode = 'off'; // the page is left alone
    const inbox = spec.emails.map((_, i) => i).filter((i) => lib.homeBox(spec, i) === 'inbox');
    if (mode === 'ambiguous') {
      const a = jr.pick(inbox);
      const bs = inbox.filter((i) => spec.emails[i].addr !== spec.emails[a].addr && lastOf(spec.emails[i].name) !== lastOf(spec.emails[a].name));
      if (!bs.length) return undefined;
      const A = spec.emails[a];
      const B = spec.emails[jr.pick(bs)];
      const first = A.first;
      const oldName = B.name;
      const oldFirst = B.first;
      const newName = `${first} ${lastOf(oldName)}`;
      for (const e of spec.emails) {
        if (e.addr !== B.addr) continue;
        e.name = newName;
        e.first = first;
        e.body = e.body.split(oldName).join(newName).replace(new RegExp(`\\b${esc(oldFirst)}\\b`, 'g'), first);
      }
      const op = jr.pick(Object.keys(AMBIG_OPS));
      const others = spec.emails.filter((e) => e.addr !== A.addr && e.addr !== B.addr && e.first !== first).map((e) => e.name);
      return { mode, cands: [[A.name, lastOf(A.name), A.addr], [newName, lastOf(newName), B.addr]],
        others: [...new Set(others)].map((n) => [n]),
        message: `Which ${first} do you mean: ${A.name} or ${newName}?`,
        templates: AMBIG_OPS[op], vars: { f: first }, terse: `${op} the email from ${first}` };
    }
    const have = new Set(spec.emails.flatMap((e) => [e.name.toLowerCase(), e.first.toLowerCase()]));
    if (spec.folders.length && jr.bool(0.5)) {
      const folder = jr.pick(ABSENT_FOLDERS.filter((f) => !spec.folders.includes(f)));
      const who = spec.emails[jr.pick(inbox)].name;
      return { mode, what: [folder], message: `I can't do that: there is no "${folder}" folder to move it to.`,
        templates: [`Move the email from {who} to the {folder} folder.`, `File the message from {who} under {folder}.`],
        vars: { who, folder: `“${folder}”` }, terse: `move the email from ${who} to ${folder}` };
    }
    const name = jr.pick(ABSENT_SENDERS.filter((n) => !have.has(n.toLowerCase()) && !have.has(n.split(' ')[0].toLowerCase())));
    const op = jr.pick(['delete', 'archive', 'star']);
    return { mode, what: [name, name.split(' ')[0]], message: `I can't do that: there is no email from ${name}.`,
      templates: AMBIG_OPS[op], vars: { f: name }, terse: `${op} the email from ${name}` };
  }


  Object.assign(lib, {
    coreOf, instructionOf, JUDGE_MODES, confirmVerb, judgeOf
  });
})();
