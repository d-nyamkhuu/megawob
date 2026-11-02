/*
 * base / use-social-feed / feed: a three-column social app (icon rail with navigation, the timeline, a
 * "Trends" / "Who to follow" sidebar on wide stages). The column's width and alignment are sampled per
 * episode. The timeline is a fixed-height pane whose native scrollbar is hidden; a custom track + thumb
 * beside it scrolls it (drag the thumb, click the track to page, or use the wheel inside the pane). The
 * page itself never scrolls.
 * Each post: avatar, name, @handle · age, a "More" (⋯) button, text (hashtags and mentions highlighted;
 * long texts truncated with "Show more"), an optional photo grid / link card / quoted post, and four
 * toggle buttons (reply, retweet, like, share) showing counts or, on some seeds, text labels. On
 * hover-bar episodes the action row only shows while the pointer is over the post.
 * Timelines: one "Home" list, or "For you" / "Following" tabs (spec.lists). Infinite feeds end with a
 * "Loading more posts" row; the task's tick() appends posts after the row has been seen.
 * The More menu is an overlay outside the scrolling pane, right-aligned under its button and flipped
 * above it when there is no room below; scrolling the pane closes it. Block / report open a confirm
 * dialog. Muted / blocked / hidden / reported posts collapse into a placeholder row with "Undo"; the
 * last pick shows a toast at the bottom of the timeline (with "Undo" for persistent picks).
 * All model changes go through env.familyDef.helpers.act(); the feed DOM is rebuilt when its structure (tab,
 * loaded rows, expanded or collapsed posts) changes, keeping the scroll offset. Mechanics: env.ui.listbox
 * (+ scrollbar) for the timeline (kit/ui/form.js), one env.ui.menu() per post (kit/ui/click.js). The page
 * frame is the anchor.
 */
(function () {
  'use strict';

  const CSS = `
  .as-page { position: absolute; inset: 12px 16px; display: flex; overflow: hidden; font-size: var(--as-fs); }
  .as-rail { flex: none; display: flex; flex-direction: column; gap: 2px; padding: 6px 12px 0 0; }
  .as-logo { width: 42px; height: 42px; margin: 0 0 8px 4px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
    background: var(--accent); color: #fff; }
  .as-logo svg { width: 22px; height: 22px; }
  .as-nav { display: flex; align-items: center; gap: 16px; height: 46px; padding: 0 14px; border-radius: 23px; font-size: 18px; color: var(--fg); white-space: nowrap; }
  .as-nav svg { flex: none; width: 24px; height: 24px; }
  .as-nav.on { font-weight: 700; }
  .as-nav .badge { position: absolute; margin: -16px 0 0 14px; min-width: 17px; height: 17px; padding: 0 4px; border-radius: 9px; background: var(--accent); color: #fff;
    font-size: 11px; font-weight: 700; font-style: normal; display: flex; align-items: center; justify-content: center; }
  .as-nav i { position: relative; display: flex; }
  .as-postbtn { margin-top: 12px; height: 46px; border-radius: 23px; background: var(--accent); color: #fff; font-weight: 700; font-size: 16px;
    display: flex; align-items: center; justify-content: center; }
  .as-rail.slim .as-nav span, .as-rail.slim .as-postbtn span { display: none; }
  .as-rail.slim .as-postbtn { width: 46px; }
  .as-rail.slim .as-postbtn::after { content: '+'; font-size: 24px; font-weight: 400; }

  .as-col { position: relative; flex: none; display: flex; flex-direction: column; min-height: 0; background: var(--panel);
    border-left: 1px solid var(--line); border-right: 1px solid var(--line); }
  .as-head { flex: none; display: flex; align-items: flex-end; height: 52px; padding: 0 0 0 16px; border-bottom: 1px solid var(--line); }
  .as-head b { align-self: center; font-size: 19px; margin-right: auto; }
  .as-head.split { padding: 0; }
  .as-head.split b { display: none; }
  .as-head.split .as-tab { flex: 1; justify-content: center; }
  .as-tab { height: 100%; display: flex; align-items: center; padding: 0 18px; color: var(--muted); font-weight: 600; position: relative; cursor: default; }
  .as-tab.live { cursor: pointer; }
  .as-tab.live:hover { background: color-mix(in srgb, var(--fg) 4%, var(--panel)); }
  .as-tab.on { color: var(--fg); }
  .as-tab.on::after { content: ''; position: absolute; left: 18px; right: 18px; bottom: 0; height: 4px; border-radius: 2px; background: var(--accent); }
  .as-head.split .as-tab.on::after { left: calc(50% - 30px); right: calc(50% - 30px); }
  .as-box { flex: 1; min-height: 0; display: flex; }
  .as-feed { flex: 1; min-width: 0; overflow-y: auto; overflow-x: hidden; overscroll-behavior: contain; scrollbar-width: none; }
  .as-feed::-webkit-scrollbar { display: none; }
  .as-track { position: relative; flex: none; width: 12px; margin: 3px 3px 3px 0; border-radius: 6px; cursor: pointer; touch-action: none;
    background: color-mix(in srgb, var(--fg) 6%, var(--panel)); }
  .as-thumb { position: absolute; left: 2px; right: 2px; border-radius: 4px; cursor: grab; touch-action: none;
    background: color-mix(in srgb, var(--fg) 30%, var(--panel)); }
  .as-thumb:hover, .as-thumb.drag { background: color-mix(in srgb, var(--fg) 48%, var(--panel)); }
  .as-end { padding: 22px 0 26px; text-align: center; color: var(--muted); font-size: 13.5px; }
  .as-loading { display: flex; align-items: center; justify-content: center; gap: 10px; padding: 20px 0 30px; color: var(--muted); font-size: 13.5px; }
  .as-loading svg { width: 20px; height: 20px; }
  .as-loading .arc { stroke: var(--accent); }
  .as-loading .ring { stroke: color-mix(in srgb, var(--fg) 12%, transparent); }

  .as-post { display: flex; gap: 12px; padding: var(--as-pad) 14px calc(var(--as-pad) - 4px) 16px; border-bottom: 1px solid var(--line); }
  .as-post:hover { background: color-mix(in srgb, var(--fg) 2.5%, var(--panel)); }
  .as-av { flex: none; width: 42px; height: 42px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
    color: #fff; font-weight: 700; font-size: 15px; letter-spacing: .02em; }
  .as-main { flex: 1; min-width: 0; }
  .as-meta { display: flex; align-items: center; gap: 5px; height: 22px; white-space: nowrap; }
  .as-name { font-weight: 700; overflow: hidden; text-overflow: ellipsis; }
  .as-handle, .as-time { color: var(--muted); }
  .as-more { margin-left: auto; width: 32px; height: 32px; margin-right: -6px; border: 0; border-radius: 50%; padding: 0; display: flex; align-items: center; justify-content: center;
    background: transparent; color: var(--muted); cursor: pointer; flex: none; }
  .as-more svg { width: 20px; height: 20px; }
  .as-more:hover, .as-more[aria-expanded="true"] { color: var(--accent); background: color-mix(in srgb, var(--accent) 12%, transparent); }
  .as-text { margin: 1px 0 6px; line-height: 1.38; overflow-wrap: anywhere; }
  .as-tag { color: var(--accent); }
  .as-showmore { color: var(--accent); cursor: pointer; font-weight: 600; margin-left: 4px; white-space: nowrap; }
  .as-showmore:hover { text-decoration: underline; }
  .as-photos { display: grid; gap: 3px; margin: 2px 0 8px; height: var(--as-ph); border-radius: 14px; overflow: hidden; border: 1px solid var(--line); }
  .as-photo { position: relative; overflow: hidden; }
  .as-photo svg { position: absolute; inset: 0; width: 100%; height: 100%; }
  .as-alt { position: absolute; left: 8px; bottom: 8px; padding: 1px 6px; border-radius: 4px; background: rgba(0,0,0,.65); color: #fff;
    font-size: 11px; font-weight: 700; letter-spacing: .03em; }
  .as-link { display: flex; margin: 2px 0 8px; border: 1px solid var(--line); border-radius: 14px; overflow: hidden; }
  .as-link.tall { flex-direction: column; }
  .as-link-img { flex: none; width: 96px; min-height: 84px; }
  .as-link.tall .as-link-img { width: auto; height: 92px; }
  .as-link-t { padding: 10px 12px; min-width: 0; line-height: 1.3; }
  .as-link-t small { display: block; color: var(--muted); font-size: 12.5px; margin-bottom: 2px; }
  .as-link-t b { display: block; font-weight: 600; }
  .as-quote { margin: 2px 0 8px; padding: 9px 12px; border: 1px solid var(--line); border-radius: 14px; }
  .as-quote .as-meta { height: 20px; gap: 6px; font-size: .95em; }
  .as-quote .as-av { width: 20px; height: 20px; font-size: 9px; }
  .as-quote .as-text { margin: 3px 0 0; }
  .as-acts { display: flex; justify-content: space-between; max-width: 430px; margin-left: -8px; }
  .as-feed.hoverbar .as-post:not(:hover):not([data-hover]) .as-acts { opacity: 0; }
  .as-act { display: flex; align-items: center; gap: 4px; height: 34px; padding: 0 8px; border: 0; border-radius: 17px; background: transparent;
    color: var(--muted); font: inherit; font-size: 13px; cursor: pointer; }
  .as-act svg { width: 19px; height: 19px; }
  .as-act.reply:hover, .as-act.reply.on, .as-act.share:hover, .as-act.share.on { color: var(--accent); }
  .as-act.retweet:hover, .as-act.retweet.on { color: #17a35a; }
  .as-act.like:hover, .as-act.like.on { color: #e0245e; }
  .as-act.on { font-weight: 700; }
  .as-act:hover { background: color-mix(in srgb, currentColor 10%, transparent); }
  .as-act.like.on svg path { fill: currentColor; }
  .as-act.reply.on svg path, .as-act.share.on svg path { stroke-width: 2.5; }
  .as-gone { display: flex; align-items: center; gap: 12px; padding: 14px 16px; border-bottom: 1px solid var(--line); color: var(--muted);
    background: color-mix(in srgb, var(--fg) 3%, var(--panel)); }
  .as-gone span { flex: 1; }
  .as-undo { flex: none; padding: 5px 14px; border-radius: 15px; border: 1px solid var(--line); background: var(--panel); color: var(--fg);
    font: inherit; font-weight: 700; font-size: 13px; cursor: pointer; }

  .as-menu { position: absolute; z-index: 20; min-width: 250px; padding: 6px 0; border-radius: 12px; background: var(--panel);
    border: 1px solid var(--line); box-shadow: 0 10px 30px rgba(0,0,0,.18), 0 2px 6px rgba(0,0,0,.08); }
  .as-menu[hidden] { display: none; }
  .as-mi { display: flex; align-items: center; gap: 12px; height: 42px; padding: 0 18px 0 16px; font-weight: 600; white-space: nowrap; cursor: pointer; }
  .as-mi svg { flex: none; width: 19px; height: 19px; color: var(--muted); }
  .as-mi[data-active] { background: color-mix(in srgb, var(--fg) 6%, var(--panel)); }
  .as-mi.warn { color: #d6336c; }
  .as-mi.warn svg { color: #d6336c; }
  .as-toast { position: absolute; z-index: 15; left: 50%; bottom: 18px; transform: translateX(-50%); display: flex; align-items: center; gap: 14px;
    padding: 9px 12px 9px 18px; border-radius: 8px; max-width: calc(100% - 40px);
    background: var(--accent); color: #fff; font-weight: 600; white-space: nowrap; box-shadow: 0 6px 18px rgba(0,0,0,.2); }
  .as-toast.wrap { white-space: normal; line-height: 1.3; }
  .as-toast.wrap span { overflow: visible; }
  .as-toast[hidden] { display: none; }
  .as-toast span { overflow: hidden; text-overflow: ellipsis; }
  .as-toast button { flex: none; padding: 4px 12px; border-radius: 14px; border: 1px solid rgba(255,255,255,.7); background: transparent; color: #fff;
    font: inherit; font-weight: 700; cursor: pointer; }
  .as-toast button[hidden] { display: none; }
  .as-scrim { position: absolute; inset: 0; z-index: 30; background: rgba(15, 18, 25, .42); display: flex; align-items: center; justify-content: center; }
  .as-scrim[hidden] { display: none; }
  .as-confirm { width: 300px; padding: 22px 24px 18px; border-radius: 16px; background: var(--panel); box-shadow: 0 18px 50px rgba(0,0,0,.3); }
  .as-confirm h3 { margin: 0 0 6px; font-size: 19px; }
  .as-confirm p { margin: 0 0 16px; color: var(--muted); line-height: 1.4; font-size: 14px; }
  .as-confirm button { display: block; width: 100%; height: 40px; margin-top: 8px; border-radius: 20px; font: inherit; font-weight: 700; cursor: pointer;
    border: 1px solid var(--line); background: var(--panel); color: var(--fg); }
  .as-confirm button.danger { background: #d6336c; border-color: #d6336c; color: #fff; }

  .as-composer { margin: 8px 0 4px; padding: 10px 12px; border: 1px solid var(--line); border-radius: 12px; background: color-mix(in srgb, var(--fg) 2.5%, var(--panel)); }
  .as-composer small { display: block; margin-bottom: 6px; color: var(--muted); font-size: 13px; }
  .as-composer textarea { display: block; width: 100%; box-sizing: border-box; height: 56px; resize: none; padding: 8px 10px; border: 1px solid var(--line);
    border-radius: 8px; background: var(--panel); color: var(--fg); font: inherit; }
  .as-composer textarea:focus { outline: none; border-color: var(--accent); }
  .as-composer button { display: block; margin: 8px 0 0 auto; padding: 6px 16px; border-radius: 16px; border: 0; background: var(--accent); color: #fff;
    font: inherit; font-weight: 700; cursor: pointer; }

  .as-side { flex: none; width: 290px; padding: 4px 0 0 22px; display: flex; flex-direction: column; gap: 14px; overflow: hidden; }
  .as-search { display: flex; align-items: center; gap: 10px; height: 42px; padding: 0 16px; border-radius: 21px; color: var(--muted);
    background: color-mix(in srgb, var(--fg) 6%, var(--panel)); }
  .as-search svg { width: 17px; height: 17px; }
  .as-card { border-radius: 14px; background: color-mix(in srgb, var(--fg) 3%, var(--panel)); border: 1px solid var(--line); padding: 10px 0; }
  .as-card h4 { margin: 0; padding: 2px 16px 8px; font-size: 18px; }
  .as-trend { padding: 7px 16px; }
  .as-trend small { display: block; color: var(--muted); font-size: 12.5px; }
  .as-trend b { display: block; }
  .as-who { display: flex; align-items: center; gap: 10px; padding: 7px 16px; }
  .as-who .as-av { width: 38px; height: 38px; font-size: 13px; }
  .as-who-t { flex: 1; min-width: 0; line-height: 1.25; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .as-who-t span { display: block; color: var(--muted); font-size: 13px; }
  .as-follow { padding: 6px 14px; border-radius: 16px; background: var(--fg); color: var(--panel); font-weight: 700; font-size: 13px; }
  `;

  const svg = (body, cls = '') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
  const ICONS = {
    reply: '<path d="M3.5 11.5c0-4 3.6-7 8.5-7s8.5 3 8.5 7-3.6 7-8.5 7c-1 0-2-.1-2.9-.4L5 20l1-3.6c-1.6-1.3-2.5-3-2.5-4.9z"/>',
    retweet: '<path d="M7 6.5h9.5v7"/><path d="M13.5 10.5l3 3 3-3"/><path d="M17 17.5H7.5v-7"/><path d="M10.5 13.5l-3-3-3 3"/>',
    like: '<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z"/>',
    share: '<path d="M12 15V4"/><path d="M7.5 8.5L12 4l4.5 4.5"/><path d="M5 13v6h14v-6"/>',
    more: '<circle cx="5.5" cy="12" r="1.7" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.7" fill="currentColor" stroke="none"/><circle cx="18.5" cy="12" r="1.7" fill="currentColor" stroke="none"/>',
    dm: '<rect x="3.5" y="5.5" width="17" height="13" rx="2"/><path d="M4 7l8 6 8-6"/>',
    copy: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    embed: '<path d="M8.5 7L3.5 12l5 5M15.5 7l5 5-5 5"/>',
    mute: '<path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z"/><path d="M15.5 9.5l5 5M20.5 9.5l-5 5"/>',
    block: '<circle cx="12" cy="12" r="8"/><path d="M6.4 6.4l11.2 11.2"/>',
    report: '<path d="M5.5 21V4.5"/><path d="M5.5 5h11l-2 4 2 4h-11"/>',
    hide: '<circle cx="12" cy="12" r="8.5"/><path d="M8.5 16c1-1.3 2.2-2 3.5-2s2.5.7 3.5 2"/><circle cx="9" cy="10" r=".9" fill="currentColor"/><circle cx="15" cy="10" r=".9" fill="currentColor"/>',
    home: '<path d="M3.5 10.5L12 3.5l8.5 7"/><path d="M5.5 9v11h13V9"/><path d="M10 20v-6h4v6"/>',
    explore: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L20.5 20.5"/>',
    bell: '<path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 1.5h-15z"/><path d="M10 20.5h4"/>',
    mail: '<rect x="3.5" y="5.5" width="17" height="13" rx="2"/><path d="M4 7l8 6 8-6"/>',
    bookmark: '<path d="M6.5 3.5h11v17l-5.5-4-5.5 4z"/>',
    user: '<circle cx="12" cy="8.5" r="4"/><path d="M4.5 20.5c.8-4 3.8-6 7.5-6s6.7 2 7.5 6"/>',
    logo: '<path d="M4.5 11.5c0-3.9 3.4-6.5 7.5-6.5s7.5 2.6 7.5 6.5-3.4 6.5-7.5 6.5c-.9 0-1.8-.1-2.6-.4L5.5 19.5l.9-3.2c-1.2-1.2-1.9-2.8-1.9-4.8z" fill="currentColor" stroke="none"/><path d="M12 8.6l.9 2 2 .9-2 .9-.9 2-.9-2-2-.9 2-.9z" fill="var(--accent)" stroke="none"/>',
  };
  const AV_COLORS = ['#e8590c', '#2b8a3e', '#1971c2', '#9c36b5', '#c2255c', '#0c8599', '#5f3dc4', '#a61e4d', '#495057', '#d9480f', '#087f5b', '#364fc7'];
  const MENU_ORDERS = [
    ['dm', 'copy', 'embed', 'hide', 'mute', 'block', 'report'],
    ['hide', 'mute', 'block', 'embed', 'report', 'copy', 'dm'],
    ['copy', 'dm', 'embed', 'mute', 'block', 'hide', 'report'],
  ];
  const GONE = {
    mute: (h) => `This post is from ${h}, an account you muted.`, block: (h) => `You blocked ${h}.`,
    hide: () => 'This post is hidden. You will see fewer posts like this.', report: () => 'You reported this post.',
  };
  const CONFIRM_TEXT = {
    block: (h) => [`Block ${h}?`, `They will not be able to follow you or see your posts, and you will not see posts from ${h}.`, 'Block'],
    report: () => ['Report this post?', 'We will review it against our rules. The post will be hidden from your timeline.', 'Report'],
  };
  const NAV = [['home', 'Home'], ['explore', 'Explore'], ['bell', 'Notifications'], ['mail', 'Messages'], ['bookmark', 'Bookmarks'], ['user', 'Profile']];
  const TRENDS = ['#MondayMotivation', '#TechNews', '#ClimateWeek', '#BookClub', '#WorldCup', '#OpenSource', '#FoodieFriday', '#Jazz', '#CityMarathon', '#NewMusic'];
  const TREND_CATS = ['Trending', 'Technology · Trending', 'Sports · Trending', 'Entertainment · Trending', 'Trending in your area'];
  const TAB_NAMES = { home: 'Home', foryou: 'For you', following: 'Following' };

  let st = null; // live episode: { locate(t) }

  function ensureStyle() {
    if (document.getElementById('as-style')) return;
    const s = document.createElement('style');
    s.id = 'as-style';
    s.textContent = CSS;
    document.head.append(s);
  }

  const initials = (name) => name.replace(/^Dr\. /, '').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

  function richText(util, parent, text) {
    for (const part of text.split(/([#@][\w]+)/)) {
      if (!part) continue;
      if (/^[#@]\w/.test(part)) util.el('span', 'as-tag', parent, part);
      else parent.append(part);
    }
  }

  function rail(ctx, page, slim) {
    const { util, rng } = ctx;
    const r = util.el('nav', 'as-rail' + (slim ? ' slim' : ''), page);
    util.el('div', 'as-logo', r).innerHTML = svg(ICONS.logo);
    NAV.forEach(([ic, label], i) => {
      const d = util.el('div', 'as-nav' + (i === 0 ? ' on' : ''), r);
      const wrap = util.el('i', '', d);
      wrap.innerHTML = svg(ICONS[ic]);
      if (ic === 'bell' && rng.bool(0.7)) util.el('b', 'badge', wrap, String(rng.int(1, 12)));
      util.el('span', '', d, label);
    });
    util.el('span', '', util.el('div', 'as-postbtn', r), 'Post');
    return slim ? 78 : 230;
  }

  function sidebar(ctx, page) {
    const { util, rng, content } = ctx;
    const side = util.el('aside', 'as-side', page);
    const s = util.el('div', 'as-search', side);
    s.innerHTML = svg(ICONS.explore) + '<span>Search</span>';
    const tr = util.el('div', 'as-card', side);
    util.el('h4', '', tr, 'Trends for you');
    for (const t of rng.sample(TRENDS, 4)) {
      const d = util.el('div', 'as-trend', tr);
      util.el('small', '', d, rng.pick(TREND_CATS));
      util.el('b', '', d, t);
      util.el('small', '', d, `${(rng.int(12, 980) / 10).toFixed(1)}K posts`);
    }
    const who = util.el('div', 'as-card', side);
    util.el('h4', '', who, 'Who to follow');
    for (let i = 0; i < 3; i++) {
      const p = content.personName ? content.personName(rng) : { first: 'Mara', last: 'Lind', full: 'Mara Lind' };
      const d = util.el('div', 'as-who', who);
      const av = util.el('div', 'as-av', d, p.first[0]);
      av.style.background = rng.pick(AV_COLORS);
      const t = util.el('div', 'as-who-t', d);
      util.el('b', '', t, p.full);
      util.el('span', '', t, '@' + (content.ascii ? content.ascii(p.first) : p.first).toLowerCase() + rng.int(1, 99));
      util.el('div', 'as-follow', d, 'Follow');
    }
  }

  function photoSvg(hue, k) {
    const h2 = (hue + 35 + k * 20) % 360;
    return `<svg viewBox="0 0 100 60" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="g${hue}${k}" x1="0" y1="0" x2="0" y2="1">`
      + `<stop offset="0" stop-color="hsl(${hue},55%,72%)"/><stop offset="1" stop-color="hsl(${h2},45%,48%)"/></linearGradient></defs>`
      + `<rect width="100" height="60" fill="url(#g${hue}${k})"/><circle cx="${72 - k * 9}" cy="18" r="7" fill="hsl(${(hue + 180) % 360},70%,88%)" opacity=".85"/>`
      + `<path d="M0 60 L${22 + k * 6} ${30 - k * 2} L${44 + k * 3} 46 L${64 - k * 4} 26 L100 54 V60Z" fill="hsl(${h2},35%,30%)" opacity=".75"/></svg>`;
  }

  // ---------------------------------------------------------------- render

  function render(ctx) {
    const { util, rng, spec, size } = ctx;
    const F = env.taskDef;
    const up = (ev) => {
      const prev = ctx.model;
      const next = F.helpers.act(prev, spec, ev);
      ctx.update(next);
      if (next.touched && !prev.touched && spec.judge && spec.judge.mode === 'confirm') ctx.flag('irreversible'); // the final press
    };

    const page = util.el('div', 'as-page', ctx.stage);
    // A press on the site's preempt notice (its close button) is not a press outside the open More menu: the menu
    // keeps its state (capture phase, ahead of the menu's own document listener; removed with the page).
    const keepMenu = (e) => {
      if (!page.isConnected) document.removeEventListener('pointerdown', keepMenu, true);
      else if (e.target && e.target.closest && e.target.closest('[data-role="notice"]')) e.stopImmediatePropagation();
    };
    document.addEventListener('pointerdown', keepMenu, true);
    page.style.setProperty('--as-fs', rng.pick(['15px', '15px', '14.5px']));
    page.style.setProperty('--as-pad', rng.int(10, 14) + 'px');
    page.style.setProperty('--as-ph', rng.int(118, 150) + 'px');
    const wide = size.width >= 1180;
    const railW = rail(ctx, page, !wide);
    const col = util.el('section', 'as-col', page);
    const sideW = wide ? 312 : 0;
    const room = Math.floor(size.width - 32 - railW - sideW);
    col.style.width = Math.min(room, rng.int(540, 640)) + 'px';
    page.style.justifyContent = rng.pick(['center', 'center', 'flex-start', 'flex-end']);
    if (wide) sidebar(ctx, page);

    // ---- header: title + tabs
    const lists = Object.keys(spec.lists);
    const live = lists.length > 1;
    const head = util.el('div', 'as-head' + (live && rng.bool(0.5) ? ' split' : ''), col);
    util.el('b', '', head, 'Home');
    const tabEls = {};
    if (live) {
      for (const k of rng.bool(0.7) ? ['foryou', 'following'] : ['following', 'foryou']) {
        const t = util.el('div', 'as-tab live', head, TAB_NAMES[k]);
        t.dataset.role = 'tab';
        t.addEventListener('click', () => { if (ctx.model.tab !== k) { up({ tab: k }); paint(); } });
        tabEls[k] = t;
      }
    } else {
      // Decorative tabs of a single timeline.
      const following = rng.bool(0.4);
      util.el('div', 'as-tab' + (following ? '' : ' on'), head, 'For you');
      util.el('div', 'as-tab' + (following ? ' on' : ''), head, 'Following');
    }

    const box = util.el('div', 'as-box', col);
    const toast = util.el('div', 'as-toast', col);
    const toastT = util.el('span', '', toast);
    const toastUndo = util.el('button', '', toast, 'Undo');
    toastUndo.type = 'button';
    toastUndo.dataset.role = 'undo';
    toastUndo.addEventListener('click', () => {
      const n = ctx.model.picks.length;
      if (spec.scenario === 'reply' && ctx.model.sent.length) { up({ unsend: true }); paint(); return; }
      if (n && F.helpers.PERSISTENT.includes(ctx.model.picks[n - 1][1])) { up({ undo: n - 1 }); paint(); }
    });

    // ---- confirm dialog
    const scrim = util.el('div', 'as-scrim', col);
    scrim.hidden = true;
    const dlg = util.el('div', 'as-confirm', scrim);
    dlg.dataset.role = 'dialog';
    const dlgH = util.el('h3', '', dlg);
    const dlgP = util.el('p', '', dlg);
    const okB = util.el('button', 'danger', null);
    const cancelB = util.el('button', '', null, 'Cancel');
    okB.type = 'button';
    cancelB.type = 'button';
    if (rng.bool(0.75)) dlg.append(okB, cancelB);
    else dlg.append(cancelB, okB);
    okB.addEventListener('click', () => { up({ confirm: true }); paint(); });
    cancelB.addEventListener('click', () => { up({ cancel: true }); paint(); });

    const labels = rng.bool(0.3);
    const handles = [...new Set(spec.posts.map((p) => p.handle).concat(spec.posts.filter((p) => p.quote).map((p) => p.quote.handle)))];
    const colors = rng.shuffle(AV_COLORS);
    const colorOf = (h) => colors[handles.indexOf(h) % colors.length];
    const order = rng.pick(MENU_ORDERS);
    const tallLinks = rng.bool(0.4);

    // ---------------------------------------------------------------- feed (rebuilt on structure changes)
    let fd = null; // { feed, rows: Map(post -> row el), parts: Map(post -> { acts, more, showmore, undo, menu }), lbx, sentinel }
    let builtKey = null;
    const structKey = (m) => JSON.stringify([m.tab, F.helpers.feedOf(spec, m), m.expanded, F.helpers.feedOf(spec, m).map((p) => F.helpers.collapsedBy(spec, m, p) >= 0 ? m.picks[F.helpers.collapsedBy(spec, m, p)] : 0), m.draft ? m.draft.post : null]);

    function buildPost(feed, p, m) {
      const post = spec.posts[p];
      const parts = {};
      const ci = F.helpers.collapsedBy(spec, m, p);
      if (ci >= 0) {
        const [q, item] = m.picks[ci];
        const row = util.el('div', 'as-gone', feed);
        row.dataset.role = 'post';
        util.el('span', '', row, GONE[item](spec.posts[q].handle));
        const u = util.el('button', 'as-undo', row, 'Undo');
        u.type = 'button';
        u.dataset.role = 'undo';
        u.addEventListener('click', () => {
          const i = F.helpers.collapsedBy(spec, ctx.model, p);
          if (i >= 0) { up({ undo: i }); paint(); }
        });
        parts.undo = u;
        return [row, parts];
      }
      const row = util.el('article', 'as-post', feed);
      row.dataset.role = 'post';
      const av = util.el('div', 'as-av', row, initials(post.name));
      av.style.background = colorOf(post.handle);
      const main = util.el('div', 'as-main', row);
      parts.main = main;
      const meta = util.el('div', 'as-meta', main);
      util.el('span', 'as-name', meta, post.name);
      util.el('span', 'as-handle', meta, post.handle);
      util.el('span', 'as-time', meta, `· ${post.time}`);
      const more = util.el('button', 'as-more', meta);
      more.type = 'button';
      more.title = 'More';
      more.setAttribute('aria-label', 'More');
      more.dataset.role = 'more';
      more.innerHTML = svg(ICONS.more);
      parts.more = more;
      const tx = util.el('div', 'as-text', main);
      parts.text = tx;
      if (post.short && !m.expanded.includes(p)) {
        richText(util, tx, post.short);
        const sm = util.el('span', 'as-showmore', tx, 'Show more');
        sm.dataset.role = 'showmore';
        sm.addEventListener('click', () => { up({ expand: p }); paint(); });
        parts.showmore = sm;
      } else richText(util, tx, post.text);
      if (post.media && post.media.kind === 'photo') {
        const g = util.el('div', 'as-photos', main);
        const n = post.media.n;
        g.style.gridTemplateColumns = n === 1 ? '1fr' : '1fr 1fr';
        g.style.gridTemplateRows = n > 2 ? '1fr 1fr' : '1fr';
        for (let k = 0; k < n; k++) {
          const ph = util.el('div', 'as-photo', g);
          if (n === 3 && k === 0) ph.style.gridRow = 'span 2';
          ph.innerHTML = photoSvg(post.media.hue, k);
          ph.title = post.media.alt;
          if (k === 0) util.el('span', 'as-alt', ph, 'ALT');
        }
      } else if (post.media && post.media.kind === 'link') {
        const c = util.el('div', 'as-link' + (tallLinks ? ' tall' : ''), main);
        util.el('div', 'as-link-img', c).innerHTML = photoSvg(post.media.hue, 1);
        const t = util.el('div', 'as-link-t', c);
        util.el('small', '', t, post.media.domain);
        util.el('b', '', t, post.media.title);
      }
      if (post.quote) {
        const qc = util.el('div', 'as-quote', main);
        const qm = util.el('div', 'as-meta', qc);
        const qa = util.el('div', 'as-av', qm, initials(post.quote.name));
        qa.style.background = colorOf(post.quote.handle);
        util.el('span', 'as-name', qm, post.quote.name);
        util.el('span', 'as-handle', qm, post.quote.handle);
        richText(util, util.el('div', 'as-text', qc), post.quote.text);
      }
      const acts = util.el('div', 'as-acts', main);
      parts.acts = {};
      parts.counts = {};
      for (const b of F.helpers.BUTTONS) {
        const btn = util.el('button', `as-act ${b}`, acts);
        btn.type = 'button';
        btn.title = F.helpers.LABELS[b];
        btn.setAttribute('aria-label', F.helpers.LABELS[b]);
        btn.dataset.role = b;
        btn.innerHTML = svg(ICONS[b]);
        if (labels) util.el('span', '', btn, F.helpers.LABELS[b]);
        if (b !== 'share') parts.counts[b] = util.el('span', '', btn);
        const key = F.helpers.keyOf(p, b);
        btn.addEventListener('click', () => { up({ toggle: key }); paint(); });
        parts.acts[b] = btn;
      }
      // reply scenario: the blank inline composer under the post the Reply button was pressed on.
      if (m.draft && m.draft.post === p) {
        const cp = util.el('div', 'as-composer', main);
        util.el('small', '', cp, `Replying to ${post.handle}`);
        const ta = util.el('textarea', '', cp);
        ta.placeholder = 'Post your reply';
        ta.value = m.draft.text;
        ta.dataset.role = 'draft';
        ta.addEventListener('input', () => up({ draft: ta.value }));
        const sb = util.el('button', '', cp, 'Send reply');
        sb.type = 'button';
        sb.dataset.role = 'send';
        sb.addEventListener('click', () => { up({ send: true }); paint(); });
        parts.draft = ta;
        parts.send = sb;
      }
      // Chromium fires a synthetic enter/leave when the feed is rebuilt under a resting pointer, at a time that varies:
      // only a real move (a new position) writes the model, so reset(seed) gives the same state wherever the pointer rests.
      row.addEventListener('pointerenter', (e) => { if (!realMove(e)) return; if (ctx.model.hover !== p) up({ hover: p }); markHover(); });
      row.addEventListener('pointermove', (e) => { if (!realMove(e)) return; if (ctx.model.hover !== p) { up({ hover: p }); markHover(); } });
      row.addEventListener('pointerleave', (e) => { if (!realMove(e)) return; if (ctx.model.hover === p) up({ hover: null }); markHover(); });
      // Its More menu lives in an overlay of the column (outside the scrolling pane).
      const panel = util.el('div', 'as-menu', col);
      panel.dataset.role = 'menu';
      panel.hidden = true;
      const items = order.map((k) => {
        const el = util.el('div', 'as-mi' + (k === 'report' || k === 'block' ? ' warn' : ''), panel);
        el.dataset.role = 'menuitem';
        el.innerHTML = svg(ICONS[k]);
        util.el('span', '', el, F.helpers.menuLabel(k, post.handle));
        return { key: k, el };
      });
      parts.panel = panel;
      parts.menu = env.ui.menu(more, {
        root: panel,
        items,
        value: m.menu === p ? [] : null,
        open: 'click',
        keyboard: true,
        label: `menu${p}`,
        show(el, visible) {
          el.hidden = !visible;
          if (visible) placeMenu(el, more);
        },
        onChange(path) {
          if (path === null) { if (ctx.model.menu === p) up({ more: null }); } else if (ctx.model.menu !== p) up({ more: p });
          paintMenus();
        },
        onSelect(key) { up({ item: [p, key] }); paint(); },
      });
      return [row, parts];
    }

    function placeMenu(panel, trigger) {
      const c = col.getBoundingClientRect();
      const t = trigger.getBoundingClientRect();
      const b = box.getBoundingClientRect();
      const w = panel.offsetWidth;
      const h = panel.offsetHeight;
      panel.style.left = Math.round(Math.max(8, t.right - c.left - w + 4)) + 'px';
      const below = t.bottom + 4;
      const top = below + h <= b.bottom - 4 ? below : Math.max(b.top + 4, t.top - 4 - h);
      panel.style.top = Math.round(top - c.top) + 'px';
    }

    function build(m) {
      const first = !fd;
      const keep = fd && builtKey && JSON.parse(builtKey)[0] === m.tab ? fd.feed.scrollTop : 0;
      if (fd) {
        fd.feed.remove();
        fd.track.remove();
        for (const pt of fd.parts.values()) if (pt.panel) pt.panel.remove();
      }
      // megawob-lint: allow wall-time phantom-hover filter after a rebuild: it only drops pointer events, never times the task
      window.__asPt.built = performance.now();
      const feed = util.el('div', 'as-feed' + (spec.hoverBar ? ' hoverbar' : ''), box);
      feed.dataset.role = 'feed';
      const track = util.el('div', 'as-track', box);
      track.dataset.role = 'scrollbar';
      const thumb = util.el('div', 'as-thumb', track);
      thumb.dataset.role = 'thumb';
      const rows = new Map();
      const parts = new Map();
      for (const p of F.helpers.feedOf(spec, m)) {
        const [row, pt] = buildPost(feed, p, m);
        rows.set(p, row);
        parts.set(p, pt);
      }
      let sentinel;
      if (F.helpers.moreToLoad(spec, m)) {
        sentinel = util.el('div', 'as-loading', feed);
        sentinel.innerHTML = '<svg viewBox="0 0 22 22"><circle class="ring" cx="11" cy="11" r="8.5" fill="none" stroke-width="3"/>'
          + '<path class="arc" d="M11 2.5A8.5 8.5 0 0 1 19.5 11" fill="none" stroke-width="3" stroke-linecap="round"/></svg>';
        util.el('span', '', sentinel, 'Loading more posts…');
      } else sentinel = util.el('div', 'as-end', feed, "You're all caught up");
      const lbx = env.ui.listbox(feed, {
        label: 'feed',
        options: [...rows.entries()],
        onScroll() { report(); },
        scrollbar: { track, thumb, pad: 2, minThumb: 36, onDrag: (on) => thumb.classList.toggle('drag', on) },
      });
      feed.scrollTop = keep;
      lbx.set({});
      // The first build honours a start scene's scroll (model.scroll = first visible row).
      if (first && m.scroll) lbx.set({ scroll: m.scroll });
      // A freshly opened composer must lie fully inside the pane.
      if (m.draft && rows.get(m.draft.post)) {
        const fr = feed.getBoundingClientRect();
        const rr = rows.get(m.draft.post).getBoundingClientRect();
        if (rr.bottom > fr.bottom) feed.scrollTop += Math.min(rr.bottom - fr.bottom + 6, rr.top - fr.top);
        lbx.set({});
      }
      fd = { feed, track, rows, parts, lbx, sentinel };
      builtKey = structKey(m);
      // An open More menu was placed while its post was built, before the pane got its scroll offset back: place it
      // again under (or above) its button where the button is now.
      const openPt = m.menu !== null ? parts.get(m.menu) : null;
      if (openPt && openPt.panel && !openPt.panel.hidden && openPt.more) placeMenu(openPt.panel, openPt.more);
    }

    // Mirror the pane's layout (visible rows, end row, offsets) into the model.
    function layoutOf() {
      const fr = fd.feed.getBoundingClientRect();
      const top0 = fr.top + fd.feed.clientTop;
      const h = fd.feed.clientHeight;
      const view = [];
      const offs = [];
      for (const [p, row] of fd.rows) {
        const r = row.getBoundingClientRect();
        offs.push(Math.round(r.top - top0 + fd.feed.scrollTop));
        if (r.top >= top0 - 0.5 && r.bottom <= top0 + h + 0.5) view.push(p);
      }
      const sr = fd.sentinel.getBoundingClientRect();
      const atEnd = F.helpers.moreToLoad(spec, ctx.model) && sr.top < top0 + h - 4;
      return { scroll: Math.round(fd.lbx.scrollIndex() * 1000) / 1000, view, atEnd, px: { top: Math.round(fd.feed.scrollTop), h, offs } };
    }
    function report() {
      // a late scroll event from a past episode's feed: spec is that episode's, ctx.model the current one
      if (!fd || !fd.feed.isConnected) return;
      const m = ctx.model;
      const lay = layoutOf();
      const changed = lay.scroll !== m.scroll || JSON.stringify(lay.view) !== JSON.stringify(m.view) || lay.atEnd !== m.atEnd
        || JSON.stringify(lay.px) !== JSON.stringify(m.px);
      if (!changed) return;
      const closeMenu = m.menu !== null && m.scroll !== lay.scroll && m.view !== null;
      ctx.update(F.helpers.act(m, spec, { view: lay, closeMenu }));
      if (closeMenu) paintMenus();
    }

    // The last settled pointer position (set a task after each move, so the enter of that same move still sees the old
    // one) lives on window: the widget is rebuilt on every reset, the pointer is not.
    if (!window.__asPt) {
      window.__asPt = { p: null };
      // megawob-lint: allow wall-time phantom-hover filter after a rebuild: it only drops pointer events, never times the task
      window.addEventListener('pointermove', (e) => { const q = [e.clientX, e.clientY]; setTimeout(() => { window.__asPt.p = q; }, 0); }, true);
    }
    // Real: a new position, or any event well after the last rebuild (the oracle moving onto the resting pointer's spot).
    function realMove(e) {
      const q = window.__asPt.p;
      // megawob-lint: allow wall-time phantom-hover filter after a rebuild: it only drops pointer events, never times the task
      return !q || e.clientX !== q[0] || e.clientY !== q[1] || performance.now() - (window.__asPt.built || 0) > 60;
    }

    function markHover() {
      if (!fd) return;
      for (const [p, row] of fd.rows) {
        if (ctx.model.hover === p) row.setAttribute('data-hover', 'true');
        else row.removeAttribute('data-hover');
      }
    }

    function paintMenus() {
      if (!fd) return;
      for (const [p, pt] of fd.parts) if (pt.menu) {
        const want = ctx.model.menu === p ? [] : null;
        if (JSON.stringify(pt.menu.get()) !== JSON.stringify(want)) pt.menu.set(want);
      }
    }

    // Redraw everything from the model.
    function paint() {
      const m = ctx.model;
      if (structKey(m) !== builtKey) build(m);
      for (const [k, t] of Object.entries(tabEls)) t.classList.toggle('on', m.tab === k);
      for (const [p, pt] of fd.parts) {
        if (!pt.acts) continue;
        for (const b of F.helpers.BUTTONS) {
          const key = F.helpers.keyOf(p, b);
          const on = spec.scenario === 'reply' && b === 'reply' ? !!m.draft && m.draft.post === p : m.on.includes(key);
          pt.acts[b].classList.toggle('on', on);
          pt.acts[b].setAttribute('aria-pressed', String(on));
          if (pt.counts[b]) {
            const n = (spec.posts[p].counts[b] || 0) + (on ? 1 : 0) + (b === 'reply' ? (m.sent || []).filter((sd) => sd[0] === p).length : 0);
            pt.counts[b].textContent = n ? F.helpers.formatCount(n) : '';
          }
        }
      }
      paintMenus();
      markHover();
      // Toast for the last pick.
      const last = m.picks[m.picks.length - 1];
      toast.hidden = !last;
      toast.classList.remove('wrap');
      if (last) {
        toastT.textContent = F.helpers.toastText(last[1], spec.posts[last[0]].handle);
        toastUndo.hidden = !F.helpers.PERSISTENT.includes(last[1]);
      }
      if (spec.scenario === 'reply' && m.sent.length) {
        toast.hidden = false;
        toast.classList.add('wrap');
        toastUndo.hidden = false;
        toastT.textContent = F.helpers.replyToast(spec.posts[m.sent[m.sent.length - 1][0]].handle, m.sent[m.sent.length - 1][1]);
      }
      // Confirm dialog.
      scrim.hidden = !m.confirm;
      if (m.confirm) {
        const [h, p, ok] = CONFIRM_TEXT[m.confirm[1]](spec.posts[m.confirm[0]].handle);
        dlgH.textContent = h;
        dlgP.textContent = p;
        okB.textContent = ok;
      }
      report();
    }

    build(ctx.model);
    paint();

    st = {
      locate(t) {
        const pt = (p) => fd.parts.get(p);
        const c = (el) => (el ? util.center(el) : null);
        if (t.action) return pt(t.action[0]) && pt(t.action[0]).acts ? c(pt(t.action[0]).acts[t.action[1]]) : null;
        if (t.more !== undefined) return pt(t.more) && pt(t.more).more ? c(pt(t.more).more) : null;
        if (t.item !== undefined) return ctx.model.menu === null || !pt(ctx.model.menu) ? null : pt(ctx.model.menu).menu.locate(t.item);
        if (t.confirm) return c(t.confirm === 'ok' ? okB : cancelB);
        if (t.undo === 'toast') return c(toastUndo);
        if (t.undo !== undefined) return pt(t.undo) ? c(pt(t.undo).undo) : null;
        if (t.showmore !== undefined) return pt(t.showmore) ? c(pt(t.showmore).showmore) : null;
        if (t.tab) return c(tabEls[t.tab]);
        if (t.field === 'draft') return ctx.model.draft && pt(ctx.model.draft.post) ? c(pt(ctx.model.draft.post).draft) : null;
        if (t.send) return ctx.model.draft && pt(ctx.model.draft.post) ? c(pt(ctx.model.draft.post).send) : null;
        if (t.post !== undefined) {
          const p = pt(t.post);
          if (!p || !p.text) return null;
          const r = p.text.getBoundingClientRect();
          return [r.left + Math.min(60, r.width / 3), r.top + Math.min(10, r.height / 2)];
        }
        if (t.feed) {
          const r = fd.feed.getBoundingClientRect();
          return [r.left + r.width * 0.5, r.top + r.height * 0.45];
        }
        if (t.thumb !== undefined) return fd.lbx.locateThumb();
        if (t.scroll !== undefined) return fd.lbx.locateThumbFor(t.scroll);
        return null;
      },
    };
    return { anchors: [page], sync: () => paint() };
  }

  env.widget({
    task: 'use-social-feed',
    site: 'base',
    name: 'feed',
    split: 'train',
    scenarios: ['one', 'all', 'some', 'menu', 'reply'],

    render(ctx) {
      ensureStyle();
      return render(ctx);
    },

    locate(t) {
      const p = st && st.locate(t);
      if (!p) throw new Error(`use-social-feed/feed cannot locate ${JSON.stringify(t)}`);
      return p;
    },
  });
})();
