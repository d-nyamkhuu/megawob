(function () {
  'use strict';
  const D = {
    'site': 'design-use-social-feed-reply-02',
    'brand': 'Home',
    'mode': 'riso',
    'tokens': {
      'bg': '#f7f3e9',
      'panel': '#f7f3e9',
      'fg': '#24243a',
      'accent': '#087092',
      'font': 'Arial,sans-serif',
      'line': '#d5d4cd',
      'muted': '#3b4a61',
    },
    'nav': 'Home    View    Tools    Help',
    'obstruction': null,
    'footer': '',
  };
  env.site({
    name: D.site,
    template: 'site/base',
    styles: ['site.css'],
    scripts: [],
    design: { parts: {
    'frame.header': () => function (_c) {
      const {ctx, display} = _c;
      const u=ctx.util;
      document.querySelectorAll('.site-shell').forEach(shell=>shell.remove());
      for(const [k,v] of Object.entries(D.tokens)) document.documentElement.style.setProperty('--'+k,v);
      document.body.className='riso instruction-'+display;
      const shell=u.el('div','site-shell ref-body',document.body);
      const rail=u.el('aside','riso-rail',shell);
      const bird=u.el('div','riso-bird',rail);
      bird.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 5c-1 .5-2 .8-3 1a5 5 0 0 0-8 4C7 10 4 8 2 5c-1 3 0 5 2 6-1 0-2 0-3-1 0 3 2 5 5 5-1 1-2 1-3 1 1 2 3 3 5 3-2 2-5 3-8 3 3 1 5 2 8 2 10 0 15-8 15-15V8c1-1 2-2 2-3-1 1-2 1-3 1z"/></svg>';
      const nav=u.el('nav','riso-nav',rail);
      const icons={
        Home:'<path d="M2 11 12 3l10 8M5 10v11h14V10M10 21v-7h4v7"/>',
        Explore:'<circle cx="10" cy="10" r="7"/><path d="m15 15 7 7"/>',
        Notifications:'<path d="M18 8a6 6 0 0 0-12 0c0 8-3 8-3 10h18c0-2-3-2-3-10M10 22h4"/>',
        Messages:'<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 6 10 8L22 6"/>',
        Lists:'<rect x="3" y="2" width="18" height="20" rx="2"/><path d="M7 7h10M7 12h10M7 17h6"/>',
        Profile:'<circle cx="12" cy="7" r="4"/><path d="M3 22v-2a9 9 0 0 1 18 0v2z"/>'
      };
      for(const name of Object.keys(icons)){
        const b=u.el('button','riso-nav-item'+(name==='Home'?' selected':''),nav);
        b.type='button';
        b.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">'+icons[name]+'</svg><span>'+name+'</span>';
        b.addEventListener('click',()=>env.log('navigation',{label:name}));
      }
      const feedCol=u.el('section','riso-feed-col',shell);
      const heading=u.el('div','riso-heading',feedCol);
      u.el('h1','',heading,'Home');
      const inspector=u.el('aside','riso-inspector',shell);
      const inspectorTop=u.el('div','riso-inspector-top',inspector);
      u.el('h2','',inspectorTop,'Post details');
      u.el('span','riso-dots',inspectorTop,'•••');
      const detail=u.el('div','riso-detail',inspector);
      const author=u.el('div','riso-detail-author',detail);
      const av=u.el('div','riso-detail-avatar',author);
      const who=u.el('div','',author);
      u.el('strong','',who,'Taylor Kim');
      u.el('div','',who,'@taylorkim');
      u.el('div','riso-detail-age',who,'2h ago');
      u.el('p','riso-detail-text',detail,'Wildfire season starts early in the south.');
      const attachment=u.el('div','riso-detail-attachment',detail);
      const card=u.el('div','as-link',attachment);
      u.el('div','',card);
      const cardText=u.el('div','',card);
      u.el('small','',cardText,'newsoutlet.com');
      u.el('strong','',cardText,'Wildfire season starts early in the south');
      u.el('p','',cardText,'Drier conditions and high winds are raising concerns across several states as crews prepare for a challenging season.');
      const stats=u.el('div','riso-detail-stats',detail);
      for(const [icon,label] of [['♧','12 replies'],['⇄','28 reposts'],['♡','64 likes'],['⇧','Share post'],['♧','Save post']]){
        const line=u.el('div','',stats);
        u.el('span','riso-static-icon',line,icon);
        u.el('span','',line,label);
      }
      const section=u.el('section','riso-author',inspector);
      u.el('h3','',section,'Author');
      const bio=u.el('div','riso-author-body',section);
      const bioAv=u.el('div','riso-bio-avatar',bio);
      const bioInfo=u.el('div','riso-bio-info',bio);
      u.el('strong','',bioInfo,'Taylor Kim');
      u.el('div','',bioInfo,'@taylorkim');
      u.el('p','',bioInfo,'Outdoor writer, hiker, and nature enthusiast.');
      u.el('p','',bioInfo,'♧  Austin, TX');
      u.el('p','',bioInfo,'412 Following　 2,318 Followers');
      const follow=u.el('button','riso-follow',section,'Follow');
      follow.addEventListener('click',()=>env.log('follow',{source:'inspector'}));
      const endArea=u.el('div','riso-end-area',display==='panel'?inspector:heading);
      const inspectorScroll=u.el('div','riso-inspector-scroll',inspector);
      inspectorScroll.append(inspectorTop,detail,section);
      const footer=u.el('div','riso-end-footer',inspector);
      Object.assign(_c,{header:heading,body:feedCol,inspector,inspectorScroll,endArea,footer});
    },
    'frame.nav': () => function () {},
    'frame.instruction': (base) => function (_c) {
      base(_c);
      const note=_c.header.querySelector('.ref-instruction');
      if(note)note.classList.add('riso-header-note');
    },
    'frame.tools': (base) => function (_c) {
      const header=_c.header;
      _c.header=_c.endArea;
      base(_c);
      _c.header=header;
    },
    'frame.body': () => function () {},
    'frame.panel': (base) => function (_c) {
      const body=_c.body;
      _c.body=_c.inspector;
      base(_c);
      _c.body=body;
      const panel=_c.inspector.querySelector('.ref-panel');
      if(panel){
        panel.classList.add('riso-side-note');
        _c.inspector.insertBefore(panel,_c.inspectorScroll);
      }
    },
    'frame.stage': (base) => function (_c) {
      base(_c);
      _c.stage.classList.add('stage');
    },
    'frame.toast': (base) => function (_c) {
      base(_c);
      const note=document.querySelector('.ref-note');
      if(note){note.classList.add('riso-toast-note');_c.inspector.append(note);}
    },
    'frame.footer': (base) => function (_c) {
      base(_c);
      const foot=document.querySelector('.ref-foot');
      if(foot){
        foot.querySelector('.ref-foot-text').textContent='Ready';
        _c.footer.append(foot);
      }
    },
    'frame.floating': (base) => function (_c) {
      base(_c);
      const dock=document.querySelector('.ref-float-dock');
      if(dock)_c.inspector.append(dock);
    },
    overlay: () => function overlay(ctx) {
      const u=ctx.util;
      const el=u.el('section','reference-overlay '+ctx.kind,document.body);
      const heading=document.querySelector('.riso-heading');
      const headerBottom=heading?heading.getBoundingClientRect().bottom:60;
      el.style.setProperty('--riso-header-height',headerBottom+'px');
      document.body.classList.add('riso-overlay-'+ctx.kind);
      el.setAttribute('role','dialog');
      const close=(parent,cls,label)=>{
        const b=u.el('button',cls,parent,label);b.type='button';
        b.addEventListener('click',()=>{document.body.classList.remove('riso-overlay-'+ctx.kind,'riso-has-banner');ctx.dismiss();});return b;
      };
      if(ctx.kind==='cookie'){
        el.setAttribute('aria-label','Cookie preferences');
        u.el('div','riso-cookie-icon',el,'◉');
        u.el('p','',el,'We use cookies to improve your experience, personalize content, and analyze site traffic.');
        const link=u.el('button','riso-overlay-link',el,'Learn more');
        link.addEventListener('click',()=>env.log('overlay-info',{kind:'cookie'}));
        const dismiss=close(el,'riso-overlay-close','Dismiss');
        return {el,dismiss};
      }
      if(ctx.kind==='chat'){
        el.setAttribute('aria-label','Need help?');
        u.el('h2','',el,'Need help?');
        const dismiss=close(el,'riso-chat-close','×');
        const bubble=u.el('div','riso-chat-bubble',el);
        u.el('div','riso-chat-avatar',bubble);
        u.el('p','',bubble,'Hi! How can I help you today?');
        const row=u.el('div','riso-chat-row',el);
        const input=u.el('input','',row);input.placeholder='Type a message...';
        const send=u.el('button','',row,'➤');send.addEventListener('click',()=>env.log('overlay-chat',{message:input.value}));
        return {el,dismiss};
      }
      if(ctx.kind==='promo'){
        el.setAttribute('aria-label','Stay in the loop');
        const card=u.el('div','riso-promo-card',el);
        const dismiss=close(card,'riso-promo-close','×');
        u.el('div','riso-promo-icon',card,'✉');
        u.el('h2','',card,'Stay in the loop');
        u.el('p','',card,'Get the latest stories, tips, and updates straight to your inbox.');
        const input=u.el('input','',card);input.placeholder='Your email address';input.type='email';
        const subscribe=u.el('button','riso-subscribe',card,'Subscribe');
        subscribe.addEventListener('click',()=>env.log('overlay-subscribe',{email:input.value}));
        close(card,'riso-no-thanks','No thanks');
        return {el,dismiss};
      }
      if(ctx.kind==='banner'){
        el.setAttribute('aria-label','Announcement');
        document.body.classList.add('riso-has-banner');
        u.el('div','riso-banner-icon',el,'♢');
        const copy=u.el('div','riso-banner-copy',el);
        u.el('strong','',copy,'New! Follow topics to see more of what you love.');
        u.el('p','',copy,'Now you can follow topics like hiking, national parks, and climate news.');
        const dismiss=close(el,'riso-banner-close','×');
        return {el,dismiss};
      }
      el.setAttribute('aria-label','Notification');
      u.el('h2','',el,'Notification');
      u.el('p','',el,'Your workspace is up to date.');
      const dismiss=close(el,'riso-overlay-close','Dismiss');
      return {el,dismiss};
    },
    } },
  });
})();
