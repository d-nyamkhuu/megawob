/* use-social-feed/instructions.js: shared task instructions; loaded after logic.js. */
(function () {
  'use strict';
  const fam = env.taskOf('use-social-feed');
  const I = env.instruct;
  const { LABELS, menuLabel } = fam.helpers;
  const { USER_ITEMS, tabOf, TAGS, makeUsers } = fam.lib;

  const LABEL_ALIASES = { reply: ['Comment', 'reply'], retweet: ['Repost', 'retweet'], like: ['Heart', 'like'], share: ['share'] };
  // ---------------------------------------------------------------- instructions

  const Q = (s) => `"${s}"`;
  const T = (s) => `“${s}”`;

  // How the named post is referred to.
  function refOf(rng, spec) {
    const p = spec.posts[spec.post];
    const h = p.handle;
    const pick = (ts) => I.pick(rng, ts, spec.isplit);
    switch (spec.by) {
      case 'user': return I.fill(pick([
        'the post by {h}', "{h}'s post", 'the post from {h}', 'what {h} posted', 'the update from {h}',
        'the one post from {h}', 'the post {h} made', '{h}\'s feed entry', 'what {h} put up', 'that {h} post',
        '{h}\'s contribution', 'what {h} is saying'
      ]), { h });
      case 'text': return I.fill(pick(['the post by {h} that starts with {q}', "{h}'s post beginning {q}", 'the post that begins with {q}',
        'the post reading {q}…', 'the post opening with {q}', 'the post whose opening is {q}',
        'the post led off with {q}', 'the post {h} opens with {q}', '{h}\'s post prefaced with {q}']), { h, q: T(spec.phrase) });
      case 'hidden': return I.fill(pick(['the post by {h} that mentions {q}', "{h}'s post that talks about {q}", 'the post containing {q}',
        'the post where {h} writes {q}',
        'the post with {q} in its text',
        '{h}\'s post with the words {q}',
        'the post where {q} can be found',
        '{h}\'s post including {q}',
        'the post whose text includes {q}']), { h, q: T(spec.phrase) });
      case 'link': return I.fill(pick(['the post sharing the article {q}', 'the post with the link {q}', 'the post that links to {q}',
        'the post with a link card titled {q}',
        'the post carrying a {q} link',
        'the post whose link title is {q}',
        'the post displaying {q} as a link',
        'the post whose card is headed {q}']), { q: T(p.media.title) });
      case 'photo': return I.fill(pick([
        'the post by {h} with a photo', "{h}'s photo post", 'the photo {h} posted', "{h}'s post that has a picture",
        "the post {h} put a photo in", "the photo from {h}", "what {h} posts with a photo", "a photo update by {h}",
        "{h}'s picture upload", "what {h} shared with a photo"
      ]), { h });
      case 'quote': return I.fill(pick([
        'the post that quotes {q}', 'the post quoting {q}', 'the post where someone quotes {q}',
        'the quote post of {q}', 'a post with {q} quoted', 'a post with a {q} quote'
      ]), { q: spec.qhandle });
      default: return `the post by ${h}`;
    }
  }

  const ONE_T = {
    like: ['Like {ref}.', 'Click the {L} button on {ref}.', 'Give {ref} a like.', 'Hit {L} on {ref}.', 'Press the heart under {ref}.',
      'Tap {L} below {ref}.', 'Add a like to {ref}.', 'Favorite {ref}.', 'Mark {ref} as liked.', 'A like for {ref}.',
      'Make {ref} a favorite.', 'Leave a heart for {ref}.', 'Like {ref} using {L}.', 'Switch on {L} for {ref}.',
      '{ref} needs a like.', 'I want {ref} liked.'],
    retweet: ['Retweet {ref}.', 'Click {L} on {ref}.', 'Repost {ref}.', 'Press the {L} button under {ref}.', 'Boost {ref} with {L}.',
      'Share {ref} to your timeline using {L}.', 'Hit {L} below {ref}.', 'Give {ref} a retweet.',
      'Pass {ref} along as a retweet.', 'Repost with {L} on {ref}.', 'Switch on {L} for {ref}.',
      'I want {ref} reposted.', 'Use {L} to recirculate {ref}.', '{ref} needs a repost.', 'Have {ref} get a retweet.'],
    reply: ['Click {L} on {ref}.', 'Open a reply to {ref}.', 'Start a reply to {ref}.', 'Press the {L} button on {ref}.', 'Hit {L} under {ref}.',
      'Click the speech bubble under {ref}.',
      'Choose the reply icon for {ref}.',
      'Activate {L} under {ref}.',
      'Use the speech bubble for {ref}.',
      'Open Reply under {ref}.',
      '{ref} needs a Reply click.',
      'I want {L} active on {ref}.'],
    share: ['Click {L} on {ref}.', 'Use the {L} button on {ref}.', 'Press {L} under {ref}.', 'Hit the share icon on {ref}.',
      'Click the {L} button below {ref}.', 'Open the share options of {ref}.', 'Set {L} toggle on for {ref}.',
      'Give {ref} a share.', '{ref} should have {L} on.', 'Make {ref} into a shared post.',
      'Leave {ref} with sharing active.', 'I want {ref} to be shared.', 'Share {ref} through {L}.'],
  };
  const GROUP_VERB = { like: 'like', retweet: 'retweet', reply: 'click Reply on', share: 'click Share on' };
  const ALL_T = ['{Verb} every post {sel}.', '{Verb} all posts {sel}.', 'Go through the feed and {verb} each post {sel}.',
    'Click {L} on all of the posts {sel}.', 'Every post {sel} should get a {L} click.', '{Verb} each and every post {sel}.',
    'Find all posts {sel} and {verb} them.',
    'All posts {sel} need {L} on.',
    '{Verb} posts {sel} without exception.',
    '{Verb} the full set of posts {sel}.',
    'Leave no post {sel} without {L} on.'];
  const SOME_T = ['{Verb} exactly {N} {posts} {sel}.', '{Verb} {N} of the posts {sel}, no more.', 'Pick {N} {posts} {sel} and {verb} {them}.',
    'Click {L} on exactly {N} {posts} {sel}.', 'Choose any {N} {posts} {sel} and {verb} {them} (exactly {N}).', 'Only {N} {posts} {sel} should be {done}.',
    'Have exactly {N} {posts} {sel} {done} overall.', 'In total, {N} {posts} {sel} must be {done}.',
    'Limit {L} to exactly {N} {posts} {sel}.', 'Stop at exactly {N} {posts} {sel} {done}.',
    'End with {N} {posts} {sel} {done}, exactly.', '{Verb} no fewer or more than {N} {posts} {sel}.',
    'For {L}, end at {N} {posts} {sel}.', 'Including prior {L}, end at {N} {posts} {sel}.',
    'Keep the total at {N} {posts} {sel} {done}.'];
  const DONE = { like: 'liked', retweet: 'retweeted', reply: 'marked with Reply', share: 'marked with Share' };
  const USER_T = {
    mute: ['Mute {h}.', 'Mute {h} using the More menu on one of their posts.', "I don't want to see {h} any more; mute them.",
      'Silence {h} (mute, do not block).', 'Open the ⋯ menu on any post by {h} and choose {label}.', 'Use a post by {h} to mute the account.',
      'Add {h} to the muted accounts.', 'The More menu on a post by {h} has {label}; use it.',
      'I want {h}\'s posts silenced; mute the account.', 'Mute {h} once for all their posts.',
      'Make sure {h} is on mute.', 'Put {h} on mute through any of their posts.',
      'Keep {h} quiet by muting the account.', 'For {h}, use {label} in a post\'s More menu.',
      '{h} is the account I want muted.', 'Set the account {h} to stay muted.',
      'On a post by {h}, More then {label} mutes them.', 'The feed needs a break from {h}; mute them.',
      'All I need is for {h} to be muted.'],
    block: ['Block {h}.', 'Block {h} using the More menu on one of their posts.', 'Open the ⋯ menu on a post by {h} and choose {label}, then confirm.',
      'Get rid of {h} for good: block them.', 'Block the account {h} (confirm when asked).', 'Use a post by {h} to block the account.',
      'I want a confirmed block on {h}.', 'Put a block on {h}, confirming if prompted.',
      'Ensure the block on {h} goes through.', 'Finish the block on {h} by confirming.',
      'In More on a post by {h}, pick {label} and confirm.', 'Go ahead and block {h}, then confirm.',
      'For {h}, complete the block.', 'After choosing to block {h}, confirm it.'],
  };
  const POST_T = {
    copy: [
      'Copy the link to {ref}.', 'Get the link of {ref} from its More menu.', 'Choose {label} for {ref}.',
      'Open the More menu on {ref} and click {label}.', 'I need the link to {ref} copied.',
      'Use More to copy the link to {ref}.', 'The link for {ref} needs to be copied.',
      'Put the link to {ref} on the clipboard.', 'Use {label} from the More menu of {ref}.',
      'Copy the URL for {ref} via More.'
    ],
    embed: [
      'Get the embed code for {ref}.', 'Choose {label} for {ref}.', 'Open the More menu on {ref} and click {label}.',
      'Embed {ref}.', 'Use More to embed {ref}.', 'An embed is needed for {ref}.'
    ],
    dm: [
      'Send {ref} via Direct Message.', 'Choose {label} for {ref}.', 'Open the More menu on {ref} and click {label}.',
      'Share {ref} in a direct message.', 'Pass {ref} along by Direct Message.',
      'Send {ref} as a direct message in More.', 'Select {label} in More for {ref}.',
      'Use the Direct Message option for {ref}.'
    ],
    report: [
      'Report {ref}.', 'Report {ref} and confirm.', 'Open the More menu on {ref}, choose {label} and confirm.',
      'Flag {ref} with {label}.', 'Confirm a report on {ref}.', 'Use {label} on {ref} and confirm.',
      'Have a report for {ref} confirmed.'
    ],
    hide: ['Mark {ref} as not interesting.', 'Tell the app you are not interested in {ref}.', 'Choose {label} for {ref}.',
      'Open the More menu on {ref} and click {label}.',
      'Set {ref} to not interested.',
      'Use the Not interested option for {ref}.',
      'Mark my lack of interest in {ref}.'],
  };
  const REPLY_T = ['Reply to {ref} with {msg}.', 'Write {msg} as a reply to {ref} and send it.', 'Answer {ref} with the reply {msg}.',
    'Reply {msg} to {ref}.', 'Send a reply to {ref} saying {msg}.', 'Respond to {ref}: {msg}', 'Post the reply {msg} under {ref}.',
    'Publish an answer to {ref}: {msg}', '{ref} should get a reply: {msg}', 'Write back to {ref}: {msg}',
    'Your reply to {ref}: send {msg}.', '{msg}: send back to {ref}.', 'Send a response to {ref}: {msg}',
    'Make {msg} the reply under {ref}.', '{ref}: answer by sending {msg}.', 'Say {msg} in a reply to {ref}.',
    'Give {ref} this response: {msg}.'];
  const TAB_NAMES = { foryou: 'For you', following: 'Following' };

  function instructionOf(spec, rng) {
    const v = spec.scenario;
    const say = (core, terse, steps) => I.say(rng, core, { isplit: spec.isplit, terse, steps, typo: 0 });
    const label = (b) => Q(I.alias(rng, LABELS[b], LABEL_ALIASES[b]));
    if (v === 'one') {
      const ref = refOf(rng, spec);
      let core = I.fill(I.pick(rng, ONE_T[spec.action], spec.isplit), { ref, L: label(spec.action) });
      core = I.ucFirst(core);
      if (spec.lists.foryou && rng.bool(0.25)) core = `In the ${TAB_NAMES[tabOf(spec, spec.post)]} tab, ${I.lcFirst(core)}`;
      return say(core, `${spec.action}: ${ref}`, [`find ${ref}`, `click ${LABELS[spec.action]} on it`]);
    }
    if (v === 'reply') {
      const ref = refOf(rng, spec);
      let core = I.ucFirst(I.fill(I.pick(rng, REPLY_T, spec.isplit), { ref, msg: T(spec.text) }));
      if (spec.lists.foryou && rng.bool(0.25)) core = `In the ${TAB_NAMES[tabOf(spec, spec.post)]} tab, ${I.lcFirst(core)}`;
      return say(core, `reply to ${ref}: ${spec.text}`, [`find ${ref}`, 'click Reply', `type ${T(spec.text)}`, 'send the reply']);
    }
    if (v === 'all' || v === 'some') {
      const s = spec.select;
      const one = v === 'some' && spec.count === 1;
      const sel = s.kind === 'user' ? rng.pick([`by ${s.handle}`, `from ${s.handle}`])
        : rng.pick([`tagged ${s.tag}`, `that mention${one ? 's' : ''} ${s.tag}`, `with the hashtag ${s.tag}`]);
      const verb = GROUP_VERB[spec.action];
      const N = spec.count;
      const vars = { verb, Verb: I.ucFirst(verb), sel, L: label(spec.action), N, posts: N === 1 ? 'post' : 'posts', them: N === 1 ? 'it' : 'them', done: DONE[spec.action] };
      const core = I.ucFirst(I.fill(I.pick(rng, v === 'all' ? ALL_T : SOME_T, spec.isplit), vars));
      const terse = v === 'all' ? `${spec.action} all posts ${sel}` : `${spec.action} ${N} post${N === 1 ? '' : 's'} ${sel}`;
      return say(core, terse);
    }
    // menu
    const p = spec.posts[spec.post];
    const lab = Q(menuLabel(spec.action, p.handle));
    if (USER_ITEMS.includes(spec.action)) {
      const core = I.fill(I.pick(rng, USER_T[spec.action], spec.isplit), { h: p.handle, label: lab });
      const steps = [`open the More menu on a post by ${p.handle}`, `choose ${lab}`].concat(spec.action === 'block' ? ['confirm'] : []);
      return say(core, `${spec.action} ${p.handle}`, steps);
    }
    const ref = refOf(rng, spec);
    let core = I.ucFirst(I.fill(I.pick(rng, POST_T[spec.action], spec.isplit), { ref, label: lab }));
    if (spec.lists.foryou && rng.bool(0.25)) core = `In the ${TAB_NAMES[tabOf(spec, spec.post)]} tab, ${I.lcFirst(core)}`;
    const steps = [`open the More menu on ${ref}`, `choose ${lab}`].concat(spec.action === 'report' ? ['confirm'] : []);
    return say(core, `${menuLabel(spec.action, p.handle).toLowerCase()}: ${ref}`, steps);
  }

  // ---------------------------------------------------------------- judge modes

  // A handle nobody in the feed has (drawn like the feed's own handles, so it is different every seed).
  function absentHandle(jr, spec) {
    const taken = spec.posts.flatMap((p) => [p.handle, p.quote ? p.quote.handle : null]).filter(Boolean);
    return makeUsers(jr.fork('absent'), 1, spec.csplit, taken)[0].handle;
  }
  const firstOf = (name) => name.split(' ')[0];
  const lastOf = (name) => name.split(' ').slice(1).join(' ') || name;
  const USER_VERBS = { mute: [
    'Mute {f}.', 'Mute the user {f}.', "Stop seeing {f}'s posts: mute them.", "Get {f} blocked.", "{f}: block them.",
    "A block on {f}"
  ], block: ['Block {f}.', 'Block the user {f}.', 'Please block {f}.'] };

  function confirmVerb(spec) {
    const v = spec.scenario;
    if (v === 'all' || v === 'some') return `${GROUP_VERB[spec.action].replace(/^click (\w+) on$/, 'press $1 on')} the last one`;
    if (v === 'reply') return 'send it';
    if (v === 'menu') return { dm: 'send it', copy: 'copy the link', embed: 'embed it', mute: 'mute them', block: 'block them', report: 'report it', hide: 'hide it' }[spec.action];
    return { reply: 'press Reply', retweet: 'retweet it', like: 'like it', share: 'share it' }[spec.action];
  }

  function judgeOf(jr, spec, mode) {
    if (mode === 'confirm') {
      if (spec.startMode === 'scene' || spec.startMode === 'partial') spec.startMode = 'off';
      if (spec.scenario === 'some' && spec.count < 2) spec.count = 2;
      if (spec.scenario === 'one') spec.hoverBar = true; // the post's buttons appear when the pointer rests on it: that is the stop point
      return { mode, message: `Everything is ready. Should I go ahead and ${confirmVerb(spec)}?` };
    }
    spec.startMode = 'off'; // the page is left alone
    if (spec.scenario === 'all' || spec.scenario === 'some') return groupJudge(jr, spec, mode);
    if (mode === 'impossible') {
      const h = absentHandle(jr, spec);
      const item = jr.pick(['mute', 'block']);
      return { mode, what: [h, h.slice(1)], message: `I can't do that: there is no post by ${h} in the feed.`, templates: USER_VERBS[item], vars: { f: h }, terse: `${item} ${h}` };
    }
    const two = sameFirst(jr, spec);
    if (!two) return undefined;
    const item = jr.pick(['mute', 'block']);
    return { mode, cands: two.cands, others: two.others, message: two.message, templates: USER_VERBS[item], vars: { f: two.first }, terse: `${item} ${two.first}` };
  }

  // Two authors sharing a first name (the second one is renamed, with the quotes of its posts): the question and the
  // words that must name both. null when the feed has no two plainly named authors.
  function sameFirst(jr, spec) {
    const handles = [...new Set(spec.posts.map((p) => p.handle))];
    const nameOf = (h) => spec.posts.find((p) => p.handle === h).name;
    const plain = handles.filter((h) => /^\p{L}{3,} \p{L}/u.test(nameOf(h)) && !/\./.test(nameOf(h)));
    if (!plain.length || handles.length < 2) return null;
    const h1 = jr.pick(plain);
    const pool2 = plain.filter((h) => h !== h1);
    if (!pool2.length) return null;
    const h2 = jr.pick(pool2);
    const A = spec.posts.find((p) => p.handle === h1);
    const first = firstOf(A.name);
    const B0 = spec.posts.find((p) => p.handle === h2);
    const newName = `${first} ${lastOf(B0.name)}`;
    for (const p of spec.posts) {
      if (p.handle === h2) p.name = newName;
      if (p.quote && p.quote.handle === h2) p.quote.name = newName;
    }
    // Everyone else on the page (authors and quoted accounts) must not be offered.
    const people = new Map();
    for (const p of spec.posts) {
      people.set(p.handle, p.name);
      if (p.quote) people.set(p.quote.handle, p.quote.name);
    }
    const others = [...people].filter(([h]) => h !== h1 && h !== h2).map(([h, n]) => [n, h]);
    return { first, cands: [[A.name, lastOf(A.name), h1], [newName, lastOf(newName), h2]], others,
      message: `Which ${first} do you mean: ${A.name} (${h1}) or ${newName} (${h2})?` };
  }

  // all / some: the group request itself is ambiguous ("Like every post by Sam", two Sams) or impossible (a handle with
  // no post, a hashtag nobody used); the instruction is the scenario's own template with that selection.
  function groupJudge(jr, spec, mode) {
    const some = spec.scenario === 'some';
    const verb = GROUP_VERB[spec.action];
    const N = spec.count;
    const vars = (sel) => ({ verb, Verb: I.ucFirst(verb), sel, L: Q(LABELS[spec.action]), N, posts: N === 1 ? 'post' : 'posts',
      them: N === 1 ? 'it' : 'them', done: DONE[spec.action] });
    const terse = (sel) => (some ? `${spec.action} ${N} post${N === 1 ? '' : 's'} ${sel}` : `${spec.action} all posts ${sel}`);
    const templates = some ? SOME_T : ALL_T;
    if (mode === 'impossible') {
      if (jr.bool(0.5)) {
        const used = spec.posts.map((p) => p.text.toLowerCase()).join(' ');
        const tag = TAGS.filter((t) => !used.includes(t));
        if (tag.length) {
          const t = jr.pick(tag);
          const sel = `tagged ${t}`;
          return { mode, what: [t, t.slice(1)], message: `I can't do that: no post in the feed is tagged ${t}.`, templates, vars: vars(sel), terse: terse(sel) };
        }
      }
      const h = absentHandle(jr, spec);
      const sel = `by ${h}`;
      return { mode, what: [h, h.slice(1)], message: `I can't do that: there is no post by ${h} in the feed.`, templates, vars: vars(sel), terse: terse(sel) };
    }
    const two = sameFirst(jr, spec);
    if (!two) return undefined;
    const sel = `by ${two.first}`;
    return { mode, cands: two.cands, others: two.others, message: two.message, templates, vars: vars(sel), terse: terse(sel) };
  }


  Object.assign(fam.lib, { instructionOf, judgeOf, confirmVerb, firstOf });
})();
