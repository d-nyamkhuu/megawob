// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      S.frameBrand(_c, header);
      const library = util.el('div', 'ref-library-title', header, 'ACME Finance Hub');
      library.dataset.role = 'brand';
      Object.assign(_c, { header, library });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const records = util.el('aside', 'ref-records', body);
      const recordsHead = util.el('div', 'ref-records-head', records);
      util.el('strong', '', recordsHead, 'Accounts Payable');
      util.el('span', '', recordsHead, '⌄   ⋮');
      const tabs = util.el('div', 'ref-record-tabs', records);
      for (const tab of ['All', 'Needs Review', 'Pending Payment', 'Completed']) {
        util.el('span', tab === 'All' ? 'is-active' : '', tabs, tab);
      }
      util.el('div', 'ref-record-search', records, '⌕   Search invoices, vendors, or IDs');
      const entries = [
        ['AP-4107', 'Northstar Office Goods', 'Mar 14, 2024', '$4,320.00', 'Invoice  •  Needs Review'],
        ['AP-4106', 'Cobalt Marketing', 'Mar 12, 2024', '$1,125.00', 'Invoice  •  Pending Payment'],
        ['AP-4105', 'Vertex Solutions', 'Mar 11, 2024', '$980.50', 'Invoice  •  Needs Review'],
        ['AP-4104', 'Horizon Facilities', 'Mar 10, 2024', '$2,450.00', 'Invoice  •  Completed'],
        ['AP-4103', 'Pinecrest IT', 'Mar 8, 2024', '$760.00', 'Invoice  •  Pending Payment'],
        ['AP-4102', 'Summit Logistics', 'Mar 7, 2024', '$5,200.00', 'Invoice  •  Needs Review'],
        ['AP-4101', 'Clearview Media', 'Mar 5, 2024', '$310.00', 'Invoice  •  Completed'],
      ];
      for (let i = 0; i < entries.length; i++) {
        const row = util.el('div', `ref-record-row${i === 0 ? ' selected' : ''}`, records);
        const top = util.el('div', 'ref-record-top', row);
        util.el('strong', '', top, entries[i][0]);
        util.el('span', '', top, entries[i][2]);
        const mid = util.el('div', 'ref-record-mid', row);
        util.el('span', '', mid, entries[i][1]);
        util.el('span', '', mid, entries[i][3]);
        util.el('div', 'ref-record-sub', row, entries[i][4]);
      }
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, entries, records, recordsHead, tabs });
    },
  };

  env.site({
    name: 'design-avoid-phishing-mfa-02',
    template: 'site/base',
    design: { parts },
  });
})();
