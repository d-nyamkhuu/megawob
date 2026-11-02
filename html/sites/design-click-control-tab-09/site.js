(function () {
  'use strict';
  const cfg = { title: 'My Notebook', menus: ['File', 'Edit', 'View', 'Tools', 'Help'] };
  const NOTE =
    '<svg viewBox="0 0 128 144" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="paper" x2=".8" y2="1"><stop stop-color="#fff"/><stop offset=".8" stop-color="#f3f7ff"/><stop offset="1" stop-color="#c3d0e2"/></linearGradient><linearGradient id="pencil"><stop stop-color="#a05b06"/><stop offset=".24" stop-color="#ffdf66"/><stop offset=".5" stop-color="#ffb41a"/><stop offset=".8" stop-color="#f9a516"/><stop offset="1" stop-color="#a65e03"/></linearGradient><linearGradient id="metal"><stop stop-color="#59616c"/><stop offset=".35" stop-color="#f6fcff"/><stop offset=".65" stop-color="#b2bdc8"/><stop offset="1" stop-color="#52565e"/></linearGradient><linearGradient id="eraser"><stop stop-color="#81140e"/><stop offset=".45" stop-color="#ff6557"/><stop offset="1" stop-color="#b5160e"/></linearGradient></defs><path d="m13 25 79-5 2 119-79 5Z" fill="#000" opacity=".16"/><path d="m10 21 79-4 3 120-79 5Z" fill="url(#metal)" stroke="#5e636c" stroke-width="2"/><path d="m15 17 73-3 1 119-73 5Z" fill="url(#paper)" stroke="#8a9aad" stroke-width="2"/><path d="m22 19 1 112" stroke="#bcc7d4" stroke-width="1.5"/><path d="m29 39 51-3m-51 20 51-4m-51 20 51-4m-51 20 51-4m-51 20 51-4m-51 20 51-4" stroke="#c9d7e7" stroke-width="3"/><g fill="#d29532" stroke="#76521e" stroke-width="1.5"><rect x="18" y="9" width="5" height="18" rx="2"/><rect x="39" y="7" width="5" height="18" rx="2"/><rect x="60" y="6" width="5" height="18" rx="2"/><rect x="80" y="5" width="5" height="18" rx="2"/></g><g transform="rotate(40 78 72)"><path d="M70 24h16v74H70Z" fill="url(#pencil)" stroke="#784a12" stroke-width="1.5"/><path d="m70 98 8 23 8-23Z" fill="#e6c28d" stroke="#665043" stroke-width="1.5"/><path d="m75 113 3 8 3-8Z" fill="#222"/><path d="M70 15h16v12H70Z" fill="url(#metal)" stroke="#5d6269" stroke-width="1.5"/><path d="M70 15V5q0-3 3-3h10q3 0 3 3v10Z" fill="url(#eraser)" stroke="#92221a" stroke-width="1.5"/><path d="M73 29v65" stroke="#ffe997" stroke-width="2"/></g></svg>';
  const CHECK = '<svg viewBox="0 0 28 26" width="36" height="36"><defs><linearGradient id="checkgreen" x2="0" y2="1"><stop stop-color="#91ec49"/><stop offset=".5" stop-color="#38b622"/><stop offset="1" stop-color="#148900"/></linearGradient></defs><path d="m2 13 4-4 6 6L23 2l4 3-15 19Z" fill="url(#checkgreen)" stroke="#176911" stroke-width="1" stroke-linejoin="round"/><path d="m4 13 2-2 6 7L24 4" fill="none" stroke="#b0f283" stroke-width="1"/></svg>';
  function styleControls(parent) {
    for (const b of parent.querySelectorAll('.ref-submit')) {
      b.classList.add('submit');
      if (!b.classList.contains('ref-icon')) {
        const label = b.textContent;
        b.innerHTML = CHECK;
        const span = document.createElement('span');
        span.textContent = label;
        b.appendChild(span);
      }
    }
  }
  const palette = { bg: '#0a4fd0', panel: '#fffefa', fg: '#10102d', muted: '#2b4a8f', line: '#d6d2c0' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // Preserve the notebook's own note modes and width fallback.
      _c.display = _c.ctx.display || 'header';
      if (_c.display === 'panel' && _c.ctx.size && _c.ctx.size.width < 1100) _c.display = 'header';
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.sidebar = false;
      _c.nav = false;
    },
    'frame.header': () => (_c) => {
      const ctx = _c.ctx;
      const u = ctx.util;
      document.body.className = 'ref xp';
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const title = u.el('div', 'title', head);
      const ic = u.el('span', 'app-icon', title);
      ic.innerHTML =
        '<svg viewBox="0 0 28 30"><path d="M5 4h15l4 5-3 18H5L2 23V7Z" fill="#ffcf28" stroke="#895500"/><path d="m7 7 13-2v18L6 25Z" fill="#fff4a6" stroke="#ba8b20"/><path d="m10 10 9-1v12l-9 1Z" fill="#fffcea" stroke="#c6a746"/><path d="m18 7 5-5 3 3-6 6-2 5-2-2Z" fill="#ffda52" stroke="#a36c15"/><path d="M4 27h9" stroke="#705925" stroke-width="2"/></svg>';
      u.el('span', 'title-text', title, cfg.title);
      const wc = u.el('span', 'window-controls', title);
      wc.innerHTML =
        '<i class="min"><svg viewBox="0 0 16 16"><path d="M4 12h6" stroke="#fff" stroke-width="3"/></svg></i><i class="max"><svg viewBox="0 0 16 16"><rect x="3" y="3" width="10" height="10" fill="none" stroke="#fff" stroke-width="2"/><path d="M3 4h10" stroke="#fff" stroke-width="3"/></svg></i><i class="close"><svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13" stroke="#fff" stroke-width="2.5"/></svg></i>';
      const tools = u.el('div', 'tools', head);
      cfg.menus.forEach((m) => u.el('span', '', tools, m));
      const work = u.el('div', 'work', shell);
      const book = u.el('section', 'book', work);
      for (let i = 0; i < 6; i++) {
        const r = u.el('span', 'ring', book);
        r.style.top = [8.8, 22.6, 37.2, 50.2, 64.4, 82][i] + '%';
        r.innerHTML =
          '<svg viewBox="0 0 56 28"><defs><linearGradient id="ring' +
          i +
          '" x2="0" y2="1"><stop stop-color="#6a6964"/><stop offset=".3" stop-color="#e8e7dd"/><stop offset=".48" stop-color="#fafaf5"/><stop offset=".72" stop-color="#b6b6af"/><stop offset="1" stop-color="#65645f"/></linearGradient></defs><ellipse cx="45" cy="14" rx="10" ry="11" fill="#5d5c58" stroke="#9e9d96" stroke-width="2"/><path d="M44 15C42 7 9 7 5 12c-5 5-2 12 5 10l7-2" fill="none" stroke="#565550" stroke-width="10" stroke-linecap="round"/><path d="M44 15C42 7 9 7 5 12c-5 5-2 12 5 10l7-2" fill="none" stroke="url(#ring' +
          i +
          ')" stroke-width="7" stroke-linecap="round"/></svg>';
      }
      const top = u.el('div', 'notehead', book);
      const ico = u.el('span', 'note-icon', top);
      ico.innerHTML = NOTE;
      book.dataset.display = _c.display;
      top.hidden = _c.display !== 'header';
      Object.assign(_c, { shell, tools, book, header: top });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const instruction = _c.header.querySelector('.ref-instruction');
      if (instruction) {
        instruction.classList.add('instruction');
        instruction.classList.toggle('short', _c.ctx.instruction.length < 30);
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.tools;
      base(_c);
      _c.header = header;
      _c.headerTools.classList.add('toolbar-end');
      styleControls(_c.headerTools);
    },
    'frame.body': () => (_c) => { _c.body = _c.book; },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.book.querySelector('.ref-panel');
      if (panel) panel.classList.add('episode-panel');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.book);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('episode-toast');
        note.setAttribute('role', 'status');
        _c.book.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('footer');
      _c.book.appendChild(foot);
      styleControls(foot);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) {
        _c.foot.appendChild(dock);
        styleControls(dock);
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
    name: 'design-click-control-tab-09',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css', 'xp.css'],
    design: {
      THEMES: { 'design-click-control-tab-09': palette },
      LOW_THEME: palette,
      ACCENTS: ['#0b3fbf'],
      LOW_ACCENTS: ['#0b3fbf'],
      parts,
    },
  });
})();
