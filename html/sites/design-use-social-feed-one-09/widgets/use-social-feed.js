// Office ribbon frame, the dated feed cards, and their fixed row sizing.
env.widget({
  task: 'use-social-feed',
  site: 'design-use-social-feed-one-09',
  name: 'design',
  split: 'train',
  scenarios: ['one'],
  template: 'use-social-feed/feed',
  design: {
    icons: {
      retweet: '<path d="M1.5 8.5L5.5 4l4 4.5M5.5 4v13a3 3 0 0 0 3 3h5M14 4h4a3 3 0 0 1 3 3v13M17 15.5l4 4.5 3-4.5"/>',
      like: '<path d="M12 21s-9-5.5-9-12A5.1 5.1 0 0 1 12 6.5 5.1 5.1 0 0 1 21 9c0 6.5-9 12-9 12z"/>',
      share: '<path d="M12 14V3"/><path d="M7 8l5-5 5 5"/><path d="M4 12v8h16v-8"/>',
    },
    css: "\n.as-app{left:0!important;right:0!important;top:0!important;bottom:0!important;width:auto!important;border:0;border-radius:0;box-shadow:none}.as-top{display:none}.as-body{min-height:0}.as-btn{border-radius:3px;font-size:14px}.as-pane{border-radius:0}.se-main{padding:17px 22px!important;gap:0}.se-col{width:100%;max-width:none}.se-side{display:none}.se-box{border-radius:3px;box-shadow:none;height:39px;padding:0 12px}.se-go{border-radius:3px;height:39px;padding:0 22px}.se-card{border-bottom:1px solid var(--line);padding:8px 8px 4px}.se-card .se-title{font-family:inherit;font-size:19px}.se-pager{justify-content:center}.se-pg{border-radius:2px;width:32px;min-width:32px;height:32px}.se-fav{width:22px;height:22px;border-radius:1px}.se-url{font-size:12px}.se-desc{font-size:14px}.tk-main{padding:18px 22px}.tk-title{font-size:24px}.tk-date{border-radius:0;background:transparent}.tk-row{gap:12px;border-bottom:1px solid var(--line);padding:0 12px}.tk-name{font-size:15px}.tk-price{font-size:18px;width:68px}.tk-buy{width:65px}.tk-when{width:125px}.tk-trigger{border-radius:0;min-width:175px}.fd-wrap.left{flex-direction:row}.fd-cart{width:28%!important;border-left:3px solid var(--fg);border-radius:0;background:var(--panel)}.fd-menu{padding:12px 18px}.fd-card{border-radius:0}.fd-add{border-radius:2px}.fd-order{border-radius:2px}.fd-rname{font-size:22px}.fd-rmeta{font-size:12px}.fd-dialog,.as-dialog{border-radius:4px}.fl-form{border-radius:0}.at-win{left:0!important;top:0!important;width:100%!important;height:100%!important;border-radius:0;box-shadow:none}.at-title{height:30px;border-radius:0;background:var(--header,var(--panel));font-size:14px}.at-rail{display:none}.at-body{flex:1;min-height:0}.at-main{min-width:0}.at-pane-h{border-radius:0}.at-explorer{width:46%!important;max-width:none}.at-preview{padding:10px}.at-tree{font-family:inherit}.at-row svg{color:var(--fg)}.at-ed{padding:0!important}.at-pagearea{background:var(--panel);padding:0!important}.at-sheet{border:0;box-shadow:none;background:var(--panel);margin:0!important;width:100%!important;max-width:none!important;padding:26px 32px!important}.at-sheet h2{font-family:inherit}.at-tb{border-radius:0;padding:10px;background:var(--header,var(--panel))}.at-tool{border-radius:3px;font-family:inherit}.at-status{background:var(--panel)}.at-term{border-radius:0;border:0}.at-tscroll{padding:20px;font:15px/1.5 monospace}.at-term-tabs{background:var(--header,var(--panel))}.as-page{inset:0!important;display:flex;justify-content:stretch!important}.as-rail,.as-side{display:none}.as-col{flex:1!important;width:100%!important;border:0}.as-head{height:43px;background:var(--header,var(--panel));font-size:14px}.as-post{padding:13px 18px;gap:14px;border-bottom:1px solid var(--line)}.as-text{font-size:16px;line-height:1.4}.as-av{width:48px;height:48px;border-radius:4px;font-size:17px}.as-acts{max-width:440px;justify-content:flex-start;gap:22px}.as-act{border-radius:3px;height:30px;font-size:14px;padding:0 8px}.as-act svg{width:20px;height:20px}.as-photos{height:100px!important;border-radius:4px}.as-menu{border-radius:3px;min-width:210px}.as-mi{height:35px;font-size:14px}.as-confirm{border-radius:4px}.as-confirm button{border-radius:3px}.as-track{border-radius:0;width:15px;background:var(--line)}.as-thumb{border-radius:0}.as-name{font-size:16px}.as-handle,.as-time{font-size:13px}.as-quote{border-radius:3px}.as-link{border-radius:3px}.as-link.tall .as-link-img{height:65px}.as-post:has(.as-photos){min-height:200px}\n.design-header{background:linear-gradient(#a5bed6,#e1effc)}.site-shell{grid-template-rows:100px minmax(0,1fr) 55px}.design-header{align-items:flex-start;padding-top:13px;position:relative}.design-header:after{content:\"Refresh       New Post       Open       Save       Search       Filter       Mark Read       Favorite       Settings\";position:absolute;bottom:12px;left:25px;color:#133c6d;font:16px Arial}.bottom .task-note{background:#deefff;font-size:26px}.as-post{display:flex;padding:12px}.as-main{position:relative;padding-right:280px}.as-acts{position:absolute;right:0;bottom:0;gap:12px}.as-text{font-size:14px}.as-photos{height:80px!important}.end-control{background:linear-gradient(#38b2ff,#0379d9)}\n.as-main{padding-right:0!important}.as-acts{position:static!important;justify-content:flex-start;gap:18px}.as-text{margin-bottom:8px}.as-post{min-height:0!important}.as-more{position:static!important}\n",
    parts: {
      showMore: (_base) => (R, hosts, p) => {
        const sm = R.util.el('span', 'as-showmore', hosts.main, 'Show more');
        sm.dataset.role = 'showmore';
        sm.addEventListener('click', () => { R.up({ expand: p }); R.paint(); });
        return sm;
      },
      actLabel: (_base) => (R, btn, b, p, post, parts) => {
        btn.classList.add('has-label');
        R.util.el('em', 'as-lbl', btn, R.F.helpers.LABELS[b]);
        if (b !== 'share') parts.counts[b] = R.util.el('span', 'as-cnt', btn);
      },
      headed: (base) => (R) => {
        base(R);
        if (!R.live) R.head.classList.add('decorative');
      },
      feedMade: (base) => (R, B, m) => {
        base(R, B, m);
        B.feed.style.setProperty('--as-row-height', Math.max(1, Math.floor(R.box.clientHeight * 0.75)) + 'px');
      },
      keepOf: (_base) => (R, m) =>
        R.fd && R.builtKey && JSON.parse(R.builtKey)[0] === m.tab ? R.fd.feed.scrollTop : null,
      restoreScroll: (_base) => (R, B, m, keep) => {
        if (keep === null && m.scroll > 0) {
          let lo = 0, hi = Math.max(0, B.feed.scrollHeight - B.feed.clientHeight);
          for (let i = 0; i < 20; i++) {
            const mid = (lo + hi) / 2;
            B.feed.scrollTop = mid;
            if (B.lbx.scrollIndex() < m.scroll) lo = mid;
            else hi = mid;
          }
          B.feed.scrollTop = hi;
        } else B.feed.scrollTop = keep || 0;
        B.lbx.set({});
      },
    },
  },
});
