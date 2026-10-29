/*
 * use-social-feed: act on posts in a social feed. MiniWoB counterparts: social-media, social-media-all,
 * social-media-some. Inputs ['pointer', 'keyboard', 'wheel']: the feed scrolls inside its pane (wheel, or
 * drag its custom scrollbar; the page itself never scrolls); keyboard may drive the "More" menu.
 *
 * A feed of posts (author name, @handle, age, text, optional photo / link card / quoted post, action
 * buttons). Every post has four toggle buttons (reply, retweet, like, share; a click toggles it on / off,
 * like MiniWoB's .active) and a "More" (⋯) menu with one-shot items: dm "Send via Direct Message",
 * copy "Copy link to post", embed "Embed post", mute "Mute @handle", block "Block @handle", report
 * "Report post", hide "Not interested in this post". A few buttons start on (posts already liked).
 * Content: people from env.content.personName / username, post texts from env.content.POST_TEXTS,
 * link-card titles from HEADLINES and company names (all split by spec.csplit).
 *
 * Feed mechanics (sampled per episode, all scenarios unless noted)
 *   infinite   spec.page = { first, more }: only `first` posts of a list are loaded; when the "Loading"
 *              row at the bottom of the feed scrolls into view, `more` posts are appended spec.loadMs
 *              later (task clock; tick()). model.loaded / loadAt
 *   show more  long posts show a truncated text and a "Show more" link (model.expanded); by 'hidden'
 *              names a post by a phrase that only the expanded text shows
 *   tabs       one / menu: spec.lists = { foryou, following } (two timelines, "For you" / "Following");
 *              the named post may sit in the tab that is not open at the start (model.tab)
 *   hover bar  spec.hoverBar: the action row is only drawn while the pointer is over the post
 *              (model.hover mirrors it); the plan hovers ({ move }) before clicking
 *   confirm    block and report ask for confirmation in a dialog (model.confirm) before they apply
 *   collapse   mute / block / hide / report collapse the affected posts into a placeholder row with
 *              "Undo"; the toast of the last persistent pick also has "Undo" ({ undo } removes a pick)
 *   route      spec.route 'thumb' (drag the custom scrollbar) or 'wheel' (mouse wheel over the feed)
 *   opts.route episode knob (undefined = 50/50 above): 'wheel' forces route 'wheel', 'pointer' route 'thumb'
 *              (both set spec.forcedRoute); 'keyboard' is ignored (the plan has no keyboard route; the More
 *              menu's arrow keys are allowed but never needed). The wheel route falls back to the thumb when
 *              the widget does not mirror model.px.
 *
 * scenarios
 *   one    social-media: click one button on one post. The post is named by spec.by: 'user' (handle,
 *          unique in the feed), 'text' (start of its text), 'hidden' (a phrase from the hidden part of a
 *          truncated post), 'link' (title of its link card), 'photo' (the only photo post of that
 *          author), 'quote' (the only post that quotes @handle)
 *   all    social-media-all: click the button on ALL posts of a selection (by @handle, or tagged #tag).
 *          Clicks on other buttons count against you (toggle them back to undo)
 *   some   social-media-some: click the button on exactly N posts of a selection (by @handle or #tag)
 *   menu   pick an item from the "More" menu of a post (mute / block: any post by that user; the other
 *          items: the named post, by as in one); block / report need the confirmation
 *   reply  reply to the named post (by as in one) with a given text (spec.text): the Reply button opens an
 *          inline composer under the post ("Replying to @handle", a text field, a "Send reply" button) instead
 *          of toggling; type the text and send. Wrong sends (another post, other text) are strikes like the
 *          other final choices: with spec.recoverable the "Reply sent" toast has Undo (the reply goes back to
 *          the composer), a second strike ends. Reply keys never start on; Retweet / Like / Share still toggle
 *          (a wrong toggle is a strike). Listed only by widgets that render the composer (reference does).
 *
 * Widget traits (opts.traits; only widgets that declare them)
 *   simpleFeed  one fully loaded timeline: no For you / Following tabs (spec.lists = { home }), spec.page null
 *               (no "Loading" row, every post present from the start), no quoted posts (post.quote null, so
 *               no 'quote' naming) and no Share goals (one / all / some use reply, retweet or like). Draws
 *               continue from the same stream (rejection sampling), so without the trait nothing moves.
 *
 * Final choices, recovery (R4) and the episode end
 *   one / menu / reply: a wrong final choice is a toggle that turns another button on / off, or a committed menu
 *   pick that is not the requested one. Each one adds a strike (model.strikes). spec.recoverable =
 *   opts.recover ?? 50%: when false the first strike ends the episode ('wrong-choice', error 1); when
 *   true the wrong effect stays visible and can be undone (toggle it back, "Undo" on the toast or the
 *   placeholder) and costs a penalty until it is; a second strike ends the episode. Harmless picks (copy,
 *   embed, dm) leave nothing to undo but still count as strikes. all / some: wrong toggles only cost
 *   error; menu items are ignored there. Episodes end on the end control or finish.
 *
 * Start modes: off, scene, partial, wrong, solved.
 *   scene    the reference screen's unsolved state (no scored progress; not in the default training mix): the
 *            named post's tab is open with the post loaded and model.scroll = its feed row, so it is the first
 *            visible post (the widget applies model.scroll when it first builds the feed; a widget that does not
 *            leaves the post wherever it is and the oracle scrolls to it, which closes the menu), its text
 *            expanded when named by hidden text. menu: its More menu is open, nothing picked (for any row,
 *            never the confirm dialog; model.hover is the post on hover-bar feeds); reply: its blank composer
 *            is open; one: just the above; all / some: unchanged (a plain start)
 *   partial  all / some: part of the selection already done; menu: the right More menu (or the confirm
 *            dialog) already open; one: the named post's tab opened / its text expanded (still unsolved);
 *            reply: also half the text typed into its composer when the post is one of the first two
 *   wrong    one / menu / reply: an accidental like (or a wrong mute / hide) already made, strikes = 1 and
 *            spec.recoverable forced true (undo it, then do the task); all / some: wrong posts toggled on
 *
 * spec   { scenario, startMode, isplit, csplit, ood, recoverable (one / menu / reply), text (reply),
 *          posts: [{ name, handle, time, text, short (truncated text | null), media: null |
 *                   { kind: 'photo', hue, n, alt } | { kind: 'link', title, domain, hue },
 *                   quote: null | { name, handle, text }, counts: { reply, retweet, like } }],
 *          lists: { home: [post ids] } | { foryou: [...], following: [...] } (feed order, newest first),
 *          tab0 (list open at the start), page: null | { first, more }, loadMs, hoverBar, route, forcedRoute?,
 *          start: [keys on at the start], action (one / all / some: 'reply' | 'retweet' | 'like' |
 *          'share'; menu: an item key), targets: [post ids that satisfy the request],
 *          one / menu: post (the named post), by, phrase (quoted text for by text / hidden), qhandle
 *          (by quote), all / some: select { kind: 'user', handle } | { kind: 'tag', tag }; some: count }
 *   key = `${post}:${button}` (button in BUTTONS), listed in canonical order (post, then BUTTONS order)
 * model  { t, on: [keys on], menu: null | post whose More menu is open, confirm: null | [post, item],
 *          reply only: draft: null | { post, text } (the open composer), sent: [[post, text], ...],
 *          picks: [[post, item], ...] committed picks still in effect, strikes, tab, loaded: { list: n },
 *          loadAt: null | ms, expanded: [posts], hover: null | post,
 *          scroll (first visible feed row, fractional), view: [post ids fully visible] | null, atEnd
 *          (the loading row is visible), px: { top, h, offs: [row tops] } (pane geometry mirrored by the
 *          widget for the wheel route) }
 *   Graded: on, picks, strikes, menu / confirm (partial credit); the rest mirrors the widget's view.
 * error  (tau 0 everywhere)
 *   one    0.7 * (button not on) + 0.3 * (a wrong effect outstanding); 1 once ended (sigma 0.5)
 *   menu   0.7 * need + 0.3 * outstanding, need = 0 after the right pick, 0.25 while its confirm dialog is
 *          open, 0.5 while a target post's More menu is open, else 1 (sigma 0.5)
 *   reply  0.7 * need + 0.3 * outstanding, need = 0 once the right reply is sent, else 1 - (0.3 for the composer
 *          open on the named post + 0.6 * text similarity of its draft) (sigma 0.5); wrong sends and wrong
 *          toggles are outstanding until undone
 *   all    |on Δ (start ∪ wanted)| / |wanted|: each missing or extra toggle costs 1/|targets| (sigma 0.35)
 *   some   (|N - c| + other changes) / N, c = selection posts with the button on (sigma 0.35)
 *
 * plan targets (the widget's locate() maps them to viewport px)
 *   { action: [post, button] }  a toggle button     { more: post }       the post's "More" (⋯) button
 *   { item: key }                an item of the open More menu        { confirm: 'ok' | 'cancel' }
 *   { undo: 'toast' | post }     "Undo" on the toast / on the post's placeholder row
 *   { showmore: post }           the "Show more" link        { tab: list }   a timeline tab
 *   { post: p }                  the post body (hover target) { feed: true } the feed pane (wheel target)
 *   { field: 'draft' }           the reply composer's text field (reply)  { send: 1 } its "Send reply" button
 *   { thumb: 'feed' }            the feed scrollbar thumb's current center
 *   { scroll: s }                where the thumb's center must be released so that fractional row s is
 *                                at the top of the feed (linear in s; may lie past the track ends)
 * plan steps: { click } for buttons, items, tabs, links; { type: [{ field: 'draft' }, text] } (reply);
 * { undo: 'toast' } also undoes a wrong send; { move: { post } } before clicking a hover-bar
 * button; scrolling an off-screen post into view is { drag: [{ thumb }, { scroll }] } (route thumb) or
 * { wheel: [{ feed: true }, dy] } (route wheel, dy from model.px); { wait } while posts load.
 *
 * levels (opts.level easy | medium; normal is the task as above): one timeline (no tabs), no infinite paging
 * and no hover bar (easy: 4-5 posts, the post named by its unique @handle; medium: 6-8 posts); group scenarios easy 5-6 posts
 * with 2 targets, medium 7-9.
 *
 * judge modes (judgeModes ambiguous, impossible, confirm; spec.judge = { mode, message, cands, others, what, templates, vars }):
 *   ambiguous   "Mute Sam" / "Block Sam": two authors share a first name (Sam Rivera / Sam Okafor; the posts and quotes
 *               are renamed); the reply must ask (status ask) with one option per author (cands: full name, last name,
 *               @handle; others: every other author and quoted account, never offered). all / some: the scenario's own
 *               request with that selection ("Like every post by Sam", "Retweet 3 posts by Sam")
 *   impossible  "Mute @handle" for a handle that has no post in the feed (drawn per seed like the feed's own handles). all / some:
 *               "Like every post by @handle" for a handle with no post, or "... tagged #tag" for a hashtag no post uses;
 *               status impossible, what names the handle or tag (spec.judge.what)
 *   confirm     the normal task plus "but check with me before you <like it | send it | block them | like the last one>";
 *               one gets a hover bar; the
 *               error counts the final press as done (one: the pointer resting on the post; menu: its More menu / confirm dialog
 *               open; reply: the exact draft in the composer; all / some: one toggle missing); some asks for >= 2
 *   model.touched: set by act() (ambiguous / impossible: any toggle, committed pick or sent reply, error 1 and ended());
 *   confirm: the right completion or a strike (the widget flags 'irreversible' when it turns true).
 *
 * round 2 hooks (pure; none changes sample(), so episodes with the new knobs off are unchanged)
 *   facts(model, spec)   2-3 { label, value, aliases?, labels? } (aliases: other spellings of the value, e.g. the handle for the author's
 *                        name; labels: other names of the fact, e.g. 'likes', 'reply count') the feed shows once the work is done: one / reply: the button's count (base
 *                        count + 1 while on, + replies sent; 'Like count' ...), 'Replies on the post', 'Post author' (display
 *                        name, alias the handle), 'Liked posts' / 'Retweeted posts' ... (buttons on across the feed); all / some:
 *                        that total, 'Posts by @h' / 'Posts tagged #t' (the selection) and how many have the button on; menu:
 *                        'Confirmation message' (the toast text, taskDef.helpers.toastText / replyToast, which the base widget
 *                        also draws), 'Posts collapsed' (mute / block / hide / report) or 'Post author'. [] in judge episodes.
 *   silent(next, prev, spec, rng)  after a step that lowered the error: one: the like / retweet / reply toggle that did not stick;
 *                        all / some: a toggle that did not stick, or landed on the post next to it; menu: the pick (mute,
 *                        block, copy ...) that did not register; reply: the sent text cut off at about 55% (the toast shows it).
 *                        Never changes strikes. null when none applies (no judge episodes); repeating the step fixes it.
 *   retarget(spec, model, rng)  another post (named by one of the ways it can be, recomputed: by, phrase, qhandle, targets; a
 *                        mute / block of another account; a new reply text) or, for all / some, another @handle / #tag selection
 *                        (targets and count recomputed) with the same action and feed. null in judge episodes.
 *
 * Helpers (widget API, env.taskDef.helpers):
 *   BUTTONS: toggle button keys, in canonical order.
 *   LABELS: display labels for the toggle buttons.
 *   PERSISTENT: menu items whose effects can be undone.
 *   menuLabel(item, handle): the menu item's display label.
 *   keyOf(post, button): canonical toggle key.
 *   formatCount(n): compact count label.
 *   act(model, spec, event): apply a widget event (events below).
 *   feedOf(spec, model): loaded post ids in the current timeline.
 *   collapsedBy(spec, model, post): collapsing pick index, or -1.
 *   moreToLoad(spec, model): whether the current timeline has unloaded posts.
 *   toastText(item, handle): confirmation text of a menu pick.
 *   replyToast(handle, text): confirmation text of a sent reply.
 * Tests live in tasks/use-social-feed/selftest.js (checker and node tests only).
 * act events: { toggle: key } { more: post | null } { item: [post, key] } { confirm: true } { cancel: true }
 *             { undo: pickIndex } { tab } { expand: post } { hover: post | null }
 *             { view: { scroll, view, atEnd, px } }
 *             reply: { draft: text } { send: true } { unsend: true }; { toggle: 'p:reply' } opens / closes the composer
 *
 * Deviations from MiniWoB: realistic people and texts, a scrolling pane, feeds that load more, tabs,
 * truncated posts, confirmation dialogs, recoverable mistakes; the goal never names the end control.
 */
(function () {
  'use strict';

  const I = env.instruct;

  // ---------------------------------------------------------------- content

  const BUTTONS = ['reply', 'retweet', 'like', 'share'];
  const LABELS = { reply: 'Reply', retweet: 'Retweet', like: 'Like', share: 'Share' };
  const USER_ITEMS = ['mute', 'block'];
  const CONFIRM_ITEMS = ['block', 'report'];
  const PERSISTENT = ['mute', 'block', 'report', 'hide'];
  const menuLabel = (item, handle) => ({
    dm: 'Send via Direct Message', copy: 'Copy link to post', embed: 'Embed post', mute: `Mute ${handle}`,
    block: `Block ${handle}`, report: 'Report post', hide: 'Not interested in this post',
  })[item];

  // The toast the base widget shows for a committed pick (facts quotes it; the widget reads it from here).
  const toastText = (item, handle) => ({
    dm: 'Sent via Direct Message', copy: 'Copied to clipboard', embed: 'Embed code copied',
    mute: `You muted ${handle}`, block: `You blocked ${handle}`, report: 'Thanks for reporting this post',
    hide: 'Got it. You will see fewer posts like this',
  })[item];
  const replyToast = (handle, text) => `Your reply to ${handle} was sent: “${String(text).trim()}”`;

  const keyOf = (p, b) => `${p}:${b}`;
  const parseKey = (k) => {
    const [p, b] = k.split(':');
    return [Number(p), b];
  };
  const canon = (keys) => [...new Set(keys)].sort((a, b) => {
    const [pa, ba] = parseKey(a);
    const [pb, bb] = parseKey(b);
    return pa - pb || BUTTONS.indexOf(ba) - BUTTONS.indexOf(bb);
  });
  const formatCount = (n) => (n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1).replace(/\.0$/, '')}K` : String(n));
  const { clone } = env.util;
  // Reply text comparison: trimmed, collapsed whitespace; normalized edit distance for partial credit.
  const norm = (t) => String(t || '').replace(/\s+/g, ' ').trim();
  function ned(a, b) {
    if (a === b) return 0;
    if (!a.length || !b.length) return 1;
    let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
    for (let i = 1; i <= a.length; i++) {
      const cur = [i];
      for (let j = 1; j <= b.length; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = cur;
    }
    return prev[b.length] / Math.max(a.length, b.length);
  }

  // ---------------------------------------------------------------- feed state

  const listOf = (spec, m) => spec.lists[m.tab];
  const loadedOf = (spec, m) => {
    const l = listOf(spec, m);
    return m.loaded && m.loaded[m.tab] !== undefined ? Math.min(l.length, m.loaded[m.tab]) : l.length;
  };
  const feedOf = (spec, m) => listOf(spec, m).slice(0, loadedOf(spec, m));
  const moreToLoad = (spec, m) => loadedOf(spec, m) < listOf(spec, m).length;

  // Index of the active pick that collapses post p (mute / block of its author, hide / report of it), or -1.
  function collapsedBy(spec, m, p) {
    for (let i = m.picks.length - 1; i >= 0; i--) {
      const [q, item] = m.picks[i];
      if ((item === 'mute' || item === 'block') && spec.posts[q].handle === spec.posts[p].handle) return i;
      if ((item === 'hide' || item === 'report') && q === p) return i;
    }
    return -1;
  }

  // ---------------------------------------------------------------- grading

  function diff(a, b) {
    const A = new Set(a);
    const B = new Set(b);
    return [...a.filter((x) => !B.has(x)), ...b.filter((x) => !A.has(x))];
  }

  const single = (spec) => spec.scenario === 'one' || spec.scenario === 'menu' || spec.scenario === 'reply';
  const goodPick = (spec, [p, item]) => spec.scenario === 'menu' && item === spec.action && spec.targets.includes(p);
  const goodKey = (spec) => (spec.scenario === 'one' ? keyOf(spec.post, spec.action) : null);
  const wrongToggles = (m, spec) => diff(m.on, spec.start).filter((k) => k !== goodKey(spec));
  const wrongPicks = (m, spec) => m.picks.map((pk, i) => [pk, i]).filter(([pk]) => !goodPick(spec, pk) && PERSISTENT.includes(pk[1]));
  // reply: sent replies (model.sent = [[post, text]]); only the requested text to the named post is right.
  const goodSend = (spec, [p, text]) => spec.scenario === 'reply' && p === spec.post && norm(text) === norm(spec.text);
  const wrongSends = (m, spec) => (m.sent || []).filter((sd) => !goodSend(spec, sd));
  const outstanding = (m, spec) => wrongToggles(m, spec).length + wrongPicks(m, spec).length + wrongSends(m, spec).length;
  const terminal = (m, spec) => single(spec) && m.strikes >= (spec.recoverable ? 2 : 1);

  function someParts(model, spec) {
    const sel = new Set(spec.targets.map((p) => keyOf(p, spec.action)));
    const c = model.on.filter((k) => sel.has(k)).length;
    const other = diff(model.on, spec.start).filter((k) => !sel.has(k));
    return { sel, c, other };
  }

  const prepared = (spec) => !!spec.judge && spec.judge.mode === 'confirm'; // the final press counts as done

  function needOf(model, spec, prep = prepared(spec)) {
    if (prep) {
      // The final press (the toggle, the send, the pick / its confirm dialog) is not part of the task here.
      if (spec.scenario === 'reply') {
        const d = model.draft;
        if (d && d.post === spec.post && norm(d.text) === norm(spec.text)) return 0;
      } else if (spec.scenario === 'one') {
        if (model.hover === spec.post && tabOf(spec, spec.post) === model.tab) return 0; // the pointer rests on the post
      } else if (CONFIRM_ITEMS.includes(spec.action) ? model.confirm && goodPick(spec, model.confirm) : model.menu !== null && spec.targets.includes(model.menu)) return 0;
    }
    if (spec.scenario === 'reply') {
      if ((model.sent || []).some((sd) => goodSend(spec, sd))) return 0;
      const d = model.draft;
      if (!d || d.post !== spec.post) return 1;
      return 1 - (0.3 + 0.6 * (1 - ned(norm(d.text), norm(spec.text))));
    }
    if (spec.scenario === 'one') return model.on.includes(goodKey(spec)) ? 0 : 1;
    if (model.picks.some((pk) => goodPick(spec, pk))) return 0;
    if (model.confirm && goodPick(spec, model.confirm)) return 0.25;
    return model.menu !== null && spec.targets.includes(model.menu) ? 0.5 : 1;
  }

  function errorOf(model, spec) {
    if (spec.judge && spec.judge.mode !== 'confirm') return model.touched ? 1 : 0; // the page stays as it is
    if (prepared(spec) && (spec.scenario === 'all' || spec.scenario === 'some')) return groupPrepared(model, spec);
    return baseError(model, spec);
  }

  // all / some, confirm: one missing toggle (the last one) is the final press.
  function groupPrepared(model, spec) {
    if (spec.scenario === 'all') {
      const sel = new Set(spec.targets.map((p) => keyOf(p, spec.action)));
      const missing = [...sel].filter((k) => !model.on.includes(k) && !spec.start.includes(k)).length;
      const extra = diff(model.on, spec.start).filter((k) => !sel.has(k)).length;
      return (Math.max(0, missing - 1) + extra) / spec.targets.length;
    }
    const { c, other } = someParts(model, spec);
    return (Math.max(0, Math.abs(spec.count - c) - 1) + other.length) / spec.count;
  }

  function baseError(model, spec, prep = prepared(spec)) {
    switch (spec.scenario) {
      case 'one':
      case 'menu':
      case 'reply':
        if (terminal(model, spec)) return 1;
        return Math.round((0.7 * needOf(model, spec, prep) + 0.3 * Math.min(1, outstanding(model, spec))) * 1000) / 1000;
      case 'all': {
        const goal = canon(spec.start.concat(spec.targets.map((p) => keyOf(p, spec.action))));
        return diff(model.on, goal).length / spec.targets.length;
      }
      case 'some': {
        const { c, other } = someParts(model, spec);
        return (Math.abs(spec.count - c) + other.length) / spec.count;
      }
      default:
        return 1;
    }
  }

  // ---------------------------------------------------------------- transitions (widget events)

  // Judge episodes: model.touched turns true on the first irreversible change (see the header).
  function act(model, spec, ev) {
    const m = actRaw(model, spec, ev);
    if (!spec.judge || m.touched) return m;
    if (spec.judge.mode !== 'confirm') {
      if (JSON.stringify([m.on, m.picks, m.sent]) !== JSON.stringify([model.on, model.picks, model.sent])) m.touched = true;
    } else if (m.strikes > model.strikes || (baseError(m, spec, false) < 1e-9 && baseError(model, spec, false) >= 1e-9)) m.touched = true;
    return m;
  }

  function actRaw(model, spec, ev) {
    const m = clone(model);
    const strike = () => { if (single(spec)) m.strikes += 1; };
    const commit = (p, item) => {
      m.picks.push([p, item]);
      if (single(spec) && !goodPick(spec, [p, item])) strike();
    };
    if (ev.toggle && spec.scenario === 'reply' && parseKey(ev.toggle)[1] === 'reply') {
      // reply scenario: the Reply button opens (or closes) the inline composer instead of toggling.
      const q = parseKey(ev.toggle)[0];
      m.draft = m.draft && m.draft.post === q ? null : { post: q, text: '' };
      m.menu = null;
    } else if ('draft' in ev) {
      if (m.draft) m.draft = { post: m.draft.post, text: ev.draft };
    } else if (ev.send) {
      const d = m.draft;
      if (d && norm(d.text)) {
        m.sent = (m.sent || []).concat([[d.post, d.text]]);
        m.draft = null;
        if (!goodSend(spec, [d.post, d.text])) strike();
      }
    } else if (ev.unsend) {
      // Undo on the "reply sent" toast: the last reply goes back to the composer.
      const sd = (m.sent || []).slice();
      const last = sd.pop();
      if (last) {
        m.sent = sd;
        m.draft = { post: last[0], text: last[1] };
      }
    } else if (ev.toggle) {
      const k = ev.toggle;
      const was = m.on.includes(k);
      m.on = was ? m.on.filter((x) => x !== k) : canon(m.on.concat([k]));
      const nowWrong = diff(m.on, spec.start).includes(k) && k !== goodKey(spec);
      if (nowWrong) strike();
      m.menu = null;
    } else if ('more' in ev) {
      m.menu = ev.more === null || m.menu === ev.more ? null : ev.more;
      m.confirm = null;
    } else if (ev.item) {
      const [p, item] = ev.item;
      m.menu = null;
      if (CONFIRM_ITEMS.includes(item)) m.confirm = [p, item];
      else commit(p, item);
    } else if (ev.confirm) {
      if (m.confirm) commit(m.confirm[0], m.confirm[1]);
      m.confirm = null;
    } else if (ev.cancel) {
      m.confirm = null;
    } else if ('undo' in ev) {
      if (ev.undo >= 0 && ev.undo < m.picks.length) m.picks.splice(ev.undo, 1);
    } else if (ev.tab) {
      if (ev.tab !== m.tab && spec.lists[ev.tab]) {
        m.tab = ev.tab;
        m.scroll = 0;
        m.view = null;
        m.atEnd = false;
        m.loadAt = null;
        m.menu = null;
        m.px = null;
      }
    } else if ('expand' in ev) {
      if (!m.expanded.includes(ev.expand)) m.expanded = m.expanded.concat([ev.expand]).sort((a, b) => a - b);
    } else if ('hover' in ev) {
      m.hover = ev.hover;
    } else if (ev.view) {
      Object.assign(m, ev.view);
      if (ev.view.scroll !== undefined && m.menu !== null && ev.closeMenu) m.menu = null;
    }
    if (m.atEnd && m.loadAt === null && moreToLoad(spec, m)) m.loadAt = m.t;
    return m;
  }

  function tickOf(model, spec, dt) {
    const t = model.t + dt;
    if (model.loadAt !== null && t >= model.loadAt + spec.loadMs - 1e-9 && spec.page) {
      const loaded = { ...model.loaded };
      loaded[model.tab] = Math.min(listOf(spec, model).length, loadedOf(spec, model) + spec.page.more);
      return { ...model, t, loaded, loadAt: null, atEnd: false };
    }
    return { ...model, t };
  }

  // ---------------------------------------------------------------- plan

  const inView = (model, p) => !!model.view && model.view.includes(p);
  const tabOf = (spec, p) => Object.keys(spec.lists).find((k) => spec.lists[k].includes(p));

  // Scroll so that feed row `pos` lands a quarter row below the top (or as far as the feed goes).
  function scrollTo(model, spec, pos) {
    const s = pos >= feedOf(spec, model).length ? pos + 3 : Math.max(0, pos - 0.25);
    if (spec.route === 'wheel' && model.px && model.px.offs && model.px.offs.length) {
      const offs = model.px.offs;
      const at = pos >= offs.length ? offs[offs.length - 1] + 400 : offs[pos];
      let dy = Math.round(at - 24 - model.px.top);
      if (Math.abs(dy) < 40) dy = dy < 0 ? -40 : 40;
      return { wheel: [{ feed: true }, dy] };
    }
    return { drag: [{ thumb: 'feed' }, { scroll: s }] };
  }

  // Click the first visible post among `posts`; otherwise scroll the nearest one into view.
  function reach(model, spec, posts, click) {
    const seen = posts.find((p) => inView(model, p));
    if (seen !== undefined) return click(seen);
    const feed = feedOf(spec, model);
    const pos = posts.map((p) => feed.indexOf(p)).filter((i) => i >= 0);
    if (!pos.length) return null;
    const cur = model.scroll || 0;
    const best = pos.sort((a, b) => Math.abs(a - cur) - Math.abs(b - cur) || a - b)[0];
    return scrollTo(model, spec, best);
  }

  // Bring posts into the loaded feed: switch tab, or load more.
  function bring(model, spec, posts) {
    const here = feedOf(spec, model);
    if (posts.some((p) => here.includes(p))) return null;
    const inTab = posts.filter((p) => listOf(spec, model).includes(p));
    if (!inTab.length) {
      const k = tabOf(spec, posts[0]);
      return { click: { tab: k } };
    }
    if (model.loadAt !== null) return { wait: true };
    if (model.atEnd) return { wait: true };
    return scrollTo(model, spec, here.length);
  }

  // Click a toggle button, hovering first on hover-bar feeds.
  function press(model, spec, p, key) {
    if (spec.hoverBar && model.hover !== p) return { move: { post: p } };
    return { click: { action: parseKey(key) } };
  }

  // Toggle keys whose click makes progress (any one of them).
  function todo(model, spec) {
    const v = spec.scenario;
    if (v === 'one') return model.on.includes(goodKey(spec)) ? [] : [goodKey(spec)];
    if (v === 'all') {
      const goal = canon(spec.start.concat(spec.targets.map((p) => keyOf(p, spec.action))));
      return canon(diff(model.on, goal));
    }
    const { sel, c, other } = someParts(model, spec);
    let pick = [];
    if (c < spec.count) pick = [...sel].filter((k) => !model.on.includes(k));
    else if (c > spec.count) pick = [...sel].filter((k) => model.on.includes(k));
    return canon(other.concat(pick));
  }

  function planToggles(model, spec, keys) {
    const byPost = new Map();
    for (const k of keys) {
      const [p] = parseKey(k);
      if (!byPost.has(p)) byPost.set(p, k);
    }
    const posts = [...byPost.keys()];
    const b = bring(model, spec, posts);
    if (b) return b;
    const feed = feedOf(spec, model);
    const loaded = posts.filter((p) => feed.includes(p));
    return reach(model, spec, loaded, (p) => press(model, spec, p, byPost.get(p)));
  }

  function planOf(model, spec) {
    if (errorOf(model, spec) <= 0 || terminal(model, spec)) return null;
    // A pending confirmation: confirm the right pick, cancel anything else.
    if (model.confirm) return { click: { confirm: goodPick(spec, model.confirm) ? 'ok' : 'cancel' } };
    // Undo persistent picks that are wrong (or, in all / some, any that collapse posts).
    const undoable = single(spec) ? wrongPicks(model, spec).map(([, i]) => i)
      : model.picks.map((pk, i) => [pk, i]).filter(([pk]) => PERSISTENT.includes(pk[1])).map(([, i]) => i);
    if (undoable.length) {
      const i = undoable[undoable.length - 1];
      if (model.menu !== null) return { click: { more: model.menu } };
      if (i === model.picks.length - 1) return { click: { undo: 'toast' } };
      const feed = feedOf(spec, model);
      const rows = feed.filter((p) => collapsedBy(spec, model, p) === i);
      return reach(model, spec, rows, (p) => ({ click: { undo: p } }));
    }
    // Undo wrong toggles (one / menu).
    if (single(spec)) {
      const wrong = wrongToggles(model, spec);
      if (wrong.length) {
        if (model.menu !== null) return { click: { more: model.menu } };
        return planToggles(model, spec, wrong);
      }
    }
    if (spec.scenario === 'reply') {
      if (wrongSends(model, spec).length) return { click: { undo: 'toast' } };
      const d = model.draft;
      if (d && d.post === spec.post && norm(d.text) !== norm(spec.text)) return { type: [{ field: 'draft' }, spec.text] };
      if (d && d.post === spec.post) return { click: { send: 1 } };
      if (model.menu !== null) return { click: { more: model.menu } };
      const b = bring(model, spec, [spec.post]);
      if (b) return b;
      if (spec.by === 'hidden' && !model.expanded.includes(spec.post)) return reach(model, spec, [spec.post], (p) => ({ click: { showmore: p } }));
      return reach(model, spec, [spec.post], (p) => press(model, spec, p, keyOf(p, 'reply')));
    }
    // An open menu whose post has scrolled out of the pane is closed by scrolling it into view first.
    const menuUp = model.menu !== null && (!model.view || inView(model, model.menu));
    if (spec.scenario === 'menu') {
      if (menuUp && spec.targets.includes(model.menu)) return { click: { item: spec.action } };
      if (menuUp) return { click: { more: model.menu } };
      const b = bring(model, spec, spec.targets);
      if (b) return b;
      const feed = feedOf(spec, model);
      const cand = spec.targets.filter((p) => feed.includes(p));
      if (spec.by === 'hidden' && !model.expanded.includes(spec.post)) return reach(model, spec, [spec.post], (p) => ({ click: { showmore: p } }));
      return reach(model, spec, cand, (p) => ({ click: { more: p } }));
    }
    // An open menu could cover the button we want: close it first.
    if (model.menu !== null) return { click: { more: model.menu } };
    if (spec.scenario === 'one' && spec.by === 'hidden' && !model.expanded.includes(spec.post)) {
      const b = bring(model, spec, [spec.post]);
      if (b) return b;
      return reach(model, spec, [spec.post], (p) => ({ click: { showmore: p } }));
    }
    const keys = todo(model, spec);
    if (!keys.length) return null;
    return planToggles(model, spec, keys);
  }

  // Start mode 'scene' (the reference screen's unsolved mid-task state, no scored progress, no randomness):
  // the named post's tab is open with the post loaded, scrolled to the top of the feed pane (the widget applies
  // model.scroll when it first builds the feed) and its text expanded when it is named by hidden text.
  // menu: its More menu is open, nothing chosen (not the confirm dialog); reply: its blank reply composer
  // is open; one: nothing more; all / some: the plain start.
  function initScene(m, spec) {
    if (spec.scenario === 'all' || spec.scenario === 'some') return m;
    const p = spec.post;
    m.tab = tabOf(spec, p);
    const at = spec.lists[m.tab].indexOf(p);
    m.loaded[m.tab] = Math.max(m.loaded[m.tab], at + 1);
    m.scroll = at;
    if (spec.by === 'hidden') m.expanded = [p];
    if (spec.scenario === 'menu') {
      m.menu = p;
      if (spec.hoverBar) m.hover = p;
    } else if (spec.scenario === 'reply') m.draft = { post: p, text: '' };
    return m;
  }

  function initModel(spec) {
    const loaded = {};
    for (const k of Object.keys(spec.lists)) loaded[k] = spec.page ? Math.min(spec.lists[k].length, spec.page.first) : spec.lists[k].length;
    const m = { t: 0, on: spec.start.slice(), menu: null, confirm: null, picks: [], strikes: 0, tab: spec.tab0, loaded,
      loadAt: null, expanded: [], hover: null, scroll: 0, view: null, atEnd: false, px: null };
    if (spec.scenario === 'reply') Object.assign(m, { draft: null, sent: [] });
    const mode = spec.startMode;
    if (mode === 'scene') return initScene(m, spec);
    if (mode === 'partial') {
      if (spec.scenario === 'all' || spec.scenario === 'some') {
        const want = spec.scenario === 'all' ? spec.targets.length : spec.count;
        const k = Math.max(1, Math.floor(want / 2));
        const done = spec.targets.slice(0, k).filter((p) => !spec.start.includes(keyOf(p, spec.action)));
        if (spec.scenario === 'some' && k >= spec.count) return m;
        m.on = canon(m.on.concat(done.slice(0, want - 1).map((p) => keyOf(p, spec.action))));
      } else if (spec.scenario === 'menu') {
        const tab = tabOf(spec, spec.post);
        m.tab = tab;
        if (loadedOf(spec, m) > spec.lists[tab].indexOf(spec.post) && spec.lists[tab].indexOf(spec.post) < 2) {
          if (CONFIRM_ITEMS.includes(spec.action)) m.confirm = [spec.post, spec.action];
          else m.menu = spec.post;
        }
      } else {
        m.tab = tabOf(spec, spec.post);
        if (spec.by === 'hidden') m.expanded = [spec.post];
        const at = spec.lists[m.tab].indexOf(spec.post);
        if (spec.scenario === 'reply' && loadedOf(spec, m) > at && at < 2) m.draft = { post: spec.post, text: spec.text.slice(0, Math.max(1, Math.floor(spec.text.length / 2))) };
      }
    } else if (mode === 'wrong') {
      if (single(spec)) {
        // An accidental like on a visible post of the opening tab (or a wrong mute / hide).
        const feed = feedOf(spec, m);
        const cands = feed.slice(0, 3).filter((p) => p !== spec.post && !spec.targets.includes(p));
        const p = cands.length ? cands[0] : feed.find((q) => q !== spec.post);
        const key = keyOf(p, spec.action && BUTTONS.includes(spec.action) && spec.scenario !== 'reply' ? spec.action : 'like');
        if (spec.scenario === 'menu' && spec.action !== 'hide' && feed.some((q) => !spec.targets.includes(q) && spec.posts[q].handle !== spec.posts[spec.post].handle)) {
          const q = feed.find((x) => !spec.targets.includes(x) && spec.posts[x].handle !== spec.posts[spec.post].handle);
          m.picks = [[q, spec.action === 'mute' ? 'mute' : 'hide']];
        } else if (!m.on.includes(key)) m.on = canon(m.on.concat([key]));
        else m.on = m.on.filter((x) => x !== key);
        m.strikes = 1;
      } else {
        const others = spec.posts.map((_, i) => i).filter((i) => !spec.targets.includes(i) && !spec.start.includes(keyOf(i, spec.action)));
        const wrong = others.slice(0, 2).map((i) => keyOf(i, spec.action));
        m.on = canon(m.on.concat(wrong));
      }
    }
    return m;
  }

  function solveOf(spec, model) {
    const m = clone(model);
    m.menu = null;
    m.confirm = null;
    switch (spec.scenario) {
      case 'one': m.on = canon(spec.start.concat([keyOf(spec.post, spec.action)])); m.picks = []; break;
      case 'menu': m.on = spec.start.slice(); m.picks = [[spec.post, spec.action]]; break;
      case 'reply': m.on = spec.start.slice(); m.draft = null; m.sent = [[spec.post, spec.text]]; break;
      case 'all': m.on = canon(spec.start.concat(spec.targets.map((p) => keyOf(p, spec.action)))); break;
      default: m.on = canon(spec.start.filter((k) => !spec.targets.map((p) => keyOf(p, spec.action)).includes(k))
        .concat(spec.targets.slice(0, spec.count).map((p) => keyOf(p, spec.action))));
    }
    m.strikes = 0;
    return m;
  }

  // Shared internals for the task modules and its test; widgets use helpers below.
  const lib = { USER_ITEMS, canon, parseKey, listOf, goodSend, goodKey, goodPick, errorOf, terminal,
    initModel, single, planOf, tickOf, solveOf, inView, tabOf };

  // ---------------------------------------------------------------- task

  env.task({
    name: 'use-social-feed',
    reply: true, // judge and report endings are structured replies under the default reply=auto (kit/runtime/reply.js)
    scenarios: ['one', 'all', 'some', 'menu', 'reply'],
    startModes: ['off', 'partial', 'wrong', 'solved', 'scene'],
    inputs: ['pointer', 'keyboard', 'wheel'],
    judgeModes: ['ambiguous', 'impossible', 'confirm'],

    files: ['sampling.js', 'instructions.js', 'reporting.js'],
    lib,
    helpers: { BUTTONS, LABELS, PERSISTENT, menuLabel, keyOf, formatCount,
      act, feedOf, collapsedBy, moreToLoad, toastText, replyToast },

    sample(rng, opts) {
      const list = opts.scenarios && opts.scenarios.length ? opts.scenarios : this.scenarios;
      const scenario = opts.scenario || rng.pick(list);
      const o = { csplit: opts.csplit || 'train', ood: !!opts.ood, beat: Number(opts.stepMs) > 0 ? Number(opts.stepMs) : 1000 };
      o.simple = !!(opts.traits && opts.traits.simpleFeed);
      o.level = opts.level === 'easy' || opts.level === 'medium' ? opts.level : null;
      const judgeMode = this.judgeModes.includes(opts.judge) ? opts.judge : null;
      const one3 = scenario === 'one' || scenario === 'menu' || scenario === 'reply';
      const body = one3 ? lib.sampleOne(rng, o, scenario) : lib.sampleGroup(rng, scenario, o);
      const spec = { scenario, startMode: opts.startMode || 'off', isplit: opts.isplit || 'train', csplit: o.csplit, ood: o.ood, ...body };
      if (single(spec)) {
        spec.recoverable = opts.recover === null || opts.recover === undefined ? rng.bool(0.5) : !!opts.recover;
        if (spec.startMode === 'wrong') spec.recoverable = true;
      }
      // opts.route (episode knob) overrides the drawn feed route; undefined changes nothing. No keyboard route.
      if (opts.route === 'wheel' || opts.route === 'pointer') {
        spec.route = opts.route === 'wheel' ? 'wheel' : 'thumb';
        spec.forcedRoute = opts.route;
      }
      if (judgeMode) {
        const j = lib.judgeOf(rng.fork('judge'), spec, judgeMode);
        if (j) spec.judge = j;
      }
      return spec;
    },

    init: initModel,
    error: errorOf,

    tolerance(spec) {
      return { tau: 0, sigma: single(spec) ? 0.5 : 0.35, minInitialError: 0.25 };
    },

    instruction(spec, rng) {
      const j = spec.judge;
      if (j && j.mode !== 'confirm') return I.say(rng, I.phrase(rng, j.templates, j.vars, spec.isplit), { isplit: spec.isplit, terse: j.terse });
      const text = lib.instructionOf(spec, rng);
      return j ? `${text.replace(/[.!?\s]+$/, '')}, but check with me before you ${lib.confirmVerb(spec)}.` : text;
    },
    plan: planOf,
    solve: solveOf,
    facts: (model, spec) => lib.factsOf(model, spec),
    silent: (next, prev, spec, rng) => lib.silentOf(next, prev, spec, rng),
    retarget: (spec, model, rng) => lib.retargetOf(spec, model, rng),
    tick: (model, spec, dt) => tickOf(model, spec, dt),
    tickMs: 50,
    ended(model, spec) {
      if (spec.judge && spec.judge.mode !== 'confirm' && model.touched) return 'wrong-choice';
      return terminal(model, spec) ? 'wrong-choice' : null;
    },
  });
})();
