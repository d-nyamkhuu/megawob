(function () {
  'use strict';
  const palette = { bg: '#e6ebef', panel: '#ffffff', fg: '#10213d', muted: '#61758b', line: '#9aafc2' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The forum has its own dedicated note area in the Thread pane.
      _c.display = _c.ctx.display === 'panel' && _c.W < 1150 ? 'header' : _c.ctx.display;
      document.body.className = 'forum-ledger instruction-' + _c.display;
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
      const top = u.el('header', 'top', app);
      u.el('strong', 'brand', top, 'Brain Practice Forum');
      const account = u.el('div', 'account', top, 'Welcome, Guest　 |　 Help　 |　 Sign Out');
      Object.assign(_c, { app, account });
    },
    'frame.nav': () => (_c) => {
      const u = _c.util;
      const nav = u.el('nav', 'menu', _c.app);
      ['Home', 'Practice', 'Discussions', 'Members'].forEach((x, i) => u.el('span', i === 1 ? 'active' : '', nav, x));
      const search = u.el('div', 'search', nav);
      u.el('span', 'search-text', search, 'Search topics…');
      u.el('button', 'search-go', search, 'Go');
      const center = u.el('div', 'center', _c.app);
      const left = u.el('section', 'work-panel', center);
      u.el('div', 'section-bar', left, 'Number Cards');
      Object.assign(_c, { center, left, header: left });
    },
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('brief');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.account;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const quick = u.el('div', 'quick-wrap', _c.left);
      const quickBtn = u.el('button', 'quick', quick, 'ϟ  Quick action (disabled)');
      quickBtn.disabled = true;
      u.el('small', 'quick-note', quick, 'This feature is not available now.');
      const aside = u.el('aside', 'aside', _c.center);
      const thread = u.el('section', 'thread-panel', aside);
      u.el('div', 'section-bar', thread, 'Thread');
      Object.assign(_c, { body: _c.center, aside, thread });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.thread;
      base(_c);
      _c.body = body;
      const title = _c.thread.querySelector('.ref-panel-title');
      if (title) title.textContent = 'Practice note';
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.left);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const u = _c.util;
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        const title = u.el('b', 'toast-title', null, 'New practice note');
        note.prepend(title);
        _c.thread.appendChild(note);
      }
      const posts = [
        ['Admin', 'Apr 12, 2003 10:14 AM', "Today's practice: Welcome to the number cards discussion thread."],
        ['Learner1', 'Apr 12, 2003 10:16 AM', 'Remember to look for negative signs.'],
        ['Learner2', 'Apr 12, 2003 10:17 AM', 'Zero can be larger than negative numbers!'],
        ['Admin', 'Apr 12, 2003 10:20 AM', 'Click a card.'],
      ];
      posts.forEach((p, i) => {
        const row = u.el('div', 'post post-' + i, _c.thread);
        const head = u.el('div', 'post-head', row);
        u.el('b', 'author', head, '▤  ' + p[0]);
        u.el('time', '', head, p[1]);
        u.el('p', '', row, p[2]);
      });
      const preview = u.el('section', 'preview-panel', _c.aside);
      u.el('div', 'section-bar', preview, 'Preview');
      const pane = u.el('div', 'preview-empty', preview);
      u.el('div', 'mono', pane, 'No card selected');
      u.el('p', '', pane, 'Click a card to see it here.');
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const footer = _c.util.el('footer', 'bottom', _c.left);
      footer.appendChild(document.body.querySelector('.ref-foot'));
      const clear = _c.util.el('button', 'clear-deco', footer, 'Clear');
      clear.type = 'button';
      clear.addEventListener('click', () => {
        const reset = document.querySelector('.reference-reset');
        if (reset) reset.click();
      });
      _c.footer = footer;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.footer.prepend(dock);
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
    name: 'design-read-figure-greatest-12',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-read-figure-greatest-12': palette },
      LOW_THEME: palette,
      ACCENTS: ['#2462ad'],
      LOW_ACCENTS: ['#2462ad'],
      parts,
    },
  });
})();
