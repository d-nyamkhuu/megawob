(function () {
  'use strict';
  const ICONS = {
    wifi: '<svg viewBox="0 0 24 24"><path d="M2 9a14 14 0 0 1 20 0l-2 2a11 11 0 0 0-16 0Zm4 4a8 8 0 0 1 12 0l-2 2a5 5 0 0 0-8 0Zm4 4a3 3 0 0 1 4 0l-2 2Z"/></svg>',
    vol: '<svg viewBox="0 0 24 24"><path d="M3 9h4l5-4v14l-5-4H3Zm13-1a5 5 0 0 1 0 8M18 5a9 9 0 0 1 0 14" stroke="#fff" stroke-width="2" fill-opacity="1"/></svg>',
    bat: '<svg viewBox="0 0 24 24"><path d="M9 2h6v2h2v18H7V4h2Z"/></svg>',
    doc: '<svg viewBox="0 0 24 24"><path d="M5 2h9l5 5v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Z" fill="#f8f9fb"/><path d="M14 2v6h5M8 12h8M8 15h8M8 18h6" fill="none" stroke="#59616d" stroke-width="1.5"/></svg>',
    newdoc:
      '<svg viewBox="0 0 24 24"><rect x="5" y="4" width="14" height="16" rx="1.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 7v7m-3-3 3 3 3-3M9 17h6" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
    min: '<svg viewBox="0 0 16 16"><path d="M3 12h10" stroke="currentColor" stroke-width="1.6"/></svg>',
    max: '<svg viewBox="0 0 16 16"><path d="M3.5 3.5h9v9h-9Z" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>',
    close: '<svg viewBox="0 0 16 16"><path d="m4 4 8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.6"/></svg>',
    menu: '<svg viewBox="0 0 16 16"><path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" stroke-width="1.6"/></svg>',
  };
  const palette = { bg: '#fbfcfd', panel: '#fbfcfd', fg: '#142033', muted: '#6b7280', line: '#d4d7dc' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original has a dedicated task pane even at the smallest viewport.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('ref', 'gnome');
      const shell = u.el('main', 'shell', document.body);
      const top = u.el('header', 'topbar', shell);
      u.el('span', 'tb-act', top, 'Activities');
      const app = u.el('span', 'tb-app', top);
      app.innerHTML = ICONS.doc + '<b>Text Editor</b>';
      u.el('span', 'tb-clock', top, 'Apr 23  10:24');
      const ind = u.el('span', 'tb-ind', top);
      ind.innerHTML = ICONS.wifi + ICONS.vol + ICONS.bat;
      const row = u.el('div', 'work', shell);
      const win = u.el('section', 'win', row);
      const hb = u.el('div', 'headerbar', win);
      const l = u.el('div', 'hb-l', hb);
      const open = u.el('span', 'hb-btn open', l, 'Open');
      open.innerHTML = 'Open <i class="caret"></i>';
      const sv = u.el('span', 'hb-btn sq', l);
      sv.innerHTML = ICONS.newdoc;
      const t = u.el('div', 'hb-title', hb);
      u.el('b', '', t, 'Project Notes.txt');
      u.el('small', '', t, '~/Documents');
      const r = u.el('div', 'hb-r', hb);
      u.el('span', 'hb-btn', r, 'Save');
      const mn = u.el('span', 'hb-btn sq', r);
      mn.innerHTML = ICONS.menu;
      const wc = u.el('span', 'hb-wc', r);
      wc.innerHTML = '<i>' + ICONS.min + '</i><i>' + ICONS.max + '</i><i class="x">' + ICONS.close + '</i>';
      const aside = u.el('aside', 'margin', row);
      const taskHeading = u.el('h2', '', aside, 'Task');
      taskHeading.hidden = _c.display === 'hidden';
      aside.dataset.display = _c.display;
      const noteHost = u.el('div', 'task-note', aside);
      u.el('h2', 'notes-h', aside, 'Notes');
      const ul = u.el('ul', '', aside);
      [
        'Use the dialog box shown in the editor.',
        'Click the requested control.',
        'Do not close the app in any other way.',
      ].forEach((s, i) => u.el('li', i === 0 ? 'dialog-status-note' : '', ul, s));
      u.el('div', 'spacer', aside);
      Object.assign(_c, { shell, row, win, toolbar: r, aside, header: noteHost });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.row;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.win);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.header.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const sb = _c.util.el('div', 'statusbar', _c.win);
      sb.innerHTML =
        '<span>Plain Text <i class="caret"></i></span><span>Tab Width: 4 <i class="caret"></i></span><span>Ln 11, Col 1</span><span>INS</span>';
      const foot = document.body.querySelector('.ref-foot');
      if (foot) sb.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) {
        _c.util.el('hr', '', _c.aside);
        _c.aside.appendChild(dock);
      }
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
    name: 'design-click-control-dialog-03',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-click-control-dialog-03': palette },
      LOW_THEME: palette,
      ACCENTS: ['#0c6ee8'],
      LOW_ACCENTS: ['#0c6ee8'],
      parts,
    },
  });
})();
