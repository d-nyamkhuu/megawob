(function () {
  'use strict';
  const C = {
    title: 'Rivers and Canals of the World',
    nav: ['Home', 'Articles', 'Geography', 'Library', 'Help'],
    heading: 'Waterways in History',
  };
  const palette = { bg: '#fff', panel: '#fff', fg: '#000', muted: '#555', line: '#888', font: '"Times New Roman",Times,serif' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.className = 'design acad' + (_c.display === 'toast' ? ' has-instruction-toast' : '');
      const shell = u.el('div', 'shell', document.body);
      const doc = u.el('div', 'doc', shell);
      const h1 = u.el('h1', 'doc-title', doc);
      const title = u.el('a', '', h1, C.title);
      title.href = '#';
      title.onclick = e => e.preventDefault();
      u.el('hr', 'doc-rule', doc);
      const aside = u.el('aside', 'side', shell);
      u.el('h3', 'side-h', aside, 'Document Tools');
      const toolbar = u.el('div', 'top-command', aside);
      Object.assign(_c, { shell, doc, aside, toolbar, header: doc });
    },
    'frame.nav': () => (_c) => {
      const u = _c.util;
      const nav = u.el('nav', 'doc-nav', _c.doc);
      C.nav.forEach((t, i) => {
        if (i) u.el('span', 'sep', nav, '|');
        const a = u.el('a', '', nav, t);
        a.href = '#';
        a.onclick = e => e.preventDefault();
      });
    },
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        const wrapper = _c.util.el('section', 'task-note instruction-header');
        note.before(wrapper);
        wrapper.appendChild(note);
        note.classList.add('instruction');
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const box = u.el('div', 'tools-box', _c.aside);
      const ico = u.svg('svg', { width: 40, height: 50, viewBox: '0 0 42 50', fill: 'none', stroke: '#000', 'stroke-width': 2, class: 'tools-ico' }, box);
      u.svg('path', { d: 'M5 3H33L41 12V49H5Z', fill: '#cdd3d8', stroke: 'none' }, ico);
      u.svg('path', { d: 'M1 1H31V11H40V49H1Z M31 1H33V3H35V5H37V7H39V9H40V11 M8 14H22M8 20H34M8 27H34M8 33H34M8 39H34', fill: '#f9fafb' }, ico);
      const msg = u.el('p', 'tools-msg', box, 'Tools are hidden to');
      u.el('br', '', msg);
      msg.append(document.createTextNode('keep the workspace clear.'));
      const exp = u.el('button', 'btn expand', box, 'Expand tools');
      exp.type = 'button';
      const tools = u.el('div', 'tools-open', box);
      tools.hidden = true;
      const clr = u.el('button', 'btn', tools, 'Clear');
      clr.type = 'button';
      clr.onclick = () => { env.widgetDef.clear?.(); };
      exp.onclick = () => { tools.hidden = false; exp.hidden = true; msg.textContent = 'Tools are available.'; };
      u.el('hr', 'side-rule', _c.aside);
      u.el('h3', 'side-h', _c.aside, 'Your Task');
      _c.body = _c.doc;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.aside;
      base(_c);
      _c.body = body;
      const note = _c.aside.querySelector('.ref-panel');
      if (note) {
        note.classList.add('task-note');
        note.querySelector('.ref-panel-text').classList.add('instruction');
      }
    },
    'frame.stage': () => (_c) => {
      _c.articleHeading = _c.util.el('h2', 'doc-head', _c.doc, C.heading);
      _c.stage = _c.util.el('main', 'stage', _c.doc);
      _c.stage.dataset.role = 'stage';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('task-note', 'instruction-toast');
        note.querySelector('.ref-note-text').classList.add('instruction');
        note.querySelector('.ref-note-x').classList.add('note-close');
        _c.doc.insertBefore(note, _c.articleHeading);
      }
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
    },
    overlay: () => (ctx) => {
      const u=ctx.util,kind=ctx.kind;const el=u.el('section','obstruction obstruction-'+kind,document.body);el.dataset.role='overlay';const box=u.el('div','obstruction-box',el);
      const title={cookie:'Your privacy',toast:'Changes saved',chat:'Support',promo:'Workspace update',banner:'Service notice'}[kind];
      const text={cookie:'This application stores optional cookies.',toast:'Your changes have been saved.',chat:'Need a hand with this workspace?',promo:'Explore the latest workspace features.',banner:'You are viewing a shared workspace.'}[kind];
      u.el('h3','',box,title);u.el('p','',box,text);
      const dismiss=u.el('button','dismiss',box,kind==='cookie'?'Reject optional':'Close');dismiss.type='button';dismiss.onclick=()=>ctx.dismiss('close');
      if(kind==='cookie'){const a=u.el('button','dismiss',box,'Accept optional');a.type='button';a.onclick=()=>ctx.dismiss('accept');}
      return{el,dismiss,ttlSteps:kind==='toast'?5:0};
    },
  };
  env.site({
    name: 'design-select-text-paragraph-12',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css', 'acad.css'],
    design: {
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: ['#000080'], LOW_ACCENTS: ['#000080'], parts,
    },
  });
})();
