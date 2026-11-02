(function () {
  'use strict';
  const palette = { bg: '#19192b', panel: '#211e35', fg: '#edf0ff', muted: '#abb2d1', line: '#504d6a' };
  function styleControls(parent) {
    parent.querySelectorAll('.ref-submit').forEach((b) => b.classList.add('ds-submit'));
    parent.querySelectorAll('.ref-endlink').forEach((b) => b.classList.add('ds-end-link'));
    parent.querySelectorAll('.ref-xtra').forEach((b) => b.classList.add('ds-xtra'));
  }
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
      u.el('span', 'ds-mark', top, '✳');
      u.el('span', 'ds-brand', top, 'Orion Desk');
      u.el('span', 'ds-window', top, '−　□　×');
      const nav = u.el('nav', 'ds-menu', document.body);
      'File|Edit|View|Tools|Help'.split('|').forEach((t) => u.el('span', '', nav, t));
      const tools = u.el('span', 'ds-menu-tools', nav);
      tools.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="m9 3-1 3-3 1 1 3-3 2 3 2-1 3 3 1 1 3 3-1 3 1 1-3 3-1-1-3 3-2-3-2 1-3-3-1-1-3-3 1Z"/><circle cx="12" cy="12" r="3"/></svg><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><path d="M9 9a3 3 0 0 1 6 0c0 2-3 2-3 5m0 2v1"/></svg>';
      const shell = u.el('div', 'ds-body', document.body);
      const rail = u.el('aside', 'ds-rail', shell);
      '01|02|03|04|05|06|07|08|09|10'.split('|').forEach((t) => u.el('div', '', rail, t));
      const content = u.el('div', 'ds-content', shell);
      content.dataset.display = _c.display;
      content.dataset.finish = String(!!_c.ctx.finish);
      const heading = u.el('div', 'ds-apphead', content);
      u.el('span', 'ds-lock', heading, '♙');
      u.el('strong', '', heading, 'Account Access');
      u.el('span', 'ds-app-brand', heading, 'Orion Desk');
      u.el('div', 'ds-secure-caption', content, 'Secure tools\nfor focused work');
      Object.assign(_c, { content, heading, header: content });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const text = _c.header.querySelector('.ref-instruction');
      if (text) {
        const note = _c.util.el('aside', 'ds-header-note', _c.content);
        note.appendChild(text);
        text.classList.add('ds-instruction');
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.heading;
      base(_c);
      _c.header = header;
      styleControls(_c.headerTools);
      if (_c.submit) _c.submit.classList.add(_c.placement === 'icon' ? 'ds-end-icon' : 'ds-end-header');
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'ds-main', _c.content);
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-brief');
        panel.querySelector('.ref-panel-text').classList.add('ds-instruction');
        panel.querySelector('.ref-panel-title').textContent = 'Instructions';
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('ds-toast');
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        _c.content.insertBefore(note, _c.body);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        foot.classList.add('ds-footer');
        foot.querySelector('.ref-foot-text').textContent = 'Ready';
        _c.content.appendChild(foot);
        styleControls(foot);
      }
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) {
        _c.content.appendChild(dock);
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
    name: 'design-act-in-time-popup-06',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: ['#ff6e70'], LOW_ACCENTS: ['#ff6e70'], parts,
    },
  });
})();
