// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
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

      // NeXTSTEP desktop menu and application title bars.
      const deskMenu = util.el('div', 'next-menu', document.body);
      util.el('span', 'next-apple', deskMenu, '●');
      for (const item of ['File', 'Edit', 'View', 'Administration', 'Window', 'Help']) util.el('span', 'next-menu-item', deskMenu, item);
      util.el('span', 'next-clock', deskMenu, 'Mon Apr 12  10:24 AM');
      const winbar = util.el('div', 'next-titlebar', document.body);
      const appIcon = util.el('span', 'next-window-icon', winbar);
      appIcon.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 2h16v20H4z" fill="#ddd" stroke="#111" stroke-width="2"/><path d="M7 5h10v5H7zm0 8h10v6H7z" fill="#555" stroke="#111"/></svg>';
      util.el('span', 'next-window-title', winbar, 'Cloud Administration');
      const controls = util.el('span', 'next-window-controls', winbar);
      const mini = util.el('button', 'next-window-control', controls);
      mini.setAttribute('aria-label', 'Minimize');
      mini.innerHTML = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 2h12v12H2z" fill="#bbb" stroke="#111"/><path d="M4 10h8v2H4z" fill="#111"/></svg>';
      const close = util.el('button', 'next-window-control', controls);
      close.setAttribute('aria-label', 'Close');
      close.innerHTML = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 3l10 10M13 3L3 13" stroke="#111" stroke-width="2"/></svg>';
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
      util.el('div', 'next-statusbar', document.body);
      Object.assign(_c, { submit });
    },
  };

  env.site({
    name: 'design-use-admin-console-quota-01',
    template: 'site/base',
    design: { parts },
  });
})();
