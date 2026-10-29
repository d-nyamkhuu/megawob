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
  env.site({
    name: 'design-rotate-object-cube-05', styles: ['site.css'], scripts: [],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = `linux-cube instruction-${ctx.display}`;
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
      const heading = u.el('h1', 'instruction', work);
      const instructionText = u.el('span', 'instruction-text', heading, ctx.instruction);
      if (ctx.display === 'hidden') heading.hidden = true;
      if (ctx.display === 'toast') {
        const close = u.el('button', 'instruction-dismiss', heading, 'Close');
        close.type = 'button'; close.onclick = () => { heading.hidden = true; };
      }
      const helper = u.el('p', 'task-helper', work, ''); helper.hidden = true;
      const stage = u.el('main', 'cube-stage', work);
      stage.dataset.role = 'stage';
      const strip = u.el('div', 'action-strip', work);
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
      let submit = null;
      const sub = u.el('div', 'submit-well', strip);
      const endRng = ctx.rng.fork('chrome/end');
      const defaultLabel = 'Submit';
      const labels = ctx.content && Array.isArray(ctx.content.END_LABELS) ? ctx.content.END_LABELS :
        ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const keepOriginal = !ctx.finish && endRng.bool(0.5);
      const placement = ctx.finish ? null : keepOriginal ? 'footer' : endRng.pick(['toolbar', 'link']);
      const label = keepOriginal ? defaultLabel : (endRng.pick(labels) || defaultLabel);
      const makeEnd = (parent, cls, text, isLink) => {
        const b = u.el(isLink ? 'a' : 'button', cls, parent, text);
        if (isLink) b.href = '#'; else b.type = 'button';
        b.dataset.role = 'submit'; b.title = label; b.setAttribute('aria-label', label);
        b.onclick = (e) => { e.preventDefault(); ctx.submit(); };
        return b;
      };
      const decoyBtn = (parent, text, collide) => {
        const b = u.el('button', collide ? 'chrome-xtra collide' : 'chrome-xtra', parent, text);
        b.type = 'button'; b.dataset.role = 'xtra';
        b.onclick = () => env.log('decoy', collide ? { label: text, collide: true } : { label: text });
        return b;
      };
      let collide = null;
      const collideRng = ctx.rng.fork('chrome/collide');
      if (!ctx.finish && collideRng.bool(0.3)) {
        const own = String(label).trim().toLowerCase();
        const options = [...new Set(labels.map(x => typeof x === 'string' ? x : (x.label || x.text || x.name || String(x))))]
          .filter(x => String(x).trim().toLowerCase() !== own);
        if (options.length) collide = collideRng.pick(options);
      }
      if (!ctx.finish && placement === 'footer') submit = makeEnd(sub, 'submit-button', label, false);
      if (!ctx.finish && placement === 'link') submit = makeEnd(status, 'submit-link', `${label} ›`, true);
      if (!ctx.finish && placement === 'toolbar') submit = makeEnd(menu, 'toolbar-end', label, false);
      if (collide) {
        const parent = placement === 'toolbar' ? menu : status;
        decoyBtn(parent, collide, true);
      }
      if (ctx.display === 'toast') {
        const note = u.el('div', 'task-toast-note', status, ctx.instruction);
        note.setAttribute('role', 'status');
      }

      const insp = u.el('aside', 'inspector', document.body);
      u.el('h2', 'panel-title', insp, 'Inspector');
      const g1 = group(insp, u, 'Cube Orientation (degrees)', 'orientation-group');
      readout(g1, u, [['X (pitch)', '-18'], ['Y (yaw)', '34'], ['Z (roll)', '0']], 'orient');
      const g2 = group(insp, u, 'Visible Faces', 'faces-group');
      readout(g2, u, [['Front', '(none)'], ['Top', 'yellow'], ['Right', 'red'], ['Left', 'purple'], ['Bottom', '(none)'], ['Back', '(none)']]);
      const g3 = group(insp, u, 'Target', 'target-group');
      readout(g3, u, [['Required Face', 'purple'], ['Status', 'not aligned', true]], 'target');
      const g4 = group(insp, u, 'Instructions', 'instr-group');
      const ins = u.el('div', 'readout notes', g4);
      if (ctx.display === 'panel') u.el('div', 'panel-instruction', ins, ctx.instruction);
      else {
        u.el('div', '', ins, '1. Click and drag the cube to rotate it.');
        u.el('div', '', ins, '2. Check that the rotation is correct.');
      }
      if (ctx.display === 'hidden') g4.hidden = true;
      if (ctx.display !== 'header') heading.hidden = true;
      u.el('footer', 'statusbar', document.body);
      const available = heading.clientWidth - (ctx.display === 'toast' ? 120 : 24);
      if (available > 0 && instructionText.scrollWidth > 0) {
        instructionText.style.transform = `scaleX(${Math.min(1, available / instructionText.scrollWidth)})`;
      }
      return { stage, submit };
    },
    overlay: drawOverlay,
  });
})();
