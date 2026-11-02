// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const appTitle = util.el('div', 'amiga-title', header);
      util.el('span', 'amiga-app-icon', appTitle, '▣');
      util.el('strong', '', appTitle, 'DevStudio');
      util.el('span', 'amiga-window-buttons', appTitle, '－ □ ×');
      const menu = util.el('nav', 'amiga-menu', document.body);
      for (const item of ['File', 'Edit', 'View', 'Search', 'Project', 'Tools', 'Window', 'Help']) util.el('span', '', menu, item);
      const toolbar = util.el('div', 'amiga-toolbar', document.body);
      for (const item of ['▯', '▰', '▣', '│', '✂', '▤', '▣', '│', '↶', '↷', '│', '⌕', '▤', '▣', '⚙']) util.el('span', '', toolbar, item);
      S.frameBrand(_c, header);
      Object.assign(_c, { appTitle, header, menu, toolbar });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);

      // Project explorer and details inspector from the reference design.
      const explorer = util.el('aside', 'editor-explorer', body);
      body.insertBefore(explorer, stage);
      const file = util.el('section', 'editor-properties amiga-panel', explorer);
      util.el('div', 'amiga-panel-head', file, 'File');
      util.el('div', 'amiga-file-info', file, '▤　 reporter.js\n　　 JavaScript Source');
      for (const [k,v] of [['Path:', 'projects/reporting/\nsrc/reporter.js'], ['Size:', '1.3 KB'], ['Modified:', 'Mar 12, 1990 10:24'], ['Lines:', '22'], ['Encoding:', 'UTF-8']]) {
        const row = util.el('div', 'amiga-info-row', file); util.el('span', '', row, k); util.el('span', '', row, v);
      }
      const symbols = util.el('section', 'editor-project amiga-panel', explorer);
      util.el('div', 'amiga-panel-head', symbols, 'Symbols');
      for (const label of ['▣  generateReports(year)', '　▤  results', '　▤  summary', '　▤  users', '　▤  sales', '　▤  revenue', '　▤  expenses', '　▤  growth']) util.el('div', 'amiga-symbol', symbols, label);
      const stats = util.el('section', 'amiga-panel amiga-stats', explorer);
      util.el('div', 'amiga-panel-head', stats, 'Statistics');
      for (const [k,v] of [['Total Lines:', '22'], ['Code Lines:', '18'], ['Blank Lines:', '2'], ['Comment Lines:', '0']]) {
        const row = util.el('div', 'amiga-info-row', stats); util.el('span', '', row, k); util.el('span', '', row, v);
      }
      Object.assign(_c, { explorer, file, stage, stats, symbols });
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
    name: 'design-use-text-editor-multicursor-02',
    template: 'site/base',
    design: { parts },
  });
})();
