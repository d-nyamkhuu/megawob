(function () {
  'use strict';
  const palette = { bg: '#aaa9a9', panel: '#b9b8b8', fg: '#080b14', muted: '#555555', line: '#11131b' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      document.body.className = 'directory stagger instruction-' + _c.display;
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
      const icon = u.svg('svg', { width: 30, height: 30, viewBox: '0 0 30 30', class: 'title-icon' }, top);
      u.svg('rect', { x: 2, y: 2, width: 26, height: 26, fill: '#eee', stroke: '#222', 'stroke-width': 2 }, icon);
      u.svg('path', { d: 'M2 2h13v13H2zM15 15h13v13H15z', fill: '#d22' }, icon);
      u.el('span', '', top, 'Amiga Workbench');
      u.el('span', 'workbench-clock', top, 'Mon  Apr 22 1996 10:24');
      const toolbar = u.el('div', 'window-title', app, 'Number Card Challenge');
      const center = u.el('div', 'center', app);
      const aside = u.el('aside', 'aside', document.body);
      u.el('b', '', aside, 'Answer');
      Object.assign(_c, { app, toolbar, center, aside, header: center });
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
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.aside;
      base(_c);
      _c.body = body;
      const panel = _c.aside.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('wb-task-panel');
        panel.querySelector('.ref-panel-title').textContent = 'Task';
      }
      const selected = _c.util.el('p', 'aside-copy', _c.aside, '');
      selected.setAttribute('data-selected', 'None');
      _c.selected = selected;
    },
    'frame.stage': () => (_c) => {
      const stage = _c.util.el('section', 'stage', _c.center);
      stage.addEventListener('click', (event) => {
        const card = event.target.closest('.number-card');
        if (card) _c.selected.setAttribute('data-selected', card.textContent.trim());
      });
      _c.stage = stage;
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('wb-toast');
        _c.center.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        foot.classList.add('bottom');
        _c.aside.appendChild(foot);
        for (const button of foot.querySelectorAll('.ref-xtra')) _c.headerTools.appendChild(button);
      }
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.aside.appendChild(dock);
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
    name: 'design-read-figure-greatest-10',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#f17b20'],
      LOW_ACCENTS: ['#f17b20'],
      parts,
    },
  });
})();
