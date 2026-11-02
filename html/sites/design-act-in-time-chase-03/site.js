(function () {
  'use strict';
  const palette = { bg: '#c5c8cc', panel: '#d8dadd', fg: '#111820', muted: '#30363c', line: '#71777d' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      document.body.dataset.instruction = _c.display;
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
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-apple', top, '');
      const menu = u.el('nav', 'ds-menuitems', top);
      ['File', 'Edit', 'Task', 'Window', 'Help'].forEach((t) => u.el('span', '', menu, t));
      u.el('span', 'ds-time', top, '10:24 AM');
      const title = u.el('div', 'ds-titlebar', document.body);
      u.el('span', 'ds-title', title, 'Pointer Practice');
      const controls = u.el('div', 'ds-window-controls', title);
      ['', '', ''].forEach(() => u.el('i', '', controls));
      const header = u.el('section', 'ds-header-note', document.body);
      const readout = u.el('div', 'ds-readout', header);
      Object.assign(_c, { header, title, readout });
    },
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction, .ref-spacer');
      if (note) _c.header.insertBefore(note, _c.readout);
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.title;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const noteSlot = _c.util.el('div', 'ds-note-slot', document.body);
      const body = _c.util.el('div', 'ds-content', document.body);
      Object.assign(_c, { body, noteSlot });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.noteSlot;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.noteSlot.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.body.appendChild(foot);
      _c.body.classList.toggle('ds-bottom-controls', !!(foot && foot.querySelector('button, a')));
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) {
        _c.body.appendChild(dock);
        _c.body.classList.add('ds-bottom-controls');
      }
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
        banner: 'Scheduled maintenance tonight.'
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    }
  };
  env.site({
    name: 'design-act-in-time-chase-03',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#3268ed'],
      LOW_ACCENTS: ['#3268ed'],
      parts
    }
  });
})();
