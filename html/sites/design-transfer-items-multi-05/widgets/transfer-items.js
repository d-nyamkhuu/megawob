// Design on the shared transfer-items/dual template.
env.widget({
  task: 'transfer-items',
  site: 'design-transfer-items-multi-05',
  name: 'design',
  split: 'train',
  scenarios: ['multi'],
  template: 'transfer-items/dual',
  design: {
    title: 'Select Countries',
    note: '',
    leftLabel: 'Available countries',
    rightLabel: 'Selected countries',
    cardPadding: '74px 32px 24px',
    widthRange: [900, 916],
    buttonHeight: 44,
    parts: {
      style: (base) => (ctx) => {
        base(ctx);
        if (document.getElementById('we-transfer-layout')) return;
        const style = ctx.util.el('style', '', document.head);
        style.id = 'we-transfer-layout';
        style.textContent = `
          .world-explorer .tl-card { box-sizing: border-box; }
          .world-explorer .tl-card::before { position: absolute; top: 0; left: 6px; right: 6px; height: 50px; }
          .world-explorer .tl-card::after { position: absolute; top: 8px; right: 16px; }
          .world-explorer .tl-title { position: absolute; top: 12px; left: 20px; }
          .world-explorer .tl-body { z-index: 1; grid-template-columns: minmax(0,1fr) minmax(0,1fr); grid-template-rows: auto 44px; gap: 22px 42px; margin-top: 0; }
          .world-explorer .tl-side { grid-row: 1; }
          .world-explorer .tl-btns { grid-column: 1 / -1; grid-row: 2; flex-direction: row; gap: 10px; }
          .world-explorer .tl-btn { width: 92px; }
          .world-explorer .tl-row { padding: 0 13px; }
          .world-explorer .tl-btns > .tl-btn:nth-child(1) { order: 3; }
          .world-explorer .tl-btns > .tl-btn:nth-child(2) { order: 4; }
          .world-explorer .tl-btns > .tl-btn:nth-child(3) { order: 2; }
          .world-explorer .tl-btns > .tl-btn:nth-child(4) { order: 1; }
        `;
      },
      place: (base, S) => (ctx, card) => {
        // Keep the template's seeded draws; fit the Aero frame to the stage.
        const compact = ctx.size.width < 800;
        const densityPitch = ctx.size.width <= 1100 ? 16 : (ctx.size.height < 900 ? 16 : 30);
        S.st.geo.pitch = densityPitch;
        card.style.padding = compact ? '62px 22px 20px' : '74px 32px 24px';
        S.st.body.style.columnGap = compact ? '22px' : '42px';
        base(ctx, card);
        card.style.height = 'auto';
        const height = Math.min(715, ctx.size.height - 24);
        const overhead = card.offsetHeight - S.st.lists.L.offsetHeight;
        const pitch = Math.min(densityPitch, Math.floor((height - overhead - 2) / S.st.geo.cap));
        S.st.geo.pitch = pitch;
        card.style.setProperty('--tl-row', pitch + 'px');
        card.style.setProperty('--tl-fs', Math.min(compact ? 16 : 20, pitch - 3) + 'px');
        for (const list of Object.values(S.st.lists)) list.style.height = S.st.geo.cap * pitch + 2 + 'px';
        card.style.height = height + 'px';
        card.style.top = '12px';
        card.style.left = Math.max(16, Math.min(parseFloat(card.style.left), ctx.size.width - card.offsetWidth - 16)) + 'px';
      },
      locate: (base, S) => (target) => {
        if (target.item !== undefined) {
          const row = S.st.rows.L.get(target.item) || S.st.rows.R.get(target.item);
          if (row) {
            const list = row.parentElement;
            const itemBox = row.getBoundingClientRect();
            const listBox = list.getBoundingClientRect();
            if (itemBox.top < listBox.top) list.scrollTop += itemBox.top - listBox.top;
            else if (itemBox.bottom > listBox.bottom) list.scrollTop += itemBox.bottom - listBox.bottom;
          }
        }
        return base(target);
      },
    },
  },
});
