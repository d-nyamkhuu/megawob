// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { display, nav, rng, util } = _c;
      const { TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      if (display !== 'header' || nav) rng.pick(TITLES);
      const brand = util.el('div', 'ref-brand', header, 'Fernhill Rx');
      brand.dataset.role = 'brand';
      util.el('span', 'ref-support', header, 'Pharmacy Services Portal');
      util.el('span', 'ref-userline', header, 'Welcome, Morgan Lee　 |　 Staff ID: FL3487　 |　 Tuesday, Apr 27, 1999');
      Object.assign(_c, { brand, header });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const left = util.el('aside', 'ref-leftpanel', body);
      util.el('h2', '', left, 'Member Services');
      for (const item of ['Patient Check-In', 'Prescriptions', 'Insurance Lookup', 'Claims', 'Reports', 'Resources']) {
        const a = util.el('a', 'ref-sidelink', left, `▸　${item}`);
        a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label: item }); });
      }
      util.el('h2', 'ref-left-subhead', left, 'Today at Fernhill Rx');
      const counts = util.el('div', 'ref-counts', left);
      for (const [k,v] of [['Check-ins','12'],['Prescriptions','28'],['Pending Claims','6'],['Messages','3']]) {
        const row = util.el('div', 'ref-count-row', counts); util.el('span','',row,k); util.el('b','',row,v);
      }
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, counts, left });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const inspector = util.el('aside', 'ref-inspector', body);
      util.el('h2', '', inspector, 'Upcoming Appointments');
      const appts = util.el('div', 'ref-appts', inspector);
      const apptHead = util.el('div','ref-appt-row ref-table-head',appts);
      ['Time','Patient','Type'].forEach((x)=>util.el('span','',apptHead,x));
      for (const row of [['9:00 AM','Daniel Kim','Refill'],['10:30 AM','Morgan Lee','Check-In'],['1:00 PM','Priya Shah','Consult'],['2:30 PM','Carlos Mendez','Check-In'],['4:00 PM','Ellen Park','Follow-Up']]) {
        const item = util.el('div','ref-appt-row',appts); row.forEach((x)=>util.el('span','',item,x));
      }
      util.el('h2', 'ref-related-title', inspector, 'Recent Messages');
      const msgs = util.el('div','ref-messages',inspector);
      const msgHead = util.el('div','ref-message-row ref-table-head',msgs);
      ['From','Subject','Date'].forEach((x)=>util.el('span','',msgHead,x));
      for (const row of [['Clinic Admin','Schedule Update','Apr 27'],['Insurance Dept','Claim #77392','Apr 26'],['Dr. Patel','New Referral','Apr 26']]) {
        const item = util.el('div','ref-message-row',msgs); row.forEach((x)=>util.el('span','',item,x));
      }
      /* Keep the original detail data in the DOM for the existing frame structure. */
      const details = [
        ['Ticket #', 'TM-48291'], ['Subject', 'Unable to make calls'], ['Status', 'Open'],
        ['Created', 'Apr 16, 2022, 9:14 AM'], ['Last update', 'Apr 16, 2022, 10:24 AM'],
        ['Category', 'Calls & network'], ['Device', 'Pixel 6'], ['Phone number', '+1 555-0199'],
        ['Plan', 'Thistle Mobile Unlimited'],
      ];
      const detailList = util.el('dl', 'ref-detail-list', inspector);
      for (const [key, value] of details) {
        util.el('dt', '', detailList, key);
        const dd = util.el('dd', '', detailList, value);
        if (key === 'Status') dd.classList.add('ref-status');
      }
      util.el('h2', 'ref-related-title', inspector, 'Related articles');
      const articles = util.el('div', 'ref-articles', inspector);
      for (const title of ['Fix call and network issues', 'Check your mobile data settings', 'Reset network settings', 'Contact support']) {
        util.el('div', 'ref-article', articles, title);
      }
      Object.assign(_c, { apptHead, appts, articles, detailList, details, inspector, msgHead, msgs, stage });
    },
    'frame.footer': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, label, lr, placement, rng, util, wantFooter, word } = _c;
      let { submit } = _c;
      if (wantFooter) {
        const foot = util.el('footer', 'ref-foot', document.body);
        const footText = rng.pick(['© 2024 Example Co.', 'All changes are saved automatically.',
          'Need help? Contact your administrator.', 'v4.2.1 · Status: all systems normal']);
        util.el('span', 'ref-foot-text', foot, word ? lr.pick([`© 2024 Example Co. ${word('footRights')}`,
          word('footSaved'), word('footHelp'), `v4.2.1 · ${word('footStatus')}`]) : footText);
        const tools = util.el('div', 'ref-tools', foot);
        if (decoys.length > 1) decoyBtn(tools, decoys[1]);
        if (collide && collide.where === 'footer') decoyBtn(tools, collide.text, true);
        if (placement === 'footer') submit = endBtn(tools, 'ref-submit', label);
        if (placement === 'link') submit = endBtn(tools, 'ref-endlink', `${label} ›`);
      }
      const dock = util.el('nav','ref-bottomdock',document.body);
      for (const [icon,label] of [['⌂','Home'],['♟','Patients'],['▤','Prescriptions'],['⬟','Insurance'],['▥','Reports'],['▣','Resources'],['?','Help']]) {
        const item=util.el('a','ref-dockitem',dock,`${icon}　${label}`); item.href='#';
        item.addEventListener('click',(e)=>{e.preventDefault();env.log('decoy',{what:'nav',label});});
      }
      Object.assign(_c, { dock, submit });
    },
  };

  env.site({
    name: 'design-protect-privacy-permissions-03',
    template: 'site/base',
    design: { parts },
  });
})();
