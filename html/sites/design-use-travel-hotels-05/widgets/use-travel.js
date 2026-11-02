env.widget({
  task: 'use-travel',
  site: 'design-use-travel-hotels-05',
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
        const P = S.P;
        const route = P.el('div', 'at-route hotel-route', app);
        P.el('div', 'legacy-search-heading', route, 'Hotel Search');
        const fields = P.el('div', 'hotel-stayfields', route);
        for (const [label, value, width] of [['Destination','All hotel results','32%'],['Check-in','Jun 14, 2024','17%'],['Check-out','Jun 17, 2024','17%'],['Rooms','1','10%'],['Adults','2','9%'],['Children','0','9%']]) {
          const field = P.el('label', 'hotel-stayfield', fields);
          field.style.width = width;
          P.el('strong', '', field, label);
          P.el('span', '', field, value);
        }
      },
    },
  },
});
