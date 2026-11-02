(function () {
  'use strict';
  const D = {
    school: 'Riverton College',
    sub: 'Mail System',
    heading: 'Recent Messages',
    cols: ['From', 'Subject', 'Date'],
    rows: [
      ['Pat Lee', 'Meeting Tomorrow', 'Apr 22, 1995'],
      ['Registrar', 'Course Update', 'Apr 21, 1995'],
      ['Dana Ruiz', 'Re: Notes', 'Apr 21, 1995'],
      ['IT Office', 'System Maintenance', 'Apr 20, 1995'],
    ],
    nav: ['Home', 'Mail', 'Calendar', 'Contacts', 'Help'],
    empty: ['No message selected.', 'Use the menu above to browse your messages.'],
  };
  const palette = { bg: '#ffffff', panel: '#ffffff', fg: '#000000', muted: '#808080', line: '#808080' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original notes fit in the work area at every training viewport.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const logLink = (el, label) => {
        el.href = '#';
        el.addEventListener('click', (e) => {
          e.preventDefault();
          env.log('decoy', { label });
        });
      };
      document.body.classList.add('ref', 'acad');
      document.documentElement.scrollTop = 0;
      document.documentElement.scrollLeft = 0;
      document.body.scrollTop = 0;
      document.body.scrollLeft = 0;
      const shell = u.el('main', 'shell', document.body);
      const ov = u.el('section', 'overview', shell);
      const left = u.el('div', 'ov-main', ov);
      const brand = u.el('div', 'brand', left);
      const a = u.el('a', 'school', brand, D.school);
      logLink(a, D.school);
      u.el('div', 'subtitle', brand, D.sub);
      u.el('hr', 'rule', left);
      u.el('h2', 'recent', left, D.heading);
      const t = u.el('table', 'msgs', left);
      const hr = u.el('tr', '', t);
      D.cols.forEach((c) => u.el('th', '', hr, c));
      D.rows.forEach((r) => {
        const tr = u.el('tr', '', t);
        r.forEach((c, i) => {
          const td = u.el('td', '', tr);
          if (i === 1) logLink(u.el('a', '', td, c), c);
          else td.textContent = c;
        });
      });
      const nav = u.el('nav', 'links', ov);
      D.nav.forEach((n) => logLink(u.el('a', '', nav, n), n));
      u.el('div', 'splitter', shell);
      const work = u.el('div', 'work', shell);
      const center = u.el('section', 'center', work);
      const header = u.el('div', 'note-slot', center);
      Object.assign(_c, { shell, brand, body: work, center, header });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.brand;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => () => {},
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      u.el('hr', 'rule2', _c.center);
      _c.stage = u.el('div', 'stage', _c.center);
      const result = u.el('div', 'result', _c.center);
      D.empty.forEach((s) => u.el('p', '', result, s));
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        _c.header.appendChild(document.body.querySelector('.ref-note'));
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.center.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.center.appendChild(dock);
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
    name: 'design-click-control-menu-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-click-control-menu-02': palette },
      LOW_THEME: palette,
      ACCENTS: ['#0000ee'],
      LOW_ACCENTS: ['#0000ee'],
      parts,
    },
  });
})();
