/* Rivermere library: native HTML catalog frame, seeded task instruction and dismissible survey. */
(function () {
  'use strict';
  function books(parent) {
    const svg = env.util.svg('svg', {viewBox:'0 0 100 100',class:'books', 'aria-hidden':'true'}, parent);
    const u = env.util;
    u.svg('ellipse',{cx:50,cy:86,rx:44,ry:7,fill:'#c9c4b7'},svg);
    for (const [x,y,w,h,color,angle] of [[12,17,14,68,'#c1a17d',8],[31,13,16,74,'#be986d',1],[47,9,19,79,'#994527',0],[67,17,22,68,'#954c32',-2]]) {
      const g=u.svg('g',{transform:`rotate(${angle} ${x+w/2} ${y+h})`},svg);
      u.svg('path',{d:`M${x} ${y}l6 -3h${w}v${h}l-6 3h-${w}Z`,fill:color,stroke:'#50392b','stroke-width':1.4},g);
      u.svg('path',{d:`M${x} ${y}h${w}v${h}M${x+w} ${y}l6 -3M${x+3} ${y+6}h${w-6}M${x+3} ${y+11}h${w-6}M${x+3} ${y+h-8}h${w-6}`,fill:'none',stroke:'#513b2c'},g);
      u.svg('path',{d:`M${x+4} ${y+18}h${w-8}M${x+4} ${y+21}h${w-8}`,stroke:'#dabf96',fill:'none'},g);
    }
  }
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
  const palette = { bg:'#f2efe8', panel:'#f7f3e9', fg:'#171713', muted:'#53533e', line:'#b49a55' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.className = `library instruction-${_c.display}`;
      const head = u.el('header', 'library-header', document.body);
      u.el('h1', '', head, 'Willow & Birch');
      u.el('div', 'bar', head);
      u.el('div', 'motto', head, 'Photo Studio');
      u.el('div', 'established', head, 'Simple tools. Brighter stories.');
      const main = u.el('div', 'library-main', document.body);
      const photo = u.el('section', 'photo-pane', main);
      u.el('div', 'photo', photo);
      const task = u.el('section', 'catalog-task', main);
      u.el('h2', '', task, 'Edit Image');
      const noteSlot = u.el('div', 'instruction-slot', task);
      noteSlot.hidden = _c.display === 'hidden';
      const actions = u.el('div', 'footer-actions', task);
      const reset = u.el('button', 'reset', actions, 'Reset');
      reset.type = 'button';
      reset.dataset.action = 'reset';
      Object.assign(_c, { header:noteSlot, main, task, noteSlot, actions });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('instruction', 'instruction-header');
        if (note.textContent.length < 65) note.classList.add('instruction-short');
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.actions;
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
      if (note) note.classList.add('instruction', 'instruction-panel');
    },
    'frame.stage': () => (_c) => {
      const stage = _c.util.el('main', 'record-stage', _c.task);
      stage.dataset.role = 'stage';
      _c.task.insertBefore(stage, _c.actions);
      _c.stage = stage;
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('instruction', 'instruction-toast');
        _c.noteSlot.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const u = _c.util;
      const footer = u.el('footer', 'library-footer', document.body);
      const left = u.el('div', 'footer-left', footer, 'Edit  /  Refine  /  Export');
      const foot = document.body.querySelector('.ref-foot');
      left.appendChild(foot);
      // Keep auxiliary actions in the editing pane; end controls stay in the status bar.
      const tools = foot.querySelector('.ref-tools');
      for (const extra of tools.querySelectorAll('.ref-xtra')) _c.headerTools.appendChild(extra);
      u.el('div', 'footer-motto', footer, 'Beauty lives in a calmer light.');
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) {
        const footer = document.body.querySelector('.library-footer');
        footer.classList.add('has-floating');
        footer.appendChild(dock);
      }
    },
    overlay: () => drawOverlay,
  };
  env.site({
    name:'design-set-slider-horizontal-09',
    template:'site/base',
    langs:['en'],
    styles:['templates/site/css/base-hooks.css', 'site.css'],
    design:{
      THEMES:{ 'design-set-slider-horizontal-09':palette },
      LOW_THEME:palette,
      ACCENTS:['#b49a55'],
      LOW_ACCENTS:['#b49a55'],
      parts,
    },
  });
})();
