(function () {
  'use strict';
  const palette = { bg: '#d7e1eb', panel: '#edf4fc', fg: '#080d16', muted: '#172c57', line: '#aabed7' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original portal supports its own compact versions of every note mode.
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
      document.body.classList.add('ref', 'portal', 'dock');
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const title = u.el('div', 'title', head);
      u.el('span', 'title-text', title, 'WebFinder');
      u.el('div', 'tools', head, 'Home  |  Search  |  Directory  |  News  |  Help');
      const center = u.el('section', 'center');
      center.dataset.display = _c.display;
      Object.assign(_c, { shell, head, center, header: center });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.dataset.display = _c.display;
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.head;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const work = _c.util.el('div', 'work', _c.shell);
      work.appendChild(_c.center);
      _c.body = _c.center;
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.center.insertBefore(note, _c.stage);
    },
    'frame.footer': (base) => (_c) => {
      const u = _c.util;
      const foot = u.el('footer', 'footer', _c.shell);
      const dock = u.el('div', 'dock-sections', foot);
      'World News|Sports|Jobs|Weather'.split('|').forEach((s) => {
        const d = u.el('section', 'dock-section', dock);
        const label = u.el('div', 'dock-copy', d);
        const words = s.split(/ (.+)/);
        u.el('strong', '', label, words[0]);
        u.el('span', '', label, words[1] || '');
      });
      base(_c);
      const controls = document.body.querySelector('.ref-foot');
      if (controls) foot.appendChild(controls);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
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
    name: 'design-handle-text-copy-paste-2-03',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-handle-text-copy-paste-2-03': palette },
      LOW_THEME: palette,
      ACCENTS: ['#0645ad'],
      LOW_ACCENTS: ['#0645ad'],
      parts,
    },
  });
})();
