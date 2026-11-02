(function () {
  'use strict';
  const palette = { bg: '#14608c', panel: '#ffffff', fg: '#132f69', muted: '#536e92', line: '#bdd1e1' };

  function styleControls(parent) {
    parent.querySelectorAll('.ref-submit').forEach((el) => el.classList.add('ds-submit'));
    parent.querySelectorAll('.ref-endlink').forEach((el) => el.classList.add('ds-end-link'));
    parent.querySelectorAll('.ref-xtra').forEach((el) => el.classList.add('ds-xtra'));
  }

  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // This notebook has a place for each note mode at every viewport.
      _c.display = _c.ctx.display || 'header';
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = _c.util;
      const page = u.el('div', 'ds-page', document.body);
      const tabs = u.el('nav', 'ds-tabs', page);
      ['Home', 'Search', 'People', 'News', 'Shopping', 'Games', 'Reference', 'Help'].forEach((t, i) =>
        u.el('div', 'ds-tab' + (i === 5 ? ' active' : ''), tabs, t),
      );
      const rings = u.el('div', 'ds-rings', page);
      for (let i = 0; i < 11; i++) u.el('i', '', rings);
      const paper = u.el('div', 'ds-paper', page);
      const head = u.el('header', 'ds-directory', paper);
      const logo = u.el('div', 'ds-logo', head);
      u.el('span', 'ds-globe', logo, '');
      const word = u.el('div', 'ds-wordmark', logo);
      u.el('strong', '', word, 'WebWorld');
      u.el('small', '', word, 'Your Guide to the Internet');
      const cols = u.el('div', 'ds-links', head);
      [
        ['Web Directory', 'Arts & Humanities', 'Business & Economy', 'Computers & Internet', 'Education', 'Entertainment'],
        ['People', 'Find People', 'Classmates', 'Chat', 'Groups', 'Message Boards'],
        ['Reference', 'Maps & Travel', 'News', 'Science', 'Sports', 'Weather'],
        ['Shopping', 'Books', 'Music', 'Electronics', 'Home & Garden', 'Toys & Games'],
      ].forEach((group) => {
        const col = u.el('div', 'ds-linkcol', cols);
        u.el('b', '', col, group[0]);
        group.slice(1).forEach((t) => u.el('a', '', col, t));
      });
      const search = u.el('section', 'ds-search', head);
      u.el('b', '', search, 'Search the Web');
      const row = u.el('div', 'ds-searchrow', search);
      u.el('span', 'ds-searchinput', row, '');
      const sb = u.el('button', 'ds-searchbutton', row, 'Search');
      sb.type = 'button';
      const links = u.el('div', 'ds-searchlinks', search);
      u.el('a', '', links, 'Advanced Search');
      u.el('a', '', links, 'Search Tips');
      u.el('div', 'ds-date', head, 'Mon, Apr 27, 1998');
      const title = u.el('div', 'ds-title', paper, 'Shape Catcher');
      const content = u.el('div', 'ds-content', paper);
      Object.assign(_c, { paper, title, content, header: content });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        const box = _c.util.el('aside', 'ds-note', _c.header);
        note.classList.add('ds-instruction');
        box.appendChild(note);
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.title;
      base(_c);
      _c.header = header;
      styleControls(_c.headerTools);
      if (_c.submit) _c.submit.classList.add('ds-title-end');
    },
    'frame.body': () => (_c) => { _c.body = _c.content; },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-panel-note');
        panel.querySelector('.ref-panel-text').classList.add('ds-instruction');
      }
    },
    'frame.stage': () => (_c) => {
      const main = _c.util.el('div', 'ds-main', _c.content);
      _c.stage = _c.util.el('main', 'ds-stage', main);
      _c.main = main;
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('ds-toast');
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        _c.content.insertBefore(note, _c.main);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.paper.appendChild(foot);
      styleControls(foot);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) {
        _c.foot.appendChild(dock);
        styleControls(dock);
      }
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };

  env.site({
    name: 'design-act-in-time-moving-07',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-act-in-time-moving-07': palette },
      LOW_THEME: palette,
      ACCENTS: ['#356bb3'],
      LOW_ACCENTS: ['#356bb3'],
      parts,
    },
  });
})();
