// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { content, display, local, nav, rng, util } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      if (display !== 'header' || nav) {
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, 'CloudForge');
        brand.innerHTML = 'Cloud<span>Forge</span>';
        brand.dataset.role = 'brand';
      } else {
        const brand = util.el('div', 'ref-brand', header, 'CloudForge');
        brand.innerHTML = 'Cloud<span>Forge</span>';
        brand.dataset.role = 'brand';
      }
      if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        for (const item of local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav)) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      } else {
        const n = util.el('nav', 'ref-nav', header);
        for (const item of ['Dashboard', 'Compute', 'Storage', 'Networking', 'Identity', 'Billing', 'Support']) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      Object.assign(_c, { header });
    },
    'frame.body': (base, S) => function (_c) {
      const { content, local, rng, sidebar, util } = _c;
      const { K } = S;
      const body = util.el('div', 'ref-body', document.body);
      if (sidebar) {
        const side = util.el('aside', 'ref-side', body);
        for (const item of local(rng.sample(content.NAV_ITEMS, rng.int(4, 7)), K.nav)) {
          const a = util.el('a', 'ref-sidelink', side, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label: item }); });
        }
      } else {
        util.el('aside', 'ref-side', body);
      }
      Object.assign(_c, { body });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);

      // The VM design's persistent wizard frame. These are presentation only;
      // the task-owned step controls and picker below remain the task surface.
      const steps = util.el('div', 'vm-stepbar', body);
      for (const [i, label] of ['Region', 'Image', 'Size', 'Disk', 'Network', 'Tags'].entries()) {
        const item = util.el('div', `vm-step${i === 0 ? ' is-current' : ''}`, steps);
        util.el('span', 'vm-step-number', item, String(i + 1));
        util.el('span', 'vm-step-label', item, label);
      }
      const summary = util.el('section', 'vm-summary', body);
      util.el('span', 'vm-summary-cube', summary);
      const details = util.el('div', 'vm-summary-details', summary);
      util.el('strong', '', details, 'vm-0387');
      util.el('div', 'vm-summary-subtitle', details, 'Virtual machine  ·  Development');
      util.el('div', 'vm-summary-values', details,
        'Region: —   |   Image: —   |   Size: —   |   Disk: —   |   Network: —   |   Environment: —');
      const cost = util.el('div', 'vm-summary-cost', summary);
      util.el('span', '', cost, 'Estimated monthly cost');
      util.el('strong', '', cost, '$0.00');
      const regionTitle = util.el('div', 'vm-region-title', body, 'Select region');
      regionTitle.setAttribute('aria-hidden', 'true');

      // Persistent virtual-machine index alongside the single-purpose creation pane.
      const index = util.el('aside', 'vm-index', body);
      const indexHead = util.el('div', 'vm-index-head', index);
      util.el('strong', '', indexHead, 'Virtual Machines');
      const search = util.el('div', 'vm-search', indexHead);
      util.el('span', '', search, '⌕');
      util.el('span', '', search, 'Search virtual machines...');
      const table = util.el('div', 'vm-table', index);
      const cols = util.el('div', 'vm-row vm-cols', table);
      for (const label of ['Name', 'Status', 'Region', 'Image', 'Size']) util.el('span', '', cols, label);
      const machines = [
        ['web-01', 'Running', 'North Ridge', 'Lumen Server 11', 'c2.small'],
        ['web-02', 'Running', 'North Ridge', 'Lumen Server 11', 'c2.small'],
        ['app-01', 'Running', 'East Vale', 'Lumen Server 11', 'c2.medium'],
        ['db-01', 'Running', 'East Vale', 'Lumen Server 11', 'c2.large'],
        ['cache-01', 'Stopped', 'West Hollow', 'Lumen Server 10', 'c2.small'],
        ['worker-01', 'Running', 'South Reach', 'Lumen Server 11', 'c2.medium'],
        ['worker-02', 'Running', 'South Reach', 'Lumen Server 11', 'c2.medium'],
        ['tools-01', 'Stopped', 'North Ridge', 'Lumen Server 10', 'c2.small'],
        ['monitor-01', 'Running', 'West Hollow', 'Lumen Server 11', 'c2.small'],
        ['ci-01', 'Running', 'East Vale', 'Lumen Server 11', 'c2.medium'],
        ['ci-02', 'Stopped', 'East Vale', 'Lumen Server 11', 'c2.small'],
        ['batch-01', 'Running', 'South Reach', 'Lumen Server 11', 'c2.large'],
      ];
      for (const row of machines) {
        const line = util.el('div', 'vm-row', table);
        const name = util.el('span', 'vm-name', line);
        util.el('i', 'vm-row-cube', name);
        util.el('span', '', name, row[0]);
        const status = util.el('span', `vm-status ${row[1] === 'Running' ? 'is-running' : 'is-stopped'}`, line);
        util.el('i', '', status);
        status.append(document.createTextNode(row[1]));
        for (const value of row.slice(2)) util.el('span', '', line, value);
      }
      Object.assign(_c, { cols, cost, details, index, indexHead, machines, regionTitle, search, stage, steps, summary, table });
    },
    'frame.floating': (base, S) => function (_c) {
      const { endBtn, label, placement, util } = _c;
      let { submit } = _c;
      if (placement === 'floating') {
        // Reserve the control's space so it cannot intercept task clicks or drags.
        // On scrollable pages the dock follows the content, just like a form footer.
        const dock = util.el('div', 'ref-float-dock', document.body);
        submit = endBtn(dock, 'ref-submit ref-float', label);
      }
      Object.assign(_c, { submit });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-use-admin-console-vm-02',
    template: 'site/base',
    design: { parts },
  });
})();
