(function () {
  'use strict';
  const palette = { bg: '#c5c5c5', panel: '#ededed', fg: '#111111', muted: '#333333', line: '#777777' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original canvas has room reserved for each note mode at every size.
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
      document.body.classList.add('ref', 'risc', 'utility-header-open-canvas');
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const bar = u.el('div', 'risc-iconbar', head);
      u.el('span', 'raspberry', bar, '●');
      u.el('strong', 'os-name', bar, 'RISC OS');
      [
        ['▰', 'Files'],
        ['▤', 'Edit'],
        ['✎', 'Draw'],
        ['▦', 'Calc'],
        ['▤', 'Info'],
        ['⚙', 'Prefs'],
      ].forEach(([icon, label]) => {
        const item = u.el('div', 'icon-item', bar);
        u.el('span', 'icon-glyph', item, icon);
        u.el('span', '', item, label);
      });
      u.el('span', 'clock', bar, 'Mon 3 Apr 1989　10:24');
      const close = u.el('button', 'close-gadget', bar, '×');
      close.type = 'button';
      close.addEventListener('click', () => env.log('decoy', { label: 'Close' }));
      const toolbar = u.el('div', 'utility-title', shell, 'Text Copy Task');
      const work = u.el('div', 'work', shell);
      const center = u.el('section', 'center', work);
      Object.assign(_c, { shell, toolbar, work, center, header: center });
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
    'frame.body': () => (_c) => { _c.body = _c.center; },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const note = _c.center.querySelector('.ref-panel');
      if (note) {
        note.classList.add('instruction');
        note.dataset.display = _c.display;
      }
    },
    'frame.stage': () => (_c) => { _c.stage = _c.util.el('div', 'stage', _c.center); },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('instruction', 'instruction-toast');
        note.dataset.display = _c.display;
        _c.center.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        _c.work.appendChild(foot);
        foot.querySelector('.ref-foot-text').textContent = '';
        foot.classList.toggle('risc-float-space', _c.placement === 'floating');
      }
    },
    'frame.floating': (base) => (_c) => { base(_c); },
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
    name: 'design-handle-text-copy-paste-2-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-handle-text-copy-paste-2-02': palette },
      LOW_THEME: palette,
      ACCENTS: ['#777777'],
      LOW_ACCENTS: ['#777777'],
      parts,
    },
  });
})();
