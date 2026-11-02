// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.theme': (base, S) => function (_c) {
      const { ctx } = _c;
      const { ACCENTS, LOW_ACCENTS, LOW_THEME, THEMES } = S;
      const { rng, util, content } = ctx;
      let name = rng.pick(Object.keys(THEMES));
      const root = document.documentElement;
      let accent = rng.pick(ACCENTS);
      const tr = rng.fork('chrome/theme');
      if (tr.bool(0.08)) {
        name = 'low';
        accent = tr.pick(LOW_ACCENTS);
      }
      for (const [k, v] of Object.entries(name === 'low' ? LOW_THEME : THEMES[name])) root.style.setProperty(`--${k}`, v);
      root.style.setProperty('--accent', accent);
      // This design uses the fixed oatmeal Motif palette regardless of the scaffold theme draw.
      for (const [k, v] of Object.entries({ bg:'#c8c6c1', panel:'#d6d4cf', fg:'#111827', muted:'#444444', line:'#8d8c89' })) root.style.setProperty(`--${k}`, v);
      root.style.setProperty('--accent', '#4b74a8');
      root.dataset.theme = name;
      Object.assign(_c, { accent, content, name, rng, root, tr, util });
    },
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const frame = util.el('div', 'motif-titlebar', header);
      util.el('span', 'motif-system', frame, '▤');
      util.el('strong', 'motif-appname', frame, 'Project Files');
      const winbuttons = util.el('div', 'motif-winbuttons', frame);
      util.el('span', '', winbuttons, '▁');
      util.el('span', '', winbuttons, '□');
      util.el('span', '', winbuttons, '×');
      const menubar = util.el('div', 'motif-menubar', header);
      for (const item of ['File', 'Edit', 'View', 'Tools', 'Help']) util.el('span', '', menubar, item);
      const appTools = util.el('div', 'motif-toolbar', header);
      for (const [icon, text] of [['◀', 'Back'], ['▶', 'Forward'], ['⬆', 'Up'], ['▤', 'Organize'], ['▦', 'Views'], ['▤', 'Open'], ['✕', 'Delete'], ['↶', 'Undo']]) {
        const tool = util.el('span', 'motif-tool', appTools);
        util.el('b', '', tool, icon);
        util.el('span', '', tool, text);
      }
      const search = util.el('div', 'motif-search', appTools);
      util.el('span', '', search, 'Search Project Files');
      util.el('b', '', search, '⌕');
      S.frameBrand(_c, header);
      Object.assign(_c, { appTools, frame, header, menubar, search, winbuttons });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const rail = util.el('aside', 'motif-rail', body);
      for (const [icon, label] of [['⌂', 'Home'], ['▤', 'File System'], ['▱', 'Network'], ['▧', 'Trash']]) {
        const item = util.el('div', 'motif-rail-item', rail);
        util.el('span', 'motif-rail-icon', item, icon); util.el('span', '', item, label);
      }
      const motContent = util.el('div', 'motif-content', body);
      const summary = util.el('section', 'motif-summary', motContent);
      util.el('div', 'motif-folder-icon', summary, '');
      const folder = util.el('div', 'motif-folder-copy', summary);
      util.el('strong', '', folder, 'Project Files');
      util.el('span', '', folder, 'Folder');
      util.el('span', '', folder, 'File folder');
      const facts = util.el('div', 'motif-facts', summary);
      for (const [k, v] of [['Date modified:', 'Mar 1, 2024 10:24 AM'], ['Size:', '6.18 MB'], ['Contains:', '15 items']]) {
        const row = util.el('div', '', facts); util.el('span', '', row, k); util.el('span', '', row, v);
      }
      const tips = util.el('div', 'motif-tips', motContent);
      util.el('b', 'motif-info', tips, 'i');
      util.el('span', '', tips, 'Tip: Hold Ctrl or Shift to select multiple items');
      util.el('i', '', tips, '');
      util.el('span', '', tips, 'Drag items onto a folder to move them');
      util.el('i', '', tips, '');
      util.el('span', '', tips, 'Press Ctrl+Z to undo the last action');
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, facts, folder, motContent, rail, summary, tips });
    },
    'frame.stage': (base, S) => function (_c) {
      const { motContent, util } = _c;
      const stage = util.el('main', 'ref-stage', motContent);
      S.frameAlign(_c, stage);
      Object.assign(_c, { stage });
    },
  };

  env.site({
    name: 'design-use-file-manager-multimove-03',
    template: 'site/base',
    design: { parts },
  });
})();
