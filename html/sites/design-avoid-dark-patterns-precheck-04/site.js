// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const titlebar = util.el('div', 'sw-titlebar', document.body);
      util.el('span', 'sw-plane', titlebar, '✈');
      util.el('span', '', titlebar, 'SkyWays　—　Flight Booking');
      const winctl = util.el('span', 'sw-winctl', titlebar, '−　□　×');
      const menubar = util.el('nav', 'sw-menubar', document.body);
      for (const item of ['File', 'Edit', 'View', 'Bookings', 'Tools', 'Help']) util.el('span', '', menubar, item);
      S.frameBrand(_c, header);
      Object.assign(_c, { header, menubar, titlebar, winctl });
    },
    'frame.instruction': (base, S) => function (_c) {
      const { ctx, display, header, util } = _c;
      if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
      else util.el('div', 'ref-spacer', header);
      const tabs = util.el('nav', 'sw-tabs', document.body);
      for (const [i, item] of ['1.　Search', '2.　Select Flights', '3.　Passenger Details', '4.　Extras & Options', '5.　Payment'].entries()) {
        const tab = util.el('span', i === 3 ? 'active' : '', tabs, item);
      }
      Object.assign(_c, { tabs });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const trip = util.el('aside', 'sw-trip', body);
      util.el('div', 'sw-trip-head', trip, 'Your Trip');
      util.el('strong', 'sw-route', trip, 'Athens (ATH)　→　Zagreb (ZAG)');
      util.el('div', 'sw-trip-row', trip, 'Tue 14 May 2024');
      util.el('div', 'sw-flight', trip, '✈　12:20　Athens (ATH)');
      util.el('div', 'sw-flight', trip, '　　14:10　Zagreb (ZAG)');
      util.el('div', 'sw-flight', trip, '　　2h 50m　　Direct flight');
      util.el('div', 'sw-flight', trip, '　　SkyWays　 SW426');
      util.el('div', 'sw-trip-rule', trip);
      util.el('strong', '', trip, 'Passengers');
      util.el('div', 'sw-trip-row sw-between', trip, '1 Adult');
      util.el('div', 'sw-trip-rule', trip);
      util.el('strong', 'sw-price-title', trip, 'Price Summary');
      util.el('div', 'sw-trip-row sw-between', trip, 'Base fare　　　€ 89.00');
      util.el('div', 'sw-trip-row sw-between', trip, 'Taxes and charges　€ 34.00');
      util.el('div', 'sw-trip-row sw-between', trip, 'Extras　　　　 € 62.00');
      util.el('div', 'sw-trip-rule', trip);
      util.el('strong', 'sw-between', trip, 'Total (EUR)　　 € 185.00');
      S.frameSidebar(_c, trip);
      Object.assign(_c, { body, trip });
    },
    'frame.panel': (base, S) => function (_c) {
      base({ ..._c, body: _c.trip });
    },
    'frame.footer': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, label, lr, placement, rng, util, wantFooter, word } = _c;
      let { submit } = _c;
      if (wantFooter) {
        const foot = util.el('footer', 'ref-foot', document.body);
        const dock = util.el('nav', 'bf-dock', foot);
        for (const item of ['⌂　Home', '▦　Shop', '◇　Deals', '♡　Wish list', '▤　Orders', '♙　Account']) util.el('span', '', dock, item);
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
      Object.assign(_c, { submit });
    },
  };

  env.site({
    name: 'design-avoid-dark-patterns-precheck-04',
    template: 'site/base',
    design: { parts },
  });
})();
