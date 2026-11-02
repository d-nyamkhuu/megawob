(function () {
  'use strict';
  const C = { title: 'TextLens', accent: '#0a2fc4', font: 'Arial, Helvetica, sans-serif', doc: 'world_notes.txt' };
  const palette = { bg: '#c8d0de', panel: '#fff', fg: '#111820', muted: '#5a6578', line: '#9aa4b8' };
  const logo = '<rect x="1" y="1" width="20" height="20" fill="#1c8fdb" stroke="#111" stroke-width="1.5"/><path d="M3 3L19 19H3Z" fill="#acd8ef"/><path d="M3 19L19 3" stroke="#091426" stroke-width="4"/><path d="M3 19L19 3" stroke="#ed5424" stroke-width="2"/><path d="M3 3L19 19" stroke="#123c81"/>';
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
      document.body.className = 'design beos';
      _c.root.style.setProperty('--font', C.font);
      const shell = u.el('div', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const tab = u.el('div', 'tab-title', head);
      u.svg('svg', { width: 22, height: 22, viewBox: '0 0 22 22' }, tab).innerHTML = logo;
      u.el('span', '', tab, C.title);
      const controls = u.el('div', 'window-controls', head);
      for (const label of ['−', '□', '×']) {
        const bt = u.el('button', '', controls, label);
        bt.type = 'button';
        bt.onclick = () => env.log('window-control', { label });
      }
      const menu = u.el('nav', 'menu', shell);
      for (const m of ['File', 'Edit', 'View', 'Help']) u.el('span', '', menu, m);
      const menuTools = u.el('div', 'chrome-tools', menu);
      u.el('span', 'menu-right', menu, 'BeOS');
      const content = u.el('div', 'content', shell);
      const docbox = u.el('section', 'docbox', content);
      const dh = u.el('div', 'doc-head', docbox);
      u.el('span', '', dh, 'Source Document:');
      u.el('b', '', dh, C.doc);
      const dmain = u.el('div', 'doc-main', docbox);
      const note = u.el('section', 'task-note', content);
      u.el('div', 'note-label', note, 'Task');
      const hint = u.el('div', 'hint', note, 'Use the selection tools below to work with the source document shown above.');
      if (_c.display === 'hidden') note.classList.add('instruction-hidden');
      else if (_c.display === 'toast') note.classList.add('instruction-notification');
      else if (_c.display === 'panel') note.classList.add('instruction-panel');
      const row = u.el('div', 'groups', note);
      const g1 = u.el('div', 'group g-tools', row);
      u.el('div', 'g-title', g1, 'Selection Tools');
      const g1b = u.el('div', 'g-body tools', g1);
      const sb = u.el('button', 'tool-sel', g1b);
      sb.type = 'button';
      u.svg('svg', { width: 30, height: 34, viewBox: '0 0 30 34' }, sb).innerHTML =
        '<path d="M5 3V26L11 20L16 31L20 29L15 19H23Z" fill="#fff" stroke="#111" stroke-width="2" stroke-linejoin="round"/>';
      u.el('span', 'sel-label', g1b, 'Select (drag)');
      u.el('span', 'vsep', g1b);
      const clr = u.el('button', 'clear-sel', g1b);
      clr.type = 'button';
      u.svg('svg', { width: 38, height: 34, viewBox: '0 0 38 34' }, clr).innerHTML =
        '<path d="M4 20L17 6L30 17L18 30H10Z" fill="#fff" stroke="#555" stroke-width="2" stroke-linejoin="round"/><path d="M11 14L24 25" stroke="#555" stroke-width="2"/>';
      u.el('span', '', clr, 'Clear Selection');
      clr.onclick = () => { env.widgetDef.clear?.(); };
      const g2 = u.el('div', 'group g-tip', row);
      u.el('div', 'g-title', g2, 'Tip');
      const tb = u.el('div', 'g-body tip', g2);
      u.el('div', '', tb, 'The source document is displayed above.');
      u.el('div', '', tb, 'Selection tools are available on the left.');
      const g3 = u.el('div', 'group g-act', row);
      u.el('div', 'g-title', g3, 'Actions');
      const ab = u.el('div', 'g-body acts', g3);
      const rs = u.el('button', 'clear', ab, 'Reset');
      rs.type = 'button';
      rs.onclick = () => { env.widgetDef.clear?.(); };
      Object.assign(_c, { shell, menuTools, content, dmain, note, hint, ab, header: note });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const instruction = _c.header.querySelector('.ref-instruction');
      if (instruction) {
        instruction.classList.add('instruction');
        _c.note.insertBefore(instruction, _c.hint);
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.ab;
      base(_c);
      _c.header = header;
      _c.ab.insertBefore(_c.headerTools, _c.ab.firstChild);
      // Extra controls belong to the menu, leaving the original Actions group uncluttered.
      for (const extra of [..._c.headerTools.querySelectorAll('.ref-xtra')]) _c.menuTools.appendChild(extra);
    },
    'frame.body': () => (_c) => { _c.body = _c.content; },
    'frame.panel': (base) => (_c) => {
      base({ ..._c, body: _c.note });
      const panel = _c.note.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('instruction');
        _c.note.insertBefore(panel, _c.hint);
      }
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      const stage = u.el('main', 'stage', _c.dmain);
      stage.dataset.role = 'stage';
      const vs = u.el('div', 'vscroll', _c.dmain);
      vs.setAttribute('aria-hidden', 'true');
      u.el('span', 'vs-btn up', vs, '▲');
      u.el('span', 'vs-thumb', vs);
      u.el('span', 'vs-btn down', vs, '▼');
      _c.stage = stage;
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('instruction');
        _c.note.insertBefore(note, _c.hint);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const u = _c.util;
      const footer = document.body.querySelector('.ref-foot');
      footer.classList.add('footer');
      _c.shell.appendChild(footer);
      const fi = u.el('span', 'foot-icon');
      u.svg('svg', { width: 26, height: 24, viewBox: '0 0 22 22' }, fi).innerHTML = logo;
      u.el('span', 'foot-caret', fi, '▾');
      footer.prepend(fi);
      const ready = footer.querySelector('.ref-foot-text');
      ready.classList.add('foot-copy');
      ready.textContent = 'Ready';
      u.el('span', 'foot-clock', footer, '10:24 AM');
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) {
        const footer = _c.shell.querySelector('.ref-foot');
        footer.insertBefore(dock, footer.querySelector('.ref-foot-text'));
      }
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        kind = ctx.kind;
      const el = u.el('section', 'obstruction obstruction-' + kind, document.body);
      el.dataset.role = 'overlay';
      const box = u.el('div', 'obstruction-box', el);
      const title = {
        cookie: 'Your privacy',
        toast: 'Changes saved',
        chat: 'Support',
        promo: 'Workspace update',
        banner: 'Service notice',
      }[kind];
      const text = {
        cookie: 'This application stores optional cookies.',
        toast: 'Your changes have been saved.',
        chat: 'Need a hand with this workspace?',
        promo: 'Explore the latest workspace features.',
        banner: 'You are viewing a shared workspace.',
      }[kind];
      const label = kind === 'cookie' ? 'Reject optional' : 'Close';
      u.el('h3', '', box, title);
      u.el('p', '', box, text);
      const dismiss = u.el('button', 'dismiss', box, label);
      dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('close');
      if (kind === 'cookie') {
        const accept = u.el('button', 'dismiss', box, 'Accept optional');
        accept.onclick = () => ctx.dismiss('accept');
      }
      return { el, dismiss, ttlSteps: kind === 'toast' ? 5 : 0 };
    },
  };
  env.site({
    name: 'design-select-text-paragraph-07',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: { THEMES: { textlens: palette }, LOW_THEME: palette, ACCENTS: [C.accent], LOW_ACCENTS: [C.accent], parts },
  });
})();
