(function () {
  'use strict';
  const palette = { bg: '#eeece5', panel: '#f4f1e9', fg: '#172116', muted: '#76695e', line: '#d2cec4' };
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
      const title = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-brand', title, '❧  Wayfarer Travel Co.');
      const meta = u.el('div', 'ds-window-meta', title);
      ['−', '□', '×'].forEach((t) => u.el('span', '', meta, t));
      const menu = u.el('nav', 'ds-menu', document.body);
      ['File', 'Edit', 'View', 'Bookmarks', 'Tools', 'Help'].forEach((t) => u.el('span', '', menu, t));
      const toolbar = u.el('div', 'ds-toolbar', document.body);
      u.el('div', 'ds-logo', toolbar, '❧');
      u.el('div', 'ds-wordmark', toolbar, 'Wayfarer Travel Co.');
      const actions = u.el('div', 'ds-actions', toolbar);
      ['Home', 'Search', 'Saved', 'Trips', 'Deals'].forEach((text) => {
        const a = u.el('div', 'ds-action', actions);
        const ico = u.el('b', '', a);
        ico.innerHTML = {
          Home: '<svg viewBox="0 0 24 24"><path d="M4 20V8l8-5 8 5v12M8 20v-7h8v7M9 8h.01M15 8h.01"/></svg>',
          Search: '<svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg>',
          Saved: '<svg viewBox="0 0 24 24"><path d="M12 21S3 15 3 8.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 9 1.5C21 15 12 21 12 21Z"/></svg>',
          Trips: '<svg viewBox="0 0 24 24"><rect x="5" y="4" width="14" height="17" rx="1"/><path d="M9 2v5m6-5v5M5 9h14"/></svg>',
          Deals: '<svg viewBox="0 0 24 24"><path d="M6 3h9l4 4v14H6zM15 3v5h4M9 12h7m-7 4h7"/></svg>',
        }[text];
        u.el('span', '', a, text);
      });
      u.el('div', 'ds-search', toolbar, '⌕　 Search destinations, hotels, or experiences');
      _c.header = toolbar;
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) document.body.appendChild(note);
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'ds-body', document.body);
      const rail = u.el('aside', 'ds-rail', body);
      u.el('div', 'ds-railnav', rail, '◉　 Destinations|▤　 Hotels|♧　 Experiences|✈　 Flights|▱　 Car Rentals'.replace(/\|/g, '\n'));
      u.el('div', 'ds-railhead', rail, 'MY TRIPS');
      u.el('div', 'ds-railnav secondary', rail, '▢　 Upcoming|◷　 Past Trips|♡　 Saved'.replace(/\|/g, '\n'));
      const content = u.el('div', 'ds-content', body);
      const listing = u.el('section', 'ds-listing', content);
      u.el('div', 'ds-list-title', listing, 'Popular Destinations');
      const photos = u.el('div', 'ds-photo-grid', listing);
      [['Amalfi Coast', 'Italy'], ['Florence', 'Italy'], ['Santorini', 'Greece'], ['Lisbon', 'Portugal']].forEach(([name, country], i) => {
        const card = u.el('article', 'ds-destination ds-dest-' + i, photos);
        u.el('div', 'ds-dest-photo', card);
        u.el('strong', '', card, name);
        u.el('small', '', card, country);
      });
      const side = u.el('aside', 'ds-help', body);
      u.el('h3', '', side, 'DEALS & OFFERS');
      u.el('div', 'ds-helptext', side, '◇　 Flash deals appear for a short time and may sell out quickly.|♧　 New offers can unlock at any moment.|◷　 Check back often — availability is limited.|☆　 Discounts apply to select hotels only.|▤　 Read deal details before booking.'.replace(/\|/g, '\n'));
      u.el('h3', 'ds-tipshead', side, 'TRAVEL TIPS');
      u.el('div', 'ds-helptext', side, '◉　 Be flexible with your dates for the best deals.|▤　 Consider nearby destinations, too.|♡　 Save your favorite hotels to check for future offers.|♙　 Sign in to see member-only deals.'.replace(/\|/g, '\n'));
      Object.assign(_c, { body, contentPane: content });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = document.body;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.contentPane);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.contentPane.appendChild(foot);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      u.el('div', '', el, {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'A little inspiration for your next escape.',
        banner: 'A note from Wayfarer Travel Co.',
      }[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: 'design-act-in-time-deadline-03',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css', 'wayfarer.css'],
    design: {
      THEMES: { wayfarer: palette },
      LOW_THEME: palette,
      ACCENTS: ['#a8812f'],
      LOW_ACCENTS: ['#a8812f'],
      parts,
    },
  });
})();
