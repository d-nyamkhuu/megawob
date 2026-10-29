// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { display, nav, rng, util } = _c;
      const { TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      util.el('div', 'mail-header-title', header, 'Connect Pinecrest Credit Union Planner');
      if (display !== 'header' || nav) rng.pick(TITLES);
      const brand = util.el('div', 'ref-brand', header, 'Mail');
      brand.dataset.role = 'brand';
      Object.assign(_c, { brand, header });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const rail = util.el('nav', 'mail-rail', body);
      util.el('div', 'mail-mark', rail, '◕');
      for (const [glyph, label] of [
        ['<rect x="3" y="5" width="22" height="17" rx="2"/><path d="m4 7 10 8 10-8"/>','Mail'],
        ['<rect x="4" y="5" width="20" height="20" rx="2"/><path d="M9 3v5m10-5v5M4 11h20M8 15h3m3 0h3m-9 4h3m3 0h3"/>','Calendar'],
        ['<circle cx="10" cy="9" r="4"/><path d="M2 24c0-4 3-7 8-7s8 3 8 7M19 5a4 4 0 0 1 0 8m2 4c3 1 5 3 5 7"/>','People'],
        ['<path d="M6 3h11l6 6v16H6zM17 3v7h6M10 15h9m-9 4h9"/>','Files'],
        ['<rect x="3" y="5" width="22" height="18" rx="2"/><path d="M3 10h22m-17 8h6"/>','Payables'],
        ['<path d="M4 24V14h5v10zm8 0V4h5v20zm8 0V10h5v14z"/>','Reports'],
        ['<circle cx="14" cy="14" r="4"/><path d="m11 2-.7 3.1a10 10 0 0 0-2.2 1.3L5 5.5 2.5 10l2.3 2a9 9 0 0 0 0 2.6l-2.3 2L5 21l3.1-.9a10 10 0 0 0 2.2 1.3L11 24.5h6l.7-3.1a10 10 0 0 0 2.2-1.3l3.1.9 2.5-4.4-2.3-2a9 9 0 0 0 0-2.6l2.3-2L23 5.5l-3.1.9a10 10 0 0 0-2.2-1.3L17 2z"/>','Settings'],
      ]) {
        const item = util.el('div', `mail-rail-item${label === 'Mail' ? ' active' : ''}`, rail);
        const icon = util.el('span', 'mail-rail-icon', item);
        icon.innerHTML = `<svg viewBox="0 0 28 28" aria-hidden="true">${glyph}</svg>`;
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
      Object.assign(_c, { main, messageHead, sender, senderText, stage });
    },
  };

  env.site({
    name: 'design-avoid-phishing-oauth-01',
    template: 'site/base',
    design: { parts },
  });
})();
