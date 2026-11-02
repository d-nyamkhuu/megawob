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

      // Native KDE-style application frame: title, application menu and compact toolbar.
      const titlebar = util.el('div', 'breeze-titlebar', document.body);
      util.el('span', 'breeze-appmark', titlebar, '🎮');
      util.el('span', 'breeze-title', titlebar, 'Ironwood Games');
      const winbuttons = util.el('div', 'breeze-winbuttons', titlebar);
      util.el('span', '', winbuttons, '−');
      util.el('span', '', winbuttons, '□');
      util.el('span', '', winbuttons, '×');
      const menubar = util.el('nav', 'breeze-menubar', document.body);
      for (const item of ['File', 'Edit', 'View', 'Library', 'Account', 'Tools', 'Help']) util.el('span', '', menubar, item);
      const appbar = util.el('div', 'breeze-appbar', document.body);
      const appnav = util.el('div', 'breeze-appnav', appbar);
      for (const [icon, item] of [['◆','Home'], ['🎮','Browse'], ['▤','Library'], ['◆','Deals'], ['♛','Game Pass']]) {
        const n = util.el('div', `breeze-appnav-item${item === 'Game Pass' ? ' active' : ''}`, appnav);
        util.el('span', 'breeze-icon', n, icon); util.el('span', '', n, item);
      }
      const search = util.el('div', 'breeze-search', appbar, '⌕　 Search games, add-ons, and more…');
      Object.assign(_c, { H, W, appbar, appnav, display, menubar, roomy, search, tall, titlebar, winbuttons });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const gameNav = util.el('aside', 'breeze-game-nav', body);
      for (const [icon, item] of [['♛','Game Pass'], ['🎮','All Games'], ['★','New Releases'], ['▮','Top Rated'], ['▣','Coming Soon'], ['▥','My Library'], ['⬇','Downloads'], ['⚙','Settings']]) {
        const n = util.el('div', `breeze-game-nav-item${item === 'Game Pass' ? ' active' : ''}`, gameNav);
        util.el('span', 'breeze-icon', n, icon); util.el('span', '', n, item);
      }
      S.frameSidebar(_c, gameNav);
      Object.assign(_c, { body, gameNav });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, gameNav, util } = _c;
      const panel = body.querySelector('.ref-panel');
      if (panel) gameNav.prepend(panel);
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const summary = util.el('aside', 'breeze-summary', body);
      util.el('strong', '', summary, 'Your Game Pass');
      util.el('div', 'breeze-status', summary, '♛　 Not a member yet');
      util.el('a', 'breeze-benefit', summary, 'View benefits');
      util.el('hr', '', summary);
      util.el('strong', '', summary, 'Explore games');
      for (const [title, genre] of [['Frostpeak','Action　RPG'], ['Velocity Road','Racing　Sports'], ['Tales of Arandor','Adventure　RPG']]) {
        const row = util.el('div', 'breeze-game', summary);
        util.el('span', 'breeze-thumb', row, '▧');
        const info = util.el('span', '', row); util.el('b', '', info, title); util.el('small', '', info, genre);
      }
      Object.assign(_c, { stage, summary });
    },
  };

  env.site({
    name: 'design-avoid-dark-patterns-forced-01',
    template: 'site/base',
    design: { parts },
  });
})();
