// Aqua terminal design: preserves the custom frame, scrollbar and startup transcript.
(function () {
  'use strict';

  const DESIGN_CSS = "\n.as-app{left:0!important;right:0!important;top:0!important;bottom:0!important;width:auto!important;border:0;border-radius:0;box-shadow:none}.as-top{display:none}.as-body{min-height:0}.as-btn{border-radius:3px;font-size:14px}.as-pane{border-radius:0}.se-main{padding:17px 22px!important;gap:0}.se-col{width:100%;max-width:none}.se-side{display:none}.se-box{border-radius:3px;box-shadow:none;height:39px;padding:0 12px}.se-go{border-radius:3px;height:39px;padding:0 22px}.se-card{border-bottom:1px solid var(--line);padding:8px 8px 4px}.se-card .se-title{font-family:inherit;font-size:19px}.se-pager{justify-content:center}.se-pg{border-radius:2px;width:32px;min-width:32px;height:32px}.se-fav{width:22px;height:22px;border-radius:1px}.se-url{font-size:12px}.se-desc{font-size:14px}.tk-main{padding:18px 22px}.tk-title{font-size:24px}.tk-date{border-radius:0;background:transparent}.tk-row{gap:12px;border-bottom:1px solid var(--line);padding:0 12px}.tk-name{font-size:15px}.tk-price{font-size:18px;width:68px}.tk-buy{width:65px}.tk-when{width:125px}.tk-trigger{border-radius:0;min-width:175px}.fd-wrap.left{flex-direction:row}.fd-cart{width:28%!important;border-left:3px solid var(--fg);border-radius:0;background:var(--panel)}.fd-menu{padding:12px 18px}.fd-card{border-radius:0}.fd-add{border-radius:2px}.fd-order{border-radius:2px}.fd-rname{font-size:22px}.fd-rmeta{font-size:12px}.fd-dialog,.as-dialog{border-radius:4px}.fl-form{border-radius:0}.at-win{left:0!important;top:0!important;width:100%!important;height:100%!important;border-radius:0;box-shadow:none}.at-title{height:30px;border-radius:0;background:var(--header,var(--panel));font-size:14px}.at-rail{display:none}.at-body{flex:1;min-height:0}.at-main{min-width:0}.at-pane-h{border-radius:0}.at-explorer{width:46%!important;max-width:none}.at-preview{padding:10px}.at-tree{font-family:inherit}.at-row svg{color:var(--fg)}.at-ed{padding:0!important}.at-pagearea{background:var(--panel);padding:0!important}.at-sheet{border:0;box-shadow:none;background:var(--panel);margin:0!important;width:100%!important;max-width:none!important;padding:26px 32px!important}.at-sheet h2{font-family:inherit}.at-tb{border-radius:0;padding:10px;background:var(--header,var(--panel))}.at-tool{border-radius:3px;font-family:inherit}.at-status{background:var(--panel)}.at-term{border-radius:0;border:0}.at-tscroll{padding:20px;font:15px/1.5 monospace}.at-term-tabs{background:var(--header,var(--panel))}.as-page{inset:0!important;display:flex;justify-content:stretch!important}.as-rail,.as-side{display:none}.as-col{flex:1!important;width:100%!important;border:0}.as-head{height:43px;background:var(--header,var(--panel));font-size:14px}.as-post{padding:13px 18px;gap:14px;border-bottom:1px solid var(--line)}.as-text{font-size:16px;line-height:1.4}.as-av{width:48px;height:48px;border-radius:4px;font-size:17px}.as-acts{max-width:440px;justify-content:flex-start;gap:22px}.as-act{border-radius:3px;height:30px;font-size:14px;padding:0 8px}.as-act svg{width:20px;height:20px}.as-photos{height:100px!important;border-radius:4px}.as-menu{border-radius:3px;min-width:210px}.as-mi{height:35px;font-size:14px}.as-confirm{border-radius:4px}.as-confirm button{border-radius:3px}.as-track{border-radius:0;width:15px;background:var(--line)}.as-thumb{border-radius:0}.as-name{font-size:16px}.as-handle,.as-time{font-size:13px}.as-quote{border-radius:3px}.as-link{border-radius:3px}.as-link.tall .as-link-img{height:65px}.as-post:has(.as-photos){min-height:200px}\n.design-header{background:linear-gradient(#fff,#c3d6eb);height:27px}.site-shell{grid-template-rows:27px minmax(0,1fr) 70px}.design-brand{font-size:15px}.design-nav{font-size:14px;color:#111}.at-win{border:2px solid #bac8d2;border-radius:10px;box-shadow:0 8px 20px #0004}.at-title{background:linear-gradient(#f9f9f9,#b3b6ba);height:30px;color:#111}.at-tscroll{background:#fff;color:#000}.at-prompt input{color:#000!important}.at-ps,.at-pc{color:#000!important}.at-term-tabs{display:none}.at-tl.dim{color:#111}.task-note{background:linear-gradient(#eff8ff,#d2e7fc);color:#00387b}.end-control{border:2px solid #16458e;border-radius:18px;background:linear-gradient(#cee8ff 1%,#1674ed 44%,#0757ca 55%,#4595f4);box-shadow:0 2px 4px #0005}.design-footer:before{content:\"Finder     Safari     Mail     Calendar     Music     Photos     Preferences     Terminal\";background:#a4bfdd8a;padding:16px 25px;border:1px solid #b4cce8;color:#fff;border-radius:7px;font-size:14px}";

  env.widget({
    task: 'use-desktop-tools',
    site: 'design-use-desktop-tools-terminal-01',
    name: 'design',
    split: 'train',
    scenarios: ['terminal'],
    template: 'use-desktop-tools/workspace',
    design: {
      host: 'user@workspace',
      placeholder: ' ',
      siteCssLast: true,
      css: DESIGN_CSS,
      parts: {
        plainFrame: () => (ctx) => {
          const { util } = ctx;
          const win = util.el('section', 'at-win', ctx.stage);
          const title = util.el('div', 'at-title', win);
          const traffic = util.el('div', 'at-traffic', title);
          for (const color of ['red', 'amber', 'green']) util.el('span', color, traffic);
          util.el('b', '', title, 'Terminal — bash — 80×24');
          const body = util.el('div', 'at-body', win);
          const main = util.el('div', 'at-main', body);
          const gear = util.el('button', '', title);
          gear.hidden = true;
          return { win, title, main, gear, appMenu: null };
        },
        termScroller: () => (X) => {
          const { util, sc, term } = X;
          const rail = util.el('div', 'aqua-scrollbar', term);
          const up = util.el('button', 'scroll-up', rail, '▲');
          const track = util.el('div', 'scroll-track', rail);
          const thumb = util.el('div', 'scroll-thumb', track);
          const down = util.el('button', 'scroll-down', rail, '▼');
          up.type = down.type = 'button';
          up.setAttribute('aria-label', 'Scroll terminal up');
          down.setAttribute('aria-label', 'Scroll terminal down');
          up.addEventListener('click', () => { sc.scrollTop -= sc.clientHeight * .4; });
          down.addEventListener('click', () => { sc.scrollTop += sc.clientHeight * .4; });
          X.scrollPaint = () => {
            const portion = Math.min(.84, sc.clientHeight / Math.max(1, sc.scrollHeight));
            thumb.style.height = (portion * 100) + '%';
            thumb.style.top = ((sc.scrollTop / Math.max(1, sc.scrollHeight - sc.clientHeight)) * (1 - portion) * 100) + '%';
          };
          sc.addEventListener('scroll', X.scrollPaint);
          thumb.addEventListener('pointerdown', (e) => {
            e.preventDefault();
            thumb.setPointerCapture(e.pointerId);
            const initial = sc.scrollTop, start = e.clientY;
            const move = (e) => {
              sc.scrollTop = initial + (e.clientY - start) * Math.max(1, sc.scrollHeight - sc.clientHeight) /
                Math.max(1, track.clientHeight - thumb.clientHeight);
            };
            const release = () => {
              thumb.removeEventListener('pointermove', move);
              thumb.removeEventListener('pointerup', release);
              thumb.removeEventListener('pointercancel', release);
            };
            thumb.addEventListener('pointermove', move);
            thumb.addEventListener('pointerup', release);
            thumb.addEventListener('pointercancel', release);
          });
        },
        termWelcome: () => (X) => {
          const { spec, line } = X;
          line('dim', `Last login: ${spec.login}`);
          line('', 'user@workspace:~$ ls -R');
          for (const f of spec.files) line('out', '-rw-r--r--  1 user staff  ~/' + f);
        },
        termScroll: (base) => (X, m) => {
          base(X, m);
          X.scrollPaint();
        },
      },
    },
  });
})();
