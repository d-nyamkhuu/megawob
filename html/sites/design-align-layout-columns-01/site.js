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
      const titlebar = util.el('div', 'lc-titlebar', document.body);
      util.el('span', 'lc-appicon', titlebar, '▤');
      util.el('strong', '', titlebar, 'LayoutCal — Table Layout Utility');
      const winbuttons = util.el('div', 'lc-window-buttons', titlebar);
      for (const glyph of ['−', '□', '×']) util.el('span', '', winbuttons, glyph);
      const menubar = util.el('div', 'lc-menubar', document.body);
      for (const item of ['File', 'Edit', 'View', 'Tools', 'Help']) util.el('span', '', menubar, item);
      Object.assign(_c, { collide, cr, decoys, label, menubar, nav, placement, sidebar, titlebar, wantFooter, winbuttons });
    },
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const tabs = util.el('nav', 'lc-tabs', header);
      for (const [i, item] of ['Layout', 'Elements', 'Styles', 'Preview', 'Settings'].entries()) {
        const tab = util.el('span', `lc-tab${i === 0 ? ' selected' : ''}`, tabs, item);
      }
      S.frameBrand(_c, header);
      Object.assign(_c, { header, tabs });
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
      const stats = util.el('div', 'lc-stats', body);
      for (const [label, value] of [['Rows', '8'], ['Columns', '4'], ['Cards', '32'], ['Status', 'Ready']]) {
        const cell = util.el('div', 'lc-stat', stats);
        util.el('span', '', cell, label);
        util.el('strong', '', cell, value);
      }
      Object.assign(_c, { stats });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, rng, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      rng.pick(['center', 'center', 'flex-start', 'flex-end']);
      rng.pick(['center', 'center', 'flex-start', 'flex-end']);
      stage.style.justifyContent = 'center';
      stage.style.alignItems = 'center';
      Object.assign(_c, { stage });
    },
  };

  env.site({
    name: 'design-align-layout-columns-01',
    template: 'site/base',
    design: { parts },
  });
})();
