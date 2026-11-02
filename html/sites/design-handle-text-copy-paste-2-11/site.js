(function () {
  'use strict';
  const palette = { bg: '#f0f2f4', panel: '#fff', fg: '#101827', muted: '#5d6f85', line: '#dce2e8' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('ref', 'postdoc', 'response');
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const title = u.el('div', 'title', head);
      u.el('span', 'title-text', title, 'Project Notes');
      const work = u.el('div', 'work', shell);
      const center = u.el('section', 'center', work);
      const toolbar = u.el('div', 'answer-toolbar', work);
      Object.assign(_c, { shell, work, center, toolbar, header: work });
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
      if (_c.submit) _c.submit.classList.add('submit');
    },
    'frame.body': () => (_c) => {
      _c.body = _c.work;
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.work.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('instruction');
        panel.dataset.display = _c.display;
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
        note.dataset.display = _c.display;
        _c.work.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.shell.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
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
          promo: 'A new version is available',
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
          promo: 'Version 2.4.1 includes security updates and performance improvements.',
          banner: 'A new update is available.',
        }[ctx.kind],
      );
      const dismiss = ctx.util.el(
        'button',
        'dismiss',
        el,
        ctx.kind === 'cookie' ? 'Accept' : ctx.kind === 'promo' ? 'Remind me later' : 'Close',
      );
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      if (ctx.kind === 'promo') {
        const details = ctx.util.el('button', 'details', el, 'View details');
        details.type = 'button';
        details.addEventListener('click', ctx.dismiss);
      }
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-handle-text-copy-paste-2-11',
    template: 'site/base',
    langs: ['en'],
    initialOverlay: { kind: 'promo' },
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { postdoc: palette }, LOW_THEME: palette,
      ACCENTS: ['#f45b12'], LOW_ACCENTS: ['#f45b12'], parts,
    },
  });
})();
