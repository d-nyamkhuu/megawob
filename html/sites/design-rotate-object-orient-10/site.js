/* Dark developer document with margin notes. Task state and rotations belong to the rotate task. */
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
  env.site({
    name: 'design-rotate-object-orient-10', styles: ['site.css'], scripts: [],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = `devdoc instruction-${ctx.display}`;
      const doc = u.el('section', 'doc', document.body);
      const head = u.el('header', 'doc-head', doc);
      u.el('span', 'app-name', head, 'Orientation Lab');
      u.el('i', 'head-sep', head);
      u.el('i', 'live-dot', head);
      u.el('span', 'app-sub', head, 'Interactive Geometry');
      const stage = u.el('main', 'doc-stage', doc);
      stage.dataset.role = 'stage';
      const margin = u.el('aside', 'margin', document.body);
      u.el('div', 'margin-label', margin, 'ROTATION TASK');
      const heading = u.el('h1', `instruction instruction-${ctx.display}`, margin, ctx.instruction);
      if (ctx.display === 'hidden') heading.hidden = true;
      if (ctx.display === 'hidden') document.body.classList.add('instruction-hidden');
      if (ctx.display === 'toast') {
        const close = u.el('button', 'instruction-dismiss', heading, 'Close');
        close.type = 'button'; close.onclick = () => { heading.hidden = true; };
      }
      u.el('hr', 'rule', margin);
      const helper = u.el('p', 'task-helper', margin);
      ['Click and drag the center handle', 'to rotate the arrow. Align the arrow', 'so it points directly at the star.'].forEach(line => u.el('span', '', helper, line));
      u.el('hr', 'rule', margin);
      const row = u.el('div', 'actions-row', margin);
      u.el('span', 'margin-label', row, 'ACTIONS');
      const reset = u.el('button', 'reset-button', row);
      reset.type = 'button'; reset.dataset.action = 'reset';
      u.el('i', 'reset-ring', reset); u.el('span', '', reset, 'Reset');
      let submit = null;
      if (!ctx.finish) {
        const endRng = ctx.rng.fork('chrome/end');
        const labelBank = ctx.content && Array.isArray(ctx.content.END_LABELS) ? ctx.content.END_LABELS : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
        const labelText = (x) => typeof x === 'string' ? x : x && (x.label || x.text || x.name) || String(x);
        const keepDefault = endRng.bool(0.5);
        const defaultLabel = labelBank.find((entry) => labelText(entry).trim().toLowerCase() === 'submit');
        const label = keepDefault ? labelText(defaultLabel || 'Submit') : labelText(endRng.pick(labelBank));
        const placement = keepDefault ? 'margin' : endRng.pick(['header', 'footer', 'link']);
        const addEnd = (parent, className, text) => {
          const button = u.el(className === 'end-link' ? 'a' : 'button', className, parent, text);
          if (button.tagName === 'BUTTON') button.type = 'button'; else button.href = '#';
          button.dataset.role = 'submit'; button.setAttribute('aria-label', label); button.title = label;
          button.onclick = (event) => { event.preventDefault(); ctx.submit(); };
          return button;
        };
        if (placement === 'margin') submit = addEnd(margin, 'submit-button', label);
        if (placement === 'header') submit = addEnd(head, 'header-submit', label);
        if (placement === 'footer') submit = addEnd(margin, 'footer-submit', label);
        if (placement === 'link') submit = addEnd(row, 'end-link', `${label} ›`);

        const collideRng = ctx.rng.fork('chrome/collide');
        if (collideRng.bool(0.3) && labelBank.length > 1) {
          const options = [...new Set(labelBank.map(labelText))].filter((word) => word.trim().toLowerCase() !== label.trim().toLowerCase());
          if (options.length) {
            const decoyLabel = collideRng.pick(options);
            const decoy = u.el('button', 'pq-xtra', head, decoyLabel);
            decoy.type = 'button'; decoy.dataset.role = 'xtra';
            decoy.onclick = () => env.log('decoy', { label: decoyLabel, collide: true });
          }
        }
      }
      return { stage, submit };
    },
    overlay: drawOverlay,
  });
})();
