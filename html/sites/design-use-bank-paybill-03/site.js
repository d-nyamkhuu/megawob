// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { lr, rng, util, word } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      {
        const title = rng.pick(TITLES);
        const brandLabel = word ? word(lr.pick(K.brand)) : title;
        const brand = util.el('div', 'ref-brand', header, 'Pinecrest Bank');
        brand.dataset.originalLabel = brandLabel;
        brand.dataset.role = 'brand';
      }
      Object.assign(_c, { header });
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
      }
      const bankNav = util.el('nav', 'ref-bank-nav', header);
      for (const [label, active] of [['Accounts', false], ['Pay & Transfer', true], ['Cards', false], ['Investments', false], ['Customer Service', false]]) {
        const a = util.el('a', `ref-bank-tab${active ? ' active' : ''}`, bankNav, label);
        a.href = '#';
        a.dataset.role = 'nav';
        a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label }); });
      }
      Object.assign(_c, { bankNav });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const payees = util.el('aside', 'rm-payees', body);
      const ph = util.el('div', 'rm-payees-head', payees);
      util.el('strong', '', ph, 'Bill Pay');
      const add = util.el('button', 'rm-add-payee', ph, '+  Add Payee');
      add.type = 'button';
      add.addEventListener('click', () => env.log('decoy', { what: 'add-payee' }));
      const search = util.el('input', 'rm-search', payees);
      search.type = 'search';
      search.placeholder = '⌕  Search payees';
      search.setAttribute('aria-label', 'Search payees');
      const records = util.el('div', 'rm-records', payees);
      const recordData = [
        ['group', 'Bill Pay'], ['', 'Pay a Bill', ''], ['', 'Add a Biller', ''], ['', 'Payment History', ''], ['', 'Manage Billers', ''],
        ['group', 'Transfers'], ['', 'Make a Transfer', ''], ['', 'Scheduled Transfers', ''],
        ['group', 'More'], ['', 'View eBills', ''], ['', 'Payment Settings', '']
      ];
      for (const [icon, label, suffix] of recordData) {
        if (icon === 'group') { util.el('div', 'rm-group', records, label); continue; }
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
      Object.assign(_c, { add, body, dock, payees, ph, recordData, records, search });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const tips = util.el('aside', 'pine-tips', body);
      util.el('strong', '', tips, '💡  Quick Tips');
      util.el('div', 'pine-tip', tips, 'Use a checking account to pay most bills.');
      util.el('div', 'pine-tip', tips, 'Find your biller faster by using the official name from your statement.');
      util.el('div', 'pine-tip', tips, 'Payments made before 5:00 PM ET are typically processed the same day.');
      Object.assign(_c, { stage, tips });
    },
  };

  env.site({
    name: 'design-use-bank-paybill-03',
    template: 'site/base',
    design: { parts },
  });
})();
