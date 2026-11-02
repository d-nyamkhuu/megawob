(function () {
  'use strict';
  const palette = { bg: '#f0f2f4', panel: '#f5f6f8', fg: '#0d2347', muted: '#101824', line: '#65717e' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('ref', 'ext');
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const brand = u.el('div', 'brand', head);
      u.el('div', 'brand-name', brand, 'GlobalLink Extranet');
      const sub = u.el('div', 'brand-sub', brand);
      ['Partners', 'Projects', 'Resources'].forEach((s, i) => {
        if (i) u.el('i', '', sub, '|');
        u.el('span', '', sub, s);
      });
      const user = u.el('div', 'userbar', head);
      const l1 = u.el('div', '', user);
      ['Welcome, Alex Carter', '|', 'Help', '|', 'Log Out'].forEach((s) => u.el('span', '', l1, s));
      u.el('div', 'date', user, 'Mon, Mar 15, 1999');
      const tabs = u.el('nav', 'utab', head);
      ['Home', 'Accounts', 'Orders', 'Support', 'Documents', 'Reports'].forEach((s) => u.el('span', '', tabs, s));
      const work = u.el('div', 'work', shell);
      const rail = u.el('nav', 'rail', work);
      for (let i = 1; i <= 20; i++) u.el('div', i === 6 ? 'active' : '', rail, (i < 10 ? '0' : '') + i);
      const center = u.el('section', 'center', work);
      u.el('div', 'crumb', center, 'Partner Training  >  Interaction Task');
      Object.assign(_c, { shell, head, center, header: head });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.center;
      base(_c);
      _c.header = header;
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const foot = u.el('footer', 'footer');
      const notes = u.el('section', 'notes', foot);
      if (_c.display !== 'panel') u.el('h2', '', notes, 'Notes');
      const list = u.el('div', 'note-list');
      [
        'The square moves to different positions within the area.',
        'Keep the mouse over the square. The time counts only while the pointer is over it.',
        'Your progress is shown in the area above.',
      ].forEach((t) => u.el('p', 'note-item', list, t));
      const acts = u.el('div', 'acts', foot);
      Object.assign(_c, { body: _c.center, foot, notes, list, acts });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.notes;
      base(_c);
      _c.body = body;
      const title = _c.notes.querySelector('.ref-panel-title');
      if (title) title.textContent = 'Episode settings';
      _c.notes.appendChild(_c.list);
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.center.insertBefore(note, _c.stage);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      _c.acts.appendChild(foot);
      _c.center.appendChild(_c.foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.acts.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const el = ctx.util.el('section', 'perturb ' + ctx.kind, document.body);
      ctx.util.el(
        'strong',
        '',
        el,
        {
          cookie: 'Cookie preferences',
          toast: 'Notification',
          chat: 'Support',
          promo: 'A special offer',
          banner: 'Service notice',
        }[ctx.kind],
      );
      ctx.util.el(
        'p',
        '',
        el,
        {
          cookie: 'Choose your preferences to continue.',
          toast: 'Your workspace is ready.',
          chat: 'How can we help?',
          promo: 'Explore the latest tools.',
          banner: 'A new update is available.',
        }[ctx.kind],
      );
      const dismiss = ctx.util.el('button', 'dismiss', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-click-control-hover-06',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-click-control-hover-06': palette },
      LOW_THEME: palette,
      ACCENTS: ['#b54c1f'],
      LOW_ACCENTS: ['#b54c1f'],
      parts,
    },
  });
})();
