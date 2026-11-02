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
    chrome(ctx, display) {
      const { util } = ctx;
      const header=util.el('header','retro-windowbar',document.body);
      util.el('span','retro-window-title',header,'');
      const headTools=util.el('div','retro-header-tools',header);
      const windowTools=util.el('div','retro-window-controls',header);
      ['−','□','×'].forEach(symbol=>util.el('span','',windowTools,symbol));
      const body=util.el('div','retro-body',document.body);
      if (display==='panel') body.classList.add('has-panel');
      if (display==='toast') body.classList.add('has-toast');
      const nav=util.el('nav','retro-rail',body);
      [['🗺','Trips'],['🌎','Destinations'],['▤','Bookings'],['★','Ratings'],['📘','Travel Guide']].forEach(([icon,text],i)=>{
        const a=util.el('a',`retro-navlink${i===0?' selected':''}`,nav); a.href='#';
        util.el('span','retro-navicon',a).innerHTML=icons[i]; util.el('span','',a,text);
        a.addEventListener('click',e=>{e.preventDefault();env.log('decoy',{what:'nav',label:text});});
      });
      const main=util.el('div','retro-main',body);
      const titleBox=util.el('div','retro-page-title',main);
      util.el('h1','',titleBox,'Trip to the Channel Coast');
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
      return {header, body, main, headTools, inspector};
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
    design: { parts: {
      'frame.header': () => _c => Object.assign(_c, site.chrome(_c.ctx, _c.display)),
      'frame.nav': () => () => {},
      'frame.instruction': base => _c => {
        const h = _c.header;
        _c.header = _c.main;
        base(_c);
        _c.header = h;
        const note = _c.main.querySelector('.ref-instruction');
        if (note) {
          note.classList.add('retro-instruction', 'retro-header-note');
          const icon = _c.util.el('span', 'retro-instruction-icon');
          icon.innerHTML = icons[2];
          note.prepend(icon);
        }
      },
      'frame.tools': base => _c => {
        const h = _c.header;
        _c.header = _c.headTools;
        base(_c);
        _c.header = h;
      },
      'frame.body': () => () => {},
      'frame.panel': base => _c => {
        base(_c);
        const panel = _c.body.querySelector('.ref-panel');
        if (panel) {
          panel.classList.add('retro-note-column');
          if (_c.H <= 800) _c.main.append(panel);
          else _c.body.insertBefore(panel, _c.inspector);
        }
      },
      'frame.stage': base => _c => {
        const b = _c.body;
        _c.body = _c.main;
        base(_c);
        _c.body = b;
        _c.stage.classList.add('retro-stage');
      },
      'frame.toast': base => _c => {
        base(_c);
        const note = document.querySelector('.ref-note');
        if (note) {
          note.classList.add('retro-note');
          const icon = _c.util.el('span', 'retro-info-symbol', null, 'i');
          note.prepend(icon);
        }
      },
      'frame.footer': base => _c => {
        base(_c);
        const foot = document.querySelector('.ref-foot');
        if (foot) {
          foot.classList.add('retro-form-footer');
          _c.main.append(foot);
        }
      },
      overlay: () => site.overlay,
    } },
  });
})();
