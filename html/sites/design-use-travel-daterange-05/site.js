// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const frameIcon = (parent, name) => {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 24 24'); svg.setAttribute('aria-hidden', 'true'); svg.classList.add('gtk-svg');
        const paths = {
          globe: ['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z', 'M2 12h20', 'M12 2c3 3 3 17 0 20', 'M12 2c-3 3-3 17 0 20'],
          plane: ['M2 16l8-3 2-10 2-1 2 10 6 2v2l-7-1-2 5-2 1-1-6-8-1Z'],
          bed: ['M3 18V6h2v6h14a2 2 0 0 1 2 2v4h-2v-2H5v2H3Z', 'M7 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z', 'M10 8h7a2 2 0 0 1 2 2v2H10V8Z'],
          car: ['M4 11l2-5h12l2 5 2 2v5h-2v2h-2v-2H6v2H4v-2H2v-5l2-2Z', 'M7 8l-1 3h12l-1-3H7Z', 'M6 14h2', 'M16 14h2'],
          bag: ['M3 8h18v13H3z', 'M8 8V4h8v4'],
          user: ['M20 21v-2a6 6 0 0 0-6-6h-4a6 6 0 0 0-6 6v2', 'M16 5a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z'],
        }[name] || [];
        for (const d of paths) { const p = document.createElementNS('http://www.w3.org/2000/svg', 'path'); p.setAttribute('d', d); svg.append(p); }
        parent.append(svg); return svg;
      };
      const titlebar = util.el('div', 'gtk-titlebar', document.body);
      const appicon = util.el('span', 'gtk-globe', titlebar);
      frameIcon(appicon, 'globe');
      const title = util.el('strong', 'gtk-title', titlebar, 'Global');
      util.el('span', 'gtk-title-gold', title, 'Trip');
      util.el('span', 'gtk-tagline', titlebar, 'BUSINESS TRAVEL SERVICES');
      const utilities = util.el('div', 'gtk-utilities', titlebar);
      for (const [i, label] of ['Help', 'Contact Us', 'Sign Out'].entries()) {
        if (i) util.el('span', 'gtk-utility-separator', utilities, '|');
        util.el('a', '', utilities, label);
      }
      S.frameBrand(_c, header);
      Object.assign(_c, { appicon, frameIcon, header, titlebar });
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
      header.append(headerTools);
      Object.assign(_c, { headerTools, submit });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, frameIcon, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      Object.assign(_c, { stage });
    },
  };

  env.site({
    name: 'design-use-travel-daterange-05',
    template: 'site/base',
    design: { parts },
  });
})();
