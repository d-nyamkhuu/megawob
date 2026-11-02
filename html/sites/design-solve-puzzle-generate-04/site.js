(function () {
  'use strict';
  const palette = { bg: '#f8f7f2', panel: '#f6f5f0', fg: '#171b1f', muted: '#888981', line: '#d6d4ce' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // All note modes have a reserved box in the notebook at every viewport.
      _c.display = _c.ctx.display || 'header';
      document.body.className = 'notebook instruction-' + _c.display;
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util,
        app = u.el('main', 'app', document.body),
        top = u.el('header', 'top', app);
      const icon = u.svg('svg', { width: 22, height: 26, viewBox: '0 0 22 26', class: 'title-icon' }, top);
      u.svg('path', { d: 'M5 1h11l5 5v17H3V4z', fill: '#f07824' }, icon);
      u.svg('path', { d: 'M5 1v5h5', fill: 'none', stroke: '#ffd29b', 'stroke-width': 1.4 }, icon);
      u.el('span', 'app-name', top, 'Notebook');
      const menu = u.el('nav', 'menu', top);
      ['File', 'Edit', 'View', 'Note', 'Tools', 'Help'].forEach((x) => u.el('span', 'menu-item', menu, x));
      const win = u.el('div', 'native-window-controls', top);
      for (const [kind, d] of [
        ['min', 'M3 11h14'],
        ['max', 'M4 4h12v12H4z'],
        ['close', 'M4 4l12 12M16 4L4 16'],
      ]) {
        const svg = u.svg('svg', { width: 18, height: 18, viewBox: '0 0 20 20' }, win);
        u.svg('path', { d, fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5 }, svg);
      }
      const shelf = u.el('nav', 'shelf', app);
      [
        ['▤', 'Notes'],
        ['✓', 'Tasks'],
        ['▦', 'Calendar'],
        ['⌕', 'Search'],
      ].forEach(([ico, label], i) => {
        const t = u.el('div', 'shelf-tab' + (!i ? ' active' : ''), shelf);
        u.el('span', 'shelf-icon', t, ico);
        u.el('span', '', t, label);
      });
      const work = u.el('div', 'work-area', app),
        side = u.el('aside', 'notebooks', work);
      u.el('div', 'sidebar-heading', side, 'Notebooks');
      [
        ['▰', 'Quick Notes'],
        ['▱', 'Work'],
        ['▱', 'Personal'],
        ['♧', 'Ideas'],
        ['▣', 'Archive'],
      ].forEach(([ico, label], i) => {
        const row = u.el('div', 'notebook-row' + (!i ? ' selected' : ''), side);
        u.el('span', 'folder-icon', row, ico);
        u.el('span', '', row, label);
      });
      const center = u.el('div', 'center', work),
        meta = u.el('div', 'note-meta', center);
      u.el('span', '', meta, 'Apr 24, 2018');
      u.el('span', 'edited', meta, 'Last edited 10:15 AM');
      const noteBox = u.el('div', 'note-slot', center);
      Object.assign(_c, { app, shelf, work, center, meta, noteBox, header: shelf });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.noteBox;
      base(_c);
      _c.header = header;
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
    },
    'frame.body': () => (_c) => {
      _c.body = _c.work;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.noteBox;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      _c.stage = u.el('section', 'stage', _c.center);
      const aside = u.el('aside', 'aside', _c.work);
      const title = u.el('div', 'preview-title', aside);
      u.el('span', '', title, 'Preview');
      u.el('span', 'preview-controls', title, '−　×');
      u.el('div', 'preview-label', aside, 'Current number:');
      u.el('div', 'preview-value', aside, '—');
      u.el('footer', 'bottom', _c.app);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.noteBox.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.meta.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.shelf.appendChild(dock);
    },
    'frame.end': (base) => (_c) => {
      const frame = base(_c);
      // The puzzle widget reparents the end control into its action row.
      // Preserve the template placement on the control itself for styling.
      if (frame.submit) frame.submit.classList.add('notebook-end-' + _c.placement);
      return frame;
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body),
        messages = {
          cookie: 'This application stores preferences on your device.',
          toast: 'Your workspace has been synced.',
          chat: 'Need help with this exercise?',
          promo: 'Try the new practice collection.',
          banner: 'An updated practice collection is available.',
        };
      u.el('span', '', el, messages[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Dismiss');
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-solve-puzzle-generate-04',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-solve-puzzle-generate-04': palette },
      LOW_THEME: palette,
      ACCENTS: ['#f07824'],
      LOW_ACCENTS: ['#f07824'],
      parts,
    },
  });
})();
