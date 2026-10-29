/* use-email/sampling.js: shared sampling internals; loaded through the task's files list. */
(function () {
  'use strict';
  const C = env.content;
  const lib = env.taskOf('use-email').lib;

  // ---------------------------------------------------------------- content

  const REPLIES = C.lines(`
    Thanks, that works for me.
    Sounds good, see you then.
    Got it, thank you!
    I'll take a look today.
    Yes, please go ahead.
    Can we push this to next week?
    Thanks for the update.
    Count me in.
    I'm out that day, sorry.
    Looks good to me.
    Let me check and get back to you.
    Perfect, thanks!
    Received, thank you.
    I can do Thursday morning.
    Happy to help.
    Please send the final version.
    Approved.
    No worries at all.
    That's great news!
    I'll call you after lunch.
    Noted, thanks.
    Could you resend the attachment?
    Agreed.
    See you at 3.
    I've paid it, thanks.
    Not this time, but thanks.
    Will do.
    Thanks, I'll forward it to the team.
    Let's discuss on Monday.
    Confirmed for Friday.
    Great, thanks for sorting it out.
    Sorry, I can't make it.
    Yes, that's correct.
    Please add me to the list.
    I'll bring the slides.
    Works for me, thanks!
    On my way.
    Thank you, much appreciated.
    I'll review it tonight.
    Please cancel my order.
    I appreciate you letting me know.
    Could you clarify the last point?
    I'll have an answer by tomorrow.
    That timing works well.
    Thanks for thinking of me.
    Please keep me posted.
    Would Friday work instead?
    I'm glad we could work this out.
    I've attached the requested file.
    That answers my question, thanks.
    I'll check with the others first.
    Could we meet by phone?
    I'll be there.
    The details look right.
    I'll reserve a room for us.
    I appreciate the quick response.
    Let's leave it on the calendar.
    I'll send over my notes shortly.
    I can take care of that part.
    I enjoyed catching up today.
    That clears things up for me.
    I'll bring a few copies.
    I can meet wherever is easiest.
    Let me know if anything changes.
    I can make that time.
    Thanks for checking in.
    Could we start a little later?
    That plan sounds reasonable.
    I'll save you a seat.
    The new date works better for me.
    I can bring refreshments.
    I've made a note of it.
    I'll be there by noon.
    Let's touch base later this week.
    I have a conflict at that time.
    I'll pass this along.
    I'll keep that in mind.
    Please count on me for this.
    I found the file, thanks.
    I can join remotely if needed.
    Thanks for taking care of this.
    I have everything I need now.
    I'm happy to join the discussion.
    I'll be a little late.
    I have it on my list for today.
    Please go ahead without me.
    I can take the first shift.
    Could you send me the location?
    I'm glad you reached out.
    I don't have an update just yet.
    Thanks for flagging that detail.
    Please leave me off this round.
    I can stay for the full session.
    Everything is clear from here.
  `);
  const NEW_BODIES = C.lines(`
    Are you free for a quick call tomorrow?
    Please send me the latest numbers when you can.
    The meeting is moved to 2 pm.
    Here is my new address for the delivery.
    Can you share the slides from today?
    Lunch on Friday at noon?
    I'll be late to the standup.
    Please review the draft by Wednesday.
    The invoice has been paid.
    Thanks for your help last week.
    Could you book the small meeting room?
    I'm working from home today.
    The report is ready for review.
    Let's meet at the station at 9.
    Please confirm the order quantity.
    I have a question about the contract.
    Can we reschedule our call?
    The package arrived this morning.
    Happy birthday! Hope you have a great day.
    Reminder: the deadline is Monday.
    Welcome to the team!
    Please update the shared calendar.
    I left the keys at the front desk.
    See the notes from our meeting below.
    I saved a seat for you near the window.
    The building entrance is on the east side.
    I'll share the notes after the call.
    Are we still meeting at the usual time?
    The printer is working again.
    I can take the first shift on Saturday.
    Your folder is on the shelf by the door.
    Let's keep the original date for now.
    The draft looks good to me.
    I'll bring extra copies for everyone.
    The front desk has your envelope.
    I can help with the setup before lunch.
    The updated file is in the shared folder.
    Please save me a place at the table.
    I have added the new dates to my calendar.
    The hallway lights are back on.
    I'll send a fresh copy shortly.
    The small room is free after three.
    Thanks for keeping me in the loop.
    Please use the side entrance this evening.
    I picked up the materials on my way in.
    The next session starts at half past two.
    I'll check the list and get back to you.
    Your copy is ready at the front desk.
    I can cover the morning shift tomorrow.
    The office will be quiet after lunch.
    Let me know if you need another copy.
    We are all set for the afternoon session.
    I'll reserve a spot near the aisle.
    The spare charger is in the top drawer.
    Please share your preferred arrival time.
    I noticed a typo in the second paragraph.
    The workshop room has a projector.
    I will call from the quiet room upstairs.
    I can walk you through the new layout.
    Please bring your badge when you come by.
    The last page needs a signature.
    We can start once everyone has arrived.
    Your notebook is still on my desk.
    I will keep the window open for fresh air.
    The new sign is ready to be put up.
    The side door sticks when it gets cold.
    I left the recipe card beside the kettle.
    The bus stop has moved across the street.
    I found your scarf in the coat closet.
    The shelves are ready for the new books.
    I will meet you outside the museum at ten.
    The coffee machine is free now.
    I left a folded map on the hall table.
    The first bus leaves shortly after seven.
    The garden looks lovely after the rain.
    The labels for the blue boxes are ready.
    Let's take the path along the river.
    The mail slot is sticking again.
    Could you set the table near the window?
    I will bring a thermos for the walk.
    The new curtains are up in the front room.
    We have plenty of paper for the workshop.
    I can drop the keys off on my way home.
  `);
  const FOLDERS = C.lines(`
    Receipts
    Travel
    Projects
    Clients
    Family
    Newsletters
    Finance
    Hiring
    Invoices
    School
    Team
    Personal
    Events
    Vendors
    Support
    Legal
    Taxes
    Housing
    Orders
    Conferences
    Volunteering
    Health
    Marketing
    Partners
    Utilities
    Insurance
    Memberships
    Repairs
    Gardening
    Pets
    Sports
    Music
    Books
    Photography
    Research
    Design
    Engineering
    Operations
    Security
    Policies
    Feedback
    Surveys
    Warranties
    Returns
    Donations
    Childcare
    Carpool
    Parking
    Alumni
    Mentoring
    Awards
    Inventory
    Equipment
    Reference
    Ideas
    Art
    Theater
    Games
    Outdoors
    Birthdays
    Approvals
    Audits
    Backups
    Checklists
    Community
    Astronomy
    Deliveries
    Fieldwork
    Goals
    Inspections
    Interviews
    Licenses
    Milestones
    Moving
    Onboarding
    Reminders
    Genealogy
    Schedules
    Signups
    Timesheets
    Training
    Uniforms
    Waitlists
    Weather
    Weddings
    Writing
    Catering
    Exams
    Transit
    Pottery
    Sewing
    Woodworking
    Baking
    Puzzles
    Roommates
    Retirement
    Payroll
    Benefits
    Printing
    Storage
    Cleaning
    Recycling
    Costumes
    Dance
  `);
  // Attachment groups (by extension) and how goals name them.
  const ATT_EXTS = ['pdf', 'pdf', 'docx', 'xlsx', 'csv', 'pptx', 'jpg', 'png', 'heic', 'zip', 'mp4', 'm4a'];
  const GROUP_OF = { pdf: 'pdf', docx: 'doc', doc: 'doc', odt: 'doc', xlsx: 'sheet', csv: 'sheet', ods: 'sheet',
    pptx: 'slides', key: 'slides', jpg: 'image', png: 'image', heic: 'image', zip: 'zip', mp4: 'video', m4a: 'audio' };
  const GROUP_EXTS = { pdf: ['pdf'], doc: ['docx'], sheet: ['xlsx', 'csv'], slides: ['pptx'], image: ['jpg', 'png', 'heic'],
    zip: ['zip'], video: ['mp4'], audio: ['m4a'] };
  const GROUP_LABELS = { pdf: ['PDF'], doc: ['Word document'], sheet: ['spreadsheet'], slides: ['slide deck', 'presentation'],
    image: ['photo', 'image'], zip: ['ZIP file', 'zip archive'], video: ['video'], audio: ['audio recording'] };
  const ID_GROUPS = ['pdf', 'pdf', 'pdf', 'sheet', 'image', 'slides', 'zip', 'doc'];

  // Reference codes put into bodies (content goals name them).
  const REF_KINDS = [
    { label: 'order', code: (r) => C.orderId(r).replace(/^#/, ''), say: [
      'Order number: {code}.', 'This concerns order {code}.', 'Your order {code} is included below.',
      'Keep order {code} on file.', 'Order {code} is our reference.', 'Please mention order {code}.'
    ] },
    { label: 'invoice', code: (r) => C.invoiceId(r), say: [
      'Invoice number: {code}.', 'Please quote invoice {code} with your payment.', 'This is about invoice {code}.',
      'Keep invoice {code} in your files.', 'Invoice {code} is shown here.', 'Use {code} to identify the invoice.'
    ] },
    { label: 'tracking number', code: (r) => C.trackingCode(r).replace(/ /g, ''), say: ['Tracking number: {code}.', 'You can follow the parcel with tracking number {code}.'] },
    { label: 'booking reference', code: (r) => C.alnum(r, 6), say: ['Booking reference: {code}.', 'Your booking reference is {code}.'] },
    { label: 'ticket', code: (r) => `${r.int(10000, 99999)}`, say: ['Ticket {code} has been updated.', 'Reference: ticket {code}.'] },
    { label: 'case number', code: (r) => `CS-${C.digits(r, 6)}`, say: ['Case number: {code}.', 'Please keep case number {code} for your records.'] },
  ];
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const DOWS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const clock12 = (minutes) => {
    const h = Math.floor(minutes / 60);
    return `${((h + 11) % 12) + 1}:${String(minutes % 60).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
  };
  const daysIn = (y, mo) => (mo === 1 ? (y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0) ? 29 : 28) : [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][mo]);
  // Day of week (0 = Sunday) of a calendar date (Sakamoto).
  const dowOf = (y, mo, d) => {
    const yy = mo < 2 ? y - 1 : y;
    return (yy + Math.floor(yy / 4) - Math.floor(yy / 100) + Math.floor(yy / 400) + [0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4][mo] + d) % 7;
  };

  // traits.fullDate: every email also carries its full date, e.date = { y, mo (0-11), d, dow (0 = Sun), hm
  // ('5:12 PM'), line ('Tue, Mar 12, 2013, 5:12 PM') }. "Today" is the day after the sampled day of month; an
  // email `day` calendar days back lies that far before it. The year is drawn from the 'date' fork, so no other
  // draw moves. The list's short label of an older email (time 'Mar 12') is set to the true calendar date, so
  // both always agree.
  function addDates(dr, emails, when, month, dom) {
    const y0 = dr.int(2008, 2024);
    emails.forEach((e, i) => {
      const [day, minutes] = when[i];
      let y = y0;
      let mo = month;
      let d = Math.min(dom + 1, daysIn(y, mo)) - day;
      while (d < 1) {
        mo -= 1;
        if (mo < 0) { mo = 11; y -= 1; }
        d += daysIn(y, mo);
      }
      const dow = dowOf(y, mo, d);
      const hm = clock12(minutes);
      e.date = { y, mo, d, dow, hm, line: `${DOWS[dow]}, ${MONTHS[mo]} ${d}, ${y}, ${hm}` };
      if (day >= 2) e.time = `${MONTHS[mo]} ${d}`;
    });
  }

  // ---------------------------------------------------------------- sampling

  const levelOf = (opts) => (opts.level === 'easy' || opts.level === 'medium' ? opts.level : null);

  function sampleSpec(rng, opts) {
    let spec = sampleBase(rng, opts);
    if (lib.JUDGE_MODES.includes(opts.judge)) {
      for (let k = 0; k < 8; k++) {
        if (k) spec = sampleBase(rng.fork(`judge-retry/${k}`), opts);
        const j = lib.judgeOf(rng.fork('judge'), spec, opts.judge);
        if (j) { spec.judge = j; break; }
      }
    }
    return spec;
  }

  function sampleBase(rng, opts) {
    const cs = { csplit: opts.csplit || 'train' };
    const lv = levelOf(opts);
    const list = opts.scenarios && opts.scenarios.length ? opts.scenarios : lib.SCENARIOS;
    const scenario = opts.scenario || rng.pick(list);
    const ood = !!opts.ood;
    let task = scenario;
    if (scenario === 'nl') task = rng.pick(lib.SINGLE);
    else if (scenario === 'reply-all') task = 'reply';
    else if (scenario === 'attachment') task = rng.pick(['forward', 'forward', 'star', 'delete', 'archive', 'reply']);
    else if (scenario === 'search') task = rng.pick(['star', 'important', 'delete', 'archive', 'unread', 'reply', 'forward', 'move']);

    const spec = {
      scenario, task, nl: scenario === 'nl', isplit: opts.isplit || 'train', csplit: cs.csplit, ood,
      startMode: opts.startMode || 'off',
      recoverable: opts.recover ?? rng.bool(0.5),
      confirm: lv === 'easy' ? (rng.bool(0.35), false) : rng.bool(0.35),
      route: listRoute(rng.bool(0.5), opts.route),
      direct: rng.bool(0.35),
      shift: rng.bool(0.5),
      rows: rng.int(4, 6),
    };
    const rows = spec.rows;
    // Widget traits (only set by widgets that declare them, so older widgets keep the old spec shape).
    const traits = opts.traits || {};
    if (traits.rowIcons) spec.icons = traits.rowIcons.slice();
    if (traits.select === 'modifier') spec.ctrlTick = true;
    if (traits.keys) spec.keyDel = opts.route === 'keyboard' || (opts.route !== 'pointer' && rng.fork('keys').bool(0.5));
    let n;
    if (lv) {
      const easy = lv === 'easy';
      n = scenario === 'search' ? (easy ? rng.int(6, 8) : rng.int(9, 12)) : scenario === 'bulk' ? (easy ? rng.int(4, 5) : rng.int(6, 8))
        : scenario === 'undo' ? (easy ? rng.int(4, 5) : rng.int(5, 7)) : easy ? rng.int(3, Math.min(rows, 4)) : rng.int(rows, rows + 2);
    } else if (scenario === 'search') n = ood ? rng.int(30, 50) : rng.int(14, 24);
    else if (scenario === 'bulk') n = ood ? rng.int(16, 40) : rng.int(6, 14);
    else if (scenario === 'undo') n = ood ? rng.int(16, 40) : rng.int(5, 12);
    else if (ood) n = rng.int(16, 40);
    else n = rng.bool(0.4) ? rng.int(3, rows) : rng.int(rows + 1, 12);

    const { cr, emails, newPerson, meP, setSender, personOf, others } = sampleInbox(rng, cs, spec, n, ood, traits.fullDate);
    const tr = rng.fork('task');
    sampleTask(tr, spec, opts, cs, lv, { emails, newPerson, personOf, setSender, others, n, ood, scenario, task });

    // Bodies are written once the senders are final (greeting and signature match the sender).
    emails.forEach((e, i) => {
      const br = cr.fork(`body${i}`);
      e.body = C.emailBody(br, { sender: { full: e.name, first: e.first }, recipient: { full: meP.name, first: meP.first }, csplit: cs.csplit });
      if (e.ref) {
        const parts = e.body.split('\n\n');
        if (parts.length >= 3) parts[1] = `${parts[1]} ${e.ref.sentence}`;
        else parts.splice(1, 0, e.ref.sentence);
        e.body = parts.join('\n\n');
      }
    });
    // Codes must be unique across the inbox text (the goal names exactly one email).
    if (spec.by === 'content') {
      const code = emails[spec.target].ref.code;
      emails.forEach((x, i) => {
        if (i !== spec.target && x.body.toLowerCase().includes(code.toLowerCase())) x.body = x.body.split(code).join('(see above)');
      });
    }
    if (spec.target !== null) {
      const e = emails[spec.target];
      spec.searchKey = spec.by === 'sender' || spec.by === 'sender-order' ? e.name
        : spec.by === 'content' ? e.ref.code
          : spec.by === 'attachment' ? e.att.find((a) => a.group === spec.group).file
            : e.subject;
    }
    // Bulk by sender: searching the sender's name lists exactly the targets (search + select-all route).
    if (spec.task === 'bulk' && spec.bulk.crit === 'sender') {
      const hits = emails.map((_, i) => i).filter((i) => lib.matches(spec, i, spec.bulk.name));
      if (hits.length === spec.targets.length && hits.every((i) => spec.targets.includes(i))) {
        const s = tr.bool(0.4);
        // (the search + select-all route needs a select-all box: Outlook-like widgets, select 'modifier', have none)
        if (traits.select !== 'modifier' && ((opts.route === 'keyboard' && traits.search) || (s && opts.route !== 'pointer' && opts.route !== 'wheel' && opts.route !== 'keyboard'))) {
          spec.route = 'search';
          spec.searchKey = spec.bulk.name;
        }
      }
    }
    // opts.route 'keyboard': single-email goals find the target by typing in the search box.
    if (opts.route === 'keyboard' && traits.search && spec.target !== null && spec.searchKey) spec.route = 'search';
    if (task === 'undo') sampleUndo(rng.fork('undo'), spec);
    if (lv && !opts.judge) leadOf(rng.fork('lead'), spec, lv === 'easy');
    return spec;
  }

  // Content is sampled before choosing the target; keep this draw order intact.
  function sampleInbox(rng, cs, spec, n, ood, fullDate) {
    const cr = rng.fork('content');
    const people = [];
    const me = C.personName(cr, cs);
    const meP = { name: me.full, first: me.first, addr: C.emailAddress(cr, me) };
    spec.me = { name: meP.name, addr: meP.addr };
    const newPerson = () => {
      let p;
      for (let k = 0; k < 40; k++) {
        p = C.personName(cr, cs);
        if (p.full !== meP.name && !people.some((q) => q.name === p.full || q.first === p.first)) break;
      }
      const out = { name: p.full, first: p.first, addr: C.emailAddress(cr, p) };
      people.push(out);
      return out;
    };

    // Senders (some repeat), subjects, times.
    const senders = [];
    for (let i = 0; i < n; i++) senders.push(i > 0 && cr.bool(0.22) ? cr.pick(senders) : newPerson());
    const subjects = C.sample(cr, C.EMAIL_SUBJECTS, n, cs);
    while (subjects.length < n) subjects.push(`${C.pick(cr, C.EMAIL_SUBJECTS, cs)} (${subjects.length + 1})`);
    let minutes = cr.int(14 * 60, 18 * 60);
    let day = 0;
    const month = cr.int(0, 11);
    const dom = cr.int(8, 28);
    const timeLabel = () => {
      if (day === 0) return clock12(minutes);
      if (day === 1) return 'Yesterday';
      let d = dom - day + 1;
      let mo = month;
      while (d < 1) {
        d += 30;
        mo = (mo + 11) % 12;
      }
      return `${MONTHS[mo]} ${d}`;
    };
    const emails = [];
    const when = [];   // [day offset, minutes of day] per email, for traits.fullDate
    for (let i = 0; i < n; i++) {
      const s = senders[i];
      const er = cr.fork(`email${i}`);
      when.push([day, minutes]);
      emails.push({
        name: s.name, first: s.first, addr: s.addr, subject: subjects[i], body: '', time: timeLabel(),
        cc: [], att: [], ref: null,
        starred: er.bool(0.2), important: er.bool(0.2), unread: er.bool(0.4),
      });
      if (er.bool(0.45)) addRef(er, emails[i]);
      if (er.bool(0.3)) {
        const k = er.int(1, 2);
        for (let j = 0; j < k; j++) addAtt(er, emails[i], er.pick(ATT_EXTS), cs);
      }
      if (er.bool(0.2)) {
        const k = er.int(1, 2);
        for (let j = 0; j < k; j++) {
          const p = er.bool(0.5) && people.length > 2 ? er.pick(people) : newPerson();
          if (p.name !== s.name && !emails[i].cc.some((q) => q.name === p.name)) emails[i].cc.push({ name: p.name, addr: p.addr });
        }
      }
      minutes -= cr.int(5, ood ? 240 : 150);
      if (minutes < 7 * 60) {
        day += cr.int(1, 2);
        minutes = cr.int(17 * 60, 21 * 60);
      }
    }
    spec.emails = emails;
    if (fullDate) addDates(cr.fork('date'), emails, when, month, dom);
    const setSender = (i, p) => Object.assign(emails[i], { name: p.name, first: p.first, addr: p.addr });
    const personOf = (i) => ({ name: emails[i].name, first: emails[i].first, addr: emails[i].addr });
    const others = (t) => emails.map((_, i) => i).filter((i) => i !== t);
    return { cr, emails, newPerson, meP, setSender, personOf, others };
  }

  function sampleTask(tr, spec, opts, cs, lv, { emails, newPerson, personOf, setSender, others, n, ood, scenario, task }) {

    spec.folders = C.sample(tr, FOLDERS, ood ? tr.int(5, 7) : tr.int(2, 4), cs);
    spec.target = null;

    if (task === 'bulk') sampleBulk(tr, spec, cs, { newPerson, setSender });
    else if (task === 'compose') {
      const to = tr.bool(0.4) ? personOf(tr.int(0, n - 1)) : newPerson();
      const pool = C.split(C.EMAIL_SUBJECTS, cs.csplit).filter((s) => !/^(re|fwd?):/i.test(s) && !/^\[/.test(s));
      spec.mail = { to: { name: to.name, addr: to.addr }, subject: tr.pick(pool), body: C.pick(tr, NEW_BODIES, cs) };
      spec.by = null;
    } else {
      const t = tr.int(0, n - 1);
      spec.target = t;
      const by = scenario === 'attachment' ? 'attachment' : lv === 'easy' ? 'sender' : lv === 'medium' ? tr.pick(['sender', 'sender', 'subject'])
        : C.weighted(tr, [['sender', 0.36], ['subject', 0.2], ['content', 0.14], ['attachment', 0.1], ['sender-subject', 0.12], ['sender-order', 0.08]]);
      spec.by = by;
      const e = emails[t];
      const reassignOthers = () => others(t).forEach((i) => { if (emails[i].name === e.name) setSender(i, newPerson()); });
      const distract = () => {
        if (n > 2 && tr.bool(0.6)) setSender(tr.pick(others(t)), personOf(t));
      };
      if (by === 'sender') reassignOthers();
      else if (by === 'subject') distract();
      else if (by === 'content') {
        if (!e.ref) addRef(tr, e);
        distract();
      } else if (by === 'attachment') {
        const g = tr.pick(ID_GROUPS);
        spec.group = g;
        e.att = e.att.filter((a) => a.group !== g);
        addAtt(tr, e, tr.pick(GROUP_EXTS[g]), cs);
        if (tr.bool(0.3) && e.att.length < 2) addAtt(tr, e, tr.pick(ATT_EXTS.filter((x) => GROUP_OF[x] !== g)), cs);
        others(t).forEach((i) => { emails[i].att = emails[i].att.filter((a) => a.group !== g); });
        // At least one other email has a different attachment, so "the one with an attachment" is not enough.
        const o = others(t).filter((i) => !emails[i].att.length);
        if (o.length && !others(t).some((i) => emails[i].att.length)) addAtt(tr, emails[tr.pick(o)], tr.pick(ATT_EXTS.filter((x) => GROUP_OF[x] !== g)), cs);
        distract();
      } else {
        // sender-subject / sender-order: exactly two emails from the target's sender.
        reassignOthers();
        const j = tr.pick(others(t));
        setSender(j, personOf(t));
        spec.order = t < j ? 'latest' : 'oldest';
      }
      // The name the goal uses: the full name, or the first name when no other sender shares it.
      const firstUnique = emails.filter((x) => x.first === e.first && x.name !== e.name).length === 0;
      spec.refName = firstUnique && tr.bool(0.4) ? e.first : e.name;

      if (task === 'star' || task === 'star-reply') e.starred = false;
      if (task === 'important') e.important = false;
      if (task === 'unread') e.unread = false;
      if (task === 'reply' || task === 'star-reply') spec.reply = C.pick(tr, REPLIES, cs);
      if (scenario === 'reply-all') {
        e.cc = [];
        const k = ood ? tr.int(2, 4) : tr.int(1, 3);
        for (let j = 0; j < k; j++) {
          const p = tr.bool(0.4) ? personOf(tr.pick(others(t))) : newPerson();
          if (p.name !== e.name && !e.cc.some((q) => q.name === p.name)) e.cc.push({ name: p.name, addr: p.addr });
        }
        if (!e.cc.length) e.cc.push((() => { const p = newPerson(); return { name: p.name, addr: p.addr }; })());
        spec.replyAll = tr.bool(0.5);
      } else if (task === 'reply' || task === 'star-reply') {
        spec.replyAll = false;
        if (tr.bool(0.3) && !e.cc.length) {
          const p = newPerson();
          e.cc.push({ name: p.name, addr: p.addr });
        }
      }
      if (task === 'forward') {
        const pool = others(t).map(personOf).filter((p) => p.name !== e.name);
        const d = pool.length && tr.bool(0.5) ? tr.pick(pool) : newPerson();
        spec.dest = { name: d.name, addr: d.addr };
      }
      if (task === 'move') spec.folder = tr.pick(spec.folders);
      if (scenario === 'search') spec.route = opts.route === 'pointer' ? 'thumb' : opts.route === 'wheel' ? 'wheel' : 'search';
    }
  }

  // Levels: a partly done start (spec.lead, used by initModel when the start mode is 'off') and row icons for the
  // flag / delete tasks. easy: the target open with its composer (compose: the empty message), bulk rows ticked but
  // one, the undo folder shown with the target open; medium: sometimes the target open, half the bulk rows ticked,
  // the undo folder shown. spec.leadN = how many bulk rows start ticked.
  function leadOf(lr, spec, easy) {
    spec.direct = easy ? true : lr.bool(0.8);
    const k = (spec.targets || []).length;
    if (lib.isBulk(spec)) {
      if (easy || lr.bool(0.4)) {
        spec.lead = 'ticked';
        spec.leadN = easy ? Math.max(1, k - 1) : Math.max(1, Math.floor(k / 2));
      }
    } else if (lib.isUndo(spec)) {
      if (easy || lr.bool(0.5)) spec.lead = 'view';
    } else if (easy) spec.lead = 'scene';
    else if (lr.bool(0.6)) spec.lead = spec.task === 'compose' ? 'scene' : 'open';
  }

  // List scrolling route: opts.route wheel -> wheel, pointer -> thumb drag, else the sampled one.
  const listRoute = (wheel, route) => (route === 'wheel' ? 'wheel' : route === 'pointer' ? 'thumb' : wheel ? 'wheel' : 'thumb');

  // Undo: the target was trashed / archived / filed / marked as spam by mistake; some other mail lives in
  // those folders on purpose (spec.home), one of them often in the same folder as the target.
  function sampleUndo(ur, spec) {
    const t = spec.target;
    const kind = ur.pick(['trash', 'trash', 'archive', 'folder', 'spam']);
    spec.spam = kind === 'spam' || ur.bool(0.5);
    const box = kind === 'folder' ? ur.pick(spec.folders) : kind;
    spec.undo = { kind, box };
    const boxes = ['trash', 'archive', ...spec.folders, ...(spec.spam ? ['spam'] : [])];
    const others = spec.emails.map((_, i) => i).filter((i) => i !== t);
    const k = Math.max(1, Math.min(others.length - 2, spec.ood ? ur.int(3, 8) : ur.int(1, 4)));
    spec.home = spec.emails.map(() => 'inbox');
    ur.sample(others, k).forEach((i, j) => { spec.home[i] = j === 0 && ur.bool(0.7) ? box : ur.pick(boxes); });
    spec.say = ur.bool(0.4) ? 'vague' : 'specific';
    spec.toast0 = ur.bool(0.3);
  }

  function addRef(rng, e) {
    const k = rng.pick(REF_KINDS);
    const code = k.code(rng);
    e.ref = { label: k.label, code, sentence: C.fill(rng.pick(k.say), { code }) };
  }
  function addAtt(rng, e, ext, cs) {
    const group = GROUP_OF[ext] || 'doc';
    const kind = (C.FILE_EXTENSIONS.find((f) => f.ext === ext) || { kind: 'document' }).kind;
    let file = C.fileName(rng, ext, cs);
    if (e.att.some((a) => a.file === file)) file = file.replace(/(\.[^.]+)$/, ` (2)$1`);
    e.att.push({ file, ext, group, size: C.fileSize(rng, kind) });
  }

  function sampleBulk(rng, spec, cs, { newPerson, setSender }) {
    const emails = spec.emails;
    const n = emails.length;
    const op = rng.pick(['trash', 'archive', 'read', 'star']);
    const crit = op === 'read' ? rng.pick(['sender', 'unread', 'attachment']) : rng.pick(['sender', 'sender', 'attachment']);
    const k = Math.min(n - 2, spec.ood ? rng.int(4, 6) : rng.int(2, 4));
    let idx;
    if (spec.shift && crit !== 'unread' && rng.bool(0.6)) {
      const a = rng.int(0, n - k);
      idx = Array.from({ length: k }, (_, j) => a + j);
    } else idx = rng.sample(emails.map((_, i) => i), k).sort((x, y) => x - y);
    spec.bulk = { op, crit };
    if (crit === 'sender') {
      const p = newPerson();
      idx.forEach((i) => setSender(i, p));
      spec.bulk.name = p.name;
    } else if (crit === 'attachment') {
      emails.forEach((e, i) => {
        if (!idx.includes(i)) e.att = [];
        else if (!e.att.length) addAtt(rng, e, rng.pick(ATT_EXTS), cs);
      });
    } else emails.forEach((e, i) => { e.unread = idx.includes(i); });
    if (op === 'read') idx.forEach((i) => { emails[i].unread = true; });
    if (op === 'star') idx.forEach((i) => { emails[i].starred = false; });
    spec.targets = idx;
    spec.by = null;
  }

  Object.assign(lib, {
    NEW_BODIES, GROUP_LABELS, sampleSpec
  });
})();
