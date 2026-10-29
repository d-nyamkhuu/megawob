// Design on the shared transfer-items/dual template.
env.widget({
  task: 'transfer-items',
  site: 'design-transfer-items-rangemix-01',
  name: 'design',
  split: 'train',
  scenarios: ['rangemix'],
  template: 'transfer-items/dual',
  design: {
    colors: { panel: '#c0c0c0', line: '#808080', fg: '#101010', muted: '#333', accent: '#000080', selected: '#fff', selectedIndex: '#fff' },
    fontFamily: 'Arial, "MS Sans Serif", sans-serif',
    fontSizes: { title: 24, note: 13, head: 24, count: 20, filter: 13, index: 11, more: 12, button: 25, order: 12, status: 12, ghost: 13, row: 22, compact: 16 },
    cardPadding: '10px 16px', cardShadow: 'none', controlRadius: 0, buttonHeight: 52,
    buttonColumnWidth: 88, columnGap: 14, radiusRange: [0, 0], pitchRange: [31, 31], minPitch: 24,
    compactPitch: 24, chromeHeight: 210, horizontalInset: 4, verticalInset: 12,
    widthRange: [900, 900], title: 'Select Countries', note: '',
    singleTransferText: '', idleText: '',
    parts: {
      card: (base) => (ctx, wrap) => {
        const card = base(ctx, wrap);
        Object.assign(card.style, { boxSizing: 'border-box', border: '0', background: 'transparent' });
        return card;
      },
      heading: (base) => (ctx, card) => {
        const note = base(ctx, card);
        note.remove();
        Object.assign(card.firstElementChild.style, { fontSize: ctx.size.height < 550 ? '19px' : '24px', marginBottom: ctx.size.height < 550 ? '12px' : '17px', padding: '1px 8px 8px', borderBottom: '1px solid #777' });
        return note;
      },
      body: (base) => (ctx, card) => {
        const body = base(ctx, card);
        Object.assign(body.style, { gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: ctx.size.width < 650 ? '0 12px' : '0 42px', marginTop: '0' });
        return body;
      },
      geometry: (base) => (ctx, card, note) => {
        const geo = base(ctx, card, note);
        const compact = ctx.size.height < 550;
        const height = Math.max(120, Math.min(470, ctx.size.height - (compact ? 160 : 210)));
        geo.pitch = Math.min(geo.pitch, Math.floor((height - 4) / geo.cap));
        card.style.setProperty('--tl-row', geo.pitch + 'px');
        card.style.setProperty('--tl-fs', Math.min(compact ? 16 : 22, geo.pitch - 2) + 'px');
        return geo;
      },
      sideHeading: (base) => (ctx, col, key, label) => {
        const count = base(ctx, col, key, label);
        if (ctx.size.height < 550) {
          count.parentElement.style.fontSize = '19px';
          count.style.fontSize = '16px';
        }
        return count;
      },
      list: (base) => (ctx, col, key, label) => {
        const list = base(ctx, col, key, label);
        list.style.height = Math.max(120, Math.min(470, ctx.size.height - (ctx.size.height < 550 ? 160 : 210))) + 'px';
        list.style.overflowY = 'auto';
        return list;
      },
      transferControls: (base) => (ctx, body) => {
        const controls = base(ctx, body);
        controls.classList.add('tl-transfer-row');
        Object.assign(controls.style, { gridColumn: '1 / -1', gridRow: '2', flexDirection: 'row', justifyContent: 'center', gap: ctx.size.width < 650 ? '7px' : '14px', marginTop: ctx.size.height < 550 ? '12px' : '30px' });
        return controls;
      },
      buttonDecorated: () => (ctx, button) => {
        button.style.width = Math.min(100, (ctx.size.width - 80) / 4) + 'px';
        if (ctx.size.height < 550) button.style.height = '42px';
      },
      status: (base) => (ctx, card) => {
        const status = base(ctx, card);
        Object.assign(status.style, { height: '0', marginTop: '0' });
        return status;
      },
    },
  },
});
