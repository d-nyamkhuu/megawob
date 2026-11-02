(function () {
  'use strict';
  const cfg = {
    'title': 'Riverton City Services',
    'nav': ['Services', 'Residents', 'Business', 'About'],
    'heading': 'Community Feedback',
    'sub': 'Tell us what matters most to you. All fields are optional.',
    'obstacle': 'Welcome!',
    'copy': 'This short tour will show you around the interface.',
    'dismiss': 'Skip tour',
  };
  const LOGO =
    '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 1 1 16v5h62v-5Z" fill="#fff"/><path d="M7 23h9v28H7zm20 0h9v28h-9zm20 0h9v28h-9zM4 53h56v5H4zM1 59h62v5H1z" fill="#fff"/></svg>';
  const SEARCH =
    '<svg viewBox="0 0 24 24" fill="none" stroke="#10264d" stroke-width="2.6" stroke-linecap="round"><circle cx="10" cy="10" r="6.5"/><path d="m15 15 6 6"/></svg>';
  const palette = { bg: '#fff', panel: '#fff', fg: '#0c1d36', muted: '#526073', line: '#74808f' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original form uses the available stage width for its note fallback.
      _c.display = _c.ctx.display || 'header';
      if ((_c.display === 'panel' || _c.display === 'toast') && _c.ctx.size && _c.ctx.size.width < 1260) _c.display = 'header';
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('ref', 'civic');
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const brand = u.el('div', 'brand', head);
      const logo = u.el('span', 'logo', brand);
      logo.innerHTML = LOGO;
      u.el('span', 'brand-name', brand, cfg.title);
      const nav = u.el('nav', 'topnav', head);
      cfg.nav.forEach((s) => u.el('span', '', nav, s));
      const search = u.el('div', 'search', head);
      const si = u.el('span', 'search-icon', search);
      si.innerHTML = SEARCH;
      u.el('span', '', search, 'Search our site');
      const work = u.el('div', 'work', shell);
      const center = u.el('section', 'center', work);
      Object.assign(_c, { shell, head, work, center, header: center });
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
      _c.header = _c.head;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.center; },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.center.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('instruction', 'instruction-panel');
        panel.dataset.display = _c.display;
      }
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      const intro = u.el('div', 'intro', _c.center);
      u.el('h2', '', intro, cfg.heading);
      u.el('p', '', intro, cfg.sub);
      _c.stage = u.el('div', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('instruction', 'instruction-toast');
        note.dataset.display = _c.display;
        _c.center.insertBefore(note, _c.center.firstChild);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('footer');
      _c.shell.appendChild(foot);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      if (ctx.kind === 'chat') {
        const el = ctx.util.el('section', 'perturb chat tour-overlay', document.body);
        ctx.util.el('h2', '', el, cfg.obstacle);
        ctx.util.el('p', '', el, cfg.copy);
        const dismiss = ctx.util.el('button', 'dismiss-design', el, cfg.dismiss);
        dismiss.type = 'button';
        dismiss.addEventListener('click', ctx.dismiss);
        const next = ctx.util.el('button', 'next-design', el, 'Next');
        next.type = 'button';
        next.addEventListener('click', ctx.dismiss);
        const x = ctx.util.el('button', 'x-design', el, '×');
        x.type = 'button';
        x.setAttribute('aria-label', 'Close tour');
        x.addEventListener('click', ctx.dismiss);
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
    name: 'design-click-control-widget-10',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css', 'civic.css'],
    design: {
      THEMES: { civic: palette },
      LOW_THEME: palette,
      ACCENTS: ['#075bb6'],
      LOW_ACCENTS: ['#075bb6'],
      parts,
    },
  });
})();
