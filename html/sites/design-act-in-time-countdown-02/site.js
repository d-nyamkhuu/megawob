(function () {
  'use strict';
  const palette = { bg: '#111516', panel: '#292e32', fg: '#101214', muted: '#687078', line: '#aeb6bf' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      const display = _c.ctx.display || 'header';
      _c.display = display === 'toast' && !_c.tall ? 'header' : display;
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const win = u.el('div', 'fm-window', document.body);
      const title = u.el('header', 'fm-titlebar', win);
      const lights = u.el('div', 'fm-lights', title);
      ['red', 'yellow', 'green'].forEach((c) => u.el('i', 'fm-light ' + c, lights));
      u.el('span', 'fm-title', title, 'FreshMart Grocery');
      const winctl = u.el('div', 'fm-winctl', title);
      ['−', '□', '×'].forEach((t) => u.el('span', '', winctl, t));
      const nav = u.el('nav', 'fm-nav', win);
      [ ['◆', 'Home'], ['🛒', 'Shop'], ['▣', 'Pickup & Delivery'], ['▤', 'Orders'], ['◆', 'Special Offers'] ].forEach((x, i) => {
        const a = u.el('div', 'fm-tab' + (i === 2 ? ' active' : ''), nav);
        u.el('b', '', a, x[0]);
        u.el('span', '', a, x[1]);
      });
      const search = u.el('div', 'fm-search', nav);
      u.el('b', '', search, '⌕');
      u.el('span', '', search, 'Search products');
      const bodyrow = u.el('div', 'fm-body', win);
      const side = u.el('aside', 'fm-sidebar', bodyrow);
      [ ['▦', 'Book a Pickup'], ['☷', 'My Bookings'], ['●', 'Store Information'], ['?', 'Help'] ].forEach((x, i) => {
        const a = u.el('div', 'fm-sideitem' + (!i ? ' selected' : ''), side);
        u.el('b', '', a, x[0]);
        u.el('span', '', a, x[1]);
      });
      const work = u.el('div', 'fm-work', bodyrow);
      const main = u.el('main', 'fm-reservation-frame', work);
      Object.assign(_c, { win, navBar: nav, bodyrow, work, main, header: work });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('fm-header-note');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      const toolbar = _c.util.el('div', 'fm-toolbar', _c.navBar);
      _c.header = toolbar;
      base(_c);
      _c.header = header;
      if (!toolbar.textContent) toolbar.remove();
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const right = u.el('aside', 'fm-right', _c.bodyrow);
      const store = u.el('section', 'fm-sidecard', right);
      u.el('h3', '', store, 'Selected Store');
      u.el('div', 'fm-store-photo', store);
      u.el('b', 'fm-store-name', store, 'Riverside Store');
      u.el('div', 'fm-address', store, '7420 Maple Ave\nRiverside, CA 92507');
      u.el('a', 'fm-link', store, 'Change Store…');
      const avail = u.el('section', 'fm-sidecard fm-availability', right);
      u.el('h3', '', avail, 'Pickup Availability');
      [ ['Mon', '12'], ['Tue', '10'], ['Wed', '9'], ['Thu', '11'], ['Fri', '8'], ['Sat', '14'], ['Sun', '10'] ].forEach((x) => {
        const row = u.el('div', 'fm-avail-row', avail);
        u.el('span', '', row, x[0]);
        u.el('span', '', row, x[1] + ' slots');
      });
      _c.body = _c.work;
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const note = _c.work.querySelector('.ref-panel');
      if (note) note.classList.add('fm-panel-note');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'fm-stage', _c.main);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('fm-toast');
        _c.win.appendChild(note);
        // Keep the original notification corner, with clear space above the task.
        const bottom = note.getBoundingClientRect().bottom;
        const top = _c.work.getBoundingClientRect().top;
        _c.work.style.paddingTop = Math.max(20, bottom - top + 12) + 'px';
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        foot.classList.add('fm-footer');
        _c.main.appendChild(foot);
      }
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const box = u.el('section', 'fm-overlay fm-overlay-' + ctx.kind, document.body);
      box.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to improve your shopping experience.',
        toast: 'Your pickup details are up to date.',
        chat: 'Need help with your order?',
        promo: 'Fresh deals for your next visit.',
        banner: 'Pickup hours may vary by location.',
      };
      u.el('div', '', box, texts[ctx.kind] || texts.banner);
      const b = u.el('button', '', box, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      b.onclick = () => ctx.dismiss('close');
      return { el: box, dismiss: b, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: 'design-act-in-time-countdown-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: { THEMES: { site: palette }, LOW_THEME: palette, ACCENTS: ['#2378df'], LOW_ACCENTS: ['#2378df'], parts },
  });
})();
