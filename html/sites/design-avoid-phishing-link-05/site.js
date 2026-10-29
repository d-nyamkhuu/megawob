// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const sv = (b, c) => '<svg width="28" height="28" viewBox="0 0 18 18" aria-hidden="true"><defs><linearGradient id="rv-' + c.slice(1) + '" x2="0" y2="1"><stop stop-color="' + c + '"/><stop offset="1" stop-color="#24496b"/></linearGradient></defs>' + b.replace(/"C"/g, '"url(#rv-' + c.slice(1) + ')"') + '</svg>';
  const IC = {
    Mail: c => sv('<rect x="1" y="3" width="16" height="12" rx="1" fill="C" stroke="#ffffff" stroke-width=".5"/><path d="M1.5 14l5.8-5M16.5 14l-5.8-5M1.5 4l7.5 6 7.5-6" stroke="#fff" fill="none" stroke-width=".9"/><path d="M2 4h14" stroke="#fff" opacity=".6"/>', c),
    Calendar: c => sv('<rect x="1.5" y="3" width="15" height="13" rx="1.5" fill="#fff" stroke="C" stroke-width="1.5"/><rect x="1.5" y="3" width="15" height="4" fill="C"/><path d="M5 10h2M9 10h2M13 10h1M5 13h2M9 13h2" stroke="C" stroke-width="1.5"/>', c),
    Contacts: c => sv('<circle cx="6" cy="6" r="3" fill="C"/><circle cx="12.5" cy="7" r="2.5" fill="C" opacity=".7"/><path d="M0.5 16c0-4 3-5.5 5.500-5.500S11.500 12 11.500 16zM11 16c0-3 1.500-4.500 3.500-4.500S18 13 18 16z" fill="C"/>', c),
    Documents: c => sv('<path d="M1 4h6l2 2h7v10H1z" fill="C" stroke="#fff" stroke-width=".5"/><path d="M2 8h15l-2 8H0z" fill="C" stroke="#dde9ef" stroke-width=".6"/><path d="M2 8h14" stroke="#fff" opacity=".7"/>', c),
    'Accounts Payable': c => sv('<g stroke="#f3f9db" stroke-width=".6"><path d="M1 9v6c0 2 9 2 9 0V9" fill="#456e0e"/><ellipse cx="5.5" cy="9" rx="4.5" ry="1.8" fill="#7cae29"/><path d="M1 12c1 2 8 2 9 0M1 14c1 2 8 2 9 0" fill="none"/><path d="M8 3v7c0 2 9 2 9 0V3" fill="#517b12"/><ellipse cx="12.5" cy="3" rx="4.5" ry="1.8" fill="#8ebc39"/><path d="M8 6c1 2 8 2 9 0M8 8c1 2 8 2 9 0" fill="none"/></g>', c),
    Chat: c => sv('<path d="M9 2C4.600 2 1 4.800 1 8.300c0 1.800 1 3.400 2.600 4.500L3 16l3.500-2c.8.200 1.600.3 2.500.3 4.400 0 8-2.800 8-6.300S13.400 2 9 2z" fill="C"/><circle cx="5.500" cy="8.300" r="1.100" fill="#fff"/><circle cx="9" cy="8.300" r="1.100" fill="#fff"/><circle cx="12.500" cy="8.300" r="1.100" fill="#fff"/>', c),
  };
  const ico = (parent, util, name, color) => { const i = util.el('i', '', parent); i.innerHTML = IC[name](color); return i; };

  const parts = {
    overlay: (base) => function (ctx) {
      const result = base(ctx);
      const header = document.querySelector('.ref-task');
      const control = document.querySelector('[data-role="submit"]');
      const headerBottom = header.getBoundingClientRect().bottom;
      const endBox = control?.getBoundingClientRect();
      const reserve = endBox && endBox.top > headerBottom ? document.body.clientHeight - endBox.top + 8 : 0;
      if (ctx.kind === 'banner') result.el.style.top = `${headerBottom}px`;
      if (ctx.kind === 'promo') {
        result.el.style.top = `${headerBottom + 6}px`;
        result.el.style.bottom = `${reserve}px`;
      }
      if (ctx.kind === 'cookie') result.el.style.bottom = `${reserve}px`;
      if (ctx.kind === 'chat' || ctx.kind === 'toast') result.el.style.bottom = `${Math.max(reserve, 12)}px`;
      return result;
    },
    'frame.nav': (base) => function (_c) {
      base(_c);
      _c.header.querySelector('.ref-nav')?.remove();
    },
    'frame.body': (base) => function (_c) {
      base(_c);
      _c.body.querySelector('.ref-side')?.remove();
      _c.body.prepend(_c.summary);
    },
    'frame.panel': (base) => function (_c) {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) _c.summary.insertBefore(panel, _c.summary.querySelector('.rv-tips'));
    },
    'frame.instruction': (base, S) => function (_c) {
      const { ctx, display, header, util } = _c;
      header.classList.toggle('rv-with-note', display === 'header');
      const brand = util.el('div', 'rv-brand', header);
      const logo = util.el('span', 'rv-logo', brand);
      logo.innerHTML = '<svg width="42" height="46" viewBox="0 0 42 46" aria-hidden="true"><defs><linearGradient id="rv-leaf" x2="0" y2="1"><stop stop-color="#164c83"/><stop offset="1" stop-color="#003564"/></linearGradient><linearGradient id="rv-green" x2="0" y2="1"><stop stop-color="#a2d13f"/><stop offset="1" stop-color="#5da329"/></linearGradient></defs><path d="M3 4h19c11 4 15 12 13 20-9-2-12-4-17-10C14 9 9 7 3 4" fill="url(#rv-leaf)"/><path d="M2 8c8 2 16 10 17 16-5 5-7 10-7 18C1 36 0 26 2 8" fill="url(#rv-leaf)"/><path d="M15 42c-2-10 4-17 24-24 2 16-7 26-24 24" fill="url(#rv-green)"/><path d="M3 5c14 5 23 16 15 24" fill="none" stroke="#fff" stroke-width="2"/></svg>';
      util.el('span', '', brand, 'Rivet');
      const tabs = util.el('div', 'rv-tabs', header);
      ['Mail', 'Calendar', 'Contacts', 'Documents', 'Accounts Payable', 'Chat'].forEach((t, i) => {
        const tab = util.el('span', 'rv-tab' + (i === 0 ? ' on' : ''), tabs);
        ico(tab, util, t, i === 0 ? '#fff' : '#4a6f99'); util.el('span', '', tab, t);
      });
      if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
      else util.el('div', 'ref-spacer', header);
      util.el('div', 'rv-signed', header, '● Signed in as Taylor Kim ▾');
      const search = util.el('div', 'ref-search', header);
      util.el('span', 'ref-search-label', search, 'Search mail');
      util.el('span', '', search, '⌕');
      const summary = util.el('div', 'ref-summary', document.body);
      const acct = util.el('div', 'rv-card rv-acct', summary);
      util.el('div', 'rv-card-h', acct, 'Account');
      const who = util.el('div', 'rv-who', acct);
      const avatar = util.el('div', 'rv-avatar', who);
      avatar.innerHTML = '<svg width="100%" height="100%" viewBox="0 0 58 58" aria-hidden="true"><defs><linearGradient id="rv-person" x2="0" y2="1"><stop stop-color="#96b6d3"/><stop offset="1" stop-color="#b9d0e2"/></linearGradient></defs><path d="M7 56v-7c1-8 8-10 15-13l1-6c-3-3-4-6-4-10-4-14 21-20 22-3 1 5-1 10-4 13l1 6c8 3 14 6 15 13v7z" fill="url(#rv-person)"/></svg>';
      const wt = util.el('div', '', who);
      util.el('div', '', wt, '● Signed in (Offline mode)');
      util.el('b', '', wt, 'Taylor Kim');
      util.el('div', '', wt, 'taylor.kim@rivet.com');
      ['Mail', 'Calendar', 'Documents', 'Accounts Payable', 'Chat'].forEach((t, i) => {
        const n = util.el('div', 'rv-nav' + (i === 0 ? ' on' : ''), acct);
        ico(n, util, t, '#2f6fb0'); util.el('span', '', n, t);
      });
      const tips = util.el('div', 'rv-card rv-tips', summary);
      const th = util.el('div', 'rv-card-h rv-tip-h', tips);
      const bulb = util.el('i', 'rv-bulb', th);
      bulb.innerHTML = '<svg width="27" height="32" viewBox="0 0 27 32" aria-hidden="true"><defs><radialGradient id="rv-light"><stop stop-color="#fffbb9"/><stop offset=".65" stop-color="#ffe257"/><stop offset="1" stop-color="#efb517"/></radialGradient></defs><path d="M8 23c0-5-4-6-4-12a9 9 0 0 1 18 0c0 6-5 7-5 12" fill="url(#rv-light)" stroke="#ce990a"/><path d="M9 23h8v5H9z" fill="#acb9bf" stroke="#758d9b"/><path d="M9 25h8M9 27h8" stroke="#e8f2f5"/><path d="M11 30h4" stroke="#667b89" stroke-width="2"/><path d="M8 8c0-2 2-3 4-3" fill="none" stroke="#fff" stroke-width="2"/></svg>';
      util.el('span', '', th, 'Help & Tips');
      const ul = util.el('ul', '', tips);
      ['You can read and work on recent items while offline.', 'Open email attachments or links to view documents stored on Rivet systems.', 'Your changes will sync automatically when you’re back online.', 'Use the navigation above to check calendar, contacts or accounts-payable items.'].forEach(t => util.el('li', '', ul, t));
      Object.assign(_c, { search, summary });
    },
  };

  env.site({
    name: 'design-avoid-phishing-link-05',
    template: 'site/base',
    design: { parts },
  });
})();
