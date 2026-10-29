// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, tall, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['footer', 'footer', 'header', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebarDraw = roomy && rng.bool(0.35);
      const navDraw = W >= 1180 && rng.bool(0.5);
      const sidebar = true;
      const nav = false;
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, navDraw, placement, sidebar, sidebarDraw, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { rng, util } = _c;
      const { TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      if (true) {
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, 'GLOBAL WINGS');
        util.el('span', 'ref-tagline', brand, 'Fly Further Together');
        brand.dataset.role = 'brand';
      }
      const accountLinks = util.el('div', 'gw-account-links', header);
      for (const label of ['My Account', 'Help', 'Contact Us']) util.el('span', '', accountLinks, label);
      Object.assign(_c, { accountLinks, header });
    },
    'frame.panel': (base, S) => function (_c) {
      const { body, ctx, display, lr, rng, util, word } = _c;
      const { K } = S;
      if (display === 'panel') {
        const panel = util.el('aside', 'ref-panel', body);
        const heading = rng.pick(['Your task', 'Instructions', 'To do', 'Goal']);
        util.el('div', 'ref-panel-title', panel, word ? word(lr.pick(K.panel)) : heading);
        util.el('div', 'ref-panel-text', panel, ctx.instruction);
        if (rng.bool(0.5)) body.classList.add('ref-panel-right');
      }
      const tips = util.el('section', 'travel-tips', body);
      util.el('h2', '', tips, 'ℹ  Help & Tips');
      const tipGrid = util.el('div', 'travel-tip-grid', tips);
      const tip = (title, text) => {
        const cell = util.el('div', 'travel-tip', tipGrid);
        util.el('strong', '', cell, title);
        util.el('span', '', cell, text);
      };
      tip('Change your seat', 'Select Edit Itinerary to choose a new seat on your flight.');
      tip('Change your travel date', 'You can update your departure date, subject to fare rules and availability.');
      tip('Need more help?', 'Visit our Help Centre for answers to common questions about managing your booking.  ›');
      Object.assign(_c, { tip, tipGrid, tips });
    },
  };

  env.site({
    name: 'design-use-travel-change-04',
    template: 'site/base',
    design: { parts },
  });
})();
