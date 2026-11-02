(function () {
  'use strict';
  const palette = {
    bg: '#faf7f0', panel: '#fffdfa', fg: '#2a2e22', muted: '#6b6a58', line: '#d8d1bc',
  };
  const hint = 'In the editor on the right, apply the requested formatting to the document text.';
  const parts = {
    'frame.theme': (base) => (_c) => {
      base(_c);
      _c.root.style.setProperty('--font', "Georgia,'Times New Roman',serif");
      _c.root.style.setProperty('--button-fg', '#fff');
    },
    'frame.layout': (base) => (_c) => {
      base(_c);
      // This design's briefing pane also fits the intermediate desktop widths.
      if (_c.ctx.display === 'panel' && _c.W >= 1180) _c.display = 'panel';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.className = 'side-left instruction-' + _c.display +
        (_c.ctx.finish ? ' finish-mode' : '') +
        (['header', 'icon'].includes(_c.placement) ? ' end-header' : '');
      const shell = u.el('div', 'site-shell', document.body);
      const chrome = u.el('header', 'design-header', shell);
      u.el('div', 'design-brand', chrome, 'Terminal');
      u.el('nav', 'design-nav', chrome, 'Terminal    Edit    Settings    Help');
      const body = u.el('div', 'design-body', shell);
      const briefing = u.el('div', 'briefing-slot', body);
      const header = u.el('section', 'task-note display-header', briefing);
      header.hidden = _c.display !== 'header';
      if (_c.display === 'header') u.el('h2', '', header, 'Writing task');
      const toolbar = u.el('div', 'editor-tools', shell);
      Object.assign(_c, { shell, body, briefing, header, toolbar });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      if (_c.display === 'header') _c.util.el('p', 'hint', _c.header, hint);
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => () => {},
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.briefing;
      base(_c);
      _c.body = body;
      const panel = _c.briefing.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('task-note');
        panel.querySelector('.ref-panel-title').textContent = 'Writing task';
        _c.util.el('p', 'hint', panel, hint);
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
        _c.body.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('design-footer');
      _c.shell.appendChild(foot);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.shell.appendChild(dock);
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
    name: 'design-use-desktop-tools-editor-03',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: ['#3d4433'], LOW_ACCENTS: ['#3d4433'], parts,
    },
  });
})();
