// Swiss multi-slider design: measured row layouts, compact spacing, and midpoint ticks.
(function () {
  let labelWidth = 0;
  let labelHeight = 0;

  env.widget({
    task: 'set-slider',
    site: 'design-set-slider-multi-12',
    name: 'design',
    split: 'train',
    scenarios: ['multi'],
    template: 'set-slider/classic',
    design: {
      // The original samples these at page level and chooses orientation from the episode.
      ticks: null,
      readout: null,
      native: null,
      horizontal: false,
      tickCount: null,
      parts: {
        look: (base, S) => (ctx) => {
          const { rng, spec } = ctx;
          const look = {
            thumb: rng.int(14, 26),
            rail: rng.int(4, 10),
            ticks: rng.bool(0.6),
            readout: rng.bool(0.6) || spec.showValue || spec.scenario === 'match',
            native: rng.bool(0.3),
          };
          for (const key of ['thumb', 'rail', 'ticks', 'readout', 'native', 'thumbBox']) {
            if (S.D[key] !== null) look[key] = key === 'readout' && S.D[key] === 'shown' ? !!spec.showValue : S.D[key];
          }
          return look;
        },
        beforeGroup: () => () => {
          labelWidth = 0;
          labelHeight = 0;
        },
        minorTicks: (base, S) => (ctx, w, ticks) => {
          if (w.g.vertical || w.s.log || w.s.stops) return;
          const major = S.P.tickValues(w.s, env.taskOf('set-slider').helpers.scale, w.g.tickCount, w.L, false);
          for (let j = 1; j < major.length; j++) {
            const tick = ctx.util.el('div', 'slc-tick slc-minor', ticks);
            tick.style.left = ((w.frac(major[j - 1]) + w.frac(major[j])) * w.L) / 2 + 'px';
          }
        },
        geometry: (base) => (ctx, g, s, i, layout) => {
          const { size, vertical, group, look, n } = layout;
          if (!labelWidth || !labelHeight) {
            const measure = ctx.util.el('div', 'slc-label', group);
            Object.assign(measure.style, { position: 'absolute', visibility: 'hidden', width: 'max-content' });
            for (const slider of ctx.spec.sliders) {
              measure.textContent = slider.label;
              labelWidth = Math.max(labelWidth, measure.offsetWidth);
              labelHeight = Math.max(labelHeight, measure.offsetHeight);
            }
            measure.remove();
          }

          const columnGap = Math.max(12, size.width * 0.016);
          const native = look.native && !vertical;
          const trackRoom = size.width * 0.955 - labelWidth - columnGap - 24 -
            (look.readout ? 128 + columnGap : 0) - (native ? look.thumb : 0);
          g.ticks = true;
          if (!vertical) {
            g.length = Math.floor(Math.min(size.width * (look.readout ? 0.56 : 0.72), trackRoom));
            g.thumbBox = [Math.max(12, size.width * 0.02), Math.max(24, size.height * 0.084)];
            g.rail = Math.max(8, size.width * 0.012);
          } else {
            g.length = Math.min(g.length, Math.floor(size.height - labelHeight - (look.readout ? 68 : 38) - 24));
          }
        },
        placed: () => (ctx, layout, controllers) => {
          const { size, vertical, n, look, card, group } = layout;
          if (!vertical) {
            const rowHeight = Math.max(
              labelHeight,
              ...controllers.map((slider) => slider.anchor.offsetHeight),
              ...[...group.querySelectorAll('.slc-readout')].map((el) => el.offsetHeight),
            );
            const desiredGap = Math.max(26, Math.min(98, size.height * 0.31 - 36, (size.height * 0.93) / n - 36));
            const compact = size.height * 0.125 + n * rowHeight + (n - 1) * desiredGap + 28 > size.height;
            const top = compact ? 12 : size.height * 0.125;
            const gap = Math.max(0, Math.min(desiredGap,
              (size.height - top - (compact ? 20 : 28) - n * rowHeight) / Math.max(1, n - 1)));
            card.classList.toggle('compact', compact);
            card.style.left = '4%';
            card.style.top = top + 'px';
            group.style.gridTemplateColumns = look.readout ? 'auto auto auto' : 'auto auto';
            group.style.columnGap = Math.max(12, size.width * 0.016) + 'px';
            group.style.rowGap = Math.floor(gap) + 'px';
          } else {
            card.style.left = '12px';
            card.style.top = '12px';
            const columnWidth = Math.max(labelWidth, look.readout ? 128 : 96);
            group.style.gap = Math.max(0, Math.min(84, (size.width - 24 - n * columnWidth) / Math.max(1, n - 1))) + 'px';
          }
        },
      },
    },
  });
})();
