// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      // Acme CRM's compact Lightning-era global bar.
      const crmBrand = util.el('div', 'crm-brand', header);
      util.el('span', 'crm-cloud', crmBrand, '▣');
      util.el('strong', '', crmBrand, 'Account Center');
      const search = util.el('div', 'crm-search', header, 'Search accounts, contacts, and more…');
      util.el('span', 'crm-search-icon', search, '⌕');
      S.frameBrand(_c, header);
      Object.assign(_c, { crmBrand, header, search });
    },
    'frame.tools': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, header, label, placement, util, wantFooter } = _c;
      let submit = null;
      const headerTools = util.el('div', 'ref-tools', header);
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      const winControls = util.el('div', 'win-controls', header);
      for (const glyph of ['−', '□', '×']) util.el('span', 'win-control', winControls, glyph);
      const menu = util.el('div', 'win-menu', document.body);
      for (const item of ['File', 'Edit', 'View', 'Go', 'Tools', 'Help']) util.el('span', '', menu, item);
      const banner = util.el('div', 'win-banner', document.body);
      util.el('span', 'win-globe', banner);
      const bannerText = util.el('div', 'win-banner-text', banner);
      util.el('strong', '', bannerText, 'Account Center');
      util.el('span', '', bannerText, 'Manage your online accounts and preferences.');
      Object.assign(_c, { banner, bannerText, headerTools, menu, submit, winControls });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const rail = util.el('aside', 'ref-side win-rail', body);
      for (const [icon, item] of [['⌂','Home'],['▤','Accounts'],['✉','Mail'],['▣','Contacts'],['🌐','Web'],['▱','Documents'],['⚙','Settings']]) {
        const a = util.el('a', `ref-sidelink${item === 'Accounts' ? ' selected' : ''}`, rail);
        a.href = '#'; a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what:'sidebar', label:item }); });
        util.el('span', 'win-rail-icon', a, icon);
        util.el('span', '', a, item);
      }
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, rail });
    },
    'frame.stage': (base) => function (_c) {
      base(_c);
      const { body, util } = _c;
      const tips = util.el('aside', 'win-tips', body);
      util.el('h2', 'win-tips-title', tips, 'Tips & Information');
      const content = util.el('div', 'win-tips-content', tips);
      util.el('p', '', content, 'ⓘ  Creating an Account');
      const list = util.el('ul', '', content);
      for (const text of [
        'Enter the required information from your profile card.',
        'Only provide information that is needed for the account.',
        'Keep your personal information private.',
        'If a field asks for sensitive details you do not want to share, it is OK to leave it blank.',
      ]) util.el('li', '', list, text);
    },
  };

  env.site({
    name: 'design-protect-privacy-wrongfield-04',
    template: 'site/base',
    design: { parts },
  });
})();
