(function(){'use strict';
const palette={bg:'#ffffff',panel:'#ffffff',fg:'#1c2430',muted:'#727987',line:'#dfe3e8'};
const parts={
  'frame.placement':base=>(_c)=>{
    base(_c);
    _c.wantFooter=true;
    _c.nav=false;
    _c.sidebar=false;
  },
  'frame.header':()=>_c=>{
    const u=_c.util;
    document.body.classList.add('material-paper','instruction-'+_c.display);
    const app=u.el('main','app',document.body),top=u.el('header','top',app);
    u.el('span','brand',top,'Number Practice');
    u.el('span','section-label',top,'Math Skills');
    const toolbar=u.el('div','chrome-tools',top);
    const center=u.el('div','center',app);
    Object.assign(_c,{app,toolbar,center,header:center});
  },
  'frame.nav':()=>()=>{},
  'frame.tools':base=>_c=>{
    const header=_c.header;
    _c.header=_c.toolbar;
    base(_c);
    _c.header=header;
  },
  'frame.body':()=>_c=>{_c.body=_c.center;},
  'frame.panel':base=>_c=>{
    base(_c);
    _c.body.classList.remove('ref-panel-right');
  },
  'frame.stage':()=>_c=>{_c.stage=_c.util.el('section','stage',_c.center);},
  'frame.toast':base=>_c=>{
    base(_c);
    const note=document.body.querySelector('.ref-note');
    if(note)_c.center.insertBefore(note,_c.stage);
  },
  'frame.footer':base=>_c=>{
    base(_c);
    const foot=document.body.querySelector('.ref-foot');
    foot.classList.add('bottom');
    _c.app.appendChild(foot);
    _c.foot=foot;
  },
  'frame.floating':base=>_c=>{
    base(_c);
    const dock=document.body.querySelector('.ref-float-dock');
    if(dock)_c.foot.appendChild(dock);
  },
  overlay:()=>function(ctx){
    const u=ctx.util,drawer=u.el('aside','survey-drawer',document.body),head=u.el('header','survey-head',drawer);
    u.el('strong','',head,'Quick Survey');const close=u.el('button','survey-x',head,'×');close.type='button';close.setAttribute('aria-label','Close survey');close.addEventListener('click',ctx.dismiss);
    u.el('b','survey-lead',drawer,"We'd love your feedback!");u.el('p','survey-intro',drawer,'This short survey helps us improve your learning experience.');
    u.el('p','survey-question',drawer,'How satisfied are you with this activity?');
    const choices=u.el('div','survey-choices',drawer);['Very satisfied','Satisfied','Neutral','Dissatisfied','Very dissatisfied'].forEach(label=>{const row=u.el('div','survey-choice',choices);u.el('i','',row);u.el('span','',row,label);});
    u.el('label','survey-comment-label',drawer,'Any additional comments?');const comment=u.el('div','survey-comment',drawer,'Tell us more (optional)...');
    const dismiss=u.el('button','survey-close',drawer,'Close survey');dismiss.type='button';dismiss.addEventListener('click',ctx.dismiss);
    return {el:drawer,dismiss};
  }
};
env.site({
  name:'design-solve-puzzle-odd-even-11',template:'site/base',langs:['en'],
  styles:['templates/site/css/base-hooks.css','site.css'],initialOverlay:{kind:'chat'},
  design:{THEMES:{'design-solve-puzzle-odd-even-11':palette},LOW_THEME:palette,ACCENTS:['#4564cf'],LOW_ACCENTS:['#4564cf'],parts}
});
})();
