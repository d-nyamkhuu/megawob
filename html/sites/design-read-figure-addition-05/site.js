(function () {
  'use strict';
  const palette = { bg: '#dceaf8', panel: '#ffffff', fg: '#102f54', muted: '#657f9d', line: '#9db9d6' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      if (!_c.ctx.finish) {
        _c.placement = _c.rng.fork('chrome/site-placement').pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      }
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.className = 'electron stagger instruction-' + _c.display;
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      const icon = u.svg('svg', { width: 26, height: 26, viewBox: '0 0 26 26', class: 'title-icon' }, top);
      u.svg('rect', { x: 3, y: 2, width: 20, height: 22, rx: 3, fill: '#ee8520', stroke: 'currentColor', 'stroke-width': 1.5 }, icon);
      u.svg('path', { d: 'M7 7h12M7 11h12M7 15h12M7 19h9', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5 }, icon);
      u.el('span', 'app-title', top, 'Math Practice - Addition');
      const wc = u.el('div', 'native-window-controls', top);
      for (const kind of ['min', 'max', 'close']) {
        const svg = u.svg('svg', { width: 20, height: 20, viewBox: '0 0 20 20' }, wc);
        u.svg('path', {
          d: kind === 'min' ? 'M3 12h14' : kind === 'max' ? 'M4 4h12v12H4z' : 'M4 4l12 12M16 4L4 16',
          fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5,
        }, svg);
      }
      const tabs = u.el('nav', 'menu', top);
      ['Home', 'View', 'Tools', 'Help'].forEach((label, i) => u.el('span', i === 0 ? 'active' : '', tabs, label));
      const ribbon = u.el('div', 'ribbon', top);
      [
        ['New Problem', '▤'], ['Open', '▱'], ['Save', '▣'], ['Reset', '⟳'],
        ['Show Instructions', '☷'], ['Hint', '?'], ['Options', '⚙'],
      ].forEach((item, i) => {
        const g = u.el('div', 'ribbon-group' + (i === 2 || i === 3 || i === 5 ? ' divided' : ''), ribbon);
        u.el('span', 'ribbon-icon icon-' + i, g, item[1]);
        u.el('span', 'ribbon-label', g, item[0]);
        u.el('small', 'ribbon-caption', g, ['File', 'File', 'File', 'Problem', 'Learning', 'Learning', 'Settings'][i]);
      });
      const center = u.el('div', 'center', app);
      Object.assign(_c, { app, top, ribbon, center, header: center });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.center.querySelector('.ref-instruction');
      if (note) note.classList.add('brief');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.ribbon;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.center; },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const note = _c.center.querySelector('.ref-panel');
      if (note) note.classList.add('brief');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('brief', 'brief-toast');
        _c.center.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('bottom');
      const button = foot.querySelector('.ref-submit');
      if (button) button.classList.add('submit');
      _c.app.appendChild(foot);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
    },
    'frame.end': (base) => (_c) => {
      const frame = base(_c);
      if (frame.submit) frame.submit.classList.add('end-' + _c.placement);
      return frame;
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
    name: 'design-read-figure-addition-05',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: ['#1571c8'], LOW_ACCENTS: ['#1571c8'], parts,
    },
  });
})();
