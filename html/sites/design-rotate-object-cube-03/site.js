/* Macintosh task sheet, using the shared frame's episode controls. */
(function () {
  'use strict';
  function icon(parent, name, size = 24) {
    const paths = {
      windows: 'M2 4L11 3V12H2ZM13 3L23 1V12H13ZM2 14H11V23L2 22ZM13 14H23V25L13 23Z',
      close: 'M5 5L21 21M21 5L5 21', minimize: 'M5 20H21', maximize: 'M6 6H21V21H6Z',
      search: 'M17 17L24 24M20 11A9 9 0 1 1 2 11A9 9 0 1 1 20 11',
      wifi: 'M2 9Q13 -1 24 9M6 14Q13 7 20 14M10 19Q13 16 16 19M13 23H13.1',
      sound: 'M3 10H8L14 5V23L8 18H3ZM18 9Q25 14 18 19M21 5Q33 14 21 23',
      up: 'M5 17L13 9L21 17',
    };
    const svg = env.util.svg('svg', { width: size, height: size, viewBox: '0 0 28 28', 'aria-hidden': 'true' }, parent);
    env.util.svg('path', { d: paths[name], fill: name === 'windows' ? 'currentColor' : 'none',
      stroke: name === 'windows' ? 'none' : 'currentColor', 'stroke-width': 1.7 }, svg);
    return svg;
  }
  function drawOverlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'tour-bubble overlay-' + ctx.kind, document.body);
      el.setAttribute('role', 'dialog');
      const content = {
        chat: ['Welcome to Cube Practice!', 'Take a quick tour to learn the controls and features.', 'Start tour', 'Skip tour'],
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
  const palette = { bg: '#ffffff', panel: '#ffffff', fg: '#000000', muted: '#777777', line: '#000000' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The sheet already reserves both corner note locations at every size.
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
      document.body.classList.add('mac-cube', 'instruction-' + _c.display);
      const bar = u.el('header', 'menubar', document.body);
      const ap = u.svg('svg', { class: 'apple', width: 22, height: 26, viewBox: '0 0 22 26', 'aria-hidden': 'true' }, bar);
      u.svg('path', { d: 'M11 7C8 5 3 6 3 12C3 18 7 24 10 24C11 24 11 23 12 23C13 23 13 24 14 24C17 24 20 18 20 16C17 15 16 11 19 9C17 6 13 6 11 7ZM12 6C12 3 14 1 16 1C16 4 14 6 12 6Z', fill: '#000' }, ap);
      for (const m of ['File', 'Edit', 'View', 'Special', 'Help']) u.el('span', '', bar, m);
      const dk = u.svg('svg', { class: 'disk spacer', width: 28, height: 30, viewBox: '0 0 28 30', 'aria-hidden': 'true' }, bar);
      u.svg('path', { d: 'M5 2H22L26 6V26L23 29H5L2 26V5ZM9 2V12H20V2M8 29V19H20V29M12 20V26', fill: '#fff', stroke: '#000', 'stroke-width': 2 }, dk);
      u.el('span', 'clock', bar, 'Mon Sep 12  9:24 AM');
      const idx = u.el('nav', 'index', document.body);
      idx.setAttribute('aria-label', 'Index');
      u.el('div', 'grip', idx);
      for (let i = 1; i <= 10; i++) u.el('span', 'num' + (i === 1 ? ' on' : ''), idx, String(i));
      const page = u.el('section', 'win', document.body);
      const tb = u.el('div', 'wintitle', page);
      u.el('i', 'l', tb); u.el('span', 't', tb, 'Cube Trainer');
      u.el('i', 'r', tb);
      const toolbar = u.el('div', 'sheet-tools', page);
      Object.assign(_c, { page, header: page, toolbar });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.page; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.page;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      _c.stage = u.el('main', 'cube-stage', _c.page);
      _c.stage.dataset.role = 'stage';
      const pointer = u.svg('svg', { class: 'sheet-pointer', viewBox: '0 0 30 46', 'aria-hidden': 'true' }, _c.page);
      u.svg('path', { d: 'M2 1V35L10 28L18 45L24 42L16 26H29Z', fill: '#000' }, pointer);
      // The widget owns this helper and rewrites its copy. Keep a visible generic tip separately.
      const helper = u.el('p', 'task-helper', _c.page);
      helper.hidden = true;
      u.el('p', 'cube-help', _c.page, 'Click and drag the cube to rotate it.');
      const reset = u.el('button', 'btn reset-button', _c.page, 'Reset');
      reset.type = 'button'; reset.dataset.action = 'reset';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        _c.page.appendChild(note);
        note.querySelector('.ref-note-x').textContent = 'Close';
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        _c.page.appendChild(foot);
        // Keep the end control relative to the sheet, outside the upper accessory tools.
        const end = foot.querySelector('[data-role="submit"]');
        if (end) foot.appendChild(end);
      }
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.page.appendChild(dock);
    },
    overlay: () => drawOverlay,
  };
  env.site({
    name: 'design-rotate-object-cube-03',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-rotate-object-cube-03': palette },
      LOW_THEME: palette,
      ACCENTS: ['#000000'],
      LOW_ACCENTS: ['#000000'],
      parts,
    },
  });
})();
