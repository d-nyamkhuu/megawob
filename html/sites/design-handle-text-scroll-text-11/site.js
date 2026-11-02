(function () {
  'use strict';
  const palette = { bg: '#fff', panel: '#fff', fg: '#090909', muted: '#333', line: '#888' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
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
      document.body.classList.add('ref', 'academic');
      const shell = u.el('main', 'shell', document.body);
      shell.dataset.instruction = _c.display;
      shell.dataset.finish = String(_c.ctx.finish);
      const head = u.el('header', 'head', shell);
      u.el('div', 'title', head, 'Riverton University Library');
      const nav = u.el('nav', 'tools', head);
      ['Home', 'Catalog', 'Digital Collections', 'Research Guides', 'Help'].forEach((s, i) => {
        if (i) u.el('span', 'nav-sep', nav, '|');
        const link = u.el('a', 'nav-link', nav, s);
        link.addEventListener('click', () => env.log('decoy', { label: s, what: 'navigation' }));
      });
      u.el('div', 'motto', head).innerHTML = 'A richer mind<br>for a brighter tomorrow.';
      const footer = u.el('footer', 'footer');
      Object.assign(_c, { shell, navBar: nav, footer, header: footer });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.navBar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const body = u.el('main', 'work', _c.shell);
      const center = u.el('section', 'center', body);
      u.el('h2', 'doc-title', center, 'Document: The Small Things');
      u.el('p', 'doc-sub', center, 'Read the text below and complete the task.');
      Object.assign(_c, { body, center });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.footer;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.footer.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.footer.appendChild(foot);
      _c.shell.appendChild(_c.footer);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.footer.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      if (ctx.initial) {
        const el = u.el('aside', 'perturb banner survey-drawer', document.body);
        const sh = u.el('div', 'survey-head', el);
        u.el('strong', '', sh, 'We value your feedback!');
        const close = u.el('button', 'survey-close', sh, 'Close survey');
        close.type = 'button';
        close.addEventListener('click', ctx.dismiss);
        u.el('p', 'survey-intro', el, 'Please take a quick survey (1 minute).');
        u.el('div', 'survey-question', el, '1. How satisfied are you with the library website?');
        ['Very satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very dissatisfied'].forEach((s) => {
          const r = u.el('div', 'survey-choice', el);
          r.innerHTML = '<i></i> ' + s;
        });
        u.el('div', 'survey-question', el, '2. What is your main reason for visiting today?');
        const sel = u.el('div', 'survey-select', el, 'Select an option...');
        u.el('b', '', sel, '▾');
        u.el('div', 'survey-question', el, '3. Additional comments (optional):');
        u.el('div', 'survey-textarea', el);
        return { el, dismiss: close };
      }
      const el = u.el('section', 'perturb ' + ctx.kind, document.body);
      u.el('strong', '', el, {
        cookie: 'Cookie preferences', toast: 'Notification', chat: 'Support',
        promo: 'A special offer', banner: 'Service notice',
      }[ctx.kind]);
      u.el('p', '', el, {
        cookie: 'Choose your preferences to continue.', toast: 'Your workspace is ready.',
        chat: 'How can we help?', promo: 'Explore the latest tools.', banner: 'A new update is available.',
      }[ctx.kind]);
      const dismiss = u.el('button', 'dismiss', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-handle-text-scroll-text-11',
    template: 'site/base',
    langs: ['en'],
    initialOverlay: { kind: 'banner' },
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { academic: palette }, LOW_THEME: palette,
      ACCENTS: ['#0000ee'], LOW_ACCENTS: ['#0000ee'], parts,
    },
  });
})();
