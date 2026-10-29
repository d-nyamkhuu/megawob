// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.theme': (base, S) => function (_c) {
      const { ctx } = _c;
      const { ACCENTS, LOW_ACCENTS, THEMES } = S;
      const { rng, util, content } = ctx;
      let name = rng.pick(Object.keys(THEMES));
      const root = document.documentElement;
      let accent = rng.pick(ACCENTS);
      const tr = rng.fork('chrome/theme');
      if (tr.bool(0.08)) {
        name = 'low';
        accent = tr.pick(LOW_ACCENTS);
      }
      for (const [k, v] of Object.entries({ bg: '#e8f3ed', panel: '#fafcfb', fg: '#293044', muted: '#536b66', line: '#b5cdd1' })) root.style.setProperty(`--${k}`, v);
      root.style.setProperty('--accent', '#124f40');
      root.dataset.theme = 'rivermere';
      Object.assign(_c, { accent, content, name, rng, root, tr, util });
    },
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, tall, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebar = roomy && rng.bool(0.35);
      const navDraw = W >= 1180 && rng.bool(0.5); // preserve the cloned shell's seeded draw
      const nav = true;
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, navDraw, placement, sidebar, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { content, display, local, nav, rng, util } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      let brand = null;
      if (display !== 'header' || nav) {
        const title = rng.pick(TITLES);
        brand = util.el('div', 'ref-brand', header, 'Rivermere');
        brand.dataset.role = 'brand';
      }
      if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        const sampledNav = local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
        for (const item of ['Home', 'Map', 'Places', 'Planning', 'Reports', 'Administration']) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          if (item === 'Map') a.classList.add('is-active');
          if (item === 'Administration') a.classList.add('is-emphasis');
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      Object.assign(_c, { brand, header });
    },
    'frame.tools': (base, S) => function (_c) {
      const { brand, collide, ctx, decoyBtn, decoys, display, endBtn, header, label, placement, util, wantFooter } = _c;
      let submit = null;
      const headerTools = util.el('div', 'ref-tools', header);
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      const masthead = util.el('section', 'map-masthead', document.body);
      if (brand) masthead.appendChild(brand);
      util.el('div', 'map-date', masthead, 'Tuesday 12 July 2011');
      masthead.appendChild(headerTools);
      const meta = util.el('div', 'map-meta', masthead);
      util.el('div', 'map-meta-row', meta, 'View　　 City Map');
      util.el('div', 'map-meta-row', meta, 'Area　　 Rivermere');
      util.el('div', 'map-meta-row', meta, 'Showing　 Places, districts and major roads');
      util.el('div', 'map-meta-row', meta, 'Updated　 Apr 12, 2000　10:24 AM');
      const skyline = util.el('div', 'map-skyline', masthead);
      skyline.setAttribute('aria-hidden', 'true');
      if (display === 'header') {
        const note = util.el('div', 'map-header-note', masthead, ctx.instruction);
        note.dataset.role = 'instruction';
      }
      Object.assign(_c, { headerTools, masthead, meta, skyline, submit });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-pan-map-marker-03',
    template: 'site/base',
    design: { parts },
  });
})();
