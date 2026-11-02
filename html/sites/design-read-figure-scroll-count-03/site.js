(() => {
  'use strict';
  const palette = { bg: '#10171e', panel: '#151e27', fg: '#e4eaf1', muted: '#aab8c7', line: '#2b3946' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The permanent sidebar and in-flow notification fit all supported sizes.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = !_c.ctx.finish;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.className = `library instruction-${_c.display}${_c.ctx.finish ? ' finish-mode' : ''}`;
      const rail = u.el('nav', 'rail', document.body);
      [
        ['⌂', 'Home'], ['▱', 'Files'], ['⛁', 'Data'], ['▥', 'Reports'], ['⚙', 'Settings'],
      ].forEach((x, i) => {
        const a = u.el('div', `rail-item${i === 0 ? ' active' : ''}`, rail);
        u.el('b', '', a, x[0]);
        u.el('span', '', a, x[1]);
      });
      const app = u.el('main', 'app', document.body);
      const aside = u.el('aside', 'aside', app);
      const center = u.el('section', 'center', app);
      const header = u.el('header', 'top', center);
      u.el('span', 'library-title', header, 'Library');
      Object.assign(_c, { aside, center, header });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      base(_c);
      if (_c.headerTools.childElementCount) document.body.classList.add('has-toolbar');
    },
    'frame.body': () => (_c) => { _c.body = _c.center; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.aside;
      base(_c);
      _c.body = body;
      const u = _c.util;
      const sidebar = _c.aside;
      u.el('h2', 'library-side-title', sidebar, 'Library');
      const folders = u.el('div', 'folder-list', sidebar);
      [
        ['▯', 'All Items', '42'], ['▯', 'Documents', '18'], ['▧', 'Images', '8'],
        ['▷', 'Videos', '6'], ['♫', 'Audio', '5'], ['▤', 'Archives', '5'],
      ].forEach((x, i) => {
        const row = u.el('div', `folder-row${i === 0 ? ' selected' : ''}`, folders);
        u.el('span', 'folder-icon', row, x[0]);
        u.el('span', 'folder-name', row, x[1]);
        u.el('span', 'folder-count', row, x[2]);
      });
      u.el('h2', 'side-heading', sidebar, 'Status');
      const status = u.el('div', 'status-list', sidebar);
      [['Active', '32', '#38e82d'], ['Archived', '6', '#9aa9b8'], ['Draft', '4', '#f2be17']].forEach((x) => {
        const row = u.el('div', 'status-row', status);
        u.el('i', 'status-dot', row).style.background = x[2];
        u.el('span', '', row, x[0]);
        u.el('span', 'status-count', row, x[1]);
      });
      u.el('h2', 'tags-heading', sidebar, 'Tags');
      const tags = u.el('div', 'tag-list', sidebar);
      [['Project', '12'], ['Reference', '9'], ['Personal', '8'], ['Review', '7'], ['Misc', '6']].forEach((x) => {
        const row = u.el('div', 'tag-row', tags);
        u.el('span', 'tag-glyph', row, '◇');
        u.el('span', '', row, x[0]);
        u.el('span', 'tag-count', row, x[1]);
      });
    },
    'frame.stage': () => (_c) => { _c.stage = _c.util.el('section', 'stage', _c.center); },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        _c.util.el('b', 'note-title', note, 'Task note');
        _c.center.insertBefore(note, _c.stage);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        foot.classList.add('bottom');
        _c.center.appendChild(foot);
        _c.foot = foot;
      }
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        el = u.el('div', `overlay ${ctx.kind}`, document.body);
      const messages = {
        cookie: 'This application stores preferences on your device.',
        toast: 'Your workspace has been synced.',
        chat: 'Need help with this exercise?',
        promo: 'Try the new practice collection.',
        banner: 'An updated practice collection is available.',
      };
      u.el('span', '', el, messages[ctx.kind] || 'Workspace update');
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Dismiss');
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-read-figure-scroll-count-03',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: ['#38e82d'], LOW_ACCENTS: ['#38e82d'], parts,
    },
  });
})();
