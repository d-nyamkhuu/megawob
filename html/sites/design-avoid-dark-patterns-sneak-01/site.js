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
    'frame.body': (base, S) => function (_c) {
      const { content, local, rng, sidebar, util } = _c;
      const { K } = S;
      const body = util.el('div', 'ref-body', document.body);
      if (sidebar) {
        const side = util.el('aside', 'ref-side', body);
        const sampledSide = local(rng.sample(content.NAV_ITEMS, rng.int(4, 7)), K.nav);
        util.el('div', 'mac-side-title', side, 'Events');
        util.el('div', 'mac-side-group', side, '▾　Live Podcasts');
        for (const item of ['The Cobalt Hour', 'The Daily Ripple', 'Science Tonight Live', 'History Re:Live', 'Comedy Lab', 'Writers on Air', 'Tech & Tomorrow', 'The Food We Share', '▸　Music', '▸　Theatre', '▸　Comedy', '▸　Family', '▸　Sport', '▸　Special Events']) {
          const a = util.el('a', `ref-sidelink${item === 'The Cobalt Hour' ? ' mac-selected' : ''}`, side, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label: item }); });
        }
        const recent = util.el('div', 'mac-recent', side);
        util.el('div', 'mac-side-title', recent, 'Recently Viewed');
        for (const item of ['The Cobalt Hour', 'History Re:Live', 'Science Tonight Live', 'Comedy Lab']) {
          const a = util.el('a', `ref-sidelink${item === 'The Cobalt Hour' ? ' mac-selected' : ''}`, recent, `♙　${item}`);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label: item }); });
        }
        void sampledSide;
      }
      Object.assign(_c, { body });
    },
  };

  env.site({
    name: 'design-avoid-dark-patterns-sneak-01',
    template: 'site/base',
    design: { parts },
  });
})();
