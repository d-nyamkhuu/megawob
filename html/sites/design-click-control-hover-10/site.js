(function () {
  'use strict';
  const C = {
    title: 'Focus Task',
    menus: ['File', 'Edit', 'Document', 'Special', 'Help'],
    clock: 'Mon Jan 14  10:27 AM',
    para: [
      'This workspace contains the active controls and a separate information pane.',
      'The information below shows the current workspace status.',
    ],
    details: [
      ['Workspace:', 'Focus Task'],
      ['Status:', 'Ready'],
      ['Note:', 'Your workspace is ready.'],
    ],
    icons: {
      Notes: '<svg viewBox="0 0 52 64"><path d="M5 3h30l13 14v44H5Z" fill="#f6f3e8" stroke="#000" stroke-width="2"/><path d="M35 3v14h13M12 12h16M12 19h16M12 25h29M12 31h29M12 37h29M12 43h29M12 49h29M12 55h29" fill="none" stroke="#000" stroke-width="1.5"/><path d="M7 63h43V19" fill="none" stroke="#000" stroke-width="2"/></svg>',
      Tools: '<svg viewBox="0 0 62 58"><path d="M7 5h48l5 4v13l-3 3v30H5V22H2V13Z" fill="#f6f3e8" stroke="#000" stroke-width="2"/><path d="M2 13h53l5-4M2 21h53V13M55 21v34M21 25v7h15v-7M7 53h46" fill="none" stroke="#000" stroke-width="1.7"/></svg>',
      Trash: '<svg viewBox="0 0 50 68"><path d="M5 15l2 45q18 10 36 0l2-45" fill="#f6f3e8" stroke="#000" stroke-width="2"/><ellipse cx="25" cy="14" rx="23" ry="6" fill="#f6f3e8" stroke="#000" stroke-width="2"/><ellipse cx="25" cy="12" rx="19" ry="3" fill="none" stroke="#000"/><path d="M19 10V5q6-3 12 0v5Z" fill="#f6f3e8" stroke="#000" stroke-width="2"/><path d="M12 23l1 34M19 24v36M26 24v37M33 24v36M39 23l-1 34" stroke="#000" stroke-width="1.5"/></svg>',
    },
  };
  const palette = { bg: '#bfbdaf', panel: '#f0eee2', fg: '#111111', muted: '#4b4a44', line: '#000000' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original has a dedicated place for every note mode at every size.
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
      document.body.classList.add('ref', 'lisa');
      const bar = u.el('div', 'menubar', document.body);
      const ap = u.el('span', 'apple', bar);
      ap.innerHTML = '<svg viewBox="0 0 16 16"><path d="M11.2 8.5c0-1.6 1.3-2.3 1.4-2.4-.8-1.1-1.9-1.3-2.3-1.3-1-.1-1.9.6-2.4.6s-1.3-.6-2.1-.5C4.7 4.900 3.700 5.500 3.200 6.500 2.100 8.400 2.900 11.200 4 12.800c.5.8 1.100 1.600 1.900 1.600.8 0 1.100-.5 2-.5s1.200.5 2 .5 1.400-.8 1.900-1.500c.6-.9.8-1.700.9-1.800-.1 0-1.500-.6-1.500-2.600zM9.700 3.700c.4-.5.7-1.200.6-1.900-.6 0-1.400.4-1.800.9-.4.4-.7 1.100-.6 1.800.7.1 1.400-.3 1.800-.8z"/></svg>';
      C.menus.forEach((m) => u.el('span', 'mi', bar, m));
      const right = u.el('span', 'mright', bar);
      const tray = u.el('i', 'mtray', right);
      tray.innerHTML = '<svg viewBox="0 0 24 26"><path d="M4 1h19v24H1V4Z M4 1v3H1M6 4h14v18H5V5M9 6v14M13 5l-2 5 3 4-2 5M17 6v14" fill="none" stroke="#111" stroke-width="1.4"/></svg>';
      u.el('span', '', right, C.clock);
      ['Notes', 'Tools', 'Trash'].forEach((n) => {
        const d = u.el('div', 'dicon ' + n.toLowerCase(), document.body);
        const g = u.el('span', 'dg', d);
        g.innerHTML = C.icons[n];
        u.el('span', 'dl', d, n);
      });
      const win = u.el('main', 'win', document.body);
      win.dataset.display = _c.display;
      const pointer = u.el('div', 'lisa-pointer', win);
      pointer.setAttribute('aria-hidden', 'true');
      pointer.innerHTML = '<svg viewBox="0 0 30 44"><path d="M2 2v33l8-8 8 15 6-3-8-15h12Z" fill="#fff" stroke="#111" stroke-width="2.5" stroke-linejoin="round"/></svg>';
      win.addEventListener('pointermove', (e) => {
        pointer.style.left = e.clientX + 'px';
        pointer.style.top = e.clientY + 'px';
      });
      const tb = u.el('div', 'tbar', win);
      u.el('i', 'box close', tb);
      u.el('span', 'lines', tb);
      u.el('span', 'ttl', tb, C.title);
      u.el('span', 'lines', tb);
      u.el('i', 'box zoom', tb);
      const hd = u.el('div', 'hd', win);
      Object.assign(_c, { win, tb, header: hd });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('instruction');
        note.dataset.display = _c.display;
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.tb;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const para = u.el('div', 'para', _c.win);
      C.para.forEach((t) => u.el('div', '', para, t));
      const side = u.el('aside', 'details', _c.win);
      u.el('h2', '', side, 'Task Details');
      const sb = u.el('div', 'workspace-info', side);
      C.details.forEach(([k, v]) => {
        const p = u.el('p', '', sb);
        p.append(k);
        u.el('br', '', p);
        p.append(v);
      });
      if (_c.display === 'panel') {
        side.classList.add('panel-mode');
        sb.hidden = true;
      }
      const help = u.el('button', 'help', _c.win, 'Help');
      help.type = 'button';
      Object.assign(_c, { body: _c.win, side });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.side;
      base(_c);
      _c.body = body;
      const note = _c.side.querySelector('.ref-panel-text');
      if (note) {
        note.classList.add('instruction', 'panel-note');
        note.dataset.display = 'panel';
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.win);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('instruction-toast');
        const text = note.querySelector('.ref-note-text');
        text.classList.add('instruction');
        text.dataset.display = 'toast';
        _c.header.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      _c.win.appendChild(foot);
      foot.querySelector('.ref-foot-text').textContent = '';
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.win.appendChild(dock);
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
    name: 'design-click-control-hover-10',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'lisa.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#111111'],
      LOW_ACCENTS: ['#111111'],
      parts,
    },
  });
})();
