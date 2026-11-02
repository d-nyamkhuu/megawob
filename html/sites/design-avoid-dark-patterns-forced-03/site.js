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
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, gameNav });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const summary = util.el('aside', 'breeze-summary', body);
      util.el('div', 'breeze-summary-title', summary, 'About this trial');
      const helpRow = (icon, copy, extra) => {
        const row = util.el('div', 'breeze-help-row', summary);
        util.el('span', 'breeze-help-icon', row, icon);
        const text = util.el('div', 'breeze-help-copy', row);
        util.el('span', '', text, copy);
        if (extra) util.el('span', 'breeze-help-link', text, extra);
      };
      helpRow('▦', "You won't be charged during the 14 day trial. After Apr 17, 2018 you'll be billed $14.99/month unless you cancel.");
      helpRow('▤', 'You can cancel at any time from your account settings. Your games and saves will remain until the end of the billing period.');
      helpRow('ⓘ', 'Learn more about cancellation, billing and other terms.', 'View help centre');
      util.el('hr', 'breeze-help-divider', summary);
      util.el('div', 'breeze-summary-subtitle', summary, 'Why join?');
      helpRow('★', 'New games added every month');
      helpRow('♙', 'Exclusive member deals');
      helpRow('♣', 'Play with friends on PC and online');
      Object.assign(_c, { helpRow, stage, summary });
    },
  };

  env.site({
    name: 'design-avoid-dark-patterns-forced-03',
    template: 'site/base',
    design: { parts },
  });
})();
