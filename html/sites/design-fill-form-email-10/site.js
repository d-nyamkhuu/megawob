(function () {
  'use strict';
  const palette = { bg: '#effaff', panel: '#ffffff', fg: '#101d45', muted: '#53637e', line: '#bbc2c9' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
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
      const globe = u.el('span', 'ds-globe', top);
      globe.innerHTML = `<svg viewBox="0 0 64 64"><defs><radialGradient id="ocean" cx=".32" cy=".2" r=".8"><stop stop-color="#d2f6ff"/><stop offset=".45" stop-color="#44bce9"/><stop offset=".8" stop-color="#1887c1"/><stop offset="1" stop-color="#036583"/></radialGradient><radialGradient id="land" cx=".25" cy=".15" r=".95"><stop stop-color="#c2ed83"/><stop offset="1" stop-color="#50c663"/></radialGradient><linearGradient id="earthShine" x2="0" y2="1"><stop stop-color="#fff" stop-opacity=".75"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs><circle cx="32" cy="32" r="30" fill="url(#ocean)" stroke="#268991" stroke-width="1.5"/><path d="M9 17Q11 9 20 7L24 8Q27 10 30 10L27 15L20 17Q18 17 18 21L21 24Q22 27 18 28L14 27Q9 25 9 17ZM24 30Q30 31 33 35L34 40L30 44Q29 48 27 50L26 55L23 57Q21 52 22 47L19 43Q17 39 19 35Z M39 5Q48 7 52 13L53 18L48 22Q46 24 49 26L53 29L54 33Q52 35 49 34L45 32L40 30L40 25L34 23L35 19L39 16L35 12Z M40 35Q45 34 47 38L46 44L42 50Q39 47 38 42Z" fill="url(#land)" stroke="#55b87d" stroke-width=".6"/><ellipse cx="27" cy="17" rx="22" ry="13" fill="url(#earthShine)" transform="rotate(-20 27 17)"/></svg>`;
      const bt = u.el('span', 'ds-brand', top);
      u.el('b', '', bt, 'Data Entry');
      u.el('i', '', bt, 'Customer Information');
      const links = u.el('span', 'ds-links', top);
      ['Help', 'Settings', 'Sign Out'].forEach((t) => {
        const a = u.el('a', '', links, t);
        a.addEventListener('click', () => env.log('decoy', { label: t }));
      });
      const sr = u.el('span', 'ds-search', top);
      u.el('span', 'ds-mag', sr);
      u.el('span', '', sr, 'Search...');
      const body = u.el('div', 'ds-body', document.body);
      const rail = u.el('aside', 'ds-rail', body);
      for (let i = 1; i <= 10; i++) u.el('div', i === 1 ? 'on' : '', rail, String(i));
      const content = u.el('div', 'ds-content', body);
      Object.assign(_c, { top, body, content, header: content });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('ds-header-note');
        _c.util.el('span', 'ds-info', note, 'i');
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.top;
      base(_c);
      _c.header = header;
      _c.headerTools.classList.add('ds-episode-tools');
    },
    'frame.body': () => (_c) => {
      _c.main = _c.util.el('div', 'ds-main', _c.content);
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.main;
      base(_c);
      _c.body = body;
      const note = _c.main.querySelector('.ref-panel');
      if (note) {
        note.classList.add('ds-brief');
        _c.util.el('span', 'ds-info', note, 'i');
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
        _c.content.insertBefore(note, _c.main);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.content.appendChild(foot);
      foot.querySelector('.ref-foot-text').textContent = '';
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
    name: 'design-fill-form-email-10',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-fill-form-email-10': palette },
      LOW_THEME: palette,
      ACCENTS: ['#3883ec'],
      LOW_ACCENTS: ['#3883ec'],
      parts,
    },
  });
})();
