/* Pastel native cube trainer frame. Task state and rotations belong to the rotate task. */
(function () {
  'use strict';
  const ICONS = {
    close: 'M5 5L21 21M21 5L5 21', minimize: 'M5 14H21', maximize: 'M6 6H21V21H6Z',
    left: 'M12 5L5 11L12 17M5 11H15Q25 11 23 23', right: 'M16 5L23 11L16 17M23 11H13Q3 11 5 23',
    up: 'M14 23V5M6 13L14 5L22 13', down: 'M14 5V23M6 15L14 23L22 15',
  };
  function icon(parent, name, size = 24) {
    const svg = env.util.svg('svg', { width: size, height: size, viewBox: '0 0 28 28', 'aria-hidden': 'true' }, parent);
    env.util.svg('path', { d: ICONS[name], fill: 'none', stroke: 'currentColor', 'stroke-width': ['left','right','up','down'].includes(name) ? 2.8 : 1.9,
      'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, svg);
    return svg;
  }
  function logo(parent) {
    const svg = env.util.svg('svg', { width: 26, height: 26, viewBox: '0 0 26 26', 'aria-hidden': 'true' }, parent);
    env.util.svg('path', { d: 'M13 2L23 7.5L13 13L3 7.5Z', fill: '#8fb8ff' }, svg);
    env.util.svg('path', { d: 'M3 7.5L13 13V24L3 18.5Z', fill: '#3f6fe0' }, svg);
    env.util.svg('path', { d: 'M23 7.5L13 13V24L23 18.5Z', fill: '#5f93f5' }, svg);
  }
  function drawOverlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'tour-bubble overlay-' + ctx.kind, document.body);
      el.setAttribute('role', 'dialog');
      const content = {
        chat: ['Welcome to Cube Trainer!', 'Take a quick tour to learn the controls and features.', 'Start tour', 'Skip tour'],
        cookie: ['Your privacy', 'Allow optional cookies for this practice workspace?', 'Accept optional', 'Reject optional'],
        toast: ['Practice saved', 'Your current workspace is ready to continue.', null, 'Dismiss'],
        promo: ['Discover more practice', 'Explore more exercises after completing this task.', 'Show details', 'Not now'],
        banner: ['Workspace notice', 'This practice session works offline.', null, 'Dismiss'],
      }[ctx.kind];
      u.el('h2', '', el, content[0]);
      const close = u.el('button', 'bubble-close', el);
      close.type = 'button'; close.setAttribute('aria-label', 'Close notice'); icon(close, 'close', 22);
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
    name: 'design-rotate-object-cube-07', styles: ['site.css'], scripts: [],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = `pastel-cube instruction-${ctx.display}`;
      const titlebar = u.el('header', 'titlebar', document.body);
      logo(titlebar); u.el('span', '', titlebar, 'Cube Trainer');
      const windowActions = u.el('div', 'window-actions', titlebar);
      for (const action of ['minimize', 'maximize', 'close']) {
        const b = u.el('button', 'window-action ' + action, windowActions);
        b.type = 'button'; b.setAttribute('aria-label', action); icon(b, action, 22);
      }
      const brief = u.el('section', 'briefing', document.body);
      u.el('div', 'brief-kicker', brief, '3D Orientation Task');
      const heading = u.el('h1', 'instruction', brief, ctx.instruction);
      if (ctx.display === 'hidden') heading.remove();
      if (ctx.display === 'toast') heading.classList.add('instruction-note');
      u.el('hr', 'brief-rule', brief);
      u.el('p', 'task-helper', brief, 'Click and drag the cube to rotate it.');
      const legend = u.el('div', 'legend', brief);
      u.el('div', 'legend-title', legend, 'Face colors and numbers:');
      u.el('div', 'legend-list', legend);

      const stage = u.el('main', 'cube-stage', document.body);
      stage.dataset.role = 'stage';
      const strip = u.el('footer', 'action-strip', document.body);
      const rot = u.el('div', 'strip-group rot-group', strip);
      u.el('div', 'strip-title', rot, 'Rotate Cube');
      const rotRow = u.el('div', 'tile-row', rot);
      [['left', 'Rotate Left'], ['right', 'Rotate Right'], ['up', 'Tilt Up'], ['down', 'Tilt Down']].forEach(([ic, label]) => {
        const b = u.el('button', 'tile-btn', rotRow); b.type = 'button';
        b.dataset.rotate = ic;
        icon(b, ic, 30); u.el('span', '', b, label);
      });
      u.el('div', 'strip-sep', strip);
      const pre = u.el('div', 'strip-group pre-group', strip);
      u.el('div', 'strip-title', pre, 'View Presets');
      const preRow = u.el('div', 'pill-row', pre);
      ['Front', 'Back', 'Left', 'Right', 'Top', 'Bottom'].forEach((label) => {
        const b = u.el('button', 'pill-btn', preRow, label); b.type = 'button';
        b.dataset.preset = label.toLowerCase();
      });
      u.el('div', 'strip-sep', strip);
      let submit = null;
      const endRng = ctx.rng.fork('chrome/end');
      const endChoices = ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
        ? ctx.content.END_LABELS : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const plainLabel = (x) => typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x);
      const originalLabel = endChoices.map(plainLabel).find((x) => x.trim().toLowerCase() === 'submit');
      const endLabel = originalLabel && endRng.bool(0.5) ? originalLabel : plainLabel(endRng.pick(endChoices));
      const placement = endRng.pick(['strip', 'strip', 'titlebar', 'link']);
      const addEnd = (parent, cls, label) => {
        const b = u.el(placement === 'link' ? 'a' : 'button', cls, parent, label);
        if (b.tagName === 'BUTTON') b.type = 'button'; else b.href = '#';
        b.dataset.role = 'submit'; b.setAttribute('aria-label', endLabel); b.title = endLabel;
        b.onclick = (e) => { e.preventDefault(); ctx.submit(); };
        if (placement === 'titlebar') titlebar.insertBefore(b, windowActions);
        return b;
      };
      const collideRng = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && collideRng.bool(0.3)) {
        const own = String(endLabel).trim().toLowerCase();
        const options = endChoices.map(plainLabel)
          .filter((x) => String(x).trim().toLowerCase() !== own);
        if (options.length) collide = collideRng.pick(options);
      }
      if (!ctx.finish && placement === 'titlebar') {
        submit = addEnd(titlebar, 'submit-titlebar', endLabel);
      } else if (!ctx.finish && placement === 'link') {
        submit = addEnd(strip, 'submit-link', `${endLabel} ›`);
      } else if (!ctx.finish) {
        submit = u.el('button', 'submit-button', strip, endLabel);
        submit.type = 'button'; submit.dataset.role = 'submit'; submit.setAttribute('aria-label', endLabel);
        submit.title = endLabel; submit.onclick = () => ctx.submit();
      }
      if (collide) {
        const decoy = u.el('button', 'end-xtra', windowActions, collide);
        decoy.type = 'button'; decoy.dataset.role = 'xtra';
        decoy.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
      }
      return { stage, submit };
    },
    overlay: drawOverlay,
  });
})();
