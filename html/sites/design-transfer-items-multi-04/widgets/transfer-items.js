// Design on the shared transfer-items/dual template.
env.widget({
  task: 'transfer-items',
  site: 'design-transfer-items-multi-04',
  name: 'design',
  split: 'train',
  scenarios: ['multi'],
  template: 'transfer-items/dual',
  design: {
    minPitch: 12,
    parts: {
      wrap: (base, S) => (ctx) => {
        const wrap = base(ctx);
        const summary = ctx.util.el('aside', 'mac-summary', wrap);
        ctx.util.el('div', 'mac-box-icon', summary, '□');
        ctx.util.el('div', 'mac-rule', summary);
        S.st.availableCount = ctx.util.el('div', 'mac-count', summary);
        S.st.selectedCount = ctx.util.el('div', 'mac-count', summary);
        ctx.util.el('div', 'mac-rule', summary);
        S.st.totalCount = ctx.util.el('div', 'mac-count mac-total', summary);
        return wrap;
      },
      paintControls: (base, S) => (ctx) => {
        base(ctx);
        const total = ctx.spec.items.length;
        const selected = ctx.model.right.length;
        S.st.availableCount.textContent = `Available Items: ${total - selected}`;
        S.st.selectedCount.textContent = `Selected Items: ${selected}`;
        S.st.totalCount.textContent = `Total Items: ${total}`;
      },
      place: (base) => (ctx, card) => {
        // Preserve the template's seeded draws, then fit the card beside the summary.
        base(ctx, card);
        const inset = 12;
        const left = Math.ceil(ctx.size.width * 0.28) + inset;
        card.style.left = left + 'px';
        card.style.width = Math.max(0, ctx.size.width - left - inset) + 'px';
        card.style.height = 'auto';
        card.style.height = card.offsetHeight + 'px';
        card.style.top = Math.max(0, Math.min(parseFloat(card.style.top), ctx.size.height - card.offsetHeight)) + 'px';
      },
    },
  },
});
