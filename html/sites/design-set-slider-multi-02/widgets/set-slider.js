// Site design on the shared slider template.
env.widget({
  task: 'set-slider',
  site: 'design-set-slider-multi-02',
  name: 'design',
  split: 'train',
  scenarios: ['multi'],
  template: 'set-slider/classic',
  design: {
    ticks: null, readout: null, native: null, horizontal: false, tickCount: null, rowClass: 'instrument-row',
    parts: {
      begin: () => () => {},
      look: () => (ctx) => {
        const { rng, spec } = ctx;
        return { thumb: rng.int(14, 26), rail: rng.int(4, 10), ticks: rng.bool(0.6),
          readout: rng.bool(0.6) || spec.showValue || spec.scenario === 'match', native: rng.bool(0.3) };
      },
      root: (base) => (ctx, root, i, s, g) => { base(ctx, root, i, s, g); if (g.native) root.classList.add('native-row'); },
      card: () => (ctx, { n }) => ctx.util.el('div', 'slc-card' + (n >= 4 ? ' tight' : ''), ctx.stage),
      group: () => (ctx, { card }) => ctx.util.el('div', 'slc-grid', card),
      geometry: () => (ctx, g, s, i, { size }) => {
        // Keep the sampled calls above intact; the workstation has a fixed visual scale.
        const unit = size.width / 668;
        g.vertical = false;
        g.length = Math.max(90, size.width - 236 * unit);
        g.thumb = 22 * unit;
        g.rail = 20 * unit;
        g.thumbBox = [22 * unit, 36 * unit];
        g.ticks = true;
        g.readout = true;
        g.tickCount = 5;
      },
      beforePlace: () => (ctx, { size, n, group }) => {
        // Fit the actual row contents, including wrapped labels, rather than assuming every
        // row is only as tall as its hit area. Extra OOD rows must remain inside the stage.
        const groupStyle = getComputedStyle(group);
        const fontSize = parseFloat(groupStyle.fontSize);
        const rowPitch = (size.height - (n - 1) * parseFloat(groupStyle.rowGap)) / n;
        const contentHeight = Math.max(...Array.from(group.children, (row) =>
          Math.max(...Array.from(row.children, (child) => child.getBoundingClientRect().height))));
        const paddingScale = Math.max(0, Math.min(1, (rowPitch - contentHeight - 3) / (3.3 * fontSize)));
        if (paddingScale < 1) {
          group.style.setProperty('--instrument-pad-top', (1.1 * fontSize * paddingScale) + 'px');
          group.style.setProperty('--instrument-pad-bottom', (2.2 * fontSize * paddingScale) + 'px');
        }
      },
      native: (base, S) => (ctx, { input, s, index, L, T, center, value, paint }) => {
        const scale = env.taskOf('set-slider').helpers.scale;
        let thumbDrag = null;
        input.addEventListener('pointerdown', (e) => {
          const [cx, cy] = center(value());
          const onThumb = Math.abs(e.clientX - cx) <= T / 2 + 1 && Math.abs(e.clientY - cy) <= T / 2 + 2;
          thumbDrag = onThumb ? { id: e.pointerId, start: e.clientX, offset: e.clientX - cx } : null;
        });
        // Native range dragging rounds its internal thumb position to whole pixels. On release,
        // use the same subpixel geometry as locate(), retaining the user's thumb grab offset.
        // This prevents a small drag near a narrow/logarithmic target from repeatedly stalling.
        input.addEventListener('pointerup', (e) => {
          const drag = thumbDrag;
          thumbDrag = null;
          if (!drag || drag.id !== e.pointerId || Math.abs(e.clientX - drag.start) < 0.01) return;
          const r = input.getBoundingClientRect();
          const f = Math.max(0, Math.min(1, (e.clientX - drag.offset - r.left - T / 2) / L));
          const v = scale.valueAt(s, f);
          paint(v);
          if (v !== value()) S.P.commit(ctx, index, [v]);
        });
        input.addEventListener('pointercancel', () => { thumbDrag = null; });
      },
    },
  },
});
