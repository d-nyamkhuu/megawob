(function () {
  'use strict';
  const palette = { bg: '#096cc3', panel: '#096cc3', fg: '#ffffff', muted: '#66707d', line: '#bbc2c9' };
  const styleControls = (parent) => {
    parent.querySelectorAll('.ref-submit').forEach((b) => b.classList.add('ds-submit'));
    parent.querySelectorAll('.ref-endlink').forEach((b) => b.classList.add('ds-end-link'));
    parent.querySelectorAll('.ref-xtra').forEach((b) => b.classList.add('ds-pq'));
  };
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
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = _c.util;
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-globe', top);
      u.el('span', 'ds-brand', top, 'AquaAccount');
      u.el('span', 'ds-tag', top, 'Simple tools for your digital life');
      const nav = u.el('nav', 'ds-menu', document.body);
      ['Help', 'Settings', 'Sign out'].forEach((t) => u.el('span', '', nav, t));
      const shell = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', shell);
      const toolbar = u.el('div', 'ds-ptitle', content);
      u.el('span', '', toolbar, 'Account Setup');
      u.el('span', 'ds-step', toolbar, 'Step 2 of 3');
      u.el('div', 'ds-glow', document.body);
      Object.assign(_c, { content, toolbar, header: content });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const text = _c.header.querySelector('.ref-instruction');
      if (text) {
        const note = _c.util.el('aside', 'ds-header-note');
        _c.header.insertBefore(note, text);
        _c.util.el('span', 'ds-lock', note);
        note.appendChild(text);
        text.classList.add('ds-instruction');
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
      styleControls(_c.headerTools);
      if (_c.submit) _c.submit.classList.add('ds-submit-header');
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'ds-main', _c.content);
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-brief');
        panel.querySelector('.ref-panel-title').textContent = 'Instructions';
        panel.querySelector('.ref-panel-text').classList.add('ds-instruction');
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-toast');
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        _c.content.insertBefore(note, _c.body);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      foot.querySelector('.ref-foot-text').textContent = 'Ready';
      _c.content.appendChild(foot);
      styleControls(foot);
      _c.foot = foot;
      const links = _c.util.el('div', 'ds-links', document.body);
      ['Privacy', 'Terms', 'Contact'].forEach((t) => _c.util.el('span', '', links, t));
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
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: 'design-type-text-password-01',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-type-text-password-01': palette },
      LOW_THEME: palette,
      ACCENTS: ['#2598f3'],
      LOW_ACCENTS: ['#2598f3'],
      parts,
    },
  });
})();
