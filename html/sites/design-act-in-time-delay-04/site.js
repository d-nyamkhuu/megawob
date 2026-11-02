(function () {
  'use strict';
  const palette = { bg: '#edf5fc', panel: '#f4f9fe', fg: '#111827', muted: '#637894', line: '#dce8f4' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = _c.util;
      const shell = u.el('div', 'ds-shell', document.body);
      const head = u.el('header', 'ds-header', shell);
      const note = u.el('div', 'ds-instruction-area', head);
      const timer = u.el('aside', 'ds-timer', head);
      u.el('span', 'ds-clock-icon', timer, '◷');
      const timerCopy = u.el('div', 'ds-timer-copy', timer);
      u.el('div', 'ds-timer-label', timerCopy, 'Time until start');
      u.el('strong', 'ds-timer-value', timerCopy, '00:00:15');
      u.el('div', 'ds-timer-state', timerCopy, 'Waiting for task to begin...');
      const toolbar = u.el('div', 'ds-toolbar', shell);
      Object.assign(_c, { shell, header: note, toolbar });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.shell;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        _c.util.el('div', 'ds-note-heading', note, 'Task notification');
        note.insertBefore(note.lastChild, note.firstChild);
        _c.header.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.shell.appendChild(foot);
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
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 1 : 0 };
    },
  };
  env.site({
    name: 'design-act-in-time-delay-04',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#2588f5'],
      LOW_ACCENTS: ['#2588f5'],
      parts,
    },
  });
})();
