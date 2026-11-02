(function () {
  'use strict';

  const palette = { bg: '#ffffff', panel: '#ffffff', fg: '#112f52', muted: '#60758e', line: '#cad8e7' };
  const styleControls = (parent) => {
    parent.querySelectorAll('.ref-submit,.ref-float').forEach((el) => el.classList.add('civic-end'));
    parent.querySelectorAll('.ref-icon').forEach((el) => el.classList.add('civic-end-icon'));
    parent.querySelectorAll('.ref-endlink').forEach((el) => el.classList.add('civic-end-link'));
    parent.querySelectorAll('.ref-xtra').forEach((el) => el.classList.add('civic-xtra'));
  };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original note cards have their own responsive layout.
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
      document.body.classList.add('civic-page');
      const shell = u.el('div', 'civic-body', document.body);
      const rail = u.el('aside', 'civic-rail', shell);
      const navItems = [['⌂', 'Home'], ['▤', 'Services'], ['▦', 'Appointments'], ['●', 'Help'], ['⚙', 'Settings']];
      navItems.forEach(([icon, name]) => {
        const item = u.el('div', 'civic-nav-item', rail);
        u.el('span', 'civic-nav-icon', item, icon);
        u.el('span', 'civic-nav-label', item, name);
      });
      const content = u.el('div', 'civic-content', shell);
      const toolbar = u.el('header', 'civic-header', content);
      u.el('div', 'civic-brand', toolbar, 'Riverton City Services');
      u.el('div', 'civic-tagline', toolbar, 'A stronger community together');
      let noteHost = null;
      if (_c.display !== 'hidden') {
        noteHost = u.el('aside', `civic-task civic-task-${_c.display}`, content);
        u.el('span', 'civic-info', noteHost, 'i');
      }
      Object.assign(_c, { shell, content, toolbar, noteHost, header: noteHost || toolbar });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('civic-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
      _c.headerTools.classList.add('civic-header-tools');
      styleControls(_c.headerTools);
    },
    'frame.body': () => (_c) => { _c.body = _c.content; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.noteHost || body;
      base(_c);
      _c.body = body;
      const text = _c.content.querySelector('.ref-panel-text');
      if (text) {
        text.classList.add('civic-instruction');
        const title = _c.content.querySelector('.ref-panel-title');
        title.classList.add('civic-task-label');
        title.textContent = 'Service request';
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage civic-stage', _c.content);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        _c.noteHost.appendChild(note);
        note.querySelector('.ref-note-text').classList.add('civic-instruction');
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('civic-footer');
      _c.content.appendChild(foot);
      const text = foot.querySelector('.ref-foot-text');
      text.classList.add('civic-footer-note');
      text.textContent = 'Riverton City Services · Secure account access';
      styleControls(foot);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) {
        _c.foot.appendChild(dock);
        styleControls(dock);
      }
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const el = u.el('section', `civic-overlay civic-overlay-${ctx.kind}`, document.body);
      el.dataset.role = 'overlay';
      const texts = { cookie: 'We use cookies to remember your preferences.', toast: 'Your request has been received.', chat: 'How can we help with city services?', promo: 'Explore more Riverton services.', banner: 'Some online services may be unavailable during scheduled maintenance.' };
      u.el('div', 'civic-overlay-text', el, texts[ctx.kind] || texts.banner);
      const dismiss = u.el('button', 'civic-end', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: 'design-act-in-time-popup-10',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-act-in-time-popup-10': palette },
      LOW_THEME: palette,
      ACCENTS: ['#075eb9'],
      LOW_ACCENTS: ['#075eb9'],
      parts,
    },
  });
})();
