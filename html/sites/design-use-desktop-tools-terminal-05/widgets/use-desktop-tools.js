// RISC OS terminal frame, custom scroll controls, and seeded shell transcript.
(function () {
  'use strict';
  const DESIGN_CSS = "\n.as-app{left:0!important;right:0!important;top:0!important;bottom:0!important;width:auto!important;border:0;border-radius:0;box-shadow:none}.as-top{display:none}.as-body{min-height:0}.as-btn{border-radius:3px;font-size:14px}.as-pane{border-radius:0}.se-main{padding:17px 22px!important;gap:0}.se-col{width:100%;max-width:none}.se-side{display:none}.se-box{border-radius:3px;box-shadow:none;height:39px;padding:0 12px}.se-go{border-radius:3px;height:39px;padding:0 22px}.se-card{border-bottom:1px solid var(--line);padding:8px 8px 4px}.se-card .se-title{font-family:inherit;font-size:19px}.se-pager{justify-content:center}.se-pg{border-radius:2px;width:32px;min-width:32px;height:32px}.se-fav{width:22px;height:22px;border-radius:1px}.se-url{font-size:12px}.se-desc{font-size:14px}.tk-main{padding:18px 22px}.tk-title{font-size:24px}.tk-date{border-radius:0;background:transparent}.tk-row{gap:12px;border-bottom:1px solid var(--line);padding:0 12px}.tk-name{font-size:15px}.tk-price{font-size:18px;width:68px}.tk-buy{width:65px}.tk-when{width:125px}.tk-trigger{border-radius:0;min-width:175px}.fd-wrap.left{flex-direction:row}.fd-cart{width:28%!important;border-left:3px solid var(--fg);border-radius:0;background:var(--panel)}.fd-menu{padding:12px 18px}.fd-card{border-radius:0}.fd-add{border-radius:2px}.fd-order{border-radius:2px}.fd-rname{font-size:22px}.fd-rmeta{font-size:12px}.fd-dialog,.as-dialog{border-radius:4px}.fl-form{border-radius:0}.at-win{left:0!important;top:0!important;width:100%!important;height:100%!important;border-radius:0;box-shadow:none}.at-title{height:30px;border-radius:0;background:var(--header,var(--panel));font-size:14px}.at-rail{display:none}.at-body{flex:1;min-height:0}.at-main{min-width:0}.at-pane-h{border-radius:0}.at-explorer{width:46%!important;max-width:none}.at-preview{padding:10px}.at-tree{font-family:inherit}.at-row svg{color:var(--fg)}.at-ed{padding:0!important}.at-pagearea{background:var(--panel);padding:0!important}.at-sheet{border:0;box-shadow:none;background:var(--panel);margin:0!important;width:100%!important;max-width:none!important;padding:26px 32px!important}.at-sheet h2{font-family:inherit}.at-tb{border-radius:0;padding:10px;background:var(--header,var(--panel))}.at-tool{border-radius:3px;font-family:inherit}.at-status{background:var(--panel)}.at-term{border-radius:0;border:0}.at-tscroll{padding:20px;font:15px/1.5 monospace}.at-term-tabs{background:var(--header,var(--panel))}.as-page{inset:0!important;display:flex;justify-content:stretch!important}.as-rail,.as-side{display:none}.as-col{flex:1!important;width:100%!important;border:0}.as-head{height:43px;background:var(--header,var(--panel));font-size:14px}.as-post{padding:13px 18px;gap:14px;border-bottom:1px solid var(--line)}.as-text{font-size:16px;line-height:1.4}.as-av{width:48px;height:48px;border-radius:4px;font-size:17px}.as-acts{max-width:440px;justify-content:flex-start;gap:22px}.as-act{border-radius:3px;height:30px;font-size:14px;padding:0 8px}.as-act svg{width:20px;height:20px}.as-photos{height:100px!important;border-radius:4px}.as-menu{border-radius:3px;min-width:210px}.as-mi{height:35px;font-size:14px}.as-confirm{border-radius:4px}.as-confirm button{border-radius:3px}.as-track{border-radius:0;width:15px;background:var(--line)}.as-thumb{border-radius:0}.as-name{font-size:16px}.as-handle,.as-time{font-size:13px}.as-quote{border-radius:3px}.as-link{border-radius:3px}.as-link.tall .as-link-img{height:65px}.as-post:has(.as-photos){min-height:200px}\n.design-header{background:#f4d83a;color:#000;border:2px outset #fbe779}.design-brand{font-size:23px}.design-nav{color:#161616}.task-note{background:#c7c9d0;color:#101639;font-size:21px}.task-note p{background:#eee9b3;border:1px solid #decc67;padding:16px}.task-note h2{font-size:27px}.at-title{background:#f4d83a;color:#000}.at-term-tabs{background:#c7c9d0;color:#111}.at-tscroll{background:#000;color:#eee}.end-control{background:#c7c9d0;color:#101639;border:2px outset #ddd;border-radius:0}.reference-overlay{background:#c7c9d0;border:3px ridge #ddd;border-radius:0}.reference-overlay h2{background:#bfc0c8;color:#101639}";

  env.widget({
    task: 'use-desktop-tools',
    site: 'design-use-desktop-tools-terminal-05',
    name: 'design',
    split: 'train',
    scenarios: ['terminal'],
    traits: { meta: true },
    template: 'use-desktop-tools/workspace',
    design: {
      frame: 'plain',
      frameTitle: 'Terminal',
      siteCssLast: true,
      css: DESIGN_CSS,
      placeholder: ' ',
      parts: {
        termSetup: () => (X) => {
          X.startupTranscript = X.ctx.model.history.some((h) => /^ls(?:\s|$)/.test(h.cmd));
        },

        frame: (base) => (ctx) => {
          const { util } = ctx;
          const win = util.el('section', 'at-win', ctx.stage);
          const title = util.el('div', 'at-title', win);
          const app = util.el('span', 'title-app', title);
          app.innerHTML = '<svg viewBox="0 0 30 30"><path d="M3 5h22v21H3z" fill="#dadccf" stroke="#555"/><path d="M5 9l8-5 9 5 3 9-8 9-10-4z" fill="#36ae43" stroke="#397334"/><path d="M7 11l6-5 7 6-4 10-6-2z" fill="#d5eb74"/><path d="M13 8l5 4-6 7-4-5z" fill="#4daa4d"/><path d="M21 5l4-2 2 5-6 2z" fill="#ee443b"/><path d="M6 24l17-16M9 5l10 18" stroke="#eee587"/></svg>';
          util.el('b', '', title, 'Terminal');
          const body = util.el('div', 'at-body', win);
          const main = util.el('div', 'at-main', body);
          const gear = util.el('button', '', title);
          gear.hidden = true;
          return { win, title, main, gear, appMenu: null };
        },

        termScroller: () => (X) => {
          const { util, term, sc } = X;
          const scrollbar = util.el('div', 'at-scrollbar', term);
          const scrollUp = util.el('button', 'at-scroll-up', scrollbar);
          scrollUp.type = 'button';
          scrollUp.setAttribute('aria-label', 'Scroll terminal up');
          const track = util.el('div', 'at-scroll-track', scrollbar);
          const thumb = util.el('div', 'at-scroll-thumb', track);
          const scrollDown = util.el('button', 'at-scroll-down', scrollbar);
          scrollDown.type = 'button';
          scrollDown.setAttribute('aria-label', 'Scroll terminal down');
          const syncScroll = () => {
            const ratio = Math.min(1, sc.clientHeight / Math.max(1, sc.scrollHeight));
            thumb.style.height = ratio * 100 + '%';
            thumb.style.top = sc.scrollTop / Math.max(1, sc.scrollHeight - sc.clientHeight) * (1 - ratio) * 100 + '%';
          };
          scrollUp.addEventListener('click', () => { sc.scrollTop -= sc.clientHeight * .6; syncScroll(); });
          scrollDown.addEventListener('click', () => { sc.scrollTop += sc.clientHeight * .6; syncScroll(); });
          sc.addEventListener('scroll', syncScroll);
          let drag = null;
          thumb.addEventListener('pointerdown', (e) => {
            drag = { y: e.clientY, top: sc.scrollTop };
            thumb.setPointerCapture(e.pointerId);
            e.preventDefault();
          });
          thumb.addEventListener('pointermove', (e) => {
            if (drag) sc.scrollTop = drag.top + (e.clientY - drag.y) * sc.scrollHeight / Math.max(1, track.clientHeight);
          });
          thumb.addEventListener('pointerup', () => { drag = null; });
          track.addEventListener('click', (e) => {
            if (e.target === track) {
              const r = track.getBoundingClientRect();
              sc.scrollTop = (e.clientY - r.top) / r.height * sc.scrollHeight;
            }
          });
          X.syncScroll = syncScroll;
        },

        termReady: () => (X) => {
          const { ctx, util, spec, sc, prompt } = X;
          sc.style.fontSize = `min(clamp(16px,1.67vw,28px), ${(sc.clientHeight - 38) / ((spec.files.length + 3) * 1.24)}px)`;
          const cursor = util.el('span', 'at-block-cursor', prompt);
          cursor.setAttribute('aria-hidden', 'true');
        },

        termPs: (base) => (X, cwd) =>
          `<span class="at-ps">&lt;${cwd ? cwd.split('/').pop() : 'Wimp'}$&gt;</span>`,

        termWelcome: () => (X) => {
          const { spec, ctx, line } = X;
          line('dim', 'RISC OS Shell (v3.11)');
          line('dim', 'Copyright (C) 1989 Acorn Computers Ltd.');
          line('dim', 'Type help for help.');
          line('', '');
          if (X.startupTranscript) return;
          line('out', `Current directory: ${ctx.model.cwd ? '~/' + ctx.model.cwd : '/home/user'}`);
          // Keep the startup listing independent of the requested file or folder.
          const folder = '';
          line('out', `Files in ${folder ? '~/' + folder : '~'}:`);
          for (const f of spec.files.filter((f) => f.slice(0, Math.max(0, f.lastIndexOf('/'))) === folder)) {
            const name = f.slice(f.lastIndexOf('/') + 1);
            const meta = spec.meta && spec.meta[f];
            line('out', meta ? name.padEnd(24) + ' ' + String(meta.size).padStart(5) + '  ' + meta.mtime : name);
          }
          const more = X.util.el('details', 'at-other-files', X.lines);
          more.addEventListener('toggle', X.syncScroll);
          X.util.el('summary', '', more, 'Other workspace files');
          for (const f of spec.files.filter((f) => f.slice(0, Math.max(0, f.lastIndexOf('/'))) !== folder))
            X.util.el('div', 'at-tl out', more, '~/' + f);
          line('', '');
        },

        termScroll: (base) => (X, m) => {
          base(X, m);
          X.syncScroll();
        },
      },
    },
  });
})();
