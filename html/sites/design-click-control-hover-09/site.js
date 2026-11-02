(function () {
  'use strict';
  const WC = '<i><svg viewBox="0 0 16 16"><path d="M3 12h10"/></svg></i><i><svg viewBox="0 0 16 16"><path d="M3 3h10v10H3Z"/></svg></i><i><svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13"/></svg></i>';
  const palette = { bg: '#f6f7f9', panel: '#fafbfc', fg: '#1c2230', muted: '#4a5262', line: '#c9cdd4' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      if (_c.display === 'panel' && _c.H < 700) _c.display = 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('ref');
      const wallpaper = u.el('div', 'wallpaper', document.body);
      wallpaper.innerHTML = '<svg viewBox="0 0 1672 941" preserveAspectRatio="none"><defs><linearGradient id="sky" x2="1" y2="1"><stop stop-color="#183555"/><stop offset=".55" stop-color="#365d86"/><stop offset="1" stop-color="#8da5bd"/></linearGradient><linearGradient id="wave" x1="0" y1="1" x2="1" y2="0"><stop stop-color="#91a8bd"/><stop offset=".5" stop-color="#527596"/><stop offset="1" stop-color="#9badbf"/></linearGradient><linearGradient id="deep" x2="1" y2="1"><stop stop-color="#183954"/><stop offset="1" stop-color="#567c9f"/></linearGradient></defs><path fill="url(#sky)" d="M0 0h1672v941H0Z"/><path fill="url(#wave)" d="M1503 36C1310 222 1210 454 1672 593V36Z"/><path fill="url(#wave)" d="M0 372C280 610 863 893 1672 593V941H0Z"/><path fill="url(#deep)" d="M0 492C386 691 1086 907 1672 941H744C445 760 178 711 0 492Z"/><path fill="url(#deep)" d="M1135 752C1354 785 1520 814 1672 941V593C1489 636 1314 688 1135 752Z"/></svg>';
      const top = u.el('div', 'topbar', document.body);
      const tl = u.el('div', 'l', top);
      u.el('span', '', tl, 'Activities');
      const app = u.el('span', 'app', tl);
      u.el('i', '', app);
      u.el('span', '', app, 'Attention Task');
      u.el('div', 'c', top, 'Mon Apr 28  10:24 AM');
      const tr = u.el('div', 'r', top);
      tr.innerHTML = '<svg viewBox="0 0 16 16"><path d="M8 13l1.6-1.8a2.4 2.4 0 0 0-3.2 0ZM3.5 8.6l1.1 1.2a4.8 4.8 0 0 1 6.8 0l1.1-1.2a6.4 6.4 0 0 0-9 0ZM1 6l1.1 1.2a8.4 8.4 0 0 1 11.8 0L15 6A10 10 0 0 0 1 6Z"/></svg><svg viewBox="0 0 16 16"><path d="M2 6h3l4-3v10l-4-3H2ZM11 5a4 4 0 0 1 0 6l.8.8a5 5 0 0 0 0-7.6Z"/></svg><svg viewBox="0 0 16 16"><path d="M4 2h6v2h1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4h1ZM6 7h2v3H6Z"/></svg>';
      const win = u.el('main', 'win main', document.body);
      const hb = u.el('header', 'hb', win);
      u.el('span', 'tl', hb).innerHTML = '<i></i><i></i><i></i>';
      u.el('span', 'window-title', hb, 'Attention Task');
      u.el('span', 'wc', hb).innerHTML = WC;
      const body = u.el('div', 'mbody', win);
      const card = u.el('section', 'card', body);
      Object.assign(_c, { win, hb, body, card, header: card });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) { note.classList.add('instruction'); note.dataset.display = _c.display; }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.hb;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const nw = u.el('aside', 'win notes', document.body);
      const nh = u.el('div', 'nhb', nw);
      u.el('span', 'ico', nh).appendChild(document.createElement('i'));
      u.el('span', '', nh, 'Notes');
      u.el('span', 'wc', nh).innerHTML = WC;
      const nb = u.el('div', 'nbody', nw);
      const nc = u.el('div', 'ncard', nb);
      u.el('h2', '', nc, 'How this works');
      _c.noteCard = nc;
    },
    'frame.panel': (base) => (_c) => {
      base({ ..._c, body: _c.noteCard });
      const text = _c.noteCard.querySelector('.ref-panel-text');
      if (text) text.dataset.display = _c.display;
      const ul = _c.util.el('ul', '', _c.noteCard);
      _c.util.el('li', '', ul, 'A highlighted square moves to different positions within the dashed area.');
      _c.util.el('li', '', ul, 'The counter shows the total time your mouse has been over the square.');
      _c.util.el('li', '', ul, 'The square may change position at any time within the dashed area.');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.card);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('instruction-toast');
        note.querySelector('.ref-note-text').dataset.display = _c.display;
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('footer');
      _c.win.appendChild(foot);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
      const u = _c.util;
      const apps = u.el('div', 'dock', document.body);
      ['ff', 'fl', 'tm', 'dc', 'ap'].forEach((c) => u.el('i', c, apps));
      apps.querySelector('.ff').innerHTML = '<svg viewBox="0 0 48 48"><defs><linearGradient id="fox" x2=".8" y2="1"><stop stop-color="#ffd249"/><stop offset=".55" stop-color="#ff8226"/><stop offset="1" stop-color="#e73765"/></linearGradient></defs><path fill="url(#fox)" d="M36 3c2 8 10 13 10 24 0 13-10 21-23 20C10 46 2 37 2 26c0-6 2-12 6-17l2 8 6-6 6 5C28 13 30 8 30 2l6 10Z"/><circle fill="#8136c6" cx="25" cy="28" r="13"/><path fill="#ffad31" d="m7 16 10-6 6 7 8 2-7 5-7-2c-2 8 4 11 11 9-6 9-19 4-20-4Z"/></svg>';
    },
    overlay: () => (ctx) => {
      const el = ctx.util.el('section', 'perturb ' + ctx.kind, document.body);
      ctx.util.el('strong', '', el, {
        cookie: 'Cookie preferences', toast: 'Notification', chat: 'Support', promo: 'A special offer', banner: 'Service notice',
      }[ctx.kind]);
      ctx.util.el('p', '', el, {
        cookie: 'Choose your preferences to continue.', toast: 'Your workspace is ready.', chat: 'How can we help?', promo: 'Explore the latest tools.', banner: 'A new update is available.',
      }[ctx.kind]);
      const dismiss = ctx.util.el('button', 'dismiss', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-click-control-hover-09',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-click-control-hover-09': palette }, LOW_THEME: palette,
      ACCENTS: ['#1a64ff'], LOW_ACCENTS: ['#1a64ff'], parts,
    },
  });
})();
