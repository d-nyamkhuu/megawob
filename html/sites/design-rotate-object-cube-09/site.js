/* Northbridge Workspace reference frame. Task state and rotations belong to the rotate task. */
(function () {
  'use strict';
  const SVG = {
    close: 'M5 5L21 21M21 5L5 21',
    rotl: 'M21 18A9 9 0 1 1 22 9M22 3V10H15',
    rotr: 'M7 18A9 9 0 1 0 6 9M6 3V10H13',
    reset: 'M21 7A9 9 0 0 0 7 6M5 8A9 9 0 0 0 6 21M8 23A9 9 0 0 0 23 19M24 16A9 9 0 0 0 23 9',
    persp: 'M14 3L24 8V20L14 25L4 20V8ZM4 8L14 13L24 8M14 13V25',
    top: 'M14 2L25 8V21L14 27L3 21V8ZM3 8L14 14L25 8M14 14V27',
    front: 'M5 8L9 4H23L26 8V24L22 27H5ZM5 8H22V27M22 8L26 8M14 8V18H26',
    chev: 'M6 10L12 16L18 10',
  };
  function icon(parent, name, size = 24) {
    const svg = env.util.svg('svg', { width: size, height: size, viewBox: '0 0 28 28', 'aria-hidden': 'true' }, parent);
    env.util.svg('path', { d: SVG[name], fill: 'none', stroke: 'currentColor', 'stroke-width': 1.8,
      'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, svg);
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
    close.type = 'button'; close.setAttribute('aria-label', 'Close notice'); icon(close, 'close', 20);
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
  env.site({
    name: 'design-rotate-object-cube-09', styles: ['site.css'], scripts: [],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = `nb-cube instruction-${ctx.display}`;
      const win = u.el('div', 'app-window', document.body);
      const top = u.el('header', 'app-bar', win);
      const logo = u.el('div', 'logo', top);
      for (let i = 0; i < 4; i++) u.el('i', '', logo);
      u.el('span', 'app-name', top, 'Northbridge Workspace');
      const tabs = u.el('nav', 'notebook-tabs', top);
      tabs.setAttribute('aria-label', 'Notebook pages');
      ['Tasks', 'Assets', 'Reports', 'People', 'Settings'].forEach((label, i) => {
        const tab = u.el('button', 'notebook-tab' + (i === 0 ? ' active' : ''), tabs);
        tab.type = 'button';
        u.el('span', 'tab-number', tab, String(i + 1)); u.el('span', '', tab, label);
      });
      const proj = u.el('div', 'project', top);
      u.el('span', '', proj, 'Project A221'); icon(proj, 'chev', 14);

      const sub = u.el('div', 'sub-bar', win);
      u.el('b', '', sub, 'Spatial Reasoning');
      u.el('span', 'sub-name', sub, 'Cube Orientation');
      u.el('span', 'sub-count', sub, 'Task 3 of 6');

      const endRng = ctx.rng.fork('chrome/end');
      const endLabels = ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
        ? ctx.content.END_LABELS : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const labelText = (value) => (typeof value === 'string' ? value : value && (value.label || value.text || value.name)) || String(value);
      const label = endRng.bool(0.5) ? 'Submit' : labelText(endRng.pick(endLabels));
      const placement = ctx.finish ? null : endRng.pick(['footer', 'footer', 'footer', 'footer', 'toolbar', 'toolbar', 'link', 'link']);
      const collideRng = ctx.rng.fork('chrome/collide');
      const collides = !ctx.finish && collideRng.bool(0.3)
        ? collideRng.pick(endLabels.map(labelText).filter((item) => item.trim().toLowerCase() !== label.trim().toLowerCase()))
        : null;

      const heading = u.el('h1', 'instruction instruction-' + ctx.display, win, ctx.instruction);
      if (ctx.display === 'hidden') heading.hidden = true;
      if (ctx.display === 'toast') {
        const close = u.el('button', 'instruction-dismiss', heading, 'Close');
        close.type = 'button'; close.onclick = () => { heading.hidden = true; };
      }

      const main = u.el('div', 'main-row', win);
      const stage = u.el('main', 'cube-stage', main);
      stage.dataset.role = 'stage';
      const side = u.el('aside', 'side-col', main);
      const faces = u.el('section', 'panel faces-panel', side);
      u.el('h2', '', faces, 'Cube Faces');
      u.el('ul', 'face-legend', faces);
      const controls = u.el('section', 'panel controls-card', side);
      u.el('h2', '', controls, 'Controls');
      const btns = u.el('div', 'ctl-btns', controls);
      [['rotl', 'Rotate Left', 'rotate-left'], ['rotr', 'Rotate Right', 'rotate-right'], ['reset', 'Reset View', 'reset']].forEach(([ic, label, act]) => {
        const b = u.el('button', 'ctl-btn', btns);
        b.type = 'button'; b.dataset.action = act;
        icon(b, ic, 26); u.el('span', '', b, label);
      });

      const goal = u.el('footer', 'goal-bar', win);
      const gt = u.el('div', 'goal-text', goal);
      u.el('b', '', gt, 'Goal');
      const helper = u.el('p', 'task-helper', gt, 'Click and drag the cube to rotate it.');
      let submit = null;
      if (!ctx.finish) {
        const makeSubmit = (parent, className) => {
          const button = u.el('button', className, parent, label);
          button.type = 'button'; button.dataset.role = 'submit'; button.setAttribute('aria-label', label); button.title = label;
          button.onclick = () => ctx.submit();
          return button;
        };
        if (placement === 'toolbar') {
          const tool = u.el('button', 'toolbar-end', sub, label);
          tool.type = 'button'; tool.dataset.role = 'submit'; tool.setAttribute('aria-label', label); tool.title = label;
          tool.onclick = () => ctx.submit();
          submit = tool;
        } else if (placement === 'link') {
          const link = u.el('a', 'goal-endlink', gt, label + ' ›');
          link.href = '#'; link.dataset.role = 'submit'; link.setAttribute('aria-label', label); link.title = label;
          link.onclick = (event) => { event.preventDefault(); ctx.submit(); };
          submit = link;
        } else {
          submit = makeSubmit(goal, 'submit-button');
        }
        if (collides) {
          const parent = placement === 'toolbar' ? sub : (placement === 'link' ? gt : goal);
          const decoy = u.el('button', 'end-xtra', parent, collides);
          decoy.type = 'button'; decoy.dataset.role = 'xtra';
          decoy.onclick = () => env.log('decoy', { label: collides, collide: true });
        }
      }

      const pal = u.el('aside', 'palette', document.body);
      const ph = u.el('div', 'pal-head', pal);
      u.el('span', '', ph, 'View Controls'); u.el('i', 'pal-min', ph);
      const views = u.el('div', 'pal-views', pal);
      [['persp', 'Perspective'], ['top', 'Top'], ['front', 'Front']].forEach(([ic, label], i) => {
        const v = u.el('div', 'pal-view' + (i === 0 ? ' on' : ''), views);
        icon(v, ic, 36); u.el('span', '', v, label);
      });
      const zoom = u.el('div', 'pal-zoom', pal);
      u.el('span', 'zl', zoom, 'Zoom');
      const track = u.el('div', 'z-track', zoom); u.el('i', '', track);
      u.el('span', 'zv', zoom, '100%');
      return { stage, submit };
    },
    overlay: drawOverlay,
  });
})();
