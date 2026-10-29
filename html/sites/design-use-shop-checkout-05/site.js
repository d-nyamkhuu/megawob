(function () {
  'use strict';
  env.site({
    name: 'design-use-shop-checkout-05',
    template: 'site/base',
    design: {
      THEMES: { light: { bg: '#e8f1fc', panel: '#fff', fg: '#08162d', muted: '#49617c', line: '#8bb5e8' }, dark: { bg: '#e8f1fc', panel: '#fff', fg: '#08162d', muted: '#49617c', line: '#8bb5e8' }, warm: { bg: '#e8f1fc', panel: '#fff', fg: '#08162d', muted: '#49617c', line: '#8bb5e8' } },
      LOW_THEME: { bg: '#e8f1fc', panel: '#fff', fg: '#08162d', muted: '#49617c', line: '#8bb5e8' },
      LOW_ACCENTS: ['#2374d8'], ACCENTS: ['#2374d8'], TITLES: ['ShopMart'],
      parts: {
        overlay: (base) => function (ctx) {
          const result = base(ctx);
          if (ctx.kind === 'chat') {
            const entry = ctx.util.el('div', 'shop-chat-entry', result.el);
            const field = ctx.util.el('input', '', entry);
            field.placeholder = 'Type a message...';
            field.setAttribute('aria-label', 'Chat message');
            const send = ctx.util.el('button', 'ref-ov-btn ref-ov-primary', entry, 'Send');
            send.type = 'button';
            send.addEventListener('click', () => env.log('overlay-click', { label: 'Send' }));
          }
          return result;
        },
        endLabel: (base) => (rng, content) => {
          const label = base(rng, content);
          return rng.fork('shop/end-label').bool(0.5) ? 'Done' : label;
        },
        frameBrand: function (_base, S) { return function (_c, header) {
          const { util } = _c;
          const brand = util.el('div', 'shop-brand', header);
          const cart = util.el('span', 'shop-cart-mark', brand);
          cart.innerHTML = '<svg viewBox="0 0 76 64" aria-hidden="true"><path d="M3 5h12l10 40h37M20 13h47l-7 25H25M32 13l3 25M46 13v25M60 13l-4 25M22 25h41" fill="none" stroke="currentColor" stroke-width="4"/><circle cx="30" cy="55" r="5" fill="currentColor"/><circle cx="58" cy="55" r="5" fill="currentColor"/></svg>';
          const copy = util.el('span', 'shop-brand-copy', brand);
          util.el('strong', '', copy, 'ShopMart');
          util.el('small', '', copy, 'Great Products. Lower Prices. Everyday.');
          return brand;
        }; },
        'frame.nav': function () { return function () {}; },
        'frame.header': function (_base, S) { return function (_c) {
          const { ctx, util } = _c;
          const header = util.el('header', 'ref-task shop-header', document.body);
          _c.header = header;
          S.frameBrand(_c, header);
          _c.shopPromo = util.el('div', 'shop-promo', header);
          util.el('b', 'promo-red', _c.shopPromo, 'Spring Savings!');
          util.el('strong', '', _c.shopPromo, 'Save 10% on your order with code');
          util.el('b', 'promo-code', _c.shopPromo, 'SPRING10');
          const links = util.el('div', 'shop-account-links', header);
          for (const item of ['Sign In', 'Your Account', 'Help']) util.el('a', '', links, item);
        }; },
        'frame.footer': function (_base) { return function (_c) {
          const { collide, decoyBtn, decoys, endBtn, label, placement, rng, util, wantFooter } = _c;
          let { submit } = _c;
          const tools = util.el('div', 'shop-finishbar', document.body);
          if (decoys.length > 1) decoyBtn(tools, decoys[1]);
          if (collide && collide.where === 'footer') decoyBtn(tools, collide.text, true);
          if (!submit && wantFooter && (placement === 'footer' || placement === 'link')) submit = endBtn(tools, placement === 'link' ? 'ref-endlink' : 'ref-submit', label);
          if (!tools.children.length) tools.remove();
          const foot = util.el('footer', 'shop-dock', document.body);
          const links = [['<path d="M2 14 16 2l14 12h-5v16h-7V20h-5v10H6V14Z"/>','Home'],['<path d="m2 17 15-15h13v13L15 30Z"/><circle cx="24" cy="8" r="3" fill="#154a84"/>','Deals'],['<circle cx="16" cy="8" r="7"/><path d="M3 30v-5c0-13 26-13 26 0v5Z"/>','Account'],['<circle cx="16" cy="16" r="15"/><text x="16" y="25" text-anchor="middle" fill="#154a84" font-size="26" font-family="Arial" font-weight="bold">?</text>','Help']];
          for (let i = 0; i < links.length; i++) {
            const cell = util.el('div', 'dock-item dock-' + links[i][1].toLowerCase(), foot);
            const icon = util.el('b', '', cell);
            icon.innerHTML = '<svg viewBox="0 0 32 32" aria-hidden="true" fill="currentColor">' + links[i][0] + '</svg>';
            util.el('span', '', cell, links[i][1]);
          }
          _c.submit = submit;
        }; },
      },
    },
  });
})();
