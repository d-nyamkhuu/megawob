// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      header.classList.add('irix-shelf');
      const irixBrand = util.el('div', 'irix-brand', header, '◈ IRIX');
      const irixNav = util.el('nav', 'irix-nav', header);
      for (const item of ['Operations', 'Tickets', 'Inventory', 'Employees', 'Reports', 'Administration']) {
        const a = util.el('a', `irix-navitem${item === 'Tickets' ? ' selected' : ''}`, irixNav, item);
        a.href = '#'; a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
      }
      const irixClock = util.el('div', 'irix-clock', header, 'Mon Apr 21 1997　10:24 AM');
      util.el('span', 'irix-icon', header, '▣');
      util.el('span', 'irix-icon', header, '?');
      util.el('span', 'irix-icon cube', header, '⬡');
      S.frameBrand(_c, header);
      Object.assign(_c, { header, irixBrand, irixClock, irixNav });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      body.classList.add('irix-desktop');
      S.frameSidebar(_c, body);
      Object.assign(_c, { body });
    },
  };

  env.site({
    name: 'design-use-data-grid-colfilter-01',
    template: 'site/base',
    design: { parts },
  });
})();
