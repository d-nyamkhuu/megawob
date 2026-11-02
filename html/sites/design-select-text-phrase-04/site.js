(function () {
  'use strict';
  const C = {
    title: 'Text Task',
    menu: ['File', 'Edit', 'View', 'Help'],
    tools: ['Select', 'Copy', 'Cut', 'Paste'],
    clock: 'Mon Apr 22   10:24 AM',
  };
  const ICONS = {
    Select: 'M6 2V24L11 19L15 27L18 26L14 18H21Z',
    Copy: 'M5 2H16L23 9V29H5ZM16 2V9H23M8 5H13M8 8H13M8 12H20M8 15H20M8 18H20M8 21H20M8 24H20',
    Cut: 'M5 2L19 22M22 2L9 22M6 21A4 4 0 1 0 6 29A4 4 0 1 0 6 21M21 21A4 4 0 1 0 21 29A4 4 0 1 0 21 21M13 16H15',
    Paste: 'M4 5H24V29H4ZM7 8H21V26H7M9 4V8H19V4ZM11 4V2H17V4M9 12H19M9 15H19M9 18H19M9 21H19M9 24H19',
  };
  function appIcon(u, parent, cls) {
    const s = u.svg('svg', { class: cls, viewBox: '0 0 20 22', width: 20, height: 22 }, parent);
    u.svg('rect', { x: 1, y: 1, width: 18, height: 20, fill: '#d3d1c9', stroke: '#222' }, s);
    u.svg('path', { d: 'M4 4H10V11H4ZM10 11H16V18H10Z', fill: '#738aaa', stroke: '#222', 'stroke-width': 0.8 }, s);
    u.svg('path', { d: 'M11 3L16 6L13 12L8 9ZM4 13L8 12L10 18L5 19Z', fill: '#c1aa72', stroke: '#222', 'stroke-width': 0.8 }, s);
    u.svg('path', { d: 'M6 3V19M3 9H17M10 4L14 18', fill: 'none', stroke: '#762e2a', 'stroke-width': 1 }, s);
    return s;
  }
  const palette = { bg: '#788697', panel: '#c6c4bd', fg: '#111', muted: '#444', line: '#8a867c' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // All note modes occupy the original in-window note slot.
      _c.display = _c.ctx.display || 'header';
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('design', 'motif');
      const shell = u.el('div', 'shell', document.body);
      const bar = u.el('div', 'topbar', shell);
      appIcon(u, bar, 'bar-icon');
      for (const t of ['Applications', 'Places', 'System']) u.el('span', 'bar-item', bar, t);
      u.el('span', 'bar-clock', bar, C.clock);
      const tools = u.el('div', 'float tools', shell);
      const th = u.el('div', 'float-head', tools);
      u.el('span', '', th, 'Tools ▫');
      u.el('button', 'xbtn', th, '✕').type = 'button';
      const tl = u.el('div', 'tool-list', tools);
      C.tools.forEach((t, i) => {
        const b = u.el('button', 'tool' + (i === 0 ? ' selected' : ''), tl);
        b.type = 'button';
        const s = u.svg('svg', {
          viewBox: '0 0 28 30', width: 28, height: 30,
          fill: i === 0 ? '#111' : i === 2 ? 'none' : '#eeede7',
          stroke: '#111', 'stroke-width': i === 2 ? 2.2 : 1.3, 'stroke-linejoin': 'round',
        }, b);
        u.svg('path', { d: ICONS[t] }, s);
        u.el('span', '', b, t);
        b.onclick = () => {
          tl.querySelectorAll('.tool').forEach((x) => x.classList.remove('selected'));
          b.classList.add('selected');
        };
      });
      const find = u.el('div', 'float find', shell);
      const fh = u.el('div', 'float-head', find);
      u.el('span', '', fh, 'Find ▫');
      u.el('button', 'xbtn', fh, '✕').type = 'button';
      const fb = u.el('div', 'find-body', find);
      u.el('div', '', fb, 'Find:');
      const fi = u.el('input', 'find-input', fb);
      fi.type = 'text';
      fi.readOnly = true;
      for (const t of ['Match case', 'Whole words']) {
        const l = u.el('label', 'find-check', fb);
        const c = u.el('input', '', l);
        c.type = 'checkbox';
        u.el('span', '', l, t);
      }
      u.el('button', 'find-next', fb, 'Find Next').type = 'button';
      const win = u.el('div', 'win', shell);
      const head = u.el('div', 'win-title', win);
      appIcon(u, head, 'win-icon');
      u.el('span', 'win-title-text', head, C.title);
      const wc = u.el('div', 'win-controls', head);
      for (const l of ['_', '□', '✕']) {
        const b = u.el('button', '', wc, l);
        b.type = 'button';
        b.onclick = () => env.log('window-control', { label: l });
      }
      const menu = u.el('div', 'win-menu', win);
      for (const m of C.menu) u.el('span', '', menu, m);
      const content = u.el('div', 'content', win);
      // This is only a slot; the template supplies every instruction element.
      const noteSlot = u.el('div', 'note-slot', content);
      noteSlot.hidden = _c.display === 'hidden';
      const tb = u.el('div', 'taskbar', shell);
      u.el('span', 'tb-btn', tb, '≡');
      const task = u.el('span', 'tb-task', tb);
      appIcon(u, task, 'bar-icon');
      u.el('span', '', task, C.title);
      u.el('span', 'tb-grow', tb);
      u.el('span', 'tb-btn', tb, '▤');
      Object.assign(_c, { shell, win, menu, content, noteSlot, header: noteSlot });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.noteSlot.querySelector('.ref-instruction');
      if (note) note.classList.add('task-note', 'instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.menu;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.content; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.noteSlot;
      base(_c);
      _c.body = body;
      const panel = _c.noteSlot.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('task-note', 'instruction-panel');
        panel.querySelector('.ref-panel-text').classList.add('instruction');
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
        note.classList.add('task-note', 'instruction-toast');
        note.querySelector('.ref-note-text').classList.add('instruction');
        note.querySelector('.ref-note-x').classList.add('note-close');
        _c.noteSlot.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('footer');
      _c.content.appendChild(foot);
      const grow = foot.querySelector('.ref-foot-text');
      grow.textContent = '';
      grow.classList.add('foot-grow');
      const clear = _c.util.el('button', 'clear', foot, 'Clear');
      clear.type = 'button';
      clear.onclick = () => { env.widgetDef.clear?.(); };
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.insertBefore(dock, _c.foot.querySelector('.clear'));
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        kind = ctx.kind;
      const el = u.el('section', 'obstruction obstruction-' + kind, document.body);
      el.dataset.role = 'overlay';
      const box = u.el('div', 'obstruction-box', el);
      const title =
        {
          cookie: 'Your privacy',
          toast: 'Changes saved',
          chat: 'Support',
          promo: 'Workspace update',
          banner: 'Service notice',
        }[kind] || 'Notice';
      const text =
        {
          cookie: 'This application stores optional cookies.',
          toast: 'Your changes have been saved.',
          chat: 'Need a hand with this workspace?',
          promo: 'Explore the latest workspace features.',
          banner: 'You are viewing a shared workspace.',
        }[kind] || '';
      u.el('h3', '', box, title);
      u.el('p', '', box, text);
      let dismiss;
      if (kind === 'cookie') {
        const reject = u.el('button', 'dismiss', box, 'Reject optional');
        reject.type = 'button';
        reject.onclick = () => ctx.dismiss('reject');
        dismiss = u.el('button', 'dismiss', box, 'Accept optional');
        dismiss.type = 'button';
        dismiss.onclick = () => ctx.dismiss('accept');
      } else {
        dismiss = u.el('button', 'dismiss', box, 'Close');
        dismiss.type = 'button';
        dismiss.onclick = () => ctx.dismiss('close');
      }
      return { el, dismiss, ttlSteps: kind === 'toast' ? 5 : 0 };
    },
  };
  env.site({
    name: 'design-select-text-phrase-04',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-select-text-phrase-04': palette },
      LOW_THEME: palette,
      ACCENTS: ['#4a6aa5'],
      LOW_ACCENTS: ['#4a6aa5'],
      parts,
    },
  });
})();
