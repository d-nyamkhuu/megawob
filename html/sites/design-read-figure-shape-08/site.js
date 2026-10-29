(function () {
  'use strict';
  const C = {
    'site': 'design-read-figure-shape-08',
    'task': 'read-figure',
    'scenario': 'shape',
    'title': 'Shape Finder',
    'menu': ['File', 'Edit', 'Options', 'Help'],
    'icons': ['My Computer', 'Network Neighborhood', 'Recycle Bin', 'Control Panel'],
  };
  function desktopIcon(u, parent, kind) {
    const svg = u.svg('svg', { viewBox: '0 0 56 56', 'aria-hidden': 'true' }, parent);
    const path = (d, fill, stroke = '#202020') => u.svg('path', { d, fill, stroke, 'stroke-width': 1.2 }, svg);
    const rect = (x, y, w, h, fill, stroke = '#222') =>
      u.svg('rect', { x, y, width: w, height: h, fill, stroke, 'stroke-width': 1 }, svg);
    function computer(x, y, k = 1) {
      const g = u.svg('g', { transform: `translate(${x} ${y}) scale(${k})` }, svg);
      u.svg('path', { d: 'M9 1L39 1 42 4 40 32 6 32 7 5Z', fill: '#c0c0c0', stroke: '#111' }, g);
      u.svg('path', { d: 'M9 2H38V28H9Z', fill: '#fff', stroke: '#555' }, g);
      u.svg('rect', { x: 12, y: 5, width: 24, height: 20, fill: '#000080', stroke: '#111' }, g);
      u.svg('path', { d: 'M18 11L31 9 30 20 18 22Z', fill: '#00a0b0', stroke: '#aaa' }, g);
      u.svg('path', { d: 'M20 13L27 12 24 17 28 17 21 20Z', fill: '#4cff00' }, g);
      u.svg('path', { d: 'M8 33H39L44 42H2L5 35ZM4 43H44V47H2Z', fill: '#c0c0c0', stroke: '#111' }, g);
      u.svg('path', { d: 'M9 36H34M7 39H38M7 44H30', stroke: '#fff', 'stroke-width': 2 }, g);
      u.svg('path', { d: 'M30 44H37', stroke: '#555' }, g);
    }
    if (kind === 0) computer(2, 2);
    else if (kind === 1) {
      computer(0, 0, 0.67);
      computer(22, 20, 0.67);
      path('M6 39H17V33M17 39H27M17 39V46H37', 'none', '#555');
    } else if (kind === 2) {
      path('M5 10L27 2 50 13 42 49 25 54 10 43Z', '#c0c0c0');
      path('M5 10L26 20 50 13 27 2Z', '#eee');
      path('M26 20L25 54 42 49 50 13Z', '#999');
      path('M12 12L27 6 43 13 26 17Z', '#888');
      path(
        'M17 24L21 21 25 27 21 27 19 31 15 29ZM31 29L34 23 38 28 37 35 33 34 34 30ZM23 38L26 34 29 39 27 43 20 40 21 36Z',
        '#008000',
        '#008000',
      );
    } else {
      rect(3, 5, 47, 37, '#ccc');
      rect(6, 8, 41, 5, '#000080');
      rect(7, 16, 38, 22, '#fff');
      rect(10, 19, 10, 13, '#000080');
      rect(25, 19, 15, 13, '#000080');
      path('M14 21V29M10 25H18M29 20V31M35 20V31', 'none', '#ffff00');
      path('M38 31C46 31 47 42 45 50L39 53 32 50 32 41Z', '#ddd');
      path('M38 35V42M38 31V25', 'none');
    }
    return svg;
  }
  env.site({
    name: C.site,
    styles: ['win.css'],
    frame(ctx) {
      document.body.className = 'win instruction-' + ctx.display;
      const u = ctx.util;
      const desk = u.el('div', 'desk', document.body);
      C.icons.forEach((n, i) => {
        const ic = u.el('div', 'dicon', desk);
        const glyph = u.el('i', 'dglyph g' + i, ic);
        desktopIcon(u, glyph, i);
        u.el('span', '', ic, n);
      });
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      desktopIcon(u, u.el('i', 'tico', top), 3);
      u.el('span', 'ttl', top, C.title);
      const endRng = ctx.rng.fork('chrome/end'),
        collRng = ctx.rng.fork('chrome/collide');
      const labels =
        ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const standardSubmit = labels.find((x) => labelOf(x).trim().toLowerCase() === 'submit') || labels[0];
      const endLabel = endRng.bool(0.5) ? labelOf(standardSubmit) : labelOf(endRng.pick(labels));
      const placement = ctx.finish ? null : endRng.pick(['footer', 'footer', 'header', 'icon']);
      let collide = null;
      if (collRng.bool(0.3)) {
        const pool = labels.map(labelOf).filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (pool.length) collide = labelOf(collRng.pick(pool));
      }
      const wc = u.el('div', 'wctl', top);
      if (placement === 'icon') {
        const b = u.el('button', 'title-end icon-end', wc, '✓');
        b.type = 'button';
        b.title = endLabel;
        b.setAttribute('aria-label', endLabel);
        b.addEventListener('click', ctx.submit);
      }
      ['_', '□', '×'].forEach((t) => u.el('b', '', wc, t));
      const menu = u.el('nav', 'menu', app);
      C.menu.forEach((m) => {
        const item = u.el('span', '', menu);
        u.el('u', '', item, m[0]);
        item.append(m.slice(1));
      });
      if (placement === 'header') {
        const b = u.el('button', 'menu-end', menu, endLabel);
        b.type = 'button';
        b.addEventListener('click', ctx.submit);
      }
      if (collide) {
        const b = u.el('button', 'menu-xtra', menu, collide);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
      }
      if (ctx.display === 'toast') {
        const note = u.el('div', 'toast-note', top, ctx.instruction);
        note.setAttribute('role', 'status');
      }
      const center = u.el('div', 'center', app);
      const left = u.el('div', 'left', center);
      if (ctx.display === 'header') {
        const zone = u.el('div', 'taskzone', left),
          tg = u.el('fieldset', 'grp taskgrp', zone);
        u.el('legend', '', tg, 'Task');
        const inner = u.el('div', 'task-inner', tg);
        u.el('div', 'brief' + (ctx.instruction.length > 28 ? ' long' : ''), inner, ctx.instruction);
        u.el('div', 'task-details', inner);
        u.el('div', 'task-preview', inner);
      }
      const sg = u.el('fieldset', 'grp shapegrp', left);
      u.el('legend', '', sg, 'Shapes');
      const stage = u.el('section', 'stage', sg);
      const aside = u.el('aside', 'aside', center);
      const fg = u.el('fieldset', 'grp fbgrp', aside);
      u.el('legend', '', fg, 'Feedback');
      if (ctx.display === 'panel') u.el('div', 'panel-note', fg, ctx.instruction);
      u.el('div', 'fbbox', fg, 'No shape selected.');
      const footer = u.el('footer', 'bottom', aside);
      const clear = u.el('button', 'wbtn clear', footer, 'Clear');
      clear.type = 'button';
      clear.addEventListener('click', () => env.log('decoy', { label: 'Clear' }));
      const help = u.el('button', 'wbtn', footer, 'Help');
      help.type = 'button';
      help.addEventListener('click', () => env.log('decoy', { label: 'Help' }));
      let submit = null;
      if (!ctx.finish && placement === 'footer') {
        submit = u.el('button', 'submit wbtn', footer, endLabel);
        submit.type = 'button';
        submit.addEventListener('click', ctx.submit);
      }
      if (!ctx.finish && placement === 'header') submit = menu.querySelector('.menu-end');
      if (!ctx.finish && placement === 'icon') submit = wc.querySelector('.icon-end');
      const tb = u.el('div', 'taskbar', document.body);
      const pm = u.el('div', 'tbtn', tb);
      desktopIcon(u, u.el('i', 'bar-icon', pm), 3);
      pm.append('Program Manager');
      const active = u.el('div', 'tbtn active', tb);
      desktopIcon(u, u.el('i', 'bar-icon', active), 3);
      active.append('Shape Finder');
      u.el('div', 'clock', tb, '10:24 AM');
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body);
      const messages = {
        cookie: 'This application stores preferences on your device.',
        toast: 'Your workspace has been synced.',
        chat: 'Need help with this exercise?',
        promo: 'Try the new practice collection.',
        banner: 'An updated practice collection is available.',
      };
      u.el('span', '', el, messages[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Dismiss');
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  });
})();
