// Design of this site on the use-social-feed/feed template (templates/use-social-feed/feed.js): a GEM-style desktop window
// (title bar, no rail or sidebar), pixel-art portraits and timestamps against a fixed 1986 clock.
(function () {
  'use strict';
  // Only the three decorative portrait tiles are sampled from the supplied artwork.
  const GEM_ART_URL = new URL('../assets/gem-artwork.webp', document.currentScript.src).href;
  const DESIGN_CSS = "\n.as-app{left:0!important;right:0!important;top:0!important;bottom:0!important;width:auto!important;border:0;border-radius:0;box-shadow:none}.as-top{display:none}.as-body{min-height:0}.as-btn{border-radius:3px;font-size:14px}.as-pane{border-radius:0}.se-main{padding:17px 22px!important;gap:0}.se-col{width:100%;max-width:none}.se-side{display:none}.se-box{border-radius:3px;box-shadow:none;height:39px;padding:0 12px}.se-go{border-radius:3px;height:39px;padding:0 22px}.se-card{border-bottom:1px solid var(--line);padding:8px 8px 4px}.se-card .se-title{font-family:inherit;font-size:19px}.se-pager{justify-content:center}.se-pg{border-radius:2px;width:32px;min-width:32px;height:32px}.se-fav{width:22px;height:22px;border-radius:1px}.se-url{font-size:12px}.se-desc{font-size:14px}.tk-main{padding:18px 22px}.tk-title{font-size:24px}.tk-date{border-radius:0;background:transparent}.tk-row{gap:12px;border-bottom:1px solid var(--line);padding:0 12px}.tk-name{font-size:15px}.tk-price{font-size:18px;width:68px}.tk-buy{width:65px}.tk-when{width:125px}.tk-trigger{border-radius:0;min-width:175px}.fd-wrap.left{flex-direction:row}.fd-cart{width:28%!important;border-left:3px solid var(--fg);border-radius:0;background:var(--panel)}.fd-menu{padding:12px 18px}.fd-card{border-radius:0}.fd-add{border-radius:2px}.fd-order{border-radius:2px}.fd-rname{font-size:22px}.fd-rmeta{font-size:12px}.fd-dialog,.as-dialog{border-radius:4px}.fl-form{border-radius:0}.at-win{left:0!important;top:0!important;width:100%!important;height:100%!important;border-radius:0;box-shadow:none}.at-title{height:30px;border-radius:0;background:var(--header,var(--panel));font-size:14px}.at-rail{display:none}.at-body{flex:1;min-height:0}.at-main{min-width:0}.at-pane-h{border-radius:0}.at-explorer{width:46%!important;max-width:none}.at-preview{padding:10px}.at-tree{font-family:inherit}.at-row svg{color:var(--fg)}.at-ed{padding:0!important}.at-pagearea{background:var(--panel);padding:0!important}.at-sheet{border:0;box-shadow:none;background:var(--panel);margin:0!important;width:100%!important;max-width:none!important;padding:26px 32px!important}.at-sheet h2{font-family:inherit}.at-tb{border-radius:0;padding:10px;background:var(--header,var(--panel))}.at-tool{border-radius:3px;font-family:inherit}.at-status{background:var(--panel)}.at-term{border-radius:0;border:0}.at-tscroll{padding:20px;font:15px/1.5 monospace}.at-term-tabs{background:var(--header,var(--panel))}.as-page{inset:0!important;display:flex;justify-content:stretch!important}.as-rail,.as-side{display:none}.as-col{flex:1!important;width:100%!important;border:0}.as-head{height:43px;background:var(--header,var(--panel));font-size:14px}.as-post{padding:13px 18px;gap:14px;border-bottom:1px solid var(--line)}.as-text{font-size:16px;line-height:1.4}.as-av{width:48px;height:48px;border-radius:4px;font-size:17px}.as-acts{max-width:440px;justify-content:flex-start;gap:22px}.as-act{border-radius:3px;height:30px;font-size:14px;padding:0 8px}.as-act svg{width:20px;height:20px}.as-photos{height:100px!important;border-radius:4px}.as-menu{border-radius:3px;min-width:210px}.as-mi{height:35px;font-size:14px}.as-confirm{border-radius:4px}.as-confirm button{border-radius:3px}.as-track{border-radius:0;width:15px;background:var(--line)}.as-thumb{border-radius:0}.as-name{font-size:16px}.as-handle,.as-time{font-size:13px}.as-quote{border-radius:3px}.as-link{border-radius:3px}.as-link.tall .as-link-img{height:65px}.as-post:has(.as-photos){min-height:200px}\n.design-header{background:#fff;color:#000;border-bottom:4px solid #000}.design-brand{font-size:25px}.design-nav{font-size:18px;color:#000}.task-note{border:5px double #000;margin:5px;background:#fff;font-size:23px}.stage{border:5px double #000;margin:5px}.as-head{background:repeating-linear-gradient(45deg,#fff 0 1px,#bbb 1px 2px)}.as-av{border:2px solid #000;border-radius:0!important;filter:grayscale(1);background-color:#fff!important;color:#000}.as-post{border-bottom:2px solid #000;min-height:200px}.as-menu{border:2px solid #000;box-shadow:4px 4px #888}.as-mi{font-size:17px}.as-act{font-size:16px;color:#000}.end-control{background:#fff;color:#000;border:5px double #000;border-radius:0}.as-photos{filter:grayscale(1)}";

  // Display the seeded age against the fixed GEM desktop clock, without wall-clock time.
  function gemTimestamp(age) {
    const parts = /^(\d+)\s*([mhd])$/.exec(String(age));
    if (!parts) return `Mon 27 Jan 1986  \u00b7 ${age}`;
    const elapsed = Number(parts[1]) * ({ m: 1, h: 60, d: 1440 }[parts[2]]);
    const minutes = 10 * 60 + 24 - elapsed;
    const dayOffset = Math.floor(minutes / 1440);
    const day = 27 + dayOffset;
    if (day < 1) return `Jan 1986  \u00b7 ${age}`;
    const clock = ((minutes % 1440) + 1440) % 1440;
    const weekday = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][((dayOffset % 7) + 7) % 7];
    return `${weekday} ${String(day).padStart(2, '0')} Jan 1986  ${String(Math.floor(clock / 60)).padStart(2, '0')}:${String(clock % 60).padStart(2, '0')}`;
  }

  env.widget({
    task: 'use-social-feed',
    site: 'design-use-social-feed-menu-12',
    name: 'design',
    split: 'train',
    scenarios: ['menu'],
    template: 'use-social-feed/feed',
    design: {
      css: DESIGN_CSS,
      siteCssLast: true,
      layout: 'plain',
      icons: {
        reply: '<path d="M3 3h18v15h-8l-5 4v-4H3z"/>',
        retweet: '<path d="M2 8l4-4 4 4M6 4v15h9M10 4h9v15M15 15l4 4 4-4"/>',
        like: '<path d="M12 6L9 3H5L2 6v5l10 10 10-10V6l-3-3h-4z"/>',
        more: '<path d="M2 10h4v4H2zM10 10h4v4h-4zM18 10h4v4h-4z" fill="currentColor" stroke="none"/>',
        copy: '<path d="M5 2h10l5 5v15H5zM15 2v6h5M8 11h9M8 15h9M8 19h9"/>',
      },
      labels: false,
      countZero: true,
      photoSheet: 'reference-photos.webp',
      menuBounds: 'column',
      parts: {
        begin: () => (R) => {
          const bar = R.util.el('div', 'gem-title', R.ctx.stage);
          R.util.el('span', 'gem-gadget', bar).innerHTML = '<svg viewBox="0 0 24 24"><path d="M5 3h5v3h4V3h5v5h-3v3h3v5h-5v-3h-4v6H5v-7h3V8H5z"/></svg>';
          R.util.el('span', 'gem-caption', bar, 'SocialST  -  Timeline');
          R.util.el('span', 'gem-stripes', bar);
          R.util.el('span', 'gem-gadget', bar).innerHTML = '<svg viewBox="0 0 24 24"><path d="M3 3h8v3H6v5H3zM13 3h8v8h-3V6h-5zM3 13h3v5h5v3H3zM18 13h3v8h-8v-3h5zM9 9h6v6H9z"/></svg>';
        },
        avatar: (base, S) => (R, row, post) => {
          const av = R.util.el('div', 'as-av', row, S.initials(post.name));
          const avatarTile = R.handles.indexOf(post.handle) % 3;
          av.innerHTML = `<svg viewBox="69 ${[246, 420, 593][avatarTile]} 93 91" preserveAspectRatio="none"><image href="${GEM_ART_URL}" width="1672" height="941"/></svg>`;
          av.title = post.name;
          return av;
        },
        timeText: () => (R, post) => gemTimestamp(post.time),
      },
    },
  });
})();
