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
      const rail = util.el('div', 'irix-rail', body);
      {
        const side = util.el('aside', 'ref-side', rail);
        if (sidebar) rng.sample(content.NAV_ITEMS, rng.int(4, 7)); // preserve the sibling's seeded draw
        util.el('div', 'project-picker', side, '▣　atlas　　　　　　　　　⌄');
        for (const [icon, item] of [['▱','Source'],['▸','app'],['▸','services'],['▸','lib'],['▸','tests'],['▸','docs'],['⚙','Pipelines'],['▣','Environments'],['⚑','Feature Flags'],['◉','Observability'],['▤','Database'],['⬡','Settings']]) {
          const a = util.el('a', `ref-sidelink${item === 'Pipelines' ? ' is-active' : ''}`, side);
          util.el('span', 'rail-icon', a, icon);
          util.el('span', '', a, item);
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label: item }); });
        }
      }
      const index = util.el('aside', 'run-index', rail);
      util.el('div', 'run-index-title', index, 'Pipeline Runs');
      const project = util.el('div', 'run-project', index, 'atlas-web　 ▾');
      const filter = util.el('div', 'run-filter', index, '⌕　Filter runs...');
      const list = util.el('div', 'run-list', index);
      util.el('div', 'run-head', list, '#　　 Branch　　　　　　 Status　　 Started');
      const runRows = [
        ['5221','main','success','today 10:14'],['5220','main','success','today 08:27'],['5219','release','success','yesterday 17:06'],
        ['5218','main','failed','yesterday 14:32'],['5217','feature/ui','success','yesterday 11:09']
      ];
      for (const row of runRows) {
        const line = util.el('div', `run-row${row[0] === '5218' ? ' selected' : ''}`, list);
        row.forEach((v, i) => util.el('span', i === 2 ? `run-${v}` : '', line, i === 2 ? `● ${v}` : v));
      }
      util.el('div', 'run-pagination', index, 'Summary　 Total runs　　　　　142\n● Successful　　　　　126\n● Failed　　　　　　　 14\n● Running　　　　　　　 2\n● Canceled　　　　　　　0');
      Object.assign(_c, { body, rail, filter, index, list, project, runRows });
    },
    'frame.panel': (base, S) => function (_c) {
      const body = _c.body;
      _c.body = _c.rail;
      base(_c);
      _c.body = body;
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const frame = util.el('section', 'irix-window', body);
      const title = util.el('div', 'irix-window-title', frame, '◆  Pipeline');
      util.el('span', 'irix-window-controls', title, 'T　×');
      _c.body = frame;
      base(_c);
      _c.body = body;
    },
    'frame.end': (base, S) => function (_c) {
      const dock = _c.util.el('div', 'irix-dock', document.body);
      const foot = document.body.querySelector(':scope > .ref-foot');
      const floating = document.body.querySelector(':scope > .ref-float-dock');
      if (foot) dock.appendChild(foot);
      if (floating) dock.appendChild(floating);
      return base(_c);
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-use-dev-tools-rerun-02',
    template: 'site/base',
    design: { parts },
  });
})();
