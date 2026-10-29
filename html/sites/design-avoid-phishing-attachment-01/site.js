// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.stage': (base, S) => function (_c) {
      const { body, display, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);

      // BeOS desktop frame and fixed utility navigation for this design.
      document.body.classList.add('beos-mail');
      document.body.classList.toggle('beos-header-note', display === 'header');
      const menu = util.el('div', 'beos-menu', document.body);
      for (const item of ['File', 'Edit', 'View', 'Message', 'Accounts', 'Tools', 'Window', 'Help'])
        util.el('span', '', menu, item);
      const toolbar = util.el('div', 'beos-toolbar', body);
      for (const [icon, label] of [['✉', 'New'], ['↶', 'Reply'], ['↶', 'Reply All'], ['➜', 'Forward'], ['▤', 'Delete'], ['▧', 'Print'], ['☑', 'Mark Read']]) {
        const item = util.el('div', 'beos-tool', toolbar);
        util.el('span', 'beos-tool-icon', item, icon);
        util.el('span', '', item, label);
      }
      const related = util.el('aside', 'beos-related', body);
      util.el('div', 'beos-panel-title', related, 'Related Records');
      const tabs = util.el('div', 'beos-tabs', related);
      for (const label of ['Invoices', 'Messages', 'Payments']) util.el('span', '', tabs, label);
      const table = util.el('div', 'beos-record-table', related);
      const columns = ['Invoice #', 'Vendor', 'Date', 'Amount', 'Status'];
      const head = util.el('div', 'beos-record-row beos-record-head', table);
      for (const label of columns) util.el('span', '', head, label);
      const rows = [
        ['4487', 'Bay View Trading', 'Mar 12, 1999', '$1,284.00', 'Pending'],
        ['4479', 'Office Essentials', 'Mar 8, 1999', '$362.17', 'Approved'],
        ['4462', 'Bay View Trading', 'Feb 26, 1999', '$915.50', 'Paid'],
        ['4458', 'Metro Office Supply', 'Feb 18, 1999', '$204.00', 'Paid'],
        ['4443', 'Pacific Systems', 'Feb 10, 1999', '$768.33', 'Approved'],
        ['4431', 'Office Essentials', 'Jan 29, 1999', '$281.44', 'Paid'],
        ['4420', 'Bay View Trading', 'Jan 15, 1999', '$604.10', 'Paid'],
        ['4417', 'Northern Telecom', 'Jan 8, 1999', '$450.00', 'Approved'],
        ['4403', 'Pacific Systems', 'Dec 18, 1998', '$1,230.75', 'Paid'],
        ['4399', 'Office Essentials', 'Dec 10, 1998', '$98.12', 'Paid'],
      ];
      rows.forEach((values, i) => {
        const row = util.el('div', `beos-record-row${i === 0 ? ' selected' : ''}`, table);
        values.forEach((value) => util.el('span', '', row, value));
      });
      const vendor = util.el('div', 'beos-vendor', related);
      util.el('div', 'beos-panel-title', vendor, 'Vendor Details');
      const vendorBody = util.el('div', 'beos-vendor-body', vendor);
      for (const [label, value] of [['Name:', 'Bay View Trading Co.'], ['Contact:', 'Dana Ruiz'], ['Phone:', '(415) 555-0187'], ['Email:', 'dana.ruiz@bayviewtrading.com'], ['Address:', '2100 Market Street, San Francisco, CA 94103']]) {
        util.el('span', 'beos-vendor-label', vendorBody, label);
        util.el('span', '', vendorBody, value);
      }
      Object.assign(_c, { columns, head, menu, related, rows, stage, table, tabs, toolbar, vendor, vendorBody });
    },
  };

  env.site({
    name: 'design-avoid-phishing-attachment-01',
    template: 'site/base',
    design: { parts },
  });
})();
