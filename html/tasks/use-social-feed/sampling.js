/* use-social-feed/sampling.js: shared task sampling; loaded after logic.js. */
(function () {
  'use strict';
  const fam = env.taskOf('use-social-feed');
  const C = env.content;
  const { BUTTONS, keyOf } = fam.helpers;
  const { USER_ITEMS, canon } = fam.lib;

  const PHOTO_ALTS = ['a harbor at sunset', 'a bowl of ramen', 'a cat asleep on a keyboard', 'a mountain trail', 'a loaf of sourdough',
    'a city street in the rain', 'a vegetable garden', 'a bicycle against a wall', 'a beach at low tide', 'a stack of old books',
    'a snowy park', 'a concert stage', 'a coffee cup on a desk', 'a dog in the snow', 'a farmers market stall', 'a lighthouse',
    'a sailboat on a calm lake'];
  const TAGS = ['#weekend', '#coffee', '#design', '#running', '#music', '#travel', '#books', '#gardening',
    '#photography', '#cooking', '#cycling', '#movies', '#citylife', '#family', '#science', '#football', '#stargazing',
    '#pottery', '#knitting', '#origami', '#woodworking', '#watercolor', '#hiking', '#chess', '#crosswords', '#history',
    '#poetry', '#theater', '#dance', '#swimming', '#surfing', '#skating', '#camping', '#kayaking', '#geology',
    '#robotics', '#languages', '#calligraphy', '#journaling', '#festivals', '#picnics', '#antiques', '#fashion',
    '#beekeeping', '#sailing', '#archery', '#badminton', '#volleyball', '#animation', '#juggling', '#foraging',
    '#modelmaking', '#railways', '#embroidery', '#weaving', '#printmaking', '#sculpture', '#bookbinding', '#sewing',
    '#lacrosse', '#fencing', '#rowing', '#climbing', '#bowling', '#tabletennis', '#gymnastics', '#kites', '#weather',
    '#tidepools', '#botany', '#wildlife', '#fossils', '#aquariums', '#insects', '#mathematics', '#coding',
    '#electronics', '#cartography', '#folklore', '#philosophy', '#genealogy', '#magictricks', '#puppetry', '#cosplay',
    '#upcycling', '#penpals', '#podcasts', '#tea', '#baking', '#roleplaying', '#comics', '#typography', '#mosaics',
    '#collage', '#felting', '#soapmaking', '#bonsai', '#terrariums', '#rocketry', '#meteorites', '#ecology',
    '#archaeology', '#riddles', '#trivia', '#etymology', '#museums', '#cricket', '#basketball', '#baseball', '#tennis',
    '#skiing', '#snorkeling', '#discgolf', '#geocaching', '#sudoku', '#backgammon', '#billiards', '#darts',
    '#meditation', '#sunsets', '#lighthouses'];

  // Short replies for the reply scenario (typed into the inline composer).
  const REPLY_TEXTS = C.lines(`
    Congrats, that is great news!
    Thanks for sharing this.
    I completely agree with you.
    Love this, well done.
    Same here, honestly.
    Count me in for next time.
    That sounds like a lot of fun.
    Wow, I had no idea about that.
    Hope it all works out for you.
    Great photo, where was it taken?
    Totally worth the wait.
    Thanks, this made my day.
    Good luck with it!
    Never thought of it that way.
    Can you share more details?
    Welcome back, we missed you.
    This made me smile.
    That is such a lovely idea.
    I am glad you shared this.
    What a nice surprise!
    You put that perfectly.
    I needed to hear this today.
    So glad it went well!
    This is such a good reminder.
    You always find the best spots.
    What a beautiful view.
    That sounds like the right call.
    This turned out beautifully.
    I am rooting for you!
    I can see why you enjoyed it.
    This feels like a fresh start.
    That made me laugh out loud.
    What was your favorite part?
    I hope you get to go again soon.
    You captured the moment so well.
    I would never have guessed that.
    I am glad things are looking up.
    Such a clever little project.
    You make it sound so inviting.
    I have had a similar experience.
    That is worth celebrating!
    What a thoughtful thing to do.
    I am happy for you!
    Thanks for bringing us along.
    What a satisfying result!
    This is right up my alley.
    I did not expect that ending!
    What a sweet moment to remember.
    This has such a cozy feel to it.
    There is so much charm in this.
    What a fun detail to notice!
    A small moment with a big story.
    This has such a peaceful mood.
  `);

  // ---------------------------------------------------------------- sampling helpers

  // k distinct texts from the episode's content split, topped up from the whole bank when the split is
  // too small (heldout parts are ~20% of a bank).
  function takeTexts(rng, list, k, cs, ok = () => true) {
    const first = C.sample(rng, list, list.length, { csplit: cs });
    const out = first.filter(ok);
    if (out.length < k) for (const t of rng.shuffle(list)) if (out.length < k && !out.includes(t) && ok(t)) out.push(t);
    return out.slice(0, k);
  }

  function makeUsers(rng, n, cs, taken = []) {
    const users = [];
    const handles = new Set(taken);
    for (let tries = 0; users.length < n && tries < 600; tries++) {
      const person = C.personName(rng, { csplit: cs });
      let h = C.username(rng, person);
      h = C.ascii(h).toLowerCase().replace(/[.\-]/g, '_').replace(/[^a-z0-9_]/g, '').slice(0, 15);
      if (h.length < 4) continue;
      const handle = '@' + h;
      // No handle may be a prefix of another (instructions name handles as plain text).
      if ([...handles].some((x) => x.startsWith(handle) || handle.startsWith(x))) continue;
      const style = rng.int(0, 9);
      const name = style < 7 ? person.full : style === 7 ? `${person.first} ${person.last[0]}.` : style === 8 ? person.first : `Dr. ${person.full}`;
      handles.add(handle);
      users.push({ name, handle });
    }
    return users;
  }

  const age = (rng, i, prev) => prev + rng.int(i === 0 ? 1 : 3, 50 + i * 25);
  const fmtAge = (m) => (m < 60 ? `${m}m` : m < 24 * 60 ? `${Math.floor(m / 60)}h` : `${Math.floor(m / 1440)}d`);

  // Truncated form of a long text: cut at a word boundary near `at` characters.
  function shorten(text, at) {
    if (text.length <= at + 30) return null;
    const cut = text.lastIndexOf(' ', at);
    return text.slice(0, cut > 40 ? cut : at).replace(/[,;:.!?-]+$/, '') + '…';
  }

  // authors: [user index per post]; extras: per-post feature wishes.
  function buildPosts(rng, users, authors, o) {
    const cs = o.csplit;
    const tagSet = o.tag ? [o.tag] : [];
    const avoid = (t) => !tagSet.some((g) => t.toLowerCase().includes(g)) && !users.some((u) => t.toLowerCase().includes(u.handle));
    const texts = takeTexts(rng, C.POST_TEXTS, authors.length * 4 + 4, cs, avoid);
    const next = () => texts[ti++ % texts.length];
    const heads = takeTexts(rng, C.HEADLINES, authors.length, cs);
    const quoters = makeUsers(rng.fork('quoted'), 4, cs, users.map((u) => u.handle));
    let ti = 0;
    let mins = 0;
    const otherTags = TAGS.filter((t) => t !== o.tag);
    return authors.map((u, i) => {
      const long = rng.bool(o.longP ?? 0.3);
      let text = next();
      if (long) {
        text += ' ' + next();
        if (text.length < 190) text += ' ' + next();
      } else if (rng.bool(0.2) && text.length < 90) text += ' ' + next();
      if (o.tagged && o.tagged.has(i)) text += ' ' + o.tag;
      else if (rng.bool(0.15) && !/#\w/.test(text)) text += ' ' + rng.pick(otherTags);
      mins = age(rng, i, mins);
      const short = long ? shorten(text, rng.int(95, 125)) : null;
      let media = null;
      let quote = null;
      const r = rng.float();
      if (!long && r < 0.16) media = { kind: 'photo', hue: rng.int(0, 359), n: rng.pick([1, 1, 1, 2, 3, 4]), alt: rng.pick(PHOTO_ALTS) };
      else if (!long && r < 0.3) {
        const company = C.pick(rng, C.COMPANIES, { csplit: cs });
        media = { kind: 'link', title: heads[i % heads.length], domain: `${C.slug(company, '')}.com`.replace(/^(.{18}).*\.com$/, '$1.com'), hue: rng.int(0, 359) };
      } else if (r < 0.42 && quoters.length) {
        const q = rng.pick(quoters);
        quote = { name: q.name, handle: q.handle, text: next() };
      }
      return {
        name: users[u].name,
        handle: users[u].handle,
        time: fmtAge(mins),
        text,
        short,
        media,
        quote,
        counts: { reply: rng.int(0, 48), retweet: rng.int(0, 160), like: rng.bool(0.15) ? rng.int(1000, 24000) : rng.int(0, 900) },
      };
    });
  }

  // Shortest prefix of >= 4 words (visible on the page) that occurs in no other post's text.
  function quoteOf(posts, p) {
    const src = (posts[p].short || posts[p].text).replace(/…$/, '');
    const words = src.split(' ');
    for (let k = Math.min(4, words.length); k <= words.length; k++) {
      const q = words.slice(0, k).join(' ').replace(/[.,!?;:]$/, '');
      if (posts.every((o, j) => j === p || !(o.text.includes(q) || (o.quote && o.quote.text.includes(q))))) return q;
    }
    return null;
  }

  // A phrase (4-6 words) from the part of a truncated post that is hidden until "Show more": the start of a
  // sentence that begins in the hidden part, else the last words of the text.
  function hiddenPhrase(rng, posts, p) {
    const post = posts[p];
    if (!post.short) return null;
    const vis = post.short.replace(/…$/, '');
    const tail = post.text.slice(vis.length).replace(/#\w+/g, '').trim();
    const clean = (q) => q.replace(/^[^\w"']+|[^\w"')]+$/g, '');
    const cands = [];
    for (const sent of tail.split(/(?<=[.!?])\s+/).slice(1)) {
      const w = sent.split(/\s+/).filter(Boolean);
      if (w.length >= 4) cands.push(clean(w.slice(0, Math.min(w.length, rng.int(4, 6))).join(' ')));
    }
    const words = tail.split(/\s+/).filter(Boolean);
    if (words.length >= 4) cands.push(clean(words.slice(-Math.min(words.length, rng.int(4, 5))).join(' ')));
    for (const q of cands) {
      if (q.split(' ').length < 3 || vis.includes(q) || !post.text.includes(q)) continue;
      if (posts.every((o, j) => j === p || !(o.text.includes(q) || (o.quote && o.quote.text.includes(q))))) return q;
    }
    return null;
  }

  // Random author list: user `t` gets exactly `k` posts (k = 0: no such user); every other user posts at
  // least once, the remaining posts go to random other users.
  function authorsFor(rng, n, nUsers, t, k) {
    const out = [];
    for (let i = 0; i < k; i++) out.push(t);
    const others = [...Array(nUsers).keys()].filter((u) => !k || u !== t);
    for (const u of others) if (out.length < n) out.push(u);
    while (out.length < n) out.push(rng.pick(others));
    return rng.shuffle(out);
  }

  function startKeys(rng, posts, exclude) {
    const keys = [];
    posts.forEach((_, p) => {
      for (const b of ['retweet', 'like', 'reply']) {
        const pr = b === 'reply' ? 0.04 : 0.14;
        if (rng.bool(pr) && !exclude(p, b)) keys.push(keyOf(p, b));
      }
    });
    return canon(keys);
  }

  // Feed mechanics shared by every scenario.
  function mechanics(rng, spec, o, n) {
    spec.route = rng.bool(0.5) ? 'wheel' : 'thumb';
    spec.hoverBar = rng.bool(0.3) && !o.level;
    spec.loadMs = Math.round((rng.float(0.6, 1.6) * o.beat) / 50) * 50;
    spec.page = n >= 8 && rng.bool(o.ood ? 0.7 : 0.45) ? { first: rng.int(4, 6), more: rng.int(3, 5) } : null;
    if (o.simple || o.level) spec.page = null;
  }

  function sampleOne(rng, o, scenario) {
    for (let tries = 0; tries < 60; tries++) {
      const n = o.level === 'easy' ? rng.int(4, 5) : o.level === 'medium' ? rng.int(6, 8) : o.ood ? rng.int(16, 24) : rng.int(6, 12);
      const tabs = o.level ? (rng.bool(0.3), false) : rng.bool(0.3);
      if (o.simple && tabs) continue;
      const nAll = tabs ? n + rng.int(3, 5) : n;
      const users = makeUsers(rng, rng.int(4, Math.min(9, nAll)), o.csplit);
      const authors = authorsFor(rng, nAll, users.length, -1, 0);
      const posts = buildPosts(rng, users, authors, { csplit: o.csplit, longP: 0.32 });
      if (o.simple) posts.forEach((q) => { q.quote = null; });
      const count = (h) => posts.filter((q) => q.handle === h).length;
      const ids = [...posts.keys()];
      // Lists: one timeline, or two disjoint tabs.
      let lists;
      let tab0;
      if (tabs) {
        const sh = rng.shuffle(ids);
        const k = Math.round(nAll * rng.float(0.45, 0.6));
        lists = { foryou: sh.slice(0, k).sort((a, b) => a - b), following: sh.slice(k).sort((a, b) => a - b) };
        tab0 = rng.bool(0.75) ? 'foryou' : 'following';
      } else {
        lists = { home: ids };
        tab0 = 'home';
      }
      let action;
      if (scenario === 'one') action = rng.pick(BUTTONS);
      else if (scenario === 'reply') action = 'reply';
      else action = rng.pick(['mute', 'mute', 'block', 'block', 'copy', 'dm', 'embed', 'report', 'hide']);
      if (o.simple && action === 'share') continue;
      // Candidates and how they can be named.
      const ways = (p) => {
        const w = [];
        const post = posts[p];
        if (count(post.handle) === 1) w.push('user');
        if (quoteOf(posts, p)) w.push('text');
        if (post.short) w.push('hidden');
        if (post.media && post.media.kind === 'link' && posts.filter((x) => x.media && x.media.title === post.media.title).length === 1) w.push('link');
        if (post.media && post.media.kind === 'photo' && count(post.handle) > 1
          && posts.filter((x) => x.handle === post.handle && x.media && x.media.kind === 'photo').length === 1) w.push('photo');
        if (post.quote && posts.filter((x) => x.quote && x.quote.handle === post.quote.handle).length === 1) w.push('quote');
        return w;
      };
      const tabOf = (p) => Object.keys(lists).find((k) => lists[k].includes(p));
      let pool = ids.filter((p) => ways(p).length);
      if (tabs && rng.bool(0.75)) pool = pool.filter((p) => tabOf(p) !== tab0);
      const late = pool.filter((p) => lists[tabOf(p)].indexOf(p) >= 3);
      if (late.length && rng.bool(0.7)) pool = late;
      if (!pool.length) continue;
      const post = rng.pick(pool);
      let w = ways(post);
      if (USER_ITEMS.includes(action)) {
        // Mute / block: any post by that user; named by handle only.
        w = ['user'];
      } else {
        // Prefer the richer ways a third of the time each.
        const rich = w.filter((x) => x !== 'user' && x !== 'text');
        if (rich.length && rng.bool(0.55)) w = rich;
      }
      const by0 = rng.pick(w);
      const by = o.level === 'easy' && w.includes('user') ? 'user' : by0;
      let phrase = null;
      if (by === 'text') phrase = quoteOf(posts, post);
      if (by === 'hidden') phrase = hiddenPhrase(rng, posts, post);
      if (by === 'hidden' && !phrase) continue;
      const handle = posts[post].handle;
      const targets = USER_ITEMS.includes(action) ? ids.filter((p) => posts[p].handle === handle) : [post];
      if (USER_ITEMS.includes(action) && tabs && !targets.some((p) => lists[tab0].includes(p)) && rng.bool(0.5)) {
        // fine either way: the agent may switch tabs to find one of their posts
      }
      const start = startKeys(rng, posts, (p, b) => (p === post && b === action) || (scenario === 'reply' && b === 'reply'));
      const spec = { posts, lists, tab0, start, action, post, by, phrase, qhandle: by === 'quote' ? posts[post].quote.handle : null, targets };
      if (scenario === 'reply') spec.text = C.pick(rng, REPLY_TEXTS, { csplit: o.csplit });
      mechanics(rng, spec, o, Math.max(...Object.values(lists).map((l) => l.length)));
      return spec;
    }
    throw new Error('use-social-feed: could not sample a feed');
  }

  function sampleGroup(rng, scenario, o) {
    for (let tries = 0; tries < 60; tries++) {
      const n = o.level === 'easy' ? rng.int(5, 6) : o.level === 'medium' ? rng.int(7, 9) : o.ood ? rng.int(15, 22) : scenario === 'all' ? rng.int(7, 13) : rng.int(8, 14);
      const k = o.level === 'easy' ? 2 : o.level === 'medium' ? rng.int(2, 3) : o.ood ? rng.int(4, 6) : scenario === 'all' ? rng.int(2, 4) : rng.int(2, 5);
      const byTag = rng.bool(0.3);
      const users = makeUsers(rng, rng.int(4, 7), o.csplit);
      let authors;
      let tag = null;
      let tagged = new Set();
      if (byTag) {
        authors = authorsFor(rng, n, users.length, -1, 0);
        tag = rng.pick(TAGS);
        tagged = new Set(rng.sample([...Array(n).keys()], k));
      } else authors = authorsFor(rng, n, users.length, 0, k);
      const posts = buildPosts(rng, users, authors, { csplit: o.csplit, tag, tagged, longP: 0.2 });
      if (o.simple) posts.forEach((q) => { q.quote = null; });
      const action = rng.pick(BUTTONS);
      if (o.simple && action === 'share') continue;
      const select = byTag ? { kind: 'tag', tag } : { kind: 'user', handle: users[0].handle };
      const targets = posts.map((q, i) => i).filter((i) => (byTag ? tagged.has(i) : authors[i] === 0));
      if (byTag && posts.some((p, i) => !tagged.has(i) && p.text.toLowerCase().includes(tag))) continue;
      const start = startKeys(rng, posts, (p, b) => b === action);
      const spec = { posts, lists: { home: [...posts.keys()] }, tab0: 'home', start, action, select, targets };
      if (scenario === 'some') spec.count = rng.bool(0.75) ? rng.int(1, targets.length - 1) : targets.length;
      mechanics(rng, spec, o, n);
      return spec;
    }
    throw new Error('use-social-feed: could not sample a group feed');
  }


  Object.assign(fam.lib, { TAGS, REPLY_TEXTS, sampleOne, sampleGroup, makeUsers, quoteOf, hiddenPhrase });
})();
