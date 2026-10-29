// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.layout': (base, S) => function (_c) {
      const { ctx, root } = _c;
      const W = window.innerWidth;
      const H = window.innerHeight;
      root.style.setProperty('--sheet-scale', Math.min(W / 1672, H / 941));
      const roomy = W >= 1260;
      const tall = H >= 700;
      let display = ctx.display || 'header';
      if (display === 'panel' && !roomy) display = 'header';
      if (display === 'toast' && !tall) display = 'header';
      document.body.dataset.instruction = display;
      // reset() reuses the body: a previous toast must not shrink later episodes.
      document.body.classList.toggle('ref-has-note', display === 'toast');
      Object.assign(_c, { H, W, display, roomy, tall });
    },
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
      const titleText = util.el('span', 'ol-window-title', titlebar, 'Delivery Route Planning');
      const winControls = util.el('div', 'ol-window-controls', titlebar);
      for (const glyph of ['−', '□', '×']) util.el('span', 'ol-window-control', winControls, glyph);
      const summary = util.el('div', 'dispatch-summary', header);
      const dispatch = util.el('section', 'dispatch-ref', summary);
      util.el('strong', '', dispatch, 'Dispatch Ref:');
      util.el('b', '', dispatch, 'DR-4173');
      util.el('span', '', dispatch, 'Date:');
      util.el('span', '', dispatch, 'Tue, Apr 15, 2025');
      util.el('span', '', dispatch, 'Vehicle:');
      util.el('span', '', dispatch, 'Truck 1 (12,000 lb max)').dataset.routeVehicle = '';
      const routeSummary = util.el('section', 'dispatch-route-summary', summary);
      util.el('b', '', routeSummary, 'Route Summary');
      for (const [key, value, fact] of [['Total Distance:', '0 mi', 'distance'], ['Total Load:', '0 lb', 'load'],
        ['Remaining Capacity:', '12,000 lb', 'remaining'], ['Stops (excluding depot):', '6', 'stops']]) {
        util.el('span', '', routeSummary, key); util.el('span', '', routeSummary, value).dataset.routeFact = fact;
      }
      const menubar = util.el('div', 'ol-menubar', header);
      if (display !== 'header' || nav) {
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', menubar, word ? word(lr.pick(K.brand)) : title);
        brand.dataset.role = 'brand';
      }
      if (nav) {
        const n = util.el('nav', 'ref-nav', menubar);
        const navItems = rng.sample(content.NAV_ITEMS, rng.int(3, 5));
        for (const [i, item] of ['Home', 'Dispatch', 'Vehicles', 'Stops', 'Planning', 'Reports'].entries()) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.olIcon = ['▣', '⌕', '▰', '▤', '▥', '⚒'][i];
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
      else util.el('div', 'ref-spacer', menubar);
      Object.assign(_c, { dispatch, header, mark, menubar, routeSummary, summary, titleText, titlebar, winControls });
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
    'frame.floating': (base, S) => function (_c) {
      const { endBtn, header, headerTools, label, menubar, placement, util } = _c;
      let { submit } = _c;
      if (placement === 'floating') {
        // Reserve the control's space so it cannot intercept task clicks or drags.
        // On scrollable pages the dock follows the content, just like a form footer.
        const dock = util.el('div', 'ref-float-dock', document.body);
        submit = endBtn(dock, 'ref-submit ref-float', label);
      }
      // Keep all episode controls, housed in the document's bottom navigation dock.
      document.querySelectorAll('.ref-foot .ref-tools').forEach(tools => menubar.appendChild(tools));
      if (submit) submit.dataset.placement = placement;
      if (placement === 'floating') menubar.appendChild(submit);
      if (placement === 'header' || placement === 'icon') {
        headerTools.classList.add('ref-header-tools');
        header.appendChild(headerTools);
      }
      Object.assign(_c, { submit });
    },
    'frame.nav': (base, S) => function (_c) {
    },
    'frame.instruction': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-use-dispatch-route-order-02',
    template: 'site/base',
    design: { parts },
  });
})();
