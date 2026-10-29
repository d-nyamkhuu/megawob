(function () {
  'use strict';
  const svg = (d) => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${d}"/></svg>`;
  const icons = {
    folder: 'M3 6h7l2 2h9v11H3z M3 9h18', play: 'M7 4v16l13-8z', pause: 'M6 4h4v16H6z M14 4h4v16h-4z',
    stop: 'M5 5h14v14H5z', prev: 'M6 5v14 M19 5 9 12l10 7z', next: 'M18 5v14 M5 5l10 7-10 7z',
    full: 'M4 9V4h5 M15 4h5v5 M20 15v5h-5 M9 20H4v-5', save: 'M5 3h12l4 4v14H3V3z M7 3v7h10V3 M7 21v-7h10v7'
  };
  const el = (tag, cls, parent, text) => {
    const n = document.createElement(tag); if (cls) n.className = cls;
    if (text != null) n.textContent = text; if (parent) parent.appendChild(n); return n;
  };
  env.site({
    name: 'design-set-slider-media-05', styles: ['site.css'], scripts: [], template: 'site/base',
    design: {parts:{
    frame: (base) => function(ctx) {
      const app = el('div', 'player-window', document.body);
      const title = el('div', 'titlebar', app);
      el('div', 'app-mark', title, '▶'); el('span', 'app-title', title, 'Media Player');
      const win = el('div', 'window-buttons', title);
      el('span', '', win, '−'); el('span', '', win, '□'); el('span', 'window-close', win, '×');
      const menus = el('nav', 'menubar', app);
      ['File', 'Edit', 'View', 'Playback', 'Audio', 'Video', 'Subtitles', 'Tools', 'Help'].forEach(x => el('span', 'menu-item', menus, x));
      const bar = el('div', 'app-toolbar', app);
      const tool = (ic, label, divider) => { const b=el('button', `tool${divider?' divider':''}`, bar); b.type='button'; b.innerHTML=svg(icons[ic]); el('span','',b,label); return b; };
      tool('folder','Open',true); tool('play','Play'); tool('pause','Pause'); tool('stop','Stop',true);
      tool('prev','Previous'); tool('next','Next',true); tool('full','Full Screen');
      const spacer=el('div','toolbar-spacer',bar);
      let submit = null;
      if (!ctx.finish) {
        const er=ctx.rng.fork('chrome/end'), label=ctx.content.endLabel(er), placement=er.pick(['toolbar','toolbar','footer','link','icon']);
        if(placement==='toolbar'||placement==='icon'){
          const b=el('button','save-button',bar); b.type='button'; b.innerHTML=svg(icons.save);
          el('span','',b,placement==='icon'?'✓':label); b.dataset.role='submit'; b.setAttribute('aria-label',label); b.title=label;
          b.addEventListener('click',()=>ctx.submit()); submit=b;
        }
        if(placement==='footer'||placement==='link'){
          const footer=el('div','action-footer',app);
          if(placement==='footer'){const b=el('button','footer-submit',footer,label);b.type='button';b.dataset.role='submit';b.onclick=()=>ctx.submit();submit=b;}
          else{const b=el('button','footer-link',footer,`${label} ›`);b.type='button';b.dataset.role='submit';b.onclick=()=>ctx.submit();submit=b;}
        }
        const dr=ctx.rng.fork('chrome/collide');
        if(dr.bool(.3)) { const b=el('button','next-extra',bar,'Next');b.type='button';b.dataset.role='xtra';b.onclick=()=>env.log('decoy',{label:'Next',collide:true}); }
      }
      const display=ctx.display||'header';
      if (display==='header') el('div','task-note header-note',app,ctx.instruction);
      const content=el('div','player-content',app);
      const main=el('main','media-column',content);
      const stage=el('div','media-stage',main);
      const side=el('aside','info-column',content);
      const playlist=el('section','playlist',side);
      const ph=el('div','section-heading',playlist); el('strong','',ph,'Playlist'); el('span','muted',ph,'5 items');
      const rows=[['Coastal Horizons','4:18'],['Mountain Trails','3:52'],['City Moments','5:06'],['Rivers and Valleys','4:33'],['Golden Hour','3:17']];
      rows.forEach((row,i)=>{ const r=el('div',`playlist-row${i===0?' selected':''}`,playlist); el('div',`thumb thumb-${i+1}`,r); const t=el('div','row-copy',r); el('span','',t,row[0]); el('small','',t,row[1]); });
      const details=el('section','details',side); el('h3','',details,'Details');
      [['Title','Coastal Horizons'],['Length','4:18'],['Resolution','1920 × 1080'],['Frame rate','30 fps'],['Audio','Stereo (AAC)']].forEach(([a,b])=>{const r=el('div','detail-row',details);el('span','muted',r,a+':');el('span','',r,b);});
      if (display==='panel') { const note=el('section','task-note side-note',side); el('strong','',note,'Task'); el('div','',note,ctx.instruction); }
      const status=el('div','statusbar',app); el('span','',status,'Media Player'); el('span','status-right',status,'Ready');
      const footerAction=app.querySelector('.action-footer'); if(footerAction) app.appendChild(footerAction);
      if (display==='toast') { const n=el('div','task-toast',app); el('span','',n,ctx.instruction); const x=el('button','toast-close',n,'×'); x.type='button'; x.setAttribute('aria-label','Close'); x.onclick=()=>{n.remove();env.log('note-close');}; }
      return {stage, submit};
    },
    overlay: (base) => function(ctx) {
      const box=el('div','consent-overlay',document.body); const card=el('div','consent-card',box);
      el('strong','',card,'Privacy preferences'); el('p','',card,'This media player uses essential settings to provide playback controls.');
      const b=el('button','consent-dismiss',card,'Accept'); b.type='button'; b.onclick=()=>ctx.dismiss('accept');
      return {el:box,dismiss:b};
    }
    }}
  });
})();
