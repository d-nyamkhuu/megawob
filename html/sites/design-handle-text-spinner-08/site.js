(function () {
  'use strict';
  const palette = { bg: '#ffffff', panel: '#ffffff', fg: '#050505', muted: '#111111', line: '#111111' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
      document.body.classList.remove('ref-has-note');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('ref', 'mac', 'board');
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      u.el('div', 'title', head, 'Sound Settings');
      u.el('div', 'tools', head, 'File     Edit     Options     Windows     Help');
      const toolbar = u.el('div', 'end-toolbar', head);
      const work = u.el('div', 'work', shell);
      const center = u.el('section', 'center', work);
      center.dataset.display = _c.display;
      u.el('section', 'appearance-heading', center);
      Object.assign(_c, { shell, head, toolbar, work, center, header: center });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('instruction');
        note.dataset.display = _c.display;
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.work; },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('task-panel');
        const title = panel.querySelector('.ref-panel-title');
        title.classList.add('panel-title');
        title.textContent = 'Instructions';
        panel.querySelector('.ref-panel-text').classList.add('instruction');
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('instruction', 'instruction-toast');
        _c.center.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      const u = _c.util;
      const footer = u.el('footer', 'footer', _c.shell);
      const actions = u.el('div', 'form-actions', footer);
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('status-line');
      footer.appendChild(foot);
      const ready = foot.querySelector('.ref-foot-text');
      ready.classList.add('ready');
      ready.textContent = 'Ready.';
      for (const button of foot.querySelectorAll('.ref-xtra')) actions.appendChild(button);
      _c.actions = actions;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.actions.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u=ctx.util,el=u.el('section','perturb '+ctx.kind,document.body);
      u.el('strong','',el,{cookie:'Cookie preferences',toast:'Notification',chat:'Support',promo:'A special offer',banner:'Service notice'}[ctx.kind]);
      u.el('p','',el,{cookie:'Choose your preferences to continue.',toast:'Your workspace is ready.',chat:'How can we help?',promo:'Explore the latest tools.',banner:'A new update is available.'}[ctx.kind]);
      const dismiss=u.el('button','dismiss',el,ctx.kind==='cookie'?'Accept':'Close');
      dismiss.type='button';dismiss.addEventListener('click',ctx.dismiss);
      return{el,dismiss};
    },
  };
  env.site({
    name: 'design-handle-text-spinner-08',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-handle-text-spinner-08': palette }, LOW_THEME: palette,
      ACCENTS: ['#000000'], LOW_ACCENTS: ['#000000'], parts,
    },
  });
})();
