// Design on templates/site/form-pick-autocomplete-01.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-choose-option-combobox-05',
    styles: ['site.css'],
    scripts: [],
    template: 'site/choose-option-autocomplete-01',
    design: {
      C: {
        site: 'design-choose-option-combobox-05', brand: 'Products', title: 'Add New Product',
        instruction: 'hidden', rail: '', menu: '', briefTitle: 'Instructions'
      },
      parts: {
        'frame.19': (base) => function (_c) {
          base(_c);
          const { main, stage, u } = _c;
          const aside = u.el('aside', 'catalog', main);
          u.el('h1', '', aside, 'Products');
          u.el('div', 'catalog-count', aside, '24 items');
          const filters = u.el('div', 'catalog-filters', aside);
          u.el('div', 'catalog-search', filters, '⌕　Search products...');
          u.el('div', 'catalog-sort', filters, 'Sort: Name A–Z　⌄');
          const records = [
            ['Abstract Canvas Set','PRD-001','Painting','$18.00','<rect x="7" y="6" width="50" height="40" rx="4" fill="#eadbc0"/><rect x="13" y="10" width="38" height="31" rx="2" fill="#7eb5bb"/><path d="M14 30 24 17l7 8 8-11 12 14v12H14Z" fill="#e87845"/><circle cx="40" cy="17" r="4" fill="#f4d15b"/><path d="m18 37 10-9 10 7 8-6 5 5v7H18Z" fill="#3f8c72"/>'],['Ceramic Mug Kit','PRD-002','Ceramics','$22.00','<rect x="7" y="5" width="50" height="42" rx="4" fill="#eee8dd"/><path d="M20 15h21v20a8 8 0 0 1-8 8h-5a8 8 0 0 1-8-8Z" fill="#f8f6ef" stroke="#bcb5a8" stroke-width="2"/><path d="M41 20h5a6 6 0 0 1 0 12h-5" fill="none" stroke="#bcb5a8" stroke-width="3"/><path d="M24 20h13" stroke="#d4cabc" stroke-width="2"/>'],
            ["Children's Watercolor Set",'PRD-003','Painting','$16.00','<rect x="6" y="5" width="52" height="42" rx="5" fill="#eee4d2"/><g stroke="#fff" stroke-width="1"><rect x="12" y="10" width="12" height="10" rx="2" fill="#e55b49"/><rect x="26" y="10" width="12" height="10" rx="2" fill="#efb83d"/><rect x="40" y="10" width="12" height="10" rx="2" fill="#548e72"/><rect x="12" y="22" width="12" height="10" rx="2" fill="#e68a39"/><rect x="26" y="22" width="12" height="10" rx="2" fill="#5289ae"/><rect x="40" y="22" width="12" height="10" rx="2" fill="#c95343"/><rect x="12" y="34" width="12" height="8" rx="2" fill="#539d9c"/><rect x="26" y="34" width="12" height="8" rx="2" fill="#e4c54f"/><rect x="40" y="34" width="12" height="8" rx="2" fill="#3b6b9c"/></g>'],['DIY Candle Making Kit','PRD-004','Crafts','$24.00','<rect x="7" y="5" width="50" height="42" rx="4" fill="#ddd1bd"/><rect x="14" y="22" width="12" height="20" rx="3" fill="#f1eadc"/><rect x="31" y="16" width="12" height="26" rx="3" fill="#fff8e9"/><rect x="45" y="26" width="8" height="16" rx="3" fill="#e9d9bf"/><path d="M20 20q-6-7 0-12 6 5 0 12m17-6q-6-8 0-13 6 6 0 13m12 10q-5-6 0-11 5 5 0 11" fill="#efa94c"/>'],
            ['Embroidered Patch Set','PRD-005','Textiles','$12.00','<rect x="7" y="5" width="50" height="42" rx="4" fill="#eee6d9"/><path d="M18 32a11 11 0 1 1 19 0l-4 6H22Z" fill="#3a8ca0" stroke="#273e4b" stroke-width="2"/><path d="M38 15q7-8 13 0l-2 8-7 5-7-5Z" fill="#e7b849" stroke="#7b5834" stroke-width="2"/><path d="M17 34q9-9 18 0M39 17l8 4m-5-6 4 9" fill="none" stroke="#f2e9d4" stroke-width="2"/><path d="M44 34c-6-6-13 2 0 10 13-8 6-16 0-10Z" fill="#df604d" stroke="#8e473d" stroke-width="2"/>'],['Introduction to Origami','PRD-006','Paper Crafts','$14.00','<rect x="7" y="5" width="50" height="42" rx="4" fill="#e9e1d2"/><path d="m31 9 15 29-15-7-13 8 7-18Z" fill="#ed8e3f" stroke="#bd622e" stroke-width="2"/><path d="m31 9 2 22 13 7M25 21l8 10-15 8m15-8-8 12" fill="none" stroke="#f7c27a" stroke-width="2"/><path d="m23 19 8-10 6 8" fill="#f2a34e"/>'],
            ['Junior Rock Painting Kit with 12 Stones','PRD-007','Crafts','$20.00','<rect x="7" y="5" width="50" height="42" rx="4" fill="#d7d0c4"/><ellipse cx="22" cy="19" rx="10" ry="7" fill="#488f9a"/><ellipse cx="42" cy="18" rx="9" ry="7" fill="#bf6950"/><ellipse cx="18" cy="36" rx="9" ry="7" fill="#d8b24c"/><ellipse cx="39" cy="36" rx="12" ry="8" fill="#506e8b"/><g fill="#f4e8c9"><circle cx="20" cy="18" r="2"/><circle cx="43" cy="17" r="2"/><circle cx="38" cy="36" r="2"/></g><path d="M15 19q7-5 13 0M35 18l7-4 6 5M33 36q6-6 12 0" fill="none" stroke="#e88c60" stroke-width="2"/>'],['Knitting Starter Kit','PRD-008','Textiles','$28.00','<rect x="7" y="5" width="50" height="42" rx="4" fill="#e8e0d3"/><circle cx="23" cy="31" r="12" fill="#2d8390"/><circle cx="42" cy="29" r="12" fill="#cf625c"/><path d="M14 26q8-8 17 1m-17 4q8-8 17 1m3-5q8-8 16 1m-16 4q8-8 16 1" fill="none" stroke="#a8d0c6" stroke-width="2"/><path d="m13 17 18 25m22-26L34 42" stroke="#a98d68" stroke-width="2"/>'],
            ['Macrame Plant Hanger Kit','PRD-009','Textiles','$26.00','<rect x="7" y="5" width="50" height="42" rx="4" fill="#e8e2d5"/><path d="M20 9v7m24-7v7M20 16l8 10m16-10-8 10M28 26l4 7 4-7m-8 0-5 7 9 5 9-5-5-7" fill="none" stroke="#b8925d" stroke-width="2"/><path d="M25 36h14l-2 8h-10Z" fill="#c8744c"/><path d="M32 28q-9-7-9-14 9 2 9 14m0-1q0-12 9-16 2 9-9 16m-1 3q-12 0-15-8 9-3 15 8" fill="#59815e"/>'],['Model Airplane Kit','PRD-010','Models','$24.00','<rect x="7" y="5" width="50" height="42" rx="4" fill="#ded6c6"/><path d="m13 33 18-8 18-12 4 3-13 16-8 3-8 10-4-1 3-9-10 2Z" fill="#c28d43" stroke="#765c37" stroke-width="2"/><path d="m28 28-7-9 3-2 11 7m3 8 8 7-2 3-12-6" fill="#e7bc67" stroke="#765c37" stroke-width="1.5"/><path d="m15 34 11-3" stroke="#8b6040" stroke-width="2"/>']
          ];
          const list = u.el('div', 'catalog-list', aside);
          records.forEach(r => {
            const row = u.el('div', 'catalog-row', list);
            const thumb = u.el('span', 'catalog-thumb', row);
            thumb.innerHTML = '<svg viewBox="0 0 64 52" aria-hidden="true">' + r[4] + '</svg>';
            const info = u.el('span', 'catalog-info', row);
            u.el('span', 'catalog-name', info, r[0]);
            u.el('span', 'catalog-meta', info, r[1] + '　　　　 ' + r[2]);
            u.el('span', 'catalog-price', row, r[3]);
          });
          const form = u.el('section', 'product-form', main);
          u.el('h1', 'form-title', form, 'Add New Product');
          const sku = u.el('div', 'mock-field sku', form); u.el('label','',sku,'SKU'); u.el('div','mock-input',sku,'Auto-generate');
          const price = u.el('div', 'mock-field price', form); u.el('label','',price,'Price (USD)'); u.el('div','mock-input',price,'$');
          const category = u.el('div', 'mock-field category', form); u.el('label','',category,'Category'); u.el('div','mock-input',category,'Select a category...　⌄');
          const stock = u.el('div', 'mock-field stock', form); u.el('label','',stock,'Stock Quantity'); u.el('div','mock-input',stock,'');
          const description = u.el('div', 'mock-field description', form); u.el('label','',description,'Description'); u.el('div','mock-area',description,'');
          const dock = u.el('nav', 'app-dock', main);
          [['⬡','Products',true],['🛒','Orders'],['♧','Customers'],['⬡','Inventory'],['▥','Reports'],['⚙','Settings']].forEach(x => {
            const item = u.el('div', 'dock-item' + (x[2] ? ' active' : ''), dock);
            u.el('span','dock-icon',item,x[0]); u.el('span','',item,x[1]);
          });
          stage.classList.add('task-stage');
        }
      }
    },
  });
})();
