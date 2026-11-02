// Design on the shared transfer-items/dual template.
env.widget({
  task: 'transfer-items',
  site: 'design-transfer-items-rangemix-05',
  name: 'design',
  split: 'train',
  scenarios: ['rangemix'],
  template: 'transfer-items/dual',
  design: {
    colors: { panel: '#ffffff', line: '#d3dfef', fg: '#172a4d', muted: '#52678e', accent: '#2463ee', selected: '#dce9ff', selectedIndex: '#dce9ff' },
    fontFamily: 'Arial, "Segoe UI", sans-serif',
    fontSizes: { title: 24, note: 13, head: 21, count: 16, filter: 13, index: 11, more: 12, button: 28, order: 12, status: 12, ghost: 13, row: 19, compact: 16 },
    cardPadding: '0', cardShadow: 'none', controlRadius: 4, buttonHeight: 57,
    buttonColumnWidth: 80, columnGap: 16, radiusRange: [0, 0], pitchRange: [36, 36], minPitch: 24,
    compactPitch: 24, chromeHeight: 210, horizontalInset: 4, verticalInset: 12,
    widthRange: [900, 900], title: 'FIELD SELECTION', note: '',
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
        Object.assign(body.style, { gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: ctx.size.width < 650 ? '0 12px' : '0 17px', marginTop: '0' });
        return body;
      },
      geometry: (base) => (ctx, card, note) => {
        const geo = base(ctx, card, note);
        const compact = ctx.size.height < 550;
        const stageHeight = ctx.stage.clientHeight;
        const noteSpace = document.querySelector('.ref-instruction') ? 90 : 0;
        const scale = stageHeight / 941;
        const rowSpace = stageHeight * .57 - noteSpace - 24 * scale - 4;
        geo.pitch = Math.max(15, Math.min(Math.round(36 * scale), Math.floor(rowSpace / geo.cap)));
        card.style.setProperty('--tl-row', geo.pitch + 'px');
        card.style.setProperty('--tl-fs', Math.min(19 * scale, geo.pitch - 2) + 'px');
        card.style.setProperty('--tl-cap', geo.cap);
        return geo;
      },
      sideHeading: (base) => (ctx, col, key, label) => {
        const count = base(ctx, col, key, label);
        const head = col.querySelector('.tl-head');
        if (head) {
          head.firstElementChild.textContent = key === 'L' ? 'Available' : 'Selected';
        }
        if (ctx.size.height < 550) {
          count.parentElement.style.fontSize = '19px';
          count.style.fontSize = '16px';
        }
        return count;
      },
      countText: () => (ctx, key, total) => `${total} items`,
      list: (base) => (ctx, col, key, label) => {
        const list = base(ctx, col, key, label);
        list.style.height = Math.max(120, Math.min(470, ctx.size.height - (ctx.size.height < 550 ? 160 : 220))) + 'px';
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
