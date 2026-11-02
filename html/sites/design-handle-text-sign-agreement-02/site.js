(function () {
  'use strict';
  const palette = { bg: '#f4f6f8', panel: '#ffffff', fg: '#182b40', muted: '#526171', line: '#c8d0d9' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // This design has a dedicated task pane, including at narrow viewports.
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
      document.body.classList.add('ref', 'clearlooks', 'inspector');
      const shell = u.el('main', 'shell', document.body);
      shell.dataset.display = _c.display;
      shell.dataset.end = _c.placement || 'none';
      const head = u.el('header', 'head', shell);
      const title = u.el('div', 'title', head, 'Acme Solutions');
      const glyph = u.el('span', 'title-document', title);
      glyph.innerHTML =
        '<svg viewBox="0 0 20 24"><path d="M2 1h11l5 5v16H2Z" fill="#f4f4ef" stroke="#59636c"/><path d="M13 1v6h5M5 9h9M5 12h8M5 15h9M5 18h6" fill="none" stroke="#849097"/><path d="M6 6h3v4H6Z" fill="#a9bac7" stroke="#5e6d77"/></svg>';
      const controls = u.el('span', 'window-controls', title);
      controls.innerHTML =
        '<i><svg viewBox="0 0 16 16"><path d="M3 12h10"/></svg></i><i><svg viewBox="0 0 16 16"><path d="M3 3h10v10H3Z"/></svg></i><i><svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13"/></svg></i>';
      const menus = u.el('div', 'tools', head);
      menus.innerHTML =
        '<span>Home</span><span>Documents</span><span>Accounts</span><span>Support</span><span class="welcome">Welcome, Alex <b>▼</b></span>';
      menus.querySelectorAll('span:not(.welcome)').forEach((item) =>
        item.addEventListener('click', () => env.log('decoy', { label: item.textContent })));
      const aside = u.el('aside', 'inspector');
      const heading = u.el('h2', '', aside, 'Your Task');
      heading.hidden = _c.display === 'hidden';
      Object.assign(_c, { shell, head, aside, header: aside });
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
    'frame.body': () => (_c) => {
      const work = _c.util.el('div', 'work', _c.shell);
      const center = _c.util.el('section', 'center', work);
      work.appendChild(_c.aside);
      Object.assign(_c, { body: work, center });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.aside;
      base(_c);
      _c.body = body;
      const note = _c.aside.querySelector('.ref-panel-text');
      if (note) {
        note.classList.add('instruction');
        note.dataset.display = _c.display;
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        _c.aside.appendChild(note);
        note.classList.add('instruction', 'instruction-toast');
        note.dataset.display = _c.display;
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        _c.aside.appendChild(foot);
        foot.querySelector('.ref-foot-text').textContent = 'Ready.';
      }
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.aside.appendChild(dock);
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
    name: 'design-handle-text-sign-agreement-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#287bd0'],
      LOW_ACCENTS: ['#287bd0'],
      parts,
    },
  });
})();
