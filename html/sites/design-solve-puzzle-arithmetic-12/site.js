(function () {
  'use strict';
  const palette = { bg: '#e9e6df', panel: '#fffefa', fg: '#17232e', muted: '#626a70', line: '#c8c5be' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The existing left column has room for all three note styles at every size.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.className = 'gtk clearlooks instruction-' + _c.display;
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      const icon = u.svg('svg', { width: 24, height: 24, viewBox: '0 0 24 24', class: 'title-icon' }, top);
      u.svg('rect', { x: 2, y: 2, width: 20, height: 20, rx: 3, fill: '#e8edf0', stroke: '#53616a' }, icon);
      u.svg('path', { d: 'M6 7h12M6 11h12M6 15h8', stroke: '#35434c', 'stroke-width': 1.4 }, icon);
      u.el('span', '', top, 'Math Practice');
      const wc = u.el('div', 'native-window-controls', top);
      for (const kind of ['min', 'max', 'close']) {
        const b = u.el('button', 'window-' + kind, wc, kind === 'min' ? '−' : kind === 'max' ? '□' : '×');
        b.type = 'button';
      }
      const menu = u.el('nav', 'menu', app);
      ['File', 'Edit', 'Help'].forEach((x) => u.el('span', 'menu-item', menu, x));
      const center = u.el('div', 'center', app);
      const noteSlot = u.el('section', 'note-slot', center);
      Object.assign(_c, { app, menu, center, noteSlot, header: noteSlot });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.noteSlot.querySelector('.ref-instruction');
      if (note) note.classList.add('brief');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.menu;
      base(_c);
      _c.header = header;
      if (_c.submit) _c.submit.dataset.chromeEnd = 'true';
    },
    'frame.body': () => (_c) => {
      const u = _c.util, center = _c.center;
      const preview = u.el('section', 'task-preview', center);
      u.el('h2', 'preview-title', preview, 'Task Preview');
      u.el('div', 'preview-label', preview, 'Math problem:');
      u.el('div', 'preview-expression', preview, 'Arithmetic exercise');
      u.el('div', 'preview-label', preview, 'Your answer:');
      u.el('div', 'preview-empty', preview);
      const work = u.el('section', 'work-area', center);
      const tabs = u.el('div', 'tabs', work);
      const task = u.el('button', 'tab task-tab', tabs, '▤　Task');
      const prefs = u.el('button', 'tab prefs-tab active', tabs, '⚙　Preferences');
      task.type = prefs.type = 'button';
      const workspace = u.el('div', 'workspace', work);
      const stage = u.el('section', 'stage', workspace);
      const prefsPanel = u.el('section', 'preferences-panel', workspace);
      prefsPanel.innerHTML =
        '<h2>Application Preferences</h2><div class="pref-card"><h3>General</h3><div class="pref-row"><span>Theme:</span><b class="fake-select">Classic (Default)</b></div><div class="pref-row"><span>Font size:</span><b class="fake-select short">Medium</b></div><div class="pref-row"><span>Automatically check for updates:</span><b class="fake-check">✓</b> Enable</div><div class="pref-row"><span>Play sound effects:</span><b class="fake-check">✓</b> Enable</div><hr><h3>Appearance</h3><div class="pref-row"><span>Window style:</span><b class="fake-select">Normal</b></div><div class="pref-row"><span>Show toolbar text:</span><b class="fake-check">✓</b> Enable</div><div class="pref-row"><span>Language:</span><b class="fake-select short">English (US)</b></div><div class="pref-actions"><button>Restore Defaults</button><button>Cancel</button><button>Apply</button></div></div>';
      function showTask() {
        prefsPanel.hidden = true;
        prefs.classList.remove('active');
        task.classList.add('active');
      }
      function showPrefs() {
        prefsPanel.hidden = false;
        task.classList.remove('active');
        prefs.classList.add('active');
      }
      task.addEventListener('click', showTask);
      prefs.addEventListener('click', showPrefs);
      const tools = u.el('aside', 'tool-strip', center);
      [['▤', 'Task'], ['⚙', 'Preferences'], ['▣', 'History']].forEach((x, i) => {
        const b = u.el('button', 'tool' + (i === 1 ? ' selected' : ''), tools, x[0]);
        b.type = 'button';
        b.title = x[1];
        if (i === 0) b.addEventListener('click', showTask);
        if (i === 1) b.addEventListener('click', showPrefs);
      });
      prefsPanel.querySelectorAll('button').forEach((b) =>
        b.addEventListener('click', () => env.log('decoy', { label: b.textContent })));
      Object.assign(_c, { body: center, stage, work, preview });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.noteSlot;
      base(_c);
      _c.body = body;
      const panel = _c.noteSlot.querySelector('.ref-panel');
      if (panel) panel.classList.add('brief');
    },
    'frame.stage': () => () => {},
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('brief');
        _c.noteSlot.appendChild(note);
      }
      // Preserve the original preview's clearance below the instruction card.
      const brief = _c.noteSlot.querySelector('.brief');
      if (brief) {
        const noteBottom = _c.noteSlot.offsetTop + _c.noteSlot.offsetHeight;
        const top = parseFloat(getComputedStyle(_c.preview).marginTop);
        if (noteBottom + 20 > top) _c.preview.style.marginTop = noteBottom + 20 + 'px';
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.work.appendChild(foot);
      if (_c.submit) _c.submit.dataset.chromeEnd = 'true';
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.work.appendChild(dock);
      if (_c.submit) _c.submit.dataset.chromeEnd = 'true';
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body),
        messages = {
          cookie: 'This application stores preferences on your device.',
          toast: 'Your workspace has been synced.',
          chat: 'Need help with this exercise?',
          promo: 'Try the new practice collection.',
          banner: 'An updated practice collection is available.',
        };
      u.el('span', '', el, messages[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Dismiss');
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-solve-puzzle-arithmetic-12',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#5796d2'],
      LOW_ACCENTS: ['#5796d2'],
      parts,
    },
  });
})();
