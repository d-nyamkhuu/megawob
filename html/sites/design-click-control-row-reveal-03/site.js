(function () {
  'use strict';
  const palette = { bg: '#f7f7f5', panel: '#ffffff', fg: '#172235', muted: '#536071', line: '#d9dde1' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('ref', 'drive');
      const shell = u.el('main', 'shell', document.body);
      const rail = u.el('nav', 'drive-rail', shell);
      u.el('div', 'brand', rail, '▲');
      u.el('div', 'brand-name', rail, 'Acme Drive');
      const nav = u.el('div', 'drive-nav', rail);
      [
        ['▱', 'My Files'], ['♟', 'Shared with me'], ['◷', 'Recent'],
        ['☆', 'Starred'], ['▤', 'Trash'], ['', 'Projects'], ['♟', 'Team Spaces'],
      ].forEach(([ic, label], i) => {
        if (i === 5) u.el('div', 'nav-rule', nav);
        const item = u.el('div', 'nav-item' + (i === 0 ? ' active' : ''), nav);
        u.el('span', 'nav-icon', item, ic);
        u.el('span', '', item, label);
      });
      const app = u.el('section', 'app', shell);
      const head = u.el('header', 'head', app);
      u.el('h1', 'title', head, 'Documents');
      const toolbar = u.el('div', 'toolbar', head);
      const search = u.el('div', 'search', toolbar, '⌕');
      u.el('span', '', search, 'Search in Documents');
      u.el('button', 'view-button', toolbar, '☰');
      const actions = u.el('div', 'head-actions', toolbar);
      u.el('button', 'new-button', actions, 'New⌄');
      Object.assign(_c, { shell, app, header: head, actions });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('instruction', 'header-note');
        note.dataset.display = _c.display;
      }
    },
    'frame.tools': (base) => (_c) => {
      const h = _c.header;
      _c.header = _c.actions;
      base(_c);
      _c.header = h;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'work', _c.app);
      const center = u.el('section', 'center', body);
      const aside = u.el('aside', 'inspector', body);
      Object.assign(_c, { body, center, aside });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.aside;
      base(_c);
      _c.body = body;
      const note = _c.aside.querySelector('.ref-panel');
      if (note) {
        note.classList.add('instruction', 'panel-note');
        note.dataset.display = _c.display;
      }
      const u = _c.util;
      const aside = _c.aside;
      const fileTitle = u.el('div', 'file-heading', aside, 'draft v5 (final).odt');
      u.el('span', 'star', fileTitle, '☆');
      const preview = u.el('div', 'file-preview', aside);
      u.el('div', 'doc-icon', preview, '▤');
      const details = u.el('div', 'file-details', aside);
      [
        ['Type', 'OpenDocument Text'], ['Size', '318 KB'],
        ['Modified', 'May 6, 2021, 10:14 AM'], ['Owner', 'Taylor Kim'],
        ['Location', '▱  Documents'],
      ].forEach(([k, v]) => {
        const row = u.el('div', 'detail-row', details);
        u.el('span', '', row, k);
        u.el('span', '', row, v);
      });
      u.el('div', 'detail-rule', aside);
      u.el('div', 'description-label', aside, 'Description');
      u.el('p', 'description', aside, 'Final draft with edits and updated figures.');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('instruction', 'instruction-toast');
        note.dataset.display = _c.display;
        _c.center.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.app.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.app.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const el = ctx.util.el('section', 'perturb ' + ctx.kind, document.body);
      ctx.util.el(
        'strong', '', el,
        { cookie: 'Cookie preferences', toast: 'Notification', chat: 'Support', promo: 'A special offer', banner: 'Service notice' }[ctx.kind],
      );
      ctx.util.el(
        'p', '', el,
        { cookie: 'Choose your preferences to continue.', toast: 'Your workspace is ready.', chat: 'How can we help?', promo: 'Explore the latest tools.', banner: 'A new update is available.' }[ctx.kind],
      );
      const dismiss = ctx.util.el('button', 'dismiss', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-click-control-row-reveal-03',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-click-control-row-reveal-03': palette },
      LOW_THEME: palette,
      ACCENTS: ['#baff35'], LOW_ACCENTS: ['#baff35'],
      parts,
    },
  });
})();
