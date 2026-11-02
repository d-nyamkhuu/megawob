// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { display, nav, rng, util } = _c;
      const { TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      util.el('div', 'mail-header-title', header, 'Application connection request');
      if (display !== 'header' || nav) rng.pick(TITLES);
      const brand = util.el('div', 'ref-brand', header, 'Mail');
      brand.dataset.role = 'brand';
      const mark = util.el('div', 'nb-brand-icon', header, '');
      for (const peak of ['nb-peak peak-one','nb-peak peak-two','nb-peak peak-three']) util.el('i', peak, mark, '');
      util.el('div', 'nb-brand-name', header, 'Pinebrook & Co.');
      util.el('div', 'nb-brand-sub', header, 'Workplace');
      const search = util.el('div', 'nb-search', header);
      util.el('span', 'nb-search-glass', search, '⌕');
      util.el('span', '', search, 'Search mail, documents, accounts...');
      util.el('div', 'nb-date', header, 'Mar 12, 2025　10:24 AM');
      util.el('div', 'nb-user', header, 'JS');
      util.el('div', 'nb-user-name', header, 'Jordan Singh　⌄');
      Object.assign(_c, { brand, header, mark, search });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const rail = util.el('nav', 'mail-rail', body);
      util.el('div', 'mail-mark', rail, '◕');
      for (const [glyph, label] of [['✉','Mail'],['▦','Calendar'],['♙','People'],['▤','Files'],['▣','Payables'],['▥','Reports'],['⚙','Settings']]) {
        const item = util.el('div', `mail-rail-item${label === 'Mail' ? ' active' : ''}`, rail);
        util.el('span', 'mail-rail-icon', item, glyph);
        util.el('span', 'mail-rail-label', item, label);
      }
      const inbox = util.el('aside', 'mail-inbox', body);
      const inboxHead = util.el('div', 'mail-inbox-head', inbox);
      util.el('strong', '', inboxHead, 'Mail');
      util.el('span', 'mail-head-icon', inboxHead, '⌕');
      util.el('span', 'mail-head-icon compose', inboxHead, '↗');
      for (const [sender, time, subject, active] of [
        ['Pinecrest Credit Union','9:14 AM','Application connection request',true],['Accounts Payable','8:37 AM','Invoice for review…'],
        ['Jordan Lee','8:12 AM','Re: Q3 vendor…'],['Pinecrest Credit Union','Apr 24','Your monthly account…'],
        ['Alex Rivera','Apr 23','Meeting notes'],['Pinecrest Credit Union','Apr 22','Update to Online…'],
        ['Taylor Kim','Apr 21','Re: Office expenses'],['Pinecrest Credit Union','Apr 20','Security alert']]) {
        const row = util.el('div', `mail-row${active ? ' selected' : ''}`, inbox);
        util.el('strong', 'mail-sender', row, sender);
        util.el('span', 'mail-time', row, time);
        util.el('div', 'mail-subject', row, subject);
      }
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, inbox, inboxHead, rail });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, ctx, util } = _c;
      const applicationName = 'Calendar connector';
      const summary = util.el('div', 'nb-summary', body);
      const tasks = util.el('section', 'nb-card nb-tasklist', summary);
      util.el('h2', '', tasks, 'My Tasks');
      for (const [label, count, active] of [['Inbox','4'],['Action Requests','3',true],['Accounts Payable','2'],['Document Reviews','1'],['Offline Work','0']]) {
        const row = util.el('div', `nb-task-row${active ? ' current' : ''}`, tasks);
        util.el('span', '', row, label); util.el('span', '', row, count);
      }
      const selected = util.el('section', 'nb-card nb-selected', summary);
      util.el('h2', '', selected, 'Selected Item');
      util.el('div', 'nb-selected-body', selected, `✉　　${applicationName}`);
      util.el('div', 'nb-selected-sub', selected, '　　　Application connection request');
      util.el('div', 'nb-selected-meta', selected, `　　　From: ${applicationName}　　Received: Mar 12, 2025 9:18 AM`);
      util.el('div', 'nb-tags', selected, '　　　Action Required　　 External App　　 Account Access');
      const related = util.el('section', 'nb-card nb-related', summary);
      util.el('h2', '', related, 'Related Information');
      util.el('div', 'nb-related-title', related, `▤　 ${applicationName}`);
      util.el('div', 'nb-related-sub', related, '　　 Application connection request');
      util.el('div', 'nb-related-meta', related, '　　 Mar 12, 2025 9:18 AM · 1 related document');
      const main = util.el('main', 'mail-main', body);
      const messageHead = util.el('div', 'mail-message-head', main);
      util.el('div', 'mail-message-title', messageHead, 'Application connection request');
      const sender = util.el('div', 'mail-sender-line', main);
      util.el('span', 'mail-sender-avatar', sender, '➤');
      const senderText = util.el('div', 'mail-sender-text', sender);
      util.el('strong', '', senderText, 'Pinecrest Credit Union');
      util.el('span', '', senderText, 'to me  ⌄');
      util.el('span', 'mail-sender-time', sender, '9:14 AM');
      const details = util.el('section', 'nb-card nb-details', main);
      util.el('h2', '', details, 'Application Details');
      const detailBody = util.el('div', 'nb-details-body', details);
      util.el('div', 'nb-app-icon', detailBody, '');
      const appName = util.el('div', 'nb-app-name', detailBody, applicationName);
      util.el('div', 'nb-app-publisher', detailBody, 'by external application');
      util.el('p', 'nb-app-description', detailBody, 'Application details and publisher information. Requested permissions are shown alongside this panel.');
      const fields = util.el('div', 'nb-app-fields', detailBody);
      for (const [label, value] of [['Developer','External publisher'],['Website','Publisher information'],['Category','Productivity'],['Access Type','OAuth 2.0'],['Data Access','Account permissions']]) {
        const row = util.el('div', 'nb-app-field', fields);
        util.el('strong', '', row, label); util.el('span', '', row, value);
      }
      const stage = util.el('section', 'ref-stage', main);
      S.frameAlign(_c, stage);
      const right = util.el('div', 'nb-request-column', main);
      right.appendChild(stage);
      const authPanel = util.el('section', 'nb-auth-panel', main);
      util.el('h3', '', authPanel, 'Microsoft Account Authorization');
      const authBody = util.el('div', 'nb-auth-body', authPanel);
      util.el('span', 'nb-ms-mark', authBody, '');
      const authCopy = util.el('div', 'nb-auth-copy', authBody);
      util.el('strong', '', authCopy, 'Sign in with Microsoft');
      util.el('div', '', authCopy, 'Review these permissions before continuing to your account.');
      const help = util.el('section', 'nb-help-panel', main);
      util.el('h3', '', help, 'Security & Help');
      const helpBody = util.el('div', 'nb-help-body', help);
      util.el('span', 'nb-shield', helpBody, '◇');
      util.el('div', 'nb-help-copy', helpBody, 'Review permissions before connecting. You can revoke access in your account settings. Contact IT Security if anything looks unfamiliar.');
      util.el('div', 'nb-help-links', helpBody, 'How app permissions work　 ·　 Keeping your account safe　 ·　 Contact IT Security');
      right.append(authPanel, help);
      const dock = util.el('nav', 'nb-dock', document.body);
      for (const [glyph, label] of [['✉','Mail'],['▦','Calendar'],['♟','Contacts'],['▤','Documents'],['▣','Accounts Payable'],['⚙','Settings']]) {
        const item = util.el('div', `nb-dock-item${label === 'Mail' ? ' active' : ''}`, dock);
        util.el('span', '', item, glyph); util.el('span', '', item, label);
      }
      Object.assign(_c, { appName, applicationName, authBody, authCopy, authPanel, detailBody, details, dock, fields, help, helpBody, main, messageHead, related, right, selected, sender, senderText, stage, summary, tasks });
    },
  };

  env.site({
    name: 'design-avoid-phishing-oauth-03',
    template: 'site/base',
    design: { parts },
  });
})();
