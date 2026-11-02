(function () {
  'use strict';
  const palette = { bg: '#eef2f6', panel: '#ffffff', fg: '#15191e', muted: '#626c78', line: '#aeb8c3' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util, body = document.body;
      const title = u.el('header', 'vista-title', body);
      u.el('i', 'mail-icon', title, '✉');
      u.el('span', '', title, 'Windows Mail');
      const win = u.el('div', 'win-controls', title);
      ['−', '□', '×'].forEach((x, i) => u.el('span', i === 2 ? 'close' : '', win, x));
      const menu = u.el('nav', 'vista-menu', body);
      ['File', 'Edit', 'View', 'Tools', 'Message', 'Help'].forEach((x) => u.el('span', '', menu, x));
      const bar = u.el('div', 'vista-toolbar', body);
      ['✉  New Mail⌄', '↶  Reply', '▣  Reply All', '➤  Forward', '✕  Delete', '▣  Junk⌄', '▤⌄'].forEach((x) =>
        u.el('span', '', bar, x),
      );
      u.el('div', 'vista-search', bar, 'Search　⌕');
      Object.assign(_c, { header: title });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = document.body;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const workspace = u.el('div', 'vista-workspace', document.body);
      const app = u.el('div', 'mail-app', workspace);
      const folders = u.el('aside', 'folders', app);
      [
        '▾  Local Folders', '　📁  Inbox (3)', '　📁  Drafts', '　📁  Sent Items',
        '　📁  Junk E-mail', '　▧  Deleted Items', '▾  Contoso Mail', '　📁  Inbox',
        '　📁  Drafts', '　📁  Sent Items', '　📁  Junk E-mail', '　▧  Deleted Items',
      ].forEach((x, i) => u.el('div', i === 1 ? 'selected' : 'folder', folders, x));
      const inbox = u.el('section', 'inbox', app);
      const list = u.el('div', 'messages', inbox);
      [
        '',
        'From　　　　　　　　　　　　 Subject　　　　　　　　　　　　　　　 Received⌄',
        '▤　 Contoso Team　　　　　 Welcome to Contoso　　　　　　　　　4/12/2007 10:24 AM',
        '▤　 Account Security　　　 Your account settings　　　　　　　　　4/12/2007 9:18 AM',
        '▤　 PhotoShare　　　　　　See what’s new this week　　　　　　　　4/11/2007 4:03 PM',
      ].forEach((x, i) => u.el('div', 'message m' + i, list, x));
      const reader = u.el('aside', 'reader', app);
      u.el('h2', '', reader, 'Welcome to Contoso');
      u.el('div', 'reader-meta', reader, 'Contoso Team <team@contoso.com><br>4/12/2007 10:24 AM');
      u.el('hr', '', reader);
      u.el('h3', '', reader, 'Welcome to Contoso Mail!');
      u.el('p', '', reader, 'You can use this account to access your email, calendar, and more across Microsoft services.');
      _c.body = workspace;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'vista-stage', _c.body);
      if (_c.display !== 'hidden') _c.stage.classList.add('has-note');
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
    },
    'frame.footer': (base) => (_c) => {
      const dock = _c.util.el('footer', 'vista-dock', document.body);
      ['✉  Mail', '▦  Calendar', '▣  Contacts', '▧  Feeds', '▤  Newsgroups'].forEach((x, i) =>
        _c.util.el('span', i === 0 ? 'dock-selected' : '', dock, x),
      );
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (_c.placement === 'link') foot.classList.add('vista-foot-link');
      dock.appendChild(foot);
      _c.dock = dock;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.dock.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        el = u.el('section', 'vista-overlay vista-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'This website uses cookies to improve your experience.',
        toast: 'Your settings have been saved.',
        chat: 'Hello! How can we help you today?',
        promo: 'Discover what’s new in Windows Mail.',
        banner: 'Important service announcement.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const b = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      b.type = 'button';
      b.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss: b, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: 'design-act-in-time-toast-01',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css', 'design.css', 'refinements.css'],
    design: {
      THEMES: { 'design-act-in-time-toast-01': palette },
      LOW_THEME: palette,
      ACCENTS: ['#168bd0'],
      LOW_ACCENTS: ['#168bd0'],
      parts,
    },
  });
})();
