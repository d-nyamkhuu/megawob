(function () {
  'use strict';
  const palette = { bg: '#347fca', panel: '#fff', fg: '#17283f', muted: '#547092', line: '#aebdce' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.className = 'aqua-workspace instruction-' + _c.ctx.display + ' shown-' + _c.display;
      const bar = u.el('div', 'desktop-menu', document.body);
      u.el('span', 'apple-mark', bar, '●');
      u.el('b', 'app-menu-name', bar, 'MindCheck');
      ['File', 'Edit', 'View', 'Window', 'Help'].forEach((x) => u.el('span', '', bar, x));
      u.el('span', 'menu-spacer', bar, '');
      u.el('span', 'sound-icon', bar, '◖))');
      u.el('span', 'clock-label', bar, 'Mon Apr 16  10:24 AM');
      u.el('span', 'search-mark', bar, '⌕');
      const app = u.el('main', 'app', document.body),
        top = u.el('header', 'top', app);
      u.el('div', 'traffic-lights', top);
      u.el('span', 'window-title', top, 'MindCheck — Number Cards');
      const center = u.el('div', 'center', app),
        heading = u.el('header', 'task-heading', center);
      u.el('b', '', heading, 'Number Cards');
      u.el('span', '', heading, 'Question 1 of 5');
      const dock = u.el('div', 'dock', document.body);
      ['◉', '✉', '◉', '16', '▤', '▧', '◯'].forEach((x, i) => u.el('span', 'dock-icon icon-' + i, dock, x));
      ['Macintosh HD', 'Documents'].forEach((x, i) => u.el('div', 'desktop-item disk-' + i, document.body, x));
      Object.assign(_c, { app, center, header: heading });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = document.body;
      base(_c);
      _c.header = header;
      const note = document.body.querySelector('.ref-instruction');
      if (note) note.classList.add('task-note');
    },
    'frame.body': () => (_c) => { _c.body = _c.center; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = document.body;
      base(_c);
      _c.body = body;
      const panel = document.body.querySelector('.ref-panel');
      if (panel) panel.classList.add('task-note', 'task-panel');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) note.classList.add('task-toast');
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('bottom');
      _c.app.appendChild(foot);
      const status = foot.querySelector('.ref-foot-text');
      status.classList.add('status-line');
      status.textContent = '';
      _c.util.el('span', 'info-icon', status, 'i');
      _c.util.el('span', 'status-copy', status, 'Ready.');
      _c.foot = foot;
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body),
        panel = u.el('div', 'consent-panel', el),
        globe = u.el('div', 'globe-icon', panel);
      u.el('span', '', globe, '🌐');
      const copy = u.el('div', 'consent-copy', panel);
      u.el('b', 'consent-title', copy, 'We value your privacy');
      u.el(
        'p',
        '',
        copy,
        'We use optional analytics to help improve MindCheck. This includes information about your device and how you use the app. You can change this later in Settings.',
      );
      u.el('p', 'consent-question', copy, 'Do you agree to share optional analytics?');
      const actions = u.el('div', 'consent-actions', copy),
        dismiss = u.el('button', 'reject-button', actions, 'Reject optional');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      const accept = u.el('button', 'accept-button', actions, 'Accept');
      accept.type = 'button';
      accept.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-read-figure-greatest-11',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/read-figure-greatest-3c3aee.css', 'templates/site/css/base-hooks.css', 'aqua.css', 'site.css'],
    design: {
      THEMES: { 'design-read-figure-greatest-11': palette },
      LOW_THEME: palette,
      ACCENTS: ['#2580e8'],
      LOW_ACCENTS: ['#2580e8'],
      parts,
    },
  });
})();
