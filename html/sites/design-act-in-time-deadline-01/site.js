(function () {
  'use strict';
  const palette = { bg: '#faf9ef', panel: '#fffef6', fg: '#071f4c', muted: '#315275', line: '#379bc8' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The travel storefront has dedicated places for every note mode.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      // The side-note layout uses the storefront's independent chrome stream.
      // The template still selects every control placement in every note mode.
      const rng = _c.rng;
      if (_c.display === 'panel') _c.rng = rng.fork('chrome/end');
      base(_c);
      _c.rng = rng;
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = ['footer', 'link', 'floating'].includes(_c.placement);
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('travel-page');
      const toolbar = u.el('header', 'tp-header', document.body);
      const logo = u.el('div', 'tp-logo', toolbar);
      logo.innerHTML =
        '<svg viewBox="0 0 100 56" aria-hidden="true"><path d="M4 49 28 18l10 12L55 4l40 45H4Z" fill="#f9fbff"/><path d="m23 29 7 7 9-12 6 10 10-19 17 26H15Z" fill="#09284d"/><path d="m57 15 7 14 8 5-17-1-4-6Z" fill="#fff"/></svg>';
      const brand = u.el('div', 'tp-brand', toolbar);
      u.el('strong', '', brand, 'TrailPoint Travel');
      u.el('span', '', brand, 'Get out there.');
      const links = u.el('div', 'tp-links', toolbar);
      u.el('span', 'tp-user', links, '♟　My Account');
      u.el('i', '', links, '');
      u.el('span', '', links, 'Help');
      const main = u.el('main', 'tp-main');
      Object.assign(_c, { toolbar, main, header: main });
    },
    'frame.nav': () => (_c) => {
      const nav = _c.util.el('nav', 'tp-tabs', document.body);
      ['Featured Deals', 'Flights', 'Hotels', 'Vatels', 'Vacation Packages', 'Car Rental'].forEach((t, i) =>
        _c.util.el('div', i ? 'tp-tab' : 'tp-tab selected', nav, t),
      );
    },
    'frame.tools': (base) => (_c) => {
      const h = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = h;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const bodyrow = u.el('div', 'tp-body', document.body);
      const sidebar = u.el('aside', 'tp-sidebar', bodyrow);
      const list = u.el('section', 'tp-list', sidebar);
      u.el('h2', 'tp-section-title', list, 'Today’s Deals');
      const rows = [
        ['Pine Ridge Ski Resort', '2-Night Weekend Getaway', 'Lodging + Lift Tickets', ''],
        ['Sunset Bay Resort', '4-Night Beach Package', 'Hotel + Airfare', ''],
        ['Riverton City Break', '3 Nights in Riverton', 'Hotel + Extras', ''],
        ['Canyon Trails Tour', 'National Park Adventure', 'Guided Tour + Lodging', ''],
        ['Lakeview Cabins', '3-Night Cabin Stay', 'Lodging + Activities', ''],
      ];
      const listbody = u.el('div', 'tp-listbody', list);
      rows.forEach((r, i) => {
        const row = u.el('div', i ? 'tp-row' : 'tp-row active', listbody);
        u.el('span', 'tp-thumb', row, r[3]);
        const copy = u.el('span', 'tp-rowcopy', row);
        u.el('b', '', copy, r[0]);
        u.el('span', '', copy, r[1]);
        u.el('small', '', copy, r[2]);
        u.el('strong', 'tp-chevron', row, '›');
      });
      const detail = u.el('section', 'tp-details', sidebar);
      u.el('h2', 'tp-section-title', detail, 'Deal Details');
      const d = u.el('div', 'tp-detailbody', detail);
      u.el('div', 'tp-detailname', d, 'Pine Ridge Ski Resort');
      u.el('div', 'tp-detail-sub', d, '2-Night Weekend Getaway');
      [
        ['Location:', 'Pine Ridge, CO'],
        ['Includes:', '2 nights lodging,\n2 lift tickets (adult)'],
        ['Valid for travel:', 'Jan 10 – Mar 31, 2006'],
        ['Blackout dates:', 'Feb 17 – Feb 20, 2006'],
        ['Rating:', '★★★★★　(214 reviews)'],
      ].forEach((x) => {
        const line = u.el('div', 'tp-detail-line', d);
        u.el('span', '', line, x[0]);
        u.el('span', '', line, x[1]);
      });
      bodyrow.appendChild(_c.main);
      Object.assign(_c, { body: bodyrow, sidebar });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.sidebar;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'tp-stage', _c.main);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        foot.classList.add('tp-template-footer');
        foot.querySelector('.ref-foot-text').textContent = 'TrailPoint Travel　•　Offers updated daily';
      }
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock && _c.foot) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const el = u.el('section', 'tp-overlay tp-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to remember your travel preferences.',
        toast: 'Your trip information has been updated.',
        chat: 'Welcome to TrailPoint. How can we help?',
        promo: 'Get inspired. Sign up for our travel newsletter.',
        banner: 'Special travel offers are updated every day.',
      };
      u.el('div', 'tp-overlay-text', el, texts[ctx.kind] || texts.banner);
      const b = u.el('button', 'tp-overlay-dismiss', el, ctx.kind === 'cookie' ? 'Accept' : '×');
      b.type = 'button';
      b.setAttribute('aria-label', 'Close');
      b.addEventListener('click', () => ctx.dismiss(ctx.kind === 'cookie' ? 'accept' : 'close'));
      return { el, dismiss: b, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: 'design-act-in-time-deadline-01',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#007eb5'],
      LOW_ACCENTS: ['#007eb5'],
      parts,
    },
  });
})();
