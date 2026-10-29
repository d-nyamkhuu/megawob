// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.nav': (base, S) => function (_c) {
      const { content, header, local, nav, rng, util } = _c;
      const { K } = S;
      if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        for (const item of local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav)) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
        ['Cars', 'Locations', 'Deals', 'Help'].forEach((label, i) => {
          if (n.children[i]) n.children[i].textContent = label;
          else { const a = util.el('a', 'ref-navlink', n, label); a.href = '#'; a.addEventListener('click', e => { e.preventDefault(); env.log('decoy', { what: 'nav', label }); }); }
        });
      }
      util.el('div', 'rental-account', header, '♟　My Account　⌄');
      const brandNode = header.querySelector('.ref-brand');
      if (brandNode) brandNode.innerHTML = '<span>Drive</span><b>Away</b> <small>Car Rental</small>';
      Object.assign(_c, { brandNode });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, header, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);

      // Fixed, editorial hotel context around the live avoid-dark-patterns task controls.
      const hotel = util.el('section', 'hotel-context', body);
      util.el('div', 'hotel-heading', hotel, 'The Foundry Rooms');
      util.el('div', 'hotel-meta', hotel, '★★★★★　4.6 (892 reviews)　 |　 Boutique hotel　 |　 ♧ Riverside District, Riverton');
      util.el('p', 'hotel-description', hotel, 'A restored 19th-century foundry with modern, comfortable rooms. Close to the river, cafés and independent shops. Calm garden views, a welcoming lounge and a popular on-site restaurant.');
      util.el('div', 'hotel-amenities', hotel, '⌁　 Free Wi-Fi　　　♨　 On-site restaurant　　　♧　 Garden views　　　♧　 Fitness centre　　　Ⓟ　 Parking available');
      const room = util.el('div', 'hotel-room', hotel);
      util.el('span', 'hotel-room-photo', room);
      const roomCopy = util.el('div', 'hotel-room-copy', room);
      util.el('strong', '', roomCopy, 'Garden View Double');
      util.el('span', '', roomCopy, 'A spacious room with a king bed and views over the hotel gardens.');
      const titlebar = util.el('div', 'hotel-titlebar', header);
      util.el('span', 'window-dot red', titlebar);
      util.el('span', 'window-dot yellow', titlebar);
      util.el('span', 'window-dot green', titlebar);

      // Rental search context surrounding the results window.
      const filters = util.el('aside', 'rental-filters', body);
      util.el('strong', '', filters, 'Pick-up & drop-off');
      util.el('div', 'rental-location', filters, '●　Central Station\n10 Jun 2012 – 14 Jun 2012\n4 days');
      const change = util.el('a', '', filters, 'Change');
      change.href = '#';
      change.addEventListener('click', e => { e.preventDefault(); env.log('decoy', { label: 'Change' }); });
      for (const [heading, items] of [['Car type', ['All','Small','Medium','Large','Estate','SUV','People carrier','Premium']], ['Fuel policy', ['All','Full to full','Pre-purchase (easier)']], ['Transmission', ['All','Manual','Automatic']]]) {
        const group = util.el('section', 'rental-filter-group', filters);
        util.el('strong', '', group, heading);
        for (const item of items) { const row = util.el('div', 'rental-check', group); util.el('i', item === 'Estate' || item === 'All' ? 'checked' : '', row, item === 'Estate' || item === 'All' ? '✓' : ''); util.el('span', '', row, item); }
      }
      const trip = util.el('aside', 'rental-trip', body);
      util.el('strong', '', trip, 'Your trip');
      for (const line of ['▣　5 estate cars available','●　Central Station','▦　10 Jun 2012 – 14 Jun 2012\n　　4 days','▣　Estate','♟　5 seats']) util.el('div', 'rental-trip-line', trip, line);
      Object.assign(_c, { change, filters, hotel, room, roomCopy, stage, titlebar, trip });
    },
  };

  env.site({
    name: 'design-avoid-dark-patterns-hiddencost-02',
    template: 'site/base',
    design: { parts },
  });
})();
