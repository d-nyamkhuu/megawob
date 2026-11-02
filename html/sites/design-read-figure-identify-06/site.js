(function () {
  'use strict';
  const palette = { bg: '#f5f6f8', panel: '#f8f9fb', fg: '#030a20', muted: '#728299', line: '#e1e5ec' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util, B = document.body;
      B.classList.add('kin', 'kinetic', 'instruction-' + _c.display);
      const left = u.el('aside', 'k-left', B);
      const logo = u.el('div', 'k-logo', left);
      u.el('span', '', logo, 'FRAME');
      u.el('span', '', logo, 'QUIZ');
      u.el('i', 'k-bar', left);
      const set = u.el('div', 'k-tool k-settings', left);
      const g = u.svg('svg', { width: 30, height: 30, viewBox: '0 0 24 24' }, set);
      u.svg('path', {
        d: 'M10 1h4l.7 3 2 .9 2.7-1.4 2 3.4-2.1 2.1.2 2.3 2.5 1.8-1.3 3.8-3.1-.3-1.6 1.6-.3 3.1h-4l-.8-2.8-2.1-.8-2.7 1.4-2.4-3.2 2-2.4-.2-2.2L1 10.7l1.4-3.8 3.1.2L7 5.4 7.2 2z M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10',
        fill: '#728299', 'fill-rule': 'evenodd',
      }, g);
      u.el('span', '', set, 'Settings');
      const right = u.el('aside', 'k-right', B);
      u.el('small', '', right, 'TIME');
      u.el('b', '', right, '00:28');
      const ring = u.svg('svg', { width: 72, height: 72, viewBox: '0 0 72 72', class: 'k-ring' }, right);
      u.svg('circle', { cx: 36, cy: 36, r: 28, fill: 'none', stroke: '#dfe3ea', 'stroke-width': 5 }, ring);
      u.svg('path', { d: 'M36 8a28 28 0 0 1 28 28', fill: 'none', stroke: '#0a47f5', 'stroke-width': 5 }, ring);
      const help = u.el('div', 'k-tool k-help', right);
      const h = u.svg('svg', { width: 32, height: 32, viewBox: '0 0 24 24' }, help);
      u.svg('circle', { cx: 12, cy: 12, r: 10, fill: 'none', stroke: '#5b6678', 'stroke-width': 1.5 }, h);
      const q = u.svg('text', { x: 12, y: 17, 'text-anchor': 'middle', 'font-size': 14, fill: '#5b6678' }, h);
      q.textContent = '?';
      u.el('span', '', help, 'Help');
      const app = u.el('main', 'app', B);
      const top = u.el('header', 'top k-top', app);
      u.el('span', 'k-kicker', top, 'VISUAL RECOGNITION');
      const pr = u.el('div', 'k-prog', top);
      u.el('span', '', pr, '1 / 10');
      const tr = u.el('i', '', pr);
      u.el('b', '', tr);
      const center = u.el('div', 'center', app);
      const brief = u.el('div', 'brief', center);
      Object.assign(_c, { app, top, center, header: brief });
    },
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (!note) return;
      const t = note.textContent || '';
      let m = t.match(/^(.*?[?!])\s+(.*)$/) || t.match(/^(.*?,)\s+(.*)$/);
      if (!m || m[1].length < t.length * 0.25) {
        const spaces = Array.from(t.matchAll(/\s+/g), (x) => x.index);
        const half = spaces.reduce((a, b) => Math.abs(b - t.length / 2) < Math.abs(a - t.length / 2) ? b : a, 0);
        m = ['', t.slice(0, half), t.slice(half).trim()];
      }
      note.textContent = '';
      _c.util.el('span', 'k-l1', note, m[1]);
      if (m[2]) _c.util.el('span', 'k-l2', note, m[2]);
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.top;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.center; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        _c.app.appendChild(note);
        _c.util.el('small', 'k-note-title', note, 'TASK NOTE');
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('bottom');
      _c.app.appendChild(foot);
      _c.foot = foot;
      _c.header.querySelectorAll('.ref-instruction span').forEach((e) => {
        e.style.transform = 'scaleX(' + Math.min(0.65, _c.app.clientWidth / e.scrollWidth) + ')';
      });
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) document.body.querySelector('.k-right').appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body);
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
    name: 'design-read-figure-identify-06',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'templates/site/css/read-figure-identify-05a342.css', 'kinetic.css', 'site.css'],
    design: {
      THEMES: { 'design-read-figure-identify-06': palette },
      LOW_THEME: palette,
      ACCENTS: ['#0645ff'],
      LOW_ACCENTS: ['#0645ff'],
      parts,
    },
  });
})();
