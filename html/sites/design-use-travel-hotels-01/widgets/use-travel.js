env.widget({
  task: 'use-travel',
  site: 'design-use-travel-hotels-01',
  name: 'design',
  split: 'train',
  scenarios: ['hotels'],
  template: 'use-travel/portal',
  design: {
    brand: 'VoyageNow',
    fontFamily: 'Trebuchet MS, Arial, sans-serif',
    parts: {
      resultFilters: (base, S) => (rail, m) => {
        base(rail, m);
        // Keep the filter columns and every amenity inside the available stage.
        const column = Math.max(0, (S.ctx.size.width - 90) / 3);
        rail.style.gridTemplateColumns = `minmax(0,${Math.min(250, column)}px) minmax(0,${Math.min(240, column)}px) minmax(0,1fr)`;
        rail.style.gridTemplateRows = '20px 35px 24px auto';
        const checks = [...rail.children].filter(node => node.classList.contains('at-check'));
        const amenities = S.P.el('div', 'hotel-amenities', rail);
        Object.assign(amenities.style, {
          gridRow: '4', gridColumn: '1 / -1', display: 'flex',
          flexWrap: 'wrap', gap: '6px 16px', minWidth: '0',
        });
        for (const check of checks) {
          Object.assign(check.style, {margin: '0', justifyContent: 'flex-start'});
          amenities.append(check);
        }
      },
      route: (_base, S) => (app) => {
        const P = S.P, s = S.spec;
        const route = P.el('div', 'at-route hotel-route', app);
        const heading = P.el('div', 'hotel-route-title', route);
        P.el('span', 'hotel-palm', heading, '♣');
        P.el('h2', '', heading, `Hotels in ${s.dest.city}`);
        const fields = P.el('div', 'hotel-stayfields', route);
        for (const [label, value] of [['Check-in','May 16, 2025'],['Check-out','May 21, 2025'],['Guests','2 adults']]) {
          const field = P.el('label', 'hotel-stayfield', fields);
          P.el('strong', '', field, label);
          P.el('span', '', field, value);
        }
      },
    },
  },
});
