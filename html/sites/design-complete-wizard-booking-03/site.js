// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { display, nav, rng, util } = _c;
      const { TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      header.dataset.appTitle = 'Voyage Planner';
      if (display !== 'header' || nav) {
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, 'Hotel Reservation');
        brand.dataset.role = 'brand';
      }
      Object.assign(_c, { header });
    },
    'frame.instruction': (base, S) => function (_c) {
      const { ctx, display, header, util } = _c;
      if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
      else util.el('div', 'ref-spacer', header);
      const tabs = util.el('div', 'vp-tabs', header);
      for (const [label, active] of [['Home', true], ['Travel', false], ['View', false], ['Tools', false], ['Help', false]]) {
        const tab = util.el('span', active ? 'vp-tab vp-tab-active' : 'vp-tab', tabs, label);
      }
      const ribbon = util.el('div', 'vp-ribbon', header);
      const icons = [
        '<svg viewBox="0 0 48 48"><path fill="#fff" stroke="#6885a0" stroke-width="2" d="M10 4h19l9 9v31H10z"/><path fill="#cfe8fb" d="M29 4v10h9"/><path stroke="#4f79a0" stroke-width="2" d="M16 22h16M16 27h16M16 32h13"/></svg>',
        '<svg viewBox="0 0 48 48"><path fill="#f6c56a" stroke="#bd8426" stroke-width="2" d="M5 13h15l4 4h19v23H5z"/><path fill="#ffdc8d" stroke="#bd8426" stroke-width="2" d="M4 17h40l-5 21H5z"/></svg>',
        '<svg viewBox="0 0 48 48"><path stroke="#cf302c" stroke-width="7" stroke-linecap="round" d="m12 12 24 24M36 12 12 36"/></svg>',
        '<svg viewBox="0 0 48 48"><path fill="#66869f" stroke="#304e67" stroke-width="2" d="m4 24 39-17-11 35-8-13-13 8 4-13z"/><path fill="#d9efff" d="m15 25 17-12-10 15-1 10z"/></svg>',
        '<svg viewBox="0 0 48 48"><path fill="#527c9e" stroke="#294e70" stroke-width="2" d="M4 21h5V12h8l5 8h7l6-8h5v9h4v17h-5v4h-5v-4H12v4H7v-4H4z"/><path fill="#dff1ff" d="M12 14h4l4 6h-8zM33 14h4v6h-8z"/></svg>',
        '<svg viewBox="0 0 48 48"><path fill="#5888ae" stroke="#315b80" stroke-width="2" d="M8 16h31l4 7v12H5V23z"/><path fill="#dff3ff" d="M12 18h10v8H9zM25 18h10l5 8H25z"/><circle cx="13" cy="36" r="5" fill="#304b62"/><circle cx="35" cy="36" r="5" fill="#304b62"/></svg>',
        '<svg viewBox="0 0 48 48"><path fill="#566f88" stroke="#30475f" stroke-width="2" d="M7 14h11l4 7h5l4-7h10l3 7v16h-5v5h-5v-5H15v5h-5v-5H5V21z"/><circle cx="13" cy="22" r="5" fill="#d7edfc"/><circle cx="35" cy="22" r="5" fill="#d7edfc"/></svg>',
        '<svg viewBox="0 0 48 48"><path fill="#526e88" stroke="#304b69" stroke-width="2" d="M5 18h10l3-6h12l3 6h10v22H5z"/><path fill="#c8e6fa" d="M9 20h30v11H9z"/><path stroke="#304b69" stroke-width="2" d="M15 20v11m18-11v11"/></svg>',
        '<svg viewBox="0 0 48 48"><path fill="#f4bd35" stroke="#c88710" stroke-width="2" d="m24 3 6 14 15 1-11 10 4 16-14-8-14 8 4-16L3 18l15-1z"/></svg>',
        '<svg viewBox="0 0 48 48"><path fill="#f5b638" stroke="#bc8114" stroke-width="2" d="M7 23 24 6h17v17L24 40z"/><circle cx="34" cy="14" r="3" fill="#fff1ca" stroke="#bc8114" stroke-width="2"/></svg>',
        '<svg viewBox="0 0 48 48"><path fill="#8398aa" stroke="#536a7e" stroke-width="2" d="M12 4h24v10H12zM8 14h32v21H8z"/><path fill="#fff" stroke="#536a7e" stroke-width="2" d="M13 27h22v17H13z"/><path stroke="#7390a8" stroke-width="2" d="M17 32h14m-14 5h14"/></svg>',
      ];
      const groups = [
        [[icons[0], 'New Booking'], [icons[1], 'Open Booking'], [icons[2], 'Delete Booking']],
        [[icons[3], 'Flights'], [icons[4], 'Hotels'], [icons[5], 'Car Rental'], [icons[6], 'Activities']],
        [[icons[8], 'Special Offers'], [icons[9], 'Manage Favorites']],
        [[icons[10], 'Print Itinerary']],
      ];
      for (const groupItems of groups) {
        const group = util.el('div', 'vp-ribbon-group', ribbon);
        for (const [icon, label] of groupItems) {
          const item = util.el('div', 'vp-ribbon-item', group);
          const iconBox = util.el('span', 'vp-ribbon-icon', item);
          iconBox.innerHTML = icon;
          util.el('span', 'vp-ribbon-label', item, label);
        }
      }
      Object.assign(_c, { groups, icons, ribbon, tabs });
    },
    'frame.body': (base, S) => function (_c) {
      const { content, rng, util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      if (true) {
        const side = util.el('aside', 'ref-side', body);
        rng.sample(content.NAV_ITEMS, rng.int(4, 7));
        for (const item of ['Home', 'Bookings', 'Search', 'Favorites', 'Recent', 'Destinations']) {
          const a = util.el('a', 'ref-sidelink', side, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label: item }); });
        }
      }
      Object.assign(_c, { body });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const inspector = util.el('aside', 'booking-inspector', body);
      const indexHead = util.el('div', 'booking-inspector-head', inspector);
      util.el('strong', '', indexHead, 'Popular destinations');
      util.el('a', '', indexHead, 'See all');
      const indexColumns = util.el('div', 'booking-destination-columns', inspector);
      for (const label of ['', 'Destination', 'Country', 'Type']) util.el('span', '', indexColumns, label);
      const index = util.el('div', 'booking-destination-list', inspector);
      for (const [i, [city, country, kind]] of [
        ['Hanoi', 'Vietnam', 'City'], ['Bangkok', 'Thailand', 'City'], ['Singapore', 'Singapore', 'City'],
        ['Bali', 'Indonesia', 'Beach'], ['Tokyo', 'Japan', 'City'], ['Seoul', 'South Korea', 'City'],
        ['Sydney', 'Australia', 'City'], ['Auckland', 'New Zealand', 'City'],
      ].entries()) {
        const row = util.el('div', 'booking-destination-row', index);
        const photo = util.el('div', `booking-destination-photo photo-${i}`, row);
        photo.setAttribute('aria-hidden', 'true');
        util.el('span', 'booking-destination-city', row, city);
        util.el('span', 'booking-destination-country', row, country);
        util.el('span', 'booking-destination-kind', row, kind);
      }
      Object.assign(_c, { index, indexColumns, indexHead, inspector, stage });
    },
  };

  env.site({
    name: 'design-complete-wizard-booking-03',
    template: 'site/base',
    design: { parts },
  });
})();
