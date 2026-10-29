// Design on the shared transfer-items/dual template.
env.widget({
  task: 'transfer-items',
  site: 'design-transfer-items-filter-01',
  name: 'design',
  split: 'train',
  scenarios: ['filter'],
  template: 'transfer-items/dual',
  design: {
    fontFamily: 'Arial, Helvetica, sans-serif',
    cardPadding: '10px 12px 8px',
    cardShadow: 'none',
    controlRadius: 2,
    buttonHeight: 36,
    buttonColumnWidth: 84,
    columnGap: 18,
    radiusRange: [3, 3],
    pitchRange: [27, 30],
    minPitch: 20,
    compactPitch: 22,
    chromeHeight: 175,
    filterChrome: 43,
    horizontalInset: 8,
    verticalInset: 8,
    widthRange: [600, 720],
    fontSizes: { title: 20, note: 13, head: 20, count: 18, filter: 18, index: 14, more: 17,
      button: 22, order: 16, status: 14, ghost: 16, row: 20, compact: 17 },
    colors: { panel: '#eceae5', line: '#c1c0bd', fg: '#111', muted: '#555', accent: '#3898ed',
      selected: '#fff', selectedIndex: 'rgba(255,255,255,.8)' },
    parts: {
      status(base, S) {
        return (ctx, card) => {
          const table = ctx.util.el('div', 'city-records', card);
          const head = ctx.util.el('div', 'city-record-head', table);
          for (const label of ['Name', 'Country', 'Continent', 'Population', 'Time zone'])
            ctx.util.el('span', '', head, label);
          const cities = ctx.spec.items.slice(0, 5);
          const meta = [
            ['Netherlands', 'Europe', '821,752', 'CET (UTC+1)'],
            ['Thailand', 'Asia', '10,539,000', 'ICT (UTC+7)'],
            ['China', 'Asia', '21,540,000', 'CST (UTC+8)'],
            ['Germany', 'Europe', '3,769,495', 'CET (UTC+1)'],
            ['Australia', 'Oceania', '2,578,000', 'AEST (UTC+10)'],
          ];
          cities.forEach((city, i) => {
            const row = ctx.util.el('div', 'city-record-row', table);
            ctx.util.el('span', '', row, city);
            for (const value of meta[i % meta.length]) ctx.util.el('span', '', row, value);
          });
          // Show only the record rows that fit under the lists in the stage.
          const rowsEls = [...table.querySelectorAll('.city-record-row')];
          const body = card.querySelector('.tl-body');
          const free = ctx.size.height - 2 - 7 - 8 - 24
            - (body.getBoundingClientRect().bottom - card.getBoundingClientRect().top);
          while (rowsEls.length && table.offsetHeight > free) rowsEls.pop().remove();
          if (!rowsEls.length) table.remove();
          return ctx.util.el('div', 'tl-status city-status', card, '');
        };
      },
      place(base) {
        return (ctx, card) => {
          const { rng, size } = ctx;
          const range = ctx.spec.scenario === 'ordered' ? [640, 760] : [600, 720];
          rng.int(...range);
          rng.pick([0, 0.5, 0.5, 1, rng.float()]);
          rng.pick([0.5, 0.5, 0, 1, rng.float()]);
          card.style.left = '0px';
          card.style.top = '0px';
          card.style.width = `${size.width}px`;
          card.style.height = `${size.height}px`;
        };
      },
    },
  },
});
