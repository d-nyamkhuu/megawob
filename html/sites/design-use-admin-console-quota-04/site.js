// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.placement': (base, S) => function (_c) {
      base(_c);
      if (!_c.ctx.finish && _c.ctx.rng.fork('quota/breeze-end').bool(0.55)) {
        _c.placement = 'header';
        _c.label = 'Confirm';
        if (_c.collide && _c.collide.text === 'Confirm') _c.collide.text = 'Mark complete';
      }
    },
    'frame.layout': (base, S) => function (_c) {
      const { ctx, util } = _c;
      const W = window.innerWidth;
      const H = window.innerHeight;
      const roomy = W >= 1260;
      const tall = H >= 700;
      let display = ctx.display || 'header';
      if (display === 'panel' && !roomy) display = 'header';
      if (display === 'toast' && !tall) display = 'header';
      // reset() reuses the body: a previous toast must not shrink later episodes.
      document.body.classList.toggle('ref-has-note', display === 'toast');

      // Breeze desktop title and horizontal navigation.
      const winbar = util.el('div', 'next-titlebar', document.body);
      const appIcon = util.el('span', 'next-window-icon', winbar);
      appIcon.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 18h11a4 4 0 0 0 .4-8A6 6 0 0 0 7 9a4.5 4.5 0 0 0 0 9Z" fill="none" stroke="#1686df" stroke-width="3"/><path d="M8 13h8" stroke="#1686df" stroke-width="2"/></svg>';
      util.el('span', 'next-window-title', winbar, 'Cloud Console - Acme Corporation');
      const controls = util.el('span', 'next-window-controls', winbar);
      const mini = util.el('button', 'next-window-control', controls);
      mini.setAttribute('aria-label', 'Minimize');
      mini.textContent = '−';
      const maxi = util.el('button', 'next-window-control', controls, '□');
      maxi.setAttribute('aria-label', 'Maximize');
      const close = util.el('button', 'next-window-control', controls);
      close.setAttribute('aria-label', 'Close');
      close.textContent = '×';
      const deskMenu = util.el('nav', 'next-menu', document.body);
      const items = [['⌂','Dashboard'],['▣','Subscriptions'],['▥','Compute'],['▤','Storage'],['♧','Networking'],['♟','Identity'],['▧','Monitoring'],['▣','Billing'],['⚙','Settings'],['?','Help']];
      for (const [icon, label] of items) {
        const item = util.el('div', `next-menu-item${label === 'Subscriptions' ? ' active' : ''}`, deskMenu);
        util.el('span', 'next-menu-icon', item, icon);
        util.el('span', '', item, label);
      }
      Object.assign(_c, { H, W, appIcon, close, controls, deskMenu, display, mini, roomy, tall, winbar });
    },
    'frame.tools': (base, S) => function (_c) {
      const { collide, controls, decoyBtn, decoys, endBtn, header, label, placement, util, wantFooter, winbar } = _c;
      let submit = null;
      const headerTools = util.el('div', 'ref-tools', header);
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      winbar.insertBefore(headerTools, controls);
      Object.assign(_c, { headerTools, submit });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const rail = util.el('aside', 'next-rail', body);
      const railItems = [['▤','Overview'],['♙','Directory'],['▰','Compute'],['◉','Storage'],['◎','Networking'],['▧','Subscriptions'],['▤','Service Desk'],['▥','Reports'],['⚙','Settings']];
      const glyphs = [
        '<path d="M5 2h14v20H5zM8 5h8v3H8zm0 6h8m-8 3h8m-8 3h5"/>',
        '<circle cx="9" cy="7" r="4"/><circle cx="17" cy="8" r="3"/><path d="M2 21v-4a7 7 0 0 1 14 0v4zm13-7a5 5 0 0 1 7 5v2h-5"/>',
        '<path d="M12 1 22 7v10l-10 6L2 17V7zM2 7l10 6 10-6m-10 6v10m-8-5 8 5 8-5"/>',
        '<ellipse cx="12" cy="5" rx="9" ry="4"/><path d="M3 5v14c0 2 4 4 9 4s9-2 9-4V5M3 12c0 2 4 4 9 4s9-2 9-4"/>',
        '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a16 16 0 0 1 0 20M12 2a16 16 0 0 0 0 20M4 6h16M4 18h16"/>',
        '<path d="M5 2h14v20H5zM8 6h8m-8 4h8m-8 4h8m-8 4h5"/>',
        '<path d="M5 2h14v20H5zM8 6h8m-8 4h8m-8 4h8m-8 4h5"/>',
        '<path d="M3 2h18v20H3zM7 17v-4h3v4zm6 0V8h3v9z"/>',
        '<path d="M12 2l2 2 3-1 1 3 3 2-1 3 1 3-3 2-1 3-3-1-2 2-2-2-3 1-1-3-3-2 1-3-1-3 3-2 1-3 3 1z"/><circle cx="12" cy="12" r="3"/>'
      ];
      for (const [index, [icon, label]] of railItems.entries()) {
        const item = util.el('div', `next-rail-item${label === 'Compute' ? ' active' : ''}`, rail);
        const pict = util.el('span', 'next-rail-icon', item);
        pict.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${glyphs[index]}</svg>`;
        util.el('span', 'next-rail-label', item, label);
      }
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, glyphs, rail, railItems });
    },
    'frame.floating': (base, S) => function (_c) {
      const { endBtn, label, placement, util } = _c;
      let { submit } = _c;
      if (placement === 'floating') {
        // Reserve the control's space so it cannot intercept task clicks or drags.
        // On scrollable pages the dock follows the content, just like a form footer.
        const dock = util.el('div', 'ref-float-dock', document.body);
        submit = endBtn(dock, 'ref-submit ref-float', label);
      }
      Object.assign(_c, { submit });
    },
  };

  env.site({
    name: 'design-use-admin-console-quota-04',
    template: 'site/base',
    design: { parts },
  });
})();
