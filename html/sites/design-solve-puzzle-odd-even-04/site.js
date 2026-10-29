(function () {
  'use strict';
  const C = {site:'design-solve-puzzle-odd-even-04', task:'solve-puzzle', scenario:'odd-even', style:'riso', title:'Number Sort', menu:'HOME    PRACTICE    HELP', note:'Practice Builds Confidence', layout:'horizontal', subtitle:'', aside:''};
  env.site({
    name:C.site,
    styles:['site.css'],
    frame(ctx) {
      document.body.className = C.style+' '+C.layout+' instruction-'+ctx.display;
      const u=ctx.util, app=u.el('main','app',document.body), top=u.el('header','top',app);
      if (['mint','qt','dark','electron','motif','human','beos','gtk','eink'].includes(C.style)) {
        const icon=u.svg('svg',{width:26,height:26,viewBox:'0 0 26 26',class:'title-icon'},top);
        u.svg('rect',{x:3,y:2,width:20,height:22,rx:C.style==='mint'?0:3,fill:C.style==='mint'?'none':C.style==='dark'?'#8266ce':C.style==='electron'?'#ee8520':'#d7e2e8',stroke:'currentColor','stroke-width':1.5},icon);
        u.svg('path',{d:'M7 7h12M7 11h12M7 15h12M7 19h9',fill:'none',stroke:'currentColor','stroke-width':1.5},icon);
      }
      u.el('span','',top,C.title);
      if (['qt','dark','electron','motif','human','gtk','eink'].includes(C.style)) {
        const wc=u.el('div','native-window-controls',top);
        for (const kind of ['min','max','close']) {
          const svg=u.svg('svg',{width:20,height:20,viewBox:'0 0 20 20'},wc);
          u.svg('path',{d:kind==='min'?'M3 12h14':kind==='max'?'M4 4h12v12H4z':'M4 4l12 12M16 4L4 16',fill:'none',stroke:'currentColor','stroke-width':1.5},svg);
        }
      }
      if (C.subtitle) u.el('small','',top,C.subtitle);
      if (C.menu) u.el('nav','menu',top,C.menu);
      const mountain=u.el('img','mountain-art',top); mountain.src='sites/'+C.site+'/assets/mountain-sun.webp'; mountain.alt='';
      const center=u.el('div','center',app);
      const brief=u.el('div','brief',center,ctx.display==='panel'?ctx.instruction:'');
      if (ctx.display==='header'||ctx.display==='toast') {
        const note=u.el('div','episode-note episode-note-'+ctx.display,app,ctx.instruction);
        note.setAttribute('aria-label','Task instructions');
      }
      const stage=u.el('section','stage',center), aside=u.el('aside','aside',document.body);
      u.el('b','',aside,C.note); u.el('p','aside-copy',aside,C.aside);
      const footer=u.el('footer','bottom',app), art=u.el('div','footer-art',footer), trees=u.el('img','',art);
      trees.src='sites/'+C.site+'/assets/footer-trees.webp'; trees.alt='';
      u.el('div','footer-tagline',footer,'A BRIGHTER\nTOMORROW\nADDS UP');
      let submit=null;
      if (!ctx.finish) {
        const er=ctx.rng.fork('chrome/end');
        const labels=(ctx.content&&ctx.content.END_LABELS||['Submit','Done','Finish','Continue','Save','OK','Confirm','Apply']).map(x=>typeof x==='string'?x:(x.label||x.text||x.name));
        const label=er.bool(0.5)?'Submit':er.pick(labels.filter(x=>x.toLowerCase()!=='submit'));
        const placement=er.pick(['footer','footer','footer','link','icon']);
        let parent=footer, cls='submit', tag='button', shown=label;
        if (placement==='link') { cls='episode-end-link'; tag='a'; shown=label+' ›'; }
        else if (placement==='icon') { cls='submit episode-end-icon'; shown='✓'; }
        submit=u.el(tag,cls,parent,shown);
        if (tag==='button') submit.type='button'; else submit.href='#';
        submit.setAttribute('aria-label',label); submit.title=label;
        submit.addEventListener('click',e=>{e.preventDefault();ctx.submit();});
      }
      const cr=ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const labels=(ctx.content&&ctx.content.END_LABELS||['Submit','Done','Finish','Continue','Save','OK','Confirm','Apply']).map(x=>typeof x==='string'?x:(x.label||x.text||x.name));
        const own=submit?submit.getAttribute('aria-label').trim().toLowerCase():'';
        const choices=labels.filter(x=>x.trim().toLowerCase()!==own);
        if (choices.length) {
          const decoy=u.el('button','episode-pq',footer,cr.pick(choices));
          decoy.type='button';
          decoy.addEventListener('click',()=>env.log('decoy',{label:decoy.textContent,collide:true}));
        }
      }
      return {stage,submit};
    },
    overlay(ctx) {
      const u=ctx.util, el=u.el('div','overlay '+ctx.kind,document.body);
      const messages={cookie:'This application stores preferences on your device.',toast:'Your workspace has been synced.',chat:'Need help with this exercise?',promo:'Try the new practice collection.',banner:'An updated practice collection is available.'};
      u.el('span','',el,messages[ctx.kind]);
      const dismiss=u.el('button','',el,ctx.kind==='cookie'?'Accept':'Dismiss');
      dismiss.addEventListener('click',ctx.dismiss);
      return {el,dismiss};
    }
  });
})();
