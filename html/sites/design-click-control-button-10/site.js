(function () {
  'use strict';
  const FOLDER =
    '<svg viewBox="0 0 44 36"><defs><linearGradient id="folder-fill" x2=".5" y2="1"><stop stop-color="#d8d5bd"/><stop offset="1" stop-color="#aaa98d"/></linearGradient></defs><path d="M2 6 5 3h13l4 5h20v26H2Z" fill="url(#folder-fill)" stroke="#25251b" stroke-width="2"/><path d="M3 9h37v23" fill="none" stroke="#f7f5df" stroke-width="1.3"/><path d="M4 33h38V9" fill="none" stroke="#555443"/></svg>';
  const DOC =
    '<svg viewBox="0 0 36 44"><path d="M3 2h20l10 10v30H3Z" fill="#f6f6f1" stroke="#222" stroke-width="2"/><path d="M23 2v10h10M8 7h11M8 11h11M8 16h20M8 20h20M8 24h20M8 28h20M8 32h20M8 36h20" fill="none" stroke="#444" stroke-width="1.5"/><path d="M5 4v36h26" fill="none" stroke="#aaa"/></svg>';
  const FILES = [
    ['Documents', '--', 'Apr 12 10:24', 1],
    ['Pictures', '--', 'Apr 11 09:03', 1],
    ['Projects', '--', 'Apr 10 16:18', 1],
    ['notes.txt', '2 KB', 'Apr 09 14:55', 0],
    ['todo.txt', '1 KB', 'Apr 08 11:20', 0],
    ['report.txt', '4 KB', 'Apr 07 17:06', 0],
  ];
  const palette = { bg: '#cac6bf', panel: '#d1cdc5', fg: '#111111', muted: '#393832', line: '#555555' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // This frame has a task card even in the smaller viewports.
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
      document.body.classList.add('ref', 'motif');
      const shell = u.el('main', 'shell mw', document.body);
      const title = u.el('header', 'mw-title', shell);
      const ic = u.el('span', 'mw-icon', title);
      ic.innerHTML =
        '<svg viewBox="0 0 24 26"><path fill="#eee9dc" stroke="#292920" d="M2 1h20v24H2Z"/><path d="M5 4h3v17H5zM11 4h3v6h-3zM17 4h2v17h-2M10 13h4v8h-4M4 8h16M4 18h16" fill="none" stroke="#4c4b43" stroke-width="1"/><path d="m5 3 14 20M9 3l9 15M4 13l7 10" stroke="#77756c" stroke-width=".6"/></svg>';
      u.el('span', 'mw-title-text', title, 'Task Application');
      const controls = u.el('span', 'window-controls', title);
      controls.innerHTML =
        '<i><svg viewBox="0 0 16 16"><path d="M3 13h8"/></svg></i><i><svg viewBox="0 0 16 16"><path d="M3 3h10v10H3Z"/></svg></i><i><svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13"/></svg></i>';
      const ip = u.el('div', 'ipanel');
      ip.hidden = _c.display === 'hidden';
      Object.assign(_c, { shell, header: ip });
    },
    'frame.nav': () => (_c) => {
      const u = _c.util;
      const menu = u.el('div', 'mw-menu', _c.shell);
      ['File', 'Edit', 'View', 'Tools'].forEach((l) => {
        const m = u.el('span', 'menu-label', menu);
        u.el('u', '', m, l[0]);
        u.el('span', '', m, l.slice(1));
      });
      u.el('span', 'menu-label help', menu, 'Help');
      _c.menu = menu;
    },
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('instruction', 'instruction-copy');
        note.dataset.display = _c.display;
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.menu;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'mw-body', _c.shell);
      body.dataset.display = _c.display;
      body.appendChild(_c.header);
      const main = u.el('div', 'mw-main', body);
      const files = u.el('div', 'group files', main);
      u.el('span', 'legend', files, 'Files');
      const list = u.el('div', 'flist', files);
      const head = u.el('div', 'frow fhead', list);
      ['Name', 'Size', 'Modified'].forEach((h) => u.el('span', 'c', head, h));
      FILES.forEach((f, i) => {
        const r = u.el('div', 'frow' + (i === 0 ? ' sel' : ''), list);
        const n = u.el('span', 'c n', r);
        const ico = u.el('i', 'fi', n);
        ico.innerHTML = f[3] ? FOLDER : DOC;
        u.el('span', '', n, f[0]);
        u.el('span', 'c', r, f[1]);
        u.el('span', 'c', r, f[2]);
      });
      const sb = u.el('div', 'vscroll', list);
      u.el('span', 'sb-up', sb);
      u.el('span', 'sb-thumb', sb);
      u.el('span', 'sb-down', sb);
      const right = u.el('div', 'rightcol', main);
      if (_c.display === 'panel') right.prepend(_c.header);
      Object.assign(_c, { body, right });
    },
    'frame.panel': (base) => (_c) => {
      base({ ..._c, body: _c.header });
      const note = _c.header.querySelector('.ref-panel');
      if (note) {
        note.classList.add('instruction');
        note.dataset.display = _c.display;
        note.querySelector('.ref-panel-title').textContent = 'Task instructions';
      }
      const u = _c.util;
      const det = u.el('div', 'group details', _c.right);
      u.el('span', 'legend', det, 'Details');
      const dh = u.el('div', 'dhead', det);
      const di = u.el('i', 'fi big', dh);
      di.innerHTML = FOLDER;
      u.el('b', '', dh, 'Documents');
      [
        ['Type:', 'Folder'],
        ['Size:', '--'],
        ['Modified:', 'Apr 12 10:24'],
      ].forEach(([a, b]) => {
        const r = u.el('div', 'drow', det);
        u.el('span', '', r, a);
        u.el('span', '', r, b);
      });
      const r4 = u.el('div', 'drow sep', det);
      u.el('span', '', r4, 'Contains:');
      u.el('span', '', r4, '3 items');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.right);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('instruction', 'instruction-toast');
        note.dataset.display = _c.display;
        _c.header.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('footer');
      _c.shell.appendChild(foot);
      const ready = foot.querySelector('.ref-foot-text');
      ready.classList.add('ready');
      ready.textContent = 'Ready.';
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const el = ctx.util.el('section', 'perturb ' + ctx.kind, document.body);
      ctx.util.el(
        'strong',
        '',
        el,
        {
          cookie: 'Cookie preferences',
          toast: 'Notification',
          chat: 'Support',
          promo: 'A special offer',
          banner: 'Service notice',
        }[ctx.kind],
      );
      ctx.util.el(
        'p',
        '',
        el,
        {
          cookie: 'Choose your preferences to continue.',
          toast: 'Your workspace is ready.',
          chat: 'How can we help?',
          promo: 'Explore the latest tools.',
          banner: 'A new update is available.',
        }[ctx.kind],
      );
      const dismiss = ctx.util.el('button', 'dismiss', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-click-control-button-10',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { motif: palette },
      LOW_THEME: palette,
      ACCENTS: ['#1d2f65'],
      LOW_ACCENTS: ['#1d2f65'],
      parts,
    },
  });
})();
