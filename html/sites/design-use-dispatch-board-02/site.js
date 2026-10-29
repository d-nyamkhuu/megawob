// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';


  const THEMES = {
    light: { bg: '#f7f5ef', panel: '#fbfaf6', fg: '#29271f', muted: '#746d5e', line: '#d9cfbb' },
    dark: { bg: '#f7f5ef', panel: '#fbfaf6', fg: '#29271f', muted: '#746d5e', line: '#d9cfbb' },
    warm: { bg: '#f7f5ef', panel: '#fbfaf6', fg: '#29271f', muted: '#746d5e', line: '#d9cfbb' },
  };

  const ACCENTS = ['#a67d35', '#8d7347', '#9b875f', '#7e7653', '#a8874d', '#8c7b56'];

  const parts = {
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = true;
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebar = roomy && rng.bool(0.35);
      const nav = W >= 1180 && rng.bool(0.5);
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, placement, sidebar, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const identity = util.el('div', 'dispatch-identity', header);
      util.el('span', 'dispatch-mark', identity, '❧');
      util.el('strong', 'dispatch-company', identity, 'FLEETOPS');
      util.el('span', 'dispatch-title', identity, 'Dispatch Plan');
      util.el('span', 'dispatch-date', identity, 'Thu, Apr 24, 2025');
      const search = util.el('div', 'dispatch-search', header);
      util.el('span', '', search, '⌕');
      util.el('span', 'dispatch-search-label', search, 'Search jobs, drivers, addresses…');
      util.el('span', 'dispatch-bell', header, '♧');
      util.el('span', 'dispatch-profile', header, 'LM  ⌄');
      S.frameBrand(_c, header);
      Object.assign(_c, { header, identity, search });
    },
    'frame.nav': (base, S) => function (_c) {
      const { content, header, local, nav, rng, util } = _c;
      const { K } = S;
      if (true) {
        const n = util.el('nav', 'ref-nav', header);
        // Preserve the original optional navigation draw while giving this design its fixed app sections.
        if (nav) local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
        for (const item of ['Dispatch', 'Deliveries', 'Drivers', 'Vehicles', 'Reports']) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
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

      // FleetOps dispatch summary band, between the global navigation and the work area.
      const summary = util.el('section', 'dispatch-summary', document.body);
      const plan = util.el('div', 'dispatch-plan', summary);
      util.el('div', 'dispatch-kicker', plan, 'DISPATCH PLAN');
      util.el('strong', 'dispatch-ref', plan, 'D-2019-0408-01');
      const planRows = util.el('div', 'dispatch-plan-rows', plan);
      for (const [k, v] of [['Date', 'Mon Apr 8, 2019'], ['Depot', 'Riverside DC'], ['Service Area', 'Central City'], ['Planning Window', '08:00 – 18:00']]) {
        const row = util.el('div', 'dispatch-plan-row', planRows);
        util.el('b', '', row, k);
        util.el('span', '', row, v);
      }
      const summaryTiles = util.el('div', 'dispatch-summary-tiles', summary);
      for (const [value, label, icon, active] of [['8', 'Total Jobs', '⬡', ''], ['0', 'Assigned', '🚚', ''], ['8', 'Unassigned', '⬡', 'active'], ['3', 'Drivers', '♟', '']]) {
        const tile = util.el('div', `dispatch-summary-tile ${active}`.trim(), summaryTiles);
        util.el('strong', '', tile, value);
        util.el('span', '', tile, label);
        util.el('b', 'dispatch-tile-icon', tile, icon);
      }
      const summaryDetails = util.el('div', 'dispatch-summary-details', summary);
      util.el('strong', '', summaryDetails, 'Dispatch Details');
      for (const [k, v] of [['Reference', 'D-2019-0408-01'], ['Date', 'Mon Apr 8, 2019'], ['Depot', 'Riverside DC'], ['Service Area', 'Central City'], ['Planning Window', '08:00 – 18:00']]) {
        const row = util.el('div', 'dispatch-detail-row', summaryDetails);
        util.el('b', '', row, k);
        util.el('span', '', row, v);
      }
      Object.assign(_c, { headerTools, plan, planRows, submit, summary, summaryDetails, summaryTiles });
    },
    'frame.footer': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, label, lr, placement, rng, util, wantFooter, word } = _c;
      let { submit } = _c;
      if (wantFooter) {
        const foot = util.el('footer', 'ref-foot', document.body);
        const footText = rng.pick(['© 2024 Example Co.', 'All changes are saved automatically.',
          'Need help? Contact your administrator.', 'v4.2.1 · Status: all systems normal']);
        util.el('span', 'ref-foot-text', foot, word ? lr.pick([`© 2024 Example Co. ${word('footRights')}`,
          word('footSaved'), word('footHelp'), `v4.2.1 · ${word('footStatus')}`]) : footText);
        const dockNav = util.el('nav', 'dispatch-dock-nav', foot);
        for (const [value, label, icon, active] of [['8', 'Total Jobs', '⬡', ''], ['0', 'Assigned', '⬡', ''], ['8', 'Unassigned', '⬡', 'active'], ['0 kg', 'Total Load', '♟', ''], ['0 / 140', 'Total Boxes', '▧', ''], ['0%', 'Capacity Used', '◷', '']]) {
          const metric = util.el('div', `dispatch-foot-metric ${active}`.trim(), dockNav);
          util.el('b', 'dispatch-foot-icon', metric, icon);
          const copy = util.el('span', 'dispatch-foot-copy', metric);
          util.el('strong', '', copy, value);
          util.el('span', '', copy, label);
        }
        const tools = util.el('div', 'ref-tools', foot);
        if (decoys.length > 1) decoyBtn(tools, decoys[1]);
        if (collide && collide.where === 'footer') decoyBtn(tools, collide.text, true);
        if (placement === 'footer') submit = endBtn(tools, 'ref-submit', label);
        if (placement === 'link') submit = endBtn(tools, 'ref-endlink', `${label} ›`);
      }
      Object.assign(_c, { submit });
    },
  };

  env.site({
    name: 'design-use-dispatch-board-02',
    template: 'site/base',
    design: { THEMES, ACCENTS, parts },
  });
})();
