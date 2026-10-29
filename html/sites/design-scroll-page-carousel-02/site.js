// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.lang': (base, S) => function (_c) {
      const { ctx, rng, util } = _c;
      // Localized frame: same layout draws as English, texts from UI_WORDS (own stream).
      const word = ctx.lang && ctx.lang !== 'en' && ctx.word ? ctx.word : null;
      const lr = rng.fork('chrome/lang');
      const local = (list, keys) => (word ? lr.sample(keys, list.length).map(word) : list);
      const closeLabel = word ? word('close') : 'Close';

      // 2005 desktop application frame.
      const winbar = util.el('div', 'gb-windowbar', document.body);
      util.el('span', 'gb-window-icon', winbar, '🍃');
      util.el('strong', '', winbar, 'GoodBite');
      const wincontrols = util.el('div', 'gb-window-controls', winbar);
      for (const mark of ['—', '□', '×']) util.el('span', '', wincontrols, mark);
      const menubar = util.el('nav', 'gb-menubar', document.body);
      for (const item of ['File', 'Edit', 'View', 'Favorites', 'Tools', 'Help']) util.el('span', '', menubar, item);
      const toolbar = util.el('nav', 'gb-toolbar', document.body);
      for (const [icon, item] of [['⌂','Home'],['▣','Recipes'],['▤','Meal Planner'],['🛒','Shopping List'],['♟','Community']]) {
        const tool = util.el('span', 'gb-tool', toolbar);
        util.el('b', '', tool, icon); util.el('span', '', tool, item);
      }
      Object.assign(_c, { closeLabel, local, lr, menubar, toolbar, winbar, wincontrols, word });
    },
    'frame.header': (base, S) => function (_c) {
      const { content, local, nav, rng, util } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      if (true) {
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, 'GoodBite');
        brand.dataset.role = 'brand';
      }
      {
        const n = util.el('nav', 'ref-nav', header);
        const libraryNav = ['Home', 'Recipes', 'Articles', 'Meal Plans', 'Community'];
        const sampledNav = nav ? local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav) : libraryNav;
        for (let i = 0; i < sampledNav.length; i++) {
          const item = libraryNav[i];
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      Object.assign(_c, { header });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const browse = util.el('aside', 'gb-browse', body);
      util.el('strong', '', browse, 'Browse Articles');
      for (const item of ['All Articles','Healthy Eating','Cooking Tips','Meal Planning','Kitchen Basics','Ingredients','Seasonal','Family & Kids','On a Budget','Special Diets','Holidays','Lifestyle']) {
        const a = util.el('a', '', browse, item); a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'browse', label: item }); });
      }
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, browse });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const details = util.el('aside', 'gb-details', body);
      util.el('strong', '', details, 'Details');
      util.el('div', 'gb-detail-card', details, '▤   Article');
      for (const [k,v] of [['Author','GoodBite Team'],['Updated','Apr 12, 2005'],['Category','Meal Planning'],['Length','5 min read']]) {
        const row = util.el('div', 'gb-detail-row', details); util.el('span','',row,k+':'); util.el('b','',row,v);
      }
      util.el('div','gb-related-title',details,'Related Topics:');
      for (const item of ['Weekly Meal Plans','Healthy Eating','On a Budget','Kitchen Basics']) util.el('a','gb-related',details,item);
      util.el('div','gb-related-title',details,'Tags:');
      util.el('div','gb-tags',details,'meal planning　 healthy eating　 time saving　 family meals');
      Object.assign(_c, { details, stage });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-scroll-page-carousel-02',
    template: 'site/base',
    design: { parts },
  });
})();
