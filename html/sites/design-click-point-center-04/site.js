(function () {
  'use strict';
  const palette = { bg: '#b4b4b4', panel: '#b4b4b4', fg: '#000', muted: '#222', line: '#000' };
  const win = (u, parent, cls, title) => {
    const t = u.el('div', 'wb-title ' + cls, parent);
    u.el('span', 'wb-gad close', t);
    u.el('span', 'wb-title-text', t, title);
    const r = u.el('span', 'wb-title-r', t);
    u.el('span', 'wb-gad small size', r);
    u.el('span', 'wb-gad small back', r);
    return t;
  };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.className = 'design amiga';
      document.documentElement.style.setProperty('--font', '"Courier New", monospace');
      const shell = u.el('div', 'shell', document.body);
      const bar = u.el('header', 'wb-bar', shell);
      const g0 = u.el('span', 'wb-gad disk', bar);
      u.el('span', 'wb-bar-title', bar, 'Amiga Workbench');
      u.el('span', 'wb-bar-sp', bar);
      const disk = u.svg('svg', { viewBox: '0 0 26 26', 'aria-hidden': 'true' }, g0);
      u.svg('path', { d: 'M6 8H15V21H6Z', fill: '#fff', stroke: '#444', 'stroke-width': 1 }, disk);
      u.svg('path', { d: 'M11 5H19L22 8V19H11Z', fill: '#eee', stroke: '#444', 'stroke-width': 1 }, disk);
      u.svg('path', { d: 'M14 6H18V11H14ZM17 13H20V18H17Z', fill: '#aaa', stroke: '#666', 'stroke-width': 1 }, disk);
      u.el('span', 'wb-bar-clock', bar, 'Mo   Mon 27 May 1991  10:24');
      u.el('span', 'wb-gad back', bar);
      const content = u.el('div', 'content', shell);
      const info = u.el('section', 'wb-win w-info', content);
      win(u, info, 't1', 'Circle Center Task');
      const overview = u.el('div', 'wb-overview', info);
      const note = u.el('section', 'task-note', overview);
      note.hidden = _c.display !== 'header';
      if (_c.display === 'header') {
        const ic = u.el('div', 'wb-icon', note);
        const icon = u.svg('svg', { viewBox: '0 0 66 70', 'aria-hidden': 'true' }, ic);
        u.svg('path', { d: 'M4 3H49L63 16V66H4Z', fill: '#c2c2c2', stroke: '#000', 'stroke-width': 3 }, icon);
        u.svg('path', { d: 'M10 9H46L56 19V59H10ZM46 9V19H56', fill: '#fff', stroke: '#000', 'stroke-width': 3 }, icon);
        u.svg('text', { x: 23, y: 52, fill: '#002795', 'font-family': 'Georgia,serif', 'font-size': 48, 'font-weight': 'bold' }, icon).textContent = 'i';
      }
      const header = u.el('div', 'wb-text', note);
      const task = u.el('section', 'wb-win w-task', content);
      win(u, task, 't2', 'Task Area');
      const workspace = u.el('div', 'wb-workspace', task);
      // The stage precedes the controls, as in the original workstation.
      const stage = u.el('main', 'stage', workspace);
      stage.dataset.role = 'stage';
      const aside = u.el('aside', 'aside', workspace);
      const box = u.el('div', 'wb-box', aside);
      u.el('div', 'wb-box-title', box, 'Controls');
      const controls = u.el('div', 'wb-box-body', box);
      if (_c.display !== 'panel') u.el('p', '', controls, 'The canvas is ready for your input.');
      Object.assign(_c, { shell, overview, header, task, workspace, stage, aside, controls });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('instruction');
        _c.util.el('p', 'wb-sub', _c.header, 'Amiga Workbench provides a dedicated canvas in the area below.');
        _c.util.el('p', 'wb-sub', _c.header, 'Your workspace is ready.');
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.controls;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.workspace; },
    'frame.panel': (base) => (_c) => {
      base({ ..._c, body: _c.controls });
      const panel = _c.controls.querySelector('.ref-panel');
      if (panel) _c.controls.prepend(panel);
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      const clear = u.el('button', 'clear', _c.controls, 'Clear');
      clear.type = 'button';
      clear.onclick = () => { env.widgetDef.clear?.(); };
      const box = u.el('div', 'wb-box status', _c.aside);
      u.el('div', 'wb-box-title', box, 'Status');
      u.el('div', 'wb-box-body answer-status', box, 'No answer yet.');
      _c.bottom = u.el('div', 'wb-bottom-frame', _c.task);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.overview.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        if (_c.placement === 'link') foot.classList.add('wb-foot-link');
        _c.bottom.appendChild(foot);
      }
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.bottom.appendChild(dock);
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
    name: 'design-click-point-center-04',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: { THEMES: { site: palette }, LOW_THEME: palette, ACCENTS: ['#000'], LOW_ACCENTS: ['#000'], parts },
  });
})();
