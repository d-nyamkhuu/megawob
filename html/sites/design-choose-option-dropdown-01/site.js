(function () {
  'use strict';
  const palette = { bg: '#bdbbb4', panel: '#e9e9ec', fg: '#000000', muted: '#66707d', line: '#bbc2c9' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // This design has its own side card and inline notification at every size.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-brand', top, 'Task Manager');
      u.el('span', '', top, '−    □    ×');
      const nav = u.el('nav', 'ds-menu', document.body);
      'File|Edit|View|Tasks|Options'.split('|').forEach((t) => u.el('span', '', nav, t));
      const tasks = u.el('section', 'ds-tasklist', document.body);
      u.el('b', '', tasks, 'Open Tasks');
      const table = u.el('table', '', tasks);
      const head = u.el('tr', '', table);
      ['ID', 'Title', 'Assignee', 'Priority', 'Status', 'Due Date'].forEach((t) => u.el('th', '', head, t));
      [
        ['1021', 'Update user guide', 'Chen', 'Medium', 'In Progress', 'Apr 24, 1991'],
        ['1022', 'Fix build script', 'Patel', 'High', 'Open', 'Apr 25, 1991'],
        ['1023', 'Design settings dialog', 'Nguyen', 'Medium', 'Open', 'Apr 26, 1991'],
        ['1024', 'Verify data export', 'Lopez', 'Low', 'Open', 'Apr 28, 1991'],
        ['1025', 'Prepare release notes', 'Kim', 'Medium', 'In Progress', 'Apr 30, 1991'],
      ].forEach((row) => {
        const tr = u.el('tr', '', table);
        row.forEach((t) => u.el('td', '', tr, t));
      });
      const shell = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', shell);
      const header = u.el('aside', _c.display === 'header' ? 'ds-header-note' : 'ds-note-host', content);
      const toolbar = u.el('footer', 'ds-footer');
      Object.assign(_c, { shell, content, header, toolbar });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('ds-instruction');
        _c.util.el('h2', 'ds-task-legend', _c.header, 'Task Details');
      }
    },
    'frame.tools': (base) => (_c) => {
      const h = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = h;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'ds-main', _c.content);
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) panel.classList.add('ds-brief');
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      const stage = u.el('main', 'ds-stage', _c.body);
      const details = u.el('aside', 'ds-task-description', stage);
      u.el('label', '', details, 'Description:');
      u.el('div', 'ds-staticarea', details, 'Revise the Getting Started and Installation sections based on QA feedback.');
      u.el('label', '', details, 'Attachments:');
      u.el('div', 'ds-staticarea', details, 'user_guide_draft.txt\nqa_notes.txt');
      _c.stage = stage;
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-toast');
        _c.content.insertBefore(note, _c.body);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      _c.toolbar.appendChild(foot);
      _c.content.appendChild(_c.toolbar);
      const status = _c.util.el('div', 'ds-motif-status', document.body);
      _c.util.el('span', '', status, 'Ready.');
      _c.util.el('span', '', status, 'Mon Apr 22 1991  10:14 AM');
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.toolbar.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: 'design-choose-option-dropdown-01',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-choose-option-dropdown-01': palette },
      LOW_THEME: palette,
      ACCENTS: ['#273776'],
      LOW_ACCENTS: ['#273776'],
      parts,
    },
  });
})();
