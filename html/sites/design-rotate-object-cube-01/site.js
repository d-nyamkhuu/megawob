/* Swiss editorial reference frame. Task state and rotations belong to the rotate task. */
(function () {
  'use strict';
  function icon(parent, name, size = 24) {
    const paths = {
      close: 'M5 5L21 21M21 5L5 21',
    };
    const svg = env.util.svg('svg', { width: size, height: size, viewBox: '0 0 28 28', 'aria-hidden': 'true' }, parent);
    env.util.svg('path', { d: paths[name], fill: 'none', stroke: 'currentColor', 'stroke-width': 1.7 }, svg);
    return svg;
  }
  function drawOverlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'tour-bubble overlay-' + ctx.kind, document.body);
      el.setAttribute('role', 'dialog');
      const content = {
        chat: ['Welcome to Cube Practice', 'Take a quick tour to learn the controls and features.', 'Start tour', 'Skip tour'],
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
  function rotIcon(btn, kind) {
    const S = env.util.svg;
    const svg = S('svg', { viewBox: '0 0 48 48', 'aria-hidden': 'true' }, btn);
    const st = { fill: 'none', stroke: '#111', 'stroke-width': 3.2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' };
    if (kind === 'left') {
      S('path', Object.assign({ d: 'M24 40A16 16 0 1 0 9 24' }, st), svg);
      S('path', Object.assign({ d: 'M4 20L9 26L15 19' }, st), svg);
    } else if (kind === 'right') {
      S('path', Object.assign({ d: 'M24 40A16 16 0 1 1 39 24' }, st), svg);
      S('path', Object.assign({ d: 'M33 19L39 26L44 20' }, st), svg);
    } else {
      S('path', Object.assign({ d: 'M24 5V43M17 12L24 5L31 12M17 36L24 43L31 36' }, st), svg);
      S('path', Object.assign({ d: 'M15 20C-2 22 0 30 20 30M33 20C50 22 48 30 28 30' }, st), svg);
    }
  }
  const END_FALLBACK = ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
  const labelOf = (x) => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x);
  env.site({
    name: 'design-rotate-object-cube-01', styles: ['site.css'], scripts: [],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = `swiss-cube instruction-${ctx.display}`;
      const rail = u.el('div', 'rail', document.body);
      u.el('div', 'rail-rule', document.body);
      const left = u.el('section', 'brief', document.body);
      u.el('div', 'kicker', left, 'TASK');
      u.el('div', 'big-number', left, '01');
      u.el('h2', 'brief-title', left, 'Cube orientation');
      const heading = u.el('h1', 'instruction', left, ctx.instruction);
      if (ctx.display === 'hidden') heading.hidden = true;
      if (ctx.display === 'toast') {
        const close = u.el('button', 'instruction-dismiss', heading, 'Close');
        close.type = 'button'; close.onclick = () => { heading.hidden = true; };
      }
      u.el('p', 'task-helper', left, 'Click and drag the cube to rotate it.');

      const right = u.el('section', 'workspace', document.body);
      u.el('div', 'section-label', right, '3D CUBE');
      const panel = u.el('div', 'stage-panel', document.body);
      const stage = u.el('main', 'cube-stage', panel);
      stage.dataset.role = 'stage';
      const controls = u.el('aside', 'controls-card', panel);
      const mouse = u.svg('svg', { viewBox: '0 0 40 56', 'aria-hidden': 'true' }, controls);
      u.svg('path', { d: 'M20 2C10 2 4 9 4 19V36C4 47 11 54 20 54S36 47 36 36V19C36 9 30 2 20 2ZM4 24H36M20 2V24',
        fill: 'none', stroke: '#111', 'stroke-width': 2.2 }, mouse);
      u.el('span', '', controls, 'Click and drag\nto rotate');
      const tools = u.el('div', 'rot-tools', panel);
      const bl = u.el('button', 'rot-btn', tools); bl.type = 'button'; bl.dataset.action = 'rotate-left'; bl.setAttribute('aria-label', 'Rotate left'); rotIcon(bl, 'left');
      const bm = u.el('button', 'rot-btn wide', tools); bm.type = 'button'; bm.dataset.action = 'reset'; bm.setAttribute('aria-label', 'Reset orientation'); rotIcon(bm, 'mid');
      const br = u.el('button', 'rot-btn', tools); br.type = 'button'; br.dataset.action = 'rotate-right'; br.setAttribute('aria-label', 'Rotate right'); rotIcon(br, 'right');
      let submit = null;
      if (!ctx.finish) {
        const rng = ctx.rng.fork('chrome/end');
        const canonical = rng.bool(0.5);
        const labels = ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS : END_FALLBACK;
        const label = canonical ? 'Submit' : labelOf(rng.pick(labels));
        const placement = canonical ? 'panel' : rng.pick(['panel-left', 'header-link']);
        if (placement === 'header-link') {
          submit = u.el('button', 'submit-button submit-header-link', right, label);
        } else {
          submit = u.el('button', placement === 'panel-left' ? 'submit-button submit-left' : 'submit-button', panel, label);
        }
        submit.type = 'button'; submit.dataset.role = 'submit';
        submit.setAttribute('aria-label', label); submit.title = label;
        submit.onclick = () => ctx.submit();

        const collideRng = ctx.rng.fork('chrome/collide');
        if (collideRng.bool(0.3)) {
          const own = label.trim().toLowerCase();
          const choices = [...new Set(labels.map(labelOf))].filter((word) => word.trim().toLowerCase() !== own);
          if (choices.length) {
            const decoyLabel = collideRng.pick(choices);
            const decoy = u.el('button', 'end-xtra', right, decoyLabel);
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
