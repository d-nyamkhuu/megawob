/* Metro notebook reference frame. Task state and rotations belong to the rotate task. */
(function () {
  'use strict';
  function icon(parent, name, size = 24) {
    const paths = {
      windows: 'M2 4L11 3V12H2ZM13 3L23 1V12H13ZM2 14H11V23L2 22ZM13 14H23V25L13 23Z',
      close: 'M5 5L21 21M21 5L5 21', minimize: 'M5 20H21', maximize: 'M6 6H21V21H6Z',
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
      if (ctx.initial) el.classList.add('reference-initial');
      el.setAttribute('role', 'dialog');
      const content = {
        chat: ['Map Orientation', 'This map can be rotated with its outer ring.', 'Continue', 'Close'],
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
          else { message.textContent = 'Click and drag the cube. Use the task instruction to choose which face should point toward you.'; primary.hidden = true; }
        };
      }
      const dismiss = u.el('button', 'tour-dismiss', actions, content[3]); dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('skip');
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0 };
  }
  env.site({
    name: 'design-rotate-object-compass-02', styles: ['site.css'], scripts: [],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = `metro-cube instruction-${ctx.display}`;
      const titlebar = u.el('header', 'titlebar', document.body);
      icon(titlebar, 'windows'); u.el('span', '', titlebar, 'Map Orientation');
      const windowActions = u.el('div', 'window-actions', titlebar);
      for (const action of ['minimize', 'maximize', 'close']) {
        const b = u.el('button', 'window-action ' + action, windowActions);
        b.type = 'button'; b.setAttribute('aria-label', action); icon(b, action);
      }
      const menu = u.el('nav', 'menu-bar', document.body);
      ['Project', 'Edit', 'View', 'Options', 'Help'].forEach((label) => u.el('span', 'menu-item', menu, label));
      const tabs = u.el('nav', 'notebook-tabs', document.body);
      tabs.setAttribute('aria-label', 'Application pages');
      ['Map', 'Places', 'Compass', 'Appearance', 'Settings'].forEach((label, i) => {
        const tab = u.el('button', 'notebook-tab tab-' + i, tabs);
        tab.type = 'button'; tab.dataset.action = label.toLowerCase();
        u.el('span', '', tab, label);
      });
      const page = u.el('section', 'notebook-page', document.body);
      const heading = u.el('h1', 'instruction', page, ctx.instruction);
      if (ctx.display === 'hidden') heading.hidden = true;
      if (ctx.display === 'toast') heading.classList.add('instruction-toast-card');
      const helper = u.el('p', 'task-helper', page, '');
      const stage = u.el('main', 'cube-stage', page);
      stage.dataset.role = 'stage';
      const controls = u.el('aside', 'controls-card', page);
      u.el('h2', 'places-heading', controls, 'Places (5)');
      const controlBody = u.el('div', 'control-body', controls);
      u.el('div', 'place-list', controlBody);
      u.el('h2', 'status-heading', controls, 'Map Status');
      u.el('div', 'status-summary', controls, 'Rotation: 068°\nCenter: 37.4° N 122.1° W\nZoom: 1.0x\n\nPlaces Shown\nTotal: 5\nVisible: 5');
      let submit = null;
      if (!ctx.finish) {
        const endRng = ctx.rng.fork('chrome/end');
        const placements = ['page-footer', 'page-footer', 'page-toolbar', 'page-link'];
        const placement = endRng.pick(placements);
        const fallbackLabels = ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
        const labels = ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS : fallbackLabels;
        const labelValue = endRng.pick(labels);
        const endLabel = typeof labelValue === 'string' ? labelValue : (labelValue.label || labelValue.text || labelValue.name || String(labelValue));
        submit = u.el(placement === 'page-link' ? 'a' : 'button', 'submit-button ' + placement, page, placement === 'page-link' ? endLabel + ' ›' : endLabel);
        if (placement === 'page-link') submit.href = '#'; else submit.type = 'button';
        submit.dataset.role = 'submit'; submit.setAttribute('aria-label', endLabel); submit.title = endLabel;
        submit.onclick = (event) => { event.preventDefault(); ctx.submit(); };

        const collideRng = ctx.rng.fork('chrome/collide');
        if (collideRng.bool(0.3)) {
          const candidates = labels.map((x) => typeof x === 'string' ? x : (x.label || x.text || x.name || String(x)))
            .filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
          if (candidates.length) {
            const decoyLabel = collideRng.pick(candidates);
            const decoy = u.el('button', 'end-xtra', page, decoyLabel);
            decoy.type = 'button'; decoy.dataset.role = 'xtra';
            decoy.addEventListener('click', () => env.log('decoy', { label: decoyLabel, collide: true }));
          }
        }
      }
      const note = u.el('aside', 'notebook-note', page); note.hidden = true;
      tabs.addEventListener('click', (event) => {
        const action = event.target.closest('[data-action]')?.dataset.action;
        if (!action || action === 'reset') return;
        note.hidden = action === 'task';
        if (action === 'hints') note.textContent = 'Drag left or right to turn the cube. Drag up or down to tilt it.';
        if (action === 'examples') note.textContent = 'A face points toward you when it appears square. Keep its label upright when the task asks for that.';
        if (action === 'notes') note.textContent = 'Use the pointer to rotate. Your current orientation stays in place when you release it.';
      });
      const taskbar = u.el('footer', 'taskbar', document.body);
      u.el('span', 'footer-label', taskbar, 'Map Orientation  •  Ready');
      return { stage, submit };
    },
    overlay: drawOverlay,
  });
})();
