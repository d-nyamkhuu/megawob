/* Lab Trainer: early-Material paper frame. Task state and rotations belong to the rotate task. */
(function () {
  'use strict';
  const ICONS = {
    close: 'M5 5L21 21M21 5L5 21',
    gear: 'M12 8.5A3.5 3.5 0 1 0 12 15.5A3.5 3.5 0 1 0 12 8.5ZM10.4 2h3.2l.5 2.6 1.6.8 2.3-1.4 2.2 2.2-1.4 2.3.8 1.6 2.6.5v3.2l-2.6.5-.8 1.6 1.4 2.3-2.2 2.2-2.3-1.4-1.6.8-.5 2.6h-3.2l-.5-2.6-1.6-.8-2.3 1.4-2.2-2.2 1.4-2.3-.8-1.6L2 13.6v-3.2l2.6-.5.8-1.6-1.4-2.3 2.2-2.2 2.3 1.4 1.6-.8Z',
  };
  function icon(parent, name, size = 24) {
    const svg = env.util.svg('svg', { width: size, height: size, viewBox: '0 0 26 26', 'aria-hidden': 'true' }, parent);
    const closeIcon = name === 'close';
    env.util.svg('path', { d: ICONS[name], fill: closeIcon ? 'none' : 'currentColor',
      stroke: closeIcon ? 'currentColor' : 'none', 'stroke-width': 2.2, 'fill-rule': 'evenodd' }, svg);
    return svg;
  }
  function circleIcon(parent, glyph, cls) {
    const s = env.util.el('span', 'circ-icon ' + (cls || ''), parent, glyph);
    return s;
  }
  const labelOf = (x) => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x);
  function drawOverlay(ctx) {
    const u = ctx.util;
    const el = u.el('section', 'tour-bubble overlay-' + ctx.kind, document.body);
    el.setAttribute('role', 'dialog');
    const content = {
      chat: ['Welcome to Lab Trainer', 'Take a quick tour to learn the controls and features.', 'Start tour', 'Skip tour'],
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
        else { message.textContent = 'Drag the knob with your pointer to rotate it to the requested value.'; primary.hidden = true; }
      };
    }
    const dismiss = u.el('button', 'tour-dismiss', actions, content[3]); dismiss.type = 'button';
    dismiss.onclick = () => ctx.dismiss('skip');
    return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0 };
  }
  env.site({
    name: 'design-rotate-object-dial-05', styles: ['site.css'], scripts: [],
    frame(ctx) {
      const u = ctx.util;
      const endRng = ctx.rng.fork('chrome/end');
      const collideRng = ctx.rng.fork('chrome/collide');
      const endLabels = ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
        ? ctx.content.END_LABELS.map(labelOf) : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const decoyLabels = ctx.content && Array.isArray(ctx.content.DECOY_LABELS) ? ctx.content.DECOY_LABELS.map(labelOf) : ['Help', 'Save draft', 'Cancel'];
      const placement = ctx.finish ? null : endRng.pick(['right', 'right', 'right', 'header', 'task']);
      const endLabel = endRng.pick(endLabels);
      const collide = !ctx.finish && collideRng.bool(0.3) && endLabels.some((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
      const collideLabel = collide ? collideRng.pick(endLabels.filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase())) : null;
      const collideWhere = collide ? collideRng.pick(['header', 'right']) : null;
      document.body.className = `material instruction-${ctx.display}`;
      const bar = u.el('header', 'appbar', document.body);
      u.el('span', 'app-title', bar, 'Lab Trainer');
      const right = u.el('div', 'app-actions', bar);
      let submit = null;
      const makeEnd = (parent, cls, text) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button'; b.dataset.role = 'submit'; b.setAttribute('aria-label', endLabel); b.title = endLabel;
        b.onclick = () => ctx.submit();
        return b;
      };
      const makeDecoy = (parent, text, collides) => {
        const b = u.el('button', 'chrome-xtra', parent, text);
        b.type = 'button'; b.dataset.role = 'xtra';
        b.onclick = () => env.log('decoy', collides ? { label: text, collide: true } : { label: text });
        return b;
      };
      if (placement === 'header') submit = makeEnd(right, 'header-submit', endLabel);
      if (collide && collideWhere === 'header') makeDecoy(right, collideLabel, true);
      if (!ctx.finish && decoyLabels.length && endRng.bool(0.25)) makeDecoy(right, endRng.pick(decoyLabels), false);
      const settings = u.el('button', 'app-action', right); settings.type = 'button';
      icon(settings, 'gear', 28); u.el('span', '', settings, 'Settings');
      const help = u.el('button', 'app-action', right); help.type = 'button';
      circleIcon(help, '?', 'help-circle'); u.el('span', '', help, 'Help');

      const layout = u.el('div', 'layout', document.body);

      const left = u.el('aside', 'col col-left', layout);
      const task = u.el('section', 'paper card-task', left);
      u.el('h2', 'card-title', task, 'Task');
      const steps = u.el('ol', 'steps', task);
      ['Set timer', 'Check setting', 'Submit'].forEach((label, i) => {
        const li = u.el('li', 'step' + (i === 0 ? ' current' : ''), steps);
        u.el('span', 'step-dot', li, String(i + 1));
        u.el('span', 'step-label', li, label);
      });
      if (placement === 'task') submit = makeEnd(task, 'task-submit', endLabel);
      const refc = u.el('section', 'paper card-ref', left);
      const panelMode = ctx.display === 'panel' && window.innerWidth >= 1180 && window.innerHeight >= 680;
      u.el('h2', 'card-title', refc, panelMode ? 'Task instructions' : 'Reference');
      u.el('p', 'card-text', refc, panelMode ? ctx.instruction : 'Turn the knob to the required time. Use the marked scale. Units are minutes (min).');

      const page = u.el('main', 'paper center', layout);
      const heading = u.el('h1', 'instruction', page, ctx.instruction);
      if (ctx.display !== 'header' || (ctx.display === 'panel' && panelMode)) heading.hidden = true;
      if (ctx.display === 'toast') {
        const toast = u.el('div', 'instruction-toast', page);
        u.el('span', '', toast, ctx.instruction);
        const close = u.el('button', 'instruction-dismiss', toast, '×');
        close.type = 'button'; close.setAttribute('aria-label', 'Dismiss instruction'); close.onclick = () => { toast.hidden = true; };
      }
      const stage = u.el('div', 'dial-stage', page);
      stage.dataset.role = 'stage';

      const rightCol = u.el('aside', 'col col-right', layout);
      const tool = u.el('section', 'paper card-tool', rightCol);
      u.el('h2', 'card-title', tool, 'Tool');
      const tip = u.el('div', 'tool-tip', tool);
      circleIcon(tip, 'i', 'info-circle');
      u.el('p', 'card-text', tip, 'Drag the knob with your pointer to rotate it.');
      const units = u.el('section', 'paper card-units', rightCol);
      u.el('h2', 'card-title', units, 'Units');
      u.el('p', 'card-text', units, 'Minutes (min)');

      if (collide && collideWhere === 'right') makeDecoy(rightCol, collideLabel, true);
      if (placement === 'right') submit = makeEnd(rightCol, 'submit-button', endLabel);
      return { stage, submit };
    },
    overlay: drawOverlay,
  });
})();
