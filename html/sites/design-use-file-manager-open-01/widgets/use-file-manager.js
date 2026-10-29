// Design on the shared use-file-manager/explorer template.
env.widget({
  task: 'use-file-manager',
  site: 'design-use-file-manager-open-01',
  name: 'design',
  split: 'train',
  scenarios: ['open'],
  template: 'use-file-manager/explorer',
  design: {
    titleHeight: 58, toolbarHeight: 58, statusHeight: 26, margin: 0, windowRadius: 20,
      fontSize: 15, nameFontSize: 14, detailFontSize: 13, folderTone: '#1599f4', tileGap: 20,
      lightsChance: 1, panel: 'rgba(255,255,255,.94)', line: 'rgba(121,148,179,.2)', accent: '#1689ef',
      fg: '#141821', muted: '#727d93',
    parts: {
      fit(base, S) { return (ctx) => {
        // Preserve the template's seeded draws, then fit this full-stage design.
        base(ctx);
        S.geo = { left: 0, top: 0, winW: Math.floor(ctx.size.width), winH: Math.floor(ctx.size.height) };
      }; },
      paneSize(base, S) { return (ctx) => {
        base(ctx);
        const { winW, winH } = S.geo;
        const recentW = Math.min(290, Math.max(140, Math.round(winW * .25)));
        const treeW = Math.min(190, Math.max(118, Math.round(winW * .165)));
        // Include the Recent column and the design's extra pane padding.
        S.geo = { treeW, paneW: winW - treeW - recentW - 27,
          paneH: winH - S.D.titleHeight - S.D.toolbarHeight - S.D.statusHeight - 22 };
        S.els.win.style.setProperty('--fm-recent-width', recentW + 'px');
      }; },
      css(base, S) { return (ctx) => base(ctx) + `
        .fm-win { box-sizing: border-box; }
        .fm-title { padding: 0 18px; gap: 16px; }
        .fm-title .lights { gap: 8px; }
        .fm-title .lights i { width: 17px; height: 17px; }
        .fm-bar { gap: 12px; padding: 0 14px; }
        .fm-ib { height: 38px; min-width: 38px; padding: 0 11px; }
        .fm-ib svg { width: 19px; height: 19px; }
        .fm-crumbs { height: 40px; }
        .fm-tree { box-sizing: border-box; padding: 12px 9px; }
        .fm-tr { min-height: 34px; font-size: 14px; }
        .fm-tr svg.fi { width: 22px; height: 22px; }
        .fm-pane { padding: 20px 24px; }
        .fm-tile { gap: 8px; }
        .fm-title b { display: none; }
      `; },
      title(base, S) { return (ctx) => {
        base(ctx);
        const title = S.els.title;
        const nav = ctx.util.el('div', 'fm-top-nav', title);
        for (const glyph of ['‹', '›']) {
          const b = ctx.util.el('button', 'fm-top-control fm-top-arrow', nav, glyph);
          b.type = 'button'; b.setAttribute('aria-label', glyph === '‹' ? 'Back' : 'Forward');
        }
        const group = ctx.util.el('div', 'fm-top-tools', title);
        const controls = [
          ['▦', 'Icon view'], ['☷', 'List view'], ['◫', 'Column view'],
          ['☷⌄', 'Sort and group'], ['⇧', 'Share'], ['◇', 'Tags'], ['•••', 'More'],
        ];
        for (const [glyph, label] of controls) {
          const b = ctx.util.el('button', 'fm-top-control', group, glyph);
          b.type = 'button'; b.title = label; b.setAttribute('aria-label', label);
        }
        const search = ctx.util.el('div', 'fm-search', title);
        ctx.util.el('span', 'fm-search-icon', search, '⌕');
        ctx.util.el('span', 'fm-search-label', search, 'Search');
      }; },
      body(base, S) { return (ctx) => {
        base(ctx);
        const recent = ctx.util.el('aside', 'fm-recent', S.els.bodyEl);
        ctx.util.el('div', 'fm-recent-title', recent, 'Recent');
        const entries = [
          ['▤', 'Roadmap.pdf', 'Today, 10:24 AM', '#f2f4f8'],
          ['▦', 'Site Mockup.png', 'Today, 9:41 AM', '#e9e9fb'],
          ['▧', 'Team Photo.jpg', 'Yesterday, 4:03 PM', '#e9f1ed'],
          ['▣', 'Design Brief.key', 'Yesterday, 1:20 PM', '#e8f4ff'],
          ['▧', 'PXL_20210428_762409343.svg', 'Apr 28, 2021, 11:17 AM', '#e5f3ff'],
          ['▣', 'Logo Options.png', 'Apr 27, 2021, 3:18 PM', '#fff1e7'],
          ['◉', 'User Flow.fig', 'Apr 26, 2021, 2:11 PM', '#252a31'],
          ['▤', 'Visuals.zip', 'Apr 25, 2021, 9:02 AM', '#f4f4f4'],
          ['▤', 'Meeting Notes.pages', 'Apr 24, 2021, 5:46 PM', '#f2f7ff'],
          ['▧', 'Inspiration.jpg', 'Apr 22, 2021, 3:15 PM', '#e7f2fb'],
        ];
        for (const [icon, name, date, color] of entries) {
          const row = ctx.util.el('div', 'fm-recent-row', recent);
          const thumb = ctx.util.el('span', 'fm-recent-thumb', row, icon);
          thumb.style.background = color;
          const text = ctx.util.el('span', 'fm-recent-copy', row);
          ctx.util.el('span', 'fm-recent-name', text, name);
          ctx.util.el('span', 'fm-recent-date', text, date);
        }
      }; },
    },
  },
});
