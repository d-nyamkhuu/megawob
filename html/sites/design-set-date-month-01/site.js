(function () {
  'use strict';
  const palette = { bg: '#f7f4e9', panel: '#fbf8ef', fg: '#101829', muted: '#5f5a52', line: '#c9c0ad' };
  const parts = {
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
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-mark', top, '▤');
      u.el('span', 'ds-brand', top, 'Riverton Public Library');
      u.el('span', 'ds-motto', top, 'Knowledge　·　Community　·　Always Open');
      u.el('span', 'ds-building', top, '♜');
      Object.assign(_c, { body, content });
    },
    'frame.nav': () => (_c) => {
      const u = _c.util;
      const nav = u.el('nav', 'ds-menu', document.body);
      ['Catalog', 'Circulation', 'Acquisitions', 'Serials', 'Administration', 'Reports', 'Help'].forEach((x, i) => {
        u.el('span', 'ds-navitem' + (i === 2 ? ' active' : ''), nav, x);
      });
      const heading = u.el('div', 'ds-pagehead', _c.content);
      u.el('h1', '', heading, 'New Acquisition');
      _c.header = heading;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const main = u.el('div', 'ds-main', _c.content);
      const foot = u.el('footer', 'ds-footer', _c.content);
      const rail = u.el('aside', 'ds-rail', _c.body);
      Object.assign(_c, { main, foot, rail });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.rail;
      base(_c);
      _c.body = body;
      const u = _c.util, rail = _c.rail;
      u.el('span', 'ds-books', rail, '▤');
      u.el('h2', '', rail, 'Recent Titles');
      const table = u.el('div', 'ds-records', rail);
      [
        ['Title', 'Year', 'Type'],
        ['Handbook of Western Architecture', '2028', 'Book'],
        ['The River and the City', '2027', 'Book'],
        ['Maps of the Pacific', '2026', 'Book'],
        ['A History of Medieval Europe', '2026', 'Book'],
        ['Gardens and the Natural World', '2025', 'Book'],
        ['The Science of Rain', '2025', 'Book'],
        ['Literary Movements in America', '2024', 'Book'],
        ['Desert Plants', '2024', 'Book'],
        ['Atlantic Voyages', '2023', 'Book'],
        ['The Art of Printmaking', '2023', 'Book'],
      ].forEach((row, i) => {
        const r = u.el('div', 'ds-record' + (i === 1 ? ' selected' : ''), table);
        row.forEach((v) => u.el('span', '', r, v));
      });
      const details = u.el('section', 'ds-details', rail);
      u.el('h2', '', details, 'Bibliographic Details');
      [
        ['Title:', 'Handbook of Western Architecture'],
        ['Author:', 'Fletcher, Banister'],
        ['Publisher:', 'Oxford University Press'],
        ['Year:', '2028'],
        ['ISBN:', '978-0-19-288776-5'],
        ['Subjects:', 'Architecture, Western Architecture -- History Buildings -- Design and construction'],
      ].forEach((a) => {
        const p = u.el('p', '', details);
        u.el('b', '', p, a[0]);
        u.el('span', '', p, a[1]);
      });
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.main);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.content.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.foot.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'This site uses cookies to improve your library experience.',
        toast: 'Your catalog session is active.',
        chat: 'How may we help you find a title?',
        promo: 'Discover the latest additions to our collection.',
        banner: 'Library catalog notice: scheduled maintenance tonight.',
      };
      u.el('div', '', el, texts[ctx.kind] || 'Library notice');
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.onclick = () => ctx.dismiss('close');
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: 'design-set-date-month-01',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-set-date-month-01': palette },
      LOW_THEME: palette,
      ACCENTS: ['#7d092d'],
      LOW_ACCENTS: ['#7d092d'],
      parts,
    },
  });
})();
