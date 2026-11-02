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
      const sidebarDraw = roomy && rng.bool(0.35);
      const navDraw = W >= 1180 && rng.bool(0.5);
      const sidebar = false;
      const nav = false;
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, navDraw, placement, sidebar, sidebarDraw, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { lr, rng, util, word } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      {
        const title = rng.pick(TITLES);
        const brandLabel = word ? word(lr.pick(K.brand)) : title;
        const brand = util.el('div', 'ref-brand', header, 'Riverside Bank — Bill Pay');
        brand.dataset.originalLabel = brandLabel;
        brand.dataset.role = 'brand';
      }
      Object.assign(_c, { header });
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
      const windowControls = util.el('div', 'ref-window-controls', header);
      for (const [cls, label, glyph] of [['minimize', 'Minimize', '−'], ['maximize', 'Maximize', '□'], ['close', 'Close', '×']]) {
        const control = util.el('span', `ref-window-control ref-window-${cls}`, windowControls, glyph);
        control.setAttribute('aria-label', label);
        control.title = label;
      }
      Object.assign(_c, { headerTools, submit, windowControls });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const stage = util.el('main', 'ref-stage', body);
      stage.style.justifyContent = 'flex-start';
      stage.style.alignItems = 'stretch';
      const side = util.el('aside', 'bank-summary', body);
      const card = (title, rows) => {
        const box = util.el('section', 'bank-card', side);
        util.el('h2', '', box, title);
        const list = util.el('div', 'bank-rows', box);
        for (const [name, value] of rows) {
          const row = util.el('div', 'bank-row', list);
          util.el('span', '', row, name); util.el('span', '', row, value);
        }
      };
      card('Accounts', [['Everyday checking •6450', '$3,258.21'], ['Regular savings •8821', '$12,480.36'], ['Rewards credit card •3178', '$982.17']]);
      card('Upcoming Payments', [['Scheduled', '3'], ['Processing', '0'], ['Recently paid', '5']]);
      card('Biller Status', [['Active billers', '12'], ['Inactive billers', '2'], ['Total billers', '14']]);
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, card, side, stage });
    },
    'frame.stage': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-use-bank-paybill-04',
    template: 'site/base',
    design: { parts },
  });
})();
