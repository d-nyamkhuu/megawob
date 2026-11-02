(function () {
  'use strict';
  const palette = { bg: '#ffffff', panel: '#f3f6fa', fg: '#101d30', muted: '#4a5568', line: '#8a96a8' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The civic sidebar has room for every note mode, even at the smallest viewport.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('ref', 'civic');
      const shell = u.el('main', 'cv-shell', document.body);
      const head = u.el('header', 'cv-head', shell);
      u.el('div', 'cv-name', head, 'Riverton City Council');
      u.el('div', 'cv-tag', head, 'A stronger community together');
      const toolbar = u.el('div', 'cv-head-tools', head);
      const aside = u.el('aside', 'cv-aside');
      Object.assign(_c, { shell, toolbar, aside, header: aside });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('cv-instr');
        note.dataset.display = _c.display;
        note.dataset.long = String(_c.ctx.instruction.length > 35);
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'cv-work', _c.shell);
      const main = u.el('section', 'cv-main', body);
      u.el('h1', 'cv-h1', main, 'Contact Us');
      u.el('p', 'cv-lead', main, 'We’d like to hear from you. Please fill out the form below.');
      body.appendChild(_c.aside);
      Object.assign(_c, { body, main });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.aside;
      base(_c);
      _c.body = body;
      const note = _c.aside.querySelector('.ref-panel');
      if (note) note.dataset.long = String(_c.ctx.instruction.length > 35);
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage cv-stage', _c.main);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.dataset.long = String(_c.ctx.instruction.length > 35);
        _c.aside.appendChild(note);
      }
      _c.util.el('p', 'cv-help', _c.aside, 'Your form is ready for review.');
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.aside.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.aside.insertBefore(dock, _c.aside.querySelector('.cv-help'));
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
    name: 'design-click-control-button-08',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'civic.css', 'site.css'],
    design: {
      THEMES: { 'design-click-control-button-08': palette },
      LOW_THEME: palette,
      ACCENTS: ['#17375e'],
      LOW_ACCENTS: ['#17375e'],
      parts,
    },
  });
})();
