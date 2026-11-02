(function () {
  'use strict';
  const palette = { bg: '#fbfaf7', panel: '#ffffff', fg: '#111111', muted: '#777777', line: '#bbbbbb' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // All four displays have dedicated space in the newspaper layout.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = _c.util;
      const top = u.el('header', 'ds-top', document.body);
      const mast = u.el('div', 'ds-mast', top);
      u.el('div', 'ds-brand', mast, 'The Daily Chronicle');
      u.el('div', 'ds-slogan', mast, 'News for a more informed tomorrow.');
      const util = u.el('div', 'ds-util', top);
      const links = u.el('div', 'ds-links', util);
      ['My Account', 'Settings', 'Help', 'Sign Out'].forEach(t => u.el('span', '', links, t));
      const srch = u.el('div', 'ds-search', util);
      u.el('span', 'ds-searchbox', srch, 'Search articles...');
      const searchIcon = u.el('span', 'ds-searchbtn', srch);
      searchIcon.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="white" stroke-width="3"><circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/></svg>';
      _c.top = top;
      // The instruction section runs before body, so build its container here.
      _c.outer = u.el('div', 'ds-body');
      _c.contentPane = u.el('div', 'ds-content', _c.outer);
      _c.header = _c.contentPane;
    },
    'frame.nav': () => (_c) => {
      const nav = _c.util.el('nav', 'ds-menu', document.body);
      ['Home', 'World', 'Business', 'Opinion', 'Life'].forEach(t => _c.util.el('span', '', nav, t));
      _c.menu = nav;
    },
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-header-note', 'ds-instruction');
      _c.main = _c.util.el('div', 'ds-main', _c.contentPane);
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.main;
      base(_c);
      _c.header = header;
      _c.headerTools.classList.add('ds-form-tools');
      const extras = _c.util.el('div', 'ds-menu-tools', _c.menu);
      _c.headerTools.querySelectorAll('.ref-xtra').forEach(b => extras.appendChild(b));
    },
    'frame.body': () => (_c) => {
      document.body.appendChild(_c.outer);
      _c.body = _c.main;
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.main.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-brief');
        panel.style.order = '2';
        panel.querySelector('.ref-panel-text').classList.add('ds-instruction');
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.main);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-toast');
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        _c.contentPane.insertBefore(note, _c.main);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.contentPane.appendChild(foot);
      foot.querySelector('.ref-foot-text').textContent = '© 2011 The Daily Chronicle';
      const tools = foot.querySelector('.ref-tools');
      ['Contact', 'Privacy', 'Terms'].forEach(t => foot.insertBefore(_c.util.el('span', 'ds-fl', null, t), tools));
      foot.insertBefore(_c.util.el('span', 'ds-fr', null, 'A calmer place for a clearer view.'), tools);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = { cookie: 'We use cookies to remember your preferences.', toast: 'Changes synced.', chat: 'Hello. How can we help?', promo: 'Try our new workspace.', banner: 'Scheduled maintenance tonight.' };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: 'design-set-date-typed-10',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-set-date-typed-10': palette },
      LOW_THEME: palette,
      ACCENTS: ['#a81c1c'],
      LOW_ACCENTS: ['#a81c1c'],
      parts,
    },
  });
})();
