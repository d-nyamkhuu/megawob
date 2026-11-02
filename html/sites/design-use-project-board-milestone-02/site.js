// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const titlebar = util.el('div', 'w95-titlebar', header);
      util.el('span', 'w95-appicon', titlebar, '▦');
      const brand = util.el('div', 'ref-brand', titlebar);
      util.el('strong', '', brand, 'TeamTrack');
      util.el('span', 'ref-brand-subtitle', brand, 'Product Development');
      brand.dataset.role = 'brand';
      const win = util.el('div', 'w95-window-buttons', titlebar);
      for (const t of ['_', '□', '×']) util.el('span', '', win, t);
      const menu = util.el('div', 'w95-menu', header);
      for (const t of ['File', 'Edit', 'View', 'Project', 'Tools', 'Help']) util.el('span', '', menu, t);
      const toolbar = util.el('div', 'w95-toolbar', header);
      for (const [icon, text] of [['▧', 'New Task'], ['◆', 'New Milestone'], ['⇥', 'Indent'], ['⇤', 'Outdent'], ['↗', 'Link'], ['↙', 'Unlink'], ['⊕', 'Zoom In'], ['⊖', 'Zoom Out'], ['▦', 'Today']]) {
        const item = util.el('span', 'toolbar-item', toolbar);
        util.el('b', 'toolbar-icon', item, icon);
        util.el('span', 'toolbar-label', item, text);
      }
      util.el('span', 'toolbar-release', toolbar, 'Release Q3　▾');
      Object.assign(_c, { brand, header, menu, titlebar, toolbar, win });
    },
    'frame.panel': (base, S) => function (_c) {
      const { body, ctx, display, lr, rng, util, word } = _c;
      const { K } = S;
      if (display === 'panel') {
        const panel = util.el('aside', 'ref-panel', body);
        const heading = rng.pick(['Your task', 'Instructions', 'To do', 'Goal']);
        util.el('div', 'ref-panel-title', panel, word ? word(lr.pick(K.panel)) : heading);
        util.el('div', 'ref-panel-text', panel, ctx.instruction);
        if (rng.bool(0.5)) body.classList.add('ref-panel-right');
      }
      const projectSide = util.el('aside', 'project-sidebar', body);
      const projectNav = [
        ['▦', 'Release Plan', true], ['▤', 'Delivery Board'], ['▥', 'Reports'], ['♟', 'Team'], ['⚙', 'Settings'],
      ];
      for (const [icon, label, active] of projectNav) {
        const item = util.el('div', `project-nav-item${active ? ' active' : ''}`, projectSide);
        util.el('b', '', item, icon);
        util.el('span', '', item, label);
      }
      const summary = util.el('section', 'project-summary', projectSide);
      util.el('h3', '', summary, 'Project Summary');
      for (const [label, count, color] of [['Total Items', '6'], ['Milestones', '6', 'green'], ['In Progress', '2'], ['Completed', '1', 'green'], ['Not Started', '3']]) {
        const row = util.el('div', 'project-summary-row', summary);
        util.el('span', '', row, label);
        util.el('b', color ? `is-${color}` : '', row, count);
      }
      const board = util.el('div', 'kanban-board', body);
      const lanes = [
        ['To Do (3)', [['Marketing site', 'Marketing', 'orange'], ['Support playbook', 'Customer Success', 'red'], ['Mobile app beta', 'Mobile', 'orange']]],
        ['Delivery Board', [['Release checklist', 'Product Development', 'blue'], ['API v2', 'Platform', 'green'], ['Usage dashboard', 'Data Platform', 'blue']]],
        ['In Progress (2)', [['Usage dashboard', 'Data Platform', 'blue'], ['Design handoff', 'Design', 'orange']]],
        ['Done (1)', [['API v2', 'Platform', 'green']]],
      ];
      for (const [title, cards] of lanes) {
        const lane = util.el('section', 'kanban-lane', board);
        util.el('h2', '', lane, title);
        const list = util.el('div', 'kanban-cards', lane);
        for (const [name, team, color] of cards) {
          const card = util.el('div', `kanban-card ${color}`, list);
          util.el('strong', '', card, name);
          util.el('span', '', card, team);
        }
      }
      Object.assign(_c, { board, lanes, projectNav, projectSide, summary });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const dock = util.el('nav', 'w95-dock', document.body);
      for (const [icon, text] of [['▦', 'Timeline'], ['▧', 'Board'], ['♟', 'Teams'], ['▥', 'Reports'], ['⚒', 'Settings']]) {
        const item = util.el('span', 'w95-dock-item', dock);
        util.el('b', '', item, icon);
        util.el('span', '', item, text);
      }
      Object.assign(_c, { dock, stage });
    },
  };

  env.site({
    name: 'design-use-project-board-milestone-02',
    template: 'site/base',
    design: { parts },
  });
})();
