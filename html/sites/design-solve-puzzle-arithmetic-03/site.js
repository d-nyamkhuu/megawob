(function () {
  'use strict';
  const palette = { bg: '#f1f4f8', panel: '#ffffff', fg: '#101c33', muted: '#56657e', line: '#dce2eb' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      document.body.className = 'material-ledger ledger instruction-' + _c.display;
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      const hamb = u.svg('svg', { width: 28, height: 28, viewBox: '0 0 28 28', class: 'hamburger' }, top);
      u.svg('path', { d: 'M3 6h22M3 14h22M3 22h22', fill: 'none', stroke: 'currentColor', 'stroke-width': 2 }, hamb);
      u.el('span', 'brand', top, 'Math Practice');
      const nav = u.el('nav', 'menu', top);
      nav.style.cssText = 'position:absolute;left:auto;right:126px;top:0;width:max-content;height:72px;margin:0;padding:0;display:flex;align-items:center;gap:40px;color:#e6ebff;font-size:18px;white-space:nowrap';
      ['Problems', 'History', 'Settings'].forEach((label) => u.el('span', '', nav, label));
      const user = u.el('span', 'user-avatar', top);
      const portrait = u.svg('svg', { width: 30, height: 30, viewBox: '0 0 30 30' }, user);
      u.svg('circle', { cx: 14, cy: 14, r: 14, fill: '#dce5ff' }, portrait);
      u.svg('circle', { cx: 15, cy: 10, r: 5, fill: '#fff' }, portrait);
      u.svg('path', { d: 'M5 27c.7-6 4.5-9 10-9s9.3 3 10 9', fill: '#fff' }, portrait);
      const center = u.el('div', 'center', app);
      const brief = u.el('div', 'brief', center, _c.display === 'header' || _c.display === 'hidden' ? '' : 'Problem 3 of 10');
      const toolbar = u.el('div', 'exercise-toolbar');
      Object.assign(_c, { app, center, header: brief, toolbar });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
      if (_c.submit) _c.submit.classList.add('submit');
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const aside = u.el('aside', 'aside', _c.center);
      if (_c.display !== 'panel') u.el('b', '', aside, 'Instructions');
      Object.assign(_c, { body: _c.center, aside });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.aside;
      base(_c);
      _c.body = body;
      const list = _c.util.el('ol', 'instruction-list', _c.aside);
      ['Solve the math problem.', 'Type your answer in the box.'].forEach((t) => _c.util.el('li', '', list, t));
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.center);
      _c.stage.appendChild(_c.toolbar);
      const u = _c.util;
      const preview = u.el('section', 'preview', document.body);
      const previewHead = u.el('header', 'preview-head', preview);
      u.el('b', '', previewHead, 'Preview');
      u.el('span', 'preview-min', previewHead, '—');
      u.el('p', '', preview, 'Your answer will be checked when you finish.');
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      if (_c.submit && (_c.placement === 'footer' || _c.placement === 'link'))
        _c.submit.classList.add('ledger-footer-end');
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      if (_c.submit && _c.placement === 'floating') _c.submit.classList.add('ledger-floating-end');
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
    name: 'design-solve-puzzle-arithmetic-03',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-solve-puzzle-arithmetic-03': palette },
      LOW_THEME: palette,
      ACCENTS: ['#245bd7'],
      LOW_ACCENTS: ['#245bd7'],
      parts,
    },
  });
})();
