(function () {
  'use strict';
  const icons = [
    '<path d="M2 11 13 1l11 10-3 2V24h-6v-8h-4v8H5V13z"/>',
    '<path d="M6 1h10l6 6v17H6z"/><path d="M10 10h8M10 15h8M10 20h6" fill="none" stroke="#f4f7fb" stroke-width="2"/>',
    '<rect x="3" y="15" width="5" height="10" rx="2"/><rect x="11" y="8" width="5" height="17" rx="2"/><rect x="19" y="2" width="5" height="23" rx="2"/>',
    '<path d="m10 1-1 4-4 2-4 1 1 5-1 4 4 1 3 4 2 4 5-1 3-3 4-1 3-4-3-4V9l-4-2-2-4z"/><circle cx="13" cy="13" r="4" fill="#f0f5fa"/>',
    '<circle cx="13" cy="13" r="12"/><path d="M9 9c0-5 9-5 8 0-.5 3-4 2-4 6M13 19v2" stroke="#f4f7fb" stroke-width="2.5" fill="none"/>'
  ];
  const palette = { bg: '#eef4f8', panel: '#f5f8fb', fg: '#101d3f', muted: '#6c7e9b', line: '#cdd9e7' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'ds-body', document.body);
      const rail = u.el('aside', 'ds-rail', body);
      ['Home', 'Tasks', 'Reports', 'Settings', 'Help'].forEach((text, i) => {
        const item = u.el('div', 'ds-command', rail);
        item.innerHTML = '<svg viewBox="0 0 26 26" aria-hidden="true">' + icons[i] + '</svg>';
        u.el('span', '', item, text);
      });
      const content = u.el('div', 'ds-content', body);
      const header = u.el('header', _c.display === 'hidden' ? 'ds-end-toolbar' : 'ds-header-note', content);
      if (_c.display !== 'hidden') u.el('span', 'ds-info', header, 'i');
      Object.assign(_c, { body, rail, content, header });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      base(_c);
      // Neutral secondary commands retain the original rail location.
      _c.headerTools.querySelectorAll('.ref-xtra').forEach(el => _c.rail.appendChild(el));
      if (_c.display === 'hidden' && !_c.headerTools.children.length) _c.header.hidden = true;
    },
    'frame.body': () => () => {},
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.content);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.header.insertBefore(note, _c.headerTools);
    },
    'frame.footer': (base) => (_c) => {
      const actions = _c.util.el('footer', 'ds-footer', _c.content);
      const clear = _c.util.el('button', 'ds-invoice-clear', actions, 'Clear');
      clear.type = 'button';
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        actions.appendChild(foot);
        foot.querySelectorAll('.ref-xtra').forEach(el => _c.rail.appendChild(el));
      }
      _c.actions = actions;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.rail.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const box = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      box.dataset.role = 'overlay';
      const text = {cookie: 'We use cookies to remember your preferences.', toast: 'Changes synced.', chat: 'Hello. How can we help?', promo: 'Try our new workspace.', banner: 'Scheduled maintenance tonight.'};
      u.el('div', '', box, text[ctx.kind]);
      const dismiss = u.el('button', '', box, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return {el: box, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0};
    }
  };
  env.site({
    name: 'design-fill-form-invoice-01',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-fill-form-invoice-01': palette },
      LOW_THEME: palette,
      ACCENTS: ['#327cf4'],
      LOW_ACCENTS: ['#327cf4'],
      parts
    }
  });
})();
