// Design on templates/site/drag-slider-horizontal-11.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-set-slider-player-03',
    styles: ['site.css'],
    scripts: [],
    template: 'site/set-slider-horizontal-11',
    design: {
      parts: {
        'frame.12': (base, S) => function (_c) {
          const { head, u } = _c;
          u.el('div','compass',head,'✳');
        },
        'frame.14': (base, S) => function (_c) {
          const { brand, head, u } = _c;
          u.el('h1','',brand,'Navigator');
          u.el('div','motto',brand,'M E D I A   C O M P A N I O N');
          u.el('div','film-reel',head,'◉');
        },
        'frame.15': () => () => {},
        'frame.16': () => () => {},
        'frame.17': () => () => {},
        'frame.21': (base, S) => function (_c) {
          const { u } = _c;
          const shell=u.el('div','app-shell',document.body);
          const rail=u.el('nav','left-rail',shell);
          for(const [icon,name] of [['▤','Media Library'],['▧','Photos'],['♫','Music'],['◉','Videos'],['★','Favorites'],['⚙','Settings']]){
        const item=u.el('div','rail-item',rail);u.el('span','rail-icon',item,icon);u.el('span','',item,name);
      }
          const workspace=u.el('div','workspace',shell);
          const tabs=u.el('div','top-tabs',workspace);
          for(const [name,active] of [['Now Playing',true],['Library',false],['Playlists',false],['CD Guide',false]]){const t=u.el('div','app-tab'+(active?' active':''),tabs,name);}
          const body=u.el('div','library-main',workspace);
          const task=u.el('section','player-panel',body);
          Object.assign(_c, { body, rail, shell, tabs, task, workspace });
        },
        'frame.22': () => () => {},
        'frame.23': () => () => {},
        'frame.24': () => () => {},
        'frame.25': () => () => {},
        'frame.27': (base, S) => function (_c) {
          const { ctx, instruction, task, u } = _c;
          if(ctx.display==='hidden'||ctx.display==='panel'||ctx.display==='toast')instruction.hidden=true;
          if(ctx.display==='header')instruction.classList.add('header-note');
          if(ctx.display==='toast')instruction.classList.add('toast-note');
          const stage=u.el('main','record-stage',task);
          Object.assign(_c, { stage });
        },
        'frame.28': () => () => {},
        'frame.29': () => () => {},
        'frame.30': () => () => {},
        'frame.32': (base, S) => function (_c) {
          const { body, ctx, instruction, label, makeSubmit, placement, task, u, workspace } = _c;
          const controls=u.el('div','task-toolbar',task);
          if(!ctx.finish&&placement==='footer')_c.submit=makeSubmit(controls,'primary',label);
          const right=u.el('aside','secondary-panel',body);
          if(ctx.display==='panel'){right.prepend(instruction);instruction.hidden=false;instruction.classList.add('panel-note');}
          const sideTabs=u.el('div','side-tabs',right);
          u.el('div','app-tab active',sideTabs,'Playlist');
          u.el('div','app-tab',sideTabs,'Details');
          const summary=u.el('div','playlist-summary',right);
          u.el('strong','',summary,'Mountain Landscapes');
          u.el('span','',summary,'4 items  •  23:12 total');
          for(const [i,[img,title,time]] of [['Alpine Lakes','Alpine Lakes','5:27'],['Forest Streams','Forest Streams','6:14'],['Highland Sunsets','Highland Sunsets','5:48'],['Winter Peaks','Winter Peaks','5:43']].entries()){
        const row=u.el('div','playlist-row'+(title==='Alpine Lakes'?' selected':''),right);
        u.el('div','playlist-thumb thumb-'+i,row);
        u.el('strong','',row,title);u.el('span','',row,time);
      }
          const footer=u.el('footer','library-footer',workspace);
          const status=u.el('div','status-count',footer,'NOW PLAYING  ·  MEDIA COMPANION');
          const note=u.el('div','footer-note',footer,'Ready');
          Object.assign(_c, { controls, footer, note, right, sideTabs, status, summary });
        },
        'frame.33': () => () => {},
        'frame.34': () => () => {},
        'frame.35': () => () => {},
        'frame.36': () => () => {},
        'frame.37': () => () => {},
        'frame.38': () => () => {},
        'frame.39': () => () => {},
        'frame.40': () => () => {},
        'frame.41': () => () => {},
        'frame.42': () => () => {},
        'frame.43': () => () => {},
        'frame.44': () => () => {},
        'frame.45': () => () => {},
        'frame.48': (base, S) => function (_c) {
          const { actions, ctx, label, makeSubmit, placement } = _c;
          if(!ctx.finish&&placement==='note')_c.submit=makeSubmit(actions,'primary',label);
        },
      },
    },
  });
})();
