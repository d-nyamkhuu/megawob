// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) =>
      function (_c) {
        const { util } = _c;
        const header = util.el('header', 'ref-task', document.body);
        const storeHead = util.el('div', 'bf-head', header);
        const wordmark = util.el('div', 'bf-logo', storeHead, 'WorldTravel Online');
        const globe = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        globe.setAttribute('class', 'bf-globe');
        globe.setAttribute('viewBox', '0 0 100 100');
        globe.setAttribute('aria-hidden', 'true');
        globe.innerHTML =
          '<defs><clipPath id="wt-globe"><circle cx="50" cy="50" r="46"/></clipPath><radialGradient id="wt-sea" cx="35%" cy="28%"><stop stop-color="#55b8ec"/><stop offset="1" stop-color="#07377f"/></radialGradient></defs><circle cx="50" cy="50" r="47" fill="url(#wt-sea)" stroke="#ffe45b" stroke-width="3"/><g clip-path="url(#wt-globe)" fill="#ffe45b"><path d="M16 23 26 14 39 12 43 20 37 25 42 31 36 37 31 35 27 43 19 40 15 33 10 31zM41 39 49 37 55 43 52 51 57 59 54 68 49 76 44 69 43 59 38 53 38 46zM58 18 67 14 73 18 70 24 78 28 84 37 78 42 72 38 67 42 61 36 56 29zM65 51 74 47 83 51 88 58 82 63 78 72 70 68 68 61 61 59zM23 57 31 53 36 59 33 68 27 73 21 67z"/></g><ellipse cx="50" cy="50" rx="20" ry="46" fill="none" stroke="#e7d85d" stroke-width="1.2"/><path d="M5 50h90M11 31h78M11 69h78" fill="none" stroke="#e7d85d" stroke-width="1.2" opacity=".8"/>';
        wordmark.insertBefore(globe, wordmark.firstChild);
        const search = util.el('div', 'bf-search', storeHead, 'Search Travel　　⌕');
        const right = util.el('div', 'bf-head-right', storeHead);
        util.el('span', 'bf-account', right, 'Home　 |　 Site Map　 |　 Help　 |　 Contact Us');
        util.el('span', 'bf-cart', right, 'Flights　 HOTELS　 CARS　 HOLIDAYS');
        const hero = util.el('section', 'bf-hero', document.body);
        const heroCopy = util.el('div', 'bf-hero-copy', hero);
        util.el('strong', '', heroCopy, 'Book Your Flight');
        util.el(
          'span',
          '',
          heroCopy,
          '1. Search　　›　　2. Select Flights　　›　　3. Passenger Details　　›　　4. Extras　　›　　5. Payment　　›　　6. Confirm',
        );
        const benefits = util.el('div', 'bf-benefits', heroCopy);
        for (const [icon, title, sub] of [
          ['♧', 'Free delivery', 'on orders over $50'],
          ['♢', 'Secure payments', '256-bit encryption'],
          ['◴', '30-day returns', 'Hassle free'],
        ]) {
          const item = util.el('div', 'bf-benefit', benefits);
          util.el('span', 'bf-benefit-icon', item, icon);
          const words = util.el('span', 'bf-benefit-words', item);
          util.el('b', '', words, title);
          util.el('small', '', words, sub);
        }
        const heroRight = util.el('div', 'bf-hero-right', hero);
        util.el('strong', '', heroRight, '');
        S.frameBrand(_c, header);
        Object.assign(_c, { benefits, globe, header, hero, heroCopy, heroRight, right, search, storeHead, wordmark });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { util } = _c;
        const body = util.el('div', 'ref-body', document.body);
        const rail = util.el('aside', 'portal-rail', body);
        for (const [heading, links] of [
          ['Flights', ['Search Flights', 'Special Offers', 'Timetables', 'Airline Directory']],
          ['Hotels', ['Find a Hotel', 'City Guides', 'Hotel Deals']],
          ['Car Hire', ['Search Cars', 'Location Guide', 'Special Offers']],
          ['Holidays', ['Beach Holidays', 'City Breaks', 'Last Minute']],
          ['Travel Services', ['Travel Insurance', 'Airport Parking', 'Currency', 'Travel Shop']],
        ]) {
          const group = util.el('section', 'portal-group', rail);
          util.el('b', '', group, heading);
          for (const label of links) util.el('a', '', group, label);
        }
        S.frameSidebar(_c, body);
        Object.assign(_c, { body, rail });
      },
    'frame.footer': (base, S) =>
      function (_c) {
        const { collide, decoyBtn, decoys, endBtn, label, lr, placement, rng, util, wantFooter, word } = _c;
        let { submit } = _c;
        if (wantFooter) {
          const foot = util.el('footer', 'ref-foot', document.body);
          const dock = util.el('nav', 'bf-dock', foot);
          for (const item of ['⌂　Home', '▦　Shop', '◇　Deals', '♡　Wish list', '▤　Orders', '♙　Account'])
            util.el('span', '', dock, item);
          const footText = rng.pick([
            '© 2024 Example Co.',
            'All changes are saved automatically.',
            'Need help? Contact your administrator.',
            'v4.2.1 · Status: all systems normal',
          ]);
          util.el(
            'span',
            'ref-foot-text',
            foot,
            word
              ? lr.pick([
                  `© 2024 Example Co. ${word('footRights')}`,
                  word('footSaved'),
                  word('footHelp'),
                  `v4.2.1 · ${word('footStatus')}`,
                ])
              : footText,
          );
          const tools = util.el('div', 'ref-tools', foot);
          if (decoys.length > 1) decoyBtn(tools, decoys[1]);
          if (collide && collide.where === 'footer') decoyBtn(tools, collide.text, true);
          if (placement === 'footer') submit = endBtn(tools, 'ref-submit', label);
          if (placement === 'link') submit = endBtn(tools, 'ref-endlink', `${label} ›`);
        }
        Object.assign(_c, { submit });
      },
    'frame.floating': (base, S) =>
      function (_c) {
        const { endBtn, label, placement, util } = _c;
        let { submit } = _c;
        if (placement === 'floating') {
          // Reserve the control's space so it cannot intercept task clicks or drags.
          // On scrollable pages the dock follows the content, just like a form footer.
          const dock = util.el('div', 'ref-float-dock', document.body);
          submit = endBtn(dock, 'ref-submit ref-float', label);
        }
        if (!document.querySelector('.bf-dock')) {
          const dock = util.el('nav', 'bf-dock bf-dock-fixed', document.body);
          for (const item of ['⌂　Home', '▦　Shop', '◇　Deals', '♡　Wish list', '▤　Orders', '♙　Account'])
            util.el('span', '', dock, item);
        }
        Object.assign(_c, { submit });
      },
  };

  env.site({
    name: 'design-avoid-dark-patterns-precheck-03',
    template: 'site/base',
    design: { parts },
  });
})();
