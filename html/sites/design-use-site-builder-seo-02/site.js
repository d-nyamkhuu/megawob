// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, tall, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebar = true;
      const nav = W >= 1180 && rng.bool(0.5);
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, placement, sidebar, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { content, local, nav, rng, util } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      const title = rng.pick(TITLES);
      const brand = util.el('div', 'ref-brand', header, 'Tinker Toys Workshop — CMS');
      brand.dataset.tagline = 'Tinker Toys Workshop — CMS';
      brand.dataset.role = 'brand';
      const menu = util.el('nav', 'human-menubar', header);
      for (const item of ['File', 'Edit', 'View', 'Insert', 'Format', 'Tools', 'Help']) {
        util.el('span', 'human-menu-item', menu, item);
      }
      const toolbar = util.el('div', 'human-toolbar', header);
      for (const [icon, text] of [['▯','New Page'],['📂','Open'],['🔍','Preview'],['🌐','Publish Changes'],['▧','Add Media']]) {
        const item = util.el('span', 'human-tool-item', toolbar);
        util.el('span', 'human-tool-icon', item, icon);
        util.el('span', '', item, text);
      }
      if (false && nav) {
        const n = util.el('nav', 'ref-nav', header);
        for (const item of local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav)) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      Object.assign(_c, { brand, header, menu, title, toolbar });
    },
    'frame.body': (base, S) => function (_c) {
      const { sidebar, util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      if (sidebar) {
        const side = util.el('aside', 'ref-side', body);
        for (const item of ['Dashboard', 'Pages', 'Blog Posts', 'Media', 'Comments', 'Campaigns', 'Social', 'Site Settings']) {
          const a = util.el('a', 'ref-sidelink', side, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label: item }); });
        }
      }
      const pages = util.el('aside', 'ref-pages', body);
      const pageHead = util.el('div', 'ref-pages-head', pages);
      util.el('strong', '', pageHead, 'Pages');
      const addPage = util.el('button', 'ref-add-page', pageHead, '▯  Add Page');
      addPage.type = 'button';
      addPage.addEventListener('click', () => env.log('decoy', { label: 'Add Page' }));
      for (const [icon, label] of [['⌂','Home'],['▤','About Us'],['▤','Our Toys'],['▤','Sustainability'],['▤','From garage to global: …'],['▤','News'],['▤','Contact']]) {
        const row = util.el('div', `ref-page-row${label.startsWith('From garage') ? ' ref-page-active' : ''}`, pages);
        util.el('span', 'ref-page-icon', row, icon);
        util.el('span', 'ref-page-name', row, label);
      }
      Object.assign(_c, { addPage, body, pageHead, pages });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-use-site-builder-seo-02',
    template: 'site/base',
    design: { parts },
  });
})();
