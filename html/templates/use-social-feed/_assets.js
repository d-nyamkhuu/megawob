/* use-social-feed/feed: shared styles, icons, content and design defaults. */
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
  const TOASTS = {
    dm: () => 'Sent via Direct Message', copy: () => 'Copied to clipboard', embed: () => 'Embed code copied',
    mute: (h) => `You muted ${h}`, block: (h) => `You blocked ${h}`, report: () => 'Thanks for reporting this post',
    hide: () => 'Got it. You will see fewer posts like this',
  };
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

  const initials = (name) => name.replace(/^Dr\. /, '').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

  function richText(util, parent, text) {
    for (const part of text.split(/([#@][\w]+)/)) {
      if (!part) continue;
      if (/^[#@]\w/.test(part)) util.el('span', 'as-tag', parent, part);
      else parent.append(part);
    }
  }

  // Extra rules of the sites whose action row sits inline under the post text (token inlineActs).
  const INLINE_ACTS = '\n.as-main{padding-right:0!important}.as-acts{position:static!important;justify-content:flex-start;gap:18px}.as-text{margin-bottom:8px}.as-post{min-height:0!important}.as-more{position:static!important}\n';

  // URL of a file in a site's assets/ folder, the way a widget file resolves '../assets/<file>' against its own URL.
  const TEMPLATE_SRC = document.currentScript.src;
  const assetUrl = (site, file) => new URL(`../../sites/${site}/assets/${file}`, TEMPLATE_SRC).href;

  // Exact default for the one scenario: the Office ribbon design, including its widget CSS.
  const ONE_CSS = "\n.as-app{left:0!important;right:0!important;top:0!important;bottom:0!important;width:auto!important;border:0;border-radius:0;box-shadow:none}.as-top{display:none}.as-body{min-height:0}.as-btn{border-radius:3px;font-size:14px}.as-pane{border-radius:0}.se-main{padding:17px 22px!important;gap:0}.se-col{width:100%;max-width:none}.se-side{display:none}.se-box{border-radius:3px;box-shadow:none;height:39px;padding:0 12px}.se-go{border-radius:3px;height:39px;padding:0 22px}.se-card{border-bottom:1px solid var(--line);padding:8px 8px 4px}.se-card .se-title{font-family:inherit;font-size:19px}.se-pager{justify-content:center}.se-pg{border-radius:2px;width:32px;min-width:32px;height:32px}.se-fav{width:22px;height:22px;border-radius:1px}.se-url{font-size:12px}.se-desc{font-size:14px}.tk-main{padding:18px 22px}.tk-title{font-size:24px}.tk-date{border-radius:0;background:transparent}.tk-row{gap:12px;border-bottom:1px solid var(--line);padding:0 12px}.tk-name{font-size:15px}.tk-price{font-size:18px;width:68px}.tk-buy{width:65px}.tk-when{width:125px}.tk-trigger{border-radius:0;min-width:175px}.fd-wrap.left{flex-direction:row}.fd-cart{width:28%!important;border-left:3px solid var(--fg);border-radius:0;background:var(--panel)}.fd-menu{padding:12px 18px}.fd-card{border-radius:0}.fd-add{border-radius:2px}.fd-order{border-radius:2px}.fd-rname{font-size:22px}.fd-rmeta{font-size:12px}.fd-dialog,.as-dialog{border-radius:4px}.fl-form{border-radius:0}.at-win{left:0!important;top:0!important;width:100%!important;height:100%!important;border-radius:0;box-shadow:none}.at-title{height:30px;border-radius:0;background:var(--header,var(--panel));font-size:14px}.at-rail{display:none}.at-body{flex:1;min-height:0}.at-main{min-width:0}.at-pane-h{border-radius:0}.at-explorer{width:46%!important;max-width:none}.at-preview{padding:10px}.at-tree{font-family:inherit}.at-row svg{color:var(--fg)}.at-ed{padding:0!important}.at-pagearea{background:var(--panel);padding:0!important}.at-sheet{border:0;box-shadow:none;background:var(--panel);margin:0!important;width:100%!important;max-width:none!important;padding:26px 32px!important}.at-sheet h2{font-family:inherit}.at-tb{border-radius:0;padding:10px;background:var(--header,var(--panel))}.at-tool{border-radius:3px;font-family:inherit}.at-status{background:var(--panel)}.at-term{border-radius:0;border:0}.at-tscroll{padding:20px;font:15px/1.5 monospace}.at-term-tabs{background:var(--header,var(--panel))}.as-page{inset:0!important;display:flex;justify-content:stretch!important}.as-rail,.as-side{display:none}.as-col{flex:1!important;width:100%!important;border:0}.as-head{height:43px;background:var(--header,var(--panel));font-size:14px}.as-post{padding:13px 18px;gap:14px;border-bottom:1px solid var(--line)}.as-text{font-size:16px;line-height:1.4}.as-av{width:48px;height:48px;border-radius:4px;font-size:17px}.as-acts{max-width:440px;justify-content:flex-start;gap:22px}.as-act{border-radius:3px;height:30px;font-size:14px;padding:0 8px}.as-act svg{width:20px;height:20px}.as-photos{height:100px!important;border-radius:4px}.as-menu{border-radius:3px;min-width:210px}.as-mi{height:35px;font-size:14px}.as-confirm{border-radius:4px}.as-confirm button{border-radius:3px}.as-track{border-radius:0;width:15px;background:var(--line)}.as-thumb{border-radius:0}.as-name{font-size:16px}.as-handle,.as-time{font-size:13px}.as-quote{border-radius:3px}.as-link{border-radius:3px}.as-link.tall .as-link-img{height:65px}.as-post:has(.as-photos){min-height:200px}\n.design-header{background:linear-gradient(#a5bed6,#e1effc)}.site-shell{grid-template-rows:100px minmax(0,1fr) 55px}.design-header{align-items:flex-start;padding-top:13px;position:relative}.design-header:after{content:\"Refresh       New Post       Open       Save       Search       Filter       Mark Read       Favorite       Settings\";position:absolute;bottom:12px;left:25px;color:#133c6d;font:16px Arial}.bottom .task-note{background:#deefff;font-size:26px}.as-post{display:flex;padding:12px}.as-main{position:relative;padding-right:280px}.as-acts{position:absolute;right:0;bottom:0;gap:12px}.as-text{font-size:14px}.as-photos{height:80px!important}.end-control{background:linear-gradient(#38b2ff,#0379d9)}";

  const TOKENS = {
    title: 'Home',
    nav: null,
    navOn: 0,
    icons: {},
    layout: 'columns',
    labels: null,
    labelClass: false,
    detail: false,
    actLabels: {},
    countZero: false,
    timeFormat: 'dot',
    scrollSet: 'none',
    menuBounds: 'box',
    menuPlace: 'show',
    avatarSheet: null,
    avatarTiles: 6,
    photoSheet: null,
    css: '',
    inlineActs: false,
    siteCssLast: false,
    scenarioDecor: false,
  };

  // What the sites of one scenario share (a widget that declares exactly that scenario gets it before its design).
  const SCENARIOS = {
    one: {
      layout: 'plain', siteCssLast: true, inlineActs: true, labelClass: true, detail: true,
      menuBounds: 'column', photoSheet: 'reference-photos.webp',
      css: ONE_CSS, labels: false, avatarSheet: 'reference-photos.webp',
    },
    all: {
      scenarioDecor: true,
      icons: { like: '<path d="M12 21S2 15 2 8.5A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 10 2.5C22 15 12 21 12 21z"/>' },
      parts: {
        avatar: (base, S) => (R, ...args) => {
          const av = base(R, ...args);
          const post = args[1];
          if (S.D.scenarioDecor && R.spec.posts.filter((q) => q.handle === post.handle).length < 2)
            av.classList.add(R.handles.indexOf(post.handle) % 2 ? 'flower' : 'cat');
          return av;
        },
        timeText: (base, S) => (R, post) => S.D.scenarioDecor ? `Apr 27, 1998   ${post.time}` : base(R, post),
        rowsBuilt: (base, S) => (R, B, m) => {
          base(R, B, m);
          if (!S.D.scenarioDecor) return;
          const status = document.querySelector('.hn-count');
          if (status) status.textContent = `Showing ${B.rows.size} of ${R.spec.posts.length} posts`;
        },
        restoreScroll: (base, S) => (R, B, m, keep, first) => {
          if (!S.D.scenarioDecor) return base(R, B, m, keep, first);
          const initialScroll = first && Number.isFinite(Number(m.scroll)) ? Number(m.scroll) : 0;
          B.feed.scrollTop = keep || initialScroll * Math.max(0, B.feed.scrollHeight - B.feed.clientHeight);
          B.lbx.set({});
        },
      },
    },
    some: {
      scenarioDecor: true,
      parts: {
        page: (base, S) => (R) => {
          const page = base(R);
          // The site's own primary action, never the one the goal asks for (that would point at the answer).
          if (S.D.scenarioDecor && document.body.dataset.primary) page.dataset.primary = document.body.dataset.primary;
          return page;
        },
        columnMade: (base, S) => (R) => {
          base(R);
          if (S.D.scenarioDecor) R.page.classList.toggle('aq-live', Object.keys(R.spec.lists).length > 1);
        },
        avatar: (base, S) => (R, ...args) => {
          const av = base(R, ...args);
          if (S.D.scenarioDecor) av.classList.add('aq-photo');
          return av;
        },
      },
    },
  };

  env.template('use-social-feed/_assets', () => ({ CSS, svg, ICONS, AV_COLORS, MENU_ORDERS, TOASTS, GONE, CONFIRM_TEXT, NAV, TRENDS, TREND_CATS, TAB_NAMES, initials, richText, INLINE_ACTS, TEMPLATE_SRC, assetUrl, ONE_CSS, TOKENS, SCENARIOS }));
})();
