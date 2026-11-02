/* Logarithmic console design on the shared site frame. */
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
  // Preserve the console's condensed typography and sentence break on template notes.
  function styleNote(note) {
    if (!note) return;
    note.classList.add('instruction');
    const text = note.textContent;
    const nl = text.search(/\.\s+(?=[A-Z])/);
    if (nl > 0) {
      note.textContent = '';
      note.append(document.createTextNode(text.slice(0, nl + 1)), document.createElement('br'),
        document.createTextNode(text.slice(nl + 1).trim()));
    }
  }
  const palette = { bg:'#f7f7f9', panel:'#fafbfc', fg:'#07111d', muted:'#707b91', line:'#e1e4ea' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      document.body.classList.add('library');
      document.body.classList.add('instruction-' + _c.display);
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const left = u.el('div', 'col-left', document.body);
      const brief = u.el('section', 'brief', left);
      u.el('div', 'eyebrow', brief, 'INTERACTION TASK');
      const side = u.el('aside', 'side', document.body);
      const cell = (cls, title) => {
        const c = u.el('div', 'cell ' + cls, side);
        u.el('div', 'eyebrow', c, title);
        return c;
      };
      const scale = cell('c-target', 'SCALE');
      u.el('div', 'big', scale, '×10');
      // The unchanged widget writes here; target information is never shown outside the note.
      const target = u.el('span', '', scale);
      target.dataset.role = 'target';
      target.hidden = true;
      const current = u.el('div', 'big', cell('c-current', 'CURRENT VALUE'));
      current.dataset.role = 'current';
      const actions = u.el('div', 'actions', side);
      Object.assign(_c, { left, brief, side, actions, header:brief });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      styleNote(_c.brief.querySelector('.ref-instruction'));
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.actions;
      base(_c);
      _c.header = header;
      _c.actions.classList.toggle('has-header-end', !!_c.submit);
    },
    'frame.body': () => (_c) => { _c.body = _c.left; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.brief;
      base(_c);
      _c.body = body;
      styleNote(_c.brief.querySelector('.ref-panel-text'));
    },
    'frame.stage': () => (_c) => {
      const stage = _c.util.el('main', 'record-stage', _c.left);
      stage.dataset.role = 'stage';
      _c.util.el('div', 'eyebrow control-eyebrow', stage, 'CONTROL');
      _c.util.el('div', 'eyebrow scale-note', stage, 'LOGARITHMIC SCALE (×10 EACH STEP)');
      _c.stage = stage;
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        _c.brief.appendChild(note);
        styleNote(note.querySelector('.ref-note-text'));
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        _c.actions.appendChild(foot);
        foot.querySelector('.ref-foot-text').hidden = true;
      }
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.actions.appendChild(dock);
    },
    overlay: () => drawOverlay,
  };
  env.site({
    name:'design-set-slider-log-07',
    template:'site/base',
    langs:['en'],
    styles:['templates/site/css/base-hooks.css', 'site.css'],
    design:{
      THEMES:{'design-set-slider-log-07':palette}, LOW_THEME:palette,
      ACCENTS:['#2676ff'], LOW_ACCENTS:['#2676ff'], parts,
    },
  });
})();
