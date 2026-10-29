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
      util.el('strong', '', logoWords, 'SkyWays');
      util.el('small', '', logoWords, 'Go further together');
      S.frameBrand(_c, header);
      Object.assign(_c, { header, logo, logoWords });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const backdrop = util.el('div', 'travel-backdrop', body);
      const trip = util.el('aside', 'trip-summary', backdrop);
      util.el('h2', '', trip, 'Your trip');
      util.el('div', 'trip-photo', trip);
      util.el('div', 'trip-route', trip, 'New York (JFK)');
      util.el('div', 'trip-destination', trip, '→ Barcelona (BCN)');
      util.el('div', 'trip-date', trip, 'Tue, Apr 15, 2025');
      const right = util.el('div', 'travel-promo', backdrop);
      const slogan = util.el('strong', '', right);
      util.el('span', '', slogan, 'Travel');
      util.el('span', '', slogan, 'brighter');
      util.el('span', '', slogan, 'together');
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
    name: 'design-use-travel-seat-01',
    template: 'site/base',
    design: { parts },
  });
})();
