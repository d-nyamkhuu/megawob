// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, tall, util, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebar = roomy && rng.bool(0.35);
      const nav = W >= 1180 && rng.bool(0.5);
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      const titlebar = util.el('div', 'vista-titlebar', document.body);
      util.el('span', 'vista-app-icon', titlebar, '▣');
      util.el('span', 'vista-title', titlebar, 'Rivermount CMS');
      const win = util.el('div', 'vista-window-controls', titlebar);
      util.el('span', '', win, '−');
      util.el('span', '', win, '□');
      util.el('span', 'vista-close', win, '×');
      const menubar = util.el('nav', 'vista-menubar', document.body);
      for (const item of ['File', 'Edit', 'View', 'Content', 'Campaigns', 'Social', 'Tools', 'Help'])
        util.el('span', '', menubar, item);
      Object.assign(_c, { collide, cr, decoys, label, menubar, nav, placement, sidebar, titlebar, wantFooter, win });
    },
    'frame.header': (base, S) => function (_c) {
      const { display, lr, nav, rng, util, word } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      const actions = util.el('div', 'vista-actions', header);
      for (const [icon, label] of [['＋','New Page'],['▣','Duplicate'],['×','Delete'],['🌐','Publish Changes'],['◉','Preview']]) {
        const b = util.el('button', 'vista-action', actions, `${icon}  ${label}`);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', { what: 'toolbar', label }));
      }
      if (display !== 'header' || nav) {
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, word ? word(lr.pick(K.brand)) : 'Rivermere Public Library');
        brand.dataset.role = 'brand';
      }
      Object.assign(_c, { actions, header });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const rail = util.el('aside', 'vista-rail', body);
      for (const [icon, item] of [['⌂','Dashboard'],['▤','Pages'],['✉','Campaigns'],['●','Social'],['▧','Media Library'],['▥','Templates'],['⚙','Settings']]) {
        const a = util.el('a', `vista-rail-item${item === 'Pages' ? ' selected' : ''}`, rail);
        util.el('span', 'vista-rail-icon', a, icon); util.el('span', '', a, item);
        a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
      }
      const pages = util.el('section', 'vista-pages', body);
      util.el('h2', '', pages, 'Pages');
      const search = util.el('div', 'vista-search', pages);
      util.el('span', '', search, 'Search pages...');
      util.el('b', '', search, '⌕');
      const index = util.el('div', 'vista-page-index', pages);
      const indexHead = util.el('div', 'vista-index-head', index);
      util.el('span', '', indexHead, 'Title');
      util.el('span', '', indexHead, 'Last Modified');
      for (const [icon, title, date] of [['⌂','Home Page','Apr 24, 2007'],['▤','About Us','Apr 18, 2007'],['▤','Menus','Apr 20, 2007'],['▤','Events','Apr 22, 2007'],['▤','Private Dining','Apr 17, 2007'],['▤','Contact','Apr 16, 2007']]) {
        const row = util.el('div', `vista-page-row${title === 'Home Page' ? ' selected' : ''}`, index);
        util.el('span', 'vista-page-icon', row, icon); util.el('span', 'vista-page-name', row, title); util.el('span', 'vista-page-date', row, date);
      }
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, index, indexHead, pages, rail, search });
    },
  };

  env.site({
    name: 'design-use-site-builder-blockedit-02',
    template: 'site/base',
    design: { parts },
  });
})();
