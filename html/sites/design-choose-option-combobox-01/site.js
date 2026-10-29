// Design on templates/site/form-pick-autocomplete-01.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-choose-option-combobox-01',
    styles: ['site.css'],
    scripts: [],
    template: 'site/choose-option-autocomplete-01',
    design: {
      C: {site:'design-choose-option-combobox-01',brand:'Inventory Manager',title:'Item Details',instruction:'top',rail:'',menu:'File|Edit|Record|View|Reports|Window|Help',briefTitle:'Task'},
      parts: {
        'frame.7': (base, S) => function (_c) {
          const { C } = S;
          const { top, u } = _c;
          u.el('span','ds-winbuttons',top,'−　▣　×');
          if(C.menu){C.menu.split('|').forEach(t=>top.insertBefore(u.el('span','ds-menuitem',top,t),top.querySelector('.ds-winbuttons')));}
          const titlebar=u.el('div','ds-titlebar',document.body);
          u.el('span','ds-appicon',titlebar,'▧');
          u.el('strong','',titlebar,C.brand);
          u.el('span','ds-close',titlebar,'×');
          const tabs=u.el('nav','ds-tabs',document.body);
          ['▱|Items','♧|Suppliers','▤|Orders','♙|Customers','▥|Reports'].forEach((item,i)=>{const [icon,text]=item.split('|'),t=u.el('div','ds-tab'+(!i?' active':''),tabs);u.el('span','ds-tabicon',t,icon);u.el('span','',t,text);});
          Object.assign(_c, { tabs, titlebar });
        },
        'frame.8': () => () => {},
        'frame.19': (base, S) => function (_c) {
          const { main, u } = _c;
          const stage=u.el('main','ds-stage',main);
          const deco=u.el('div','ds-fakefields',main);
          u.el('div','ds-formtitle',deco,'Item Details');
          [['Category','select'],['Unit Price','short'],['Unit of Measure','select'],['Supplier','select'],['Reorder Level','short'],['Notes','large']].forEach(([name,kind])=>{const row=u.el('div','ds-fakerow '+kind,deco);u.el('span','',row,name);u.el('i','',row);});
          const side=u.el('aside','ds-stats',main);
          u.el('h2','',side,'Inventory Status');
          const stats=u.el('div','ds-statlist',side);
          [['Total Items','248'],['In Stock','206'],['Low Stock','28'],['Out of Stock','14']].forEach(([a,b])=>{const r=u.el('div','',stats);u.el('span','',r,a);u.el('b','',r,b);});
          u.el('h2','ds-categories-title',side,'Categories');
          const table=u.el('div','ds-category-table',side);
          const head=u.el('div','ds-cathead',table);
          u.el('b','',head,'Category');
          u.el('b','',head,'Items');
          [['Bakeware','42'],['Cookware','58'],['Utensils','36'],['Small Appliances','22'],['Food Storage','30'],['Tableware','28'],['Cleaning Supplies','18'],['Miscellaneous','14']].forEach(([a,b])=>{const r=u.el('div','ds-catrow',table);u.el('span','',r,a);u.el('span','',r,b);});
          Object.assign(_c, { deco, head, side, stage, stats, table });
        },
        'frame.20': () => () => {},
        'frame.21': () => () => {},
        'frame.22': () => () => {},
        'frame.23': () => () => {},
        'frame.35': () => () => {},
        'frame.36': () => () => {},
        'frame.38': (base, S) => function (_c) {
          const { ctx, decoyBtn, endBtn, foot, top, u } = _c;
          if(!ctx.finish){
      if(_c.placement==='header'){
        const tools=u.el('div','ds-header-tools',top);top.classList.add('ds-tools-visible');
        if(_c.collide&&_c.collide.where==='header')decoyBtn(tools,_c.collide.text,true);
        _c.submit=endBtn(tools,'ds-submit ds-submit-head',_c.label);
      }else{
        if(_c.collide&&_c.collide.where==='header'){const tools=u.el('div','ds-header-tools',top);top.classList.add('ds-tools-visible');decoyBtn(tools,_c.collide.text,true);}
        if(_c.collide&&_c.collide.where==='footer')decoyBtn(foot,_c.collide.text,true);
        _c.submit=_c.placement==='link'?endBtn(foot,'ds-endlink',`${_c.label} ›`):endBtn(foot,'ds-submit',_c.label);
      }
    }
        },
      },
    },
  });
})();
