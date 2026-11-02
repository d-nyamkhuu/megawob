// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';


  const TITLES = ['DevForge'];

  const parts = {
    'frame.lang': (base, S) => function (_c) {
      const { ctx, rng } = _c;
      // Localized frame: same layout draws as English, texts from UI_WORDS (own stream).
      const word = ctx.lang && ctx.lang !== 'en' && ctx.word ? ctx.word : null;
      const lr = rng.fork('chrome/lang');
      const local = (list, keys) => (word ? lr.sample(keys, list.length).map(word) : list);
      const closeLabel = word ? word('close') : 'Close';
      const inkIcon = (parent, name) => {
        const paths = {
          branch:['M6 5v13a3 3 0 0 0 3 3h1','M6 12h8a4 4 0 0 0 4-4V5','M3 3h6v5H3z','M15 2h6v5h-6z','M3 17h6v5H3z'],
          review:['M9 3a9 9 0 0 0 0 18','M15 3a9 9 0 0 1 0 18','m9 2-3 4 3 3','m15 15 3 4-3 3','M12 4v16'],
          pipeline:['M12 6v5','M12 11 5 18','M12 11l7 7','M9 2h6v6H9z','M2 17h6v5H2z','M16 17h6v5h-6z'],
          box:['m3 6 9-4 9 4v12l-9 4-9-4z','m3 6 9 5 9-5','M12 11v11'],
          logs:['M8 4h14','M8 12h14','M8 20h14','M2 4h2','M2 12h2','M2 20h2'],
          database:['M3 6c0-5 18-5 18 0s-18 5-18 0','M3 6v12c0 5 18 5 18 0V6','M3 10c0 5 18 5 18 0','M3 14c0 5 18 5 18 0'],
          flag:['M4 22V3','M4 4c6-5 10 4 17-1v12c-7 5-11-4-17 1'],
          grid:['M3 3h18v18H3z','M9 3v18','M15 3v18','M3 9h18','M3 15h18'],
          observe:['M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0','M12 7v10','M7 12h10'],
          activity:['m7 7-4 5 4 5','m17 7 4 5-4 5','m14 5-4 14'],
          team:['M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8','M2 22v-4c0-5 12-5 12 0v4z','M16 4c6 0 6 8 0 8','M17 15c4 0 5 2 5 7'],
          settings:['M8 2h8l1 4 4 2v8l-4 2-1 4H8l-1-4-4-2V8l4-2z','M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0'],
          search:['M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0','m15 15 7 7']
        };
        const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
        svg.setAttribute('viewBox','0 0 24 24'); svg.setAttribute('fill','none'); svg.setAttribute('stroke','currentColor'); svg.setAttribute('stroke-width','2'); svg.setAttribute('stroke-linejoin','round'); svg.setAttribute('stroke-linecap','round'); svg.setAttribute('aria-hidden','true');
        (paths[name]||paths.box).forEach(d=>{const path=document.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d',d);svg.append(path);});
        parent.append(svg);
      };
      Object.assign(_c, { closeLabel, inkIcon, local, lr, word });
    },
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
      const { content, display, inkIcon, lr, nav, rng, util, word } = _c;
      const { K } = S;
      const header = util.el('header', 'ref-task', document.body);
      const hadBrand = display !== 'header' || nav;
      if (hadBrand) rng.pick(TITLES);
      const brand = util.el('div', 'ref-brand', header, 'DevForge');
      if (word && hadBrand) lr.pick(K.brand);
      brand.dataset.role = 'brand';
      {
        const n = util.el('nav', 'ref-nav', header);
        if (nav) rng.sample(content.NAV_ITEMS, rng.int(3, 5));
        for (const [i,item] of ['Branches', 'Pull Requests', 'Pipelines', 'Environments', 'Logs', 'Database', 'Feature Flags'].entries()) {
          const a = util.el('a', 'ref-navlink', n);
          inkIcon(a,['branch','review','pipeline','box','logs','database','flag'][i]);
          util.el('span','',a,item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
        const search=util.el('div','df-toolbar-search',n); inkIcon(search,'search');
        const field=util.el('input','',search); field.placeholder='Search...'; field.setAttribute('aria-label','Search workspace');
      }
      Object.assign(_c, { brand, hadBrand, header });
    },
    'frame.tools': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, header, label, placement, util, wantFooter } = _c;
      let submit = null;
      const headerTools = util.el('div', 'ref-tools', header);
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      const toolSpace=Array.from(headerTools.children).reduce((width,node)=>width+Math.max(38,node.textContent.length*8.5+34)+8,0);
      header.style.setProperty('--header-tools-space',`${toolSpace+24}px`);
      Object.assign(_c, { headerTools, submit, toolSpace });
    },
    'frame.body': (base, S) => function (_c) {
      const { content, inkIcon, rng, sidebar, util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      {
        const side = util.el('aside', 'ref-side', body);
        if (sidebar) rng.sample(content.NAV_ITEMS, rng.int(4, 7)); // preserve the sibling's seeded draw
        for (const [icon, item] of [['▦','Overview'],['◇','Repositories'],['♧','Pipelines'],['◇','Environments'],['⚑','Feature Flags'],['⊙','Observability'],['▤','Database'],['↻','Activity'],['♟','Team'],['⚙','Settings']]) {
          const a = util.el('a', `ref-sidelink${item === 'Pipelines' ? ' is-active' : ''}`, side);
          const mark=util.el('span', 'rail-icon', a);
          inkIcon(mark,{'Overview':'grid','Repositories':'box','Pipelines':'pipeline','Environments':'box','Feature Flags':'flag','Observability':'observe','Database':'database','Activity':'activity','Team':'team','Settings':'settings'}[item]);
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
    name: 'design-use-dev-tools-rerun-03',
    template: 'site/base',
    design: { TITLES, parts },
  });
})();
