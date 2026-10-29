// Design on the shared transfer-items/dual template.
env.widget({
  task: 'transfer-items',
  site: 'design-transfer-items-rangemix-03',
  name: 'design',
  split: 'train',
  scenarios: ['rangemix'],
  template: 'transfer-items/dual',
  design: {
    colors: { panel: '#c0c0c0', line: '#808080', fg: '#101010', muted: '#333', accent: '#000080', selected: '#fff', selectedIndex: '#fff' },
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontSizes: { title: 34, note: 16, head: 25, count: 24, filter: 16, index: 14, more: 15, button: 23, order: 14, status: 14, ghost: 15, row: 18, compact: 16 },
    cardPadding: '0 30px 24px', cardShadow: '0 3px 10px #0003', controlRadius: 3, buttonHeight: 42,
    buttonColumnWidth: 88, columnGap: 18, radiusRange: [0, 0], pitchRange: [35, 35], minPitch: 30,
    compactPitch: 24, chromeHeight: 0, horizontalInset: 0, verticalInset: 0,
    widthRange: [1128, 1128], title: 'Select Order Columns', note: '',
    singleTransferText: '', idleText: '',
    parts: {
      card: (base, S) => (ctx, wrap) => {
        const card = base(ctx, wrap);
        const compact = ctx.size.height < 520 || ctx.size.width < 850;
        card.dataset.compact = compact ? '1' : '0';
        card.style.padding = compact ? '0 14px 12px' : '0 30px 24px';
        card.style.width = Math.min(1128, ctx.size.width) + 'px';
        card.style.setProperty('--acme-title', compact ? '24px' : '34px');
        card.style.setProperty('--acme-head', compact ? '18px' : '25px');
        return card;
      },
      heading: (base, S) => (ctx, card) => {
        const note = base(ctx, card);
        const compact = card.dataset.compact === '1';
        Object.assign(note.previousElementSibling.style, {
          margin: compact ? '0 -14px 12px' : '0 -30px 22px',
          padding: compact ? '6px 12px' : '10px 20px',
          height: compact ? '48px' : '64px', flex: 'none',
        });
        return note;
      },
      body: (base, S) => (ctx, card) => {
        const body = base(ctx, card);
        Object.assign(body.style, { gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', marginTop: '0' });
        return body;
      },
      geometry: (base, S) => (ctx, card, note) => {
        const geo = base(ctx, card, note);
        const compact = card.dataset.compact === '1';
        const reserve = compact ? 174 : 240;
        geo.pitch = Math.max(10, Math.min(geo.pitch, Math.floor((Math.min(706, ctx.size.height) - reserve) / geo.cap)));
        card.style.setProperty('--tl-row', geo.pitch + 'px');
        card.style.setProperty('--tl-fs', Math.min(18, Math.max(10, geo.pitch - 2)) + 'px');
        return geo;
      },
      sideDecorated: (base, S) => (ctx, col, key) => {
        base(ctx, col, key);
        col.style.gridColumn = key === 'L' ? '1' : '2';
        col.style.gridRow = '1';
        const count = key === 'L' ? S.st.countL : S.st.countR;
        count.style.fontSize = S.st.card.dataset.compact === '1' ? '18px' : '24px';
      },
      transferControls: (base, S) => (ctx, body) => {
        const buttons = base(ctx, body);
        Object.assign(buttons.style, { gridColumn: '1 / -1', gridRow: '2', flexDirection: 'row', gap: '14px', marginTop: '18px' });
        return buttons;
      },
      buttonDecorated: (base, S) => (ctx, button, key) => {
        base(ctx, button, key);
        button.style.width = '68px';
        button.style.height = S.st.card.dataset.compact === '1' ? '34px' : '42px';
      },
      place: (base, S) => (ctx, card) => {
        base(ctx, card);
        Object.assign(card.style, { left: '0', top: '0', height: Math.min(706, ctx.size.height) + 'px' });
      },
    },
  },
});
