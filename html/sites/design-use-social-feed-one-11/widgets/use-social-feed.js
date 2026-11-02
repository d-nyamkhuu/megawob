// Keeps the mint intranet styling, labeled actions, initial scroll, and phantom-hover filtering.
(function () {
  'use strict';
  const DESIGN_CSS="\n.as-app{left:0!important;right:0!important;top:0!important;bottom:0!important;width:auto!important;border:0;border-radius:0;box-shadow:none}.as-top{display:none}.as-body{min-height:0}.as-btn{border-radius:3px;font-size:14px}.as-pane{border-radius:0}.se-main{padding:17px 22px!important;gap:0}.se-col{width:100%;max-width:none}.se-side{display:none}.se-box{border-radius:3px;box-shadow:none;height:39px;padding:0 12px}.se-go{border-radius:3px;height:39px;padding:0 22px}.se-card{border-bottom:1px solid var(--line);padding:8px 8px 4px}.se-card .se-title{font-family:inherit;font-size:19px}.se-pager{justify-content:center}.se-pg{border-radius:2px;width:32px;min-width:32px;height:32px}.se-fav{width:22px;height:22px;border-radius:1px}.se-url{font-size:12px}.se-desc{font-size:14px}.tk-main{padding:18px 22px}.tk-title{font-size:24px}.tk-date{border-radius:0;background:transparent}.tk-row{gap:12px;border-bottom:1px solid var(--line);padding:0 12px}.tk-name{font-size:15px}.tk-price{font-size:18px;width:68px}.tk-buy{width:65px}.tk-when{width:125px}.tk-trigger{border-radius:0;min-width:175px}.fd-wrap.left{flex-direction:row}.fd-cart{width:28%!important;border-left:3px solid var(--fg);border-radius:0;background:var(--panel)}.fd-menu{padding:12px 18px}.fd-card{border-radius:0}.fd-add{border-radius:2px}.fd-order{border-radius:2px}.fd-rname{font-size:22px}.fd-rmeta{font-size:12px}.fd-dialog,.as-dialog{border-radius:4px}.fl-form{border-radius:0}.at-win{left:0!important;top:0!important;width:100%!important;height:100%!important;border-radius:0;box-shadow:none}.at-title{height:30px;border-radius:0;background:var(--header,var(--panel));font-size:14px}.at-rail{display:none}.at-body{flex:1;min-height:0}.at-main{min-width:0}.at-pane-h{border-radius:0}.at-explorer{width:46%!important;max-width:none}.at-preview{padding:10px}.at-tree{font-family:inherit}.at-row svg{color:var(--fg)}.at-ed{padding:0!important}.at-pagearea{background:var(--panel);padding:0!important}.at-sheet{border:0;box-shadow:none;background:var(--panel);margin:0!important;width:100%!important;max-width:none!important;padding:26px 32px!important}.at-sheet h2{font-family:inherit}.at-tb{border-radius:0;padding:10px;background:var(--header,var(--panel))}.at-tool{border-radius:3px;font-family:inherit}.at-status{background:var(--panel)}.at-term{border-radius:0;border:0}.at-tscroll{padding:20px;font:15px/1.5 monospace}.at-term-tabs{background:var(--header,var(--panel))}.as-page{inset:0!important;display:flex;justify-content:stretch!important}.as-rail,.as-side{display:none}.as-col{flex:1!important;width:100%!important;border:0}.as-head{height:43px;background:var(--header,var(--panel));font-size:14px}.as-post{padding:13px 18px;gap:14px;border-bottom:1px solid var(--line)}.as-text{font-size:16px;line-height:1.4}.as-av{width:48px;height:48px;border-radius:4px;font-size:17px}.as-acts{max-width:440px;justify-content:flex-start;gap:22px}.as-act{border-radius:3px;height:30px;font-size:14px;padding:0 8px}.as-act svg{width:20px;height:20px}.as-photos{height:100px!important;border-radius:4px}.as-menu{border-radius:3px;min-width:210px}.as-mi{height:35px;font-size:14px}.as-confirm{border-radius:4px}.as-confirm button{border-radius:3px}.as-track{border-radius:0;width:15px;background:var(--line)}.as-thumb{border-radius:0}.as-name{font-size:16px}.as-handle,.as-time{font-size:13px}.as-quote{border-radius:3px}.as-link{border-radius:3px}.as-link.tall .as-link-img{height:65px}.as-post:has(.as-photos){min-height:200px}\n.site-shell{width:100%}.design-header{background:#e2f5ef;height:72px;flex-wrap:wrap}.site-shell{grid-template-rows:72px minmax(0,1fr) 60px}.design-brand{font-size:28px;color:#175d50}.design-nav{color:#175d50}.stage{margin-right:24%;border:2px solid #498879}.as-head{background:#195b4e;color:#fff}.bottom .task-note{background:#e9f5f0;color:#041d3d}.as-av{border-radius:6px}.end-control{background:#138974}";

  // Preserve the original filter for synthetic enter/leave events after a feed rebuild.
  // megawob-lint: allow wall-time phantom-hover filter after a rebuild, as in reference use-social-feed
  function realMove(e) {
    const q = window.__asPt.p;
    // megawob-lint: allow wall-time phantom-hover filter after a rebuild, as in reference use-social-feed
    return !q || e.clientX !== q[0] || e.clientY !== q[1] || performance.now() - (window.__asPt.built || 0) > 60;
  }

  env.widget({
    task: 'use-social-feed',
    site: 'design-use-social-feed-one-11',
    name: 'design',
    split: 'train',
    scenarios: ['one'],
    template: 'use-social-feed/feed',
    design: {
      css: DESIGN_CSS,
      labels: true,
      labelClass: false,
      detail: false,
      inlineActs: false,
      parts: {
        ready: () => () => {
          // megawob-lint: allow wall-time phantom-hover filter after a rebuild, as in reference use-social-feed
          if (!window.__asPt) {
            window.__asPt = { p: null };
            window.addEventListener('pointermove', (e) => {
              const q = [e.clientX, e.clientY];
              // megawob-lint: allow wall-time phantom-hover filter after a rebuild, as in reference use-social-feed
              setTimeout(() => { window.__asPt.p = q; }, 0);
            }, true);
          }
        },
        buildStart: () => () => {
          // megawob-lint: allow wall-time phantom-hover filter after a rebuild, as in reference use-social-feed
          window.__asPt.built = performance.now();
        },
        hover: () => (R, row, p) => {
          // Restore resting-pointer hover on passive post surfaces when an episode opens.
          // Reused controls and author labels still need a real move, as do later rebuilds.
          const fresh = !R.fd;
          const moved = (e) => {
            if (realMove(e)) return true;
            if (!fresh) return false;
            const hit = document.elementFromPoint(e.clientX, e.clientY);
            return hit && hit.matches('.as-post, .as-main, .as-text, .as-tag, .as-meta, .as-photos, .as-photo, .as-quote, .as-link-t');
          };
          row.addEventListener('pointerenter', (e) => {
            if (!moved(e)) return;
            if (R.ctx.model.hover !== p) R.up({ hover: p });
            R.markHover();
          });
          row.addEventListener('pointermove', (e) => {
            if (!moved(e)) return;
            if (R.ctx.model.hover !== p) { R.up({ hover: p }); R.markHover(); }
          });
          row.addEventListener('pointerleave', (e) => {
            if (!moved(e)) return;
            if (R.ctx.model.hover === p) R.up({ hover: null });
            R.markHover();
          });
        },
        restoreScroll: (base) => (R, B, m, keep, first) => {
          base(R, B, m, keep, first);
          if (first) {
            const maxScroll = Math.max(0, B.feed.scrollHeight - B.feed.clientHeight);
            B.feed.scrollTop = Math.round(maxScroll * Math.max(0, Math.min(1, Number(m.scroll) || 0)));
          }
        },
      },
    },
  });
})();
