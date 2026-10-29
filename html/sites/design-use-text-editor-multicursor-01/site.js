// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);

      // Project explorer and details inspector from the reference design.
      const explorer = util.el('aside', 'editor-explorer', body);
      body.insertBefore(explorer, stage);
      for (const panel of Array.from(body.children)) {
        if (panel.classList.contains('ref-side') || panel.classList.contains('ref-panel')) explorer.appendChild(panel);
      }
      const project = util.el('section', 'editor-project', explorer);
      const projectHead = util.el('div', 'editor-panel-head', project);
      util.el('strong', '', projectHead, 'Project');
      util.el('span', 'editor-search-icon', projectHead, '⌕');
      const tree = util.el('div', 'editor-tree', project);
      const row = (depth, label, type, selected) => {
        const line = util.el('div', `tree-row${selected ? ' is-selected' : ''}`, tree);
        line.style.setProperty('--depth', depth);
        if (type === 'folder') util.el('span', 'tree-arrow', line, depth === 0 || label === 'src' || label === 'services' ? '⌄' : '›');
        util.el('span', `tree-icon ${type === 'folder' ? 'folder-icon' : type}-icon`, line, type === 'ts' ? 'TS' : type === 'react' ? '✿' : type === 'git' ? '◆' : type === 'json' ? '{}' : type === 'css' ? '#' : '');
        util.el('span', 'tree-label', line, label);
      };
      row(0, 'acme-app', 'folder');
      row(1, 'src', 'folder');
      row(2, 'components', 'folder');
      row(2, 'lib', 'folder');
      row(2, 'services', 'folder');
      row(3, 'userService.ts', 'ts', true);
      row(3, 'productService.ts', 'ts');
      row(3, 'api.ts', 'ts');
      row(2, 'types', 'folder');
      row(2, 'utils', 'folder');
      row(1, 'App.tsx', 'react');
      row(1, 'main.tsx', 'react');
      row(1, 'index.css', 'css');
      row(0, 'tests', 'folder');
      row(0, '.gitignore', 'git');
      row(0, 'package.json', 'json');
      row(0, 'tsconfig.json', 'json');
      row(0, 'vite.config.ts', 'ts');
      const props = util.el('section', 'editor-properties', explorer);
      const propHead = util.el('div', 'editor-panel-head', props);
      util.el('strong', '', propHead, 'File Properties');
      util.el('span', 'property-refresh', propHead, '↻');
      const propList = util.el('div', 'property-list', props);
      for (const [key, value] of [['Name', 'userService.ts'], ['Path', 'src/services/userService.ts'], ['Type', 'TypeScript'], ['Size', '2.6 KB'], ['Modified', 'Apr 12, 2026, 10:24 AM']]) {
        const item = util.el('div', 'property-row', propList);
        util.el('span', '', item, key); util.el('span', '', item, value);
      }
      util.el('div', 'property-divider', props);
      for (const [key, value] of [['Language', 'TypeScript'], ['Line Endings', 'LF (Unix)']]) {
        const item = util.el('div', 'property-row property-setting', props);
        util.el('span', '', item, key); util.el('span', 'property-select', item, `${value}⌄`);
      }
      Object.assign(_c, { explorer, project, projectHead, propHead, propList, props, row, stage, tree });
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
    'frame.floating': (base, S) => function (_c) {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) document.body.querySelector('.ref-foot').appendChild(dock);
    },
  };

  env.site({
    name: 'design-use-text-editor-multicursor-01',
    template: 'site/base',
    design: { parts },
  });
})();
