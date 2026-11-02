// Keep the template's rating behavior, with the e-ink card sized to its stage.
env.widget({
  task: 'set-slider',
  site: 'design-set-slider-rating-04',
  name: 'design',
  split: 'train',
  scenarios: ['rating'],
  template: 'set-slider/base',
  design: {
    parts: {
      'ensureStyle@0': (base) => () => {
        base();
        const sheet = document.getElementById('slc-style');
        sheet.textContent = sheet.textContent.replace(/\.slr-card \{[\s\S]*?(?=      \.slm-player)/, `
      .slr-card { position: absolute; padding: 0; border: 0; border-radius: 0;
        background: transparent; box-shadow: none; color: #111;
        font-family: Georgia, 'Times New Roman', serif; }
      .slr-title { display: none; }
      .slr-item { font-size: 1.1em; font-weight: bold; margin: 0 0 .8em; color: #111; }
      .slr-row { display: grid; grid-template-columns: 31% max-content minmax(60px, 1fr);
        align-items: center; gap: 1%; height: var(--rating-row-height); padding: 0; border: 0; }
      .slr-label { min-width: 0; font-size: 1em; font-weight: 600; }
      .slr-stars { display: flex; touch-action: none; cursor: pointer; user-select: none; }
      .slr-star { position: relative; flex: none; }
      .slr-star svg { position: absolute; inset: 0; width: 100%; height: 100%; }
      .slr-star .bg path { fill: transparent; stroke: #111; stroke-width: 1.35; }
      .slr-star .fg { overflow: hidden; position: absolute; left: 0; top: 0; bottom: 0; width: 0; }
      .slr-star .fg svg { position: absolute; left: 0; top: 0; height: 100%; }
      .slr-star .fg path { fill: #111; }
      .slr-value { min-width: 0; color: #111; font-size: .82em;
        white-space: nowrap; font-variant-numeric: tabular-nums; }
      `);
      },
      'placeIn@0': (base) => (ctx, card, rng, pad = 12) => {
        // Size the card before the template samples its position. Star sizes and
        // spacing stay with renderRating, so painting and pointer math agree.
        card.style.width = Math.max(0, ctx.size.width - 2 * pad) + 'px';
        const item = card.querySelector('.slr-item');
        const heading = item.offsetHeight + parseFloat(getComputedStyle(item).marginBottom);
        const rowHeight = Math.min(88, ctx.size.width * .1,
          (ctx.size.height - 2 * pad - heading) / ctx.spec.sliders.length);
        card.style.setProperty('--rating-row-height', Math.max(0, rowHeight) + 'px');
        return base(ctx, card, rng, pad);
      },
    },
  },
});
