// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.lang': (base, S) => function (_c) {
      const { ctx, rng, util } = _c;
      // Localized frame: same layout draws as English, texts from UI_WORDS (own stream).
      const word = ctx.lang && ctx.lang !== 'en' && ctx.word ? ctx.word : null;
      const lr = rng.fork('chrome/lang');
      const local = (list, keys) => (word ? lr.sample(keys, list.length).map(word) : list);
      const closeLabel = word ? word('close') : 'Close';

      // Fluent desktop window frame surrounding the long help page.
      document.body.classList.add('wellness-app');
      const win = util.el('div', 'wellness-windowbar', document.body);
      util.el('span', 'wellness-appmark', win, '✿');
      util.el('span', 'wellness-windowtitle', win, 'Wellness Hub');
      const winbuttons = util.el('div', 'wellness-winbuttons', win);
      for (const [label, glyph] of [['Minimize', '−'], ['Maximize', '□'], ['Close', '×']]) {
        const b = util.el('span', 'wellness-winbutton', winbuttons, glyph);
        b.setAttribute('aria-label', label);
      }
      const menubar = util.el('nav', 'wellness-menubar', document.body);
      for (const item of ['File', 'Edit', 'View', 'Go', 'Tools', 'Help']) util.el('span', '', menubar, item);
      const toolbar = util.el('div', 'wellness-toolbar', document.body);
      for (const [glyph, label] of [['←','Back'], ['→','Forward'], ['⌂','Home'], ['⟳','Refresh'], ['▣','Print'], ['Aᴀ','Text size']]) {
        const b = util.el('button', 'wellness-tool', toolbar);
        b.type = 'button'; b.setAttribute('aria-label', label); b.title = label;
        util.el('span', 'wellness-glyph', b, glyph); util.el('span', '', b, label);
      }
      Object.assign(_c, { closeLabel, local, lr, menubar, toolbar, win, winbuttons, word });
    },
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, tall, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebar = roomy && rng.bool(0.35);
      const showNav = W >= 1180 && rng.bool(0.5);
      const nav = W >= 1180;
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, placement, showNav, sidebar, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { content, display, local, nav, rng, showNav, util } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      header.classList.add('wellness-taskbar');
      if (display !== 'header' || nav) rng.pick(TITLES); // preserve the original brand draw
      const brand = util.el('div', 'ref-brand', header, 'Wellness Hub');
      brand.dataset.role = 'brand';
      if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        if (showNav) local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav); // retain original draws
        for (const item of ['Home', 'Topics', 'Contact']) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      // Keep the narrow sticky header to one row of frame so pane rows remain fully visible.
      const search = util.el('div', 'wellness-search', _c.W < 1100 ? _c.toolbar : header);
      util.el('span', 'wellness-search-icon', search, '⌕');
      util.el('span', 'wellness-search-placeholder', search, 'Search help articles…');
      Object.assign(_c, { brand, header, search });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const workspace = util.el('div', 'wellness-workspace', body);
      const page = util.el('div', 'wellness-page', workspace);
      const hero = util.el('section', 'wellness-hero', page);
      util.el('h1', '', hero, 'Health & Wellness');
      util.el('p', '', hero, 'Practical advice, trusted information, and tools to support a healthier, happier you.');
      const content = util.el('div', 'wellness-content', page);
      const topics = util.el('aside', 'wellness-topics', content);
      for (const item of ['⌂  Overview', '♧  Fitness', '♡  Nutrition', '◉  Mental Health', '☾  Sleep', '♧  Yoga & Stretching', '▥  Healthy Habits', '♡  Conditions', '▣  Programs', '⚙  Account & Settings']) {
        util.el('div', 'wellness-topic', topics, item);
      }
      const stage = util.el('main', 'ref-stage', content);
      S.frameAlign(_c, stage);
      const help = util.el('aside', 'wellness-help', workspace);
      util.el('h2', '', help, 'Help Center');
      util.el('p', 'wellness-help-subtitle', help, 'Tips and resources');
      const tip = util.el('div', 'wellness-tip', help);
      util.el('strong', '', tip, '◉  Tip');
      util.el('p', '', tip, 'Use the topics on the left to browse articles, or scroll to see popular topics and featured content.');
      for (const [heading, items] of [
        ['Common tasks', ['◯  Search for help articles', '▤  Browse by topic', '☆  Read featured content', 'ⓘ  Contact support']],
        ['Related resources', ['↗  Wellness Hub blog', '↗  Community forum', '↗  Video tutorials', '↗  Wellness Hub status']],
      ]) {
        const section = util.el('section', 'wellness-help-section', help);
        util.el('h3', '', section, heading);
        for (const item of items) util.el('div', 'wellness-help-link', section, item);
      }
      Object.assign(_c, { hero, stage });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-scroll-page-sticky-01',
    template: 'site/base',
    design: { parts },
  });
})();
