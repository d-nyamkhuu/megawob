(function () {
  'use strict';
  const palette = { bg: '#faf9f5', panel: '#faf9f5', fg: '#171815', muted: '#5c5b46', line: '#b6ab8e' };
  function styleControls(parent) {
    parent.querySelectorAll('.ref-submit').forEach((b) => {
      b.classList.add('lx-submit');
      if (b.classList.contains('ref-icon')) b.classList.add('lx-icon');
    });
    parent.querySelectorAll('.ref-xtra').forEach((b) => b.classList.add('lx-xtra'));
    parent.querySelectorAll('.ref-endlink').forEach((b) => b.classList.add('lx-endlink'));
  }
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      let display = _c.ctx.display || 'header';
      if ((display === 'panel' && document.body.clientWidth < 1100) ||
          (display === 'toast' && document.body.clientHeight < 680)) display = 'header';
      _c.display = display;
      document.body.classList.toggle('ref-has-note', display === 'toast');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('ref', 'lux');
      const index = u.el('nav', 'lx-index', document.body);
      for (let i = 1; i <= 10; i++) u.el('div', i === 1 ? 'on' : '', index, String(i));
      const shell = u.el('main', 'lx-shell', document.body);
      const head = u.el('header', 'lx-head', shell);
      const brand = u.el('div', 'lx-brand', head);
      u.el('span', 'lx-name', brand, 'Atelier');
      u.el('span', 'lx-sub', brand, 'Focused Work');
      const nav = u.el('div', 'lx-nav', head);
      ['Docs', 'Tools', 'Help'].forEach((t) => u.el('span', '', nav, t));
      u.el('span', 'lx-avatar', nav, 'JD');
      const sheet = u.el('section', 'lx-sheet', shell);
      u.el('div', 'lx-label', sheet, 'Task');
      Object.assign(_c, { shell, head, sheet, header: sheet });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.sheet.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('lx-instruction');
        note.dataset.display = _c.display;
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.head;
      base(_c);
      _c.header = header;
      _c.headerTools.classList.add('lx-tools');
      styleControls(_c.headerTools);
    },
    'frame.body': () => (_c) => { _c.body = _c.sheet; },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const note = _c.sheet.querySelector('.ref-panel');
      if (note) {
        note.classList.add('lx-instruction');
        note.dataset.display = 'panel';
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage lx-stage', _c.sheet);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('lx-instruction', 'instruction-toast');
        note.dataset.display = 'toast';
        _c.sheet.insertBefore(note, _c.stage);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('lx-foot');
      _c.shell.appendChild(foot);
      styleControls(foot);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) {
        _c.foot.appendChild(dock);
        styleControls(dock);
      }
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
    name: 'design-click-control-pie-07',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: { THEMES: { 'design-click-control-pie-07': palette }, LOW_THEME: palette,
      ACCENTS: ['#4a4a22'], LOW_ACCENTS: ['#4a4a22'], parts },
  });
})();
