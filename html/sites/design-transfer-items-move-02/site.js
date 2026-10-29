// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const TITLES = ['Countries'];

  const parts = {
    'frame.placement': (base, S) =>
      function (_c) {
        const { content, ctx, local, lr, rng, tall, word } = _c;
        const { K, endLabel } = S;
        // End control placement (none in finish mode).
        let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
        const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
        if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
        rng.bool(0.35);
        const sidebar = true;
        rng.bool(0.5);
        const nav = false;
        const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
        let label = endLabel(rng, content);
        if (word) label = word(lr.pick(K.end));
        // A decoy that reads like an end control (another end word, never this episode's label).
        const { collide, cr } = S.frameCollide(_c, label);
        Object.assign(_c, { collide, cr, decoys, label, nav, placement, sidebar, wantFooter });
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { display, lr, nav, rng, util, word } = _c;
        const { K } = S;
        const header = util.el('header', 'ref-task', document.body);
        const appTitle = util.el('div', 'wm-title', header, 'Team Manager');
        appTitle.dataset.role = 'brand';
        if (display !== 'header' || nav) {
          const title = rng.pick(TITLES);
          const brand = util.el('div', 'ref-brand', header, word ? word(lr.pick(K.brand)) : title);
          brand.dataset.role = 'brand';
        }
        Object.assign(_c, { appTitle, header });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { content, local, rng, sidebar, util } = _c;
        const { K } = S;
        const body = util.el('div', 'ref-body', document.body);
        const navBar = util.el('nav', 'wm-nav', document.body);
        const navIcons = [
          '<svg viewBox="0 0 36 36"><circle cx="11" cy="10" r="5" fill="#16b9c9" stroke="#07336d" stroke-width="2"/><circle cx="24" cy="10" r="5" fill="#ffd42a" stroke="#07336d" stroke-width="2"/><path d="M3 28v-7q0-7 8-7t8 7v7z" fill="#168e42" stroke="#07336d" stroke-width="2"/><path d="M17 28v-7q0-7 8-7t8 7v7z" fill="#e03535" stroke="#07336d" stroke-width="2"/></svg>',
          '<svg viewBox="0 0 36 36"><path d="M6 3h18l7 7v23H6z" fill="#f5f5ef" stroke="#102e68" stroke-width="2"/><path d="M24 3v8h7" fill="#7ea9d4" stroke="#102e68" stroke-width="2"/><path d="M11 16h15M11 21h15M11 26h15" stroke="#2858a0" stroke-width="2"/></svg>',
          '<svg viewBox="0 0 36 36"><ellipse cx="18" cy="8" rx="12" ry="5" fill="#8de0d3" stroke="#164b72" stroke-width="2"/><path d="M6 8v19q0 5 12 5t12-5V8" fill="#67bd9e" stroke="#164b72" stroke-width="2"/><path d="M6 15q0 5 12 5t12-5M6 23q0 5 12 5t12-5" fill="none" stroke="#164b72" stroke-width="2"/></svg>',
          '<svg viewBox="0 0 36 36"><path d="M4 31h29" stroke="#172b59" stroke-width="2"/><path d="M7 20h6v11H7z" fill="#32aa52" stroke="#18336c" stroke-width="2"/><path d="M16 12h6v19h-6z" fill="#f5c02b" stroke="#18336c" stroke-width="2"/><path d="M25 4h6v27h-6z" fill="#e53b43" stroke="#18336c" stroke-width="2"/></svg>',
          '<svg viewBox="0 0 36 36"><path d="M15 3h6l1 4 4 2 4-1 3 5-3 3v5l3 3-3 5-4-1-4 2-1 4h-6l-1-4-4-2-4 1-3-5 3-3v-5l-3-3 3-5 4 1 4-2z" fill="#94a9b8" stroke="#18375b" stroke-width="2"/><circle cx="18" cy="18" r="5" fill="#e8d49a" stroke="#18375b" stroke-width="2"/></svg>',
        ];
        for (const [i, label] of ['Teams', 'Projects', 'Resources', 'Reports', 'Administration'].entries()) {
          const item = util.el('div', 'wm-navitem', navBar);
          util.el('span', 'wm-navicon', item).innerHTML = navIcons[i];
          util.el('span', '', item, label);
        }
        if (sidebar) {
          const side = util.el('aside', 'ref-side', body);
          local(rng.sample(content.NAV_ITEMS, rng.int(4, 7)), K.nav);
          for (const item of ['Africa', 'Asia', 'Europe', 'North America', 'South America', 'Oceania', 'Middle East']) {
            const a = util.el('a', 'ref-sidelink', side, item);
            a.dataset.role = 'nav';
            a.addEventListener('click', (e) => {
              e.preventDefault();
              env.log('decoy', { what: 'sidebar', label: item });
            });
          }
        }
        Object.assign(_c, { body, navBar, navIcons });
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, util } = _c;
        const stage = util.el('main', 'ref-stage', body);
        S.frameAlign(_c, stage);
        const help = util.el('aside', 'wm-help', body);
        util.el('div', 'wm-help-title', help, 'Help');
        const helpText = util.el('div', 'wm-help-content', help);
        util.el(
          'div',
          'wm-info',
          helpText,
          'Use the lists to choose which departments are included in the selected teams.',
        );
        util.el('div', 'wm-howto', helpText, 'You can move items between lists in any of these ways:');
        util.el('div', 'wm-bullet', helpText, 'Select one or more items and click a button.');
        util.el('div', 'wm-bullet', helpText, 'Double-click an item.');
        util.el('div', 'wm-bullet', helpText, 'Drag an item (or the selection it belongs to) to the other list.');
        util.el('div', 'wm-tips-title', helpText, 'Tips');
        util.el('div', 'wm-bullet', helpText, 'Ctrl-click to select or clear individual items.');
        util.el('div', 'wm-bullet', helpText, 'Shift-click to select a range of items.');
        Object.assign(_c, { help, helpText, stage });
      },
  };

  env.site({
    name: 'design-transfer-items-move-02',
    template: 'site/base',
    design: { TITLES, parts },
  });
})();
