// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.theme': (base, S) => function (_c) {
      const { ctx } = _c;
      const { ACCENTS, LOW_ACCENTS, THEMES } = S;
      const { rng, util, content } = ctx;
      let name = rng.pick(Object.keys(THEMES));
      const root = document.documentElement;
      let accent = rng.pick(ACCENTS);
      const tr = rng.fork('chrome/theme');
      if (tr.bool(0.08)) {
        name = 'low';
        accent = tr.pick(LOW_ACCENTS);
      }
      for (const [k, v] of Object.entries({ bg: '#e8f3ed', panel: '#fafcfb', fg: '#293044', muted: '#536b66', line: '#b5cdd1' })) root.style.setProperty(`--${k}`, v);
      root.style.setProperty('--accent', '#124f40');
      root.dataset.theme = 'rivermere';
      Object.assign(_c, { accent, content, name, rng, root, tr, util });
    },
    'frame.placement': (base, S) => function (_c) {
      base(_c);
      _c.navDraw = _c.nav;
      _c.nav = true;
    },
    'frame.header': (base, S) => function (_c) {
      const { content, display, local, nav, rng, util } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      let brand = null;
      if (display !== 'header' || nav) {
        const title = rng.pick(TITLES);
        brand = util.el('div', 'ref-brand', header, 'City Map');
        brand.dataset.role = 'brand';
      }
      if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        const sampledNav = local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
        for (const item of ['Home', 'Map', 'Places', 'Planning', 'Reports', 'Administration']) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          if (item === 'Map') a.classList.add('is-active');
          if (item === 'Administration') a.classList.add('is-emphasis');
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      Object.assign(_c, { brand, header });
    },
    'frame.tools': (base, S) => function (_c) {
      base(_c);
      const { util } = _c;
      const masthead = util.el('section', 'map-masthead', document.body);
      // Keep the app identity in the desktop headerbar.
      const meta = util.el('div', 'map-meta', masthead);
      util.el('div', 'map-meta-row', meta, 'View　　 City Map');
      util.el('div', 'map-meta-row', meta, 'Area　　 Rivermere');
      util.el('div', 'map-meta-row', meta, 'Showing　 Places, districts and major roads');
      util.el('div', 'map-meta-row', meta, 'Updated　 Apr 12, 2000　10:24 AM');
      const skyline = util.el('div', 'map-skyline', masthead);
      skyline.setAttribute('aria-hidden', 'true');
      Object.assign(_c, { masthead, meta, skyline });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const categories = util.el('aside', 'map-categories', document.body);
      categories.setAttribute('aria-label', 'Place categories');
      const search = util.el('div', 'map-search', categories);
      util.el('span', 'map-search-icon', search, '⌕');
      util.el('span', 'map-search-copy', search, 'Search places, addresses or areas');
      const categoryRows = [
        ['●','All Places','20','#1675f5'], ['◆','Education','4','#515a6d'],
        ['♣','Parks & Outdoors','5','#11894b'], ['▣','Arts & Culture','4','#c65a08'],
        ['⚑','Food & Drink','4','#d56a13'], ['✚','Health & Services','3','#e4373b'],
      ];
      for (const [icon,label,count,color] of categoryRows) {
        const row = util.el('div','map-category',categories);
        const glyph = util.el('span','map-category-icon',row,icon); glyph.style.color=color;
        util.el('span','map-category-label',row,label);
        util.el('span','map-category-count',row,count);
      }
      const legend = util.el('div','map-legend',document.body);
      const legends = [['☞','Drag to pan the map','gesture'],['↕','Use + / − to zoom','gesture'],['♣','Park','park'],['▥','Museum','museum'],['⚑','Café','cafe'],['✚','Medical Centre','health'],['▣','Train Station','station'],['◉','Theatre','theatre']];
      for (const [icon,label,kind] of legends) {
        const item = util.el('div',`map-legend-item ${kind}`,legend);
        util.el('span','map-legend-icon',item,icon);
        util.el('span','map-legend-label',item,label);
      }
      Object.assign(_c, { categories, categoryRows, legend, legends, search, stage });
    },
    'frame.floating': (base, S) => function (_c) {
      base(_c);
      const { placement, submit, util } = _c;
      const appDock = util.el('nav', 'map-bottom-nav', document.body);
      const dockItems = [['◫', 'Map'], ['☷', 'Places'], ['⌘', 'Routes'], ['●', 'Markers'], ['⚙', 'Settings']];
      for (const [icon, text] of dockItems) {
        const item = util.el('div', `map-bottom-item${text === 'Map' ? ' active' : ''}`, appDock);
        util.el('span', 'map-bottom-icon', item, icon);
        util.el('span', '', item, text);
        if (text === 'Map' && placement === 'floating') {
          // Give the template's dock its own corner in the bottom navigation.
          item.replaceChildren(submit.parentElement);
        }
      }
      Object.assign(_c, { appDock, dockItems, submit });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-pan-map-marker-04',
    template: 'site/base',
    design: { parts },
  });
})();
