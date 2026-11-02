/* Spatial Lab: the compact workspace design on the shared site frame. */
(function () {
  'use strict';
  const ICONS = {
    close: 'M5 5L21 21M21 5L5 21',
    home: 'M4 13L14 4L24 13M7 11V23H12V16H16V23H21V11',
    grid: 'M5 5H12V12H5ZM16 5H23V12H16ZM5 16H12V23H5ZM16 16H23V23H16Z',
    bars: 'M5 23V14H9V23ZM12 23V6H16V23ZM19 23V11H23V23Z',
    gear: 'M11 3H17L18 6L21 7L24 7L26 12L23 14L23 17L24 20L20 24L17 23L14 24L12 26L7 24L7 21L5 18L2 17V11L5 10L6 7L6 5L11 3ZM18 14A4 4 0 1 1 10 14A4 4 0 1 1 18 14',
    up: 'M14 23V5M7 12L14 5L21 12',
    down: 'M14 5V23M7 16L14 23L21 16',
    left: 'M23 14H5M12 7L5 14L12 21',
    right: 'M5 14H23M16 7L23 14L16 21',
    reset: 'M22 14A8 8 0 1 1 18 7M22 4V10H16',
  };
  function icon(parent, name, size = 24) {
    const svg = env.util.svg('svg', { width: size, height: size, viewBox: '0 0 28 28', 'aria-hidden': 'true' }, parent);
    env.util.svg('path', { d: ICONS[name], fill: 'none', stroke: 'currentColor', 'stroke-width': 1.7,
      'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, svg);
    return svg;
  }
  function drawOverlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'tour-bubble overlay-' + ctx.kind, document.body);
      el.setAttribute('role', 'dialog');
      const content = {
        chat: ['Welcome to Spatial Lab', 'Take a quick tour to learn the controls and features.', 'Start tour', 'Skip tour'],
        cookie: ['Your privacy', 'Allow optional cookies for this practice workspace?', 'Accept optional', 'Reject optional'],
        toast: ['Practice saved', 'Your current workspace is ready to continue.', null, 'Dismiss'],
        promo: ['Discover more practice', 'Explore more exercises after completing this task.', 'Show details', 'Not now'],
        banner: ['Workspace notice', 'This practice session works offline.', null, 'Dismiss'],
      }[ctx.kind];
      u.el('h2', '', el, content[0]);
      const close = u.el('button', 'bubble-close', el);
      close.type = 'button'; close.setAttribute('aria-label', 'Close notice'); icon(close, 'close', 25);
      close.onclick = () => ctx.dismiss('close');
      const message = u.el('p', '', el, content[1]);
      const actions = u.el('div', 'tour-actions', el);
      if (content[2]) {
        const primary = u.el('button', 'tour-primary', actions, content[2]); primary.type = 'button';
        primary.onclick = () => {
          if (ctx.kind === 'cookie') ctx.dismiss('accept');
          else { message.textContent = 'Click and drag the cube. Use the task instruction to choose which face should point toward you.'; primary.hidden = true; }
        };
      }
      const dismiss = u.el('button', 'tour-dismiss', actions, content[3]); dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('skip');
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0 };
  }
  function noteHeading(u, parent) {
    const head = u.el('div', 'note-head', parent);
    u.el('i', 'note-badge', head, '!'); u.el('span', '', head, 'Task');
  }
  function noteStatus(u, parent) {
    u.el('p', 'note-status', parent, 'The cube is not yet in the correct orientation.');
  }
  const palette = { bg: '#f8f9fb', panel: '#ffffff', fg: '#3d4452', muted: '#707889', line: '#e3e6ea' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      document.body.classList.add('spatial-lab', 'instruction-' + _c.display);
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const side = u.el('nav', 'side-nav', document.body);
      side.setAttribute('aria-label', 'Workspace');
      const brand = u.el('div', 'brand', side);
      u.el('i', 'brand-mark', brand); u.el('span', '', brand, 'Spatial Lab');
      [['home', 'Home'], ['grid', 'Exercises'], ['bars', 'Progress'], ['gear', 'Settings']].forEach(([ic, label], i) => {
        const item = u.el('div', 'nav-item' + (i === 0 ? ' active' : ''), side);
        icon(item, ic, 26); u.el('span', '', item, label);
      });
      const page = u.el('section', 'dialog', document.body);
      u.el('div', 'eyebrow', page, '3D MANIPULATION');
      const header = u.el('header', 'dialog-heading', page);
      u.el('p', 'task-helper', page, 'Click and drag the cube to rotate it.');
      const actions = u.el('div', 'chrome-actions', page);
      const note = u.el('aside', 'task-note', document.body);
      if (_c.display !== 'panel' && _c.display !== 'toast') {
        noteHeading(u, note);
        noteStatus(u, note);
      }
      Object.assign(_c, { page, header, actions, note });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const instruction = _c.header.querySelector('.ref-instruction');
      if (instruction) instruction.classList.add('instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.actions;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'stage-wrap', _c.page);
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.note;
      base(_c);
      _c.body = body;
      const panel = _c.note.querySelector('.ref-panel');
      if (panel) {
        const title = panel.querySelector('.ref-panel-title');
        title.textContent = '';
        noteHeading(_c.util, title);
        noteStatus(_c.util, panel);
      }
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      _c.stage = u.el('main', 'cube-stage', _c.body);
      _c.stage.dataset.role = 'stage';
      const controls = u.el('aside', 'controls-card', _c.body);
      [['up', 'Up'], ['down', 'Down'], ['left', 'Left'], ['right', 'Right']].forEach(([ic, label]) => {
        const b = u.el('button', 'ctl-btn', controls); b.type = 'button';
        b.dataset.rotate = ic;
        b.setAttribute('aria-label', 'Rotate ' + label.toLowerCase()); icon(b, ic, 24);
      });
      const reset = u.el('button', 'ctl-btn ctl-reset', controls); reset.type = 'button';
      reset.dataset.action = 'reset'; icon(reset, 'reset', 24); u.el('span', '', reset, 'Reset');
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        _c.note.classList.add('task-note-toast');
        _c.note.appendChild(note);
        noteHeading(_c.util, note);
        note.insertBefore(note.lastChild, note.firstChild);
        noteStatus(_c.util, note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.actions.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.actions.appendChild(dock);
    },
    overlay: () => drawOverlay,
  };
  env.site({
    name: 'design-rotate-object-cube-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-rotate-object-cube-02': palette },
      LOW_THEME: palette,
      ACCENTS: ['#f97316'],
      LOW_ACCENTS: ['#f97316'],
      parts,
    },
  });
})();
