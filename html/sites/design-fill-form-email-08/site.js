(function () {
  'use strict';
  const palette = { bg: '#cacccd', panel: '#cacccd', fg: '#080a0c', muted: '#66707d', line: '#8a8f96' };
  function styleControls(parent) {
    parent.querySelectorAll('.ref-submit').forEach((el) => el.classList.add('ds-submit'));
    parent.querySelectorAll('.ref-xtra').forEach((el) => el.classList.add('ds-xtra'));
    parent.querySelectorAll('.ref-endlink').forEach((el) => el.classList.add('ds-endlink'));
  }
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
      u.el('span', 'ds-brand', top, 'Sun');
      u.el('span', 'ds-title', top, 'Message Entry Task');
      const wc = u.el('span', 'ds-wc', top);
      ['−', '□', '×'].forEach((t) => u.el('span', 'ds-window-button', wc, t));
      const content = u.el('div', 'ds-content');
      const header = u.el('div', _c.display === 'header' ? 'ds-header-note' : 'ds-note-slot', content);
      header.hidden = _c.display !== 'header';
      Object.assign(_c, { contentBox: content, header });
    },
    'frame.nav': () => (_c) => {
      const menu = _c.util.el('nav', 'ds-menu', document.body);
      'File|Edit|Options|Help'.split('|').forEach((t) => _c.util.el('span', '', menu, t));
      _c.menu = menu;
    },
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('ds-instruction');
        _c.util.el('div', 'ds-helpbtn', _c.header, 'Help');
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.menu;
      base(_c);
      _c.header = header;
      styleControls(_c.headerTools);
    },
    'frame.body': () => (_c) => {
      const outer = _c.util.el('div', 'ds-body', document.body);
      outer.appendChild(_c.contentBox);
      const body = _c.util.el('div', 'ds-main', _c.contentBox);
      Object.assign(_c, { body });
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-brief');
        panel.querySelector('.ref-panel-text').classList.add('ds-instruction');
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
        _c.contentBox.insertBefore(note, _c.body);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      foot.querySelector('.ref-foot-text').textContent = 'Ready';
      _c.contentBox.appendChild(foot);
      styleControls(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) {
        dock.classList.add('ds-float-dock');
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
    name: 'design-fill-form-email-08',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#89afd0'],
      LOW_ACCENTS: ['#89afd0'],
      parts,
    },
  });
})();
