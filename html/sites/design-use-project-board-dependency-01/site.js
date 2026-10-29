// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';


  const TITLES = ['Team Release Planner'];

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { display, lr, nav, rng, util, word } = _c;
      const { K } = S;
      const header = util.el('header', 'ref-task', document.body);
      // Native desktop menu and planner toolbar sit directly below the window title.
      const menu = util.el('nav', 'gtk-menubar', document.body);
      header.after(menu);
      for (const item of ['File', 'Edit', 'View', 'Project', 'Tasks', 'Help']) {
        const m = util.el('span', 'gtk-menu-item', menu, item);
        m.addEventListener('click', () => env.log('decoy', { what: 'menu', label: item }));
      }
      const appbar = util.el('div', 'gtk-toolbar', document.body);
      menu.after(appbar);
      const appActions = [
        ['✚', 'Add Task'], ['◆', 'Add Milestone'], ['🔗', 'Link Tasks'], ['🔗', 'Unlink'],
        ['🔍', 'Zoom In'], ['🔍', 'Zoom Out'], ['▦', 'Today'],
      ];
      for (const [icon, labelText] of appActions) {
        const action = util.el('button', `gtk-tool${labelText === 'Unlink' ? ' is-disabled' : ''}`, appbar);
        action.type = 'button'; action.dataset.role = 'xtra';
        util.el('span', 'gtk-tool-icon', action, icon);
        util.el('span', '', action, labelText);
        action.addEventListener('click', () => env.log('decoy', { what: 'toolbar', label: labelText }));
      }
      if (display !== 'header' || nav) {
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, word ? word(lr.pick(K.brand)) : title);
        brand.dataset.role = 'brand';
      }
      Object.assign(_c, { appActions, appbar, header, menu });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);

      // Companion records and team board, matching the planner's split-pane desktop layout.
      const projectSide = util.el('aside', 'project-side', body);
      const listPanel = util.el('section', 'project-panel project-task-list', projectSide);
      util.el('h2', 'project-panel-title', listPanel, 'Tasks');
      const taskTable = util.el('div', 'project-task-table', listPanel);
      const tableRow = (cls, cells) => {
        const row = util.el('div', cls, taskTable);
        for (const value of cells) util.el('span', '', row, value);
      };
      tableRow('project-task-head', ['#', 'Task', 'Start', 'Finish', 'Duration', 'Team']);
      const taskRows = [
        ['1', 'Event tracking', 'Apr 20, 2009', 'May 1, 2009', '12 days', 'Platform'],
        ['2', 'Schema update', 'May 4, 2009', 'May 15, 2009', '12 days', 'Backend'],
        ['3', 'Account recovery', 'May 18, 2009', 'Jun 5, 2009', '19 days', 'Backend'],
        ['4', 'Preview build', 'Jun 8, 2009', 'Jun 19, 2009', '12 days', 'Client'],
        ['5', 'Beta testing', 'Jun 22, 2009', 'Jun 26, 2009', '5 days', 'QA'],
        ['6', 'Launch', 'Jun 29, 2009', 'Jun 29, 2009', '1 day', 'Release'],
      ];
      for (const row of taskRows) tableRow('project-task-row', row);
      const board = util.el('section', 'project-panel project-board', projectSide);
      util.el('h2', 'project-panel-title', board, 'Team Delivery Board');
      const boardGrid = util.el('div', 'project-board-grid', board);
      util.el('div', 'project-board-corner', boardGrid, '');
      for (const [name, count] of [['To Do', 3], ['In Progress', 2], ['Done', 1]])
        util.el('div', `project-board-heading ${name.toLowerCase().replace(' ', '-')}`, boardGrid, `${name} (${count})`);
      const teams = [
        ['Platform', [['Event tracking', 'todo']]],
        ['Backend', [['Schema update', 'todo'], ['Account recovery', 'progress']]],
        ['Client', [['Preview build', 'todo']]], ['QA', [['Beta testing', 'todo']]],
        ['Release', [['Launch', 'todo']]],
      ];
      for (const [team, cards] of teams) {
        util.el('div', 'project-team-label', boardGrid, team);
        for (const name of ['todo', 'progress', 'done']) {
          const cell = util.el('div', `project-board-cell ${name}`, boardGrid);
          for (const [task, column] of cards) if (name === column)
            util.el('div', `project-board-card ${name}`, cell, task);
        }
      }
      Object.assign(_c, { board, boardGrid, listPanel, projectSide, stage, tableRow, taskRows, taskTable, teams });
    },
    'frame.floating': (base, S) => function (_c) {
      const { endBtn, label, placement, util } = _c;
      let { submit } = _c;
      if (placement === 'floating') {
        // Reserve the control's space so it cannot intercept task clicks or drags.
        // On scrollable pages the dock follows the content, just like a form footer.
        const dock = util.el('div', 'ref-float-dock', document.body);
        submit = endBtn(dock, 'ref-submit ref-float', label);
      }
      const dockbar = util.el('nav', 'gtk-dock', document.body);
      for (const [icon, text] of [['▣', 'Timeline'], ['▦', 'Board'], ['♟', 'Teams'], ['⬟', 'Releases'], ['▥', 'Reports']]) {
        const tab = util.el('button', `gtk-dock-tab${text === 'Timeline' ? ' active' : ''}`, dockbar);
        tab.type = 'button'; tab.dataset.role = 'xtra';
        util.el('span', 'gtk-dock-icon', tab, icon);
        util.el('span', '', tab, text);
        tab.addEventListener('click', () => env.log('decoy', { what: 'navigation', label: text }));
      }
      Object.assign(_c, { dockbar, submit });
    },
  };

  env.site({
    name: 'design-use-project-board-dependency-01',
    template: 'site/base',
    design: { TITLES, parts },
  });
})();
