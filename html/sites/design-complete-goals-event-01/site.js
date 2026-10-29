// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.nav': (base, S) =>
      function (_c) {
        const { content, header, local, nav, rng, util } = _c;
        const { K } = S;
        if (nav) {
          const n = util.el('nav', 'ref-nav', header);
          for (const item of local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav)) {
            const a = util.el('a', 'ref-navlink', n, item);
            a.dataset.role = 'nav';
            a.addEventListener('click', (e) => {
              e.preventDefault();
              env.log('decoy', { what: 'nav', label: item });
            });
          }
        }
        const hotelNav = util.el('nav', 'hotel-nav', header);
        const hotelItems = [
          ['Home', '<path d="m3 10 9-7 9 7"/><path d="M5 9v11h14V9M9 20v-7h6v7"/>'],
          [
            'Reservations',
            '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18M7 14h2m4 0h2m-8 4h2m4 0h2"/>',
          ],
          ['Guests', '<circle cx="12" cy="8" r="4"/><path d="M4 21c.4-4.3 3.4-6.5 8-6.5s7.6 2.2 8 6.5z"/>'],
          ['Payments', '<rect x="3" y="5" width="18" height="15" rx="2"/><path d="M3 10h18M7 16h4"/>'],
          ['Analytics', '<path d="M4 20V13M10 20V8M16 20V4M22 20V10"/>'],
          [
            'Settings',
            '<circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7a8 8 0 0 1-1.7 1l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.7-1l-1.7.7-1.4-2.4L7.3 15a7 7 0 0 1 0-2l-1.4-1.1 1.4-2.4 1.7.7a8 8 0 0 1 1.7-1l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.7 1l1.7-.7 1.4 2.4-1.4 1.1a7 7 0 0 1-.1 2z"/>',
          ],
        ];
        for (const [i, [label, path]] of hotelItems.entries()) {
          const a = util.el('a', `hotel-navlink${i === 0 ? ' active' : ''}`, hotelNav, '');
          a.href = '#';
          a.setAttribute('aria-label', label);
          a.title = label;
          const icon = util.el('svg', '', a);
          icon.setAttribute('viewBox', '0 0 24 24');
          icon.setAttribute('aria-hidden', 'true');
          icon.setAttribute('fill', 'none');
          icon.setAttribute('stroke', 'currentColor');
          icon.setAttribute('stroke-width', '1.65');
          icon.setAttribute('stroke-linecap', 'round');
          icon.setAttribute('stroke-linejoin', 'round');
          icon.innerHTML = path;
          util.el('span', '', a, label);
          a.addEventListener('click', (e) => {
            e.preventDefault();
            env.log('decoy', { what: 'nav', label });
          });
        }
        Object.assign(_c, { hotelItems, hotelNav });
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, util } = _c;
        const stage = util.el('main', 'ref-stage', body);
        S.frameAlign(_c, stage);

        // The hotel details inspector is part of this design's app frame, independent of the task note.
        const details = util.el('aside', 'hotel-details', body);
        const dh = util.el('div', 'hotel-details-head', details);
        util.el('strong', '', dh, 'Details');
        util.el('span', '', dh, '⚑　⌃');
        const hotel = util.el('div', 'hotel-summary', details);
        const hotelImage = util.el('img', 'hotel-thumb', hotel);
        hotelImage.src =
          'data:image/jpeg;base64,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';
        hotelImage.alt = 'Rivermere Hotel exterior at dusk';
        const hotelName = util.el('div', 'hotel-copy', hotel);
        util.el('strong', '', hotelName, 'Rivermere Hotel');
        util.el('span', '', hotelName, 'Downtown');
        util.el('span', '', hotelName, 'Portland, OR');
        const facts = util.el('div', 'hotel-facts', details);
        for (const [a, b] of [
          ['Guest', '—'],
          ['Reservation', '—'],
          ['Room', '—'],
          ['Payment', '—'],
        ]) {
          const row = util.el('div', 'hotel-fact', facts);
          util.el('span', '', row, a);
          util.el('span', '', row, b);
        }
        Object.assign(_c, { details, dh, facts, hotel, hotelImage, hotelName, stage });
      },
  };

  env.site({
    name: 'design-complete-goals-event-01',
    template: 'site/base',
    design: { parts },
  });
})();
