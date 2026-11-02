(function () {
  'use strict';
  const palette = { bg: '#f7f4eb', panel: '#faf8ef', fg: '#000', muted: '#444', line: '#000' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
      document.body.classList.toggle('has-instruction-toast', _c.display === 'toast');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('design', 'lisa');
      document.documentElement.style.setProperty('--font', 'Georgia, "Times New Roman", serif');
      const shell = u.el('div', 'lisa-shell', document.body);
      const bar = u.el('header', 'lisa-menubar', shell);
      const ap = u.svg('svg', { class: 'lisa-apple', width: 22, height: 24, viewBox: '0 0 22 24' }, bar);
      u.svg('path', {
        d: 'M11 7C9 5.5 4 5.5 3.5 11C3 16 6.5 21 8.5 21C9.5 21 10 20.3 11 20.3C12 20.3 12.5 21 13.5 21C15.5 21 18.5 16.5 18.5 14C16 13 15.5 9.5 18 8C16.5 6 13 5.7 11 7ZM11 6C11 3.5 12.5 2 14.5 1.5C14.5 4 13 5.5 11 6Z',
        fill: '#000',
      }, ap);
      for (const m of ['File', 'Edit', 'Paper', 'Special', 'Help']) u.el('span', 'lisa-menu', bar, m);
      u.el('span', 'lisa-spacer', bar);
      const ic = u.svg('svg', { class: 'lisa-icon', width: 30, height: 30, viewBox: '0 0 30 30' }, bar);
      u.svg('rect', { x: 1.5, y: 1.5, width: 27, height: 27, rx: 3, fill: 'none', stroke: '#000', 'stroke-width': 2 }, ic);
      u.svg('path', {
        d: 'M9 24L11 15L16 12L18 5L22 6L20 12L24 10M10 8L13 11L9 15M13 17L17 14L20 17L19 24M15 6L16 9M7 18L9 21M21 20L23 23',
        fill: 'none', stroke: '#000', 'stroke-width': 1.5,
      }, ic);
      u.svg('path', { d: 'M12 4L14 5L13 8L11 7ZM17 10L20 9L20 13L17 14Z', fill: '#000' }, ic);
      u.el('span', 'lisa-clock', bar, '10:24 AM');
      const content = u.el('div', 'lisa-content', shell);
      const note = u.el('section', 'task-note', content);
      note.hidden = _c.display === 'hidden';
      note.classList.toggle('instruction-panel', _c.display === 'panel');
      note.classList.toggle('instruction-toast', _c.display === 'toast');
      Object.assign(_c, { shell, bar, content, header: note });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('instruction');
    },
    'frame.tools': (base) => (_c) => {
      const h = _c.header;
      _c.header = _c.bar;
      base(_c);
      _c.header = h;
    },
    'frame.body': () => (_c) => { _c.body = _c.content; },
    'frame.panel': (base) => (_c) => {
      const b = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = b;
      const text = _c.header.querySelector('.ref-panel-text');
      if (text) text.classList.add('instruction');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.body);
      _c.stage.dataset.role = 'stage';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        _c.header.appendChild(note);
        note.querySelector('.ref-note-text').classList.add('instruction');
      }
    },
    'frame.footer': (base) => (_c) => {
      const u = _c.util;
      const footer = u.el('footer', 'footer', _c.shell);
      const mk = (cls, name, path, sel) => {
        const w = u.el('div', 'lisa-tool', footer);
        const bt = u.el('button', cls + (sel ? ' selected' : ''), w);
        bt.type = 'button';
        const s = u.svg('svg', { width: 44, height: 40, viewBox: '0 0 44 40', fill: 'none', stroke: '#000', 'stroke-width': 2.2, 'stroke-linejoin': 'round' }, bt);
        u.svg('path', { d: path }, s);
        u.el('span', '', w, name);
        return bt;
      };
      const pencil = mk('pencil', 'Pencil', 'M10 35L13 25L31 5Q33 3 35 5L39 9Q40 10 38 12L20 31ZM13 25L20 31M29 7L36 14M16 26L33 9M11 34L15 32L13 29Z', true);
      u.svg('path', { d: 'M10 35L15 33L12 30Z', fill: '#000', stroke: 'none' }, pencil.querySelector('svg'));
      const clr = mk('clear', 'Clear', 'M8 25L24 7L34 7L37 11L37 18L21 34L12 34L8 30ZM8 25H21L37 11M21 25V34M8 25V30L12 34', false);
      clr.onclick = () => { env.widgetDef.clear?.(); };
      u.el('span', 'lisa-spacer', footer);
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      footer.appendChild(foot);
      _c.footer = footer;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.footer.appendChild(dock);
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
      u.el('h3', '', box, title);
      u.el('p', '', box, text);
      const dismiss = u.el('button', 'dismiss', box, kind === 'cookie' ? 'Reject optional' : 'Close');
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
    name: 'design-draw-shape-circle-05',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: { THEMES: { site: palette }, LOW_THEME: palette, ACCENTS: ['#000'], LOW_ACCENTS: ['#000'], parts },
  });
})();
