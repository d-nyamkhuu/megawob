(function () {
  'use strict';
  const palette = { bg: '#faf9f7', panel: '#faf9f7', fg: '#111111', muted: '#66707d', line: '#bbc2c9' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const top = u.el('header', 'ds-top', document.body);
      const mast = u.el('div', 'ds-mast', top);
      u.el('span', 'ds-brand', mast, 'The Daily Chronicle');
      u.el('span', 'ds-tag', mast, 'Local News. A Stronger Community.');
      const tnav = u.el('nav', 'ds-tnav', top);
      ['News', 'Sports', 'Opinion', 'Life', 'Obituaries', 'Classifieds'].forEach((t) => u.el('span', '', tnav, t));
      u.el('span', 'ds-tsep', tnav);
      const sr = u.el('span', 'ds-search', tnav);
      sr.innerHTML = '<svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#c8102e" stroke-width="2.6" stroke-linecap="round"><circle cx="10" cy="10" r="6.5"/><path d="M15 15l6 6"/></svg>';
      const content = u.el('div', 'ds-content', document.body);
      const title = u.el('h1', 'ds-h1', content, 'Create Your Account');
      const noteSlot = u.el('div', 'ds-note-slot', content);
      const lede = u.el('p', 'ds-lede', content);
      lede.append('Create an account to access more of ');
      u.el('em', '', lede, 'The Daily Chronicle');
      lede.append(', including saved articles and personalized settings.');
      Object.assign(_c, { content, header: title, noteSlot });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.noteSlot;
      base(_c);
      _c.header = header;
    },
    'frame.tools': (base) => (_c) => { base(_c); },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'ds-main', _c.content);
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.noteSlot;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.noteSlot.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const u = _c.util;
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.content.appendChild(foot);
      _c.foot = foot;
      const dock = u.el('nav', 'ds-dock', document.body);
      const ic = {
        Home: '<path d="M2 11l10-10 10 10h-1v11h-7v-6h-5v6H2V11z" fill="#fff"/>',
        Sections:
          '<rect x="4" y="3" width="16" height="18" rx="1" fill="none" stroke="#fff" stroke-width="2.4"/><path d="M12 6h5M12 9h5M7 12h10M7 16h10" stroke="#fff" stroke-width="2"/><rect x="7" y="6" width="3" height="4" fill="#fff"/>',
        Saved: '<path d="M6 3h12v18l-6-5-6 5z" fill="none" stroke="#fff" stroke-width="2.4" stroke-linejoin="round"/>',
        Settings:
          '<rect x="10" y="1" width="4" height="6" rx=".8" fill="#f4f4f4" transform="rotate(0 12 12)"/><rect x="10" y="1" width="4" height="6" rx=".8" fill="#f4f4f4" transform="rotate(45 12 12)"/><rect x="10" y="1" width="4" height="6" rx=".8" fill="#f4f4f4" transform="rotate(90 12 12)"/><rect x="10" y="1" width="4" height="6" rx=".8" fill="#f4f4f4" transform="rotate(135 12 12)"/><rect x="10" y="1" width="4" height="6" rx=".8" fill="#f4f4f4" transform="rotate(180 12 12)"/><rect x="10" y="1" width="4" height="6" rx=".8" fill="#f4f4f4" transform="rotate(225 12 12)"/><rect x="10" y="1" width="4" height="6" rx=".8" fill="#f4f4f4" transform="rotate(270 12 12)"/><rect x="10" y="1" width="4" height="6" rx=".8" fill="#f4f4f4" transform="rotate(315 12 12)"/><circle cx="12" cy="12" r="8" fill="#f4f4f4"/><circle cx="12" cy="12" r="4" fill="#292929"/>',
        Help: '<circle cx="12" cy="12" r="10" fill="none" stroke="#fff" stroke-width="2.2"/><path d="M9 9.5a3 3 0 116 0c0 2-3 2-3 4" fill="none" stroke="#fff" stroke-width="2.2"/><circle cx="12" cy="17.5" r="1.3" fill="#fff"/>',
      }
      Object.keys(ic).forEach((t) => {
        const d = u.el('div', 'ds-dk', dock);
        const s = u.el('span', 'ds-dki', d);
        s.innerHTML = '<svg viewBox="0 0 24 24" width="46" height="46">' + ic[t] + '</svg>';
        u.el('span', '', d, t);
      });
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
    name: 'design-type-text-multi-05',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-type-text-multi-05': palette },
      LOW_THEME: palette,
      ACCENTS: ['#d71828'],
      LOW_ACCENTS: ['#d71828'],
      parts,
    },
  });
})();
