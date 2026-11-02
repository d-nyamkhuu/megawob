(function () {
  'use strict';
  const icons = {
    Events: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 2v6M16 2v6M7 14h2M13 14h2M7 18h2M13 18h2"/>',
    Tasks: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="m7 12 3 3 7-8"/>',
    Contacts: '<circle cx="9" cy="7" r="4"/><path d="M2 22v-4c0-5 14-5 14 0v4M17 3c6 0 6 8 1 8M19 14c4 0 4 4 4 8"/>',
    Reports: '<path d="M3 21v-6h5v6M10 21V9h5v12M17 21V3h5v18"/>',
    Settings: '<path d="m10 2 4 0 1 4 3 1 3-1 2 4-3 3v2l3 2-2 4-4-1-3 2-1 3h-4l-1-3-3-2-3 1-2-4 3-2v-2l-3-3 2-4 3 1 3-1z"/><circle cx="12" cy="13" r="4"/>'
  };
  const palette = { bg: '#faf6ee', panel: '#fff', fg: '#080a29', muted: '#536387', line: '#c9ccd3' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // Each note mode has its own space in the event pane at every size.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'ds-body', document.body);
      u.el('div', 'ds-coral-circle', body);
      u.el('div', 'ds-back-dots', body);
      u.el('div', 'ds-lilac-triangle', body);
      const zig = u.el('div', 'ds-zigzag', body);
      zig.innerHTML = '<svg viewBox="0 0 210 70"><path d="m12 54 37-37 38 37 38-37 38 37 34-36" fill="none" stroke="#ff9691" stroke-width="19" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      const win = u.el('section', 'ds-window', body);
      const sidebar = u.el('aside', 'ds-sidebar', win);
      u.el('div', 'ds-side-coral', sidebar);
      u.el('div', 'ds-brand', sidebar, 'Horizon');
      const nav = u.el('nav', 'ds-nav', sidebar);
      for (const label of Object.keys(icons)) {
        const item = u.el('button', 'ds-nav-item' + (label === 'Events' ? ' active' : ''), nav);
        item.type = 'button';
        item.innerHTML = '<svg viewBox="0 0 26 26" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + icons[label] + '</svg><span>' + label + '</span>';
      }
      u.el('div', 'ds-side-triangle', sidebar);
      u.el('div', 'ds-side-dots', sidebar);
      const content = u.el('div', 'ds-content', win);
      const heading = u.el('header', 'ds-heading', content);
      u.el('div', 'ds-eyebrow', heading, 'Create Event');
      u.el('h1', '', heading, 'Event Details');
      Object.assign(_c, { shell: body, contentPane: content, heading, header: content });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-note', 'ds-note-header', 'ds-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.heading;
      base(_c);
      _c.header = header;
      _c.headerTools.classList.add('ds-heading-tools');
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      _c.body = _c.contentPane;
      const tasks = u.el('aside', 'ds-tasks', _c.shell);
      const titlebar = u.el('header', 'ds-task-titlebar', tasks);
      u.el('h2', '', titlebar, 'My Tasks');
      const lights = u.el('div', 'ds-lights', titlebar);
      for (let i = 0; i < 3; i++) u.el('i', '', lights);
      const taskbody = u.el('div', 'ds-task-body', tasks);
      const tabs = u.el('div', 'ds-tabs', taskbody);
      for (const label of ['To Do', 'In Progress', 'Done']) u.el('div', label === 'To Do' ? 'active' : '', tabs, label);
      for (const [label, date] of [['Prepare agenda', '07/20/2027'], ['Send invitations', '07/22/2027'], ['Book room', '07/23/2027'], ['Finalize materials', '07/27/2027']]) {
        const row = u.el('div', 'ds-task-row', taskbody);
        const check = u.el('button', 'ds-task-check', row);
        check.type = 'button'; check.setAttribute('aria-label', label);
        check.addEventListener('click', () => check.classList.toggle('checked'));
        u.el('span', 'ds-task-label', row, label);
        u.el('span', 'ds-task-date', row, date);
      }
      const add = u.el('button', 'ds-add-task', taskbody);
      add.type = 'button'; add.innerHTML = '<span>+</span> Add task';
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const note = _c.body.querySelector('.ref-panel');
      if (note) {
        note.classList.add('ds-note', 'ds-note-panel');
        note.querySelector('.ref-panel-text').classList.add('ds-instruction');
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.contentPane);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        _c.contentPane.appendChild(note);
        note.classList.add('ds-note', 'ds-note-toast');
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.contentPane.appendChild(foot);
      const cancel = _c.util.el('button', 'ds-cancel', foot, 'Cancel');
      cancel.type = 'button';
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.insertBefore(dock, _c.foot.querySelector('.ds-cancel'));
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = { cookie: 'We use cookies to remember your preferences.', toast: 'Changes synced.', chat: 'Hello. How can we help?', promo: 'Try the new Horizon workspace.', banner: 'Scheduled maintenance tonight.' };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    }
  };
  env.site({
    name: 'design-set-date-calendar-01',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-set-date-calendar-01': palette }, LOW_THEME: palette,
      ACCENTS: ['#4b2cff'], LOW_ACCENTS: ['#4b2cff'], parts
    }
  });
})();
