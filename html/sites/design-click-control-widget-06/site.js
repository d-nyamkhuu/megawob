(function () {
  'use strict';
  const cfg = {
    title: 'Widget Playground',
    sub: 'Explore the different form controls below.',
    obstacle: 'Welcome!',
    copy: 'This short tour will show you around the interface.',
    dismiss: 'Skip tour',
  };
  const palette = { bg: '#11161b', panel: '#1a2027', fg: '#e8ecf2', muted: '#9aa3b0', line: '#252c37' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original has a dedicated note pane at every viewport.
      _c.display = _c.ctx.display || 'header';
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('ref', 'devdark');
      const shell = u.el('main', 'shell', document.body);
      const main = u.el('div', 'dv-main', shell);
      const head = u.el('header', 'dv-head', main);
      const logo = u.el('span', 'dv-logo', head);
      logo.innerHTML =
        '<svg viewBox="0 0 40 24" width="40" height="24"><path d="M3 3l9 8-9 8" fill="none" stroke="#7ee02b" stroke-width="3"/><path d="M22 20h14" stroke="#7ee02b" stroke-width="3"/></svg>';
      const ht = u.el('div', 'dv-ht', head);
      u.el('div', 'dv-title', ht, cfg.title);
      u.el('div', 'dv-sub', ht, cfg.sub);
      const aside = u.el('aside', 'dv-side', shell);
      if (_c.display !== 'hidden') u.el('div', 'dv-tasklabel', aside, 'TASK');
      const notes = u.el('div', 'dv-notes', aside);
      Object.assign(_c, { shell, main, head, aside, header: notes });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('dv-header-note');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.head;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.main;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
      const note = _c.header.querySelector('.ref-panel-text');
      if (note) {
        note.classList.add('instruction');
        note.dataset.display = 'panel';
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.main);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('dv-toast');
        _c.header.appendChild(note);
      }
      _c.util.el('p', 'dv-hint', _c.aside, 'Use the interface on the left to complete the task.');
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        foot.classList.add('dv-foot');
        _c.main.appendChild(foot);
        foot.querySelector('.ref-foot-text').textContent = 'Workspace · all changes saved';
      }
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.aside.appendChild(dock);
    },
    overlay: () => (ctx) => {
      if (ctx.kind === 'chat') {
        const old = document.querySelector('.design-obstacle');
        if (old) old.hidden = true;
        const el = ctx.util.el('section', 'perturb chat tour-overlay', document.body);
        ctx.util.el('h2', '', el, cfg.obstacle);
        ctx.util.el('p', '', el, cfg.copy);
        const dismiss = ctx.util.el('button', 'dismiss-design', el, cfg.dismiss);
        dismiss.type = 'button';
        dismiss.addEventListener('click', ctx.dismiss);
        return { el, dismiss };
      }
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
    name: 'design-click-control-widget-06',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-click-control-widget-06': palette },
      LOW_THEME: palette,
      ACCENTS: ['#85e83e'],
      LOW_ACCENTS: ['#85e83e'],
      parts,
    },
  });
})();
