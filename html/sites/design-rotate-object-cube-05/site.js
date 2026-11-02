/* Industrial Linux calibration utility frame. Task state and rotations belong to the rotate task. */
(function () {
  'use strict';
  function icon(parent, name, size = 24) {
    const paths = {
      close: 'M5 5L21 21M21 5L5 21', minimize: 'M5 20H21', maximize: 'M7 9H20V22H7ZM10 5H24V19',
    };
    const svg = env.util.svg('svg', { width: size, height: size, viewBox: '0 0 28 28', 'aria-hidden': 'true' }, parent);
    env.util.svg('path', { d: paths[name], fill: 'none', stroke: 'currentColor', 'stroke-width': 2.4 }, svg);
    return svg;
  }
  function drawOverlay(ctx) {
    const u = ctx.util;
    const el = u.el('section', 'tour-bubble overlay-' + ctx.kind, document.body);
    el.setAttribute('role', 'dialog');
    const content = {
      chat: ['Welcome to Cube Calibration', 'Take a quick tour to learn the controls and features.', 'Start tour', 'Skip tour'],
      cookie: ['Your privacy', 'Allow optional cookies for this calibration workspace?', 'Accept optional', 'Reject optional'],
      toast: ['Session saved', 'Your current workspace is ready to continue.', null, 'Dismiss'],
      promo: ['Discover more exercises', 'Explore more exercises after completing this task.', 'Show details', 'Not now'],
      banner: ['Workspace notice', 'This calibration session works offline.', null, 'Dismiss'],
    }[ctx.kind];
    u.el('h2', '', el, content[0]);
    const close = u.el('button', 'bubble-close', el);
    close.type = 'button'; close.setAttribute('aria-label', 'Close notice'); icon(close, 'close', 20);
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
  function readout(parent, u, rows, cls) {
    const box = u.el('div', 'readout ' + (cls || ''), parent);
    for (const [k, v, bad] of rows) {
      const r = u.el('div', 'ro-row', box);
      u.el('span', 'ro-k', r, k); u.el('span', 'ro-c', r, ':'); u.el('span', 'ro-v' + (bad ? ' bad' : ''), r, v);
    }
    return box;
  }
  function group(parent, u, title, cls) {
    const g = u.el('section', 'group ' + (cls || ''), parent);
    u.el('h3', '', g, title);
    return g;
  }
  const palette = { bg: '#bdbcb5', panel: '#c5c3ba', fg: '#111111', muted: '#3a2b2b', line: '#77776e' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original inspector and status well fit the notes at every viewport.
      _c.display = _c.ctx.display || 'header';
      document.body.classList.add('linux-cube', 'instruction-' + _c.display);
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const titlebar = u.el('header', 'titlebar', document.body);
      u.el('i', 'title-icon', titlebar);
      u.el('span', 'title-text', titlebar, 'Cube Calibration Utility');
      u.el('span', 'title-ver', titlebar, 'v1.3.2');
      const windowActions = u.el('div', 'window-actions', titlebar);
      for (const action of ['minimize', 'maximize', 'close']) {
        const b = u.el('button', 'window-action ' + action, windowActions);
        b.type = 'button'; b.setAttribute('aria-label', action); icon(b, action, 18);
      }
      const menu = u.el('nav', 'menubar', document.body);
      for (const m of ['File', 'View', 'Tools', 'Help']) u.el('span', '', menu, m);
      const work = u.el('section', 'workbench', document.body);
      u.el('h2', 'panel-title', work, 'Orientation Task');
      const helper = u.el('p', 'task-helper', work);
      helper.hidden = true;
      Object.assign(_c, { header: work, menu, work });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('instruction');
        const text = _c.util.el('span', 'instruction-text');
        text.textContent = note.textContent;
        note.replaceChildren(text);
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.menu;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const insp = u.el('aside', 'inspector', document.body);
      u.el('h2', 'panel-title', insp, 'Inspector');
      const g1 = group(insp, u, 'Cube Orientation (degrees)', 'orientation-group');
      readout(g1, u, [['X (pitch)', '-18'], ['Y (yaw)', '34'], ['Z (roll)', '0']], 'orient');
      const g2 = group(insp, u, 'Visible Faces', 'faces-group');
      readout(g2, u, [['Front', '(none)'], ['Top', 'yellow'], ['Right', 'red'], ['Left', 'purple'], ['Bottom', '(none)'], ['Back', '(none)']]);
      const g3 = group(insp, u, 'Target', 'target-group');
      const target = readout(g3, u, [['Object', 'cube'], ['Status', 'not aligned', true]], 'target');
      // Keep the widget's status slots, but never expose its duplicate goal.
      const value = target.querySelector('.ro-v');
      value.hidden = true;
      u.el('span', 'object-name', value.parentElement, 'cube');
      const g4 = group(insp, u, 'Instructions', 'instr-group');
      const ins = u.el('div', 'readout notes', g4);
      if (_c.display !== 'panel') {
        u.el('div', '', ins, '1. Click and drag the cube to rotate it.');
        u.el('div', '', ins, '2. Check that the rotation is correct.');
      }
      if (_c.display === 'hidden') g4.hidden = true;
      Object.assign(_c, { body: _c.work, panelSlot: ins });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.panelSlot;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'cube-stage', _c.work);
      _c.stage.dataset.role = 'stage';
    },
    'frame.toast': (base) => (_c) => {
      const u = _c.util;
      const strip = u.el('div', 'action-strip', _c.work);
      const status = u.el('div', 'status-well', strip);
      const view = u.el('div', 'view-group', strip);
      u.el('h3', '', view, 'View');
      const vb = u.el('div', 'view-buttons', view);
      const reset = u.el('button', 'eng-button', vb); reset.type = 'button'; reset.dataset.action = 'reset';
      u.el('span', '', reset, 'Reset View');
      const rs = u.svg('svg', { viewBox: '0 0 28 28', width: 26, height: 26, 'aria-hidden': 'true' }, reset);
      u.svg('circle', { cx: 14, cy: 14, r: 8, fill: 'none', stroke: '#2a2626', 'stroke-width': 2 }, rs);
      u.svg('path', { d: 'M14 2V9M14 19V26M2 14H9M19 14H26', stroke: '#2a2626', 'stroke-width': 2 }, rs);
      const fit = u.el('button', 'eng-button', vb); fit.type = 'button'; fit.dataset.action = 'fit';
      u.el('span', '', fit, 'Fit to Window');
      const fs = u.svg('svg', { viewBox: '0 0 28 28', width: 26, height: 26, 'aria-hidden': 'true' }, fit);
      u.svg('path', { d: 'M3 10V3H10M18 3H25V10M25 18V25H18M10 25H3V18', fill: 'none', stroke: '#2a2626', 'stroke-width': 2.4 }, fs);
      const sub = u.el('div', 'submit-well', strip);
      Object.assign(_c, { status, sub });
      base(_c);
      if (_c.display === 'toast') status.appendChild(document.body.querySelector('.ref-note'));
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      _c.status.appendChild(foot);
      const submit = foot.querySelector('.ref-submit');
      if (submit) _c.sub.appendChild(submit);
      _c.util.el('footer', 'statusbar', document.body);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.instruction-text');
      if (note && note.scrollWidth > 0) {
        const available = note.parentElement.clientWidth - 24;
        if (available > 0) note.style.transform = 'scaleX(' + Math.min(1, available / note.scrollWidth) + ')';
      }
    },
    overlay: () => drawOverlay,
  };
  env.site({
    name: 'design-rotate-object-cube-05',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-rotate-object-cube-05': palette },
      LOW_THEME: palette,
      ACCENTS: ['#5c0b1b'],
      LOW_ACCENTS: ['#5c0b1b'],
      parts,
    },
  });
})();
