(function () {
  'use strict';
  const palette = { bg: '#fffef9', panel: '#fffef9', fg: '#101112', muted: '#737477', line: '#e7e6e0' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original has a dedicated brief pane even at the smallest viewport.
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
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const body = u.el('div', 'ds-body', document.body);
      body.dataset.display = _c.display;
      const left = u.el('aside', 'ds-brief', body);
      u.el('h2', '', left, 'Tracking Task');
      const main = u.el('div', 'ds-main', body);
      const right = u.el('aside', 'ds-perimeter', body);
      u.el('div', 'ds-time-label', right, 'Time remaining');
      u.el('div', 'ds-time-value', right, '11.0 s');
      const progress = u.el('div', 'ds-time-meter', right);
      u.el('i', '', progress);
      const pause = u.el('button', 'ds-pause', document.body, 'Pause');
      pause.type = 'button';
      Object.assign(_c, { body, left, main, right, header: left });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.right;
      base(_c);
      _c.header = header;
      if (_c.headerTools.children.length) _c.right.classList.add('ds-perimeter-with-end');
    },
    'frame.body': () => () => {},
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.left;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.main);
      _c.util.el('div', 'ds-pointer', _c.main);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-episode-toast');
        const title = _c.util.el('div', 'ds-toast-label', null, 'Tracking task');
        note.insertBefore(title, note.firstChild);
        _c.main.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        foot.classList.add('ds-footer');
        foot.classList.toggle('ds-link-dock', _c.placement === 'link');
      }
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = { cookie: 'We use cookies to remember your preferences.', toast: 'Changes synced.', chat: 'Hello. How can we help?', promo: 'Try our new workspace.', banner: 'Scheduled maintenance tonight.' };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: 'design-act-in-time-chase-06',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-act-in-time-chase-06': palette },
      LOW_THEME: palette,
      ACCENTS: ['#a8f21c'],
      LOW_ACCENTS: ['#a8f21c'],
      parts,
    },
  });
})();
