(() => {
  'use strict';
  const palette = { bg: '#96948d', panel: '#f4f0df', fg: '#11100d', muted: '#55534d', line: '#211f1a' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      document.body.dataset.simonbrief = _c.display;
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = _c.util;
      const bar = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-apple', bar, '●');
      const menus = u.el('nav', 'ds-menu', bar);
      ['File', 'Edit', 'Game', 'Window', 'Help'].forEach(t => u.el('span', '', menus, t));
      u.el('span', 'ds-time', bar, '10:24 AM　 ✉');
      const content = u.el('section', 'ds-content', document.body);
      const title = u.el('header', 'ds-window-title', content);
      u.el('i', 'ds-window-box', title, '□');
      u.el('span', 'ds-title-rule', title, '');
      u.el('strong', '', title, 'Memory Game');
      u.el('span', 'ds-title-rule', title, '');
      u.el('i', 'ds-window-box', title, '▤');
      const mast = u.el('div', 'ds-masthead', content);
      u.el('span', 'ds-paper-icon', mast, '▤');
      u.el('strong', '', mast, 'Memory Game');
      u.el('span', 'ds-tagline', mast, 'A test of your memory.');
      Object.assign(_c, { contentWindow: content, title, header: content });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('ds-header-note');
        if (_c.ctx.instruction.length > 58) note.classList.add('ds-long-instruction');
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.title;
      base(_c);
      _c.header = header;
      _c.headerTools.classList.add('ds-window-tools');
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const note = u.el('aside', 'ds-simon-notes', document.body);
      u.el('div', 'ds-note-title', note, 'Notes');
      // Preserve the stationery's spacing without repeating the task goal.
      u.el('div', 'ds-note-body', note, '▤　Memory Game\n\n\n\n');
      u.el('div', 'ds-note-rule', note, '');
      u.el('div', 'ds-round', note, 'Round 1 of 5');
      Object.assign(_c, { body: _c.contentWindow, note });
    },
    'frame.panel': (base) => (_c) => {
      base({ ..._c, body: _c.note });
      const panel = _c.note.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-brief');
        panel.querySelector('.ref-panel-title').textContent = 'Task';
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-toast');
        _c.contentWindow.insertBefore(note, _c.stage);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.contentWindow.appendChild(foot);
      foot.querySelector('.ref-foot-text').textContent = 'Ready.';
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const el = u.el('section', `ds-overlay ds-overlay-${ctx.kind}`, document.body);
      el.dataset.role = 'overlay';
      const text = { cookie: 'We use cookies to remember your preferences.', toast: 'Changes synced.', chat: 'Hello. How can we help?', promo: 'Try our new workspace.', banner: 'Scheduled maintenance tonight.' };
      u.el('div', '', el, text[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: 'design-act-in-time-simon-04',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-act-in-time-simon-04': palette },
      LOW_THEME: palette,
      ACCENTS: ['#181714'],
      LOW_ACCENTS: ['#181714'],
      parts,
    },
  });
})();
