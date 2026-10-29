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
      // The note occupies its own row, so the shared fixed-note reserve is unnecessary.
      document.body.classList.remove('ref-has-note');
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

      // OWLPOST checkout frame. Keep this frame separate from the task widget.
      const appTitle = util.el('div', 'cad-titlebar', document.body);
      util.el('span', 'cad-app-mark', appTitle, '♧');
      util.el('strong', 'owl-brand', appTitle, 'OWLPOST');
      util.el('span', 'cad-window-controls', appTitle, '⌕　♧　♙');
      const menu = util.el('nav', 'cad-menubar', document.body);
      for (const item of ['File', 'Edit', 'View', 'Go', 'Tools', 'Help']) {
        util.el('span', '', menu, item);
      }
      const toolbar = util.el('div', 'cad-toolbar', document.body);
      const shopNav = util.el('div', 'cad-tool-icons', toolbar);
      for (const [icon, text, active] of [['⌂','Shop',false],['🛒','Cart',true],['⬡','Orders',false],['♡','Favourites',false]]) {
        const item = util.el('span', `cad-tool-item${active ? ' active' : ''}`, shopNav);
        util.el('b', '', item, icon);
        util.el('span', '', item, text);
      }
      util.el('span', 'cad-tool-select', toolbar, '⌕　♧　♙');
      Object.assign(_c, { appTitle, collide, cr, decoys, label, menu, nav, placement, shopNav, sidebar, toolbar, wantFooter });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const hero = util.el('section', 'owl-hero', body);
      const heroTitle = util.el('div', 'owl-hero-title', hero);
      util.el('strong', '', heroTitle, 'CHECKOUT');
      util.el('span', '', heroTitle, 'S E C U R E　 •　 S I M P L E　 •　 R E A D Y　 T O　 S H I P');
      const parcels = util.el('div', 'owl-parcels', hero);
      for (const [cls, brand, copy] of [['parcel parcel-front','', ''],['parcel parcel-blue','♧',''],['parcel parcel-back','OWLPOST','Good Things\nTravel Further']]) {
        const box = util.el('div', cls, parcels);
        if (brand) util.el('b','',box,brand);
        if (copy) util.el('span','',box,copy);
      }
      const perks = util.el('div', 'owl-perks', hero);
      for (const [icon, text] of [['♧','Worldwide\nshipping'],['♢','Sustainable\npackaging'],['◇','Secure\ncheckout']]) {
        const p = util.el('div', 'owl-perk', perks); util.el('b', '', p, icon); util.el('span', '', p, text);
      }
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, hero, heroTitle, parcels, perks });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const taskArea = util.el('div', 'owl-task-area', body);
      for (const child of [...body.children]) {
        if (child.classList.contains('ref-panel') || child.classList.contains('ref-side')) taskArea.append(child);
      }
      const stage = util.el('main', 'ref-stage', taskArea);
      stage.classList.add('cad-stage');
      const side = util.el('aside', 'owl-checkout-side', taskArea);
      util.el('div','owl-cart-title',side,'YOUR CART (3)');
      const cart = util.el('div','owl-cart-content',side);
      for (const [icon,name,meta,price,art] of [['','Riverside Backpack','Olive Green · Qty: 1','€ 89,00','art-backpack'],['','Trail Water Bottle','Stainless Steel · Qty: 1','€ 24,00','art-bottle'],['','Plain Notebook','A5, Navy · Qty: 1','€ 12,00','art-notebook']]) {
        const row = util.el('div','owl-cart-row',cart);
        util.el('span',`owl-product-art ${art}`,row,icon);
        const copy = util.el('div','owl-product-copy',row);
        util.el('strong','',copy,name); util.el('span','',copy,meta);
        util.el('b','owl-product-price',row,price);
      }
      util.el('div','owl-subtotal',cart,'Subtotal');
      util.el('strong','owl-total',cart,'€ 125,00');
      util.el('div','owl-help-title',side,'ⓘ　Need help?');
      util.el('div','owl-help-content',side,'Delivery information　›\nReturns & refunds　›\nPayment methods　›\nContact support　›');
      Object.assign(_c, { cart, side, stage, taskArea });
    },
  };

  env.site({
    name: 'design-complete-wizard-checkout-02',
    template: 'site/base',
    design: { parts },
  });
})();
