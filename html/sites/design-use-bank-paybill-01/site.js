// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { display, lr, nav, rng, util, word } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      if (display !== 'header' || nav) {
        const title = rng.pick(TITLES);
        const brandLabel = word ? word(lr.pick(K.brand)) : title;
        const brand = util.el('div', 'ref-brand', header, 'RIVERMERE BANK');
        brand.dataset.originalLabel = brandLabel;
        brand.dataset.role = 'brand';
      } else {
        const brand = util.el('div', 'ref-brand', header, 'RIVERMERE BANK');
        brand.dataset.role = 'brand';
      }
      Object.assign(_c, { header });
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
      const recordIcons = [
        '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M5 27V10h7v17M13 27V5h7v22M21 27V15h6v12M3 28h26"/></svg>',
        '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="m3 15 13-11 13 11M7 14v14h18V14M13 28V18h6v10"/></svg>',
        '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M7 3v11M11 3v11M15 3v11M11 14v15M23 3v26M23 3c-5 5-5 11 0 14"/></svg>',
        '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 3 27 7v8c0 7-5 12-11 15C10 27 5 22 5 15V7zM16 9v13"/></svg>',
        '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M4 12a17 17 0 0 1 24 0M8 17a11 11 0 0 1 16 0M12 22a5 5 0 0 1 8 0M16 27h.01"/></svg>',
        '<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="3" y="6" width="26" height="20" rx="2"/><path d="M3 12h26M8 20h7"/></svg>',
        '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M4 13h24M7 13v12M13 13v12M19 13v12M25 13v12M3 27h26M5 10h22l-3-5H8z"/></svg>',
        '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="m4 11 12-7 12 7-12 7zM8 16v7l8 5 8-5v-7M4 11v9"/></svg>',
        '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 3v26M3 16h26M7 7l18 18M25 7 7 25"/></svg>'
      ];
      for (const [i, [icon, label, suffix]] of recordData.entries()) {
        const row = util.el('div', 'rm-record', records);
        const glyph = util.el('span', 'rm-record-icon', row);
        glyph.innerHTML = recordIcons[i];
        const copy = util.el('span', 'rm-record-copy', row);
        util.el('strong', '', copy, label);
        util.el('small', '', copy, `• ${suffix}`);
      }
      search.addEventListener('input', () => {
        const query = search.value.trim().toLowerCase();
        for (const row of records.children) row.hidden = !row.textContent.toLowerCase().includes(query);
      });
      const dock = util.el('nav', 'rm-dock', document.body);
      const dockItems = [
        ['<svg viewBox="0 0 32 32"><path d="m3 15 13-12 13 12M7 13v16h7V19h5v10h6V13"/></svg>','Accounts'],
        ['<svg viewBox="0 0 32 32"><rect x="3" y="6" width="26" height="20" rx="2"/><path d="M3 12h26"/></svg>','Bill Pay'],
        ['<svg viewBox="0 0 32 32"><path d="M4 11h23l-6-6M28 21H5l6 6"/></svg>','Transfers'],
        ['<svg viewBox="0 0 32 32"><path d="M16 3a13 13 0 1 0 13 13H16zM19 3v10h10A13 13 0 0 0 19 3z"/></svg>','Transactions'],
        ['<svg viewBox="0 0 32 32"><rect x="3" y="6" width="26" height="20" rx="2"/><path d="M3 12h26M8 20h8"/></svg>','Cards'],
        ['<svg viewBox="0 0 32 32"><path d="m13 3 6 0 1 4 4 2 4-1 3 5-3 3v3l3 3-3 5-4-1-4 2-1 4h-6l-1-4-4-2-4 1-3-5 3-3v-3l-3-3 3-5 4 1 4-2z"/><circle cx="16" cy="16" r="4"/></svg>','Settings']
      ];
      for (const [icon, label] of dockItems) {
        const item = util.el('a', `rm-dock-item${label === 'Bill Pay' ? ' current' : ''}`, dock);
        item.href = '#'; item.dataset.role = 'nav';
        const glyph = util.el('span', 'rm-dock-icon', item);
        glyph.innerHTML = icon;
        util.el('span', '', item, label);
        item.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what:'nav', label }); });
      }
      S.frameSidebar(_c, body);
      Object.assign(_c, { add, body, dock, dockItems, payees, ph, recordData, recordIcons, records, search });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      const paymentTitle = util.el('div', 'rm-payment-title', stage, 'Make a Payment');
      paymentTitle.setAttribute('aria-hidden', 'true');
      S.frameAlign(_c, stage);
      Object.assign(_c, { paymentTitle, stage });
    },
  };

  env.site({
    name: 'design-use-bank-paybill-01',
    template: 'site/base',
    design: { parts },
  });
})();
