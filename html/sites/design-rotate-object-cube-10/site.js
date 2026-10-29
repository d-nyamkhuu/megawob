/* Vista utility frame. Task state and rotations belong to the rotate task. */
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
      el.setAttribute('role', 'dialog');
      const content = {
        chat: ['Welcome to Cube Practice!', 'Take a quick tour to learn the controls and features.', 'Start tour', 'Skip tour'],
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
    name: 'design-rotate-object-cube-10', styles: ['site.css'], scripts: [],
    frame(ctx) {
      const u = ctx.util;
      const endRng = ctx.rng.fork('chrome/end');
      const collisionRng = ctx.rng.fork('chrome/collide');
      const labels = ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
        ? ctx.content.END_LABELS.map((x) => typeof x === 'string' ? x : (x.label || x.text || x.name || String(x)))
        : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const originalEnd = !ctx.finish && endRng.bool(0.5);
      const endPlacement = ctx.finish ? null : (originalEnd ? 'controls' : endRng.pick(['toolbar', 'statusbar']));
      const labelOptions = labels.filter((x) => x.trim().toLowerCase() !== 'submit');
      const endLabel = originalEnd ? 'Submit' : (labelOptions.length ? endRng.pick(labelOptions) : 'Done');
      const collisionOptions = [...new Set(labels)].filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
      const collide = !ctx.finish && collisionOptions.length && collisionRng.bool(0.3)
        ? collisionRng.pick(collisionOptions) : null;
      document.body.className = `vista-cube instruction-${ctx.display}`;
      const titlebar = u.el('header', 'titlebar', document.body);
      const appIcon = u.el('i', 'app-icon', titlebar);
      const appSvg = u.svg('svg', { viewBox: '0 0 24 24', 'aria-hidden': 'true' }, appIcon);
      u.svg('path', { d: 'M8 12V6a4 4 0 0 1 8 0v6M5 12h14l-2 6H7Z', fill: '#8bb9dc', stroke: '#47769d', 'stroke-width': 1.2 }, appSvg);
      u.svg('path', { d: 'M12 4v8m-2 8h4m-2-2v4', stroke: '#47769d', 'stroke-width': 1.3 }, appSvg);
      u.el('span', '', titlebar, 'Spatial Trainer');
      const windowActions = u.el('div', 'window-actions', titlebar);
      for (const action of ['minimize', 'maximize', 'close']) {
        const b = u.el('button', 'window-action ' + action, windowActions);
        b.type = 'button'; b.setAttribute('aria-label', action); icon(b, action, 18);
      }
      const menu = u.el('nav', 'menubar', document.body);
      ['File', 'Help'].forEach((t) => u.el('span', '', menu, t));
      const toolbar = u.el('div', 'episode-toolbar', menu);
      const makeEnd = (parent, cls, text) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button'; b.dataset.role = 'submit'; b.title = endLabel;
        b.setAttribute('aria-label', endLabel); b.onclick = () => ctx.submit();
        return b;
      };
      const makeDecoy = (parent) => {
        if (!collide) return;
        const b = u.el('button', 'episode-xtra', parent, collide);
        b.type = 'button'; b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
      };
      let submit = null;
      if (endPlacement === 'toolbar') submit = makeEnd(toolbar, 'episode-end toolbar-end', endLabel);
      if (collide && endPlacement !== 'statusbar') makeDecoy(toolbar);
      const work = u.el('div', 'work', document.body);
      const left = u.el('section', 'pane pane-left', work);
      const stage = u.el('main', 'cube-stage', left);
      stage.dataset.role = 'stage';
      const right = u.el('section', 'pane pane-right', work);
      const heading = u.el('h1', 'instruction', right, ctx.instruction);
      if (ctx.display === 'hidden') heading.hidden = true;
      if (ctx.display === 'toast') {
        const close = u.el('button', 'instruction-dismiss', heading, 'Close');
        close.type = 'button'; close.onclick = () => { heading.hidden = true; };
      }
      const cols = u.el('div', 'cols', right);
      const faces = u.el('div', 'col faces', cols);
      u.el('h2', '', faces, 'Cube Faces');
      [['Red', 1, '#c8201c'], ['Blue', 2, '#2038d0'], ['Green', 3, '#2f9a2f'], ['Yellow', 4, '#f4d20c'],
        ['Purple', 5, '#7a22a8'], ['Orange', 6, '#ee6a10']].forEach(([n, i, c]) => {
        const row = u.el('div', 'face-row', faces);
        const chip = u.el('b', 'chip', row, String(i)); chip.style.background = c;
        if (i === 4) chip.style.color = '#222';
        u.el('span', '', row, `${n} face — ${i}`);
      });
      const ctl = u.el('div', 'col controls', cols);
      u.el('h2', '', ctl, 'Controls');
      const controlBody = u.el('div', 'control-body', ctl);
      const mouse = u.svg('svg', { viewBox: '0 0 74 112', 'aria-hidden': 'true' }, controlBody);
      u.svg('path', { d: 'M36 3C15 3 4 20 4 40V73C4 95 18 108 37 108S70 94 70 73V40C70 18 56 3 36 3Z',
        fill: '#eef5fb', stroke: '#1b3050', 'stroke-width': 2.5 }, mouse);
      u.svg('path', { d: 'M32 8C16 10 10 23 10 42H32Z', fill: '#4296cd' }, mouse);
      u.svg('path', { d: 'M37 5V44', fill: 'none', stroke: '#1b3050', 'stroke-width': 5 }, mouse);
      u.svg('path', { d: 'M5 49H69', fill: 'none', stroke: '#1b3050', 'stroke-width': 3 }, mouse);
      u.svg('rect', { x: 32, y: 14, width: 10, height: 28, rx: 5, fill: '#163f69', stroke: '#102a4c', 'stroke-width': 2 }, mouse);
      u.el('span', '', controlBody, 'Drag with your mouse\nto rotate the cube.');
      ['Reset View', 'Show All Faces'].forEach((t) => {
        const b = u.el('button', 'glass-button', ctl, t); b.type = 'button';
        if (t === 'Reset View') b.dataset.action = 'reset';
      });
      u.el('p', 'task-helper', right, '').hidden = true;
      if (!ctx.finish) {
        if (endPlacement === 'controls') {
          submit = makeEnd(ctl, 'submit-button', endLabel);
        }
      }
      const status = u.el('footer', 'statusbar', document.body);
      u.el('span', 'ready', status, 'Ready');
      u.el('span', 'st', status, 'Cube Rotation Task');
      u.el('span', 'st', status, '1 attempt');
      if (endPlacement === 'statusbar') submit = makeEnd(status, 'episode-end status-end', endLabel);
      if (collide && endPlacement === 'statusbar') makeDecoy(toolbar);
      // Keep longer seeded instructions inside the same confirmation-pane heading region.
      if (!heading.hidden) {
        let font = parseFloat(getComputedStyle(heading).fontSize);
        while (heading.scrollHeight > heading.clientHeight && font > 17) {
          heading.style.fontSize = (--font) + 'px';
        }
      }
      return { stage, submit };
    },
    overlay: drawOverlay,
  });
})();
