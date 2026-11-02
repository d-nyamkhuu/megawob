// Preserves this site's Chronicle icons, photo avatars, task detail and feed scrolling behavior.
(function () {
  'use strict';

  const SUNSET = new URL('../assets/sunset.webp', document.currentScript.src).href;
  const DESIGN_CSS = "\n.as-app{left:0!important;right:0!important;top:0!important;bottom:0!important;width:auto!important;border:0;border-radius:0;box-shadow:none}.as-top{display:none}.as-body{min-height:0}.as-btn{border-radius:3px;font-size:14px}.as-pane{border-radius:0}.se-main{padding:17px 22px!important;gap:0}.se-col{width:100%;max-width:none}.se-side{display:none}.se-box{border-radius:3px;box-shadow:none;height:39px;padding:0 12px}.se-go{border-radius:3px;height:39px;padding:0 22px}.se-card{border-bottom:1px solid var(--line);padding:8px 8px 4px}.se-card .se-title{font-family:inherit;font-size:19px}.se-pager{justify-content:center}.se-pg{border-radius:2px;width:32px;min-width:32px;height:32px}.se-fav{width:22px;height:22px;border-radius:1px}.se-url{font-size:12px}.se-desc{font-size:14px}.tk-main{padding:18px 22px}.tk-title{font-size:24px}.tk-date{border-radius:0;background:transparent}.tk-row{gap:12px;border-bottom:1px solid var(--line);padding:0 12px}.tk-name{font-size:15px}.tk-price{font-size:18px;width:68px}.tk-buy{width:65px}.tk-when{width:125px}.tk-trigger{border-radius:0;min-width:175px}.fd-wrap.left{flex-direction:row}.fd-cart{width:28%!important;border-left:3px solid var(--fg);border-radius:0;background:var(--panel)}.fd-menu{padding:12px 18px}.fd-card{border-radius:0}.fd-add{border-radius:2px}.fd-order{border-radius:2px}.fd-rname{font-size:22px}.fd-rmeta{font-size:12px}.fd-dialog,.as-dialog{border-radius:4px}.fl-form{border-radius:0}.at-win{left:0!important;top:0!important;width:100%!important;height:100%!important;border-radius:0;box-shadow:none}.at-title{height:30px;border-radius:0;background:var(--header,var(--panel));font-size:14px}.at-rail{display:none}.at-body{flex:1;min-height:0}.at-main{min-width:0}.at-pane-h{border-radius:0}.at-explorer{width:46%!important;max-width:none}.at-preview{padding:10px}.at-tree{font-family:inherit}.at-row svg{color:var(--fg)}.at-ed{padding:0!important}.at-pagearea{background:var(--panel);padding:0!important}.at-sheet{border:0;box-shadow:none;background:var(--panel);margin:0!important;width:100%!important;max-width:none!important;padding:26px 32px!important}.at-sheet h2{font-family:inherit}.at-tb{border-radius:0;padding:10px;background:var(--header,var(--panel))}.at-tool{border-radius:3px;font-family:inherit}.at-status{background:var(--panel)}.at-term{border-radius:0;border:0}.at-tscroll{padding:20px;font:15px/1.5 monospace}.at-term-tabs{background:var(--header,var(--panel))}.as-page{inset:0!important;display:flex;justify-content:stretch!important}.as-rail,.as-side{display:none}.as-col{flex:1!important;width:100%!important;border:0}.as-head{height:43px;background:var(--header,var(--panel));font-size:14px}.as-post{padding:13px 18px;gap:14px;border-bottom:1px solid var(--line)}.as-text{font-size:16px;line-height:1.4}.as-av{width:48px;height:48px;border-radius:4px;font-size:17px}.as-acts{max-width:440px;justify-content:flex-start;gap:22px}.as-act{border-radius:3px;height:30px;font-size:14px;padding:0 8px}.as-act svg{width:20px;height:20px}.as-photos{height:100px!important;border-radius:4px}.as-menu{border-radius:3px;min-width:210px}.as-mi{height:35px;font-size:14px}.as-confirm{border-radius:4px}.as-confirm button{border-radius:3px}.as-track{border-radius:0;width:15px;background:var(--line)}.as-thumb{border-radius:0}.as-name{font-size:16px}.as-handle,.as-time{font-size:13px}.as-quote{border-radius:3px}.as-link{border-radius:3px}.as-link.tall .as-link-img{height:65px}.as-post:has(.as-photos){min-height:200px}\n.design-header{background:linear-gradient(#a5bed6,#e1effc)}.site-shell{grid-template-rows:100px minmax(0,1fr) 55px}.design-header{align-items:flex-start;padding-top:13px;position:relative}.design-header:after{content:\"Refresh       New Post       Open       Save       Search       Filter       Mark Read       Favorite       Settings\";position:absolute;bottom:12px;left:25px;color:#133c6d;font:16px Arial}.bottom .task-note{background:#deefff;font-size:26px}.as-post{display:flex;padding:12px}.as-main{position:relative;padding-right:280px}.as-acts{position:absolute;right:0;bottom:0;gap:12px}.as-text{font-size:14px}.as-photos{height:80px!important}.end-control{background:linear-gradient(#38b2ff,#0379d9)}";

  env.widget({
    task: 'use-social-feed',
    site: 'design-use-social-feed-one-03',
    name: 'design',
    split: 'train',
    scenarios: ['one'],
    template: 'use-social-feed/feed',
    design: {
      css: DESIGN_CSS,
      labels: true,
      avatarSheet: null,
      icons: {
        reply: '<path d="M1.5 10.5c0-5 4.6-8 10.5-8s10.5 3 10.5 8S18 19 12 19c-1.2 0-2.3-.1-3.5-.4L4 22l1-5c-2.3-1.4-3.5-3.6-3.5-6.5z"/>',
        retweet: '<path d="M5 4v13.5q0 2 2 2h8M1 8l4-4 4 4M12 4h8q1 0 1 1v14M17 15l4 4 4-4"/>',
        like: '<defs><linearGradient id="chronicle-heart" x2=".3" y2="1"><stop stop-color="#c93030"/><stop offset="1" stop-color="#b21c1d"/></linearGradient></defs><path stroke="none" d="M12 22S1 15 1 8A6 6 0 0 1 12 5 6 6 0 0 1 23 8c0 7-11 14-11 14z"/>',
      },
      parts: {
        avatar: (base, S) => (R, row, post, ...args) => {
          const av = base(R, row, post, ...args);
          av.textContent = '';
          av.style.backgroundImage = `url(${SUNSET})`;
          av.style.backgroundSize = 'cover';
          av.style.backgroundPosition = 'center';
          av.title = post.name;
          return av;
        },
        showMore: () => (R, hosts, p) => {
          const sm = R.util.el('span', 'as-showmore', hosts.main, 'Show more');
          sm.dataset.role = 'showmore';
          sm.addEventListener('click', () => { R.up({ expand: p }); R.paint(); });
          return sm;
        },
        restoreScroll: () => (R, B, m, keep, first) => {
          const { feed, rows, lbx } = B;
          feed.scrollTop = keep;
          if (first && m.scroll) {
            const rowEls = [...rows.values()];
            const index = Math.max(0, Math.min(rowEls.length - 1, m.scroll));
            const lower = Math.floor(index), upper = Math.min(rowEls.length - 1, lower + 1);
            const origin = rowEls[0].getBoundingClientRect().top;
            const a = rowEls[lower].getBoundingClientRect().top - origin;
            const b = rowEls[upper].getBoundingClientRect().top - origin;
            feed.scrollTop = a + (b - a) * (index - lower);
          }
          lbx.set({});
        },
        built: (base) => (R, B, m) => {
          base(R, B, m);
          let wheelTop = 0;
          B.feed.addEventListener('wheel', () => { wheelTop = B.feed.scrollTop; }, { capture: true, passive: true });
          B.feed.addEventListener('wheel', (e) => {
            if (!e.deltaY) return;
            const text = e.target.closest('.as-text');
            if (text && text.scrollHeight > text.clientHeight) return;
            e.preventDefault();
            const elements = [...B.rows.values()];
            const top = B.feed.getBoundingClientRect().top + B.feed.clientTop;
            const offsets = elements.map((el) => el.getBoundingClientRect().top - top + B.feed.scrollTop);
            const next = e.deltaY > 0
              ? offsets.find((offset) => offset > wheelTop + 1)
              : offsets.slice().reverse().find((offset) => offset < wheelTop - 1);
            B.feed.scrollTop = next === undefined
              ? (e.deltaY > 0 ? B.feed.scrollHeight - B.feed.clientHeight : 0)
              : next;
            B.lbx.set({});
            R.report();
          }, { passive: false });
        },
        layoutOf: (base) => (R) => {
          const { fd } = R;
          const fr = fd.feed.getBoundingClientRect();
          const top0 = fr.top + fd.feed.clientTop;
          const h = fd.feed.clientHeight;
          const view = [];
          const offs = [];
          for (const [p, row] of fd.rows) {
            const r = row.getBoundingClientRect();
            offs.push(Math.round(r.top - top0 + fd.feed.scrollTop));
            const pt = fd.parts.get(p);
            const control = pt.undo || (pt.acts && pt.acts.reply) || pt.more;
            const cr = control && control.getBoundingClientRect();
            if (cr && cr.height > 0 && cr.top >= top0 - 0.5 && cr.bottom <= top0 + h + 0.5) view.push(p);
          }
          const sr = fd.sentinel.getBoundingClientRect();
          const atEnd = R.F.helpers.moreToLoad(R.spec, R.ctx.model) && sr.top < top0 + h - 4;
          return { scroll: Math.round(fd.lbx.scrollIndex() * 1000) / 1000, view, atEnd, px: { top: Math.round(fd.feed.scrollTop), h, offs } };
        },
        paintStart: (base) => (R, m) => {
          base(R, m);
          const ds = document.querySelector('.detail-status');
          const ok = m.on.length !== R.spec.start.length || m.on.some((k) => !R.spec.start.includes(k));
          ds.style.color = ok ? '#b36b00' : '#d00000';
        },
        locateExtra: () => (R, t) => {
          if (t.feed) {
            const box = R.fd.feed.getBoundingClientRect();
            return [box.left + Math.min(12, box.width * 0.02), box.top + box.height * 0.45];
          }
          if (t.scroll !== undefined) return R.fd.lbx.locateThumbFor(Math.ceil(t.scroll));
          return null;
        },
      },
    },
  });
})();
