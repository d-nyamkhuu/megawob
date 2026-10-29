// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const icon = (name) => {
    const paths = {
      file: '<path d="M7 2h15l7 7v31H7zM22 2v8h7M12 16h12M12 21h12M12 26h12M12 31h12"/>',
      disk: '<path d="M3 4h30l5 5v31H3zM9 4v14h21V4M10 25h21v15H10zM24 7v8"/>',
      drive: '<path d="M2 23l7-12h27l5 12v12H2zM2 23h39M8 29h16M31 28h5M10 15h22"/>',
      trash: '<path d="M9 10h25l-3 30H12zM6 9h31M16 5h12v4M17 14v21M23 14v21M28 14l-1 21"/>',
      basket: '<path d="M3 17h36l-5 23H8zM8 17l7-12h13l7 12M7 23h29M14 19v17M22 19v17M29 19v17"/>',
      people: '<path d="M3 25v13h11V24M29 24v14h11V25M14 23v17h15V23M8 12a5 5 0 1 0 0 .1M34 12a5 5 0 1 0 0 .1M21 8a6 6 0 1 0 0 .1"/>',
      gear: '<path d="M16 3h10l1 6 5 3 6-2 4 9-5 4v6l4 4-5 8-6-2-5 3-1 5H14l-1-6-5-3-6 2-4-9 5-4v-6l-4-4 5-8 6 2 5-3z" transform="translate(4 -2) scale(.85)"/><circle cx="22" cy="22" r="8"/>'
    };
    return '<svg viewBox="0 0 44 44" fill="#dedede" stroke="#080808" stroke-width="2.4" stroke-linejoin="miter">' + (paths[name] || paths.file) + '</svg>';
  };

  const parts = {
    'frame.theme': (base, S) => function (_c) {
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
      for (const [k, v] of Object.entries(name === 'low' ? LOW_THEME : THEMES[name])) root.style.setProperty(`--${k}`, v);
      // This design uses the same jewel-tone frame in every seeded episode.
      for (const [k, v] of Object.entries({ bg: '#d2d2d2', panel: '#dedede', fg: '#080808', muted: '#343434', line: '#111111' })) root.style.setProperty(`--${k}`, v);
      root.style.setProperty('--accent', '#111111');
      root.dataset.theme = 'history';
      Object.assign(_c, { accent, content, name, rng, root, tr, util });
    },
    'frame.placement': (base, S) => function (_c) {
      const { content, ctx, local, lr, rng, roomy, tall, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebar = roomy && rng.bool(0.35);
      rng.bool(0.5); // preserve the reference frame draw while keeping this design's masthead complete
      const nav = true;
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      const endStream = ctx.rng.fork('gem/end-placement');
      const finalPlacement = ctx.finish ? null : endStream.pick(['footer', 'footer', 'header', 'icon']);
      if (!word && endStream.bool(0.5) && Array.isArray(content.END_LABELS) && content.END_LABELS.includes('Finish')) label = 'Finish';
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, placement: finalPlacement, sidebar, wantFooter: finalPlacement === 'footer' });
    },
    'frame.header': (base, S) => function (_c) {
      const { content, display, local, nav, rng, util } = _c;
      const { K, TITLES } = S;
      const menu = util.el('div', 'gem-menubar', document.body);
      const mark = util.el('span', 'gem-atari', menu);
      mark.innerHTML = '<svg viewBox="0 0 40 32" fill="none" stroke="#080808" stroke-width="3"><path d="M18 2v28M22 2v28M13 2v10c0 9-4 15-11 18M27 2v10c0 9 4 15 11 18"/></svg>';
      util.el('span', '', menu, 'Desk   File   Edit   View   Options   Help');
      util.el('span', 'gem-clock', menu, 'Mon Mar 3  10:24 AM   ▣  ▣');
      const desktop = util.el('div', 'gem-desktop', document.body);
      for (const [glyph, label] of [['disk', 'A:\\'], ['drive', 'B:\\'], ['trash', 'TRASH']]) {
        const item = util.el('div', 'gem-desktop-item', desktop);
        const art = util.el('span', '', item); art.innerHTML = icon(glyph);
        util.el('span', '', item, label);
      }
      const header = util.el('header', 'ref-task', document.body);
      const gadgets = util.el('div', 'gem-window-gadgets', header);
      gadgets.setAttribute('aria-hidden', 'true');
      for (const glyph of ['_', '□', '×']) util.el('span', '', gadgets, glyph);
      if (display !== 'header' || nav) {
        rng.pick(TITLES); // keep the seeded draw used by the source frame
        const brand = util.el('div', 'ref-brand', header, 'Knowledge Base');
        const art = util.el('span', 'gem-brand-icon', brand); art.innerHTML = icon('file'); brand.prepend(art);
        brand.dataset.role = 'brand';
      }
      if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        const sampledNav = local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
        const navItems = ['Help Articles', 'Downloads', 'Community', 'Settings'];
        for (const [i, item] of navItems.entries()) {
          const a = util.el('a', 'ref-navlink', n, item);
          const art = util.el('span', 'gem-tab-icon', a); art.innerHTML = icon(['file', 'basket', 'people', 'gear'][i]); a.prepend(art);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      Object.assign(_c, { header });
    },
    'frame.nav': (base, S) => function (_c) {
    },
    'frame.body': (base) => function (_c) {
      base(_c);
      for (const rail of _c.body.querySelectorAll('.ref-side')) rail.remove();
    },
  };

  env.site({
    name: 'design-scroll-page-siblings-05',
    template: 'site/base',
    design: { parts },
  });
})();
