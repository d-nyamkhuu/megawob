// Design on templates/pick-color/picker.js.
env.widget({
  task: 'pick-color',
  site: 'design-pick-color-hex-04',
  name: 'design',
  split: 'train',
  scenarios: ['hex'],
  traits: { controls: 'sv+hue' },
  template: 'pick-color/picker',
  design: {
    css: '', unitHeight: null, resetEvent: null,
    svStyle: {}, hueStyle: {}, knobStyle: {}, sideRows: 'none', editableRows: false,
    currentClass: 'np-current',
    resetSelector: '.reset', resetScope: 'shell',
    parts: {
      markers: (base, S) => (ctx, knob, hue, m, g) => {
        base(ctx, knob, hue, m, g);
        const color = S.math.hex(S.math.modelRgb(m));
        knob.style.background = color;
        hue.bar.style.background = color;
      },
      sideLayout: (base, S) => (ctx, card) => {
        const { util, rng } = ctx, st = S.st;
        const sideW = rng.int(160, 190);
        const { maxH, maxW } = S.P.limits(ctx, sideW);
        rng.bool(.25);
        const mk = (title, cls) => {
          const p = util.el('section', 'np-panel ' + cls, card);
          const h = util.el('div', 'np-head', p);
          util.el('span', '', h, title);
          util.el('i', 'np-min', h);
          return util.el('div', 'np-body', p);
        };
        const leftBody = mk('Color Picker', 'np-left');
        const rightBody = mk('Target Color', 'np-right');
        st.controls = S.P.picker(ctx, leftBody, 0, 0);
        st.side = S.P.side(ctx, leftBody, 0, rightBody);
      },
      target: (base, S) => (ctx, side, targetHost) => {
        const { util, spec } = ctx;
        const showTarget = spec.scenario === 'swatch';
        if (!showTarget && !spec.showCode) return;
        const t = util.el('div', 'np-target', targetHost || side);
        if (showTarget) {
          util.el('div', 'cp-label', t, spec.targetLabel);
          util.el('div', 'cp-swatch', t).style.background = spec.hex;
        } else {
          const trgb = S.math.fromHex(spec.hex || spec.code);
          const th = S.math.rgbToHsv(trgb);
          const big = util.el('div', 'np-bigswatch', t);
          big.style.background = spec.hex || spec.code;
          const vals = util.el('div', 'np-vals', t);
          const row = (k, txt, cls) => {
            const r = util.el('div', 'np-row' + (cls ? ' ' + cls : ''), vals);
            util.el('span', 'np-k', r, k);
            return util.el('span', 'np-v', r, txt);
          };
          row(/^#/.test(spec.code) ? 'Hex:' : 'Code:', spec.code, 'cp-code');
          row('R:', String(Math.round(trgb[0])));
          row('G:', String(Math.round(trgb[1])));
          row('B:', String(Math.round(trgb[2])));
          util.el('div', 'np-sep', vals);
          row('H:', Math.round(th.h) + '°');
          row('S:', Math.round(th.s * 100) + '%');
          row('V:', Math.round(th.v * 100) + '%');
        }
      },
      readout: () => (ctx, view) => {
        const { util, rng } = ctx, cur = view.cur, fieldMode = ctx.spec.fields;
        const rows = {};
        let readout = null;
        if (!fieldMode && (ctx.spec.scenario === 'hex' || rng.bool(0.5))) {
          readout = util.el('div', 'np-vals', cur);
          const row = (k, key) => {
            const r = util.el('div', 'np-row', readout);
            util.el('span', 'np-k', r, k);
            rows[key] = util.el('span', 'np-v', r, '');
          };
          row('Hex:', 'hex');
          row('R:', 'r'); row('G:', 'g'); row('B:', 'b');
          util.el('div', 'np-sep', readout);
          row('H:', 'h'); row('S:', 's'); row('V:', 'v');
        }
        return { el: readout, paint(m, rgb) {
          const code = env.taskDef.helpers.math.hex(rgb);
          if (readout) {
            rows.hex.textContent = code;
            rows.r.textContent = String(Math.round(rgb[0]));
            rows.g.textContent = String(Math.round(rgb[1]));
            rows.b.textContent = String(Math.round(rgb[2]));
            rows.h.textContent = Math.round(m.h) % 360 + '°';
            rows.s.textContent = Math.round(m.s * 100) + '%';
            rows.v.textContent = Math.round(m.v * 100) + '%';
          }
        } };
      },
    },
  },
});
