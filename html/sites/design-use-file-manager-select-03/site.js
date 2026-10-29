// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.placement': (base, S) =>
      function (_c) {
        const { W, content, ctx, local, lr, rng, roomy, tall, word } = _c;
        const { K, endLabel } = S;
        // End control placement (none in finish mode).
        let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
        const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
        if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
        const sidebar = roomy && rng.bool(0.35);
        const navDraw = W >= 1180 && rng.bool(0.5);
        const nav = true;
        const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
        let label = endLabel(rng, content);
        if (word) label = word(lr.pick(K.end));
        // A decoy that reads like an end control (another end word, never this episode's label).
        const { collide, cr } = S.frameCollide(_c, label);
        Object.assign(_c, { collide, cr, decoys, label, nav, navDraw, placement, sidebar, wantFooter });
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { content, display, local, lr, nav, navDraw, rng, util, word } = _c;
        const { K, TITLES } = S;
        const header = util.el('header', 'ref-task', document.body);
        if (display !== 'header' || nav) {
          const title = rng.pick(TITLES);
          const brand = util.el('div', 'ref-brand', header, word ? word(lr.pick(K.brand)) : title);
          brand.textContent = 'My Computer';
          brand.dataset.portal = 'Your Files, Folders and More on the Web';
          brand.dataset.role = 'brand';
        }
        if (nav) {
          const n = util.el('nav', 'ref-nav', header);
          // Keep the legacy seeded draw in place, while presenting the reference app's tabs.
          if (navDraw) local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
          for (const item of ['Files', 'Recents', 'Shared', 'Favorites']) {
            const a = util.el('a', 'ref-navlink', n, item);
            a.dataset.role = 'nav';
            a.addEventListener('click', (e) => {
              e.preventDefault();
              env.log('decoy', { what: 'nav', label: item });
            });
          }
        }
        Object.assign(_c, { header });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { content, local, rng, sidebar, util } = _c;
        const { K } = S;
        const body = util.el('div', 'ref-body', document.body);
        if (sidebar || true) {
          const side = util.el('aside', 'ref-side', body);
          const sectionNames = [
            'File Tasks',
            'New Folder',
            'Share this Folder',
            'Publish to Web',
            'Other Places',
            'My Documents',
            'Shared Documents',
            'My Computer',
            'My Network Places',
            'Recycle Bin',
            'Resources',
            'Disk Cleanup',
            'Scan for Viruses',
            'Map Network Drive',
            'Related Links',
            'Windows Update',
            'Get Connected',
            'File and Folder Tips',
            'More Storage Online',
          ];
          local(rng.sample(content.NAV_ITEMS, rng.int(4, 7)), K.nav);
          for (const item of sectionNames) {
            const a = util.el('a', 'ref-sidelink', side, item);
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
        S.frameAlign(_c, stage);
        const recent = util.el('aside', 'ref-recent', body);
        util.el('div', 'ref-recent-title', recent, 'Recent Files');
        const recentRows = [
          ['pdf', 'Report.pdf', 'Apr 12, 1998'],
          ['music', 'Holiday Song.mp3', 'Apr 12, 1998'],
          ['txt', 'Notes.txt', 'Apr 12, 1998'],
          ['image', 'Photo.png', 'Apr 11, 1998'],
          ['music', 'Interview.wav', 'Apr 10, 1998'],
          ['image', 'Sunset.gif', 'Apr 9, 1998'],
          ['music', 'Meeting Recording.au', 'Apr 9, 1998'],
          ['image', 'Beach.jpg', 'Apr 8, 1998'],
          ['zip', 'Archive.zip', 'Apr 8, 1998'],
          ['doc', 'Plan.doc', 'Apr 7, 1998'],
        ];
        for (const [kind, file, date] of recentRows) {
          const row = util.el('div', `ref-recent-row ref-recent-${kind}`, recent);
          util.el(
            'span',
            'ref-recent-icon',
            row,
            kind === 'music'
              ? '♪'
              : kind === 'image'
                ? '▧'
                : kind === 'pdf'
                  ? 'PDF'
                  : kind === 'zip'
                    ? '▤'
                    : kind === 'doc'
                      ? 'W'
                      : '▤',
          );
          const info = util.el('span', 'ref-recent-info', row);
          util.el('span', 'ref-recent-name', info, file);
          util.el('span', 'ref-recent-date', info, date);
        }
        Object.assign(_c, { recent, recentRows, stage });
      },
    'frame.footer': (base, S) =>
      function (_c) {
        const { collide, decoyBtn, decoys, endBtn, label, lr, placement, rng, util, wantFooter, word } = _c;
        let { submit } = _c;
        if (wantFooter) {
          const foot = util.el('footer', 'ref-foot', document.body);
          const footText = rng.pick([
            '© 2024 Example Co.',
            'All changes are saved automatically.',
            'Need help? Contact your administrator.',
            'v4.2.1 · Status: all systems normal',
          ]);
          util.el(
            'span',
            'ref-foot-text',
            foot,
            word
              ? lr.pick([
                  `© 2024 Example Co. ${word('footRights')}`,
                  word('footSaved'),
                  word('footHelp'),
                  `v4.2.1 · ${word('footStatus')}`,
                ])
              : footText,
          );
          const dock = util.el('div', 'ref-dock-icons', foot);
          for (const [icon, label] of [
            ['computer', 'My Computer'],
            ['folder', 'My Documents'],
            ['folder', 'Shared Documents'],
            ['network', 'My Network Places'],
            ['recycle', 'Recycle Bin'],
            ['internet', 'Internet'],
          ]) {
            const item = util.el('span', `ref-dock-item ref-dock-${icon}`, dock);
            util.el('span', 'ref-dock-icon', item);
            util.el('span', 'ref-dock-label', item, label);
          }
          const tools = util.el('div', 'ref-tools', foot);
          if (decoys.length > 1) decoyBtn(tools, decoys[1]);
          if (collide && collide.where === 'footer') decoyBtn(tools, collide.text, true);
          if (placement === 'footer') submit = endBtn(tools, 'ref-submit', label);
          if (placement === 'link') submit = endBtn(tools, 'ref-endlink', `${label} ›`);
        }
        Object.assign(_c, { submit });
      },
    'frame.floating': (base, S) =>
      function (_c) {
        const { endBtn, label, placement, util, wantFooter } = _c;
        let { submit } = _c;
        if (placement === 'floating') {
          // Reserve the control's space so it cannot intercept task clicks or drags.
          // On scrollable pages the dock follows the content, just like a form footer.
          const dock = util.el('div', 'ref-float-dock', document.body);
          submit = endBtn(dock, 'ref-submit ref-float', label);
        }
        if (!wantFooter) {
          const foot = util.el('footer', 'ref-foot', document.body);
          const dock = util.el('div', 'ref-dock-icons', foot);
          for (const [icon, itemLabel] of [
            ['computer', 'My Computer'],
            ['folder', 'My Documents'],
            ['folder', 'Shared Documents'],
            ['network', 'My Network Places'],
            ['recycle', 'Recycle Bin'],
            ['internet', 'Internet'],
          ]) {
            const item = util.el('span', `ref-dock-item ref-dock-${icon}`, dock);
            util.el('span', 'ref-dock-icon', item);
            util.el('span', 'ref-dock-label', item, itemLabel);
          }
        }
        Object.assign(_c, { submit });
      },
    'frame.nav': (base, S) => function (_c) {},
  };

  env.site({
    name: 'design-use-file-manager-select-03',
    template: 'site/base',
    design: { parts },
  });
})();
