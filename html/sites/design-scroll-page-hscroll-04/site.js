// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.layout': (base, S) => function (_c) {
      const { ctx } = _c;
      const W = window.innerWidth;
      const H = window.innerHeight;
      const roomy = W >= 1260;
      const tall = H >= 700;
      let display = ctx.display || 'header';
      if (display === 'panel' && !roomy) display = 'header';
      if (display === 'toast' && !tall) display = 'header';
      document.body.dataset.sunInstr = display;
      // reset() reuses the body: a previous toast must not shrink later episodes.
      document.body.classList.toggle('ref-has-note', display === 'toast');
      Object.assign(_c, { H, W, display, roomy, tall });
    },
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, tall, util, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebarDraw = roomy && rng.bool(0.35);
      const sidebar = true;
      const nav = W >= 1180 && rng.bool(0.5);
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      document.body.classList.add('gnome-help');
      const windowbar = util.el('div', 'gnome-windowbar', document.body);
      util.el('span', 'gnome-appmark', windowbar, '✿');
      util.el('strong', 'gnome-windowtitle', windowbar, 'SunHelp');
      util.el('span', 'gnome-wincontrols', windowbar, '−　□　×');
      const menubar = util.el('nav', 'gnome-menubar', document.body);
      for (const item of ['File', 'Edit', 'View', 'Go', 'Bookmarks', 'Options']) util.el('span', '', menubar, item);
      util.el('span', 'sun-menu-help', menubar, 'Help');
      const tabs = util.el('nav', 'sun-tabs', document.body);
      for (const [i, item] of ['Home', 'Help Articles', 'Documentation', 'Support', 'Community'].entries()) {
        util.el('span', `sun-tab${i === 1 ? ' active' : ''}`, tabs, item);
      }
      const toolbar = util.el('div', 'gnome-toolbar', document.body);
      util.el('span', 'gnome-tool', toolbar, '◀　Back');
      util.el('span', 'gnome-tool muted', toolbar, '▶　Forward');
      util.el('span', 'gnome-tool', toolbar, '⌂　Home');
      util.el('span', 'gnome-tool', toolbar, '▤　Print');
      util.el('span', 'gnome-tool', toolbar, '⌕　Find');
      Object.assign(_c, { collide, cr, decoys, label, menubar, nav, placement, sidebar, sidebarDraw, tabs, toolbar, wantFooter, windowbar });
    },
    'frame.header': (base, S) => function (_c) {
      const { display, lr, nav, util, word } = _c;
      const { K } = S;
      const header = util.el('header', 'ref-task', document.body);
      if (display !== 'header' || nav) {
        const title = 'ubuntu';
        const brand = util.el('div', 'ref-brand', header, word ? word(lr.pick(K.brand)) : title);
        brand.dataset.role = 'brand';
      }
      Object.assign(_c, { header });
    },
    'frame.body': (base, S) => function (_c) {
      const { content, local, rng, sidebar, util } = _c;
      const { K } = S;
      const body = util.el('div', 'ref-body', document.body);
      if (sidebar) {
        const side = util.el('aside', 'ref-side', body);
        const sampledSide = local(rng.sample(content.NAV_ITEMS, rng.int(4, 7)), K.nav);
        for (const item of ['Help Center', 'Product Guides', 'Troubleshooting', 'Tips & Tutorials', 'Community', 'Contact Support']) {
          const a = util.el('a', 'ref-sidelink', side, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label: item }); });
        }
      }
      Object.assign(_c, { body });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      const inspector = util.el('aside', 'gnome-inspector', body);
      util.el('div', 'gnome-inspector-heading', inspector, '♧　Tips');
      for (const tip of ['Use the arrow buttons or drag the scrollbar to see more articles.', 'Click Save on any article to keep it in your saved collection.', 'You can also use the keyboard to scroll (Shift+Right Arrow).', 'Try the search box above to find articles by keyword.']) {
        const li = util.el('div', 'sun-tip', inspector);
        util.el('span', '', li, '•');
        util.el('span', '', li, tip);
      }
      S.frameAlign(_c, stage);
      Object.assign(_c, { inspector, stage });
    },
  };

  env.site({
    name: 'design-scroll-page-hscroll-04',
    template: 'site/base',
    design: { parts },
  });
})();
