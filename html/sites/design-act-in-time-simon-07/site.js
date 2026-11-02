(function(){
  'use strict';
  const palette={bg:'#fffdf5',panel:'#fffdf8',fg:'#151735',muted:'#555875',line:'#d0cee0'};
  const parts={
    'frame.layout':base=>_c=>{
      base(_c);
      // The design has a dedicated instruction margin at every viewport.
      _c.display=_c.ctx.display||'header';
    },
    'frame.placement':base=>_c=>{
      base(_c);
      _c.nav=false;
      _c.sidebar=false;
      _c.wantFooter=true;
    },
    'frame.header':()=>_c=>{
      const u=_c.util,body=document.body;
      if(document.activeElement&&document.activeElement!==body)document.activeElement.blur();
      const selection=window.getSelection();if(selection)selection.removeAllRanges();
      const layout=u.el('div','ds-layout',body);
      const margin=u.el('section','ds-margin',layout);
      const header=u.el('div','ds-margin-note',margin);
      const documentPanel=u.el('section','ds-document',layout);
      if(_c.ctx.finish)documentPanel.classList.add('ds-finish');
      const toolbar=u.el('div','ds-actions',documentPanel);
      const tools=u.el('aside','ds-tools',layout);
      ['coral','lilac','mist','mist'].forEach(c=>u.el('i','ds-tool-dot '+c,tools));
      u.el('span','ds-tool-menu',tools,'☰');
      Object.assign(_c,{layout,margin,header,documentPanel,toolbar});
    },
    'frame.nav':()=>()=>{},
    'frame.instruction':base=>_c=>{
      base(_c);
      const note=_c.header.querySelector('.ref-instruction');
      if(note){
        _c.header.classList.add('ds-instruction-card','ds-instruction-header');
        note.classList.add('ds-instruction');
      }
    },
    'frame.tools':base=>_c=>{
      const header=_c.header;
      _c.header=_c.toolbar;
      base(_c);
      _c.header=header;
    },
    'frame.body':()=>_c=>{_c.body=_c.documentPanel;},
    'frame.panel':base=>_c=>{
      const body=_c.body;
      _c.body=_c.margin;
      base(_c);
      _c.body=body;
      const panel=_c.margin.querySelector('.ref-panel');
      if(panel){
        panel.classList.add('ds-instruction-card','ds-instruction-panel');
        panel.querySelector('.ref-panel-title').classList.add('ds-note-label');
        panel.querySelector('.ref-panel-text').classList.add('ds-instruction');
      }
    },
    'frame.stage':()=>_c=>{_c.stage=_c.util.el('main','ds-stage',_c.documentPanel);},
    'frame.toast':base=>_c=>{
      base(_c);
      if(_c.display==='toast'){
        const note=document.body.querySelector('.ref-note');
        note.classList.add('ds-instruction-card','ds-instruction-toast');
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        _c.margin.appendChild(note);
      }
    },
    'frame.footer':base=>_c=>{
      base(_c);
      const foot=document.body.querySelector('.ref-foot');
      if(foot)_c.toolbar.appendChild(foot);
    },
    'frame.floating':base=>_c=>{
      base(_c);
      const dock=document.body.querySelector('.ref-float-dock');
      if(dock)_c.toolbar.appendChild(dock);
    },
    overlay:()=>(ctx)=>{
      const u=ctx.util,el=u.el('section','ds-overlay ds-overlay-'+ctx.kind,document.body);el.dataset.role='overlay';
      const texts={cookie:'We use cookies to remember your preferences.',toast:'Changes synced.',chat:'Hello. How can we help?',promo:'Try our new workspace.',banner:'Scheduled maintenance tonight.'};
      u.el('div','',el,texts[ctx.kind]);const dismiss=u.el('button','',el,ctx.kind==='cookie'?'Accept all':'Close');dismiss.addEventListener('click',()=>ctx.dismiss('close'));return{el,dismiss,ttlSteps:ctx.kind==='toast'?4:0};
    }
  };
  env.site({
    name:'design-act-in-time-simon-07',template:'site/base',langs:['en'],
    styles:['templates/site/css/base-hooks.css','site.css'],
    design:{THEMES:{'design-act-in-time-simon-07':palette},LOW_THEME:palette,ACCENTS:['#7050e8'],LOW_ACCENTS:['#7050e8'],parts}
  });
})();
