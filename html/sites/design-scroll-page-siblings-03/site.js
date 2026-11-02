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
      // This design uses the same jewel-tone frame in every seeded episode.
      for (const [k, v] of Object.entries({ bg: '#102747', panel: '#f5efd9', fg: '#211b14', muted: '#725a35', line: '#c9b98f' })) root.style.setProperty(`--${k}`, v);
      root.style.setProperty('--accent', '#b28a3b');
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
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, placement, sidebar, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { content, display, local, nav, rng, util } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      if (display !== 'header' || nav) {
        rng.pick(TITLES); // keep the seeded draw used by the source frame
        const brand = util.el('div', 'ref-brand', header, 'GreenEarth');
        brand.dataset.role = 'brand';
        util.el('div', 'ref-subbrand', header, 'Help Center');
      }
      if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        const sampledNav = local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
        const navItems = ['Home', 'Topics', 'Maps', 'Timelines', 'Biographies', 'Primary Sources', 'Reference', 'Multimedia'];
        for (const [i, item] of navItems.entries()) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      Object.assign(_c, { header });
    },
    'frame.body': (base, S) => function (_c) {
      const { content, ctx, display, local, lr, rng, util, word } = _c;
      const { K } = S;
      const body = util.el('div', 'ref-body', document.body);
      const sideItems = local(rng.sample(content.NAV_ITEMS, rng.int(4, 7)), K.nav); // preserve the seeded frame draw
      const side = util.el('aside', 'ref-side', body);
      util.el('h2', 'help-title', side, 'Using help articles');
      util.el('p', 'help-intro', side, 'Browse our collection of articles to learn about our work, get involved, and find answers to common questions.');
      const tips = [
        ['Read articles', 'Click any article to see the full content.', 'book'],
        ['Save for later', 'Click the Save button to keep an article in your saved list.', 'bookmark'],
        ['Share', 'Use the Share button to copy a link.', 'share'],
        ['Tips', 'You can scroll through the lists independently to find what you need.', 'bulb'],
      ];
      for (const [title, text, icon] of tips) {
        const item = util.el('div', `help-tip help-${icon}`, side);
        util.el('div', 'help-icon', item);
        const copy = util.el('div', 'help-copy', item);
        util.el('strong', '', copy, title);
        util.el('span', '', copy, text);
      }
      if (display === 'panel') {
        const panel = util.el('section', 'ref-panel', side);
        const heading = rng.pick(['Your task', 'Instructions', 'To do', 'Goal']);
        util.el('div', 'ref-panel-title', panel, word ? word(lr.pick(K.panel)) : heading);
        util.el('div', 'ref-panel-text', panel, ctx.instruction);
        if (rng.bool(0.5)) body.classList.add('ref-panel-right');
      }
      Object.assign(_c, { body, side, sideItems, tips });
    },
    'frame.nav': (base, S) => function (_c) {
    },
    'frame.panel': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-scroll-page-siblings-03',
    template: 'site/base',
    design: { parts },
  });
})();
