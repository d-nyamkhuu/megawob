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
      if (collide && label === 'Done') collide.text = 'All set';
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
        const n = util.el('nav', 'ref-nav', header);
        const navItems = local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
        for (const label of ['Map', 'Places', 'Routes', 'Areas', 'Settings']) {
          const a = util.el('a', 'ref-navlink', n, label);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label }); });
        }
      }
      const search = util.el('div', 'map-search', header);
      util.el('span', 'map-search-symbol', search, '⌕');
      const field = util.el('input', 'map-search-field', search);
      field.type = 'text';
      field.placeholder = 'Search places, streets or districts';
      field.setAttribute('aria-label', 'Search places, streets or districts');
      Object.assign(_c, { header });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-pan-map-center-01',
    template: 'site/base',
    design: { parts },
  });
})();
