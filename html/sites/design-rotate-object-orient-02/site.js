/* 2002 Flash-style "Angle Challenge" frame. Task state and rotations belong to the rotate task. */
(function () {
  'use strict';
  function drawOverlay(ctx) {
    const u = ctx.util;
    const el = u.el('section', 'tour-bubble overlay-' + ctx.kind, document.body);
    el.setAttribute('role', 'dialog');
    const content = {
      chat: ['Welcome!', 'Take a quick tour to learn the controls.', 'Start tour', 'Skip tour'],
      cookie: ['Your privacy', 'Allow optional cookies for this practice workspace?', 'Accept optional', 'Reject optional'],
      toast: ['Practice saved', 'Your current workspace is ready to continue.', null, 'Dismiss'],
      promo: ['Discover more practice', 'Explore more exercises after completing this task.', 'Show details', 'Not now'],
      banner: ['Workspace notice', 'This practice session works offline.', null, 'Dismiss'],
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
        else { message.textContent = 'Drag the round handle to turn the pointer toward the target.'; primary.hidden = true; }
      };
    }
    const dismiss = u.el('button', 'tour-dismiss', actions, content[3]); dismiss.type = 'button';
    dismiss.onclick = () => ctx.dismiss('skip');
    return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0 };
  }
  env.site({
    name: 'design-rotate-object-orient-02', styles: ['site.css'], scripts: [],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = `flash-angle instruction-${ctx.display}`;
      const top = u.el('header', 'topbar', document.body);
      u.el('div', 'app-title', top, 'Angle Challenge');
      u.el('div', 'app-tag', top, 'Turn. Match. Submit.');
      const stage = u.el('main', 'angle-stage', document.body);
      stage.dataset.role = 'stage';
      const heading = u.el('h1', 'instruction', document.body);
      const instructionText = u.el('span', '', heading, ctx.instruction);
      const measure = document.createElement('canvas').getContext('2d');
      const textStyle = getComputedStyle(instructionText);
      measure.font = `${textStyle.fontWeight} ${textStyle.fontSize} ${textStyle.fontFamily}`;
      if (measure.measureText(ctx.instruction).width > heading.clientWidth * 0.86) heading.classList.add('long-instruction');
      if (ctx.display === 'hidden') heading.hidden = true;
      if (ctx.display === 'toast') {
        const close = u.el('button', 'instruction-dismiss', heading, 'Close');
        close.type = 'button'; close.onclick = () => { heading.hidden = true; };
      }
      const side = u.el('aside', 'side-panel', document.body);
      u.el('div', 'side-rule rule-a', side);
      u.el('h2', 'side-head', side, 'Rotate Pointer');
      if (!ctx.finish) u.el('div', 'side-rule rule-b', side);
      const labelOf = x => typeof x === 'string' ? x : x.label || x.text || x.name;
      const labels = ctx.content.END_LABELS.map(labelOf);
      const endRng = ctx.rng.fork('chrome/end');
      const referenceEnd = endRng.bool(0.5);
      const placement = referenceEnd ? 'sidebar' : endRng.pick(['header', 'link']);
      const label = referenceEnd ? 'Submit' : endRng.pick(labels.filter(x => x !== 'Submit'));
      let submit = null;
      if (!ctx.finish) {
        const parent = placement === 'header' ? top : side;
        const cls = placement === 'header' ? 'submit-button toolbar-end' : placement === 'link' ? 'end-link' : 'submit-button';
        submit = u.el('button', cls, parent, label);
        submit.type = 'button'; submit.dataset.role = 'submit'; submit.onclick = () => ctx.submit();
        submit.title = label; submit.setAttribute('aria-label', label);
        if (placement === 'header') top.classList.add('has-end');
      }
      const collideRng = ctx.rng.fork('chrome/collide');
      if (collideRng.bool(0.3)) {
        const options = labels.filter(x => x.toLowerCase() !== label.toLowerCase());
        if (options.length) {
          const decoyLabel = collideRng.pick(options);
          const inSidebar = !ctx.finish && placement === 'header';
          const decoy = u.el('button', 'chrome-xtra' + (inSidebar ? ' sidebar-xtra' : ''), inSidebar ? side : top, decoyLabel);
          decoy.type = 'button'; decoy.dataset.role = 'xtra';
          decoy.onclick = () => env.log('decoy', { label: decoyLabel, collide: true });
          if (!inSidebar) top.classList.add('has-xtra');
        }
      }
      return { stage, submit };
    },
    overlay: drawOverlay,
  });
})();
