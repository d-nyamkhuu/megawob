(function () {
  'use strict';
  const palette = { bg: '#ffffff', panel: '#ffffff', fg: '#000000', muted: '#444444', line: '#bdbdbd' };
  const LINKS = [
    ['Quick Links', ['My Profile', 'Messages', 'Groups', 'Events'], null],
    ['Who to Follow', ['@maria_t', '@chenalex', '@priya_s'], 'Browse people'],
  ];
  function link(u, parent, text, cls) {
    const a = u.el('a', cls || '', parent, text);
    a.href = '#';
    a.addEventListener('click', (e) => {
      e.preventDefault();
      env.log('decoy', { what: text });
    });
    return a;
  }
  function styleNote(_c, selector, kind) {
    const note = _c.noteHost.querySelector(selector);
    if (!note) return;
    note.classList.add('task-note', 'task-note-' + kind);
    if (_c.ctx.instruction.length > 90) note.classList.add('long');
  }
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('perimeter', 'instruction-' + _c.display);
      const shell = u.el('div', 'site-shell', document.body);
      const chrome = u.el('header', 'design-header', shell);
      link(u, chrome, 'CampusConnect', 'design-brand');
      const nav = u.el('nav', 'design-nav', chrome);
      ['Home', 'Find People', 'Settings', 'Help'].forEach((t, i) => {
        if (i) u.el('span', 'sep', nav, '|');
        link(u, nav, t);
      });
      const noteHost = u.el('div', 'note-host');
      Object.assign(_c, { shell, chrome, noteHost, header: noteHost });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      styleNote(_c, '.ref-instruction', 'header');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.chrome;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'design-body', _c.shell);
      const left = u.el('aside', 'ref-left', body);
      for (const [h, items, more] of LINKS) {
        const box = u.el('section', 'ref-box', left);
        u.el('h3', '', box, h);
        const ul = u.el('div', 'ref-links', box);
        for (const t of items) link(u, ul, t);
        if (more) link(u, ul, more, 'more-link');
      }
      const center = u.el('div', 'ref-center', body);
      center.appendChild(_c.noteHost);
      const right = u.el('aside', 'ref-right', body);
      const sb = u.el('section', 'ref-box', right);
      u.el('h3', '', sb, 'Search');
      const sw = u.el('div', 'ref-search', sb);
      const inp = u.el('input', '', sw);
      inp.type = 'text';
      inp.setAttribute('aria-label', 'Search');
      const sbtn = u.el('button', 'ref-btn', sw, 'Search');
      sbtn.type = 'button';
      const tr = u.el('section', 'ref-box', right);
      u.el('h3', '', tr, 'Trending on Campus');
      const tl = u.el('div', 'ref-links', tr);
      for (const t of ['#spring', '#finals', '#clubfair', '#hiking']) link(u, tl, t);
      const ev = u.el('section', 'ref-box', right);
      u.el('h3', '', ev, 'Upcoming Events');
      const events = u.el('div', 'ref-events', ev);
      for (const [date, title] of [
        ['Apr 28', 'Study Group'], ['Apr 29', 'Board Game Night'], ['May 1', 'Spring Concert'],
      ]) {
        const row = u.el('div', '', events);
        u.el('span', '', row, date);
        link(u, row, title);
      }
      link(u, events, 'View all events', 'more-link');
      Object.assign(_c, { body, center });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.noteHost;
      base(_c);
      _c.body = body;
      styleNote(_c, '.ref-panel', 'panel');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        _c.noteHost.appendChild(note);
        styleNote(_c, '.ref-note', 'toast');
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('design-footer');
      _c.shell.appendChild(foot);
      const back = _c.util.el('button', 'ref-btn back', null, '← Back to Tasks');
      back.type = 'button';
      back.addEventListener('click', () => env.log('decoy', { what: 'back' }));
      foot.insertBefore(back, foot.firstChild);
      Object.assign(_c, { foot });
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const texts = {
        cookie: ['We use cookies', 'We use optional cookies to improve your experience.', 'Reject optional'],
        toast: ['Notification', 'Your workspace is up to date.', 'Dismiss'],
        chat: ['Help', 'Need help with this workspace?', 'Close'],
        promo: ['News and updates', 'Discover the latest workspace updates.', 'Close'],
        banner: ['Announcement', 'You can still work now. Save your changes regularly.', 'Collapse announcement'],
      };
      const [title, copy, label] = texts[ctx.kind];
      const el = u.el('section', 'reference-overlay ' + ctx.kind, document.body);
      el.setAttribute('role', 'dialog');
      el.setAttribute('aria-label', title);
      u.el('h2', '', el, title);
      u.el('div', 'overlay-copy', el, copy);
      const actions = u.el('div', 'overlay-actions', el);
      if (ctx.kind === 'cookie') {
        const accept = u.el('button', '', actions, 'Accept all');
        accept.addEventListener('click', () => ctx.dismiss());
      }
      const dismiss = u.el('button', 'primary', actions, label);
      dismiss.type = 'button';
      dismiss.addEventListener('click', () => ctx.dismiss());
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-use-social-feed-menu-08',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-use-social-feed-menu-08': palette },
      LOW_THEME: palette,
      ACCENTS: ['#0000ee'],
      LOW_ACCENTS: ['#0000ee'],
      parts,
    },
  });
})();
