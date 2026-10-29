// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { display, util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      if (display === 'header') header.classList.add('riscos-has-instruction');
      const logo = util.el('div', 'skyways-brand', header);
      const logoWords = util.el('span', 'skyways-wordmark', logo);
      util.el('strong', '', logoWords, 'GlobeTraveller');
      const titlebar = util.el('div', 'riscos-titlebar', header);
      util.el('span', 'riscos-app-icon', titlebar, '✈');
      util.el('strong', '', titlebar, 'GlobeTraveller');
      const winbuttons = util.el('div', 'riscos-window-buttons', titlebar);
      for (const [label, glyph] of [['Minimise', '−'], ['Maximise', '□'], ['Close', '×']]) {
        const wb = util.el('span', `riscos-window-button ${label === 'Close' ? 'riscos-close' : ''}`, winbuttons, glyph);
        wb.setAttribute('aria-label', label);
      }
      const menu = util.el('nav', 'riscos-menu', header);
      for (const item of ['File', 'Edit', 'View', 'Flights', 'Hotels', 'Bookings', 'Tools', 'Help']) util.el('span', '', menu, item);
      const iconbar = util.el('div', 'riscos-iconbar', header);
      for (const [glyph, label] of [['◉','Search'], ['▤','Itinerary'], ['✈','Flights'], ['▰','Hotels'], ['▱','Car Hire'], ['▣','My Trips']]) {
        const tool = util.el('div', 'riscos-tool', iconbar);
        util.el('span', '', tool, glyph);
        util.el('small', '', tool, label);
      }
      S.frameBrand(_c, header);
      Object.assign(_c, { header, iconbar, logo, logoWords, menu, titlebar, winbuttons });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const backdrop = util.el('div', 'travel-backdrop', body);
      const trip = util.el('aside', 'trip-summary', backdrop);
      util.el('h2', '', trip, 'Trip Summary');
      util.el('div', 'summary-subhead', trip, 'Passengers');
      util.el('div', 'summary-passenger selected', trip, '1. Passenger 1');
      util.el('div', 'summary-passenger', trip, '2. Passenger 2');
      util.el('div', 'summary-rule', trip);
      util.el('div', 'summary-subhead', trip, 'Segments');
      util.el('div', 'summary-segment-icon', trip, '✈');
      util.el('div', 'trip-route', trip, 'Flight segment');
      util.el('div', 'trip-date', trip, 'Route and departure details');
      util.el('div', 'summary-small', trip, 'Seat assignment');
      util.el('div', 'summary-segment-icon hotel-icon', trip, '▰');
      util.el('div', 'trip-route', trip, 'Hotel stay');
      util.el('div', 'trip-date', trip, 'Stay dates on itinerary');
      util.el('div', 'summary-small', trip, 'Room not selected');
      const booking = util.el('section', 'summary-booking', trip);
      util.el('h2', '', booking, 'Booking Status');
      for (const [key, value] of [['Flight seats', 'Not selected'], ['Hotel room', 'Not selected'], ['Car hire', 'Not added']]) {
        const row = util.el('div', 'summary-status-row', booking);
        util.el('span', '', row, key);
        util.el('span', '', row, value);
      }
      util.el('div', 'summary-rule', booking);
      util.el('div', 'summary-status-row', booking, 'Total passengers　　　　　2');
      util.el('div', 'summary-status-row', booking, 'Total segments　　　　　 2');
      const right = util.el('div', 'travel-promo', backdrop);
      const slogan = util.el('strong', '', right);
      util.el('span', '', slogan, 'Travel');
      util.el('span', '', slogan, 'brighter');
      util.el('span', '', slogan, 'together');
      util.el('span', 'promo-rule', right);
      util.el('div', 'promo-scene', backdrop);
      S.frameSidebar(_c, body);
      Object.assign(_c, { backdrop, body, booking, right, slogan, trip });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      stage.classList.add('seat-window');
      S.frameAlign(_c, stage);
      Object.assign(_c, { stage });
    },
  };

  env.site({
    name: 'design-use-travel-seat-03',
    template: 'site/base',
    design: { parts },
  });
})();
