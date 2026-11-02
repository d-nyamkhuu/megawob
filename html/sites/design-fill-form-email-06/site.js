(function () {
  'use strict';
  const palette = { bg: '#edf1f5', panel: '#ffffff', fg: '#0b1832', muted: '#66707d', line: '#bbc2c9' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // Each note has a dedicated place in this form card, including at small viewports.
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
      const logo = u.el('span', 'ds-logo', top);
      logo.innerHTML =
        '<svg viewBox="0 0 60 44" fill="currentColor"><circle cx="30" cy="10" r="9"/><circle cx="10" cy="14" r="6"/><circle cx="50" cy="14" r="6"/><path d="M16 40V32a14 14 0 0 1 28 0v8ZM1 40V31a9 9 0 0 1 13-8v17ZM46 40V23a9 9 0 0 1 13 8v9Z"/></svg>';
      u.el('span', 'ds-brand', top, 'Civic Services');
      u.el('span', 'ds-sub', top, 'Community Partner Directory');
      const nav = u.el('nav', 'ds-menu', top);
      'Home|Partners|Reports|Help'.split('|').forEach((t) => u.el('span', '', nav, t));
      const avatar = u.el('span', 'ds-user', top);
      avatar.innerHTML =
        '<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="#f6f9fb"/><circle cx="20" cy="14" r="6" fill="#264469"/><path d="M8 33v-5c0-9 24-9 24 0v5Z" fill="#264469"/></svg>';
      const outer = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', outer);
      Object.assign(_c, { header: nav, contentBox: content });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.contentBox;
      base(_c);
      _c.header = header;
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
      if (_c.headerTools.children.length) _c.header.classList.add('ds-end-toolbar');
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'ds-main', _c.contentBox);
    },
    'frame.panel': (base) => (_c) => { base(_c); },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.contentBox.insertBefore(note, _c.body);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.contentBox.appendChild(foot);
      foot.querySelector('.ref-foot-text').remove();
      const clr = _c.util.el('button', 'ds-clear', foot, 'Clear Form');
      clr.type = 'button';
      clr.addEventListener('click', () => _c.stage.dispatchEvent(new Event('ff-clear-form')));
      const tools = foot.querySelector('.ref-tools');
      foot.appendChild(tools);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
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
    name: 'design-fill-form-email-06',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#1560cc'],
      LOW_ACCENTS: ['#1560cc'],
      parts,
    },
  });
})();
