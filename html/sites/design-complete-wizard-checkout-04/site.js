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
      // reset() reuses the body: a previous toast must not shrink later episodes.
      document.body.classList.toggle('ref-has-note', display === 'toast');
      document.body.classList.toggle('cad-header-note', display === 'header');
      Object.assign(_c, { H, W, display, roomy, tall });
    },
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

      // DraftSight-style application frame. Keep this frame separate from the task
      // widget so the wizard continues to own all scored interactions.
      const appTitle = util.el('div', 'cad-titlebar', document.body);
      util.el('span', 'cad-app-mark', appTitle, '◧');
      util.el('span', '', appTitle, 'The Maple Leaf Gift Shop');
      util.el('span', 'cad-window-controls', appTitle, '−　□　×');
      const menu = util.el('nav', 'cad-menubar', document.body);
      for (const item of ['Cards', 'Books', 'Gifts', 'Around the World']) {
        util.el('span', '', menu, item);
      }
      const toolbar = util.el('div', 'cad-toolbar', document.body);
      util.el('span', 'cad-tool-icons', toolbar, '🍁　✦　🌎');
      util.el('span', 'cad-tool-select', toolbar, 'Quality Gifts Since 1996　 ·　 Friendly People Global Choices');
      Object.assign(_c, { appTitle, collide, cr, decoys, label, menu, nav, placement, sidebar, toolbar, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const crest = util.el('div', 'shop-crest', header);
      util.el('span', 'shop-house', crest);
      util.el('span', 'shop-motto shop-motto-left', crest, 'Quality Gifts Since 1996');
      util.el('span', 'shop-leaf shop-leaf-left', crest);
      util.el('span', 'shop-globe', crest);
      util.el('span', 'shop-motto shop-motto-right', crest, 'Friendly People Global Choices');
      util.el('span', 'shop-leaf shop-leaf-right', crest);
      S.frameBrand(_c, header);
      Object.assign(_c, { crest, header });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const project = util.el('aside', 'cad-project shop-sidebar', body);
      const basket = util.el('section', 'shop-box basket', project);
      const basketTitle = util.el('h2', 'shop-box-title', basket);
      util.el('span', '', basketTitle, 'Your Basket　(3 items)');
      util.el('a', 'basket-view', basketTitle, 'View basket');
      const columns = util.el('div', 'shop-cols', basket);
      util.el('span', '', columns, 'Item');
      util.el('span', '', columns, 'Price');
      for (const [i,row] of [['🖼️','Paris Postcard Set','£2.50'],['📘','World Atlas (Pocket Edition)','£6.99'],['☕','Maple Leaf Mug','£4.50']].entries()) {
        const line = util.el('div', `shop-row shop-item item-${i}`, basket);
        util.el('span', 'shop-pic', line, row[0]); util.el('span', 'shop-link', line, row[1]); util.el('span', 'shop-price', line, row[2]);
      }
      util.el('div', 'shop-total', basket, 'Total　　　　　　　　　£13.99');
      const popular = util.el('section', 'shop-box popular', project);
      util.el('h2', 'shop-box-title', popular, 'Popular Gifts');
      for (const [i,row] of [['♜','Eiffel Tower Keyring','£3.50'],['▧','Vintage Travel Stickers (Set)','£4.00'],['▣','Leather Notebook','£7.99'],['🌎','Globe Paperweight','£6.50'],['▤','Postcard Album','£8.00']].entries()) {
        const line = util.el('div', `shop-row shop-item item-${i+3}`, popular);
        util.el('span', 'shop-pic', line, row[0]); util.el('span', 'shop-link', line, row[1]); util.el('span', 'shop-price', line, row[2]);
      }
      const props = util.el('aside', 'cad-properties', body);
      util.el('div', 'cad-pane-title', props, '');
      util.el('div', 'cad-property-copy', props, '');
      S.frameSidebar(_c, project);
      Object.assign(_c, { basket, basketTitle, body, columns, popular, project, props });
    },
    'frame.panel': (base, S) => function (_c) {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) _c.project.prepend(panel);
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      stage.classList.add('cad-stage');
      const canvas = util.el('div', 'cad-blueprint', stage);
      canvas.setAttribute('aria-hidden', 'true');
      const storeTitle = util.el('div', 'cad-store-title', stage);
      util.el('span', 'cad-store-icon', storeTitle, '▣');
      util.el('span', '', storeTitle, 'Online Store');
      util.el('span', 'cad-store-close', storeTitle, '×');
      const storeTabs = util.el('nav', 'cad-store-tabs', stage);
      for (const [i, item] of ['Home', 'Drawings', 'Materials', 'Components', 'Online Store', 'Support'].entries()) {
        const tab = util.el('span', i === 4 ? 'cad-store-tab active' : 'cad-store-tab', storeTabs, item);
      }
      S.frameAlign(_c, stage);
      Object.assign(_c, { canvas, stage, storeTabs, storeTitle });
    },
  };

  env.site({
    name: 'design-complete-wizard-checkout-04',
    template: 'site/base',
    design: { parts },
  });
})();
