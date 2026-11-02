// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, tall, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sampledSidebar = roomy && rng.bool(0.35);
      const sidebar = true;
      const nav = W >= 1180 && rng.bool(0.5);
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (!word && rng.fork('chrome/next-save').bool(0.7)) label = 'Save';
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, placement, sampledSidebar, sidebar, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { rng, util } = _c;
      const { TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      rng.pick(TITLES);
      const brand = util.el('div', 'ref-brand', header, 'Globex');
      brand.dataset.role = 'brand';
      const menu = util.el('nav', 'next-menu', header);
      for (const item of ['Dashboard', 'Contacts', 'Locations', 'Reports', 'Settings']) {
        const link = util.el('a', item === 'Locations' ? 'active' : '', menu, item);
        link.href = '#';
        link.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
      }
      const toolbar = util.el('div', 'next-toolbar', header);
      const search = util.el('button', 'next-search', toolbar);
      search.type = 'button'; search.title = 'Search'; search.setAttribute('aria-label', 'Search');
      search.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="7"/><path d="m16 16 5.5 5.5"/></svg>';
      const profile = util.el('button', 'next-profile', toolbar);
      profile.type = 'button'; profile.title = 'Profile'; profile.setAttribute('aria-label', 'Profile');
      profile.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="8" r="3.3"/><path d="M5 20c.3-4 2.5-6 7-6s6.7 2 7 6"/></svg>';
      Object.assign(_c, { brand, header, menu, toolbar });
    },
    'frame.body': (base, S) => function (_c) {
      const { content, local, rng, sampledSidebar, sidebar, util } = _c;
      const { K } = S;
      const body = util.el('div', 'ref-body', document.body);
      if (sidebar) {
        if (sampledSidebar) local(rng.sample(content.NAV_ITEMS, rng.int(4, 7)), K.nav);
        const side = util.el('aside', 'ref-side', body);
        util.el('h2', 'ref-side-title', side, 'Regions');
        for (const [item, count] of [['Europe', '46'], ['Asia', '50'], ['North America', '40'], ['South America', '14'], ['Africa', '54'], ['Oceania', '14'], ['Antarctica', '0']]) {
          const a = util.el('a', item === 'Europe' ? 'ref-sidelink active' : 'ref-sidelink', side);
          a.href = '#';
          util.el('span', '', a, item);
          util.el('span', 'ref-region-count', a, count);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label: item }); });
        }
      }
      Object.assign(_c, { body });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      const workspace = util.el('section', 'next-workspace', body);
      util.el('h1', '', workspace, 'Countries');
      util.el('div', 'next-subtitle', workspace, 'Manage country selections for your data view.');
      const instruction = document.querySelector('.ref-instruction');
      if (instruction) workspace.append(instruction);
      S.frameAlign(_c, stage);
      Object.assign(_c, { stage, workspace });
    },
  };

  env.site({
    name: 'design-transfer-items-range-01',
    template: 'site/base',
    design: { parts },
  });
})();
