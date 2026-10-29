// Design on the shared transfer-items/dual template.
env.widget({
  task: 'transfer-items',
  site: 'design-transfer-items-rangemix-04',
  name: 'design',
  split: 'train',
  scenarios: ['rangemix'],
  template: 'transfer-items/dual',
  design: {
    colors: { panel: '#ffffff', line: '#bdc3c9', fg: '#141b24', muted: '#56606a', accent: '#ff8000', selected: '#fff', selectedIndex: '#fff' },
    fontFamily: 'Arial, "Segoe UI", sans-serif',
    fontSizes: { title: 31, note: 18, head: 21, count: 21, filter: 14, index: 12, more: 14, button: 32, order: 14, status: 14, ghost: 14, row: 21, compact: 14 },
    cardPadding: '4px 0 0', cardShadow: 'none', controlRadius: 2, buttonHeight: 60,
    buttonColumnWidth: 94, columnGap: 24, radiusRange: [0, 0], pitchRange: [33, 33], minPitch: 12,
    compactPitch: 30, chromeHeight: 124, horizontalInset: 28, verticalInset: 28,
    widthRange: [1300, 1300], title: 'Select Products', note: '',
    singleTransferText: '', idleText: '', lockedText: '', selectedText: '',
    parts: {
      // Keep the notebook's full document area while preserving the template's RNG draws.
      place: (base) => (ctx, card) => {
        base(ctx, card);
        Object.assign(card.style, { left: '28px', top: '28px', width: (ctx.size.width - 56) + 'px', height: (ctx.size.height - 56) + 'px' });
      },
      body: (base) => (ctx, card) => {
        const body = base(ctx, card);
        body.style.marginTop = '24px';
        if (ctx.size.width < 850) {
          body.style.gridTemplateColumns = 'minmax(0,1fr) 64px minmax(0,1fr)';
          body.style.columnGap = '12px';
        }
        return body;
      },
      button: (base) => (ctx, parent, key, text) => {
        const button = base(ctx, parent, key, text);
        button.style.height = Math.max(28, Math.min(60, Math.floor((ctx.size.height - 180) / 4))) + 'px';
        return button;
      },
      list: (base, S) => (ctx, col, key, label) => {
        const list = base(ctx, col, key, label);
        list.style.height = Math.max(S.geo.cap * S.geo.pitch + 2, ctx.size.height - 180) + 'px';
        return list;
      },
    },
  },
});
