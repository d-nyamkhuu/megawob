// Note Pad design: keeps this site's custom frame, title field, and compact editor labels.
(function () {
  'use strict';

  env.widget({
    task: 'use-desktop-tools',
    site: 'design-use-desktop-tools-editor-11',
    name: 'design',
    split: 'train',
    scenarios: ['editor'],
    traits: { tools: ['size', 'bold', 'italic', 'underline', 'color', 'bullet', 'number'] },
    template: 'use-desktop-tools/workspace',
    design: {
      css: "\n.as-app{left:0!important;right:0!important;top:0!important;bottom:0!important;width:auto!important;border:0;border-radius:0;box-shadow:none}.as-top{display:none}.as-body{min-height:0}.as-btn{border-radius:3px;font-size:14px}.as-pane{border-radius:0}.se-main{padding:17px 22px!important;gap:0}.se-col{width:100%;max-width:none}.se-side{display:none}.se-box{border-radius:3px;box-shadow:none;height:39px;padding:0 12px}.se-go{border-radius:3px;height:39px;padding:0 22px}.se-card{border-bottom:1px solid var(--line);padding:8px 8px 4px}.se-card .se-title{font-family:inherit;font-size:19px}.se-pager{justify-content:center}.se-pg{border-radius:2px;width:32px;min-width:32px;height:32px}.se-fav{width:22px;height:22px;border-radius:1px}.se-url{font-size:12px}.se-desc{font-size:14px}.tk-main{padding:18px 22px}.tk-title{font-size:24px}.tk-date{border-radius:0;background:transparent}.tk-row{gap:12px;border-bottom:1px solid var(--line);padding:0 12px}.tk-name{font-size:15px}.tk-price{font-size:18px;width:68px}.tk-buy{width:65px}.tk-when{width:125px}.tk-trigger{border-radius:0;min-width:175px}.fd-wrap.left{flex-direction:row}.fd-cart{width:28%!important;border-left:3px solid var(--fg);border-radius:0;background:var(--panel)}.fd-menu{padding:12px 18px}.fd-card{border-radius:0}.fd-add{border-radius:2px}.fd-order{border-radius:2px}.fd-rname{font-size:22px}.fd-rmeta{font-size:12px}.fd-dialog,.as-dialog{border-radius:4px}.fl-form{border-radius:0}.at-win{left:0!important;top:0!important;width:100%!important;height:100%!important;border-radius:0;box-shadow:none}.at-title{height:30px;border-radius:0;background:var(--header,var(--panel));font-size:14px}.at-rail{display:none}.at-body{flex:1;min-height:0}.at-main{min-width:0}.at-pane-h{border-radius:0}.at-explorer{width:46%!important;max-width:none}.at-preview{padding:10px}.at-tree{font-family:inherit}.at-row svg{color:var(--fg)}.at-ed{padding:0!important}.at-pagearea{background:var(--panel);padding:0!important}.at-sheet{border:0;box-shadow:none;background:var(--panel);margin:0!important;width:100%!important;max-width:none!important;padding:26px 32px!important}.at-sheet h2{font-family:inherit}.at-tb{border-radius:0;padding:10px;background:var(--header,var(--panel))}.at-tool{border-radius:3px;font-family:inherit}.at-status{background:var(--panel)}.at-term{border-radius:0;border:0}.at-tscroll{padding:20px;font:15px/1.5 monospace}.at-term-tabs{background:var(--header,var(--panel))}.as-page{inset:0!important;display:flex;justify-content:stretch!important}.as-rail,.as-side{display:none}.as-col{flex:1!important;width:100%!important;border:0}.as-head{height:43px;background:var(--header,var(--panel));font-size:14px}.as-post{padding:13px 18px;gap:14px;border-bottom:1px solid var(--line)}.as-text{font-size:16px;line-height:1.4}.as-av{width:48px;height:48px;border-radius:4px;font-size:17px}.as-acts{max-width:440px;justify-content:flex-start;gap:22px}.as-act{border-radius:3px;height:30px;font-size:14px;padding:0 8px}.as-act svg{width:20px;height:20px}.as-photos{height:100px!important;border-radius:4px}.as-menu{border-radius:3px;min-width:210px}.as-mi{height:35px;font-size:14px}.as-confirm{border-radius:4px}.as-confirm button{border-radius:3px}.as-track{border-radius:0;width:15px;background:var(--line)}.as-thumb{border-radius:0}.as-name{font-size:16px}.as-handle,.as-time{font-size:13px}.as-quote{border-radius:3px}.as-link{border-radius:3px}.as-link.tall .as-link-img{height:65px}.as-post:has(.as-photos){min-height:200px}\n.design-header{background:linear-gradient(#8bbb60,#4d8433);color:#fff}.design-brand{font-size:27px}.design-nav{color:#fff}.task-note{margin:35px 15px 0 20px;background:#fffde2;border:1px solid #edda6e;border-radius:6px;align-self:start;font-size:20px;padding:18px 15px}.stage{margin:35px 18% 25px 0;border:1px solid #b9d4ed;border-radius:10px}.at-title{background:#e7f1ff;color:#144270}.at-tb{background:#edf5ff}.at-sheet{padding:16px!important}.at-sheet h2,.at-sheet hr{display:none}.at-win{border:0}.end-control{background:linear-gradient(#80ba49,#3e8e1c);border:1px solid #4f8d30}.reference-overlay.banner{background:#e9ddff;border-color:#b297d8;color:#4c2e78}.reference-overlay.banner h2{background:#e9ddff;color:#4c2e78}",
      siteCssLast: true,
      sizeInitial: 'Normal',
      sizeCur: 'label',
      docTitle: 'Bird Note',
      wordsLabel: (count) => `${count} words`,
      barColor: '#000',
      toolIcons: {
        bullet: '<path d="M2 3h1M2 6h1M2 9h1M2 12h1M6 3h8M6 6h8M6 9h8M6 12h8"/>',
      },
      toolHtml: {
        size: (_default, S) => '<span class="font-caption">Font</span><span class="cur">Normal</span>' + S.CARET,
        color: (_default, S) => '<span class="A">A<i></i></span><span class="color-label">Text Color</span>' + S.CARET,
        number: (_default, S) => S.svg('<path d="M2 2h1v2M2 5h2l-2 2h2M2 8h2v2H2M2 11v1h2M3 11v2M6 3h8M6 6h8M6 9h8M6 12h8"/>', 16),
      },
      parts: {
        frame: () => (ctx) => {
          const { util } = ctx;
          const win = util.el('section', 'at-win', ctx.stage);
          const title = util.el('div', 'at-title', win);
          util.el('b', '', title, 'Note Pad');
          const tabs = util.el('span', 'at-tabs', title);
          ['New Note', 'My Notes', 'Settings'].forEach((text, i) =>
            util.el('span', 'at-tab' + (i ? '' : ' on'), tabs, text));
          util.el('span', 'at-tlinks', title, 'Help  |  Sign Out');
          const body = util.el('div', 'at-body', win);
          util.el('h3', 'at-edit-h', body, 'Edit Note');
          const main = util.el('div', 'at-main', body);
          const gear = util.el('button', '', title);
          gear.hidden = true;
          return { win, title, main, gear, appMenu: null };
        },
        edHead: () => (E) => {
          const titleRow = E.util.el('label', 'note-title', E.ed, 'Title:');
          const titleInput = E.util.el('input', '', titleRow);
          titleInput.type = 'text';
          titleInput.value = 'Bird Note';
        },
        edStatus: (base) => (E) => {
          base(E);
          E.status.children[0].className = 'word-count';
          E.saved.className = 'save-state';
        },
      },
    },
  });
})();
