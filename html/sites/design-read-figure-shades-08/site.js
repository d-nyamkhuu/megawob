(function () {
  'use strict';
  const palette = { bg: '#eef2f8', panel: '#f3f6fb', fg: '#101b30', muted: '#536586', line: '#dce3ed' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The document margin has room for all note formats at every viewport.
      _c.display = _c.ctx.display || 'header';
      document.body.classList.add('neu', 'stagger', 'instruction-' + _c.display);
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      u.el('span', '', top, 'Math Notebook');
      u.el('nav', 'menu', top, 'Notebook    Problems    Draw    Highlight    Erase');
      const center = u.el('div', 'center', app);
      const aside = u.el('aside', 'aside', document.body);
      const toolbar = u.el('div', 'margin-tools', aside);
      const noteArea = u.el('div', 'margin-note', aside);
      if (_c.display !== 'hidden') u.el('h3', '', noteArea, 'Instructions');
      const noteHost = u.el('div', 'note-host', noteArea);
      Object.assign(_c, { app, center, aside, toolbar, noteHost, header: center });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('brief');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.center; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.noteHost;
      base(_c);
      _c.body = body;
      const u = _c.util;
      u.el('h3', '', _c.aside, 'Notes');
      const ul = u.el('ul', 'notes', _c.aside);
      for (const text of [
        'Click any tile to select or deselect it.',
        'You can select multiple tiles.',
        'Only tiles of the requested color should be selected.',
      ]) u.el('li', '', ul, text);
      const bottom = u.el('footer', 'bottom', _c.aside);
      const clear = u.el('button', 'clear', bottom, 'Clear selection');
      clear.type = 'button';
      clear.addEventListener('click', () => {
        document.querySelectorAll('.up-tile[aria-checked="true"]').forEach((tile) =>
          tile.dispatchEvent(new MouseEvent('click', { bubbles: true, ctrlKey: true })));
      });
      _c.bottom = bottom;
    },
    'frame.stage': () => (_c) => { _c.stage = _c.util.el('section', 'stage', _c.center); },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.noteHost.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.bottom.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.aside.insertBefore(dock, _c.bottom);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body);
      const messages = {
        cookie: 'This application stores preferences on your device.',
        toast: 'Your workspace has been synced.',
        chat: 'Need help with this exercise?',
        promo: 'Try the new practice collection.',
        banner: 'An updated practice collection is available.',
      };
      u.el('span', '', el, messages[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Dismiss');
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-read-figure-shades-08',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: ['#3a86e8'], LOW_ACCENTS: ['#3a86e8'], parts,
    },
  });
})();
