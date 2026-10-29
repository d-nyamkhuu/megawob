// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const TITLES = ['Aurora Travel'];

  const parts = {
    'frame.header': (base, S) =>
      function (_c) {
        const { display, lr, nav, rng, util, word } = _c;
        const { K } = S;
        const header = util.el('header', 'ref-task', document.body);
        document.body.dataset.instruction = display;
        if (display !== 'header' || nav) {
          const title = rng.pick(TITLES);
          const brand = util.el('div', 'ref-brand', header, word ? word(lr.pick(K.brand)) : title);
          brand.dataset.role = 'brand';
        }
        Object.assign(_c, { header });
      },
    'frame.instruction': (base, S) =>
      function (_c) {
        const { ctx, display, header, util } = _c;
        if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
        util.el('div', 'ref-spacer', header);
        if (!header.querySelector('.ref-brand')) util.el('div', 'ref-brand', header, 'Aurora Travel');
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, header, util } = _c;
        const stage = util.el('main', 'ref-stage', body);
        S.frameAlign(_c, stage);
        const services = util.el('nav', 'aurora-services', header);
        for (const [symbol, label] of [
          ['✈', 'Flights'],
          ['▰', 'Hotels'],
          ['⌂', 'Stays'],
          ['▱', 'Car rental'],
        ]) {
          const item = util.el('button', '', services);
          item.type = 'button';
          const paths = {
            Flights: 'M21 11 14 9 10 2H8L10 10 5 9 3 6H1L3 12 1 18H3L5 15 10 14 8 22H10L14 15 21 13Z',
            Hotels: 'M2 20V8M22 20V12H2V17H22M5 6H10V11H5ZM12 6H20V11H12Z',
            Stays: 'M2 11 12 2 22 11H19V22H14V15H10V22H5V11Z',
            'Car rental': 'M3 17V10L6 4H18L21 10V17ZM3 10H21M6 17V21M18 17V21M6 13H8M16 13H18',
          };
          const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          svg.setAttribute('viewBox', '0 0 24 24');
          const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          path.setAttribute('d', paths[label]);
          svg.append(path);
          item.append(svg);
          util.el('span', '', item, label);
          item.addEventListener('click', () => env.log('decoy', { what: 'travel service', label }));
        }
        Object.assign(_c, { services, stage });
      },
    'frame.floating': (base, S) =>
      function (_c) {
        const { body, endBtn, label, placement, util } = _c;
        let { submit } = _c;
        if (placement === 'floating') {
          // Reserve the control's space so it cannot intercept task clicks or drags.
          // On scrollable pages the dock follows the content, just like a form footer.
          const dock = util.el('div', 'ref-float-dock', document.body);
          submit = endBtn(dock, 'ref-submit ref-float', label);
        }

        // Material You travel shell: secondary recent-search index and bottom navigation.
        const recent = util.el('aside', 'travel-recent', body);
        util.el('div', 'travel-recent-head', recent, 'Recent searches');
        const see = util.el('a', 'travel-see', recent, 'See all');
        see.href = '#';
        see.addEventListener('click', (e) => {
          e.preventDefault();
          env.log('decoy', { what: 'recent searches' });
        });
        for (const item of [
          ['BKI → KUL', 'Wed, Apr 10, 2024', '1 adult'],
          ['KUL → SIN', 'Tue, Apr 16, 2024', '1 adult'],
          ['BKK → KUL', 'Mon, Apr 8, 2024', '1 adult'],
          ['KUL → DPS', 'Fri, May 3, 2024', '1 adult'],
        ]) {
          const card = util.el('div', 'travel-recent-card', recent);
          util.el('span', 'travel-plane', card, '✈');
          const words = util.el('div', 'travel-recent-copy', card);
          util.el('strong', '', words, item[0]);
          util.el('span', '', words, item[1]);
          util.el('span', '', words, item[2]);
          util.el('span', 'travel-more', card, '⋮');
        }
        util.el('h3', 'travel-explore-title', recent, 'Explore more');
        for (const [city, detail, symbol] of [
          ['Kuala Lumpur', 'Vibrant city, iconic views', '▥'],
          ['Langkawi', 'Beaches and nature', '◒'],
          ['Bali', 'Culture and adventure', '⌂'],
          ['Singapore', 'A modern city escape', '▰'],
        ]) {
          const card = util.el('div', 'travel-explore-card', recent);
          util.el('span', 'travel-thumb', card, symbol);
          const copy = util.el('div', '', card);
          util.el('strong', '', copy, city);
          util.el('span', '', copy, detail);
          util.el('b', 'travel-chevron', card, '›');
        }
        const dockbar = util.el('nav', 'travel-dockbar', document.body);
        for (const [icon, text] of [
          ['⌂', 'Home'],
          ['⌕', 'Search'],
          ['▢', 'Trips'],
          ['◇', 'Deals'],
          ['♙', 'Account'],
        ]) {
          const item = util.el('div', `travel-dock-item${text === 'Search' ? ' active' : ''}`, dockbar);
          const paths = {
            Home: 'M3 10 12 3 21 10V22H15V14H9V22H3Z',
            Search: 'M21 21 16 16M18 10A8 8 0 1 1 2 10A8 8 0 0 1 18 10',
            Trips: 'M3 7H21V22H3ZM8 7V3H16V7M7 10V18M17 10V18',
            Deals: 'M2 3H12L22 13 13 22 2 11ZM7 7H7.1',
            Account: 'M21 22H3V19C3 12 21 12 21 19ZM16 6A4 4 0 1 1 8 6A4 4 0 0 1 16 6',
          };
          const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          svg.setAttribute('viewBox', '0 0 24 24');
          svg.classList.add('travel-dock-icon');
          const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          path.setAttribute('d', paths[text]);
          svg.append(path);
          item.append(svg);
          util.el('span', '', item, text);
        }
        Object.assign(_c, { dockbar, recent, see, submit });
      },
  };

  env.site({
    name: 'design-use-travel-flights-03',
    template: 'site/base',
    design: { TITLES, parts },
  });
})();
