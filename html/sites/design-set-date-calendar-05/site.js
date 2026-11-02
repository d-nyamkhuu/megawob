(function () {
  'use strict';
  const PAW = '<svg viewBox="0 0 64 64" width="100%" height="100%"><g fill="currentColor"><path d="M18 43c1-5 7-15 14-15s13 10 14 15c2 10-8 7-14 6s-16 5-14-6Z"/><ellipse cx="12" cy="29" rx="5" ry="7" transform="rotate(-20 12 29)"/><ellipse cx="25" cy="17" rx="5.5" ry="8" transform="rotate(-12 25 17)"/><ellipse cx="40" cy="17" rx="5.5" ry="8" transform="rotate(12 40 17)"/><ellipse cx="53" cy="29" rx="5" ry="7" transform="rotate(20 53 29)"/></g></svg>';
  const HOUSE = '<svg viewBox="0 0 64 64" width="100%" height="100%"><defs><linearGradient id="homeblue" x2="0" y2="1"><stop stop-color="#75d7f2"/><stop offset="1" stop-color="#20b8ed"/></linearGradient></defs><path d="M43 17V9h7v15" fill="none" stroke="#70c8bd" stroke-width="2.6" stroke-linejoin="round"/><path d="M4 30 32 7l28 23M9 28v25m46-25v25" fill="none" stroke="#8ac642" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"/><g fill="url(#homeblue)"><path d="M17 48c1-4 6-13 14-13s12 9 13 13c1 8-8 4-13 4s-15 4-14-4Z"/><ellipse cx="16" cy="34" rx="3.5" ry="5.5" transform="rotate(-18 16 34)"/><ellipse cx="25" cy="28" rx="3.8" ry="6"/><ellipse cx="35" cy="29" rx="3.8" ry="6"/><ellipse cx="44" cy="36" rx="3.5" ry="5.5" transform="rotate(20 44 36)"/></g></svg>';
  const palette = { bg: '#eaf4fd', panel: '#ffffff', fg: '#102650', muted: '#6b7a90', line: '#c9d6e4' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original has a dedicated instruction rail at every viewport.
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
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      const top = u.el('header', 'ds-top', content);
      const logo = u.el('div', 'ds-logo', top);
      u.el('span', 'ds-logo-ic', logo).innerHTML = HOUSE;
      const lt = u.el('span', 'ds-logo-t', logo);
      u.el('b', '', lt, 'Happy Homes');
      u.el('i', '', lt, 'Adoption Portal');
      const nav = u.el('nav', 'ds-menu', top);
      ['Find a pet', 'Your application', 'Resources', 'Contact'].forEach((t, i) =>
        u.el('span', i === 1 ? 'on' : '', nav, t));
      u.el('span', 'ds-top-paw', top).innerHTML = PAW;
      const sheet = u.el('div', 'ds-sheet', content);
      const foot = u.el('div', 'ds-footer', sheet);
      const rail = u.el('aside', 'ds-rail', body);
      const hello = u.el('div', 'ds-hello', rail, 'Hello, Alex ');
      hello.insertAdjacentHTML('beforeend', '<svg width="14" height="10" viewBox="0 0 14 10"><path d="m2 2 5 5 5-5" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>');
      const brief = u.el('div', 'ds-brief ds-display-' + _c.display, rail);
      brief.hidden = _c.display === 'hidden';
      Object.assign(_c, { sheet, foot, rail, header: brief });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.foot;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.sheet; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
      const u = _c.util;
      const nt = u.el('div', 'ds-notes', _c.rail);
      u.el('h3', '', nt, 'Action notes:');
      // Generic guidance only: the goal belongs exclusively to the template note.
      ['Click the calendar icon next to the date field.', 'Select the requested date in the calendar.', 'Leave all other fields as they are.'].forEach((t, i) => {
        const r = u.el('div', 'ds-note', nt);
        u.el('span', 'ds-num', r, String(i + 1));
        u.el('span', '', r, t);
      });
      u.el('span', 'ds-rail-paw', _c.rail).innerHTML = PAW;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.sheet);
      _c.sheet.insertBefore(_c.stage, _c.foot);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.header.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.foot.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.rail.appendChild(dock);
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
    name: 'design-set-date-calendar-05',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-set-date-calendar-05': palette },
      LOW_THEME: palette,
      ACCENTS: ['#2f7fd0'],
      LOW_ACCENTS: ['#2f7fd0'],
      parts,
    },
  });
})();
