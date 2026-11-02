// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { display, nav, rng, util } = _c;
      const { TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      if (display !== 'header' || nav) rng.pick(TITLES); // retain the scaffold's existing title draw
      const brand = util.el('div', 'ref-brand', header, 'Relayboard - Customer Follow Up');
      brand.dataset.role = 'brand';
      Object.assign(_c, { brand, header });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const menu = util.el('nav', 'os-menubar', document.body);
      for (const item of ['File', 'Edit', 'View', 'Workflow', 'Tools', 'Help']) util.el('span', '', menu, item);
      const tabs = util.el('nav', 'os-tabs', document.body);
      for (const [icon, label] of [['♧', 'Workflows'], ['♆', 'Integrations'], ['▤', 'Activity'], ['⚙', 'Settings']]) {
        const tab = util.el('div', 'os-tab', tabs);
        util.el('span', 'os-tab-icon', tab, icon);
        util.el('span', '', tab, label);
      }
      const records = util.el('aside', 'os-records', body);
      util.el('div', 'os-record-title', records, 'Workflows');
      const columns = util.el('div', 'os-record-columns', records);
      util.el('span', '', columns, 'Name  ▲');
      util.el('span', '', columns, 'Modified');
      const entries = [
        ['Customer Follow Up', 'Mar 12, 1994'], ['Lead Qualification', 'Mar 10, 1994'],
        ['Onboarding', 'Mar 08, 1994'], ['Trial Reminder', 'Mar 05, 1994'],
        ['Invoice Processing', 'Feb 28, 1994'], ['Support Escalation', 'Feb 24, 1994'],
        ['Feedback Survey', 'Feb 20, 1994'], ['Product Update', 'Feb 15, 1994'],
        ['Winback Campaign', 'Feb 10, 1994'], ['Data Cleanup', 'Feb 03, 1994'],
      ];
      const list = util.el('div', 'os-record-list', records);
      for (let i = 0; i < entries.length; i++) {
        const row = util.el('div', `os-record-row${i === 0 ? ' selected' : ''}`, list);
        util.el('span', 'os-record-glyph', row, '♧');
        util.el('span', 'os-record-name', row, entries[i][0]);
        util.el('span', 'os-record-date', row, entries[i][1]);
      }
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, columns, entries, list, menu, records, tabs });
    },
  };

  env.site({
    name: 'design-use-workflow-editor-place-01',
    template: 'site/base',
    design: { parts },
  });
})();
