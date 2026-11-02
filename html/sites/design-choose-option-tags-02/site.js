(function () {
  'use strict';
  const palette = { bg: '#8e96a7', panel: '#d0d5df', fg: '#101827', muted: '#515c6b', line: '#788397' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      let display = _c.ctx.display || 'hidden';
      if (display === 'panel' && _c.W < 1120) display = 'header';
      if (display === 'toast' && _c.H < 690) display = 'header';
      _c.display = display;
      document.body.classList.toggle('ref-has-note', display === 'toast');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = _c.util, body = document.body;
      body.classList.add('irix-window');
      const title = u.el('header', 'irix-titlebar', body);
      u.el('span', 'irix-app-icon', title, '◈');
      u.el('strong', 'irix-title', title, 'World Places　—　Catalog');
      u.el('span', 'irix-win-controls', title, '−　□　×');
      const menu = u.el('nav', 'irix-menubar', body);
      ['File', 'Edit', 'View', 'Places', 'Tools', 'Window', 'Help'].forEach((x, i) => {
        const a = u.el('span', 'irix-menu-item', menu, x);
        if (i === 0) a.classList.add('first');
      });
      const toolbar = u.el('div', 'irix-toolbar', body);
      [ ['◉', 'Open'], ['▱', 'New'], ['▤', 'Properties'], ['♜', 'Delete'], ['⌕', 'Find'], ['◉◉', 'Browse'] ].forEach(([icon, text], i) => {
        if (i === 4 || i === 5) u.el('i', 'irix-sep', toolbar);
        const b = u.el('div', 'irix-tool', toolbar);
        u.el('span', 'irix-tool-icon', b, icon);
        u.el('span', '', b, text);
      });
      const tabs = u.el('nav', 'irix-tabs', body);
      ['Overview', 'Details', 'Tags', 'Media', 'Map', 'References'].forEach((x, i) => {
        const t = u.el('div', 'irix-tab', tabs, x);
        if (i === 1) t.classList.add('active');
      });
      Object.assign(_c, { header: body, toolbar });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('irix-instruction', 'irix-header-note');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
      _c.headerTools.classList.add('irix-end-tools');
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'irix-workspace', document.body);
      const places = u.el('aside', 'irix-places', body);
      u.el('h2', 'irix-pane-title', places, 'Places');
      Object.assign(_c, { body, places });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.places;
      base(_c);
      _c.body = body;
      const panel = _c.places.querySelector('.ref-panel');
      if (panel) panel.classList.add('irix-instruction', 'irix-panel-note');
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      const list = u.el('div', 'irix-place-list', _c.places);
      ['Abidjan', 'Bangkok', 'Barcelona', 'Gaborone', 'Hanoi', 'Istanbul', 'Johannesburg', 'Katowice', 'Lima', 'Manila', 'Nairobi', 'Osaka', 'Reykjavik', 'Rotterdam', 'Saint Petersburg', 'Seoul', 'Singapore', 'Sydney', 'Tokyo'].forEach((name, i) => {
        const row = u.el('div', 'irix-place-row' + (i === 3 ? ' selected' : ''), list);
        u.el('span', 'irix-thumb', row, ['▥', '▦', '▧', '▤'][i % 4]);
        u.el('span', '', row, name);
      });
      const main = u.el('main', 'irix-main', _c.body);
      _c.stage = u.el('div', 'irix-stage', main);
      const inspector = u.el('aside', 'irix-inspector', _c.body);
      u.el('h2', 'irix-pane-title', inspector, 'Properties');
      const table = u.el('div', 'irix-props', inspector);
      [ ['Name', 'Gaborone'], ['Country', 'Botswana'], ['Type', 'City'], ['Population', '246,391'], ['Elevation', '1,008 m'], ['Time zone', 'UTC+2'], ['Coordinates', '24.6282° S, 25.9231° E'] ].forEach(([k, v]) => {
        const row = u.el('div', 'irix-prop-row', table);
        u.el('span', '', row, k);
        u.el('span', '', row, v);
      });
      const map = u.el('div', 'irix-map', inspector);
      u.el('span', 'irix-map-shape', map, '◈');
      u.el('i', 'irix-map-pin', map, '•');
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) note.classList.add('irix-instruction', 'irix-toast');
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('irix-footer');
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        el = u.el('section', 'irix-overlay irix-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'Cookies are used to preserve your catalog preferences.',
        toast: 'Catalog changes have been recorded.',
        chat: 'Catalog help　 How can we assist?',
        promo: 'Discover the new World Places collection.',
        banner: 'Catalog maintenance is scheduled for tonight.',
      };
      u.el('div', 'irix-overlay-copy', el, texts[ctx.kind]);
      const dismiss = u.el('button', 'irix-button irix-continue', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: 'design-choose-option-tags-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-choose-option-tags-02': palette },
      LOW_THEME: palette,
      ACCENTS: ['#756dd5'],
      LOW_ACCENTS: ['#756dd5'],
      parts,
    },
  });
})();
