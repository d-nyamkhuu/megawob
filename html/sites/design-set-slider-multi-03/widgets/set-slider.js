// Multi-slider console design: fixed horizontal controls, control list, and studio label icons.
env.widget({
  task: 'set-slider',
  site: 'design-set-slider-multi-03',
  name: 'design',
  split: 'train',
  scenarios: ['multi'],
  template: 'set-slider/classic',
  design: {
    parts: {
      label: (base) => (ctx, root, index, s) => {
        const lab = ctx.util.el('div', 'slc-label', root);
        if (window.__studioIcon) window.__studioIcon(lab, index % 3);
        ctx.util.el('span', '', lab, s.label);
      },
      renderPlain: (base, S) => (ctx, look) => {
        const { spec, rng, util, size } = ctx;
        const vertical = false;
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
        const randLength = (s) => spec.vertical ? rng.int(240, maxV) : rng.int(Math.min(minH(s), maxH), Math.max(minH(s), maxH));
        const shared = randLength(anyLog ? { log: true } : spec.sliders.find((s) => s.stops) || {});
        const group = util.el('div', vertical ? 'slc-row' : 'slc-grid', card);
        if (!vertical && !look.readout) group.style.gridTemplateColumns = 'auto auto';
        if (vertical && n >= 3) group.style.gap = '84px';
        if (!vertical && n >= 4) group.style.rowGap = Math.max(40, Math.min(58, Math.floor((size.height - presetsH - 90) / n) - 40)) + 'px';

        look.ticks = true;
        look.readout = !!spec.showValue;
        look.native = false;
        look.thumb = Math.max(24, Math.min(38, Math.round(size.width * 0.032)));
        look.rail = Math.max(10, Math.round(look.thumb * 0.5));
        const rowHeight = Math.min(size.height / n, size.height * 0.303);
        group.style.gridAutoRows = rowHeight + 'px';
        group.style.rowGap = '0px';
        group.style.paddingTop = '0px';
        const designL = Math.max(240, Math.floor(size.width * 0.73));
        if (spec.showValue) card.classList.add('show-values');
        const progress = document.querySelector('.progress');
        if (progress) {
          progress.replaceChildren();
          spec.sliders.forEach((s) => {
            const li = util.el('li', '', progress);
            util.el('span', 'ring', li);
            util.el('span', '', li, s.label);
          });
        }
        const out = spec.sliders.map((s, i) => {
          const g = {
            ...look,
            vertical,
            length: (spec.norm ? shared : randLength(s)) && designL,
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
