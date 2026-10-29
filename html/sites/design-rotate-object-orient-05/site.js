/* E-ink twin-pane workspace. Task state and rotations belong to the rotate task. */
(function () {
  'use strict';
  function icon(parent, name, size = 24) {
    const paths = {
      windows: 'M2 4L11 3V12H2ZM13 3L23 1V12H13ZM2 14H11V23L2 22ZM13 14H23V25L13 23Z',
      close: 'M5 5L21 21M21 5L5 21', minimize: 'M5 14H21', maximize: 'M6 6H21V21H6Z',
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
        chat: ['Welcome to Pointer Practice!', 'Take a quick tour to learn the controls and features.', 'Start tour', 'Skip tour'],
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
          else { message.textContent = 'Click and drag the circular handle to rotate the pointer.'; primary.hidden = true; }
        };
      }
      const dismiss = u.el('button', 'tour-dismiss', actions, content[3]); dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('skip');
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0 };
  }
  const labelOf = (x) => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x);
  env.site({
    name: 'design-rotate-object-orient-05', styles: ['site.css'], scripts: [],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = `eink-pointer instruction-${ctx.display}`;
      const endRng = ctx.rng.fork('chrome/end');
      const collideRng = ctx.rng.fork('chrome/collide');
      const labels = ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
        ? ctx.content.END_LABELS.map(labelOf) : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const referenceEnd = endRng.bool(0.5);
      const otherLabels = labels.filter((x) => x.trim().toLowerCase() !== 'submit');
      const label = referenceEnd ? 'Submit' : endRng.pick(otherLabels.length ? otherLabels : labels);
      const placement = ctx.finish ? null : referenceEnd ? 'shelf' : endRng.pick(['taskbar', 'titlebar']);
      const alternatives = labels.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
      const collision = !ctx.finish && alternatives.length && collideRng.bool(0.3) ? collideRng.pick(alternatives) : null;
      const titlebar = u.el('header', 'titlebar', document.body);
      u.el('span', 'title-text', titlebar, 'Pointer Practice');
      let submit = null;
      const endButton = (parent, cls) => {
        const b = u.el('button', cls, parent, label);
        b.type = 'button'; b.dataset.role = 'submit'; b.title = label; b.setAttribute('aria-label', label);
        b.onclick = () => ctx.submit();
        return b;
      };
      const decoyButton = (parent) => {
        if (!collision) return;
        const b = u.el('button', 'end-xtra', parent, collision);
        b.type = 'button'; b.dataset.role = 'xtra';
        b.onclick = () => env.log('decoy', { label: collision, collide: true });
      };
      const titleTools = u.el('div', 'title-tools', titlebar);
      if (placement === 'titlebar' && !ctx.finish) submit = endButton(titleTools, 'title-end');
      if (placement === 'titlebar' || placement === 'taskbar') decoyButton(titleTools);
      const windowActions = u.el('div', 'window-actions', titlebar);
      for (const action of ['minimize', 'maximize', 'close']) {
        const b = u.el('button', 'window-action ' + action, windowActions);
        b.type = 'button'; b.setAttribute('aria-label', action); icon(b, action, 34);
      }
      const panes = u.el('div', 'panes', document.body);
      const page = u.el('section', 'work-pane', panes);
      const heading = u.el('h1', 'instruction', page, ctx.instruction);
      const helper = u.el('p', 'task-helper', page, 'Click and drag the circular handle to rotate the pointer.');
      const stage = u.el('main', 'cube-stage', page);
      stage.dataset.role = 'stage';
      const side = u.el('aside', 'side-pane', panes);
      u.el('h2', '', side, 'Instructions');
      if (ctx.display === 'panel' || ctx.display === 'toast') {
        u.el('div', ctx.display === 'toast' ? 'side-instruction toast-note' : 'side-instruction', side, ctx.instruction);
      }
      const list = u.el('ol', 'steps', side);
      u.el('li', '', list, 'Click and drag the circular handle\nto rotate the pointer.');
      u.el('li', '', list, 'Turn the pointer until it points at the star.');
      if (!ctx.finish) u.el('li', '', list, `Then click ${label}.`);
      if (!ctx.finish && placement === 'shelf') {
        const shelf = u.el('div', 'submit-shelf', side);
        submit = endButton(shelf, 'submit-button');
      }
      const taskbar = u.el('footer', 'taskbar', document.body);
      u.el('span', '', taskbar, 'Ready');
      const taskbarTools = u.el('div', 'taskbar-tools', taskbar);
      if (placement === 'taskbar' && !ctx.finish) submit = endButton(taskbarTools, 'taskbar-end');
      if (placement !== 'titlebar' && placement !== 'taskbar') decoyButton(taskbarTools);
      u.el('span', 'status-right', taskbar, 'Pointer Practice');
      if (ctx.display === 'hidden') {
        heading.hidden = true; helper.hidden = true; side.querySelector('h2').hidden = true; list.hidden = true;
      } else if (ctx.display === 'panel' || ctx.display === 'toast') {
        heading.hidden = true; helper.hidden = true; list.hidden = true;
      }
      // The reference shows no initial prompt, so the cube scaffold's always-on tour bubble is gone.
      return { stage, submit };
    },
    overlay: drawOverlay,
  });
})();
