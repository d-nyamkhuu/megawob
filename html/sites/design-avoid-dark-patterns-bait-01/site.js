// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.theme': (base, S) => function (_c) {
      const { ctx } = _c;
      const { ACCENTS, LOW_ACCENTS, LOW_THEME, THEMES } = S;
      const { rng, util, content } = ctx;
      let name = rng.pick(Object.keys(THEMES));
      const root = document.documentElement;
      let accent = rng.pick(ACCENTS);
      const tr = rng.fork('chrome/theme');
      if (tr.bool(0.08)) {
        name = 'low';
        accent = tr.pick(LOW_ACCENTS);
      }
      for (const [k, v] of Object.entries(name === 'low' ? LOW_THEME : THEMES[name])) root.style.setProperty(`--${k}`, v);
      root.style.setProperty('--accent', accent);
      // The reference design has a fixed parchment-and-olive palette across episodes.
      for (const [k, v] of Object.entries({ bg:'#fbfaf7', panel:'#fffefa', fg:'#171713', muted:'#655f55', line:'#e2ddd3', accent:'#29372a' })) root.style.setProperty(`--${k}`, v);
      root.dataset.theme = name;
      Object.assign(_c, { accent, content, name, rng, root, tr, util });
    },
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      header.classList.add('air-header');
      const airbrand = util.el('div', 'air-brand', header, '➤ Aurora Air');
      const airtabs = util.el('nav', 'air-tabs', header);
      for (const item of ['Flights', 'Hotels', 'Car Hire', 'Holidays', 'Manage Booking']) {
        const a = util.el('a', `air-tab${item === 'Flights' ? ' active' : ''}`, airtabs, item);
        a.href = '#';
        a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
      }
      S.frameBrand(_c, header);
      Object.assign(_c, { airbrand, airtabs, header });
    },
    'frame.body': (base, S) => function (_c) {
      const { ctx, util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      body.classList.add('air-body');
      const inspector = util.el('aside', 'air-inspector', body);
      util.el('h2', '', inspector, 'Fare details');
      // Reference-image decoration, independent of the episode's instruction and goal.
      const origin = 'Bremen';
      const destination = 'Ahmedabad';
      const airports = { Bremen: 'BRE', Ahmedabad: 'AMD' };
      const routeValue = (city) => airports[city] ? `${city} (${airports[city]})` : city;
      const section = (title, rows) => {
        const box = util.el('section', 'air-section', inspector);
        util.el('h3', '', box, title);
        for (const [k, v] of rows) {
          const row = util.el('div', 'air-detail', box);
          util.el('span', '', row, k); util.el('span', '', row, v);
        }
      };
      section('Route', [['From', routeValue(origin)], ['To', routeValue(destination)]]);
      section('Itinerary', [['Depart', 'Tue, 16 Jul 2024'], ['Duration', '11h 55m'], ['Stops', '1 stop (DOH)'], ['Passengers', '1 adult'], ['Cabin class', 'Economy']]);
      section('Baggage (Saver)', [['▣', '1 × personal item (under seat)'], ['▣', '1 × cabin bag (up to 7 kg)'], ['□', 'Checked bag · Not included']]);
      section('Fare conditions (Saver)', [['♧', 'Free seat selection     ✓'], ['⟳', 'Changes · Fee applies     ✓'], ['×', 'Refunds · Not allowed']]);
      S.frameSidebar(_c, body);
      Object.assign(_c, { airports, body, destination, inspector, origin, routeValue, section });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, destination, origin, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      stage.classList.add('air-results');
      const resultsHead = util.el('div', 'air-results-head', stage);
      const routeTitle = util.el('div', 'air-route-title', resultsHead, `${origin} → ${destination}`);
      util.el('div', 'air-route-meta', resultsHead, 'Tue, 16 Jul 2024　·　1 adult　·　Economy');
      const sort = util.el('div', 'air-sort', resultsHead);
      util.el('span', '', sort, 'Sort by');
      util.el('span', 'air-sort-value', sort, 'Best value　⌄');
      body.insertBefore(resultsHead, stage);
      S.frameAlign(_c, stage);
      Object.assign(_c, { resultsHead, routeTitle, sort, stage });
    },
  };

  env.site({
    name: 'design-avoid-dark-patterns-bait-01',
    template: 'site/base',
    design: { parts },
  });
})();
