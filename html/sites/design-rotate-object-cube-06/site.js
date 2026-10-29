/* Cube Trainer: early responsive minimal utility header. Task state and rotations belong to the rotate task. */
(function () {
  'use strict';
  const ARROWS = {
    left: 'M9 9L4 14L9 19M4 14H15Q24 14 24 22',
    right: 'M19 9L24 14L19 19M24 14H13Q4 14 4 22',
    up: 'M14 23V5M6 13L14 5L22 13',
    down: 'M14 5V23M6 15L14 23L22 15',
    help: 'M10.5 11Q10.5 7 14 7Q17.5 7 17.5 10.5Q17.5 12.5 14 14V16M14 19.5V20',
  };
  function icon(parent, name, size = 28) {
    const svg = env.util.svg('svg', { width: size, height: size, viewBox: '0 0 28 28', 'aria-hidden': 'true' }, parent);
    env.util.svg('path', { d: ARROWS[name], fill: 'none', stroke: 'currentColor', 'stroke-width': 1.9,
      'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, svg);
    return svg;
  }
  function drawOverlay(ctx) {
    const u = ctx.util;
    const el = u.el('section', 'notice overlay-' + ctx.kind, document.body);
    el.setAttribute('role', 'dialog');
    const content = {
      chat: ['Welcome to Cube Trainer', 'Take a quick tour to learn the controls.', 'Start tour', 'Skip tour'],
      cookie: ['Your privacy', 'Allow optional cookies for this practice workspace?', 'Accept optional', 'Reject optional'],
      toast: ['Practice saved', 'Your current workspace is ready to continue.', null, 'Dismiss'],
      promo: ['Discover more practice', 'Explore more exercises after completing this task.', 'Show details', 'Not now'],
      banner: ['Workspace notice', 'This practice session works offline.', null, 'Dismiss'],
    }[ctx.kind];
    u.el('h2', '', el, content[0]);
    const close = u.el('button', 'notice-close', el, '×');
    close.type = 'button'; close.setAttribute('aria-label', 'Close notice');
    close.onclick = () => ctx.dismiss('close');
    const message = u.el('p', '', el, content[1]);
    const actions = u.el('div', 'notice-actions', el);
    if (content[2]) {
      const primary = u.el('button', 'notice-primary', actions, content[2]); primary.type = 'button';
      primary.onclick = () => {
        if (ctx.kind === 'cookie') ctx.dismiss('accept');
        else { message.textContent = 'Click and drag the cube. Use the task instruction to choose which face should point toward you.'; primary.hidden = true; }
      };
    }
    const dismiss = u.el('button', 'notice-dismiss', actions, content[3]); dismiss.type = 'button';
    dismiss.onclick = () => ctx.dismiss('skip');
    return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0 };
  }
  env.site({
    name: 'design-rotate-object-cube-06', styles: ['site.css'], scripts: [],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = `trainer instruction-${ctx.display}`;
      const endRng = ctx.rng.fork('chrome/end');
      const endWords = (ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length)
        ? ctx.content.END_LABELS : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const labelOf = (x) => typeof x === 'string' ? x : x && (x.label || x.text || x.name) || String(x);
      const keepDefault = endRng.bool(0.5);
      const endLabel = keepDefault ? 'Submit' : labelOf(endRng.pick(endWords));
      const placement = ctx.finish ? 'none' : (keepDefault ? 'corner' : endRng.pick(['header', 'link']));
      const collideRng = ctx.rng.fork('chrome/collide');
      let collideLabel = null;
      if (collideRng.bool(0.3)) {
        const choices = [...new Set(endWords.map(labelOf))].filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (choices.length) collideLabel = labelOf(collideRng.pick(choices));
      }
      const header = u.el('header', 'topbar', document.body);
      u.el('span', 'app-name', header, 'Cube Trainer');
      const help = u.el('button', 'help', header); help.type = 'button';
      u.el('span', '', help, 'Help');
      const ring = u.el('span', 'help-ring', help);
      icon(ring, 'help', 26);
      const endButton = (parent, cls, text, tag = 'button') => {
        const b = u.el(tag, cls, parent, text);
        if (tag === 'button') b.type = 'button'; else b.href = '#';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', endLabel);
        b.title = endLabel;
        b.onclick = (e) => { e.preventDefault(); ctx.submit(); };
        return b;
      };
      if (placement === 'header') endButton(header, 'submit-button header-submit', endLabel);
      if (collideLabel) {
        const decoy = u.el('button', 'end-xtra', header, collideLabel);
        decoy.type = 'button'; decoy.dataset.role = 'xtra';
        decoy.addEventListener('click', () => env.log('decoy', { label: collideLabel, collide: true }));
      }
      const page = u.el('section', 'workspace', document.body);
      const heading = u.el('h1', 'instruction', page, ctx.instruction);
      if (ctx.display === 'hidden') heading.hidden = true;
      if (ctx.display === 'panel' && window.innerWidth >= 1200) {
        heading.hidden = true;
        u.el('aside', 'instruction-panel', page, ctx.instruction);
      } else if (ctx.display === 'toast' && window.innerHeight >= 680) {
        heading.hidden = true;
        const toast = u.el('aside', 'instruction-toast', page, ctx.instruction);
        const close = u.el('button', 'instruction-dismiss', toast, '×');
        close.type = 'button'; close.setAttribute('aria-label', 'Dismiss instruction');
        close.onclick = () => { toast.hidden = true; };
      }
      const helper = u.el('p', 'task-helper', page, 'Click and drag the cube to rotate it.');
      const stage = u.el('main', 'cube-stage', page);
      stage.dataset.role = 'stage';
      const controls = u.el('div', 'controls', page);
      [['left', 'Rotate Left'], ['right', 'Rotate Right'], ['up', 'Tilt Up'], ['down', 'Tilt Down']].forEach(([k, label]) => {
        const wrap = u.el('div', 'ctl', controls);
        const b = u.el('button', 'ctl-btn', wrap); b.type = 'button'; b.setAttribute('aria-label', label); b.dataset.rotate = k;
        icon(b, k, 40);
        u.el('span', '', wrap, label);
      });
      const note = u.el('aside', 'help-note', page); note.hidden = true;
      help.setAttribute('aria-expanded', 'false');
      help.onclick = () => { note.hidden = !note.hidden; help.setAttribute('aria-expanded', String(!note.hidden)); };
      u.el('p', '', note, 'Drag left or right to turn the cube. Drag up or down to tilt it.');
      u.el('p', '', note, 'A face points toward you when it appears square. Keep its label upright when the task asks for that.');
      u.el('p', '', note, 'Use the pointer to rotate. Your current orientation stays in place when you release it.');
      const reset = u.el('button', 'reset-link', note, 'Reset'); reset.type = 'button'; reset.dataset.action = 'reset';
      let submit = null;
      if (!ctx.finish) {
        if (placement === 'corner') submit = endButton(page, 'submit-button', endLabel);
        else if (placement === 'link') submit = endButton(page, 'end-link', `${endLabel} ›`, 'a');
        else submit = header.querySelector('[data-role="submit"]');
      }
      return { stage, submit };
    },
    overlay: drawOverlay,
  });
})();
