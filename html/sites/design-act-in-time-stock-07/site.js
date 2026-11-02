(function () {
  'use strict';
  const C = { site: 'design-act-in-time-stock-07', brand: 'TradeTask', nav: ['Markets', 'Watchlist', 'Orders', 'Account'] };
  const palette = { bg: '#f8f6ef', panel: '#fbfaf5', fg: '#111111', muted: '#686868', line: '#dedbd3' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      document.body.classList.toggle('tt-hidden-goal', _c.display === 'hidden');
      document.body.classList.toggle('tt-finish-episode', !!_c.ctx.finish);
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const chrome = u.el('header', 'tt-header', document.body);
      u.el('div', 'tt-brand', chrome, C.brand);
      const nav = u.el('nav', 'tt-nav', chrome);
      C.nav.forEach((item) => u.el('span', '', nav, item));
      const user = u.el('div', 'tt-user', chrome);
      u.el('span', 'tt-user-icon', user, '●');
      u.el('b', 'tt-avatar', user, 'J');
      u.el('span', '', user, 'Jordan  ▾');
      // A separate note slot leaves the original brand and navigation in every mode.
      const header = u.el('div', 'tt-note-slot', document.body);
      Object.assign(_c, { chrome, header });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('tt-instruction');
        const text = _c.util.el('div', '');
        while (note.firstChild) text.appendChild(note.firstChild);
        _c.util.el('span', 'tt-roundel', note, '◉');
        note.appendChild(text);
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.chrome;
      base(_c);
      _c.header = header;
      _c.headerTools.classList.add('tt-head-tools');
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('main', 'tt-workspace' + (_c.display === 'panel' ? ' has-panel' : ''), document.body);
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const note = _c.body.querySelector('.ref-panel');
      if (note) note.classList.add('tt-panel-note');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'ds-stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('tt-toast');
        document.body.insertBefore(note, _c.body);
      }
    },
    'frame.footer': (base) => (_c) => {
      const u = _c.util;
      const dock = u.el('footer', 'tt-dock', document.body);
      const dockItems = [['▱', 'Trade'], ['★', 'Watchlist'], ['▤', 'Orders'], ['⌕', 'Research'], ['♧', 'Alerts'], ['♟', 'Account']];
      dockItems.forEach(([icon, text], i) => {
        const item = u.el('button', i === 0 ? 'tt-dock-item active' : 'tt-dock-item', dock);
        item.type = 'button'; u.el('span', 'tt-dock-icon', item, icon); u.el('span', '', item, text);
        item.addEventListener('click', () => env.log('decoy', { what: 'dock', label: text }));
      });
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      dock.appendChild(foot);
      if (_c.placement === 'footer' || _c.placement === 'link') dock.insertBefore(u.el('span', 'tt-dock-divider'), foot);
      dock.classList.toggle('finish-mode', !!_c.ctx.finish);
      dock.classList.toggle('no-end', !['footer', 'link', 'floating'].includes(_c.placement));
      Object.assign(_c, { dock, foot });
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) {
        _c.util.el('span', 'tt-dock-divider', _c.dock);
        _c.dock.appendChild(dock);
      }
    },
    overlay: () => (ctx) => {
      const u = ctx.util, el = u.el('section', 'tt-overlay tt-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = { cookie: 'We use cookies to remember your preferences.', toast: 'Your watchlist has been updated.', chat: 'Hello. How can we help?', promo: 'Explore more market tools.', banner: 'Market data refresh is scheduled shortly.' };
      u.el('div', '', el, texts[ctx.kind] || texts.toast);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.type = 'button'; dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    }
  };
  env.site({
    name: C.site,
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-act-in-time-stock-07': palette },
      LOW_THEME: palette,
      ACCENTS: ['#d71920'],
      LOW_ACCENTS: ['#d71920'],
      parts,
    },
  });
})();
