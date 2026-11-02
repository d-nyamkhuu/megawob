// Dark notebook styling, photo tiles, and the original reply, like, and share icons.
(function () {
  'use strict';
  const PHOTO_URL = new URL('../assets/reference-photos.webp', document.currentScript.src).href;
  const DESIGN_CSS = "\n.as-app{left:0!important;right:0!important;top:0!important;bottom:0!important;width:auto!important;border:0;border-radius:0;box-shadow:none}.as-top{display:none}.as-body{min-height:0}.as-btn{border-radius:3px;font-size:14px}.as-pane{border-radius:0}.se-main{padding:17px 22px!important;gap:0}.se-col{width:100%;max-width:none}.se-side{display:none}.se-box{border-radius:3px;box-shadow:none;height:39px;padding:0 12px}.se-go{border-radius:3px;height:39px;padding:0 22px}.se-card{border-bottom:1px solid var(--line);padding:8px 8px 4px}.se-card .se-title{font-family:inherit;font-size:19px}.se-pager{justify-content:center}.se-pg{border-radius:2px;width:32px;min-width:32px;height:32px}.se-fav{width:22px;height:22px;border-radius:1px}.se-url{font-size:12px}.se-desc{font-size:14px}.tk-main{padding:18px 22px}.tk-title{font-size:24px}.tk-date{border-radius:0;background:transparent}.tk-row{gap:12px;border-bottom:1px solid var(--line);padding:0 12px}.tk-name{font-size:15px}.tk-price{font-size:18px;width:68px}.tk-buy{width:65px}.tk-when{width:125px}.tk-trigger{border-radius:0;min-width:175px}.fd-wrap.left{flex-direction:row}.fd-cart{width:28%!important;border-left:3px solid var(--fg);border-radius:0;background:var(--panel)}.fd-menu{padding:12px 18px}.fd-card{border-radius:0}.fd-add{border-radius:2px}.fd-order{border-radius:2px}.fd-rname{font-size:22px}.fd-rmeta{font-size:12px}.fd-dialog,.as-dialog{border-radius:4px}.fl-form{border-radius:0}.at-win{left:0!important;top:0!important;width:100%!important;height:100%!important;border-radius:0;box-shadow:none}.at-title{height:30px;border-radius:0;background:var(--header,var(--panel));font-size:14px}.at-rail{display:none}.at-body{flex:1;min-height:0}.at-main{min-width:0}.at-pane-h{border-radius:0}.at-explorer{width:46%!important;max-width:none}.at-preview{padding:10px}.at-tree{font-family:inherit}.at-row svg{color:var(--fg)}.at-ed{padding:0!important}.at-pagearea{background:var(--panel);padding:0!important}.at-sheet{border:0;box-shadow:none;background:var(--panel);margin:0!important;width:100%!important;max-width:none!important;padding:26px 32px!important}.at-sheet h2{font-family:inherit}.at-tb{border-radius:0;padding:10px;background:var(--header,var(--panel))}.at-tool{border-radius:3px;font-family:inherit}.at-status{background:var(--panel)}.at-term{border-radius:0;border:0}.at-tscroll{padding:20px;font:15px/1.5 monospace}.at-term-tabs{background:var(--header,var(--panel))}.as-page{inset:0!important;display:flex;justify-content:stretch!important}.as-rail,.as-side{display:none}.as-col{flex:1!important;width:100%!important;border:0}.as-head{height:43px;background:var(--header,var(--panel));font-size:14px}.as-post{padding:13px 18px;gap:14px;border-bottom:1px solid var(--line)}.as-text{font-size:16px;line-height:1.4}.as-av{width:48px;height:48px;border-radius:4px;font-size:17px}.as-acts{max-width:440px;justify-content:flex-start;gap:22px}.as-act{border-radius:3px;height:30px;font-size:14px;padding:0 8px}.as-act svg{width:20px;height:20px}.as-photos{height:100px!important;border-radius:4px}.as-menu{border-radius:3px;min-width:210px}.as-mi{height:35px;font-size:14px}.as-confirm{border-radius:4px}.as-confirm button{border-radius:3px}.as-track{border-radius:0;width:15px;background:var(--line)}.as-thumb{border-radius:0}.as-name{font-size:16px}.as-handle,.as-time{font-size:13px}.as-quote{border-radius:3px}.as-link{border-radius:3px}.as-link.tall .as-link-img{height:65px}.as-post:has(.as-photos){min-height:200px}\n.design-header{background:linear-gradient(#3b4145,#161a1d);color:#d8e4ed}.design-nav{color:#c7d8e5}.design-brand{font-size:18px}.as-head{background:linear-gradient(#353c43,#22272c);height:52px}.as-post{background:#171b1e;border-bottom:1px solid #2b3338}.as-av{border-radius:5px}.as-act{color:#c3d2df}.bottom .task-note{background:linear-gradient(#2a3339,#20272c);font-size:21px}.end-control{background:linear-gradient(#c8c9cc,#8d8e93);color:#111;border:2px outset #ddd}";

  env.widget({
    task: 'use-social-feed',
    site: 'design-use-social-feed-all-01',
    name: 'design',
    split: 'train',
    scenarios: ['all'],
    template: 'use-social-feed/feed',
    design: {
      layout: 'plain',
      labels: true,
      scenarioDecor: false,
      timeFormat: 'ago',
      photoSheet: 'reference-photos.webp',
      siteCssLast: true,
      css: DESIGN_CSS,
      icons: {
        reply: '<path d="M10 4L2 12l8 7v-5c7-1 11 1 12 6 0-9-4-13-12-12z" fill="currentColor" stroke="none"/>',
        like: '<path d="M12 21S2 15 2 8.5C2 2 9 1 12 7c3-6 10-5 10 1.5C22 15 12 21 12 21z"/>',
        share: '<path d="M12 15V2M8 6l4-4 4 4M8 8H4v14h16V8h-4"/>',
      },
      parts: {
        page: (base) => (R) => {
          const page = base(R);
          if (R.spec.action === 'retweet') page.classList.add('need-retweet');
          return page;
        },
        header: (base) => (R) => {
          base(R);
          const title = R.head.querySelector('b');
          const heading = R.util.el('div', 'feed-heading', null);
          R.head.insertBefore(heading, title);
          heading.append(title);
          R.util.el('span', 'feed-subtitle', heading, 'Latest posts from people you follow');
          const search = R.util.el('div', 'feed-search', R.head);
          search.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="10" cy="10" r="7"/><path d="M15 15l6 6"/></svg><span>Search Chirp</span>';
        },
        decorTabs: () => () => {},
        avatar: (base) => (R, row, post) => {
          const av = base(R, row, post);
          const tile = [2, 3, 4, 5, 0, 1][R.handles.indexOf(post.handle) % 6];
          av.textContent = '';
          av.style.backgroundImage = `url(${PHOTO_URL})`;
          av.style.backgroundSize = '300% 300%';
          av.style.backgroundPosition = `${(tile % 3) * 50}% ${Math.floor(tile / 3) * 50}%`;
          av.title = post.name;
          return av;
        },
      },
    },
  });
})();
