(function () {
  'use strict';
  const palette = { bg: '#bdbdbd', panel: '#ffffff', fg: '#000000', muted: '#555555', line: '#000000' };
  const iconArt = [
    '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M15 14V9h18v5M9 15h30v27H9z" fill="none" stroke="currentColor" stroke-width="3"/><path d="M20 15v27M28 15v27" fill="none" stroke="currentColor" stroke-width="2.5"/></svg>',
    '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M23 4h3l2 15 14 9v4l-15-5-1 11 6 4v3l-8-2-8 2v-3l6-4-1-11-15 5v-4l14-9z" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/></svg>',
    '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M5 40V13h11v13h7V19h18v21M5 34h38M10 9h12v4H10zM31 23v5M36 23v5" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/><path d="M25 40V27h16v13" fill="none" stroke="currentColor" stroke-width="3"/></svg>',
    '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M8 27l3-10q1-4 5-4h16q4 0 5 4l3 10 3 3v9h-4v-4H9v4H5v-9z" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/><path d="M13 25h22l-3-8H16zM12 30h5M31 30h5" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cx="13" cy="34" r="2"/><circle cx="35" cy="34" r="2"/></svg>',
    '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M8 16l29-8 6 23-29 9z" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/><path d="M15 19l2 2m4-4 2 2m4-4 2 2m-14 9 2 2m4-4 2 2" stroke="currentColor" stroke-width="2.5"/><circle cx="34" cy="27" r="1.6"/></svg>',
    '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M12 5h25v38H12z" fill="none" stroke="currentColor" stroke-width="3"/><path d="M18 14h13M18 21h13M18 28h13M18 35h9" stroke="currentColor" stroke-width="2.5"/></svg>',
  ];
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // Retain this frame's original compact-screen fallback.
      _c.display = _c.ctx.display || 'header';
      if ((_c.display === 'panel' || _c.display === 'toast') && (_c.W <= 1100 || _c.H <= 680)) _c.display = 'header';
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const desk = u.el('div', 'ds-desktop', document.body);
      const menu = u.el('div', 'ds-menu', desk);
      ['●', 'File', 'Edit', 'View', 'Trips', 'Reservations', 'Window', 'Help'].forEach(t => u.el('span', '', menu, t));
      u.el('span', 'ds-clock', menu, '9:14 AM');
      const win = u.el('section', 'ds-window', desk);
      const title = u.el('header', 'ds-titlebar', win);
      u.el('span', 'ds-closebox', title, '');
      u.el('strong', 'ds-window-title', title, 'Travel Planner');
      u.el('span', 'ds-zoom', title, '▣');
      const app = u.el('div', 'ds-app', win);
      const rail = u.el('nav', 'ds-rail', app);
      ['Trips', 'Flights', 'Hotels', 'Cars', 'Deals', 'My Trips'].forEach((label, i) => {
        const item = u.el('div', 'ds-navitem' + (i === 0 ? ' selected' : ''), rail);
        u.el('span', 'ds-navicon', item).innerHTML = iconArt[i];
        u.el('span', 'ds-navlabel', item, label);
      });
      const main = u.el('main', 'ds-main', app);
      const task = u.el('div', 'ds-task', main);
      const header = u.el('div', 'ds-taskline', task);
      Object.assign(_c, { app, task, header, title });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      if (_c.display === 'toast') _c.header = _c.title;
      base(_c);
      _c.header = header;
      // Controls occupy the same toolbar above the header note.
      if (_c.display !== 'toast') _c.header.prepend(_c.headerTools);
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const work = u.el('div', 'ds-work', _c.task);
      const side = u.el('aside', 'ds-summary', _c.app);
      Object.assign(_c, { body: work, side });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.side;
      base(_c);
      _c.body = body;
      const u = _c.util;
      const section = (heading) => {
        const s = u.el('section', 'ds-summary-section', _c.side);
        u.el('h2', '', s, heading);
        return s;
      };
      const rows = (parent, values) => values.forEach(([k, v]) => {
        const row = u.el('div', 'ds-detail-row', parent);
        u.el('b', '', row, k);
        u.el('span', '', row, v);
      });
      const details = section('Trip Details');
      u.el('div', 'ds-train-art', details);
      rows(details, [['Route:', 'Riverdale → Pinecrest'], ['Date:', 'Sat, Jun 18, 1988'], ['Depart:', '8:00 AM'], ['Arrive:', '11:20 AM'], ['Duration:', '3 h 20 m'], ['Service:', 'Mountain View Express']]);
      rows(section('Availability'), [['First Class:', '12 seats'], ['Coach:', '48 seats'], ['Total:', '60 seats']]);
      u.el('p', 'ds-about', section('About This Trip'), 'A relaxing ride through pine forests, rivers and mountain valleys. Large windows and a cafe car on board.');
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      _c.stage = u.el('div', 'ds-stage', _c.body);
      const intro = u.el('div', 'ds-trip-intro', _c.body);
      u.el('div', 'ds-mountain', intro);
      const copy = u.el('div', 'ds-introcopy', intro);
      u.el('h1', '', copy, 'Mountain View Express');
      u.el('div', 'ds-subtitle', copy, 'Scenic train from Riverdale to Pinecrest');
      u.el('p', '', copy, 'Limited seats are released for this popular route. They’ll be available soon. Please wait for the window to open.');
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.body.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.task.appendChild(foot);
      _c.foot = foot;
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
        cookie: 'This site uses cookies to keep your travel preferences.',
        toast: 'Reservation details updated.',
        chat: 'Travel desk. How may we help?',
        promo: 'Discover more scenic routes.',
        banner: 'Mountain View Express reservations open shortly.',
      };
      u.el('div', 'ds-overlay-text', el, texts[ctx.kind] || texts.toast);
      const dismiss = u.el('button', 'ds-overlay-dismiss', el, ctx.kind === 'banner' ? 'Dismiss' : 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', () => ctx.dismiss(ctx.kind === 'cookie' ? 'accept' : 'close'));
      if (ctx.kind === 'cookie') {
        const accept = u.el('button', 'ds-overlay-dismiss', el, 'Accept all');
        accept.type = 'button';
        accept.addEventListener('click', () => ctx.dismiss('accept'));
      }
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: 'design-act-in-time-deadline-04',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-act-in-time-deadline-04': palette },
      LOW_THEME: palette,
      ACCENTS: ['#000000'],
      LOW_ACCENTS: ['#000000'],
      parts,
    },
  });
})();
