/* Photo Workshop: Yosemite-era menu bar, toolbar, library sidebar and compact Adjust Image dialog. */
(function () {
  'use strict';
  const ICONS={
    apple:'<path fill="currentColor" stroke="none" d="M16 2c0 3-2 5-4 5 0-3 2-5 4-5M19 13c0 4 3 5 3 5-1 3-3 6-5 6-2 0-2-1-4-1s-3 1-4 1c-3 0-7-6-7-11 0-4 3-7 6-7 2 0 3 1 5 1s3-1 5-1c2 0 4 1 5 3-3 1-4 3-4 4"/>',
    wifi:'<path d="M2 8q10-9 20 0M5 12q7-6 14 0M9 16q3-3 6 0"/><circle cx="12" cy="20" r="1" fill="currentColor"/>',
    battery:'<rect x="2" y="6" width="18" height="12" rx="2"/><path d="M22 10v4"/><rect x="4" y="8" width="13" height="8" rx="1" fill="currentColor" stroke="none"/>',
    search:'<circle cx="10" cy="10" r="7"/><path d="m15 15 6 6"/>',
    list:'<path d="M8 6h14M8 12h14M8 18h14M2 6h2M2 12h2M2 18h2"/>',
    import:'<path d="M10 2v7H4V5M14 22v-7h6v4M2 14h7v6H5M22 10h-7V4h4M12 10v4M10 12h4"/>',
    adjust:'<path d="M12 3v18M3 12h18M6 6l12 12M18 6L6 18"/>',
    filters:'<path fill="#65717b" d="M9 3c-4-1-6 4-5 7 1 2 4 3 5 5l1 6h4l1-6c1-2 4-3 5-5 1-3-1-8-5-7l-3 1z"/><path stroke="#d9dfe5" d="M9 5c-2 1-2 4-1 6M15 5c2 1 2 4 1 6"/>',
    crop:'<path d="M7 3v14h14M3 7h14v14"/>',
    rotate:'<path d="M20 12a8 8 0 1 1-3-6.2M20 4v5h-5"/>',
    share:'<path d="M12 15V3M8 7l4-4 4 4M5 11v10h14V11"/>',
    photos:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 16l5-5 4 4 3-3 6 5"/>',
    fav:'<path d="M12 20S4 14 4 9a4 4 0 0 1 8-1 4 4 0 0 1 8 1c0 5-8 11-8 11z"/>',
    recent:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    trash:'<path d="M5 7h14M9 7V4h6v3M7 7l1 13h8l1-13M10 10v7M14 10v7"/>',
    reset:'<path d="M21 12a9 9 0 1 1-3-6.7M20 3v6h-6"/>',
  };
  function icon(parent,name){
    const s=document.createElementNS('http://www.w3.org/2000/svg','svg');
    s.setAttribute('viewBox','0 0 24 24');s.setAttribute('aria-hidden','true');
    s.innerHTML=ICONS[name];parent.appendChild(s);return s;
  }
  function lights(u,parent){const l=u.el('div','lights',parent);u.el('i','',l);u.el('i','',l);u.el('i','',l);return l;}
  function drawOverlay(ctx) {
      const u=ctx.util;
      const el=u.el('aside','survey-drawer overlay-'+ctx.kind,document.body);el.setAttribute('role','dialog');
      const survey=ctx.kind==='chat';
      const title={chat:'Photo Workshop feedback',cookie:'Your privacy matters',toast:'Notice',promo:'Photo Workshop Plus',banner:'Service notice'}[ctx.kind];
      u.el('h2','',el,title);
      const x=u.el('button','survey-x',el,'×');x.setAttribute('aria-label','Close notice');x.onclick=()=>ctx.dismiss('close');
      if(survey){
        u.el('p','survey-intro',el,'Quick survey (2 questions)');u.el('hr','',el);
        u.el('div','survey-question',el,'1. How easy was it to adjust your photo?');
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
        u.el('p','survey-intro',el,{cookie:'Photo Workshop can remember your display preferences.',toast:'Your photo is ready for editing.',promo:'Discover more tools for your library.',banner:'Your library is available offline.'}[ctx.kind]);
      }
      const dismiss=u.el('button','primary survey-close',el,survey?'Close survey':ctx.kind==='cookie'?'Reject optional':'Dismiss');dismiss.type='button';dismiss.onclick=()=>ctx.dismiss('dismiss');
      return {el,dismiss,ttlSteps:ctx.kind==='toast'?5:0};
  }
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('yos', 'instruction-' + _c.display);
      const menu = u.el('div', 'menubar', document.body);
      icon(u.el('span', 'menu-apple', menu), 'apple');
      u.el('b', '', menu, 'Photo Workshop');
      for (const m of ['File', 'Edit', 'View', 'Window', 'Help']) u.el('span', '', menu, m);
      const status = u.el('span', 'sp menu-status', menu);
      icon(status, 'wifi'); icon(status, 'battery'); icon(status, 'battery');
      u.el('span', '', menu, 'Mon 10:24 AM');
      icon(u.el('span', 'menu-icon', menu), 'search');
      icon(u.el('span', 'menu-icon', menu), 'list');
      const bar = u.el('div', 'toolbar', document.body);
      lights(u, bar);
      for (const [n, k] of [['Import', 'import'], ['Adjust', 'adjust'], ['Filters', 'filters'], ['Crop', 'crop'], ['Rotate', 'rotate']]) {
        const t = u.el('div', 'tool' + (n === 'Adjust' ? ' on' : ''), bar);
        icon(t, k); u.el('span', '', t, n);
      }
      const sh = u.el('div', 'tool share', bar);
      icon(sh, 'share'); u.el('span', '', sh, 'Share');
      const task = u.el('aside', 'catalog-task task-' + _c.display);
      task.hidden = _c.display === 'hidden';
      Object.assign(_c, { bar, sh, header: task });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.bar;
      base(_c);
      _c.header = header;
      _c.bar.insertBefore(_c.headerTools, _c.sh);
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const side = u.el('div', 'sidebar', document.body);
      u.el('div', 'lib', side, 'Library');
      for (const [n, k] of [['All Photos', 'photos'], ['Favorites', 'fav'], ['Recently Added', 'recent'], ['Trash', 'trash']]) {
        const it = u.el('div', 'item' + (n === 'All Photos' ? ' on' : ''), side);
        icon(it, k); u.el('span', '', it, n);
      }
      const body = u.el('div', 'canvas', document.body);
      const dialog = u.el('section', 'dialog', body);
      const tb = u.el('div', 'dtitle', dialog);
      lights(u, tb); u.el('span', '', tb, 'Adjust Image');
      body.appendChild(_c.header);
      Object.assign(_c, { body, dialog });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      const stage = u.el('main', 'record-stage', _c.dialog);
      stage.dataset.role = 'stage';
      const foot = u.el('div', 'dfoot', _c.dialog);
      const reset = u.el('button', 'dbtn reset', foot);
      reset.type = 'button'; reset.dataset.action = 'reset';
      icon(reset, 'reset'); u.el('span', '', reset, 'Reset All');
      const cancel = u.el('button', 'dbtn gap', foot, 'Cancel'); cancel.type = 'button';
      const apply = u.el('button', 'dbtn blue', foot, 'Apply'); apply.type = 'button';
      _c.stage = stage;
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.header.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.body.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.body.appendChild(dock);
    },
    overlay: () => drawOverlay,
  };
  const palette = { bg: '#f1f3f5', panel: '#f6f6f8', fg: '#1c2433', muted: '#717b8b', line: '#c4c4c6' };
  env.site({
    name: 'design-set-slider-horizontal-08',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-set-slider-horizontal-08': palette },
      LOW_THEME: palette,
      ACCENTS: ['#2f83fc'],
      LOW_ACCENTS: ['#2f83fc'],
      parts,
    },
  });
})();
