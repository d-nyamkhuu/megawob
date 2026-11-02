/* Photo Studio: Frutiger Aero three-zone console (brief, settings task area, live preview + progress). */
(function () {
  'use strict';
  function leaf(parent) {
    const u = env.util;
    const svg = u.svg('svg', {viewBox:'0 0 80 70',class:'leaf','aria-hidden':'true'}, parent);
    const defs = u.svg('defs', {}, svg);
    const g = u.svg('linearGradient', {id:'lf-g',x1:0,y1:0,x2:1,y2:1}, defs);
    u.svg('stop', {offset:'0','stop-color':'#b6ee5a'}, g);
    u.svg('stop', {offset:'1','stop-color':'#2f9a22'}, g);
    u.svg('path', {d:'M8 61C3 22 27 3 58 7L77 3C70 20 78 35 61 51C47 67 27 65 8 61Z',fill:'url(#lf-g)',stroke:'#8bbc50','stroke-width':1.5}, svg);
    u.svg('path', {d:'M2 66C25 47 43 29 68 12M23 48L21 28M34 39L33 18M44 30L46 12M24 48L46 52M36 38L57 41M47 28L62 29',fill:'none',stroke:'#7cae38','stroke-width':2,'stroke-linecap':'round'}, svg);
  }
  function scene(parent) {
    const u = env.util;
    const photo = u.el('img', 'photo', parent);
    photo.src = 'sites/design-set-slider-multi-03/assets/lake-preview.webp';
    photo.alt = 'Mountain lake reflecting a pine forest under a blue sky';
  }
  function icon(parent, kind) {
    const u = env.util;
    const svg = u.svg('svg', {viewBox:'0 0 40 40',class:'ico','aria-hidden':'true'}, parent);
    if (kind === 0) {
      for (let r = 0; r < 5; r++) for (let c = 0; c < 5; c++) u.svg('rect', {x:c*8,y:r*8,width:8,height:8,fill:(r+c)%2?'#fff':'#b8c6d6'}, svg);
      u.svg('rect', {x:.5,y:.5,width:39,height:39,fill:'none',stroke:'#aab8c8'}, svg);
    } else if (kind === 1) {
      for (const y of [28,19,10]) {
        u.svg('ellipse', {cx:20,cy:y+6,rx:17,ry:7,fill:'#9fb3c9',stroke:'#7d93ab'}, svg);
        u.svg('ellipse', {cx:20,cy:y,rx:17,ry:7,fill:'#c3d2e2',stroke:'#7d93ab'}, svg);
      }
    } else {
      u.svg('circle', {cx:20,cy:20,r:18,fill:'#8fa6bf'}, svg);
      for (const [x,y] of [[12,15],[20,10],[29,15],[12,26],[28,27]]) u.svg('circle', {cx:x,cy:y,r:3.4,fill:'#fff'}, svg);
      u.svg('circle', {cx:22,cy:30,r:4,fill:'#eaf2fa'}, svg);
    }
  }
  function gear(parent) {
    const u = env.util;
    const svg = u.svg('svg', {viewBox:'0 0 40 40',class:'gear','aria-hidden':'true'}, parent);
    u.svg('path', {d:'M17 3h6l1 5 4 2 5-3 4 4-3 5 2 4 5 1v6l-5 1-2 4 3 5-4 4-5-3-4 2-1 5h-6l-1-5-4-2-5 3-4-4 3-5-2-4-5-1v-6l5-1 2-4-3-5 4-4 5 3 4-2z',fill:'#4997e3'}, svg);
    u.svg('circle', {cx:20,cy:21,r:6.5,fill:'#e8f4ff'}, svg);
  }
  function drawOverlay(ctx) {
      const u=ctx.util;
      const el=u.el('aside','survey-drawer overlay-'+ctx.kind,document.body);el.setAttribute('role','dialog');
      const survey=ctx.kind==='chat';
      const title={chat:'Quick feedback',cookie:'Your privacy matters',toast:'Studio notice',promo:'Try Photo Studio Plus',banner:'Service notice'}[ctx.kind];
      u.el('h2','',el,title);
      const x=u.el('button','survey-x',el,'×');x.setAttribute('aria-label','Close notice');x.onclick=()=>ctx.dismiss('close');
      if(survey){
        u.el('p','survey-intro',el,'Quick survey (2 questions)');
        u.el('div','survey-question',el,'1. How easy was it to find what you needed today?');
        const choices=u.el('div','survey-choices',el);
        ['Very easy','Somewhat easy','Neither easy nor difficult','Somewhat difficult','Very difficult'].forEach((label)=>{
          const row=u.el('label','',choices);const radio=u.el('input','',row);radio.type='radio';radio.name='ease';radio.value=label;u.el('span','',row,label);
        });
        u.el('div','survey-question second',el,'2. What could we improve?');
        const dropdown=u.el('div','survey-dropdown',el);
        const toggle=u.el('button','survey-select',dropdown,'Select an option…');toggle.type='button';toggle.setAttribute('aria-expanded','false');
        const options=u.el('div','survey-options',dropdown);options.hidden=true;
        for(const label of ['Finding tools','Image quality','Help and guidance']){const b=u.el('button','',options,label);b.type='button';b.onclick=()=>{toggle.textContent=label;options.hidden=true;toggle.setAttribute('aria-expanded','false');};}
        toggle.onclick=()=>{options.hidden=!options.hidden;toggle.setAttribute('aria-expanded',String(!options.hidden));};
      }else{
        u.el('p','survey-intro',el,{cookie:'This studio can remember your display preferences.',toast:'Your photo is ready for editing.',promo:'Discover more tools for your photos.',banner:'Photo Studio is available offline.'}[ctx.kind]);
      }
      const dismiss=u.el('button','primary survey-close',el,survey?'Close survey':ctx.kind==='cookie'?'Reject optional':'Dismiss');dismiss.type='button';dismiss.onclick=()=>ctx.dismiss('dismiss');
      return {el,dismiss,ttlSteps:ctx.kind==='toast'?5:0};
  }
  // Keep the studio's chrome; let the template own episode controls and instructions.
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      document.querySelectorAll('.studio-header,.studio-main').forEach(node => node.remove());
      document.body.className = `studio instruction-${_c.display}`;
    },
    'frame.header': () => (_c) => {
      const { util: u } = _c;
      const header = u.el('header', 'studio-header', document.body);
      leaf(header);
      const brand = u.el('div', 'brand', header);
      u.el('h1', '', brand, 'Photo Studio');
      u.el('div', 'motto', brand, 'Brighten your world');
      const nav = u.el('nav', 'studio-nav', header);
      for (const t of ['Home', 'Tools', 'Help']) u.el('span', '', nav, t);
      u.el('span', 'orb', header);
      const body = u.el('div', 'studio-main ref-body', document.body);
      const left = u.el('div', 'left-col', body);
      const brief = u.el('section', 'brief', left);
      const right = u.el('aside', 'side-col', body);
      Object.assign(_c, { header, studioNav: nav, body, left, brief, right });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base({ ..._c, header: _c.brief });
      const instruction = _c.brief.querySelector('.ref-instruction');
      if (instruction) instruction.classList.add('instruction');
      _c.util.el('p', 'hint', _c.brief, 'Drag a handle to adjust its value.');
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
      _c.studioNav.append(_c.headerTools);
    },
    'frame.body': () => () => {},
    'frame.panel': (base) => (_c) => {
      const { util: u, right } = _c;
      base({ ..._c, body: right });
      const note = right.querySelector('.ref-panel');
      if (note) {
        note.classList.add('side-instruction');
        note.querySelector('.ref-panel-title').classList.add('studio-task-title');
        note.querySelector('.ref-panel-text').classList.add('instruction', 'instruction-panel');
      }
      u.el('h2', 'side-title', right, 'Live Preview');
      scene(u.el('div', 'preview', right));
      u.el('h3', 'progress-title', right, 'Image Controls');
      u.el('ul', 'progress', right);
      _c.actions = u.el('div', 'actions', right);
    },
    'frame.stage': () => (_c) => {
      const { util: u, left } = _c;
      const panel = u.el('section', 'settings', left);
      const heading = u.el('div', 'panel-head', panel);
      gear(heading);
      u.el('h2', '', heading, 'Adjust Image Settings');
      const stage = u.el('main', 'record-stage', panel);
      stage.dataset.role = 'stage';
      _c.stage = stage;
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.querySelector('.ref-note');
      if (note) {
        note.classList.add('instruction-toast');
        _c.brief.prepend(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const footer = document.querySelector('.ref-foot');
      if (footer) _c.actions.append(footer);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.querySelector('.ref-float-dock');
      if (dock) _c.actions.append(dock);
    },
    'frame.end': (base) => (_c) => {
      for (const button of _c.actions.querySelectorAll('.ref-submit')) button.classList.add('primary');
      if (_c.submit && _c.submit.classList.contains('ref-endlink')) _c.submit.classList.add('text-end');
      return base(_c);
    },
    // The survey drawer is studio-specific; all other popup kinds use the template.
    overlay: (base) => (ctx) => ctx.kind === 'chat' ? drawOverlay(ctx) : base(ctx),
  };

  env.site({
    name: 'design-set-slider-multi-03',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-overlays.css', 'templates/site/css/base-hooks.css', 'frame-support.css', 'site.css'],
    design: {
      THEMES: { studio: { bg: '#d6f2ff', panel: '#f4faff', fg: '#305d94', muted: '#3b78b8', line: '#cfe5f8' } },
      LOW_THEME: { bg: '#d6f2ff', panel: '#f4faff', fg: '#305d94', muted: '#3b78b8', line: '#cfe5f8' },
      ACCENTS: ['#0064d6'],
      LOW_ACCENTS: ['#0064d6'],
      parts,
    },
  });
  window.__studioIcon=icon;
})();
