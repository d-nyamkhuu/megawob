(function () {
  'use strict';
  const palette = { bg: '#f7fbfe', panel: '#fff', fg: '#14213d', muted: '#4c5a6e', line: '#c3ccd8' };
  const parts = {
    'frame.theme': (base) => (_c) => {
      base(_c);
      _c.root.style.setProperty('--navy', '#17395f');
      _c.root.style.setProperty('--font', "Arial,'Segoe UI',sans-serif");
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.className = 'design cvr layout-civicref';
      const shell = u.el('div', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const brand = u.el('div', 'brand', head);
      u.el('div', 'title', brand, 'Civic Library');
      u.el('div', 'subtitle', brand, 'Local history for a stronger community');
      const links = u.el('nav', 'toplinks', head);
      for (const t of ['Help', 'Sign out']) {
        const a = u.el('button', 'toplink', links, t);
        a.type = 'button';
        a.onclick = () => env.log('nav', { label: t });
      }
      const content = u.el('div', 'content', shell);
      const note = u.el('section', 'task-note', content);
      note.hidden = _c.display !== 'header';
      if (!note.hidden) u.el('div', 'note-label', note, 'Reading task');
      const aside = u.el('aside', 'aside', content);
      Object.assign(_c, { shell, links, content, aside, header: note });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      if (_c.display === 'header') {
        _c.header.querySelector('.ref-instruction').classList.add('instruction');
        _c.util.el('p', 'note-hint', _c.header, 'Read the text below. Click and drag to highlight the correct paragraph.');
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.links;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.content; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.aside;
      base(_c);
      _c.body = body;
      const title = _c.aside.querySelector('.ref-panel-title');
      if (title) title.textContent = 'Task instructions';
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      const stage = u.el('main', 'stage', _c.content);
      stage.dataset.role = 'stage';
      _c.content.insertBefore(stage, _c.aside);
      _c.stage = stage;
      const aside = _c.aside;
      const prog = u.el('div', 'prog', aside);
      const ph = u.el('div', 'prog-head', prog);
      u.el('h3', '', ph, 'Your progress');
      u.el('span', '', ph, 'Step 1 of 1');
      const pr = u.el('div', 'prog-row', prog);
      u.el('span', 'ring', pr);
      u.el('span', 'selection-status', pr, 'No paragraph selected yet.');
      u.el('h3', 'how', aside, 'How to highlight');
      const ol = u.el('ol', 'howlist', aside);
      for (const t of ['Click at the start of the paragraph.', 'Drag to the end of the paragraph.', 'Release to select.']) u.el('li', '', ol, t);
      const footer = u.el('footer', 'footer', aside);
      u.el('div', 'footer-copy', footer, '');
      const clear = u.el('button', 'clear-selection', footer, 'Clear selection');
      clear.type = 'button';
      clear.hidden = true;
      clear.onclick = () => env.widgetDef.clear?.();
      _c.footer = footer;
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        _c.util.el('div', 'task-panel-title', note, 'Reading task');
        note.prepend(note.lastChild);
        _c.aside.prepend(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.footer.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.footer.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u=ctx.util,kind=ctx.kind;const el=u.el('section','obstruction obstruction-'+kind,document.body);el.dataset.role='overlay';const box=u.el('div','obstruction-box',el);
      const title={cookie:'Your privacy',toast:'Changes saved',chat:'Support',promo:'Library update',banner:'Service notice'}[kind];
      const text={cookie:'This site stores optional cookies.',toast:'Your changes have been saved.',chat:'Need a hand with this page?',promo:'Explore the latest library services.',banner:'You are viewing a shared page.'}[kind];
      const label=kind==='cookie'?'Reject optional':'Close';
      u.el('h3','',box,title);u.el('p','',box,text);const dismiss=u.el('button','dismiss',box,label);dismiss.type='button';dismiss.onclick=()=>ctx.dismiss('close');
      if(kind==='cookie'){const accept=u.el('button','dismiss',box,'Accept optional');accept.onclick=()=>ctx.dismiss('accept');}
      return{el,dismiss,ttlSteps:kind==='toast'?5:0};
    },
  };
  env.site({
    name: 'design-select-text-paragraph-04',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css', 'civic.css'],
    design: {
      THEMES: { 'design-select-text-paragraph-04': palette },
      LOW_THEME: palette,
      ACCENTS: ['#185dbc'],
      LOW_ACCENTS: ['#185dbc'],
      parts,
    },
  });
})();
