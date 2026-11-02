// Swiss multi-slider design with fixed look, compact rows, and pinned vertical controls.
(function () {
  env.widget({
    task: 'set-slider',
    site: 'design-set-slider-multi-01',
    name: 'design',
    split: 'train',
    scenarios: ['multi'],
    template: 'set-slider/classic',
    design: {
      horizontal: false,
      parts: {
        look: () => (ctx) => {
          const { rng, spec } = ctx;
          const look = {
            thumb: rng.int(14, 26),
            rail: rng.int(4, 10),
            ticks: rng.bool(0.6),
            readout: rng.bool(0.6) || spec.showValue || spec.scenario === 'match',
            native: rng.bool(0.3),
          };
          Object.assign(look, { thumb: 24, rail: 10, ticks: true, readout: true, native: false });
          return look;
        },
        label: (base) => (ctx, root, index, s, g) => {
          const label = base(ctx, root, index, s, g);
          if (s.label.length > 8) label.style.fontSize = 'clamp(12px,1.25vw,21px)';
          return label;
        },
        widget: (base) => (ctx, w) => {
          base(ctx, w);
          if (w.g.vertical) {
            if (w.readout) w.readout.style.width = w.readout.getBoundingClientRect().width + 'px';
            const width = w.root.getBoundingClientRect().width;
            w.root.style.width = width + 'px';
            w.root.style.flex = '0 0 ' + width + 'px';
          }
        },
        size: (base) => (ctx) => {
          const size = base(ctx);
          if (!ctx.spec.vertical && ctx.spec.sliders.length >= 4) {
            document.body.classList.add('many-sliders');
            ctx.stage.style.top = '53%';
            ctx.stage.style.height = '38%';
            return { width: size.width, height: ctx.stage.getBoundingClientRect().height };
          }
          return size;
        },
        card: (base) => (ctx, layout) => {
          const card = base(ctx, layout);
          const { size, vertical, n, look } = layout;
          let cardTop = Math.min(size.height / 7, 24 + size.height * 0.052);
          const cross = Math.max(look.thumb, 24) + 12;
          let tickRoom = 44;
          const desiredGap = size.height * (0.134 / 0.28) - cross;
          let rowGap = Math.max(0, Math.min(desiredGap,
            (size.height - cardTop - tickRoom - n * cross) / Math.max(1, n - 1)));
          if (!vertical && n > 1 && rowGap < 36) {
            card.classList.add('compact-scales');
            tickRoom = 18;
            cardTop = Math.min(cardTop, Math.max(0, size.height - tickRoom - n * cross - (n - 1) * 12));
            rowGap = Math.max(0, Math.min(desiredGap,
              (size.height - cardTop - tickRoom - n * cross) / Math.max(1, n - 1)));
          }
          layout.cardTop = cardTop;
          card.style.setProperty('--slc-top', cardTop + 'px');
          card.style.setProperty('--slc-inset', size.width * (0.01 / 0.716) + 'px');
          card.style.setProperty('--slc-label-width', size.width * (0.098 / 0.716) + 'px');
          card.style.setProperty('--slc-label-pad', size.width * (0.028 / 0.716) + 'px');
          card.style.setProperty('--slc-gap', rowGap + 'px');
          return card;
        },
        geometry: (base) => (ctx, g, s, i, layout) => {
          base(ctx, g, s, i, layout);
          const { size, vertical, cardTop, card } = layout;
          g.tickCount = 4;
          g.length = vertical
            ? Math.max(36, Math.floor(size.height - cardTop - 90))
            : Math.max(36, Math.round(size.width * 0.625));
          g.thumbBox = [
            Math.max(15, Math.round(size.width * 0.0184)),
            card.classList.contains('compact-scales') ? 24 : Math.max(24, Math.round(size.height * 0.144)),
          ];
        },
        placed: (base) => (ctx, layout, controllers) => {
          base(ctx, layout, controllers);
          layout.card.style.left = '0px';
          layout.card.style.top = '0px';
        },
      },
    },
  });
})();
