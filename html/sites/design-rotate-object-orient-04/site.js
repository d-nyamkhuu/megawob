/* The Daily Chronicle newspaper-tool reference frame. Task state and rotations belong to the rotate task. */
(function () {
  'use strict';
  function drawOverlay(ctx) {
    const u = ctx.util;
    const el = u.el('section', 'tour-bubble overlay-' + ctx.kind, document.body);
    el.setAttribute('role', 'dialog');
    const content = {
      chat: ['Reader tip', 'Take a quick look at how the puzzle works.', 'Show me', 'Skip'],
      cookie: ['Your privacy', 'Allow optional cookies on this site?', 'Accept optional', 'Reject optional'],
      toast: ['Puzzle saved', 'Your progress is ready to continue.', null, 'Dismiss'],
      promo: ['Subscribe', 'Get more puzzles in the Sunday edition.', 'Show details', 'Not now'],
      banner: ['Notice', 'This edition works offline.', null, 'Dismiss'],
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
        else { message.textContent = 'Drag the round handle to turn the arrow.'; primary.hidden = true; }
      };
    }
    const dismiss = u.el('button', 'tour-dismiss', actions, content[3]); dismiss.type = 'button';
    dismiss.onclick = () => ctx.dismiss('skip');
    return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0 };
  }
  env.site({
    name: 'design-rotate-object-orient-04', styles: ['site.css'], scripts: [],
    frame(ctx) {
      const u = ctx.util;
      const endRng = ctx.rng.fork('chrome/end');
      const endLabels = ctx.content && Array.isArray(ctx.content.END_LABELS) ? ctx.content.END_LABELS : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const labelText = (x) => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x);
      const baseline = endRng.bool(0.5);
      const placement = baseline ? 'footer' : endRng.pick(['header', 'link']);
      const label = baseline ? 'Submit' : labelText(endRng.pick(endLabels.filter((x) => labelText(x).toLowerCase() !== 'submit')) || 'Done');
      const collideRng = ctx.rng.fork('chrome/collide');
      const collidePool = endLabels.map(labelText).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
      const collide = collideRng.bool(0.3) && collidePool.length ? collideRng.pick(collidePool) : null;
      document.body.className = `chronicle instruction-${ctx.display}`;
      document.body.classList.add(`end-${placement}`);
      const mast = u.el('header', 'masthead', document.body);
      u.el('div', 'logo', mast, 'The Daily Chronicle');
      u.el('div', 'tagline', mast, 'FACTS TODAY. A BRIGHTER TOMORROW.');
      u.el('div', 'dateline', mast, 'Mon, Apr 18, 2011');
      u.el('span', 'rule-v', mast);
      u.el('a', 'login', mast, 'Log In');
      u.el('a', 'signup', mast, 'Sign Up');
      const nav = u.el('nav', 'sections', document.body);
      ['Home', 'U.S.', 'World', 'Business', 'Technology', 'Science', 'Health', 'Opinion', 'Arts', 'Life']
        .forEach((t) => u.el('a', '', nav, t));
      const index = u.el('ol', 'side-index', document.body);
      for (let i = 1; i <= 15; i++) u.el('li', i === 1 ? 'on' : '', index, String(i));
      const page = u.el('section', 'sheet', document.body);
      u.el('div', 'kicker', page, 'PUZZLES');
      u.el('h2', 'headline', page, 'Rotate the Arrow');
      const help = u.el('div', 'help', page, 'Need help?');
      u.el('span', 'help-q', help, '?');
      u.el('p', 'task-helper', page, 'Adjust the arrow to match the instruction.');
      const display = ctx.display || 'header';
      const heading = u.el('h1', `instruction instruction-${display}`, page, ctx.instruction);
      if (display === 'hidden') heading.hidden = true;
      if (ctx.display === 'toast') {
        const close = u.el('button', 'instruction-dismiss', heading, 'Close');
        close.type = 'button'; close.onclick = () => { heading.hidden = true; };
      }
      const stage = u.el('main', 'cube-stage', page);
      stage.dataset.role = 'stage';
      let submit = null;
      if (!ctx.finish) {
        if (placement === 'footer') {
          submit = u.el('button', 'submit-button', page, label);
        } else if (placement === 'header') {
          submit = u.el('button', 'submit-button submit-top', page, label);
        } else {
          submit = u.el('a', 'submit-button submit-link', page, `${label} ›`);
          submit.href = '#';
        }
        submit.type = 'button'; submit.dataset.role = 'submit'; submit.onclick = (e) => { e.preventDefault(); ctx.submit(); };
      }
      if (collide) {
        const decoy = u.el('button', 'pqd-xtra', page, collide);
        decoy.type = 'button'; decoy.dataset.role = 'xtra';
        decoy.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
      }
      return { stage, submit };
    },
    overlay: drawOverlay,
  });
})();
