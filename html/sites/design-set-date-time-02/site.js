(function () {
  'use strict';
  const C = {
    site: 'design-set-date-time-02',
    tab: 'Restaurant Reservation',
    brand: 'Lakeside Grill',
    sub: 'Make a Reservation',
    rail: 'Confirm Reservation',
    railText: 'Please set the correct time.',
    menus: ['File', 'Edit', 'Window', 'Help'],
    date: 'Tue Apr 27',
    clock: '3:14 PM',
  };
  const ICON =
    '<svg viewBox="0 0 60 60" width="100%" height="100%"><defs><linearGradient id="cutlery"><stop stop-color="#777"/><stop offset=".45" stop-color="#171717"/><stop offset="1" stop-color="#444"/></linearGradient></defs><g fill="#999" transform="translate(1.5 1.5)"><path d="M13 3h2v14h2V3h2v14h2V3h2v14h2V3h2v20l-5 5v27q-3 3-6 0V28l-5-5zM42 3q-10 7-10 25l5 2v25q3 3 6 0V3z"/></g><g fill="url(#cutlery)" stroke="#555" stroke-width=".5"><path d="M13 3h2v14h2V3h2v14h2V3h2v14h2V3h2v20l-5 5v27q-3 3-6 0V28l-5-5zM42 3q-10 7-10 25l5 2v25q3 3 6 0V3z"/></g></svg>';
  const WORKSPACE =
    '<svg viewBox="0 0 28 32" stroke="#33434c" stroke-width="1.2"><path d="M3 10L15 2l10 5-3 16-12 5-7-5z" fill="#70c4f6"/><path d="M5 11l10-6 7 3-2 10-10 5-5-3z" fill="#d3eeff"/><path d="M10 23v6h12l-2-8" fill="#aaa"/><path d="M13 23L24 6l3 2-11 18-4 2z" fill="#f5a53a"/><path d="M12 28l4-2-3-3z" fill="#333"/></svg>';
  const APPICON =
    '<svg viewBox="0 0 28 32" stroke="#444" stroke-width="1.2"><path d="M6 9l5-6 12 5-4 12-10 2-3-6z" fill="#aaa"/><path d="M8 9l5-3 7 4-3 7-7 2z" fill="#ddd"/><path d="M11 18v10l6-1 2-10" fill="#999"/><path d="M5 9l4 1-2 9 4 4-2 2-5-6z" fill="#eee"/><path d="M18 9l3 1-5 14-3-1z" fill="#e5ae29"/></svg>';
  const SPK =
    '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="#222" stroke-width="2"><path d="M3 9h4l5-4v14l-5-4H3z" fill="#222"/><path d="M15 8q3 4 0 8M18 6q5 6 0 12"/></svg>';
  const palette = { bg: '#dcdcdc', panel: '#f6f6f6', fg: '#111', muted: '#333', line: '#8a8a8a' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const desk = u.el('div', 'be-desk', document.body);
      const tab = u.el('div', 'be-tab', desk);
      u.el('span', '', tab, C.tab);
      const logo = u.el('div', 'be-top', desk);
      const bl = u.el('span', 'be-logo', logo);
      u.el('i', '', bl, 'Be');
      u.el('b', '', bl, 'OS');
      u.el('span', 'be-date', logo, C.date + '   ' + C.clock);
      const win = u.el('div', 'be-win', desk);
      Object.assign(_c, { desk, win });
    },
    'frame.nav': () => (_c) => {
      const u = _c.util;
      const menu = u.el('nav', 'be-menu', _c.win);
      for (const m of C.menus) u.el('span', '', menu, m);
      const wb = u.el('span', 'be-wb', menu);
      u.el('i', 'be-min', wb);
      u.el('i', 'be-max', wb);
      const body = u.el('div', 'ds-body', _c.win);
      const content = u.el('div', 'ds-content', body);
      const head = u.el('header', 'ds-top', content);
      u.el('div', 'be-icon', head).innerHTML = ICON;
      const ht = u.el('div', 'be-ht', head);
      u.el('div', 'be-brand', ht, C.brand);
      u.el('div', 'be-sub', ht, C.sub);
      const rail = u.el('aside', 'ds-rail', body);
      u.el('h2', '', rail, C.rail);
      u.el('p', '', rail, C.railText);
      u.el('div', 'ds-reservation-values', rail).hidden = true;
      u.el('div', 'be-grow', rail);
      const cancel = u.el('button', 'ds-cancel', rail, 'Cancel');
      cancel.type = 'button';
      Object.assign(_c, { body, content, rail, cancel, header: content });
    },
    'frame.instruction': (base) => (_c) => {
      base(_c);
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.rail;
      base(_c);
      _c.header = header;
      _c.rail.insertBefore(_c.headerTools, _c.cancel);
    },
    'frame.body': () => (_c) => {
      _c.main = _c.util.el('div', 'ds-main', _c.content);
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.main;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.main);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.content.insertBefore(note, _c.main);
    },
    'frame.footer': (base) => (_c) => {
      const u = _c.util;
      const task = u.el('div', 'be-task', _c.desk);
      const ws = u.el('span', 'be-ws', task);
      u.el('i', 'be-wsi', ws).innerHTML = WORKSPACE;
      u.el('span', '', ws, 'Workspace');
      const ap = u.el('span', 'be-app', task);
      u.el('i', 'be-wsi', ap).innerHTML = APPICON;
      u.el('span', '', ap, C.tab);
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      task.appendChild(foot);
      const sp = u.el('span', 'be-spk', task);
      sp.innerHTML = SPK;
      u.el('span', 'be-tc', task, C.clock);
      Object.assign(_c, { task, foot });
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.task.insertBefore(dock, _c.task.querySelector('.be-spk'));
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
    name: C.site,
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-set-date-time-02': palette },
      LOW_THEME: palette,
      ACCENTS: ['#0a1fc0'],
      LOW_ACCENTS: ['#0a1fc0'],
      parts,
    },
  });
})();
