(function () {
'use strict';
const palette = { bg: '#f6fbff', panel: '#fff', fg: '#003c86', muted: '#7f93ab', line: '#d3e1ef' };
const parts = {
  'frame.placement': (base) => (_c) => {
    base(_c);
    _c.nav = false;
    _c.sidebar = false;
    // The original has a footer only when it houses the end control.
    _c.wantFooter = _c.placement === 'footer' || _c.placement === 'link';
  },
  'frame.header': () => (_c) => {
    const u = _c.util;
    document.body.classList.add('design', 'web2');
    document.documentElement.style.setProperty('--font', "'Trebuchet MS', 'Segoe UI', Tahoma, Verdana, sans-serif");
    const shell = u.el('div', 'shell', document.body);
    const head = u.el('header', 'head', shell);
    const logo = u.el('div', 'logo', head);
    u.el('span', 'l1', logo, 'Skill');
    u.el('span', 'l2', logo, 'Builder');
    const tabs = u.el('nav', 'tabs', head);
    for (const [text, current] of [['Home', 0], ['Practice', 1], ['My Progress', 0], ['Settings', 0]]) {
      const button = u.el('button', 'tab' + (current ? ' cur' : ''), tabs, text);
      button.type = 'button';
    }
    const links = u.el('div', 'toplinks', head);
    u.el('span', '', links, 'Help');
    u.el('i', '', links, '|');
    u.el('span', '', links, 'Sign Out');
    const panel = u.el('div', 'panel', shell);
    const header = u.el('div', 'panel-head', panel);
    u.el('h1', '', header, 'Drawing Task');
    const step = u.el('span', 'step', header, 'Step 1 of 1');
    Object.assign(_c, { shell, panel, header, step });
  },
  'frame.nav': () => () => {},
  'frame.instruction': (base) => (_c) => {
    base(_c);
    const note = _c.header.querySelector('.ref-instruction');
    if (note) _c.header.insertBefore(note, _c.step);
  },
  'frame.tools': (base) => (_c) => {
    base(_c);
    if (_c.submit) _c.submit.classList.add('header-submit');
  },
  'frame.body': () => (_c) => {
    const u = _c.util, panel = _c.panel;
 const tb=u.el('div','toolbar',panel);
 const pen=u.el('button','tool on',tb);pen.type='button';
 const pi=u.svg('svg',{width:44,height:44,viewBox:'0 0 44 44'},pen);
 const pd=u.svg('defs',{},pi),pg=u.svg('linearGradient',{id:'pencil-g',x1:'0%',y1:'0%',x2:'100%',y2:'100%'},pd);
 for(const [offset,color] of [['0%','#fff0a3'],['42%','#ffd048'],['65%','#f49f20'],['100%','#c77811']])u.svg('stop',{offset,'stop-color':color},pg);
 u.svg('path',{d:'M4 41L9 27L31 3Q34 0 37 3L41 7Q43 10 40 13L17 37Z',fill:'#84949e',opacity:.2},pi);
 u.svg('path',{d:'M7 38L11 27L31 5L38 12L18 34Z',fill:'url(#pencil-g)',stroke:'#b1761d','stroke-width':1},pi);
 u.svg('path',{d:'M12 28L33 6M16 31L36 9',stroke:'#ffdf71','stroke-width':1.6},pi);
 u.svg('path',{d:'M7 38L11 27L18 34Z',fill:'#ead5a8',stroke:'#bca276','stroke-width':.7},pi);
 u.svg('path',{d:'M7 38L9 32L13 36Z',fill:'#26313a'},pi);
 u.svg('path',{d:'M31 5L34 2Q36 1 38 3L41 6Q43 8 41 10L38 12Z',fill:'#ee8197',stroke:'#ba5b6d','stroke-width':1},pi);
 u.svg('path',{d:'M32 5L39 12',stroke:'#d5dbe2','stroke-width':3},pi);
 u.svg('path',{d:'M34 3L39 7',stroke:'#ffb3bf','stroke-width':2},pi);
 u.el('span','',pen,'Pencil');
 u.el('div','sep',tb);
 const clr=u.el('button','tool',tb);clr.type='button';
 const ei=u.svg('svg',{width:44,height:44,viewBox:'0 0 44 44'},clr);
 const ed=u.svg('defs',{},ei),eg=u.svg('linearGradient',{id:'eraser-g',x1:'0%',y1:'0%',x2:'100%',y2:'100%'},ed);
 for(const [offset,color] of [['0%','#ffb6c8'],['55%','#f68ea8'],['100%','#e56a8d']])u.svg('stop',{offset,'stop-color':color},eg);
 u.svg('path',{d:'M4 30L27 6L39 14L41 22L18 42L7 37Z',fill:'#a86276',opacity:.18},ei);
 u.svg('path',{d:'M3 28L25 4L32 5L40 12L40 19L17 40L10 38L3 32Z',fill:'#dc6b8b',stroke:'#cf6583','stroke-width':1},ei);
 u.svg('path',{d:'M3 28L25 4L32 5L40 12L17 34L10 34Z',fill:'url(#eraser-g)',stroke:'#ea819d','stroke-width':1},ei);
 u.svg('path',{d:'M4 28L11 34L17 34L17 39L10 37L4 32Z',fill:'#f3a0b6'},ei);
 u.svg('path',{d:'M7 27L26 7L32 8',fill:'none',stroke:'#ffd3df','stroke-width':1.3},ei);
 u.el('span','',clr,'Clear');
 clr.onclick=()=>{env.widgetDef.clear?.();};

    const body = u.el('div', 'board', panel);
    Object.assign(_c, { body });
  },
  'frame.panel': (base) => (_c) => {
    base(_c);
    const note = _c.body.querySelector('.ref-panel');
    if (note) {
      note.classList.add('task-note');
      if (_c.ctx.instruction.length > 50) note.classList.add('long-instruction');
      note.querySelector('.ref-panel-text').classList.add('instruction');
      note.querySelector('.ref-panel-title').textContent = 'Task instructions';
    }
  },
  'frame.stage': () => (_c) => {
    _c.stage = _c.util.el('main', 'stage', _c.body);
    _c.stage.dataset.role = 'stage';
  },
  'frame.toast': (base) => (_c) => {
    base(_c);
    const note = document.body.querySelector('.ref-note');
    if (note) {
      note.classList.add('task-note');
      note.querySelector('.ref-note-text').classList.add('instruction');
      if (_c.ctx.instruction.length > 50) note.classList.add('long-instruction');
    }
  },
  'frame.footer': (base) => (_c) => {
    base(_c);
    const foot = document.body.querySelector('.ref-foot');
    if (foot) {
      foot.querySelector('.ref-foot-text').remove();
      _c.panel.appendChild(foot);
    }
  },
  'frame.floating': (base) => (_c) => {
    base(_c);
    const dock = document.body.querySelector('.ref-float-dock');
    if (dock) _c.panel.appendChild(dock);
  },
  overlay: () => (ctx) => {const u=ctx.util,kind=ctx.kind;const el=u.el('section','obstruction obstruction-'+kind,document.body);el.dataset.role='overlay';const box=u.el('div','obstruction-box',el);
 const title={cookie:'Your privacy',toast:'Changes saved',chat:'Support',promo:'Workspace update',banner:'Service notice'}[kind]||'Notice';
 const text={cookie:'This site stores optional cookies.',toast:'Your changes have been saved.',chat:'Need a hand with this exercise?',promo:'Explore the latest practice features.',banner:'You are viewing a shared workspace.'}[kind]||'';
 u.el('h3','',box,title);u.el('p','',box,text);
 const dismiss=u.el('button','dismiss',box,kind==='cookie'?'Reject optional':'Close');dismiss.type='button';
 dismiss.onclick=()=>{ctx.dismiss('close');};
 if(kind==='cookie'){const accept=u.el('button','dismiss',box,'Accept optional');accept.type='button';accept.onclick=()=>ctx.dismiss('accept');}
 return{el,dismiss,ttlSteps:kind==='toast'?5:0};}
};
env.site({
  name: 'design-draw-shape-line-08',
  template: 'site/base',
  langs: ['en'],
  styles: ['templates/site/css/base-hooks.css', 'site.css'],
  design: {
    THEMES: { site: palette },
    LOW_THEME: palette,
    ACCENTS: ['#3a9a1c'],
    LOW_ACCENTS: ['#3a9a1c'],
    parts,
  },
});
})();
