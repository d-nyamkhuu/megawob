(function () {
  'use strict';
  const palette = { bg: '#f1f2f4', panel: '#ffffff', fg: '#1b2434', muted: '#737983', line: '#d9dde2' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // This workspace has a dedicated note card even at compact viewports.
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
      document.body.classList.add('ref', 'gnome', 'workspace');
      const desktop = u.el('div', 'desktop-bar', document.body);
      u.el('span', 'activities', desktop, 'Activities');
      u.el('span', 'desktop-app', desktop, '▣  Text Exercise');
      u.el('span', 'desktop-clock', desktop, 'Mar 8  10:24');
      u.el('span', 'desktop-status', desktop, '◉  ◖  ▣');
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      u.el('div', 'title', head, 'Text Exercise');
      u.el('div', 'sub', head, 'Read the text and answer');
      const controls = u.el('div', 'app-controls', head);
      controls.innerHTML = '<span>☰</span><span>−</span><span>□</span><span>×</span>';
      const work = u.el('div', 'work', shell);
      work.dataset.display = _c.display;
      const center = u.el('section', 'center', work);
      Object.assign(_c, { shell, head, work, center, header: center });
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
      _c.header = _c.head;
      base(_c);
      _c.header = header;
      const subtitle = _c.head.querySelector('.sub');
      const a = subtitle.getBoundingClientRect();
      const b = _c.headerTools.getBoundingClientRect();
      _c.head.classList.toggle('has-tools', !!_c.headerTools.children.length && a.right > b.left && a.left < b.right);
    },
    'frame.body': () => (_c) => { _c.body = _c.work; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.center;
      base(_c);
      _c.body = body;
      const note = _c.center.querySelector('.ref-panel');
      if (note) {
        note.classList.add('instruction');
        note.dataset.display = _c.display;
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('instruction', 'instruction-toast');
        note.dataset.display = _c.display;
        _c.center.insertBefore(note, _c.stage);
      }
    },
    'frame.footer': (base) => (_c) => {
      const u = _c.util;
      const foot = u.el('footer', 'footer', _c.shell);
      u.el('span', 'ready', foot, '');
      u.el('span', 'flinks', foot, '');
      const dock = u.el('nav', 'dock-nav', foot);
      const icons = [
        '<svg viewBox="0 0 48 48"><path fill="currentColor" d="M7 21 24 6l17 15v20a3 3 0 0 1-3 3H27V29h-6v15H10a3 3 0 0 1-3-3z"/></svg>',
        '<svg viewBox="0 0 48 48"><rect x="8" y="5" width="32" height="38" rx="5" fill="currentColor"/><path d="M16 15h16M16 24h16M16 33h16" stroke="white" stroke-width="3" stroke-linecap="round"/></svg>',
        '<svg viewBox="0 0 48 48"><path fill="currentColor" d="m20 4 8 0 2 6 5 2 5-3 6 6-3 5 2 5 6 2v8l-6 2-2 5 3 5-6 6-5-3-5 2-2 6h-8l-2-6-5-2-5 3-6-6 3-5-2-5-6-2v-8l6-2 2-5-3-5 6-6 5 3 5-2z" transform="translate(2 0) scale(.9)"/><circle cx="24" cy="24" r="8" fill="#eef0f2"/></svg>',
        '<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="21" fill="currentColor"/><path d="M19 18a5.5 5.5 0 1 1 9.5 3.8c-2.4 2.5-4.5 3.1-4.5 7" fill="none" stroke="white" stroke-width="3.5" stroke-linecap="round"/><circle cx="24" cy="35" r="1.8" fill="white"/></svg>',
      ];
      ['Home', 'Text', 'Settings', 'Help'].forEach((label, i) => {
        const item = u.el('div', 'dock-item' + (i === 1 ? ' active' : ''), dock);
        u.el('span', 'dock-icon', item).innerHTML = icons[i];
        u.el('span', 'dock-label', item, label);
      });
      base(_c);
      const controls = document.body.querySelector('.ref-foot');
      foot.appendChild(controls);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.work.appendChild(dock);
      const note = _c.center.querySelector('.instruction');
      if (note) {
        const noteBottom = note.getBoundingClientRect().bottom - _c.work.getBoundingClientRect().top;
        const fieldTop = Math.max(_c.work.clientHeight * 0.355, noteBottom + 24);
        _c.work.style.setProperty('--answer-top', fieldTop + 'px');
        _c.work.style.setProperty('--form-end-top', fieldTop + 126 + 'px');
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
    name: 'design-handle-text-scroll-text-04',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-handle-text-scroll-text-04': palette },
      LOW_THEME: palette,
      ACCENTS: ['#287ce5'],
      LOW_ACCENTS: ['#287ce5'],
      parts,
    },
  });
})();
