(function () {
  'use strict';
  const palette = { bg: '#faf8ee', panel: '#faf8ee', fg: '#2a1418', muted: '#5c3a3f', line: '#b9b09c' };
  const parts = {
    'frame.theme': (base) => (_c) => {
      base(_c);
      _c.root.style.setProperty('--font', '"Times New Roman",Times,serif');
    },
    'frame.layout': (base) => (_c) => {
      base(_c);
      document.body.className = 'design lib' + (_c.display === 'toast' ? ' has-instruction-toast' : '');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const shell = u.el('div', 'shell', document.body), head = u.el('header', 'head', shell);
      const logo = u.svg('svg', { class: 'logo', width: 92, height: 50, viewBox: '0 0 92 50' }, head);
      u.svg('path', { d: 'M2 5H43L46 9L49 5H90V48H50L46 46L42 48H2Z', fill: '#cabd90', stroke: '#281915', 'stroke-width': 2 }, logo);
      u.svg('path', { d: 'M8 1Q28 -2 43 5V44Q28 37 8 42Z', fill: '#faf4d9', stroke: '#51442d', 'stroke-width': 1.6 }, logo);
      u.svg('path', { d: 'M84 1Q64 -2 49 5V44Q64 37 84 42Z', fill: '#faf4d9', stroke: '#51442d', 'stroke-width': 1.6 }, logo);
      u.svg('path', { d: 'M46 5V44', fill: 'none', stroke: '#392218', 'stroke-width': 2 }, logo);
      u.el('div', 'title', head, 'Riverton Public Library');
      const nav = u.el('nav', 'menu', head);
      for (const t of ['Catalog', 'Research', 'Services', 'About']) u.el('span', '', nav, t);
      const content = u.el('div', 'content', shell), left = u.el('section', 'left', content), aside = u.el('aside', 'aside', content);
      u.el('h1', '', left, 'Geometry Collection');
      u.el('hr', '', left);
      u.el('h2', '', left, 'Interactive Figure');
      u.el('h1', 'side-h', aside, 'Your Task');
      const noteSlot = u.el('div', 'note-slot', aside);
      u.el('hr', '', aside);
      u.el('h3', '', aside, 'Tools');
      const pt = u.el('button', 'tool', aside); pt.type = 'button';
      const ic = u.svg('svg', { width: 24, height: 28, viewBox: '0 0 24 28', fill: '#fff', stroke: '#222', 'stroke-width': 1.5 }, pt);
      u.svg('path', { d: 'M4 2V22L9 17L13 26L17 24L13 16H20Z' }, ic);
      u.el('span', '', pt, 'Pointer');
      u.el('hr', '', aside);
      u.el('h3', '', aside, 'Actions');
      const actions = u.el('div', 'actions', aside);
      const clear = u.el('button', 'clear', actions, 'Clear'); clear.type = 'button';
      clear.onclick = () => { env.widgetDef.clear?.(); };
      const status = u.el('div', 'status', aside);
      Object.assign(_c, { shell, content, left, aside, noteSlot, actions, status, header: actions });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const h = _c.header;
      _c.header = _c.left;
      base(_c);
      _c.header = h;
    },
    'frame.tools': (base) => (_c) => { base(_c); },
    'frame.body': () => (_c) => { _c.body = _c.content; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.noteSlot;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      _c.stage = u.el('main', 'stage', _c.left);
      _c.stage.dataset.role = 'stage';
      const meta = u.el('dl', 'meta', _c.left);
      for (const [k, v] of [['Title:', 'Angle Bisector (Interactive Figure)'], ['Subject:', 'Geometry — Angles'], ['Notes:', 'Click a point in the diagram to indicate your answer.']]) {
        const r = u.el('div', '', meta); u.el('dt', '', r, k); u.el('dd', '', r, v);
      }
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.noteSlot.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.status.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.status.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u=ctx.util,kind=ctx.kind;const el=u.el('section','obstruction obstruction-'+kind,document.body);el.dataset.role='overlay';const box=u.el('div','obstruction-box',el);
      const title={cookie:'Your privacy',toast:'Changes saved',chat:'Support',promo:'Library notice',banner:'Service notice'}[kind];
      const text={cookie:'This catalog stores optional cookies.',toast:'Your changes have been saved.',chat:'Need a hand with this figure?',promo:'Explore the latest additions to the collection.',banner:'You are viewing a shared catalog record.'}[kind];
      const label=kind==='cookie'?'Reject optional':'Close';
      u.el('h3','',box,title);u.el('p','',box,text);const dismiss=u.el('button','dismiss',box,label);dismiss.type='button';dismiss.onclick=()=>ctx.dismiss('close');
      if(kind==='cookie'){const accept=u.el('button','dismiss',box,'Accept optional');accept.onclick=()=>ctx.dismiss('accept');}
      return{el,dismiss,ttlSteps:kind==='toast'?5:0};
    },
  };
  env.site({
    name: 'design-click-point-bisect-08', template: 'site/base', langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: { THEMES: { 'design-click-point-bisect-08': palette }, LOW_THEME: palette,
      ACCENTS: ['#5c1a24'], LOW_ACCENTS: ['#5c1a24'], parts },
  });
})();
