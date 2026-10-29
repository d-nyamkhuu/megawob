/* Ridgeview University: 1995 academic hypertext page, offset document with a slim tool strip. */
(function () {
  'use strict';
  function icon(kind, parent) {
    const u = env.util;
    const svg = u.svg('svg', {viewBox:'0 0 40 40', class:'tool-icon', 'aria-hidden':'true'}, parent);
    if (kind === 'print') {
      u.svg('path', {d:'M9 3h16l7 7v27H9Z', fill:'#f6f6f6', stroke:'#555', 'stroke-width':1.5}, svg);
      u.svg('path', {d:'M25 3v7h7', fill:'#dde4ec', stroke:'#555', 'stroke-width':1.2}, svg);
      for (const y of [12, 16, 20, 24, 28, 32]) u.svg('path', {d:`M13 ${y}h15`, stroke:'#698296', 'stroke-width':1.2}, svg);
    } else if (kind === 'save') {
      u.svg('path', {d:'M3 10h13l3 4h18v21H3Z', fill:'#d9d9d9', stroke:'#555', 'stroke-width':1.5}, svg);
      u.svg('path', {d:'M3 35l5-17h32l-4 17Z', fill:'#bfc0c0', stroke:'#555', 'stroke-width':1.5}, svg);
    } else {
      u.svg('circle', {cx:20, cy:20, r:17, fill:'#d8d8d8', stroke:'#555', 'stroke-width':1.5}, svg);
      u.svg('circle', {cx:20, cy:20, r:14, fill:'#e5e5e5'}, svg);
      const t = u.svg('text', {x:20, y:31, 'text-anchor':'middle', 'font-size':32, 'font-weight':'bold', fill:'#1756aa', 'font-family':'Arial,sans-serif'}, svg);
      t.textContent = '?';
    }
  }
  function drawOverlay(ctx) {
      const u=ctx.util;
      const el=u.el('aside','survey-drawer overlay-'+ctx.kind,document.body);el.setAttribute('role','dialog');
      const title={chat:'We value your feedback',cookie:'Your privacy matters',toast:'Notice',promo:'Announcement',banner:'Service notice'}[ctx.kind];
      u.el('h2','',el,title);
      const x=u.el('button','survey-x',el,'×');x.setAttribute('aria-label','Close notice');x.onclick=()=>ctx.dismiss('close');
      u.el('p','survey-intro',el,{chat:'Please tell us how this page worked for you.',cookie:'This page can remember your display preferences.',toast:'The scanner profile was loaded.',promo:'Visit the university digital archive.',banner:'The scanner is available during library hours.'}[ctx.kind]);
      const dismiss=u.el('button','primary survey-close',el,ctx.kind==='cookie'?'Reject optional':'Dismiss');dismiss.type='button';dismiss.onclick=()=>ctx.dismiss('dismiss');
      return {el,dismiss,ttlSteps:ctx.kind==='toast'?5:0};
  }
  const END_LABELS=['Submit','Done','Finish','Continue','Save','OK','Confirm','Apply','Complete',"I'm done"];
  const labelOf=x=>typeof x==='string'?x:(x&&(x.label||x.text||x.name))||String(x);
  env.site({name:'design-set-slider-range-08',styles:['site.css'],scripts:[],
    frame(ctx) {
      const u=ctx.util;
      if(!document.body._fragGuard){document.body._fragGuard=true;document.body.addEventListener('click',e=>{const a=e.target.closest&&e.target.closest('a[href]');if(a&&/^#?$/.test(a.getAttribute('href')))e.preventDefault();});}
      document.body.className=`library instruction-${ctx.display}`;
      const task=u.el('aside','catalog-task',document.body);
      const instruction=u.el('div','instruction',task,ctx.instruction);
      if(ctx.display==='hidden')instruction.hidden=true;
      if(ctx.display==='toast'){
        const close=u.el('button','instruction-close',instruction,'Close');
        close.type='button';close.onclick=()=>{instruction.hidden=true;};
      }
      if(ctx.display==='panel')instruction.classList.add('instruction-panel');
      if(ctx.display==='toast')instruction.classList.add('instruction-toast');
      const doc=u.el('div','doc',document.body);
      const head=u.el('header','doc-head',doc);
      u.el('div','univ',head,'Ridgeview University');
      const links=u.el('nav','doc-links',head);
      ['Help','Site Map','Contact'].forEach((t,i)=>{if(i)u.el('span','sep',links,'|');u.el('a','',links,t).href='#';});
      const endR=ctx.rng.fork('chrome/end');
      const endBank=ctx.content&&Array.isArray(ctx.content.END_LABELS)&&ctx.content.END_LABELS.length?ctx.content.END_LABELS:END_LABELS;
      const label=ctx.finish?null:labelOf(endR.pick(endBank));
      const placement=ctx.finish?'none':endR.pick(['footer','footer','header','link']);
      const collideR=ctx.rng.fork('chrome/collide');
      let collide=null;
      if(!ctx.finish&&collideR.bool(.3)){
        const bank=ctx.content&&Array.isArray(ctx.content.END_LABELS)&&ctx.content.END_LABELS.length?ctx.content.END_LABELS:END_LABELS;
        const options=[...new Set(bank.map(labelOf))].filter(x=>x.trim().toLowerCase()!==label.trim().toLowerCase());
        if(options.length)collide=labelOf(collideR.pick(options));
      }
      const makeEnd=(parent,cls,text)=>{
        const b=u.el(placement==='link'&&cls==='end-link'?'a':'button',cls,parent,text);
        if(b.tagName==='A')b.href='#';else b.type='button';
        b.dataset.role='submit';b.title=label;b.setAttribute('aria-label',label);
        b.onclick=e=>{e.preventDefault();ctx.submit();};return b;
      };
      let submit=null;
      if(placement==='header')submit=makeEnd(head,'end-header',label);
      u.el('h1','',doc,'Image Display Settings');
      const intro=u.el('p','intro',doc);
      intro.append('Adjust the display parameters for the ');
      u.el('span','mono',intro,'library scanner');
      intro.append('. Make your changes below and submit when you are ready.');
      const panel=u.el('section','controls-panel',doc);
      u.el('h2','',panel,'Display Controls');
      const stage=u.el('main','record-stage',panel);stage.dataset.role='stage';
      u.el('h3','',doc,'Preview');
      const prev=u.el('div','preview',doc);
      const frame=u.el('div','preview-frame',prev);
      const photo=u.el('div','preview-photo',frame);
      const img=u.el('img','',photo);img.src='sites/design-set-slider-range-08/assets/reference-preview-source.webp';img.alt='University building with a columned entrance';
      u.el('p','',prev,'Use the controls above to adjust the image.\nThe preview updates automatically.');
      const actions=u.el('div','footer-actions',doc);
      const reset=u.el('button','reset',actions,'Reset');reset.type='button';reset.dataset.action='reset';
      if(placement==='footer')submit=makeEnd(actions,'primary',label);
      else if(placement==='link')submit=makeEnd(actions,'end-link',label+' ›');
      const tools=u.el('nav','tools',document.body);
      for(const [k,t] of [['print','Print'],['save','Save'],['help','Help']]){
        const a=u.el('a','tool',tools);a.href='#';icon(k,a);u.el('span','',a,t);
        a.addEventListener('click',e=>{e.preventDefault();env.log('decoy',{label:t});});
      }
      if(collide){const d=u.el('button','tool-xtra',tools,collide);d.type='button';d.title=collide;d.setAttribute('aria-label',collide);d.addEventListener('click',()=>env.log('decoy',{label:collide,collide:true}));}
      return {stage,submit};
    },
    overlay: drawOverlay,
  });
})();
