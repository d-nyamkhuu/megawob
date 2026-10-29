// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      // Acme CRM's compact Lightning-era global bar.
      const crmBrand = util.el('div', 'crm-brand', header);
      util.el('span', 'crm-cloud', crmBrand, '☁');
      util.el('strong', '', crmBrand, 'Acme CRM');
      const search = util.el('div', 'crm-search', header, 'Search accounts, contacts, and more…');
      util.el('span', 'crm-search-icon', search, '⌕');
      const accountTools = util.el('div', 'crm-account-tools', header);
      util.el('span', 'crm-bell', accountTools, '♟');
      const user = util.el('div', 'crm-user', accountTools);
      util.el('span', 'crm-user-photo', user, 'T');
      util.el('span', '', user, 'Taylor Kim');
      util.el('span', 'crm-user-caret', user, '▾');
      S.frameBrand(_c, header);
      Object.assign(_c, { accountTools, crmBrand, header, search, user });
    },
  };

  env.site({
    name: 'design-protect-privacy-wrongfield-01',
    template: 'site/base',
    design: { parts },
  });
})();
