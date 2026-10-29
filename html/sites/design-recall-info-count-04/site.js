// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.layout': (base, S) => function (_c) {
      const { ctx } = _c;
      const W = window.innerWidth;
      const H = window.innerHeight;
      const roomy = W >= 1260;
      const tall = H >= 700;
      let display = ctx.display || 'header';
      if (display === 'panel' && !roomy) display = 'header';
      if (display === 'toast' && !tall) display = 'header';
      document.body.dataset.display = display;
      // reset() reuses the body: a previous toast must not shrink later episodes.
      document.body.classList.toggle('ref-has-note', display === 'toast');
      Object.assign(_c, { H, W, display, roomy, tall });
    },
    'frame.placement': (base, S) => function (_c) {
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
      const titlebar = util.el('div', 'fluent-titlebar', document.body);
      const appIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      appIcon.setAttribute('viewBox', '0 0 24 24');
      appIcon.innerHTML = '<rect x="2" y="2" width="20" height="20" rx="3" fill="#1674df"/><path d="M7 7h10v10H7zM9 9v6m2-6v6m2-6v6m2-6v6" fill="none" stroke="#fff" stroke-width="1"/>';
      titlebar.appendChild(appIcon);
      util.el('span', 'fluent-title', titlebar, 'Order Manager');
      util.el('span', 'fluent-title-spacer', titlebar);
      for (const [label, shape] of [['Minimize', '<path d="M5 12h14"/>'], ['Maximize', '<rect x="6" y="6" width="12" height="12"/>'], ['Close', '<path d="m6 6 12 12M18 6 6 18"/>']]) {
        const control = util.el('button', `fluent-window-control${label === 'Close' ? ' fluent-close' : ''}`, titlebar);
        control.type = 'button';
        control.setAttribute('aria-label', label);
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('aria-hidden', 'true');
        svg.innerHTML = shape;
        control.appendChild(svg);
      }
      Object.assign(_c, { appIcon, collide, cr, decoys, label, nav, placement, sidebar, titlebar, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const menu = util.el('nav', 'fluent-menu', header);
      for (const item of ['File', 'Edit', 'View', 'Orders', 'Reports', 'Tools', 'Help']) {
        util.el('span', 'fluent-menu-item', menu, item);
      }
      const appbar = util.el('div', 'fluent-appbar', header);
      const appCommand = (icon, label, divider) => {
        const button = util.el('button', `fluent-command${divider ? ' fluent-divider' : ''}`, appbar);
        button.type = 'button';
        button.setAttribute('aria-label', label);
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('aria-hidden', 'true');
        svg.innerHTML = icon;
        button.appendChild(svg);
        util.el('span', '', button, label);
      };
      appCommand('<path d="M5 3h10l4 4v14H5z"/><path d="M8 3v6h8V3M8 21v-8h8v8"/>', 'New Order', true);
      appCommand('<path d="M3 7h7l2 2h9v11H3z"/><path d="M3 7V5h7l2 2"/>', 'Open', true);
      appCommand('<path d="M5 7h14M9 7V4h6v3M7 7l1 14h8l1-14M10 10v8m4-8v8"/>', 'Delete', true);
      appCommand('<path d="M20 11a8 8 0 1 1-2.3-5.7L20 8"/><path d="M20 3v5h-5"/>', 'Refresh', true);
      appCommand('<path d="M12 3v12m-5-5 5 5 5-5M5 17v4h14v-4"/>', 'Export');
      const exportButton = appbar.lastElementChild;
      util.el('span', 'fluent-chevron', exportButton, '⌄');
      appCommand('<path d="M6 8V3h12v5M6 18H4V9h16v9h-2M7 14h10v7H7z"/><path d="M17 11h1"/>', 'Print');
      S.frameBrand(_c, header);
      Object.assign(_c, { appCommand, appbar, exportButton, header, menu });
    },
  };

  env.site({
    name: 'design-recall-info-count-04',
    template: 'site/base',
    design: { parts },
  });
})();
