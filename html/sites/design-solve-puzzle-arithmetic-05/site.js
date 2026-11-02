(function () {
  'use strict';
  const palette = { bg: '#aaaaaa', panel: '#bdbdbd', fg: '#050505', muted: '#555555', line: '#111111' };
  // The shared arithmetic widget reparents the end button into its scene.
  // Reserve its original slot and retain the section's position after that move.
  function keepControlPosition(button) {
    if (!button) return;
    const rect = button.getBoundingClientRect();
    const slot = document.createElement('span');
    slot.className = 'wb-control-slot';
    slot.setAttribute('aria-hidden', 'true');
    slot.style.width = rect.width + 'px';
    slot.style.height = rect.height + 'px';
    button.before(slot);
    button.classList.add('wb-section-control');
    for (const [key, value] of Object.entries({ left: rect.left, top: rect.top, width: rect.width, height: rect.height }))
      button.style.setProperty('--control-' + key, value + 'px');
  }
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
      document.body.classList.remove('ref-has-note');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.className = 'amiga instruction-' + _c.display;
      const bar = u.el('header', 'workbench-bar', document.body);
      u.el('span', 'workbench-mark', bar, '▧');
      u.el('strong', '', bar, 'Amiga Workbench');
      ['File', 'Edit', 'Options', 'Window', 'Help'].forEach((x) => u.el('span', 'wb-menu-item', bar, x));
      u.el('time', '', bar, '14:27');
      u.el('button', 'disk-icon', bar, '◩');
      const index = u.el('aside', 'aside-index', document.body);
      u.el('div', 'index-spacer', index, '1');
      for (let i = 1; i <= 10; i++) u.el('div', 'index-item' + (i === 1 ? ' current' : ''), index, String(i));
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      u.el('span', '', top, 'Math Practice');
      const controls = u.el('div', 'native-window-controls', top);
      for (const [kind, text] of [['min', '−'], ['max', '□'], ['close', '×']])
        u.el('span', 'window-gadget ' + kind, controls, text);
      const center = u.el('div', 'center', app);
      Object.assign(_c, { app, top, center, header: top });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.center;
      base(_c);
      _c.header = header;
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
      _c.top.insertBefore(_c.headerTools, _c.top.querySelector('.native-window-controls'));
      if (_c.placement === 'header' || _c.placement === 'icon') keepControlPosition(_c.submit);
    },
    'frame.body': () => (_c) => {
      _c.body = _c.center;
    },
    'frame.panel': (base) => (_c) => { base(_c); },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.center);
      if (!_c.ctx.finish) {
        const clear = _c.util.el('button', 'clear-button', _c.app, 'Clear');
        clear.type = 'button';
        clear.addEventListener('click', () => {
          const input = _c.app.querySelector('.answer input');
          if (input) {
            input.value = '';
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.focus();
          }
        });
      }
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.center.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.app.appendChild(foot);
      if (_c.placement === 'footer' || _c.placement === 'link') keepControlPosition(_c.submit);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.app.appendChild(dock);
      if (_c.placement === 'floating') keepControlPosition(_c.submit);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body),
        messages = {
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
    name: 'design-solve-puzzle-arithmetic-05',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-solve-puzzle-arithmetic-05': palette },
      LOW_THEME: palette,
      ACCENTS: ['#073d9c'],
      LOW_ACCENTS: ['#073d9c'],
      parts,
    },
  });
})();
