(function () {
  'use strict';
  const palette = { bg: '#15171b', panel: '#252b30', fg: '#e4e6ea', muted: '#c3c7cf', line: '#3a3e46' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // Both instruction panes fit this window even at the smallest viewport.
      _c.display = _c.ctx.display || 'header';
      document.body.classList.remove('ref-has-note');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.className = 'ref carbon carbon-layout';
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const title = u.el('div', 'title', head);
      title.innerHTML =
        '<svg class="app-ico" viewBox="0 0 28 28"><defs><linearGradient id="app-blue" x2="0" y2="1"><stop stop-color="#9db6c8"/><stop offset=".45" stop-color="#37688e"/><stop offset="1" stop-color="#1b3047"/></linearGradient></defs><rect x="1" y="1" width="26" height="26" rx="3" fill="#111820" stroke="#9ba6af"/><rect x="3" y="3" width="22" height="22" rx="2" fill="url(#app-blue)"/><path d="M7 11h6v12H7zM16 7h6v14h-6z" fill="#d2e1ec" stroke="#43515f"/><path d="M8 13h4m-4 3h4m5-6h4m-4 3h4m-4 3h4" stroke="#41739a"/><circle cx="13" cy="12" r="3" fill="#e7d8c0" stroke="#4a5156"/><path d="M9 23v-6q4-5 8 0v6" fill="#a5c5df" stroke="#344b67"/><path d="m18 4 2 3 3-1-1 4-3 1-2-3z" fill="#eee9dc"/></svg>';
      u.el('span', '', title, 'Customer Records');
      const wc = u.el('span', 'window-controls', title);
      wc.innerHTML =
        '<i><svg viewBox="0 0 16 16"><path d="M3 12h10"/></svg></i><i><svg viewBox="0 0 16 16"><path d="M3 3h10v10H3Z"/></svg></i><i><svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13"/></svg></i>';
      const menu = u.el('div', 'menubar', head);
      ['File', 'Edit', 'View', 'Tools', 'Help'].forEach((s) => u.el('span', '', menu, s));
      const work = u.el('div', 'work', shell);
      const left = u.el('div', 'col-left', work);
      const task = u.el('section', 'panel task-panel', left);
      u.el('h2', '', task, 'Task');
      task.hidden = _c.display !== 'header' && _c.display !== 'toast';
      Object.assign(_c, { shell, menu, work, left, task, header: menu });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.task;
      base(_c);
      _c.header = header;
      const note = _c.task.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('instruction');
        note.dataset.display = _c.display;
      }
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
      _c.menu.classList.add('has-end');
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const ip = u.el('section', 'panel info-panel', _c.left);
      u.el('h2', '', ip, 'Customer Information');
      const aside = u.el('aside', 'panel details', _c.work);
      u.el('h2', '', aside, 'Details');
      Object.assign(_c, { body: _c.work, ip, aside });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.aside;
      base(_c);
      _c.body = body;
      const note = _c.aside.querySelector('.ref-panel-text');
      if (note) {
        note.classList.add('instruction', 'instruction-panel');
        note.dataset.display = _c.display;
      }
      [
        ['Record Type', 'New Customer'],
        ['Required Fields', '—'],
        ['Status', 'Not submitted'],
      ].forEach((r) => {
        const d = _c.util.el('div', 'kv', _c.aside);
        _c.util.el('span', 'k', d, r[0]);
        _c.util.el('span', 'v' + (r[0] === 'Required Fields' ? ' field-count' : ''), d, r[1]);
      });
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.ip);
      const foot = _c.util.el('footer', 'footer', _c.ip);
      const clear = _c.util.el('button', 'clear-form', foot, 'Clear');
      clear.type = 'button';
      clear.addEventListener('click', () => _c.shell.querySelectorAll('input,textarea').forEach((i) => (i.value = '')));
      _c.foot = foot;
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        _c.task.appendChild(note);
        const text = note.querySelector('.ref-note-text');
        text.classList.add('instruction', 'instruction-toast');
        text.dataset.display = _c.display;
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      _c.foot.appendChild(foot);
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
    name: 'design-click-control-focus-08',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'templates/site/css/click-control-focus-418b19.css', 'carbon.css', 'site.css'],
    design: {
      THEMES: { 'design-click-control-focus-08': palette },
      LOW_THEME: palette,
      ACCENTS: ['#2f7fe0'],
      LOW_ACCENTS: ['#2f7fe0'],
      parts,
    },
  });
})();
