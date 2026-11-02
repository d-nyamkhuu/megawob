(function () {
  'use strict';
  const C = {
    'site': 'design-find-fact-table-05',
    'brand': 'World Scientists Archive',
    'nav': 'Explore|Learn|Discover',
    'tabs': 'Scientists|Research Areas|Timelines|Publications',
    'foot': ['Help', 'Settings', 'Exit'],
    'instruction': 'top',
    'briefTitle': 'Instructions',
  };
  const NS = 'http://www.w3.org/2000/svg';
  function svg(parent, html, cls) {
    const s = document.createElementNS(NS, 'svg');
    s.setAttribute('viewBox', '0 0 100 100');
    if (cls) s.setAttribute('class', cls);
    s.innerHTML = html;
    parent.appendChild(s);
    return s;
  }
  const GLOBE =
    '<defs><radialGradient id="gg" cx=".3" cy=".28" r=".8"><stop stop-color="#297bb0"/><stop offset=".65" stop-color="#124d7c"/><stop offset="1" stop-color="#031b2d"/></radialGradient><radialGradient id="gs" cx=".3" cy=".25" r=".8"><stop stop-color="#eedc8c" stop-opacity=".35"/><stop offset=".55" stop-color="#132f21" stop-opacity="0"/><stop offset="1" stop-color="#00111b" stop-opacity=".8"/></radialGradient></defs><circle cx="50" cy="50" r="48" fill="#061e39" stroke="#e3b850" stroke-width="2"/><circle cx="50" cy="50" r="44" fill="url(#gg)" stroke="#72a8aa" stroke-width=".5"/><g fill="#939d4d" stroke="#c0b66a" stroke-width=".45"><path d="M21 19 30 13 42 10 49 13 45 18 50 22 45 25 41 22 36 25 37 29 45 29 49 34 45 38 39 36 35 41 30 43 29 48 34 52 39 52 42 57 39 60 33 55 31 51 25 50 22 43 18 40 16 33 20 29 17 26Z"/><path d="m43 11 10-3 10 4-6 5-5 9-5-4 2-7Z"/><path d="m42 58 7-3 8 5 12 2 6 7-6 6-4 7-6 7-4 6-4-5 1-9-4-8-1-6-5-4Z"/><path d="m63 17 7 1 8 8-2 5 6 5 4 10-4 5-6-4-2-10-6-4-2-6-6-4Z"/><path d="m40 44 6 3 3-1 3 4-5 1-4-2Z"/></g><g fill="none" stroke="#aac8a1" opacity=".2" stroke-width=".55"><ellipse cx="50" cy="50" rx="24" ry="44"/><path d="M10 35Q50 48 90 35M7 58Q50 70 93 58M21 18Q50 30 79 18"/></g><circle cx="50" cy="50" r="44" fill="url(#gs)"/>';
  const DISC =
    '<defs><linearGradient id="cd" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#d5c78a"/><stop offset=".2" stop-color="#9ed0cd"/><stop offset=".38" stop-color="#eee5be"/><stop offset=".5" stop-color="#777f9c"/><stop offset=".65" stop-color="#e2ca81"/><stop offset=".8" stop-color="#91c6ce"/><stop offset="1" stop-color="#f8edc5"/></linearGradient></defs><circle cx="50" cy="50" r="47" fill="url(#cd)" stroke="#061e32" stroke-width="2"/><circle cx="50" cy="50" r="44" fill="none" stroke="#f4e5b4" stroke-width="1"/><path d="M48 36 22 12M61 45 87 26M53 64 74 90M38 55 12 74" stroke="#fff" opacity=".4" stroke-width="7"/><circle cx="50" cy="50" r="16" fill="#889b99" stroke="#e4d8ab" stroke-width="2"/><circle cx="50" cy="50" r="10" fill="#0b2545" stroke="#f5e3b0" stroke-width="2"/>';
  const palette = { bg: '#10306a', panel: '#f2e7cd', fg: '#080d2c', muted: '#5a5342', line: '#9a9078' };
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
      svg(top, GLOBE, 'ds-globe');
      u.el('span', 'ds-brand', top, C.brand);
      const nav = u.el('nav', 'ds-nav', top);
      C.nav.split('|').forEach((t, i) => {
        if (i) u.el('b', '', nav, '•');
        u.el('span', '', nav, t);
      });
      const content = u.el('div', 'ds-content', document.body);
      Object.assign(_c, { contentEl: content, header: content });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-header-note', 'ds-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const tabs = _c.util.el('div', 'ds-tabs', _c.contentEl);
      C.tabs.split('|').forEach((t, i) => _c.util.el('span', i ? 'ds-tab' : 'ds-tab on', tabs, t));
      const header = _c.header;
      _c.header = tabs;
      base(_c);
      _c.header = header;
      _c.headerTools.classList.add('ds-tab-tools');
      _c.tabs = tabs;
    },
    'frame.body': () => (_c) => {
      const sheet = _c.util.el('div', 'ds-sheet', _c.contentEl);
      const body = _c.util.el('div', 'ds-main', sheet);
      Object.assign(_c, { sheet, body });
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) panel.classList.add('ds-brief');
      _c.body.classList.remove('ref-panel-right');
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
        _c.contentEl.insertBefore(note, _c.tabs);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      const text = foot.querySelector('.ref-foot-text');
      text.className = 'ref-foot-text ds-foot-name';
      text.textContent = '';
      _c.util.el('div', '', text, C.brand);
      _c.util.el('div', '', text, 'CD-ROM Companion');
      const disc = svg(foot, DISC, 'ds-disc');
      foot.insertBefore(disc, text);
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
    name: C.site,
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: ['#16407a'], LOW_ACCENTS: ['#16407a'], parts,
    },
  });
})();
