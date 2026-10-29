// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { rng, util } = _c;
      const { TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      const title = rng.pick(TITLES);
      const brand = util.el('div', 'ref-brand', header, 'The Coastal Chronicle');
      brand.dataset.tagline = 'NEWS　 |　 COMMUNITY　 |　 A BRIGHTER COAST';
      brand.dataset.role = 'brand';
      Object.assign(_c, { brand, header, title });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const pageTree = util.el('aside', 'chronicle-pages', body);
      const treeHead = util.el('div', 'chronicle-pane-head', pageTree);
      util.el('strong', '', treeHead, 'Pages');
      util.el('span', 'chronicle-search', treeHead, '⌕');
      const tree = util.el('div', 'chronicle-tree', pageTree);
      const folder = (label, depth, open = false) => {
        const row = util.el('div', `chronicle-tree-row depth-${depth}`, tree);
        util.el('span', 'tree-caret', row, open ? '▾' : '▸');
        util.el('span', 'tree-folder', row, '■');
        util.el('span', '', row, label);
      };
      const page = (label, depth, selected = false) => {
        const row = util.el('div', `chronicle-tree-row depth-${depth}${selected ? ' selected' : ''}`, tree);
        util.el('span', 'tree-caret', row, '');
        util.el('span', 'tree-file', row, '▯');
        util.el('span', 'tree-label', row, label);
      };
      folder('Website', 0, true);
      page('Home', 1);
      folder('News', 1, true);
      page('Coastal path closed after landslide', 2, true);
      page('Harbour festival returns this summer', 2);
      page('New marine reserve plan', 2);
      page('Local schools win awards', 2);
      for (const label of ['Sport', 'Opinion', 'Life & Style', 'Travel', 'About Us']) folder(label, 1);
      const details = util.el('aside', 'chronicle-details', body);
      const detailHead = util.el('div', 'chronicle-pane-head', details);
      util.el('strong', '', detailHead, 'Page Details');
      util.el('span', 'chronicle-close', detailHead, '×');
      const articleImg = util.el('div', 'chronicle-article-image', details);
      articleImg.setAttribute('aria-hidden', 'true');
      util.el('h2', 'chronicle-article-title', details, 'Coastal path closed after landslide');
      const info = util.el('div', 'chronicle-info', details);
      for (const [key, value] of [['Type','Article'], ['Status','●  Draft'], ['Last modified','Apr 12, 2011 10:24'], ['Author','J. Carter'], ['Section','News'], ['Tags','coast, landslide, safety']]) {
        const row = util.el('div', 'chronicle-info-row', info);
        util.el('span', '', row, key);
        util.el('span', '', row, value);
      }
      S.frameSidebar(_c, body);
      Object.assign(_c, { articleImg, body, detailHead, details, folder, info, page, pageTree, tree, treeHead });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const dock = util.el('nav', 'news-dock', document.body);
      const dockItems = [['▤', 'Pages'], ['▧', 'Media'], ['✉', 'Campaigns'], ['♟', 'Social'], ['▣', 'Calendar'], ['▥', 'Analytics'], ['⚙', 'Settings']];
      for (const [icon, text] of dockItems) {
        const item = util.el('a', 'news-dock-item', dock);
        item.href = '#';
        item.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'dock', label: text }); });
        util.el('span', 'news-dock-icon', item, icon);
        util.el('span', '', item, text);
      }
      Object.assign(_c, { dock, dockItems, stage });
    },
  };

  env.site({
    name: 'design-use-site-builder-seo-03',
    template: 'site/base',
    design: { parts },
  });
})();
