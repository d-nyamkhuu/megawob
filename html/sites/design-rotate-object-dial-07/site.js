/* GEM-style "Enviro Control" window. Task state and rotations belong to the rotate task. */
(function () {
  'use strict';
  function icon(parent, name, size = 24) {
    const svg = env.util.svg('svg', { width: size, height: size, viewBox: '0 0 28 28', 'aria-hidden': 'true' }, parent);
    const S = { fill: 'none', stroke: 'currentColor', 'stroke-width': 2.4 };
    const P = (d, extra) => env.util.svg('path', Object.assign({ d }, S, extra || {}), svg);
    if (name === 'close') P('M5 5L23 23M23 5L5 23');
    else if (name === 'minimize') P('M5 22H22');
    else if (name === 'maximize') P('M5 5H23V23H5Z');
    else if (name === 'reset') { P('M22 14A8 8 0 1 1 18 7'); env.util.svg('path', { d: 'M16 2L23 6L17 11Z', fill: 'currentColor' }, svg); }
    else if (name === 'gear' || name === 'gear2') {
      for (let i = 0; i < 8; i++) {
        const a = i * Math.PI / 4;
        P(`M${14 + Math.cos(a) * 8}, ${14 + Math.sin(a) * 8}L${14 + Math.cos(a) * 12},${14 + Math.sin(a) * 12}`, { 'stroke-width': 3.4 });
      }
      env.util.svg('circle', Object.assign({ cx: 14, cy: 14, r: 8 }, S), svg);
      env.util.svg('circle', Object.assign({ cx: 14, cy: 14, r: name === 'gear' ? 3 : 4.5 }, S), svg);
    }
    return svg;
  }
  function drawOverlay(ctx) {
    const u = ctx.util;
    const el = u.el('section', 'gem-dialog overlay-' + ctx.kind, document.body);
    el.setAttribute('role', 'dialog');
    const content = {
      chat: ['Help', 'Drag the knob around its dial to change the value.', 'Show tip', 'Skip'],
      cookie: ['Privacy', 'Allow optional cookies for this utility?', 'Accept optional', 'Reject optional'],
      toast: ['Saved', 'Your current settings are ready to continue.', null, 'Dismiss'],
      promo: ['More utilities', 'Explore more control panels after this task.', 'Show details', 'Not now'],
      banner: ['Notice', 'This utility works offline.', null, 'Dismiss'],
    }[ctx.kind];
    const bar = u.el('h2', 'gem-dialog-title', el, content[0]);
    const close = u.el('button', 'bubble-close', bar);
    close.type = 'button'; close.setAttribute('aria-label', 'Close notice'); icon(close, 'close', 16);
    close.onclick = () => ctx.dismiss('close');
    const message = u.el('p', '', el, content[1]);
    const actions = u.el('div', 'tour-actions', el);
    if (content[2]) {
      const primary = u.el('button', 'tour-primary', actions, content[2]); primary.type = 'button';
      primary.onclick = () => {
        if (ctx.kind === 'cookie') ctx.dismiss('accept');
        else { message.textContent = 'Press on the knob and drag around the dial; the needle follows the pointer.'; primary.hidden = true; }
      };
    }
    const dismiss = u.el('button', 'tour-dismiss', actions, content[3]); dismiss.type = 'button';
    dismiss.onclick = () => ctx.dismiss('skip');
    return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0 };
  }
  const labelOf = (x) => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x);
  env.site({
    name: 'design-rotate-object-dial-07', styles: ['site.css'], scripts: [],
    frame(ctx) {
      const u = ctx.util;
      let display = ctx.display || 'header';
      if ((display === 'panel' || display === 'toast') && (window.innerWidth < 1260 || window.innerHeight < 700)) display = 'header';
      document.body.className = `gem-dial instruction-${display}`;
      const endRng = ctx.rng.fork('chrome/end');
      const legacyEnd = !ctx.finish && endRng.bool(0.5);
      const placements = legacyEnd ? ['footer'] : ['footer', 'link', 'icon'];
      const placement = ctx.finish ? null : legacyEnd ? 'footer' : endRng.pick(placements);
      const endBank = ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
        ? ctx.content.END_LABELS : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const endLabel = legacyEnd ? 'Submit' : labelOf(endRng.pick(endBank));
      const collideRng = ctx.rng.fork('chrome/collide');
      const collideBank = endBank.map(labelOf).filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
      const collide = !ctx.finish && collideBank.length > 0 && collideRng.bool(0.3)
        ? labelOf(collideRng.pick(collideBank)) : null;
      const win = u.el('div', 'gem-window', document.body);
      const titlebar = u.el('header', 'titlebar', win);
      u.el('span', 'title-text', titlebar, 'Enviro Control');
      let submit = null;
      if (placement === 'icon') {
        submit = u.el('button', 'window-action end-icon', titlebar, '✓');
        submit.type = 'button'; submit.dataset.role = 'submit'; submit.title = endLabel; submit.setAttribute('aria-label', endLabel);
        submit.onclick = () => ctx.submit();
      }
      if (collide) {
        const decoy = u.el('button', 'window-action pq-title', titlebar, collide);
        decoy.type = 'button'; decoy.dataset.role = 'xtra';
        decoy.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
      }
      const windowActions = u.el('div', 'window-actions', titlebar);
      for (const action of ['minimize', 'maximize', 'close']) {
        const b = u.el('button', 'window-action ' + action, windowActions);
        b.type = 'button'; b.setAttribute('aria-label', action); icon(b, action, 32);
      }
      const row = u.el('div', 'gem-row', win);
      const task = u.el('section', 'gem-pane task-pane', row);
      u.el('h2', 'pane-title', task, 'Task');
      const body = u.el('div', 'pane-body', task);
      let heading = null;
      if (display === 'header') heading = u.el('h1', 'instruction', body, ctx.instruction);
      if (display === 'panel') {
        const card = u.el('section', 'instruction-panel', body);
        u.el('div', 'instruction-panel-title', card, 'Assignment');
        heading = u.el('h1', 'instruction', card, ctx.instruction);
      }
      const rule = u.el('hr', 'rule', body);
      if (display === 'hidden') rule.hidden = true;
      u.el('p', 'task-helper', body, 'Adjust the dial in the workspace to reach the target temperature.');
      const facts = u.el('dl', 'task-facts', body);
      for (const [key, label] of [['target', 'Target:'], ['current', 'Current:'], ['units', 'Units:']]) {
        u.el('dt', '', facts, label);
        const value = u.el('dd', '', facts);
        value.dataset.fact = key;
      }
      if (display === 'toast') {
        const note = u.el('aside', 'gem-toast-note', body);
        u.el('span', '', note, ctx.instruction);
        const close = u.el('button', 'instruction-dismiss', note, '×');
        close.type = 'button'; close.setAttribute('aria-label', 'Close');
        close.onclick = () => { note.hidden = true; };
      }
      const work = u.el('section', 'gem-pane work-pane', row);
      u.el('h2', 'pane-title', work, 'Room Temperature Control');
      const stage = u.el('main', 'cube-stage', work);
      stage.dataset.role = 'stage';
      const strip = u.el('footer', 'gem-strip', win);
      const mk = (cls, label, ic) => {
        const b = u.el('button', 'gem-btn ' + cls, strip);
        b.type = 'button';
        if (ic) icon(b, ic, 48);
        u.el('span', '', b, label);
        return b;
      };
      mk('btn-reset', 'Reset', 'reset');
      mk('btn-small', 'Smaller Step', 'gear');
      mk('btn-large', 'Larger Step', 'gear2');
      u.el('span', 'strip-gap', strip);
      if (placement === 'footer') {
        submit = mk('submit-button', endLabel);
        submit.dataset.role = 'submit'; submit.onclick = () => ctx.submit();
      } else if (placement === 'link') {
        submit = u.el('a', 'gem-end-link', strip, endLabel);
        submit.href = '#'; submit.dataset.role = 'submit';
        submit.setAttribute('aria-label', endLabel); submit.title = endLabel;
        submit.onclick = (e) => { e.preventDefault(); ctx.submit(); };
      }
      mk('btn-close', 'Close');
      return { stage, submit };
    },
    overlay: drawOverlay,
  });
})();
