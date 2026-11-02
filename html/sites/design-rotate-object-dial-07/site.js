/* GEM-style "Enviro Control" window. Task state and rotations belong to the rotate task. */
(function () {
  'use strict';
  function icon(parent, name, size = 24) {
    const svg = env.util.svg('svg', { width: size, height: size, viewBox: '0 0 28 28', 'aria-hidden': 'true' }, parent);
    const S = { fill: 'none', stroke: 'currentColor', 'stroke-width': 2.4 };
    const P = (d, extra) => env.util.svg('path', Object.assign({ d }, S, extra || {}), svg);
    if (name === 'close') P('M5 5L23 23M23 5L5 23');
    else if (name === 'minimize') P('M5 22H22');
    else if (name === 'maximize') P('M5 5H23V23H5Z');
    else if (name === 'reset') { P('M22 14A8 8 0 1 1 18 7'); env.util.svg('path', { d: 'M16 2L23 6L17 11Z', fill: 'currentColor' }, svg); }
    else if (name === 'gear' || name === 'gear2') {
      for (let i = 0; i < 8; i++) {
        const a = i * Math.PI / 4;
        P(`M${14 + Math.cos(a) * 8}, ${14 + Math.sin(a) * 8}L${14 + Math.cos(a) * 12},${14 + Math.sin(a) * 12}`, { 'stroke-width': 3.4 });
      }
      env.util.svg('circle', Object.assign({ cx: 14, cy: 14, r: 8 }, S), svg);
      env.util.svg('circle', Object.assign({ cx: 14, cy: 14, r: name === 'gear' ? 3 : 4.5 }, S), svg);
    }
    return svg;
  }
  function drawOverlay(ctx) {
    const u = ctx.util;
    const el = u.el('section', 'gem-dialog overlay-' + ctx.kind, document.body);
    el.setAttribute('role', 'dialog');
    const content = {
      chat: ['Help', 'Drag the knob around its dial to change the value.', 'Show tip', 'Skip'],
      cookie: ['Privacy', 'Allow optional cookies for this utility?', 'Accept optional', 'Reject optional'],
      toast: ['Saved', 'Your current settings are ready to continue.', null, 'Dismiss'],
      promo: ['More utilities', 'Explore more control panels after this task.', 'Show details', 'Not now'],
      banner: ['Notice', 'This utility works offline.', null, 'Dismiss'],
    }[ctx.kind];
    const bar = u.el('h2', 'gem-dialog-title', el, content[0]);
    const close = u.el('button', 'bubble-close', bar);
    close.type = 'button'; close.setAttribute('aria-label', 'Close notice'); icon(close, 'close', 16);
    close.onclick = () => ctx.dismiss('close');
    const message = u.el('p', '', el, content[1]);
    const actions = u.el('div', 'tour-actions', el);
    if (content[2]) {
      const primary = u.el('button', 'tour-primary', actions, content[2]); primary.type = 'button';
      primary.onclick = () => {
        if (ctx.kind === 'cookie') ctx.dismiss('accept');
        else { message.textContent = 'Press on the knob and drag around the dial; the needle follows the pointer.'; primary.hidden = true; }
      };
    }
    const dismiss = u.el('button', 'tour-dismiss', actions, content[3]); dismiss.type = 'button';
    dismiss.onclick = () => ctx.dismiss('skip');
    return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0 };
  }
  const palette = { bg: '#f2f2f0', panel: '#f6f6f4', fg: '#111', muted: '#111', line: '#111' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // Match the original note fallbacks in the compact window.
      if ((_c.display === 'panel' || _c.display === 'toast') && (!_c.roomy || !_c.tall)) _c.display = 'header';
      document.body.className = `gem-dial instruction-${_c.display}`;
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const win = u.el('div', 'gem-window', document.body);
      const titlebar = u.el('header', 'titlebar', win);
      u.el('span', 'title-text', titlebar, 'Enviro Control');
      const windowActions = u.el('div', 'window-actions', titlebar);
      for (const action of ['minimize', 'maximize', 'close']) {
        const b = u.el('button', 'window-action ' + action, windowActions);
        b.type = 'button'; b.setAttribute('aria-label', action); icon(b, action, 32);
      }
      const row = u.el('div', 'gem-row', win);
      const task = u.el('section', 'gem-pane task-pane', row);
      u.el('h2', 'pane-title', task, 'Task');
      const pane = u.el('div', 'pane-body', task);
      const notes = u.el('div', 'gem-notes', pane);
      Object.assign(_c, { win, titlebar, windowActions, row, pane, notes, header: notes });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.notes.querySelector('.ref-instruction');
      if (note) note.classList.add('instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.titlebar;
      base(_c);
      _c.header = header;
      _c.titlebar.insertBefore(_c.headerTools, _c.windowActions);
    },
    'frame.body': () => (_c) => {
      _c.body = _c.row;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.notes;
      base(_c);
      _c.body = body;
      const text = _c.notes.querySelector('.ref-panel-text');
      if (text) text.classList.add('instruction');
      const u = _c.util;
      const rule = u.el('hr', 'rule', _c.pane);
      if (_c.display === 'hidden') rule.hidden = true;
      u.el('p', 'task-helper', _c.pane, 'Adjust the dial in the workspace to reach the target temperature.');
      const facts = u.el('dl', 'task-facts', _c.pane);
      for (const [key, label] of [['target', 'Target:'], ['current', 'Current:'], ['units', 'Units:']]) {
        const term = u.el('dt', '', facts, label);
        const value = u.el('dd', '', facts);
        value.dataset.fact = key;
        // The widget populates these slots; the goal belongs only in the template note.
        if (key === 'target') {
          term.style.visibility = value.style.visibility = 'hidden';
          term.setAttribute('aria-hidden', 'true');
          value.setAttribute('aria-hidden', 'true');
        }
      }
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      const work = u.el('section', 'gem-pane work-pane', _c.row);
      u.el('h2', 'pane-title', work, 'Room Temperature Control');
      const stage = u.el('main', 'cube-stage', work);
      stage.dataset.role = 'stage';
      _c.stage = stage;
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.pane.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const u = _c.util;
      const strip = u.el('footer', 'gem-strip', _c.win);
      const mk = (cls, label, ic) => {
        const b = u.el('button', 'gem-btn ' + cls, strip);
        b.type = 'button';
        if (ic) icon(b, ic, 48);
        u.el('span', '', b, label);
        return b;
      };
      mk('btn-reset', 'Reset', 'reset');
      mk('btn-small', 'Smaller Step', 'gear');
      mk('btn-large', 'Larger Step', 'gear2');
      u.el('span', 'strip-gap', strip);
      const foot = document.body.querySelector('.ref-foot');
      strip.appendChild(foot);
      mk('btn-close', 'Close');
      Object.assign(_c, { strip, foot });
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.win.querySelector('.task-pane').appendChild(dock);
    },
    overlay: () => drawOverlay,
  };
  env.site({
    name: 'design-rotate-object-dial-07',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-rotate-object-dial-07': palette },
      LOW_THEME: palette,
      ACCENTS: ['#111'],
      LOW_ACCENTS: ['#111'],
      parts,
    },
  });
})();
