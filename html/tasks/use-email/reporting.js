/* use-email/reporting.js: shared reporting internals; loaded through the task's files list. */
(function () {
  'use strict';
  const C = env.content;
  const lib = env.taskOf('use-email').lib;


  const boxCount = (model, f) => model.box.reduce((a, b, i) => a + (f(b, i) ? 1 : 0), 0);
  const unreadInbox = (model) => boxCount(model, (b, i) => b === 'inbox' && !!model.flags[i].unread);
  const flaggedCount = (model, key) => boxCount(model, (b, i) => b !== 'trash' && b !== 'spam' && !!model.flags[i][key]);

  // facts: what the sidebar counts, the sent notes and the status-bar toast show after the work is done.
  function factsOf(model, spec) {
    if (spec.judge) return [];
    const out = [];
    // aliases: other spellings of the value; labels: other names of the fact.
    const add = (label, value, aliases, labels) => out.push({ label, value: String(value),
      ...(aliases && aliases.length ? { aliases } : {}), ...(labels && labels.length ? { labels } : {}) });
    const last = model.sent[model.sent.length - 1] || null;
    const inboxUnread = () => add('Unread in Inbox', unreadInbox(model), null, ['Inbox unread', 'unread emails']);
    const inboxAll = () => add('Emails in Inbox', boxCount(model, (b) => b === 'inbox'), null, ['Inbox total', 'emails left in the inbox']);
    const folderCount = (box) => add(lib.viewLabel(box), boxCount(model, (b) => b === box), null, [`${lib.viewLabel(box)} folder`, `${lib.viewLabel(box)} count`]);
    const who = (p) => {
      const v = String((last && last.to) || '').trim();
      return [v, [p.name, p.addr].filter((x) => x !== v)];
    };
    const opFact = (op) => {
      if (op === 'delete' || op === 'trash') add('Trash', boxCount(model, (b) => b === 'trash'), null, ['Deleted Items', 'Trash count']);
      else if (op === 'archive') add('Archive', boxCount(model, (b) => b === 'archive'), null, ['Archive count']);
      else if (op === 'move') folderCount(spec.folder);
      else if (op === 'star') add('Starred', flaggedCount(model, 'starred'), null, ['Starred count', 'starred emails']);
      else if (op === 'important') add('Important', flaggedCount(model, 'important'), null, ['Important count', 'important emails']);
    };
    if (lib.isUndo(spec)) {
      inboxAll();
      folderCount(spec.undo.box);
      inboxUnread();
    } else if (spec.task === 'compose') {
      add('Sent', model.sent.length, null, ['Sent mail', 'Sent messages']);
      if (last) {
        const [v, al] = who(spec.mail.to);
        add('Message sent to', v, al);
        add('Subject sent', String(last.subject || '').trim());
      }
    } else if (lib.isBulk(spec)) {
      const op = spec.bulk.op;
      if (op === 'read') {
        inboxUnread();
        inboxAll();
      } else {
        opFact(op);
        inboxUnread();
      }
    } else {
      const e = spec.emails[spec.target];
      const o = lib.ops(spec);
      for (const op of o) {
        if (op === 'reply' || op === 'forward') {
          add('Sent', model.sent.length, null, ['Sent mail', 'Sent messages']);
          if (last) {
            const [v, al] = who(op === 'forward' ? spec.dest : { name: e.name, addr: e.addr });
            add(op === 'forward' ? 'Forwarded to' : 'Reply sent to', v, al);
          }
          add(op === 'forward' ? 'Email forwarded' : 'Email replied to', e.subject);
        } else opFact(op);
      }
      if (spec.task === 'unread') {
        inboxUnread();
        inboxAll();
      } else if (o.length === 1 && !['reply', 'forward'].includes(o[0])) inboxUnread();
    }
    return out.slice(0, 4);
  }

  // silent: one believable failure right after a step that lowered the error (see the header).
  function silentOf(next, prev, spec, rng) {
    if (spec.judge || !next || !prev) return null;
    const cands = [];
    const lastOf = (m) => m.sent[m.sent.length - 1];
    const patch = (m, fn) => {
      const x = lastOf(m);
      fn(x);
      if (m.toast && m.toast.kind === 'send') m.toast.msg = lib.clone(x);
    };
    if (next.sent.length > prev.sent.length) {
      const want = lib.wantDraft(spec);
      const d = lastOf(next);
      if (want && lib.draftRight(d, want)) {
        const ccList = String(d.cc || '').split(',').map((s) => s.trim()).filter(Boolean);
        if (ccList.length) cands.push((m) => patch(m, (x) => { x.cc = ccList.slice(0, -1).join(', '); }));
        const toks = String(d.to || '').trim().split(/\s+/);
        if (toks.length > 1) cands.push((m) => patch(m, (x) => { x.to = toks.slice(0, -1).join(' '); }));
        else if (toks[0].length > 4) cands.push((m) => patch(m, (x) => { x.to = toks[0].slice(0, -1); }));
        if (want.mode === 'new' && String(d.subject).length > 12) {
          cands.push((m) => patch(m, (x) => { x.subject = String(x.subject).slice(0, Math.max(8, Math.floor(String(x.subject).length * 0.6))).trimEnd(); }));
        }
        if (want.mode === 'reply' && String(d.body).length > 12) {
          cands.push((m) => patch(m, (x) => { x.body = String(x.body).slice(0, Math.floor(String(x.body).length * 0.55)).trimEnd(); }));
        }
      }
    } else {
      const g = lib.isUndo(spec) ? [spec.target] : lib.goals(spec);
      const boxTask = lib.isUndo(spec) || (lib.isBulk(spec) ? ['trash', 'archive'].includes(spec.bulk.op) : ['delete', 'archive', 'move'].includes(spec.task));
      const key = lib.isBulk(spec) ? { read: 'unread', star: 'starred' }[spec.bulk.op] : { star: 'starred', 'star-reply': 'starred', important: 'important', unread: 'unread' }[spec.task];
      const moved = boxTask ? next.box.map((b, i) => i).filter((i) => next.box[i] !== prev.box[i] && g.includes(i)) : [];
      if (moved.length) {
        const i = rng.pick(moved);
        cands.push((m) => { m.box[i] = prev.box[i]; });
      }
      const fl = key ? next.flags.map((f, i) => i).filter((i) => !!next.flags[i][key] !== !!prev.flags[i][key] && g.includes(i)) : [];
      if (fl.length) {
        const i = rng.pick(fl);
        cands.push((m) => { m.flags[i][key] = prev.flags[i][key]; });
      }
    }
    for (const fn of rng.shuffle(cands)) {
      const out = lib.clone(next);
      fn(out);
      if (JSON.stringify(out) !== JSON.stringify(next) && lib.errorOf(out, spec) > 0) return out;
    }
    return null;
  }

  // retarget helpers: the ways email i can be named with the inbox as it is (the content does not change).
  function namingsOf(spec, i) {
    const E = spec.emails;
    const e = E[i];
    const others = E.map((_, j) => j).filter((j) => j !== i);
    const out = [];
    const same = others.filter((j) => E[j].name === e.name);
    if (!same.length) out.push({ by: 'sender' });
    if (!others.some((j) => E[j].subject === e.subject)) out.push({ by: 'subject' });
    if (e.ref && !others.some((j) => E[j].body.toLowerCase().includes(e.ref.code.toLowerCase()))) out.push({ by: 'content' });
    for (const g of [...new Set(e.att.map((a) => a.group))]) {
      if (!others.some((j) => E[j].att.some((a) => a.group === g))) out.push({ by: 'attachment', group: g });
    }
    if (same.length === 1) {
      const j = same[0];
      if (E[j].subject !== e.subject) out.push({ by: 'sender-subject' });
      out.push({ by: 'sender-order', order: i < j ? 'latest' : 'oldest' });
    }
    return out;
  }

  // retarget: another email (or, for compose, another recipient, subject and text) with the same task and the
  // same inbox. Null when the task has no such change (undo, bulk, judge episodes) or no other email fits.
  function retargetOf(spec, model, rng) {
    if (spec.judge || lib.isUndo(spec) || lib.isBulk(spec)) return null;
    const s = lib.clone(spec);
    if (spec.task === 'compose') {
      const cs = { csplit: spec.csplit };
      const people = [];
      for (const e of spec.emails) if (e.name !== spec.mail.to.name && e.name !== spec.me.name && !people.some((p) => p.name === e.name)) people.push({ name: e.name, addr: e.addr });
      if (!people.length) return null;
      const to = rng.pick(people);
      const pool = C.split(C.EMAIL_SUBJECTS, spec.csplit).filter((x) => !/^(re|fwd?):/i.test(x) && !/^\[/.test(x) && x !== spec.mail.subject);
      const bodies = C.split(lib.NEW_BODIES, spec.csplit).filter((x) => x !== spec.mail.body);
      if (!pool.length) return null;
      s.mail = { to, subject: rng.pick(pool), body: bodies.length ? rng.pick(bodies) : C.pick(rng, lib.NEW_BODIES, cs) };
      return lib.errorOf(model, s) > 0 ? s : null;
    }
    if (spec.target === null || spec.target === undefined) return null;
    const o = lib.ops(spec);
    const cand = [];
    spec.emails.forEach((e, i) => {
      if (i === spec.target || model.box[i] !== 'inbox') return;
      if (o.some((op) => op !== 'reply' && op !== 'forward' && lib.opDone(model, spec, i, op))) return;
      if (spec.scenario === 'reply-all' && !e.cc.length) return;
      if (spec.task === 'forward' && spec.dest.name === e.name) return;
      const ways = namingsOf(spec, i).filter((w) => spec.scenario !== 'attachment' || w.by === 'attachment');
      if (ways.length) cand.push([i, ways]);
    });
    if (!cand.length) return null;
    const [t, ways] = rng.pick(cand);
    const w = rng.pick(ways);
    const e = spec.emails[t];
    s.target = t;
    s.by = w.by;
    delete s.group;
    delete s.order;
    if (w.group) s.group = w.group;
    if (w.order) s.order = w.order;
    const firstUnique = spec.emails.filter((x) => x.first === e.first && x.name !== e.name).length === 0;
    s.refName = firstUnique && rng.bool(0.4) ? e.first : e.name;
    s.searchKey = w.by === 'sender' || w.by === 'sender-order' ? e.name : w.by === 'content' ? e.ref.code
      : w.by === 'attachment' ? e.att.find((a) => a.group === w.group).file : e.subject;
    if (!lib.matches(s, t, s.searchKey)) return null;
    return lib.errorOf(model, s) > 0 && Number.isFinite(lib.errorOf(lib.baseModel(s), s)) ? s : null;
  }

  Object.assign(lib, {
    factsOf, silentOf, retargetOf
  });
})();
