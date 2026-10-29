// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

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
      root.style.setProperty('--accent', accent);
      // This design uses the same fixed notebook palette in every seeded episode.
      for (const [k, v] of Object.entries({ bg:'#e8f3ef', panel:'#eff7f3', fg:'#17352d', muted:'#557068', line:'#b8d0c8', accent:'#176452' })) root.style.setProperty(`--${k}`, v);
      root.dataset.theme = name;
      Object.assign(_c, { accent, content, name, rng, root, tr, util });
    },
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, tall, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      if (placement === 'floating') placement = 'footer';
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebarDraw = roomy && rng.bool(0.35);
      const navDraw = W >= 1180 && rng.bool(0.5);
      const sidebar = roomy || sidebarDraw;
      const nav = W >= 1180 || navDraw;
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, navDraw, placement, sidebar, sidebarDraw, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { content, display, local, lr, nav, rng, util, word } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      if (display !== 'header' || nav) {
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, word ? word(lr.pick(K.brand)) : title);
        if (!word) brand.textContent = 'TerraGo';
        brand.dataset.role = 'brand';
      }
      if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        for (const item of (word ? local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav) : ['Overview', 'Data', 'Filters', 'Reports', 'Automation'])) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      Object.assign(_c, { header });
    },
    'frame.floating': (base, S) => function (_c) {
      const { endBtn, header, label, placement, util } = _c;
      let { submit } = _c;
      if (placement === 'floating') {
        // Reserve the control's space so it cannot intercept task clicks or drags.
        // On scrollable pages the dock follows the content, just like a form footer.
        const dock = util.el('div', 'ref-float-dock', document.body);
        submit = endBtn(dock, 'ref-submit ref-float', label);
      }
      // SignalHub's content band: a compact library overview above the embedded task cards.
      const hero = util.el('section', 'sh-hero', document.body);
      const art = util.el('div', 'sh-hero-art', hero);
      art.setAttribute('aria-hidden', 'true');
      const overview = util.el('div', 'sh-hero-main', hero);
      util.el('h1', 'sh-title', overview, 'Audio Library');
      util.el('p', 'sh-subtitle', overview, 'Explore and filter a growing collection of high-quality audio for your projects.');
      const stats = util.el('div', 'sh-stats', overview);
      for (const [n, labelText] of [['12,482', 'Tracks'], ['248', 'Creators'], ['36', 'Playlists']]) {
        const item = util.el('div', 'sh-stat', stats);
        util.el('strong', '', item, n);
        util.el('span', '', item, labelText);
      }
      const status = util.el('aside', 'sh-status', hero);
      util.el('strong', '', status, 'Library Status');
      for (const [icon, n, labelText] of [['♫', '12,482', 'Audio tracks'], ['♙', '248', 'Contributors'], ['▤', '36', 'Playlists']]) {
        const item = util.el('div', 'sh-status-row', status);
        util.el('span', 'sh-status-icon', item, icon);
        const words = util.el('span', '', item);
        util.el('b', '', words, n);
        util.el('small', '', words, labelText);
      }
      const headerNote = header.querySelector('.ref-instruction');
      if (headerNote) { headerNote.classList.add('sh-header-note'); overview.prepend(headerNote); }
      const brand = header.querySelector('.ref-brand');
      if (brand) brand.textContent = 'SignalHub';
      const navLinks = header.querySelectorAll('.ref-navlink');
      ['Overview', 'Data', 'Filters', 'Reports', 'Automation'].forEach((labelText, i) => {
        if (navLinks[i]) navLinks[i].textContent = labelText;
      });
      header.after(hero);
      const sideNav = util.el('aside', 'sh-side-nav', document.body);
      for (const [icon, labelText] of [['▱', 'Projects'], ['▥', 'Library'], ['◉', 'Collections'], ['♧', 'Shared'], ['⚙', 'Settings']]) {
        const link = util.el('div', 'sh-side-link', sideNav);
        util.el('span', 'sh-side-icon', link, icon);
        util.el('span', '', link, labelText);
      }
      sideNav.firstElementChild.classList.add('active');
      Object.assign(_c, { art, brand, headerNote, hero, navLinks, overview, sideNav, stats, status, submit });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-complete-goals-filters-04',
    template: 'site/base',
    design: { parts },
  });
})();
