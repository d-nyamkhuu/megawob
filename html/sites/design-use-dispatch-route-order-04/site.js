// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, tall, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebar = roomy && rng.bool(0.35);
      const nav = (W >= 1180 && rng.bool(0.5)) || true;
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, placement, sidebar, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { content, ctx, display, lr, nav, rng, util, word } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      const titlebar = util.el('div', 'ol-titlebar', header);
      const mark = util.el('span', 'ol-mark', titlebar, '▧');
      const titleText = util.el('span', 'ol-window-title', titlebar, '🚚 Dispatch');
      const winControls = util.el('div', 'ol-window-controls', titlebar);
      for (const glyph of ['−', '□', '×']) util.el('span', 'ol-window-control', winControls, glyph);
      const menubar = util.el('div', 'ol-menubar', header);
      if (display !== 'header' || nav) {
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', menubar, word ? word(lr.pick(K.brand)) : title);
        brand.dataset.role = 'brand';
      }
      if (nav) {
        const n = util.el('nav', 'ref-nav', menubar);
        const navItems = rng.sample(content.NAV_ITEMS, rng.int(3, 5));
        for (const [i, item] of ['Dispatch', 'Orders', 'Inventory', 'Vehicles', 'Reports', 'Settings'].entries()) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.olIcon = ['♧', '▤', '⬡', '▰', '▥', '⚙'][i];
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      if (display === 'header') util.el('div', 'ref-instruction', menubar, ctx.instruction);
      else util.el('div', 'ref-spacer', menubar);
      Object.assign(_c, { header, mark, menubar, titleText, titlebar, winControls });
    },
    'frame.tools': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, label, menubar, placement, util, wantFooter } = _c;
      let submit = null;
      const headerTools = util.el('div', 'ref-tools', menubar);
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      Object.assign(_c, { headerTools, submit });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const sideInfo = util.el('aside', 'dispatch-sideinfo', document.body);
      const stopPanel = util.el('section', 'dispatch-stop-panel', sideInfo);
      util.el('h2', '', stopPanel, 'Stop Information');
      const stopTable = util.el('table', '', stopPanel);
      const stopHead = util.el('tr', '', stopTable);
      for (const label of ['ID', 'Address', 'Load (kg)']) util.el('th', '', stopHead, label);
      for (const id of ['Depot', 'J1', 'J2', 'J3', 'J4', 'J5', 'J6']) {
        const row = util.el('tr', '', stopTable);
        util.el('th', '', row, id);
        util.el('td', '', row, id === 'Depot' ? 'Depot location' : 'Delivery stop');
        util.el('td', '', row, '—');
      }
      const tipsPanel = util.el('section', 'dispatch-tips-panel', sideInfo);
      util.el('h2', '', tipsPanel, 'Tips');
      const tips = util.el('ul', '', tipsPanel);
      for (const tip of ['Drag stops to change the visit order.', 'The route starts and finishes at Depot.',
        'Check that the total load is within the vehicle limit.', 'Use the distance table to estimate the route.']) {
        util.el('li', '', tips, tip);
      }
      Object.assign(_c, { sideInfo, stage, stopHead, stopPanel, stopTable, tips, tipsPanel });
    },
    'frame.nav': (base, S) => function (_c) {
    },
    'frame.instruction': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-use-dispatch-route-order-04',
    template: 'site/base',
    design: { parts },
  });
})();
