(function () {
  'use strict';
  const palette = { bg: '#f6f4ec', panel: '#f8f6ef', fg: '#171810', muted: '#777365', line: '#c5b27b' };
  const markNote = (_c, note) => {
    if (!note) return;
    note.classList.add('instruction');
    note.dataset.display = _c.display;
  };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original task column fits all four displays at every viewport.
      _c.display = _c.ctx.display || 'header';
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('ref', 'luxury', 'response');
      document.body.classList.toggle('luxury-no-note', _c.display === 'hidden');
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      u.el('div', 'title', head, 'Willow & Finch');
      u.el('div', 'tools', head, 'Preferences');
      const work = u.el('div', 'work', shell);
      const center = u.el('section', 'center', work);
      const appearance = u.el('section', 'appearance-heading', center);
      u.el('h2', '', appearance, 'Audio Settings');
      u.el('p', '', appearance, 'Adjust the volume level for playback');
      const toolbar = u.el('div', 'luxury-toolbar', work);
      Object.assign(_c, { shell, work, center, toolbar, header: work });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      markNote(_c, _c.header.querySelector('.ref-instruction'));
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
      markNote(_c, _c.body.querySelector('.ref-panel'));
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        markNote(_c, note);
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
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.work.appendChild(dock);
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
    name: 'design-handle-text-spinner-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-handle-text-spinner-02': palette },
      LOW_THEME: palette,
      ACCENTS: ['#4a4d32'],
      LOW_ACCENTS: ['#4a4d32'],
      parts,
    },
  });
})();
