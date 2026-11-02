(function () {
  'use strict';
  const palette = { bg: '#efeddf', panel: '#e7e4d7', fg: '#11110f', muted: '#33332f', line: '#171715' };

  // Preserve the sheet's typography on the instruction supplied by the template.
  function sheetText(el) {
    if (!el) return;
    el.classList.add('ds-instruction');
    const text = el.textContent;
    const lines = text.split(/(?<=\.)\s+/, 2);
    el.textContent = '';
    const primary = document.createElement('span');
    primary.className = 'ds-instruction-primary';
    primary.textContent = lines[0] || text;
    el.appendChild(primary);
    if (lines[1]) {
      const secondary = document.createElement('span');
      secondary.className = 'ds-instruction-secondary';
      secondary.textContent = lines[1];
      el.appendChild(secondary);
    }
  }

  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original sheet supports its toast strip even on short windows.
      _c.display = _c.ctx.display || 'header';
      if (_c.display === 'panel' && (!_c.roomy || !_c.tall)) _c.display = 'header';
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
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
      u.el('span', 'ds-brand', top, 'Pointer Practice');
      const meta = u.el('div', 'ds-window-meta', top);
      ['−', '□', '×'].forEach((t) => {
        const b = u.el('button', '', meta, t);
        b.type = 'button';
      });
      const menu = u.el('nav', 'ds-menu', document.body);
      ['File', 'Edit', 'Task', 'Help'].forEach((t) => u.el('span', '', menu, t));
      const content = u.el('div', 'ds-content', document.body);
      const header = u.el('div', '', content);
      header.hidden = _c.display !== 'header';
      if (!header.hidden) header.className = 'ds-header-note';
      Object.assign(_c, { top, meta, menu, content, header });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      sheetText(_c.header.querySelector('.ref-instruction'));
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.menu;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'ds-main', _c.content);
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-panel-note');
        const title = panel.querySelector('.ref-panel-title');
        title.classList.add('ds-panel-title');
        title.textContent = 'Task Note';
        sheetText(panel.querySelector('.ref-panel-text'));
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
        sheetText(note.querySelector('.ref-note-text'));
        _c.content.insertBefore(note, _c.body);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      foot.querySelector('.ref-foot-text').textContent = 'Ready';
      _c.content.appendChild(foot);
      // Keep the stationery window's Cancel button using a template control.
      _c.decoyBtn(foot, 'Cancel');
      foot.lastElementChild.classList.add('ds-cancel');
      const end = foot.querySelector('.ref-submit');
      if (end) end.classList.add('ds-submit');
      const link = foot.querySelector('.ref-endlink');
      if (link) {
        link.classList.add('ds-menu-link');
        _c.menu.insertBefore(link, _c.headerTools);
      }
      // Auxiliary controls occupy the title strip, as in the original frame.
      for (const button of document.body.querySelectorAll('.ref-xtra:not(.ds-cancel)')) {
        button.classList.add('ds-pq');
        _c.top.insertBefore(button, _c.meta);
      }
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) {
        _c.top.insertBefore(dock, _c.meta);
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
    name: 'design-act-in-time-chase-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-act-in-time-chase-02': palette },
      LOW_THEME: palette,
      ACCENTS: ['#c9c7bf'],
      LOW_ACCENTS: ['#c9c7bf'],
      parts,
    },
  });
})();
