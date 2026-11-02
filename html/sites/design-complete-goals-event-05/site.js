// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const MEMBERS = [
    ['Singh, Arjun', 'asingh', 'Riverside Garden Club', '03/14/1985', '09/22/2029', '#2272c0'],
    ['Chen, Liyu', 'lchen', 'Maple Grove School', '11/02/1978', '04/18/2030', '#7b5fb0'],
    ['Ramirez, Sofia', 'sramirez', 'Cedar Ridge Cycling', '07/30/1990', '12/11/2028', '#d9731c'],
    ['Patel, Kiran', 'kpatel', 'Lakeside Community Center', '01/25/1982', '06/03/2030', '#23985c'],
    ["O'Neil, Patrick", 'poneil', 'Stonebridge Runners', '09/17/1975', '02/20/2031', '#b83a3f'],
    ['Nguyen, Mai', 'mnguyen', 'West End Arts Collective', '05/08/1988', '08/14/2029', '#1a9db8'],
    ['Baker, Elise', 'ebaker', 'Pine Hill Book Club', '12/06/1979', '10/27/2030', '#888888'],
  ];

  const parts = {
    'frame.nav': (base, S) => function (_c) {},
    'frame.header': (base, S) =>
      function (_c) {
        const { util } = _c;
        document.body.style.setProperty('--reg-h', `${_c.H}px`);
        document.body.style.setProperty('--reg-w', `${_c.W}px`);
        const header = util.el('header', 'ref-task', document.body);
        const brand = S.frameBrand(_c, header) || util.el('div', 'ref-brand', header);
        brand.textContent = 'Community Registry';
        Object.assign(_c, { header });
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, util } = _c;
        body.style.setProperty('--reg-top', `${_c.header.offsetHeight}px`);
        document.body.style.setProperty('--reg-top', `${_c.header.offsetHeight}px`);
        const col = util.el('div', 'reg-col', body);
        const stage = util.el('main', 'ref-stage', col);
        S.frameAlign(_c, stage);
        const list = util.el('div', 'reg-list', col);
        util.el('div', 'reg-list-head', list, 'Existing Members');
        const tbl = util.el('div', 'reg-table', list);
        const head = util.el('div', 'reg-row reg-th', tbl);
        for (const h of ['Name', 'Username', 'Organization', 'Birth Date', 'Adoption Date', 'Favorite Color'])
          util.el('span', '', head, h);
        const scroll = util.el('div', 'reg-scroll', tbl);
        scroll.setAttribute('aria-label', 'Existing members');
        for (const m of MEMBERS) {
          const row = util.el('div', 'reg-row', scroll);
          for (let i = 0; i < 5; i++) util.el('span', '', row, m[i]);
          const c = util.el('span', 'reg-colorcell', row);
          util.el('i', '', c).style.background = m[5];
        }
        Object.assign(_c, { stage, col, list });
      },
  };

  env.site({
    name: 'design-complete-goals-event-05',
    template: 'site/base',
    design: { parts },
  });
})();
