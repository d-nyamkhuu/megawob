(function () {
  'use strict';
  const palette = { bg: '#f2f0e9', panel: '#faf9f5', fg: '#1c251b', muted: '#66707d', line: '#bbc2c9' };
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
      u.el('span', 'ds-brand', top, 'Willow & Birch');
      u.el('span', '', top, '−    □    ×');
      const content = u.el('div', 'ds-content');
      const main = u.el('div', 'ds-main', content);
      let brief = null;
      if (_c.display === 'header') {
        brief = u.el('aside', 'ds-brief', main);
        brief.style.order = '2';
        u.el('h2', '', brief, 'Instructions');
      }
      Object.assign(_c, { header: top, content, main, brief });
    },
    'frame.nav': () => (_c) => {
      const nav = _c.util.el('nav', 'ds-menu', document.body);
      _c.util.el('span', '', nav, 'ACCOUNT');
    },
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      if (_c.brief) _c.header = _c.brief;
      base(_c);
      _c.header = header;
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
      _c.headerTools.classList.add('ds-top-tools');
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'ds-body', document.body);
      const rail = u.el('aside', 'ds-rail', body);
      'Personal Info|Security|Preferences|Notifications|Billing|Help|Sign out'.split('|').forEach((t) => u.el('div', '', rail, t));
      body.appendChild(_c.content);
      _c.body = _c.main;
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.main.querySelector('.ref-panel');
      if (panel) panel.classList.add('ds-brief');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.main);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-toast');
        _c.content.insertBefore(note, _c.main);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      foot.querySelector('.ref-foot-text').textContent = 'Ready';
      _c.content.appendChild(foot);
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
    name: 'design-type-text-multi-01',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#454b32'],
      LOW_ACCENTS: ['#454b32'],
      TITLES: ['Willow & Birch'],
      parts,
    },
  });
})();
