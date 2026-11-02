(function () {
  'use strict';
  const palette = { bg: '#f4f0e4', panel: '#ffffff', fg: '#111b4e', muted: '#15284e', line: '#657487' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The homepage has a permanent margin for both panel and message notes.
      _c.display = _c.ctx.display || 'header';
      document.body.className = 'human brief-left instruction-' + _c.display;
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      u.el('div', 'web-badge', top, '◎  A Brighter\nInternet Together');
      u.el('span', 'masthead-title', top, 'Alex’s Homepage');
      u.el('div', 'home-icon home-left', top, '⌂');
      u.el('div', 'home-icon home-right', top, '⌂');
      u.el('div', 'day-badge', top, 'GOOD PEOPLE\nBRIGHT DAYS  ☼');
      u.el('nav', 'menu', top, 'Math   •   Friends   •   Books   •   Good Times');
      const center = u.el('div', 'center', app);
      const aside = u.el('aside', 'aside', document.body);
      const title = u.el('b', 'aside-title', aside, _c.display === 'toast' ? 'New message' : 'Instructions');
      const noteSlot = u.el('div', 'margin-note', aside);
      const toolbar = u.el('div', 'homepage-toolbar', aside);
      Object.assign(_c, { app, center, aside, title, noteSlot, toolbar, header: center });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.center.querySelector('.ref-instruction');
      if (note) note.classList.add('brief');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const clear = u.el('button', 'clear-answer', _c.center, 'Clear');
      clear.type = 'button';
      clear.addEventListener('click', () => {
        const input = _c.center.querySelector('.answer input');
        if (input) {
          input.value = '';
          input.dispatchEvent(new Event('input', { bubbles: true }));
        }
      });
      const bar = u.el('div', 'article-bar', _c.center);
      u.el('strong', '', bar, 'Today’s Math Corner');
      u.el('span', '', bar, 'April 27, 1996');
      const greeting = u.el('div', 'greeting', _c.center);
      u.el('span', 'pencil-icon', greeting, '✎');
      u.el('span', '', greeting, 'A little practice goes a long way!');
      Object.assign(_c, { body: _c.center });
    },
    'frame.panel': (base) => (_c) => {
      base({ ..._c, body: _c.noteSlot });
      const u = _c.util;
      u.el('b', 'aside-heading', _c.aside, 'Tips');
      const tips = u.el('ul', 'aside-list', _c.aside);
      u.el('li', '', tips, 'Solve the equation for x.');
      u.el('li', '', tips, 'Type your answer as a number (e.g., 7).');
      u.el('b', 'aside-heading', _c.aside, 'Actions');
      const actions = u.el('ul', 'aside-list', _c.aside);
      u.el('li', '', actions, 'Use your keyboard to type in the box.');
      u.el('div', 'aside-flower', _c.aside, '❀');
      u.el('div', 'aside-blessing', _c.aside, 'Have a great day!');
      // Keep the controls after the margin's original static content.
      _c.aside.appendChild(_c.toolbar);
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.noteSlot.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      const u = _c.util;
      const footer = u.el('footer', 'home-footer', _c.app);
      const links = u.el('section', 'home-cell favorite-links', footer);
      u.el('h3', '', links, 'My Favorite Links');
      u.el('p', '', links, '▤　Books I Like');
      u.el('p', '', links, '◉　Cool Sites');
      u.el('p', '', links, '♣　Animals');
      u.el('p', '', links, '★　Fun Stuff');
      const visitor = u.el('section', 'home-cell visitor-note', footer);
      u.el('h3', '', visitor, 'A Note for Visitors');
      u.el('p', '', visitor, 'Thanks for stopping by my homepage! I’m a high school student who enjoys math, reading, and meeting new people online. Sign my guestbook!');
      u.el('div', 'smiley', visitor, '☺');
      const guest = u.el('section', 'home-cell guestbook', footer);
      u.el('h3', '', guest, 'Guestbook');
      u.el('p', '', guest, '▤　Sign Guestbook');
      u.el('p', '', guest, '　　View Guestbook');
      u.el('p', '', guest, '　　Leave a Note');
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        foot.querySelector('.ref-foot-text').remove();
        footer.appendChild(foot);
      }
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.aside.appendChild(dock);
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
    name: 'design-solve-puzzle-algebra-10',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: ['#16429a'], LOW_ACCENTS: ['#16429a'], parts,
    },
  });
})();
