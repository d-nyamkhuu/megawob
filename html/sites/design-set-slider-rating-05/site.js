(function () {
  'use strict';
  const icons = [
    '<path d="M3 7 13 3l10 4 10-4v27l-10 4-10-4-10 4Z" fill="#ffe68a"/><path d="m13 3 0 27m10-23v27" fill="none"/><path d="m6 11 4 2-3 7 3 7m7-19 3 7-4 9 4 3m7-18 3 6-3 5 3 6" stroke="#3289c4" fill="none"/>',
    '<circle cx="18" cy="18" r="15" fill="#318ad0"/><path d="m11 5 5 4-2 5-5-1-3 5 5 5 1 7 7 1 2-5 6-3-2-6-6-1-2-5 7-5m-1 23 5-3 4-7" fill="#62af49"/><circle cx="18" cy="18" r="15" fill="none"/>',
    '<path d="M6 4h25v29H6Z" fill="#eee"/><path d="M3 6h25v26H3Z" fill="#fff"/><path d="M11 3h8v4h-8Z" fill="#bbb"/><path d="M9 12h15M9 16h15M9 20h15M9 24h15M9 28h15" fill="none"/><path d="M6 12h1m-1 4h1m-1 4h1m-1 4h1m-1 4h1"/>',
    '<path d="m18 2 4.5 11 11.5 1-9 8 3 12-10-6.5L8 34l3-12-9-8 11.5-1Z" fill="#ffd000"/>',
    '<path d="M7 5 15 2v28l-8 4-3-3V8Z" fill="#bbb"/><path d="m7 9 9 3 15-6v26l-15 4-9-4Z" fill="#0879ce"/><path d="m16 12 0 24m-9-4V9m0 0 9 3" fill="none"/><path d="m20 9 8-3v19l-8 3Z" fill="#0755ab" stroke="none"/>',
  ].map(body => `<svg viewBox="0 0 36 38" aria-hidden="true" fill="none" stroke="#111" stroke-width="1.6" stroke-linejoin="round">${body}</svg>`);
  const site = {
    name: 'design-set-slider-rating-05',
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const { util, content } = ctx;
      const endRng = ctx.rng.fork('chrome/end');
      const placeRng = ctx.rng.fork('chrome/place');
      const collideRng = ctx.rng.fork('chrome/collide');
      const decoyRng = ctx.rng.fork('chrome/decoy');
      const labels = content.END_LABELS || ['Submit','Done','Finish','Continue','Save','OK','Confirm','Apply'];
      const label = ctx.finish ? null : (endRng.bool(.5) ? 'Apply' : (content.endLabel ? content.endLabel(endRng) : endRng.pick(labels)));
      const placement = ctx.finish ? null : placeRng.pick(['header','header','header','footer','link','icon']);
      const collision = !ctx.finish && collideRng.bool(0.3) ? collideRng.pick(labels.filter(x=>x!==label)) : null;
      const decoys = decoyRng.bool(0.35) ? [decoyRng.pick(['Help','Save draft','Print','Copy link'])] : [];
      const button = (parent, text, click, cls='retro-button', role) => {
        const b=util.el('button',cls,parent,text); b.type='button';
        if (role) { b.dataset.role=role; b.title=label; b.setAttribute('aria-label',label); }
        if (click) b.addEventListener('click',click);
        else b.addEventListener('click',()=>env.log('decoy',collision===text?{label:text,collide:true}:{label:text}));
        return b;
      };
      const taskNote = (parent, cls) => {
        const note=util.el('div',`retro-instruction ${cls}`,parent);
        util.el('span','retro-instruction-icon',note).innerHTML=icons[2];
        util.el('span','retro-instruction-text',note,ctx.instruction);
        return note;
      };
      const header=util.el('header','retro-windowbar',document.body);
      util.el('span','retro-window-title',header,'');
      const headTools=util.el('div','retro-header-tools',header);
      decoys.forEach(x=>button(headTools,x,null));
      if (collision && placement!=='footer' && placement!=='link') button(headTools,collision,null);
      let submit=null;
      if (placement==='header') submit=button(headTools,label,()=>ctx.submit(),'retro-button','submit');
      if (placement==='icon') { submit=button(headTools,'✓',()=>ctx.submit(),'retro-button retro-icon','submit'); submit.title=label; }
      const windowTools=util.el('div','retro-window-controls',header);
      ['−','□','×'].forEach(symbol=>util.el('span','',windowTools,symbol));
      const body=util.el('div','retro-body',document.body);
      if (ctx.display==='panel') body.classList.add('has-panel');
      if (ctx.display==='toast') body.classList.add('has-toast');
      const nav=util.el('nav','retro-rail',body);
      [['🗺','Trips'],['🌎','Destinations'],['▤','Bookings'],['★','Ratings'],['📘','Travel Guide']].forEach(([icon,text],i)=>{
        const a=util.el('a',`retro-navlink${i===0?' selected':''}`,nav); a.href='#';
        util.el('span','retro-navicon',a).innerHTML=icons[i]; util.el('span','',a,text);
        a.addEventListener('click',e=>{e.preventDefault();env.log('decoy',{what:'nav',label:text});});
      });
      const main=util.el('div','retro-main',body);
      const titleBox=util.el('div','retro-page-title',main);
      util.el('h1','',titleBox,'Trip to the Channel Coast');
      if(ctx.display==='header') taskNote(main,'retro-header-note');
      if(ctx.display==='panel') {
        const column=util.el('aside','retro-note-column',body);
        const note=util.el('div','retro-instruction retro-note-panel',column);
        util.el('strong','',note,'Task');
        util.el('span','retro-note-symbol',note).innerHTML=icons[2];
        util.el('p','',note,ctx.instruction);
        taskNote(main,'retro-panel-fallback');
      }
      const stage=util.el('main','ref-stage retro-stage',main);
      const inspector=util.el('aside','retro-inspector',body);
      util.el('h2','',inspector,'Details');
      const photo=util.el('div','retro-photo',inspector);
      photo.setAttribute('role', 'img');
      photo.setAttribute('aria-label', 'Channel ferry sailing in front of the white cliffs of Dover');
      util.el('h3','',inspector,'Canal ferry crossing');
      const info=util.el('div','retro-details',inspector);
      [['Operator:','Channel Ferries'],['Route:','Dover – Calais'],['Date:','14 Jul 1994'],['Duration:','1 hour 30 minutes'],['Category:','Ferry'],['Reference:','CF-2847']].forEach(([a,b])=>{util.el('span','',info,a);util.el('span','',info,b);});
      util.el('div','retro-divider',inspector); util.el('h3','',inspector,'Seaside hotel');
      const info2=util.el('div','retro-details',inspector);
      [['Name:','The Royal View'],['Location:','Brighton'],['Check in:','16 Jul 1994'],['Check out:','19 Jul 1994'],['Room type:','Double'],['Reference:','RV-7031']].forEach(([a,b])=>{util.el('span','',info2,a);util.el('span','',info2,b);});
      if(placement==='footer'||placement==='link') {
        const footer=util.el('footer','retro-form-footer',main), tools=util.el('div','retro-footer-tools',footer);
        if(collision) button(tools,collision,null);
        if(placement==='footer') submit=button(tools,label,()=>ctx.submit(),'retro-button','submit');
        else { const link=util.el('a','retro-link',tools,`${label} ›`); link.href='#'; link.dataset.role='submit'; link.addEventListener('click',e=>{e.preventDefault();ctx.submit();}); submit=link; }
      }
      if(ctx.display==='toast') {
        const toast=util.el('div','retro-note',document.body);
        util.el('span','retro-info-symbol',toast,'i');
        util.el('span','retro-note-text',toast,ctx.instruction);
        const close=util.el('button','retro-note-x',toast,'×'); close.type='button'; close.setAttribute('aria-label','Close'); close.addEventListener('click',()=>{toast.remove();env.log('note-close');});
      }
      return {stage,submit};
    },
    overlay(ctx) {
      const {util,kind}=ctx; const box=util.el('div',`retro-overlay retro-overlay-${kind}`,document.body);
      let close;
      if (kind==='chat') {
        const title=util.el('div','retro-chat-title',box);
        util.el('span','retro-chat-symbol',title,'●');
        util.el('span','',title,'Ask a question');
        close=util.el('button','retro-chat-close',title,'×');
        util.el('div','retro-chat-message',box,'How can I help you with this trip?');
        const compose=util.el('div','retro-chat-compose',box);
        const field=util.el('input','',compose); field.type='text'; field.placeholder='Type a message...'; field.setAttribute('aria-label','Chat message');
        const send=util.el('button','',compose,'➤'); send.type='button'; send.setAttribute('aria-label','Send message'); send.addEventListener('click',()=>env.log('overlay-click',{label:'Send message'}));
      } else {
        util.el('div','',box,'This page has a notice.');
        close=util.el('button','retro-button',box,'Close');
      }
      close.type='button'; close.setAttribute('aria-label','Close'); close.addEventListener('click',()=>ctx.dismiss('close'));
      return {el:box,dismiss:close};
    },
  };
  env.site({
    name: site.name,
    styles: site.styles,
    scripts: site.scripts,
    template: 'site/base',
    design: { parts: { frame: () => site.frame, overlay: () => site.overlay } },
  });
})();
