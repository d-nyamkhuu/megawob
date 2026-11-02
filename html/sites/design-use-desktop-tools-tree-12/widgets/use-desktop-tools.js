// Design of this site on the use-desktop-tools/workspace template: a 1999 file dialog whose right pane lists the files of the
// selected folder as a table (name, size, type, modified).
(function () {
  'use strict';
  env.widget({
    task: 'use-desktop-tools',
    site: 'design-use-desktop-tools-tree-12',
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
      rowRange: [21, 27],
      frame: 'plain',
      frameTitle: 'Document Library',
      siteCssLast: true,
      css: "\n.as-app{left:0!important;right:0!important;top:0!important;bottom:0!important;width:auto!important;border:0;border-radius:0;box-shadow:none}.as-top{display:none}.as-body{min-height:0}.as-btn{border-radius:3px;font-size:14px}.as-pane{border-radius:0}.se-main{padding:17px 22px!important;gap:0}.se-col{width:100%;max-width:none}.se-side{display:none}.se-box{border-radius:3px;box-shadow:none;height:39px;padding:0 12px}.se-go{border-radius:3px;height:39px;padding:0 22px}.se-card{border-bottom:1px solid var(--line);padding:8px 8px 4px}.se-card .se-title{font-family:inherit;font-size:19px}.se-pager{justify-content:center}.se-pg{border-radius:2px;width:32px;min-width:32px;height:32px}.se-fav{width:22px;height:22px;border-radius:1px}.se-url{font-size:12px}.se-desc{font-size:14px}.tk-main{padding:18px 22px}.tk-title{font-size:24px}.tk-date{border-radius:0;background:transparent}.tk-row{gap:12px;border-bottom:1px solid var(--line);padding:0 12px}.tk-name{font-size:15px}.tk-price{font-size:18px;width:68px}.tk-buy{width:65px}.tk-when{width:125px}.tk-trigger{border-radius:0;min-width:175px}.fd-wrap.left{flex-direction:row}.fd-cart{width:28%!important;border-left:3px solid var(--fg);border-radius:0;background:var(--panel)}.fd-menu{padding:12px 18px}.fd-card{border-radius:0}.fd-add{border-radius:2px}.fd-order{border-radius:2px}.fd-rname{font-size:22px}.fd-rmeta{font-size:12px}.fd-dialog,.as-dialog{border-radius:4px}.fl-form{border-radius:0}.at-win{left:0!important;top:0!important;width:100%!important;height:100%!important;border-radius:0;box-shadow:none}.at-title{height:30px;border-radius:0;background:var(--header,var(--panel));font-size:14px}.at-rail{display:none}.at-body{flex:1;min-height:0}.at-main{min-width:0}.at-pane-h{border-radius:0}.at-explorer{width:46%!important;max-width:none}.at-preview{padding:10px}.at-tree{font-family:inherit}.at-row svg{color:var(--fg)}.at-ed{padding:0!important}.at-pagearea{background:var(--panel);padding:0!important}.at-sheet{border:0;box-shadow:none;background:var(--panel);margin:0!important;width:100%!important;max-width:none!important;padding:26px 32px!important}.at-sheet h2{font-family:inherit}.at-tb{border-radius:0;padding:10px;background:var(--header,var(--panel))}.at-tool{border-radius:3px;font-family:inherit}.at-status{background:var(--panel)}.at-term{border-radius:0;border:0}.at-tscroll{padding:20px;font:15px/1.5 monospace}.at-term-tabs{background:var(--header,var(--panel))}.as-page{inset:0!important;display:flex;justify-content:stretch!important}.as-rail,.as-side{display:none}.as-col{flex:1!important;width:100%!important;border:0}.as-head{height:43px;background:var(--header,var(--panel));font-size:14px}.as-post{padding:13px 18px;gap:14px;border-bottom:1px solid var(--line)}.as-text{font-size:16px;line-height:1.4}.as-av{width:48px;height:48px;border-radius:4px;font-size:17px}.as-acts{max-width:440px;justify-content:flex-start;gap:22px}.as-act{border-radius:3px;height:30px;font-size:14px;padding:0 8px}.as-act svg{width:20px;height:20px}.as-photos{height:100px!important;border-radius:4px}.as-menu{border-radius:3px;min-width:210px}.as-mi{height:35px;font-size:14px}.as-confirm{border-radius:4px}.as-confirm button{border-radius:3px}.as-track{border-radius:0;width:15px;background:var(--line)}.as-thumb{border-radius:0}.as-name{font-size:16px}.as-handle,.as-time{font-size:13px}.as-quote{border-radius:3px}.as-link{border-radius:3px}.as-link.tall .as-link-img{height:65px}.as-post:has(.as-photos){min-height:200px}\n.design-header{display:none}.site-shell{grid-template-rows:0 minmax(0,1fr) 58px}.compact .stage{margin:0 22% 35px}.task-note{font-weight:700;padding-top:20px}.at-win{border:1px solid #888}.at-title{background:#ddd;font-weight:400}.at-explorer{border:1px inset #ddd}.at-pane-h{display:none}.at-sheet{font-family:Georgia}.at-row{font-size:15px!important}.end-control{background:#ddd;color:#000;border:2px outset #ddd;font-weight:400;font-family:Georgia}.design-footer{justify-content:center;border:0;background:#fff}.footer-label{display:none}",
      chev: () => '<svg class="chev" viewBox="0 0 16 16" fill="none" stroke="#34404d" stroke-width="1.2"><rect x="2.5" y="2.5" width="11" height="11" fill="#fff"/><path d="M4.5 8h7"/><path class="vl" d="M8 4.5v7"/></svg>',
      folder: () => '<svg class="ico" viewBox="0 0 20 20"><defs><linearGradient id="folder-yellow" x2="0" y2="1"><stop stop-color="#fff093"/><stop offset="1" stop-color="#ffd035"/></linearGradient></defs><path d="M2.4 5.5V4.6Q2.4 3.5 3.5 3.5h4.3l1.6 2h7.8q1.1 0 1.1 1.1v9.2q0 1.1-1.1 1.1H3.5q-1.1 0-1.1-1.1z" fill="url(#folder-yellow)" stroke="#574c29" stroke-width="1.2"/><path d="M3.5 6.5h13.6" fill="none" stroke="#fff5b0" stroke-width=".7"/><path d="M3.2 17.5h15.5V7" fill="none" stroke="#b49c57" stroke-width=".6"/></svg>',
      file: (name, cls) => {
        const c = '#26354a';
        return `<svg class="${cls}" viewBox="0 0 20 20"><path d="M3.5 1.5h8.7L16.5 6v12.5h-13z" fill="#f5f6f8" stroke="${c}" stroke-width="1.2" stroke-linejoin="round"/><path d="M12.2 1.5V6h4.3M5.5 7.5h9M5.5 9.5h9M5.5 11.5h9M5.5 13.5h9M5.5 15.5h9" fill="none" stroke="#62758b" stroke-width=".65"/></svg>`;
      },
      indent: [6, 32],
      parts: {
        previewPane: () => (T) => {
          const { util, main } = T;
          T.pv = util.el('div', 'at-preview', main);
          T.crumbs = util.el('div', 'at-crumbs', main);
          T.pbody = util.el('div', 'at-file-content', T.pv);
          T.pbody.style.cssText = 'flex: 1; min-height: 0; display: flex; flex-direction: column;';
        },
        rowStyle: () => (T, row, r) => row.style.setProperty('--depth', r.depth),
        viewPx: () => (T) => {
          const firstRow = T.rowEls.values().next().value;
          return firstRow ? Math.round(firstRow.getBoundingClientRect().height) : T.rowH;
        },
        previewBody: (base, S) => (T, m) => {
          const { util, fam, spec, ctx, pbody, crumbs } = T;
          const th = util.el('div', 'at-thead', pbody);
          ['Name   ▲', 'Size', 'Type', 'Modified'].forEach((t) => util.el('span', '', th, t));
          const live = fam.live(m, spec);
          const selected = live.byId.get(m.sel);
          const folder = selected ? (selected.dir ? selected.id : selected.parent) : null;
          const entries = fam.rows(m, spec).filter(r => !r.dir).map(r => live.byId.get(r.id)).filter(n => n && (folder === null || n.parent === folder));
          for (const n of entries) {
            const row = util.el('div', 'at-file-row', pbody);
            const name = util.el('span', 'file-name', row);
            name.innerHTML = S.FILE(n.name);
            util.el('span', '', name, n.name);
            const h = [...n.name].reduce((a,c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
            util.el('span', '', row, `${((h % 900) / 10 + 1.2).toFixed(1)} KB`);
            const ext = n.name.split('.').pop().toLowerCase();
            const types = {xlsx:'Microsoft Excel Worksheet',ods:'OpenDocument Spreadsheet',txt:'Text Document',md:'Text Document',pptx:'Microsoft PowerPoint Presentation',pdf:'PDF Document',docx:'Microsoft Word Document'};
            util.el('span', '', row, types[ext] || `${ext.toUpperCase()} File`);
            util.el('span', '', row, `Feb ${String(1 + h % 27).padStart(2,'0')}, 1999`);
            if (m.clicks.includes(n.id)) row.dataset.sel = '';
            row.addEventListener('click', () => T.commit(fam.treeClickFile(ctx.model, spec, n.id)));
          }
          const last = m.clicks[m.clicks.length - 1];
          if (last === undefined) {
            util.el('span', '', crumbs, 'Location:   /');
            return;
          }
          if (spec.recoverable) {
            S.P.backButton(T);
            pbody.insertBefore(pbody.lastElementChild, th);
          }
          T.info(pbody, m, last);
        },
      },
    },
  });
})();
