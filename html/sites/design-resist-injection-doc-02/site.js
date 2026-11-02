// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      header.classList.add('forgenote-titlebar');
      const appmark = util.el('span', 'fn-mark', header, '▤');
      appmark.setAttribute('aria-hidden', 'true');
      util.el('span', 'fn-appname', header, 'Document Workspace');
      const menus = util.el('nav', 'fn-menus', header);
      menus.hidden = true;
      const appActions = util.el('div', 'fn-actions', header);
      util.el('span', 'fn-help', appActions, '?');
      util.el('span', 'fn-settings', appActions, '⚙');
      util.el('span', 'fn-avatar', appActions, 'JD');
      S.frameBrand(_c, header);
      Object.assign(_c, { appActions, appmark, header, menus });
    },
    'frame.instruction': (base, S) => function (_c) {
      const { ctx, display, header, util } = _c;
      if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
      else util.el('div', 'ref-spacer', header);
      const documents = util.el('div', 'fn-documents', document.body);
      const docRows = [
        ['▤', 'Launch plan · WK-2893', 'PDF · 8 pages · Apr 3, 2024', 'selected'],
        ['▤', 'Product requirements', 'DOCX · 12 pages · Mar 28, 2024', ''],
        ['▦', 'Budget overview', 'XLSX · 6 pages · Mar 26, 2024', 'sheet'],
      ];
      for (const [icon, title, meta, cls] of docRows) {
        const row = util.el('div', `fn-doc-row ${cls}`, documents);
        util.el('span', `fn-doc-icon ${cls}`, row, icon);
        const copy = util.el('span', 'fn-doc-copy', row);
        util.el('strong', '', copy, title);
        util.el('span', '', copy, meta);
      }
      Object.assign(_c, { docRows, documents });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      body.classList.add('fn-body');
      const rail = util.el('aside', 'fn-rail', body);
      const railItems = [['▤','Documents'],['⌕','Search'],['♟','Shared'],['✓','Reviews'],['▤','Trash']];
      for (let i = 0; i < railItems.length; i++) {
        const item = util.el('div', `fn-rail-item${i === 0 ? ' active' : ''}`, rail);
        util.el('span', 'fn-rail-icon', item, railItems[i][0]);
        util.el('span', 'fn-rail-label', item, railItems[i][1]);
      }
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, rail, railItems });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      stage.classList.add('fn-stage');
      S.frameAlign(_c, stage);

      Object.assign(_c, { stage });
    },
  };

  env.site({
    name: 'design-resist-injection-doc-02',
    template: 'site/base',
    design: { parts },
  });
})();
