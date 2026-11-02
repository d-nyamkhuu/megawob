/* 2002 Flash-style "Angle Challenge" design on the shared site frame. */
(function () {
  'use strict';
  function drawOverlay(ctx) {
    const u = ctx.util;
    const el = u.el('section', 'tour-bubble overlay-' + ctx.kind, document.body);
    el.setAttribute('role', 'dialog');
    const content = {
      chat: ['Welcome!', 'Take a quick tour to learn the controls.', 'Start tour', 'Skip tour'],
      cookie: ['Your privacy', 'Allow optional cookies for this practice workspace?', 'Accept optional', 'Reject optional'],
      toast: ['Practice saved', 'Your current workspace is ready to continue.', null, 'Dismiss'],
      promo: ['Discover more practice', 'Explore more exercises after completing this task.', 'Show details', 'Not now'],
      banner: ['Workspace notice', 'This practice session works offline.', null, 'Dismiss'],
    }[ctx.kind];
    u.el('h2', '', el, content[0]);
    const close = u.el('button', 'bubble-close', el, '×');
    close.type = 'button'; close.setAttribute('aria-label', 'Close notice');
    close.onclick = () => ctx.dismiss('close');
    const message = u.el('p', '', el, content[1]);
    const actions = u.el('div', 'tour-actions', el);
    if (content[2]) {
      const primary = u.el('button', 'tour-primary', actions, content[2]); primary.type = 'button';
      primary.onclick = () => {
        if (ctx.kind === 'cookie') ctx.dismiss('accept');
        else { message.textContent = 'Drag the round handle to turn the pointer toward the target.'; primary.hidden = true; }
      };
    }
    const dismiss = u.el('button', 'tour-dismiss', actions, content[3]); dismiss.type = 'button';
    dismiss.onclick = () => ctx.dismiss('skip');
    return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0 };
  }
  const palette = { bg: '#c3d9f2', panel: '#dbe8f7', fg: '#0f2250', muted: '#4a5a78', line: '#8fa6c4' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('flash-angle', 'instruction-' + _c.display);
      const top = u.el('header', 'topbar', document.body);
      u.el('div', 'app-title', top, 'Angle Challenge');
      u.el('div', 'app-tag', top, 'Turn. Match.');
      const side = u.el('aside', 'side-panel', document.body);
      u.el('div', 'side-rule rule-a', side);
      u.el('h2', 'side-head', side, 'Rotate Pointer');
      if (!_c.ctx.finish) u.el('div', 'side-rule rule-b', side);
      Object.assign(_c, { header: top, side });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (!note) return;
      note.classList.add('instruction');
      const text = note.textContent;
      note.textContent = '';
      const span = _c.util.el('span', '', note, text);
      const measure = document.createElement('canvas').getContext('2d');
      const style = getComputedStyle(span);
      measure.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
      if (measure.measureText(text).width > note.clientWidth * 0.86) note.classList.add('long-instruction');
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
      if (_c.headerTools.children.length) _c.header.classList.add('has-end');
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'angle-body', document.body);
    },
    'frame.panel': (base) => (_c) => {
      // The original panel note occupies the upper left of the main workspace.
      base(_c);
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'angle-stage', _c.body);
      _c.stage.dataset.role = 'stage';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        _c.body.appendChild(note);
        note.querySelector('.ref-note-x').textContent = 'Close';
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.side.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.side.appendChild(dock);
    },
    overlay: () => drawOverlay,
  };
  env.site({
    name: 'design-rotate-object-orient-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-rotate-object-orient-02': palette },
      LOW_THEME: palette,
      ACCENTS: ['#2b4a8c'],
      LOW_ACCENTS: ['#2b4a8c'],
      parts,
    },
  });
})();
