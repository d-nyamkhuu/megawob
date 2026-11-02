(function () {
  'use strict';
  const palette = { bg: '#222a78', panel: '#e9e1cf', fg: '#1c1710', muted: '#1c1710', line: '#bdb59f' };
  function sideTools(_c, parent) {
    for (const button of parent.querySelectorAll('.ref-xtra')) _c.sideTools.appendChild(button);
  }
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
      document.body.classList.add('design', 'cdrom');
      const shell = u.el('div', 'shell', document.body);
      const scene = u.el('div', 'scene', shell);
      const rail = u.el('nav', 'rail', scene);
      const disc = u.el('div', 'rail-brand', rail);
      u.el('div', 'cd', disc);
      u.el('div', 'rail-title', disc, 'World of Artworks CD-ROM');
      for (const label of ['Home', 'Gallery', 'Reference', 'Settings', 'Help']) {
        const b = u.el('button', 'rail-item', rail);
        b.type = 'button';
        u.el('span', 'rail-glyph', b);
        u.el('span', 'rail-label', b, label);
        b.onclick = () => env.log('menu', { label });
      }
      const win = u.el('div', 'win', scene);
      const bar = u.el('header', 'win-title', win);
      u.el('div', 'win-name', bar, 'The Artist’s Companion');
      u.el('div', 'win-sub', bar, 'Colours for a brighter world');
      const wc = u.el('div', 'win-controls', bar);
      for (const [label, name] of [['−', 'Minimize'], ['×', 'Close']]) {
        const b = u.el('button', 'win-btn', wc, label);
        b.type = 'button';
        b.setAttribute('aria-label', name);
        b.onclick = () => env.log('window-control', { name });
      }
      const tabs = u.el('div', 'tabs', win);
      ['Pick Colour', 'Palettes', 'Harmony', 'Inspiration'].forEach((t, i) => {
        const b = u.el('button', 'tab' + (i === 0 ? ' on' : ''), tabs);
        u.el('span', '', b, t);
        b.type = 'button';
        b.onclick = () => env.log('tab', { label: t });
      });
      u.el('div', 'sheet', win);
      u.el('div', 'sheet-rule', win);
      const note = u.el('section', 'task-note', scene);
      note.hidden = _c.display === 'hidden';
      if (_c.display !== 'hidden') note.classList.add('instruction-' + _c.display);
      const sideTools = u.el('div', 'side-tools', scene);
      Object.assign(_c, { shell, scene, tabs, sideTools, header: note });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.tabs;
      base(_c);
      _c.header = header;
      sideTools(_c, _c.headerTools);
    },
    'frame.body': () => (_c) => { _c.body = _c.scene; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
      const text = _c.header.querySelector('.ref-panel-text');
      if (text) {
        text.classList.add('instruction');
        _c.header.querySelector('.ref-panel-title').textContent = 'Companion Note';
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.scene);
      _c.stage.dataset.role = 'stage';
      const deco = _c.util.el('div', 'deco', _c.scene);
      _c.util.el('div', 'globe', deco);
      _c.util.el('div', 'pillars', deco, '████');
      _c.util.el('div', 'motto', deco, 'EXPLORE\nLEARN\nCREATE');
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.querySelector('.ref-note-text').classList.add('instruction');
        _c.header.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      const footer = _c.util.el('footer', 'footer', _c.scene);
      const difference = _c.util.el('div', 'difference-value', footer, '—');
      difference.dataset.role = 'color-difference';
      difference.hidden = true;
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      footer.appendChild(foot);
      sideTools(_c, foot);
      _c.footer = footer;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.scene.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        kind = ctx.kind;
      const el = u.el('section', 'obstruction obstruction-' + kind, document.body);
      el.dataset.role = 'overlay';
      const box = u.el('div', 'obstruction-box', el);
      u.el(
        'h3',
        '',
        box,
        {
          cookie: 'Preferences',
          toast: 'Notice',
          chat: 'Companion help',
          promo: 'Did you know?',
          banner: 'CD-ROM notice',
        }[kind],
      );
      u.el(
        'p',
        '',
        box,
        {
          cookie: 'Optional settings may be stored on this computer.',
          toast: 'The colour picker is ready.',
          chat: 'Adjust the hue strip and the colour square to match the target.',
          promo: 'Browse the gallery for more inspiration.',
          banner: 'Insert disc 2 for additional artworks.',
        }[kind],
      );
      const dismiss = u.el('button', 'dismiss', box, kind === 'cookie' ? 'Use default settings' : 'Close');
      dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('close');
      return { el, dismiss, ttlSteps: kind === 'toast' ? 5 : 0 };
    },
  };
  env.site({
    name: 'design-pick-color-hex-05',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-pick-color-hex-05': palette },
      LOW_THEME: palette,
      ACCENTS: ['#5b2bb8'],
      LOW_ACCENTS: ['#5b2bb8'],
      parts,
    },
  });
})();
