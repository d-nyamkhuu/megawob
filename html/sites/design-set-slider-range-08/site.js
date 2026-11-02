/* Ridgeview University: 1995 academic hypertext page. */
(function () {
  'use strict';
  function icon(kind, parent) {
    const u = env.util;
    const svg = u.svg('svg', {viewBox:'0 0 40 40', class:'tool-icon', 'aria-hidden':'true'}, parent);
    if (kind === 'print') {
      u.svg('path', {d:'M9 3h16l7 7v27H9Z', fill:'#f6f6f6', stroke:'#555', 'stroke-width':1.5}, svg);
      u.svg('path', {d:'M25 3v7h7', fill:'#dde4ec', stroke:'#555', 'stroke-width':1.2}, svg);
      for (const y of [12, 16, 20, 24, 28, 32]) u.svg('path', {d:`M13 ${y}h15`, stroke:'#698296', 'stroke-width':1.2}, svg);
    } else if (kind === 'save') {
      u.svg('path', {d:'M3 10h13l3 4h18v21H3Z', fill:'#d9d9d9', stroke:'#555', 'stroke-width':1.5}, svg);
      u.svg('path', {d:'M3 35l5-17h32l-4 17Z', fill:'#bfc0c0', stroke:'#555', 'stroke-width':1.5}, svg);
    } else {
      u.svg('circle', {cx:20, cy:20, r:17, fill:'#d8d8d8', stroke:'#555', 'stroke-width':1.5}, svg);
      u.svg('circle', {cx:20, cy:20, r:14, fill:'#e5e5e5'}, svg);
      const t = u.svg('text', {x:20, y:31, 'text-anchor':'middle', 'font-size':32, 'font-weight':'bold', fill:'#1756aa', 'font-family':'Arial,sans-serif'}, svg);
      t.textContent = '?';
    }
  }
  function drawOverlay(ctx) {
      const u=ctx.util;
      const el=u.el('aside','survey-drawer overlay-'+ctx.kind,document.body);el.setAttribute('role','dialog');
      const title={chat:'We value your feedback',cookie:'Your privacy matters',toast:'Notice',promo:'Announcement',banner:'Service notice'}[ctx.kind];
      u.el('h2','',el,title);
      const x=u.el('button','survey-x',el,'×');x.setAttribute('aria-label','Close notice');x.onclick=()=>ctx.dismiss('close');
      u.el('p','survey-intro',el,{chat:'Please tell us how this page worked for you.',cookie:'This page can remember your display preferences.',toast:'The scanner profile was loaded.',promo:'Visit the university digital archive.',banner:'The scanner is available during library hours.'}[ctx.kind]);
      const dismiss=u.el('button','primary survey-close',el,ctx.kind==='cookie'?'Reject optional':'Dismiss');dismiss.type='button';dismiss.onclick=()=>ctx.dismiss('dismiss');
      return {el,dismiss,ttlSteps:ctx.kind==='toast'?5:0};
  }
  function sideTools(_c, parent) {
    for (const b of parent.querySelectorAll('.ref-xtra')) _c.toolbar.appendChild(b);
  }
  const palette = {bg:'#fff', panel:'#fff', fg:'#000', muted:'#000', line:'#c8c8c8'};
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The dedicated left column has room for every note at all viewports.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('library');
      if (!document.body._fragGuard) {
        document.body._fragGuard = true;
        document.body.addEventListener('click', e => {
          const a = e.target.closest && e.target.closest('a[href]');
          if (a && /^#?$/.test(a.getAttribute('href'))) e.preventDefault();
        });
      }
      const task = u.el('aside','catalog-task',document.body);
      const doc = u.el('div','doc',document.body);
      const head = u.el('header','doc-head',doc);
      u.el('div','univ',head,'Ridgeview University');
      const links = u.el('nav','doc-links',head);
      ['Help','Site Map','Contact'].forEach((t,i) => {
        if(i) u.el('span','sep',links,'|');
        u.el('a','',links,t).href='#';
      });
      const toolbar = u.el('nav','tools',document.body);
      for (const [k,t] of [['print','Print'],['save','Save'],['help','Help']]) {
        const a=u.el('a','tool',toolbar);a.href='#';icon(k,a);u.el('span','',a,t);
      }
      Object.assign(_c, {header:head, task, doc, toolbar});
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.task;
      base(_c);
      _c.header = header;
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
      sideTools(_c, _c.headerTools);
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      u.el('h1','',_c.doc,'Image Display Settings');
      const intro = u.el('p','intro',_c.doc);
      intro.append('Adjust the display parameters for the ');
      u.el('span','mono',intro,'library scanner');
      intro.append('. Make your changes below when you are ready.');
      const panel = u.el('section','controls-panel',_c.doc);
      u.el('h2','',panel,'Display Controls');
      Object.assign(_c, {body:panel});
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.task;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main','record-stage',_c.body);
      _c.stage.dataset.role='stage';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        _c.task.appendChild(note);
        note.querySelector('.ref-note-x').textContent = 'Close';
      }
    },
    'frame.footer': (base) => (_c) => {
      const u = _c.util;
      u.el('h3','',_c.doc,'Preview');
      const prev=u.el('div','preview',_c.doc);
      const frame=u.el('div','preview-frame',prev);
      const photo=u.el('div','preview-photo',frame);
      const img=u.el('img','',photo);img.src='sites/design-set-slider-range-08/assets/reference-preview-source.webp';img.alt='University building with a columned entrance';
      u.el('p','',prev,'Use the controls above to adjust the image.\nThe preview updates automatically.');
      const actions=u.el('div','footer-actions',_c.doc);
      const reset=u.el('button','reset',actions,'Reset');reset.type='button';reset.dataset.action='reset';
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      actions.appendChild(foot);
      sideTools(_c, foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
    },
    overlay: () => drawOverlay,
  };
  env.site({
    name:'design-set-slider-range-08',
    template:'site/base',
    langs:['en'],
    styles:['templates/site/css/base-hooks.css','site.css'],
    design:{
      THEMES:{'design-set-slider-range-08':palette},
      LOW_THEME:palette,
      ACCENTS:['#3a5fd0'],
      LOW_ACCENTS:['#3a5fd0'],
      parts,
    },
  });
})();
