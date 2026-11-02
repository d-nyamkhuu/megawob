(function () {
  'use strict';
  const ICONS = {
    Select: '<path d="M8 3v26l7-7 5 11 5-2-5-11h9Z"/>',
    Pan: '<path d="M10 17V7a2 2 0 0 1 4 0v8V5a2 2 0 0 1 4 0v10V6a2 2 0 0 1 4 0v10V10a2 2 0 0 1 4 0v12c0 6-4 9-9 9s-7-3-10-8l-3-5a2 2 0 0 1 4-2l2 3Z"/>',
    Zoom: '<defs><linearGradient id="lens" x2="1" y2="1"><stop stop-color="#f2fbff"/><stop offset=".5" stop-color="#91bddc"/><stop offset="1" stop-color="#d7ebf7"/></linearGradient></defs><path d="m21 20 10 10-3 3-10-10Z"/><circle cx="14" cy="14" r="10" fill="url(#lens)"/><circle cx="14" cy="14" r="7.5" fill="none" stroke="#effaff" stroke-width="1.5"/><path d="m9 12 6-5" stroke="#fff" stroke-width="2.5"/>',
    Undo: '<path d="M15 3 3 14l12 10v-7h5c6 0 8 4 8 11h3c2-13-3-18-11-18h-5Z"/>',
    Redo: '<path d="m19 3 12 11-12 10v-7h-5c-6 0-8 4-8 11H3C1 15 6 10 14 10h5Z"/>',
    Clear: '<path d="M5 8h24v4H5Z M13 8V4h9v4 M8 12l1 20h16l1-20 M13 15v13 M17 15v13 M21 15v13"/>',
  };
  const TOOLS = ['Select|Pan|Zoom', 'Undo|Redo', 'Clear'];
  const palette = { bg: '#2a6bb0', panel: '#ece9d9', fg: '#0d1a45', muted: '#6889a5', line: '#2d6792' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('ref', 'fx');
      const shell = u.el('main', 'shell', document.body);
      shell.dataset.end = ['header', 'icon'].includes(_c.placement) ? 'head' : 'dock';
      shell.dataset.placement = _c.placement || 'none';
      const head = u.el('header', 'head', shell);
      const tab = u.el('div', 'head-tab', head);
      u.el('div', 'head-title', tab, 'Task Center');
      u.el('div', 'head-sub', tab, 'Follow the instructions to complete the task.');
      const badge = u.el('div', 'head-badge', head);
      u.el('div', '', badge, 'Project  Alpha');
      u.el('div', 'badge-user', badge, 'User: Guest');
      const work = u.el('div', 'work', shell);
      const center = u.el('section', 'center', work);
      const foot = u.el('footer', 'footer', shell);
      u.el('div', 'tools-label', foot, 'Tools');
      TOOLS.forEach((grp, gi) => {
        const g = u.el('div', 'tool-group group-' + gi, foot);
        grp.split('|').forEach((n) => {
          const b = u.el('div', 'tool' + (n === 'Select' ? ' sel' : '') + (n === 'Undo' || n === 'Redo' ? ' dim' : ''), g);
          b.innerHTML = '<svg viewBox="0 0 34 34">' + ICONS[n] + '</svg><span>' + n + '</span>';
        });
        if (gi < 2) u.el('div', 'tool-sep', foot);
      });
      Object.assign(_c, { shell, center, foot, header: foot });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.center;
      base(_c);
      _c.header = header;
      const note = _c.center.querySelector('.ref-instruction');
      if (note) note.classList.add('instruction');
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
      _c.headerTools.classList.add('dock-tools');
    },
    'frame.body': () => (_c) => { _c.body = _c.center; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.center;
      base(_c);
      _c.body = body;
      const note = _c.center.querySelector('.ref-panel');
      if (note) note.classList.add('instruction', 'instruction-panel');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('instruction', 'instruction-toast');
        _c.center.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      _c.foot.appendChild(foot);
      const text = foot.querySelector('.ref-foot-text');
      text.textContent = _c.ctx.finish ? 'Workspace ready' : '';
      if (_c.ctx.finish) text.classList.add('dock-status');
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const el = ctx.util.el('section', 'perturb ' + ctx.kind, document.body);
      ctx.util.el(
        'strong',
        '',
        el,
        {
          cookie: 'Cookie preferences',
          toast: 'Notification',
          chat: 'Support',
          promo: 'A special offer',
          banner: 'Service notice',
        }[ctx.kind],
      );
      ctx.util.el(
        'p',
        '',
        el,
        {
          cookie: 'Choose your preferences to continue.',
          toast: 'Your workspace is ready.',
          chat: 'How can we help?',
          promo: 'Explore the latest tools.',
          banner: 'A new update is available.',
        }[ctx.kind],
      );
      const dismiss = ctx.util.el('button', 'dismiss', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-click-control-sequence-05',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-click-control-sequence-05': palette },
      LOW_THEME: palette,
      ACCENTS: ['#a4de95'],
      LOW_ACCENTS: ['#a4de95'],
      parts,
    },
  });
})();
