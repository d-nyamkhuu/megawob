// Design of this site on the use-social-feed/feed template (templates/use-social-feed/feed.js): a "Mentions" list (no
// rail or sidebar) with a select box and a reply draft on every post, and a selection count in the frame.
(function () {
  'use strict';
  let removeClickHover;
  // CSS crops only the five supplied avatar photographs from the reference.
  const AVATAR_URL = new URL('../assets/reference-avatars.webp', document.currentScript.src).href;
  const DESIGN_CSS = "\n.as-app{left:0!important;right:0!important;top:0!important;bottom:0!important;width:auto!important;border:0;border-radius:0;box-shadow:none}.as-top{display:none}.as-body{min-height:0}.as-btn{border-radius:3px;font-size:14px}.as-pane{border-radius:0}.se-main{padding:17px 22px!important;gap:0}.se-col{width:100%;max-width:none}.se-side{display:none}.se-box{border-radius:3px;box-shadow:none;height:39px;padding:0 12px}.se-go{border-radius:3px;height:39px;padding:0 22px}.se-card{border-bottom:1px solid var(--line);padding:8px 8px 4px}.se-card .se-title{font-family:inherit;font-size:19px}.se-pager{justify-content:center}.se-pg{border-radius:2px;width:32px;min-width:32px;height:32px}.se-fav{width:22px;height:22px;border-radius:1px}.se-url{font-size:12px}.se-desc{font-size:14px}.tk-main{padding:18px 22px}.tk-title{font-size:24px}.tk-date{border-radius:0;background:transparent}.tk-row{gap:12px;border-bottom:1px solid var(--line);padding:0 12px}.tk-name{font-size:15px}.tk-price{font-size:18px;width:68px}.tk-buy{width:65px}.tk-when{width:125px}.tk-trigger{border-radius:0;min-width:175px}.fd-wrap.left{flex-direction:row}.fd-cart{width:28%!important;border-left:3px solid var(--fg);border-radius:0;background:var(--panel)}.fd-menu{padding:12px 18px}.fd-card{border-radius:0}.fd-add{border-radius:2px}.fd-order{border-radius:2px}.fd-rname{font-size:22px}.fd-rmeta{font-size:12px}.fd-dialog,.as-dialog{border-radius:4px}.fl-form{border-radius:0}.at-win{left:0!important;top:0!important;width:100%!important;height:100%!important;border-radius:0;box-shadow:none}.at-title{height:30px;border-radius:0;background:var(--header,var(--panel));font-size:14px}.at-rail{display:none}.at-body{flex:1;min-height:0}.at-main{min-width:0}.at-pane-h{border-radius:0}.at-explorer{width:46%!important;max-width:none}.at-preview{padding:10px}.at-tree{font-family:inherit}.at-row svg{color:var(--fg)}.at-ed{padding:0!important}.at-pagearea{background:var(--panel);padding:0!important}.at-sheet{border:0;box-shadow:none;background:var(--panel);margin:0!important;width:100%!important;max-width:none!important;padding:26px 32px!important}.at-sheet h2{font-family:inherit}.at-tb{border-radius:0;padding:10px;background:var(--header,var(--panel))}.at-tool{border-radius:3px;font-family:inherit}.at-status{background:var(--panel)}.at-term{border-radius:0;border:0}.at-tscroll{padding:20px;font:15px/1.5 monospace}.at-term-tabs{background:var(--header,var(--panel))}.as-page{inset:0!important;display:flex;justify-content:stretch!important}.as-rail,.as-side{display:none}.as-col{flex:1!important;width:100%!important;border:0}.as-head{height:43px;background:var(--header,var(--panel));font-size:14px}.as-post{padding:13px 18px;gap:14px;border-bottom:1px solid var(--line)}.as-text{font-size:16px;line-height:1.4}.as-av{width:48px;height:48px;border-radius:4px;font-size:17px}.as-acts{max-width:440px;justify-content:flex-start;gap:22px}.as-act{border-radius:3px;height:30px;font-size:14px;padding:0 8px}.as-act svg{width:20px;height:20px}.as-photos{height:100px!important;border-radius:4px}.as-menu{border-radius:3px;min-width:210px}.as-mi{height:35px;font-size:14px}.as-confirm{border-radius:4px}.as-confirm button{border-radius:3px}.as-track{border-radius:0;width:15px;background:var(--line)}.as-thumb{border-radius:0}.as-name{font-size:16px}.as-handle,.as-time{font-size:13px}.as-quote{border-radius:3px}.as-link{border-radius:3px}.as-link.tall .as-link-img{height:65px}.as-post:has(.as-photos){min-height:200px}\n.design-header{background:repeating-linear-gradient(45deg,#e6edf7 0 4px,#dce6f2 4px 6px)}.design-brand{font:700 42px Georgia}.design-nav{font:18px Georgia;color:#000043}.task-note{background:#ffffdf;margin:10px;padding:20px;font-size:21px;border:2px ridge #9ca7c1}.stage{margin:10px;border:3px ridge #b3bbd5}.as-head{background:#adbfed}.as-post{border-bottom:1px solid #7d83a0}.as-act{background:#e7e7ee;border:2px outset #dadce5;color:#000040}.as-av{border-radius:0;border:2px solid #00003b}.as-name{color:#0000bf}.design-footer{background:#efdff5;border:3px ridge #c0b0cb}.end-control{background:#d8dbe5;color:#000;border:2px outset #eee;font-family:Georgia}";

  env.widget({
    task: 'use-social-feed',
    site: 'design-use-social-feed-all-12',
    name: 'design',
    split: 'train',
    scenarios: ['all'],
    template: 'use-social-feed/feed',
    design: {
      scenarioDecor: false,
      icons: {},
      css: DESIGN_CSS,
      siteCssLast: true,
      layout: 'plain',
      title: 'Mentions',
      labels: true,
      timeFormat: 'plain',
      photoSheet: 'reference-photos.webp',
      menuBounds: 'column',
      parts: {
        // Selection and reply drafts are unscored workspace controls. They do not alter the task's action
        // toggles, recovery state, or seeded content.
        begin: () => (R) => {
          if (removeClickHover) removeClickHover();
          // Removing an overlay can reveal a post under the stationary pointer before its native enter event.
          // Mirror that hover during the dismissing click so the next action sees the revealed controls.
          const moveHover = (event) => {
            if (!R.x.revealedHover) return;
            R.x.revealedHover = false;
            const row = event.target.closest && event.target.closest('.as-post');
            if (!row && R.ctx.model.hover !== null) {
              R.up({ hover: null });
              R.markHover();
            }
          };
          const clickHover = (event) => {
            if (!R.page || !R.page.isConnected || R.page.contains(event.target) || !R.fd) return;
            const hit = document.elementFromPoint(event.clientX, event.clientY);
            const row = hit && hit.closest('.as-post');
            const entry = row && [...R.fd.rows].find(([, el]) => el === row);
            if (entry) R.x.revealedHover = true;
            if (entry && R.ctx.model.hover !== entry[0]) {
              R.up({ hover: entry[0] });
              R.markHover();
            }
          };
          document.addEventListener('click', clickHover);
          document.addEventListener('pointermove', moveHover);
          removeClickHover = () => {
            document.removeEventListener('click', clickHover);
            document.removeEventListener('pointermove', moveHover);
          };
          R.x.selected = new Set();
          R.x.drafts = new Map();
          R.x.paintSelection = () => {
            const count = R.F.helpers.feedOf(R.spec, R.ctx.model).length;
            const badge = document.querySelector('.mbadge');
            const label = document.querySelector('.footer-label');
            if (badge) badge.textContent = String(count);
            if (label) label.textContent = `${R.x.selected.size} of ${count} selected`;
          };
        },
        synced: () => (R) => R.x.paintSelection(),
        rowMade: () => (R, row, post, p) => {
          const check = R.util.el('input', 'as-select', row);
          check.type = 'checkbox';
          check.setAttribute('aria-label', `Select post from ${post.handle}`);
          check.checked = R.x.selected.has(p);
          check.addEventListener('change', () => {
            if (check.checked) R.x.selected.add(p);
            else R.x.selected.delete(p);
            R.x.paintSelection();
          });
        },
        avatar: (base, S) => (R, row, post) => {
          const av = R.util.el('div', 'as-av', row, S.initials(post.name));
          av.textContent = '';
          const avatarTile = R.handles.indexOf(post.handle) % 5;
          av.style.backgroundImage = `url(${AVATAR_URL})`;
          av.style.backgroundSize = '2612.5% 1425.757576%';
          av.style.backgroundPosition = `4.539801% ${[25.828571, 39.2, 52.8, 66.857143, 80.8][avatarTile]}%`;
          av.title = post.name;
          return av;
        },
        // The draft box leads the action row.
        beforeAct: () => (R, acts, b, p, post) => {
          if (b !== R.F.helpers.BUTTONS[0]) return;
          const draft = R.util.el('textarea', 'as-reply-draft', acts);
          draft.placeholder = 'Write a reply...';
          draft.setAttribute('aria-label', `Write a reply to ${post.handle}`);
          draft.rows = 2;
          draft.value = R.x.drafts.get(p) || '';
          draft.addEventListener('input', () => R.x.drafts.set(p, draft.value));
        },
        keepOf: () => (R, m) => (R.fd && R.builtKey && JSON.parse(R.builtKey)[0] === m.tab ? R.fd.feed.scrollTop : null),
        restoreScroll: () => (R, B, m, keep) => {
          R.fd = B;
          if (keep === null) B.lbx.set({ scroll: m.scroll });
          else { B.feed.scrollTop = keep; B.lbx.set({}); }
        },
        // Native scroll extents and clientHeight round independently, while row bounds keep subpixels: allow
        // a pixel of rounding at the pane edges so a fully reachable final row is not scrolled forever.
        inView: () => (R, p, row, r, top0, h) => r.top >= top0 - 1 && r.bottom <= top0 + h + 1,
      },
    },
  });
})();
