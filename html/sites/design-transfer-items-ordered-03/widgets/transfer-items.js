// Design on the shared transfer-items/dual template.
env.widget({
  task: 'transfer-items',
  site: 'design-transfer-items-ordered-03',
  name: 'design',
  split: 'train',
  scenarios: ['ordered'],
  template: 'transfer-items/dual',
  design: {
    fontFamily: '"Courier New", monospace',
    cardPadding: '12px 16px',
    cardShadow: 'none',
    radiusRange: [0, 0],
    controlRadius: 0,
    buttonHeight: 38,
    buttonColumnWidth: 64,
    columnGap: 12,
    fontSizes: { title: 18, note: 13, head: 19, count: 19, filter: 13,
      index: 12, more: 12, button: 20, order: 17, status: 12.5,
      ghost: 12.5, row: 19, compact: 14 },
    parts: {
      style: (base) => (ctx) => {
        base(ctx);
        if (document.getElementById('gem-transfer-style')) return;
        const style = ctx.util.el('style', '', document.head);
        style.id = 'gem-transfer-style';
        style.textContent = `
          .tl-card { box-sizing: border-box; border: 0; }
          .tl-body.ordered { flex: 1 1 0; min-height: 0;
            grid-template-columns: minmax(0,1fr) 64px minmax(0,1fr);
            grid-template-rows: minmax(0,1fr) 38px; row-gap: 10px; }
          .tl-side { min-height: 0; }
          .tl-side:first-child { grid-column: 1; grid-row: 1 / 3; }
          .tl-side:nth-child(3) { grid-column: 3; grid-row: 1; }
          .tl-head { flex: none; margin: 0; padding: 7px 10px;
            border: 2px solid #080808; background: #ccc; }
          .tl-head .n { color: #080808; }
          .tl-list { flex: 1 1 0; min-height: 0; background: #fff;
            border: 2px solid #080808; border-top: 0; }
          .tl-btns { grid-column: 2; grid-row: 1; gap: 14px; }
          .tl-ud { grid-column: 3; grid-row: 2; flex-direction: row;
            justify-content: flex-end; padding: 0; gap: 14px; }
          .tl-ud .tl-btn { width: 80px; }
          .tl-btn { flex: none; border: 2px solid #080808;
            box-shadow: inset 2px 2px #fff, inset -2px -2px #888; }
          .tl-row { border-bottom: 0; }
          .tl-status { flex: none; }
        `;
      },
      geometry: (base, S) => (ctx, card, note) => {
        const geo = base(ctx, card, note);
        // Both panes can hold every item without resizing after a transfer.
        const available = Math.max(1, ctx.size.height - 176);
        geo.pitch = Math.max(12, Math.min(30, Math.floor(available / geo.cap)));
        card.style.setProperty('--tl-row', geo.pitch + 'px');
        card.style.setProperty('--tl-fs', Math.min(19, geo.pitch - 2) + 'px');
        return geo;
      },
      place: (base) => (ctx, card) => {
        // Retain the template's seeded draws, then fit the full-bleed GEM plane.
        base(ctx, card);
        Object.assign(card.style, { left: '0px', top: '0px',
          width: ctx.size.width + 'px', height: ctx.size.height + 'px' });
      },
    },
  },
});
