/* 2008 office-ribbon shape studio with a floating rotation palette. Task state belongs to the rotate task. */
(function () {
  'use strict';
  const S = (parent, tag, attrs) => env.util.svg(tag, attrs || {}, parent);
  function glyph(parent, name, size = 34) {
    const svg = S(parent, 'svg', { width: size, height: size, viewBox: '0 0 32 32', 'aria-hidden': 'true' });
    const defs = S(svg, 'defs');
    const grad = S(defs, 'linearGradient', { id: 'ribbon-gloss-' + name, x1: '0%', y1: '0%', x2: '85%', y2: '100%' });
    for (const [offset, color] of [
      ['0%', '#f2fbff'],
      ['35%', '#8fc5f6'],
      ['65%', '#4892df'],
      ['100%', '#2965b9'],
    ])
      S(grad, 'stop', { offset, 'stop-color': color });
    const gloss = 'url(#ribbon-gloss-' + name + ')';
    const st = {
      fill: 'none',
      stroke: '#2a62b0',
      'stroke-width': 2.2,
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
    };
    const P = (d, extra) => S(svg, 'path', Object.assign({ d }, st, extra || {}));
    switch (name) {
      case 'paste':
        P('M5 5H24V28H5Z', { fill: '#f9d581', stroke: '#ae8538', 'stroke-width': 1 });
        P('M10 3H19V7H10Z', { fill: '#e1e8f0', stroke: '#68788b', 'stroke-width': 1 });
        P('M11 11H27V30H11Z', { fill: '#fff', stroke: '#8097b0', 'stroke-width': 1 });
        P('M14 14H24M14 17H24', { stroke: '#dbe2ea', 'stroke-width': 1 });
        break;
      case 'select':
        P('M10 4V24L15 19L19 28L22 26.5L18 18H25Z', { fill: '#fff', stroke: '#333' });
        S(svg, 'rect', {
          x: 4,
          y: 3,
          width: 24,
          height: 26,
          fill: 'none',
          stroke: '#2a62b0',
          'stroke-dasharray': '3 3',
          'stroke-width': 1.5,
        });
        break;
      case 'rotate':
        P('M7 19C1 4 19 0 27 9C32 16 28 25 22 27', { stroke: '#2370c8', 'stroke-width': 2.8 });
        P('M3 16L8 23L12 15M20 23L22 28L28 28', { stroke: '#2370c8', 'stroke-width': 2.1 });
        P('M8 18C4 7 20 3 25 10', { stroke: '#91c8ff', 'stroke-width': 1 });
        break;
      case 'reset':
        P('M14 4L6 10L14 17V12C22 11 28 19 21 24C15 28 9 24 7 20L4 22C8 31 23 32 28 22C33 12 23 7 14 8Z', {
          fill: gloss,
          stroke: '#2762aa',
          'stroke-width': 1,
        });
        break;
      case 'fill':
        P('M5 16L16 5L25 14L14 27Z', { fill: '#e2e7f1', stroke: '#8490a2', 'stroke-width': 1.3 });
        P('M10 11C3 5 13 -1 16 5L20 12', { stroke: '#8a94a5', 'stroke-width': 1.5 });
        P('M7 16L16 7L22 13', { stroke: '#fff', 'stroke-width': 2 });
        P('M25 14Q30 26 27 28Q23 30 23 24Z', { fill: '#24384e', stroke: '#24384e', 'stroke-width': 1 });
        break;
      case 'outline':
        S(svg, 'rect', { x: 4, y: 4, width: 24, height: 24, fill: '#fff', stroke: '#8aa', 'stroke-width': 1.5 });
        P('M24 6L10 20L8 26L14 24L28 10Z', { fill: '#2a62b0' });
        break;
      case 'effects':
        S(svg, 'circle', { cx: 16, cy: 16, r: 12, fill: gloss, stroke: '#85b4e6', 'stroke-width': 1 });
        S(svg, 'ellipse', {
          cx: 12,
          cy: 10,
          rx: 7,
          ry: 4,
          fill: '#fff',
          opacity: 0.22,
          transform: 'rotate(-35 12 10)',
        });
        break;
      case 'zoomin':
      case 'zoomout':
        S(svg, 'circle', { cx: 12, cy: 12, r: 9, fill: gloss, stroke: '#617e9c', 'stroke-width': 1.3 });
        S(svg, 'circle', { cx: 12, cy: 12, r: 7, fill: '#eaf8ff', opacity: 0.65 });
        P('M19 19L28 28', { stroke: '#24354c', 'stroke-width': 4.5 });
        P(name === 'zoomin' ? 'M8 12H16M12 8V16' : 'M8 12H16', { 'stroke-width': 1.7 });
        break;
      case 'fit':
        S(svg, 'rect', {
          x: 3,
          y: 3,
          width: 26,
          height: 26,
          fill: '#eef3fb',
          stroke: '#2a62b0',
          'stroke-dasharray': '3 2',
          'stroke-width': 2,
        });
        P('M7 7L25 25M25 7L7 25', { stroke: '#c6d6e8', 'stroke-width': 2 });
        break;
      case 'cut':
        P('M10 4L20 20M20 4L10 20');
        S(svg, 'circle', { cx: 10, cy: 24, r: 3, fill: 'none', stroke: '#2a62b0', 'stroke-width': 2 });
        S(svg, 'circle', { cx: 20, cy: 24, r: 3, fill: 'none', stroke: '#2a62b0', 'stroke-width': 2 });
        break;
      case 'copy':
        P('M7 5H18V20H7Z', { fill: '#fff' });
        P('M14 11H25V27H14Z', { fill: '#fff' });
        break;
      case 'close':
        P('M7 7L25 25M25 7L7 25', { stroke: 'currentColor', 'stroke-width': 3 });
        break;
      case 'dial':
        S(svg, 'circle', { cx: 16, cy: 16, r: 15, fill: '#f7fbff', stroke: '#a5bedc', 'stroke-width': 0.7 });
        P('M7 18C5 7 18 4 24 11C28 16 25 22 22 25', { stroke: '#46556c', 'stroke-width': 1.7 });
        P('M4 16L8 20L10 15M20 21L21 25L25 24', { stroke: '#46556c', 'stroke-width': 1.5 });
        break;
      case 'app':
        S(svg, 'rect', { x: 3, y: 3, width: 26, height: 26, rx: 3, fill: gloss, stroke: '#c6e5ff', 'stroke-width': 1 });
        P('M10 5H24V27H10Z', { fill: '#fff', stroke: '#bac9dd', 'stroke-width': 1 });
        P('M4 15L15 9L12 20Z', { fill: '#eaba3d', stroke: '#a47e2a', 'stroke-width': 1 });
        S(svg, 'rect', { x: 16, y: 18, width: 9, height: 8, fill: '#56a2eb', stroke: '#2778b9', 'stroke-width': 1 });
        break;
      default:
        break;
    }
    return svg;
  }
  function drawOverlay(ctx) {
    const u = ctx.util;
    const el = u.el('section', 'tour-bubble overlay-' + ctx.kind, document.body);
    el.setAttribute('role', 'dialog');
    const content = {
      chat: [
        'Welcome to Shape Studio',
        'Take a quick tour to learn the controls and features.',
        'Start tour',
        'Skip tour',
      ],
      cookie: [
        'Your privacy',
        'Allow optional cookies for this practice workspace?',
        'Accept optional',
        'Reject optional',
      ],
      toast: ['Practice saved', 'Your current workspace is ready to continue.', null, 'Dismiss'],
      promo: [
        'Discover more practice',
        'Explore more exercises after completing this task.',
        'Show details',
        'Not now',
      ],
      banner: ['Workspace notice', 'This practice session works offline.', null, 'Dismiss'],
    }[ctx.kind];
    u.el('h2', '', el, content[0]);
    const close = u.el('button', 'bubble-close', el);
    close.type = 'button';
    close.setAttribute('aria-label', 'Close notice');
    glyph(close, 'close', 18);
    close.onclick = () => ctx.dismiss('close');
    const message = u.el('p', '', el, content[1]);
    const actions = u.el('div', 'tour-actions', el);
    if (content[2]) {
      const primary = u.el('button', 'tour-primary', actions, content[2]);
      primary.type = 'button';
      primary.onclick = () => {
        if (ctx.kind === 'cookie') ctx.dismiss('accept');
        else {
          message.textContent = 'Drag the round handle above your shape to rotate it until it matches the reference.';
          primary.hidden = true;
        }
      };
    }
    const dismiss = u.el('button', 'tour-dismiss', actions, content[3]);
    dismiss.type = 'button';
    dismiss.onclick = () => ctx.dismiss('skip');
    return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0 };
  }
  function ribbonButton(parent, cls, icon, label, caret) {
    const b = env.util.el('button', 'rbtn ' + cls, parent);
    b.type = 'button';
    glyph(b, icon, 38);
    const l = env.util.el('span', 'rlab', b, label);
    if (caret) env.util.el('i', 'caret', b);
    return b;
  }
  env.site({
    name: 'design-rotate-object-orient-03',
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = `ribbon-app instruction-${ctx.display}`;
      const win = u.el('div', 'app-window', document.body);
      const titlebar = u.el('header', 'titlebar', win);
      glyph(titlebar, 'app', 22);
      u.el('span', 'ttl', titlebar, 'Shape Studio - Rotate and Match');
      const wa = u.el('div', 'window-actions', titlebar);
      for (const a of ['minimize', 'maximize', 'close']) {
        const b = u.el('button', 'window-action ' + a, wa);
        b.type = 'button';
        b.setAttribute('aria-label', a);
        const svg = S(b, 'svg', { width: 14, height: 12, viewBox: '0 0 14 12' });
        if (a === 'minimize') S(svg, 'path', { d: 'M3 9H11', stroke: '#fff', 'stroke-width': 2.4 });
        else if (a === 'maximize')
          S(svg, 'rect', { x: 3, y: 2, width: 8, height: 7, fill: 'none', stroke: '#fff', 'stroke-width': 2 });
        else S(svg, 'path', { d: 'M3 1.5L11 10.5M11 1.5L3 10.5', stroke: '#fff', 'stroke-width': 2.4 });
      }
      const tabs = u.el('nav', 'rtabs', win);
      const orb = u.el('button', 'rorb', tabs);
      orb.type = 'button';
      orb.textContent = '▤ ▾';
      ['Home', 'Insert', 'Format', 'View'].forEach((t, i) => {
        const b = u.el('button', 'rtab' + (i === 0 ? ' on' : ''), tabs, t);
        b.type = 'button';
      });
      const ribbon = u.el('div', 'ribbon', win);
      const group = (name, w) => {
        const g = u.el('div', 'rgroup', ribbon);
        g.style.flex = w || '0 0 auto';
        const body = u.el('div', 'rgbody', g);
        u.el('div', 'rgname', g, name);
        return body;
      };
      let g = group('Clipboard');
      ribbonButton(g, 'big', 'paste', 'Paste');
      const sm = u.el('div', 'rsmall', g);
      for (const [i, l] of [
        ['cut', 'Cut'],
        ['copy', 'Copy'],
      ]) {
        const b = u.el('button', 'rsm', sm);
        b.type = 'button';
        glyph(b, i, 22);
        u.el('span', '', b, l);
      }
      g = group('Transform');
      ribbonButton(g, 'big sel', 'select', 'Select', true);
      ribbonButton(g, 'big', 'rotate', 'Rotate');
      ribbonButton(g, 'big', 'reset', 'Reset');
      g = group('Shape Styles');
      ribbonButton(g, 'big', 'fill', 'Fill', true);
      ribbonButton(g, 'big', 'outline', 'Outline', true);
      ribbonButton(g, 'big', 'effects', 'Effects ▾');
      g = group('View');
      ribbonButton(g, 'big', 'zoomin', 'Zoom\nIn');
      ribbonButton(g, 'big', 'zoomout', 'Zoom\nOut');
      ribbonButton(g, 'big', 'fit', 'Fit to\nWindow');

      const work = u.el('section', 'workspace', win);
      const band = u.el('div', 'instruction-band', work);
      const heading = u.el('h1', 'instruction', band, ctx.instruction);
      if (ctx.display === 'hidden') band.hidden = true;
      if (ctx.display === 'toast') {
        band.hidden = true;
      } else if (ctx.display === 'panel') {
        band.classList.add('instruction-panel');
        heading.classList.add('panel-note');
      }
      const panes = u.el('div', 'panes', work);
      u.el('div', 'pane-title left', panes, 'Your Shape (drag to rotate)');
      u.el('div', 'pane-title right', panes, 'Reference');
      const stage = u.el('main', 'cube-stage', panes);
      stage.dataset.role = 'stage';

      const bar = u.el('footer', 'statusbar', win);
      if (ctx.display === 'toast') u.el('div', 'status-toast', bar, ctx.instruction);
      let submit = null;
      const resetBtn = u.el('button', 'bar-reset', bar, 'Reset');
      resetBtn.type = 'button';
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end');
        const choices =
          Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
            ? ctx.content.END_LABELS.map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name)).filter(
                Boolean,
              )
            : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
        const submitLabel = choices.find((x) => x.toLowerCase() === 'submit') || choices[0];
        const baseline = er.bool(0.5);
        const label = baseline ? submitLabel : er.pick(choices.filter((x) => x !== submitLabel));
        const placement = baseline ? 'footer' : er.pick(['footer', 'ribbon', 'titlebar']);
        const makeEnd = (parent, cls) => {
          const b = u.el('button', cls, parent, label);
          b.type = 'button';
          b.dataset.role = 'submit';
          b.onclick = () => ctx.submit();
          return b;
        };
        if (placement === 'footer') submit = makeEnd(bar, 'submit-button');
        else if (placement === 'ribbon') {
          const action = u.el('div', 'chrome-action-group', ribbon);
          submit = makeEnd(action, 'submit-button ribbon-submit');
        } else submit = makeEnd(titlebar, 'submit-button titlebar-submit');

        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const collideChoices = choices.filter((x) => x !== label);
          if (collideChoices.length) {
            const decoyLabel = collideChoices[cr.int(0, collideChoices.length - 1)];
            const parent = placement === 'footer' ? bar : placement === 'ribbon' ? ribbon : titlebar;
            const decoy = u.el('button', 'end-xtra', parent, decoyLabel);
            decoy.type = 'button';
            decoy.onclick = () => env.log('decoy', { label: decoyLabel, collide: true });
          }
        }
      }

      const pal = u.el('aside', 'palette', document.body);
      const ph = u.el('div', 'pal-head', pal, 'Rotation');
      const pc = u.el('span', 'pal-x', ph);
      glyph(pc, 'close', 14);
      const pb = u.el('div', 'pal-body', pal);
      const row = u.el('div', 'pal-top', pb);
      glyph(row, 'dial', 48);
      u.el('span', '', row, 'Drag the handle to rotate the shape.');
      const f1 = u.el('div', 'pal-field', pb);
      u.el('span', '', f1, 'Current angle:');
      u.el('div', 'pal-box pal-angle', f1, '0°');
      const f2 = u.el('div', 'pal-field', pb);
      u.el('span', '', f2, 'Snap to angle:');
      u.el('div', 'pal-box sel', f2, 'Off');
      return { stage, submit };
    },
    overlay: drawOverlay,
  });
})();
