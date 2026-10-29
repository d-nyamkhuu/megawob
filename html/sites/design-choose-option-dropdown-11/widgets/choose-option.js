// Keeps this return form's order summary, title fields and notes area.
env.widget({
  task: 'choose-option',
  site: 'design-choose-option-dropdown-11',
  name: 'design',
  split: 'train',
  scenarios: ['dropdown'],
  template: 'choose-option/widgets',
  design: {
    parts: {
      details: () => (ctx) => {
        const { util } = ctx;
        const details = util.el('aside', 'ds-order', ctx.stage);
        details.insertAdjacentHTML(
          'beforeend',
          '<svg viewBox="0 0 130 140" fill="#fff" stroke="#000" stroke-width="3" stroke-linejoin="round"><defs><pattern id="cube-hatch" width="5" height="5" patternUnits="userSpaceOnUse"><path d="M-1 1L1-1M0 5L5 0M4 6L6 4" stroke-width="1.5"/></pattern></defs><path d="M65 4 L124 34 V104 L65 136 L6 104 V34 Z"/><path d="M6 34 L65 64 L124 34 M65 64 V136"/><path d="M65 64 L124 34 V104 L65 136 Z" fill="url(#cube-hatch)"/><path d="M34 49L96 20L103 24L41 53Z" fill="url(#cube-hatch)"/></svg>',
        );
        util.el('div', 'ds-ord', details, 'Order #48291');
        util.el('div', 'ds-ord', details, '3 items');
        util.el('div', 'ds-ord', details, 'Placed: Apr 20, 1987');
      },
      heading: () => (ctx, card) => {
        const { util, spec } = ctx;
        util.el('div', 'ds-ptitle', card, 'Process a Return');
        [['Order Number:', '48291'], ['Customer Name:', 'Taylor Kim']].forEach(([key, value]) => {
          const label = util.el('label', 'ds-motif-field', card, key);
          const input = util.el('input', '', label);
          input.type = 'text';
          input.value = value;
        });
        util.el('div', 'fp-note', card, spec.note);
      },
      decorated: () => (ctx, card) => {
        const { util } = ctx;
        const decoys = util.el('div', 'ds-motif-xtras', card);
        [['Return Reason:', ''], ['Condition:', ''], ['Refund Method:', '']].forEach(([key, value]) => {
          const label = util.el('label', 'ds-motif-field', decoys, key);
          const input = util.el('input', '', label);
          input.type = 'text';
          input.value = value;
        });
        const noteWrap = util.el('div', 'ds-notewrap', decoys);
        util.el('div', 'ds-nl', noteWrap, 'Additional Notes:');
        const notes = util.el('div', 'ds-notes', noteWrap);
        util.el('div', 'ds-nt', notes);
        const scrollbar = util.el('div', 'ds-sb', notes);
        util.el('span', '', scrollbar, '▲');
        util.el('span', '', scrollbar, '▼');
      },
    },
  },
});
