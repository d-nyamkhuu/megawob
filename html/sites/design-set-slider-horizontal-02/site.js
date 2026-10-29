/* Photo Manager - Adjust Image: Windows XP Luna dialog with seeded task instruction. */
(function () {
  'use strict';
  function scene(parent, cls) {
    const u = env.util;
    const photo=u.el('div',cls+' landscape-photo',parent);
    photo.setAttribute('role','img');
    photo.setAttribute('aria-label','Mountain lake with evergreen trees reflected in the water');
  }
  env.xpScene = scene;
  function drawOverlay(ctx) {
      const u=ctx.util;
      const el=u.el('aside','survey-drawer overlay-'+ctx.kind,document.body);el.setAttribute('role','dialog');
      const survey=ctx.kind==='chat';
      const title={chat:'We value your feedback',cookie:'Your privacy matters',toast:'Photo Manager',promo:'Photo Manager',banner:'Service notice'}[ctx.kind];
      u.el('h2','',el,title);
      const x=u.el('button','survey-x',el,'×');x.setAttribute('aria-label','Close notice');x.onclick=()=>ctx.dismiss('close');
      if(survey){
        u.el('p','survey-intro',el,'Quick survey (2 questions)');u.el('hr','',el);
        u.el('div','survey-question',el,'1. How easy was it to find what you needed today?');
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
        u.el('p','survey-intro',el,{cookie:'This application can remember your display preferences.',toast:'The image is ready for editing.',promo:'Discover more photo tools.',banner:'Photo Manager is available offline.'}[ctx.kind]);
      }
      const dismiss=u.el('button','primary survey-close',el,survey?'Close survey':ctx.kind==='cookie'?'Reject optional':'Dismiss');dismiss.type='button';dismiss.onclick=()=>ctx.dismiss('dismiss');
      return {el,dismiss,ttlSteps:ctx.kind==='toast'?5:0};
  }
  env.site({name:'design-set-slider-horizontal-02',styles:['site.css'],scripts:[],
    frame(ctx) {
      const u=ctx.util;
      const er=ctx.rng.fork('chrome/end');
      const placement=er.pick(['footer','footer','header','link']);
      const labelOf=x=>typeof x==='string'?x:(x.label||x.text||x.name);
      const endLabels=ctx.content.END_LABELS.map(labelOf);
      const endLabel=placement==='footer'?'Submit':er.pick(endLabels);
      const cr=ctx.rng.fork('chrome/collide');
      const otherLabels=endLabels.filter(label=>label.trim().toLowerCase()!==endLabel.trim().toLowerCase());
      const collide=cr.bool(.3)&&otherLabels.length?cr.pick(otherLabels):null;
      const decoyBtn=(parent,label)=>{
        const b=u.el('button','xp-btn end-xtra',parent,label);b.type='button';b.dataset.role='xtra';
        b.onclick=()=>env.log('decoy',{label,collide:true});
        return b;
      };
      const endBtn=(parent,cls)=>{
        const b=u.el(placement==='link'?'a':'button',cls,parent,endLabel);
        if(placement==='link')b.href='#';else b.type='button';
        b.dataset.role='submit';b.title=endLabel;b.setAttribute('aria-label',endLabel);
        b.onclick=e=>{e.preventDefault();ctx.submit();};
        return b;
      };
      document.body.className=`xp instruction-${ctx.display}`;
      const win=u.el('div','xp-window',document.body);
      const title=u.el('header','xp-title',win);
      const ico=u.svg('svg',{viewBox:'0 0 24 24',class:'xp-icon','aria-hidden':'true'},title);
      u.svg('rect',{x:3,y:2,width:19,height:17,rx:1,fill:'#e8efff',stroke:'#7a8a9a'},ico);
      u.svg('rect',{x:2,y:4,width:20,height:16,rx:1,fill:'#fff',stroke:'#7a8a9a'},ico);
      const iconPhoto=u.svg('svg',{x:4,y:6,width:16,height:12,viewBox:'38 469 412 300',preserveAspectRatio:'none'},ico);
      u.svg('image',{href:'sites/design-set-slider-horizontal-02/assets/lakeside-source.webp',width:1672,height:941},iconPhoto);
      u.el('span','xp-title-text',title,'Photo Manager - Adjust Image');
      const caps=u.el('div','xp-caps',title);
      for(const c of ['min','max','close']){const b=u.el('span','xp-cap '+c,caps);
        const s=u.svg('svg',{viewBox:'0 0 16 16'},b);
        if(c==='min')u.svg('rect',{x:3,y:11,width:7,height:3,fill:'#fff'},s);
        else if(c==='max')u.svg('rect',{x:3,y:3,width:10,height:10,fill:'none',stroke:'#fff','stroke-width':2},s);
        else u.svg('path',{d:'M3.5 3.5L12.5 12.5M12.5 3.5L3.5 12.5',stroke:'#fff','stroke-width':2.4},s);
      }
      const body=u.el('div','xp-body',win);
      const info=u.el('section','file-info',body);
      scene(u.el('div','thumb-box',info),'thumb');
      const dl=u.el('dl','file-meta',info);
      for(const [k,v] of [['File:','Lakeside.jpg'],['Size:','1024 × 768 pixels'],['Type:','JPEG Image']]){u.el('dt','',dl,k);u.el('dd','',dl,v);}
      const fileTools=u.el('div','file-tools',info);
      if(collide)decoyBtn(fileTools,collide);
      let submit=null;
      if(!ctx.finish&&placement==='header')submit=endBtn(fileTools,'xp-btn primary');
      const note=u.el('div','task-note instruction',body);
      const ib=u.el('span','info-badge',note,'i');
      const instruction=u.el('span','instruction-text',note,ctx.instruction);
      if(ctx.display==='hidden')note.hidden=true;
      if(ctx.display==='toast'){
        const close=u.el('button','instruction-close',note,'Close');
        close.onclick=()=>{note.hidden=true;};
      }
      const stage=u.el('main','record-stage',body);stage.dataset.role='stage';
      const footer=u.el('footer','xp-footer',body);
      const help=u.el('button','xp-btn help',footer);help.type='button';
      const q=u.el('span','help-q',help,'?');u.el('span','',help,'Help');
      help.onclick=()=>env.log('decoy',{label:'Help'});
      if(!ctx.finish&&placement==='link')submit=endBtn(footer,'xp-end-link');
      const actions=u.el('div','footer-actions',footer);
      const reset=u.el('button','xp-btn reset',actions,'Reset');reset.type='button';reset.dataset.action='reset';
      if(!ctx.finish&&placement==='footer')submit=endBtn(actions,'xp-btn primary');
      const cancel=u.el('button','xp-btn cancel',actions,'Cancel');cancel.type='button';cancel.setAttribute('aria-disabled','true');
      cancel.onclick=()=>env.log('decoy',{label:'Cancel'});
      return {stage,submit};
    },
    overlay: drawOverlay,
  });
})();
