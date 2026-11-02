(function () {
  'use strict';
  const palette = { bg: '#c0c0c0', panel: '#ffffff', fg: '#080808', muted: '#333333', line: '#777777' };
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
      document.body.classList.add('ref', 'win92', 'document');
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const title = u.el('div', 'title', head, 'Text Transfer Utility');
      const controls = u.el('span', 'window-controls', title);
      controls.innerHTML =
        '<i class="app-icon"><b></b><b></b><b></b></i><i class="minimize"></i><i class="maximize"></i><i class="close"></i>';
      const menu = u.el('nav', 'tools', shell);
      ['File', 'Edit', 'Help'].forEach((x) => u.el('span', 'menu-item', menu, x));
      const work = u.el('div', 'work', shell);
      const center = u.el('section', 'center', work);
      const aside = u.el('aside', 'inspector', work);
      Object.assign(_c, { shell, menu, work, center, aside, header: center });
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
      _c.header = _c.menu;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.work; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.aside;
      base(_c);
      _c.body = body;
      const title = _c.aside.querySelector('.ref-panel-title');
      if (title) title.textContent = 'Instructions:';
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        _c.util.el('strong', 'aside-title', _c.aside, 'Instructions:');
        const note = document.body.querySelector('.ref-note');
        _c.aside.appendChild(note);
      }
      const u = _c.util;
      u.el('strong', 'aside-title', _c.aside, '1. Select the requested source text.');
      u.el('p', 'action-item', _c.aside, '2. Copy the selected text.');
      u.el('p', 'action-item', _c.aside, '3. Paste it into the "Text" field.');
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('footer');
      _c.shell.appendChild(foot);
      const clear = _c.util.el('button', 'clear-button', null, 'Clear');
      clear.type = 'button';
      clear.addEventListener('click', () => {
        const input = _c.stage.querySelector('.ut-input');
        if (input) {
          input.value = '';
          input.dispatchEvent(new Event('input', { bubbles: true }));
        }
      });
      foot.prepend(clear);
      const taskbar = _c.util.el('div', 'taskbar', document.body);
      _c.util.el('div', 'start-button', taskbar, 'Program Manager');
      _c.util.el('div', 'task-button', taskbar, 'Text Transfer Utility');
      const clock = _c.util.el('div', 'clock', taskbar, '10:24 AM');
      Object.assign(_c, { foot, taskbar, clock });
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.taskbar.insertBefore(dock, _c.clock);
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
    name: 'design-handle-text-copy-paste-08',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-handle-text-copy-paste-08': palette },
      LOW_THEME: palette,
      ACCENTS: ['#000080'],
      LOW_ACCENTS: ['#000080'],
      parts,
    },
  });
})();
