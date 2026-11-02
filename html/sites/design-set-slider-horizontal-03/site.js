/* Rivermere library: native HTML catalog frame, seeded task instruction and dismissible survey. */
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
  const palette = { bg:'#fcf7ee', panel:'#dfd2fc', fg:'#090c30', muted:'#63707c', line:'#090c30' };
  function styleNote(note, text) {
    if (!note || !text) return;
    note.classList.toggle('long-instruction', text.textContent.length > 50);
  }
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The dedicated task pane fits all instruction modes at every viewport.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.className = `library instruction-${_c.display}`;
      if (_c.ctx.finish) document.body.classList.add('finish-mode');
      const main = u.el('div','library-main',document.body);
      // Keep the stage first in paint order, behind the original decorations.
      const stage = u.el('main','record-stage',main);
      stage.dataset.role = 'stage';
      const head = u.el('header','library-header',main);
      const brand = u.el('div','brand',head);
      u.el('h1','',brand,'Palette');
      u.el('div','motto',brand,'SIMPLE IMAGE TOOLS');
      const spark = u.svg('svg',{viewBox:'0 0 50 50',class:'spark','aria-hidden':'true'},head);
      u.svg('path',{d:'M20 5 L8 29',stroke:'#ff8b82','stroke-width':11,'stroke-linecap':'round'},spark);
      u.svg('path',{d:'M40 33 L22 43',stroke:'#ff8b82','stroke-width':11,'stroke-linecap':'round'},spark);
      const deco = u.el('div','deco',main);
      const dsvg = u.svg('svg',{viewBox:'0 0 100 100',class:'deco-svg','aria-hidden':'true',preserveAspectRatio:'none'},deco);
      u.svg('circle',{cx:0,cy:100,r:100,fill:'#ff8b82'},dsvg);
      u.svg('polygon',{points:'0,60 100,0 80,100 20,100',fill:'#a994e8',class:'tri'},dsvg);
      const sq = u.svg('svg',{viewBox:'0 0 180 75',class:'squiggle','aria-hidden':'true'},deco);
      const defs = u.svg('defs',{},sq);
      const fade = u.svg('linearGradient',{id:'squiggle-fade',x1:'0%',x2:'100%'},defs);
      u.svg('stop',{offset:'70%','stop-color':'#aa95ee'},fade);
      u.svg('stop',{offset:'100%','stop-color':'#dfd2fb'},fade);
      u.svg('path',{d:'M7 64 C24 58 28 80 42 66 S50 37 71 48 S91 60 100 39 S111 24 130 31 S147 33 151 19 S167 4 180 15',fill:'none',stroke:'url(#squiggle-fade)','stroke-width':7,'stroke-linecap':'round'},sq);
      const task = u.el('aside','catalog-task',main);
      u.el('div','corner',task);
      u.el('div','dots',task);
      u.el('div','task-label',task,'YOUR TASK');
      const noteSlot = u.el('div','task-note',task);
      const actions = u.el('div','footer-actions',task);
      const toolbar = u.el('div','task-toolbar',actions);
      const footerSlot = u.el('div','task-footer',actions);
      const floatSlot = u.el('div','task-floating',actions);
      const reset = u.el('button','reset',actions,'Reset');
      reset.type = 'button';
      reset.dataset.action = 'reset';
      Object.assign(_c,{ main, task, header:noteSlot, noteSlot, actions, toolbar, footerSlot, floatSlot, libraryStage:stage });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.noteSlot.querySelector('.ref-instruction');
      styleNote(note,note);
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.main; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.noteSlot;
      base(_c);
      _c.body = body;
      const note = _c.noteSlot.querySelector('.ref-panel');
      styleNote(note,note && note.querySelector('.ref-panel-text'));
    },
    'frame.stage': () => (_c) => { _c.stage = _c.libraryStage; },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        _c.noteSlot.appendChild(note);
        styleNote(note,note.querySelector('.ref-note-text'));
        note.querySelector('.ref-note-x').textContent = 'Close';
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        _c.footerSlot.appendChild(foot);
        foot.querySelector('.ref-foot-text').remove();
      }
      document.body.classList.toggle('end-bottom',_c.placement === 'footer');
      document.body.classList.toggle('end-link',_c.placement === 'link');
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.floatSlot.appendChild(dock);
    },
    overlay: () => drawOverlay,
  };
  env.site({
    name:'design-set-slider-horizontal-03',
    template:'site/base',
    langs:['en'],
    styles:['templates/site/css/base-hooks.css','site.css'],
    design:{
      THEMES:{ 'design-set-slider-horizontal-03':palette },
      LOW_THEME:palette,
      ACCENTS:['#ff9188'],
      LOW_ACCENTS:['#ff9188'],
      parts,
    },
  });
})();
