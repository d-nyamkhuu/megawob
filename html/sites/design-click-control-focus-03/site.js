(function () {
  'use strict';
  const cfg = {
    title: 'My Notebook',
    date: 'Tue, Apr 12, 2005',
    tabs: ['Notes', 'Tasks', 'Contacts', 'Calendar', 'Files'],
    heading: 'Project Feedback',
  };
  const palette = { bg: '#86bcf0', panel: '#fefefe', fg: '#1a2a55', muted: '#52677d', line: '#c2e4ff' };
  function decorate(u, note) {
    if (!note) return;
    const ico = u.el('span', 'nb-doc');
    ico.innerHTML =
      '<svg viewBox="0 0 40 52"><path d="M3 2h26l8 8v40H3Z" fill="#fff" stroke="#2a4fa0" stroke-width="2.5"/><path d="M29 2v8h8" fill="#dbe8fb" stroke="#2a4fa0" stroke-width="2"/><path d="M9 18h22M9 24h22M9 30h22M9 36h22M9 42h16" stroke="#6f8fd0" stroke-width="2"/></svg>';
    note.prepend(ico);
  }
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The notebook has room for its corner cards at every training size.
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
      document.body.classList.add('ref', 'nb');
      const tabs = u.el('nav', 'nb-tabs', document.body);
      cfg.tabs.forEach((s, i) => u.el('div', 'nb-tab' + (i === 0 ? ' active' : ''), tabs, s));
      const rings = u.el('div', 'nb-rings', document.body);
      for (let i = 0; i < 9; i++) u.el('i', '', rings);
      const page = u.el('main', 'nb-page', document.body);
      const head = u.el('header', 'nb-head', page);
      u.el('h1', '', head, cfg.title);
      u.el('span', 'nb-date', head, cfg.date);
      Object.assign(_c, { page, head, header: page });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.page.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('instruction');
        note.dataset.display = _c.display;
        decorate(_c.util, note);
      }
    },
    'frame.tools': (base) => (_c) => {
      const h = _c.header;
      _c.header = _c.head;
      base(_c);
      _c.header = h;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.page;
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const note = _c.page.querySelector('.ref-panel');
      if (note) {
        note.classList.add('instruction', 'instruction-panel');
        note.dataset.display = _c.display;
        decorate(_c.util, note);
      }
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      u.el('h2', 'nb-h2', _c.page, cfg.heading);
      // Keep the former hint's spacing without repeating the task outside its note.
      u.el('p', 'nb-hint', _c.page, '\u00a0');
      _c.stage = u.el('div', 'stage', _c.page);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('instruction', 'instruction-toast');
        note.dataset.display = _c.display;
        _c.page.appendChild(note);
        decorate(_c.util, note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('nb-foot');
      _c.page.appendChild(foot);
      const clear = _c.util.el('button', 'clear-form', foot, 'Clear');
      clear.type = 'button';
      clear.addEventListener('click', () =>
        _c.stage.querySelectorAll('input,textarea').forEach((input) => (input.value = '')),
      );
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.insertBefore(dock, _c.foot.querySelector('.clear-form'));
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
    name: 'design-click-control-focus-03',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-click-control-focus-03': palette },
      LOW_THEME: palette,
      ACCENTS: ['#70bc35'],
      LOW_ACCENTS: ['#70bc35'],
      parts,
    },
  });
})();
