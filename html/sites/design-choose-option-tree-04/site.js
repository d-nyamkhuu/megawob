// Design on templates/site/form-pick-autocomplete-01.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-choose-option-tree-04',
    styles: ['site.css'],
    scripts: [],
    template: 'site/choose-option-autocomplete-01',
    design: {
      C: {site:'design-choose-option-tree-04',brand:'BackUp Pro',title:'Select Data to Export',instruction:'top',rail:'',menu:'',briefTitle:'Instructions'},
      parts: {
        'frame.6': (base, S) => function (_c) {
          const { C } = S;
          const { top, u } = _c;
          u.el('span','ds-logo',top,'⬇');
          const brand=u.el('div','ds-brand-wrap',top);
          u.el('span','ds-brand',brand,C.brand);
          u.el('span','ds-tagline',brand,'Protect What Matters');
          u.el('span','ds-motto',top,'Safe　•　 Simple　•　 Reliable');
          const contentRoot=u.el('div','ds-content',document.body),width=window.innerWidth,height=window.innerHeight;
          Object.assign(_c, { brand, contentRoot, height, width });
        },
        'frame.7': () => () => {},
        'frame.8': () => () => {},
        'frame.9': () => () => {},
        'frame.10': () => () => {},
        'frame.11': () => () => {},
        'frame.19': (base, S) => function (_c) {
          const { main, u } = _c;
          const stage=u.el('main','ds-stage',main);
          const inspector=u.el('aside','ds-inspector',main);
          u.el('div','ds-inspector-head',inspector,'Details　⌄');
          u.el('div','ds-product',inspector,'📁　 BackUp Pro');
          u.el('div','ds-product-sub',inspector,'　　 File Backup');
          u.el('div','ds-metadata',inspector,'Item type:　 Application\nVersion:　　 2.3.1\nSize:　　　　 4.8 MB\nModified:　　 Mar 14, 2005');
          u.el('p','ds-about',inspector,'BackUp Pro helps you keep your important files safe by creating a secure copy in the location you choose.');
          Object.assign(_c, { inspector, stage });
        },
        'frame.20': () => () => {},
        'frame.21': () => () => {},
        'frame.22': () => () => {},
        'frame.23': () => () => {},
        'frame.35': (base, S) => function (_c) {
          const { foot, u } = _c;
          const dock=u.el('nav','ds-dock',foot);
          ['⌂|Home','▰|Backup','⟲|Restore','▦|Schedule','⚙|Settings'].forEach((x,i)=>{const q=x.split('|');const b=u.el('button','ds-dock-item'+(!i?' active':''),dock,'');u.el('span','ds-dock-icon',b,q[0]);u.el('span','',b,q[1]);b.type='button';});
          Object.assign(_c, { dock });
        },
        'frame.36': () => () => {},
      },
    },
  });
})();
