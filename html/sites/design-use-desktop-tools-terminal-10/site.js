// GEM desktop chrome on the shared site frame; task rendering stays in the widget.
(function () {
  'use strict';

  const palette = {
    bg: '#f4f4f4', panel: '#eeeeee', fg: '#111111', accent: '#111111',
    font: 'monospace', line: '#111111', muted: '#111111', 'button-fg': '#000',
  };

  // Place a shared instruction part in the GEM overview's existing instruction region.
  function overviewNote(_c, note) {
    note.classList.add('task-note');
    note.dataset.role = 'instruction';
    _c.info.before(note);
  }

  env.site({
    name: 'design-use-desktop-tools-terminal-10',
    template: 'site/base',
    styles: ['../base/site.css', 'site.css'],
    langs: ['en'],
    design: {
      THEMES: { gem: palette },
      LOW_THEME: palette,
      ACCENTS: [palette.accent],
      LOW_ACCENTS: [palette.accent],
      parts: {
        'frame.layout': (base) => (_c) => {
          base(_c);
          _c.display = _c.ctx.display;
          document.body.className = 'gem instruction-' + _c.display;
        },
        'frame.placement': (base) => (_c) => {
          base(_c);
          // The lower GEM window always has its button strip.
          _c.wantFooter = true;
        },
        'frame.header': () => (_c) => {
          const { util: u } = _c;
          const shell = u.el('div', 'site-shell', document.body);
          const titlebar = u.el('header', 'design-header', shell);
          u.el('div', 'design-brand', titlebar, 'GEM Task Runner');
          u.el('div', 'gem-hatch', titlebar);
          u.el('div', 'gem-clock', titlebar, 'Mon   Apr 14 1987    10:24');
          const gadgets = u.el('div', 'gem-gadgets', titlebar);
          u.el('span', '', gadgets, '↕');
          u.el('span', '', gadgets, '✳');
          const menu = u.el('nav', 'design-nav', shell);
          for (const m of ['File', 'Edit', 'View', 'Options', 'Help']) u.el('span', '', menu, m);
          const body = u.el('div', 'design-body', shell);
          const overview = u.el('section', 'gem-overview', body);
          const overviewTitle = u.el('div', 'gem-otitle', overview, 'Task Overview');
          const overviewBody = u.el('div', 'gem-obody', overview);
          const icon = u.el('div', 'gem-icon', overviewBody);
          icon.innerHTML = '<svg viewBox="0 0 76 86" aria-hidden="true"><path d="M2 2H53L74 23V84H2Z M53 2V23H74" fill="none" stroke="currentColor" stroke-width="3"/><path d="M12 15H44 M12 24H44 M12 34H63 M12 43H63 M12 52H63 M12 61H63 M12 70H63" fill="none" stroke="currentColor" stroke-width="2"/></svg>';
          const header = u.el('section', 'task-note', overviewBody);
          header.dataset.role = 'instruction';
          header.hidden = _c.display !== 'header';
          const info = u.el('div', 'gem-info', overviewBody);
          for (const [k, v] of [
            ['Session:', 'Interactive shell'], ['Folder:', '~'], ['View:', 'File catalog'],
            ['Input:', 'Command line'], ['Status:', 'Ready'],
          ]) {
            const row = u.el('div', '', info);
            u.el('b', '', row, k);
            const value = u.el('span', '', row, v);
            value.dataset.info = k.slice(0, -1).toLowerCase();
          }
          Object.assign(_c, { shell, body, header, overviewTitle, info });
        },
        'frame.nav': () => () => {},
        'frame.controls': (base) => (_c) => {
          base(_c);
          const { endBtn, decoyBtn } = _c;
          _c.endBtn = (parent, cls, text) => {
            const button = endBtn(parent, cls, text);
            button.classList.add('end-control');
            if (cls === 'ref-endlink') button.classList.add('end-link');
            return button;
          };
          _c.decoyBtn = (parent, text, collides) => {
            decoyBtn(parent, text, collides);
            parent.lastElementChild.classList.add('gem-xtra');
          };
        },
        'frame.tools': (base) => (_c) => {
          base(_c);
          _c.overviewTitle.append(_c.headerTools);
          if (_c.submit) _c.submit.classList.add('end-title');
        },
        'frame.body': () => () => {},
        'frame.panel': (base) => (_c) => {
          base(_c);
          const panel = _c.body.querySelector('.ref-panel');
          if (panel) overviewNote(_c, panel);
        },
        'frame.stage': () => (_c) => {
          _c.stage = _c.util.el('main', 'stage', _c.body);
        },
        'frame.toast': (base) => (_c) => {
          base(_c);
          const note = document.querySelector('.ref-note');
          if (note) overviewNote(_c, note);
        },
        'frame.footer': (base) => (_c) => {
          base(_c);
          const footer = document.querySelector('.ref-foot');
          footer.className = 'design-footer';
          _c.body.append(footer);
          footer.querySelector('.ref-foot-text').remove();
          const buttons = _c.util.el('div', 'gem-actions');
          for (const text of ['Clear', 'Reset', 'Help']) {
            _c.decoyBtn(buttons, text);
            buttons.lastElementChild.className = 'gem-btn';
          }
          const spacer = _c.util.el('span', 'footer-label');
          footer.prepend(buttons, spacer);
          _c.footer = footer;
        },
        'frame.floating': (base) => (_c) => {
          base(_c);
          const dock = document.querySelector('.ref-float-dock');
          if (dock) _c.footer.append(dock);
        },
        overlay: () => (ctx) => {
          const u = ctx.util;
          const named = ['GEM Task Runner', 'Your task workspace is ready.', 'Close'];
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
      },
    },
  });
})();
