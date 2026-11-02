(function () {
  'use strict';
  const C = { title: 'Window Resize Practice', menu: ['File', 'Edit', 'View', 'Help'] };
  const palette = { bg: '#008080', panel: '#c0c0c0', fg: '#000000', muted: '#404040', line: '#808080' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('design', 'w31');
      const shell = u.el('div', 'shell', document.body);
      const win = u.el('div', 'win', shell);
      const head = u.el('header', 'head', win);
      const sys = u.el('div', 'sysbox', head);
      u.el('i', '', sys);
      u.el('div', 'title', head, C.title);
      const controls = u.el('div', 'window-controls', head);
      for (const cls of ['min', 'max', 'drop']) {
        const bt = u.el('button', cls, controls, '');
        bt.type = 'button';
        bt.onclick = () => env.log('window-control', { label: cls });
      }
      const nav = u.el('nav', 'menu', win);
      for (const label of C.menu) {
        const s = u.el('span', '', nav);
        u.el('u', '', s, label[0]);
        s.append(label.slice(1));
      }
      const content = u.el('div', 'content', win);
      Object.assign(_c, { shell, win, toolbar: nav, header: content, contentArea: content });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => { base(_c); },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.contentArea; },
    'frame.panel': (base) => (_c) => { base(_c); },
    'frame.stage': () => (_c) => {
      const stage = _c.util.el('main', 'stage', _c.body);
      stage.dataset.role = 'stage';
      _c.stage = stage;
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.contentArea.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('footer');
      _c.win.appendChild(foot);
      const u = _c.util;
      const bar = u.el('div', 'taskbar', _c.shell);
      const pm = u.el('div', 'tb-item pm', bar);
      const pmIcon = u.svg('svg', { class: 'tb-icon pmicon', viewBox: '0 0 40 40', 'aria-hidden': 'true' }, pm);
      for (const [x, y] of [[12, 2], [18, 14], [2, 18]]) {
        u.svg('rect', { x, y, width: 24, height: 21, fill: '#c0c0c0', stroke: '#000', 'stroke-width': 2 }, pmIcon);
        u.svg('path', { d: `M${x + 2} ${y + 19}V${y + 2}H${x + 22}`, fill: 'none', stroke: '#fff' }, pmIcon);
        u.svg('rect', { x: x + 4, y: y + 4, width: 16, height: 6, fill: '#000080' }, pmIcon);
        for (const dx of [5, 13])
          for (const dy of [12, 17])
            u.svg('rect', { x: x + dx, y: y + dy, width: 4, height: 3, fill: '#000080' }, pmIcon);
      }
      u.el('span', '', pm, 'Program Manager');
      const ap = u.el('div', 'tb-item app', bar);
      u.el('span', 'tb-icon appicon', ap);
      u.el('span', '', ap, C.title);
      const tray = u.el('div', 'tray', bar);
      const speaker = u.svg('svg', { class: 'spk', viewBox: '0 0 32 36', 'aria-hidden': 'true' }, tray);
      u.svg('path', { d: 'M3 13H8L16 5V31L8 23H3Z', fill: '#ffff80', stroke: '#000', 'stroke-width': 1.5 }, speaker);
      u.svg('path', { d: 'M6 14V22M12 10V27', stroke: '#fff', 'stroke-width': 2 }, speaker);
      u.svg('path', { d: 'M20 12Q27 18 20 24M24 6Q36 18 24 30', fill: 'none', stroke: '#000', 'stroke-width': 1.5 }, speaker);
      u.el('span', '', tray, '10:24 AM');
      Object.assign(_c, { bar, tray });
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.bar.insertBefore(dock, _c.tray);
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
    name: 'design-resize-element-ghost-09',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-resize-element-ghost-09': palette },
      LOW_THEME: palette,
      ACCENTS: ['#000080'],
      LOW_ACCENTS: ['#000080'],
      parts,
    },
  });
})();
