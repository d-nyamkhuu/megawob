(function(){'use strict';
const palette={bg:'#fffdf5',panel:'#fffef7',fg:'#102b59',muted:'#527087',line:'#174278'};
const parts={
  'frame.layout':(base)=>(_c)=>{
    base(_c);
    // Preserve the original panel fallback and the dedicated toast row.
    if(_c.display==='panel'&&(_c.W<1108||_c.H<768))_c.display='header';
  },
  'frame.placement':(base)=>(_c)=>{
    base(_c);_c.wantFooter=true;_c.nav=false;_c.sidebar=false;
  },
  'frame.header':()=>(_c)=>{
    const u=_c.util;
    document.body.className='pixel-workstation';
    const app=u.el('main','app note-'+_c.display,document.body);
    const top=u.el('header','top',app);
    u.el('span','brand-mark',top,'✥');
    u.el('span','brand-name',top,'Treasure Finder');
    u.el('nav','top-links',top,'Maps　|　Help　|　Sign Out');
    const overview=u.el('section','overview',app);
    const search=u.el('div','search-card',overview);
    u.el('strong','search-title',search,'Search Area');
    u.el('div','search-meta',search,'Region:　Pine Lake\nView:　Overhead\nZoom:　100%');
    u.el('div','map-legend',search,'🌲　= Trees\n🪨　= Rocks\n≈　= Water\n⌂　= Cabin');
    const map=u.el('div','map-frame',overview);
    u.el('i','map-rock rock-one',map);
    u.el('i','map-rock rock-two',map);
    u.el('i','map-cabin',map);
    const compass=u.el('div','compass-panel',overview);
    u.el('div','compass-rose',compass,'✥');
    u.el('div','scale',compass,'0　　100　　200　　300\nMeters');
    const tabs=u.el('nav','tabs',app);
    for(const [label,on] of [['Find',true],['Map Layers',false],['Preferences',false],['About',false]]){
      const tab=u.el('div','tab'+(on?' active':''),tabs,label);
      if(on)tab.setAttribute('aria-current','page');
    }
    const lower=u.el('section','lower',app);
    const left=u.el('section','task-panel',lower);
    u.el('h2','panel-title',left,'Search activity');
    u.el('div','search-help',left,'Map session ready.');
    u.el('div','hint-label',left,'Hints:');
    u.el('div','hint-box',left,'');
    u.el('div','prior-label',left,'Previous click:');
    u.el('div','prior-feedback',left,'❄　 COLD　(farther away)');
    const right=u.el('section','settings-panel',lower);
    const collapsed=u.el('div','accordion collapsed',right);
    u.el('span','triangle',collapsed,'▶');
    u.el('b','',collapsed,'Task controls');
    u.el('span','hidden-label',collapsed,'(hidden)');
    const show=u.el('button','show-controls',collapsed,'Show controls');
    show.type='button';
    const prefs=u.el('div','accordion expanded',right);
    u.el('div','accordion-head',prefs,'▼　 Preferences');
    const prefBody=u.el('div','pref-body',prefs);
    u.el('span','pref-label',prefBody,'Map style:');
    u.el('div','fake-select',prefBody,'Classic　 ▾');
    u.el('span','pref-label labels-label',prefBody,'Show labels:');
    u.el('span','checked',prefBody,'☑　On');
    u.el('span','pref-label terrain-label',prefBody,'Terrain detail:');
    u.el('span','radio-row',prefBody,'◯　Low　　 🔘　Medium　　 ◯　High');
    u.el('span','checked grid-check',prefBody,'☑　Show grid');
    u.el('span','unchecked',prefBody,'□　Show coordinates');
    show.setAttribute('aria-expanded','false');
    show.addEventListener('click',()=>{
      collapsed.classList.toggle('opened');
      const opened=collapsed.classList.contains('opened');
      app.classList.toggle('controls-open',opened);
      show.setAttribute('aria-expanded',String(opened));
      collapsed.querySelector('.triangle').textContent=opened?'▼':'▶';
      show.textContent=opened?'Hide controls':'Show controls';
    });
    Object.assign(_c,{app,top,tabs,lower,left,map,header:lower});
  },
  'frame.nav':()=>()=>{},
  'frame.instruction':(base)=>(_c)=>{
    base(_c);
    const note=_c.lower.querySelector('.ref-instruction');
    if(note)_c.lower.prepend(note);
    const spacer=_c.lower.querySelector('.ref-spacer');
    if(spacer)spacer.remove();
  },
  'frame.tools':(base)=>(_c)=>{
    const h=_c.header;_c.header=_c.tabs;base(_c);_c.header=h;
  },
  'frame.body':()=>(_c)=>{_c.body=_c.lower;},
  'frame.panel':(base)=>(_c)=>{
    const body=_c.body;_c.body=_c.left;base(_c);_c.body=body;
    const note=_c.left.querySelector('.ref-panel');
    if(note)_c.left.insertBefore(note,_c.left.querySelector('.search-help'));
  },
  'frame.stage':()=>(_c)=>{_c.stage=_c.util.el('section','stage',_c.map);},
  'frame.toast':(base)=>(_c)=>{
    base(_c);
    const note=document.body.querySelector('.ref-note');
    if(note)_c.lower.prepend(note);
  },
  'frame.footer':(base)=>(_c)=>{
    base(_c);
    const foot=document.body.querySelector('.ref-foot');
    foot.classList.add('bottom');_c.app.appendChild(foot);
    const text=foot.querySelector('.ref-foot-text');
    text.classList.add('tip-copy');text.textContent='Tip:　Map preferences are available in the panel above.';
    const icon=_c.util.el('span','info-icon',foot,'i');foot.prepend(icon);
    _c.foot=foot;
  },
  'frame.floating':(base)=>(_c)=>{
    base(_c);
    const dock=document.body.querySelector('.ref-float-dock');
    if(dock)_c.foot.appendChild(dock);
  },
  overlay:()=>(ctx)=>{
    const u=ctx.util,el=u.el('div','overlay '+ctx.kind,document.body);
    const messages={cookie:'This application stores preferences on your device.',toast:'Your workspace has been synced.',chat:'Need help with this exercise?',promo:'Try the new practice collection.',banner:'An updated practice collection is available.'};
    u.el('span','',el,messages[ctx.kind]);
    const dismiss=u.el('button','',el,ctx.kind==='cookie'?'Accept':'Dismiss');
    dismiss.addEventListener('click',ctx.dismiss);return {el,dismiss};
  }
};
env.site({name:'design-solve-puzzle-hot-cold-12',template:'site/base',langs:['en'],
  styles:['templates/site/css/base-hooks.css','site.css'],
  design:{THEMES:{site:palette},LOW_THEME:palette,ACCENTS:['#0784a0'],LOW_ACCENTS:['#0784a0'],parts}
});
})();
