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

      // 2011 desktop CRM frame: title bar, application menu and compact icon toolbar.
      const titlebar = util.el('div', 'crm-titlebar', document.body);
      util.el('span', 'crm-app-icon', titlebar, '▥');
      util.el('strong', 'crm-app-name', titlebar, 'Customer Manager');
      const winControls = util.el('div', 'crm-window-controls', titlebar);
      for (const [label, glyph] of [['Minimize', '−'], ['Maximize', '□'], ['Close', '×']]) {
        const control = util.el('span', `crm-window-control crm-${label.toLowerCase()}`, winControls, glyph);
        control.setAttribute('aria-label', label);
      }
      const menubar = util.el('nav', 'crm-menubar', document.body);
      for (const item of ['File', 'Edit', 'View', 'Go', 'Tools', 'Help']) util.el('span', 'crm-menu-item', menubar, item);
      const toolbar = util.el('div', 'crm-toolbar', document.body);
      for (const label of ['Customers', 'Orders', 'Products', 'Reports']) {
        const tool = util.el('div', 'crm-tool crm-tab', toolbar);
        util.el('span', 'crm-tool-label', tool, label);
      }
      Object.assign(_c, { H, W, display, menubar, roomy, tall, titlebar, toolbar, winControls });
    },
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, tall, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebarPick = roomy && rng.bool(0.35);
      const sidebar = false;
      const nav = W >= 1180 && rng.bool(0.5);
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, placement, sidebar, sidebarPick, wantFooter });
    },
    'frame.tools': (base) => function (_c) {
      base(_c);
      _c.toolbar.append(_c.headerTools);
    },
  };

  env.site({
    name: 'design-protect-privacy-export-03',
    template: 'site/base',
    design: { parts },
  });
})();
