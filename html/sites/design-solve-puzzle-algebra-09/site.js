(function () {
  'use strict';
  const palette = { bg: '#bfc0c2', panel: '#f7f7f7', fg: '#080808', muted: '#55585a', line: '#55585a' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('nextstep', 'command-wide-content', 'instruction-' + _c.display);
      if (_c.placement) document.body.classList.add('end-' + _c.placement);
      const system = u.el('header', 'system-menu', document.body);
      u.el('b', 'workspace', system, 'Workspace');
      ['File', 'Edit', 'View', 'Go', 'Tools', 'Help'].forEach((x) => u.el('span', 'menu-item', system, x));
      u.el('time', 'clock', system, 'Mon Apr 12  9:24 AM');
      const app = u.el('main', 'app', document.body);
      const rail = u.el('nav', 'command-rail', app);
      [['▤', 'Docs'], ['▱', 'Apps'], ['>_', 'Terminal'], ['✎', 'Notes'], ['▥', 'Trash']].forEach(([ico, label]) => {
        const item = u.el('div', 'rail-item', rail);
        u.el('span', 'rail-icon', item, ico);
        u.el('span', 'rail-label', item, label);
      });
      const top = u.el('header', 'top', app);
      u.el('span', '', top, 'Algebra Practice');
      const wc = u.el('div', 'native-window-controls', top);
      for (const kind of ['min', 'max', 'close']) {
        const svg = u.svg('svg', { width: 20, height: 20, viewBox: '0 0 20 20' }, wc);
        u.svg('path', {
          d: kind === 'min' ? 'M3 12h14' : kind === 'max' ? 'M4 4h12v12H4z' : 'M4 4l12 12M16 4L4 16',
          fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5,
        }, svg);
      }
      const center = u.el('div', 'center', app);
      const aside = u.el('aside', 'aside', document.body);
      Object.assign(_c, { app, top, center, aside, header: center });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('brief');
    },
    'frame.tools': (base) => (_c) => {
      const h = _c.header;
      _c.header = _c.top;
      base(_c);
      _c.header = h;
    },
    'frame.body': () => (_c) => { _c.body = _c.center; },
    'frame.panel': (base) => (_c) => {
      const b = _c.body;
      _c.body = _c.aside;
      base(_c);
      _c.body = b;
      const heading = _c.aside.querySelector('.ref-panel-title');
      if (heading) heading.textContent = 'Task Inspector';
    },
    'frame.stage': () => (_c) => { _c.stage = _c.util.el('section', 'stage', _c.center); },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('brief', 'toast-note');
        _c.center.insertBefore(note, _c.stage);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        foot.classList.add('bottom');
        _c.app.appendChild(foot);
        _c.foot = foot;
      }
    },
    'frame.floating': (base) => (_c) => { base(_c); },
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
    name: 'design-solve-puzzle-algebra-09',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: ['#202326'], LOW_ACCENTS: ['#202326'], parts,
    },
  });
})();
