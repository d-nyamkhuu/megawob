// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.placement': (base, S) => function (_c) {
      base(_c);
      const r = _c.rng.fork('paper/end');
      _c.placement = _c.ctx.finish ? null : r.pick(['footer', 'footer', 'footer', 'header', 'icon', 'link']);
      _c.wantFooter = _c.placement === 'footer' || _c.placement === 'link';
      if (r.bool(0.5)) _c.label = 'Confirm';
    },
    'frame.header': (base, S) => function (_c) {
      base(_c);
      const { util, header } = _c;
      const nav = util.el('nav', 'paper-nav', header);
      for (const text of ['Dashboard', 'Orders', 'Customers', 'Products', 'Reports']) {
        util.el('span', text === 'Orders' ? 'paper-tab active' : 'paper-tab', nav, text);
      }
      const icons = util.el('div', 'paper-account', header);
      util.el('span', 'paper-search-icon', icons);
      const bell = util.el('span', 'paper-bell', icons);
      bell.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M5 17h14l-2-3V9a5 5 0 0 0-4-4V3h-2v2a5 5 0 0 0-4 4v5zM10 19a2 2 0 0 0 4 0z"/></svg>';
      util.el('span', 'paper-avatar', icons, 'JD');
    },
    'frame.tools': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, header, label, placement, util, wantFooter } = _c;
      let submit = null;
      const headerTools = util.el('div', 'ref-tools', header);
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }

      Object.assign(_c, { headerTools, submit });
    },
    'frame.toast': (base, S) => function (_c) {
      base(_c);
      const note = document.querySelector('.ref-note');
      if (note) _c.header.insertBefore(note, _c.headerTools);
    },
    overlay: (base, S) => function (ctx) {
      const result = base(ctx);
      if (ctx.kind === 'promo') {
        const box = result.el.querySelector('.ref-ov-box');
        const text = box.querySelector('.ref-ov-text');
        text.textContent = 'Get product updates';
        const subtitle = ctx.util.el('p', 'paper-promo-copy', box, 'Subscribe to our newsletter for the latest features, tips and resources.');
        text.after(subtitle);
        const art = ctx.util.el('span', 'paper-envelope', box, '✉');
        const form = ctx.util.el('div', 'paper-subscribe', box);
        subtitle.after(form);
        const input = ctx.util.el('input', '', form);
        input.placeholder = 'Enter your email address';
        const subscribe = ctx.util.el('button', 'ref-ov-btn ref-ov-primary', form, 'Subscribe');
        subscribe.addEventListener('click', () => ctx.dismiss('close'));
        const close = ctx.util.el('button', 'paper-promo-close', box, '×');
        close.setAttribute('aria-label', 'Close');
        close.addEventListener('click', () => ctx.dismiss('close'));
        result.dismiss.textContent = 'No thanks';
      }
      return result;
    },
  };

  env.site({
    name: 'design-use-data-grid-bulk-05',
    template: 'site/base',
    design: { parts },
  });
})();
