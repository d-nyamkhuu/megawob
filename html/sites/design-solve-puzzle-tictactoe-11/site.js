(function () {
  'use strict';
  const palette = { bg: '#332c25', panel: '#faf7ed', fg: '#111111', muted: '#8b372c', line: '#171512' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
      document.body.className = 'notebook instruction-' + _c.display;
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const app = u.el('main', 'app', document.body);
      const tabs = u.el('nav', 'tabs', app);
      ['Play', 'Notes', 'Strategy', 'History', 'About'].forEach((label, i) => {
        const tab = u.el('div', 'tab' + (i === 0 ? ' active' : ''), tabs, label);
        tab.addEventListener('click', () => env.log('decoy', { label }));
      });
      const top = u.el('header', 'top', app);
      u.el('span', '', top, 'Tic-Tac-Toe');
      const center = u.el('div', 'center', app);
      Object.assign(_c, { app, top, center, header: center });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('brief');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.top;
      base(_c);
      _c.header = header;
      if (_c.placement === 'header' || _c.placement === 'icon') _c.app.classList.add('end-at-header');
    },
    'frame.body': () => (_c) => {
      _c.body = _c.center;
      _c.aside = _c.util.el('aside', 'aside', _c.center);
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.aside;
      base(_c);
      _c.body = body;
      const note = _c.aside.querySelector('.ref-panel');
      if (note) note.classList.add('brief');
      _c.util.el('b', '', _c.aside, 'How to Play');
      _c.util.el('p', 'aside-copy', _c.aside,
        '1. You are X.\n2. Click an empty square to place your X.\n3. The computer will make its move.\n4. Keep playing until the game is over.');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.center);
      _c.center.insertBefore(_c.stage, _c.aside);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('brief');
        _c.center.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('bottom');
      _c.app.appendChild(foot);
      const text = foot.querySelector('.ref-foot-text');
      text.textContent = _c.ctx.finish ? 'Practice notebook · Page 1' : '';
      if (_c.ctx.finish) text.classList.add('edition-mark');
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.app.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body);
      const messages = {
        cookie: 'This application stores preferences on your device.',
        toast: 'Your workspace has been synced.',
        chat: 'Need help with this exercise?',
        promo: 'Try the new practice collection.',
        banner:
          'We’re performing scheduled maintenance later today. The game is fully playable now, but some features may be unavailable for a short time.',
      };
      u.el('span', '', el, messages[ctx.kind]);
      const dismiss = u.el(
        'button',
        '',
        el,
        ctx.kind === 'cookie' ? 'Accept' : ctx.kind === 'banner' ? 'Collapse Announcement ▲' : 'Dismiss',
      );
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-solve-puzzle-tictactoe-11',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    initialOverlay: { kind: 'banner' },
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#a92820'],
      LOW_ACCENTS: ['#a92820'],
      parts,
    },
  });
})();
