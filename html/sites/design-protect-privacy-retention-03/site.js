// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { content, rng, util } = _c;
      const { TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      rng.pick(TITLES);
      const brand = util.el('div', 'ref-brand', header, 'Tessellate Cloud');
      brand.dataset.role = 'brand';
      const windowControls = util.el('div', 'ref-window-controls', header);
      for (const glyph of ['−', '□', '×']) util.el('span', 'ref-window-control', windowControls, glyph);
      {
        const n = util.el('nav', 'ref-nav', header);
        rng.sample(content.NAV_ITEMS, rng.int(3, 5));
        for (const item of ['Home', 'Files', 'Sharing', 'Sync', 'Account']) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      Object.assign(_c, { brand, header, windowControls });
    },
    'frame.body': (base, S) => function (_c) {
      const { content, rng, sidebar, util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      if (sidebar) {
        const side = util.el('aside', 'ref-side', body);
        rng.sample(content.NAV_ITEMS, rng.int(4, 7));
        for (const item of []) {
          const a = util.el('a', 'ref-sidelink', side, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label: item }); });
        }
      }
      Object.assign(_c, { body });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);

      // Keep the inspector independent of the task widget's DOM and geometry.
      const spec = _c.ctx.spec;
      const account = spec && spec.user;
      const categories = spec && spec.cats;
      const inspector = util.el('aside', 'ref-inspector', body);
      util.el('strong', 'ref-inspector-title', inspector, 'Account Summary');
      const identity = util.el('div', 'ref-inspector-identity', inspector, account ? account.full : 'Account on file');
      const email = util.el('div', 'ref-inspector-email', inspector, account ? account.email : '');
      util.el('hr', 'ref-inspector-rule', inspector);
      util.el('strong', 'ref-inspector-section', inspector, 'Storage Used');
      const storage = util.el('div', 'ref-inspector-storage', inspector, categories ? `${categories.length} data categories available` : 'Account data');
      util.el('div', 'ref-inspector-meter', inspector);
      util.el('hr', 'ref-inspector-rule', inspector);
      util.el('strong', 'ref-inspector-section', inspector, 'Data Categories');
      const summary = util.el('div', 'ref-inspector-summary', inspector, categories ? categories.map((c) => c.label).join(' · ') : 'Manage your account data and privacy preferences.');
      Object.assign(_c, { email, identity, inspector, stage, storage, summary });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-protect-privacy-retention-03',
    template: 'site/base',
    design: { parts },
  });
})();
