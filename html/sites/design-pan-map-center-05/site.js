// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.panel': (base, S) => function (_c) {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) _c.body.style.setProperty('--map-panel-offset', `${panel.getBoundingClientRect().height + 14}px`);
    },
    overlay: (base, S) => function (ctx) {
      const result = base(ctx);
      if (ctx.kind === 'banner' || ctx.kind === 'promo') {
        const header = document.querySelector('.ref-task');
        result.el.style.setProperty('--map-toolbar-height', `${header?.getBoundingClientRect().height || 56}px`);
      }
      if (ctx.kind === 'promo') {
        const box = result.el.querySelector('.ref-ov-box');
        const heading = ctx.util.el('div', 'map-promo-heading', box, 'Stay in the loop');
        box.prepend(heading);
        const icon = ctx.util.el('div', 'map-promo-icon', box);
        icon.innerHTML = '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="6" y="12" width="36" height="26" rx="4" fill="#0052f5"/><path d="M7 14l17 13 17-13" fill="none" stroke="white" stroke-width="2"/></svg>';
        box.prepend(icon);
        const input = ctx.util.el('input', 'map-promo-email', box);
        input.type = 'email';
        input.placeholder = 'Your email address';
        input.setAttribute('aria-label', 'Your email address');
        box.insertBefore(input, box.querySelector('.ref-ov-row'));
        const close = ctx.util.el('button', 'map-promo-close', box, '×');
        close.type = 'button';
        close.setAttribute('aria-label', 'Close');
        close.addEventListener('click', () => ctx.dismiss('close'));
      }
      if (ctx.kind === 'chat') {
        const heading = ctx.util.el('div', 'map-chat-heading', result.el, 'Need help?');
        result.el.prepend(heading);
        const compose = ctx.util.el('div', 'map-chat-compose', result.el);
        const input = ctx.util.el('input', '', compose);
        input.placeholder = 'Type a message…';
        input.setAttribute('aria-label', 'Chat message');
        const send = ctx.util.el('button', '', compose, '➤');
        send.type = 'button';
        send.setAttribute('aria-label', 'Send message');
        send.addEventListener('click', () => env.log('decoy', { label: 'Send message' }));
      }
      return result;
    },
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, tall, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebar = roomy && rng.bool(0.35);
      const nav = (W >= 1180 && rng.bool(0.5)) || true;
      const sampledDecoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      const decoys = sampledDecoys.slice(0, 0);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      if (label === 'Continue') label = 'Done';
      // A decoy that reads like an end control (another end word, never this episode's label).
      let { collide, cr } = S.frameCollide(_c, label);
      if (ctx.finish) collide = null;
      if (collide && label === 'Done') collide.text = 'Finish';
      Object.assign(_c, { collide, cr, decoys, label, nav, placement, sidebar, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { content, display, local, nav, rng, util } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      if (display !== 'header' || nav) {
        rng.pick(TITLES);
      }
      if (nav) {
        local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
      }
      const brand = util.el('div', 'map-brand', header);
      util.el('div', 'map-brand-title', brand, 'Rivermere');
      util.el('div', 'map-brand-subtitle', brand, 'Map & Places');
      const stats = util.el('div', 'map-stats', header);
      const statIcons = [
        '<path d="M12 1C6 1 2.5 5.4 2.5 11c0 7 9.5 17 9.5 17s9.5-10 9.5-17C21.5 5.4 18 1 12 1zm0 13.2a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z"/>',
        '<path d="M4 28V6l8-5 8 5v22h-5v-7H9v7zm3-19v3h3V9zm7 0v3h3V9zM7 15v3h3v-3zm7 0v3h3v-3z"/>',
        '<path d="M2 28 8 2h6l-2 26zm16 0L16 2h6l6 26zM14 14h4v3h-4z"/>',
        '<path d="M15 29v-7h8l-6-9h4L12 1 3 13h4l-6 9h8v7z"/>'
      ];
      for (const [index, value, label] of [[0, '22', 'Places'], [1, '6', 'Districts'], [2, '48 km', 'Major roads'], [3, '8', 'Parks']]) {
        const stat = util.el('div', 'map-stat', stats);
        const icon = util.el('span', 'map-stat-icon', stat);
        icon.innerHTML = `<svg viewBox="0 0 30 30" aria-hidden="true">${statIcons[index]}</svg>`;
        const copy = util.el('span', 'map-stat-copy', stat);
        util.el('strong', '', copy, value);
        util.el('small', '', copy, label);
      }
      const search = util.el('div', 'map-search', header);
      util.el('span', 'map-search-symbol', search, '⌕');
      const field = util.el('input', 'map-search-field', search);
      field.type = 'text';
      field.placeholder = 'Search places...';
      field.setAttribute('aria-label', 'Search places');
      Object.assign(_c, { header });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-pan-map-center-05',
    template: 'site/base',
    design: { parts },
  });
})();
