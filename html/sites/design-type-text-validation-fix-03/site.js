(function () {
  'use strict';
  const palette = { bg: '#ffffff', panel: '#ffffff', fg: '#1d2a3a', muted: '#788496', line: '#dce2e9' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const u = _c.util;
      const top = u.el('header', 'bp-top', document.body);
      const logo = u.el('div', 'bp-logo', top);
      const mark = u.el('span', 'bp-mark', logo);
      mark.setAttribute('aria-hidden', 'true');
      u.el('i', 'bp-person bp-person-left', mark);
      u.el('i', 'bp-person bp-person-center', mark);
      u.el('i', 'bp-person bp-person-right', mark);
      const brand = u.el('span', 'bp-brand', logo);
      u.el('span', '', brand, 'Bright');
      u.el('span', 'bp-brand-accent', brand, 'Path');
      const nav = u.el('nav', 'bp-nav', top);
      ['Home', 'People', 'Teams', 'Reports', 'Settings'].forEach((x, i) => {
        u.el('span', i === 1 ? 'active' : '', nav, x);
      });
      u.el('div', 'bp-search', top, '⌕　Search people...');
      const user = u.el('div', 'bp-user', top);
      u.el('span', 'bp-avatar', user, '●');
      u.el('span', '', user, 'Alex Carter　⌄');
      const title = u.el('section', 'bp-title', document.body);
      const titletext = u.el('div', 'bp-titletext', title);
      u.el('div', 'bp-back', titletext, '←　All People');
      u.el('h1', '', titletext, 'Edit Employee');
      const stats = u.el('div', 'bp-stats', title);
      [['24', 'Employees'], ['3', 'Teams'], ['1', 'On Leave']].forEach((a) => {
        const c = u.el('div', '', stats);
        u.el('strong', '', c, a[0]);
        u.el('span', '', c, a[1]);
      });
      Object.assign(_c, { top, title, header: titletext });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.top;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('main', 'bp-main', document.body);
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'bp-stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) note.classList.add('bp-toast');
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.title.appendChild(foot);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const el = u.el('section', 'bp-overlay bp-overlay-' + ctx.kind, document.body);
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
    name: 'design-type-text-validation-fix-03',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-type-text-validation-fix-03': palette },
      LOW_THEME: palette,
      ACCENTS: ['#45b99d'],
      LOW_ACCENTS: ['#45b99d'],
      parts,
    },
  });
})();
