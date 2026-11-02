(function () {
  'use strict';
  const palette = { bg: '#faf9f7', panel: '#faf9f7', fg: '#142127', muted: '#666666', line: '#bbbbbb' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      document.body.className = 'newspaper instruction-' + _c.display;
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const app = u.el('main', 'app', document.body),
        top = u.el('header', 'top', app);
      u.el('span', 'masthead', top, 'The Daily Chronicle');
      const account = u.el('div', 'account', top);
      u.el('div', '', account, 'Tuesday, April 12, 2011');
      u.el('p', '', account, 'Log In  |  Register');
      const nav = u.el('nav', 'menu', top);
      for (const label of ['HOME', 'NEWS', 'BUSINESS', 'SPORTS', 'OPINION', 'LIFE', 'ENTERTAINMENT', 'CLASSIFIEDS'])
        u.el('span', '', nav, label);
      const search = u.el('div', 'site-search', nav);
      const searchbox = u.el('input', '', search);
      searchbox.placeholder = 'Search the site...';
      searchbox.setAttribute('aria-label', 'Search the site');
      const go = u.el('button', '', search, 'Go');
      go.type = 'button';
      const center = u.el('div', 'center', app),
        sidebar = u.el('aside', 'challenge', center);
      u.el('div', 'section-label', sidebar, 'LEARNING');
      u.el('h1', '', sidebar, 'Today’s Math Challenge');
      for (const text of [
        'Practice your problem-solving skills with a quick question from our daily exercises.',
        'Read the instructions carefully and enter your answer.',
        'Good luck!',
      ]) u.el('p', '', sidebar, text);
      const work = u.el('div', 'workspace', center),
        heading = u.el('div', 'work-heading', work);
      u.el('div', 'section-label', heading, 'MATH PRACTICE');
      u.el('h2', '', heading, 'Linear Equations');
      Object.assign(_c, { app, top, center, noteSidebar: sidebar, work, header: work });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.work.querySelector('.ref-instruction');
      if (note) note.classList.add('brief');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.top;
      base(_c);
      _c.header = header;
      if (_c.submit) {
        _c.submit.classList.add('paper-top-end');
        _c.headerTools.style.paddingRight = (_c.submit.offsetWidth + 10) + 'px';
      }
    },
    'frame.body': () => (_c) => {
      _c.body = _c.center;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.noteSidebar;
      base(_c);
      _c.body = body;
      const note = _c.noteSidebar.querySelector('.ref-panel');
      if (note) {
        note.classList.add('brief', 'instruction-panel');
        note.setAttribute('role', 'note');
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.work);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('brief', 'instruction-toast');
        note.setAttribute('role', 'status');
        _c.work.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        _c.app.appendChild(foot);
        if (_c.placement === 'link' || _c.placement === 'floating') foot.classList.add('paper-raised-foot');
      }
      if (_c.placement === 'footer' && _c.submit) _c.submit.classList.add('submit');
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.app.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body);
      u.el(
        'span',
        '',
        el,
        {
          cookie: 'This application stores preferences on your device.',
          toast: 'Your workspace has been synced.',
          chat: 'Need help with this exercise?',
          promo: 'Try the new practice collection.',
          banner: 'An updated practice collection is available.',
        }[ctx.kind],
      );
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Dismiss');
      dismiss.type = 'button';
      dismiss.addEventListener('click', () => ctx.dismiss(ctx.kind === 'cookie' ? 'accept' : 'close'));
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-solve-puzzle-algebra-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-solve-puzzle-algebra-02': palette },
      LOW_THEME: palette,
      ACCENTS: ['#a61f1c'],
      LOW_ACCENTS: ['#a61f1c'],
      parts,
    },
  });
})();
