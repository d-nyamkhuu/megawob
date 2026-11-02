// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    overlay: (base, S) => function (ctx) {
      const result = base(ctx);
      if (ctx.kind === 'banner') {
        const header = document.querySelector('.ref-task');
        result.el.style.top = (header ? header.getBoundingClientRect().bottom : 0) + 'px';
      }
      return result;
    },
    'frame.header': (base, S) => function (_c) {
      const { display, lr, nav, rng, util, word } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      if (display !== 'header' || nav) {
        const title = rng.pick(TITLES);
        const brandLabel = word ? word(lr.pick(K.brand)) : title;
        const brand = util.el('div', 'ref-brand', header, 'Rivermark Bank');
        brand.dataset.originalLabel = brandLabel;
        brand.dataset.role = 'brand';
      } else {
        const brand = util.el('div', 'ref-brand', header, 'Rivermark Bank');
        brand.dataset.role = 'brand';
      }
      const utilities = util.el('div', 'bank-utilities', header);
      for (const text of ['Messages (2)', 'Profile', 'Help', 'Sign Out']) {
        const link = util.el('a', '', utilities, text); link.href = '#';
        link.addEventListener('click', e => { e.preventDefault(); env.log('decoy', {what:'utility', label:text}); });
      }
      Object.assign(_c, { header });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const tabs = util.el('nav', 'bank-tabs', body);
      for (const label of ['Accounts', 'Bill Pay', 'Transfers', 'Cards', 'Statements', 'Tools & Settings']) {
        const item = util.el('a', `bank-tab${label === 'Bill Pay' ? ' current' : ''}`, tabs, label);
        item.href = '#'; item.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what:'nav', label }); });
      }
      const summary = util.el('section', 'bank-summary', body);
      const accounts = util.el('div', 'summary-card accounts-card', summary);
      util.el('strong', 'summary-heading', accounts, 'Account Summary');
      for (const [name, amount] of [['Everyday checking •5262', '$3,942.18'], ['Regular savings •2874', '$12,630.50'], ['Rewards credit card •1253', '$1,208.17'], ['Home loan •8641', '$178,521.32']]) {
        const row = util.el('div', 'summary-row', accounts); util.el('span', '', row, name); util.el('span', '', row, amount);
      }
      const activity = util.el('div', 'summary-card activity-card', summary);
      const ah = util.el('div', 'summary-heading activity-heading', activity);
      util.el('strong', '', ah, 'Recent Activity — Everyday checking •5262');
      util.el('a', '', ah, 'View All');
      const table = util.el('div', 'activity-table', activity);
      for (const vals of [['Date','Description','Amount','Balance'],['Mar 10, 2013','Riverside Market','-$48.27','$3,942.18'],['Mar 8, 2013','Greenleaf Utilities','-$120.00','$3,990.45'],['Mar 6, 2013','Paycheck Deposit','$1,250.00','$4,110.45'],['Mar 4, 2013','Maple Grove Pharmacy','-$23.14','$2,860.45']]) {
        const row = util.el('div', `activity-row${vals[0] === 'Date' ? ' column-head' : ''}`, table);
        vals.forEach(v => util.el('span', '', row, v));
      }
      const paperless = util.el('aside', 'summary-card paperless-card', summary);
      const paperIcon = util.el('div', 'paper-icon', paperless);
      paperIcon.innerHTML = '<svg viewBox="0 0 64 88" aria-hidden="true"><path d="M5 3h42l14 14v67H5z" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linejoin="round"/><path d="M17 21h31M17 30h31" stroke="#7babc6" stroke-width="3"/><text x="15" y="69" fill="currentColor" font-family="Arial" font-weight="bold" font-size="38">$</text></svg>';
      util.el('strong', '', paperless, 'Go paperless');
      util.el('p', '', paperless, 'Get eBills and payment reminders for your bills.');
      util.el('a', '', paperless, 'Learn more  ›');
      const lower = util.el('div', 'bank-lower', body);
      const payees = util.el('aside', 'rm-payees', lower);
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
      const stage = util.el('main', 'ref-stage', document.querySelector('.bank-lower'));
      const paymentTitle = util.el('div', 'rm-payment-title', stage, 'Make a Payment');
      paymentTitle.setAttribute('aria-hidden', 'true');
      const panel = body.querySelector('.ref-panel');
      if (panel) {
        if (_c.W <= 1100) { panel.classList.add('bank-inline-note'); _c.header.append(panel); }
        else document.querySelector('.bank-lower').append(panel);
      }
      S.frameAlign(_c, stage);
      Object.assign(_c, { paymentTitle, stage });
    },
    'frame.toast': (base, S) => function (_c) {
      base(_c);
      const note = document.querySelector('.ref-note');
      if (note) { _c.header.append(note); _c.header.classList.add('has-bank-toast'); }
    },
  };

  env.site({
    name: 'design-use-bank-paybill-05',
    template: 'site/base',
    design: { parts },
  });
})();
