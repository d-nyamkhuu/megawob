// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const menu = util.el('nav', 'sw-menu', header);
      for (const item of ['File', 'Edit', 'View', 'Favorites', 'Tools', 'Help']) {
        const entry = util.el('span', 'sw-menu-item', menu, item);
        entry.setAttribute('aria-hidden', 'true');
      }
      const toolbar = util.el('nav', 'sw-toolbar', header);
      for (const [icon, item] of [['⌂', 'Home'], ['▣', 'Book'], ['▦', 'My Trips'], ['✈', 'Check In'], ['▣', 'Flight Status'], ['?', 'Help']]) {
        const entry = util.el('span', 'sw-tool-item', toolbar);
        util.el('span', 'sw-tool-icon', entry, icon);
        util.el('span', '', entry, item);
      }
      S.frameBrand(_c, header);
      Object.assign(_c, { header, menu, toolbar });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const rail = util.el('aside', 'sw-account-rail', body);
      const card = (title, cls) => {
        const box = util.el('section', `sw-rail-card ${cls}`, rail);
        util.el('h2', 'sw-rail-heading', box, title);
        return box;
      };
      const account = card('My Account', 'sw-account-card');
      const profile = util.el('div', 'sw-profile', account);
      util.el('span', 'sw-avatar', profile, '●');
      const identity = util.el('div', 'sw-identity', profile);
      util.el('strong', '', identity, 'Taylor Brooks');
      util.el('span', '', identity, 'SkyWays Rewards # SW1234567');
      const railLink = (parent, icon, label, detail) => {
        const row = util.el('div', 'sw-rail-link', parent);
        util.el('span', 'sw-rail-icon', row, icon);
        const a = util.el('a', '', row, label);
        a.href = '#';
        a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'account-rail', label }); });
        if (detail) util.el('span', 'sw-rail-detail', row, detail);
      };
      railLink(account, '▤', 'View My Trips', '(2 upcoming)');
      railLink(account, '☆', 'My Rewards', '(12,450 miles)');
      railLink(account, '▧', 'Account Settings');
      const alerts = card('Travel Alerts', 'sw-alert-card');
      const alertState = util.el('div', 'sw-alert-state', alerts);
      util.el('span', 'sw-alert-symbol', alertState, '⚠');
      util.el('strong', '', alertState, 'No current alerts');
      util.el('p', 'sw-alert-copy', alerts, "We'll let you know about any flight alerts, gate changes or service updates that may affect your travel.");
      const quick = card('Quick Links', 'sw-quick-card');
      railLink(quick, '✈', 'Book a Flight');
      railLink(quick, '▦', 'Check In');
      railLink(quick, '◷', 'Flight Status');
      railLink(quick, '▣', 'Baggage Information');
      railLink(quick, '?', 'Help Center');
      railLink(quick, '☎', 'Contact Us');
      S.frameSidebar(_c, body);
      Object.assign(_c, { account, alertState, alerts, body, card, identity, profile, quick, rail, railLink });
    },
  };

  env.site({
    name: 'design-scroll-page-accordion-03',
    template: 'site/base',
    design: { parts },
  });
})();
