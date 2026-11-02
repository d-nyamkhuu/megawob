// App-social menu design: single-column timeline, scene-photo crops, and a search field in the header.
(function () {
  'use strict';

  const SCENE_URL = new URL('../assets/scene-photographs.webp', document.currentScript.src).href;
  function scenePhoto(rect, cls = '') {
    return `<svg class="${cls}" viewBox="${rect.join(' ')}" preserveAspectRatio="none" aria-hidden="true"><image href="${SCENE_URL}" width="1672" height="941"/></svg>`;
  }

  env.widget({
    task: 'use-social-feed',
    site: 'design-use-social-feed-menu-01',
    name: 'design',
    split: 'train',
    scenarios: ['menu'],
    template: 'use-social-feed/feed',
    design: {
      layout: 'plain',
      menuBounds: 'column',
      menuPlace: 'always',
      scrollSet: 'first',
      labels: false,
      siteCssLast: true,
      css: "\n.as-app{left:0!important;right:0!important;top:0!important;bottom:0!important;width:auto!important;border:0;border-radius:0;box-shadow:none}.as-top{display:none}.as-body{min-height:0}.as-btn{border-radius:3px;font-size:14px}.as-pane{border-radius:0}.se-main{padding:17px 22px!important;gap:0}.se-col{width:100%;max-width:none}.se-side{display:none}.se-box{border-radius:3px;box-shadow:none;height:39px;padding:0 12px}.se-go{border-radius:3px;height:39px;padding:0 22px}.se-card{border-bottom:1px solid var(--line);padding:8px 8px 4px}.se-card .se-title{font-family:inherit;font-size:19px}.se-pager{justify-content:center}.se-pg{border-radius:2px;width:32px;min-width:32px;height:32px}.se-fav{width:22px;height:22px;border-radius:1px}.se-url{font-size:12px}.se-desc{font-size:14px}.tk-main{padding:18px 22px}.tk-title{font-size:24px}.tk-date{border-radius:0;background:transparent}.tk-row{gap:12px;border-bottom:1px solid var(--line);padding:0 12px}.tk-name{font-size:15px}.tk-price{font-size:18px;width:68px}.tk-buy{width:65px}.tk-when{width:125px}.tk-trigger{border-radius:0;min-width:175px}.fd-wrap.left{flex-direction:row}.fd-cart{width:28%!important;border-left:3px solid var(--fg);border-radius:0;background:var(--panel)}.fd-menu{padding:12px 18px}.fd-card{border-radius:0}.fd-add{border-radius:2px}.fd-order{border-radius:2px}.fd-rname{font-size:22px}.fd-rmeta{font-size:12px}.fd-dialog,.as-dialog{border-radius:4px}.fl-form{border-radius:0}.at-win{left:0!important;top:0!important;width:100%!important;height:100%!important;border-radius:0;box-shadow:none}.at-title{height:30px;border-radius:0;background:var(--header,var(--panel));font-size:14px}.at-rail{display:none}.at-body{flex:1;min-height:0}.at-main{min-width:0}.at-pane-h{border-radius:0}.at-explorer{width:46%!important;max-width:none}.at-preview{padding:10px}.at-tree{font-family:inherit}.at-row svg{color:var(--fg)}.at-ed{padding:0!important}.at-pagearea{background:var(--panel);padding:0!important}.at-sheet{border:0;box-shadow:none;background:var(--panel);margin:0!important;width:100%!important;max-width:none!important;padding:26px 32px!important}.at-sheet h2{font-family:inherit}.at-tb{border-radius:0;padding:10px;background:var(--header,var(--panel))}.at-tool{border-radius:3px;font-family:inherit}.at-status{background:var(--panel)}.at-term{border-radius:0;border:0}.at-tscroll{padding:20px;font:15px/1.5 monospace}.at-term-tabs{background:var(--header,var(--panel))}.as-page{inset:0!important;display:flex;justify-content:stretch!important}.as-rail,.as-side{display:none}.as-col{flex:1!important;width:100%!important;border:0}.as-head{height:43px;background:var(--header,var(--panel));font-size:14px}.as-post{padding:13px 18px;gap:14px;border-bottom:1px solid var(--line)}.as-text{font-size:16px;line-height:1.4}.as-av{width:48px;height:48px;border-radius:4px;font-size:17px}.as-acts{max-width:440px;justify-content:flex-start;gap:22px}.as-act{border-radius:3px;height:30px;font-size:14px;padding:0 8px}.as-act svg{width:20px;height:20px}.as-photos{height:100px!important;border-radius:4px}.as-menu{border-radius:3px;min-width:210px}.as-mi{height:35px;font-size:14px}.as-confirm{border-radius:4px}.as-confirm button{border-radius:3px}.as-track{border-radius:0;width:15px;background:var(--line)}.as-thumb{border-radius:0}.as-name{font-size:16px}.as-handle,.as-time{font-size:13px}.as-quote{border-radius:3px}.as-link{border-radius:3px}.as-link.tall .as-link-img{height:65px}.as-post:has(.as-photos){min-height:200px}\n.design-header{background:linear-gradient(#3b4145,#161a1d);color:#d8e4ed}.design-nav{color:#c7d8e5}.design-brand{font-size:18px}.as-head{background:linear-gradient(#353c43,#22272c);height:52px}.as-post{background:#171b1e;border-bottom:1px solid #2b3338}.as-av{border-radius:5px}.as-act{color:#c3d2df}.bottom .task-note{background:linear-gradient(#2a3339,#20272c);font-size:21px}.end-control{background:linear-gradient(#c8c9cc,#8d8e93);color:#111;border:2px outset #ddd}" + '\n.as-alt{display:none!important}',
      icons: {
        retweet: '<path d="M1.5 7l4-4 4 4M5.5 3v15a2 2 0 0 0 2 2h5M22.5 17l-4 4-4-4M18.5 21V6a2 2 0 0 0-2-2h-5"/>',
        like: '<path d="M12 21S3 15.5 3 9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6.5-9 12-9 12z"/>',
      },
      parts: {
        header: (base, S) => (R) => {
          const { util, rng, spec } = R;
          const lists = Object.keys(spec.lists);
          R.live = lists.length > 1;
          R.head = util.el('div', 'as-head' + (R.live && rng.bool(0.5) ? ' split' : ''), R.col);
          util.el('b', '', R.head, S.D.title);
          S.P.titled(R);
          const search = util.el('div', 'sheet-search', R.head);
          search.innerHTML = S.svg(S.ICON.explore);
          util.el('span', '', search, 'Search posts, people, or topics...');
          if (R.live) {
            for (const k of rng.bool(0.7) ? ['foryou', 'following'] : ['following', 'foryou'])
              R.tabEls[k] = S.P.liveTab(R, k);
          } else {
            const following = rng.bool(0.4);
            util.el('div', 'as-tab' + (following ? '' : ' on'), R.head, 'For you');
            util.el('div', 'as-tab' + (following ? ' on' : ''), R.head, 'Following');
          }
          S.P.headed(R);
        },
        avatar: (base, S) => (R, row, post) => {
          const av = R.util.el('div', 'as-av', row, S.initials(post.name));
          const avatarTile = R.handles.indexOf(post.handle) % 3;
          av.textContent = '';
          av.innerHTML = scenePhoto([114, [120, 440, 589][avatarTile], 77, 77]);
          av.title = post.name;
          return av;
        },
        photoTile: () => (R, el, post, k, n) => {
          const handles = R.handles;
          const coffee = handles.indexOf(post.handle) % 2 === 1;
          const photoRect = coffee ? [214, 654, 1078, 161] : [214, 187, 1303, 191];
          let [x, y, w, h] = photoRect;
          if (n > 1) { w /= 2; x += (k % 2) * w; }
          if (n > 2 && !(n === 3 && k === 0)) { h /= 2; y += (n === 3 ? k - 1 : Math.floor(k / 2)) * h; }
          if (n === 3 && k === 2) x = photoRect[0] + photoRect[2] / 2;
          el.innerHTML = scenePhoto([x, y, w, h]);
        },
        linkImage: () => (R, el) => {
          el.innerHTML = scenePhoto([214, 654, 1078, 161]);
        },
        actIcon: (base, S) => (button) => S.P.svg(S.ICON[button === 'share' ? 'bookmark' : button]),
      },
    },
  });
})();
