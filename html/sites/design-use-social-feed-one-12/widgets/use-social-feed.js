// Design of this site on the use-social-feed/feed template (templates/use-social-feed/feed.js): one timeline column
// (no rail or sidebar) in a photo-avatar app, with goal-independent workspace help
// below the frame's instruction.
(function () {
  'use strict';
  const DESIGN_CSS = "\n.as-app{left:0!important;right:0!important;top:0!important;bottom:0!important;width:auto!important;border:0;border-radius:0;box-shadow:none}.as-top{display:none}.as-body{min-height:0}.as-btn{border-radius:3px;font-size:14px}.as-pane{border-radius:0}.se-main{padding:17px 22px!important;gap:0}.se-col{width:100%;max-width:none}.se-side{display:none}.se-box{border-radius:3px;box-shadow:none;height:39px;padding:0 12px}.se-go{border-radius:3px;height:39px;padding:0 22px}.se-card{border-bottom:1px solid var(--line);padding:8px 8px 4px}.se-card .se-title{font-family:inherit;font-size:19px}.se-pager{justify-content:center}.se-pg{border-radius:2px;width:32px;min-width:32px;height:32px}.se-fav{width:22px;height:22px;border-radius:1px}.se-url{font-size:12px}.se-desc{font-size:14px}.tk-main{padding:18px 22px}.tk-title{font-size:24px}.tk-date{border-radius:0;background:transparent}.tk-row{gap:12px;border-bottom:1px solid var(--line);padding:0 12px}.tk-name{font-size:15px}.tk-price{font-size:18px;width:68px}.tk-buy{width:65px}.tk-when{width:125px}.tk-trigger{border-radius:0;min-width:175px}.fd-wrap.left{flex-direction:row}.fd-cart{width:28%!important;border-left:3px solid var(--fg);border-radius:0;background:var(--panel)}.fd-menu{padding:12px 18px}.fd-card{border-radius:0}.fd-add{border-radius:2px}.fd-order{border-radius:2px}.fd-rname{font-size:22px}.fd-rmeta{font-size:12px}.fd-dialog,.as-dialog{border-radius:4px}.fl-form{border-radius:0}.at-win{left:0!important;top:0!important;width:100%!important;height:100%!important;border-radius:0;box-shadow:none}.at-title{height:30px;border-radius:0;background:var(--header,var(--panel));font-size:14px}.at-rail{display:none}.at-body{flex:1;min-height:0}.at-main{min-width:0}.at-pane-h{border-radius:0}.at-explorer{width:46%!important;max-width:none}.at-preview{padding:10px}.at-tree{font-family:inherit}.at-row svg{color:var(--fg)}.at-ed{padding:0!important}.at-pagearea{background:var(--panel);padding:0!important}.at-sheet{border:0;box-shadow:none;background:var(--panel);margin:0!important;width:100%!important;max-width:none!important;padding:26px 32px!important}.at-sheet h2{font-family:inherit}.at-tb{border-radius:0;padding:10px;background:var(--header,var(--panel))}.at-tool{border-radius:3px;font-family:inherit}.at-status{background:var(--panel)}.at-term{border-radius:0;border:0}.at-tscroll{padding:20px;font:15px/1.5 monospace}.at-term-tabs{background:var(--header,var(--panel))}.as-page{inset:0!important;display:flex;justify-content:stretch!important}.as-rail,.as-side{display:none}.as-col{flex:1!important;width:100%!important;border:0}.as-head{height:43px;background:var(--header,var(--panel));font-size:14px}.as-post{padding:13px 18px;gap:14px;border-bottom:1px solid var(--line)}.as-text{font-size:16px;line-height:1.4}.as-av{width:48px;height:48px;border-radius:4px;font-size:17px}.as-acts{max-width:440px;justify-content:flex-start;gap:22px}.as-act{border-radius:3px;height:30px;font-size:14px;padding:0 8px}.as-act svg{width:20px;height:20px}.as-photos{height:100px!important;border-radius:4px}.as-menu{border-radius:3px;min-width:210px}.as-mi{height:35px;font-size:14px}.as-confirm{border-radius:4px}.as-confirm button{border-radius:3px}.as-track{border-radius:0;width:15px;background:var(--line)}.as-thumb{border-radius:0}.as-name{font-size:16px}.as-handle,.as-time{font-size:13px}.as-quote{border-radius:3px}.as-link{border-radius:3px}.as-link.tall .as-link-img{height:65px}.as-post:has(.as-photos){min-height:200px}\n.design-header{background:repeating-linear-gradient(45deg,#e6edf7 0 4px,#dce6f2 4px 6px)}.design-brand{font:700 42px Georgia}.design-nav{font:18px Georgia;color:#000043}.task-note{background:#ffffdf;margin:10px;padding:20px;font-size:21px;border:2px ridge #9ca7c1}.stage{margin:10px;border:3px ridge #b3bbd5}.as-head{background:#adbfed}.as-post{border-bottom:1px solid #7d83a0}.as-act{background:#e7e7ee;border:2px outset #dadce5;color:#000040}.as-av{border-radius:0;border:2px solid #00003b}.as-name{color:#0000bf}.design-footer{background:#efdff5;border:3px ridge #c0b0cb}.end-control{background:#d8dbe5;color:#000;border:2px outset #eee;font-family:Georgia}";

  env.widget({
    task: 'use-social-feed',
    site: 'design-use-social-feed-one-12',
    name: 'design',
    split: 'train',
    scenarios: ['one'],
    template: 'use-social-feed/feed',
    design: {
      css: DESIGN_CSS,
      inlineActs: false,
      labelClass: false,
      detail: false,
      labels: true,
      avatarSheet: 'reference-photos.webp',
      avatarTiles: 2,
      scrollSet: 'first',
      parts: {
        // Generic help preserves the sidebar without reading the instruction or goal fields.
        begin: () => (R) => {
          const { util } = R;
          const brief = document.querySelector('.task-note');
          const details = util.el('section', 'brief-details', brief);
          util.el('h3', '', details, 'Details:');
          util.el('div', '', details, 'Browse posts and conversations in Social Manager. Each post has its own controls.');
          const steps = util.el('section', 'brief-steps', brief);
          util.el('h3', '', steps, 'Workspace tips:');
          const list = util.el('ol', '', steps);
          util.el('li', '', list, 'Browse the workspace tabs.');
          util.el('li', '', list, 'Read posts and conversations.');
          util.el('li', '', list, 'Use the controls beneath a post.');
          util.el('li', 'brief-complete', list, 'Review your changes.');
          const preview = util.el('section', 'workspace-preview', brief);
          util.el('h3', '', preview, 'Workspace overview:');
          const card = util.el('div', 'preview-card', preview);
          util.el('div', 'preview-avatar', card, 'SM');
          const text = util.el('div', 'preview-content', card);
          const meta = util.el('div', 'preview-meta', text);
          util.el('b', '', meta, 'Social Manager');
          util.el('p', '', text, 'Posts, conversations and updates in one place.');
          util.el('div', 'preview-note', preview, 'Switch tabs to explore the app.');
        },
        // The workspace shell (site.js) overlays the app until its Task tab is left; the workspace mounts after render.
        mounted: () => () => {
          const workspace = document.querySelector('.stage').socialWorkspace;
          if (workspace) workspace.mount();
        },
        locateExtra: () => () => {
          const workspace = document.querySelector('.stage').socialWorkspace;
          if (workspace && workspace.covered) return env.util.center(workspace.taskButton);
          return null;
        },
      },
    },
  });
})();
