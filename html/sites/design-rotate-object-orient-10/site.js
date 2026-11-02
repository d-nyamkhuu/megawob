/* Dark developer document with margin notes, on the shared site frame. */
(function () {
  'use strict';
  function drawOverlay(ctx) {
    const u = ctx.util;
    const el = u.el('section', 'tour-bubble overlay-' + ctx.kind, document.body);
    el.setAttribute('role', 'dialog');
    const content = {
      chat: ['Quick tour', 'Take a short tour to learn the controls.', 'Start tour', 'Skip tour'],
      cookie: ['Your privacy', 'Allow optional cookies for this workspace?', 'Accept optional', 'Reject optional'],
      toast: ['Session saved', 'Your current workspace is ready to continue.', null, 'Dismiss'],
      promo: ['More exercises', 'Explore more exercises after completing this task.', 'Show details', 'Not now'],
      banner: ['Workspace notice', 'This session works offline.', null, 'Dismiss'],
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
        else { message.textContent = 'Drag the round rotation handle to turn the arrow toward the star.'; primary.hidden = true; }
      };
    }
    const dismiss = u.el('button', 'tour-dismiss', actions, content[3]); dismiss.type = 'button';
    dismiss.onclick = () => ctx.dismiss('skip');
    return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0 };
  }
  const palette = { bg: '#0d1215', panel: '#0d1215', fg: '#c3cad4', muted: '#8b95a3', line: '#2a313c' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // This design has a dedicated note pane even at the smallest viewport.
      _c.display = _c.ctx.display || 'header';
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('devdoc', 'instruction-' + _c.display);
      const doc = u.el('section', 'doc', document.body);
      const head = u.el('header', 'doc-head', doc);
      u.el('span', 'app-name', head, 'Orientation Lab');
      u.el('i', 'head-sep', head);
      u.el('i', 'live-dot', head);
      u.el('span', 'app-sub', head, 'Interactive Geometry');
      const margin = u.el('aside', 'margin', document.body);
      u.el('div', 'margin-label', margin, 'ROTATION TASK');
      const note = u.el('div', 'note-slot', margin);
      u.el('hr', 'rule', margin);
      const helper = u.el('p', 'task-helper', margin);
      ['Click and drag the center handle', 'to rotate the arrow. The workspace', 'updates as the object turns.'].forEach(line => u.el('span', '', helper, line));
      u.el('hr', 'rule', margin);
      const row = u.el('div', 'actions-row', margin);
      u.el('span', 'margin-label', row, 'ACTIONS');
      const reset = u.el('button', 'reset-button', row);
      reset.type = 'button'; reset.dataset.action = 'reset';
      u.el('i', 'reset-ring', reset); u.el('span', '', reset, 'Reset');
      const toolbar = u.el('div', 'margin-tools', margin);
      Object.assign(_c, { doc, head, margin, note, toolbar, header: note });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.doc; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.note;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'doc-stage', _c.doc);
      _c.stage.dataset.role = 'stage';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.querySelector('.ref-note-x').textContent = _c.closeLabel;
        _c.note.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.margin.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.margin.appendChild(dock);
    },
    overlay: () => drawOverlay,
  };
  env.site({
    name: 'design-rotate-object-orient-10',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-rotate-object-orient-10': palette },
      LOW_THEME: palette,
      ACCENTS: ['#65e77a'],
      LOW_ACCENTS: ['#65e77a'],
      parts,
    },
  });
})();
