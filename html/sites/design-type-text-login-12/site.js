(function () {
  'use strict';
  const palette = { bg: '#f3f1e8', panel: '#e0ded8', fg: '#111', muted: '#555', line: '#cbc8c0' };
  const parts = {
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
        '<svg viewBox="0 0 106 80" width="100%" height="100%"><circle cx="24" cy="24" r="24" fill="#f5f1e8"/><path d="M52 24 A54 54 0 0 1 104 76 L52 76 Z" fill="#161616" transform="translate(0,-2)"/></svg>';
      const br = u.el('span', 'ds-brand', top);
      'Task|Portal'.split('|').forEach((t) => u.el('span', '', br, t));
      u.el('span', 'ds-divider', top);
      _c.header = top;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      _c.body = u.el('div', 'ds-main', content);
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.body);
      _c.stage.classList.toggle('ds-stage-narrow', _c.display === 'panel');
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.header.insertBefore(note, _c.headerTools);
    },
    'frame.footer': (base) => (_c) => {
      const u = _c.util;
      const foot = u.el('footer', 'ds-footer', document.body);
      const sh = u.el('span', 'ds-shapes', foot);
      sh.innerHTML =
        '<svg viewBox="0 0 210 56" width="100%" height="100%"><rect x="0" y="1" width="54" height="54" fill="#cf2d2d"/><circle cx="102" cy="28" r="27" fill="#f5f1e8"/><path d="M148 55 L175 4 L202 55 Z" fill="#cf2d2d"/></svg>';
      u.el('span', 'ds-tag', foot, 'SIMPLE TOOLS\nBRIGHTER WORK');
      base(_c);
      const controls = document.body.querySelector('.ref-foot');
      if (controls) foot.appendChild(controls);
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
    name: 'design-type-text-login-12',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#cf2d2d'],
      LOW_ACCENTS: ['#cf2d2d'],
      parts,
    },
  });
})();
