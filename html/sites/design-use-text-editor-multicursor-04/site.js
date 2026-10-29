// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const xpTitle = util.el('div', 'xp-titlebar', document.body);
      util.el('span', 'xp-appicon', xpTitle, '▣');
      util.el('strong', '', xpTitle, 'Project Workspace');
      const winBtns = util.el('div', 'xp-window-buttons', xpTitle);
      for (const [c, t] of [['—','Minimize'],['□','Maximize'],['×','Close']]) {
        const b = util.el('span', 'xp-window-button', winBtns, c); b.title = t;
      }
      const menu = util.el('nav', 'xp-menu', document.body);
      for (const item of ['File','Edit','View','Project','Build','Tools','Window','Help']) util.el('span','',menu,item);
      const toolbar = util.el('div', 'xp-toolbar', document.body);
      for (const [icon, label] of [['▧','New'],['📂','Open'],['▣','Save'],['✂','Cut'],['▤','Copy'],['▣','Paste'],['↶','Undo'],['↷','Redo'],['▶','Run'],['▦','Build']]) {
        const b = util.el('span', 'xp-tool', toolbar, icon); b.title = label;
        if (label === 'Run' || label === 'Build') util.el('span','xp-tool-label',toolbar,label);
      }
      const tabs = util.el('nav','xp-tabs',document.body);
      for (const [i,label] of ['Code','Documents','Resources','Search','Settings'].entries()) {
        const t = util.el('span',`xp-tab${i===0?' active':''}`,tabs,label);
      }
      const summary = util.el('section','xp-summary',document.body);
      util.el('div','xp-folder-mark',summary,'📁');
      const desc = util.el('div','xp-summary-copy',summary);
      util.el('strong','',desc,'UtilityApp');
      util.el('span','',desc,'Project');
      util.el('span','',desc,'A sample application for collecting and reporting utility meter readings.');
      const meta = util.el('div','xp-summary-meta',summary);
      for (const [k,v] of [['Language:','JavaScript'],['Framework:','Node.js'],['Location:','C:\\Projects\\UtilityApp'],['Last Modified:','Apr 12, 2003  10:24 AM']]) {
        const row=util.el('div','',meta); util.el('span','',row,k); util.el('span','',row,v);
      }
      S.frameBrand(_c, header);
      document.body.append(header);
      Object.assign(_c, { desc, header, menu, meta, summary, tabs, toolbar, winBtns, xpTitle });
    },
    'frame.tools': (base, S) => function (_c) {
      base(_c);
      _c.toolbar.append(_c.headerTools);
      const nav = _c.header.querySelector('.ref-nav');
      if (nav) _c.tabs.append(nav);
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);

      // Project explorer and details inspector from the reference design.
      const explorer = util.el('aside', 'editor-explorer', body);
      body.insertBefore(explorer, stage);
      const side = body.querySelector(':scope > .ref-side');
      if (side) explorer.append(side);
      const project = util.el('section', 'editor-project', explorer);
      const projectHead = util.el('div', 'editor-panel-head', project);
      util.el('strong', '', projectHead, 'Files');
      util.el('span', 'editor-search-icon', projectHead, '⌕');
      const tree = util.el('div', 'editor-tree', project);
      const row = (depth, label, type, selected) => {
        const line = util.el('div', `tree-row${selected ? ' is-selected' : ''}`, tree);
        line.style.setProperty('--depth', depth);
        if (type === 'folder') util.el('span', 'tree-arrow', line, depth === 0 || label === 'src' || label === 'services' ? '⌄' : '›');
        util.el('span', `tree-icon ${type === 'folder' ? 'folder-icon' : type}-icon`, line, type === 'ts' ? 'TS' : type === 'react' ? '✿' : type === 'git' ? '◆' : type === 'json' ? '{}' : type === 'css' ? '#' : '');
        util.el('span', 'tree-label', line, label);
      };
      row(0, 'UtilityApp', 'folder');
      row(1, 'src', 'folder');
      row(2, 'app.js', 'ts');
      row(2, 'meters.js', 'ts', true);
      row(2, 'report.js', 'ts');
      row(2, 'utils.js', 'ts');
      row(1, 'data', 'folder');
      row(1, 'lib', 'folder');
      row(1, 'tests', 'folder');
      row(1, 'package.json', 'json');
      row(1, 'README.md', 'ts');
      const props = util.el('section', 'editor-properties', explorer);
      const propHead = util.el('div', 'editor-panel-head', props);
      util.el('strong', '', propHead, 'Help');
      util.el('span', 'property-refresh', propHead, '↻');
      const propList = util.el('div', 'property-list', props);
      for (const [key, value] of [['Ctrl+F', 'Find'], ['Ctrl+H', 'Replace'], ['Ctrl+D', 'Add selection'], ['Ctrl+/', 'Toggle comment'], ['F12', 'Go to definition'], ['Ctrl+Space', 'Show suggestions']]) {
        const item = util.el('div', 'property-row editor-tip', propList);
        util.el('span', '', item, key); util.el('span', '', item, value);
      }
      Object.assign(_c, { explorer, project, projectHead, propHead, propList, props, row, stage, tree });
    },
    'frame.toast': (base, S) => function (_c) {
      base(_c);
      if (_c.display === 'toast') _c.header.append(document.body.lastElementChild);
    },
    'frame.footer': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, label, lr, placement, rng, util, word } = _c;
      let { submit } = _c;
      {
        const foot = util.el('footer', 'ref-foot', document.body);
        _c.foot = foot;
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
      if (_c.placement === 'floating') _c.foot.append(_c.submit.parentElement);
    },
  };

  env.site({
    name: 'design-use-text-editor-multicursor-04',
    template: 'site/base',
    design: { parts },
  });
})();
