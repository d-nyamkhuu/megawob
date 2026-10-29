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

      const winbar = util.el('header', 'willow-header', document.body);
      const brand = util.el('div', 'willow-brand', winbar);
      const mark = util.el('span', 'willow-mark', brand);
      mark.innerHTML = '<svg viewBox="0 0 36 36" aria-hidden="true"><path d="M18 1 35 34H24L13 11Z" fill="#223b2d"/><path d="M2 33 13 12l7 14-4 7Z" fill="#304b3a"/><path d="m17 27 6 7H3l7-4Z" fill="#182e23"/><path d="m13 12 11 22-9-7-7-8Z" fill="#e5e4d6"/></svg>';
      util.el('strong', '', brand, 'Willow & Co.');
      util.el('span', 'willow-divider', brand);
      util.el('span', 'willow-product', brand, 'Cloud Console');
      const controls = util.el('div', 'willow-account', winbar);
      const bell = util.el('span', 'willow-bell', controls);
      bell.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></svg>';
      util.el('span', 'willow-avatar', controls, 'JD');
      util.el('span', 'willow-name', controls, 'Jordan Diaz');
      util.el('span', 'willow-chevron', controls, '⌄');
      const appIcon = brand;
      const mini = null, close = null, deskMenu = null;
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
      const instruction = header.querySelector('.ref-instruction');
      if (instruction) {
        winbar.classList.add('willow-with-instruction');
        winbar.append(instruction);
      }
      Object.assign(_c, { headerTools, submit });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const rail = util.el('aside', 'next-rail', body);
      util.el('h1', 'willow-rail-title', rail, 'Subscriptions');
      util.el('p', 'willow-rail-copy', rail, 'Manage billing, quotas and settings for your cloud subscriptions.');
      const railItems = [['▤','Overview'],['♙','Access control'],['▰','Billing'],['◉','Usage reports'],['◎','Compute'],['▧','Networking'],['▤','Storage'],['•••','Other services']];
      const glyphs = [
        '<path d="M3 21V12h4v9M10 21V7h4v14m3 0V3h4v18"/>',
        '<circle cx="9" cy="7" r="4"/><circle cx="17" cy="8" r="3"/><path d="M2 21v-4a7 7 0 0 1 14 0v4zm13-7a5 5 0 0 1 7 5v2h-5"/>',
        '<rect x="2" y="5" width="20" height="15" rx="1"/><path d="M2 10h20m-15 5h5"/>',
        '<path d="M12 3a9 9 0 1 1-9 9"/><path d="M12 3v9h9"/>',
        '<path d="m12 2 10 6-10 6L2 8l10-6Zm-10 9 10 6 10-6m-20 5 10 6 10-6"/>',
        '<path d="M3 8h5v5H3zm13 0h5v5h-5zM8 10h8m-7 3v4h6v-4m-3 4v4"/>',
        '<ellipse cx="12" cy="5" rx="9" ry="4"/><path d="M3 5v14c0 2 4 4 9 4s9-2 9-4V5M3 12c0 2 4 4 9 4s9-2 9-4"/>',
        '<circle cx="5" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="19" cy="12" r="1.3"/>'
      ];
      for (const [index, [icon, label]] of railItems.entries()) {
        const item = util.el('div', `next-rail-item${label === 'Compute' ? ' active' : ''}`, rail);
        const pict = util.el('span', 'next-rail-icon', item);
        pict.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${glyphs[index]}</svg>`;
        util.el('span', 'next-rail-label', item, label);
        if (index < 2) util.el('span', 'next-rail-meta', item, index === 0 ? '3' : '12');
        if (index >= 4) util.el('span', 'next-rail-meta next-rail-chevron', item, '›');
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
      const dock = util.el('nav', 'willow-dock', document.body);
      const dockItems = ['Home','Subscriptions','Resources','Identity','Service Desk','Reporting','Settings'];
      const dockGlyphs = [
        '<path d="M3 11 12 3l9 8v10h-6v-7H9v7H3z"/>',
        '<path d="m12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5m-18 5 9 5 9-5"/>',
        '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>',
        '<path d="M12 2 21 6v6c0 5-4 8-9 10-5-2-9-5-9-10V6z"/>',
        '<path d="M5 2h11l4 4v16H5zM15 2v5h5M8 12h9M8 16h9"/>',
        '<path d="M4 20v-7m6 7V8m6 12V4m5 16v-10"/>',
        '<path d="M12 3v2m0 14v2M3 12h2m14 0h2M5.6 5.6 7 7m10 10 1.4 1.4m0-12.8L17 7M7 17l-1.4 1.4"/><circle cx="12" cy="12" r="4"/>'
      ];
      for (const [i, label] of dockItems.entries()) {
        const item = util.el('div', `willow-dock-item${i === 1 ? ' active' : ''}`, dock);
        const icon = util.el('span', 'willow-dock-icon', item);
        icon.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${dockGlyphs[i]}</svg>`;
        util.el('span', '', item, label);
      }
      Object.assign(_c, { submit });
    },
  };

  env.site({
    name: 'design-use-admin-console-quota-05',
    template: 'site/base',
    design: { parts },
  });
})();
