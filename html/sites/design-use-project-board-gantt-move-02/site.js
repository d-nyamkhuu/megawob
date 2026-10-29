// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
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
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const window = util.el('section', 'gantt-window', body);
      const stage = util.el('main', 'ref-stage', window);
      S.frameAlign(_c, stage);
      const duration = util.el('section', 'gantt-duration', stage);
      const durationNames = ['Task Durations (days)', 'Core engine', 'Usage dashboard', 'Support playbook',
        'API documentation', 'Navigation polish', 'Marketing site', 'Total'];
      const durationValues = ['', '9', '8', '7', '7', '7', '6', '44'];
      const head = util.el('div', 'gantt-duration-row gantt-duration-head', duration);
      const values = util.el('div', 'gantt-duration-row gantt-duration-values', duration);
      durationNames.forEach((name, i) => util.el('div', 'gantt-duration-cell', head, name));
      durationValues.forEach((value) => util.el('div', 'gantt-duration-cell', values, value));
      const guide = util.el('section', 'gantt-guide', stage);
      const legend = util.el('div', 'gantt-legend', guide);
      util.el('div', 'gantt-guide-title', legend, 'Legend');
      const keys = util.el('div', 'gantt-legend-keys', legend);
      for (const [color, text] of [['blue','Task (Not Started)'],['green','Task (In Progress)'],
        ['orange','Task (At Risk)'],['purple','Task (Blocked)']]) {
        const row = util.el('div', 'gantt-key', keys);
        util.el('i', `gantt-swatch ${color}`, row);
        util.el('span', '', row, text);
      }
      const symbols = util.el('div', 'gantt-symbols', legend);
      util.el('div', 'gantt-symbol-row', symbols, '◆　Milestone');
      util.el('div', 'gantt-symbol-row', symbols, '↳　Finish-to-Start Dependency');
      const tips = util.el('div', 'gantt-tips', guide);
      util.el('div', 'gantt-guide-title', tips, 'Tips');
      for (const text of ['Drag a task bar to move its start date.',
        'Drag the right edge of a bar to change its duration (in days).',
        'Arrows show finish-to-start dependencies.',
        'Summary totals show the duration for each task and the overall total.']) {
        util.el('div', 'gantt-tip', tips, text);
      }
      Object.assign(_c, { duration, durationNames, durationValues, guide, head, keys, legend, stage, symbols, tips, values });
    },
  };

  env.site({
    name: 'design-use-project-board-gantt-move-02',
    template: 'site/base',
    design: { parts },
  });
})();
