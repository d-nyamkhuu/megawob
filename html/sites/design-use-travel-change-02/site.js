// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) =>
      function (_c) {
        const { rng, util } = _c;
        const { TITLES } = S;
        const header = util.el('header', 'ref-task', document.body);
        if (true) {
          const title = rng.pick(TITLES);
          const brand = util.el('div', 'ref-brand', header, 'GlobeTravel Pro  –  Booking Management');
          brand.dataset.role = 'brand';
        }
        Object.assign(_c, { header });
      },
    'frame.tools': (base, S) =>
      function (_c) {
        const { collide, decoyBtn, decoys, endBtn, header, label, placement, util, wantFooter } = _c;
        let submit = null;
        const headerTools = util.el('div', 'ref-tools', header);
        for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
        if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
        if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
        if (placement === 'icon') {
          submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
        }
        const menu = util.el('nav', 'classic-menu', document.body);
        for (const item of ['File', 'Edit', 'View', 'Booking', 'Tools', 'Reports', 'Window', 'Help']) {
          const m = util.el('span', '', menu, item);
          m.dataset.role = 'menu';
        }
        const toolbar = util.el('div', 'classic-toolbar', document.body);
        const actions = [
          ['▯', 'New'],
          ['📂', 'Open'],
          ['▣', 'Print'],
          ['⌕', 'Find'],
          ['🔍', 'Search'],
          ['◉', 'Flights'],
          ['▰', 'Hotels'],
          ['🚘', 'Cars'],
          ['♟', 'Customers'],
          ['▤', 'Reports'],
        ];
        for (const [icon, label] of actions) {
          const item = util.el('div', 'classic-tool', toolbar);
          util.el('span', 'classic-tool-icon', item, icon);
          util.el('span', '', item, label);
        }
        Object.assign(_c, { actions, headerTools, menu, submit, toolbar });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { content, local, rng, sidebar, tr, util } = _c;
        const { K } = S;
        const body = util.el('div', 'ref-body', document.body);
        // Keep the original optional sidebar's seeded draws so later frame stays reproducible.
        if (sidebar) local(rng.sample(content.NAV_ITEMS, rng.int(4, 7)), K.nav);
        const side = util.el('aside', 'booking-list', body);
        util.el('div', 'booking-list-title', side, 'Bookings');
        const filters = util.el('div', 'booking-filters', side);
        util.el('label', '', filters, 'View:');
        const view = util.el('div', 'classic-select', filters, 'All Bookings  ▾');
        util.el('label', '', filters, 'Find:');
        const find = util.el('div', 'classic-find', filters);
        util.el('span', '', find, '');
        util.el('button', 'classic-go', find, 'Go');
        const list = util.el('div', 'booking-rows', side);
        const cols = util.el('div', 'booking-cols', list);
        for (const c of ['Ref No.', 'Passenger Name', 'Dep Date']) util.el('span', '', cols, c);
        const records = [
          ['3K9F2A', 'Li Wei', '12 Apr 2024'],
          ['5H7C9D', 'Carlos Mendez', '14 Apr 2024'],
          ['67LDB4', 'Chiamaka Mensah', '18 Apr 2024'],
          ['8N2P1C', 'Priya Sharma', '19 Apr 2024'],
          ['9Q4Z7K', 'Daniel Okoro', '20 Apr 2024'],
          ['B3T6M8', 'Emma Rossi', '22 Apr 2024'],
          ['C1V9X0', 'Lucas Moreau', '25 Apr 2024'],
          ['D7K3H2', 'Aiko Tanaka', '26 Apr 2024'],
          ['F8M0L5', 'Hassan Ali', '28 Apr 2024'],
          ['G2N4R9', 'Sophie Dubois', '30 Apr 2024'],
          ['H5J1W3', 'Miguel Santos', '02 May 2024'],
          ['J9D8Q6', 'Elena Petrova', '03 May 2024'],
          ['K4L7C1', 'John Smith', '05 May 2024'],
          ['L0P3V7', 'Fatima Noor', '06 May 2024'],
          ['M6R2B9', 'Oliver Brown', '08 May 2024'],
          ['N1X9T4', 'Isabella Garcia', '10 May 2024'],
          ['P3Z5D0', 'Mohamed Khalid', '12 May 2024'],
          ['Q7C8J1', 'Anna Kowalski', '14 May 2024'],
          ['R9M6F2', 'Chen Yu', '16 May 2024'],
          ['T2H4K8', 'Victoria Clark', '18 May 2024'],
        ];
        for (const [i, row] of records.entries()) {
          const tr = util.el('div', `booking-row${i === 2 ? ' selected' : ''}`, list);
          row.forEach((v) => util.el('span', '', tr, v));
        }
        Object.assign(_c, { body, cols, filters, find, list, records, side, view });
      },
  };

  env.site({
    name: 'design-use-travel-change-02',
    template: 'site/base',
    design: { parts },
  });
})();
