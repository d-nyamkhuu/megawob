// Design on templates/site/form-pick-autocomplete-01.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-choose-option-toggles-03',
    styles: ['site.css'],
    scripts: [],
    template: 'site/choose-option-autocomplete-01',
    design: {
      C: {site:'design-choose-option-toggles-03',brand:'Web Explorer',instruction:'header',tabs:['General','Privacy','Content','Connections','Programs']},
      parts: {
        'frame.6': (base, S) => function (_c) {
          const { C } = S;
          const { top, u } = _c;
          u.el('span','ds-appicon',top,'▣');
          u.el('span','ds-brand',top,C.brand);
          const win=u.el('div','ds-window-controls',top);
          ['−','□','×'].forEach(x=>u.el('span','',win,x));
          const body=u.el('div','ds-body',document.body),contentRoot=u.el('div','ds-content',body),width=window.innerWidth,height=window.innerHeight;
          Object.assign(_c, { body, contentRoot, height, width, win });
        },
        'frame.7': () => () => {},
        'frame.8': () => () => {},
        'frame.9': () => () => {},
        'frame.10': () => () => {},
        'frame.11': () => () => {},
        'frame.13': (base, S) => function (_c) {
          const { C } = S;
          const { contentRoot, ctx, height, u, width } = _c;
          if((_c.mode==='panel'&&width<1100)||(_c.mode==='toast'&&height<700))_c.mode='header';
          function briefing(parent,cls){const b=u.el('aside',cls,parent);if(cls==='ds-brief')u.el('h2','',b,'Task reminder');u.el('div','ds-instruction',b,ctx.instruction);return b;}
          if(_c.mode==='header')briefing(contentRoot,'ds-header-note');
          const workspace=u.el('div','ds-workspace',contentRoot),left=u.el('section','ds-left-window',workspace);
          const tabs=u.el('nav','ds-tabs',left);
          C.tabs.forEach((t,i)=>{const tab=u.el('div','ds-tab'+(!i?' active':''),tabs);u.el('span','ds-tab-icon',tab,['▣','🔒','🌐','♧','▤'][i]);u.el('span','',tab,t);});
          const panelNote=_c.mode==='panel'?briefing(workspace,'ds-brief'):null;
          const main=u.el('section','ds-main',left),subhead=u.el('div','ds-subhead',main);
          u.el('h1','',subhead,'Site Settings');
          u.el('p','',subhead,'Manage how Web Explorer works with websites you visit.');
          const stage=u.el('main','ds-stage',main);
          if(_c.mode==='toast'){const note=briefing(contentRoot,'ds-toast');}
          const inspector=u.el('aside','ds-inspector',workspace),inshead=u.el('h2','',inspector,'Site Details');
          if(panelNote)inspector.appendChild(panelNote);
          const siteid=u.el('div','ds-site-id',inspector);
          u.el('span','ds-globe',siteid,'🌐');
          const sitecopy=u.el('div','',siteid);
          u.el('b','',sitecopy,'www.example.com');
          u.el('div','',sitecopy,'http://www.example.com');
          const details=u.el('div','ds-details',inspector);
          [['Type:','Website'],['Connection:','Not encrypted'],['Last visited:','Mar 12, 2000  10:24 AM'],['Cookies:','8 stored'],['Permissions:','Custom']].forEach(pair=>{const row=u.el('div','ds-detail-row',details);u.el('span','',row,pair[0]);u.el('span','',row,pair[1]);});
          u.el('h3','ds-stored-title',inspector,'▤　Stored Data');
          const data=u.el('div','ds-data',inspector);
          [['🍪','Cookies','8 items','24 KB'],['▤','Cached files','12 items','348 KB'],['⚙','Site preferences','3 items','6 KB'],['▤','Local storage','1 item','4 KB']].forEach(line=>{const row=u.el('div','ds-data-row',data);line.forEach(x=>u.el('span','',row,x));});
          Object.assign(_c, { briefing, data, details, inshead, inspector, left, main, panelNote, sitecopy, siteid, stage, subhead, tabs, workspace });
        },
        'frame.14': () => () => {},
        'frame.15': () => () => {},
        'frame.16': () => () => {},
        'frame.17': () => () => {},
        'frame.18': () => () => {},
        'frame.19': () => () => {},
        'frame.20': () => () => {},
        'frame.21': () => () => {},
        'frame.22': () => () => {},
        'frame.23': () => () => {},
        'frame.24': () => () => {},
        'frame.34': (base, S) => function (_c) {
          const { left, u } = _c;
          const foot=u.el('footer','ds-footer',left);
          Object.assign(_c, { foot });
        },
        'frame.35': () => () => {},
        'frame.36': () => () => {},
      },
    },
  });
})();
