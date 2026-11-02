(function () {
  'use strict';
  const palette = { bg: '#ece9e1', panel: '#f2f0ea', fg: '#151b29', muted: '#5e6572', line: '#c9c5bb' };

  function styleControls(parent, top) {
    parent.querySelectorAll('.ref-submit').forEach((el) => el.classList.add(top ? 'ds-top-end' : 'ds-submit'));
    parent.querySelectorAll('.ref-endlink').forEach((el) => el.classList.add('ds-end-link'));
    parent.querySelectorAll('.ref-xtra').forEach((el, i) => {
      el.classList.add('ds-xtra');
      if (!top) el.classList.add('ds-btn', i === 0 ? 'ds-clear' : 'ds-cancel');
    });
  }

  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original panel also falls back to the header in short windows.
      if (_c.display === 'panel' && !_c.tall) _c.display = 'header';
    },
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
      u.el('i', 'ds-icon', top);
      u.el('span', 'ds-brand', top, 'Word Match');
      const wb = u.el('span', 'ds-wbtns', top);
      ['_', '□', '×'].forEach((t) => u.el('b', '', wb, t));
      const nav = u.el('nav', 'ds-menu', document.body);
      ['File', 'Edit', 'View', 'Help'].forEach((t) => u.el('span', '', nav, t));
      const outer = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', outer);
      Object.assign(_c, { top, content, header: content });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('ds-header-note');
        const text = _c.util.el('div', 'ds-instruction', note);
        while (note.firstChild !== text) text.appendChild(note.firstChild);
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.top;
      base(_c);
      _c.header = header;
      _c.headerTools.classList.add('ds-top-tools');
      styleControls(_c.headerTools, true);
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
      foot.classList.add('ds-footer');
      if (_c.placement === 'link') foot.classList.add('ds-link-footer');
      _c.content.appendChild(foot);
      styleControls(foot, false);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) {
        _c.foot.classList.add('ds-floating-footer');
        _c.foot.appendChild(dock);
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
    name: 'design-find-fact-similar-08',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-find-fact-similar-08': palette },
      LOW_THEME: palette,
      ACCENTS: ['#000000'],
      LOW_ACCENTS: ['#000000'],
      parts,
    },
  });
})();
