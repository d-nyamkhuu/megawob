// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, tall, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['footer', 'footer', 'footer', 'footer', 'header', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sampledSidebar = roomy && rng.bool(0.35);
      const sidebar = true;
      const nav = W >= 1180 && rng.bool(0.5);
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (!word && rng.fork('chrome/next-save').bool(0.6)) label = 'Save';
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
      const brand = util.el('div', 'ref-brand', header, 'Project Manager');
      brand.dataset.role = 'brand';
      const menu = util.el('nav', 'next-menu', header);
      for (const item of ['File', 'Edit', 'View', 'Project', 'Team', 'Window', 'Help']) {
        util.el('span', '', menu, item);
      }
      const toolbar = util.el('div', 'next-toolbar', header);
      for (const [icon, label] of [['▧','New'], ['▰','Open'], ['♟♟','Teams'], ['▤','Tasks'], ['▦','Schedule'], ['▥','Reports']]) {
        const tool = util.el('div', 'next-tool', toolbar);
        util.el('span', 'next-tool-icon', tool, icon);
        util.el('span', '', tool, label);
      }
      Object.assign(_c, { brand, header, menu, toolbar });
    },
    'frame.body': (base, S) => function (_c) {
      const { content, local, rng, sampledSidebar, sidebar, util } = _c;
      const { K } = S;
      const body = util.el('div', 'ref-body', document.body);
      if (sidebar) {
        if (sampledSidebar) local(rng.sample(content.NAV_ITEMS, rng.int(4, 7)), K.nav);
        const side = util.el('aside', 'ref-side', body);
        for (const item of ['Corporate Site', 'Product Line', 'Research', 'Infrastructure']) {
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
      const workspace = util.el('section', 'next-workspace', stage);
      util.el('h1', '', workspace, 'Corporate Site');
      util.el('div', 'next-subtitle', workspace, 'Website redesign and launch');
      util.el('div', 'next-bottom-info', workspace, 'Start Date:      Apr 12, 1993                         End Date:      Sep 30, 1993                         Status:      Planning');
      const inspector = util.el('aside', 'next-inspector', body);
      util.el('h2', '', inspector, 'Project Inspector');
      util.el('b', '', inspector, 'General');
      util.el('p', '', inspector, 'Name:          Corporate Site');
      util.el('p', '', inspector, 'Code:          CS-001');
      util.el('p', '', inspector, 'Start Date:    Apr 12, 1993');
      util.el('p', '', inspector, 'End Date:      Sep 30, 1993');
      util.el('p', '', inspector, 'Status:        Planning');
      util.el('b', '', inspector, 'Details');
      util.el('p', '', inspector, 'Owner:         Patricia Miller');
      util.el('p', '', inspector, 'Priority:      High');
      util.el('p', '', inspector, 'Category:      Web');
      util.el('p', '', inspector, 'Budget:        $250,000');
      util.el('p', '', inspector, 'Spent:         $0');
      util.el('b', '', inspector, 'Description');
      util.el('div', 'next-description', inspector, 'Redesign the corporate website to improve brand presence and usability.');
      S.frameAlign(_c, stage);
      Object.assign(_c, { inspector, stage, workspace });
    },
  };

  env.site({
    name: 'design-transfer-items-range-02',
    template: 'site/base',
    design: { parts },
  });
})();
