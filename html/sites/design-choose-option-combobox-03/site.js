// Design on templates/site/form-pick-autocomplete-01.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-choose-option-combobox-03',
    styles: ['site.css'],
    scripts: [],
    template: 'site/choose-option-autocomplete-01',
    design: {
      C: {site:'design-choose-option-combobox-03',brand:'Inventory Manager',title:'Add Inventory Item',instruction:'top',rail:'',menu:'',briefTitle:'Instructions'},
      parts: {
        'frame.6': (base, S) => function (_c) {
          const { C } = S;
          const { top, u } = _c;
          u.el('span','ds-app-icon',top,'▣');
          u.el('span','ds-brand',top,C.brand);
          const win=u.el('span','ds-window-controls',top);
          ['−','□','×'].forEach((x,i)=>u.el('span','ds-window-control w'+i,win,x));
          u.el('div','ds-slimbar',document.body);
          Object.assign(_c, { win });
        },
        'frame.7': () => () => {},
        'frame.19': (base, S) => function (_c) {
          const { main, u } = _c;
          const stage=u.el('main','ds-stage',main);
          const inspector=u.el('aside','ds-inspector',main);
          u.el('h2','',inspector,'Product Details');
          const rows=[['Product','—'],['SKU','—'],['Category','—'],['Unit Price','—'],['Quantity On Hand','—'],['Reorder Level','—'],['Supplier','—'],['Description','—']];
          const detailRows=u.el('div','ds-detail-rows',inspector);
          rows.forEach((row,i)=>{const line=u.el('div','ds-detail-row'+(i===7?' description':''),detailRows);u.el('span','',line,row[0]+':');u.el('span','',line,row[1]);});
          Object.assign(_c, { detailRows, inspector, rows, stage });
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
