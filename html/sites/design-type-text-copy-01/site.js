// Design on templates/site/form-text-login-01.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-type-text-copy-01',
    styles: ['site.css'],
    scripts: [],
    template: 'site/type-text-login-01',
    design: {
      C: {"site": "design-type-text-copy-01", "brand": "Accounts Payable - Demo Company", "title": "", "instruction": "top", "rail": "Vendors|Purchase Orders|Invoices|Payments|Reports", "menu": "File|Edit|View|Records|Payments|Reports|Options|Window|Help", "briefTitle": "Instructions"},
      parts: {
        'frame.9': (base, S) => function (_c) {
          const { u } = _c;
          const tools=u.el('div','ds-tools',document.body);
          [['▯','New'],['▱','Open'],['▤','Delete'],['▣','Print'],['⌕','Find'],['▤▤','Payments']].forEach(([icon,label])=>{const b=u.el('div','ds-tool',tools);u.el('span','ds-tool-icon',b,icon);u.el('span','',b,label);});
          const body=u.el('div','ds-body',document.body);
          Object.assign(_c, { body, tools });
        },
        'frame.19': (base, S) => function (_c) {
          const { briefing, content, main, mode, u } = _c;
          const detail=u.el('section','ds-order-detail',main);
          u.el('h2','',detail,'Purchase Order Details');
          const info=u.el('div','ds-order-info',detail);
          [['Order No.:','PO-1003','Date:','03/10/1994'],['Vendor:','Global Industrial','Status:','Open'],['Description:','Shop equipment and supplies','Order Total:','682.65']].forEach(row=>{const line=u.el('div','ds-info-line',info);row.forEach(t=>u.el('span','',line,t));});
          if(mode==='toast'){const note=briefing(content,'ds-toast');content.insertBefore(note,main);}
          Object.assign(_c, { detail, info });
        },
      },
    },
  });
})();
