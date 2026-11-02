/* Swiss editorial reference frame. Task state and rotations belong to the rotate task. */
(function () {
  'use strict';
  function icon(parent, name, size = 24) {
    const paths = {
      close: 'M5 5L21 21M21 5L5 21',
    };
    const svg = env.util.svg('svg', { width: size, height: size, viewBox: '0 0 28 28', 'aria-hidden': 'true' }, parent);
    env.util.svg('path', { d: paths[name], fill: 'none', stroke: 'currentColor', 'stroke-width': 1.7 }, svg);
    return svg;
  }
  function drawOverlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'tour-bubble overlay-' + ctx.kind, document.body);
      el.setAttribute('role', 'dialog');
      const content = {
        chat: ['Welcome to Cube Practice', 'Take a quick tour to learn the controls and features.', 'Start tour', 'Skip tour'],
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
  function rotIcon(btn, kind) {
    const S = env.util.svg;
    const svg = S('svg', { viewBox: '0 0 48 48', 'aria-hidden': 'true' }, btn);
    const st = { fill: 'none', stroke: '#111', 'stroke-width': 3.2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' };
    if (kind === 'left') {
      S('path', Object.assign({ d: 'M24 40A16 16 0 1 0 9 24' }, st), svg);
      S('path', Object.assign({ d: 'M4 20L9 26L15 19' }, st), svg);
    } else if (kind === 'right') {
      S('path', Object.assign({ d: 'M24 40A16 16 0 1 1 39 24' }, st), svg);
      S('path', Object.assign({ d: 'M33 19L39 26L44 20' }, st), svg);
    } else {
      S('path', Object.assign({ d: 'M24 5V43M17 12L24 5L31 12M17 36L24 43L31 36' }, st), svg);
      S('path', Object.assign({ d: 'M15 20C-2 22 0 30 20 30M33 20C50 22 48 30 28 30' }, st), svg);
    }
  }
  const palette = { bg: '#fff', panel: '#edf1f4', fg: '#111', muted: '#666', line: '#eceef0' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      document.body.className = `swiss-cube instruction-${_c.display}`;
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      u.el('div', 'rail', document.body);
      u.el('div', 'rail-rule', document.body);
      const left = u.el('section', 'brief', document.body);
      u.el('div', 'kicker', left, 'TASK');
      u.el('div', 'big-number', left, '01');
      u.el('h2', 'brief-title', left, 'Cube orientation');
      const header = u.el('div', 'note-slot', left);
      // The widget writes a target-specific hint into its helper. Keep that
      // legacy sink hidden; the template note is the only visible goal.
      const helper = u.el('p', 'task-helper', left);
      helper.hidden = true;
      u.el('p', 'practice-helper', left, 'Click and drag the cube to rotate it.');
      const right = u.el('section', 'workspace', document.body);
      u.el('div', 'section-label', right, '3D CUBE');
      const panel = u.el('div', 'stage-panel', document.body);
      Object.assign(_c, { header, left, right, panel });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      const h = _c.header;
      _c.header = _c.panel;
      base(_c);
      _c.header = h;
    },
    'frame.body': () => (_c) => { _c.body = _c.panel; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      const panel = _c.panel;
      const stage = u.el('main', 'cube-stage', panel);
      stage.dataset.role = 'stage';
      const controls = u.el('aside', 'controls-card', panel);
      const mouse = u.svg('svg', { viewBox: '0 0 40 56', 'aria-hidden': 'true' }, controls);
      u.svg('path', { d: 'M20 2C10 2 4 9 4 19V36C4 47 11 54 20 54S36 47 36 36V19C36 9 30 2 20 2ZM4 24H36M20 2V24',
        fill: 'none', stroke: '#111', 'stroke-width': 2.2 }, mouse);
      u.el('span', '', controls, 'Click and drag\nto rotate');
      const tools = u.el('div', 'rot-tools', panel);
      const bl = u.el('button', 'rot-btn', tools); bl.type = 'button'; bl.dataset.action = 'rotate-left'; bl.setAttribute('aria-label', 'Rotate left'); rotIcon(bl, 'left');
      const bm = u.el('button', 'rot-btn wide', tools); bm.type = 'button'; bm.dataset.action = 'reset'; bm.setAttribute('aria-label', 'Reset orientation'); rotIcon(bm, 'mid');
      const br = u.el('button', 'rot-btn', tools); br.type = 'button'; br.dataset.action = 'rotate-right'; br.setAttribute('aria-label', 'Rotate right'); rotIcon(br, 'right');
      _c.stage = stage;
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.querySelector('.ref-note-x').textContent = _c.closeLabel;
        _c.header.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.right.appendChild(dock);
    },
    overlay: () => drawOverlay,
  };
  env.site({
    name: 'design-rotate-object-cube-01',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-rotate-object-cube-01': palette }, LOW_THEME: palette,
      ACCENTS: ['#ee3524'], LOW_ACCENTS: ['#ee3524'], parts,
    },
  });
})();
