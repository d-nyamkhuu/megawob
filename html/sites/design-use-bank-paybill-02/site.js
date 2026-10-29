// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { display, lr, nav, rng, util, word } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      const titlebar = util.el('div', 'ol-titlebar', header);
      util.el('span', 'ol-mark', titlebar, '▤');
      util.el('strong', '', titlebar, 'Harbor View Bank');
      util.el('span', 'ol-window-controls', titlebar, '—　□　×');
      const menubar = util.el('div', 'ol-menubar', header);
      util.el('span', '', menubar, 'File　　Edit　　View　　Accounts　　Payments　　Cards　　Tools　　Help');
      const toolbar = util.el('div', 'ol-toolbar', header);
      for (const [icon, text] of [['⌂','Home'],['＄','Pay Bills'],['⇄','Transfers'],['▤','Transactions'],['▱','Cards'],['▥','Reports']]) {
        const item = util.el('div', `ol-tool${text === 'Pay Bills' ? ' selected' : ''}`, toolbar);
        util.el('span', '', item, icon); util.el('small', '', item, text);
      }
      if (display !== 'header' || nav) {
        const title = rng.pick(TITLES);
        const brandLabel = word ? word(lr.pick(K.brand)) : title;
        const brand = util.el('div', 'ref-brand', header, 'RIVERMERE BANK');
        brand.dataset.originalLabel = brandLabel;
        brand.dataset.role = 'brand';
      }
      Object.assign(_c, { header, menubar, titlebar, toolbar });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const payees = util.el('aside', 'rm-payees', body);
      const ph = util.el('div', 'rm-payees-head', payees);
      util.el('strong', '', ph, 'Payees');
      const add = util.el('button', 'rm-add-payee', ph, '+  Add Payee');
      add.type = 'button';
      add.addEventListener('click', () => env.log('decoy', { what: 'add-payee' }));
      const search = util.el('input', 'rm-search', payees);
      search.type = 'search';
      search.placeholder = '⌕  Search payees';
      search.setAttribute('aria-label', 'Search payees');
      const records = util.el('div', 'rm-records', payees);
      const recordData = [
        ['▥', 'City Utilities', '9981'], ['◆', 'Greenway Property Mgmt', '4472'],
        ['♜', 'Yılmaz Kebab House', '2853'], ['⬟', 'Maple Ridge Insurance', '7710'],
        ['⌁', 'Pinecrest Internet', '6394'], ['▤', 'Summit Credit Card', '8822'],
        ['✣', 'Lakeside Fitness', '5561'], ['◇', 'Oakwood School District', '9043'],
        ['✚', 'Riverdale Medical Center', '2266']
      ];
      for (const [icon, label, suffix] of recordData) {
        const row = util.el('div', 'rm-record', records);
        util.el('span', 'rm-record-icon', row, icon);
        const copy = util.el('span', 'rm-record-copy', row);
        util.el('strong', '', copy, label);
        util.el('small', '', copy, `• ${suffix}`);
      }
      search.addEventListener('input', () => {
        const query = search.value.trim().toLowerCase();
        for (const row of records.children) row.hidden = !row.textContent.toLowerCase().includes(query);
      });
      const dock = util.el('nav', 'rm-dock', document.body);
      for (const [icon, label] of [['⌂','Accounts'],['▰','Bill Pay'],['⇄','Transfers'],['◷','Transactions'],['▣','Cards'],['⚙','Settings']]) {
        const item = util.el('a', `rm-dock-item${label === 'Bill Pay' ? ' current' : ''}`, dock);
        item.href = '#'; item.dataset.role = 'nav';
        util.el('span', 'rm-dock-icon', item, icon); util.el('span', '', item, label);
        item.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what:'nav', label }); });
      }
      S.frameSidebar(_c, body);
      Object.assign(_c, { add, body, dock, payees, ph, recordData, records, search });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const inspector = util.el('aside', 'ol-inspector', body);
      const inspectorHead = util.el('div', 'ol-inspector-head', inspector);
      util.el('span', '', inspectorHead, 'Details');
      util.el('span', 'ol-inspector-pin', inspectorHead, '◆');
      const inspectorRows = util.el('div', 'ol-inspector-rows', inspector);
      for (const [label, value] of [['From Account:', '—'], ['Biller:', '—'], ['Amount:', '—'], ['Payment Date:', '—']]) {
        const row = util.el('div', 'ol-inspector-row', inspectorRows);
        util.el('span', '', row, label);
        util.el('span', '', row, value);
      }
      const category = util.el('div', 'ol-inspector-category', inspector);
      util.el('span', '', category, 'Category:');
      util.el('span', 'ol-inspector-value', category, 'Uncategorized　▾');
      const inspectorBottom = util.el('div', 'ol-inspector-bottom', inspector);
      for (const [label, value] of [['Last Payment:', '—'], ['Average Payment:', '—']]) {
        const row = util.el('div', 'ol-inspector-row', inspectorBottom);
        util.el('span', '', row, label);
        util.el('span', '', row, value);
      }
      Object.assign(_c, { category, inspector, inspectorBottom, inspectorHead, inspectorRows, stage });
    },
  };

  env.site({
    name: 'design-use-bank-paybill-02',
    template: 'site/base',
    design: { parts },
  });
})();
