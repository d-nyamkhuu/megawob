/* CubeLab 2002 flash-vector ribbon frame. Task state and rotations belong to the rotate task. */
(function () {
  'use strict';
  function icon(parent, name, size = 24) {
    const paths = { close: 'M5 5L21 21M21 5L5 21' };
    const svg = env.util.svg('svg', { width: size, height: size, viewBox: '0 0 28 28', 'aria-hidden': 'true' }, parent);
    env.util.svg('path', { d: paths[name], fill: 'none', stroke: 'currentColor', 'stroke-width': 1.7 }, svg);
    return svg;
  }
  // Small isometric cube glyph; top/left/right fills choose the highlighted face.
  function cubeGlyph(parent, top, left, right, extra) {
    const svg = env.util.svg('svg', { viewBox: '0 0 40 40', 'aria-hidden': 'true', class: 'glyph' }, parent);
    const s = '#172548';
    env.util.svg('path', { d: 'M8 14L24 2L37 7L22 21Z', fill: top, stroke: s, 'stroke-width': 1.2 }, svg);
    env.util.svg('path', { d: 'M8 14L22 21V38L8 31Z', fill: left, stroke: s, 'stroke-width': 1.2 }, svg);
    env.util.svg('path', { d: 'M37 7L22 21V38L37 25Z', fill: right, stroke: s, 'stroke-width': 1.2 }, svg);
    if (extra === 'rotate') {
      env.util.svg('path', { d: 'M28 2L38 3L34 0M15 38L6 35L9 33', fill: 'none', stroke: s, 'stroke-width': 1.7 }, svg);
    }
    if (extra === 'zoom') {
      env.util.svg('circle', { cx: 9, cy: 28, r: 6, fill: '#fff8', stroke: '#222', 'stroke-width': 2 }, svg);
      env.util.svg('path', { d: 'M5 33L1 38', stroke: '#222', 'stroke-width': 2.5 }, svg);
    }
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
  env.site({
    name: 'design-rotate-object-cube-04', styles: ['site.css'], scripts: [],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = `cubelab instruction-${ctx.display}`;
      const ribbon = u.el('header', 'ribbon', document.body);
      const logo = u.el('div', 'logo', ribbon);
      const lt = u.el('div', 'logo-title', logo); u.el('span', 'l1', lt, 'Cube'); u.el('span', 'l2', lt, 'Lab');
      u.el('div', 'logo-sub', logo, 'Explore   Rotate   Learn');
      const logoActions = u.el('div', 'logo-actions', logo);
      const group = (title, cls) => {
        const g = u.el('section', 'rgroup ' + cls, ribbon);
        u.el('h3', '', g, title);
        return u.el('div', 'rbtns', g);
      };
      const btn = (parent, label, on, glyph, action) => {
        const b = u.el('button', 'rbtn' + (on ? ' on' : ''), parent);
        b.type = 'button'; if (action) b.dataset.action = action;
        glyph(b); u.el('span', '', b, label);
        return b;
      };
      const g1 = group('View', 'g-view');
      btn(g1, 'Rotate', true, b => cubeGlyph(b, '#c6cfdf', '#aebbd0', '#879bb8', 'rotate'));
      btn(g1, 'Pan', false, b => cubeGlyph(b, '#b8c2d8', '#d6dcea', '#a2adc6'));
      btn(g1, 'Zoom', false, b => cubeGlyph(b, '#b8c2d8', '#d6dcea', '#a2adc6', 'zoom'));
      const g2 = group('Rotation Step', 'g-step');
      for (const s of ['15°', '45°', '90°']) btn(g2, s, false, b => cubeGlyph(b, '#c3cce0', '#dde2ee', '#aab4cb'));
      const g3 = group('Display', 'g-display');
      const checks = u.el('div', 'chks', g3);
      for (const s of ['Show Labels', 'Show Edges', 'Solid Colors']) {
        const row = u.el('div', 'chk', checks);
        const svg = u.svg('svg', { viewBox: '0 0 20 20', 'aria-hidden': 'true' }, row);
        u.svg('rect', { x: 1.5, y: 1.5, width: 17, height: 17, fill: '#fff', stroke: '#1b2a63', 'stroke-width': 1.6 }, svg);
        u.svg('path', { d: 'M4.5 10.5L8.5 14.5L16 5.5', fill: 'none', stroke: '#1b2a63', 'stroke-width': 2 }, svg);
        u.el('span', '', row, s);
      }
      const g4 = group('Presets', 'g-presets');
      btn(g4, 'Default', true, b => cubeGlyph(b, '#b9bfce', '#dfe3ec', '#a5adc0'), 'reset');
      btn(g4, 'Top', false, b => cubeGlyph(b, '#b8c2d8', '#2b43a0', '#8e9fbb'));
      btn(g4, 'Front', false, b => cubeGlyph(b, '#b8c2d8', '#d6dcea', '#a2adc6'));
      btn(g4, 'Right', false, b => cubeGlyph(b, '#6c8ae0', '#c8d0e2', '#2b43a0'));
      const g5 = group('Help', 'g-help');
      const help = u.el('button', 'rbtn help', g5); help.type = 'button'; help.dataset.action = 'help';
      const q = u.el('span', 'qmark', help, '?'); q.setAttribute('aria-hidden', 'true');
      u.el('span', '', help, 'Instructions');

      const heading = u.el('h1', 'instruction instruction-' + ctx.display, document.body, ctx.instruction);
      if (ctx.display === 'hidden') heading.hidden = true;
      if (ctx.display === 'toast') {
        const close = u.el('button', 'instruction-dismiss', heading, 'Close');
        close.type = 'button'; close.onclick = () => { heading.hidden = true; };
      }
      const stage = u.el('main', 'cube-stage', document.body);
      stage.dataset.role = 'stage';

      const side = u.el('aside', 'goal-panel', document.body);
      u.el('h2', 'goal-head', side, 'Goal');
      const body = u.el('div', 'goal-body', side);
      const helper = u.el('p', 'task-helper', body, 'Make the target face point straight at you.');
      if (ctx.display === 'panel') { body.prepend(heading); helper.hidden = true; }
      u.el('hr', '', body);
      u.el('h3', '', body, 'Cube Faces');
      const faces = [['#d32f2f', '1 (red)'], ['#0a4fff', '2 (blue)'], ['#2e9e3e', '3 (green)'],
        ['#ffee1a', '4 (yellow)'], ['#9b3fd0', '5 (purple)'], ['#ff9a3c', '6 (orange)']];
      for (const [c, t] of faces) {
        const r = u.el('div', 'face-row', body);
        const sw = u.el('i', 'swatch', r); sw.style.background = c;
        u.el('span', '', r, t);
      }
      u.el('hr', '', body);
      u.el('h3', '', body, 'Controls');
      const controlBody = u.el('div', 'control-body', body);
      const mouse = u.svg('svg', { viewBox: '0 0 74 112', 'aria-hidden': 'true' }, controlBody);
      u.svg('path', { d: 'M36 3C15 3 4 20 4 40V73C4 95 18 108 37 108S70 94 70 73V40C70 18 56 3 36 3Z',
        fill: '#fff', stroke: '#222', 'stroke-width': 3 }, mouse);
      u.svg('path', { d: 'M39 5C55 6 69 21 69 42H39Z', fill: '#d32f2f' }, mouse);
      u.svg('path', { d: 'M37 5V44', fill: 'none', stroke: '#222', 'stroke-width': 2 }, mouse);
      u.svg('path', { d: 'M5 44H69M34 15Q34 11 39 11V34Q34 37 34 32Z', fill: 'none', stroke: '#222', 'stroke-width': 2 }, mouse);
      u.el('span', '', controlBody, 'Drag with mouse\nto rotate the cube.');

      const footer = u.el('footer', 'statusbar', document.body);
      u.el('div', 'status-label', footer, 'Status:');
      u.el('div', 'status-cell s0', footer, 'Not solved yet.');
      u.el('div', 'status-cell s1', footer, 'Current front face: 1 (red)');
      u.el('div', 'status-cell s2', footer, 'Current top face: 5 (purple)');
      u.el('div', 'status-cell s3', footer, 'Current right face: 3 (green)');
      let submit = null;
      if (!ctx.finish) {
        const endRng = ctx.rng.fork('chrome/end');
        const defaultEnd = endRng.bool(0.5);
        const labels = ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
        const labelOf = x => typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x);
        const submitLabel = labels.find(x => labelOf(x).trim().toLowerCase() === 'submit');
        const label = defaultEnd ? labelOf(submitLabel || 'Submit') : labelOf(endRng.pick(labels));
        const placement = defaultEnd ? 'footer' : endRng.pick(['toolbar', 'link']);
        const makeEnd = (parent, cls, text) => {
          const b = u.el(cls === 'submit-link' ? 'a' : 'button', cls, parent, text);
          b.type = 'button';
          if (b.tagName === 'A') b.href = '#';
          b.dataset.role = 'submit';
          b.setAttribute('aria-label', label);
          b.title = label;
          b.onclick = e => { e.preventDefault(); ctx.submit(); };
          return b;
        };
        if (placement === 'footer') submit = makeEnd(footer, 'submit-button', label);
        else if (placement === 'toolbar') submit = makeEnd(logoActions, 'toolbar-submit', label);
        else submit = makeEnd(footer, 'submit-link', label + ' ›');

        const collideRng = ctx.rng.fork('chrome/collide');
        if (collideRng.bool(0.3)) {
          const current = label.trim().toLowerCase();
          const options = [...new Set(labels.map(labelOf))].filter(x => x.trim().toLowerCase() !== current);
          if (options.length) {
            const decoyLabel = collideRng.pick(options);
            const decoy = u.el('button', 'end-xtra', logoActions, decoyLabel);
            decoy.type = 'button';
            decoy.dataset.role = 'xtra';
            decoy.onclick = () => env.log('decoy', { label: decoyLabel, collide: true });
          }
        }
      }
      const note = u.el('aside', 'help-note', document.body); note.hidden = true;
      note.textContent = 'Drag the cube with the mouse to rotate it. A face points at you when it appears square.';
      help.onclick = () => { note.hidden = !note.hidden; };
      return { stage, submit };
    },
    overlay: drawOverlay,
  });
})();
