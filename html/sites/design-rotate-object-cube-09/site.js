/* Northbridge Workspace design on the shared site frame. */
(function () {
  'use strict';
  const SVG = {
    close: 'M5 5L21 21M21 5L5 21',
    rotl: 'M21 18A9 9 0 1 1 22 9M22 3V10H15',
    rotr: 'M7 18A9 9 0 1 0 6 9M6 3V10H13',
    reset: 'M21 7A9 9 0 0 0 7 6M5 8A9 9 0 0 0 6 21M8 23A9 9 0 0 0 23 19M24 16A9 9 0 0 0 23 9',
    persp: 'M14 3L24 8V20L14 25L4 20V8ZM4 8L14 13L24 8M14 13V25',
    top: 'M14 2L25 8V21L14 27L3 21V8ZM3 8L14 14L25 8M14 14V27',
    front: 'M5 8L9 4H23L26 8V24L22 27H5ZM5 8H22V27M22 8L26 8M14 8V18H26',
    chev: 'M6 10L12 16L18 10',
  };
  function icon(parent, name, size = 24) {
    const svg = env.util.svg('svg', { width: size, height: size, viewBox: '0 0 28 28', 'aria-hidden': 'true' }, parent);
    env.util.svg('path', { d: SVG[name], fill: 'none', stroke: 'currentColor', 'stroke-width': 1.8,
      'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, svg);
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
    close.type = 'button'; close.setAttribute('aria-label', 'Close notice'); icon(close, 'close', 20);
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
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // This workspace has a dedicated note slot in all viewport sizes.
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
      document.body.classList.add('nb-cube');
      const win = u.el('div', 'app-window', document.body);
      const top = u.el('header', 'app-bar', win);
      const logo = u.el('div', 'logo', top);
      for (let i = 0; i < 4; i++) u.el('i', '', logo);
      u.el('span', 'app-name', top, 'Northbridge Workspace');
      const tabs = u.el('nav', 'notebook-tabs', top);
      tabs.setAttribute('aria-label', 'Notebook pages');
      ['Tasks', 'Assets', 'Reports', 'People', 'Settings'].forEach((label, i) => {
        const tab = u.el('button', 'notebook-tab' + (i === 0 ? ' active' : ''), tabs);
        tab.type = 'button';
        u.el('span', 'tab-number', tab, String(i + 1)); u.el('span', '', tab, label);
      });
      const proj = u.el('div', 'project', top);
      u.el('span', '', proj, 'Project A221'); icon(proj, 'chev', 14);
      const sub = u.el('div', 'sub-bar', win);
      u.el('b', '', sub, 'Spatial Reasoning');
      u.el('span', 'sub-name', sub, 'Cube Orientation');
      u.el('span', 'sub-count', sub, 'Task 3 of 6');
      const header = u.el('div', 'note-slot', win);
      Object.assign(_c, { win, sub, header });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('instruction', 'instruction-header');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.sub;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'main-row', _c.win);
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
      const note = _c.header.querySelector('.ref-panel');
      if (note) note.classList.add('instruction', 'instruction-panel');
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      const stage = u.el('main', 'cube-stage', _c.body);
      stage.dataset.role = 'stage';
      const side = u.el('aside', 'side-col', _c.body);
      const faces = u.el('section', 'panel faces-panel', side);
      u.el('h2', '', faces, 'Cube Faces');
      u.el('ul', 'face-legend', faces);
      const controls = u.el('section', 'panel controls-card', side);
      u.el('h2', '', controls, 'Controls');
      const btns = u.el('div', 'ctl-btns', controls);
      [['rotl', 'Rotate Left', 'rotate-left'], ['rotr', 'Rotate Right', 'rotate-right'], ['reset', 'Reset View', 'reset']].forEach(([ic, label, act]) => {
        const b = u.el('button', 'ctl-btn', btns);
        b.type = 'button'; b.dataset.action = act;
        icon(b, ic, 26); u.el('span', '', b, label);
      });
      const pal = u.el('aside', 'palette', document.body);
      const ph = u.el('div', 'pal-head', pal);
      u.el('span', '', ph, 'View Controls'); u.el('i', 'pal-min', ph);
      const views = u.el('div', 'pal-views', pal);
      [['persp', 'Perspective'], ['top', 'Top'], ['front', 'Front']].forEach(([ic, label], i) => {
        const v = u.el('div', 'pal-view' + (i === 0 ? ' on' : ''), views);
        icon(v, ic, 36); u.el('span', '', v, label);
      });
      const zoom = u.el('div', 'pal-zoom', pal);
      u.el('span', 'zl', zoom, 'Zoom');
      const track = u.el('div', 'z-track', zoom); u.el('i', '', track);
      u.el('span', 'zv', zoom, '100%');
      _c.stage = stage;
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('instruction', 'instruction-toast');
        _c.header.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('goal-bar');
      _c.win.appendChild(foot);
      const gt = foot.querySelector('.ref-foot-text');
      gt.classList.add('goal-text');
      gt.textContent = '';
      _c.util.el('b', '', gt, 'Goal');
      _c.util.el('p', 'workspace-help', gt, 'Click and drag the cube to rotate it.');
      // The unchanged widget writes a redundant goal into this helper.
      // Keep its hook available without exposing a second instruction.
      _c.util.el('p', 'task-helper', gt).hidden = true;
      _c.foot = foot;
    },
    overlay: () => drawOverlay,
  };
  const palette = { bg: '#c1dfd5', panel: '#eef5f1', fg: '#102721', muted: '#475f5b', line: '#cbdfdc' };
  env.site({
    name: 'design-rotate-object-cube-09',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-rotate-object-cube-09': palette },
      LOW_THEME: palette,
      ACCENTS: ['#104c40'],
      LOW_ACCENTS: ['#104c40'],
      parts,
    },
  });
})();
