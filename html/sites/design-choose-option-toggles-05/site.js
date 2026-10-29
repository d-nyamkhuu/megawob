(function () {
  'use strict';
  const paths = {
    monitor:'<path d="M3 4h26v18H3z" fill="#526775"/><path d="M5 6h22v14H5z" fill="#54bce0"/><path d="M14 22h4v4h5v2H9v-2h5z" fill="#8b99a3"/>',
    bell:'<path d="M16 3c-6 0-9 5-9 11v7l-4 5h26l-4-5v-7c0-6-3-11-9-11M12 28h8c-1 5-7 5-8 0" fill="#ffb713"/>',
    search:'<circle cx="13" cy="13" r="9" fill="none" stroke="currentColor" stroke-width="3.5"/><path d="m20 20 9 9" stroke="currentColor" stroke-width="4"/>',
    apps:'<path d="M4 4h10v10H4zm14 0h10v10H18zM4 18h10v10H4zm14 0h10v10H18z" fill="#519db6"/>',
    shield:'<path d="M16 2 29 7v10c0 7-9 13-13 15C12 30 3 24 3 17V7z" fill="currentColor"/><path d="m15 8 8 6-8 10-6-6h7z" fill="#e8f7ff"/>',
    globe:'<circle cx="16" cy="16" r="13" fill="none" stroke="currentColor" stroke-width="2.5"/><ellipse cx="16" cy="16" rx="6" ry="13" fill="none" stroke="currentColor" stroke-width="2"/><path d="M4 11h24M3 20h26M16 3v26" stroke="currentColor" stroke-width="2"/>',
    chip:'<path d="M7 7h18v18H7z" fill="#517e83"/><path d="M10 10h12v12H10z" fill="#6c8b91"/><path d="M9 2v4m5-4v4m5-4v4m5-4v4M9 26v4m5-4v4m5-4v4m5-4v4M2 9h4m-4 5h4m-4 5h4m-4 5h4m20-15h4m-4 5h4m-4 5h4m-4 5h4" stroke="#768e96" stroke-width="2"/>',
    gear:'<path d="m13 1 6 0 1 5 4 2 5-1 3 5-4 4v4l4 4-3 5-5-1-4 2-1 4h-6l-1-4-4-2-5 1-3-5 4-4v-4l-4-4 3-5 5 1 4-2z" fill="currentColor"/><circle cx="16" cy="17" r="7" fill="#f4f7fa"/>',
    person:'<circle cx="16" cy="9" r="7" fill="currentColor"/><path d="M2 32v-4c0-8 6-13 14-13s14 5 14 13v4" fill="currentColor"/>',
    bars:'<path d="M2 15h7v17H2zM13 3h7v29h-7zM24 10h7v22h-7z" fill="currentColor"/>',
    clock:'<circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" stroke-width="3.5"/><path d="M16 6v11l8 5" fill="none" stroke="currentColor" stroke-width="3"/>',
    puzzle:'<path d="M12 1h7v7h7v8c8-2 8 10 0 8v7H16c2-8-10-8-8 0H1v-9c8 2 8-10 0-8V8h11c-4-7 10-9 7-2" fill="currentColor"/>'
  };
  function icon(el, name) {
    el.classList.add('bz-icon-'+name);
    if(name === 'appearance'){el.classList.add('bz-color-icon');return;}
    el.innerHTML='<svg viewBox="0 0 34 34" aria-hidden="true">'+(paths[name]||paths.gear)+'</svg>';
  }
  function frame(ctx) {
    const {util}=ctx, el=util.el;
    const r=ctx.rng.fork('breeze/chrome'), er=ctx.rng.fork('breeze/end');
    const shell=el('div','bz-window',document.body);
    shell.dataset.instruction=ctx.display||'header';
    const titlebar=el('header','bz-titlebar',shell);
    el('span','bz-app-icon',titlebar).innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 6h5m4 0h5M5 12h2m4 0h8M5 18h7m4 0h3" stroke="#e7f0f4" stroke-width="1.5"/><path d="M12 3v6M9 9v6m5 0v6" stroke="#70b5d9" stroke-width="2.5"/></svg>';
    el('span','bz-app-name',titlebar,'System Settings');
    const win=el('div','bz-window-controls',titlebar);
    for(const s of ['−','□','×']) el('span','',win,s);
    const tools=el('div','bz-tools',titlebar);
    const rail=el('nav','bz-rail',shell);
    const nav=[['Appearance','appearance'],['Workspace','monitor'],['Notifications','bell'],['Search','search'],['Applications','apps'],['Privacy & Personalization','shield'],['Online Accounts','globe'],['Network','globe'],['Hardware','chip'],['System Administration','gear']];
    for(const [name,ic] of nav){
      const row=el('div','bz-nav-row'+(ic==='shield'?' active':''),rail);
      icon(el('span','bz-nav-icon',row),ic);el('span','',row,name);
    }
    const work=el('section','bz-work',shell);
    const head=el('div','bz-heading',work);
    el('h1','',head,'Privacy & Personalization');
    const area=el('div','bz-area',work);
    const card=el('section','bz-card',area);
    el('h2','bz-card-heading',card,'Personal Data');
    const stage=el('main','bz-stage',card);
    const aside=el('aside','bz-aside',area);
    const overview=el('section','bz-overview',aside);
    el('h2','',overview,'Privacy Overview');
    for(const [title,value,ic] of [['Profile data','0 items shared','person'],['Usage statistics','Off','bars'],['Recent files','On (10 items)','clock'],['Personalized content','On','puzzle']]){
      const row=el('div','bz-stat',overview);icon(el('span','bz-stat-icon',row),ic);
      const text=el('div','bz-stat-text',row);el('div','',text,title);el('div','bz-stat-value',text,value);
    }
    if(ctx.display && ctx.display!=='hidden'){
      const drawNote=(parent,kind,extra)=>{
        const note=el('div','bz-note bz-note-'+kind+(extra?' '+extra:''),parent);
        el('span','bz-info',note,'i');
        const body=el('div','bz-note-body',note);
        if(kind!=='header')el('div','bz-note-title',body,'Action item');
        el('div','bz-note-text',body,ctx.instruction);
        if(kind==='toast'){
          const x=el('button','bz-note-close',note,'×');x.type='button';x.setAttribute('aria-label','Close notification');
          x.addEventListener('click',()=>{note.style.visibility='hidden';env.log('note-close');});
        }
      };
      drawNote(ctx.display==='header'?head:aside,ctx.display);
      if(ctx.display!=='header')drawNote(head,'header','bz-note-fallback');
    }
    const placement=ctx.finish?null:er.pick(['header','header','header','footer','link']);
    const label=er.bool(.55)?'Continue':ctx.content.endLabel(er);
    let footer=null;
    if(placement==='footer'||placement==='link')footer=el('footer','bz-footer',work);
    const endParent=footer||tools;
    const decoy=(label,collide)=>{
      const b=el('button','bz-button bz-extra',endParent,label);b.type='button';
      b.addEventListener('click',()=>env.log('decoy',collide?{label,collide:true}:{label}));
    };
    if(!ctx.finish && r.bool(.3)){
      const alt=ctx.content.collideLabel(r,label);if(alt)decoy(alt,true);
      if(r.bool(.5))decoy('Report a problem',false);
    }
    let submit=null;
    if(!ctx.finish){
      submit=el(placement==='link'?'a':'button','bz-button bz-submit'+(placement==='link'?' bz-end-link':''),endParent,label);
      if(submit.tagName==='A')submit.href='#';else submit.type='button';
      submit.dataset.role='submit';submit.title=label;submit.setAttribute('aria-label',label);
      submit.addEventListener('click',(e)=>{e.preventDefault();ctx.submit();});
    }
    return {stage,submit};
  }
  function overlay(ctx){
    const {util,kind}=ctx, el=util.el;
    const root=el('div','bz-overlay bz-overlay-'+kind,document.body);root.dataset.role='overlay';
    const copy=ctx.content.bannerText(ctx.rng,kind==='banner'?'notice':kind);
    el('span','bz-overlay-symbol',root,kind==='cookie'?'◉':'i');
    const body=el('div','bz-overlay-copy',root,copy.text);
    const dismiss=el('button','bz-button bz-overlay-close',root,kind==='cookie'?'Accept':'Dismiss');dismiss.type='button';
    dismiss.addEventListener('click',()=>ctx.dismiss(kind==='cookie'?'accept':'close'));
    return {el:root,dismiss,ttlSteps:0};
  }
  env.site({
    name: 'design-choose-option-toggles-05',
    styles: ['site.css'],
    scripts: [],
    template: 'site/base',
    design: {parts:{frame:()=>frame,overlay:()=>overlay}},
  });
})();
