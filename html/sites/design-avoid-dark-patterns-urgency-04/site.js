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
      if (W >= 1180) rng.bool(0.5);
      const nav = true;
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, placement, sidebar, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { content, nav, rng, util } = _c;
      const { TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      util.el('div', 'ref-window-title', header, 'GlobeAir – Flights');
      rng.pick(TITLES);
      const brand = util.el('div', 'ref-brand', header);
      util.el('strong', '', brand, 'GlobeAir');
      util.el('b', '', brand, '');
      util.el('small', '', brand, '');
      brand.dataset.role = 'brand';
      if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        rng.sample(content.NAV_ITEMS, rng.int(3, 5));
        for (const item of ['✈　Flights', '▤　My Trips', '♙　Frequent Flyer', '◇　Deals', '▤　Travel Info']) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      Object.assign(_c, { brand, header });
    },
    'frame.body': (base, S) => function (_c) {
      const { content, rng, sidebar, util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      if (sidebar) rng.sample(content.NAV_ITEMS, rng.int(4, 7));
      const side = util.el('aside', 'ref-help', body);
      util.el('h2', '', side, '✈　Your trip');
      const helpRows = [['', 'Fare options', '3 shown'], ['→', 'Route', 'Your selected itinerary'], ['♟', 'Travelers', '1 adult　|　Economy']];
      for (const [icon, title, text] of helpRows) { const row = util.el('div', 'ref-help-row', side); util.el('b', '', row, icon); const copy = util.el('div', '', row); util.el('strong', '', copy, title); util.el('span', '', copy, text); }
      util.el('hr', '', side);
      util.el('h3', '', side, 'Why book with GlobeAir?');
      const trust = [['★', 'Trusted for 40 years'], ['⬟', 'Secure booking'], ['◇', 'No hidden fees']];
      for (const [icon, text] of trust) { const row = util.el('div', 'ref-help-row', side); util.el('b', '', row, icon); util.el('div', '', row, text); }
      const upsell = util.el('div', 'ref-insurance', side);
      util.el('strong', '', upsell, '♧　Add travel insurance');
      util.el('span', '', upsell, 'Cover for changes and medical costs.');
      const insuranceBtn = util.el('button', '', upsell, 'Add to trip');
      insuranceBtn.type = 'button';
      insuranceBtn.addEventListener('click', () => env.log('decoy', { label: 'Add to trip' }));
      Object.assign(_c, { body, helpRows, insuranceBtn, side, trust, upsell });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-avoid-dark-patterns-urgency-04',
    template: 'site/base',
    design: { parts },
  });
})();
