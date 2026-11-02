(function () {
  'use strict';
  const cfg = {
    title: 'User Settings',
    obstacle: 'Welcome!',
    copy: 'This short tour will show you around the interface.',
    dismiss: 'Skip tour',
  };
  const ICONS = {
    floppy: '<svg viewBox="0 0 48 48"><path d="M5 3h34l4 4v38H5Z" fill="#f4f4f4" stroke="#111" stroke-width="3"/><rect x="12" y="4" width="22" height="14" fill="#fff" stroke="#111" stroke-width="3"/><rect x="26" y="7" width="4" height="8" fill="#111"/><rect x="11" y="26" width="26" height="17" fill="#fff" stroke="#111" stroke-width="2"/></svg>',
    folder: '<svg viewBox="0 0 48 48"><path d="M3 10h16l4 5h22v28H3Z" fill="#f4f4f4" stroke="#111" stroke-width="3"/><path d="M3 18h42" stroke="#111" stroke-width="2"/></svg>',
    trash: '<svg viewBox="0 0 48 48"><rect x="19" y="3" width="10" height="5" fill="#fff" stroke="#111" stroke-width="2.5"/><path d="M8 10h32v4H8Z" fill="#f4f4f4" stroke="#111" stroke-width="2.5"/><path d="M11 14h26l-2 31H13Z" fill="#e8e8e8" stroke="#111" stroke-width="2.5"/><path d="M19 18v24M24 18v24M29 18v24" stroke="#111" stroke-width="2"/></svg>',
    logo: '<svg viewBox="0 0 40 40"><path d="M3 38l2-9 10-4h10l10 5 2 8Z" fill="#111"/><path d="m15 26 5 9 5-9M19 30h3v6h-3Z" fill="#eee"/><path d="m12 13 2-6 6-3 7 1 4-2 3 4-4 5-1 8-5 6-7-3-3-5Z" fill="#eee" stroke="#111" stroke-width="2"/><path d="m14 12 4-4 6 1 3-3M17 14l3-3 5 1-2 4 4 1-3 4-5-1-3-4M20 21l3 2" fill="none" stroke="#111" stroke-width="1.5"/></svg>',
  };
  const palette = { bg: '#ececec', panel: '#f2f2f2', fg: '#111', muted: '#222', line: '#111' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // Every mode has its own desktop note window, including narrow viewports.
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
      document.body.classList.add('ref', 'gem');
      const desk = u.el('main', 'desk', document.body);
      const bar = u.el('header', 'menubar', desk);
      const lg = u.el('span', 'mb-logo', bar);
      lg.innerHTML = ICONS.logo;
      ['Desk', 'File', 'Edit', 'View', 'Options'].forEach((s) => u.el('span', 'mb-item', bar, s));
      u.el('span', 'mb-clock', bar, 'Mon Mar 16, 1987   10:24 AM');
      const task = u.el('section', 'taskwin', desk);
      task.dataset.display = _c.display;
      task.hidden = _c.display === 'hidden';
      u.el('div', 'tw-title', task,
        _c.display === 'panel' ? 'Instructions' : _c.display === 'toast' ? 'Task notice' : 'Task');
      Object.assign(_c, { desk, bar, task, header: task });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.task.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('instruction');
        note.dataset.display = _c.display;
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.bar;
      base(_c);
      _c.header = header;
      _c.bar.insertBefore(_c.headerTools, _c.bar.querySelector('.mb-clock'));
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      [ ['floppy', 'Floppy', 1], ['folder', 'Documents', 2], ['trash', 'Trash', 3] ].forEach((a) => {
        const ic = u.el('div', 'dicon i' + a[2], _c.desk);
        const g = u.el('span', 'dg', ic);
        g.innerHTML = ICONS[a[0]];
        u.el('span', 'dl', ic, a[1]);
      });
      const dlg = u.el('section', 'dialog', _c.desk);
      const tb = u.el('div', 'dtitle', dlg);
      u.el('span', 'dclose', tb);
      u.el('span', 'dtext', tb, cfg.title);
      const pointer = u.el('span', 'gem-pointer', dlg);
      pointer.setAttribute('aria-hidden', 'true');
      pointer.innerHTML = '<svg viewBox="0 0 24 34"><path d="M2 2v26l6-6 5 10 5-3-5-10h9Z" fill="white" stroke="#111" stroke-width="2"/></svg>';
      Object.assign(_c, { body: dlg });
    },
    'frame.panel': (base) => (_c) => {
      base({ ..._c, body: _c.task });
      const note = _c.task.querySelector('.ref-panel-text');
      if (note) {
        note.classList.add('instruction');
        note.dataset.display = _c.display;
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.body);
      _c.util.el('hr', 'drule', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        _c.task.appendChild(note);
        const text = note.querySelector('.ref-note-text');
        text.classList.add('instruction', 'instruction-toast');
        text.dataset.display = _c.display;
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('dfoot');
      _c.body.appendChild(foot);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.desk.appendChild(dock);
      const note = _c.task.querySelector('.instruction');
      if (!_c.task.hidden && note) {
        const top = note.offsetParent === _c.task ? note.offsetTop :
          Math.round(note.getBoundingClientRect().top - _c.task.getBoundingClientRect().top - _c.task.clientTop);
        const bottom = top + note.offsetHeight;
        if (bottom > _c.task.clientHeight) _c.task.style.height = bottom + 4 + 'px';
        if (_c.task.getBoundingClientRect().top < _c.bar.getBoundingClientRect().bottom + 8) {
          _c.task.dataset.display = 'header';
          _c.task.querySelector('.tw-title').textContent = 'Task';
        }
      }
    },
    overlay: () => (ctx) => {
      const el = ctx.util.el(
        'section',
        'perturb ' + (ctx.kind === 'chat' ? 'chat tour-overlay ' : '') + ctx.kind,
        document.body,
      );
      const head = ctx.kind === 'chat' ? cfg.obstacle : {
        cookie: 'Cookie preferences', toast: 'Notification', promo: 'A special offer', banner: 'Service notice',
      }[ctx.kind];
      const body = ctx.kind === 'chat' ? cfg.copy : {
        cookie: 'Choose your preferences to continue.', toast: 'Your workspace is ready.',
        promo: 'Explore the latest tools.', banner: 'A new update is available.',
      }[ctx.kind];
      ctx.util.el('strong', '', el, head);
      ctx.util.el('p', '', el, body);
      const dismiss = ctx.util.el('button', 'dismiss dismiss-design', el,
        ctx.kind === 'cookie' ? 'Accept' : ctx.kind === 'chat' ? cfg.dismiss : 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-click-control-widget-07',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'gem.css', 'site.css'],
    design: {
      THEMES: { 'design-click-control-widget-07': palette }, LOW_THEME: palette,
      ACCENTS: ['#111'], LOW_ACCENTS: ['#111'], parts,
    },
  });
})();
