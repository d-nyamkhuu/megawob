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
      if (roomy) rng.bool(0.35); // retain the sibling design's seeded draw
      const sidebar = true;
      const nav = W >= 1180 && rng.bool(0.5);
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, placement, sidebar, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { content, display, lr, nav, rng, util, word } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      const hadBrand = display !== 'header' || nav;
      if (hadBrand) rng.pick(TITLES);
      const brand = util.el('div', 'ref-brand', header, 'Aurora DevWorks');
      if (word && hadBrand) lr.pick(K.brand);
      brand.dataset.role = 'brand';
      {
        const n = util.el('nav', 'ref-nav', header);
        if (nav) rng.sample(content.NAV_ITEMS, rng.int(3, 5));
        for (const item of ['Code', 'Build', 'Observe', 'Data', 'Feature Flags']) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      Object.assign(_c, { brand, hadBrand, header });
    },
    'frame.body': (base, S) => function (_c) {
      const { content, rng, sidebar, util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      {
        const side = util.el('aside', 'ref-side', body);
        if (sidebar) rng.sample(content.NAV_ITEMS, rng.int(4, 7)); // preserve the sibling's seeded draw
        for (const [icon, item] of [['⌂','Home'],['▤','Code'],['⚙','Pipelines'],['▣','Logs'],['▤','Database'],['⚑','Feature Flags'],['◎','Environments'],['▰','Projects'],['🔧','Settings']]) {
          const a = util.el('a', `ref-sidelink${item === 'Pipelines' ? ' is-active' : ''}`, side);
          util.el('span', 'rail-icon', a, icon);
          util.el('span', '', a, item);
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label: item }); });
        }
      }
      const index = util.el('aside', 'run-index', body);
      util.el('div', 'run-index-title', index, 'Pipeline Runs');
      const project = util.el('div', 'run-project', index, 'atlas-web　 ▾');
      const filter = util.el('div', 'run-filter', index, '⌕　Filter runs...');
      const list = util.el('div', 'run-list', index);
      util.el('div', 'run-head', list, '#　　 Branch　　　　　　 Status　　 Started');
      const runRows = [
        ['5806','main','success','Apr 19 10:42'],['5805','feature/search','success','Apr 19 09:18'],['5804','main','success','Apr 18 16:03'],
        ['5803','bugfix/cache','success','Apr 18 13:21'],['5802','feature/ui-redesign','failed','Apr 18 10:11'],['5801','main','success','Apr 17 18:06'],
        ['5800','feature/analytics','success','Apr 17 14:33'],['5799','main','success','Apr 16 20:12'],['5798','chore/deps','success','Apr 16 11:09'],
        ['5797','feature/ui-redesign','failed','Apr 15 17:26'],['5796','main','success','Apr 15 12:03'],['5795','hotfix/session','success','Apr 14 18:47'],
        ['5794','main','success','Apr 14 10:15'],['5793','feature/metrics','success','Apr 13 16:02'],['5792','main','success','Apr 13 11:28']
      ];
      for (const row of runRows) {
        const line = util.el('div', `run-row${row[0] === '5802' ? ' selected' : ''}`, list);
        row.forEach((v, i) => util.el('span', i === 2 ? `run-${v}` : '', line, i === 2 ? `● ${v}` : v));
      }
      util.el('div', 'run-pagination', index, '1–15 of 42 runs　　　　　　　　 ◀　 ▶');
      Object.assign(_c, { body, filter, index, list, project, runRows });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-use-dev-tools-rerun-01',
    template: 'site/base',
    design: { parts },
  });
})();
