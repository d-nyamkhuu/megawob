(function () {
  'use strict';
  const ICONS = {
    Home: '<path d="M4 11l8-7 8 7M6 10v10h4v-6h4v6h4V10"/>',
    Lookup: '<path d="M6 3h8l4 4v14H6zM14 3v4h4M9 12h6M9 16h6"/>',
    Notes: '<path d="M5 4h14v12l-4 4H5zM15 20v-4h4M8 9h8M8 13h5"/>',
    Calculator: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M5 8h14M8 11v6M6 14h4M13 12h3M13 15h3M13 18h3M7 19l3-3"/>',
    Settings: '<path d="M9.5 3h5l.6 3 2 .9 2.7-1 2.3 4-2.2 2.1v2l2.2 2.1-2.3 4-2.7-1-2 .9-.6 3h-5l-.6-3-2-.9-2.7 1-2.3-4L4.1 14v-2L1.9 9.9l2.3-4 2.7 1 2-.9z" transform="translate(1 0) scale(.88)"/><circle cx="11.6" cy="11.5" r="3.3"/>',
  };
  const palette = { bg: '#faf8f6', panel: '#fcfaf9', fg: '#152033', muted: '#5d5d5d', line: '#e4e5e8' };
  function styleControls(parent) {
    parent.querySelectorAll('.ref-submit').forEach((b) => b.classList.add('ds-submit'));
    parent.querySelectorAll('.ref-endlink').forEach((b) => b.classList.add('ds-submit', 'ds-submit-link'));
    parent.querySelectorAll('.ref-xtra').forEach((b) => b.classList.add('ds-xtra'));
  }
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
      if (_c.display === 'panel' && _c.W <= 1200) _c.display = 'header';
      document.body.classList.remove('ref-has-note');
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
      logo.innerHTML = '<svg viewBox="0 0 20 20" width="20" height="20"><rect width="20" height="20" rx="4" fill="#1b6fd8"/><path d="M6 14V9a4 4 0 018 0v5M10 7v7" stroke="#fff" stroke-width="1.5" fill="none"/></svg>';
      u.el('span', 'ds-brand', top, 'Research Assistant');
      const wc = u.el('div', 'ds-wctl', top);
      wc.innerHTML = '<svg viewBox="0 0 12 12"><path d="M1 6h10"/></svg><svg viewBox="0 0 12 12"><rect x="1.5" y="1.5" width="9" height="9" rx="1.5"/></svg><svg viewBox="0 0 12 12"><path d="M1 1l10 10M11 1L1 11"/></svg>';
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      const note = u.el('div', '', content);
      if (_c.display === 'header') note.className = 'ds-header-note' + (_c.ctx.display === 'panel' ? ' ds-panel-note' : '');
      const actions = u.el('div', 'ds-actions', document.body);
      Object.assign(_c, { body, content, header: note, actions });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const text = _c.header.querySelector('.ref-instruction');
      if (text) {
        text.classList.add('ds-instruction');
        _c.util.el('div', 'ds-sub', _c.header, 'Use the table below to find the correct values. Each field on the right corresponds to one item in the table.');
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.actions;
      base(_c);
      _c.header = header;
      styleControls(_c.headerTools);
    },
    'frame.body': () => (_c) => {
      _c.main = _c.util.el('div', 'ds-main', _c.content);
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.main;
      base(_c);
      _c.body = body;
      const panel = _c.main.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-brief');
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
        _c.content.insertBefore(note, _c.main);
      }
    },
    'frame.footer': (base) => (_c) => {
      const u = _c.util;
      const dock = u.el('footer', 'ds-dock', document.body);
      const nav = u.el('nav', 'ds-nav', dock);
      ['Home', 'Lookup', 'Notes', 'Calculator', 'Settings'].forEach((t) => {
        const it = u.el('div', 'ds-navitem' + (t === 'Lookup' ? ' on' : ''), nav);
        const ic = u.el('span', 'ds-ico', it);
        ic.innerHTML = '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round">' + ICONS[t] + '</svg>';
        u.el('span', '', it, t);
      });
      const end = u.el('div', 'ds-dockend', dock);
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      end.appendChild(foot);
      styleControls(foot);
      const clk = u.el('div', 'ds-clock', end);
      u.el('div', '', clk, '10:24 AM');
      u.el('div', '', clk, 'Apr 28, 2021');
      Object.assign(_c, { dockEnd: end, clock: clk });
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) {
        _c.dockEnd.insertBefore(dock, _c.clock);
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
    name: 'design-find-fact-table-08',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-find-fact-table-08': palette },
      LOW_THEME: palette,
      ACCENTS: ['#1565d8'],
      LOW_ACCENTS: ['#1565d8'],
      parts,
    },
  });
})();
