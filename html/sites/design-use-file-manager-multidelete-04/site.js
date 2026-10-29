// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const menu = util.el('div', 'mac-menu', header);
      util.el('span', 'mac-apple', menu, '●');
      for (const label of ['File', 'Edit', 'View', 'Special', 'Help']) util.el('span', 'mac-menu-item', menu, label);
      util.el('span', 'mac-clock', menu, '▣　3:24 PM');
      S.frameBrand(_c, header);
      Object.assign(_c, { header, menu });
    },
    'frame.nav': (base, S) => function (_c) {
      const { content, header, local, nav, rng, util } = _c;
      const { K } = S;
      if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        for (const item of local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav)) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      } else {
        // Fixed CRM navigation is visual frame; the sampled nav draw above is retained unchanged.
        const n = util.el('nav', 'ref-nav', header);
        for (const item of ['Home', 'Accounts', 'Contacts', 'Opportunities', 'Cases', 'Reports', 'Files', 'Dashboards']) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const rail = util.el('aside', 'mac-rail', body);
      for (const [icon, label] of [['☻','Finder'], ['▤','Applications'], ['▧','Documents'], ['▱','Desktop'], ['▰','Hard Disk']]) {
        const item = util.el('div', 'mac-launcher', rail);
        util.el('span', 'mac-launcher-icon', item, icon);
        util.el('span', 'mac-launcher-label', item, label);
      }
      const trash = util.el('div', 'mac-trash', rail);
      util.el('span', 'mac-launcher-icon', trash, '▤');
      util.el('span', 'mac-launcher-label', trash, 'Trash');
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, rail, trash });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const recent = util.el('aside', 'crm-recent', body);
      const recentHead = util.el('div', 'crm-recent-head', recent);
      util.el('strong', '', recentHead, 'Recent Files');
      util.el('a', '', recentHead, 'See All');
      for (const [icon, color, file, path, age] of [
        ['P','orange','Marketing Plan 2019.pptx','Projects / Marketing','2 hours ago'],
        ['X','green','Customer List.xlsx','Sales','4 hours ago'],
        ['W','blue','Product Roadmap.docx','Projects / FY19','1 day ago'],
        ['▧','purple','Design Mockup.png','Marketing','1 day ago'],
        ['PDF','red','Quarterly Results.pdf','Reports','2 days ago'],
        ['≡','gray','Notes.txt','Projects / FY19 / Planning','3 days ago'],
        ['W','blue','Team Guidelines.docx','People Ops','4 days ago'],
        ['PDF','red','Budget_Overview.pdf','Projects / FY19 / Planning','1 week ago'],
      ]) {
        const row = util.el('div', 'crm-recent-row', recent);
        util.el('span', `crm-file-icon crm-${color}`, row, icon);
        const detail = util.el('div', 'crm-recent-detail', row);
        util.el('a', '', detail, file);
        util.el('span', '', detail, path);
        util.el('span', '', detail, age);
      }
      Object.assign(_c, { recent, recentHead, stage });
    },
  };

  env.site({
    name: 'design-use-file-manager-multidelete-04',
    template: 'site/base',
    design: { parts },
  });
})();
