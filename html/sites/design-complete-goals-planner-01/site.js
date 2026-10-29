// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const winTitle = util.el('div', 'irix-title', header, 'Plan Editor');
      const winIcon = util.el('span', 'irix-app-icon', header, '▤');
      winTitle.prepend(winIcon);
      const winControls = util.el('div', 'irix-window-controls', header);
      for (const mark of ['−', '□', '×']) util.el('button', 'irix-window-control', winControls, mark).type = 'button';
      S.frameBrand(_c, header);
      Object.assign(_c, { header, winControls, winIcon, winTitle });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, display, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const inspector = util.el('aside', 'irix-inspector', body);
      const inspectorHead = util.el('div', 'irix-inspector-head', inspector);
      util.el('span', 'irix-inspector-icon', inspectorHead, '▤');
      util.el('strong', '', inspectorHead, 'Properties');
      const inspectorBlock = (title, rows) => {
        const block = util.el('section', 'irix-inspector-block', inspector);
        util.el('h3', '', block, title);
        const grid = util.el('div', 'irix-inspector-grid', block);
        for (const [k, v] of rows) { util.el('span', '', grid, k); util.el('span', '', grid, v); }
      };
      inspectorBlock('Selection', [['Type', 'Plan Settings'], ['Item', 'Multiple'], ['Modified', '—'], ['Size', '—']]);
      inspectorBlock('Appearance', [['Theme', 'Lavender'], ['Surface', 'Slate'], ['Font', 'Helvetica'], ['Text Size', '12']]);
      inspectorBlock('Limits', [['Volume Min', '0%'], ['Volume Max', '100%'], ['Range Handles', '2']]);
      const logo = util.el('div', 'irix-logo', inspector);
      util.el('span', '', logo, 'sgi');
      util.el('small', '', logo, '™');
      if (display === 'panel') { const panel = body.querySelector('.ref-panel'); if (panel) inspector.insertBefore(panel, inspector.children[1]); }
      Object.assign(_c, { inspector, inspectorBlock, inspectorHead, logo, stage });
    },
  };

  env.site({
    name: 'design-complete-goals-planner-01',
    template: 'site/base',
    design: { parts },
  });
})();
