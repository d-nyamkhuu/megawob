(function () {
  'use strict';
  function drawWork(u, work) {
      const overview = u.el('section', 'ol-overview', work);
      const detail = u.el('div', 'ol-detail', overview);
      u.el('h2', '', detail, 'Import Customer Records');
      u.el('p', '', detail, 'This wizard will import customer records from a CSV file.');
      u.el('ol', '', detail).innerHTML =
        '<li>Select the file to import.</li><li>Review the details.</li><li>Click Next to continue.</li>';
      const file = u.el('div', 'ol-file', detail);
      u.el('span', '', file, 'Selected file:');
      u.el('span', 'ol-file-name', file, 'customers.csv');
      const preview = u.el('div', 'ol-preview', overview);
      u.el('div', 'ol-preview-title', preview, 'Preview (first 5 records)');
      const table = u.el('table', '', preview);
      table.innerHTML =
        '<thead><tr><th>ID</th><th>Name</th><th>City</th><th>Status</th></tr></thead><tbody><tr><td>1001</td><td>Adams, Ruth</td><td>Boston</td><td>Active</td></tr><tr><td>1002</td><td>Baker, Tom</td><td>Chicago</td><td>Active</td></tr><tr><td>1003</td><td>Chen, Li</td><td>Seattle</td><td>Inactive</td></tr><tr><td>1004</td><td>Diaz, Maria</td><td>Austin</td><td>Active</td></tr><tr><td>1005</td><td>Evans, John</td><td>Denver</td><td>Active</td></tr></tbody>';
      const dock = u.el('footer', 'ol-dock', document.body);
      u.el('strong', 'ol-dock-label', dock, 'Tools');
      const tools = u.el('div', 'ol-tools', dock);
      const iconMarkup = [
        '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M5 15h15l4 5h19v21H5z"/><path d="M5 15V8h15l4 5"/></svg>',
        '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M9 5h30v38H9z"/><path d="M15 13h18M15 20h18M15 27h18M15 34h13"/></svg>',
        '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M20 4h8l1.5 5.5a16 16 0 0 1 3.5 1.5l5-2.5 5.5 5.5-2.5 5a16 16 0 0 1 1.5 3.5L48 24v8l-5.5 1.5a16 16 0 0 1-1.5 3.5l2.5 5-5.5 5.5-5-2.5a16 16 0 0 1-3.5 1.5L28 52h-8l-1.5-5.5a16 16 0 0 1-3.5-1.5l-5 2.5L4.5 42l2.5-5a16 16 0 0 1-1.5-3.5L0 32v-8l5.5-1.5A16 16 0 0 1 7 19l-2.5-5L10 8.5l5 2.5a16 16 0 0 1 3.5-1.5z" transform="translate(3 -5) scale(.88)"/><circle cx="24" cy="24" r="7"/></svg>',
        '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="18"/><path d="M20 18a5 5 0 1 1 8 4c-3 2-4 3-4 7M24 35v1"/></svg>',
      ];
      [
        ['Open File', 0],
        ['View Log', 1],
        ['Preferences', 2],
        ['Help', 3],
      ].forEach(([label, icon]) => {
        const item = u.el('div', 'ol-tool', tools);
        u.el('span', 'ol-tool-icon', item).innerHTML = iconMarkup[icon];
        u.el('span', '', item, label);
      });
    return dock;
  }

  function styleNote(_c, selector) {
    const note = _c.body.querySelector(selector);
    if (!note) return;
    note.classList.add('ol-instruction', 'ol-instruction-' + _c.display);
    _c.util.el('span', 'ol-step', note, 'Step 1 of 3');
  }

  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // Preserve the original note modes and their narrow-screen fallback.
      _c.display = _c.ctx.display || 'header';
      if (_c.W < 1260 && (_c.display === 'panel' || _c.display === 'toast')) _c.display = 'header';
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
      const title = u.el('header', 'ol-titlebar', document.body);
      u.el('span', 'ol-menu-gadget', title, '✣');
      u.el('strong', 'ol-title', title, 'Data Import Wizard');
      u.el('span', 'ol-window-buttons', title, '−　□　×');
      const menu = u.el('nav', 'ol-menubar', document.body);
      ['File ▾', 'Edit ▾', 'View ▾', 'Tools ▾'].forEach((x) => u.el('span', '', menu, x));
      u.el('span', 'ol-help', menu, 'Help ▾');
      const work = u.el('div', 'ol-work', document.body);
      const dock = drawWork(u, work);
      Object.assign(_c, { header: work, work, dock });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      styleNote({ ..._c, body: _c.work }, '.ref-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.dock;
      base(_c);
      _c.header = header;
      const stack = _c.util.el('div', 'ol-xtra-stack', _c.headerTools);
      for (const button of _c.headerTools.querySelectorAll('.ref-xtra')) stack.appendChild(button);
    },
    'frame.body': () => (_c) => {
      _c.body = _c.work;
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      styleNote(_c, '.ref-panel');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage ol-stage', _c.work);
      _c.work.appendChild(_c.work.querySelector('.ol-overview'));
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        _c.work.insertBefore(note, _c.stage);
        styleNote(_c, '.ref-note');
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        _c.dock.appendChild(foot);
        const tools = foot.querySelector('.ref-tools');
        const stack = _c.util.el('div', 'ol-xtra-stack', tools);
        for (const button of tools.querySelectorAll('.ref-xtra')) stack.appendChild(button);
      }
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.dock.appendChild(dock);
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
  const palette = { bg: '#c7c9cb', panel: '#d8d9db', fg: '#111820', muted: '#39414a', line: '#92979c' };
  env.site({
    name: 'design-act-in-time-delay-05',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-act-in-time-delay-05': palette },
      LOW_THEME: palette,
      ACCENTS: ['#aec4e4'],
      LOW_ACCENTS: ['#aec4e4'],
      parts,
    },
  });
})();
