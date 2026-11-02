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
      util.el('span', '', appTitle, 'ShopEasy - New Order');
      util.el('span', 'cad-window-controls', appTitle, '−　□　×');
      const menu = util.el('nav', 'cad-menubar', document.body);
      for (const item of ['File', 'Edit', 'View', 'Order', 'Tools', 'Help']) {
        util.el('span', '', menu, item);
      }
      const toolbar = util.el('div', 'cad-toolbar', document.body);
      const appNav = util.el('nav', 'gem-app-nav', toolbar);
      for (const [icon, label] of [['◆','Home'], ['▤','Catalog'], ['🛒','Orders'], ['♟','Customers']]) {
        const item = util.el('div', 'gem-app-item', appNav);
        util.el('span', 'gem-app-icon', item, icon);
        util.el('span', '', item, label);
      }
      Object.assign(_c, { appNav, appTitle, collide, cr, decoys, label, menu, nav, placement, sidebar, toolbar, wantFooter });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const props = util.el('aside', 'cad-properties', body);
      const details = util.el('section', 'order-details', props);
      util.el('div', 'cad-pane-title', details, 'Order Details');
      util.el('div', 'order-overview', details, '🛒　 Order #100428\n　　　3 items　　　　　　 $129.97');
      util.el('div', 'order-items', details, '▣　 Field Guide to Birds　　　　 $34.00\n　　 1 × $34.00\n\n☕　 Enamel Mug　　　　　　　 $12.99\n　　 1 × $12.99\n\n▧　 Daypack　　　　　　　　　 $82.98\n　　 1 × $82.98');
      util.el('div', 'order-totals', details, 'Subtotal　　　　　　　　　 $129.97\nShipping　　　　　　　　　 —\nTax　　　　　　　　　　　 —\nTotal　　　　　　　　　　 $129.97');
      const properties = util.el('section', 'order-properties', props);
      util.el('div', 'cad-pane-title', properties, 'Properties');
      util.el('div', 'cad-property-copy', properties, 'Order type:　　　 Standard Order\nStatus:　　　　　 Draft\nCreated:　　　　　Mar 14, 2025 10:24\nCustomer:　　　　—\nShipping method:　—\nPayment method:　 —');
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, details, properties, props });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const pane = util.el('section', 'gem-order-pane', body);
      util.el('div', 'cad-pane-title', pane, 'Place Order');
      const stage = util.el('main', 'ref-stage', pane);
      stage.classList.add('cad-stage');
      stage.style.justifyContent = 'flex-start';
      stage.style.alignItems = 'flex-start';
      Object.assign(_c, { stage });
    },
  };

  env.site({
    name: 'design-complete-wizard-checkout-03',
    template: 'site/base',
    design: { parts },
  });
})();
