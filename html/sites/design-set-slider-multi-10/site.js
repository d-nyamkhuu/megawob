/* VistaEdit design on the shared site frame. */
(function () {
  'use strict';
  function drawOverlay(ctx) {
      const u=ctx.util;
      const el=u.el('aside','survey-drawer overlay-'+ctx.kind,document.body);el.setAttribute('role','dialog');
      const survey=ctx.kind==='chat';
      const title={chat:'We value your feedback',cookie:'Your privacy matters',toast:'Catalog notice',promo:'Support your library',banner:'Library service notice'}[ctx.kind];
      u.el('h2','',el,title);
      const x=u.el('button','survey-x',el,'×');x.setAttribute('aria-label','Close notice');x.onclick=()=>ctx.dismiss('close');
      if(survey){
        u.el('p','survey-intro',el,'Quick survey (2 questions)');u.el('hr','',el);
        const q1=u.el('div','survey-question',el,'1. How easy was it to find what you needed today?');
        const choices=u.el('div','survey-choices',el);
        ['Very easy','Somewhat easy','Neither easy nor difficult','Somewhat difficult','Very difficult'].forEach((label)=>{
          const row=u.el('label','',choices);const radio=u.el('input','',row);radio.type='radio';radio.name='ease';radio.value=label;u.el('span','',row,label);
        });
        u.el('div','survey-question second',el,'2. What could we improve?');
        const dropdown=u.el('div','survey-dropdown',el);
        const toggle=u.el('button','survey-select',dropdown,'Select an option…');toggle.type='button';toggle.setAttribute('aria-expanded','false');
        const options=u.el('div','survey-options',dropdown);options.hidden=true;
        for(const label of ['Finding records','Image quality','Help and guidance']){const b=u.el('button','',options,label);b.type='button';b.onclick=()=>{toggle.textContent=label;options.hidden=true;toggle.setAttribute('aria-expanded','false');};}
        toggle.onclick=()=>{options.hidden=!options.hidden;toggle.setAttribute('aria-expanded',String(!options.hidden));};
      }else{
        u.el('p','survey-intro',el,{cookie:'This local catalog can remember your display preferences.',toast:'The record is ready for editing.',promo:'Discover the library’s growing digital archive.',banner:'The digital catalog is available offline.'}[ctx.kind]);
      }
      const dismiss=u.el('button','primary survey-close',el,survey?'Close survey':ctx.kind==='cookie'?'Reject optional':'Dismiss');dismiss.type='button';dismiss.onclick=()=>ctx.dismiss('dismiss');
      return {el,dismiss,ttlSteps:ctx.kind==='toast'?5:0};
  }
  function formatNote(note, u) {
    if (!note) return;
    const text = note.textContent;
    const trailing = text.search(/(?:Drag the|Use the handles|Use handles|Click the)/);
    if (trailing > 0) {
      note.textContent = '';
      u.el('strong', '', note, text.slice(0, trailing));
      u.el('span', '', note, text.slice(trailing));
    }
  }
  const palette = {bg:'#f4f6fa', panel:'#ffffff', fg:'#121c30', muted:'#586780', line:'#d1d7e3'};
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      document.body.classList.add('fluent', 'instruction-' + _c.display);
      document.body.dataset.instruction = _c.display;
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const title=u.el('header','fl-title',document.body);
      const ico=u.svg('svg',{viewBox:'0 0 24 24',class:'fl-icon','aria-hidden':'true'},title);
      const iconDefs=u.svg('defs',{},ico);
      const iconGradient=u.svg('linearGradient',{id:'vista-icon',x1:0,y1:0,x2:0,y2:1},iconDefs);
      u.svg('stop',{offset:0,'stop-color':'#8ac9ff'},iconGradient);
      u.svg('stop',{offset:1,'stop-color':'#236bd5'},iconGradient);
      u.svg('rect',{x:0,y:1,width:24,height:22,rx:5,fill:'url(#vista-icon)'},ico);
      u.svg('path',{d:'M2 17l6-9 4 6 3-9 7 12z',fill:'#fff'},ico);
      u.svg('path',{d:'M8 8l4 6h-6z',fill:'#dceeff'},ico);
      u.el('span','fl-appname',title,'VistaEdit');
      const wc=u.el('div','fl-wc',title);
      const wsvg=(d)=>{const s=u.svg('svg',{viewBox:'0 0 12 12',class:'fl-wbtn','aria-hidden':'true'},wc);u.svg('path',{d,fill:'none',stroke:'#222','stroke-width':1},s);};
      wsvg('M1 6h10');wsvg('M1.5 1.5h9v9h-9z');wsvg('M1 1l10 10M11 1L1 11');
      const header=u.el('div','fl-brief',document.body);
      Object.assign(_c,{header,title,wc});
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      formatNote(_c.header.querySelector('.ref-instruction'), _c.util);
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.title;
      base(_c);
      _c.header = header;
      _c.title.insertBefore(_c.headerTools, _c.wc);
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div','fl-body',document.body);
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      formatNote(_c.body.querySelector('.ref-panel-text'), _c.util);
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main','fl-stage',_c.body);
      _c.stage.dataset.role='stage';
      const photo=_c.util.el('div','fl-photo',document.body);
      photo.setAttribute('aria-hidden','true');
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      formatNote(document.body.querySelector('.ref-note-text'), _c.util);
    },
    'frame.footer': (base) => (_c) => {
      const u=_c.util;
      const footer=u.el('footer','fl-footer',document.body);
      const settings=u.el('div','fl-settings',footer);
      const gear=u.svg('svg',{viewBox:'0 0 24 24',class:'fl-gear','aria-hidden':'true'},settings);
      u.svg('circle',{cx:12,cy:12,r:3.2,fill:'none',stroke:'#222','stroke-width':1.6},gear);
      u.svg('path',{d:'M9 3l1-1h4l1 3 2 1 3-1 2 3-2 2v3l2 2-2 3-3-1-2 1-1 3h-4l-1-3-2-1-3 1-2-3 2-2v-3L2 8l2-3 3 1 2-1Z',stroke:'#27334c','stroke-width':1.6,'stroke-linejoin':'round',fill:'none'},gear);
      u.el('span','',settings,'Settings');
      const actions=u.el('div','fl-actions',footer);
      const reset=u.el('button','reset',actions,'Reset');reset.type='button';reset.dataset.action='reset';
      base(_c);
      const foot=document.body.querySelector('.ref-foot');
      actions.appendChild(foot);
      Object.assign(_c,{footer,actions});
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock=document.body.querySelector('.ref-float-dock');
      if(dock) _c.footer.appendChild(dock);
    },
    overlay: () => drawOverlay,
  };
  env.site({
    name:'design-set-slider-multi-10',
    template:'site/base',
    langs:['en'],
    styles:['fluent.css','templates/site/css/base-hooks.css','site.css'],
    design:{THEMES:{site:palette},LOW_THEME:palette,ACCENTS:['#317ff5'],LOW_ACCENTS:['#317ff5'],parts},
  });
})();
