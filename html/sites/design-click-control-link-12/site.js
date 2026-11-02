(function () {
  'use strict';
  const palette = { bg: '#faf8f3', panel: '#faf8f3', fg: '#1b1e15', muted: '#4a4a42', line: '#c9b98a' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('ref', 'journal');
      const shell = u.el('main', 'shell', document.body);
      const doc = u.el('div', 'doc', shell);
      const mast = u.el('header', 'mast', doc);
      u.el('div', 'brand', mast, 'Rivermere Journal');
      const nav = u.el('nav', 'mnav', mast);
      ['Ideas', 'Places', 'People', 'Culture'].forEach(n => u.el('span', '', nav, n));
      const search = u.el('span', 'msearch', mast);
      search.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="7.5"/><path d="m16 16 5.5 5.5"/></svg>';
      const aside = u.el('aside', 'margin', shell);
      aside.classList.toggle('toast-mode', _c.display === 'toast');
      const header = u.el('section', 'task-note', aside);
      if (_c.display === 'header') u.el('div', 'kicker', header, 'Your task');
      const toolbar = u.el('div', 'journal-toolbar', aside);
      Object.assign(_c, { shell, doc, mast, aside, header, toolbar });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.dataset.display = _c.display;
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.doc; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
      if (_c.display !== 'hidden') _c.util.el('hr', 'rule', _c.aside);
      _c.util.el('div', 'kicker k2', _c.aside, 'Notes');
      const notes = _c.util.el('ul', 'notes', _c.aside);
      [
        'A journal of ideas, people and places.',
        'Explore the references within each article.',
        'Read at your own pace.'
      ].forEach(t => _c.util.el('li', '', notes, t));
    },
    'frame.stage': () => (_c) => { _c.stage = _c.util.el('div', 'stage', _c.doc); },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.header.appendChild(note);
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
      const el=ctx.util.el('section','perturb '+ctx.kind,document.body);
      const x=ctx.util.el('button','dismiss x',el);x.type='button';x.setAttribute('aria-label','Close');
      x.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="m4 4 16 16M20 4 4 20"/></svg>';
      x.addEventListener('click',ctx.dismiss);
      const ic=ctx.util.el('div','warn',el);
      ic.innerHTML='<svg viewBox="0 0 64 56" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"><path d="M32 4 61 52H3Z"/><path d="M32 22v17M32 44v2"/></svg>';
      ctx.util.el('h2','',el,'Layout could not be restored');
      ctx.util.el('p','',el,'Your previous layout could not be restored, possibly due to a browser or system update.');
      ctx.util.el('p','',el,'You can use the default layout to continue working. Your task data will be preserved.');
      const dismiss=ctx.util.el('button','dismiss use',el,'Use default layout');dismiss.type='button';
      dismiss.addEventListener('click',ctx.dismiss);
      return{el,dismiss};
    }
  };
  env.site({
    name: 'design-click-control-link-12',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    initialOverlay: { kind: 'banner' },
    design: {
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: ['#3d3d36'], LOW_ACCENTS: ['#3d3d36'], parts
    }
  });
})();
