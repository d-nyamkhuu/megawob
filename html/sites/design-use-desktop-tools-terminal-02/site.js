(function () {
  'use strict';
  const D = {
    obstruction: ['BeOS Newsletter', 'Be the first to know. Get news, tips and updates from the BeOS team.', 'Close'],
  };
  const palette = { bg: '#285184', panel: '#ccccd2', fg: '#0a1038', muted: '#5f6a78', line: '#c8cdd5' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original uses the same task card for every instruction display.
      _c.display = _c.ctx.display || 'header';
      document.body.className = 'web2m web2 instruction-' + _c.display;
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const shell = u.el('div', 'site-shell', document.body);
      const chrome = u.el('header', 'design-header', shell);
      const hr = u.el('div', 'w2-top', chrome);
      const logo = u.el('span', 'w2-logo', hr);
      logo.innerHTML =
        '<svg viewBox="0 0 44 40" width="44" height="40"><defs><linearGradient id="folder-gloss" x2="0" y2="1"><stop stop-color="#e4f5ff"/><stop offset="1" stop-color="#56a9f4"/></linearGradient></defs><path d="M3 10 5 4h13l4 4h14l3 5v22H3Z" fill="#c4e4ff" stroke="#78afe5" stroke-width="1.5"/><path d="M6 13 10 7h27l3 6" fill="#e8f5ff" stroke="#78afe5" stroke-width="1.5"/><path d="M3 13h39l-3 23H2Z" fill="url(#folder-gloss)" stroke="#5596d9" stroke-width="1.5"/></svg>';
      u.el('span', 'w2-brand', hr, 'Codercise');
      u.el('span', 'w2-crumb', hr, 'Practice  >  Terminal Skills  >  File Management');
      const lk = u.el('span', 'w2-links', hr);
      ['Help', 'Settings', 'Sign Out'].forEach((t) => u.el('a', '', lk, t));
      const tabs = u.el('div', 'w2-tabs', chrome);
      ['Tasks', 'Terminal', 'Notes', 'Resources'].forEach((t, i) => u.el('span', i ? '' : 'on', tabs, t));
      const body = u.el('div', 'design-body', shell);
      const note = u.el('section', 'task-note', body);
      note.hidden = _c.display === 'hidden';
      if (!note.hidden && _c.display !== 'toast') {
        const ar = u.el('span', 'w2-arrow', note);
        ar.innerHTML =
          '<svg viewBox="0 0 40 40" width="100%" height="100%"><defs><linearGradient id="arrow-gloss" x2="0" y2="1"><stop stop-color="#8bb9e5"/><stop offset="1" stop-color="#3979b9"/></linearGradient></defs><circle cx="20" cy="20" r="19" fill="url(#arrow-gloss)" stroke="#5c94ca"/><path d="M9 20h19M20 11l9 9-9 9" stroke="#fff" stroke-width="4" fill="none"/></svg>';
      }
      const copy = u.el('div', 'w2-note-copy', note);
      Object.assign(_c, { shell, tabs, body, note, header: copy });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.tabs;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => () => {},
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
      if (_c.display === 'header' || _c.display === 'panel') {
        _c.util.el('div', 'w2-note-detail', _c.header,
          'The terminal is already open in your workspace. The available files are listed below.');
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.header.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      const u = _c.util;
      const footer = u.el('footer', 'design-footer', _c.shell);
      const dock = u.el('div', 'w2-dock', footer);
      [
        ['Common Commands', ['ls', 'cd', 'pwd', 'rm', 'mkdir', 'cat', 'mv', 'cp']],
        ['Insertion Snippets', ['~/games', '*.html', 'rm <file>', 'ls -l', 'cd ..']],
      ].forEach(([h, bs]) => {
        const g = u.el('div', 'w2-grp', dock);
        u.el('h4', '', g, h);
        const r = u.el('div', 'w2-btns', g);
        bs.forEach((b) => u.el('span', 'w2-chip', r, b));
      });
      const kb = u.el('div', 'w2-grp w2-kb', dock);
      u.el('h4', '', kb, 'Keyboard Help');
      [
        ['↑↓', 'Scroll command history'],
        ['Tab', 'Auto-complete'],
        ['Ctrl + C', 'Cancel current command'],
      ].forEach(([a, b]) => {
        const r = u.el('div', '', kb);
        u.el('b', '', r, a);
        u.el('span', '', r, b);
      });
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      footer.appendChild(foot);
      Object.assign(_c, { footer, foot });
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.footer.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const named = D.obstruction;
      const texts = {
        cookie: ['We use cookies', 'We use optional cookies to improve your experience.', 'Reject optional'],
        toast: ['Notification', 'Your workspace is up to date.', 'Dismiss'],
        chat: ['Help', 'Need help with this workspace?', 'Close'],
        promo: ['News and updates', 'Discover the latest workspace updates.', 'Close'],
        banner: ['Announcement', 'You can still work now. Save your changes regularly.', 'Collapse announcement'],
      };
      let [title, copy, label] = texts[ctx.kind];
      if (named && ['promo', 'toast', 'banner', 'cookie'].includes(ctx.kind)) {
        [title, copy, label] = named;
      }
      const el = u.el('section', 'reference-overlay ' + ctx.kind, document.body);
      el.setAttribute('role', 'dialog');
      el.setAttribute('aria-label', title);
      u.el('h2', '', el, title);
      u.el('div', 'overlay-copy', el, copy);
      const actions = u.el('div', 'overlay-actions', el);
      if (ctx.kind === 'cookie') {
        const accept = u.el('button', '', actions, 'Accept all');
        accept.addEventListener('click', () => ctx.dismiss());
      }
      if (/Tip/.test(title)) {
        const c = u.el('label', '', el);
        c.style.cssText = 'display:block;padding:0 22px 14px';
        const ch = u.el('input', '', c);
        ch.type = 'checkbox';
        c.append(' Do not show again');
      }
      const dismiss = u.el('button', 'primary', actions, label);
      dismiss.type = 'button';
      dismiss.addEventListener('click', () => ctx.dismiss());
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-use-desktop-tools-terminal-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#f5da48'],
      LOW_ACCENTS: ['#f5da48'],
      parts,
    },
  });
})();
