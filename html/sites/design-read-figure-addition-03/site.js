(function () {
  'use strict';
  const palette = { bg: '#c7cbce', panel: '#fff', fg: '#111820', muted: '#687178', line: '#687178' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // This window reserves the same note row in every display mode.
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
      document.body.classList.add('electron', 'stagger', 'instruction-' + _c.display);
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      const icon = u.svg('svg', { width: 26, height: 26, viewBox: '0 0 26 26', class: 'title-icon' }, top);
      u.svg('rect', { x: 3, y: 2, width: 20, height: 22, rx: 3, fill: '#ee8520', stroke: 'currentColor', 'stroke-width': 1.5 }, icon);
      u.svg('path', { d: 'M7 7h12M7 11h12M7 15h12M7 19h9', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5 }, icon);
      u.el('span', '', top, 'Math Practice');
      const wc = u.el('div', 'native-window-controls', top);
      for (const kind of ['min', 'max', 'close']) {
        const svg = u.svg('svg', { width: 20, height: 20, viewBox: '0 0 20 20' }, wc);
        u.svg('path', { d: kind === 'min' ? 'M3 12h14' : kind === 'max' ? 'M4 4h12v12H4z' : 'M4 4l12 12M16 4L4 16', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5 }, svg);
      }
      u.el('nav', 'menu', top, 'File      Edit      View      Tools      Help');
      const center = u.el('div', 'center', app);
      const noteSlot = u.el('div', 'note-slot', center);
      const aside = u.el('aside', 'aside', document.body);
      u.el('b', '', aside, 'Notes');
      u.el('p', 'aside-copy', aside, '1\n2\n3\n4\n5\n6\n7\n8\n9\n10');
      Object.assign(_c, { app, top, center, noteSlot, header: noteSlot });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.noteSlot.querySelector('.ref-instruction');
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
      const body = _c.body;
      _c.body = _c.noteSlot;
      base(_c);
      _c.body = body;
      const panel = _c.noteSlot.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('brief');
        panel.setAttribute('aria-label', 'Task instructions');
      }
    },
    'frame.stage': () => (_c) => { _c.stage = _c.util.el('section', 'stage', _c.center); },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('brief');
        _c.noteSlot.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      _c.center.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
    },
    'frame.end': (base) => (_c) => {
      const frame = base(_c);
      if (!_c.submit) return frame;
      // Addition moves the returned end element into its scene. Move the entire
      // template footer or floating group, keeping its controls together.
      const group = _c.submit.closest('.ref-foot, .ref-float-dock');
      if (group) {
        group.classList.add('site-end-group');
        group.classList.toggle('site-end-link', _c.placement === 'link');
        group.setAttribute('aria-label', _c.label);
        return { ...frame, submit: group };
      }
      _c.submit.classList.add('site-end-header');
      return frame;
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
    name: 'design-read-figure-addition-03',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-read-figure-addition-03': palette },
      LOW_THEME: palette,
      ACCENTS: ['#5794d4'],
      LOW_ACCENTS: ['#5794d4'],
      parts,
    },
  });
})();
