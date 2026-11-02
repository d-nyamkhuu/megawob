(function () {
  'use strict';
  const cfg = {
    'title': 'Copy and Paste',
    'theme': 'minimal',
    'layout': 'docked',
    'tools': 'TaskPad  |  Simple tasks. Real progress.',
    'foot': 'Notes|Calculator|Web Search|Text Tools|Timer|Settings',
  };
  const dockIcons = [
    '<path d="M10 3h15l9 9v25H10a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3Z" fill="currentColor" stroke="currentColor"/><path d="M25 3v10h9" stroke="#85d7bd"/><path d="M14 22h12m-12 7h12" stroke="white"/>',
    '<rect x="8" y="3" width="27" height="35" rx="3"/><path d="M8 14h27"/><path d="M14 20h1m6 0h1m6 0h1M14 26h1m6 0h1m6 0h1M14 32h1m6 0h1m6 0h1" stroke-width="3.4"/>',
    '<circle cx="21" cy="21" r="17"/><ellipse cx="21" cy="21" rx="7" ry="17"/><path d="M5 15h32M5 27h32M21 4v34"/>',
    '<path d="M10 3h17l8 8v24a3 3 0 0 1-3 3H10a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3Z"/><path d="M27 3v9h8M14 16h13M14 23h13M14 30h8"/>',
    '<circle cx="21" cy="21" r="17"/><path d="M21 10v12l9 6"/>',
    '<path d="m18 3-2 5-4 2-5-1-3 6 4 4v4l-4 4 3 6 5-1 4 2 2 5h7l2-5 4-2 5 1 3-6-4-4v-4l4-4-3-6-5 1-4-2-2-5Z"/><circle cx="21.5" cy="21" r="7"/>',
  ].map(
    (path) =>
      '<svg viewBox="0 0 43 43" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round">' +
      path +
      '</svg>',
  );
  const palette = { bg: '#ffffff', panel: '#ffffff', fg: '#25303d', muted: '#687383', line: '#d8dee6' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // TaskPad reserves space for its notes, including at compact sizes.
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
      document.body.classList.add('ref', cfg.theme, cfg.layout);
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      u.el('div', 'tools', head, cfg.tools);
      u.el('div', 'title', head, cfg.title);
      u.el('div', 'civic-subtitle', head, 'Follow the instruction below to complete the task.');
      u.el('div', 'civic-application', head, 'Hello, Alex  ⌄');
      u.el('div', 'civic-step', head, 'Step 2 of 3');
      const work = u.el('div', 'work', shell);
      const center = u.el('section', 'center', work);
      center.dataset.display = _c.display;
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
    },
    'frame.body': () => (_c) => { _c.body = _c.center; },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('instruction');
        panel.dataset.display = _c.display;
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('instruction');
        note.dataset.display = _c.display;
        _c.center.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      const u = _c.util;
      const foot = u.el('footer', 'footer', _c.shell);
      const dock = u.el('div', 'dock-sections', foot);
      cfg.foot.split('|').forEach((s, i) => {
        const d = u.el('section', 'dock-section', dock);
        const icon = u.el('span', 'dock-icon', d);
        icon.setAttribute('aria-hidden', 'true');
        icon.innerHTML = dockIcons[i];
        u.el('strong', '', d, s);
      });
      base(_c);
      const controls = document.body.querySelector('.ref-foot');
      foot.appendChild(controls);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const el = ctx.util.el('section', 'perturb ' + ctx.kind, document.body);
      if (ctx.kind === 'chat') {
        ctx.util.el('strong', '', el, 'Welcome to TaskPad!');
        ctx.util.el('p', '', el, 'Take a quick tour to see key features and get started.');
        const start = ctx.util.el('button', 'tour-start', el, 'Start tour');
        start.type = 'button';
        start.addEventListener('click', ctx.dismiss);
        const skip = ctx.util.el('button', 'tour-skip', el, 'Skip tour');
        skip.type = 'button';
        skip.addEventListener('click', ctx.dismiss);
        return { el, dismiss: skip };
      }
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
    name: 'design-handle-text-copy-paste-11',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    initialOverlay: { kind: 'chat' },
    design: {
      THEMES: { 'design-handle-text-copy-paste-11': palette },
      LOW_THEME: palette,
      ACCENTS: ['#35b891'],
      LOW_ACCENTS: ['#35b891'],
      parts,
    },
  });
})();
