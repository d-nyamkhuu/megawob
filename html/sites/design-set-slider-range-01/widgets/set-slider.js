// Range design: keeps the fixed scaled look, current-value panel, and range-sized tracks.
env.widget({
  task: 'set-slider',
  site: 'design-set-slider-range-01',
  name: 'design',
  split: 'train',
  scenarios: ['range'],
  template: 'set-slider/classic',
  design: {
    sampleLook: false,
    sampleLength: false,
    clear: true,
    bubble: { cls: 'slc-bubble' },
    parts: {
      look: () => (ctx) => ({
        scale: ctx.size.width / 1180,
        thumb: 40 * ctx.size.width / 1180,
        rail: 12 * ctx.size.width / 1180,
        ticks: true,
        readout: true,
        native: false,
      }),
      renderPlain: (base, S) => (ctx, look) => {
        const { spec, rng, util, size } = ctx;
        const vertical = spec.vertical;
        const n = spec.sliders.length;
        const anyLog = spec.sliders.some((s) => s.log);
        const card = util.el('div', 'slc-card' + (vertical ? ' vertical' : '') + (n >= 4 ? ' tight' : ''), ctx.stage);
        const stopPad = Math.max(0, ...spec.sliders.filter((s) => s.stops)
          .map((s) => Math.max(s.stops[0].length, s.stops[s.stops.length - 1].length) * 4.2 - 30));
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
        const maxV = Math.max(90, Math.min(440, Math.floor(size.height) - 145 - presetsH));
        const room = spec.scenario === 'range'
          ? Math.floor(size.width) - 72 * look.scale
          : Math.floor(size.width) - 120 - 96 - 24 - (look.readout ? 152 : 0);
        const maxH = Math.max(160, Math.min(1107, room));
        const minH = (s) => (s.log ? 440 : s.stops ? Math.max(260, (s.stops.length - 1) * 64) : 320);
        const randLength = (s) => (vertical ? maxV : maxH);
        const shared = randLength(anyLog ? { log: true } : spec.sliders.find((s) => s.stops) || {});

        const panel = util.el('div', 'slc-panel', card);
        const curBox = util.el('div', 'slc-pbox', panel);
        util.el('div', 'slc-plabel', curBox, 'Current values');
        look.readoutEl = util.el('div', 'slc-pval', curBox);
        const helpBox = util.el('div', 'slc-pbox', panel);
        util.el('div', 'slc-plabel', helpBox, 'Handle controls');
        util.el('div', 'slc-pval', helpBox, 'Drag to adjust');
        card.insertBefore(util.el('div', 'slc-head', card), card.firstChild);
        card.firstChild.innerHTML = '<b>Speed range</b><span>Select the portion of the speed range to apply.</span>';
        const group = util.el('div', vertical ? 'slc-row' : 'slc-grid', card);
        card.appendChild(panel);
        if (!vertical && !look.readout) group.style.gridTemplateColumns = 'auto auto';
        if (vertical && n >= 3) group.style.gap = '84px';
        if (!vertical && n >= 4) group.style.rowGap = Math.max(40, Math.min(58, Math.floor((size.height - presetsH - 90) / n) - 40)) + 'px';
        const native = look.native && !vertical;
        const out = spec.sliders.map((s, i) => {
          const g = {
            ...look,
            vertical,
            length: spec.norm ? shared : randLength(s),
            tickCount: rng.pick([4, 5, 10]),
          };
          if (native && s.target !== undefined && !s.stops && (!s.target || s.target.length === 1)) {
            return S.P.makeNative(ctx, group, i, s, g);
          }
          return S.P.makeSlider(ctx, group, i, s, g);
        });
        S.P.placeIn(ctx, card, rng);
        return out;
      },
    },
  },
});
