// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.lang': (base, S) =>
      function (_c) {
        const { ctx, rng } = _c;
        // Localized frame: same layout draws as English, texts from UI_WORDS (own stream).
        const word = ctx.lang && ctx.lang !== 'en' && ctx.word ? ctx.word : null;
        const lr = rng.fork('chrome/lang');
        const local = (list, keys) => (word ? lr.sample(keys, list.length).map(word) : list);
        const closeLabel = word ? word('close') : 'Close';

        // Single-purpose Help Center page: a compact title bar, hero, and topic band.
        document.body.classList.add('help-center-app');
        Object.assign(_c, { closeLabel, local, lr, word });
      },
    'frame.placement': (base, S) =>
      function (_c) {
        const { W, content, ctx, display, local, lr, rng, roomy, tall, word } = _c;
        const { K, TITLES, endLabel } = S;
        // End control placement (none in finish mode).
        let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
        const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
        if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
        const sidebar = roomy && rng.bool(0.35);
        const nav = W >= 1180 && rng.bool(0.5);
        const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
        let label = endLabel(rng, content);
        if (word) label = word(lr.pick(K.end));
        // A decoy that reads like an end control (another end word, never this episode's label).
        const { collide, cr } = S.frameCollide(_c, label);

        // Retain the inherited page's seeded draws for its brand and optional nav,
        // even though this single-purpose design does not render either element.
        if (display !== 'header' || nav) {
          rng.pick(TITLES);
          if (word) lr.pick(K.brand);
        }
        if (nav) local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
        Object.assign(_c, { collide, cr, decoys, label, nav, placement, sidebar, wantFooter });
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { util } = _c;
        const header = util.el('header', 'ref-task', document.body);
        header.classList.add('help-titlebar');
        const brand = util.el('div', 'ref-brand', header, 'Help Center');
        brand.dataset.role = 'brand';
        const search = util.el('div', 'help-search', header);
        util.el('span', 'help-search-icon', search, '⌕');
        util.el('span', 'help-search-text', search, 'Search help articles');
        Object.assign(_c, { brand, header, search });
      },
    'frame.tools': (base, S) =>
      function (_c) {
        const { collide, decoyBtn, decoys, endBtn, header, label, placement, util, wantFooter } = _c;
        let submit = null;
        const headerTools = util.el('div', 'ref-tools', header);
        for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
        if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
        if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
        if (placement === 'icon') {
          submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
        }
        const hero = util.el('section', 'help-hero', document.body);
        util.el('h1', '', hero, 'How can we help?');
        util.el('p', '', hero, 'Find answers, learn about features, and get the most out of our product.');
        const features = util.el('section', 'help-features', document.body);
        const featureData = [
          [
            '<path d="M3 5.5c3.5-1.7 6.5-.9 9 1.3v13c-2.5-2.2-5.5-3-9-1.3z"/><path d="M21 5.5c-3.5-1.7-6.5-.9-9 1.3v13c2.5-2.2 5.5-3 9-1.3z"/>',
            'Browse help articles',
            'Step-by-step guides and troubleshooting for common questions.',
            'blue',
          ],
          [
            '<circle cx="12" cy="8" r="3.2"/><circle cx="5" cy="10" r="2.4"/><circle cx="19" cy="10" r="2.4"/><path d="M6 20v-2.3c0-2.5 2.5-4.2 6-4.2s6 1.7 6 4.2V20zM1 19v-1.8c0-2 1.4-3.5 3.7-4M23 19v-1.8c0-2-1.4-3.5-3.7-4"/>',
            'Get product support',
            'Contact our support team for personalized help.',
            'green',
          ],
          [
            '<path d="M9 18h6M10 21h4M8.2 14.8A7 7 0 1 1 15.8 14.8c-.9.7-1.3 1.5-1.5 2.2h-4.6c-.2-.7-.6-1.5-1.5-2.2z"/>',
            'Tips and best practices',
            'Learn how to be more productive with our tools.',
            'purple',
          ],
        ];
        for (const [icon, title, desc, color] of featureData) {
          const item = util.el('div', 'help-feature', features);
          const badge = util.el('span', `help-feature-icon ${color}`, item);
          badge.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${icon}</svg>`;
          const copy = util.el('div', 'help-feature-copy', item);
          util.el('strong', '', copy, title);
          util.el('span', '', copy, desc);
        }
        Object.assign(_c, { featureData, features, headerTools, hero, submit });
      },
    'frame.nav': (base, S) => function (_c) {},
    'frame.toast': (base, S) =>
      function (_c) {
        base(_c);
        if (_c.display === 'toast') {
          const note = document.body.lastElementChild;
          _c.body.before(note);
        }
      },
    'frame.footer': (base, S) =>
      function (_c) {
        base(_c);
        if (_c.wantFooter) _c.body.before(document.body.lastElementChild);
      },
    'frame.floating': (base, S) =>
      function (_c) {
        base(_c);
        if (_c.placement === 'floating') _c.body.before(document.body.lastElementChild);
      },
    'frame.end': (base, S) =>
      function (_c) {
        const top = _c.stage.getBoundingClientRect().top;
        _c.stage.style.minHeight = Math.max(0, _c.H - top) + 'px';
        return base(_c);
      },
  };

  env.site({
    name: 'design-scroll-page-sticky-04',
    template: 'site/base',
    design: { parts },
  });
})();
