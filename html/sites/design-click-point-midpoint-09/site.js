(function () {
  'use strict';
  const palette = {
    bg: '#f4f8f6', panel: '#f3f9f7', fg: '#1c2a24',
    muted: '#5d6d65', line: '#c9d8d0',
  };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('design', 'geo');
      _c.root.style.setProperty('--font', 'Arial, "Helvetica Neue", "Segoe UI", sans-serif');
      const shell = u.el('div', 'shell', document.body);
      const top = u.el('header', 'topbar', shell);
      u.el('div', 'brand', top, 'GeoPractice');
      const nav = u.el('nav', 'topnav', top);
      ['Geometry', 'Plot', 'Activities'].forEach((t, i) => {
        if (i) u.el('i', '', nav, '|');
        u.el('span', '', nav, t);
      });
      u.el('div', 'spacer', top);
      u.el('div', 'lesson', top, 'Lesson 3: Midpoints');
      u.el('i', 'sep', top, '|');
      const user = u.el('div', 'user', top, 'Student ');
      const caret = u.svg('svg', { width: 14, height: 10, viewBox: '0 0 14 10' }, user);
      u.svg('path', { d: 'M0 1H14L7 9Z', fill: '#e8f2ee' }, caret);
      const tabs = u.el('div', 'tabs', shell);
      for (let i = 1; i <= 5; i++) {
        const t = u.el('button', 'tab' + (i === 3 ? ' on' : ''), tabs, String(i));
        t.type = 'button';
        t.onclick = () => {
          tabs.querySelectorAll('.tab').forEach((x) => x.classList.remove('on'));
          t.classList.add('on');
        };
      }
      const content = u.el('div', 'content', shell);
      const doc = u.el('section', 'doc', content);
      const toolbar = u.el('div', 'doc-bar', doc, 'Coordinate Plane');
      const aside = u.el('aside', 'margin', content);
      const noteHost = u.el('section', 'task-card', aside);
      noteHost.hidden = _c.display !== 'header' && _c.display !== 'panel';
      if (_c.display === 'header') u.el('div', 'note-label', noteHost, 'Task');
      u.el('hr', '', aside);
      u.el('div', 'actions-label', aside, 'Actions');
      const r1 = u.el('div', 'act', aside);
      const i1 = u.svg('svg', {
        width: 30, height: 40, viewBox: '0 0 30 40', fill: 'none',
        stroke: '#29363d', 'stroke-width': 2, 'stroke-linejoin': 'miter',
      }, r1);
      u.svg('path', { d: 'M6 3V32L13 25L18 36L17 23H26Z', fill: '#f8fafb' }, i1);
      u.svg('path', { d: 'M6 3L17 23L13 25L6 32Z', fill: '#29363d' }, i1);
      u.el('span', '', r1, 'Click on the graph to place a point.');
      const r2 = u.el('div', 'act', aside);
      const i2 = u.svg('svg', {
        width: 30, height: 40, viewBox: '0 0 30 40', fill: 'none',
        stroke: '#29363d', 'stroke-width': 2, 'stroke-linejoin': 'round',
      }, r2);
      u.svg('path', { d: 'M2 9H28M9 9L10 5H20L21 9M4 9L5 36H25L26 9M11 14V31M19 14V31' }, i2);
      u.el('span', '', r2, 'Use Clear to remove your point and try again.');
      u.el('div', 'grow', aside);
      const btns = u.el('div', 'btns', aside);
      const clear = u.el('button', 'clear', btns, 'Clear');
      clear.type = 'button';
      clear.onclick = () => { env.widgetDef.clear?.(); };
      Object.assign(_c, { shell, content, doc, aside, noteHost, btns, header: toolbar });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.noteHost;
      base(_c);
      _c.header = header;
    },
    'frame.tools': (base) => (_c) => { base(_c); },
    'frame.body': () => (_c) => { _c.body = _c.content; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.noteHost;
      base(_c);
      _c.body = body;
      const title = _c.noteHost.querySelector('.ref-panel-title');
      if (title) title.textContent = 'Task';
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.doc);
      _c.stage.dataset.role = 'stage';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.shell.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.btns.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.btns.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        kind = ctx.kind;
      const el = u.el('section', 'obstruction obstruction-' + kind, document.body);
      el.dataset.role = 'overlay';
      const box = u.el('div', 'obstruction-box', el);
      const title = {
        cookie: 'Your privacy',
        toast: 'Changes saved',
        chat: 'Support',
        promo: 'Workspace update',
        banner: 'Service notice',
      }[kind];
      const text = {
        cookie: 'This application stores optional cookies.',
        toast: 'Your changes have been saved.',
        chat: 'Need a hand with this workspace?',
        promo: 'Explore the latest workspace features.',
        banner: 'You are viewing a shared workspace.',
      }[kind];
      const label = kind === 'cookie' ? 'Reject optional' : 'Close';
      u.el('h3', '', box, title);
      u.el('p', '', box, text);
      const dismiss = u.el('button', 'dismiss', box, label);
      dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('close');
      if (kind === 'cookie') {
        const accept = u.el('button', 'dismiss', box, 'Accept optional');
        accept.onclick = () => ctx.dismiss('accept');
      }
      return { el, dismiss, ttlSteps: kind === 'toast' ? 5 : 0 };
    },
  };
  env.site({
    name: 'design-click-point-midpoint-09',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: ['#1f5a41'], LOW_ACCENTS: ['#1f5a41'], parts,
    },
  });
})();
