/* Qt Plastik (2002) GeoTools reference frame. Task state and rotations belong to the rotate task. */
(function () {
  'use strict';
  function icon(parent, name, size = 16) {
    const paths = {
      close: 'M5 5L21 21M21 5L5 21', minimize: 'M5 21H21', maximize: 'M5 5H21V21H5Z',
      doc: 'M6 3H17L22 8V25H6Z', save: 'M4 4H22V24H4ZM8 4V11H18V4M8 24V16H18V24',
      folder: 'M2 7H10L12 9H24V23H2Z', copy: 'M4 4H17V17H4ZM9 9H22V22H9Z',
      globe: 'M3 14A11 11 0 1 1 25 14A11 11 0 1 1 3 14ZM3 14H25M14 3Q8 14 14 25M14 3Q20 14 14 25',
    };
    const svg = env.util.svg('svg', { width: size, height: size, viewBox: '0 0 28 28', 'aria-hidden': 'true' }, parent);
    if (name === 'folder' || name === 'doc' || name === 'save' || name === 'copy' || name === 'globe') {
      const paint = (d, fill, stroke = '#374451', width = 1.5) => env.util.svg('path', {d, fill, stroke, 'stroke-width': width, 'stroke-linejoin': 'round'}, svg);
      if (name === 'folder') {
        const toolbarFolder = parent.classList.contains('tool');
        const gradientId = toolbarFolder ? 'qt-folder-gold' : 'qt-folder-blue';
        const defs = env.util.svg('defs', {}, svg);
        const gradient = env.util.svg('linearGradient', {id: gradientId, x1: 0, y1: 0, x2: 0, y2: 1}, defs);
        env.util.svg('stop', {offset: 0, 'stop-color': toolbarFolder ? '#f8e6a5' : '#d4e7fa'}, gradient);
        env.util.svg('stop', {offset: 1, 'stop-color': toolbarFolder ? '#d4b45a' : '#7da8d7'}, gradient);
        paint('M3 7H11L13 9H24V24H3Z', '#d5e6f8');
        paint('M4 5H11L13 8H24V11H4Z', '#b3cce7');
        paint('M4 11Q3 11 3 13L2 23Q2 24 4 24H22Q23 24 23 22L25 13Q25 11 23 11Z', 'url(#' + gradientId + ')', '#345576');
        paint('M4 13H23', 'none', '#edf6ff');
      } else if (name === 'doc') {
        paint('M5 2H16L23 9V26H5Z', '#f7f8fa'); paint('M16 2V9H23', '#d4d9df');
      } else if (name === 'save') {
        paint('M3 3H24V25H3Z', '#3973b4'); paint('M7 3H20V12H7Z', '#e7edf4'); paint('M7 16H20V25H7Z', '#f5f5f5'); paint('M17 4V10', 'none', '#545d68', 3);
      } else if (name === 'copy') {
        paint('M7 2H24V20H7Z', '#a7afb7', '#75818c'); paint('M2 8H19V26H2Z', '#c1c8ce', '#677480'); paint('M5 10H16V22H5Z', '#d4d9df', '#8a949d');
      } else {
        paint('M14 2A12 12 0 1 1 13.9 2Z', '#558bb0', '#9fbfc7');
        paint('M5 21L21 5M7 23L23 7M9 5Q23 12 18 23M6 11Q14 3 24 17', 'none', '#e4d7a1', 1.2);
        paint('M15 5L12 16L5 24L15 18L23 4Z', '#c8c5a2', '#4c667a', .8);
        paint('M6 22L21 6M10 19L19 10', 'none', '#ffffdb', 1);
      }
      return svg;
    }
    env.util.svg('path', { d: paths[name], fill: 'none', stroke: 'currentColor', 'stroke-width': name === 'close' ? 3 : 2 }, svg);
    return svg;
  }
  function drawOverlay(ctx) {
    const u = ctx.util;
    const el = u.el('section', 'tour-bubble overlay-' + ctx.kind, document.body);
    el.setAttribute('role', 'dialog');
    const content = {
      chat: ['Tip of the day', 'Drag the round handle to rotate the pointer.', 'Next tip', 'Close'],
      cookie: ['Your privacy', 'Allow optional cookies for this workspace?', 'Accept optional', 'Reject optional'],
      toast: ['Project saved', 'Your current workspace is ready to continue.', null, 'Dismiss'],
      promo: ['More tools', 'Explore more tools after completing this task.', 'Show details', 'Not now'],
      banner: ['Workspace notice', 'This session works offline.', null, 'Dismiss'],
    }[ctx.kind];
    const head = u.el('h2', '', el, content[0]);
    const close = u.el('button', 'bubble-close', el);
    close.type = 'button'; close.setAttribute('aria-label', 'Close notice'); icon(close, 'close', 12);
    close.onclick = () => ctx.dismiss('close');
    const message = u.el('p', '', el, content[1]);
    const actions = u.el('div', 'tour-actions', el);
    if (content[2]) {
      const primary = u.el('button', 'tour-primary', actions, content[2]); primary.type = 'button';
      primary.onclick = () => {
        if (ctx.kind === 'cookie') ctx.dismiss('accept');
        else { message.textContent = 'Use the task instruction to choose where the arrow should point.'; primary.hidden = true; }
      };
    }
    const dismiss = u.el('button', 'tour-dismiss', actions, content[3]); dismiss.type = 'button';
    dismiss.onclick = () => ctx.dismiss('skip');
    void head;
    return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0 };
  }
  env.site({
    name: 'design-rotate-object-orient-07', styles: ['site.css'], scripts: [],
    frame(ctx) {
      const u = ctx.util;
      const er = ctx.rng.fork('chrome/end');
      const endLabels = ctx.content.END_LABELS.map(x => typeof x === 'string' ? x : x.label || x.text || x.name);
      const referenceEnd = er.bool(0.5);
      const placement = referenceEnd ? 'footer' : er.pick(['toolbar', 'link']);
      const label = referenceEnd ? endLabels.find(x => x === 'Submit') : er.pick(endLabels);
      const cr = ctx.rng.fork('chrome/collide');
      const collide = cr.bool(0.3) ? cr.pick(endLabels.filter(x => x !== label)) : null;
      const decoyBtn = (parent, text, collides = false) => {
        const b = u.el('button', 'qt-btn chrome-xtra', parent, text);
        b.type = 'button'; b.dataset.role = 'xtra';
        b.onclick = () => env.log('decoy', collides ? { label: text, collide: true } : { label: text });
        return b;
      };
      document.body.className = `qt-plastik instruction-${ctx.display}`;
      const titlebar = u.el('header', 'titlebar', document.body);
      icon(titlebar, 'globe', 18); u.el('span', '', titlebar, 'GeoTools');
      const wa = u.el('div', 'window-actions', titlebar);
      for (const a of ['minimize', 'maximize', 'close']) {
        const b = u.el('button', 'window-action ' + a, wa);
        b.type = 'button'; b.setAttribute('aria-label', a); icon(b, a, 14);
      }
      const menu = u.el('nav', 'menubar', document.body);
      for (const m of ['File', 'Edit', 'View', 'Tools', 'Help']) u.el('span', 'menu-item', menu, m);
      const tool = u.el('div', 'toolbar', document.body);
      for (const n of ['doc', 'folder', 'save', 'copy']) {
        const b = u.el('span', 'tool tool-' + n, tool); icon(b, n, 22);
        if (n === 'folder') u.el('i', 'open-arrow', b);
      }
      const endTools = u.el('div', 'chrome-end-tools', tool);
      if (collide) decoyBtn(endTools, collide, true);
      const left = u.el('aside', 'dock dock-left', document.body);
      u.el('div', 'dock-title', left, 'Projects');
      ['Maps', 'Survey Data', 'Landmarks', 'Backgrounds'].forEach((n, i) => {
        const row = u.el('div', 'tree-row' + (i === 0 ? ' selected' : ''), left);
        u.el('i', 'tree-expander' + (i === 0 ? ' expanded' : ''), row);
        const f = u.el('span', 'tree-icon', row); icon(f, 'folder', 18);
        u.el('span', '', row, n);
      });
      const right = u.el('aside', 'dock dock-right', document.body);
      const rt = u.el('div', 'dock-title', right, 'Properties');
      u.el('span', 'dock-x', rt, '✕');
      u.el('div', 'dock-empty', right, 'No item selected.');
      u.el('div', 'workspace', document.body);

      const dlg = u.el('section', 'dialog', document.body);
      const dt = u.el('div', 'dialog-title', dlg);
      icon(dt, 'globe', 18); u.el('span', '', dt, 'Rotate Pointer');
      const dx = u.el('button', 'dialog-x', dt); dx.type = 'button'; dx.setAttribute('aria-label', 'close'); icon(dx, 'close', 12);
      const body = u.el('div', 'dialog-body', dlg);
      const heading = u.el('h1', 'instruction', body, ctx.instruction);
      if (ctx.display === 'hidden') heading.hidden = true;
      if (ctx.display === 'toast') {
        const close = u.el('button', 'instruction-dismiss', heading, 'Close');
        close.type = 'button'; close.onclick = () => { heading.hidden = true; };
      }
      const stage = u.el('main', 'cube-stage', body);
      stage.dataset.role = 'stage';
      const foot = u.el('div', 'dialog-foot', dlg);
      const reset = u.el('button', 'qt-btn', foot, 'Reset'); reset.type = 'button'; reset.dataset.action = 'reset';
      reset.onclick = () => env.log('decoy', { label: 'Reset' });
      u.el('span', 'spacer', foot);
      let submit = null;
      const status = u.el('footer', 'statusbar', document.body, 'Ready');
      if (!ctx.finish) {
        const parent = placement === 'toolbar' ? endTools : placement === 'link' ? status : foot;
        submit = u.el(placement === 'link' ? 'a' : 'button',
          placement === 'link' ? 'status-end-link' : 'qt-btn submit-button' + (placement === 'toolbar' ? ' toolbar-end' : ''), parent, label);
        if (placement === 'link') submit.href = '#';
        else submit.type = 'button';
        submit.title = label; submit.setAttribute('aria-label', label);
        submit.dataset.role = 'submit'; submit.onclick = e => { e.preventDefault(); ctx.submit(); };
      }
      const cancel = u.el('button', 'qt-btn', foot, 'Cancel'); cancel.type = 'button'; cancel.dataset.action = 'cancel';
      cancel.onclick = () => env.log('decoy', { label: 'Cancel' });
      return { stage, submit };
    },
    overlay: drawOverlay,
  });
})();
