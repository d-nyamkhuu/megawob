(function () {
  'use strict';
  const palette = { bg: '#fbfaf6', panel: '#fdfcf9', fg: '#1c1c1c', muted: '#6b6860', line: '#d6d3cc' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.documentElement.style.setProperty('--font', "Georgia,'Times New Roman',serif");
      document.body.classList.add('mag', 'instruction-' + _c.display);
      const shell = u.el('div', 'site-shell', document.body);
      const toolbar = u.el('header', 'mag-header', shell);
      const brand = u.el('div', 'mag-brand', toolbar);
      u.el('span', 'mag-logo', brand, 'Chatter');
      u.el('span', 'mag-tag', brand, 'People. Posts. Conversations.');
      const sf = u.el('div', 'mag-search', toolbar);
      const si = u.el('input', 'mag-search-in', sf);
      si.type = 'text';
      si.placeholder = 'Search posts, people...';
      const sb = u.el('button', 'mag-search-btn', sf, 'Search');
      sb.type = 'button';
      sb.addEventListener('click', () => env.log('decoy', { what: 'Search' }));
      const nav = u.el('nav', 'mag-nav', toolbar);
      ['Home', 'Profile', 'Settings', 'Sign out'].forEach((l, i) => {
        if (i) u.el('span', 'mag-sep', nav, '|');
        const a = u.el('a', '', nav, l);
        a.href = '#';
        a.addEventListener('click', (e) => {
          e.preventDefault();
          env.log('decoy', { what: l });
        });
      });
      const note = u.el('section', 'task-note');
      note.hidden = _c.display === 'hidden';
      note.style.setProperty('--instruction-size', _c.ctx.instruction.length < 90 ? '2.5rem' : '2.2rem');
      const th = u.el('div', 'mag-title', note);
      u.el('h1', '', th, 'Your Task');
      u.el('span', 'mag-date', th, 'April 14, 2008');
      Object.assign(_c, { shell, toolbar, header: note });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'mag-body', _c.shell);
      const left = u.el('aside', 'mag-left', body);
      const me = u.el('div', 'mag-box', left);
      u.el('div', 'mag-hello', me, 'Good afternoon,');
      u.el('div', 'mag-me', me, 'Alex');
      u.el('hr', '', me);
      u.el('div', 'mag-handle', me, '@alexr');
      for (const [k, v] of [['Followers', '128'], ['Following', '96'], ['Messages', '4']]) {
        const r = u.el('div', 'mag-stat', me, k + ' ');
        u.el('b', '', r, v);
      }
      const tr = u.el('div', 'mag-box', left);
      u.el('h3', '', tr, 'Trending Topics');
      for (const t of ['citylife', 'monday', 'goodnews', 'travel', 'books']) u.el('div', 'mag-link', tr, '# ' + t);
      u.el('div', 'mag-more', tr, 'More topics →');
      const center = u.el('main', 'mag-center', body);
      center.appendChild(_c.header);
      const hid = u.el('div', '', center);
      hid.hidden = true;
      for (const c of ['action', 'target-author', 'post-starts-with', 'status']) u.el('span', 'detail-' + c, hid, '');
      const right = u.el('aside', 'mag-right', body);
      const wf = u.el('div', 'mag-box', right);
      u.el('h3', '', wf, 'Who to follow');
      for (const [n, h] of [['danielc', '@danielc'], ['priya_s', '@priya_s'], ['mikep', '@mikep']]) {
        const r = u.el('div', 'mag-who', wf);
        u.el('span', 'mag-face', r);
        const t = u.el('div', '', r);
        u.el('b', '', t, n);
        u.el('div', 'mag-wh', t, h);
        u.el('div', 'mag-follow', t, 'Follow');
      }
      u.el('div', 'mag-more', wf, 'Find more people →');
      const pp = u.el('div', 'mag-box', right);
      u.el('h3', '', pp, 'Popular Posts');
      for (const t of ['A perfect spring weekend', 'Reading recommendations?', 'Best coffee in town', 'Small joys', 'Weekend hike photos']) u.el('div', 'mag-link', pp, t);
      u.el('div', 'mag-more', pp, 'More posts →');
      Object.assign(_c, { body, center });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.header.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('mag-footer');
      _c.shell.appendChild(foot);
      const copy = foot.querySelector('.ref-foot-text');
      copy.classList.add('mag-copy');
      copy.textContent = '© 2008 Chatter';
      foot.querySelector('.ref-tools').classList.add('mag-submit');
      const fl = _c.util.el('nav', 'mag-flinks', foot);
      ['Help', 'Terms', 'Privacy'].forEach((l, i) => {
        if (i) _c.util.el('span', 'mag-sep', fl, '|');
        _c.util.el('span', '', fl, l);
      });
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.querySelector('.mag-submit').appendChild(dock);
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
    name: 'design-use-social-feed-one-07',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: { THEMES: { site: palette }, LOW_THEME: palette, ACCENTS: ['#b3171c'], LOW_ACCENTS: ['#b3171c'], parts },
  });
})();
