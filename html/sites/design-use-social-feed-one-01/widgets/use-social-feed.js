// 1996 community-homepage styling, pixel portraits, archival timestamps, and legacy feed labels.
(function () {
  'use strict';

  const DESIGN_CSS = "\n.as-app{left:0!important;right:0!important;top:0!important;bottom:0!important;width:auto!important;border:0;border-radius:0;box-shadow:none}.as-top{display:none}.as-body{min-height:0}.as-btn{border-radius:3px;font-size:14px}.as-pane{border-radius:0}.se-main{padding:17px 22px!important;gap:0}.se-col{width:100%;max-width:none}.se-side{display:none}.se-box{border-radius:3px;box-shadow:none;height:39px;padding:0 12px}.se-go{border-radius:3px;height:39px;padding:0 22px}.se-card{border-bottom:1px solid var(--line);padding:8px 8px 4px}.se-card .se-title{font-family:inherit;font-size:19px}.se-pager{justify-content:center}.se-pg{border-radius:2px;width:32px;min-width:32px;height:32px}.se-fav{width:22px;height:22px;border-radius:1px}.se-url{font-size:12px}.se-desc{font-size:14px}.tk-main{padding:18px 22px}.tk-title{font-size:24px}.tk-date{border-radius:0;background:transparent}.tk-row{gap:12px;border-bottom:1px solid var(--line);padding:0 12px}.tk-name{font-size:15px}.tk-price{font-size:18px;width:68px}.tk-buy{width:65px}.tk-when{width:125px}.tk-trigger{border-radius:0;min-width:175px}.fd-wrap.left{flex-direction:row}.fd-cart{width:28%!important;border-left:3px solid var(--fg);border-radius:0;background:var(--panel)}.fd-menu{padding:12px 18px}.fd-card{border-radius:0}.fd-add{border-radius:2px}.fd-order{border-radius:2px}.fd-rname{font-size:22px}.fd-rmeta{font-size:12px}.fd-dialog,.as-dialog{border-radius:4px}.fl-form{border-radius:0}.at-win{left:0!important;top:0!important;width:100%!important;height:100%!important;border-radius:0;box-shadow:none}.at-title{height:30px;border-radius:0;background:var(--header,var(--panel));font-size:14px}.at-rail{display:none}.at-body{flex:1;min-height:0}.at-main{min-width:0}.at-pane-h{border-radius:0}.at-explorer{width:46%!important;max-width:none}.at-preview{padding:10px}.at-tree{font-family:inherit}.at-row svg{color:var(--fg)}.at-ed{padding:0!important}.at-pagearea{background:var(--panel);padding:0!important}.at-sheet{border:0;box-shadow:none;background:var(--panel);margin:0!important;width:100%!important;max-width:none!important;padding:26px 32px!important}.at-sheet h2{font-family:inherit}.at-tb{border-radius:0;padding:10px;background:var(--header,var(--panel))}.at-tool{border-radius:3px;font-family:inherit}.at-status{background:var(--panel)}.at-term{border-radius:0;border:0}.at-tscroll{padding:20px;font:15px/1.5 monospace}.at-term-tabs{background:var(--header,var(--panel))}.as-page{inset:0!important;display:flex;justify-content:stretch!important}.as-rail,.as-side{display:none}.as-col{flex:1!important;width:100%!important;border:0}.as-head{height:43px;background:var(--header,var(--panel));font-size:14px}.as-post{padding:13px 18px;gap:14px;border-bottom:1px solid var(--line)}.as-text{font-size:16px;line-height:1.4}.as-av{width:48px;height:48px;border-radius:4px;font-size:17px}.as-acts{max-width:440px;justify-content:flex-start;gap:22px}.as-act{border-radius:3px;height:30px;font-size:14px;padding:0 8px}.as-act svg{width:20px;height:20px}.as-photos{height:100px!important;border-radius:4px}.as-menu{border-radius:3px;min-width:210px}.as-mi{height:35px;font-size:14px}.as-confirm{border-radius:4px}.as-confirm button{border-radius:3px}.as-track{border-radius:0;width:15px;background:var(--line)}.as-thumb{border-radius:0}.as-name{font-size:16px}.as-handle,.as-time{font-size:13px}.as-quote{border-radius:3px}.as-link{border-radius:3px}.as-link.tall .as-link-img{height:65px}.as-post:has(.as-photos){min-height:200px}\n.design-header{background:repeating-linear-gradient(45deg,#e6edf7 0 4px,#dce6f2 4px 6px)}.design-brand{font:700 42px Georgia}.design-nav{font:18px Georgia;color:#000043}.task-note{background:#ffffdf;margin:10px;padding:20px;font-size:21px;border:2px ridge #9ca7c1}.stage{margin:10px;border:3px ridge #b3bbd5}.as-head{background:#adbfed}.as-post{border-bottom:1px solid #7d83a0}.as-act{background:#e7e7ee;border:2px outset #dadce5;color:#000040}.as-av{border-radius:0;border:2px solid #00003b}.as-name{color:#0000bf}.design-footer{background:#efdff5;border:3px ridge #c0b0cb}.end-control{background:#d8dbe5;color:#000;border:2px outset #eee;font-family:Georgia}";
  function pixelPortrait(i) {
    const hair = ['#7b350d', '#e3a815', '#f2c12b'][i % 3];
    let art;
    if (i % 3 === 1) art = '<path fill="#141724" d="M4 2h4l4 5h3l5-5h3v17h-2v3H6v-3H3V3z"/><path fill="#ba8116" d="M5 4h2l5 6h4l5-6v14h-2v3H7v-3H5z"/><path fill="#f69cb1" d="M5 5h1l3 5H5zm15 0h1v5h-4z"/><path fill="#fff8dc" d="M8 16h3v-2h6v2h3v4h-3v2h-6v-2H8z"/><path fill="#101321" d="M7 12h2v3H7zm10 0h2v3h-2zm-5 4h3v2h-3zm1 3h1v2h-1z"/>';
    else art = '<path fill="#16131a" d="M7 2h10v2h4v3h2v14h-4v-2H7v2H3V8h2V4h2z"/><path fill="' + hair + '" d="M8 3h8v2h4v3h2v11h-3V9h-2V7h-4v2h-3v2H7v8H4V8h2V5h2z"/><path fill="#ffbd99" d="M10 9h3V7h2v2h3v3h2v6h-2v3h-7v-2H8v-6h2z"/><path fill="#101526" d="M11 12h1v3h-1zm6 0h1v3h-1zm-4 6h3v1h-3z"/><path fill="#151329" d="M10 21h7v2h4v2h2v2H3v-2h2v-2h5z"/><path fill="' + (i % 3 === 0 ? '#d29df1' : '#18963c') + '" d="M10 22h7v2h4v2H5v-2h5z"/><path fill="#ffe3c4" d="M12 21h3v3h-3z"/>';
    const detail = i % 3 === 1
      ? '<path fill="#e7b638" d="M7 10h3v2H7zm9 0h3v2h-3zM6 16h2v3H6z"/><path fill="#fff" d="M7 12h1v1H7zm10 0h1v1h-1z"/><path fill="#533210" d="M5 15h2v1H5zm14 0h2v1h-2z"/>'
      : '<path fill="' + (i % 3 === 0 ? '#a45318' : '#ffe760') + '" d="M8 5h7v1H8zM6 8h2v3H6zm13 2h2v5h-2z"/><path fill="#141522" d="M10 12h2v3h-2zm7 0h2v3h-2z"/><path fill="#fff" d="M10 12h1v1h-1zm7 0h1v1h-1z"/><path fill="#ed9a83" d="M9 16h2v1H9zm8 0h2v1h-2z"/>';
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 28" shape-rendering="crispEdges"><path fill="#bddcfc" d="M0 0h26v28H0z"/><path fill="#e9f7ff" d="M1 1h8v2H1zm19 4h5v5h-5zM1 22h3v5H1z"/>' + art + detail + '</svg>';
  }

  function archivalTime(age) {
    const match = /^(\d+)\s*([mhd])/.exec(age);
    if (!match) return 'Apr 28, 1996  ' + age + ' ago';
    const minutes = Number(match[1]) * ({ m: 1, h: 60, d: 1440 })[match[2]];
    const elapsed = 600 - minutes;
    const day = 28 + Math.floor(elapsed / 1440);
    const clock = ((elapsed % 1440) + 1440) % 1440;
    const hour = Math.floor(clock / 60);
    return 'Apr ' + day + ', 1996  ' + (hour % 12 || 12) + ':' + String(clock % 60).padStart(2, '0') + ' ' + (hour < 12 ? 'AM' : 'PM');
  }

  env.widget({
    task: 'use-social-feed',
    site: 'design-use-social-feed-one-01',
    name: 'design',
    split: 'train',
    scenarios: ['one'],
    template: 'use-social-feed/feed',
    design: {
      title: 'Community Feed',
      css: DESIGN_CSS,
      labels: true,
      labelClass: false,
      detail: false,
      inlineActs: false,
      avatarSheet: null,
      icons: {
        reply: '<path fill="#164acb" stroke="#061b64" stroke-width="1" d="M3 10l7-7v5h6v2h3v3h2v5h-2v2h-6v-3h4v-5h-7v5z"/><path stroke="#799cff" stroke-width="1" d="M5 10l4-4m2 3h5v2h3"/><path stroke="#eb477a" stroke-width="2" d="M8 21h5v-2"/>',
        retweet: '<path fill="#071e83" stroke="#001042" stroke-width=".5" d="M3 7l5-5 5 5H9v7H5V7zm7-4h9v9h3l-5 5-5-5h3V7h-5zm-5 13h4v3h5v3H5z"/><path stroke="#7390e1" stroke-width="1" d="M4 7l4-4m3 1h7"/>',
        like: '<path fill="#ed1237" stroke="#060921" stroke-width="1.5" d="M2 6h2V4h5v2h2v2h2V6h2V4h5v2h2v8h-2v2h-2v2h-2v2h-2v2h-2v-2h-2v-2H8v-2H6v-2H4v-2H2z"/><path stroke="#ff8da1" stroke-width="2" d="M5 7h3m-4 1v3"/>',
      },
      parts: {
        decorTabs: (base) => (R) => {
          base(R);
          const tabs = R.head.querySelectorAll('.as-tab:not(.popular)');
          tabs[0].textContent = 'Most Recent';
          tabs[1].classList.add('following');
        },
        headed: (base) => (R) => {
          base(R);
          R.util.el('div', 'as-tab popular', R.head, 'Popular');
        },
        liveTab: (base) => (R, k) => {
          const tab = base(R, k);
          if (k === 'following') tab.classList.add('following');
          return tab;
        },
        avatar: (base, S) => (R, row, post) => {
          const av = R.util.el('div', 'as-av', row, S.initials(post.name));
          av.textContent = '';
          const tile = R.handles.indexOf(post.handle) % 6;
          av.style.backgroundImage = 'url("data:image/svg+xml,' + encodeURIComponent(pixelPortrait(tile)) + '")';
          av.style.backgroundSize = '100% 100%';
          av.title = post.name;
          return av;
        },
        timeText: () => (R, post) => archivalTime(post.time),
        metaText: (base) => (R, meta, post, ...args) => {
          base(R, meta, post, ...args);
          meta.lastChild.title = post.time + ' ago';
        },
        actsMade: (base) => (R, acts, post) => {
          base(R, acts, post);
          const replies = R.util.el('span', 'as-replies', acts);
          const count = post.counts.reply || 0;
          replies.textContent = count + (count === 1 ? ' reply' : ' replies');
        },
        keepOf: () => (R, m) =>
          R.fd && R.builtKey && JSON.parse(R.builtKey)[0] === m.tab ? R.fd.feed.scrollTop : null,
        restoreScroll: () => (R, B, m, keep) => {
          B.feed.scrollTop = keep === null
            ? Math.round((m.scroll || 0) * Math.max(0, B.feed.scrollHeight - B.feed.clientHeight))
            : keep;
          B.lbx.set({});
        },
      },
    },
  });
})();
