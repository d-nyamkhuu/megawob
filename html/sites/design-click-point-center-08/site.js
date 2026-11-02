(function () {
  'use strict';
  const palette = { bg: '#faf9f5', panel: '#faf9f5', fg: '#2c2f1c', muted: '#6d6a58', line: '#e1d9c4' };

  function drawDock(u, shell) {
    const dock = u.el('footer', 'footer', shell);
    const tools = u.el('div', 'dock-group tools', dock);
    u.el('div', 'dock-label', tools, 'Tools');
    const row = u.el('div', 'dock-row', tools);
    const icons = {
      Pointer: 'M7 2V25L12 20L16 28L20 26L16 18H24Z',
      Pan: 'M9 16V5C9 2 12 2 12 5V14V3C12 0 15 0 15 3V14V4C15 1 18 2 18 5V15V7C18 4 21 5 21 8V18C21 25 18 28 13 28C9 28 7 26 5 22L2 15C1 12 4 11 6 14L9 18',
      Clear: 'M6 8C10 3 18 3 23 8C30 17 22 28 12 25C7 24 4 21 4 16M6 3V8H12',
    };
    const btns = [];
    for (const name of ['Pointer', 'Pan', 'Clear']) {
      const bt = u.el('button', 'tool' + (name === 'Pointer' ? ' selected' : ''), row);
      bt.type = 'button';
      const s = u.svg('svg', {
        width: 34, height: 34, viewBox: '0 0 28 28', fill: 'none', stroke: 'currentColor',
        'stroke-width': 1.6, 'stroke-linejoin': 'round',
      }, bt);
      u.svg('path', { d: icons[name] }, s);
      u.el('span', '', bt, name);
      btns.push(bt);
      bt.onclick = () => {
        if (name === 'Clear') {
          env.widgetDef.clear?.();
          return;
        }
        btns.forEach((x) => x.classList.remove('selected'));
        bt.classList.add('selected');
      };
    }
    u.el('div', 'dock-sep', dock);
    const zoom = u.el('div', 'dock-group zoom', dock);
    u.el('div', 'dock-label', zoom, 'Zoom');
    const zr = u.el('div', 'zoom-row', zoom);
    const mk = (t) => {
      const b = u.el('button', 'zbtn', zr, t);
      b.type = 'button';
      return b;
    };
    mk('−');
    u.el('span', 'zval', zr, '100%');
    mk('+');
    u.el('div', 'dock-sep', dock);
    u.el('div', 'dock-spacer', dock);
    return dock;
  }

  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.className = 'design quiet';
      _c.root.style.setProperty('--font', "Georgia, 'Times New Roman', serif");
      const shell = u.el('div', 'shell', document.body);
      const content = u.el('div', 'content', shell);
      const header = u.el('section', 'task-note', content);
      header.hidden = _c.display !== 'header' && _c.display !== 'panel';
      if (!header.hidden) u.el('div', 'gold-rule', content);
      const dock = drawDock(u, shell);
      Object.assign(_c, { shell, contentPane: content, header, dock });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.dock;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.contentPane;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.body);
      _c.stage.dataset.role = 'stage';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.shell.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.dock.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.dock.appendChild(dock);
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
    name: 'design-click-point-center-08',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-click-point-center-08': palette },
      LOW_THEME: palette,
      ACCENTS: ['#4a4f31'],
      LOW_ACCENTS: ['#4a4f31'],
      parts,
    },
  });
})();
