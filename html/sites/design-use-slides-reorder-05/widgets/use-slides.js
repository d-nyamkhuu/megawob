// Retain the office template's deck, drag handlers and oracle anchors.
function einkDeck(S) {
  const {model,util,spec}=S.ctx;
  const titleFor=id=>{
    const slide=spec.slides[id] || spec.slides.find(s=>s.id===id);
    return slide?.title || slide?.name || '';
  };
  const kindFor=title=>/opening/i.test(title)?'plant':/next/i.test(title)?'steps':/delivery/i.test(title)?'gantt':/findings/i.test(title)?'chart':/opportunity/i.test(title)?'lake':'mountain';
  for(const id of model.order) {
    const thumb=S.refs['slide:'+id];
    const preview=thumb?.querySelector('.as-preview');
    if(!preview)continue;
    let mini=preview.querySelector('.e-mini');
    if(!mini)mini=util.el('div','e-mini',preview);
    mini.replaceChildren();
    const title=titleFor(id);
    util.el('div','e-mini-title',mini,title);
    util.el('div','e-mini-rule',mini);
    const art=util.el('div','e-mini-art '+kindFor(title),mini);
    if(/gantt|chart/.test(kindFor(title)))for(let i=0;i<6;i++)util.el('i','',art);
  }
  const canvas=S.root.querySelector('.as-canvas');
  if(!canvas)return;
  const title=titleFor(model.activeSlide) || S.root.querySelector('.as-slidehead')?.textContent || '';
  let page=canvas.querySelector('.e-slide-content');
  if(!page)page=util.el('div','e-slide-content',canvas);
  page.replaceChildren();
  const kind=kindFor(title);
  page.className='e-slide-content '+kind;
  util.el('h1','e-slide-title',page,title);
  util.el('div','e-slide-rule',page);
  if(kind==='plant') {
    const list=util.el('ul','e-slide-bullets',page);
    ['Set the context','Our objectives','What success looks like'].forEach(t=>util.el('li','',list,t));
  }
  const art=util.el('div','e-slide-art '+kind,page);
  if(/gantt|chart/.test(kind))for(let i=0;i<6;i++)util.el('i','',art);
  const prop=S.root.querySelector('.e-property-title');
  if(prop)prop.textContent=title;
  const num=S.root.querySelector('.e-property-number');
  if(num)num.textContent=String(model.order.indexOf(model.activeSlide)+1);
}

function einkChrome(S) {
  const {util}=S.ctx;
  const root=S.root;
  const menu=util.el('div','e-menu',root);
  ['File','Edit','View','Insert','Format','Slide','Arrange','Tools','Help'].forEach(t=>util.el('span','',menu,t));
  const headerTools=document.querySelector('.ref-task>.ref-tools');
  if(headerTools)menu.append(headerTools);
  const tabs=util.el('div','e-tabs',root);
  ['Slides','Insert','Design','Transitions','Animations','Review','View'].forEach((t,i)=>util.el(i?'span':'b','',tabs,t));
  root.prepend(menu,tabs);
  const main=root.querySelector('.as-main');
  const inspector=util.el('aside','e-inspector',main);
  const h=util.el('h3','',inspector,'Slide properties');
  util.el('span','',h,'⌄');
  const section=t=>{const s=util.el('section','',inspector);util.el('h4','',s,'▾ '+t);return s;};
  const row=(s,label,value,cls='')=>{
    const r=util.el('div','e-property-row',s);
    util.el('span','e-property-label',r,label);
    const field=util.el('div','e-property-field '+cls+(value.includes('⌄')?' e-dropdown':''),r,value.replace('　⌄',''));
    if(label==='Colour') {
      field.replaceChildren();
      const swatch=util.el('span','e-swatch',field);
      swatch.style.background=value.includes('000000')?'#000':'#f5f5f5';
      util.el('span','',field,value.includes('000000')?'#000000':'#F5F5F5');
    }
    return field;
  };
  let s=section('General');
  row(s,'Title','','e-property-title');
  row(s,'Layout','Title and content　⌄');
  const r=util.el('div','e-property-row e-property-count',s);
  util.el('span','e-property-label',r,'Slide number');
  util.el('div','e-property-field e-property-number',r,'');
  util.el('span','',r,'of '+S.ctx.spec.slides.length);
  util.el('div','e-checkbox',s,'Hide slide from presentation');
  s=section('Background');
  row(s,'Fill','Solid fill　⌄');
  row(s,'Colour','□　 #F5F5F5','e-colour');
  util.el('div','e-checkbox',s,'Apply to all slides');
  s=section('Text');
  row(s,'Font','Georgia　⌄');
  row(s,'Size','44　⌄','e-short');
  row(s,'Colour','■　 #000000','e-colour');
  util.el('div','e-format',s,'B　　 𝑰　　 U̲');
  const a=util.el('div','e-property-row',s);
  util.el('span','e-property-label',a,'Alignment');
  const alignment=util.el('div','e-alignment',a);
  [2,5,9,2].forEach((offset,i)=>{
    const item=util.el('span',i?'':'selected',alignment);
    item.innerHTML='<svg viewBox="0 0 24 24"><path d="M2 4h20M'+offset+' 9h'+(i===3?'20':'13')+'M2 14h20M'+offset+' 19h'+(i===3?'20':'13')+'"/></svg>';
  });
  s=section('Slide size');
  const size=util.el('div','e-size-row',s);
  util.el('div','e-size-field e-dropdown',size,'Widescreen (16:9)');
  util.el('span','',size,'1920 × 1080');
  const ribbon=util.el('div','e-ribbon',root.querySelector('.as-editor'));
  ribbon.innerHTML='<div class="e-ribbon-group e-clipboard"><div class="e-paste"><svg viewBox="0 0 40 40"><path d="M13 8H8v28h23V15h-7M15 8V3h10v7H15zM23 15h13v24H17V16"/></svg><span>Paste</span><span>⌄</span></div><div class="e-cut"><span>⚒ &nbsp;Cut</span><span>▢ &nbsp;Copy</span><span>♢ &nbsp;Format painter</span></div><small>Clipboard</small></div><div class="e-ribbon-group e-font"><div class="e-font-fields"><span>Georgia <b>⌄</b></span><span>44　⌄</span><span class="e-grow">A˄</span></div><div class="e-font-buttons"><b>B</b><i>I</i><u>U</u><span>■⌄</span><span>A˄</span><span>A˅</span></div><small>Font</small></div><div class="e-ribbon-group e-paragraph"><div>☷　☷　☷　⇤　⇥　⇥</div><div>▤　☰　☰　▤</div><small>Paragraph</small></div><div class="e-ribbon-group e-shapes"><svg viewBox="0 0 50 45"><rect x="6" y="4" width="28" height="28"/><circle cx="32" cy="29" r="15"/></svg><span>Shapes</span><span>⌄</span></div><div class="e-ribbon-group e-drawing"><div><svg viewBox="0 0 45 45"><path d="M4 3h20v20H4zM14 13h20v20H14zM23 23h19v19H23z"/></svg><span>Arrange<br>⌄</span></div><div><span>⚑ Align ⌄</span><span>☷ Distribute ⌄</span></div><small>Drawing</small></div>';
  const icon=path=>'<svg viewBox="0 0 24 24" aria-hidden="true">'+path+'</svg>';
  ribbon.querySelector('.e-cut').innerHTML=[
    [icon('<circle cx="6" cy="17" r="3"/><circle cx="17" cy="17" r="3"/><path d="M7 14 17 2M16 14 6 2"/>'),'Cut'],
    [icon('<rect x="4" y="3" width="12" height="15"/><path d="M9 7h11v15H9z"/>'),'Copy'],
    [icon('<path d="m3 10 8-8 7 7-8 8zM13 14l7 7 3-3-7-7"/>'),'Format painter']
  ].map(([i,t])=>'<span>'+i+t+'</span>').join('');
  const bullets='<circle cx="3" cy="5" r="1"/><circle cx="3" cy="12" r="1"/><circle cx="3" cy="19" r="1"/><path d="M8 5h14M8 12h14M8 19h14"/>';
  const numbered='<path d="M1 2h2v6M1 11h3l-3 5h3M1 19h3l-2 2h2M8 5h14M8 12h14M8 20h14"/>';
  const indent='<path d="M2 3h20M10 9h12M10 15h12M2 21h20M2 9l5 3-5 3z"/>';
  const align=offset=>'<path d="M2 4h20M'+offset+' 9h13M2 14h20M'+offset+' 19h13"/>';
  ribbon.querySelector('.e-paragraph').innerHTML='<div class="e-paragraph-row">'+[bullets,bullets,numbered,indent,indent,indent].map(icon).join('')+'</div><div class="e-paragraph-row">'+[align(2),align(5),align(9),'<path d="M2 4h20M2 9h20M2 14h20M2 19h20"/>'].map((p,i)=>'<span class="'+(i?'':'selected')+'">'+icon(p)+'</span>').join('')+'</div><small>Paragraph</small>';
  ribbon.querySelector('.e-drawing>div:last-of-type').innerHTML='<span>'+icon('<path d="M4 2v20M7 5h14v4H7M7 14h9v4H7"/>')+'Align ⌄</span><span>'+icon('<rect x="3" y="3" width="5" height="5"/><rect x="16" y="3" width="5" height="5"/><rect x="3" y="16" width="5" height="5"/><rect x="16" y="16" width="5" height="5"/><path d="M11 3h2M11 21h2M3 11v2M21 11v2"/>')+'Distribute ⌄</span>';
  ribbon.parentElement.prepend(ribbon);
  const taskPanel=document.querySelector('.ref-body>.ref-panel');
  if(taskPanel) {
    const work=root.querySelector('.as-work');
    const row=util.el('div','e-workrow',work.parentElement);
    row.append(work,taskPanel);
  }
}

env.widget({
  task: 'use-slides',
  site: 'design-use-slides-reorder-05',
  name: 'design',
  split: 'train',
  scenarios: ['reorder'],
  template: 'use-slides/office',
  design: {frameInset:0,uiFont:'Arial, sans-serif',documentFont:'Georgia, serif',brand:'Presentation',navigationAt:99999,inspectorAt:99999,outlineAt:99999,parts:{
    layout: (base, S) => function(...args) {
      const ctx=args[0];
      const banner=ctx.opts.perturb==='banner'||ctx.opts.overlay==='banner';
      const pitch=Math.max(48,Math.floor((ctx.size.height-100-(banner?44:0))/ctx.model.order.length));
      S.D.thumbnailPitch=pitch;
      S.D.thumbnailHeight=pitch-8;
      S.D.railWidth=Math.round(ctx.size.width*.132);
      S.D.compactRailWidth=S.D.railWidth;
      const out = base(...args);
      S.root.classList.toggle('e-banner-space',banner);
      S.root.style.setProperty('--thumb-height',(pitch-8)+'px');
      einkChrome(S);
      einkDeck(S);
      return out;
    },
    syncDeck:(base,S)=>function(...args){const out=base(...args);einkDeck(S);return out;}
  }},
});
