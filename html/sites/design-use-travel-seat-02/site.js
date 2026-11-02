// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const logo = util.el('div', 'skyways-brand', header);
      util.el('span', 'skyways-mark', logo, '✈');
      const logoWords = util.el('span', 'skyways-wordmark', logo);
      util.el('strong', '', logoWords, 'Wanderly');
      util.el('small', '', logoWords, '');
      S.frameBrand(_c, header);
      Object.assign(_c, { header, logo, logoWords });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const backdrop = util.el('div', 'travel-backdrop', body);
      const trip = util.el('aside', 'trip-summary', backdrop);
      util.el('h2', '', trip, 'Trip to Toronto');
      util.el('div', 'trip-photo', trip);
      util.el('div', 'trip-route', trip, '✈　LAX → YYZ');
      util.el('div', 'trip-destination', trip, 'Hotel');
      util.el('div', 'trip-date', trip, 'May 12 – May 16 · Toronto, ON');
      const right = util.el('div', 'travel-promo', backdrop);
      const slogan = util.el('strong', '', right);
      util.el('span', '', slogan, 'Flight');
      util.el('span', '', slogan, 'details');
      util.el('span', '', slogan, '');
      util.el('span', 'promo-rule', right);
      util.el('div', 'promo-scene', backdrop);
      S.frameSidebar(_c, body);
      Object.assign(_c, { backdrop, body, right, slogan, trip });
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
    name: 'design-use-travel-seat-02',
    template: 'site/base',
    design: { parts },
  });
})();
