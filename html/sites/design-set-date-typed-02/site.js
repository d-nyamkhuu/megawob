(function () {
  'use strict';
  const ICON =
    '<svg viewBox="0 0 40 52" width="100%" height="100%"><path d="M3 6h27l10 9v35H3z" fill="#fff" stroke="#000" stroke-width="2.5"/><path d="M30 6v9h10M9 2v7M16 2v7M23 2v7" fill="none" stroke="#000" stroke-width="2.5"/><path d="M9 18h3m3 0h18M9 24h3m3 0h18M9 30h3m3 0h18M9 36h3m3 0h18M9 42h24" stroke="#000" stroke-width="2.2"/></svg>';
  const APPLE =
    '<svg viewBox="0 0 24 28" width="18" height="21"><path d="M17.5 14.7c0-3 2.5-4.4 2.6-4.5-1.4-2.1-3.6-2.3-4.4-2.4-1.9-.2-3.6 1.1-4.600 1.100-1 0-2.400-1.100-4-1C5 7.900 3.200 9.100 2.200 10.900c-2.100 3.700-.5 9.100 1.500 12.100 1 1.400 2.200 3.100 3.700 3 1.500-.1 2.100-1 3.900-1s2.300 1 3.900.9c1.600 0 2.600-1.500 3.600-2.900 1.100-1.700 1.600-3.300 1.600-3.400-.1 0-3.100-1.200-3.100-4.800zM14.500 5.800c.8-1 1.400-2.400 1.200-3.800-1.200.1-2.700.8-3.500 1.800-.8.900-1.400 2.300-1.300 3.700 1.300.1 2.700-.7 3.600-1.700z"/></svg>';
  function styleControls(parent) {
    parent.querySelectorAll('.ref-submit').forEach((b) => b.classList.add('ds-btn', 'ds-submit'));
    parent.querySelectorAll('.ref-xtra').forEach((b) => b.classList.add('ds-xtra'));
    parent.querySelectorAll('.ref-endlink').forEach((b) => b.classList.add('ds-endlink'));
  }
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original uses a compact in-content note for every display mode.
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
      const nav = u.el('nav', 'ds-menu', document.body);
      u.el('span', 'ds-apple', nav).innerHTML = APPLE;
      'File|Edit|View|Special|Help'.split('|').forEach((t) => u.el('span', '', nav, t));
      const win = u.el('div', 'ds-win', document.body);
      const top = u.el('header', 'ds-top', win);
      u.el('span', 'ds-box', top);
      u.el('span', 'ds-title', top, 'Schedule Appointment');
      u.el('span', 'ds-box', top);
      const head = u.el('div', 'ds-head', win);
      u.el('span', 'ds-icon', head).innerHTML = ICON;
      const ht = u.el('div', 'ds-headtext', head);
      u.el('div', 'ds-h1', ht, 'Patient Appointment');
      u.el('div', 'ds-h2', ht, 'Riverside Medical Clinic');
      u.el('div', 'ds-headdate', head, 'Mon Sep 14, 1987');
      const content = u.el('div', 'ds-content', win);
      Object.assign(_c, { win, top, content, header: content });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-header-note', 'ds-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const h = _c.header;
      _c.header = _c.top;
      base(_c);
      _c.header = h;
      _c.headerTools.classList.add('ds-head-actions');
      styleControls(_c.headerTools);
      if (_c.submit) _c.submit.classList.add('ds-head-submit');
    },
    'frame.body': () => (_c) => { _c.body = _c.content; },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.content.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-episode-panel');
        panel.querySelector('.ref-panel-title').classList.add('ds-panel-title');
        panel.querySelector('.ref-panel-text').classList.add('ds-instruction');
      }
    },
    'frame.stage': () => (_c) => {
      const main = _c.util.el('div', 'ds-main', _c.content);
      _c.stage = _c.util.el('main', 'ds-stage', main);
      _c.main = main;
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('ds-toast');
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        _c.content.insertBefore(note, _c.main);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.content.appendChild(foot);
      styleControls(foot);
      _c.foot = foot;
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
  const palette = { bg: '#fff', panel: '#fff', fg: '#000', muted: '#000', line: '#000' };
  env.site({
    name: 'design-set-date-typed-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-set-date-typed-02': palette },
      LOW_THEME: palette,
      ACCENTS: ['#000'],
      LOW_ACCENTS: ['#000'],
      parts,
    },
  });
})();
