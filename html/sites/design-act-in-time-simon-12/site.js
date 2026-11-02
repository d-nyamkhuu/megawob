(function () {
  'use strict';
  const palette = { bg: '#8296a8', panel: '#f3f6f9', fg: '#252a31', muted: '#66707d', line: '#bbc2c9' };

  function drawPreferences(u, shelf) {
    const prefs = [
      ['Sound', [['Play sounds', true], ['Mute all audio', false]]],
      ['Display', [['Show button labels', true], ['High contrast mode', false]]],
      ['Timing', [['Show countdown', true], ['Longer pause between steps', false]]],
    ];
    prefs.forEach((section, idx) => {
      const row = u.el('section', 'ds-prefrow', shelf);
      u.el('div', 'ds-prefname', row, section[0]);
      const choices = u.el('div', 'ds-checks', row);
      section[1].forEach(([label, on]) => {
        const line = u.el('label', 'ds-checkline', choices);
        const box = u.el('input', '', line);
        box.type = 'checkbox';
        box.checked = on;
        u.el('span', '', line, label);
      });
      if (idx === 0) {
        const volume = u.el('div', 'ds-volume', row);
        u.el('span', '', volume, 'Volume:');
        const range = u.el('input', '', volume);
        range.type = 'range';
        range.value = '70';
        u.el('span', '', volume, '70%');
      }
    });
    const theme = u.el('section', 'ds-prefrow ds-theme-row', shelf);
    u.el('div', 'ds-prefname', theme, 'Theme');
    const select = u.el('button', 'ds-theme-select', theme, 'Light (Default)');
    select.type = 'button';
    u.el('span', 'ds-select-arrows', select, '⌃⌄');
  }

  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original narrow window displays its note in the preferences pane.
      if (_c.W <= 1200 && _c.display === 'toast') _c.display = 'header';
      document.body.dataset.display = _c.display;
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
      const u = _c.util, root = document.body;
      root.classList.add('yosemite');
      const top = u.el('header', 'ds-top', root);
      u.el('span', 'ds-traffic', top, '● ● ●');
      u.el('span', 'ds-brand', top, 'Memory Trainer');
      u.el('span', 'ds-window-tools', top, '');
      const tabs = u.el('nav', 'ds-menu', root);
      const pref = u.el('button', 'ds-tab active', tabs, '⚙  Preferences');
      pref.type = 'button';
      const task = u.el('button', 'ds-tab', tabs, '▶  Task');
      task.type = 'button';
      const content = u.el('div', 'ds-content', root);
      const shelf = u.el('div', 'ds-prefview', content);
      const heading = u.el('h1', '', shelf, 'Preferences');
      const subtitle = u.el('p', 'ds-subtitle', shelf, 'Customize your experience. These settings do not start the task.');
      task.addEventListener('click', () => {
        pref.classList.remove('active');
        task.classList.add('active');
        root.classList.add('task-selected');
        heading.textContent = 'Task';
        subtitle.textContent = 'Sequence controls and round status appear in the preview.';
        shelf.querySelectorAll('.ds-prefrow').forEach((row) => { row.hidden = true; });
      });
      pref.addEventListener('click', () => {
        task.classList.remove('active');
        pref.classList.add('active');
        root.classList.remove('task-selected');
      });
      Object.assign(_c, { header: shelf, tabs, content, shelf });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-task-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.tabs;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      drawPreferences(_c.util, _c.shelf);
      _c.body = _c.util.el('div', 'ds-main', _c.content);
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) panel.classList.add('ds-brief');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('ds-toast');
        _c.content.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.content.appendChild(foot);
      foot.querySelector('.ref-foot-text').textContent = '';
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
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
    name: 'design-act-in-time-simon-12',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#6485a7'],
      LOW_ACCENTS: ['#6485a7'],
      parts,
    },
  });
})();
