// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.layout': (base, S) => function (_c) {
      const { ctx } = _c;
      const W = window.innerWidth;
      const H = window.innerHeight;
      const roomy = W >= 1380;
      document.body.classList.toggle('ref-compact', !roomy);
      const tall = H >= 700;
      let display = ctx.display || 'header';
      if (display === 'panel' && !roomy) display = 'header';
      if (display === 'toast' && !tall) display = 'header';
      // reset() reuses the body: a previous toast must not shrink later episodes.
      document.body.classList.toggle('ref-has-note', display === 'toast');
      Object.assign(_c, { H, W, display, roomy, tall });
    },
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const ribbon = util.el('div', 'planner-ribbon', header);
      util.el('div', 'planner-tabs', ribbon, 'Home　　 View　　 Project　　 Format');
      const groups = [
        ['✚|New Task', '◆|New Milestone', '✕|Delete'],
        ['⇥|Indent', '⇤|Outdent'],
        ['↗|Link Tasks', '↙|Unlink Tasks'],
        ['⬅|Move Earlier', '➡|Move Later'],
        ['⊕|Zoom In', '⊖|Zoom Out', '▣|Fit Timeline'],
        ['▣|Today', '▤|Show Critical Path'],
      ];
      const ribbonTools = util.el('div', 'planner-ribbon-tools', ribbon);
      for (const group of groups) {
        const g = util.el('div', 'planner-ribbon-group', ribbonTools);
        for (const entry of group) {
          const [icon, label] = entry.split('|');
          const button = util.el('button', 'planner-command', g);
          button.type = 'button';
          util.el('span', 'planner-command-icon', button, icon);
          util.el('span', 'planner-command-label', button, label);
        }
      }
      S.frameBrand(_c, header);
      Object.assign(_c, { groups, header, ribbon, ribbonTools });
    },
  };

  env.site({
    name: 'design-use-project-board-gantt-move-03',
    template: 'site/base',
    design: { parts },
  });
})();
