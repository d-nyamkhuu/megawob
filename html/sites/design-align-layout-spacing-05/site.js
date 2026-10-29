// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, tall, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebar = roomy ? (rng.bool(0.35), true) : false;
      const nav = W >= 1180 ? (rng.bool(0.5), true) : false;
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, placement, sidebar, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { content, local, lr, nav, rng, util, word } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      {
        rng.pick(TITLES);
        if (nav) { local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav); }
        const brand = util.el('div', 'ref-brand', header);
        brand.dataset.role = 'brand';
        util.el('div', 'ref-title', brand, 'Marketing Campaign');
        util.el('div', 'ref-subtitle', brand, 'Spring Sale 2013');
        const meta = util.el('div', 'ref-meta', header);
        [['Campaign Dates', 'Mar 1, 2013 – Mar 31, 2013'], ['Status', 'Draft'], ['Owner', 'Jennifer Lee']].forEach(([k, v]) => {
          const r = util.el('div', 'ref-meta-row', meta);
          util.el('span', 'ref-meta-k', r, k);
          util.el('span', 'ref-meta-v', r, v);
        });
      }
      Object.assign(_c, { header });
    },
    'frame.nav': (base, S) => function (_c) {
      const { util } = _c;
      const n = util.el('nav', 'ref-dock', document.body);
      const ICON = {
        Home: '<path d="M1 11 12 1l11 10-2 2-9-8-9 8zM5 12l7-6 7 6v10h-5v-7h-4v7H5z"/><path d="M17 3h3v6l-3-3z"/><path d="M3 12l9-8 9 8M6 22v-9" fill="none" stroke="#fff" stroke-opacity=".5"/>',
        Campaigns: '<path d="M3 9h5v12H3zM10 1h5v20h-5zM17 20h6v1h-6zM1 22h22v1H1z"/><path d="M4 10v10M11 2v18" stroke="#fff" stroke-opacity=".7"/>',
        Audience: '<circle cx="9" cy="8" r="3.5"/><path d="M2 20c0-5 3-7 7-7s7 2 7 7z"/><circle cx="17" cy="8" r="2.8"/><path d="M17 13c3 0 5 2 5 6h-4"/>',
        Reports: '<path d="M1 21v-7h4v7zM7 21V9h4v12zM13 21V4h4v17zM19 21v-11h4v11zM0 22h24v1H0z"/><path d="M2 15v5M8 10v10M14 5v15M20 11v9" stroke="#fff" stroke-opacity=".65"/>',
        Settings: '<path d="M12 2l2 3 3-1 1 3 3 1-1 3 2 2-2 2 1 3-3 1-1 3-3-1-2 3-2-3-3 1-1-3-3-1 1-3-2-2 2-2-1-3 3-1 1-3 3 1zM12 8a4 4 0 100 8 4 4 0 000-8z" fill-rule="evenodd"/>',
      };
      for (const item of ['Home', 'Campaigns', 'Audience', 'Reports', 'Settings']) {
        const a = util.el('a', item === 'Campaigns' ? 'ref-dock-item on' : 'ref-dock-item', n);
        a.dataset.role = 'nav';
        a.innerHTML = `<svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor">${ICON[item]}</svg><span>${item}</span>`;
        a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
      }
    },
    'frame.stage': (base, S) => function (_c) {
      base(_c);
      const { body, util } = _c;
      const help = util.el('div', 'ref-help', body);
      const tips = util.el('aside', 'ref-tips', help);
      const taskPanel = body.querySelector('.ref-panel');
      if (taskPanel) help.appendChild(taskPanel);
      util.el('div', 'ref-tips-h', tips, 'Tips');
      [['<path d="M12 1 8 5h3v6H5V8l-4 4 4 4v-3h6v6H8l4 4 4-4h-3v-6h6v3l4-4-4-4v3h-6V5h3z"/>', 'Drag a card by its body to move it.'],
        ['<path d="M14 3h8v8l-3-3-5 5-3-3 5-5zM2 14l3 3 5-5 3 3-5 5 3 3H2z"/>', 'Drag a corner handle to resize a card.'],
        ['<path d="M9 0h2v24H9z" fill="#c4cbd3"/><path d="M12 0h2v24h-2zM1 12l5-5v4h3v2H6v4zM23 12l-5-5v4h-3v2h3v4z"/>', 'Drag a column divider to adjust table column widths elsewhere in the page.']].forEach(([d, t]) => {
        const r = util.el('div', 'ref-tip', tips);
        const i = util.el('span', 'ref-tip-i', r);
        i.innerHTML = `<svg viewBox="0 0 24 24" width="34" height="34" fill="#364252">${d}</svg>`;
        util.el('span', 'ref-tip-t', r, t);
      });
    },
  };

  env.site({
    name: 'design-align-layout-spacing-05',
    template: 'site/base',
    design: { parts },
  });
})();
