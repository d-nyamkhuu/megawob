(function () {
  'use strict';
  const palette = { bg: '#ece8e0', panel: '#f0ece4', fg: '#191b29', muted: '#6b6259', line: '#c4b8aa' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
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
      u.el('span', 'ds-brand', top, 'Contact Book');
      const wb = u.el('span', 'ds-wbtns', top);
      u.el('i', 'mn', wb);
      u.el('i', 'mx', wb);
      u.el('i', 'cl', wb);
      const menu = u.el('nav', 'ds-menu', document.body);
      ['File', 'Edit', 'View', 'Help'].forEach((t) => u.el('span', '', menu, t));
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      const mode = { header: 'left', panel: 'right', toast: 'toast', hidden: 'hidden' }[_c.display];
      const main = u.el('div', 'ds-main ds-mode-' + mode, content);
      let header = content;
      if (mode === 'left' || mode === 'right') {
        header = u.el('aside', 'ds-task-pane', main);
        if (mode === 'right') header.style.order = '2';
        if (mode === 'left') u.el('h2', '', header, 'Task');
        u.el('div', 'ds-sep', main);
      }
      Object.assign(_c, { header, menu, body, content, main });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.menu;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => () => {},
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
      const title = _c.header.querySelector('.ref-panel-title');
      if (title) title.textContent = 'Task';
      const text = _c.header.querySelector('.ref-panel-text');
      if (text) text.classList.add('ds-instruction');
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
      const foot = u.el('footer', 'ds-footer', _c.content);
      const ico = '<svg viewBox="0 0 40 40" stroke="#384356" stroke-width="2"><path d="M11 18C2 1 29-2 26 16l-5 8H13z" fill="#536378"/><ellipse cx="18" cy="14" rx="8" ry="11" fill="#7c8c9f"/><path d="M4 35c0-8 6-12 14-12s13 4 13 12z" fill="#6b9dc6"/></svg>';
      ['New Contact', 'Edit Contact', 'Delete Contact'].forEach((t, i) => {
        const fb = u.el('button', 'ds-fbtn', foot);
        fb.type = 'button';
        fb.tabIndex = -1;
        fb.innerHTML = [
          ico.replace('</svg>', '<path d="M30 21v18M21 30h18" stroke="#427d2d" stroke-width="5"/></svg>').replace(/#5a4636/, '#3d6fa8'),
          '<svg viewBox="0 0 40 40" stroke="#3c424e" stroke-width="2" stroke-linejoin="round"><path d="M5 36l4-12L29 3l7 7-21 21z" fill="#f4c84d"/><path d="M26 6l3-3 7 7-4 4z" fill="#e47b52"/><path d="M5 36l4-12 6 7z" fill="#f3dfb2"/><path d="M5 36l2-5 3 3z" fill="#454d57"/><path d="M13 25L30 8" stroke="#fff3c5"/></svg>',
          '<svg viewBox="0 0 40 40" fill="#d9d4cc" stroke="#5a4636" stroke-width="2.4"><path d="M10 12h20l-2 24H12z" fill="#b4a58e"/><path d="M16 16v16M21 16v16M25 16v16M8 8h24v4H8zM16 8V5h8v3"/></svg>',
        ][i] + '<span style="display:inline">' + t + '</span>';
        fb.dataset.role = 'xtra';
        fb.addEventListener('click', () => env.log('decoy', { label: t }));
        if (i === 2 && !_c.ctx.finish) u.el('div', 'ds-fgap', foot);
      });
      u.el('div', 'ds-fsp', foot);
      base(_c);
      const controls = document.body.querySelector('.ref-foot');
      foot.appendChild(controls);
      const endLink = controls.querySelector('.ref-endlink');
      if (endLink) document.body.querySelector('.ds-top').appendChild(endLink);
      const cb = u.el('button', 'ds-fbtn', foot);
      cb.type = 'button';
      cb.tabIndex = -1;
      cb.innerHTML = '<svg viewBox="0 0 40 40" fill="#d94e35" stroke="#493d3c" stroke-width="2"><path d="M7 12l6-6 8 8 8-8 6 6-8 8 8 8-6 6-8-8-8 8-6-6 8-8z"/></svg><span style="display:inline">Cancel</span>';
      cb.dataset.role = 'xtra';
      cb.addEventListener('click', () => env.log('decoy', { label: 'Cancel' }));
      Object.assign(_c, { foot, cancel: cb });
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.insertBefore(dock, _c.cancel);
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
    name: 'design-find-fact-phone-book-04',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-find-fact-phone-book-04': palette },
      LOW_THEME: palette,
      ACCENTS: ['#d2672a'],
      LOW_ACCENTS: ['#d2672a'],
      parts,
    },
  });
})();
