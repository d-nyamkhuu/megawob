(function () {
  'use strict';
  const palette = { bg: '#fff', panel: '#fff', fg: '#222a33', muted: '#5d6670', line: '#c3c8ce' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // This design has dedicated panel and toast locations at every viewport.
      _c.display = _c.ctx.display || 'header';
      document.body.className = 'design sketch' +
        (_c.display === 'toast' ? ' has-instruction-toast' : '') +
        (_c.display === 'panel' ? ' has-instruction-panel' : '');
      _c.root.style.setProperty('--font', '"Helvetica Neue",Helvetica,Arial,sans-serif');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const shell = u.el('div', 'sk-shell', document.body);
      const nav = u.el('header', 'sk-nav', shell);
      u.el('div', 'sk-brand', nav, 'Sketch Task');
      const links = u.el('nav', 'sk-links', nav);
      for (const t of ['Home', 'Tasks', 'Help']) {
        const a = u.el('a', 'sk-link' + (t === 'Tasks' ? ' active' : ''), links, t);
        a.href = '#';
        a.onclick = (ev) => ev.preventDefault();
      }
      const user = u.el('div', 'sk-user', nav, 'User');
      u.el('span', 'sk-caret', user);
      const content = u.el('div', 'sk-content', shell);
      Object.assign(_c, { shell, toolbar: nav, content, header: content });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('task-note', 'sk-note');
        const text = _c.util.el('div', 'instruction');
        text.textContent = note.textContent;
        note.replaceChildren(text);
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.content; },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const note = _c.body.querySelector('.ref-panel');
      if (note) {
        note.classList.add('task-note', 'sk-note', 'instruction-panel');
        note.querySelector('.ref-panel-title').classList.add('sk-panel-title');
        note.querySelector('.ref-panel-text').classList.add('instruction');
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.body);
      _c.stage.dataset.role = 'stage';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('task-note', 'sk-note', 'instruction-toast');
        note.querySelector('.ref-note-text').classList.add('instruction');
        note.querySelector('.ref-note-x').classList.add('note-close');
        _c.content.insertBefore(note, _c.stage);
      }
    },
    'frame.footer': (base) => (_c) => {
      const u = _c.util;
      const dock = u.el('footer', 'sk-dock', _c.shell);
      u.el('span', 'sk-toollabel', dock, 'Tool:');
      const pen = u.el('button', 'sk-btn sk-pen', dock);
      pen.type = 'button';
      pen.setAttribute('aria-pressed', 'true');
      const pi = u.svg('svg', { width: 36, height: 36, viewBox: '0 0 36 36' }, pen);
      u.svg('path', { d: 'M3 33l3-11 18-18q2-2 4 0l4 4q2 2 0 4L14 30z', fill: '#080b0d' }, pi);
      u.svg('path', { d: 'M6 22l8 8M21 7l8 8M9 23l13-13', fill: 'none', stroke: '#d3dce4', 'stroke-width': 1.5 }, pi);
      u.svg('path', { d: 'M4 32l3-8 5 5z', fill: '#d3dce4' }, pi);
      u.svg('path', { d: 'M4 32l1-4 3 3z', fill: '#080b0d' }, pi);
      u.el('span', '', pen, 'Freehand Pencil');
      const clr = u.el('button', 'sk-btn clear', dock);
      clr.type = 'button';
      const ei = u.svg('svg', { width: 36, height: 36, viewBox: '0 0 36 36' }, clr);
      u.svg('path', { d: 'M3 23L22 4q2-2 4 0l8 8q2 2 0 4L17 33H11z', fill: '#68727e' }, ei);
      u.svg('path', { d: 'M5 23l8-8 12 12-5 5h-8z', fill: '#f5f6f8' }, ei);
      u.el('span', '', clr, 'Clear');
      clr.onclick = () => { env.widgetDef.clear?.(); };
      u.el('span', 'sk-sep', dock);
      const hint = u.el('div', 'sk-hint', dock);
      u.el('div', '', hint, 'Click and hold to draw.');
      u.el('div', '', hint, 'Draw one continuous line.');
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      dock.appendChild(foot);
      Object.assign(_c, { dock, foot });
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.dock.appendChild(dock);
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
    name: 'design-draw-shape-line-04',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css', 'sketch.css'],
    design: {
      THEMES: { 'design-draw-shape-line-04': palette },
      LOW_THEME: palette,
      ACCENTS: ['#2563d6'],
      LOW_ACCENTS: ['#2563d6'],
      parts,
    },
  });
})();
