// Design on the shared transfer-items/dual template.
env.widget({
  task: 'transfer-items',
  site: 'design-transfer-items-ordered-02',
  name: 'design',
  split: 'train',
  scenarios: ['ordered'],
  template: 'transfer-items/dual',
  design: {
    title: 'Permissions',
    note: '',
    cardPadding: '0',
    cardShadow: 'none',
    horizontalInset: 2,
    verticalInset: 2,
    orderedWidthRange: [1600, 1600],
    pitchRange: [42, 46],
    minPitch: 18,
    buttonHeight: 40,
    parts: {
      sideHeading: (base) => (ctx, col, key, label) => {
        const count = base(ctx, col, key, label);
        Object.assign(count.parentElement.style, {
          height: '50px', marginBottom: '0', padding: '0 20px', alignItems: 'center',
          background: '#eaeaea', border: '1px solid #ccc', borderRadius: '3px 3px 0 0',
          boxSizing: 'border-box',
        });
        return count;
      },
    },
    fontSizes: { title: 30, note: 13, head: 20, count: 18, filter: 13, index: 12,
      more: 12, button: 20, order: 14, status: 12.5, ghost: 14, row: 20, compact: 14 },
  },
});
