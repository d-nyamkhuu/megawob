(function () {
  'use strict';
  const C = {
    name: 'Alex’s Homepage',
    tagline: ['Small Town', 'Good Friends', 'A Brighter Tomorrow'],
    nav: ['Home', 'About Me', 'My Hobbies', 'Photo Album', 'Links'],
    badge: 'Good People Make a Brighter Internet',
    banner: 'Welcome to My Corner of the Web',
    caption: 'A peaceful day by the canal',
    interestsTitle: 'Some of My Interests',
    interests: ['Photography', 'Reading', 'Maps', 'Nature Walks', 'Biking', 'Exploring New Places'],
    tips: ['Click and hold the mouse button.', 'Drag across the text to select it.', 'Release the mouse button when you’re done.'],
  };
  const palette = { bg: '#e9dcc5', panel: 'transparent', fg: '#141414', muted: '#444', line: '#222' };
  function ic(u, parent, name, cls) {
    const s = u.el('img', cls || 'ico', parent);
    s.src = 'sites/design-select-text-paragraph-02/assets/' + name + '.webp';
    s.alt = '';
    s.draggable = false;
    return s;
  }
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original note falls back to header at either compact dimension.
      if ((_c.W < 1260 || _c.H < 700) && ['panel', 'toast'].includes(_c.ctx.display)) _c.display = 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.className = 'design homepage';
      document.documentElement.style.setProperty('--font', '"Times New Roman",Times,Georgia,serif');
      const shell = u.el('div', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const nav = u.el('nav', 'hp-nav', head);
      ic(u, nav, 'house', 'ico nav-ico');
      const links = u.el('div', 'hp-links', nav);
      for (const t of C.nav) {
        const a = u.el('a', '', links, t);
        a.href = '#';
        a.onclick = (e) => e.preventDefault();
      }
      const mast = u.el('div', 'hp-mast', head);
      ic(u, mast, 'boat', 'ico mast-l');
      const mt = u.el('div', 'hp-mast-text', mast);
      ic(u, mast, 'boat', 'ico mast-r');
      u.el('div', 'hp-title', mt, C.name);
      const tg = u.el('div', 'hp-tag', mt);
      C.tagline.forEach((t, i) => {
        if (i) u.el('span', 'dot', tg, '·');
        u.el('span', '', tg, t);
      });
      const bd = u.el('div', 'hp-badge', head);
      ic(u, bd, 'globe', 'ico badge-ico');
      u.el('div', '', bd, C.badge);
      const dock = u.el('footer', 'footer', shell);
      const note = u.el('section', 'task-note', dock);
      ic(u, note, 'pad', 'ico note-ico');
      note.hidden = _c.display === 'hidden';
      note.classList.toggle('is-panel', _c.display === 'panel');
      note.classList.toggle('is-toast', _c.display === 'toast');
      const tips = u.el('div', 'hp-tips', dock);
      u.el('div', 'tips-h', tips, 'Tips:');
      const ul = u.el('ul', '', tips);
      for (const t of C.tips) u.el('li', '', ul, t);
      const controls = u.el('div', 'hp-sub', dock);
      if (_c.ctx.finish) dock.classList.add('finish-mode');
      Object.assign(_c, { shell, head, dock, note, tips, controls, header: note });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.controls;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'content', _c.shell);
      _c.shell.insertBefore(body, _c.dock);
      const ban = u.el('div', 'hp-banner', body);
      ic(u, ban, 'flower');
      u.el('h1', '', ban, C.banner);
      ic(u, ban, 'flower');
      const left = u.el('div', 'hp-photo', body);
      const ph = u.el('img', 'photo', left);
      ph.src = 'sites/design-select-text-paragraph-02/assets/canal.webp';
      ph.alt = 'A stone bridge over a quiet canal';
      ph.draggable = false;
      u.el('div', 'hp-cap', left, C.caption);
      const aside = u.el('aside', 'hp-int', body);
      u.el('h3', '', aside, C.interestsTitle);
      const icons = ['camera', 'books', 'map', 'tree', 'bike', 'boat'];
      C.interests.forEach((t, i) => {
        const r = u.el('div', 'hp-row', aside);
        ic(u, r, icons[i]);
        u.el('span', '', r, t);
      });
      Object.assign(_c, { body });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.note;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.body);
      _c.stage.dataset.role = 'stage';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.note.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.controls.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.head.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        kind = ctx.kind;
      const el = u.el('section', 'obstruction obstruction-' + kind, document.body);
      el.dataset.role = 'overlay';
      const box = u.el('div', 'obstruction-box', el);
      const title = {
        cookie: 'Your privacy',
        toast: 'Changes saved',
        chat: 'Support',
        promo: 'Workspace update',
        banner: 'Service notice',
      }[kind];
      const text = {
        cookie: 'This site stores optional cookies.',
        toast: 'Your changes have been saved.',
        chat: 'Need a hand?',
        promo: 'Explore the latest features.',
        banner: 'You are viewing a shared page.',
      }[kind];
      const label = kind === 'cookie' ? 'Reject optional' : 'Close';
      u.el('h3', '', box, title);
      u.el('p', '', box, text);
      const dismiss = u.el('button', 'dismiss', box, label);
      dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('close');
      if (kind === 'cookie') {
        const accept = u.el('button', 'dismiss', box, 'Accept optional');
        accept.onclick = () => ctx.dismiss('accept');
      }
      return { el, dismiss, ttlSteps: kind === 'toast' ? 5 : 0 };
    },
  };
  env.site({
    name: 'design-select-text-paragraph-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css', 'home.css'],
    design: {
      THEMES: { 'design-select-text-paragraph-02': palette },
      LOW_THEME: palette,
      ACCENTS: ['#000080'],
      LOW_ACCENTS: ['#000080'],
      parts,
    },
  });
})();
