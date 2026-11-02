(function () {
  'use strict';
  const palette = { bg: '#ffffff', panel: '#ffffff', fg: '#080808', muted: '#555555', line: '#85898c' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('plain-contacts');
      const frame = u.el('div', 'app-frame', document.body);
      const rail = u.el('nav', 'app-rail', frame);
      const links = [
        ['▣', 'Contacts'],
        ['▦', 'Calendar'],
        ['✉', 'Mail'],
        ['▤', 'Tasks'],
        ['▱', 'Notes'],
      ];
      links.forEach((x, i) => {
        const a = u.el('div', 'rail-item' + (i === 0 ? ' selected' : ''), rail);
        u.el('span', 'rail-icon', a, x[0]);
        u.el('span', '', a, x[1]);
      });
      const content = u.el('div', 'app-content', frame);
      const head = u.el('header', 'page-head', content);
      u.el('h1', '', head, 'Contacts');
      u.el('span', 'page-date', head, 'Tuesday, April 12, 1994');
      Object.assign(_c, { frame, rail, content, header: head });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.content;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const summary = u.el('section', 'summary-band', _c.content);
      u.el('div', 'book-art', summary, '▤');
      const summaryText = u.el('div', 'summary-copy', summary);
      u.el('p', 'summary-desc', summaryText, 'Manage your business contacts, customers, and colleagues.');
      const stats = u.el('div', 'summary-stats', summaryText);
      [
        ['Total Contacts:', '328'],
        ['Companies:', '214'],
        ['Individuals:', '114'],
      ].forEach((r) => {
        const row = u.el('div', 'stat-row', stats);
        u.el('b', '', row, r[0]);
        u.el('span', '', row, r[1]);
      });
      Object.assign(_c, { body: _c.content });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.rail;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      const lower = u.el('div', 'lower-layout', _c.body);
      const stage = u.el('main', 'ds-stage', lower);
      const inspector = u.el('aside', 'details-inspector', lower);
      u.el('h2', '', inspector, 'Contact Details');
      [
        ['Name:', '—'],
        ['Company:', '—'],
        ['Title:', '—'],
        ['Department:', '—'],
        ['Phone:', '—'],
        ['Fax:', '—'],
        ['Email:', '—'],
        ['Address:', '—'],
        ['', '—'],
        ['', '—'],
        ['', '—'],
        ['Notes:', '—'],
      ].forEach((r, i) => {
        const row = u.el('div', 'detail-line' + (i === 4 || i === 7 || i === 11 ? ' gap-before' : ''), inspector);
        u.el('span', '', row, r[0]);
        u.el('span', '', row, r[1]);
      });
      Object.assign(_c, { stage, lower });
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.content.insertBefore(note, _c.lower);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.content.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.content.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'This site uses cookies. Please choose whether to accept them.',
        toast: 'Your contacts are up to date.',
        chat: 'Hello. How may we help you?',
        promo: 'Discover the latest features.',
        banner: 'Notice: scheduled maintenance is planned.',
      };
      u.el('div', 'overlay-copy', el, texts[ctx.kind]);
      const b = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      b.type = 'button';
      b.addEventListener('click', () => ctx.dismiss(ctx.kind === 'cookie' ? 'accept' : 'close'));
      return { el, dismiss: b, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: 'design-act-in-time-refresh-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-act-in-time-refresh-02': palette },
      LOW_THEME: palette,
      ACCENTS: ['#7da5d1'],
      LOW_ACCENTS: ['#7da5d1'],
      parts,
    },
  });
})();
