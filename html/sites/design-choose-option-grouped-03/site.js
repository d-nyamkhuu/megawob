// Design on templates/site/form-pick-autocomplete-01.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-choose-option-grouped-03',
    styles: ['site.css'],
    scripts: [],
    template: 'site/choose-option-autocomplete-01',
    design: {
      C: {site:'design-choose-option-grouped-03',brand:'Travel Planner',title:'Destination',instruction:'header',rail:'Trips|Calendar|Contacts|Destinations|Reports',menu:'File|Edit|View|Go|Tools|Help',briefTitle:'Instructions'},
      parts: {
        'frame.6': (base, S) => function (_c) {
          const { C } = S;
          const { top, u } = _c;
          u.el('span','ds-brand',top,'◈　'+C.brand);
          u.el('span','ds-window-controls',top,'−　□　×');
        },
        'frame.7': () => () => {},
        'frame.10': (base, S) => function (_c) {
          const { C } = S;
          const { body, u } = _c;
          if(C.rail){const rail=u.el('aside','ds-rail',body);C.rail.split('|').forEach((t,i)=>{const item=u.el('div','ds-rail-item'+(!i?' active':''),rail);u.el('span','ds-rail-icon',item,['▣','▦','▣','◫','▤'][i]);u.el('span','',item,t);});}
        },
        'frame.18': (base, S) => function (_c) {
          const { main, u } = _c;
          const inspector=u.el('aside','ds-inspector',main);
          u.el('h2','ds-pane-title',inspector,'Trip Details');
          [['Trip Name','—'],['Destination','—'],['Dates','—'],['Purpose','—'],['Notes','—']].forEach(([k,v])=>{const row=u.el('div','ds-detail',inspector);u.el('span','',row,k+':');u.el('span','',row,v);});
          const stage=u.el('main','ds-stage',main);
          u.el('h2','ds-pane-title ds-task-title',stage,'New Trip');
          Object.assign(_c, { inspector, stage });
        },
        'frame.19': () => () => {},
        'frame.20': () => () => {},
        'frame.21': () => () => {},
        'frame.22': () => () => {},
        'frame.23': () => () => {},
      },
    },
  });
})();
