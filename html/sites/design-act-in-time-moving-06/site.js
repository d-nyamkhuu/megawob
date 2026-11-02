(function () {
  'use strict';
  const palette = { bg: '#9fa1a2', panel: '#a8aaab', fg: '#090b0c', muted: '#55595c', line: '#c0c2c3' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // Workbench has a dedicated briefing box in all three visible modes.
      _c.display = _c.ctx.display === 'top' ? 'header' : (_c.ctx.display || 'header');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = _c.util;
      const root = document.body;
      const sys = u.el('header', 'wb-system', root);
      u.el('span', 'wb-system-name', sys, 'Amiga Workbench');
      u.el('span', '', sys, 'Release 2.04');
      u.el('span', '', sys, '1,948,688 graphics mem');
      u.el('span', '', sys, '7,340,032 other mem');
      u.el('button', 'wb-screen', sys, '▣');
      const title = u.el('header', 'wb-title', root);
      u.el('span', 'wb-app-icon', title, '◉');
      u.el('strong', '', title, 'Shape Catcher');
      const gadgets = u.el('div', 'wb-gadgets', title);
      u.el('button', '', gadgets, '▱');
      u.el('button', '', gadgets, '×');
      const content = u.el('div', 'wb-content', root);
      content.classList.toggle('wb-hidden', _c.display === 'hidden');
      let briefing = null;
      if (_c.display !== 'hidden') {
        briefing = u.el('section', 'wb-brief wb-brief-' + _c.display, content);
        if (_c.display !== 'panel') u.el('h2', '', briefing, 'Task');
      }
      Object.assign(_c, { header: briefing || title, gadgets, content, briefing });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.gadgets;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.content;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      if (_c.briefing) _c.body = _c.briefing;
      base(_c);
      _c.body = body;
      const title = _c.briefing && _c.briefing.querySelector('.ref-panel-title');
      if (title) title.textContent = 'Task File';
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'wb-stage', _c.body);
      const controls = _c.util.el('section', 'wb-control-panel', document.body);
      _c.util.el('h2', '', controls, 'Controls');
      // These static labels retain the console's original chrome.
      for (const text of ['Pause', 'Reset']) _c.util.el('span', 'wb-utility', controls, text);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        _c.briefing.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
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
    name: 'design-act-in-time-moving-06',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-act-in-time-moving-06': palette },
      LOW_THEME: palette,
      ACCENTS: ['#073f9f'],
      LOW_ACCENTS: ['#073f9f'],
      parts,
    },
  });
})();
