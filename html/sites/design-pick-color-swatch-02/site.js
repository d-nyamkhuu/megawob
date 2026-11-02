(function () {
  'use strict';
  const C = {
    title: ['Palette', 'Pro'],
    tag: 'Simple tools for a brighter web',
    tabs: ['Home', 'Match Color', 'Saved Swatches', 'Help'],
    active: 1,
  };
  const palette = { bg: '#e8f1fb', panel: '#fff', fg: '#0f3d6e', muted: '#3a4f66', line: '#b5d0ea' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.className = 'design w2g';
      const shell = u.el('div', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const brand = u.el('div', 'brand', head);
      const logo = u.svg('svg', { class: 'logo', width: 58, height: 74, viewBox: '0 0 58 74' }, brand);
      const defs = u.svg('defs', {}, logo);
      const leaf = u.svg('linearGradient', { id: 'palette-leaf', x1: 0, y1: 0, x2: 1, y2: 1 }, defs);
      u.svg('stop', { offset: '0%', 'stop-color': '#91cc5d' }, leaf);
      u.svg('stop', { offset: '100%', 'stop-color': '#45a238' }, leaf);
      u.svg('path', {
        d: 'M55 3C37 10 17 9 7 27C-2 44 6 57 19 59C40 62 52 48 55 3Z',
        fill: 'url(#palette-leaf)', stroke: '#5c9b3e', 'stroke-width': 1.5,
      }, logo);
      u.svg('path', {
        d: 'M7 70C15 48 26 31 47 13', fill: 'none', stroke: '#3e842c',
        'stroke-width': 3.5, 'stroke-linecap': 'round',
      }, logo);
      u.svg('path', { d: 'M8 40C11 23 28 15 48 9', fill: 'none', stroke: '#b5dc90', 'stroke-width': 1.2 }, logo);
      const bt = u.el('div', 'brand-text', brand);
      const t = u.el('div', 'brand-title', bt);
      u.el('span', 'b1', t, C.title[0]);
      t.append(' ');
      u.el('span', 'b2', t, C.title[1]);
      u.el('div', 'brand-sub', bt, C.tag);
      const toolbar = u.el('nav', 'tabs', head);
      C.tabs.forEach((n, i) => {
        const b = u.el('button', 'tab' + (i === C.active ? ' active' : ''), toolbar, n);
        b.type = 'button';
        b.onclick = () => env.log('tab', { n });
      });
      const content = u.el('div', 'content', shell);
      Object.assign(_c, { shell, toolbar, content, header: content });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.content; },
    'frame.panel': (base) => (_c) => {
      base(_c);
      _c.body.classList.remove('ref-panel-right');
    },
    'frame.stage': () => (_c) => {
      const stage = _c.util.el('main', 'stage', _c.body);
      stage.dataset.role = 'stage';
      _c.stage = stage;
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.content.insertBefore(note, _c.stage);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const footer = document.body.querySelector('.ref-foot');
      footer.classList.add('footer');
      _c.shell.appendChild(footer);
      const reset = _c.util.el('button', 'clear', null, 'Reset');
      reset.type = 'button';
      reset.onclick = () => env.widgetDef.clear?.();
      footer.prepend(reset);
      _c.footer = footer;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.footer.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        kind = ctx.kind;
      const el = u.el('section', 'obstruction obstruction-' + kind, document.body);
      el.dataset.role = 'overlay';
      const box = u.el('div', 'obstruction-box', el);
      const title =
        {
          cookie: 'Your privacy',
          toast: 'Changes saved',
          chat: 'Support',
          promo: 'Workspace update',
          banner: 'Service notice',
        }[kind] || 'Notice';
      const text =
        {
          cookie: 'This application stores optional cookies.',
          toast: 'Your changes have been saved.',
          chat: 'Need a hand with this workspace?',
          promo: 'Explore the latest workspace features.',
          banner: 'You are viewing a shared workspace.',
        }[kind] || '';
      u.el('h3', '', box, title);
      u.el('p', '', box, text);
      const dismiss = u.el('button', 'dismiss', box, kind === 'cookie' ? 'Reject optional' : 'Close');
      dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('close');
      if (kind === 'cookie') {
        const a = u.el('button', 'dismiss', box, 'Accept optional');
        a.type = 'button';
        a.onclick = () => ctx.dismiss('accept');
      }
      return { el, dismiss, ttlSteps: kind === 'toast' ? 5 : 0 };
    },
  };
  env.site({
    name: 'design-pick-color-swatch-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-pick-color-swatch-02': palette },
      LOW_THEME: palette,
      ACCENTS: ['#2f8f1f'],
      LOW_ACCENTS: ['#2f8f1f'],
      parts,
    },
  });
})();
