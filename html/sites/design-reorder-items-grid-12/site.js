(function () {
  'use strict';
  const C = { foot: 'Order: left to right, top to bottom', accent: '#ff8a1f' };
  const ICONS = {
    New: '<path d="M8 3h13l5 5v21H8z" fill="#fff" stroke="#000" stroke-width="2"/><path d="M21 3v5h5" fill="none" stroke="#000" stroke-width="2"/>',
    Open: '<path d="M3 8h9l3 3h14v17H3z" fill="#ffe600" stroke="#000" stroke-width="2"/>',
    Save: '<path d="M4 4h22l3 3v22H4z" fill="#1235c8" stroke="#000" stroke-width="2"/><rect x="9" y="4" width="13" height="9" fill="#fff" stroke="#000"/><path d="M13 5v6M19 5v6" stroke="#000" stroke-width="2"/><rect x="9" y="19" width="14" height="10" fill="#ddd" stroke="#000" stroke-width="1.5"/>',
    Close:
      '<path d="M5 5L27 27M27 5L5 27" stroke="#e01010" stroke-width="7"/><path d="M5 5L27 27M27 5L5 27" stroke="#600" stroke-width="1" opacity=".5"/>',
    Undo: '<path d="M12 6L4 14l8 8V17c8-1 12 2 15 9 0-10-5-16-15-16z" fill="#3f78e0" stroke="#123" stroke-width="1.5"/>',
    Redo: '<path d="M20 6l8 8-8 8V17C12 16 8 19 5 26c0-10 5-16 15-16z" fill="#3f78e0" stroke="#123" stroke-width="1.5"/>',
    Shuffle:
      '<rect x="4" y="4" width="24" height="24" fill="#fff" stroke="#000" stroke-width="2"/><g fill="#000"><circle cx="10" cy="10" r="2.5"/><circle cx="22" cy="10" r="2.5"/><circle cx="16" cy="16" r="2.5"/><circle cx="10" cy="22" r="2.5"/><circle cx="22" cy="22" r="2.5"/></g>',
    Reset:
      '<rect x="4" y="4" width="24" height="24" fill="#fff" stroke="#000" stroke-width="2"/><path d="M12 4v24M20 4v24M4 12h24M4 20h24" stroke="#000" stroke-width="2"/>',
    'Auto Sort': '<path d="M19 2L8 18h7l-3 12 13-18h-7z" fill="#222" stroke="#000" stroke-width="1"/>',
    Grid: '<g fill="#c0c0c0" stroke="#000" stroke-width="2"><rect x="5" y="6" width="4" height="4"/><rect x="13" y="6" width="4" height="4"/><rect x="21" y="6" width="4" height="4"/><rect x="5" y="14" width="4" height="4"/><rect x="13" y="14" width="4" height="4"/><rect x="21" y="14" width="4" height="4"/><rect x="5" y="22" width="4" height="4"/><rect x="13" y="22" width="4" height="4"/><rect x="21" y="22" width="4" height="4"/></g>',
    List: '<rect x="4" y="4" width="24" height="24" fill="#fff" stroke="#1235c8" stroke-width="2"/><path d="M7 9h18M7 13h18M7 17h18M7 21h18M7 25h18" stroke="#1235c8" stroke-width="2"/>',
  };
  const GROUPS = [
    ['File', ['New', 'Open', 'Save', '|', 'Close']],
    ['Edit', ['Undo', 'Redo']],
    ['Arrange', ['Shuffle', '|', 'Reset']],
    ['Quick action', ['Auto Sort']],
    ['View', ['Grid', '|', 'List']],
  ];
  const palette = { bg: '#8a95a8', panel: '#c0c0c0', fg: '#000', muted: '#444', line: '#000' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // Match the Workbench's original panel breakpoint.
      if (_c.ctx.display === 'panel' && _c.W >= 1120) _c.display = 'panel';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('design', 'amiga');
      const shell = u.el('div', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const tb = u.el('div', 'titlebar', head);
      u.el('span', 'gadget close', tb, 'I');
      u.el('span', 'ttl', tb, 'Amiga Workbench - Tile Sorter');
      const wc = u.el('div', 'window-controls', tb);
      for (const g of ['_', '□', '×']) {
        const b = u.el('button', '', wc, g);
        b.type = 'button';
        b.onclick = () => env.log('window-control', { label: g });
      }
      const rib = u.el('div', 'ribbon', head);
      for (const [name, tools] of GROUPS) {
        const gr = u.el('div', 'tool-group g-' + name.replace(/\s/g, '').toLowerCase(), rib);
        u.el('div', 'gname', gr, name);
        const row = u.el('div', 'trow', gr);
        for (const t of tools) {
          if (t === '|') {
            u.el('span', 'sep', row);
            continue;
          }
          const bt = u.el('button', 'tool' + (t === 'Grid' ? ' selected' : ''), row);
          bt.type = 'button';
          const dis = t === 'Undo' || t === 'Redo' || t === 'Auto Sort';
          if (dis) {
            bt.classList.add('off');
            bt.disabled = true;
            bt.setAttribute('aria-disabled', 'true');
          }
          const svg = u.svg('svg', { width: 32, height: 32, viewBox: '0 0 32 32' }, bt);
          svg.innerHTML = ICONS[t];
          u.el('span', '', bt, t);
          if (!dis)
            bt.onclick = () => {
              if (t === 'Reset') env.widgetDef.clear?.();
              if (t === 'Grid' || t === 'List') {
                row.querySelectorAll('.tool').forEach((x) => x.classList.remove('selected'));
                bt.classList.add('selected');
              }
              env.log('tool', { label: t });
            };
        }
      }
      const content = u.el('div', 'content');
      const note = u.el('section', 'task-note', content);
      note.hidden = _c.display !== 'header';
      if (_c.display === 'panel') content.classList.add('panel-mode');
      Object.assign(_c, { shell, content, toolbar: tb, header: note });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      const h = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = h;
    },
    'frame.body': () => (_c) => {
      _c.shell.appendChild(_c.content);
      _c.body = _c.content;
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) panel.classList.add('task-note', 'instruction-panel');
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      const stage = u.el('main', 'stage', _c.body);
      stage.dataset.role = 'stage';
      const cursor = u.svg('svg', { class: 'scenic-cursor', viewBox: '0 0 24 36', 'aria-hidden': 'true' }, _c.body);
      cursor.innerHTML = '<path d="M2 1v27l6-7 5 13 5-2-5-12h9z" fill="#fff" stroke="#000" stroke-width="2" stroke-linejoin="miter"/>';
      _c.stage = stage;
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('task-note', 'instruction-toast');
        _c.body.insertBefore(note, _c.stage);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('footer');
      _c.shell.appendChild(foot);
      const ready = foot.querySelector('.ref-foot-text');
      ready.className = 'ref-foot-text footer-ready';
      ready.textContent = 'Ready.';
      const tools = foot.querySelector('.ref-tools');
      const tiles = _c.util.el('div', 'footer-cell', null, 'Tiles: ' + ((_c.ctx.spec && _c.ctx.spec.items && _c.ctx.spec.items.length) || ''));
      const order = _c.util.el('div', 'footer-cell wide', null, C.foot);
      foot.insertBefore(tiles, tools);
      foot.insertBefore(order, tools);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
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
    name: 'design-reorder-items-grid-12',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'amiga.css', 'site.css'],
    design: {
      THEMES: { 'design-reorder-items-grid-12': palette },
      LOW_THEME: palette,
      ACCENTS: [C.accent],
      LOW_ACCENTS: [C.accent],
      parts,
    },
  });
})();
