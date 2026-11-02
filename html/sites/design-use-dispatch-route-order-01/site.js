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
      const sidebar = roomy && rng.bool(0.35);
      const nav = (W >= 1180 && rng.bool(0.5)) || true;
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, placement, sidebar, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { content, ctx, display, lr, nav, rng, util, word } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      const titlebar = util.el('div', 'ol-titlebar', header);
      const mark = util.el('span', 'ol-mark', titlebar, '▧');
      const titleText = util.el('span', 'ol-window-title', titlebar, 'Fleet Dispatch – Route Planner');
      const winControls = util.el('div', 'ol-window-controls', titlebar);
      for (const glyph of ['−', '□', '×']) util.el('span', 'ol-window-control', winControls, glyph);
      const menubar = util.el('div', 'ol-menubar', header);
      if (display !== 'header' || nav) {
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', menubar, word ? word(lr.pick(K.brand)) : title);
        brand.dataset.role = 'brand';
      }
      if (nav) {
        const n = util.el('nav', 'ref-nav', menubar);
        const navItems = rng.sample(content.NAV_ITEMS, rng.int(3, 5));
        for (const [i, item] of ['Dispatch', 'Route Planner', 'Vehicles', 'Jobs', 'Reports', 'Maintenance'].entries()) {
          const a = util.el('a', 'ref-navlink', n, item);
          const icons = [
            'M3 3h11v13H3zM15 8h4l4 5v3h-8zM16 10v3h5l-2-3zM3 17a3 3 0 1 0 6 0 3 3 0 0 0-6 0M16 17a3 3 0 1 0 6 0 3 3 0 0 0-6 0M0 13h3v3H0z',
            'M5 3h12v15H5zM8 6h12v15H8zM11 9h6v7h-6zM14 11v3m-1-1h2',
            'M3 3h11v13H3zM15 8h4l4 5v3h-8zM16 10v3h5l-2-3zM3 17a3 3 0 1 0 6 0 3 3 0 0 0-6 0M16 17a3 3 0 1 0 6 0 3 3 0 0 0-6 0M0 13h3v3H0z',
            'M5 2h10l5 5v15H5zM15 2v6h5M8 11h9m-9 4h9m-9 4h9',
            'M3 12h4v10H3zM10 3h4v19h-4zM17 7h4v15h-4z',
            'M21 3a6 6 0 0 1-7 8L5 21a2 2 0 0 1-3-3l10-9a6 6 0 0 1 8-7l-4 4 3 3z',
          ];
          const icon = util.svg('svg', { viewBox: '0 0 24 24', width: 28, height: 28, fill: 'none', stroke: 'currentColor', 'stroke-width': 1.8, 'aria-hidden': 'true' }, a);
          util.svg('path', { d: icons[i], ...([0, 2, 4, 5].includes(i) ? { fill: 'currentColor', 'fill-rule': 'evenodd', 'stroke-width': .5 } : {}) }, icon);
          a.prepend(icon);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      if (display === 'header') util.el('div', 'ref-instruction', menubar, ctx.instruction);
      else util.el('div', 'ref-spacer', menubar);
      Object.assign(_c, { header, mark, menubar, titleText, titlebar, winControls });
    },
    'frame.tools': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, label, menubar, placement, util, wantFooter } = _c;
      let submit = null;
      const headerTools = util.el('div', 'ref-tools', menubar);
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      Object.assign(_c, { headerTools, submit });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const jobs = util.el('aside', 'ol-jobs', body);
      const jobsHead = util.el('div', 'ol-jobs-head', jobs);
      util.el('strong', '', jobsHead, 'Jobs');
      const pin = util.svg('svg', { viewBox: '0 0 24 24', width: 24, height: 24, class: 'ol-pin', 'aria-hidden': 'true' }, jobsHead);
      util.svg('path', { d: 'M8 2h9v3h-2v7l3 3v2h-6v6h-2v-6H4v-2l4-3V5H6V2z', fill: 'currentColor' }, pin);
      const jobsTable = util.el('table', 'ol-jobs-table', jobs);
      const jobsHeader = util.el('tr', '', util.el('thead', '', jobsTable));
      for (const text of ['Job', 'Location', 'Load (kg)']) util.el('th', '', jobsHeader, text);
      const jobsBody = util.el('tbody', '', jobsTable);
      for (const [job, place, load] of [['J1', 'Maple Rd', '780'], ['J2', 'Oak Ln', '650'],
        ['J3', 'Pine St', '450'], ['J4', 'Elm St', '450'], ['J5', 'Harbor View', '620'], ['J6', 'Cedar Ave', '900']]) {
        const row = util.el('tr', '', jobsBody);
        util.el('td', '', row, job);
        util.el('td', '', row, place);
        util.el('td', '', row, load);
      }
      Object.assign(_c, { jobs, jobsBody, jobsHead, jobsHeader, jobsTable, pin, stage });
    },
    'frame.nav': (base, S) => function (_c) {
    },
    'frame.instruction': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-use-dispatch-route-order-01',
    template: 'site/base',
    design: { parts },
  });
})();
