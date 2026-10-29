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
      rng.pick(TITLES);
      const brand = util.el('div', 'ref-brand', header);
      util.el('strong', '', brand, 'Cadence Music');
      brand.dataset.role = 'brand';
      if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        rng.sample(content.NAV_ITEMS, rng.int(3, 5));
        for (const item of ['Home', 'Browse', 'Your Library', 'Plans', 'Podcasts', 'Live']) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      const search = util.el('div', 'ref-search', header);
      util.el('span', 'ref-search-icon', search, '⌕');
      util.el('span', 'ref-search-placeholder', search, 'Search artists, albums or podcasts');
      util.el('span', 'ref-avatar', header, '●');
      Object.assign(_c, { brand, header, search });
    },
    'frame.body': (base, S) => function (_c) {
      const { content, rng, sidebar, util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      if (sidebar) rng.sample(content.NAV_ITEMS, rng.int(4, 7));
      const side = util.el('aside', 'ref-help', body);
      util.el('h2', '', side, 'Plan details');
      const selected = util.el('div', 'ref-selected-plan', side);
      util.el('b', '', selected, '〽');
      const selectedCopy = util.el('div', '', selected);
      util.el('strong', '', selectedCopy, 'Plus');
      util.el('span', '', selectedCopy, '$10.99 / month');
      const detailRows = [['Ad-free listening', 'Yes'], ['Devices', 'Up to 5'], ['Catalogue access', 'Millions of songs and podcasts'], ['Download limit', '5,000 tracks'], ['Audio quality', 'Lossless (FLAC)'], ['Parental controls', 'No']];
      const details = util.el('div', 'ref-details', side);
      for (const [key, val] of detailRows) { const row = util.el('div', 'ref-detail-row', details); util.el('span', '', row, key); util.el('b', '', row, val); }
      util.el('hr', '', side);
      util.el('h3', '', side, 'Good to know');
      const notes = [['▦', 'Billed monthly. Cancel anytime in your account settings.'], ['▤', 'No long-term contract.'], ['◎', 'Available in the US, CA, UK and more.']];
      for (const [icon, text] of notes) { const row = util.el('div', 'ref-good-row', side); util.el('b', '', row, icon); util.el('span', '', row, text); }
      util.el('hr', '', side);
      for (const label of ['Compare plans', 'Student discount', 'Supported devices', 'Audio quality', 'Features by plan']) {
        const link = util.el('div', 'ref-inspector-link', side); util.el('span', '', link, label); util.el('b', '', link, '›');
      }
      Object.assign(_c, { body, detailRows, details, notes, selected, selectedCopy, side });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-avoid-dark-patterns-urgency-03',
    template: 'site/base',
    design: { parts },
  });
})();
