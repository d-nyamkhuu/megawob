// Swiss editorial task sheet: plain timeline layout, portrait crops, and guarded scroll reporting.
(function () {
  'use strict';
  const AVATAR_URL = new URL('../assets/editorial-avatars.webp', document.currentScript.src).href;
  const AVATAR_TOPS = [229, 355, 485, 613, 744];
  const DESIGN_CSS = "\n.as-app{left:0!important;right:0!important;top:0!important;bottom:0!important;width:auto!important;border:0;border-radius:0;box-shadow:none}.as-top{display:none}.as-body{min-height:0}.as-btn{border-radius:3px;font-size:14px}.as-pane{border-radius:0}.se-main{padding:17px 22px!important;gap:0}.se-col{width:100%;max-width:none}.se-side{display:none}.se-box{border-radius:3px;box-shadow:none;height:39px;padding:0 12px}.se-go{border-radius:3px;height:39px;padding:0 22px}.se-card{border-bottom:1px solid var(--line);padding:8px 8px 4px}.se-card .se-title{font-family:inherit;font-size:19px}.se-pager{justify-content:center}.se-pg{border-radius:2px;width:32px;min-width:32px;height:32px}.se-fav{width:22px;height:22px;border-radius:1px}.se-url{font-size:12px}.se-desc{font-size:14px}.tk-main{padding:18px 22px}.tk-title{font-size:24px}.tk-date{border-radius:0;background:transparent}.tk-row{gap:12px;border-bottom:1px solid var(--line);padding:0 12px}.tk-name{font-size:15px}.tk-price{font-size:18px;width:68px}.tk-buy{width:65px}.tk-when{width:125px}.tk-trigger{border-radius:0;min-width:175px}.fd-wrap.left{flex-direction:row}.fd-cart{width:28%!important;border-left:3px solid var(--fg);border-radius:0;background:var(--panel)}.fd-menu{padding:12px 18px}.fd-card{border-radius:0}.fd-add{border-radius:2px}.fd-order{border-radius:2px}.fd-rname{font-size:22px}.fd-rmeta{font-size:12px}.fd-dialog,.as-dialog{border-radius:4px}.fl-form{border-radius:0}.at-win{left:0!important;top:0!important;width:100%!important;height:100%!important;border-radius:0;box-shadow:none}.at-title{height:30px;border-radius:0;background:var(--header,var(--panel));font-size:14px}.at-rail{display:none}.at-body{flex:1;min-height:0}.at-main{min-width:0}.at-pane-h{border-radius:0}.at-explorer{width:46%!important;max-width:none}.at-preview{padding:10px}.at-tree{font-family:inherit}.at-row svg{color:var(--fg)}.at-ed{padding:0!important}.at-pagearea{background:var(--panel);padding:0!important}.at-sheet{border:0;box-shadow:none;background:var(--panel);margin:0!important;width:100%!important;max-width:none!important;padding:26px 32px!important}.at-sheet h2{font-family:inherit}.at-tb{border-radius:0;padding:10px;background:var(--header,var(--panel))}.at-tool{border-radius:3px;font-family:inherit}.at-status{background:var(--panel)}.at-term{border-radius:0;border:0}.at-tscroll{padding:20px;font:15px/1.5 monospace}.at-term-tabs{background:var(--header,var(--panel))}.as-page{inset:0!important;display:flex;justify-content:stretch!important}.as-rail,.as-side{display:none}.as-col{flex:1!important;width:100%!important;border:0}.as-head{height:43px;background:var(--header,var(--panel));font-size:14px}.as-post{padding:13px 18px;gap:14px;border-bottom:1px solid var(--line)}.as-text{font-size:16px;line-height:1.4}.as-av{width:48px;height:48px;border-radius:4px;font-size:17px}.as-acts{max-width:440px;justify-content:flex-start;gap:22px}.as-act{border-radius:3px;height:30px;font-size:14px;padding:0 8px}.as-act svg{width:20px;height:20px}.as-photos{height:100px!important;border-radius:4px}.as-menu{border-radius:3px;min-width:210px}.as-mi{height:35px;font-size:14px}.as-confirm{border-radius:4px}.as-confirm button{border-radius:3px}.as-track{border-radius:0;width:15px;background:var(--line)}.as-thumb{border-radius:0}.as-name{font-size:16px}.as-handle,.as-time{font-size:13px}.as-quote{border-radius:3px}.as-link{border-radius:3px}.as-link.tall .as-link-img{height:65px}.as-post:has(.as-photos){min-height:200px}\n.design-header{height:100px;border-bottom:3px solid #e9262c;background:#fff}.site-shell{grid-template-rows:100px minmax(0,1fr) 58px}.design-brand{font-size:35px;font-weight:800;letter-spacing:-1px}.task-note{font-size:24px;color:#ed2228;background:#fff;border:0;padding:16px 28px}.as-head{display:none}.as-post{position:relative;margin:8px 25px;border:1px solid #ddd;padding:14px;min-height:85px}.as-av{border-radius:50%}.as-main{padding-right:330px}.as-acts{position:absolute;right:25px;top:33px;gap:14px}.as-more{position:absolute;right:10px;top:10px}.as-text{font-size:15px}.as-photos{height:75px!important}.end-control{background:#ed2228;border:0}";

  env.widget({
    task: 'use-social-feed',
    site: 'design-use-social-feed-all-02',
    name: 'design',
    split: 'train',
    scenarios: ['all'],
    template: 'use-social-feed/feed',
    design: {
      layout: 'plain',
      labels: true,
      timeFormat: 'dot',
      photoSheet: 'reference-photos.webp',
      css: DESIGN_CSS,
      inlineActs: true,
      siteCssLast: true,
      scenarioDecor: false,
      menuBounds: 'column',
      icons: {
        reply: '<path d="M2.5 11c0-4.2 4.1-7.3 9.5-7.3s9.5 3.1 9.5 7.3-4.1 7.3-9.5 7.3c-1.1 0-2.2-.1-3.2-.4L4.6 21l1.2-4.4c-2.1-1.4-3.3-3.3-3.3-5.6z"/>',
        retweet: '<path d="M2 8l4-4 4 4M6 4v14h7M22 16l-4 4-4-4M18 20V6h-7"/>',
        like: '<path d="M12 21S2.5 14.7 2.5 8.8A5.1 5.1 0 0 1 12 6.2a5.1 5.1 0 0 1 9.5 2.6C21.5 14.7 12 21 12 21z"/>',
      },
      parts: {
        up: (base) => (R, event) => {
          if (R.page.isConnected) base(R, event);
        },
        headed: (base) => (R) => {
          base(R);
          R.head.classList.toggle('task-tabs', R.live);
        },
        avatar: (base, S) => (R, row, post, p) => {
          const av = R.util.el('div', 'as-av', row, S.initials(post.name));
          const tile = p % 5;
          av.textContent = '';
          av.style.backgroundImage = `url(${AVATAR_URL})`;
          av.style.backgroundSize = '1990.47619% 1120.23810%';
          av.style.backgroundPosition = `${117 / 1588 * 100}% ${AVATAR_TOPS[tile] / 857 * 100}%`;
          av.title = post.name;
          return av;
        },
        boxMade: (base) => (R) => {
          base(R);
          R.x.scrollInput = false;
          for (const kind of ['pointerdown', 'wheel', 'keydown']) {
            R.box.addEventListener(kind, () => { R.x.scrollInput = true; }, { capture: true });
          }
        },
        hover: () => (R, row, p) => {
          row.addEventListener('pointermove', () => {
            if (row.isConnected && R.ctx.model.hover !== p) R.up({ hover: p });
            R.markHover();
          });
          row.addEventListener('pointerleave', () => {
            if (row.isConnected && R.ctx.model.hover === p) R.up({ hover: null });
            R.markHover();
          });
        },
        placeMenu: (base) => (R, panel, trigger) => {
          const c = R.col.getBoundingClientRect();
          const t = trigger.getBoundingClientRect();
          const b = R.box.getBoundingClientRect();
          const w = panel.offsetWidth;
          const h = panel.offsetHeight;
          panel.style.left = Math.round(Math.max(8, t.right - c.left - w + 4)) + 'px';
          const below = t.bottom + 4;
          const bottom = Math.min(b.bottom, c.bottom);
          const top = below + h <= bottom - 4
            ? below
            : Math.max(c.top + 4, Math.min(t.top - 4 - h, bottom - h - 4));
          panel.style.top = Math.round(top - c.top) + 'px';
        },
        onScroll: () => (R, feed) => {
          if (R.x.scrollInput && R.fd && R.fd.feed === feed
              && (R.x.reportedFeed !== feed || R.x.reportedTop !== feed.scrollTop)) R.report();
        },
        report: (base, S) => (R) => {
          const fd = R.fd;
          if (!fd || !fd.feed.isConnected) return;
          R.x.reportedFeed = fd.feed;
          R.x.reportedTop = fd.feed.scrollTop;
          fd.track.classList.toggle('overflow', fd.feed.scrollHeight > fd.feed.clientHeight + 1);
          const m = R.ctx.model;
          const lay = S.P.layoutOf(R);
          const changed = lay.scroll !== m.scroll
            || JSON.stringify(lay.view) !== JSON.stringify(m.view)
            || lay.atEnd !== m.atEnd
            || JSON.stringify(lay.px) !== JSON.stringify(m.px);
          if (!changed) return;
          const closeMenu = m.menu !== null && m.scroll !== lay.scroll && m.view !== null;
          R.ctx.update(R.F.helpers.act(m, R.spec, { view: lay, closeMenu }));
          if (closeMenu) R.paintMenus();
        },
      },
    },
  });
})();
