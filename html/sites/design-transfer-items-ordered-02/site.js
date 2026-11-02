// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { content, display, local, nav, rng, util } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      if (display !== 'header' || nav) {
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, 'Project Management');
        brand.dataset.role = 'brand';
      }
      if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        const navDraw = local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
        for (const [i, item] of ['Dashboard', 'Users', 'Groups', 'Reports', 'Settings'].entries()) {
          const a = util.el('a', 'ref-navlink', n, item);
          if (i === 1) a.classList.add('active');
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      Object.assign(_c, { header });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const roleForm = util.el('section', 'ref-role-form', body);
      util.el('h1', '', roleForm, 'Edit Role');
      util.el('label', '', roleForm, 'Role name');
      const roleName = util.el('input', '', roleForm);
      roleName.value = 'Finance Manager';
      roleName.readOnly = true;
      const inspector = util.el('aside', 'ref-inspector', body);
      util.el('div', 'ref-side-kicker', inspector, 'ACCESS MANAGEMENT');
      for (const [icon, label] of [['♙','Users'], ['♟','Roles'], ['♙','Permissions'], ['▤','Audit Log']]) {
        const row = util.el('div', `ref-admin-link${label === 'Roles' ? ' active' : ''}`, inspector);
        util.el('span', 'ref-admin-icon', row, icon);
        util.el('span', '', row, label);
      }
      util.el('div', 'ref-summary-title', inspector, 'Summary');
      for (const [label, value] of [['Total roles','6'], ['Total permissions','24'], ['Assigned to this role','3'], ['Available','5']]) {
        const row = util.el('div', 'ref-summary-row', inspector);
        util.el('span', '', row, label);
        util.el('strong', '', row, value);
      }
      const panel = body.querySelector('.ref-panel');
      if (panel) inspector.appendChild(panel);
      const side = body.querySelector('.ref-side');
      if (side) inspector.appendChild(side);
      Object.assign(_c, { inspector, roleForm, roleName, stage });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-transfer-items-ordered-02',
    template: 'site/base',
    design: { parts },
  });
})();
