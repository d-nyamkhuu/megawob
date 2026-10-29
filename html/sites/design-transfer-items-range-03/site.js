// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.placement': (base, S) =>
      function (_c) {
        const { W, content, ctx, local, lr, rng, roomy, tall, word } = _c;
        const { K, endLabel } = S;
        // End control placement (none in finish mode).
        let placement = ctx.finish
          ? null
          : rng.pick(['footer', 'footer', 'footer', 'footer', 'header', 'link', 'icon', 'floating']);
        const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
        if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
        const sampledSidebar = roomy && rng.bool(0.35);
        const sidebar = true;
        const nav = W >= 1180 && rng.bool(0.5);
        const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
        let label = endLabel(rng, content);
        if (!word && rng.fork('chrome/next-save').bool(0.6)) label = 'Save';
        if (word) label = word(lr.pick(K.end));
        // A decoy that reads like an end control (another end word, never this episode's label).
        const { collide, cr } = S.frameCollide(_c, label);
        Object.assign(_c, { collide, cr, decoys, label, nav, placement, sampledSidebar, sidebar, wantFooter });
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { rng, util } = _c;
        const { TITLES } = S;
        const header = util.el('header', 'ref-task', document.body);
        rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, 'Riverton Public Library');
        brand.dataset.role = 'brand';
        const book = util.el('span', 'ref-bookmark', brand);
        book.innerHTML =
          '<svg viewBox="0 0 72 56" aria-hidden="true"><path d="M4 6h12c8 0 15 3 20 8 5-5 12-8 20-8h12v39H55c-8 0-14 2-19 7-5-5-11-7-19-7H4z"/><path d="M36 14v37M10 12v28h9c7 0 12 1 17 5 5-4 10-5 17-5h9V12M14 17h12M14 23h12M14 29h12M46 17h12M46 23h12M46 29h12"/></svg>';
        const libraryArt = util.el('div', 'library-engraving', header);
        libraryArt.innerHTML =
          '<svg viewBox="0 0 230 100" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.55"><path d="M8 77h214M16 73h198M23 70V42l13-9v-9h17v9l13 9v28M70 70V36l44-22 45 22v34M161 70V42l13-9v-9h17v9l14 9v28M66 38h98M76 70V43h20v27m10 0V43h19v27m10 0V43h19v27M31 46h27M171 45h28M13 81h204M92 30l22-12 23 12M105 19V8h19v11M112 8V4h5v4M39 36h14M174 35h17"/><path d="M73 39v-5h7v5m3 0v-6h8v6m18-5v-8h8v8m5 0v-8h8v8m5 0v-7h8v7m5 0v-6h7v6m5 28v-8h5v8m-70 0v-8h5v8m15 0v-8h5v8m15 0v-8h5v8m15 0v-8h5v8M28 51v15m5-15v15m5-15v15m5-15v15m5-15v15m5-15v15m121-15v15m5-15v15m5-15v15m5-15v15m5-15v15M70 75h96M76 77h87"/><path d="M67 33l47-24 48 24M73 31l41-20 42 20M99 85h31l-3-4h-25zM112 85v-8m5 8v-8"/></g></svg><span>BOOKS<br>PEOPLE<br>IDEAS<br>OUR COMMUNITY</span>';
        const menu = util.el('nav', 'next-menu', header);
        for (const item of ['File', 'Edit', 'View', 'Project', 'Team', 'Window', 'Help']) {
          util.el('span', '', menu, item);
        }
        const toolbar = util.el('div', 'next-toolbar', header);
        for (const [icon, label] of [
          ['▧', 'New'],
          ['▰', 'Open'],
          ['♟♟', 'Teams'],
          ['▤', 'Tasks'],
          ['▦', 'Schedule'],
          ['▥', 'Reports'],
        ]) {
          const tool = util.el('div', 'next-tool', toolbar);
          util.el('span', 'next-tool-icon', tool, icon);
          util.el('span', '', tool, label);
        }
        Object.assign(_c, { book, brand, header, libraryArt, menu, toolbar });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { content, local, rng, sampledSidebar, sidebar, util } = _c;
        const { K } = S;
        const body = util.el('div', 'ref-body', document.body);
        if (sidebar) {
          if (sampledSidebar) local(rng.sample(content.NAV_ITEMS, rng.int(4, 7)), K.nav);
          const side = util.el('aside', 'ref-side', body);
          const sideEntries = [
            ['Catalog', '<path d="M3 9 12 3l9 6v11H3z"/><path d="M8 20v-7h8v7M7 9h.01M12 9h.01M17 9h.01"/>'],
            ['Search', '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>'],
            ['Titles', '<path d="M4 5h16M4 10h16M4 15h16M4 20h16"/><path d="M2 5h.01M2 10h.01M2 15h.01M2 20h.01"/>'],
            [
              'Authors',
              '<circle cx="9" cy="8" r="3"/><path d="M3 20c0-4 2-6 6-6s6 2 6 6M17 6a3 3 0 0 1 0 6M18 14c2 1 3 3 3 6"/>',
            ],
            ['Subjects', '<path d="M3 11 13 3h8v8l-10 10z"/><circle cx="17" cy="7" r="1"/>'],
            ['Items', '<rect x="4" y="3" width="16" height="18"/><path d="M8 7h8v4H8zM8 15h8M8 18h8"/>'],
            ['Reports', '<path d="M6 2h9l5 5v15H6zM15 2v6h5M9 12h8M9 16h8M9 20h5"/>'],
            [
              'Administration',
              '<circle cx="12" cy="12" r="3"/><path d="M19 13.5a7 7 0 0 0 0-3l2-1.5-2-3.5-2.5 1a8 8 0 0 0-2.5-1.5L13.5 2h-4L9 5a8 8 0 0 0-2.5 1.5l-2.5-1L2 9l2 1.5a7 7 0 0 0 0 3L2 15l2 3.5 2.5-1A8 8 0 0 0 9 19l.5 3h4l.5-3a8 8 0 0 0 2.5-1.5l2.5 1L21 15z"/>',
            ],
          ];
          for (const [item, icon] of sideEntries) {
            const a = util.el('a', 'ref-sidelink', side);
            a.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${icon}</svg><span>${item}</span>`;
            a.dataset.role = 'nav';
            a.addEventListener('click', (e) => {
              e.preventDefault();
              env.log('decoy', { what: 'sidebar', label: item });
            });
          }
        }
        Object.assign(_c, { body });
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, util } = _c;
        const stage = util.el('main', 'ref-stage', body);
        const workspace = util.el('section', 'next-workspace', stage);
        util.el('h1', '', workspace, 'Corporate Site');
        util.el('div', 'next-subtitle', workspace, 'Website redesign and launch');
        util.el(
          'div',
          'next-bottom-info',
          workspace,
          'Start Date:      Apr 12, 1993                         End Date:      Sep 30, 1993                         Status:      Planning',
        );
        const inspector = util.el('aside', 'next-inspector', body);
        util.el('h2', '', inspector, 'About MARC Fields');
        util.el(
          'p',
          '',
          inspector,
          'Move fields from the Available list to the Selected list to choose which MARC fields to include.',
        );
        util.el('b', '', inspector, 'Ways to move items');
        const help = util.el('ul', '', inspector);
        for (const tip of [
          'Select one or more items and click an arrow button.',
          'Double-click an item to move it.',
          'Drag an item (or the selection) to the other list.',
          'Use Ctrl-click to select non-adjacent items.',
          'Use Shift-click to select a range.',
        ])
          util.el('li', '', help, tip);
        util.el('b', '', inspector, 'Arrow button actions');
        for (const tip of [
          '>　 Move selected item(s) to the right.',
          '>>　 Move all items to the right.',
          '<　 Move selected item(s) to the left.',
          '<<　 Move all items to the left.',
        ])
          util.el('p', '', inspector, tip);
        S.frameAlign(_c, stage);
        Object.assign(_c, { help, inspector, stage, workspace });
      },
  };

  env.site({
    name: 'design-transfer-items-range-03',
    template: 'site/base',
    design: { parts },
  });
})();
