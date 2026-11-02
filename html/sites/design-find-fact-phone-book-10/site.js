(function () {
  'use strict';
  const palette = { bg: '#e9eaec', panel: '#f8f9fb', fg: '#1b2336', muted: '#808899', line: '#d6d8dc' };
  function styleControls(parent, top) {
    parent.querySelectorAll('.ref-xtra').forEach((el) => el.classList.add('ds-xtra'));
    parent.querySelectorAll('.ref-submit').forEach((el) => {
      el.classList.add('ds-submit');
      if (top) el.classList.add('ds-top-submit');
    });
    parent.querySelectorAll('.ref-endlink').forEach((el) => el.classList.add('ds-end-link'));
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
    },
    'frame.header': () => (_c) => {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = _c.util;
      const top = u.el('header', 'ds-top', document.body);
      const tl = u.el('span', 'ds-tl', top);
      ['#ff5f57', '#febc2e', '#28c840'].forEach((c) => {
        u.el('i', '', tl).style.background = c;
      });
      u.el('span', 'ds-brand', top, 'Contacts');
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      Object.assign(_c, { top, body, content, header: content });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      if (_c.display === 'header') {
        _c.header = _c.util.el('aside', 'ds-header-note', _c.content);
        _c.util.el('h2', '', _c.header, 'Task');
      }
      base(_c);
      const text = _c.header.querySelector('.ref-instruction');
      if (text) text.classList.add('ds-instruction');
      _c.header = header;
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.top;
      base(_c);
      _c.header = header;
      _c.headerTools.classList.add('ds-chrome-tools');
      styleControls(_c.headerTools, true);
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const main = u.el('div', 'ds-main', _c.content);
      const side = u.el('aside', 'ds-side', _c.body);
      u.el('div', 'ds-sq', side, 'Search Contacts');
      u.el('div', 'ds-sh', side, 'No Contact Selected');
      u.el('div', 'ds-av', side);
      u.el('div', 'ds-sn', side, 'Click a contact to view details.');
      Object.assign(_c, { main, side });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.main;
      base(_c);
      _c.body = body;
      const panel = _c.main.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-brief');
        panel.querySelector('.ref-panel-title').textContent = 'Task';
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
        note.insertBefore(_c.util.el('h2', '', null, 'Task'), note.firstChild);
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        _c.content.insertBefore(note, _c.main);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        foot.classList.add('ds-footer');
        foot.querySelector('.ref-foot-text').hidden = true;
        _c.side.appendChild(foot);
        styleControls(foot, false);
      }
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) {
        const holder = _c.util.el('div', 'ds-footer ds-floating', _c.side);
        holder.appendChild(dock);
        styleControls(dock, false);
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
    name: 'design-find-fact-phone-book-10',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-find-fact-phone-book-10': palette },
      LOW_THEME: palette,
      ACCENTS: ['#2d81f5'],
      LOW_ACCENTS: ['#2d81f5'],
      parts,
    },
  });
})();
