// Design on the shared transfer-items/dual template.
env.widget({
  task: 'transfer-items',
  site: 'design-transfer-items-range-03',
  name: 'design',
  split: 'train',
  scenarios: ['range'],
  template: 'transfer-items/dual',
  design: {
    cardPadding: '28px 34px',
    cardShadow: 'none',
    controlRadius: 3,
    buttonHeight: 49,
    columnGap: 24,
    fontFamily: 'Georgia, "Times New Roman", serif',
    parts: {
      style: (base) => (ctx) => {
        base(ctx);
        if (document.getElementById('library-transfer-style')) return;
        const style = ctx.util.el('style', '', document.head);
        style.id = 'library-transfer-style';
        style.textContent = `
          .tl-card { border: 0; border-radius: 0; background: transparent; }
          .tl-title { color: #171923; background: #e7e4dc; font: bold 30px/1.15 Georgia, serif; border-bottom: 1px solid #8e7764; padding-bottom: 8px; }
          .tl-body { grid-template-columns: repeat(2, minmax(0, 1fr)); row-gap: 24px; }
          .tl-side { grid-row: 1; }
          .tl-btns { grid-column: 1 / -1; grid-row: 2; flex-direction: row; gap: 18px; }
          .tl-btn { width: 64px; padding: 0; background: linear-gradient(#fffdf7, #e5dccb); color: #171923; border-color: #887b69; }
          .tl-list { background: #fff; border-color: #777; }
          .tl-row { color: #171923; }
          .tl-row.sel { color: #fff; }
        `;
      },
      geometry: (base, S) => (ctx, card, note) => {
        const geo = base(ctx, card, note);
        const compact = ctx.size.height < 550;
        const padY = compact ? 8 : 28;
        const padX = ctx.size.width < 700 ? 18 : 34;
        card.style.width = ctx.size.width + 'px';
        card.style.padding = `${padY}px ${padX}px`;
        S.st.body.style.rowGap = compact ? '18px' : '24px';
        const heading = card.querySelector('.tl-title').offsetHeight;
        const noteHeight = note.isConnected ? note.offsetHeight + 2 : 0;
        // Reserve both list headings, the button row, status and card padding.
        const reserved = 2 * padY + heading + noteHeight + 12 + 26 +
          (compact ? 18 : 24) + S.D.buttonHeight + 28 + 4;
        geo.pitch = Math.max(8, Math.min(33, Math.floor((ctx.size.height - reserved) / geo.cap)));
        card.style.setProperty('--tl-row', geo.pitch + 'px');
        card.style.setProperty('--tl-fs', Math.min(20, Math.max(10, geo.pitch - 4)) + 'px');
        return geo;
      },
      place: (base) => (ctx, card) => {
        // Retain the template's seeded placement draws, then fit the catalog form.
        base(ctx, card);
        card.style.width = ctx.size.width + 'px';
        card.style.height = 'auto';
        card.style.left = '0px';
        card.style.top = '0px';
        card.style.height = card.offsetHeight + 'px';
      },
    },
  },
});
