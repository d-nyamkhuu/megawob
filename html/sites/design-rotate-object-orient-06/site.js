/* Plain HTML form design on the shared site frame. */
(function () {
  'use strict';
  function drawOverlay(ctx) {
    const u = ctx.util;
    const el = u.el('section', 'plain-notice overlay-' + ctx.kind, document.body);
    el.setAttribute('role', 'dialog');
    const content = {
      chat: ['Welcome', 'Take a quick tour to learn the controls.', 'Start tour', 'Skip tour'],
      cookie: ['Your privacy', 'Allow optional cookies for this page?', 'Accept optional', 'Reject optional'],
      toast: ['Saved', 'Your current work is ready to continue.', null, 'Dismiss'],
      promo: ['More exercises', 'Explore more exercises after completing this task.', 'Show details', 'Not now'],
      banner: ['Notice', 'This page works offline.', null, 'Dismiss'],
    }[ctx.kind];
    u.el('h2', '', el, content[0]);
    const close = u.el('button', 'bubble-close', el, '×');
    close.type = 'button'; close.setAttribute('aria-label', 'Close notice');
    close.onclick = () => ctx.dismiss('close');
    const message = u.el('p', '', el, content[1]);
    const actions = u.el('div', 'notice-actions', el);
    if (content[2]) {
      const primary = u.el('button', 'form-btn', actions, content[2]); primary.type = 'button';
      primary.onclick = () => {
        if (ctx.kind === 'cookie') ctx.dismiss('accept');
        else { message.textContent = 'Drag the round handle to turn the shape. Follow the instruction on the page.'; primary.hidden = true; }
      };
    }
    const dismiss = u.el('button', 'form-btn', actions, content[3]); dismiss.type = 'button';
    dismiss.onclick = () => ctx.dismiss('skip');
    return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0 };
  }
  const palette = { bg: '#fff', panel: '#fff', fg: '#000', muted: '#444', line: '#999' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.className = 'plain-form instruction-' + _c.display;
      const left = u.el('aside', 'col col-left', document.body);
      u.el('h2', 'col-head', left, 'Tools');
      const rl = u.el('button', 'form-btn tool-btn', left, 'Rotate Left'); rl.type = 'button'; rl.dataset.tool = 'left';
      const rr = u.el('button', 'form-btn tool-btn', left, 'Rotate Right'); rr.type = 'button'; rr.dataset.tool = 'right';
      u.el('hr', 'sep', left);
      u.el('h2', 'col-head help-head', left, 'Help');
      const help = u.el('p', 'help-text', left);
      for (const line of ['Drag the handle on', 'the shape to rotate it.', 'Use the round handle', 'to adjust the shape.']) {
        u.el('span', 'help-line', help, line);
      }
      const center = u.el('section', 'center', document.body);
      const right = u.el('aside', 'col col-right', document.body);
      u.el('h2', 'col-head', right, 'Action');
      const reset = u.el('button', 'form-btn tool-btn', right, 'Reset'); reset.type = 'button'; reset.dataset.tool = 'reset';
      Object.assign(_c, { left, center, right, header: center });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.right;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.center; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.left;
      base(_c);
      _c.body = body;
      const title = _c.left.querySelector('.ref-panel-title');
      if (title) title.textContent = 'Task';
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.center);
      _c.stage.dataset.role = 'stage';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.querySelector('.ref-note-x').textContent = _c.closeLabel;
        _c.center.insertBefore(note, _c.stage);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.right.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.right.appendChild(dock);
    },
    overlay: () => drawOverlay,
  };
  env.site({
    name: 'design-rotate-object-orient-06',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-rotate-object-orient-06': palette },
      LOW_THEME: palette,
      ACCENTS: ['#000'],
      LOW_ACCENTS: ['#000'],
      parts,
    },
  });
})();
