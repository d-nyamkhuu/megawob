// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.placement': (base, S) => function (_c) {
      const { content, ctx, local, lr, rng, tall, util, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      // Keep the reference design single-purpose, while consuming the same seeded draws.
      rng.bool(0.35);
      const sidebar = false;
      rng.bool(0.5);
      const nav = false;
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      const windowBar = util.el('div', 'legacy-windowbar', document.body);
      util.el('span', 'legacy-app-icon', windowBar, '▣');
      util.el('span', 'legacy-window-title', windowBar, 'Financial Operations - Banner System');
      const winControls = util.el('div', 'legacy-window-controls', windowBar);
      for (const mark of ['−', '□', '×']) util.el('span', 'legacy-window-control', winControls, mark);
      const menuBar = util.el('nav', 'legacy-menubar', document.body);
      for (const item of ['File', 'Edit', 'View', 'Go', 'Favorites', 'Tools', 'Window', 'Help']) util.el('span', '', menuBar, item);
      Object.assign(_c, { collide, cr, decoys, label, menuBar, nav, placement, sidebar, wantFooter, winControls, windowBar });
    },
    'frame.instruction': (base, S) => function (_c) {
      const { ctx, display, header, util } = _c;
      if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
      else util.el('div', 'ref-spacer', header);
      const appTools = util.el('div', 'legacy-toolstrip', header);
      for (const [icon, label] of [['◀', 'Back'], ['▶', 'Forward'], ['⌂', 'Home'], ['▣', 'Connect'], ['↯', 'Disconnect'], ['▤', 'Print'], ['?', 'Help']]) {
        const tool = util.el('div', 'legacy-tool', appTools);
        util.el('span', 'legacy-tool-icon', tool, icon);
        util.el('span', '', tool, label);
      }
      Object.assign(_c, { appTools });
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
      const rail = util.el('nav', 'legacy-rail', body);
      const navItems = [
        ['▤', 'Financial'], ['♟', 'Human Resources'], ['◆', 'Student'], ['▧', 'Accounts Payable'],
        ['▣', 'Accounts Receivable'], ['▧', 'General Ledger'], ['▧', 'Budget'], ['▨', 'Fixed Assets'],
        ['▤', 'Reporting'], ['⚙', 'System Administration'],
      ];
      for (let i = 0; i < navItems.length; i++) {
        const row = util.el('div', `legacy-rail-item${i === 0 ? ' selected' : ''}`, rail);
        util.el('span', 'legacy-rail-icon', row, navItems[i][0]);
        util.el('span', '', row, navItems[i][1]);
      }
      const inspector = util.el('aside', 'legacy-inspector', body);
      util.el('div', 'legacy-inspector-title', inspector, 'Details');
      util.el('div', 'legacy-section-title', inspector, 'Organization');
      for (const [a, b] of [['Business Unit', '1000'], ['Central University', ''], ['Division', 'FIN'], ['Finance and Administration', ''], ['Department', 'AR'], ['Accounts Receivable', '']]) {
        const row = util.el('div', 'legacy-detail-row', inspector);
        util.el('span', '', row, a); if (b) util.el('strong', '', row, b);
      }
      util.el('div', 'legacy-section-title', inspector, 'Session');
      for (const [a, b] of [['User ID', 'JSMITH'], ['Terminal', 'S0A1'], ['Database', 'FOPRD'], ['Application', 'FANR'], ['Screen', 'FARA00'], ['Time', '04/21/2009 10:14 AM']]) {
        const row = util.el('div', 'legacy-detail-row', inspector);
        util.el('span', '', row, a); util.el('strong', '', row, b);
      }
      util.el('div', 'legacy-section-title', inspector, 'Quick Links');
      for (const x of ['▤　Account Inquiry', '▤　Account Maintenance', '▤　Report Viewer', '▤　Printer Setup']) util.el('div', 'legacy-quicklink', inspector, x);
      Object.assign(_c, { inspector, navItems, rail });
    },
  };

  env.site({
    name: 'design-use-legacy-app-mainframe-lookup-03',
    template: 'site/base',
    design: { parts },
  });
})();
