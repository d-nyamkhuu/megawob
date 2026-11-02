// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { display, nav, rng, util } = _c;
      const { TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      util.el('div', 'mail-header-title', header, 'Online Accounts');
      if (display !== 'header' || nav) rng.pick(TITLES);
      const brand = util.el('div', 'ref-brand', header, '🔑');
      brand.dataset.role = 'brand';
      Object.assign(_c, { brand, header });
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
        ['Pinecrest Credit Union','9:14 AM','Connect Pinecrest Credit…',true],['Accounts Payable','8:37 AM','Invoice for review…'],
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
      const { body, util } = _c;
      const main = util.el('main', 'mail-main', body);
      const messageHead = util.el('div', 'mail-message-head', main);
      util.el('div', 'mail-message-title', messageHead, 'Connect Pinecrest Credit Union Planner');
      const sender = util.el('div', 'mail-sender-line', main);
      util.el('span', 'mail-sender-avatar', sender, '➤');
      const senderText = util.el('div', 'mail-sender-text', sender);
      util.el('strong', '', senderText, 'Pinecrest Credit Union');
      util.el('span', '', senderText, 'to me  ⌄');
      util.el('span', 'mail-sender-time', sender, '9:14 AM');
      const stage = util.el('section', 'ref-stage', main);
      S.frameAlign(_c, stage);
      const inspector = util.el('aside', 'account-inspector', body);
      util.el('h2', '', inspector, 'Details');
      const app = util.el('div', 'inspector-app', inspector);
      util.el('div', 'inspector-app-icon', app, '▦');
      const apptext = util.el('div', '', app);
      util.el('strong', '', apptext, 'Umbra Storage Planner');
      util.el('span', '', apptext, 'By Umbra Technologies');
      util.el('a', '', apptext, 'https://www.umbra.com');
      util.el('p', 'inspector-description', inspector, 'A simple space planning tool that helps you organize your storage and schedule facility visits.');
      for (const [label, value] of [['Version','1.2.0'],['Access type','OAuth 2.0'],['Website','https://www.umbra.com'],['Privacy policy','https://www.umbra.com/privacy'],['Terms of service','https://www.umbra.com/terms']]) {
        const row = util.el('div', 'inspector-row', inspector);
        util.el('strong', '', row, label);
        util.el(label === 'Website' || label === 'Privacy policy' || label === 'Terms of service' ? 'a' : 'span', '', row, value);
      }
      Object.assign(_c, { app, apptext, inspector, main, messageHead, sender, senderText, stage });
    },
  };

  env.site({
    name: 'design-avoid-phishing-oauth-04',
    template: 'site/base',
    design: { parts },
  });
})();
