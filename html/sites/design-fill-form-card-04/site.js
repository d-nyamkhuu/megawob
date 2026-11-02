(function () {
  'use strict';
  const APPLE =
    '<svg viewBox="0 0 24 28" width="22" height="26"><path d="M17 1c0 2-1.5 4-3.800 4.200C13 3 14.800 1 17 1zM12 7c1.200-.8 2.600-1.200 4-.8 1.500.4 2.400 1.200 3 2-2.500 1.500-2.800 5 .2 6.400-1 2.800-3.200 6.400-5.400 6.400-1.200 0-1.400-.8-2.800-.8s-1.700.8-2.800.8C5.800 21 2 15.500 2 11.500 2 7.500 5.200 6 7.500 6.200 9.500 6.400 10.500 7.800 12 7z" fill="#111"/></svg>';
  const FOLDER =
    '<svg viewBox="0 0 80 60" width="100%" height="100%"><path d="M3 10l5-5h22l6 7h39v46H3z" fill="#dedbd0" stroke="#111" stroke-width="2.500" stroke-linejoin="round"/></svg>';
  const TRASH =
    '<svg viewBox="0 0 50 70" width="100%" height="100%"><path d="M4 15l2 50q19 5 38 0l2-50" fill="#ece9de" stroke="#111" stroke-width="2.5"/><path d="M11 22l1 39m6-38v40m7-40v41m7-41v40m7-40-1 38" stroke="#111" stroke-width="2"/><ellipse cx="25" cy="14" rx="23" ry="7" fill="#ece9de" stroke="#111" stroke-width="2.5"/><path d="M6 12q19 8 38 0M19 10V3q6-4 12 0v7" fill="#ece9de" stroke="#111" stroke-width="2"/></svg>';
  const palette = { bg: '#a4a39d', panel: '#f1eee3', fg: '#111', muted: '#444', line: '#111' };
  function fitNote(note) {
    if (note && note.scrollHeight > note.clientHeight + 1) {
      note.classList.remove('ds-brief', 'ds-toast');
      note.classList.add('ds-header-note');
    }
  }
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      const roomy = _c.W >= 1200 && _c.H >= 700;
      _c.display = _c.ctx.display === 'hidden' ? 'hidden' : roomy ? (_c.ctx.display || 'header') : 'header';
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
      document.body.dataset.placement = _c.placement || 'message';
    },
    'frame.header': () => (_c) => {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = _c.util;
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-apple', top).innerHTML = APPLE;
      'File|Edit|Windows|Special|Help'.split('|').forEach((t) => u.el('span', 'ds-mi', top, t));
      u.el('span', 'ds-clock', top, 'Mon Apr 16   9:24 AM');
      const docs = u.el('div', 'ds-icon ds-icon-docs', document.body);
      u.el('div', 'ds-glyph', docs).innerHTML = FOLDER;
      u.el('span', 'ds-cap', docs, 'Documents');
      const trash = u.el('div', 'ds-icon ds-icon-trash', document.body);
      u.el('div', 'ds-glyph', trash).innerHTML = TRASH;
      u.el('span', 'ds-cap', trash, 'Trash');
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      const toolbar = u.el('div', 'ds-footer', content);
      Object.assign(_c, { body, content, toolbar, header: content });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-header-note', 'ds-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
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
        note.querySelector('.ref-panel-text').classList.add('ds-instruction');
        note.querySelector('.ref-panel-title').textContent = 'Task';
        fitNote(note);
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
        fitNote(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      _c.content.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => { base(_c); },
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
    name: 'design-fill-form-card-04',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: { THEMES: { site: palette }, LOW_THEME: palette, ACCENTS: ['#111'], LOW_ACCENTS: ['#111'], parts },
  });
})();
