(function () {
  'use strict';
  const D = {
    site: 'design-use-desktop-tools-terminal-01',
    brand: 'Terminal',
    nav: 'Shell      Edit      View      Window      Help',
    obstruction: null,
  };
  const palette = { bg: '#2461ad', panel: '#ffffff', fg: '#101010', muted: '#5f6a78', line: '#c8cdd5' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.documentElement.style.setProperty('--font', 'Arial,sans-serif');
      document.body.classList.add('perimeter', 'instruction-' + _c.display);
      const shell = u.el('div', 'site-shell', document.body);
      const chrome = u.el('header', 'design-header', shell);
      u.el('div', 'design-brand', chrome, D.brand);
      u.el('nav', 'design-nav', chrome, D.nav);
      const icon = (n) => window.AquaIcon(n);
      const apple = u.el('span', 'apple-icon', chrome);
      apple.innerHTML = icon('apple');
      const vol = u.el('span', 'volume-icon', chrome);
      vol.innerHTML = '<svg viewBox="0 0 24 24"><path d="M3 9h4l5-5v16l-5-5H3z" fill="#344053"/><path d="M15 7q6 5 0 10m3-13q9 8 0 16" fill="none" stroke="#344053" stroke-width="2"/></svg>';
      u.el('span', 'menu-search', chrome);
      u.el('div', 'mbar-r', shell, 'Mon Apr 23   10:24 AM');
      // The note retains its original desktop position in every display mode.
      const noteHome = u.el('section', 'note-home', shell);
      const toolbar = u.el('div', 'desktop-toolbar', shell);
      if (_c.placement === 'header' || _c.placement === 'icon') {
        const sub = u.el('div', 'aw aw-sub', shell);
        sub.innerHTML = '<div class="awt"><i class="tl"></i><i class="tl"></i><i class="tl"></i></div>';
      }
      Object.assign(_c, { shell, header: noteHome, toolbar });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('task-note');
        const noteIcon = _c.util.el('span', 'note-icon', note);
        noteIcon.innerHTML = window.AquaIcon('terminal');
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const shell = _c.shell;
      const body = u.el('div', 'design-body', shell);
      const icon = (n) => window.AquaIcon(n);
      const tl = '<i class="tl"></i><i class="tl"></i><i class="tl"></i>';
      const row = (c, t, s) =>
        '<div class="lrow' + (s ? ' sel' : '') + '"><span class="lic ' + c + '">' +
        icon(c === 'home' ? 'home' : c === 'mac' ? 'computer' : c === 'desktop' ? 'desktop' : 'folder') + '</span>' + t + '</div>';
      const mk = (cls, h) => {
        const d = u.el('div', 'aw ' + cls, shell);
        d.innerHTML = h;
        return d;
      };
      mk('aw-loc', '<div class="awt">' + tl + '</div><div class="lhead">&#9660; Locations</div>' +
        row('home', 'user') + row('mac', 'Applications') + row('fold', 'Documents') + row('fold', 'misc', 1) + row('desktop', 'Desktop'));
      mk('aw-help', '<div class="awt">' + tl + '<b class="srch"></b></div><div class="hh">Help</div><div class="hb">Terminal Basics</div><div class="hl">Working with files<span>&rsaquo;</span></div><div class="hl">File permissions<span>&rsaquo;</span></div><div class="hl">Common commands<span>&rsaquo;</span></div><div class="hl">More help...<span>&rsaquo;</span></div>');
      mk('aw-hint', '<div class="awt">' + tl + '</div><div class="hint"><span class="bulb">' + icon('bulb') + '</span><div><div>Hints</div><div>Use a command like rm to delete a file.</div></div></div>');
      u.el('div', 'trash-i', shell).innerHTML = icon('trash');
      u.el('div', 'trash-l', shell, 'Trash');
      const dock = u.el('div', 'dock', shell);
      for (const c of ['finder', 'safari', 'mail', 'calendar', 'music', 'preview', 'prefs', 'terminal']) {
        u.el('i', 'dk ' + c, dock).innerHTML = icon(c);
      }
      u.el('b', 'dsep', dock);
      u.el('i', 'dk doc', dock).innerHTML = icon('document');
      u.el('i', 'dk can', dock).innerHTML = icon('trash');
      Object.assign(_c, { body });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
      const note = _c.header.querySelector('.ref-panel');
      if (note) {
        note.classList.add('task-note');
        const noteIcon = _c.util.el('span', 'note-icon', note);
        noteIcon.innerHTML = window.AquaIcon('terminal');
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('task-note');
        _c.header.appendChild(note);
        const noteIcon = _c.util.el('span', 'note-icon', note);
        noteIcon.innerHTML = window.AquaIcon('terminal');
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('design-footer');
      _c.shell.appendChild(foot);
      foot.querySelector('.ref-foot-text').textContent = '';
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.shell.appendChild(dock);
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
    name: D.site,
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    scripts: ['assets/icons.js'],
    design: {
      THEMES: { 'design-use-desktop-tools-terminal-01': palette },
      LOW_THEME: palette,
      ACCENTS: ['#1763c8'],
      LOW_ACCENTS: ['#1763c8'],
      parts,
    },
  });
})();
