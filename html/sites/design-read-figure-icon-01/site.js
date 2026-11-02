(function () {
  'use strict';
  const palette = { bg: '#dce8f6', panel: '#f8fbff', fg: '#101820', muted: '#52677e', line: '#b8c9dc' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('aqua', 'instruction-' + _c.display);
      document.body.classList.toggle('finish-mode', !!_c.ctx.finish);
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      const wc = u.el('div', 'native-window-controls', top);
      for (const [kind, color] of [
        ['close', '#f04d4d'],
        ['min', '#ffbd36'],
        ['max', '#34c759'],
      ]) {
        const dot = u.el('i', 'aqua-dot ' + kind, wc);
        dot.style.setProperty('--dot', color);
      }
      u.el('span', '', top, 'Icon Organizer');
      const center = u.el('div', 'center', app);
      Object.assign(_c, { app, top, center, header: center });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.center.querySelector('.ref-instruction');
      if (note) note.classList.add('brief');
    },
    'frame.tools': (base) => (_c) => {
      const h = _c.header;
      _c.header = _c.top;
      base(_c);
      _c.header = h;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const tabs = u.el('nav', 'aqua-tabs', _c.center);
      for (const t of ['Icons', 'List', 'Details', 'Preview'])
        u.el('span', 'aqua-tab' + (t === 'Icons' ? ' active' : ''), tabs, t);
      const aside = u.el('aside', 'aside', _c.app);
      Object.assign(_c, { body: _c.app, aside });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.aside;
      base(_c);
      _c.body = body;
      const title = _c.aside.querySelector('.ref-panel-title');
      if (title) title.textContent = 'Task instructions';
      const u = _c.util;
      u.el('b', '', _c.aside, 'Icon Counts');
      const rows = [
        ['▤', 'Documents', '6'],
        ['▰', 'Folders', '8'],
        ['▧', 'Images', '7'],
        ['♫', 'Music', '6'],
        ['▥', 'Movies', '4'],
        ['🌐', 'Web Links', '5'],
        ['⚙', 'Applications', '8'],
        ['★', 'Favorites', '6'],
      ];
      for (const [ico, name, n] of rows) {
        const row = u.el('div', 'count-row', _c.aside);
        u.el('span', 'count-icon', row, ico);
        u.el('span', '', row, name);
        u.el('span', 'count-num', row, n);
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('episode-toast');
        const title = _c.util.el('b', '', null, 'Task note');
        note.prepend(title);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        foot.classList.add('bottom');
        _c.app.appendChild(foot);
      }
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.app.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body);
      u.el(
        'span',
        '',
        el,
        ctx.kind === 'cookie'
          ? 'This app uses cookies.'
          : ctx.kind === 'chat'
            ? 'Need help?'
            : ctx.kind === 'promo'
              ? 'Discover more tools.'
              : 'An update is available.',
      );
      const b = u.el('button', '', el, 'Dismiss');
      b.onclick = ctx.dismiss;
      return { el, dismiss: b };
    },
  };
  env.site({
    name: 'design-read-figure-icon-01',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-read-figure-icon-01': palette },
      LOW_THEME: palette,
      ACCENTS: ['#2387ed'],
      LOW_ACCENTS: ['#2387ed'],
      parts,
    },
  });
})();
