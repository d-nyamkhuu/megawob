// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { display, util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      header.classList.toggle('gov-has-instruction', display === 'header');
      S.frameBrand(_c, header);
      Object.assign(_c, { header });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const menu = util.el('nav', 'gov-menu', document.body);
      for (const item of ['File', 'Edit', 'View', 'Records', 'Tools', 'Help']) util.el('span', '', menu, item);
      const toolbar = util.el('div', 'gov-toolbar', document.body);
      for (const [icon, label] of [['⌂','Home'], ['▤','New'], ['📂','Open'], ['▣','Print'], ['⌕','Find'], ['↕','A–Z Sort']]) {
        const item = util.el('div', 'gov-tool', toolbar);
        util.el('span', 'gov-tool-icon', item, icon);
        util.el('span', '', item, label);
      }
      document.body.insertBefore(menu, body);
      document.body.insertBefore(toolbar, body);
      const appNav = util.el('aside', 'gov-appnav', body);
      util.el('h3', '', appNav, 'Applications');
      for (const [icon, label] of [['▤','Civic Support'],['⌂','Housing Assistance'],['▥','Council Tax Support'],['♿','Disability Support'],['♟','Childcare Support'],['▱','My Records'],['✉','Correspondence'],['▧','Evidence'],['▤','Saved Drafts']]) {
        const item = util.el('div', 'gov-navitem', appNav);
        util.el('span', 'gov-navicon', item, icon);
        util.el('span', '', item, label);
      }
      S.frameSidebar(_c, body);
      Object.assign(_c, { appNav, body, menu, toolbar });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const help = util.el('aside', 'gov-help', body);
      util.el('h3', '', help, 'Help and Information');
      const guidance = util.el('section', 'gov-helpbox', help);
      util.el('h4', '', guidance, '▾  Field format guidance');
      util.el('p', '', guidance, 'Identity number\nEnter 2 letters followed by 6 numbers.\nExample: AB123456');
      util.el('p', '', guidance, 'Date of application\nEnter the date in DD/MM/YYYY format.\nExample: 27/04/2025');
      util.el('p', '', guidance, 'Postcode\nEnter a valid UK postcode, for example GL7 2PL.');
      const about = util.el('section', 'gov-helpbox', help);
      util.el('h4', '', about, '▾  About Civic Support');
      util.el('p', '', about, 'Civic Support helps with the cost of essential living expenses for eligible residents. Your details must match our records and meet all of the eligibility requirements.');
      util.el('a', '', about, 'Read more about eligibility →');
      const contact = util.el('section', 'gov-helpbox', help);
      util.el('h4', '', contact, '▾  Need help?');
      util.el('p', '', contact, 'If you need help with your application contact the Civic Support Team.\nPhone: 01234 567890\nMon – Fri, 9am – 5pm');
      util.el('a', '', contact, 'Email us →');
      Object.assign(_c, { about, contact, guidance, help, stage });
    },
  };

  env.site({
    name: 'design-use-gov-portal-strict-04',
    template: 'site/base',
    design: { parts },
  });
})();
