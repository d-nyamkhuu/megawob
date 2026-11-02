// Design on templates/site/drag-composition-event-02.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-complete-goals-booking-02',
    styles: ['site.css'],
    scripts: [],
    template: 'site/complete-goals-event-02',
    design: {
      parts: {
        'frame.25': (base, S) =>
          function (_c) {
            const { rng } = _c;
            const sidebarDraw = rng.bool(0.35);
            const sidebar = true;
            const navDraw = rng.bool(0.5);
            const nav = true;
            Object.assign(_c, { nav, navDraw, sidebar, sidebarDraw });
          },
        'frame.26': () => () => {},
        'frame.33': (base, S) =>
          function (_c) {
            const { K, TITLES } = S;
            const { content, ctx, local, nav, rng, util } = _c;
            if (_c.display !== 'header' || nav) rng.pick(TITLES);
            if (nav) local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
            const titlebar = util.el('header', 'ref-task', document.body);
            util.el('span', 'ref-appicon', titlebar, '▣');
            util.el('div', 'ref-brand', titlebar, 'Travel Planner').dataset.role = 'brand';
            util.el('div', 'ref-window-controls', titlebar, '−　□　×');
            const menu = util.el('nav', 'ref-menubar', document.body);
            for (const item of ['File', 'Edit', 'View', 'Tools', 'Help']) {
              const a = util.el('a', 'ref-menuitem', menu, item);
              a.dataset.role = 'nav';
              a.addEventListener('click', (e) => {
                e.preventDefault();
                env.log('decoy', { what: 'nav', label: item });
              });
            }
            const toolbar = util.el('div', 'ref-toolbar', document.body);
            for (const [icon, label] of [
              ['✚', 'New'],
              ['📁', 'Open'],
              ['▤', 'Delete'],
              ['✉', 'Send'],
              ['▣', 'Print'],
            ]) {
              const b = util.el('button', 'ref-toolbar-action', toolbar);
              b.type = 'button';
              util.el('span', 'ref-toolbar-icon', b, icon);
              util.el('span', '', b, label);
              b.addEventListener('click', () => env.log('decoy', { label }));
            }
            const header = util.el('div', 'ref-task-note-host', document.body);
            if (_c.display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
            Object.assign(_c, { header, menu, titlebar, toolbar });
          },
        'frame.34': () => () => {},
        'frame.35': () => () => {},
        'frame.36': () => () => {},
        'frame.40': (base, S) =>
          function (_c) {
            const { toolbar, util } = _c;
            const headerTools = util.el('div', 'ref-tools', toolbar);
            Object.assign(_c, { headerTools });
          },
        'frame.46': (base, S) =>
          function (_c) {
            const { K } = S;
            const { body, content, local, rng, sidebar, util } = _c;
            if (sidebar) {
              local(rng.sample(content.NAV_ITEMS, rng.int(4, 7)), K.nav);
              const side = util.el('aside', 'ref-side', body);
              util.el('div', 'ref-side-heading', side, 'Trips');
              const trips = [
                ['San Francisco', 'May 20 – May 28, 2022', 'Business trip', '🌉'],
                ['New York', 'Jun 10 – Jun 18, 2022', 'Conference', '🌆'],
                ['Chicago', 'Jul 5 – Jul 9, 2022', 'Client meeting', '🏙'],
                ['Seattle', 'Aug 14 – Aug 20, 2022', 'Project kickoff', '🌃'],
                ['Boston', 'Sep 12 – Sep 16, 2022', 'Training', '🌇'],
                ['Denver', 'Oct 3 – Oct 7, 2022', 'Site visit', '🏔'],
              ];
              for (const [city, dates, detail, pict] of trips) {
                const row = util.el('div', 'ref-trip', side);
                util.el('span', 'ref-trip-image', row, pict);
                const info = util.el('span', 'ref-trip-info', row);
                util.el('strong', '', info, city);
                util.el('span', '', info, dates);
                util.el('span', '', info, detail);
              }
            }
          },
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
      },
    },
  });
})();
