// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, tall, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      const sampledPlacement = ctx.finish ? null : rng.pick(['footer', 'footer', 'footer', 'header', 'link', 'icon']);
      const reservedFooter = tall && (sampledPlacement === 'footer' || sampledPlacement === 'link' || rng.bool(0.3));
      let placement = ctx.finish ? null : rng.fork('chrome/end-placement').pick(['footer', 'footer', 'footer', 'header', 'link', 'icon']);
      const wantFooter = placement === 'footer' || placement === 'link' || reservedFooter;
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebar = roomy && rng.bool(0.35);
      const nav = W >= 1180 && rng.bool(0.5);
      const showIndex = false;
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, placement, showIndex, sidebar, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      {
        const brand = util.el('div', 'ref-brand', header);
        brand.innerHTML = '<svg class="ref-cloud" viewBox="0 0 40 40" aria-hidden="true"><path d="M20 2 35 10v19L20 38 5 29V10Z" fill="#e7f2ff"/><path d="m8 12 12-7 12 7-12 7Z" fill="#85b8ec" stroke="#315c8d" stroke-width="2"/><path d="m8 12 12 7 12-7v8l-12 7-12-7Z" fill="#fff" stroke="#315c8d" stroke-width="2"/></svg><span>DevHub</span>';
        brand.dataset.role = 'brand';
      }
      const project = null;
      if (true) {
        const n = util.el('nav', 'ref-nav', header);
        for (const item of ['Code', 'Build & Deploy', 'Observability', 'Feature Flags', 'Data', 'Settings']) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      Object.assign(_c, { header, project });
    },
    'frame.tools': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, header, label, placement, util, wantFooter } = _c;
      let submit = null;
      const headerTools = util.el('div', 'ref-tools', header);
      const globalSearch = util.el('div', 'ref-global-search', headerTools, '⌕  Search flags, services, etc.');
      globalSearch.setAttribute('aria-hidden', 'true');
      const notification = null;
      const profile = util.el('button', 'ref-profile', headerTools, 'JD');
      profile.type = 'button';
      profile.setAttribute('aria-label', 'Jordan Davis profile');
      profile.addEventListener('click', () => env.log('decoy', { what: 'profile' }));
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      Object.assign(_c, { globalSearch, headerTools, notification, profile, submit });
    },
    'frame.body': (base, S) => function (_c) {
      const { showIndex, util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const indexList = null;
      Object.assign(_c, { body, indexList });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      Object.assign(_c, { stage });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-use-dev-tools-flag-05',
    template: 'site/base',
    design: { parts },
  });
})();
