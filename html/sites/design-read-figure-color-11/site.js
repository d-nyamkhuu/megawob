(function () {
  'use strict';
  const C = {
    'site': 'design-read-figure-color-11',
    'task': 'read-figure',
    'scenario': 'color',
    'style': 'cd',
    'layout': 'utility',
  };
  function world(u, parent, cls) {
    const svg = u.svg('svg', { viewBox: '0 0 100 100', class: cls, 'aria-hidden': 'true' }, parent),
      defs = u.svg('defs', {}, svg);
    const ocean = u.svg('radialGradient', { id: cls + '-o', cx: '.3', cy: '.25', r: '.75' }, defs);
    u.svg('stop', { offset: 0, 'stop-color': '#39b0cd' }, ocean);
    u.svg('stop', { offset: '.45', 'stop-color': '#07549d' }, ocean);
    u.svg('stop', { offset: 1, 'stop-color': '#000c40' }, ocean);
    const shade = u.svg('radialGradient', { id: cls + '-s', cx: '.3', cy: '.25', r: '.75' }, defs);
    u.svg('stop', { offset: '.35', 'stop-color': '#f5ffad', 'stop-opacity': '.04' }, shade);
    u.svg('stop', { offset: '.75', 'stop-color': '#00172b', 'stop-opacity': '.12' }, shade);
    u.svg('stop', { offset: 1, 'stop-color': '#000422', 'stop-opacity': '.85' }, shade);
    u.svg(
      'circle',
      { cx: 50, cy: 50, r: 46, fill: 'url(#' + cls + '-o)', stroke: '#71b7ce', 'stroke-width': 1.5 },
      svg,
    );
    u.svg(
      'path',
      {
        d: 'M18 19L24 17 27 12 34 13 35 17 42 15 39 22 34 24 35 28 28 31 24 29 22 35 25 37 23 41 31 43 33 49 31 51 36 55 43 56 46 62 42 65 44 70 40 72 39 79 35 86 32 79 31 70 28 65 29 57 25 53 24 49 18 48 15 43 14 37 12 33 16 28ZM52 9L58 8 64 11 63 15 69 15 68 20 76 20 80 24 85 26 87 34 91 38 84 39 79 35 76 36 77 43 73 47 69 43 66 45 64 39 62 33 58 37 61 43 68 48 67 53 70 55 67 62 63 65 62 72 57 79 54 74 54 67 50 64 49 56 45 54 40 48 43 41 47 39 48 35 54 34 52 29 47 27 47 23 54 20 52 16ZM75 72L80 68 84 69 85 74 90 77 85 83 82 85 76 82 73 77Z',
        fill: '#81a72b',
        stroke: '#c8ba32',
        'stroke-width': 0.5,
      },
      svg,
    );
    u.svg(
      'path',
      {
        d: 'M18 21l7 2 7-5M21 35l6 4M30 45l-2 8M35 61l5 5-3 7M53 24l7-3 4 3M53 42l9 5-8 4 5 6-2 9M73 27l9 5M78 74l5 5',
        fill: 'none',
        stroke: '#b7bc44',
        'stroke-width': 2,
        opacity: 0.7,
      },
      svg,
    );
    u.svg(
      'path',
      {
        d: 'M15 26Q47 9 83 26M7 49Q48 34 94 49M14 72Q50 57 86 73M50 5Q20 48 50 95M50 5Q79 48 50 95',
        fill: 'none',
        stroke: '#9bd8dd',
        'stroke-width': 0.5,
        opacity: 0.3,
      },
      svg,
    );
    u.svg('circle', { cx: 50, cy: 50, r: 46, fill: 'url(#' + cls + '-s)' }, svg);
    u.svg(
      'path',
      { d: 'M12 33Q19 13 43 9M16 38Q22 19 35 16', fill: 'none', stroke: '#dbf9ff', 'stroke-width': 1.4, opacity: 0.6 },
      svg,
    );
    return svg;
  }
  function announcement(ctx) {
    const u = ctx.util,
      rib = u.el('section', 'ribbon announcement', document.body);
    const horn = u.svg('svg', { viewBox: '0 0 170 140', class: 'horn', 'aria-hidden': 'true' }, rib);
    horn.innerHTML =
      '<defs><linearGradient id="brass" x2=".3" y2="1"><stop stop-color="#fff1a2"/><stop offset=".4" stop-color="#f9b744"/><stop offset=".65" stop-color="#b86b18"/><stop offset="1" stop-color="#ffd16a"/></linearGradient></defs><g stroke="#161509" stroke-width="2"><path d="M48 87l11 35 17-3-9-34" fill="url(#brass)"/><path d="M21 73L99 24 121 103 25 94Z" fill="url(#brass)"/><ellipse cx="24" cy="84" rx="7" ry="14" fill="url(#brass)"/><ellipse cx="109" cy="64" rx="18" ry="47" transform="rotate(-13 109 64)" fill="#e6b64d"/><ellipse cx="110" cy="64" rx="13" ry="41" transform="rotate(-13 110 64)" fill="#141914" stroke="#f8e39b"/><path d="M30 75L94 35" stroke="#fff5c4" stroke-width="4"/></g><g stroke="#ffe67c" stroke-width="6"><path d="M133 29l20-23M141 46l25-10M145 66l25 1M141 86l23 12"/></g>';
    const rt = u.el('div', 'rtext', rib);
    u.el('h2', '', rt, 'Special Announcement!');
    u.el('p', 'r1', rt, 'New World Explorer CD-ROM Now Available!');
    u.el('p', 'r2', rt, 'More games, more facts, more fun!');
    const bk = u.el('div', 'book', rib);
    u.el('b', '', bk, 'World Explorer');
    world(u, bk, 'book-globe');
    u.el('i', '', bk, 'CD-ROM');
    const ul = u.el('ul', 'rlist', rib);
    for (const t of ['Interactive maps', 'Amazing animals', 'Historical adventures', 'And much more!'])
      u.el('li', '', ul, t);
    const dismiss = u.el('button', 'collapse', rib, 'Collapse Announcement');
    dismiss.type = 'button';
    u.el('span', 'tri', dismiss, '▲');
    dismiss.addEventListener('click', ctx.dismiss);
    return { el: rib, dismiss };
  }
  const palette = { bg: '#00104c', panel: '#e8dfc7', fg: '#080e48', muted: '#a09354', line: '#dba430' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      document.body.classList.add('cd', 'utility', 'instruction-' + _c.display);
      const u = _c.util,
        app = u.el('main', 'app', document.body),
        top = u.el('header', 'top', app);
      world(u, top, 'globe');
      const brand = u.el('span', 'brand', top, 'Discovery Works');
      u.el('sup', '', brand, '™');
      u.el('span', 'tag', top, 'EXPLORE  ▪▪  LEARN   •   GROW');
      const util = u.el('span', 'utils', top);
      for (const [icon, t] of [
        ['', 'Student Center'],
        ['?', 'Help'],
        ['⚙', 'Settings'],
        ['⇥', 'Exit'],
      ]) {
        const item = u.el('span', 'ut', util);
        if (icon) u.el('i', 'nav-icon', item, icon);
        u.el('span', '', item, t);
      }
      const rib = u.el('section', 'overview', app);
      u.el('span', 'overview-label', rib, 'World Explorer · Discovery Works Learning Library');
      const tabs = u.el('nav', 'tabs', app);
      ['Activities', 'Games', 'Reference', 'Creativity', 'My Progress'].forEach((t, i) =>
        u.el('span', 'tab' + (i ? '' : ' on'), tabs, t),
      );
      const center = u.el('div', 'center', app);
      const th = u.el('div', 'ctitle', center);
      const pal = u.svg('svg', { viewBox: '0 0 100 75', class: 'pal', 'aria-hidden': 'true' }, th);
      pal.innerHTML =
        '<defs><linearGradient id="palette-gold" x2=".4" y2="1"><stop stop-color="#ffe49a"/><stop offset="1" stop-color="#b67b31"/></linearGradient></defs><path d="M15 60C-8 41 14 16 42 8C69-3 102 14 95 33C91 45 71 38 65 49C61 56 64 68 49 71C32 75 21 71 15 60Z" fill="url(#palette-gold)" stroke="#42270b" stroke-width="3"/><g stroke="#805025" stroke-width="2"><ellipse cx="27" cy="36" rx="8" ry="6" fill="#347258"/><ellipse cx="44" cy="23" rx="8" ry="6" fill="#b84f28"/><ellipse cx="65" cy="18" rx="8" ry="6" fill="#59478d"/><ellipse cx="82" cy="29" rx="7" ry="6" fill="#994235"/><ellipse cx="36" cy="56" rx="9" ry="7" fill="#072f40"/></g>';
      u.el('span', 'ct', th, 'Color Quest');
      u.el('span', 'cs', th, 'Observe  •  Compare  •  Choose');
      Object.assign(_c, { app, center, toolbar: th, header: center });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('brief');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.center;
      _c.util.el('aside', 'aside', document.body);
      _c.footer = _c.util.el('footer', 'bottom', _c.app);
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) panel.classList.add('brief');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('brief');
        _c.center.insertBefore(note, _c.stage);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.footer.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.footer.appendChild(dock);
    },
    overlay: () => (ctx) => {
      if (ctx.kind === 'banner') return announcement(ctx);
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body);
      const messages = {
        cookie: 'This application stores preferences on your device.',
        toast: 'Your workspace has been synced.',
        chat: 'Need help with this exercise?',
        promo: 'Try the new practice collection.',
      };
      u.el('span', '', el, messages[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Dismiss');
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  };
  env.site({
    name: C.site,
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    initialOverlay: { kind: 'banner' },
    design: {
      THEMES: { 'design-read-figure-color-11': palette },
      LOW_THEME: palette,
      ACCENTS: ['#061552'],
      LOW_ACCENTS: ['#061552'],
      parts,
    },
  });
})();
