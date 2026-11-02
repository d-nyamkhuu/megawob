(function () {
  'use strict';
  const preferencesHTML =
    '<section><h3>Appearance</h3><label>Theme:<span class="fake-select">Grayscale <b>▼</b></span></label><label>Text size:<span class="fake-select">12 pt <b>▼</b></span></label><label class="check"><i class="box checked"></i>Show line numbers by default</label><label class="check"><i class="box"></i>Enable sound</label><h3>Editor</h3><label>Default font:<span class="fake-select">Helvetica <b>▼</b></span></label><label class="check"><i class="box checked"></i>Wrap long lines</label><label class="check"><i class="box"></i>Show ruler</label><button class="restore">Restore Defaults</button></section><section><h3>Behavior</h3><label class="check"><i class="box checked"></i>Check spelling while typing</label><label class="check"><i class="box checked"></i>Auto-save documents</label><label class="check"><i class="box"></i>Confirm before clearing</label><h3>Workspace</h3><label class="check"><i class="box checked"></i>Remember window size</label><label class="check"><i class="box"></i>Reopen last tab</label></section>';
  const palette = { bg: '#454850', panel: '#d0d0d0', fg: '#111111', muted: '#343434', line: '#090a0b' };
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
      const u = _c.util;
      document.body.classList.add('ref', 'nextstep', 'console');
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const title = u.el('div', 'title', head);
      u.el('span', 'title-text', title, 'Text Task');
      const work = u.el('div', 'work', shell);
      const center = u.el('section', 'center task-open', work);
      const aside = u.el('aside', 'inspector', work);
      u.el('h2', '', aside, 'Task Preview');
      let noteBox = null;
      if (_c.display === 'header' || _c.display === 'toast') {
        noteBox = u.el('section', 'episode-note ' + _c.display, shell);
        u.el('header', 'episode-note-head', noteBox, _c.display === 'toast' ? 'Notification' : 'Task Note');
      }
      const brief = u.el('section', 'briefing', shell);
      u.el('header', 'briefing-head', brief, 'Note');
      u.el('div', 'briefing-copy', brief, 'This is a text copy task.\nOpen the Task tab to complete it.\nThe required text is visible there.');
      const desk = u.el('nav', 'desktop-icons', shell);
      [['▱', 'Workspace'], ['▤', 'Documents'], ['>_', 'Terminal'], ['▧', 'Trash']].forEach(([i, t]) => {
        const d = u.el('div', 'desktop-icon', desk);
        u.el('span', '', d, i);
        u.el('label', '', d, t);
      });
      Object.assign(_c, { shell, work, center, aside, noteBox, header: noteBox || head });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      const h = _c.header;
      _c.header = _c.center;
      base(_c);
      _c.header = h;
    },
    'frame.body': () => (_c) => { _c.body = _c.work; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.aside;
      base(_c);
      _c.body = body;
      const u = _c.util;
      u.el('hr', '', _c.aside);
      u.el('p', 'preview-lead', _c.aside, 'The Task tab contains:');
      const list = u.el('ul', '', _c.aside);
      ['a short text snippet with line numbers', 'an empty "Copied text" field', 'text editing controls'].forEach(t => u.el('li', '', list, t));
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      const center = _c.center;
      _c.stage = u.el('div', 'stage', center);
      const tabs = u.el('div', 'task-tabs', center);
      const pref = u.el('button', 'tab', tabs, 'Preferences');
      const task = u.el('button', 'tab active', tabs, 'Task');
      pref.type = task.type = 'button';
      task.addEventListener('click', () => {
        center.classList.add('task-open');
        task.classList.add('active');
        pref.classList.remove('active');
      });
      pref.addEventListener('click', () => {
        if (!center.querySelector('.preferences')) {
          const pane = u.el('div', 'preferences', center);
          pane.innerHTML = preferencesHTML;
          pane.querySelector('.restore').addEventListener('click', () => env.log('decoy', { label: 'Restore Defaults' }));
        }
        center.classList.remove('task-open');
        pref.classList.add('active');
        task.classList.remove('active');
      });
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') _c.noteBox.appendChild(document.querySelector('.ref-note'));
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const u = _c.util;
      const foot = u.el('footer', 'footer', _c.shell);
      const taskbar = u.el('div', 'taskbar', foot);
      u.el('span', 'start-icon', taskbar, '▰');
      u.el('span', 'taskbar-app', taskbar, 'Text Task');
      const controls = document.querySelector('.ref-foot');
      taskbar.appendChild(controls);
      u.el('span', 'taskbar-time', taskbar, 'Mon Apr 12　10:24 AM');
      Object.assign(_c, { taskbar, foot });
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.querySelector('.ref-float-dock');
      if (dock) _c.taskbar.insertBefore(dock, _c.taskbar.querySelector('.taskbar-time'));
    },
    overlay: () => (ctx) => {
      if (ctx.initial) {
        const center = document.querySelector('.center');
        const task = document.querySelector('.task-tabs .tab:last-child');
        const pref = document.querySelector('.task-tabs .tab:first-child');
        const el = ctx.util.el('div', 'preferences', center);
        el.innerHTML = preferencesHTML;
        center.classList.remove('task-open');
        pref.classList.add('active');
        task.classList.remove('active');
        el.querySelector('.restore').addEventListener('click', () => env.log('decoy', { label: 'Restore Defaults' }));
        task.addEventListener('click', ctx.dismiss, { once: true });
        return { el, dismiss: task };
      }
      const el = ctx.util.el('section', 'perturb ' + ctx.kind, document.body);
      ctx.util.el('strong', '', el, {
        cookie: 'Cookie preferences', toast: 'Notification', chat: 'Support', promo: 'A special offer', banner: 'Service notice',
      }[ctx.kind]);
      ctx.util.el('p', '', el, {
        cookie: 'Choose your preferences to continue.', toast: 'Your workspace is ready.', chat: 'How can we help?',
        promo: 'Explore the latest tools.', banner: 'A new update is available.',
      }[ctx.kind]);
      const dismiss = ctx.util.el('button', 'dismiss', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-handle-text-copy-paste-2-12',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    initialOverlay: { kind: 'promo' },
    design: {
      THEMES: { 'design-handle-text-copy-paste-2-12': palette },
      LOW_THEME: palette,
      ACCENTS: ['#444444'],
      LOW_ACCENTS: ['#444444'],
      parts,
    },
  });
})();
