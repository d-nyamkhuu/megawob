// Office ribbon styling with pixel avatars and dates from the site's 1989 timeline.
(function () {
  'use strict';
  const AVATAR_ART = (() => {
  function avatarArt(i) {
        const art = [
          '<path fill="#a0a39f" d="M7 29V9h3l9 8h11l8-8h3v21l-4 7-3 3v8H14v-7l-5-5z"/><path stroke="none" fill="#dbd9cf" d="M12 22h5v-4h14v4h5v13l-8 8H20l-9-9zM14 41h20v7H14"/><path stroke="none" fill="#ad8c8c" d="M10 13l5 7h-5M38 13l-5 7h5"/><path stroke="none" fill="#676c68" d="M20 18h3v9h-3M26 18h3v8h-3M12 24h6v3h-6M30 24h6v3h-6M9 30h7v3H9M32 30h7v3h-7M10 36h5v3h-5M34 36h4v3h-4M18 41h4v3h-4M28 43h3v3h-3"/><path stroke="none" fill="#c1b871" d="M15 27h5v3h-5M29 27h5v3h-5"/><path stroke="none" fill="#202521" d="M17 26h2v5h-2M30 26h2v5h-2M22 32h5v3h-5M24 35h1v3h-1M21 38h3v1h-3M25 38h3v1h-3"/><path stroke="none" fill="#f6f1e7" d="M17 34h6v3h-6M27 34h5v3h-5M19 39h10v3H19"/><path stroke="#73746d" stroke-width=".7" d="M17 34L7 32M17 36L6 37M31 34l10-2M31 36l11 2"/>',
          '<path fill="#966831" d="M12 14l5-4h15l5 4 6 7v11l-4 8h-6l-2 8H17l-3-9H8l-4-8V22z"/><path fill="#b58448" d="M15 15h18v21l-5 8h-8l-6-8z"/><path stroke="none" fill="#80552a" d="M7 23h5v14H7M36 21h5v16h-5M19 36h11v6H19M14 17h3v12h-3M31 17h3v12h-3"/><path stroke="none" fill="#151e21" d="M18 22h3v5h-3M29 22h3v5h-3M21 32h7v4h-7M24 36h1v5h-1M20 39h4v2h-4M26 39h4v2h-4"/><path stroke="none" fill="#ddd" d="M18 22h1v2h-1M29 22h1v2h-1"/><path fill="#488db0" d="M18 44h12v3H18"/>',
          '<path fill="#17732a" d="M23 25h4v23h-4M23 41l-10-7H9v6l14 6M27 38l9-6h4v6l-13 6"/><path stroke="none" fill="#f0bd32" d="M21 3h6v8l5-7 4 4-4 7 8-2 2 6-8 3 8 3-3 6-7-3 3 8-6 3-4-8-4 8-6-3 3-8-8 4-4-6 8-4-9-3 2-6 9 2-5-8 5-4 5 7z"/><path stroke="none" fill="#e8a923" d="M18 13h13v3h3v14h-3v3H18v-3h-3V16h3z"/><path fill="#65502e" d="M20 17h9v3h3v8h-3v3h-9v-3h-3v-8h3z"/><path stroke="none" fill="#7c6638" d="M21 20h7v7h-7"/>',
          '<path fill="#c6c8bb" d="M6 4h36v31H6zM3 39h42v7H3z"/><path fill="#252b29" d="M10 8h28v22H10z"/><path fill="#09831a" d="M13 11h22v16H13z"/><path fill="#06a400" d="M15 13h18v3H15"/><path fill="#666a65" d="M20 35h8v4h-8M7 42h19v2H7"/>'
        ];
        return '<svg viewBox="0 0 48 48" shape-rendering="crispEdges" stroke="#20262b" stroke-width="1">'+art[i % 4]+'</svg>';
      }
    return avatarArt;
  })();

  env.widget({
    task: 'use-social-feed',
    site: 'design-use-social-feed-one-05',
    name: 'design',
    split: 'train',
    scenarios: ['one'],
    template: 'use-social-feed/feed',
    design: {
      css: "\n.as-app{left:0!important;right:0!important;top:0!important;bottom:0!important;width:auto!important;border:0;border-radius:0;box-shadow:none}.as-top{display:none}.as-body{min-height:0}.as-btn{border-radius:3px;font-size:14px}.as-pane{border-radius:0}.se-main{padding:17px 22px!important;gap:0}.se-col{width:100%;max-width:none}.se-side{display:none}.se-box{border-radius:3px;box-shadow:none;height:39px;padding:0 12px}.se-go{border-radius:3px;height:39px;padding:0 22px}.se-card{border-bottom:1px solid var(--line);padding:8px 8px 4px}.se-card .se-title{font-family:inherit;font-size:19px}.se-pager{justify-content:center}.se-pg{border-radius:2px;width:32px;min-width:32px;height:32px}.se-fav{width:22px;height:22px;border-radius:1px}.se-url{font-size:12px}.se-desc{font-size:14px}.tk-main{padding:18px 22px}.tk-title{font-size:24px}.tk-date{border-radius:0;background:transparent}.tk-row{gap:12px;border-bottom:1px solid var(--line);padding:0 12px}.tk-name{font-size:15px}.tk-price{font-size:18px;width:68px}.tk-buy{width:65px}.tk-when{width:125px}.tk-trigger{border-radius:0;min-width:175px}.fd-wrap.left{flex-direction:row}.fd-cart{width:28%!important;border-left:3px solid var(--fg);border-radius:0;background:var(--panel)}.fd-menu{padding:12px 18px}.fd-card{border-radius:0}.fd-add{border-radius:2px}.fd-order{border-radius:2px}.fd-rname{font-size:22px}.fd-rmeta{font-size:12px}.fd-dialog,.as-dialog{border-radius:4px}.fl-form{border-radius:0}.at-win{left:0!important;top:0!important;width:100%!important;height:100%!important;border-radius:0;box-shadow:none}.at-title{height:30px;border-radius:0;background:var(--header,var(--panel));font-size:14px}.at-rail{display:none}.at-body{flex:1;min-height:0}.at-main{min-width:0}.at-pane-h{border-radius:0}.at-explorer{width:46%!important;max-width:none}.at-preview{padding:10px}.at-tree{font-family:inherit}.at-row svg{color:var(--fg)}.at-ed{padding:0!important}.at-pagearea{background:var(--panel);padding:0!important}.at-sheet{border:0;box-shadow:none;background:var(--panel);margin:0!important;width:100%!important;max-width:none!important;padding:26px 32px!important}.at-sheet h2{font-family:inherit}.at-tb{border-radius:0;padding:10px;background:var(--header,var(--panel))}.at-tool{border-radius:3px;font-family:inherit}.at-status{background:var(--panel)}.at-term{border-radius:0;border:0}.at-tscroll{padding:20px;font:15px/1.5 monospace}.at-term-tabs{background:var(--header,var(--panel))}.as-page{inset:0!important;display:flex;justify-content:stretch!important}.as-rail,.as-side{display:none}.as-col{flex:1!important;width:100%!important;border:0}.as-head{height:43px;background:var(--header,var(--panel));font-size:14px}.as-post{padding:13px 18px;gap:14px;border-bottom:1px solid var(--line)}.as-text{font-size:16px;line-height:1.4}.as-av{width:48px;height:48px;border-radius:4px;font-size:17px}.as-acts{max-width:440px;justify-content:flex-start;gap:22px}.as-act{border-radius:3px;height:30px;font-size:14px;padding:0 8px}.as-act svg{width:20px;height:20px}.as-photos{height:100px!important;border-radius:4px}.as-menu{border-radius:3px;min-width:210px}.as-mi{height:35px;font-size:14px}.as-confirm{border-radius:4px}.as-confirm button{border-radius:3px}.as-track{border-radius:0;width:15px;background:var(--line)}.as-thumb{border-radius:0}.as-name{font-size:16px}.as-handle,.as-time{font-size:13px}.as-quote{border-radius:3px}.as-link{border-radius:3px}.as-link.tall .as-link-img{height:65px}.as-post:has(.as-photos){min-height:200px}\n.design-header{background:linear-gradient(#a5bed6,#e1effc)}.site-shell{grid-template-rows:100px minmax(0,1fr) 55px}.design-header{align-items:flex-start;padding-top:13px;position:relative}.design-header:after{content:\"Refresh       New Post       Open       Save       Search       Filter       Mark Read       Favorite       Settings\";position:absolute;bottom:12px;left:25px;color:#133c6d;font:16px Arial}.bottom .task-note{background:#deefff;font-size:26px}.as-post{display:flex;padding:12px}.as-main{position:relative;padding-right:280px}.as-acts{position:absolute;right:0;bottom:0;gap:12px}.as-text{font-size:14px}.as-photos{height:80px!important}.end-control{background:linear-gradient(#38b2ff,#0379d9)}\n.as-main{padding-right:0!important}.as-acts{position:static!important;justify-content:flex-start;gap:18px}.as-text{margin-bottom:8px}.as-post{min-height:0!important}.as-more{position:static!important}\n",
      icons: {
    reply: '<path fill="#d4d4df" d="M10 3L2 11l8 8v-6h5c4 0 6 4 7 8v-7c0-5-4-7-12-7z"/>',
    retweet: '<path fill="#d4d4df" d="M2 8l5-6 5 6H9v12h8v3H6V8zM12 2h9v13h3l-5 6-5-6h4V5h-6z"/>',
    like: '<path fill="#d4d4df" d="M2 5l4-2h3l3 3 3-3h3l4 2v6L12 22 2 11z"/>',
      },
      parts: {
        headed: () => (R) => {
          if (R.live) document.querySelector('.ro-tools').append(R.head);
          else R.head.classList.add('decorative');
        },
        avatar: (base, S) => (R, row, post, ...args) => {
          const av = base(R, row, post, ...args);
          av.textContent = '';
          av.innerHTML = AVATAR_ART(R.handles.indexOf(post.handle));
          av.style.background = '#53769f';
          av.title = post.name;
          return av;
        },
        restoreScroll: () => (R, B, m, keep) => {
          B.feed.scrollTop = keep || Math.round(Math.max(0, B.feed.scrollHeight - B.feed.clientHeight) * (m.scroll || 0));
          B.lbx.set({});
        },
        actions: (base, S) => (R, main, post, p, parts, row) => {
          const { util, F } = R;
          const acts = util.el('div', 'as-acts', main);
          parts.acts = {};
          parts.counts = {};
          for (const b of F.helpers.BUTTONS) {
            const btn = util.el('button', `as-act ${b}`, acts);
            btn.type = 'button';
            btn.title = F.helpers.LABELS[b];
            btn.setAttribute('aria-label', F.helpers.LABELS[b]);
            btn.dataset.role = b;
            btn.innerHTML = S.svg(S.ICON[b]);
            btn.classList.add('has-label');
            util.el('span', 'as-action-label', btn, F.helpers.LABELS[b]);
            if (b !== 'share') parts.counts[b] = util.el('span', 'as-count count-' + b, acts);
            const key = F.helpers.keyOf(p, b);
            btn.addEventListener('click', () => { R.up({ toggle: key }); R.paint(); });
            parts.acts[b] = btn;
          }
          return acts;
        },
        paintStart: (base) => (R, m) => {
          const { spec, F } = R;
          const target = spec.targets[0];
          const post = spec.posts[target];
          const action = spec.action;
          document.querySelector('.detail-target-author').textContent = 'The post is by ' + post.handle + '.';
          document.querySelector('.detail-post-starts-with').textContent = 'It starts with \"' + (spec.phrase || post.text.slice(0, 70)) + '\".';
          document.querySelector('.detail-action').textContent = 'Use the mouse to click ' + (F.helpers.LABELS[action] || action) + ' on the correct post.';
          const ds = document.querySelector('.detail-status');
          const ok = m.on.length !== spec.start.length || m.on.some((k) => !spec.start.includes(k));
          ds.textContent = ok ? 'In progress' : 'Not completed';
          ds.style.color = ok ? '#b36b00' : '#d00000';
          document.querySelector('.detail-caution').textContent = action === 'reply' ? 'Do not like or retweet.' : 'Do not change other actions.';
        },
        timeText: () => (R, post) => {
          const age = post.time;
          const n = parseInt(age, 10) || 0;
          const minutes = n * (age.includes('h') ? 60 : age.includes('d') ? 1440 : 1);
          const t = (((624 - minutes) % 1440) + 1440) % 1440;
          return '12 Jun 1989  ' + String(Math.floor(t / 60)).padStart(2, '0') + ':' + String(t % 60).padStart(2, '0');
        },
      },
    },
  });
})();
