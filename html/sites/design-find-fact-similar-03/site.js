(function () {
  'use strict';
  const palette = { bg: '#76bfdf', panel: '#f3f6fa', fg: '#10264f', muted: '#6a727c', line: '#dfe6ee' };
  const parts = {
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
      u.el('span', 'ds-brand', top, 'Word Match');
      const controls = u.el('span', 'ds-window-controls', top);
      ['Minimize', 'Maximize', 'Close'].forEach((t) => {
        const icon = u.el('i', '', controls);
        icon.title = t;
      });
      const main = u.el('div', 'ds-main');
      const header = _c.display === 'header' ? u.el('aside', 'ds-brief', main) : top;
      Object.assign(_c, { top, main, header });
    },
    'frame.nav': () => (_c) => {
      const nav = _c.util.el('nav', 'ds-menu', document.body);
      'File|Edit|Format|Tools|Window|Help'.split('|').forEach((t) => _c.util.el('span', '', nav, t));
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.top;
      base(_c);
      _c.header = header;
      _c.top.insertBefore(_c.headerTools, _c.top.querySelector('.ds-window-controls'));
      const icon = _c.headerTools.querySelector('.ref-icon');
      if (icon) _c.top.insertBefore(icon, _c.headerTools);
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'ds-body', document.body);
      const rail = u.el('aside', 'ds-rail', body);
      const icons = [
        `<svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg"><path d="M6 2h18l7 8v23H6z" fill="#fff" stroke="#6495be" stroke-width="2"/><path d="M24 2v8h7M10 12h12M10 17h16M10 21h16M10 25h16M10 29h16" fill="none" stroke="#70a1cb" stroke-width="2"/><path d="M9 4h12" stroke="#d7e9fa" stroke-width="2"/></svg>`,
        `<svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="helpGlass" x2="0" y2="1"><stop stop-color="#b5dcf5"/><stop offset=".45" stop-color="#478bc3"/><stop offset=".55" stop-color="#2863a4"/><stop offset="1" stop-color="#88b9dc"/></linearGradient></defs><circle cx="18" cy="18" r="16" fill="url(#helpGlass)" stroke="#8aa6c1"/><text x="18" y="28" text-anchor="middle" fill="white" font-family="Arial" font-size="29" font-weight="bold">?</text></svg>`,
        `<svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="gearGlass" x2="0" y2="1"><stop stop-color="#e6eaef"/><stop offset="1" stop-color="#717d89"/></linearGradient></defs><path d="M14 2h7l1 5 4 2 4-2 4 6-4 4v4l4 3-4 6-5-2-4 2-1 4h-7l-1-5-4-2-4 2-3-6 4-3v-5l-3-3 4-6 5 2 3-2z" fill="url(#gearGlass)" stroke="#64707b" stroke-width="1.5"/><circle cx="18" cy="18" r="6" fill="#fafcfd" stroke="#6b7781" stroke-width="2"/></svg>`,
      ];
      icons.forEach((svg) => { u.el('div', '', rail).innerHTML = svg; });
      const content = u.el('div', 'ds-content', body);
      content.appendChild(_c.main);
      Object.assign(_c, { body, content });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.main;
      base(_c);
      _c.body = body;
      const panel = _c.main.querySelector('.ref-panel');
      if (panel) panel.classList.add('ds-brief', 'ds-panel-note');
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
      const link = foot.querySelector('.ref-endlink');
      if (link) _c.top.insertBefore(link, _c.headerTools);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.top.insertBefore(dock, _c.headerTools);
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
    name: 'design-find-fact-similar-03',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: ['#3a74b3'], LOW_ACCENTS: ['#3a74b3'], parts,
    },
  });
})();
