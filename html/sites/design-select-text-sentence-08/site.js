(function () {
  'use strict';
  const palette = { bg: '#eef2f6', panel: '#fff', fg: '#111820', muted: '#5d6a7a', line: '#c9d1d9' };
  const parts = {
    'frame.theme': (base) => (_c) => {
      base(_c);
      _c.root.style.setProperty('--font', '"Helvetica Neue", Helvetica, Arial, "Liberation Sans", sans-serif');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.className = 'design textlab';
      const shell = u.el('div', 'shell', document.body);
      const nav = u.el('header', 'nav', shell);
      u.el('span', 'brand', nav, 'TextLab');
      const links = u.el('nav', 'navlinks', nav);
      ['Home', 'Tasks', 'Reports', 'Help'].forEach(t => {
        const a = u.el('a', t === 'Tasks' ? 'on' : '', links, t);
        a.href = '#';
        a.onclick = e => e.preventDefault();
      });
      const user = u.el('div', 'navuser', nav);
      u.el('span', '', user, 'User: jdoe');
      u.el('i', '', user, '|');
      const a = u.el('a', '', user, 'Sign out');
      a.href = '#';
      a.onclick = e => e.preventDefault();
      const page = u.el('div', 'page', shell);
      const note = u.el('section', 'task-note', page);
      note.hidden = _c.display === 'hidden' || _c.display === 'toast';
      const content = u.el('div', 'content', page);
      const stage = u.el('main', 'stage', content);
      stage.dataset.role = 'stage';
      const aside = u.el('aside', 'aside', content);
      const tools = u.el('section', 'panel tools', aside);
      u.el('div', 'phead', tools, 'Tools');
      const tb = u.el('div', 'pbody', tools);
      const sel = u.el('div', 'tool on', tb);
      const pointer = u.svg('svg', { width: 28, height: 30, viewBox: '0 0 22 26' }, sel);
      u.svg('path', { d: 'M3 1V20L8 15.5L11.5 23L14.5 21.5L11 14.5L18 14Z', fill: '#111', stroke: '#fff', 'stroke-width': 1.2 }, pointer);
      u.el('span', '', sel, 'Select (drag to highlight)');
      const clr = u.el('button', 'tool clear', tb);
      clr.type = 'button';
      const eraser = u.svg('svg', { width: 26, height: 26, viewBox: '0 0 26 26', fill: 'none', stroke: '#19354d', 'stroke-width': 2.4 }, clr);
      u.svg('path', { d: 'M3 15L15 3Q16 2 17 3L23 9Q24 10 23 11L11 23Q10 24 9 23L3 17Q2 16 3 15Z M9 9L17 17' }, eraser);
      u.el('span', '', clr, 'Clear selection');
      clr.onclick = () => { env.widgetDef.clear?.(); };
      u.el('hr', '', tb);
      const prev = u.el('section', 'panel preview', aside);
      u.el('div', 'phead', prev, 'Preview');
      u.el('div', 'pbody preview-body', prev);
      Object.assign(_c, { shell, page, content, toolBody: tb, header: note, siteStage: stage });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const instruction = _c.header.querySelector('.ref-instruction');
      if (instruction) {
        let size = parseFloat(getComputedStyle(instruction).fontSize);
        while (instruction.scrollWidth > instruction.clientWidth && size > 20) {
          size -= 0.5;
          instruction.style.fontSize = size + 'px';
        }
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolBody;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.content; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => { _c.stage = _c.siteStage; },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.toolBody.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.toolBody.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u=ctx.util,kind=ctx.kind;const el=u.el('section','obstruction obstruction-'+kind,document.body);el.dataset.role='overlay';const box=u.el('div','obstruction-box',el);
      const title={cookie:'Your privacy',toast:'Changes saved',chat:'Support',promo:'Workspace update',banner:'Service notice'}[kind];
      const text={cookie:'This application stores optional cookies.',toast:'Your changes have been saved.',chat:'Need a hand with this workspace?',promo:'Explore the latest workspace features.',banner:'You are viewing a shared workspace.'}[kind];
      const label=kind==='cookie'?'Reject optional':'Close';
      u.el('h3','',box,title);u.el('p','',box,text);
      const dismiss=u.el('button','dismiss',box,label);dismiss.type='button';dismiss.onclick=()=>ctx.dismiss('close');
      if(kind==='cookie'){const accept=u.el('button','dismiss',box,'Accept optional');accept.onclick=()=>ctx.dismiss('accept');}
      return{el,dismiss,ttlSteps:kind==='toast'?5:0};
    },
  };
  env.site({
    name: 'design-select-text-sentence-08',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: { THEMES: { site: palette }, LOW_THEME: palette, ACCENTS: ['#1f6fc0'], LOW_ACCENTS: ['#1f6fc0'], parts },
  });
})();
