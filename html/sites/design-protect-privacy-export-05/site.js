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

      // Windows utility frame: title bar and classic menu bar.
      const titlebar = util.el('div', 'crm-titlebar', document.body);
      const appIcon = util.el('span', 'crm-app-icon', titlebar);
      const appSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      appSvg.setAttribute('viewBox', '0 0 28 24'); appSvg.setAttribute('aria-hidden', 'true');
      appIcon.appendChild(appSvg);
      const appShape = (tag, attrs) => {
        const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
        for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
        appSvg.appendChild(el);
      };
      appShape('rect', { x:1, y:1, width:26, height:22, fill:'#d8e5f6', stroke:'#111', 'stroke-width':1 });
      for (const [x,y] of [[8,7],[18,7],[13,5]]) {
        appShape('circle', { cx:x, cy:y, r:2.5, fill:'#c0c0c0', stroke:'#111', 'stroke-width':1 });
        appShape('path', { d:`M${x-4} 18 Q${x-4} 11 ${x} 11 Q${x+4} 11 ${x+4} 18 Z`, fill:'#000080', stroke:'#111', 'stroke-width':1 });
      }
      util.el('strong', 'crm-app-name', titlebar, 'Community Records');
      const winControls = util.el('div', 'crm-window-controls', titlebar);
      for (const [label, glyph] of [['Minimize', '−'], ['Maximize', '□'], ['Close', '×']]) {
        const control = util.el('span', `crm-window-control crm-${label.toLowerCase()}`, winControls, glyph);
        control.setAttribute('aria-label', label);
      }
      const menubar = util.el('nav', 'crm-menubar', document.body);
      for (const item of ['File', 'Edit', 'View', 'Records', 'Tools', 'Help']) util.el('span', 'crm-menu-item', menubar, item);
      const toolbar = util.el('div', 'crm-toolbar', document.body);
      toolbar.hidden = true;
      Object.assign(_c, { H, W, display, menubar, roomy, tall, titlebar, toolbar, winControls });
    },
  };

  env.site({
    name: 'design-protect-privacy-export-05',
    template: 'site/base',
    design: { parts },
  });
})();
