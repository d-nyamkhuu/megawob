/* Open Look (Sun, 1992) reference frame. Task state and rotations belong to the rotate task. */
(function () {
  'use strict';
  const NOTES = [
    ['Software Update Available', 'A new version is ready.'],
    ['Meeting Reminder', 'Team sync in 10 minutes.'],
    ['Print Job Complete', 'Document ready at printer.'],
    ['Low Disk Space', 'You have 500 MB remaining.'],
    ['New Mail (3)', 'You have 3 unread messages.'],
    ['Calendar Notification', 'Lunch with Alex at 12:30 PM.'],
  ];
  const PIN = 'M4 1Q8 0 12 1V3H11V9Q13 11 12 13H9L8 20L7 13H4Q3 11 5 9V3H4Z';
  function pin(parent, w, h) {
    const svg = env.util.svg('svg', { width: w, height: h, viewBox: '0 0 16 20', 'aria-hidden': 'true' }, parent);
    env.util.svg('path', { d: PIN, fill: '#111' }, svg);
    return svg;
  }
  function winBtn(parent, kind) {
    const b = env.util.el('button', 'ol-winbtn ' + kind, parent);
    b.type = 'button'; b.setAttribute('aria-label', kind);
    const s = env.util.svg('svg', { width: 18, height: 18, viewBox: '0 0 18 18', 'aria-hidden': 'true' }, b);
    const d = { minimize: 'M4 13H14', maximize: 'M4 4H14V14H4Z', close: 'M4 4L14 14M14 4L4 14' }[kind];
    env.util.svg('path', { d, fill: 'none', stroke: '#111', 'stroke-width': 2.2 }, s);
    return b;
  }
  // Notification stack shown in the stage's right margin; "Dismiss all" clears it.
  function drawStack(host, onDismiss) {
    const u = env.util;
    const el = u.el('section', 'ol-notes reference-initial', host);
    el.setAttribute('aria-label', 'Notifications');
    const head = u.el('div', 'ol-notes-head', el);
    const title = u.el('span', '', head, 'Notifications (6)');
    const min = u.el('button', 'ol-notes-min', head, '–'); min.type = 'button'; min.setAttribute('aria-label', 'Collapse');
    const list = u.el('div', 'ol-notes-list', el);
    NOTES.forEach(([t, m]) => {
      const card = u.el('div', 'ol-note', list);
      pin(card, 18, 24);
      const tx = u.el('div', 'ol-note-text', card);
      u.el('b', '', tx, t); u.el('span', '', tx, m);
      const x = u.el('button', 'ol-note-x', card, '×'); x.type = 'button'; x.setAttribute('aria-label', 'Dismiss notification');
      x.onclick = () => { card.remove(); const n = list.children.length; title.textContent = `Notifications (${n})`; };
    });
    const dismiss = u.el('button', 'ol-dismiss-all', el, 'Dismiss all'); dismiss.type = 'button';
    dismiss.onclick = () => onDismiss('dismiss-all');
    return { el, dismiss };
  }
  function drawOverlay(ctx) {
    const u = ctx.util;
    if (ctx.kind === 'chat') {
      const stack = drawStack(document.body, (reason) => ctx.dismiss(reason));
      stack.el.classList.add('ol-overlay-stack');
      stack.el.setAttribute('role', 'dialog');
      if (ctx.initial) stack.dismiss.addEventListener('click', () => env.log('reference-obstruction-dismiss', { reason: 'dismiss-all' }));
      return { el: stack.el, dismiss: stack.dismiss, ttlSteps: 0 };
    }
    const el = u.el('section', 'tour-bubble overlay-' + ctx.kind, document.body);
    el.setAttribute('role', 'dialog');
    const content = {
      chat: ['Notice', 'Take a quick tour to learn the controls.', 'Start tour', 'Skip tour'],
      cookie: ['Your privacy', 'Allow optional cookies for this workspace?', 'Accept optional', 'Reject optional'],
      toast: ['Pointer Trainer', 'Your current workspace is ready to continue.', null, 'Dismiss'],
      promo: ['More practice', 'Explore more exercises after completing this task.', 'Show details', 'Not now'],
      banner: ['Workspace notice', 'This practice session works offline.', null, 'Dismiss'],
    }[ctx.kind];
    const h = u.el('h2', '', el, content[0]);
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
    void h;
    return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0 };
  }
  const palette = { bg: '#bfc3c6', panel: '#c9cdd3', fg: '#111111', muted: '#222222', line: '#767c80' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
      document.body.classList.remove('ref-has-note');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('openlook', 'instruction-' + _c.display);
      const titlebar = u.el('header', 'ol-title', document.body);
      const logo = u.el('div', 'ol-logo', titlebar);
      const mark = u.svg('svg', { viewBox: '0 0 32 32', width: 28, height: 28 }, logo);
      u.svg('path', { d: 'M16 1L31 16L16 31L1 16Z M16 5L27 16L16 27L5 16Z M10 13L16 7L19 10L13 16L16 19L22 13L25 16L16 25L7 16Z M13 10L22 19 M10 16L19 25', fill: 'none', stroke: '#111', 'stroke-width': 1.2 }, mark);
      const brand = u.el('div', 'ol-brand', logo);
      u.el('i', '', brand, 'Sun');
      u.el('small', '', brand, 'MICROSYSTEMS');
      u.el('span', 'ol-title-text', titlebar, 'Pointer Trainer');
      const wa = u.el('div', 'ol-winbtns', titlebar);
      for (const k of ['minimize', 'maximize', 'close']) winBtn(wa, k);
      const head = u.el('section', 'ol-head', document.body);
      if (_c.display !== 'header') {
        const heading = u.el('h1', 'ol-workspace-title', head, 'Pointer Trainer');
        heading.style.fontSize = `min(3.35vw, ${170 / heading.textContent.length}vw)`;
      }
      Object.assign(_c, { titlebar, header: head });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('instruction');
        note.style.fontSize = `min(3.35vw, ${170 / Math.max(1, note.textContent.length)}vw)`;
        if (note.textContent.length > 100) note.style.fontSize = 'clamp(18px,2.4vw,40px)';
      }
      _c.util.el('p', 'task-helper', _c.header, _c.display === 'header'
        ? 'Use the rotation handle to change the pointer’s angle.  The task will start after you dismiss notifications.'
        : 'Use the rotation handle to change the pointer’s angle.');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.titlebar;
      base(_c);
      _c.header = header;
      _c.headerTools.classList.add('ol-head-tools');
    },
    'frame.body': () => (_c) => {
      const band = _c.util.el('section', 'ol-main', document.body);
      Object.assign(_c, { body: band });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
      const note = _c.header.querySelector('.ref-panel');
      if (note) {
        note.classList.add('ol-task-note', 'ol-task-panel');
        const heading = note.querySelector('.ref-panel-title');
        heading.classList.add('ol-task-note-head');
        heading.textContent = 'Instructions';
        heading.prepend(pin(null, 16, 20));
        note.querySelector('.ref-panel-text').classList.add('instruction', 'ol-task-text');
      }
    },
    'frame.stage': () => (_c) => {
      const stage = _c.util.el('main', 'cube-stage', _c.body);
      stage.dataset.role = 'stage';
      _c.util.el('div', 'ol-side', _c.body);
      _c.stage = stage;
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ol-task-note', 'ol-task-toast');
        _c.header.appendChild(note);
        const heading = _c.util.el('div', 'ol-task-note-head');
        pin(heading, 16, 20);
        _c.util.el('span', '', heading, 'Task notice');
        heading.appendChild(note.querySelector('.ref-note-x'));
        note.prepend(heading);
        note.querySelector('.ref-note-text').classList.add('instruction', 'ol-task-text');
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ol-foot');
      foot.querySelector('.ref-foot-text').hidden = true;
      const u = _c.util;
      const help = u.el('button', 'ol-btn ol-help', foot); help.type = 'button';
      pin(help, 22, 28); u.el('span', '', help, 'Help'); u.el('i', 'ol-caret', help);
      const reset = u.el('button', 'ol-btn ol-reset', foot, 'Reset'); reset.type = 'button'; reset.disabled = true;
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => drawOverlay,
  };
  env.site({
    name: 'design-rotate-object-orient-11',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    initialOverlay: { kind: 'chat' },
    design: {
      THEMES: { 'design-rotate-object-orient-11': palette },
      LOW_THEME: palette,
      ACCENTS: ['#222222'],
      LOW_ACCENTS: ['#222222'],
      parts,
    },
  });
})();
