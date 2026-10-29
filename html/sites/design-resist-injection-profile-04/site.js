// Design on templates/site/drag-composition-event-02.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-resist-injection-profile-04',
    styles: ['site.css'],
    scripts: [],
    template: 'site/complete-goals-event-02',
    design: {
      parts: {
        'frame.25': (base, S) => function (_c) {
          const { rng } = _c;
          const sidebar = (rng.bool(0.35), true);
          Object.assign(_c, { sidebar });
        },
        'frame.34': (base, S) => function (_c) {
          const { K, TITLES } = S;
          const { header, lr, nav, rng, util, word } = _c;
          const windowTitle = util.el('div', 'motif-titlebar', header);
          util.el('span', 'motif-appicon', windowTitle, '♟');
          util.el('span', 'motif-title', windowTitle, 'CivicConnect');
          const topNav = util.el('nav', 'civic-topnav', windowTitle);
          for (const item of ['People', 'Organizations', 'Programs', 'Outreach']) {
        util.el('span', 'civic-topnav-item', topNav, item);
      }
          const search = util.el('span', 'civic-search', windowTitle, '⌕  Search contacts, organizations, etc.');
          const windowControls = util.el('div', 'motif-window-controls', windowTitle);
          for (const mark of ['−', '□', '×']) util.el('span', 'motif-window-control', windowControls, mark);
          if (_c.display !== 'header' || nav) {
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, word ? word(lr.pick(K.brand)) : title);
        brand.dataset.role = 'brand';
      }
          Object.assign(_c, { search, topNav, windowControls, windowTitle });
        },
        'frame.45': (base, S) => function (_c) {
          const { K } = S;
          const { content, local, rng, sidebar, util } = _c;
          const menu = util.el('div', 'motif-menubar', document.body);
          for (const item of ['File', 'Edit', 'View', 'Records', 'Tools', 'Help']) {
        const entry = util.el('button', 'motif-menuitem', menu, item);
        entry.type = 'button';
      }
          const actionbar = util.el('div', 'civic-actionbar', document.body);
          for (const [icon, item] of [['✚','New'], ['▰','Open'], ['▣','Delete'], ['♟','Add to List'], ['✉','Send Email'], ['▦','Schedule']]) {
        const control = util.el('button', 'civic-action', actionbar);
        control.type = 'button';
        util.el('span', 'civic-action-icon', control, icon);
        util.el('span', '', control, item);
        control.addEventListener('click', () => env.log('decoy', { what:'toolbar', label:item }));
      }
          const body = util.el('div', 'ref-body', document.body);
          if (sidebar) {
        const side = util.el('aside', 'ref-side', body);
        const oldItems = local(rng.sample(content.NAV_ITEMS, rng.int(4, 7)), K.nav);
        for (const item of ['Contacts', 'Calendar', 'Mail', 'Projects', 'Partners', 'Reports']) {
          const row = util.el('a', 'ref-sidelink motif-railitem', side);
          row.href = '#';
          const icon = util.el('span', 'motif-railicon', row, ({Contacts:'▤', Calendar:'▦', Mail:'✉', Projects:'▧', Partners:'♟', Reports:'▥'})[item]);
          util.el('span', 'motif-railtext', row, item);
          row.dataset.role = 'nav';
          row.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label: item }); });
        }
        void oldItems;
        /* Retain the sidebar's sampled items draw above; the Motif rail is fixed by the design. */
      }
          Object.assign(_c, { actionbar, body, menu });
        },
        'frame.46': () => () => {},
        'frame.47': () => () => {},
        'frame.48': () => () => {},
        'frame.49': () => () => {},
        'frame.50': () => () => {},
        'frame.51': () => () => {},
        'frame.52': () => () => {},
        'frame.53': () => () => {},
        'frame.54': () => () => {},
        'frame.55': () => () => {},
        'frame.56': () => () => {},
        'frame.57': () => () => {},
        'frame.58': () => () => {},
        'frame.59': () => () => {},
        'frame.60': () => () => {},
        'frame.61': () => () => {},
        'frame.62': () => () => {},
        'frame.63': () => () => {},
        'frame.64': () => () => {},
        'frame.65': () => () => {},
        'frame.66': () => () => {},
        'frame.67': () => () => {},
        'frame.68': () => () => {},
        'frame.69': () => () => {},
        'frame.70': () => () => {},
        'frame.71': () => () => {},
        'frame.74': (base, S) => function (_c) {
          const { rng, stage } = _c;
          rng.pick(['center', 'center', 'flex-start', 'flex-end']);
          rng.pick(['center', 'center', 'flex-start', 'flex-end']);
          stage.style.justifyContent = 'stretch';
          stage.style.alignItems = 'stretch';
        },
        'frame.75': () => () => {},
      },
    },
  });
})();
