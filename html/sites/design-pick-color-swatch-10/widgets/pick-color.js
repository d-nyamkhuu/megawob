// Keeps the positioned HSV/RGB fields and inspector mirrors around the shared picker.
env.widget({
  task: 'pick-color',
  site: 'design-pick-color-swatch-10',
  name: 'design',
  split: 'train',
  scenarios: ['swatch'],
  traits: { controls: 'sv+hue' },
  template: 'pick-color/picker',
  design: {
    axes: false,
    parts: {
      fit: (base, S) => (ctx, card) => {
        const bounds = card.getBoundingClientRect();
        const W = Math.max(S.task.helpers.MIN_TRACK_PX, Math.floor(Math.min(bounds.width * 0.453, bounds.height * 0.916)));
        const H = Math.round(W * 0.976);
        return {
          W,
          H,
          hueH: H,
          hueW: Math.max(18, Math.round(W * 0.123)),
          radius: 0,
          knob: Math.max(18, Math.round(W * 0.078)),
          bounds,
        };
      },
      hit: () => (ctx, el, kind, g) => {
        if (kind === 'sv') Object.assign(el.style, { left: '3.3%', top: '6.2%' });
        if (kind === 'hue') el.style.left = `calc(3.3% + ${Math.round(g.W * 1.062)}px)`;
      },
      controlsPaint: (base, S) => (ctx, model) => {
        const rgb = S.math.channels(model).map((x) => Math.round(x));
        const values = {
          H: Math.round(model.h),
          S: Math.round(model.s * 100),
          V: Math.round(model.v * 100),
          R: rgb[0],
          G: rgb[1],
          B: rgb[2],
        };
        for (const [key, value] of Object.entries(values)) {
          const field = document.querySelector(`[data-color-field="${key}"]`);
          if (field) field.textContent = String(value);
          const row = document.querySelector(`[data-role="insp-${key.toLowerCase()}"]`);
          if (row) row.textContent = String(value);
        }
      },
      layout: (base, S) => (ctx, card) => {
        const { util, spec } = ctx;
        const st = S.st;
        const makePanel = (label, cls, role) => {
          const panel = util.el('section', `cp-top ${cls}`, card);
          util.el('div', 'cp-name', panel, label);
          const swatch = util.el('div', 'cp-swatch', panel);
          return { panel, swatch, insp: document.querySelector(`[data-role="${role}"]`) };
        };
        const target = makePanel(spec.targetLabel, 't', 'insp-target');
        const current = makePanel('Current', 'c', 'insp-current');
        const middle = util.el('section', 'picker-box', card);
        const controlHost = util.el('div', 'picker-controls', middle);
        for (const [key, top] of [['H', 12.4], ['S', 26.1], ['V', 39.6], ['R', 60.2], ['G', 73.9], ['B', 87.6]]) {
          const row = util.el('div', 'fld', controlHost);
          row.style.top = top + '%';
          util.el('span', 'lab', row, key + ':');
          const field = util.el('span', 'box', row);
          field.dataset.colorField = key;
          util.el('span', 'spin', row);
        }
        util.el('div', 'fld-rule', controlHost);
        target.swatch.style.background = S.math.hex(spec.rgb);
        if (target.insp) target.insp.style.background = S.math.hex(spec.rgb);
        st.controls = S.P.picker(ctx, controlHost, ctx.size.height, ctx.size.width);
        st.side = {
          anchors: [target.swatch, current.swatch],
          locators: {},
          paint(model) {
            const rgb = S.math.modelRgb(model);
            const code = S.math.hex(rgb);
            current.swatch.style.background = code;
            if (current.insp) current.insp.style.background = code;
            const hex = document.querySelector('[data-role="insp-hex"]');
            if (hex) hex.textContent = code.toUpperCase();
            const delta = document.querySelector('[data-role="color-difference"]');
            if (delta) delta.textContent = S.task.error(model, spec).toFixed(1);
          },
        };
      },
    },
  },
});
