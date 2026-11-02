(function () {
  'use strict';
  const palette = { bg: '#f7f5ef', panel: '#ffffff', fg: '#171717', muted: '#777777', line: '#aaa69d' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      document.body.className = 'aero utility instruction-' + _c.display;
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      u.el('span', '', top, 'Map Skills Tutor');
      u.el('nav', 'menu', top, 'Home\nCoordinate Practice\nQuizzes\nProgress\nHelp');
      const center = u.el('div', 'center', app);
      const header = u.el('div', 'instruction-slot', center);
      const toolbar = u.el('div', 'toolbar', top);
      Object.assign(_c, { app, center, header, toolbar });
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
      const u = _c.util;
      const aside = u.el('aside', 'aside', document.body);
      u.el('b', '', aside, 'Your Task');
      const panelSlot = u.el('div', 'panel-slot', aside);
      Object.assign(_c, { aside, panelSlot, body: _c.center });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.panelSlot;
      base(_c);
      _c.body = body;
      const u = _c.util;
      const reminder = u.el('div', 'aside-copy', _c.aside);
      const list = u.el('ul', '', reminder);
      u.el('b', '', reminder, 'Remember:');
      [
        'The first number is the x-coordinate (horizontal).',
        'The second number is the y-coordinate (vertical).',
        'The origin is (0, 0).',
        'Negative coordinates are shown on the axes.',
      ].forEach((text) => u.el('li', '', list, text));
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.aside.appendChild(note);
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
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body),
        box = u.el('div', 'tip-box', el),
        head = u.el('div', 'tip-head', box);
      u.el('span', 'tip-bulb', head, '💡');
      u.el('strong', '', head, 'Tip of the day');
      const x = u.el('button', 'tip-x', head, '×');
      x.type = 'button';
      x.addEventListener('click', ctx.dismiss);
      u.el(
        'p',
        'tip-copy',
        box,
        'An ordered pair (x, y) tells you to move horizontally first (x), then vertically (y) from the origin.',
      );
      const foot = u.el('div', 'tip-foot', box),
        check = u.el('label', 'tip-check', foot),
        input = u.el('input', '', check);
      input.type = 'checkbox';
      u.el('span', '', check, 'Do not show again');
      const dismiss = u.el('button', 'tip-close', foot, 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-read-figure-grid-11',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    initialOverlay: { kind: 'banner' },
    design: {
      THEMES: { 'design-read-figure-grid-11': palette },
      LOW_THEME: palette,
      ACCENTS: ['#b71f24'],
      LOW_ACCENTS: ['#b71f24'],
      parts,
    },
  });
})();
