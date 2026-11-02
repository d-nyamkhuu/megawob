(function(){
  'use strict';
  const palette = {bg:'#ffffff',panel:'#ffffff',fg:'#000000',muted:'#66707d',line:'#bbc2c9'};
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const body = u.el('div','ds-body',document.body);
      body.addEventListener('click',e=>{const a=e.target.closest&&e.target.closest('a[href]');if(a&&/^#?$/.test(a.getAttribute('href')))e.preventDefault();});
      const content = u.el('div','ds-content',body);
      const main = u.el('div','ds-main',content);
      const side = u.el('aside','ds-brief',main);
      const identity = u.el('div','ds-university',side);
      u.el('a','',identity,'Riverton University').href='#';
      u.el('div','',identity,'Office of Communications');
      const task = u.el('section','ds-academic-task',side);
      u.el('h2','',task,'Task');
      u.el('p','',task,'Update your email preferences for university news and events.');
      const header = u.el('div','ds-task-note',task);
      const toolbar = u.el('div','ds-task-tools',task);
      const help = u.el('section','ds-academic-help',side);
      u.el('h3','',help,'Need help?');
      u.el('p','',help,'If you have questions, please contact the Communications Office at ');
      u.el('a','',help,'news@riverton.edu').href='#';
      Object.assign(_c,{content,main,side,header,toolbar});
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.main; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main','ds-stage',_c.main);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.content.insertBefore(note,_c.main);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const u = _c.util;
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.content.appendChild(foot);
      foot.querySelector('.ref-foot-text').remove();
      const reset = u.el('button','ds-reset',foot,'Reset');
      reset.type='button';
      reset.addEventListener('click',()=>{const controls=_c.stage.querySelectorAll('input[type=radio]');controls.forEach(el=>el.checked=false);});
      u.el('a','ds-cancel-link',foot,'Cancel').href='#';
      const links = u.el('nav','ds-footer-links',foot);
      ['Privacy Policy','Contact Us','Help'].forEach(t=>u.el('a','',links,t).href='#');
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.insertBefore(dock,_c.foot.firstChild);
    },
    overlay: () => (ctx) => {
      const u=ctx.util;
      const el=u.el('section','ds-overlay ds-overlay-'+ctx.kind,document.body);
      el.dataset.role='overlay';
      const texts={cookie:'We use cookies to remember your preferences.',toast:'Changes synced.',chat:'Hello. How can we help?',promo:'Try our new workspace.',banner:'Scheduled maintenance tonight.'};
      u.el('div','',el,texts[ctx.kind]);
      const dismiss=u.el('button','',el,ctx.kind==='cookie'?'Accept all':'Close');
      dismiss.addEventListener('click',()=>ctx.dismiss('close'));
      return{el,dismiss,ttlSteps:ctx.kind==='toast'?4:0};
    },
  };
  env.site({
    name:'design-choose-option-radio-01',
    template:'site/base',
    langs:['en'],
    styles:['templates/site/css/base-hooks.css','site.css'],
    design:{THEMES:{'design-choose-option-radio-01':palette},LOW_THEME:palette,ACCENTS:['#0000ee'],LOW_ACCENTS:['#0000ee'],parts},
  });
})();
