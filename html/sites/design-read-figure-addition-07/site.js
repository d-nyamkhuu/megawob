(function () {
  'use strict';
  const palette = { bg: '#eaf0f4', panel: '#ffffff', fg: '#172435', muted: '#60666c', line: '#d7e0e7' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The inspector and inline notification fit all of this design's viewports.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.className = 'fluent workbench instruction-' + _c.display;
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      const icon = u.svg('svg', { width: 26, height: 26, viewBox: '0 0 26 26', class: 'title-icon' }, top);
      u.svg('rect', { x: 3, y: 2, width: 20, height: 22, rx: 5, fill: '#1688c9' }, icon);
      u.svg('circle', { cx: 13, cy: 13, r: 5, fill: '#f4a623' }, icon);
      u.el('span', '', top, 'Math Practice');
      const wc = u.el('div', 'native-window-controls', top);
      for (const kind of ['min', 'max', 'close']) {
        const svg = u.svg('svg', { width: 20, height: 20, viewBox: '0 0 20 20' }, wc);
        u.svg('path', {
          d: kind === 'min' ? 'M3 12h14' : kind === 'max' ? 'M4 4h12v12H4z' : 'M4 4l12 12M16 4L4 16',
          fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5,
        }, svg);
      }
      const center = u.el('div', 'center', app);
      Object.assign(_c, { app, top, center, header: top });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.center;
      base(_c);
      _c.header = header;
      const note = _c.center.querySelector('.ref-instruction');
      if (note) note.classList.add('brief');
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const aside = u.el('aside', 'aside', document.body);
      u.el('b', '', aside, 'Task Details');
      const details = u.el('div', 'details', aside);
      [
        ['Operation', 'Addition'],
        ['Block type', 'Unit blocks'],
        ['Groups', '2'],
        ['View', 'Practice workspace'],
      ].forEach(([k, v]) => {
        const row = u.el('div', 'detail-row', details);
        u.el('span', '', row, k);
        u.el('span', '', row, v);
      });
      Object.assign(_c, { body: _c.center, aside });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.aside;
      base(_c);
      _c.body = body;
      const u = _c.util, aside = _c.aside;
      u.el('div', 'inspector-rule', aside);
      u.el('h2', '', aside, 'Visual Key');
      const key = u.el('div', 'visual-key', aside);
      u.el('span', 'key-cube', key);
      u.el('span', '', key, '= 1 block');
      const tip = u.el('div', 'inspector-tip', aside);
      u.el('span', 'info-icon', tip, 'i');
      u.el('span', '', tip, 'Your workspace is ready for practice.');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('brief', 'toast-note');
        _c.center.insertBefore(note, _c.stage);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        foot.classList.add('fluent-action-strip');
        _c.app.appendChild(foot);
      }
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
    },
    'frame.end': (base) => (_c) => {
      const result = base(_c);
      // The shared widget reparents the control during its synchronous setup.
      // Restore the template slot at the end of setup, before the first action.
      const button = result.submit;
      if (button) {
        const parent = button.parentNode;
        queueMicrotask(() => {
          button.classList.remove('in-scene');
          parent.appendChild(button);
        });
      }
      return result;
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
    name: 'design-read-figure-addition-07',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-read-figure-addition-07': palette },
      LOW_THEME: palette,
      ACCENTS: ['#1676d2'],
      LOW_ACCENTS: ['#1676d2'],
      parts,
    },
  });
})();
