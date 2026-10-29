// Site design on the shared slider template.
env.widget({
  task: 'set-slider',
  site: 'design-set-slider-range-04',
  name: 'design',
  split: 'train',
  scenarios: ['range'],
  template: 'set-slider/classic',
  design: {
    ticks: true, readout: false, native: false,
    parts: {
      look: (base) => (ctx) => {
        const designScale = Math.min(1, ctx.size.width / 1090);
        return Object.assign(base(ctx), { thumbBox: [28 * designScale, 40 * designScale], rail: 14 * designScale });
      },
      cross: (base) => (ctx, i, s, g) => g.thumbBox ? (g.vertical ? g.thumbBox[0] : g.thumbBox[1]) : base(ctx, i, s, g),
      thumb: () => (ctx, w, t) => { if (w.n === 2 && !w.g.vertical) ctx.util.el('span', 'slc-tag', t); },
      painted: () => (ctx, w, vals) => w.thumbs.forEach((t, j) => {
        const tag = t.firstElementChild;
        if (tag && tag.className === 'slc-tag') tag.textContent = env.taskOf('set-slider').helpers.scale.fmt(w.s, vals[j]);
      }),
      beforeGroup: () => (ctx, { vertical, n, card }) => {
        const { util, spec } = ctx;
        // Design: table of current values above the track, status box below; track spans the workspace.
        const isRange = !vertical && n === 1 && ctx.model.values[0].length === 2;
        const S0 = env.taskOf('set-slider').helpers.scale;
        if (isRange) {
          const s0 = spec.sliders[0];
          const sys = util.el('div', 'slc-sys', card);
          util.el('h3', '', sys, 'System Parameter');
          const tbl = util.el('table', '', sys);
          const rows = [['Parameter', s0.label], ['Allowed range', `${S0.fmt(s0, s0.min)} – ${S0.fmt(s0, s0.max)}`], ['Current lower value', ''], ['Current upper value', '']];
          const cells = rows.map(([k, v]) => { const tr = util.el('tr', '', tbl); util.el('th', '', tr, k); return util.el('td', '', tr, v); });
          card.__info = { cells, s0 };
        }
      },
      geometry: () => (ctx, g, s, i, { size }) => { g.length = Math.max(300, Math.floor(size.width) - 86); g.tickCount = 10; },
      placed: () => (ctx, { card }, out) => {
        const { util } = ctx;
        const S0 = env.taskOf('set-slider').helpers.scale;
        let paintInfo;
        if (card.__info) {
          const { cells, s0 } = card.__info;
          const box = util.el('div', 'slc-status', card);
          const left = util.el('div', '', box);
          util.el('div', '', left, 'Drag the handles to adjust the lower and upper values.');
          util.el('div', '', left, 'Current values update as you drag the handles.');
          const right = util.el('div', 'slc-summary', box);
          util.el('div', '', right, 'Slider settings');
          const cur = util.el('div', 'slc-cur', right);
          paintInfo = () => {
            const v = ctx.model.values[0];
            cells[2].textContent = S0.fmt(s0, v[0]);
            cells[3].textContent = S0.fmt(s0, v[1]);
            cur.textContent = `Current:  ${S0.fmt(s0, v[0])} and ${S0.fmt(s0, v[1])}`;
          };
          paintInfo();
          const upd = ctx.update;
          ctx.update = (m) => { upd(m); paintInfo(); };
          out.paintTime = paintInfo;
        }
      },
    },
  },
});
