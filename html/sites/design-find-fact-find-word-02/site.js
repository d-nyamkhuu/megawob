(function () {
  'use strict';
  const palette = { bg: '#f7f6f2', panel: '#f7f6f2', fg: '#000', muted: '#66707d', line: '#000' };
  const parts = {
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
      const shell = u.el('div', 'ds-body', document.body);
      const rail = u.el('aside', 'ds-rail', shell);
      [1, 2, 3, 4, 5, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].forEach((n) =>
        u.el('div', n === 13 ? 'on' : '', rail, String(n)),
      );
      const content = u.el('div', 'ds-content', shell);
      const header = u.el('header', 'ds-top', content);
      u.el('span', 'ds-brand', header, 'Text Finder');
      u.el('span', 'ds-steps', header, 'LOOK  /  READ  /  ANSWER');
      const mode = { header: 'top', panel: 'left', toast: 'toast', hidden: 'hidden' }[_c.display];
      shell.classList.add('ds-mode-' + mode);
      if (_c.placement === 'header' || _c.placement === 'icon') shell.classList.add('ds-end-header');
      if (_c.ctx.finish) shell.classList.add('ds-finish');
      Object.assign(_c, { shell, contentBox: content, header });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.contentBox;
      base(_c);
      _c.header = header;
      const note = _c.contentBox.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-header-note', 'ds-instruction');
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
      _c.headerTools.classList.add('ds-top-tools');
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'ds-main', _c.contentBox);
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
      if (foot) {
        foot.classList.add('ds-footer');
        _c.contentBox.appendChild(foot);
        // Auxiliary buttons share the title bar, as in the original frame.
        foot.querySelectorAll('.ref-xtra').forEach((button) => _c.headerTools.appendChild(button));
      }
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.contentBox.appendChild(dock);
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
    name: 'design-find-fact-find-word-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#ffe43d'],
      LOW_ACCENTS: ['#ffe43d'],
      parts,
    },
  });
})();
