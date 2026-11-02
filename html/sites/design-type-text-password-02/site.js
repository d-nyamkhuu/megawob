(function () {
  'use strict';
  const palette = { bg: '#f1ede2', panel: '#f1ede2', fg: '#1d1a16', muted: '#7a756b', line: '#cfc8b8' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const top = u.el('header', 'ds-top', document.body);
      const book = u.el('span', 'ds-logo', top);
      book.innerHTML =
        '<svg viewBox="0 0 40 34" width="100%" height="100%"><path d="M3 5 L19 8 L19 31 L3 28Z" fill="#d8b866" stroke="#6b4a1c" stroke-width="2"/><path d="M37 5 L21 8 L21 31 L37 28Z" fill="#e8cf8a" stroke="#6b4a1c" stroke-width="2"/></svg>';
      u.el('span', 'ds-brand', top, 'Manuscript Keeper');
      const nav = u.el('nav', 'ds-menu', top);
      ['File', 'Edit', 'Tools', 'Help'].forEach((t) => u.el('span', '', nav, t));
      const wc = u.el('span', 'ds-wc', top);
      wc.innerHTML =
        '<svg viewBox="0 0 150 24" width="100%" height="100%" fill="none" stroke="#d9c9a8" stroke-width="2"><path d="M4 18 H22"/><rect x="62" y="4" width="15" height="15"/><path d="M110 4 L126 20 M126 4 L110 20"/></svg>';
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      Object.assign(_c, { top, body, content, header: top });
    },
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.content;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.main = _c.util.el('div', 'ds-main', _c.content);
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const side = _c.body.querySelector('.ref-panel') || _c.util.el('aside', 'ds-margin', _c.body);
      {
        side.classList.add('ds-margin');
        const u = _c.util;
        if (_c.display !== 'panel') u.el('div', 'ds-margin-heading', side, 'Your private manuscript workspace.');
        u.el('hr', 'ds-hr', side);
        u.el('h3', 'ds-notes-h', side, 'Notes:');
        const ul = u.el('ul', 'ds-notes', side);
        const li = u.el('li', '', ul);
        ['Keep your manuscripts', 'organized in one place.', 'Your private workspace', 'for drafts and revisions.'].forEach((line) => u.el('span', 'ds-note-line', li, line));
        u.el('li', '', ul, 'Preserve your ideas.');
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.main);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.content.insertBefore(note, _c.main);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.content.appendChild(foot);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.insertBefore(dock, _c.foot.firstChild);
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
    name: 'design-type-text-password-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'ref.css', 'site.css'],
    design: {
      THEMES: { 'design-type-text-password-02': palette },
      LOW_THEME: palette,
      ACCENTS: ['#a67c2e'],
      LOW_ACCENTS: ['#a67c2e'],
      parts,
    },
  });
})();
