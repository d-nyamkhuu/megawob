/* Metro notebook design on the shared site frame. */
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
      if (ctx.initial) el.classList.add('reference-initial');
      el.setAttribute('role', 'dialog');
      const content = {
        chat: ['Map Orientation', 'This map can be rotated with its outer ring.', 'Continue', 'Close'],
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
  const palette = { bg: '#b9b9b9', panel: '#c6c6c6', fg: '#111111', muted: '#666666', line: '#777777' };
  function fitNote(_c) {
    const note = _c.page.querySelector('.ref-instruction, .ref-panel, .ref-note');
    if (!note) return;
    const top = _c.stage.getBoundingClientRect().top;
    if (note.getBoundingClientRect().bottom + 2 > top) {
      note.style.paddingTop = note.style.paddingBottom = '4px';
      let fontSize = parseFloat(getComputedStyle(note).fontSize);
      while (note.getBoundingClientRect().bottom + 2 > top && fontSize > 13) {
        fontSize -= 0.5;
        note.style.fontSize = fontSize + 'px';
      }
      const bottom = note.getBoundingClientRect().bottom;
      if (bottom + 2 > top) {
        _c.stage.style.top = (_c.stage.offsetTop + bottom + 2 - top) + 'px';
      }
    }
  }
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The notebook has its own note slot, including on small screens.
      _c.display = _c.ctx.display || 'header';
      document.body.classList.add('metro-cube', 'instruction-' + _c.display);
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const titlebar = u.el('header', 'titlebar', document.body);
      icon(titlebar, 'windows'); u.el('span', '', titlebar, 'Map Orientation');
      const windowActions = u.el('div', 'window-actions', titlebar);
      for (const action of ['minimize', 'maximize', 'close']) {
        const b = u.el('button', 'window-action ' + action, windowActions);
        b.type = 'button'; b.setAttribute('aria-label', action); icon(b, action);
      }
      const menu = u.el('nav', 'menu-bar', document.body);
      ['Project', 'Edit', 'View', 'Options', 'Help'].forEach((label) => u.el('span', 'menu-item', menu, label));
      const tabs = u.el('nav', 'notebook-tabs', document.body);
      tabs.setAttribute('aria-label', 'Application pages');
      ['Map', 'Places', 'Compass', 'Appearance', 'Settings'].forEach((label, i) => {
        const tab = u.el('button', 'notebook-tab tab-' + i, tabs);
        tab.type = 'button'; tab.dataset.action = label.toLowerCase();
        u.el('span', '', tab, label);
      });
      const page = u.el('section', 'notebook-page', document.body);
      const toolbar = u.el('div', 'notebook-toolbar', page);
      Object.assign(_c, { page, header: page, toolbar });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const controls = u.el('aside', 'controls-card', _c.page);
      u.el('h2', 'places-heading', controls, 'Places (5)');
      const controlBody = u.el('div', 'control-body', controls);
      u.el('div', 'place-list', controlBody);
      u.el('h2', 'status-heading', controls, 'Map Status');
      u.el('div', 'status-summary', controls, 'Rotation: 068°\nCenter: 37.4° N 122.1° W\nZoom: 1.0x\n\nPlaces Shown\nTotal: 5\nVisible: 5');
      _c.body = _c.page;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.page;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'cube-stage', _c.page);
      _c.stage.dataset.role = 'stage';
      fitNote(_c);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.page.appendChild(note);
      fitNote(_c);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const taskbar = _c.util.el('footer', 'taskbar', document.body);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) taskbar.appendChild(foot);
      // The original status bar has no visible label and lives at the page edge.
      _c.taskbar = taskbar;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.page.appendChild(dock);
    },
    overlay: () => drawOverlay,
  };
  env.site({
    name: 'design-rotate-object-compass-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-rotate-object-compass-02': palette }, LOW_THEME: palette,
      ACCENTS: ['#ff8610'], LOW_ACCENTS: ['#ff8610'], parts,
    },
  });
})();
