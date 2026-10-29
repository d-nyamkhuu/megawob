// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.lang': (base, S) =>
      function (_c) {
        const { ctx, rng, util } = _c;
        // Localized frame: same layout draws as English, texts from UI_WORDS (own stream).
        const word = ctx.lang && ctx.lang !== 'en' && ctx.word ? ctx.word : null;
        const lr = rng.fork('chrome/lang');
        const local = (list, keys) => (word ? lr.sample(keys, list.length).map(word) : list);
        const closeLabel = word ? word('close') : 'Close';

        // KDE Breeze desktop frame and city summary band for this design.
        const winbar = util.el('div', 'breeze-window', document.body);
        const appicon = util.el('span', 'breeze-appicon', winbar);
        appicon.innerHTML =
          '<svg viewBox="0 0 24 24" width="16" height="16" fill="white" aria-hidden="true"><path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7Zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z"/></svg>';
        util.el('span', 'breeze-title', winbar, 'City Navigator');
        const wincontrols = util.el('div', 'breeze-wincontrols', winbar);
        for (const mark of ['−', '□', '×']) util.el('span', '', wincontrols, mark);
        const menu = util.el('nav', 'breeze-menu', document.body);
        for (const item of ['File', 'View', 'Tools', 'Map', 'Places', 'Help']) util.el('span', '', menu, item);
        const citybar = util.el('div', 'breeze-citybar', document.body);
        const identity = util.el('div', 'breeze-identity', citybar);
        const skyline = util.el('div', 'breeze-skyline', identity);
        skyline.innerHTML =
          '<svg viewBox="0 0 150 80" aria-hidden="true"><defs><linearGradient id="skyline-hills" x2="0" y2="1"><stop stop-color="#b2d1ef"/><stop offset="1" stop-color="#7e9abc"/></linearGradient></defs><path fill="url(#skyline-hills)" d="M0 40 34 19 68 41 99 49 135 28 150 36v44H0z"/><path fill="#95b3d1" d="M0 62 23 54l20 6 19-23 21 17 15-10 23 15 29-6v27H0z"/><path fill="#7895b6" d="M0 69h22V54h10v-5h9v31H0zm48 11V43h11v-9h4v8h9v38zm32 0V23h5V13h5V0h2v13h5v10h4v57zm27 0V53h8v-6h4v6h8v27zm25 0V63h18v17z"/><path fill="#6e89aa" d="M31 80V61h12v-7h8v26zm31 0V39h10v-3h5v44zm20 0V27h12v53zm28 0V62h17v18z"/><path fill="#a5bfd8" opacity=".3" d="M0 74h150v6H0z"/></svg>';
        const cityname = util.el('div', 'breeze-cityname', identity);
        util.el('strong', '', cityname, 'Rivermere');
        util.el('span', '', cityname, 'Map & Route Planner');
        const stats = util.el('div', 'breeze-stats', citybar);
        const icons = [
          '<path d="M12 2C6.8 2 3 5.9 3 10.6c0 6.2 9 13.4 9 13.4s9-7.2 9-13.4C21 5.9 17.2 2 12 2Zm0 12a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Z"/>',
          '<path d="M4 22 8 2h3L9 22zm9 0 2-20h3l4 20z"/>',
          '<path d="m12 2-7 9h5l-2 5h4v6h2v-6h4l-3-5h5z"/>',
          '<path d="M2 7c3.3 0 3.3 3 6.7 3s3.3-3 6.6-3S18.7 10 22 10M2 14c3.3 0 3.3 3 6.7 3s3.3-3 6.6-3 3.4 3 6.7 3" fill="none" stroke="currentColor" stroke-width="3"/>',
          '<path d="m2 20 8-16 4 8 3-5 5 13z"/>',
        ];
        for (const [index, value, caption] of [
          [0, '20', 'Places'],
          [1, '6', 'Districts'],
          [2, '4', 'Parks'],
          [3, '1', 'River'],
          [4, '1', 'Coastline'],
        ]) {
          const stat = util.el('div', 'breeze-stat', stats);
          const icon = util.el('b', '', stat);
          icon.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[index]}</svg>`;
          const txt = util.el('span', '', stat);
          util.el('strong', '', txt, value);
          util.el('small', '', txt, caption);
        }
        const search = util.el('div', 'breeze-search', citybar, '⌕　 Search places, streets or districts…　⌄');
        const dock = util.el('nav', 'breeze-dock', document.body);
        const dockIcons = {
          Map: '<path d="m2 5 6-3 8 3 6-3v17l-6 3-8-3-6 3z" fill="currentColor"/><path d="M8 4v13m8-10v13" stroke="#eff4fa" stroke-width="1.5"/>',
          Places:
            '<path d="M8 5h14M8 12h14M8 19h14" stroke="currentColor" stroke-width="3"/><path d="M2 3h3v4H2zm0 7h3v4H2zm0 7h3v4H2z" fill="currentColor"/>',
          Route:
            '<path d="m6 18 12-12" stroke="currentColor" stroke-width="3"/><circle cx="5" cy="19" r="3" fill="#eff4fa" stroke="currentColor" stroke-width="3"/><circle cx="19" cy="5" r="3" fill="#eff4fa" stroke="currentColor" stroke-width="3"/>',
          Settings:
            '<path d="m10 1-1 4-3 1-3-1-2 4 3 3-1 3-2 2 3 4 4-1 3 1 1 3 4-1 1-4 3-1 3 1 2-4-3-3 1-3 2-2-3-4-4 1-3-1-1-3z" transform="translate(1 0) scale(.9)" fill="currentColor"/><circle cx="12" cy="12" r="4" fill="#eff4fa"/>',
        };
        for (const [icon, label, active] of [
          ['◧', 'Map', true],
          ['☷', 'Places', false],
          ['♧', 'Route', false],
          ['⚙', 'Settings', false],
        ]) {
          const item = util.el('div', `breeze-dockitem${active ? ' active' : ''}`, dock);
          util.el('b', '', item).innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${dockIcons[label]}</svg>`;
          util.el('span', '', item, label);
        }
        Object.assign(_c, {
          appicon,
          citybar,
          cityname,
          closeLabel,
          dock,
          dockIcons,
          icons,
          identity,
          local,
          lr,
          menu,
          search,
          skyline,
          stats,
          winbar,
          wincontrols,
          word,
        });
      },
    'frame.layout': (base, S) =>
      function (_c) {
        const { ctx } = _c;
        const W = window.innerWidth;
        const H = window.innerHeight;
        const roomy = W >= 1260;
        const tall = H >= 700;
        let display = ctx.display || 'header';
        if (display === 'panel' && !roomy) display = 'header';
        if (display === 'toast' && !tall) display = 'header';
        // reset() reuses the body: a previous toast must not shrink later episodes.
        document.body.classList.toggle('ref-has-note', display === 'toast');
        document.body.dataset.display = display;
        Object.assign(_c, { H, W, display, roomy, tall });
      },
    'frame.placement': (base, S) =>
      function (_c) {
        const { W, content, ctx, local, lr, rng, roomy, tall, word } = _c;
        const { K, endLabel } = S;
        // End control placement (none in finish mode).
        let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
        const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
        if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
        const sidebarRoll = roomy && rng.bool(0.35);
        const sidebar = true;
        const nav = W >= 1180 && rng.bool(0.5);
        const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
        let label = endLabel(rng, content);
        if (word) label = word(lr.pick(K.end));
        // A decoy that reads like an end control (another end word, never this episode's label).
        const { collide, cr } = S.frameCollide(_c, label);
        Object.assign(_c, { collide, cr, decoys, label, nav, placement, sidebar, sidebarRoll, wantFooter });
      },
    'frame.tools': (base, S) =>
      function (_c) {
        const { collide, decoyBtn, decoys, endBtn, header, label, menu, placement, util, wantFooter } = _c;
        let submit = null;
        const headerTools = util.el('div', 'ref-tools', header);
        if (placement === 'header' || placement === 'icon') menu.append(headerTools);
        for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
        if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
        if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
        if (placement === 'icon') {
          submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
        }
        Object.assign(_c, { headerTools, submit });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { content, local, rng, sidebar, util } = _c;
        const { K } = S;
        const body = util.el('div', 'ref-body', document.body);
        if (sidebar) {
          const side = util.el('aside', 'ref-side', body);
          const railItems = ['Map', 'Itinerary', 'Places', 'Search', 'Preferences'];
          local(rng.sample(content.NAV_ITEMS, rng.int(4, 7)), K.nav);
          for (const item of railItems) {
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
  };

  env.site({
    name: 'design-pan-map-route-02',
    template: 'site/base',
    design: { parts },
  });
})();
