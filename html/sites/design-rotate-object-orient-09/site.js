/* Metro notebook reference frame. Task state and rotations belong to the rotate task. */
(function () {
  'use strict';
  function icon(parent, name, size = 24) {
    const paths = {
      gear: 'M14 3L16 3L17 6L19 7L22 5L24 7L22 10L23 12L26 13V15L23 16L22 18L24 21L22 23L19 21L17 22L16 25H14L13 22L11 21L8 23L6 21L8 18L7 16L4 15V13L7 12L8 10L6 7L8 5L11 7L13 6ZM14 9A5 5 0 1 0 14 19A5 5 0 1 0 14 9Z',
      windows: 'M2 4L11 3V12H2ZM13 3L23 1V12H13ZM2 14H11V23L2 22ZM13 14H23V25L13 23Z',
      close: 'M5 5L21 21M21 5L5 21', minimize: 'M5 20H21', maximize: 'M6 6H21V21H6Z',
      search: 'M17 17L24 24M20 11A9 9 0 1 1 2 11A9 9 0 1 1 20 11',
      wifi: 'M2 9Q13 -1 24 9M6 14Q13 7 20 14M10 19Q13 16 16 19M13 23H13.1',
      sound: 'M3 10H8L14 5V23L8 18H3ZM18 9Q25 14 18 19M21 5Q33 14 21 23',
      up: 'M5 17L13 9L21 17',
    };
    const svg = env.util.svg('svg', { width: size, height: size, viewBox: '0 0 28 28', 'aria-hidden': 'true' }, parent);
    env.util.svg('path', { d: paths[name], fill: name === 'windows' ? 'currentColor' : 'none',
      stroke: name === 'windows' ? 'none' : 'currentColor', 'stroke-width': 1.7 }, svg);
    return svg;
  }
  function drawOverlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'tour-bubble overlay-' + ctx.kind, document.body);
      el.setAttribute('role', 'dialog');
      const content = {
        chat: ['Welcome to Shape Workshop!', 'Take a quick tour to learn the controls and features.', 'Start tour', 'Skip tour'],
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
          else { message.textContent = 'Drag the round handle to rotate the shape to match the task instruction.'; primary.hidden = true; }
        };
      }
      const dismiss = u.el('button', 'tour-dismiss', actions, content[3]); dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('skip');
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0 };
  }
  env.site({
    name: 'design-rotate-object-orient-09', styles: ['site.css'], scripts: [],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = `instruction-${ctx.display}`;
      const endRng = ctx.rng.fork('chrome/end');
      const collideRng = ctx.rng.fork('chrome/collide');
      const endWords = (ctx.content && ctx.content.END_LABELS || ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"])
        .map(x => typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const endLabel = endRng.bool(0.5) ? 'Submit' : endRng.pick(endWords);
      const endPlacement = ctx.finish ? null : endRng.pick(['side', 'side', 'side', 'titlebar', 'menubar']);
      const otherEndWords = [...new Set(endWords.filter(x => x.trim().toLowerCase() !== endLabel.trim().toLowerCase()))];
      const collide = !ctx.finish && otherEndWords.length && collideRng.bool(0.3) ? collideRng.pick(otherEndWords) : null;
      const collideWhere = collide ? collideRng.pick(['titlebar', 'menubar']) : null;
      const fillerWords = ctx.content && ctx.content.DECOY_LABELS || ['Help', 'Save draft', 'More'];
      const filler = !ctx.finish && collideRng.bool(0.22) && fillerWords.length ? collideRng.pick(fillerWords) : null;
      const titlebar = u.el('header', 'titlebar', document.body);
      const gear = icon(titlebar, 'gear'); gear.classList.add('gear'); u.el('span', '', titlebar, 'Shape Workshop');
      const windowActions = u.el('div', 'window-actions', titlebar);
      for (const action of ['minimize', 'maximize', 'close']) {
        const b = u.el('button', 'window-action ' + action, windowActions);
        b.type = 'button'; b.setAttribute('aria-label', action); icon(b, action);
      }
      const menu = u.el('nav', 'menubar', document.body);
      for (const label of ['File', 'Edit', 'View', 'Help']) u.el('span', '', menu, label);
      const ws = u.el('div', 'workspace', document.body);
      const left = u.el('div', 'leftcol', ws);
      const page = u.el('section', 'plate brief', left);
      page.dataset.display = ctx.display;
      for (const c of ['a', 'b', 'c', 'd']) u.el('i', 'rv ' + c, page);
      for (const c of ['a', 'b', 'c', 'd']) u.el('i', 'corner-stud ' + c, page);
      const heading = u.el('h1', 'instruction', page, ctx.instruction);
      if (ctx.display === 'hidden') heading.hidden = true;
      if (ctx.display === 'toast') {
        const close = u.el('button', 'instruction-dismiss', heading, 'Close');
        close.type = 'button'; close.onclick = () => { heading.hidden = true; };
      }
      u.el('p', 'task-helper', page, 'Click and drag the circular handle to rotate the shape.');
      const stagePlate = u.el('section', 'plate stagewrap', left);
      for (const c of ['a', 'b', 'c', 'd']) u.el('i', 'rv ' + c, stagePlate);
      for (const c of ['a', 'b', 'c', 'd']) u.el('i', 'corner-stud ' + c, stagePlate);
      const stage = u.el('main', 'cube-stage', stagePlate);
      stage.dataset.role = 'stage';
      u.el('div', 'stage-title', stagePlate, 'Your Shape');
      const side = u.el('aside', 'plate side', ws);
      side.classList.toggle('no-submit', ctx.finish || endPlacement !== 'side');
      for (const c of ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']) u.el('i', 'rv ' + c, side);
      for (const c of ['a', 'b', 'c', 'd']) u.el('i', 'corner-stud ' + c, side);
      u.el('h3', '', side, 'Rotation');
      const readout = u.el('div', 'readout-box', side);
      u.el('span', '', readout, 'Current ');
      u.el('strong', '', readout, 'angle:');
      const knob = u.el('div', 'knob', side);
      u.el('span', 'knob-details', knob);
      u.el('div', 'qr', side, 'Quick Rotate');
      const quick = u.el('div', 'qbtns', side);
      for (const direction of ['Left', 'Right']) {
        const button = u.el('button', 'quick-rotate', quick);
        button.type = 'button'; button.dataset.turn = direction === 'Left' ? '-15' : '15';
        const arrow = u.svg('svg', { class: 'turn-icon', viewBox: '0 0 64 64', 'aria-hidden': 'true' }, button);
        u.svg('path', { d: 'M51 30A22 22 0 1 0 42 51', fill: 'none', stroke: '#302411', 'stroke-width': 4.5 }, arrow);
        u.svg('path', { d: 'M43 24L59 26L51 40Z', fill: '#302411' }, arrow);
        if (direction === 'Right') arrow.style.transform = 'scaleX(-1)';
        u.el('span', '', button, 'Rotate');
        u.el('span', '', button, direction + ' (15°)');
      }
      let submit = null;
      const makeEnd = (parent, cls) => {
        const b = u.el('button', cls, parent, endLabel);
        b.type = 'button'; b.dataset.role = 'submit'; b.setAttribute('aria-label', endLabel); b.title = endLabel;
        b.onclick = () => ctx.submit();
        return b;
      };
      const makeDecoy = (parent, label, isCollision) => {
        const b = u.el('button', 'chrome-xtra', parent, label);
        b.type = 'button'; b.dataset.role = 'xtra';
        b.onclick = () => env.log('decoy', isCollision ? { label, collide: true } : { label });
        return b;
      };
      if (!ctx.finish && endPlacement === 'side') {
        submit = u.el('button', 'submit-button', side, 'Submit');
        submit.textContent = endLabel; submit.type = 'button'; submit.dataset.role = 'submit';
        submit.setAttribute('aria-label', endLabel); submit.title = endLabel; submit.onclick = () => ctx.submit();
      }
      if (ctx.finish || endPlacement !== 'side') u.el('div', 'side-status', side, 'Workspace ready');
      if (!ctx.finish && endPlacement === 'titlebar') submit = makeEnd(titlebar, 'chrome-end titlebar-end');
      if (!ctx.finish && endPlacement === 'menubar') submit = makeEnd(menu, 'chrome-end menubar-end');
      if (collide && collideWhere === 'titlebar') makeDecoy(titlebar, collide, true);
      if (collide && collideWhere === 'menubar') makeDecoy(menu, collide, true);
      if (filler) makeDecoy(menu, typeof filler === 'string' ? filler : (filler.label || filler.text || String(filler)), false);
      const note = u.el('aside', 'notebook-note', document.body); note.hidden = true;
      return { stage, submit };
    },
    overlay: drawOverlay,
  });
})();
