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
      if (roomy) rng.bool(0.35); // retain the sibling design's seeded draw
      const sidebar = true;
      const nav = W >= 1180 && rng.bool(0.5);
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      const windowBar = util.el('div', 'window-bar', document.body);
      util.el('span', 'window-title', windowBar, '');
      const windowControls = util.el('div', 'window-controls', windowBar);
      util.el('span', 'window-minimize', windowControls, '−');
      util.el('span', 'window-maximize', windowControls, '□');
      util.el('span', 'window-close', windowControls, '×');
      Object.assign(_c, { collide, cr, decoys, label, nav, placement, sidebar, wantFooter, windowBar, windowControls });
    },
    'frame.header': (base, S) => function (_c) {
      const { content, display, lr, nav, rng, util, word } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      if (display === 'header') header.classList.add('ref-task-with-note');
      const hadBrand = display !== 'header' || nav;
      if (hadBrand) rng.pick(TITLES);
      const brand = util.el('div', 'ref-brand', header, 'acme　/　webapp');
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
      const repo = util.el('button', 'repo-menu', header, '⌄');
      repo.type = 'button';
      repo.setAttribute('aria-label', 'Repository menu');
      const search = util.el('div', 'top-search', header);
      util.el('span', 'search-glass', search, '⌕');
      util.el('span', 'search-placeholder', search, 'Search or jump to...');
      util.el('span', 'search-shortcut', search, 'Ctrl+K');
      util.el('span', 'top-bell', header, '♧');
      util.el('span', 'top-avatar', header, '●');
      Object.assign(_c, { brand, hadBrand, header, repo, search });
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
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const help = util.el('aside', 'help-panel', body);
      util.el('h2', 'help-title', help, 'About pipeline runs');
      util.el('p', 'help-copy', help, 'A pipeline run executes a set of jobs defined for your repository. Select a job to view logs, re-run it, or get more details about its execution.');
      util.el('h3', 'help-subtitle', help, 'Job status');
      const statusRows = [
        ['✓', 'Success', 'Completed successfully.', 'success'],
        ['×', 'Failed', 'Completed with errors.', 'failed'],
        ['−', 'Skipped', 'Did not run.', 'skipped'],
        ['◉', 'In progress', 'Currently running.', 'progress'],
        ['◷', 'Queued', 'Waiting to start.', 'queued'],
      ];
      for (const [icon, title, copy, cls] of statusRows) {
        const row = util.el('div', `help-status ${cls}`, help);
        util.el('span', 'help-status-icon', row, icon);
        const description = util.el('div', 'help-status-description', row);
        util.el('strong', '', description, title);
        util.el('span', '', description, copy);
      }
      util.el('h3', 'help-subtitle help-retry-title', help, 'Retrying jobs');
      util.el('p', 'help-copy', help, 'You can re-run a failed job to try again with the same commit and configuration. Logs from previous attempts are retained for debugging.');
      util.el('a', 'help-link', help, 'Learn more about pipeline runs　→');
      Object.assign(_c, { help, stage, statusRows });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-use-dev-tools-rerun-04',
    template: 'site/base',
    design: { parts },
  });
})();
