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
      el.setAttribute('role', 'dialog');
      const content = {
        chat: ['Welcome to Skill Builder!', 'Take a quick tour to learn the controls and features.', 'Start tour', 'Skip tour'],
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
          else { message.textContent = 'Drag the round handle to turn the pointer toward the star.'; primary.hidden = true; }
        };
      }
      const dismiss = u.el('button', 'tour-dismiss', actions, content[3]); dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('skip');
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0 };
  }
  env.site({
    name: 'design-rotate-object-orient-08', styles: ['site.css'], scripts: [],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = `sb-page instruction-${ctx.display}`;
      const header = u.el('header', 'sb-header', document.body);
      u.el('div', 'sb-brand', header, 'Skill Builder');
      const tabs = u.el('nav', 'sb-tabs', header);
      ['Practice', 'Tasks', 'Progress', 'Settings'].forEach((label, i) => {
        const tab = u.el('button', 'sb-tab' + (i === 0 ? ' on' : ''), tabs);
        u.el('span', '', tab, label);
        tab.type = 'button'; tab.dataset.action = label.toLowerCase();
        tab.onclick = () => env.log('decoy', { label });
      });
      const links = u.el('div', 'sb-links', header);
      ['Help', 'Sign Out'].forEach((label) => {
        const link = u.el('a', '', links, label);
        link.onclick = () => env.log('decoy', { label });
      });
      const left = u.el('aside', 'sb-left', document.body);
      const taskTitle = u.el('h2', 'sb-h', left);
      u.el('span', '', taskTitle, 'Your Task');
      const heading = u.el('h1', 'instruction', left);
      if (ctx.display === 'panel') u.el('span', 'brief-label', heading, 'Task briefing');
      if (ctx.display === 'toast') u.el('span', 'brief-label', heading, 'Practice reminder');
      u.el('span', 'brief-copy', heading, ctx.instruction);
      if (ctx.display === 'hidden') heading.hidden = true;
      if (ctx.display === 'toast') {
        const close = u.el('button', 'instruction-dismiss', heading, 'Close');
        close.type = 'button'; close.onclick = () => { heading.hidden = true; };
      }
      u.el('p', 'task-helper', left, 'Use the rotation handle to turn the pointer.');
      u.el('p', 'task-helper', left, 'The pointer should point directly at the star.');
      const page = u.el('section', 'sb-main', document.body);
      u.el('h2', 'sb-title', page, 'Rotate Pointer');
      const stage = u.el('main', 'cube-stage', page);
      stage.dataset.role = 'stage';
      const controls = u.el('aside', 'controls-card', page);
      const controlTitle = u.el('h2', '', controls);
      u.el('span', '', controlTitle, 'Controls');
      const controlBody = u.el('div', 'control-body', controls);
      const arcs = u.svg('svg', { viewBox: '0 0 200 90', 'aria-hidden': 'true' }, controlBody);
      u.svg('path', { d: 'M10 75C7 50 25 25 52 15', fill: 'none', stroke: '#4a7fb0', 'stroke-width': 4.5 }, arcs);
      u.svg('path', { d: 'M62 10L44 8L50 24Z', fill: '#4a7fb0' }, arcs);
      u.svg('path', { d: 'M190 75C193 50 175 25 148 15', fill: 'none', stroke: '#4a7fb0', 'stroke-width': 4.5 }, arcs);
      u.svg('path', { d: 'M138 10L156 8L150 24Z', fill: '#4a7fb0' }, arcs);
      u.el('span', '', controlBody, 'Drag to rotate\nthe pointer');
      const bar = u.el('div', 'sb-actions', page);
      const reset = u.el('button', 'sb-reset', bar, 'Reset'); reset.type = 'button';
      reset.onclick = (e) => { e.preventDefault(); env.log('decoy', { label: 'Reset' }); };
      const endRng = ctx.rng.fork('chrome/end');
      const labelOf = (entry) => typeof entry === 'string' ? entry : entry.label || entry.text || entry.name;
      const endLabels = ctx.content.END_LABELS.map(labelOf);
      const usualEnd = endRng.bool(0.5);
      const placement = usualEnd ? 'footer' : endRng.pick(['toolbar', 'link']);
      const label = usualEnd ? endLabels.find((text) => text === 'Submit') || 'Submit' : endRng.pick(endLabels);
      const tools = u.el('div', 'sb-action-tools', bar);
      const collideRng = ctx.rng.fork('chrome/collide');
      if (collideRng.bool(0.3)) {
        const candidates = endLabels.filter((text) => text.trim().toLowerCase() !== label.trim().toLowerCase());
        const decoyLabel = collideRng.pick(candidates);
        const decoy = u.el('button', 'sb-xtra', tools, decoyLabel);
        decoy.type = 'button'; decoy.dataset.role = 'xtra';
        decoy.onclick = () => env.log('decoy', { label: decoyLabel, collide: true });
      }
      let submit = null;
      if (!ctx.finish) {
        const host = placement === 'toolbar' ? page : tools;
        const cls = placement === 'link' ? 'sb-end-link' : 'submit-button' + (placement === 'toolbar' ? ' sb-toolbar-end' : '');
        submit = u.el(placement === 'link' ? 'a' : 'button', cls, host, label);
        if (placement === 'link') submit.href = '#';
        else submit.type = 'button';
        submit.dataset.role = 'submit'; submit.title = label; submit.setAttribute('aria-label', label);
        submit.onclick = (e) => { e.preventDefault(); ctx.submit(); };
      }
      if (ctx.finish || placement === 'toolbar') u.el('span', 'sb-action-status', tools, 'Practice workspace');
      return { stage, submit };
    },
    overlay: drawOverlay,
  });
})();
