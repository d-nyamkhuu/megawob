// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  // Small, shaded desktop glyphs, drawn separately from the task controls.
  const shopIcon = (name, tone = 'nav') => {
    const id = `se-glyph-${tone}-${name}`;
    const pale = tone === 'nav';
    const top = pale ? '#c8d8eb' : '#616b76';
    const bottom = pale ? '#a5b9d3' : '#3c444d';
    const ink = `url(#${id})`;
    const edge = pale ? '#e3eaf5' : '#f8fafc';
    const glyphs = {
      home: `<path d="M1 15.5 16 2l15 13.5h-5V30h-8V20h-5v10H6V15.5Z" fill="${ink}" stroke="#e5efff" stroke-width=".6"/><path d="m4 14 12-11 12 11" fill="none" stroke="#fff" stroke-width=".8" opacity=".65"/>`,
      cart: `<g fill="none" stroke="${ink}" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h5l5 20h15M8 8h22l-3 11H11"/></g><g fill="${ink}"><circle cx="13" cy="28" r="2.2"/><circle cx="25" cy="28" r="2.2"/></g>`,
      doc: `<rect x="5.5" y="2" width="21" height="28" rx="1.5" fill="none" stroke="${ink}" stroke-width="2.3"/><path d="M10 8h12M10 13h12M10 18h12M10 23h7" fill="none" stroke="${ink}" stroke-width="1.8"/><path d="M7 3h18" stroke="${edge}" stroke-width=".7" opacity=".7"/>`,
      user: `<circle cx="16" cy="7.5" r="6.3" fill="${ink}" stroke="${edge}" stroke-opacity=".45" stroke-width=".6"/><path d="M3.5 30v-3c0-5.8 5.2-9.3 12.5-9.3S28.5 21.2 28.5 27v3Z" fill="${ink}" stroke="${edge}" stroke-opacity=".5" stroke-width=".7"/><path d="M6 24c1.8-3.5 5.5-5.1 10-5.1" fill="none" stroke="#fff" stroke-opacity=".15"/>`,
      help: `<circle cx="16" cy="16" r="14" fill="${ink}" stroke="${edge}" stroke-width=".8"/><path d="M11.4 10.8a4.7 4.7 0 0 1 9.2 1.4c0 2.3-1.4 3.4-3.2 4.4-1.5.9-1.7 1.6-1.7 3" fill="none" stroke="${pale ? '#263443' : '#fff'}" stroke-width="3.3" stroke-linecap="round"/><circle cx="15.7" cy="25" r="1.7" fill="${pale ? '#263443' : '#fff'}"/>`,
      box: `<path d="m1.5 8 14.5-7 14.5 7v17L16 31 1.5 25Z" fill="${ink}" stroke="#f8fafc" stroke-width=".8"/><path d="m1.5 8 14.5 7 14.5-7M16 15v16" fill="none" stroke="#f1f4f7" stroke-width="1.4"/><path d="m5.2 6.2 14.6 7.1 4.1-2L9.4 4.2Zm14.6 7.1v7.3l4.1-2v-7.3Z" fill="#eef1f4"/><path d="m22.8 4.3-14.5 7v6l3.5 1.7v-6L26.3 6Z" fill="#e3e8ed"/><path d="m2.4 9 12.6 6.1v14.2L2.4 24Z" fill="#111d2b" opacity=".15"/>`,
      heart: `<path d="M16 30 4.2 18.8C-3.3 11.3.4 2 8 2c3.7 0 6.5 2.1 8 5 1.5-2.9 4.3-5 8-5 7.6 0 11.3 9.3 3.8 16.8Z" fill="${ink}" stroke="#f7f9fb" stroke-width=".9"/><path d="M3 10.5c.5-5.4 6-8 10-4.9" fill="none" stroke="#fff" stroke-opacity=".16" stroke-width="1"/>`,
      lock: `<path d="M8.5 14V9a7.5 7.5 0 0 1 15 0v5" fill="none" stroke="${ink}" stroke-width="3.4"/><rect x="3" y="13" width="26" height="19" rx="2.5" fill="${ink}" stroke="#f5f7fa" stroke-width=".8"/><path d="M6 15h20" stroke="#fff" stroke-opacity=".15"/><path d="M16 18a2.4 2.4 0 0 0-1.2 4.5l-.5 5h3.4l-.5-5A2.4 2.4 0 0 0 16 18Z" fill="#fff"/>`,
      brand: `<path d="M2 3h5l4.8 20.3H27" fill="none" stroke="${tone === 'title' ? '#e8f1fc' : '#2475e5'}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M8.1 7.1H31l-3.5 13H11.2Z" fill="url(#${id}-blue)" stroke="#2d75d9" stroke-width=".6"/><path d="M9 8h20" stroke="#7cb2ff" stroke-opacity=".7" stroke-width=".8"/><circle cx="13" cy="28.5" r="2.7" fill="${tone === 'title' ? '#f1f7ff' : '#348aff'}"/><circle cx="25" cy="28.5" r="2.7" fill="${tone === 'title' ? '#f1f7ff' : '#348aff'}"/>`,
    };
    return `<svg class="se-icon-${name}" viewBox="0 0 32 34" width="32" height="34" aria-hidden="true" focusable="false"><defs><linearGradient id="${id}" x1="0" y1="0" x2=".4" y2="1"><stop stop-color="${name === 'home' ? '#ffffff' : top}"/><stop offset="1" stop-color="${name === 'home' ? '#d3e3fc' : bottom}"/></linearGradient><linearGradient id="${id}-blue" x2=".3" y2="1"><stop stop-color="#3489ff"/><stop offset="1" stop-color="#1557d1"/></linearGradient></defs>${glyphs[name]}</svg>`;
  };

  const parts = {
    'frame.layout': (base, S) =>
      function (_c) {
        const { ctx } = _c;
        const W = window.innerWidth;
        const H = window.innerHeight;
        const roomy = W >= 1260;
        const tall = H >= 700;
        let display = ctx.display || 'header';
        if (display === 'panel' && !roomy) display = 'header';
        if (display === 'toast' && !tall) display = 'header';
        // reset() reuses the body: a previous toast must not shrink later episodes.
        document.body.classList.toggle('ref-has-note', display === 'toast');
        document.body.classList.toggle('cad-header-note', display === 'header');
        Object.assign(_c, { H, W, display, roomy, tall });
      },
    'frame.placement': (base, S) =>
      function (_c) {
        const { W, content, ctx, local, lr, rng, roomy, tall, util, word } = _c;
        const { K, endLabel } = S;
        // End control placement (none in finish mode).
        let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
        const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
        if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
        const sidebar = roomy && rng.bool(0.35);
        const nav = W >= 1180 && rng.bool(0.5);
        const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
        let label = endLabel(rng, content);
        if (word) label = word(lr.pick(K.end));
        // A decoy that reads like an end control (another end word, never this episode's label).
        const { collide, cr } = S.frameCollide(_c, label);

        // DraftSight-style application frame. Keep this frame separate from the task
        // widget so the wizard continues to own all scored interactions.
        const appTitle = util.el('div', 'cad-titlebar', document.body);
        util.el('span', 'cad-app-mark', appTitle).innerHTML =
          '<span class="se-app-tile">' + shopIcon('brand', 'title') + '</span>';
        util.el('span', '', appTitle, 'ShopEase');
        const wc = util.el('span', 'cad-window-controls', appTitle);
        util.el('i', 'wb', wc, '−');
        util.el('i', 'wb', wc, '□');
        util.el('i', 'wb wx', wc, '×');
        const menu = null;
        const toolbar = null;
        Object.assign(_c, { appTitle, collide, cr, decoys, label, menu, nav, placement, sidebar, toolbar, wantFooter });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { util } = _c;
        const body = util.el('div', 'ref-body', document.body);
        const explorer = util.el('div', 'cad-explorer', body);
        const brand = util.el('div', 'se-brand', explorer);
        brand.innerHTML = '<span>' + shopIcon('brand', 'brand') + '</span> ShopEase';
        for (const [i, n] of [['home', 'Shop'], ['cart', 'Cart'], ['doc', 'Orders'], ['user', 'Account'], ['help', 'Help']].entries()) {
          const it = util.el('div', i === 0 ? 'se-nav on' : 'se-nav', explorer);
          it.innerHTML = shopIcon(n[0]) + '<span>' + n[1] + '</span>';
          if (i === 1) util.el('span', 'se-badge', it, '3');
        }
        const extra = S.frameSidebar(_c, body);
        if (extra) extra.remove();
        Object.assign(_c, { body });
      },
    'frame.header': (base, S) => function (_c) {
      base(_c);
      const brand = _c.header.querySelector('.ref-brand');
      if (brand) brand.remove();
    },
    'frame.nav': (base, S) => function (_c) {
      base(_c);
      const nav = _c.header.querySelector('.ref-nav');
      if (nav) nav.remove();
    },
    'frame.instruction': (base, S) => function (_c) {
      if (_c.display === 'header')
        _c.util.el('div', 'ref-instruction', _c.header, _c.ctx.instruction);
    },
    'frame.tools': (base, S) => function (_c) {
      base(_c);
      _c.appTitle.appendChild(_c.headerTools);
    },
    'frame.footer': (base, S) => function (_c) {
      base(_c);
      const copy = document.querySelector('.ref-foot-text');
      if (copy) copy.remove();
    },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, util } = _c;
        const workspace = util.el('div', 'cad-workspace', body);
        const canvas = util.el('div', 'cad-blueprint', workspace);
        canvas.setAttribute('aria-hidden', 'true');
        const storeWindow = util.el('div', 'cad-store-window', workspace);
        const stage = util.el('main', 'ref-stage cad-stage', storeWindow);
        S.frameAlign(_c, stage);
        const help = util.el('aside', 'se-help', workspace);
        util.el('h3', '', help, 'Why create an account?');
        for (const [k, t] of [['user', 'Speed up future checkouts'], ['box', 'Track your orders easily'], ['heart', 'Save your details securely']]) {
          const p = util.el('p', 'se-ic', help);
          p.innerHTML = shopIcon(k, 'help') + '<span>' + t + '</span>';
        }
        util.el('hr', '', help);
        util.el('h3', '', help, 'We keep your information safe');
        const lp = util.el('p', 'se-ic se-secure', help);
        lp.innerHTML = shopIcon('lock', 'help') + '<span>Your details are protected using industry-standard encryption.</span>';
        util.el('hr', '', help);
        util.el('h3', '', help, 'Need help?');
        const hl = util.el('div', 'se-ic se-hl', help);
        hl.innerHTML = shopIcon('help', 'help');
        const links = util.el('div', '', hl);
        for (const t of ['Account and privacy', 'Placing an order', 'Delivery information', 'Payment methods'])
          util.el('a', 'se-link', links, t);
        Object.assign(_c, { canvas, stage });
      },
  };

  env.site({
    name: 'design-complete-wizard-checkout-05',
    template: 'site/base',
    design: { parts },
  });
})();
