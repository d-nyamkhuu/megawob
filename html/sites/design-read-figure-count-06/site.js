(function () {
  'use strict';
  const palette = { bg: '#bcbab2', panel: '#d1cec5', fg: '#080808', muted: '#74726c', line: '#8a877f' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('plain', 'split', 'instruction-' + _c.display);
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      const tb = u.el('div', 'm-title', top);
      u.el('i', 'm-sys', tb);
      u.el('span', '', tb, 'Shape Counter');
      const mc = u.el('div', 'm-ctl', tb);
      ['min', 'max', 'close'].forEach((t) => u.el('b', t, mc));
      const mb = u.el('div', 'm-menu', top);
      ['File', 'Edit', 'View', 'Tools', 'Help'].forEach((t) => u.el('span', '', mb, t));
      const center = u.el('div', 'center', app);
      u.el('div', 'm-lab m-l1', center, 'Items');
      u.el('div', 'm-lab m-l2', center, 'Task');
      Object.assign(_c, { app, tb, mb, center, header: center });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('brief', 'header');
    },
    'frame.tools': (base) => (_c) => {
      const h = _c.header;
      _c.header = _c.tb;
      base(_c);
      _c.header = h;
      _c.headerTools.classList.add('m-toptools');
      for (const b of _c.headerTools.querySelectorAll('.ref-xtra')) {
        b.classList.add('m-xtra');
        _c.mb.appendChild(b);
      }
      if (_c.submit) _c.submit.classList.add('m-submit-top');
    },
    'frame.body': () => (_c) => { _c.body = _c.center; },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) panel.classList.add('brief', 'panel');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('brief', 'toast');
        _c.center.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('bottom');
      _c.app.appendChild(foot);
      foot.querySelector('.ref-foot-text').textContent = 'Ready';
      for (const b of foot.querySelectorAll('.ref-xtra')) b.classList.add('m-xtra');
      if (_c.submit && _c.placement === 'footer') _c.submit.classList.add('submit');
      if (_c.submit && _c.placement === 'link') _c.submit.classList.add('m-endlink');
      _c.util.el('span', 'm-clock', foot, 'Mon Apr 15 1991   10:24 AM');
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) {
        _c.foot.appendChild(dock);
        _c.submit.classList.add('submit');
      }
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
    name: 'design-read-figure-count-06',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-read-figure-count-06': palette },
      LOW_THEME: palette,
      ACCENTS: ['#0a1993'],
      LOW_ACCENTS: ['#0a1993'],
      parts,
    },
  });
})();
