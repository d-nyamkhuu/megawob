// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.theme': (base, S) =>
      function (_c) {
        const { ctx } = _c;
        const { ACCENTS, LOW_ACCENTS, LOW_THEME, THEMES } = S;
        const { rng, util, content } = ctx;
        let name = rng.pick(Object.keys(THEMES));
        const root = document.documentElement;
        let accent = rng.pick(ACCENTS);
        const tr = rng.fork('chrome/theme');
        if (tr.bool(0.08)) {
          name = 'low';
          accent = tr.pick(LOW_ACCENTS);
        }
        for (const [k, v] of Object.entries(name === 'low' ? LOW_THEME : THEMES[name]))
          root.style.setProperty(`--${k}`, v);
        root.style.setProperty('--accent', accent);
        // This reference design uses one cool gray Bootstrap-era palette across episodes.
        root.style.setProperty('--bg', '#eef1f4');
        root.style.setProperty('--panel', '#ffffff');
        root.style.setProperty('--fg', '#171e2c');
        root.style.setProperty('--muted', '#8993a3');
        root.style.setProperty('--line', '#c5cdd8');
        root.style.setProperty('--accent', '#0865cd');
        root.dataset.theme = 'light';
        Object.assign(_c, { accent, content, name, rng, root, tr, util });
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { content, display, label, nav, rng, util } = _c;
        const { TITLES } = S;
        const header = util.el('header', 'ref-task', document.body);
        if (display !== 'header' || nav) rng.pick(TITLES);
        if (nav) rng.sample(content.NAV_ITEMS, rng.int(3, 5));
        const brand = util.el('div', 'ref-brand', header, 'Staff Portal');
        brand.dataset.role = 'brand';
        const appMark = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        appMark.setAttribute('viewBox', '0 0 24 24');
        appMark.setAttribute('aria-hidden', 'true');
        appMark.innerHTML =
          '<rect x="5.5" y="5.5" width="13" height="13" rx="2.5"/><circle cx="12" cy="10" r="2"/><path d="M8.5 16a3.5 3.5 0 0 1 7 0"/>';
        brand.prepend(appMark);
        const windowControls = util.el('div', 'ref-window-controls', header);
        for (const [label, glyph] of [
          ['Minimize', '−'],
          ['Maximize', '□'],
          ['Close', '×'],
        ]) {
          const control = util.el('span', 'ref-window-control', windowControls, glyph);
          control.setAttribute('aria-label', label);
        }
        const appActions = util.el('div', 'ref-app-actions', header);
        util.el('span', 'ref-bell', appActions, '♧').setAttribute('aria-label', 'Notifications');
        util.el('span', 'ref-avatar', appActions, 'JD').setAttribute('aria-label', 'User profile');
        util.el('span', 'ref-chevron', appActions, '⌄').setAttribute('aria-label', 'Profile menu');
        Object.assign(_c, { appActions, appMark, brand, header, windowControls });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { content, rng, sidebar, util } = _c;
        const body = util.el('div', 'ref-body', document.body);
        if (sidebar) rng.sample(content.NAV_ITEMS, rng.int(4, 7));
        Object.assign(_c, { body });
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, rng, util } = _c;
        const stage = util.el('main', 'ref-stage', body);
        rng.pick(['center', 'center', 'flex-start', 'flex-end']);
        rng.pick(['center', 'center', 'flex-start', 'flex-end']);
        stage.style.justifyContent = 'stretch';
        stage.style.alignItems = 'stretch';
        const side = util.el('nav', 'ref-sidebar', document.body);
        side.setAttribute('aria-label', 'Main navigation');
        const sidebarItems = [
          ['Home', '<path d="m3 10 9-7 9 7M5.5 9v11h5v-6h3v6h5V9"/>'],
          ['People', '<circle cx="12" cy="7.5" r="3.2"/><path d="M4.5 20v-1.3a7.5 7.5 0 0 1 15 0V20Z"/>'],
          ['Requests', '<path d="M6 3.5h8l4 4V21H6zM14 3.5V8h4M9 12h6M9 16h6"/>'],
          ['Orders', '<path d="M3 4h2l2.2 11h10.9l2-8H6M9 19a1 1 0 1 0 0 .1M17 19a1 1 0 1 0 0 .1"/>'],
          ['Reports', '<path d="M4 20V11h4v9M10 20V5h4v15M16 20v-8h4v8M3 20h18"/>'],
          [
            'Settings',
            '<circle cx="12" cy="12" r="3"/><path d="m19 13.5 1.4 1.1-1.5 2.6-1.8-.6a7 7 0 0 1-1.5.9l-.3 1.9h-3l-.4-1.9a7 7 0 0 1-1.5-.9l-1.8.6-1.5-2.6 1.4-1.1a7 7 0 0 1 0-1.8l-1.4-1.1 1.5-2.6 1.8.6a7 7 0 0 1 1.5-.9l.4-1.9h3l.3 1.9a7 7 0 0 1 1.5.9l1.8-.6 1.5 2.6-1.4 1.1a7 7 0 0 1 0 1.8Z" transform="translate(-1 -1)"/>',
          ],
        ];
        for (const [text, path] of sidebarItems) {
          const item = util.el('div', `ref-sidebar-item${text === 'People' ? ' is-current' : ''}`, side);
          const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          icon.setAttribute('viewBox', '0 0 24 24');
          icon.setAttribute('aria-hidden', 'true');
          icon.innerHTML = path;
          item.append(icon);
          util.el('span', '', item, text);
        }
        Object.assign(_c, { side, sidebarItems, stage });
      },
    'frame.nav': (base, S) => function (_c) {},
  };

  env.site({
    name: 'design-recall-info-crossref-02',
    template: 'site/base',
    design: { parts },
  });
})();
