// Design on templates/site/ui-click-hover-menu-01.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: "design-click-control-hover-menu-05",
    styles: ['site.css'],
    template: 'site/click-control-hover-menu-01',
    design: {
      parts: {
        'frame.37': (base) => function (c) {
          // Keep episode controls and instructions in the frame's flow before
          // the task is mounted, clear of the hover menu and its dropdowns.
          const buttons = c.head.querySelectorAll('.submit, .xtra-task');
          const toolbarNote = !c.note.hidden && c.ctx.display !== 'panel';
          if (buttons.length || toolbarNote) {
            const toolbar = c.u.el('header', 'portal-end-toolbar', c.shell);
            c.shell.insertBefore(toolbar, c.shell.firstChild);
            if (toolbarNote) toolbar.appendChild(c.note);
            for (const button of buttons) toolbar.appendChild(button);
          }
          if (!c.note.hidden && c.ctx.display === 'panel') c.shell.appendChild(c.note);
          const result = base(c);
          const work = c.shell.querySelector('.work');
          if (work && !work.querySelector('.office-board')) {
            const el = (tag, cls, parent, value) => c.u.el(tag, cls, parent, value);
            const board = el('div', 'office-board', work);
            const upper = el('div', 'office-upper', board);
            const welcome = el('div', 'office-welcome', upper);
            const computer = el('div', 'office-computer', welcome);
            const monitor = el('div', 'office-monitor', computer);
            el('span', '', monitor);
            el('div', 'office-keyboard', computer);
            el('div', 'office-tower', computer);
            el('div', 'office-drawer', computer);
            const welcomeCopy = el('div', 'office-welcome-copy', welcome);
            el('strong', '', welcomeCopy, 'Welcome to Office Manager');
            el('p', '', welcomeCopy, 'A central place for your mail, calendar, contacts, files and more.');
            const today = el('div', 'office-today', upper);
            el('h2', '', today, 'Today');
            el('p', '', today, 'Tuesday, April 11, 1995');
            [['9:00 AM', 'Staff meeting'], ['11:00 AM', 'Project review'], ['2:00 PM', 'Budget discussion']].forEach(([time, event]) => {
              const row = el('div', 'office-appointment', today);
              el('span', '', row, time);
              el('span', '', row, event);
            });
            const lower = el('div', 'office-lower', board);
            const folders = el('section', 'office-folders office-pane', lower);
            el('h2', '', folders, 'Folders');
            const tree = el('div', 'office-tree', folders);
            const root = el('div', 'office-tree-row', tree);
            el('span', 'office-tree-toggle', root, '−');
            el('span', 'office-home-icon', root, '⌂');
            el('span', '', root, 'Office Manager');
            ['Mail', 'Calendar', 'Contacts', 'Tasks'].forEach(name => {
              const row = el('div', 'office-tree-row child', tree);
              el('span', 'office-tree-toggle', row, '+');
              el('span', 'office-folder-icon', row);
              el('span', '', row, name);
            });
            const recent = el('section', 'office-recent office-pane', lower);
            el('h2', '', recent, 'Recent items');
            const table = el('div', 'office-file-table', recent);
            const heading = el('div', 'office-file-head', table);
            ['Name', 'Type', 'Modified'].forEach(label => el('span', '', heading, label));
            const rows = [
              ['word', 'Project Plan.doc', 'Microsoft Word Document', '4/10/95   3:24 PM'],
              ['excel', 'Budget 1995.xls', 'Microsoft Excel Worksheet', '4/9/95   10:17 AM'],
              ['text', 'Team Roster.txt', 'Text Document', '4/8/95   2:03 PM'],
              ['word', 'Meeting Notes.doc', 'Microsoft Word Document', '4/6/95   9:14 AM'],
              ['powerpoint', 'Presentation.ppt', 'Microsoft PowerPoint Presentation', '4/5/95   4:22 PM'],
              ['excel', 'Expense Report.xls', 'Microsoft Excel Worksheet', '4/3/95   11:36 AM'],
              ['archive', 'Contacts Backup.pst', 'Outlook Data File', '4/1/95   8:50 AM'],
              ['text', 'To Do List.txt', 'Text Document', '3/30/95   5:11 PM'],
            ];
            rows.forEach(([type, name, kind, date]) => {
              const row = el('div', 'office-file-row', table);
              const nameCell = el('span', 'office-file-name', row);
              el('i', `office-file-icon ${type}`, nameCell);
              el('span', '', nameCell, name);
              el('span', '', row, kind);
              el('span', '', row, date);
            });
            const scrollbar = el('div', 'office-scrollbar', recent);
            el('div', 'office-scroll-arrow up', scrollbar, '▲');
            el('div', 'office-scroll-thumb', scrollbar);
            el('div', 'office-scroll-arrow down', scrollbar, '▼');
            const tips = el('section', 'office-tips office-pane', lower);
            el('h2', '', tips, 'Tips');
            el('p', '', tips, 'Use the tabs above to quickly switch between mail, calendar, contacts, tasks and your files.');
            el('p', '', tips, 'Each area keeps your information organized and easy to find.');
            el('p', '', tips, 'Point to a tab to see what you can do in each section.');
          }
          return result;
        },
      },
    },
  });
})();
