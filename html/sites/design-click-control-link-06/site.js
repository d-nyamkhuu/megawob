(function () {
  'use strict';
  const palette = { bg: '#f8f1e5', panel: '#dbe4df', fg: '#1f4a56', muted: '#5d7078', line: '#e1d8c8' };
  function icon(u, note) {
    const ico = u.el('span', 'cn-ico');
    ico.innerHTML = '<svg viewBox="0 0 24 24"><path d="M6 2v17l4.5-4 3 7 3-1.3-3-6.6H19Z"/></svg>';
    note.prepend(ico);
  }
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('ref', 'cedar');
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const brand = u.el('div', 'brand', head);
      brand.innerHTML =
        '<svg viewBox="0 0 64 44"><path fill="currentColor" stroke="none" d="M7 5Q20-1 31 7V37Q19 29 7 33Z M34 7Q46-1 57 5V33Q45 29 34 37Z"/><path d="M3 8v30q16-5 28 3h3q12-8 27-3V8 M38 10q7-3 15-2 M38 16q7-3 15-2 M38 22q7-3 15-2 M38 28q7-3 15-2"/><path stroke="#7b2437" d="M38 10q7-3 15-2 M38 16q7-3 15-2 M38 22q7-3 15-2 M38 28q7-3 15-2"/></svg>';
      u.el('span', '', brand, 'Cedar Notes');
      const nav = u.el('nav', 'topnav', head);
      ['Library', 'Collections', 'Help'].forEach((s) => u.el('span', '', nav, s));
      const work = u.el('div', 'work', shell);
      const center = u.el('section', 'center', work);
      Object.assign(_c, { shell, header: head, work, center });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.center;
      base(_c);
      _c.header = header;
      const note = _c.center.querySelector('.ref-instruction');
      if (note) {
        const text = _c.util.el('span', 'cn-text', null, note.textContent);
        note.replaceChildren(text);
        note.classList.add('instruction');
        note.dataset.display = _c.display;
        icon(_c.util, note);
      }
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
    },
    'frame.body': () => (_c) => {
      _c.body = _c.work;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.work;
      base(_c);
      _c.body = body;
      const panel = _c.work.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('instruction-panel');
        panel.querySelector('.ref-panel-title').textContent = 'Reading note';
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('instruction', 'instruction-toast');
        note.dataset.display = _c.display;
        icon(_c.util, note);
        _c.center.insertBefore(note, _c.stage);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.work.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) {
        _c.work.appendChild(dock);
      }
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
    name: 'design-click-control-link-06',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { cedar: palette },
      LOW_THEME: palette,
      ACCENTS: ['#1f6070'],
      LOW_ACCENTS: ['#1f6070'],
      parts,
    },
  });
})();
