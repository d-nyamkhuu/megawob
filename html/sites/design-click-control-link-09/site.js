(function () {
  'use strict';
  const cfg = { title: 'Project Notebook', nav: ['Workspace', 'Help', 'Settings'], corp: 'ACME CORP', rows: 15, active: 3 };
  const palette = { bg: '#f5f9f8', panel: '#f5f9f8', fg: '#172d39', muted: '#445566', line: '#b7ceca' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // This notebook has space for its compact note in each display mode.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('ref', 'nb');
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      u.el('div', 'corner', head);
      u.el('div', 'title', head, cfg.title);
      const nav = u.el('nav', 'topnav', head);
      cfg.nav.forEach((s, i) => {
        if (i) u.el('i', '', nav, '|');
        u.el('span', '', nav, s);
      });
      u.el('div', 'corp', head, cfg.corp);
      const work = u.el('div', 'work', shell);
      const rail = u.el('nav', 'rail', work);
      for (let i = 1; i <= cfg.rows; i++) u.el('div', i === cfg.active ? 'active' : '', rail, String(i));
      const center = u.el('section', 'center', work);
      Object.assign(_c, { shell, head, center, header: center });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note && _c.ctx.instruction.length > 64) note.classList.add('instruction-long');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.head;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.center;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.center.insertBefore(note, _c.stage);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('footer');
      _c.center.appendChild(foot);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const el = ctx.util.el('section', 'perturb ' + ctx.kind, document.body);
      ctx.util.el('strong', '', el, { cookie: 'Cookie preferences', toast: 'Notification', chat: 'Support', promo: 'A special offer', banner: 'Service notice' }[ctx.kind]);
      ctx.util.el('p', '', el, { cookie: 'Choose your preferences to continue.', toast: 'Your workspace is ready.', chat: 'How can we help?', promo: 'Explore the latest tools.', banner: 'A new update is available.' }[ctx.kind]);
      const dismiss = ctx.util.el('button', 'dismiss', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-click-control-link-09',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-click-control-link-09': palette },
      LOW_THEME: palette,
      ACCENTS: ['#0055cf'],
      LOW_ACCENTS: ['#0055cf'],
      parts,
    },
  });
})();
