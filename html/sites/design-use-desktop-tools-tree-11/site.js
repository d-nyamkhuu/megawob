(function () {
  'use strict';
  const palette = { bg: '#ffffff', panel: '#ffffff', fg: '#000000', muted: '#5f6a78', line: '#c8cdd5' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original desktop provides a note location in every viewport.
      _c.display = _c.ctx.display || 'header';
      document.body.className = 'top instruction-' + _c.display;
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
      const toolbar = u.el('header', 'design-header', shell);
      const brand = u.el('div', 'design-brand', toolbar);
      brand.innerHTML =
        '<svg viewBox="0 0 24 24" width="30" height="30" aria-hidden="true"><path d="M12 7C9 4 4 4 2 9C-1 15 4 23 8 24L12 22L15 24C19 24 22 18 23 15C18 14 17 9 22 7C18 3 15 4 12 7ZM12 5C12 2 15 0 18 0C18 3 15 5 12 5Z" fill="#000"/></svg>';
      u.el('nav', 'design-nav', toolbar, 'File    Edit    View    Special    Help');
      const clock = u.el('span', 'mac-clock', toolbar);
      clock.innerHTML =
        '10:24 AM <svg viewBox="0 0 20 20" width="34" height="34" style="margin:0 30px 0 38px;vertical-align:middle"><rect x="1.5" y="1.5" width="17" height="17" rx="3" fill="#fff" stroke="#000" stroke-width="2"/><text x="10" y="15" font-size="14" font-weight="700" text-anchor="middle" font-family="monospace">?</text></svg><svg viewBox="0 0 20 20" width="34" height="34" style="vertical-align:middle"><path d="M4 1h12l2 3v7h1v7H1v-7h1V4z" fill="white" stroke="black" stroke-width="2"/><path d="M5 4h10v6H5zM3 13h14v3H3z" fill="black"/><path d="M7 5h2v2h3v2H7zM5 14h10" fill="white" stroke="white"/></svg>';
      const bitmap = u.el('svg', 'bitmap-defs', toolbar);
      bitmap.outerHTML =
        '<svg class="bitmap-defs" xmlns="http://www.w3.org/2000/svg"><defs><filter id="bitmap-ink" x="-5%" y="-5%" width="110%" height="110%"><feComponentTransfer><feFuncA type="discrete" tableValues="0 1"/></feComponentTransfer></filter></defs></svg>';
      // The header note belongs above the Finder, rather than in the menu bar.
      const header = u.el('div', 'mac-note-slot');
      header.hidden = _c.display === 'hidden';
      Object.assign(_c, { shell, toolbar, clock, header });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('task-note');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
      _c.toolbar.insertBefore(_c.headerTools, _c.clock);
      for (const b of _c.headerTools.querySelectorAll('.ref-submit')) b.classList.add('end-control', 'mac-end-header');
      for (const b of _c.headerTools.querySelectorAll('.ref-xtra')) b.classList.add('mac-xtra');
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'design-body', _c.shell);
      _c.body.appendChild(_c.header);
    },
    'frame.panel': (base) => (_c) => {
      base({ ..._c, body: _c.header });
      const panel = _c.header.querySelector('.ref-panel');
      if (panel) panel.classList.add('task-note');
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
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('design-footer');
      _c.shell.appendChild(foot);
      foot.querySelector('.ref-foot-text').remove();
      const fl = _c.util.el('span', 'footer-label', null, 'Current Location:');
      fl.insertAdjacentHTML('afterbegin', '<svg viewBox="0 0 28 36" aria-hidden="true"><path d="M2 2h16l8 8v24H2zM18 2v9h8M7 16h14M7 21h14M7 26h14" fill="white" stroke="black" stroke-width="2"/></svg>');
      const location = _c.util.el('div', 'current-location', null, 'Macintosh HD ▸ Projects');
      foot.prepend(fl, location);
      for (const b of foot.querySelectorAll('.ref-submit')) b.classList.add('end-control');
      for (const b of foot.querySelectorAll('.ref-endlink')) b.classList.add('mac-end-link');
      for (const b of foot.querySelectorAll('.ref-xtra')) b.classList.add('mac-xtra');
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) {
        _c.foot.appendChild(dock);
        dock.querySelector('.ref-float').classList.add('end-control');
      }
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const named = [
        'Tip of the Day',
        'You can expand and collapse folders by clicking the triangles next to the folder icons.',
        'Close',
      ];
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
      if (/Tip/.test(title)) el.classList.add('tip-window');
      el.setAttribute('role', 'dialog');
      el.setAttribute('aria-label', title);
      const heading = u.el('h2', '', el);
      u.el('span', 'window-caption', heading, title);
      u.el('div', 'overlay-copy', el, copy);
      const actions = u.el('div', 'overlay-actions', el);
      if (ctx.kind === 'cookie') {
        const accept = u.el('button', '', actions, 'Accept all');
        accept.addEventListener('click', () => ctx.dismiss());
      }
      if (/Tip/.test(title)) {
        const c = u.el('label', '', el);
        c.className = 'tip-checkbox';
        const ch = u.el('input', '', c);
        ch.type = 'checkbox';
        c.append(' Do not show again');
      }
      if (/Tip/.test(title)) {
        el.append(actions);
        const bulb = u.el('span', 'tip-bulb', el);
        bulb.innerHTML =
          '<svg viewBox="0 0 70 80"><path d="M24 58c0-12-13-15-13-31a22 22 0 0 1 44 0c0 16-13 19-13 31zM24 58h18v9H24zM26 67h14l-3 6h-8zM33 0v-10M8 6 1-1M58 6l7-7M3 28H-7M63 28h10" transform="translate(1 8)" fill="none" stroke="black" stroke-width="3"/></svg>';
      }
      const dismiss = u.el('button', 'primary', actions, label);
      dismiss.type = 'button';
      dismiss.addEventListener('click', () => ctx.dismiss());
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-use-desktop-tools-tree-11',
    template: 'site/base',
    langs: ['en'],
    initialOverlay: { kind: 'toast' },
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-use-desktop-tools-tree-11': palette },
      LOW_THEME: palette,
      ACCENTS: ['#000000'],
      LOW_ACCENTS: ['#000000'],
      parts,
    },
  });
})();
