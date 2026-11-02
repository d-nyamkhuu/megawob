(function () {
  'use strict';
  const palette = { bg: '#26732b', panel: '#cecece', fg: '#000000', muted: '#555555', line: '#000000' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      document.body.className = 'atari board instruction-' + _c.ctx.display + ' note-' + _c.display;
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      u.el('span', 'window-gadget', top, '−');
      u.el('span', '', top, 'Shape Counter');
      const center = u.el('div', 'center', app);
      Object.assign(_c, { app, top, center, header: center });
    },
    'frame.nav': () => (_c) => {
      const u = _c.util;
      const mb = u.el('div', 'menubar', document.body);
      const logo = u.svg('svg', { viewBox: '0 0 32 30', class: 'mb-logo' }, mb);
      u.svg('path', { d: 'M12 1h8v10c0 8 4 13 11 17h-6c-5-3-8-7-9-12-1 5-4 9-9 12H1c7-4 11-9 11-17zM14 0h4v29h-4z', fill: '#000' }, logo);
      ['Desk', 'File', 'Edit', 'Options', 'Help'].forEach((t) => u.el('span', 'mb-item', mb, t));
      u.el('span', 'mb-clock', mb, 'Mon 27 Jan 1986   10:14');
      const dt = u.el('div', 'desk-icons', document.body);
      const disk = u.el('div', 'di-disk', dt);
      const ds = u.svg('svg', { viewBox: '0 0 50 48' }, disk);
      u.svg('path', { d: 'M5 2h36l5 5v38H3V6z', fill: '#080808', stroke: '#000', 'stroke-width': 2 }, ds);
      u.svg('path', { d: 'M14 3h22v13H14zM10 25h29v18H10z', fill: '#eee' }, ds);
      u.svg('path', { d: 'M29 4h5v10h-5zM14 28h7v12h-7z', fill: '#222' }, ds);
      u.el('span', '', disk, 'A:' + String.fromCharCode(92));
      const trash = u.el('div', 'di-trash', dt);
      const ts = u.svg('svg', { viewBox: '0 0 50 48' }, trash);
      u.svg('path', {
        d: 'M10 9l3 33q12 8 25 0l3-33M8 8q17-8 35 0v5q-17 6-35 0zM19 4V1h13v3M17 17l1 23M24 17v25M31 17v25M37 16l-1 24',
        fill: '#ddd', stroke: '#111', 'stroke-width': 2.5,
      }, ts);
      u.el('span', '', trash, 'TRASH');
    },
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('brief');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.top;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.center; },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) panel.classList.add('brief');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.center);
      const note = _c.center.querySelector('.ref-instruction');
      _c.stage.style.top = note ? note.offsetHeight + 'px' : '0';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('brief');
        _c.center.insertBefore(note, _c.stage);
        _c.stage.style.top = note.offsetHeight + 'px';
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('bottom');
      _c.app.appendChild(foot);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      if (ctx.initial) {
        const aside = u.el('aside', 'aside survey-overlay', document.body);
        const tb = u.el('div', 'aside-title', aside);
        u.el('span', 'gadget', tb, '↵');
        u.el('span', '', tb, 'Quick Survey');
        u.el('span', 'gadget x', tb, '✕');
        const ab = u.el('div', 'aside-body', aside);
        u.el('p', 'aside-help', ab, 'Help us improve\nShape Counter!');
        u.el('p', 'q', ab, '1. How easy was this task?');
        ['Very easy', 'Easy', 'Neither', 'Difficult', 'Very difficult'].forEach((t) => {
          const r = u.el('div', 'opt', ab);
          u.el('i', 'radio', r);
          u.el('span', '', r, t);
        });
        u.el('p', 'q', ab, '2. Any comments? (optional)');
        u.el('div', 'comments', ab);
        const cs = u.el('button', 'close-survey', ab, 'Close survey');
        cs.type = 'button';
        cs.addEventListener('click', ctx.dismiss);
        const close = tb.querySelector('.x');
        close.setAttribute('role', 'button');
        close.setAttribute('aria-label', 'Close survey');
        close.tabIndex = 0;
        close.addEventListener('click', ctx.dismiss);
        close.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            ctx.dismiss();
          }
        });
        return { el: aside, dismiss: cs };
      }
      const el = u.el('div', 'overlay ' + ctx.kind, document.body);
      const messages = {
        cookie: 'This application stores preferences on your device.',
        toast: 'Your workspace has been synced.',
        chat: 'Need help with this exercise?',
        promo: 'Try the new practice collection.',
        banner: 'An updated practice collection is available.',
      };
      u.el('span', '', el, messages[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Dismiss');
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-read-figure-count-11',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    initialOverlay: { kind: 'promo' },
    design: {
      THEMES: { 'design-read-figure-count-11': palette },
      LOW_THEME: palette,
      ACCENTS: ['#000000'],
      LOW_ACCENTS: ['#000000'],
      parts,
    },
  });
})();
