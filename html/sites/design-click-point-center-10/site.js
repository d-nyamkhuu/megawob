(function () {
  'use strict';
  const C = { title: 'Geometry Trainer', level: 'Level 1', accent: '#1a4a98', font: "'Roboto', 'Arial', Helvetica, sans-serif" };
  const palette = { bg: '#ffffff', panel: '#ffffff', fg: '#0b1f4d', muted: '#4a6bb0', line: '#c9d3e6' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // Each original display has its own compact note, including at small sizes.
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
      document.body.className = 'design flash layout-flash' + (_c.display === 'toast' ? ' has-instruction-toast' : '');
      document.documentElement.style.setProperty('--font', C.font);
      const shell = u.el('div', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      u.el('div', 'title', head, C.title);
      u.el('div', 'level', head, C.level);
      const content = u.el('div', 'content', shell);
      const header = _c.display === 'header' ? u.el('section', 'task-note', content) : content;
      Object.assign(_c, { shell, head, content, header });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const instruction = _c.header.querySelector('.ref-instruction');
      if (instruction) {
        instruction.classList.add('instruction');
        let fontSize = parseFloat(getComputedStyle(instruction).fontSize);
        while (fontSize > 12 && instruction.scrollHeight > _c.header.clientHeight - 4) {
          instruction.style.fontSize = --fontSize + 'px';
        }
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.content;
      base(_c);
      _c.header = header;
      _c.headerTools.classList.add('flash-toptools');
    },
    'frame.body': () => (_c) => { _c.body = _c.content; },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.content.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('task-note', 'instruction-panel');
        panel.querySelector('.ref-panel-text').classList.add('instruction');
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.content);
      _c.stage.dataset.role = 'stage';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('task-note', 'instruction-toast');
        note.querySelector('.ref-note-text').classList.add('instruction');
        note.querySelector('.ref-note-x').classList.add('note-close');
        _c.content.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('footer');
      _c.shell.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.shell.appendChild(dock);
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
    name: 'design-click-point-center-10',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: { THEMES: { 'design-click-point-center-10': palette }, LOW_THEME: palette, ACCENTS: [C.accent], LOW_ACCENTS: [C.accent], parts },
  });
})();
