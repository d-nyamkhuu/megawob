(function () {
  'use strict';
  const palette = { bg: '#eff2f8', panel: '#f7f9fd', fg: '#1b293c', muted: '#718097', line: '#e1e7f0' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The dedicated task pane has room for every note display at every viewport.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.className = 'ref neu';
      const shell = u.el('main', 'shell', document.body);
      const work = u.el('div', 'work', shell);
      const center = u.el('section', 'center', work);
      u.el('h1', 'nm-title', center, 'Project Details');
      u.el('p', 'nm-sub', center, 'Review the sections below. Click a section to expand and view its contents.');
      const aside = u.el('aside', 'inspector', work);
      u.el('h2', 'nm-task', aside, 'Task');
      const noteArea = u.el('div', 'nm-note-area', aside);
      const toolbar = u.el('div', 'nm-controls', aside);
      Object.assign(_c, { shell, work, center, aside, noteArea, toolbar, header: noteArea });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.noteArea.querySelector('.ref-instruction');
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
      const body = _c.body;
      _c.body = _c.noteArea;
      base(_c);
      _c.body = body;
      const note = _c.noteArea.querySelector('.ref-panel-text');
      if (note) {
        note.classList.add('instruction');
        note.dataset.display = _c.display;
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        const text = note.querySelector('.ref-note-text');
        text.classList.add('instruction', 'instruction-toast');
        _c.noteArea.appendChild(note);
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
      const el = ctx.util.el('section', 'perturb ' + ctx.kind, document.body);
      ctx.util.el(
        'strong',
        '',
        el,
        {
          cookie: 'Cookie preferences',
          toast: 'Notification',
          chat: 'Support',
          promo: 'A special offer',
          banner: 'Service notice',
        }[ctx.kind],
      );
      ctx.util.el(
        'p',
        '',
        el,
        {
          cookie: 'Choose your preferences to continue.',
          toast: 'Your workspace is ready.',
          chat: 'How can we help?',
          promo: 'Explore the latest tools.',
          banner: 'A new update is available.',
        }[ctx.kind],
      );
      const dismiss = ctx.util.el('button', 'dismiss', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-click-control-collapsible-09',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#1245bb'],
      LOW_ACCENTS: ['#1245bb'],
      parts,
    },
  });
})();
