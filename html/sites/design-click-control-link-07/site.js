(function () {
  'use strict';
  const palette = { bg: '#f2eee7', panel: '#f2eee7', fg: '#080807', muted: '#222222', line: '#444444' };
  const markNote = (_c, selector, mode) => {
    const note = _c.shell.querySelector(selector);
    if (!note) return;
    note.classList.add('instruction');
    note.dataset.display = mode;
    if (mode === 'panel') note.classList.add('instruction-panel');
    if (_c.ctx.instruction.length > 65) note.classList.add('long-instruction');
  };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('ref', 'eink');
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const icon = u.el('span', 'app-icon', head);
      icon.innerHTML =
        '<svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="6"/><path d="M8 10h8v6H8Z M10 10V8h4v2 M8 12q4 3 8 0 M11 13h2"/></svg>';
      u.el('div', 'title', head, 'Reading Task');
      const controls = u.el('span', 'window-controls', head);
      controls.innerHTML =
        '<i><svg viewBox="0 0 16 16"><path d="M3 8h10"/></svg></i><i><svg viewBox="0 0 16 16"><path d="M3 3h10v10H3Z"/></svg></i><i><svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13"/></svg></i>';
      const work = u.el('div', 'work', shell);
      const center = u.el('section', 'center', work);
      const brief = u.el('div', 'brief', center);
      u.el('div', 'brief-label', brief, 'Your Task');
      brief.hidden = _c.display !== 'header';
      shell.classList.toggle('toast-mode', _c.display === 'toast');
      Object.assign(_c, { shell, head, work, center, header: brief });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      markNote(_c, '.ref-instruction', 'header');
    },
    'frame.tools': (base) => (_c) => {
      const h = _c.header;
      _c.header = _c.head;
      base(_c);
      _c.header = h;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const aside = u.el('aside', 'inspector', _c.work);
      Object.assign(_c, { body: _c.work, aside });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.aside;
      base(_c);
      _c.body = body;
      markNote(_c, '.ref-panel-text', 'panel');
      const u = _c.util;
      u.el('h2', '', _c.aside, 'Your Selection');
      u.el('div', 'selection-box', _c.aside, 'No link selected.');
      u.el('p', 'selection-hint', _c.aside, 'Click a link in the article to select it.');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        _c.head.appendChild(note);
        const text = note.querySelector('.ref-note-text');
        text.dataset.display = 'toast';
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        _c.aside.appendChild(foot);
        foot.querySelector('.ref-foot-text').textContent = 'Ready';
      }
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.aside.insertBefore(dock, _c.foot);
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
    name: 'design-click-control-link-07',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#080807'],
      LOW_ACCENTS: ['#080807'],
      parts,
    },
  });
})();
