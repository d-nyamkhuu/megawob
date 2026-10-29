/* Spatial Lab reference frame: compact dialog in a sparse workspace. Task state and rotations belong to the rotate task. */
(function () {
  'use strict';
  const ICONS = {
    close: 'M5 5L21 21M21 5L5 21',
    home: 'M4 13L14 4L24 13M7 11V23H12V16H16V23H21V11',
    grid: 'M5 5H12V12H5ZM16 5H23V12H16ZM5 16H12V23H5ZM16 16H23V23H16Z',
    bars: 'M5 23V14H9V23ZM12 23V6H16V23ZM19 23V11H23V23Z',
    gear: 'M11 3H17L18 6L21 7L24 7L26 12L23 14L23 17L24 20L20 24L17 23L14 24L12 26L7 24L7 21L5 18L2 17V11L5 10L6 7L6 5L11 3ZM18 14A4 4 0 1 1 10 14A4 4 0 1 1 18 14',
    up: 'M14 23V5M7 12L14 5L21 12',
    down: 'M14 5V23M7 16L14 23L21 16',
    left: 'M23 14H5M12 7L5 14L12 21',
    right: 'M5 14H23M16 7L23 14L16 21',
    reset: 'M22 14A8 8 0 1 1 18 7M22 4V10H16',
  };
  function icon(parent, name, size = 24) {
    const svg = env.util.svg('svg', { width: size, height: size, viewBox: '0 0 28 28', 'aria-hidden': 'true' }, parent);
    env.util.svg('path', { d: ICONS[name], fill: 'none', stroke: 'currentColor', 'stroke-width': 1.7,
      'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, svg);
    return svg;
  }
  function drawOverlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'tour-bubble overlay-' + ctx.kind, document.body);
      el.setAttribute('role', 'dialog');
      const content = {
        chat: ['Welcome to Spatial Lab', 'Take a quick tour to learn the controls and features.', 'Start tour', 'Skip tour'],
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
    name: 'design-rotate-object-cube-02', styles: ['site.css'], scripts: [],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = `spatial-lab instruction-${ctx.display}`;
      const endRng = ctx.rng.fork('chrome/end');
      const endLabels = ctx.content && ctx.content.END_LABELS;
      const labels = Array.isArray(endLabels) && endLabels.length ? endLabels : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const labelText = (value) => typeof value === 'string' ? value : value && (value.label || value.text || value.name) || String(value);
      const preferredLabel = labels.map(labelText).find((value) => value.trim().toLowerCase() === 'submit') || labelText(endRng.pick(labels));
      const endLabel = endRng.bool(0.5) ? preferredLabel : labelText(endRng.pick(labels));
      const placement = ctx.finish ? null : endRng.pick(['bottom', 'bottom', 'bottom', 'top', 'link', 'top']);
      const collideRng = ctx.rng.fork('chrome/collide');
      const collisionPool = labels.map(labelText).filter((value) => value.trim().toLowerCase() !== endLabel.trim().toLowerCase());
      const collision = !ctx.finish && collideRng.bool(0.3) && collisionPool.length
        ? labelText(collideRng.pick(collisionPool)) : null;
      const side = u.el('nav', 'side-nav', document.body);
      side.setAttribute('aria-label', 'Workspace');
      const brand = u.el('div', 'brand', side);
      u.el('i', 'brand-mark', brand); u.el('span', '', brand, 'Spatial Lab');
      [['home', 'Home'], ['grid', 'Exercises'], ['bars', 'Progress'], ['gear', 'Settings']].forEach(([ic, label], i) => {
        const item = u.el('div', 'nav-item' + (i === 0 ? ' active' : ''), side);
        icon(item, ic, 26); u.el('span', '', item, label);
      });

      const page = u.el('section', 'dialog', document.body);
      page.classList.add('end-placement-' + (placement || 'none'));
      u.el('div', 'eyebrow', page, '3D MANIPULATION');
      const heading = u.el('h1', 'instruction', page, ctx.instruction);
      if (ctx.display === 'hidden' || ctx.display === 'panel' || ctx.display === 'toast') heading.hidden = true;
      u.el('p', 'task-helper', page, 'Click and drag the cube to rotate it.');
      const wrap = u.el('div', 'stage-wrap', page);
      const stage = u.el('main', 'cube-stage', wrap);
      stage.dataset.role = 'stage';
      const controls = u.el('aside', 'controls-card', wrap);
      [['up', 'Up'], ['down', 'Down'], ['left', 'Left'], ['right', 'Right']].forEach(([ic, label]) => {
        const b = u.el('button', 'ctl-btn', controls); b.type = 'button';
        b.dataset.rotate = ic;
        b.setAttribute('aria-label', 'Rotate ' + label.toLowerCase()); icon(b, ic, 24);
      });
      const reset = u.el('button', 'ctl-btn ctl-reset', controls); reset.type = 'button';
      reset.dataset.action = 'reset'; icon(reset, 'reset', 24); u.el('span', '', reset, 'Reset');
      let submit = null;
      if (!ctx.finish) {
        const actions = u.el('div', 'chrome-actions', page);
        submit = u.el(placement === 'link' ? 'a' : 'button', 'submit-button submit-' + placement, actions, placement === 'link' ? endLabel + ' ›' : endLabel);
        submit.type = 'button'; submit.dataset.role = 'submit'; submit.setAttribute('aria-label', endLabel); submit.title = endLabel;
        if (placement === 'link') submit.href = '#';
        submit.onclick = (event) => { event.preventDefault(); ctx.submit(); };
        if (collision) {
          const decoy = u.el('button', 'end-xtra', actions, collision);
          decoy.type = 'button'; decoy.dataset.role = 'xtra';
          decoy.onclick = () => env.log('decoy', { label: collision, collide: true });
        }
      }

      const note = u.el('aside', 'task-note', document.body);
      const head = u.el('div', 'note-head', note);
      u.el('i', 'note-badge', head, '!'); u.el('span', '', head, 'Task');
      const noteText = u.el('p', 'note-text', note, ctx.instruction);
      if (ctx.display !== 'panel') noteText.hidden = true;
      u.el('p', 'note-status', note, 'The cube is not yet in the correct orientation.');
      if (ctx.display === 'toast') {
        note.classList.add('task-note-toast');
        noteText.hidden = false;
      }
      return { stage, submit };
    },
    overlay: drawOverlay,
  });
})();
