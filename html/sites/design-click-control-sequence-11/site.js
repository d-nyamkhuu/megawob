(function () {
  'use strict';
  const cfg = {
    'title': 'Task Manager',
    'theme': 'forum',
    'layout': 'board',
    'tools':
      'File     New   Open   Save   Delete        Edit    Cut   Copy   Paste        Tasks       View    Refresh   Search       Tools    Export   Print',
    'obstacle': 'Software Update Reminder',
    'copy': 'A new version of Task Manager is available (version 2.5). Would you like to update now?',
    'dismiss': 'Remind me later',
  };
  function drawHeader(ctx) {
      const u = ctx.util;
      document.body.className = 'ref ' + cfg.theme + ' ' + cfg.layout;
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const title = u.el('div', 'title', head, cfg.title);
      if (['qt', 'openlook', 'win92', 'clearlooks', 'industrial', 'electron', 'yosemite'].includes(cfg.theme)) {
        const controls = u.el('span', 'window-controls', title);
        controls.innerHTML =
          '<i><svg viewBox="0 0 16 16"><path d="M3 12h10"/></svg></i><i><svg viewBox="0 0 16 16"><path d="M3 3h10v10H3Z"/></svg></i><i><svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13"/></svg></i>';
      }
      const wl = u.el('span', 'welcome', head);
      wl.innerHTML = 'Welcome, Alex <em>|</em> <u>Settings</u> <em>|</em> <u>Help</u> <em>|</em> <u>Sign Out</u>';
      if (cfg.tools) u.el('div', 'tools', head, cfg.tools);
      if (cfg.overview) {
        const ov = u.el('section', 'overview', shell);
        cfg.overview.split('|').forEach((s, i) => u.el(i === 0 ? 'h2' : 'p', '', ov, s));
      }
      const toolbar = head.querySelector('.tools');
      if (toolbar) {
        toolbar.textContent = '';
        const groups = {
          'File': ['New', 'Open', 'Save', 'Delete'],
          'Edit': ['Cut', 'Copy', 'Paste'],
          'Tasks': [],
          'View': ['Refresh', 'Search'],
          'Tools': ['Export', 'Print'],
        };
        const icons = {
          'New':
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 2h8l4 4v14H4Z M12 2v5h4"/></svg>',
          'Open':
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 6h7l2 3h10l-3 11H3Z M3 7V4h7l2 3"/></svg>',
          'Save':
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2h15l3 3v17H3Z M7 2v7h10V2 M7 14h10v8"/></svg>',
          'Undo':
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 5 3 10l5 5 M3 10h10q8 0 7 9"/></svg>',
          'Redo':
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 5 21 10l-5 5 M21 10H11q-8 0-7 9"/></svg>',
          'Cut':
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 10 19 2 M7 14 19 22 M8 9a4 4 0 1 1-1-3 M8 15a4 4 0 1 0-1 3"/></svg>',
          'Copy':
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3h11v15H8Z M4 7H2v15h11v-2"/></svg>',
          'Paste':
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3H3v19h18V3h-4 M8 1h8v5H8Z"/></svg>',
          'Image':
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h20v18H2Z M4 18l5-7 4 5 3-3 5 5 M15 8h.1"/></svg>',
          'Link':
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m9 15-2 2a4 4 0 0 1-6-6l5-5a4 4 0 0 1 6 0 M15 9l2-2a4 4 0 0 1 6 6l-5 5a4 4 0 0 1-6 0 M8 16l8-8"/></svg>',
          'Refresh':
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M7 5h15 M7 12h15 M7 19h15 M1 5h2 M1 12h2 M1 19h2"/></svg>',
          'List':
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 5h15 M7 12h15 M7 19h15 M1 5h2 M1 12h2 M1 19h2"/></svg>',
          'Search':
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 15l7 7 M10 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16"/></svg>',
          'Settings':
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v3 M12 18v3 M3 12h3 M18 12h3 M5 5l3 3 M16 16l3 3 M19 5l-3 3 M8 16l-3 3 M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8"/></svg>',
          'Help':
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20 M8 8a4 4 0 0 1 8 0c0 4-4 3-4 7 M12 18h.1"/></svg>',
          'About':
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 2h13l4 4v16H4Z M8 9h9 M8 13h9 M8 17h9"/></svg>',
          'Reset':
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h20v14H2Z M8 21h8 M12 17v4"/></svg>',
        };
        const coloredIcons = {
          'New':
            '<path d="M7 2h15l7 7v23H7Z" fill="#fff" stroke="#8096b4"/><path d="M22 2v7h7" fill="#e1e8f2" stroke="#8096b4"/>',
          'Open':
            '<path d="M3 9V5h12l3 4h13v21H3Z" fill="#ffdb76" stroke="#a58c4f"/><path d="M2 14h31l-6 16H1Z" fill="url(#gold)" stroke="#a58c4f"/>',
          'Save':
            '<path d="M3 3h26l3 3v26H3Z" fill="url(#blue)" stroke="#586b8b"/><path d="M8 3h18v13H8Z" fill="#f3f5ef" stroke="#7c8895"/><path d="M21 4v11" stroke="#78899a" stroke-width="4"/><path d="M9 23h17v9H9Z" fill="#ebedf5" stroke="#596a83"/><path d="M12 25h5v7h-5Z" fill="#6d7897"/>',
          'Delete':
            '<path d="m7 3 10 10L27 3l5 5-10 10 10 10-5 5-10-10L7 33l-5-5 10-10L2 8Z" fill="url(#red)" stroke="#ba6061"/>',
          'Cut':
            '<path d="m11 24 12-21 3-1-1 7-10 19M21 24 9 3 6 2l1 7 10 19" fill="#dddfe5" stroke="#8292a9"/><circle cx="10" cy="28" r="5" fill="#3866ad" stroke="#224c86"/><circle cx="22" cy="28" r="5" fill="#3866ad" stroke="#224c86"/><circle cx="10" cy="28" r="2" fill="#e8f1fc"/><circle cx="22" cy="28" r="2" fill="#e8f1fc"/>',
          'Copy':
            '<path d="M4 2h16l5 5v23H4Z" fill="#f3f7ff" stroke="#7191b8"/><path d="M12 8h14l6 6v20H12Z" fill="#fff" stroke="#7191b8"/><path d="M26 8v6h6M16 19h12m-12 4h12m-12 4h12M7 7h9M7 12h3" fill="none" stroke="#9aacc4"/>',
          'Paste':
            '<rect x="5" y="5" width="25" height="28" rx="2" fill="url(#gold)" stroke="#94723f"/><rect x="9" y="10" width="18" height="21" fill="#fff" stroke="#8da2bb"/><path d="M12 4V2h10v2h4v5H9V4Z" fill="#c9ced4" stroke="#74808d"/><path d="M13 15h11m-11 4h11m-11 4h11m-11 4h11" stroke="#a9b4bf"/>',
          'Refresh':
            '<path d="M4 5h4v3H4Zm0 11h4v3H4Zm0 11h4v3H4ZM12 5h20v3H12Zm0 11h20v3H12Zm0 11h20v3H12Z" fill="url(#blue)" stroke="#3367a8"/>',
          'Search':
            '<path d="m21 22 11 10-3 3-10-12" fill="url(#gold)" stroke="#766449"/><circle cx="14" cy="14" r="11" fill="url(#glass)" stroke="#688fac" stroke-width="2"/><path d="M8 14a6 6 0 0 1 6-6" fill="none" stroke="#fff" stroke-width="3"/>',
          'Export':
            '<path d="M6 3h17l7 7v23H6Z" fill="#f4f7f2" stroke="#8b9aaf"/><path d="M23 3v7h7" fill="#dbe5ed" stroke="#8b9aaf"/><path d="M10 18h4v11h-4Z" fill="#e46063" stroke="#a8545b"/><path d="M17 12h4v17h-4Z" fill="#8bbe5b" stroke="#69974e"/><path d="M24 20h4v9h-4Z" fill="#5d9bd1" stroke="#4c80b2"/>',
          'Print':
            '<path d="M9 2h18v13H9Z" fill="#fff" stroke="#8192ab"/><rect x="3" y="12" width="30" height="17" rx="3" fill="url(#silver)" stroke="#687f9b"/><path d="M8 23h20v10H8Z" fill="#f2f5fa" stroke="#7f8d9f"/><path d="M9 16h17M11 26h14m-14 3h14" stroke="#9aa8b8"/><path d="M27 16h3" stroke="#4f9371"/>',
        };
        for (const [key, art] of Object.entries(coloredIcons)) {
          icons[key] =
            '<svg viewBox="0 0 36 36"><defs><linearGradient id="gold" x2="0" y2="1"><stop stop-color="#fff0a4"/><stop offset="1" stop-color="#e4ad39"/></linearGradient><linearGradient id="blue" x2="0" y2="1"><stop stop-color="#859cc5"/><stop offset="1" stop-color="#354779"/></linearGradient><linearGradient id="red" x2="0" y2="1"><stop stop-color="#ff9a92"/><stop offset="1" stop-color="#e34339"/></linearGradient><linearGradient id="silver" x2="0" y2="1"><stop stop-color="#f9fcff"/><stop offset="1" stop-color="#8c9bad"/></linearGradient><radialGradient id="glass"><stop stop-color="#fafdff"/><stop offset=".65" stop-color="#e6f6fc"/><stop offset="1" stop-color="#bad1df"/></radialGradient></defs>' +
            art +
            '</svg>';
        }
        for (const [label, items] of Object.entries(groups)) {
          const g = u.el('div', 'ribbon-group', toolbar);
          if (label) u.el('strong', 'ribbon-label', g, label);
          const row = u.el('div', 'ribbon-row', g);
          for (const item of items) {
            const b = u.el('div', 'ribbon-tool', row);
            if (icons[item]) b.innerHTML = icons[item];
            else u.el('span', 'tool-symbol', b, item.length === 1 ? item : '');
            u.el('span', '', b, item);
          }
        }
      }
      toolbar.addEventListener('click', (e) => {
        const tool = e.target.closest('.ribbon-tool');
        if (tool) env.log('decoy', { label: tool.textContent.trim() });
      });
      wl.addEventListener('click', (e) => {
        if (e.target.tagName === 'U') env.log('decoy', { label: e.target.textContent });
      });
      return { shell, head, toolbar };
  }
  function drawTable(u, project) {
      const table = u.el('table', 'project-table', project);
      table.innerHTML =
        '<tr><th>#</th><th>Task Name</th><th>Status</th><th>Priority</th><th>Due Date</th><th>Owner</th><th>Notes</th></tr>';
      [
        ['1', 'Website Redesign', 'In Progress', 'High', 'Apr 30, 2025', 'Jamie', 'Update layout and styles'],
        ['1.1', 'Create mockups', 'Completed', 'Medium', 'Apr 12, 2025', 'Jamie', 'Initial designs ready'],
        ['1.2', 'Review with team', 'Pending', 'Medium', 'Apr 18, 2025', 'Alex', 'Gather feedback'],
        ['2', 'Content Updates', 'Not Started', 'High', 'May 5, 2025', 'Taylor', 'New product information'],
        ['2.1', 'Write copy', 'Pending', 'Medium', 'Apr 25, 2025', 'Taylor', 'Focus on key features'],
        ['2.2', 'Add images', 'Not Started', 'Low', 'Apr 28, 2025', 'Morgan', 'Use approved assets'],
        ['3', 'Testing', 'Not Started', 'Medium', 'May 10, 2025', 'Casey', 'Cross-browser testing'],
        ['3.1', 'Functional tests', 'Not Started', 'Medium', 'May 2, 2025', 'Casey', 'Core functionality'],
        ['3.2', 'Fix issues', 'Not Started', 'Low', 'May 8, 2025', 'Alex', 'Address bug reports'],
      ].forEach((r, i) => {
        const row = u.el('tr', r[0].indexOf('.') < 0 ? 'top-row' : 'sub-row', table);
        r.forEach((text, j) => {
          const td = u.el('td', 'c' + j, row);
          if (j === 1) {
            if (r[0].indexOf('.') < 0) {
              u.el('i', 'tog', td, '−');
              u.el('b', '', td, text);
            } else u.el('span', 'sub', td, text);
          } else if (j === 2 || j === 3) {
            u.el('span', 'pill p-' + text.toLowerCase().replace(/ /g, ''), td, text);
          } else td.textContent = text;
        });
      });
  }
  const palette = { bg: '#f4f7fc', panel: '#f7f9fd', fg: '#122c60', muted: '#2a4766', line: '#9db6d6' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const { shell, head, toolbar } = drawHeader(_c.ctx);
      const work = u.el('div', 'work', shell);
      const center = u.el('section', 'center', work);
      const project = u.el('div', 'project-workbench', center);
      const projectTitle = u.el('h2', '', project, 'Project Tasks');
      Object.assign(_c, { shell, head, toolbar, work, center, project, projectTitle, header: project });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('instruction');
        note.dataset.display = _c.display;
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.projectTitle;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.work; },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.work.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('episode-note-panel');
        panel.querySelector('.ref-panel-title').textContent = 'Task note';
        const note = panel.querySelector('.ref-panel-text');
        note.classList.add('instruction');
        note.dataset.display = _c.display;
      }
    },
    'frame.stage': () => (_c) => {
      drawTable(_c.util, _c.project);
      const stage = _c.head.querySelectorAll('.ribbon-group')[2].querySelector('.ribbon-row');
      stage.classList.add('task-ribbon-stage');
      _c.stage = stage;
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('instruction', 'instruction-toast');
        note.querySelector('.ref-note-text').dataset.display = _c.display;
        _c.project.insertBefore(note, _c.project.querySelector('.project-table'));
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('footer');
      _c.shell.appendChild(foot);
      const ready = foot.querySelector('.ref-foot-text');
      ready.classList.add('ready');
      ready.textContent = '3 projects   |   9 tasks';
      const st = _c.util.el('span', 'not-submitted', foot);
      _c.util.el('i', 'dot', st);
      _c.util.el('span', '', st, 'Not submitted');
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.insertBefore(dock, _c.foot.querySelector('.not-submitted'));
    },
    overlay: () => (ctx) => {
      if (ctx.kind === 'promo') {
        const u = ctx.util;
        const obstacle = u.el('section', 'design-obstacle', document.body);
        u.el('h2', '', obstacle, cfg.obstacle);
        cfg.copy.split('|').forEach((t) => u.el('p', '', obstacle, t));
        const cd = u.el('span', 'cd-icon', obstacle);
        const btns = u.el('div', 'dlg-btns', obstacle);
        const b1 = u.el('button', 'dlg-other', btns, 'Update now');
        b1.type = 'button';
        const close = u.el('button', 'dismiss-design', btns, cfg.dismiss);
        close.type = 'button';
        close.addEventListener('click', ctx.dismiss);
        const b3 = u.el('button', 'dlg-other', btns, 'View details');
        b3.type = 'button';
        const xb = u.el('button', 'dlg-x', obstacle, '×');
        xb.type = 'button';
        xb.addEventListener('click', ctx.dismiss);
        b1.addEventListener('click', ctx.dismiss);
        b3.addEventListener('click', ctx.dismiss);
        return { el: obstacle, dismiss: close };
      }
      const el = ctx.util.el('section', 'perturb ' + ctx.kind, document.body);
      ctx.util.el(
        'strong',
        '',
        el,
        {
          cookie: 'Cookie preferences',
          toast: 'Notification',
          chat: 'Support',
          promo: 'A special offer',
          banner: 'Service notice',
        }[ctx.kind],
      );
      ctx.util.el(
        'p',
        '',
        el,
        {
          cookie: 'Choose your preferences to continue.',
          toast: 'Your workspace is ready.',
          chat: 'How can we help?',
          promo: 'Explore the latest tools.',
          banner: 'A new update is available.',
        }[ctx.kind],
      );
      const dismiss = ctx.util.el('button', 'dismiss', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      el.querySelectorAll('.dlg-other,.dlg-x').forEach((b) => b.addEventListener('click', ctx.dismiss));
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-click-control-sequence-11',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    initialOverlay: { kind: 'promo' },
    design: {
      THEMES: { 'design-click-control-sequence-11': palette },
      LOW_THEME: palette,
      ACCENTS: ['#416fa8'],
      LOW_ACCENTS: ['#416fa8'],
      parts,
    },
  });
})();
