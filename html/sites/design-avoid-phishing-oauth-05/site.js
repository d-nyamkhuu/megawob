// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { display, ctx, util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const brand = util.el('div', 'riv-brand', header);
      brand.innerHTML = '<svg viewBox="0 0 48 48" aria-hidden="true"><path fill="#9bd8ff" d="M4 4h20l20 20-20 20H4l20-20z"/><path fill="#0b4d91" d="M4 4h12l20 20-12 20H4l20-20z"/></svg><i>Rivet</i>';
      brand.dataset.role = 'brand';
      const nav = util.el('nav', 'riv-nav', header);
      const navIcons = {
        Mail: '<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="3" y="6" width="26" height="21" fill="#fff" stroke="#0b315d" stroke-width="2"/><path d="M4 8 16 18 28 8" fill="none" stroke="#0b315d" stroke-width="2"/></svg>',
        Calendar: '<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="4" y="5" width="24" height="24" rx="2" fill="#fff" stroke="#0b315d" stroke-width="2"/><path d="M4 12h24M10 3v7M22 3v7" fill="none" stroke="#0b315d" stroke-width="2"/><text x="9" y="25" font-size="12" fill="#0b315d" font-weight="bold">31</text></svg>',
        Documents: '<svg viewBox="0 0 32 32" aria-hidden="true"><path fill="#f8c12a" stroke="#d88d00" d="M2 8h11l3 4h14v15H2z"/><path fill="#ffd95d" d="M3 15h27l-3 11H2z"/></svg>',
        'Accounts Payable': '<svg viewBox="0 0 32 32" aria-hidden="true"><g fill="#ffbf21" stroke="#a56a00"><ellipse cx="18" cy="7" rx="9" ry="3"/><path d="M9 7v14c0 4 18 4 18 0V7"/><path d="M9 12c0 4 18 4 18 0M9 17c0 4 18 4 18 0" fill="none"/></g></svg>',
        Settings: '<svg viewBox="0 0 32 32" aria-hidden="true"><path fill="#0b4d91" d="M13 2h6l1 4 3 1 4-2 4 5-3 3 1 3 3 2-2 6-4-1-3 2-1 5h-7l-1-5-3-1-4 2-4-5 3-3-1-3-3-2 2-6 4 1 3-2z"/><circle cx="16" cy="16" r="5" fill="#a7d8f6"/></svg>'
      };
      for (const [label, active] of [['Mail',false],['Calendar',false],['Documents',false],['Accounts Payable',false],['Settings',true]]) {
        const tab = util.el('div', `riv-tab${active ? ' active' : ''}`, nav);
        const icon = util.el('span', 'riv-tab-icon', tab);
        icon.innerHTML = navIcons[label];
        util.el('span', '', tab, label);
      }
      const search = util.el('div', 'riv-search', header, 'Search　⌕');
      if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
      Object.assign(_c, { brand, header, nav: false, search });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body riv-body', document.body);
      const side = util.el('aside', 'riv-inspector', body);
      const account = util.el('section', 'riv-account-box', side);
      util.el('h2', '', account, 'Accounts & Connections');
      for (const [icon, label, active] of [['♟','My Account',false],['✣','Connected Apps',true],['✉','Email Accounts',false],['▦','Calendar Accounts',false],['▤','Document Services',false],['●','Chat Services',false],['▰','Payment Methods',false],['▱','Offline Access',false]]) {
        const row = util.el('div', `riv-account-row${active ? ' active' : ''}`, account);
        util.el('span', 'riv-account-icon', row, icon);
        util.el('span', '', row, label);
      }
      const details = util.el('section', 'riv-details', side);
      util.el('h2', '', details, 'Details');
      const summary = util.el('div', 'riv-detail-summary', details);
      const miniLogo = util.el('div', 'riv-mini-logo', summary);
      miniLogo.innerHTML = '<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="17" y="23" width="66" height="60" rx="9" fill="#fff"/><path fill="#ef321e" d="M17 33q0-10 10-10h46q10 0 10 10v10H17z"/><path fill="#a9a9a9" d="M27 50h9v9h-9zm18 0h9v9h-9zm18 0h9v9h-9zM27 64h9v9h-9zm18 0h9v9h-9zm18 0h9v9h-9z"/></svg>';
      const summaryText = util.el('div', '', summary);
      util.el('strong', '', summaryText, 'Rivet HR Planner');
      util.el('span', '', summaryText, 'Calendar');
      util.el('span', '', summaryText, 'by Rivet Systems');
      for (const [label, value] of [['Category','Productivity'],['Website','www.rivet.com/hrplanner'],['Support','support@rivet.com'],['Privacy Policy','www.rivet.com/privacy'],['Version','1.2.0']]) {
        const row = util.el('div', 'riv-detail-row', details);
        util.el('span', '', row, label);
        util.el('span', label === 'Version' ? '' : 'link', row, value);
      }
      const filler = S.frameSidebar(_c, body);
      if (filler) filler.classList.add('riv-template-side');
      Object.assign(_c, { body, side, details });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const main = util.el('main', 'riv-main', body);
      util.el('div', 'riv-main-title', main, 'Connect a New App');
      const stage = util.el('section', 'ref-stage', main);
      S.frameAlign(_c, stage);
      Object.assign(_c, { main, stage });
    },
  };

  env.site({
    name: 'design-avoid-phishing-oauth-05',
    template: 'site/base',
    design: { parts },
  });
})();
