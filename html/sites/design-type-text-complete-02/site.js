(function () {
  'use strict';
  const palette = { bg: '#c5c5c5', panel: '#e6e6e6', fg: '#111', muted: '#555', line: '#858585' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // All instruction modes fit in the dedicated central pane.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const win = u.el('div', 'os-window', document.body);
      const title = u.el('header', 'os-title', win);
      u.el('span', 'os-appicon', title, '♟');
      u.el('b', '', title, 'People Manager');
      u.el('button', 'os-close', title, '×');
      const menu = u.el('nav', 'os-menu', win);
      u.el('span', 'os-grip', menu, '↕');
      ['File', 'Edit', 'View', 'Record', 'Tools', 'Help'].forEach((x) => u.el('span', '', menu, x));
      const tools = u.el('div', 'os-tools', win);
      [
        ['▧', 'New'], ['📂', 'Open'], ['▤', 'Delete'], ['⌕', 'Find'], ['▤', 'Print'],
      ].forEach(([i, t]) => {
        const b = u.el('button', 'os-tool', tools);
        u.el('span', 'os-tool-icon', b, i);
        u.el('span', '', b, t);
      });
      const center = u.el('section', 'os-center');
      const tabs = u.el('nav', 'os-tabs', center);
      ['Details', 'Address', 'Communication', 'Notes'].forEach((x, i) => {
        u.el('div', 'os-tab' + (!i ? ' active' : ''), tabs, x);
      });
      Object.assign(_c, { win, tools, center, header: center });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.tools;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'os-body', _c.win);
      const contacts = u.el('aside', 'os-contacts', body);
      u.el('h2', 'os-panehead', contacts, 'Contacts');
      const names = [
        'Baker, Simon', 'Carter, Melissa', 'Davies, Rachael', 'Evans, Tom',
        'Grant, Heidi', 'Hughes, Daniel', 'Lawson, Paula', 'Mills, Kevin',
        'Parker, Owen', 'Reed, Nicola', 'Roberts, James', 'Turner, Elaine',
        'White, Colin', 'Young, Sophie',
      ];
      names.forEach((n, i) => {
        const r = u.el('div', 'os-contact' + (i === 1 ? ' selected' : ''), contacts);
        u.el('span', 'os-person', r, '♟');
        u.el('span', '', r, n);
      });
      body.appendChild(_c.center);
      const inspect = u.el('aside', 'os-inspector', body);
      u.el('h2', 'os-panehead', inspect, 'Properties');
      [
        ['Type:', 'Person'], ['Created:', '14 Mar 1989  10:24'],
        ['Last edited:', '14 Mar 1989  10:24'], ['Record size:', '1.2K'],
      ].forEach((pair) => {
        const r = u.el('div', 'os-prop', inspect);
        u.el('span', '', r, pair[0]);
        u.el('span', '', r, pair[1]);
      });
      u.el('hr', '', inspect);
      [['Category:', 'Customer'], ['Status:', 'Active']].forEach((pair) => {
        const r = u.el('div', 'os-prop', inspect);
        u.el('span', '', r, pair[0]);
        u.el('button', 'os-select', r, pair[1] + '　▾');
      });
      _c.body = body;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.center;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'os-stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.center.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      const u = _c.util;
      const bar = u.el('footer', 'os-iconbar', _c.win);
      [
        ['🫐', 'Apps'], ['▣', 'Discs'], ['▤', 'Documents'], ['🌐', 'Utilities'], ['🎨', 'Paint'],
      ].forEach(([i, t]) => {
        const b = u.el('div', 'os-app', bar);
        u.el('span', '', b, i);
        u.el('span', '', b, t);
      });
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) bar.appendChild(foot);
      _c.bar = bar;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.bar.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'This application stores preferences on this computer.',
        toast: 'Record updated.',
        chat: 'People Manager help. How can we assist?',
        promo: 'New features are available.',
        banner: 'System notice: routine service update.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const b = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      b.onclick = () => ctx.dismiss('close');
      return { el, dismiss: b, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: 'design-type-text-complete-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-type-text-complete-02': palette },
      LOW_THEME: palette,
      ACCENTS: ['#2868ea'],
      LOW_ACCENTS: ['#2868ea'],
      parts,
    },
  });
})();
