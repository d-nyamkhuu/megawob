(function () {
  'use strict';
  const palette = { bg: '#ffffff', panel: '#ffffff', fg: '#050505', muted: '#080808', line: '#080808' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      document.body.classList.add('macintosh');
      const u = _c.util,
        app = u.el('main', 'app', document.body),
        menu = u.el('nav', 'menubar', app);
      u.el('span', 'apple-mark', menu, '');
      ['File', 'Edit', 'Options', 'Window', 'Help'].forEach((x) => u.el('span', 'menu-item', menu, x));
      u.el('span', 'menubar-clock', menu, '9:24 AM');
      u.el('span', 'help-mark', menu, '?');
      u.el('span', 'document-mark', menu, '▤');
      const win = u.el('section', 'window', app),
        title = u.el('header', 'window-title', win);
      u.el('button', 'close-box', title, '×').type = 'button';
      u.el('span', 'title-pattern', title, '');
      u.el('strong', 'window-name', title, 'Number Classifier');
      u.el('span', 'title-pattern right-pattern', title, '');
      u.el('button', 'zoom-box', title, '□').type = 'button';
      const work = u.el('div', 'workarea', win),
        left = u.el('section', 'task-pane', work),
        header = u.el('div', 'brief', left);
      header.hidden = _c.display !== 'header';
      const right = u.el('aside', 'instruction-pane', work);
      u.el('h2', 'pane-title', right, 'Instructions');
      const body = u.el('div', 'instruction-body', right),
        copy = u.el('div', 'instruction-copy', body),
        icon = u.svg('svg', { width: 62, height: 72, viewBox: '0 0 62 72', class: 'instruction-icon' }, body);
      u.svg(
        'path',
        { d: 'M7 3h35l12 12v53H7z M42 3v13h12', fill: 'white', stroke: 'currentColor', 'stroke-width': 3 },
        icon,
      );
      for (let y = 24; y < 59; y += 9)
        u.svg('path', { d: `M15 ${y}h5m6 0h20`, fill: 'none', stroke: 'currentColor', 'stroke-width': 3 }, icon);
      u.el('p', '', copy, 'For each number, select whether it is odd or even.');
      u.el('p', '', copy, 'An odd number is not divisible by 2. An even number is divisible by 2.');
      u.el('hr', '', right);
      u.el('p', 'examples-label', right, 'Examples:');
      u.el('p', 'examples', right, '3 is odd\n8 is even\n0 is even');
      u.el('hr', 'lower-rule', right);
      const toolbar = u.el('div', 'mac-toolbar', right),
        bottom = u.el('footer', 'bottom', win);
      Object.assign(_c, { win, work, left, right, header, toolbar, bottom });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.work;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.right;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.left);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') _c.bottom.appendChild(document.body.querySelector('.ref-note'));
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      _c.bottom.prepend(foot);
      foot.querySelector('.ref-foot-text').textContent = 'Ready.';
      _c.util.el('span', 'resize-grip', _c.bottom, '▦');
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.toolbar.appendChild(dock);
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
    name: 'design-solve-puzzle-odd-even-03',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-solve-puzzle-odd-even-03': palette },
      LOW_THEME: palette,
      ACCENTS: ['#050505'],
      LOW_ACCENTS: ['#050505'],
      parts,
    },
  });
})();
