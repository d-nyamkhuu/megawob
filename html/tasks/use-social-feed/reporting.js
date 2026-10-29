/* use-social-feed/reporting.js: shared task reporting; loaded after logic.js. */
(function () {
  'use strict';
  const fam = env.taskOf('use-social-feed');
  const { clone } = env.util;
  const C = env.content;
  const { LABELS, PERSISTENT, keyOf, formatCount, replyToast, toastText, feedOf, collapsedBy } = fam.helpers;
  const { USER_ITEMS, parseKey, goodSend, goodKey, goodPick, listOf, canon, errorOf, terminal, initModel,
    TAGS, REPLY_TEXTS, quoteOf, hiddenPhrase } = fam.lib;

  const DONE_NAMES = { like: 'Liked posts', retweet: 'Retweeted posts', reply: 'Posts marked with Reply', share: 'Posts marked with Share' };
  // The count under a button as the base widget draws it: the base count, +1 while the button is on, + the replies sent.
  const shownCount = (model, spec, p, b) => (spec.posts[p].counts[b] || 0) + (model.on.includes(keyOf(p, b)) ? 1 : 0)
    + (b === 'reply' ? (model.sent || []).filter((sd) => sd[0] === p).length : 0);

  function factsOf(model, spec) {
    if (spec.judge) return [];
    const out = [];
    // aliases: other spellings of the value; labels: other names of the fact.
    const add = (label, value, aliases, labels) => out.push({ label, value: String(value),
      ...(aliases && aliases.length ? { aliases } : {}), ...(labels && labels.length ? { labels } : {}) });
    const onCount = (b) => model.on.filter((k) => parseKey(k)[1] === b).length;
    const a = spec.action;
    if (spec.scenario === 'all' || spec.scenario === 'some') {
      add(DONE_NAMES[a], onCount(a), null, [`${a}s`, `${LABELS[a]} count`]);
      const sel = spec.select.kind === 'user' ? `by ${spec.select.handle}` : `tagged ${spec.select.tag}`;
      add(`Posts ${sel}`, spec.targets.length, null, ['posts in the selection']);
      add('Targets with the button on', spec.targets.filter((p) => model.on.includes(keyOf(p, a))).length);
      return out;
    }
    const p = spec.post;
    const post = spec.posts[p];
    const author = () => add('Post author', post.name, [post.handle]);
    if (spec.scenario === 'one') {
      if (a !== 'share') add(`${LABELS[a]} count`, formatCount(shownCount(model, spec, p, a)), null, [`${a}s`, `number of ${a}s`]);
      author();
      add(DONE_NAMES[a], onCount(a), null, [`${a}s in the feed`]);
    } else if (spec.scenario === 'reply') {
      add('Replies on the post', formatCount(shownCount(model, spec, p, 'reply')), null, ['reply count', 'replies']);
      author();
      add('Confirmation message', replyToast(post.handle, ((model.sent || []).slice(-1)[0] || [0, ''])[1]));
    } else {
      add('Confirmation message', toastText(a, post.handle));
      if (PERSISTENT.includes(a)) {
        add('Posts collapsed', feedOf(spec, model).filter((q) => collapsedBy(spec, model, q) >= 0).length, null, ['collapsed posts', 'hidden posts']);
      } else author();
    }
    return out;
  }

  // silent: one believable failure right after a step that lowered the error (see the header).
  function silentOf(next, prev, spec, rng) {
    if (spec.judge || !next || !prev) return null;
    const cands = [];
    const v = spec.scenario;
    if (v === 'reply') {
      const sent = next.sent || [];
      const last = sent[sent.length - 1];
      if (sent.length > (prev.sent || []).length && goodSend(spec, last) && last[1].length > 12) {
        cands.push((m) => { m.sent[m.sent.length - 1] = [last[0], last[1].slice(0, Math.floor(last[1].length * 0.55)).trimEnd()]; });
      }
    } else if (v === 'one') {
      const key = goodKey(spec);
      if (next.on.includes(key) && !prev.on.includes(key)) cands.push((m) => { m.on = m.on.filter((x) => x !== key); });
    } else if (v === 'menu') {
      const last = next.picks[next.picks.length - 1];
      if (next.picks.length > prev.picks.length && goodPick(spec, last)) cands.push((m) => { m.picks = m.picks.slice(0, -1); });
    } else {
      const want = new Set(spec.targets.map((p) => keyOf(p, spec.action)));
      const added = next.on.filter((k) => want.has(k) && !prev.on.includes(k));
      if (added.length) {
        const k = rng.pick(added);
        cands.push((m) => { m.on = m.on.filter((x) => x !== k); });
        // the tap lands on the post next to it
        const [p] = parseKey(k);
        const list = listOf(spec, next);
        const at = list.indexOf(p);
        const near = [list[at - 1], list[at + 1]].filter((q) => q !== undefined && !spec.targets.includes(q)
          && !next.on.includes(keyOf(q, spec.action)) && !spec.start.includes(keyOf(q, spec.action)));
        if (near.length) {
          const q = rng.pick(near);
          cands.push((m) => { m.on = canon(m.on.filter((x) => x !== k).concat([keyOf(q, spec.action)])); });
        }
      }
    }
    for (const fn of rng.shuffle(cands)) {
      const out = clone(next);
      fn(out);
      if (JSON.stringify(out) !== JSON.stringify(next) && errorOf(out, spec) > 0 && !terminal(out, spec)) return out;
    }
    return null;
  }

  // The ways post p can be named in this feed (as sampleOne does).
  function waysOf(posts, p) {
    const count = (h) => posts.filter((q) => q.handle === h).length;
    const post = posts[p];
    const w = [];
    if (count(post.handle) === 1) w.push('user');
    if (quoteOf(posts, p)) w.push('text');
    if (post.short) w.push('hidden');
    if (post.media && post.media.kind === 'link' && posts.filter((x) => x.media && x.media.title === post.media.title).length === 1) w.push('link');
    if (post.media && post.media.kind === 'photo' && count(post.handle) > 1
      && posts.filter((x) => x.handle === post.handle && x.media && x.media.kind === 'photo').length === 1) w.push('photo');
    if (post.quote && posts.filter((x) => x.quote && x.quote.handle === post.quote.handle).length === 1) w.push('quote');
    return w;
  }

  // retarget: another post (or selection) with the same action and feed.
  function retargetOf(spec, model, rng) {
    if (spec.judge) return null;
    const s = clone(spec);
    const v = spec.scenario;
    const posts = spec.posts;
    if (v === 'all' || v === 'some') {
      const sels = [];
      const handles = [...new Set(posts.map((q) => q.handle))];
      for (const h of handles) {
        const t = posts.map((_, i) => i).filter((i) => posts[i].handle === h);
        if (t.length >= 2 && !(spec.select.kind === 'user' && spec.select.handle === h)) sels.push({ select: { kind: 'user', handle: h }, targets: t });
      }
      for (const tag of TAGS) {
        const t = posts.map((_, i) => i).filter((i) => posts[i].text.toLowerCase().includes(tag));
        if (t.length >= 2 && !(spec.select.kind === 'tag' && spec.select.tag === tag)) sels.push({ select: { kind: 'tag', tag }, targets: t });
      }
      if (!sels.length) return null;
      const pick = rng.pick(sels);
      s.select = pick.select;
      s.targets = pick.targets;
      if (v === 'some') s.count = rng.bool(0.75) ? rng.int(1, pick.targets.length - 1) : pick.targets.length;
    } else {
      const userItem = v === 'menu' && USER_ITEMS.includes(spec.action);
      const handle = posts[spec.post].handle;
      const pool = posts.map((_, i) => i).filter((p) => {
        if (p === spec.post || (userItem && posts[p].handle === handle)) return false;
        if (v === 'one' && (model.on.includes(keyOf(p, spec.action)) || spec.start.includes(keyOf(p, spec.action)))) return false;
        return userItem || waysOf(posts, p).length;
      });
      if (!pool.length) return null;
      const p = rng.pick(pool);
      s.post = p;
      s.phrase = null;
      s.qhandle = null;
      if (userItem) {
        s.by = 'user';
        s.targets = posts.map((_, i) => i).filter((i) => posts[i].handle === posts[p].handle);
      } else {
        const w = waysOf(posts, p).filter((x) => {
          if (x === 'hidden') return !!hiddenPhrase(rng.fork('probe'), posts, p);
          return true;
        });
        if (!w.length) return null;
        s.by = rng.pick(w);
        if (s.by === 'text') s.phrase = quoteOf(posts, p);
        if (s.by === 'hidden') s.phrase = hiddenPhrase(rng.fork('probe'), posts, p);
        if (s.by === 'quote') s.qhandle = posts[p].quote.handle;
        s.targets = [p];
      }
      if (v === 'reply') {
        const texts = C.split(REPLY_TEXTS, spec.csplit).filter((x) => x !== spec.text);
        if (texts.length) s.text = rng.pick(texts);
      }
    }
    return errorOf(model, s) > 0 && Number.isFinite(errorOf(initModel(s), s)) ? s : null;
  }


  Object.assign(fam.lib, { factsOf, silentOf, retargetOf });
})();
