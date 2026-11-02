(function () {
  'use strict';
  const D = { obstruction: null };
  const palette = {
    bg: '#dededc', panel: '#ffffff', fg: '#131923',
    muted: '#5f6a78', line: '#c8cdd5',
  };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast' && _c.W < 1260) _c.display = 'header';
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
      document.documentElement.style.setProperty('--font', 'monospace');
      document.body.classList.add('side-right', 'instruction-' + _c.display);
      const shell = u.el('div', 'site-shell', document.body);
      const chrome = u.el('header', 'design-header', shell);
      const brand = u.el('div', 'design-brand', chrome);
      u.el('span', 'notebook-mark', brand);
      brand.append('Notebook');
      const wc = u.el('div', 'window-controls', chrome);
      wc.innerHTML = '<svg viewBox="0 0 210 43" fill="none" stroke="#fff" stroke-width="1.6"><path d="M28 21h15M98 15h13v14H98zM166 15l14 14m0-14l-14 14"/></svg>';
      const toolbar = u.el('nav', 'design-nav', chrome);
      for (const label of ['File', 'Edit', 'View', 'Help']) u.el('span', '', toolbar, label);
      const body = u.el('div', 'design-body', shell);
      const noteHost = u.el('section', _c.display === 'header' ? 'task-note' : '', body);
      noteHost.hidden = _c.display !== 'header';
      if (_c.display === 'header') u.el('h2', '', noteHost, 'Task');
      Object.assign(_c, { shell, toolbar, body, header: noteHost });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      if (_c.display === 'header') {
        _c.util.el('div', 'editor-task-help', _c.header,
          'Apply the requested changes to the text, including any formatting.');
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const feedback = _c.util.el('aside', 'editor-feedback', _c.body);
      _c.util.el('h2', '', feedback, 'Feedback');
      const copy = _c.util.el('p', '', feedback,
        'Your changes will be checked when you finish this task.');
      Object.assign(_c, { feedback, feedbackCopy: copy });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.feedback;
      base(_c);
      _c.body = body;
      const panel = _c.feedback.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('task-note');
        panel.querySelector('.ref-panel-title').textContent = 'Task';
        _c.feedback.insertBefore(panel, _c.feedbackCopy);
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('task-note');
        _c.feedback.insertBefore(note, _c.feedbackCopy);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      _c.feedback.appendChild(foot);
      _c.foot = foot;
      const u = _c.util;
      const taskbar = u.el('div', 'electron-taskbar', _c.shell);
      const windows = u.el('span', 'windows-mark', taskbar);
      windows.innerHTML =
        '<svg viewBox="0 0 32 32" fill="#65b9ec"><path d="M3 6l11-1.5V15H3zM16 4.3L29 2.5V15H16zM3 17h11v10.5L3 26zM16 17h13v12.5L16 27.8z"/></svg>';
      const search = u.el('div', 'windows-search', taskbar);
      search.innerHTML =
        '<svg viewBox="0 0 32 32" fill="none" stroke="#303845" stroke-width="1.5"><circle cx="18" cy="12" r="9"/><path d="M11.5 18.5L2 29"/></svg><span>Type here to search</span>';
      const apps = u.el('span', 'taskbar-apps', taskbar);
      apps.innerHTML =
        '<span><svg viewBox="0 0 36 36"><path d="M3 8h12l3 3h15v23H3z" fill="#ffcf57"/><path d="M3 14h30v20H3z" fill="#efb630"/><path d="M5 16h26v11H5z" fill="#ffd366"/><path d="M15 25h11v10H15z" fill="#65acd6"/></svg></span><span><svg viewBox="0 0 36 36"><path d="M2 13L18 3l16 10v21H2z" fill="#149eda"/><path d="M5 11h26v19H5z" fill="#e9f6ff"/><path d="M2 14l16 11 16-11v20H2z" fill="#3db6ec"/><path d="M2 34l16-12 16 12" fill="#149eda"/></svg></span><span class="active"><i class="notebook-mark"></i></span>';
      const tray = u.el('span', 'taskbar-tray', taskbar);
      tray.innerHTML =
        '<svg viewBox="0 0 120 32" fill="none" stroke="#f5f5f5" stroke-width="1.5"><path d="M6 20l8-8 8 8M51 25c0-9 6-16 15-17M56 25c0-6 4-11 10-12M61 25c0-3 2-6 5-7M88 13h5l6-5v18l-6-5h-5zM104 11q7 6 0 12M108 7q11 10 0 20"/></svg>';
      u.el('span', 'taskbar-clock', taskbar, '10:24 AM\nApr 12, 2018');
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.feedback.appendChild(dock);
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
      /* Dismissing a notification must retain the editor selection and open formatting menu. */ el.addEventListener(
        'pointerdown',
        (e) => {
          if (e.target.closest('button')) e.preventDefault();
          e.stopPropagation();
        },
      );
      el.addEventListener('pointerup', (e) => e.stopPropagation());
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
    name: 'design-use-desktop-tools-editor-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: ['#f78008'], LOW_ACCENTS: ['#f78008'], parts,
    },
  });
})();
