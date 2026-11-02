(function () {
  'use strict';
  const palette = { bg: '#858eae', panel: '#e2e1df', fg: '#10131c', muted: '#454957', line: '#777983' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
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
      document.body.classList.add('ref', 'platinum', 'board');
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      u.el('div', 'title', head, 'Text Reader');
      u.el('div', 'sub', head, 'EXTRANET  |  PARTNER ACCESS  |  EST. 1999');
      const who = u.el('div', 'who', head);
      who.innerHTML = 'Logged in: jcarter &nbsp;|&nbsp; Acme Parts Ltd. &nbsp;|&nbsp; <u>Help</u> &nbsp;|&nbsp; <u>Sign Out</u>';
      u.el('div', 'date', head, 'Tue, Mar 16, 1999');
      const work = u.el('div', 'work', shell);
      const icons = u.el('div', 'desktop-icons', work);
      icons.innerHTML = '<div class="desktop-icon drive"><svg viewBox="0 0 48 42" aria-hidden="true"><path d="M8 12 13 4h23l5 8v20H7V13z" fill="#d9dce3" stroke="#45495a" stroke-width="1.5"/><path d="M9 13h30v15H9z" fill="#bfc4ce" stroke="#666b79"/><path d="M14 8h21l3 5H10z" fill="#eef0f4" stroke="#707583"/><path d="M13 18h22M13 22h22M13 26h18" stroke="#8f95a2"/><path d="M19 32h13" stroke="#555a68" stroke-width="2"/></svg><span>Macintosh HD</span></div><div class="desktop-icon folder"><svg viewBox="0 0 48 42" aria-hidden="true"><path d="M5 10h15l5 5h18v21H5z" fill="#a9a8df" stroke="#454464" stroke-width="1.5"/><path d="M5 16h38v19H5z" fill="#c5c4f0" stroke="#605f89"/><path d="m8 18 30 0-3 14H7z" fill="#b2b0e4" stroke="#7977a8"/><path d="M8 19h29" stroke="#e4e3ff" stroke-width="2"/></svg><span>Documents</span></div><div class="desktop-icon trash"><svg viewBox="0 0 48 42" aria-hidden="true"><path d="M13 11h22l-2 27H15z" fill="#c2c5ce" stroke="#555a68" stroke-width="1.5"/><path d="M11 9h26v4H11zM17 6h14l2 3H15z" fill="#e0e2e8" stroke="#555a68"/><path d="M19 16v17M24 16v17M29 16v17" stroke="#858a97" stroke-width="1.5"/><path d="M15 13h18" stroke="#f7f7fa"/></svg><span>Trash</span></div>';
      const center = u.el('section', 'center', work);
      Object.assign(_c, { shell, head, work, center, header: center });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('instruction', 'instruction-header');
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
      const note = _c.body.querySelector('.ref-panel');
      if (note) {
        note.classList.add('instruction', 'instruction-panel');
        note.dataset.display = _c.display;
      }
    },
    'frame.stage': () => (_c) => { _c.stage = _c.util.el('div', 'stage', _c.center); },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('instruction', 'instruction-toast');
        note.dataset.display = _c.display;
        _c.center.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('platinum-foot');
      _c.shell.appendChild(foot);
      foot.querySelector('.ref-foot-text').hidden = true;
    },
    'frame.floating': (base) => (_c) => { base(_c); },
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
    name: 'design-handle-text-scroll-text-06',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-handle-text-scroll-text-06': palette },
      LOW_THEME: palette,
      ACCENTS: ['#535c82'],
      LOW_ACCENTS: ['#535c82'],
      parts,
    },
  });
})();
