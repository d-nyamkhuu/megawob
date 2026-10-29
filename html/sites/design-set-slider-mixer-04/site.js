// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
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
      const dismiss=(reason)=>{if(ctx.initial){document.body.classList.add('survey-closed');env.reanchor();env.log('reference-obstruction-dismiss',{reason});}ctx.dismiss(reason);};
      const survey=ctx.kind==='chat';
      const title={chat:'We value your feedback',cookie:'Your privacy matters',toast:'Catalog notice',promo:'Support your library',banner:'Library service notice'}[ctx.kind];
      u.el('h2','',el,title);
      const x=u.el('button','survey-x',el,'×');x.setAttribute('aria-label','Close notice');x.onclick=()=>dismiss('close');
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
      const closeButton=u.el('button','primary survey-close',el,survey?'Close survey':ctx.kind==='cookie'?'Reject optional':'Dismiss');closeButton.type='button';closeButton.onclick=()=>dismiss('dismiss');
      return {el,dismiss:closeButton,ttlSteps:ctx.kind==='toast'?5:0};
  }
  env.site({
    name: 'design-set-slider-mixer-04',
    styles: ['site.css'],
    scripts: [],
    overlay: drawOverlay,
    template: 'site/reorder-items-list-03',
    design: {
      parts: {
        'frame.1': (base, S) => function (_c) {
          const { ctx } = _c;
          const u=ctx.util;
          const endRng=ctx.rng.fork('chrome/end');
          const placement=endRng.pick(['footer','footer','header','note']);
          const endLabels=ctx.content&&ctx.content.END_LABELS;
          const endLabel=endRng.pick(Array.isArray(endLabels)&&endLabels.length?endLabels:['Submit','Done','Finish','Continue','Save','OK','Confirm','Apply','Complete',"I'm done"]);
          const label=typeof endLabel==='string'?endLabel:(endLabel.label||endLabel.text||endLabel.name||String(endLabel));
          const collideRng=ctx.rng.fork('chrome/collide');
          const collisionPool=(Array.isArray(endLabels)&&endLabels.length?endLabels:['Submit','Done','Finish','Continue','Save','OK','Confirm','Apply','Complete',"I'm done"])
        .map(x=>typeof x==='string'?x:(x.label||x.text||x.name||String(x))).filter(x=>x.trim().toLowerCase()!==label.trim().toLowerCase());
          const collision=collideRng.bool(.3)&&collisionPool.length?collideRng.pick(collisionPool):null;
          document.body.className=`mixer-app instruction-${ctx.display}`;
          const head=u.el('header','mixer-header',document.body);
          u.el('div','mixer-logo',head,'☷');
          const brand=u.el('div','mixer-brand',head);
          u.el('h1','',brand,'Audio Mixer');
          const preset=u.el('div','preset',head);
          u.el('span','',preset,'Preset:');
          const presetBox=u.el('button','preset-box',preset,'Custom Mix');
          presetBox.type='button';
          presetBox.insertAdjacentHTML('beforeend','<i>▼</i>');
          const main=u.el('main','mixer-main',document.body);
          const stage=u.el('section','mixer-stage',main);
          stage.dataset.role='stage';
          const tips=u.el('section','tips-strip',document.body);
          u.el('span','tip-bulb',tips,'💡');
          u.el('strong','tips-title',tips,'Tips');
          const copy=u.el('div','tips-copy',tips);
          u.el('span','tip-line',copy,'Drag the fader handle to adjust each channel’s level.');
          u.el('span','tip-line',copy,'You can also use the keyboard arrow keys for fine adjustments.');
          u.el('span','tip-line',copy,'Levels are shown in decibels (dB).');
          const guide=u.el('div','level-guide',tips);
          u.el('b','',guide,'Level Guide:');
          ['+12 dB  Very loud (may clip)','+6 dB  Loud','0 dB  Nominal level','-6 dB  Moderate','-12 dB  Quiet','-18 dB  Low','-24 dB  Very low','-30 dB  Near silence','-36 dB  Silence'].forEach(x=>u.el('span','',guide,x));
          const instruction=u.el('div','instruction mixer-instruction',head,ctx.instruction);
          if(ctx.display==='hidden')instruction.hidden=true;
          if(ctx.display==='toast'){instruction.classList.add('mixer-toast');const close=u.el('button','instruction-close',instruction,'×');close.onclick=()=>{instruction.hidden=true;};}
          if(ctx.display==='panel')instruction.classList.add('mixer-panel');
          _c.submit = null;
          const makeSubmit=(parent,cls,text)=>{const b=u.el('button',cls,parent,text);b.type='button';b.dataset.role='submit';b.setAttribute('aria-label',label);b.title=label;b.onclick=()=>ctx.submit();return b;};
          if(!ctx.finish&&placement==='header')_c.submit=makeSubmit(head,'primary header-submit',label);
          if(!ctx.finish&&placement==='footer')_c.submit=makeSubmit(tips,'strip-submit',label);
          if(!ctx.finish&&placement==='note')_c.submit=makeSubmit(head,'header-submit text-submit',label);
          if(collision){const decoy=makeSubmit(head,'end-xtra',collision);decoy.dataset.role='xtra';decoy.removeAttribute('aria-label');decoy.removeAttribute('title');decoy.onclick=()=>env.log('decoy',{label:collision,collide:true});}
          const footer=u.el('nav','mixer-dock',document.body);
          [['☷','Mixer',true],['▥','Library',false],['♫','Effects',false],['⚙','Settings',false],['?','Help',false]].forEach(([ico,name,active])=>{const item=u.el('div',`dock-item${active?' active':''}`,footer);u.el('span','dock-icon',item,ico);u.el('span','',item,name);});
          Object.assign(_c, { brand, collideRng, collision, collisionPool, copy, endLabel, endLabels, endRng, footer, guide, head, instruction, label, main, makeSubmit, placement, preset, presetBox, stage, tips, u });
        },
        'frame.2': () => () => {},
        'frame.3': () => () => {},
        'frame.4': () => () => {},
        'frame.5': () => () => {},
        'frame.6': () => () => {},
        'frame.7': () => () => {},
        'frame.8': () => () => {},
        'frame.9': () => () => {},
        'frame.10': () => () => {},
        'frame.11': () => () => {},
        'frame.12': () => () => {},
        'frame.13': () => () => {},
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
        'frame.25': () => () => {},
        'frame.26': () => () => {},
        'frame.27': () => () => {},
        'frame.28': () => () => {},
        'frame.29': () => () => {},
      },
    },
  });
})();
