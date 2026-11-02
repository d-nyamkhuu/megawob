(function () {
  'use strict';
  function glyph(u, key, parent, cls) {
    const paths = {
      home: '<path d="M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3z"/>',
      chart: '<path d="M5 20V12M12 20V5M19 20V9"/>',
      calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18"/>',
      check: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="m7 12 3 3 7-7"/>',
      people: '<path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M9.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
      list: '<path d="M9 6h12M9 12h12M9 18h12"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/>',
      search: '<circle cx="10.5" cy="10.5" r="7"/><path d="m16 16 5 5"/>',
      bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
    };
    const e = u.el('span', cls, parent);
    e.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + paths[key] + '</svg>';
    return e;
  }
  function drawHelp(u, rail) {
    const h = u.el('div', 'ds-help-head', rail);
    u.el('span', 'ds-calendar-icon', h, '▢');
    u.el('h2', '', h, 'About sprint weeks');
    u.el('p', 'ds-help-copy', rail, 'A sprint week represents a full Monday–Sunday week. Select the week that contains the date you have in mind.');
    u.el('hr', '', rail);
    u.el('h3', '', rail, 'Examples');
    [['Jul 1, 2024', 'Week of Jul 1, 2024'], ['Jul 29, 2024', 'Week of Jul 29, 2024'], ['Aug 12, 2024', 'Week of Aug 12, 2024']].forEach((x) => {
      const row = u.el('div', 'ds-example', rail);
      u.el('span', '', row, x[0]);
      u.el('span', '', row, '→');
      u.el('span', '', row, x[1]);
    });
    u.el('hr', '', rail);
    u.el('h3', '', rail, 'Tips');
    const tips = u.el('ul', 'ds-tips', rail);
    ['You can type a date, such as Jul 29, 2024, to find the week quickly.', 'Weeks always run from Monday to Sunday.', 'The selected week will be used for sprint reporting and capacity planning.'].forEach((x) => u.el('li', '', tips, x));
  }
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
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
      const shell = u.el('div', 'ds-body', document.body);
      const side = u.el('aside', 'ds-sidebar', shell);
      const brand = u.el('div', 'ds-brand', side);
      u.el('span', 'ds-mark', brand, 'E');
      u.el('b', '', brand, 'FlowForge');
      const nav = u.el('nav', 'ds-nav', side);
      [['home', 'Workspace'], ['chart', 'Roadmap'], ['calendar', 'Sprints'], ['check', 'Tasks'], ['chart', 'Reports'], ['people', 'Team']].forEach(([icon, label], i) => {
        const row = u.el('div', 'ds-nav-item' + (i === 2 ? ' active' : ''), nav);
        glyph(u, icon, row, 'ds-nav-icon');
        u.el('span', '', row, label);
      });
      const content = u.el('div', 'ds-content', shell);
      const toolbar = u.el('div', 'ds-toolbar', content);
      Object.assign(_c, { shell, content, toolbar, header: content });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-task-note', 'ds-header-note', 'ds-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const h = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = h;
    },
    'frame.body': () => (_c) => {
      const main = _c.util.el('div', 'ds-main', _c.content);
      const rail = _c.util.el('aside', 'ds-rail', main);
      Object.assign(_c, { main, rail, body: main });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.rail;
      base(_c);
      _c.body = body;
      const note = _c.rail.querySelector('.ref-panel');
      if (note) {
        note.classList.add('ds-task-note', 'ds-panel-note');
        note.querySelector('.ref-panel-text').classList.add('ds-instruction');
      }
      drawHelp(_c.util, _c.rail);
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.main);
      _c.main.insertBefore(_c.stage, _c.rail);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-task-note', 'ds-toast');
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        _c.content.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      const u = _c.util;
      const dock = u.el('footer', 'ds-footer', _c.content);
      [['search', 'Home'], ['list', 'My work'], ['calendar', 'Sprints'], ['people', 'People'], ['chart', 'Reports']].forEach((x, i) => {
        const item = u.el('div', 'ds-dock-item' + (i === 2 ? ' active' : ''), dock);
        glyph(u, x[0], item, 'ds-dock-icon');
        u.el('span', '', item, x[1]);
      });
      glyph(u, 'bell', dock, 'ds-bell');
      u.el('span', 'ds-avatar', dock, 'JD');
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      dock.appendChild(foot);
      _c.dock = dock;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.dock.querySelector('.ref-foot .ref-tools').appendChild(dock);
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
  const palette = { bg: '#f4f3f1', panel: '#fff', fg: '#111827', muted: '#50596b', line: '#e1e2e5' };
  env.site({
    name: 'design-set-date-week-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: { THEMES: { 'design-set-date-week-02': palette }, LOW_THEME: palette, ACCENTS: ['#f4510b'], LOW_ACCENTS: ['#f4510b'], parts },
  });
})();
