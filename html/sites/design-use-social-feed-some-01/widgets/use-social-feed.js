// Preserve the single-column civic service layout, photo assets, and action labels.
(function () {
  'use strict';
  const DESIGN_CSS = "\n.as-app{left:0!important;right:0!important;top:0!important;bottom:0!important;width:auto!important;border:0;border-radius:0;box-shadow:none}.as-top{display:none}.as-body{min-height:0}.as-btn{border-radius:3px;font-size:14px}.as-pane{border-radius:0}.se-main{padding:17px 22px!important;gap:0}.se-col{width:100%;max-width:none}.se-side{display:none}.se-box{border-radius:3px;box-shadow:none;height:39px;padding:0 12px}.se-go{border-radius:3px;height:39px;padding:0 22px}.se-card{border-bottom:1px solid var(--line);padding:8px 8px 4px}.se-card .se-title{font-family:inherit;font-size:19px}.se-pager{justify-content:center}.se-pg{border-radius:2px;width:32px;min-width:32px;height:32px}.se-fav{width:22px;height:22px;border-radius:1px}.se-url{font-size:12px}.se-desc{font-size:14px}.tk-main{padding:18px 22px}.tk-title{font-size:24px}.tk-date{border-radius:0;background:transparent}.tk-row{gap:12px;border-bottom:1px solid var(--line);padding:0 12px}.tk-name{font-size:15px}.tk-price{font-size:18px;width:68px}.tk-buy{width:65px}.tk-when{width:125px}.tk-trigger{border-radius:0;min-width:175px}.fd-wrap.left{flex-direction:row}.fd-cart{width:28%!important;border-left:3px solid var(--fg);border-radius:0;background:var(--panel)}.fd-menu{padding:12px 18px}.fd-card{border-radius:0}.fd-add{border-radius:2px}.fd-order{border-radius:2px}.fd-rname{font-size:22px}.fd-rmeta{font-size:12px}.fd-dialog,.as-dialog{border-radius:4px}.fl-form{border-radius:0}.at-win{left:0!important;top:0!important;width:100%!important;height:100%!important;border-radius:0;box-shadow:none}.at-title{height:30px;border-radius:0;background:var(--header,var(--panel));font-size:14px}.at-rail{display:none}.at-body{flex:1;min-height:0}.at-main{min-width:0}.at-pane-h{border-radius:0}.at-explorer{width:46%!important;max-width:none}.at-preview{padding:10px}.at-tree{font-family:inherit}.at-row svg{color:var(--fg)}.at-ed{padding:0!important}.at-pagearea{background:var(--panel);padding:0!important}.at-sheet{border:0;box-shadow:none;background:var(--panel);margin:0!important;width:100%!important;max-width:none!important;padding:26px 32px!important}.at-sheet h2{font-family:inherit}.at-tb{border-radius:0;padding:10px;background:var(--header,var(--panel))}.at-tool{border-radius:3px;font-family:inherit}.at-status{background:var(--panel)}.at-term{border-radius:0;border:0}.at-tscroll{padding:20px;font:15px/1.5 monospace}.at-term-tabs{background:var(--header,var(--panel))}.as-page{inset:0!important;display:flex;justify-content:stretch!important}.as-rail,.as-side{display:none}.as-col{flex:1!important;width:100%!important;border:0}.as-head{height:43px;background:var(--header,var(--panel));font-size:14px}.as-post{padding:13px 18px;gap:14px;border-bottom:1px solid var(--line)}.as-text{font-size:16px;line-height:1.4}.as-av{width:48px;height:48px;border-radius:4px;font-size:17px}.as-acts{max-width:440px;justify-content:flex-start;gap:22px}.as-act{border-radius:3px;height:30px;font-size:14px;padding:0 8px}.as-act svg{width:20px;height:20px}.as-photos{height:100px!important;border-radius:4px}.as-menu{border-radius:3px;min-width:210px}.as-mi{height:35px;font-size:14px}.as-confirm{border-radius:4px}.as-confirm button{border-radius:3px}.as-track{border-radius:0;width:15px;background:var(--line)}.as-thumb{border-radius:0}.as-name{font-size:16px}.as-handle,.as-time{font-size:13px}.as-quote{border-radius:3px}.as-link{border-radius:3px}.as-link.tall .as-link-img{height:65px}.as-post:has(.as-photos){min-height:200px}\n.design-header{background:#21496f;color:#fff}.design-brand{font-size:25px}.design-nav{color:#fff}.task-note{margin:14px 23px;background:#e1f0ff;border:1px solid #c1dbf4;font-size:29px;border-radius:3px;padding:15px 22px}.as-head{display:none}.as-post{position:relative;margin:7px 24px;padding:11px;border:1px solid #d4dfea;border-radius:4px;min-height:82px}.as-av{border-radius:50%}.as-main{padding-right:300px}.as-acts{position:absolute;right:50px;top:31px;gap:10px}.as-act{border:1px solid #6080aa;color:#0e254b;padding:0 12px}.as-text{font-size:14px}.as-more{position:absolute;right:14px;top:10px}.end-control{background:#214a77;width:100%}.design-footer .footer-label{display:none}";

  env.widget({
    task: 'use-social-feed',
    site: 'design-use-social-feed-some-01',
    name: 'design',
    split: 'train',
    scenarios: ['some'],
    template: 'use-social-feed/feed',
    design: {
      layout: 'plain',
      scenarioDecor: false,
      labels: true,
      icons: {
        like: '<path d="M12 21S2 14.8 2 8.8A5.3 5.3 0 0 1 12 6 5.3 5.3 0 0 1 22 8.8C22 14.8 12 21 12 21z"/>',
        reply: '<path d="M3 11.5a9 9 0 1 1 5 8L2.5 22l1.6-5.2A9 9 0 0 1 3 11.5z"/>',
      },
      actLabels: { reply: 'Comment' },
      timeFormat: 'plain',
      avatarSheet: 'reference-photos.webp',
      photoSheet: 'reference-photos.webp',
      siteCssLast: true,
      css: DESIGN_CSS + "\n.as-post{min-height:0!important}\n",
      parts: {
        page: () => (R) => {
          const { util, rng } = R;
          const page = util.el('div', 'as-page', R.ctx.stage);
          page.style.setProperty('--as-fs', rng.pick(['15px', '15px', '14.5px']));
          page.style.setProperty('--as-pad', rng.int(10, 14) + 'px');
          page.style.setProperty('--as-ph', rng.int(118, 150) + 'px');
          return page;
        },
        atEnd: () => (R, sentinelBox, top0, h) => sentinelBox.top < top0 + h - 1,
        restoreScroll: () => (R, B, m, keep, first) => {
          B.feed.scrollTop = keep;
          if (first && m.scroll > 0) {
            const entries = [...B.rows.values()];
            const i = Math.min(Math.floor(m.scroll), entries.length - 1);
            if (i >= 0) {
              const start = entries[0].getBoundingClientRect().top;
              const row = entries[i].getBoundingClientRect();
              const next = entries[i + 1];
              const stride = next ? next.getBoundingClientRect().top - row.top : row.height;
              B.feed.scrollTop = row.top - start + (m.scroll - i) * stride;
            }
          }
          B.lbx.set({});
        },
      },
    },
  });
})();
