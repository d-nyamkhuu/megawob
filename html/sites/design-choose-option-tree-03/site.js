// Design on templates/site/form-pick-autocomplete-01.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-choose-option-tree-03',
    styles: ['site.css'],
    scripts: [],
    template: 'site/choose-option-autocomplete-01',
    design: {
      C: {site:'design-choose-option-tree-03',brand:'Backup Utility',title:'Select Folders',instruction:'top',rail:'',menu:'Select Folders|Backup Schedule|Backup Options|Summary',briefTitle:'Task'},
      parts: {
        'frame.6': (base, S) => function (_c) {
          const { C } = S;
          const { top, u } = _c;
          const controls=u.el('span','ds-window-controls',top);
          ['close','minimize','zoom'].forEach(k=>u.el('i',k,controls));
          u.el('span','ds-brand',top,C.brand);
          u.el('span','ds-window-spacer',top,'');
          if(C.menu){const nav=u.el('nav','ds-menu',document.body);C.menu.split('|').forEach((t,i)=>{const item=u.el('span','ds-navitem'+(i===0?' active':''),nav,'');u.el('span','ds-navicon',item,['▰','◷','⚙','▤'][i]);u.el('span','',item,t);});}
          Object.assign(_c, { controls });
        },
        'frame.7': () => () => {},
        'frame.8': () => () => {},
        'frame.16': () => () => {},
        'frame.18': (base, S) => function (_c) {
          const { C } = S;
          const { briefing, main, u } = _c;
          const stage=u.el('main','aqua-stage',main);
          const side=u.el('aside','ds-sidepanel',main);
          if(_c.mode==='panel')briefing(side,'ds-brief');
          u.el('h2','',side,'About Backups');
          u.el('div','ds-disk-icon',side,'◴');
          u.el('p','',side,'Backups help keep your files safe by copying the selected folders to a secure location. You can choose any combination of folders from the list.');
          u.el('hr','',side);
          u.el('h2','',side,'Tips');
          [['Select the folders you want to include in your backup.'],['You can select folders from different groups.'],['Only the selected folders and their contents will be backed up.']].forEach(x=>{const row=u.el('div','ds-tip',side);u.el('i','',row,'●');u.el('span','',row,x[0]);});
          if(C.rail){/* retained as a site token; no rail in this design */}
          Object.assign(_c, { side, stage });
        },
        'frame.19': () => () => {},
        'frame.20': () => () => {},
        'frame.21': () => () => {},
        'frame.22': () => () => {},
        'frame.23': () => () => {},
        'frame.24': () => function (_c) {
          if (_c.mode === 'toast') {
            const note = _c.briefing(_c.side, 'ds-toast');
            _c.side.insertBefore(note, _c.side.firstChild);
          }
        },
        'frame.35': () => () => {},
        'frame.36': () => () => {},
      },
    },
  });
})();
