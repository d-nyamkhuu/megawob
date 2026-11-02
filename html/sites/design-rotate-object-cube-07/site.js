/* Pastel native cube trainer design on the shared site frame. */
(function () {
  'use strict';
  const ICONS = {
    close: 'M5 5L21 21M21 5L5 21', minimize: 'M5 14H21', maximize: 'M6 6H21V21H6Z',
    left: 'M12 5L5 11L12 17M5 11H15Q25 11 23 23', right: 'M16 5L23 11L16 17M23 11H13Q3 11 5 23',
    up: 'M14 23V5M6 13L14 5L22 13', down: 'M14 5V23M6 15L14 23L22 15',
  };
  function icon(parent, name, size = 24) {
    const svg = env.util.svg('svg', { width: size, height: size, viewBox: '0 0 28 28', 'aria-hidden': 'true' }, parent);
    env.util.svg('path', { d: ICONS[name], fill: 'none', stroke: 'currentColor', 'stroke-width': ['left','right','up','down'].includes(name) ? 2.8 : 1.9,
      'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, svg);
    return svg;
  }
  function logo(parent) {
    const svg = env.util.svg('svg', { width: 26, height: 26, viewBox: '0 0 26 26', 'aria-hidden': 'true' }, parent);
    env.util.svg('path', { d: 'M13 2L23 7.5L13 13L3 7.5Z', fill: '#8fb8ff' }, svg);
    env.util.svg('path', { d: 'M3 7.5L13 13V24L3 18.5Z', fill: '#3f6fe0' }, svg);
    env.util.svg('path', { d: 'M23 7.5L13 13V24L23 18.5Z', fill: '#5f93f5' }, svg);
  }
  function drawOverlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'tour-bubble overlay-' + ctx.kind, document.body);
      el.setAttribute('role', 'dialog');
      const content = {
        chat: ['Welcome to Cube Trainer!', 'Take a quick tour to learn the controls and features.', 'Start tour', 'Skip tour'],
        cookie: ['Your privacy', 'Allow optional cookies for this practice workspace?', 'Accept optional', 'Reject optional'],
        toast: ['Practice saved', 'Your current workspace is ready to continue.', null, 'Dismiss'],
        promo: ['Discover more practice', 'Explore more exercises after completing this task.', 'Show details', 'Not now'],
        banner: ['Workspace notice', 'This practice session works offline.', null, 'Dismiss'],
      }[ctx.kind];
      u.el('h2', '', el, content[0]);
      const close = u.el('button', 'bubble-close', el);
      close.type = 'button'; close.setAttribute('aria-label', 'Close notice'); icon(close, 'close', 22);
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
  function moveExtras(container, actions) {
    for (const button of container.querySelectorAll('.ref-xtra')) actions.appendChild(button);
  }
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // All note modes use the original dedicated briefing pane.
      _c.display = _c.ctx.display || 'header';
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('pastel-cube', 'instruction-' + _c.display);
      const titlebar = u.el('header', 'titlebar', document.body);
      logo(titlebar); u.el('span', '', titlebar, 'Cube Trainer');
      const windowActions = u.el('div', 'window-actions', titlebar);
      for (const action of ['minimize', 'maximize', 'close']) {
        const b = u.el('button', 'window-action ' + action, windowActions);
        b.type = 'button'; b.setAttribute('aria-label', action); icon(b, action, 22);
      }
      const brief = u.el('section', 'briefing', document.body);
      u.el('div', 'brief-kicker', brief, '3D Orientation Task');
      const noteSlot = u.el('div', 'brief-note', brief);
      u.el('hr', 'brief-rule', brief);
      u.el('p', 'task-helper', brief, 'Click and drag the cube to rotate it.');
      const legend = u.el('div', 'legend', brief);
      u.el('div', 'legend-title', legend, 'Face colors and numbers:');
      u.el('div', 'legend-list', legend);
      const strip = u.el('footer', 'action-strip', document.body);
      const rot = u.el('div', 'strip-group rot-group', strip);
      u.el('div', 'strip-title', rot, 'Rotate Cube');
      const rotRow = u.el('div', 'tile-row', rot);
      [['left', 'Rotate Left'], ['right', 'Rotate Right'], ['up', 'Tilt Up'], ['down', 'Tilt Down']].forEach(([ic, label]) => {
        const b = u.el('button', 'tile-btn', rotRow); b.type = 'button';
        b.dataset.rotate = ic;
        icon(b, ic, 30); u.el('span', '', b, label);
      });
      u.el('div', 'strip-sep', strip);
      const pre = u.el('div', 'strip-group pre-group', strip);
      u.el('div', 'strip-title', pre, 'View Presets');
      const preRow = u.el('div', 'pill-row', pre);
      ['Front', 'Back', 'Left', 'Right', 'Top', 'Bottom'].forEach((label) => {
        const b = u.el('button', 'pill-btn', preRow, label); b.type = 'button';
        b.dataset.preset = label.toLowerCase();
      });
      u.el('div', 'strip-sep', strip);
      Object.assign(_c, { header: noteSlot, strip, windowActions });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.strip;
      base(_c);
      _c.header = header;
      moveExtras(_c.headerTools, _c.windowActions);
    },
    'frame.body': () => (_c) => { _c.body = document.body; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
      const note = _c.header.querySelector('.ref-panel');
      if (note) note.classList.add('instruction');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'cube-stage', _c.body);
      _c.stage.dataset.role = 'stage';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('instruction', 'instruction-note');
        _c.header.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.querySelector('.ref-foot-text').textContent = 'Ready';
      moveExtras(foot, _c.windowActions);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
    },
    overlay: () => drawOverlay,
  };
  const palette = { bg: '#e1e7f5', panel: '#eaf8f3', fg: '#101b42', muted: '#3d4660', line: '#cbdcd9' };
  env.site({
    name: 'design-rotate-object-cube-07',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-rotate-object-cube-07': palette },
      LOW_THEME: palette,
      ACCENTS: ['#3478f2'],
      LOW_ACCENTS: ['#3478f2'],
      parts,
    },
  });
})();
