// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';


  const TITLES = ['PlanWorks Team Edition'];

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { display, lr, nav, rng, util, word } = _c;
      const header = util.el('header', 'ref-task', document.body);
      S.frameBrand(_c, header);
      const brand = util.el('div', 'plan-brand', header);
      const logo = util.el('span', 'plan-logo', brand);
      logo.innerHTML = '<svg viewBox="0 0 72 46" width="100%" height="100%"><path fill="#245d92" d="M0 42 17 20 31 42zM20 25 35 1 52 26zM41 42 58 22 72 42z"/><path fill="#4a97d0" d="m0 42 17-22 3 22zM20 25 35 1l2 25zM41 42l17-20 2 20z"/><path fill="#83bee8" d="m20 25 17 1 9 16H20z"/></svg>';
      const brandText = util.el('div', '', brand);
      util.el('div', 'plan-brand-name', brandText, 'PlanWorks');
      util.el('div', 'plan-brand-subtitle', brandText, 'Team Edition');
      const menu = util.el('nav', 'gtk-menubar', header);
      for (const item of ['Home', 'Projects', 'Tasks', 'Resources', 'Reports']) {
        const m = util.el('span', `gtk-menu-item${item === 'Projects' ? ' active' : ''}`, menu, item);
        m.addEventListener('click', () => env.log('decoy', { what: 'menu', label: item }));
      }
      const appbar = util.el('div', 'gtk-toolbar', header);
      const appActions = [['team', 'Team'], ['settings', 'Settings'], ['help', 'Help']];
      const marks = {
        team: '<circle cx="16" cy="8" r="5"/><circle cx="5" cy="11" r="4"/><circle cx="27" cy="11" r="4"/><path d="M8 29v-8a8 8 0 0 1 16 0v8zM0 27v-7a5 5 0 0 1 7-4v11zM25 27V16a5 5 0 0 1 7 4v7z"/>',
        settings: '<path d="m13 0 6 0 1 5 4 2 5-2 3 5-4 4v4l4 4-3 5-5-2-4 2-1 5h-6l-1-5-4-2-5 2-3-5 4-4v-4l-4-4 3-5 5 2 4-2z"/><circle cx="16" cy="16" r="6" fill="#a9c9e7"/>',
        help: '<circle cx="16" cy="16" r="16"/><text x="16" y="25" text-anchor="middle" fill="#d3e9fb" font-size="26" font-family="Arial" font-weight="bold">?</text>',
      };
      for (const [icon, labelText] of appActions) {
        const action = util.el('button', `gtk-tool${labelText === 'Unlink' ? ' is-disabled' : ''}`, appbar);
        action.type = 'button'; action.dataset.role = 'xtra';
        util.el('span', 'gtk-tool-icon', action).innerHTML = `<svg viewBox="0 0 32 32" fill="currentColor">${marks[icon]}</svg>`;
        util.el('span', '', action, labelText);
        action.addEventListener('click', () => env.log('decoy', { what: 'toolbar', label: labelText }));
      }
      Object.assign(_c, { appActions, appbar, header, menu });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const frame = util.el('div', 'project-window', body);
      const stage = util.el('main', 'ref-stage', frame);
      S.frameAlign(_c, stage);

      const leftNav = util.el('nav','project-leftnav',body);
      util.el('div','project-leftnav-title',leftNav,'Product Launch');
      for (const [label,icon,active] of [['Overview','▧',false],['Timeline & Board','▤',true],['Team','♟',false],['Milestones','◆',false],['Files','▣',false],['Reports','▤',false]]) {
        const item=util.el('div',`project-leftnav-item${active?' active':''}`,leftNav);
        const mark=util.el('b','',item);
        const icons={Overview:'<path d="M5 2h12l5 5v20H5zM17 2v7h6M9 13h10M9 17h7M9 21h10"/>','Timeline & Board':'<rect x="2" y="3" width="25" height="22"/><path d="M8 3v22M3 10h23M12 7h10M12 15h6M15 20h8"/>',Team:'<circle cx="14" cy="7" r="4" fill="#f9bf42"/><circle cx="5" cy="11" r="3" fill="#f9bf42"/><circle cx="23" cy="11" r="3" fill="#f9bf42"/><path d="M7 25v-7a7 7 0 0 1 14 0v7zM1 25v-8h5M22 17h5v8" fill="#e8aa32"/>',Milestones:'<path d="m14 2 10 12-10 13L4 14z" fill="#ffd043"/><path d="m14 5 3 6 6 3-6 2-3 7-3-7-5-2 5-3z"/>',Files:'<path d="M5 2h13l5 5v20H5zM9 9h4v12H9zM16 6h3v15h-3z"/>',Reports:'<path d="M5 2h13l5 5v20H5zM9 14h3v9H9zM14 10h3v13h-3zM19 17h2v6h-2z"/>'};
        mark.innerHTML=`<svg viewBox="0 0 29 29">${icons[label]}</svg>`;
        util.el('span','',item,label);
      }

      // Reference legend and a five-lane delivery board.
      const projectSide = util.el('aside', 'project-side', frame);
      const note=body.querySelector('.ref-panel');
      if(note) { projectSide.appendChild(note); note.querySelector('.ref-panel-title').textContent='Task Note'; }
      const legend = util.el('section', 'project-panel project-legend', projectSide);
      util.el('h2', 'project-panel-title', legend, 'Legend');
      const legendRows = [['bar','Task bar\n(drag to move or resize)'],['port','Connection point'],['link','Finish-to-start link'],['milestone','Milestone'],['weekend','Non-working day\n(weekend)']];
      for (const [icon, text] of legendRows) { const row=util.el('div','legend-row',legend); util.el('b',`legend-${icon}`,row); const label=util.el('span','',row,text);label.style.whiteSpace='pre-line'; }
      const board = util.el('section', 'project-panel project-board', frame);
      util.el('h2', 'project-panel-title', board, 'Team Delivery Board');
      const boardGrid = util.el('div', 'project-board-grid', board);
      util.el('div', 'project-board-corner', boardGrid, 'Team');
      for (const [name, key] of [['Backlog', 'backlog'], ['In Progress\n(3 max)', 'in-progress'], ['Review\n(2 max)', 'review'], ['Done', 'done']]) {
        const h=util.el('div', `project-board-heading ${key}`, boardGrid, name);h.style.whiteSpace='pre-line';
      }
      const teams = [
        ['Platform', [['Component library', 'todo']]],
        ['Search', [['Search relevance', 'todo']]],
        ['International', [['Locale fallback', 'todo']]],
        ['Analytics', [['Analytics dashboard', 'todo']]],
        ['Marketing', [['Marketing site', 'todo']]],
      ];
      const teamPanel = util.el('section','project-panel project-teams',projectSide);
      util.el('h2','project-panel-title',teamPanel,'Teams');
      for (const [name,color] of [['Platform','#3898ed'],['Search','#ff902e'],['International','#a66cef'],['Analytics','#ffd32d'],['Marketing','#fa4444']]) { const row=util.el('div','team-legend-row',teamPanel); const sw=util.el('i','',row); sw.style.background=color; util.el('span','',row,name); }
      for (const [team, cards] of teams) {
        util.el('div', 'project-team-label', boardGrid, team);
        for (const name of ['todo', 'progress', 'review', 'done']) {
          const cell = util.el('div', `project-board-cell ${name}`, boardGrid);
          for (const [task, column] of cards) if (name === column) {
            const card=util.el('div', `project-board-card ${name}`, cell, '');
            card.style.setProperty('--task',['#509fff','#ff922d','#ad78f2','#ffdc40','#ff4444'][teams.findIndex(t=>t[0]===team)]);
          }
        }
      }
      const status=util.el('div','project-status',frame);
      const facts=util.el('div','project-facts',status);
      for(const text of ['Tasks: 6','Finish-to-start links: 0','Project schedule']) util.el('span','',facts,text);
      const zoom=util.el('div','project-zoom',status);
      util.el('span','',zoom,'Zoom:');
      util.el('button','',zoom,'−');util.el('i','project-zoom-track',zoom);util.el('button','',zoom,'+');
      Object.assign(_c, { board, boardGrid, projectSide, stage, teams });
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
    name: 'design-use-project-board-dependency-05',
    template: 'site/base',
    design: { TITLES, parts },
  });
})();
