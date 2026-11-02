/* Photo Studio design on the shared frame. */
(function () {
  'use strict';
  function icon(parent, glyph, label) {
    const b = env.util.el('button', 'tool-icon', parent);
    b.type = 'button';
    b.setAttribute('aria-label', label);
    b.innerHTML = glyph;
    return b;
  }
  function drawOverlay(ctx) {
    const u = ctx.util,
      el = u.el('section', 'tour-bubble overlay-' + ctx.kind, document.body);
    el.setAttribute('role', 'dialog');
    const data = {
      chat: [
        'Photo Studio help',
        'Use the rotation handle or Straighten control to adjust this image.',
        'Open guide',
        'Dismiss',
      ],
      cookie: [
        'Privacy settings',
        'Allow optional cookies for this photo workspace?',
        'Accept optional',
        'Reject optional',
      ],
      toast: ['Workspace ready', 'Your photo edits are ready to continue.', null, 'Dismiss'],
      promo: ['Studio update', 'Discover more tools for your images.', 'Learn more', 'Not now'],
      banner: ['Offline workspace', 'Your edits stay in this local practice session.', null, 'Dismiss'],
    }[ctx.kind];
    u.el('h2', '', el, data[0]);
    const close = u.el('button', 'bubble-close', el, '×');
    close.onclick = () => ctx.dismiss('close');
    u.el('p', '', el, data[1]);
    const actions = u.el('div', 'tour-actions', el);
    if (data[2]) {
      const b = u.el('button', 'tour-primary', actions, data[2]);
      b.onclick = () => ctx.dismiss(ctx.kind === 'cookie' ? 'accept' : 'skip');
    }
    const d = u.el('button', 'tour-dismiss', actions, data[3]);
    d.onclick = () => ctx.dismiss('skip');
    return { el, dismiss: d, ttlSteps: ctx.kind === 'toast' ? 5 : 0 };
  }
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original editor has its own note positions at every viewport.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('photo-studio', 'mode-' + _c.display);
      const title = u.el('header', 'titlebar', document.body);
      u.el('span', 'brand-mark', title, '△');
      u.el('span', 'app-name', title, 'Photo Studio');
      u.el('span', 'title-spacer', title);
      const actions = u.el('div', 'window-actions', title);
      for (const [n, g] of [['minimize', '−'], ['maximize', '□'], ['close', '×']]) {
        const b = u.el('button', 'window-action ' + n, actions, g);
        b.setAttribute('aria-label', n);
      }
      const menu = u.el('nav', 'menu-bar', document.body);
      menu.setAttribute('aria-label', 'Application menu');
      ['File', 'Edit', 'View', 'Image', 'Tools', 'Help'].forEach((x) => u.el('span', 'menu-item', menu, x));
      const toolbar = u.el('nav', 'toolbar', document.body);
      toolbar.setAttribute('aria-label', 'Image tools');
      [
        ['<svg viewBox="0 0 24 24"><path d="M5 3h11l4 4v14H5zM8 3v6h9V4M8 21v-8h9v8"/></svg>', 'Save'],
        ['<svg viewBox="0 0 24 24"><path d="M3 10 12 3l9 7M5 9v12h14V9M9 21v-7h6v7"/></svg>', 'Open'],
        ['<svg viewBox="0 0 24 24"><path d="M9 7 4 12l5 5M4 12h10a6 6 0 0 1 6 6"/></svg>', 'Undo'],
        ['<svg viewBox="0 0 24 24"><path d="m15 7 5 5-5 5M20 12H10a6 6 0 0 0-6 6"/></svg>', 'Redo'],
        ['<svg viewBox="0 0 24 24"><path d="M4 4h16v16H4zM8 8l8 8M16 8l-8 8"/></svg>', 'Crop'],
        ['<svg viewBox="0 0 24 24"><path d="M12 3a9 9 0 1 0 8.5 6M12 6V2m0 0-3 3m3-3 3 3"/></svg>', 'Rotate'],
        ['<svg viewBox="0 0 24 24"><path d="M4 4h16v16H4zM8 8h8M8 12h8M8 16h5"/></svg>', 'Properties'],
        ['<svg viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16M8 4v4m8 2v4m-5 2v4"/></svg>', 'Adjustments'],
        ['<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3M5 5l2 2m10 10 2 2m0-14-2 2M7 17l-2 2"/></svg>', 'Light'],
        ['<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 3v18a9 9 0 0 0 0-18"/></svg>', 'Contrast'],
        ['<svg viewBox="0 0 24 24"><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></svg>', 'More'],
      ].forEach(([g, l], i) => {
        const b = icon(toolbar, g, l);
        if (i === 5) b.classList.add('active');
        if (i === 2 || i === 4 || i === 6 || i === 9) b.classList.add('tool-divider');
      });
      Object.assign(_c, { header: title, toolbar });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('task-note');
    },
    'frame.tools': (base) => (_c) => {
      const h = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = h;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'photo-body', document.body);
      const records = u.el('aside', 'record-index', body);
      [
        ['lake.jpg', 'Apr 14, 2022', '10:24 AM'],
        ['forest.jpg', 'Apr 12, 2022', '2:17 PM'],
        ['city.jpg', 'Apr 10, 2022', '9:03 AM'],
        ['beach.jpg', 'Apr 8, 2022', '6:41 PM'],
        ['mountain.jpg', 'Apr 5, 2022', '11:28 AM'],
        ['road.jpg', 'Apr 2, 2022', '4:19 PM'],
        ['flowers.jpg', 'Mar 30, 2022', '1:52 PM'],
        ['desert.jpg', 'Mar 27, 2022', '8:07 AM'],
      ].forEach((r, i) => {
        const row = u.el('div', 'record-row' + (!i ? ' selected' : ''), records);
        u.el('span', 'record-name', row, r[0]);
        u.el('span', 'record-date', row, r[1]);
        u.el('span', 'record-time', row, r[2]);
      });
      _c.body = body;
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) panel.classList.add('panel-note');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'photo-stage', _c.body);
      _c.stage.dataset.role = 'stage';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) note.classList.add('task-note-toast');
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      const foot = document.body.querySelector('.ref-foot');
      if (dock && foot) foot.appendChild(dock);
    },
    overlay: () => drawOverlay,
  };
  const palette = { bg: '#101419', panel: '#171d25', fg: '#e3e7ec', muted: '#9ba5b0', line: '#303943' };
  env.site({
    name: 'design-rotate-object-photo-01',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-rotate-object-photo-01': palette },
      LOW_THEME: palette,
      ACCENTS: ['#86e84b'],
      LOW_ACCENTS: ['#86e84b'],
      parts,
    },
  });
})();
