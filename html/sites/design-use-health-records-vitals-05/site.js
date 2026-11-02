// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const paths={
    Home:'M2 11 12 2l10 9h-3v11h-5v-7h-4v7H5V11Z',
    Patients:'M8 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm8-1a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM1 22v-5c0-6 14-6 14 0v5Zm15 0v-6c0-2-1-3-2-4 5-1 9 1 9 5v5Z',
    Schedule:'M4 4h16v18H4ZM7 1v6M17 1v6M4 9h16M8 12v7M12 12v7M16 12v7M6 15h12',
    Orders:'M4 2h12l4 4v16H4ZM14 2v6h6M7 12h10M7 16h10',
    Medications:'M5 20a5 5 0 0 1-1-7l8-10a5 5 0 0 1 8 6l-8 10a5 5 0 0 1-7 1ZM8 9l8 6',
    Vitals:'M2 3h20v18H2ZM4 12h4l2-6 4 13 2-7h4',
    Beds:'M2 4v18M22 9v13M2 17h20M5 8h5v6H5ZM11 10h9v4h-9Z',
    Reports:'M3 14h4v8H3ZM10 8h4v14h-4ZM17 2h4v20h-4Z'
  };
  const parts = {
    overlay: (base,S) => (ctx) => {
      const result=base(ctx);
      if(ctx.kind==='banner') {
        const header=document.querySelector('.ref-task');
        result.el.style.setProperty('top',`${header.getBoundingClientRect().bottom}px`,'important');
      }
      return result;
    },
    'frame.header': (base,S) => (c) => {
      base(c);
      const u=c.util, header=c.header;
      const title=u.el('div','mercy-titlebar',header);u.el('b','',title,'Mercy Health ');u.el('b','mercy-lime',title,'EHR');
      u.el('span','mercy-window-buttons',title,'—     ▣     ×');
      const menu=u.el('div','mercy-menubar',header);
      for(const word of ['File','Edit','View','Patient','Chart','Orders','Results','Scheduling','Bed Management','Tools','Help'])u.el('span','',menu,word);
      u.el('div','mercy-search',menu,'⌕   Search patients');u.el('span','mercy-account',menu,'●   A. Carter, RN   ⌄');
      const toolbar=u.el('div','mercy-modules',header);
      for(const label of Object.keys(paths)) {
        const item=u.el('div',label==='Vitals'?'mercy-module active':'mercy-module',toolbar);
        const svg=u.svg('svg',{viewBox:'0 0 24 24','aria-hidden':'true'},item);
        u.svg('path',{d:paths[label]},svg);u.el('span','',item,label);
      }
    }
  };

  env.site({
    name: 'design-use-health-records-vitals-05',
    template: 'site/base',
    design: { parts },
  });
})();
