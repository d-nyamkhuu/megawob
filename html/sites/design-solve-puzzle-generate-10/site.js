(function () {
  'use strict';
  const C = {site:'design-solve-puzzle-generate-10', task:'solve-puzzle', scenario:'generate', style:'gnome', title:'Number Checker', menu:'', note:'Notes', layout:'floating', subtitle:'', aside:'Remember: Read the condition and check the current number.'};
  env.site({
    name:C.site,
    styles:['site.css'],
    frame(ctx) {
      document.body.className = C.style + ' ' + C.layout + ' instruction-' + ctx.display;
      const u=ctx.util, desktop=u.el('div','desktop-bar',document.body);
      u.el('span','activities',desktop,'Activities');
      u.el('span','desktop-appmark',desktop,'▦');
      u.el('span','desktop-appname',desktop,C.title);
      u.el('span','desktop-date',desktop,'Apr 24   10:17 AM');
      u.el('span','desktop-status',desktop,'◈   ◖))   ▣');
      const app=u.el('main','app',document.body), top=u.el('header','top',app);
      const icon=u.svg('svg',{width:36,height:36,viewBox:'0 0 36 36',class:'title-icon'},top);
      u.svg('rect',{x:2,y:2,width:32,height:32,rx:9,fill:'#287bf0'},icon);
      u.svg('rect',{x:9,y:10,width:18,height:16,rx:4,fill:'none',stroke:'#fff','stroke-width':2},icon);
      u.svg('circle',{cx:13,cy:15,r:1.5,fill:'#fff'},icon);
      u.svg('circle',{cx:23,cy:15,r:1.5,fill:'#fff'},icon);
      u.svg('path',{d:'M13 21h10',stroke:'#fff','stroke-width':2,'stroke-linecap':'round'},icon);
      u.el('span','',top,C.title);u.el('div','header-spacer',top);
      const tools=u.el('div','header-tools',top);
      u.el('div','hamburger',top,'☰');
      const win=u.el('div','native-window-controls',top);
      for(const kind of ['min','max','close'])u.el('span','window-button '+kind,win,kind==='min'?'−':kind==='max'?'□':'×');

      const endR=ctx.rng.fork('chrome/end'), collideR=ctx.rng.fork('chrome/collide');
      const bank=ctx.content&&ctx.content.END_LABELS;
      const labelChoices=(Array.isArray(bank)&&bank.length?bank:['Submit','Done','Finish','Continue','Save','OK','Confirm','Apply','Complete',"I'm done"])
        .map(x=>String(typeof x==='string'?x:(x&&(x.label||x.text||x.name))||x));
      const placement=endR.pick(['canvas','canvas','canvas','canvas','header','link','dock','dock']);
      const label=placement==='canvas'?'Submit':endR.pick(labelChoices);
      const center=u.el('div','center',app), brief=u.el('div','brief',center,ctx.display==='hidden'?'':ctx.instruction);
      if(ctx.display==='hidden')brief.setAttribute('aria-hidden','true');
      const stage=u.el('section','stage',center);
      const aside=u.el('aside','aside',document.body);
      u.el('b','',aside,C.note);u.el('p','aside-copy',aside,C.aside);
      const footer=u.el('footer','bottom',app);
      let submit=null;
      if(!ctx.finish){
        submit=u.el('button','submit end-'+placement,placement==='header'?tools:placement==='dock'?app:footer,placement==='link'?label+' ›':label);
        submit.type='button';submit.setAttribute('aria-label',label);submit.title=label;
        submit.addEventListener('click',ctx.submit);
      }
      if(!ctx.finish&&collideR.bool(.3)){
        const other=labelChoices.filter(x=>x.trim().toLowerCase()!==label.trim().toLowerCase());
        if(other.length){
          const b=u.el('button','top-xtra',tools,collideR.pick(other));b.type='button';
          b.addEventListener('click',()=>env.log('decoy',{label:b.textContent,collide:true}));
        }
      }
      return {stage,submit};
    },
    overlay(ctx) {
      const u=ctx.util,el=u.el('div','overlay '+ctx.kind,document.body);
      const messages={cookie:'This application stores preferences on your device.',toast:'Your workspace has been synced.',chat:'Need help with this exercise?',promo:'Try the new practice collection.',banner:'An updated practice collection is available.'};
      u.el('span','',el,messages[ctx.kind]);
      const dismiss=u.el('button','',el,ctx.kind==='cookie'?'Accept':'Dismiss');
      dismiss.addEventListener('click',ctx.dismiss);return {el,dismiss};
    }
  });
})();
