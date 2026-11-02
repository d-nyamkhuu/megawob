/* Skill Builder design on the shared site frame. */
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
        chat: ['Welcome to Skill Builder!', 'Take a quick tour to learn the controls and features.', 'Start tour', 'Skip tour'],
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
          else { message.textContent = 'Drag the round handle to turn the pointer toward the star.'; primary.hidden = true; }
        };
      }
      const dismiss = u.el('button', 'tour-dismiss', actions, content[3]); dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('skip');
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0 };
  }
  const palette = { bg: '#ffffff', panel: '#ffffff', fg: '#2d3a4a', muted: '#5d6b7c', line: '#c9d6e6' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original dedicated pane accommodates all note modes at every size.
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
      document.body.className = `sb-page instruction-${_c.display}`;
      const header = u.el('header', 'sb-header', document.body);
      u.el('div', 'sb-brand', header, 'Skill Builder');
      const tabs = u.el('nav', 'sb-tabs', header);
      ['Practice', 'Tasks', 'Progress', 'Settings'].forEach((label, i) => {
        const tab = u.el('button', 'sb-tab' + (i === 0 ? ' on' : ''), tabs);
        u.el('span', '', tab, label);
        tab.type = 'button'; tab.dataset.action = label.toLowerCase();
        tab.onclick = () => env.log('decoy', { label });
      });
      const links = u.el('div', 'sb-links', header);
      ['Help', 'Sign Out'].forEach((label) => {
        const link = u.el('a', '', links, label);
        link.onclick = () => env.log('decoy', { label });
      });
      const left = u.el('aside', 'sb-left', document.body);
      const taskTitle = u.el('h2', 'sb-h', left);
      u.el('span', '', taskTitle, 'Your Task');
      const noteHost = u.el('div', 'sb-note-host', left);
      u.el('p', 'task-helper', left, 'Use the rotation handle to turn the pointer.');
      const page = u.el('section', 'sb-main', document.body);
      u.el('h2', 'sb-title', page, 'Rotate Pointer');
      const bar = u.el('div', 'sb-actions', page);
      const reset = u.el('button', 'sb-reset', bar, 'Reset'); reset.type = 'button';
      reset.onclick = (e) => { e.preventDefault(); env.log('decoy', { label: 'Reset' }); };
      const tools = u.el('div', 'sb-action-tools', bar);
      Object.assign(_c, { header: noteHost, left, page, bar, tools });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.tools;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.page; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
      const panel = _c.header.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('instruction');
        panel.querySelector('.ref-panel-title').textContent = 'Task briefing';
      }
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      _c.stage = u.el('main', 'cube-stage', _c.page);
      _c.stage.dataset.role = 'stage';
      const controls = u.el('aside', 'controls-card', _c.page);
      const controlTitle = u.el('h2', '', controls);
      u.el('span', '', controlTitle, 'Controls');
      const controlBody = u.el('div', 'control-body', controls);
      const arcs = u.svg('svg', { viewBox: '0 0 200 90', 'aria-hidden': 'true' }, controlBody);
      u.svg('path', { d: 'M10 75C7 50 25 25 52 15', fill: 'none', stroke: '#4a7fb0', 'stroke-width': 4.5 }, arcs);
      u.svg('path', { d: 'M62 10L44 8L50 24Z', fill: '#4a7fb0' }, arcs);
      u.svg('path', { d: 'M190 75C193 50 175 25 148 15', fill: 'none', stroke: '#4a7fb0', 'stroke-width': 4.5 }, arcs);
      u.svg('path', { d: 'M138 10L156 8L150 24Z', fill: '#4a7fb0' }, arcs);
      u.el('span', '', controlBody, 'Drag to rotate\nthe pointer');
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('instruction');
        _c.util.el('div', 'brief-label', note, 'Practice reminder');
        note.insertBefore(note.lastChild, note.firstChild);
        note.querySelector('.ref-note-x').textContent = 'Close';
        _c.left.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (_c.placement === 'footer' || _c.placement === 'link') {
        _c.page.appendChild(foot);
        foot.classList.add('sb-title-actions');
      } else _c.tools.appendChild(foot);
      foot.querySelector('.ref-foot-text').textContent = 'Practice workspace';
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.bar.appendChild(dock);
    },
    overlay: () => drawOverlay,
  };
  env.site({
    name: 'design-rotate-object-orient-08',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-rotate-object-orient-08': palette },
      LOW_THEME: palette,
      ACCENTS: ['#2f8a2f'],
      LOW_ACCENTS: ['#2f8a2f'],
      parts,
    },
  });
})();
