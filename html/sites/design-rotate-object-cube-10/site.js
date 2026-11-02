/* Vista utility frame. Task state and rotations belong to the rotate task. */
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
  function drawProperties(u, right) {
    const cols = u.el('div', 'cols', right);
    const faces = u.el('div', 'col faces', cols);
    u.el('h2', '', faces, 'Cube Faces');
    [['Red', 1, '#c8201c'], ['Blue', 2, '#2038d0'], ['Green', 3, '#2f9a2f'], ['Yellow', 4, '#f4d20c'],
      ['Purple', 5, '#7a22a8'], ['Orange', 6, '#ee6a10']].forEach(([n, i, c]) => {
      const row = u.el('div', 'face-row', faces);
      const chip = u.el('b', 'chip', row, String(i)); chip.style.background = c;
      if (i === 4) chip.style.color = '#222';
      u.el('span', '', row, `${n} face — ${i}`);
    });
    const ctl = u.el('div', 'col controls', cols);
    u.el('h2', '', ctl, 'Controls');
    const controlBody = u.el('div', 'control-body', ctl);
    const mouse = u.svg('svg', { viewBox: '0 0 74 112', 'aria-hidden': 'true' }, controlBody);
    u.svg('path', { d: 'M36 3C15 3 4 20 4 40V73C4 95 18 108 37 108S70 94 70 73V40C70 18 56 3 36 3Z',
      fill: '#eef5fb', stroke: '#1b3050', 'stroke-width': 2.5 }, mouse);
    u.svg('path', { d: 'M32 8C16 10 10 23 10 42H32Z', fill: '#4296cd' }, mouse);
    u.svg('path', { d: 'M37 5V44', fill: 'none', stroke: '#1b3050', 'stroke-width': 5 }, mouse);
    u.svg('path', { d: 'M5 49H69', fill: 'none', stroke: '#1b3050', 'stroke-width': 3 }, mouse);
    u.svg('rect', { x: 32, y: 14, width: 10, height: 28, rx: 5, fill: '#163f69', stroke: '#102a4c', 'stroke-width': 2 }, mouse);
    u.el('span', '', controlBody, 'Drag with your mouse\nto rotate the cube.');
    ['Reset View', 'Show All Faces'].forEach((t) => {
      const b = u.el('button', 'glass-button', ctl, t); b.type = 'button';
      if (t === 'Reset View') b.dataset.action = 'reset';
    });
    u.el('p', 'task-helper', right, '').hidden = true;
  }
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original has a task card in this pane at every viewport.
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
      document.body.classList.add('vista-cube', `instruction-${_c.display}`);
      const titlebar = u.el('header', 'titlebar', document.body);
      const appIcon = u.el('i', 'app-icon', titlebar);
      const appSvg = u.svg('svg', { viewBox: '0 0 24 24', 'aria-hidden': 'true' }, appIcon);
      u.svg('path', { d: 'M8 12V6a4 4 0 0 1 8 0v6M5 12h14l-2 6H7Z', fill: '#8bb9dc', stroke: '#47769d', 'stroke-width': 1.2 }, appSvg);
      u.svg('path', { d: 'M12 4v8m-2 8h4m-2-2v4', stroke: '#47769d', 'stroke-width': 1.3 }, appSvg);
      u.el('span', '', titlebar, 'Spatial Trainer');
      const windowActions = u.el('div', 'window-actions', titlebar);
      for (const action of ['minimize', 'maximize', 'close']) {
        const b = u.el('button', 'window-action ' + action, windowActions);
        b.type = 'button'; b.setAttribute('aria-label', action); icon(b, action, 18);
      }
      const menu = u.el('nav', 'menubar', document.body);
      ['File', 'Help'].forEach((t) => u.el('span', '', menu, t));
      const toolbar = u.el('div', 'episode-toolbar', menu);
      const right = u.el('section', 'pane pane-right');
      Object.assign(_c, { toolbar, right, header: right });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const work = _c.util.el('div', 'work', document.body);
      const left = _c.util.el('section', 'pane pane-left', work);
      work.appendChild(_c.right);
      Object.assign(_c, { body: work, left });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.right;
      base(_c);
      _c.body = body;
      const note = _c.right.querySelector('.ref-panel');
      if (note) note.classList.add('instruction');
      drawProperties(_c.util, _c.right);
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'cube-stage', _c.left);
      _c.stage.dataset.role = 'stage';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('instruction');
        note.querySelector('.ref-note-x').textContent = 'Close';
        _c.right.prepend(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('statusbar');
      const ready = foot.querySelector('.ref-foot-text');
      ready.classList.add('ready');
      ready.textContent = 'Ready';
      const tools = foot.querySelector('.ref-tools');
      _c.util.el('span', 'st', foot, 'Cube Rotation Task');
      _c.util.el('span', 'st', foot, '1 attempt');
      foot.appendChild(tools);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    'frame.end': (base) => (_c) => {
      const note = _c.right.querySelector('.instruction');
      if (note) {
        let font = parseFloat(getComputedStyle(note).fontSize);
        while (note.scrollHeight > note.clientHeight && font > 17) note.style.fontSize = (--font) + 'px';
      }
      return base(_c);
    },
    overlay: () => drawOverlay,
  };
  const palette = { bg: '#b6cae1', panel: '#ffffff', fg: '#14284a', muted: '#52718d', line: '#9fb6cf' };
  env.site({
    name: 'design-rotate-object-cube-10',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-rotate-object-cube-10': palette },
      LOW_THEME: palette,
      ACCENTS: ['#2368c8'],
      LOW_ACCENTS: ['#2368c8'],
      parts,
    },
  });
})();
