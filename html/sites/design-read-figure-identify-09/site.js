(function () {
  'use strict';
  const C = {
    'site': 'design-read-figure-identify-09',
    'task': 'read-figure',
    'scenario': 'identify',
    'style': 'dark',
    'title': 'SkillLab | Visual Skills Practice',
    'menu': '',
    'note': 'Shape Identification',
    'layout': 'brief-left',
    'subtitle': '',
    'aside': '',
  };
  env.site({
    name: C.site,
    styles: ['look.css'],
    frame(ctx) {
      const endRng = ctx.rng.fork('chrome/end'),
        collideRng = ctx.rng.fork('chrome/collide');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endLabels = ctx.content.END_LABELS.map(labelOf);
      const referenceEnd = endRng.bool(0.5);
      const endPlacement = referenceEnd ? 'footer' : endRng.pick(['toolbar', 'link']);
      const endLabel = referenceEnd ? 'Submit' : endRng.pick(endLabels);
      const collide = collideRng.bool(0.3),
        otherLabels = endLabels.filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
      document.body.className = C.style + ' ' + C.layout + ' instruction-' + ctx.display;
      const u = ctx.util,
        app = u.el('main', 'app', document.body),
        top = u.el('header', 'top', app);
      const icon = u.svg('svg', { width: 23, height: 25, viewBox: '0 0 23 25', class: 'tico' }, top);
      u.svg('rect', { x: 1, y: 1, width: 21, height: 23, fill: '#c8c5b9', stroke: '#333' }, icon);
      u.svg(
        'path',
        {
          d: 'M4 4L6 21H18L20 4M5 7L10 18L13 6L17 19M4 12L9 9L14 15L19 10',
          fill: 'none',
          stroke: '#344856',
          'stroke-width': 1.4,
        },
        icon,
      );
      u.el('span', '', top, 'VisionCal 1.2.0  -  Object Identification');
      const wc = u.el('div', 'wc', top);
      ['_', '□', '✕'].forEach((t) => u.el('b', '', wc, t));
      const menu = u.el('nav', 'menu', app);
      ['File', 'Tools', 'View', 'Help'].forEach((t) => u.el('span', '', menu, t));
      const center = u.el('div', 'center', app),
        tabs = u.el('div', 'tabs', center);
      ['Task', 'Settings', 'Results', 'Reference', 'About'].forEach((t, i) =>
        u.el('div', 'tab' + (i ? '' : ' on'), tabs, t),
      );
      const page = u.el('div', 'page', center);
      const rings = u.el('div', 'rings', page);
      for (let i = 0; i < 16; i++) {
        const ring = u.el('i', 'ring', rings);
        ring.style.top = (i * 100) / 15 + '%';
        u.el('b', '', ring);
      }
      const ph = u.el('div', 'ph', page);
      u.el('span', '', ph, 'Calibration Utility');
      u.el('span', 'mod', ph, 'Module: Shape Recognition');
      const workspace = ctx.display === 'panel' ? u.el('div', 'workspace', page) : page;
      if (ctx.display !== 'hidden') u.el('div', 'brief', workspace, ctx.instruction);
      const stage = u.el('section', 'stage', workspace);
      const footer = u.el('footer', 'bottom', page);
      const info = u.el('div', 'info', footer);
      u.el('span', '', info, 'Camera: CAM-01   640x480   30 fps');
      u.el('span', '', info, 'Frame: 012348   2004-05-14   10:27:16');
      let submit = null;
      if (!ctx.finish) {
        const parent = endPlacement === 'toolbar' ? menu : footer;
        submit = u.el(endPlacement === 'link' ? 'a' : 'button', 'submit end-' + endPlacement, parent, endLabel);
        if (endPlacement === 'link') submit.href = '#';
        else submit.type = 'button';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.dataset.role = 'submit';
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      }
      if (collide && otherLabels.length) {
        const label = collideRng.pick(otherLabels),
          decoy = u.el('button', 'xtra', menu, label);
        decoy.type = 'button';
        decoy.dataset.role = 'xtra';
        decoy.addEventListener('click', () => env.log('decoy', { label, collide: true }));
      }
      const st = u.el('div', 'status', app);
      u.el('span', '', st, 'Ready');
      u.el('span', '', st, 'User: operator  |  Mode: Identification');
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
