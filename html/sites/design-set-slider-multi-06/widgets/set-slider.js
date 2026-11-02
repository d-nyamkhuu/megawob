// Multi-slider stationery design with the original sizing routine and fine horizontal minor ticks.
env.widget({
  task: 'set-slider',
  site: 'design-set-slider-multi-06',
  name: 'design',
  split: 'train',
  scenarios: ['multi'],
  template: 'set-slider/classic',
  design: {
    ticks: true,
    readout: 'shown',
    native: false,
    horizontal: false,
    seededOrientation: true,
    minor: { count: 40 },
    parts: {
      look: (base) => (ctx) => Object.assign(base(ctx), {
        thumb: 36, thumbBox: [26, 36], rail: 12, ticks: true,
        native: false, readout: !!ctx.spec.showValue,
      }),
      label: (base) => (ctx, root, index, s) => {
        const label = base(ctx, root, index, s);
        if (!ctx.spec.vertical && s.label.length > 9) label.style.fontSize = 'clamp(14px,1.6vw,27px)';
        return label;
      },
      renderPlain: (base, S) => (ctx, look) => {
        const { spec, rng, util, size } = ctx;
        const vertical = spec.vertical;
        const n = spec.sliders.length;
        const anyLog = spec.sliders.some((s) => s.log);
        const card = util.el('div', 'slc-card' + (vertical ? ' vertical' : '') + (n >= 4 ? ' tight' : ''), ctx.stage);
        const stopPad = Math.max(0, ...spec.sliders.filter((s) => s.stops).map((s) => Math.max(s.stops[0].length, s.stops[s.stops.length - 1].length) * 4.2 - 30));
        if (stopPad && !vertical) card.style.paddingRight = card.style.paddingLeft = 40 + Math.ceil(stopPad) + 'px';
        if (spec.presets) {
          const box = util.el('div', 'slc-presets', card);
          box.dataset.role = 'presets';
          const table = util.el('table', '', box);
          util.el('caption', '', table, rng.pick(['Presets', 'Saved presets', 'Profiles', 'Scenes']));
          const head = util.el('tr', '', table);
          util.el('th', '', head, 'Preset');
          for (const s of spec.sliders) util.el('th', '', head, s.label);
          for (const p of spec.presets) {
            const tr = util.el('tr', '', table);
            util.el('td', '', tr, p.name);
            p.values.forEach((v, i) => util.el('td', '', tr, env.taskOf('set-slider').helpers.scale.fmtU(spec.sliders[i], v)));
          }
        }
        const presetsH = spec.presets ? 40 + 26 * (spec.presets.length + 1) : 0;
        const maxV = Math.max(240, Math.min(440, Math.floor(size.height) - 200 - presetsH));
        const room = Math.floor(size.width) - 120 - 96 - 24 - (look.readout ? 152 : 0);
        const maxH = Math.max(320, Math.min(820, room));
        const minH = (s) => (s.log ? 440 : s.stops ? Math.max(260, (s.stops.length - 1) * 64) : 320);
        const randLength = (s) => (vertical ? rng.int(240, maxV) : rng.int(Math.min(minH(s), maxH), Math.max(minH(s), maxH)));
        const shared = randLength(anyLog ? { log: true } : spec.sliders.find((s) => s.stops) || {});
        const group = util.el('div', vertical ? 'slc-row' : 'slc-grid', card);
        if (!vertical && look.readout) group.style.gridTemplateColumns = 'clamp(94px,9.25vw,155px) minmax(0,1fr) 80px';
        if (vertical && n >= 3) group.style.gap = Math.max(12, Math.min(84, (size.width - n * 125) / (n - 1))) + 'px';
        if (!vertical && n >= 4) group.style.rowGap = Math.max(8, Math.min(24, Math.floor((size.height - presetsH - 90) / n) - 80)) + 'px';
        let compactCross = null;
        if (!vertical) {
          const gap = parseFloat(getComputedStyle(group).rowGap) || 0;
          if ((size.height - gap * (n - 1)) / n < 102) {
            const compactGap = Math.max(0, Math.min(gap, (size.height - n * 76) / Math.max(1, n - 1)));
            const rowHeight = (size.height - compactGap * (n - 1)) / n;
            compactCross = Math.max(24, Math.min(48, rowHeight - 28));
            group.classList.add('compact');
            group.style.rowGap = compactGap + 'px';
            group.style.setProperty('--compact-ticks', (compactCross + 9) + 'px');
            group.style.setProperty('--compact-font', Math.max(10, Math.min(18, rowHeight - compactCross - 12)) + 'px');
          }
        }
        const labelWidth = vertical ? 0 : parseFloat(getComputedStyle(group).gridTemplateColumns);
        const out = spec.sliders.map((s, i) => {
          const g = {
            ...look,
            ...(compactCross === null ? {} : { cross: compactCross, thumbBox: [26, Math.min(36, compactCross - 8)] }),
            vertical,
            length: vertical
              ? Math.max(80, Math.min(spec.norm ? shared : randLength(s), size.height - 115))
              : (spec.norm ? shared : randLength(s), Math.max(120, Math.floor(size.width) - labelWidth - 46 - (look.readout ? 80 : 0))),
            tickCount: rng.pick([4, 5, 10]),
          };
          return S.P.makeSlider(ctx, group, i, s, g);
        });
        S.P.placeIn(ctx, card, rng);
        card.style.left = '0px';
        card.style.top = '0px';
        return out;
      },
    },
  },
});
