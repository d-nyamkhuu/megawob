(function () {
  'use strict';
  const palette = { bg: '#719bcb', panel: '#eeebe3', fg: '#151515', muted: '#5f6a78', line: '#c1bdb3' };
  const icons = {
    terminal: '<rect x="2" y="2" width="36" height="36" rx="2" fill="#eeeede" stroke="#555a52" stroke-width="2"/><rect x="6" y="6" width="28" height="28" fill="#253529" stroke="#9da494"/><path d="M8 8H32V18L8 29Z" fill="#799c65"/><path d="M11 14l5 4-5 4m10 3h7" stroke="white" stroke-width="2" fill="none"/>',
    doc: '<path d="M7 2H25L34 11V38H7Z" fill="#f4fbff" stroke="#416d9c" stroke-width="1.4"/><path d="M25 2V11H34" fill="#9fc6ec" stroke="#416d9c"/><path d="M10 5H22V17H10Z" fill="#adcde9"/><path d="M11 20H30M11 23H29M11 26H26M11 29H29M11 32H23" stroke="#6899bc" stroke-width="1.3"/><path d="M9 37V4" stroke="white"/>',
    gear: '<path d="M17 2H23L24 7L28 9L33 6L37 11L34 15L35 19L40 21L39 27L34 28L31 32L32 37L26 40L22 36L17 36L14 40L8 37L9 32L6 28L1 27L0 21L5 19L6 15L3 11L7 6L12 9L16 7Z" transform="translate(1 0) scale(.94)" fill="#a7c8e9" stroke="#426da5" stroke-width="1.8"/><circle cx="20" cy="21" r="9" fill="#ecebe2" stroke="#517ab0" stroke-width="2"/><circle cx="20" cy="21" r="5" fill="#83acd4"/>',
    help: '<circle cx="20" cy="20" r="18" fill="#619ed0" stroke="#355f89" stroke-width="2"/><path d="M5 14Q20 -2 34 14" fill="none" stroke="#b8dcf4" stroke-width="3"/><text x="20" y="30" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="30" fill="white">?</text>',
    check: '<path d="M2 20L12 10L22 20L43 1L51 9L22 37Z" fill="#65cc2b" stroke="#3f8e22" stroke-width="1.5"/><path d="M4 20L12 13L22 23L43 4" fill="none" stroke="#b2ed84" stroke-width="2"/>',
  };
  const icon = (el, name) => {
    el.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' +
      (name === 'check' ? '54 40' : '40 40') + '" aria-hidden="true">' + icons[name] + '</svg>';
  };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // This window reserves its own pane and notification row at every size.
      _c.display = _c.ctx.display || 'header';
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('side-left', 'instruction-' + _c.display);
      const shell = u.el('div', 'site-shell', document.body);
      const header = u.el('header', 'design-header', shell);
      const tb = u.el('div', 'gk-titlebar', header);
      icon(u.el('span', 'gk-ico', tb), 'terminal');
      u.el('span', 'gk-title', tb, 'Terminal Task');
      const wc = u.el('span', 'gk-wc', tb);
      ['_', '▢', '✕'].forEach((t) => u.el('i', '', wc, t));
      const menu = u.el('nav', 'gk-menu', header);
      ['File', 'Edit', 'View', 'Terminal', 'Help'].forEach((t) => u.el('span', '', menu, t));
      Object.assign(_c, { shell, header, menu });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('mode-note', 'mode-header');
        _c.util.el('strong', '', note, 'Task');
        note.insertBefore(note.lastChild, note.firstChild);
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.menu;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'design-body', _c.shell);
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('task-note');
        panel.querySelector('.ref-panel-title').textContent = 'Task';
        _c.util.el('div', 'gk-help', panel, 'You can use standard Linux commands. A file listing is shown in the terminal.');
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('mode-note', 'mode-toast');
        const heading = _c.util.el('strong', '', note, 'Notification');
        note.insertBefore(heading, note.firstChild);
        _c.header.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const u = _c.util;
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('design-footer');
      _c.shell.appendChild(foot);
      foot.querySelector('.ref-foot-text').remove();
      const fl = u.el('span', 'footer-label', foot);
      foot.insertBefore(fl, foot.firstChild);
      [['Clear Terminal', 'doc'], ['Reset', 'gear'], ['Show Hint', 'help']].forEach(([t, k]) => {
        const b = u.el('button', 'gk-btn', fl);
        b.type = 'button';
        b.dataset.action = k;
        icon(u.el('span', 'gk-bi ' + k, b), k);
        u.el('span', '', b, t);
      });
      const divider = u.el('span', 'gk-sep', fl);
      divider.hidden = _c.placement !== 'footer';
      if (_c.placement === 'footer' && _c.submit) {
        _c.submit.classList.add('end-control');
        icon(u.el('span', 'submit-icon', _c.submit), 'check');
      }
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const named = ['BeOS Newsletter', 'Be the first to know. Get news, tips and updates from the BeOS team.', 'Close'];
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
    name: 'design-use-desktop-tools-terminal-07',
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
