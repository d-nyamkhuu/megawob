// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const title = util.el('div', 'gem-titlebar', header);
      util.el('span', 'gem-app-icon', title, '▤');
      const brand = util.el('div', 'ref-brand', title, 'Product Catalog');
      brand.dataset.role = 'brand';
      const win = util.el('div', 'gem-window-controls', title);
      util.el('span', '', win, '—'); util.el('span', '', win, '□'); util.el('span', '', win, '×');
      const menu = util.el('div', 'gem-menubar', header);
      for (const label of ['File','Edit','View','Tools','Help']) util.el('span', '', menu, label);
      const toolbar = util.el('div', 'gem-toolbar', header);
      const toolArt = [
        ['New', '<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M9 4h15l8 9v23H9z" fill="#f6f6f6" stroke="#111" stroke-width="3"/><path d="M24 4v9h8" fill="none" stroke="#111" stroke-width="3"/></svg>'],
        ['Open', '<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M4 12h11l4-4h17v24H4z" fill="#f6f6f6" stroke="#111" stroke-width="3"/><path d="M4 18h9l4-4h18l-3 21H4z" fill="#e8e8e8" stroke="#111" stroke-width="3"/></svg>'],
        ['Print', '<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M11 3h19v10H11zM7 15h27l2 16h-5v6H10v-6H5z" fill="#ededed" stroke="#111" stroke-width="3"/><path d="M12 26h18v10H12z" fill="#fff" stroke="#111" stroke-width="2"/><path d="M15 30h12M15 33h10" stroke="#111" stroke-width="2"/></svg>'],
        ['Catalog', '<svg viewBox="0 0 40 40" aria-hidden="true"><rect x="5" y="4" width="30" height="32" fill="#f5f5f5" stroke="#111" stroke-width="3"/><path d="M5 12h30M15 12v24M25 12v24M5 23h30" stroke="#111" stroke-width="2"/><rect x="8" y="15" width="4" height="4" fill="#111"/><rect x="18" y="15" width="4" height="4" fill="#111"/><rect x="28" y="15" width="4" height="4" fill="#111"/></svg>'],
        ['Help', '<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M9 12Q10 3 20 3Q32 3 32 13Q32 19 24 23Q20 25 20 29" fill="none" stroke="#111" stroke-width="5"/><rect x="17" y="33" width="6" height="6" fill="#111"/></svg>'],
      ];
      for (const [label, icon] of toolArt) {
        const item = util.el('span', 'gem-tool', toolbar); item.innerHTML = icon; item.title = label;
      }
      const tabs = util.el('div', 'gem-tabs', header);
      for (const [i,label] of ['Products','Categories','Saved Items','Notes'].entries()) {
        const t = util.el('span', `gem-tab${i === 0 ? ' active' : ''}`, tabs, label);
      }
      Object.assign(_c, { brand, header });
    },
    'frame.footer': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, label, placement, rng, util, wantFooter } = _c;
      let { submit } = _c;
      rng.pick(['© 2024 Example Co.', 'All changes are saved automatically.',
        'Need help? Contact your administrator.', 'v4.2.1 · Status: all systems normal']);
      {
        const foot = util.el('footer', 'ref-foot gem-footer', document.body);
        const tools = util.el('div', 'ref-tools', foot);
        if (wantFooter) {
          if (decoys.length > 1) decoyBtn(tools, decoys[1]);
          if (collide && collide.where === 'footer') decoyBtn(tools, collide.text, true);
          if (placement === 'footer') submit = endBtn(tools, 'ref-submit', label);
          if (placement === 'link') submit = endBtn(tools, 'ref-endlink', `${label} ›`);
        }
      }
      Object.assign(_c, { submit });
    },
  };

  env.site({
    name: 'design-recall-info-compare-05',
    template: 'site/base',
    design: { parts },
  });
})();
