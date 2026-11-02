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

      // Classic Platinum application frame: title strip, app menus and icon toolbar.
      const titlebar = util.el('div', 'mac-titlebar', document.body);
      util.el('span', 'mac-app-icon', titlebar, '✦');
      util.el('strong', '', titlebar, 'TicketMaster');
      util.el('span', 'mac-window-buttons', titlebar, '▁　□　×');
      const menubar = util.el('nav', 'mac-menubar', document.body);
      for (const item of ['File', 'Edit', 'View', 'Go', 'Bookmarks', 'Tools', 'Window', 'Help']) util.el('span', '', menubar, item);
      const toolbar = util.el('div', 'mac-toolbar', document.body);
      for (const [icon, label] of [['◀','Back'],['▶','Forward'],['⌂','Home'],['▱','Events'],['♟','My Account'],['🛒','Basket']]) {
        const b = util.el('div', 'mac-tool', toolbar);
        util.el('span', 'mac-tool-icon', b, icon);
        util.el('span', '', b, label);
      }
      Object.assign(_c, { H, W, display, menubar, roomy, tall, titlebar, toolbar });
    },
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const logo = util.el('div', 'store-logo', header);
      util.el('span', 'store-mark', logo);
      util.el('span', 'store-wordmark', logo, 'Bluefin Electronics');
      S.frameBrand(_c, header);
      Object.assign(_c, { header, logo });
    },
    'frame.nav': (base, S) => function (_c) {
      const { content, header, local, nav, rng, util } = _c;
      const { K } = S;
      if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        let navIndex = 0;
        for (const item of local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav)) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.textContent = ['Account', 'Lists', 'Cart'][navIndex++ % 3];
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
    },
  };

  env.site({
    name: 'design-avoid-dark-patterns-sneak-04',
    template: 'site/base',
    design: { parts },
  });
})();
