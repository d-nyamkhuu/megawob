(function () {
  'use strict';
  const palette = { bg: '#7fa8d5', panel: '#fffdf5', fg: '#09163e', muted: '#243247', line: '#4b80b6' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The detached notes palette fits all of this site's viewports.
      _c.display = _c.ctx.display || 'header';
      document.body.classList.remove('ref-has-note');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('ref', 'flash', 'palette');
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const title = u.el('div', 'title', head);
      title.innerHTML = 'Learn<span class="lb-b">base</span>';
      const nav = u.el('div', 'tools', head);
      ['Home', 'Activities', 'Resources', 'Help'].forEach((label, i) =>
        u.el('span', i === 1 ? 'active' : '', nav, label));
      u.el('div', 'acct', head, 'My Account   |   Sign Out');
      const center = u.el('section', 'center');
      Object.assign(_c, { shell, head, center, header: center });
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
      const u = _c.util;
      const body = u.el('div', 'work', _c.shell);
      const rail = u.el('nav', 'rail', body);
      ['Getting Started', 'Learning Modules', 'Practice', 'My Progress', 'Settings'].forEach((text, i) =>
        u.el('div', i === 0 ? 'active' : '', rail, text));
      body.appendChild(_c.center);
      const aside = u.el('aside', 'inspector', body);
      u.el('h2', '', aside, 'Quick Notes');
      if (_c.display !== 'panel' && _c.display !== 'toast')
        u.el('p', '', aside, 'Follow the instructions and click the link.');
      Object.assign(_c, { body, aside });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.aside;
      base(_c);
      _c.body = body;
      const text = _c.aside.querySelector('.ref-panel-text');
      if (text) text.dataset.display = _c.display;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        _c.aside.appendChild(note);
        note.querySelector('.ref-note-text').dataset.display = _c.display;
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('footer');
      _c.shell.appendChild(foot);
      const ready = foot.querySelector('.ref-foot-text');
      ready.classList.add('ready');
      ready.textContent = 'Ready.';
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
    name: 'design-click-control-collapsible-01',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-click-control-collapsible-01': palette },
      LOW_THEME: palette,
      ACCENTS: ['#0053ee'],
      LOW_ACCENTS: ['#0053ee'],
      parts,
    },
  });
})();
