(function () {
  'use strict';
  const palette = { bg: '#fdf9f1', panel: '#e6e4fa', fg: '#0c1230', muted: '#5a5f7a', line: '#2a3558' };

  // Format only the text already drawn by the template's instruction sections.
  function formatNote(note) {
    if (!note) return;
    const text = note.textContent;
    const q = text.indexOf('? '), comma = text.indexOf(', then ');
    const split = q > 0 ? q : comma;
    note.textContent = '';
    const b = document.createElement('b');
    b.textContent = split > 0 ? text.slice(0, split + 1) : text;
    note.appendChild(b);
    if (split > 0) {
      const span = document.createElement('span');
      span.textContent = text.slice(split + 2);
      note.appendChild(span);
    }
  }

  function drawDecor(u, center) {
    const decor = u.svg('svg', {
      class: 'memphis-art', viewBox: '0 0 1672 818', preserveAspectRatio: 'none', 'aria-hidden': 'true',
    }, center);
    u.svg('circle', { cx: 38, cy: -10, r: 118, fill: '#e6b1f0' }, decor);
    u.svg('path', { d: 'M0 529L217 818H0Z', fill: '#dfc8f6' }, decor);
    u.svg('circle', { cx: 1644, cy: 848, r: 114, fill: '#e3c3f5' }, decor);
    u.svg('path', {
      d: 'M1572 38L1579 60Q1581 65 1588 60L1601 51Q1607 48 1611 59L1618 72Q1620 76 1627 70L1638 62Q1643 58 1646 70L1651 84',
      fill: 'none', stroke: '#dfb7f1', 'stroke-width': 11,
      'stroke-linecap': 'round', 'stroke-linejoin': 'round',
    }, decor);
    for (const [x, y] of [[82, 136], [117, 151], [51, 185], [89, 201]]) {
      u.svg('path', {
        d: `M${x} ${y}l-18 21`, stroke: '#ff8c86', 'stroke-width': 12, 'stroke-linecap': 'round',
      }, decor);
    }
    for (let x = 0; x < 4; x++)
      for (let y = 0; y < 4; y++)
        u.svg('circle', { cx: 41 + x * 29, cy: 660 + y * 30, r: 5, fill: '#7f7fa8' }, decor);
    for (let x = 0; x < 3; x++)
      for (let y = 0; y < 5; y++)
        u.svg('circle', { cx: 1618 + x * 24, cy: 669 + y * 26, r: 5, fill: '#ff7b7d' }, decor);
  }

  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // Every note mode uses the original dedicated space above the shape.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.className = 'memphis twin-pane instruction-' + _c.display;
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      u.el('span', 'brand', top, 'Shape Spotter');
      u.el('small', '', top, 'Small shapes. Big thinking.');
      u.el('i', 'dot', top);
      const center = u.el('div', 'center', app);
      const left = u.el('div', 'leftpane', center);
      const right = u.el('div', 'rightpane', center);
      u.el('div', 'prompt', right, 'Choose the name of the shape:');
      u.el('div', 'optslot', right);
      drawDecor(u, center);
      const aside = u.el('aside', 'aside', document.body);
      u.el('b', '', aside, 'Shape Identification');
      Object.assign(_c, { app, top, left, right, center, header: top });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.left;
      base(_c);
      _c.header = header;
      const note = _c.left.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('brief');
        formatNote(note);
      }
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
      if (_c.headerTools.childElementCount) _c.top.classList.add('has-tools');
    },
    'frame.body': () => (_c) => { _c.body = _c.center; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.left;
      base(_c);
      _c.body = body;
      const panel = _c.left.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('brief');
        formatNote(panel.querySelector('.ref-panel-text'));
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.left);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('brief');
        formatNote(note.querySelector('.ref-note-text'));
        _c.left.insertBefore(note, _c.stage);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const footer = document.body.querySelector('.ref-foot');
      footer.classList.add('bottom');
      _c.app.appendChild(footer);
      footer.querySelector('.ref-foot-text').textContent = 'Learn  •  Practice  •  Grow';
      _c.util.el('span', 'bottom-motto', footer, 'Shapes make a brighter day');
      _c.footer = footer;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.right.appendChild(dock);
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
    name: 'design-read-figure-identify-10',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-read-figure-identify-10': palette },
      LOW_THEME: palette,
      ACCENTS: ['#ff7470'],
      LOW_ACCENTS: ['#ff7470'],
      parts,
    },
  });
})();
