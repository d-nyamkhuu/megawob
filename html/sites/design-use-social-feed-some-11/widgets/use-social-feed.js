// Keep the newspaper timeline, photo avatar previews, and its original action styling.
(function () {
  'use strict';
  const attachmentHosts = new WeakMap();
  const DESIGN_CSS="\n.as-app{left:0!important;right:0!important;top:0!important;bottom:0!important;width:auto!important;border:0;border-radius:0;box-shadow:none}.as-top{display:none}.as-body{min-height:0}.as-btn{border-radius:3px;font-size:14px}.as-pane{border-radius:0}.se-main{padding:17px 22px!important;gap:0}.se-col{width:100%;max-width:none}.se-side{display:none}.se-box{border-radius:3px;box-shadow:none;height:39px;padding:0 12px}.se-go{border-radius:3px;height:39px;padding:0 22px}.se-card{border-bottom:1px solid var(--line);padding:8px 8px 4px}.se-card .se-title{font-family:inherit;font-size:19px}.se-pager{justify-content:center}.se-pg{border-radius:2px;width:32px;min-width:32px;height:32px}.se-fav{width:22px;height:22px;border-radius:1px}.se-url{font-size:12px}.se-desc{font-size:14px}.tk-main{padding:18px 22px}.tk-title{font-size:24px}.tk-date{border-radius:0;background:transparent}.tk-row{gap:12px;border-bottom:1px solid var(--line);padding:0 12px}.tk-name{font-size:15px}.tk-price{font-size:18px;width:68px}.tk-buy{width:65px}.tk-when{width:125px}.tk-trigger{border-radius:0;min-width:175px}.fd-wrap.left{flex-direction:row}.fd-cart{width:28%!important;border-left:3px solid var(--fg);border-radius:0;background:var(--panel)}.fd-menu{padding:12px 18px}.fd-card{border-radius:0}.fd-add{border-radius:2px}.fd-order{border-radius:2px}.fd-rname{font-size:22px}.fd-rmeta{font-size:12px}.fd-dialog,.as-dialog{border-radius:4px}.fl-form{border-radius:0}.at-win{left:0!important;top:0!important;width:100%!important;height:100%!important;border-radius:0;box-shadow:none}.at-title{height:30px;border-radius:0;background:var(--header,var(--panel));font-size:14px}.at-rail{display:none}.at-body{flex:1;min-height:0}.at-main{min-width:0}.at-pane-h{border-radius:0}.at-explorer{width:46%!important;max-width:none}.at-preview{padding:10px}.at-tree{font-family:inherit}.at-row svg{color:var(--fg)}.at-ed{padding:0!important}.at-pagearea{background:var(--panel);padding:0!important}.at-sheet{border:0;box-shadow:none;background:var(--panel);margin:0!important;width:100%!important;max-width:none!important;padding:26px 32px!important}.at-sheet h2{font-family:inherit}.at-tb{border-radius:0;padding:10px;background:var(--header,var(--panel))}.at-tool{border-radius:3px;font-family:inherit}.at-status{background:var(--panel)}.at-term{border-radius:0;border:0}.at-tscroll{padding:20px;font:15px/1.5 monospace}.at-term-tabs{background:var(--header,var(--panel))}.as-page{inset:0!important;display:flex;justify-content:stretch!important}.as-rail,.as-side{display:none}.as-col{flex:1!important;width:100%!important;border:0}.as-head{height:43px;background:var(--header,var(--panel));font-size:14px}.as-post{padding:13px 18px;gap:14px;border-bottom:1px solid var(--line)}.as-text{font-size:16px;line-height:1.4}.as-av{width:48px;height:48px;border-radius:4px;font-size:17px}.as-acts{max-width:440px;justify-content:flex-start;gap:22px}.as-act{border-radius:3px;height:30px;font-size:14px;padding:0 8px}.as-act svg{width:20px;height:20px}.as-photos{height:100px!important;border-radius:4px}.as-menu{border-radius:3px;min-width:210px}.as-mi{height:35px;font-size:14px}.as-confirm{border-radius:4px}.as-confirm button{border-radius:3px}.as-track{border-radius:0;width:15px;background:var(--line)}.as-thumb{border-radius:0}.as-name{font-size:16px}.as-handle,.as-time{font-size:13px}.as-quote{border-radius:3px}.as-link{border-radius:3px}.as-link.tall .as-link-img{height:65px}.as-post:has(.as-photos){min-height:200px}\n.design-header{background:repeating-linear-gradient(45deg,#e6edf7 0 4px,#dce6f2 4px 6px)}.design-brand{font:700 42px Georgia}.design-nav{font:18px Georgia;color:#000043}.task-note{background:#ffffdf;margin:10px;padding:20px;font-size:21px;border:2px ridge #9ca7c1}.stage{margin:10px;border:3px ridge #b3bbd5}.as-head{background:#adbfed}.as-post{border-bottom:1px solid #7d83a0}.as-act{background:#e7e7ee;border:2px outset #dadce5;color:#000040}.as-av{border-radius:0;border:2px solid #00003b}.as-name{color:#0000bf}.design-footer{background:#efdff5;border:3px ridge #c0b0cb}.end-control{background:#d8dbe5;color:#000;border:2px outset #eee;font-family:Georgia}"

  env.widget({
    task: 'use-social-feed',
    site: 'design-use-social-feed-some-11',
    name: 'design',
    split: 'train',
    scenarios: ['some'],
    template: 'use-social-feed/feed',
    design: {
      layout: 'plain',
      title: 'Community Updates',
      labels: true,
      scenarioDecor: false,
      timeFormat: 'plain',
      avatarSheet: 'reference-photos.webp',
      photoSheet: 'reference-photos.webp',
      icons: {
        like: '<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z"/>',
      },
      siteCssLast: true,
      css: DESIGN_CSS,
      parts: {
        decorTabs: () => (R) => {
          const following = R.rng.bool(0.4);
          R.util.el('div', 'as-tab' + (following ? '' : ' on'), R.head, 'All Posts');
          R.util.el('div', 'as-tab' + (following ? ' on' : ''), R.head, 'Following');
          R.util.el('div', 'as-tab', R.head, 'Near You');
        },
        avatar: (base) => (R, row, post, ...args) => {
          const av = base(R, row, post, ...args);
          if (post.media || post.quote) {
            const attachments = R.util.el('div', 'as-attachments', av);
            av.tabIndex = 0;
            av.setAttribute('aria-label', post.name + ' — preview attached media');
            av.classList.add('has-attachments');
            attachmentHosts.set(row, attachments);
            const fitPreview = () => {
              const pane = row.parentElement.getBoundingClientRect();
              const portrait = av.getBoundingClientRect();
              attachments.style.maxHeight = Math.max(40, pane.height - 16) + 'px';
              const y = Math.max(pane.top + 8, Math.min(portrait.top, pane.bottom - attachments.offsetHeight - 8));
              attachments.style.top = y - row.getBoundingClientRect().top + 'px';
            };
            av.addEventListener('pointerenter', fitPreview);
            av.addEventListener('focus', fitPreview);
          }
          return av;
        },
        mediaHost: (base) => (R, main, row, post, ...args) => attachmentHosts.get(row) || base(R, main, row, post, ...args),
      },
    },
  });
})();
