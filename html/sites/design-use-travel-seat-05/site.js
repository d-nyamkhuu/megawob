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
      const nav = util.el('nav', 'skyways-nav', body);
      const navItems = [['✈','My Trip'],['⌕','Book Flight'],['▰','Hotels'],['▣','Car Rental'],['◆','Check In'],['◷','Flight Status'],['●','Travel Info']];
      navItems.forEach(([icon,label],i)=>{const item=util.el('div',`skyways-nav-item${i===0?' selected':''}`,nav);util.el('b','',item,icon);util.el('span','',item,label);});
      const trip = util.el('aside', 'trip-summary', backdrop);
      const tripHead = util.el('div', 'trip-heading', trip);
      util.el('h2', '', tripHead, 'Your Itinerary');
      util.el('a', '', tripHead, 'View All');
      const journeyOne = util.el('div', 'trip-record active', trip);
      util.el('strong', '', journeyOne, '✈  Seoul (ICN)  →  San Francisco (SFO)');
      util.el('span', '', journeyOne, 'Tue, Apr 22, 2025　 10:20 AM – 3:50 PM');
      util.el('span', '', journeyOne, 'SW702　 Boeing 777-300ER');
      util.el('span', '', journeyOne, 'Joo-won Yoon　　Seat: Not assigned');
      const journeyTwo = util.el('div', 'trip-record', trip);
      util.el('strong', '', journeyTwo, '✈  San Francisco (SFO)  →  Seoul (ICN)');
      util.el('span', '', journeyTwo, 'Tue, Apr 29, 2025　 12:30 PM – 5:25 PM');
      util.el('span', '', journeyTwo, 'SW703　 Boeing 777-300ER');
      util.el('span', '', journeyTwo, 'Joo-won Yoon　　Seat: Not assigned');
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
    name: 'design-use-travel-seat-05',
    template: 'site/base',
    design: { parts },
  });
})();
