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
      const sidebarDraw = roomy && rng.bool(0.35);
      const navDraw = W >= 1180 && rng.bool(0.5);
      const sidebar = true;
      const nav = true;
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, navDraw, placement, sidebar, sidebarDraw, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { display, nav, rng, util } = _c;
      const { TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      if (display !== 'header' || nav) {
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, 'Project Management');
        brand.dataset.role = 'brand';
      }
      Object.assign(_c, { header });
    },
    'frame.body': (base, S) => function (_c) {
      const { content, local, rng, sidebar, util } = _c;
      const { K } = S;
      const body = util.el('div', 'ref-body', document.body);
      if (sidebar) {
        const side = util.el('aside', 'ref-side', body);
        const sideDraw = local(rng.sample(content.NAV_ITEMS, rng.int(4, 7)), K.nav);
        const sideNames = ['Home', 'Users', 'Roles', 'Groups', 'Permissions', 'Reports', 'Administration'];
        for (const [i, sampled] of sideDraw.entries()) {
          const item = sideNames[i] || sampled;
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
      const project = util.el('section', 'ref-project', body);
      util.el('h1', 'ref-project-title', project, 'User Roles');
      const facts = util.el('div', 'ref-project-facts', project);
      for (const [key, value] of [['Role name:', 'Customer Service Representative'], ['Description:', 'Handles customer inquiries and order processing.'],
        ['Type:', 'Standard'], ['Status:', 'Active'], ['Created:', 'Mar 10, 1995'], ['Last modified:', 'Apr 2, 1995']]) {
        const row = util.el('div', 'ref-fact', facts);
        util.el('span', '', row, key);
        util.el('strong', '', row, value);
      }
      const inspector = util.el('aside', 'ref-inspector', body);
      if (_c.display === 'panel') inspector.append(body.querySelector('.ref-panel'));
      util.el('h2', '', inspector, 'All roles');
      const details = [
        ['Role', 'Administrator'], ['Role', 'Sales Manager'], ['Role', 'Customer Service Representative'],
        ['Role', 'Order Processor'], ['Role', 'Billing Clerk'], ['Role', 'Read Only'],
        ['Role', 'Reports Viewer'], ['Role', 'Data Manager'],
      ];
      const detailList = util.el('div', 'ref-detail-list', inspector);
      for (const [key, value] of details) {
        const row = util.el('div', 'ref-detail', detailList);
        util.el('span', '', row, key);
        util.el('strong', '', row, value);
      }
      const extra = util.el('div', 'ref-detail-extra', inspector);
      util.el('span', '', extra, 'Team members');
      util.el('strong', '', extra, '3 people');
      const updated = util.el('div', 'ref-detail-extra', inspector);
      util.el('span', '', updated, 'Last updated');
      util.el('strong', '', updated, 'Apr 12, 2013\nby Daniel Carter');
      Object.assign(_c, { detailList, details, extra, facts, inspector, project, stage, updated });
    },
  };

  env.site({
    name: 'design-transfer-items-ordered-04',
    template: 'site/base',
    design: { parts },
  });
})();
