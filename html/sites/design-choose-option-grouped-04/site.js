// Design on templates/site/form-pick-autocomplete-01.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-choose-option-grouped-04',
    styles: ['site.css'],
    scripts: [],
    template: 'site/choose-option-autocomplete-01',
    design: {
      C: {
        site: 'design-choose-option-grouped-04',
        brand: 'Inventory Manager',
        title: 'Product Details',
        instruction: 'top',
        rail: '',
        menu: 'File|Edit|View|Records|Window|Help',
        briefTitle: 'Task',
      },
      parts: {
        'frame.5': (base, S) =>
          function (_c) {
            const { u } = _c;
            const win = u.el('div', 'ds-window', document.body);
            const top = u.el('header', 'ds-top', win),
              apple = u.el('span', 'ds-apple', top);
            apple.innerHTML =
              '<svg viewBox="0 0 32 38" aria-hidden="true"><defs><linearGradient id="apple-stripes" x1="0" x2="0" y1="0" y2="1"><stop stop-color="#e34135"/><stop offset=".23" stop-color="#f5a62e"/><stop offset=".43" stop-color="#f3df37"/><stop offset=".62" stop-color="#48a94b"/><stop offset=".8" stop-color="#3577bd"/><stop offset="1" stop-color="#79549d"/></linearGradient></defs><path d="M16 10C12 6 5 8 3 14c-3 9 5 22 10 22 2 0 3-1 5-1s3 1 5 1c4 0 11-13 8-22-2-6-8-8-13-4-1 1-1 1-2 0z" fill="url(#apple-stripes)" stroke="#26364a" stroke-width="1.2"/><path d="M16 8C15 3 18 1 23 1c0 4-2 7-7 7z" fill="#39894a" stroke="#26364a" stroke-width="1"/></svg>';
            Object.assign(_c, { apple, top, win });
          },
        'frame.7': (base, S) =>
          function (_c) {
            const { C } = S;
            const { top, u, win } = _c;
            u.el('span', 'ds-window-controls', top, '−　◇　×');
            if (C.menu) {
              const nav = u.el('nav', 'ds-menu', win);
              C.menu.split('|').forEach((t) => u.el('span', '', nav, t));
            }
            const toolbar = u.el('div', 'ds-toolbar', win),
              icons = [
                '<svg viewBox="0 0 40 40"><path d="M9 3h15l8 8v25H9z" fill="url(#paper)" stroke="#23354d" stroke-width="2"/><path d="M24 3v9h8" fill="#a9c5ef" stroke="#23354d" stroke-width="2"/><path d="M13 20h14M13 25h14M13 30h10" stroke="#75859c"/></svg>',
                '<svg viewBox="0 0 40 40"><path d="M4 13h13l4 4h15l-5 17H3z" fill="url(#folder)" stroke="#263b56" stroke-width="2"/><path d="M5 12l3-6h11l4 5" fill="#fff2a6" stroke="#263b56" stroke-width="2"/><path d="M5 16h29" stroke="#fff" stroke-width="2"/></svg>',
                '<svg viewBox="0 0 40 40"><path d="M8 29L27 6l7 6-19 23-9 2z" fill="url(#pencil)" stroke="#26364b" stroke-width="2"/><path d="M8 29l7 6-9 2z" fill="#f1d7a0" stroke="#26364b"/><path d="M24 10l7 6" stroke="#d34838" stroke-width="3"/></svg>',
                '<svg viewBox="0 0 40 40"><path d="M13 6h14v5H13zM10 12h20l-2 24H12z" fill="url(#metal)" stroke="#26364b" stroke-width="2"/><path d="M15 16v15M20 16v15M25 16v15" stroke="#667488" stroke-width="2"/><path d="M8 12h24" stroke="#fff" stroke-width="2"/></svg>',
                '<svg viewBox="0 0 40 40"><path d="M11 14V5h18v9M9 29H5V16l4-4h22l4 4v13h-4" fill="url(#paper)" stroke="#25364d" stroke-width="2"/><path d="M11 23h18v13H11z" fill="url(#paper)" stroke="#25364d" stroke-width="2"/><path d="M14 27h12M14 31h12" stroke="#65758b"/></svg>',
                '<svg viewBox="0 0 40 40"><path d="M5 5h30v30H5z" fill="url(#paper)" stroke="#26364d" stroke-width="2"/><path d="M10 28h5V17h-5z" fill="#4788dc" stroke="#243a5b"/><path d="M18 28h5V11h-5z" fill="#d84a4a" stroke="#573535"/><path d="M26 28h5V7h-5z" fill="#55a76a" stroke="#36573d"/><path d="M8 31h24" stroke="#26364d"/></svg>',
              ];
            const defs =
              '<svg width="0" height="0" style="position:absolute"><defs><linearGradient id="paper" x2="0" y2="1"><stop stop-color="#fff"/><stop offset="1" stop-color="#b9c9e2"/></linearGradient><linearGradient id="folder" x2="0" y2="1"><stop stop-color="#fff08b"/><stop offset="1" stop-color="#d4a83b"/></linearGradient><linearGradient id="pencil" x2="0" y2="1"><stop stop-color="#fff4b7"/><stop offset="1" stop-color="#d49b32"/></linearGradient><linearGradient id="metal" x2="0" y2="1"><stop stop-color="#fff"/><stop offset="1" stop-color="#a4adba"/></linearGradient></defs></svg>';
            toolbar.insertAdjacentHTML('beforeend', defs);
            ['New', 'Open', 'Edit', 'Delete', 'Print', 'Reports'].forEach((t, i) => {
              if (i === 4) u.el('i', 'ds-tool-sep', toolbar);
              const b = u.el('div', 'ds-tool', toolbar);
              const icon = u.el('b', '', b);
              icon.innerHTML = icons[i];
              u.el('span', '', b, t);
            });
            const body = u.el('div', 'ds-body', win),
              rail = u.el('aside', 'ds-rail', body);
            u.el('h2', '', rail, 'Products');
            const listHead = u.el('div', 'ds-list-head', rail);
            u.el('span', '', listHead, 'Name');
            u.el('span', '', listHead, 'SKU');
            [
              ['Coffee Mug, 12 oz', 'CM-001'],
              ['Thermal Travel Mug', 'TM-002'],
              ['French Press, 8 Cup', 'FP-003'],
              ['Pour-Over Kettle, 1.0 L', 'KT-004'],
              ['Digital Kitchen Scale', 'SC-005'],
              ['Bamboo Coffee Filters', 'FL-006'],
              ['Pour-Over Coffee Dripper, ...', 'DR-007'],
              ['Cold Brew Maker', 'CB-008'],
              ['Espresso Grinder', 'GR-009'],
              ['Ceramic Coffee Canister', 'CN-010'],
              ['Stainless Steel Tumbler', 'TM-011'],
              ['Milk Frothing Pitcher', 'PF-012'],
            ].forEach(([name, sku], i) => {
              const row = u.el('div', i === 0 ? 'ds-product selected' : 'ds-product', rail);
              u.el('span', '', row, name);
              u.el('span', '', row, sku);
            });
            u.el('div', 'ds-count', rail, '12 items');
            Object.assign(_c, { body, defs, icons, listHead, rail, toolbar });
          },
        'frame.8': () => () => {},
        'frame.9': () => () => {},
        'frame.10': () => () => {},
        'frame.17': (base, S) =>
          function (_c) {
            const { contentRoot, u } = _c;
            const summary = u.el('section', 'ds-summary', contentRoot);
            u.el('div', 'ds-product-photo', summary, '');
            const details = u.el('div', 'ds-record-details', summary);
            u.el('h1', '', details, 'Coffee Mug, 12 oz');
            u.el('p', '', details, 'SKU:　　　　 CM-001　　　│　　 Retail Price:　 $6.00');
            u.el('p', '', details, 'Category:　　 Drinkware　│　　 On Hand:　　　 120');
            u.el('p', '', details, 'Supplier:　　 Highland Supply Co.　 Reorder Level:　25');
            u.el('p', '', details, 'Unit Cost:　　 $2.50　　　│　　 Location:　　 A-1-3');
            const tabs = u.el('nav', 'ds-tabs', contentRoot);
            ['Product Details', 'Inventory', 'Pricing', 'Suppliers'].forEach((x, i) =>
              u.el('span', i === 0 ? 'active' : '', tabs, x),
            );
            const main = u.el('div', 'ds-main', contentRoot);
            Object.assign(_c, { details, main, summary, tabs });
          },
        'frame.19': (base, S) =>
          function (_c) {
            const { main, u } = _c;
            const stage = u.el('main', 'ds-stage', main);
            const recordForm = u.el('div', 'ds-record-form', stage);
            [
              ['Category:', 'Drinkware'],
              ['Supplier:', 'Highland Supply Co.'],
              ['Unit Cost:', '$2.50'],
              ['Retail Price:', '$6.00'],
              ['Reorder Level:', '25'],
              ['Location:', 'A-1-3'],
              ['Description:', 'Stoneware mug with a comfortable handle. Holds 12 ounces. Dishwasher safe.'],
            ].forEach(([k, v]) => {
              const row = u.el('div', 'ds-record-row', recordForm);
              u.el('span', '', row, k);
              u.el('b', '', row, v);
            });
            Object.assign(_c, { recordForm, stage });
          },
        'frame.20': () => () => {},
        'frame.21': () => () => {},
        'frame.22': () => () => {},
        'frame.23': () => () => {},
        'frame.35': () => () => {},
        'frame.36': () => () => {},
      },
    },
  });
})();
