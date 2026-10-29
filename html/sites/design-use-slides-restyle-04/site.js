// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';


  const TITLES = ['Sunrise Office Suite'];

  const SUITE_TABS = ['Home', 'Slides', 'Documents', 'Sheets', 'Mail', 'Calendar', 'People', 'Files', 'Settings'];

  const DECKS = ['Quarterly Review', 'Product Plan', 'Marketing Strategy', 'Team Update', 'Customer Feedback',
    'Sales Forecast', 'Website Redesign', 'Operations Plan', 'Board Meeting', 'Project Atlas'];

  const parts = {
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, tall, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebar = roomy && rng.bool(0.35);
      rng.bool(W >= 1180 ? 0.5 : 0);
      const nav = false;
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, placement, sidebar, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { content, display, local, lr, nav, rng, util, word } = _c;
      const { K } = S;
      const header = util.el('header', 'ref-task', document.body);
      const title = (display !== 'header' || nav) ? rng.pick(TITLES) : TITLES[0];
      const brand = util.el('div', 'ref-brand', header, word ? word(lr.pick(K.brand)) : title);
      brand.dataset.role = 'brand';
      if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        const navItems = local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
        for (const [i, item] of navItems.entries()) {
          const a = util.el('a', 'ref-navlink', n, SUITE_TABS[i] || item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      if (!nav) {
        const n = util.el('nav', 'ref-nav', header);
        SUITE_TABS.forEach((item) => {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        });
      }
      Object.assign(_c, { brand, header, title });
    },
    'frame.body': (base, S) => function (_c) {
      const { content, local, rng, sidebar, util } = _c;
      const { K } = S;
      const body = util.el('div', 'ref-body', document.body);
      if (sidebar) {
        const side = util.el('aside', 'ref-side', body);
        const sideItems = local(rng.sample(content.NAV_ITEMS, rng.int(4, 7)), K.nav);
        for (const [i, item] of sideItems.entries()) {
          const a = util.el('a', 'ref-sidelink', side, DECKS[i] || item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label: item }); });
        }
      }
      if (!sidebar) {
        const side = util.el('aside', 'ref-side', body);
        DECKS.forEach((item, i) => {
          const a = util.el('a', 'ref-sidelink', side, item);
          a.dataset.role = 'nav';
          if (i === 1) a.classList.add('ref-selected');
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label: item }); });
        });
      }
      // Design-specific help legend; the template still owns the live slide controls.
      const help = util.el('section', 'ref-help', document.querySelector('.ref-side'));
      util.el('h2', 'ref-help-title', help, 'Text formatting');
      util.el('p', 'ref-help-intro', help, 'Change the appearance of selected text using the controls in the formatting panel.');
      const helpRows = [
        ['B', 'Bold', 'Makes the selected text bold.'],
        ['I', 'Italic', 'Makes the selected text italic.'],
        ['A', 'Text colour', 'Sets the colour of the selected text.'],
        ['Tt', 'Font size', 'Choose a point size for the selected text.'],
      ];
      for (const [icon, title, detail] of helpRows) {
        const row = util.el('div', 'ref-help-row', help);
        util.el('span', 'ref-help-icon', row, icon);
        const copy = util.el('div', 'ref-help-copy', row);
        util.el('strong', '', copy, title);
        util.el('span', '', copy, detail);
      }
      util.el('h3', 'ref-help-subtitle', help, 'Common text colours');
      const swatches = util.el('div', 'ref-help-swatches', help);
      ['#111111','#55585b','#bfc2c4','#1684d8','#4caf58','#ffbd22','#ff8b25','#ff6955','#e9273c','#a34dd7'].forEach((color) => {
        const dot = util.el('span', 'ref-help-swatch', swatches);
        dot.style.background = color;
      });
      util.el('h3', 'ref-help-subtitle ref-help-tips-title', help, 'Tips');
      const tips = util.el('ul', 'ref-help-tips', help);
      ['Select a text box to show its formatting options.', 'You can change the text colour, size, and style independently.', 'Other elements on the slide will remain unchanged.'].forEach((tip, i) => {
        util.el('li', '', tips, `${i === 0 ? '💡 ' : ''}${tip}`);
      });
      Object.assign(_c, { body, help, helpRows, swatches, tips });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-use-slides-restyle-04',
    template: 'site/base',
    design: { TITLES, parts },
  });
})();
