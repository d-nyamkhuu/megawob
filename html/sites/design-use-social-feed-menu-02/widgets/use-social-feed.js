// Macintosh bitmap feed design with local app frame, media tiles, and card-fit scrolling.
(function () {
  'use strict';
  const PORTRAITS = [0, 1].map((i) => new URL(`../assets/bitmap-avatar-${i}.webp`, document.currentScript.src).href);
  const LAKE = new URL('../assets/bitmap-lake.webp', document.currentScript.src).href;

  env.widget({
    task: 'use-social-feed',
    site: 'design-use-social-feed-menu-02',
    name: 'design',
    split: 'train',
    scenarios: ['menu'],
    template: 'use-social-feed/feed',
    design: {
      layout: 'plain',
      siteCssLast: true,
      menuBounds: 'column',
      menuPlace: 'unchanged',
      labels: true,
      actLabels: { retweet: 'Repost' },
      photoSheet: 'reference-photos.webp',
      icons: {
    reply: '<path d="M3 3h18v14H12l-5 5v-5H3z"/><path d="M7 9h.1M12 9h.1M17 9h.1"/>',
    retweet: '<path d="M4 20V4m-3 4 3-4 4 4M4 20h12M8 4h12v16m-4-4 4 4 3-4"/>',
    like: '<path d="M12 22 2 12V6l4-4h4l2 3 2-3h4l4 4v6z"/>',
    share: '<path d="M12 16V2"/><path d="M5.5 8.5L12 2l6.5 6.5"/><path d="M3 12v9h18v-9"/>',
    more: '<circle cx="5.5" cy="12" r="1.7" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.7" fill="currentColor" stroke="none"/><circle cx="18.5" cy="12" r="1.7" fill="currentColor" stroke="none"/>',
    dm: '<rect x="3.5" y="5.5" width="17" height="13" rx="2"/><path d="M4 7l8 6 8-6"/>',
    copy: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    embed: '<path d="M8.5 7L3.5 12l5 5M15.5 7l5 5-5 5"/>',
    mute: '<path d="M6 17v-6a6 6 0 0 1 12 0v6l2 2H4zM10 21h4M12 3V1M2 2l20 20"/>',
    block: '<circle cx="12" cy="12" r="8"/><path d="M6.4 6.4l11.2 11.2"/>',
    report: '<path d="M4 22V3M4 4q4-3 8-1t8 0v11q-4 2-8 0t-8 1"/>',
    hide: '<circle cx="12" cy="12" r="8.5"/><path d="M8.5 16c1-1.3 2.2-2 3.5-2s2.5.7 3.5 2"/><circle cx="9" cy="10" r=".9" fill="currentColor"/><circle cx="15" cy="10" r=".9" fill="currentColor"/>',
    home: '<path d="M3.5 10.5L12 3.5l8.5 7"/><path d="M5.5 9v11h13V9"/><path d="M10 20v-6h4v6"/>',
    explore: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L20.5 20.5"/>',
    bell: '<path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 1.5h-15z"/><path d="M10 20.5h4"/>',
    mail: '<rect x="3.5" y="5.5" width="17" height="13" rx="2"/><path d="M4 7l8 6 8-6"/>',
    bookmark: '<path d="M6.5 3.5h11v17l-5.5-4-5.5 4z"/>',
    user: '<circle cx="12" cy="8.5" r="4"/><path d="M4.5 20.5c.8-4 3.8-6 7.5-6s6.7 2 7.5 6"/>',
    logo: '<path d="M4.5 11.5c0-3.9 3.4-6.5 7.5-6.5s7.5 2.6 7.5 6.5-3.4 6.5-7.5 6.5c-.9 0-1.8-.1-2.6-.4L5.5 19.5l.9-3.2c-1.2-1.2-1.9-2.8-1.9-4.8z" fill="currentColor" stroke="none"/><path d="M12 8.6l.9 2 2 .9-2 .9-.9 2-.9-2-2-.9 2-.9z" fill="var(--accent)" stroke="none"/>',
  },
      css: "\n.as-app{left:0!important;right:0!important;top:0!important;bottom:0!important;width:auto!important;border:0;border-radius:0;box-shadow:none}.as-top{display:none}.as-body{min-height:0}.as-btn{border-radius:3px;font-size:14px}.as-pane{border-radius:0}.se-main{padding:17px 22px!important;gap:0}.se-col{width:100%;max-width:none}.se-side{display:none}.se-box{border-radius:3px;box-shadow:none;height:39px;padding:0 12px}.se-go{border-radius:3px;height:39px;padding:0 22px}.se-card{border-bottom:1px solid var(--line);padding:8px 8px 4px}.se-card .se-title{font-family:inherit;font-size:19px}.se-pager{justify-content:center}.se-pg{border-radius:2px;width:32px;min-width:32px;height:32px}.se-fav{width:22px;height:22px;border-radius:1px}.se-url{font-size:12px}.se-desc{font-size:14px}.tk-main{padding:18px 22px}.tk-title{font-size:24px}.tk-date{border-radius:0;background:transparent}.tk-row{gap:12px;border-bottom:1px solid var(--line);padding:0 12px}.tk-name{font-size:15px}.tk-price{font-size:18px;width:68px}.tk-buy{width:65px}.tk-when{width:125px}.tk-trigger{border-radius:0;min-width:175px}.fd-wrap.left{flex-direction:row}.fd-cart{width:28%!important;border-left:3px solid var(--fg);border-radius:0;background:var(--panel)}.fd-menu{padding:12px 18px}.fd-card{border-radius:0}.fd-add{border-radius:2px}.fd-order{border-radius:2px}.fd-rname{font-size:22px}.fd-rmeta{font-size:12px}.fd-dialog,.as-dialog{border-radius:4px}.fl-form{border-radius:0}.at-win{left:0!important;top:0!important;width:100%!important;height:100%!important;border-radius:0;box-shadow:none}.at-title{height:30px;border-radius:0;background:var(--header,var(--panel));font-size:14px}.at-rail{display:none}.at-body{flex:1;min-height:0}.at-main{min-width:0}.at-pane-h{border-radius:0}.at-explorer{width:46%!important;max-width:none}.at-preview{padding:10px}.at-tree{font-family:inherit}.at-row svg{color:var(--fg)}.at-ed{padding:0!important}.at-pagearea{background:var(--panel);padding:0!important}.at-sheet{border:0;box-shadow:none;background:var(--panel);margin:0!important;width:100%!important;max-width:none!important;padding:26px 32px!important}.at-sheet h2{font-family:inherit}.at-tb{border-radius:0;padding:10px;background:var(--header,var(--panel))}.at-tool{border-radius:3px;font-family:inherit}.at-status{background:var(--panel)}.at-term{border-radius:0;border:0}.at-tscroll{padding:20px;font:15px/1.5 monospace}.at-term-tabs{background:var(--header,var(--panel))}.as-page{inset:0!important;display:flex;justify-content:stretch!important}.as-rail,.as-side{display:none}.as-col{flex:1!important;width:100%!important;border:0}.as-head{height:43px;background:var(--header,var(--panel));font-size:14px}.as-post{padding:13px 18px;gap:14px;border-bottom:1px solid var(--line)}.as-text{font-size:16px;line-height:1.4}.as-av{width:48px;height:48px;border-radius:4px;font-size:17px}.as-acts{max-width:440px;justify-content:flex-start;gap:22px}.as-act{border-radius:3px;height:30px;font-size:14px;padding:0 8px}.as-act svg{width:20px;height:20px}.as-photos{height:100px!important;border-radius:4px}.as-menu{border-radius:3px;min-width:210px}.as-mi{height:35px;font-size:14px}.as-confirm{border-radius:4px}.as-confirm button{border-radius:3px}.as-track{border-radius:0;width:15px;background:var(--line)}.as-thumb{border-radius:0}.as-name{font-size:16px}.as-handle,.as-time{font-size:13px}.as-quote{border-radius:3px}.as-link{border-radius:3px}.as-link.tall .as-link-img{height:65px}.as-post:has(.as-photos){min-height:200px}\n.design-header{background:#fff;color:#000;border-bottom:4px solid #000}.design-brand{font-size:25px}.design-nav{font-size:18px;color:#000}.task-note{border:5px double #000;margin:5px;background:#fff;font-size:23px}.stage{border:5px double #000;margin:5px}.as-head{background:repeating-linear-gradient(45deg,#fff 0 1px,#bbb 1px 2px)}.as-av{border:2px solid #000;border-radius:0!important;filter:grayscale(1);background-color:#fff!important;color:#000}.as-post{border-bottom:2px solid #000;min-height:200px}.as-menu{border:2px solid #000;box-shadow:4px 4px #888}.as-mi{font-size:17px}.as-act{font-size:16px;color:#000}.end-control{background:#fff;color:#000;border:5px double #000;border-radius:0}.as-photos{filter:grayscale(1)}",
      parts: {
        page: (base) => (R) => {
          const page = base(R);
          const title = R.util.el('div', 'mac-titlebar', R.ctx.stage);
          R.util.el('i', '', title);
          R.util.el('span', '', title, 'Chatter');
          return page;
        },
        columnMade: (base, S) => (R) => {
          base(R);
          const { util, col } = R;
          const mast = util.el('div', 'mac-mast', col);
          const documentIcon = util.el('div', 'mac-document', mast);
          documentIcon.setAttribute('aria-hidden', 'true');
          util.el('b', 'mac-appname', mast, 'Chatter');
          const search = util.el('label', 'mac-search', mast);
          search.innerHTML = S.svg(S.ICON.explore);
          const input = util.el('input', '', search);
          input.placeholder = 'Search posts';
          input.setAttribute('aria-label', 'Search posts');
          input.type = 'text';
        },
        header: (base) => (R) => {
          base(R);
          R.head.classList.toggle('mac-live', R.live);
          if (R.live) {
            R.head.classList.add('mac-global-tabs');
            const bar = document.querySelector('.design-header');
            bar.insertBefore(R.head, bar.querySelector('.design-clock'));
          }
        },
        avatar: (base, S) => (R, row, post) => {
          const avatar = R.util.el('div', 'as-av', row, S.initials(post.name));
          avatar.textContent = '';
          const tile = R.handles.indexOf(post.handle) % 2;
          avatar.style.backgroundImage = `url(${PORTRAITS[tile]})`;
          avatar.style.backgroundSize = '100% 100%';
          avatar.title = post.name;
          return avatar;
        },
        photoTile: () => (R, el, post, k, n) => {
          el.style.backgroundImage = `url(${LAKE})`;
          el.style.backgroundSize = n === 1 ? '100% 100%' : n === 2 ? '200% 100%' : '200% 200%';
          el.style.backgroundPosition = `${k % 2 ? 100 : 0}% ${k > 1 ? 100 : 0}%`;
        },
        restoreScroll: (base) => (R, B, m, keep, first) => {
          R.x.restore = { keep, first };
        },
        built: (base) => (R, B, m) => {
          base(R, B, m);
          for (const [p, row] of B.rows) {
            const parts = B.parts.get(p);
            if (!parts.text) continue;
            const available = B.feed.clientHeight * 0.8 - 4;
            for (let pass = 0; pass < 4; pass++) {
              const height = row.getBoundingClientRect().height;
              if (available <= 0 || height <= available) break;
              row.classList.add('as-compact');
              const scale = parseFloat(getComputedStyle(parts.text).fontSize) / 30;
              const current = row.style.getPropertyValue('--mac');
              row.style.setProperty('--mac', ((current ? parseFloat(current) : scale) * available / height * 0.94) + 'px');
            }
          }
          const { keep, first } = R.x.restore;
          B.feed.scrollTop = keep;
          B.lbx.set(first ? { scroll: m.scroll } : {});
        },
      },
    },
  });
})();
