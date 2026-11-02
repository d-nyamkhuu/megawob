// Preserves the Office ribbon styling, photo assets, and one/reply feed behavior for this site.
(function () {
  'use strict';
  const PHOTO_URL = new URL('../assets/reference-photos.webp', document.currentScript.src).href;
  const DESIGN_CSS = "\n.as-app{left:0!important;right:0!important;top:0!important;bottom:0!important;width:auto!important;border:0;border-radius:0;box-shadow:none}.as-top{display:none}.as-body{min-height:0}.as-btn{border-radius:3px;font-size:14px}.as-pane{border-radius:0}.se-main{padding:17px 22px!important;gap:0}.se-col{width:100%;max-width:none}.se-side{display:none}.se-box{border-radius:3px;box-shadow:none;height:39px;padding:0 12px}.se-go{border-radius:3px;height:39px;padding:0 22px}.se-card{border-bottom:1px solid var(--line);padding:8px 8px 4px}.se-card .se-title{font-family:inherit;font-size:19px}.se-pager{justify-content:center}.se-pg{border-radius:2px;width:32px;min-width:32px;height:32px}.se-fav{width:22px;height:22px;border-radius:1px}.se-url{font-size:12px}.se-desc{font-size:14px}.tk-main{padding:18px 22px}.tk-title{font-size:24px}.tk-date{border-radius:0;background:transparent}.tk-row{gap:12px;border-bottom:1px solid var(--line);padding:0 12px}.tk-name{font-size:15px}.tk-price{font-size:18px;width:68px}.tk-buy{width:65px}.tk-when{width:125px}.tk-trigger{border-radius:0;min-width:175px}.fd-wrap.left{flex-direction:row}.fd-cart{width:28%!important;border-left:3px solid var(--fg);border-radius:0;background:var(--panel)}.fd-menu{padding:12px 18px}.fd-card{border-radius:0}.fd-add{border-radius:2px}.fd-order{border-radius:2px}.fd-rname{font-size:22px}.fd-rmeta{font-size:12px}.fd-dialog,.as-dialog{border-radius:4px}.fl-form{border-radius:0}.at-win{left:0!important;top:0!important;width:100%!important;height:100%!important;border-radius:0;box-shadow:none}.at-title{height:30px;border-radius:0;background:var(--header,var(--panel));font-size:14px}.at-rail{display:none}.at-body{flex:1;min-height:0}.at-main{min-width:0}.at-pane-h{border-radius:0}.at-explorer{width:46%!important;max-width:none}.at-preview{padding:10px}.at-tree{font-family:inherit}.at-row svg{color:var(--fg)}.at-ed{padding:0!important}.at-pagearea{background:var(--panel);padding:0!important}.at-sheet{border:0;box-shadow:none;background:var(--panel);margin:0!important;width:100%!important;max-width:none!important;padding:26px 32px!important}.at-sheet h2{font-family:inherit}.at-tb{border-radius:0;padding:10px;background:var(--header,var(--panel))}.at-tool{border-radius:3px;font-family:inherit}.at-status{background:var(--panel)}.at-term{border-radius:0;border:0}.at-tscroll{padding:20px;font:15px/1.5 monospace}.at-term-tabs{background:var(--header,var(--panel))}.as-page{inset:0!important;display:flex;justify-content:stretch!important}.as-rail,.as-side{display:none}.as-col{flex:1!important;width:100%!important;border:0}.as-head{height:43px;background:var(--header,var(--panel));font-size:14px}.as-post{padding:13px 18px;gap:14px;border-bottom:1px solid var(--line)}.as-text{font-size:16px;line-height:1.4}.as-av{width:48px;height:48px;border-radius:4px;font-size:17px}.as-acts{max-width:440px;justify-content:flex-start;gap:22px}.as-act{border-radius:3px;height:30px;font-size:14px;padding:0 8px}.as-act svg{width:20px;height:20px}.as-photos{height:100px!important;border-radius:4px}.as-menu{border-radius:3px;min-width:210px}.as-mi{height:35px;font-size:14px}.as-confirm{border-radius:4px}.as-confirm button{border-radius:3px}.as-track{border-radius:0;width:15px;background:var(--line)}.as-thumb{border-radius:0}.as-name{font-size:16px}.as-handle,.as-time{font-size:13px}.as-quote{border-radius:3px}.as-link{border-radius:3px}.as-link.tall .as-link-img{height:65px}.as-post:has(.as-photos){min-height:200px}\n.design-header{background:linear-gradient(#a5bed6,#e1effc)}.site-shell{grid-template-rows:100px minmax(0,1fr) 55px}.design-header{align-items:flex-start;padding-top:13px;position:relative}.design-header:after{content:\"Refresh       New Post       Open       Save       Search       Filter       Mark Read       Favorite       Settings\";position:absolute;bottom:12px;left:25px;color:#133c6d;font:16px Arial}.bottom .task-note{background:#deefff;font-size:26px}.as-post{display:flex;padding:12px}.as-main{position:relative;padding-right:280px}.as-acts{position:absolute;right:0;bottom:0;gap:12px}.as-text{font-size:14px}.as-photos{height:80px!important}.end-control{background:linear-gradient(#38b2ff,#0379d9)}\n.as-main{padding-right:0!important}.as-acts{position:static!important;justify-content:flex-start;gap:18px}.as-text{margin-bottom:8px}.as-post{min-height:0!important}.as-more{position:static!important}\n";
  env.widget({
    task: 'use-social-feed',
    site: 'design-use-social-feed-one-04',
    name: 'design',
    split: 'train',
    scenarios: ['one', 'reply'],
    traits: { simpleFeed: true },
    template: 'use-social-feed/feed',
    design: {
      layout: 'plain',
      siteCssLast: true,
      inlineActs: false,
      detail: true,
      menuBounds: 'column',
      photoSheet: 'reference-photos.webp',
      avatarSheet: 'reference-photos.webp',
      labels: false,
      labelClass: true,
      icons: {
        more: '<circle cx="4" cy="12" r="1.7" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.7" fill="currentColor" stroke="none"/><circle cx="20" cy="12" r="1.7" fill="currentColor" stroke="none"/>',
        reply: '<path d="M2.5 10.8c0-4.3 4.1-7.6 9.5-7.6s9.5 3.3 9.5 7.6-4.1 7.6-9.5 7.6l-4.8 3.1.4-4C4.5 16.3 2.5 13.8 2.5 10.8z"/>',
        retweet: '<path d="M2 8l4-4 4 4M6 4v12a3 3 0 0 0 3 3h4M13 5h3a3 3 0 0 1 3 3v12M15 16l4 4 4-4"/>',
        like: '<path d="M12 21S2.5 15.5 2.5 8.8C2.5 3 9.1 1.9 12 6.7c2.9-4.8 9.5-3.7 9.5 2.1C21.5 15.5 12 21 12 21z"/>',
      },
      css: DESIGN_CSS,
      parts: {
        rowAdded: (base) => (R, feed, row, p, m) => {
          base(R, feed, row, p, m);
          if (R.spec.action !== 'reply' || p !== R.spec.targets[0]) return;
          const { util } = R;
          const post = R.spec.posts[p];
          const composer = util.el('section', 'as-replybox', feed);
          composer.dataset.role = 'reply-composer';
          const avatar = util.el('div', 'as-reply-avatar', composer);
          avatar.style.backgroundImage = `url(${PHOTO_URL})`;
          avatar.style.backgroundSize = '300% 300%';
          avatar.style.backgroundPosition = '0% 50%';
          const body = util.el('div', 'as-reply-body', composer);
          util.el('div', 'as-replying', body, `Replying to ${post.handle}`);
          const input = util.el('textarea', 'as-reply-input', body);
          input.dataset.role = 'draft';
          input.placeholder = 'Write your reply…';
          input.setAttribute('aria-label', 'Write your reply');
          input.value = m.draft || '';
          input.addEventListener('input', () => R.up({ draft: input.value }));
          const send = util.el('button', 'as-reply-send', body, 'Send reply');
          send.type = 'button';
          send.dataset.role = 'send-reply';
          send.addEventListener('click', () => { R.up({ send: 1 }); R.paint(); });
          R.x.replyInput = input;
          R.x.replySend = send;
        },
        paintStart: (base) => (R, m) => {
          base(R, m);
          const input = R.x.replyInput;
          if (input && input.value !== (m.draft || '')) input.value = m.draft || '';
        },
        locateExtra: (base) => (R, t) => {
          const p = base(R, t);
          if (p) return p;
          const center = (el) => el ? R.util.center(el) : null;
          if (t.field === 'draft') return center(R.x.replyInput);
          if (t.send !== undefined) return center(R.x.replySend);
          return null;
        },
        restoreScroll: () => (R, B, m, keep) => {
          const { feed, rows, lbx } = B;
          feed.scrollTop = keep;
          lbx.set({ scroll: m.scroll });
          if (R.spec.action === 'reply') {
            const targetRow = rows.get(R.spec.targets[0]);
            if (targetRow) {
              const fr = feed.getBoundingClientRect();
              const tr = targetRow.getBoundingClientRect();
              feed.scrollTop = Math.max(0, feed.scrollTop + tr.top - fr.top);
            }
          }
        },
      },
    },
  });
})();
