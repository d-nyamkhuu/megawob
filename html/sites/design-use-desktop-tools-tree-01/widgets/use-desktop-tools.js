// Design of this site on the use-desktop-tools/workspace template: a plain 1994 file dialog in a bare window, with
// plus / minus tree boxes, a footer strip and a properties list for the open file.
(function () {
  'use strict';
  env.widget({
    task: 'use-desktop-tools',
    site: 'design-use-desktop-tools-tree-01',
    name: 'design',
    split: 'train',
    scenarios: ['tree'],
    template: 'use-desktop-tools/workspace',
    design: {
      explorerTitle: null,
      emptyTitle: 'No file open',
      emptyTitleClass: '',
      emptyClose: null,
      emptyIcon: null,
      emptyHeading: null,
      emptyHint: 'Click a file in the Explorer to open it.',
      frame: 'plain',
      frameTitle: 'File Browser',
      siteCssLast: true,
      css: "\n.as-app{left:0!important;right:0!important;top:0!important;bottom:0!important;width:auto!important;border:0;border-radius:0;box-shadow:none}.as-top{display:none}.as-body{min-height:0}.as-btn{border-radius:3px;font-size:14px}.as-pane{border-radius:0}.se-main{padding:17px 22px!important;gap:0}.se-col{width:100%;max-width:none}.se-side{display:none}.se-box{border-radius:3px;box-shadow:none;height:39px;padding:0 12px}.se-go{border-radius:3px;height:39px;padding:0 22px}.se-card{border-bottom:1px solid var(--line);padding:8px 8px 4px}.se-card .se-title{font-family:inherit;font-size:19px}.se-pager{justify-content:center}.se-pg{border-radius:2px;width:32px;min-width:32px;height:32px}.se-fav{width:22px;height:22px;border-radius:1px}.se-url{font-size:12px}.se-desc{font-size:14px}.tk-main{padding:18px 22px}.tk-title{font-size:24px}.tk-date{border-radius:0;background:transparent}.tk-row{gap:12px;border-bottom:1px solid var(--line);padding:0 12px}.tk-name{font-size:15px}.tk-price{font-size:18px;width:68px}.tk-buy{width:65px}.tk-when{width:125px}.tk-trigger{border-radius:0;min-width:175px}.fd-wrap.left{flex-direction:row}.fd-cart{width:28%!important;border-left:3px solid var(--fg);border-radius:0;background:var(--panel)}.fd-menu{padding:12px 18px}.fd-card{border-radius:0}.fd-add{border-radius:2px}.fd-order{border-radius:2px}.fd-rname{font-size:22px}.fd-rmeta{font-size:12px}.fd-dialog,.as-dialog{border-radius:4px}.fl-form{border-radius:0}.at-win{left:0!important;top:0!important;width:100%!important;height:100%!important;border-radius:0;box-shadow:none}.at-title{height:30px;border-radius:0;background:var(--header,var(--panel));font-size:14px}.at-rail{display:none}.at-body{flex:1;min-height:0}.at-main{min-width:0}.at-pane-h{border-radius:0}.at-explorer{width:46%!important;max-width:none}.at-preview{padding:10px}.at-tree{font-family:inherit}.at-row svg{color:var(--fg)}.at-ed{padding:0!important}.at-pagearea{background:var(--panel);padding:0!important}.at-sheet{border:0;box-shadow:none;background:var(--panel);margin:0!important;width:100%!important;max-width:none!important;padding:26px 32px!important}.at-sheet h2{font-family:inherit}.at-tb{border-radius:0;padding:10px;background:var(--header,var(--panel))}.at-tool{border-radius:3px;font-family:inherit}.at-status{background:var(--panel)}.at-term{border-radius:0;border:0}.at-tscroll{padding:20px;font:15px/1.5 monospace}.at-term-tabs{background:var(--header,var(--panel))}.as-page{inset:0!important;display:flex;justify-content:stretch!important}.as-rail,.as-side{display:none}.as-col{flex:1!important;width:100%!important;border:0}.as-head{height:43px;background:var(--header,var(--panel));font-size:14px}.as-post{padding:13px 18px;gap:14px;border-bottom:1px solid var(--line)}.as-text{font-size:16px;line-height:1.4}.as-av{width:48px;height:48px;border-radius:4px;font-size:17px}.as-acts{max-width:440px;justify-content:flex-start;gap:22px}.as-act{border-radius:3px;height:30px;font-size:14px;padding:0 8px}.as-act svg{width:20px;height:20px}.as-photos{height:100px!important;border-radius:4px}.as-menu{border-radius:3px;min-width:210px}.as-mi{height:35px;font-size:14px}.as-confirm{border-radius:4px}.as-confirm button{border-radius:3px}.as-track{border-radius:0;width:15px;background:var(--line)}.as-thumb{border-radius:0}.as-name{font-size:16px}.as-handle,.as-time{font-size:13px}.as-quote{border-radius:3px}.as-link{border-radius:3px}.as-link.tall .as-link-img{height:65px}.as-post:has(.as-photos){min-height:200px}\n.design-header{display:none}.site-shell{grid-template-rows:0 minmax(0,1fr) 58px}.compact .stage{margin:0 22% 35px}.task-note{font-weight:700;padding-top:20px}.at-win{border:1px solid #888}.at-title{background:#ddd;font-weight:400}.at-explorer{border:1px inset #ddd}.at-pane-h{display:none}.at-sheet{font-family:Georgia}.at-row{font-size:15px!important}.end-control{background:#ddd;color:#000;border:2px outset #ddd;font-weight:400;font-family:Georgia}.design-footer{justify-content:center;border:0;background:#fff}.footer-label{display:none}",
      chev: (S) => S.svg('<rect x="1" y="1" width="14" height="14" fill="#fff" stroke-width="1"/><path d="M4 8h8" stroke-width="1.4"/><path class="v" d="M8 4v8" stroke-width="1.4"/>', 16, 'class="chev"'),
      folder: () => '<svg class="ico" viewBox="0 0 20 20"><path d="M1.5 4.5q0-1 1-1h4l2 2h9q1 0 1 1v11h-17z" fill="#ffe58a" stroke="#6e6242" stroke-width="1.1"/></svg>',
      file: (name, cls) => `<svg class="${cls}" viewBox="0 0 20 20"><path d="M3 1h10l5 5v13H3z" fill="#fff" stroke="#555" stroke-width="1" stroke-linejoin="miter"/><path d="M13 1v5h5" fill="none" stroke="#555" stroke-width="1"/></svg>`,
      rowRange: [25, 35],
      indent: [3, 40],
      loadIndent: [3, 40],
      parts: {
        bodyEnd: () => (F) => {
          F.ctx.util.el('footer', 'file-dialog-footer', F.win);
          /* End controls stay in frame so their setup and oracle positions agree. */
        },
        rowStyle: () => (T, row, r) => row.style.setProperty('--d', r.depth),
        previewEmpty: () => (T) => {
          const { util } = T;
          util.el('span', '', T.crumbs, 'No file selected.');
          const e = util.el('div', 'at-empty', T.pbody);
          e.textContent = '';
          const meta = util.el('dl', 'file-properties', T.pbody);
          for (const label of ['Name:', 'Type:', 'Size:', 'Modified:']) {
            util.el('dt', '', meta, label);
            util.el('dd', '', meta, '—');
          }
        },
      },
    },
  });
})();
