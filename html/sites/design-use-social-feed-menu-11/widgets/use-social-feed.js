// This design uses a full-width timeline, portrait and banner imagery, and its site-specific menu placement.
(function () {
  'use strict';
  const PHOTO_URL = new URL('../assets/reference-photos.webp', document.currentScript.src).href;
  const PORTRAIT_URL = new URL('../assets/portrait-atlas.webp', document.currentScript.src).href;
  const BANNER_URL = new URL('../assets/architecture-banner.webp', document.currentScript.src).href;
  const DESIGN_CSS = "\n  .as-page { position: absolute; inset: 12px 16px; display: flex; overflow: hidden; font-size: var(--as-fs); }\n  .as-rail { flex: none; display: flex; flex-direction: column; gap: 2px; padding: 6px 12px 0 0; }\n  .as-logo { width: 42px; height: 42px; margin: 0 0 8px 4px; border-radius: 50%; display: flex; align-items: center; justify-content: center;\n    background: var(--accent); color: #fff; }\n  .as-logo svg { width: 22px; height: 22px; }\n  .as-nav { display: flex; align-items: center; gap: 16px; height: 46px; padding: 0 14px; border-radius: 23px; font-size: 18px; color: var(--fg); white-space: nowrap; }\n  .as-nav svg { flex: none; width: 24px; height: 24px; }\n  .as-nav.on { font-weight: 700; }\n  .as-nav .badge { position: absolute; margin: -16px 0 0 14px; min-width: 17px; height: 17px; padding: 0 4px; border-radius: 9px; background: var(--accent); color: #fff;\n    font-size: 11px; font-weight: 700; font-style: normal; display: flex; align-items: center; justify-content: center; }\n  .as-nav i { position: relative; display: flex; }\n  .as-postbtn { margin-top: 12px; height: 46px; border-radius: 23px; background: var(--accent); color: #fff; font-weight: 700; font-size: 16px;\n    display: flex; align-items: center; justify-content: center; }\n  .as-rail.slim .as-nav span, .as-rail.slim .as-postbtn span { display: none; }\n  .as-rail.slim .as-postbtn { width: 46px; }\n  .as-rail.slim .as-postbtn::after { content: '+'; font-size: 24px; font-weight: 400; }\n\n  .as-col { position: relative; flex: none; display: flex; flex-direction: column; min-height: 0; background: var(--panel);\n    border-left: 1px solid var(--line); border-right: 1px solid var(--line); }\n  .as-head { flex: none; display: flex; align-items: flex-end; height: 52px; padding: 0 0 0 16px; border-bottom: 1px solid var(--line); }\n  .as-head b { align-self: center; font-size: 19px; margin-right: auto; }\n  .as-head.split { padding: 0; }\n  .as-head.split b { display: none; }\n  .as-head.split .as-tab { flex: 1; justify-content: center; }\n  .as-tab { height: 100%; display: flex; align-items: center; padding: 0 18px; color: var(--muted); font-weight: 600; position: relative; cursor: default; }\n  .as-tab.live { cursor: pointer; }\n  .as-tab.live:hover { background: color-mix(in srgb, var(--fg) 4%, var(--panel)); }\n  .as-tab.on { color: var(--fg); }\n  .as-tab.on::after { content: ''; position: absolute; left: 18px; right: 18px; bottom: 0; height: 4px; border-radius: 2px; background: var(--accent); }\n  .as-head.split .as-tab.on::after { left: calc(50% - 30px); right: calc(50% - 30px); }\n  .as-box { flex: 1; min-height: 0; display: flex; }\n  .as-feed { flex: 1; min-width: 0; overflow-y: auto; overflow-x: hidden; overscroll-behavior: contain; scrollbar-width: none; }\n  .as-feed::-webkit-scrollbar { display: none; }\n  .as-track { position: relative; flex: none; width: 12px; margin: 3px 3px 3px 0; border-radius: 6px; cursor: pointer; touch-action: none;\n    background: color-mix(in srgb, var(--fg) 6%, var(--panel)); }\n  .as-thumb { position: absolute; left: 2px; right: 2px; border-radius: 4px; cursor: grab; touch-action: none;\n    background: color-mix(in srgb, var(--fg) 30%, var(--panel)); }\n  .as-thumb:hover, .as-thumb.drag { background: color-mix(in srgb, var(--fg) 48%, var(--panel)); }\n  .as-end { padding: 22px 0 26px; text-align: center; color: var(--muted); font-size: 13.5px; }\n  .as-loading { display: flex; align-items: center; justify-content: center; gap: 10px; padding: 20px 0 30px; color: var(--muted); font-size: 13.5px; }\n  .as-loading svg { width: 20px; height: 20px; }\n  .as-loading .arc { stroke: var(--accent); }\n  .as-loading .ring { stroke: color-mix(in srgb, var(--fg) 12%, transparent); }\n\n  .as-post { display: flex; gap: 12px; padding: var(--as-pad) 14px calc(var(--as-pad) - 4px) 16px; border-bottom: 1px solid var(--line); }\n  .as-post:hover { background: color-mix(in srgb, var(--fg) 2.5%, var(--panel)); }\n  .as-av { flex: none; width: 42px; height: 42px; border-radius: 50%; display: flex; align-items: center; justify-content: center;\n    color: #fff; font-weight: 700; font-size: 15px; letter-spacing: .02em; }\n  .as-main { flex: 1; min-width: 0; }\n  .as-meta { display: flex; align-items: center; gap: 5px; height: 22px; white-space: nowrap; }\n  .as-name { font-weight: 700; overflow: hidden; text-overflow: ellipsis; }\n  .as-handle, .as-time { color: var(--muted); }\n  .as-more { margin-left: auto; width: 32px; height: 32px; margin-right: -6px; border: 0; border-radius: 50%; padding: 0; display: flex; align-items: center; justify-content: center;\n    background: transparent; color: var(--muted); cursor: pointer; flex: none; }\n  .as-more svg { width: 20px; height: 20px; }\n  .as-more:hover, .as-more[aria-expanded=\"true\"] { color: var(--accent); background: color-mix(in srgb, var(--accent) 12%, transparent); }\n  .as-text { margin: 1px 0 6px; line-height: 1.38; overflow-wrap: anywhere; }\n  .as-tag { color: var(--accent); }\n  .as-showmore { color: var(--accent); cursor: pointer; font-weight: 600; margin-left: 4px; white-space: nowrap; }\n  .as-showmore:hover { text-decoration: underline; }\n  .as-photos { display: grid; gap: 3px; margin: 2px 0 8px; height: var(--as-ph); border-radius: 14px; overflow: hidden; border: 1px solid var(--line); }\n  .as-photo { position: relative; overflow: hidden; }\n  .as-photo svg { position: absolute; inset: 0; width: 100%; height: 100%; }\n  .as-alt { position: absolute; left: 8px; bottom: 8px; padding: 1px 6px; border-radius: 4px; background: rgba(0,0,0,.65); color: #fff;\n    font-size: 11px; font-weight: 700; letter-spacing: .03em; }\n  .as-link { display: flex; margin: 2px 0 8px; border: 1px solid var(--line); border-radius: 14px; overflow: hidden; }\n  .as-link.tall { flex-direction: column; }\n  .as-link-img { flex: none; width: 96px; min-height: 84px; }\n  .as-link.tall .as-link-img { width: auto; height: 92px; }\n  .as-link-t { padding: 10px 12px; min-width: 0; line-height: 1.3; }\n  .as-link-t small { display: block; color: var(--muted); font-size: 12.5px; margin-bottom: 2px; }\n  .as-link-t b { display: block; font-weight: 600; }\n  .as-quote { margin: 2px 0 8px; padding: 9px 12px; border: 1px solid var(--line); border-radius: 14px; }\n  .as-quote .as-meta { height: 20px; gap: 6px; font-size: .95em; }\n  .as-quote .as-av { width: 20px; height: 20px; font-size: 9px; }\n  .as-quote .as-text { margin: 3px 0 0; }\n  .as-acts { display: flex; justify-content: space-between; max-width: 430px; margin-left: -8px; }\n  .as-feed.hoverbar .as-post:not(:hover):not([data-hover]) .as-acts { opacity: 0; }\n  .as-act { display: flex; align-items: center; gap: 4px; height: 34px; padding: 0 8px; border: 0; border-radius: 17px; background: transparent;\n    color: var(--muted); font: inherit; font-size: 13px; cursor: pointer; }\n  .as-act svg { width: 19px; height: 19px; }\n  .as-act.reply:hover, .as-act.reply.on, .as-act.share:hover, .as-act.share.on { color: var(--accent); }\n  .as-act.retweet:hover, .as-act.retweet.on { color: #17a35a; }\n  .as-act.like:hover, .as-act.like.on { color: #e0245e; }\n  .as-act.on { font-weight: 700; }\n  .as-act:hover { background: color-mix(in srgb, currentColor 10%, transparent); }\n  .as-act.like.on svg path { fill: currentColor; }\n  .as-act.reply.on svg path, .as-act.share.on svg path { stroke-width: 2.5; }\n  .as-gone { display: flex; align-items: center; gap: 12px; padding: 14px 16px; border-bottom: 1px solid var(--line); color: var(--muted);\n    background: color-mix(in srgb, var(--fg) 3%, var(--panel)); }\n  .as-gone span { flex: 1; }\n  .as-undo { flex: none; padding: 5px 14px; border-radius: 15px; border: 1px solid var(--line); background: var(--panel); color: var(--fg);\n    font: inherit; font-weight: 700; font-size: 13px; cursor: pointer; }\n\n  .as-menu { position: absolute; z-index: 20; min-width: 250px; padding: 6px 0; border-radius: 12px; background: var(--panel);\n    border: 1px solid var(--line); box-shadow: 0 10px 30px rgba(0,0,0,.18), 0 2px 6px rgba(0,0,0,.08); }\n  .as-menu[hidden] { display: none; }\n  .as-mi { display: flex; align-items: center; gap: 12px; height: 42px; padding: 0 18px 0 16px; font-weight: 600; white-space: nowrap; cursor: pointer; }\n  .as-mi svg { flex: none; width: 19px; height: 19px; color: var(--muted); }\n  .as-mi[data-active] { background: color-mix(in srgb, var(--fg) 6%, var(--panel)); }\n  .as-mi.warn { color: #d6336c; }\n  .as-mi.warn svg { color: #d6336c; }\n  .as-toast { position: absolute; z-index: 15; left: 50%; bottom: 18px; transform: translateX(-50%); display: flex; align-items: center; gap: 14px;\n    padding: 9px 12px 9px 18px; border-radius: 8px; max-width: calc(100% - 40px);\n    background: var(--accent); color: #fff; font-weight: 600; white-space: nowrap; box-shadow: 0 6px 18px rgba(0,0,0,.2); }\n  .as-toast[hidden] { display: none; }\n  .as-toast span { overflow: hidden; text-overflow: ellipsis; }\n  .as-toast button { flex: none; padding: 4px 12px; border-radius: 14px; border: 1px solid rgba(255,255,255,.7); background: transparent; color: #fff;\n    font: inherit; font-weight: 700; cursor: pointer; }\n  .as-toast button[hidden] { display: none; }\n  .as-scrim { position: absolute; inset: 0; z-index: 30; background: rgba(15, 18, 25, .42); display: flex; align-items: center; justify-content: center; }\n  .as-scrim[hidden] { display: none; }\n  .as-confirm { width: 300px; padding: 22px 24px 18px; border-radius: 16px; background: var(--panel); box-shadow: 0 18px 50px rgba(0,0,0,.3); }\n  .as-confirm h3 { margin: 0 0 6px; font-size: 19px; }\n  .as-confirm p { margin: 0 0 16px; color: var(--muted); line-height: 1.4; font-size: 14px; }\n  .as-confirm button { display: block; width: 100%; height: 40px; margin-top: 8px; border-radius: 20px; font: inherit; font-weight: 700; cursor: pointer;\n    border: 1px solid var(--line); background: var(--panel); color: var(--fg); }\n  .as-confirm button.danger { background: #d6336c; border-color: #d6336c; color: #fff; }\n\n  .as-side { flex: none; width: 290px; padding: 4px 0 0 22px; display: flex; flex-direction: column; gap: 14px; overflow: hidden; }\n  .as-search { display: flex; align-items: center; gap: 10px; height: 42px; padding: 0 16px; border-radius: 21px; color: var(--muted);\n    background: color-mix(in srgb, var(--fg) 6%, var(--panel)); }\n  .as-search svg { width: 17px; height: 17px; }\n  .as-card { border-radius: 14px; background: color-mix(in srgb, var(--fg) 3%, var(--panel)); border: 1px solid var(--line); padding: 10px 0; }\n  .as-card h4 { margin: 0; padding: 2px 16px 8px; font-size: 18px; }\n  .as-trend { padding: 7px 16px; }\n  .as-trend small { display: block; color: var(--muted); font-size: 12.5px; }\n  .as-trend b { display: block; }\n  .as-who { display: flex; align-items: center; gap: 10px; padding: 7px 16px; }\n  .as-who .as-av { width: 38px; height: 38px; font-size: 13px; }\n  .as-who-t { flex: 1; min-width: 0; line-height: 1.25; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n  .as-who-t span { display: block; color: var(--muted); font-size: 13px; }\n  .as-follow { padding: 6px 14px; border-radius: 16px; background: var(--fg); color: var(--panel); font-weight: 700; font-size: 13px; }\n  \n\n.as-app{left:0!important;right:0!important;top:0!important;bottom:0!important;width:auto!important;border:0;border-radius:0;box-shadow:none}.as-top{display:none}.as-body{min-height:0}.as-btn{border-radius:3px;font-size:14px}.as-pane{border-radius:0}.se-main{padding:17px 22px!important;gap:0}.se-col{width:100%;max-width:none}.se-side{display:none}.se-box{border-radius:3px;box-shadow:none;height:39px;padding:0 12px}.se-go{border-radius:3px;height:39px;padding:0 22px}.se-card{border-bottom:1px solid var(--line);padding:8px 8px 4px}.se-card .se-title{font-family:inherit;font-size:19px}.se-pager{justify-content:center}.se-pg{border-radius:2px;width:32px;min-width:32px;height:32px}.se-fav{width:22px;height:22px;border-radius:1px}.se-url{font-size:12px}.se-desc{font-size:14px}.tk-main{padding:18px 22px}.tk-title{font-size:24px}.tk-date{border-radius:0;background:transparent}.tk-row{gap:12px;border-bottom:1px solid var(--line);padding:0 12px}.tk-name{font-size:15px}.tk-price{font-size:18px;width:68px}.tk-buy{width:65px}.tk-when{width:125px}.tk-trigger{border-radius:0;min-width:175px}.fd-wrap.left{flex-direction:row}.fd-cart{width:28%!important;border-left:3px solid var(--fg);border-radius:0;background:var(--panel)}.fd-menu{padding:12px 18px}.fd-card{border-radius:0}.fd-add{border-radius:2px}.fd-order{border-radius:2px}.fd-rname{font-size:22px}.fd-rmeta{font-size:12px}.fd-dialog,.as-dialog{border-radius:4px}.fl-form{border-radius:0}.at-win{left:0!important;top:0!important;width:100%!important;height:100%!important;border-radius:0;box-shadow:none}.at-title{height:30px;border-radius:0;background:var(--header,var(--panel));font-size:14px}.at-rail{display:none}.at-body{flex:1;min-height:0}.at-main{min-width:0}.at-pane-h{border-radius:0}.at-explorer{width:46%!important;max-width:none}.at-preview{padding:10px}.at-tree{font-family:inherit}.at-row svg{color:var(--fg)}.at-ed{padding:0!important}.at-pagearea{background:var(--panel);padding:0!important}.at-sheet{border:0;box-shadow:none;background:var(--panel);margin:0!important;width:100%!important;max-width:none!important;padding:26px 32px!important}.at-sheet h2{font-family:inherit}.at-tb{border-radius:0;padding:10px;background:var(--header,var(--panel))}.at-tool{border-radius:3px;font-family:inherit}.at-status{background:var(--panel)}.at-term{border-radius:0;border:0}.at-tscroll{padding:20px;font:15px/1.5 monospace}.at-term-tabs{background:var(--header,var(--panel))}.as-page{inset:0!important;display:flex;justify-content:stretch!important}.as-rail,.as-side{display:none}.as-col{flex:1!important;width:100%!important;border:0}.as-head{height:43px;background:var(--header,var(--panel));font-size:14px}.as-post{padding:13px 18px;gap:14px;border-bottom:1px solid var(--line)}.as-text{font-size:16px;line-height:1.4}.as-av{width:48px;height:48px;border-radius:4px;font-size:17px}.as-acts{max-width:440px;justify-content:flex-start;gap:22px}.as-act{border-radius:3px;height:30px;font-size:14px;padding:0 8px}.as-act svg{width:20px;height:20px}.as-photos{height:100px!important;border-radius:4px}.as-menu{border-radius:3px;min-width:210px}.as-mi{height:35px;font-size:14px}.as-confirm{border-radius:4px}.as-confirm button{border-radius:3px}.as-track{border-radius:0;width:15px;background:var(--line)}.as-thumb{border-radius:0}.as-name{font-size:16px}.as-handle,.as-time{font-size:13px}.as-quote{border-radius:3px}.as-link{border-radius:3px}.as-link.tall .as-link-img{height:65px}.as-post:has(.as-photos){min-height:200px}\n.design-header{background:#0d1523;color:#fff}.design-brand{font-size:32px;font-family:Impact,sans-serif}.design-nav{color:#fff}.task-note{background:#101826;color:#fff;font:27px/1.4 Impact,Arial Narrow,sans-serif;padding:25px 20px}.as-head{background:#f0f2f6}.as-post{border:1px solid #e5e6e9;margin:10px 14px;border-radius:9px}.as-av{border-radius:50%}.as-name{font-family:Arial,sans-serif}.as-text{font-family:Arial,sans-serif}.as-act{font-family:Arial,sans-serif}.end-control{background:#2464ff}.reference-overlay.cookie h2{background:#fff;color:#101826;font:35px Impact,sans-serif}";

  env.widget({
    task: 'use-social-feed',
    site: 'design-use-social-feed-menu-11',
    name: 'design',
    split: 'train',
    scenarios: ['menu'],
    template: 'use-social-feed/feed',
    design: {
      layout: 'plain',
      labels: false,
      siteCssLast: true,
      menuPlace: 'always',
      scrollSet: 'first',
      icons: {
        like: '<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z"/>',
      },
      css: DESIGN_CSS,
      parts: {
        header: () => (R) => {
          const { util, rng, spec } = R;
          const live = Object.keys(spec.lists).length > 1;
          R.live = live;
          R.head = util.el('div', 'as-head' + (live && rng.bool(0.5) ? ' split' : ''), R.col);
          util.el('b', '', R.head, 'Home');
          if (live) {
            for (const k of rng.bool(0.7) ? ['foryou', 'following'] : ['following', 'foryou']) {
              const t = util.el('div', 'as-tab live', R.head, { foryou: 'For you', following: 'Following' }[k]);
              t.dataset.role = 'tab';
              t.addEventListener('click', () => { if (R.ctx.model.tab !== k) { R.up({ tab: k }); R.paint(); } });
              R.tabEls[k] = t;
            }
          } else {
            rng.bool(0.4);
            util.el('div', 'as-tab on', R.head, 'For you');
            util.el('div', 'as-tab', R.head, 'Following');
          }
          for (const label of ['Tech', 'Design', 'Science', 'More ▾']) util.el('div', 'as-tab decorative', R.head, label);
        },
        avatar: (base) => (R, row, post, ...args) => {
          const av = base(R, row, post, ...args);
          const tile = R.handles.indexOf(post.handle) % 2;
          av.textContent = '';
          av.style.backgroundImage = `url(${PORTRAIT_URL})`;
          av.style.backgroundSize = '500% auto';
          av.style.backgroundPosition = `${tile * 25}% 35%`;
          av.title = post.name;
          return av;
        },
        media: (base, S) => (R, host, post, p) => {
          const { util } = R;
          // Leave enough room to show a whole post in compact episode layouts.
          const compact = R.box.clientHeight < 320;
          if (post.media && post.media.kind === 'photo') {
            const g = util.el('div', 'as-photos', host);
            if (compact) g.style.maxHeight = Math.max(55, R.box.clientHeight / 4) + 'px';
            g.style.backgroundImage = `linear-gradient(#d5e4f329,#d5e4f329),url(${BANNER_URL})`;
            g.style.backgroundSize = 'cover';
            g.style.backgroundPosition = 'center 20%';
            const n = post.media.n;
            g.style.gridTemplateColumns = n === 1 ? '1fr' : '1fr 1fr';
            g.style.gridTemplateRows = n > 2 ? '1fr 1fr' : '1fr';
            for (let k = 0; k < n; k++) {
              const ph = util.el('div', 'as-photo', g);
              if (n === 3 && k === 0) ph.style.gridRow = 'span 2';
              ph.style.background = 'transparent';
              ph.title = post.media.alt;
              if (k === 0) util.el('span', 'as-alt', ph, 'ALT');
            }
          } else if (post.media && post.media.kind === 'link') {
            const c = util.el('div', 'as-link' + (R.tallLinks ? ' tall' : ''), host);
            const img = util.el('div', 'as-link-img', c);
            if (compact) img.style.minHeight = '0';
            img.style.backgroundImage = `url(${PHOTO_URL})`;
            img.style.backgroundSize = '300% auto';
            img.style.backgroundPosition = '0% 50%';
            const t = util.el('div', 'as-link-t', c);
            util.el('small', '', t, post.media.domain);
            util.el('b', '', t, post.media.title);
          }
          if (post.quote) S.P.quote(R, host, post, p);
        },
        placeMenu: (base) => (R, panel, trigger) => {
          const c = R.col.getBoundingClientRect();
          const t = trigger.getBoundingClientRect();
          const b = R.box.getBoundingClientRect();
          const w = panel.offsetWidth;
          const h = panel.offsetHeight;
          const tools = document.querySelector('.chrome-tools').getBoundingClientRect();
          const minTop = Math.max(c.top + 4, tools.height ? tools.bottom + 8 : c.top + 4);
          const stageBounds = R.ctx.stage.getBoundingClientRect();
          panel.style.left = Math.round(Math.max(8, Math.min(t.left - c.left - 12, stageBounds.right - c.left - w - 8))) + 'px';
          const below = t.bottom + 10;
          const bottom = Math.min(b.bottom, c.bottom);
          const top = below + h <= bottom - 4 ? Math.max(minTop, below) : Math.max(minTop, Math.min(t.top - 4 - h, bottom - h - 4));
          panel.style.top = Math.round(top - c.top) + 'px';
          panel.classList.toggle('above', top < below);
        },
      },
    },
  });
})();
