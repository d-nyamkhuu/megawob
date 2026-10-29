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

      // Industrial desktop frame: native title strip, menu row and application tabs.
      const winbar = util.el('div', 'hr-windowbar', document.body);
      util.el('span', 'hr-window-icon', winbar, '▣');
      util.el('strong', 'hr-window-title', winbar, 'People Operations');
      const sys = util.el('div', 'hr-window-controls', winbar);
      for (const mark of ['—', '□', '×']) util.el('span', '', sys, mark);
      const menu = util.el('div', 'hr-menubar', document.body);
      util.el('span', 'hr-apple', menu, '●');
      for (const label of ['File', 'Edit', 'View', 'People', 'Hiring', 'Reports', 'Window', 'Help']) util.el('span', '', menu, label);
      util.el('span', 'hr-menu-clock', menu, '◧　 Mon Apr 23　 9:42 AM');
      document.body.insertBefore(menu, winbar);
      const tabs = util.el('nav', 'hr-tabs', document.body);
      const tabLabels = [['♟', 'People'], ['▣', 'Hiring'], ['♧', 'Org Chart'], ['▦', 'Leave'], ['▤', 'Reports'], ['⚙', 'Administration']];
      for (let i = 0; i < tabLabels.length; i++) {
        const tab = util.el('div', i === 1 ? 'hr-tab hr-tab-active' : 'hr-tab', tabs);
        util.el('span', 'hr-tab-icon', tab, tabLabels[i][0]);
        util.el('span', 'hr-tab-label', tab, tabLabels[i][1]);
      }
      util.el('span', 'hr-org', tabs, 'Acme Instruments　 |　 People Operations');
      Object.assign(_c, { collide, cr, decoys, label, menu, nav, placement, sidebar, sys, tabLabels, tabs, wantFooter, winbar });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, rng, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      rng.pick(['center', 'center', 'flex-start', 'flex-end']);
      rng.pick(['center', 'center', 'flex-start', 'flex-end']);
      Object.assign(_c, { stage });
    },
    'frame.floating': (base, S) => function (_c) {
      const { endBtn, label, placement, tabs, util } = _c;
      let { submit } = _c;
      if (placement === 'floating') {
        // Reserve the control's space so it cannot intercept task clicks or drags.
        // On scrollable pages the dock follows the content, just like a form footer.
        const dock = util.el('div', 'ref-float-dock', document.body);
        submit = endBtn(dock, 'ref-submit ref-float', label);
      }
      const statusbar = util.el('div', 'hr-statusbar', document.body);
      util.el('span', '', statusbar, 'Mon Apr 23　 9:42 AM');
      util.el('span', '', statusbar, 'People Operations');
      document.body.insertBefore(tabs, statusbar);
      Object.assign(_c, { statusbar, submit });
    },
  };

  env.site({
    name: 'design-use-hr-pipeline-04',
    template: 'site/base',
    design: { parts },
  });
})();
