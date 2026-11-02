// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { content, ctx, display, label, local, lr, nav, rng, util, word } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      const titlebar = util.el('div', 'cad-titlebar', header);
      util.el('span', 'cad-app-icon', titlebar, '▤');
      util.el('span', 'cad-app-name', titlebar, 'World News Online');
      util.el('span', 'cad-version', titlebar, '');
      util.el('span', 'cad-window-controls', titlebar, '−　□　×');
      const menubar = util.el('nav', 'cad-menubar', header);
      for (const item of ['File', 'Edit', 'View', 'Go', 'Bookmarks', 'Window', 'Help']) {
        const m = util.el('span', 'cad-menu-item', menubar, item);
        m.dataset.role = 'menu';
      }
      const toolbar = util.el('div', 'cad-toolbar', header);
      const tabs = util.el('nav', 'cad-tabs', toolbar);
      for (const [icon, label] of [['⌂', 'Home'], ['▤', 'News'], ['◉', 'World'], ['', 'Business'], ['', 'Environment'], ['', 'Technology'], ['', 'Health'], ['', 'Culture'], ['', 'More ▼']]) {
        const tab = util.el('div', 'cad-tab', tabs);
        util.el('span', 'cad-tab-icon', tab, icon);
        util.el('span', '', tab, label);
      }
      const search = util.el('div', 'cad-search', toolbar);
      util.el('span', '', search, '');
      util.el('span', 'cad-search-text', search, '');
      util.el('div', 'cad-cart', toolbar, '');
      util.el('div', 'cad-settings', toolbar, 'Search');
      if (display !== 'header' || nav) {
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', toolbar, word ? word(lr.pick(K.brand)) : title);
        brand.dataset.role = 'brand';
      }
      if (nav) {
        const n = util.el('nav', 'ref-nav', toolbar);
        for (const item of local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav)) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      if (display === 'header') util.el('div', 'ref-instruction', toolbar, ctx.instruction);
      else util.el('div', 'ref-spacer', toolbar);
      Object.assign(_c, { header, menubar, search, tabs, titlebar, toolbar });
    },
    'frame.tools': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, label, placement, toolbar, util, wantFooter } = _c;
      let submit = null;
      const headerTools = util.el('div', 'ref-tools', toolbar);
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      Object.assign(_c, { headerTools, submit });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const catalog = util.el('aside', 'cad-catalog', body);
      util.el('div', 'cad-catalog-head', catalog, 'Top Stories');
      for (const item of ['Riverside town flood defences extended', '5,000 new trees to be planted by 2030',
        'City launches clean energy fund', 'New rail link to cut travel times', 'Scientists warn on ocean warming',
        'Local schools expand outdoor learning']) {
        util.el('div', 'cad-category', catalog, item);
      }
      const records = util.el('aside', 'cad-records', body);
      util.el('div', 'cad-records-head', records, 'Image　 Product Name');
      for (const item of ['Grooming Brush, Deshedding', 'Slicker Brush', 'Nail Clippers', 'Shampoo, Oatmeal',
        'Conditioning Spray', 'Ear Cleaning Kit', 'Toothbrush Set', 'Grooming Wipes', 'Flea Comb', 'De-shedding Glove']) {
        util.el('div', `cad-record${item.startsWith('Grooming Brush') ? ' is-selected' : ''}`, records, item);
      }
      const side = util.el('aside', 'ref-side', body);
      util.el('div', 'help-title', side, 'Help & Tips');
      for (const [heading, copy] of [['Find and read articles', 'Click a headline in the left column or related articles on the right to open the full story in this window.'],
        ['Close this offer', 'To continue without signing up, click the “X” in the top right corner of this message.'],
        ['Skip the newsletter', 'You can also click the link “No thanks, I don’t want to miss out” if you don’t want to receive emails.']]) {
        const tip = util.el('section', 'help-tip', side);
        util.el('strong', '', tip, heading);
        util.el('span', '', tip, copy);
      }
      const article = util.el('article', 'news-article', body);
      util.el('h1', '', article, 'Environment');
      util.el('div', 'news-photo', article);
      util.el('p', '', article, 'The government has announced a major tree-planting initiative across the country as part of its new environmental programme.');
      util.el('p', '', article, 'The initiative will bring together local communities and conservation groups.');
      util.el('p', '', article, 'Officials say the project will help improve air quality, support wildlife habitats and create green spaces in urban areas. Planting is due to begin later this year, with community groups expected to take part.');
      Object.assign(_c, { article, body, catalog, records, side });
    },
    'frame.nav': (base, S) => function (_c) {
    },
    'frame.instruction': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-avoid-dark-patterns-confirmshame-03',
    template: 'site/base',
    design: { parts },
  });
})();
