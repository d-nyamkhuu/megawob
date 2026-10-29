/* 1994 plain HTML form reference frame. Task state and rotations belong to the rotate task. */
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
  env.site({
    name: 'design-rotate-object-orient-06', styles: ['site.css'], scripts: [],
    frame(ctx) {
      const u = ctx.util;
      const endRng = ctx.rng.fork('chrome/end');
      const collisionRng = ctx.rng.fork('chrome/collide');
      const labels = ctx.content && ctx.content.END_LABELS || ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const labelText = (value) => typeof value === 'string' ? value : value && (value.label || value.text || value.name) || String(value);
      const referenceEnd = endRng.bool(0.5);
      const endLabel = referenceEnd ? 'Submit' : labelText(endRng.pick(labels));
      const placement = ctx.finish ? null : referenceEnd ? 'side' : endRng.pick(['toplink', 'sidebottom']);
      let collision = null;
      if (collisionRng.bool(0.3)) {
        const options = [...new Set(labels.map(labelText))].filter((label) => label.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (options.length) collision = collisionRng.pick(options);
      }
      document.body.className = `plain-form instruction-${ctx.display}`;
      const left = u.el('aside', 'col col-left', document.body);
      u.el('h2', 'col-head', left, 'Tools');
      const rl = u.el('button', 'form-btn tool-btn', left, 'Rotate Left'); rl.type = 'button'; rl.dataset.tool = 'left';
      const rr = u.el('button', 'form-btn tool-btn', left, 'Rotate Right'); rr.type = 'button'; rr.dataset.tool = 'right';
      u.el('hr', 'sep', left);
      u.el('h2', 'col-head help-head', left, 'Help');
      const help = u.el('p', 'help-text', left);
      for (const line of ['Drag the handle on', 'the shape to rotate it.', 'Match the orientation', 'of the reference shape.']) {
        u.el('span', 'help-line', help, line);
      }
      const note = (parent, cls) => {
        const box = u.el('div', cls, parent, ctx.instruction);
        box.setAttribute('aria-label', 'Task instruction');
        return box;
      };
      const center = u.el('section', 'center', document.body);
      const heading = u.el('h1', 'instruction', center, ctx.instruction);
      if (ctx.display === 'hidden' || ctx.display === 'panel') heading.hidden = true;
      if (ctx.display === 'panel') {
        u.el('h2', 'col-head task-head', left, 'Task');
        note(left, 'instruction-panel');
      }
      if (ctx.display === 'toast') heading.classList.add('instruction-note-toast');
      if (ctx.display === 'toast') {
        const close = u.el('button', 'instruction-dismiss form-btn', heading, 'Close');
        close.type = 'button'; close.onclick = () => { heading.style.visibility = 'hidden'; heading.setAttribute('aria-hidden', 'true'); };
      }
      const stage = u.el('main', 'stage', center);
      stage.dataset.role = 'stage';

      const right = u.el('aside', 'col col-right', document.body);
      u.el('h2', 'col-head', right, 'Action');
      let submit = null;
      if (placement === 'toplink') {
        const link = u.el('button', 'end-link', right, endLabel);
        link.type = 'button'; link.dataset.role = 'submit'; link.title = endLabel; link.setAttribute('aria-label', endLabel);
        link.onclick = () => ctx.submit();
        submit = link;
      }
      const reset = u.el('button', 'form-btn tool-btn', right, 'Reset'); reset.type = 'button'; reset.dataset.tool = 'reset';
      if (!ctx.finish && placement !== 'toplink') {
        submit = u.el('button', 'form-btn submit-button' + (placement === 'sidebottom' ? ' submit-bottom' : ''), right, endLabel);
        submit.type = 'button'; submit.dataset.role = 'submit'; submit.onclick = () => ctx.submit();
      }
      if (collision) {
        const decoy = u.el('button', 'form-btn end-xtra', right, collision);
        decoy.type = 'button'; decoy.dataset.role = 'xtra';
        decoy.addEventListener('click', () => env.log('decoy', { label: collision, collide: true }));
      }
      return { stage, submit };
    },
    overlay: drawOverlay,
  });
})();
