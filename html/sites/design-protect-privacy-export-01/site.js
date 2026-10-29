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
      util.el('span', 'crm-app-icon', titlebar, '▣');
      util.el('strong', 'crm-app-name', titlebar, 'Customer Manager');
      const winControls = util.el('div', 'crm-window-controls', titlebar);
      for (const [label, glyph] of [['Minimize', '−'], ['Maximize', '□'], ['Close', '×']]) {
        const control = util.el('span', `crm-window-control crm-${label.toLowerCase()}`, winControls, glyph);
        control.setAttribute('aria-label', label);
      }
      const menubar = util.el('nav', 'crm-menubar', document.body);
      for (const item of ['File', 'Edit', 'View', 'Tools', 'Reports', 'Help']) util.el('span', 'crm-menu-item', menubar, item);
      const toolbar = util.el('div', 'crm-toolbar', document.body);
      for (const [icon, label] of [['♙', 'New Contact'], ['✎', 'Edit'], ['⊗', 'Delete'], ['✉', 'Email'], ['☎', 'Call'], ['▤', 'Import'], ['▦', 'Export'], ['▣', 'Print']]) {
        const tool = util.el('div', 'crm-tool', toolbar);
        util.el('span', 'crm-tool-icon', tool, icon);
        util.el('span', 'crm-tool-label', tool, label);
      }
      Object.assign(_c, { H, W, display, menubar, roomy, tall, titlebar, toolbar, winControls });
    },
  };

  env.site({
    name: 'design-protect-privacy-export-01',
    template: 'site/base',
    design: { parts },
  });
})();
