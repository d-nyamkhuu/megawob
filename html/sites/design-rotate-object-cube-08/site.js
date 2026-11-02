/* Metro notebook design. Task state and rotations belong to the rotate task. */
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
  function menuExtras(_c, container) {
    container.querySelectorAll('.ref-xtra').forEach(b => _c.menubar.insertBefore(b, _c.clock));
  }
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original notebook has room for its own note in every display mode.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('metro-cube', 'instruction-' + _c.display);
      const menubar = u.el('header', 'menubar', document.body);
      const logo = u.el('span', 'sun-logo', menubar);
      const mark = u.svg('svg', {viewBox:'0 0 40 40', 'aria-hidden':'true'}, logo);
      const weave = u.svg('g', {transform:'translate(20 20) rotate(45) translate(-14 -14)', fill:'none', stroke:'#172947', 'stroke-width':1.5}, mark);
      u.svg('rect', {x:0,y:0,width:28,height:28}, weave);
      for (let i=3;i<28;i+=4) {
        u.svg('path', {d:`M${i} 0V${28-i}H28 M0 ${i}H${28-i}V28`}, weave);
      }
      u.el('span', '', logo, 'Sun');
      ['File', 'Edit', 'View', 'Options'].forEach(m => u.el('span', 'menu-item', menubar, m));
      const clock = u.el('span', 'menu-clock', menubar, 'Mon Apr 6  10:24 AM');
      const win = u.el('section', 'ol-window', document.body);
      const titlebar = u.el('div', 'ol-title', win);
      u.el('span', 'pushpin', titlebar);
      u.el('span', 'ol-title-text', titlebar, 'Cube Task');
      u.el('span', 'ol-resize', titlebar);
      const toolbar = u.el('footer', 'ol-foot');
      Object.assign(_c, { menubar, clock, win, toolbar, header: win });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('instruction');
    },
    'frame.tools': (base) => (_c) => {
      const h = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = h;
      menuExtras(_c, _c.headerTools);
    },
    'frame.body': () => (_c) => { _c.body = _c.win; },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const note = _c.body.querySelector('.ref-panel');
      if (note) note.classList.add('episode-panel');
    },
    'frame.stage': () => (_c) => {
      // The cube widget updates this legacy, visually hidden helper.
      _c.util.el('p', 'task-helper', _c.win);
      _c.stage = _c.util.el('main', 'cube-stage', _c.win);
      _c.stage.dataset.role = 'stage';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('episode-toast');
        _c.win.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const u = _c.util;
      const foot = _c.toolbar;
      const mk = (cls, label) => {
        const b = u.el('button', 'ol-btn ' + cls, foot);
        b.type = 'button';
        const svg = u.svg('svg', {viewBox:'0 0 32 32',class:'glyph','aria-hidden':'true'}, b);
        if (cls === 'b-up' || cls === 'b-down') {
          u.svg('path',{d:cls==='b-up'?'M16 2L8 17H13V30H19V17H24Z':'M13 2V15H8L16 30L24 15H19V2Z',fill:'#071b2b'},svg);
        } else {
          u.svg('path',{d:'M23 6A12 12 0 1 1 6 10',fill:'none',stroke:'#071b2b','stroke-width':2.8,transform:cls==='b-left'?'translate(32 0) scale(-1 1)':'translate(0 0)'},svg);
          u.svg('path',{d:'M16 3L26 3L25 13Z',fill:'#071b2b',transform:cls==='b-left'?'translate(32 0) scale(-1 1)':'translate(0 0)'},svg);
        }
        u.el('span', '', b, label);
        return b;
      };
      mk('b-left', 'Rotate Left').dataset.rotation = '-1,0';
      mk('b-right', 'Rotate Right').dataset.rotation = '1,0';
      mk('b-up', 'Tilt Up').dataset.rotation = '0,-1';
      mk('b-down', 'Tilt Down').dataset.rotation = '0,1';
      u.el('i', 'ol-sep', foot);
      mk('b-reset', 'Reset').dataset.action = 'reset';
      foot.appendChild(_c.headerTools);
      const templateFoot = document.body.querySelector('.ref-foot');
      menuExtras(_c, templateFoot);
      _c.win.querySelector('.ol-title').appendChild(templateFoot);
      _c.win.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.win.querySelector('.ol-title').appendChild(dock);
    },
    overlay: () => drawOverlay,
  };
  const palette = { bg: '#c3c3c6', panel: '#c9c9cc', fg: '#111111', muted: '#555555', line: '#777777' };
  env.site({
    name: 'design-rotate-object-cube-08',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-rotate-object-cube-08': palette },
      LOW_THEME: palette,
      ACCENTS: ['#8bb6ee'],
      LOW_ACCENTS: ['#8bb6ee'],
      parts,
    },
  });
})();
