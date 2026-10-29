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
      util.el('strong', 'dispatch-company', identity, 'Greenfield Logistics');
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
      const summary = util.el('div', 'dispatch-summary', body);
      const metric = (label, value, cls) => {
        const cell = util.el('div', `dispatch-metric ${cls || ''}`.trim(), summary);
        util.el('span', 'dispatch-metric-label', cell, label);
        util.el('strong', 'dispatch-metric-value', cell, value);
      };
      metric('Dispatch #', 'D-2025-0424-01', 'dispatch-ref');
      metric('Date', 'Thu, Apr 24, 2025', 'dispatch-day');
      metric('Jobs', '8 total');
      metric('Unassigned', '8', 'dispatch-unassigned');
      metric('Assigned', '0');
      metric('Total Weight', '1,920 kg', 'dispatch-weight');
      metric('Total Volume', '15.6 m³', 'dispatch-volume');
      Object.assign(_c, { metric, summary });
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
        for (const item of ['Dispatch', 'Jobs', 'Drivers', 'Vehicles', 'Reports', 'Settings', 'Help']) {
          util.el('span', item === 'Dispatch' ? 'active' : '', dockNav, item);
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
    name: 'design-use-dispatch-board-01',
    template: 'site/base',
    design: { THEMES, ACCENTS, parts },
  });
})();
