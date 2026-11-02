// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, tall, util, word } = _c;
      const { K, endLabel } = S;
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
      const titlebar = util.el('div', 'lc-titlebar', document.body);
      util.el('strong', 'lc-studio', titlebar, 'Studio');
      const topnav = util.el('nav', 'lc-topnav', titlebar);
      for (const item of ['Projects', 'Assets', 'People', 'Settings']) util.el('span', '', topnav, item);
      const search = util.el('div', 'lc-search', titlebar);
      util.el('span', 'lc-search-icon', search, '⌕');
      util.el('span', '', search, 'Search');
      util.el('span', 'lc-avatar', titlebar, 'JD');
      Object.assign(_c, { collide, cr, decoys, label, nav, placement, search, sidebar, titlebar, topnav, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { display, nav, util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const tabs = util.el('nav', 'lc-tabs', header);
      for (const [i, item] of ['Overview', 'Files', 'Layout', 'Activity'].entries()) {
        const tab = util.el('span', `lc-tab${i === 2 ? ' selected' : ''}`, tabs, item);
      }
      if (display !== 'header' || nav) {
        const brand = util.el('div', 'ref-brand', header, 'Campaigns');
        brand.dataset.role = 'brand';
      }
      Object.assign(_c, { header, tabs });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      {
        const side = util.el('aside', 'ref-side', body);
        const campaigns = [['Spring Launch','12'],['Brand Refresh','8'],['Product Shots','15'],['Website Redesign','10'],['Holiday Campaign','9'],['Outdoor Series','6'],['Social Media','14'],['Customer Stories','11'],['Fall Collection','8'],['Video Production','12']];
        for (const [i, [item, count]] of campaigns.entries()) {
          const row = util.el('a', `ref-sidelink${i === 0 ? ' active' : ''}`, side);
          row.dataset.role = 'nav';
          util.el('span', 'campaign-name', row, item);
          util.el('small', '', row, `${count} items`);
          row.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label: item }); });
        }
      }
      Object.assign(_c, { body });
    },
    'frame.panel': (base, S) => function (_c) {
      const { body, ctx, display, lr, rng, util, word } = _c;
      const { K } = S;
      if (display === 'panel') {
        const panel = util.el('aside', 'ref-panel', body);
        const heading = rng.pick(['Your task', 'Instructions', 'To do', 'Goal']);
        util.el('div', 'ref-panel-title', panel, word ? word(lr.pick(K.panel)) : heading);
        util.el('div', 'ref-panel-text', panel, ctx.instruction);
        if (rng.bool(0.5)) body.classList.add('ref-panel-right');
      }
      const stats = util.el('div', 'lc-stats', body);
      for (const [label, value] of [['Rows', '8'], ['Columns', '4'], ['Cards', '32'], ['Status', 'Ready']]) {
        const cell = util.el('div', 'lc-stat', stats);
        util.el('span', '', cell, label);
        util.el('strong', '', cell, value);
      }
      Object.assign(_c, { stats });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, rng, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      rng.pick(['center', 'center', 'flex-start', 'flex-end']);
      rng.pick(['center', 'center', 'flex-start', 'flex-end']);
      stage.style.justifyContent = 'center';
      stage.style.alignItems = 'center';
      Object.assign(_c, { stage });
    },
  };

  env.site({
    name: 'design-align-layout-columns-02',
    template: 'site/base',
    design: { parts },
  });
})();
