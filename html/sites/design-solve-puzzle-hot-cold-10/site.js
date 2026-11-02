(function () {
  'use strict';
  const palette = { bg: '#b9b8b4', panel: '#ffffff', fg: '#111111', muted: '#777777', line: '#777777' };
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
      document.body.className = 'motif-workstation instruction-' + _c.display;
      const app = u.el('main', 'mw-app', document.body);
      const desktop = u.el('header', 'mw-desktop', app);
      const icon = u.el('span', 'mw-app-icon', desktop);
      icon.setAttribute('aria-hidden', 'true');
      u.el('span', 'mw-app-name', desktop, 'Treasure Finder');
      Object.assign(_c, { app, desktop, header: desktop });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('mw-header-instruction');
      _c.util.el('span', 'mw-clock', _c.desktop, 'Mon Apr 15 1991   10:24 AM');
    },
    'frame.tools': (base) => (_c) => {
      const u = _c.util;
      const work = u.el('div', 'mw-work', _c.app);
      const brief = u.el('aside', 'mw-brief', work);
      u.el('div', 'mw-brief-title', brief, 'Task Briefing');
      const win = u.el('section', 'mw-window', work);
      const title = u.el('div', 'mw-window-title', win);
      u.el('span', 'mw-window-icon', title, '▰');
      u.el('span', '', title, 'File Explorer - /usr/local/documents');
      const controls = u.el('span', 'mw-window-controls', title);
      for (const kind of ['_', '□', '×']) u.el('i', '', controls, kind);
      const menu = u.el('nav', 'mw-menu', win);
      for (const item of ['File', 'Edit', 'View', 'Go', 'Bookmarks']) u.el('span', '', menu, item);
      u.el('span', 'mw-help', menu, 'Help');
      const tear = u.el('div', 'mw-tearoff', win);
      for (const item of ['Large Icons', 'Small Icons', 'List', 'Tear Off'])
        u.el('div', item === 'Tear Off' ? 'tear-item' : '', tear, item);
      const toolbar = u.el('div', 'mw-toolbar', win);
      for (const [ico, label] of [
        ['⬅', 'Back'], ['➡', 'Forward'], ['⌂', 'Home'],
        ['⬆', 'Up'], ['⟳', 'Reload'], ['⬢', 'Stop'],
      ]) {
        const b = u.el('div', 'mw-tool', toolbar);
        u.el('span', 'mw-tool-icon', b, ico);
        u.el('span', '', b, label);
      }
      const header = _c.header;
      _c.header = toolbar;
      base(_c);
      _c.header = header;
      Object.assign(_c, { work, brief, win, toolbar });
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const loc = u.el('div', 'mw-location', _c.win);
      u.el('label', '', loc, 'Location:');
      u.el('div', 'mw-location-field', loc, '/usr/local/documents');
      u.el('span', 'mw-drop', loc, '▾');
      const body = u.el('div', 'mw-browser', _c.win);
      const tree = u.el('div', 'mw-tree', body);
      const rows = [
        ['⊟', '/', 'root'], ['⊟', 'usr', 'indent'], ['', 'bin', 'deep'],
        ['', 'lib', 'deep'], ['⊟', 'local', 'deep'], ['', 'documents', 'selected'],
        ['', 'images', 'deep'], ['', 'tools', 'deep'], ['⊞', 'etc', 'indent'], ['⊞', 'var', 'indent'],
      ];
      rows.forEach(([sign, name, cls]) => {
        const row = u.el('div', 'mw-tree-row ' + cls, tree);
        u.el('span', 'mw-expander', row, sign);
        u.el('span', 'mw-folder', row, '');
        u.el('span', 'mw-folder-name', row, name);
      });
      const files = u.el('section', 'mw-files', body);
      const heads = u.el('div', 'mw-file-head', files);
      for (const label of ['Name', 'Size', 'Modified']) u.el('span', '', heads, label);
      Object.assign(_c, { body, files });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.brief;
      base(_c);
      _c.body = body;
      const panel = _c.brief.querySelector('.ref-panel');
      if (panel) panel.classList.add('mw-instruction');
      // Toast is inserted before this static reference material in frame.toast.
      const info = _c.util.el('div', 'mw-reference', _c.brief);
      const section = (title, copy) => {
        _c.util.el('b', 'mw-section-title', info, title);
        _c.util.el('p', 'mw-copy', info, copy);
      };
      section('Workspace', 'Browse the interface on the right. The file explorer displays the contents of the current directory.');
      section('Feedback', 'After each click, you’ll get a hint (HOT or COLD). A previous click is shown on the right with its result.');
      section('Controls', 'Use the mouse to click. You can also use the keyboard (Tab to move focus, Enter to activate buttons).');
      _c.info = info;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage mw-stage', _c.files);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('mw-toast-instruction');
        _c.brief.insertBefore(note, _c.info);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const footer = document.body.querySelector('.ref-foot');
      footer.classList.add('mw-footer');
      _c.win.appendChild(footer);
      const count = footer.querySelector('.ref-foot-text');
      count.classList.add('mw-count');
      count.textContent = '0 items';
      const tools = footer.querySelector('.ref-tools');
      const open = _c.util.el('button', 'mw-open', footer, 'Open');
      const properties = _c.util.el('button', 'mw-properties', footer, 'Properties');
      footer.insertBefore(open, tools);
      footer.insertBefore(properties, tools);
      _c.footer = footer;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.footer.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body);
      const messages = {
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
    name: 'design-solve-puzzle-hot-cold-10',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-solve-puzzle-hot-cold-10': palette },
      LOW_THEME: palette,
      ACCENTS: ['#254d87'],
      LOW_ACCENTS: ['#254d87'],
      parts,
    },
  });
})();
