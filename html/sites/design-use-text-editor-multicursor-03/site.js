// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      util.el('div', 'masthead-account', header, 'Welcome, Alex Carter　│　Acme Manufacturing　│　Help　│　Sign Out');
      S.frameBrand(_c, header);
      Object.assign(_c, { header });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);

      // Project explorer and details inspector from the reference design.
      const explorer = util.el('aside', 'editor-explorer', body);
      body.insertBefore(explorer, stage);
      const project = util.el('section', 'editor-project', explorer);
      const projectHead = util.el('div', 'editor-panel-head', project);
      util.el('strong', '', projectHead, 'Project Files');
      util.el('span', 'editor-search-icon', projectHead, '◆');
      const list = util.el('div', 'file-list', project);
      const head = util.el('div', 'file-row file-head', list);
      for (const label of ['Name', 'Size', 'Modified ▼']) util.el('span', '', head, label);
      const files = [
        ['▰', 'app', '—', 'Apr 24, 1999 10:12', true], ['▯', '__init__.py', '1 KB', 'Apr 20, 1999 09:14'],
        ['▯', 'inventory.py', '3 KB', 'Apr 24, 1999 10:12', false, true], ['▯', 'orders.py', '4 KB', 'Apr 22, 1999 16:08'],
        ['▯', 'products.py', '4 KB', 'Apr 21, 1999 11:03'], ['▯', 'reports.py', '5 KB', 'Apr 19, 1999 14:37'],
        ['▰', 'tests', '—', 'Apr 18, 1999 13:21', true], ['▯', 'test_inventory.py', '2 KB', 'Apr 18, 1999 13:21'],
        ['▯', 'test_reports.py', '2 KB', 'Apr 17, 1999 15:06'], ['▯', 'README.md', '3 KB', 'Apr 16, 1999 09:33'],
        ['▯', 'requirements.txt', '1 KB', 'Apr 16, 1999 09:12'], ['▯', 'setup.py', '2 KB', 'Apr 15, 1999 17:44'],
      ];
      for (const [icon, name, size, date, folder, selected] of files) {
        const line = util.el('div', `file-row${folder ? ' is-folder' : ''}${selected ? ' is-selected' : ''}`, list);
        util.el('span', 'file-name', line, `${icon}　${name}`);
        util.el('span', '', line, size); util.el('span', '', line, date);
      }
      Object.assign(_c, { explorer, files, head, list, project, projectHead, stage });
    },
    'frame.footer': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, label, lr, placement, rng, util, word } = _c;
      let { submit } = _c;
      {
        const foot = util.el('footer', 'ref-foot', document.body);
        const footText = rng.pick(['© 2024 Example Co.', 'All changes are saved automatically.',
          'Need help? Contact your administrator.', 'v4.2.1 · Status: all systems normal']);
        util.el('span', 'ref-foot-text', foot, word ? lr.pick([`© 2024 Example Co. ${word('footRights')}`,
          word('footSaved'), word('footHelp'), `v4.2.1 · ${word('footStatus')}`]) : footText);
        const dock = util.el('nav', 'editor-dock', foot);
        for (const [icon, item, active] of [['▰', 'Explorer', true], ['⌕', 'Search'], ['⑂', 'Source Control'], ['▷', 'Run'], ['▦', 'Extensions']]) {
          const link = util.el('a', `dock-item${active ? ' is-active' : ''}`, dock);
          util.el('span', 'dock-icon', link, icon); util.el('span', '', link, item);
        }
        const settings = util.el('a', 'dock-item dock-settings', dock);
        util.el('span', 'dock-icon', settings, '⚙'); util.el('span', '', settings, 'Settings');
        const tools = util.el('div', 'ref-tools', foot);
        if (decoys.length > 1) decoyBtn(tools, decoys[1]);
        if (collide && collide.where === 'footer') decoyBtn(tools, collide.text, true);
        if (placement === 'footer') submit = endBtn(tools, 'ref-submit', label);
        if (placement === 'link') submit = endBtn(tools, 'ref-endlink', `${label} ›`);
      }
      Object.assign(_c, { submit });
    },
  };

  env.site({
    name: 'design-use-text-editor-multicursor-03',
    template: 'site/base',
    design: { parts },
  });
})();
