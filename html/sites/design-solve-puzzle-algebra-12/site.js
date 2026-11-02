(function () {
  'use strict';
  const palette = { bg: '#ffffff', panel: '#ffffff', fg: '#202b39', muted: '#82909d', line: '#e2e6ea' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('responsive', 'center-stage', 'instruction-' + _c.display);
      if (!_c.ctx.finish) document.body.classList.add('end-placement-' + _c.placement);
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      const brand = u.el('div', 'brand', top);
      u.el('strong', '', brand, 'Math Practice');
      u.el('span', 'subtitle', brand, 'Algebra');
      const timer = u.el('div', 'timer', top);
      u.el('span', 'pause-mark', timer, 'Ⅱ');
      const status = u.el('div', '', timer);
      u.el('b', '', status, 'Timer paused');
      u.el('span', '', status, 'Will start after layout is restored');
      const center = u.el('div', 'center', app);
      const canvas = u.el('section', 'task-canvas', center);
      const footer = u.el('footer', 'bottom', app);
      const help = u.el('div', 'perimeter-tool help', footer);
      u.el('span', 'tool-icon', help, '?');
      u.el('span', '', help, 'Help');
      const toolbar = u.el('div', 'perimeter-controls', footer);
      const settings = u.el('div', 'perimeter-tool settings', footer);
      u.el('span', 'tool-icon', settings, '⚙');
      u.el('span', '', settings, 'Settings');
      help.addEventListener('click', () => env.log('decoy', { label: 'Help' }));
      settings.addEventListener('click', () => env.log('decoy', { label: 'Settings' }));
      Object.assign(_c, { app, center, canvas, footer, toolbar, header: canvas });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.center;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.canvas;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.canvas);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.canvas.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        foot.querySelector('.ref-foot-text').remove();
        _c.toolbar.appendChild(foot);
      }
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.footer.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind + (ctx.initial ? ' restore-overlay' : ''), document.body);
      if (ctx.initial) {
        const dialog = u.el('section', 'restore-dialog', el),
          close = u.el('button', 'restore-close', dialog, '×');
        close.type = 'button';
        close.setAttribute('aria-label', 'Close warning');
        close.addEventListener('click', ctx.dismiss);
        u.el('span', 'warning-icon', dialog, '!');
        const copy = u.el('div', 'restore-copy', dialog);
        u.el('b', '', copy, 'Layout could not be restored.');
        u.el(
          'p',
          '',
          copy,
          "We couldn't load your last layout. Your task is still here.\nYou can use the default layout to continue.",
        );
        const recover = u.el('button', 'restore-action', dialog, 'Use default layout');
        recover.type = 'button';
        recover.addEventListener('click', ctx.dismiss);
        return { el, dismiss: recover };
      }
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
    name: 'design-solve-puzzle-algebra-12',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    initialOverlay: { kind: 'banner' },
    design: {
      THEMES: { 'design-solve-puzzle-algebra-12': palette },
      LOW_THEME: palette,
      ACCENTS: ['#55b895'],
      LOW_ACCENTS: ['#55b895'],
      parts,
    },
  });
})();
