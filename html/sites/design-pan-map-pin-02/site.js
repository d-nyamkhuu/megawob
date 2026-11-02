// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const rail = util.el('aside', 'ref-city-rail', body);
      util.el('div', 'ref-rail-title', rail, 'Places');
      const categoryRows = [['▣','All Places'],['♜','Restaurants'],['♣','Parks'],['◆','Schools'],['✚','Hospitals'],['▤','Libraries'],['♜','Government'],['▣','Shopping'],['♟','Recreation'],['▤','Transit'],['▰','Hotels'],['•••','Other']];
      for (let i = 0; i < categoryRows.length; i++) {
        const row = util.el('div', `ref-rail-row${i === 0 ? ' selected' : ''}`, rail);
        util.el('span', `ref-rail-icon icon-${i}`, row, categoryRows[i][0]);
        util.el('span', '', row, categoryRows[i][1]);
      }
      util.el('div', 'ref-rail-title ref-district-title', rail, 'Districts');
      const districts = ['Riverside','Maplewood','Lakeside','Brookfield','Cedar Grove','Pine Hill','Oak Terrace','West End'];
      districts.forEach((name, i) => util.el('div', `ref-district-row${i === 0 ? ' selected' : ''}`, rail, name));
      const inspector = util.el('aside', 'ref-city-inspector', body);
      util.el('div', 'ref-inspector-title', inspector, 'Place Details');
      const empty = util.el('div', 'ref-inspector-empty', inspector);
      util.el('strong', '', empty, 'No place selected');
      util.el('span', '', empty, 'Click a place on the map to see details here.');
      util.el('div', 'ref-nearby-title', inspector, 'Nearby Places');
      const nearby = util.el('div', 'ref-nearby-empty', inspector);
      util.el('span', '', nearby, 'Select a place on the map to see nearby places.');
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, categoryRows, districts, empty, inspector, nearby, rail });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const mapWindow = util.el('section', 'ref-map-window', body);
      util.el('div', 'ref-map-title', mapWindow, 'Map');
      const stage = util.el('main', 'ref-stage', mapWindow);
      S.frameAlign(_c, stage);
      util.el('div', 'ref-map-toolbar', mapWindow, 'Map Tools:　📍 Add Marker　 ✋ Pan　 ▫ Select Area　 ／ Measure Distance');
      Object.assign(_c, { stage });
    },
  };

  env.site({
    name: 'design-pan-map-pin-02',
    template: 'site/base',
    design: { parts },
  });
})();
