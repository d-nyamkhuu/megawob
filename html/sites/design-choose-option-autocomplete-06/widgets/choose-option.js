// Route Planner heading, origin row, travel controls, and input caret customize the shared autocomplete widget.
(function () {
  'use strict';

  let extra;

  env.widget({
    task: 'choose-option',
    site: 'design-choose-option-autocomplete-06',
    name: 'design',
    split: 'train',
    scenarios: ['autocomplete'],
    template: 'choose-option/widgets',
    design: {
      titleText: 'Route Planner',
      parts: {
        heading: (base) => (ctx, card) => {
          base(ctx, card);
          const fromRow = ctx.util.el('div', 'fp-field ds-from', card);
          ctx.util.el('div', 'fp-label', fromRow, 'From');
          const fromBox = ctx.util.el('div', 'ds-fakectl', fromRow);
          ctx.util.el('span', '', fromBox, 'New York (JFK)');
          ctx.util.el('i', 'ds-caret', fromBox);
        },
        travelExtra: () => (ctx, card) => {
          const { util } = ctx;
          extra = util.el('section', 'ds-travel-extra', card);
          const r1 = util.el('div', 'fp-field ds-from', extra);
          util.el('div', 'fp-label', r1, 'Date');
          const d1 = util.el('div', 'ds-fakectl', r1);
          util.el('span', '', d1, '2025-06-15');
          util.el('i', 'ds-cal', d1);
          const r2 = util.el('div', 'fp-field ds-from', extra);
          util.el('div', 'fp-label', r2, 'Trip type');
          const d2 = util.el('div', 'ds-fakectl', r2);
          util.el('span', '', d2, 'One way');
          util.el('i', 'ds-caret', d2);
          const r3 = util.el('div', 'ds-opts', extra);
          util.el('div', 'fp-label', r3, 'Options');
          const oc = util.el('div', '', r3);
          ['Nonstop only', 'Include nearby airports'].forEach((text) => {
            const row = util.el('div', 'ds-optrow', oc);
            util.el('i', 'ds-cb', row);
            util.el('span', '', row, text);
          });
        },
        freeze: () => (ctx, card) => {
          const available = Math.max(0, ctx.size.height - 2);
          const overflow = Math.max(0, card.scrollHeight - available);
          if (overflow) {
            const gap = parseFloat(getComputedStyle(extra).marginTop);
            card.style.setProperty('--ds-travel-gap', Math.max(8, gap - overflow) + 'px');
          }
          card.style.height = Math.min(card.offsetHeight, available) + 'px';
        },
        autocompleteControl: (base) => (ctx, controls) => {
          base(ctx, controls);
          ctx.util.el('i', 'ds-caret ds-input-caret', controls.ctl);
        },
      },
    },
  });
})();
