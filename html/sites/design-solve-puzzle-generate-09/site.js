(function(){
  'use strict';
  const palette = { bg:'#fff', panel:'#fff', fg:'#080808', muted:'#393939', line:'#c8c8c8' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('swiss-editorial');
      const app = u.el('main','app',document.body);
      const top = u.el('header','top',app);
      u.el('span','',top,'Odd Number Practice');
      const center = u.el('div','center',app);
      const brief = u.el('div','brief',center);
      u.el('span','zone-number',brief,'01');
      u.el('div','zone-label',brief,'Task');
      const aside = u.el('aside','aside',document.body);
      u.el('span','zone-number',aside,'03');
      u.el('div','zone-label',aside,'Feedback');
      u.el('p','aside-copy',aside,'No submission yet.');
      const toolbar = u.el('div','swiss-toolbar',aside);
      Object.assign(_c,{ app, center, aside, toolbar, header:brief });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
      if (_c.submit) _c.submit.classList.add('swiss-end-header');
    },
    'frame.body': () => (_c) => { _c.body = _c.center; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.aside;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section','stage',_c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.aside.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.aside.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.aside.appendChild(dock);
      if (_c.placement === 'floating' && _c.submit) _c.submit.classList.add('swiss-end-floating');
    },
    overlay: () => (ctx) => {
      const u=ctx.util,el=u.el('div','overlay '+ctx.kind,document.body);
      const messages={cookie:'This application stores preferences on your device.',toast:'Your workspace has been synced.',chat:'Need help with this exercise?',promo:'Try the new practice collection.',banner:'An updated practice collection is available.'};
      u.el('span','',el,messages[ctx.kind]);const dismiss=u.el('button','',el,ctx.kind==='cookie'?'Accept':'Dismiss');
      dismiss.addEventListener('click',ctx.dismiss);return {el,dismiss};
    },
  };
  env.site({
    name:'design-solve-puzzle-generate-09',
    template:'site/base',
    langs:['en'],
    styles:['templates/site/css/base-hooks.css','site.css'],
    design:{THEMES:{'design-solve-puzzle-generate-09':palette},LOW_THEME:palette,ACCENTS:['#f32926'],LOW_ACCENTS:['#f32926'],parts},
  });
})();
