(function () {
  'use strict';
  const palette = { bg: '#faf7ed', panel: '#fff', fg: '#101d49', muted: '#59617d', line: '#101d49' };
  const styleEnd = (_c) => {
    if (_c.submit) _c.submit.classList.add('memphis-end-' + _c.placement);
  };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // Match the original card's note modes at its roomy viewport.
      _c.display = _c.ctx.display || 'header';
      if ((_c.display === 'panel' || _c.display === 'toast') && !(_c.W > 1366 && _c.H > 768)) {
        _c.display = 'header';
      }
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
    },
    'frame.placement': (base) => (_c) => {
      const rng = _c.rng;
      _c.rng = rng.fork('chrome/site/placement');
      base(_c);
      _c.rng = rng;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('memphis', 'stagger', 'instruction-' + _c.display);
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      u.el('span', '', top, 'Block Math');
      const center = u.el('div', 'center', app);
      const toolbar = u.el('div', 'memphis-toolbar', app);
      const tools = u.el('div', 'memphis-tools', document.body);
      [
        ['▱', 'Clear'],
        ['↻', 'Reset'],
      ].forEach(([icon, label]) => {
        const item = u.el('div', 'memphis-tool', tools);
        u.el('span', 'tool-icon', item, icon);
        u.el('span', '', item, label);
      });
      const hint = u.el('div', 'memphis-hint', document.body);
      u.el('span', 'hint-icon', hint, '☼');
      u.el('span', '', hint, 'Need a hint?');
      const sideNote = u.el('div', 'memphis-side-note', app);
      const toastNote = u.el('div', 'memphis-toast-note', app);
      const footer = u.el('footer', 'bottom', app);
      Object.assign(_c, { app, center, toolbar, sideNote, toastNote, footer, header: toolbar });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.center;
      base(_c);
      _c.header = header;
      const note = _c.center.querySelector('.ref-instruction');
      if (note) note.classList.add('brief');
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
      styleEnd(_c);
    },
    'frame.body': () => (_c) => {
      _c.body = _c.center;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.sideNote;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.toastNote.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.footer.appendChild(foot);
      styleEnd(_c);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      styleEnd(_c);
      // Keep all sampled auxiliary controls clear of the two large tool cards.
      document.body.querySelectorAll('.ref-xtra').forEach((button, index) => {
        button.classList.add('memphis-extra-' + index);
        _c.toolbar.appendChild(button);
      });
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
    name: 'design-read-figure-addition-06',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#fa7773'],
      LOW_ACCENTS: ['#fa7773'],
      parts,
    },
  });
})();
